# LOCAL DB FIRST DEVELOPMENT SSOT RULE

> **Chính Sách Phát Triển**: 100% Local SQLite First (`app/prisma/dev.db` & better-sqlite3).
> **Nguyên tắc**: Trong quá trình phát triển tính năng, kiểm thử và hoàn thiện hệ thống, toàn bộ backend và frontend chạy trực tiếp 100% trên Local SQLite CSDL thật. Khi hệ thống hoàn thiện đầy đủ 100% và qua toàn bộ kiểm thử mới thực hiện đồng bộ / migration lên Cloudflare D1 Production.

---

## 1. Core Directives
1. **SSOT Local Database**: Mọi dữ liệu (Sites, Cases, Alerts, Tasks, Users, Telemetry) đọc/ghi trực tiếp vào file SQLite `app/prisma/dev.db`.
2. **Không Mock trong UI**: Tuyệt đối không dùng mảng hardcode fake trong component. Mọi dữ liệu hiển thị phải query từ Local SQLite DB thông qua API.
3. **Đồng Bộ Số Liệu KPI**: Các thẻ KPI (Tổng công trình, Hồ sơ, Nhiệm vụ) phải phản ánh đúng `COUNT(*)` thực tế từ bảng SQLite, không hardcode số ảo (như 128) khi DB chỉ có 38 bản ghi.
4. **Phân Trang Động**: Tính toán số trang `totalPages = Math.ceil(total / limit)` dựa trên số lượng bản ghi thực tế trong SQLite.
5. **D1 Production Sync**: Chỉ thực hiện `npx wrangler d1 execute ... --remote` khi toàn bộ hệ thống đã hoàn thiện 100% và được người dùng phê duyệt.
