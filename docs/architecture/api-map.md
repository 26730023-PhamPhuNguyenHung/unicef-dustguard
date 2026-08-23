# Sơ Đồ Hệ Thống API & Điểm Cuối (API Map)

Hệ thống API của **DustGuard VN** được tổ chức theo kiến trúc RESTful chuẩn hóa trên Cloudflare Hono Edge, phục vụ 4 nhóm phân hệ:

```mermaid
graph LR
    subgraph "1. Phân hệ Cán bộ Thanh tra (Staff Operations)"
        S1["GET /api/staff/dashboard<br/>(Tổng hợp KPIs, Priority Queue, IoT Network)"]
        S2["GET /api/cases<br/>POST /api/cases<br/>GET /api/cases/:id"]
        S3["POST /api/cases/:id/verify<br/>POST /api/cases/:id/assign<br/>POST /api/cases/:id/go-on-site"]
        S4["POST /api/cases/:id/request-explanation<br/>POST /api/cases/:id/sanction<br/>POST /api/cases/:id/complete"]
        S5["GET /api/inspections<br/>POST /api/inspections"]
        S6["GET /api/actions<br/>POST /api/actions/:id/verify"]
    end

    subgraph "2. Phân hệ Lãnh đạo & Điều hành (Executive)"
        E1["GET /api/executive/overview<br/>(Chỉ số rủi ro trung bình, bản đồ quận huyện)"]
        E2["GET /api/executive/priorities<br/>(Top vấn đề nóng & khẩn cấp)"]
        E3["GET /api/executive/sla<br/>(Tiến độ thanh tra & Hồ sơ quá hạn)"]
        E4["GET /api/executive/sensors<br/>(Kiểm toán tính toàn vẹn IoT)"]
        E5["POST /api/executive/cases/:id/escalate<br/>(Chỉ đạo thanh tra khẩn cấp)"]
        E6["POST /api/dashboard/documents/:id/quick-sign<br/>(Phê duyệt ký số văn bản)"]
    end

    subgraph "3. Phân hệ Cảm biến & Cảnh báo (IoT & Alerts)"
        I1["POST /api/sensors/reading<br/>(Ghi nhận nồng độ bụi HMAC Signed)"]
        I2["GET /api/alerts<br/>POST /api/alerts/scan"]
        I3["GET /api/alerts/stats<br/>GET /api/alerts/sensors"]
    end

    subgraph "4. Phân hệ Cộng đồng & Thanh niên (Community & Youth)"
        C1["GET /api/observations<br/>POST /api/observations"]
        C2["GET /api/campaigns<br/>POST /api/campaigns/:id/join"]
        C3["GET /api/youth/certificates/:id<br/>POST /api/youth/activities/submit"]
        C4["GET /api/environmental-categories"]
    end
```

## Bảng Tra Cứu Endpoint Trọng Tâm:

| HTTP Method | Đường dẫn Endpoint | Mô tả Chức năng | Phân quyền (RBAC) |
|---|---|---|---|
| `GET` | `/api/staff/dashboard` | Tải dữ liệu toàn diện cho Staff Dashboard (KPIs, Queue, Bản đồ, IoT) | Staff, Inspector, Admin |
| `POST` | `/api/sensors/reading` | Tiếp nhận telemetry từ cảm biến ESP32 (HMAC SHA-256) | Sensor Device |
| `GET` | `/api/cases` | Danh sách hồ sơ thanh tra 7 bước | Staff, Executive, Admin |
| `POST` | `/api/cases/:id/go-on-site` | Lập biên bản thanh tra hiện trường | Inspector, Staff |
| `POST` | `/api/dashboard/documents/:id/quick-sign` | Ký số phê duyệt văn bản xử phạt | Executive, Admin |
| `POST` | `/api/observations` | Tiếp nhận ghi nhận hiện trường từ công dân/tình nguyện viên | Public / Volunteer |
| `GET` | `/api/executive/overview` | Tổng quan điều hành môi trường đô thị | Executive, Admin |
