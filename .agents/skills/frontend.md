# Kỹ Năng Frontend — DustGuard VN

> **Mục tiêu**: Hướng dẫn xây dựng và bảo trì giao diện người dùng trên React 19 + Vite + TailwindCSS tuân thủ chuẩn CivicTech, tương phản cao, không tràn ngang và không dùng glassmorphism.

---

## 1. Nguyên Tắc Cốt Lõi (Core Principles)
- **Zero Glassmorphism**: Tuyệt đối không dùng `backdrop-blur`, nền mờ hoặc viền mờ trong suốt. Dùng nền đặc: `#FDFBF7` (cream), `#FFFFFF` (white), `#F4EFE6` (subtle cream).
- **Tương Phản Cao (High Contrast)**: Nền sáng thì chữ phải đậm (`#231b14` ink / `#1c1917`), nền đậm thì chữ phải sáng (`#FFFFFF`).
- **Phản Hồi Thân Thiện (Zero Jargon)**: Nhãn nút từ 1–3 từ, tiếng Việt đời thường. Không đưa thuật ngữ lập trình lên màn hình người dùng.
- **Phòng Thủ Tràn Ngang (Defensive CSS)**:
  - Bọc vùng nội dung trong `min-w-0`, `break-words`.
  - Mọi container danh sách/thẻ dùng `w-full max-w-full overflow-hidden`.
  - Đảm bảo kiểm tra không có thanh cuộn ngang trên viewport `360px`, `375px`, `390px`.
- **Kích Thước Thao Tác (Touch Targets)**: Tất cả nút bấm, liên kết, checkbox, dropdown tab phải đạt chiều cao tối thiểu $\ge 44\text{px}$.

---

## 2. Tiêu Chuẩn Kết Nối API & Trạng Thái
- **Unwrap Dữ Liệu An Toàn**: Luôn phòng thủ dữ liệu rỗng:
  ```javascript
  const items = res?.data?.items || res?.data || [];
  ```
- **3 Trạng Thái Bắt Buộc**:
  - `LoadingState`: Spinner rõ ràng, không giật layout.
  - `EmptyState`: Minh họa rõ ràng bằng tiếng Việt kèm nút hành động chính (Dominant CTA).
  - `ErrorState`: Thông báo lỗi lịch sự, tiếng Việt đời thường, kèm nút "Thử lại".

---

## 3. Tái Sử Dụng Thành Phần (Reuse First)
- Dùng các components dùng chung trong `app/src/shared/components/`:
  - `SafeImage.jsx`: Xử lý ảnh lỗi, fallback mượt mà.
  - `StatusBadge.jsx`: Huy hiệu trạng thái tiêu chuẩn CivicTech.
  - `NextActionPanel.jsx`: Bảng điều hướng hành động tiếp theo cho cán bộ.
- Không tạo lại component Button hay Card tùy tiện ngoài design system.
