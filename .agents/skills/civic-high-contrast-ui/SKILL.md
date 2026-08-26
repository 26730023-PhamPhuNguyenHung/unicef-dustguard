---
name: civic-high-contrast-ui
description: Thiết kế và kiểm tra giao diện Civic Tech chuẩn tiếp cận, tương phản cao, sáng màu, tuyệt đối không dùng glassmorphism, đảm bảo touch targets tối thiểu 44px và responsive hoàn hảo từ 360px đến desktop.
---

# Skill: Civic High-Contrast UI & Design System

## Khi nào sử dụng
- Khi tạo mới hoặc refactor components, layouts, pages, modals.
- Khi điều chỉnh màu sắc, khoảng cách (spacing), typography, badges, cards, buttons.
- Khi kiểm tra tính tương thích trên thiết bị di động (360px - 430px) và desktop.

## Bảng Màu Civic Tech SSOT (High-Contrast Light Mode)
| Vai trò | Mã Hex | Tên gọi | Ứng dụng |
|---|---|---|---|
| **Nền chính (Background)** | `#FDFBF7` | Warm Cream | Nền ứng dụng, trang chủ, modal container |
| **Nền Card / Panel** | `#FFFFFF` | Pure White | Thẻ thông tin, form, bảng dữ liệu |
| **Chữ chính (Text Dark)** | `#231B14` | Deep Ink | Tiêu đề, nội dung chính, nhãn form (độ tương phản > 7:1) |
| **Chữ phụ (Text Muted)** | `#524336` / `#667085` | Muted Charcoal | Thời gian, mô tả phụ, gợi ý |
| **Chủ đạo 1 (Teal Primary)** | `#0D6F64` | Civic Teal | Nút hành động chính, trạng thái Đang xử lý / Đạt chuẩn |
| **Chủ đạo 2 (Seal Red)** | `#9F241F` | Official Seal Red | Cảnh báo khẩn cấp P1, nút Ghi nhận mới, con dấu số |
| **Cảnh báo (Amber)** | `#B45309` | Warning Amber | Mức độ cảnh giác cao P2, quá hạn xử lý soft SLA |
| **Đường viền (Border)** | `#E7DFD3` / `#D0C7B8` | Warm Sand Border | Viền card, phân cách bảng, border input |

## 10 Quy tắc Thiết kế Bắt buộc (Mandatory UI Invariants)
1. **Tuyệt đối KHÔNG Glassmorphism**: Cấm dùng `backdrop-blur-*`, `bg-white/30`, nền mờ ảo gây khó đọc. Nền phải đặc (`#FFFFFF` hoặc `#FDFBF7`), viền rõ ràng.
2. **Quy tắc Tương phản Tuyệt đối**:
   - Nền sáng (`#FDFBF7`, `#FFFFFF`) -> Chữ đậm (`#231B14`, `#0D6F64`, `#9F241F`).
   - Nền đậm (`#231B14`, `#0D6F64`, `#9F241F`) -> Chữ sáng (`#FFFFFF`, `#FDFBF7`).
3. **Touch Target Chuẩn WCAG 2.2**: Mọi nút bấm, tab, checkbox, radio phải có diện tích chạm tối thiểu `min-h-[44px]` và `min-w-[44px]`.
4. **Dòng Tiếng Việt (Vietnamese Typography)**: Line-height từ `1.5` đến `1.65` để tránh nghẹt dấu tiếng Việt (Hỏi, Ngã, Nặng).
5. **Mobile-First Responsive (360px - 430px)**:
   - Dùng `overflow-x-hidden` trên root layout.
   - Luôn kèm `min-w-0` trên flex children để chống tràn ngang (no horizontal overflow).
   - Dùng `break-words` trên tiêu đề dài, mã hồ sơ, hash SHA-256 (không truncate làm mất thông tin quan trọng).
6. **Mobile Bottom Sheet cho Modals**: Trên mobile hiển thị dạng sheet từ đáy màn hình (`fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4`, bo góc đỉnh `rounded-t-2xl`, có padding an toàn `pb-safe`).
7. **Canonical UI Primitives (`app/src/components/ui/`)**:
   - Luôn dùng `Button`, `Card`, `StatusBadge`, `MetricCard`, `FormField`, `Input`, `Select`, `Tabs`, `EmptyState`, `LoadingState`, `Modal`, `Toast`.
   - Không tự viết badge phân mảnh (`StatusChip`, `ComplaintStatusChip` cũ).
8. **Nút Hành Động Rõ Ràng & Đơn Giản**: Tối đa 3 từ cho nhãn nút CTA (Ví dụ: `Ghi nhận mới`, `Tiếp nhận`, `Ký duyệt`, `Nghiệm thu`).
9. **Card Footer Khóa Đáy**: Dùng `mt-auto` trên card footer để các hàng thẻ trong grid luôn thẳng hàng đều đặn.
10. **Toast Feedback Toàn Cục**: Mọi tương tác gửi form, ký duyệt, lưu dữ liệu đều phải có Toast thông báo kết quả (Success, Error, Warning).

## Lệnh Kiểm Tra UI
```powershell
node --test app/tests/design-system-ui-components-audit.test.js
node --test app/tests/mobile-layout-audit.test.js
```
