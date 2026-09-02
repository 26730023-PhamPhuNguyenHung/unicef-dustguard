# UI Consistency & Design System Audit — DustGuard VN

Kiểm toán giao diện theo 11 Nguyên Tắc Tối Thượng (Invariants):

| Tiêu chí | Quy định SSOT | Hiện trạng thực tế | Kết quả Audit |
|---|---|---|---|
| **Chủ đề màu & Độ tương phản** | Light-mode Civic Tech (`#FDFBF7` kem, `#231b14` mực, `#0d6f64` xanh ngọc, `#9f241f` đỏ son) | Đã triển khai toàn bộ tokens trong `index.css` và `design-system-tokens.test.js` | `PASS` |
| **Glassmorphism** | Tuyệt đối cấm `backdrop-blur-*`, không dùng nền trong suốt | Không có class `backdrop-blur` trên các trang tác nghiệp chính | `PASS` |
| **Kích thước Touch Target** | Tối thiểu $\ge 44\text{px}$ cho tất cả các nút bấm, tabs trên Mobile | Đã kiểm thử qua test `design-system-tokens.test.js` | `PASS` |
| **Chống che khuất chữ (Zero Truncate)** | Cấm `truncate`, `line-clamp` trên tên công trình, mã hồ sơ, nút CTA | Đã áp dụng `min-w-0`, `break-words`, `whitespace-nowrap` trên buttons | `PASS` |
| **Responsive Viewports** | 360px, 390px, 768px, 1366px, 1440px, 1920px | Zero horizontal scroll trên Mobile, menu không bị đè vỡ layout | `PASS` |
| **Typography** | Font chữ Be Vietnam Pro hỗ trợ đầy đủ dấu tiếng Việt | Đã nhúng tự động qua Google Fonts | `PASS` |
