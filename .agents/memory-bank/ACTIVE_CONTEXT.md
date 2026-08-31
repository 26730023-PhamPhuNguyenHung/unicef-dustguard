# ACTIVE CONTEXT — DUSTGUARD VN

> **Trạng thái**: Production Ready & Fully Verified | **Branch**: `master` | **Cập nhật**: 2026-08-31

---

## 🎯 1. Trọng Tâm Hoạt Động Hiện Tại (Active Operational State)
- **Hệ thống**: Toàn bộ kiến trúc Cloudflare D1 + Worker Edge Router + Vite React Client đã hoàn tất kiểm toán 100%.
- **Red-First Design System SSOT (Hoàn tất)**:
  - Chuẩn hóa toàn bộ hệ màu thương hiệu chính sang **ĐỎ** (`#B91C1C` Primary Red, `#991B1B` Hover, `#7F1D1D` Dark, `#FEF2F2` Soft, `#FECACA` Border).
  - Phân định rõ ràng: Brand Red cho thương hiệu/nav/primary CTAs, Alert Red (`#DC2626`) chỉ dùng cho lỗi/quá hạn; Giữ vững Semantic Colors (Success green `#15803D`, Warning orange `#C2410C`, Info blue `#0369A1`).
  - Chuẩn hóa toàn bộ Layouts và Pages: `/staff` (Dashboard, Cases, CaseDetail, Sites, SiteDetail, Tasks, Alerts, Settings, Profile), `/citizen` (Home, Reports, ReportNew, Profile), `/contractor` (Layout, Dashboard, Tasks, Cases, Reports), `/admin` (Layout, UsersManagement, Settings), Auth Pages (Login, LoginForm, DemoAccessModal).
  - Nền sáng sạch `#FAFAF9`, thẻ trắng `#FFFFFF`, chữ đậm `#1C1917`, touch targets $\ge 44\text{px}$, zero glassmorphism.
- **Hoàn Tất Giai Đoạn 2 (Staff Case Workspace) & Giai Đoạn 3 (IoT Monitoring & Alerts)**:
  - **Staff Case Workspace (`/staff/cases/:id`)**: Nâng cấp thành Case Workspace 6 Tab (`[Thông tin]`, `[Hình ảnh]`, `[Theo dõi]`, `[Khảo sát]`, `[Khắc phục]`, `[Hồ sơ]`). Tích hợp 10 tiêu chuẩn khảo sát hiện trường lưu D1 (`PASS | FAIL | NA`, ghi chú thực địa), đối chứng Before/After evidence và Geofence do backend tính toán.
  - **IoT Monitoring (`/staff/monitoring`)**: Trang quan trắc realtime với bộ đếm trạng thái (`Online` / `Cảnh báo` / `Offline > 15p`), bảng cảm biến và modal xem đồ thị 24h reading history (`/api/sensors/:id/readings`).
  - **Atomic Alert-to-Case (`POST /api/alerts/:id/open-case`)**: Tạo vụ việc nguyên tử từ cảnh báo bụi vượt ngưỡng trong D1 transaction, tự động phát hiện và liên kết hồ sơ đang mở để chống trùng lặp.
  - **Staff Navigation & Router**: Bổ sung đầy đủ route `/staff/monitoring` và `/staff/alerts` vào hệ thống.
- **Sức khỏe Mã nguồn**:
  - `npm --prefix app run verify:quick`: **279/279 tests PASS 100%** (28 test files + 42 UI smoke tests, ~2.0s).
  - `node --test app/tests/alert-to-case-atomic.test.js`: **PASS 100% (20ms)**.
  - `npm --prefix app run build`: **Vite production bundle PASS 100%** (0 errors, 2.5s).
- **Quy tắc Vận hành**: 
  - Tuân thủ nghiêm ngặt 10 Core Invariants trong [`AGENTS.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/AGENTS.md).
  - Sử dụng Fast Verification Pipeline: Chỉ chạy Level 0 (`node --test app/tests/<file>.test.js`) khi đang code, chạy Level 3 trước khi hoàn tất.
  - Micro-commit tự động ngay khi hoàn tất từng tác vụ nhỏ.

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

---

## ⚡ 3. Nguyên Tắc Code Siêu Tốc (Fast Dev Principles)
1. **Không mở toàn bộ tài liệu**: Chỉ mở file SSOT liên quan trực tiếp đến tác vụ đang làm.
2. **Không chạy full test liên tục**: Dùng lệnh targeted `node --test app/tests/<target>.test.js` (< 0.5s).
3. **Chủ động PowerShell CLI**: Tự chạy lệnh trực tiếp, không yêu cầu người dùng thao tác.
4. **Luôn giữ UI tương phản cao, zero glassmorphism**: Màu kem `#FDFBF7`, chữ đậm `#231B14`, touch target $\ge 44\text{px}$.
5. **Cập nhật Memory-Bank & Commit ngay**: Khi xong việc nhỏ, chạy `verify:quick`, cập nhật memory-bank và commit.
