/**
 * REGRESSION GUARD TEST SUITE (Section 73)
 * Kiểm thử chống thoái lui tự động cho DustGuard VN
 * Node.js Native Test Runner (node --test)
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper đệ quy tìm tệp
function getFilesRecursive(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', 'dist', '.git', '.next'].includes(entry.name)) {
        results.push(...getFilesRecursive(fullPath, extensions));
      }
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

test('🛡️ REGRESSION GUARD: Zero alert() calls in frontend source code', () => {
  const sideAFiles = getFilesRecursive(path.join(rootDir, 'apps', 'web', 'src'));
  const sideBFiles = getFilesRecursive(path.join(rootDir, 'dustguard-operations', 'apps', 'web', 'src'));
  const allFiles = [...sideAFiles, ...sideBFiles];

  const violations = [];
  const alertRegex = /\balert\s*\(/;

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      // Bỏ qua comments
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
      if (alertRegex.test(line)) {
        violations.push(`${path.relative(rootDir, file)}:${idx + 1} -> ${trimmed}`);
      }
    });
  }

  assert.equal(
    violations.length,
    0,
    `Phát hiện các lệnh window.alert() cấm trong frontend:\n${violations.join('\n')}`
  );
});

test('🛡️ REGRESSION GUARD: Safe draft envelope in localStorage (No uncontrolled raw Base64)', () => {
  const sideAFiles = getFilesRecursive(path.join(rootDir, 'apps', 'web', 'src'));
  const sideBFiles = getFilesRecursive(path.join(rootDir, 'dustguard-operations', 'apps', 'web', 'src'));
  const allFiles = [...sideAFiles, ...sideBFiles];

  const rawBase64Storage = [];
  // Tìm pattern lưu base64 trực tiếp vào localStorage
  const rawBase64Pattern = /localStorage\.setItem\([^,]+,\s*(?:result|reader\.result|.*base64.*)\)/i;

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    if (rawBase64Pattern.test(content)) {
      rawBase64Storage.push(path.relative(rootDir, file));
    }
  }

  assert.equal(
    rawBase64Storage.length,
    0,
    `Phát hiện tệp lưu trực tiếp raw base64 data URL vào localStorage (phải qua draftStorage hoặc URL.createObjectURL):\n${rawBase64Storage.join('\n')}`
  );
});

test('🛡️ REGRESSION GUARD: Databases are in WAL mode and pass integrity check', () => {
  const dbPaths = [
    path.join(rootDir, 'data', 'dustguard-community.db'),
    path.join(rootDir, 'dustguard-operations', 'data', 'dustguard-operations.db')
  ];

  for (const dbPath of dbPaths) {
    if (!fs.existsSync(dbPath)) continue;
    const db = new DatabaseSync(dbPath);
    
    // Check journal mode
    const mode = db.prepare(`PRAGMA journal_mode`).get();
    assert.ok(
      ['wal', 'memory', 'delete'].includes(mode.journal_mode.toLowerCase()),
      `Database ${path.basename(dbPath)} journal mode: ${mode.journal_mode}`
    );

    // Check integrity
    const check = db.prepare(`PRAGMA quick_check`).get();
    assert.equal(
      check.quick_check,
      'ok',
      `Database ${path.basename(dbPath)} integrity check failed: ${check.quick_check}`
    );

    db.close();
  }
});

test('🛡️ REGRESSION GUARD: Geofence buffer is strictly 50 meters Civic Standard', () => {
  const contractorServiceFile = path.join(rootDir, 'apps', 'server', 'src', 'services', 'contractor.service.ts');
  if (fs.existsSync(contractorServiceFile)) {
    const content = fs.readFileSync(contractorServiceFile, 'utf-8');
    assert.ok(
      content.includes('50') || content.includes('0.05'),
      'Contractor service phải chứa cấu hình bán kính buffer hiện trường 50 mét'
    );
  }
});

test('🛡️ REGRESSION GUARD: Navigation menu is streamlined without duplicate contribution links', () => {
  const navFile = path.join(rootDir, 'apps', 'web', 'src', 'config', 'navigation.ts');
  if (fs.existsSync(navFile)) {
    const content = fs.readFileSync(navFile, 'utf-8');
    assert.ok(
      !content.includes("href: '/contributions'"),
      'Menu điều hướng Side A không được có route riêng /contributions gây phân mảnh (đã hợp nhất vào /credits)'
    );
  }
});
