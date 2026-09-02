# Route Inventory — DustGuard VN

| Route | Screen | Layout | Access | Data source | Status |
|---|---|---|---|---|---|
| `/` | `LandingPage.jsx` | Public Root Layout | Public | Static + API stats | WORKING |
| `/demo` | `DemoHub.jsx` | Public Root Layout | Public | D1 demo records + Quick switches | WORKING |
| `/demo/iot` | `IoTDemo.jsx` | Public Root Layout | Public | IoT telemetry emulator / D1 | WORKING |
| `/youth` | `YouthCredits.jsx` | Public / Youth Layout | Public / Student | D1 `youth_activities`, `youth_certificates` | WORKING |
| `/map` | `CitizenMap.jsx` | Public / Citizen Map Layout | Public | D1 `sites`, `sensors`, WGS84 GeoJSON | WORKING |
| `/guide` | `SensorGuide.jsx` | Public Root Layout | Public | Static sensor guide documentation | WORKING |
| `/login` | `Login.jsx` | Auth Layout | Public | API `/api/auth/login` | WORKING |
| `/citizen` | `CitizenHomePage.jsx` | `CitizenLayout.jsx` | Citizen / Youth | D1 `observations`, `campaigns`, stats | WORKING |
| `/citizen/report/new` | `ReportNewPage.jsx` | `CitizenLayout.jsx` | Citizen | D1 `observations`, R2 evidence uploads | WORKING |
| `/citizen/reports` | `ReportsListPage.jsx` | `CitizenLayout.jsx` | Citizen | D1 `observations`, `follow_ups` | WORKING |
| `/citizen/reports/:id` | `ReportDetailPage.jsx` | `CitizenLayout.jsx` | Citizen | D1 `observations`, `observation_evidence` | WORKING |
| `/citizen/profile` | `CitizenProfilePage.jsx` | `CitizenLayout.jsx` | Citizen / Student | D1 `users`, `youth_activities`, QR credits | WORKING |
| `/staff` | `StaffDashboardPage.jsx` | `StaffLayout.jsx` | Staff / Inspector | D1 `/api/staff/dashboard` (12 metrics) | WORKING |
| `/staff/sites` | `SitesListPage.jsx` | `StaffLayout.jsx` | Staff | D1 `/api/sites` (33 active sites) | WORKING |
| `/staff/sites/:id` | `SiteDetailPage.jsx` | `StaffLayout.jsx` | Staff | D1 `/api/sites/:id`, sensors, cases, logs | WORKING |
| `/staff/cases` | `CasesListPage.jsx` | `StaffLayout.jsx` | Staff / Legal | D1 `/api/cases` (7-step DAG) | WORKING |
| `/staff/cases/:id` | `CaseDetailPage.jsx` | `StaffLayout.jsx` | Staff / Legal | D1 `/api/cases/:id`, audit timelines | WORKING |
| `/staff/tasks` | `TasksListPage.jsx` | `StaffLayout.jsx` | Staff / Field | D1 `/api/tasks`, `/api/inspections` | WORKING |
| `/staff/monitoring` | `StaffMonitoringPage.jsx` | `StaffLayout.jsx` | Staff | D1 `/api/sensors`, telemetry matrix | WORKING |
| `/staff/alerts` | `StaffAlertsPage.jsx` | `StaffLayout.jsx` | Staff | D1 `/api/staff/alerts` | WORKING |
| `/staff/reports` | `StaffReportsPage.jsx` | `StaffLayout.jsx` | Staff / Executive | D1 `/api/executive/reports`, A4 print | WORKING |
| `/staff/profile` | `StaffProfilePage.jsx` | `StaffLayout.jsx` | Staff | D1 `/api/auth/me` | WORKING |
| `/staff/notifications` | `StaffNotificationsPage.jsx` | `StaffLayout.jsx` | Staff | D1 `/api/alerts` | WORKING |
| `/staff/settings` | `StaffSettingsPage.jsx` | `StaffLayout.jsx` | Staff | D1 `/api/admin/system` | WORKING |
| `/staff/activity` | `StaffActivityPage.jsx` | `StaffLayout.jsx` | Staff | D1 `/api/audit-logs` | WORKING |
| `/staff/help` | `StaffHelpPage.jsx` | `StaffLayout.jsx` | Staff | Guide & SSOT Specs | WORKING |
| `/contractor` | `ContractorDashboardPage.jsx` | `ContractorLayout.jsx` | Contractor | D1 `/api/contractor/dashboard` | WORKING |
| `/contractor/tasks` | `ContractorTasksPage.jsx` | `ContractorLayout.jsx` | Contractor | D1 `/api/contractor/tasks`, Before/After | WORKING |
| `/contractor/cases` | `ContractorCasesPage.jsx` | `ContractorLayout.jsx` | Contractor | D1 `/api/contractor/cases` | WORKING |
| `/contractor/reports` | `ContractorReportsPage.jsx` | `ContractorLayout.jsx` | Contractor | D1 `/api/contractor/reports` | WORKING |
| `/admin` | `AdminDashboardPage.jsx` | `AdminLayout.jsx` | Admin | D1 `/api/admin/system/data-stats` | WORKING |
| `/admin/users` | `UsersPage.jsx` | `AdminLayout.jsx` | Admin | D1 `/api/admin/users`, RBAC control | WORKING |
| `/admin/sites` | `SitesListPage.jsx` | `AdminLayout.jsx` | Admin | D1 `/api/sites` | WORKING |
| `/admin/settings` | `SettingsPage.jsx` | `AdminLayout.jsx` | Admin | D1 System reset, Demo seed, Policy toggle | WORKING |

### Redirect & Legacy Mappings Verified:
- `/community/*` -> `/citizen` (301 redirect)
- `/executive/*` -> `/staff/reports` (301 redirect)
- `/app/*` -> `/staff` (301 redirect)
- `/contractor/portal` -> `/contractor/tasks` (301 redirect)
- `/contractor/evidence` -> `/contractor/tasks` (301 redirect)
