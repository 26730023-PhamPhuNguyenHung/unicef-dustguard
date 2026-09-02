# DUSTGUARD VN — 31-SCREEN PRODUCT SPECIFICATION & PDR MASTER

> **Kiến trúc SSOT**: Cloudflare D1 SQLite & REST Worker Edge Monolith  
> **Nguyên tắc thiết kế**: High-Contrast Light Mode (Zero Glassmorphism), Mobile-First & 14-Inch Desktop Baseline  
> **Bộ tiêu chuẩn tài liệu**: Tinh gọn, rõ ràng (120-200 dòng/file), Map không Invent, phân định 4 trạng thái `CURRENT / PARTIAL / PROPOSED / UNKNOWN`.

---

## 📚 TÀI LIỆU MA TRẬN TOÀN CỤC (GLOBAL MATRICES)

1. [`SCREEN-REGISTRY.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/SCREEN-REGISTRY.md): Danh mục 31 màn hình chuẩn, đường dẫn route, vai trò chính và primary job.
2. [`SCREEN-AUDIT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/SCREEN-AUDIT.md): Bảng đối chiếu thực tế giữa router, DB schema, API worker routes và đặc tả màn hình.
3. [`SCREEN-PERMISSION-MATRIX.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/SCREEN-PERMISSION-MATRIX.md): Ma trận phân quyền 5 cấp (Public, Citizen, Staff, Contractor, Admin).
4. [`SCREEN-DATA-MATRIX.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/SCREEN-DATA-MATRIX.md): Bản đồ dữ liệu kết nối từng trường UI vào D1 Tables và API endpoints.
5. [`SCREEN-STATE-MATRIX.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/SCREEN-STATE-MATRIX.md): Quy chuẩn 6 trạng thái giao diện bắt buộc (Loading, Empty, Error, Permission Denied, Partial, Success).
6. [`SCREEN-VERIFICATION-PLAN.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/SCREEN-VERIFICATION-PLAN.md): Kế hoạch kiểm thử kỹ thuật 5 tầng (Level 0 - Level 4) và kiểm thử giao diện trực quan.

---

## 🧭 MỤC LỤC 31 MÀN HÌNH TÁC NGHIỆP

### 1. Phân Hệ Cổng Thông Tin Công Cộng (Public — 8 Màn Hình)
- [`PUBLIC-01-landing.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/PUBLIC-01-landing.md) — Cổng Thông Tin Giám Sát Bụi Đô Thị (`/`)
- [`PUBLIC-02-citizen-map.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/PUBLIC-02-citizen-map.md) — Bản Đồ Điểm Nóng Bụi & Tra Cứu Địa Bàn (`/map`)
- [`PUBLIC-03-youth-credits.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/PUBLIC-03-youth-credits.md) — Cổng Tín Chỉ Tình Nguyện & Bảng Vàng Đoàn - Hội (`/youth`)
- [`PUBLIC-04-sensor-guide.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/PUBLIC-04-sensor-guide.md) — Cẩm Nang Chế Tạo Trạm Đo Bụi 500k (`/guide`)
- [`PUBLIC-05-demo-hub.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/PUBLIC-05-demo-hub.md) — Trung Tâm Trải Nghiệm Kịch Bản 5 Vai Trò (`/demo`)
- [`PUBLIC-06-iot-demo.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/PUBLIC-06-iot-demo.md) — Bàn Mô Phỏng Tín Hiệu Cảm Biến IoT (`/demo/iot`)
- [`PUBLIC-07-login.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/PUBLIC-07-login.md) — Cổng Đăng Nhập & Phân Quyền Vai Trò (`/login`)
- [`PUBLIC-08-not-found.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/PUBLIC-08-not-found.md) — Trang 404 Điều Hướng Khôi Phục (`*`)

