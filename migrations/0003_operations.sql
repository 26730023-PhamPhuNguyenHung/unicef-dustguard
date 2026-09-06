-- ==============================================================================
-- DUSTGUARD VN — MIGRATION 0003: OPERATIONS SCHEMA (SIDE B)
-- Hồ sơ thụ lý, thanh tra hiện trường, căn cứ pháp lý, lệnh khắc phục & nghiệm thu
-- ==============================================================================

-- 1. Cán bộ thanh tra & điều hành (Operations Staff & Supervisors)
CREATE TABLE IF NOT EXISTS ops_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('staff', 'supervisor', 'legal_reviewer', 'admin')),
  department TEXT NOT NULL,
  phone TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

-- 2. Phiên làm việc cán bộ (Operations Sessions)
CREATE TABLE IF NOT EXISTS ops_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES ops_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- 3. Hồ sơ thụ lý chuyên trách (Operations Enforcement Cases)
CREATE TABLE IF NOT EXISTS ops_cases (
  id TEXT PRIMARY KEY,
  case_code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location_text TEXT NOT NULL,
  district TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  source TEXT NOT NULL DEFAULT 'MANUAL' CHECK (source IN ('COMMUNITY', 'IOT', 'MANUAL', 'IMPORT', 'STAFF')),
  source_reference TEXT,
  source_report_count INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN (
    'NEW', 'TRIAGED', 'ASSIGNED', 'LEGAL_REVIEW', 'INSPECTION_PLANNED',
    'INSPECTION_IN_PROGRESS', 'ACTION_REQUIRED', 'REMEDIATION',
    'REINSPECTION', 'READY_TO_CLOSE', 'CLOSED', 'REOPENED'
  )),
  assigned_staff_id TEXT REFERENCES ops_users(id) ON DELETE SET NULL,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  contractor_id TEXT REFERENCES contractors(id) ON DELETE SET NULL,
  contractor_name TEXT,
  priority TEXT NOT NULL DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  closed_at TEXT
);

-- 4. Tiến trình thụ lý hồ sơ (Case Timeline SSOT)
CREATE TABLE IF NOT EXISTS ops_case_timeline (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES ops_cases(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  actor_id TEXT REFERENCES ops_users(id) ON DELETE SET NULL,
  actor_name TEXT,
  actor_role TEXT,
  stage TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata_json TEXT,
  created_at TEXT NOT NULL
);

-- 5. Phân công cán bộ thụ lý (Staff Assignments)
CREATE TABLE IF NOT EXISTS ops_staff_assignments (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES ops_cases(id) ON DELETE CASCADE,
  staff_user_id TEXT NOT NULL REFERENCES ops_users(id) ON DELETE CASCADE,
  assigned_by TEXT NOT NULL REFERENCES ops_users(id) ON DELETE CASCADE,
  assignment_type TEXT NOT NULL DEFAULT 'PRIMARY' CHECK (assignment_type IN ('PRIMARY', 'COLLABORATOR', 'LEGAL_REVIEWER')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'REPLACED')),
  note TEXT,
  assigned_at TEXT NOT NULL,
  due_at TEXT,
  completed_at TEXT
);

-- 6. Minh chứng số niêm phong SHA-256 (Evidence Assets)
CREATE TABLE IF NOT EXISTS ops_evidence_assets (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES ops_cases(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('CASE', 'INSPECTION', 'FINDING', 'REMEDIATION')),
  source_id TEXT,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  sha256 TEXT NOT NULL,
  integrity_status TEXT NOT NULL DEFAULT 'UNVERIFIED' CHECK (integrity_status IN ('UNVERIFIED', 'VERIFIED', 'TAMPERED', 'FILE_MISSING')),
  uploaded_by TEXT NOT NULL REFERENCES ops_users(id) ON DELETE CASCADE,
  captured_at TEXT,
  created_at TEXT NOT NULL
);

