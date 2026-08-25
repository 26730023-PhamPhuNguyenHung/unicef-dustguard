# DustGuard VN — Nền Tảng Giám Sát Môi Trường & Bụi Công Trình (CivicTech + IoT)

> **Giải pháp CivicTech + IoT** phục vụ Thanh tra Môi trường, Lãnh đạo Sở TN&MT, Cộng đồng dân cư và Nhà thầu thi công.  
> **Kiến trúc**: 100% Cloudflare Native Modular Monolith (Hono + Cloudflare Worker + Cloudflare D1 SQLite + Cloudflare R2 Storage + React 19).

---

## 1. BẢNG TỔNG QUAN TÀI LIỆU HỆ THỐNG (SSOT DOCUMENTATION INDEX)

- **Báo cáo kiểm toán toàn diện**: [`docs/audit/DUSTGUARD_FULL_SYSTEM_AUDIT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/audit/DUSTGUARD_FULL_SYSTEM_AUDIT.md)
- **Ma trận mức độ hoàn thiện tính năng**: [`docs/audit/FEATURE_COMPLETENESS.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/audit/FEATURE_COMPLETENESS.md)
- **Sơ đồ kiến trúc toàn cảnh**: [`docs/architecture/SYSTEM_ARCHITECTURE.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/architecture/SYSTEM_ARCHITECTURE.md)
- **Sơ đồ luồng dữ liệu**: [`docs/architecture/DATA_FLOW.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/architecture/DATA_FLOW.md)
- **Từ điển thuật ngữ chuẩn hóa**: [`docs/product/GLOSSARY.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/GLOSSARY.md)
- **Vòng đời & Phân quyền sản phẩm**: [`docs/product/PRODUCT_FLOW.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/PRODUCT_FLOW.md)
- **Báo cáo nghiệm thu hoàn tất**: [`docs/audit/DUSTGUARD_COMPLETION_REPORT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/audit/DUSTGUARD_COMPLETION_REPORT.md)

---

## 2. HƯỚNG DẪN KHỞI CHẠY (QUICK START GUIDE)

### Yêu Cầu Môi Trường
- Node.js ≥ 20.x
- npm ≥ 10.x
- Windows PowerShell / Linux / macOS

### Các Lệnh Thực Thi Cốt Lõi
```powershell
# 1. Cài đặt dependencies
npm --prefix app install

# 2. Khởi chạy môi trường phát triển (Full-stack Web + Cloudflare Worker API)
npm run dev

# 3. Chạy kiểm thử tự động nhanh (Quick Gate < 5s)
npm run verify:quick

# 4. Chạy kiểm thử toàn diện hệ thống (Full Domain Gate 69 suites)
npm run verify:dustguard

# 5. Khởi chạy Sensor Simulator đẩy dữ liệu đo đạc vào API thật
npm run sensor:simulate

# 6. Khôi phục & Nạp lại dữ liệu Demo chuẩn nghiệp vụ
npm run demo:reset
```

---

## 3. TÀI KHOẢN TRUY CẬP DEMO (DEMO ACCOUNTS)

| Vai Trò (Role) | Email Đăng Nhập | Mật Khẩu | Mục Đích Demo |
|---|---|---|---|
| **Cán Bộ Thanh Tra** (`staff`) | `staff@dustguard.vn` | `DustGuard@2026` | Quản lý vụ việc, lập biên bản kiểm tra, giao việc nhà thầu |
| **Lãnh Đạo Sở TN&MT** (`executive`) | `executive@dustguard.vn` | `DustGuard@2026` | Xem Dashboard 8 KPI, Bản đồ nhiệt, Ký số duyệt hồ sơ |
| **Nhà Thầu Thi Công** (`contractor`) | `contractor@dustguard.vn`| `DustGuard@2026` | Xem danh sách việc được giao, nộp ảnh Before/After |
| **Quản Trị Hệ Thống** (`admin`) | `admin@dustguard.vn` | `DustGuard@2026` | Quản trị thiết bị, điểm đo, người dùng, seed dữ liệu |
| **Người Dân / Thanh Niên** (`citizen`) | *Không cần tài khoản* | *Không cần* | Phản ánh nhanh trong 30s, tra cứu mã theo dõi |

---

## 4. BẢNG MÀU CIVIC-TECH ĐỘ TƯƠNG PHẢN CAO (ZERO GLASSMORPHISM)
- **Nền kem chuẩn GovTech**: `#FDFBF7` (`bg-cream-50`)
- **Màu chữ mực in chính**: `#231b14` (`text-ink-900`)
- **Màu nhấn thương hiệu (Dấu ấn đỏ)**: `#9f241f` (`bg-seal-600`)
- **Màu xanh ngọc thanh tra**: `#0d6f64` (`bg-teal-700`)
- **Không áp dụng hiệu ứng kính mờ (No Glassmorphism / No backdrop-filter)**
