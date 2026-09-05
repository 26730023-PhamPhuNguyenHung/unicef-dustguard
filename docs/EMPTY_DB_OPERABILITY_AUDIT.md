# BÁO CÁO KIỂM KÊ VẬN HÀNH TRÊN CƠ SỞ DỮ LIỆU TRỐNG (EMPTY DB OPERABILITY AUDIT)
> **Hệ thống**: DustGuard Operations  
> **Nguyên tắc**: Zero-Seed Production Readiness — Tuyệt đối không phụ thuộc vào `seed.ts` để vận hành thực tế.

---

## 1. Phân Định Nguồn Gốc Dữ Liệu Thực Tế (Data Origin Classification)

Mọi thực thể trong hệ thống vận hành thực tế bắt buộc phải thuộc một trong 4 nguồn gốc sau (Tuyệt đối không có nguồn "từ seed.ts"):

- **A. USER-CREATED (Người dùng tạo)**: Dữ liệu do con người (cán bộ, lãnh đạo, công dân, nhà thầu) nhập liệu qua giao diện web hoặc mobile.
- **B. SYSTEM-DERIVED (Hệ thống suy dẫn)**: Dữ liệu được tính toán hoặc sinh ra tự động từ các sự kiện thực tế trong cơ sở dữ liệu (ví dụ: tạo vụ việc từ phản ánh được duyệt, tính hạn chót 48h, chỉ số dashboard tổng hợp, phân tích chứng cứ).
- **C. EXTERNAL-INTEGRATION (Tích hợp ngoại vi)**: Dữ liệu gửi đến từ thiết bị phần cứng thật (cảm biến IoT ESP32) hoặc cổng thông tin bên ngoài qua API chuẩn có xác thực chữ ký.
- **D. SYSTEM-CONFIGURATION (Cấu hình hệ thống)**: Các danh mục quy chuẩn, vai trò, quyền hạn, cài đặt ban đầu tối thiểu cần thiết để phần mềm khởi động.

---

## 2. Bảng Kiểm Kê Chi Tiết Từng Thực Thể Nghiệp Vụ (Domain Entity Audit)

