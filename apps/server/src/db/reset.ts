import fs from 'fs';
import path from 'path';
import { dbPath, sqliteClient } from './sqlite-client.js';
import { runMigrations } from './migrate.js';
import { runSeed } from './seed.js';

export function resetDatabase(): void {
  console.log('⚠️ Bắt đầu reset cơ sở dữ liệu SQLite...');
  
  // Đóng kết nối
  try {
    sqliteClient.close();
  } catch (err) {
    // Bỏ qua nếu đã đóng
  }

  // Xóa file db và file wal, shm nếu có
  const filesToDelete = [dbPath, `${dbPath}-wal`, `${dbPath}-shm`];
  for (const f of filesToDelete) {
    if (fs.existsSync(f)) {
      try {
        fs.unlinkSync(f);
        console.log(`🗑️ Đã xóa: ${path.basename(f)}`);
      } catch (e: any) {
        console.warn(`Không thể xóa ${f}:`, e.message);
      }
    }
  }

  // Tạo thư mục uploads
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Đã tạo thư mục uploads');
  }

  // Tái khởi tạo và seed
  runMigrations();
  runSeed();
  console.log('🎉 Reset cơ sở dữ liệu thành công!');
}

if (process.argv[1]?.endsWith('reset.ts') || process.argv[1]?.endsWith('reset.js')) {
  resetDatabase();
}
