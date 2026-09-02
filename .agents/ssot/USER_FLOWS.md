# DUSTGUARD VN — END-TO-END BUSINESS USER FLOWS (SSOT V2)

> **Bản quyền**: DustGuard VN — CivicTech Platform  
> **Trục định vị**: $\mathbf{SIGNAL} \longrightarrow \mathbf{UNDERSTAND} \longrightarrow \mathbf{ROUTE} \longrightarrow \mathbf{ACTION} \longrightarrow \mathbf{FOLLOW\text{-}UP} \longrightarrow \mathbf{VERIFY} \longrightarrow \mathbf{OUTCOME}$  
> **Slogan**: *"Phát hiện vấn đề. Chuyển đúng người. Theo dõi đến kết quả."*

---

## 1. FLOW 1 — CÔNG DÂN TẠO NGUỒN TÍN HIỆU & THEO DÕI (SIGNAL & FOLLOW-UP)

```mermaid
sequenceDiagram
    autonumber
    actor Citizen as Người Dân / Tình Nguyện Viên
    participant UI as Citizen App (/citizen/report/new)
    participant API as Edge Worker Router
    participant R2 as Cloudflare R2 Storage
    participant D1 as D1 SQLite DB

    Citizen->>UI: Chụp ảnh hiện trường phát tán bụi ngoài thực địa
    UI->>UI: Nén ảnh thích ứng < 300KB, gỡ EXIF nhạy cảm, tính mã băm SHA-256
    UI->>UI: Bật GPS tự động lấy tọa độ WGS84 (<50m)
    UI->>R2: Upload ảnh nhị phân lên Cloudflare R2
    R2-->>UI: Trả về object_key lưu trữ
    UI->>API: POST /api/complaints {title, description, lat, lng, image_url, sha256_hash}
    API->>API: Kiểm tra chống spam thiết bị (Anti-Spam Device Fingerprint)
    API->>D1: INSERT INTO complaints, INSERT INTO audit_logs
    D1-->>API: Ghi nhận thành công, sinh mã tra cứu (#DG-2026-XXXX)
    API-->>UI: 201 Created {complaint}
    UI-->>Citizen: Hiển thị mã vụ việc và liên kết theo dõi tiến trình
```

- **Màn hình**: `app/src/apps/citizen/pages/report-new/ReportNewPage.jsx`, `ReportsListPage.jsx`, `ReportDetailPage.jsx`
- **Mục tiêu người dùng**: Gửi phản ánh nhanh trong 30 giây và biết phản ánh của mình đang ở bước nào trong 7 bước.

---

## 2. FLOW 2 — TÍN HIỆU CẢNH BÁO TRẠM QUAN TRẮC (SENSOR SIGNAL INGESTION)

```mermaid
sequenceDiagram
    autonumber
    participant Station as Trạm Đo Bụi IoT
    participant API as Ingestion API
    participant Engine as Anomaly & Signal Engine
    participant D1 as D1 SQLite DB
    actor Staff as Cán bộ Quản lý

    Station->>API: POST /api/sensors/telemetry {pm25, pm10, temp, hum, token}
    API->>API: Xác thực chữ ký trạm đo (Device Token Authentication)
    API->>Engine: Kiểm tra dữ liệu bất thường (Chống flatline/stale > 2h)
    API->>D1: INSERT INTO sensor_readings
    alt Nồng độ PM2.5 > 100 µg/m³ kéo dài > 30 phút
        Engine->>D1: INSERT INTO alerts (status: NEW, severity: HIGH)
        Engine->>D1: INSERT INTO audit_logs
        API-->>Staff: Hiển thị tín hiệu cảnh báo trên Bàn làm việc cán bộ
    end
```

- **Màn hình**: `app/src/apps/staff/pages/monitoring/StaffMonitoringPage.jsx`, `StaffAlertsPage.jsx`
- **Tương tác**: Cán bộ bấm *"Tạo vụ việc"* hoặc *"Gắn vào vụ việc"* trực tiếp từ tín hiệu trạm đo.

---

## 3. FLOW 3 — CÁN BỘ ĐIỀU PHỐI & GIAO VIỆC (UNDERSTAND, ROUTE & DISPATCH)

```mermaid
sequenceDiagram
    autonumber
    actor Staff as Cán bộ Thanh tra
    participant UI as Staff App (/staff/cases/:id)
    participant API as Staff Domain API
    participant D1 as D1 SQLite DB
    actor Contractor as Đơn vị Xử lý / Nhà Thầu

    Staff->>UI: Xem Bàn làm việc (/staff), mở vụ việc cần xử lý
    UI->>API: GET /api/staff/cases/:id/detail
    API->>D1: SELECT case, site, sensor_history, observations, evidence
    D1-->>API: Trả về đầy đủ hồ sơ vụ việc
    API-->>UI: Hiển thị: Vấn đề, Lý do cần chú ý (NeedsAttentionReasons), Bước hiện tại
    Staff->>UI: Mở Modal Phân công: Chọn cán bộ khảo sát / Nhà thầu thi công, Hạn SLA 24-48h
    UI->>API: POST /api/staff/cases/:id/assign {assignedTo, dueDate, notes}
    API->>D1: UPDATE cases SET status = 'ASSIGNED', INSERT INTO tasks, INSERT INTO audit_logs
    API-->>Contractor: Gửi thông báo yêu cầu khắc phục kèm hạn chót
    UI-->>Staff: Cập nhật bước sang "Đã phân công / Yêu cầu xử lý"
```

- **Màn hình**: `app/src/apps/staff/pages/cases/CaseDetailPage.jsx`, `StaffDashboardPage.jsx`
- **Mục tiêu**: Nắm việc cần làm ngay trong ngày, hiểu rõ vì sao vụ việc cần ưu tiên và giao đúng người phụ trách.

