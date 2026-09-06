import { z } from 'zod';

// Strict Evidence-Grounded Intelligence Output Schema
// SOURCE -> FACT -> EVIDENCE -> INFERENCE -> HUMAN DECISION
export const ConclusionLevelSchema = z.enum([
  'INSUFFICIENT_EVIDENCE',
  'PRELIMINARY',
  'SUPPORTED',
  'HUMAN_CONFIRMED',
]);

export const AnalysisFindingSchema = z.object({
  id: z.string().min(1),
  statement: z.string().min(3, 'Nội dung nhận định tối thiểu 3 ký tự'),
  source_ids: z.array(z.string()).min(1, 'Finding bắt buộc phải trích dẫn ít nhất 1 source_id thực tế'),
  legal_section_ids: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  requires_human_review: z.boolean().default(true),
});

export const MissingFactSchema = z.object({
  fact: z.string().min(1, 'Nội dung dữ kiện còn thiếu không được để trống'),
  reason_needed: z.string().min(1, 'Lý do cần xác minh không được để trống'),
  recommended_verification_action: z.string().min(1, 'Khuyến nghị hành động không được để trống'),
});

export const AnalysisRecommendedActionSchema = z.object({
  action_type: z.string().min(1),
  reason: z.string().min(1),
  source_ids: z.array(z.string()).default([]),
  requires_human_approval: z.boolean().default(true),
});

export const AnalysisOutputSchema = z.object({
  conclusion_level: ConclusionLevelSchema,
  findings: z.array(AnalysisFindingSchema),
  missing_facts: z.array(MissingFactSchema),
  recommended_actions: z.array(AnalysisRecommendedActionSchema),
  disclaimer: z.string().min(1, 'Khuyến cáo pháp lý bắt buộc'),
}).passthrough();

export type StrictAnalysisOutput = z.infer<typeof AnalysisOutputSchema>;

export const HumanDecisionSubmitSchema = z.object({
  decision_type: z.enum([
    'ACCEPT_ASSESSMENT',
    'REQUEST_MORE_VERIFICATION',
    'REJECT_ASSESSMENT',
    'SEND_TO_FIELD_INSPECTION',
    'SEND_TO_LEGAL_REVIEW',
    'CLOSE_INSUFFICIENT_EVIDENCE',
    'CONFIRM_VIOLATION',
  ]),
  reason: z.string().min(3, 'Lý do quyết định tối thiểu 3 ký tự'),
  analysis_run_id: z.string().optional(),
});

// Backward-compatible AI Output Schema
export const LegalAIPotentialIssueSchema = z.object({
  title: z.string().min(1, 'Tiêu đề vấn đề không được để trống'),
  reason: z.string().min(1, 'Lý do không được để trống'),
});

export const LegalAIRelevantProvisionSchema = z.object({
  legalSectionId: z.string().min(1, 'ID điều khoản pháp luật không được để trống'),
  reason: z.string().min(1, 'Căn cứ đối chiếu không được để trống'),
});

export const LegalAIOutputSchema = z.object({
  summary: z.string().min(1, 'Tóm tắt phân tích không được để trống'),
  potentialIssues: z.array(LegalAIPotentialIssueSchema),
  relevantProvisions: z.array(LegalAIRelevantProvisionSchema),
  missingInformation: z.array(z.string()),
  suggestedChecklistItems: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  disclaimer: z.string().min(1, 'Khuyến cáo pháp lý bắt buộc'),
  conclusion_level: ConclusionLevelSchema.optional(),
  findings: z.array(AnalysisFindingSchema).optional(),
  missing_facts: z.array(MissingFactSchema).optional(),
  recommended_actions: z.array(AnalysisRecommendedActionSchema).optional(),
});

export type LegalAIOutput = z.infer<typeof LegalAIOutputSchema>;

// Auth
export const LoginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

// Case Create & Transition
export const CaseCreateSchema = z.object({
  title: z.string().min(3, 'Tiêu đề vụ việc tối thiểu 3 ký tự'),
  description: z.string().min(5, 'Mô tả chi tiết tối thiểu 5 ký tự'),
  location_text: z.string().min(3, 'Địa chỉ hiện trường không được để trống'),
  district: z.string().min(2, 'Quận/Huyện không được để trống'),
  latitude: z.number(),
  longitude: z.number(),
  source: z.enum(['COMMUNITY', 'IOT', 'STAFF', 'MANUAL', 'IMPORT']).default('MANUAL'),
  source_reference: z.string().optional(),
  project_id: z.string().optional(),
  contractor_id: z.string().optional(),
  contractor_name: z.string().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
});

