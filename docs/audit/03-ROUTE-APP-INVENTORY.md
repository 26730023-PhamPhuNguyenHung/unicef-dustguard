# DUSTGUARD VN — AUDIT 03: ROUTE & APPLICATION INVENTORY

> **Mã tài liệu**: `DG-AUDIT-03-ROUTE-APP-INVENTORY`  
> **Thời điểm kiểm toán**: 05/09/2026  
> **Mục tiêu**: Kiểm kê toàn bộ routes đang tồn tại trong 3 phân hệ (`apps/web`, `dustguard-operations`, và `app/`), xác định Layout, Route Guard, Quyền hạn (Allowed Roles/Permissions), API được gọi, Bảng CSDL bị tác động, Domain nghiệp vụ và gán nhãn trạng thái chính xác.

---

## 1. PHÂN LOẠI TRẠNG THÁI ROUTE (STATUS TAXONOMY)
Mọi route chỉ được gán đúng một trong các trạng thái chuẩn:
- **`ACTIVE_NEW`**: Route thuộc kiến trúc 2-Side chuẩn mới (Community Side A hoặc Professional Side B), đang chạy thực tế, kết nối API và CSDL thật.
- **`ACTIVE_LEGACY`**: Route thuộc thế hệ 1 (`app/`), vẫn đang phục vụ test suites hoặc quy trình cũ nhưng cần lộ trình chuyển giao/redirect.
- **`DUPLICATED`**: Route bị trùng lặp chức năng giữa 2 thế hệ hoặc giữa các apps khác nhau.
- **`ORPHAN`**: Route có file component nhưng không được mount vào router hoặc không có đường dẫn tới.
- **`BROKEN`**: Route được mount nhưng logic API đứt gãy, thiếu bảng CSDL, hoặc fail runtime.
- **`DEAD`**: Route hoàn toàn không còn giá trị, chỉ chứa mock data hoặc redirect vòng lặp.

---

## 2. MA TRẬN ROUTE CHI TIẾT (FULL ROUTE MATRIX)

### A. PHÂN HỆ COMMUNITY (SIDE A — `apps/web` + `apps/server`, Port 3000 / 3001)

