import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const DEMO_PASSWORD = 'DustGuard@2026';
const communityPasswordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);
const opsPasswordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);
const now = new Date().toISOString();

console.log('🚀 [Bootstrap Auth] Chuẩn bị dữ liệu tài khoản chính thức cho Cloudflare D1 Remote (DustGuard@2026)...');

// 1. Dữ liệu Side A (Cộng đồng - users)
const communityUsers = [
  {
    id: 'usr_citizen',
    email: 'citizen@dustguard.local',
    phone: '0901234567',
    fullName: 'Nguyễn Văn Dân',
    role: 'citizen',
    district: 'Quận 7',
    ward: 'Tân Phong',
    bio: 'Người dân sinh sống tại khu vực Phú Mỹ Hưng, quan tâm đến chất lượng không khí đô thị.',
    displayIdentity: 'name'
  },
  {
    id: 'usr_member',
    email: 'member@dustguard.local',
    phone: '0902345678',
    fullName: 'Trần Thị Tình Nguyện',
    role: 'community_member',
    district: 'TP. Thủ Đức',
    ward: 'Thảo Điền',
    bio: 'Thành viên CLB Môi Trường Thanh Niên, thường xuyên hỗ trợ xác minh thực địa.',
    displayIdentity: 'name'
  },
  {
    id: 'usr_moderator',
    email: 'moderator@dustguard.local',
    phone: '0903456789',
    fullName: 'Lê Hoàng Điều Phối',
    role: 'moderator',
    district: 'Bình Thạnh',
    ward: 'Phường 25',
    bio: 'Điều phối viên mạng lưới tình nguyện viên và nhóm cộng đồng địa bàn TP.HCM.',
    displayIdentity: 'name'
  },
  {
    id: 'usr_admin',
    email: 'admin@dustguard.local',
    phone: '0904567890',
    fullName: 'Phạm Quản Trị Hệ Thống',
    role: 'admin',
    district: 'Quận 1',
    ward: 'Bến Nghé',
    bio: 'Quản trị viên nền tảng DustGuard Community.',
    displayIdentity: 'name'
  },
  // Bí danh @dustguard.vn
  {
    id: 'usr_citizen_vn',
    email: 'citizen@dustguard.vn',
    phone: '0901234567',
    fullName: 'Nguyễn Văn Dân',
    role: 'citizen',
    district: 'Quận 7',
    ward: 'Tân Phong',
    bio: 'Người dân sinh sống tại khu vực Phú Mỹ Hưng, quan tâm đến chất lượng không khí đô thị.',
    displayIdentity: 'name'
  },
  {
    id: 'usr_member_vn',
    email: 'member@dustguard.vn',
    phone: '0902345678',
    fullName: 'Trần Thị Tình Nguyện',
    role: 'community_member',
    district: 'TP. Thủ Đức',
    ward: 'Thảo Điền',
    bio: 'Thành viên CLB Môi Trường Thanh Niên, thường xuyên hỗ trợ xác minh thực địa.',
    displayIdentity: 'name'
  },
  {
    id: 'usr_moderator_vn',
    email: 'moderator@dustguard.vn',
    phone: '0903456789',
    fullName: 'Lê Hoàng Điều Phối',
    role: 'moderator',
    district: 'Bình Thạnh',
    ward: 'Phường 25',
    bio: 'Điều phối viên mạng lưới tình nguyện viên và nhóm cộng đồng địa bàn TP.HCM.',
    displayIdentity: 'name'
  },
  {
    id: 'usr_admin_vn',
    email: 'admin@dustguard.vn',
    phone: '0904567890',
    fullName: 'Phạm Quản Trị Hệ Thống',
    role: 'admin',
    district: 'Quận 1',
    ward: 'Bến Nghé',
    bio: 'Quản trị viên nền tảng DustGuard Community.',
    displayIdentity: 'name'
  }
];

