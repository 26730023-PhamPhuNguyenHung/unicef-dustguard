import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function getFilesRecursively(dir, filterExts = ['.ts', '.tsx', '.js', '.jsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === 'dist' || file === '.git' || file === 'data' || file === 'tests') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath, filterExts));
    } else if (filterExts.some(ext => file.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

test('NO SEED RUNTIME DEPENDENCY AUDIT', async (t) => {
  await t.test('Production source code contains ZERO imports or references to seed.ts or seed.js', () => {
    const serverSrc = path.join(rootDir, 'apps', 'server', 'src');
    const webSrc = path.join(rootDir, 'apps', 'web', 'src');
    const sharedSrc = path.join(rootDir, 'packages', 'shared', 'src');

    const filesToCheck = [
      ...getFilesRecursively(serverSrc),
      ...getFilesRecursively(webSrc),
      ...getFilesRecursively(sharedSrc),
    ];

    const violations = [];

    for (const filePath of filesToCheck) {
      // Exclude seed.ts itself
      if (filePath.endsWith('seed.ts') || filePath.endsWith('seed.js')) continue;

      const content = fs.readFileSync(filePath, 'utf-8');
      const importRegex = /from\s+['"][^'"]*seed(\.js|\.ts)?['"]/i;
      const requireRegex = /require\(['"][^'"]*seed(\.js|\.ts)?['"]\)/i;

      if (importRegex.test(content) || requireRegex.test(content)) {
        violations.push(filePath);
      }
    }

    assert.equal(
      violations.length,
      0,
      `Found production files importing seed: \n${violations.join('\n')}`
    );
  });

  await t.test('Production startup scripts do not implicitly execute demo seeding', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
    const serverPkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'apps', 'server', 'package.json'), 'utf-8'));

    // Verify 'start' scripts don't run seed
    if (pkg.scripts && pkg.scripts.start) {
      assert.ok(!pkg.scripts.start.includes('seed.ts'), 'Root start script must not run seed');
    }
    if (serverPkg.scripts && serverPkg.scripts.start) {
      assert.ok(!serverPkg.scripts.start.includes('seed.ts'), 'Server start script must not run seed');
    }

    // Verify setup script runs migrate, not seed
    const setupScript = fs.readFileSync(path.join(rootDir, 'scripts', 'setup.js'), 'utf-8');
    assert.ok(
      setupScript.includes('migrate.ts') || setupScript.includes('migrate.js'),
      'scripts/setup.js must run migrate.ts'
    );
    assert.ok(
      !setupScript.includes('seed.ts'),
      'scripts/setup.js must not invoke seed.ts automatically'
    );
  });
});
