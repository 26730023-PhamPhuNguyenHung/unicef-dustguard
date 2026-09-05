import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('🚀 DUSTGUARD OPERATIONS SETUP (Database Migrations & System Config)');
console.log('====================================================');

const result = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['tsx', path.join(PROJECT_ROOT, 'apps/server/src/db/migrate.ts')],
  {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env },
  }
);

if (result.status === 0) {
  console.log('\n✅ Setup completed successfully! Database schema and system configurations are ready.');
} else {
  console.error('\n❌ Setup failed with exit code:', result.status);
  process.exit(result.status || 1);
}

