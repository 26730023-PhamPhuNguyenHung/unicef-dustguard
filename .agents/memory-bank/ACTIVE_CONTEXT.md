# ACTIVE CONTEXT — DUSTGUARD VN

> **Trạng thái**: Local DB First (100% SQLite SSOT) & Verified | **Branch**: `master` | **Cập nhật**: 2026-09-02

---

## 🎯 1. Trọng Tâm Hoạt Động Hiện Tại (Active Operational State)
- **Quy tắc Phát Triển Mới (Local DB First SSOT - `.agents/rules/local-db-first-development.md`)**:
  - Toàn bộ backend và frontend chạy 100% trên Local SQLite (`app/prisma/dev.db`). Khi hoàn thiện toàn diện hệ thống sẽ tiến hành sync Cloudflare D1 Production.
  - Số liệu KPI đồng bộ chính xác với `COUNT(*)` từ SQLite (Sites: 37, High risk: 14, Monitoring: 26, Stable: 5).
  - Phân trang động dựa trên `Math.ceil(totalSitesCount / limit)` (5 trang cho 37 bản ghi).
- **Hoàn Tất Khắc Phục UI Rớt Chữ & Nối Dữ Liệu Thực Tế (`SitesListPage.jsx`)**:
  - Đã bổ sung `whitespace-nowrap`, căn chỉnh `min-w-[...]` cho toàn bộ 9 cột tiêu đề bảng (Mã, Công trình, Khu vực, Điểm rủi ro, Trạm đo, Hồ sơ mở, Phụ trách, Trạng thái, Thao tác).
  - Input tìm kiếm ngắn gọn, sắc nét; Dropdown Phường/Xã tự động nạp danh sách phường/xã thực tế từ DB qua `/api/staff/sites/wards`.
  - Thiết kế lại 4 KPI cards trên cùng và Panel "Cần chú ý - Top 3 ưu tiên" với badge trạm đo, số case mở và điểm rủi ro lớn.
- **Backend Worker Operational Endpoints (`staff.routes.js`)**:
  - Đã mount toàn bộ 10 phân hệ Staff vào Worker Hono app (`app/server/app.js`), tương thích 100% Local SQLite.
- **Sức khỏe Mã nguồn**:
  - `node --test app/tests/staff-worker-d1-api.test.js`: **8/8 tests PASS 100%**.
  - `npm --prefix app run verify:quick`: **287/287 tests PASS 100%** (29 test files + 42 UI smoke tests, ~4.5s).

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
