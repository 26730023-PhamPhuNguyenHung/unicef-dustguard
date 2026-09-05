# DUSTGUARD VN — ACTUAL SYSTEM MAP (BẢN ĐỒ HỆ THỐNG THỰC TẾ)

> **Mã tài liệu**: `DG-AUDIT-00-ACTUAL-SYSTEM-MAP`  
> **Thời điểm xác lập**: 05/09/2026  
> **Nguyên tắc SSOT**: Không suy diễn giả định, chỉ ghi nhận mã nguồn và runtime đang chạy thật. Phân định rõ ràng giữa SQLite cục bộ và Cloudflare D1 Edge.

---

## 1. TỔNG QUAN KIẾN TRÚC TOÀN HỆ THỐNG (SYSTEM TOPOLOGY)

Hệ thống **DustGuard VN** vận hành trên kiến trúc phân tầng 2 Cổng độc lập (Canonical Two-Side Architecture) kết nối qua giao thức tích hợp bất biến (Idempotent Integration Bridge), cùng với phân hệ Edge Core làm nền tảng Cloudflare:

```
                                      [NGƯỜI DÙNG & TÁC NHÂN]
                                                 │
                   ┌─────────────────────────────┴─────────────────────────────┐
                   ▼                                                           ▼
      [CỘNG ĐỒNG / THANH NIÊN]                                    [CƠ QUAN CHUYÊN TRÁCH / CÁN BỘ]
       Citizen, Member, Moderator                                  Staff, Supervisor, Legal, Contractor
                   │                                                           │
                   ▼                                                           ▼
┌──────────────────────────────────────┐                   ┌──────────────────────────────────────┐
│  SIDE A: DustGuard Community         │                   │  SIDE B: DustGuard Operations        │
│  - Web SPA: Port 3000 (React/Vite)   │                   │  - Web SPA: Port 3002 (React/Vite)   │
│  - REST API: Port 3001 (Node/Express)│                   │  - REST API: Port 4000 (Node/Express)│
│  - CSDL: data/dustguard-community.db │                   │  - CSDL: dustguard-operations.db     │
│    (21 SQLite tables, WAL mode)      │                   │    (36 SQLite tables + FTS5 search)  │
└──────────────────┬───────────────────┘                   └──────────────────▲───────────────────┘
                   │                                                          │
                   │        HTTP Idempotent Handoff Webhook                   │
                   └──────────────────────────────────────────────────────────┘
                               (POST /api/integrations/community/cases)
                                                 │
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│  EDGE RUNTIME & CLOUDFLARE INFRASTRUCTURE (app/)                                                │
│  - Edge Worker: Hono Framework (Port 8787 / Cloudflare Edge)                                   │
│  - Cloudflare D1: prisma/dev.db (Local D1 Simulation via @prisma/adapter-d1)                    │
│  - Cloudflare R2: Object Storage lưu trữ ảnh bằng chứng, kiểm định mã băm SHA-256 nhị phân       │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. PHÂN HỆ CHI TIẾT: THÀNH PHẦN, CỔNG MẠNG & CSDL

### 2.1. Side A — DustGuard Community (Cổng Cộng Đồng & Giới Trẻ)
- **Mục tiêu**: Trao quyền cho người dân, học sinh - sinh viên, câu lạc bộ thanh niên và điều phối viên cộng đồng ghi nhận ô nhiễm bụi hiện trường, tích lũy tín chỉ hoạt động tình nguyện và kiến tạo minh chứng ban đầu.
- **Frontend SPA**:
  - Thư mục: `apps/web/`
  - Cổng mạng: `http://localhost:3000` (hoặc `http://127.0.0.1:3000`)
  - Công nghệ: React 19, Vite, Tailwind CSS (High-contrast Civic Light Mode, 0 Glassmorphism)
  - Điểm vào: `apps/web/src/App.tsx`, `apps/web/src/pages/LandingPage.tsx`
  - Quản lý phiên: `apps/web/src/context/AuthContext.tsx` (Lưu token trong `localStorage`, xác thực qua `GET /api/auth/me`)