| Route | Layout | Guard (Permission / Role) | Allowed Roles | API Called | DB Touched | Domain | Status |
|---|---|---|---|---|---|---|:---:|
| `/` & `/landing` | None (Public) | None | Guest / Public | N/A | None | Landing, Giới thiệu, Câu chuyện bài toán | **ACTIVE_NEW** |
| `/login` | AuthLayout | PublicOnly | Guest | `POST /api/auth/login` | `users` | Xác thực người dùng | **ACTIVE_NEW** |
| `/register` | AuthLayout | PublicOnly | Guest | `POST /api/auth/register` | `users` | Đăng ký tài khoản | **ACTIVE_NEW** |
| `/dashboard` | `AppShell` | Authenticated | All authenticated | `GET /api/community/overview` | `cases`, `reports`, `users` | Tổng quan cộng đồng | **ACTIVE_NEW** |
| `/map` | `AppShell` | Public / Authenticated | All | `GET /api/map/markers`, `GET /api/map/layers` | `cases`, `reports`, `sites` | Bản đồ giám sát ô nhiễm | **ACTIVE_NEW** |
| `/reports` | `AppShell` | Authenticated | All | `GET /api/reports` | `reports`, `report_media` | Danh sách phản ánh cộng đồng | **ACTIVE_NEW** |
| `/reports/new` | `AppShell` | `report:create` | `citizen`, `community_member`, `moderator`, `admin` | `POST /api/reports` | `reports`, `report_media`, `audit_logs` | Tạo phản ánh vi phạm bụi | **ACTIVE_NEW** |
| `/reports/:id` | `AppShell` | Public / Authenticated | All | `GET /api/reports/:id`, `POST /confirm` | `reports`, `report_confirmations` | Chi tiết phản ánh & xác nhận | **ACTIVE_NEW** |
| `/cases/:id` | `AppShell` | Public / Authenticated | All | `GET /api/cases/:id`, `GET /updates` | `cases`, `case_updates`, `saved_cases` | Chi tiết vụ việc cộng đồng | **ACTIVE_NEW** |
| `/cases/:id/observe` | `AppShell` | `observation:create` | `community_member`, `moderator`, `admin` | `POST /api/cases/:id/observations` | `observations`, `evidence_media` | Ghi nhận bằng chứng thực địa | **ACTIVE_NEW** |
| `/following` | `AppShell` | `case:follow` | `citizen`, `community_member`, `moderator` | `GET /api/users/saved-cases` | `saved_cases`, `cases` | Danh sách vụ việc đang theo dõi | **ACTIVE_NEW** |
| `/communities` | `AppShell` | Authenticated | All | `GET /api/communities` | `communities`, `community_members` | Mạng lưới CLB thanh niên | **ACTIVE_NEW** |
| `/communities/:slug`| `AppShell` | Authenticated | All | `GET /api/communities/:slug` | `communities`, `tasks` | Không gian hoạt động CLB | **ACTIVE_NEW** |
| `/tasks` | `AppShell` | `task:view` | `community_member`, `moderator`, `admin` | `GET /api/tasks`, `POST /tasks/:id/claim` | `tasks`, `task_assignments` | Nhiệm vụ xác minh thực địa | **ACTIVE_NEW** |
| `/contributions` | `AppShell` | `contribution:view`| `community_member`, `moderator`, `admin` | `GET /api/users/contributions` | `reports`, `observations`, `points` | Điểm đóng góp & giờ tình nguyện | **ACTIVE_NEW** |
| `/notifications` | `AppShell` | `notification:view`| All authenticated | `GET /api/notifications` | `notifications` | Hộp thư thông báo cá nhân | **ACTIVE_NEW** |
| `/profile` | `AppShell` | `profile:manage` | All authenticated | `GET /api/users/me`, `PUT /me` | `users` | Thông tin tài khoản cá nhân | **ACTIVE_NEW** |
| `/moderator/inbox` | `AppShell` | `moderator:inbox` | `moderator`, `admin` | `GET /api/moderator/reports` | `reports`, `report_media` | Hộp thư thẩm định phản ánh | **ACTIVE_NEW** |
| `/moderator/verification/:id` | `AppShell` | `moderator:verify` | `moderator`, `admin` | `POST /api/moderator/reports/:id/verify` | `reports`, `cases`, `audit_logs` | Xác thực phản ánh / Tạo case | **ACTIVE_NEW** |
| `/moderator/cases` | `AppShell` | `moderator:coordinate_cases` | `moderator`, `admin` | `GET /api/cases`, `PATCH /status` | `cases`, `case_updates` | Điều phối Kanban vụ việc | **ACTIVE_NEW** |
| `/moderator/content` | `AppShell` | `moderator:moderate_content` | `moderator`, `admin` | `GET /api/moderator/content` | `content_reports` | Hàng đợi kiểm duyệt nội dung | **ACTIVE_NEW** |
| `/moderator/dashboard` | `AppShell` | `moderator:stats` | `moderator`, `admin` | `GET /api/moderator/stats` | `reports`, `cases`, `users` | Dashboard điều phối viên | **ACTIVE_NEW** |
| `/admin/overview` | `AppShell` | `admin:stats` | `admin` | `GET /api/admin/overview` | `users`, `reports`, `cases` | Bảng điều khiển quản trị | **ACTIVE_NEW** |
| `/admin/users` | `AppShell` | `admin:users` | `admin` | `GET /api/admin/users`, `PATCH /role` | `users`, `audit_logs` | Quản trị tài khoản & cấp quyền | **ACTIVE_NEW** |
| `/admin/audit` | `AppShell` | `admin:audit` | `admin` | `GET /api/admin/audit` | `audit_logs` | Nhật ký kiểm toán SHA-256 | **ACTIVE_NEW** |

---

### B. PHÂN HỆ PROFESSIONAL / OPERATIONS (SIDE B — `dustguard-operations`, Port 3002 / 4000)

