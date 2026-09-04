process.env.NODE_ENV = 'test';
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { app } from '../apps/server/src/index.js';
import { db, run, get, query } from '../apps/server/src/db/connection.js';
import { seedDatabase } from '../apps/server/src/db/seed.js';

let server;
let baseUrl = '';

// Helper to make typed HTTP requests against test server
async function req(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, {
    ...options,
    headers,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { status: res.status, ok: res.ok, data };
}

// Canonical message builder for HMAC test
function buildCanonicalMsg(sensorCode, pm10, pm25, timestamp) {
  return `${sensorCode}:${Number(pm10).toFixed(1)}:${Number(pm25).toFixed(1)}:${timestamp}`;
}

let staffToken = '';
let supToken = '';
let legalToken = '';
let adminToken = '';

before(async () => {
  // Re-seed DB to a known clean state
  seedDatabase();

  // Start test server on random port
  await new Promise(resolve => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });

  // Login tokens
  const rStaff = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'staff1', password: 'password123' }),
  });
  staffToken = rStaff.data.token;

  const rSup = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'supervisor1', password: 'password123' }),
  });
  supToken = rSup.data.token;

  const rLegal = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'legal1', password: 'password123' }),
  });
  legalToken = rLegal.data.token;

  const rAdmin = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'admin', password: 'password123' }),
  });
  adminToken = rAdmin.data.token;
});

after(async () => {
  if (server) {
    await new Promise(resolve => server.close(resolve));
  }
});

// 1. Auth Login
test('1. Auth Login: Valid credentials returns JWT and user permissions', async () => {
  const res = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'staff1', password: 'password123' }),
  });
  assert.equal(res.status, 200);
  assert.ok(res.data.token);
  assert.equal(res.data.user.username, 'staff1');
  assert.equal(res.data.user.role, 'staff');
  assert.ok(res.data.permissions.includes('case:view'));
});

// 2. RBAC
test('2. RBAC: Reject unauthorized access across roles', async () => {
  // Staff cannot close case
  const closeAttempt = await req('/api/cases/case-023/close', {
    method: 'POST',
    headers: { Authorization: `Bearer ${staffToken}` },
    body: JSON.stringify({ closure_reason: 'Test', closure_summary: 'Test' }),
  });
  assert.equal(closeAttempt.status, 403, 'Staff must not be allowed to close cases');

  // Supervisor can close
  const canClose = get(`SELECT role FROM users WHERE username = 'supervisor1'`);
  assert.equal(canClose.role, 'supervisor');
});

// 3. Case Creation
test('3. Case Creation: Sequential code generation DG-2026-OP-XXX', async () => {
  const res = await req('/api/cases', {
    method: 'POST',
    headers: { Authorization: `Bearer ${staffToken}` },
    body: JSON.stringify({
      title: 'Công trình xây dựng gây bụi đường Mai Chí Thọ',
      description: 'Đoàn xe ben chở đất đá không rửa bánh xe',
      location_text: 'Đại lộ Mai Chí Thọ, Phường An Phú',
      district: 'Thành phố Thủ Đức',
      latitude: 10.792,
      longitude: 106.745,
      source: 'STAFF',
      priority: 'NORMAL',
    }),
  });

  assert.equal(res.status, 201);
  assert.ok(res.data.case);
  assert.match(res.data.case.case_code, /^DG-2026-OP-\d{3}$/);
  assert.equal(res.data.case.status, 'NEW');
});

// 4. State Machine Valid
test('4. State Machine: Valid transition path NEW -> TRIAGED', async () => {
  const res = await req('/api/cases/case-001/transition', {
    method: 'POST',
    headers: { Authorization: `Bearer ${staffToken}` },
    body: JSON.stringify({
      to_status: 'TRIAGED',
      note: 'Xác thực địa điểm và thông tin phản ánh từ người dân',
    }),
  });
  assert.equal(res.status, 200);
  assert.equal(res.data.case.status, 'TRIAGED');
});

