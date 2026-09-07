import test from 'node:test';
import assert from 'node:assert/strict';

const PROD_BASE = process.env.TEST_BASE_URL || 'https://dustguard.phamphunguyenhung.com';
const OPS_LOGIN_URL = `${PROD_BASE}/api/operations/auth/login`;
const OPS_ME_URL = `${PROD_BASE}/api/operations/auth/me`;
const OPS_LOGOUT_URL = `${PROD_BASE}/api/operations/auth/logout`;
const COMM_LOGIN_URL = `${PROD_BASE}/api/auth/login`;
const COMM_ME_URL = `${PROD_BASE}/api/auth/me`;

const DEMO_PASSWORD = 'DustGuard@2026';

test('DUSTGUARD PRODUCTION AUTH & RBAC MATRIX (AUTH-01 TO AUTH-13)', async (t) => {
  let canboToken = '';
  let lanhdaoToken = '';
  let legalToken = '';
  let adminToken = '';

  // AUTH-01: canbo.hientruong + correct password -> success
  await t.test('AUTH-01: canbo.hientruong + correct password -> success (200, role staff)', async () => {
    const res = await fetch(OPS_LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'canbo.hientruong', password: DEMO_PASSWORD })
    });
    const data = await res.json();
    assert.equal(res.status, 200, 'HTTP status must be 200');
    assert.ok(data.token, 'Token must be returned');
    assert.equal(data.user.username, 'canbo.hientruong');
    assert.equal(data.user.role, 'staff');
    assert.ok(data.user.full_name || data.user.name, 'Full name must be returned');
    assert.equal(data.user.password_hash, undefined, 'Password hash must never be exposed');
    canboToken = data.token;
  });

  // AUTH-02: lanhdao.dieuphoi + correct password -> success
  await t.test('AUTH-02: lanhdao.dieuphoi + correct password -> success (200, role supervisor)', async () => {
    const res = await fetch(OPS_LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'lanhdao.dieuphoi', password: DEMO_PASSWORD })
    });
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.ok(data.token);
    assert.equal(data.user.username, 'lanhdao.dieuphoi');
    assert.equal(data.user.role, 'supervisor');
    lanhdaoToken = data.token;
  });

  // AUTH-03: chuyenvien.phapche + correct password -> success
  await t.test('AUTH-03: chuyenvien.phapche + correct password -> success (200, role legal_reviewer)', async () => {
    const res = await fetch(OPS_LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'chuyenvien.phapche', password: DEMO_PASSWORD })
    });
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.ok(data.token);
    assert.equal(data.user.username, 'chuyenvien.phapche');
    assert.equal(data.user.role, 'legal_reviewer');
    legalToken = data.token;
  });

  // AUTH-04: quantri.dustguard + correct password -> success
  await t.test('AUTH-04: quantri.dustguard + correct password -> success (200, role admin)', async () => {
    const res = await fetch(OPS_LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'quantri.dustguard', password: DEMO_PASSWORD })
    });
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.ok(data.token);
    assert.equal(data.user.username, 'quantri.dustguard');
    assert.equal(data.user.role, 'admin');
    adminToken = data.token;
  });

  // AUTH-05: wrong password -> 401
  await t.test('AUTH-05: wrong password -> 401 Unauthorized', async () => {
    const res = await fetch(OPS_LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'canbo.hientruong', password: 'WrongPassword@999' })
    });
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.ok(data.detail?.includes('chưa đúng') || data.detail?.includes('không chính xác') || data.title);
  });

  // AUTH-06: unknown username -> 401
  await t.test('AUTH-06: unknown username -> 401 Unauthorized', async () => {
    const res = await fetch(OPS_LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'khong_ton_tai_xyz', password: DEMO_PASSWORD })
    });
    assert.equal(res.status, 401);
  });

  // AUTH-07: uppercase username -> xử lý theo normalization
  await t.test('AUTH-07: uppercase username (CANBO.HIENTRUONG) -> success via normalization', async () => {
    const res = await fetch(OPS_LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'CANBO.HIENTRUONG', password: DEMO_PASSWORD })
    });
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.user.username, 'canbo.hientruong');
  });

  // AUTH-08: leading/trailing whitespace -> login được
  await t.test('AUTH-08: leading/trailing whitespace -> success', async () => {
    const res = await fetch(OPS_LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: '  canbo.hientruong  ', password: DEMO_PASSWORD })
    });
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.user.username, 'canbo.hientruong');
  });

  // AUTH-09: login bằng email -> success
  await t.test('AUTH-09: login by email (canbo.hientruong@dustguard.vn) -> success', async () => {
    const res = await fetch(OPS_LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'canbo.hientruong@dustguard.vn', password: DEMO_PASSWORD })
    });
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.user.username, 'canbo.hientruong');
  });

  // AUTH-10: successful login -> current session returns đúng user/role
  await t.test('AUTH-10: GET /auth/me returns valid identity, role, and name', async () => {
    assert.ok(canboToken, 'Token must exist');
    const res = await fetch(OPS_ME_URL, {
      headers: { Authorization: `Bearer ${canboToken}` }
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.user.username, 'canbo.hientruong');
    assert.equal(data.user.role, 'staff');
    assert.ok(data.user.name || data.user.full_name);
    assert.ok(Array.isArray(data.permissions));
  });

  // AUTH-11: reload page -> session còn (token remains valid)
  await t.test('AUTH-11: session persists across multiple verification calls', async () => {
    const res1 = await fetch(OPS_ME_URL, {
      headers: { Authorization: `Bearer ${lanhdaoToken}` }
    });
    assert.equal(res1.status, 200);
    const d1 = await res1.json();
    assert.equal(d1.user.role, 'supervisor');

    // Simulate page reload
    const res2 = await fetch(OPS_ME_URL, {
      headers: { Authorization: `Bearer ${lanhdaoToken}` }
    });
    assert.equal(res2.status, 200);
    const d2 = await res2.json();
    assert.equal(d2.user.id, d1.user.id);
  });

  // AUTH-12: logout -> endpoint responds properly
  await t.test('AUTH-12: POST /auth/logout acknowledges session termination', async () => {
    const res = await fetch(OPS_LOGOUT_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${canboToken}` }
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
  });

  // AUTH-13: role cross-portal isolation (Ops account to Community login -> 403 WRONG_PORTAL_SIDE)
  await t.test('AUTH-13: Cross-portal isolation matrix (Ops user logging in on Community tab -> 403)', async () => {
    const res = await fetch(COMM_LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'canbo.hientruong@dustguard.vn', password: DEMO_PASSWORD })
    });
    assert.equal(res.status, 403, 'Ops account on Community login must receive 403');
    const data = await res.json();
    assert.equal(data.error?.code, 'WRONG_PORTAL_SIDE');
  });
});
