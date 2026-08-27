# DUSTGUARD VN — API CONTRACT SPECIFICATION (SSOT)

> **Đặc tả Chi Tiết Toàn Bộ Giao Diện Lập Trình Ứng Dụng (API Endpoints)**  
> **Áp dụng**: Đồng bộ 100% giữa Cloudflare Worker Hono Edge (`worker.js`) và Express Local Server (`server/routes/`).  
> **Chuẩn mã lỗi**: Chuẩn RFC-7807 Problem Details.

---

## 1. TIÊU CHUẨN MÃ LỖI RFC-7807 (ERROR FORMAT STANDARD)

Tất cả các API khi gặp lỗi phải trả về định dạng JSON thống nhất:
```json
{
  "type": "https://dustguard.vn/errors/FORBIDDEN",
  "title": "Truy cập bị từ chối",
  "status": 403,
  "detail": "Bạn không có quyền thao tác trên công trình này.",
  "instance": "/api/contractor/actions/act_123/submit",
  "code": "FORBIDDEN"
}
```

---

## 2. DANH MỤC API ENDPOINTS CHÍNH THỨC (API INVENTORY)

### 2.1. Phân Hệ Phản Ánh & Cộng Đồng (Observations & Community)

#### `GET /api/observations`
- **Mục đích**: Lấy danh sách phản ánh môi trường.
- **Quyền**: Public / Authenticated.
- **Query Params**: `page`, `limit`, `category`, `status`, `site_id`, `lat`, `lng`, `radius`.
- **Response (200 OK)**:
  ```json
  {
    "data": [
      {
        "id": "obs_1719283921_abc",
        "title": "Bụi mù mịt từ công trình",
        "category": "construction_dust",
        "latitude": 10.7769,
        "longitude": 106.7009,
        "status": "PENDING",
        "priority_score": 75.5,
        "evidence_urls": ["https://r2.../img1.jpg"],
        "created_at": "2026-08-27T10:00:00Z"
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 142 }
  }
  ```
- **Bảng tác động**: `observations`.

#### `POST /api/observations`
- **Mục đích**: Tạo phản ánh ô nhiễm mới.
- **Quyền**: Citizen, Youth, Guest (có giới hạn rate limit).
- **Request Body**:
  ```json
  {
    "title": "Bụi mù mịt từ công trình",
    "description": "Xe tải chở vật liệu không che chắn",
    "category": "construction_dust",
    "latitude": 10.7769,
    "longitude": 106.7009,
    "address": "123 Đường Nguyễn Huệ, Quận 1",
    "evidence_urls": ["https://r2.../img1.jpg"],
    "evidence_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }
  ```
- **Validation**: `title` không rỗng, `latitude` (-90 đến 90), `longitude` (-180 đến 180), `category` thuộc enum hợp lệ.
- **Bảng tác động**: `observations`, `audit_logs`.

---

### 2.2. Phân Hệ Hồ Sơ Vụ Việc & Thanh Tra (Cases & Inspections)

#### `GET /api/cases`
- **Mục đích**: Lấy danh sách hồ sơ vụ việc phục vụ Hàng đợi Ưu tiên (Priority Queue).
- **Quyền**: Staff, Executive, Admin.
- **Query Params**: `status`, `priority`, `inspector_id`, `site_id`, `is_overdue`.
- **Response (200 OK)**: Danh sách Case kèm điểm Priority Score đã sắp xếp từ cao xuống thấp.
- **Bảng tác động**: `cases`, `construction_sites`, `users`.

#### `GET /api/cases/:id`
- **Mục đích**: Lấy chi tiết toàn bộ hồ sơ vụ việc (Dossier View).
- **Quyền**: Staff, Contractor (chỉ case thuộc quyền), Executive, Admin.
- **Response (200 OK)**: Bao gồm Case Info, Lịch sử kiểm tra (`inspections`), Lệnh khắc phục (`remediation_actions`), Minh chứng Before/After, Lịch sử trạng thái (`case_status_history`).

#### `PATCH /api/cases/:id/transition`
- **Mục đích**: Chuyển trạng thái vụ việc tuân thủ Case State Machine.
- **Quyền**: Staff được phân công hoặc Admin.
- **Request Body**:
  ```json
  {
    "action": "confirm_violation",
    "notes": "Đo đạc nồng độ PM2.5 vượt 3.2 lần quy chuẩn QCVN 05:2023",
    "remediation_required": true,
    "deadline_hours": 48
  }
  ```
- **Side Effects**: Cập nhật `cases.status`, ghi `case_status_history`, ghi `audit_logs`, gửi thông báo cho Nhà thầu.

#### `POST /api/inspections`
- **Mục đích**: Nộp biên bản thanh tra thực địa.
- **Quyền**: Staff.
- **Request Body**:
  ```json
  {
    "case_id": "CASE-2026-0089",
    "checklist_results": { "water_spray": false, "tarpaulin_cover": false, "wheel_wash": true },
    "finding_summary": "Phát hiện không bật giàn phun sương dập bụi trong lúc xúc đất",
    "violation_detected": true,
    "evidence_urls": ["https://r2.../inspection1.jpg"]
  }
  ```
- **Bảng tác động**: `inspections`, `cases`, `audit_logs`.

---

### 2.3. Phân Hệ Nhà Thầu (Contractor Remediation)

