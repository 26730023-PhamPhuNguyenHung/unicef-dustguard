import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require('../app/node_modules/playwright');

async function testCreateReportE2E() {
  console.log('🚀 Running E2E Report Creation Wizard Test...\n');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  try {
    // 1. Mở trang tạo phản ánh
    await page.goto('http://localhost:3000/reports/new', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    console.log('✓ Loaded /reports/new');

    // 2. Điền Bước 1
    const testTitle = `Công trình xây dựng bụi cầu Rạch Đĩa #${Date.now()}`;
    const testDesc = 'Xe chở vật liệu ra vào công trình làm rơi vãi đất cát, không có trạm phun nước rửa lốp xe gây bụi mù mịt kéo dài.';

    await page.fill('input[placeholder*="VD:"]', testTitle);
    await page.fill('textarea', testDesc);
    await page.waitForTimeout(300);

    console.log('✓ Filled Step 1 (Title, Description)');

    // Click Next to Step 2
    const nextBtnStep1 = page.locator('button:has-text("Tiếp tục: Chọn vị trí")');
    await nextBtnStep1.click();
    await page.waitForTimeout(600);

    // 3. Điền Bước 2 (Vị trí)
    console.log('✓ Navigated to Step 2');
    await page.fill('input[placeholder*="Nguyễn Văn Linh"]', '123 Đường Nguyễn Thị Thập');
    await page.fill('input[placeholder*="Quận 7"]', 'Quận 7');
    await page.fill('input[placeholder*="Tân Phú"]', 'Tân Phú');
    await page.waitForTimeout(300);

    const nextBtnStep2 = page.locator('button:has-text("Tiếp tục: Bằng chứng")');
    await nextBtnStep2.click();
    await page.waitForTimeout(600);

    // 4. Bước 3 (Bằng chứng)
    console.log('✓ Navigated to Step 3');
    // Tạo 1 file ảnh test tạm thời để upload
    const testImagePath = path.resolve(process.cwd(), 'temp-test-evidence.jpg');
    fs.writeFileSync(testImagePath, Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xD9]));

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);
    await page.waitForTimeout(800);

    console.log('✓ Attached test evidence image');

    const nextBtnStep3 = page.locator('button:has-text("Kiểm tra trước khi gửi")');
    await nextBtnStep3.click();
    await page.waitForTimeout(600);

    // 5. Bước 4 (Xác nhận & Gửi)
    console.log('✓ Navigated to Step 4 (Review)');
    const submitBtn = page.locator('button:has-text("Gửi phản ánh ngay")');
    await submitBtn.click();
    await page.waitForTimeout(1500);

    // 6. Kiểm tra Bước 5 Thành công
    const successHeading = await page.locator('text=Phản ánh đã được ghi nhận!').isVisible();
    console.log(`✓ Submission Result: ${successHeading ? 'SUCCESS (Step 5 visible)' : 'FAILED'}`);

    // Lấy link xem chi tiết
    const trackLink = page.locator('a:has-text("Theo dõi phản ánh này")');
    const trackHref = await trackLink.getAttribute('href');
    console.log(`✓ Created Report URL: ${trackHref}`);

    // Click vào xem chi tiết
    await trackLink.click();
    await page.waitForTimeout(1000);

    // Xác minh dữ liệu hiển thị đúng
    const detailTitle = await page.locator(`text=${testTitle}`).isVisible();
    console.log(`✓ Report Detail Title Rendered: ${detailTitle ? 'YES' : 'NO'}`);

    // Reload trang để kiểm tra tính bền vững của dữ liệu trong CSDL SQLite
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    const reloadedTitle = await page.locator(`text=${testTitle}`).isVisible();
    console.log(`✓ Data Persists After Reload: ${reloadedTitle ? 'YES (SQLite SSOT)' : 'NO'}`);

    // Dọn dẹp file tạm
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }

    console.log(`\nConsole Errors during test: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }

  } catch (err) {
    console.error('Test Error:', err);
  } finally {
    await browser.close();
  }
}

testCreateReportE2E();
