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
agent-browser wait 2000

# Navigate to cases and find first case ID, then go directly to its /legal route
agent-browser open "$baseUrl/cases"
agent-browser wait 1500
$goToLegalCode = @'
  const caseLink = Array.from(document.querySelectorAll('a')).find(a => a.href && a.href.includes('/cases/case-'));
  if (caseLink) {
    const caseId = caseLink.href.split('/cases/')[1].split('/')[0];
    window.location.href = '/cases/' + caseId + '/legal';
  }
'@
agent-browser eval $goToLegalCode
agent-browser wait 3000

# Capture Legal Workspace Screenshot
agent-browser screenshot "$outDir/1366x768_legal_workspace.png"
Write-Host "Saved: 1366x768_legal_workspace.png"

# Navigate to Field Inspection checklist
agent-browser open "$baseUrl/inspections"
agent-browser wait 1500
$goToInspCode = @'
  const inspLink = Array.from(document.querySelectorAll('a')).find(a => a.href && a.href.includes('/inspections/'));
  if (inspLink) {
    inspLink.click();
  }
'@
agent-browser eval $goToInspCode
agent-browser wait 2500
agent-browser screenshot "$outDir/1366x768_field_inspection.png"
Write-Host "Saved: 1366x768_field_inspection.png"

Write-Host "DONE!"
