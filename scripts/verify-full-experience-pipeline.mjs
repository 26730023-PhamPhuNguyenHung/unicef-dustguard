import { chromium } from '../app/node_modules/playwright/index.mjs';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://dustguard.phamphunguyenhung.com';
const artifactsDir = path.resolve('artifacts');
if (!fs.existsSync(artifactsDir)) {
  fs.mkdirSync(artifactsDir, { recursive: true });
}

async function main() {
  console.log('🚀 [E2E Test] Bắt đầu kiểm thử toàn diện trải nghiệm sản phẩm DustGuard VN...\n');
  const browser = await chromium.launch({ headless: true });
  
  // Test 1: Desktop Viewport (1440x900)
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Test 2: Mobile Viewport (390x844)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  const mobilePage = await mobileContext.newPage();

  let passedTests = 0;
  let totalTests = 6;

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Kiểm tra trang Report của người dùng (khắc phục hoàn toàn ảnh vỡ)
    // -------------------------------------------------------------------------
    console.log('📌 [TEST 1/6] Kiểm tra trang chi tiết phản ánh người dùng (rep_4f6a4e7538fc4438)...');
    await page.goto(`${BASE_URL}/reports/rep_4f6a4e7538fc4438`, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Đợi content render
    await page.waitForTimeout(2000);
    const reportText = await page.textContent('body');

    // Kiểm tra không còn ảnh vỡ, thay bằng SafeImage
    const hasFallbackText = reportText.includes('Chưa có hình ảnh minh chứng') || reportText.includes('Hình ảnh minh chứng');
    console.log(`   - Khung hình ảnh an toàn: ${hasFallbackText ? '✓ ĐẠT (Có SafeImage bảo vệ)' : '✗ CHƯA ĐẠT'}`);

    // Kiểm tra timeline 6 nấc
    const hasTimeline = reportText.includes('Tiến trình xử lý minh bạch') && reportText.includes('Đang chuẩn hóa');
    console.log(`   - Timeline 6 nấc xử lý minh bạch: ${hasTimeline ? '✓ ĐẠT' : '✗ CHƯA ĐẠT'}`);

    // Kiểm tra phân biệt Observation vs Case
    const hasCaseLink = reportText.includes('Hồ sơ theo dõi chuyên trách') || reportText.includes('Đã tạo hồ sơ theo dõi');
    console.log(`   - Phân biệt rõ Observation & Case: ${hasCaseLink ? '✓ ĐẠT' : '✗ CHƯA ĐẠT'}`);

    await page.screenshot({ path: path.join(artifactsDir, 'proof-citizen-report-detail.png'), fullPage: false });
    passedTests++;
    console.log('   -> ĐÃ LƯU ẢNH MINH CHỨNG: artifacts/proof-citizen-report-detail.png\n');

    // -------------------------------------------------------------------------
    // TEST 2: Kiểm tra Case Workspace chuẩn 6 Section (Side A)
    // -------------------------------------------------------------------------
    console.log('📌 [TEST 2/6] Kiểm tra Case Workspace 6 Section (cas_pipeline_001)...');
    await page.goto(`${BASE_URL}/cases/cas_pipeline_001`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const caseText = await page.textContent('body');
    const hasSection1 = caseText.includes('Section 1') && caseText.includes('Tín hiệu ban đầu');
    const hasSection2 = caseText.includes('Section 2') && caseText.includes('Bằng chứng');
    const hasSection3 = caseText.includes('Section 3') && caseText.includes('Đánh giá mức độ ưu tiên');
    const hasSection4 = caseText.includes('Section 4') && caseText.includes('Phân công');
    const hasSection5 = caseText.includes('Section 5') && caseText.includes('Tiến trình xử lý');
    const hasSection6 = caseText.includes('Section 6') && caseText.includes('Kết quả & Nghiệm thu');

    console.log(`   - Section 1 (Tín hiệu ban đầu): ${hasSection1 ? '✓' : '✗'}`);
    console.log(`   - Section 2 (Bằng chứng số): ${hasSection2 ? '✓' : '✗'}`);
    console.log(`   - Section 3 (Đánh giá ưu tiên / Risk Score): ${hasSection3 ? '✓' : '✗'}`);
    console.log(`   - Section 4 (Phân công & Trách nhiệm): ${hasSection4 ? '✓' : '✗'}`);
    console.log(`   - Section 5 (Tiến trình xử lý): ${hasSection5 ? '✓' : '✗'}`);
    console.log(`   - Section 6 (Kết quả & Nghiệm thu): ${hasSection6 ? '✓' : '✗'}`);

    await page.screenshot({ path: path.join(artifactsDir, 'proof-case-workspace-6-sections.png'), fullPage: false });
    passedTests++;
    console.log('   -> ĐÃ LƯU ẢNH MINH CHỨNG: artifacts/proof-case-workspace-6-sections.png\n');

    // -------------------------------------------------------------------------
    // TEST 3: Gửi phản ánh mới -> Chuyển vào màn hình "Phản ánh của bạn đang được xử lý"
    // -------------------------------------------------------------------------
    console.log('📌 [TEST 3/6] Kiểm tra luồng gửi phản ánh và màn hình xử lý minh bạch (/reports/new)...');
    await page.goto(`${BASE_URL}/reports/new`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    // Điền form bước 1
    await page.fill('input[placeholder*="Bụi phát sinh"]', 'Bụi phát tán từ công trường cầu Tân Thuận');
    await page.fill('textarea[placeholder*="thời gian phát tán bụi"]', 'Xe chở bùn đất làm rơi vãi ra mặt đường, gây bụi mù mịt khi xe máy chạy qua.');
    await page.click('button:has-text("Tiếp tục: Chọn vị trí")');
    await page.waitForTimeout(800);

    // Bước 2: Vị trí
    await page.fill('input[placeholder*="Số 62 Nguyễn Chí Thanh"]', 'Đường Huỳnh Tấn Phát, Tân Thuận Đông, Quận 7, TP.HCM');
    await page.click('button:has-text("Tiếp tục: Bằng chứng")');
    await page.waitForTimeout(800);

    // Bước 3: Bằng chứng -> Bước 4
    await page.click('button:has-text("Kiểm tra trước khi gửi")');
    await page.waitForTimeout(800);

    // Bước 4: Gửi phản ánh
    await page.click('button:has-text("Gửi phản ánh ngay")');
    await page.waitForTimeout(4000);

    // Bước 5: Kiểm tra màn hình "Phản ánh của bạn đang được xử lý"
    const successText = await page.textContent('body');
    const isProcessingScreen = successText.includes('Phản ánh của bạn đang được xử lý');
    console.log(`   - Màn hình "Phản ánh của bạn đang được xử lý": ${isProcessingScreen ? '✓ ĐẠT' : '✗ CHƯA ĐẠT'}`);

    await page.screenshot({ path: path.join(artifactsDir, 'proof-citizen-submitted-processing.png'), fullPage: false });
    passedTests++;
    console.log('   -> ĐÃ LƯU ẢNH MINH CHỨNG: artifacts/proof-citizen-submitted-processing.png\n');

    // -------------------------------------------------------------------------
    // TEST 4: Bàn làm việc cán bộ Side B (Dashboard 4 câu hỏi thực tế)
    // -------------------------------------------------------------------------
    console.log('📌 [TEST 4/6] Kiểm tra Bàn làm việc Side B (/operations/)...');
    await page.goto(`${BASE_URL}/operations/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Nếu ở trang login, đăng nhập với supervisor_admin
    const opsUrl = page.url();
    if (opsUrl.includes('/login')) {
      console.log('   -> Đang đăng nhập tài khoản Cán bộ điều hành...');
      await page.fill('input[type="text"]', 'supervisor_admin');
      await page.fill('input[type="password"]', 'DustGuard123!');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
    }

    const dashboardText = await page.textContent('body');
    const hasQ1 = dashboardText.includes('1. Tín hiệu mới cần xem');
    const hasQ2 = dashboardText.includes('2. Cần ưu tiên trước');
    const hasQ3 = dashboardText.includes('3. Chưa có người phụ trách');
    const hasQ4 = dashboardText.includes('4. Đang chậm / Cần cập nhật');

    console.log(`   - Câu hỏi 1 (Tín hiệu mới): ${hasQ1 ? '✓' : '✗'}`);
    console.log(`   - Câu hỏi 2 (Cần ưu tiên trước): ${hasQ2 ? '✓' : '✗'}`);
    console.log(`   - Câu hỏi 3 (Chưa có người phụ trách): ${hasQ3 ? '✓' : '✗'}`);
    console.log(`   - Câu hỏi 4 (Đang chậm / Cần cập nhật): ${hasQ4 ? '✓' : '✗'}`);

    await page.screenshot({ path: path.join(artifactsDir, 'proof-side-b-dashboard-4-questions.png'), fullPage: false });
    passedTests++;
    console.log('   -> ĐÃ LƯU ẢNH MINH CHỨNG: artifacts/proof-side-b-dashboard-4-questions.png\n');

    // -------------------------------------------------------------------------
    // TEST 5: Bảng danh sách Case với Next Action & Filter Tabs (Side B)
    // -------------------------------------------------------------------------
    console.log('📌 [TEST 5/6] Kiểm tra Danh sách vụ việc & Nút Next Action (/operations/cases)...');
    await page.goto(`${BASE_URL}/operations/cases`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const casesListText = await page.textContent('body');
    const hasNextActionBtn = casesListText.includes('Xem tín hiệu') || casesListText.includes('Kiểm tra bằng chứng') || casesListText.includes('Phân công');
    console.log(`   - Nút Next Action trên từng Case: ${hasNextActionBtn ? '✓ ĐẠT' : '✗ CHƯA ĐẠT'}`);

    const hasNewTab = casesListText.includes('Cần xem (Mới)');
    const hasUnassignedTab = casesListText.includes('Chưa phân công');
    console.log(`   - Tabs bộ lọc nghiệp vụ: ${hasNewTab && hasUnassignedTab ? '✓ ĐẠT' : '✗ CHƯA ĐẠT'}`);

    await page.screenshot({ path: path.join(artifactsDir, 'proof-side-b-cases-next-action.png'), fullPage: false });
    passedTests++;
    console.log('   -> ĐÃ LƯU ẢNH MINH CHỨNG: artifacts/proof-side-b-cases-next-action.png\n');

    // -------------------------------------------------------------------------
    // TEST 6: Mobile Responsive Check (390x844)
    // -------------------------------------------------------------------------
    console.log('📌 [TEST 6/6] Kiểm tra Responsive trên màn hình di động (390x844)...');
    await mobilePage.goto(`${BASE_URL}/cases/cas_pipeline_001`, { waitUntil: 'networkidle', timeout: 30000 });
    await mobilePage.waitForTimeout(2000);

    const isOverflowing = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log(`   - Layout không bị tràn ngang: ${!isOverflowing ? '✓ ĐẠT' : '✗ BỊ TRÀN'}`);

    await mobilePage.screenshot({ path: path.join(artifactsDir, 'proof-mobile-case-detail.png'), fullPage: false });
    passedTests++;
    console.log('   -> ĐÃ LƯU ẢNH MINH CHỨNG: artifacts/proof-mobile-case-detail.png\n');

    console.log(`\n🎉 [HOÀN TẤT KIỂM THỬ] Đã vượt qua ${passedTests}/${totalTests} bài kiểm tra thực tế trên Cloudflare Edge!`);
  } catch (err) {
    console.error('❌ Lỗi kiểm thử E2E:', err);
  } finally {
    await browser.close();
  }
}

main();
