-- ==============================================================================
-- DUSTGUARD VN — MIGRATION 0002: COMMUNITY SCHEMA (SIDE A)
-- Quản lý toàn bộ vòng đời phản ánh công dân, xác thực cộng đồng, CLB thanh niên
-- ==============================================================================

-- 1. Người dùng công dân & thanh niên (Citizen & Youth Community Users)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'citizen' CHECK(role IN ('citizen', 'community_member', 'moderator', 'admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'suspended', 'deleted')),
  district TEXT,
  ward TEXT,
  bio TEXT,
  display_identity TEXT DEFAULT 'anonymous' CHECK(display_identity IN ('name', 'anonymous')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_login_at TEXT
);

-- 2. Vụ việc công khai cộng đồng (Community Public Watch Cases)
CREATE TABLE IF NOT EXISTS cases (
  id TEXT PRIMARY KEY,
  case_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  category TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  address TEXT NOT NULL,
  ward TEXT,
  district TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'TP. Hồ Chí Minh',
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'community_verifying', 'confirmed_signal', 'forwarded', 'in_progress', 'resolved', 'closed', 'archived')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK(priority IN ('normal', 'attention', 'urgent')),
  signal_count INTEGER NOT NULL DEFAULT 1,
  unique_reporter_count INTEGER NOT NULL DEFAULT 1,
  first_reported_at TEXT NOT NULL,
  last_activity_at TEXT NOT NULL,
  resolved_at TEXT,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 3. Báo cáo / Phản ánh của người dân (Citizen Pollution Reports)
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  report_code TEXT NOT NULL UNIQUE,
  reporter_id TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('dust', 'construction_material', 'road_dust', 'illegal_dumping', 'other')),
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  address TEXT NOT NULL,
  ward TEXT,
  district TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'TP. Hồ Chí Minh',
  observed_at TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK(visibility IN ('public', 'community', 'private')),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK(status IN ('draft', 'submitted', 'reviewing', 'verified', 'rejected', 'merged')),
  severity_observation TEXT NOT NULL DEFAULT 'unknown' CHECK(severity_observation IN ('low', 'medium', 'high', 'unknown')),
  source TEXT NOT NULL DEFAULT 'citizen' CHECK(source IN ('citizen', 'community', 'moderator')),
  case_id TEXT REFERENCES cases(id),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 4. Minh chứng ảnh / video phản ánh (Report Evidence Media)
CREATE TABLE IF NOT EXISTS report_media (
  id TEXT PRIMARY KEY,
  report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  uploaded_by TEXT NOT NULL REFERENCES users(id),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK(media_type IN ('image', 'video')),
  caption TEXT,
  sha256_hash TEXT NOT NULL,
  captured_at TEXT,
  latitude REAL,
  longitude REAL,
  created_at TEXT NOT NULL
);

-- 5. Liên kết vụ việc và phản ánh (Case - Reports M2M)
CREATE TABLE IF NOT EXISTS case_reports (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  linked_by TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL,
  UNIQUE(case_id, report_id)
);

-- 6. Ghi nhận thực địa thanh niên (Youth Volunteer Observations)
CREATE TABLE IF NOT EXISTS observations (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  observation_type TEXT NOT NULL CHECK(observation_type IN ('still_present', 'reduced', 'resolved', 'cannot_confirm', 'additional_evidence')),
  comment TEXT NOT NULL,
  observed_at TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  created_at TEXT NOT NULL
);

-- 7. Ảnh minh chứng thực địa (Observation Media)
CREATE TABLE IF NOT EXISTS observation_media (
  id TEXT PRIMARY KEY,
  observation_id TEXT NOT NULL REFERENCES observations(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  sha256_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- 8. Đồng thuận cộng đồng / Tôi cũng ghi nhận (Signal Confirmations)
CREATE TABLE IF NOT EXISTS confirmations (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL,
  UNIQUE(case_id, user_id)
);

-- 9. Lưu theo dõi cá nhân (Saved Cases)
CREATE TABLE IF NOT EXISTS saved_cases (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL,
  UNIQUE(case_id, user_id)
);

-- 10. Dòng thời gian tiến độ vụ việc (Case Updates Timeline)
CREATE TABLE IF NOT EXISTS case_updates (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  update_type TEXT NOT NULL CHECK(update_type IN ('status_change', 'community_update', 'moderator_note', 'system', 'forwarded', 'resolution')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  created_by TEXT REFERENCES users(id),
  is_public INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

-- 11. Nhiệm vụ xác minh hiện trường (Verification Tasks)
CREATE TABLE IF NOT EXISTS verification_tasks (
  id TEXT PRIMARY KEY,
  case_id TEXT REFERENCES cases(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  task_type TEXT NOT NULL CHECK(task_type IN ('field_check', 'photo_update', 'status_check', 'information_check')),
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  address TEXT NOT NULL,
  assigned_to TEXT REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'claimed', 'completed', 'cancelled')),
  due_at TEXT,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed_at TEXT
);

-- 12. Nộp kết quả xác minh (Task Submissions)
CREATE TABLE IF NOT EXISTS task_submissions (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES verification_tasks(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  result TEXT NOT NULL CHECK(result IN ('confirmed', 'not_found', 'changed', 'unable')),
  note TEXT NOT NULL,
  submitted_at TEXT NOT NULL
);

-- 13. Câu lạc bộ / Tổ chức thanh niên cộng đồng (Communities)
CREATE TABLE IF NOT EXISTS communities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  cover_url TEXT,
  district TEXT NOT NULL,
  ward TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 14. Thành viên câu lạc bộ (Community Members)
CREATE TABLE IF NOT EXISTS community_members (
  id TEXT PRIMARY KEY,
  community_id TEXT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL DEFAULT 'member' CHECK(role IN ('member', 'coordinator')),
  joined_at TEXT NOT NULL,
  UNIQUE(community_id, user_id)
);

-- 15. Bài viết hoạt động cộng đồng (Posts)
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  community_id TEXT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES users(id),
  post_type TEXT NOT NULL DEFAULT 'update' CHECK(post_type IN ('update', 'announcement', 'activity')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  case_id TEXT REFERENCES cases(id),
  status TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('published', 'hidden')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 16. Bình luận bài viết (Comments)
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'visible' CHECK(status IN ('visible', 'hidden', 'reported')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 17. Báo cáo vi phạm nội dung (Content Reports)
CREATE TABLE IF NOT EXISTS content_reports (
  id TEXT PRIMARY KEY,
  reporter_id TEXT NOT NULL REFERENCES users(id),
  entity_type TEXT NOT NULL CHECK(entity_type IN ('post', 'comment', 'report', 'observation')),
  entity_id TEXT NOT NULL,
  reason TEXT NOT NULL CHECK(reason IN ('spam', 'abuse', 'misinformation', 'privacy', 'duplicate', 'other')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'reviewed', 'dismissed', 'actioned')),
  reviewed_by TEXT REFERENCES users(id),
  reviewed_at TEXT,
  created_at TEXT NOT NULL
);

-- 18. Thông báo người dùng (User Notifications)
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL CHECK(type IN ('case_update', 'observation', 'task', 'community', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  read_at TEXT
);

-- 19. Đóng góp & Tín chỉ thanh niên (User Contributions & Youth Credits)
CREATE TABLE IF NOT EXISTS user_contributions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL CHECK(type IN ('report', 'confirmation', 'observation', 'verification', 'community_activity')),
  entity_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK(status IN ('submitted', 'accepted', 'rejected')),
  created_at TEXT NOT NULL
);

-- 20. Thống kê tác động môi trường (Impact Stats)
CREATE TABLE IF NOT EXISTS impact_stats (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  new_reports INTEGER NOT NULL DEFAULT 0,
  verified_reports INTEGER NOT NULL DEFAULT 0,
  active_cases INTEGER NOT NULL DEFAULT 0,
  resolved_cases INTEGER NOT NULL DEFAULT 0,
  community_observations INTEGER NOT NULL DEFAULT 0,
  active_users INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

-- 21. Nhật ký kiểm toán hành động (Audit Logs)
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_id TEXT REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata_json TEXT,
  ip_address TEXT,
  created_at TEXT NOT NULL
);

-- 22. Đánh giá nghiệm thu của công dân (Citizen Case Feedback)
CREATE TABLE IF NOT EXISTS case_feedback (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL,
  comment TEXT,
  is_satisfied INTEGER NOT NULL,
  request_reinspection INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  UNIQUE(case_id, user_id)
);
