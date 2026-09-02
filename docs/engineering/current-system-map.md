# Bản Đồ Hệ Thống Kỹ Thuật DustGuard VN (Current System Map)

> **Mục tiêu**: Định danh ranh giới kiến trúc thực tế, xác lập nguồn chân lý (SSOT) và các khu vực cấm tạo trùng lặp cho các AI coding agent.

---

## 1. Các Phân Hệ Đang Hoạt Động (Active Applications & Personas)

DustGuard VN được tổ chức dưới dạng Single Page Application (Vite + React 19) chia theo vai trò người dùng (Role Sub-Apps) tại `app/src/apps/`:

| Phân hệ / Vai trò | Thư mục nguồn | Trách nhiệm chính | Điểm vào giao diện |
|---|---|---|---|
| **Cộng đồng & Công dân (Citizen)** | `app/src/apps/citizen/` | Ghi nhận phát tán bụi, gắn định vị WGS84, mã băm SHA-256 ảnh, theo dõi tiến độ xử lý, tích lũy giờ tình nguyện và tín chỉ thanh niên (20h = 4.0 tín chỉ). | `/citizen`, `/citizen/report`, `/citizen/track`, `/citizen/youth` |
| **Cán bộ Hiện trường (Staff)** | `app/src/apps/staff/` | 12 phân hệ nghiệp vụ: Dashboard giám sát, hồ sơ vụ việc 7 bước DAG, khảo sát 10 tiêu chí QCVN 18:2021/BXD, đối chứng Before/After, điều phối nhiệm vụ hiện trường, cảnh báo vượt ngưỡng PM2.5. | `/staff`, `/staff/cases`, `/staff/cases/:id`, `/staff/sites`, `/staff/tasks`, `/staff/monitoring`, `/staff/alerts` |
| **Nhà thầu Thi công (Contractor)** | `app/src/apps/contractor/` | Tiếp nhận yêu cầu khắc phục, cập nhật tiến độ công trình, tải lên ảnh minh chứng đối chứng (Before/After), cam kết tuân thủ môi trường. | `/contractor`, `/contractor/projects`, `/contractor/actions` |
| **Ban Quản trị (Admin)** | `app/src/apps/admin/` | Quản lý người dùng, phân quyền RBAC, danh mục công trình, cấu hình cảm biến IoT và quy chuẩn kỹ thuật. | `/admin`, `/admin/users`, `/admin/sites`, `/admin/settings` |
| **Chỉ huy & Lãnh đạo (Executive)** | `app/src/apps/executive/` | Trung tâm chỉ huy dữ liệu đô thị, chỉ số rủi ro CPS, bản đồ nhiệt ô nhiễm, báo cáo pháp lý và ký số văn bản môi trường. | `/executive/dashboard`, `/executive/command` |
| **Trang Công cộng & Cổng thông tin (Public)** | `app/src/apps/public/` | Landing page nhận diện CivicTech, bản đồ tra cứu chất lượng không khí mở, hướng dẫn lắp ráp cảm biến IoT mã nguồn mở, Demo Hub. | `/`, `/map`, `/sensor-guide`, `/demo` |
| **Xưởng Văn Bản & Pháp chế (Document Studio)** | `app/src/modules/documents/` | Soạn thảo, kết xuất văn bản xử lý vi phạm theo Nghị định 30/2020/NĐ-CP và QCVN môi trường. | `/documents`, `/templates`, `/policy` |

---

## 2. Ranh Giới API & Định Tuyến Backend (API Boundaries)

- **Cloudflare Worker (Hono Edge)**: Nằm tại `app/server/worker.js` và `app/server/routes/worker/`. Đây là runtime API chính thức chạy tại cổng `8787` (hoặc proxy qua Vite `/api`).
  - Toàn bộ kết quả trả về tuân thủ chuẩn thống nhất: `{ success: true, data: ... }` hoặc lỗi theo RFC 7807 Problem Details.
  - Phục vụ các endpoint nghiệp vụ:
    - `/api/staff/*` — Tác nghiệp cán bộ, hồ sơ, khảo sát, nhiệm vụ.
    - `/api/cases/*` — Vòng đời 7 bước xử lý vụ việc.
    - `/api/sites/*` — Dữ liệu công trình và trạm quan trắc.
    - `/api/complaints/*` & `/api/observations/*` — Phản ánh từ công dân.
    - `/api/contractor/*` — Hành động khắc phục từ nhà thầu.
    - `/api/youth/*` — Tín chỉ và giờ tình nguyện thanh niên.