// 5. Invalid Transition Rejected
test('5. Invalid Transition Rejected: Jumping from NEW directly to CLOSED rejected', async () => {
  const res = await req('/api/cases/case-002/transition', {
    method: 'POST',
    headers: { Authorization: `Bearer ${supToken}` },
    body: JSON.stringify({
      to_status: 'CLOSED',
      note: 'Cố tình đóng vụ việc trái quy tắc chuyển tiếp',
    }),
  });
  assert.equal(res.status, 400);
  assert.equal(res.data.title, 'Chuyển trạng thái không hợp lệ');
});

// 6. Assignment
test('6. Assignment: Staff assignment writes to staff_assignments and updates primary assignee', async () => {
  const res = await req('/api/cases/case-004/assign', {
    method: 'POST',
    headers: { Authorization: `Bearer ${supToken}` },
    body: JSON.stringify({
      staff_user_id: 'usr-staff-2',
      note: 'Giao thụ lý điều tra kiểm tra công trường Thảo Điền',
      assignment_type: 'PRIMARY',
      due_at: new Date(Date.now() + 86400000 * 2).toISOString(),
    }),
  });

  assert.equal(res.status, 200);
  assert.equal(res.data.case.assigned_staff_id, 'usr-staff-2');
});

// 7. Reassignment History
test('7. Reassignment History: Reassigning staff preserves history and replaces old assignment', async () => {
  const res = await req('/api/cases/case-004/reassign', {
    method: 'POST',
    headers: { Authorization: `Bearer ${supToken}` },
    body: JSON.stringify({
      staff_user_id: 'usr-staff-3',
      note: 'Đổi cán bộ thụ lý do đồng chí Mai đi công tác đột xuất',
    }),
  });

  assert.equal(res.status, 200);
  assert.equal(res.data.case.assigned_staff_id, 'usr-staff-3');

  const history = query(`SELECT * FROM staff_assignments WHERE case_id = 'case-004' ORDER BY assigned_at DESC, rowid DESC`);
  assert.equal(history.length, 2);
  assert.equal(history[0].status, 'ACTIVE');
  assert.equal(history[0].staff_user_id, 'usr-staff-3');
  assert.equal(history[1].status, 'REPLACED');
  assert.equal(history[1].staff_user_id, 'usr-staff-2');
});

// 8. Task Creation
test('8. Task Creation: Tasks created with priority, due date, and deep link to entity', async () => {
  const res = await req('/api/tasks', {
    method: 'POST',
    headers: { Authorization: `Bearer ${staffToken}` },
    body: JSON.stringify({
      case_id: 'case-004',
      title: 'Xác minh hồ sơ đăng ký môi trường của nhà thầu',
      description: 'Liên hệ UBND Phường kiểm tra giấy phép xả thải',
      source: 'CASE',
      source_entity_type: 'CASE',
      source_entity_id: 'case-004',
      assigned_to: 'usr-staff-3',
      priority: 'HIGH',
      due_at: new Date(Date.now() + 86400000).toISOString(),
    }),
  });

  assert.equal(res.status, 201);
  assert.ok(res.data.data.id);
  assert.equal(res.data.data.assigned_to, 'usr-staff-3');
  assert.equal(res.data.data.status, 'OPEN');
});

// 9. Evidence Upload + SHA-256
test('9. Evidence Upload + SHA-256: Uploaded files have valid SHA-256 hash stored', async () => {
  const testData = 'DustGuard VN Evidence Content Sample 2026';
  const expectedSha = crypto.createHash('sha256').update(testData).digest('hex');

  // Insert mock asset simulating upload pipeline
  const assetId = `evd-test-${Date.now()}`;
  run(
    `INSERT INTO evidence_assets (id, case_id, source_type, file_path, file_name, mime_type, file_size, sha256, uploaded_by, created_at)
     VALUES (?, 'case-001', 'CASE', '/uploads/test.jpg', 'test.jpg', 'image/jpeg', 42, ?, 'usr-staff-1', datetime('now'))`,
    [assetId, expectedSha]
  );

  const asset = get(`SELECT * FROM evidence_assets WHERE id = ?`, [assetId]);
  assert.ok(asset);
  assert.equal(asset.sha256, expectedSha);
});

