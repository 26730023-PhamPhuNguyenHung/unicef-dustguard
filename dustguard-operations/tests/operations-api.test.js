process.env.NODE_ENV = 'test';
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
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
});

after(async () => {
  if (server) {
    await new Promise(resolve => server.close(resolve));
  }
});

test('1. Auth & JWT: Login with valid staff credentials', async () => {
  const res = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'staff1', password: 'password123' }),
  });

  assert.equal(res.status, 200);
  assert.ok(res.data.token, 'Token must be issued');
  assert.equal(res.data.user.username, 'staff1');
  assert.equal(res.data.user.role, 'staff');
  assert.ok(res.data.permissions.includes('case:view'));
});

test('2. Auth: Reject invalid password', async () => {
  const res = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'staff1', password: 'wrongpassword' }),
  });

  assert.equal(res.status, 401);
  assert.equal(res.data.title, 'Đăng nhập thất bại');
});

test('3. RBAC: Enforce role-based capabilities', async () => {
  // Login as Staff
  const staffLogin = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'staff1', password: 'password123' }),
  });
  const staffToken = staffLogin.data.token;

  // Staff attempts supervisor-only action (close case) -> must be 403 Forbidden
  const closeAttempt = await req('/api/cases/case-023/close', {
    method: 'POST',
    headers: { Authorization: `Bearer ${staffToken}` },
    body: JSON.stringify({
      closure_reason: 'Staff trying to close',
      closure_summary: 'Not allowed for staff role',
    }),
  });
  assert.equal(closeAttempt.status, 403, 'Staff must not have permission to close cases');

  // Login as Supervisor -> should have case:close permission
  const supLogin = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'supervisor1', password: 'password123' }),
  });
  assert.equal(supLogin.status, 200);
  assert.ok(supLogin.data.permissions.includes('case:close'));
});

test('4. Cases: List cases with search, tabs, and computed operational flags', async () => {
  const login = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'staff1', password: 'password123' }),
  });
  const token = login.data.token;

  const res = await req('/api/cases?tab=all', {
    headers: { Authorization: `Bearer ${token}` },
  });

  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.data.cases));
  assert.ok(res.data.total >= 25, 'Should return at least 25 seeded cases');

  // Verify operational flags are computed
  const sampleCase = res.data.cases[0];
  assert.ok(sampleCase.flags !== undefined, 'Case should have operational flags object');
  assert.equal(typeof sampleCase.flags.unassigned, 'boolean');
  assert.equal(typeof sampleCase.flags.missing_evidence, 'boolean');
});

test('5. Case State Machine: Enforce valid and invalid status transitions', async () => {
  const login = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'staff1', password: 'password123' }),
  });
  const token = login.data.token;

  // Invalid transition: NEW directly to CLOSED
  const invalidTransition = await req('/api/cases/case-001/transition', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ to_status: 'CLOSED' }),
  });
  assert.equal(invalidTransition.status, 400);
  assert.equal(invalidTransition.data.title, 'Chuyển trạng thái không hợp lệ');

  // Valid transition: NEW to TRIAGED
  const validTransition = await req('/api/cases/case-001/transition', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ to_status: 'TRIAGED', note: 'Xác thực sơ bộ thông tin tiếp nhận' }),
  });
  assert.equal(validTransition.status, 200);
  assert.equal(validTransition.data.case.status, 'TRIAGED');
});

test('6. Assignment & Reassignment: Maintain audit trail and previous status', async () => {
  const supLogin = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'supervisor1', password: 'password123' }),
  });
  const supToken = supLogin.data.token;

  // Assign staff1
  const assignRes = await req('/api/cases/case-001/assign', {
    method: 'POST',
    headers: { Authorization: `Bearer ${supToken}` },
    body: JSON.stringify({
      staff_user_id: 'usr-staff-1',
      assignment_type: 'PRIMARY',
      note: 'Phân công cán bộ Hùng thụ lý chính',
    }),
  });
  assert.equal(assignRes.status, 200);
  assert.equal(assignRes.data.case.assigned_staff_id, 'usr-staff-1');

  // Reassign to staff2
  const reassignRes = await req('/api/cases/case-001/reassign', {
    method: 'POST',
    headers: { Authorization: `Bearer ${supToken}` },
    body: JSON.stringify({
      staff_user_id: 'usr-staff-2',
      assignment_type: 'PRIMARY',
      note: 'Điều chuyển sang đồng chí Mai phụ trách địa bàn',
    }),
  });
  assert.equal(reassignRes.status, 200);
  assert.equal(reassignRes.data.case.assigned_staff_id, 'usr-staff-2');

  // Verify previous assignment was marked REPLACED in DB
  const oldAssignment = get(
    `SELECT status FROM staff_assignments WHERE case_id = 'case-001' AND staff_user_id = 'usr-staff-1'`
  );
  assert.equal(oldAssignment.status, 'REPLACED');
});

