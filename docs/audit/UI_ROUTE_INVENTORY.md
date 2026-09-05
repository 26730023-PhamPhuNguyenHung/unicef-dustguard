# BẢNG INVENTORY TOÀN BỘ TUYẾN ĐƯỜNG GIAO DIỆN (UI ROUTE INVENTORY)
**DustGuard VN — Hệ Thống Giám Sát Môi Trường CivicTech**
*Ngày lập: 05/09/2026*

---

## 1. PHÂN HỆ CÔNG DÂN & CỘNG ĐỒNG (SIDE A: DUSTGUARD COMMUNITY)

| Tuyến Đường (Route) | Vai Trò (Role) | Tên Component | Nguồn Dữ Liệu / API | Các Nút Điều Khiển Chính | Cửa Sổ Modal / Drawer | Trạng Thái Hiện Tại | Mức Độ Ưu Tiên Sửa (Severity) |
|---|---|---|---|---|---|:---:|:---:|
| `/` & `/landing` | Công chúng (Public) | `LandingPage` | Cục bộ / Config SSOT | CTA Trải nghiệm, Xem bản đồ, Xem hồ sơ mẫu | Live Case Animation | Hoạt động tốt, GSAP Red Palette | P2 (Đã chuẩn hóa) |
| `/dashboard` | Tất cả đã đăng nhập | `DashboardPage` | `GET /api/stats/summary` | Lọc thời gian, Chuyển tab | Quick Report Modal | Hoạt động | P1 (Cần tối ưu density trên 1366) |
| `/map` | Công chúng / Citizen | `MapPage` | `GET /api/cases/geo`, `GET /api/stations` | Lọc bán kính, Tìm địa điểm, Bật/tắt lớp trạm | Chi tiết điểm nóng popup | Hoạt động | P1 (Tối ưu responsive di động) |
| `/reports` | Citizen / Member | `ReportsListPage` | `GET /api/reports` | Tìm kiếm, Lọc trạng thái, Phân trang | N/A | Hoạt động | P1 (Tối ưu bảng dữ liệu) |
| `/reports/new` | Citizen / Member | `CreateReportPage` | `POST /api/reports` | Chụp ảnh, Lấy GPS, Chọn mức độ, Nộp | Xem trước ảnh | Hoạt động | P0 (Mobile-first, touch >= 44px) |
| `/reports/:id` | Citizen / Member | `ReportDetailPage` | `GET /api/reports/:id` | Bấm theo dõi, Đánh giá xử lý | Modal nộp bổ sung ảnh | Hoạt động | P1 (Nhất quán tem băm SHA-256) |
| `/cases/:id` | Tất cả vai trò | `CaseDetailPage` | `GET /api/cases/:id` | Theo dõi vụ việc, Chia sẻ | Drawer dòng thời gian | Hoạt động | P0 (Màn hình trung tâm) |
| `/cases/:id/observe` | Member / Volunteer | `SubmitObservationPage`| `POST /api/observations` | Nộp ảnh đối chứng, Ghi nhận | Camera viewfinder modal | Hoạt động | P1 (Chống vỡ nút submit) |
| `/following` | Citizen / Member | `MyTrackingPage` | `GET /api/reports/my-tracked` | Lọc đang xử lý / đã xong | Hủy theo dõi | Hoạt động | P2 (Ổn định) |
| `/communities` | Member / Public | `CommunitiesPage` | `GET /api/communities` | Tham gia CLB, Tìm CLB | Modal tạo CLB mới | Hoạt động | P2 (Ổn định) |
| `/communities/:slug` | Member | `CommunityDetailPage` | `GET /api/communities/:slug`| Đăng bài, Nhận nhiệm vụ CLB | Drawer thành viên | Hoạt động | P2 (Ổn định) |
| `/tasks` | Member / Volunteer | `TasksPage` | `GET /api/tasks/available` | Nhận nhiệm vụ, Nộp kết quả | Modal xác nhận nhận việc | Hoạt động | P1 (Hiển thị rõ hạn chót SLA) |
| `/notifications` | Đã đăng nhập | `NotificationsPage` | `GET /api/notifications` | Đánh dấu đã đọc, Mở liên kết | N/A | Hoạt động | P2 (Ổn định) |
| `/contributions` | Member / Volunteer | `ContributionsPage` | `GET /api/contributions` | Tải chứng chỉ tín chỉ thanh niên | Modal xuất chứng chỉ QR | Hoạt động | P1 (Kiểm tra hiển thị QR SVG) |
| `/profile` | Đã đăng nhập | `ProfilePage` | `GET/PATCH /api/users/profile` | Đổi mật khẩu, Cập nhật thông tin | N/A | Hoạt động | P2 (Ổn định) |

---

## 2. PHÂN HỆ KIỂM DUYỆT & ĐIỀU PHỐI (SIDE A - MODERATOR)

