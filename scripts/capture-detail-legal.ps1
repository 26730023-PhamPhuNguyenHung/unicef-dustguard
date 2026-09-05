$baseUrl = 'http://localhost:3002'
$outDir = 'artifacts/ui-audit'

# Set Desktop Viewport
agent-browser set viewport 1366 768
agent-browser open "$baseUrl/login"
agent-browser wait 1500

# Login admin
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

# Navigate to cases and click first case
agent-browser open "$baseUrl/cases"
agent-browser wait 1500
agent-browser eval "const link = Array.from(document.querySelectorAll('a')).find(a => a.href.includes('/cases/')); if (link) link.click();"
agent-browser wait 2500

# Screenshot Case Detail 1366x768
agent-browser screenshot "$outDir/1366x768_case_detail_workspace.png"
Write-Host "Saved: 1366x768_case_detail_workspace.png"

# Toggle More Actions Dropdown to verify dropdown UX
agent-browser eval "const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Thao tác khác')); if (btn) btn.click();"
agent-browser wait 500
agent-browser screenshot "$outDir/1366x768_case_detail_dropdown.png"
Write-Host "Saved: 1366x768_case_detail_dropdown.png"

# Navigate to Legal Workspace
agent-browser eval "const legalBtn = Array.from(document.querySelectorAll('button, a')).find(b => b.textContent.includes('Thẩm tra pháp lý')); if (legalBtn) legalBtn.click();"
agent-browser wait 2500
agent-browser screenshot "$outDir/1366x768_legal_workspace.png"
Write-Host "Saved: 1366x768_legal_workspace.png"

# Switch to Mobile Viewport for Case Detail
agent-browser set viewport 390 844
agent-browser wait 500
agent-browser open "$baseUrl/cases"
agent-browser wait 1500
agent-browser eval "const link = Array.from(document.querySelectorAll('a')).find(a => a.href.includes('/cases/')); if (link) link.click();"
agent-browser wait 2500
agent-browser screenshot "$outDir/390x844_case_detail.png"
Write-Host "Saved: 390x844_case_detail.png"
