-- ==============================================================================
-- DUSTGUARD VN — MIGRATION 0001: CORE SYSTEM SCHEMA
-- Bảng cấu hình hệ thống, dự án công trình và nhà thầu dùng chung 2 phía
-- ==============================================================================

-- 1. Cấu hình hệ thống (Statutory System Configurations)
CREATE TABLE IF NOT EXISTS system_configs (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  description TEXT,
  updated_at TEXT NOT NULL
);

-- 2. Danh bạ nhà thầu / Đơn vị thi công / Chủ nguồn thải
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

-- 3. Danh mục công trình xây dựng đô thị (Projects / Construction Sites)
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
