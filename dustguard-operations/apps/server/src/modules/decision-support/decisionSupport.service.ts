import crypto from 'node:crypto';
import { get, query, run } from '../../db/connection.js';
import {
  DecisionSupportResponse,
  AssessmentStatus,
  CertaintyLevel,
  HumanDecisionRecord,
} from './types.js';
import { FactNormalizer } from './facts/factNormalizer.js';
import { SensorQualityEngine } from './sensor-quality/sensorQualityEngine.js';
import { ContradictionDetector } from './contradictions/contradictionDetector.js';
import { EvidenceSufficiencyChecker } from './evidence/sufficiencyChecker.js';
import { EvidenceMatrixBuilder } from './evidence/evidenceMatrix.js';
import { LegalSearchEngine } from './legal/legalSearchEngine.js';
import { RuleEngine } from './rules/ruleEngine.js';
import { RiskScorer } from './risk/riskScorer.js';
import { WorkflowRecommender } from './workflow/workflowRecommender.js';

export interface GenerateDecisionSupportOptions {
  caseId: string;
  userId: string;
  userRole?: string;
  userName?: string;
}

export class DecisionSupportService {
  public static readonly ENGINE_VERSION = '2.1.0';
  public static readonly LEGAL_CORPUS_VERSION = '2026.09';

