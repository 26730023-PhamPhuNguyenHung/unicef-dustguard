const BASE_URL = 'https://dustguard.phamphunguyenhung.com';

console.log('🧪 [LIVE AUDIT] Kiểm tra trực tiếp trên Production Domain:', BASE_URL);

async function runLiveVerification() {
  let passed = 0;
  let failed = 0;

  function assert(condition, desc) {
    if (condition) {
      console.log(`  ✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${desc}`);
      failed++;
    }
  }

  // 1. Version Check
  console.log('\n1. Kiểm tra Version & Commit SHA...');
  try {
    const verRes = await fetch(`${BASE_URL}/api/system/version`);
    const ver = await verRes.json();
    assert(verRes.status === 200, 'GET /api/system/version trả về 200');
    assert(ver.commit.startsWith('e20ebf6'), `Git commit SHA mới nhất trùng khớp: ${ver.commit.slice(0, 7)}`);
    console.log(`     Build Time: ${ver.buildTime}`);
  } catch (e) {
    assert(false, `Lỗi kiểm tra version: ${e.message}`);
  }

  // 2. Health Check
  console.log('\n2. Kiểm tra Health Check (D1 & R2)...');
  try {
    const healthRes = await fetch(`${BASE_URL}/api/system/health`);
    const health = await healthRes.json();
    assert(healthRes.status === 200, 'GET /api/system/health trả về 200');
    assert(health.status === 'ok' && health.database === 'ok' && health.storage === 'ok', 'Hạ tầng D1 và R2 đều ở trạng thái ok');
  } catch (e) {
    assert(false, `Lỗi kiểm tra health: ${e.message}`);
  }

  // 3. HTTP 302 Edge Redirect Check: /operations/login -> /login?side=operations
  console.log('\n3. Kiểm tra Edge Worker 302 Redirect (/operations/login -> /login?side=operations)...');
  try {
    const redirectRes = await fetch(`${BASE_URL}/operations/login`, {
      redirect: 'manual'
    });
    assert(
      redirectRes.status === 302 || redirectRes.status === 301 || redirectRes.status === 307,
      `HTTP status là chuyển hướng: ${redirectRes.status}`
    );
    const locationHeader = redirectRes.headers.get('location');
    assert(
      locationHeader && locationHeader.includes('/login?side=operations'),
      `Location header chỉ về canonical login: ${locationHeader}`
    );
  } catch (e) {
    assert(false, `Lỗi kiểm tra redirect: ${e.message}`);
  }

  // 3b. Kiểm tra Redirect với query param returnTo
  console.log('\n3b. Kiểm tra Chuyển hướng kèm Deep Link returnTo (/operations/login?returnTo=/operations/cases)...');
  try {
    const redirectRes2 = await fetch(`${BASE_URL}/operations/login?returnTo=%2Foperations%2Fcases`, {
      redirect: 'manual'
    });
    const loc = redirectRes2.headers.get('location');
    assert(
      loc && loc.includes('side=operations') && loc.includes('returnTo='),
      `Location bảo toàn tham số returnTo: ${loc}`
    );
  } catch (e) {
    assert(false, `Lỗi kiểm tra redirect kèm param: ${e.message}`);
  }

  // 4. Community Auth Login Check (/api/auth/login)
  console.log('\n4. Kiểm tra Xác thực Phía Cộng đồng (POST /api/auth/login)...');
  try {
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'citizen@dustguard.local',
        password: 'DustGuard123!'
      })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, 'POST /api/auth/login trả về 200');
    assert(loginData.success === true, 'Đăng nhập Cộng đồng thành công');
    assert(!!loginData.data?.token, 'Đã cấp JWT token hợp lệ');
    assert(loginData.data?.user?.role === 'citizen', 'Role người dùng là citizen');
    assert(loginData.data?.user?.password_hash === undefined, 'password_hash tuyệt đối không bị lộ');
  } catch (e) {
    assert(false, `Lỗi kiểm tra đăng nhập cộng đồng: ${e.message}`);
  }

  // 5. Operations Setup Status & Auth Check
  console.log('\n5. Kiểm tra Trạng thái Nghiệp vụ Operations (/api/operations/auth/setup-status)...');
  try {
    const setupRes = await fetch(`${BASE_URL}/api/operations/auth/setup-status`);
    const setupData = await setupRes.json();
    assert(setupRes.status === 200, 'GET /api/operations/auth/setup-status trả về 200');
    console.log(`     Operations DB: is_initialized=${setupData.is_initialized}, user_count=${setupData.user_count}`);
  } catch (e) {
    assert(false, `Lỗi kiểm tra setup status: ${e.message}`);
  }

  // 6. Static Asset Integrity (Side A & Side B)
  console.log('\n6. Kiểm tra tính toàn vẹn của Static Bundles...');
  try {
    const sideAHtml = await (await fetch(`${BASE_URL}/login`)).text();
    assert(sideAHtml.includes('<!doctype html>') || sideAHtml.includes('<html'), 'Trang /login phân phối HTML hợp lệ');
    assert(!sideAHtml.includes('SSOT SQLite cục bộ'), 'Tuyệt đối không chứa text SQLite cục bộ');

    const sideBHtml = await (await fetch(`${BASE_URL}/operations`)).text();
    assert(sideBHtml.includes('<!doctype html>') || sideBHtml.includes('<html'), 'Trang /operations phân phối HTML hợp lệ');
  } catch (e) {
    assert(false, `Lỗi kiểm tra HTML: ${e.message}`);
  }

  console.log(`\n========================================`);
  console.log(`📊 TỔNG KẾT KIỂM THỬ: ${passed} PASS, ${failed} FAIL`);
  console.log(`========================================`);

  if (failed > 0) process.exit(1);
}

runLiveVerification();
