# ACTIVE CONTEXT — DUSTGUARD VN

> **Trạng thái**: Production Ready & Fully Verified | **Branch**: `master` | **Cập nhật**: 2026-09-01

---

## 🎯 1. Trọng Tâm Hoạt Động Hiện Tại (Active Operational State)
- **Hệ thống**: Toàn bộ kiến trúc Cloudflare D1 (Structured Metadata) + R2 (Binary Objects) + Worker Edge Router + Vite React Client đã hoàn tất kiểm toán 100%.
- **Chốt 3 Quy Chuẩn Bắt Buộc Mới**:
  - **14-inch Windows 125% Scale SSOT (`.agents/rules/ui.md`, `.agents/rules/UI_RULES.md`)**:
    - Chuẩn CSS viewport acceptance Target số 1: `1536 x 864` (độ phân giải thực tế của Windows 125% scaling trên màn 1080p), tiếp theo là `1366 x 768`.
    - Data Table Responsive Rules: Tối ưu ưu tiên cột (P1: Tên/Điểm/Mức độ/Thao tác luôn rõ ràng; P2/P3: Co gọn/gộp hoặc ẩn dữ liệu phụ), không gây page horizontal scroll. Tỉ lệ 75% Bảng chính (`flex-1 min-w-0`) + 25% Panel phụ (cố định `w-full xl:w-[310px] xl:shrink-0`).
  - **File / Image Storage & Broken Image Rule (`.agents/rules/frontend.md`)**:
    - D1 chỉ lưu metadata và `object_key` + SHA-256 fingerprint, R2 lưu binary WebP/JPEG (display ~ 1200-1600px).
    - Cấm lưu base64 TEXT hay URL tuyệt đối vào DB.
    - Broken Image Rule: Bắt buộc dùng `SafeImage` với `onError` fallback neutral placeholder SVG, cấm lộ icon vỡ hình mặc định của browser.
  - **D1 SQLite Zero-Mock Rule (`.agents/rules/zero-mock-d1-ssot.md`)**:
    - Cấm tuyệt đối chèn fake objects (`setSite({ ... })`, hardcode fallback) trong client React UI pages.
    - Mọi dữ liệu mẫu/seed data đều được seed vào `prisma/dev.db` (D1 SSOT) thông qua `app/scripts/seed-mockups-canonical-d1.mjs` và truy vấn qua API endpoints backend.
- **Hoàn Tất Chuẩn Hóa 10 Màn Hình Staff Khớp 100% 10 Mockup Chính Thức**:
  - **Mockup 1 (`/staff`)**: Trang chính Staff Dashboard — Chuỗi 24h & OSM GIS.
  - **Mockup 2 (`/staff/monitoring`)**: Giám sát quan trắc bụi công trình & Chuỗi thời gian trạm đo.
  - **Mockup 3 (`/staff/alerts`)**: Cảnh báo mới — Bảng 75% + Panel 25% "Ưu tiên hôm nay", SafeImage.
  - **Mockup 4 (`/staff/sites`)**: Công trình đang theo dõi — 4 KPI cards, Bảng 9 cột kèm dropdown thao tác, Panel "Cần chú ý - Top 3 công trình" (91, 87, 74), Modal Thêm & Nhập Excel.
  - **Mockup 5 (`/staff/sites/:id`)**: Chi tiết công trình — Header info card, 4 KPI, Bản đồ vị trí OSM + Line chart 7 ngày + Việc cần bổ sung, 2 Bảng: Hồ sơ liên quan & Lịch sử đo gần đây.
  - **Mockup 6 (`/staff/cases`)**: Hồ sơ đang xử lý — 4 KPI cards, 6 Tabs, Bảng 7 cột (DAG step badge, avatar initials cán bộ, hạn xử lý), Panel "Ưu tiên hôm nay".
  - **Mockup 7 (`/staff/cases/:id`)**: Chi tiết hồ sơ vụ việc — Metadata bar, 6 Tabs (Thông tin, Ảnh, Theo dõi, Khảo sát, Khắc phục, Hồ sơ), AI suggestion badge, Bằng chứng cần bổ sung, Timeline, Danh sách việc, Ảnh Before/After qua `SafeImage`.
  - **Mockup 8 (`/staff/tasks`)**: Nhiệm vụ được giao — 4 KPI, 5 Tabs, Bảng 7 cột (Chip số lượng hồ sơ đính kèm), Panel "Lịch hôm nay" theo giờ tác nghiệp thực tế.
  - **Mockup 9 (`/staff/reports`)**: Báo cáo và chia sẻ — 4 KPI, Biểu đồ xu hướng 4 tuần (Tuần 20–23), 4 Mẫu báo cáo nhanh (PDF, Excel, Link, Lên lịch), Banner email tự động Thứ 2, Bảng báo cáo đã tạo.
  - **Mockup 10 (`/staff/notifications`)**: Thông báo vận hành — 4 KPI, 5 Tabs, Bảng thông báo có nút hành động trực tiếp (Mở, Tạo việc, Tắt nhắc), Panel "Việc cần chú ý" sự kiện khẩn.
- **Sức khỏe Mã nguồn**:
  - `npm --prefix app run verify:quick`: **279/279 tests PASS 100%** (28 test files + 42 UI smoke tests, ~3.5s).
  - Đã bổ sung 3 test suites mới: `staff-sites-mockup4-5.test.js`, `staff-cases-mockup6-7.test.js`, `staff-mockups8-9-10.test.js`.
  - `npm --prefix app run build`: **Vite production bundle PASS 100%** (0 errors).

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
