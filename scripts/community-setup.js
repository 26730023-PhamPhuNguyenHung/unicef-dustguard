import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Đang thiết lập môi trường DustGuard Community...');

// 1. Tạo thư mục data và uploads
const dataDir = path.join(rootDir, 'data');
const uploadsDir = path.join(rootDir, 'uploads');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('📁 Đã tạo thư mục data/');
}

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Đã tạo thư mục uploads/');
}

// 2. Chạy migrate CSDL
console.log('🔄 Đang chạy SQLite database migrations...');
execSync('npm --prefix apps/server run db:migrate', { stdio: 'inherit', cwd: rootDir });

// 3. Nạp Seed Data
console.log('🌱 Đang nạp Seed Data mẫu cho DustGuard Community...');
execSync('npm --prefix apps/server run db:seed', { stdio: 'inherit', cwd: rootDir });

console.log(`
========================================================================
✨ HOÀN TẤT THIẾT LẬP DUSTGUARD COMMUNITY!
========================================================================
Để khởi chạy toàn bộ ứng dụng trên máy:
  npm run dev:community  (hoặc npm run dev)

Tài khoản thử nghiệm sẵn sàng:
  • Citizen:    citizen@dustguard.local    (DustGuard123!)
  • Member:     member@dustguard.local     (DustGuard123!)
  • Moderator:  moderator@dustguard.local  (DustGuard123!)
  • Admin:      admin@dustguard.local      (DustGuard123!)
========================================================================
`);
