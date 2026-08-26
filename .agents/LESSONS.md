# LESSONS LEARNED

## 13. D1 Schema, Spatial WGS84 Adapter & High-Performance DB Indexing Invariants
- **Bối cảnh & Vấn đề**:
  - Dữ liệu tọa độ địa lý trong hệ thống được lưu ở nhiều bảng (`sites`, `observations`, `complaints`, `sensors`) với các định dạng khác nhau: `TEXT` ("lat,lng" hoặc "lat, lng"), `REAL` (`latitude`, `longitude`), hoặc JSON object (`{ lat, lng }`, `{ latitude, longitude }`).
  - Các truy vấn không gian (Spatial Queries), tính bán kính Geofence 50m nhà thầu, hiển thị Leaflet GIS Map và truy vấn hồ sơ theo hạn xử lý SLA của Lãnh đạo nếu thiếu các composite index chuyên biệt trên D1 SQLite sẽ làm suy giảm hiệu năng khi mở rộng quy mô.
- **Giải pháp Kiến trúc & Quy tắc Chuẩn hóa**:
  1. **Canonical D1 Migration 0007 (`migrations/0007_spatial_and_executive_indexes.sql`)**:
     - Bổ sung các chỉ mục hiệu năng cao trên Cloudflare D1 SQLite SSOT:
       * `idx_sites_spatial` trên `sites(ward, status, coordinates)` và `idx_sites_coordinates` trên `sites(coordinates)`.
       * `idx_sensors_spatial` trên `sensors(siteId, status)`.
       * `idx_complaints_spatial` trên `complaints(ward, status, createdAt DESC)`.
       * `idx_observations_spatial` trên `observations(latitude, longitude)` và `idx_observations_ward_status` trên `observations(ward, status, created_at DESC)`.
       * `idx_cases_executive` trên `cases(status, slaDeadline, siteId)`.
       * `idx_audit_logs_time` trên `audit_logs(createdAt DESC)`.
       * `idx_handoffs_executive` trên `handoffs(status, created_at DESC)`.
  2. **Canonical Spatial Adapter (`app/server/domain/spatial/spatial-adapter.js`)**:
     - Cung cấp trọn gói các hàm chuẩn hóa WGS84: `parseCoordinates`, `serializeCoordinates`, `normalizeEntityCoordinates`, `calculateHaversineDistance`, `evaluateGeofenceBuffer`, `isWithinRadius`, `isValidWgs84`, `formatWgs84`.
     - Chấp nhận mọi định dạng đầu vào: string `"21.02851, 105.85420"`, object `{ latitude, longitude }` / `{ lat, lng }`, entity objects (`site`, `observation`, `complaint`), array `[lat, lng]`, JSON string.
     - Tự động gắn kết đồng thời các thuộc tính `{ latitude, longitude, lat, lng, coordinates }` lên mọi thực thể trả về từ database repositories (`site.repository.js`, `observation.repository.js`), ngăn chặn triệt để lỗi `undefined` tọa độ trên giao diện GIS Map và Contractor Workspace.
  3. **Verification**: Suite `app/tests/d1-schema.test.js` (6/6 tests passing) xác thực toàn diện chỉ mục D1 `sqlite_master`, parsing đa định dạng, tính khoảng cách Haversine & Geofence 50m, và lưu/đọc CSDL SQLite thực tế.

## 01. Cleanup Legacy Map Implementations & Mock Artifacts (Zero-Mock Production SSOT)
- **Bối cảnh & Vấn đề**:
  - Tàn dư code mẫu eCommerce (`CountryMap.tsx`, `DemographicCard.tsx`) gây phình to bundle và tăng nợ kỹ thuật.
  - Sự tồn tại của nhiều bản đồ phân mảnh (`MapView.jsx`, `RiskLeafletMap.jsx`, `ExecutiveDashboard.jsx` legacy) gây phân tán logic và không tận dụng được sức mạnh của `SpatialMapWorkspace` / `SpatialMapCanvas`.
  - Một số component và model (`DocumentsListPage.jsx`, `RevisionHistoryModal.jsx`, `executive-dashboard-model.js`) có các catch fallback trả về mock data giả lập (`doc-001`, `doc-002`, `rev_curr`, `rev_initial`, fake guest cases), làm sai lệch trạng thái thực tế của hệ thống.
