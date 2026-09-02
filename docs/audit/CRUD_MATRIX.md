# CRUD Reality Matrix — DustGuard VN

Kiểm toán tính khả thi thực tế của các thao tác CRUD đối với các thực thể chính:

| Entity | CREATE | READ LIST | READ DETAIL | UPDATE | DELETE / ARCHIVE | Persistence Verified? | Refresh Retained? |
|---|---|---|---|---|---|---|---|
| **Observations** | YES (`POST /api/complaints`) | YES (`GET /api/community/observations`) | YES (`GET /api/community/observations/:id`) | YES (Thêm cập nhật theo dõi) | YES (Hủy bản nháp) | D1 SQLite `observations` | YES |
| **Cases** | YES (`POST /api/cases`) | YES (`GET /api/cases`) | YES (`GET /api/cases/:id`) | YES (`POST /api/cases/:id/verify`) | YES (Đóng hồ sơ / Lưu kho) | D1 SQLite `cases` | YES |
| **Sites** | YES (`POST /api/sites`) | YES (`GET /api/sites`) | YES (`GET /api/sites/:id`) | YES (`PUT /api/sites/:id`) | YES (Chuyển trạng thái ngưng) | D1 SQLite `sites` | YES |
| **Tasks / Actions** | YES (`POST /api/actions`) | YES (`GET /api/actions`) | YES (`GET /api/actions/:id`) | YES (`POST /api/actions/:id/verify`) | YES (Xóa nhiệm vụ) | D1 SQLite `actions` | YES |
| **Sensors** | YES (`POST /api/sensors`) | YES (`GET /api/sensors`) | YES (`GET /api/sensors/:id`) | YES (`PUT /api/sensors/:id`) | YES (Hủy đăng ký trạm) | D1 SQLite `sensors` | YES |
| **Youth Credits** | YES (`POST /api/community/youth/claim`) | YES (`GET /api/community/youth/stats`) | YES (`GET /api/youth/certificate/:code`) | YES (Tích lũy giờ mới) | NO (Bất biến / Ký số) | D1 SQLite `youth_certificates` | YES |
| **Users** | YES (`POST /api/admin/users`) | YES (`GET /api/admin/users`) | YES (`GET /api/admin/users/:id`) | YES (`PUT /api/admin/users/:id`) | YES (Khóa / Xóa tài khoản) | D1 SQLite `users` | YES |