| Thực thể nghiệp vụ | Bảng CSDL | Phân loại nguồn gốc | API Đọc | API Tạo | API Cập nhật | Đường dẫn UI tạo | Người tạo | Phụ thuộc seed? | Trạng thái Sẵn sàng Sản xuất |
|---|---|---|---|---|---|---|---|---|---|
| **Users (Người dùng)** | `users` | A & D | `GET /api/admin/users`, `GET /api/auth/me` | `POST /api/auth/bootstrap` (Setup đầu tiên), `POST /api/admin/users` | `PATCH /api/admin/users/:id` | `/setup` (khi 0 user), `/admin/users` (khi đã có admin) | Admin / Bootstrap | Trước: Có (seed tạo staff1..admin).<br>Sau: **KHÔNG** | ✅ Sẵn sàng (Có luồng Bootstrap `/setup`) |
| **Roles & Permissions** | Hardcoded code constants | D | N/A (Shared contract) | N/A (Mặc định hệ thống) | N/A | Không cần UI | System | **KHÔNG** | ✅ Sẵn sàng (`ROLE_PERMISSIONS`) |
| **Departments (Phòng ban)** | Cột `users.department` | A | `GET /api/admin/users` | Đi kèm khi tạo User | Đi kèm khi sửa User | `/setup`, `/admin/users` | Admin | **KHÔNG** | ✅ Sẵn sàng |
| **Contractors (Nhà thầu)** | `contractors` | A | `GET /api/contractors` | `POST /api/contractors` | `PATCH /api/contractors/:id` | `/contractors` (Modal "Thêm nhà thầu") | Cán bộ / Admin | Trước: Có (text tự do).<br>Sau: **KHÔNG** | ✅ Sẵn sàng (Đã thêm bảng & CRUD UI) |
| **Projects / Sites (Công trình)** | `projects` | A | `GET /api/projects`, `GET /api/projects/:id` | `POST /api/projects` | `PATCH /api/projects/:id` | `/projects` (Modal "Thêm công trình") | Cán bộ / Admin | Trước: Có (text tự do).<br>Sau: **KHÔNG** | ✅ Sẵn sàng (Đã thêm bảng & CRUD UI) |
| **Citizen Reports (Phản ánh dân)** | `signals` (type: COMMUNITY) | A & C | `GET /api/signals?source_type=COMMUNITY` | `POST /api/signals/public-report` | N/A (Bất biến) | Modal phản ánh công dân | Công dân / Tình nguyện viên | Trước: Có (seed tạo signals).<br>Sau: **KHÔNG** | ✅ Sẵn sàng (Có endpoint mở cho dân) |
| **Cases (Hồ sơ vụ việc)** | `cases` | A & B | `GET /api/cases`, `GET /api/cases/:id` | `POST /api/cases`, `POST /api/signals/:id/create-case` | `PATCH /api/cases/:id` | `/cases` (Modal tạo vụ việc), `/signals` (Nút "Tiếp nhận") | Cán bộ tiếp nhận / Điều phối | Trước: Có (seed tạo case-001..026).<br>Sau: **KHÔNG** | ✅ Sẵn sàng (Tạo thủ công hoặc từ phản ánh) |
| **Case Assignments (Phân công)** | `staff_assignments`, `cases.assigned_staff_id` | A | `GET /api/cases/:id` | `POST /api/cases/:id/assign` | Thay thế khi tái phân công | `/cases/:id` (Modal "Phân công cán bộ") | Lãnh đạo điều phối | Trước: Có (phụ thuộc staff seed).<br>Sau: **KHÔNG** | ✅ Sẵn sàng (Có thông báo hướng dẫn tạo cán bộ nếu rỗng) |
| **Evidence (Minh chứng số)** | `evidence_assets` | A | `GET /api/evidence`, `GET /api/cases/:id` | `POST /api/cases/:id/evidence` (kèm SHA-256) | `POST /api/evidence/:id/verify-hash` | `/cases/:id` (Modal "Tải ảnh"), `/evidence` | Cán bộ hiện trường / Công dân | Trước: Có (seed sinh file svg giả).<br>Sau: **KHÔNG** | ✅ Sẵn sàng (Hỗ trợ upload ảnh thật) |
| **Inspection Templates** | `inspection_templates`, `inspection_template_items` | D | `GET /api/inspection-templates` | Khởi tạo trong Bootstrap / Migration | N/A | Quản trị viên | Trước: Có (nằm trong seed.ts).<br>Sau: **KHÔNG** | ✅ Sẵn sàng (Tự động nạp mẫu chuẩn nếu rỗng) |
| **Inspections (Kiểm tra)** | `inspections`, `inspection_items` | A | `GET /api/inspections`, `GET /api/inspections/:id` | `POST /api/cases/:id/inspections` | `PUT /api/inspections/:id/submit` | `/cases/:id/inspection/new` | Cán bộ thanh tra | Trước: Có (seed tạo inspection).<br>Sau: **KHÔNG** | ✅ Sẵn sàng |
| **Inspection Observations** | `inspection_items` (PASS/FAIL) | A | `GET /api/inspections/:id` | Điền checklist trực tiếp tại thực địa | Cập nhật bản nháp thời gian thực | `/inspections/:id` | Cán bộ hiện trường | Trước: Có.<br>Sau: **KHÔNG** | ✅ Sẵn sàng |
| **Findings (Ghi nhận vi phạm)** | `inspection_findings` | A & B | `GET /api/findings`, `GET /api/cases/:id` | Tự động sinh từ checklist FAIL hoặc `POST /api/findings` | N/A | `/inspections/:id/result` | Hệ thống / Cán bộ thanh tra | Trước: Có.<br>Sau: **KHÔNG** | ✅ Sẵn sàng |
| **Legal Documents & Clauses** | `legal_documents`, `legal_sections`, `legal_sections_fts` | C & D | `GET /api/legal/documents`, `GET /api/legal/search` | `POST /api/legal/import` | N/A | `/legal/import` (Nhập văn bản pháp quy) | Chuyên viên pháp chế | Trước: Có.<br>Sau: **KHÔNG** | ✅ Sẵn sàng (Bộ bóc tách luật chạy trực tiếp) |
| **Legal Analysis & Findings** | `analysis_runs`, `legal_analyses` | B | `GET /api/cases/:id/facts`, `POST /api/cases/:id/analysis` | `POST /api/cases/:id/analysis` | N/A (Bất biến) | `/cases/:id/legal` (Chạy Thẩm tra) | Trợ lý pháp quy dựa trên dữ kiện thực | Trước: Có.<br>Sau: **KHÔNG** | ✅ Sẵn sàng (Từ chối nếu không có chứng cứ thực) |
| **Tasks (Nhiệm vụ vận hành)** | `tasks` | A & B | `GET /api/tasks` | `POST /api/tasks`, `POST /api/cases/:id/missing-facts/create-task` | `PATCH /api/tasks/:id` | `/tasks` (Modal tạo task), `/cases/:id/legal` (CTA missing fact) | Cán bộ / Hệ thống | Trước: Có.<br>Sau: **KHÔNG** | ✅ Sẵn sàng |
| **Corrective Actions** | `corrective_actions` | A | `GET /api/actions`, `GET /api/cases/:id` | `POST /api/cases/:id/actions` | `PATCH /api/actions/:id` | `/cases/:id` (Modal ban hành yêu cầu) | Cán bộ thụ lý | Trước: Có.<br>Sau: **KHÔNG** | ✅ Sẵn sàng |
| **Remediation Submissions** | `remediation_submissions` | A | `GET /api/actions/:id/remediation` | `POST /api/actions/:id/remediation` | `POST /api/remediation/:id/review` | `/actions` (Modal nộp khắc phục) | Nhà thầu / Cán bộ hỗ trợ | Trước: Có.<br>Sau: **KHÔNG** | ✅ Sẵn sàng |
| **Case Closures (Đóng vụ việc)** | `case_closures` | A & B | `GET /api/cases/:id/closure` | `POST /api/cases/:id/close` (4 cổng kiểm soát) | N/A (Bất biến) | `/cases/:id` (Ký quyết định đóng) | Lãnh đạo điều phối | Trước: Có.<br>Sau: **KHÔNG** | ✅ Sẵn sàng |
| **Audit Logs (Nhật ký kiểm toán)** | `audit_logs` | B | `GET /api/admin/audit` | Tự động ghi nhận khi có đột biến dữ liệu | N/A (Bất biến) | Tự động sinh | Hệ thống | **KHÔNG** | ✅ Sẵn sàng |
| **IoT Devices (Trạm đo IoT)** | `iot_devices` | A & C | `GET /api/iot/devices`, `GET /api/iot/devices/:id` | `POST /api/iot/devices` | Cập nhật trạng thái tự động | `/iot` (Modal "Đăng ký trạm đo mới") | Quản trị viên kỹ thuật | Trước: Có.<br>Sau: **KHÔNG** | ✅ Sẵn sàng |
| **IoT Readings (Gói tin cảm biến)** | `iot_readings`, `iot_events` | C | `GET /api/iot/devices/:id/readings` | `POST /api/iot/ingest` (Chữ ký HMAC SHA-256) | N/A (Bất biến) | Truyền từ vi điều khiển thật ESP32 | Thiết bị phần cứng thật | Trước: Có.<br>Sau: **KHÔNG** | ✅ Sẵn sàng |
| **Notifications (Thông báo)** | `notifications` | B | `GET /api/notifications` | Tự động sinh từ sự kiện vận hành | `PATCH /api/notifications/:id/read` | Tự động hiển thị tại thanh Topbar | Hệ thống | **KHÔNG** | ✅ Sẵn sàng |
| **Automations (Tự động hóa)** | `automation_rules`, `automation_runs` | A & B | `GET /api/automations` | `POST /api/automations/rules` | `PATCH /api/automations/rules/:id` | `/automations` | Quản trị viên | Trước: Có.<br>Sau: **KHÔNG** | ✅ Sẵn sàng |
| **Dashboard Metrics** | N/A (Tính toán động từ SQL) | B | `GET /api/dashboard`, `GET /api/reports/overview` | N/A (Truy vấn SQL tức thời) | N/A | `/dashboard`, `/reports` | Hệ thống | Trước: Có hiển thị rỗng không có CTA.<br>Sau: **KHÔNG** | ✅ Sẵn sàng (Hiển thị đúng 0 khi CSDL rỗng kèm hướng dẫn) |

