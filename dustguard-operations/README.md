# DustGuard Operations — Staff Case Management, Legal Intelligence & Inspection Workflow

> **Nền tảng Quản lý Vụ việc, Trí tuệ Pháp lý & Quy trình Thanh kiểm tra Hiện trường dành cho Cán bộ Môi trường**  
> *Độc lập, Local-first, Zero-mock, High-contrast Civic Tech.*

---

## 1. Tổng Quan Dự Án (Project Overview)

**DustGuard Operations** là hệ thống web nội bộ chuyên trách dành cho Cán bộ vận hành (`staff`), Giám sát viên (`supervisor`), Chuyên viên pháp chế (`legal_reviewer`) và Quản trị viên (`admin`) trong công tác tiếp nhận, điều tra, xử lý và theo dõi các vụ việc ô nhiễm bụi/môi trường phát sinh từ cộng đồng và các nguồn giám sát đô thị.

Hệ thống số hóa và vận hành liền mạch **chu trình khép kín 10 bước (Closed-loop Lifecycle)**:
```
CASE INTAKE 
  → TRIAGE 
  → ASSIGNMENT 
  → LEGAL REVIEW 
  → INSPECTION 
  → FINDINGS 
  → CORRECTIVE ACTION 
  → REMEDIATION 
  → REINSPECTION 
  → CLOSURE
```

### Nguyên Tắc Cốt Lõi (Core Principles)
1. **D1 / SQLite là Single Source of Truth (SSOT)**: 100% dữ liệu nghiệp vụ, tệp chứng cứ, kết quả thanh tra và biên bản khắc phục được lưu trữ bền vững tại SQLite local (`data/dustguard-operations.db`) với WAL Mode và Foreign Keys bật. Tuyệt đối không mock, reload trang (F5) bảo toàn 100% trạng thái.
2. **Giao Diện Civic High-Contrast Chuẩn Mực**: Tông màu sáng `#FDFBF7` cream, chữ tối tương phản cao `#0F172A`, điểm nhấn đỏ hành chính `#9f241f`, tuyệt đối **không Glassmorphism**, hỗ trợ `scrollbar-gutter: stable`, `text-wrap: pretty`, mục tiêu chạm $\ge 44\text{px}$.
3. **Trí Tuệ Pháp Lý Phục Vụ (Citation-First Assistive AI)**: AI đóng vai trò trợ lý rà soát quy chuẩn (`Assistive`), không thay thế con người; bắt buộc viện dẫn chính xác điều khoản từ cơ sở dữ liệu pháp luật địa phương qua SQLite FTS5; ngắt kết nối API thì hệ thống fallback 100% sang Luật và Quy tắc cục bộ.
4. **Cổng An Toàn Đóng Vụ Việc (4-Condition Closure Safety Gate)**: Không cho phép đóng vụ việc tùy tiện nếu chưa hoàn thành thanh tra, chưa xử lý xong biên bản khắc phục, chưa có ý kiến pháp lý và chưa lập bản tóm tắt kết luận.

---

## 2. Kiến Trúc Hệ Thống (Architecture)

Dự án được cấu trúc theo mô hình monorepo tinh gọn:

