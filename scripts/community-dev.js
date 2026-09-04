import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const dbPath = path.join(rootDir, 'data', 'dustguard-community.db');

// Kiểm tra nếu DB chưa có thì gợi ý setup
if (!fs.existsSync(dbPath)) {
  console.log('⚠️ Chưa phát hiện SQLite database. Đang tự động chạy setup lần đầu...');
  const { execSync } = await import('child_process');
  execSync('node scripts/community-setup.js', { stdio: 'inherit', cwd: rootDir });
}

console.log(`
🛡️ =======================================================
   DUSTGUARD COMMUNITY — LOCAL DEVELOPMENT ENVIRONMENT
=======================================================
🚀 Đang khởi động Backend REST API (Port 3001)...
🌐 Đang khởi động Frontend Web Vite (Port 3000)...
=======================================================
`);

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// 1. Khởi chạy Server
const serverProc = spawn(npmCmd, ['--prefix', 'apps/server', 'run', 'dev'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: isWin
});

// 2. Khởi chạy Web
const webProc = spawn(npmCmd, ['--prefix', 'apps/web', 'run', 'dev', '--', '--host', '127.0.0.1'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: isWin
});

function cleanup() {
  console.log('\n🛑 Đang dừng toàn bộ dịch vụ DustGuard Community...');
  try {
    serverProc.kill();
    webProc.kill();
  } catch (e) {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
