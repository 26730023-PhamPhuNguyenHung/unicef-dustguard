# DUSTGUARD VN — AUDIT 01: SSOT SOURCES INVENTORY & RECONCILIATION

> **Mã tài liệu**: `DG-AUDIT-01-SSOT-SOURCES`  
> **Thời điểm kiểm toán**: 05/09/2026  
> **Mục tiêu**: Khảo sát, đối chiếu và đánh giá tính hợp lệ của toàn bộ tài liệu kiến trúc, đặc tả, timeline và hợp đồng hiện hữu trong repository nhằm xác định đâu là SSOT thực tế và đâu là tài liệu đã bị lỗi thời (stale).

---

## 1. BẢNG ĐỐI CHIẾU CÁC NGUỒN TÀI LIỆU KIẾN TRÚC HIỆN TỒN

| Tài liệu (Source) | Ngày / Mốc Commit | Nội dung kiến trúc tuyên bố | Còn hiệu lực? (Still valid?) | Mâu thuẫn phát hiện (Conflicts) |
|---|---|---|:---:|---|
| **`AGENTS.md`** (Root) | 2026-09-05 (`main`) | Master Operating System: D1 is SSOT (`prisma/dev.db`), 0 glassmorphism, Light mode, Touch target $\ge 44\text{px}$, Zero Jargon UI, 8-Stage Development Loop. | **CÒN HIỆU LỰC MỘT PHẦN** (Nguyên tắc thiết kế & DoD vẫn sống) | Đang tham chiếu trực tiếp đến harness tests trong `app/tests/` (Core SPA cũ), chưa bao hàm `apps/` (Community) và `dustguard-operations/`. |
| **`.agents/SSOT.md`** | 2026-08 (v2.0 Master SSOT) | 12 bảng CSDL D1 Core, 5 vai trò cố định (`public`, `citizen`, `community`, `staff`, `executive`), chu trình xử lý vụ việc 7 bước (Case Enforcement DAG). | **ĐÃ LỖI THỜI (STALE)** | Xem 5 nhóm người dùng là các phân hệ tách biệt (`/citizen`, `/staff`...); chưa phản ánh mô hình 2-Side Product (Community vs Professional) và mô hình phân quyền năng lực (Capability-based). |
| **`docs/final-product-architecture.md`** | 28/08/2026 (v2.0.0) | Định nghĩa 6 Actor con người (`public`, `citizen`, `community`, `staff`, `contractor`, `admin`) và 1 IoT Node; chia thành 5 web apps riêng biệt (`/citizen`, `/community`, `/staff`, `/contractor`, `/admin`). | **ĐÃ LỖI THỜI (STALE)** | Cố định vai trò người dùng vào từng URL namespace legacy; coi Contractor là một portal riêng biệt thay vì là một Action Provider thuộc chu trình Professional; dữ liệu vẫn gắn với 12 bảng D1 cũ. |
| **`docs/audit/DUSTGUARD_FULL_SYSTEM_AUDIT.md`** | 2026-08 | Kiểm toán toàn bộ `app/` (Hono Cloudflare Worker + React 19 SPA) với 5 nhóm người dùng. Xác nhận các route `/citizen/*`, `/staff/*`, `/contractor/*`, `/executive/*`. | **TÀI LIỆU LỊCH SỬ (HISTORICAL)** | Ghi nhận hiện trạng của thế hệ monolithic 1 (`app/`); không còn phản ánh cấu trúc monorepo mới gồm `apps/server`, `apps/web` và `dustguard-operations/`. |
| **`docs/AUDIT_CUSTOMER_JOURNEY_YOUTH_FIRST.md`** | 2026-08-30 (v2.4) | Chuyển dịch trọng tâm cộng đồng sang **Youth-First Civic Tech**: Ghi nhận GPS 1-chạm, mã băm SHA-256 R2, Bàn giao minh bạch (Handoff), Tín chỉ tình nguyện 20h = 4.0 tín chỉ, mẫu A4 NĐ 30/2020. | **CÒN HIỆU LỰC NGHIỆP VỤ** (Domain Logic còn nguyên giá trị) | Về mặt kiến trúc code, tài liệu này được viết dựa trên `app/src/modules/community/` thay vì `apps/web` (Community React TS) và `apps/server` (Express API). |
| **`docs/PRODUCT_CURRENT_STATE.md`** | 2026-08-30 | Mô tả 5 roles (`public`, `citizen`, `staff`, `contractor`, `admin`), 46 bảng D1, Hono Edge Worker (399 endpoints), 6 Core Epics (F-001 đến F-006). | **ĐÃ LỖI THỜI (STALE)** | Mô tả trạng thái của `app/` thế hệ cũ; bỏ qua việc tách nhánh thành `apps/` (Community) và `dustguard-operations/` (Professional). |
| **`docs/ROUTE_MATRIX.md`** | 2026-09-04 (`386ea2d`) | Ma trận route của `dustguard-operations` (Port 3002): `/cases`, `/inspections`, `/actions`, `/legal/library`, `/supervisor/workload`... | **CÒN HIỆU LỰC (SIDE B)** | Chỉ mô tả riêng phân hệ Professional/Operations; không bao gồm Side A (Community). Tuy nhiên có endpoint tích hợp: `POST /api/integrations/community/cases`. |
| **`dustguard-operations/README.md`** | 2026-09-05 (`480687e`) | Đặc tả chuyên sâu phân hệ Professional / Responsible Organization: 4 roles (`staff`, `supervisor`, `legal_reviewer`, `admin`), CSDL SQLite 32 bảng, FTS5 Legal AI, 10 bước Closed-loop, phân quyền theo Capability. | **CÒN HIỆU LỰC (SSOT CHO SIDE B)** | Định hình hoàn chỉnh phân hệ Professional/Operations; kết nối với Community qua `CommunityCaseImportSchema` (idempotent intake). |
| **`apps/server/src/db/schema.ts`** & **`apps/web/src/App.tsx`** | 2026-09-04 / 2026-09-05 (`dev:community`) | Phân hệ Community (Port 3000 / API 3001): 21 bảng SQLite Drizzle, 4 roles (`citizen`, `community_member`, `moderator`, `admin`), bảo vệ bằng quyền hạn (`report:create`, `observation:create`, `moderator:verify`...). | **CÒN HIỆU LỰC (SSOT CHO SIDE A)** | Phản ánh chính xác code đang chạy ở port 3000 và port 3001. |
| **`app/src/app/router.jsx`** | Thế hệ 1 | Ghép 7 router: `staffRoutes`, `citizenRoutes`, `contractorRoutes`, `adminRoutes`, `communityRoutes`, `executiveRoutes`, `publicRoutes`. | **LEGACY PARALLEL CODE (TRÙNG LẶP NẶNG)** | Tồn tại song song với `apps/web` và `dustguard-operations`, gây xung đột nhận thức về kiến trúc SSOT. |

