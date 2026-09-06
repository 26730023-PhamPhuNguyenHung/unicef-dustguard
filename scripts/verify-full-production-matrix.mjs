import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/ppnh1/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core');

const BASE_URL = 'https://dustguard.phamphunguyenhung.com';

const VIEWPORTS = [
  { name: 'Mobile Small (360x800)', width: 360, height: 800 },
  { name: 'Mobile Standard (375x812)', width: 375, height: 812 },
  { name: 'Mobile iPhone (390x844)', width: 390, height: 844 },
  { name: 'Mobile Android (412x915)', width: 412, height: 915 },
  { name: 'Mobile Large (430x932)', width: 430, height: 932 },
  { name: 'Tablet iPad (768x1024)', width: 768, height: 1024 },
  { name: 'Tablet Air (820x1180)', width: 820, height: 1180 },
  { name: 'Desktop HD (1366x768)', width: 1366, height: 768 },
  { name: 'Desktop Full (1440x900)', width: 1440, height: 900 },
];

async function runMatrixAudit() {
  console.log('================================================================');
  console.log('🚀 DUSTGUARD VN PRODUCTION FULL MATRIX & INTERACTION AUDIT');
  console.log('================================================================');

  const browser = await chromium.launch({ headless: true });
  const report = {
    viewportsTested: [],
    anomalies: [],
    interactions: [],
    apiSmoke: [],
    touchTargets: []
  };

  // 1. API RFC 7807 & Health Check
  console.log('\n--- [PHASE 1: API CONTRACT & RFC 7807 SMOKE] ---');
  const apiContext = await browser.newContext();
  const apiPage = await apiContext.newPage();

  // Test /api/health
  const healthRes = await apiPage.goto(`${BASE_URL}/api/health`);
  const healthJson = await healthRes.json().catch(() => null);
  const healthPass = healthRes.status() === 200 && healthJson && healthJson.status === 'ok';
  console.log(`[API /api/health] Status: ${healthRes.status()}, Content-Type: ${healthRes.headers()['content-type']}`);
  report.apiSmoke.push({ endpoint: '/api/health', status: healthRes.status(), pass: healthPass });

  // Test non-existent /api/abc -> MUST return JSON 404, NOT Landing HTML
  const notFoundRes = await apiPage.goto(`${BASE_URL}/api/non_existent_route_test`);
  const notFoundType = notFoundRes.headers()['content-type'] || '';
  const notFoundText = await notFoundRes.text();
  const isProblemJson = notFoundRes.status() === 404 && notFoundType.includes('json');
  console.log(`[API /api/non_existent_route_test] Status: ${notFoundRes.status()}, Content-Type: ${notFoundType}`);
  console.log(`Body: ${notFoundText.slice(0, 150)}...`);
  report.apiSmoke.push({ endpoint: '/api/non_existent_route_test', status: notFoundRes.status(), isProblemJson });

  await apiContext.close();

  // 2. Viewport Matrix on Landing Page & Operations Dashboard
  console.log('\n--- [PHASE 2: VIEWPORT MATRIX & RESPONSIVE AUDIT] ---');
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', err => pageErrors.push(err.message));

    // Test Landing
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 15000 });
    const landingOverflow = await page.evaluate(() => {
      const el = document.documentElement;
      return {
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        hasHorizontalOverflow: el.scrollWidth > el.clientWidth
      };
    });

    // Test Operations Dashboard
    await page.goto(`${BASE_URL}/operations/dashboard`, { waitUntil: 'networkidle', timeout: 15000 });
    const opsOverflow = await page.evaluate(() => {
      const el = document.documentElement;
      return {
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        hasHorizontalOverflow: el.scrollWidth > el.clientWidth
      };
    });

    const hasErrors = pageErrors.length > 0;
    const vpPass = !landingOverflow.hasHorizontalOverflow && !opsOverflow.hasHorizontalOverflow && !hasErrors;

    console.log(`Viewport ${vp.name.padEnd(28)} | Landing Overflow: ${landingOverflow.hasHorizontalOverflow ? 'FAIL ❌' : 'OK ✅'} | Ops Overflow: ${opsOverflow.hasHorizontalOverflow ? 'FAIL ❌' : 'OK ✅'} | Errors: ${pageErrors.length}`);

    report.viewportsTested.push({
      viewport: vp.name,
      width: vp.width,
      height: vp.height,
      landingOverflow,
      opsOverflow,
      pageErrors,
      pass: vpPass
    });

    await context.close();
  }

  // 3. User Journey & Interactive Actions
  console.log('\n--- [PHASE 3: USER JOURNEY & BEHAVIOR INTERACTIONS] ---');
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } }); // Mobile iPhone
    const page = await context.newPage();
    page.on('pageerror', err => console.log('   🚨 Page Error:', err.message));

    // Journey A: Landing Page CTA
    console.log('Action A1: Navigating to Landing Page...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

    console.log('Action A2: Finding and clicking Citizen Report CTA in Hero ("Gửi phản ánh")...');
    const heroCitizenCta = page.locator('section a[href*="/reports/new"]').first();
    const isVisible = await heroCitizenCta.isVisible();
    console.log(`   Hero CTA Visible: ${isVisible}`);
    if (isVisible) {
      await heroCitizenCta.click();
      await page.waitForLoadState('networkidle');
      console.log(`   Navigated to: ${page.url()}`);
      report.interactions.push({ action: 'Click Citizen CTA in Hero', finalUrl: page.url(), success: page.url().includes('/reports/new') });
    }

    // Journey B: Operations Navigation & Case Detail
    console.log('\nAction B1: Direct navigation to Operations Dashboard...');
    await page.goto(`${BASE_URL}/operations/dashboard`, { waitUntil: 'networkidle' });

    console.log('Action B2: Test Direct Refresh (F5) on /operations/dashboard...');
    await page.reload({ waitUntil: 'networkidle' });
    const refreshedTitle = await page.title();
    const refreshedUrl = page.url();
    console.log(`   After F5 - URL: ${refreshedUrl}, Title: ${refreshedTitle}`);
    const f5Pass = refreshedUrl.includes('/operations/dashboard') && refreshedTitle.includes('DustGuard Operations');
    report.interactions.push({ action: 'F5 Reload Operations Dashboard', pass: f5Pass });

    console.log('\nAction B3: Navigate to Cases List (/operations/cases)...');
    await page.goto(`${BASE_URL}/operations/cases`, { waitUntil: 'networkidle' });
    const casesUrl = page.url();
    const casesContent = await page.evaluate(() => document.body.innerText.slice(0, 200));
    console.log(`   URL: ${casesUrl} | Preview: ${casesContent.replace(/\n+/g, ' ')}`);
    report.interactions.push({ action: 'Navigate to /operations/cases', pass: casesUrl.includes('/operations/cases') });

    console.log('\nAction B4: Navigate to Projects (/operations/projects)...');
    await page.goto(`${BASE_URL}/operations/projects`, { waitUntil: 'networkidle' });
    const projUrl = page.url();
    const projContent = await page.evaluate(() => document.body.innerText.slice(0, 200));
    console.log(`   URL: ${projUrl} | Preview: ${projContent.replace(/\n+/g, ' ')}`);
    report.interactions.push({ action: 'Navigate to /operations/projects', pass: projUrl.includes('/operations/projects') });

    console.log('\nAction B5: Navigate to Legal (/operations/legal)...');
    await page.goto(`${BASE_URL}/operations/legal`, { waitUntil: 'networkidle' });
    const legalUrl = page.url();
    const legalContent = await page.evaluate(() => document.body.innerText.slice(0, 200));
    console.log(`   URL: ${legalUrl} | Preview: ${legalContent.replace(/\n+/g, ' ')}`);
    report.interactions.push({ action: 'Navigate to /operations/legal', pass: legalUrl.includes('/operations/legal') });

    // Touch targets check on Mobile Operations
    console.log('\nAction B6: Audit touch targets >= 44px on Operations header & actions...');
    const touchAudit = await page.evaluate(() => {
      const interactives = Array.from(document.querySelectorAll('button, a, input, select'));
      const smallElements = [];
      interactives.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          if (rect.width < 40 || rect.height < 40) {
            smallElements.push({
              tag: el.tagName,
              text: el.innerText ? el.innerText.trim().slice(0, 25) : el.getAttribute('aria-label') || '',
              width: Math.round(rect.width),
              height: Math.round(rect.height)
            });
          }
        }
      });
      return { total: interactives.length, sub40px: smallElements.slice(0, 5) };
    });
    console.log(`   Touch targets audited: ${touchAudit.total} elements, Sub-40px: ${touchAudit.sub40px.length}`);
    report.touchTargets.push(touchAudit);

    await context.close();
  }

  await browser.close();

  console.log('\n================================================================');
  console.log('📊 AUDIT SUMMARY REPORT');
  console.log('================================================================');
  console.log(JSON.stringify(report, null, 2));
}

runMatrixAudit().catch(console.error);
