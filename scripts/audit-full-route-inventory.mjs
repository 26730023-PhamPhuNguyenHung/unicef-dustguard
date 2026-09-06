import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 [AUDIT] Bắt đầu scan 100% routes toàn bộ repository...');

// Helper to resolve relative path
const rel = (p) => path.relative(rootDir, p).replace(/\\/g, '/');

// 1. SCAN FRONTEND ROUTES: apps/web/src/App.tsx
function parseSideARoutes() {
  const file = path.join(rootDir, 'apps/web/src/App.tsx');
  const code = fs.readFileSync(file, 'utf-8');
  const lines = code.split('\n');
  const routes = [];

  // Match <Route path="..." element={<... />} />
  // or <Route path="..." element={<ProtectedRoute permission="...">...</ProtectedRoute>} />
  // or <Route path="..." element={<Navigate to="..." />} />
  const routeRegex = /<Route\s+(?:index\s+)?path=["']([^"']+)["']\s+element=\{([^}]+)\}/g;
  let match;
  while ((match = routeRegex.exec(code)) !== null) {
    const rawPath = match[1];
    const element = match[2];
    const lineNum = code.slice(0, match.index).split('\n').length;

    let isRedirect = element.includes('<Navigate');
    let redirectTo = null;
    if (isRedirect) {
      const toMatch = element.match(/to=["']([^"']+)["']/);
      redirectTo = toMatch ? toMatch[1] : null;
    }

    let isProtected = element.includes('<ProtectedRoute');
    let permission = null;
    if (isProtected) {
      const permMatch = element.match(/permission=["']([^"']+)["']/);
      permission = permMatch ? permMatch[1] : null;
    }

    // Component name
    let compMatch = element.match(/<([A-Z][A-Za-z0-9]+)/);
    let component = compMatch ? compMatch[1] : 'Unknown';
    if (component === 'Navigate') component = `Navigate(to=${redirectTo})`;
    if (component === 'ProtectedRoute') {
      const innerComp = element.match(/<ProtectedRoute[^>]*>\s*<([A-Z][A-Za-z0-9]+)/);
      component = innerComp ? innerComp[1] : 'ProtectedComponent';
    }

    let side = 'community';
    let type = isRedirect ? 'REDIRECT' : 'FRONTEND ROUTE';
    if (rawPath === '/' || rawPath === '/landing') {
      side = 'public';
    } else if (rawPath.startsWith('/login') || rawPath.startsWith('/register') || rawPath.startsWith('/forgot-password')) {
      type = 'AUTH ROUTE';
      side = 'public';
    } else if (rawPath.startsWith('/contractor')) {
      side = 'contractor';
    } else if (rawPath.startsWith('/moderator')) {
      side = 'moderator';
    } else if (rawPath.startsWith('/admin')) {
      side = 'admin';
    } else if (rawPath.startsWith('/citizen') || rawPath.startsWith('/community') || rawPath.startsWith('/staff') || rawPath.startsWith('/executive')) {
      type = isRedirect ? 'REDIRECT' : 'LEGACY ROUTE';
    }

    routes.push({
      path: rawPath,
      side,
      type,
      source: `apps/web/src/App.tsx:${lineNum}`,
      component,
      auth: isProtected,
      permission,
      roles: permission ? [permission] : [],
      layout: rawPath.startsWith('/login') || rawPath === '/' || rawPath === '/register' || rawPath === '/forgot-password' ? 'none' : 'AppShell',
      redirectTo,
      canonical: isRedirect ? redirectTo : null,
      duplicateOf: null,
      status: 'active'
    });
  }
  return routes;
}

