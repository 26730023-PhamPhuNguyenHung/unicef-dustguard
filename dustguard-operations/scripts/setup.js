import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('🚀 DUSTGUARD OPERATIONS SETUP (Database & Seed)');
console.log('====================================================');

const result = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['tsx', path.join(PROJECT_ROOT, 'apps/server/src/db/seed.ts')],
  {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env },
  }
);

if (result.status === 0) {
  console.log('\n✅ Setup completed successfully! Database and sample evidence are ready.');
} else {
  console.error('\n❌ Setup failed with exit code:', result.status);
  process.exit(result.status || 1);
}

