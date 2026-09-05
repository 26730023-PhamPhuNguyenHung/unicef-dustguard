# DUSTGUARD VN — SSOT TIMELINE (MEMORY BANK)

> **Cập nhật mốc phát triển và lịch sử trạng thái dự án**  
> *Đồng bộ với .agents/TIMELINE.md*

---

## 📅 Các Mốc Phát Triển Chính (Milestones)

### 1. [2026-09-05] `operations-v1.7`: UI Quality Watch Non-Blocking Pipeline & Mobile Touch Target Compliance
- **Mục tiêu**: Thiết lập và vận hành quy trình giám sát chất lượng giao diện (UI Quality Watch) ở chế độ Không Chặn (Non-Blocking) xuyên suốt quá trình kiểm thử trình duyệt thực tế trên ma trận 5 viewports và 14 routes tác nghiệp, khắc phục tận gốc các bất thường giao diện và nâng chuẩn tiếp cận Civic Tech.
- **Phạm vi hoàn tất**:
  - **Giám sát Non-Blocking Tự Động Hóa**: Xây dựng kịch bản `dustguard-operations/scripts/run-ui-quality-watch.mjs` quét tự động 70 trường hợp (5 viewports $\times$ 14 routes) bao gồm: Text clipping, Button clipping/overlap, Horizontal overflow, Responsive breakpoints, và Visual consistency.
  - **Ghi Nhận & Khắc Phục Bất Thường (Root-Cause Resolution)**: Phát hiện 1 bất thường độ ưu tiên Medium (`touch-target` < 44px tại tab buttons của `LegalWorkspacePage` trên viewport $430\times 932$). Khắc phục tận gốc: nâng lên `min-h-[44px] py-2.5 px-3 touch-target`, bổ sung icon `shrink-0` và nhãn linh hoạt cho di động.
  - **Nghiệm Thu Khép Kín**: Chạy lại kiểm thử trình duyệt thực tế qua `agent-browser` trên toàn bộ 70 trường hợp: **0 bất thường còn lại (100% Clean)**.
  - **Lưu Trữ SSOT**: Cập nhật báo cáo chuẩn tại `artifacts/ui-anomalies.json` và cấu hình ngoại lệ trong `.gitignore`.
  - **Bảo Toàn Logic Nghiệp Vụ**: 87/87 test suites và frontend build tiếp tục **PASS 100%**.

### 2. [2026-09-05] `operations-v1.6`: Empty DB Zero-Seed Operability, 87 Automated Tests & Tablet 768px Responsive Polish
- **Mục tiêu**: Hoàn thiện khả năng khởi tạo và vận hành 100% độc lập từ CSDL rỗng hoàn toàn (Zero Seed Dependency), phòng chống lỗi xung đột dữ liệu khởi tạo, tối ưu giao diện Tablet 768px (75/75 responsive pass) và mở rộng bộ test tự động lên 87 test PASS 100%.
- **Phạm vi hoàn tất**:
  - **Khởi tạo Statutory Config Tách biệt**: Thêm tham số `runMigrations(initSystemConfig = true)` cho phép `seedDatabase()` chạy migrations với `initSystemConfig = false` để tránh chèn trùng lặp `legal_documents` và `inspection_templates`.
  - **Bổ sung bảng Registry & Khởi tạo**: Khởi tạo đầy đủ bảng `projects`, `contractors`, `system_configs` và các cột mở rộng `project_id`, `contractor_id`, `task_type` (cho phép `FIELD_VERIFY`), `integrity_status`.
  - **Phản ánh Cộng đồng Chuẩn hóa**: Trả về cả `signal` và `data` trong endpoint `POST /api/signals/public-report`.
  - **Kiểm thử Đa khung nhìn Tablet 768px (75/75 PASS)**: Tinh chỉnh thanh tìm kiếm toàn cục trong `AppLayout.tsx` hiển thị dạng icon tại Tablet 768px (`lg:block`), giải quyết triệt để lỗi tràn 58px. Kết quả: **75/75 kiểm tra đa khung nhìn PASS 100%**.
  - **Bộ Kiểm Thử Tự Động Toàn Diện**: Mở rộng từ 40 lên **87 bài test tự động** (bao gồm 32 API test, 8 Provenance Intelligence test, 7 Empty DB Startup test, 13 Empty DB API test, 2 No Seed Runtime Dependency test, và 22 Real Data Lifecycle test). **100% PASS (0 fail, 0 skipped)** trong ~7 giây.