---

## 3. Các Khoảng Trống Nghiệp Vụ Phát Hiện & Biện Pháp Khắc Phục (Gap Fixes)

1. **Khởi tạo Quản trị viên Lần đầu (Bootstrap Problem)**:
   - *Phát hiện*: Khi CSDL trống 0 user, không ai có thể đăng nhập để tạo user mới vì `POST /api/admin/users` đòi hỏi quyền `user:manage`.
   - *Khắc phục*: Bổ sung API `POST /api/auth/bootstrap` và giao diện `/setup`. Endpoint này kiểm tra `SELECT count(*) FROM users`. Nếu bằng 0, cho phép tạo Admin và trả về JWT. Sau khi đã có ít nhất 1 user, endpoint này tự động khóa vĩnh viễn (403 Forbidden).

2. **Thiếu Thực Thể Công Trình & Nhà Thầu Riêng Biệt (Projects & Contractors)**:
   - *Phát hiện*: Trước đây `contractor_name` và `location_text` chỉ là các chuỗi string tự do trong bảng `cases`. Người dùng không có nơi nào để tạo và quản lý danh mục công trình và nhà thầu.
   - *Khắc phục*: Tạo bảng `contractors` và `projects` trong CSDL; bổ sung đầy đủ Router API và giao diện UI `/projects`, `/contractors` với modal thêm mới và liên kết sâu vào vụ việc.

