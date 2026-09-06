import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('../app/node_modules/playwright');

const routes = [
  '/',
  '/dashboard',
  '/reports',
  '/reports/new',
  '/map',
  '/following',
  '/communities',
  '/tasks',
  '/contributions',
  '/credits',
  '/notifications',
  '/profile',
  '/login',
  '/moderator/inbox',
  '/moderator/cases',
  '/moderator/dashboard',
  '/admin/overview',
  '/admin/users'
];

async function runAudit() {
  console.log('🚀 Starting Side A Automated Route & Console Audit...\n');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const results = [];

  for (const route of routes) {
    const consoleErrors = [];
    const failedRequests = [];

    const onConsole = (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    };
    const onRequestFailed = (req) => {
      failedRequests.push(`${req.method()} ${req.url()} (${req.failure()?.errorText || 'failed'})`);
    };
    const onResponse = (res) => {
      if (res.status() >= 400 && !res.url().includes('/api/auth/me')) {
        failedRequests.push(`${res.status()} ${res.url()}`);
      }
    };

    page.on('console', onConsole);
    page.on('requestfailed', onRequestFailed);
    page.on('response', onResponse);

    try {
      const resp = await page.goto(`http://localhost:3000${route}`, { waitUntil: 'domcontentloaded', timeout: 8000 });
      await page.waitForTimeout(600);

      const title = await page.title();
      const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

      results.push({
        route,
        status: resp ? resp.status() : 'no-response',
        title,
        hasHorizontalScroll,
        consoleErrors,
        failedRequests
      });
      console.log(`[${resp?.status()}] ${route} -> ${title} (H-scroll: ${hasHorizontalScroll ? '⚠️ YES' : '✓ NO'}, Errors: ${consoleErrors.length}, Failed Req: ${failedRequests.length})`);
      if (consoleErrors.length > 0) {
        console.log('  ❌ Console errors:', consoleErrors);
      }
      if (failedRequests.length > 0) {
        console.log('  ❌ Failed requests:', failedRequests);
      }
    } catch (e) {
      console.log(`[FAIL] ${route} -> ${e.message}`);
      results.push({
        route,
        status: 'CRASH',
        error: e.message,
        consoleErrors,
        failedRequests
      });
    }

    page.off('console', onConsole);
    page.off('requestfailed', onRequestFailed);
    page.off('response', onResponse);
  }

  await browser.close();

  console.log('\n=== AUDIT COMPLETE ===');
}

runAudit().catch(console.error);
