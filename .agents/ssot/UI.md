# UI DESIGN SYSTEM SSOT — CIVIC-TECH HIGH-CONTRAST

## 1. Triết lý Thiết kế Cốt lõi (Core Principles)
- **Sáng màu (Light Mode First)**: Màu nền chuẩn là kem `#FDFBF7` (`--color-bg-canvas`) kết hợp thẻ trắng `#FFFFFF` (`--color-bg-surface`).
- **High-contrast Typography**: Chữ màu mực `#231b14` (`--color-text-primary`) trên nền sáng, đạt chuẩn AAA tương phản văn bản, rõ ràng dưới ánh nắng trực tiếp.
- **Tuyệt đối KHÔNG Glassmorphism**: Không sử dụng `backdrop-blur`, không nền bán trong suốt gây mờ chữ. Thẻ Card dùng nền đặc (`bg-white`), viền nét rõ ràng (`border border-ink-900/10`).
- **Nền Đậm thì Chữ Sáng - Nền Sáng thì Chữ Đậm**: Đảm bảo phân tầng thị giác trực quan, không dùng độ trong suốt làm giảm độ sắc nét.
- **Quy tắc Nút Bấm SSOT (Button Contract: Nền Đỏ Chữ Trắng)**:
  - **Primary CTA / Nút chính (`.btn-primary`)**: Bắt buộc nền Đỏ Con Dấu (`#B51F24` / `#9f241f`), chữ **TRẮNG TINH (`#FFFFFF`)**, viền sẫm (`#8E161A`), hover sang đỏ đậm hơn (`#8E161A`) và chữ vẫn giữ trắng `#FFFFFF`. Tuyệt đối không để chữ tối màu trên nền đỏ hoặc nền trắng đục đè lên chữ.
  - **Secondary CTA / Nút phụ (`.btn-secondary`)**: Nền trắng (`#FFFFFF`), chữ mực đậm (`#171312`), viền nét (`border border-ink-900/15`), hover sang nền kem sáng (`#F8F7F4`).
- **Touch Target Chuẩn WCAG 2.2**: Mọi nút bấm, ô nhập liệu, tab di động có diện tích chạm tối thiểu 44px x 44px (`min-h-[44px] min-w-[44px]`).

---

## 2. Bảng Semantic Tokens & CSS Variables SSOT

### A. Nền & Bề mặt (Background / Surfaces)
| Token Variable | Tailwind Utility | Hex Code | Ứng dụng |
| :--- | :--- | :--- | :--- |
| `--color-bg-canvas` | `bg-bg-canvas` / `bg-cream-50` | `#FDFBF7` | Nền canvas toàn trang |
| `--color-bg-surface` | `bg-bg-surface` / `bg-white` | `#FFFFFF` | Nền Card, Modal, Sheet, Hộp văn bản |
| `--color-bg-subtle` | `bg-bg-subtle` / `bg-cream-100` | `#F8F1E2` | Sidebar, Filter bar, Header phụ |
| `--color-bg-muted` | `bg-bg-muted` / `bg-cream-200` | `#EFE3CB` | Nền divider, input disabled, khu vực trung tính |

### B. Kiểu chữ & Mực (Typography / Ink)
| Token Variable | Tailwind Utility | Hex Code | Ứng dụng |
| :--- | :--- | :--- | :--- |
| `--color-text-primary` | `text-text-primary` / `text-ink-900` | `#231b14` | Tiêu đề chính, văn bản cốt lõi (100% tương phản) |
| `--color-text-secondary` | `text-text-secondary` / `text-ink-500` | `#6b6056` | Đoạn mô tả, thông tin phụ trợ |
| `--color-text-muted` | `text-text-muted` / `text-ink-300` | `#a89e93` | Label, ngày tháng, placeholder, metadata |

### C. Thương hiệu & Hành động (Brand & Action DustGuard Red)
| Token Variable | Tailwind Utility | Hex Code | Ứng dụng |
| :--- | :--- | :--- | :--- |
| `--color-brand-primary` | `bg-brand-primary` / `bg-seal-500` | `#9f241f` | Nút CTA chính, Tab đang active, Điểm nhấn thương hiệu |
| `--color-brand-hover` | `bg-brand-hover` / `bg-seal-600` | `#7f1d1a` | Trạng thái Hover của nút chính |
| `--color-brand-active` | `bg-brand-active` / `bg-seal-700` | `#5f1513` | Trạng thái Active/Pressed của nút chính |
| `--color-brand-soft` | `bg-brand-soft` / `bg-seal-50` | `#fdecea` | Nền nhẹ của thẻ/badge thương hiệu |
| `--color-brand-border` | `border-brand-border` / `border-seal-100` | `#f9c6c4` | Viền nhẹ của thẻ/badge thương hiệu |
| `--color-action-primary` | `bg-action-primary` / `bg-seal-500` | `#9f241f` | Hành động chính toàn hệ thống |

