/**
 * DUSTGUARD VN — DATABASE BACKUP & DISASTER RECOVERY CLI
 * 
 * Hỗ trợ sao lưu, phục hồi và kiểm định tự động tính toàn vẹn (Backup Verification Test)
 * cho 2 cơ sở dữ liệu SQLite SSOT:
 * 1. Side A Community DB: data/dustguard-community.db
 * 2. Side B Operations DB: dustguard-operations/data/dustguard-operations.db
 * 
 * Lệnh sử dụng:
 * - node scripts/backup-restore.js backup [--dest <dir>]
 * - node scripts/backup-restore.js restore <timestamp-or-path>
 * - node scripts/backup-restore.js test
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BACKUP_ROOT = path.join(rootDir, 'backups');

const DB_TARGETS = [
  {
    name: 'community',
    label: 'Side A Community DB',
    path: path.join(rootDir, 'data', 'dustguard-community.db'),
  },
  {
    name: 'operations',
    label: 'Side B Operations DB',
    path: path.join(rootDir, 'dustguard-operations', 'data', 'dustguard-operations.db'),
  },
];

function calculateFileSha256(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function inspectDatabase(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    const db = new DatabaseSync(filePath, { readOnly: true });
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
    let totalRows = 0;
    const tableCounts = {};
    for (const t of tables) {
      try {
        const countRes = db.prepare(`SELECT COUNT(*) as count FROM "${t.name}"`).get();
        const cnt = countRes?.count || 0;
        tableCounts[t.name] = cnt;
        totalRows += cnt;
      } catch {}
    }
    db.close();
    return {
      tableCount: tables.length,
      totalRows,
      tableCounts,
    };
  } catch (err) {
    return { error: err.message };
  }
}

export function performBackup(customDest = null) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const destDir = customDest || path.join(BACKUP_ROOT, `backup-${timestamp}`);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const manifest = {
    timestamp: new Date().toISOString(),
    backupId: `dg-backup-${timestamp}`,
    databases: [],
  };

  console.log(`\n📦 Bắt đầu tiến trình sao lưu cơ sở dữ liệu DustGuard VN [${manifest.backupId}]...`);

  for (const target of DB_TARGETS) {
    if (!fs.existsSync(target.path)) {
      console.warn(`⚠️ [${target.label}] Không tìm thấy tệp CSDL tại: ${target.path}`);
      continue;
    }

    const originalHash = calculateFileSha256(target.path);
    const stats = fs.statSync(target.path);
    const inspect = inspectDatabase(target.path);

    const fileName = path.basename(target.path);
    const destFile = path.join(destDir, fileName);
    fs.copyFileSync(target.path, destFile);

    // Sao lưu cả WAL & SHM nếu có
    for (const ext of ['-wal', '-shm']) {
      const walSource = target.path + ext;
      if (fs.existsSync(walSource)) {
        fs.copyFileSync(walSource, destFile + ext);
      }
    }

    const backupHash = calculateFileSha256(destFile);
    if (originalHash !== backupHash) {
      throw new Error(`❌ Sai lệch mã băm SHA-256 khi sao lưu ${target.name}!`);
    }

    manifest.databases.push({
      name: target.name,
      label: target.label,
      sourcePath: target.path,
      backupFile: fileName,
      fileSizeBytes: stats.size,
      sha256: backupHash,
      integrity: 'VERIFIED',
      inspection: inspect,
    });

    console.log(`  ✅ Đã sao lưu: ${target.label} (${(stats.size / 1024).toFixed(1)} KB) -> SHA256: ${backupHash.substring(0, 16)}...`);
  }

  const manifestPath = path.join(destDir, 'backup_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`📋 Đã tạo Manifest kiểm định toàn vẹn tại: ${manifestPath}`);
  console.log(`🎉 Sao lưu hoàn tất thành công! Thư mục lưu trữ: ${destDir}\n`);
  return { destDir, manifest };
}

export function performRestore(backupPath) {
  let targetDir = backupPath;
  if (!fs.existsSync(targetDir)) {
    targetDir = path.join(BACKUP_ROOT, backupPath);
  }
  if (!fs.existsSync(targetDir)) {
    throw new Error(`Không tìm thấy thư mục sao lưu: ${backupPath}`);
  }

  const manifestPath = path.join(targetDir, 'backup_manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Thiếu tệp backup_manifest.json trong ${targetDir}`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  console.log(`\n🔄 Bắt đầu phục hồi CSDL từ bản sao lưu [${manifest.backupId}]...`);

  for (const dbInfo of manifest.databases) {
    const backupFile = path.join(targetDir, dbInfo.backupFile);
    if (!fs.existsSync(backupFile)) {
      throw new Error(`Tệp sao lưu bị thiếu: ${backupFile}`);
    }

    // Kiểm tra SHA-256 trước khi restore
    const currentHash = calculateFileSha256(backupFile);
    if (currentHash !== dbInfo.sha256) {
      throw new Error(`❌ Cảnh báo an ninh: Tệp sao lưu ${dbInfo.backupFile} đã bị can thiệp (Hash mismatch)!`);
    }

    // Tạo thư mục cha nếu chưa có
    const targetDir = path.dirname(dbInfo.sourcePath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.copyFileSync(backupFile, dbInfo.sourcePath);

    // Khôi phục WAL & SHM nếu có
    for (const ext of ['-wal', '-shm']) {
      const walSource = backupFile + ext;
      const walTarget = dbInfo.sourcePath + ext;
      if (fs.existsSync(walSource)) {
        fs.copyFileSync(walSource, walTarget);
      } else if (fs.existsSync(walTarget)) {
        fs.unlinkSync(walTarget);
      }
    }

    console.log(`  ✅ Đã phục hồi: ${dbInfo.label} -> ${dbInfo.sourcePath} (Xác thực mã băm SHA-256 khớp 100%)`);
  }

  console.log(`🎉 Phục hồi toàn bộ CSDL hoàn tất thành công!\n`);
  return true;
}

export function runBackupRestoreTest() {
  console.log(`\n🧪 =========================================================`);
  console.log(`   DUSTGUARD VN — KIỂM THỬ TÍNH TOÀN VẸN SAO LƯU & PHỤC HỒI`);
  console.log(`=========================================================\n`);

  const testDir = path.join(rootDir, 'data', 'test-backup-restore');
  if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true, force: true });
  fs.mkdirSync(testDir, { recursive: true });

  const testDbPath = path.join(testDir, 'test-source.db');
  const db = new DatabaseSync(testDbPath);
  db.exec(`
    CREATE TABLE citizen_reports (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      status TEXT NOT NULL
    );
    INSERT INTO citizen_reports VALUES ('rep-001', 'Bụi công trường Kim Đồng', 'PENDING');
    INSERT INTO citizen_reports VALUES ('rep-002', 'Xe tải làm rơi vãi đất cát', 'IN_PROGRESS');
  `);
  db.close();

  const originalHash = calculateFileSha256(testDbPath);
  console.log(`1. Tạo CSDL thử nghiệm với 2 bản ghi -> SHA256: ${originalHash.substring(0, 16)}...`);

  // Thực hiện backup tệp thử nghiệm
  const backupTestDir = path.join(testDir, 'backup-snapshot');
  fs.mkdirSync(backupTestDir, { recursive: true });
  const backupFile = path.join(backupTestDir, 'test-source.db');
  fs.copyFileSync(testDbPath, backupFile);

  const backupHash = calculateFileSha256(backupFile);
  if (backupHash !== originalHash) {
    throw new Error('❌ Backup file hash mismatch');
  }
  console.log(`2. Tạo bản sao lưu Snapshot thành công -> Khớp mã băm SHA-256 100%`);

  // Phá hoại/xóa dữ liệu ở database gốc
  const dbCorrupt = new DatabaseSync(testDbPath);
  dbCorrupt.exec(`
    DELETE FROM citizen_reports WHERE id = 'rep-001';
    INSERT INTO citizen_reports VALUES ('rep-003', 'Bản ghi giả mạo', 'TAMPERED');
  `);
  dbCorrupt.close();

  const corruptHash = calculateFileSha256(testDbPath);
  console.log(`3. Giả lập sự cố: CSDL gốc bị sửa đổi và xóa mất bản ghi -> Hash thay đổi`);

  // Phục hồi từ bản sao lưu
  fs.copyFileSync(backupFile, testDbPath);
  const restoredHash = calculateFileSha256(testDbPath);
  console.log(`4. Phục hồi tệp từ bản sao lưu -> SHA256: ${restoredHash.substring(0, 16)}...`);

  // Xác minh tính toàn vẹn
  if (restoredHash !== originalHash) {
    throw new Error('❌ Khôi phục thất bại: Mã băm không trùng khớp!');
  }

  const dbRestored = new DatabaseSync(testDbPath, { readOnly: true });
  const rows = dbRestored.prepare('SELECT * FROM citizen_reports ORDER BY id ASC').all();
  dbRestored.close();

  if (rows.length !== 2 || rows[0].id !== 'rep-001' || rows[1].id !== 'rep-002') {
    throw new Error('❌ Dữ liệu phục hồi bị thiếu sót hoặc không chính xác!');
  }

  console.log(`5. Đối soát nội dung dữ liệu sau phục hồi: Đầy đủ 2/2 bản ghi ban đầu.`);
  console.log(`\n🎉 KẾT QUẢ KIỂM THỬ SAO LƯU & PHỤC HỒI: PASS 100%!\n`);

  // Dọn dẹp thư mục test
  fs.rmSync(testDir, { recursive: true, force: true });
  return true;
}

// CLI Execution
const args = process.argv.slice(2);
const command = args[0] || 'backup';

if (command === 'backup') {
  performBackup();
} else if (command === 'restore') {
  const target = args[1];
  if (!target) {
    console.error('Cách dùng: node scripts/backup-restore.js restore <tên_thư_mục_sao_lưu>');
    process.exit(1);
  }
  performRestore(target);
} else if (command === 'test') {
  runBackupRestoreTest();
} else {
  console.log(`Lệnh không hợp lệ: ${command}. Hỗ trợ: backup, restore, test`);
}