- **Giải pháp Kiến trúc & Chuẩn Hóa**:
  1. Xóa bỏ hoàn toàn các file mồ côi `CountryMap.tsx`, `DemographicCard.tsx` và `src/components/ExecutiveDashboard.jsx` (legacy).
  2. Deprecate và refactor `MapView.jsx` / `RiskLeafletMap.jsx`, chuyển hướng `StaffMap.jsx` sang `SpatialMapWorkspace` chuẩn SSoT.
  3. Xóa bỏ 100% fallback mock data trong `DocumentsListPage.jsx`, `RevisionHistoryModal.jsx`, `contractor-api.js`, `youth-credits.js` (`fetchYouthLeaderboard()`) và `executive-dashboard-model.js`. Thay thế bằng xử lý ErrorState / EmptyState chân thực.

## 00. Design System & Component Architecture: Thống Nhất SSOT Primitives & Zero Fragmented Badges
- **Bối cảnh & Vấn đề**:
  - Khi codebase phát triển qua nhiều domain (Citizen, Community, Staff, Executive, Contractor), việc xuất hiện các badge phân mảnh như `StatusChip`, `ComplaintStatusChip`, hoặc các hàm inline `getStatusBadge` trong từng tab dẫn đến không đồng nhất màu sắc, khó bảo trì, và nguy cơ lệch chuẩn Civic Tech High-Contrast.
  - Các UI Primitives cốt lõi (`Button`, `Card`, `MetricCard`, `StatusBadge`, `FormField`, `Input`, `Select`, `Tabs`, `EmptyState`, `LoadingState`, `Skeleton`, `Modal`, `Toast`) nếu không có một thư mục canonical SSOT tập trung (`app/src/components/ui/`) sẽ dễ bị trùng lặp hoặc viết lại.
- **Giải pháp Kiến trúc & Chuẩn Hóa**:
  1. **Canonical Shared UI Components (`app/src/components/ui/`)**:
     - Cung cấp trọn vẹn 13 components chuẩn Civic-Tech có barrel export kép (`index.ts` & `index.js`).
     - Đồng bộ và re-export qua `app/src/shared/components/ui/` để duy trì 100% khả năng tương thích ngược (Zero Breaking Changes).
  2. **StatusBadge SSOT với 5 Semantic Types**:
     - Phân định rõ ràng: `EntityStatus`, `RiskLevel`, `PriorityBadge`, `SLAIndicator`, `EvidenceStatus`.
     - Quy các helper chip (`StatusChip`, `ComplaintStatusChip`) về ủy quyền trực tiếp cho `StatusBadge`.
  3. **Design Tokens Chuẩn Hóa (`app/src/tokens/index.ts` & `index.css`)**:
     - Spacing 4px grid (4, 8, 12, 16, 20, 24, 32, 48px).
     - Radius scale chuẩn (`sm: 4px`, `md: 8px`, `lg: 12px`, `xl: 16px`, `2xl: 24px`, `card: 16px`, `panel: 20px`, `full: 9999px`).
     - Line-height tiếng Việt chuẩn (tight `1.25`, normal `1.5`, relaxed `1.65`) tránh nghẹt dấu tiếng Việt.
     - Touch targets tối thiểu `44px x 44px` cho toàn bộ nút hành động và navigation tabs (WCAG 2.2).
  4. **Verification**: Suite `app/tests/design-system-ui-components-audit.test.js` (26/26 pass) + `design-system-tokens.test.js` (8/8 pass) + `verify:quick` pass 100%.

# Lessons Learned & Architecture Best Practices — DustGuard VN

