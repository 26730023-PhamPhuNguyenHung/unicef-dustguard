#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const TARGET_KEYWORDS = [
  'node:sqlite', 'better-sqlite3', 'sqlite3', 'DatabaseSync',
  'fs', 'node:fs', 'writeFile', 'readFile', 'createReadStream', 'createWriteStream',
  'path.resolve', 'process.cwd', '__dirname', 'child_process', 'net',
  'http.createServer', 'app.listen', 'express',
  'localhost', '127.0.0.1', ':3000', ':3001', ':3002',
  'file://', './uploads', 'uploads/', 'temp/', 'tmp/',
  'Math.random', 'dev token', 'seed.ts', 'placeholder', 'mock', 'fixture', 'fake', 'demo'
];

const SCAN_DIRS = [
  'app/src',
  'app/server',
  'apps/server/src',
  'apps/web/src',
  'dustguard-operations/apps/server/src',
  'dustguard-operations/apps/web/src',
  'packages'
];

const IGNORE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.ico', '.map', '.db', '.sqlite', '.docx', '.lock', '.json'];

function scanFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (IGNORE_EXTENSIONS.includes(ext)) return [];

  let content = '';
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch {
    return [];
  }

  const lines = content.split('\n');
  const findings = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const kw of TARGET_KEYWORDS) {
      let matched = false;
      if (kw === 'fs' || kw === 'net' || kw === 'tmp') {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        matched = regex.test(line);
      } else {
        matched = line.toLowerCase().includes(kw.toLowerCase());
      }
      if (matched) {
        findings.push({
          keyword: kw,
          file: path.relative(rootDir, filePath).replace(/\\/g, '/'),
          line: i + 1,
          snippet: line.trim().substring(0, 140)
        });
      }
    }
  }

  return findings;
}

function traverse(dirPath, allFindings = []) {
  if (!fs.existsSync(dirPath)) return allFindings;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git' || entry.name === '.wrangler') {
      continue;
    }
    if (entry.isDirectory()) {
      traverse(full, allFindings);
    } else if (entry.isFile()) {
      const f = scanFile(full);
      if (f.length > 0) allFindings.push(...f);
    }
  }

  return allFindings;
}

console.log('Scanning codebase for Cloudflare Runtime Forensics...');
const allFindings = [];
for (const d of SCAN_DIRS) {
  traverse(path.join(rootDir, d), allFindings);
}

console.log(`Total occurrences found across production source trees: ${allFindings.length}`);

// Classify findings:
// A. CLOUDFLARE SAFE (e.g. Hono, Web Crypto, Web standards, D1 bindings, fallback catch)
// B. DEV/TEST ONLY (e.g. tests/, scripts/, seed scripts, dev-runner, mock test helpers)
// C. PRODUCTION BLOCKER (direct unhandled node:sqlite/fs in edge worker path)
// D. NEEDS MIGRATION (Node express services: apps/server, dustguard-operations server)

const classified = {
  safe: [],
  dev_test: [],
  blocker: [],
  needs_migration: []
};

for (const item of allFindings) {
  const p = item.file;
  const kw = item.keyword.toLowerCase();

  // If in test or dev tool
  if (p.includes('test') || p.includes('scripts') || p.includes('seed') || p.includes('.test.')) {
    classified.dev_test.push(item);
    continue;
  }

  // If in app/server/worker.js or app/server/routes/worker/
  if (p.startsWith('app/server/routes/worker') || p === 'app/server/worker.js' || p === 'app/server/app.js') {
    if (kw === 'better-sqlite3' || kw === 'node:sqlite' || kw === 'databasesync') {
      if (p.includes('shared/db.js')) {
        classified.safe.push({ ...item, note: 'Lazy fallback for Node development, bypassed on Cloudflare Worker when env.DB present' });
      } else {
        classified.blocker.push({ ...item, note: 'Direct SQLite dependency inside Worker router' });
      }
    } else if (kw === 'fs' || kw === 'node:fs' || kw === 'writefile' || kw === 'readfile') {
      classified.blocker.push({ ...item, note: 'Direct fs call inside Worker router' });
    } else if (kw === 'localhost' || kw === '127.0.0.1' || kw === ':3000' || kw === ':3001' || kw === ':3002') {
      if (lineHasDefaultEnv(item.snippet)) {
        classified.safe.push({ ...item, note: 'Default development fallback with env override' });
      } else {
        classified.blocker.push({ ...item, note: 'Hardcoded localhost in Worker path' });
      }
    } else if (kw === 'math.random') {
      if (item.snippet.includes('requestId') || item.snippet.includes('id_') || item.snippet.includes('req_')) {
        classified.safe.push({ ...item, note: 'Request ID tracing prefix (non-cryptographic)' });
      } else {
        classified.blocker.push({ ...item, note: 'Math.random used in domain/crypto logic' });
      }
    } else {
      classified.safe.push(item);
    }
  } else if (p.startsWith('apps/server') || p.startsWith('dustguard-operations/apps/server')) {
    if (kw === 'node:sqlite' || kw === 'databasesync' || kw === 'better-sqlite3' || kw === 'fs' || kw === 'uploads/' || kw === './uploads') {
      classified.needs_migration.push({ ...item, note: 'Node.js Express backend currently using local SQLite/filesystem; needs DatabaseRepository / ObjectStorage abstraction for Edge deployment' });
    } else {
      classified.safe.push(item);
    }
  } else {
    // Frontend apps
    if (kw === 'localhost' || kw === '127.0.0.1' || kw === ':3000' || kw === ':3001' || kw === ':3002') {
      if (lineHasDefaultEnv(item.snippet)) {
        classified.safe.push({ ...item, note: 'Fallback dev URL behind import.meta.env' });
      } else {
        classified.needs_migration.push({ ...item, note: 'Frontend hardcoded port/host' });
      }
    } else {
      classified.safe.push(item);
    }
  }
}

function lineHasDefaultEnv(snippet) {
  return snippet.includes('process.env') || snippet.includes('import.meta.env') || snippet.includes('||') || snippet.includes('??');
}

console.log('Classification summary:');
console.log(`- SAFE: ${classified.safe.length}`);
console.log(`- DEV/TEST ONLY: ${classified.dev_test.length}`);
console.log(`- PRODUCTION BLOCKER: ${classified.blocker.length}`);
console.log(`- NEEDS MIGRATION: ${classified.needs_migration.length}`);

fs.writeFileSync(path.join(rootDir, 'scripts/forensic-results.json'), JSON.stringify(classified, null, 2));
console.log('Wrote scripts/forensic-results.json');
