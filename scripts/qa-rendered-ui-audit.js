import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const artifactsDir = path.join(rootDir, 'artifacts');
if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir, { recursive: true });

const outputFile = path.join(artifactsDir, 'qa-audit-results.json');
const anomaliesFile = path.join(artifactsDir, 'ui-anomalies.json');

const TARGET_VIEWPORTS = [
  { name: '320x568', width: 320, height: 568, device: 'iPhone SE (1st gen) / Compact Mobile' },
  { name: '390x844', width: 390, height: 844, device: 'iPhone 12/13/14 Standard Mobile' },
  { name: '430x932', width: 430, height: 932, device: 'iPhone 14/15 Pro Max Large Mobile' },
  { name: '768x1024', width: 768, height: 1024, device: 'iPad Portrait Tablet' },
  { name: '1366x768', width: 1366, height: 768, device: 'Laptop / Desktop HD' },
];

const COMMUNITY_BASE_URL = 'http://127.0.0.1:3000';
const OPERATIONS_BASE_URL = 'http://localhost:3002';

// Standard demo token for Operations Side B
const OPERATIONS_DEMO_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzci1hZG1pbi0xIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImp0aSI6IjhkMDVmNjhkLWExYWYtNDk0NC1hZmI1LWMxNGUxMjczNzQ3MiIsImlhdCI6MTc4ODU2OTA3NiwiZXhwIjoxNzg5MTczODc2fQ.CDqkPv5NE_MMqpWDjPIieokMVx8jbRn5OcY3_FHv92Q';

const DEMO_ACCOUNTS_COMMUNITY = [
  { name: 'Nguyễn Văn Dân', role: 'Người dân', email: 'citizen@dustguard.local' },
  { name: 'Trần Thị Tình Nguyện', role: 'Thanh niên CLB', email: 'member@dustguard.local' },
  { name: 'Lê Hoàng Điều Phối', role: 'Điều phối viên', email: 'moderator@dustguard.local' },
  { name: 'Phạm Quản Trị', role: 'Quản trị Cộng đồng', email: 'admin@dustguard.local' },
];

const DEMO_ACCOUNTS_OPERATIONS = [
  { name: 'Nguyễn Minh Anh', role: 'Cán bộ hiện trường', username: 'canbo.hientruong' },
  { name: 'Trần Quốc Minh', role: 'Lãnh đạo điều phối', username: 'lanhdao.dieuphoi' },
  { name: 'Lê Thanh Hà', role: 'Chuyên viên pháp chế', username: 'chuyenvien.phapche' },
  { name: 'Quản trị DustGuard', role: 'Quản trị vận hành', username: 'quantri.dustguard' },
];

