# ADR-002: PHÂN TÁCH 4 TẦNG LƯU TRỮ (D1/SQLITE, R2, LOCALSTORAGE, MEMORY)

- **Trạng thái**: Đã phê duyệt (Approved)
- **Ngày quyết định**: 05/09/2026
- **Tác giả**: Kỹ sư dữ liệu trưởng DustGuard VN

---

## 1. Bối cảnh (Context)
Trong các phiên bản thử nghiệm ban đầu, nhiều trang web đã lạm dụng `localStorage` để lưu trữ dữ liệu nghiệp vụ quan trọng (như checklist kiểm tra, bằng chứng hiện trường) hoặc hiển thị dữ liệu giả định cứng trong code. Điều này vi phạm nguyên tắc sống còn: **Mutations Must Persist** và gây hiện tượng mất dữ liệu khi đổi thiết bị.

## 2. Quyết định (Decision)
Phân định dứt khoát trách nhiệm của 4 tầng lưu trữ trong toàn hệ thống:
1. **Database (SQLite SSOT / Cloudflare D1)**: Nguồn chân lý duy nhất cho toàn bộ dữ liệu có cấu trúc, quan hệ, trạng thái hồ sơ, quyền hạn và nhật ký kiểm toán.
2. **Object Storage (Cloudflare R2 / Local Disk Uploads)**: Lưu trữ các tệp lớn phi cấu trúc (ảnh chụp hiện trường, tài liệu PDF, chứng nhận).
3. **Client LocalStorage**: **TUYỆT ĐỐI KHÔNG DÙNG LÀM DATABASE CHÍNH**. Chỉ sử dụng cho: bản nháp biểu mẫu chưa gửi (Draft Autosave), token xác thực phiên, và tùy chọn hiển thị ngôn ngữ.
4. **Memory (RAM / React State)**: Lưu trữ trạng thái giao diện tức thời.

## 3. Lý do lựa chọn (Why)
- Ngăn chặn triệt để hiện tượng mất dữ liệu công dân hoặc báo cáo thanh tra.
- Giữ cho cơ sở dữ liệu SQLite/D1 luôn tinh gọn, truy vấn nhanh dưới 15ms.
- Giảm thiểu tối đa chi phí truyền tải dữ liệu (R2 zero-egress fee).

## 4. Hệ quả (Consequences)
- Tích cực: Hệ thống đạt chuẩn Zero-Mock; mọi thao tác thêm/sửa/xóa đều được lưu vết bền vững.
- Cần kiểm soát: Phải có cơ chế tự hủy bản nháp trên LocalStorage ngay sau khi gửi thành công lên server.
