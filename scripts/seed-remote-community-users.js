import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const passwordHash = bcrypt.hashSync('DustGuard123!', 10);
const now = new Date().toISOString();

const users = [
  {
    id: 'usr_citizen',
    email: 'citizen@dustguard.local',
    fullName: 'Nguyễn Văn Dân',
    phone: '0901234567',
    role: 'citizen',
    district: 'Quận 7',
    ward: 'Tân Phong',
    bio: 'Người dân sinh sống tại khu vực Phú Mỹ Hưng, quan tâm đến chất lượng không khí.',
    displayIdentity: 'name'
  },
  {
    id: 'usr_member',
    email: 'member@dustguard.local',
    fullName: 'Trần Thị Tình Nguyện',
    phone: '0902345678',
    role: 'community_member',
    district: 'TP. Thủ Đức',
    ward: 'Thảo Điền',
    bio: 'Thành viên CLB Môi Trường Thanh Niên, thường xuyên hỗ trợ xác minh thực địa.',
    displayIdentity: 'name'
  },
  {
    id: 'usr_moderator',
    email: 'moderator@dustguard.local',
    fullName: 'Lê Hoàng Điều Phối',
    phone: '0903456789',
    role: 'moderator',
    district: 'Bình Thạnh',
    ward: 'Phường 25',
    bio: 'Điều phối viên mạng lưới tình nguyện viên và nhóm cộng đồng địa bàn TP.HCM.',
    displayIdentity: 'name'
  },
  {
    id: 'usr_admin',
    email: 'admin@dustguard.local',
    fullName: 'Phạm Quản Trị Hệ Thống',
    phone: '0904567890',
    role: 'admin',
    district: 'Quận 1',
    ward: 'Bến Nghé',
    bio: 'Quản trị viên nền tảng DustGuard Community.',
    displayIdentity: 'name'
  },
  // Alias @dustguard.vn
  {
    id: 'usr_citizen_vn',
    email: 'citizen@dustguard.vn',
    fullName: 'Nguyễn Văn Dân',
    phone: '0901234567',
    role: 'citizen',
    district: 'Quận 7',
    ward: 'Tân Phong',
    bio: 'Người dân sinh sống tại khu vực Phú Mỹ Hưng, quan tâm đến chất lượng không khí.',
    displayIdentity: 'name'
  },
  {
    id: 'usr_member_vn',
    email: 'member@dustguard.vn',
    fullName: 'Trần Thị Tình Nguyện',
    phone: '0902345678',
    role: 'community_member',
    district: 'TP. Thủ Đức',
    ward: 'Thảo Điền',
    bio: 'Thành viên CLB Môi Trường Thanh Niên, thường xuyên hỗ trợ xác minh thực địa.',
    displayIdentity: 'name'
  },
  {
    id: 'usr_moderator_vn',
    email: 'moderator@dustguard.vn',
    fullName: 'Lê Hoàng Điều Phối',
    phone: '0903456789',
    role: 'moderator',
    district: 'Bình Thạnh',
    ward: 'Phường 25',
    bio: 'Điều phối viên mạng lưới tình nguyện viên và nhóm cộng đồng địa bàn TP.HCM.',
    displayIdentity: 'name'
  },
  {
    id: 'usr_admin_vn',
    email: 'admin@dustguard.vn',
    fullName: 'Phạm Quản Trị Hệ Thống',
    phone: '0904567890',
    role: 'admin',
    district: 'Quận 1',
    ward: 'Bến Nghé',
    bio: 'Quản trị viên nền tảng DustGuard Community.',
    displayIdentity: 'name'
  }
];

let sql = '-- Seed Demo Users for DustGuard Community\n';
for (const u of users) {
  sql += `INSERT OR REPLACE INTO users (id, email, phone, password_hash, full_name, role, status, district, ward, bio, display_identity, created_at, updated_at)\n`;
  sql += `VALUES ('${u.id}', '${u.email}', '${u.phone}', '${passwordHash}', '${u.fullName}', '${u.role}', 'active', '${u.district}', '${u.ward}', '${u.bio}', '${u.displayIdentity}', '${now}', '${now}');\n`;
}

const tempFile = path.join(rootDir, 'temp_users_seed.sql');
fs.writeFileSync(tempFile, sql, 'utf8');

console.log('🌱 Đang nạp tài khoản demo Side A vào Remote D1 dustguard-production...');
try {
  execSync('npx wrangler d1 execute dustguard-production --remote --file=temp_users_seed.sql', {
    cwd: rootDir,
    stdio: 'inherit'
  });
  console.log('✅ Nạp tài khoản demo Side A thành công!');
} finally {
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
  }
}
