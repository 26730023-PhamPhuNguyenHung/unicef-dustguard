# DUSTGUARD VN — AUDIT 02: ROLE & CAPABILITY INVENTORY

> **Mã tài liệu**: `DG-AUDIT-02-ROLE-INVENTORY`  
> **Thời điểm kiểm toán**: 05/09/2026  
> **Mục tiêu**: Liệt kê toàn bộ các chuỗi vai trò (role strings), nơi xuất hiện, cơ chế kiểm tra (Guard), quyền hạn thực tế và phân định rõ ràng giữa Legacy Model (5 nhóm) và New Product Model (2 Sides).

---

## 1. BẢNG KIỂM KÊ TOÀN BỘ ROLE STRING TRONG CODEBASE

| Role string | Found where | Frontend | Backend | DB | Tests | Actual capability | Legacy / New / Unknown |
|---|---|---|---|---|---|---|:---:|
| **`citizen`** | `app/src/lib/rbac-rules.js`<br>`apps/server/src/db/schema.ts`<br>`packages/shared/src/types/index.ts` | Route `/citizen/*`<br>Protected routes `report:create` | `requireRole('citizen')`<br>`authenticateToken` | `users.role` (D1 & SQLite) | `community-api.test.js`<br>`citizen-observation-lifecycle.test.js` | Gửi phản ánh (Report), xem bản đồ, tra cứu tiến độ vụ việc, bấm "Tôi cũng ghi nhận" (confirm), theo dõi vụ việc (follow). | **ACTIVE_CANONICAL (Side A)** |
| **`community`** | `app/src/lib/rbac-rules.js`<br>`app/src/apps/community/` | Route `/community/*`<br>Sidebar Community Hub | Hono `/api/community/*` | `users.role = 'community'` (D1) | `tests/community-api.test.js`<br>`domain-logic.test.js` | Nhận nhiệm vụ khảo sát, ghi nhận thực địa, tích lũy giờ tình nguyện và tín chỉ thanh niên. | **LEGACY (Được chuẩn hóa thành `community_member` trong Side A)** |
| **`community_member`** / **`member`** | `apps/server/src/db/schema.ts`<br>`packages/shared/src/constants/permissions.ts` | Menu Nhiệm vụ `/tasks`, Đóng góp `/contributions`, Tham gia CLB `/communities` | Quyền `task:claim`, `task:submit`, `observation:create` | `users.role = 'community_member'` | `community-api.test.js` (Role switch, task claim) | Toàn quyền của `citizen` + nhận & nộp nhiệm vụ xác minh thực địa (+20pts), nộp quan sát Before/After, tham gia hoạt động CLB. | **ACTIVE_CANONICAL (Side A)** |
| **`moderator`** | `apps/server/src/routes/moderator.routes.ts`<br>`apps/web/src/pages/ModeratorDashboardPage.tsx` | Route `/moderator/*` (Inbox, Verify, Coordination, Content Queue) | `requireRole('moderator', 'admin')` | `users.role = 'moderator'` | `community-api.test.js` (Verify report, create case, merge) | Thẩm định phản ánh, xác thực ảnh/tọa độ, gom trùng lặp, khởi tạo hồ sơ vụ việc cộng đồng, cập nhật Kanban, xử lý báo cáo vi phạm. | **ACTIVE_CANONICAL (Side A / Handoff Lead)** |
| **`youth_member`** / **`youth`** | `app/src/lib/rbac-rules.js`<br>`app/src/modules/youth/` | Route `/youth/credits`, `/citizen/credits` | Alias chuyển đổi về `community` | Không có enum riêng (lưu metadata) | `verify-youth-credits.test.js` | Sinh viên/thanh niên tham gia tích lũy 20h tình nguyện quy đổi 4.0 tín chỉ ngoại khóa kèm mã QR ISO/IEC 18004. | **LEGACY ALIAS (Thuộc Side A - Member)** |
| **`staff`** | `app/src/lib/rbac-rules.js`<br>`dustguard-operations/packages/shared/src/permissions.ts`<br>`app/src/apps/staff/` | Route `/staff/*`<br>Operations `/cases`, `/inspections`, `/actions` | Hono Worker `/api/staff/*`<br>Operations `/api/cases/*` | `users.role = 'staff'` (D1 & SQLite) | `staff-monitoring-d1-api.test.js`<br>`operations-api.test.js` | Tiếp nhận vụ việc, thanh tra hiện trường (10 tiêu chí QCVN 18/BXD), yêu cầu khắc phục, xem telemetry cảm biến, thẩm tra Before/After. | **ACTIVE_CANONICAL (Side B)** |
| **`inspector`** | `app/src/lib/rbac-rules.js` | Chuẩn hóa về `staff` trong `normalizeRole()` | Hono Worker `/api/inspections` | Alias của `staff` | `dev-runtime-verification.test.js` | Cán bộ trực tiếp khảo sát thực địa tại công trình xây dựng. | **LEGACY ALIAS (Map về `staff` thuộc Side B)** |
| **`supervisor`** | `dustguard-operations/packages/shared/src/permissions.ts`<br>`dustguard-operations/apps/server/src/middleware/rbac.ts` | Operations `/supervisor/workload`, Phân công cán bộ | Quyền `case:assign`, `case:close`, `case:reopen`, `workload:view` | `users.role = 'supervisor'` (Operations DB) | `operations-api.test.js` | Điều phối khối lượng công việc, giao vụ việc cho cán bộ phụ trách, phê duyệt đóng hồ sơ an toàn 4 bước, mở lại vụ việc. | **ACTIVE_CANONICAL (Side B)** |
| **`legal_reviewer`** | `dustguard-operations/packages/shared/src/permissions.ts` | Operations `/cases/:id/legal`, Thư viện FTS5 `/legal/library` | Quyền `legal:review`, `legal:approve`, `legal:import` | `users.role = 'legal_reviewer'` (Operations DB) | `operations-api.test.js` | Tra cứu FTS5 quy chuẩn (QCVN 05, NĐ 45, Luật BVMT 2020), lập và ký duyệt biên bản đánh giá pháp lý môi trường. | **ACTIVE_CANONICAL (Side B)** |
| **`contractor`** | `app/src/lib/rbac-rules.js`<br>`app/src/apps/contractor/` | Route `/contractor/*`<br>Operations Remediation Modal | Hono Worker `/api/contractor/*`<br>Operations Quick-Token API | `users.role = 'contractor'` (D1 & SQLite) | `operations-api.test.js` (Geofence 50m) | Đại diện đơn vị thi công nhận yêu cầu khắc phục (rửa xe, phủ bạt), nộp minh chứng Before/After trong Geofence $\le 50\text{m}$. | **ADAPTED CAPABILITY (Side B Action Provider)** |
| **`executive`** | `app/src/lib/rbac-rules.js`<br>`app/src/apps/executive/` | Route `/executive/*` (Dashboard, Heatmap, Reports) | Hono Worker `/api/executive/*` | `users.role = 'executive'` (D1) | `api-response-contract.test.js` | Lãnh đạo Sở/Quận xem báo cáo tổng hợp, bản đồ nhiệt ô nhiễm và ký số duyệt báo cáo định kỳ theo Nghị định 30/2020/NĐ-CP. | **LEGACY (Hợp nhất vào Side B - Supervisor / Program Manager)** |
| **`admin`** | `app/src/lib/rbac-rules.js`<br>`apps/server/src/routes/admin.routes.ts`<br>`dustguard-operations/apps/server/src/modules/admin/` | Route `/admin/*` (Users, Audit, System Configs) | `requireRole('admin')`<br>Middleware `admin:*` | `users.role = 'admin'` (Cả 3 DB) | `community-api.test.js`<br>`operations-api.test.js` | Quản trị tài khoản, kiểm soát phân quyền, xem log kiểm toán bất biến SHA-256, cấu hình tham số hệ thống. | **ACTIVE_CANONICAL (System Scope)** |
| **`demo_admin`** / **`super_admin`** | `app/src/lib/rbac-rules.js` | Chuẩn hóa về `admin` trong `normalizeRole()` | Phục vụ demo phòng thi đấu | Tồn tại trong seed data cũ | `dev-runtime-verification.test.js` | Quyền quản trị tối cao phục vụ reset database và demo. | **LEGACY ALIAS (Map về `admin`)** |
| **`public`** / **`guest`** | `docs/final-product-architecture.md`<br>`apps/web/src/pages/LandingPage.tsx` | Route `/`, `/landing`, `/map`, `/reports/:id` (chế độ xem) | Không cần JWT header | Không lưu bảng users | `community-api.test.js` | Khách vãng lai xem Landing Page, xem Bản đồ bụi công khai, tra cứu hồ sơ không cần đăng nhập. | **ACTIVE_CANONICAL (Unauthenticated)** |

