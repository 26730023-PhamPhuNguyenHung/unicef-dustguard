# PRODUCTION RECOVERY AUDIT — DUSTGUARD VN
> **Ngày lập**: 04/09/2026 | **Phiên bản**: 1.0.0 | **Tiêu chuẩn**: Zero-Mock, D1 SQLite SSOT, RFC 7807

Tài liệu này lập bản đồ toàn diện hiện trạng hệ thống, phát hiện các điểm ngắt kết nối giữa Frontend, Cloudflare Worker API và Cơ sở dữ liệu D1 SQLite, truy vết lịch sử Git để tìm phiên bản tốt nhất (Best Known Version) và xác định lộ trình phục hồi thực tế.

---

## 1. Bản Đồ Codebase & Hiện Trạng 30 Màn Hình (5 Nhóm Người Dùng)

| STT | Màn hình / Feature | Route / Page | Component | Worker API | DB Table | Service | Auth / Role | Hiện trạng & Vấn đề phát hiện |
|:---:|---|---|---|---|---|---|---|---|
| **01** | Trang chủ Người dân | `/citizen` | `CitizenHomePage.jsx` | `GET /api/complaints`, `GET /api/map` | `complaints`, `sites`, `sensors` | `reportService.js` | Public / Citizen | ⚠️ `recentReports` có fallback `[]`; bản đồ phụ thuộc `/map`. |
| **02** | Báo bụi 5 bước | `/citizen/report/new` | `ReportNewPage.jsx` | `POST /api/complaints`, `POST /api/upload` | `complaints`, `evidences` | `reportService.js`, `evidenceService.js` | Public / Citizen | 🚨 **FAKE FEATURE**: Catch nuốt lỗi khi `POST /complaints` thất bại và sinh mã ảo `DG-2026-XXXX` bằng `Math.random()`, redirect sang Bước 5 giả vờ thành công. Ảnh chưa upload lên R2 qua `/api/upload`. |
| **03** | Xác nhận tiếp nhận | `/citizen/report/confirm/:id` | `ReportConfirmPage.jsx` | `GET /api/complaints/:id` | `complaints`, `evidences` | `reportApi.js` | Public / Citizen | ⚠️ Khi ID không tìm thấy trong DB, fallback sang mock data cứng `DG-2026-0842`. |
| **04** | Hồ sơ của tôi | `/citizen/reports` | `ReportsListPage.jsx` | `GET /api/complaints` | `complaints` | `reportService.js` | Public / Citizen | ✅ Đã kết nối D1 thật qua `/complaints`, lọc 3 tab Tất cả / Đang xử lý / Đã xong. |
| **05** | Chi tiết phản ánh | `/citizen/reports/:id` | `ReportDetailPage.jsx` | `GET /api/complaints/:id` | `complaints`, `evidences`, `case_timelines` | `reportService.js` | Public / Citizen | ✅ Hiển thị stepper 6 bước dọc, kết nối D1 thật. |
| **06** | Kết quả & Đánh giá | `/citizen/reports/:id` (Result/Eval) | `ReportDetailPage.jsx` | `POST /api/complaints/:id/verify` | `complaints`, `audit_logs` | `reportService.js` | Public / Citizen | 🚨 **DEGRADED STUB**: Worker endpoint `/api/complaints/:id/verify` là stub rút gọn, bỏ qua `isSatisfied`, `feedback`, `action: REOPEN_REQUEST`. Trong khi Git history (`complaints.controller.js`) có logic đầy đủ. |
| **07** | Hôm nay của tôi | `/staff` / `/staff/today` | `StaffTodayPage.jsx` | `GET /api/staff/tasks`, `GET /api/cases` | `tasks`, `cases`, `sites` | `inspectionService.js` | Staff, Inspector | 🚨 **BROKEN ROUTE**: `/api/staff/tasks` 404 trên Worker; catch nuốt lỗi và fallback sang map mock data với `Math.random` và số liệu cứng `|| 3`, `|| 1`. |
| **08** | Danh sách nhiệm vụ | `/staff/tasks` | `TasksListPage.jsx` | `GET /api/staff/tasks/list`, `/summary`, `/schedule` | `tasks`, `cases`, `sites` | Express API | Staff, Inspector | 🚨 **MISSING ON WORKER**: Toàn bộ routes `/api/staff/tasks/*` chỉ có trong Express `server/routes/api/staff-tasks.js`, chưa từng được mount trong Cloudflare Worker router! |
| **09** | Chi tiết công trình | `/staff/tasks/:id` | `TaskDetailPage.jsx` | `GET /api/staff/tasks/:id/detail`, `/checklist`, `/complete` | `tasks`, `evidences`, `cases` | Express API | Staff, Inspector | 🚨 **MISSING ON WORKER**: Mọi mutation lưu checklist, upload evidence, complete task đều 404 trên Worker; nhiều nút dùng `alert('...')` thay vì thực thi. |
| **10** | Checklist hiện trường | `/staff/tasks/:id/checklist` | `FieldChecklistPage.jsx` | Chưa nối API | `tasks` | N/A | Staff | ⚠️ Chỉ lưu tạm vào `localStorage` (`inspection_checklist_${id}`), chưa lưu D1 qua API. |
| **11** | Bằng chứng hiện trường | `/staff/tasks/:id/evidence` | `FieldEvidencePage.jsx` | Chưa nối `/api/upload` | `evidences` | `evidenceService.js` | Staff | 🚨 **FAKE VOICE SIMULATION**: Chạy `setTimeout` 1500ms giả lập giọng nói; chỉ lưu ảnh vào `localStorage`, không đẩy R2. |
| **12** | Kết luận kiểm tra | `/staff/tasks/:id/conclusion` | `FieldConclusionPage.jsx` | `PATCH /api/cases/:id` | `cases`, `audit_logs` | `caseService.js` | Staff | 🚨 **SWALLOWED ERROR**: Dùng `.catch(() => null)` trên mutation `/cases/:id`; truyền sai ID nhiệm vụ thay vì ID hồ sơ; báo `alert` thành công giả. |
| **13** | Tổng quan điều phối | `/admin` / `/admin/dashboard` | `AdminDashboardPage.jsx` | `GET /api/admin/system/data-stats`, `/audit-logs` | `users`, `sites`, `cases`, `complaints` | N/A | Admin, Executive | ⚠️ Khi DB trống, fallback sang các hằng số cứng: `users || 5`, `18`, `48.2MB`, và 4 audit logs giả lập. |
| **14** | Điều phối phản ánh | `/admin/dispatch` | `AdminDispatchPage.jsx` | `GET /api/complaints`, `POST /api/cases` | `complaints`, `cases`, `users` | `caseService.js` | Admin, Executive | ✅ Tạo Case thật từ Complaint vào bảng `cases` D1. Cần chuẩn hóa liên kết Complaint -> Case. |
| **15** | Phân công cán bộ | `/admin/dispatch/assign` | `StaffAssignmentPage.jsx` | `PATCH /api/cases/:id` | `cases`, `users` | `assignmentService.js` | Admin | 🚨 **FAKE SUCCESS**: Trong `catch`, hiển thị `alert('Phân công thành công (phiên demo)')` thay vì báo lỗi. |
| **16** | Quản lý hồ sơ vụ việc | `/admin/cases`, `/staff/cases` | `CasesListPage.jsx`, `CaseDetailPage.jsx` | `GET /api/staff/cases/list`, `GET /api/cases/:id` | `cases`, `case_timelines`, `actions` | `caseService.js` | Staff, Admin | ⚠️ `CaseDetailPage.jsx` dòng 626 có fallback hardcode danh sách việc cần làm (`caseData.todoTasks || [...]`). |
| **17** | Quản lý người dùng | `/admin/users` | `UsersPage.jsx` | `GET /api/users`, `POST /api/users` | `users`, `profiles` | `userService.js` | Admin | ✅ Kết nối D1 thật, quản lý vai trò và trạng thái tài khoản. |
| **18** | Cấu hình & Hạ tầng | `/admin/settings` | `SettingsPage.jsx` | `GET /api/admin/system`, `GET /api/config` | `system_configs` | N/A | Admin | ✅ Cấu hình ngưỡng SLA 48h, kiểm tra sức khỏe D1 và R2. |
| **19** | Dashboard nhà thầu | `/contractor` | `ContractorDashboardPage.jsx` | `GET /api/contractor/dashboard`, `/priority` | `actions`, `cases`, `sites` | `contractor.service.js` | Contractor | ✅ Đã kết nối API thật, hỗ trợ token nộp nhanh không cần đăng nhập. |
| **20** | Công trình của tôi | `/contractor/sites` | `ContractorSitesPage.jsx` | `GET /api/sites` | `sites` | N/A | Contractor | ⚠️ Gọi danh sách chung `/sites` thay vì danh sách công trình do nhà thầu phụ trách (`/contractor/projects`). |
| **21** | Yêu cầu khắc phục | `/contractor/tasks` | `ContractorTasksPage.jsx` | `GET /api/contractor/actions` | `actions`, `cases` | `contractor.service.js` | Contractor | ✅ Hiển thị danh sách yêu cầu khắc phục từ D1. |
| **22** | Chi tiết yêu cầu | `/contractor/tasks/:id` | `ContractorTasksPage.jsx` | `GET /api/contractor/actions/:id` | `actions` | `contractor.service.js` | Contractor | ✅ Hiển thị 10 tiêu chí tuân thủ, thời hạn SLA 48h. |
| **23** | Gửi minh chứng | `/contractor/tasks/:id` (Modal) | `ContractorTasksPage.jsx` | `POST /api/contractor/actions/:id/evidence` | `actions`, `evidences` | `contractor.service.js` | Contractor | ✅ Upload ảnh Before/After, kiểm tra geofence WGS84 50m. |
| **24** | Lịch sử tuân thủ | `/contractor/compliance` | `ContractorCompliancePage.jsx` | Chưa nối API | `actions`, `inspections` | N/A | Contractor | 🚨 **100% HARDCODED MOCK**: Chỉ số `onTimeRemediationRate: 94.2%`, `totalInspections: 18` và timeline sự kiện đều là biến JS tĩnh trong code, không gọi bất kỳ API nào. |
| **25** | Trang chủ cộng đồng | `/community` | `CommunityHomePage.jsx` | `GET /api/community/impact`, `/campaigns` | `campaigns`, `observations` | N/A | Community, Youth | ✅ Nối API D1 thật qua `/api/community/impact`. |
| **26** | Bản đồ mở | `/community/map` | `CommunityMapPage.jsx` | `GET /api/map`, `GET /api/sensors` | `sensors`, `sites` | N/A | Public, Community | ✅ Leaflet bản đồ trạm và vùng đệm nhạy cảm 200m. |
| **27** | Ghi nhận hiện trường | `/community/observe` | `CommunityObservePage.jsx` | `POST /api/complaints` | `complaints`, `evidences` | N/A | Community, Youth | 🚨 **SWALLOWED ERROR**: Bấm gửi thì `.catch(() => null)` rồi `setSuccess(true); // Graceful fallback`. |
| **28** | Nhiệm vụ an toàn | `/community/missions` | `CommunityMissionsPage.jsx` | Chưa nối API | `tasks`, `campaigns` | N/A | Community, Youth | 🚨 **100% HARDCODED MOCK**: Mảng `COMMUNITY_MISSIONS` 3 nhiệm vụ là dữ liệu tĩnh trong code; nút nhận nhiệm vụ không lưu D1. |
| **29** | Tín chỉ & Giờ công | `/community/credits` | `CommunityCreditsPage.jsx` | `GET /api/complaints`, `/api/youth/claim` | `complaints`, `youth_credits` | `youth-credits.js` | Community, Youth | ⚠️ Lịch sử hoạt động là mảng tĩnh; tính toán giờ quy đổi đã có hàm chuẩn (20h = 4.0 tín chỉ). |
| **30** | Bảng tác động CLB | `/community/impact` | `CommunityImpactPage.jsx` | Chưa nối API | `clubs`, `campaigns` | N/A | Community, Youth | 🚨 **100% HARDCODED MOCK**: `COMMUNITY_CLUBS` và các chỉ số 18 CLB, 24 khu vực, 680h đều là mảng tĩnh; trong khi backend Worker đã có `/api/community/impact` và `/api/community/clubs`. |

