import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const screenshotsDir = path.join(rootDir, 'docs', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', cwd: rootDir }).trim();
  } catch (err) {
    return err.stdout ? err.stdout.trim() : (err.message || '');
  }
}

console.log(`
🛡️ ==========================================================
   DUSTGUARD COMMUNITY — VERIFY CONTRIBUTION PAGE REDESIGN
==========================================================
`);

const baseUrl = 'http://127.0.0.1:3000';

// 1. Thiết lập Viewport Desktop 1440x900
console.log('📌 Bước 1: Thiết lập Viewport Desktop 1440x900...');
run('agent-browser set viewport 1440 900');

// 2. Mở trang login và đăng nhập tài khoản Citizen
console.log('📌 Bước 2: Đăng nhập tài khoản citizen@dustguard.local...');
run(`agent-browser open "${baseUrl}/login"`);
run('agent-browser wait 1500');

const loginScript = `
  const emailInput = document.querySelector('input[type="email"]');
  const passInput = document.querySelector('input[type="password"]');
  if (emailInput && passInput) {
    emailInput.value = 'citizen@dustguard.local';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    passInput.value = 'DustGuard123!';
    passInput.dispatchEvent(new Event('input', { bubbles: true }));
    const form = document.querySelector('form');
    if (form) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
    }
  }
`;
run(`agent-browser eval "${loginScript.replace(/\n/g, ' ')}"`);
run('agent-browser wait 2500');

// 3. Điều hướng tới trang /credits
console.log('📌 Bước 3: Điều hướng tới /credits...');
run(`agent-browser open "${baseUrl}/credits"`);
run('agent-browser wait 2000');

// 4. Kiểm toán nội dung giao diện Desktop
console.log('📌 Bước 4: Kiểm toán các tiêu chí giao diện & wording...');
const auditScript = `
  (() => {
    const bodyText = document.body.innerText;
    const forbiddenTerms = [
      'Tín chỉ thanh niên',
      'Tín chỉ rèn luyện',
      'Ví Tín Chỉ',
      '20 giờ tình nguyện = 4.0 tín chỉ',
      '/ 20h',
      '/20h',
      '/ 4.0',
      '/4.0',
      'Xem Giấy Chứng Nhận Điện Tử',
      'Tiến độ hoàn thành chứng nhận',
      'Chuẩn đánh giá Đoàn'
    ];

    const violations = forbiddenTerms.filter(term => bodyText.includes(term));

    const aside = document.querySelector('aside');
    const sidebarText = aside ? aside.innerText : '';
    const hasDauAnDongGopInSidebar = sidebarText.includes('Dấu ấn đóng góp');

    const h1 = document.querySelector('h1');
    const headingText = h1 ? h1.innerText : '';

    const hasActivitiesKpi = bodyText.includes('Hoạt động đã tham gia');
    const hasHoursKpi = bodyText.includes('Thời gian đóng góp');
    const hasVerifiedKpi = bodyText.includes('Đóng góp đã xác nhận');
    const hasLocationsKpi = bodyText.includes('Khu vực đã góp sức');

    const hasJourneySection = bodyText.includes('Hành trình của bạn');
    const hasImpactSection = bodyText.includes('Từ đóng góp đến tác động');
    const hasLogSection = bodyText.includes('Những việc bạn đã góp sức');

    const overflowX = document.documentElement.scrollWidth > window.innerWidth;

    return JSON.stringify({
      violations,
      hasDauAnDongGopInSidebar,
      headingText,
      hasActivitiesKpi,
      hasHoursKpi,
      hasVerifiedKpi,
      hasLocationsKpi,
      hasJourneySection,
      hasImpactSection,
      hasLogSection,
      overflowX,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth
    });
  })()
`;

const desktopAuditRaw = run(`agent-browser eval "${auditScript.replace(/\n/g, ' ')}"`);
let desktopAudit = {};
try {
  desktopAudit = JSON.parse(desktopAuditRaw);
} catch (e) {
  console.log('Lỗi parse desktopAudit:', desktopAuditRaw);
}

console.log('Kết quả kiểm toán Desktop:', desktopAudit);

// Chụp ảnh desktop
const desktopShotPath = path.join(screenshotsDir, 'contribution_desktop.png').replace(/\\/g, '/');
run(`agent-browser screenshot "${desktopShotPath}"`);
console.log('📸 Đã chụp màn hình Desktop:', desktopShotPath);

// 5. Thao tác Modal Bản tổng kết đóng góp
console.log('📌 Bước 5: Mở modal Chia sẻ hành trình...');
const openModalScript = `
  (() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const shareBtn = buttons.find(b => b.innerText.includes('Chia sẻ hành trình'));
    if (shareBtn) {
      shareBtn.click();
      return true;
    }
    return false;
  })()
`;
run(`agent-browser eval "${openModalScript.replace(/\n/g, ' ')}"`);
run('agent-browser wait 1000');

// Kiểm tra modal
const checkModalScript = `
  (() => {
    const bodyText = document.body.innerText;
    return JSON.stringify({
      hasModalTitle: bodyText.includes('BẢN TỔNG KẾT ĐÓNG GÓP'),
      hasPrivacyControls: bodyText.includes('Hiển thị trên bản chia sẻ'),
      hasCopyLinkBtn: bodyText.includes('Sao chép liên kết'),
      hasPrintBtn: bodyText.includes('In / Tải bản tổng kết'),
      hasNoForbiddenTermsInModal: !bodyText.includes('GIẤY CHỨNG NHẬN') && !bodyText.includes('Quy đổi rèn luyện')
    });
  })()
`;
const modalAudit = JSON.parse(run(`agent-browser eval "${checkModalScript.replace(/\n/g, ' ')}"`) || '{}');
console.log('Kết quả kiểm toán Modal:', modalAudit);

// Chụp ảnh modal
const modalShotPath = path.join(screenshotsDir, 'contribution_modal.png').replace(/\\/g, '/');
run(`agent-browser screenshot "${modalShotPath}"`);
console.log('📸 Đã chụp ảnh Modal:', modalShotPath);

// Đóng modal
const closeModalScript = `
  (() => {
    const closeBtn = document.querySelector('button[aria-label="Đóng"]');
    if (closeBtn) closeBtn.click();
  })()
`;
run(`agent-browser eval "${closeModalScript.replace(/\n/g, ' ')}"`);
run('agent-browser wait 800');

// 6. Kiểm toán Viewport Mobile 390x844
console.log('📌 Bước 6: Kiểm toán Viewport Mobile 390x844...');
run('agent-browser set viewport 390 844');
run('agent-browser wait 1000');

const mobileAuditScript = `
  (() => {
    const overflowX = document.documentElement.scrollWidth > window.innerWidth;
    return JSON.stringify({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      overflowX,
      hasHeading: document.body.innerText.includes('Bạn đã góp một phần vào những thay đổi này')
    });
  })()
`;
const mobileAudit = JSON.parse(run(`agent-browser eval "${mobileAuditScript.replace(/\n/g, ' ')}"`) || '{}');
console.log('Kết quả kiểm toán Mobile 390x844:', mobileAudit);

// Chụp ảnh mobile
const mobileShotPath = path.join(screenshotsDir, 'contribution_mobile.png').replace(/\\/g, '/');
run(`agent-browser screenshot "${mobileShotPath}"`);
console.log('📸 Đã chụp ảnh Mobile:', mobileShotPath);

// Đóng trình duyệt agent-browser phiên kiểm thử
run('agent-browser close');

console.log('\n✅ HOÀN THÀNH TẤT CẢ CÁC BƯỚC KIỂM TOÁN RUNTIME!');
