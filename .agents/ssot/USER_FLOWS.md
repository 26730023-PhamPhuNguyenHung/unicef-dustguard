# DUSTGUARD VN — END-TO-END BUSINESS USER FLOWS (SSOT)

> **Đặc tả Chi Tiết Các Luồng Hành Trình Người Dùng End-to-End Toàn Hệ Thống**  
> **Áp dụng**: Đối chiếu trực tiếp giữa Giao diện (UI) ➔ API ➔ Thực thể (Entity) ➔ Xử lý lỗi (Failure Modes).

---

## 1. FLOW 1 — CÔNG DÂN GỬI PHẢN ÁNH Ô NHIỄM (CITIZEN REPORT FLOW)

```mermaid
sequenceDiagram
    autonumber
    actor Citizen as Người Dân / Thanh Niên
    participant UI as Citizen Portal UI
    participant API as Hono / Express API
    participant R2 as Cloudflare R2 Storage
    participant D1 as D1 SQLite DB
    participant Engine as Priority & Scoring Engine

    Citizen->>UI: Bật GPS, chọn vị trí & phân loại nguồn bụi
    Citizen->>UI: Chụp ảnh hiện trường ô nhiễm
    UI->>UI: Nén ảnh client-side & tính mã hash SHA-256
    UI->>R2: Upload ảnh lên Cloudflare R2
    R2-->>UI: Trả về R2 Evidence URL
    UI->>API: POST /api/observations {title, category, lat, lng, evidence_urls, hash}
    API->>API: Validate schema & kiểm tra giới hạn chống spam
    API->>Engine: Tính điểm Priority Score tự động theo mật độ dân cư
    API->>D1: INSERT INTO observations, INSERT INTO audit_logs
    D1-->>API: Observation created (obs_id)
    API-->>UI: 201 Created {observation}
    UI-->>Citizen: Hiển thị thông báo gửi thành công & mã theo dõi
```

- **Màn hình**: `src/modules/citizen/CitizenReport.jsx`
- **API Endpoint**: `POST /api/observations`
- **Xử lý lỗi (Failure Cases)**:
  - Mất kết nối mạng: Lưu nháp vào hàng đợi Offline Draft (`offline-drafts.js`), tự động đẩy lên khi có mạng lại.
  - Vị trí GPS sai số quá lớn (> 50m): Yêu cầu người dùng hiệu chỉnh ghim trên bản đồ.
  - Tải ảnh lỗi: Hiển thị nút "Thử tải lại ảnh" (Retry Upload), không cho phép gửi nếu chưa có ảnh hợp lệ.

---

## 2. FLOW 2 — CẢNH BÁO CẢM BIẾN IoT VƯỢT NGƯỠNG (SENSOR TELEMETRY VIOLATION)

```mermaid
sequenceDiagram
    autonumber
    participant Device as Trạm Quan Trắc IoT
    participant API as Ingestion API (worker.js)
    participant Engine as Telemetry & Risk Engine
    participant D1 as D1 SQLite DB
    participant Notify as Notification Service
    actor Staff as Đội Thanh Tra Môi Trường

    Device->>API: POST /api/sensors/telemetry {pm25, pm10, aqi, temp, hum, token_hash}
    API->>API: Xác thực chữ ký thiết bị (Device Token Authentication)
    API->>Engine: Kiểm tra tính hợp lệ dữ liệu (Chống Flatline, Spike nhân tạo)
    API->>D1: INSERT INTO sensor_telemetry
    alt Nồng độ PM2.5 > 150 µg/m³ kéo dài > 30 phút
        Engine->>D1: Tự động INSERT INTO cases (status: NEW, priority: CRITICAL)
        Engine->>D1: INSERT INTO audit_logs
        Engine->>Notify: Phát tín hiệu cảnh báo đỏ tới Trung tâm Điều hành
        Notify-->>Staff: Push Notification cảnh báo ô nhiễm khẩn cấp tại công trình X
    end
```

