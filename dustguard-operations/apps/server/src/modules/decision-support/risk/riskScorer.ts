import { NormalizedFact, RiskScoreBreakdown, CertaintyLevel } from '../types.js';

export interface RiskCalculationInput {
  facts: NormalizedFact[];
  casePriority?: string;
  sourceReportCount?: number;
  hasTamperedEvidence?: boolean;
}

export class RiskScorer {
  public static readonly RISK_MODEL_VERSION = 'v2.0-multi-factor';

  private static readonly WEIGHTS = {
    wBase: 0.35,
    wSpatial: 0.20,
    wTemporal: 0.15,
    wRecurrence: 0.15,
    wImpact: 0.15,
  };

  /**
   * Tính toán chỉ số ưu tiên rủi ro đa chiều v2 và hệ số tin cậy độc lập
   */
  public static calculateRisk(input: RiskCalculationInput): {
    score: number;
    label: string;
    confidence: number;
    certainty: CertaintyLevel;
    breakdown: RiskScoreBreakdown;
  } {
    const { facts, casePriority = 'NORMAL', sourceReportCount = 1, hasTamperedEvidence = false } = input;

    // 1. Base Severity (0..100): Dựa trên mức độ ưu tiên hồ sơ và kết quả kiểm tra
    let baseSeverity = 40;
    if (casePriority === 'URGENT') baseSeverity = 90;
    else if (casePriority === 'HIGH') baseSeverity = 75;
    else if (casePriority === 'NORMAL') baseSeverity = 50;
    else if (casePriority === 'LOW') baseSeverity = 25;

    const failedObs = facts.filter(f => f.semanticType === 'OBSERVATION' && (f.value || '').includes('FAIL'));
    if (failedObs.length > 0) {
      baseSeverity = Math.min(100, baseSeverity + failedObs.length * 15);
    }

    // 2. Spatial Proximity (0..100): Khoảng cách tới khu dân cư
    // Mặc định công trình đô thị mật độ cao = 70
    let spatialProximity = 70;
    const isNearby = facts.some(f => f.automatedChecks?.nearSite);
    if (isNearby) spatialProximity = 80;

    // 3. Temporal Duration (0..100): Thời gian kéo dài
    let temporalDuration = 50;
    const telemetry = facts.filter(f => f.semanticType === 'TELEMETRY');
    if (telemetry.length > 10) temporalDuration = 80;

    // 4. Recurrence (0..100): Số lần phản ánh tái diễn
    let recurrence = Math.min(100, Math.max(20, (sourceReportCount || 1) * 20));

    // 5. Impact Surface (0..100): Mức độ ảnh hưởng cộng đồng
    let impactSurface = 40;
    const claims = facts.filter(f => f.semanticType === 'CLAIM');
    if (claims.length > 2) impactSurface = 80;
    else if (claims.length > 0) impactSurface = 60;

    // Áp dụng công thức có trọng số
    const finalScore = Math.round(
      this.WEIGHTS.wBase * baseSeverity +
      this.WEIGHTS.wSpatial * spatialProximity +
      this.WEIGHTS.wTemporal * temporalDuration +
      this.WEIGHTS.wRecurrence * recurrence +
      this.WEIGHTS.wImpact * impactSurface
    );

    // Tính toán Confidence (0.0..1.0) độc lập với Risk Score
    const evidence = facts.filter(f => f.factType === 'EVIDENCE_ASSET');
    const verifiedEvidence = evidence.filter(e => e.integrityState === 'VERIFIED');
    const hasCompletedInspection = facts.some(f => f.semanticType === 'OBSERVATION' && f.verificationState === 'VERIFIED');
    const hasHumanDecision = facts.some(f => f.semanticType === 'HUMAN_DECISION');

    let confidence = 0.35; // Mặc định sơ bộ chỉ có Claim

    if (hasHumanDecision) {
      confidence = 0.98;
    } else if (hasCompletedInspection && verifiedEvidence.length > 0) {
      confidence = 0.88;
    } else if (hasCompletedInspection || verifiedEvidence.length > 0) {
      confidence = 0.65;
    }

    // INVARIANT: Thêm tệp bị TAMPERED không được tăng confidence; ngược lại làm giảm confidence
    if (hasTamperedEvidence) {
      confidence = Math.max(0.1, confidence - 0.25);
    }

    confidence = Math.round(confidence * 100) / 100;

    let certainty: CertaintyLevel = 'LOW';
    if (confidence >= 0.8) certainty = 'HIGH';
    else if (confidence >= 0.5) certainty = 'MEDIUM';

    let label = 'Rủi ro trung bình';
    if (finalScore >= 80) label = 'Rủi ro rất cao (Ưu tiên xử lý khẩn cấp)';
    else if (finalScore >= 65) label = 'Rủi ro cao (Cần đoàn kiểm tra thực địa)';
    else if (finalScore < 40) label = 'Rủi ro thấp';

    const breakdown: RiskScoreBreakdown = {
      baseSeverity,
      spatialProximity,
      temporalDuration,
      recurrence,
      impactSurface,
      weights: this.WEIGHTS,
      finalScore,
      confidence,
      certainty,
    };

    return {
      score: finalScore,
      label,
      confidence,
      certainty,
      breakdown,
    };
  }
}