| Route | Layout | Guard (Role / Capability) | Allowed Roles | API Called | DB Touched | Domain | Status |
|---|---|---|---|---|---|---|:---:|
| `/login` | None | Public | All | `POST /api/auth/login` | `users` | Xác thực cán bộ / nghiệp vụ | **ACTIVE_NEW** |
| `/dashboard` | `AppLayout` | Authenticated | `staff`, `supervisor`, `legal_reviewer`, `admin` | `GET /api/dashboard/stats` | `cases`, `inspections`, `actions` | Trung tâm điều hành nghiệp vụ | **ACTIVE_NEW** |
| `/cases` | `AppLayout` | Authenticated | `staff`, `supervisor`, `legal_reviewer`, `admin` | `GET /api/cases` (Filter/Sort) | `cases`, `contractors` | Tiếp nhận & Hàng đợi vụ việc | **ACTIVE_NEW** |
| `/cases/:id` | `AppLayout` | Authenticated | All professional roles | `GET /api/cases/:id` | `cases`, `case_timeline`, `evidence` | Hồ sơ vụ việc chi tiết | **ACTIVE_NEW** |
| `/cases/:id/timeline` | `AppLayout` | Authenticated | All professional roles | `GET /api/cases/:id/timeline` | `case_timeline` | Dòng thời gian pháp lý vụ việc | **ACTIVE_NEW** |
| `/cases/:id/legal` | `AppLayout` | `legal:review` | `legal_reviewer`, `supervisor`, `admin` | `POST /api/cases/:id/legal-review` | `legal_assessments`, `cases` | Không gian đánh giá pháp lý | **ACTIVE_NEW** |
| `/cases/:id/inspection/new` | `AppLayout` | `inspection:create` | `staff`, `supervisor`, `admin` | `POST /api/inspections` | `inspections`, `cases` | Lập kế hoạch kiểm tra hiện trường | **ACTIVE_NEW** |
| `/inspections` | `AppLayout` | Authenticated | `staff`, `supervisor`, `admin` | `GET /api/inspections` | `inspections` | Danh sách kế hoạch thanh tra | **ACTIVE_NEW** |
| `/inspections/:id` | `AppLayout` | `inspection:execute` | `staff`, `admin` | `GET /api/inspections/:id` | `inspections`, `cases` | Checklist kiểm tra hiện trường (10 TC) | **ACTIVE_NEW** |
| `/inspections/:id/result` | `AppLayout` | `inspection:execute` | `staff`, `admin` | `POST /api/inspections/:id/complete` | `inspections`, `actions`, `cases` | Kết luận thanh tra & Lệnh khắc phục | **ACTIVE_NEW** |
| `/actions` | `AppLayout` | Authenticated | All professional roles | `GET /api/actions` | `corrective_actions` | Giám sát các biện pháp khắc phục | **ACTIVE_NEW** |
| `/actions/:id/remediation` | `AppLayout` | `action:verify` | `staff`, `supervisor`, `admin` | `POST /api/actions/:id/verify` | `corrective_actions`, `evidence` | Thẩm tra khắc phục Before/After | **ACTIVE_NEW** |
| `/legal/library` | `AppLayout` | Authenticated | All professional roles | `GET /api/legal/search?q=` (FTS5) | `legal_documents_fts`, `articles` | Thư viện quy chuẩn & luật môi trường | **ACTIVE_NEW** |
| `/legal/import` | `AppLayout` | `legal:import` | `legal_reviewer`, `admin` | `POST /api/legal/documents` | `legal_documents`, `articles` | Nhập văn bản pháp quy mới | **ACTIVE_NEW** |
| `/supervisor/workload` | `AppLayout` | `workload:view` | `supervisor`, `admin` | `GET /api/supervisor/workload` | `users`, `cases`, `inspections` | Điều phối khối lượng công việc cán bộ | **ACTIVE_NEW** |
| `/contractors` | `AppLayout` | Authenticated | All professional roles | `GET /api/contractors` | `contractors`, `cases` | Danh bạ các nhà thầu thi công | **ACTIVE_NEW** |
| `/projects` | `AppLayout` | Authenticated | All professional roles | `GET /api/projects` | `projects`, `contractors` | Danh mục dự án công trình xây dựng | **ACTIVE_NEW** |
| `/iot/devices` | `AppLayout` | Authenticated | All professional roles | `GET /api/iot/devices` | `iot_devices`, `iot_telemetry` | Quản lý cảm biến & nồng độ bụi realtime| **ACTIVE_NEW** |
| `/automations` | `AppLayout` | `automation:manage` | `admin`, `supervisor` | `GET /api/automations` | `automations`, `automation_logs` | Cấu hình ngưỡng cảnh báo tự động | **ACTIVE_NEW** |
| `/evidence` | `AppLayout` | Authenticated | All professional roles | `GET /api/evidence` | `evidence_vault` | Kho lưu trữ chứng cứ số SHA-256 | **ACTIVE_NEW** |
| `/reports` | `AppLayout` | Authenticated | `supervisor`, `admin` | `GET /api/reports/operational` | `cases`, `inspections` | Báo cáo điều hành & thống kê định kỳ | **ACTIVE_NEW** |
| `/admin/users` | `AppLayout` | `admin:users` | `admin` | `GET /api/admin/users` | `users` | Quản lý tài khoản chuyên trách | **ACTIVE_NEW** |
| `/admin/audit` | `AppLayout` | `admin:audit` | `admin` | `GET /api/admin/audit` | `audit_logs` | Nhật ký kiểm toán hành vi cán bộ | **ACTIVE_NEW** |

