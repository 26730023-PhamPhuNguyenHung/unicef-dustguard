# DUSTGUARD VN — FINAL PRODUCTION READINESS INVENTORY
> **Ngày kiểm toán**: 2026-09-05  
> **Phiên bản kiến trúc**: Canonical 2-Side Product (Side A: Community vs Side B: Professional)  
> **Nguyên tắc**: Zero-Mock, Authentic Persistence, Idempotent Institutional Handoff

---

## 1. BẢNG KIỂM KÊ TÍNH NĂNG TOÀN DIỆN (FEATURE INVENTORY)

| STT | Tính năng (Feature) | Phía (Side) | Giao diện (Frontend) | API Endpoint | CSDL (DB Table) | Cơ chế Auth | Tính Bền Vững (Persistence) | Kiểm Thử (E2E) | Bản Chất (Real/Mock) | Trạng Thái (Status) |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Landing Page 2 Phía** | Chung | `apps/web/src/pages/LandingPage.tsx` | N/A (Static SSOT) | N/A | Không yêu cầu | Lưu trữ client | Browser E2E Pass | Real UI | **PRODUCTION READY** |
| 2 | **Cổng Đăng Nhập 2 Phía** | Chung | `apps/web/src/pages/LoginPage.tsx` | Phân luồng Side A / B | N/A | State Preservation | Khôi phục Deep-link | Browser E2E Pass | Real Auth Gateway | **PRODUCTION READY** |
| 3 | **Đăng ký Thành viên** | Side A | `apps/web/src/pages/RegisterPage.tsx` | `POST /api/auth/register` | `users` | Argon2 / PBKDF2 | SQLite Persisted | API Test Pass | Real Auth | **PRODUCTION READY** |
| 4 | **Đăng nhập Cộng đồng** | Side A | `apps/web/src/pages/LoginPage.tsx` | `POST /api/auth/login` | `users` | Bearer JWT | LocalStorage + Header | Browser E2E Pass | Real Auth | **PRODUCTION READY** |
| 5 | **Gửi Phản Ánh Bụi** | Side A | `apps/web/src/pages/CreateReportPage.tsx` | `POST /api/reports` | `reports`, `report_media` | Authenticated Token | SQLite Persisted | Browser E2E Pass | Real Mutation | **PRODUCTION READY** |
| 6 | **Băm Minh Chứng SHA-256** | Side A | `apps/web/src/utils/crypto.ts` | Web Crypto API + Fallback | `report_media.sha256_hash` | Client-side Secure | SQLite Persisted | Unit Test Pass | Real Crypto Pure | **PRODUCTION READY** |
| 7 | **Bảng Tin Phản Ánh** | Side A | `apps/web/src/pages/ReportsListPage.tsx` | `GET /api/reports` | `reports` | Public / Member | SQLite Indexed Query | Browser E2E Pass | Real Query | **PRODUCTION READY** |
| 8 | **Chi Tiết Phản Ánh** | Side A | `apps/web/src/pages/ReportDetailPage.tsx` | `GET /api/reports/:id` | `reports`, `report_media` | Public / Member | SQLite Persisted | Browser E2E Pass | Real Query | **PRODUCTION READY** |
| 9 | **Xác Nhận Thực Địa (Confirm)** | Side A | `apps/web/src/pages/ReportDetailPage.tsx` | `POST /api/reports/:id/confirm` | `confirmations` | Authenticated Token | SQLite Unique (user, report) | Unit Test Pass | Real Mutation | **PRODUCTION READY** |
| 10 | **Hàng Đợi Kiểm Duyệt** | Side A | `apps/web/src/pages/ModerationQueuePage.tsx` | `GET /api/moderator/queue` | `reports`, `cases` | `moderator`, `admin` | SQLite Persisted | Browser E2E Pass | Real Capability | **PRODUCTION READY** |
| 11 | **Điều Phối Vụ Việc** | Side A | `apps/web/src/pages/CaseCoordinationPage.tsx` | `PUT /api/moderator/cases/:id/status` | `cases`, `case_updates` | `moderator`, `admin` | SQLite State Machine | Browser E2E Pass | Real State Flow | **PRODUCTION READY** |
| 12 | **Bàn Giao Chuyên Trách (Handoff)** | Side A $\to$ B | `apps/server/src/utils/handoff.ts` | `POST /api/integrations/community/cases` | `cases`, `integration_logs` | Webhook HTTP Post | Idempotent DB Trans | Integration Pass | Real Inter-System | **PRODUCTION READY** |
| 13 | **Câu Lạc Bộ & Đội Tình Nguyện** | Side A | `apps/web/src/pages/CommunitiesPage.tsx` | `GET /api/communities` | `communities` | Member / Volunteer | SQLite Persisted | Browser E2E Pass | Real Query | **PRODUCTION READY** |
| 14 | **Tín Chỉ Hoạt Động Thanh Niên** | Side A | `apps/web/src/pages/ProfilePage.tsx` | `GET /api/me/contributions` | `user_points`, `confirmations` | Authenticated Token | 20h = 4.0 Tín chỉ | Unit Test Pass | Real Domain Logic | **PRODUCTION READY** |
| 15 | **Bàn Làm Việc Chuyên Trách** | Side B | `dustguard-operations/apps/web/src/pages/DashboardPage.tsx` | `GET /api/dashboard` | `cases`, `inspections`, `tasks` | RBAC Staff / Sup | SQLite Aggregations | Browser E2E Pass | Real Query (Zero-Data ok) | **PRODUCTION READY** |
| 16 | **Tiếp Nhận & Quản Lý Hồ Sơ** | Side B | `dustguard-operations/apps/web/src/pages/CaseInboxPage.tsx` | `GET /api/cases` | `cases` | `case:view` | SQLite Indexed Filter | Browser E2E Pass | Real Query | **PRODUCTION READY** |
| 17 | **Chi Tiết & Chu Trình Xử Lý** | Side B | `dustguard-operations/apps/web/src/pages/CaseDetailPage.tsx` | `GET /api/cases/:id` | `cases`, `case_timeline` | `case:update` | Transaction Safety | Browser E2E Pass | Real State Flow | **PRODUCTION READY** |
| 18 | **Checklist Thanh Tra Hiện Trường** | Side B | `dustguard-operations/apps/web/src/pages/FieldInspectionPage.tsx` | `POST /api/inspections` | `inspections`, `findings` | `inspection:create` | 10 Tiêu chuẩn QCVN 18 | Browser E2E Pass | Real Field Standard | **PRODUCTION READY** |
| 19 | **Giao Việc Đơn Vị Thi Công** | Side B | `dustguard-operations/apps/web/src/pages/ActionsListPage.tsx` | `POST /api/actions` | `actions`, `contractors` | `action:create` | 48h SLA Tracking | Browser E2E Pass | Real Action Flow | **PRODUCTION READY** |
| 20 | **Nghiệm Thu Khắc Phục** | Side B | `dustguard-operations/apps/web/src/pages/RemediationReviewPage.tsx` | `PUT /api/actions/:id/verify` | `actions`, `cases` | `remediation:verify` | Verified / Rejected | Browser E2E Pass | Real Action Flow | **PRODUCTION READY** |
| 21 | **Tra Cứu Văn Bản Pháp Luật** | Side B | `dustguard-operations/apps/web/src/pages/LegalLibraryPage.tsx` | `GET /api/legal/search` | `legal_sections_fts` | Public Staff | SQLite FTS5 Full-Text | Browser E2E Pass | Real FTS Engine | **PRODUCTION READY** |
| 22 | **Đối Soát Quy Chuẩn Pháp Lý** | Side B | `dustguard-operations/apps/web/src/pages/LegalWorkspacePage.tsx` | `POST /api/cases/:id/analysis` | `case_facts`, `analysis_runs` | `legal:review` | Deterministic Rules | Browser E2E Pass | Real Expert Rules | **PRODUCTION READY** |
| 23 | **Mạng Lưới Quan Trắc IoT** | Side B | `dustguard-operations/apps/web/src/pages/IotDevicesPage.tsx` | `GET /api/iot/devices` | `iot_devices` | `iot:view` | Hardware Pilot Badge | Browser E2E Pass | Real Device Mgmt | **PRODUCTION READY** (Pilot) |
| 24 | **Luồng Cảm Biến Realtime IoT** | Side B | `dustguard-operations/apps/server/src/modules/iot/iot.router.ts` | `POST /api/iot/ingest` | `sensor_readings` | HMAC-SHA256 Secret | Real Ingest Validator | Ingestion Pass | Real Hardware Bridge | **PRODUCTION READY** (Pilot) |
| 25 | **Giám Sát & Điều Phối Lãnh Đạo** | Side B | `dustguard-operations/apps/web/src/pages/SupervisorWorkloadPage.tsx` | `GET /api/dashboard/supervisor` | `cases`, `users` | `supervisor` role | Overdue / Workload | Browser E2E Pass | Real Query | **PRODUCTION READY** |
| 26 | **Quản Trị Người Dùng & Phân Quyền** | Side B | `dustguard-operations/apps/web/src/pages/AdminUsersPage.tsx` | `GET/POST /api/admin/users` | `users`, `roles` | `admin` role | DB RBAC Enforced | Browser E2E Pass | Real RBAC Admin | **PRODUCTION READY** |
| 27 | **Tự Động Hóa Cảnh Báo SLA** | Side B | `dustguard-operations/apps/server/src/modules/automations/` | Cron / Trigger Service | `automation_rules` | Background Daemon | Idempotent Run Log | Script Verified | Real Background Job | **PRODUCTION READY** |
