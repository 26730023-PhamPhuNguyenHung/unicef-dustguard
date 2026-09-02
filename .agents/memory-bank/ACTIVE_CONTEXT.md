# ACTIVE CONTEXT — DUSTGUARD VN

> **Trạng thái**: Local DB First (100% SQLite SSOT) & Verified | **Branch**: `master` | **Cập nhật**: 2026-09-02

---

## 🎯 1. Trọng Tâm Hoạt Động Hiện Tại (Active Operational State)
- **Chuẩn Hóa Hợp Đồng Dữ Liệu API (API Contract & Normalization SSOT - `.agents/rules/api-data-contract-normalization.md`)**:
  - Ban hành Invariant 12: Frontend cấm đoán schema; chuẩn hóa toàn bộ API client layer (`request.js`, `staff-api.js`, `public-api.js`, `admin-api.js`, `useApiData.js`).
  - Toàn bộ collections được unwrap qua `normalizeList(res)` đảm bảo luôn trả về `Array.isArray` `[]` an toàn, chấm dứt hoàn toàn các lỗi runtime `.slice is not a function` hay `.map is not a function`.
  - Bổ sung Trap 0.10 vào `BUG_MEMORY.md` và đưa vào SSOT Matrix.
- **Quy Tắc Kiểm Thử Theo Giá Trị Nghiệp Vụ (Business-Value Testing - `.agents/rules/business-value-testing-rules.md`)**:
  - Ban hành Invariant 13: Ưu tiên test theo giá trị nghiệp vụ thực tế, cấm chạy theo số lượng hay vanity coverage.
  - Phân tầng 5 lớp: Unit (Business logic/Rules), Integration (API+DB+RBAC), Contract (Shape response), E2E (P0 Journeys), UI (Behavior > Markup).
- **Quy tắc Phát Triển (Local DB First SSOT - `.agents/rules/local-db-first-development.md`)**:
  - Toàn bộ backend và frontend chạy 100% trên Local SQLite (`app/prisma/dev.db`). Khi hoàn thiện toàn diện hệ thống sẽ tiến hành sync Cloudflare D1 Production.
  - Số liệu KPI đồng bộ chính xác với `COUNT(*)` từ SQLite (Sites: 37, High risk: 14, Monitoring: 26, Stable: 5).
  - Phân trang động dựa trên `Math.ceil(totalSitesCount / limit)` (5 trang cho 37 bản ghi).
- **Sức khỏe Mã nguồn**:
  - `npm --prefix app run verify:quick`: **279/279 tests PASS 100%** (28 test files + 4 UI smoke tests, ~3.4s).

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
