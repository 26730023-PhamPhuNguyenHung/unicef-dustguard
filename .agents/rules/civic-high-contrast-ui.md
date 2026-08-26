# Rule: Civic High-Contrast Light Mode UI (Zero Glassmorphism)

1. **Không Dùng Glassmorphism**:
   - Tuyệt đối cấm `backdrop-blur-*`, `bg-white/30`, nền mờ hoặc hiệu ứng kính làm giảm độ tương phản.
   - Nền card/panel phải là màu đặc: `#FFFFFF` hoặc `#FDFBF7`.
2. **Quy Tắc Tương Phản**:
   - Nền sáng (`#FDFBF7`, `#FFFFFF`) ➔ Chữ đậm (`#231B14`, `#0D6F64`, `#9F241F`).
   - Nền đậm (`#231B14`, `#0D6F64`, `#9F241F`) ➔ Chữ sáng (`#FFFFFF`, `#FDFBF7`).
3. **Diện Tích Chạm (Touch Targets)**:
   - Tất cả nút bấm hành động (CTA), tab điều hướng, radio/checkbox phải có kích thước tối thiểu `44px x 44px` (WCAG 2.2).
4. **Phông Chữ & Dấu Tiếng Việt**:
   - Line-height từ `1.5` đến `1.65` để tránh nghẹt các dấu hỏi, ngã, nặng trong tiếng Việt.
5. **Mobile Responsiveness (360px - 430px)**:
   - Root layout bọc `overflow-x-hidden`.
   - Flex containers bắt buộc dùng `min-w-0` để ngăn vỡ layout ngang.
   - Text quan trọng (tiêu đề, mã hồ sơ, hash) dùng `break-words`, không dùng `truncate`.
   - Modals trên di động hiển thị dạng Mobile Bottom Sheet sát đáy với `pb-safe`.
