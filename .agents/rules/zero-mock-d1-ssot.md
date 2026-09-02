# Rule: Zero Mock & D1 SQLite SSOT

1. **D1 SQLite là Nguồn Chân Lý Duy Nhất (Single Source of Truth - SSOT)**:
   - Tất cả dữ liệu thực thể nghiệp vụ (`sites`, `observations`, `cases`, `complaints`, `sensors`, `sensor_readings`, `tasks`, `task_timelines`, `reports`, `report_schedules`, `notifications`, `evidences`, `inspections`, `audit_logs`) **BẮT BUỘC ĐỌC VÀ GHI TRỰC TIẾP TỪ Cloudflare D1 / SQLite (`app/prisma/dev.db` / `env.DB`)**.
   - Cấm tuyệt đối dùng client localStorage làm CSDL lưu trữ chính.

2. **Cấm Tuyệt Đối Mock / Hardcode Data trong React UI Components (Zero Hardcode Fallbacks)**:
   - **Tuyệt đối cấm** chèn fake objects (`site = { ... }`, `tasks = [ ... ]`, `stats = { ... }`, `readings = [ ... ]`, `alerts = [ ... ]`) trực tiếp trong file React UI (`useState` initial state mang số ảo, `else` branch, hoặc `catch` block của frontend component).
   - **TẤT CẢ DỮ LIỆU MẪU / SEED DATA ĐỀU PHẢI ĐƯỢC SEED VÀO `dev.db`** thông qua seed scripts (`app/scripts/seed-mockups-canonical-d1.mjs` hoặc `prisma/seed.js` hoặc `schema-healer.js`).
   - Khi API gọi không thành công hoặc không có dữ liệu:
     + Hiển thị `LoadingState` khi đang tải.
     + Hiển thị `ErrorState` kèm nút "Thử lại" khi gặp lỗi mạng/máy chủ.
     + Hiển thị `EmptyState` chuẩn Civic High-Contrast ("Chưa có dữ liệu", "Không tìm thấy công trình phù hợp", "Chưa có nhiệm vụ cần làm"). **Tuyệt đối không gán fake object để che giấu lỗi**.
   - Frontend luôn gọi API endpoint thật (`/api/staff/...`) kết nối trực tiếp đến bảng D1/SQLite tương ứng để việc migrate lên Cloudflare Production minh bạch, dễ dàng và trơn tru 100%.

3. **Cấm Fake Fallbacks trong Backend API (Zero Backend Mock Returns)**:
   - Cấm dùng toán tử `||` với giá trị mặc định dạng `count || 128` (dẫn đến bug 0 bị coi là falsy và trả về số mock). Phải dùng `totalRow?.count ?? 0`.
   - Cấm trả về static mock arrays trong các nhánh `if (!items.length)` hoặc `COALESCE(..., 'Fake Name')`. Nếu CSDL rỗng, trả về mảng rỗng `[]` để frontend hiển thị EmptyState.

4. **Chuẩn Hóa Tọa Độ Không Gian WGS84 (Spatial Normalization)**:
   - Dùng `server/domain/spatial/spatial-adapter.js` chuẩn hóa tọa độ WGS84 EPSG:4326 cho toàn bộ thực thể.
   - Cấm dùng công thức sin/cos hay modulo để tạo tọa độ giả. Nếu entity chưa có GPS thật, trả về `lat: null, lng: null`.

