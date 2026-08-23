# Kiến Trúc Tổng Thể Hệ Thống DustGuard VN (System Architecture)

Hệ thống **DustGuard VN** được thiết kế theo kiến trúc CivicTech phân tán hiện đại, kết hợp Cloudflare Edge Workers, cơ sở dữ liệu SQLite D1 SSOT, hệ thống cảm biến quang học IoT có xác thực chữ ký số HMAC-SHA256, cùng giao diện điều hành tác nghiệp Staff Dashboard & Bản đồ GIS thời gian thực.

```mermaid
graph TD
    subgraph "1. Nguồn Dữ liệu Hiện trường"
        IOT["📡 Cảm biến IoT ESP32<br/>(HMAC SHA-256 Signed)"]
        CITIZEN["📱 Người dân / Tình nguyện viên<br/>(Mobile PWA / Portal)"]
        STAFF_INSP["👮 Cán bộ Thanh tra<br/>(Biên bản Hiện trường)"]
    end

    subgraph "2. Cloudflare Edge Gateway & Workers"
        EDGE_ROUTER["⚡ Cloudflare Worker (Hono Edge)"]
        AUTH_GUARD["🔐 Auth Guard (RBAC / Better-Auth)"]
        HMAC_VERIFY["🛡️ HMAC Signature Verifier"]
        IDEMPOTENCY["⏱️ Idempotency Protection Store"]
    end

    subgraph "3. Lớp Xử lý Nghiệp vụ (Domain Services)"
        RISK_ENGINE["⚙️ CPS Risk Engine (v1.0)"]
        LEGAL_ENGINE["⚖️ Legal Parser & Engine (NĐ 45 & 16)"]
        ALERT_ENGINE["🚨 Alert & SLA Watchdog"]
        AUDIT_SERVICE["📜 Append-Only Audit Logger"]
    end

    subgraph "4. Cơ sở Dữ liệu Bền vững (SSOT)"
        D1["🗄️ Cloudflare D1 (SQLite SSOT)<br/>- Sites, Cases, Alerts, Sensors<br/>- Legal Obligations, Youth Activities"]
        R2["🪣 Cloudflare R2 / Storage<br/>(Bằng chứng ảnh & Biên bản PDF ký số)"]
    end

    subgraph "5. Lớp Ứng dụng & Trực quan hóa"
        STAFF_DASH["🖥️ Staff Operation Dashboard<br/>(Priority Queue, 7-Step Pipeline)"]
        EXEC_DASH["📊 Executive Command Center<br/>(Báo cáo Điều hành & Chỉ đạo khẩn)"]
        GIS_MAP["🗺️ Không gian Giám sát GIS<br/>(Leaflet Hotspots & Heatmap)"]
    end

    IOT -->|Telemetry POST| HMAC_VERIFY
    CITIZEN -->|Phản ánh / Bằng chứng| EDGE_ROUTER
    STAFF_INSP -->|Biên bản / Ký số| EDGE_ROUTER

    HMAC_VERIFY --> EDGE_ROUTER
    EDGE_ROUTER --> AUTH_GUARD
    AUTH_GUARD --> IDEMPOTENCY
    IDEMPOTENCY --> RISK_ENGINE
    IDEMPOTENCY --> LEGAL_ENGINE
    IDEMPOTENCY --> ALERT_ENGINE

    RISK_ENGINE --> D1
    LEGAL_ENGINE --> D1
    ALERT_ENGINE --> D1
    ALERT_ENGINE --> AUDIT_SERVICE
    AUDIT_SERVICE --> D1

    EDGE_ROUTER --> R2

    D1 --> STAFF_DASH
    D1 --> EXEC_DASH
    D1 --> GIS_MAP
```

## Các Thành Phần Trọng Yếu:
1. **Edge Router (Hono on Cloudflare Workers)**: Xử lý các request với độ trễ siêu thấp (< 50ms), nạp song song dữ liệu từ D1.
2. **D1 SSOT Database**: Nguồn chân lý duy nhất lưu trữ toàn bộ thực thể: Công trình (Sites), Vụ việc (Cases), Cảm biến (Sensors), Phản ánh (Complaints), Biên bản (Draft Documents).
3. **CPS Risk Engine**: Tự động tính toán điểm rủi ro bụi từ 0-100 dựa trên nồng độ PM2.5/PM10, mật độ dân cư và lịch sử vi phạm.
4. **Staff Operation Dashboard**: Trung tâm tác nghiệp 7 bước khép kín cho cán bộ thanh tra theo quy chuẩn Nghị định 45/2022/NĐ-CP và Nghị định 16/2022/NĐ-CP.
