/**
 * Decision Support Engine Types
 * Theo chuẩn: DustGuard Evidence-Grounded Decision Engine
 * Nguyên tắc: Facts Before Conclusions | Zero Fake AI | Human Authority
 */

export type SemanticType = 'CLAIM' | 'OBSERVATION' | 'TELEMETRY' | 'DOCUMENT' | 'INSPECTION' | 'HUMAN_DECISION';
export type FactType = 'METADATA' | 'COMMUNITY_CLAIM' | 'CHECKLIST_ITEM' | 'INSPECTION_OBSERVATION' | 'EVIDENCE_ASSET' | 'IOT_TELEMETRY' | 'HUMAN_DECISION' | 'SIGNAL';
export type VerificationState = 'UNVERIFIED' | 'PRELIMINARY' | 'VERIFIED' | 'REJECTED';
export type IntegrityState = 'UNVERIFIED' | 'VERIFIED' | 'TAMPERED' | 'FILE_MISSING';
export type AssessmentStatus = 'NO_INDICATION' | 'POSSIBLE_NON_COMPLIANCE' | 'INSUFFICIENT_EVIDENCE' | 'CONTRADICTORY_EVIDENCE' | 'HUMAN_CONFIRMED';
export type CertaintyLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface NormalizedFact {
  id: string;
  friendlyCode: string;
  factType: FactType;
  semanticType: SemanticType;
  title: string;
  value: string;
  sourceType: 'COMMUNITY' | 'STAFF' | 'IOT' | 'SYSTEM' | 'CONTRACTOR';
  sourceId: string;
  sourceTimestamp: string;
  verificationState: VerificationState;
  integrityState: IntegrityState;
  confidence: number; // 0.0 - 1.0
  metadata?: Record<string, any>;
  automatedChecks?: {
    validTime: boolean;
    timeNote?: string;
    nearSite: boolean;
    distanceNote?: string;
    fieldVerified: boolean;
    inspectorNote?: string;
  };
}

export interface EvidenceMatrixRow {
  findingId: string;
  statement: string;
  sources: {
    id: string;
    title: string;
    semanticType: SemanticType;
    verificationState: VerificationState;
    integrityState: IntegrityState;
  }[];
  legalProvisions: {
    id: string;
    number: string;
    heading: string;
    excerpt: string;
  }[];
  verificationStatus: string;
  missingItems: string[];
  confidence: number;
  requiresHumanReview: boolean;
}

export interface SensorQualityMetric {
  deviceId: string;
  packetCount: number;
  flatlineDetected: boolean;
  extremeSpikeDetected: boolean;
  madOutlierCount: number;
  temporalLagSeconds: number;
  qualityScore: number; // 0..100
  status: 'OPTIMAL' | 'DEGRADED' | 'SUSPICIOUS' | 'INVALID';
  reasons: string[];
}

export interface Contradiction {
  id: string;
  type: 'SPATIAL' | 'TEMPORAL' | 'OBSERVATION_VS_TELEMETRY' | 'CLAIM_VS_INSPECTION' | 'INTEGRITY_VIOLATION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  recommendation: string;
  sourceIds: string[];
}

export interface MissingFactItem {
  fact: string;
  reason_needed: string;
  recommended_verification_action: string;
}

export interface RuleCondition {
  field: string; // e.g. "verifiedEvidenceCount", "failedInspectionCount", "hasWashStationEvidence", "pm25Avg"
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
  value: any;
}

export interface RuleDefinition {
  id: string;
  title: string;
  description: string;
  version: string;
  category: 'ENVIRONMENTAL_STANDARD' | 'EVIDENCE_SUFFICIENCY' | 'INSPECTION_COMPLIANCE';
  conditions: RuleCondition[];
  conditionLogic: 'AND' | 'OR';
  action: {
    assessmentStatus?: AssessmentStatus;
    riskDelta?: number;
    recommendedAction?: string;
    findingTemplate?: string;
    flagContradiction?: string;
  };
}

export interface RuleTraceItem {
  ruleId: string;
  ruleTitle: string;
  version: string;
  matched: boolean;
  conditionsEvaluated: {
    field: string;
    actualValue: any;
    expected: any;
    passed: boolean;
  }[];
  firedAction?: any;
  explanation: string;
}

export interface RiskScoreBreakdown {
  baseSeverity: number;     // 0..100 (từ checklist/loại sự việc)
  spatialProximity: number; // 0..100 (khoảng cách tới khu dân cư, trường học)
  temporalDuration: number; // 0..100 (thời gian kéo dài, thi công ban đêm)
  recurrence: number;       // 0..100 (số lần tái phạm)
  impactSurface: number;    // 0..100 (mức độ lan tỏa bụi, số phản ánh)
  weights: {
    wBase: number;
    wSpatial: number;
    wTemporal: number;
    wRecurrence: number;
    wImpact: number;
  };
  finalScore: number;       // 0..100
  confidence: number;       // 0.0..1.0 (phụ thuộc chất lượng và tính đầy đủ chứng cứ)
  certainty: CertaintyLevel;
}

export interface WorkflowRecommendation {
  priority: number;
  actionType: 'VERIFY_SENSOR' | 'REQUEST_EVIDENCE' | 'SCHEDULE_INSPECTION' | 'ASSIGN_OFFICER' | 'REQUEST_LEGAL_REVIEW' | 'ISSUE_CORRECTIVE_ACTION' | 'READY_FOR_HUMAN_DECISION';
  title: string;
  description: string;
  buttonLabel: string;
  actionKind: 'TASK' | 'INSPECTION' | 'EVIDENCE' | 'LEGAL' | 'ACTION';
  reason: string;
  requiresHumanApproval: boolean;
}

export interface HumanDecisionRecord {
  id: string;
  caseId: string;
  decisionType: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  reason: string;
  referencesJson?: string;
  supersedesDecisionId?: string;
  createdAt: string;
}

export interface DecisionSupportResponse {
  caseId: string;
  caseCode: string;
  assessment: {
    status: AssessmentStatus;
    statusLabel: string;
    certainty: CertaintyLevel;
    certaintyLabel: string;
    explanation: string;
  };
  risk: {
    score: number; // 0..100
    label: string;
    confidence: number; // 0.0..1.0
    breakdown: RiskScoreBreakdown;
  };
  facts: NormalizedFact[];
  evidenceMatrix: EvidenceMatrixRow[];
  ruleTrace: RuleTraceItem[];
  legalReferences: {
    id: string;
    documentTitle: string;
    documentNumber: string;
    sectionNumber: string;
    heading: string;
    content: string;
    effectiveDate: string;
    status: string;
  }[];
  contradictions: Contradiction[];
  missingFacts: MissingFactItem[];
  recommendedActions: WorkflowRecommendation[];
  sensorQuality: SensorQualityMetric | null;
  humanReview: {
    required: boolean;
    status: 'PENDING' | 'DECIDED' | 'SUPERSEDED';
    latestDecision?: HumanDecisionRecord;
    history: HumanDecisionRecord[];
  };
  engineMetadata: {
    engineVersion: string;
    ruleSetVersion: string;
    legalCorpusVersion: string;
    calculatedAt: string;
    runtimeMs: number;
    disclaimer: string;
  };
}