// 2. Dữ liệu Side B (Chuyên trách - ops_users)
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
  {
    id: 'usr_ops_admin',
    username: 'supervisor_admin',
    email: 'supervisor@dustguard.vn',
    fullName: 'Cán bộ Giám sát Trưởng',
    role: 'admin',
    department: 'Ban Chỉ huy Đô thị & Môi trường'
  },
  {
    id: 'usr_ops_field',
    username: 'field_officer',
    email: 'field@dustguard.vn',
    fullName: 'Võ Minh Thanh Tra',
    role: 'staff',
    department: 'Tổ Thanh tra Thực địa QCVN 18'
  },
  {
    id: 'usr_ops_legal',
    username: 'legal_reviewer',
    email: 'legal@dustguard.vn',
    fullName: 'Nguyễn Thị Pháp Chế',
    role: 'legal_reviewer',
    department: 'Phòng Thẩm định & Pháp chế Môi trường'
  },
  {
    id: 'usr_ops_lead',
    username: 'supervisor_lead',
    email: 'lead@dustguard.vn',
    fullName: 'Trần Văn Điều Hành',
    role: 'supervisor',
    department: 'Trung tâm Tiếp nhận & Phân công'
  },
  // Các alias phổ biến cho demo
  {
    id: 'usr_ops_staff1',
    username: 'staff1',
    email: 'staff1@dustguard.vn',
    fullName: 'Cán bộ Hiện trường 1',
    role: 'staff',
    department: 'Tổ Thanh tra Thực địa QCVN 18'
  },
  {
    id: 'usr_ops_sup1',
    username: 'supervisor1',
    email: 'supervisor1@dustguard.vn',
    fullName: 'Lãnh đạo Điều phối 1',
    role: 'supervisor',
    department: 'Trung tâm Tiếp nhận & Phân công'
  },
  {
    id: 'usr_ops_leg1',
    username: 'legal1',
    email: 'legal1@dustguard.vn',
    fullName: 'Chuyên viên Pháp chế 1',
    role: 'legal_reviewer',
    department: 'Phòng Thẩm định & Pháp chế Môi trường'
  },
  {
    id: 'usr_ops_adm1',
    username: 'admin',
    email: 'admin@dustguard.vn',
    fullName: 'Quản trị Vận hành',
    role: 'admin',
    department: 'Ban Chỉ huy Đô thị & Môi trường'
  }
];

let sql = '-- DUSTGUARD AUTH BOOTSTRAP (PRODUCTION D1)\n\n';

// Seed Side A Users
for (const u of communityUsers) {
  sql += `INSERT OR REPLACE INTO users (id, email, phone, password_hash, full_name, role, status, district, ward, bio, display_identity, created_at, updated_at)\n`;
  sql += `VALUES ('${u.id}', '${u.email}', '${u.phone}', '${communityPasswordHash}', '${u.fullName}', '${u.role}', 'active', '${u.district}', '${u.ward}', '${u.bio}', '${u.displayIdentity}', '${now}', '${now}');\n`;
}

// Seed Side B Ops Users
for (const op of opsUsers) {
  sql += `INSERT OR REPLACE INTO ops_users (id, username, password_hash, full_name, email, role, department, active, created_at)\n`;
  sql += `VALUES ('${op.id}', '${op.username}', '${opsPasswordHash}', '${op.fullName}', '${op.email}', '${op.role}', '${op.department}', 1, '${now}');\n`;
}

const tempFile = path.join(rootDir, 'temp_bootstrap_auth.sql');
fs.writeFileSync(tempFile, sql, 'utf8');

console.log('📦 Đang nạp tài khoản vào Remote D1 (dustguard-production)...');
try {
  execSync('npx wrangler d1 execute dustguard-production --remote --file=temp_bootstrap_auth.sql', {
    cwd: rootDir,
    stdio: 'inherit'
  });
  console.log('✅ Nạp thành công toàn bộ tài khoản Side A & Side B vào Remote D1!');
} finally {
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
  }
}
