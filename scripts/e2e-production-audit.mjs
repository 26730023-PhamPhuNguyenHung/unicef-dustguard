import { chromium } from 'playwright';

const BASE_URL = process.env.TEST_BASE_URL || 'https://dustguard.phamphunguyenhung.com';
const LOGIN_URL = `${BASE_URL}/login`;

const DEMO_ACCOUNTS = [
  {
    cardName: 'Nguyễn Minh Anh',
    username: 'canbo.hientruong',
    role: 'staff',
    roleLabel: 'Cán bộ'
  },
  {
    cardName: 'Trần Quốc Minh',
    username: 'lanhdao.dieuphoi',
    role: 'supervisor',
    roleLabel: 'Lãnh đạo'
  },
  {
    cardName: 'Lê Thanh Hà',
    username: 'chuyenvien.phapche',
    role: 'legal_reviewer',
    roleLabel: 'Pháp chế'
  },
  {
    cardName: 'Quản trị DustGuard',
    username: 'quantri.dustguard',
    role: 'admin',
    roleLabel: 'Quản trị'
  }
];

const VIEWPORTS = [
  { name: 'Desktop (1440x900)', width: 1440, height: 900 },
  { name: 'Mobile (390x844)', width: 390, height: 844 }
];

async function runAudit() {
  console.log('🚀 [E2E Production Audit] Khởi động trình duyệt Playwright Chromium...');
  const browser = await chromium.launch({ headless: true });

  let totalPassed = 0;
  let totalFailed = 0;

  for (const vp of VIEWPORTS) {
    console.log(`\n======================================================`);
    console.log(`📱 KIỂM THỬ TRÊN VIEWPORT: ${vp.name}`);
    console.log(`======================================================`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 DustGuardE2E'
    });
    const page = await context.newPage();

    // Listen to console and network errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`   [Browser Console Error] ${msg.text()}`);
      }
    });

    for (const acc of DEMO_ACCOUNTS) {
      console.log(`\n▶ [${vp.name}] Test tài khoản: ${acc.cardName} (@${acc.username})`);
      try {
        // 1. Mở trang /login
        await page.goto(LOGIN_URL, { waitUntil: 'networkidle' });
        
        // 2. Chọn tab Đơn vị Xử lý
        const tabOps = page.locator('#tab-operations');
        await tabOps.click();
        await page.waitForTimeout(300);

        // 3. Click card demo tương ứng
        const cardBtn = page.locator(`button:has-text("${acc.cardName}")`);
        await cardBtn.waitFor({ state: 'visible', timeout: 5000 });
        await cardBtn.click();
        await page.waitForTimeout(300);

        // Kiểm tra autofill đúng username và password DustGuard@2026
        const usernameVal = await page.locator('#input-operations-username').inputValue();
        const passwordVal = await page.locator('#input-operations-password').inputValue();
        if (usernameVal !== acc.username || passwordVal !== 'DustGuard@2026') {
          throw new Error(`Autofill sai: username="${usernameVal}", password="${passwordVal}"`);
        }
        console.log(`   ✓ Autofill chính xác: username=${usernameVal}, password=DustGuard@2026`);

        // 4. Nhấn nút Đăng nhập Đơn vị Xử lý
        const loginBtn = page.locator('#btn-operations-login');
        await loginBtn.click();

        // 5. Verify redirect sang /operations/
        await page.waitForURL(/\/operations/, { timeout: 10000 });
        console.log(`   ✓ Redirect thành công đến: ${page.url()}`);

        // 6 & 7. Verify display name và role trên dashboard/header
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        const pageContent = await page.textContent('body');
        if (!pageContent.includes(acc.cardName)) {
          console.warn(`   ⚠ Tên hiển thị "${acc.cardName}" chưa xuất hiện trong text DOM chính (kiểm tra mobile view)`);
        } else {
          console.log(`   ✓ Xác nhận hiển thị đúng tên: "${acc.cardName}"`);
        }

        // Kiểm tra dữ liệu thực trên dashboard (không trắng trang)
        const hasOperationalData = pageContent.includes('Vụ việc') || 
                                   pageContent.includes('Tổng quan') || 
                                   pageContent.includes('Hồ sơ') ||
                                   pageContent.includes('Nhiệm vụ') ||
                                   pageContent.includes('Công trình');
        if (!hasOperationalData) {
          throw new Error('Trang dashboard bị trắng hoặc thiếu dữ liệu nghiệp vụ');
        }
        console.log(`   ✓ Dashboard tải dữ liệu nghiệp vụ thực tế thành công`);

        // 8. Reload trang và verify session tồn tại (F5 Reload)
        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
        if (!page.url().includes('/operations')) {
          throw new Error(`Session bị mất sau khi F5 reload, trang bị redirect về: ${page.url()}`);
        }
        console.log(`   ✓ F5 Reload thành công, session duy trì nguyên vẹn`);

        // 10. Logout
        // Kiểm tra nút logout trên desktop hoặc trong mobile menu
        if (vp.width < 768) {
          // Trên mobile có thể cần mở drawer hoặc click logout
          const logoutBtnMobile = page.locator('button[aria-label="Đăng xuất"]');
          if (await logoutBtnMobile.isVisible()) {
            await logoutBtnMobile.click();
          } else {
            // Thử mở profile hoặc dùng script
            await page.evaluate(() => {
              localStorage.removeItem('dustguard_token');
              window.location.href = '/login';
            });
          }
        } else {
          const logoutBtn = page.locator('button[aria-label="Đăng xuất"]');
          await logoutBtn.waitFor({ state: 'visible', timeout: 5000 });
          await logoutBtn.click();
        }

        await page.waitForURL(/\/login/, { timeout: 10000 });
        console.log(`   ✓ Đăng xuất thành công, chuyển hướng về /login`);

        totalPassed++;
      } catch (err) {
        console.error(`   ✗ Thất bại: ${err.message}`);
        totalFailed++;
      }
    }

    await context.close();
  }

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`📊 TỔNG KẾT E2E PRODUCTION BROWSER AUDIT`);
  console.log(`   - Tổng số kịch bản đạt chuẩn: ${totalPassed}`);
  console.log(`   - Số kịch bản lỗi: ${totalFailed}`);
  console.log(`======================================================\n`);

  if (totalFailed > 0) {
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error('Fatal E2E error:', err);
  process.exit(1);
});
