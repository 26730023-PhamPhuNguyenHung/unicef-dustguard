# ROUTES SSOT — URL MAPPING & NAVIGATION

## 1. Community Action Portal Routes (Primary Public Experience)

| Route Path | Component | Description / Purpose |
| :--- | :--- | :--- |
| `/` | `LandingPage.jsx` | Trang chủ định vị Civic-Tech & Youth Community |
| `/community` | `CommunityHome.jsx` | Dashboard Hành động Thanh niên (4 hành động chính, việc cần làm, tác động) |
| `/community/discover` | `CommunityDiscover.jsx` | Khám phá chiến dịch, điểm nóng và hoạt động lân cận |
| `/community/campaigns` | `CommunityCampaigns.jsx` | Danh sách chiến dịch môi trường trường học & thanh niên |
| `/community/campaigns/:campaignId` | `CampaignDetail.jsx` | Chi tiết chiến dịch, bản đồ nhiệm vụ, thành viên tham gia |
| `/community/observe` | `CreateObservation.jsx` | Wizard 5 bước ghi nhận hiện trường (Danh mục -> Ảnh -> Vị trí -> Mô tả -> Tư cách) |
| `/community/observations` | `ObservationList.jsx` | Danh sách ghi nhận của cá nhân / nhóm |
| `/community/observations/:id` | `ObservationDetail.jsx` | Chi tiết ghi nhận, không gian bằng chứng & bước tiếp theo |
| `/community/cases` | `CommunityCases.jsx` | Danh sách các vấn đề đang theo dõi |
| `/community/cases/:caseId` | `CommunityCaseWorkspace.jsx` | Không gian làm việc vụ việc (Tabs: Tổng quan, Bằng chứng, Nhiệm vụ, Theo dõi, Chuyển tiếp, Lịch sử) |
| `/community/actions` | `CommunityActions.jsx` | Danh sách nhiệm vụ thực địa được giao cho tôi/nhóm |
| `/community/follow-ups` | `CommunityFollowUps.jsx` | Danh sách điểm hẹn quay lại kiểm tra tình trạng |
| `/community/impact` | `CommunityImpact.jsx` | Bảng đo lường tác động, giờ tình nguyện, chứng chỉ số |
| `/community/profile` | `CommunityProfile.jsx` | Hồ sơ người tham gia, CLB trực thuộc, huy hiệu |

## 2. Legacy / Compatibility Redirects

| Legacy Route | Redirect Destination | Ghi chú |
| :--- | :--- | :--- |
| `/citizen` | `/community` | Chuyển hướng êm thuận |
| `/citizen/report` | `/community/observe` | Chuyển tiếp luồng ghi nhận |
| `/citizen/track` | `/community/cases` | Chuyển tiếp luồng theo dõi tiến trình |
| `/youth` | `/community/impact` | Chuyển tiếp sang Dashboard Impact |
| `/youth/credits` | `/community/impact` | Chuyển tiếp sang Tín chỉ & Chứng nhận |
| `/youth/leaderboard` | `/community/discover` | Chuyển tiếp sang Bảng xếp hạng CLB |

## 3. Staff & Executive Operations Routes (Protected)

| Route Path | Component | Roles |
| :--- | :--- | :--- |
| `/staff/dashboard` | `StaffDashboard.jsx` | `staff`, `executive`, `admin` |
| `/staff/cases` | `StaffCases.jsx` | `staff`, `executive`, `admin` |
| `/staff/cases/:caseId` | `StaffCaseDetail.jsx` | `staff`, `executive`, `admin` |
| `/staff/complaints` | `StaffComplaints.jsx` | `staff`, `executive`, `admin` |
| `/staff/sites` | `StaffSites.jsx` | `staff`, `executive`, `admin` |
| `/executive/dashboard`| `ExecutiveDashboard.jsx`| `executive`, `admin` |
| `/contractor` | `ContractorPortal.jsx` | `contractor`, `staff`, `admin` |
