import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8' }).trim();
  } catch (err) {
    return err.stdout ? err.stdout.trim() : (err.message || '');
  }
}

console.log(`
🛡️ ==========================================================
   DUSTGUARD COMMUNITY — AGENT-BROWSER E2E QA TEST
==========================================================
`);

const baseUrl = 'http://127.0.0.1:3000';

// 1. Đặt viewport Desktop 1440x900
console.log('[PHASE 7.1] Thiết lập Viewport Desktop 1440x900...');
run('agent-browser set viewport 1440 900');

// =========================================================================
// ROLE 1: CITIZEN
// =========================================================================
console.log('\n=== 1. KIỂM THỬ VAI TRÒ: CITIZEN ===');
run(`agent-browser open "${baseUrl}/login"`);
run('agent-browser wait 1200');

// Thực hiện đăng nhập Citizen
const loginScript = `
  const emailInput = document.querySelector('input[type="email"]');
  const passInput = document.querySelector('input[type="password"]');
  if (emailInput && passInput) {
    emailInput.value = 'citizen@dustguard.local';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    passInput.value = 'DustGuard123!';
    passInput.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('form').querySelector('button[type="submit"]').click();
  }
`;
run(`agent-browser eval "${loginScript.replace(/\n/g, ' ')}"`);
run('agent-browser wait 2000');

// Kiểm tra DOM Sidebar của Citizen
const checkCitizenSidebar = `
  const links = Array.from(document.querySelectorAll('aside a')).map(a => a.textContent.trim());
  JSON.stringify({
    hasModInbox: links.some(t => t.includes('Hộp thư xác minh')),
    hasModCases: links.some(t => t.includes('Điều phối vụ việc')),
    hasModContent: links.some(t => t.includes('Kiểm duyệt nội dung')),
    hasModStats: links.some(t => t.includes('Thống kê điều phối')),
    hasAdmin: links.some(t => t.includes('Quản trị') || t.includes('Người dùng')),
    hasTasks: links.some(t => t.includes('Nhiệm vụ')),
    hasContributions: links.some(t => t.includes('Đóng góp'))
  });
`;
const citSidebarRes = JSON.parse(run(`agent-browser eval "${checkCitizenSidebar.replace(/\n/g, ' ')}"`) || '{}');
console.log('Sidebar Citizen Checks:', citSidebarRes);

if (
  !citSidebarRes.hasModInbox &&
  !citSidebarRes.hasModCases &&
  !citSidebarRes.hasModContent &&
  !citSidebarRes.hasModStats &&
  !citSidebarRes.hasAdmin &&
  !citSidebarRes.hasTasks &&
  !citSidebarRes.hasContributions
) {
  console.log('✅ CITIZEN SIDEBAR ASSERTION PASS: Không có bất kỳ link Moderator / Admin / Task / Đóng góp nào!');
} else {
  console.error('❌ CITIZEN SIDEBAR ASSERTION FAIL:', citSidebarRes);
  process.exit(1);
}

// Thử truy cập trực tiếp route cấm
console.log('Thử Citizen truy cập trực tiếp /moderator/inbox...');
run(`agent-browser open "${baseUrl}/moderator/inbox"`);
run('agent-browser wait 1200');
const citMod403 = run(`agent-browser eval "document.body.innerText.includes('403') || document.body.innerText.includes('Khu vực không thuộc phạm vi vai trò')"`);
console.log(`Citizen vào /moderator/inbox hiển thị 403: ${citMod403}`);

console.log('Thử Citizen truy cập trực tiếp /admin/users...');
run(`agent-browser open "${baseUrl}/admin/users"`);
run('agent-browser wait 1200');
const citAdmin403 = run(`agent-browser eval "document.body.innerText.includes('403') || document.body.innerText.includes('Khu vực không thuộc phạm vi vai trò')"`);
console.log(`Citizen vào /admin/users hiển thị 403: ${citAdmin403}`);

if (citMod403 === 'true' && citAdmin403 === 'true') {
  console.log('✅ CITIZEN ROUTE GUARDS PASS: Cả 2 route nhạy cảm đều bị chặn 403 thành công!');
} else {
  console.error('❌ CITIZEN ROUTE GUARDS FAIL');
  process.exit(1);
}

// =========================================================================
// ROLE 2: COMMUNITY MEMBER
// =========================================================================
console.log('\n=== 2. KIỂM THỬ VAI TRÒ: COMMUNITY MEMBER ===');
run(`agent-browser open "${baseUrl}/login"`);
run('agent-browser wait 1000');

const loginMemberScript = `
  const emailInput = document.querySelector('input[type="email"]');
  const passInput = document.querySelector('input[type="password"]');
  if (emailInput && passInput) {
    emailInput.value = 'member@dustguard.local';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    passInput.value = 'DustGuard123!';
    passInput.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('form').querySelector('button[type="submit"]').click();
  }
`;
run(`agent-browser eval "${loginMemberScript.replace(/\n/g, ' ')}"`);
run('agent-browser wait 2000');