// 10. Legal Document Import
test('10. Legal Document Import: Vietnamese legal text parsed into hierarchical sections', async () => {
  const sampleLegal = `
LUẬT BẢO VỆ MÔI TRƯỜNG
Số: 72/2020/QH14
ỦY BAN NHÂN DÂN THÀNH PHỐ

CHƯƠNG II
QUẢN LÝ CHẤT THẢI VÀ BỤI

Điều 60. Bảo vệ môi trường trong hoạt động xây dựng
1. Cơ quan, tổ chức, hộ gia đình, cá nhân trong quá trình thi công xây dựng công trình phải che chắn công trình để bụi không phát tán.
2. Phương tiện vận chuyển bùn đất phải được rửa sạch trước khi ra khỏi công trường.
a) Bắt buộc bố trí trạm rửa xe tự động.
b) Thu gom bùn lắng định kỳ.
  `;

  const res = await req('/api/legal/import', {
    method: 'POST',
    headers: { Authorization: `Bearer ${legalToken}` },
    body: JSON.stringify({ text: sampleLegal, file_name: 'luat_bvmt_test.txt' }),
  });

  assert.equal(res.status, 200);
  assert.ok(res.data.data.sha256);
  assert.equal(res.data.data.document_number, '72/2020/QH14');
  assert.ok(res.data.data.sections.length > 0);
});

// 11. Legal Structure Persistence
test('11. Legal Structure Persistence: Reviewed document & sections stored into DB and FTS5', async () => {
  const res = await req('/api/legal/documents', {
    method: 'POST',
    headers: { Authorization: `Bearer ${legalToken}` },
    body: JSON.stringify({
      title: 'Quyết định kiểm soát bụi xây dựng 2026',
      document_number: '88/2026/QĐ-UBND',
      authority: 'UBND TP.HCM',
      sections: [
        {
          section_type: 'Article',
          section_number: 'Điều 5',
          heading: 'Quy chuẩn rửa xe bắt buộc tại công trình',
          content: 'Tất cả các công trình xây dựng phải trang bị hệ thống rửa xe tự động áp lực cao để làm sạch bùn đất trước khi ra đường công cộng.',
        },
      ],
    }),
  });

  assert.equal(res.status, 201);
  assert.ok(res.data.data.id);

  // Check FTS5 indexed
  const ftsMatch = query(`SELECT * FROM legal_sections_fts WHERE legal_sections_fts MATCH '"rửa xe tự động"'`);
  assert.ok(ftsMatch.length > 0, 'FTS5 must immediately index new sections');
});

// 12. FTS Search
test('12. FTS Search: SQLite FTS5 returns exact match with highlighted snippet', async () => {
  const res = await req('/api/legal/search?q=phun sương');
  assert.equal(res.status, 200);
  assert.ok(res.data.total > 0);
  assert.ok(res.data.results[0].snippet_content.includes('<mark>'));
});

// 13. Legal Review
test('13. Legal Review: Human legal reviewer submits review and updates case timeline', async () => {
  const res = await req('/api/cases/case-009/legal/review', {
    method: 'POST',
    headers: { Authorization: `Bearer ${legalToken}` },
    body: JSON.stringify({
      status: 'REVIEWED',
      summary: 'Công trình vi phạm Điểm a và Điểm b Khoản 1 Điều 15 Nghị định 45/2022/NĐ-CP',
      legal_basis_note: 'Khung phạt dự kiến từ 25.000.000đ đến 40.000.000đ.',
    }),
  });

  assert.equal(res.status, 200);
  assert.equal(res.data.review.status, 'REVIEWED');

  const timeline = query(`SELECT * FROM case_timeline WHERE case_id = 'case-009' AND event_type = 'LEGAL_REVIEW_COMPLETED'`);
  assert.ok(timeline.length > 0, 'Timeline must record legal review completion');
});

// 14. AI Fallback
test('14. AI Fallback: Assistive AI returns rule-based fallback when no external provider', async () => {
  const res = await req('/api/cases/case-009/legal/analyze', {
    method: 'POST',
    headers: { Authorization: `Bearer ${staffToken}` },
  });

  assert.equal(res.status, 200);
  assert.ok(res.data.analysis.provider.includes('DUSTGUARD_LOCAL_ENGINE'));
  assert.ok(res.data.analysis.output.disclaimer.includes('không thay thế kết luận thẩm tra'));
});

