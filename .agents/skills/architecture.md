# Kỹ Năng Kiến Trúc (Architecture & Anti-Duplication) — DustGuard VN

> **Mục tiêu**: Bảo vệ tính toàn vẹn của cấu trúc ứng dụng, ngăn chặn phân mảnh mã nguồn, không tạo API/CSDL trùng lặp và duy trì nguồn chân lý duy nhất (SSOT).

---

## 1. Nguyên Tắc Vàng: Tái Sử Dụng Trước Khi Tạo Mới
```text
REUSE > EXTEND > REFACTOR > CREATE
(Tái sử dụng > Mở rộng > Cải tổ tối thiểu > Tạo mới)
```
- Mọi coding agent trước khi viết dòng code nào bắt buộc phải khảo sát cây thư mục hiện hữu.
- Tuyệt đối không tạo file mới nếu chức năng có thể tích hợp một cách tự nhiên vào module hiện có.

---

## 2. Các Vùng Ranh Giới Bất Khả Xâm Phạm (Architecture Boundaries)

### A. Ranh Giới Giao Diện Người Dùng (UI Boundaries)
- Điểm tập trung component dùng chung: `app/src/shared/components/` và `packages/ui`.
- Cấm tạo component `ButtonCustom`, `CustomCard`, `NewInput` độc lập trong từng trang nếu không có sự khác biệt cốt lõi về mặt kỹ thuật.

### B. Ranh Giới Dịch Vụ & API Client
- Sử dụng HTTP Client thống nhất: `app/src/lib/api/request.js`.
- Không gọi trực tiếp `fetch()` rời rạc trong các trang con mà không bọc qua cơ chế xử lý lỗi chuẩn và token injection.

### C. Ranh Giới Định Tuyến API Edge (Worker Routes)
- Định tuyến chính: `app/server/routes/worker/*.js`.
- Không tạo route trùng lặp (ví dụ: đã có `/api/staff/cases/:id/inspection` thì không tạo thêm `/api/inspection/submit`).

### D. Ranh Giới Cơ Sở Dữ Liệu D1
- Toàn bộ định nghĩa bảng tập trung tại `app/prisma/d1-schema.sql`.
- Cấm tạo bảng lưu trữ tạm thời hoặc tạo các bảng song song không liên kết khóa ngoại.

---

## 3. Quản Lý Nợ Kỹ Thuật (Technical Debt Governance)
- Không xóa các module cũ trong `legacy/` trừ khi có bằng chứng chắc chắn mã nguồn không còn được tham chiếu ở bất cứ đâu.
- Các đường dẫn cũ (như `/community`, `/app`) phải được chuyển hướng bằng `<Navigate replace />` để bảo toàn liên kết của người dùng cũ.