### 2. [2026-09-05] `operations-v1.5`: Evidence-Grounded Legal & Operational Intelligence Engine (Zero-Mock SSOT, Provenance Validation, Missing Fact Engine & Human Decision Layer)
- **Mục tiêu**: Nâng cấp toàn diện DustGuard Operations để mọi phân tích AI, đề xuất pháp lý và đề xuất vận hành đều dựa 100% trên dữ liệu thực có thể truy vết nguồn gốc (`SOURCE → FACT → EVIDENCE → INFERENCE → HUMAN DECISION`). Loại bỏ hoàn toàn mock analysis, hardcoded recommendation, fake confidence score và AI output không truy vết được nguồn.
- **Phạm vi hoàn tất**:
  - **Mở rộng CSDL**: Bổ sung 2 bảng `analysis_runs` (lưu trữ toàn bộ snapshot facts, pháp quy, kết quả và trạng thái kiểm định của mỗi lần chạy) và `human_decisions` (lưu vết bất biến quyết định của cán bộ con người, actor, vai trò, lý do và snapshot chứng cứ tại thời điểm ký duyệt). Cập nhật cột `integrity_status` cho bảng `evidence_assets` (`UNVERIFIED`, `VERIFIED`, `TAMPERED`, `FILE_MISSING`). Nâng tổng số bảng lên **34 bảng quan hệ + SQLite FTS5**.
  - **Dịch vụ Thu thập Dữ kiện Thực tế (`CaseFactService`)**: Tự động tổng hợp 8 luồng dữ kiện từ SQLite: metadata, phản ánh cộng đồng, quan sát hiện trường, kết quả checklist, đo đạc vi khí hậu, tài liệu chứng cứ kèm kiểm định SHA-256 đối chiếu đĩa cứng, số liệu viễn thám IoT và quyết định của con người.
  - **Phân định Ngữ nghĩa Nghiêm ngặt**: Phản ánh cộng đồng mặc định là `semantic_type = 'CLAIM'`, `verification_state = 'UNVERIFIED'`; quan sát hiện trường là `OBSERVATION`; dữ liệu cảm biến là `TELEMETRY` (không tự suy diễn vi phạm pháp luật); chứng cứ số kiểm định SHA-256 là `VERIFIED`; chỉ quyết định có chữ ký cán bộ mới là `HUMAN_DECISION`.
  - **Đường ống Phân tích 8 Bước (`CaseAnalysisService`)**: A. Tổng hợp dữ kiện SQLite; B. Truy xuất điều khoản pháp quy FTS5 thực; C. Xây dựng Evidence Matrix; D. Phát hiện dữ kiện thiếu (Missing Facts); E. Lập luận trên bối cảnh có cấu trúc; F. Kiểm định Zod schema; G. Kiểm định trích dẫn nguồn (từ chối 100% phát hiện không có source_id hoặc trích dẫn điều luật không có trong DB); H. Phản hồi và lưu snapshot `analysis_runs`.
  - **Cấm AI Khẳng định Vượt Quá Bằng chứng**: Thay thế toàn bộ từ ngữ võ đoán bằng văn phong chuẩn mực: *"Có dấu hiệu cần xem xét...", "Dữ liệu hiện có hỗ trợ nhận định..."*. Chỉ khi tồn tại quyết định của con người mới cho phép nâng mức kết luận lên `HUMAN_CONFIRMED`.
  - **Giao diện Ma trận Bằng chứng (Evidence Matrix UI)**: Tái thiết kế `LegalWorkspacePage` thành bố cục Desktop 3 vùng chuyên nghiệp: VÙNG 1 (Dữ kiện thực tế/Claims/Evidence kèm bộ lọc và badge ngữ nghĩa); VÙNG 2 (Ma trận bằng chứng với các chip dẫn nguồn clickable `[INS-...]`, `[EV-...]`, `[LAW-...]` mở trực tiếp modal); VÙNG 3 (Động cơ dữ kiện còn thiếu với CTA tạo tác vụ thực `/tasks` + Lớp quyết định con người với 6 hành vi ký duyệt bất biến và tra cứu FTS5).
  - **Cơ chế Dự phòng Minh bạch (Fallback Semantics)**: Đổi tên thành `RULE-BASED ANALYSIS`, chỉ ánh xạ quy tắc và dữ kiện thực tế, không giả dạng AI sinh văn bản pháp lý võ đoán.
  - **Kiểm thử Toàn diện**:
    - **40/40 tests PASS 100%** (bao gồm 32 bài kiểm thử hồi quy + 8 bài kiểm thử chuyên sâu về tính toàn vẹn chứng cứ và chuỗi truy vết nguồn gốc).
    - **75/75 responsive checks PASS 100%** trên cả 5 độ phân giải (390px, 430px, 768px, 1366px, 1440px), 0 lỗi tràn ngang.
    - Nghiệm thu trọn vẹn 8 kịch bản (Scenario A đến H) trực tiếp trên trình duyệt qua `agent-browser`: kiểm chứng F5 reload bảo toàn 100% dữ liệu quyết định và tác vụ trong SQLite.

