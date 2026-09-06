import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Bắt đầu quét chuyên sâu toàn bộ codebase DustGuard VN...');

// 1. Quét Database
function auditDatabase() {
  const result = {
    sideA: { path: 'data/dustguard-community.db', tables: [], totalTables: 0, totalIndexes: 0, totalColumns: 0 },
    sideB: { path: 'dustguard-operations/data/dustguard-operations.db', tables: [], totalTables: 0, totalIndexes: 0, totalColumns: 0 }
  };

  try {
    const dbAPath = path.join(rootDir, result.sideA.path);
    if (fs.existsSync(dbAPath)) {
      const dbA = new DatabaseSync(dbAPath, { readOnly: true });
      const tables = dbA.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
      result.sideA.totalTables = tables.length;
      for (const t of tables) {
        const cols = dbA.prepare(`PRAGMA table_info("${t.name}")`).all();
        const idxs = dbA.prepare(`PRAGMA index_list("${t.name}")`).all();
        const fks = dbA.prepare(`PRAGMA foreign_key_list("${t.name}")`).all();
        result.sideA.totalColumns += cols.length;
        result.sideA.totalIndexes += idxs.length;
        result.sideA.tables.push({
          name: t.name,
          columnCount: cols.length,
          columns: cols.map(c => c.name),
          indexCount: idxs.length,
          indexes: idxs.map(i => i.name),
          foreignKeys: fks.map(f => ({ from: f.from, toTable: f.table, toCol: f.to }))
        });
      }
      dbA.close();
    }
  } catch (e) {
    console.error('Lỗi đọc DB Side A:', e.message);
  }

  try {
    const dbBPath = path.join(rootDir, result.sideB.path);
    if (fs.existsSync(dbBPath)) {
      const dbB = new DatabaseSync(dbBPath, { readOnly: true });
      const tables = dbB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
      result.sideB.totalTables = tables.length;
      for (const t of tables) {
        const cols = dbB.prepare(`PRAGMA table_info("${t.name}")`).all();
        const idxs = dbB.prepare(`PRAGMA index_list("${t.name}")`).all();
        const fks = dbB.prepare(`PRAGMA foreign_key_list("${t.name}")`).all();
        result.sideB.totalColumns += cols.length;
        result.sideB.totalIndexes += idxs.length;
        result.sideB.tables.push({
          name: t.name,
          columnCount: cols.length,
          columns: cols.map(c => c.name),
          indexCount: idxs.length,
          indexes: idxs.map(i => i.name),
          foreignKeys: fks.map(f => ({ from: f.from, toTable: f.table, toCol: f.to }))
        });
      }
      dbB.close();
    }
  } catch (e) {
    console.error('Lỗi đọc DB Side B:', e.message);
  }

  return result;
}

