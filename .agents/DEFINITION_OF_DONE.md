# DUSTGUARD VN — DEFINITION OF DONE (DoD)

> **Nguyên tắc cốt lõi**: `BUILD PASS != FEATURE PASS` | `TEST PASS != PRODUCT PASS`  
> Một tính năng hoặc sửa đổi chỉ được xem là **DONE** khi thỏa mãn đầy đủ 22 tiêu chí thực chứng (runtime evidence) dưới đây. Không một agent nào được phép đóng task nếu còn tiêu chí bị bỏ qua.

---

## 1. Bảng Kiểm Tra Thực Chứng 22 Tiêu Chí (DoD Master Checklist)

```text
[ ] 01. Current implementation inspected — Đã khảo sát kỹ code hiện có trước khi sửa, không scan bừa bãi.
[ ] 02. Relevant spec exists — Đã có bản đặc tả tính năng tương ứng trong thư mục specs/.
[ ] 03. Acceptance criteria defined — Đã định nghĩa các tiêu chí nghiệm thu khách quan, đo lường được.
[ ] 04. No duplicate feature introduced — Tái sử dụng tối đa, không tạo tính năng/component/API trùng lặp.
[ ] 05. Frontend works — Giao diện React hiển thị đúng, tương phản cao, không dùng glassmorphism.
[ ] 06. Backend works — API Hono Worker xử lý chính xác, trả về dữ liệu đúng chuẩn RFC 7807 khi lỗi.
[ ] 07. D1 persistence works — Dữ liệu được ghi nhận vào CSDL D1 SQLite thật (Zero-mock).
[ ] 08. Authorization checked — Phân quyền theo vai trò (Citizen/Staff/Contractor/Admin/Executive) chặt chẽ.
[ ] 09. Validation checked — Ràng buộc dữ liệu đầu vào chặt chẽ ở cả Frontend và Backend.
[ ] 10. Loading state checked — Có trạng thái chờ trực quan, không giật màn hình khi fetch dữ liệu.
[ ] 11. Empty state checked — Màn hình rỗng thân thiện, có thông báo tiếng Việt và nút bấm hành động chính.
[ ] 12. Error state checked — Thông báo lỗi tiếng Việt đời thường, không sập trang, có nút Thử lại.
[ ] 13. Mobile checked — Đạt chuẩn trên 375px/390px (touch target ≥ 44px, không tràn viền ngang).
[ ] 14. Console checked — DevTools Console sạch 100%, 0 lỗi đỏ Uncaught TypeError / Unhandled Promise.
[ ] 15. Network checked — Không có request 4xx/5xx bất thường, không duplicate API call.
[ ] 16. Relevant tests pass — Bộ kiểm thử mục tiêu chạy đạt 100% (< 0.5s cho Level 0, < 7s cho Level 3).
[ ] 17. Mutation persists after reload — Bấm F5 tải lại trang, dữ liệu thêm/sửa/xóa vẫn bảo toàn nguyên vẹn.
[ ] 18. Vietnamese copy reviewed — Nút bấm 1-3 từ, 0% thuật ngữ kỹ thuật khó hiểu với người dân/cán bộ.
[ ] 19. Human-centric review completed — Đạt tiêu chuẩn vị nhân sinh (4 câu hỏi định vị, thao tác 1 tay).
[ ] 20. Regressions checked — Đã chạy test hồi quy nhanh, không gây lỗi lan truyền sang màn hình khác.
[ ] 21. Git diff inspected — Rà soát git diff, thay đổi mang tính phẫu thuật chính xác, gọn gàng.
[ ] 22. Debug artifacts removed — Đã dọn dẹp toàn bộ console.log rác, biến test tạm và file nháp.
```

---

## 2. Tiêu Chuẩn Thực Chứng Đột Biến D1 (Mutation Oracle)

| Loại thao tác | Bằng chứng bắt buộc (Runtime Evidence) |
|---|---|
| **CREATE** | Tạo mới $\rightarrow$ F5 Reload $\rightarrow$ Bản ghi mới hiển thị chính xác trong danh sách và CSDL D1. |
| **UPDATE** | Cập nhật $\rightarrow$ F5 Reload $\rightarrow$ Giá trị mới được lưu giữ nguyên vẹn trong CSDL D1. |
| **DELETE / CLOSE** | Xóa/Đóng hồ sơ $\rightarrow$ F5 Reload $\rightarrow$ Bản ghi biến mất hoặc chuyển trạng thái đóng trong CSDL D1. |

---

## 3. Quy Tắc Báo Cáo Nghiệm Thu
- **CẤM** tuyên bố DONE chỉ dựa trên `npm run build` hoặc pass test tĩnh.
- **BẮT BUỘC** chỉ ra bằng chứng rõ ràng: Màn hình đã chạy trên cổng nào, API nào đã được gọi, bản ghi nào đã được ghi vào D1, và DevTools Console ghi nhận bao nhiêu lỗi (phải là 0).
