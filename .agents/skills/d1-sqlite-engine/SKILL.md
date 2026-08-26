---
name: d1-sqlite-engine
description: Thao tác cơ sở dữ liệu Cloudflare D1 / SQLite SSOT, tối ưu hóa truy vấn spatial WGS84, quản lý migrations, composite indexes và đảm bảo nguyên tắc Zero-Mock.
---

# Skill: Cloudflare D1 / SQLite Engine & Spatial SSOT

## Khi nào sử dụng
- Khi viết hoặc chỉnh sửa các câu truy vấn cơ sở dữ liệu D1 SQLite / Prisma.
- Khi thêm hoặc sửa migrations trong `migrations/` hoặc `prisma/d1-schema.sql`.
- Khi xử lý dữ liệu tọa độ không gian WGS84 (`latitude`, `longitude`, `coordinates`, Geofence 50m).
- Khi tối ưu hóa hiệu năng truy vấn qua composite indexes.

## Nguyên tắc Cốt lõi (Invariants)
1. **D1 SQLite là SSOT Bất Biến**: Database thật tại `prisma/dev.db` (local) và Cloudflare D1 (`env.DB`). Không dùng client localStorage làm database.
2. **Zero Mock trong Repositories**: Không bao giờ hardcode fallback fake entities (`doc-001`, fake cases) trong catch blocks.
3. **Spatial Normalization**: Luôn sử dụng canonical `app/server/domain/spatial/spatial-adapter.js` để parse, serialize và chuẩn hóa tọa độ WGS84.
4. **JSON Columns Serialization**: Các cột JSON trong SQLite/D1 (`findings`, `metadata`, `components`, `reasons`) phải được parse an toàn `JSON.parse()` khi đọc và `JSON.stringify()` khi ghi.

## Quy trình Thực thi Chuẩn
1. **Kiểm tra Schema & Indexes**:
   - Schema chuẩn tại `app/prisma/d1-schema.sql`.
   - Các index không gian và SLA bắt buộc: `idx_sites_spatial`, `idx_sensors_spatial`, `idx_complaints_spatial`, `idx_observations_spatial`, `idx_cases_executive`, `idx_audit_logs_time`, `idx_handoffs_executive`.
2. **Chạy Migration Local**:
   ```powershell
   # Áp dụng migration trực tiếp vào dev.db
   npm --prefix app run db:generate
   ```
3. **Kiểm tra Truy vấn & Test Database**:
   ```powershell
   node --test app/tests/d1-schema.test.js
   ```

## Các bẫy thường gặp (Bug Traps)
- **Undefined Tọa độ trên UI**: Do repository không đính kèm đồng thời `{ latitude, longitude, lat, lng, coordinates }`. Luôn gọi `normalizeEntityCoordinates(entity)`.
- **Lỗi Fake Coordinates**: Tuyệt đối không dùng công thức sin/cos offsets (`21.0285 + idx * 0.006`). Nếu không có GPS, trả về `lat: null, lng: null`.
- **Database Lock (`SQLITE_BUSY`)**: Đảm bảo chế độ `PRAGMA journal_mode=WAL;` và đóng prepared statements đúng cách.