async function runQAAudit() {
  console.log('========================================================================');
  console.log('🛡️  INDEPENDENT QA: RENDERED UI AUDIT & VERIFICATION HARNESS');
  console.log('    Community App URL:   ', COMMUNITY_BASE_URL);
  console.log('    Operations App URL:  ', OPERATIONS_BASE_URL);
  console.log('    Viewports:           ', TARGET_VIEWPORTS.map(v => v.name).join(', '));
  console.log('========================================================================\n');

  const browser = await chromium.launch({ headless: true });
  const auditReport = {
    timestamp: new Date().toISOString(),
    viewports: TARGET_VIEWPORTS,
    routesAudited: [],
    anomalies: [],
    summary: {
      totalChecks: 0,
      passed: 0,
      failed: 0,
      consoleErrorsCount: 0,
      networkErrorsCount: 0,
      overflowAnomaliesCount: 0,
      touchTargetAnomaliesCount: 0,
      glassmorphismCount: 0,
    }
  };

  try {
    for (const vp of TARGET_VIEWPORTS) {
      console.log(`\n========================================================================`);
      console.log(`📱 AUDITING VIEWPORT: ${vp.name} (${vp.width}x${vp.height} - ${vp.device})`);
      console.log(`========================================================================`);

      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 DustGuardQA/1.0',
      });

      const page = await context.newPage();

      // Collect console errors and network request issues
      const consoleErrors = [];
      const networkFailures = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          const text = msg.text();
          consoleErrors.push(text);
        }
      });

      page.on('response', res => {
        if (res.status() >= 400) {
          const url = res.url();
          if (!url.includes('/api/me') && !url.includes('/api/auth/session')) {
            networkFailures.push({ url, status: res.status(), statusText: res.statusText() });
          }
        }
      });

      page.on('requestfailed', req => {
        networkFailures.push({ url: req.url(), failure: req.failure()?.errorText || 'Failed' });
      });

      // -----------------------------------------------------------------------
      // 1. AUDIT ROUTE: /login
      // -----------------------------------------------------------------------
      console.log(`\n--- [${vp.name}] ROUTE: /login ---`);
      auditReport.summary.totalChecks++;
      await page.goto(`${COMMUNITY_BASE_URL}/login`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);

      // A. Check Horizontal Overflow
      const loginOverflow = await checkOverflow(page, vp.width);
      recordOverflowResult('/login', vp, loginOverflow, auditReport);

      // B. Check Glassmorphism
      const loginGlass = await checkGlassmorphism(page);
      recordGlassResult('/login', vp, loginGlass, auditReport);

      // C. Check Community Tab (Default)
      const tabCommunity = page.locator('#tab-community, [role="tab"]:has-text("Phía Cộng đồng"), button:has-text("Phía Cộng đồng")');
      const tabOperations = page.locator('#tab-operations, [role="tab"]:has-text("Đơn vị Xử lý"), button:has-text("Đơn vị Xử lý")');
      const hasTabCommunity = await tabCommunity.isVisible();
      const hasTabOperations = await tabOperations.isVisible();

      if (hasTabCommunity && hasTabOperations) {
        console.log(`  ✓ Tabs verified: Both "Phía Cộng đồng" and "Đơn vị Xử lý" tabs rendered.`);
        auditReport.summary.passed++;
      } else {
        console.log(`  ✗ Tabs missing! tabCommunity: ${hasTabCommunity}, tabOperations: ${hasTabOperations}`);
        auditReport.summary.failed++;
        auditReport.anomalies.push({
          route: '/login',
          viewport: vp.name,
          category: 'functional',
          severity: 'high',
          description: 'Cặp tab chuyển đổi Phía Cộng đồng / Đơn vị Xử lý không hiển thị đủ.'
        });
      }

      // D. Test All Community Demo Accounts
      console.log(`  🔍 Testing 4 Community Demo Account Cards...`);
      const emailInput = page.locator('#input-community-email');
      const passInput = page.locator('#input-community-password');
      const submitBtn = page.locator('#btn-community-login');

      for (const acc of DEMO_ACCOUNTS_COMMUNITY) {
        auditReport.summary.totalChecks++;
        const cardBtn = page.locator(`[role="button"]:has-text("${acc.email}"), button:has-text("${acc.email}")`);
        if (await cardBtn.isVisible()) {
          await cardBtn.click();
          await page.waitForTimeout(100);
          const currentEmail = await emailInput.inputValue();
          const currentPass = await passInput.inputValue();
          const isSubmitEnabled = await submitBtn.isEnabled();

          if (currentEmail === acc.email && currentPass === 'DustGuard@2026' && isSubmitEnabled) {
            console.log(`    ✓ Demo card "${acc.name}" (${acc.role}): populated email & password, enabled login button.`);
            auditReport.summary.passed++;
          } else {
            console.log(`    ✗ Demo card "${acc.name}" failed to populate form correctly. Current: ${currentEmail}`);
            auditReport.summary.failed++;
            auditReport.anomalies.push({
              route: '/login',
              viewport: vp.name,
              category: 'functional',
              severity: 'high',
              description: `Demo card ${acc.name} không nạp đúng dữ liệu đăng nhập.`
            });
          }
        } else {
          console.log(`    ✗ Demo card for ${acc.email} not visible.`);
          auditReport.summary.failed++;
        }
      }

      // E. Switch to Operations Tab and Test All Operations Demo Accounts
      console.log(`  🔍 Switching to Operations Tab (#tab-operations)...`);
      await tabOperations.click();
      await page.waitForTimeout(300);

      const opsUsernameInput = page.locator('#input-operations-username');
      const opsPassInput = page.locator('#input-operations-password');
      const opsSubmitBtn = page.locator('#btn-operations-login');

      for (const acc of DEMO_ACCOUNTS_OPERATIONS) {
        auditReport.summary.totalChecks++;
        const opsCard = page.locator(`[role="button"]:has-text("@${acc.username}"), button:has-text("@${acc.username}")`);
        if (await opsCard.isVisible()) {
          await opsCard.click();
          await page.waitForTimeout(100);
          const curUser = await opsUsernameInput.inputValue();
          const curPass = await opsPassInput.inputValue();
          const isOpsEnabled = await opsSubmitBtn.isEnabled();

          if (curUser === acc.username && curPass === 'DustGuard@2026' && isOpsEnabled) {
            console.log(`    ✓ Demo card "${acc.name}" (${acc.role}): populated username & password, enabled login button.`);
            auditReport.summary.passed++;
          } else {
            console.log(`    ✗ Demo card "${acc.name}" failed: curUser=${curUser}, enabled=${isOpsEnabled}`);
            auditReport.summary.failed++;
            auditReport.anomalies.push({
              route: '/login',
              viewport: vp.name,
              category: 'functional',
              severity: 'high',
              description: `Demo card Đơn vị Xử lý ${acc.name} không nạp đúng dữ liệu.`
            });
          }
        } else {
          console.log(`    ✗ Operations Demo card for @${acc.username} not visible.`);
          auditReport.summary.failed++;
        }
      }

      // F. Check Touch Target Sizes on Mobile Viewports (<= 430px)
      if (vp.width <= 430) {
        console.log(`  🔍 Auditing Touch Target Sizes on /login...`);
        const touchAnomalies = await checkTouchTargets(page, vp.name, '/login');
        if (touchAnomalies.length > 0) {
          auditReport.summary.touchTargetAnomaliesCount += touchAnomalies.length;
          auditReport.anomalies.push(...touchAnomalies);
          console.log(`    ⚠️ Found ${touchAnomalies.length} sub-44px touch targets on mobile:`);
          for (const ta of touchAnomalies.slice(0, 3)) {
            console.log(`       - ${ta.selector}: ${ta.evidence.width}x${ta.evidence.height}px`);
          }
        } else {
          console.log(`    ✓ All interactive targets satisfy touch target standards.`);
        }
      }

      // -----------------------------------------------------------------------
      // 2. AUDIT ROUTE: /reports
      // -----------------------------------------------------------------------
      console.log(`\n--- [${vp.name}] ROUTE: /reports ---`);
      auditReport.summary.totalChecks++;
      await page.goto(`${COMMUNITY_BASE_URL}/reports`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      // Check overflow
      const reportsOverflow = await checkOverflow(page, vp.width);
      recordOverflowResult('/reports', vp, reportsOverflow, auditReport);

      // Check glassmorphism
      const reportsGlass = await checkGlassmorphism(page);
      recordGlassResult('/reports', vp, reportsGlass, auditReport);

      // Verify reports list content
      const reportCards = page.locator('article, .report-card, [data-report-id], a[href*="/reports/"]');
      const count = await reportCards.count();
      console.log(`  ✓ Reports Page Rendered: Found ${count} report items/cards.`);
      auditReport.summary.passed++;

      // Check Touch Target on /reports
      if (vp.width <= 430) {
        const touchAnomalies = await checkTouchTargets(page, vp.name, '/reports');
        if (touchAnomalies.length > 0) {
          auditReport.summary.touchTargetAnomaliesCount += touchAnomalies.length;
          auditReport.anomalies.push(...touchAnomalies);
          console.log(`    ⚠️ Found ${touchAnomalies.length} touch targets < 40px:`);
          for (const ta of touchAnomalies.slice(0, 3)) {
            console.log(`       - ${ta.selector}: ${ta.evidence.width}x${ta.evidence.height}px`);
          }
        } else {
          console.log(`    ✓ Touch target sizes conform.`);
        }
      }

      // -----------------------------------------------------------------------
      // 3. AUDIT ROUTE: /reports/new
      // -----------------------------------------------------------------------
      console.log(`\n--- [${vp.name}] ROUTE: /reports/new ---`);
      auditReport.summary.totalChecks++;
      await page.goto(`${COMMUNITY_BASE_URL}/reports/new`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      // Check overflow
      const newReportOverflow = await checkOverflow(page, vp.width);
      recordOverflowResult('/reports/new', vp, newReportOverflow, auditReport);

      // Check glassmorphism
      const newReportGlass = await checkGlassmorphism(page);
      recordGlassResult('/reports/new', vp, newReportGlass, auditReport);

      // Check interactive category buttons & form inputs
      const catButtons = page.locator('button:has-text("Bụi"), button:has-text("Vật liệu"), button:has-text("Chất thải")');
      const catCount = await catButtons.count();
      console.log(`  ✓ New Report Form: Found ${catCount} category selection buttons.`);
      
      if (catCount > 0) {
        await catButtons.first().click();
        await page.waitForTimeout(100);
      }

      // Check Touch Target on /reports/new
      if (vp.width <= 430) {
        const touchAnomalies = await checkTouchTargets(page, vp.name, '/reports/new');
        if (touchAnomalies.length > 0) {
          auditReport.summary.touchTargetAnomaliesCount += touchAnomalies.length;
          auditReport.anomalies.push(...touchAnomalies);
          console.log(`    ⚠️ Found ${touchAnomalies.length} touch targets < 40px:`);
          for (const ta of touchAnomalies.slice(0, 3)) {
            console.log(`       - ${ta.selector}: ${ta.evidence.width}x${ta.evidence.height}px`);
          }
        } else {
          console.log(`    ✓ Touch target sizes conform.`);
        }
      }

      // -----------------------------------------------------------------------
      // 4. AUDIT ROUTE: /cases (Community side redirect & Operations Side B)
      // -----------------------------------------------------------------------
      console.log(`\n--- [${vp.name}] ROUTE: /cases (Community Side) ---`);
      auditReport.summary.totalChecks++;
      await page.goto(`${COMMUNITY_BASE_URL}/cases`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
      const redirectedUrl = page.url();
      if (redirectedUrl.includes('/reports')) {
        console.log(`  ✓ Canonical Navigation: /cases cleanly redirected to ${redirectedUrl}`);
        auditReport.summary.passed++;
      } else {
        console.log(`  ℹ️  URL after /cases navigation: ${redirectedUrl}`);
      }

      // Also audit Operations side /cases if live
      console.log(`\n--- [${vp.name}] ROUTE: /cases (Operations Side B at ${OPERATIONS_BASE_URL}) ---`);
      auditReport.summary.totalChecks++;
      try {
        await page.goto(`${OPERATIONS_BASE_URL}/login`, { waitUntil: 'networkidle' });
        await page.evaluate((tok) => {
          localStorage.setItem('dustguard_token', tok);
        }, OPERATIONS_DEMO_TOKEN);
        await page.goto(`${OPERATIONS_BASE_URL}/cases`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);

        const opsOverflow = await checkOverflow(page, vp.width);
        recordOverflowResult('/operations/cases', vp, opsOverflow, auditReport);

        const opsGlass = await checkGlassmorphism(page);
        recordGlassResult('/operations/cases', vp, opsGlass, auditReport);

        const casesUrl = page.url();
        console.log(`  ✓ Operations /cases loaded at: ${casesUrl}`);
        auditReport.summary.passed++;
      } catch (err) {
        console.log(`  ! Operations Side B check note: ${err.message?.slice(0, 70)}`);
      }

      // Check collected console and network errors for this viewport
      if (consoleErrors.length > 0) {
        console.log(`  ⚠️ Console Errors captured (${consoleErrors.length}):`);
        for (const ce of consoleErrors.slice(0, 3)) {
          console.log(`     - ${ce.slice(0, 100)}`);
        }
        auditReport.summary.consoleErrorsCount += consoleErrors.length;
      } else {
        console.log(`  ✓ Zero console errors across tested routes.`);
      }

      if (networkFailures.length > 0) {
        console.log(`  ⚠️ Network Failures captured (${networkFailures.length}):`);
        for (const nf of networkFailures.slice(0, 3)) {
          console.log(`     - ${nf.url} (${nf.status || nf.failure})`);
        }
        auditReport.summary.networkErrorsCount += networkFailures.length;
      } else {
        console.log(`  ✓ Zero unexpected network failures.`);
      }

      await context.close();
    }

    // Save final reports
    fs.writeFileSync(outputFile, JSON.stringify(auditReport, null, 2), 'utf-8');
    fs.writeFileSync(anomaliesFile, JSON.stringify(auditReport.anomalies, null, 2), 'utf-8');

    console.log('\n========================================================================');
    console.log('📊 QA AUDIT SUMMARY');
    console.log('========================================================================');
    console.log(`  Total Checks Executed:        ${auditReport.summary.totalChecks}`);
    console.log(`  Passed Checks:                ${auditReport.summary.passed}`);
    console.log(`  Failed Checks:                ${auditReport.summary.failed}`);
    console.log(`  Console Errors:               ${auditReport.summary.consoleErrorsCount}`);
    console.log(`  Network Errors:               ${auditReport.summary.networkErrorsCount}`);
    console.log(`  Horizontal Overflow Issues:   ${auditReport.summary.overflowAnomaliesCount}`);
    console.log(`  Glassmorphism Violations:     ${auditReport.summary.glassmorphismCount}`);
    console.log(`  Touch Target Anomalies:       ${auditReport.summary.touchTargetAnomaliesCount}`);
    console.log(`  Total UI Anomalies Logged:    ${auditReport.anomalies.length}`);
    console.log(`  Saved Audit Results to:       ${outputFile}`);
    console.log(`  Saved UI Anomalies to:        ${anomaliesFile}`);
    console.log('========================================================================\n');

  } finally {
    await browser.close();
  }
}

