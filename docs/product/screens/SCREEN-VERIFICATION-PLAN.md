# SCREEN-VERIFICATION-PLAN — QUY TRÌNH KIỂM THỬ VÀ NGHIỆM THU 31 MÀN HÌNH

> **Cập nhật**: 2026-09-02 | **Mục đích**: Tập trung toàn bộ quy chuẩn kiểm thử kỹ thuật, lệnh CLI, test levels và DevTools MCP vào một tài liệu duy nhất, giữ cho 31 Screen Specifications tinh gọn và đúng chuẩn Product Contract.

---

## 1. 5 TẦNG KIỂM THỬ NHANH (HIGH-VELOCITY 5-TIER PIPELINE)

| Tầng Kiểm Thử | Mục Đích | Lệnh PowerShell CLI | Thời Gian Chuẩn |
|---|---|---|:---:|
| **Level 0 (Targeted)** | Chạy test đơn lẻ cho file vừa chỉnh sửa | `node --test app/tests/<target>.test.js` | `< 0.5s` |
| **Level 1 (Changed)** | Chạy các test bị ảnh hưởng bởi git change | `npm --prefix app run verify:changed` | `< 3s` |
| **Level 2 (Domain)** | Chạy test theo phân hệ nghiệp vụ (`staff`, `citizen`, `contractor`, `auth`) | `npm --prefix app run verify:domain -- <domain>` | `< 5s` |
| **Level 3 (Quick Gate)** | Gate kiểm thử bắt buộc trước khi commit/bàn giao task | `npm --prefix app run verify:quick` | `< 7s` |
| **Level 4 (Full Release)** | Chạy toàn bộ test suite trước khi phát hành lớn | `npm --prefix app run verify` | `< 15s` |

---

## 2. QUY CHUẨN KIỂM THỬ TRỰC QUAN GIAO DIỆN (DEVTOOLS MCP & VIEWPORT)

Mọi màn hình phải được nghiệm thu trên 4 kích thước màn hình chuẩn:
1. **Desktop 14-inch Baseline (1366 × 768)**:
   - Sidebar cố định, không che khuất bảng tác nghiệp.
   - Nội dung quan trọng (Primary Status & Primary CTA) nằm trọn trong vùng Above-the-fold.
   - Không xuất hiện thanh cuộn ngang ngoài ý muốn.
2. **Desktop Tiêu Chuẩn (1920 × 1080)**:
   - Layout co giãn hợp lý, không bị kéo giãn quá mức (max-width container phù hợp).
3. **Mobile Nhỏ (360 × 640 / 375 × 667)**:
   - Toàn bộ touch target $\ge 44\text{px}$.
   - Bảng chuyển đổi thành dạng danh sách thẻ (Cards).
   - Menu gom vào Bottom Navigation hoặc Drawer.
4. **Mobile Lớn (414 × 896 / 430 × 932)**:
   - Không vỡ layout, ảnh minh chứng hiển thị sắc nét.

---

## 3. CHECKLIST NGHIỆM THU KỸ THUẬT CHO MỖI MÀN HÌNH (SMOKE CRITERIA)

Mỗi màn hình khi triển khai code phải thỏa mãn:
- [ ] Render thành công không gây lỗi console (`console.error = 0`).
- [ ] Đọc dữ liệu từ D1 SQLite / REST API thật (Zero mock data trong catch blocks).
- [ ] Unwrap collection an toàn theo chuẩn `api-data-contract-normalization.md`.
- [ ] Tuân thủ bảng màu High-Contrast (Nền sáng `#FDFBF7`, chữ đậm `#231B14`, không glassmorphism).
- [ ] Không dùng `truncate` làm mất mã hồ sơ, tên công trình hay địa chỉ.
- [ ] Đạt chuẩn khả năng tiếp cận (Accessibility WCAG AA).
