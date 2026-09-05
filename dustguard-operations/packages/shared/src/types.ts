import type { Role } from './permissions.js';
import type { CaseStatus } from './stateMachine.js';

export type CaseSource = 'COMMUNITY' | 'IOT' | 'MANUAL' | 'IMPORT';
export type AssignmentType = 'PRIMARY' | 'COLLABORATOR' | 'LEGAL_REVIEWER';
export type EvidenceSourceType = 'CASE' | 'INSPECTION' | 'FINDING' | 'REMEDIATION';
export type SectionType = 'Chapter' | 'Article' | 'Clause' | 'Point' | 'Section';
export type LegalReviewStatus = 'NOT_STARTED' | 'IN_REVIEW' | 'NEEDS_INFO' | 'REVIEWED';
export type InspectionType = 'INITIAL' | 'FOLLOW_UP' | 'REINSPECTION';
export type InspectionStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type InspectionItemStatus = 'PASS' | 'FAIL' | 'UNKNOWN' | 'NOT_APPLICABLE';
export type FindingSeverity = 'LOW' | 'MEDIUM' | 'HIGH';
export type ActionStatus = 'OPEN' | 'IN_PROGRESS' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED' | 'CLOSED';
export type RemediationReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'MORE_EVIDENCE_REQUESTED';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: Role;
  department: string;
  phone?: string;
  active: number; // 1 or 0
  created_at: string;
}

export interface Case {
  id: string;
  case_code: string;
  title: string;
  description: string;
  location_text: string;
  district: string;
  latitude: number;
  longitude: number;
  source: CaseSource;
  source_reference?: string;
  source_report_count: number;
  status: CaseStatus;
  assigned_staff_id?: string;
  assigned_staff_name?: string;
  project_id?: string;
  contractor_id?: string;
  contractor_name?: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  created_at: string;
  updated_at: string;
  closed_at?: string;
  // Computed operational flags
  flags?: {
    unassigned: boolean;
    missing_evidence: boolean;
    pending_legal: boolean;
    has_new_reports: boolean;
    overdue: boolean;
    pending_reinspection: boolean;
    open_actions: boolean;
  };
}

export interface CaseTimeline {
  id: string;
  case_id: string;
  event_type: string;
  actor_id?: string;
  actor_name?: string;
  actor_role?: string;
  stage: string;
  description: string;
  metadata_json?: string;
  created_at: string;
}

export interface StaffAssignment {
  id: string;
  case_id: string;
  staff_user_id: string;
  staff_name?: string;
  staff_role?: string;
  assigned_by: string;
  assigned_by_name?: string;
  assignment_type: AssignmentType;
  status: 'ACTIVE' | 'COMPLETED' | 'REPLACED';
  note?: string;
  assigned_at: string;
  due_at?: string;
  completed_at?: string;
}

export interface EvidenceAsset {
  id: string;
  case_id: string;
  source_type: EvidenceSourceType;
  source_id?: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  sha256: string;
  uploaded_by: string;
  uploaded_by_name?: string;
  captured_at?: string;
  created_at: string;
}

export interface LegalDocument {
  id: string;
  title: string;
  document_number: string;
  authority: string;
  issued_date: string;
  effective_date: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REPLACED';
  source_url?: string;
  file_path?: string;
  checksum?: string;
  created_at: string;
}

export interface LegalSection {
  id: string;
  document_id: string;
  document_title?: string;
  document_number?: string;
  section_type: SectionType;
  section_number: string;
  heading: string;
  content: string;
  parent_section_id?: string;
}

export interface LegalAnalysis {
  id: string;
  case_id: string;
  analysis_type: string;
  provider: string;
  model: string;
  prompt_version: string;
  input_snapshot: string;
  output_json: string;
  created_by: string;
  created_at: string;
}

export interface LegalReview {
  id: string;
  case_id: string;
  reviewer_id: string;
  reviewer_name?: string;
  status: LegalReviewStatus;
  summary: string;
  legal_basis_note?: string;
  created_at: string;
  reviewed_at?: string;
}

export interface InspectionTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  active: number;
  created_at: string;
  items?: InspectionTemplateItem[];
}

export interface InspectionTemplateItem {
  id: string;
  template_id: string;
  label: string;
  description?: string;
  required: number;
  legal_section_id?: string;
  legal_reference_text?: string;
  sort_order: number;
}

export interface Inspection {
  id: string;
  case_id: string;
  case_code?: string;
  case_title?: string;
  inspector_id: string;
  inspector_name?: string;
  template_id: string;
  template_name?: string;
  inspection_type: InspectionType;
  scheduled_date: string;
  performed_at?: string;
  status: InspectionStatus;
  location_text: string;
  note?: string;
  override_reason?: string;
  created_at: string;
  updated_at: string;
  items?: InspectionItem[];
  findings?: InspectionFinding[];
}