---

## 4. FLOW 4 — ĐƠN VỊ XỬ LÝ KHẮC PHỤC & NỘP MINH CHỨNG (ACTION & EVIDENCE)

```mermaid
sequenceDiagram
    autonumber
    actor Contractor as Chỉ Huy Trưởng Nhà Thầu
    participant UI_C as Contractor App (/contractor/tasks)
    participant API as Contractor API
    participant R2 as Cloudflare R2 Storage
    participant D1 as D1 SQLite DB
    actor Staff as Cán bộ Giám sát

    Contractor->>UI_C: Xem danh sách yêu cầu cần làm hôm nay
    Contractor->>UI_C: Triển khai biện pháp dập bụi (Phun sương, quây lưới, quét đường)
    Contractor->>UI_C: Chụp ảnh sau xử lý (After Evidence) ngoài thực địa
    UI_C->>UI_C: Kiểm tra Geofence GPS (<50m quanh công trường) & tính mã băm SHA-256
    UI_C->>R2: Upload ảnh After
    UI_C->>API: POST /api/contractor/tasks/:id/submit {evidence_key, sha256_hash, notes}
    API->>D1: UPDATE tasks SET status = 'SUBMITTED', UPDATE cases SET status = 'PENDING_REVIEW'
    API->>D1: INSERT INTO audit_logs
    API-->>Staff: Thông báo: Đơn vị đã nộp minh chứng khắc phục, sẵn sàng tái kiểm
```

- **Màn hình**: `app/src/apps/contractor/pages/tasks/ContractorTasksPage.jsx`, `ContractorDashboardPage.jsx`
- **Mục tiêu**: Nắm rõ yêu cầu cần làm, thời hạn và nộp minh chứng Before/After để được nghiệm thu.

---

## 5. FLOW 5 — TÁI KIỂM THỰC ĐỊA & ĐÓNG VỤ VIỆC (VERIFY & OUTCOME)

```mermaid
sequenceDiagram
    autonumber
    actor Staff as Cán bộ Giám sát / Tình Nguyện Viên
    participant UI_S as Staff Case Workspace
    participant API as Staff Domain API
    participant D1 as D1 SQLite DB
    actor Citizen as Người Dân Phản Ánh
    actor Admin as Lãnh Đạo Quản Trị

    Staff->>UI_S: Mở hồ sơ Chờ tái kiểm, đối chứng cặp ảnh Before / After
    Staff->>UI_S: Kiểm tra checklist 10 tiêu chuẩn QCVN 18 & đo lại PM2.5 hiện trường
    alt Hiện trường Đạt Chuẩn (PM2.5 an toàn, đã che chắn/phun sương)
        Staff->>UI_S: Bấm "Duyệt Hoàn Tất & Đóng Vụ Việc"
        UI_S->>API: POST /api/staff/cases/:id/complete {notes: 'Tái kiểm đạt chuẩn QCVN'}
        API->>D1: UPDATE cases SET status = 'COMPLETED', completed_at = CURRENT_TIMESTAMP
        API->>D1: INSERT INTO audit_logs
        API-->>Citizen: Thông báo: Vụ việc đã được xử lý xong kèm ảnh nghiệm thu
        API-->>Admin: Cập nhật chỉ số SLA và tỷ lệ hoàn tất trên Bảng điều khiển
    else Chưa Đạt Chuẩn (Vẫn còn bụi phát tán)
        Staff->>UI_S: Bấm "Yêu Cầu Khắc Phục Lại" kèm lý do
        UI_S->>API: POST /api/staff/cases/:id/reopen {rejection_reason: '...'}
        API->>D1: UPDATE cases SET status = 'REJECTED', INSERT INTO audit_logs
    end
```

- **Màn hình**: `app/src/apps/staff/pages/cases/CaseDetailPage.jsx` (Tab Khắc phục / Nghiệm thu), `app/src/apps/admin/pages/dashboard/AdminDashboardPage.jsx`
- **Mục tiêu**: Đảm bảo vụ việc chỉ được đóng khi có kiểm tra lại thực tế đạt chuẩn môi trường.

---

## 6. FLOW 6 — TÍCH LŨY GIỜ TÌNH NGUYỆN & CHỨNG NHẬN SỐ (YOUTH CREDITS & QR)

```mermaid
sequenceDiagram
    autonumber
    actor Youth as Sinh Viên / Tình Nguyện Viên
    participant UI as Youth Credits App (/youth)
    participant API as Youth API
    participant D1 as D1 SQLite DB
    participant Public as Cổng Tra Cứu Công Khai

    Youth->>UI: Tham gia ca trực khảo sát thực địa & ghi nhận minh chứng
    UI->>API: POST /api/youth/claim-hours {activity_id, hours: 4.0}
    API->>D1: INSERT INTO youth_activities, UPDATE user_stats
    alt Đạt mốc 20.0 giờ tình nguyện (Tương đương 4.0 Tín chỉ)
        API->>API: Sinh mã chứng chỉ duy nhất & Ký số số hóa
        API->>D1: INSERT INTO youth_certificates {cert_code, hours: 20, credits: 4.0}
        API-->>UI: Cấp Giấy Chứng Nhận Điện Tử Chuẩn A4 kèm mã QR ISO/IEC 18004
    end
    Public->>API: GET /api/youth/certificate/:cert_code
    API-->>Public: Trả về kết quả xác thực hợp lệ của sinh viên
```

- **Màn hình**: `app/src/modules/youth/YouthCredits.jsx`
- **Mục tiêu**: Ghi nhận công sức đóng góp của thanh niên và sinh viên minh bạch, có thể kiểm chứng độc lập.