3. **Gửi Phản Ánh Công Dân Trực Tiếp (Public Community Reporting)**:
   - *Phát hiện*: API `POST /api/signals` yêu cầu token cán bộ `requireAuth`. Công dân không thể gửi báo cáo nếu không đăng nhập.
   - *Khắc phục*: Bổ sung endpoint công khai `POST /api/signals/public-report` và modal phản ánh cộng đồng trên giao diện, ghi nhận thẳng vào CSDL SQLite với `source_type = 'COMMUNITY'`.

4. **Biến Phản Ánh Thành Vụ Việc Chính Thức (Signal Triage)**:
   - *Phát hiện*: Thiếu thao tác trực tiếp chuyển một tín hiệu phản ánh thành hồ sơ vụ việc.
   - *Khắc phục*: Bổ sung API `POST /api/signals/:id/create-case` tự động kế thừa tiêu đề, vị trí, ảnh đính kèm và gắn liên kết `case_signals`.

5. **Đăng Ký Thiết Bị IoT Từ Giao Diện**:
   - *Phát hiện*: Trang `/iot` chỉ đọc danh sách thiết bị mà không có nút đăng ký trạm mới.
   - *Khắc phục*: Bổ sung Modal "Đăng ký trạm quan trắc mới" trên trang `/iot`, cho phép nhập mã trạm, vị trí, công trình liên kết và sinh khóa bí mật HMAC-SHA256.

6. **Tách Biệt Hoàn Toàn Seed Demo**:
   - *Phát hiện*: `scripts/setup.js` trước đây tự động chạy `seed.ts`.
   - *Khắc phục*: `scripts/setup.js` chỉ chạy migration và cấu hình tối thiểu. Đổi lệnh seed demo thành `npm run seed:demo` và chỉ dùng khi nhà phát triển yêu cầu rõ ràng.