| Tuyến Đường (Route) | Vai Trò (Role) | Tên Component | Nguồn Dữ Liệu / API | Các Nút Điều Khiển Chính | Cửa Sổ Modal / Drawer | Trạng Thái Hiện Tại | Mức Độ Ưu Tiên Sửa (Severity) |
|---|---|---|---|---|---|:---:|:---:|
| `/moderator/dashboard` | Moderator / Admin | `ModeratorDashboardPage`| `GET /api/moderator/stats` | Lọc kỳ báo cáo, Xem biểu đồ | N/A | Hoạt động | P1 (Tối ưu card KPI) |
| `/moderator/inbox` | Moderator / Admin | `VerificationInboxPage` | `GET /api/moderator/inbox` | Duyệt nhanh, Từ chối, Gộp tin | Drawer đối chứng tin trùng | Hoạt động | P0 (Tối ưu thao tác 1-click) |
| `/moderator/verification/:id` | Moderator | `VerificationDetailPage`| `GET /api/reports/:id` | Xác minh, Khởi tạo vụ việc | Modal tạo vụ việc | Hoạt động | P0 (Khởi tạo chuyển tiếp) |
| `/moderator/cases` | Moderator | `CaseCoordinationPage` | `GET /api/moderator/cases` | Gán đơn vị, Cập nhật tiến độ | Modal chuyển giao | Hoạt động | P1 (Tối ưu danh sách) |
| `/moderator/content` | Moderator | `ModerationQueuePage` | `GET /api/moderator/content` | Khóa bình luận, Ẩn ảnh vi phạm | Modal xác nhận vi phạm | Hoạt động | P2 (Ổn định) |

---

## 3. PHÂN HỆ TÁC NGHIỆP CHUYÊN NGHIỆP (SIDE B: DUSTGUARD OPERATIONS)

