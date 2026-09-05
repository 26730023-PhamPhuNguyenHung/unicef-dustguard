import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { sqliteClient } from '../apps/server/dist/db/sqlite-client.js';
import casesRouter from '../apps/server/dist/routes/cases.routes.js';
import tasksRouter from '../apps/server/dist/routes/tasks.routes.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dustguard-community-secret-key-2026';

test('GAP-09 & GAP-10: Citizen Resolution Feedback Loop & Enhanced Community Task Submissions', async (t) => {
  let server;
  let baseUrl;
  let testUserId = `usr-test-fb-${Date.now()}`;
  let testUserToken;
  let testCaseId = `case-fb-${Date.now()}`;
  let testTaskId = `task-sub-${Date.now()}`;

  await t.test('Setup test server and test entities', async () => {
    const app = express();
    app.use(express.json());
    app.use('/api/cases', casesRouter);
    app.use('/api/tasks', tasksRouter);

    server = app.listen(0);
    const addr = server.address();
    baseUrl = `http://127.0.0.1:${addr.port}`;

    const now = new Date().toISOString();
    // Tạo user
    sqliteClient.run(
      `INSERT OR REPLACE INTO users (id, email, password_hash, full_name, role, status, created_at, updated_at)
       VALUES (?, ?, 'hash123', 'Thanh Niên Tình Nguyện', 'community_member', 'active', ?, ?)`,
      [testUserId, `vol_${Date.now()}@example.com`, now, now]
    );

    testUserToken = jwt.sign(
      { id: testUserId, email: `vol_${Date.now()}@example.com`, role: 'community_member', fullName: 'Thanh Niên Tình Nguyện' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Tạo case
    sqliteClient.run(
      `INSERT OR REPLACE INTO cases (id, case_code, title, summary, category, latitude, longitude, address, district, status, created_by, first_reported_at, last_activity_at, created_at, updated_at)
       VALUES (?, ?, 'Công trình bụi Kim Đồng', 'Bụi phát tán', 'dust', 10.7769, 106.7009, 'Kim Đồng', 'Hoàng Mai', 'resolved', ?, ?, ?, ?, ?)`,
      [testCaseId, `DG-CASE-FB-${Date.now()}`, testUserId, now, now, now, now]
    );

    // Tạo task
    sqliteClient.run(
      `INSERT OR REPLACE INTO verification_tasks (id, case_id, title, description, task_type, latitude, longitude, address, assigned_to, status, created_by, created_at, updated_at)
       VALUES (?, ?, 'Kiểm tra bạt che chắn', 'Đến hiện trường chụp ảnh bạt', 'field_check', 10.7769, 106.7009, 'Kim Đồng', ?, 'claimed', ?, ?, ?)`,
      [testTaskId, testCaseId, testUserId, testUserId, now, now]
    );
  });

  await t.test('GAP-09: Citizen submits Feedback on resolved case', async () => {
    const res = await fetch(`${baseUrl}/api/cases/${testCaseId}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`,
      },
      body: JSON.stringify({
        rating: 5,
        comment: 'Đơn vị thi công đã dọn sạch đất cát và lắp thêm bạt che kín.',
        isSatisfied: true,
        requestReinspection: false,
      }),
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.id);

    // Kiểm tra trực tiếp trong D1/SQLite
    const fb = sqliteClient.get('SELECT * FROM case_feedback WHERE case_id = ?', [testCaseId]);
    assert.ok(fb);
    assert.equal(fb.rating, 5);
    assert.equal(fb.is_satisfied, 1);
    assert.equal(fb.request_reinspection, 0);

    // GET /api/cases/:id/feedback
    const listRes = await fetch(`${baseUrl}/api/cases/${testCaseId}/feedback`);
    const listBody = await listRes.json();
    assert.equal(listBody.success, true);
    assert.ok(listBody.data.length > 0);
  });

  await t.test('GAP-10: Community Member submits task with photo SHA-256 and geofence within 50m', async () => {
    const mockPhotoHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    const res = await fetch(`${baseUrl}/api/tasks/${testTaskId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`,
      },
      body: JSON.stringify({
        result: 'confirmed',
        note: 'Đã đến hiện trường xác minh, nhà thầu đã lắp bạt che chắn.',
        evidenceHash: mockPhotoHash,
        evidenceUrl: 'data:image/jpeg;base64,...',
        latitude: 10.77695,
        longitude: 106.70095,
        isWithin50m: true,
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);

    // Kiểm tra tính bền vững trong SQLite D1 SSOT
    const sub = sqliteClient.get('SELECT * FROM task_submissions WHERE task_id = ?', [testTaskId]);
    assert.ok(sub);
    assert.equal(sub.result, 'confirmed');
    assert.equal(sub.evidence_hash, mockPhotoHash);
    assert.equal(sub.is_within_50m, 1);

    // Task status đã đổi sang 'completed'
    const completedTask = sqliteClient.get('SELECT * FROM verification_tasks WHERE id = ?', [testTaskId]);
    assert.equal(completedTask.status, 'completed');
  });

  await t.test('Teardown test server', async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });
});
