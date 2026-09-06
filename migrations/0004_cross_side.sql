-- ==============================================================================
-- DUSTGUARD VN — MIGRATION 0004: CROSS-SIDE INTEGRATION SCHEMA
-- Bàn giao hồ sơ Idempotent, đồng bộ trạng thái 2 chiều Side A <-> Side B
-- ==============================================================================

-- 1. Nhật ký tích hợp liên thông (Integration Logs - Idempotency Lock)
CREATE TABLE IF NOT EXISTS integration_logs (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  external_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'ERROR', 'IGNORED')),
  payload_hash TEXT NOT NULL,
  processed_at TEXT NOT NULL,
  error TEXT
);

-- 2. Sổ theo dõi bàn giao và đối ứng hồ sơ 2 phía (Cross-side Handoffs Registry)
CREATE TABLE IF NOT EXISTS cross_side_handoffs (
  id TEXT PRIMARY KEY,
  community_case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  operations_case_id TEXT REFERENCES ops_cases(id) ON DELETE SET NULL,
  case_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'FORWARDED',
  forwarded_by TEXT,
  forwarded_at TEXT NOT NULL,
  synced_at TEXT,
  last_event_type TEXT,
  UNIQUE(community_case_id),
  UNIQUE(case_code)
);
