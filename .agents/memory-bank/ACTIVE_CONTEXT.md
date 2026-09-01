# ACTIVE CONTEXT — DUSTGUARD VN

> **Trạng thái**: Production Ready & Fully Verified | **Branch**: `master` | **Cập nhật**: 2026-08-31

---

## 🎯 1. Trọng Tâm Hoạt Động Hiện Tại (Active Operational State)
- **Hệ thống**: Toàn bộ kiến trúc Cloudflare D1 (Structured Metadata) + R2 (Binary Objects) + Worker Edge Router + Vite React Client đã hoàn tất kiểm toán 100%.
- **Chốt 2 Quy Chuẩn Bắt Buộc Mới**:
  - **14-inch Windows 125% Scale SSOT (`.agents/rules/ui.md`, `.agents/rules/UI_RULES.md`)**:
    - Chuẩn CSS viewport acceptance Target số 1: `1536 x 864` (độ phân giải thực tế của Windows 125% scaling trên màn 1080p), tiếp theo là `1366 x 768`.
    - Data Table Responsive Rules: Tối ưu ưu tiên cột (P1: Tên/Điểm/Mức độ/Thao tác luôn rõ ràng; P2/P3: Co gọn/gộp hoặc ẩn dữ liệu phụ), không gây page horizontal scroll.
  - **File / Image Storage & Broken Image Rule (`.agents/rules/frontend.md`)**:
    - D1 chỉ lưu metadata và `object_key` + SHA-256 fingerprint, R2 lưu binary WebP/JPEG (display ~ 1200-1600px).
    - Cấm lưu base64 TEXT hay URL tuyệt đối vào DB.
    - Broken Image Rule: Bắt buộc dùng `SafeImage` với `onError` fallback neutral placeholder SVG, cấm lộ icon vỡ hình mặc định của browser.
- **Hoàn Tất Refactor Trang Cảnh Báo (`/staff/alerts`) Theo Chuẩn 1536x864**:
  - Tỉ lệ layout: 75% Bảng danh sách (`flex-1 min-w-0`) + 25% Panel "Ưu tiên hôm nay" (cố định `w-full xl:w-[310px] xl:shrink-0`). Khi màn hình hẹp (< 1350px), panel tự chuyển xuống dưới, không bóp nghẹt bảng chính.
  - Tích hợp `SafeImage` cho thumbnail bằng chứng và card ưu tiên.
  - Action buttons tinh gọn: `[+ Hồ sơ] [Gán] [Ẩn]`, zero text collision, zero page-level horizontal overflow.
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