## 1. Staff Workflow UX Invariants
- **Staff Mindset**: Cán bộ thanh tra không cần dashboard để ngắm các biểu đồ phức tạp; cán bộ cần biết ngay **"Việc nào phải xử lý trước theo mức độ khẩn cấp và SLA 48h"**.
- **Hero Layer (P0)**: Luôn đặt khối "CẦN XỬ LÝ NGAY" trên cùng của Staff Home với 4 nhóm khẩn cấp: Nguy cơ cao (PM2.5), Quá hạn SLA, Điểm nóng tái phạm, Mất tín hiệu cảm biến.
- **Card / Row Identification Integrity**: Mỗi card tác nghiệp bắt buộc hiển thị đủ 8 thông tin nhận diện cốt lõi: Priority (màu sắc rõ), Status, Địa điểm, Thời gian tồn đọng, SLA đếm ngược, Cán bộ phụ trách, Minh chứng kỹ thuật số, Next Action.
- **6-Section Case Structure**: Cấu trúc hồ sơ thanh tra chuẩn mực phân tách rõ ràng: `CASE SUMMARY` -> `EVIDENCE` -> `TIMELINE` -> `FIELD ACTION` -> `MONITORING & KHẮC PHỤC` -> `DECISION & KÝ DUYỆT`.
- **Dossier Package**: Cho phép xuất trọn gói hồ sơ thanh tra chuẩn A4 pháp lý Việt Nam kèm chữ ký số điện tử và mã băm SHA-256 xác thực trên D1 SSOT.
- **Remediation Workspace**: Đối chứng trực quan ảnh Trước/Sau (Before/After), kiểm tra Geofence < 50m và thực thi quy trình 3 nút thẩm định (Nghiệm thu Đạt, Yêu cầu làm lại, Chuyển xử phạt cưỡng chế).
- **Zero Glassmorphism**: Tuyệt đối không dùng `backdrop-blur-*`, tuân thủ bảng màu Civic Tech tương phản cao (`#FDFBF7` cream, `#231b14` ink, `#0d6f64` teal, `#9f241f` seal red).

## 3. Content Design & Microcopy Invariants cho Civic Tech
- **Tách biệt Ngôn ngữ Code và Ngôn ngữ Giao diện**: Tuyệt đối không để thuật ngữ kỹ thuật, tên cơ sở dữ liệu (`D1`, `R2`), thuật toán (`HMAC`, `SHA-256`, `telemetry`, `risk engine`, `UNVERIFIED_SIGNAL`) hiển thị thô ráp trước mắt người dân và cán bộ nhà nước. Giao diện phải dùng ngôn ngữ hành chính, dân sinh gần gũi, dễ hiểu (`Dữ liệu đo đạc thực địa`, `Mã niêm phong số`, `Minh chứng hiện trường`, `Mức độ ưu tiên`).
- **Button Copy Hướng Hành Động (Action-Oriented Verbs)**: Không dùng các nhãn nút vô thưởng vô phạt như "Submit", "Action", "Proceed", "OK". Nút bấm phải mô tả chính xác hành vi sắp diễn ra: *"Gửi phản ánh ngay"*, *"Bổ sung ảnh hiện trường"*, *"Xem chi tiết tiến độ"*, *"Xác nhận nộp minh chứng"*, *"Phê duyệt & Đóng vụ việc"*.
- **Empty State & Error Message Định Hướng Hành Động**: Không để trạng thái rỗng "No data" hay thông báo lỗi "Something went wrong". Bắt buộc phải có: (1) Nguyên nhân dễ hiểu + (2) Hành động tiếp theo cụ thể (ví dụ: *"Chưa tìm thấy phản ánh phù hợp. Bạn có thể kiểm tra lại bộ lọc hoặc gửi phản ánh mới"* kèm nút bấm xóa bộ lọc hoặc gửi phản ánh).