---

## 2. Phát Hiện Kiến Trúc Gốc Rễ: Express vs Cloudflare Worker

Hệ thống có hai bộ định tuyến backend:
1. **Cloudflare Worker Hono Router (`app/server/routes/worker/*`)**: Chạy ở runtime qua `wrangler dev` trên port `8787` (được proxy qua Vite port `3000`). Đây là **SSOT Production Runtime** theo `AGENTS.md`.
2. **Express Router (`app/server/routes/api/*`)**: Bộ định tuyến Node.js Express cũ.

### Các Endpoints Bị Bỏ Quên Chưa Đưa Vào Worker:
- `server/routes/api/staff-tasks.js` (18,219 bytes): Chứa 10 API nghiệp vụ cán bộ thực địa (`/api/staff/tasks/summary`, `/api/staff/tasks/list`, `/api/staff/tasks/:id/detail`, `/api/staff/tasks/:id/checklist`, `/api/staff/tasks/:id/evidence`, `/api/staff/tasks/:id/complete`...). Tất cả 404 trên Worker.
- `server/routes/api/staff-reports.js` (7,322 bytes): `/api/staff/reports/*` 404 trên Worker.
- `server/routes/api/staff-notifications.js` (5,226 bytes): `/api/staff/notifications/*` 404 trên Worker.
- `server/controllers/complaints.controller.js` (Verify logic): Logic đầy đủ về xác nhận người dân (`isSatisfied`, `feedback`, `action: REOPEN_REQUEST`, cập nhật `closedAt`, ghi audit log và cộng điểm) chỉ có ở Express controller, bị rút gọn thành stub 5 dòng ở Worker `complaints.routes.js`.
