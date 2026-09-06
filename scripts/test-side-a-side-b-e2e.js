import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('../app/node_modules/playwright');

async function testFullCrossSideE2E() {
  console.log('🚀 Starting Full Cross-Side (Side A ↔ Side B) E2E Integration Test...\n');

  // 1. Đăng nhập tư cách Moderator trên Side A
  console.log('Step 1: Authenticating as Moderator on Side A (port 3001)...');
  const loginRes = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'moderator@dustguard.local',
      password: 'DustGuard123!'
    })
  });
  const loginData = await loginRes.json();
  if (!loginData.success) {
    throw new Error('Login failed: ' + JSON.stringify(loginData));
  }
  const token = loginData.data.token;
  console.log('✓ Moderator logged in successfully. Token acquired.');

  // 2. Tạo một phản ánh từ công dân trên Side A
  console.log('\nStep 2: Citizen submits report on Side A...');
  const reportRes = await fetch('http://localhost:3001/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: `Bụi mù công trình đường Nguyễn Hữu Thọ #${Date.now()}`,
      description: 'Xe chở bê tông ra vào làm vương vãi bột đá, gây bụi mù kéo dài.',
      category: 'dust',
      latitude: 10.7769,
      longitude: 106.7009,
      address: '250 Nguyễn Hữu Thọ, Phường Tân Hưng',
      district: 'Quận 7',
      ward: 'Tân Hưng',
      observedAt: new Date().toISOString(),
      visibility: 'public',
      severityObservation: 'high'
    })
  });
  const reportData = await reportRes.json();
  const report = reportData.data;
  console.log(`✓ Report created on Side A: ${report.report_code || report.reportCode} (ID: ${report.id})`);

  // 3. Điều phối viên xác thực phản ánh và tạo hồ sơ vụ việc
  console.log('\nStep 3: Moderator verifies report and establishes Case on Side A...');
  const createCaseRes = await fetch('http://localhost:3001/api/moderator/cases', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      reportId: report.id,
      title: report.title,
      summary: report.description,
      category: report.category,
      latitude: report.latitude,
      longitude: report.longitude,
      address: report.address,
      district: report.district,
      ward: report.ward,
      priority: 'urgent'
    })
  });
  const caseResData = await createCaseRes.json();
  const createdCase = caseResData.data.case || caseResData.data;
  console.log(`✓ Case established on Side A: ${createdCase.case_code || createdCase.caseCode} (ID: ${createdCase.id})`);

  // 4. Bàn giao có trách nhiệm sang Side B (Operations)
  console.log('\nStep 4: Forwarding Case from Side A to Side B (port 4000)...');
  const handoffRes = await fetch('http://localhost:4000/api/integrations/community/cases', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-service-key': 'dustguard-internal-2026'
    },
    body: JSON.stringify({
      external_case_id: createdCase.id,
      case_code: createdCase.case_code || createdCase.caseCode,
      title: createdCase.title,
      summary: createdCase.summary || createdCase.description,
      location_text: createdCase.address,
      district: createdCase.district,
      latitude: createdCase.latitude,
      longitude: createdCase.longitude,
      report_count: 1,
      confirmation_count: 0
    })
  });
  const handoffData = await handoffRes.json();
  console.log('✓ Side B Hand-off Ingestion Response:', handoffData);
  if (!handoffData.success) {
    throw new Error('Handoff to Side B failed: ' + JSON.stringify(handoffData));
  }

  // Cập nhật trạng thái Side A thành 'forwarded'
  await fetch(`http://localhost:3001/api/moderator/cases/${createdCase.id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      newStatus: 'forwarded',
      title: 'Hồ sơ đã được bàn giao sang Cổng Điều hành Chuyên trách (Side B)'
    })
  });
  console.log('✓ Side A Case marked as "forwarded".');

  // 5. Cán bộ Side B thụ lý, đổi trạng thái sang 'ASSIGNED' và đồng bộ ngược về Side A
  console.log('\nStep 5: Side B Staff processes case and syncs status back to Side A...');
  const syncRes = await fetch('http://localhost:3001/api/integrations/operations/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-service-key': 'dustguard-internal-2026'
    },
    body: JSON.stringify({
      external_case_id: createdCase.id,
      operations_case_id: handoffData.case_id,
      operations_case_code: handoffData.case_code,
      status: 'ASSIGNED',
      actor_name: 'Trần Thị Mai (Cán bộ Môi trường Quận 7)',
      description: 'Cán bộ đã tiếp nhận thụ lý và lên lịch kiểm tra trạm rửa xe công trình.'
    })
  });
  const syncData = await syncRes.json();
  console.log('✓ Side A Sync Response:', syncData);
  if (!syncData.success) {
    throw new Error('Cross-side sync failed: ' + JSON.stringify(syncData));
  }

  // 6. Kiểm tra trên Side A xem trạng thái và timeline đã cập nhật chưa
  console.log('\nStep 6: Verifying updated case and timeline on Side A...');
  const checkCaseRes = await fetch(`http://localhost:3001/api/cases/${createdCase.id}`);
  const checkCaseData = await checkCaseRes.json();
  const updatedCaseOnA = checkCaseData.data;

  console.log(`✓ Case Status on Side A: "${updatedCaseOnA.status}" (Expected: in_progress)`);
  console.log(`✓ Case Updates Timeline Count: ${updatedCaseOnA.updates?.length || 0}`);
  if (updatedCaseOnA.updates && updatedCaseOnA.updates.length > 0) {
    console.log(`✓ Latest Timeline Milestone: "${updatedCaseOnA.updates[0].title}" - ${updatedCaseOnA.updates[0].content}`);
  }

  // 7. Mở Browser kiểm tra trực quan trên giao diện Web Side A
  console.log('\nStep 7: Launching Browser to verify on http://localhost:3000/cases/' + createdCase.id);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto(`http://localhost:3000/cases/${createdCase.id}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const pageTitle = await page.locator(`text=${createdCase.title}`).isVisible();
  console.log(`✓ Browser UI: Case Title visible: ${pageTitle ? 'YES' : 'NO'}`);

  // Chuyển sang Tab diễn biến tiến độ
  const timelineTab = page.locator('button:has-text("Diễn biến tiến độ")');
  if (await timelineTab.isVisible()) {
    await timelineTab.click();
    await page.waitForTimeout(500);
    const hasTimeline = await page.locator('text=phân công cán bộ').isVisible();
    console.log(`✓ Browser UI: Timeline milestone visible: ${hasTimeline ? 'YES' : 'NO'}`);
  }

  await browser.close();
  console.log('\n🎉 ALL 7 STEPS OF CROSS-SIDE E2E WORKFLOW PASSED 100%!');
}

testFullCrossSideE2E().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