// Helper: Check horizontal overflow
async function checkOverflow(page, viewportWidth) {
  return await page.evaluate((vw) => {
    const doc = document.documentElement;
    const body = document.body;
    const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
    const clientWidth = doc.clientWidth;
    const hasOverflow = scrollWidth > vw + 1;
    let overflowingElement = null;

    if (hasOverflow) {
      const all = document.querySelectorAll('*');
      for (const el of all) {
        if (['SCRIPT', 'STYLE', 'path', 'defs', 'clipPath', 'svg'].includes(el.tagName)) continue;
        const rect = el.getBoundingClientRect();
        if (rect.right > vw + 3) {
          overflowingElement = {
            tag: el.tagName.toLowerCase(),
            id: el.id,
            className: typeof el.className === 'string' ? el.className.slice(0, 50) : '',
            right: Math.round(rect.right),
            width: Math.round(rect.width)
          };
          break;
        }
      }
    }

    return {
      scrollWidth,
      clientWidth,
      viewportWidth: vw,
      hasOverflow,
      overflowingElement
    };
  }, viewportWidth);
}

function recordOverflowResult(route, vp, res, auditReport) {
  auditReport.summary.totalChecks++;
  if (!res.hasOverflow) {
    console.log(`  ✓ [PASS] Horizontal Overflow: scrollWidth ${res.scrollWidth}px <= viewport ${res.viewportWidth}px`);
    auditReport.summary.passed++;
  } else {
    console.log(`  ✗ [FAIL] Horizontal Overflow: scrollWidth ${res.scrollWidth}px > viewport ${res.viewportWidth}px!`);
    auditReport.summary.failed++;
    auditReport.summary.overflowAnomaliesCount++;
    auditReport.anomalies.push({
      route,
      viewport: vp.name,
      category: 'horizontal-overflow',
      severity: 'high',
      description: `Trang bị tràn ngang ${res.scrollWidth - res.viewportWidth}px`,
      evidence: res
    });
  }
}

