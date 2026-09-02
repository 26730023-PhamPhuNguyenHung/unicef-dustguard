# DUSTGUARD VN — MASTER SCREEN SPECIFICATIONS INDEX
## TỔNG HỢP 31 MÀN HÌNH TÁC NGHIỆP THỰC TẾ & CÔNG NGHỆ CÔNG DÂN (CIVIC TECH)

> **Cập nhật**: 2026-09-02 | **Kiến trúc SSOT**: Cloudflare D1 SQLite & Edge Modular Monolith | **Thiết kế**: Light Mode High-Contrast (Zero Glassmorphism)

---

## 🎯 Bối Cảnh Thực Tế & Căn Cứ Pháp Lý Việt Nam

Hệ thống **DustGuard VN** được thiết kế để giải quyết bài toán ô nhiễm bụi công trình xây dựng và giao thông đô thị tại các thành phố lớn của Việt Nam (Hà Nội, TP.HCM, Đà Nẵng, Hải Phòng...) thông qua sự kết hợp giữa **Người dân (Công dân số)**, **Thanh niên tình nguyện (Đoàn - Hội sinh viên)**, **Cán bộ quản lý trật tự xây dựng & môi trường**, và **Nhà thầu thi công**.

### Các Căn Cứ Pháp Lý & Quy Chuẩn Áp Dụng:
1. **QCVN 05:2023/BTNMT**: Quy chuẩn kỹ thuật quốc gia về chất lượng không khí xung quanh (Ngưỡng PM2.5 trung bình 24h $\le 50\,\mu\text{g/m}^3$, PM10 trung bình 24h $\le 100\,\mu\text{g/m}^3$).
2. **QCVN 18:2021/BXD**: Quy chuẩn an toàn trong thi công xây dựng công trình (Bắt buộc che chắn bạt kín, rửa xe ben trước khi ra khỏi công trường, tưới nước dập bụi).
3. **Nghị định 45/2022/NĐ-CP**: Xử phạt vi phạm hành chính trong lĩnh vực bảo vệ môi trường (Mức phạt từ 10.000.000đ đến 50.000.000đ đối với hành vi phát tán bụi đất đá ra môi trường).
4. **Nghị định 30/2020/NĐ-CP**: Thể thức và kỹ thuật trình bày văn bản hành chính nhà nước (Áp dụng cho mẫu biên bản kiểm tra, tờ trình xử lý và báo cáo thống kê A4).
5. **Quyết định 48/2024/QĐ-UBND Hà Nội**: Quy chế phối hợp xử lý phản ánh hiện trường trật tự xây dựng và môi trường đô thị.

---

## 🧭 Ma Trận 31 Màn Hình Theo 5 Phân Hệ Nghiệp Vụ

### 1. Phân Hệ Cổng Thông Tin Công Cộng & Dịch Vụ Công Dân (Public & Portal - 8 Màn Hình)

| Mã màn hình | Tên màn hình | Đường dẫn (Route) | File tài liệu đặc tả | Vai trò tiếp cận |
|---|---|---|---|---|
| **PUB-01** | Cổng Thông Tin Giám Sát Bụi Đô Thị | `/` & `/landing` | [`PUBLIC-01-landing.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/PUBLIC-01-landing.md) | Đại chúng (Mọi người) |
| **PUB-02** | Bản Đồ Điểm Nóng Bụi & Tra Cứu Địa Bàn | `/map` | [`PUBLIC-02-citizen-map.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/PUBLIC-02-citizen-map.md) | Công dân, Cán bộ, Báo chí |
| **PUB-03** | Cổng Tín Chỉ Tình Nguyện & Bảng Vàng Đoàn - Hội | `/youth` | [`PUBLIC-03-youth-credits.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/PUBLIC-03-youth-credits.md) | Sinh viên, Tình nguyện viên |
| **PUB-04** | Cẩm Nang Chế Tạo Trạm Đo Bụi Giá Rẻ 500k | `/guide` & `/docs/sensor-guide` | [`PUBLIC-04-sensor-guide.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/PUBLIC-04-sensor-guide.md) | CLB Maker, Kỹ sư IoT |
| **PUB-05** | Trung Tâm Trải Nghiệm Kịch Bản 5 Vai Trò | `/demo` & `/demo/accounts` | [`PUBLIC-05-demo-hub.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/PUBLIC-05-demo-hub.md) | Người đánh giá, Ban giám khảo |
| **PUB-06** | Bàn Mô Phỏng Tín Hiệu Cảm Biến IoT | `/demo/iot` | [`PUBLIC-06-iot-demo.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/PUBLIC-06-iot-demo.md) | Kỹ thuật viên |
| **PUB-07** | Cổng Đăng Nhập & Điều Hướng Vai Trò | `/login` | [`PUBLIC-07-login.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/PUBLIC-07-login.md) | Toàn bộ 5 vai trò |
| **PUB-08** | Trang 404 Điều Hướng Khôi Phục | `*` (Mọi route không tồn tại) | [`PUBLIC-08-not-found.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/PUBLIC-08-not-found.md) | Toàn bộ người dùng |

