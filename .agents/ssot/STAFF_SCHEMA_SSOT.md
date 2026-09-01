# STAFF SCHEMA SSOT — KIẾN TRÚC 12 BẢNG NGHIỆP VỤ DUY NHẤT CHO PHÂN HỆ STAFF

## 1. LUỒNG DỮ LIỆU CỐT LÕI (CORE RELATIONSHIPS)

```text
CÔNG TRÌNH (projects / sites)
    │
    ├── TRẠM ĐO (monitoring_stations / sensors)
    │      └── SỐ ĐO (sensor_readings)
    │             ↓
    │          CẢNH BÁO (alerts)
    │             ↓
    └────────── HỒ SƠ (cases)
                  │
                  ├── NHIỆM VỤ (tasks)
                  ├── ẢNH / TÀI LIỆU (case_files)
                  └── LỊCH SỬ XỬ LÝ (case_events)

USER (users)
 ├── Phụ trách công trình (manager_id)
 ├── Được gán cảnh báo (assigned_to)
 ├── Phụ trách hồ sơ (assigned_to)
 └── Phụ trách nhiệm vụ (assigned_to)
```

---

## 2. 3 NGUYÊN TẮC BẤT BIẾN (INVARIANTS)

1. **Không tạo bảng chỉ vì UI có một card/tab/widget**:
   - Mọi số liệu KPI, biểu đồ, danh sách ưu tiên đều là **READ-ONLY AGGREGATION** từ bảng nguồn.
   - Tuyệt đối cấm tạo các bảng như: `dashboard_stats`, `dashboard_cards`, `monitoring_kpis`.

2. **Không lưu dữ liệu có thể COUNT/SUM/JOIN được**:
   - Cấm lưu `open_cases_count`, `station_count`, `alert_count` vào bảng `projects` hay `users`.
   - Cấm lưu `total_active`, `warning_count` vào bất kỳ bảng nào.
   - Mọi số liệu derive từ `COUNT(*) WHERE ...`.

3. **WRITE entity thật — READ / AGGREGATE cho giao diện**:
   - WRITE: `projects`, `stations`, `readings`, `alerts`, `cases`, `tasks`, `case_files`, `case_events`.
   - READ: Dashboard, Báo cáo tổng hợp, Thống kê, Danh sách ưu tiên hôm nay.

---

## 3. DANH MỤC 12 BẢNG NGHIỆP VỤ D1

### 1. `users` (Người dùng & Cán bộ)
- `id` (PK), `name`, `email`, `phone`, `role` (`admin` | `staff` | `contractor`), `avatar_url`, `status` (`active` | `disabled`), `created_at`, `updated_at`.

### 2. `projects` / `sites` (Công trình theo dõi)
- `id` (PK), `code` (UNIQUE), `name`, `address`, `ward`, `city`, `latitude`, `longitude`, `contractor_name`, `contact_name`, `contact_phone`, `manager_id` (FK users.id), `status` (`monitoring` | `stable` | `paused` | `closed`), `risk_score` (0-100), `created_at`, `updated_at`.

### 3. `monitoring_stations` / `sensors` (Trạm quan trắc)
- `id` (PK), `code` (UNIQUE), `project_id` (FK projects.id), `name`, `latitude`, `longitude`, `status` (`active` | `paused` | `offline`), `pm25_warning`, `pm25_alert`, `pm10_warning`, `pm10_alert`, `last_seen_at`, `created_at`, `updated_at`.

### 4. `sensor_readings` (Dữ liệu đo chuỗi thời gian)
- `id` (INTEGER PK AUTOINCREMENT), `station_id` (FK), `pm25` (REAL), `pm10` (REAL), `temperature` (REAL), `humidity` (REAL), `recorded_at` (DATETIME).
- Index: `CREATE INDEX idx_readings_station_time ON sensor_readings(station_id, recorded_at);`

### 5. `alerts` (Cảnh báo môi trường)
- `id` (PK), `project_id` (FK), `station_id` (FK), `type` (`threshold` | `offline` | `anomaly` | `manual`), `title`, `message`, `severity` (`low` | `medium` | `high` | `critical`), `risk_score`, `pm25`, `pm10`, `priority_reasons` (JSON array), `assigned_to` (FK users.id), `status` (`new` | `viewed` | `processing` | `resolved` | `ignored`), `case_id` (FK cases.id), `created_at`, `viewed_at`, `resolved_at`.

