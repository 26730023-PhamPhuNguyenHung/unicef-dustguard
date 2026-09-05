-- DUSTGUARD OPERATIONS SQLite SCHEMA
PRAGMA foreign_keys = ON;

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
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

-- 2. Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- 2b. Contractors (Đơn vị thi công / Nhà thầu / Chủ nguồn thải)
CREATE TABLE IF NOT EXISTS contractors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  tax_id TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 2c. Projects / Construction Sites (Công trình xây dựng đô thị)
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  province TEXT NOT NULL DEFAULT 'TP. Hồ Chí Minh',
  latitude REAL,
  longitude REAL,
  contractor_id TEXT REFERENCES contractors(id) ON DELETE SET NULL,
  contractor_name TEXT,
  project_owner TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'COMPLETED', 'PLANNED')),
  start_date TEXT,
  end_date TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 3. Cases (SSOT)
CREATE TABLE IF NOT EXISTS cases (
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
  assigned_staff_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  contractor_id TEXT REFERENCES contractors(id) ON DELETE SET NULL,
  contractor_name TEXT,
  priority TEXT NOT NULL DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  closed_at TEXT
);

-- 4. Case Timeline (Chronological SSOT)
CREATE TABLE IF NOT EXISTS case_timeline (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  actor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  actor_name TEXT,
  actor_role TEXT,
  stage TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata_json TEXT,
  created_at TEXT NOT NULL
);

-- 5. Staff Assignments
CREATE TABLE IF NOT EXISTS staff_assignments (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  staff_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assignment_type TEXT NOT NULL DEFAULT 'PRIMARY' CHECK (assignment_type IN ('PRIMARY', 'COLLABORATOR', 'LEGAL_REVIEWER')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'REPLACED')),
  note TEXT,
  assigned_at TEXT NOT NULL,
  due_at TEXT,
  completed_at TEXT
);

-- 6. Evidence Assets
CREATE TABLE IF NOT EXISTS evidence_assets (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('CASE', 'INSPECTION', 'FINDING', 'REMEDIATION')),
  source_id TEXT,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  sha256 TEXT NOT NULL,
  integrity_status TEXT NOT NULL DEFAULT 'UNVERIFIED' CHECK (integrity_status IN ('UNVERIFIED', 'VERIFIED', 'TAMPERED', 'FILE_MISSING')),
  uploaded_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  captured_at TEXT,
  created_at TEXT NOT NULL
);

-- 7. Legal Documents
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