---

### 2. Phân Hệ Công Dân Giám Sát Hiện Trường (Citizen Flow - 5 Màn Hình)

| Mã màn hình | Tên màn hình | Đường dẫn (Route) | File tài liệu đặc tả | Vai trò tiếp cận |
|---|---|---|---|---|
| **CIT-01** | Bàn Làm Việc Công Dân — Giám Sát Khu Dân Cư | `/citizen` | [`CITIZEN-01-home.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/CITIZEN-01-home.md) | Người dân đã đăng nhập |
| **CIT-02** | Gửi Phản Ánh Hiện Trường 30 Giây | `/citizen/report/new` | [`CITIZEN-02-report-new.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/CITIZEN-02-report-new.md) | Mọi người dân tại hiện trường |
| **CIT-03** | Sổ Tay Danh Sách Phản Ánh Cá Nhân | `/citizen/reports` | [`CITIZEN-03-reports-list.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/CITIZEN-03-reports-list.md) | Người dân theo dõi |
| **CIT-04** | Chi Tiết Phản Ánh & Đối Chứng Trước/Sau | `/citizen/reports/:id` | [`CITIZEN-04-report-detail.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/CITIZEN-04-report-detail.md) | Người dân, Tình nguyện viên |
| **CIT-05** | Hồ Sơ Công Dân Tích Cực & Đóng Góp Môi Trường | `/citizen/profile` | [`CITIZEN-05-profile.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/CITIZEN-05-profile.md) | Chủ tài khoản |

---

### 3. Phân Hệ Cán Bộ Thanh Tra & Giám Sát Đô Thị (Staff & Enforcement - 11 Màn Hình)

| Mã màn hình | Tên màn hình | Đường dẫn (Route) | File tài liệu đặc tả | Vai trò tiếp cận |
|---|---|---|---|---|
| **STF-01** | Bàn Điều Hành Tác Nghiệp Ca Trực (12 Chỉ Số) | `/staff` & `/staff/dashboard` | [`STAFF-01-dashboard.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-01-dashboard.md) | Cán bộ trực ca, Thanh tra |
| **STF-02** | Sổ Bộ Quản Lý 38+ Công Trình Xây Dựng | `/staff/sites` | [`STAFF-02-sites-list.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-02-sites-list.md) | Thanh tra trật tự xây dựng |
| **STF-03** | Hồ Sơ Pháp Lý & Lịch Sử Quan Trắc Công Trình | `/staff/sites/:id` | [`STAFF-03-site-detail.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-03-site-detail.md) | Cán bộ phụ trách địa bàn |
| **STF-04** | Danh Mục Hồ Sơ Vụ Việc Vi Phạm Môi Trường | `/staff/cases` | [`STAFF-04-cases-list.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-04-cases-list.md) | Thanh tra Sở / Đội Quận |
| **STF-05** | Không Gian Tác Nghiệp Thụ Lý Vụ Việc 7 Bước | `/staff/cases/:id` | [`STAFF-05-case-detail.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-05-case-detail.md) | Cán bộ thụ lý chính |
| **STF-06** | Lịch Công Tác & Phân Công Nhiệm Vụ Khảo Sát | `/staff/tasks` | [`STAFF-06-tasks-list.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-06-tasks-list.md) | Cán bộ, Tình nguyện viên |
| **STF-07** | Trung Tâm Quan Trắc Cảm Biến Thời Gian Thực 24/7 | `/staff/monitoring` | [`STAFF-07-monitoring.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-07-monitoring.md) | Kỹ sư quan trắc |
| **STF-08** | Tiếp Nhận & Xử Lý Cảnh Báo Ô Nhiễm Khẩn Cấp | `/staff/alerts` | [`STAFF-08-alerts.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-08-alerts.md) | Đội phản ứng nhanh |
| **STF-09** | Trung Tâm Xuất Bản Báo Cáo Hành Chính NĐ 30/2020 | `/staff/reports` | [`STAFF-09-reports.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-09-reports.md) | Lãnh đạo Đội / Sở |
| **STF-10** | Hồ Sơ Công Tác Cán Bộ & Thiết Lập Ca Trực | `/staff/profile` | [`STAFF-10-profile.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-10-profile.md) | Cán bộ cá nhân |
| **STF-11** | Nhật Ký Tác Nghiệp Công Vụ & Kiểm Toán Bất Biến | `/staff/activity` | [`STAFF-11-activity.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/STAFF-11-activity.md) | Thanh tra nội bộ, Giám sát |