// 2. SCAN FRONTEND ROUTES: dustguard-operations/apps/web/src/App.tsx
function parseSideBRoutes() {
  const file = path.join(rootDir, 'dustguard-operations/apps/web/src/App.tsx');
  const code = fs.readFileSync(file, 'utf-8');
  const routes = [];

  const routeRegex = /<Route\s+(index\s+)?(?:path=["']([^"']+)["']\s+)?element=\{([^}]+)\}/g;
  let match;
  while ((match = routeRegex.exec(code)) !== null) {
    const isIndex = !!match[1];
    const subPath = match[2] || (isIndex ? '' : '');
    const element = match[3];
    const lineNum = code.slice(0, match.index).split('\n').length;

    let isRedirect = element.includes('<Navigate');
    let redirectTo = null;
    if (isRedirect) {
      const toMatch = element.match(/to=["']([^"']+)["']/);
      redirectTo = toMatch ? toMatch[1] : null;
    }

    let compMatch = element.match(/<([A-Z][A-Za-z0-9]+)/);
    let component = compMatch ? compMatch[1] : 'Unknown';
    if (component === 'Navigate') component = `Navigate(to=${redirectTo})`;

    // Full path with operations prefix
    let fullPath;
    if (isIndex) {
      fullPath = '/operations';
    } else if (subPath.startsWith('/')) {
      fullPath = `/operations${subPath}`;
    } else {
      fullPath = `/operations/${subPath}`;
    }
    // Clean trailing slash
    fullPath = fullPath.replace(/\/$/, '') || '/operations';

    let type = isRedirect ? 'REDIRECT' : 'FRONTEND ROUTE';
    let side = 'operations';
    if (fullPath === '/operations/login') {
      type = 'AUTH ROUTE';
    }

    routes.push({
      path: fullPath,
      side,
      type,
      source: `dustguard-operations/apps/web/src/App.tsx:${lineNum}`,
      component,
      auth: fullPath !== '/operations/login' && fullPath !== '/operations/setup',
      roles: ['staff', 'supervisor', 'legal_reviewer', 'admin'],
      layout: fullPath === '/operations/login' || fullPath === '/operations/setup' ? 'none' : 'AppLayout',
      redirectTo: redirectTo ? (redirectTo.startsWith('/') ? `/operations${redirectTo}` : `/operations/${redirectTo}`) : null,
      canonical: null,
      duplicateOf: null,
      status: 'active'
    });
  }
  return routes;
}

// 3. SCAN LEGACY ROUTES: app/src/app/router.jsx and app/src/apps/*/routes.jsx
function parseLegacyRoutes() {
  const legacyFiles = [
    'app/src/apps/citizen/routes.jsx',
    'app/src/apps/staff/routes.jsx',
    'app/src/apps/contractor/routes.jsx',
    'app/src/apps/admin/routes.jsx',
    'app/src/apps/community/routes.jsx',
    'app/src/apps/executive/routes.jsx',
    'app/src/apps/public/routes.jsx',
    'app/src/app/router.jsx'
  ];

  const routes = [];

  for (const relFile of legacyFiles) {
    const fullPath = path.join(rootDir, relFile);
    if (!fs.existsSync(fullPath)) continue;
    const code = fs.readFileSync(fullPath, 'utf-8');

    // Find base route if wrapped in parent Route
    let basePathMatch = code.match(/<Route\s+path=["']([^"']+)["']\s+element=\{<[A-Za-z0-9]+Layout/);
    let basePath = basePathMatch ? basePathMatch[1] : '';

    const routeRegex = /<Route\s+(index\s+)?(?:path=["']([^"']+)["']\s+)?element=\{([^}]+)\}/g;
    let match;
    while ((match = routeRegex.exec(code)) !== null) {
      const isIndex = !!match[1];
      const p = match[2] || '';
      const element = match[3];
      const lineNum = code.slice(0, match.index).split('\n').length;

      let isRedirect = element.includes('<Navigate');
      let redirectTo = null;
      if (isRedirect) {
        const toMatch = element.match(/to=["']([^"']+)["']/);
        redirectTo = toMatch ? toMatch[1] : null;
      }

      let compMatch = element.match(/<([A-Z][A-Za-z0-9]+)/);
      let component = compMatch ? compMatch[1] : 'Unknown';
      if (component === 'Navigate') component = `Navigate(to=${redirectTo})`;

      let fullRoutePath = '';
      if (basePath) {
        if (isIndex) fullRoutePath = basePath;
        else fullRoutePath = `${basePath}/${p}`.replace(/\/+/g, '/');
      } else {
        fullRoutePath = p.startsWith('/') ? p : `/${p}`;
      }

      routes.push({
        path: fullRoutePath,
        side: relFile.includes('citizen') ? 'citizen' : relFile.includes('staff') ? 'staff' : relFile.includes('community') ? 'community' : relFile.includes('admin') ? 'admin' : relFile.includes('contractor') ? 'contractor' : relFile.includes('executive') ? 'executive' : 'public',
        type: 'LEGACY ROUTE',
        source: `${relFile}:${lineNum}`,
        component,
        auth: !relFile.includes('public'),
        roles: [],
        layout: 'LegacyLayout',
        redirectTo,
        canonical: null,
        duplicateOf: null,
        status: 'legacy'
      });
    }
  }

  return routes;
}