- **Backend API Server**:
  - Thư mục: `apps/server/`
  - Cổng mạng: `http://localhost:3001` (hoặc `http://127.0.0.1:3001`)
  - Công nghệ: Node.js Express, TypeScript, `better-sqlite3`, JWT, Bcrypt
  - Điểm vào: `apps/server/src/index.ts`
- **Cơ sở dữ liệu**:
  - Đường dẫn vật lý: `data/dustguard-community.db`
  - Bản chất: SQLite 3 vật lý, kích hoạt WAL mode (`PRAGMA journal_mode = WAL;`)
  - Quy mô: **21 bảng**
  - Danh mục bảng chính:
    1. `users`: Tài khoản người dân, thành viên CLB, điều phối viên (`id`, `email`, `password_hash`, `role`, `status`...)
    2. `reports`: Tin báo ô nhiễm bụi từ hiện trường (`id`, `user_id`, `latitude`, `longitude`, `dust_level`, `status`...)
    3. `report_media`: Ảnh/video minh chứng kèm `sha256_hash`, kích thước byte và URL
    4. `confirmations`: Xác thực thực địa cộng đồng ("Tôi cũng ghi nhận") có ràng buộc `UNIQUE(user_id, report_id)`
    5. `cases`: Vụ việc do điều phối viên gộp/thành lập từ các báo cáo (`id`, `title`, `status`, `forwarded_at`...)
    6. `case_reports`: Bảng liên kết N-N giữa vụ việc và phản ánh gốc
    7. `case_updates`: Lịch sử cập nhật trạng thái vụ việc
    8. `observations`: Quan sát chuyên sâu hiện trường từ tình nguyện viên
    9. `communities`: Câu lạc bộ, đội nhóm thanh niên tình nguyện
    10. `community_members`: Danh sách thành viên tham gia đội nhóm
    11. `user_points`: Tích lũy tín chỉ hoạt động thanh niên (20h = 4.0 tín chỉ)
    12. `notifications`: Thông báo trong ứng dụng cho người dùng
    13. `audit_logs`: Nhật ký kiểm toán các thao tác bảo mật và quản trị
- **Vai trò (Roles) & Năng lực (Capabilities)**:
  - `citizen`: Gửi phản ánh (`report:create`), xem danh sách (`report:view`), xác nhận phản ánh (`report:confirm`), quản lý tài khoản cá nhân.
  - `community_member`: Các quyền của `citizen` + gửi quan sát chuyên sâu (`observation:create`), tham gia nhóm cộng đồng, tích lũy tín chỉ tình nguyện.
  - `moderator`: Các quyền của member + hàng đợi duyệt (`report:moderate`), xác thực tín hiệu (`report:verify`), gộp vụ việc (`case:create`), cập nhật trạng thái (`case:update_status`), chuyển tiếp chuyên trách (`case:forward_operations`).
  - `admin`: Toàn quyền hệ thống + quản trị người dùng (`user:manage`), phân vai trò (`user:change_role`), khóa tài khoản, xem audit log (`audit:view`).

---

### 2.2. Side B — DustGuard Operations (Cổng Cơ Quan Chuyên Trách & Pháp Lý)
- **Mục tiêu**: Công cụ làm việc chuyên nghiệp khép kín (Closed-loop Case Management) cho cán bộ thanh tra môi trường, lãnh đạo giám sát, chuyên viên pháp chế và nhà thầu thi công; xử lý triệt để vi phạm môi trường theo quy chuẩn nhà nước.
- **Frontend SPA**:
  - Thư mục: `dustguard-operations/apps/web/`
  - Cổng mạng: `http://localhost:3002`
  - Công nghệ: React 19, Vite, Tailwind CSS (Bố cục công năng chuyên dụng, High-Contrast)
  - Điểm vào: `dustguard-operations/apps/web/src/App.tsx`
  - Bàn làm việc chính: Dashboard, Case Inbox, Case Detail (70/30 Workspace), Field Inspection, Legal Workspace, Actions & Contractors, IoT Monitoring, Supervisor Workload, Admin Settings & Users.
- **Backend API Server**:
  - Thư mục: `dustguard-operations/apps/server/`
  - Cổng mạng: `http://localhost:4000`
  - Công nghệ: Express, TypeScript, `better-sqlite3`, FTS5 Full-Text Search, Zod, RFC 7807 Problem Details
  - Điểm vào: `dustguard-operations/apps/server/src/index.ts`
