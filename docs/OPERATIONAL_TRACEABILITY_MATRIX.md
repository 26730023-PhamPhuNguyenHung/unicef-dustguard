# DUSTGUARD VN — OPERATIONAL TRACEABILITY MATRIX (SSOT)

> **Mục đích**: Bảng ma trận truy vết toàn diện (Forensic Traceability Matrix) đảm bảo 100% các luồng nghiệp vụ thực tế của người dùng (Citizen, Staff, Inspector, Contractor, Executive) đều được hiện thực hóa trọn vẹn từ UI -> API -> D1/R2 -> State Machine -> Audit Trail -> Automated Tests.

---

## 1. Traceability Matrix Tổng Thể

| Workflow | Actor | UI Component / Route | Production API / Endpoint | D1 Tables / Storage | State Machine | Audit Action | Automated Test | Status |
|---|---|---|---|---|---|---|---|---|
| **C1. Gửi phản ánh hiện trường** | Citizen | `/community/report` (`CitizenReport.jsx`) | `POST /api/complaints`, `POST /api/upload` | `complaints`, `evidences`, R2 Bucket | `PENDING` -> `SCREENING` | `COMPLAINT_CREATED` | `production-operational-e2e.test.js`, `citizen-workflow.test.js` | **PASS** |
| **C2. Tra cứu tiến độ Shopee code** | Citizen | `/community/track` (`CitizenTrack.jsx`) | `GET /api/complaints/:code` | `complaints`, `evidences`, `cases` | `SUBMITTED`..`RESOLVED` | `COMPLAINT_VIEWED` | `citizen-workflow.test.js` | **PASS** |
| **C3. Khám phá & Báo cáo cộng đồng** | Youth / Citizen | `/community/discover` (`CommunityDiscover.jsx`) | `GET /api/community/observations`, `POST /api/community/observations` | `observations`, `community_groups` | `DISCOVERED`..`LINKED` | `OBSERVATION_CREATED` | `youth-community.test.js` | **PASS** |
| **C4. Quy đổi Tín chỉ Xanh & Chứng nhận** | Youth | `/community/impact` (`CommunityImpact.jsx`) | `GET /api/youth/credits`, `POST /api/youth/claim`, `POST /api/youth/certificate` | `youth_credits`, `certificates` | `CLAIMED` -> `CERTIFIED` | `YOUTH_CERTIFICATE_ISSUED` | `youth-credits-audit.test.js` | **PASS** |
| **S1. Hàng đợi công việc ưu tiên (Task Center)** | Staff | `/staff/dashboard` (`StaffDashboard.jsx`) | `GET /api/staff/overview`, `GET /api/staff/tasks` | `cases`, `complaints`, `sensors`, `sites` | `PRIORITY_RANKED` | `STAFF_DASHBOARD_LOADED` | `staff-portal-parity.test.js` | **PASS** |
| **S2. Sàng lọc & Giao việc Triage** | Staff | `/staff/complaints` (`StaffComplaints.jsx`) | `POST /api/cases`, `PUT /api/complaints/:id` | `complaints`, `cases`, `case_timelines` | `SCREENING` -> `PREPARING` | `COMPLAINT_TRIAGED` | `production-operational-e2e.test.js` | **PASS** |
| **S3. Kiểm tra thực địa & 10 Tiêu chí QCVN** | Inspector | `/staff/inspections` (`StaffInspections.jsx`) | `POST /api/inspections`, `POST /api/upload` | `inspections`, `evidences`, `sites` | `PREPARING` -> `ON_SITE` | `INSPECTION_SUBMITTED` | `inspection-checklist.test.js` | **PASS** |
| **S4. Lập dự thảo & Thẩm định 7 bước** | Inspector / Staff | `/staff/cases/:id` (`StaffCaseDetail.jsx`) | `POST /api/cases/:id/verify`, `issueDecision`, `reportingDraft` | `cases`, `case_status_history`, `audit_logs` | `ON_SITE` -> `REPORTING` -> `APPRAISING` | `CASE_STATUS_TRANSITION` | `case-enforcement-dag-7steps.test.js` | **PASS** |
| **K1. Tenant Isolation & Danh sách công trình** | Contractor | `/contractor/dashboard` (`ContractorDashboard.jsx`) | `GET /api/contractor/dashboard`, `GET /api/contractor/projects` | `sites`, `actions`, `sensors` | `ISOLATED_TENANT` | `CONTRACTOR_DASHBOARD_ACCESS` | `contractor-ui-workspace.test.js` | **PASS** |
| **K2. Tiếp nhận & Thực hiện Khắc phục** | Contractor | `/contractor/actions/:id` (`ContractorActionDetail.jsx`) | `POST /api/contractor/actions/:id/acknowledge`, `/start` | `actions`, `cases`, `audit_logs` | `PENDING` -> `ACKNOWLEDGED` -> `IN_PROGRESS` | `ACTION_ACKNOWLEDGED` | `contractor-workflow.test.js` | **PASS** |
| **K3. Nộp Minh chứng & Đề xuất Thẩm định** | Contractor | `/contractor/actions/:id` (`ContractorActionDetail.jsx`) | `POST /api/contractor/actions/:id/evidence`, `/submit` | `actions`, `evidences`, `case_timelines` | `IN_PROGRESS` -> `PENDING_VERIFICATION` | `CONTRACTOR_REMEDIATION_SUBMITTED` | `contractor-workflow.test.js` | **PASS** |
| **K4. Chặn Tự Xác minh (Anti-Self-Verification)** | Contractor | UI & API Enforcement | `POST /api/cases/:id/verify` (Rejected 403) | `cases`, `audit_logs` | `BLOCKED` (403 Forbidden) | `UNAUTHORIZED_STATE_TRANSITION` | `contractor-workflow.test.js` | **PASS** |
| **K5. Zero-Login Quick Submit 50m Geofence** | Contractor | `/contractor/quick-submit` (`QuickSubmit.jsx`) | `POST /api/contractor/quick-submit` | `actions`, `evidences` | `GEOFENCE_VERIFIED` | `QUICK_SUBMIT_GEOFENCE_VALID` | `production-operational-e2e.test.js` | **PASS** |
| **E1. Executive Drill-down KPIs** | Executive | `/executive/dashboard` (`ExecutiveDashboard.jsx`) | `GET /api/executive/overview`, `GET /api/executive/priorities` | `sites`, `cases`, `sensors`, `complaints` | `AGGREGATED` | `EXECUTIVE_OVERVIEW_ACCESS` | `executive-contractor-youth-audit.test.js` | **PASS** |
| **E2. Chỉ đạo Khẩn cấp (SLA Escalation)** | Executive | `/executive/dashboard` (`ExecutiveDashboard.jsx`) | `POST /api/executive/cases/:id/escalate` | `cases`, `audit_logs` | `ESCALATED_P1` | `CASE_ESCALATE_P1` | `production-operational-e2e.test.js` | **PASS** |
| **E3. Phê duyệt & Ký số Điện tử Nghị định 30** | Executive | `/executive/dashboard` (`ExecutiveDashboard.jsx`) | `POST /api/executive/cases/:id/assign`, `/sign` | `cases`, `draft_documents`, `audit_logs` | `APPRAISING` -> `COMPLETED` | `EXECUTIVE_DIGITAL_SIGNATURE` | `test_audit.js` | **PASS** |
| **I1. Ingestion Telemetry HMAC-SHA256** | IoT Node | `POST /api/sensors/reading` | `POST /api/sensors/reading` | `sensors`, `sensor_readings` | `ACTIVE` | `TELEMETRY_INGESTED` | `telemetry-anomaly-pipeline.test.js` | **PASS** |
| **I2. Anomaly Flatline Tamper Detection** | IoT Pipeline | Background Worker | Sensor Health Audit | `sensors`, `audit_logs` | `FAULTY` | `SENSOR_TAMPER_SUSPECTED` | `telemetry-anomaly-pipeline.test.js` | **PASS** |
| **I3. Liveness Timeout & Offline Detection** | IoT Pipeline | Background Worker | Sensor Health Audit | `sensors`, `audit_logs` | `INACTIVE` / `OFFLINE` | `SENSOR_LIVENESS_TIMEOUT` | `telemetry-anomaly-pipeline.test.js` | **PASS** |
| **I4. Threshold Exceedance -> CPS & Task** | IoT Pipeline | Background Worker / Ingest | Sensor Threshold Engine | `alerts`, `sites`, `cases`, `tasks` | `CRITICAL` -> Task Spawn | `SENSOR_ALERT_TRIGGER` | `telemetry-anomaly-pipeline.test.js` | **PASS** |

---

## 2. Kết luận Kiểm toán Truy vết
- **100%** Luồng nghiệp vụ từ Citizen, Staff, Inspector, Contractor đến Executive đều có mã định danh truy vết.
- **Zero Mock** trong đường dẫn nghiệp vụ cốt lõi.
- **Dual Parity 100%** giữa Cloudflare Worker Edge và Node Express Server.
- Toàn bộ cơ sở dữ liệu D1 SQLite tuân thủ nghiêm ngặt tính toàn vẹn khóa ngoại (Foreign Keys) và lịch sử trạng thái đồng bộ nguyên tử.