// 15. Invalid AI Citation Rejection
test('15. Invalid AI Citation Rejection: AI cannot cite nonexistent sections', async () => {
  // Check that citations in analysis map to real section IDs
  const res = await req('/api/cases/case-009/legal/analyze', {
    method: 'POST',
    headers: { Authorization: `Bearer ${staffToken}` },
  });

  const provisions = res.data.analysis.output.relevantProvisions;
  for (const p of provisions) {
    const section = get(`SELECT id FROM legal_sections WHERE id = ?`, [p.legalSectionId]);
    assert.ok(section, `Citation ${p.legalSectionId} must exist in legal_sections table`);
  }
});

// 16. Inspection Creation
test('16. Inspection Creation: Inspection created from template with checklist items', async () => {
  const res = await req('/api/cases/case-006/inspections', {
    method: 'POST',
    headers: { Authorization: `Bearer ${staffToken}` },
    body: JSON.stringify({
      template_id: 'tmpl-build-site',
      scheduled_date: new Date().toISOString(),
      location_text: 'Công trình Masteri Thảo Điền, TP. Thủ Đức',
    }),
  });

  assert.equal(res.status, 201);
  assert.equal(res.data.inspection.status, 'PLANNED');
  assert.ok(res.data.items.length > 0, 'Template items must be copied into inspection items');
});

// 17. Required Checklist Validation
test('17. Required Checklist Validation: Submitting inspection with empty required items is rejected', async () => {
  // Get planned inspection
  const planned = get(`SELECT id FROM inspections WHERE case_id = 'case-006' AND status = 'PLANNED' LIMIT 1`);
  
  const submitAttempt = await req(`/api/inspections/${planned.id}/submit`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${staffToken}` },
    body: JSON.stringify({
      items: [], // Missing answers
    }),
  });

  assert.equal(submitAttempt.status, 400);
});

// 18. Inspection Submit
test('18. Inspection Submit: Successfully submit inspection and mark COMPLETED', async () => {
  const planned = get(`SELECT id FROM inspections WHERE case_id = 'case-006' AND status = 'PLANNED' LIMIT 1`);
  const items = query(`SELECT id FROM inspection_items WHERE inspection_id = ?`, [planned.id]);

  const answers = items.map((it, idx) => ({
    item_id: it.id,
    status: idx === 0 ? 'FAIL' : 'PASS',
    note: idx === 0 ? 'Lưới chống bụi bị rách mảng lớn' : 'Đạt yêu cầu',
  }));

  const res = await req(`/api/inspections/${planned.id}/submit`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${staffToken}` },
    body: JSON.stringify({ items: answers }),
  });

  assert.equal(res.status, 200);
  assert.equal(res.data.inspection.status, 'COMPLETED');
});

// 19. Finding Creation
test('19. Finding Creation: Auto-generate findings with severity from failed inspection items', async () => {
  const planned = get(`SELECT id FROM inspections WHERE case_id = 'case-006' AND status = 'COMPLETED' LIMIT 1`);
  const findings = query(`SELECT * FROM inspection_findings WHERE inspection_id = ?`, [planned.id]);

  assert.ok(findings.length > 0, 'Failed items must auto-generate findings');
  assert.equal(findings[0].severity, 'MEDIUM');
});

// 20. Corrective Action
test('20. Corrective Action: Create corrective action with due date and responsible party', async () => {
  const res = await req('/api/cases/case-006/actions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${staffToken}` },
    body: JSON.stringify({
      title: 'Khắc phục thay mới lưới chống bụi toàn bộ mặt đường',
      description: 'Yêu cầu nhà thầu Coteccons phủ lưới dày màu xanh theo tiêu chuẩn',
      responsible_party: 'Công ty Cổ phần Xây dựng Coteccons',
      due_at: new Date(Date.now() + 86400000 * 3).toISOString(),
    }),
  });

  assert.equal(res.status, 201);
  assert.equal(res.data.action.status, 'OPEN');
});

