import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const opsHash = bcrypt.hashSync('password123', 10);
const communityHash = bcrypt.hashSync('DustGuard123!', 10);

console.log('Generated opsHash:', opsHash);
console.log('Generated communityHash:', communityHash);

const sql = `
UPDATE ops_users SET password_hash = '${opsHash}';
UPDATE users SET password_hash = '${communityHash}';
`;

const tempFile = path.join(rootDir, 'temp_update_passwords.sql');
fs.writeFileSync(tempFile, sql, 'utf8');

try {
  execSync('npx wrangler d1 execute dustguard-production --remote --file=temp_update_passwords.sql', {
    cwd: rootDir,
    stdio: 'inherit'
  });
  console.log('✅ Cập nhật mật khẩu chuẩn xác thành công trên Remote D1!');
} finally {
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
  }
}
