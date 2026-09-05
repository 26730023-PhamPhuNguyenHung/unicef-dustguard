import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import appCommunity from '../apps/server/dist/index.js';
import { app as appOps } from '../dustguard-operations/apps/server/src/index.js';

test('FORENSIC ROLE LOGIN & RBAC ISOLATION MATRIX SUITE', async (t) => {
  let serverCommunity;
  let serverOps;
  let baseCommunity = '';
  let baseOps = '';

  // Khởi động đồng thời 2 backend test trên port ngẫu nhiên
  await Promise.all([
    new Promise((resolve) => {
      serverCommunity = appCommunity.listen(0, () => {
        baseCommunity = `http://localhost:${serverCommunity.address().port}/api`;
        resolve();
      });
    }),
    new Promise((resolve) => {
      serverOps = appOps.listen(0, () => {
        baseOps = `http://localhost:${serverOps.address().port}/api`;
        resolve();
      });
    })
  ]);

  t.after(() => {
    if (serverCommunity) serverCommunity.close();
    if (serverOps) serverOps.close();
  });

  // =========================================================================
  // 1. SIDE A: REAL LOGIN MATRIX (Citizen, Member, Moderator, Admin)
  // =========================================================================
  const communityTokens = {};

  await t.test('1. Side A: Real Login Matrix for 4 Roles (POST /api/auth/login)', async () => {
    const roles = [
      { email: 'citizen@dustguard.local', role: 'citizen', pass: 'DustGuard123!' },
      { email: 'member@dustguard.local', role: 'community_member', pass: 'DustGuard123!' },
      { email: 'moderator@dustguard.local', role: 'moderator', pass: 'DustGuard123!' },
      { email: 'admin@dustguard.local', role: 'admin', pass: 'DustGuard123!' }
    ];

    for (const r of roles) {
      const res = await fetch(`${baseCommunity}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: r.email, password: r.pass })
      });
      const data = await res.json();
      assert.equal(res.status, 200, `Login thành công cho ${r.email}`);
      assert.equal(data.success, true);
      assert.ok(data.data.token, `Có JWT token cho ${r.role}`);
      assert.equal(data.data.user.role, r.role);
      assert.equal(data.data.user.password_hash, undefined, 'Tuyệt đối không rò rỉ password_hash');
      communityTokens[r.role] = data.data.token;
    }
  });

  await t.test('2. Side A: Bad Credentials & Sanitization Rejection', async () => {
    const res = await fetch(`${baseCommunity}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'citizen@dustguard.local', password: 'wrongpassword' })
    });
    assert.equal(res.status, 401, 'Mật khẩu sai phải bị từ chối 401');
    const data = await res.json();
    assert.equal(data.success, false);
    assert.equal(data.error.code, 'INVALID_CREDENTIALS');
  });

  await t.test('3. Side A: RBAC 403 Forbidden Matrix Isolation', async () => {
    // 3.1. Citizen cố gọi /moderator/reports -> 403
    const citToMod = await fetch(`${baseCommunity}/moderator/reports`, {
      headers: { Authorization: `Bearer ${communityTokens['citizen']}` }
    });
    assert.equal(citToMod.status, 403, 'Citizen gọi endpoint moderator bị chặn 403');

    // 3.2. Citizen cố gọi /admin/users -> 403
    const citToAdmin = await fetch(`${baseCommunity}/admin/users`, {
      headers: { Authorization: `Bearer ${communityTokens['citizen']}` }
    });
    assert.equal(citToAdmin.status, 403, 'Citizen gọi endpoint admin bị chặn 403');

    // 3.3. Member cố gọi /admin/users -> 403
    const memToAdmin = await fetch(`${baseCommunity}/admin/users`, {
      headers: { Authorization: `Bearer ${communityTokens['community_member']}` }
    });
    assert.equal(memToAdmin.status, 403, 'Member gọi endpoint admin bị chặn 403');

    // 3.4. Moderator cố gọi /admin/users/:id/role -> 403
    const modToRole = await fetch(`${baseCommunity}/admin/users/usr_01/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${communityTokens['moderator']}`
      },
      body: JSON.stringify({ role: 'admin' })
    });
    assert.equal(modToRole.status, 403, 'Moderator cố nâng quyền bị chặn 403');

    // 3.5. Không có token -> 401
    const noToken = await fetch(`${baseCommunity}/moderator/reports`);
    assert.equal(noToken.status, 401, 'Không có token truy cập endpoint bảo mật bị chặn 401');
  });

  // =========================================================================
  // 2. SIDE B: REAL LOGIN MATRIX (Staff, Supervisor, Legal Reviewer, Admin)
  // =========================================================================
  const opsTokens = {};

  await t.test('4. Side B: Real Login Matrix for 4 Roles (POST /api/auth/login)', async () => {
    const roles = [
      { username: 'staff1', role: 'staff' },
      { username: 'supervisor1', role: 'supervisor' },
      { username: 'legal1', role: 'legal_reviewer' },
      { username: 'admin', role: 'admin' }
    ];

    for (const r of roles) {
      const res = await fetch(`${baseOps}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: r.username, password: 'password123' })
      });
      const data = await res.json();
      assert.equal(res.status, 200, `Login thành công cho ${r.username}`);
      assert.ok(data.token, `Có JWT token cho ${r.role}`);
      assert.equal(data.user.role, r.role);
      assert.equal(data.user.password_hash, undefined, 'Tuyệt đối không rò rỉ password_hash');
      opsTokens[r.role] = data.token;
    }
  });

  await t.test('5. Side B: Bad Credentials Rejection (RFC 7807 Problem Details)', async () => {
    const res = await fetch(`${baseOps}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'staff1', password: 'sai_mat_khau' })
    });
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.status, 401);
    assert.equal(data.title, 'Đăng nhập thất bại');
  });

  await t.test('6. Side B: RBAC Capability Isolation Matrix (403 Forbidden)', async () => {
    // 6.1. Staff cố đóng vụ việc -> 403 (cần case:close của supervisor)
    const staffClose = await fetch(`${baseOps}/cases/case-023/close`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${opsTokens['staff']}`
      },
      body: JSON.stringify({ closure_reason: 'Test', closure_summary: 'Test' })
    });
    assert.equal(staffClose.status, 403, 'Staff không có quyền đóng vụ việc');

    // 6.2. Staff cố sửa cấu hình hệ thống -> 403 (cần system:config của admin)
    const staffConfig = await fetch(`${baseOps}/admin/configs/test_key`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${opsTokens['staff']}`
      },
      body: JSON.stringify({ value_json: 'test' })
    });
    assert.equal(staffConfig.status, 403, 'Staff không có quyền sửa cấu hình hệ thống');

    // 6.3. Supervisor cố ký kết luận pháp lý -> 403 (cần legal:review của legal_reviewer)
    const supLegal = await fetch(`${baseOps}/cases/case-023/legal/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${opsTokens['supervisor']}`
      },
      body: JSON.stringify({
        statutory_conclusion: 'VIOLATION_CONFIRMED',
        official_notes: 'Cố tình ký khi không phải chuyên viên pháp chế'
      })
    });
    assert.equal(supLegal.status, 403, 'Supervisor không được ký thay chuyên viên pháp chế');

    // 6.4. Legal Reviewer ký kết luận pháp lý -> 200 hoặc 400 (hợp lệ về quyền 403 bypass)
    const legalReview = await fetch(`${baseOps}/cases/case-023/legal/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${opsTokens['legal_reviewer']}`
      },
      body: JSON.stringify({
        status: 'REVIEWED',
        summary: 'Thẩm tra pháp lý chuẩn xác căn cứ Nghị định 45/2022'
      })
    });
    assert.notEqual(legalReview.status, 403, 'Legal reviewer ĐƯỢC PHÉP truy cập endpoint legal/review');

    // 6.5. Không có token truy cập endpoint bảo mật -> 401
    const noToken = await fetch(`${baseOps}/cases`);
    assert.equal(noToken.status, 401, 'Không có token bị từ chối 401');
  });

  await t.test('7. Side B: Zero Data Loss / Mutation Persistence in SQLite SSOT', async () => {
    // Tạo 1 task mới bằng staff
    const createRes = await fetch(`${baseOps}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${opsTokens['staff']}`
      },
      body: JSON.stringify({
        title: 'Nhiệm vụ kiểm tra chống mất mát dữ liệu SQLite',
        priority: 'HIGH',
        case_id: 'case-023'
      })
    });
    assert.equal(createRes.status, 201);
    const createdData = await createRes.json();
    assert.ok(createdData.task.id);

    // Truy vấn lại trực tiếp qua GET /api/tasks để chứng minh lưu vết thành công
    const getRes = await fetch(`${baseOps}/tasks`, {
      headers: { Authorization: `Bearer ${opsTokens['staff']}` }
    });
    assert.equal(getRes.status, 200);
    const listData = await getRes.json();
    const found = listData.tasks.find((t) => t.id === createdData.task.id);
    assert.ok(found, 'Task mới phải xuất hiện trong danh sách từ SQLite DB');
    assert.equal(found.title, 'Nhiệm vụ kiểm tra chống mất mát dữ liệu SQLite');
  });
});
