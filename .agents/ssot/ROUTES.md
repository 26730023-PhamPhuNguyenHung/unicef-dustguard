# ROUTES SSOT — URL MAPPING & NAVIGATION SYSTEM (DUSTGUARD VN V2)

> **Bản quyền**: DustGuard VN — CivicTech Platform  
> **Trạng thái**: SSOT Hiệu lực toàn hệ thống (5 Phân hệ Ứng dụng Chuẩn)  
> **Nguyên tắc**: Zero broken links, Zero unmapped routes, Chuyển hướng êm thuận cho các đường dẫn cũ.

---

## 1. Phân Hệ 1: Public Experience & Auth (`/apps/public`)

| Đường Dẫn (Route) | Component / Page | Chức Năng Nghiệp Vụ | Quyền Hạn (Role) |
|---|---|---|---|
| `/` | `LandingPage.jsx` | Trang chủ giới thiệu giải pháp DustGuard VN theo chuỗi 7 bước | Công khai (Public) |
| `/landing` | Chuyển hướng về `/` | Chuyển hướng tương thích | Công khai |
| `/demo` | `DemoHub.jsx` | **Golden Demo Hub**: Trải nghiệm 1 vụ việc `#DG-2026-0842` qua 5 góc nhìn | Công khai |
| `/demo/iot` | `IoTDemo.jsx` | Giả lập nguồn tín hiệu cảm biến IoT và kích hoạt cảnh báo | Công khai |
| `/youth` | `YouthCredits.jsx` | Cổng thông tin Tín chỉ Thanh niên, Giờ tình nguyện & Bảng xếp hạng | Công khai |
| `/youth/credits` | `YouthCredits.jsx` | Tra cứu chứng chỉ số & quy đổi giờ tình nguyện | Công khai |
| `/youth/leaderboard` | `YouthCredits.jsx` | Bảng xếp hạng CLB và Đoàn trường | Công khai |
| `/map` | `CitizenMap.jsx` | Bản đồ chất lượng không khí & tra cứu tiến độ vụ việc xung quanh | Công khai |
| `/guide` | `SensorGuide.jsx` | Cẩm nang tự lắp đặt trạm đo mở 500.000đ | Công khai |
| `/login` | `Login.jsx` | Cửa ngõ đăng nhập 5 vai trò & Demo Quick-Login | Công khai |
| `*` | `NotFound.jsx` | Trang 404 điều hướng an toàn | Công khai |

---

## 2. Phân Hệ 2: Bàn Làm Việc Công Dân (`/apps/citizen` — `CitizenLayout`)

| Đường Dẫn (Route) | Component / Page | Chức Năng Nghiệp Vụ | Quyền Hạn (Role) |
|---|---|---|---|
| `/citizen` | `CitizenHomePage.jsx` | Bàn làm việc công dân: Xem phản ánh của tôi & tiến độ xử lý | `citizen`, `community`, `public` |
| `/citizen/report/new` | `ReportNewPage.jsx` | **Gửi phản ánh 30s**: Chụp ảnh, định vị GPS, tạo nguồn tín hiệu | `citizen`, `community`, `public` |
| `/citizen/reports` | `ReportsListPage.jsx` | Danh sách theo dõi phản ánh của tôi (Mới, Đang xử lý, Đã xong) | `citizen`, `community`, `public` |
| `/citizen/reports/:id` | `ReportDetailPage.jsx` | Chi tiết vụ việc: Đối chứng Before/After, biên bản nghiệm thu | `citizen`, `community`, `public` |
| `/citizen/profile` | `CitizenProfilePage.jsx` | Hồ sơ người đóng góp, huy hiệu & lịch sử giờ tình nguyện | `citizen`, `community` |

---

## 3. Phân Hệ 3: Bàn Điều Phối Tác Nghiệp Cán Bộ (`/apps/staff` — `StaffLayout`)