### 2. Phân Hệ Công Dân Giám Sát (Citizen — 5 Màn Hình)
- [`CITIZEN-01-home.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/CITIZEN-01-home.md) — Bàn Làm Việc Công Dân — Khu Dân Cư (`/citizen`)
- [`CITIZEN-02-report-new.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/CITIZEN-02-report-new.md) — Gửi Phản Ánh Hiện Trường 30 Giây (`/citizen/report/new`)
- [`CITIZEN-03-reports-list.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/CITIZEN-03-reports-list.md) — Sổ Tay Danh Sách Phản Ánh Cá Nhân (`/citizen/reports`)
- [`CITIZEN-04-report-detail.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/CITIZEN-04-report-detail.md) — Chi Tiết Phản Ánh & Đối Chứng Trước/Sau (`/citizen/reports/:id`)
- [`CITIZEN-05-profile.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/CITIZEN-05-profile.md) — Hồ Sơ Công Dân Tích Cực & Đóng Góp (`/citizen/profile`)

### 3. Phân Hệ Cán Bộ Thanh Tra (Staff — 11 Màn Hình)
- [`STAFF-01-dashboard.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-01-dashboard.md) — Bàn Điều Hành Tác Nghiệp Ca Trực (`/staff`)
- [`STAFF-02-sites-list.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-02-sites-list.md) — Sổ Bộ Quản Lý Công Trình Xây Dựng (`/staff/sites`)
- [`STAFF-03-site-detail.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-03-site-detail.md) — Hồ Sơ Pháp Lý & Lịch Sử Công Trình (`/staff/sites/:id`)
- [`STAFF-04-cases-list.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-04-cases-list.md) — Danh Mục Hồ Sơ Vụ Việc Xử Lý (`/staff/cases`)
- [`STAFF-05-case-detail.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-05-case-detail.md) — Không Gian Tác Nghiệp Thụ Lý Vụ Việc 7 Bước (`/staff/cases/:id`)
- [`STAFF-06-tasks-list.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-06-tasks-list.md) — Lịch Công Tác & Phân Công Nhiệm Vụ Khảo Sát (`/staff/tasks`)
- [`STAFF-07-monitoring.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-07-monitoring.md) — Trung Tâm Quan Trắc Cảm Biến Thời Gian Thực (`/staff/monitoring`)
- [`STAFF-08-alerts.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-08-alerts.md) — Tiếp Nhận & Xử Lý Cảnh Báo Ô Nhiễm (`/staff/alerts`)
- [`STAFF-09-reports.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-09-reports.md) — Trung Tâm Báo Cáo Hành Chính NĐ 30/2020 (`/staff/reports`)
- [`STAFF-10-profile.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-10-profile.md) — Hồ Sơ Công Tác Cán Bộ & Ca Trực (`/staff/profile`)
- [`STAFF-11-activity.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-11-activity.md) — Nhật Ký Tác Nghiệp Công Vụ & Kiểm Toán (`/staff/activity`)

### 4. Phân Hệ Nhà Thầu Xây Dựng (Contractor — 4 Màn Hình)
- [`CONTRACTOR-01-dashboard.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/CONTRACTOR-01-dashboard.md) — Bàn Làm Việc Chỉ Huy Trưởng (`/contractor`)
- [`CONTRACTOR-02-tasks-remediation.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/CONTRACTOR-02-tasks-remediation.md) — Tiếp Nhận Yêu Cầu Khắc Phục & Nộp Minh Chứng (`/contractor/tasks`)
- [`CONTRACTOR-03-cases.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/CONTRACTOR-03-cases.md) — Sổ Bộ Hồ Sơ Vụ Việc Của Nhà Thầu (`/contractor/cases`)
- [`CONTRACTOR-04-reports.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/CONTRACTOR-04-reports.md) — Báo Cáo Định Kỳ Tuân Thủ Bảo Vệ Môi Trường (`/contractor/reports`)

### 5. Phân Hệ Quản Trị Hệ Thống (Admin — 3 Màn Hình)
- [`ADMIN-01-dashboard.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/ADMIN-01-dashboard.md) — Bảng Điều Hành Quản Trị Hạ Tầng D1 & Hệ Thống (`/admin`)
- [`ADMIN-02-users.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/ADMIN-02-users.md) — Quản Lý Danh Bạ Tài Khoản & Phân Quyền 5 Cấp (`/admin/users`)
- [`ADMIN-03-settings.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/ADMIN-03-settings.md) — Cấu Hình Ngưỡng QCVN & Tham Số Hệ Thống (`/admin/settings`)
