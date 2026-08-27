# SSOT TIMELINE & GIT COMMIT TRACEABILITY MATRIX

> **Mục đích**: Lưu giữ mốc thời gian phát triển (Timeline), gắn kết trực tiếp với các Git Commits và mốc kiểm thử để đảm bảo tính minh bạch, truy xuất nguồn gốc 100% (Traceability).

---

## 📅 Timeline & Commit Log

| **2026-08-27** | `HEAD` | `feat(ssot-migration)` | Thực thi di chuyển toàn bộ UI Staff Hub & Layout Shells theo SSOT: Tích hợp BrandLogo SSOT & PageHeader SSOT trên AppSidebar, AppHeader, CommunityHeader, ContractorLayout, StaffDashboard, StaffCases, StaffSites, StaffComplaints, StaffInspections, DocumentsListPage, UnifiedOperationsCenter; Khử triệt để trùng lặp header/actions, chuẩn hóa touch targets >= 44px, Zero-Glassmorphism | Quick Gate Pass 100% (237 unit + 42 UI smoke) |
| **2026-08-27** | `6fb9a92` | `feat(ssot-audit)` | Hoàn thành toàn diện Architecture SSOT & Visual Consistency Audit: Tạo trọn bộ 9 tài liệu SSOT trong `docs/architecture/` (Route registry, Page component graph, Component SSOT, D1 Entity ERD, API matrix, CRUD permissions, Design system, Audit status, UI consistency matrix); Chuẩn hóa các Composite Components (DataTable SSOT, Modal SSOT, Tabs SSOT, BrandLogo SSOT, PageHeader SSOT, navigationRegistry); Vượt qua Quick Gate 100% (237 unit + 42 UI smoke tests) | Quick Gate Pass 100% (237 unit + 42 UI smoke) |
| **2026-08-27** | `HEAD` | `fix(staff-ui)` | Audit & Tối ưu toàn diện UI Quản trị / Điều phối qua DevTools MCP: Fix lỗi ẩn Header Actions/User Dropdown trên desktop (`hidden lg:flex`), chuẩn hóa Table SSOT (`DataTable.tsx`), fix lỗi rớt dòng đơn chữ (`µg/m³`, `04:06 28-08`, `Phạm Hoàng Nam`), mở rộng `min-w-[320px]` kèm `line-clamp-2` cho cột vụ việc, kiểm tra 5 viewports (1920x1080, 1440x900, 1024x768, 768x1024, 390x844) và Dark Mode | Quick Gate Pass 100% (237 unit + 42 UI smoke) |
| **2026-08-27** | `e2a4b81` | `feat(product-narrative)` | Chuẩn hóa toàn bộ sản phẩm DustGuard VN theo Product Narrative mới: Khóa chuỗi Tín hiệu ➔ Ưu tiên ➔ Case ➔ Hành động ➔ Tái kiểm ➔ Tác động; Action Queue trên Staff Dashboard, Executive Funnel trên Executive Dashboard; loại bỏ 100% từ ngữ kết luận pháp lý vi phạm cưỡng chế; nghiệm thu DevTools trực quan Desktop & Mobile | Quick Gate Pass 100% (237 unit + 42 UI smoke) |
| **2026-08-26** | `HEAD` | `feat(document-studio)` | Nâng cấp Administrative Document Studio toàn diện: Visual Merge Field Engine (ẩn raw syntax), Variable Registry SSOT 6 nhóm, A4 Multi-page Canvas & Ruler, Outline Navigator 2 tab, Pre-flight Check và Export Parity | 74/74 Release Gate Pass (575 unit + 11 db + 42 UI) |
| **2026-08-26** | `8e5e74c` | `feat(spatial-ssot)` | Rebuild DustGuard Spatial Map thành hệ thống tọa độ thật SSOT: Loại bỏ 100% fake mock coordinates (idx%5, 0.4+idx*0.4, 21.033 fallback), bổ sung Location SSOT Model, Geocoding Service, GeoLocationPicker đa năng, và nâng cấp Backend Spatial API với missingLocation counts, bbox filter | 74/74 Release Gate Pass (575 unit + 11 db + 42 UI) |
| **2026-08-26** | `HEAD` | `fix(runtime)` | Khôi phục toàn diện runtime sau refactor: Fix TDZ Re-export `RiskBadge`, bổ sung `SectionErrorBoundary` ngăn ngừa sụp đổ dashboard, sửa lỗi `openCases` undefined, chuẩn hóa imports `PageBreadCrumb` và marker exports `createPickerMarker` | 28/28 Quick Gate (237 unit + 42 UI) Pass 100% |
| **2026-08-26** | `a18ed99` | `fix(ui)` | Loại bỏ hoàn toàn backdrop-blur-none trong OperatorVerificationModal & RegulationAssistantModal, hoàn thành 100% Zero-Glassmorphism Audit và vượt qua Release Gate (74/74 test files, 628 tests) | 74/74 Pass (575 unit + 11 db + 42 UI) |
| **2026-08-26** | `HEAD` | `feat(sensor-quality)` | Khóa cứng Sensor Registry (6 loại thiết bị, 4 mức hiệu chuẩn, 4 tiers), Zero-Fake hardware channels, Data Quality Engine (5 tầng: bounds, flatlines, sudden jumps, staleness, packet loss), HMAC-SHA256 & sequence replay protection, sensor adapter đa giao thức | 33/33 Pass (254 unit + 42 UI) |
| **2026-08-26** | `e0afd08` | `feat(operator-workspace)` | Tái thiết kế Operator Workspace theo chuẩn Operational Review & Verification, 4 kết quả xác minh (confirmed_signal, not_confirmed, insufficient_evidence, needs_follow_up), Review Queue (Signal, Telemetry, Citizen Evidence, SLA), Trợ lý tra cứu quy chuẩn QCVN 05/18 với disclaimer bắt buộc | 30/30 Pass (251 unit + 42 UI) |
| **2026-08-26** | `6b7ef4c` | `feat(scoring)` | Chuẩn hóa Explainable Priority Score 6 yếu tố (Base severity PM, Duration, Sensor confidence, Proximity <300m, Citizen corroboration, Recurrence), giải thích UI 'Tại sao Score = X' (+ High PM10, + 3 citizen reports, + 220m from school), loại bỏ 100% Violation Score | 29/29 Pass (244 unit + 42 UI) |
| **2026-08-26** | `f8b92c1` | `feat(citizen-youth)` | Tinh gọn trải nghiệm ghi nhận 3-chạm (<30s), nén ảnh client <300KB khử EXIF & SHA-256 tamper-evident, chuẩn hóa vai trò Citizen & Tín chỉ thanh niên (20h = 4.0 tín chỉ) QR ISO/IEC 18004 | 28/28 Pass (237 unit + 42 UI) |
| **2026-08-26** | `f6a4b1c` | `docs(map-ssot)` | Hợp nhất toàn bộ logic bản đồ thành 1 Map SSOT duy nhất 'DustGuard Spatial Intelligence Map', chuẩn hóa WGS84, 6 lớp không gian (Sensors, Sites, Observations, Hotspots, Geofence 300m trường học, Ranh giới Phường/Xã) và ma trận phân quyền RBAC đa tầng trong MAP.md | 28/28 Pass (237 unit + 42 UI) |
| **2026-08-26** | `c7f91a2` | `docs(roles-permissions)` | Tinh gọn 5 vai trò thực tế SSOT (PUBLIC, CITIZEN, OPERATOR, SITE_REPRESENTATIVE, ADMIN), xóa bỏ giả lập bộ trưởng/thẩm phán, ban hành ROLES.md & PERMISSIONS.md | 28/28 Pass (237 unit + 42 UI) |
| **2026-08-26** | `b132bff` | `docs(workflows-ssot)` | Chuẩn hóa Canonical 11-Stage Pipeline, Closed-Loop Impact Architecture (Before vs After, Geofence 50m, SHA-256) và Municipal Civic Handoff (1022/iHanoi Dossier A4/QR/API) trong WORKFLOWS.md | 28/28 Pass (237 unit + 42 UI) |
| **2026-08-26** | `8ad4a1b` | `docs(data-model-ssot)` | Tái cấu trúc Domain Model lấy Environmental Event làm trung tâm, phân định 3 tầng Measurement - Signal - Event, ban hành chuẩn 11 trạng thái Event trong DATA_MODEL.md & DOMAIN.md | 28/28 Pass (237 unit + 42 UI) |
| **2026-08-26** | `03ffec2` | `docs(terminology-ssot)` | Chuẩn hóa bộ từ điển thuật ngữ khoa học SSOT TERMINOLOGY.md, tuân thủ 100% nguyên tắc khiêm tốn, khách quan, khoa học; định vị Environmental Intelligence & Decision Support trong README.md | 28/28 Pass (237 unit + 42 UI) |
| **2026-08-26** | `e1d48c2` | `docs(scientific-spec)` | Tái kiến trúc định vị DustGuard thành Nền tảng Trí tuệ Môi trường & Hỗ trợ Ra Quyết định, phân loại 100% tính năng 3 vùng (Tier A Core Owned, Tier B DSS, Tier C External Authority), ban hành SCIENTIFIC_RESEARCH_SPEC.md & PRODUCT.md | 28/28 Pass (237 unit + 42 UI) |
| **2026-08-26** | `16b23ae` | `chore(submodule)` | Đồng bộ con trỏ `app` với `dev.db` và schema mới nhất | 25/25 Pass |
| **2026-08-26** | `ffdf46d` | `feat(executive-map-ssot)` | Tái cấu trúc Executive Command Center & Spatial Map SSoT toàn diện trên tất cả các portals | 43/43 Pass |
| **2026-08-26** | `335949d` | `feat(staff)` | Di chuyển Staff portal sang SpatialMap SSOT chung và hợp nhất Priority Queue | 43/43 Pass |
| **2026-08-26** | `cc88661` | `feat(spatial)` | Xây dựng Canonical WGS84 spatial adapter, D1 schema indexes & test suite 6/6 pass | 43/43 Pass |
| **2026-08-26** | `6f934d6` | `docs(qa)` | Cập nhật Active Context và Lessons Learned cho Subagent Fix 10 | Docs Updated |
| **2026-08-26** | `0c94c6a` | `feat(domain)` | Chuẩn hóa Dust Risk Engine và cơ chế Zero-IoT Resilience (chia trọng số 90%) | 38/38 Pass |
| **2026-08-26** | `a34f286` | `chore(subagent-09)` | Dọn dẹp map tàn dư và xóa bỏ 100% fake mock data trong catch blocks | 42/42 Pass |
| **2026-08-26** | `f158371` | `fix(executive)` | Chuẩn hóa Operations API với truy vấn D1 SQL thực tế và clean DTOs | 40/40 Pass |
| **2026-08-26** | `6c19be6` | `fix(dev-runner)` | Khắc phục lỗi spawn EINVAL trên Windows PowerShell và lọc target D1 audit | 40/40 Pass |
| **2026-08-26** | `ab76876` | `docs(lessons)` | Bổ sung quy chuẩn Community Portal và Tín chỉ ngoại khóa thanh niên (20h = 4.0 tín chỉ) | Docs Updated |
| **2026-08-26** | `c61544d` | `feat(contractor)` | Cập nhật Contractor Portal với kiểm tra Geofence 50m và quy trình nghiệm thu Before/After | 40/40 Pass |
| **2026-08-26** | `cb1bbef` | `feat(executive)` | Audit Executive Dashboard & Spatial GIS Map Hub theo chuẩn Phường/Xã và ký duyệt số D1 | 40/40 Pass |
| **2026-08-26** | `010bc2e` | `chore(cron)` | Vô hiệu hóa cron automation ngầm qua kill-switch để tiết kiệm Cloudflare Free Tier | Gate Pass |
| **2026-08-26** | `b7dac5d` | `feat(automation)` | Thêm toggles Active/Dry-run/Disabled và API điều khiển tự động hóa | Gate Pass |
| **2026-08-26** | `d47f36d` | `feat(automation)` | Tái thiết kế Free-first Cron & Soft SLA Engine với D1 bounded sweeps | Gate Pass |
| **2026-08-26** | `5ada340` | `feat(map)` | Đồng bộ layout single-screen viewport fit cho bản đồ GIS | 38/38 Pass |
| **2026-08-26** | `54d7d9f` | `feat(citizen)` | Cập nhật Citizen Portal tập trung trải nghiệm phản ánh và theo dõi minh chứng | 38/38 Pass |
| **2026-08-26** | `c23de93` | `feat(map)` | Tích hợp Unified Public Spatial Intelligence Hub vào DustGuard | 38/38 Pass |
| **2026-08-26** | `f557b9e` | `refactor(geo-domain)` | Chuẩn hóa đơn vị hành chính theo Phường/Xã (Ward SSOT) | 38/38 Pass |

---

## 🎯 Quy Trình Cập Nhật Timeline Sau Mỗi Feature
1. Viết code & kiểm thử đạt `verify:quick` 100%.
2. Cập nhật dòng mới vào `TIMELINE.md` với commit hash và mô tả ngắn gọn.
3. Commit qua git CLI với chuẩn Conventional Commits (`feat(...)`, `fix(...)`, `refactor(...)`, `docs(...)`).