```text
dustguard-operations/
├── apps/
│   ├── server/                   # Backend Express + TypeScript (Port 4000)
│   │   └── src/
│   │       ├── db/               # SQLite connection (WAL, FTS5), schema migrations & seeders
│   │       ├── middleware/       # Auth JWT, RBAC capability guard, request logging
│   │       ├── routes/           # 12 modules API (cases, legal, inspections, actions, closure...)
│   │       ├── services/         # LegalAIProvider, FTS5 Search, Audit Logger
│   │       └── index.ts          # Express App Entry & REST APIs
│   └── web/                      # Frontend React 18 + Vite + TypeScript (Port 3002)
│       └── src/
│           ├── components/       # Layout, Header, Sidebar, DevRoleSwitcher, Toast, Modals
│           ├── context/          # AuthContext, PermissionsProvider
│           ├── pages/            # 18 màn hình nghiệp vụ đầy đủ
│           └── index.css         # Tailwind + Civic High-Contrast Token System
├── packages/
│   └── shared/                   # Model dùng chung giữa Frontend & Backend
│       └── src/
│           ├── permissions.ts    # Centralized RBAC Capabilities & can() helper
│           ├── state-machine.ts  # canTransitionCase() State Engine & Matrix
│           └── types.ts          # TypeScript interfaces & Zod Schemas
├── data/
│   └── dustguard-operations.db  # CSDL SQLite SSOT thật (24 bảng + FTS5)
├── uploads/                      # Thư mục lưu trữ bằng chứng số (SHA-256)
├── scripts/
│   ├── dev.js                    # 1 lệnh khởi động đồng thời Backend (4000) & Frontend (3002)
│   └── setup.js                  # Khởi tạo CSDL, migrate schema và nạp seed data
└── tests/
    └── operations-api.test.js    # 15 kịch bản kiểm thử tích hợp tự động (Node 24 native runner)
```

---

## 3. Phân Quyền Theo Năng Lực (Roles & Capabilities)

Hệ thống áp dụng mô hình phân quyền tập trung (**Centralized Capability-Based Model**) thay vì kiểm tra tên role rải rác:

| Quyền hạn (Capability) | Cán bộ (`staff`) | Giám sát (`supervisor`) | Pháp chế (`legal_reviewer`) | Quản trị (`admin`) |
|---|:---:|:---:|:---:|:---:|
| `case:view` (Xem danh sách & chi tiết vụ việc) | ✅ | ✅ | ✅ | ✅ |
| `case:create` (Tạo vụ việc mới) | ✅ | ✅ | ❌ | ✅ |
| `case:triage` (Phân loại & tiếp nhận ban đầu) | ✅ | ✅ | ❌ | ✅ |
| `case:assign` / `reassign` (Phân công cán bộ) | ❌ | ✅ | ❌ | ✅ |
| `case:close` (Duyệt kết luận & đóng vụ việc) | ❌ | ✅ | ❌ | ✅ |
| `case:reopen` (Mở lại vụ việc đã đóng) | ❌ | ✅ | ❌ | ✅ |
| `legal:view` (Tra cứu thư viện quy chuẩn FTS5) | ✅ | ✅ | ✅ | ✅ |
| `legal:review` (Lập & ký duyệt biên bản pháp chế) | ❌ | ❌ | ✅ | ✅ |
| `inspection:create` / `perform` (Lập kế hoạch & đi thanh tra) | ✅ | ✅ | ❌ | ✅ |
| `action:create` / `verify` (Yêu cầu & xác minh khắc phục) | ✅ | ✅ | ❌ | ✅ |
| `workload:view` (Theo dõi tải công việc cán bộ) | ❌ | ✅ | ❌ | ✅ |
| `admin:users` / `audit` (Quản lý tài khoản & xem vết kiểm toán) | ❌ | ❌ | ❌ | ✅ |

---

## 4. Cấu Trúc Cơ Sở Dữ Liệu (Database Schema)

CSDL SQLite cục bộ gồm **24 bảng quan hệ** cùng **1 bảng ảo tìm kiếm toàn văn FTS5**:

