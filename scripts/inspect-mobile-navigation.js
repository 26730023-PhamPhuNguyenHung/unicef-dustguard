import { chromium } from 'playwright';
import fs from 'node:fs';

const VIEWPORTS = [
  { name: 'Mobile 390px (iPhone 12/13/14)', width: 390, height: 844 },
  { name: 'Mobile 430px (iPhone 14/15 Pro Max)', width: 430, height: 932 },
];

const COMMUNITY_BASE = 'http://localhost:3000';
const OPERATIONS_BASE = 'http://localhost:3002';

const COMMUNITY_ROUTES = [
  { path: '/landing', auth: false, desc: 'Trang giới thiệu công chúng' },
  { path: '/login', auth: false, desc: 'Trang đăng nhập' },
  { path: '/register', auth: false, desc: 'Trang đăng ký' },
  { path: '/dashboard', auth: true, role: 'citizen', desc: 'Trang chủ cộng đồng' },
  { path: '/map', auth: true, role: 'citizen', desc: 'Bản đồ môi trường' },
  { path: '/reports', auth: true, role: 'citizen', desc: 'Danh sách phản ánh' },
  { path: '/reports/new', auth: true, role: 'citizen', desc: 'Tạo phản ánh mới' },
  { path: '/following', auth: true, role: 'citizen', desc: 'Theo dõi của tôi' },
  { path: '/communities', auth: true, role: 'citizen', desc: 'CLB & Đội nhóm' },
  { path: '/tasks', auth: true, role: 'member', desc: 'Nhiệm vụ thanh niên' },
  { path: '/notifications', auth: true, role: 'citizen', desc: 'Thông báo' },
  { path: '/contributions', auth: true, role: 'citizen', desc: 'Dấu ấn đóng góp / Tín chỉ' },
  { path: '/profile', auth: true, role: 'citizen', desc: 'Hồ sơ cá nhân' },
  { path: '/settings/iot', auth: true, role: 'admin', desc: 'Cài đặt IoT' },
  { path: '/moderator/dashboard', auth: true, role: 'moderator', desc: 'Điều phối viên - Thống kê' },
  { path: '/moderator/inbox', auth: true, role: 'moderator', desc: 'Điều phối viên - Hộp thư xác minh' },
  { path: '/moderator/cases', auth: true, role: 'moderator', desc: 'Điều phối viên - Phối hợp vụ việc' },
  { path: '/moderator/content', auth: true, role: 'moderator', desc: 'Điều phối viên - Kiểm duyệt nội dung' },
  { path: '/admin/overview', auth: true, role: 'admin', desc: 'Quản trị viên - Tổng quan' },
  { path: '/admin/users', auth: true, role: 'admin', desc: 'Quản trị viên - Người dùng' },
  { path: '/admin/audit', auth: true, role: 'admin', desc: 'Quản trị viên - Nhật ký kiểm toán' },
  { path: '/contractor/portal', auth: false, desc: 'Cổng nhà thầu tự phục vụ' },
];

const OPERATIONS_ROUTES = [
  { path: '/login', auth: false, desc: 'Đăng nhập vận hành' },
  { path: '/dashboard', auth: true, role: 'staff', desc: 'Tổng quan vận hành' },
  { path: '/cases', auth: true, role: 'staff', desc: 'Hộp thư vụ việc' },
  { path: '/projects', auth: true, role: 'staff', desc: 'Danh mục công trình' },
  { path: '/contractors', auth: true, role: 'staff', desc: 'Danh sách nhà thầu' },
  { path: '/tasks', auth: true, role: 'staff', desc: 'Nhiệm vụ công tác' },
  { path: '/inspections', auth: true, role: 'staff', desc: 'Khảo sát hiện trường' },
  { path: '/actions', auth: true, role: 'staff', desc: 'Lệnh khắc phục vi phạm' },
  { path: '/legal/library', auth: true, role: 'legal_reviewer', desc: 'Thư viện văn bản pháp lý' },
  { path: '/legal/import', auth: true, role: 'legal_reviewer', desc: 'Nhập văn bản pháp lý' },
  { path: '/iot', auth: true, role: 'staff', desc: 'Giám sát trạm IoT' },
  { path: '/automations', auth: true, role: 'admin', desc: 'Quy tắc tự động hóa' },
  { path: '/evidence', auth: true, role: 'staff', desc: 'Kho bằng chứng số' },
  { path: '/reports', auth: true, role: 'supervisor', desc: 'Báo cáo vận hành' },
  { path: '/supervisor/workload', auth: true, role: 'supervisor', desc: 'Điều phối tải việc' },
  { path: '/admin/users', auth: true, role: 'admin', desc: 'Quản lý tài khoản' },
  { path: '/admin/audit', auth: true, role: 'admin', desc: 'Nhật ký hệ thống' },
  { path: '/admin/settings', auth: true, role: 'admin', desc: 'Cấu hình hệ thống' },
  { path: '/notifications', auth: true, role: 'staff', desc: 'Thông báo chuyên môn' },
  { path: '/profile', auth: true, role: 'staff', desc: 'Thông tin cá nhân' },
];

