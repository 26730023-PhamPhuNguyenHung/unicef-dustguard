# DUSTGUARD VN — PRODUCTION FEATURE MATRIX (BẢNG CHÂN LÝ TÍNH NĂNG)
> **Ngày phê duyệt**: 2026-09-05  
> **Nguyên tắc**: Chỉ công nhận READY khi có bằng chứng chạy thật trên runtime (Zero Fake, Zero Mock).

---

| Tính năng (Feature) | Phân hệ (Side) | Trạng thái (Status) | Bằng chứng kiểm thử thực tế (Evidence) |
|---|---|---|---|
| **Landing Page 2 Phía** | Chung | **READY** | Kiểm thử trực quan đa màn hình (`1440x900`, `1366x768`, `390x844`), 0 horizontal scroll, Hero CTA above-the-fold. |
| **Cổng Đăng nhập 2 Phía** | Chung | **READY** | Phân luồng độc lập Side A & Side B, bảo toàn deep-link và redirect theo năng lực. |
| **Đăng ký / Đăng nhập Cộng đồng** | Side A | **READY** | Tạo tài khoản, lưu trữ mật khẩu mã hóa, cấp phát JWT và khôi phục phiên sau khi tải lại trang. |
| **Gửi Phản ánh Môi trường** | Side A | **READY** | Thu thập tọa độ GPS, mã băm SHA-256 thật từ nhị phân file (`crypto.ts`), lưu trữ CSDL `reports`. |
| **Hàng đợi & Xác minh Phản ánh** | Side A | **READY** | Moderator duyệt phản ánh, gộp tín hiệu hoặc khởi tạo vụ việc mới `DG-C-2026-9874`. |
| **Bảng Điều phối Vụ việc (Kanban)** | Side A | **READY** | Hiển thị 5 cột trạng thái trực quan, cập nhật mốc tiến độ thời gian thực. |
| **Bàn giao Chuyên trách (Handoff)** | Side A $\to$ B | **READY** | Webhook Idempotent tự động kích hoạt khi chuyển sang `forwarded`, lưu vết `integration_logs`. |
| **Bàn làm việc Tiếp nhận Vụ việc** | Side B | **READY** | Hiển thị tức thời hồ sơ nhận từ Cộng đồng, bộ lọc 10 trạng thái hoạt động chính xác. |
| **Phân công Cán bộ Thụ lý** | Side B | **READY** | Kiểm soát quyền `case:assign` phía máy chủ (chỉ Supervisor/Admin), chuyển trạng thái sang `ASSIGNED`. |
| **Ban hành Yêu cầu Khắc phục** | Side B | **READY** | Tạo nhiệm vụ có thời hạn SLA 48h cho đơn vị thi công, lưu trữ bảng `corrective_actions`. |
| **Nộp & Nghiệm thu Khắc phục** | Side B | **READY** | Nhà thầu nộp báo cáo khắc phục, cán bộ nghiệm thu chuyển trạng thái sang `READY_TO_CLOSE`. |
| **Tra cứu Pháp lý SQLite FTS5** | Side B | **READY** | Tìm kiếm toàn văn trên Luật BVMT 2020, Nghị định 45/2022/NĐ-CP và Thông tư 02/2022. |
| **Thẩm tra Pháp lý Bắt buộc** | Side B | **READY** | Invariant Gate: Chặn đóng hồ sơ khi thiếu ý kiến thẩm tra; cho phép đóng khi chuyên viên hoàn tất thẩm định. |
| **Ký Quyết định Đóng Vụ việc** | Side B | **READY** | Supervisor ký quyết định đóng hồ sơ, ghi nhận nguyên nhân đóng, tóm tắt kết quả và lưu vết audit log. |
| **Mạng lưới Cảm biến Quan trắc IoT** | Side B | **PILOT** | Gắn nhãn `"Thử nghiệm Hiện trường (Hardware Pilot)"`, cơ chế xác thực HMAC-SHA256 và phát hiện Flatline hoạt động. |
| **Tự động hóa Cảnh báo Quá hạn** | Side B | **READY** | Background job quét các hồ sơ quá hạn SLA 48h và gửi thông báo nhắc nhở tự động. |
| **Quản trị Phân quyền RBAC** | Side B | **READY** | Bảo vệ nghiêm ngặt 38 permissions tại middleware máy chủ, không thể bypass qua frontend. |
