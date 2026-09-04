import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import app from '../apps/server/dist/index.js';

test('DUSTGUARD COMMUNITY — AUTOMATED END-TO-END 12 FLOWS', async (t) => {
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

  let citizenToken = '';
  let moderatorToken = '';
  let adminToken = '';
  let testReportId = '';
  let testCaseId = '';
  let testObservationId = '';

  // 1. Flow Register
  await t.test('1. Đăng ký tài khoản người dân mới (Register)', async () => {
    const randomSuffix = Math.floor(Math.random() * 100000);
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Nguyễn Văn Kiểm Thử',
        email: `tester_${randomSuffix}@dustguard.local`,
        password: 'DustGuard123!',
        district: 'Quận 7',
        ward: 'Tân Phú'
      })
    });

    const data = await res.json();
    assert.ok(res.status === 200 || res.status === 201, `Status code phải là 200 hoặc 201, nhận: ${res.status}`);
    assert.equal(data.success, true);
    assert.ok(data.data.token, 'Phải có token trả về');
    assert.equal(data.data.user.role, 'citizen');
    citizenToken = data.data.token;
  });

  // 2. Flow Login
  await t.test('2. Đăng nhập hệ thống (Login Citizen & Moderator & Admin)', async () => {
    // Đăng nhập Moderator demo
    const modRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'moderator@dustguard.local',
        password: 'DustGuard123!'
      })
    });
    const modData = await modRes.json();
    assert.equal(modRes.status, 200);
    assert.equal(modData.success, true);
    assert.equal(modData.data.user.role, 'moderator');
    moderatorToken = modData.data.token;

    // Đăng nhập Admin demo
    const adminRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@dustguard.local',
        password: 'DustGuard123!'
      })
    });
    const adminData = await adminRes.json();
    assert.equal(adminRes.status, 200);
    assert.equal(adminData.data.user.role, 'admin');
    adminToken = adminData.data.token;
  });

  // 3. Flow Create Report
  await t.test('3. Người dân tạo phản ánh nguồn bụi mới (Create Report)', async () => {
    const res = await fetch(`${baseUrl}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${citizenToken}`
      },
      body: JSON.stringify({
        title: 'Bụi phát tán từ công trình nâng cấp đường số 15',
        description: 'Xe chở đất cát ra vào thường xuyên không che phủ, làm bụi bốc mù mịt đoạn giao lộ.',
        category: 'dust',
        latitude: 10.735,
        longitude: 106.71,
        address: 'Số 45 đường 15',
        district: 'Quận 7',
        ward: 'Tân Phú',
        observedAt: new Date().toISOString(),
        visibility: 'public',
        severityObservation: 'medium'
      })
    });

    const data = await res.json();
    assert.ok(res.status === 200 || res.status === 201);
    assert.equal(data.success, true);

    const rep = data.data.report || data.data;
    assert.ok(rep.id);
    assert.ok((rep.report_code || rep.reportCode).startsWith('DG-C-2026-'));
    assert.equal(rep.status, 'submitted');
    testReportId = rep.id;
  });

  // 4. Flow Upload Evidence
  await t.test('4. Tải ảnh bằng chứng kèm mã băm SHA-256 (Upload Evidence)', async () => {
    const boundary = '----WebKitFormBoundaryTest12345';
    const fakeFileContent = 'Fake Image Binary Content For Evidence Verification';
    const dummyHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

    const body = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="caption"',
      '',
      'Ảnh chụp lúc 10h sáng',
      `--${boundary}`,
      'Content-Disposition: form-data; name="sha256Hash"',
      '',
      dummyHash,
      `--${boundary}`,
      'Content-Disposition: form-data; name="file"; filename="evidence.jpg"',
      'Content-Type: image/jpeg',
      '',
      fakeFileContent,
      `--${boundary}--`
    ].join('\r\n');

    const res = await fetch(`${baseUrl}/reports/${testReportId}/media`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        Authorization: `Bearer ${citizenToken}`
      },
      body
    });

    const data = await res.json();
    assert.ok(res.status === 200 || res.status === 201);
    assert.equal(data.success, true);
    const media = data.data.media || data.data;
    assert.ok(media.id);
    assert.equal(media.sha256_hash || media.sha256Hash, dummyHash);
  });

  // Chuẩn bị: Lấy mã case có sẵn
  await t.test('Chuẩn bị: Lấy mã case có sẵn để test tương tác', async () => {
    const res = await fetch(`${baseUrl}/cases`);
    const data = await res.json();
    assert.equal(res.status, 200);
    const cases = Array.isArray(data.data) ? data.data : (data.data.cases || []);
    assert.ok(cases.length > 0, 'Phải có ít nhất 1 case trong seed data');
    testCaseId = cases[0].id;
  });

  // 5. Flow Confirmation Unique
  await t.test('5. Xác nhận "Tôi cũng ghi nhận" & Kiểm tra tính duy nhất (Unique Confirmation)', async () => {
    // Lần 1: Thành công
    const res1 = await fetch(`${baseUrl}/cases/${testCaseId}/confirm`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    const data1 = await res1.json();
    assert.equal(res1.status, 200);
    assert.equal(data1.success, true);

    // Lần 2: Hệ thống từ chối vì đã xác nhận rồi
    const res2 = await fetch(`${baseUrl}/cases/${testCaseId}/confirm`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    const data2 = await res2.json();
    assert.equal(data2.success, false);
    assert.equal(data2.error.code, 'ALREADY_CONFIRMED');
  });

  // 6. Flow Create Observation
  await t.test('6. Cộng đồng bổ sung quan sát hiện trường (Create Observation)', async () => {
    const res = await fetch(`${baseUrl}/cases/${testCaseId}/observations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${citizenToken}`
      },
      body: JSON.stringify({
        observationType: 'reduced',
        comment: 'Đã thấy xe bồn tưới nước xuất hiện lúc chiều, bụi đã giảm bớt so với buổi sáng.',
        observedAt: new Date().toISOString()
      })
    });

    const data = await res.json();
    assert.ok(res.status === 200 || res.status === 201);
    assert.equal(data.success, true);
    const obs = data.data.observation || data.data;
    assert.ok(obs.id || obs.observationId, 'Phải có id hoặc observationId');
    testObservationId = obs.id || obs.observationId;
  });

  // 7. Flow Moderator Verify
  await t.test('7. Điều phối viên xác nhận tín hiệu (Moderator Verify)', async () => {
    const res = await fetch(`${baseUrl}/moderator/reports/${testReportId}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${moderatorToken}`
      },
      body: JSON.stringify({
        action: 'verify_only'
      })
    });

    const data = await res.json();
    assert.ok(res.status === 200 || res.status === 201, `Status code phải là 200 hoặc 201, nhận: ${res.status}`);
    assert.equal(data.success, true);

    // Kiểm tra trạng thái đã sang verified
    const checkRes = await fetch(`${baseUrl}/reports/${testReportId}`);
    const checkData = await checkRes.json();
    const rep = checkData.data.report || checkData.data;
    assert.equal(rep.status, 'verified');
  });

  // 8. Flow Merge Report
  await t.test('8. Điều phối viên gộp phản ánh vào vụ việc chung (Merge Report)', async () => {
    const res = await fetch(`${baseUrl}/moderator/reports/${testReportId}/merge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${moderatorToken}`
      },
      body: JSON.stringify({
        targetCaseId: testCaseId
      })
    });

    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.success, true);

    // Kiểm tra trạng thái sang merged
    const checkRes = await fetch(`${baseUrl}/reports/${testReportId}`);
    const checkData = await checkRes.json();
    const rep = checkData.data.report || checkData.data;
    assert.equal(rep.status, 'merged');
    assert.equal(rep.case_id || rep.caseId, testCaseId);
  });

  // 9. Flow Case Status Transition
  await t.test('9. Cập nhật trạng thái vụ việc & Mốc thời gian (Case Status Transition)', async () => {
    const res = await fetch(`${baseUrl}/moderator/cases/${testCaseId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${moderatorToken}`
      },
      body: JSON.stringify({
        newStatus: 'in_progress',
        title: 'Chuyển thông tin cho đơn vị phụ trách thi công',
        content: 'Ban chỉ huy dự án đã tiếp nhận biên bản phản ánh và cam kết tăng tần suất tưới nước.'
      })
    });

    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.success, true);
    assert.equal(data.data.status, 'in_progress');
  });

  // 10. Flow RBAC Guard
  await t.test('10. Phân quyền người dùng nghiêm ngặt (Role-Based Access Control)', async () => {
    // Citizen cố truy cập route Admin
    const res = await fetch(`${baseUrl}/admin/users`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    assert.equal(res.status, 403, 'Citizen truy cập route admin phải trả về 403 Forbidden');

    // Citizen cố duyệt xác minh Moderator
    const modCheckRes = await fetch(`${baseUrl}/moderator/reports`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    assert.equal(modCheckRes.status, 403, 'Citizen truy cập route moderator phải trả về 403 Forbidden');
  });

  // 11. Flow Notifications
  await t.test('11. Hệ thống thông báo & Đánh dấu đã đọc (Notifications)', async () => {
    const res = await fetch(`${baseUrl}/notifications`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    });

    const data = await res.json();
    assert.equal(res.status, 200);
    const notifs = Array.isArray(data.data) ? data.data : (data.data.notifications || []);
    assert.ok(Array.isArray(notifs));

    if (notifs.length > 0) {
      const notifId = notifs[0].id;
      const readRes = await fetch(`${baseUrl}/notifications/${notifId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${citizenToken}` }
      });
      const readData = await readRes.json();
      assert.equal(readRes.status, 200);
      assert.equal(readData.success, true);
    }
  });

  // 12. Flow Community Join / Leave
  await t.test('12. Tham gia và rời nhóm cộng đồng (Community Join / Leave)', async () => {
    // Lấy danh sách cộng đồng
    const commListRes = await fetch(`${baseUrl}/communities`);
    const commListData = await commListRes.json();
    assert.equal(commListRes.status, 200);
    const comms = Array.isArray(commListData.data) ? commListData.data : (commListData.data.communities || []);
    assert.ok(comms.length > 0);
    const commId = comms[0].id;

    // Tham gia nhóm
    const joinRes = await fetch(`${baseUrl}/communities/${commId}/join`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    const joinData = await joinRes.json();
    assert.equal(joinRes.status, 200);
    assert.equal(joinData.success, true);

    // Rời nhóm
    const leaveRes = await fetch(`${baseUrl}/communities/${commId}/leave`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    const leaveData = await leaveRes.json();
    assert.equal(leaveRes.status, 200);
    assert.equal(leaveData.success, true);
  });
});
