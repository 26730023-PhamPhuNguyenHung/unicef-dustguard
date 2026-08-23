# Luồng Dữ Liệu Xử Lý Cảnh Báo & Hồ Sơ Thanh Tra (Data Flow)

Tài liệu này mô tả luồng dữ liệu từ lúc cảm biến IoT hoặc người dân phát hiện phát tán bụi mịn, đi qua khâu tính điểm rủi ro CPS, phân loại tự động vào Hàng đợi Ưu tiên (Priority Queue) của Staff Dashboard, và hoàn tất theo quy trình 7 bước.

```mermaid
sequenceDiagram
    autonumber
    actor Sensor as 📡 Cảm biến IoT
    actor Citizen as 📱 Người dân
    participant Edge as ⚡ Cloudflare Worker
    participant Risk as ⚙️ CPS Risk Engine
    participant DB as 🗄️ Cloudflare D1
    actor Staff as 👮 Thanh tra viên
    actor Exec as 🏛️ Lãnh đạo Cơ quan

    alt Nguồn Dữ liệu: Cảm biến IoT
        Sensor->>Edge: POST /api/sensors/reading (HMAC-SHA256 Signed)
        Edge->>Edge: Xác minh chữ ký số pre-shared key
    else Nguồn Dữ liệu: Phản ánh Công dân
        Citizen->>Edge: POST /api/observations (Ảnh hiện trường + Tọa độ GPS)
        Edge->>Edge: Kiểm tra Idempotency Key & validate dữ liệu
    end

    Edge->>Risk: Tính toán CPS Risk Score (0 - 100)
    Risk->>DB: Lưu Sensor Reading / Observation & Update Site DustRiskScore

    alt Vượt ngưỡng Báo động Đỏ (PM2.5 > 150 µg/m³ hoặc Score >= 80)
        Edge->>DB: Tạo bản ghi Alert (Status: PENDING, SLA: 24h)
        Edge->>DB: Tự động khởi tạo Case (Status: SCREENING, Priority: P1)
    end

    Staff->>Edge: GET /api/staff/dashboard
    Edge->>DB: Song song truy vấn Sites, Cases, Alerts, Readings
    DB-->>Edge: Dữ liệu tổng hợp
    Edge-->>Staff: Render Priority Queue & Bản đồ GIS Hotspots

    Staff->>Edge: POST /api/cases/:id/go-on-site (Biên bản kiểm tra)
    Edge->>DB: Update Case Status -> ON_SITE, ghi Audit Log
    
    Staff->>Edge: POST /api/cases/:id/sanction (Dự thảo quyết định xử phạt)
    Edge->>DB: Lưu DraftDocument (Status: DRAFT)
    
    Exec->>Edge: POST /api/dashboard/documents/:id/quick-sign
    Edge->>DB: Ký số SHA-256 biên bản, chuyển trạng thái Case -> COMPLETED
    Edge-->>Citizen: Công khai kết quả xử lý vi phạm trên Cổng thông tin
```

## Các Mốc Trọng Yếu Trong Luồng:
1. **Kiểm tra chữ ký số HMAC**: Nếu chữ ký không khớp, API lập tức phản hồi mã lỗi `403 Forbidden` và đánh dấu cảm biến `TAMPERED`.
2. **Khởi tạo vụ việc tự động**: Khi nồng độ bụi vượt chuẩn nghiêm trọng, vụ việc được gắn nhãn `P1 KHẨN` với thời hạn SLA đếm ngược 24h.
3. **Ký số và Lưu vết**: Mọi thao tác biên bản, xử phạt đều được băm SHA-256 và lưu append-only vào bảng `audit_logs` để đảm bảo tính pháp lý không thể chối bỏ.
