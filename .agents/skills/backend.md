# Kỹ Năng Backend — DustGuard VN

> **Mục tiêu**: Xây dựng và mở rộng hệ thống API Edge trên Cloudflare Worker (Hono) kết nối CSDL Cloudflare D1 và lưu trữ R2, bảo đảm chuẩn định dạng, bảo mật và tính toàn vẹn.

---

## 1. Ranh Giới Định Tuyến (Routing Boundaries)
- Điểm vào chính: `app/server/worker.js`.
- Router theo phân hệ: `app/server/routes/worker/`:
  - `staff.js`: Tác nghiệp cán bộ (/api/staff/*).
  - `cases.js`: Vòng đời 7 bước vụ việc (/api/cases/*).
  - `sites.js`: Quản lý công trình & cảm biến (/api/sites/*).
  - `contractor.js`: Cổng nhà thầu khắc phục (/api/contractor/*).
  - `observations.js` & `complaints.js`: Tiếp nhận phản ánh công dân.
  - `youth.js`: Tín chỉ thanh niên và chứng nhận tình nguyện.

---

## 2. Quy Chuẩn Phản Hồi (API Response Contract)
- **Phản Hồi Thành Công**:
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```
- **Phản Hồi Lỗi (RFC 7807 Problem Details)**:
  ```json
  {
    "type": "https://dustguard.vn/errors/validation",
    "title": "Dữ liệu không hợp lệ",
    "status": 400,
    "detail": "Tọa độ WGS84 nằm ngoài vùng giám sát đô thị.",
    "instance": "/api/cases/create"
  }
  ```
- **Không Giả Mạo Thành Công (No Fake Success)**: Nếu CSDL gặp lỗi hoặc không ghi nhận được, tuyệt đối không trả về `{ success: true }`.

---

## 3. Ràng Buộc Bảo Mật & Xác Thực (RBAC & Security)
- Mọi endpoint tác nghiệp nhạy cảm (Assign, Complete, Delete) phải kiểm tra quyền dựa trên vai trò:
  `CITIZEN`, `FIELD_STAFF`, `CONTRACTOR`, `ADMIN`, `EXECUTIVE`.
- Kiểm tra Anti-Spam thiết bị qua mã băm thiết bị (Device Fingerprint HMAC).
- Giới hạn kích thước tệp tải lên qua Cloudflare R2: Tối đa 5MB/ảnh, chỉ chấp nhận định dạng ảnh hợp lệ (PNG, JPEG, WebP).
