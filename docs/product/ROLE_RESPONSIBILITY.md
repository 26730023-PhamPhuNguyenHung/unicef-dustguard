# Role Responsibility Matrix — DustGuard VN

## 1. Role: Public / Guest
- **Trách nhiệm chính**: Tiếp cận thông tin ô nhiễm môi trường công khai, tra cứu bản đồ nhiệt và kiểm tra tính hợp lệ của chứng chỉ thanh niên qua mã QR.
- **Màn hình chính**: `/`, `/map`, `/youth`, `/guide`, `/demo`, `/login`
- **Được phép**: Xem bản đồ, tìm kiếm công trình, nộp phản ánh nhanh không cần tạo tài khoản, quét mã QR.
- **Không được phép**: Chỉnh sửa dữ liệu công trình, can thiệp hồ sơ vụ việc, xem nhật ký kiểm toán.

---

## 2. Role: Citizen / Youth
- **Trách nhiệm chính**: Giám sát hiện trường, phát hiện hành vi gây ô nhiễm bụi, nộp ảnh bằng chứng SHA-256 và tích lũy giờ tình nguyện môi trường.
- **Màn hình chính**: `/citizen`, `/citizen/report/new`, `/citizen/reports`, `/citizen/reports/:id`, `/citizen/profile`
- **Được phép**: Tạo phản ánh kèm ảnh và tọa độ GPS, theo dõi tiến độ xử lý, bổ sung cập nhật (follow-up), xuất chứng chỉ tín chỉ điện tử.
- **Không được phép**: Đóng hồ sơ vụ việc, thay đổi điểm rủi ro $R$, xem dữ liệu cá nhân của người dân khác.

---

## 3. Role: Staff / Inspector
- **Trách nhiệm chính**: Thụ lý hồ sơ vụ việc qua 7 bước chuẩn DAG, khảo sát hiện trường, giao nhiệm vụ khắc phục cho nhà thầu và xuất quyết định hành chính chuẩn NĐ 30/2020.
- **Màn hình chính**: 12 màn hình `/staff/*`
- **Được phép**: Tiếp nhận phản ánh, chuyển trạng thái 7 bước, phê duyệt minh chứng Trước/Sau, ra quyết định xử phạt, xem ma trận cảm biến và cảnh báo.
- **Không được phép**: Xóa vĩnh viễn dữ liệu hệ thống, can thiệp mã băm kiểm toán.

---

## 4. Role: Contractor
- **Trách nhiệm chính**: Tiếp nhận yêu cầu khắc phục vi phạm từ thanh tra, thực hiện xử lý tại hiện trường trong vòng Geofence $le 50	ext{m}$ và nộp bộ ảnh Before/After.
- **Màn hình chính**: `/contractor`, `/contractor/tasks`, `/contractor/cases`, `/contractor/reports`
- **Được phép**: Xem nhiệm vụ được giao, nộp ảnh chụp hiện trường, gửi giải trình, xem lịch sử khắc phục của công trình mình phụ trách.
- **Không được phép**: Tự duyệt hoàn thành nhiệm vụ, xem thông tin nội bộ của thanh tra.

---

## 5. Role: Admin / Executive
- **Trách nhiệm chính**: Quản trị tài khoản, cấu hình tham số rủi ro, theo dõi toàn vẹn cơ sở dữ liệu D1 và ban hành các chính sách kiểm soát môi trường đô thị.
- **Màn hình chính**: `/admin`, `/admin/users`, `/admin/settings`, `/staff/reports`
- **Được phép**: Toàn quyền cấu hình hệ thống, quản lý người dùng, khôi phục dữ liệu mẫu demo, ký duyệt văn bản điện tử cấp cao.
