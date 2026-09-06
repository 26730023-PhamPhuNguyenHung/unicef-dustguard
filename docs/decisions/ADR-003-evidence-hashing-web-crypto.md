# ADR-003: NIÊM PHONG BẰNG CHỨNG SỐ BẰNG THUẬT TOÁN WEB CRYPTO SHA-256

- **Trạng thái**: Đã phê duyệt (Approved)
- **Ngày quyết định**: 05/09/2026
- **Tác giả**: Chuyên gia bảo mật & mật mã học DustGuard VN

---

## 1. Bối cảnh (Context)
Bằng chứng vi phạm môi trường và ảnh báo cáo khắc phục của đơn vị thi công thường xuyên phải đối mặt với nguy cơ bị chỉnh sửa, hoán đổi tệp, hoặc dùng ảnh chụp nơi khác để đối phó. Việc tạo chuỗi ngẫu nhiên bằng `Math.random()` để giả lập mã băm là hành vi gian lận kỹ thuật (Fake Security).

## 2. Quyết định (Decision)
Triển khai **Web Crypto SSOT chuẩn FIPS 180-4**:
1. Tính toán mã băm SHA-256 trực tiếp từ mảng byte nhị phân thực tế của tệp ngay tại thời điểm người dùng chọn ảnh (Client-side) và kiểm chứng lại tại Server (Server-side).
2. Lưu mã băm bất biến vào bảng `evidences` cùng với tọa độ GPS và thời điểm ghi nhận.
3. Thiết lập cơ chế **Tampered Evidence Detection**: Khi kiểm tra hồ sơ, hệ thống băm lại tệp tin trên đĩa; nếu sai lệch dù chỉ 1 bit, tệp bị đánh dấu ngay là `TAMPERED` và bị chốt chặn `ClosureSafetyGate` ngăn không cho đóng hồ sơ.

## 3. Lý do lựa chọn (Why)
- Tạo giá trị chứng cứ pháp lý vững chắc trước pháp luật.
- Bảo vệ doanh nghiệp thi công chân chính và bảo vệ tính trung thực của người dân.
- Hoàn toàn tự chủ, không phát sinh chi phí và không phụ thuộc vào blockchain hay dịch vụ bên thứ ba.

## 4. Hệ quả (Consequences)
- Tích cực: Độ tin cậy chứng cứ đạt chuẩn pháp lý cao; phát hiện ngay lập tức mọi hành vi sửa đổi ảnh.
- Cần kiểm soát: Xử lý hiển thị mã băm thân thiện (rút gọn 16 ký tự đầu kèm nút copy) để không gây rối mắt người dùng.
