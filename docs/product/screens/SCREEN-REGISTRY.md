# SCREEN-REGISTRY — DANH MỤC 31 MÀN HÌNH CHUẨN DUSTGUARD VN

> **Chuẩn hóa**: 2026-09-02 | **SSOT**: React Router (`app/src/app/router.jsx`) | **Tổng số**: 31 Màn hình

---

## 1. PHÂN HỆ CỔNG THÔNG TIN CÔNG CỘNG (PUBLIC — 8 MÀN HÌNH)

| ID | Tên Màn Hình | Route | Primary Role | Primary Job (Công Việc Chính Của Người Dùng) | Dữ Liệu Đầu Vào (Input) | Kết Quả Đầu Ra Chính (Main Output) |
|---|---|---|---|---|---|---|
| **PUB-01** | Cổng Thông Tin Giám Sát Bụi | `/` | Public | Tìm hiểu giải pháp giám sát bụi, tra cứu nhanh chất lượng không khí | Bộ lọc địa bàn / ô tìm kiếm | Tổng quan giải pháp, chỉ số ô nhiễm theo quận |
| **PUB-02** | Bản Đồ Điểm Nóng Bụi | `/map` | Public / Citizen | Tra cứu trực quan bản đồ các điểm công trình và trạm đo bụi | Tọa độ GPS / Click trạm | Popup thông tin trạm, mức bụi PM2.5/PM10, điểm nóng |
| **PUB-03** | Cổng Tín Chỉ Tình Nguyện | `/youth` | Public / Student | Tra cứu bảng vàng thi đua thanh niên và cơ chế đổi tín chỉ tình nguyện | Mã SV / Tên trường | Bảng xếp hạng Đoàn - Hội, quy đổi 20h = 4.0 tín chỉ |
| **PUB-04** | Cẩm Nang Trạm Đo 500k | `/guide` | Public / Maker | Xem tài liệu nguồn mở hướng dẫn tự lắp ráp trạm đo bụi giá rẻ | Tìm kiếm linh kiện | Hướng dẫn lắp đặt ESP32 + PMS7003, mã nguồn nạp |
| **PUB-05** | Trung Tâm Trải Nghiệm 5 Vai Trò | `/demo` | Public / Evaluator | Chuyển đổi nhanh 5 vai trò nghiệp vụ để kiểm thử toàn diện luồng | Chọn vai trò demo | Phiên làm việc mô phỏng của vai trò được chọn |
| **PUB-06** | Bàn Mô Phỏng Tín Hiệu IoT | `/demo/iot` | Public / Tech | Bơm dữ liệu đo bụi giả lập để kiểm tra phản ứng vượt ngưỡng | Thanh trượt PM10/PM2.5 | Dòng telemetry thời gian thực, kích hoạt cảnh báo |
| **PUB-07** | Đăng Nhập & Phân Quyền | `/login` | Public (Auth) | Xác thực tài khoản và điều hướng vào đúng không gian làm việc | Email / Mật khẩu | JWT Token / Phân quyền RBAC chuyển hướng |
| **PUB-08** | Trang Khôi Phục Điều Hướng | `*` | Public | Hướng dẫn người dùng quay lại trang hợp lệ khi truy cập sai link | Bấm nút điều hướng | Trở về Dashboard tương ứng với vai trò |

---

## 2. PHÂN HỆ CÔNG DÂN GIÁM SÁT (CITIZEN — 5 MÀN HÌNH)

