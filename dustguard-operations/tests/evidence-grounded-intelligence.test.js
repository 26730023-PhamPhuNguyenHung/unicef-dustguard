process.env.NODE_ENV = 'test';
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { app } from '../apps/server/src/index.js';
import { run, get, query } from '../apps/server/src/db/connection.js';
import { seedDatabase } from '../apps/server/src/db/seed.js';
import { CaseFactService } from '../apps/server/src/modules/cases/caseFact.service.js';
import { CaseAnalysisService } from '../apps/server/src/modules/cases/analysis.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

let server;
let baseUrl = '';

async function req(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, {
    ...options,
    headers,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { status: res.status, ok: res.ok, data };
}

let staffToken = '';
let supToken = '';
let legalToken = '';

before(async () => {
  seedDatabase();

  await new Promise(resolve => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });

  // Login tokens
  const rStaff = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'staff1', password: 'password123' }),
  });
  staffToken = rStaff.data.token;

  const rSup = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'supervisor1', password: 'password123' }),
  });
  supToken = rSup.data.token;

  const rLegal = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'legal1', password: 'password123' }),
  });
  legalToken = rLegal.data.token;
});

after(() => {
  if (server) server.close();
});

// -----------------------------------------------------------------------------
// 1. AI cannot return finding without source (Reject finding if source_ids === 0)
// -----------------------------------------------------------------------------
test('1. Provenance Invariant: AI cannot return finding without source', async () => {
  const res = await req('/api/cases/case-009/analysis', {
    method: 'POST',
    headers: { Authorization: `Bearer ${legalToken}` },
  });

  assert.equal(res.status, 200);
  assert.ok(res.data.output.findings.length > 0, 'Must have at least 1 finding');

  for (const finding of res.data.output.findings) {
    assert.ok(Array.isArray(finding.source_ids), 'source_ids must be an array');
    assert.ok(finding.source_ids.length > 0, `Finding "${finding.id}" must cite at least 1 real source_id`);
  }
});

// -----------------------------------------------------------------------------
// 2. AI cannot cite missing legal section (Reject if section not in DB)
// -----------------------------------------------------------------------------
test('2. Legal Provenance: AI cannot cite nonexistent legal sections', async () => {
  const res = await req('/api/cases/case-009/analysis', {
    method: 'POST',
    headers: { Authorization: `Bearer ${legalToken}` },
  });

  assert.equal(res.status, 200);
  for (const finding of res.data.output.findings) {
    for (const secId of finding.legal_section_ids) {
      const section = get(`SELECT id FROM legal_sections WHERE id = ?`, [secId]);
      assert.ok(section, `Citation ${secId} must physically exist in SQLite legal_sections table`);
    }
  }
});

// -----------------------------------------------------------------------------
// 3. Community report cannot become VERIFIED automatically (Defaults to CLAIM, UNVERIFIED)
// -----------------------------------------------------------------------------
test('3. Community Safety: Citizen report defaults strictly to UNVERIFIED CLAIM', async () => {
  // Create a community-sourced case
  const createRes = await req('/api/cases', {
    method: 'POST',
    headers: { Authorization: `Bearer ${staffToken}` },
    body: JSON.stringify({
      title: 'Bụi phát tán từ công trình xây dựng chung cư Sunrise',
      description: 'Người dân báo bụi dày đặc bay vào nhà lúc 14h chiều mỗi khi xe ben đi qua.',
      location_text: 'Đường Nguyễn Hữu Thọ, Phường Tân Hưng',
      district: 'Quận 7',
      latitude: 10.7412,
      longitude: 106.7011,
      source: 'COMMUNITY',
      source_reference: 'REP-CITIZEN-999',
      priority: 'HIGH',
    }),
  });

  assert.equal(createRes.status, 201);
  const newCaseId = createRes.data.case.id;

  // Retrieve facts
  const factsRes = await req(`/api/cases/${newCaseId}/facts`, {
    headers: { Authorization: `Bearer ${staffToken}` },
  });

  assert.equal(factsRes.status, 200);
  const claimFact = factsRes.data.facts.find(f => f.fact_type === 'COMMUNITY_CLAIM');
  assert.ok(claimFact, 'Case must aggregate a community claim fact');
  assert.equal(claimFact.semantic_type, 'CLAIM', 'Citizen report must have semantic_type = CLAIM');
  assert.equal(claimFact.verification_state, 'UNVERIFIED', 'Community claim cannot be VERIFIED without inspection');
});

