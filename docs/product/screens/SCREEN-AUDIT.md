# SCREEN-AUDIT — ĐỐI CHIẾU 31 MÀN HÌNH DUSTGUARD VN VỚI CODEBASE THỰC TẾ

> **Ngày thực hiện**: 2026-09-02  
> **Phương pháp**: Đối chiếu Router thực tế (`app/src/app/router.jsx` & các app route files), Pages thực tế (`app/src/apps/`), D1 Schema (`app/server/db/schema-healer.js`) và API Endpoints (`app/server/routes/worker/*.routes.js`).

---

## 1. BẢNG ĐỐI CHIẾU TOÀN DIỆN 31 MÀN HÌNH

| Screen ID | Tên Màn Hình | Route Spec Cũ | Actual Page Component | Actual Route Router | Role Tiếp Cận | Trạng Thái Code | Quyết Định Audit | Ghi Chú Kỹ Thuật & Nghiệp Vụ |
|---|---|---|---|---|---|---|---|---|
| **PUB-01** | Cổng Thông Tin Giám Sát Bụi Đô Thị | `/` & `/landing` | `LandingPage.jsx` | `/` (redirect `/landing` -> `/`) | Public | `CURRENT` | **REWRITE** | Tinh gọn spec, bỏ boilerplate test, tập trung narrative Minh bạch - Cộng đồng - Hành động. |
| **PUB-02** | Bản Đồ Điểm Nóng Bụi & Tra Cứu Địa Bàn | `/map` | `CitizenMap.jsx` | `/map` | Public / Citizen | `CURRENT` | **REWRITE** | Tách bạch với CIT-01 (không trùng tính năng cá nhân), tập trung WGS84, GIS Heatmap, trạm đo. |
| **PUB-03** | Cổng Tín Chỉ Tình Nguyện & Bảng Vàng | `/youth` | `YouthCredits.jsx` | `/youth`, `/youth/credits`, `/youth/leaderboard` | Public / Student | `CURRENT` | **REWRITE** | Đính chính: Tín chỉ tình nguyện (20h = 4.0 tín chỉ), bảng vàng trường học; không phải profile cá nhân. |
| **PUB-04** | Cẩm Nang Chế Tạo Trạm Đo Bụi 500k | `/guide` | `SensorGuide.jsx` | `/guide` (redirect `/docs/sensor-guide` -> `/guide`) | Public / Maker | `CURRENT` | **REWRITE** | Tinh gọn BOM linh kiện (ESP32 + PMS7003), hướng dẫn mã nguồn mở, không hardcode ảo. |
| **PUB-05** | Trung Tâm Trải Nghiệm Kịch Bản 5 Vai Trò | `/demo` | `DemoHub.jsx` | `/demo` (redirect `/demo/accounts` -> `/demo`) | Public / Evaluator | `CURRENT` | **REWRITE** | Tách bạch với Login (PUB-07): DemoHub là switcher 5 vai trò nhanh phục vụ demo & đánh giá. |
| **PUB-06** | Bàn Mô Phỏng Tín Hiệu Cảm Biến IoT | `/demo/iot` | `IoTDemo.jsx` | `/demo/iot` | Public / Tech | `CURRENT` | **REWRITE** | Mô phỏng dòng telemetry PM2.5/PM10 phục vụ test tải và kích hoạt ngưỡng cảnh báo. |
| **PUB-07** | Cổng Đăng Nhập & Điều Hướng Vai Trò | `/login` | `Login.jsx` | `/login`, `/register` | Public (Auth) | `CURRENT` | **REWRITE** | Đăng nhập tài khoản thật/demo, JWT/Session RBAC 5 vai trò. |
| **PUB-08** | Trang 404 Điều Hướng Khôi Phục | `*` | `NotFound.jsx` | `*` (Catch-all) | Public | `CURRENT` | **REWRITE** | Khôi phục điều hướng thông minh theo vai trò hiện tại của session. |
| **CIT-01** | Bàn Làm Việc Công Dân — Khu Dân Cư | `/citizen` | `CitizenHomePage.jsx` | `/citizen` | Citizen | `CURRENT` | **REWRITE** | Primary job: "What happened to my reports?" + điểm tin khu vực. Mobile-first. |
| **CIT-02** | Gửi Phản Ánh Hiện Trường 30 Giây | `/citizen/report/new` | `ReportNewPage.jsx` | `/citizen/report/new` | Citizen | `CURRENT` | **REWRITE** | 30s Quick Flow: Ảnh chụp + GPS + Mô tả nhanh. Không bắt dân hiểu thủ tục thanh tra. |
| **CIT-03** | Sổ Tay Danh Sách Phản Ánh Cá Nhân | `/citizen/reports` | `ReportsListPage.jsx` | `/citizen/reports` | Citizen | `CURRENT` | **REWRITE** | Danh sách phản ánh do chính user gửi hoặc đang theo dõi. Lọc trạng thái rõ ràng. |
| **CIT-04** | Chi Tiết Phản Ánh & Đối Chứng Trước/Sau | `/citizen/reports/:id` | `ReportDetailPage.jsx` | `/citizen/reports/:id` | Citizen | `CURRENT` | **REWRITE** | Minh chứng minh bạch: Ảnh lúc gửi vs Ảnh khắc phục hoàn thành. Nhận thông báo tiến độ. |
| **CIT-05** | Hồ Sơ Công Dân Tích Cực | `/citizen/profile` | `CitizenProfilePage.jsx` | `/citizen/profile` | Citizen | `CURRENT` | **REWRITE** | Thông tin cá nhân, tích lũy giờ tình nguyện cá nhân, chứng nhận số. |
| **STF-01** | Bàn Điều Hành Tác Nghiệp Ca Trực | `/staff` | `StaffDashboardPage.jsx` | `/staff` | Staff | `CURRENT` | **REWRITE** | Primary job: "What needs attention now?". 12 chỉ số ca trực, triage hàng chờ. |
| **STF-02** | Sổ Bộ Quản Lý Công Trình Xây Dựng | `/staff/sites` | `SitesListPage.jsx` | `/staff/sites` | Staff | `CURRENT` | **REWRITE** | Quản lý danh mục 38+ công trình, tra cứu địa bàn, điểm Dust Risk Score ưu tiên. |
| **STF-03** | Hồ Sơ Pháp Lý & Lịch Sử Công Trình | `/staff/sites/:id` | `SiteDetailPage.jsx` | `/staff/sites/:id` | Staff | `CURRENT` | **REWRITE** | Chi tiết công trình: Thông tin nhà thầu, thiết bị đo bụi, lịch sử kiểm tra và vụ việc. |
| **STF-04** | Danh Mục Hồ Sơ Vụ Việc Xử Lý | `/staff/cases` | `CasesListPage.jsx` | `/staff/cases` | Staff | `CURRENT` | **REWRITE** | Quản lý danh sách vụ việc (Cases), lọc theo 7 bước quy trình DAG, hạn SLA. |
| **STF-05** | Không Gian Tác Nghiệp Thụ Lý Vụ Việc | `/staff/cases/:id` | `CaseDetailPage.jsx` | `/staff/cases/:id` | Staff | `CURRENT` | **REWRITE** | Workspace 7 bước thụ lý: Tiếp nhận -> Khảo sát -> Đề xuất -> Hoàn tất. Human-in-the-loop. |
| **STF-06** | Lịch Công Tác & Phân Công Nhiệm Vụ | `/staff/tasks` | `TasksListPage.jsx` | `/staff/tasks` | Staff | `CURRENT` | **REWRITE** | Giao việc khảo sát hiện trường, kiểm tra công trình cho cán bộ/tình nguyện viên. |
| **STF-07** | Trung Tâm Quan Trắc Cảm Biến 24/7 | `/staff/monitoring` | `StaffMonitoringPage.jsx` | `/staff/monitoring` | Staff | `CURRENT` | **REWRITE** | Giám sát tín hiệu cảm biến liên tục, biểu đồ xu hướng 24h/7d. IoT là nguồn phụ trợ. |
| **STF-08** | Tiếp Nhận & Xử Lý Cảnh Báo Ô Nhiễm | `/staff/alerts` | `StaffAlertsPage.jsx` | `/staff/alerts` | Staff | `CURRENT` | **REWRITE** | Danh sách sự kiện vượt ngưỡng PM10/PM2.5 cần chuyển hóa thành Nhiệm vụ kiểm tra. |
| **STF-09** | Trung Tâm Báo Cáo Hành Chính NĐ 30/2020 | `/staff/reports` | `StaffReportsPage.jsx` | `/staff/reports` | Staff / Exec | `CURRENT` | **REWRITE** | Xuất bản báo cáo thống kê, biểu mẫu A4 chuẩn thể thức NĐ 30/2020/NĐ-CP, docHash. |
| **STF-10** | Hồ Sơ Công Tác Cán Bộ & Ca Trực | `/staff/profile` | `StaffProfilePage.jsx` | `/staff/profile` | Staff | `CURRENT` | **REWRITE** | Quản lý thông tin cán bộ, đội phụ trách địa bàn, nhật ký ca trực cá nhân. |
| **STF-11** | Nhật Ký Tác Nghiệp Công Vụ | `/staff/activity` | `StaffActivityPage.jsx` | `/staff/activity` | Staff / Auditor | `CURRENT` | **REWRITE** | Audit log nghiệp vụ: Ai thay đổi trạng thái case, phân công nhiệm vụ, xuất báo cáo. |
| **CON-01** | Bàn Làm Việc Chỉ Huy Trưởng | `/contractor` | `ContractorDashboardPage.jsx` | `/contractor` | Contractor | `CURRENT` | **REWRITE** | Primary job: "What must we fix now?". Danh sách yêu cầu khắc phục cần giải quyết ngay. |
| **CON-02** | Tiếp Nhận Khắc Phục & Nộp Minh Chứng | `/contractor/tasks` | `ContractorTasksPage.jsx` | `/contractor/tasks` | Contractor | `CURRENT` | **REWRITE** | Workspace nộp ảnh đối chứng Before/After, định vị geofence công trường, giải trình. |
| **CON-03** | Sổ Bộ Hồ Sơ Vụ Việc Của Nhà Thầu | `/contractor/cases` | `ContractorCasesPage.jsx` | `/contractor/cases` | Contractor | `CURRENT` | **REWRITE** | Theo dõi các vụ việc liên quan đến dự án của nhà thầu, hạn phản hồi, biên bản. |
| **CON-04** | Báo Cáo Định Kỳ Tuân Thủ Môi Trường | `/contractor/reports` | `ContractorReportsPage.jsx` | `/contractor/reports` | Contractor | `CURRENT` | **REWRITE** | Tổng hợp mức độ tuân thủ, lịch sử tưới nước dập bụi, vệ sinh xe ben ra vào. |
| **ADM-01** | Bảng Điều Hành Quản Trị Hệ Thống | `/admin` | `AdminDashboardPage.jsx` | `/admin` | Admin | `CURRENT` | **REWRITE** | Primary job: "What requires system administration?". Giám sát D1, Edge, Worker health. |
| **ADM-02** | Quản Lý Danh Bạ & Phân Quyền 5 Cấp | `/admin/users` | `UsersPage.jsx` | `/admin/users` | Admin | `CURRENT` | **REWRITE** | Quản lý tài khoản người dùng, gán vai trò RBAC (Citizen, Community, Staff, Contractor, Admin). |
| **ADM-03** | Cấu Hình Ngưỡng & Liên Thông | `/admin/settings` | `SettingsPage.jsx` | `/admin/settings` | Admin | `CURRENT` | **REWRITE** | Cài đặt ngưỡng QCVN 05:2023, thời hạn SLA mặc định (24h/48h), cấu hình hệ thống. |

