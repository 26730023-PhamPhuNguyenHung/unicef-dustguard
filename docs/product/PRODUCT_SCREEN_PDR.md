# Master Product Screen PDR — DustGuard VN

Tài liệu đặc tả sản phẩm toàn diện (Master PDR) định nghĩa chi tiết từng màn hình của nền tảng DustGuard VN dựa trên mã nguồn thực tế và kiểm chứng runtime.

---

## 1. Product Map & Role Breakdown

```text
DUSTGUARD VN
├── 1. Public (8 Screens)
│   ├── PUB-01: Trang chủ truyền thông (Landing Page) [/]
│   ├── PUB-02: Bản đồ rủi ro môi trường [/map]
│   ├── PUB-03: Cổng tín chỉ thanh niên & QR [/youth]
│   ├── PUB-04: Hướng dẫn cảm biến chuẩn QCVN [/guide]
│   ├── PUB-05: Trung tâm kịch bản đánh giá [/demo]
│   ├── PUB-06: Giả lập dòng dữ liệu IoT [/demo/iot]
│   ├── PUB-07: Đăng nhập & Chọn phân hệ [/login]
│   └── PUB-08: Trang không tìm thấy [/404]
│
├── 2. Citizen / Youth (5 Screens)
│   ├── CIT-01: Bảng điều khiển công dân [/citizen]
│   ├── CIT-02: Tạo phản ánh vi phạm 30s [/citizen/report/new]
│   ├── CIT-03: Danh sách theo dõi phản ánh [/citizen/reports]
│   ├── CIT-04: Chi tiết phản ánh & đối chứng [/citizen/reports/:id]
│   └── CIT-05: Hồ sơ cá nhân & Mã QR tín chỉ [/citizen/profile]
│
├── 3. Staff Operations (11 Screens)
│   ├── STF-01: Bảng điều hành 12 chỉ số [/staff]
│   ├── STF-02: Danh sách 33 công trình [/staff/sites]
│   ├── STF-03: Hồ sơ chi tiết công trình [/staff/sites/:id]
│   ├── STF-04: Danh sách hồ sơ vụ việc 7 bước [/staff/cases]
│   ├── STF-05: Chi tiết quy trình 7 bước DAG [/staff/cases/:id]
│   ├── STF-06: Danh sách nhiệm vụ khảo sát [/staff/tasks]
│   ├── STF-07: Ma trận giám sát cảm biến IoT [/staff/monitoring]
│   ├── STF-08: Trung tâm xử lý cảnh báo [/staff/alerts]
│   ├── STF-09: Báo cáo điều hành chuẩn NĐ 30/2020 [/staff/reports]
│   ├── STF-10: Thông tin tài khoản cán bộ [/staff/profile]
│   └── STF-11: Nhật ký kiểm toán tác nghiệp [/staff/activity]
│
├── 4. Contractor (4 Screens)
│   ├── CON-01: Bảng điều khiển nhà thầu [/contractor]
│   ├── CON-02: Tiếp nhận & Nộp ảnh Trước/Sau <=50m [/contractor/tasks]
│   ├── CON-03: Tổng hợp vụ việc liên quan [/contractor/cases]
│   └── CON-04: Báo cáo tiến độ tuân thủ [/contractor/reports]
│
└── 5. Admin (3 Screens)
    ├── ADM-01: Bảng điều khiển quản trị D1 [/admin]
    ├── ADM-02: Quản lý người dùng & RBAC [/admin/users]
    └── ADM-03: Cấu hình hệ thống & Reset Demo [/admin/settings]
```

---

## 2. Danh Mục PDR Chi Tiết Theo Màn Hình