## 4. Responsive Design & Accessibility Invariants (WCAG 2.2 & Mobile First)
- **Dual-View Table Pattern (Desktop Table & Mobile Cards)**: Trên các bảng dữ liệu quản trị (Staff, Contractor, Executive, Documents, Youth), không cố gắng nhồi nhét bảng nhiều cột trên màn hình hẹp (< 768px). Luôn triển khai kiến trúc 2 tầng:
  * Desktop View (`hidden md:block overflow-x-auto`): Bảng dữ liệu đầy đủ cột, hover highlight, sticky headers.
  * Mobile View (`md:hidden flex flex-col gap-3`): Dạng danh sách thẻ (Stacked Cards), hiển thị rõ ràng mã định danh, tiêu đề, địa chỉ (`break-words`), badges trạng thái/rủi ro và CTA nút bấm lớn min-h-[44px].
- **Chống Tràn Ngang Triệt Để (Zero Horizontal Scroll)**: Áp dụng quy tắc phòng vệ:
  * Mọi container cha flex/grid bắt buộc có `min-w-0` để tránh flex child phình to vô hạn theo chuỗi văn bản dài.
  * Typography pháp lý (Tiêu đề phản ánh, Địa chỉ công trường, Tên văn bản) bắt buộc dùng `break-words` thay vì cắt cụt bằng `truncate`.
  * Layout bọc ngoài cùng bắt buộc có `w-full max-w-full overflow-x-hidden`.
- **Button Layout & Touch Target WCAG 2.2**:
  * Nút bấm luôn có `whitespace-nowrap shrink-0` để ngăn chặn ngắt dòng từng chữ dị dạng trên màn hình nhỏ.
  * Diện tích chạm (Touch Target) tối thiểu 44px x 44px (`min-h-[44px] min-w-[44px]`).
  * Nút hành động chính trên Mobile Bottom Navigation có kích thước 56px với màu Đỏ Con Dấu `#B51F24`.
- **Safe Area Inset Padding**: Cố định Bottom Navigation cho Citizen & Community luôn tích hợp `pb-[max(0.5rem,env(safe-area-inset-bottom))]` hoặc `@utility pb-safe` để tránh bị che bởi thanh điều hướng cử chỉ trên iOS/Android.

## 5. Chuẩn Hóa Đơn Vị Hành Chính Cấp Cơ Sở (Ward / Phường-Xã SSOT)
- **Bối cảnh & Vấn đề**:
  - Khi phân cấp quản lý môi trường đô thị (theo Quyết định 48/2024/QĐ-UBND Hà Nội và tinh gọn mô hình chính quyền đô thị), đơn vị chịu trách nhiệm kiểm tra thực địa, phản ánh dân sinh và tiếp nhận bàn giao là **Cấp Phường / Xã** (Ward) trực thuộc Tỉnh/Thành phố.
  - Việc để sót các khái niệm trung gian "Quận/Huyện" (District) rải rác trên dropdown bộ lọc, bảng xếp hạng điều hành lãnh đạo hoặc nơi nhận văn bản gây phân mảnh dữ liệu và nhầm lẫn trách nhiệm giải trình.
- **Giải pháp Kiến trúc & Quy tắc Chuẩn hóa**:
  1. **Schema & API**: Bảng `sites`, `complaints`, `observations`, `campaigns` đều lưu trực tiếp `ward` và `province`. Không tạo cột `district` dư thừa.
  2. **Bộ Lọc Đa Tầng (Filter Triage)**: Luôn trích xuất danh sách duy nhất các Phường (`distinctWards`) từ CSDL để người dùng lọc chính xác theo địa bàn (`Phường Mai Dịch`, `Phường Mễ Trì`, `Phường Quan Hoa`, `Phường Dịch Vọng Hậu`...).
  3. **Văn Bản Hành Chính**: Nơi nhận chuẩn hóa là `- UBND Phường/Xã;`, cơ quan phối hợp là *Tổ Giám sát & Thanh tra Môi trường Phường*.
  4. **Executive SLA Ranking**: Bảng xếp hạng năng lực giải quyết khiếu nại và cam kết 48h SLA phải nhóm và hiển thị theo Phường/Xã để đánh giá đúng trách nhiệm người đứng đầu cơ sở.

