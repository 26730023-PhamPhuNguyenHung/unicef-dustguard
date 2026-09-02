# Kỹ Năng Kiểm Thử Trình Duyệt & DevTools — DustGuard VN

> **Mục tiêu**: Hướng dẫn kiểm chứng trực quan đa thiết bị bằng Playwright và DevTools MCP, phát hiện lỗi console, sập trang, lỗi tải tài nguyên và tràn layout trước khi tuyên bố DONE.

---

## 1. 4 Kích Thước Viewport Chuẩn (Responsive Matrix)

Mọi màn hình thay đổi phải được kiểm tra trên ít nhất 4 độ phân giải:
1. **375x812** (iPhone Mini / SE / Mobile Tiêu chuẩn) — Kiểm tra không tràn ngang (`overflow-x`), nút bấm và thẻ nằm gọn gàng.
2. **390x844** (iPhone 13/14 / Android Phổ biến) — Kiểm tra trải nghiệm vuốt chạm 1 tay.
3. **768x1024** (iPad Mini / Tablet) — Kiểm tra grid chuyển đổi linh hoạt giữa 1 cột và 2 cột.
4. **1440x900** (Desktop / Laptop) — Kiểm tra bố cục đầy đủ, sidebar, bảng biểu và thanh điều hướng.

---

## 2. Tiêu Chí Thất Bại Ngay Lập Tức (Immediate Quality Gate Failures)
Quá trình kiểm thử trình duyệt sẽ bị đánh giá **FAIL** nếu phát hiện bất kỳ dấu hiệu nào sau đây:
- Xuất hiện **Uncaught TypeError** hoặc biệt lệ màu đỏ trong Console (`page.on('pageerror')`).
- Xuất hiện màn hình trắng (Blank Screen) hoặc nội dung rỗng (`rootHtml.length === 0`).
- Nút bấm chính (CTA) bị ẩn, không bấm được, hoặc bấm vào nhưng không có phản hồi thị giác.
- Xuất hiện thanh cuộn ngang không mong muốn trên thiết bị di động (Ngoại trừ bảng số liệu cho phép cuộn ngang có chủ đích).
- Dữ liệu sau khi nộp thành công biến mất sau khi người dùng bấm F5 Reload.
- Thông báo lỗi hiển thị mã code thô (ví dụ: `HTTP 500`, `ECONNREFUSED`, `null pointer`) thay vì thông điệp tiếng Việt đời thường.

---

## 3. Quy Trình Vận Hành Với Playwright & DevTools
1. Khởi động máy chủ ứng dụng (Vite preview hoặc Vite dev + Worker backend).
2. Khởi tạo Chromium / MS Edge với ngữ cảnh ngôn ngữ `vi-VN`.
3. Bơm thông tin phiên đăng nhập giả lập (Mock Auth Session) vào `localStorage`.
4. Điều hướng tới route cần kiểm tra, lắng nghe sự kiện mạng và console.
5. Thực hiện chuỗi hành vi của người dùng (Click $\to$ Điền form $\to$ Nộp $\to$ Kiểm tra kết quả $\to$ Reload).
6. Ghi nhận log và ảnh chụp màn hình minh chứng vào thư mục `reports/`.
