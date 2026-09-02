# SCREEN-STATE-MATRIX — MÔ HÌNH TRẠNG THÁI GIAO DIỆN (UI STATE MODEL)

> **Cập nhật**: 2026-09-02 | **Quy chuẩn UX**: High-Contrast Light Mode | **Không Glassmorphism** | **Zero Unhandled States**

---

## 1. NGUYÊN TẮC 6 TRẠNG THÁI BẮT BUỘC CHO MỖI MÀN HÌNH

Mọi màn hình trong DustGuard VN bắt buộc phải xử lý trọn vẹn 6 trạng thái giao diện:
1. **Loading State**: Hiển thị Skeleton hoặc Spinner rõ nét (màu đỏ son `#9F241F` / kem `#FDFBF7`), không làm giật bố cục (Zero CLS).
2. **Empty State**: Khi không có dữ liệu bản ghi, hiển thị thông điệp ngắn gọn, icon chỉ dẫn và nút hành động kêu gọi (CTA) rõ ràng.
3. **Error State**: Bắt lỗi HTTP/Network thân thiện (RFC 7807 problem format), có nút "Thử lại" (`Retry`), không hiện code stack trace cho người dùng phổ thông.
4. **Permission Denied State**: Thông báo không đủ quyền truy cập, hiển thị nút quay về Dashboard phù hợp hoặc chuyển sang màn hình Đăng nhập.
5. **Partial Data State**: Khi dữ liệu bị thiếu trường tùy chọn (ảnh chưa có, tọa độ chưa định vị, chưa gán cán bộ), hiển thị fallback rõ ràng thay vì để trống hoặc crash.
6. **Success / Feedback State**: Sau khi thực hiện mutation (tạo phản ánh, nộp ảnh đối chứng, chuyển bước), hiển thị Toast/Banner thông báo thành công và cập nhật lại dữ liệu ngay lập tức.

---

## 2. MA TRẬN TRẠNG THÁI THEO TỪNG NHÓM PHÂN HỆ

| Nhóm Phân Hệ | Loading Skeleton | Empty State Handling | Error State & Retry | Partial Data Fallback | Success Notification |
|---|---|---|---|---|---|
| **Public (8 màn)** | Card Skeleton 3 hàng | "Hiện chưa có dữ liệu quan trắc cho khu vực này" | Banner cảnh báo + Nút "Tải lại dữ liệu" | Ẩn badge phụ, hiển thị giá trị mặc định | Toast thông báo sao chép/chuyển vai trò |
| **Citizen (5 màn)** | List Item Skeleton (ảnh + 2 dòng chữ) | "Bạn chưa có phản ánh nào. Gửi ngay phản ánh đầu tiên!" kèm nút CTA lớn $\ge 44\text{px}$ | Thông báo lỗi kết nối + Lưu nháp form offline tạm | Fallback ảnh mặc định nếu không có ảnh đối chứng | Modal xác nhận mã hồ sơ + nút "Xem tiến độ" |
| **Staff (11 màn)** | Table Skeleton 5 dòng / Metric Chips Skeleton | "Không có vụ việc nào cần xử lý trong ca trực hiện tại" | Lỗi truy vấn D1 + Nút tải lại tức thì | Badge "Chưa phân công" màu xám nhạt | Toast xanh lá "Đã chuyển bước thành công" |
| **Contractor (4 màn)** | Task Card Skeleton | "Không có yêu cầu khắc phục nào đang chờ xử lý" | Báo lỗi tải file minh chứng + Nút thử lại | Cảnh báo "Chưa nộp ảnh Trước/Sau" | Banner xanh "Đã gửi minh chứng thành công" |
| **Admin (3 màn)** | Metric / User Table Skeleton | "Không tìm thấy người dùng phù hợp với bộ lọc" | Lỗi phân quyền hệ thống | Hiển thị role mặc định `citizen` | Toast xác nhận "Đã cập nhật vai trò người dùng" |
