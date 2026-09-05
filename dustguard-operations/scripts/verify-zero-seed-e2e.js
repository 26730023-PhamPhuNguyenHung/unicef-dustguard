import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.env.NODE_ENV = 'test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const testDbPath = path.join(rootDir, 'data', 'test-zero-seed-browser.db');

console.log('================================================================');
console.log('🚀 ZERO-SEED FULL END-TO-END VERIFICATION SUITE (REAL DATA)');
console.log('   Mục tiêu: Đảm bảo DustGuard vận hành 100% từ Zero Data');
console.log('   Không seed demo, không hardcode, D1/SQLite SSOT bền vững');
console.log('================================================================\n');

// 1. Dọn dẹp DB cũ nếu có
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

// 2. Chạy Migrations khởi tạo bảng (KHÔNG CHẠY SEED)
console.log('[Phase 1] Khởi tạo Database rỗng với cấu trúc 36 bảng...');
process.env.DB_PATH = testDbPath;
const { db, get, query } = await import('../apps/server/src/db/connection.ts');
const { runMigrations } = await import('../apps/server/src/db/migrate.ts');
runMigrations(true);

// Kiểm tra tính rỗng tuyệt đối
const userCount = get(`SELECT count(*) as c FROM users`)?.c;
const caseCount = get(`SELECT count(*) as c FROM cases`)?.c;
const projectCount = get(`SELECT count(*) as c FROM projects`)?.c;
console.log(`✓ DB trạng thái ban đầu: Users=${userCount}, Cases=${caseCount}, Projects=${projectCount}`);
if (userCount !== 0 || caseCount !== 0 || projectCount !== 0) {
  console.error('❌ Thất bại: Database không ở trạng thái rỗng hoàn toàn!');
  process.exit(1);
}

// 3. Khởi động Backend Server trên cổng 4099
console.log('\n[Phase 2] Khởi động Backend API Server (cổng 4099)...');
const { app } = await import('../apps/server/src/index.ts');
let server;
await new Promise(resolve => {
  server = app.listen(4099, () => {
    console.log('✓ Backend API Server đã sẵn sàng tại http://localhost:4099');
    resolve();
  });
});

const API_BASE = 'http://localhost:4099';

// Hàm gửi request API
async function apiReq(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, { ...options, headers });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { status: res.status, ok: res.ok, data };
}