- **API Endpoint**: `POST /api/sensors/telemetry`, `POST /api/alerts`
- **Xử lý lỗi (Failure Cases)**:
  - Cảm biến gửi dữ liệu rác/lỗi CRC: Từ chối ghi log, kích hoạt cờ cảnh báo `SENSOR_ANOMALY`.
  - Thiết bị mất kết nối quá 15 phút: Tự động chuyển trạng thái trạm sang `OFFLINE`.

---

## 3. FLOW 3 — QUY TRÌNH THANH TRA THỰC ĐỊA (INSPECTOR FIELD WORKFLOW)

```mermaid
sequenceDiagram
    autonumber
    actor Staff as Cán bộ Thanh tra
    participant UI as Staff Console UI
    participant API as Backend API
    participant D1 as D1 SQLite DB
    actor Contractor as Nhà Thầu Thi Công

    Staff->>UI: Mở Priority Queue, chọn Case khẩn cấp nhất
    UI->>API: GET /api/cases/:id/detail
    API->>D1: SELECT case, site, sensor_history, observations
    D1-->>API: Trả về đầy đủ hồ sơ vụ việc
    API-->>UI: Render chi tiết hồ sơ vụ việc
    Staff->>UI: Đến hiện trường, thực hiện Checklist 10 tiêu chí QCVN
    Staff->>UI: Chụp ảnh hiện trường vi phạm & điền kết luận
    UI->>API: POST /api/inspections {case_id, checklist, violation_detected: 1}
    API->>D1: INSERT INTO inspections
    Staff->>UI: Ban hành lệnh khắc phục (Remediation Order, hạn 48h)
    UI->>API: POST /api/cases/:id/remediation {required_actions, deadline}
    API->>D1: INSERT INTO remediation_actions, UPDATE cases SET status = 'REMEDIATION_REQUIRED'
    API-->>Contractor: Gửi thông báo lệnh khắc phục vi phạm môi trường
```

- **Màn hình**: `src/modules/staff/StaffCaseDetail.jsx`, `StaffInspections.jsx`
- **API Endpoint**: `POST /api/inspections`, `POST /api/cases/:id/remediation`, `PATCH /api/cases/:id/transition`
- **Xử lý lỗi (Failure Cases)**:
  - Thanh tra viên không được phân công: API trả về `403 FORBIDDEN (RFC-7807)`.
  - Chưa tick đủ các mục checklist bắt buộc: UI khóa nút gửi và bôi đỏ các tiêu chí còn thiếu.

---

## 4. FLOW 4 — NHÀ THẦU XỬ LÝ KHẮC PHỤC & NGHIỆM THU (CONTRACTOR REMEDIATION & VERIFICATION)

```mermaid
sequenceDiagram
    autonumber
    actor Contractor as Nhà Thầu Thi Công
    participant UI_C as Contractor Portal
    participant API as Backend API
    participant D1 as D1 SQLite DB
    actor Staff as Cán bộ Thanh tra
    participant UI_S as Staff Console

    Contractor->>UI_C: Mở danh sách việc cần làm, chọn Lệnh khắc phục
    UI_C->>API: PATCH /api/contractor/actions/:id/status {status: 'IN_PROGRESS'}
    Contractor->>UI_C: Thực hiện dập bụi (phun nước, quây bạt, rửa xe)
    Contractor->>UI_C: Tải lên cặp ảnh đối chứng Before/After
    UI_C->>API: POST /api/contractor/actions/:id/submit {before_hash, after_hash, notes}
    API->>D1: UPDATE remediation_actions SET status = 'SUBMITTED', UPDATE cases SET status = 'VERIFICATION_PENDING'
    API-->>Staff: Thông báo: Nhà thầu đã gửi minh chứng khắc phục
    Staff->>UI_S: Xem so sánh trực quan Before / After
    alt Minh chứng đạt chuẩn
        Staff->>UI_S: Bấm "Nghiệm Thu Đạt Yêu Cầu"
        UI_S->>API: PATCH /api/contractor/actions/:id/review {decision: 'APPROVED'}
        API->>D1: UPDATE cases SET status = 'RESOLVED'
    else Minh chứng chưa đạt yêu cầu
        Staff->>UI_S: Bấm "Từ Chối / Yêu Cầu Làm Lại" kèm lý do
        UI_S->>API: PATCH /api/contractor/actions/:id/review {decision: 'REJECTED_RETRY', reason: '...'}
        API->>D1: UPDATE cases SET status = 'REMEDIATION_REQUIRED' (Tăng cấp độ phạt)
    end
```

