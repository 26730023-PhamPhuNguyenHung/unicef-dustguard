# Đặc Tả Tính Năng: Luồng Tác Nghiệp Cán Bộ Hiện Trường (Staff Field Case Flow)

> **Mã đặc tả**: `SPEC-STAFF-01`  
> **Trạng thái**: ACTIVE / PILOT TARGET  
> **Phân hệ**: Cán bộ hiện trường (`Staff Portal`)  

---

## 1. Người Dùng (User Persona)
- **Đối tượng**: Cán bộ thanh tra môi trường / Đội phản ứng nhanh đô thị (`FIELD_STAFF`).
- **Ngữ cảnh sử dụng**: Cầm điện thoại 1 tay ngoài công trình xây dựng nhiều khói bụi, trời nắng gắt, cần kiểm tra vi phạm, nộp minh chứng ảnh và hoàn tất hồ sơ nhanh chóng.

## 2. Mục Tiêu Của Người Dùng (User Goal)
- Khảo sát thực địa công trình bị phản ánh ô nhiễm bụi.
- Đánh giá 10 tiêu chí theo QCVN 18:2021/BXD & QĐ 48/2021/QĐ-UBND.
- Tải lên ảnh minh chứng thực tế (phân loại rõ Before/After) có băm mã SHA-256 đối chứng pháp lý.
- Nghiệm thu và đóng hồ sơ xử lý (`COMPLETED`), đồng bộ dữ liệu bền vững vào Cloudflare D1.

## 3. Điểm Vào Giao Diện (Entry Point)
- Danh sách hồ sơ: `/staff/cases`
- Chi tiết hồ sơ: `/staff/cases/:id` (hoặc `/staff/cases/case-01`)

## 4. Hành Trình Người Dùng (User Journey)
1. **Bước 1 — Truy cập hồ sơ**: Cán bộ mở `/staff/cases`, chọn hồ sơ cần xử lý (ví dụ: `case-01`).
2. **Bước 2 — Khảo sát 10 tiêu chí**: Chuyển sang thẻ "Biên bản khảo sát", tích chọn trạng thái 10 tiêu chí QCVN (hoặc bấm "Đạt tất cả" nếu công trình đã khắc phục).
3. **Bước 3 — Tải ảnh minh chứng**: Bấm "Tải minh chứng", chọn ảnh chụp thực địa (Before hoặc After), nhập chú thích, gửi lên hệ thống.
4. **Bước 4 — Chuyển bước tác nghiệp**: Tiến trình vụ việc tự động chuyển qua các bước trong chu trình 7 bước DAG (`INSPECTION` $\to$ `REMEDIATION`).
5. **Bước 5 — Hoàn tất hồ sơ**: Bấm nút chính "Hoàn tất hồ sơ", nhập biên bản kết luận nghiệm thu, xác nhận đóng hồ sơ.
6. **Bước 6 — Đối chứng F5 Reload**: Tải lại trang, hồ sơ giữ nguyên trạng thái `COMPLETED`, hình ảnh minh chứng và kết quả khảo sát hiển thị đầy đủ.

## 5. Dữ Liệu Đọc & Ghi (Data Read/Write)
- **Đọc**:
  - `cases`: Thông tin hồ sơ, mã số, trạng thái, thời hạn SLA 48h.
  - `inspections`: Lịch sử các lần khảo sát hiện trường.
  - `case_evidences`: Danh sách ảnh minh chứng Before/After kèm mã SHA-256.
- **Ghi**:
  - `cases`: Cập nhật `status = 'COMPLETED'`, `updatedAt = NOW()`.
  - `inspections`: `INSERT` biên bản khảo sát 10 tiêu chí.
  - `case_evidences`: `INSERT` ảnh minh chứng kèm URL và chú thích.

## 6. Giao Tiếp API (API Endpoints)
- `GET /api/staff/cases/:id/detail` — Chi tiết hồ sơ và dữ liệu liên quan.
- `POST /api/staff/cases/:id/inspection` — Ghi nhận kết quả khảo sát 10 tiêu chí.
- `POST /api/staff/cases/:id/evidences` — Lưu minh chứng ảnh.
- `POST /api/staff/cases/:id/complete` — Đóng hồ sơ nghiệm thu.

## 7. Yếu Tố Di Động & Vị Nhân Sinh
- Giao diện kem sáng (`#FDFBF7`), chữ đen đậm (`#231b14`), tương phản cao nhìn rõ ngoài trời nắng gắt.
- Tuyệt đối không dùng glassmorphism.
- Kích thước chạm của tất cả các nút $\ge 44\text{px}$.
- Nút "Đạt tất cả" và các nút chọn ảnh mẫu hỗ trợ cán bộ thao tác 1 chạm không cần gõ phím nhiều.

## 8. Tiêu Chí Nghiệm Thu Khách Quan (Acceptance Criteria)
- [ ] **AC-1**: Viewport 375x812 không có thanh cuộn ngang (`document.documentElement.scrollWidth <= 375`).
- [ ] **AC-2**: Nút bấm "Tải minh chứng" và "Hoàn tất hồ sơ" đạt chiều cao tối thiểu 44px.
- [ ] **AC-3**: Tải ảnh minh chứng gọi thành công `POST /api/staff/cases/:id/evidences` và trả về mã HTTP 200/201.
- [ ] **AC-4**: Hoàn tất hồ sơ chuyển trạng thái `status` trong D1 SQLite thành `COMPLETED`.
- [ ] **AC-5**: Tải lại trang (F5 Reload), hồ sơ vẫn ở trạng thái `COMPLETED` và có đủ minh chứng.
- [ ] **AC-6**: DevTools Console không có bất kỳ lỗi đỏ Uncaught TypeError nào trong suốt luồng.
