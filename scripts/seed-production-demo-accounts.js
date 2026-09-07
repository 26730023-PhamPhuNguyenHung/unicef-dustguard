import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const DEMO_PASSWORD = 'DustGuard@2026';
const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);
const now = new Date().toISOString();

console.log('🔐 [Seed Production] Đang khởi tạo tài khoản demo với chuẩn bảo mật bcrypt...');
console.log('   Password:', DEMO_PASSWORD);
console.log('   Hash length:', passwordHash.length);
console.log('   Self-test compare:', bcrypt.compareSync(DEMO_PASSWORD, passwordHash));

// 1. Danh sách tài khoản Đơn vị Xử lý (Side B)
const opsUsers = [
  {
    id: 'usr_ops_canbo_hientruong',
    username: 'canbo.hientruong',
    email: 'canbo.hientruong@dustguard.vn',
    fullName: 'Nguyễn Minh Anh',
    role: 'staff',
    department: 'Tổ Thanh tra Thực địa QCVN 18'
  },
  {
    id: 'usr_ops_lanhdao_dieuphoi',
    username: 'lanhdao.dieuphoi',
    email: 'lanhdao.dieuphoi@dustguard.vn',
    fullName: 'Trần Quốc Minh',
    role: 'supervisor',
    department: 'Trung tâm Tiếp nhận & Phân công'
  },
  {
    id: 'usr_ops_chuyenvien_phapche',
    username: 'chuyenvien.phapche',
    email: 'chuyenvien.phapche@dustguard.vn',
    fullName: 'Lê Thanh Hà',
    role: 'legal_reviewer',
    department: 'Phòng Thẩm định & Pháp chế Môi trường'
  },
  {
    id: 'usr_ops_quantri_dustguard',
    username: 'quantri.dustguard',
    email: 'quantri.dustguard@dustguard.vn',
    fullName: 'Quản trị DustGuard',
    role: 'admin',
    department: 'Ban Chỉ huy Đô thị & Môi trường'
  },
  // Giữ các bí danh lịch sử tương thích
  {
    id: 'usr_ops_staff1',
    username: 'staff1',
    email: 'staff1@dustguard.vn',
    fullName: 'Nguyễn Minh Anh (Cán bộ Hiện trường)',
    role: 'staff',
    department: 'Tổ Thanh tra Thực địa QCVN 18'
  },
  {
    id: 'usr_ops_sup1',
    username: 'supervisor1',
    email: 'supervisor1@dustguard.vn',
    fullName: 'Trần Quốc Minh (Lãnh đạo Điều phối)',
    role: 'supervisor',
    department: 'Trung tâm Tiếp nhận & Phân công'
  },
  {
    id: 'usr_ops_leg1',
    username: 'legal1',
    email: 'legal1@dustguard.vn',
    fullName: 'Lê Thanh Hà (Chuyên viên Pháp chế)',
    role: 'legal_reviewer',
    department: 'Phòng Thẩm định & Pháp chế Môi trường'
  },
  {
    id: 'usr_ops_adm1',
    username: 'admin',
    email: 'admin@dustguard.vn',
    fullName: 'Quản trị DustGuard',
    role: 'admin',
    department: 'Ban Chỉ huy Đô thị & Môi trường'
  }
];

// 2. Tài khoản Cộng đồng (Side A)
const communityUsers = [
  { id: 'usr_citizen', email: 'citizen@dustguard.local', fullName: 'Nguyễn Văn Dân', role: 'citizen' },
  { id: 'usr_member', email: 'member@dustguard.local', fullName: 'Trần Thị Tình Nguyện', role: 'community_member' },
  { id: 'usr_moderator', email: 'moderator@dustguard.local', fullName: 'Lê Hoàng Điều Phối', role: 'moderator' },
  { id: 'usr_admin', email: 'admin@dustguard.local', fullName: 'Phạm Quản Trị Hệ Thống', role: 'admin' },
  { id: 'usr_citizen_vn', email: 'citizen@dustguard.vn', fullName: 'Nguyễn Văn Dân', role: 'citizen' },
  { id: 'usr_member_vn', email: 'member@dustguard.vn', fullName: 'Trần Thị Tình Nguyện', role: 'community_member' },
  { id: 'usr_moderator_vn', email: 'moderator@dustguard.vn', fullName: 'Lê Hoàng Điều Phối', role: 'moderator' },
  { id: 'usr_admin_vn', email: 'admin@dustguard.vn', fullName: 'Phạm Quản Trị Hệ Thống', role: 'admin' }
];

let sql = '-- DUSTGUARD OFFICIAL DEMO & PRODUCTION AUTH SEED\nPRAGMA foreign_keys = OFF;\n\n';

// 1. Seed ops_users
for (const u of opsUsers) {
  sql += `INSERT OR REPLACE INTO ops_users (id, username, password_hash, full_name, email, role, department, active, created_at)\n`;
  sql += `VALUES ('${u.id}', '${u.username}', '${passwordHash}', '${u.fullName}', '${u.email}', '${u.role}', '${u.department}', 1, '${now}');\n`;
}

// Cập nhật toàn bộ ops_users hiện có về passwordHash chuẩn
sql += `UPDATE ops_users SET password_hash = '${passwordHash}';\n\n`;

// 2. Seed users (Side A)
for (const c of communityUsers) {
  sql += `INSERT OR REPLACE INTO users (id, email, password_hash, full_name, role, status, created_at, updated_at)\n`;
  sql += `VALUES ('${c.id}', '${c.email}', '${passwordHash}', '${c.fullName}', '${c.role}', 'active', '${now}', '${now}');\n`;
}
sql += `UPDATE users SET password_hash = '${passwordHash}' WHERE email LIKE '%@dustguard.%';\n\n`;