1. `users`: Tài khoản, mật khẩu băm, vai trò và thông tin cá nhân.
2. `sessions`: Phiên đăng nhập JWT.
3. `cases`: Bản ghi trung tâm vụ việc (SSOT), tọa độ WGS84, nguồn tiếp nhận, trạng thái vận hành.
4. `case_timeline`: Lịch sử diễn tiến theo thời gian thực của vụ việc.
5. `staff_assignments`: Lịch sử phân công (PRIMARY, COLLABORATOR, LEGAL_REVIEWER) có hạn xử lý.
6. `evidence_assets`: Tệp ảnh/tài liệu hiện trường, mã băm SHA-256, liên kết đa hình (`source_type`).
7. `legal_documents`: Văn bản quy phạm pháp luật (Luật BVMT 2020, Nghị định 45/2022/NĐ-CP...).
8. `legal_sections`: Cấu trúc phân cấp (Chương, Điều, Khoản, Điểm) của văn bản.
9. `legal_sections_fts`: Bảng ảo **SQLite FTS5** đánh chỉ mục toàn văn nội dung pháp luật.
10. `legal_search_history`: Lịch sử truy vấn tra cứu của cán bộ.
11. `legal_analyses`: Nhật ký phân tích từ Trợ lý AI (lưu snapshot input, model, output JSON).
12. `legal_reviews`: Biên bản đánh giá pháp lý chính thức từ Chuyên viên Pháp chế.
13. `inspection_templates`: Mẫu biểu thanh tra chuẩn hóa theo lĩnh vực.
14. `inspection_template_items`: Chi tiết các tiêu chí kiểm tra trong từng mẫu biểu.
15. `inspections`: Đợt kiểm tra hiện trường (INITIAL, FOLLOW_UP, REINSPECTION).
16. `inspection_items`: Kết quả trả lời từng tiêu chí (PASS, FAIL, UNKNOWN, NOT_APPLICABLE).
17. `inspection_findings`: Các phát hiện vi phạm thực tế kèm mức độ rủi ro (LOW, MEDIUM, HIGH).
18. `corrective_actions`: Yêu cầu biện pháp khắc phục giao cho đơn vị vi phạm kèm thời hạn (`due_at`).
19. `remediation_submissions`: Báo cáo minh chứng khắc phục nộp từ cơ sở/nhà thầu.
20. `case_closures`: Quyết định đóng vụ việc, căn cứ kết luận, chữ ký giám sát.
21. `notifications`: Thông báo nội bộ theo thời gian thực.
22. `audit_logs`: Nhật ký kiểm toán bất biến (Immutable Audit Trail) cho mọi thao tác đột biến dữ liệu.
23. `integration_logs`: Nhật ký tiếp nhận API tích hợp từ DustGuard Community (chống trùng lặp Idempotency).
24. `system_configs`: Cấu hình hệ thống (SLA, dung lượng upload tối đa, AI Provider).

---

## 5. Cỗ Máy Trạng Thái Vụ Việc (Case State Machine)

Vụ việc được vận hành nghiêm ngặt qua 12 trạng thái; backend kiểm soát hợp lệ trước khi cho phép chuyển trạng thái:

```text
               [IMPORT / MANUAL]
                       │
                       ▼
                     [NEW]
                       │ (triage)
                       ▼
                   [TRIAGED]
                       │ (assign)
                       ▼
                   [ASSIGNED]
                    /      \
       (request legal)    (plan inspection)
                  ▼          ▼
           [LEGAL_REVIEW]  [INSPECTION_PLANNED]
                  \          /
                   ▼        ▼
            [INSPECTION_IN_PROGRESS]
                       │ (findings recorded)
                       ▼
               [ACTION_REQUIRED]
                       │ (corrective action issued)
                       ▼
                 [REMEDIATION]
                    /       \
      (reinspection needed)  (all actions verified)
                  ▼             ▼
           [REINSPECTION] ──► [READY_TO_CLOSE]
                                    │ (supervisor signs)
                                    ▼
                                 [CLOSED]
                                    │ (supervisor reopen)
                                    ▼
                                [REOPENED]
```

### Cổng Kiểm Soát Đóng Vụ Việc (Closure Safety Gate)
Hệ thống **từ chối** chuyển sang `CLOSED` nếu không thỏa mãn đồng thời 4 điều kiện:
1. Đã hoàn thành ít nhất 1 đợt thanh tra (`COMPLETED`).
2. Không còn bất kỳ yêu cầu khắc phục nào đang mở (`open_actions == 0`).
3. Đã có ý kiến đánh giá pháp chế của chuyên viên (`legal_review != null`).
4. Có tóm tắt kết luận và lý do đóng từ Giám sát viên.