-- 8. Legal Sections
CREATE TABLE IF NOT EXISTS legal_sections (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES legal_documents(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL CHECK (section_type IN ('Chapter', 'Article', 'Clause', 'Point', 'Section')),
  section_number TEXT NOT NULL,
  heading TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_section_id TEXT REFERENCES legal_sections(id) ON DELETE SET NULL
);

-- 9. SQLite FTS5 Virtual Table for Legal Search
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

-- 10. Legal Search History
CREATE TABLE IF NOT EXISTS legal_search_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  results_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

-- 11. Legal Analyses (AI History)
CREATE TABLE IF NOT EXISTS legal_analyses (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_version TEXT NOT NULL,
  input_snapshot TEXT NOT NULL,
  output_json TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL
);

-- 12. Legal Reviews (Human Legal Review SSOT)
CREATE TABLE IF NOT EXISTS legal_reviews (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  reviewer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_REVIEW', 'NEEDS_INFO', 'REVIEWED')),
  summary TEXT NOT NULL,
  legal_basis_note TEXT,
  created_at TEXT NOT NULL,
  reviewed_at TEXT
);

-- 13. Inspection Templates
CREATE TABLE IF NOT EXISTS inspection_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

-- 14. Inspection Template Items
CREATE TABLE IF NOT EXISTS inspection_template_items (
  id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL REFERENCES inspection_templates(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  description TEXT,
  required INTEGER NOT NULL DEFAULT 1,
  legal_section_id TEXT REFERENCES legal_sections(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- 15. Inspections
CREATE TABLE IF NOT EXISTS inspections (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  inspector_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- 16. Inspection Items
CREATE TABLE IF NOT EXISTS inspection_items (
  id TEXT PRIMARY KEY,
  inspection_id TEXT NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  template_item_id TEXT REFERENCES inspection_template_items(id) ON DELETE SET NULL,
  label TEXT NOT NULL,
  legal_section_id TEXT REFERENCES legal_sections(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'UNKNOWN' CHECK (status IN ('PASS', 'FAIL', 'UNKNOWN', 'NOT_APPLICABLE')),
  note TEXT,
  evidence_asset_id TEXT REFERENCES evidence_assets(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- 17. Inspection Findings
CREATE TABLE IF NOT EXISTS inspection_findings (
  id TEXT PRIMARY KEY,
  inspection_id TEXT NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  finding TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
  legal_section_id TEXT REFERENCES legal_sections(id) ON DELETE SET NULL,
  evidence_asset_id TEXT REFERENCES evidence_assets(id) ON DELETE SET NULL,
  staff_note TEXT,
  created_at TEXT NOT NULL
);

-- 18. Corrective Actions
CREATE TABLE IF NOT EXISTS corrective_actions (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  inspection_id TEXT REFERENCES inspections(id) ON DELETE SET NULL,
  finding_id TEXT REFERENCES inspection_findings(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  responsible_party TEXT NOT NULL,
  due_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'SUBMITTED', 'VERIFIED', 'REJECTED', 'CLOSED')),
  created_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  completed_at TEXT
);

-- 19. Remediation Submissions
CREATE TABLE IF NOT EXISTS remediation_submissions (
  id TEXT PRIMARY KEY,
  corrective_action_id TEXT NOT NULL REFERENCES corrective_actions(id) ON DELETE CASCADE,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  submitted_by TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_asset_ids TEXT,
  review_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (review_status IN ('PENDING', 'APPROVED', 'REJECTED', 'MORE_EVIDENCE_REQUESTED')),
  review_note TEXT,
  reviewed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  submitted_at TEXT NOT NULL,
  reviewed_at TEXT
);

-- 20. Case Closures
CREATE TABLE IF NOT EXISTS case_closures (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  closed_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  closure_reason TEXT NOT NULL,
  closure_summary TEXT NOT NULL,
  closed_at TEXT NOT NULL
);

-- 21. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

-- 22. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata_json TEXT,
  ip_address TEXT,
  created_at TEXT NOT NULL
);

-- 23. System Configs
CREATE TABLE IF NOT EXISTS system_configs (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  description TEXT,
  updated_at TEXT NOT NULL
);

-- 24. Integration Logs (Community Intake Idempotency)
CREATE TABLE IF NOT EXISTS integration_logs (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  external_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'ERROR', 'IGNORED')),
  payload_hash TEXT NOT NULL,
  processed_at TEXT NOT NULL,
  error TEXT
);

-- 25. Signals (Multi-source Environmental Observations)
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

-- 26. Case Signals (N-to-N Linkage between Cases & Signals)
CREATE TABLE IF NOT EXISTS case_signals (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  signal_id TEXT NOT NULL REFERENCES signals(id) ON DELETE CASCADE,
  linked_at TEXT NOT NULL,
  linked_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  UNIQUE(case_id, signal_id)
);

-- 27. Tasks (DB-derived Work Items with Deep Links)
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  case_id TEXT REFERENCES cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  task_type TEXT NOT NULL DEFAULT 'GENERAL' CHECK (task_type IN ('TRIAGE', 'VERIFICATION', 'FIELD_VERIFY', 'LEGAL_REVIEW', 'CHECKLIST_PREP', 'FIELD_INSPECTION', 'EVIDENCE_COLLECTION', 'CONTRACTOR_LIAISON', 'REMEDIATION_FOLLOWUP', 'REINSPECTION', 'DOSSIER_COMPLETION', 'CLOSURE_APPROVAL', 'GENERAL')),
  source TEXT NOT NULL CHECK (source IN ('MANUAL', 'CASE', 'LEGAL', 'INSPECTION', 'IOT', 'AUTOMATION')),
  source_entity_type TEXT,
  source_entity_id TEXT,
  assigned_to TEXT REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'TODO' CHECK (status IN ('TODO', 'OPEN', 'IN_PROGRESS', 'BLOCKED', 'WAITING', 'DONE', 'COMPLETED', 'CANCELLED')),
  priority TEXT NOT NULL DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
  due_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  completed_at TEXT
);

-- 28. IoT Devices (Monitoring Node Registry)
CREATE TABLE IF NOT EXISTS iot_devices (
  id TEXT PRIMARY KEY,
  device_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  location_text TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'ONLINE' CHECK (status IN ('ONLINE', 'OFFLINE', 'FAULTY', 'UNKNOWN')),
  last_seen_at TEXT,
  firmware_version TEXT DEFAULT '1.0.0',
  secret_reference TEXT NOT NULL,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  is_simulated INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 29. IoT Readings (Sensor Packets with Integrity Evaluation)
CREATE TABLE IF NOT EXISTS iot_readings (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL REFERENCES iot_devices(id) ON DELETE CASCADE,
  recorded_at TEXT NOT NULL,
  received_at TEXT NOT NULL,
  pm25 REAL NOT NULL,
  pm10 REAL NOT NULL,
  temperature REAL,
  humidity REAL,
  raw_payload_json TEXT NOT NULL,
  integrity_status TEXT NOT NULL DEFAULT 'VALID' CHECK (integrity_status IN ('VALID', 'FLATLINE', 'CORRUPTED', 'CLOCK_DRIFT')),
  created_at TEXT NOT NULL
);

-- 30. IoT Events (Tamper, Flatline & Connectivity Logs)
CREATE TABLE IF NOT EXISTS iot_events (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL REFERENCES iot_devices(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('OFFLINE', 'FLATLINE', 'TAMPER', 'RECONNECTED', 'SPIKE')),
  severity TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
  description TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- 31. Automation Rules (Event-Driven Workflow Automation Engine)
CREATE TABLE IF NOT EXISTS automation_rules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  conditions_json TEXT NOT NULL,
  actions_json TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 32. Automation Runs (Immutable Run History for Traceability)
CREATE TABLE IF NOT EXISTS automation_runs (
  id TEXT PRIMARY KEY,
  rule_id TEXT NOT NULL REFERENCES automation_rules(id) ON DELETE CASCADE,
  trigger_entity_type TEXT NOT NULL,
  trigger_entity_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'SKIPPED')),
  input_json TEXT NOT NULL,
  result_json TEXT,
  error_message TEXT,
  started_at TEXT NOT NULL,
  completed_at TEXT
);

-- 33. Analysis Runs (Immutable Snapshots for AI/Rule Intelligence Provenance)
CREATE TABLE IF NOT EXISTS analysis_runs (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  prompt_version TEXT NOT NULL,
  fact_snapshot_json TEXT NOT NULL,
  legal_snapshot_json TEXT NOT NULL,
  output_json TEXT NOT NULL,
  validation_status TEXT NOT NULL CHECK (validation_status IN ('VALID', 'REJECTED', 'FAILED'))
);

-- 34. Human Decisions (Authoritative Human Decision Layer SSOT)
CREATE TABLE IF NOT EXISTS human_decisions (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  decision_type TEXT NOT NULL CHECK (decision_type IN (
    'ACCEPT_ASSESSMENT',
    'REQUEST_MORE_VERIFICATION',
    'REJECT_ASSESSMENT',
    'SEND_TO_FIELD_INSPECTION',
    'SEND_TO_LEGAL_REVIEW',
    'CLOSE_INSUFFICIENT_EVIDENCE',
    'CONFIRM_VIOLATION'
  )),
  actor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  reason TEXT NOT NULL,
  analysis_run_id TEXT REFERENCES analysis_runs(id) ON DELETE SET NULL,
  source_snapshot_json TEXT NOT NULL,
  supersedes_decision_id TEXT REFERENCES human_decisions(id) ON DELETE SET NULL,
  references_json TEXT,
  created_at TEXT NOT NULL
);

-- 35. Decision Support Runs (Immutable Provenance Snapshot for Evidence-Grounded Engine)
CREATE TABLE IF NOT EXISTS decision_support_runs (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  engine_version TEXT NOT NULL,
  rule_set_version TEXT NOT NULL,
  legal_corpus_version TEXT NOT NULL,
  assessment_status TEXT NOT NULL,
  certainty TEXT NOT NULL,
  risk_score REAL NOT NULL,
  risk_confidence REAL NOT NULL,
  facts_json TEXT NOT NULL,
  evidence_matrix_json TEXT NOT NULL,
  rule_trace_json TEXT NOT NULL,
  contradictions_json TEXT NOT NULL,
  missing_facts_json TEXT NOT NULL,
  recommended_actions_json TEXT NOT NULL,
  validation_status TEXT NOT NULL CHECK (validation_status IN ('VALID', 'REJECTED', 'FAILED'))
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_assigned_staff ON cases(assigned_staff_id);
CREATE INDEX IF NOT EXISTS idx_cases_district ON cases(district);
CREATE INDEX IF NOT EXISTS idx_timeline_case_id ON case_timeline(case_id);
CREATE INDEX IF NOT EXISTS idx_assignments_case_id ON staff_assignments(case_id);
CREATE INDEX IF NOT EXISTS idx_assignments_staff ON staff_assignments(staff_user_id);
CREATE INDEX IF NOT EXISTS idx_evidence_case_id ON evidence_assets(case_id);
CREATE INDEX IF NOT EXISTS idx_evidence_sha256 ON evidence_assets(sha256);
CREATE INDEX IF NOT EXISTS idx_inspections_case_id ON inspections(case_id);
CREATE INDEX IF NOT EXISTS idx_actions_case_id ON corrective_actions(case_id);
CREATE INDEX IF NOT EXISTS idx_actions_status_due ON corrective_actions(status, due_at);
CREATE INDEX IF NOT EXISTS idx_findings_inspection_id ON inspection_findings(inspection_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_integration_external ON integration_logs(source, external_id);
CREATE INDEX IF NOT EXISTS idx_signals_source ON signals(source_type);
CREATE INDEX IF NOT EXISTS idx_case_signals_case ON case_signals(case_id);
CREATE INDEX IF NOT EXISTS idx_case_signals_signal ON case_signals(signal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to, status);
CREATE INDEX IF NOT EXISTS idx_tasks_case_id ON tasks(case_id);
CREATE INDEX IF NOT EXISTS idx_iot_readings_device ON iot_readings(device_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_iot_events_device ON iot_events(device_id, created_at);
CREATE INDEX IF NOT EXISTS idx_automation_runs_rule ON automation_runs(rule_id, started_at);
CREATE INDEX IF NOT EXISTS idx_analysis_runs_case ON analysis_runs(case_id, created_at);
CREATE INDEX IF NOT EXISTS idx_decision_runs_case ON decision_support_runs(case_id, created_at);
CREATE INDEX IF NOT EXISTS idx_human_decisions_case ON human_decisions(case_id, created_at);
CREATE INDEX IF NOT EXISTS idx_cases_code ON cases(case_code);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at);
CREATE INDEX IF NOT EXISTS idx_cases_project ON cases(project_id);
CREATE INDEX IF NOT EXISTS idx_cases_contractor ON cases(contractor_id);
CREATE INDEX IF NOT EXISTS idx_projects_contractor ON projects(contractor_id);


