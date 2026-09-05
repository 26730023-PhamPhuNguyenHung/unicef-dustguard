import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const FORBIDDEN_STRINGS = [
  'dev_admin_token',
  'dev_contractor_token',
  'fake_secret_key',
  'seed-only'
];

test('Production Runtime Invariants & Bundle Hygiene Suite', async (t) => {

  await t.test('Environment Configuration Matrix adheres to SSOT', () => {
    const wranglerPath = path.join(rootDir, 'app/wrangler.jsonc');
    assert.ok(fs.existsSync(wranglerPath), 'wrangler.jsonc must exist');

    const content = fs.readFileSync(wranglerPath, 'utf-8');
    assert.ok(content.includes('"binding": "DB"'), 'D1 binding must be defined');
    assert.ok(content.includes('"binding": "EVIDENCE_BUCKET"'), 'R2 EVIDENCE_BUCKET binding must be defined');
    assert.ok(content.includes('dustguard-production'), 'Production D1 database name must match SSOT');
  });

  await t.test('Client source code does not contain hardcoded dev tokens or fake identities', () => {
    const clientDirs = [
      path.join(rootDir, 'apps/web/src'),
      path.join(rootDir, 'dustguard-operations/apps/web/src')
    ];

    const violations = [];

    function scanDir(dir) {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== 'node_modules' && entry.name !== 'dist') {
            scanDir(fullPath);
          }
        } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.jsx') || entry.name.endsWith('.js'))) {
          const fileContent = fs.readFileSync(fullPath, 'utf-8');
          for (const forbidden of FORBIDDEN_STRINGS) {
            if (fileContent.includes(forbidden)) {
              violations.push({
                file: path.relative(rootDir, fullPath),
                forbidden
              });
            }
          }
        }
      }
    }

    clientDirs.forEach(scanDir);
    assert.equal(violations.length, 0, `Violations found: ${JSON.stringify(violations, null, 2)}`);
  });

  await t.test('Frontend API clients use relative paths or environment variables (Zero hardcoded production URLs)', () => {
    const apiClients = [
      path.join(rootDir, 'apps/web/src/services'),
      path.join(rootDir, 'apps/web/src/utils/api.ts'),
      path.join(rootDir, 'dustguard-operations/apps/web/src/services'),
      path.join(rootDir, 'dustguard-operations/apps/web/src/utils/api.ts')
    ];

    for (const target of apiClients) {
      if (!fs.existsSync(target)) continue;
      const stats = fs.statSync(target);
      const files = stats.isDirectory()
        ? fs.readdirSync(target).map(f => path.join(target, f))
        : [target];

      for (const file of files) {
        if (!file.endsWith('.ts') && !file.endsWith('.tsx') && !file.endsWith('.js')) continue;
        const text = fs.readFileSync(file, 'utf-8');
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          // If line sets baseURL or apiUrl directly to a raw URL string without env fallback
          if (/baseURL\s*:\s*['"]http:\/\/(localhost|127\.0\.0\.1)/.test(line)) {
            assert.fail(`Hardcoded baseURL without env fallback found in ${path.relative(rootDir, file)}:${i + 1}`);
          }
        }
      }
    }
  });

  await t.test('If dist bundles exist, verify zero leaked secrets in compiled bundles', () => {
    const distDirs = [
      path.join(rootDir, 'apps/web/dist'),
      path.join(rootDir, 'dustguard-operations/apps/web/dist'),
      path.join(rootDir, 'app/dist')
    ];

    for (const dist of distDirs) {
      if (!fs.existsSync(dist)) continue;
      const files = fs.readdirSync(dist, { recursive: true });
      for (const f of files) {
        const full = path.join(dist, String(f));
        if (fs.existsSync(full) && fs.statSync(full).isFile() && full.endsWith('.js')) {
          const code = fs.readFileSync(full, 'utf-8');
          for (const forbidden of FORBIDDEN_STRINGS) {
            assert.ok(!code.includes(forbidden), `Forbidden token "${forbidden}" leaked into production bundle ${path.relative(rootDir, full)}`);
          }
        }
      }
    }
  });

});