test('7. Legal Search: SQLite FTS5 returns exact matches with snippet', async () => {
  const res = await req('/api/legal/search?q=che+ch%E1%BA%AFn');
  assert.equal(res.status, 200);
  assert.ok(res.data.results.length > 0, 'FTS5 should return matching legal sections');
  assert.ok(res.data.results[0].section_number, 'Should include section number');
  assert.ok(res.data.results[0].document_title, 'Should include document title');
});

test('8. Legal Intelligence: Assistive AI Provider generates Zod-validated output', async () => {
  const login = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'staff1', password: 'password123' }),
  });

  const res = await req('/api/cases/case-001/legal/analyze', {
    method: 'POST',
    headers: { Authorization: `Bearer ${login.data.token}` },
  });

  assert.equal(res.status, 200);
  const output = res.data.analysis.output;
  assert.ok(output.summary);
  assert.ok(Array.isArray(output.potentialIssues));
  assert.ok(Array.isArray(output.relevantProvisions));
  assert.ok(output.disclaimer.includes('Trợ lý Pháp lý chỉ mang tính chất tham vấn'));
});

test('9. Inspection: Create inspection and generate checklist from template', async () => {
  const login = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'staff1', password: 'password123' }),
  });
  const token = login.data.token;

  const createRes = await req('/api/cases/case-001/inspections', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      template_id: 'tmpl-build-site',
      inspection_type: 'INITIAL',
      scheduled_date: '2026-09-06',
      location_text: '240 Điện Biên Phủ, Phường 15, Bình Thạnh',
      note: 'Kiểm tra lưới che chắn và xe bồn',
    }),
  });

  assert.equal(createRes.status, 201);
  const inspectionId = createRes.data.inspection.id;

  // Retrieve inspection detail
  const detailRes = await req(`/api/inspections/${inspectionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(detailRes.status, 200);
  assert.ok(detailRes.data.items.length > 0, 'Checklist items must be populated from template');
  assert.equal(detailRes.data.items[0].status, 'UNKNOWN');
});

test('10. Inspection Submission: Required validation and Findings auto-generation', async () => {
  const login = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'staff1', password: 'password123' }),
  });
  const token = login.data.token;

  // Get active inspection for case-001
  const inspList = await req('/api/inspections?case_id=case-001', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const inspectionId = inspList.data.inspections[0].id;
  const inspDetail = await req(`/api/inspections/${inspectionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const items = inspDetail.data.items;

  // Submit without answering required items and without override -> must fail 400
  const failSubmit = await req(`/api/inspections/${inspectionId}/submit`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      items: items.map(i => ({ item_id: i.id, status: 'UNKNOWN' })),
    }),
  });
  assert.equal(failSubmit.status, 400);

  // Submit with evaluations (1 FAIL, rest PASS)
  const successSubmit = await req(`/api/inspections/${inspectionId}/submit`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      items: items.map((i, idx) => ({
        item_id: i.id,
        status: idx === 0 ? 'FAIL' : 'PASS',
        note: idx === 0 ? 'Lưới bị rách tầng 3' : 'Đạt chuẩn',
      })),
      note: 'Hoàn thành kiểm tra thực địa',
    }),
  });
  assert.equal(successSubmit.status, 200);

  // Verify finding was generated
  const findings = query(`SELECT * FROM inspection_findings WHERE inspection_id = ?`, [inspectionId]);
  assert.ok(findings.length > 0, 'Finding must be automatically created for failed item');
  assert.equal(findings[0].severity, 'MEDIUM');
});

test('11. Corrective Action & Remediation Lifecycle', async () => {
  const login = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'staff1', password: 'password123' }),
  });
  const token = login.data.token;

  // 1. Create corrective action
  const actionRes = await req('/api/cases/case-001/actions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      title: 'Bổ sung màng lưới chống bụi mặt tiền',
      description: 'Yêu cầu nhà thầu lắp đặt lưới 3 lớp trong vòng 48 giờ',
      responsible_party: 'Công ty TNHH Xây dựng Đông Tây',
      due_at: '2026-09-08',
    }),
  });
  assert.equal(actionRes.status, 201);
  const actionId = actionRes.data.action.id;

  // 2. Submit remediation report
  const remRes = await req(`/api/actions/${actionId}/remediation`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      description: 'Đã hoàn tất thay thế và giăng kín màng lưới xanh 3 lớp',
    }),
  });
  assert.equal(remRes.status, 201);
  const subId = remRes.data.submission.id;

  // 3. Staff reviews and approves remediation
  const reviewRes = await req(`/api/remediation/${subId}/review`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      review_status: 'APPROVED',
      review_note: 'Đã kiểm tra đối chứng ảnh nghiệm thu đạt yêu cầu',
    }),
  });
  assert.equal(reviewRes.status, 200);
  assert.equal(reviewRes.data.submission.review_status, 'APPROVED');

  // Verify action status became VERIFIED in DB
  const act = get(`SELECT status FROM corrective_actions WHERE id = ?`, [actionId]);
  assert.equal(act.status, 'VERIFIED');
});

