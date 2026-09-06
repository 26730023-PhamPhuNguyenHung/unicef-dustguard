import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 [Build Production] Bắt đầu quy trình build hợp nhất DustGuard...');

// 1. Sinh version.ts
console.log('📦 [1/4] Tạo version metadata từ Git HEAD...');
execSync('node scripts/generate-version.js', { cwd: rootDir, stdio: 'inherit' });

// 2. Build Side A (Community Portal)
console.log('\n📦 [2/4] Đang build Side A (Community Web)...');
const sideADir = path.join(rootDir, 'apps', 'web');
execSync('npm run build', { cwd: sideADir, stdio: 'inherit' });

// 3. Build Side B (Operations Command Center)
console.log('\n📦 [3/4] Đang build Side B (Operations Web) với base: /operations/ ...');
const sideBDir = path.join(rootDir, 'dustguard-operations', 'apps', 'web');
execSync('npm run build', {
  cwd: sideBDir,
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_BASE: '/operations/',
    NODE_ENV: 'production'
  }
});

// 4. Hợp nhất vào root dist/
console.log('\n📦 [4/4] Đang hợp nhất static assets vào root dist/...');
const distRoot = path.join(rootDir, 'dist');
const sideADist = path.join(sideADir, 'dist');
const sideBDist = path.join(sideBDir, 'dist');

if (!fs.existsSync(sideADist)) {
  throw new Error(`Thư mục build Side A không tồn tại: ${sideADist}`);
}
if (!fs.existsSync(sideBDist)) {
  throw new Error(`Thư mục build Side B không tồn tại: ${sideBDist}`);
}

// Dọn dẹp thư mục dist root cũ
if (fs.existsSync(distRoot)) {
  fs.rmSync(distRoot, { recursive: true, force: true });
}
fs.mkdirSync(distRoot, { recursive: true });

// Copy Side A vào dist/
console.log('   -> Sao chép Side A vào dist/ ...');
fs.cpSync(sideADist, distRoot, { recursive: true });

// Copy Side B vào dist/operations/
const opsDist = path.join(distRoot, 'operations');
fs.mkdirSync(opsDist, { recursive: true });
console.log('   -> Sao chép Side B vào dist/operations/ ...');
fs.cpSync(sideBDist, opsDist, { recursive: true });

console.log('\n✅ [Build Production Hoàn Tất]');
console.log(`   - Root dist: ${distRoot}`);
console.log(`   - Side A index.html: ${fs.existsSync(path.join(distRoot, 'index.html')) ? 'OK' : 'MISSING'}`);
console.log(`   - Side B index.html: ${fs.existsSync(path.join(opsDist, 'index.html')) ? 'OK' : 'MISSING'}`);
