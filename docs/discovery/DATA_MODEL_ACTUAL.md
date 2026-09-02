# Data Model Actual (Cloudflare D1 SQLite SSOT) — DustGuard VN

Cơ sở dữ liệu Cloudflare D1 định nghĩa 46 bảng quan hệ chuẩn, không dùng mock hay dữ liệu giả lập ở Core Paths.

## 1. Core Civic & Operations Entities (12 Bảng nghiệp vụ nòng cốt)

### 1. `sites` (Công trình thi công)
- **Fields**: `id`, `code`, `name`, `address`, `province_id`, `ward_id`, `latitude`, `longitude`, `contractor_name`, `contractor_phone`, `risk_level`, `risk_score`, `status`, `created_at`, `updated_at`.
- **Relations**: 1-N `sensors`, 1-N `cases`, 1-N `inspections`, 1-N `complaints`.

### 2. `cases` (Hồ sơ vụ việc 7 bước DAG)
- **Fields**: `id`, `code`, `site_id`, `title`, `stage` (INTAKE, SURVEYED, PROPOSED, APPROVED, REMEDIATED, CLOSED), `status`, `priority_score`, `deadline_at`, `assigned_to`, `created_at`, `updated_at`.
- **Relations**: N-1 `sites`, 1-N `case_timelines`, 1-N `actions`, 1-N `case_status_history`.

### 3. `observations` (Ghi nhận cộng đồng / phản ánh)
- **Fields**: `id`, `code`, `user_id`, `site_id`, `title`, `description`, `category_id`, `latitude`, `longitude`, `address`, `status` (RECORDED, VERIFIED, REJECTED, LINKED_TO_CASE), `created_at`.
- **Relations**: 1-N `observation_evidence`, 1-N `follow_ups`, 1-1 `handoffs`.

### 4. `actions` / `tasks` (Nhiệm vụ & Khắc phục)
- **Fields**: `id`, `case_id`, `site_id`, `type`, `title`, `description`, `contractor_id`, `due_date`, `status` (PENDING, IN_PROGRESS, SUBMITTED, VERIFIED), `created_at`.
- **Relations**: N-1 `cases`, 1-N `evidences`.

### 5. `sensors` & `sensor_readings` (Cảm biến & Số liệu quan trắc)
- **Fields (`sensors`)**: `id`, `site_id`, `code`, `type` (PM2_5, PM10, HUMIDITY, WIND), `status`, `battery_level`, `last_ping_at`.
- **Fields (`sensor_readings`)**: `id`, `sensor_id`, `site_id`, `pm25`, `pm10`, `humidity`, `temperature`, `recorded_at`.

### 6. `youth_activities` & `youth_certificates` (Tín chỉ thanh niên & Chứng chỉ QR)
- **Fields (`youth_activities`)**: `id`, `user_id`, `activity_type`, `hours_logged`, `credits_earned`, `verified_by`, `status`, `created_at`.
- **Fields (`youth_certificates`)**: `id`, `certificate_code`, `user_id`, `full_name`, `university`, `total_hours`, `credits`, `qr_matrix_svg`, `signature_hash`, `issued_at`.

### 7. `draft_documents` & `document_revisions` (Văn bản hành chính chuẩn NĐ 30/2020)
- **Fields**: `id`, `case_id`, `document_type`, `document_number`, `title`, `body_content`, `doc_hash`, `status` (DRAFT, REVIEW, APPROVED, ISSUED), `created_at`.

### 8. `evidences` & `observation_evidence` (Bằng chứng số SHA-256)
- **Fields**: `id`, `target_id`, `file_url`, `file_type`, `file_size`, `sha256_hash`, `geofence_verified`, `uploaded_at`.

### 9. `users`, `profiles`, `session` (Tài khoản & Phân quyền RBAC)
- **Fields**: `id`, `email`, `role` (public, citizen, staff, contractor, admin), `full_name`, `phone`, `organization`, `status`.

### 10. `audit_logs` & `audit_events` (Nhật ký kiểm toán hệ thống)
- **Fields**: `id`, `actor_id`, `actor_role`, `action`, `entity_type`, `entity_id`, `payload_before`, `payload_after`, `ip_address`, `created_at`.

### 11. `alerts` & `alert_notifications` (Cảnh báo ô nhiễm vượt ngưỡng)
- **Fields**: `id`, `site_id`, `sensor_id`, `threshold_exceeded`, `severity`, `status`, `resolved_at`, `created_at`.

### 12. `provinces` & `wards` (Đơn vị hành chính WGS84)
- **Fields**: `id`, `code`, `name`, `parent_code`, `coordinates_geojson`.
