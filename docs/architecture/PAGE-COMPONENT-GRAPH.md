# PAGE-COMPONENT-GRAPH.md — Page to Component Tree SSOT

> Bản đồ phân cấp Component của toàn bộ các màn hình chính trong hệ thống DustGuard VN.

---

## 🌲 1. Page Component Hierarchies

### 1.1 Public & Landing (`/`)
```text
LandingPage.jsx
└── PublicLayout / CustomNav
    ├── HeroSection (Civic Tech Branding & Elevator Pitch)
    ├── CoreCapabilitiesGrid (7 Năng lực cốt lõi)
    ├── LiveEvidenceFeed (Ảnh hiện trường có SHA-256)
    ├── PlatformMetricsRow
    │   └── MetricCard × 4 (Dữ liệu thật từ D1)
    ├── HowItWorksWorkflow (Chuỗi 4 bước minh bạch)
    └── PublicFooter
```

### 1.2 Community Home (`/community`)
```text
CommunityHome.jsx
└── CommunityLayout
    ├── CommunityHeader (Logo, Nav, Nút [Ghi nhận mới])
    ├── PageContainer
    │   ├── CommunityHero (Khẩu hiệu hành động xanh)
    │   ├── QuickActionGrid
    │   │   ├── ActionCard [📷 Ghi nhận ô nhiễm]
    │   │   ├── ActionCard [🗺️ Bản đồ khu vực]
    │   │   ├── ActionCard [📋 Vụ việc đang theo dõi]
    │   │   └── ActionCard [🏅 Tín chỉ tình nguyện]
    │   ├── ImpactMetricsRow
    │   │   └── MetricCard × 4 (TNV, Báo cáo, Giảm bụi, Điểm rèn luyện)
    │   └── ActiveCampaignsSection
    └── CommunityBottomNav (5 Mobile Tabs chuẩn >= 44px)
```

### 1.3 Create Observation (`/community/observe`)
```text
CreateObservation.jsx
└── CommunityLayout
    └── PageContainer
        ├── SectionHeader (Ghi nhận hiện trường 3-chạm)
        ├── SourceCategorySelector (Chọn nguồn ô nhiễm)
        ├── UploadZone (Nén ảnh < 300KB, Xóa EXIF, Sinh mã SHA-256 Web Crypto)
        ├── LocationAutoDetect (WGS84 GPS + Tùy chọn làm mờ 100m)
        ├── FormField (Mô tả chi tiết, địa chỉ, người báo)
        └── Button [Gửi ghi nhận có bảo chứng mã băm]
```

### 1.4 Community Cases & Observation Detail (`/community/cases`, `/community/cases/:id`)
```text
CommunityCases.jsx / CommunityCaseWorkspace.jsx
└── CommunityLayout
    └── PageContainer
        ├── FilterBar (Tìm kiếm, Trạng thái, Khu vực)
        ├── DataTable / CaseCardList (Danh sách vụ việc)
        └── CaseDetailView
            ├── StatusBadge (Trạng thái SSOT)
            ├── PriorityScoreCard (Điểm ưu tiên 0-100 & Lý do)
            ├── EvidenceGallery (Ảnh Trước / Sau đối chứng)
            ├── CaseTimeline (Lịch sử cập nhật minh bạch)
            └── FollowUpModal (TNV quay lại đối chứng 24-48h)
```

### 1.5 Staff Dashboard & Operations Center (`/staff/dashboard`, `/staff/operations`)
```text
StaffDashboard.jsx / StaffOperations.jsx
└── AppLayout
    ├── AppSidebar (Điều hướng 8 phân hệ)
    ├── AppHeader (User badge, Thông báo khẩn, Quick search)
    └── MainContent
        ├── MetricGrid (KPIs: Hàng đợi, Điểm rủi ro cao, SLA khẩn, Đã xử lý)
        │   └── MetricCard × 4
        ├── ReviewQueueSection (Hàng đợi thẩm tra sự kiện)
        │   ├── FilterTabs [P1 Khẩn | P2 Ưu tiên | P3 Theo dõi]
        │   └── ReviewQueueTable (DataTable SSOT)
        ├── OperatorVerificationModal (4 Kết quả thẩm tra)
        ├── RegulationAssistantModal (Tra cứu QCVN 05:2023, QCVN 18:2021)
        └── CaseDossierPackageModal (Xuất hồ sơ A4 chuyển giao 1022)
```

### 1.6 Contractor Workspace (`/contractor`, `/contractor/actions/:id`)
```text
ContractorDashboard.jsx / ContractorActionDetail.jsx
└── ContractorLayout
    ├── ContractorHeader
    └── MainContent
        ├── QuickRemediationBanner (Yêu cầu dập bụi khẩn)
        ├── MetricGrid (Việc cần làm, Đang xử lý, Chờ đối chứng, Hoàn tất)
        ├── ActionList (DataTable / ActionCards)
        └── RemediationSubmissionForm
            ├── UploadZone (Ảnh dập bụi sau xử lý)
            ├── GeofenceValidator (Kiểm tra GPS <= 50m tại công trình)
            └── Button [Nộp minh chứng hoàn tất]
```

### 1.7 Executive Dashboard & Reports (`/executive/dashboard`, `/executive/heatmap`)
```text
ExecutiveDashboard.jsx / ExecutiveHeatmap.jsx
└── AppLayout
    ├── ExecutiveSummaryCards (Báo cáo chỉ đạo môi trường)
    ├── SpatialRiskMap (Bản đồ nhiệt nguy cơ bụi toàn quận/thành phố)
    ├── ExecutiveFunnel (Phễu chuyển đổi từ Tín hiệu ➔ Tác động)
    └── ComplianceReportTable (Bảng tổng hợp xếp hạng chủ đầu tư / nhà thầu)
```

---

## 🔍 2. Component Canonical Classification & Merge Plan

| Nhóm Component | File Cũ / Trùng Lặp | Canonical File SSOT | Hành Động |
|---|---|---|---|
| **Button** | `src/components/ui/Button.jsx`<br>`src/components/ui/button/Button.tsx`<br>`src/design-system/components/Button.tsx` | `src/shared/components/ui/Button.jsx` | **Consolidate & Canonicalize** |
| **Card** | `src/components/ui/Card.jsx`<br>`src/design-system/components/Card.tsx` | `src/shared/components/ui/Card.jsx` | **Consolidate & Canonicalize** |
| **MetricCard** | `src/components/ui/MetricCard.jsx`<br>`src/design-system/components/MetricCard.tsx` | `src/shared/components/ui/MetricCard.jsx` | **Consolidate & Canonicalize** |
| **StatusBadge / Badge** | `src/components/ui/StatusBadge.jsx`<br>`src/components/ui/badge/Badge.tsx`<br>`src/design-system/components/Badge.tsx` | `src/shared/components/ui/StatusBadge.jsx` | **Consolidate & Canonicalize** |
| **EmptyState** | `src/components/ui/EmptyState.jsx`<br>`src/design-system/components/EmptyState.tsx` | `src/shared/components/ui/EmptyState.jsx` | **Consolidate & Canonicalize** |
| **Form Inputs** | `src/components/ui/Input.jsx`<br>`src/components/form/Select.tsx`<br>`src/design-system/components/Input.tsx` | `src/shared/components/ui/Input.jsx`<br>`src/shared/components/ui/Select.jsx`<br>`src/shared/components/ui/Textarea.jsx` | **Consolidate & Canonicalize** |
| **DataTable** | Phân mảnh `<table>` ad-hoc rải rác | `src/shared/components/ui/DataTable.jsx` (Mới chuẩn hoá) | **Enforce SSOT across all tables** |
