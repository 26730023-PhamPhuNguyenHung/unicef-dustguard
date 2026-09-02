# SCREEN LIST V2 — DUSTGUARD VN
## Danh Mục 15 Màn Hình Tối Giản V2 & Đặc Tả Cốt Lõi

---

## 🌐 1. PHÂN HỆ PUBLIC (2 Màn Hình)

### P01. Landing Page (`/`)
- **Ai dùng**: Người dân, đối tác, giám khảo tìm hiểu giải pháp.
- **Họ vào làm gì**: Nắm trọn vẹn mô hình DustGuard trong 10 giây.
- **Thành phần chính**:
  - Hero: Headline "Phát hiện vấn đề. Chuyển đúng người. Theo dõi đến kết quả."
  - Golden Case Preview `#DG-2026-0842` (Toggle Trước/Sau, chỉ số PM2.5 giảm 142 $\to$ 28 µg/m³).
  - 2 Nút CTA chính: **[Gửi phản ánh ngay]** $\to$ `/citizen/report/new` và **[Xem bản đồ]** $\to$ `/map`.

### P02. Bản Đồ Tình Hình Bụi Công Khai (`/map`)
- **Ai dùng**: Người dân tra cứu tình hình không khí khu vực mình sống.
- **Họ vào làm gì**: Xem các trạm đo và tiến độ các vụ việc xung quanh.
- **Thành phần chính**: Bản đồ OpenStreetMap WGS84, bộ lọc theo Phường/Xã, popup xem nhanh vụ việc và nút dẫn sang gửi phản ánh mới.

---

## 👥 2. PHÂN HỆ CÔNG DÂN & TÌNH NGUYỆN (3 Màn Hình)

### C01. Bàn Làm Việc & Theo Dõi Phản Ánh (`/citizen`)
- **Ai dùng**: Người dân và tình nguyện viên Đoàn/Hội.
- **Họ vào làm gì**: Xem ngay các phản ánh của tôi đang ở đâu + Nhận nhiệm vụ khảo sát + Đổi tín chỉ xanh.
- **Thành phần chính**:
  - Hàng trên: 3 Thẻ thống kê (Phản ánh đã gửi, Đang xử lý, Đã hoàn tất).
  - Khối chính: Danh sách phản ánh của tôi (Mã số, vị trí, ảnh chụp, thanh tiến trình 7 bước, nút xem chi tiết).
  - Tab phụ: Điểm rèn luyện / Tín chỉ thanh niên (20h = 4.0 tín chỉ) và mã QR chứng chỉ.

### C02. Gửi Phản Ánh Mới 30 Giây (`/citizen/report/new`)
- **Ai dùng**: Người dân phát hiện bụi ngoài đường.
- **Họ vào làm gì**: Chụp ảnh và gửi phản ánh nhanh không cần tạo tài khoản.
- **Thành phần chính**: Nút chụp ảnh có nén tự động, định vị GPS WGS84 tự động, chọn loại nguồn bụi, mô tả ngắn và nút **[Gửi phản ánh ngay]**.

### C03. Chi Tiết Vụ Việc & Minh Chứng Nghiệm Thu (`/citizen/reports/:id`)
- **Ai dùng**: Người dân đã gửi phản ánh muốn xem kết quả.
- **Họ vào làm gì**: Xem minh chứng Before/After và xác nhận xem công trường đã sạch bụi chưa.
- **Thành phần chính**:
  - Cột mốc tiến trình 7 bước (Tiếp nhận $\to$ Khảo sát $\to$ Khắc phục $\to$ Tái kiểm $\to$ Nghiệm thu).
  - Khung đối chứng ảnh Before (Lúc phát hiện) vs After (Sau khi xử lý) kèm mã băm SHA-256.
  - Kết luận tái kiểm của cán bộ (PM2.5 đã giảm về mức an toàn).

---

## 🛵 3. PHÂN HỆ CÁN BỘ HIỆN TRƯỜNG (3 Màn Hình — Mobile-First)

### S01. Danh Sách Việc Ca Trực Hôm Nay (`/staff`)
- **Ai dùng**: Thanh tra viên môi trường, cán bộ địa bàn đi xe máy.
- **Họ vào làm gì**: Trả lời ngay câu hỏi: *"Hôm nay tôi phải đi kiểm tra những đâu?"*.
- **Thành phần chính**:
  - Danh sách thẻ việc cần làm hôm nay (Sắp xếp theo hạn chót SLA và khoảng cách km gần nhất).
  - Phân loại rõ: *Cần khảo sát ban đầu* (Màu xanh) và *Cần tái kiểm sau 24h* (Màu cam).
  - Nút **[Mở nhiệm vụ]** to rõ $\ge 48\text{px}$.

### S02. Chi Tiết Nhiệm Vụ & Chỉ Đường (`/staff/tasks/:id`)
- **Ai dùng**: Cán bộ đang di chuyển trên đường.
- **Họ vào làm gì**: Xem địa chỉ chính xác, tên công trình và mở bản đồ dẫn đường.
- **Thành phần chính**: Tên công trình, địa chỉ, ảnh phản ánh ban đầu của dân, nút **[📍 Mở Google Maps Chỉ Đường]**, nút **[Bắt đầu kiểm tra tại hiện trường]**.