// -----------------------------------------------------------------------------
// 4. IoT anomaly cannot produce violation conclusion (Telemetry only)
// -----------------------------------------------------------------------------
test('4. IoT Safety: IoT anomaly is telemetry fact and cannot produce violation conclusion', async () => {
  // Create case linked to IoT
  const createRes = await req('/api/cases', {
    method: 'POST',
    headers: { Authorization: `Bearer ${staffToken}` },
    body: JSON.stringify({
      title: 'Cảnh báo tăng đột biến nồng độ PM2.5 tại trạm đo APM2000-01',
      description: 'Chỉ số PM2.5 vượt ngưỡng 125 ug/m3 liên tục trong 45 phút.',
      location_text: 'Khu Công nghệ Cao, Phường Tân Phú',
      district: 'Thành phố Thủ Đức',
      latitude: 10.8542,
      longitude: 106.7865,
      source: 'IOT',
      source_reference: 'DEV-APM2000-01',
      priority: 'HIGH',
    }),
  });

  assert.equal(createRes.status, 201);
  const iotCaseId = createRes.data.case.id;

  // Insert linked IoT signal
  const sigId = `sig-test-${Date.now()}`;
  run(
    `INSERT INTO signals (id, source_type, external_source_id, signal_type, title, description, location_text, latitude, longitude, observed_at, received_at, integrity_status, created_at)
     VALUES (?, 'IOT', 'DEV-APM2000-01', 'SENSOR_ANOMALY', 'Bụi vượt ngưỡng PM2.5', 'Chỉ số đo vượt chuẩn', 'Khu CNC', 10.85, 106.78, datetime('now'), datetime('now'), 'VALID', datetime('now'))`,
    [sigId]
  );
  run(`INSERT INTO case_signals (id, case_id, signal_id, linked_at) VALUES (?, ?, ?, datetime('now'))`, [
    `cs-test-${Date.now()}`,
    iotCaseId,
    sigId,
  ]);

  // Check facts
  const factsRes = await req(`/api/cases/${iotCaseId}/facts`, {
    headers: { Authorization: `Bearer ${staffToken}` },
  });
  const telemetryFact = factsRes.data.facts.find(f => f.semantic_type === 'TELEMETRY');
  assert.ok(telemetryFact, 'Must produce TELEMETRY fact');

  // Run analysis: cannot jump to violation conclusion
  const analysisRes = await req(`/api/cases/${iotCaseId}/analysis`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${legalToken}` },
  });

  assert.equal(analysisRes.status, 200);
  assert.notEqual(analysisRes.data.output.conclusion_level, 'HUMAN_CONFIRMED');
  assert.ok(
    analysisRes.data.output.conclusion_level === 'INSUFFICIENT_EVIDENCE' ||
      analysisRes.data.output.conclusion_level === 'PRELIMINARY',
    'IoT anomaly without field inspection cannot produce violation conclusion'
  );

  for (const finding of analysisRes.data.output.findings) {
    assert.ok(!finding.statement.toLowerCase().includes('đã vi phạm'), 'Finding cannot state "đã vi phạm" without human decision');
  }
});

// -----------------------------------------------------------------------------
// 5. Tampered evidence cannot be used as VERIFIED
// -----------------------------------------------------------------------------
test('5. Cryptographic Integrity: Tampered evidence cannot be used as VERIFIED', async () => {
  const caseId = 'case-001';
  const assetId = `evd-tamper-${Date.now()}`;

  // Insert fake asset with mismatched hash
  run(
    `INSERT INTO evidence_assets (id, case_id, source_type, file_path, file_name, mime_type, file_size, sha256, uploaded_by, created_at)
     VALUES (?, ?, 'CASE', '/uploads/nonexistent-file.jpg', 'nonexistent.jpg', 'image/jpeg', 1024, '0000000000000000000000000000000000000000000000000000000000000000', 'usr-staff-1', datetime('now'))`,
    [assetId, caseId]
  );

  // Verify hash
  const verifyRes = await req(`/api/evidence/${assetId}/verify-hash`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${staffToken}` },
  });

  assert.equal(verifyRes.status, 200);
  assert.equal(verifyRes.data.verified, false, 'Tampered/missing file must fail verification');
  assert.equal(verifyRes.data.integrity_status, 'FILE_MISSING');

  // Fact check: evidence must be REJECTED
  const factsRes = await req(`/api/cases/${caseId}/facts`, {
    headers: { Authorization: `Bearer ${staffToken}` },
  });
  const tamperedFact = factsRes.data.facts.find(f => f.source_id === assetId);
  assert.ok(tamperedFact);
  assert.equal(tamperedFact.verification_state, 'REJECTED');
  assert.notEqual(tamperedFact.integrity_state, 'VERIFIED');
});