## 6. Community Portal & Youth Credits: Observation Invariants, Anti-Fraud Evidence & Digital Certificate Standards
- **Phân Định Rõ Observation != Case**:
  * **Observation (Ghi nhận quan sát ban đầu)**: Điểm nhìn thực địa của công dân / tình nguyện viên với 7 danh mục môi trường (Bụi công trình, Rác thải, Nước thải, Đốt rác, Hóa chất, Mùi hôi, Khác), có ảnh băm SHA-256, tọa độ GPS, người ghi nhận.
  * **Case (Hồ sơ vụ việc thanh tra)**: Thực thể pháp lý quản lý đa bên (Cán bộ thanh tra, Nhà thầu, Chính quyền Phường/Xã), có biên bản, chế tài và quy trình SLA 48h.
  * Một Observation có thể được theo dõi (Follow-up sau 24h-48h) hoặc tổng hợp thành Handoff Dossier để bàn giao chuyển đổi thành Case khi có dấu hiệu vi phạm kéo dài.
- **Quy Trình Nộp Minh Chứng & Chống Tự Cộng Điểm (Anti-Fraud State Machine)**:
  * Khi tình nguyện viên hoặc nhà thầu nộp ảnh minh chứng khắc phục (`PUT /api/actions/:id` hoặc nộp nhiệm vụ), trạng thái chuyển bắt buộc sang `PENDING_VERIFICATION`.
  * **Client không được phép tự duyệt giờ hay tự cộng điểm tín chỉ rèn luyện**: `getUserValidatedHours` trên D1 backend chỉ tính tổng số giờ từ các hoạt động có `validation_status = 'VALIDATED'` đã được cán bộ/điều phối viên kiểm tra đạt chuẩn.
  * State machine (`validateActionTransition`) chặn 100% việc người dùng vai trò `citizen`, `contractor`, `volunteer` tự chuyển trạng thái sang `VERIFIED`.
- **Tính Toán Giờ Tình Nguyện & Xuất Chứng Chỉ A4 Chuẩn Verifiable QR**:
  * Giờ hoạt động chuẩn: 1.5h cơ bản + 0.5h có ảnh minh chứng + 0.5h có công trình liên kết = 2.5h / lượt đã xử lý.
  * Tích lũy 20h tương đương 4.0 tín chỉ ngoại khóa / điểm rèn luyện sinh viên.
  * Xuất bản in A4 chuẩn tài liệu hành chính kèm mã QR SVG độc lập quét kiểm tra ngay trên mobile (`verifyCert`), mã băm toàn vẹn SHA-256 và con dấu số điện tử.

## 7. Citizen Journey & Civic Engagement Invariants (Luồng Người Dân Từ A-Z)
- **Bối cảnh & Vấn đề**:
  - Người dân phản ánh ô nhiễm bụi công trường thường gặp rào cản: biểu mẫu phức tạp, thuật ngữ kỹ thuật, dung lượng ảnh 3G lớn gây lag, sợ bị lộ danh tính, không biết sau khi gửi thì ai xử lý.