- **Cơ sở dữ liệu**:
  - Đường dẫn vật lý: `dustguard-operations/data/dustguard-operations.db`
  - Bản chất: SQLite 3 vật lý, kích hoạt WAL mode và extension FTS5
  - Quy mô: **36 bảng** (32 bảng nghiệp vụ chuẩn hóa + 4 bảng FTS5 virtual table)
  - Danh mục bảng chính:
    1. `users`: Cán bộ, lãnh đạo, chuyên viên pháp chế, nhà thầu, quản trị viên
    2. `sessions`: Phiên làm việc JWT có thời hạn và thu hồi
    3. `contractors`: Đơn vị thi công / nguồn thải gây ô nhiễm
    4. `projects`: Dự án/công trình xây dựng liên kết nhà thầu
    5. `cases`: Hồ sơ vụ việc vi phạm môi trường (mã `DG-YYYY-OP-XXX`)
    6. `case_timeline`: Lịch sử chuyển dịch trạng thái bất biến
    7. `case_assignments`: Phân công thụ lý chính / phối hợp cho cán bộ
    8. `evidence`: Tệp minh chứng hiện trường niêm phong mã băm SHA-256
    9. `inspections`: Đợt thanh tra/kiểm tra hiện trường theo biểu mẫu quy chuẩn
    10. `inspection_items`: Chi tiết đánh giá từng tiêu chí (PASS / FAIL / N_A)
    11. `findings`: Lỗi vi phạm phát hiện tại hiện trường
    12. `actions`: Lệnh yêu cầu khắc phục vi phạm (SLA 48h)
    13. `remediations`: Báo cáo kết quả khắc phục từ nhà thầu kèm bằng chứng
    14. `remediation_reviews`: Nghiệm thu kết quả khắc phục từ cán bộ
    15. `case_facts`: Tập dữ kiện thực tế tổng hợp từ CSDL (Zero-AI)
    16. `legal_documents`: Văn bản quy phạm pháp luật (NĐ 45/2022, Luật BVMT 2020, QCVN 18/BXD...)
    17. `legal_sections`: Điều/khoản/điểm của văn bản quy phạm pháp luật
    18. `legal_sections_fts`: Chỉ mục tìm kiếm toàn văn FTS5 (BM25 ranking)
    19. `legal_reviews`: Quyết định thẩm tra pháp lý chính thức của chuyên viên
    20. `tasks`: Tác vụ phân công điều hành nội bộ
    21. `iot_devices`: Thiết bị quan trắc bụi ngoài hiện trường (ESP32 APM2000)
    22. `sensor_readings`: Dữ liệu chuỗi thời gian nồng độ bụi PM2.5/PM10
    23. `system_configs`: Tham số cấu hình vận hành và ngưỡng cảnh báo
    24. `audit_logs`: Nhật ký kiểm toán bảo mật bất biến
- **Vai trò (Roles) & Năng lực (Capabilities)**:
  - `staff`: Tiếp nhận hồ sơ (`case:view`), phân loại (`case:triage`), thực hiện thanh tra (`inspection:perform`), ban hành lệnh khắc phục (`action:create`), thẩm tra khắc phục (`remediation:verify`).
  - `supervisor`: Toàn quyền điều phối hồ sơ, phân công cán bộ (`case:assign`), phê duyệt báo cáo, ký quyết định đóng vụ việc (`case:close`), mở lại vụ việc (`case:reopen`).
  - `legal_reviewer`: Đối soát quy chuẩn pháp lý (`legal:review`), tra cứu pháp điển FTS5, ban hành kết luận pháp lý chính thức.
  - `contractor`: Xem lệnh khắc phục liên quan công trình của mình, gửi báo cáo khắc phục kèm minh chứng (`remediation:submit`).
  - `admin`: Toàn quyền hệ thống, quản lý người dùng (`user:manage`), cấu hình tham số (`system:config`), xem audit trail (`audit:view`).

---

