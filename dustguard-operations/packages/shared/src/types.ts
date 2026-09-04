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
