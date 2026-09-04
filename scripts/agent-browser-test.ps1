# Script kiểm thử tự động toàn diện RBAC x Route x Action bằng agent-browser
$ErrorActionPreference = "Stop"

Write-Host "`n🛡️ ==========================================================" -ForegroundColor Cyan
Write-Host "   DUSTGUARD COMMUNITY — AGENT-BROWSER E2E QA TEST" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$baseUrl = "http://127.0.0.1:3000"

# 1. Desktop 1440x900
Write-Host "`n[PHASE 7.1] Thiết lập Viewport Desktop 1440x900..." -ForegroundColor Yellow
agent-browser set viewport 1440 900

# -------------------------------------------------------------------------
# ROLE 1: CITIZEN
# -------------------------------------------------------------------------
Write-Host "`n=== 1. KIỂM THỬ VAI TRÒ: CITIZEN ===" -ForegroundColor Green
agent-browser open "$baseUrl/login"
agent-browser wait 1500

# Điền form login Citizen
agent-browser eval "
  const emailInput = document.querySelector('input[type=\"email\"]');
  const passInput = document.querySelector('input[type=\"password\"]');
  if (emailInput && passInput) {
    emailInput.value = 'citizen@dustguard.local';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    passInput.value = 'DustGuard123!';
    passInput.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('form').querySelector('button[type=\"submit\"]').click();
  }
"
agent-browser wait 2000

# Assert Sidebar Citizen
$citizenSidebarCheck = agent-browser eval "
  const links = Array.from(document.querySelectorAll('aside a')).map(a => a.textContent.trim());
  const hasModInbox = links.some(t => t.includes('Hộp thư xác minh'));
  const hasModCases = links.some(t => t.includes('Điều phối vụ việc'));
  const hasModContent = links.some(t => t.includes('Kiểm duyệt nội dung'));
  const hasModStats = links.some(t => t.includes('Thống kê điều phối'));
  const hasAdmin = links.some(t => t.includes('Quản trị') || t.includes('Người dùng'));
  const hasTasks = links.some(t => t.includes('Nhiệm vụ'));
  const hasContributions = links.some(t => t.includes('Đóng góp'));
  
  JSON.stringify({
    hasModInbox,
    hasModCases,
    hasModContent,
    hasModStats,
    hasAdmin,
    hasTasks,
    hasContributions
  });
"
Write-Host "Kết quả kiểm tra Sidebar Citizen: $citizenSidebarCheck" -ForegroundColor Gray

# Thử truy cập trực tiếp route cấm của Citizen
Write-Host "Thử Citizen truy cập /moderator/inbox..." -ForegroundColor Yellow
agent-browser open "$baseUrl/moderator/inbox"
agent-browser wait 1500
$citizenMod403 = agent-browser eval "
  const bodyText = document.body.innerText;
  bodyText.includes('403') || bodyText.includes('Khu vực không thuộc phạm vi vai trò') || bodyText.includes('Quyền truy cập bị hạn chế');
"
Write-Host "Citizen vào /moderator/inbox nhận 403: $citizenMod403" -ForegroundColor ($citizenMod403 -eq "true" ? "Green" : "Red")

Write-Host "Thử Citizen truy cập /admin/users..." -ForegroundColor Yellow
agent-browser open "$baseUrl/admin/users"
agent-browser wait 1500
$citizenAdmin403 = agent-browser eval "
  const bodyText = document.body.innerText;
  bodyText.includes('403') || bodyText.includes('Khu vực không thuộc phạm vi vai trò') || bodyText.includes('Quyền truy cập bị hạn chế');
"
Write-Host "Citizen vào /admin/users nhận 403: $citizenAdmin403" -ForegroundColor ($citizenAdmin403 -eq "true" ? "Green" : "Red")

# -------------------------------------------------------------------------
# ROLE 2: COMMUNITY MEMBER
# -------------------------------------------------------------------------
Write-Host "`n=== 2. KIỂM THỬ VAI TRÒ: COMMUNITY MEMBER ===" -ForegroundColor Green
agent-browser open "$baseUrl/login"
agent-browser wait 1000

