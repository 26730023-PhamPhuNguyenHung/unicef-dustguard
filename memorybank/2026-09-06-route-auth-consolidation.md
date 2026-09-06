# DUSTGUARD VN — ROUTE GRAPH AUDIT & AUTH CONSOLIDATION REPORT

> **Ngày thực hiện**: 2026-09-06  
> **Trạng thái**: Research & Audit Completed -> Sẵn sàng Execution  
> **Artifacts sinh ra**:
> - `audit-output/route-inventory.json` (100% routes được quét bằng code scanner)
> - `audit-output/route-matrix.json` (Phân loại Keep, Merge, Redirect, Retire)

---

## 1. TỔNG QUAN SỐ LIỆU ROUTE TOÀN BỘ REPOSITORY (ĐẾM TỪ CODE THẬT)

| Phân hệ / Workspace | Loại Route | Số lượng | Trạng thái |
|---|---|---|---|
| **Side A (apps/web)** | Frontend Community & Public Routes | **53** | Đang hoạt động trên Production |
| **Side B (dustguard-operations)** | Frontend Operations Command Center | **43** | Đang hoạt động trên `/operations/*` |
| **Tổng Frontend Thực Tế** | Side A + Side B | **96** | Hoạt động thật (0 Broken Nav Links) |
| **Legacy Frontend (app/)** | Legacy Demo Routes | **130** | Đã cô lập, không load vào Production |
| **Production Cloudflare Worker (server/)** | Backend API & System Routes | **81** | Unified Runtime trên Cloudflare Edge |
| **Local Express Servers (dev)** | Local Dev Backend API | **57** | Express cục bộ phục vụ dev máy trạm |
| **Tổng API Endpoints** | Worker + Local Express | **138** | Được đối soát và bảo vệ RBAC |

---

## 2. PHÁT HIỆN DUPLICATE & OVERLAP ENTRY POINTS

### A. Vấn đề 2 Màn hình Login Độc lập (Duplicate Auth Entry):
1. `/login` (thuộc Side A):
   - Tiêu đề: "Đăng nhập DustGuard VN - Một nền tảng · Hai phía"
   - Có 2 tab: "Phía Cộng đồng" và "Đơn vị Xử lý".
   - **Lỗi**: Khi chọn "Đơn vị Xử lý", UI không cho phép đăng nhập trực tiếp mà chỉ hiển thị thẻ thông tin với nút dẫn sang `/operations/login`!
2. `/operations/login` (thuộc Side B):
   - Tiêu đề: "DustGuard Operations"
   - Chứa form login riêng bằng `username`/`password`.
   - **Lỗi bảo mật & thông tin kiến trúc**:
     - Hiển thị công khai danh sách tài khoản mẫu kèm mật khẩu `password123` mà không yêu cầu bật chế độ demo.
     - Hiển thị dòng text sai lệch kiến trúc: `"Hệ thống lưu trữ dữ liệu chân thực SSOT SQLite cục bộ."` trong khi runtime production đã chạy 100% trên Cloudflare D1 Remote (`dustguard-production`).

### B. Route Graph & Phân tích Kiến trúc Auth:
- Cả hai phía đều chạy trên cùng một domain canonical: `dustguard.phamphunguyenhung.com`.
- Cả hai phía đều lưu JWT vào `localStorage.getItem('dustguard_token')` và dùng chung `JWT_SECRET = 'dustguard-production-jwt-secret-2026'`.
- Backend Cloudflare Worker (`server/index.ts`) đã hỗ trợ cả hai:
  - `/api/auth/login`: Xác thực cộng đồng (bảng `users`), nhận email/password.
  - `/api/operations/auth/login` (alias `/operations/api/auth/login`): Xác thực nghiệp vụ chuyên trách (bảng `ops_users`), nhận username/email + password.

---

## 3. CANONICAL INFORMATION ARCHITECTURE (IA) QUYẾT ĐỊNH

