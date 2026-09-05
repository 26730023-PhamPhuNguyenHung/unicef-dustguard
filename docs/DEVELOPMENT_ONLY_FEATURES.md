# DUSTGUARD VN — DEVELOPMENT & PILOT FEATURES
> **Nguyên tắc**: Không tạo tính năng giả (fake features), không hiển thị luồng chết. Các năng lực đang trong quá trình thử nghiệm hoặc chờ kết nối phần cứng/cơ quan nhà nước phải được công bố minh bạch.

---

## BẢNG QUẢN LÝ TÍNH NĂNG ĐANG PHÁT TRIỂN / THỬ NGHIỆM (FEATURE GATING)

| Tính năng (Feature) | Lý do chưa mở Production đầy đủ | Giới hạn kỹ thuật hiện tại | Trạng thái hiển thị người dùng (User-Facing State) | Lộ trình hoàn thiện tiếp theo (Next Implementation) |
|---|---|---|---|---|
| **Mạng lưới Cảm biến Quan trắc Bụi IoT Realtime** | Thiết bị phần cứng ESP32 + APM2000 đang trong giai đoạn thử nghiệm pilot tại hiện trường, chưa lắp đặt diện rộng toàn đô thị. | Endpoint `/api/iot/ingest` đã hoàn tất chữ ký HMAC-SHA256 và phát hiện Flatline; dữ liệu phụ thuộc vào thiết bị mẫu thử nghiệm. | Hiển thị badge `"Thử nghiệm Hiện trường (Hardware Pilot)"`. Không sinh dữ liệu giả `Math.random()`. | Hoàn tất đóng gói bo mạch bảo vệ IP65, tích hợp module 4G LTE và triển khai thử nghiệm tại 5 công trình trọng điểm. |
| **Trợ lý Phân tích Pháp lý Chuyên sâu (Legal AI)** | Tránh ảo giác pháp lý (hallucination), bảo đảm tính chuẩn xác tuyệt đối khi lập hồ sơ xử phạt vi phạm hành chính. | Đã triển khai hoàn tất bộ quy tắc chuyên gia (Deterministic Rule Engine) kết hợp truy vấn toàn văn SQLite FTS5 trên Luật BVMT 2020 và NĐ 45/2022. | Hiển thị banner `"Hỗ trợ Tham khảo Kỹ thuật - Không thay thế kết luận của Cán bộ thụ lý"`. | Đào tạo mô hình ngôn ngữ nhỏ (SLM) cục bộ chạy on-premise trên tập dữ liệu án lệ và tiền lệ xử phạt môi trường đã làm sạch. |
| **Kết nối Trực tiếp Cổng Dịch vụ Công Quốc gia / eGov** | Cần quy trình thẩm định an toàn thông tin và cấp mã định danh liên thông từ cơ quan quản lý nhà nước. | Luồng bàn giao hiện tại hoạt động thông qua Idempotent Webhook chuẩn REST (`POST /api/integrations/community/cases`) sang Cổng Nghiệp vụ Chuyên trách. | Hiển thị `"Bàn giao sang Đơn vị Chuyên trách qua Cổng Vận hành Nội bộ (Port 3002)"`. | Đăng ký kiểm thử liên thông dữ liệu qua Trục liên thông văn bản quốc gia (VDXP) theo chuẩn e-Cabinet / e-Gov. |
