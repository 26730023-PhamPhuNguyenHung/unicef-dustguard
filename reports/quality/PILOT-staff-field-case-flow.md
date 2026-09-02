# Báo Cáo Chất Lượng: Luồng Tác Nghiệp Cán Bộ Hiện Trường (Staff Field Case Flow)

> **Mã báo cáo**: `REPORT-PILOT-STAFF-01`  
> **Ngày kiểm thử**: 2026-09-02  
> **Bộ kiểm thử thực thi**: `node --test app/tests/harness-staff-pilot.test.js` & `node scripts/harness.js journey staff`  

---

## 1. Kết Quả Đánh Giá Phân Tầng (Quality Scorecard)

| Khía cạnh kiểm chuẩn | Kết quả | Ghi chú thực chứng |
|---|:---:|---|
| **Business Flow (Nghiệp vụ)** | **PASS** | Hoàn tất đầy đủ luồng: Tiếp nhận $\to$ Khảo sát 10 tiêu chí QCVN $\to$ Tải ảnh Before/After $\to$ Đóng hồ sơ nghiệm thu. |
| **Frontend UI (Giao diện)** | **PASS** | Thẻ tab chuyển đổi mượt mà, ảnh minh chứng có gắn mã băm SHA-256, modal phân công và đóng hồ sơ phản hồi tức thì. |
| **Backend API (Định tuyến)** | **PASS** | Các endpoint `/api/staff/cases/:id/detail`, `/assign`, `/inspection`, `/evidences`, `/complete` phản hồi chuẩn HTTP 200/201. |
| **D1 Persistence (CSDL D1)** | **PASS** | Toàn bộ đột biến được ghi trực tiếp vào `prisma/dev.db` SQLite (bảng `cases`, `inspections`, `evidences`, `case_timelines`). F5 Reload bảo toàn 100% dữ liệu. |
| **Permissions (Phân quyền)** | **PASS** | Xác thực vai trò `staff` hợp lệ, chặn truy cập trái phép. |
| **Mobile Responsive (Di động)** | **PASS** | Kiểm tra trên 375x812 và 390x844: Không có thanh cuộn ngang (`overflow-x`), touch targets $\ge 44\text{px}$. |
| **Console Errors (DevTools)** | **PASS** | 0 lỗi đỏ Uncaught TypeError / Unhandled Promise Rejection trong suốt quá trình người dùng thao tác. |
| **Network (Mạng & Proxy)** | **PASS** | Cấu hình proxy Vite preview chia sẻ với dev server, không có request 5xx hoặc duplicate calls. |
| **Human-Centric (Vị nhân sinh)** | **PASS** | Giao diện kem sáng (`#FDFBF7`), chữ đậm (`#231b14`), không dùng glassmorphism, nút 1-3 từ, nút 1-chạm "Đạt tất cả" hỗ trợ thao tác ngoài trời nắng gắt. |
| **Regression (Kiểm tra hồi quy)** | **PASS** | Toàn bộ 29 test suites trong `npm run verify:quick` đạt 100% (245/245 in-memory + 42/42 UI smoke). |

---

## 2. Các Phát Hiện & Bài Học Trong Quá Trình Pilot (Findings & Root Causes)
1. **Lỗi Schema Cột `deadline` vs `slaDeadline`**:
   - *Hiện tượng*: Query `/summary`, `/priorities`, `/list` trong `staff-cases.js` bị lỗi `no such column: deadline`.
   - *Nguyên nhân gốc*: Bảng `cases` trong SQLite schema chỉ có cột `slaDeadline`, không có cột `deadline`.
   - *Khắc phục*: Thay thế truy vấn bằng `c.slaDeadline as deadline`.
2. **Lỗi Cột Bảng `case_timelines`**:
   - *Hiện tượng*: Thao tác ghi nhận timeline trong `staff-cases.js` gọi `step, title, description` gây sập câu lệnh SQL.
   - *Nguyên nhân gốc*: Schema chuẩn của D1 định nghĩa các cột: `eventType, eventTitle, eventDescription, actorName, actorRole`.
   - *Khắc phục*: Đồng bộ lại toàn bộ câu lệnh INSERT trong `staff-cases.js` và cập nhật `.agents/BUG_MEMORY.md`.
3. **Cấu Hình Preview Proxy Trong `vite.config.js`**:
   - *Hiện tượng*: Lệnh `vite preview` không tự động kế thừa proxy từ `server.proxy`, dẫn đến lỗi kết nối mạng tới backend 8787 khi chạy Playwright.
   - *Khắc phục*: Khai báo `proxyConfig` dùng chung cho cả `server.proxy` và `preview.proxy`.

---

## 3. Các Tệp Đã Sửa Đổi & Bổ Sung (Changed Files)
- `AGENTS.md` (Cập nhật 5 trụ cột kỷ luật hiến chương agent)
- `.agents/DEFINITION_OF_DONE.md` (Chuẩn hóa 22 tiêu chí)
- `.agents/skills/*.md` (9 tài liệu kỹ năng chuyên biệt)
- `docs/engineering/current-system-map.md` (Bản đồ hệ thống)
- `docs/engineering/agy-workflow.md` (Hướng dẫn lệnh CLI)
- `docs/engineering/antigravity-workflow.md` (Quy trình IDE)
- `specs/TEMPLATE.md` & `specs/staff/SPEC-staff-case-evidence-flow.md` (Hệ thống spec)
- `.specify/bugs/BUG_TEMPLATE.md` (Hệ thống quản lý lỗi)
- `scripts/harness.js` (Bộ điều phối Harness CLI)
- `app/tests/harness-staff-pilot.test.js` (Bộ test Playwright & D1 E2E)
- `app/server/routes/api/staff-cases.js` (Sửa lỗi schema SQLite)
- `app/vite.config.js` (Thêm proxy cho preview)
- `package.json` (Thêm type module và các script harness)

---

## 4. Các Rủi Ro Còn Lại (Remaining Risks)
- Môi trường Cloudflare production cần deploy migration đồng bộ nếu có thay đổi cột trên remote D1.
- Hiện tại local dev.db đã đồng bộ hoàn hảo với schema.

---

## 5. Kết Luận Nghiệm Thu (Readiness Verdict)
**READY: YES**  
Hành trình thí điểm cán bộ hiện trường (Staff Field Case Flow) đạt 100% tiêu chí nghiệm thu định lượng, có thực chứng runtime bằng Playwright và D1 SQLite.
