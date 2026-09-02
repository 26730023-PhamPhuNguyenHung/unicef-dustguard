# ACTIVE CONTEXT — DUSTGUARD VN

> **Trạng thái**: Landing Page Redesign SSOT & Real Data Dashboard 100% | **Branch**: `master` | **Cập nhật**: 2026-09-02

---

## 🎯 1. Trọng Tâm Hoạt Động Hiện Tại (Active Operational State)
- **Tái Thiết Toàn Diện Landing Page Chuẩn Civic Tech (DUSTGUARD VN SSOT)**:
  - Đồng bộ 100% nội dung và triết lý từ đặc tả `DUSTGUARD VN.md`: *"Phát hiện bụi. Tạo hồ sơ. Theo dõi đến khi có kết quả."*
  - **Hero Section & Interactive Case Dossier**: Mẫu hồ sơ `#DG-2026-0842` (Vành đai 3 · Dịch Vọng Hậu) với tiến trình 5 bước, Before/After toggle, PM2.5 metric, mã xác thực SHA-256.
  - **Khoảng trống thực tế (Problem)**: 6 nguồn dữ liệu phân tán & 4 câu hỏi trăn trở lớn.
  - **Quy trình 4 bước (Process)**: 01 Ghi nhận -> 02 Xác minh -> 03 Ưu tiên (0-100) -> 04 Tạo Case.
  - **Theo dõi & Tái kiểm (Accountability Loop & Before/After)**: Vòng lặp 6 bước khép kín và đối chứng hiện trường Before vs After.
  - **Phân vai 5 Nhóm tác nhân (Roles)**: Người dân, Tình nguyện viên/CLB sinh viên, Người điều phối, Đơn vị xử lý, Quản trị & Lãnh đạo.
  - **Công nghệ & Cảm biến mở (Tech & Open IoT)**: 3 trụ cột Bằng chứng số, Bản đồ GIS, AI trợ lý; Khối IoT tham chiếu `≈ 500.000đ/node`.
  - **Trải nghiệm Giao diện Vận hành (Live Workspace)**: Dashboard 5 KPI, Việc của tôi (Lịch trình kiểm tra viên), Dòng thời gian minh bạch theo phút.
  - **Lộ trình Pilot & Kêu gọi đối tác (Impact & CTA)**: 5 cam kết cốt lõi, 3 giai đoạn triển khai và DustGuard Manifesto.
  - **Đảm bảo Nguyên Tắc Thiết Kế**: Sáng màu tương phản cao (Sand Cream, Ink, Seal Red, Teal), tuyệt đối KHÔNG glassmorphism, touch target >= 44px, responsive 360px - 1920px.
- **Sức khỏe Mã nguồn**:
  - `npm --prefix app run verify:quick`: **279/279 tests PASS 100%** (28 test files + 4 UI smoke tests, ~3.6s).
  - `npm --prefix app run build`: **Vite build thành công 100%** (6.33s).

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