| Mã | Tên Màn Hình | Route | Role | Trạng Thái | Link Đặc Tả Chi Tiết |
|---|---|---|---|---|---|
| **PUB-01** | Trang chủ truyền thông | `/` | Public | ACTIVE | [`PUBLIC-01-landing.md`](screens/PUBLIC-01-landing.md) |
| **PUB-02** | Bản đồ rủi ro môi trường | `/map` | Public | ACTIVE | [`PUBLIC-02-citizen-map.md`](screens/PUBLIC-02-citizen-map.md) |
| **PUB-03** | Cổng tín chỉ thanh niên | `/youth` | Public | ACTIVE | [`PUBLIC-03-youth-credits.md`](screens/PUBLIC-03-youth-credits.md) |
| **PUB-04** | Hướng dẫn cảm biến | `/guide` | Public | ACTIVE | [`PUBLIC-04-sensor-guide.md`](screens/PUBLIC-04-sensor-guide.md) |
| **PUB-05** | Trung tâm kịch bản đánh giá | `/demo` | Public | ACTIVE | [`PUBLIC-05-demo-hub.md`](screens/PUBLIC-05-demo-hub.md) |
| **PUB-06** | Giả lập dòng dữ liệu IoT | `/demo/iot` | Public | ACTIVE | [`PUBLIC-06-iot-demo.md`](screens/PUBLIC-06-iot-demo.md) |
| **PUB-07** | Đăng nhập tài khoản | `/login` | Public | ACTIVE | [`PUBLIC-07-login.md`](screens/PUBLIC-07-login.md) |
| **PUB-08** | Trang 404 | `*` | Public | ACTIVE | [`PUBLIC-08-not-found.md`](screens/PUBLIC-08-not-found.md) |
| **CIT-01** | Bảng điều khiển công dân | `/citizen` | Citizen | ACTIVE | [`CITIZEN-01-home.md`](screens/CITIZEN-01-home.md) |
| **CIT-02** | Tạo phản ánh 30 giây | `/citizen/report/new` | Citizen | ACTIVE | [`CITIZEN-02-report-new.md`](screens/CITIZEN-02-report-new.md) |
| **CIT-03** | Danh sách phản ánh | `/citizen/reports` | Citizen | ACTIVE | [`CITIZEN-03-reports-list.md`](screens/CITIZEN-03-reports-list.md) |
| **CIT-04** | Chi tiết phản ánh | `/citizen/reports/:id` | Citizen | ACTIVE | [`CITIZEN-04-report-detail.md`](screens/CITIZEN-04-report-detail.md) |
| **CIT-05** | Hồ sơ & Mã QR tín chỉ | `/citizen/profile` | Citizen | ACTIVE | [`CITIZEN-05-profile.md`](screens/CITIZEN-05-profile.md) |
| **STF-01** | Bảng điều hành 12 chỉ số | `/staff` | Staff | ACTIVE | [`STAFF-01-dashboard.md`](screens/STAFF-01-dashboard.md) |
| **STF-02** | Danh sách 33 công trình | `/staff/sites` | Staff | ACTIVE | [`STAFF-02-sites-list.md`](screens/STAFF-02-sites-list.md) |
| **STF-03** | Hồ sơ chi tiết công trình | `/staff/sites/:id` | Staff | ACTIVE | [`STAFF-03-site-detail.md`](screens/STAFF-03-site-detail.md) |
| **STF-04** | Danh sách hồ sơ vụ việc | `/staff/cases` | Staff | ACTIVE | [`STAFF-04-cases-list.md`](screens/STAFF-04-cases-list.md) |
| **STF-05** | Quy trình 7 bước DAG | `/staff/cases/:id` | Staff | ACTIVE | [`STAFF-05-case-detail.md`](screens/STAFF-05-case-detail.md) |
| **STF-06** | Danh sách nhiệm vụ | `/staff/tasks` | Staff | ACTIVE | [`STAFF-06-tasks-list.md`](screens/STAFF-06-tasks-list.md) |
| **STF-07** | Giám sát cảm biến IoT | `/staff/monitoring` | Staff | ACTIVE | [`STAFF-07-monitoring.md`](screens/STAFF-07-monitoring.md) |
| **STF-08** | Trung tâm xử lý cảnh báo | `/staff/alerts` | Staff | ACTIVE | [`STAFF-08-alerts.md`](screens/STAFF-08-alerts.md) |
| **STF-09** | Báo cáo chuẩn NĐ 30/2020 | `/staff/reports` | Staff | ACTIVE | [`STAFF-09-reports.md`](screens/STAFF-09-reports.md) |
| **STF-10** | Tài khoản cán bộ | `/staff/profile` | Staff | ACTIVE | [`STAFF-10-profile.md`](screens/STAFF-10-profile.md) |
| **STF-11** | Nhật ký kiểm toán | `/staff/activity` | Staff | ACTIVE | [`STAFF-11-activity.md`](screens/STAFF-11-activity.md) |
| **CON-01** | Bảng điều khiển nhà thầu | `/contractor` | Contractor | ACTIVE | [`CONTRACTOR-01-dashboard.md`](screens/CONTRACTOR-01-dashboard.md) |
| **CON-02** | Nộp minh chứng Trước/Sau | `/contractor/tasks` | Contractor | ACTIVE | [`CONTRACTOR-02-tasks-remediation.md`](screens/CONTRACTOR-02-tasks-remediation.md) |
| **CON-03** | Tổng hợp vụ việc | `/contractor/cases` | Contractor | ACTIVE | [`CONTRACTOR-03-cases.md`](screens/CONTRACTOR-03-cases.md) |
| **CON-04** | Báo cáo tuân thủ | `/contractor/reports` | Contractor | ACTIVE | [`CONTRACTOR-04-reports.md`](screens/CONTRACTOR-04-reports.md) |
| **ADM-01** | Bảng điều khiển quản trị | `/admin` | Admin | ACTIVE | [`ADMIN-01-dashboard.md`](screens/ADMIN-01-dashboard.md) |
| **ADM-02** | Quản lý người dùng RBAC | `/admin/users` | Admin | ACTIVE | [`ADMIN-02-users.md`](screens/ADMIN-02-users.md) |
| **ADM-03** | Cấu hình & Reset Demo | `/admin/settings` | Admin | ACTIVE | [`ADMIN-03-settings.md`](screens/ADMIN-03-settings.md) |
