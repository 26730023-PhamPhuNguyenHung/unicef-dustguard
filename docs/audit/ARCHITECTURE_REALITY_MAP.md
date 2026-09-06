# DUSTGUARD VN — BẢN ĐỒ THỰC TẾ KIẾN TRÚC HỆ THỐNG (ARCHITECTURE REALITY MAP)

> **Mã tài liệu**: `DG-ARCH-REALITY-01`  
> **Thời điểm lập**: 06/09/2026  
> **Tiêu chuẩn**: **CODE RUNTIME LÀ NGUỒN CHÂN LÝ DUY NHẤT (CODE RUNTIME IS SSOT).**

---

## 1. TỔNG QUAN PHÂN BỐ DỊCH VỤ VÀ CƠ SỞ DỮ LIỆU THỰC TẾ

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                DUSTGUARD VN SYSTEM                                     │
│                                                                                        │
│  ┌────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │     SIDE A — COMMUNITY / CITIZEN       │  │     SIDE B — OPERATIONS / REGULATOR  │  │
│  │                                        │  │                                      │  │
│  │  Frontend: apps/web (Port 3000)        │  │  Frontend: dustguard-operations/     │  │
│  │            Vite + React TSX            │  │            apps/web (Port 3002)      │  │
│  │                                        │  │            Vite + React TSX          │  │
│  │  Backend:  apps/server (Port 3001)     │  │  Backend:  dustguard-operations/     │  │
│  │            Node/Express REST API       │  │            apps/server (Port 4000)   │  │
│  │                                        │  │            Node/Express REST API     │  │
│  │  Database: data/                       │  │  Database: dustguard-operations/data/│  │
│  │            dustguard-community.db      │  │            dustguard-operations.db   │  │
│  │            (22 bảng SQLite, đo lại 06/09)│ │            (42 bảng SQLite, đo lại 06/09)││
│  └───────────────────┬────────────────────┘  └──────────────────▲───────────────────┘  │
│                      │                                          │                      │
│                      │        Giao thức Handoff Idempotent       │                      │
│                      └──────────────────────────────────────────┘                      │
│                               POST /api/integrations/community/cases (path đính chính)  │
│                               Không có xác thực x-service-key (đã kiểm chứng 06/09)     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. BẢNG DẪN CHIẾU CHI TIẾT TỪ GIAO DIỆN TỚI HẠ TẦNG LƯU TRỮ

