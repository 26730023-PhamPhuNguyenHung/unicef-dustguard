process.env.NODE_ENV = 'test';
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const testDbPath = path.join(rootDir, 'data', 'test-empty-bootstrap.db');

// Ensure clean isolated test db file
if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
process.env.DB_PATH = testDbPath;

// Dynamic import AFTER setting DB_PATH so connection connects to isolated DB
const { db, run, get, query } = await import('../apps/server/src/db/connection.js');
const { runMigrations } = await import('../apps/server/src/db/migrate.js');
const { app } = await import('../apps/server/src/index.js');

let server;
let baseUrl = '';

async function req(endpoint, options = {}) {
  const url = `${baseUrl}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, { ...options, headers });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { status: res.status, ok: res.ok, data };
}

before(async () => {
  // 1. Run migrations ONLY (ZERO SEED)
  runMigrations();

  // 2. Start HTTP server on dynamic port
  await new Promise(resolve => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) {
    await new Promise(resolve => server.close(resolve));
  }
  try {
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
  } catch {}
});

test('EMPTY DATABASE STARTUP & BOOTSTRAP VERIFICATION', async (t) => {
  await t.test('All operational tables are legitimately empty (0 records)', () => {
    const operationalTables = [
      'users',
      'cases',
      'case_timeline',
      'staff_assignments',
      'evidence_assets',
      'inspections',
      'inspection_items',
      'inspection_findings',
      'corrective_actions',
      'remediation_submissions',
      'case_closures',
      'projects',
      'contractors',
      'iot_devices',
      'iot_readings',
      'signals',
    ];

    for (const tbl of operationalTables) {
      const count = get(`SELECT count(*) as c FROM ${tbl}`)?.c;
      assert.equal(
        count,
        0,
        `Table "${tbl}" must have 0 records in empty DB test, but got ${count}`
      );
    }
  });

  await t.test('System configuration tables contain only statutory definitions', () => {
    // Legal corpus
    const legalDocCount = get(`SELECT count(*) as c FROM legal_documents`)?.c;
    assert.equal(legalDocCount, 4, 'Must have 4 statutory legal documents configured');

    // Inspection templates
    const templateCount = get(`SELECT count(*) as c FROM inspection_templates`)?.c;
    assert.equal(templateCount, 2, 'Must have 2 standard inspection templates configured');
  });

  await t.test('GET /api/auth/setup-status reports uninitialized empty system', async () => {
    const res = await req('/api/auth/setup-status');
    assert.equal(res.status, 200);
    assert.equal(res.data.is_initialized, false);
    assert.equal(res.data.user_count, 0);
    assert.equal(res.data.role_count, 6);
    assert.equal(res.data.legal_corpus_count, 4);
    assert.equal(res.data.template_count, 2);
  });

  let adminToken = '';

  await t.test('POST /api/auth/bootstrap successfully creates first super admin', async () => {
    const res = await req('/api/auth/bootstrap', {
      method: 'POST',
      body: JSON.stringify({
        username: 'admin_supreme',
        password: 'securePassword2026',
        full_name: 'Nguyễn Văn Quản Trị',
        email: 'admin.supreme@dustguard.gov.vn',
        department: 'Ban Quản trị & Điều phối Trung ương',
        phone: '024.3825.8888',
      }),
    });

    assert.equal(res.status, 201);
    assert.equal(res.data.success, true);
    assert.equal(res.data.user.username, 'admin_supreme');
    assert.equal(res.data.user.role, 'admin');
    assert.ok(res.data.token, 'Must return authentication JWT session token');
    adminToken = res.data.token;

    // Verify in DB directly
    const userInDb = get(`SELECT * FROM users WHERE username = 'admin_supreme'`);
    assert.ok(userInDb, 'User must be stored in database');
    assert.equal(userInDb.role, 'admin');
  });

  await t.test('GET /api/auth/setup-status now reports system is initialized', async () => {
    const res = await req('/api/auth/setup-status');
    assert.equal(res.status, 200);
    assert.equal(res.data.is_initialized, true);
    assert.equal(res.data.user_count, 1);
  });

  await t.test('POST /api/auth/bootstrap is permanently locked (403 Forbidden)', async () => {
    const res = await req('/api/auth/bootstrap', {
      method: 'POST',
      body: JSON.stringify({
        username: 'hacker_admin',
        password: 'password999',
        full_name: 'Kẻ Xâm Nhập',
        email: 'hack@bad.com',
      }),
    });

    assert.equal(res.status, 403);
    assert.ok(
      res.data.detail?.includes('khởi tạo ban đầu') || res.data.title?.includes('Khởi tạo bị từ chối'),
      'Must reject second bootstrap attempt'
    );

    // Verify DB still only has 1 user
    const totalUsers = get(`SELECT count(*) as c FROM users`)?.c;
    assert.equal(totalUsers, 1, 'Total users must remain 1');
  });

  await t.test('Admin token can access protected system resources', async () => {
    const res = await req('/api/auth/me', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.user.username, 'admin_supreme');
    assert.ok(
      res.data.permissions.includes('*') || res.data.permissions.includes('system:config'),
      'Admin must have superuser permission'
    );
  });
});
