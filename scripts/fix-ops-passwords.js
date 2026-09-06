import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const hash = bcrypt.hashSync('Password123!', 10);
console.log('Generated hash for Password123!:', hash);
console.log('Verify local:', bcrypt.compareSync('Password123!', hash));

const sql = `UPDATE ops_users SET password_hash = '${hash}';`;
const tempFile = path.join(rootDir, 'temp_fix_ops.sql');
fs.writeFileSync(tempFile, sql, 'utf8');

try {
  execSync('npx wrangler d1 execute dustguard-production --remote --file=temp_fix_ops.sql', {
    cwd: rootDir,
    stdio: 'inherit'
  });
  console.log('✅ Đã cập nhật password_hash cho toàn bộ ops_users!');
} finally {
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
  }
}