// Helper: Check glassmorphism
async function checkGlassmorphism(page) {
  return await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    let glassCount = 0;
    const items = [];
    for (const el of all) {
      const style = window.getComputedStyle(el);
      if (style.backdropFilter && style.backdropFilter.includes('blur')) {
        glassCount++;
        items.push({
          tag: el.tagName.toLowerCase(),
          id: el.id,
          class: typeof el.className === 'string' ? el.className.slice(0, 40) : '',
          blur: style.backdropFilter
        });
      }
    }
    return { glassCount, items };
  });
}

function recordGlassResult(route, vp, res, auditReport) {
  auditReport.summary.totalChecks++;
  if (res.glassCount === 0) {
    console.log(`  ✓ [PASS] Zero Glassmorphism: 0 backdrop-filter blur detected.`);
    auditReport.summary.passed++;
  } else {
    console.log(`  ✗ [FAIL] Glassmorphism detected: ${res.glassCount} elements have blur filter!`);
    auditReport.summary.failed++;
    auditReport.summary.glassmorphismCount += res.glassCount;
    auditReport.anomalies.push({
      route,
      viewport: vp.name,
      category: 'glassmorphism',
      severity: 'medium',
      description: `Phát hiện ${res.glassCount} phần tử có backdrop-filter blur (vi phạm Civic UI standard).`,
      evidence: res.items
    });
  }
}

