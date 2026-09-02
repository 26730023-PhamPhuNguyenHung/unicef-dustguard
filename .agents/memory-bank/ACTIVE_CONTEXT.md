# ACTIVE CONTEXT — DUSTGUARD VN

> **Trạng thái**: 10-Domain Comprehensive Bug Fixing & Codebase Hardening 100% | **Branch**: `master` | **Cập nhật**: 2026-09-02

---

## 🎯 1. Trọng Tâm Hoạt Động Hiện Tại (Active Operational State)
- **Hoàn Tất Rà Soát & Vá Toàn Diện Phân Hệ Nhà Thầu & Đối Chứng Khắc Phục (Subagent Ops-3)**:
  - **Quick Token 0-Login UTF-8**: Khắc phục lỗi `btoa` crash khi mã hóa payload tiếng Việt có dấu, thay thế bằng helper base64url an toàn UTF-8.
  - **Worker Multipart Upload**: Bổ sung `c.req.parseBody()` cho các endpoint `POST /api/contractor/actions/:id/evidence` và `POST /api/contractor/quick-submit` khi nhận `multipart/form-data`.
  - **Geofence 50m Anti-Bypass**: Khóa chặt lỗ hổng gán `valid: true` khi GPS bị khuyết/NaN trong `ContractorService.addEvidence`, luôn đặt `valid: false` và `NO_GPS` để chống bypass 50m buffer.
  - **SSOT Services & Utils**: Tạo `app/src/shared/services/contractor-token.service.js` và `app/src/shared/utils/geofence.js`.
  - **UI Standard Parity**: Nâng cấp `ContractorReportsPage.jsx` (Bảng 10 tiêu chí tuân thủ QCVN 05/QCVN 18/NĐ 45) và `ContractorCasesPage.jsx` (Structured Dossier & Điểm tích hợp 1022).
  - **Kiểm thử**: Viết test suite `contractor-remediation-loop-audit.test.js` (7/7 tests PASS, 69ms); Toàn bộ Quick Gate (279/279 tests) PASS 100%.
- **Hoàn Tất Tài Liệu Hóa Chuẩn SSOT 8 Phần Cho 4 Màn Hình Tác Nghiệp Thực Địa, Báo Cáo NĐ 30/2020 & Kiểm Toán Công Vụ (Subagent 8 - Tasks, Reports & Audit)**:
  - `STAFF-06-tasks-list.md` (STF-06): Quản lý nhiệm vụ ca trực & khảo sát hiện trường, phân luồng 4 loại nhiệm vụ thực địa (khảo sát ban đầu, tái kiểm sau 24h, bổ sung ảnh thiếu, đo PM10/PM2.5 QCVN 05:2023), bố cục Split Layout ~75% bảng danh sách / ~25% Lịch hôm nay 310px, D1 tasks contracts & quick actions.
  - `STAFF-09-reports.md` (STF-09): Trung tâm báo cáo, thống kê & xuất bản điều hành chuẩn **Nghị định 30/2020/NĐ-CP** (Quốc hiệu, Tiêu ngữ, Số ký hiệu, Mẫu tờ trình UBND Quận, xuất file Word `.DOCX` / In ấn `PDF A4` kèm mã băm `docHash`), biểu đồ so sánh 4 tuần, AI soạn nháp và tự động gửi email 08:00 Thứ Hai.
  - `STAFF-10-profile.md` (STF-10): Hồ sơ cán bộ & định danh công tác, mã số Thẻ thanh tra viên (`staffCode` font-mono), đơn vị công tác, SĐT khẩn cấp nhận cảnh báo vượt ngưỡng, đổi mật khẩu bảo mật tài khoản và tự động đồng bộ vào mục Người lập biên bản NĐ 30/2020.
  - `STAFF-11-activity.md` (STF-11): Nhật ký công vụ bất biến & lưu vết kiểm toán tác nghiệp (Append-Only Audit Trail), chuẩn ISO-8601, mã băm sự kiện `logHash` SHA-256 chống chối bỏ, trực quan hóa timeline 7 bước DAG.
