import { DatabaseSync } from 'node:sqlite';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const PWD_2026 = 'DustGuard@2026';
const PWD_123 = 'DustGuard123!';
const hash2026 = bcrypt.hashSync(PWD_2026, 10);

console.log('🔄 Patching databases with canonical demo credentials...');

// 1. Patch Community DB
const commDbPath = path.join(rootDir, 'data', 'dustguard-community.db');
if (fs.existsSync(commDbPath)) {
  const commDb = new DatabaseSync(commDbPath);
  const info = commDb.prepare("UPDATE users SET password_hash = ? WHERE email LIKE '%@dustguard.%'").run(hash2026);
  console.log('✅ Community DB updated demo users:', info);
  
  // Verify citizen@dustguard.local
  const citizen = commDb.prepare("SELECT email, password_hash FROM users WHERE email = 'citizen@dustguard.local'").get();
  if (citizen) {
    console.log('   citizen@dustguard.local password check:');
    console.log('   - DustGuard@2026:', bcrypt.compareSync(PWD_2026, citizen.password_hash));
    console.log('   - DustGuard123!:', bcrypt.compareSync(PWD_123, citizen.password_hash));
  }
}

// 2. Patch Operations DB
const opsDbPath = path.join(rootDir, 'dustguard-operations', 'data', 'dustguard-operations.db');
if (fs.existsSync(opsDbPath)) {
  const opsDb = new DatabaseSync(opsDbPath);
  
  // Update existing users password hash
  opsDb.prepare("UPDATE users SET password_hash = ?").run(hash2026);
  
  // Insert canonical demo accounts if not exist
  const opsDemoAccounts = [
    {
      id: 'usr_ops_canbo_hientruong',
      username: 'canbo.hientruong',
      email: 'canbo.hientruong@dustguard.vn',
      fullName: 'Nguyễn Minh Anh',
      role: 'staff',
      department: 'Tổ Thanh tra Thực địa QCVN 18',
      phone: '0901234561'
    },
    {
      id: 'usr_ops_lanhdao_dieuphoi',
      username: 'lanhdao.dieuphoi',
      email: 'lanhdao.dieuphoi@dustguard.vn',
      fullName: 'Trần Quốc Minh',
      role: 'supervisor',
      department: 'Trung tâm Tiếp nhận & Phân công',
      phone: '0918889901'
    },
    {
      id: 'usr_ops_chuyenvien_phapche',
      username: 'chuyenvien.phapche',
      email: 'chuyenvien.phapche@dustguard.vn',
      fullName: 'Lê Thanh Hà',
      role: 'legal_reviewer',
      department: 'Phòng Thẩm định & Pháp chế Môi trường',
      phone: '0932223301'
    },
    {
      id: 'usr_ops_quantri_dustguard',
      username: 'quantri.dustguard',
      email: 'quantri.dustguard@dustguard.vn',
      fullName: 'Quản trị DustGuard',
      role: 'admin',
      department: 'Ban Chỉ huy Đô thị & Môi trường',
      phone: '0999888777'
    }
  ];

  for (const acc of opsDemoAccounts) {
    opsDb.prepare(`
      INSERT OR REPLACE INTO users (id, username, password_hash, full_name, email, role, department, phone, active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now', '-30 days'))
    `).run(acc.id, acc.username, hash2026, acc.fullName, acc.email, acc.role, acc.department, acc.phone);
  }

  console.log('✅ Operations DB seeded with canonical demo accounts (canbo.hientruong, etc.)');
  const canbo = opsDb.prepare("SELECT username, password_hash FROM users WHERE username = 'canbo.hientruong'").get();
  console.log('   canbo.hientruong verify:', canbo?.username, 'matches DustGuard@2026:', bcrypt.compareSync(PWD_2026, canbo?.password_hash));
}

console.log('✨ Credential patch complete.');
