import { execSync } from 'node:child_process';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const bundlePath = path.resolve(rootDir, 'dist/server-bundle.js');

if (!fs.existsSync(bundlePath)) {
  fs.mkdirSync(path.dirname(bundlePath), { recursive: true });
  execSync('npx esbuild server/index.ts --bundle --platform=node --format=esm --outfile=dist/server-bundle.js --external:hono --external:bcryptjs', {
    cwd: rootDir,
    stdio: 'ignore'
  });
}

const { createUnifiedApp } = await import(`file://${bundlePath}`);

// Mock D1 Database
function createMockDb() {
  const data = {
    contractors: [
      { id: 'ctr-01', code: 'CTR-METRO', name: 'Công ty CP Xây dựng Metro', contact_person: 'Nguyễn Văn A', phone: '0901234567', tax_id: '0301234567', created_at: new Date().toISOString() }
    ],
    corrective_actions: [
      { id: 'act-01', case_id: 'case-01', code: 'CA-01', description: 'Yêu cầu che chắn bạt', status: 'OPEN', responsible_party: 'Công ty CP Xây dựng Metro', created_at: new Date().toISOString() }
    ],
    cases: [
      { id: 'case-01', case_code: 'DG-2026-001', title: 'Bụi phát tán công trình Metro', location_text: 'Quận 1', latitude: 10.77, longitude: 106.70, status: 'ACTION_REQUIRED' }
    ],
    remediation_submissions: [],
    users: [],
    ops_users: []
  };

  const makeStmt = (sql, boundArgs = []) => ({
    bind(...args) {
      return makeStmt(sql, args);
    },
    async first() {
      if (sql.includes('SELECT 1 as alive')) return { alive: 1 };
      if (sql.includes('SELECT * FROM contractors WHERE id = ?')) {
        return data.contractors.find(c => c.id === boundArgs[0]) || null;
      }
      if (sql.includes('SELECT * FROM corrective_actions WHERE id = ?')) {
        return data.corrective_actions.find(a => a.id === boundArgs[0]) || null;
      }
      if (sql.includes('SELECT id, case_code, title')) {
        return data.cases.find(c => c.id === boundArgs[0]) || null;
      }
      if (sql.includes('SELECT * FROM remediation_submissions WHERE id = ?')) {
        return data.remediation_submissions.find(s => s.id === boundArgs[0]) || null;
      }
      if (sql.includes('SELECT count(*) as c FROM ops_users') || sql.includes('SELECT count(*) as c FROM users')) {
        return { c: 0 };
      }
      return null;
    },
    async all() {
      if (sql.includes('SELECT * FROM contractors')) {
        return { results: data.contractors };
      }
      if (sql.includes('SELECT * FROM corrective_actions')) {
        return { results: data.corrective_actions };
      }
      return { results: [] };
    },
    async run() {
      if (sql.includes('INSERT INTO remediation_submissions')) {
        const sub = { id: boundArgs[0], action_id: boundArgs[1], case_id: boundArgs[2], description: boundArgs[3], review_status: 'PENDING', submitted_at: boundArgs[4] };
        data.remediation_submissions.push(sub);
      }
      if (sql.includes('UPDATE corrective_actions')) {
        const act = data.corrective_actions.find(a => a.id === boundArgs[1]);
        if (act) act.status = 'REMEDIATION_SUBMITTED';
      }
      return { meta: { changes: 1, last_row_id: 1 } };
    }
  });

  return {
    prepare(sql) {
      return makeStmt(sql);
    }
  };
}