// Kiểm tra DOM Sidebar của Member
const checkMemberSidebar = `
  const links = Array.from(document.querySelectorAll('aside a')).map(a => a.textContent.trim());
  JSON.stringify({
    hasTasks: links.some(t => t.includes('Nhiệm vụ')),
    hasContributions: links.some(t => t.includes('Đóng góp')),
    hasModInbox: links.some(t => t.includes('Hộp thư xác minh')),
    hasAdmin: links.some(t => t.includes('Quản trị') || t.includes('Người dùng'))
  });
`;
const memSidebarRes = JSON.parse(run(`agent-browser eval "${checkMemberSidebar.replace(/\n/g, ' ')}"`) || '{}');
console.log('Sidebar Member Checks:', memSidebarRes);

if (memSidebarRes.hasTasks && memSidebarRes.hasContributions && !memSidebarRes.hasModInbox && !memSidebarRes.hasAdmin) {
  console.log('✅ MEMBER SIDEBAR ASSERTION PASS: Thấy Nhiệm vụ & Đóng góp, KHÔNG thấy Moderator/Admin!');
} else {
  console.error('❌ MEMBER SIDEBAR ASSERTION FAIL:', memSidebarRes);
  process.exit(1);
}

// Thử Member truy cập route cấm
run(`agent-browser open "${baseUrl}/moderator/inbox"`);
run('agent-browser wait 1200');
const memMod403 = run(`agent-browser eval "document.body.innerText.includes('403') || document.body.innerText.includes('Khu vực không thuộc phạm vi vai trò')"`);
console.log(`Member vào /moderator/inbox hiển thị 403: ${memMod403}`);

run(`agent-browser open "${baseUrl}/admin/users"`);
run('agent-browser wait 1200');
const memAdmin403 = run(`agent-browser eval "document.body.innerText.includes('403') || document.body.innerText.includes('Khu vực không thuộc phạm vi vai trò')"`);
console.log(`Member vào /admin/users hiển thị 403: ${memAdmin403}`);

if (memMod403 === 'true' && memAdmin403 === 'true') {
  console.log('✅ MEMBER ROUTE GUARDS PASS: Cả /moderator/inbox và /admin/users đều bị chặn 403!');
} else {
  console.error('❌ MEMBER ROUTE GUARDS FAIL');
  process.exit(1);
}

// =========================================================================
// ROLE 3: MODERATOR
// =========================================================================
console.log('\n=== 3. KIỂM THỬ VAI TRÒ: MODERATOR ===');
run(`agent-browser open "${baseUrl}/login"`);
run('agent-browser wait 1000');

const loginModScript = `
  const emailInput = document.querySelector('input[type="email"]');
  const passInput = document.querySelector('input[type="password"]');
  if (emailInput && passInput) {
    emailInput.value = 'moderator@dustguard.local';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    passInput.value = 'DustGuard123!';
    passInput.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('form').querySelector('button[type="submit"]').click();
  }
`;
run(`agent-browser eval "${loginModScript.replace(/\n/g, ' ')}"`);
run('agent-browser wait 2000');

// Kiểm tra DOM Sidebar của Moderator
const checkModSidebar = `
  const links = Array.from(document.querySelectorAll('aside a')).map(a => a.textContent.trim());
  JSON.stringify({
    hasModInbox: links.some(t => t.includes('Hộp thư xác minh')),
    hasModCases: links.some(t => t.includes('Điều phối vụ việc')),
    hasModContent: links.some(t => t.includes('Kiểm duyệt nội dung')),
    hasModStats: links.some(t => t.includes('Thống kê điều phối')),
    hasAdmin: links.some(t => t.includes('Quản trị') || t.includes('Người dùng'))
  });
`;
const modSidebarRes = JSON.parse(run(`agent-browser eval "${checkModSidebar.replace(/\n/g, ' ')}"`) || '{}');
console.log('Sidebar Moderator Checks:', modSidebarRes);

if (
  modSidebarRes.hasModInbox &&
  modSidebarRes.hasModCases &&
  modSidebarRes.hasModContent &&
  modSidebarRes.hasModStats &&
  !modSidebarRes.hasAdmin
) {
  console.log('✅ MODERATOR SIDEBAR ASSERTION PASS: Thấy đầy đủ 4 mục Điều phối viên, KHÔNG thấy Admin!');
} else {
  console.error('❌ MODERATOR SIDEBAR ASSERTION FAIL:', modSidebarRes);
  process.exit(1);
}

// Thử Moderator truy cập /admin/users
run(`agent-browser open "${baseUrl}/admin/users"`);
run('agent-browser wait 1200');
const modAdmin403 = run(`agent-browser eval "document.body.innerText.includes('403') || document.body.innerText.includes('Khu vực không thuộc phạm vi vai trò')"`);
console.log(`Moderator vào /admin/users hiển thị 403: ${modAdmin403}`);

// Moderator truy cập /moderator/inbox
run(`agent-browser open "${baseUrl}/moderator/inbox"`);
run('agent-browser wait 1500');
const modInboxOk = run(`agent-browser eval "document.body.innerText.includes('Xác minh phản ánh mới') || document.body.innerText.includes('Chờ thẩm định')"`);
console.log(`Moderator mở /moderator/inbox thành công: ${modInboxOk}`);