export interface InspectionItem {
  id: string;
  inspection_id: string;
  template_item_id?: string;
  label: string;
  legal_section_id?: string;
  legal_reference_text?: string;
  status: InspectionItemStatus;
  note?: string;
  evidence_asset_id?: string;
  sort_order: number;
}

export interface InspectionFinding {
  id: string;
  inspection_id: string;
  case_id: string;
  category: string;
  finding: string;
  severity: FindingSeverity;
  legal_section_id?: string;
  legal_reference_text?: string;
  evidence_asset_id?: string;
  staff_note?: string;
  created_at: string;
}

export interface CorrectiveAction {
  id: string;
  case_id: string;
  inspection_id?: string;
  finding_id?: string;
  title: string;
  description: string;
  responsible_party: string;
  due_at: string;
  status: ActionStatus;
  created_by: string;
  created_by_name?: string;
  created_at: string;
  completed_at?: string;
  submissions?: RemediationSubmission[];
}

export interface RemediationSubmission {
  id: string;
  corrective_action_id: string;
  case_id: string;
  submitted_by: string;
  description: string;
  evidence_asset_ids?: string;
  review_status: RemediationReviewStatus;
  review_note?: string;
  reviewed_by?: string;
  reviewed_by_name?: string;
  submitted_at: string;
  reviewed_at?: string;
}

export interface CaseClosure {
  id: string;
  case_id: string;
  closed_by: string;
  closed_by_name?: string;
  closure_reason: string;
  closure_summary: string;
  closed_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: number;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  user_name?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata_json?: string;
  ip_address?: string;
  created_at: string;
}

export interface IntegrationLog {
  id: string;
  source: string;
  external_id: string;
  status: 'SUCCESS' | 'ERROR' | 'IGNORED';
  payload_hash: string;
  processed_at: string;
  error?: string;
}

export interface Signal {
  id: string;
  source_type: 'COMMUNITY' | 'IOT' | 'STAFF' | 'IMPORT';
  external_source_id?: string;
  signal_type: string;
  title: string;
  description: string;
  location_text: string;
  latitude: number;
  longitude: number;
  observed_at: string;
  received_at: string;
  payload_json?: string;
  integrity_status: 'VALID' | 'SUSPICIOUS' | 'CORRUPTED';
  created_at: string;
}

export interface CaseSignal {
  id: string;
  case_id: string;
  signal_id: string;
  linked_at: string;
  linked_by?: string;
  notes?: string;
}

export interface Task {
  id: string;
  case_id?: string;
  case_code?: string;
  title: string;
  description: string;
  source: 'MANUAL' | 'CASE' | 'LEGAL' | 'INSPECTION' | 'IOT' | 'AUTOMATION';
  source_entity_type?: string;
  source_entity_id?: string;
  assigned_to: string;
  assigned_to_name?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  due_at: string;
  created_at: string;
  completed_at?: string;
}

export interface IoTDevice {
  id: string;
  device_code: string;
  name: string;
  location_text: string;
  latitude: number;
  longitude: number;
  status: 'ONLINE' | 'OFFLINE' | 'FAULTY' | 'UNKNOWN';
  last_seen_at?: string;
  firmware_version?: string;
  secret_reference: string;
  is_simulated: number;
  created_at: string;
  updated_at: string;
  latest_pm25?: number;
  latest_pm10?: number;
}

export interface IoTReading {
  id: string;
  device_id: string;
  recorded_at: string;
  received_at: string;
  pm25: number;
  pm10: number;
  temperature?: number;
  humidity?: number;
  raw_payload_json: string;
  integrity_status: 'VALID' | 'FLATLINE' | 'CORRUPTED' | 'CLOCK_DRIFT';
  created_at: string;
}

export interface IoTEvent {
  id: string;
  device_id: string;
  event_type: 'OFFLINE' | 'FLATLINE' | 'TAMPER' | 'RECONNECTED' | 'SPIKE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  created_at: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  event_type: string;
  conditions_json: string;
  actions_json: string;
  enabled: number;
  created_at: string;
  updated_at: string;
}

export interface AutomationRun {
  id: string;
  rule_id: string;
  rule_name?: string;
  trigger_entity_type: string;
  trigger_entity_id: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  input_json: string;
  result_json?: string;
  error_message?: string;
  started_at: string;
  completed_at?: string;
}

export interface NextCaseAction {
  action: string;
  title: string;
  reason: string;
  route: string;
  blockingIssues: string[];
}

