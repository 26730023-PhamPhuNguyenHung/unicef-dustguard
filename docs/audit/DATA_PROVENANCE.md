# Data Provenance Audit — DustGuard VN

Phân loại nguồn gốc dữ liệu trong toàn bộ hệ thống DustGuard VN:

## Phân loại dữ liệu:

### 1. D1 Database Core Production Data (Hợp lệ - SSOT)
- Toàn bộ 46 bảng trong SQLite D1 (`app/prisma/d1-schema.sql`, `app/prisma/d1-seed.sql`).
- 33 công trình thật tại Hà Nội & TP.HCM, tọa độ WGS84 chính xác, lịch sử đo đạc, hồ sơ vụ việc.

### 2. Live User Mutations (Dữ liệu người dùng tạo mới qua runtime)
- Bảng `observations`, `observation_evidence` khi công dân gửi phản ánh mới.
- Bảng `cases`, `case_status_history`, `actions` khi cán bộ thực hiện quy trình 7 bước.
- Bảng `youth_activities`, `youth_certificates` khi thanh niên nộp giờ tình nguyện.

### 3. Quick Demo Preset Records (Hợp lệ - Dành cho môi trường đánh giá Demo)
- Được kích hoạt tại `/demo` hoặc qua `POST /api/admin/system/seed-demo` để khôi phục dữ liệu mẫu phục vụ ban giám khảo chấm thi mà không làm hỏng cấu trúc D1.

### 4. Zero Hardcoded Data in Core UI Paths (Đã kiểm toán)
- Không có mock data giả mạo trong các khối `catch {}` của API hay component chính.
- Mọi giao diện đều hiển thị Empty State rõ ràng hoặc Toast lỗi RFC 7807 khi mất kết nối mạng.