- **Quy Tắc Tối Thượng (Invariants — Citizen Journey)**:
  1. **Trang Chủ Dân Sinh (`/citizen`)**:
     - Widget AQI/PM2.5 trực quan với khoảng cách trạm lân cận (~420m), thời gian cập nhật thực tế.
     - 3 CTA hành động cốt lõi: *"Gửi phản ánh"* (Primary `#B51F24`), *"Xem bản đồ"*, *"Theo dõi"*.
     - 4 Quick actions & 3 điểm nóng môi trường trong bán kính 2km quanh vị trí người dân.
  2. **Wizard 5 Bước Phản Ánh Dân Sinh (`/citizen/report/new`)**:
     - **Bước 1 — 7 Civic Categories**: 🏗️ Bụi công trường xây dựng, 🔥 Khói đốt rơm rạ / rác thải, 🚚 Xe chở vật liệu rơi vãi, 🛡️ Công trình không che chắn, 🛣️ Bụi đường / quét rác khô, 💨 Xưởng phát thải / Khói độc, ⚠️ Ô nhiễm không khí khác.
     - **Bước 2 — Định vị 3 tầng (3-Tier Geolocation)**: Tầng 1: GPS 1-chạm (có timeout 8s & low-accuracy fallback); Tầng 2: Tự động trích xuất GPS từ ảnh chụp EXIF; Tầng 3: Ghim tâm Phường/Tỉnh mặc định. Kèm bản đồ Leaflet tương tác.
     - **Bước 3 — Bằng chứng & Nén Client-Side**: Nén ảnh tự động <300KB via canvas/JPEG để tiết kiệm 3G; Tính mã băm Content Hash SHA-256 xác thực toàn vẹn.
     - **Bước 4 — Xem lại & Thông tin liên hệ**: Cam kết ẩn danh 100% bằng ngôn ngữ dân sinh trong sáng, không dùng thuật ngữ công nghệ thô ráp (`UNVERIFIED_SIGNAL`, `Human-in-the-Loop`).
     - **Bước 5 — Hoàn tất & Thẻ Tra Cứu Shopee**: Cung cấp mã tra cứu dạng thẻ Shopee Card dễ sao chép 1 chạm, tự động lưu ngoại tuyến (`offline-drafts`) khi mất mạng và đồng bộ ngay khi có mạng.
  3. **Trang Theo Dõi & Citizen Verification Loop (`/citizen/reports/:id`)**:
     - Shopee-style Tracking Card, QR Code tra cứu, hiển thị timeline tiếp nhận và xử lý thực tế từ D1.
     - Evidence Gallery đối chứng Before / After minh bạch.
     - **Citizen Verification Loop 3 Nút**: *"Tình hình đã cải thiện"* / *"Vẫn còn tình trạng này"* / *"Không rõ tình hình"* để người dân đóng vai trò người giám sát cộng đồng.
     - Bổ sung hình ảnh thực tế mới với nén ảnh <300KB tự động cập nhật vào timeline.
  4. **Zero Glassmorphism & High-Contrast Light Mode**:
     - Tuyệt đối không dùng `backdrop-blur-*`.
     - Nền sáng chữ đậm (`#FDFBF7` cream, `#231b14` ink, `#0d6f64` teal, `#B51F24` seal red).
     - Responsive tối ưu cho mobile viewports (360px - 430px) và desktop.

## 8. Routing Table & Information Architecture SSOT Integrity
- **Bối cảnh & Vấn đề**:
  - Khi codebase có cấu trúc thư mục lồng nhiều tầng (ví dụ `app/src/shared/components/ui/` vs `app/src/components/ui/`), việc viết relative imports như `../../components/ui/Button.jsx` từ `src/shared/components/ui/` sẽ vô tình trỏ đến chính nó (circular self-import), dẫn đến lỗi `[MISSING_EXPORT]` khi Vite/rolldown build production mà test unit có thể bỏ sót.
  - Khi bổ sung các route mới (`/staff/operations`, `/staff/cases`, `/staff/documents`, `/contractor/actions`, `/contractor/projects`), nếu `AppHeader` chỉ map cứng một số ít URL sẽ làm breadcrumbs bị fallback về generic "Bàn làm việc", giảm tính định hướng không gian của người dùng.
  - Trong `AppSidebar`, khi route cha redirect sang route con (ví dụ `/executive` -> `/executive/dashboard` hay `/staff/monitoring` -> `/staff/operations?view=monitoring`), hàm `isActive` nếu chỉ kiểm tra `pathname === path` đơn thuần sẽ khiến menu cha bị mất active highlight.