---

## 6. Trí Tuệ Pháp Lý & AI Fallback (Legal Intelligence)

### Giao Diện Không Gian Pháp Lý 3 Cột (3-Pane Workspace)
Tại `/cases/:id/legal`, cán bộ được cung cấp không gian làm việc chuyên nghiệp:
- **Cột Trái (Left - 25%)**: Hồ sơ ngữ cảnh vụ việc, tọa độ, lịch sử phát hiện và ảnh chứng cứ.
- **Cột Giữa (Center - 45%)**: Bảng phân tích AI + Khu vực lập Biên bản Pháp chế của Chuyên viên.
- **Cột Phải (Right - 30%)**: Công cụ tra cứu Luật FTS5 thời gian thực và trích lục điều khoản gốc.

### Nguyên Tắc An Toàn Nghiệp Vụ (Assistive & Citation-First)
- AI **không bao giờ** kết luận phán quyết "Đây là hành vi vi phạm pháp luật".
- Ngôn từ chuẩn hóa: *"Có dấu hiệu cần đối chiếu quy chuẩn..."*, *"Căn cứ có thể liên quan..."*, *"Cần cán bộ thẩm tra bổ sung..."*.
- Mọi căn cứ pháp luật gợi ý bắt buộc phải đối soát với khóa ngoại `legal_section_id` thực tế trong SQLite. Nếu không khớp, UI sẽ gắn nhãn cảnh báo: **[CHƯA XÁC MINH NGUỒN]**.

### Cơ Chế Dự Phòng (AI Fallback Engine)
Nếu không có kết nối mạng hoặc không cấu hình API Key bên ngoài:
- Hệ thống kích hoạt **Local Rule-Based Legal Engine**.
- Tự động phân tích từ khóa vụ việc (bụi, công trình, che chắn, vận chuyển, xả thải...).
- Truy vấn FTS5 trực tiếp trong `data/dustguard-operations.db` để trích xuất các điều khoản liên quan trong Nghị định 45/2022/NĐ-CP và Luật Bảo vệ môi trường 2020.
- Trả về cấu trúc JSON hợp lệ chuẩn Zod, đảm bảo công việc của Cán bộ pháp chế không bị gián đoạn.

---

## 7. Hướng Dẫn Cài Đặt & Khởi Chạy (How to Run)

### Yêu Cầu Môi Trường
- **Hệ điều hành**: Windows (PowerShell), macOS, hoặc Linux.
- **Node.js**: Phiên bản 20+ hoặc 24+ LTS (đã tích hợp module `node:sqlite`).
- **Trình quản lý gói**: `npm`.

### Bước 1: Khởi tạo CSDL và nạp dữ liệu mẫu
Từ thư mục gốc dự án:
```powershell
node dustguard-operations/scripts/setup.js
```
*Lệnh này sẽ tự động chạy migration 24 bảng, FTS5 index, và nạp 26 vụ việc mẫu trải khắp 12 trạng thái cùng các biên bản thanh tra.*

### Bước 2: Khởi động hệ thống (1 Lệnh duy nhất)
```powershell
node dustguard-operations/scripts/dev.js
```
Hệ thống sẽ đồng thời khởi chạy:
- **Backend API**: `http://localhost:4000` (Express + SQLite)
- **Frontend Web**: `http://localhost:3002` (Vite + React)

---

## 8. Danh Sách Tài Khoản Thử Nghiệm (Demo Accounts)

Mật khẩu mặc định cho toàn bộ tài khoản: `password123`