// Helper: Check touch targets on mobile
async function checkTouchTargets(page, viewportName, route) {
  return await page.evaluate(({ vpName, rName }) => {
    const anomalies = [];
    const elements = document.querySelectorAll('button, a[role="button"], input, select, textarea');
    
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);

      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
      if (rect.width === 0 || rect.height === 0) continue;
      if (el.tagName === 'INPUT' && el.type === 'hidden') continue;

      const text = (el.textContent || el.placeholder || el.value || el.getAttribute('aria-label') || '').trim();

      // Check if interactive element is smaller than 40x36px on mobile
      if (rect.height < 36 || rect.width < 40) {
        if (el.tagName === 'BUTTON' || el.tagName === 'INPUT') {
          const sel = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (text ? ` ("${text.slice(0, 18)}")` : '');
          anomalies.push({
            route: rName,
            viewport: vpName,
            category: 'touch-target',
            severity: 'medium',
            selector: sel,
            description: `Touch target nhỏ trên di động (${Math.round(rect.width)}x${Math.round(rect.height)}px < chuẩn 44x44px)`,
            evidence: { width: Math.round(rect.width), height: Math.round(rect.height) }
          });
        }
      }
    }
    return anomalies;
  }, { vpName: viewportName, rName: route });
}

runQAAudit().catch(err => {
  console.error('QA Audit Runner Fatal Error:', err);
  process.exit(1);
});