// 2. Quét Backend Endpoints
function auditEndpoints() {
  const endpoints = [];

  function scanDir(dir, side, prefix = '') {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        scanDir(full, side, `${prefix}/${f}`);
      } else if (f.endsWith('.routes.ts') || f.endsWith('.routes.js') || f.endsWith('.js') || f.endsWith('.ts')) {
        const content = fs.readFileSync(full, 'utf-8');
        const lines = content.split('\n');
        
        // Tìm router.get/post/put/patch/delete
        const routeRegex = /router\.(get|post|put|patch|delete)\(\s*(['"`])([^'"`]+)\2/g;
        let match;
        while ((match = routeRegex.exec(content)) !== null) {
          const method = match[1].toUpperCase();
          const routePath = match[3];
          const fileRel = path.relative(rootDir, full).replace(/\\/g, '/');
          
          // Kiểm tra xem có auth middleware không
          const lineIndex = content.substring(0, match.index).split('\n').length - 1;
          const snippet = lines.slice(lineIndex, lineIndex + 4).join(' ');
          const hasAuth = /requireAuth|authenticate|requireRole|verifyToken|authMiddleware/i.test(snippet);
          const hasValidation = /validateRequest|zod|schema/i.test(snippet);

          endpoints.push({
            side,
            file: fileRel,
            method,
            subPath: routePath,
            hasAuth,
            hasValidation
          });
        }
      }
    }
  }

  scanDir(path.join(rootDir, 'apps/server/src/routes'), 'Side A (Community)');
  scanDir(path.join(rootDir, 'dustguard-operations/apps/server/src/modules'), 'Side B (Operations)');

  return endpoints;
}

// 3. Quét Frontend Pages & Screens
function auditScreens() {
  const screens = [];

  // Side A App.tsx
  const sideAAppFile = path.join(rootDir, 'apps/web/src/App.tsx');
  if (fs.existsSync(sideAAppFile)) {
    const content = fs.readFileSync(sideAAppFile, 'utf-8');
    const routeRegex = /<Route\s+path=(['"`])([^'"`]+)\1\s+element=\{<([A-Za-z0-9]+)/g;
    let match;
    while ((match = routeRegex.exec(content)) !== null) {
      const routePath = match[2];
      const componentName = match[3];
      screens.push({
        side: 'Side A (Community)',
        route: routePath,
        component: componentName,
        source: 'apps/web/src/App.tsx'
      });
    }
  }

  // Side B App.tsx
  const sideBAppFile = path.join(rootDir, 'dustguard-operations/apps/web/src/App.tsx');
  if (fs.existsSync(sideBAppFile)) {
    const content = fs.readFileSync(sideBAppFile, 'utf-8');
    const routeRegex = /<Route\s+path=(['"`])([^'"`]+)\1\s+element=\{<([A-Za-z0-9]+)/g;
    let match;
    while ((match = routeRegex.exec(content)) !== null) {
      const routePath = match[2];
      const componentName = match[3];
      screens.push({
        side: 'Side B (Operations)',
        route: routePath,
        component: componentName,
        source: 'dustguard-operations/apps/web/src/App.tsx'
      });
    }
  }

  return screens;
}

// 4. Quét Legacy Codebase
function auditLegacy() {
  const legacyItems = [];
  
  // Quét app/src/app/router.jsx
  const legacyRouter = path.join(rootDir, 'app/src/app/router.jsx');
  if (fs.existsSync(legacyRouter)) {
    const content = fs.readFileSync(legacyRouter, 'utf-8');
    const routeRegex = /<Route\s+path=(['"`])([^'"`]+)\1\s+element=\{<([A-Za-z0-9]+)/g;
    let match;
    while ((match = routeRegex.exec(content)) !== null) {
      legacyItems.push({
        type: 'LEGACY ROUTE',
        path: match[2],
        component: match[3],
        location: 'app/src/app/router.jsx',
        status: 'Replaced by Side A / Side B TSX Clean Architecture',
        action: 'DEPRECATE / ISOLATE'
      });
    }
  }

  // Quét app/src/apps/
  const appAppsDir = path.join(rootDir, 'app/src/apps');
  if (fs.existsSync(appAppsDir)) {
    const subApps = fs.readdirSync(appAppsDir);
    for (const sa of subApps) {
      legacyItems.push({
        type: 'LEGACY SUB-APP',
        path: `app/src/apps/${sa}`,
        name: sa,
        action: 'REPLACED BY 2-SIDE TSX ARCHITECTURE'
      });
    }
  }

  // Quét app/server/
  const appServerDir = path.join(rootDir, 'app/server');
  if (fs.existsSync(appServerDir)) {
    legacyItems.push({
      type: 'LEGACY BACKEND',
      path: 'app/server',
      desc: 'Old Express/Cloudflare Worker JS backend with Prisma dev.db',
      action: 'REPLACED BY apps/server & dustguard-operations/apps/server'
    });
  }

  return legacyItems;
}

// 5. Thống kê số lượng File và LOC
function countLines(dir, extensions = ['.js', '.ts', '.tsx', '.jsx', '.css', '.html', '.sql']) {
  let totalFiles = 0;
  let totalLOC = 0;

  function walk(d) {
    if (!fs.existsSync(d)) return;
    const items = fs.readdirSync(d);
    for (const it of items) {
      if (it === 'node_modules' || it === '.git' || it === 'dist' || it === 'backups' || it === 'coverage') continue;
      const full = path.join(d, it);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (extensions.some(ext => it.endsWith(ext))) {
        totalFiles++;
        const lines = fs.readFileSync(full, 'utf-8').split('\n').length;
        totalLOC += lines;
      }
    }
  }

  walk(dir);
  return { files: totalFiles, loc: totalLOC };
}

// Chạy và xuất kết quả
const dbAudit = auditDatabase();
const endpointAudit = auditEndpoints();
const screenAudit = auditScreens();
const legacyAudit = auditLegacy();

const locSideAWeb = countLines(path.join(rootDir, 'apps/web/src'));
const locSideAServer = countLines(path.join(rootDir, 'apps/server/src'));
const locSideBWeb = countLines(path.join(rootDir, 'dustguard-operations/apps/web/src'));
const locSideBServer = countLines(path.join(rootDir, 'dustguard-operations/apps/server/src'));
const locLegacyApp = countLines(path.join(rootDir, 'app'));

const stats = {
  db: dbAudit,
  endpoints: {
    total: endpointAudit.length,
    byMethod: {
      GET: endpointAudit.filter(e => e.method === 'GET').length,
      POST: endpointAudit.filter(e => e.method === 'POST').length,
      PUT: endpointAudit.filter(e => e.method === 'PUT').length,
      PATCH: endpointAudit.filter(e => e.method === 'PATCH').length,
      DELETE: endpointAudit.filter(e => e.method === 'DELETE').length
    },
    bySide: {
      sideA: endpointAudit.filter(e => e.side.startsWith('Side A')).length,
      sideB: endpointAudit.filter(e => e.side.startsWith('Side B')).length
    },
    list: endpointAudit
  },
  screens: {
    total: screenAudit.length,
    sideA: screenAudit.filter(s => s.side.startsWith('Side A')).length,
    sideB: screenAudit.filter(s => s.side.startsWith('Side B')).length,
    list: screenAudit
  },
  legacy: {
    totalItems: legacyAudit.length,
    list: legacyAudit
  },
  codebase: {
    sideA: {
      web: locSideAWeb,
      server: locSideAServer,
      totalFiles: locSideAWeb.files + locSideAServer.files,
      totalLOC: locSideAWeb.loc + locSideAServer.loc
    },
    sideB: {
      web: locSideBWeb,
      server: locSideBServer,
      totalFiles: locSideBWeb.files + locSideBServer.files,
      totalLOC: locSideBWeb.loc + locSideBServer.loc
    },
    legacyApp: locLegacyApp
  }
};

console.log('\n📊 KẾT QUẢ QUÉT BAN ĐẦU (REAL RUNTIME & CODEBASE INVENTORY):');
console.log(`- Side A Database Tables: ${stats.db.sideA.totalTables}, Indexes: ${stats.db.sideA.totalIndexes}, Columns: ${stats.db.sideA.totalColumns}`);
console.log(`- Side B Database Tables: ${stats.db.sideB.totalTables}, Indexes: ${stats.db.sideB.totalIndexes}, Columns: ${stats.db.sideB.totalColumns}`);
console.log(`- Total Endpoints: ${stats.endpoints.total} (Side A: ${stats.endpoints.bySide.sideA}, Side B: ${stats.endpoints.bySide.sideB})`);
console.log(`  GET: ${stats.endpoints.byMethod.GET}, POST: ${stats.endpoints.byMethod.POST}, PUT: ${stats.endpoints.byMethod.PUT}, PATCH: ${stats.endpoints.byMethod.PATCH}, DELETE: ${stats.endpoints.byMethod.DELETE}`);
console.log(`- Total Screens: ${stats.screens.total} (Side A: ${stats.screens.sideA}, Side B: ${stats.screens.sideB})`);
console.log(`- Side A Codebase: ${stats.codebase.sideA.totalFiles} files, ${stats.codebase.sideA.totalLOC} LOC`);
console.log(`- Side B Codebase: ${stats.codebase.sideB.totalFiles} files, ${stats.codebase.sideB.totalLOC} LOC`);
console.log(`- Legacy Monolith (app/): ${stats.codebase.legacyApp.files} files, ${stats.codebase.legacyApp.loc} LOC`);

// Ghi ra file JSON
const outDir = path.join(rootDir, 'audit-output');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'baseline-summary.json'), JSON.stringify(stats, null, 2));
console.log(`\n💾 Đã lưu kết quả tại: ${path.join(outDir, 'baseline-summary.json')}`);