| ID | Tên Màn Hình | Route | Primary Role | Primary Job (Công Việc Chính Của Người Dùng) | Dữ Liệu Đầu Vào (Input) | Kết Quả Đầu Ra Chính (Main Output) |
|---|---|---|---|---|---|---|
| **CIT-01** | Bàn Làm Việc Công Dân | `/citizen` | Citizen | Xem tiến độ các phản ánh của tôi và tình hình bụi khu dân cư | Xem thông báo / lọc | Danh sách phản ánh cá nhân, bản tin môi trường |
| **CIT-02** | Gửi Phản Ánh Hiện Trường | `/citizen/report/new` | Citizen | Gửi nhanh phát hiện ô nhiễm bụi công trình trong 30 giây | Ảnh chụp + GPS + Mô tả | Mã phản ánh tiếp nhận (`DG-...`), thông báo gửi thành công |
| **CIT-03** | Sổ Tay Phản Ánh | `/citizen/reports` | Citizen | Quản lý, tìm kiếm và lọc toàn bộ lịch sử phản ánh đã gửi | Bộ lọc trạng thái / ngày | Danh sách phản ánh chi tiết, trạng thái xử lý |
| **CIT-04** | Chi Tiết Phản Ánh | `/citizen/reports/:id` | Citizen | Xem tiến trình xử lý, đối chứng ảnh Trước/Sau khi khắc phục | Mã ID phản ánh | Timeline 4 giai đoạn, ảnh minh chứng Before/After |
| **CIT-05** | Hồ Sơ Cá Nhân | `/citizen/profile` | Citizen | Quản lý thông tin cá nhân và tích lũy đóng góp công dân số | Cập nhật họ tên, SĐT | Số giờ đóng góp, chứng nhận số tích cực |

---

## 3. PHÂN HỆ CÁN BỘ THANH TRA (STAFF — 11 MÀN HÌNH)

| ID | Tên Màn Hình | Route | Primary Role | Primary Job (Công Việc Chính Của Người Dùng) | Dữ Liệu Đầu Vào (Input) | Kết Quả Đầu Ra Chính (Main Output) |
|---|---|---|---|---|---|---|
| **STF-01** | Bàn Điều Hành Ca Trực | `/staff` | Staff | Nắm bắt toàn bộ vụ việc khẩn cấp cần xử lý ngay trong ca trực | Lọc ca trực / quận | 12 chỉ số tác nghiệp, hàng đợi vụ việc ưu tiên cao |
| **STF-02** | Sổ Bộ Công Trình | `/staff/sites` | Staff | Quản lý danh mục 38+ công trình, tra cứu rủi ro bụi theo địa bàn | Bộ lọc mức độ rủi ro | Danh sách công trình, điểm Dust Risk Score (0-100) |
| **STF-03** | Hồ Sơ Công Trình | `/staff/sites/:id` | Staff | Tra cứu hồ sơ pháp lý, thông tin nhà thầu, lịch sử vi phạm | ID công trình | Chi tiết nhà thầu, trạm đo liên kết, lịch sử vụ việc |
| **STF-04** | Danh Mục Vụ Việc | `/staff/cases` | Staff | Quản lý, phân loại và theo dõi tiến độ xử lý các vụ việc | Lọc theo 7 bước / SLA | Danh mục vụ việc, hạn xử lý SLA 48h |
| **STF-05** | Không Gian Thụ Lý Vụ Việc | `/staff/cases/:id` | Staff | Thực hiện quy trình tác nghiệp 7 bước thụ lý và giải quyết vụ việc | Thao tác chuyển bước, ghi chú | Hồ sơ vụ việc hoàn chỉnh, biên bản xử lý |
| **STF-06** | Lịch Công Tác & Giao Việc | `/staff/tasks` | Staff | Phân công nhiệm vụ khảo sát hiện trường cho cán bộ/tình nguyện | Người nhận, hạn chót | Nhiệm vụ khảo sát mới, danh sách việc cần làm |
| **STF-07** | Quan Trắc Cảm Biến 24/7 | `/staff/monitoring` | Staff | Theo dõi diễn biến nồng độ bụi từ các trạm đo theo thời gian | Chọn trạm / khoảng giờ | Biểu đồ chuỗi thời gian PM2.5/PM10, cảnh báo xu hướng |
| **STF-08** | Cảnh Báo Ô Nhiễm | `/staff/alerts` | Staff | Tiếp nhận các cảnh báo vượt ngưỡng và chuyển hóa thành nhiệm vụ | Lọc cảnh báo chưa xử lý | Chuyển đổi cảnh báo thành Nhiệm vụ kiểm tra |
| **STF-09** | Báo Cáo Hành Chính | `/staff/reports` | Staff / Exec | Xuất bản báo cáo tổng hợp A4 chuẩn thể thức NĐ 30/2020/NĐ-CP | Chọn kỳ báo cáo / quận | File báo cáo PDF/Print A4 kèm mã xác thực docHash |
| **STF-10** | Hồ Sơ Cán Bộ | `/staff/profile` | Staff | Cập nhật thông tin cán bộ, đội phụ trách và lịch ca trực | Thông tin liên hệ, ca trực | Hồ sơ cán bộ cập nhật, danh sách ca trực |
| **STF-11** | Nhật Ký Tác Nghiệp | `/staff/activity` | Staff / Auditor | Kiểm tra nhật ký thao tác nghiệp vụ phục vụ minh bạch công vụ | Lọc theo ngày / cán bộ | Dòng sự kiện tác nghiệp (chuyển bước, duyệt bằng chứng) |

