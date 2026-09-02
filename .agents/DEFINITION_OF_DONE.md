# DUSTGUARD VN — DEFINITION OF DONE (DoD)

> **Nguyên tắc cốt lõi**: `BUILD PASS != FEATURE PASS` | `TEST PASS != UX PASS`  
> Một tính năng hoặc sửa đổi chỉ được xem là **DONE** khi thỏa mãn đầy đủ các tiêu chí thực chứng (runtime evidence) dưới đây:

---

## 1. Bảng Kiểm Tra Thực Chứng (DoD Checklist)

```text
[ ] 1. Requirement Understood — Hiểu đúng mục tiêu người dùng và phân hệ (Citizen / Staff / Contractor / Admin / Executive).
[ ] 2. Existing Code Inspected — Đã đọc code hiện có trước khi sửa, không scan toàn bộ repo bừa bãi.
[ ] 3. No Duplicate Implementation — Không tạo component / service / schema mới nếu code cũ đã hỗ trợ.
[ ] 4. Frontend Connected — Đã nối giao diện với API client chuẩn, unwrap dữ liệu an toàn ([] / safe object).
[ ] 5. Backend & D1 Connected — API gọi đúng CSDL Cloudflare D1 SQLite thật (Zero mock trong core path).
[ ] 6. D1 Persistence Verified — Mọi đột biến (CREATE / UPDATE / DELETE) được lưu bền vững vào D1, reload không mất.
[ ] 7. Loading State — Có chỉ báo trạng thái đang tải mượt mà.
[ ] 8. Empty State — Có màn hình trống thân thiện khi danh sách/dữ liệu rỗng.
[ ] 9. Error State — Thông báo lỗi bằng tiếng Việt đời thường, dễ hiểu, không sập ứng dụng.
[ ] 10. Validation — Ràng buộc dữ liệu chặt chẽ ở cả Frontend và Backend.
[ ] 11. Mobile Checked — Hoạt động hoàn hảo trên 360px - 430px (touch target ≥ 44px, không tràn ngang).
[ ] 12. Console Clean — DevTools Console sạch 100%, không có lỗi đỏ, không unhandled promise.
[ ] 13. Network Clean — Không có request 4xx/5xx bất thường, không duplicate request, payload chuẩn.
[ ] 14. Relevant Tests Pass — Bộ kiểm thử liên quan chạy thành công 100% (Level 0 < 0.5s, Level 3 < 7s).
[ ] 15. Vietnamese Copy Reviewed — Ngôn từ ngắn gọn (Button 1-3 từ), đời thường, 0% developer jargon.
[ ] 16. Regression Checked & Committed — Đã kiểm tra không làm hỏng tính năng khác và micro-commit an toàn.
```

---

## 2. Tiêu Chuẩn Thực Chứng Đột Biến D1 (Mutation Oracle)

| Loại thao tác | Bằng chứng bắt buộc (Runtime Evidence) |
|---|---|
| **CREATE** | Tạo mới $\rightarrow$ F5 Reload $\rightarrow$ Bản ghi mới hiển thị chính xác trong danh sách. |
| **UPDATE** | Cập nhật $\rightarrow$ F5 Reload $\rightarrow$ Giá trị mới được lưu giữ nguyên vẹn. |
| **DELETE / CLOSE** | Xóa/Đóng hồ sơ $\rightarrow$ F5 Reload $\rightarrow$ Bản ghi biến mất hoặc chuyển trạng thái đóng. |

---

## 3. Quy Tắc Báo Cáo Hoàn Thành

- **CẤM** tuyên bố DONE chỉ dựa trên `npm run build` hoặc pass test tĩnh.
- **BẮT BUỘC** chỉ ra bằng chứng: màn hình đã chạy, API đã gọi, D1 đã persist và DevTools console sạch sẽ.
