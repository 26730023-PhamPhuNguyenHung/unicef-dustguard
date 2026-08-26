# Rule: Zero Mock & D1 SQLite SSOT

1. **D1 SQLite là Nguồn Chân Lý Duy Nhất (Single Source of Truth)**:
   - Tất cả dữ liệu thực thể (`sites`, `observations`, `cases`, `complaints`, `sensors`, `audit_logs`, `handoffs`) đều đọc và ghi từ Cloudflare D1 / SQLite (`prisma/dev.db`).
   - Cấm dùng client localStorage làm CSDL lưu trữ chính.
2. **Cấm Giả Lập Dữ Liệu trong Production Paths (Zero Mock)**:
   - Tuyệt đối không chèn fake objects (`doc-001`, fake cases, fake stats) trong catch blocks của API wrappers hay frontend components.
   - Khi API gặp lỗi, hiển thị `ErrorState` kèm nút thử lại; khi không có dữ liệu, hiển thị `EmptyState` chân thực.
3. **Chuẩn Hóa Tọa Độ Không Gian (Spatial Normalization)**:
   - Dùng `server/domain/spatial/spatial-adapter.js` chuẩn hóa tọa độ WGS84 cho toàn bộ thực thể trả về.
   - Cấm dùng công thức sin/cos hay modulo để tạo tọa độ giả. Nếu entity không có GPS thật, trả về `lat: null, lng: null`.