### 2. [2026-09-05] `operations-v1.4`: Production-Usable Operations Transformation, Full 4-Role Browser Validation & Civic Operational System
- **Mục tiêu**: Nâng cấp toàn diện phân hệ DustGuard Operations từ khung giao diện cơ bản thành hệ thống vận hành thực địa sản xuất hoàn chỉnh theo đúng chu trình `SIGNAL → CASE → TRIAGE → LEGAL REVIEW → FIELD VERIFICATION → DECISION SUPPORT → ASSIGNMENT → REMEDIATION → FOLLOW-UP → CLOSURE → AUDIT TRAIL`.
- **Phạm vi hoàn tất**:
  - Hàng đợi Nhiệm vụ Vận hành (`/tasks`): Tái cấu trúc thành hàng đợi nghiệp vụ thời gian thực với 10 tab phân loại, 12 loại tác vụ ngữ nghĩa, 4 mức ưu tiên, bộ lọc tức thì và modal giao việc liên kết sâu.
  - Kho Bằng chứng Tập trung (`/evidence`): Tích hợp điểm đầu cuối `GET /api/evidence` và `POST /api/evidence/:id/verify-hash` kiểm định toàn vẹn mật mã học SHA-256 đối chiếu trực tiếp tệp trên đĩa cứng.
  - Báo cáo & Phân tích Vận hành (`/reports`): Bổ sung `GET /api/reports/overview` tính toán trực tiếp từ CSDL SQLite (Zero-Mock), tổng hợp phễu trạng thái 12 bước, tỷ lệ khắc phục đạt chuẩn, và trạng thái trạm viễn thám IoT.
  - Trung tâm Tìm kiếm Toàn cục & Command Palette (`Ctrl+K`): Hỗ trợ truy vấn liên thực thể trên Cases, Tasks, Điều khoản Luật FTS5 và Trạm IoT.
  - Không gian Thẩm tra Pháp lý (`LegalWorkspacePage`): Hoàn thiện 3 tab Vùng 2 (Phiếu Lập Luận, Bộ Tạo Checklist Hiện trường với tính năng xuất trực tiếp sang Hàng đợi Nhiệm vụ, Trợ lý AI chuẩn Zod với viện dẫn FTS5).
  - Nghiệp vụ Hiện trường (`FieldInspectionPage` & `InspectionResultPage`): Tích hợp bảo vệ bản nháp ngoại tuyến (Offline Draft Protection), xác nhận có mặt tại chỗ (GPS / thủ công không nghẽn luồng), đo đạc vi khí hậu thực địa và Ma trận Đề xuất Bước tiếp theo (Section 14).
  - Nghiệm thu Trình duyệt Thực tế qua `agent-browser`: Thực hiện kiểm thử toàn bộ 4 vai trò (Staff, Supervisor, Legal Reviewer, Admin), xác minh tính bền vững dữ liệu sau F5 và độ đáp ứng trên các kích thước màn hình Mobile (390×844, 412×915) và Desktop (1440×900) với 0 lỗi console, không tràn ngang.
  - Kiểm thử Hồi quy: **32/32 tests PASS 100%** trong phân hệ Operations; **248/248 domain tests + 43/43 UI smoke tests PASS 100%** trong ứng dụng gốc.

---

