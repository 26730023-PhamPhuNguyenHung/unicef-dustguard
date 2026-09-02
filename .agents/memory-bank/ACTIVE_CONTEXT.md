# ACTIVE CONTEXT — DUSTGUARD VN

> **Trạng thái**: 10-Domain Comprehensive Bug Fixing & Codebase Hardening 100% | **Branch**: `master` | **Cập nhật**: 2026-09-02

---

## 🎯 1. Trọng Tâm Hoạt Động Hiện Tại (Active Operational State)
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
- **Sức khỏe Mã nguồn**:
  - `npm --prefix app run verify:quick`: **279/279 tests PASS 100%** (28 test files + 4 UI smoke tests, 4.8s).
  - `npm --prefix app run build`: **Vite build thành công 100%** (4.6s).

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
