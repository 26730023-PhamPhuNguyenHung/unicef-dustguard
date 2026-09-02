# DUSTGUARD VN — LUỒNG DỮ LIỆU VẬN HÀNH (DATA FLOW DIAGRAMS)

> **Mã tài liệu**: `DG-DATAFLOW-2026-SSOT`

---

## 1. LUỒNG THU NHẬP DỮ LIỆU CẢM BIẾN (SENSOR INGESTION FLOW)

```mermaid
sequenceDiagram
  autonumber
  participant ESP as Cảm Biến ESP32 (APM2000)
  participant Edge as Cloudflare Worker Edge
  participant DB as Cloudflare D1 (env.DB)
  participant Risk as Explainable Risk Engine
  participant Staff as Staff Dashboard

  ESP->>Edge: POST /api/sensors/reading { deviceId, pm25, pm10, temp, hum, timestamp }
  Edge->>Edge: Kiểm tra HMAC Device Key, Time Drift & Physical Bounds (0-2500 µg/m³)
  Edge->>DB: Kiểm tra Flatline (5 bản ghi trùng liên tiếp) & Liveness (>15p)
  alt Nếu Flatline phát hiện
    Edge->>DB: Cập nhật sensor status = 'FAULTY' & Ghi AuditLog
  else Dữ liệu hợp lệ
    Edge->>DB: Lưu sensor_readings & Cập nhật sensor status = 'ACTIVE'
  end
  Edge->>Risk: Tính toán Data Integrity Score & Cập nhật Site Risk Score
  Risk-->>Staff: Real-time Alert & Tự động gom vụ việc theo cửa sổ hoạt động
```

---

## 2. LUỒNG PHẢN ÁNH CỘNG ĐỒNG (COMMUNITY ENGAGEMENT FLOW)

```mermaid
sequenceDiagram
  autonumber
  participant Citizen as Người Dân / Thanh Niên
  participant Portal as Citizen Portal Mobile Form
  participant Edge as Hono Edge Worker
  participant R2 as Cloudflare R2 Storage
  participant DB as Cloudflare D1
  participant Queue as Staff Work Queue

  Citizen->>Portal: Nhập phản ánh (6 bước: Sự việc, Vị trí/GPS, Mức độ, Ảnh, Liên hệ)
  Portal->>Edge: Nén ảnh client-side & Gửi POST /api/complaints
  Edge->>Edge: Kiểm tra Rate Limit & Anti-spam Fingerprint
  Edge->>R2: Lưu ảnh minh chứng (Base64/Binary) ➔ Trả về R2 Storage Key
  Edge->>DB: Tạo bản ghi `complaints` & Sinh mã tra cứu công khai `DG-YYYYMMDD-XXXX`
  Edge-->>Citizen: Phản hồi mã tra cứu & Hiển thị Timeline giám sát
  DB-->>Queue: Đẩy phản ánh mới vào hàng đợi công việc của Cán bộ thanh tra
```

---

## 3. LUỒNG XỬ LÝ & BÀN GIAO THỰC ĐỊA (ENFORCEMENT & REMEDIATION FLOW)

```mermaid
sequenceDiagram
  autonumber
  participant Staff as Cán Bộ Thanh Tra
  participant Contractor as Nhà Thầu Thi Công
  participant Legal as DOCX Legal Engine
  participant Exec as Lãnh Đạo Sở TN&MT

  Staff->>Staff: Tiếp nhận phản ánh ➔ Bắt đầu Thanh tra hiện trường (10 tiêu chí)
  Staff->>Staff: Lập biên bản kiểm tra & Giao biện pháp khắc phục (`actions`)
  Staff->>Contractor: Phân công nhiệm vụ khắc phục kèm hạn chót SLA
  Contractor->>Contractor: Thực hiện dập bụi/che chắn ➔ Nộp ảnh Trước/Sau (Before/After)
  Staff->>Staff: Bắt đầu theo dõi 24-48h (Monitoring Phase) qua cảm biến
  alt Nếu nồng độ PM giảm & Hiện trường đạt chuẩn
    Staff->>Legal: Soạn dự thảo báo cáo hoàn tất (Nghị định 30)
    Legal->>Exec: Chuyển Lãnh đạo thẩm định & Ký số điện tử SHA-256
    Exec->>Staff: Đóng hồ sơ vụ việc (`COMPLETED`) & Ghi sổ kiểm toán vĩnh viễn
  else Nếu tái diễn vi phạm
    Staff->>Legal: Tự động khởi tạo Hồ sơ xử phạt VPHC (Nghị định 45/2022)
  end
```