### 2. [2026-09-05] `operations-v1.3`: Decision Pack Window.open Auth Streamlining, Root CLI Harness & Full Zero-Mock Verification
- **Mục tiêu**: Hoàn thiện tối ưu trải nghiệm in ấn Decision Pack, cấu hình chuẩn hóa môi trường `.env.example`, tích hợp CLI gốc và nghiệm thu toàn diện.
- **Phạm vi hoàn tất**:
  - Chuẩn hóa xác thực `window.open`: Hỗ trợ trích xuất token qua URL query parameter trong `authMiddleware`, đảm bảo cán bộ mở trực tiếp tab mới hồ sơ Decision Pack dưới định dạng HTML in ấn chuẩn mực mà không bị chặn 401.
  - Phân định định dạng thông minh cho Decision Pack: Trả về HTML khi mở bằng trình duyệt (`Accept: text/html`) và JSON khi gọi qua API (`Accept: application/json` hoặc `?format=json`).
  - Bổ sung `.env.example` chuẩn hóa biến môi trường cho cả AI Provider (NONE/GEMINI/OPENAI) và thông số viễn thám IoT.
  - Tích hợp các script điều phối từ thư mục gốc: `operations:dev`, `operations:setup`, `operations:test`, `operations:build`, `operations:test:responsive`.
  - Nghiệm thu tự động: **32/32 tests PASS** (1.25s), Responsive **75/75 PASS** (5 viewports), Vite build thành công 100% trong 3.42s.
  - Nghiệm thu trình duyệt thực tế qua `agent-browser`: Đầy đủ 4 vai trò (Staff, Supervisor, Legal Reviewer, Admin), chu trình khép kín hoạt động thực, 0 nút chết, 0 màn hình mock.

---

### 2. [2026-09-05] `operations-v1.2`: Full Operational Delivery, Multi-Viewport Responsive QA (75/75 PASS) & Live Persistence Hardening
- **Mục tiêu**: Hoàn thiện 100% dự án DustGuard Operations, nghiệm thu trình duyệt thực tế và đóng gói phát hành.
- **Phạm vi hoàn tất**:
  - Tăng cường khả năng chịu lỗi CSDL: Cấu hình `PRAGMA busy_timeout = 5000;` loại bỏ hoàn toàn lỗi khóa ghi concurrent WAL mode.
  - Chuẩn hóa dữ liệu văn bản pháp quy: Tự động ánh xạ `section_type` tương thích ràng buộc SQLite `CHECK constraint`.
  - Khắc phục hiển thị danh mục thiết bị viễn thám IoT và quy tắc tự động hóa: Tương thích mảng hai tầng qua HTTP Client unwrapping.
  - Kiểm thử đa màn hình tự động (`scripts/verify-responsive.js`): Đạt **75/75 lượt kiểm tra PASS 100%** trên cả 5 độ phân giải: Mobile 390x844, Large Mobile 430x932, Tablet 768x1024, Laptop 1366x768, Desktop 1440x900.
  - Kiểm thử tích hợp tự động: **32/32 tests PASS 100%** (`npm test` ~1.3s).
  - Nghiệm thu quy trình nghiệp vụ thực tế qua `agent-browser`: 0 console error, 0 dead buttons, F5 reload bảo toàn 100% dữ liệu.

---

### 1. [2026-09-05] `operations-v2.1`: Zero-Seed Production Operability & Real-World E2E Lifecycle
- **Mục tiêu**: Loại bỏ 100% phụ thuộc vào `seed.ts` và dữ liệu mẫu. Bảo đảm hệ thống vận hành hoàn hảo từ cơ sở dữ liệu trống rỗng (`DATABASE = EMPTY`), tự tạo dữ liệu qua UI/API thật.
- **Phạm vi hoàn tất**:
  - **Audit & Phân loại dữ liệu**: Hoàn thiện `docs/EMPTY_DB_OPERABILITY_AUDIT.md` (28 thực thể nghiệp vụ phân loại theo 4 nguồn gốc A: User-created, B: System-derived, C: External-integration, D: System-configuration).
  - **Tách bạch Cấu hình Hệ thống Luật định (Category D)**: Trích xuất Luật BVMT 2020, NĐ 45/2022, QCVN 05:2023, QĐ 29/2021 và Mẫu biên bản kiểm tra công trình vào `systemConfig.ts`. Tự động khởi tạo cấu hình luật định khi chạy migration, 0 tạo dữ liệu vụ việc giả.
  - **Khởi tạo lần đầu an toàn (Bootstrap Wizard)**: Trang `/setup` & `POST /api/auth/bootstrap` cho phép tạo Super Admin đầu tiên khi DB rỗng và tự động khóa vĩnh viễn (403 Forbidden).
  - **Bổ sung toàn diện các luồng tạo dữ liệu thực**:
    - Quản lý Nhà thầu (`/contractors`, `POST /api/contractors`).
    - Quản lý Công trình xây dựng (`/projects`, `POST /api/projects`).
    - Cổng tiếp nhận phản ánh công dân công khai (`POST /api/signals/public-report`).
    - Tiếp nhận & tạo vụ việc chính thức tự sinh mã tuần tự (`POST /api/signals/:id/create-case`).
    - Đăng ký thiết bị cảm biến IoT (`POST /api/iot/devices`).
  - **Xác thực toàn diện**:
    - `tests/no-seed-runtime-dependency.test.js`: 3/3 tests PASS (0 seed imports across production).
    - `tests/empty-db-startup.test.js`: 8/8 tests PASS (0 operational records, bootstrap lock).
    - `tests/empty-db-api.test.js`: 14/14 tests PASS (Tất cả endpoint HTTP 200 trên empty DB).
    - `tests/real-data-lifecycle.test.js`: 22/22 tests PASS (21 bước E2E trọn vẹn vòng đời).
  - **Tài liệu nghiệm thu**: `docs/REAL_WORLD_ACCEPTANCE_TEST.md` với câu trả lời khẳng định: **YES**.

