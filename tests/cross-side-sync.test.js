import { test } from 'node:test';
import assert from 'node:assert/strict';
import app from '../apps/server/dist/index.js';
import { sqliteClient } from '../apps/server/dist/db/sqlite-client.js';

test('CROSS-SIDE BI-DIRECTIONAL SYNC (SIDE B -> SIDE A)', async (t) => {
  let server;
  let baseUrl = '';

  await t.test('Setup test server', async () => {
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  // Tạo sẵn 1 case trong SQLite của Community
  const testCaseId = `case-sync-test-${Date.now()}`;
  const testCaseCode = `DG-SYNC-${Date.now()}`;
  const testUserId = `usr-reporter-${Date.now()}`;

  await t.test('1. Setup initial community case in D1/SQLite', () => {
    const now = new Date().toISOString();
    // Tạo user
    sqliteClient.run(
      `INSERT OR REPLACE INTO users (id, email, password_hash, full_name, role, status, created_at, updated_at)
       VALUES (?, ?, 'hash123', 'Nguyễn Văn Dân', 'citizen', 'active', ?, ?)`,
      [testUserId, `dan_${Date.now()}@example.com`, now, now]
    );

    // Tạo case
    sqliteClient.run(
      `INSERT OR REPLACE INTO cases (id, case_code, title, summary, category, latitude, longitude, address, district, status, created_by, first_reported_at, last_activity_at, created_at, updated_at)
       VALUES (?, ?, 'Ô nhiễm bụi xây dựng đường Vành đai', 'Xe tải làm rơi vãi đất cát', 'dust', 10.7769, 106.7009, '123 Vành Đai', 'Quận 7', 'forwarded', ?, ?, ?, ?, ?)`,
      [testCaseId, testCaseCode, testUserId, now, now, now, now]
    );

    const check = sqliteClient.get('SELECT * FROM cases WHERE id = ?', [testCaseId]);
    assert.ok(check);
    assert.equal(check.status, 'forwarded');
  });

  await t.test('2. Side B emits sync event: ACTION_REQUIRED (Ban hành yêu cầu khắc phục)', async () => {
    const res = await fetch(`${baseUrl}/api/integrations/operations/sync`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-service-key': 'dustguard-internal-2026'
      },
      body: JSON.stringify({
        external_case_id: testCaseId,
        operations_case_id: 'op-case-001',
        operations_case_code: 'DG-2026-OP-001',
        status: 'ACTION_REQUIRED',
        status_label: 'Ban hành yêu cầu khắc phục cho nhà thầu',
        contractor_name: 'Công ty CP Đầu tư & Xây dựng Sông Hồng 36',
        findings_summary: 'Yêu cầu căng lưới che chắn 100% và rửa lốp xe tải trước khi ra khỏi công trường.',
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.new_status, 'in_progress');

    // Kiểm tra trực tiếp trong DB Community
    const updatedCase = sqliteClient.get('SELECT * FROM cases WHERE id = ?', [testCaseId]);
    assert.equal(updatedCase.status, 'in_progress', 'Trạng thái Community phải chuyển sang in_progress');

    // Kiểm tra Timeline mốc sự kiện
    const updates = sqliteClient.all('SELECT * FROM case_updates WHERE case_id = ? ORDER BY created_at DESC', [testCaseId]);
    assert.ok(updates.length > 0, 'Timeline phải ghi nhận cập nhật');
    assert.ok(updates[0].title.includes('khắc phục'));
    assert.ok(updates[0].content.includes('lưới che chắn'));

    // Kiểm tra thông báo
    const notifs = sqliteClient.all('SELECT * FROM notifications WHERE user_id = ?', [testUserId]);
    assert.ok(notifs.length > 0, 'Người dân phải nhận được thông báo');
  });

  await t.test('3. Side B emits sync event: CLOSED (Nghiệm thu đạt và Đóng hồ sơ)', async () => {
    const res = await fetch(`${baseUrl}/api/integrations/operations/sync`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-service-key': 'dustguard-internal-2026'
      },
      body: JSON.stringify({
        external_case_id: testCaseId,
        operations_case_id: 'op-case-001',
        operations_case_code: 'DG-2026-OP-001',
        status: 'CLOSED',
        status_label: 'Đã xử lý & nghiệm thu đạt',
        closure_note: 'Đã kiểm tra hiện trường: Nhà thầu hoàn tất rửa xe và che chắn, nồng độ bụi trở về mức an toàn.',
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.new_status, 'resolved');

    // Kiểm tra trực tiếp trong DB Community
    const resolvedCase = sqliteClient.get('SELECT * FROM cases WHERE id = ?', [testCaseId]);
    assert.equal(resolvedCase.status, 'resolved', 'Trạng thái Community phải chuyển sang resolved');
    assert.ok(resolvedCase.resolved_at, 'resolved_at phải được ghi nhận thời điểm');
  });

  await t.test('Teardown test server', async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });
});