---

### C. PHÂN HỆ LEGACY MONOLITH (`app/`, Cũ)

| Route | Layout | Guard | Allowed Roles | API Called | DB Touched | Phân tích & Trạng thái |
|---|---|---|---|---|---|---|
| `/staff/cases` | `StaffLayout` | `isRoleAllowedForPath` | `staff`, `admin` | `GET /api/staff/cases/summary`<br>`GET /api/staff/cases/list` | D1 `cases` (`prisma/dev.db`) | **DUPLICATED / ACTIVE_LEGACY**: Bị trùng lặp nặng với `/cases` của `dustguard-operations`. Có fallback dữ liệu tĩnh (38 open cases). Nút "Tạo hồ sơ" gọi `POST /cases` ghi vào D1 cũ. |
| `/staff/cases/:id` | `StaffLayout` | `isRoleAllowedForPath` | `staff`, `admin` | `GET /api/staff/cases/:id/detail` | D1 `cases`, `case_timelines` | **DUPLICATED / ACTIVE_LEGACY**: Trùng với `/cases/:id` của `dustguard-operations`. Không có FTS5 Legal AI và không có 4-condition closure gate. |
| `/staff/today` | `StaffLayout` | `isRoleAllowedForPath` | `staff` | `GET /api/staff/dashboard/today` | D1 `tasks`, `cases` | **ACTIVE_LEGACY**: Phục vụ bài thi mobile 1 tay của thanh tra viên; 30 unit tests đang assert route này. |
| `/staff/tasks/*` | `StaffLayout` | `isRoleAllowedForPath` | `staff` | `GET /api/tasks/*`, `POST /checklist` | D1 `tasks`, `inspections` | **DUPLICATED / ACTIVE_LEGACY**: Trùng chức năng với `/inspections/*` của `dustguard-operations`. |
| `/staff/sites/*` | `StaffLayout` | `isRoleAllowedForPath` | `staff` | `GET /api/sites/*` | D1 `sites` | **DUPLICATED / ACTIVE_LEGACY**: Trùng chức năng với `/projects` của Operations. |
| `/citizen/*` | `CitizenLayout` | `isRoleAllowedForPath` | `citizen` | Hono Worker `/api/citizen/*` | D1 `complaints` | **DUPLICATED / ACTIVE_LEGACY**: Trùng chức năng toàn bộ với `/reports` & `/dashboard` của `apps/web`. |
| `/community/*` | `CommunityLayout`| `isRoleAllowedForPath` | `community` | Hono Worker `/api/community/*` | D1 `youth_credits`, `tasks` | **DUPLICATED / ACTIVE_LEGACY**: Trùng chức năng với `/communities`, `/tasks`, `/contributions` của `apps/web`. |
| `/contractor/*` | `ContractorLayout`| `isRoleAllowedForPath` | `contractor` | Hono Worker `/api/contractor/*` | D1 `rectifications` | **DUPLICATED / ACTIVE_LEGACY**: Khái niệm portal riêng cho contractor là legacy; kiến trúc mới dùng Quick-Token trực tiếp từ `corrective_actions`. |
| `/executive/*` | `ExecutiveLayout` | `isRoleAllowedForPath` | `executive` | Hono Worker `/api/executive/*` | D1 `cases`, `stats` | **DUPLICATED / ACTIVE_LEGACY**: Trùng chức năng với `/dashboard` và `/reports` của `dustguard-operations`. |
| `/admin/*` | `AdminLayout` | `isRoleAllowedForPath` | `admin` | Hono Worker `/api/admin/*` | D1 `users`, `audit_logs` | **DUPLICATED / ACTIVE_LEGACY**: Trùng chức năng với `/admin/*` của cả `apps/web` và `dustguard-operations`. |
| `/documents/*` | None | None | All | Worker `/api/documents/*` | D1 `documents` | **ACTIVE_LEGACY**: Trình soạn thảo văn bản hành chính NĐ 30/2020. Nghiệp vụ này cần được tích hợp vào Side B. |
| `/policy/*` | None | None | All | Worker `/api/policy/*` | D1 `policies` | **ACTIVE_LEGACY**: Cũ hơn thư viện FTS5 Legal AI của `dustguard-operations`. |

