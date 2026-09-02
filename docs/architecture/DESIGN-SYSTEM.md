# DESIGN-SYSTEM.md — Civic High-Contrast Design System & UI SSOT

> Hệ quy chuẩn thiết kế giao diện thân thiện, sáng rõ, tối ưu cho tiếp cận cộng đồng (Civic Tech) và môi trường ngoài trời.

---

## 🎨 1. Core Civic Tech Palette

| Token Tên | Mã Màu HEX | Ứng Dụng Nghiệp Vụ | Tương Phản |
|---|---|---|---|
| `--bg-cream-50` | `#FDFBF7` | Nền toàn trang, sạch sẽ, không chói mắt | Nền sáng chuẩn |
| `--text-ink-900` | `#231B14` | Chữ văn bản chính, độ tương phản cực cao | AAA trên nền kem |
| `--seal-red-600` | `#9F241F` | Nút hành động chính (Ghi nhận mới, Báo cáo khẩn, Dấu mộc) | Tương phản cao |
| `--teal-600` | `#0D6F64` | Nhãn tích cực, đã khắc phục, tín chỉ xanh | AA / AAA |
| `--amber-500` | `#D97706` | Cảnh báo ưu tiên P2, cần theo dõi thêm | AA |
| `--slate-200` | `#E2E8F0` | Viền phân cách rõ nét (1px solid), không mờ nhòe | Chuẩn |

---

## 🚫 2. Bất Biến Thiết Kế (Zero-Violation Rules)
1. **Tuyệt đối KHÔNG Glassmorphism**: Cấm hoàn toàn class `backdrop-blur-*`, `bg-white/20` gây mờ ảo khó đọc trên mobile và thiết bị ngoài nắng.
2. **Quy tắc Tương phản Tuyệt đối**: Nền sáng bắt buộc chữ đậm (`#231B14`), Nền đậm bắt buộc chữ sáng (`#FFFFFF`).
3. **Mobile Touch Target $\ge 44\text{px}$**: Mọi nút bấm, tab điều hướng, form input đều có chiều cao tối thiểu 44px để thao tác bằng ngón tay ngoài hiện trường.
4. **Defensive CSS Tránh Rớt Chữ & Vỡ Bảng**:
   - Sử dụng `min-w-0` trên tất cả các khối flexbox con.
   - Thêm `break-words` trên tiêu đề vụ việc và mô tả.
   - Cấm áp dụng `overflow: hidden; text-overflow: ellipsis` vô tội vạ làm biến mất thông tin trọng yếu.

---

## 📊 3. DataTable SSOT Standard
- **Desktop**: Bảng rộng rãi, sticky header, phân chia rõ ràng các cột (Mã, Hiện trường, Vị trí, Điểm ưu tiên, Trạng thái, Thao tác).
- **Mobile (< 768px)**: Tự động chuyển đổi giao diện sang dạng Card List trực quan với cùng dữ liệu nguồn từ D1.
