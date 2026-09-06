import { chromium } from '../app/node_modules/playwright/index.mjs';
import path from 'node:path';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // 1. Dashboard Desktop
  console.log('📸 Chụp Dashboard Desktop (1440x900)...');
  await page.goto('https://dustguard.phamphunguyenhung.com/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'dist_dashboard_live.png' });

  // 2. Settings IoT
  console.log('📸 Chụp Settings IoT (1440x900)...');
  await page.goto('https://dustguard.phamphunguyenhung.com/settings/iot', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'dist_settings_iot.png' });

  // 3. Device Detail
  console.log('📸 Chụp Device Detail (1440x900)...');
  await page.goto('https://dustguard.phamphunguyenhung.com/iot/device/dev-apm2000-001', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'dist_device_detail.png' });

  await browser.close();

  // Copy sang artifacts
  const artifactDir = 'C:\\Users\\ppnh1\\.gemini\\antigravity-ide\\brain\\f8627b39-1c79-4354-a67c-0d0236493d53';
  import('node:fs').then(fs => {
    fs.copyFileSync('dist_dashboard_live.png', path.join(artifactDir, 'dist_dashboard_live.png'));
    fs.copyFileSync('dist_settings_iot.png', path.join(artifactDir, 'dist_settings_iot.png'));
    fs.copyFileSync('dist_device_detail.png', path.join(artifactDir, 'dist_device_detail.png'));
    console.log('✅ Đã cập nhật toàn bộ ảnh chụp vào artifacts!');
  });
}

main().catch(console.error);