---

## 2. PHÂN TÍCH XUNG ĐỘT PHÂN QUYỀN (AUTHORIZATION CONFLICTS)

1. **Xung đột Kiểm tra Path-based vs Capability-based**:
   - `app/` (Legacy) dùng hàm `isRoleAllowedForPath(role, path)` kiểm tra chuỗi URL bắt đầu bằng `/staff`, `/admin`, `/contractor`... gây lỗi bảo mật nếu route con không có guard hoặc khi vai trò được mở rộng.
   - `apps/web` và `dustguard-operations` dùng **Capability-based Authorization** (`can('case:triage')`, `ProtectedRoute permission="report:create"`), đây là kiến trúc chuẩn mực cao hơn hẳn.

2. **Sự phân hóa Cơ sở Dữ liệu của Role**:
   - Trong `apps/server` (Community): Enum cột `role` chỉ gồm `['citizen', 'community_member', 'moderator', 'admin']`.
   - Trong `dustguard-operations` (Operations): Enum cột `role` gồm `['staff', 'supervisor', 'legal_reviewer', 'admin']`.
   - Trong `app/` (Legacy D1): Enum cột `role` gồm `['citizen', 'community', 'staff', 'contractor', 'executive', 'admin']`.

3. **Bản chất của Contractor**:
   - Trong Legacy Model, `contractor` được đối xử như một ứng dụng web riêng biệt (`/contractor/*`), nhưng trên thực tế nhà thầu chỉ tương tác khi có yêu cầu khắc phục cụ thể qua liên kết Quick-Token không cần mật khẩu kèm Geofence 50m. Vì vậy, `contractor` chính xác là một **Capability (Action Provider)** của Side B chứ không phải một nhóm người dùng quản trị độc lập.
