# SCREEN-DATA-MATRIX — MAPPING DỮ LIỆU GIAO DIỆN & BACKEND D1

> **Cập nhật**: 2026-09-02 | **Kiến trúc SSOT**: Cloudflare D1 SQLite & REST Worker Endpoints | **Nguyên tắc**: Map, Không Invent

---

## 1. MAPPING DỮ LIỆU THEO 31 MÀN HÌNH

| Screen ID | UI Datum (Phần tử hiển thị trên giao diện) | DB Table | DB Column / Field | API Endpoint Hiện Tại | Trạng Thái Code |
|---|---|---|---|---|---|
| **PUB-01** | Chỉ số bụi trung bình theo quận, số vụ đã xử lý | `sites`, `cases` | `dustRiskScore`, `status` | `GET /api/public/landing-stats` | `CURRENT` |
| **PUB-02** | Danh sách trạm đo, tọa độ GPS, mức PM2.5/PM10 | `sensors`, `sites` | `coordinates`, `pm10`, `pm25` | `GET /api/sensors/locations` | `CURRENT` |
| **PUB-03** | Bảng xếp hạng tình nguyện Đoàn - Hội, giờ công hiến | `communities`, `volunteer_logs` | `volunteer_hours`, `member_count` | `GET /api/community/leaderboard` | `CURRENT` |
| **PUB-04** | Danh mục linh kiện BOM, thông số kỹ thuật cảm biến | Tĩnh (Hardcoded / Docs) | — | Client Static Resource | `CURRENT` |
| **PUB-05** | Danh sách tài khoản mẫu 5 vai trò | `users` | `email`, `role`, `full_name` | `GET /api/auth/demo-accounts` | `CURRENT` |
| **PUB-06** | Dòng dữ liệu telemetry giả lập PM10/PM2.5 | `sensor_readings` | `pm10`, `pm25`, `timestamp` | `POST /api/sensors/simulate` | `CURRENT` |
| **PUB-07** | Thông tin đăng nhập, phiên xác thực, JWT token | `users`, `profiles` | `email`, `role`, `status` | `POST /api/auth/login` | `CURRENT` |
| **PUB-08** | Trang khôi phục điều hướng 404 | Session Auth State | `user.role` | Client Routing | `CURRENT` |
| **CIT-01** | Phản ánh gần đây của tôi, tin tức khu dân cư | `complaints`, `sites` | `reporterName`, `siteId`, `status` | `GET /api/complaints/my` | `CURRENT` |
| **CIT-02** | Form gửi ảnh, tọa độ GPS hiện trường, nội dung | `complaints`, `evidences` | `address`, `description`, `url` | `POST /api/complaints` | `CURRENT` |
| **CIT-03** | Bảng danh sách phản ánh cá nhân đã gửi | `complaints` | `code`, `status`, `createdAt` | `GET /api/complaints/my` | `CURRENT` |
| **CIT-04** | Chi tiết phản ánh, ảnh Trước/Sau (Before/After) | `complaints`, `evidences`, `actions` | `url`, `sha256`, `status` | `GET /api/complaints/:id` | `CURRENT` |
| **CIT-05** | Thông tin cá nhân, tổng giờ tình nguyện, chứng nhận | `users`, `profiles`, `youth_credit_ledger`| `fullName`, `phoneNumber`, `credits` | `GET /api/community/profile` | `CURRENT` |
| **STF-01** | 12 Chỉ số ca trực, danh sách vụ việc ưu tiên cao | `cases`, `complaints`, `tasks` | `dustRiskScore`, `slaDeadline`, `severity` | `GET /api/staff/dashboard-stats` | `CURRENT` |
| **STF-02** | Danh mục công trình xây dựng, điểm Dust Risk Score | `sites` | `name`, `address`, `dustRiskScore` | `GET /api/sites` | `CURRENT` |
| **STF-03** | Chi tiết công trình, nhà thầu, trạm đo, lịch sử | `sites`, `sensors`, `cases` | `investorName`, `contractorName` | `GET /api/sites/:id` | `CURRENT` |
| **STF-04** | Danh sách vụ việc 7 bước DAG, SLA 48h | `cases` | `code`, `currentStep`, `slaDeadline` | `GET /api/cases` | `CURRENT` |
| **STF-05** | Workspace thụ lý vụ việc, chuyển bước, biên bản | `cases`, `evidences`, `draft_documents` | `status`, `findings`, `signedUrl` | `GET /api/cases/:id` | `CURRENT` |
| **STF-06** | Danh sách nhiệm vụ khảo sát, người phụ trách | `tasks` / `actions` | `title`, `assignee`, `dueDate` | `GET /api/tasks` | `CURRENT` |
| **STF-07** | Dòng dữ liệu cảm biến quan trắc 24/7 | `sensor_readings`, `sensors` | `pm10`, `pm25`, `timestamp` | `GET /api/sensors/readings` | `CURRENT` |
| **STF-08** | Danh sách cảnh báo vượt ngưỡng cần xử lý | `alerts` | `pm10Value`, `triggeredAt`, `status` | `GET /api/sensors/alerts` | `CURRENT` |
| **STF-09** | Danh sách báo cáo hành chính NĐ 30/2020 đã lập | `draft_documents` | `documentType`, `hash`, `signedAt` | `GET /api/documents` | `CURRENT` |
| **STF-10** | Thông tin cán bộ, đội phụ trách, ca trực | `users`, `profiles` | `department`, `phoneNumber` | `GET /api/staff/profile` | `CURRENT` |
| **STF-11** | Nhật ký tác nghiệp công vụ, lịch sử thay đổi | `audit_logs`, `case_status_history` | `actor_name`, `action`, `createdAt` | `GET /api/audit-logs` | `CURRENT` |
| **CON-01** | Bàn làm việc chỉ huy trưởng, việc khẩn cấp | `actions`, `cases` | `title`, `dueDate`, `status` | `GET /api/contractor/dashboard` | `CURRENT` |
| **CON-02** | Danh sách yêu cầu khắc phục, nộp ảnh đối chứng | `actions`, `evidences` | `evidenceUrl`, `sha256`, `status` | `GET /api/contractor/tasks` | `CURRENT` |
| **CON-03** | Danh mục hồ sơ vụ việc liên quan đến nhà thầu | `cases`, `contractor_explanations` | `explanation`, `evidenceUrls` | `GET /api/contractor/cases` | `CURRENT` |
| **CON-04** | Tổng hợp lịch sử tuân thủ môi trường định kỳ | `actions`, `draft_documents` | `status`, `createdAt` | `GET /api/contractor/reports` | `CURRENT` |
| **ADM-01** | Bảng điều hành hạ tầng D1, Worker, thống kê lỗi | `system_metadata`, `audit_logs` | System metrics | `GET /api/admin/metrics` | `CURRENT` |
| **ADM-02** | Danh sách người dùng, cập nhật vai trò RBAC | `users`, `profiles` | `email`, `role`, `status` | `GET /api/admin/users` | `CURRENT` |
| **ADM-03** | Cấu hình tham số ngưỡng QCVN, thời hạn SLA | `system_metadata` / Settings | Thresholds, SLA config | `GET /api/admin/settings` | `CURRENT` |

---

## 2. NGUYÊN TẮC NORMALIZATION & SAFE DEFAULTS TẠI FRONTEND

Theo quy chuẩn `api-data-contract-normalization.md`, tầng API Client (`app/src/lib/api/*`) bắt buộc:
1. **Unwrap an toàn**: Dữ liệu trả về dạng `{ data: { items: [...] } }` hoặc `{ data: [...] }` luôn được normalize về Array `[]` rỗng nếu null/undefined.
2. **Safe Object defaults**: Chi tiết entity luôn trả về `{}` an toàn, không bao giờ để `undefined` gây crash màn hình.
3. **Zero Truncate on UI**: Mã hồ sơ (`DG-2026-XXXX`), tên công trình, địa chỉ luôn được hiển thị trọn vẹn.
