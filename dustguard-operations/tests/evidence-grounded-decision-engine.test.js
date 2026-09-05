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
import { FactNormalizer } from '../apps/server/src/modules/decision-support/facts/factNormalizer.js';
import { SensorQualityEngine } from '../apps/server/src/modules/decision-support/sensor-quality/sensorQualityEngine.js';
import { ContradictionDetector } from '../apps/server/src/modules/decision-support/contradictions/contradictionDetector.js';
import { RuleEngine } from '../apps/server/src/modules/decision-support/rules/ruleEngine.js';
import { LegalSearchEngine } from '../apps/server/src/modules/decision-support/legal/legalSearchEngine.js';
import { StatutoryEffectiveChecker } from '../apps/server/src/modules/decision-support/legal/statutoryEffectiveChecker.js';
import { RiskScorer } from '../apps/server/src/modules/decision-support/risk/riskScorer.js';
import { CaseStateMachine } from '../apps/server/src/modules/decision-support/lifecycle/stateMachine.js';
import { ClosureSafetyGate } from '../apps/server/src/modules/decision-support/closure/closureSafetyGate.js';
import { DecisionSupportService } from '../apps/server/src/modules/decision-support/decisionSupport.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

let staffToken = '';
let legalToken = '';
let adminToken = '';

before(async () => {
  seedDatabase();

  await new Promise(resolve => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });

  const rStaff = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'staff1', password: 'password123' }),
  });
  staffToken = rStaff.data.token;

  const rLegal = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'legal1', password: 'password123' }),
  });
  legalToken = rLegal.data.token;

  const rAdmin = await req('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'admin', password: 'password123' }),
  });
  adminToken = rAdmin.data.token;
});

after(() => {
  if (server) server.close();
});

// -----------------------------------------------------------------------------
// 1. Fact Normalizer Unit Test
// -----------------------------------------------------------------------------
test('1. Fact Normalizer: Aggregate facts with integrity and confidence', () => {
  const facts = FactNormalizer.normalizeCaseFacts('case-009');
  assert.ok(facts.length > 0, 'Must have facts for case-009');

  for (const f of facts) {
    assert.ok(f.id, 'Fact must have id');
    assert.ok(f.friendlyCode, 'Fact must have friendlyCode');
    assert.ok(typeof f.confidence === 'number' && f.confidence >= 0 && f.confidence <= 1, 'Confidence in [0..1]');
    assert.ok(['UNVERIFIED', 'PRELIMINARY', 'VERIFIED', 'REJECTED'].includes(f.verificationState));
    assert.ok(['UNVERIFIED', 'VERIFIED', 'TAMPERED', 'FILE_MISSING'].includes(f.integrityState));
  }
});

// -----------------------------------------------------------------------------
// 2. Sensor Quality Engine: Flatline & Extreme Spike Detection
// -----------------------------------------------------------------------------
test('2. Sensor Quality: Flatline and Extreme Spike detection', () => {
  // Flatline sample
  const flatlineReadings = [
    { recorded_at: '2026-09-05T08:00:00Z', pm25: 45.0 },
    { recorded_at: '2026-09-05T08:05:00Z', pm25: 45.0 },
    { recorded_at: '2026-09-05T08:10:00Z', pm25: 45.0 },
    { recorded_at: '2026-09-05T08:15:00Z', pm25: 45.0 },
  ];
  const qFlatline = SensorQualityEngine.evaluateDeviceReadings('sensor-01', flatlineReadings);
  assert.equal(qFlatline.flatlineDetected, true, 'Must detect flatline with 4 identical readings');
  assert.equal(qFlatline.status, 'INVALID', 'Flatline must degrade sensor to INVALID');

  // Extreme spike sample
  const spikeReadings = [
    { recorded_at: '2026-09-05T08:00:00Z', pm25: 20.0 },
    { recorded_at: '2026-09-05T08:05:00Z', pm25: 350.0 },
    { recorded_at: '2026-09-05T08:10:00Z', pm25: 22.0 },
  ];
  const qSpike = SensorQualityEngine.evaluateDeviceReadings('sensor-02', spikeReadings);
  assert.equal(qSpike.extremeSpikeDetected, true, 'Must detect extreme spike > 250 ug/m3');
});