```text
dustguard.phamphunguyenhung.com
│
├── /login                         ← DUY NHẤT 1 CỔNG ĐĂNG NHẬP CANONICAL (2-Side Switch)
│
├── /                              ← Trang chủ công chúng (Landing Page)
├── /reports/*                     ← Tra cứu & gửi phản ánh cộng đồng
├── /map                           ← Bản đồ chất lượng không khí & điểm nóng ô nhiễm
├── /dashboard                     ← Tổng quan cộng đồng (sau đăng nhập Citizen/Member)
├── /tasks                         ← Nhiệm vụ tình nguyện viên (Thanh niên CLB)
├── /credits                       ← Tín chỉ thanh niên & Giờ tình nguyện
├── /communities/*                 ← Mạng lưới cộng đồng & CLB
├── /moderator/*                   ← Hộp thư & Điều phối viên cộng đồng
├── /admin/*                       ← Quản trị cộng đồng (Overview, Users, Audit)
├── /contractor/*                  ← Cổng tiếp nhận & khắc phục dành cho Nhà thầu
│
├── /operations/*                  ← TOÀN BỘ PHÂN HỆ ĐƠN VỊ XỬ LÝ (Namespace duy nhất)
│   ├── /login                     ← [REDIRECT 302] -> /login?side=operations (Không còn trang riêng)
│   ├── /dashboard                 ← Trung tâm điều hành tác chiến
│   ├── /cases/*                   ← Quản lý hồ sơ vi phạm & điều phối
│   ├── /inspections/*             ← Kiểm tra hiện trường (Field inspections)
│   ├── /actions/*                 ← Giám sát khắc phục ô nhiễm
│   ├── /legal/*                   ← Trí tuệ pháp lý FTS5 & Thư viện quy chuẩn
│   ├── /iot/*                     ← Giám sát thiết bị & viễn thám ô nhiễm
│   ├── /supervisor/*              ← Điều phối tải việc lãnh đạo
│   └── /admin/*                   ← Quản trị vận hành & cấu hình hệ thống
│
└── /api/*                         ← Edge API Runtime (Cloudflare Worker + D1 + R2)
    ├── /auth/*                    ← Community Auth API
    ├── /operations/auth/*         ← Operations Auth API
    ├── /system/*                  ← Version & Health check
    └── ...
```

---

## 4. KẾ HOẠCH HỢP NHẤT CHI TIẾT (ACTION MATRIX)

1. **Hợp nhất hoàn toàn vào `/login`**:
   - Tab "Phía Cộng đồng": Form Email + Mật khẩu -> gọi `/api/auth/login` -> điều hướng theo vai trò (`/reports`, `/tasks`, `/moderator/inbox`, `/admin/overview`).
   - Tab "Đơn vị Xử lý": Form Tên đăng nhập/Email + Mật khẩu -> gọi `/api/operations/auth/login` -> lưu token -> điều hướng trực tiếp sang `/operations/...` (`/operations/inspections`, `/operations/supervisor/workload`, `/operations/cases`, `/operations/admin/users`, hoặc `/operations/dashboard`).
   - Query param `?side=operations` tự động kích hoạt tab Đơn vị Xử lý.
   - Demo Mode: Chỉ hiển thị panel tài khoản mẫu khi có `?demo=1` hoặc cấu hình demo chủ động; tuyệt đối không hiện plain password trên production.
2. **Redirect `/operations/login`**:
   - Cloudflare Worker (`server/index.ts`): Trả HTTP 302 chuyển hướng `/operations/login` sang `/login?side=operations`.
   - Side B React Router (`dustguard-operations/apps/web`): Client-side fallback chuyển hướng mượt mà sang `/login?side=operations`. Bảo toàn 100% deep-link, 0 lỗi 404.
3. **Làm sạch các nhãn sai lệch kiến trúc**:
   - Xóa bỏ dòng `"Hệ thống lưu trữ dữ liệu chân thực SSOT SQLite cục bộ."` trên toàn bộ UI.
   - Chuẩn hóa các nhãn nội bộ sang thuật ngữ Civic Tech thân thiện.