test('ROUTER AUDIT & PRODUCTION ROUTE RESOLUTION SUITE', async (t) => {
  const app = createUnifiedApp();
  const mockEnv = {
    DB: createMockDb(),
    STORAGE: {
      async get() { return null; }
    },
    INTEGRATION_SERVICE_KEY: 'dustguard-internal-2026'
  };

  await t.test('1. System & Health Endpoints (/health, /api/health, /api/system/version)', async () => {
    // GET /health
    const resHealth = await app.request('/health', { method: 'GET' }, mockEnv);
    assert.equal(resHealth.status, 200, '/health must return 200 OK');
    const jsonHealth = await resHealth.json();
    assert.equal(jsonHealth.status, 'healthy');

    // GET /api/health
    const resApiHealth = await app.request('/api/health', { method: 'GET' }, mockEnv);
    assert.equal(resApiHealth.status, 200, '/api/health must return 200 OK');

    // GET /api/system/version
    const resVersion = await app.request('/api/system/version', { method: 'GET' }, mockEnv);
    assert.equal(resVersion.status, 200, '/api/system/version must return 200 OK');
  });

  await t.test('2. Edge Worker Contractor Portal API (/api/contractor/*)', async () => {
    // GET /api/contractor/dashboard
    const resDash = await app.request('/api/contractor/dashboard', { method: 'GET' }, mockEnv);
    assert.equal(resDash.status, 200);
    const jsonDash = await resDash.json();
    assert.equal(jsonDash.success, true);
    assert.ok(jsonDash.data.contractor);
    assert.equal(jsonDash.data.contractor.name, 'Công ty CP Xây dựng Metro');
    assert.equal(jsonDash.data.total_actions, 1);

    // GET /api/contractor/actions/act-01
    const resAct = await app.request('/api/contractor/actions/act-01', { method: 'GET' }, mockEnv);
    assert.equal(resAct.status, 200);
    const jsonAct = await resAct.json();
    assert.equal(jsonAct.success, true);
    assert.equal(jsonAct.data.action.id, 'act-01');
    assert.equal(jsonAct.data.case.id, 'case-01');

    // POST /api/contractor/actions/act-01/remediation
    const resRem = await app.request('/api/contractor/actions/act-01/remediation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: 'Đã hoàn tất căng bạt và rửa xe',
        contractor_name: 'Công ty CP Xây dựng Metro',
        latitude: 10.7701,
        longitude: 106.7001,
        site_latitude: 10.7700,
        site_longitude: 106.7000
      })
    }, mockEnv);
    assert.equal(resRem.status, 200);
    const jsonRem = await resRem.json();
    assert.equal(jsonRem.success, true);
    assert.equal(jsonRem.data.geofence.passed, true);
  });

  await t.test('3. Operations API mounts on /api/operations AND /operations/api', async () => {
    const res1 = await app.request('/api/operations/auth/setup-status', { method: 'GET' }, mockEnv);
    assert.equal(res1.status, 200);

    const res2 = await app.request('/operations/api/auth/setup-status', { method: 'GET' }, mockEnv);
    assert.equal(res2.status, 200);
  });

  await t.test('4. Frontend Codebase Zero Duplicate Routes & Zero Hardcoded Localhost Links', async () => {
    // Check apps/web/src/App.tsx
    const appTsx = fs.readFileSync(path.join(rootDir, 'apps/web/src/App.tsx'), 'utf-8');

    // Check no duplicate /cases route
    const casesMatches = appTsx.match(/path="\/cases"/g) || [];
    assert.equal(casesMatches.length, 1, 'Only 1 /cases route definition allowed');

    // Check /forbidden route exists
    assert.ok(appTsx.includes('path="/forbidden"'), '/forbidden route must be registered in App.tsx');

    // Check /operations and /operations/* exist
    assert.ok(appTsx.includes('path="/operations"'), '/operations route must exist');
    assert.ok(appTsx.includes('path="/operations/*"'), '/operations/* route must exist');

    // Check dustguard-operations App.tsx
    const opsAppTsx = fs.readFileSync(path.join(rootDir, 'dustguard-operations/apps/web/src/App.tsx'), 'utf-8');
    assert.ok(opsAppTsx.includes('path="iot/:id"'), 'iot/:id alias route must be registered in Operations App.tsx');

    // Check SetupPage dynamic redirect
    const setupTsx = fs.readFileSync(path.join(rootDir, 'dustguard-operations/apps/web/src/pages/SetupPage.tsx'), 'utf-8');
    assert.ok(!setupTsx.includes("window.location.href = '/dashboard'"), 'SetupPage must not have hardcoded root /dashboard redirect');

    // Check no hardcoded localhost:3002 in apps/web/src except config/constants.ts
    const appShellTsx = fs.readFileSync(path.join(rootDir, 'apps/web/src/components/layout/AppShell.tsx'), 'utf-8');
    assert.ok(!appShellTsx.includes('http://localhost:3002'), 'AppShell must not contain hardcoded http://localhost:3002');

    const loginTsx = fs.readFileSync(path.join(rootDir, 'apps/web/src/pages/LoginPage.tsx'), 'utf-8');
    assert.ok(!loginTsx.includes("'http://localhost:3002"), 'LoginPage must not contain hardcoded http://localhost:3002');
  });
});
