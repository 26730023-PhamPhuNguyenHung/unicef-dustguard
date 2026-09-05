process.env.NODE_ENV = 'test';
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const testDbPath = path.join(rootDir, 'data', 'test-empty-lifecycle.db');

if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
process.env.DB_PATH = testDbPath;

const { runMigrations } = await import('../apps/server/src/db/migrate.js');
const { app } = await import('../apps/server/src/index.js');
const { get, query, db } = await import('../apps/server/src/db/connection.js');

let server;
let baseUrl = '';

let adminToken = '';
let staffToken = '';
let staffId = '';
let legalToken = '';
let contractorId = '';
let projectId = '';
let deviceId = '';
let signalId = '';
let caseId = '';
let caseCode = '';
let taskId = '';
let inspectionId = '';
let evidenceId = '';
let actionId = '';
let submissionId = '';

const E2E_TIMESTAMP = Date.now();
const E2E_TITLE = `E2E EMPTY DB ${E2E_TIMESTAMP} - Xe ben làm rơi vãi đất cát gây bụi dày đặc`;

async function req(endpoint, options = {}, token = '') {
  const url = `${baseUrl}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(url, { ...options, headers });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { status: res.status, ok: res.ok, data };
}

before(async () => {
  // Step 1: Initialize Database with migrations ONLY
  runMigrations();

  await new Promise(resolve => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) {
    await new Promise(resolve => server.close(resolve));
  }
  try {
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
  } catch {}
});

test('20-STEP REAL-WORLD END-TO-END WORKFLOW FROM EMPTY DATABASE', async (t) => {
  // STEP 1: Verify Initial Database is 100% Empty of Operational Data
  await t.test('STEP 1: App initializes with 0 operational records', () => {
    const uCount = get('SELECT count(*) as c FROM users')?.c;
    const cCount = get('SELECT count(*) as c FROM cases')?.c;
    const sCount = get('SELECT count(*) as c FROM signals')?.c;
    assert.equal(uCount, 0, 'Must have 0 users');
    assert.equal(cCount, 0, 'Must have 0 cases');
    assert.equal(sCount, 0, 'Must have 0 signals');
  });

  // STEP 2: First-run Bootstrap Super Administrator
  await t.test('STEP 2: Legitimate bootstrap creates Super Admin', async () => {
    const res = await req('/api/auth/bootstrap', {
      method: 'POST',
      body: JSON.stringify({
        username: 'admin_supreme',
        password: 'password123',
        full_name: 'Trần Văn Quản Trị',
        email: 'admin@dustguard.gov.vn',
        department: 'Ban Quản trị Trung ương',
      }),
    });

    assert.equal(res.status, 201);
    assert.equal(res.data.success, true);
    adminToken = res.data.token;
    assert.ok(adminToken, 'Admin token received');
  });

  // STEP 3: Admin creates Field Staff and Legal Reviewer accounts
  await t.test('STEP 3: Admin creates staff and legal accounts through legitimate API', async () => {
    // Create Field Staff
    const sRes = await req(
      '/api/admin/users',
      {
        method: 'POST',
        body: JSON.stringify({
          username: 'staff_tran',
          password: 'password123',
          full_name: 'Trần Cán Bộ Hiện Trường',
          email: 'staff.tran@dustguard.gov.vn',
          role: 'staff',
          department: 'Đội Thanh tra Môi trường Đô thị',
        }),
      },
      adminToken
    );
    assert.equal(sRes.status, 201);
    staffId = sRes.data.user.id;

    // Login as Staff
    const sLogin = await req('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'staff_tran', password: 'password123' }),
    });
    assert.equal(sLogin.status, 200);
    staffToken = sLogin.data.token;

    // Create Legal Reviewer
    const lRes = await req(
      '/api/admin/users',
      {
        method: 'POST',
        body: JSON.stringify({
          username: 'legal_nguyen',
          password: 'password123',
          full_name: 'Nguyễn Luật Sư Môi Trường',
          email: 'legal.nguyen@dustguard.gov.vn',
          role: 'legal_reviewer',
          department: 'Phòng Pháp chế & Xử lý Vi phạm',
        }),
      },
      adminToken
    );
    assert.equal(lRes.status, 201);

    const lLogin = await req('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'legal_nguyen', password: 'password123' }),
    });
    legalToken = lLogin.data.token;
  });

  // STEP 4: Register Contractor / Responsible Party
  await t.test('STEP 4: Create real Contractor entity', async () => {
    const res = await req(
      '/api/contractors',
      {
        method: 'POST',
        body: JSON.stringify({
          name: 'Công ty CP Đầu tư & Xây dựng Sông Hồng 36',
          contact_person: 'Nguyễn Văn Giám Đốc',
          phone: '0912.888.999',
          email: 'contact@songhong36.com.vn',
          tax_id: '0109988776',
          address: 'Số 88 đường Phạm Hùng, Nam Từ Liêm, Hà Nội',
          notes: 'Nhà thầu chính thi công gói thầu đường và cống ngầm',
        }),
      },
      adminToken
    );

    assert.equal(res.status, 201);
    assert.equal(res.data.success, true);
    contractorId = res.data.contractor.id;
    assert.ok(contractorId);
  });

  // STEP 5: Create Construction Project
  await t.test('STEP 5: Create real Construction Project linked to contractor', async () => {
    const res = await req(
      '/api/projects',
      {
        method: 'POST',
        body: JSON.stringify({
          name: 'Dự án Cải tạo Nâng cấp Trục Giao thông Cầu Giấy',
          code: 'DA-CG-2026-E2E',
          address: 'Số 136 đường Xuân Thủy',
          district: 'Cầu Giấy',
          province: 'Hà Nội',
          contractor_id: contractorId,
          owner_name: 'Ban Quản lý Dự án Đầu tư Xây dựng Công trình Giao thông',
          latitude: 21.0368,
          longitude: 105.7832,
          status: 'ACTIVE',
        }),
      },
      adminToken
    );

    assert.equal(res.status, 201);
    assert.equal(res.data.success, true);
    projectId = res.data.project.id;
    assert.ok(projectId);
  });

  // STEP 6: Register IoT Telemetry Device
  await t.test('STEP 6: Register IoT Sensor Station linked to project', async () => {
    const res = await req(
      '/api/iot/devices',
      {
        method: 'POST',
        body: JSON.stringify({
          device_code: 'IOT-HN-DUST-09',
          name: 'Trạm đo Bụi Cổng Phụ Tây',
          project_id: projectId,
          location_text: 'Cổng công trường số 136 Xuân Thủy, Cầu Giấy',
          latitude: 21.0368,
          longitude: 105.7832,
        }),
      },
      adminToken
    );

    assert.equal(res.status, 201);
    assert.equal(res.data.success, true);
    deviceId = res.data.device.id;
    assert.ok(deviceId);
  });

  // STEP 7: Citizen submits Public Environmental Report (Unauthenticated)
  await t.test('STEP 7: Citizen submits new Report without login', async () => {
    const res = await req('/api/signals/public-report', {
      method: 'POST',
      body: JSON.stringify({
        title: E2E_TITLE,
        description: 'Đoàn xe tải chở đất đá ra vào liên tục không che chắn bạt, bánh xe bám đầy bùn không được rửa làm vương vãi ra mặt đường tạo thành lớp bụi mù mịt khi xe chạy qua.',
        location_text: 'Khu vực đối diện ĐH Quốc Gia, đường Xuân Thủy',
        district: 'Cầu Giấy',
        latitude: 21.0368,
        longitude: 105.7832,
        reporter_name: 'Lê Hoàng Dân Cư',
        reporter_phone: '0987.654.321',
        urgency: 'HIGH',
      }),
    });

    assert.equal(res.status, 201);
    assert.equal(res.data.success, true);
    signalId = res.data.signal?.id || res.data.data?.id;
    assert.ok(signalId, 'Signal must have real database ID');
  });

  // STEP 8: Staff triages Public Report into an Official Case
  await t.test('STEP 8: Staff triages Report into Official Case with sequential code', async () => {
    const res = await req(
      `/api/signals/${signalId}/create-case`,
      {
        method: 'POST',
        body: JSON.stringify({
          priority: 'HIGH',
          project_id: projectId,
          contractor_id: contractorId,
        }),
      },
      staffToken
    );

    assert.equal(res.status, 201);
    assert.equal(res.data.success, true);
    caseId = res.data.case.id;
    caseCode = res.data.case.case_code;
    assert.ok(caseId);
    assert.equal(caseCode, 'DG-2026-OP-001', 'Must generate first sequential case code DG-2026-OP-001');
    assert.equal(res.data.case.project_id, projectId);
    assert.equal(res.data.case.contractor_id, contractorId);
  });

  // STEP 9: Assign Case to Field Staff
  await t.test('STEP 9: Assign case to staff_tran', async () => {
    const res = await req(
      `/api/cases/${caseId}/assign`,
      {
        method: 'POST',
        body: JSON.stringify({
          staff_user_id: staffId,
          assignment_type: 'PRIMARY',
          note: 'Yêu cầu đồng chí khẩn trương kiểm tra thực địa trong 24h',
        }),
      },
      adminToken
    );

    assert.equal(res.status, 200);
    assert.equal(res.data.success, true);
    assert.equal(res.data.case.assigned_staff_id, staffId);
  });

  // STEP 10: Create Operational Task
  await t.test('STEP 10: Create operational field verification task', async () => {
    const res = await req(
      '/api/tasks',
      {
        method: 'POST',
        body: JSON.stringify({
          case_id: caseId,
          title: `Kiểm tra hiện trường vi phạm xả bụi ${caseCode}`,
          description: 'Tiếp cận công trường, chụp ảnh bằng chứng và đối chiếu quy chuẩn che chắn',
          task_type: 'VERIFICATION',
          assigned_to: staffId,
          due_date: new Date(Date.now() + 86400000).toISOString(),
          priority: 'HIGH',
        }),
      },
      staffToken
    );

    assert.equal(res.status, 201);
    assert.equal(res.data.success, true);
    taskId = res.data.task.id;
    assert.ok(taskId);
  });

  // STEP 11: Plan Field Inspection using standard template
  await t.test('STEP 11: Plan field inspection with statutory template', async () => {
    const res = await req(
      '/api/inspections',
      {
        method: 'POST',
        body: JSON.stringify({
          case_id: caseId,
          inspector_id: staffId,
          template_id: 'tmpl-build-site',
          scheduled_date: new Date().toISOString().split('T')[0],
          location_text: 'Số 136 đường Xuân Thủy, Cầu Giấy',
          note: 'Kiểm tra đột xuất theo phản ánh của công dân',
        }),
      },
      staffToken
    );

    assert.equal(res.status, 201);
    assert.equal(res.data.success, true);
    inspectionId = res.data.inspection.id;
    assert.ok(inspectionId);
  });

  // STEP 12: Perform Inspection & Record Observations
  await t.test('STEP 12: Complete inspection and record non-compliance findings', async () => {
    // Get checklist items generated for this inspection
    const insRes = await req(`/api/inspections/${inspectionId}`, {}, staffToken);
    assert.equal(insRes.status, 200);
    const items = insRes.data.items || [];
    assert.ok(items.length > 0, 'Template items must be cloned into inspection');

    // Submit observations: Mark first 2 items as FAIL
    const itemUpdates = items.map((it, idx) => ({
      item_id: it.id,
      status: idx < 2 ? 'FAIL' : 'PASS',
      note: idx === 0 ? 'Phát hiện rách lưới che chắn mặt tiền tầng 3-5' : idx === 1 ? 'Cầu rửa xe không hoạt động, nước khô cạn' : 'Đạt yêu cầu',
    }));

    const subRes = await req(
      `/api/inspections/${inspectionId}/submit`,
      {
        method: 'POST',
        body: JSON.stringify({
          items: itemUpdates,
          note: 'Biên bản ghi nhận 2 hành vi vi phạm quy chuẩn che chắn và rửa xe',
        }),
      },
      staffToken
    );

    assert.equal(subRes.status, 200);
    assert.equal(subRes.data.success, true);
    assert.equal(subRes.data.inspection.status, 'COMPLETED');
  });

  // STEP 13: Upload Real Digital Evidence Asset with SHA-256
  await t.test('STEP 13: Upload evidence photo with calculated SHA-256 integrity hash', async () => {
    const testImageBuffer = Buffer.from('FAKE_PNG_EVIDENCE_PHOTO_AT_SITE_EMPTY_DB');
    const sha256 = crypto.createHash('sha256').update(testImageBuffer).digest('hex');

    const file = new File([testImageBuffer], 'hien-truong-xe-tai-bui.png', { type: 'image/png' });
    const formData = new FormData();
    formData.append('case_id', caseId);
    formData.append('source_type', 'INSPECTION');
    formData.append('source_id', inspectionId);
    formData.append('file', file);

    const upRes = await fetch(`${baseUrl}/api/evidence/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: formData,
    });
    const upData = await upRes.json();
    if (upRes.status !== 201) {
      console.error('STEP 13 FAILED with status', upRes.status, 'body:', upData, 'caseId:', caseId, 'inspectionId:', inspectionId);
    }

    assert.equal(upRes.status, 201);
    assert.ok(upData.asset);
    evidenceId = upData.asset.id;
    assert.ok(evidenceId);
    assert.equal(upData.asset.sha256, sha256, 'SHA-256 must match real bytes');
  });

  // STEP 14: Run Grounded Legal Assistance Engine
  await t.test('STEP 14: Legal engine runs on real facts and cites statutory legal sources', async () => {
    const anRes = await req(
      `/api/cases/${caseId}/legal/analyze`,
      {
        method: 'POST',
        body: JSON.stringify({ focus_area: 'VIOLATION_ASSESSMENT' }),
      },
      legalToken
    );

    if (anRes.status !== 200) {
      console.error('STEP 14 FAILED with status', anRes.status, 'body:', anRes.data, 'caseId:', caseId);
    }

    assert.equal(anRes.status, 200);
    const analysis = anRes.data.analysis;
    assert.ok(analysis, 'Must return analysis wrapper');
    const output = analysis.output;

    assert.ok(output.findings, 'Must produce findings array');
    assert.ok(output.findings.length > 0, 'Must identify non-compliance from FAIL items');

    const finding = output.findings[0];
    assert.ok(finding.source_ids.length > 0, 'Finding must cite real source fact IDs');
    assert.ok(output.relevantProvisions.length > 0, 'Must cite relevant statutory provisions');

    const provision = output.relevantProvisions[0];
    assert.ok(
      provision.reason.includes('45/2022') || provision.reason.includes('05:2023') || provision.reason.includes('72/2020'),
      'Must cite Vietnamese statutory legislation (ND 45/2022 or QCVN 05:2023 or Luật BVMT)'
    );
  });

  // STEP 15: Human Decision Layer confirms legal assessment
  await t.test('STEP 15: Human Officer issues formal decision and legal review', async () => {
    // 15a. Human Legal Review (Pre-condition for closure)
    const lrevRes = await req(
      `/api/cases/${caseId}/legal/review`,
      {
        method: 'POST',
        body: JSON.stringify({
          status: 'REVIEWED',
          summary: 'Đã hoàn tất thẩm tra đối chiếu Nghị định 45/2022/NĐ-CP và QCVN 05:2023/BTNMT',
          legal_basis_note: 'Khoản 2 Điều 15 Nghị định 45/2022/NĐ-CP',
        }),
      },
      legalToken
    );
    assert.equal(lrevRes.status, 200);

    // 15b. Authoritative Human Decision Layer
    const decRes = await req(
      `/api/cases/${caseId}/decisions`,
      {
        method: 'POST',
        body: JSON.stringify({
          decision_type: 'CONFIRM_VIOLATION',
          reason: 'Căn cứ biên bản kiểm tra hiện trường ngày hôm nay và ảnh số đã kiểm tra toàn vẹn mã SHA-256, xác nhận hành vi vi phạm.',
        }),
      },
      legalToken
    );

    assert.equal(decRes.status, 201);
    assert.equal(decRes.data.success, true);
  });

  // STEP 16: Issue Corrective Action to Contractor with Deadline
  await t.test('STEP 16: Staff issues binding Corrective Action to contractor', async () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString();
    const actRes = await req(
      `/api/cases/${caseId}/actions`,
      {
        method: 'POST',
        body: JSON.stringify({
          inspection_id: inspectionId,
          title: 'Khắc phục che chắn bụi và vận hành lại trạm rửa xe',
          description: 'Yêu cầu Công ty Sông Hồng 36 căng lưới kín mặt tiền và rửa sạch 100% xe tải trước khi ra khỏi cổng',
          responsible_party: 'Công ty CP Đầu tư & Xây dựng Sông Hồng 36',
          due_at: tomorrow,
        }),
      },
      staffToken
    );

    assert.equal(actRes.status, 201);
    actionId = actRes.data.action?.id;
    assert.ok(actionId, 'Must return created action ID');
  });

  // STEP 17: Submit Remediation Evidence
  await t.test('STEP 17: Contractor submits remediation evidence', async () => {
    const remRes = await req(
      `/api/actions/${actionId}/remediation`,
      {
        method: 'POST',
        body: JSON.stringify({
          description: 'Đã hoàn tất căng lưới chắn bụi 3 lớp và vận hành hệ thống phun sương dập bụi trạm rửa xe',
          evidence_asset_ids: [evidenceId],
        }),
      },
      staffToken
    );

    assert.equal(remRes.status, 201);
    submissionId = remRes.data.submission?.id;
    assert.ok(submissionId, 'Must return submission ID');
  });

  // STEP 18: Staff Verifies Remediation
  await t.test('STEP 18: Staff reviews and verifies remediation compliance', async () => {
    const verRes = await req(
      `/api/remediation/${submissionId}/review`,
      {
        method: 'POST',
        body: JSON.stringify({
          review_status: 'APPROVED',
          review_note: 'Đã đối chứng thực địa, đơn vị đã chấp hành đúng yêu cầu quy chuẩn che chắn và rửa xe',
        }),
      },
      staffToken
    );

    assert.equal(verRes.status, 200);
    assert.equal(verRes.data.success, true);
  });

  // STEP 19: Formally Close Case Legally
  await t.test('STEP 19: Formally close case based on fulfilled requirements', async () => {
    const closeRes = await req(
      `/api/cases/${caseId}/close`,
      {
        method: 'POST',
        body: JSON.stringify({
          closure_reason: 'Nhà thầu đã khắc phục 100% các vi phạm về bụi và rửa xe',
          closure_summary: 'Hồ sơ đã hoàn tất 4/4 điều kiện tiên quyết: Biên bản hiện trường hoàn thành, 0 yêu cầu khắc phục mở, ý kiến pháp lý đầy đủ, bằng chứng số toàn vẹn.',
        }),
      },
      adminToken
    );

    assert.equal(closeRes.status, 200);
    assert.equal(closeRes.data.success, true);
  });

  // STEP 20: Dashboard Statistics reflect real Database state
  await t.test('STEP 20: Dashboard metrics reflect real completed case without fake numbers', async () => {
    const dashRes = await req('/api/dashboard', {}, adminToken);
    assert.equal(dashRes.status, 200);

    // No active open cases
    assert.equal(dashRes.data.metrics.new_cases, 0);
    assert.equal(dashRes.data.metrics.pending_inspection, 0);
    assert.equal(dashRes.data.metrics.overdue_actions, 0);

    // Recent activity stream has events from our E2E run
    assert.ok(dashRes.data.recentActivities.length > 0);
    const hasOurCase = dashRes.data.recentActivities.some(a => a.case_code === caseCode || a.case_id === caseId);
    assert.ok(hasOurCase, 'Activity timeline must show our case');
  });

  // STEP 21: Database Direct Verification & Relationship Chain Proof
  await t.test('STEP 21: Database direct query proves relational chain persists', () => {
    const signalRow = get('SELECT * FROM signals WHERE id = ?', [signalId]);
    assert.ok(signalRow, 'Signal exists in SQLite DB');

    const caseRow = get('SELECT * FROM cases WHERE id = ?', [caseId]);
    assert.ok(caseRow, 'Case exists in SQLite DB');
    assert.equal(caseRow.status, 'CLOSED');
    assert.equal(caseRow.case_code, caseCode);

    const assignmentRow = get('SELECT * FROM staff_assignments WHERE case_id = ?', [caseId]);
    assert.ok(assignmentRow, 'Staff assignment exists');

    const taskRow = get('SELECT * FROM tasks WHERE case_id = ?', [caseId]);
    assert.ok(taskRow, 'Task exists');

    const inspectionRow = get('SELECT * FROM inspections WHERE case_id = ?', [caseId]);
    assert.ok(inspectionRow, 'Inspection exists and COMPLETED');
    assert.equal(inspectionRow.status, 'COMPLETED');

    const evidenceRow = get('SELECT * FROM evidence_assets WHERE id = ?', [evidenceId]);
    assert.ok(evidenceRow, 'Evidence asset exists with SHA-256');

    const actionRow = get('SELECT * FROM corrective_actions WHERE id = ?', [actionId]);
    assert.ok(actionRow, 'Corrective action exists and VERIFIED');
    assert.equal(actionRow.status, 'VERIFIED');

    const closureRow = get('SELECT * FROM case_closures WHERE case_id = ?', [caseId]);
    assert.ok(closureRow, 'Formal case closure record exists');
    assert.ok(closureRow.closure_summary.includes('4/4 điều kiện'));
  });
});
