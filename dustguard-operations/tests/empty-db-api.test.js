process.env.NODE_ENV = 'test';
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const testDbPath = path.join(rootDir, 'data', 'test-empty-api.db');

if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
process.env.DB_PATH = testDbPath;

const { runMigrations } = await import('../apps/server/src/db/migrate.js');
const { app } = await import('../apps/server/src/index.js');

let server;
let baseUrl = '';
let adminToken = '';

async function req(endpoint, options = {}) {
  const url = `${baseUrl}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
    ...(options.headers || {}),
  };
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
  runMigrations();

  await new Promise(resolve => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      resolve();
    });
  });

  // Bootstrap supreme admin
  const bRes = await req('/api/auth/bootstrap', {
    method: 'POST',
    body: JSON.stringify({
      username: 'admin_test',
      password: 'password123',
      full_name: 'Quản trị viên Khởi tạo',
      email: 'admin.test@dustguard.gov.vn',
      department: 'Sở TN&MT',
    }),
  });
  adminToken = bRes.data.token;
});

after(async () => {
  if (server) {
    await new Promise(resolve => server.close(resolve));
  }
  try {
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
  } catch {}
});

test('EMPTY DATABASE API ENDPOINTS STABILITY AUDIT', async (t) => {
  await t.test('GET /api/dashboard returns legitimate zero metrics without crashing', async () => {
    const res = await req('/api/dashboard');
    assert.equal(res.status, 200);
    assert.equal(res.data.metrics.new_cases, 0);
    assert.equal(res.data.metrics.pending_legal, 0);
    assert.equal(res.data.metrics.pending_inspection, 0);
    assert.equal(res.data.metrics.overdue_actions, 0);
    assert.equal(res.data.metrics.pending_reinspection, 0);
    assert.equal(res.data.metrics.ready_to_close, 0);
    assert.equal(res.data.myQueue.length, 0);
    assert.equal(res.data.recentActivities.length, 0);
  });

  await t.test('GET /api/cases returns 0 cases', async () => {
    const res = await req('/api/cases');
    assert.equal(res.status, 200);
    assert.equal(res.data.cases.length, 0);
    assert.equal(res.data.total, 0);
  });

  await t.test('GET /api/projects returns 0 projects', async () => {
    const res = await req('/api/projects');
    assert.equal(res.status, 200);
    assert.equal(res.data.projects.length, 0);
    assert.equal(res.data.total, 0);
  });

  await t.test('GET /api/contractors returns 0 contractors', async () => {
    const res = await req('/api/contractors');
    assert.equal(res.status, 200);
    assert.equal(res.data.contractors.length, 0);
    assert.equal(res.data.total, 0);
  });

  await t.test('GET /api/iot/devices returns 0 devices', async () => {
    const res = await req('/api/iot/devices');
    assert.equal(res.status, 200);
    assert.equal(res.data.devices.length, 0);
  });

  await t.test('GET /api/signals returns 0 signals', async () => {
    const res = await req('/api/signals');
    assert.equal(res.status, 200);
    const list = res.data.data || res.data.signals || [];
    assert.equal(list.length, 0);
  });

  await t.test('GET /api/tasks returns 0 tasks', async () => {
    const res = await req('/api/tasks');
    assert.equal(res.status, 200);
    assert.equal(res.data.tasks.length, 0);
  });

  await t.test('GET /api/inspections returns 0 inspections', async () => {
    const res = await req('/api/inspections');
    assert.equal(res.status, 200);
    assert.equal(res.data.inspections.length, 0);
  });

  await t.test('GET /api/actions returns 0 actions', async () => {
    const res = await req('/api/actions');
    assert.equal(res.status, 200);
    assert.equal(res.data.actions.length, 0);
  });

  await t.test('GET /api/evidence returns 0 evidence assets', async () => {
    const res = await req('/api/evidence');
    assert.equal(res.status, 200);
    assert.equal(res.data.evidence.length, 0);
  });

  await t.test('GET /api/legal/documents returns statutory legal corpus', async () => {
    const res = await req('/api/legal/documents');
    assert.equal(res.status, 200);
    assert.equal(res.data.documents.length, 4);
    const docNumbers = res.data.documents.map(d => d.document_number);
    assert.ok(docNumbers.some(n => n.includes('72/2020/QH14')));
    assert.ok(docNumbers.some(n => n.includes('45/2022/NĐ-CP')));
  });

  await t.test('GET /api/inspections/templates returns statutory inspection templates', async () => {
    const res = await req('/api/inspections/templates');
    assert.equal(res.status, 200);
    const templates = res.data.templates || res.data.data || [];
    assert.equal(templates.length, 2);
  });

  await t.test('GET /api/admin/users returns only the bootstrapped admin', async () => {
    const res = await req('/api/admin/users');
    assert.equal(res.status, 200);
    assert.equal(res.data.users.length, 1);
    assert.equal(res.data.users[0].username, 'admin_test');
  });
});
