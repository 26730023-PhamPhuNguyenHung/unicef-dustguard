# ACTION MATRIX V2 — DUSTGUARD VN
## Ma Trận Nút Bấm & Tác Vụ Nghiệp Vụ Có Hiệu Lực Hệ Thống (Domain Effects)

> **Nguyên tắc**: Mọi nút bấm trên giao diện bắt buộc phải tạo ra một tác động thực tế (Domain Effect) vào CSDL D1 hoặc điều hướng người dùng hoàn thành công việc. Loại bỏ 100% các nút bấm vô nghĩa, modal thừa hoặc toast không lưu dữ liệu.

---

## 1. PHÂN LOẠI 9 TÁC VỤ NGHIỆP VỤ HỢP LỆ (9 VALID DOMAIN EFFECTS)

1. **NAVIGATE**: Chuyển hướng người dùng tới màn hình tiếp theo trong luồng.
2. **CREATE**: Tạo mới một thực thể nghiệp vụ (Tín hiệu phản ánh, Vụ việc, Nhiệm vụ).
3. **UPDATE**: Cập nhật thông tin thực thể (Ghi chú, Đổi thời hạn, Phân quyền).
4. **DELETE / CANCEL**: Hủy bỏ / đóng sớm tín hiệu không hợp lệ.
5. **UPLOAD**: Tải lên tệp nhị phân hình ảnh vào Cloudflare R2 + lưu mã băm SHA-256 vào D1.
6. **ASSIGN**: Gán người phụ trách (Cán bộ địa bàn hoặc Nhà thầu thi công) kèm thời hạn SLA.
7. **SUBMIT**: Nộp kết quả thực địa (Biên bản kiểm tra 10 tiêu chí hoặc Minh chứng Before/After).
8. **VERIFY**: Xác thực tính toàn vẹn hoặc kiểm tra lại hiện trường đạt chuẩn môi trường.
9. **CLOSE**: Duyệt hoàn tất và đóng vụ việc vào kho lưu trữ pháp lý.

---

## 2. MA TRẬN NÚT BẤM CHO TỪNG MÀN HÌNH V2

| Màn Hình V2 | Tên Nút Bấm (Button Label) | Loại Tác Vụ | API / Endpoint Tác Động | Dữ Liệu Thay Đổi Trong CSDL D1 |
|---|---|:---:|---|---|
| **P01: Landing** | `Gửi phản ánh ngay` | **NAVIGATE** | — | Điều hướng tới `/citizen/report/new` |
| | `Xem bản đồ` | **NAVIGATE** | — | Điều hướng tới `/map` |
| **C02: Report New** | `Gửi phản ánh` | **CREATE + UPLOAD** | `POST /api/complaints` | `INSERT INTO complaints`, `INSERT INTO audit_logs` |
| **C01: Citizen Home** | `Xem chi tiết & Minh chứng` | **NAVIGATE** | — | Điều hướng tới `/citizen/reports/:id` |
| | `Xuất chứng chỉ A4` | **VERIFY** | `GET /api/youth/certificate/:code` | Sinh mã QR xác thực chứng chỉ |
| **S01: Staff Work** | `📍 Chỉ đường` | **NAVIGATE** | — | Mở Google Maps theo tọa độ WGS84 |
| | `Bắt đầu kiểm tra` | **NAVIGATE** | — | Điều hướng tới `/staff/inspect/:id` |
| **S03: Staff Inspect**| `Gửi biên bản khảo sát` | **SUBMIT + UPLOAD** | `POST /api/inspections` | `INSERT INTO inspections`, `UPDATE cases SET status = 'INSPECTION_SUBMITTED'` |
| | `Nghiệm thu Đạt` | **VERIFY** | `POST /api/staff/cases/:id/verify` | `UPDATE cases SET status = 'VERIFIED'` |
| | `Yêu cầu làm lại` | **UPDATE** | `POST /api/staff/cases/:id/reopen` | `UPDATE cases SET status = 'REMEDIATION_REQUIRED'` |
| **K01: Contractor** | `Xử lý & Nộp ảnh` | **NAVIGATE** | — | Điều hướng tới `/contractor/tasks/:id` |
| **K02: Task Submit** | `Nộp minh chứng & Báo xong`| **SUBMIT + UPLOAD** | `POST /api/contractor/tasks/:id/submit`| `UPDATE tasks SET status = 'SUBMITTED'`, `UPDATE cases SET status = 'REMEDIATION_SUBMITTED'` |
| **A01: Admin Inbox** | `+ Mở vụ việc & Giao việc` | **CREATE + ASSIGN** | `POST /api/cases` | `INSERT INTO cases`, `INSERT INTO tasks` |
| **A02: Case Detail** | `Giao đơn vị thi công` | **ASSIGN** | `POST /api/staff/cases/:id/assign` | `UPDATE cases SET status = 'REMEDIATION_REQUIRED'`, `INSERT INTO tasks` |
| | `Duyệt hoàn tất & Đóng` | **CLOSE** | `POST /api/staff/cases/:id/complete` | `UPDATE cases SET status = 'COMPLETED', completed_at = CURRENT_TIMESTAMP` |
| | `In biên bản A4` | **NAVIGATE** | `GET /api/documents/:id/print` | Xuất bản in A4 chuẩn NĐ 30/2020 |
| **A04: Users** | `Đổi vai trò` | **UPDATE** | `PUT /api/users/:id/status` | `UPDATE users SET role = ?` |
| **A05: Settings** | `Lưu cấu hình` | **UPDATE** | `POST /api/admin/settings` | `UPDATE system_settings` |
