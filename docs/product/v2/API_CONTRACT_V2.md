# API CONTRACT V2 — DUSTGUARD VN
## Danh Mục API Endpoints Chuẩn Hóa Theo 8 Lát Cắt Tác Nghiệp (8 Vertical Slices)

> **Quy chuẩn**: RFC 7807 Problem Details cho lỗi, JSON Response chuẩn, Hono Worker routing.

---

## 1. TỔNG HỢP ENDPOINTS THEO 8 VERTICAL SLICES

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            8 VERTICAL SLICES ENDPOINTS                           │
├───────────────┬──────────────────────────────────────────┬───────────────────────┤
│ Slice 1       │ POST /api/complaints                     │ Dân gửi phản ánh      │
│ Slice 2       │ GET  /api/admin/inbox & POST /api/cases  │ Admin triage & tạo case│
│ Slice 3       │ POST /api/staff/cases/:id/assign         │ Giao cán bộ khảo sát  │
│ Slice 4       │ POST /api/inspections                    │ Cán bộ nộp biên bản   │
│ Slice 5       │ POST /api/contractor/tasks/dispatch      │ Ra lệnh cho nhà thầu  │
│ Slice 6       │ POST /api/contractor/tasks/:id/submit    │ Nhà thầu nộp ảnh After│
│ Slice 7       │ POST /api/staff/cases/:id/verify         │ Tái kiểm hiện trường  │
│ Slice 8       │ POST /api/staff/cases/:id/complete       │ Đóng case & công khai │
└───────────────┴──────────────────────────────────────────┴───────────────────────┘
```

---

## 2. CHI TIẾT CONTRACT CHO TỪNG SLICE

### Slice 1: Công Dân Gửi Phản Ánh
- **Endpoint**: `POST /api/complaints`
- **Quyền**: Public / Citizen (Zero-Login)
- **Request Body**:
  ```json
  {
    "title": "Bụi phát tán từ công trường Vành Đai 3",
    "description": "Xe chở đất làm rơi vãi đất cát trước cổng trường tiểu học",
    "category": "DUST_CONSTRUCTION",
    "lat": 10.7982,
    "lng": 106.7725,
    "imageUrl": "r2-key-photo-01.jpg",
    "sha256Hash": "8f3a9b24cd...5a02"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "data": {
      "id": "comp_0842",
      "code": "DG-2026-0842",
      "status": "RECORDED",
      "createdAt": "2026-09-02T08:15:00Z"
    }
  }
  ```

### Slice 2 & 3: Admin Triage & Giao Cán Bộ
- **Endpoint**: `POST /api/cases`
- **Quyền**: Admin
- **Request Body**:
  ```json
  {
    "complaintId": "comp_0842",
    "siteId": "site_vd3_anphu",
    "priority": "HIGH",
    "assignedTo": "user_inspector_lan",
    "slaDeadline": "2026-09-02T10:30:00Z",
    "instructions": "Khảo sát việc che chắn và rửa bánh xe tại cổng số 1"
  }
  ```
- **Response `201 Created`**: Trả về Case Entity với trạng thái `INSPECTION_ASSIGNED`.

### Slice 4: Cán Bộ Khảo Sát Hiện Trường & Nộp Biên Bản
- **Endpoint**: `POST /api/inspections`
- **Quyền**: Staff
- **Request Body**:
  ```json
  {
    "caseId": "case_0842",
    "checklist": [
      { "code": "TC-01", "status": "FAIL", "notes": "Lưới rách 30%" },
      { "code": "TC-02", "status": "FAIL", "notes": "Chưa có cầu rửa xe" }
    ],
    "pm25Measured": 142.5,
    "beforePhotoKeys": ["r2-before-01.jpg", "r2-before-02.jpg"],
    "conclusion": "FAIL",
    "recommendation": "Yêu cầu lắp giàn phun sương và quét rửa đường"
  }
  ```
- **Response `201 Created`**: Cập nhật case sang `INSPECTION_SUBMITTED`.

### Slice 5 & 6: Nhà Thầu Khắc Phục & Nộp Minh Chứng After
- **Endpoint**: `POST /api/contractor/tasks/:id/submit`
- **Quyền**: Contractor
- **Request Body**:
  ```json
  {
    "afterPhotoKeys": ["r2-after-01.jpg"],
    "sha256Hash": "1d9e5a02...b24c",
    "lat": 10.7981,
    "lng": 106.7724,
    "actionsCompleted": ["MIST_SPRAYING", "ROAD_SWEEPING", "NET_COVERING"],
    "notes": "Đã căng lưới che 100% và điều xe bồn tưới nước 3 lần/ngày"
  }
  ```
- **Response `200 OK`**: Tự động tính Geofence hợp lệ ($<50$m), cập nhật case sang `REMEDIATION_SUBMITTED` (Chờ tái kiểm).

### Slice 7 & 8: Tái Kiểm & Đóng Vụ Việc
- **Endpoint**: `POST /api/staff/cases/:id/verify` & `POST /api/staff/cases/:id/complete`
- **Quyền**: Staff / Admin
- **Request Body**:
  ```json
  {
    "reinspectionPm25": 28.0,
    "reinspectionPhotoKeys": ["r2-verify-01.jpg"],
    "notes": "Hiện trường đã sạch bụi, PM2.5 an toàn, đạt chuẩn QCVN 18"
  }
  ```
- **Response `200 OK`**: Case chuyển sang `COMPLETED`, ghi nhận thời gian hoàn tất `completed_at` để tính SLA.