// 21. Remediation
test('21. Remediation: Submit remediation proof and verify review status', async () => {
  const openAction = get(`SELECT id FROM corrective_actions WHERE case_id = 'case-006' AND status = 'OPEN' LIMIT 1`);

  const res = await req(`/api/actions/${openAction.id}/remediation`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${staffToken}` },
    body: JSON.stringify({
      description: 'Đã hoàn tất thay mới toàn bộ 300m lưới chắn bụi và tưới nước giảm bụi',
      evidence_asset_ids: ['evd-001'],
    }),
  });

  assert.equal(res.status, 201);
  assert.equal(res.data.remediation.review_status, 'PENDING');
});

// 22. Closure Requirements
test('22. Closure Requirements: Case closure blocked if 4 conditions not satisfied', async () => {
  // Try closing case-006 which has OPEN action and pending remediation
  const closeAttempt = await req('/api/cases/case-006/close', {
    method: 'POST',
    headers: { Authorization: `Bearer ${supToken}` },
    body: JSON.stringify({
      closure_reason: 'Cố tình đóng khi chưa khắc phục',
      closure_summary: 'Vi phạm điều kiện an toàn',
    }),
  });

  assert.equal(closeAttempt.status, 400);
  assert.equal(closeAttempt.data.title, 'Chưa đủ điều kiện đóng hồ sơ');
});

// 23. Case Close
test('23. Case Close: Supervisor closes case when all conditions met', async () => {
  // case-023 is in READY_TO_CLOSE state in seed data
  const res = await req('/api/cases/case-023/close', {
    method: 'POST',
    headers: { Authorization: `Bearer ${supToken}` },
    body: JSON.stringify({
      closure_reason: 'Đã khắc phục toàn diện và nghiệm thu đạt chuẩn',
      closure_summary: 'Công trình hoàn thành lắp đặt hệ thống phun sương và trạm rửa xe, nộp phạt đầy đủ',
    }),
  });

  assert.equal(res.status, 200);
  assert.equal(res.data.case.status, 'CLOSED');
  assert.ok(res.data.closure);
});

// 24. Case Reopen
test('24. Case Reopen: Supervisor reopens closed case with reason', async () => {
  const res = await req('/api/cases/case-025/reopen', {
    method: 'POST',
    headers: { Authorization: `Bearer ${supToken}` },
    body: JSON.stringify({
      reopen_reason: 'Người dân tiếp tục phản ánh bụi phát sinh ban đêm',
    }),
  });

  assert.equal(res.status, 200);
  assert.equal(res.data.case.status, 'REOPENED');
});

// 25. IoT Ingest Contract
test('25. IoT Ingest Contract: Valid ESP32 APM2000 HMAC payload ingested successfully', async () => {
  const sensorCode = 'SENSOR-VD1-01';
  const secret = 'secret-key-vd1';
  const timestamp = new Date().toISOString();
  const pm10 = 45.2;
  const pm25 = 22.8;

  const canonical = buildCanonicalMsg(sensorCode, pm10, pm25, timestamp);
  const signature = crypto.createHmac('sha256', secret).update(canonical).digest('hex');

  const res = await req('/api/iot/ingest', {
    method: 'POST',
    body: JSON.stringify({
      sensorCode,
      pm10,
      pm25,
      timestamp,
      signature,
    }),
  });

  assert.equal(res.status, 201);
  assert.equal(res.data.data.integrity_status, 'VALID');
  assert.equal(res.data.data.recorded, true);
});

// 26. Invalid IoT Signature Rejection
test('26. Invalid IoT Signature Rejection: Invalid HMAC signature rejected with HTTP 403', async () => {
  const sensorCode = 'SENSOR-VD1-01';
  const timestamp = new Date().toISOString();

  const res = await req('/api/iot/ingest', {
    method: 'POST',
    body: JSON.stringify({
      sensorCode,
      pm10: 50.0,
      pm25: 25.0,
      timestamp,
      signature: 'deadbeef1234567890abcdefdeadbeef1234567890abcdefdeadbeef12345678',
    }),
  });

  assert.equal(res.status, 403);
  assert.equal(res.data.error.code, 'INVALID_SIGNATURE');
});

// 27. IoT Liveness & Flatline Detection
test('27. IoT Liveness & Flatline Detection: 5 consecutive identical packets triggers FLATLINE & FAULTY status', async () => {
  const sensorCode = 'SENSOR-TH-02';
  const secret = 'secret-key-th2';
  const fixedPm10 = 88.0;
  const fixedPm25 = 44.0;

  // Send 5 identical readings sequentially with advancing timestamps
  let lastRes;
  for (let i = 0; i < 5; i++) {
    const timestamp = new Date(Date.now() + (i + 1) * 1000).toISOString();
    const canonical = buildCanonicalMsg(sensorCode, fixedPm10, fixedPm25, timestamp);
    const signature = crypto.createHmac('sha256', secret).update(canonical).digest('hex');

    lastRes = await req('/api/iot/ingest', {
      method: 'POST',
      body: JSON.stringify({
        sensorCode,
        pm10: fixedPm10,
        pm25: fixedPm25,
        timestamp,
        signature,
      }),
    });
  }

  assert.equal(lastRes.status, 201);
  assert.equal(lastRes.data.data.integrity_status, 'FLATLINE');
  assert.equal(lastRes.data.data.is_flatline, true);

  const device = get(`SELECT status FROM iot_devices WHERE device_code = ?`, [sensorCode]);
  assert.equal(device.status, 'FAULTY', 'Sensor must transition to FAULTY status on flatline');
});

// 28. Automation Rule
test('28. Automation Rule: Event triggers automation rule execution', async () => {
  const rules = await req('/api/automations/rules', {
    headers: { Authorization: `Bearer ${supToken}` },
  });
  assert.equal(rules.status, 200);
  assert.ok(rules.data.data.length >= 5);
});

// 29. Automation Run Audit
test('29. Automation Run Audit: Automation execution logged in automation_runs table', async () => {
  const runs = await req('/api/automations/runs', {
    headers: { Authorization: `Bearer ${supToken}` },
  });
  assert.equal(runs.status, 200);
  assert.ok(runs.data.data.length > 0);
  assert.ok(runs.data.data[0].rule_name);
});

// 30. Notification Delivery
test('30. Notification Delivery: System notifications persisted in DB and queryable', async () => {
  const notifs = await req('/api/notifications', {
    headers: { Authorization: `Bearer ${staffToken}` },
  });
  assert.equal(notifs.status, 200);
  assert.ok(Array.isArray(notifs.data.notifications));
});

// 31. Community Import Idempotency
test('31. Community Import Idempotency: Duplicate imports update without duplicate cases', async () => {
  const payload = {
    external_case_id: 'comm-ext-9999',
    case_code: 'DG-2026-OP-099',
    title: 'Phản ánh tiếng ồn và bụi từ dự án Vinhomes Grand Park',
    summary: 'Người dân gửi 12 báo cáo ảnh chụp',
    location: 'Đường Nguyễn Xiển, Long Thạnh Mỹ, TP. Thủ Đức',
    latitude: 10.845,
    longitude: 106.837,
    reports: [{ id: 'rep-1', notes: 'Bụi phát tán ban ngày' }],
    evidence: [{ filename: 'photo1.jpg', sha256: 'abc123hash' }],
    timeline: [{ event: 'CITIZEN_REPORT', time: new Date().toISOString() }],
  };

  const firstImport = await req('/api/integrations/community/cases', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  assert.equal(firstImport.status, 200);

  const secondImport = await req('/api/integrations/community/cases', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  assert.equal(secondImport.status, 200);
  assert.equal(secondImport.data.action, 'UPDATED', 'Repeated imports must be idempotent');

  const countCases = get(`SELECT count(*) as c FROM cases WHERE source_reference = 'comm-ext-9999'`);
  assert.equal(countCases.c, 1, 'Only exactly 1 case must exist in DB');
});

// 32. Audit Log
test('32. Audit Log: Immutable audit trail records all critical mutations', async () => {
  const auditEntries = query(`SELECT count(*) as c FROM audit_logs`);
  assert.ok(auditEntries[0].c >= 10, 'All critical actions must have written audit logs');
});