-- 7. Văn bản pháp luật môi trường (Legal Documents)
CREATE TABLE IF NOT EXISTS legal_documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  document_number TEXT NOT NULL,
  authority TEXT NOT NULL,
  issued_date TEXT NOT NULL,
  effective_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'REPLACED')),
  source_url TEXT,
  file_path TEXT,
  checksum TEXT,
  created_at TEXT NOT NULL
);

-- 8. Điều khoản quy chuẩn (Legal Sections)
CREATE TABLE IF NOT EXISTS legal_sections (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES legal_documents(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL CHECK (section_type IN ('Chapter', 'Article', 'Clause', 'Point', 'Section')),
  section_number TEXT NOT NULL,
  heading TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_section_id TEXT REFERENCES legal_sections(id) ON DELETE SET NULL
);

-- 9. Bảng tìm kiếm pháp lý toàn văn FTS5 (Legal Full-Text Search)
CREATE VIRTUAL TABLE IF NOT EXISTS legal_sections_fts USING fts5(
  id UNINDEXED,
  document_id UNINDEXED,
  document_title,
  document_number,
  heading,
  section_number,
  content,
  tokenize = 'unicode61'
);

-- 10. Lịch sử tra cứu pháp lý
CREATE TABLE IF NOT EXISTS legal_search_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES ops_users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  results_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

-- 11. Phân tích pháp lý số hóa (Legal Analyses)
CREATE TABLE IF NOT EXISTS legal_analyses (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES ops_cases(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_version TEXT NOT NULL,
  input_snapshot TEXT NOT NULL,
  output_json TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES ops_users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL
);

-- 12. Thẩm tra pháp lý cán bộ (Human Legal Review)
CREATE TABLE IF NOT EXISTS legal_reviews (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES ops_cases(id) ON DELETE CASCADE,
  reviewer_id TEXT NOT NULL REFERENCES ops_users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_REVIEW', 'NEEDS_INFO', 'REVIEWED')),
  summary TEXT NOT NULL,
  legal_basis_note TEXT,
  created_at TEXT NOT NULL,
  reviewed_at TEXT
);

-- 13. Mẫu biên bản kiểm tra thực địa (Inspection Templates)
CREATE TABLE IF NOT EXISTS inspection_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

-- 14. Hạng mục kiểm tra tiêu chuẩn (Template Items)
CREATE TABLE IF NOT EXISTS inspection_template_items (
  id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL REFERENCES inspection_templates(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  description TEXT,
  required INTEGER NOT NULL DEFAULT 1,
  legal_section_id TEXT REFERENCES legal_sections(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- 15. Kế hoạch & Phiếu kiểm tra hiện trường (Inspections)
CREATE TABLE IF NOT EXISTS inspections (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES ops_cases(id) ON DELETE CASCADE,
  inspector_id TEXT NOT NULL REFERENCES ops_users(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL REFERENCES inspection_templates(id) ON DELETE CASCADE,
  inspection_type TEXT NOT NULL DEFAULT 'INITIAL' CHECK (inspection_type IN ('INITIAL', 'FOLLOW_UP', 'REINSPECTION')),
  scheduled_date TEXT NOT NULL,
  performed_at TEXT,
  status TEXT NOT NULL DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  location_text TEXT NOT NULL,
  note TEXT,
  override_reason TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 16. Chi tiết đánh giá từng tiêu chí (Inspection Items)
CREATE TABLE IF NOT EXISTS inspection_items (
  id TEXT PRIMARY KEY,
  inspection_id TEXT NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  template_item_id TEXT REFERENCES inspection_template_items(id) ON DELETE SET NULL,
  label TEXT NOT NULL,
  legal_section_id TEXT REFERENCES legal_sections(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'UNKNOWN' CHECK (status IN ('PASS', 'FAIL', 'UNKNOWN', 'NOT_APPLICABLE')),
  note TEXT,
  evidence_asset_id TEXT REFERENCES ops_evidence_assets(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- 17. Hành vi vi phạm ghi nhận thực tế (Inspection Findings)
CREATE TABLE IF NOT EXISTS inspection_findings (
  id TEXT PRIMARY KEY,
  inspection_id TEXT NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  case_id TEXT NOT NULL REFERENCES ops_cases(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  finding TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
  legal_section_id TEXT REFERENCES legal_sections(id) ON DELETE SET NULL,
  evidence_asset_id TEXT REFERENCES ops_evidence_assets(id) ON DELETE SET NULL,
  staff_note TEXT,
  created_at TEXT NOT NULL
);

-- 18. Lệnh yêu cầu khắc phục vi phạm (Corrective Actions)
CREATE TABLE IF NOT EXISTS corrective_actions (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES ops_cases(id) ON DELETE CASCADE,
  inspection_id TEXT REFERENCES inspections(id) ON DELETE SET NULL,
  finding_id TEXT REFERENCES inspection_findings(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  responsible_party TEXT NOT NULL,
  due_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'SUBMITTED', 'VERIFIED', 'REJECTED', 'CLOSED')),
  created_by TEXT NOT NULL REFERENCES ops_users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  completed_at TEXT
);

-- 19. Báo cáo khắc phục của nhà thầu (Remediation Submissions)
CREATE TABLE IF NOT EXISTS remediation_submissions (
  id TEXT PRIMARY KEY,
  corrective_action_id TEXT NOT NULL REFERENCES corrective_actions(id) ON DELETE CASCADE,
  case_id TEXT NOT NULL REFERENCES ops_cases(id) ON DELETE CASCADE,
  submitted_by TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_asset_ids TEXT,
  review_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (review_status IN ('PENDING', 'APPROVED', 'REJECTED', 'MORE_EVIDENCE_REQUESTED')),
  review_note TEXT,
  reviewed_by TEXT REFERENCES ops_users(id) ON DELETE SET NULL,
  submitted_at TEXT NOT NULL,
  reviewed_at TEXT
);

-- 20. Biên bản đóng hồ sơ & Lý do nghiệm thu (Case Closures)
CREATE TABLE IF NOT EXISTS case_closures (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES ops_cases(id) ON DELETE CASCADE,
  closed_by TEXT NOT NULL REFERENCES ops_users(id) ON DELETE CASCADE,
  closure_reason TEXT NOT NULL,
  closure_summary TEXT NOT NULL,
  closed_at TEXT NOT NULL
);

-- 21. Tín hiệu ô nhiễm đa nguồn (Signals)
CREATE TABLE IF NOT EXISTS signals (
  id TEXT PRIMARY KEY,
  source_type TEXT NOT NULL CHECK (source_type IN ('COMMUNITY', 'IOT', 'STAFF', 'IMPORT')),
  external_source_id TEXT,
  signal_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location_text TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  observed_at TEXT NOT NULL,
  received_at TEXT NOT NULL,
  payload_json TEXT,
  integrity_status TEXT NOT NULL DEFAULT 'VALID' CHECK (integrity_status IN ('VALID', 'SUSPICIOUS', 'CORRUPTED')),
  created_at TEXT NOT NULL
);

-- 22. Liên kết hồ sơ và tín hiệu (Case - Signals M2M)
CREATE TABLE IF NOT EXISTS case_signals (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES ops_cases(id) ON DELETE CASCADE,
  signal_id TEXT NOT NULL REFERENCES signals(id) ON DELETE CASCADE,
  linked_at TEXT NOT NULL,
  linked_by TEXT REFERENCES ops_users(id) ON DELETE SET NULL,
  notes TEXT,
  UNIQUE(case_id, signal_id)
);

-- 23. Danh sách công việc điều phối cán bộ (Operations Tasks)
CREATE TABLE IF NOT EXISTS ops_tasks (
  id TEXT PRIMARY KEY,
  case_id TEXT REFERENCES ops_cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  task_type TEXT NOT NULL DEFAULT 'GENERAL' CHECK (task_type IN ('TRIAGE', 'VERIFICATION', 'FIELD_VERIFY', 'LEGAL_REVIEW', 'CHECKLIST_PREP', 'FIELD_INSPECTION', 'EVIDENCE_COLLECTION', 'CONTRACTOR_LIAISON', 'REMEDIATION_FOLLOWUP', 'REINSPECTION', 'DOSSIER_COMPLETION', 'CLOSURE_APPROVAL', 'GENERAL')),
  source TEXT NOT NULL CHECK (source IN ('MANUAL', 'CASE', 'LEGAL', 'INSPECTION', 'IOT', 'AUTOMATION')),
  source_entity_type TEXT,
  source_entity_id TEXT,
  assigned_to TEXT REFERENCES ops_users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'TODO' CHECK (status IN ('TODO', 'OPEN', 'IN_PROGRESS', 'BLOCKED', 'WAITING', 'DONE', 'COMPLETED', 'CANCELLED')),
  priority TEXT NOT NULL DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
  due_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  completed_at TEXT
);

-- 24. Thiết bị cảm biến IoT giám sát bụi (IoT Devices)
CREATE TABLE IF NOT EXISTS iot_devices (
  id TEXT PRIMARY KEY,
  device_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  location_text TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'ONLINE' CHECK (status IN ('ONLINE', 'OFFLINE', 'MAINTENANCE', 'WARNING')),
  last_reading_at TEXT,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL
);

-- 25. Dữ liệu chỉ số bụi quan trắc (IoT Readings)
CREATE TABLE IF NOT EXISTS iot_readings (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL REFERENCES iot_devices(id) ON DELETE CASCADE,
  timestamp TEXT NOT NULL,
  pm25 REAL NOT NULL,
  pm10 REAL NOT NULL,
  temperature REAL,
  humidity REAL,
  created_at TEXT NOT NULL
);

-- 26. Sự kiện cảnh báo nồng độ vượt ngưỡng (IoT Events)
CREATE TABLE IF NOT EXISTS iot_events (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL REFERENCES iot_devices(id) ON DELETE CASCADE,
  case_id TEXT REFERENCES ops_cases(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  value REAL NOT NULL,
  threshold REAL NOT NULL,
  message TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  acknowledged INTEGER NOT NULL DEFAULT 0
);

-- 27. Quy tắc kích hoạt tự động (Automation Rules)
CREATE TABLE IF NOT EXISTS automation_rules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('IOT_THRESHOLD', 'COMMUNITY_SPIKE', 'SCHEDULED_AUDIT')),
  condition_json TEXT NOT NULL,
  action_json TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 28. Nhật ký thực thi quy tắc tự động (Automation Rule Runs)
CREATE TABLE IF NOT EXISTS automation_rule_runs (
  id TEXT PRIMARY KEY,
  rule_id TEXT NOT NULL REFERENCES automation_rules(id) ON DELETE CASCADE,
  triggered_at TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'SKIPPED')),
  result_json TEXT
);

-- 29. Quyết định hành chính & Trách nhiệm giải trình (Human Decisions)
CREATE TABLE IF NOT EXISTS human_decisions (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES ops_cases(id) ON DELETE CASCADE,
  decider_id TEXT NOT NULL REFERENCES ops_users(id) ON DELETE CASCADE,
  decision_type TEXT NOT NULL,
  justification TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'CONFIRMED', 'OVERRULED')),
  supersedes_decision_id TEXT REFERENCES human_decisions(id) ON DELETE SET NULL,
  references_json TEXT,
  created_at TEXT NOT NULL
);

-- 30. Nhật ký kiểm tra tính toàn vẹn minh chứng số (Evidence Integrity Logs)
CREATE TABLE IF NOT EXISTS evidence_integrity_logs (
  id TEXT PRIMARY KEY,
  evidence_asset_id TEXT NOT NULL REFERENCES ops_evidence_assets(id) ON DELETE CASCADE,
  verified_at TEXT NOT NULL,
  checked_by TEXT NOT NULL REFERENCES ops_users(id) ON DELETE CASCADE,
  check_result TEXT NOT NULL CHECK (check_result IN ('MATCH', 'MISMATCH', 'FILE_UNAVAILABLE')),
  stored_hash TEXT NOT NULL,
  computed_hash TEXT NOT NULL,
  log_note TEXT
);
