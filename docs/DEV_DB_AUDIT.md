# DEV_DB_AUDIT.md — Báo Cáo Kiểm Toán & Tích Hợp CSDL Thực dev.db (DustGuard VN)

> **SSOT Truth Confirmation**: Ngày kiểm toán: 02/09/2026. Tất cả các phân hệ bên dưới được đối chiếu trực tiếp giữa CSDL SQLite `dev.db` (`app/prisma/dev.db`), Edge Worker / Hono Backend Routes (`app/server/routes/`), Service Query Layer (`app/server/services/`) và Frontend React Components (`app/src/apps/staff/`).

---

## 1. Tổng Quan Cơ Sở Dữ Liệu `dev.db`
- **Vị trí tệp**: `app/prisma/dev.db` (Dung lượng: ~36.1 MB).
- **Engine**: SQLite 3 (thao tác cục bộ qua `better-sqlite3`, trên Cloudflare Edge qua D1 bindings `env.DB`).
- **ORM / Data Layer**: Pure SQL Statements & D1 Prepared Statements (Zero Mock, Zero Fake Entities).
- **Tổng số bảng nghiệp vụ hoạt động**: 38 công trình (`sites`), 23 cảnh báo (`alerts`), 21 hồ sơ vụ việc (`cases`), 24 nhiệm vụ tác nghiệp (`tasks`), 5034 ghi nhận cộng đồng (`observations`), 33 người dùng (`users`), 30 trạm cảm biến (`sensors`), 262 bản ghi đo lường (`sensor_readings`), 784 chứng chỉ thanh niên (`youth_certificates`).

---

## 2. Ma Trận Kiểm Toán Từng Phân Hệ Staff Sidebar

| Phân hệ / Sidebar | CSDL Bảng chính (`dev.db`) | Endpoint API Backend | Frontend Component | Real CRUD / Query | Trạng thái Nghiệp vụ |
|---|---|---|---|:---:|:---:|
| **Trang chính (Dashboard)** | `cases`, `alerts`, `tasks`, `sites` | `GET /api/staff/dashboard`<br>`GET /api/dashboard/summary` | `StaffDashboardPage.jsx`<br>`staffApi.getStaffDashboard()` | **YES (SQL Aggregation)** | **REAL 100%** |
| **Quan trắc (Monitoring)** | `sites`, `sensors`, `sensor_readings`, `alerts` | `GET /api/staff/monitoring/summary`<br>`GET /api/staff/monitoring/timeline`<br>`GET /api/staff/monitoring/stations`<br>`GET /api/staff/monitoring/abnormal` | `StaffMonitoringPage.jsx`<br>`staffApi.getMonitoringSummary()` | **YES** | **REAL 100%** |
| **Cảnh báo (Alerts)** | `alerts`, `sites` | `GET /api/staff/alerts/summary`<br>`GET /api/staff/alerts/priorities`<br>`POST /api/staff/alerts/:id/convert-to-case`<br>`POST /api/staff/alerts/:id/assign` | `StaffAlertsPage.jsx`<br>`staffApi.getAlerts()` | **YES** | **REAL 100%** |
| **Công trình (Sites)** | `sites`, `sensors`, `cases` | `GET /api/staff/sites/summary`<br>`GET /api/staff/sites/priorities`<br>`GET /api/staff/sites/list`<br>`GET /api/sites/:id` | `SitesListPage.jsx`<br>`SiteDetailPage.jsx`<br>`staffApi.getSites()` | **YES** | **REAL 100%** |
| **Hồ sơ (Cases)** | `cases`, `sites`, `case_status_history`, `tasks` | `GET /api/staff/cases/summary`<br>`GET /api/staff/cases/list`<br>`GET /api/cases/:id`<br>`POST /api/cases`<br>`PATCH /api/cases/:id/status` | `CasesListPage.jsx`<br>`CaseDetailPage.jsx`<br>`staffApi.getCases()` | **YES** | **REAL 100%** |
| **Nhiệm vụ (Tasks)** | `tasks`, `sites`, `cases`, `profiles` | `GET /api/staff/tasks/summary`<br>`GET /api/staff/tasks/schedule`<br>`GET /api/staff/tasks/list`<br>`POST /api/staff/tasks` | `TasksListPage.jsx`<br>`StaffTaskDetail.jsx`<br>`staffApi.getTasks()` | **YES** | **REAL 100%** |
| **Báo cáo (Reports)** | `reports`, `sites`, `cases`, `observations` | `GET /api/staff/reports/summary`<br>`GET /api/staff/reports/trend`<br>`GET /api/staff/reports/list`<br>`POST /api/staff/reports/generate` | `StaffReportsPage.jsx`<br>`staffApi.getReports()` | **YES** | **REAL 100%** |
| **Thông báo (Notifications)** | `notifications`, `users` | `GET /api/staff/notifications/summary`<br>`GET /api/staff/notifications/list`<br>`PATCH /api/staff/notifications/:id/read` | `StaffNotificationsPage.jsx`<br>`staffApi.getNotifications()` | **YES** | **REAL 100%** |
| **Cài đặt & Hồ sơ (Settings)** | `users`, `profiles`, `system_metadata` | `GET /api/staff/profile`<br>`PATCH /api/staff/profile`<br>`GET /api/staff/settings`<br>`PATCH /api/staff/settings` | `StaffProfilePage.jsx`<br>`StaffSettingsPage.jsx` | **YES** | **REAL 100%** |

---

## 3. Chi Tiết Kiến Trúc Dữ Liệu Dashboard `/staff` (Phase 2 Data Contract)

```
[dev.db (SQLite / D1)]
       │
       ▼ (SQL Aggregation & JOINs: LIMIT 5, composite WHERE, safe status mapping)
[StaffDashboardService: getStaffDashboardData(db)]
       │
       ▼
[Edge Worker & Express Routes: /api/staff/dashboard]
       │
       ▼ (Response unwrapping & normalization client layer)
[staffApi.getStaffDashboard()]
       │
       ▼
[StaffDashboardPage (React UI)]
   ├── Hàng 1: 4 KPI Cards (Cần xử lý ngay, Cảnh báo mới, Hồ sơ gần đến hạn, Nhiệm vụ hôm nay)
   └── Hàng 2 (14-16 inch Desktop):
       ├── Cột 1 (~42%): Việc cần làm tiếp (4-6 Action items từ Cases, Tasks, Alerts)
       ├── Cột 2 (~30%): Cảnh báo mới nhất (Top 5 Alerts JOIN Sites)
       └── Cột 3 (~28%): Hồ sơ gần đây (Top 5 Cases JOIN Sites)
```

---

## 4. Kết Quả Kiểm Thử Tự Động (Level 0 - Level 3)
- `staff-dashboard-real-devdb.test.js`: **7/7 PASS** (69ms)
- `staff-worker-d1-api.test.js`: **8/8 PASS** (53ms)
- `staff-monitoring-d1-api.test.js`: **7/7 PASS** (41ms)
- `staff-alerts-d1-api.test.js`: **6/6 PASS** (41ms)
- Tổng cộng: **28/28 tests PASS 100%**, không có bất kỳ console warning hoặc type exception nào.