- **Hoàn Tất Tài Liệu Hóa Chuẩn SSOT 8 Phần Cho 3 Màn Hình Phân Hệ Quản Trị Hệ Thống (Subagent 10 - Admin & Infrastructure)**:
  - `ADMIN-01-dashboard.md` (ADM-01): Bảng điều khiển quản trị hạ tầng D1 & giám sát hệ thống, hợp nhất 4 chỉ số CSDL D1/R2, quản lý 46 bảng quan hệ SQLite, theo dõi sức khỏe cổng liên ngành (1022, iHanoi).
  - `ADMIN-02-users.md` (ADM-02): Quản trị danh bạ người dùng & ma trận phân quyền RBAC 5 cấp (`citizen`, `community`, `staff`, `contractor`, `executive`/`admin`), hỗ trợ đổi quyền tại chỗ tức thì (In-Place Role Switching) và chống leo thang đặc quyền.
  - `ADMIN-03-settings.md` (ADM-03): Cấu hình tham số quy chuẩn môi trường QCVN 05:2023/BTNMT, chính sách cam kết thời hạn giải quyết SLA 48h, Geofence $\le 50\text{m}$, trạng thái tích hợp cổng dịch vụ đô thị và động cơ tự động hóa Cron.
- **Hoàn Tất Tài Liệu Hóa Chuẩn SSOT 8 Phần Cho 3 Màn Hình Cốt Lõi Phân Hệ Staff**:
  - `STAFF-01-dashboard.md` (STF-01): Bàn làm việc cán bộ điều hành & tác nghiệp, 4 KPI động, cụm 3 cột tác nghiệp thông minh (~42% Việc cần làm, ~30% Cảnh báo mới, ~28% Hồ sơ gần đây), Zero Truncate, D1 dev.db SSOT.
  - `STAFF-07-monitoring.md` (STF-07): Ma trận giám sát & quan trắc bụi công trình thời gian thực, chuỗi thời gian 24h đối chiếu QCVN 05:2023, nhúng bản đồ GIS, danh sách trạm bất thường và bảng phân trang D1.
  - `STAFF-08-alerts.md` (STF-08): Trung tâm xử lý cảnh báo ô nhiễm bụi khẩn cấp, cơ chế mở hồ sơ kiểm tra 1-Click (Atomic SQLite Transaction), bảng 75% + 25% ưu tiên hôm nay, SafeImage minh chứng hiện trường.
- **Hoàn Tất Chiến Dịch Săn & Vá Lỗi Toàn Diện Qua 10 Subagent Chuyên Trách**:
  - Triệu tập 10 Subagent Fixer chạy song song, sửa dứt điểm **84 lỗi & bẫy rủi ro tiềm ẩn** (14 P0, 29 P1, 33 P2, 8 P3) trên 10 phân hệ nghiệp vụ.
  - **Core API & Data Normalization**: Tự động chuyển `options.data` sang `body`, mở rộng `normalizeList` unwrap an toàn mọi collection array, vá triệt để crash `users.filter`.
  - **Staff Workspace & Case UI**: Bổ sung null check `evidencePhotos`, `site.kpis`, cung cấp method `getSiteTelemetry`, `submitInspection`, dọn dẹp swallowed catches.
  - **Citizen & Youth Credits**: Vá crash tìm kiếm CLB `universityCode`, dọn cache tự động khi `QuotaExceededError`, chống biến ảnh PNG trong suốt thành nền đen, bỏ tọa độ GPS Hà Nội gán cứng.
  - **Contractor & CSR**: Vá hàm `calculateHaversineDistance` trả về `Infinity` khi tọa độ null/NaN, loại bỏ mock `success: true`, upload file `FormData` nhị phân thật.
  - **Executive & Legal Engine**: Bổ sung `ExecutiveService.getReportById`, sửa `sensitiveReceptors = []` truthy, escape regex so sánh toán học `< 100m` trong DOCX parser.
  - **GIS & Spatial Intelligence**: Chặn Null Island `(0,0)`, sửa lọc Bounding box qua kinh tuyến 180°, mask PII số điện thoại & fuzz tọa độ công khai, dọn mock drawer.
  - **Backend Staff & D1 SQL**: Khắc phục các câu truy vấn sai cột `c.deadline` $\rightarrow$ `c.slaDeadline`, bảo vệ PII thông tin liên hệ ban quản lý công trình.
  - **Backend Worker Routes & Schema**: Chuẩn hóa snake_case trên `audit_logs`, `draft_documents`, `evidences`, `contractor_explanations`.
  - **AI & Telemetry Engine**: Thêm `AbortSignal.timeout(10000)` chống treo worker, vá prompt injection XML `<user_query>`, sửa `Number(null) === 0` trong flatline detection.
  - **Security & DAG Engine**: Whitelist MIME types raster, CSP sandbox cho storage upload, từ chối unsigned JWT tại production, HMAC token nhà thầu, tối ưu N+1 batch queries trong automation cron sweep.
