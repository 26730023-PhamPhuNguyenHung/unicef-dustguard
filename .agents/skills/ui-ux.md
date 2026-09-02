# Kỹ Năng Kiểm Toán UI/UX (UI/UX Auditor) — DustGuard VN

> **Mục tiêu**: Kiểm toán chất lượng trải nghiệm giao diện người dùng trên ứng dụng thật đang chạy (running screen), phát hiện các khiếm khuyết bố cục, sự cố tràn dòng và rào cản thao tác.

---

## 1. 4 Trụ Cột Kiểm Toán Trực Quan (4 Visual Pillars)

### A. Bố Cục (Layout & Space)
- Phân cấp thị giác rõ ràng: Tiêu đề H1 > Thẻ thông tin > Hành động phụ.
- Khoảng cách nhịp nhàng (Padding/Margin theo bội số của 4px hoặc 8px).
- Bắt buộc kiểm tra tràn viền ngang (`overflow-x`) trên các thiết bị màn hình hẹp (360px - 390px).

### B. Nội Dung (Content & Copy)
- Không có văn bản dài vô tận không ngắt dòng.
- Không lặp lại cùng một thông tin ở nhiều vị trí trong 1 viewport.
- Loại bỏ từ viết tắt khó hiểu, từ ngữ chuyên ngành IT/database.
- Nhãn nút ngắn gọn (1–3 từ) mang tính hành động cụ thể.

### C. Tương Tác (Interaction & Affordance)
- Nút bấm chính (CTA) có màu sắc nổi bật rõ rệt so với các nút phụ.
- Thao tác xóa/hủy mang tính rủi ro cao phải dùng màu cảnh báo (Đỏ/Cam) và có bước xác nhận bảo vệ.
- Phản hồi tức thì khi bấm nút (Loading indicator / Toast thông báo).
- Touch target đạt chuẩn $\ge 44\text{px}$ cho toàn bộ phần tử tương tác.

### D. Ưu Tiên Di Động (Mobile-First Reality)
- Đối với phân hệ Công dân (Citizen), Cán bộ (Staff) và Nhà thầu (Contractor), di động là môi trường hoạt động chính.
- Mọi thiết kế chỉ chạy tốt trên màn hình máy tính lớn (Desktop-only assumptions) đều bị coi là **Lỗi Nghiệp Vụ (Defect)**.

---

## 2. Thang Điểm Đánh Giá Vị Nhân Sinh (Human-Centric Score 0–100)

| Tiêu chí thành phần | Trọng số | Điểm tối đa |
|---|---|---|
| **Rõ ràng mục tiêu & 4 câu hỏi định vị** | 15% | 15 |
| **Giảm tải nhận thức & Ngôn từ không Jargon** | 20% | 20 |
| **Hành động ưu tiên rõ ràng (Dominant CTA)** | 15% | 15 |
| **Bố cục & Không tràn viền di động (375px)** | 20% | 20 |
| **Touch targets $\ge 44\text{px}$ & Dễ chạm bằng ngón cái** | 15% | 15 |
| **Phản hồi trạng thái (Loading, Empty, Error, Toast)** | 15% | 15 |
| **Tổng cộng** | **100%** | **100** |

> ⚠️ **Quy tắc chặn cứng**: Bất kể điểm số đạt bao nhiêu, nếu tồn tại **1 lỗi chặn nghiệm thu** (ví dụ: màn hình trắng, nút bấm chính không hoạt động, chữ bị che mất, dữ liệu reload bị mất), kết quả vẫn là **FAIL**.