- **Giải pháp Kiến trúc & Quy tắc Chuẩn hóa**:
  1. **Canonical Relative Imports**: Luôn đếm chính xác số cấp thư mục (`../../../components/ui/...`) hoặc sử dụng path alias `@/` khi re-export giữa các lớp thư viện.
  2. **Smart Dynamic Breadcrumbs SSOT (`AppHeader.tsx`)**:
     - Khai báo đầy đủ `routeNameMap` cho tất cả canonical endpoints của 5 Personas.
     - Triển khai bộ phân giải tiền tố động (`path.startsWith('/staff/cases/')`, `/staff/documents/`, `/contractor/actions/`, `/contractor/projects/`) để luôn hiển thị đúng phân cấp: `Vận hành/Xử lý/Tuân thủ/Nhà thầu > Thực thể > Chi tiết`.
  3. **Query Param & Redirect Aware Sidebar (`AppSidebar.tsx`)**:
     - `isActive` nhận diện thông minh cả URL Path và URL Query params (`location.search.includes('view=monitoring')`, `view=alerts`, `view=sla`).
     - Tự động map `/staff` với `/staff/dashboard` và `/executive` với `/executive/dashboard`.
  4. **RBAC & Mode Switch Synchronization (`rbac-rules.js`, `mode-switch-model.js`)**:
     - Đồng bộ các route `/documents`, `/templates`, `/youth`, `/map`, `/executive-app`, `/admin-app` vào ma trận phân quyền và mô hình nhận diện active mode.

## 9. LegalTech Rules-as-Code & Google-Docs-like Editor Invariants
- **Bối cảnh & Vấn đề**:
  - Khi soạn thảo văn bản hành chính (Biên bản kiểm tra, Biên bản VPHC, Quyết định xử phạt, Báo cáo khắc phục), việc trích dẫn quy phạm pháp luật không được để LLM hallucinate hoặc hardcode rời rạc; phải dựa 100% vào Legal SSOT (`legalRulesSSOT.js` & `legalRuleEngine.js`).
  - Các biến nội suy trong mẫu văn bản (`{{site.name}}`, `{{violation.pm25}}`, `{{inspection.date}}`, `{{contractor.name}}`) nếu thiếu fallback có nguy cơ sinh ra chuỗi `"undefined"` hoặc làm vỡ cấu trúc JSON AST.
  - Văn bản hành chính nhà nước phải tuân thủ nghiêm ngặt thể thức Nghị định 30/2020/NĐ-CP (khổ A4 210x297mm, căn lề 30/15/20/20mm, font Times New Roman 13-14pt, layout 2 cột quốc hiệu/tiêu ngữ và nơi nhận/chữ ký) cả trên trình duyệt, khi in ấn (Print CSS) và khi xuất file DOCX nhị phân.
- **Quy Tắc Chuẩn Hóa & Giải Pháp**:
  1. **Legal Citation Grounding (6 Văn Bản Quy Phạm Pháp Luật)**:
     - Nghị định 45/2022/NĐ-CP (Điều 15, Điều 20, Điều 43).
     - QCVN 18:2021/BXD (Mục 2.1, Mục 5.2, Mục 8.2).
     - QCVN 05:2023/BTNMT (Chất lượng không khí xung quanh, PM2.5, PM10).
     - Quyết định 48/2024/QĐ-UBND Hà Nội (Điều 4, Điều 5).
     - Nghị định 30/2020/NĐ-CP (Thể thức văn bản hành chính).
     - Nghị định 118/2021/NĐ-CP (Mẫu MBBR01, MQĐ02 xử phạt VPHC).
  2. **Zero Undefined Interpolation Guarantee**:
     - `interpolateAst` & `interpolateText` duyệt qua cả `bindings` thực tế, aliases (`violation.pm25` <-> `telemetry.pm25`, `contractor.name` <-> `site.contractor`) và `TEMPLATE_VARIABLES` mẫu, lọc bỏ hoàn toàn các giá trị `undefined`, `null`, `NaN` hoặc `[object Object]`.
  3. **A4 & DOCX Export Conformance**:
     - Căn lề chuẩn: Trái 30mm (1,701 DXA), Phải 15mm (850 DXA), Trên 20mm (1,134 DXA), Dưới 20mm (1,134 DXA).
     - Chiều rộng vùng in khả dụng: 9,355 DXA; bảng tính độ rộng cột chính xác không thất thoát twips.
  4. **Verification**:
     - 100% passing test suites: `legal-ssot-mapping.test.js` (6/6), `legal-rule-engine-crud.test.js` (5/5), `document-engine-google-docs.test.js` (5/5), `docx-legal-exporter.test.js` (3/3), `official-document.test.js` (5/5).