#### `GET /api/contractor/actions`
- **Mục đích**: Lấy danh sách lệnh khắc phục vi phạm thuộc quyền quản lý của nhà thầu.
- **Quyền**: Contractor (Bắt buộc Object-Level check theo `contractor_id` trong token).
- **Response (200 OK)**: Danh sách Remediation Actions kèm đếm ngược SLA.

#### `POST /api/contractor/actions/:id/submit`
- **Mục đích**: Nhà thầu đệ trình minh chứng xử lý Before/After.
- **Quyền**: Contractor.
- **Request Body**:
  ```json
  {
    "before_image_url": "https://r2.../before.jpg",
    "before_image_hash": "a1b2c3...",
    "after_image_url": "https://r2.../after.jpg",
    "after_image_hash": "d4e5f6...",
    "contractor_notes": "Đã điều động 2 xe bồn phun sương liên tục và quây kín lưới chắn bụi"
  }
  ```
- **Bảng tác động**: `remediation_actions`, `contractor_submissions`, `cases`, `audit_logs`.

#### `PATCH /api/contractor/actions/:id/review`
- **Mục đích**: Cán bộ Thanh tra nghiệm thu minh chứng của nhà thầu.
- **Quyền**: Staff, Admin.
- **Request Body**:
  ```json
  {
    "decision": "APPROVED", // hoặc "REJECTED_RETRY"
    "feedback": "Minh chứng đạt yêu cầu dập bụi theo tiêu chuẩn",
    "rejection_reason": null
  }
  ```
- **Bảng tác động**: `remediation_actions`, `cases`, `audit_logs`.

---

### 2.4. Phân Hệ Tín Chỉ Thanh Niên (Youth Green Credits)

#### `POST /api/youth/checkin`
- **Mục đích**: Ghi nhận giờ tham gia tình nguyện / trực quan trắc.
- **Quyền**: Citizen / Youth.
- **Request Body**: `{ "campaign_id": "camp_01", "latitude": 10.776, "longitude": 106.700, "device_fingerprint": "dev_abc" }`.
- **Response**: `{ "hours_added": 4.0, "total_hours": 16.0, "current_credits": 3.2 }`.

#### `GET /api/youth/certificates`
- **Mục đích**: Lấy danh sách Chứng Chỉ Xanh đã cấp.
- **Quyền**: Authenticated (User sở hữu).

#### `GET /api/public/certificates/:code`
- **Mục đích**: Cổng tra cứu công khai tính hợp lệ của Chứng Chỉ Xanh.
- **Quyền**: Public (Không cần đăng nhập).
- **Response (200 OK)**:
  ```json
  {
    "valid": true,
    "certificate_code": "DG-YOUTH-2026-8942",
    "student_name": "Nguyễn Văn A",
    "organization": "Đoàn Trường ĐHQG",
    "volunteer_hours": 20.0,
    "credits_awarded": 4.0,
    "issued_at": "2026-08-27T10:00:00Z",
    "signature_hash": "9f83c6..."
  }
  ```

---

### 2.5. Phân Hệ Văn Bản Hành Chính & Chuyển Tuyến (Legal Documents & Handoff)

#### `POST /api/documents/generate-dossier`
- **Mục đích**: Tự động sinh hồ sơ chuyển tuyến A4 từ dữ liệu vụ việc.
- **Quyền**: Staff, Executive, Admin.
- **Bảng tác động**: `legal_documents`, `handoff_tickets`.

#### `PATCH /api/documents/:id/sign`
- **Mục đích**: Ký duyệt văn bản số pháp lý bằng mã băm SHA-256 HMAC.
- **Quyền**: Staff lãnh đạo hoặc Admin.
- **Bảng tác động**: `legal_documents`, `audit_logs`.

---

## 3. BẢNG PHÁT HIỆN LỖ HỔNG TÍCH HỢP (INTEGRATION GAP AUDIT)

| Loại Lỗ Hổng (Anomaly) | Tên Thành Phần / Endpoint | Chi Tiết Hiện Trạng Code | Giải Pháp Khắc Phục Chuẩn SSOT |
|---|---|---|---|
| **Orphan UI / Local State** | Nút "Ký số văn bản" trong `A4InteractiveEditor.jsx` | Đang gọi hàm `setStatus('SIGNED')` cục bộ trong React State. | Kết nối với `PATCH /api/documents/:id/sign`, cập nhật D1 và băm SHA-256. |
| **Dangerous Mock Fallback**| `StaffCases.jsx` & `StaffDashboard.jsx` | Fallback sang `mockCases = [{ id: 'CASE-2026-001' }]` khi API mạng chậm. | Xóa mảng mock, hiển thị Spinner Loading ➔ Render DB D1 thật ➔ Hiển thị Empty State nếu rỗng. |
| **Incomplete Backend Check** | `PATCH /api/contractor/actions/:id/review` | Một số branch express route chưa kiểm tra quyền `assigned_inspector_id`. | Thêm middleware `requireRole(['staff', 'admin'])` và kiểm tra quyền phụ trách hồ sơ. |
| **Unlinked UI Action** | Nút "Gán cảm biến vào công trình" trong Admin Data Management | Chưa có form UI gọi `POST /api/sensors/bind`. | Bổ sung Modal chọn công trình và gọi API `/api/sensors/bind` chuẩn D1. |
