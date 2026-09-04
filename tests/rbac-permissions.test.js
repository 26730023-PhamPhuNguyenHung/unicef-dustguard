import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../apps/server/dist/index.js';
import { can, ROLE_PERMISSIONS } from '../packages/shared/dist/index.js';

test('DUSTGUARD COMMUNITY — RBAC & PERMISSION SUITE', async (t) => {
  let server;
  let baseUrl = '';

  // Khởi động HTTP server trên cổng ngẫu nhiên độc lập
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}/api`;
      resolve();
    });
  });

  t.after(() => {
    if (server) server.close();
  });

  // 1. Kiểm tra Ma trận Role Capabilities (Client & Shared Logic)
  await t.test('1. Role Capabilities Matrix Check (can function)', () => {
    // Citizen Capabilities
    assert.equal(can('citizen', 'report:create'), true, 'Citizen được tạo phản ánh');
    assert.equal(can('citizen', 'report:view'), true, 'Citizen được xem phản ánh');
    assert.equal(can('citizen', 'case:confirm'), true, 'Citizen được bấm Tôi cũng ghi nhận');
    assert.equal(can('citizen', 'case:follow'), true, 'Citizen được theo dõi');
    assert.equal(can('citizen', 'task:view'), false, 'Citizen KHÔNG được xem/nhận nhiệm vụ');
    assert.equal(can('citizen', 'task:claim'), false, 'Citizen KHÔNG được nhận nhiệm vụ');
    assert.equal(can('citizen', 'observation:create'), false, 'Citizen KHÔNG được bổ sung quan sát hiện trường');
    assert.equal(can('citizen', 'moderator:inbox'), false, 'Citizen KHÔNG được vào Hộp thư xác minh');
    assert.equal(can('citizen', 'admin:users'), false, 'Citizen KHÔNG được vào Quản trị người dùng');

    // Member Capabilities
    assert.equal(can('community_member', 'report:create'), true, 'Member có toàn bộ quyền của Citizen');
    assert.equal(can('community_member', 'task:view'), true, 'Member ĐƯỢC xem nhiệm vụ');
    assert.equal(can('community_member', 'task:claim'), true, 'Member ĐƯỢC nhận nhiệm vụ');
    assert.equal(can('community_member', 'observation:create'), true, 'Member ĐƯỢC bổ sung quan sát');
    assert.equal(can('community_member', 'contribution:view'), true, 'Member ĐƯỢC xem lịch sử đóng góp');
    assert.equal(can('community_member', 'moderator:inbox'), false, 'Member KHÔNG được vào Hộp thư xác minh');
    assert.equal(can('community_member', 'admin:users'), false, 'Member KHÔNG được vào Quản trị');

    // Moderator Capabilities
    assert.equal(can('moderator', 'task:view'), true, 'Moderator có toàn bộ quyền của Member');
    assert.equal(can('moderator', 'moderator:inbox'), true, 'Moderator ĐƯỢC vào Hộp thư xác minh');
    assert.equal(can('moderator', 'moderator:verify'), true, 'Moderator ĐƯỢC xác thực phản ánh');
    assert.equal(can('moderator', 'moderator:merge'), true, 'Moderator ĐƯỢC gộp phản ánh');
    assert.equal(can('moderator', 'moderator:create_case'), true, 'Moderator ĐƯỢC tạo vụ việc');
    assert.equal(can('moderator', 'moderator:coordinate_cases'), true, 'Moderator ĐƯỢC điều phối vụ việc');
    assert.equal(can('moderator', 'moderator:stats'), true, 'Moderator ĐƯỢC xem thống kê điều phối');
    assert.equal(can('moderator', 'admin:users'), false, 'Moderator KHÔNG được vào Quản trị người dùng');
    assert.equal(can('moderator', 'admin:audit'), false, 'Moderator KHÔNG được xem nhật ký kiểm toán');

    // Admin Capabilities
    assert.equal(can('admin', 'moderator:inbox'), true, 'Admin có toàn bộ quyền của Moderator');
    assert.equal(can('admin', 'admin:users'), true, 'Admin ĐƯỢC quản lý người dùng');
    assert.equal(can('admin', 'admin:roles'), true, 'Admin ĐƯỢC đổi vai trò');
    assert.equal(can('admin', 'admin:status'), true, 'Admin ĐƯỢC khóa/mở tài khoản');
    assert.equal(can('admin', 'admin:audit'), true, 'Admin ĐƯỢC xem nhật ký kiểm toán');
    assert.equal(can('admin', 'admin:stats'), true, 'Admin ĐƯỢC xem thống kê hệ thống');
  });

  // Chuẩn bị tokens cho 4 roles qua login
  let citizenToken = '';
  let memberToken = '';
  let moderatorToken = '';
  let adminToken = '';

  await t.test('2. Lấy Token cho 4 Role (Login hoặc Dev Switch)', async () => {
    // 1. Citizen
    const citRes = await fetch(`${baseUrl}/auth/dev-switch-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'citizen' })
    });
    const citData = await citRes.json();
    assert.equal(citData.success, true);
    assert.equal(citData.data.user.role, 'citizen');
    citizenToken = citData.data.token;

    // 2. Member
    const memRes = await fetch(`${baseUrl}/auth/dev-switch-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'community_member' })
    });
    const memData = await memRes.json();
    assert.equal(memData.success, true);
    assert.equal(memData.data.user.role, 'community_member');
    memberToken = memData.data.token;

    // 3. Moderator
    const modRes = await fetch(`${baseUrl}/auth/dev-switch-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'moderator' })
    });
    const modData = await modRes.json();
    assert.equal(modData.success, true);
    assert.equal(modData.data.user.role, 'moderator');
    moderatorToken = modData.data.token;

    // 4. Admin
    const admRes = await fetch(`${baseUrl}/auth/dev-switch-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'admin' })
    });
    const admData = await admRes.json();
    assert.equal(admData.success, true);
    assert.equal(admData.data.user.role, 'admin');
    adminToken = admData.data.token;
  });

  // 3. Backend API Route Authorization Matrix Check
  await t.test('3. Backend API Authorization Matrix (403 Enforcement)', async () => {
    // A. Citizen
    const citToAdmin = await fetch(`${baseUrl}/admin/users`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    assert.equal(citToAdmin.status, 403, 'Citizen truy cập /admin/users phải nhận 403');

    const citToMod = await fetch(`${baseUrl}/moderator/reports`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    assert.equal(citToMod.status, 403, 'Citizen truy cập /moderator/reports phải nhận 403');

    const citClaimTask = await fetch(`${baseUrl}/tasks/task_01/claim`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    assert.equal(citClaimTask.status, 403, 'Citizen nhận nhiệm vụ phải nhận 403');

    // B. Member
    const memToAdmin = await fetch(`${baseUrl}/admin/users`, {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    assert.equal(memToAdmin.status, 403, 'Member truy cập /admin/users phải nhận 403');

    const memToMod = await fetch(`${baseUrl}/moderator/reports`, {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    assert.equal(memToMod.status, 403, 'Member truy cập /moderator/reports phải nhận 403');

    // C. Moderator
    const modToAdmin = await fetch(`${baseUrl}/admin/users`, {
      headers: { Authorization: `Bearer ${moderatorToken}` }
    });
    assert.equal(modToAdmin.status, 403, 'Moderator truy cập /admin/users phải nhận 403');

    const modToMod = await fetch(`${baseUrl}/moderator/reports`, {
      headers: { Authorization: `Bearer ${moderatorToken}` }
    });
    assert.equal(modToMod.status, 200, 'Moderator truy cập /moderator/reports phải nhận 200 OK');

    // D. Admin
    const admToAdmin = await fetch(`${baseUrl}/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.equal(admToAdmin.status, 200, 'Admin truy cập /admin/users phải nhận 200 OK');

    const admToMod = await fetch(`${baseUrl}/moderator/reports`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.equal(admToMod.status, 200, 'Admin truy cập /moderator/reports phải nhận 200 OK');
  });

  // 4. Moderator Workflows Verification (Verify, Reject, Merge, Create Case)
  await t.test('4. Moderator Mutations & Persistence in SQLite', async () => {
    // 4.1. Tạo 1 report mới bằng Citizen
    const createRes = await fetch(`${baseUrl}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${citizenToken}`
      },
      body: JSON.stringify({
        title: 'Bụi phát tán tại công trình kiểm thử RBAC',
        description: 'Mô tả hiện trường kiểm tra phân quyền và lưu vết SQLite',
        category: 'dust',
        latitude: 10.732,
        longitude: 106.709,
        address: 'Đường số 10',
        district: 'Quận 7',
        ward: 'Tân Phú',
        observedAt: new Date().toISOString(),
        visibility: 'public',
        severityObservation: 'high'
      })
    });
    const createData = await createRes.json();
    assert.equal(createData.success, true);
    const testReportId = createData.data.id || createData.data.report.id;

    // 4.2. Moderator Verify_Only
    const verifyRes = await fetch(`${baseUrl}/moderator/reports/${testReportId}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${moderatorToken}`
      },
      body: JSON.stringify({ action: 'verify_only' })
    });
    const verifyData = await verifyRes.json();
    assert.equal(verifyRes.status, 200);
    assert.equal(verifyData.success, true);

    // Kiểm tra đã lưu bền vững
    const checkVerify = await fetch(`${baseUrl}/reports/${testReportId}`);
    const checkVerifyData = await checkVerify.json();
    assert.equal((checkVerifyData.data.report || checkVerifyData.data).status, 'verified');

    // 4.3. Tạo case mới từ report qua POST /moderator/cases
    const createCaseRes = await fetch(`${baseUrl}/moderator/cases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${moderatorToken}`
      },
      body: JSON.stringify({
        reportId: testReportId,
        title: 'Vụ việc xử lý bụi công trình Quận 7',
        summary: 'Tóm tắt xử lý tập trung',
        category: 'dust',
        latitude: 10.732,
        longitude: 106.709,
        address: 'Đường số 10, Quận 7',
        district: 'Quận 7',
        ward: 'Tân Phú',
        priority: 'urgent'
      })
    });
    const newCaseData = await createCaseRes.json();
    assert.equal(createCaseRes.status, 201);
    assert.equal(newCaseData.success, true);
    const createdCaseId = newCaseData.data.id;
    assert.ok(createdCaseId);

    // 4.4. Moderator Merge một report khác vào case vừa tạo
    const rep2Res = await fetch(`${baseUrl}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${citizenToken}`
      },
      body: JSON.stringify({
        title: 'Bụi phát tán phản ánh thứ 2 cần gộp',
        description: 'Mô tả phản ánh thứ 2',
        category: 'dust',
        latitude: 10.732,
        longitude: 106.709,
        address: 'Đường số 10',
        district: 'Quận 7',
        ward: 'Tân Phú',
        observedAt: new Date().toISOString(),
        visibility: 'public',
        severityObservation: 'medium'
      })
    });
    const rep2Data = await rep2Res.json();
    const rep2Id = rep2Data.data.id || rep2Data.data.report.id;

    const mergeRes = await fetch(`${baseUrl}/moderator/reports/${rep2Id}/merge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${moderatorToken}`
      },
      body: JSON.stringify({ targetCaseId: createdCaseId })
    });
    const mergeData = await mergeRes.json();
    assert.equal(mergeRes.status, 200);
    assert.equal(mergeData.success, true);

    // Kiểm tra report 2 đã sang merged và gắn caseId
    const checkMerge = await fetch(`${baseUrl}/reports/${rep2Id}`);
    const checkMergeData = await checkMerge.json();
    const rep2Check = checkMergeData.data.report || checkMergeData.data;
    assert.equal(rep2Check.status, 'merged');
    assert.equal(rep2Check.case_id || rep2Check.caseId, createdCaseId);

    // 4.5. Moderator Reject một report kèm reason
    const rep3Res = await fetch(`${baseUrl}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${citizenToken}`
      },
      body: JSON.stringify({
        title: 'Phản ánh không chính xác',
        description: 'Mô tả sai hiện trường',
        category: 'dust',
        latitude: 10.732,
        longitude: 106.709,
        address: 'Đường số 10',
        district: 'Quận 7',
        ward: 'Tân Phú',
        observedAt: new Date().toISOString(),
        visibility: 'public',
        severityObservation: 'low'
      })
    });
    const rep3Data = await rep3Res.json();
    const rep3Id = rep3Data.data.id || rep3Data.data.report.id;

    const rejectRes = await fetch(`${baseUrl}/moderator/reports/${rep3Id}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${moderatorToken}`
      },
      body: JSON.stringify({ reason: 'Hình ảnh không thể hiện dấu hiệu phát tán bụi thực tế.' })
    });
    const rejectData = await rejectRes.json();
    assert.equal(rejectRes.status, 200);
    assert.equal(rejectData.success, true);

    // Kiểm tra report 3 đã sang rejected
    const checkReject = await fetch(`${baseUrl}/reports/${rep3Id}`);
    const checkRejectData = await checkReject.json();
    const rep3Check = checkRejectData.data.report || checkRejectData.data;
    assert.equal(rep3Check.status, 'rejected');
  });
});
