# ACTIVE CONTEXT — DUSTGUARD VN

> **Trạng thái**: Local DB First (100% SQLite SSOT) & Verified | **Branch**: `master` | **Cập nhật**: 2026-09-02

---

## 🎯 1. Trọng Tâm Hoạt Động Hiện Tại (Active Operational State)
- **Hoàn Tất 10 Vertical Slices Backend Thật & D1/SQLite Persistence (Zero-Mock E2E)**:
  - **Slice 1: Công trình (`/staff/sites` & `/staff/sites/:id`)**: CRUD hoàn chỉnh, Edit Site modal, D1 queries thật, OpenStreetMap tương tác theo toạ độ thực.
  - **Slice 2: Quan trắc (`/staff/monitoring`)**: Real-time aggregation D1, SVG timeline, abnormal stations list, trigger alert logic.
  - **Slice 3: Cảnh báo (`/staff/alerts`)**: Atomic transaction chuyển Alert thành Case, chống duplicate 409, KPI count `?? 0`.
  - **Slice 4: Hồ sơ vụ việc (`/staff/cases` & `/staff/cases/:id`)**: 6 Tabs đầy đủ (Thông tin, Ảnh Before/After, Quy trình 7 bước DAG, Khảo sát thực địa, Kế hoạch khắc phục, Quyết định xử phạt), phân công cán bộ và duyệt đóng hồ sơ trực tiếp vào CSDL D1.
  - **Slice 5: Minh chứng (`Evidence & R2 Storage`)**: Mã băm SHA-256 Web Crypto, đối chứng Trước/Sau, lưu trữ an toàn.
  - **Slice 6: Nhiệm vụ (`/staff/tasks`)**: Tạo nhiệm vụ D1, phân công, đánh dấu hoàn tất, lọc động và phân trang.
  - **Slice 7: Bảng điều khiển (`/staff`)**: `GET /dashboard/summary` tổng hợp 100% dữ liệu thực tế từ D1 SQLite (KPIs, Việc cần làm, Cảnh báo mới, Hồ sơ gần đây).
  - **Slice 8: Báo cáo (`/staff/reports`)**: Tạo báo cáo, quản lý lịch gửi `report_schedules`, xuất CSV và in A4 PDF.
  - **Slice 9: Thông báo (`/staff/notifications`)**: Đánh dấu đã đọc đơn lẻ/tất cả, tắt nhắc nhở, lọc khẩn cấp từ bảng `notifications`.
  - **Slice 10: Cài đặt (`/staff/settings`)**: Lưu và nạp cấu hình ngưỡng PM2.5/PM10, SLA 48h, thông báo vào bảng `system_settings` D1.
- **Sức khỏe Mã nguồn**:
  - `npm --prefix app run verify:quick`: **279/279 tests PASS 100%** (28 test files + 4 UI smoke tests, ~2.8s).

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
