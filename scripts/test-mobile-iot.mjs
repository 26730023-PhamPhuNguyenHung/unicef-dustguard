import { chromium } from '../app/node_modules/playwright/index.mjs';
import path from 'node:path';
import fs from 'node:fs';

async function main() {
  console.log('📱 Khởi động kiểm tra Responsive Mobile (390x844)...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });
  const page = await context.newPage();

  console.log('🌐 Điều hướng tới https://dustguard.phamphunguyenhung.com/dashboard ...');
  await page.goto('https://dustguard.phamphunguyenhung.com/dashboard', { waitUntil: 'networkidle' });

  // Đợi card IoT hiển thị
  await page.waitForTimeout(2000);

  // Kiểm tra Horizontal Overflow (Tiêu chuẩn UI Quality Watch)
  const overflow = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });
  console.log(`📐 Kiểm tra tràn ngang (Horizontal Overflow): scrollWidth=${overflow.scrollWidth}px, clientWidth=${overflow.clientWidth}px => ${overflow.hasOverflow ? 'LỖI TRÀN' : 'PASS 100%'}`);

  // Chụp ảnh màn hình mobile
  const mobileShotPath = path.resolve('dist_dashboard_mobile.png');
  await page.screenshot({ path: mobileShotPath, fullPage: true });
  console.log(`📸 Đã chụp màn hình mobile: ${mobileShotPath}`);

  // Kiểm tra nội dung Text của Card DustGuard Node trên mobile
  const content = await page.content();
  const hasLiveNode = content.includes('DustGuard Node') && content.includes('LIVE');
  const hasApm2000Reading = content.includes('µg/m³ (PM2.5)');
  console.log(`🔍 Thẻ DustGuard Node LIVE: ${hasLiveNode ? 'PASS' : 'FAIL'}`);
  console.log(`🔍 Số đo bụi thực tế: ${hasApm2000Reading ? 'PASS' : 'FAIL'}`);

  await browser.close();
  console.log('✅ Hoàn tất kiểm thử Mobile thành công!');
}

main().catch(err => {
  console.error('❌ Lỗi kiểm tra mobile:', err);
  process.exit(1);
});