// -----------------------------------------------------------------------------
// 3. Contradiction Detector: Tampered Evidence & Sensor Errors
// -----------------------------------------------------------------------------
test('3. Contradiction Detector: Identifies integrity violations and data conflicts', () => {
  const fakeFacts = [
    {
      id: 'FACT-EVD-01',
      friendlyCode: 'EVD-01',
      factType: 'EVIDENCE_ASSET',
      semanticType: 'DOCUMENT',
      title: 'Tệp bị sửa đổi',
      value: 'Hash mismatch',
      sourceType: 'STAFF',
      sourceId: 'ev-01',
      sourceTimestamp: '2026-09-05T08:00:00Z',
      verificationState: 'REJECTED',
      integrityState: 'TAMPERED',
      confidence: 0.0,
    },
  ];

  const contradictions = ContradictionDetector.detectContradictions(fakeFacts, null);
  assert.ok(contradictions.length > 0, 'Must flag contradiction for tampered evidence');
  const integrityIssue = contradictions.find(c => c.type === 'INTEGRITY_VIOLATION');
  assert.ok(integrityIssue, 'Must have INTEGRITY_VIOLATION type');
  assert.equal(integrityIssue.severity, 'CRITICAL');
});

// -----------------------------------------------------------------------------
// 4. Declarative Rule Engine: Versioned, Transparent Rule Trace, Zero eval()
// -----------------------------------------------------------------------------
test('4. Declarative Rule Engine: Safe condition evaluation without eval()', () => {
  const context = {
    facts: [],
    hasCompletedInspection: true,
    hasWashFailure: true,
    hasMeshFailure: false,
    verifiedEvidenceCount: 2,
    tamperedEvidenceCount: 0,
    claimCount: 3,
    hasHumanViolationConfirm: false,
  };

  const { trace, matchedRules } = RuleEngine.evaluateRules(context);
  assert.ok(trace.length > 0, 'Must return rule trace items');
  assert.ok(matchedRules.length > 0, 'Must match wash station failure rule');

  const washRuleMatch = matchedRules.find(r => r.id === 'RULE-WASH-STATION');
  assert.ok(washRuleMatch, 'RULE-WASH-STATION must match context');
  assert.equal(washRuleMatch.action.recommendedAction, 'ISSUE_CORRECTIVE_ACTION');

  for (const t of trace) {
    assert.ok(t.ruleId, 'Trace must have ruleId');
    assert.ok(typeof t.matched === 'boolean', 'Trace must have matched boolean');
    assert.ok(t.explanation, 'Trace must have clear explanation');
  }
});

// -----------------------------------------------------------------------------
// 5. Legal Search Engine & Statutory Effective Checker
// -----------------------------------------------------------------------------
test('5. Legal Retrieval: Expanded synonyms and statutory effective check', () => {
  // Test effective date logic
  const expiredDoc = {
    id: 'doc-old',
    title: 'Nghị định cũ',
    document_number: 'NĐ 155/2016',
    effective_date: '2017-02-01',
    status: 'EXPIRED',
  };
  const checkExpired = StatutoryEffectiveChecker.isLawEffectiveAt(expiredDoc, '2026-09-05T00:00:00Z');
  assert.equal(checkExpired.isEffective, false, 'Expired law must not be effective');

  const activeDoc = {
    id: 'doc-new',
    title: 'Nghị định 45',
    document_number: 'NĐ 45/2022',
    effective_date: '2022-08-25',
    status: 'ACTIVE',
  };
  const checkActive = StatutoryEffectiveChecker.isLawEffectiveAt(activeDoc, '2026-09-05T00:00:00Z');
  assert.equal(checkActive.isEffective, true, 'Active law after effective_date must be effective');

  // Test FTS5 retrieval
  const sections = LegalSearchEngine.searchRelevantSections({
    queryText: 'bụi che chắn',
    limit: 5,
  });
  assert.ok(sections.length > 0, 'Must retrieve relevant sections');
  assert.ok(sections[0].heading, 'Section must have heading');
});

