# [Tên Tính Năng / Feature Name]

## 1. Người Dùng (User Persona)
- **Đối tượng**: Cán bộ hiện trường (Staff) / Người dân (Citizen) / Nhà thầu (Contractor) / Quản trị (Admin) / Chỉ huy (Executive).
- **Ngữ cảnh sử dụng**: Thao tác ngoài hiện trường trên điện thoại / Văn phòng trên máy tính.

## 2. Mục Tiêu Của Người Dùng (User Goal)
- Giải quyết vấn đề gì trong thực tế đô thị? Người dùng muốn đạt được kết quả gì sau khi hoàn thành thao tác?

## 3. Điểm Vào Giao Diện (Entry Point)
- **Đường dẫn Route**: `/path/to/feature`
- **Thành phần kích hoạt**: Nút bấm trên thanh điều hướng, bảng danh sách hoặc liên kết trực tiếp.

## 4. Hành Trình Người Dùng (User Journey)
1. Bước 1: Người dùng truy cập màn hình ...
2. Bước 2: Người dùng xem xét thông tin ...
3. Bước 3: Người dùng thực hiện thao tác chính (Click CTA) ...
4. Bước 4: Hệ thống xác thực và cập nhật trạng thái ...
5. Bước 5: Người dùng nhận thông báo thành công và thấy kết quả phản ánh tức thì.

## 5. Dữ Liệu Đọc (Data Read)
- Bảng CSDL D1: `table_name`
- Các trường bắt buộc: `id`, `status`, `title`, ...

## 6. Dữ Liệu Ghi Nhận (Data Written)
- Bảng CSDL D1: `table_name`
- Hành động: `INSERT` / `UPDATE` / `DELETE`
- Dữ liệu đột biến: Trường nào thay đổi, giá trị mới là gì.

## 7. Giao Tiếp API (API Endpoints)
- `GET /api/...`: Lấy dữ liệu hiển thị.
- `POST /api/...`: Ghi nhận đột biến.
- Định dạng phản hồi: `{ success: true, data: { ... } }`

## 8. Phân Quyền & Ràng Buộc (Permissions & RBAC)
- Vai trò được phép: `FIELD_STAFF`, `ADMIN`, ...
- Cơ chế từ chối khi không có quyền: Trả về HTTP 403 RFC 7807 Problem Details.

## 9. Luồng Thành Công (Happy Path)
- Mô tả chi tiết kịch bản lý tưởng từ đầu đến cuối.

## 10. Luồng Xử Lý Lỗi (Failure Paths & Edge Cases)
- Mất kết nối mạng: Hiển thị thông báo thân thiện, cho phép lưu nháp hoặc thử lại.
- Tệp ảnh quá lớn (> 5MB): Báo lỗi ngay tại client trước khi gửi lên server.
- Bản ghi không tồn tại (404): Điều hướng về trang danh sách kèm toast giải thích.

## 11. Yếu Tố Di Động (Mobile Considerations)
- Đảm bảo kiểm tra trên viewport `375px` và `390px`.
- Không xuất hiện thanh cuộn ngang ngoài ý muốn (`overflow-x`).
- Kích thước chạm (Touch target) $\ge 44\text{px}$.

## 12. Yếu Tố Vị Nhân Sinh (Human-Centric Considerations)
- Nhãn nút bấm từ 1–3 từ, tiếng Việt đời thường.
- Tuyệt đối không hiển thị mã lỗi kỹ thuật hoặc thuật ngữ trừu tượng.
- Trả lời nhanh 4 câu hỏi: Tôi đang ở đâu? Cần làm gì? Trạng thái gì? Bước tiếp theo là gì?

## 13. Tiêu Chí Nghiệm Thu Khách Quan (Acceptance Criteria)
Mọi tiêu chí phải đo lường được bằng code test hoặc DevTools, ví dụ:
- [ ] **AC-1**: Khi truy cập trên viewport 375x812, toàn bộ nội dung hiển thị trong khung, không có thanh cuộn ngang.
- [ ] **AC-2**: Nút hành động chính (Dominant CTA) có chiều cao tối thiểu $\ge 44\text{px}$ và có màu sắc phân biệt rõ rệt.
- [ ] **AC-3**: Gửi form tải ảnh minh chứng ghi nhận bản ghi mới trong bảng `case_evidences` của D1 SQLite.
- [ ] **AC-4**: Bấm F5 Reload, bản ghi vừa thêm vẫn hiển thị nguyên vẹn kèm ảnh minh chứng.
- [ ] **AC-5**: DevTools Console không xuất hiện bất kỳ ngoại lệ đỏ Uncaught TypeError nào trong suốt hành trình.