### 2.3. Cổng Tích Hợp Chuyển Giao (Integration Bridge)
- **Cơ chế**: Webhook HTTP Idempotent có cơ chế thử lại lũy thừa (Exponential Backoff).
- **Endpoint tiếp nhận**: `POST /api/integrations/community/cases` (trên Port 4000).
- **Mã nguồn kích hoạt**: `apps/server/src/utils/handoff.ts` khi Moderator chuyển trạng thái hồ sơ cộng đồng sang `'forwarded'`.
- **Hợp đồng dữ liệu**: `CommunityCaseImportSchema` tiếp nhận:
  - `source_community_id`: Mã định danh vụ việc bên Side A (ví dụ: `DG-C-2026-9874`)
  - `title`, `description`, `category`: Thông tin tóm tắt
  - `location`: Tọa độ vĩ độ/kinh độ, địa chỉ, quận/huyện
  - `evidence_hashes`: Mảng các mã băm SHA-256 của ảnh bằng chứng đã niêm phong
  - `reported_at`, `forwarded_by`: Người chuyển giao
- **Tính bất biến (Idempotency)**: Nếu gọi nhiều lần cùng `source_community_id`, hệ thống chỉ cập nhật thông tin bổ sung, tuyệt đối không sinh trùng lặp vụ việc mới trong CSDL Operations.

---

### 2.4. Phân Hệ Core / Cloudflare Edge Runtime (`app/`)
- **Vị trí**: Thư mục `app/`
- **Thành phần**:
  - Hono Framework Edge Worker chạy trên Cloudflare Workerd (`wrangler dev`).
  - Prisma Adapter D1 kết nối tới CSDL D1 mô phỏng `app/prisma/dev.db`.
  - Cloudflare R2 Bucket bindings phục vụ upload và đối chiếu băm SHA-256 nhị phân của tệp.
- **Phân định rõ ràng**:
  - `app/prisma/dev.db`: Là tệp SQLite cục bộ đóng vai trò **giả lập D1** trong môi trường kiểm thử máy trạm.
  - `dustguard-production` (Remote D1): Cơ sở dữ liệu phân tán trên mạng biên Cloudflare toàn cầu.
  - CSDL thật đang phục vụ Web/API trực tiếp trên máy người dùng là `data/dustguard-community.db` và `dustguard-operations/data/dustguard-operations.db`.

---

## 3. MA TRẬN TRUY VẾT GIAO DIỆN → API → CSDL (TRACEABILITY MATRIX)