| Họ và tên | Tên đăng nhập | Vai trò | Chức năng kiểm thử nổi bật |
|---|---|---|---|
| **Trần Văn Minh** | `supervisor1` | `supervisor` | Phân công cán bộ, xem tải công việc, duyệt đóng vụ việc, mở lại case |
| **Nguyễn Văn Hùng** | `staff1` | `staff` | Nhận vụ việc, lập kế hoạch kiểm tra, đi thanh tra mobile, tạo khắc phục |
| **Lê Thị Mai** | `staff2` | `staff` | Cán bộ kiểm tra hiện trường độc lập |
| **Luật sư Đặng Thu Thảo** | `legal1` | `legal_reviewer` | Không gian Pháp lý, chạy phân tích AI, lập biên bản pháp chế chính thức |
| **Quản trị viên Hệ thống** | `admin` | `admin` | Quản trị tài khoản, kiểm tra vết kiểm toán (Audit Trail) toàn hệ thống |

> **Lưu ý tiện ích**: Trong chế độ phát triển (`import.meta.env.DEV`), góc trên cùng bên phải giao diện có sẵn **Thanh Chuyển Nhanh Vai Trò (Dev Role Switcher)** giúp đổi vai trò chỉ bằng 1 cú nhấp chuột mà không cần đăng nhập lại.

---

## 9. Kiểm Thử Tự Động (Automated Testing)

Chạy bộ kiểm thử tích hợp 15 kịch bản tự động:
```powershell
npm --prefix dustguard-operations run test
```

### Kết Quả Kiểm Thử (15/15 Passed):
```text
✔ 1. Auth & JWT: Login with valid staff credentials (91.9ms)
✔ 2. Auth: Reject invalid password (23.3ms)
✔ 3. RBAC: Enforce role-based capabilities (74.4ms)
✔ 4. Cases: List cases with search, tabs, and computed operational flags (42.8ms)
✔ 5. Case State Machine: Enforce valid and invalid status transitions (63.2ms)
✔ 6. Assignment & Reassignment: Maintain audit trail and previous status (50.7ms)
✔ 7. Legal Search: SQLite FTS5 returns exact matches with snippet (14.5ms)
✔ 8. Legal Intelligence: Assistive AI Provider generates Zod-validated output (28.8ms)
✔ 9. Inspection: Create inspection and generate checklist from template (40.0ms)
✔ 10. Inspection Submission: Required validation and Findings auto-generation (56.6ms)
✔ 11. Corrective Action & Remediation Lifecycle (74.6ms)
✔ 12. Case Closure Safety Gate: Enforce 4 mandatory closure criteria (33.0ms)
✔ 13. Case Reopen: Supervisor can reopen closed case (40.9ms)
✔ 14. Community Integration Idempotency: Duplicate imports update without duplicate cases (25.2ms)
✔ 15. Audit Trail: All mutations write structured audit logs (0.2ms)

Tests: 15 passed, 0 failed, 15 total (Thời gian chạy: ~1.28 giây)
```

---

## 10. Hợp Đồng Tích Hợp DustGuard Community (Integration Contract)

Endpoint tiếp nhận vụ việc từ mạng lưới cộng đồng:
```http
POST /api/integrations/community/cases
Content-Type: application/json
```

### Cấu Trúc Dữ Liệu Gửi Đến (Request Payload):
```json
{
  "external_case_id": "COMM-2026-HN-8821",
  "case_code": "DG-2026-08821",
  "title": "Xe bồn bê tông xả nước rửa bẩn và rơi vãi cát đá gây bụi",
  "description": "Nhiều xe bồn rửa xe tràn nước ra lòng đường gây bùn lầy, khi nắng lên bốc bụi mù mịt.",
  "location": "Khu đô thị Ngoại Giao Đoàn, Phường Xuân Tảo, Bắc Từ Liêm, Hà Nội",
  "lat": 21.0645,
  "lng": 105.7981,
  "report_count": 8,
  "confirmation_count": 14,
  "evidence": [
    {
      "url": "/uploads/sample-evidence-1.svg",
      "mime_type": "image/svg+xml",
      "sha256": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
    }
  ],
  "timeline": [
    {
      "title": "Cộng đồng ghi nhận sự cố",
      "description": "8 tình nguyện viên đã xác minh tại hiện trường với 14 lượt xác nhận.",
      "timestamp": "2026-09-04T08:00:00Z"
    }
  ]
}
```

