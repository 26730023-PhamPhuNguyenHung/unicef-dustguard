# ACTIVE CONTEXT — DUSTGUARD VN

> **Trạng thái**: Production Ready & Fully Verified | **Branch**: `master` | **Cập nhật**: 2026-08-31

---

## 🎯 1. Trọng Tâm Hoạt Động Hiện Tại (Active Operational State)
- **Hệ thống**: Toàn bộ kiến trúc Cloudflare D1 + Worker Edge Router + Vite React Client đã hoàn tất kiểm toán 100%.
- **Hoàn thiện Flow Thêm Công Trình Mới (Staff Sites Modal)**:
  - Loại bỏ hoàn toàn trường Quận/Huyện, chuẩn hóa luồng Tỉnh/Thành phố → Phường/Xã trực tiếp.
  - Sửa dứt điểm Dropdown Tỉnh/Thành phố & Phường/Xã kết nối backend D1 + Fallback SSOT.
  - Tích hợp Parser thông minh dán link Google Maps, tự động bóc tách tọa độ `lat, lng` trực quan không cần nhập số thủ công.
  - Loại bỏ trường điểm ưu tiên 0-100 và tối ưu form còn 3 section tinh gọn.
- **Sức khỏe Mã nguồn**:
  - `npm --prefix app run verify:quick`: **279/279 tests PASS 100%** (28 test files + 42 UI smoke tests, ~3.5s).
  - `node --test app/tests/site-location-maps-audit.test.js`: **7/7 tests PASS 100%**.
  - `npm --prefix app run build`: **Vite production bundle PASS 100%** (0 errors, 1.96s).
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
