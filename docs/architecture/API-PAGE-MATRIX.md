# API-PAGE-MATRIX.md — API Endpoint to Page & D1 Table Matrix

> Ma trận tích hợp toàn diện giữa API Router (`app/server/routes/api`), Pages giao diện, Phân quyền và Bảng dữ liệu D1.

---

## 🔌 API Mapping Matrix

| API Endpoint | HTTP | Phân Hệ | Sử Dụng Tại Pages | Vai Trò (Auth) | Bảng D1 Tương Tác |
|---|---|---|---|---|---|
| `/api/public/summary` | GET | Public | `LandingPage`, `CitizenPortal` | Public | `sites`, `complaints`, `cases` |
| `/api/public/stats` | GET | Public | `LandingPage` | Public | `complaints`, `actions`, `audit_logs` |
| `/api/complaints` | POST | Citizen | `CreateObservation`, `CitizenReport` | Public/Citizen | `complaints`, `evidences` |
| `/api/complaints/track` | GET | Citizen | `CitizenTrack` | Public/Citizen | `complaints`, `evidences` |
| `/api/complaints/:id` | GET | Community | `ObservationDetail` | Public/Community | `complaints`, `evidences`, `sites` |
| `/api/cases` | GET | Staff | `StaffDashboard`, `StaffCases` | Staff/Admin | `cases`, `sites`, `complaints` |
| `/api/cases/:id` | GET | Staff/Comm | `StaffCaseDetail`, `CommunityCaseWorkspace` | All (Filtered) | `cases`, `actions`, `evidences`, `case_timelines` |
| `/api/cases/:id/verify` | POST | Staff | `OperatorVerificationModal` | Staff/Operator | `cases`, `case_status_history`, `audit_logs` |
| `/api/sites` | GET | Staff | `StaffSites`, `StaffMap` | Staff/Admin | `sites`, `sensors` |
| `/api/sites/:id` | GET | Staff | `StaffSiteDetail` | Staff/Admin | `sites`, `sensors`, `cases`, `actions` |
| `/api/sensors/readings` | GET | Operations | `StaffOperations`, `ExecutiveHeatmap` | Staff/Executive | `sensor_readings`, `sensors` |
| `/api/sensors/reading` | POST | IoT Ingest | IoT Gateway / ESP32 Hardware | Device HMAC | `sensor_readings`, `alerts` |
| `/api/contractor/actions` | GET | Contractor | `ContractorActionList` | Contractor | `actions`, `sites` |
| `/api/contractor/actions/:id/evidence` | POST | Contractor | `ContractorActionDetail` | Contractor | `actions`, `evidences` |
| `/api/contractor/access/:token` | GET/POST | Contractor | `ContractorPortal` | Token (Zero-Login)| `actions`, `evidences` |
| `/api/youth/credits` | GET/POST | Youth | `CommunityImpact`, `YouthCredits` | Citizen/Youth | `users`, `complaints`, `actions` |
| `/api/documents` | GET/POST | Legal | `DocumentsListPage`, `DocumentEditorPage` | Staff/Executive | `draft_documents`, `document_revisions` |
| `/api/documents/:id/approve` | POST | Executive | `DocumentPreviewPage` | Executive | `draft_documents`, `audit_logs` |
| `/api/executive/overview` | GET | Executive | `ExecutiveDashboard` | Executive/Admin | `sites`, `cases`, `alerts`, `actions` |
| `/api/executive/heatmap` | GET | Executive | `ExecutiveHeatmap` | Executive/Admin | `sites`, `sensors`, `sensor_readings` |
