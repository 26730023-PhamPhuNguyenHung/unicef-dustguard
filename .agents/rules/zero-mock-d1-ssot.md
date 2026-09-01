# Rule: Zero Mock & D1 SQLite SSOT

1. **D1 SQLite là Nguồn Chân Lý Duy Nhất (Single Source of Truth)**:
   - Tất cả dữ liệu thực thể (`sites`, `observations`, `cases`, `complaints`, `sensors`, `tasks`, `reports`, `notifications`, `audit_logs`, `handoffs`) đều đọc và ghi từ Cloudflare D1 / SQLite (`prisma/dev.db`).
   - Cấm dùng client localStorage làm CSDL lưu trữ chính.
2. **Cấm Tuyệt Đối Mock / Hardcode Data trong React UI Components (Zero Hardcode Fallbacks)**:
   - Tuyệt đối không chèn fake objects (`site = { ... }`, `tasks = [ ... ]`, `stats = { ... }`) trực tiếp trong file React UI (`useState` init, `else` branch, hoặc catch block của frontend component).
   - Mọi dữ liệu mẫu/seed data phục vụ kiểm thử và giao diện mẫu (Mockup 1 đến 10) **BẮT BUỘC PHẢI ĐƯỢC SEED VÀO `prisma/dev.db`** thông qua seed scripts (`app/scripts/seed-mockups-canonical-d1.mjs`).
   - Khi API gọi không thành công hoặc không có dữ liệu, hiển thị `ErrorState` kèm nút thử lại hoặc `EmptyState` chân thực từ hệ thống.
   - Luôn thiết kế frontend gọi API endpoint thật (`/api/staff/...`) kết nối trực tiếp đến bảng D1/SQLite tương ứng để việc migrate lên Cloudflare Production minh bạch và trơn tru 100%.
3. **Chuẩn Hóa Tọa Độ Không Gian (Spatial Normalization)**:
   - Dùng `server/domain/spatial/spatial-adapter.js` chuẩn hóa tọa độ WGS84 cho toàn bộ thực thể trả về.
   - Cấm dùng công thức sin/cos hay modulo để tạo tọa độ giả. Nếu entity không có GPS thật, trả về `lat: null, lng: null`.