---

### 4. Phân Hệ Nhà Thầu & Đơn Vị Thi Công (Contractor Workspace - 4 Màn Hình)

| Mã màn hình | Tên màn hình | Đường dẫn (Route) | File tài liệu đặc tả | Vai trò tiếp cận |
|---|---|---|---|---|
| **CON-01** | Bàn Làm Việc Chỉ Huy Trưởng Công Trường | `/contractor` & `/contractor/dashboard` | [`CONTRACTOR-01-dashboard.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/CONTRACTOR-01-dashboard.md) | Chỉ huy trưởng, Cán bộ ATLĐ |
| **CON-02** | Tiếp Nhận Yêu Cầu Khắc Phục & Nộp Ảnh Đối Chứng | `/contractor/tasks` | [`CONTRACTOR-02-tasks-remediation.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/CONTRACTOR-02-tasks-remediation.md) | Đội thi công tại hiện trường |
| **CON-03** | Sổ Bộ Hồ Sơ Cảnh Cáo & Vi Phạm Của Nhà Thầu | `/contractor/cases` | [`CONTRACTOR-03-cases.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/CONTRACTOR-03-cases.md) | Ban Quản lý dự án Nhà thầu |
| **CON-04** | Báo Cáo Định Kỳ Tuân Thủ Bảo Vệ Môi Trường | `/contractor/reports` | [`CONTRACTOR-04-reports.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/CONTRACTOR-04-reports.md) | Bộ phận Pháp chế / ATLĐ |

---

### 5. Phân Hệ Quản Trị Hệ Thống & IOC Đô Thị (Admin Backoffice - 3 Màn Hình)

| Mã màn hình | Tên màn hình | Đường dẫn (Route) | File tài liệu đặc tả | Vai trò tiếp cận |
|---|---|---|---|---|
| **ADM-01** | Bảng Điều Hành Quản Trị Hạ Tầng D1 & Hệ Thống | `/admin` & `/admin/dashboard` | [`ADMIN-01-dashboard.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/ADMIN-01-dashboard.md) | Quản trị viên Trung tâm IOC |
| **ADM-02** | Quản Lý Danh Bạ Tài Khoản & Phân Quyền 5 Cấp | `/admin/users` | [`ADMIN-02-users.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/ADMIN-02-users.md) | Quản trị viên hệ thống |
| **ADM-03** | Cấu Hình Ngưỡng QCVN 05:2023 & Liên Thông Dữ Liệu | `/admin/settings` | [`ADMIN-03-settings.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/ADMIN-03-settings.md) | Quản trị kỹ thuật |

---

## 🏗️ Kiến Trúc Dữ Liệu & Quy Chuẩn Giao Diện Thống Nhất

1. **Light Mode High-Contrast (Zero Glassmorphism)**:
   - Nền sáng `#FAFAF9` / `#FDFBF7`, chữ đậm `#1C1917` / `#231B14`, viền sắc nét `#E7E5E4`.
   - Màu nhận diện thương hiệu đỏ son `#B91C1C` / `#9F241F`, màu xanh đạt chuẩn `#0D6F64` / `#16A34A`.
   - Cấm hoàn toàn `backdrop-blur-*`, cấm nền mờ xám khó đọc ngoài nắng.
2. **Quy Chuẩn Thao Tác (Touch Target $\ge 44\text{px}$)**:
   - Tất cả nút bấm, tab, ô nhập liệu trên thiết bị di động và máy tính bảng có chiều cao tối thiểu $44\text{px}$ ($48\text{px}$ cho phân hệ Nhà thầu công trường).
3. **Quy Chuẩn Chống Cắt Cụt Chữ (Zero Truncate on Critical Civic Entities)**:
   - Tên công trình, mã hồ sơ, địa chỉ, người phụ trách luôn được bọc `break-words` hoặc `break-all` để người dân và cán bộ đọc trọn vẹn thông tin.
4. **Cơ Sở Dữ Liệu SSOT Duy Nhất**:
   - Mọi số liệu hiển thị được đọc trực tiếp từ Cloudflare D1 SQLite (`env.DB` / `dev.db`). Cấm lưu trữ dữ liệu giả trong `localStorage`.