// -----------------------------------------------------------------------------
// 6. Missing evidence produces INSUFFICIENT_EVIDENCE
// -----------------------------------------------------------------------------
test('6. Missing Fact Engine: Case lacking field evidence produces INSUFFICIENT_EVIDENCE', async () => {
  // Case DG-2026-OP-001 is NEW and lacks inspection
  const res = await req('/api/cases/case-001/analysis', {
    method: 'POST',
    headers: { Authorization: `Bearer ${legalToken}` },
  });

  assert.equal(res.status, 200);
  assert.equal(res.data.output.conclusion_level, 'INSUFFICIENT_EVIDENCE');
  assert.ok(res.data.output.missing_facts.length > 0, 'Must identify missing evidence facts');

  const missingInspection = res.data.output.missing_facts.some(mf =>
    mf.fact.toLowerCase().includes('biên bản kiểm tra') || mf.fact.toLowerCase().includes('lưới')
  );
  assert.ok(missingInspection, 'Must identify missing inspection or mesh evidence');
});

// -----------------------------------------------------------------------------
// 7. Inspection FAIL + verified evidence produces PRELIMINARY/SUPPORTED only
// -----------------------------------------------------------------------------
test('7. Proportionality: Inspection FAIL + verified evidence produces SUPPORTED only, never HUMAN_CONFIRMED', async () => {
  // case-016 has completed inspection with FAIL items and verified evidence assets
  const res = await req('/api/cases/case-016/analysis', {
    method: 'POST',
    headers: { Authorization: `Bearer ${legalToken}` },
  });

  assert.equal(res.status, 200);
  assert.ok(
    res.data.output.conclusion_level === 'SUPPORTED' || res.data.output.conclusion_level === 'PRELIMINARY',
    `Conclusion without recorded human decision can only be PRELIMINARY or SUPPORTED, got: ${res.data.output.conclusion_level}`
  );
  assert.notEqual(res.data.output.conclusion_level, 'HUMAN_CONFIRMED');
});

// -----------------------------------------------------------------------------
// 8. Only recorded human decision can produce HUMAN_CONFIRMED
// -----------------------------------------------------------------------------
test('8. Human Decision Layer: Only recorded human decision can produce HUMAN_CONFIRMED', async () => {
  const caseId = 'case-016';

  // 1. Submit human decision
  const decRes = await req(`/api/cases/${caseId}/decisions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${supToken}` },
    body: JSON.stringify({
      decision_type: 'CONFIRM_VIOLATION',
      reason: 'Lãnh đạo phòng giám sát xác nhận biên bản kiểm tra và ảnh chụp hiện trường đủ căn cứ xử lý vi phạm.',
    }),
  });

  assert.equal(decRes.status, 201);
  assert.equal(decRes.data.decision.decision_type, 'CONFIRM_VIOLATION');

  // Verify persistence in human_decisions SQLite table
  const dbRecord = get(`SELECT * FROM human_decisions WHERE id = ?`, [decRes.data.decision.id]);
  assert.ok(dbRecord, 'Decision must physically persist in SQLite human_decisions table');

  // 2. Re-run analysis: now it must elevate to HUMAN_CONFIRMED
  const analysisRes = await req(`/api/cases/${caseId}/analysis`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${legalToken}` },
  });

  assert.equal(analysisRes.status, 200);
  assert.equal(analysisRes.data.output.conclusion_level, 'HUMAN_CONFIRMED', 'Must become HUMAN_CONFIRMED after authoritative decision');

  // Check audit snapshot in analysis_runs table
  const runRecord = get(`SELECT * FROM analysis_runs WHERE case_id = ? ORDER BY created_at DESC LIMIT 1`, [caseId]);
  assert.ok(runRecord, 'Analysis run snapshot must be persisted in SQLite analysis_runs table');
  assert.equal(runRecord.validation_status, 'VALID');
});
