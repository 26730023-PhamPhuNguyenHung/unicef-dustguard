-- ==============================================================================
-- DUSTGUARD VN — MIGRATION 0005: PERFORMANCE INDEXES & CONSTRAINTS
-- Tối ưu hóa truy vấn không gian WGS84, chỉ mục khóa ngoại & bảo toàn toàn vẹn
-- ==============================================================================

-- 1. Chỉ mục Phía Cộng đồng (Side A Indexes)
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
CREATE INDEX IF NOT EXISTS users_status_idx ON users(status);
CREATE INDEX IF NOT EXISTS cases_status_idx ON cases(status);
CREATE INDEX IF NOT EXISTS cases_created_at_idx ON cases(created_at);
CREATE INDEX IF NOT EXISTS cases_geo_idx ON cases(latitude, longitude);
CREATE INDEX IF NOT EXISTS cases_district_idx ON cases(district);
CREATE INDEX IF NOT EXISTS cases_created_by_idx ON cases(created_by);
CREATE INDEX IF NOT EXISTS reports_status_idx ON reports(status);
CREATE INDEX IF NOT EXISTS reports_created_at_idx ON reports(created_at);
CREATE INDEX IF NOT EXISTS reports_reporter_idx ON reports(reporter_id);
CREATE INDEX IF NOT EXISTS reports_case_idx ON reports(case_id);
CREATE INDEX IF NOT EXISTS report_media_report_idx ON report_media(report_id);
CREATE INDEX IF NOT EXISTS report_media_uploaded_by_idx ON report_media(uploaded_by);
CREATE INDEX IF NOT EXISTS case_reports_report_idx ON case_reports(report_id);
CREATE INDEX IF NOT EXISTS case_reports_linked_by_idx ON case_reports(linked_by);
CREATE INDEX IF NOT EXISTS observations_case_idx ON observations(case_id);
CREATE INDEX IF NOT EXISTS observations_user_idx ON observations(user_id);
CREATE INDEX IF NOT EXISTS obs_media_idx ON observation_media(observation_id);
CREATE INDEX IF NOT EXISTS confirmations_user_idx ON confirmations(user_id);
CREATE INDEX IF NOT EXISTS saved_cases_user_idx ON saved_cases(user_id);
CREATE INDEX IF NOT EXISTS case_updates_case_idx ON case_updates(case_id);
CREATE INDEX IF NOT EXISTS case_updates_created_by_idx ON case_updates(created_by);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON verification_tasks(status);
CREATE INDEX IF NOT EXISTS tasks_assigned_idx ON verification_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS tasks_case_idx ON verification_tasks(case_id);
CREATE INDEX IF NOT EXISTS tasks_created_by_idx ON verification_tasks(created_by);
CREATE INDEX IF NOT EXISTS task_submissions_task_idx ON task_submissions(task_id);
CREATE INDEX IF NOT EXISTS task_submissions_user_idx ON task_submissions(user_id);
CREATE INDEX IF NOT EXISTS communities_district_idx ON communities(district);
CREATE INDEX IF NOT EXISTS communities_created_by_idx ON communities(created_by);
CREATE INDEX IF NOT EXISTS comm_member_user_idx ON community_members(user_id);
CREATE INDEX IF NOT EXISTS posts_community_idx ON posts(community_id);
CREATE INDEX IF NOT EXISTS posts_author_idx ON posts(author_id);
CREATE INDEX IF NOT EXISTS posts_case_idx ON posts(case_id);
CREATE INDEX IF NOT EXISTS comments_post_idx ON comments(post_id);
CREATE INDEX IF NOT EXISTS comments_user_idx ON comments(user_id);
CREATE INDEX IF NOT EXISTS content_reports_status_idx ON content_reports(status);
CREATE INDEX IF NOT EXISTS content_reports_reporter_idx ON content_reports(reporter_id);
CREATE INDEX IF NOT EXISTS content_reports_reviewed_by_idx ON content_reports(reviewed_by);
CREATE INDEX IF NOT EXISTS notifications_user_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON notifications(is_read);
CREATE INDEX IF NOT EXISTS contributions_user_idx ON user_contributions(user_id);
CREATE INDEX IF NOT EXISTS contributions_type_idx ON user_contributions(type);
CREATE INDEX IF NOT EXISTS audit_created_at_idx ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS audit_actor_idx ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS case_feedback_case_idx ON case_feedback(case_id);
CREATE INDEX IF NOT EXISTS case_feedback_user_idx ON case_feedback(user_id);

-- 2. Chỉ mục Phía Chuyên trách (Side B Indexes)
CREATE INDEX IF NOT EXISTS idx_ops_users_role ON ops_users(role);
CREATE INDEX IF NOT EXISTS idx_ops_cases_status ON ops_cases(status);
CREATE INDEX IF NOT EXISTS idx_ops_cases_district ON ops_cases(district);
CREATE INDEX IF NOT EXISTS idx_ops_cases_assigned_staff ON ops_cases(assigned_staff_id);
CREATE INDEX IF NOT EXISTS idx_ops_cases_contractor ON ops_cases(contractor_id);
CREATE INDEX IF NOT EXISTS idx_ops_cases_source_ref ON ops_cases(source_reference);
CREATE INDEX IF NOT EXISTS idx_ops_timeline_case ON ops_case_timeline(case_id);
CREATE INDEX IF NOT EXISTS idx_ops_timeline_created ON ops_case_timeline(created_at);
CREATE INDEX IF NOT EXISTS idx_ops_assignments_case ON ops_staff_assignments(case_id);
CREATE INDEX IF NOT EXISTS idx_ops_assignments_staff ON ops_staff_assignments(staff_user_id);
CREATE INDEX IF NOT EXISTS idx_ops_evidence_case ON ops_evidence_assets(case_id);
CREATE INDEX IF NOT EXISTS idx_ops_evidence_sha256 ON ops_evidence_assets(sha256);
CREATE INDEX IF NOT EXISTS idx_legal_reviews_case ON legal_reviews(case_id);
CREATE INDEX IF NOT EXISTS idx_legal_analyses_case ON legal_analyses(case_id);
CREATE INDEX IF NOT EXISTS idx_case_closures_case ON case_closures(case_id);
CREATE INDEX IF NOT EXISTS idx_remediation_action ON remediation_submissions(corrective_action_id);
CREATE INDEX IF NOT EXISTS idx_remediation_case ON remediation_submissions(case_id);
CREATE INDEX IF NOT EXISTS idx_contractors_name ON contractors(name);
CREATE INDEX IF NOT EXISTS idx_inspection_items_inspection ON inspection_items(inspection_id);
CREATE INDEX IF NOT EXISTS idx_inspections_case ON inspections(case_id);
CREATE INDEX IF NOT EXISTS idx_inspections_status ON inspections(status);
CREATE INDEX IF NOT EXISTS idx_actions_case ON corrective_actions(case_id);
CREATE INDEX IF NOT EXISTS idx_actions_status ON corrective_actions(status);
CREATE INDEX IF NOT EXISTS idx_signals_source ON signals(source_type);
CREATE INDEX IF NOT EXISTS idx_signals_geo ON signals(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_ops_tasks_case ON ops_tasks(case_id);
CREATE INDEX IF NOT EXISTS idx_ops_tasks_assigned ON ops_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_ops_tasks_status ON ops_tasks(status);

-- 3. Chỉ mục Liên thông (Cross-side Indexes)
CREATE INDEX IF NOT EXISTS idx_integration_logs_ext ON integration_logs(source, external_id);
CREATE INDEX IF NOT EXISTS idx_cross_side_code ON cross_side_handoffs(case_code);
