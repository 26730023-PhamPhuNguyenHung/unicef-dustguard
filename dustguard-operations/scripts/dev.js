import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('⚡ STARTING DUSTGUARD OPERATIONS LOCAL DEV ENVIRONMENT');
console.log('   Backend API:  http://localhost:4000');
console.log('   Frontend Web: http://localhost:3002');
console.log('====================================================\n');

// 1. Start Server on port 4000
const serverProcess = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['tsx', 'watch', path.join(PROJECT_ROOT, 'apps/server/src/index.ts')],
  {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: '4000' },
  }
);

// 2. Start Vite Web on port 3002
const webProcess = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['vite', '--port', '3002', '--host'],
  {
    cwd: path.join(PROJECT_ROOT, 'apps/web'),
    stdio: 'inherit',
    shell: true,
    env: { ...process.env },
  }
);

function shutdown() {
  console.log('\nStopping servers...');
  serverProcess.kill('SIGINT');
  webProcess.kill('SIGINT');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