### S03. Khảo Sát / Tái Kiểm Thực Địa (`/staff/inspect/:id`)
- **Ai dùng**: Cán bộ đang đứng tại cổng công trường.
- **Họ vào làm gì**: Chụp ảnh bằng chứng, chấm checklist 10 tiêu chuẩn QCVN 18 và gửi kết luận.
- **Thành phần chính**:
  - Camera chụp ảnh hiện trường gắn GPS.
  - Checklist 10 tiêu chuẩn QCVN 18 (Tích chọn: Đạt / Cần sửa / Chưa đạt).
  - Nhập chỉ số PM2.5 đo được từ thiết bị di động.
  - Nút **[Gửi Biên Bản Khảo Sát]** hoặc **[Xác Nhận Nghiệm Thu Đạt]**.

---

## 🏗️ 4. PHÂN HỆ ĐƠN VỊ XỬ LÝ / NHÀ THẦU (2 Màn Hình)

### K01. Bàn Làm Việc Nhà Thầu (`/contractor`)
- **Ai dùng**: Chỉ huy trưởng công trường, đội trưởng thi công.
- **Họ vào làm gì**: Biết ngay: *"Công trình của tôi bị yêu cầu khắc phục những gì? Hạn khi nào?"*.
- **Thành phần chính**: Danh sách yêu cầu khắc phục đang mở (Biện pháp yêu cầu: Phun nước, quây bạt, rửa xe; Thời hạn SLA 24h đếm ngược; Nút **[Thực hiện & Nộp ảnh]**).

### K02. Nộp Ảnh Khắc Phục & Báo Hoàn Tất (`/contractor/tasks/:id`)
- **Ai dùng**: Kỹ sư phụ trách thi công sau khi đã dập bụi xong.
- **Họ vào làm gì**: Chụp ảnh After ngoài hiện trường để gửi cán bộ tái kiểm.
- **Thành phần chính**:
  - Yêu cầu kỹ thuật cần làm.
  - Khung chụp ảnh After (Tự động kiểm tra Geofence GPS $<50$m quanh dự án).
  - Tích chọn biện pháp đã hoàn tất (Đã quét đường, đã phun sương).
  - Nút **[Nộp Minh Chứng & Báo Hoàn Tất]**.

---

## 🏛️ 5. PHÂN HỆ ĐIỀU PHỐI & QUẢN TRỊ (5 Màn Hình)

### A01. Hộp Thư Điều Phối & Sức Khỏe Quy Trình (`/admin`)
- **Ai dùng**: Lãnh đạo, cán bộ trực trung tâm điều phối.
- **Họ vào làm gì**: Xem việc mới cần phân công, theo dõi các vụ việc sắp quá hạn SLA, phát hiện điểm nghẽn.
- **Thành phần chính**:
  - Hàng KPI sức khỏe quy trình: Vụ việc đang mở, Chờ tái kiểm, Quá hạn SLA, Tỷ lệ hoàn tất.
  - Inbox tiếp nhận: Tín hiệu mới từ dân & cảnh báo trạm đo $\to$ Nút 1-click **[Tạo vụ việc & Giao việc]**.

### A02. Trung Tâm Xử Lý Vụ Việc 1 Trang SSOT (`/admin/cases/:id`)
- **Ai dùng**: Admin điều phối toàn bộ vòng đời vụ việc.
- **Họ vào làm gì**: Quản lý toàn bộ 1 vụ việc trên 1 trang duy nhất không cần chuyển tab.
- **Thành phần chính**:
  - Header: Mã vụ việc, trạng thái màu, mức độ ưu tiên, hạn SLA.
  - Cột Trái: Vấn đề, Lý do cần chú ý (`NeedsAttentionReasons`), Bằng chứng đối chứng Before/After.
  - Cột Phải: Phân công cán bộ khảo sát, Giao nhà thầu xử lý, Duyệt đóng case, Nút **[In Biên Bản A4 Chuẩn NĐ 30/2020]**.
  - Chân trang: Dòng thời gian lịch sử tác nghiệp bất biến (Audit Trail).

### A03. Ma Trận Quan Trắc & Tín Hiệu Trạm Đo (`/admin/monitoring`)
- **Ai dùng**: Quản trị viên theo dõi mạng lưới cảm biến.
- **Họ vào làm gì**: Phát hiện trạm đo có nồng độ PM2.5/PM10 bất thường để kích hoạt quy trình điều phối.
- **Thành phần chính**: Bản đồ trạm đo, biểu đồ chuỗi thời gian 24h đối chiếu QCVN 05, danh sách trạm cảnh báo đỏ $\to$ Nút **[Mở Vụ Việc Xác Minh]**.

### A04. Quản Trị Người Dùng & Phân Quyền (`/admin/users`)
- **Ai dùng**: Quản trị viên hệ thống.
- **Họ vào làm gì**: Quản lý tài khoản cán bộ, nhà thầu và phân quyền RBAC 5 cấp an toàn.
- **Thành phần chính**: Bảng danh sách người dùng, chức năng đổi vai trò trực tiếp in-place, khóa tài khoản.

### A05. Cấu Hình Tham Số Hệ Thống (`/admin/settings`)
- **Ai dùng**: Quản trị viên kỹ thuật.
- **Họ vào làm gì**: Cấu hình các tham số quy chuẩn môi trường QCVN, thời hạn SLA, Webhook Zalo/Telegram.
- **Thành phần chính**: Form cấu hình ngưỡng bụi PM2.5/PM10, bán kính Geofence 50m, SLA 24h/48h.
