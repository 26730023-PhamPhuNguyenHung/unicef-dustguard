# PUB-08 — Trang 404 Điều Hướng Khôi Phục

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `*` (Catch-all cho mọi đường dẫn không tồn tại)
- **Primary Role**: Toàn bộ người dùng (`all users`)
- **Secondary Roles**: Không có
- **Current Component**: `NotFound.jsx` (`app/src/modules/public/NotFound.jsx`)
- **Layout**: Minimal Public Layout
- **Primary Job**: Thông báo đường dẫn không tồn tại và hướng dẫn thông minh đưa người dùng quay trở lại không gian làm việc phù hợp với vai trò của mình.
- **Success Condition**: Người dùng không bị mắc kẹt, bấm nút điều hướng quay về trang chủ hoặc Dashboard của mình trong vòng 1 thao tác.

---

## 2. WHY THIS SCREEN EXISTS
- Xử lý các tình huống gõ sai URL, link cũ đã bị thay đổi hoặc truy cập trái phép. Thay vì màn hình trắng hoặc báo lỗi 404 khô khan, DustGuard cung cấp một điểm khôi phục trải nghiệm thân thiện và có định hướng.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Người dùng truy cập bất kỳ đường dẫn URL nào không có trong router.
- **Exit Points**:
  - Nút "Về không gian làm việc" $\rightarrow$ Điều hướng thông minh: Nếu là Staff $\rightarrow$ `/staff`, Citizen $\rightarrow$ `/citizen`, Contractor $\rightarrow$ `/contractor`, Public $\rightarrow$ `/`.
  - Nút "Xem bản đồ" $\rightarrow$ Mở `/map`.
- **Navigation Item**: Không có trong Menu chính.

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem trang 404** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Bấm nút quay về trang chủ** | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Truy cập nhầm URL /duong-dan-sai 
→ Thấy màn hình 404: "Trang không tìm thấy"
→ Đọc thông điệp thân thiện: "Đường dẫn bạn truy cập có thể đã được chuyển dời hoặc không tồn tại."
→ Thấy nút CTA chính tự động nhận diện vai trò: "QUAY VỀ BÀN LÀM VIỆC"
→ Bấm nút → Được đưa về trang an toàn ngay lập tức
```

---

## 6. INFORMATION HIERARCHY
1. **Error Code Visual**: Con số `404` to rõ cách điệu màu đỏ son `#9F241F`.
2. **Helpful Explanation Message**: Thông điệp ngắn gọn, trấn an người dùng không bị mất dữ liệu.
3. **Smart Navigation Actions (2 Nút Hành Động)**:
   - Nút chính: `Quay về trang chủ` (hoặc `Về bàn làm việc của bạn` nếu đã đăng nhập).
   - Nút phụ: `Xem bản đồ điểm nóng`.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Không Tìm Thấy Trang` (≤ 4 từ)
- **Primary CTA**: `Quay về an toàn` (≤ 4 từ)

---

## 8. DATA CONTRACT
- **Client Session Check**: Kiểm tra `session.role` trong context để điều hướng nút bấm về đúng phân hệ.

---

## 9. ACCEPTANCE CRITERIA
- [ ] Bắt toàn bộ các route không xác định (`path="*"`) mà không gây crash ứng dụng.
- [ ] Nút quay về chuyển đúng trang theo vai trò hiện tại của phiên làm việc.

---

## 10. IMPLEMENTATION STATUS
- **CURRENT**: Bắt route 404, hiển thị thông điệp thân thiện, nút điều hướng khôi phục.
- **PARTIAL**: Tự động gợi ý các trang gần giống với URL người dùng vừa gõ nhầm.
- **PROPOSED**: Ghi nhận mã URL lỗi vào bảng nhật ký để phát hiện broken link.