agent-browser eval "
  const emailInput = document.querySelector('input[type=\"email\"]');
  const passInput = document.querySelector('input[type=\"password\"]');
  if (emailInput && passInput) {
    emailInput.value = 'member@dustguard.local';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    passInput.value = 'DustGuard123!';
    passInput.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('form').querySelector('button[type=\"submit\"]').click();
  }
"
agent-browser wait 2000

# Assert Sidebar Member
$memberSidebarCheck = agent-browser eval "
  const links = Array.from(document.querySelectorAll('aside a')).map(a => a.textContent.trim());
  const hasTasks = links.some(t => t.includes('Nhiệm vụ'));
  const hasContributions = links.some(t => t.includes('Đóng góp'));
  const hasModInbox = links.some(t => t.includes('Hộp thư xác minh'));
  const hasAdmin = links.some(t => t.includes('Quản trị') || t.includes('Người dùng'));
  
  JSON.stringify({
    hasTasks,
    hasContributions,
    hasModInbox,
    hasAdmin
  });
"
Write-Host "Kết quả kiểm tra Sidebar Member: $memberSidebarCheck" -ForegroundColor Gray

# Thử Member truy cập route cấm
Write-Host "Thử Member truy cập /moderator/inbox..." -ForegroundColor Yellow
agent-browser open "$baseUrl/moderator/inbox"
agent-browser wait 1500
$memberMod403 = agent-browser eval "
  const bodyText = document.body.innerText;
  bodyText.includes('403') || bodyText.includes('Khu vực không thuộc phạm vi vai trò');
"
Write-Host "Member vào /moderator/inbox nhận 403: $memberMod403" -ForegroundColor ($memberMod403 -eq "true" ? "Green" : "Red")

# -------------------------------------------------------------------------
# ROLE 3: MODERATOR
# -------------------------------------------------------------------------
Write-Host "`n=== 3. KIỂM THỬ VAI TRÒ: MODERATOR ===" -ForegroundColor Green
agent-browser open "$baseUrl/login"
agent-browser wait 1000

agent-browser eval "
  const emailInput = document.querySelector('input[type=\"email\"]');
  const passInput = document.querySelector('input[type=\"password\"]');
  if (emailInput && passInput) {
    emailInput.value = 'moderator@dustguard.local';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    passInput.value = 'DustGuard123!';
    passInput.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('form').querySelector('button[type=\"submit\"]').click();
  }
"
agent-browser wait 2000

# Assert Sidebar Moderator
$moderatorSidebarCheck = agent-browser eval "
  const links = Array.from(document.querySelectorAll('aside a')).map(a => a.textContent.trim());
  const hasModInbox = links.some(t => t.includes('Hộp thư xác minh'));
  const hasModCases = links.some(t => t.includes('Điều phối vụ việc'));
  const hasModContent = links.some(t => t.includes('Kiểm duyệt nội dung'));
  const hasModStats = links.some(t => t.includes('Thống kê điều phối'));
  const hasAdmin = links.some(t => t.includes('Quản trị') || t.includes('Người dùng'));
  
  JSON.stringify({
    hasModInbox,
    hasModCases,
    hasModContent,
    hasModStats,
    hasAdmin
  });
"
Write-Host "Kết quả kiểm tra Sidebar Moderator: $moderatorSidebarCheck" -ForegroundColor Gray

# Thử Moderator truy cập /admin/users
Write-Host "Thử Moderator truy cập /admin/users..." -ForegroundColor Yellow
agent-browser open "$baseUrl/admin/users"
agent-browser wait 1500
$modAdmin403 = agent-browser eval "
  const bodyText = document.body.innerText;
  bodyText.includes('403') || bodyText.includes('Khu vực không thuộc phạm vi vai trò');
"
Write-Host "Moderator vào /admin/users nhận 403: $modAdmin403" -ForegroundColor ($modAdmin403 -eq "true" ? "Green" : "Red")

# Thử Moderator truy cập /moderator/inbox
Write-Host "Moderator mở Hộp thư xác minh (/moderator/inbox)..." -ForegroundColor Yellow
agent-browser open "$baseUrl/moderator/inbox"
agent-browser wait 1500
$modInboxOk = agent-browser eval "
  document.body.innerText.includes('Xác minh phản ánh mới') || document.body.innerText.includes('Chờ thẩm định');
"
Write-Host "Moderator truy cập /moderator/inbox thành công: $modInboxOk" -ForegroundColor ($modInboxOk -eq "true" ? "Green" : "Red")

