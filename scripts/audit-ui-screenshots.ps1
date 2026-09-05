# PowerShell script for automated UI screenshot capture & responsive audit
$baseUrl = 'http://localhost:3002'
$outDir = 'artifacts/ui-audit'

if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

Write-Host "`n=========================================================="
Write-Host "   DUSTGUARD VN - UI SCREENSHOT AND RESPONSIVE AUDIT"
Write-Host "=========================================================="

# 1. Desktop Viewport 1366x768
Write-Host "`n[PHASE 1] Thiet lap Viewport Laptop 1366x768..."
agent-browser set viewport 1366 768
agent-browser open "$baseUrl/login"
agent-browser wait 1500

# Login admin
Write-Host "[PHASE 2] Dang nhap tai khoan Admin..."
$loginCode = @'
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('admin') || b.textContent.includes('Quản trị'));
  if (btn) btn.click();
  setTimeout(() => {
    const submit = document.querySelector('button[type="submit"]');
    if (submit) submit.click();
  }, 300);
'@
agent-browser eval $loginCode
agent-browser wait 2500

$paths = @('/dashboard', '/cases', '/evidence', '/inspections', '/actions')
$names = @('dashboard', 'cases', 'evidence', 'inspections', 'actions')

Write-Host "`n[PHASE 3] Chup anh man hinh 1366x768..."
for ($i = 0; $i -lt $paths.Length; $i++) {
    $p = $paths[$i]
    $n = $names[$i]
    $url = "$baseUrl$p"
    agent-browser open $url
    agent-browser wait 1200
    $shot = "$outDir/1366x768_$n.png"
    agent-browser screenshot $shot
    Write-Host "  -> Da luu: $shot"
}

Write-Host "`n[PHASE 4] Chup anh man hinh Mobile 390x844..."
agent-browser set viewport 390 844
agent-browser wait 500

for ($i = 0; $i -lt $paths.Length; $i++) {
    $p = $paths[$i]
    $n = $names[$i]
    $url = "$baseUrl$p"
    agent-browser open $url
    agent-browser wait 1200
    $shot = "$outDir/390x844_$n.png"
    agent-browser screenshot $shot
    Write-Host "  -> Da luu: $shot"
}

Write-Host "`nHOAN THANH CHUP ANH TOAN BO GIAO DIEN!"
Get-ChildItem -Path $outDir | Select-Object Name, Length