---

## 4. PHÂN HỆ NHÀ THẦU XÂY DỰNG (CONTRACTOR — 4 MÀN HÌNH)

| ID | Tên Màn Hình | Route | Primary Role | Primary Job (Công Việc Chính Của Người Dùng) | Dữ Liệu Đầu Vào (Input) | Kết Quả Đầu Ra Chính (Main Output) |
|---|---|---|---|---|---|---|
| **CON-01** | Bàn Làm Việc Chỉ Huy Trưởng | `/contractor` | Contractor | Nắm bắt các yêu cầu khắc phục bụi cần thực hiện khẩn cấp | Xem thông báo yêu cầu | Danh sách việc cần khắc phục ngay, hạn hoàn thành |
| **CON-02** | Khắc Phục & Nộp Minh Chứng | `/contractor/tasks` | Contractor | Nộp ảnh đối chứng Before/After và giải trình biện pháp đã xử lý | Ảnh chụp + Tọa độ + Ghi chú | Bằng chứng khắc phục gửi đến cán bộ thanh tra |
| **CON-03** | Hồ Sơ Vụ Việc Nhà Thầu | `/contractor/cases` | Contractor | Theo dõi diễn biến các vụ việc liên quan đến công trường dự án | Lọc dự án / tình trạng | Chi tiết vụ việc, lịch sử làm việc với cơ quan quản lý |
| **CON-04** | Báo Cáo Tuân Thủ Môi Trường | `/contractor/reports` | Contractor | Tổng hợp báo cáo định kỳ các biện pháp bảo vệ môi trường đã làm | Chọn kỳ báo cáo | Báo cáo tuân thủ (tưới nước, rửa xe ben, che bạt) |

---

## 5. PHÂN HỆ QUẢN TRỊ HỆ THỐNG (ADMIN — 3 MÀN HÌNH)

| ID | Tên Màn Hình | Route | Primary Role | Primary Job (Công Việc Chính Của Người Dùng) | Dữ Liệu Đầu Vào (Input) | Kết Quả Đầu Ra Chính (Main Output) |
|---|---|---|---|---|---|---|
| **ADM-01** | Bảng Điều Hành Quản Trị | `/admin` | Admin | Giám sát sức khỏe hạ tầng Cloudflare D1, Worker Edge, hệ thống | Xem log hệ thống | Bảng trạng thái dịch vụ, số lượng bản ghi, lỗi hệ thống |
| **ADM-02** | Quản Lý Danh Bạ Tài Khoản | `/admin/users` | Admin | Quản lý người dùng, kích hoạt tài khoản và phân quyền 5 vai trò | Tìm kiếm / Phân quyền | Danh sách tài khoản, cập nhật vai trò (Role RBAC) |
| **ADM-03** | Cấu Hình Hệ Thống | `/admin/settings` | Admin | Thiết lập ngưỡng cảnh báo QCVN 05:2023 và thời hạn SLA mặc định | Nhập ngưỡng / SLA | Lưu cấu hình tham số vận hành toàn hệ thống |