# -------------------------------------------------------------------------
# ROLE 4: ADMIN
# -------------------------------------------------------------------------
Write-Host "`n=== 4. KIỂM THỬ VAI TRÒ: ADMIN ===" -ForegroundColor Green
agent-browser open "$baseUrl/login"
agent-browser wait 1000

agent-browser eval "
  const emailInput = document.querySelector('input[type=\"email\"]');
  const passInput = document.querySelector('input[type=\"password\"]');
  if (emailInput && passInput) {
    emailInput.value = 'admin@dustguard.local';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    passInput.value = 'DustGuard123!';
    passInput.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('form').querySelector('button[type=\"submit\"]').click();
  }
"
agent-browser wait 2000

# Assert Admin Route
Write-Host "Admin truy cập /admin/users..." -ForegroundColor Yellow
agent-browser open "$baseUrl/admin/users"
agent-browser wait 1500
$adminUsersOk = agent-browser eval "
  document.body.innerText.includes('Quản lý người dùng') && document.body.innerText.includes('Tài khoản & Phân quyền');
"
Write-Host "Admin vào /admin/users thành công: $adminUsersOk" -ForegroundColor ($adminUsersOk -eq "true" ? "Green" : "Red")

# -------------------------------------------------------------------------
# 5. TEST MODERATOR VERIFICATION WORKFLOW & PERSISTENCE
# -------------------------------------------------------------------------
Write-Host "`n=== 5. MODERATOR VERIFICATION DETAIL WORKFLOW ===" -ForegroundColor Green
agent-browser open "$baseUrl/moderator/verification"
agent-browser wait 1500

# Click vào phản ánh đầu tiên
agent-browser eval "
  const firstLink = document.querySelector('a[href*=\"/moderator/verification/\"]');
  if (firstLink) firstLink.click();
"
agent-browser wait 2000

# Kiểm tra các thành phần trên trang Verification Detail
$detailCheck = agent-browser eval "
  const bodyText = document.body.innerText;
  const hasDecisionArea = bodyText.includes('Khu vực quyết định thẩm định');
  const hasEvidence = bodyText.includes('Minh chứng hiện trường');
  const hasCandidates = bodyText.includes('Ứng viên gộp tín hiệu') || bodyText.includes('vụ việc lân cận');
  const hasCreateCTA = Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('Tạo vụ việc mới'));
  
  JSON.stringify({
    hasDecisionArea,
    hasEvidence,
    hasCandidates,
    hasCreateCTA
  });
"
Write-Host "Kiểm tra màn hình Verification Detail: $detailCheck" -ForegroundColor Gray

# -------------------------------------------------------------------------
# 6. KIỂM TRA HORIZONTAL OVERFLOW (Desktop 1440 & Mobile 390)
# -------------------------------------------------------------------------
Write-Host "`n=== 6. KIỂM TRA HORIZONTAL OVERFLOW ===" -ForegroundColor Green

# Desktop 1440x900
agent-browser set viewport 1440 900
agent-browser open "$baseUrl/dashboard"
agent-browser wait 1000
$desktopOverflow = agent-browser eval "document.documentElement.scrollWidth <= window.innerWidth"
Write-Host "Desktop 1440x900 không tràn ngang: $desktopOverflow" -ForegroundColor ($desktopOverflow -eq "true" ? "Green" : "Red")

# Mobile 390x844
agent-browser set viewport 390 844
agent-browser open "$baseUrl/dashboard"
agent-browser wait 1000
$mobileOverflow = agent-browser eval "document.documentElement.scrollWidth <= window.innerWidth"
Write-Host "Mobile 390x844 không tràn ngang: $mobileOverflow" -ForegroundColor ($mobileOverflow -eq "true" ? "Green" : "Red")

# Chụp screenshot minh chứng
$screenshotPath = "d:/07-Competitions-Hackathons/unicef-dustguard/reports/browser_qa_verified.png"
agent-browser screenshot $screenshotPath
Write-Host "`n📸 Đã lưu ảnh minh chứng kiểm thử tại: $screenshotPath" -ForegroundColor Cyan

Write-Host "`n🎉 HOÀN TẤT BROWSER E2E QA TEST MATRIX!" -ForegroundColor Green
