import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const inventory = JSON.parse(fs.readFileSync(path.join(rootDir, 'audit-output/route-inventory.json'), 'utf-8'));
const frontendRoutes = inventory.frontend_routes;

// Extract navigation links from Side A: apps/web/src/config/navigation.ts
const sideANavCode = fs.readFileSync(path.join(rootDir, 'apps/web/src/config/navigation.ts'), 'utf-8');
const sideANavMatches = [...sideANavCode.matchAll(/path:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

// Extract navigation links from Side B: dustguard-operations/apps/web/src/components/layout/AppLayout.tsx
const sideBLayoutCode = fs.readFileSync(path.join(rootDir, 'dustguard-operations/apps/web/src/components/layout/AppLayout.tsx'), 'utf-8');
const sideBNavMatches = [...sideBLayoutCode.matchAll(/path:\s*['"]([^'"]+)['"]/g)].map(m => {
  const p = m[1].split('?')[0]; // strip query string
  return p.startsWith('/') ? `/operations${p}` : `/operations/${p}`;
});

const allNavLinks = [...new Set([...sideANavMatches, ...sideBNavMatches])];

console.log('📌 Total Navigation Targets Found:', allNavLinks.length);

const activeRoutePaths = new Set(frontendRoutes.map(r => r.path));

// Find Broken Navigation Links (links to non-existent routes)
const brokenLinks = [];
for (const link of allNavLinks) {
  if (!activeRoutePaths.has(link)) {
    // Check dynamic routes
    const isDynamicMatch = [...activeRoutePaths].some(r => {
      if (!r.includes(':')) return false;
      const regex = new RegExp('^' + r.replace(/:[a-zA-Z0-9_]+/g, '[^/]+') + '$');
      return regex.test(link);
    });
    if (!isDynamicMatch) {
      brokenLinks.push(link);
    }
  }
}

// Find Orphan Routes (routes with 0 navigation link pointing to them)
// Exclude redirects, dynamic param routes, auth routes, and error pages
const orphanRoutes = [];
for (const r of frontendRoutes) {
  if (r.type === 'REDIRECT' || r.type === 'AUTH ROUTE') continue;
  if (r.path.includes(':')) continue;
  if (['/', '/landing', '/forbidden', '/setup', '/operations/setup'].includes(r.path)) continue;

  const hasNav = allNavLinks.includes(r.path);
  if (!hasNav) {
    orphanRoutes.push(r.path);
  }
}

console.log('\n❌ Broken Navigation Links (Target route missing):', brokenLinks);
console.log('\n⚠️ Orphan Routes (No direct sidebar/nav link, but may be navigated via in-page CTA/subroute):', orphanRoutes);

// Build Route Matrix
const matrix = [];

for (const r of frontendRoutes) {
  let action = 'KEEP';
  let duplicateOf = null;
  let canonicalRoute = r.path;

  if (r.type === 'REDIRECT') {
    action = 'REDIRECT';
    canonicalRoute = r.redirectTo;
  } else if (r.path === '/operations/login') {
    action = 'MERGE';
    duplicateOf = '/login';
    canonicalRoute = '/login?side=operations';
  } else if (r.path === '/landing') {
    action = 'REDIRECT';
    duplicateOf = '/';
    canonicalRoute = '/';
  } else if (r.path === '/youth/credits') {
    action = 'REDIRECT';
    duplicateOf = '/credits';
    canonicalRoute = '/credits';
  } else if (r.path.startsWith('/citizen/') || r.path.startsWith('/community/')) {
    if (r.type === 'REDIRECT') {
      action = 'REDIRECT';
    }
  }

  matrix.push({
    path: r.path,
    side: r.side,
    type: r.type,
    component: r.component,
    duplicateOf,
    canonicalRoute,
    action,
    source: r.source
  });
}

// Add legacy routes to matrix
for (const r of inventory.legacy_routes) {
  matrix.push({
    path: r.path,
    side: r.side,
    type: 'LEGACY ROUTE',
    component: r.component,
    duplicateOf: null,
    canonicalRoute: r.side === 'staff' ? '/operations' : '/dashboard',
    action: 'RETIRED (ISOLATED IN APP/)',
    source: r.source
  });
}

fs.writeFileSync(
  path.join(rootDir, 'audit-output/route-matrix.json'),
  JSON.stringify({ timestamp: new Date().toISOString(), total_matrix_entries: matrix.length, matrix }, null, 2),
  'utf-8'
);

console.log('\n✅ Đã ghi thành công audit-output/route-matrix.json với', matrix.length, 'mục.');
