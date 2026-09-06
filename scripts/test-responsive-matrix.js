import { createRequire } from 'module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('d:/07-Competitions-Hackathons/unicef-dustguard/app/node_modules/playwright');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BASE_URL = process.env.BASE_URL || 'https://dustguard.phamphunguyenhung.com';

const VIEWPORTS = [
  { name: 'Mobile Compact (Android)', width: 360, height: 800 },
  { name: 'Mobile Standard (iPhone 12/13/14)', width: 390, height: 844 },
  { name: 'Mobile Large (iPhone 14/15 Pro Max)', width: 430, height: 932 },
  { name: 'Tablet (iPad Mini / Portrait)', width: 768, height: 1024 },
  { name: 'Laptop Scale 125% (Windows HD)', width: 1280, height: 720 },
  { name: 'Laptop Standard (1366x768 VN Common)', width: 1366, height: 768 },
  { name: 'Desktop High-Res (1440x900)', width: 1440, height: 900 }
];

const ROUTES_SIDE_A = [
  { path: '/', name: 'Landing Page' },
  { path: '/landing', name: 'Landing Page Alias' },
  { path: '/login', name: 'Đăng nhập Side A' },
  { path: '/login?side=operations', name: 'Đăng nhập Chuyển Tab Side B' },
  { path: '/dashboard', name: 'Tổng quan Cộng đồng' },
  { path: '/reports', name: 'Danh sách phản ánh' },
  { path: '/reports/new', name: 'Gửi phản ánh mới' },
  { path: '/map', name: 'Bản đồ ô nhiễm bụi' },
  { path: '/communities', name: 'Mạng lưới cộng đồng thanh niên' },
  { path: '/tasks', name: 'Nhiệm vụ giám sát' },
  { path: '/contributions', name: 'Hành trình đóng góp & Tín chỉ' },
  { path: '/notifications', name: 'Hộp thư thông báo' },
  { path: '/profile', name: 'Hồ sơ cá nhân' },
  { path: '/contractor', name: 'Cổng Đơn vị thi công' }
];

const ROUTES_SIDE_B = [
  { path: '/operations/dashboard', name: 'Side B: Bàn làm việc Điều hành' },
  { path: '/operations/cases', name: 'Side B: Hộp thư Vụ việc' },
  { path: '/operations/projects', name: 'Side B: Quản lý Công trình' },
  { path: '/operations/contractors', name: 'Side B: Quản lý Nhà thầu' },
  { path: '/operations/tasks', name: 'Side B: Quản lý Nhiệm vụ' },
  { path: '/operations/inspections', name: 'Side B: Thanh tra Hiện trường' },
  { path: '/operations/actions', name: 'Side B: Biện pháp Khắc phục' },
  { path: '/operations/legal/library', name: 'Side B: Thư viện Pháp lý' },
  { path: '/operations/legal/import', name: 'Side B: Nhập văn bản pháp lý' },
  { path: '/operations/iot', name: 'Side B: Thiết bị IoT & Cảnh báo' },
  { path: '/operations/evidence', name: 'Side B: Bằng chứng số SHA-256' },
  { path: '/operations/reports', name: 'Side B: Báo cáo Vận hành' },
  { path: '/operations/supervisor/workload', name: 'Side B: Điều phối Tải việc' },
  { path: '/operations/admin/users', name: 'Side B: Quản trị Người dùng' },
  { path: '/operations/admin/audit', name: 'Side B: Nhật ký Hệ thống' },
  { path: '/operations/admin/settings', name: 'Side B: Cấu hình Hệ thống' }
];

