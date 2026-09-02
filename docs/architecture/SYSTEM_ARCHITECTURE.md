# DUSTGUARD VN — KIẾN TRÚC TOÀN HỆ THỐNG (SYSTEM ARCHITECTURE SSOT)

> **Tài liệu tham chiếu**: `DG-ARCH-2026-SSOT`  
> **Nền tảng**: 100% Cloudflare Native Modular Monolith (Hono + Workers + D1 SQLite + R2 Storage)

---

## 1. SƠ ĐỒ TOÀN CẢNH HỆ THỐNG (END-TO-END SYSTEM GRAPH)

```mermaid
flowchart TB
  subgraph Actors ["Người Dùng & Thiết Bị Ngoại Vi"]
    CitizenUser["Cộng Đồng Dân Cư / Thanh Niên"]
    InspectorUser["Cán Bộ Thanh Tra Môi Trường"]
    ContractorUser["Đại Diện Nhà Thầu Thi Công"]
    ExecutiveUser["Lãnh Đạo & Sở TN&MT"]
    AdminUser["Quản Trị Viên Hệ Thống"]
    ESP32Device["Trạm Cảm Biến IoT ESP32 (APM2000)"]
  end

  subgraph Client_App ["Ứng Dụng Khách (Vite + React 19 SPA)"]
    CitizenApp["Citizen Mobile Portal (/citizen)"]
    CommunityApp["Youth Environmental Watch (/community)"]
    StaffApp["Staff Operations Hub (/staff)"]
    ContractorApp["Contractor Portal (/contractor)"]
    ExecutiveApp["Executive Intelligence Hub (/executive)"]
    AdminApp["Admin Management Portal (/admin)"]
  end

  subgraph Cloudflare_Edge ["Cloudflare Edge Gateway & Worker Runtime"]
    EdgeRouter["Hono Modular Router (worker.js)"]
    AuthLayer["Clerk & Hybrid RBAC Middleware"]
    RateLimiter["Anti-Spam & Ingestion Guard"]
    DocxEngine["OpenXML DOCX & Mammoth Legal Engine"]
    RiskEngineCore["Explainable Dust Risk Engine (0-100)"]
    StateMachine["7-Step Lifecycle State Machine"]
  end

  subgraph Persistence_Layer ["Lớp Dữ Liệu Bền Vững (Cloudflare SSOT)"]
    D1Database[("Cloudflare D1 Database (env.DB)")]
    R2Storage[("Cloudflare R2 Object Storage (env.EVIDENCE_BUCKET)")]
    AuditLedger[("Immutable Audit Trail (SHA-256)")]
  end

  CitizenUser --> CitizenApp
  InspectorUser --> StaffApp
  ContractorUser --> ContractorApp
  ExecutiveUser --> ExecutiveApp
  AdminUser --> AdminApp
  ESP32Device -->|POST /api/sensors/reading| EdgeRouter

  CitizenApp -->|REST API| EdgeRouter
  CommunityApp -->|REST API| EdgeRouter
  StaffApp -->|REST API| EdgeRouter
  ContractorApp -->|REST API| EdgeRouter
  ExecutiveApp -->|REST API| EdgeRouter
  AdminApp -->|REST API| EdgeRouter

  EdgeRouter --> AuthLayer
  EdgeRouter --> RateLimiter
  EdgeRouter --> DocxEngine
  EdgeRouter --> RiskEngineCore
  EdgeRouter --> StateMachine

  EdgeRouter --> D1Database
  EdgeRouter --> R2Storage
  EdgeRouter --> AuditLedger
```

---

## 2. NGUYÊN TẮC THIẾT KẾ KIẾN TRÚC (ARCHITECTURAL INVARIANTS)

1. **D1 SQLite is SSOT**: Không lưu trữ trạng thái nghiệp vụ lâu dài trên bộ nhớ tạm hay localStorage client.
2. **Zero Glassmorphism**: Toàn bộ giao diện tuân thủ bảng màu GovTech độ tương phản cao (`#FDFBF7` cream, `#231b14` ink, `#0d6f64` teal, `#9f241f` seal red).
3. **IoT is Optional**: Hệ thống hoạt động 100% ổn định ngay cả khi không có cảm biến vật lý trực tuyến (dựa trên quan sát cộng đồng).
4. **Explainable AI / Risk**: Mọi điểm rủi ro và khuyến nghị đều phải có căn cứ pháp lý và phân tích yếu tố cụ thể.
5. **Deterministic Auditability**: Mọi hành động nhạy cảm (ban hành quyết định, phê duyệt, nộp bằng chứng) đều được băm SHA-256 và lưu vết kiểm toán bất biến.