```text
[Feature] Báo bụi công dân (Citizen Dust Report)
  ├── UI Page: apps/web/src/pages/CreateReportPage.tsx
  ├── Component: Wizard 4 bước + LeafletMap.tsx
  ├── Action: Bấm "Gửi phản ánh"
  ├── Endpoint: POST /api/reports, POST /api/reports/:id/media
  ├── Service: apps/server/src/repositories/index.ts (createReport, saveReportMedia)
  ├── DB Table: reports, evidences
  ├── Storage: SQLite SSOT + Local Disk / R2
  ├── Response: { success: true, report: { id, report_code, ... } }
  └── Downstream Dependency: Xuất hiện trong Moderation Queue của Điều phối viên.

[Feature] Bản nháp phản ánh công dân (Citizen Draft Autosave)
  ├── UI Page: apps/web/src/pages/CreateReportPage.tsx
  ├── Component: Badge trạng thái bản nháp + Phím Xóa nháp
  ├── Action: Tự động lưu sau 500ms khi người dùng nhập dữ liệu
  ├── Endpoint: N/A (Client Storage)
  ├── Service: useEffect debounce
  ├── DB Table: N/A
  ├── Storage: LocalStorage (Khóa: dustguard_draft_citizen_report)
  ├── Response: "Đã lưu bản nháp lúc HH:mm:ss"
  └── Downstream Dependency: Tự động khôi phục khi F5 trang; tự xóa khi submit thành công.

[Feature] Điều phối & Gộp phản ánh (Community Triage & Merge)
  ├── UI Page: apps/web/src/pages/CaseCoordinationPage.tsx
  ├── Component: Bảng Kanban điều phối + Drawer chi tiết
  ├── Action: Điều phối viên gộp tin báo vào vụ việc chung
  ├── Endpoint: POST /api/moderator/cases
  ├── Service: apps/server/src/routes/moderator.routes.ts
  ├── DB Table: cases, reports, case_timelines
  ├── Storage: SQLite SSOT
  ├── Response: { success: true, case: { case_code, ... } }
  └── Downstream Dependency: Cập nhật trạng thái các phản ánh thành 'merged'.

[Feature] Chuyển giao sang Thanh tra Cơ quan (Cross-Side Handoff)
  ├── UI Page: apps/web/src/pages/CaseCoordinationPage.tsx
  ├── Component: Nút "Chuyển giao cơ quan quản lý"
  ├── Action: Đổi trạng thái vụ việc sang 'forwarded'
  ├── Endpoint: POST /api/integrations/community/cases (gọi sang Side B Port 4000; path đính chính 06/09, trước đây ghi nhầm `/forward`)
  ├── Service: apps/server/src/utils/handoff.ts (forwardCaseToOperations), gọi từ apps/server/src/routes/moderator.routes.ts khi PATCH .../status newStatus='forwarded'
  ├── DB Table: cases (Side B), case_timeline (Side B)
  ├── Storage: SQLite SSOT (`dustguard-operations.db`)
  ├── Response: { success: true, action: 'CREATED_NEW'|'UPDATED', case_id, case_code }
  ├── Idempotency: đã kiểm chứng sống 06/09 — gửi lại cùng `external_case_id` cập nhật hồ sơ hiện hữu (`action:'UPDATED'`), không sinh bản ghi trùng.
  └── Downstream Dependency: Xuất hiện tức thì trong danh sách vụ việc (`GET /api/cases`) của Side B.

[Feature] Phân công thụ lý chính (Staff Assignment)
  ├── UI Page: dustguard-operations/apps/web/src/pages/CaseDetailPage.tsx
  ├── Component: Modal phân công cán bộ + Danh sách cán bộ
  ├── Action: Lãnh đạo gán vụ việc cho thanh tra viên
  ├── Endpoint: POST /api/cases/:id/assign
  ├── Service: dustguard-operations/apps/server/src/modules/cases/
  ├── DB Table: cases, assignments, audit_logs
  ├── Storage: SQLite SSOT (`dustguard-operations.db`)
  ├── Response: { success: true, case: { status: 'ASSIGNED', assigned_to: ... } }
  └── Downstream Dependency: Kích hoạt webhook đồng bộ sang Side A (trạng thái: 'under_review').

[Feature] Khảo sát hiện trường & Biên bản QCVN 18 (Field Inspection)
  ├── UI Page: dustguard-operations/apps/web/src/pages/FieldInspectionPage.tsx
  ├── Component: Phiếu kiểm tra 10 tiêu chí kỹ thuật + Chụp ảnh + GPS
  ├── Action: Lưu kết quả kiểm tra
  ├── Endpoint: POST /api/inspections/:id/submit
  ├── Service: dustguard-operations/apps/server/src/modules/inspections/
  ├── DB Table: inspections, inspection_items
  ├── Storage: SQLite SSOT
  ├── Response: { success: true, inspection: { ... } }
  └── Downstream Dependency: Cập nhật điểm tuân thủ và làm dữ kiện đầu vào cho Evidence Matrix.

[Feature] Ban hành Lệnh khắc phục vi phạm (Action Notice 48h)
  ├── UI Page: dustguard-operations/apps/web/src/pages/CaseDetailPage.tsx
  ├── Component: Form ban hành yêu cầu khắc phục
  ├── Action: Cán bộ đặt hạn chót 48h và gửi đơn vị thi công
  ├── Endpoint: POST /api/cases/:id/actions
  ├── Service: dustguard-operations/apps/server/src/modules/actions/
  ├── DB Table: actions
  ├── Storage: SQLite SSOT
  ├── Response: { success: true, action: { id, token, due_at, ... } }
  └── Downstream Dependency: Mở quyền truy cập cho nhà thầu tại Cổng tự phục vụ (`/contractor`).

[Feature] Cổng tự phục vụ nhà thầu (Contractor Remediation Portal)
  ├── UI Page: apps/web/src/pages/contractor/ContractorRemediationPage.tsx
  ├── Component: Before/After Uploader + Haversine Geofence 50m + Draft Autosave
  ├── Action: Nhà thầu nộp ảnh khắc phục và nội dung xử lý
  ├── Endpoint: POST /api/contractor/actions/:id/remediation
  ├── Service: apps/server/src/routes/contractor.routes.ts
  ├── DB Table: remediations, actions, evidences
  ├── Storage: SQLite SSOT (`dustguard-operations.db`)
  ├── Response: { success: true, remediation_id: ... }
  └── Downstream Dependency: Cảnh báo cán bộ thanh tra vào nghiệm thu.

[Feature] Thẩm tra dựa trên chứng cứ (Evidence-Grounded Decision Support)
  ├── UI Page: dustguard-operations/apps/web/src/pages/CaseDetailPage.tsx
  ├── Component: Tab "Hỗ trợ thẩm tra" + Explainability Drawer
  ├── Action: Tự động đối soát dữ kiện, băm SHA-256, FTS5 BM25 luật, Rule Engine
  ├── Endpoint: GET /api/cases/:id/decision-support
  ├── Service: dustguard-operations/apps/server/src/modules/decision-support/ (11 submodules)
  ├── DB Table: legal_sections_fts, evidence, decision_support_runs, human_decisions
  ├── Storage: SQLite SSOT
  ├── Response: { assessment, risk, facts[], evidenceMatrix[], ruleTrace[], legalReferences[] }
  └── Downstream Dependency: Hỗ trợ cán bộ ký nhận định chuyên viên trước khi đóng hồ sơ.

[Feature] Chốt chặn đóng hồ sơ (Closure Safety Gate)
  ├── UI Page: dustguard-operations/apps/web/src/pages/CaseDetailPage.tsx
  ├── Component: Nút "Phê duyệt đóng hồ sơ"
  ├── Action: Lãnh đạo bấm đóng hồ sơ
  ├── Endpoint: POST /api/cases/:id/close
  ├── Service: dustguard-operations/apps/server/src/modules/decision-support/closure/closureSafetyGate.ts
  ├── DB Table: cases, audit_logs
  ├── Storage: SQLite SSOT
  ├── Response: 200 OK nếu hợp lệ; 400/422 Bad Request nếu còn bằng chứng TAMPERED hoặc thiếu nhận định cán bộ
  └── Downstream Dependency: Bắn webhook đồng bộ Side A chuyển trạng thái thành 'resolved'.

[Feature] Vòng phản hồi người dân & Yêu cầu phúc tra (Citizen Feedback Loop)
  ├── UI Page: apps/web/src/pages/CaseDetailPage.tsx
  ├── Component: CitizenFeedbackSection.tsx (Chấm sao + Nhận xét + Nút Phúc tra)
  ├── Action: Người dân gửi đánh giá sau khi hồ sơ đã đóng
  ├── Endpoint: POST /api/cases/:id/feedback
  ├── Service: apps/server/src/routes/case.routes.ts (bắn webhook sang Side B)
  ├── DB Table: case_feedback (Side A), case_timelines (Side B)
  ├── Storage: SQLite SSOT
  ├── Response: { success: true, message: "Đã ghi nhận phản hồi" }
  └── Downstream Dependency: Hiện cảnh báo tái thẩm tra tại Side B nếu có yêu cầu phúc tra.
```
