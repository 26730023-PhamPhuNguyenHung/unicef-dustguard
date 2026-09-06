import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('--- KHỞI TẠO KIỂM THỬ PLAYWRIGHT BROWSER ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  try {
    console.log('\n[1/5] Truy cập trang Gửi phản ánh (/reports/new) với tư cách khách vãng lai...');
    await page.goto('http://localhost:3000/reports/new', { waitUntil: 'networkidle' });

    const currentUrl = page.url();
    console.log(`URL hiện tại: ${currentUrl}`);
    if (currentUrl.includes('/login')) {
      throw new Error('LỖI: Người dùng bị ép chuyển hướng về /login!');
    }
    console.log('✓ PASS: Cho phép truy cập công khai không cần đăng nhập.');

    // 2. Kiểm tra banner
    const pageText = await page.textContent('body');
    if (!pageText.includes('Gửi phản ánh nhanh không cần đăng nhập')) {
      throw new Error('LỖI: Thiếu banner thông báo gửi nhanh không cần đăng nhập!');
    }
    console.log('✓ PASS: Banner thông báo thân thiện xuất hiện chuẩn xác.');

    // 3. Bước 1: Điền thông tin
    console.log('\n[2/5] Bước 1: Điền thông tin phản ánh...');
    await page.fill('input[placeholder*="Bụi phát sinh"]', 'Bụi phát tán từ công trình nâng cấp đường số 7');
    await page.fill('textarea', 'Công trình đào đường thi công từ sáng sớm, xe tải chở cát đá không che bạt làm bụi phát tán mù mịt vào nhà dân.');
    
    // Đợi 600ms để kiểm tra draft autosave
    await page.waitForTimeout(700);
    const bodyAfterDraft = await page.textContent('body');
    if (bodyAfterDraft.includes('Đã lưu bản nháp lúc')) {
      console.log('✓ PASS: Bản nháp đã tự động lưu (Draft Autosave).');
    }

    // Bấm nút "Tiếp tục: Chọn vị trí"
    const step1Btn = page.locator('button:has-text("Tiếp tục: Chọn vị trí")');
    await step1Btn.click();
    await page.waitForTimeout(500);

    // 4. Bước 2: Vị trí
    console.log('\n[3/5] Bước 2: Điền vị trí phản ánh...');
    await page.fill('input[placeholder*="Trước số 235"]', 'Số 235 Nguyễn Thị Thập, P. Tân Phú, Quận 7');
    const step2Btn = page.locator('button:has-text("Tiếp tục: Bằng chứng")');
    await step2Btn.click();
    await page.waitForTimeout(500);

    // 5. Bước 3: Bằng chứng -> Bấm Kiểm tra
    console.log('\n[4/5] Bước 3: Bỏ qua upload ảnh (tùy chọn) -> Chuyển sang Bước 4...');
    const step3Btn = page.locator('button:has-text("Kiểm tra trước khi gửi")');
    await step3Btn.click();
    await page.waitForTimeout(500);

    // 6. Bước 4: Kiểm tra & Gửi
    console.log('\n[5/5] Bước 4: Xác nhận và gửi phản ánh...');
    const submitBtn = page.locator('button:has-text("Gửi phản ánh ngay")');
    await submitBtn.click();

    // Đợi bước 5 hiển thị
    await page.waitForSelector('text=Phản ánh đã được ghi nhận!', { timeout: 10000 });
    console.log('✓ PASS: Phản ánh gửi thành công và chuyển sang màn hình hoàn thành!');

    // Lấy mã phản ánh
    const codeElement = await page.locator('span.font-mono.font-bold').textContent();
    console.log(`✓ MÃ PHẢN ÁNH TẠO THÀNH CÔNG: ${codeElement?.trim()}`);

    // Chụp ảnh bằng chứng nghiệm thu UI
    const screenshotDir = path.resolve('artifacts');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    const screenshotPath = path.join(screenshotDir, 'browser_report_created_success.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`✓ ĐÃ LƯU ẢNH MINH CHỨNG UI: ${screenshotPath}`);

    console.log('\n=== TẤT CẢ 5 BƯỚC RUNTIME WORKFLOW TRỰC TIẾP PASS 100% ===');
  } catch (err) {
    console.error('✗ THẤT BẠI TẠI BƯỚC KIỂM THỬ:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