---

### 2. [2026-09-05] `operations-v1.1`: DustGuard Operations Enterprise Expansion (32 Tables, IoT HMAC Telemetry, Legal Ingestion & 32 Tests)
- **Mục tiêu**: Nâng cấp toàn diện nền tảng Operations với hạ tầng dữ liệu mở rộng.
- **Phạm vi hoàn tất**:
  - Mở rộng cấu trúc cơ sở dữ liệu lên **32 bảng quan hệ + SQLite FTS5**: `signals`, `case_signals`, `tasks`, `iot_devices`, `iot_readings`, `iot_events`, `automation_rules`, `automation_runs`.
  - Tích hợp giao thức viễn thám IoT (ESP32 APM2000 Sensor Node) với chữ ký HMAC SHA-256 xác thực nguồn gốc và bộ lọc phát hiện cảm biến đóng băng số liệu (Flatline & Faulty Detection).
  - Cỗ máy điều hướng hành động kế tiếp (**Next Action Engine**) và Xuất hồ sơ quyết định tổng hợp (**Decision Pack**).
  - Bộ bóc tách cấu trúc văn bản pháp luật tiếng Việt (**Vietnamese Legal Parser & Ingestion**) tự động phân cấp Chương/Điều/Khoản/Điểm và lập chỉ mục FTS5 tức thì.
  - Trung tâm quản lý công việc (**Centralized Tasks**) với liên kết sâu tới vụ việc/thiết bị/pháp chế.
  - **Kiểm thử**: Đạt **32/32 tests PASS 100%** trong 1.26 giây. Vite production build thành công 100% trong 3.81s.

---

### 2. [2026-09-05] `operations-v1`: DustGuard Operations (Staff Case Management + Legal Intelligence + Inspection Workflow)
- **Mục tiêu**: Xây dựng nền tảng độc lập hoàn chỉnh dành cho cán bộ nội bộ, giám sát, pháp chế và admin.
- **Phạm vi**:
  - Khép kín 10 bước nghiệp vụ: `CASE INTAKE → TRIAGE → ASSIGNMENT → LEGAL REVIEW → INSPECTION → FINDINGS → CORRECTIVE ACTION → REMEDIATION → REINSPECTION → CLOSURE`.
  - Monorepo độc lập `dustguard-operations/`:
    - Backend Express + TypeScript + SQLite native `node:sqlite` trong WAL mode, 24 bảng quan hệ + bảng FTS5 virtual table.
    - Frontend React 18 + Vite + TypeScript + TailwindCSS Civic High-Contrast, sáng màu, không glassmorphism, 18 màn hình đầy đủ.
    - Shared types, permissions RBAC capability model, canTransitionCase state machine.
    - Assistive AI Legal Provider (Citation-first, Zod schema validation, fallback local engine).
    - Hợp đồng tích hợp DustGuard Community Idempotent API.
  - **Kiểm thử**: 15/15 integration tests PASS 100% (1.28s).
  - **Nghiệm thu trình duyệt thực tế**: Chạy trọn vẹn 10 bước qua `agent-browser`, xác minh độ bền vững dữ liệu F5 reload không mất mát, không tràn màn hình (`noOverflow: true`) trên Desktop 1440x900, 1366x768 và Mobile 390x844.

---

### 2. [2026-09-05] `community-v1`: DustGuard Community
- Phân hệ độc lập dành cho Thanh niên, Tình nguyện viên và Người dân tiếp nhận & phản ánh ô nhiễm bụi cộng đồng.
- 23 màn hình, SQLite local engine, REST API và 14/14 automated tests passed.

---

### 3. [2026-09-03] `30-screens`: Master Human-Centric Consolidation
- Hoàn tất 30 màn hình trải đều 5 nhóm người dùng: Citizen, Field Staff, Admin Coordinator, Contractor, Youth Community.
