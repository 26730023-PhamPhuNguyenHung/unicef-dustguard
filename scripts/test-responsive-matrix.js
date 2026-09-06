import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('d:/07-Competitions-Hackathons/unicef-dustguard/app/node_modules/playwright');

const VIEWPORTS = [
  { name: 'Mobile 390x844', width: 390, height: 844 },
  { name: 'Mobile 430x932', width: 430, height: 932 },
  { name: 'Tablet 768x1024', width: 768, height: 1024 },
  { name: 'Laptop 1280x720 (125% scale)', width: 1280, height: 720 },
  { name: 'Desktop 1440x900', width: 1440, height: 900 }
];

const ROUTES = [
  '/dashboard',
  '/reports',
  '/reports/new',
  '/map',
  '/communities',
  '/tasks',
  '/contributions',
  '/notifications',
  '/profile'
];

async function runResponsiveAudit() {
  console.log('=== BẮT ĐẦU KIỂM TRA RESPONSIVE MATRIX TRÊN SIDE A (PORT 3000) ===\n');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  // Đăng nhập vai trò Moderator / Member để truy cập được các route có phân quyền
  const page = await context.newPage();
  
  // Thiết lập auth token trong localStorage của trang web
  await page.goto('http://localhost:3000/dashboard');
  await page.evaluate(() => {
    const user = {
      id: 'usr_moderator',
      fullName: 'Điều phối viên Môi trường',
      email: 'mod@dustguard.vn',
      role: 'moderator',
      district: 'Quận 7',
      ward: 'Tân Phú',
      permissions: [
        'observation:create',
        'case:follow',
        'task:view',
        'notification:view',
        'contribution:view',
        'profile:manage',
        'moderator:inbox',
        'moderator:verify',
        'moderator:coordinate_cases',
        'moderator:moderate_content',
        'moderator:stats'
      ]
    };
    localStorage.setItem('dg_auth_token', 'dev_mock_token_moderator');
    localStorage.setItem('dg_auth_user', JSON.stringify(user));
  });

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const anomalies = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Kiểm tra Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const route of ROUTES) {
      totalTests++;
      const url = `http://localhost:3000${route}`;
      const consoleErrors = [];

      const onConsole = (msg) => {
        if (msg.type() === 'error') {
          // Bỏ qua lỗi tile map offline hoặc các lỗi không ảnh hưởng
          if (!msg.text().includes('tile.openstreetmap') && !msg.text().includes('ERR_NAME_NOT_RESOLVED')) {
            consoleErrors.push(msg.text());
          }
        }
      };
      page.on('console', onConsole);

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
        await page.waitForTimeout(600); // Chờ render DOM và CSS

        // 1. Kiểm tra tràn ngang (Horizontal Overflow)
        const overflow = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const innerWidth = window.innerWidth;
          const hasHorizontalOverflow = scrollWidth > innerWidth + 1; // Dung sai 1px sub-pixel
          return {
            scrollWidth,
            innerWidth,
            hasHorizontalOverflow
          };
        });

        // 2. Kiểm tra touch target trên mobile (< 768px)
        let smallTouchTargets = 0;
        if (vp.width < 768) {
          smallTouchTargets = await page.evaluate(() => {
            const interactives = Array.from(document.querySelectorAll('button, a, input, select'));
            let count = 0;
            for (const el of interactives) {
              const rect = el.getBoundingClientRect();
              // Chỉ đếm phần tử đang hiển thị trên màn hình
              if (rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.top <= window.innerHeight) {
                if (rect.width < 32 || rect.height < 32) { // Ngưỡng tối thiểu an toàn 32px cho nút inline nhỏ
                  count++;
                }
              }
            }
            return count;
          });
        }

        if (overflow.hasHorizontalOverflow) {
          console.error(`  ❌ [FAIL] ${route} bị tràn ngang! scrollWidth=${overflow.scrollWidth} > innerWidth=${overflow.innerWidth}`);
          anomalies.push({
            viewport: vp.name,
            route,
            issue: `Tràn ngang: ${overflow.scrollWidth}px so với ${overflow.innerWidth}px`
          });
          failedTests++;
        } else if (consoleErrors.length > 0) {
          console.error(`  ⚠️ [WARN] ${route} có ${consoleErrors.length} console errors: ${consoleErrors[0]}`);
          passedTests++;
        } else {
          console.log(`  ✅ [PASS] ${route} | ScrollWidth=${overflow.scrollWidth}px (OK) | 0 Console Error`);
          passedTests++;
        }
      } catch (err) {
        console.error(`  ❌ [ERROR] ${route}:`, err.message);
        failedTests++;
      } finally {
        page.off('console', onConsole);
      }
    }
  }

  await browser.close();

  console.log('\n=============================================');
  console.log(`KẾT QUẢ AUDIT RESPONSIVE: ${passedTests}/${totalTests} PASS | ${failedTests} FAIL`);
  if (anomalies.length > 0) {
    console.log('DANH SÁCH BẤT THƯỜNG:');
    console.log(JSON.stringify(anomalies, null, 2));
  } else {
    console.log('🎉 100% CÁC VIEWPORT VÀ ROUTE ĐỀU HOÀN HẢO KHÔNG BỊ TRÀN NGANG!');
  }
  console.log('=============================================\n');

  return { passedTests, failedTests, totalTests, anomalies };
}

runResponsiveAudit().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