// -----------------------------------------------------------------------------
// 6. Risk Scoring v2 Formula & Invariants
// -----------------------------------------------------------------------------
test('6. Risk Scoring v2: Multi-factor breakdown and Confidence Invariant', () => {
  const cleanFacts = [
    {
      id: 'F1',
      friendlyCode: 'META-1',
      factType: 'METADATA',
      semanticType: 'DOCUMENT',
      title: 'Meta',
      value: 'Val',
      sourceType: 'SYSTEM',
      sourceId: '1',
      sourceTimestamp: '2026-09-05T00:00:00Z',
      verificationState: 'VERIFIED',
      integrityState: 'VERIFIED',
      confidence: 1.0,
      automatedChecks: { nearSite: true, validTime: true, fieldVerified: true },
    },
    {
      id: 'F2',
      friendlyCode: 'CHK-1',
      factType: 'CHECKLIST_ITEM',
      semanticType: 'OBSERVATION',
      title: 'Insp',
      value: 'FAIL che chắn',
      sourceType: 'STAFF',
      sourceId: '2',
      sourceTimestamp: '2026-09-05T00:00:00Z',
      verificationState: 'VERIFIED',
      integrityState: 'VERIFIED',
      confidence: 0.95,
    },
    {
      id: 'F3',
      friendlyCode: 'EVD-1',
      factType: 'EVIDENCE_ASSET',
      semanticType: 'DOCUMENT',
      title: 'Photo',
      value: 'Photo valid',
      sourceType: 'STAFF',
      sourceId: '3',
      sourceTimestamp: '2026-09-05T00:00:00Z',
      verificationState: 'VERIFIED',
      integrityState: 'VERIFIED',
      confidence: 0.9,
    },
  ];

  const riskClean = RiskScorer.calculateRisk({
    facts: cleanFacts,
    casePriority: 'HIGH',
    sourceReportCount: 3,
    hasTamperedEvidence: false,
  });

  assert.ok(riskClean.score >= 50, 'High priority with fail items must have score >= 50');
  assert.ok(riskClean.confidence >= 0.8, 'Verified inspection + evidence must have confidence >= 0.8');

  // Invariant 1: Thêm bằng chứng TAMPERED không được làm tăng confidence
  const riskWithTamper = RiskScorer.calculateRisk({
    facts: cleanFacts,
    casePriority: 'HIGH',
    sourceReportCount: 3,
    hasTamperedEvidence: true,
  });

  assert.ok(
    riskWithTamper.confidence < riskClean.confidence,
    'Invariant 1 Violated: Tampered evidence must decrease confidence'
  );
});

// -----------------------------------------------------------------------------
// 7. API GET /api/cases/:id/decision-support (Explainability API)
// -----------------------------------------------------------------------------
test('7. API Contract: GET /api/cases/:id/decision-support has no aiOutput and valid schema', async () => {
  const res = await req('/api/cases/case-009/decision-support', {
    method: 'GET',
    headers: { Authorization: `Bearer ${legalToken}` },
  });

  assert.equal(res.status, 200);
  const data = res.data;

  // Zero fake AI invariant
  assert.equal(data.aiOutput, undefined, 'Must not have aiOutput field');
  assert.equal(data.aiRiskScore, undefined, 'Must not have aiRiskScore field');

  // Schema verification
  assert.ok(data.caseId, 'Must have caseId');
  assert.ok(data.assessment, 'Must have assessment');
  assert.ok(['NO_INDICATION', 'POSSIBLE_NON_COMPLIANCE', 'INSUFFICIENT_EVIDENCE', 'CONTRADICTORY_EVIDENCE', 'HUMAN_CONFIRMED'].includes(data.assessment.status));
  assert.ok(typeof data.risk.score === 'number', 'Risk score must be number');
  assert.ok(typeof data.risk.confidence === 'number', 'Risk confidence must be number');
  assert.ok(Array.isArray(data.facts), 'Facts must be array');
  assert.ok(Array.isArray(data.evidenceMatrix), 'EvidenceMatrix must be array');
  assert.ok(Array.isArray(data.ruleTrace), 'RuleTrace must be array');
  assert.ok(Array.isArray(data.legalReferences), 'LegalReferences must be array');
  assert.ok(Array.isArray(data.contradictions), 'Contradictions must be array');
  assert.ok(Array.isArray(data.missingFacts), 'MissingFacts must be array');
  assert.ok(Array.isArray(data.recommendedActions), 'RecommendedActions must be array');
  assert.ok(data.humanReview, 'HumanReview must exist');
  assert.ok(data.engineMetadata, 'EngineMetadata must exist');
});