// 4. SCAN BACKEND API ROUTES
function parseWorkerApiRoutes() {
  const routes = [];

  // server/index.ts
  const indexFile = path.join(rootDir, 'server/index.ts');
  const indexCode = fs.readFileSync(indexFile, 'utf-8');
  const indexMatches = [...indexCode.matchAll(/app\.(get|post|put|patch|delete)\(['"]([^'"]+)['"]/g)];
  for (const m of indexMatches) {
    routes.push({
      path: m[2],
      method: m[1].toUpperCase(),
      side: 'system',
      type: m[2].startsWith('/api/system') ? 'SYSTEM ROUTE' : 'BACKEND API ROUTE',
      source: 'server/index.ts',
      auth: false,
      status: 'active'
    });
  }

  // server/community.ts
  const comFile = path.join(rootDir, 'server/community.ts');
  const comCode = fs.readFileSync(comFile, 'utf-8');
  const comMatches = [...comCode.matchAll(/app\.(get|post|put|patch|delete)\(['"]([^'"]+)['"]/g)];
  for (const m of comMatches) {
    const fullPath = `/api${m[2]}`;
    const lineNum = comCode.slice(0, m.index).split('\n').length;
    routes.push({
      path: fullPath,
      method: m[1].toUpperCase(),
      side: 'community',
      type: fullPath.startsWith('/api/auth') ? 'AUTH ROUTE' : 'BACKEND API ROUTE',
      source: `server/community.ts:${lineNum}`,
      auth: !fullPath.startsWith('/api/auth/login') && !fullPath.startsWith('/api/auth/register'),
      status: 'active'
    });
  }

  // server/operations.ts
  const opsFile = path.join(rootDir, 'server/operations.ts');
  const opsCode = fs.readFileSync(opsFile, 'utf-8');
  const opsMatches = [...opsCode.matchAll(/app\.(get|post|put|patch|delete)\(['"]([^'"]+)['"]/g)];
  for (const m of opsMatches) {
    const p = m[2];
    const lineNum = opsCode.slice(0, m.index).split('\n').length;
    routes.push({
      path: `/api/operations${p}`,
      aliasPath: `/operations/api${p}`,
      method: m[1].toUpperCase(),
      side: 'operations',
      type: p.startsWith('/auth') ? 'AUTH ROUTE' : 'BACKEND API ROUTE',
      source: `server/operations.ts:${lineNum}`,
      auth: !p.startsWith('/auth/login') && !p.startsWith('/auth/setup-status') && !p.startsWith('/auth/bootstrap'),
      status: 'active'
    });
  }

  return routes;
}

// 5. SCAN LOCAL EXPRESS ROUTES (apps/server and dustguard-operations/apps/server)
function parseExpressApiRoutes() {
  const routes = [];
  const walk = (dir) => {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      const p = path.join(dir, file);
      const stat = fs.statSync(p);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(p));
      } else if (file.endsWith('.ts') || file.endsWith('.js')) {
        results.push(p);
      }
    });
    return results;
  };

  // apps/server/src/routes
  const sideAFiles = walk(path.join(rootDir, 'apps/server/src/routes'));
  for (const f of sideAFiles) {
    const code = fs.readFileSync(f, 'utf-8');
    const matches = [...code.matchAll(/router\.(get|post|put|patch|delete)\(['"]([^'"]+)['"]/g)];
    const relFile = rel(f);
    for (const m of matches) {
      routes.push({
        path: `/api/${path.basename(f, '.routes.ts')}${m[2]}`,
        method: m[1].toUpperCase(),
        side: 'community',
        type: 'BACKEND API ROUTE (LOCAL EXPRESS)',
        source: relFile,
        auth: true,
        status: 'local_dev'
      });
    }
  }

  // dustguard-operations/apps/server/src/modules
  const sideBFiles = walk(path.join(rootDir, 'dustguard-operations/apps/server/src/modules'));
  for (const f of sideBFiles) {
    if (!f.endsWith('.router.ts')) continue;
    const code = fs.readFileSync(f, 'utf-8');
    const matches = [...code.matchAll(/router\.(get|post|put|patch|delete)\(['"]([^'"]+)['"]/g)];
    const relFile = rel(f);
    for (const m of matches) {
      routes.push({
        path: `/operations/api/${path.basename(f, '.router.ts')}${m[2]}`,
        method: m[1].toUpperCase(),
        side: 'operations',
        type: 'BACKEND API ROUTE (LOCAL EXPRESS)',
        source: relFile,
        auth: true,
        status: 'local_dev'
      });
    }
  }

  return routes;
}

// RUN ALL PARSERS
const sideARoutes = parseSideARoutes();
const sideBRoutes = parseSideBRoutes();
const legacyRoutes = parseLegacyRoutes();
const workerApiRoutes = parseWorkerApiRoutes();
const expressApiRoutes = parseExpressApiRoutes();

const allFrontendRoutes = [...sideARoutes, ...sideBRoutes];
const allLegacyRoutes = legacyRoutes;
const allApiRoutes = [...workerApiRoutes, ...expressApiRoutes];

console.log(`\n📊 KẾT QUẢ ĐẾM TỪ CODE THỰC TẾ:`);
console.log(`- Frontend Routes Side A (apps/web): ${sideARoutes.length}`);
console.log(`- Frontend Routes Side B (dustguard-operations): ${sideBRoutes.length}`);
console.log(`- Legacy Frontend Routes (app/): ${legacyRoutes.length}`);
console.log(`- Production Worker API Routes (server/): ${workerApiRoutes.length}`);
console.log(`- Local Dev Express API Routes: ${expressApiRoutes.length}`);
console.log(`- Tổng cộng Frontend Routes thực tế: ${allFrontendRoutes.length}`);
console.log(`- Tổng cộng Backend API Routes thực tế: ${allApiRoutes.length}`);

// Output machine-readable JSON
const inventoryData = {
  timestamp: new Date().toISOString(),
  summary: {
    total_active_frontend_routes: allFrontendRoutes.length,
    side_a_community_routes: sideARoutes.length,
    side_b_operations_routes: sideBRoutes.length,
    legacy_app_routes: legacyRoutes.length,
    production_worker_api_routes: workerApiRoutes.length,
    local_express_api_routes: expressApiRoutes.length,
    total_api_routes: allApiRoutes.length
  },
  frontend_routes: allFrontendRoutes,
  legacy_routes: allLegacyRoutes,
  api_routes: allApiRoutes
};

fs.mkdirSync(path.join(rootDir, 'audit-output'), { recursive: true });
fs.writeFileSync(
  path.join(rootDir, 'audit-output/route-inventory.json'),
  JSON.stringify(inventoryData, null, 2),
  'utf-8'
);

console.log(`\n✅ Đã ghi thành công audit-output/route-inventory.json`);