### Tính Bất Biến & Chống Trùng Lặp (Idempotency):
- `external_case_id` là định danh duy nhất.
- Nếu gửi lại payload có cùng `external_case_id`: Backend tự động cập nhật số lượng phản ánh (`source_report_count`), ghi log `integration_logs` với trạng thái `UPDATED_EXISTING` và **tuyệt đối không tạo bản ghi Case trùng lặp**.

---

## 11. Các Màn Hình Đã Hoàn Thành (Screens Implemented)

Hệ thống cung cấp trọn vẹn **18 màn hình chức năng**:
1. `Trang đăng nhập` (`/login`): Xác thực JWT, ghi nhận phiên làm việc.
2. `Bảng điều khiển Cán bộ` (`/dashboard`): Việc cần tôi xử lý, Hàng đợi cá nhân, Tải công việc giám sát.
3. `Hộp thư Vụ việc` (`/cases`): 10 tab trạng thái nghiệp vụ, bộ lọc quận huyện, cờ vận hành cảnh báo.
4. `Chi tiết Vụ việc` (`/cases/:id`): Thông tin SSOT, hành động kế tiếp ưu tiên (Dominant CTA), tóm tắt hiện trường.
5. `Kho Chứng cứ Số` (`/cases/:id/evidence`): Thư viện ảnh hiện trường, mã băm toàn vẹn SHA-256.
6. `Không gian Pháp lý 3 Cột` (`/cases/:id/legal`): Đối soát ngữ cảnh, phân tích AI, tra cứu Luật FTS5 và ký biên bản.
7. `Thư viện Quy chuẩn` (`/legal/library`): Đọc và tra cứu toàn văn Luật BVMT và các Nghị định.
8. `Danh sách Thanh tra` (`/inspections`): Quản lý các đợt kiểm tra theo tiến độ.
9. `Lập Kế hoạch Kiểm tra` (`/cases/:id/inspections/new`): Chọn mẫu biên bản chuẩn hóa, ấn định ngày giờ.
10. `Thanh tra Hiện trường Mobile-First` (`/inspections/:id`): Thiết kế tối ưu cho điện thoại (390x844), checklist cảm ứng lớn $\ge 44\text{px}$.
11. `Biên bản Kết quả Thanh tra` (`/inspections/:id/result`): Tổng kết tỷ lệ Đạt/Không đạt và trích xuất phát hiện vi phạm.
12. `Quản lý Khắc phục` (`/actions`): Theo dõi các biện pháp khắc phục quá hạn hoặc chờ duyệt.
13. `Thẩm định Báo cáo Khắc phục` (`/actions/:id/remediation`): Xem ảnh minh chứng sửa chữa, Duyệt hoặc Yêu cầu làm lại.
14. `Tiến trình Vụ việc` (`/cases/:id/timeline`): Dòng thời gian chi tiết theo chuẩn nguồn chân thực SSOT.
15. `Đóng Vụ việc` (`/cases/:id/close`): Cổng kiểm tra an toàn 4 điều kiện và xác nhận kết luận chính thức.
16. `Trung tâm Thông báo` (`/notifications`): Cập nhật thông báo phân công và nhắc việc khẩn cấp.
17. `Hồ sơ Cá nhân` (`/profile`): Chi tiết tài khoản và danh sách quyền hạn được cấp.
18. `Quản trị Người dùng & Kiểm toán` (`/admin/users`, `/admin/audit`): Quản trị nhân sự và truy vết kiểm toán toàn diện.

---
*© 2026 DustGuard VN Team. Phục vụ công tác thanh kiểm tra môi trường và thúc đẩy trách nhiệm giải trình đô thị.*