export interface EvidenceGap {
  type: 'PHOTO' | 'DOCUMENT' | 'LOG' | 'WITNESS';
  description: string;
  reason: string;
  legalSectionIds: string[];
  suggestedCollectionMethod: string;
}

// -----------------------------------------------------------------------------
// EVIDENCE PROVENANCE & STRICT GROUNDED INTELLIGENCE TYPES
// SOURCE -> FACT -> EVIDENCE -> INFERENCE -> HUMAN DECISION
// -----------------------------------------------------------------------------

export type FactType =
  | 'METADATA'
  | 'COMMUNITY_CLAIM'
  | 'INSPECTION_OBSERVATION'
  | 'CHECKLIST_ITEM'
  | 'FIELD_MEASUREMENT'
  | 'EVIDENCE_ASSET'
  | 'IOT_READING'
  | 'IOT_ANOMALY'
  | 'LEGAL_REVIEW'
  | 'REMEDIATION_RESULT'
  | 'HUMAN_DECISION';

export type SemanticType = 'CLAIM' | 'OBSERVATION' | 'TELEMETRY' | 'DOCUMENT' | 'HUMAN_DECISION';
export type VerificationState = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type IntegrityState = 'UNVERIFIED' | 'VERIFIED' | 'TAMPERED' | 'FILE_MISSING' | 'INVALID';

export interface CaseFact {
  id: string;
  fact_type: FactType;
  semantic_type: SemanticType;
  title: string;
  value: string;
  source_type: 'COMMUNITY' | 'STAFF' | 'INSPECTOR' | 'IOT' | 'EVIDENCE' | 'SUPERVISOR' | 'SYSTEM';
  source_id: string;
  source_timestamp: string;
  created_by?: string;
  verification_state: VerificationState;
  integrity_state: IntegrityState;
  metadata?: any;
}

export type ConclusionLevel =
  | 'INSUFFICIENT_EVIDENCE'
  | 'PRELIMINARY'
  | 'SUPPORTED'
  | 'HUMAN_CONFIRMED';

export interface AnalysisFinding {
  id: string;
  statement: string;
  source_ids: string[];
  legal_section_ids: string[];
  confidence: number;
  requires_human_review: boolean;
}

export interface MissingFact {
  fact: string;
  reason_needed: string;
  recommended_verification_action: string;
}

export interface AnalysisRecommendedAction {
  action_type: string;
  reason: string;
  source_ids: string[];
  requires_human_approval: boolean;
}

export interface EvidenceMatrixRow {
  finding_id: string;
  statement: string;
  sources: Array<{
    id: string;
    title: string;
    semantic_type: SemanticType;
    verification_state: VerificationState;
    integrity_state: IntegrityState;
  }>;
  legal_provisions: Array<{
    id: string;
    number: string;
    heading: string;
    excerpt: string;
  }>;
  verification_status: string;
  missing_items: string[];
  confidence: number;
  requires_human_review: boolean;
}

export interface AnalysisOutput {
  conclusion_level: ConclusionLevel;
  findings: AnalysisFinding[];
  missing_facts: MissingFact[];
  recommended_actions: AnalysisRecommendedAction[];
  evidence_matrix?: EvidenceMatrixRow[];
  disclaimer: string;
}

export type HumanDecisionType =
  | 'ACCEPT_ASSESSMENT'
  | 'REQUEST_MORE_VERIFICATION'
  | 'REJECT_ASSESSMENT'
  | 'SEND_TO_FIELD_INSPECTION'
  | 'SEND_TO_LEGAL_REVIEW'
  | 'CLOSE_INSUFFICIENT_EVIDENCE'
  | 'CONFIRM_VIOLATION';

export interface HumanDecision {
  id: string;
  case_id: string;
  decision_type: HumanDecisionType;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  reason: string;
  analysis_run_id?: string;
  source_snapshot_json: string;
  created_at: string;
}

export interface AnalysisRun {
  id: string;
  case_id: string;
  created_at: string;
  created_by: string;
  model: string;
  prompt_version: string;
  fact_snapshot_json: string;
  legal_snapshot_json: string;
  output_json: string;
  validation_status: 'VALID' | 'REJECTED' | 'FAILED';
}

export interface Contractor {
  id: string;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  tax_id?: string;
  address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  code?: string;
  address: string;
  district: string;
  province?: string;
  latitude?: number;
  longitude?: number;
  contractor_id?: string;
  contractor_name?: string;
  owner_name?: string;
  status: 'PLANNING' | 'ACTIVE' | 'SUSPENDED' | 'COMPLETED';
  start_date?: string;
  end_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SetupStatusResponse {
  is_initialized: boolean;
  user_count: number;
  role_count: number;
  template_count: number;
  legal_corpus_count: number;
}