---

## 2. KẾT LUẬN VỀ THỰC TRẠNG ARCHITECTURE

Codebase hiện tại **ĐANG TỒN TẠI 2 MÔ HÌNH KIẾN TRÚC SONG SONG**:

1. **Mô hình Mới Nhất (The 2-Side Product Architecture)**:
   - **Side A — Community / Youth Community Actor**: Triển khai trong `apps/web` (Port 3000) và `apps/server` (Port 3001), CSDL `data/dustguard-community.db` (21 bảng). Dành cho người dân, thanh niên, tình nguyện viên, ban điều phối cộng đồng (`citizen`, `community_member`, `moderator`).
   - **Side B — Professional / Responsible Organization**: Triển khai trong `dustguard-operations/` (Frontend Port 3002, Backend Port 4000), CSDL `data/dustguard-operations.db` (32 bảng). Dành cho cán bộ môi trường, giám sát viên, chuyên viên pháp chế, nhà thầu khắc phục (`staff`, `supervisor`, `legal_reviewer`, `contractor`, `admin`).
   - **Liên kết giữa 2 Side**: Endpoint `POST /api/integrations/community/cases` tiếp nhận hồ sơ chuyển tiếp (forwarded) từ Community sang Operations một cách idempotent.

2. **Mô hình Cũ (The Legacy 5-Group Monolith)**:
   - Nằm trong `app/` (vừa chứa Worker Hono, vừa chứa React SPA cũ).
   - Chia cứng thành 5–6 folder ứng dụng: `apps/citizen`, `apps/staff`, `apps/contractor`, `apps/admin`, `apps/community`, `apps/executive`.
   - CSDL gắn vào D1 SQLite cũ `prisma/dev.db` (12 bảng cốt lõi).
   - Mô hình này hiện vẫn có 30 test files chạy pass trong `app/tests/`, nhưng đã bị thay thế về mặt trải nghiệm và tính năng bởi 2 phân hệ chuyên biệt mới.

---

## 3. ĐỊNH HƯỚNG THIẾT LẬP SSOT MỚI

- **Product Model SSOT**: Chính thức xác lập **Mô hình 2 Phía (2-Side Model)**:
  - **Side A**: Community (Người dân, Thanh niên, CLB, Điều phối viên cộng đồng).
  - **Side B**: Professional (Cán bộ xử lý, Giám sát viên, Chuyên viên pháp lý, Đơn vị hành động/Nhà thầu, Quản trị hệ thống).
- **Quy tắc chuyển dịch**: Không big-bang rewrite; thiết lập bảng ánh xạ vai trò cũ $\to$ vai trò mới, chuẩn hóa Capability Model, xác định các điểm giao thoa dữ liệu và loại bỏ các route rác / dead-end routes.