---

## 2. KẾT LUẬN AUDIT & CÁC MÂU THUẪN ĐÃ ĐƯỢC LÀM RÕ

1. **Số lượng màn hình**: Đúng chuẩn **31 màn hình** khớp 100% với React Router (`app/src/app/router.jsx`). Không có màn hình thừa hay thiếu.
2. **Loại bỏ nhầm lẫn vai trò**:
   - `PUB-02` (Bản đồ công cộng) tách biệt hoàn toàn với `CIT-01` (Bàn làm việc dân cư cá nhân).
   - `PUB-03` (Cổng tình nguyện thanh niên) tách biệt với `CIT-05` (Hồ sơ cá nhân).
   - `STF-06` (Giao việc khảo sát) tách biệt với `CON-02` (Nộp khắc phục nhà thầu).
   - `STF-11` (Nhật ký tác nghiệp nghiệp vụ) tách biệt với `ADM-01` (Giám sát hạ tầng kỹ thuật D1).
3. **Loại bỏ các giả định không có trong Codebase**:
   - Không tự ý bịa kết nối cổng 1022 / iHanoi nếu chưa có endpoint thật -> Ghi nhận `UNKNOWN` / `PROPOSED`.
   - Dust Risk Score là điểm ưu tiên tác nghiệp (`0-100`), không phải kết luận vi phạm pháp lý.
   - AI là trợ lý trích xuất / gợi ý (`Human-in-the-loop`), không tự động ban hành quyết định xử phạt.
4. **Loại bỏ Boilerplate dài dòng**: Toàn bộ mã lệnh shell/PowerShell và test suite được đưa vào `SCREEN-VERIFICATION-PLAN.md`, giữ cho các file Screen Spec tinh gọn (120-200 dòng), chuẩn hóa cho coding agent.