async function runResponsiveAudit() {
  console.log('================================================================');
  console.log('🛡️  DUSTGUARD VN — QA AUTOMATED RESPONSIVE & ROUTE INTEGRITY AUDIT');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log(`📐 Viewports: ${VIEWPORTS.length} breakpoints (360px -> 1440px)`);
  console.log(`🛣️  Total Routes: ${ROUTES_SIDE_A.length} (Side A/Landing) + ${ROUTES_SIDE_B.length} (Side B) = ${ROUTES_SIDE_A.length + ROUTES_SIDE_B.length}`);
  console.log('================================================================\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // 1. Setup Auth Tokens in localStorage (Side A & Side B)
  console.log('🔑 Thiết lập phiên xác thực hợp lệ trên cả 2 phân hệ...');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    // Side A Moderator / Citizen Auth Token
    const sideAUser = {
      id: 'usr_moderator',
      fullName: 'Điều phối viên Môi trường',
      email: 'mod@dustguard.vn',
      role: 'moderator',
      district: 'Hà Nội',
      ward: 'Hoàn Kiếm',
      permissions: [
        'observation:create', 'case:follow', 'task:view', 'notification:view',
        'contribution:view', 'profile:manage', 'moderator:inbox', 'moderator:verify',
        'moderator:coordinate_cases', 'moderator:moderate_content', 'moderator:stats'
      ]
    };
    localStorage.setItem('dg_auth_token', 'dev_mock_token_moderator');
    localStorage.setItem('dg_auth_user', JSON.stringify(sideAUser));

    // Side B Operations Staff Auth Token
    localStorage.setItem('dustguard_token', 'dev_mock_token_operations_staff');
    localStorage.setItem('dustguard_dev_user_id', 'staff1');
    localStorage.removeItem('dustguard_logged_out');
  });

  const auditResults = {
    testedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    totalChecks: 0,
    passedChecks: 0,
    failedChecks: 0,
    warnChecks: 0,
    anomalies: [],
    routesAudited: []
  };

  const allRoutes = [
    ...ROUTES_SIDE_A.map(r => ({ ...r, side: 'A' })),
    ...ROUTES_SIDE_B.map(r => ({ ...r, side: 'B' }))
  ];

  for (const vp of VIEWPORTS) {
    console.log(`\n----------------------------------------------------------------`);
    console.log(`📱 KIỂM TRA VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`----------------------------------------------------------------`);
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const r of allRoutes) {
      auditResults.totalChecks++;
      const url = `${BASE_URL}${r.path}`;
      const consoleErrors = [];
      const pageErrors = [];

      const onConsole = (msg) => {
        if (msg.type() === 'error') {
          const txt = msg.text();
          // Filter out standard tile OSM and external network CDN noise
          if (!txt.includes('tile.openstreetmap') && !txt.includes('ERR_NAME_NOT_RESOLVED') && !txt.includes('favicon')) {
            consoleErrors.push(txt);
          }
        }
      };

      const onPageError = (err) => {
        pageErrors.push(err.message);
      };

      page.on('console', onConsole);
      page.on('pageerror', onPageError);

      try {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(400); // Chờ render DOM

        const status = response ? response.status() : 0;

        // Đánh giá DOM tại runtime
        const metrics = await page.evaluate((isSideB) => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const innerWidth = window.innerWidth;
          const hasHorizontalOverflow = scrollWidth > innerWidth + 1.5;

          // Kiểm tra trắng trang / crash
          const root = document.getElementById('root');
          const isBlankScreen = !root || root.children.length === 0 || root.innerText.trim().length === 0;

          // Kiểm tra Priority Queue table (Side B)
          let tableInfo = null;
          const table = document.querySelector('table');
          if (table) {
            const wrapper = table.parentElement;
            tableInfo = {
              hasTable: true,
              tableScrollWidth: table.scrollWidth,
              wrapperOverflowX: wrapper ? window.getComputedStyle(wrapper).overflowX : 'none',
              wrapperWidth: wrapper ? wrapper.clientWidth : 0
            };
          }

          // Kiểm tra touch target nhỏ (< 32px) trên mobile
          let smallTargetsCount = 0;
          if (innerWidth < 768) {
            const interactives = Array.from(document.querySelectorAll('button, a.btn, input, select'));
            for (const el of interactives) {
              const rect = el.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.top <= window.innerHeight) {
                if (rect.width < 32 || rect.height < 32) smallTargetsCount++;
              }
            }
          }

          return {
            scrollWidth,
            innerWidth,
            hasHorizontalOverflow,
            isBlankScreen,
            tableInfo,
            smallTargetsCount,
            title: document.title
          };
        }, r.side === 'B');

        const hasIssues = metrics.hasHorizontalOverflow || metrics.isBlankScreen || pageErrors.length > 0;

        if (hasIssues) {
          auditResults.failedChecks++;
          const reason = [];
          if (metrics.hasHorizontalOverflow) reason.push(`Tràn ngang: ${metrics.scrollWidth}px > ${metrics.innerWidth}px`);
          if (metrics.isBlankScreen) reason.push('TRẮNG TRANG (Root DOM rỗng)');
          if (pageErrors.length > 0) reason.push(`Page Errors: ${pageErrors.join('; ')}`);

          console.error(`  ❌ [FAIL] ${r.path.padEnd(28)} | ${reason.join(' | ')}`);
          auditResults.anomalies.push({
            viewport: vp.name,
            viewportDimensions: `${vp.width}x${vp.height}`,
            route: r.path,
            routeName: r.name,
            status,
            issues: reason
          });
        } else {
          auditResults.passedChecks++;
          const warnText = consoleErrors.length > 0 ? ` (⚠️ ${consoleErrors.length} console warn/err)` : '';
          console.log(`  ✅ [PASS] ${r.path.padEnd(28)} | W=${metrics.scrollWidth}px (OK) | DOM: OK${warnText}`);
          if (consoleErrors.length > 0) {
            auditResults.warnChecks++;
          }
        }

      } catch (err) {
        auditResults.failedChecks++;
        console.error(`  ❌ [ERROR] ${r.path.padEnd(28)} | Ngoại lệ: ${err.message}`);
        auditResults.anomalies.push({
          viewport: vp.name,
          viewportDimensions: `${vp.width}x${vp.height}`,
          route: r.path,
          routeName: r.name,
          issues: [`Timeout/Navigation Error: ${err.message}`]
        });
      } finally {
        page.off('console', onConsole);
        page.off('pageerror', onPageError);
      }
    }
  }

  await browser.close();

  // Lưu kết quả JSON
  const outDir = path.join(rootDir, 'artifacts');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outFile = path.join(outDir, 'responsive-matrix-results.json');
  fs.writeFileSync(outFile, JSON.stringify(auditResults, null, 2));

  console.log('\n================================================================');
  console.log(`📊 TỔNG KẾT KIỂM THỬ: ${auditResults.passedChecks}/${auditResults.totalChecks} PASS | ${auditResults.failedChecks} FAIL | ${auditResults.warnChecks} WARN`);
  console.log(`📁 Báo cáo chi tiết JSON lưu tại: ${outFile}`);
  if (auditResults.anomalies.length > 0) {
    console.log(`⚠️  Phát hiện ${auditResults.anomalies.length} vấn đề bất thường:`);
    console.log(JSON.stringify(auditResults.anomalies, null, 2));
  } else {
    console.log('🎉 100% CÁC ROUTE VÀ VIEWPORT ĐẠT CHUẨN, 0 TRÀN NGANG, 0 TRẮNG TRANG!');
  }
  console.log('================================================================\n');

  return auditResults;
}

runResponsiveAudit().catch((err) => {
  console.error('Lỗi nghiêm trọng khi thực thi:', err);
  process.exit(1);
});
