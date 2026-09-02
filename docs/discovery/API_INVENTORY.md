# API Inventory (Cloudflare Worker Hono Endpoints) — DustGuard VN

Hệ thống có 20 Router modules với 399 endpoint bindings xử lý toàn diện các luồng nghiệp vụ:

| Method | Path | Router Module | Auth / RBAC | Request Body | Response Shape | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/health` | `health.routes.js` | Public | None | `{ ok: true, status, database, storage }` | WORKING |
| `POST` | `/api/auth/login` | `auth.routes.js` | Public | `{ email, password }` | `{ success: true, token, user }` | WORKING |
| `GET` | `/api/auth/me` | `auth.routes.js` | Bearer | None | `{ success: true, user }` | WORKING |
| `GET` | `/api/sites` | `sites.routes.js` | Public / Staff | Query params (page, limit, risk) | `{ data: Site[], total, page }` | WORKING |
| `GET` | `/api/sites/:id` | `sites.routes.js` | Public / Staff | None | `{ data: SiteDetail }` | WORKING |
| `POST` | `/api/sites` | `sites.routes.js` | Staff / Admin | Site payload | `{ success: true, data: Site }` | WORKING |
| `GET` | `/api/cases` | `cases.routes.js` | Staff | Query params (stage, status) | `{ data: Case[], total }` | WORKING |
| `GET` | `/api/cases/:id` | `cases.routes.js` | Staff | None | `{ data: CaseDetail }` | WORKING |
| `POST` | `/api/cases/:id/verify` | `cases.routes.js` | Staff | `{ stage, outcome, notes }` | `{ success: true, data: Case }` | WORKING |
| `POST` | `/api/complaints` | `complaints.routes.js` | Public / Citizen | Observation & Evidence | `{ success: true, id, code }` | WORKING |
| `GET` | `/api/community/observations` | `community.routes.js` | Citizen | Query params | `{ data: Observation[] }` | WORKING |
| `GET` | `/api/community/youth/stats` | `community.routes.js` | Citizen / Youth | None | `{ hours, credits, activities }` | WORKING |
| `POST` | `/api/community/youth/claim` | `community.routes.js` | Citizen / Youth | `{ studentId, university }` | `{ certificateCode, qrSvg }` | WORKING |
| `GET` | `/api/sensors` | `sensors.routes.js` | Public / Staff | Query params | `{ data: Sensor[] }` | WORKING |
| `GET` | `/api/sensors/readings` | `sensors.routes.js` | Public / Staff | Query params (siteId, limit) | `{ data: Reading[] }` | WORKING |
| `GET` | `/api/contractor/tasks` | `contractor.routes.js` | Contractor Token | None | `{ data: ContractorTask[] }` | WORKING |
| `POST` | `/api/contractor/tasks/:id/remediate` | `contractor.routes.js` | Contractor Token | `{ images, explanation, lat, lng }` | `{ success: true, status }` | WORKING |
| `GET` | `/api/staff/dashboard` | `staff.routes.js` | Staff | None | `{ metrics, recentCases, alerts }` | WORKING |
| `GET` | `/api/staff/alerts` | `staff.routes.js` | Staff | Query params | `{ data: Alert[], count }` | WORKING |
| `GET` | `/api/executive/reports` | `executive.routes.js` | Staff / Exec | Query params | `{ reports: ReportSummary[] }` | WORKING |
| `POST` | `/api/storage/upload` | `storage.routes.js` | Authenticated | Multipart Form (File) | `{ url, key, hash, size }` | WORKING |
| `GET` | `/api/admin/system/data-stats` | `admin.routes.js` | Admin | None | `{ tables, rowCounts, status }` | WORKING |