| Đường Dẫn (Route) | Component / Page | Chức Năng Nghiệp Vụ | Quyền Hạn (Role) |
|---|---|---|---|
| `/staff` | `StaffDashboardPage.jsx` | Bàn làm việc cán bộ: Việc cần làm hôm nay, Chờ tái kiểm, Tín hiệu mới | `staff`, `admin` |
| `/staff/sites` | `SitesListPage.jsx` | Danh sách công trình đang thi công trên địa bàn | `staff`, `admin` |
| `/staff/sites/:id` | `SiteDetailPage.jsx` | Chi tiết công trình: Lịch sử môi trường, vụ việc mở, lần tái kiểm | `staff`, `admin` |
| `/staff/cases` | `CasesListPage.jsx` | Quản lý danh sách vụ việc theo 7 bước tác nghiệp | `staff`, `admin` |
| `/staff/cases/:id` | `CaseDetailPage.jsx` | **Trung tâm xử lý vụ việc**: Giao việc, checklist QCVN, Before/After, In A4 | `staff`, `admin` |
| `/staff/tasks` | `TasksListPage.jsx` | Danh sách nhiệm vụ ca trực: Khảo sát thực địa, Tái kiểm 48h | `staff`, `admin` |
| `/staff/monitoring` | `StaffMonitoringPage.jsx` | Ma trận quan trắc trạm đo thời gian thực & liên kết mở vụ việc | `staff`, `admin` |
| `/staff/alerts` | `StaffAlertsPage.jsx` | Trung tâm tín hiệu cảnh báo vượt ngưỡng & tạo vụ việc 1-click | `staff`, `admin` |
| `/staff/reports` | `StaffReportsPage.jsx` | Báo cáo điều hành lãnh đạo & văn bản số hóa NĐ 30/2020/NĐ-CP | `staff`, `admin` |
| `/staff/profile` | `StaffProfilePage.jsx` | Thẻ định danh số cán bộ thanh tra & bảo mật tài khoản | `staff`, `admin` |
| `/staff/notifications`| `StaffNotificationsPage.jsx`| Thông báo tác nghiệp: Nhà thầu đã nộp ảnh, hết hạn SLA | `staff`, `admin` |
| `/staff/settings` | `StaffSettingsPage.jsx` | Cấu hình tham số ngưỡng tín hiệu & thời hạn SLA 24-48h | `staff`, `admin` |
| `/staff/activity` | `StaffActivityPage.jsx` | Nhật ký lưu vết kiểm toán tác nghiệp (Append-Only Audit Trail) | `staff`, `admin` |
| `/staff/help` | `StaffHelpPage.jsx` | Cẩm nang quy chuẩn kiểm soát bụi & hướng dẫn tác nghiệp | `staff`, `admin` |

---

## 4. Phân Hệ 4: Bàn Làm Việc Đơn Vị Xử Lý / Nhà Thầu (`/apps/contractor` — `ContractorLayout`)

| Đường Dẫn (Route) | Component / Page | Chức Năng Nghiệp Vụ | Quyền Hạn (Role) |
|---|---|---|---|
| `/contractor` | `ContractorDashboardPage.jsx` | Bàn làm việc nhà thầu: Yêu cầu cần làm, Hạn chót, Điểm tuân thủ | `contractor`, `staff`, `admin` |
| `/contractor/tasks` | `ContractorTasksPage.jsx` | Xử lý yêu cầu & nộp ảnh Before/After (Check Geofence < 50m) | `contractor`, `staff`, `admin` |
| `/contractor/cases` | `ContractorCasesPage.jsx` | Danh sách dự án / vụ việc liên quan đến đơn vị thi công | `contractor`, `staff`, `admin` |
| `/contractor/reports` | `ContractorReportsPage.jsx` | Báo cáo tuân thủ môi trường & Mẫu in A4 biên bản bàn giao | `contractor`, `staff`, `admin` |

---

## 5. Phân Hệ 5: Bảng Quản Trị Hệ Thống (`/apps/admin` — `AdminLayout`)

| Đường Dẫn (Route) | Component / Page | Chức Năng Nghiệp Vụ | Quyền Hạn (Role) |
|---|---|---|---|
| `/admin` | `AdminDashboardPage.jsx` | Giám sát sức khỏe quy trình (Workflow Health, Tái kiểm, Điểm nghẽn) | `admin` |
| `/admin/users` | `UsersPage.jsx` | Quản trị danh bạ người dùng & đổi quyền tại chỗ (5 roles RBAC) | `admin` |
| `/admin/sites` | `SitesListPage.jsx` | Quản lý danh mục công trình toàn thành phố | `admin` |
| `/admin/settings` | `SettingsPage.jsx` | Cấu hình hạ tầng CSDL D1, R2, AI, Webhook & Ngưỡng QCVN | `admin` |

---

## 6. Ma Trận Chuyển Hướng Tương Thích (Legacy Redirects Mapping)

| Đường Dẫn Cũ (Legacy) | Đích Chuyển Hướng Mới (Canonical SSOT) | Lý Do & Ngữ Cảnh |
|---|---|---|
| `/community/*` | `/citizen` | Hợp nhất luồng cộng đồng vào Citizen App |
| `/executive/*` | `/staff/reports` | Hợp nhất báo cáo điều hành vào Staff Reports chuẩn NĐ 30 |
| `/app/*` | `/staff` | Chuẩn hóa portal cán bộ |
| `/citizen/dashboard` | `/citizen` | Chuẩn hóa trang chủ citizen |
| `/citizen/report` | `/citizen/report/new` | Chuyển tiếp luồng gửi phản ánh mới |
| `/citizen/track` | `/citizen/reports` | Chuyển tiếp danh sách theo dõi |
| `/citizen/track/:id` | `/citizen/reports` | Chuyển tiếp chi tiết theo dõi |
| `/contractor/portal` | `/contractor/tasks` | Chuyển tiếp portal nhà thầu sang danh sách việc |
| `/contractor/evidence` | `/contractor/tasks` | Chuyển tiếp nộp minh chứng |
| `/contractor/actions` | `/contractor/tasks` | Chuẩn hóa danh sách hành động |
