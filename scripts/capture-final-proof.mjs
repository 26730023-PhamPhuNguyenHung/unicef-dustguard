import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/ppnh1/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core');

const BASE_URL = 'https://dustguard.phamphunguyenhung.com';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  console.log('Navigating to Operations Dashboard on mobile 390x844...');
  await page.goto(`${BASE_URL}/operations/dashboard`, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(2000);

  const outDir = path.resolve('artifacts');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const screenshotPath = path.join(outDir, 'mobile-operations-final-proof.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`Saved screenshot to: ${screenshotPath}`);

  await browser.close();
}

capture().catch(console.error);