| Giao diện (UI Route) | Hành động người dùng | API Endpoint gọi | Vai trò / Quyền | Thao tác CSDL (Table & Mutation) |
|---|---|---|---|---|
| `/login` (Port 3000) | Đăng nhập Cộng đồng | `POST /api/auth/login` | Public | Đọc `users`, ghi `audit_logs` |
| `/reports/new` (Port 3000) | Nộp phản ánh bụi hiện trường | `POST /api/reports` | Authenticated | Thêm `reports`, `report_media` |
| `/reports/:id` (Port 3000) | Bấm "Tôi cũng ghi nhận" | `POST /api/reports/:id/confirm` | Authenticated | Thêm `confirmations` (Unique) |
| `/moderator/inbox` (Port 3000) | Duyệt & tạo vụ việc | `POST /api/moderator/reports/:id/create-case` | `moderator`, `admin` | Thêm `cases`, cập nhật `reports` |
| `/moderator/kanban` (Port 3000) | Kéo thả sang "Chuyển tiếp" | `PUT /api/moderator/cases/:id/status` | `moderator`, `admin` | Cập nhật `cases.status='forwarded'` $\to$ Bắn Webhook Handoff sang Port 4000 |
| `/login` (Port 3002) | Đăng nhập Chuyên trách | `POST /api/auth/login` | Public | Đọc `users`, thêm `sessions`, `audit_logs` |
| `/cases` (Port 3002) | Lọc & Xem danh sách vụ việc | `GET /api/cases` | `case:view` | Đọc `cases` (Index `idx_cases_status_urgency`) |
| `/cases/:id` (Port 3002) | Phân công thụ lý cán bộ | `POST /api/cases/:id/assign` | `case:assign` | Cập nhật `cases.assigned_staff_id`, thêm `case_assignments`, `case_timeline` |
| `/cases/:id/inspections/new` (Port 3002) | Tạo đợt kiểm tra hiện trường | `POST /api/cases/:id/inspections` | `inspection:create` | Thêm `inspections`, sao chép mẫu sang `inspection_items` |
| `/inspections/:id` (Port 3002) | Nộp biên bản kiểm tra QCVN 18 | `POST /api/inspections/:id/submit` | `inspection:submit` | Cập nhật `inspections.status='COMPLETED'`, tự sinh `findings`, cập nhật `cases.status` |
| `/evidence` (Port 3002) | Tải tệp & Băm SHA-256 | `POST /api/evidence` | `evidence:create` | Ghi đĩa tệp nhị phân, tính SHA-256, thêm `evidence` |
| `/evidence` (Port 3002) | Kiểm định toàn vẹn băm | `POST /api/evidence/:id/verify-hash` | `evidence:view` | Đọc byte trên đĩa, băm lại SHA-256, so khớp, cập nhật `evidence.integrity_state` |
| `/legal/library` (Port 3002) | Tra cứu điều luật | `GET /api/legal/search` | `legal:view` | Truy vấn `legal_sections_fts MATCH ?` (BM25) |
| `/cases/:id/legal` (Port 3002) | Đối soát quy chuẩn pháp lý | `POST /api/cases/:id/legal/analyze` | `legal:review` | Chạy Rule Engine trên `case_facts` + FTS5, lưu `analysis_runs` |
| `/cases/:id/legal` (Port 3002) | Cán bộ ký kết luận pháp lý | `POST /api/cases/:id/legal/review` | `legal:review` | Ghi `legal_reviews`, cập nhật `cases.legal_status` |
| `/actions` (Port 3002) | Ban hành lệnh khắc phục SLA 48h | `POST /api/actions` | `action:create` | Thêm `actions`, gán hạn chót `deadline_at`, cập nhật `cases.status='ACTION_REQUIRED'` |
| `/actions/:id/remediation` (Port 3002) | Nhà thầu nộp minh chứng | `POST /api/actions/:id/remediation` | `remediation:submit` | Thêm `remediations`, cập nhật `actions.status='SUBMITTED'` |
| `/remediations` (Port 3002) | Cán bộ nghiệm thu hoàn thành | `PUT /api/actions/:id/verify` | `remediation:verify` | Ghi `remediation_reviews`, cập nhật `actions.status='VERIFIED'`, `cases.status='READY_TO_CLOSE'` |
| `/cases/:id` (Port 3002) | Lãnh đạo ký quyết định đóng | `POST /api/cases/:id/close` | `case:close` | Kiểm tra 4 điều kiện chốt chặn $\to$ Cập nhật `cases.status='CLOSED'`, ghi `case_timeline` |
| `/admin/settings` (Port 3002) | Lưu tham số hệ thống | `PATCH /api/admin/configs/:key` | `system:config` | Cập nhật `system_configs`, ghi `audit_logs` |
| `/admin/users` (Port 3002) | Khóa/Đổi vai trò người dùng | `PATCH /api/admin/users/:id` | `user:manage` | Cập nhật `users`, ghi `audit_logs` |

---

## 4. KẾT LUẬN KIỂM ĐỊNH HIỆN TRẠNG KIẾN TRÚC

1. **Tính độc lập & Sẵn sàng vận hành**: Cả hai phân hệ Side A (Port 3000/3001) và Side B (Port 3002/4000) đều sở hữu mã nguồn hoàn chỉnh, CSDL SQLite độc lập lưu tại `data/`, có đầy đủ migration tự động khi khởi động từ CSDL rỗng (Zero-Seed).
2. **Khắc phục hiểu lầm D1**: Hệ thống không gọi file SQLite trên ổ cứng là D1. SQLite là database cục bộ tiêu chuẩn, còn D1 là mục tiêu triển khai phân tán không máy chủ khi chạy trên Cloudflare Workers (`app/`).
3. **Mối liên kết thực tế**: Vụ việc được luân chuyển xuyên suốt từ tay người dân ngoài thực địa (Side A) đến bàn làm việc của thanh tra môi trường và pháp chế (Side B) thông qua Handoff Webhook, không có sự đứt gãy luồng nghiệp vụ.
