# Screen Inventory — DustGuard VN

| ID | Role | Route | Screen Name | Component | Status | Navigation Entry |
|---|---|---|---|---|---|---|
| **PUB-01** | Public | `/` | Trang chủ truyền thông & tổng quan | `modules/public/LandingPage.jsx` | ACTIVE | URL gốc / Logo |
| **PUB-02** | Public | `/map` | Bản đồ rủi ro môi trường cộng đồng | `modules/citizen/CitizenMap.jsx` | ACTIVE | Topbar Header |
| **PUB-03** | Public | `/youth` | Cổng tín chỉ thanh niên & Chứng chỉ QR | `modules/youth/YouthCredits.jsx` | ACTIVE | Topbar Header |
| **PUB-04** | Public | `/guide` | Hướng dẫn lắp đặt trạm đo chuẩn QCVN | `modules/public/SensorGuide.jsx` | ACTIVE | Topbar Header / Footer |
| **PUB-05** | Public | `/demo` | Trung tâm kịch bản đánh giá & chuyển role | `modules/public/DemoHub.jsx` | ACTIVE | Topbar Header |
| **PUB-06** | Public | `/demo/iot` | Giả lập dòng dữ liệu cảm biến thời gian thực | `modules/public/IoTDemo.jsx` | ACTIVE | Menu Demo Hub |
| **PUB-07** | Public | `/login` | Đăng nhập tài khoản & chọn phân hệ | `modules/auth/Login.jsx` | ACTIVE | Nút đăng nhập Topbar |
| **PUB-08** | Public | `*` | Trang thông báo không tìm thấy đường dẫn (404) | `modules/public/NotFound.jsx` | ACTIVE | Fallback router |
| **CIT-01** | Citizen | `/citizen` | Tổng quan bảng điều khiển công dân | `apps/citizen/pages/home/CitizenHomePage.jsx` | ACTIVE | Sidebar / Bottom Nav |
| **CIT-02** | Citizen | `/citizen/report/new` | Tạo phản ánh vi phạm bụi 30 giây | `apps/citizen/pages/report-new/ReportNewPage.jsx` | ACTIVE | Nút CTA đỏ son nổi bật |
| **CIT-03** | Citizen | `/citizen/reports` | Danh sách theo dõi phản ánh đã gửi | `apps/citizen/pages/reports/ReportsListPage.jsx` | ACTIVE | Sidebar / Bottom Nav |
| **CIT-04** | Citizen | `/citizen/reports/:id` | Chi tiết hồ sơ phản ánh & tiến độ xử lý | `apps/citizen/pages/reports/ReportDetailPage.jsx` | ACTIVE | Bấm vào item danh sách |
| **CIT-05** | Citizen | `/citizen/profile` | Hồ sơ cá nhân, lịch sử giờ & mã QR tín chỉ | `apps/citizen/pages/profile/CitizenProfilePage.jsx` | ACTIVE | Sidebar / Avatar |
| **STF-01** | Staff | `/staff` | Bảng điều hành tác nghiệp 12 chỉ số | `apps/staff/pages/dashboard/StaffDashboardPage.jsx` | ACTIVE | Sidebar Staff |
| **STF-02** | Staff | `/staff/sites` | Danh sách 33 công trình xây dựng | `apps/staff/pages/sites/SitesListPage.jsx` | ACTIVE | Sidebar Staff |
| **STF-03** | Staff | `/staff/sites/:id` | Hồ sơ chi tiết công trình & lịch sử rủi ro | `apps/staff/pages/sites/SiteDetailPage.jsx` | ACTIVE | Bấm dòng công trình |
| **STF-04** | Staff | `/staff/cases` | Danh sách hồ sơ vụ việc xử lý vi phạm | `apps/staff/pages/cases/CasesListPage.jsx` | ACTIVE | Sidebar Staff |
| **STF-05** | Staff | `/staff/cases/:id` | Chi tiết quy trình 7 bước xử lý vụ việc (DAG) | `apps/staff/pages/cases/CaseDetailPage.jsx` | ACTIVE | Bấm dòng hồ sơ vụ việc |
| **STF-06** | Staff | `/staff/tasks` | Danh sách nhiệm vụ hiện trường & kiểm tra | `apps/staff/pages/tasks/TasksListPage.jsx` | ACTIVE | Sidebar Staff |
| **STF-07** | Staff | `/staff/monitoring` | Ma trận giám sát cảm biến IoT thời gian thực | `apps/staff/pages/monitoring/StaffMonitoringPage.jsx` | ACTIVE | Sidebar Staff |
| **STF-08** | Staff | `/staff/alerts` | Trung tâm xử lý cảnh báo ô nhiễm vượt ngưỡng | `apps/staff/pages/alerts/StaffAlertsPage.jsx` | ACTIVE | Sidebar Staff |
| **STF-09** | Staff | `/staff/reports` | Báo cáo hành chính & in ấn chuẩn NĐ 30/2020 | `apps/staff/pages/reports/StaffReportsPage.jsx` | ACTIVE | Sidebar Staff |
| **STF-10** | Staff | `/staff/profile` | Thông tin tài khoản cán bộ & đổi mật khẩu | `apps/staff/pages/profile/StaffProfilePage.jsx` | ACTIVE | User Menu góc trên |
| **STF-11** | Staff | `/staff/activity` | Nhật ký kiểm toán thao tác hệ thống (Audit Logs) | `apps/staff/pages/activity/StaffActivityPage.jsx` | ACTIVE | User Menu góc trên |
| **CON-01** | Contractor | `/contractor` | Bảng điều khiển công trình phụ trách | `apps/contractor/pages/dashboard/ContractorDashboardPage.jsx` | ACTIVE | Sidebar Contractor |
| **CON-02** | Contractor | `/contractor/tasks` | Yêu cầu khắc phục & nộp ảnh Before/After $\le 50\text{m}$ | `apps/contractor/pages/tasks/ContractorTasksPage.jsx` | ACTIVE | Sidebar Contractor |
| **CON-03** | Contractor | `/contractor/cases` | Tổng hợp hồ sơ vi phạm liên quan công trình | `apps/contractor/pages/cases/ContractorCasesPage.jsx` | ACTIVE | Sidebar Contractor |
| **CON-04** | Contractor | `/contractor/reports` | Báo cáo tiến độ tuân thủ môi trường nhà thầu | `apps/contractor/pages/reports/ContractorReportsPage.jsx` | ACTIVE | Sidebar Contractor |
| **ADM-01** | Admin | `/admin` | Bảng điều khiển quản trị hệ thống D1 | `apps/admin/pages/dashboard/AdminDashboardPage.jsx` | ACTIVE | Sidebar Admin |
| **ADM-02** | Admin | `/admin/users` | Quản lý người dùng & phân quyền RBAC | `apps/admin/pages/users/UsersPage.jsx` | ACTIVE | Sidebar Admin |
| **ADM-03** | Admin | `/admin/settings` | Cấu hình tham số, tự động hóa & reset dữ liệu demo | `apps/admin/pages/settings/SettingsPage.jsx` | ACTIVE | Sidebar Admin |
