# SCREEN DECISION MATRIX — DUSTGUARD VN
## Quyết Định Tái Cấu Trúc Toàn Bộ 35 Màn Hình Cũ Thành 15 Màn Hình Tối Giản V2

> **Nguyên tắc**: Không giữ màn hình chỉ vì đã viết code. Mỗi màn hình phải phục vụ một Job-To-Be-Done có thật của người dùng.  
> **5 Trạng thái phân loại**: `KEEP` | `MERGE` | `REDESIGN` | `REMOVE` | `UNKNOWN`

---

## 1. BẢNG QUYẾT ĐỊNH CHO TỪNG MÀN HÌNH (DETAILED DECISION TABLE)

| STT | Màn Hình Cũ | Role | Quyết Định V2 | Đích Mới (New Destination) | Lý Do Nghiệp Vụ Thực Tế |
|:---:|---|:---:|:---:|---|---|
| **PUBLIC** |
| 01 | `/` Landing Page | Public | **REDESIGN** | `P01: LandingPage.jsx` | Tinh gọn 10-second screen, giải thích trọn vẹn chuỗi 7 bước, dẫn thẳng vào 2 CTA chính. |
| 02 | `/map` Citizen Map | Public | **REDESIGN** | `P02: CitizenMap.jsx` | Tinh giản: Hiển thị trạm đo & vụ việc đang mở; có nút dẫn sang gửi phản ánh. |
| 03 | `/guide` Sensor Guide | Public | **MERGE** | Nhúng vào Modal trong `/map` & Docs | Không cần 1 route riêng biệt; người dân chỉ cần mở hướng dẫn khi có nhu cầu. |
| 04 | `/demo` Demo Hub | Public | **MERGE** | Tích hợp vào Landing Page Modal | Golden Demo `#DG-2026-0842` xuất hiện trực tiếp khi bấm "Trải nghiệm" trên Landing. |
| 05 | `/demo/iot` IoT Demo | Public | **MERGE** | Nhúng vào `/admin/monitoring` | Phục vụ giả lập test nguồn tín hiệu cho Admin/Dev. |
| 06 | `/youth` Youth Credits | Public | **MERGE** | Tích hợp vào `/citizen` Profile tab | Tín chỉ thanh niên là phần thưởng cá nhân của Citizen/TNV, không cần phân hệ tách rời. |
| 07 | `/login` Login Page | Auth | **KEEP** | `Auth: Login.jsx` | Giữ nguyên cửa ngõ đăng nhập 5 roles và demo quick-login. |
| 08 | `*` 404 Not Found | Public | **KEEP** | `NotFound.jsx` | Fallback trang lỗi tiêu chuẩn. |
| **CITIZEN** |
| 09 | `/citizen` Citizen Home | Citizen | **REDESIGN** | `C01: CitizenHomePage.jsx` | Bàn làm việc công dân: Xem ngay các phản ánh của tôi đang ở bước nào + Nút gửi phản ánh. |
| 10 | `/citizen/report/new` Gửi phản ánh | Citizen | **KEEP** | `C02: ReportNewPage.jsx` | Flow 30s trực quan: Chụp ảnh, GPS tự động, danh mục, không đổi. |
| 11 | `/citizen/reports` Danh sách phản ánh | Citizen | **MERGE** | Hợp nhất vào `C01: CitizenHomePage` | Không cần 2 màn hình danh sách riêng biệt; xem ngay trên trang chính của Citizen. |
| 12 | `/citizen/reports/:id` Chi tiết phản ánh | Citizen | **REDESIGN** | `C03: ReportDetailPage.jsx` | Không gian minh bạch: Thấy rõ ai xử lý, ảnh Before/After và kết quả tái kiểm đạt chuẩn. |
| 13 | `/citizen/profile` Hồ sơ cá nhân | Citizen | **MERGE** | Hợp nhất vào Tab Hồ sơ trong `C01` | Rút gọn thành tab nhỏ hiển thị thông tin và chứng nhận QR. |
| **STAFF** |
| 14 | `/staff` Staff Dashboard | Staff | **REDESIGN** | `S01: StaffWorkList.jsx` | Danh sách việc ca trực hôm nay: Ưu tiên theo hạn chót và khoảng cách km. |
| 15 | `/staff/sites` Quản lý công trình | Staff | **REMOVE** | — | Cán bộ đi hiện trường không cần quản lý danh bạ công trình; công trình gắn liền với Task. |
| 16 | `/staff/sites/:id` Chi tiết công trình | Staff | **REMOVE** | — | Thông tin công trình được nhúng trực tiếp trong màn hình Nhiệm vụ / Case. |
| 17 | `/staff/cases` Quản lý vụ việc | Staff | **MERGE** | Hợp nhất vào `S01: StaffWorkList` | Cán bộ chỉ làm theo Nhiệm vụ được giao, không cần quản lý toàn bộ kho vụ việc. |
| 18 | `/staff/cases/:id` Chi tiết vụ việc | Staff | **MERGE** | `S02: StaffTaskDetail.jsx` | Tinh gọn thành màn hình chi tiết nhiệm vụ có nút mở Google Maps. |
| 19 | `/staff/tasks` Nhiệm vụ tác nghiệp | Staff | **MERGE** | Hợp nhất vào `S01: StaffWorkList` | Loại bỏ phân mảnh giữa Cases và Tasks cho Staff. |
| 20 | `/staff/monitoring` Trạm quan trắc | Staff | **MERGE** | Chuyển quyền sang `Admin / Dispatcher` | Cán bộ ngoài đường không ngồi soi biểu đồ trạm đo; Admin điều phối mới cần xem. |
| 21 | `/staff/alerts` Cảnh báo vượt ngưỡng | Staff | **MERGE** | Chuyển quyền sang `Admin Inbox` | Tín hiệu cảnh báo do Admin tiếp nhận để phân công cho Staff. |
| 22 | `/staff/reports` Báo cáo điều hành | Staff | **MERGE** | Chuyển sang `Admin Case Detail (In A4)` | Việc ký và xuất báo cáo A4 chuẩn NĐ 30 do Admin/Lãnh đạo thực hiện. |
| 23 | `/staff/profile` Hồ sơ cán bộ | Staff | **MERGE** | Modal thông tin cá nhân | Rút gọn thành modal tài khoản góc trên bên phải. |
| 24 | `/staff/notifications` Thông báo | Staff | **MERGE** | Dropdown chuông thông báo | Không cần nguyên 1 trang riêng chỉ để đọc thông báo. |
| 25 | `/staff/settings` Cài đặt | Staff | **REMOVE** | — | Cán bộ hiện trường không cấu hình hệ thống. |
| 26 | `/staff/activity` Nhật ký | Staff | **MERGE** | Nhúng vào Timeline của Case Detail | Lịch sử tác nghiệp gắn liền với từng vụ việc cụ thể. |
| 27 | `/staff/help` Hướng dẫn quy định | Staff | **MERGE** | Modal tra cứu nhanh trong khi kiểm tra | Nhúng trợ lý tra cứu QCVN trực tiếp vào form kiểm tra. |
| **CONTRACTOR** |
| 28 | `/contractor` Contractor Dashboard | Contractor | **REDESIGN** | `K01: ContractorWorkList.jsx` | Danh sách yêu cầu cần làm: Tôi phải làm gì? Hạn khi nào? Nộp ảnh nào? |
| 29 | `/contractor/tasks` Xử lý yêu cầu | Contractor | **REDESIGN** | `K02: ContractorTaskSubmit.jsx` | Chụp ảnh After có Geofence <50m & nộp minh chứng báo hoàn tất. |
| 30 | `/contractor/cases` Danh sách dự án | Contractor | **MERGE** | Hợp nhất vào `K01` | Nhà thầu chỉ cần xem danh sách việc theo từng công trình. |
| 31 | `/contractor/reports` Báo cáo tuân thủ | Contractor | **MERGE** | Nút xuất Biên bản bàn giao trong `K02` | Tự động tạo bản A4 khi bấm nộp minh chứng. |
| **ADMIN** |
| 32 | `/admin` Admin Dashboard | Admin | **REDESIGN** | `A01: AdminInbox.jsx` | Hộp thư điều phối: Tín hiệu mới, Việc quá hạn, Điểm nghẽn quy trình. |
| 33 | `/admin/users` Quản lý người dùng | Admin | **KEEP** | `A04: UsersPage.jsx` | Quản trị danh bạ 5 roles & phân quyền an toàn. |
| 34 | `/admin/sites` Quản lý công trình | Admin | **MERGE** | Nhúng trong bộ lọc tìm kiếm của Case/Inbox | Công trình là metadata thuộc tính của Case. |
| 35 | `/admin/settings` Cài đặt hệ thống | Admin | **KEEP** | `A05: SettingsPage.jsx` | Cấu hình tham số D1, R2, SLA, ngưỡng QCVN 05. |

---

## 2. TỔNG KẾT THỐNG KÊ QUYẾT ĐỊNH

- **KEEP (Giữ nguyên & Tối ưu nhẹ)**: **3 màn hình** (Login, Report New, Admin Settings).
- **REDESIGN (Thiết kế lại đúng Job-To-Be-Done)**: **8 màn hình** (Landing, Map, Citizen Home, Citizen Case Detail, Staff Work List, Staff Task Detail, Contractor Work List, Admin Inbox).
- **MERGE (Hợp nhất vào màn hình chính)**: **21 màn hình** (Xóa bỏ sự phân tán, gom vào 1 trang trung tâm).
- **REMOVE (Xóa bỏ hoàn toàn do không có nghiệp vụ thực)**: **3 màn hình** (Staff Sites, Staff Site Detail, Staff Settings).

➡️ **KẾT QUẢ: Hệ thống rút gọn từ 35 màn hình phân mảnh $\longrightarrow$ 15 màn hình chuẩn hóa, tinh gọn, đúng nghiệp vụ.**