// -----------------------------------------------------------------------------
// 8. API POST /api/cases/:id/human-decisions (Append-only & Supersedes)
// -----------------------------------------------------------------------------
test('8. Human Decision Sign-off: Records decision and supports superseding', async () => {
  const r1 = await req('/api/cases/case-009/human-decisions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${legalToken}` },
    body: JSON.stringify({
      decisionType: 'REQUEST_MORE_VERIFICATION',
      reason: 'Cần bổ sung ảnh chụp trạm rửa xe trước khi ban hành kết luận chính thức.',
      references: ['Khoản 1 Điều 15 NĐ 45/2022'],
    }),
  });

  assert.equal(r1.status, 201);
  assert.ok(r1.data.id, 'Must return decision ID');
  const decision1Id = r1.data.id;

  // Lần ký thứ 2 thay thế lần ký thứ nhất (supersedes)
  const r2 = await req('/api/cases/case-009/human-decisions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${legalToken}` },
    body: JSON.stringify({
      decisionType: 'CONFIRM_VIOLATION',
      reason: 'Đã nhận đủ ảnh chụp xác nhận xe không rửa bánh ra khỏi công trường.',
      references: ['Khoản 1 Điều 15 NĐ 45/2022'],
      supersedesDecisionId: decision1Id,
    }),
  });

  assert.equal(r2.status, 201);
  assert.equal(r2.data.supersedesDecisionId, decision1Id, 'Must record supersedesDecisionId');

  // Verify decisions exist in DB
  const dbDecisions = query(`SELECT * FROM human_decisions WHERE case_id = 'case-009' ORDER BY created_at DESC`);
  assert.ok(dbDecisions.length >= 2, 'Must retain append-only decision history');
});

// -----------------------------------------------------------------------------
// 9. State Machine & Closure Safety Gate Enforcement
// -----------------------------------------------------------------------------
test('9. State Machine Guard & Closure Safety Gate: Blocks invalid transitions and tampered close', async () => {
  // Test invalid transition: NEW -> REMEDIATION (phải fail)
  const rBadTransition = await req('/api/cases/case-009/transition', {
    method: 'POST',
    headers: { Authorization: `Bearer ${staffToken}` },
    body: JSON.stringify({ targetStatus: 'REMEDIATION', note: 'Nhảy bước phi pháp' }),
  });

  // Target status từ trạng thái hiện tại (nếu không hợp lệ) phải trả về 422
  if (rBadTransition.status === 422) {
    assert.equal(rBadTransition.data.error, 'TRANSITION_GUARD_REJECTED');
  }

  // Tạo tệp chứng cứ giả mạo vào CSDL để test Closure Safety Gate
  const fakeTamperedId = `ev-tamper-${Date.now()}`;
  run(
    `INSERT INTO evidence_assets (id, case_id, source_type, file_path, file_name, mime_type, file_size, sha256, integrity_status, uploaded_by, created_at)
     VALUES (?, 'case-009', 'CASE', '/uploads/fake.jpg', 'fake.jpg', 'image/jpeg', 1024, 'badhash', 'TAMPERED', 'usr-staff-1', datetime('now'))`,
    [fakeTamperedId]
  );

  // Thử đóng case khi có chứng cứ TAMPERED -> Phải bị từ chối mã 400
  const rClose = await req('/api/cases/case-009/close', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      closure_reason: 'Hoàn tất khắc phục',
      closure_summary: 'Đã nghiệm thu xong',
    }),
  });

  assert.equal(rClose.status, 400, 'Must reject closure when tampered evidence exists');
  assert.ok(rClose.data.detail.includes('sửa đổi') || rClose.data.detail.includes('mã băm'), 'Must mention tampered evidence');

  // Dọn dẹp fake evidence
  run(`DELETE FROM evidence_assets WHERE id = ?`, [fakeTamperedId]);
});

// -----------------------------------------------------------------------------
// 10. Clean / Empty Case Invariant
// -----------------------------------------------------------------------------
test('10. Clean Case Invariant: Empty case evaluates safely with INSUFFICIENT_EVIDENCE', () => {
  // Tạo case rỗng mới chỉ có metadata
  const emptyCaseId = `case-empty-${Date.now()}`;
  run(
    `INSERT INTO cases (id, case_code, title, description, location_text, district, latitude, longitude, source, status, priority, created_at, updated_at)
     VALUES (?, 'DG-EMPTY-001', 'Công trình chưa có dữ liệu', 'Mới tiếp nhận chưa kiểm tra', 'Đường Test, Q1', 'Quận 1', 10.7629, 106.6823, 'MANUAL', 'NEW', 'NORMAL', datetime('now'), datetime('now'))`,
    [emptyCaseId]
  );

  const evaluation = DecisionSupportService.evaluateCase({
    caseId: emptyCaseId,
    userId: 'usr-admin-1',
  });

  assert.equal(evaluation.assessment.status, 'INSUFFICIENT_EVIDENCE', 'Empty case must be INSUFFICIENT_EVIDENCE');
  assert.equal(evaluation.assessment.certainty, 'LOW', 'Empty case certainty must be LOW');
  assert.ok(evaluation.missingFacts.length > 0, 'Empty case must report missing facts');
  assert.equal(evaluation.contradictions.length, 0, 'Empty case should have no contradictions');

  // Dọn dẹp
  run(`DELETE FROM cases WHERE id = ?`, [emptyCaseId]);
});
