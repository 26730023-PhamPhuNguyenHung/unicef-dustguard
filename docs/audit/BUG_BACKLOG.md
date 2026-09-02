# Bug Backlog & Continuous Quality Tracking — DustGuard VN

Danh sách các vấn đề được phát hiện trong quá trình Discovery và trạng thái xử lý:

| ID | Priority | Area | Problem | Root cause | Evidence | Proposed fix | Status |
|---|---|---|---|---|---|---|---|
| `P3-UI-001` | P3 | UI | Form field element warning trên console Staff (`A form field element should have an id or name attribute`) | Input tìm kiếm nhanh thiếu `name` hoặc `id` tường minh | Console message `msgid=17` trên `/staff` | Bổ sung thuộc tính `id="staff-search-input"` và `name="search"` cho input | RESOLVED |
| `P3-CT-002` | P3 | Auth | Client gọi `GET /api/auth/me` 2 lần khi vào route chưa đăng nhập gây 401 kép | `AuthContext` và `StaffLayout` đều kiểm tra session song song khi mount | Network request #35, #36 | Debounce hoặc chia sẻ kết quả Promise giữa các consumer của Auth hook | BACKLOG |
| `P4-UI-003` | P4 | Assets | `/favicon.ico` trả về 404 trên một số trình duyệt khi không khai báo thẻ `<link rel="icon">` | `index.html` thiếu fallback cho favicon chuẩn | Network request #50 | Bổ sung file `favicon.ico` vào thư mục `public/` | RESOLVED |
