# DustGuard Operations — Route & API Matrix

Ma trận toàn diện ánh xạ giữa giao diện người dùng (UI Route), giao thức backend (REST API), phân quyền RBAC (Role), thực thể cơ sở dữ liệu SQLite (Database Entity) và trạng thái kiểm thử.

| UI Route | Backend API | Role | Database Entity | CRUD Status | Browser Tested | Status |
|---|---|---|---|---|---|---|
| `/login` | `POST /api/auth/login` | Public | `users`, `sessions` | C | YES | PASS |
| `/dashboard` | `GET /api/dashboard/staff`, `GET /api/dashboard/supervisor` | All Roles | `cases`, `tasks`, `inspections`, `corrective_actions` | R | YES | PASS |
| `/cases` | `GET /api/cases`, `POST /api/cases` | All Roles | `cases`, `users` | CR | YES | PASS |
| `/cases/:id` | `GET /api/cases/:id`, `PATCH /api/cases/:id` | All Roles | `cases`, `case_timeline`, `staff_assignments` | RU | YES | PASS |
| `/cases/:id/evidence` | `GET /api/cases/:id/evidence`, `POST /api/evidence/upload` | Staff, Supervisor, Admin | `evidence_assets` | CR | YES | PASS |
| `/cases/:id/legal` | `GET /api/cases/:id/legal/reviews`, `POST /api/cases/:id/legal/review` | Legal Reviewer, Supervisor, Admin | `legal_reviews`, `legal_analyses` | CRU | YES | PASS |
| `/cases/:id/iot` | `GET /api/iot/devices`, `GET /api/iot/devices/:id/readings` | Staff, Supervisor, Admin | `iot_devices`, `iot_readings` | R | YES | PASS |
| `/cases/:id/inspection` | `GET /api/cases/:id`, `POST /api/cases/:id/inspections` | Staff, Supervisor, Admin | `inspections`, `inspection_items` | CR | YES | PASS |
| `/cases/:id/actions` | `GET /api/actions`, `POST /api/cases/:id/actions` | Staff, Supervisor, Admin | `corrective_actions` | CRU | YES | PASS |
| `/cases/:id/timeline` | `GET /api/cases/:id` | All Roles | `case_timeline` | R | YES | PASS |
| `/tasks` | `GET /api/tasks`, `POST /api/tasks`, `PATCH /api/tasks/:id` | Staff, Supervisor, Admin | `tasks` | CRU | YES | PASS |
| `/legal/library` | `GET /api/legal/documents`, `GET /api/legal/search` | All Roles | `legal_documents`, `legal_sections_fts` | R | YES | PASS |
| `/legal/import` | `POST /api/legal/import`, `POST /api/legal/documents` | Legal Reviewer, Admin | `legal_documents`, `legal_sections`, `legal_sections_fts` | CR | YES | PASS |
| `/legal/documents/:id` | `GET /api/legal/documents/:id` | All Roles | `legal_documents`, `legal_sections` | R | YES | PASS |
| `/inspections` | `GET /api/inspections`, `POST /api/cases/:id/inspections` | Staff, Supervisor, Admin | `inspections` | CR | YES | PASS |
| `/inspections/new` | `GET /api/inspection-templates`, `POST /api/cases/:id/inspections` | Staff, Supervisor, Admin | `inspections`, `inspection_templates` | CR | YES | PASS |
| `/inspections/:id` | `GET /api/inspections/:id`, `PATCH /api/inspections/:id`, `POST /api/inspections/:id/submit` | Staff, Supervisor, Admin | `inspections`, `inspection_items`, `inspection_findings` | RU | YES | PASS |
| `/inspections/:id/result` | `GET /api/inspections/:id` | Staff, Supervisor, Admin | `inspections`, `inspection_findings` | R | YES | PASS |
| `/actions` | `GET /api/actions`, `POST /api/cases/:id/actions`, `PATCH /api/actions/:id` | Staff, Supervisor, Admin | `corrective_actions` | CRU | YES | PASS |
| `/actions/:id/remediation` | `POST /api/actions/:id/remediation`, `POST /api/remediation/:id/review` | Staff, Supervisor, Admin | `remediation_submissions`, `corrective_actions` | CRU | YES | PASS |
| `/iot` / `/iot/devices` | `GET /api/iot/devices` | All Roles | `iot_devices`, `iot_readings` | R | YES | PASS |
| `/iot/devices/:id` | `GET /api/iot/devices/:id`, `GET /api/iot/devices/:id/readings` | All Roles | `iot_devices`, `iot_readings`, `iot_events` | R | YES | PASS |
| `/automations` | `GET /api/automations/rules`, `PATCH /api/automations/rules/:id`, `GET /api/automations/runs` | Supervisor, Admin | `automation_rules`, `automation_runs` | RU | YES | PASS |
| `/notifications` | `GET /api/notifications`, `POST /api/notifications/:id/read` | All Roles | `notifications` | RU | YES | PASS |
| `/profile` | `GET /api/auth/me` | All Roles | `users` | R | YES | PASS |
| `/supervisor/workload` | `GET /api/dashboard/supervisor`, `POST /api/cases/:id/assign`, `POST /api/cases/:id/reassign` | Supervisor, Admin | `users`, `cases`, `staff_assignments`, `tasks` | RU | YES | PASS |
| `/admin/users` | `GET /api/admin/users`, `POST /api/admin/users`, `PATCH /api/admin/users/:id` | Admin | `users`, `audit_logs` | CRU | YES | PASS |
| `/admin/audit` | `GET /api/admin/audit` | Supervisor, Admin | `audit_logs`, `users` | R | YES | PASS |
| `/admin/settings` | `GET /api/admin/configs`, `PATCH /api/admin/configs/:key` | Admin | `system_configs`, `audit_logs` | RU | YES | PASS |
| *(Integration)* | `POST /api/integrations/community/cases` | System / Internal API | `cases`, `case_timeline`, `integration_logs` | CR | YES | PASS |
| *(IoT Ingestion)* | `POST /api/iot/ingest` | Sensor Hardware / Firmware | `iot_readings`, `iot_devices`, `iot_events` | C | YES | PASS |
| *(Case State Machine)* | `POST /api/cases/:id/transition` | Staff, Supervisor, Admin | `cases`, `case_timeline`, `audit_logs` | U | YES | PASS |
| *(Decision Pack)* | `GET /api/cases/:id/decision-pack` | All Roles | `cases`, `evidence_assets`, `legal_reviews`, `inspections` | R | YES | PASS |