### D. Trạng thái & Mức độ (Feedback & Severity)
| Token Variable | Tailwind Utility | Hex Code | Ứng dụng |
| :--- | :--- | :--- | :--- |
| `--color-danger` | `text-danger` / `bg-seal-500` | `#9f241f` | Cảnh báo nghiêm trọng, Vi phạm, Con dấu đỏ pháp lý |
| `--color-danger-hover` | `bg-seal-600` | `#7f1d1a` | Hover trạng thái nguy hiểm |
| `--color-warning` | `text-warning` / `bg-warning-700` | `#b54708` | Cảnh báo mức độ trung bình, Cần theo dõi |
| `--color-warning-hover` | `bg-warning-800` | `#93370d` | Hover cảnh báo |
| `--color-success` | `text-success` / `bg-success-700` | `#027a48` | Thành công, Xác thực hoàn tất, Tốt hơn |
| `--color-success-hover` | `bg-success-800` | `#05603a` | Hover thành công |

### E. Vòng đời Vấn đề (Status Flow Semantic Tokens)
| Trạng thái | Token Màu Text/Icon | Token Màu Nền Badge | Token Viền Badge |
| :--- | :--- | :--- | :--- |
| **Mở / Đang chờ (Open)** | `--color-status-open` (`#b54708`) | `--color-status-open-bg` (`#fffaeb`) | `--color-status-open-border` (`#fedf89`) |
| **Đang theo dõi (Follow-up)** | `--color-status-followup` (`#026aa2`) | `--color-status-followup-bg` (`#f0f9ff`) | `--color-status-followup-border` (`#b9e6fe`) |
| **Chuyển giao (Handoff)** | `--color-status-handoff` (`#7a5af8`) | `--color-status-handoff-bg` (`#f9f5ff`) | `--color-status-handoff-border` (`#d8b4fe`) |
| **Đã xử lý (Resolved)** | `--color-status-resolved` (`#027a48`) | `--color-status-resolved-bg` (`#ecfdf3`) | `--color-status-resolved-border` (`#a6f4c5`) |

---

## 3. Thang Typography Chuẩn (Typography Scale)

| Token Key | Tailwind Class | Kích thước Font | Line Height | Khuyến nghị Trọng lượng |
| :--- | :--- | :--- | :--- | :--- |
| `display` | `text-display` | `3rem` (48px) | `1.15` | `font-bold` (Hero banner, số liệu lớn) |
| `h1` | `text-h1` / `text-heading-1` | `2.25rem` (36px) | `1.2` | `font-bold` (Tiêu đề trang) |
| `h2` | `text-h2` / `text-heading-2` | `1.875rem` (30px) | `1.25` | `font-semibold` (Tiêu đề khối/section) |
| `h3` | `text-h3` / `text-heading-3` | `1.5rem` (24px) | `1.3` | `font-semibold` (Tiêu đề card lớn, modal) |
| `title` | `text-title` | `1.25rem` (20px) | `1.4` | `font-medium` / `font-semibold` |
| `body` | `text-body` | `1rem` (16px) | `1.5` | `font-normal` (Đoạn văn tiêu chuẩn) |
| `body-sm` | `text-body-sm` / `text-label` | `0.875rem` (14px) | `1.5` | `font-normal` / `font-medium` |
| `caption` | `text-caption` | `0.75rem` (12px) | `1.4` | `font-normal` (Ghi chú nhỏ, timestamp) |

---

## 4. Đổ bóng Rõ nét (Crisp Civic Shadows)

Tuyệt đối **KHÔNG sử dụng glassmorphism**, không dùng hiệu ứng mờ nhòe backdrop đục ngầu. Tất cả bóng đổ sử dụng tông mực ink với alpha thấp để tạo độ nổi khối rõ ràng:

- `--shadow-card`: `0 1px 3px rgba(35, 27, 20, 0.06), 0 1px 2px rgba(35, 27, 20, 0.04)` (Thẻ mặc định phẳng)
- `--shadow-soft`: `0 4px 12px rgba(35, 27, 20, 0.05)` (Thẻ tương tác hover, list item)
- `--shadow-elevation`: `0 10px 24px -4px rgba(35, 27, 20, 0.08)` (Dropdown, Floating action bar, Popover)
- `--shadow-modal`: `0 20px 25px -5px rgba(35, 27, 20, 0.1), 0 8px 10px -6px rgba(35, 27, 20, 0.1)` (Modal dialog)

---

## 5. Phân vùng Responsive Breakpoints

- **Mobile (360px - 430px)**:
  - Giao diện 1 cột tối giản.
  - Thanh Bottom Navigation cố định dưới cùng (`pb-safe`).
  - Nút bấm và vùng chạm chuẩn tối thiểu 44px x 44px.
  - Wizard đa bước chia nhỏ từng thao tác ghi nhận / theo dõi.
- **Tablet (768px - 1024px)**:
  - Bố cục lưới 2 cột.
  - Tích hợp bảng danh sách song song bản đồ rút gọn.
- **Desktop (1024px+)**:
  - Bố cục lưới 3 - 4 cột đầy đủ.
  - Bảng điều khiển tác nghiệp chi tiết, bộ lọc đa tiêu chí, workspace văn bản pháp lý A4 trực quan.