| Tuyến Đường (Route) | Vai Trò (Role) | Tên Component | Nguồn Dữ Liệu / API | Các Nút Điều Khiển Chính | Cửa Sổ Modal / Drawer | Trạng Thái Hiện Tại | Mức Độ Ưu Tiên Sửa (Severity) |
|---|---|---|---|---|---|:---:|:---:|
| `/login` | Public / Staff | `LoginPage` | `POST /api/auth/login` | Đăng nhập, Chọn vai trò nhanh | N/A | Hoạt động | P1 (Tối ưu độ tương phản) |
| `/setup` | Public / Admin | `SetupPage` | `POST /api/auth/bootstrap` | Thiết lập Super Admin đầu tiên | N/A | Hoạt động | P1 (Tối ưu giao diện wizard) |
| `/dashboard` | Cán bộ / Lãnh đạo | `DashboardPage` | `GET /api/dashboard/stats` | Lọc thời gian, Chuyển tab việc gấp | N/A | Hoạt động | **P0 (Cần thiết kế Command Center)** |
| `/cases` | Staff / Supervisor | `CaseInboxPage` | `GET /api/cases` | Tìm kiếm, Lọc trạng thái, Triage | Modal phân loại hồ sơ | Hoạt động | **P0 (Bảng danh sách & bộ lọc)** |
| `/cases/:id` | Staff / Supervisor | `CaseDetailPage` | `GET /api/cases/:id` | Chuyển trạng thái, Phân công, Ra lệnh | DecisionModal, NextActionCard | Hoạt động | **P0 (Màn hình trung tâm quan trọng nhất)** |
| `/cases/:id/legal` | Legal Reviewer | `LegalWorkspacePage` | `GET /api/cases/:id/legal` | Chạy phân tích, Ký duyệt pháp lý | Drawer trích dẫn điều luật | Hoạt động | **P0 (Phân biệt rõ AI vs Quyết định người)** |
| `/cases/:id/inspection/new`| Staff / Inspector | `InspectionPlanPage` | `POST /api/inspections` | Chọn mẫu biên bản QCVN 18, Lên lịch | Modal xác nhận lịch | Hoạt động | P1 (Form nhóm section rõ ràng) |
| `/inspections` | Staff / Supervisor | `InspectionListPage` | `GET /api/inspections` | Lọc đợt kiểm tra, Xem kết quả | N/A | Hoạt động | P1 (Tối ưu hiển thị bảng) |
| `/inspections/:id` | Staff / Inspector | `FieldInspectionPage` | `GET /api/inspections/:id` | Tích chọn 10 tiêu chí, Chụp ảnh vi phạm | Drawer chi tiết tiêu chí | Hoạt động | **P0 (Thao tác hiện trường 1 tay)** |
| `/inspections/:id/result` | Staff / Inspector | `InspectionResultPage` | `GET /api/inspections/:id/result`| Ký biên bản, Xuất PDF/A4 | Xem trước biên bản | Hoạt động | P1 (Định dạng in ấn A4 chuẩn) |
| `/actions` | Staff / Supervisor | `ActionsListPage` | `GET /api/actions` | Lọc quá hạn SLA 48h, Nghiệm thu | N/A | Hoạt động | P0 (Hiển thị thời hạn SLA đỏ) |
| `/actions/:id/remediation`| Supervisor / Staff | `RemediationReviewPage` | `GET/POST /api/remediation/:id` | So sánh Before/After, Nghiệm thu | Modal lý do trả hồ sơ | Hoạt động | **P0 (Slider Before/After trực quan)** |
| `/evidence` | Staff / Legal | `EvidencePage` | `GET /api/evidence` | Lọc nguồn tệp, Bấm kiểm định băm | Modal xem ảnh phóng to | Hoạt động | **P0 (Hiển thị băm rút gọn & badge)** |
| `/tasks` | Staff / Inspector | `TasksPage` | `GET /api/tasks` | Chuyển trạng thái, Nhận việc | Modal tạo nhiệm vụ | Hoạt động | P1 (Phân loại theo mức độ ưu tiên) |
| `/iot` & `/iot/devices` | Staff / Tech | `IotDevicesPage` | `GET /api/iot/devices` | Xem trạng thái trạm, Bộ lọc lỗi | Modal đăng ký thiết bị | Hoạt động | P1 (Chỉ số nhịp sống & flatline) |
| `/iot/devices/:id` | Staff / Tech | `IotDeviceDetailPage` | `GET /api/iot/devices/:id` | Biểu đồ nồng độ PM2.5, Lịch sử gói | N/A | Hoạt động | P1 (Biểu đồ nhẹ, không lag) |
| `/automations` | Supervisor / Admin | `AutomationsPage` | `GET /api/automations` | Bật/tắt luật tự động, Xem lịch sử | Modal cấu hình điều kiện | Hoạt động | P2 (Ổn định) |
| `/reports` | Lãnh đạo / Admin | `ReportsPage` | `GET /api/reports/executive` | Xuất báo cáo tổng hợp, Lọc địa bàn | Xuất dữ liệu Excel/PDF | Hoạt động | P1 (Báo cáo trực quan số liệu thật) |
| `/supervisor/workload` | Supervisor | `SupervisorWorkloadPage`| `GET /api/supervisor/workload` | Điều phối lại cán bộ, Cân bằng tải | Modal chuyển phân công | Hoạt động | P1 (Biểu đồ tải trọng công việc) |
| `/admin/users` | Super Admin | `AdminUsersPage` | `GET /api/admin/users` | Thêm tài khoản, Phân quyền, Khóa | Modal tạo/sửa người dùng | Hoạt động | P1 (Validate đúng role thay vì role_id) |
| `/admin/audit` | Super Admin | `AdminAuditPage` | `GET /api/admin/audit` | Tra cứu nhật ký kiểm toán bất biến | Drawer chi tiết metadata | Hoạt động | P1 (Hiển thị JSON có cấu trúc rõ) |
| `/admin/settings` | Super Admin | `AdminSettingsPage` | `GET/PATCH /api/admin/configs` | Đổi ngưỡng cảnh báo, Cấu hình SLA | Modal lưu thay đổi | Hoạt động | P2 (Ổn định) |
| `/contractors` | Admin / Staff | `ContractorsPage` | `GET/POST /api/contractors` | Thêm nhà thầu, Xem lịch sử vi phạm | Modal thêm nhà thầu | Hoạt động | P1 (Danh bạ nhà thầu) |
| `/projects` | Admin / Staff | `ProjectsPage` | `GET/POST /api/projects` | Thêm công trình, Bản đồ công trình | Modal thêm công trình | Hoạt động | P1 (Thông tin chủ đầu tư/nhà thầu) |

---

## 4. TỔNG HỢP VÀ PHÂN BỔ MỨC ĐỘ ƯU TIÊN SỬA ĐỔI

- **Tổng số tuyến đường UI được phát hiện**: **42 routes** (Side A: 20 routes; Side B: 22 routes).
- **Phân bổ mức độ nghiêm trọng (Severity)**:
  - **P0 (Trọng tâm trải nghiệm & Presentation Critical)**: 10 routes
    - AppShell (Header + Sidebar trên cả 2 side)
    - Operations Dashboard (`/dashboard`)
    - Case Detail (`/cases/:id` kèm tabs & Next Action card)
    - Case Inbox (`/cases`)
    - Legal Workspace (`/cases/:id/legal`)
    - Evidence Workspace (`/evidence`)
    - Field Inspection (`/inspections/:id`)
    - Remediation Review (`/actions/:id/remediation`)
    - Create Report Mobile (`/reports/new`)
    - Verification Inbox (`/moderator/inbox`)
  - **P1 (Cải thiện bố cục, chống vỡ dòng, mật độ hiển thị 1366x768)**: 22 routes
  - **P2 (Hoạt động ổn định, chỉ rà soát typography và microcopy)**: 10 routes