## 10. Shared Map Component Family, Zero Mock & Role-Aware Spatial Intelligence SSOT
- **Bối cảnh & Vấn đề**:
  - Bản đồ GIS là linh hồn của Civic Tech, nhưng trước đây các mảng mock (`FALLBACK_SITES`, `FALLBACK_SENSORS`, `FALLBACK_REPORTS`, `FALLBACK_HOTSPOTS`, `FALLBACK_MISSIONS`) nằm rải rác trong `SpatialMapWorkspace.jsx`, làm sai lệch tính chân thực của dữ liệu Cloudflare D1.
  - Thiếu bộ component dùng chung (Shared Component Family) khiến việc nhúng bản đồ vào widget Dashboard (`variant="embedded"`) hoặc bộ chọn tọa độ (`variant="picker"`) bị trùng lặp code Leaflet và dễ gây lỗi xám gạch (grey tiles) khi thay đổi kích thước màn hình.
  - Chưa phân tách quyền bảo vệ PII (số điện thoại, email, danh tính người phản ánh) và ghi chú nội bộ cán bộ thanh tra giữa công dân (`citizen`/`public`) và cán bộ (`staff`/`executive`/`admin`).
- **Kiến Trúc & Giải Pháp Chuẩn Hóa (`src/components/map/`)**:
  1. **Shared Map Component Family**:
     - `SpatialMap.jsx`: Container hợp nhất hỗ trợ 3 variants (`workspace`, `embedded`, `picker`), tự động fallback D1 API khi features là `null`, export các preset policy (`citizenPolicy`, `staffPolicy`, `publicPolicy`...).
     - `SpatialMapCanvas.jsx`: Leaflet rendering engine hỗ trợ đa tầng (Sites, Sensors, Reports, Hotspots, Missions, Ward Polygons, User GPS, Picker Marker) kết hợp `MapResizeTrigger` chống xám gạch đa tần số (50ms, 150ms, 350ms, 800ms & ResizeObserver).
     - `MapToolbar.jsx`: Thanh điều khiển bộ lọc, tìm kiếm thời gian thực, chuyển chế độ xem (Tình hình, Cảm biến, Phản ánh, Hoạt động), GPS Quanh tôi và CTA phân quyền.
     - `MapLegend.jsx`: Chú giải Semantic SSOT với bảng màu Civic Tech tương phản cao (`#9F241F` Red nguy cơ cao, `#B45309` Amber cần chú ý, `#0D6F64` Teal đạt chuẩn, `#231B14` Dark ink).
     - `SpatialEntityDrawer.jsx`: Drawer chi tiết phân quyền dữ liệu (ẩn PII/ghi chú nội bộ cho Citizen; hiển thị đầy đủ thông tin kiểm tra cho Staff/Executive).
     - `MapStates.jsx`: Bộ 3 components trạng thái chuẩn (`<MapLoadingState>`, `<MapEmptyState>`, `<MapErrorState>`).
     - `mapCapabilities.js`: Policy resolver ma trận 6 vai trò (`PUBLIC`, `CITIZEN`, `COMMUNITY`, `STAFF`, `EXECUTIVE`, `ADMIN`).
  2. **Zero Mock Invariant**:
     - 100% dữ liệu không gian lấy từ Cloudflare D1 persistent storage (`/api/map`).
     - Khi API rỗng hoặc không có dữ liệu, hiển thị `<MapEmptyState>` đúng quy tắc thay vì nạp dữ liệu ảo.
  3. **Verification**:
     - Test suite `tests/spatial-intelligence-map.test.js` (8/8 tests pass 100%).
     - Đóng gói frontend `npm run build` thành công trong 3.28s.