export const CaseTransitionSchema = z.object({
  to_status: z.enum([
    'NEW',
    'TRIAGED',
    'ASSIGNED',
    'LEGAL_REVIEW',
    'INSPECTION_PLANNED',
    'INSPECTION_IN_PROGRESS',
    'ACTION_REQUIRED',
    'REMEDIATION',
    'REINSPECTION',
    'READY_TO_CLOSE',
    'CLOSED',
    'REOPENED',
  ]),
  note: z.string().optional(),
  closure_reason: z.string().optional(),
  closure_summary: z.string().optional(),
  reopen_reason: z.string().optional(),
});

// Staff Assignment
export const CaseAssignSchema = z.object({
  staff_user_id: z.string().min(1, 'Vui lòng chọn cán bộ được phân công'),
  assignment_type: z.enum(['PRIMARY', 'COLLABORATOR', 'LEGAL_REVIEWER']).default('PRIMARY'),
  note: z.string().optional(),
  due_at: z.string().optional(),
});

// Legal Review
export const LegalReviewSchema = z.object({
  status: z.enum(['NOT_STARTED', 'IN_REVIEW', 'NEEDS_INFO', 'REVIEWED']),
  summary: z.string().min(5, 'Vui lòng nhập kết luận thẩm tra pháp lý'),
  legal_basis_note: z.string().optional(),
});

// Inspection
export const InspectionCreateSchema = z.object({
  case_id: z.string().min(1, 'Vui lòng chọn vụ việc'),
  template_id: z.string().min(1, 'Vui lòng chọn mẫu biên bản kiểm tra'),
  inspection_type: z.enum(['INITIAL', 'FOLLOW_UP', 'REINSPECTION']).default('INITIAL'),
  scheduled_date: z.string().min(1, 'Vui lòng chọn ngày dự kiến kiểm tra'),
  location_text: z.string().min(1, 'Vui lòng nhập địa điểm kiểm tra'),
  note: z.string().optional(),
});

export const InspectionSubmitItemSchema = z.object({
  item_id: z.string().min(1),
  status: z.enum(['PASS', 'FAIL', 'UNKNOWN', 'NOT_APPLICABLE']),
  note: z.string().optional(),
  evidence_asset_id: z.string().optional(),
});

export const InspectionSubmitSchema = z.object({
  items: z.array(InspectionSubmitItemSchema),
  note: z.string().optional(),
  override_reason: z.string().optional(),
});