### 6. `cases` (Hồ sơ vụ việc 7 bước)
- `id` (PK), `code` (UNIQUE), `project_id` (FK), `alert_id` (FK), `title`, `description`, `case_type`, `violation_type`, `priority` (`low` | `normal` | `high` | `urgent`), `risk_score`, `status` (`new` | `processing` | `waiting_contractor` | `surveying` | `waiting_acceptance` | `closed`), `current_step` (`receive` | `site_check` | `remediation` | `verify` | `acceptance`), `assigned_to` (FK users.id), `due_at`, `created_by`, `created_at`, `updated_at`, `closed_at`.

### 7. `case_files` (Toàn bộ ảnh Trước/Sau & Bằng chứng số)
- `id` (PK), `case_id` (FK cases.id), `file_type` (`image` | `document`), `category` (`before` | `after` | `evidence` | `inspection` | `remediation` | `monitoring`), `file_url` (R2 CDN URL), `file_name`, `mime_type`, `uploaded_by`, `created_at`.

### 8. `case_events` (Lịch sử theo dõi tác nghiệp)
- `id` (INTEGER PK AUTOINCREMENT), `case_id` (FK cases.id), `event_type` (`created` | `assigned` | `updated` | `status_changed` | `file_added` | `note_added` | `completed`), `message`, `actor_id` (FK users.id), `metadata` (JSON), `created_at`.

### 9. `tasks` (Nhiệm vụ cán bộ & Việc cần làm)
- `id` (PK), `title`, `description`, `project_id` (FK), `case_id` (FK), `alert_id` (FK), `assigned_to` (FK users.id), `created_by`, `priority` (`low` | `normal` | `high` | `urgent`), `status` (`todo` | `doing` | `done` | `cancelled`), `due_at`, `completed_at`, `created_at`, `updated_at`.

### 10. `notifications` (Thông báo điều hành)
- `id` (PK), `user_id` (FK users.id), `type` (`alert` | `case` | `task` | `system`), `title`, `message`, `entity_type` (`alert` | `case` | `task` | `project`), `entity_id`, `priority` (`normal` | `high`), `is_read` (0 | 1), `is_muted` (0 | 1), `created_at`, `read_at`.

### 11. `reports` (Báo cáo & Xuất bản)
- `id` (PK), `name`, `report_type` (`weekly` | `overdue` | `project` | `area` | `custom`), `project_id` (FK), `date_from`, `date_to`, `status` (`generating` | `ready` | `failed`), `pdf_url` (R2), `excel_url` (R2), `created_by`, `created_at`.

### 12. `report_schedules` (Lên lịch gửi định kỳ)
- `id` (PK), `report_type`, `recipient_emails` (JSON array), `frequency` (`daily` | `weekly` | `monthly`), `day_of_week`, `send_hour`, `enabled` (0 | 1), `created_by`, `created_at`, `updated_at`.

---

## 4. QUY TRÌNH THỰC HIỆN TUYẾN TÍNH 8 PHÂN HỆ
1. **Quan trắc (`/staff/monitoring`)** — ✅ ĐÃ HOÀN THÀNH 100% D1 VERTICAL SLICE
2. **Cảnh báo (`/staff/alerts`)** — Bước tiếp theo: Nối bảng `alerts` + `monitoring_stations`
3. **Công trình (`/staff/sites` & `/staff/sites/:id`)** — Nối bảng `projects` + `monitoring_stations` + `sensor_readings`
4. **Hồ sơ (`/staff/cases` & `/staff/cases/:id`)** — Nối `cases` + `case_files` + `case_events` + `tasks`
5. **Nhiệm vụ (`/staff/tasks`)** — Nối `tasks` + timeline giờ
6. **Báo cáo (`/staff/reports`)** — Nối `reports` + `report_schedules`
7. **Thông báo (`/staff/notifications`)** — Nối `notifications`
8. **Trang chính (`/staff`)** — Read-only aggregate từ toàn bộ 12 bảng trên.
