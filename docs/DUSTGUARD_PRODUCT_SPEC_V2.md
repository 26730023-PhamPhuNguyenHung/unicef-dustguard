# DUSTGUARD VN — PRODUCT SPEC V2 (SSOT)
## Hệ Thống Thông Tin Tác Nghiệp Rủi Ro Bụi Công Trình (Operational Information System)

> **Mục tiêu cốt lõi**: DustGuard giúp cán bộ tập hợp thông tin về bụi công trình, xác định trường hợp cần xem trước và theo dõi quá trình xử lý trong một nơi duy nhất.
> 
> **Khẩu hiệu**: *Từ thông tin rời rạc đến việc cần xử lý.*
> 
> **Chu trình 4 bước**: **GHI NHẬN ➔ ƯU TIÊN ➔ PHÂN CÔNG ➔ THEO DÕI**

---

## 1. Bản Chất Sản Phẩm (What DustGuard is & is NOT)

### DustGuard LÀ:
- Hệ thống hỗ trợ cán bộ tiếp nhận, sắp xếp và theo dõi thông tin liên quan đến bụi công trình.
- Cung cấp bảng điều phối đơn giản, trực quan, dễ thao tác trên máy tính bàn và laptop (1366x768, 1440x900).
- Hoạt động 100% ngay cả khi **không có cảm biến IoT** và **tắt toàn bộ AI**.

### DustGuard KHÔNG PHẢI LÀ:
- Không phải hệ thống AI thanh tra hay tự động kết luận vi phạm.
- Không phải GIS chuyên nghiệp (không heatmap, không polygon, không custom geofence frontend phức tạp; chỉ text address + nút "Mở Google Maps").
- Không phải workflow engine phức tạp (chỉ enum 4 trạng thái: `Mới`, `Đang xử lý`, `Chờ`, `Hoàn tất`).
- Không phải nền tảng thay thế các phần mềm hành chính nhà nước.

---

## 2. 25 Nguyên Tắc Sản Phẩm Bắt Buộc (Core Invariants)

1. **RULE 01 — Không giải quyết toàn bộ nghiệp vụ**: Chỉ số hóa: Tiếp nhận ➔ Sàng lọc ➔ Theo dõi ➔ Phân công ➔ Lưu bằng chứng ➔ Ghi kết quả.
2. **RULE 02 — Human First**: Mọi hành động quan trọng (tạo case, giao việc, đổi trạng thái, đóng hồ sơ) do con người bấm nút quyết định.
3. **RULE 03 — AI là Optional Enhancement**: Hệ thống chạy 100% không phụ thuộc AI; AI chỉ là nút phụ (Tóm tắt, Gợi ý, Phân loại) và không nằm trên critical path.
4. **RULE 04 — Không GIS phức tạp**: Địa chỉ text chuẩn + nút "Mở Maps" (Google Maps).
5. **RULE 05 — IoT không phải trung tâm**: Sensor chỉ là 1 nguồn tín hiệu bên cạnh Người dân, Cán bộ, Hồ sơ cũ, Nhập tay.
6. **RULE 06 — Table First**: Card, Table, Form, Modal, Tabs, Badge; không dùng visual phức tạp nếu Table giải quyết được.
7. **RULE 07 — Một màn hình = một công việc**: Không tạo dashboard 20 widgets.
8. **RULE 08 — Mỗi màn hình tối đa một bảng chính**: Header + Filter + Stats (nếu cần) + Main Table/Content.
9. **RULE 09 — CRUD phải rõ hơn AI**: Ưu tiên Create, Read, Update, Delete, Filter, Search, Sort, Upload trước.
10. **RULE 10 — Mọi giá trị tự động đều sửa được bằng tay**: Không để thuật toán khóa quyền của cán bộ.
11. **RULE 11 — Không workflow engine**: Enum trạng thái đơn giản + `PATCH /cases/:id/status`.
12. **RULE 12 — Status cực ít (4 trạng thái)**: `Mới` (`NEW`), `Đang xử lý` (`IN_PROGRESS`), `Chờ` (`WAITING`), `Hoàn tất` (`DONE`).
13. **RULE 13 — Không SLA engine phức tạp**: Chỉ cần `due_at`; `if (dueAt < now && status !== 'DONE') overdue = true`.
14. **RULE 14 — Score giải thích được bằng code thường**: Bảng trọng số tĩnh tính điểm 0-100 (Phản ánh +25, PM vượt ngưỡng +25, Gần trường học +20, Thiếu bằng chứng +10, Lịch sử +20).
15. **RULE 15 — Evidence là file**: Ảnh, PDF, Ghi chú, Thời gian, Người tải + SHA-256 hash đơn giản.
16. **RULE 16 — Audit log cực đơn giản**: Bảng `audit_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `message`, `created_at`).
17. **RULE 17 — Không microservices**: React + Hono Worker + Cloudflare D1 (SQLite) + R2 (Storage).
18. **RULE 18 — DB đọc được bằng mắt**: 9 bảng cốt lõi (`users`, `sites`, `reports`, `alerts`, `cases`, `tasks`, `evidence`, `sensor_readings`, `audit_logs`).
19. **RULE 19 — Không abstraction sớm**: Code rõ ràng, dễ hiểu.
20. **RULE 20 — Component nhỏ gọn, tái sử dụng**: `PageHeader`, `FilterBar`, `DataTable`, `StatusBadge`, `StatCard`, `FormModal`, `ConfirmDialog`, `EmptyState`.
21. **RULE 21 — Form dùng HTML chuẩn**: Native `<input>`, `<select>`, `<textarea>`, `<input type="date">`, `<input type="file">`.
22. **RULE 22 — Mobile usable, Desktop first**: Tối ưu hoàn hảo cho máy tính làm việc (1366x768, 1440x900, 1920x1080).
23. **RULE 23 — Polling đơn giản thay vì WebSocket**: Polling 60s/120s hoặc tải khi mở trang.
24. **RULE 24 — Không notification infrastructure phức tạp**: Bảng `notifications` + icon chuông.
25. **RULE 25 — Mọi feature đều xóa được độc lập**: Xóa AI, Sensor, PDF export thì Cases, Tasks, Sites, Reports vẫn chạy bình thường.

---

## 3. Kiến Trúc 8 Màn Hình Staff Chuẩn V2

```text
DustGuard Sidebar:

[Tổng quan]         (/staff)
--- NGHIỆP VỤ ---
[Quan trắc]         (/staff/monitoring)
[Cảnh báo]          (/staff/alerts)
[Công trình]        (/staff/sites)
[Vụ việc]           (/staff/cases)
[Nhiệm vụ]          (/staff/tasks)
[Báo cáo]           (/staff/reports)
--- HỆ THỐNG ---
[Cài đặt]           (/staff/settings)
```

### Chi tiết 8 màn hình:

1. **Tổng quan (`/staff`)**:
   - 4 KPI cards: `Công trình đang theo dõi`, `Cảnh báo mới`, `Vụ việc đang xử lý`, `Quá hạn`.
   - 1 Bảng chính: `Ưu tiên hôm nay` (Công trình | Điểm | Lý do | Trạng thái | Hành động [Xem]).
2. **Quan trắc (`/staff/monitoring`)**:
   - Bộ lọc: Công trình, Phường, Trạng thái.
   - Bảng điểm đo: Công trình | PM2.5 | PM10 | Nhiệt độ | Cập nhật | Trạng thái (Ổn / Cao / Mất tín hiệu) | [Xem].
3. **Cảnh báo (`/staff/alerts`)**:
   - Tabs: `Mới` | `Đã xem` | `Đã xử lý`.
   - Bảng: Thời gian | Công trình | Cảnh báo | Mức độ | Trạng thái | Nút [Xem] & [Tạo vụ].
4. **Công trình (`/staff/sites`)**:
   - Tìm kiếm + Bộ lọc Phường/Xã.
   - Bảng: Tên công trình | Phường | Điểm rủi ro | Cảnh báo | Trạng thái | [Xem].
   - Trang chi tiết `/staff/sites/:id`: Thông tin, Địa chỉ, Điểm rủi ro, Phản ánh, Cảm biến, Vụ việc, Nút `[Mở Maps]`.
5. **Vụ việc (`/staff/cases`)**:
   - Tabs: `Mới` | `Đang xử lý` | `Chờ` | `Hoàn tất`.
   - Bảng: Mã vụ việc | Công trình | Nội dung | Mức ưu tiên | Cán bộ phụ trách | Hạn xử lý | Trạng thái.
   - Trang chi tiết `/staff/cases/:id`: 5 Tab đơn giản (`Tổng quan`, `Bằng chứng`, `Kiểm tra`, `Khắc phục`, `Lịch sử`).
6. **Nhiệm vụ (`/staff/tasks`)**:
   - Tabs: `Hôm nay` | `Sắp tới` | `Đã xong`.
   - Bảng: Tên công việc | Công trình | Hạn | Mức ưu tiên | Trạng thái | Actions [Xem], [Đánh dấu Xong].
7. **Báo cáo (`/staff/reports`)**:
   - 4 KPI tổng hợp: `Đã tiếp nhận`, `Đang xử lý`, `Đã hoàn tất`, `Quá hạn`.
   - 1 Bảng tổng hợp: Phường/Xã | Công trình | Cảnh báo | Vụ việc | Đã hoàn tất + Nút `[Xuất CSV]`.
8. **Cài đặt (`/staff/settings`)**:
   - 3 Tab: `Tài khoản`, `Thông báo`, `Nhật ký kiểm toán` (Audit Log).

---

## 4. 9 Bảng CSDL Cốt Lõi (Core D1 Schema)

```text
1. users             (id, email, full_name, role, phone, created_at)
2. sites             (id, name, address, ward, district, contractor_name, risk_score, status, created_at)
3. reports           (id, site_id, category, description, address, ward, status, reporter_name, reporter_phone, created_at)
4. alerts            (id, site_id, sensor_id, type, severity, message, pm25, status, created_at)
5. cases             (id, code, site_id, report_id, alert_id, title, description, priority, status, assigned_to, due_at, created_at, updated_at)
6. tasks             (id, case_id, site_id, title, description, assigned_to, priority, status, due_at, completed_at, created_at)
7. evidence          (id, case_id, task_id, file_url, sha256, caption, file_type, uploaded_by, created_at)
8. sensor_readings   (id, sensor_id, site_id, pm25, pm10, temperature, humidity, recorded_at)
9. audit_logs        (id, user_id, user_name, action, entity_type, entity_id, message, created_at)
```

---

## 5. Phân Định Legacy / Experimental

Các phân hệ sau được đánh dấu là **Legacy / Experimental** (không nằm trong core V2):
- CSR Escrow & DEMS
- Bản đồ GIS Heatmap phức tạp / Polygon / Canvas custom
- Legal Document Engine phức tạp (DOCX builder nặng)
- Tín chỉ thanh niên / Youth Credit / Gamification