---

## 3. ĐIỀU TRA ĐẶC BIỆT: ROUTE `/staff/cases` TRONG `app/`

Yêu cầu audit làm rõ 6 câu hỏi bản chất về `/staff/cases`:

1. **Đây có phải flow mới hay legacy?**
   - **KẾT LUẬN: ĐÂY LÀ LEGACY FLOW (Thế hệ 1)**. Giao diện được xây dựng bằng React 19 JSX trong `app/src/apps/staff/pages/cases/CasesListPage.jsx`, kết nối tới Hono Edge Worker (`app/server/routes/worker/staff.routes.js`), độc lập hoàn toàn với `dustguard-operations`.
2. **Case này thuộc domain mới hay chỉ là Staff legacy?**
   - **KẾT LUẬN: LÀ STAFF LEGACY DOMAIN**. Entity `cases` trong D1 chỉ chứa các trường cơ bản (`siteId`, `complaintId`, `inspectionId`, `currentStep`, `slaDeadline`), không có cấu trúc nguồn gốc đa kênh (`source`, `source_reference`, `source_report_count`), không có liên kết với FTS5 pháp lý.
3. **Dữ liệu có nối observation/community signal hay không?**
   - **KẾT LUẬN: KHÔNG KẾT NỐI VỚI COMMUNITY MỚI**. Nó chỉ trỏ tới cột `complaintId` (phản ánh của citizen trong D1 cũ `prisma/dev.db`). Các phản ánh (`reports`) và quan sát (`observations`) tạo từ `apps/web` lưu trong `data/dustguard-community.db` hoàn toàn không xuất hiện ở route này!
4. **CTA "Tạo hồ sơ" tạo entity gì?**
   - **KẾT LUẬN: TẠO ROW TRONG BẢNG `cases` CỦA D1 CŨ**. Khi bấm submit form, code gọi `POST /cases` (Hono worker dòng 99 `cases.routes.js`), ghi 1 bản ghi vào bảng `cases`, 1 dòng vào `case_timelines`, 1 dòng vào `case_status_history`, và 1 dòng vào `audit_logs` của D1 SQLite cũ.
5. **Trạng thái case có thật sự persistence?**
   - **KẾT LUẬN: CÓ PERSISTENCE VÀO D1 CŨ, NHƯNG CÓ FALLBACK MOCK NẾU LỖI**. Dữ liệu được ghi bền vững vào `prisma/dev.db`. Tuy nhiên, nếu API trả về mảng rỗng hoặc lỗi mạng, code frontend tự động gán dữ liệu giả (`CASE-2026-001`, `CASE-2026-002`, `CASE-2026-003`) gây hiểu lầm cho người kiểm thử.
6. **Priority widget lấy dữ liệu từ đâu?**
   - **KẾT LUẬN: LẤY TỪ QUERY SQLITE D1 HOẶC FALLBACK STATIC ARRAY**. Backend chạy câu lệnh:
     ```sql
     SELECT c.id, c.code, c.title, c.status, c.slaDeadline as deadline, ... 
     FROM cases c LEFT JOIN sites s ON c.siteId = s.id 
     WHERE c.deletedAt IS NULL AND c.status != 'CLOSED' ORDER BY c.createdAt DESC LIMIT 3
     ```
     Nếu bảng không có dữ liệu, API trả về 3 phần tử mock cứng (`DG-CASE-2026-081`, `DG-CASE-2026-079`, `DG-CASE-2026-075`).