  /**
   * Pipeline phân tích đối soát dữ kiện, chứng cứ và quy chuẩn pháp lý cấp Production
   */
  public static evaluateCase(options: GenerateDecisionSupportOptions): DecisionSupportResponse {
    const startTime = Date.now();
    const { caseId, userId } = options;

    const targetCase = get<any>(`SELECT * FROM cases WHERE id = ?`, [caseId]);
    if (!targetCase) {
      throw new Error(`Không tìm thấy hồ sơ với ID: ${caseId}`);
    }

    // 1. Facts Normalization (Facts Before Conclusions)
    const facts = FactNormalizer.normalizeCaseFacts(caseId);

    // 2. Sensor Quality Engine
    let sensorQuality = null;
    const rawReadings = query<any>(
      `SELECT r.* FROM iot_readings r
       JOIN iot_devices d ON r.device_id = d.id
       WHERE d.project_id = ?
       ORDER BY r.recorded_at DESC
       LIMIT 24`,
      [targetCase.project_id || '']
    );
    if (rawReadings.length > 0) {
      sensorQuality = SensorQualityEngine.evaluateDeviceReadings(
        rawReadings[0].device_id,
        rawReadings
      );
    }

    // 3. Contradiction Detection
    const contradictions = ContradictionDetector.detectContradictions(facts, sensorQuality);

    // 4. Evidence Sufficiency Check
    const sufficiency = EvidenceSufficiencyChecker.checkSufficiency(facts);

    // 5. Legal Retrieval (FTS5 + Synonyms + Effective Date Check)
    const matchedSections = LegalSearchEngine.searchRelevantSections({
      queryText: `${targetCase.title} ${targetCase.description || ''} bụi che chắn rửa xe`,
      eventTimestamp: targetCase.created_at,
      limit: 6,
    });

    const legalMap = new Map<string, any>();
    matchedSections.forEach(s => legalMap.set(s.id, s));

    // 6. Context Preparation & Rule Engine Execution
    const observations = facts.filter(f => f.semanticType === 'OBSERVATION');
    const claims = facts.filter(f => f.semanticType === 'CLAIM');
    const evidenceAssets = facts.filter(f => f.factType === 'EVIDENCE_ASSET');
    const humanDecisionsList = facts.filter(f => f.semanticType === 'HUMAN_DECISION');

    const verifiedEvidenceCount = evidenceAssets.filter(
      e => e.integrityState === 'VERIFIED' && e.verificationState === 'VERIFIED'
    ).length;
    const tamperedEvidenceCount = evidenceAssets.filter(
      e => e.integrityState === 'TAMPERED' || e.integrityState === 'FILE_MISSING'
    ).length;

    const hasCompletedInspection = observations.some(
      o => o.verificationState === 'VERIFIED'
    );
    const hasWashFailure = observations.some(
      o => (o.value || '').toLowerCase().includes('rửa xe') && (o.value || '').includes('FAIL')
    );
    const hasMeshFailure = observations.some(
      o => ((o.value || '').toLowerCase().includes('lưới') || (o.value || '').toLowerCase().includes('che chắn')) && (o.value || '').includes('FAIL')
    );
    const hasHumanViolationConfirm = humanDecisionsList.some(
      h => (h.value || '').includes('CONFIRM_VIOLATION')
    );

    const evaluationContext = {
      facts,
      hasCompletedInspection,
      hasWashFailure,
      hasMeshFailure,
      verifiedEvidenceCount,
      tamperedEvidenceCount,
      claimCount: claims.length,
      hasHumanViolationConfirm,
    };

    const { trace: ruleTrace, matchedRules } = RuleEngine.evaluateRules(evaluationContext);

    // 7. Findings & Evidence Matrix Generation
    const rawFindings: {
      id: string;
      statement: string;
      sourceIds: string[];
      legalSectionIds: string[];
      confidence: number;
    }[] = [];

    const caseSuffix = targetCase.case_code ? targetCase.case_code.split('-').pop() : '01';

    if (hasHumanViolationConfirm) {
      rawFindings.push({
        id: `FND-${caseSuffix}-CONFIRMED`,
        statement: `Đã xác lập kết luận có hành vi không tuân thủ quy chuẩn kiểm soát bụi tại công trình ${targetCase.contractor_name || targetCase.title} (Cán bộ chuyên trách đã ký duyệt).`,
        sourceIds: [...humanDecisionsList.map(h => h.id), ...evidenceAssets.map(e => e.id)],
        legalSectionIds: matchedSections.length > 0 ? [matchedSections[0].id] : [],
        confidence: 1.0,
      });
    } else if (hasCompletedInspection && (hasWashFailure || hasMeshFailure)) {
      const failedObsIds = observations.filter(o => (o.value || '').includes('FAIL')).map(o => o.id);
      rawFindings.push({
        id: `FND-${caseSuffix}-FAIL`,
        statement: `Biên bản kiểm tra hiện trường ghi nhận hạng mục chưa đạt chuẩn bảo vệ môi trường, cần yêu cầu nhà thầu khắc phục.`,
        sourceIds: failedObsIds.length > 0 ? failedObsIds : [observations[0].id],
        legalSectionIds: matchedSections.length > 0 ? [matchedSections[0].id] : [],
        confidence: verifiedEvidenceCount > 0 ? 0.88 : 0.65,
      });
    } else if (claims.length > 0) {
      rawFindings.push({
        id: `FND-${caseSuffix}-CLAIM`,
        statement: `Ghi nhận phản ánh từ cộng đồng người dân về phát tán bụi (chưa qua xác minh thực địa từ đoàn kiểm tra).`,
        sourceIds: claims.map(c => c.id),
        legalSectionIds: matchedSections.length > 0 ? [matchedSections[0].id] : [],
        confidence: 0.35,
      });
    } else {
      rawFindings.push({
        id: `FND-${caseSuffix}-INIT`,
        statement: `Hồ sơ mới khởi tạo, chưa đủ dữ liệu hiện trường để đánh giá tuân thủ quy chuẩn môi trường.`,
        sourceIds: [`FACT-META-${targetCase.id}`],
        legalSectionIds: [],
        confidence: 0.1,
      });
    }

    const evidenceMatrix = EvidenceMatrixBuilder.buildMatrix(
      facts,
      rawFindings,
      legalMap,
      sufficiency.missingFacts
    );

    // 8. Risk Scoring v2 Calculation
    const riskResult = RiskScorer.calculateRisk({
      facts,
      casePriority: targetCase.priority,
      sourceReportCount: targetCase.source_report_count,
      hasTamperedEvidence: tamperedEvidenceCount > 0,
    });

    // 9. Assessment Status Determination
    let status: AssessmentStatus = 'INSUFFICIENT_EVIDENCE';
    let statusLabel = 'Chưa đủ chứng cứ';
    let certainty: CertaintyLevel = riskResult.certainty;
    let certaintyLabel = 'Mức độ chắc chắn: Thấp';
    let explanation = 'Dữ liệu hồ sơ mới ở mức sơ bộ, cần bổ sung biên bản thanh tra thực địa và ảnh chụp đối chứng nguyên vẹn.';

    if (hasHumanViolationConfirm) {
      status = 'HUMAN_CONFIRMED';
      statusLabel = 'Đã có kết luận chuyên viên';
      certainty = 'HIGH';
      certaintyLabel = 'Mức độ chắc chắn: Cao (Đã ký duyệt)';
      explanation = 'Cán bộ chuyên trách và lãnh đạo đã thẩm định toàn bộ hồ sơ và ban hành quyết định chính thức.';
    } else if (tamperedEvidenceCount > 0) {
      status = 'CONTRADICTORY_EVIDENCE';
      statusLabel = 'Phát hiện mâu thuẫn chứng cứ';
      certainty = 'LOW';
      certaintyLabel = 'Mức độ chắc chắn: Thấp';
      explanation = 'Có tệp chứng cứ số bị sửa đổi hoặc mất dữ liệu mã băm SHA-256. Không thể sử dụng làm căn cứ kết luận.';
    } else if (hasCompletedInspection && (hasWashFailure || hasMeshFailure)) {
      status = 'POSSIBLE_NON_COMPLIANCE';
      statusLabel = 'Có dấu hiệu chưa đạt chuẩn';
      certainty = verifiedEvidenceCount > 0 ? 'HIGH' : 'MEDIUM';
      certaintyLabel = verifiedEvidenceCount > 0 ? 'Mức độ chắc chắn: Khá cao' : 'Mức độ chắc chắn: Trung bình';
      explanation = 'Biên bản thực địa ghi nhận hạng mục thi công không đạt chuẩn, đã đối chiếu với quy chuẩn hiện hành.';
    } else if (hasCompletedInspection && !hasWashFailure && !hasMeshFailure) {
      status = 'NO_INDICATION';
      statusLabel = 'Chưa ghi nhận vi phạm';
      certainty = 'HIGH';
      certaintyLabel = 'Mức độ chắc chắn: Cao';
      explanation = 'Biên bản thực địa ghi nhận các biện pháp che chắn và trạm rửa xe đều tuân thủ quy chuẩn (PASS).';
    }

    // 10. Next Best Action Workflow Recommendations
    const recommendedActions = WorkflowRecommender.planNextActions({
      caseStatus: targetCase.status,
      assignedStaffId: targetCase.assigned_staff_id,
      facts,
      missingFacts: sufficiency.missingFacts,
      contradictions,
      hasCompletedInspection,
      hasVerifiedEvidence: verifiedEvidenceCount > 0,
      hasTamperedEvidence: tamperedEvidenceCount > 0,
      hasHumanDecision: humanDecisionsList.length > 0,
    });

    // 11. Human Review Records
    const dbDecisions = query<any>(
      `SELECT hd.*, u.full_name as actor_name
       FROM human_decisions hd
       JOIN users u ON hd.actor_id = u.id
       WHERE hd.case_id = ?
       ORDER BY hd.created_at DESC`,
      [caseId]
    );

    const history: HumanDecisionRecord[] = dbDecisions.map((d: any) => ({
      id: d.id,
      caseId: d.case_id,
      decisionType: d.decision_type,
      actorId: d.actor_id,
      actorName: d.actor_name,
      actorRole: d.actor_role,
      reason: d.reason,
      referencesJson: d.references_json,
      supersedesDecisionId: d.supersedes_decision_id,
      createdAt: d.created_at,
    }));

    const response: DecisionSupportResponse = {
      caseId: targetCase.id,
      caseCode: targetCase.case_code,
      assessment: {
        status,
        statusLabel,
        certainty,
        certaintyLabel,
        explanation,
      },
      risk: {
        score: riskResult.score,
        label: riskResult.label,
        confidence: riskResult.confidence,
        breakdown: riskResult.breakdown,
      },
      facts,
      evidenceMatrix,
      ruleTrace,
      legalReferences: matchedSections.map((s: any) => ({
        id: s.id,
        documentTitle: s.document_title,
        documentNumber: s.document_number,
        sectionNumber: s.section_number,
        heading: s.heading,
        content: s.content,
        effectiveDate: s.effective_date,
        status: s.doc_status,
      })),
      contradictions,
      missingFacts: sufficiency.missingFacts,
      recommendedActions,
      sensorQuality,
      humanReview: {
        required: true,
        status: history.length > 0 ? 'DECIDED' : 'PENDING',
        latestDecision: history.length > 0 ? history[0] : undefined,
        history,
      },
      engineMetadata: {
        engineVersion: this.ENGINE_VERSION,
        ruleSetVersion: RuleEngine.RULE_SET_VERSION,
        legalCorpusVersion: this.LEGAL_CORPUS_VERSION,
        calculatedAt: new Date().toISOString(),
        runtimeMs: Date.now() - startTime,
        disclaimer:
          'Hệ thống chỉ hỗ trợ tổng hợp dữ kiện, tra cứu quy chuẩn và đối soát quy tắc. Kết luận cuối cùng thuộc về cán bộ chuyên trách.',
      },
    };

    // 12. Ghi nhận snapshot bất biến vào decision_support_runs
    try {
      const validUser = get<any>(`SELECT id FROM users WHERE id = ?`, [userId]);
      const effectiveUserId = validUser ? userId : (get<any>(`SELECT id FROM users LIMIT 1`)?.id || userId);
      const runId = `dsr-${crypto.randomUUID().substring(0, 8)}`;
      run(
        `INSERT INTO decision_support_runs (
           id, case_id, created_at, created_by,
           engine_version, rule_set_version, legal_corpus_version,
           assessment_status, certainty, risk_score, risk_confidence,
           facts_json, evidence_matrix_json, rule_trace_json,
           contradictions_json, missing_facts_json, recommended_actions_json,
           validation_status
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'VALID')`,
        [
          runId,
          caseId,
          response.engineMetadata.calculatedAt,
          effectiveUserId,
          response.engineMetadata.engineVersion,
          response.engineMetadata.ruleSetVersion,
          response.engineMetadata.legalCorpusVersion,
          response.assessment.status,
          response.assessment.certainty,
          response.risk.score,
          response.risk.confidence,
          JSON.stringify(facts),
          JSON.stringify(evidenceMatrix),
          JSON.stringify(ruleTrace),
          JSON.stringify(contradictions),
          JSON.stringify(sufficiency.missingFacts),
          JSON.stringify(recommendedActions),
        ]
      );
    } catch (e: any) {
      console.warn('[DecisionSupport] Could not persist decision_support_runs snapshot:', e.message);
    }

    return response;
  }
}