// 3. Đảm bảo có mẫu biên bản kiểm tra tiêu chuẩn
sql += `INSERT OR IGNORE INTO inspection_templates (id, name, description, category, active, created_at)
VALUES ('tpl_standard', 'Biên bản kiểm tra chấp hành bảo vệ môi trường công trình xây dựng', 'Tiêu chuẩn TCVN 05:2023/BTNMT', 'CONSTRUCTION', 1, '${now}');\n\n`;

// 4. Đảm bảo có sample ops_cases
sql += `INSERT OR IGNORE INTO ops_cases (id, case_code, title, description, location_text, district, latitude, longitude, source, status, priority, created_at, updated_at)
VALUES
  ('cas_pipeline_001', 'CASE-2026-001', 'Phát tán bụi diện rộng tại công trường Eco Green', 'Công trường thi công không che chắn lưới tầng cao, bụi xi măng bay vào khu dân cư', 'Nguyễn Văn Linh, Quận 7', 'Quận 7', 10.7325, 106.7150, 'COMMUNITY', 'INSPECTION_PLANNED', 'HIGH', '${now}', '${now}'),
  ('cas_pipeline_002', 'CASE-2026-002', 'Xe tải kéo vệt bùn đất và bụi trên đường Láng Hạ', 'Trạm rửa xe hư hỏng, đoàn xe ben chở phế thải lăn bánh trực tiếp ra đường phố', 'Số 88 Láng Hạ, Đống Đa', 'Đống Đa', 21.0165, 105.8155, 'IOT', 'INSPECTION_IN_PROGRESS', 'URGENT', '${now}', '${now}'),
  ('cas_36c590d1b7ac4872', 'CASE-2026-003', 'Bụi phát tán từ công trình nâng cấp Vành đai 3', 'Thiếu hệ thống phun sương dập bụi tự động dọc hàng rào tôn giáp trường tiểu học', 'Quốc lộ 13, TP. Thủ Đức', 'TP. Thủ Đức', 10.8495, 106.7535, 'MANUAL', 'LEGAL_REVIEW', 'NORMAL', '${now}', '${now}');\n\n`;

// 5. Gán hồ sơ cho canbo.hientruong
sql += `UPDATE ops_cases SET assigned_staff_id = 'usr_ops_canbo_hientruong'
WHERE id IN ('cas_pipeline_001', 'cas_pipeline_002', 'cas_36c590d1b7ac4872')
   OR assigned_staff_id = 'usr_ops_staff1'
   OR assigned_staff_id IS NULL;\n\n`;

// 6. Seed sample inspections cho canbo.hientruong
sql += `INSERT OR REPLACE INTO inspections (id, case_id, inspector_id, template_id, inspection_type, scheduled_date, performed_at, status, location_text, note, created_at, updated_at)
VALUES
  ('insp_demo_001', 'cas_pipeline_001', 'usr_ops_canbo_hientruong', 'tpl_standard', 'INITIAL', '2026-09-08', NULL, 'PLANNED', 'Số 88 Láng Hạ, Đống Đa, Hà Nội', 'Kế hoạch kiểm tra che chắn mặt tiền và trạm xịt rửa', '${now}', '${now}'),
  ('insp_demo_002', 'cas_pipeline_002', 'usr_ops_canbo_hientruong', 'tpl_standard', 'INITIAL', '2026-09-07', '2026-09-07 09:30:00', 'IN_PROGRESS', 'Dự án Eco Green, Nguyễn Văn Linh, Quận 7', 'Đang tiến hành đo đạc nồng độ bụi phát tán tại cổng số 2', '${now}', '${now}');\n\n`;

// 7. Seed sample corrective actions
sql += `INSERT OR REPLACE INTO corrective_actions (id, case_id, inspection_id, title, description, responsible_party, due_at, status, created_by, created_at)
VALUES
  ('act_demo_001', 'cas_pipeline_001', 'insp_demo_001', 'Bổ sung lưới chắn bụi 3 lớp mặt tiền giáp khu dân cư', 'Thay thế toàn bộ lưới rách, phủ kín giàn giáo từ tầng 5 đến tầng 18', 'Công ty CP Xây dựng Dân dụng', datetime('now', '+3 days'), 'OPEN', 'usr_ops_canbo_hientruong', '${now}'),
  ('act_demo_002', 'cas_pipeline_002', 'insp_demo_002', 'Sửa chữa và vận hành trạm rửa xe tự động tại cổng ra vào', 'Đảm bảo 100% xe ben và xe bồn được xịt rửa sạch bánh trước khi ra đường', 'Ban Chỉ huy Công trường Eco Green', datetime('now', '+2 days'), 'IN_PROGRESS', 'usr_ops_canbo_hientruong', '${now}');\n`;

const tempFile = path.join(rootDir, 'temp_seed_demo_accounts.sql');
fs.writeFileSync(tempFile, sql, 'utf8');

try {
  console.log('\n🚀 [1/2] Đang nạp dữ liệu vào Cloudflare D1 Remote (dustguard-production)...');
  execSync('npx wrangler d1 execute dustguard-production --remote --file=temp_seed_demo_accounts.sql', {
    cwd: rootDir,
    stdio: 'inherit'
  });
  console.log('✅ Nạp thành công vào Remote D1!');

  console.log('\n🚀 [2/2] Đang nạp dữ liệu vào Cloudflare D1 Local...');
  execSync('npx wrangler d1 execute dustguard-production --local --file=temp_seed_demo_accounts.sql', {
    cwd: rootDir,
    stdio: 'inherit'
  });
  console.log('✅ Nạp thành công vào Local D1!');
} finally {
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
  }
}

console.log('\n🎉 Hoàn thành seed tài khoản demo DustGuard@2026!');