- **Node.js Express Fallback**: Nằm tại `app/server/index.js` — Chỉ sử dụng khi phát triển local không bật Miniflare/Wrangler.

---

## 3. Ranh Giới Cơ Sở Dữ Liệu D1 SSOT (Database Boundaries)

- **Cơ sở dữ liệu duy nhất (SSOT)**: Cloudflare D1 (`dustguard-production` / `prisma/dev.db` SQLite local).
- **Cấm tuyệt đối**: Cấm lưu dữ liệu nghiệp vụ vào `localStorage` giả mạo (ngoại trừ token session/auth) khi API backend đã hỗ trợ.
- **Cấu trúc bảng chính**:
  - `cases`: Hồ sơ vụ việc môi trường (trạng thái, mã hồ sơ, hạn SLA 48h, độ ưu tiên).
  - `sites`: Công trình xây dựng (tọa độ WGS84, tên dự án, nhà thầu).
  - `complaints`: Phản ánh hiện trường từ công dân.
  - `tasks`: Nhiệm vụ cán bộ và nhà thầu.
  - `inspections`: Biên bản khảo sát thực địa với 10 tiêu chí QCVN 18:2021/BXD.
  - `case_evidences` & `evidences`: Minh chứng ảnh kèm mã băm SHA-256 đối chứng Before/After.
  - `sensors` & `telemetry`: Cảm biến bụi và dữ liệu đo đạc thời gian thực.
  - `users` & `profiles`: Tài khoản và thông tin cán bộ / công dân.

---

## 4. Ranh Giới Kiểm Thử (Test Boundaries)

1. **Kiểm thử đơn vị & Domain logic**: Chạy bằng Node.js Native Test Runner (`node --test app/tests/<file>.test.js`) với thời gian phản hồi siêu tốc (<0.5s).
2. **Kiểm thử tích hợp D1 SQLite**: Kiểm tra đột biến (CREATE / UPDATE / DELETE) ghi nhận bền vững vào `prisma/dev.db`.
3. **Kiểm thử tự động trình duyệt (Playwright)**: Sử dụng Microsoft Edge / Chromium headless để rà soát toàn bộ routes, bắt lỗi console, lỗi network và kiểm tra layout trên các kích thước màn hình:
   - 375x812 (Mobile Tiêu chuẩn)
   - 390x844 (Mobile Hiện đại)
   - 768x1024 (Tablet)
   - 1440x900 (Desktop)
4. **Kiểm toán giao diện (DevTools MCP)**: Kiểm tra tương phản, touch target tối thiểu 44px, không tràn ngang (`overflow-x`), không dùng glassmorphism.

---

## 5. Vùng Cũ & Lưu Trữ (Legacy & Archived Areas)

- `legacy/`: Mã nguồn phiên bản cũ (archived) — Không chỉnh sửa, không import vào mã nguồn chính.
- `/community/*`: Các URL cũ đã được cấu hình chuyển hướng (redirect) 301/302 sang `/citizen/*`.
- `/app/*`: URL cũ đã được chuyển hướng sang `/staff/*`.

---

## 6. Vùng Cấm Tạo Trùng Lặp (Strict Anti-Duplication Directives)

1. **Cấm tạo thêm component Button / Input / Card**: Toàn bộ UI component phải sử dụng từ `app/src/shared/components/` hoặc `packages/ui`.
2. **Cấm tạo API route trùng lặp**: Mọi chức năng mới phải gắn kết vào module router tương ứng trong `app/server/routes/worker/`.
3. **Cấm tạo thêm bảng CSDL trùng lặp**: Mọi thực thể liên quan vụ việc, công trình, biên bản phải ánh xạ vào các bảng hiện có trong `prisma/d1-schema.sql`.
4. **Cấm viết logic tính điểm SLA / Tín chỉ phân tán**: Toàn bộ nghiệp vụ tính toán phải quy chuẩn theo các hàm SSOT trong `packages/domain` và `app/server/services/`.
