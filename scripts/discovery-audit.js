import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.');

// 1. Parse D1 Tables
const d1SqlPath = path.join(ROOT, 'app/prisma/d1-schema.sql');
const d1Sql = fs.readFileSync(d1SqlPath, 'utf8');
const tableLines = d1Sql.split('\n').filter(l => /CREATE\s+TABLE/i.test(l));
const tables = tableLines.map(line => {
  const match = line.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["`]?([a-zA-Z0-9_]+)["`]?/i);
  return match ? match[1] : null;
}).filter(Boolean);

console.log('=== D1 TABLES (' + tables.length + ') ===');
console.log(tables);

// 2. Worker Endpoints
const workerDir = path.join(ROOT, 'app/server/routes/worker');
const workerFiles = fs.readdirSync(workerDir).filter(f => f.endsWith('.js'));

const endpoints = [];
for (const file of workerFiles) {
  const content = fs.readFileSync(path.join(workerDir, file), 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const routeMatch = line.match(/(?:app|router|staffRoutes|casesRoutes|authRoutes|adminRoutes|sensorsRoutes|communityRoutes|complaintsRoutes|actionsRoutes|inspectionsRoutes|tasksRoutes|csrRoutes|documentsRoutes|executiveRoutes|healthRoutes|publicRoutes|storageRoutes)\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]/i);
    if (routeMatch) {
      endpoints.push({
        file,
        line: idx + 1,
        method: routeMatch[1].toUpperCase(),
        path: routeMatch[2]
      });
    }
  });
}

console.log('\n=== WORKER ENDPOINTS (' + endpoints.length + ') ===');
console.log(endpoints.slice(0, 30));

// 3. Client API Endpoints
const apiDir = path.join(ROOT, 'app/src/lib/api');
const apiFiles = fs.readdirSync(apiDir).filter(f => f.endsWith('.js'));
const clientCalls = [];
for (const file of apiFiles) {
  const content = fs.readFileSync(path.join(apiDir, file), 'utf8');
  const matches = [...content.matchAll(/(?:apiClient|request|customFetch|fetch)\s*\.\s*(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]/g)];
  for (const m of matches) {
    clientCalls.push({ file, method: m[1].toUpperCase(), path: m[2] });
  }
}
console.log('\n=== CLIENT API CALLS (' + clientCalls.length + ') ===');
console.log(clientCalls.slice(0, 20));