- **Màn hình**: `src/modules/contractor/ContractorActionDetail.jsx`, `src/modules/staff/RemediationWorkspace.jsx`
- **API Endpoint**: `POST /api/contractor/actions/:id/submit`, `PATCH /api/contractor/actions/:id/review`
- **Xử lý lỗi (Failure Cases)**:
  - Tải lên ảnh After chụp quá xa tọa độ công trình (> 100m): Cảnh báo Geofence không hợp lệ.
  - Quá hạn SLA 48h mà chưa submit: Hệ thống tự động phạt tiền ký quỹ bảo vệ môi trường (CSR Escrow).

---

## 5. FLOW 5 — CHUYỂN TUYẾN HÀNH CHÍNH & ĐÓNG HỒ SƠ (CIVIC HANDOFF & CLOSURE)

```mermaid
sequenceDiagram
    autonumber
    actor Staff as Thanh Tra Viên / Admin
    participant UI as Staff Dossier Studio
    participant API as Backend API
    participant D1 as D1 SQLite DB
    actor Exec as Lãnh Đạo / Sở TNMT

    Staff->>UI: Bấm "Tạo Hồ Sơ Chuyển Tuyến (Civic Handoff Dossier)"
    UI->>API: POST /api/documents/generate-dossier {case_id}
    API->>API: Tổng hợp: Phản ánh gốc + Telemetry + Biên bản thanh tra + Ảnh đối chứng + Viện dẫn Luật QCVN
    API->>D1: INSERT INTO legal_documents, INSERT INTO handoff_tickets
    API-->>UI: Trả về file văn bản hành chính chuẩn A4
    Staff->>UI: Ký duyệt văn bản số (Digital Seal HMAC SHA-256)
    UI->>API: PATCH /api/documents/:id/sign
    API->>D1: UPDATE legal_documents SET status = 'SIGNED', UPDATE cases SET status = 'ESCALATED'
    API-->>Exec: Chuyển toàn bộ hồ sơ điện tử lên hệ thống quản lý nhà nước
```

---

## 6. FLOW 6 — TÍCH LŨY TÍN CHỈ & CẤP CHỨNG CHỈ THANH NIÊN (YOUTH GREEN CREDIT)

```mermaid
sequenceDiagram
    autonumber
    actor Youth as Sinh Viên / Tình Nguyện Viên
    participant UI as Youth Credits UI
    participant API as Backend API
    participant D1 as D1 SQLite DB
    participant Public as Cổng Tra Cứu Công Khai

    Youth->>UI: Điểm danh ca trực giám sát / chiến dịch làm sạch (Check-in)
    UI->>API: POST /api/youth/checkin {campaign_id, lat, lng, device_hash}
    API->>API: Kiểm tra Geofence và giới hạn chống spam thiết bị (1 ca/ngày/thiết bị)
    API->>D1: INSERT INTO youth_credits (hours: 4.0)
    alt Tổng giờ hợp lệ đạt 20.0 giờ (Tương đương 4.0 Tín chỉ)
        API->>API: Sinh mã chứng chỉ duy nhất & Ký số HMAC SHA-256
        API->>D1: INSERT INTO youth_certificates {cert_code, hours: 20, credits: 4.0, hash}
        API-->>UI: Cấp Chứng Chỉ Xanh Điện Tử Chuẩn A4
    end
    Public->>API: GET /api/public/certificates/:cert_code
    API->>API: Xác thực chữ ký số HMAC
    API-->>Public: Trả về kết quả xác thực hợp lệ của sinh viên
```
