# AUDIT-STATUS.md — System-Wide Route & Component Audit Tracker

> Bảng theo dõi tình trạng kiểm toán và chuẩn hóa SSOT của từng trang trong DustGuard VN.

---

## 📋 Status Vocabulary
- `NOT_AUDITED`: Chưa kiểm tra.
- `AUDITED`: Đã inventory và phát hiện vấn đề.
- `FIXING`: Đang tiến hành chuẩn hoá & sửa lỗi.
- `BLOCKED`: Đang chờ phụ thuộc.
- `DONE`: Đạt 100% tiêu chuẩn Definition of Done (No console errors, Real D1 API, Responsive 360-1440px, High-contrast, Verified).

---

## 📊 Audit Status Matrix

| Domain | Route | Page Component | UI | CRUD | API | Responsive | SSOT | Runtime | Status |
|---|---|---|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **Public** | `/` | `LandingPage.jsx` | ✅ | N/A | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Public** | `/login` | `Login.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Public** | `/docs/sensor-guide` | `SensorGuide.jsx` | ✅ | N/A | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Citizen** | `/citizen` | `CitizenPortal.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Citizen** | `/citizen/report/new` | `CitizenReport.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Citizen** | `/citizen/reports` | `CitizenTrack.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Citizen** | `/citizen/map` | `CitizenMap.jsx` | ✅ | N/A | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Citizen** | `/citizen/profile` | `CitizenProfile.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Community** | `/community` | `CommunityHome.jsx` | ✅ | N/A | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Community** | `/community/discover` | `CommunityDiscover.jsx` | ✅ | N/A | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Community** | `/community/observe` | `CreateObservation.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Community** | `/community/cases` | `CommunityCases.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Community** | `/community/cases/:id` | `CommunityCaseWorkspace.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Community** | `/community/observations/:id` | `ObservationDetail.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Community** | `/community/actions` | `CommunityActions.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Community** | `/community/impact` | `CommunityImpact.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Contractor** | `/contractor` | `ContractorDashboard.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Contractor** | `/contractor/actions` | `ContractorActionList.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Contractor** | `/contractor/actions/:id` | `ContractorActionDetail.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Contractor** | `/contractor/projects` | `ContractorProjects.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Staff** | `/staff/dashboard` | `StaffDashboard.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Staff** | `/staff/operations` | `StaffOperations.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Staff** | `/staff/cases` | `StaffCases.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Staff** | `/staff/cases/:id` | `StaffCaseDetail.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Staff** | `/staff/sites` | `StaffSites.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Staff** | `/staff/sites/:id` | `StaffSiteDetail.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Staff** | `/staff/complaints` | `StaffComplaints.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Staff** | `/staff/inspections` | `StaffInspections.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Staff** | `/staff/documents` | `DocumentsListPage.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Executive** | `/executive/dashboard` | `ExecutiveDashboard.jsx` | ✅ | N/A | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Executive** | `/executive/heatmap` | `ExecutiveHeatmap.jsx` | ✅ | N/A | ✅ | ✅ | ✅ | ✅ | **DONE** |
| **Executive** | `/executive/reports` | `ExecutiveReports.jsx` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **DONE** |
