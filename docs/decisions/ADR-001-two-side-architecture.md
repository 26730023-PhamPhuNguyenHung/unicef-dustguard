# ADR-001: KIẾN TRÚC HAI PHÍA ĐỘC LẬP (TWO-SIDE ARCHITECTURE)

- **Trạng thái**: Đã phê duyệt (Approved)
- **Ngày quyết định**: 05/09/2026
- **Tác giả**: Kiến trúc sư trưởng hệ thống DustGuard VN

---

## 1. Bối cảnh (Context)
Ban đầu, hệ thống được thiết kế như một ứng dụng web monolithic gộp chung 5 vai trò (Citizen, Staff, Contractor, Executive, Admin) trên cùng một cơ sở dữ liệu. Thiết kế này bộc lộ những rủi ro nghiêm trọng:
- Xung đột bảo mật: Rủi ro rò rỉ hồ sơ thanh tra mật hoặc ghi chú nội bộ sang tài khoản công dân.
- Xung đột hiệu năng: Lưu lượng gửi tin báo công dân lớn có thể gây nghẽn truy vấn của cán bộ thanh tra điều hành.
- Nhầm lẫn miền nghiệp vụ: `Report != Case`, `Community Case != Operations Case`.

## 2. Quyết định (Decision)
Tách dứt khoát toàn bộ hệ thống thành **Mô hình 2 Phía (Two-Side Architecture)** với 2 cơ sở dữ liệu vật lý riêng biệt:
1. **Side A (Cộng đồng & Công dân)**: CSDL `dustguard-community.db` (21 bảng) phục vụ công dân, thanh niên, CLB môi trường và cổng tự phục vụ của nhà thầu.
2. **Side B (Thanh tra & Vận hành Chuyên trách)**: CSDL `dustguard-operations.db` (41 bảng) phục vụ thanh tra, giám sát viên, thẩm định pháp chế và ban lãnh đạo.
3. Kết nối liên thông thông qua **Giao thức Handoff Idempotent Webhook** có ký xác thực `x-service-key: dustguard-internal-2026`.

## 3. Lý do lựa chọn (Why)
- Đảm bảo an toàn an ninh dữ liệu cấp cơ quan nhà nước: Dữ liệu công vụ được cô lập hoàn toàn.
- Khả năng mở rộng độc lập: Side A có thể chịu tải hàng chục nghìn lượt truy cập công dân mà không ảnh hưởng tới tiến trình thanh tra của Side B.
- Ranh giới trách nhiệm rõ ràng giữa cộng đồng phát hiện và cơ quan xử lý.

## 4. Các giải pháp thay thế đã xem xét (Alternatives)
- *Phương án dùng 1 DB chung với bảng phân quyền RBAC phức tạp*: Bị bác bỏ vì nguy cơ lỗi lập trình gây rò rỉ dữ liệu chéo rất cao.
- *Phương án tách Microservices 5-6 dịch vụ*: Bị bác bỏ vì quá phức tạp (Overengineering), khó vận hành trong điều kiện thực tế tại Việt Nam.

## 5. Hệ quả (Consequences)
- Tích cực: Độ an toàn bảo mật tuyệt đối, zero role leak, chuỗi kiểm toán độc lập.
- Cần kiểm soát: Phải duy trì hợp đồng giao thức webhook đồng bộ 2 chiều (`CROSS_SIDE_CONTRACT.md`).