// Bắt đầu chuỗi kiểm thử E2E 12 bước
try {
  // BƯỚC 1: Kiểm tra endpoint kiểm tra trạng thái khởi tạo
  console.log('\n[Step 1] Kiểm tra GET /api/auth/setup-status...');
  const setupStatus = await apiReq('/api/auth/setup-status');
  console.log('  Kết quả:', setupStatus.data);
  if (setupStatus.data.is_initialized !== false || setupStatus.data.user_count !== 0) {
    throw new Error('Setup status không phản ánh đúng trạng thái chưa khởi tạo!');
  }
  console.log('✓ Step 1 PASS: Hệ thống nhận diện chính xác trạng thái chưa có tài khoản nào.');

  // BƯỚC 2: Tạo Super Admin đầu tiên qua Bootstrap
  console.log('\n[Step 2] Thực hiện Bootstrap tạo Super Admin đầu tiên...');
  const bootstrapRes = await apiReq('/api/auth/bootstrap', {
    method: 'POST',
    body: JSON.stringify({
      username: 'admin_real',
      password: 'AdminRealPassword2026!',
      full_name: 'Trần Văn Quản Trị Viên',
      email: 'admin.real@dustguard.vn',
      department: 'Sở TN&MT Hà Nội - Ban Chỉ huy',
      phone: '0912345678',
    }),
  });
  if (bootstrapRes.status !== 201 || !bootstrapRes.data.token) {
    throw new Error(`Bootstrap thất bại: ${JSON.stringify(bootstrapRes.data)}`);
  }
  const adminToken = bootstrapRes.data.token;
  console.log(`✓ Step 2 PASS: Đã tạo Super Admin "${bootstrapRes.data.user.username}" với JWT Token hợp lệ.`);

  // BƯỚC 3: Thử Bootstrap lần 2 (Phải bị khóa 403 Forbidden)
  console.log('\n[Step 3] Kiểm tra khóa vĩnh viễn Bootstrap (Anti-takeover)...');
  const lockedRes = await apiReq('/api/auth/bootstrap', {
    method: 'POST',
    body: JSON.stringify({
      username: 'hacker',
      password: 'hackerPassword',
      full_name: 'Kẻ Xâm Nhập',
      email: 'hacker@test.com',
    }),
  });
  if (lockedRes.status !== 403) {
    throw new Error(`Lỗ hổng bảo mật: Bootstrap lần 2 không bị chặn 403 (Nhận: ${lockedRes.status})`);
  }
  console.log('✓ Step 3 PASS: Bootstrap đã bị khóa vĩnh viễn với mã lỗi 403 Forbidden.');

  // BƯỚC 4: Đăng nhập bằng tài khoản vừa tạo
  console.log('\n[Step 4] Đăng nhập bằng tài khoản Super Admin vừa tạo...');
  const loginRes = await apiReq('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username: 'admin_real',
      password: 'AdminRealPassword2026!',
    }),
  });
  if (loginRes.status !== 200 || !loginRes.data.token) {
    throw new Error(`Đăng nhập thất bại: ${JSON.stringify(loginRes.data)}`);
  }
  console.log(`✓ Step 4 PASS: Đăng nhập thành công, quyền hạn: ${loginRes.data.permissions.join(', ')}`);

  // BƯỚC 5: Dashboard ban đầu với dữ liệu thật 0 vụ việc
  console.log('\n[Step 5] Kiểm tra chỉ số Dashboard khi chưa có vụ việc nào...');
  const dashRes = await apiReq('/api/dashboard', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  if (dashRes.status !== 200) {
    throw new Error(`Không thể tải Dashboard: ${JSON.stringify(dashRes.data)}`);
  }
  console.log('  Chỉ số Dashboard:', dashRes.data.metrics);
  if (dashRes.data.metrics.new_cases !== 0 || dashRes.data.myQueue.length !== 0) {
    throw new Error('Dashboard phải hiển thị 0 vụ việc trong hệ thống mới!');
  }
  console.log('✓ Step 5 PASS: Dashboard trung thực hiển thị 0 vụ việc, không fake số liệu.');

  // BƯỚC 6: Tạo Đơn vị Nhà thầu thật
  console.log('\n[Step 6] Tạo thực thể Nhà thầu thi công thật qua API...');
  const contractorRes = await apiReq('/api/contractors', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      name: 'Tổng Công ty Xây dựng Thăng Long - CTCP',
      tax_code: '0100105423',
      contact_person: 'Nguyễn Đình Tuấn (Giám đốc thi công)',
      phone: '0988776655',
      email: 'tuan.nd@thanglongcorp.vn',
      address: 'Số 72 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
    }),
  });
  if (contractorRes.status !== 201 || !contractorRes.data.contractor?.id) {
    throw new Error(`Tạo nhà thầu thất bại: ${JSON.stringify(contractorRes.data)}`);
  }
  const contractor = contractorRes.data.contractor;
  console.log(`✓ Step 6 PASS: Đã tạo nhà thầu "${contractor.name}" (ID: ${contractor.id})`);

  // BƯỚC 7: Tạo Dự án Công trình xây dựng thật liên kết nhà thầu
  console.log('\n[Step 7] Tạo Công trình xây dựng thật liên kết với nhà thầu...');
  const projectRes = await apiReq('/api/projects', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      code: 'PRJ-2026-KMD',
      name: 'Hầm chui Nút giao Giải Phóng - Kim Đồng (Vành đai 2.5)',
      contractor_id: contractor.id,
      district: 'Hoàng Mai',
      address: 'Nút giao Kim Đồng - Giải Phóng, Phường Định Công, Quận Hoàng Mai, Hà Nội',
      lat: 20.9852,
      lng: 105.8436,
      status: 'ACTIVE',
    }),
  });
  if (projectRes.status !== 201 || !projectRes.data.project?.id) {
    throw new Error(`Tạo công trình thất bại: ${JSON.stringify(projectRes.data)}`);
  }
  const project = projectRes.data.project;
  console.log(`✓ Step 7 PASS: Đã tạo công trình "${project.name}" (ID: ${project.id})`);

  // BƯỚC 8: Tiếp nhận Phản ánh và Tạo Hồ sơ vụ việc liên kết Công trình
  console.log('\n[Step 8] Tạo Hồ sơ vụ việc vi phạm liên kết Công trình...');
  const caseRes = await apiReq('/api/cases', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      title: 'Bụi đất mù mịt phát tán do xe tải ra vào hầm chui Kim Đồng không rửa lốp',
      description: 'Đoàn xe ben chở đất thi công hầm chui cuốn theo lượng bụi cực lớn làm tầm nhìn giảm dưới 20m, gây khó thở cho người dân xung quanh.',
      project_id: project.id,
      district: 'Hoàng Mai',
      location_text: 'Nút giao Giải Phóng - Kim Đồng',
      latitude: 20.9852,
      longitude: 105.8436,
      severity: 'HIGH',
      priority: 'URGENT',
      category: 'DUST_EMISSION',
      source_channel: 'CITIZEN_MOBILE',
    }),
  });
  if (caseRes.status !== 201 || !caseRes.data.case?.id) {
    throw new Error(`Tạo vụ việc thất bại: ${JSON.stringify(caseRes.data)}`);
  }
  const caseItem = caseRes.data.case;
  console.log(`✓ Step 8 PASS: Đã tạo vụ việc [${caseItem.case_code}] - ${caseItem.title} (ID: ${caseItem.id})`);

  // BƯỚC 9: Tải lên Bằng chứng ảnh thật với mã băm SHA-256 niêm phong
  console.log('\n[Step 9] Tải lên tệp bằng chứng hiện trường thật và kiểm định băm SHA-256...');
  // Tạo tệp ảnh giả lập thực tế trên đĩa
  const sampleImagePath = path.join(rootDir, 'data', 'temp_evidence_photo.jpg');
  const sampleImageData = Buffer.from('DUSTGUARD_AUTHENTIC_FIELD_EVIDENCE_SAMPLE_PHOTO_BYTES_' + Date.now());
  fs.writeFileSync(sampleImagePath, sampleImageData);

  const formData = new FormData();
  formData.append('case_id', caseItem.id);
  formData.append('source_type', 'CASE');
  formData.append('file', new Blob([sampleImageData], { type: 'image/jpeg' }), 'hien_truong_kim_dong.jpg');

  const uploadRes = await fetch(`${API_BASE}/api/evidence/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: formData,
  });
  const uploadJson = await uploadRes.json();
  if (uploadRes.status !== 201 || !uploadJson.asset?.sha256) {
    throw new Error(`Tải lên bằng chứng thất bại: ${JSON.stringify(uploadJson)}`);
  }
  const asset = uploadJson.asset;
  console.log(`✓ Step 9 PASS: Bằng chứng "${asset.file_name}" đã được tải lên và niêm phong.`);
  console.log(`  Mã băm SHA-256: ${asset.sha256}`);

  // Kiểm tra xác thực toàn vẹn băm
  const verifyHashRes = await apiReq(`/api/evidence/${asset.id}/verify-hash`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  if (verifyHashRes.status !== 200 || verifyHashRes.data.verified !== true) {
    throw new Error(`Xác thực băm SHA-256 thất bại: ${JSON.stringify(verifyHashRes.data)}`);
  }
  console.log('✓ Step 9.1 PASS: Xác thực toàn vẹn SHA-256 trên đĩa khớp 100%.');

  // BƯỚC 10: Chuyển trạng thái sang LEGAL_REVIEW và Chạy Phân tích Pháp lý
  console.log('\n[Step 10] Chuyển trạng thái vụ việc và kiểm tra Phân tích Pháp lý thực tế...');
  // Chuyển sang ASSIGNED rồi LEGAL_REVIEW
  await apiReq(`/api/cases/${caseItem.id}/transition`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ to_status: 'ASSIGNED', note: 'Phân công xác minh hiện trường' }),
  });
  await apiReq(`/api/cases/${caseItem.id}/transition`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ to_status: 'LEGAL_REVIEW', note: 'Chuyển pháp chế rà soát dữ kiện' }),
  });

  // Gọi API phân tích pháp lý
  const analysisRes = await apiReq(`/api/cases/${caseItem.id}/analysis`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  if (analysisRes.status !== 200 || (!analysisRes.data.output && !analysisRes.data.analysis)) {
    throw new Error(`Phân tích pháp lý thất bại: ${JSON.stringify(analysisRes.data)}`);
  }
  const analysisOutput = analysisRes.data.output || analysisRes.data.analysis?.output || analysisRes.data.analysis;
  console.log('  Kết luận pháp lý:', {
    conclusion_level: analysisOutput.conclusion_level,
    missing_facts_count: analysisOutput.missing_facts?.length || 0,
    next_priorities_count: analysisOutput.next_priorities?.length || 0,
  });

  // Kiểm tra: Vì hồ sơ mới chỉ có ảnh phản ánh ban đầu, CHƯA CÓ biên bản kiểm tra đạt chuẩn
  // nên conclusion_level PHẢI là INSUFFICIENT_EVIDENCE hoặc SUPPORTED_PRELIMINARY, KHÔNG THỂ là HUMAN_CONFIRMED
  if (analysisOutput.conclusion_level === 'HUMAN_CONFIRMED') {
    throw new Error('Lỗi logic pháp lý: Hồ sơ thiếu biên bản mà lại kết luận HUMAN_CONFIRMED!');
  }
  console.log(`✓ Step 10 PASS: Phân tích pháp lý nhận diện chính xác trạng thái bằng chứng (${analysisOutput.conclusion_level})`);
  console.log(`  Danh sách thiếu sót được chỉ rõ: ${(analysisOutput.missing_facts || []).map(f => f.title).join('; ')}`);

  // BƯỚC 11: Tạo Tác vụ Xác minh Hiện trường
  console.log('\n[Step 11] Tạo Tác vụ Kiểm tra hiện trường...');
  const taskRes = await apiReq('/api/tasks', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      title: 'Kiểm tra trạm rửa xe và bạt che chắn tại công trường Kim Đồng',
      description: 'Xuất hiện phản ánh bụi mù mịt từ xe ben. Cần đến kiểm tra trực tiếp và lập biên bản.',
      task_type: 'FIELD_INSPECTION',
      case_id: caseItem.id,
      priority: 'HIGH',
      due_date: new Date(Date.now() + 86400000).toISOString(),
    }),
  });
  if (taskRes.status !== 201 || !taskRes.data.task?.id) {
    throw new Error(`Tạo tác vụ thất bại: ${JSON.stringify(taskRes.data)}`);
  }
  const task = taskRes.data.task;
  console.log(`✓ Step 11 PASS: Đã tạo tác vụ [${task.title}] (ID: ${task.id}) liên kết vụ việc [${caseItem.case_code}]`);

  // BƯỚC 12: Kiểm tra Tính Bền vững (Persistence Verification trực tiếp trong SQLite)
  console.log('\n[Step 12] Kiểm tra tính bền vững trực tiếp trong SQLite D1 SSOT...');
  const rowUser = get(`SELECT count(*) as c FROM users WHERE username = ?`, ['admin_real'])?.c;
  const rowContractor = get(`SELECT count(*) as c FROM contractors WHERE id = ?`, [contractor.id])?.c;
  const rowProject = get(`SELECT count(*) as c FROM projects WHERE id = ?`, [project.id])?.c;
  const rowCase = get(`SELECT count(*) as c FROM cases WHERE id = ?`, [caseItem.id])?.c;
  const rowEvidence = get(`SELECT count(*) as c FROM evidence_assets WHERE id = ?`, [asset.id])?.c;
  const rowTask = get(`SELECT count(*) as c FROM tasks WHERE id = ?`, [task.id])?.c;

  console.log('  Số bản ghi đã lưu bền vững:', {
    user: rowUser,
    contractor: rowContractor,
    project: rowProject,
    case: rowCase,
    evidence: rowEvidence,
    task: rowTask,
  });

  if (rowUser !== 1 || rowContractor !== 1 || rowProject !== 1 || rowCase !== 1 || rowEvidence !== 1 || rowTask !== 1) {
    throw new Error('Lỗi bền vững: Dữ liệu không được ghi nhận đầy đủ vào SQLite database!');
  }
  console.log('✓ Step 12 PASS: 100% dữ liệu đã được lưu bền vững vào SQLite D1 SSOT!');

  // Dọn dẹp tệp ảnh tạm
  try {
    fs.unlinkSync(sampleImagePath);
  } catch {}

  console.log('\n================================================================');
  console.log('🎉 TẤT CẢ 12 BƯỚC KIỂM THỬ REAL-DATA E2E ĐÃ PASS HOÀN HẢO 100%!');
  console.log('   - Hệ thống sẵn sàng vận hành từ Zero Data');
  console.log('   - Không còn phụ thuộc vào bất kỳ dòng mã seed nào');
  console.log('   - Các nghiệp vụ: Bootstrap -> Contractor -> Project -> Case -> Evidence -> Legal -> Task đều trơn tru');
  console.log('================================================================\n');

  process.exit(0);
} catch (err) {
  console.error('\n❌ E2E VERIFICATION FAILED:', err);
  process.exit(1);
} finally {
  if (server) {
    server.close();
  }
}