// Finding
export const FindingCreateSchema = z.object({
  inspection_id: z.string().min(1),
  category: z.string().min(1, 'Danh mục không được để trống'),
  finding: z.string().min(3, 'Nội dung phát hiện không được để trống'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  legal_section_id: z.string().optional(),
  evidence_asset_id: z.string().optional(),
  staff_note: z.string().optional(),
});

// Corrective Action
export const CorrectiveActionCreateSchema = z.object({
  case_id: z.string().min(1),
  inspection_id: z.string().optional(),
  finding_id: z.string().optional(),
  title: z.string().min(3, 'Tiêu đề yêu cầu khắc phục không được để trống'),
  description: z.string().min(5, 'Nội dung khắc phục chi tiết không được để trống'),
  responsible_party: z.string().min(2, 'Đơn vị/Cá nhân chịu trách nhiệm không được để trống'),
  due_at: z.string().min(1, 'Hạn chót hoàn thành không được để trống'),
});

// Remediation
export const RemediationSubmitSchema = z.object({
  description: z.string().min(5, 'Vui lòng mô tả biện pháp và kết quả đã khắc phục'),
  evidence_asset_ids: z.union([z.string(), z.array(z.string())]).optional(),
});

export const RemediationReviewSchema = z.object({
  review_status: z.enum(['APPROVED', 'REJECTED', 'MORE_EVIDENCE_REQUESTED']),
  review_note: z.string().min(3, 'Vui lòng nhập nhận xét thẩm định khắc phục'),
});

// Case Closure
export const CaseClosureSchema = z.object({
  closure_reason: z.string().min(3, 'Vui lòng chọn hoặc nhập lý do kết thúc vụ việc'),
  closure_summary: z.string().min(5, 'Vui lòng nhập tóm tắt kết quả xử lý và căn cứ đóng hồ sơ'),
});

export const CaseReopenSchema = z.object({
  reopen_reason: z.string().min(5, 'Vui lòng nhập lý do mở lại hồ sơ vụ việc'),
});

// Community Case Import Schema (Section 72)
export const CommunityCaseImportSchema = z.object({
  external_case_id: z.string().min(1, 'external_case_id là bắt buộc'),
  case_code: z.string().optional(),
  title: z.string().min(1, 'title là bắt buộc'),
  summary: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  location_text: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  report_count: z.number().default(1),
  confirmation_count: z.number().default(0),
  contractor_name: z.string().optional(),
  reports: z.array(z.any()).optional().default([]),
  evidence: z
    .array(
      z.object({
        filename: z.string().optional(),
        file_path: z.string().optional(),
        mime_type: z.string().optional(),
        sha256: z.string().optional(),
      })
    )
    .optional()
    .default([]),
  timeline: z
    .array(
      z.object({
        event: z.string(),
        time: z.string().optional(),
        note: z.string().optional(),
      })
    )
    .optional()
    .default([]),
});

// Community Citizen Feedback Schema (cross-side handoff)
export const CommunityFeedbackSchema = z.object({
  external_case_id: z.string().optional(),
  case_code: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
  is_satisfied: z.boolean().optional(),
  request_reinspection: z.boolean().optional(),
  user_name: z.string().optional(),
}).refine(data => !!(data.external_case_id || data.case_code), {
  message: 'external_case_id hoặc case_code là bắt buộc để định danh hồ sơ',
});

// Signals (field-reported / IoT-adjacent observations that may become cases)
export const SignalCreateSchema = z.object({
  source_type: z.enum(['STAFF', 'COMMUNITY', 'IOT', 'IMPORT']).default('STAFF'),
  external_source_id: z.string().optional(),
  signal_type: z.string().min(1, 'Loại tín hiệu không được để trống'),
  title: z.string().min(3, 'Tiêu đề tối thiểu 3 ký tự'),
  description: z.string().optional().default(''),
  location_text: z.string().min(3, 'Địa điểm không được để trống'),
  latitude: z.number(),
  longitude: z.number(),
  observed_at: z.string().optional(),
  payload_json: z.string().optional(),
});

// Public citizen report intake — no auth, so this is the only gate on what
// reaches the signals table from the open internet; kept intentionally strict.
export const PublicReportSchema = z.object({
  title: z.string().min(3, 'Vui lòng nhập tiêu đề phản ánh (tối thiểu 3 ký tự)').max(300),
  description: z.string().max(5000).optional().default(''),
  location_text: z.string().min(3, 'Vui lòng nhập địa điểm phản ánh').max(500),
  latitude: z.number().min(-90).max(90).optional().default(10.7769),
  longitude: z.number().min(-180).max(180).optional().default(106.7009),
  project_id: z.string().optional(),
  reporter_name: z.string().max(200).optional().default('Người dân'),
  reporter_phone: z.string().max(30).optional(),
  photos: z.array(z.string()).max(20).optional().default([]),
});

export const SignalLinkCaseSchema = z.object({
  case_id: z.string().min(1, 'case_id là bắt buộc'),
  notes: z.string().optional().default(''),
});

export const SignalCreateCaseSchema = z.object({
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  assigned_staff_id: z.string().optional(),
  project_id: z.string().optional(),
  contractor_id: z.string().optional(),
  contractor_name: z.string().optional(),
});

// Tasks
export const TaskCreateSchema = z.object({
  case_id: z.string().optional(),
  title: z.string().min(3, 'Tiêu đề nhiệm vụ tối thiểu 3 ký tự'),
  description: z.string().optional().default(''),
  task_type: z.string().optional().default('GENERAL'),
  source: z.string().optional().default('MANUAL'),
  source_entity_type: z.string().optional(),
  source_entity_id: z.string().optional(),
  assigned_to: z.string().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  due_at: z.string().optional(),
});

export const TaskUpdateSchema = z.object({
  status: z.string().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  due_at: z.string().optional(),
  assigned_to: z.string().nullable().optional(),
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  task_type: z.string().optional(),
});

// Decision Support — missing-fact follow-up task
export const MissingFactTaskCreateSchema = z.object({
  fact: z.string().min(1, 'Nội dung dữ kiện cần xác minh không được để trống'),
  reason_needed: z.string().optional(),
  recommended_verification_action: z.string().optional(),
  priority: z.enum(['NORMAL', 'URGENT']).default('NORMAL'),
});

// Decision Support — append-only human decision record (distinct shape from
// HumanDecisionSubmitSchema, which is the /cases/:id/decisions variant)
export const HumanDecisionRecordSchema = z.object({
  decisionType: z.string().min(1, 'decisionType là bắt buộc'),
  reason: z.string().min(3, 'Lý do / căn cứ tối thiểu 3 ký tự'),
  references: z.array(z.any()).optional(),
  supersedesDecisionId: z.string().optional(),
});

// Corrective Actions — partial update
export const CorrectiveActionUpdateSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'SUBMITTED', 'VERIFIED', 'REJECTED', 'CLOSED']).optional(),
  title: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  responsible_party: z.string().min(2).optional(),
  due_at: z.string().optional(),
});
