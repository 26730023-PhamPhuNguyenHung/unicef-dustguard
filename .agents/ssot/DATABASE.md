# DATABASE SSOT — CLOUDFLARE D1 PERSISTENCE

## 1. Nguyên tắc Bất biến
- **Cloudflare D1 là Single Source of Truth (SSOT)**: Mọi dữ liệu ghi nhận, vụ việc, bằng chứng, nhiệm vụ, kiểm tra lại, chuyển tiếp đều phải được lưu trữ bền vững trong D1 (`env.DB` trên Worker / `dev.db` trên Local).
- **Không dùng LocalStorage làm Database**: LocalStorage chỉ dùng để lưu cache tạm phiên làm việc và ID thiết bị.
- **Additive Migration**: Không xoá hoặc thay đổi bảng cũ gây breaking change tới các test suites.
- **Zero Secrets Invariant**: Không lưu `password_hash`, OAuth secrets hay access tokens vào D1 khi user được quản lý bởi Clerk.

## 2. Bảng Users & Hybrid Identity SSOT (`0003_clerk_user_provisioning.sql`)

```sql
-- Users (Identity & Domain Roles)
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clerk_user_id" TEXT,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT 1,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'citizen',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "users_clerk_user_id_key" ON "users"("clerk_user_id");
CREATE INDEX IF NOT EXISTS "idx_users_clerk_id" ON "users"("clerk_user_id");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users"("role");
CREATE INDEX IF NOT EXISTS "users_status_idx" ON "users"("status");
```

## 3. Các bảng Additive Bounded Contexts mới (`0003_community_domain.sql`)

```sql
-- Communities
CREATE TABLE IF NOT EXISTS "communities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'UNIVERSITY_CLUB', -- UNIVERSITY_CLUB, YOUTH_UNION, NGO_VOLUNTEER, LOCAL_COMMUNITY
    "ward" TEXT,
    "city" TEXT DEFAULT 'Hà Nội',
    "avatar_url" TEXT,
    "description" TEXT,
    "member_count" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Community Members
CREATE TABLE IF NOT EXISTS "community_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "community_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER', -- MEMBER, COORDINATOR, ADMIN
    "joined_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "community_members_comm_fkey" FOREIGN KEY ("community_id") REFERENCES "communities" ("id") ON DELETE CASCADE
);

-- Campaigns
CREATE TABLE IF NOT EXISTS "campaigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "topic" TEXT NOT NULL DEFAULT 'SCHOOL_ZONE_DUST', -- SCHOOL_ZONE_DUST, OPEN_BURNING_WATCH, CANAL_CLEANUP, GREEN_YOUTH_MONTH
    "ward" TEXT,
    "city" TEXT DEFAULT 'Hà Nội',
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE', -- DRAFT, ACTIVE, COMPLETED, ARCHIVED
    "participant_count" INTEGER NOT NULL DEFAULT 0,
    "observation_count" INTEGER NOT NULL DEFAULT 0,
    "created_by" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Campaign Members
CREATE TABLE IF NOT EXISTS "campaign_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaign_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "joined_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "campaign_members_camp_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id") ON DELETE CASCADE
);

-- Observations (Ghi nhận hiện trường độc lập)
CREATE TABLE IF NOT EXISTS "observations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE, -- OBS-2026-XXXX
    "category" TEXT NOT NULL DEFAULT 'CONSTRUCTION_DUST', -- CONSTRUCTION_DUST, WASTE, WASTEWATER, OPEN_BURNING, AGRICULTURAL_CHEMICAL, AIR_QUALITY, OTHER
    "latitude" REAL,
    "longitude" REAL,
    "address" TEXT NOT NULL,
    "ward" TEXT NOT NULL,
    "city" TEXT DEFAULT 'Hà Nội',
    "description" TEXT NOT NULL,
    "reporter_type" TEXT NOT NULL DEFAULT 'INDIVIDUAL', -- INDIVIDUAL, CLUB, VOLUNTEER, CAMPAIGN
    "reporter_name" TEXT,
    "reporter_phone" TEXT,
    "community_id" TEXT,
    "campaign_id" TEXT,
    "site_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'RECORDED', -- RECORDED, VERIFYING, FOLLOWING_UP, CONVERTED_CASE, RESOLVED
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "observations_comm_fkey" FOREIGN KEY ("community_id") REFERENCES "communities" ("id") ON DELETE SET NULL,
    CONSTRAINT "observations_camp_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns" ("id") ON DELETE SET NULL,
    CONSTRAINT "observations_site_fkey" FOREIGN KEY ("site_id") REFERENCES "sites" ("id") ON DELETE SET NULL
);

-- Observation Evidence
CREATE TABLE IF NOT EXISTS "observation_evidence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "observation_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'IMAGE', -- IMAGE, VIDEO, DOCUMENT
    "sha256" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "obs_evidence_obs_fkey" FOREIGN KEY ("observation_id") REFERENCES "observations" ("id") ON DELETE CASCADE
);

-- Follow-Ups (Quay lại kiểm tra hiện trạng)
CREATE TABLE IF NOT EXISTS "follow_ups" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "observation_id" TEXT,
    "case_id" TEXT,
    "performed_by" TEXT,
    "outcome_status" TEXT NOT NULL DEFAULT 'UNCHANGED', -- BETTER, UNCHANGED, WORSE, UNKNOWN
    "notes" TEXT,
    "evidence_url" TEXT,
    "evidence_sha256" TEXT,
    "verified_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "follow_ups_obs_fkey" FOREIGN KEY ("observation_id") REFERENCES "observations" ("id") ON DELETE CASCADE,
    CONSTRAINT "follow_ups_case_fkey" FOREIGN KEY ("case_id") REFERENCES "cases" ("id") ON DELETE CASCADE
);

-- Handoffs (Chuyển thông tin hồ sơ tới đơn vị chức năng)
CREATE TABLE IF NOT EXISTS "handoffs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "case_id" TEXT,
    "observation_id" TEXT,
    "recipient_unit" TEXT NOT NULL,
    "recipient_contact" TEXT,
    "channel" TEXT NOT NULL DEFAULT 'EMAIL', -- EMAIL, WEBSITE, HOTLINE, DIRECT, OTHER
    "status" TEXT NOT NULL DEFAULT 'PREPARED', -- PREPARED, SENT, ACKNOWLEDGED, FOLLOW_UP_NEEDED, CLOSED
    "summary_markdown" TEXT,
    "dossier_url" TEXT,
    "hash" TEXT,
    "sent_at" DATETIME,
    "acknowledged_at" DATETIME,
    "closed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "handoffs_case_fkey" FOREIGN KEY ("case_id") REFERENCES "cases" ("id") ON DELETE CASCADE
);

-- Impact Events (Ghi nhận đóng góp thực tế)
CREATE TABLE IF NOT EXISTS "impact_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "community_id" TEXT,
    "user_id" TEXT,
    "event_type" TEXT NOT NULL, -- OBSERVATION_CREATED, EVIDENCE_ATTACHED, FOLLOW_UP_RECORDED, ACTION_COMPLETED, CASE_RESOLVED, HANDOFF_DISPATCHED
    "points_earned" INTEGER NOT NULL DEFAULT 10,
    "volunteer_hours" REAL NOT NULL DEFAULT 0.5,
    "metadata_json" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```
