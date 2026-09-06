import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/ppnh1/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core');

async function testUrl(targetUrl, viewport = { width: 1440, height: 900 }) {
  console.log(`\n======================================================`);
  console.log(`🔍 [Testing] ${targetUrl} @ ${viewport.width}x${viewport.height}`);
  console.log(`======================================================`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();

  page.on('console', msg => {
    console.log(`  [CONSOLE ${msg.type().toUpperCase()}]`, msg.text());
  });

  page.on('pageerror', err => {
    console.log(`  🚨 [PAGE UNCAUGHT ERROR]`, err.message, err.stack);
  });

  page.on('requestfailed', req => {
    console.log(`  ❌ [REQ FAILED] ${req.url()} - ${req.failure()?.errorText}`);
  });

  page.on('response', res => {
    if (res.status() >= 400 || res.url().includes('/api/') || res.url().includes('/auth/')) {
      console.log(`  🌐 [RESP ${res.status()}] ${res.url()}`);
    }
  });

  try {
    const navRes = await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 15000 });
    console.log(`  Navigation status: ${navRes?.status()}`);
  } catch (err) {
    console.log(`  Navigation timed out or failed: ${err.message}`);
  }

  await page.waitForTimeout(3000);

  const finalUrl = page.url();
  const title = await page.title();
  const textContent = await page.evaluate(() => document.body.innerText.trim());
  const htmlSnippet = await page.evaluate(() => document.body.innerHTML.substring(0, 500));

  console.log(`\n  📌 Final URL: ${finalUrl}`);
  console.log(`  📌 Title: ${title}`);
  console.log(`  📌 Visible Text:\n"""\n${textContent}\n"""`);
  console.log(`  📌 HTML snippet (first 300 chars):\n${htmlSnippet.slice(0, 300)}...`);

  await browser.close();
}

async function run() {
  await testUrl('https://dustguard.phamphunguyenhung.com/');
  await testUrl('https://dustguard.phamphunguyenhung.com/operations/dashboard');
  await testUrl('https://dustguard.phamphunguyenhung.com/operations/dashboard', { width: 390, height: 844 });
}

run().catch(console.error);