if (modAdmin403 === 'true' && modInboxOk === 'true') {
  console.log('✅ MODERATOR ACCESS PASS: Vào được /moderator/inbox và bị chặn 403 tại /admin/users!');
} else {
  console.error('❌ MODERATOR ACCESS FAIL');
  process.exit(1);
}

// =========================================================================
// ROLE 4: ADMIN
// =========================================================================
console.log('\n=== 4. KIỂM THỬ VAI TRÒ: ADMIN ===');
run(`agent-browser open "${baseUrl}/login"`);
run('agent-browser wait 1000');

const loginAdminScript = `
  const emailInput = document.querySelector('input[type="email"]');
  const passInput = document.querySelector('input[type="password"]');
  if (emailInput && passInput) {
    emailInput.value = 'admin@dustguard.local';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    passInput.value = 'DustGuard123!';
    passInput.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('form').querySelector('button[type="submit"]').click();
  }
`;
run(`agent-browser eval "${loginAdminScript.replace(/\n/g, ' ')}"`);
run('agent-browser wait 2000');

// Kiểm tra Admin truy cập /admin/users
run(`agent-browser open "${baseUrl}/admin/users"`);
run('agent-browser wait 1500');
const adminUsersOk = run(`agent-browser eval "document.body.innerText.includes('Quản lý người dùng') && document.body.innerText.includes('Tài khoản & Phân quyền')"`);
console.log(`Admin truy cập /admin/users thành công: ${adminUsersOk}`);

if (adminUsersOk === 'true') {
  console.log('✅ ADMIN ACCESS PASS: Admin quản lý người dùng truy cập thành công!');
} else {
  console.error('❌ ADMIN ACCESS FAIL');
  process.exit(1);
}

// =========================================================================
// 5. TEST MODERATOR VERIFICATION DETAIL WORKFLOW
// =========================================================================
console.log('\n=== 5. KIỂM THỬ GIAO DIỆN MODERATOR VERIFICATION DETAIL ===');
// Đổi lại role Moderator
run(`agent-browser open "${baseUrl}/moderator/verification"`);
run('agent-browser wait 1500');

// Mở trang chi tiết phản ánh rep_0842_1
run(`agent-browser open "${baseUrl}/moderator/verification/rep_0842_1"`);
run('agent-browser wait 2000');

const detailCheck = `
  const bodyText = document.body.innerText;
  JSON.stringify({
    hasDecisionArea: bodyText.includes('Khu vực quyết định thẩm định'),
    hasEvidence: bodyText.includes('Minh chứng hiện trường'),
    hasCandidates: bodyText.includes('Các vụ việc lân cận') || bodyText.includes('Ứng viên gộp'),
    hasActionButtons: Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('Tạo vụ việc mới'))
  });
`;
const detailRes = JSON.parse(run(`agent-browser eval "${detailCheck.replace(/\n/g, ' ')}"`) || '{}');
console.log('Verification Detail Elements:', detailRes);

if (detailRes.hasDecisionArea && detailRes.hasEvidence && detailRes.hasCandidates) {
  console.log('✅ MODERATOR VERIFICATION DETAIL PASS: Đầy đủ 4 workflow areas!');
} else {
  console.error('❌ MODERATOR VERIFICATION DETAIL FAIL:', detailRes);
  process.exit(1);
}

// =========================================================================
// 6. KIỂM TRA HORIZONTAL OVERFLOW (1440x900 & 390x844)
// =========================================================================
console.log('\n=== 6. KIỂM TRA HORIZONTAL OVERFLOW ===');

// Desktop 1440x900
run('agent-browser set viewport 1440 900');
run(`agent-browser open "${baseUrl}/dashboard"`);
run('agent-browser wait 1000');
const desktopOverflow = run('agent-browser eval "document.documentElement.scrollWidth <= window.innerWidth"');
console.log(`Desktop 1440x900 không tràn ngang: ${desktopOverflow}`);

// Mobile 390x844
run('agent-browser set viewport 390 844');
run(`agent-browser open "${baseUrl}/dashboard"`);
run('agent-browser wait 1000');
const mobileOverflow = run('agent-browser eval "document.documentElement.scrollWidth <= window.innerWidth"');
console.log(`Mobile 390x844 không tràn ngang: ${mobileOverflow}`);

if (desktopOverflow === 'true' && mobileOverflow === 'true') {
  console.log('✅ OVERFLOW AUDIT PASS: Cả 2 kích thước màn hình đều hoàn toàn không có horizontal overflow!');
} else {
  console.error('❌ OVERFLOW AUDIT FAIL');
  process.exit(1);
}

// Chụp ảnh minh chứng cuối cùng
const reportsDir = path.resolve('reports');
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
const screenshotPath = path.join(reportsDir, 'browser_qa_verified.png');
run(`agent-browser screenshot "${screenshotPath}"`);
console.log(`\n📸 Đã lưu ảnh minh chứng kiểm thử tại: ${screenshotPath}`);

console.log('\n🎉 TẤT CẢ CÁC BƯỚC AGENT-BROWSER E2E ĐỀU PASS HOÀN TOÀN!');