test('12. Case Closure Safety Gate: Enforce 4 mandatory closure criteria', async () => {
  const supLogin = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'supervisor1', password: 'password123' }),
  });
  const supToken = supLogin.data.token;

  // Attempt to close case-016 (has open actions) -> must be rejected 400
  const rejectedClose = await req('/api/cases/case-016/close', {
    method: 'POST',
    headers: { Authorization: `Bearer ${supToken}` },
    body: JSON.stringify({
      closure_reason: 'Cố gắng đóng khi còn action',
      closure_summary: 'Hồ sơ chưa đạt chuẩn',
    }),
  });
  assert.equal(rejectedClose.status, 400);
  assert.equal(rejectedClose.data.title, 'Chưa đủ điều kiện đóng hồ sơ');

  // Close case-023 (Ready to close, all 4 conditions met) -> must succeed 200
  const successClose = await req('/api/cases/case-023/close', {
    method: 'POST',
    headers: { Authorization: `Bearer ${supToken}` },
    body: JSON.stringify({
      closure_reason: 'Đã khắc phục xong toàn diện và hoàn thành nghiệm thu',
      closure_summary: 'Toàn bộ tiêu chí kiểm tra hiện trường đạt chuẩn, không còn vi phạm mở, chuyên viên pháp chế đã thẩm tra hoàn tất.',
    }),
  });
  assert.equal(successClose.status, 200);
  assert.equal(successClose.data.success, true);

  // Verify DB persistence of closure
  const closedCase = get(`SELECT status, closed_at FROM cases WHERE id = 'case-023'`);
  assert.equal(closedCase.status, 'CLOSED');
  assert.ok(closedCase.closed_at !== null);
});

test('13. Case Reopen: Supervisor can reopen closed case', async () => {
  const supLogin = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'supervisor1', password: 'password123' }),
  });
  const supToken = supLogin.data.token;

  const reopenRes = await req('/api/cases/case-025/reopen', {
    method: 'POST',
    headers: { Authorization: `Bearer ${supToken}` },
    body: JSON.stringify({
      reopen_reason: 'Tiếp nhận phản ánh tái phát sinh bụi mù mịt từ người dân',
    }),
  });

  assert.equal(reopenRes.status, 200);
  const reopenedCase = get(`SELECT status, closed_at FROM cases WHERE id = 'case-025'`);
  assert.equal(reopenedCase.status, 'REOPENED');
  assert.equal(reopenedCase.closed_at, null);
});

test('14. Community Integration Idempotency: Duplicate imports update without creating duplicate cases', async () => {
  const payload = {
    external_case_id: 'COM-TEST-IDEMPOTENT-001',
    title: 'Bụi phát tán từ công trình cải tạo đường Lê Duẩn',
    description: 'Bụi từ xe tải ra vào gây cản trở tầm nhìn người tham gia giao thông',
    location: '100 Lê Duẩn, Quận 1',
    lat: 10.7791,
    lng: 106.6982,
    report_count: 3,
    confirmation_count: 5,
    contractor_name: 'Công ty XD Thăng Long',
  };

  // First import -> creates new case
  const firstImport = await req('/api/integrations/community/cases', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  assert.equal(firstImport.status, 201);
  assert.equal(firstImport.data.action, 'CREATED_NEW');
  const createdCaseId = firstImport.data.case_id;

  // Second import with same external_case_id -> updates existing case idempotently
  const secondImport = await req('/api/integrations/community/cases', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      report_count: 2, // 2 more reports
    }),
  });
  assert.equal(secondImport.status, 200);
  assert.equal(secondImport.data.action, 'UPDATED_EXISTING');
  assert.equal(secondImport.data.case_id, createdCaseId);

  // Verify total cases with this external_id is exactly 1 in DB
  const casesCount = get(
    `SELECT count(*) as c FROM cases WHERE source_reference = 'COM-TEST-IDEMPOTENT-001'`
  )?.c;
  assert.equal(casesCount, 1, 'Idempotency guarantee: must not create duplicate records');

  // Verify report count updated (3 + 2 = 5)
  const updatedCase = get(`SELECT source_report_count FROM cases WHERE id = ?`, [createdCaseId]);
  assert.equal(updatedCase.source_report_count, 5);
});

test('15. Audit Trail: All mutations write structured audit logs', async () => {
  const logs = query(
    `SELECT action, entity_type FROM audit_logs WHERE created_at > datetime('now', '-5 minutes')`
  );
  assert.ok(logs.length > 0, 'Audit logs must capture recent mutation events');
});