- **Landing Page 10-Second Screen & Copy Streamline Refactoring**:
  - **Hero Section**: Tinh gọn cực mạnh text above-the-fold, xóa info box thừa ("Không chỉ dừng ở một phản ánh đã gửi..."), giảm còn đúng 2 CTA chính (`Phản ánh` trỏ tới `/citizen/report/new` và `Xem demo` trỏ tới `/demo`).
  - **Interactive Case Preview Card**: Loại bỏ SHA-256 raw hash, xóa người phụ trách và timestamp rườm rà, chỉ giữ 6 điểm dữ liệu cốt lõi (Mã hồ sơ `#DG-2026-0842`, Địa điểm `Vành đai 3 · Dịch Vọng Hậu`, Trạng thái `Đang xử lý` / `Đã khắc phục`, Tiến trình 5 bước, Mức ưu tiên `85/100 · Cao`, PM2.5 `142 µg/m³`, 1 câu ghi nhận ngắn).
  - **LandingNav**: Đồng bộ tái sử dụng `BrandLogo` SSOT (`src/shared/components/BrandLogo.jsx`), rút gọn desktop navbar từ 8 xuống đúng 5 mục chính (`Bản đồ`, `Vấn đề`, `Giải pháp`, `Quy trình`, `Pilot`), bảo đảm touch targets $\ge 44\text{px}$ và không wrap line trên laptop 1366x768.
  - **Typography & Responsive**: Áp dụng `text-wrap: balance` cho headings, `text-wrap: pretty` cho subheads, `overflow-wrap: break-word`, zero glassmorphism.
- **Sức khỏe Mã nguồn**:
  - `npm --prefix app run verify:quick`: **279/279 tests PASS 100%** (28 test files + 4 UI smoke tests, 2.7s).
  - `npm --prefix app run build`: **Vite build thành công 100%** (2.7s).

---

## 🧭 2. Quick SSOT Routing Matrix

| Phân hệ nghiệp vụ | File SSOT cốt lõi | Test mục tiêu (< 0.5s) |
|---|---|---|
| **Auth, Users & RBAC** | [`.agents/ssot/AUTH.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/AUTH.md) | `node --test app/tests/auth-user-management-audit.test.js` |
| **Ghi nhận Cộng đồng (Observation)** | [`.agents/ssot/DOMAIN.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DOMAIN.md) | `node --test app/tests/citizen-observation-lifecycle.test.js` |
| **Hồ sơ Vụ việc (Case 7 bước)** | [`.agents/ssot/WORKFLOWS.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/WORKFLOWS.md) | `node --test app/tests/case-enforcement-dag-7steps.test.js` |
| **Bản đồ GIS & Geofence** | [`.agents/ssot/MAP.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/MAP.md) | `node --test app/tests/spatial-intelligence-map.test.js` |
| **UI Tokens & Components** | [`.agents/ssot/UI.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/UI.md) | `node --test app/tests/design-system-tokens.test.js` |
| **Tín chỉ Thanh niên & QR** | [`.agents/ssot/DOMAIN.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DOMAIN.md) | `node --test app/tests/youth-credits.test.js` |
| **Điều hành Lãnh đạo (Executive)** | [`.agents/ssot/EXECUTIVE_OPS_SSOT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/EXECUTIVE_OPS_SSOT.md) | `node --test app/tests/executive-command-center.test.js` |
| **Nhà thầu (Contractor Workspace)** | [`.agents/ssot/CIVIC_HANDOFF_SSOT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/CIVIC_HANDOFF_SSOT.md) | `node --test app/tests/contractor-ui-workspace.test.js` |
| **API Backend & Edge Routes** | [`.agents/ssot/API.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/API.md) | `node --test app/tests/worker-full-edge-routes.test.js` |
| **D1 Schema & Database** | [`.agents/ssot/DATABASE.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DATABASE.md) | `node --test app/tests/d1-schema.test.js` |
| **Bẫy lỗi & Phòng ngừa** | [`.agents/BUG_MEMORY.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/BUG_MEMORY.md) | `node --test app/tests/dev-runtime-verification.test.js` |