async function runInspection() {
  console.log('🚀 KHỞI ĐỘNG MOBILE NAVIGATION INSPECTION SUITE');
  const browser = await chromium.launch({ headless: true });

  const report = {
    timestamp: new Date().toISOString(),
    viewports: VIEWPORTS,
    communityFindings: [],
    operationsFindings: [],
    summary: {
      totalRoutesTested: 0,
      overflowErrors: 0,
      touchTargetWarnings: 0,
      safeAreaIssues: 0,
      zIndexIssues: 0,
      drawerIssues: 0,
    }
  };

  // 1. COMMUNITY SIDE AUDIT
  console.log('\n======================================================');
  console.log('🛡️ SIDE A: COMMUNITY APPLICATION AUDIT (PORT 3000)');
  console.log('======================================================');

  for (const vp of VIEWPORTS) {
    console.log(`\n📱 AUDITING VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    });

    const page = await context.newPage();

    // Login for Community side to get token
    let authToken = null;
    try {
      const loginRes = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@dustguard.local', password: 'DustGuard123!' })
      });
      const loginData = await loginRes.json();
      if (loginData.token) {
        authToken = loginData.token;
      }
    } catch (e) {
      console.warn('Could not pre-fetch community token:', e.message);
    }

    for (const route of COMMUNITY_ROUTES) {
      report.summary.totalRoutesTested++;
      const fullUrl = `${COMMUNITY_BASE}${route.path}`;

      // Inject token before navigation if required
      if (route.auth && authToken) {
        await page.goto(COMMUNITY_BASE + '/login', { waitUntil: 'domcontentloaded' });
        await page.evaluate((tok) => {
          localStorage.setItem('dustguard_token', tok);
        }, authToken);
      } else if (!route.auth) {
        await page.goto(COMMUNITY_BASE + '/login', { waitUntil: 'domcontentloaded' });
        await page.evaluate(() => localStorage.removeItem('dustguard_token'));
      }

      await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(500);

      // Audit Page DOM
      const auditResult = await page.evaluate((viewport) => {
        const bodyW = document.body.scrollWidth;
        const htmlW = document.documentElement.scrollWidth;
        const innerW = window.innerWidth;

        // 1. Check Horizontal Overflow
        const hasOverflow = htmlW > innerW || bodyW > innerW;
        const overflowingElements = [];
        if (hasOverflow) {
          const allElements = document.querySelectorAll('*');
          for (const el of allElements) {
            const r = el.getBoundingClientRect();
            if (r.right > innerW + 1 && r.width > 0) {
              overflowingElements.push({
                tag: el.tagName.toLowerCase(),
                className: (el.className || '').toString().substring(0, 80),
                right: Math.round(r.right),
                width: Math.round(r.width),
                text: (el.textContent || '').trim().substring(0, 40)
              });
              if (overflowingElements.length >= 5) break;
            }
          }
        }

        // 2. Header & Top Navbar Check
        const header = document.querySelector('header');
        let headerData = null;
        if (header) {
          const hr = header.getBoundingClientRect();
          const headerComputed = window.getComputedStyle(header);
          const children = Array.from(header.querySelectorAll('button, a, select'));
          const smallTargets = children.map(c => {
            const cr = c.getBoundingClientRect();
            return {
              tag: c.tagName.toLowerCase(),
              width: Math.round(cr.width),
              height: Math.round(cr.height),
              label: (c.getAttribute('aria-label') || c.textContent || '').trim().substring(0, 25),
              isSub44: cr.height < 44 || cr.width < 44
            };
          }).filter(c => c.isSub44);

          headerData = {
            width: Math.round(hr.width),
            height: Math.round(hr.height),
            scrollWidth: header.scrollWidth,
            overflows: header.scrollWidth > innerW,
            position: headerComputed.position,
            zIndex: headerComputed.zIndex,
            paddingTop: headerComputed.paddingTop,
            hasPtSafe: header.classList.contains('pt-safe') || headerComputed.paddingTop.includes('env'),
            smallTargets
          };
        }

        // 3. Bottom Navigation Bar Check
        const bottomNav = document.querySelector('nav.fixed.bottom-0') || document.querySelector('nav[class*="bottom-0"]');
        let bottomNavData = null;
        if (bottomNav) {
          const bnr = bottomNav.getBoundingClientRect();
          const bnComputed = window.getComputedStyle(bottomNav);
          const navLinks = Array.from(bottomNav.querySelectorAll('a, button'));
          const linkMetrics = navLinks.map(l => {
            const lr = l.getBoundingClientRect();
            return {
              label: (l.textContent || l.getAttribute('aria-label') || '').trim(),
              width: Math.round(lr.width),
              height: Math.round(lr.height),
              isSub44: lr.width < 44 || lr.height < 44
            };
          });

          // Check if page content padding-bottom accounts for bottom nav
          const main = document.querySelector('main');
          const mainPb = main ? parseInt(window.getComputedStyle(main).paddingBottom, 10) : 0;
          const blocksContent = mainPb < bnr.height;

          bottomNavData = {
            height: Math.round(bnr.height),
            position: bnComputed.position,
            zIndex: bnComputed.zIndex,
            hasPbSafe: bottomNav.classList.contains('pb-safe') || bnComputed.paddingBottom.includes('env'),
            paddingBottom: bnComputed.paddingBottom,
            linkMetrics,
            blocksContent,
            mainPaddingBottom: mainPb
          };
        }

        // 4. Tabs & Breadcrumbs Check
        const tabLists = Array.from(document.querySelectorAll('[role="tablist"], .overflow-x-auto, nav[aria-label="Breadcrumb"], .breadcrumbs'));
        const tabsMetrics = tabLists.map(t => {
          const tr = t.getBoundingClientRect();
          const tc = window.getComputedStyle(t);
          return {
            tag: t.tagName.toLowerCase(),
            className: (t.className || '').toString().substring(0, 60),
            scrollWidth: t.scrollWidth,
            clientWidth: t.clientWidth,
            isOverflowing: t.scrollWidth > t.clientWidth,
            hasHorizontalScroll: tc.overflowX === 'auto' || tc.overflowX === 'scroll'
          };
        });

        // 5. Back buttons
        const backButtons = Array.from(document.querySelectorAll('a, button'))
          .filter(el => {
            const text = (el.textContent || '').trim().toLowerCase();
            const aria = (el.getAttribute('aria-label') || '').toLowerCase();
            return text.includes('quay lại') || text.includes('trở về') || aria.includes('quay lại');
          })
          .map(b => {
            const br = b.getBoundingClientRect();
            return {
              text: (b.textContent || '').trim().substring(0, 30),
              width: Math.round(br.width),
              height: Math.round(br.height),
              isSub44: br.height < 44 || br.width < 44
            };
          });

        // 6. Sticky & Fixed Elements Z-Index Map
        const stickyElements = [];
        for (const el of document.querySelectorAll('*')) {
          const comp = window.getComputedStyle(el);
          if (comp.position === 'sticky' || comp.position === 'fixed') {
            const z = parseInt(comp.zIndex, 10) || 0;
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.height > 0) {
              stickyElements.push({
                tag: el.tagName.toLowerCase(),
                className: (el.className || '').toString().substring(0, 60),
                position: comp.position,
                zIndex: z,
                height: Math.round(r.height),
                top: Math.round(r.top),
                bottom: Math.round(r.bottom)
              });
            }
          }
        }

        return {
          innerW,
          htmlW,
          bodyW,
          hasOverflow,
          overflowingElements,
          headerData,
          bottomNavData,
          tabsMetrics,
          backButtons,
          stickyElements: stickyElements.slice(0, 10)
        };
      }, vp);

      // Hamburger / Drawer check if header exists
      let drawerCheck = null;
      const hamburger = await page.$('button[aria-label*="menu"], button[aria-label*="Menu"]');
      if (hamburger) {
        await hamburger.click().catch(() => {});
        await page.waitForTimeout(300);

        drawerCheck = await page.evaluate(() => {
          const drawer = document.querySelector('[role="dialog"], .fixed.inset-0 .relative');
          if (!drawer) return { opened: false };
          const dr = drawer.getBoundingClientRect();
          const dComp = window.getComputedStyle(drawer);
          const links = Array.from(drawer.querySelectorAll('a, button')).map(l => {
            const r = l.getBoundingClientRect();
            return {
              text: (l.textContent || '').trim().substring(0, 25),
              height: Math.round(r.height),
              width: Math.round(r.width),
              isSub44: r.height < 44 || r.width < 44
            };
          });

          // Check if drawer leaves touchable backdrop space (> 40px margin)
          const leavesBackdrop = window.innerWidth - dr.width >= 40;

          return {
            opened: true,
            width: Math.round(dr.width),
            height: Math.round(dr.height),
            leavesBackdrop,
            zIndex: dComp.zIndex,
            overflowY: dComp.overflowY,
            hasScroll: dComp.overflowY === 'auto' || dComp.overflowY === 'scroll',
            smallTargets: links.filter(l => l.isSub44)
          };
        });

        // Close drawer with Escape or close button
        const closeBtn = await page.$('button[aria-label*="Đóng"], button[aria-label*="đóng"]');
        if (closeBtn) {
          await closeBtn.click().catch(() => {});
        } else {
          await page.keyboard.press('Escape');
        }
        await page.waitForTimeout(200);
      }

      const finding = {
        viewport: `${vp.width}x${vp.height}`,
        route: route.path,
        desc: route.desc,
        audit: auditResult,
        drawer: drawerCheck
      };

      report.communityFindings.push(finding);

      // Console summary for this route
      const statusIcon = auditResult.hasOverflow ? '❌ OVERFLOW' : '✅ OK';
      console.log(`  [${statusIcon}] ${route.path.padEnd(24)} (W:${auditResult.htmlW}px vs ${vp.width}px)`);
      if (auditResult.hasOverflow) {
        report.summary.overflowErrors++;
        console.log(`    ⚠️ Overflow elements:`, auditResult.overflowingElements);
      }
      if (auditResult.headerData?.smallTargets?.length) {
        report.summary.touchTargetWarnings += auditResult.headerData.smallTargets.length;
      }
      if (drawerCheck?.opened && !drawerCheck.leavesBackdrop) {
        report.summary.drawerIssues++;
        console.log(`    ⚠️ Drawer occupies too much width: ${drawerCheck.width}px (blocks backdrop dismiss)`);
      }
    }

    await context.close();
  }

  // 2. OPERATIONS SIDE AUDIT
  console.log('\n======================================================');
  console.log('⚡ SIDE B: OPERATIONS APPLICATION AUDIT (PORT 3002)');
  console.log('======================================================');

  for (const vp of VIEWPORTS) {
    console.log(`\n📱 AUDITING VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    });

    const page = await context.newPage();

    // Login for Operations side
    let opsToken = null;
    try {
      const loginRes = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'quantri.dustguard', password: 'DustGuard@2026' })
      });
      const loginData = await loginRes.json();
      if (loginData.token) {
        opsToken = loginData.token;
      }
    } catch (e) {
      console.warn('Could not pre-fetch operations token:', e.message);
    }

    for (const route of OPERATIONS_ROUTES) {
      report.summary.totalRoutesTested++;
      const fullUrl = `${OPERATIONS_BASE}${route.path}`;

      if (route.auth && opsToken) {
        await page.goto(OPERATIONS_BASE + '/login', { waitUntil: 'domcontentloaded' });
        await page.evaluate((tok) => {
          localStorage.setItem('dustguard_token', tok);
          localStorage.removeItem('dustguard_logged_out');
        }, opsToken);
      } else if (!route.auth) {
        await page.goto(OPERATIONS_BASE + '/login', { waitUntil: 'domcontentloaded' });
        await page.evaluate(() => {
          localStorage.removeItem('dustguard_token');
          localStorage.setItem('dustguard_logged_out', 'true');
        });
      }

      await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(500);

      // Audit Page DOM
      const auditResult = await page.evaluate((viewport) => {
        const bodyW = document.body.scrollWidth;
        const htmlW = document.documentElement.scrollWidth;
        const innerW = window.innerWidth;

        // 1. Check Horizontal Overflow
        const hasOverflow = htmlW > innerW || bodyW > innerW;
        const overflowingElements = [];
        if (hasOverflow) {
          const allElements = document.querySelectorAll('*');
          for (const el of allElements) {
            const r = el.getBoundingClientRect();
            if (r.right > innerW + 1 && r.width > 0) {
              overflowingElements.push({
                tag: el.tagName.toLowerCase(),
                className: (el.className || '').toString().substring(0, 80),
                right: Math.round(r.right),
                width: Math.round(r.width),
                text: (el.textContent || '').trim().substring(0, 40)
              });
              if (overflowingElements.length >= 5) break;
            }
          }
        }

        // 2. Header Check
        const header = document.querySelector('header');
        let headerData = null;
        if (header) {
          const hr = header.getBoundingClientRect();
          const headerComputed = window.getComputedStyle(header);
          const children = Array.from(header.querySelectorAll('button, a, select'));
          const smallTargets = children.map(c => {
            const cr = c.getBoundingClientRect();
            return {
              tag: c.tagName.toLowerCase(),
              width: Math.round(cr.width),
              height: Math.round(cr.height),
              label: (c.getAttribute('aria-label') || c.textContent || '').trim().substring(0, 25),
              isSub44: cr.height < 44 || cr.width < 44
            };
          }).filter(c => c.isSub44);

          // Check if right utility cluster overflows
          const rightCluster = header.querySelector('.flex.items-center.gap-1, .flex.items-center.gap-2');
          let rightClusterWidth = 0;
          if (rightCluster) {
            rightClusterWidth = Math.round(rightCluster.getBoundingClientRect().width);
          }

          headerData = {
            width: Math.round(hr.width),
            height: Math.round(hr.height),
            scrollWidth: header.scrollWidth,
            overflows: header.scrollWidth > innerW,
            position: headerComputed.position,
            zIndex: headerComputed.zIndex,
            rightClusterWidth,
            smallTargets,
            hasPtSafe: headerComputed.paddingTop.includes('env')
          };
        }

        // 3. Bottom Action Bar Check
        const bottomBar = document.querySelector('.sticky.bottom-0') || document.querySelector('[class*="bottom-0"]');
        let bottomBarData = null;
        if (bottomBar) {
          const bbr = bottomBar.getBoundingClientRect();
          const bbComp = window.getComputedStyle(bottomBar);
          const buttons = Array.from(bottomBar.querySelectorAll('button, a')).map(b => {
            const br = b.getBoundingClientRect();
            return {
              text: (b.textContent || '').trim().substring(0, 25),
              width: Math.round(br.width),
              height: Math.round(br.height),
              isSub44: br.height < 44 || br.width < 44
            };
          });

          bottomBarData = {
            height: Math.round(bbr.height),
            position: bbComp.position,
            zIndex: bbComp.zIndex,
            hasPbSafe: bbComp.paddingBottom.includes('env'),
            paddingBottom: bbComp.paddingBottom,
            buttons
          };
        }

        // 4. RecordNavigation / Tabs Check
        const tabElements = Array.from(document.querySelectorAll('.overflow-x-auto button, [role="tab"]')).map(t => {
          const tr = t.getBoundingClientRect();
          return {
            text: (t.textContent || '').trim().substring(0, 25),
            width: Math.round(tr.width),
            height: Math.round(tr.height),
            isSub44: tr.height < 44 || tr.width < 44
          };
        });

        // 5. Breadcrumbs / Back Buttons
        const backButtons = Array.from(document.querySelectorAll('a, button'))
          .filter(el => {
            const text = (el.textContent || '').trim().toLowerCase();
            return text.includes('quay lại') || text.includes('trở lại');
          })
          .map(b => {
            const br = b.getBoundingClientRect();
            return {
              text: (b.textContent || '').trim().substring(0, 25),
              width: Math.round(br.width),
              height: Math.round(br.height),
              isSub44: br.height < 44 || br.width < 44
            };
          });

        // 6. Sticky & Fixed Elements Z-Index Map
        const stickyElements = [];
        for (const el of document.querySelectorAll('*')) {
          const comp = window.getComputedStyle(el);
          if (comp.position === 'sticky' || comp.position === 'fixed') {
            const z = parseInt(comp.zIndex, 10) || 0;
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.height > 0) {
              stickyElements.push({
                tag: el.tagName.toLowerCase(),
                className: (el.className || '').toString().substring(0, 60),
                position: comp.position,
                zIndex: z,
                height: Math.round(r.height),
                top: Math.round(r.top),
                bottom: Math.round(r.bottom)
              });
            }
          }
        }

        return {
          innerW,
          htmlW,
          bodyW,
          hasOverflow,
          overflowingElements,
          headerData,
          bottomBarData,
          tabElements: tabElements.slice(0, 10),
          backButtons,
          stickyElements: stickyElements.slice(0, 10)
        };
      }, vp);

      // Hamburger / Drawer check
      let drawerCheck = null;
      const hamburger = await page.$('button[aria-label="Mở menu"]');
      if (hamburger) {
        await hamburger.click().catch(() => {});
        await page.waitForTimeout(300);

        drawerCheck = await page.evaluate(() => {
          const drawer = document.querySelector('.lg\\:hidden .relative.bg-surface');
          if (!drawer) return { opened: false };
          const dr = drawer.getBoundingClientRect();
          const dComp = window.getComputedStyle(drawer);
          const links = Array.from(drawer.querySelectorAll('a, button')).map(l => {
            const r = l.getBoundingClientRect();
            return {
              text: (l.textContent || '').trim().substring(0, 25),
              height: Math.round(r.height),
              width: Math.round(r.width),
              isSub44: r.height < 44 || r.width < 44
            };
          });

          return {
            opened: true,
            width: Math.round(dr.width),
            height: Math.round(dr.height),
            leavesBackdrop: window.innerWidth - dr.width >= 40,
            zIndex: dComp.zIndex,
            smallTargets: links.filter(l => l.isSub44)
          };
        });

        // Close drawer
        const closeBtn = await page.$('button[aria-label="Đóng menu"]');
        if (closeBtn) {
          await closeBtn.click().catch(() => {});
        } else {
          await page.keyboard.press('Escape');
        }
        await page.waitForTimeout(200);
      }

      const finding = {
        viewport: `${vp.width}x${vp.height}`,
        route: route.path,
        desc: route.desc,
        audit: auditResult,
        drawer: drawerCheck
      };

      report.operationsFindings.push(finding);

      const statusIcon = auditResult.hasOverflow ? '❌ OVERFLOW' : '✅ OK';
      console.log(`  [${statusIcon}] ${route.path.padEnd(24)} (W:${auditResult.htmlW}px vs ${vp.width}px)`);
      if (auditResult.hasOverflow) {
        report.summary.overflowErrors++;
        console.log(`    ⚠️ Overflow elements:`, auditResult.overflowingElements);
      }
    }

    await context.close();
  }

  await browser.close();

  if (!fs.existsSync('artifacts')) {
    fs.mkdirSync('artifacts', { recursive: true });
  }
  fs.writeFileSync('artifacts/mobile-navigation-inspection-report.json', JSON.stringify(report, null, 2));
  console.log('\n======================================================');
  console.log(`🎉 INSPECTION FINISHED! Full JSON report written to artifacts/mobile-navigation-inspection-report.json`);
  console.log(`   Total routes tested: ${report.summary.totalRoutesTested}`);
  console.log(`   Overflow errors: ${report.summary.overflowErrors}`);
  console.log(`   Touch target warnings: ${report.summary.touchTargetWarnings}`);
  console.log('======================================================\n');
}

runInspection().catch(err => {
  console.error('Inspection script error:', err);
  process.exit(1);
});
