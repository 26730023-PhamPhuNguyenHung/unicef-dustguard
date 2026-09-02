# DUSTGUARD VN — MA TRẬN MỨC ĐỘ HOÀN THIỆN TÍNH NĂNG (FEATURE COMPLETENESS MATRIX)

> **Mã tài liệu**: `DG-FEATURE-COMPLETE-2026`  
> **Nguyên tắc**: Chỉ được đánh dấu `COMPLETE` khi đáp ứng 100% tiêu chí DoD (UI, API thật, D1 Persistence, Auth đúng, Test tự động pass, Responsive đa màn hình).

---

| Tính năng cốt lõi (Core Feature) | UI Hoạt Động | API Endpoint Thật | D1 Persistence | Auth & RBAC | Test Suite | Responsive Mobile | Trạng Thái (Status) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1. Citizen Reporting (Phản ánh dân cư)** | ✅ Form 6 bước | ✅ POST `/api/complaints` | ✅ Bảng `complaints` | ✅ Public + Anti-spam | ✅ Pass | ✅ 360-1440px | `COMPLETE` |
| **2. Citizen Tracking (Tra cứu tiến độ)** | ✅ Timeline UI | ✅ GET `/api/complaints/:id`| ✅ Bảng `complaints` | ✅ Public lookup | ✅ Pass | ✅ 360-1440px | `COMPLETE` |
| **3. Youth Observation (Quan sát thanh niên)**| ✅ Observe Form | ✅ POST `/api/observations` | ✅ Bảng `observations`| ✅ Youth token | ✅ Pass | ✅ 360-1440px | `COMPLETE` |
| **4. Youth Credits (Chứng chỉ số QR)** | ✅ Certificate UI | ✅ POST `/api/youth/cert` | ✅ Bảng `youth_certs` | ✅ HMAC-SHA256 | ✅ Pass | ✅ 360-1440px | `COMPLETE` |
| **5. IoT Ingestion (Tiếp nhận số liệu)** | ✅ Telemetry UI | ✅ POST `/api/sensors/reading`| ✅ Bảng `readings` | ✅ Device Token HMAC | ✅ Pass | ✅ 360-1440px | `COMPLETE` |
| **6. Sensor Integrity (Kiểm toán cảm biến)** | ✅ Health Badge | ✅ GET `/api/sensors/audit` | ✅ Bảng `sensors` | ✅ Anomaly Check | ✅ Pass | ✅ 360-1440px | `COMPLETE` |
| **7. Explainable Risk (Đánh giá rủi ro)** | ✅ Factor Break | ✅ GET `/api/sites/:id/risk`| ✅ D1 Multi-signal | ✅ Deterministic | ✅ Pass | ✅ 360-1440px | `COMPLETE` |
| **8. Staff Work Queue (Hàng đợi công việc)** | ✅ Queue UI | ✅ GET `/api/cases` | ✅ Bảng `cases` | ✅ Staff / Admin | ✅ Pass | ✅ Responsive Cards| `COMPLETE` |
| **9. Case 7-Step Machine (Quy trình 7 bước)**| ✅ 7-Step Nav | ✅ POST `/api/cases/:id/*` | ✅ Bảng `case_history`| ✅ State Guard DAG | ✅ Pass | ✅ 360-1440px | `COMPLETE` |
| **10. Field Inspection (Thanh tra thực địa)** | ✅ 10 Checklist | ✅ POST `/api/inspections` | ✅ Bảng `inspections` | ✅ Staff Guard | ✅ Pass | ✅ Mobile Check | `COMPLETE` |
| **11. Evidence Vault (Kho bằng chứng)** | ✅ Gallery UI | ✅ POST `/api/upload` | ✅ Bảng `evidences` | ✅ SHA-256 Hash | ✅ Pass | ✅ 360-1440px | `COMPLETE` |
| **12. Contractor Remediation (Khắc phục)** | ✅ Action List | ✅ POST `/api/contractor/*`| ✅ Bảng `actions` | ✅ Contractor Role | ✅ Pass | ✅ 360-1440px | `COMPLETE` |
| **13. 24–48h Monitoring (Hậu kiểm)** | ✅ Trend Chart | ✅ GET `/api/sensors/readings`| ✅ D1 Time series | ✅ Staff Guard | ✅ Pass | ✅ 360-1440px | `COMPLETE` |
| **14. Auto Report Engine (Soạn thảo A4)** | ✅ A4 Preview | ✅ DOCX OpenXML Engine | ✅ `draft_documents` | ✅ Staff Guard | ✅ Pass | ✅ Desktop/Tablet | `COMPLETE` |
| **15. Executive Dashboard (KPI điều hành)** | ✅ 8 KPI Cards | ✅ GET `/api/executive/stats`| ✅ D1 Aggregates | ✅ Executive Role | ✅ Pass | ✅ 360-1440px | `COMPLETE` |
| **16. Risk Heatmap (Bản đồ nhiệt rủi ro)** | ✅ Leaflet Map | ✅ GET `/api/executive/map` | ✅ Lat/Lng + Risk | ✅ Drilldown Filter | ✅ Pass | ✅ 360-1440px | `COMPLETE` |
| **17. Executive Approval (Ký số điện tử)** | ✅ Signature UI | ✅ POST `/api/exec/approve` | ✅ Bảng `audit_logs` | ✅ Digital Audit Trail | ✅ Pass | ✅ 360-1440px | `COMPLETE` |
| **18. Admin Data Management (Seed/Reset)** | ✅ Seed Modal | ✅ POST `/api/admin/reset` | ✅ Canonical D1 Seed | ✅ Confirmation Guard | ✅ Pass | ✅ 360-1440px | `COMPLETE` |
| **19. OpenAPI & Swagger Documentation** | ✅ Swagger UI | ✅ GET `/api-docs` | ✅ Edge Cache 1h | ✅ Public Spec | ✅ Pass | ✅ 360-1440px | `COMPLETE` |
| **20. Zero Mock & Full Test Coverage** | ✅ 69 Suites | ✅ Real D1 Backend | ✅ D1 / SQLite SSOT | ✅ 534+ Tests Passing | ✅ Pass | ✅ All Screens | `COMPLETE` |
