# DUSTGUARD VN — SSOT TIMELINE (MEMORY BANK)

> **Cập nhật mốc phát triển và lịch sử trạng thái dự án**  
> *Đồng bộ với .agents/TIMELINE.md*

---

## 📅 Các Mốc Phát Triển Chính (Milestones)

### 04. [2026-09-06] `youth-contributions-hours-redesign-and-summary-modal`: Tái Cấu Trúc Dấu Ấn Đóng Góp, Giờ Thực Tế & Bảng Tổng Hợp Minh Chứng Tác Động Cộng Đồng (Contribution Summary Modal)
- **Bối cảnh & Mục tiêu**:
  - Chuyển đổi mô hình khen thưởng tình nguyện từ cơ chế cứng nhắc "20 giờ = 4.0 tín chỉ" sang **"Dấu ấn đóng góp & Giờ thực tế" (Contribution Hours & Community Impact)**.
  - Tôn vinh thời gian cống hiến thực địa của thanh niên, học sinh, sinh viên và tình nguyện viên vì cộng đồng mà không ép buộc chia nhỏ định mức tín chỉ hàn lâm.
  - Xây dựng component `ContributionSummaryModal.tsx` đóng vai trò bảng tổng kết dấu ấn số, trực quan hóa 4 chỉ số thực chất: Tổng giờ thực địa, Hoạt động đã tham gia, Địa bàn phủ sóng (phường/xã), và Tác động môi trường đã thẩm tra.
  - Mở rộng API backend `apps/server/src/routes/me.routes.ts` (`GET /api/me/contributions/summary` & `GET /api/me/contributions/log`) với khả năng tính toán giờ thực tế từ chuỗi bằng chứng băm SHA-256 Web Crypto.
- **Phạm vi hoàn tất**:
  1. `apps/web/src/utils/creditCalculator.ts`: Viết lại logic tính toán đóng góp, bảo toàn giờ thực tế (4.0h cho phản ánh đủ bằng chứng/định vị/đối chứng, 80% cho hoạt động đang xử lý), loại bỏ phép chia 20h / 4.0 tín chỉ.
  2. `apps/web/src/components/modals/ContributionSummaryModal.tsx` [NEW]: Thiết kế modal tổng hợp Dấu ấn đóng góp sáng màu, chuẩn Civic High-Contrast, không glassmorphism, hiển thị mã băm số, QR tra cứu và danh mục hoạt động thực chất.
  3. `apps/web/src/pages/YouthCreditsPage.tsx`: Tinh chỉnh toàn bộ giao diện thành "Dấu ấn đóng góp", hiển thị biểu đồ tác động, thẻ giờ thực địa và nút "Mở bảng tổng hợp minh chứng".
  4. `apps/server/src/routes/me.routes.ts`: Bổ sung endpoint tổng hợp dữ liệu đóng góp thực tế từ CSDL SQLite SSOT.
  5. `tests/youth-credits.test.js`: Cập nhật 5/5 tests kiểm tra logic Dấu ấn đóng góp, giờ thực tế và tác động cộng đồng PASS 100%.
  6. `docs/dustguard-he-thong-hien-tai.md` [NEW]: Biên soạn tài liệu chi tiết về toàn bộ kiến trúc và hiện trạng vận hành DustGuard VN.
- **Kiểm chứng Chất lượng**:
  - `node --test tests/youth-credits.test.js`: 5/5 PASS.
  - `node --test tests/cross-side-sync.test.js`: 6/6 PASS.
  - 100% build pass, không lỗi runtime, sẵn sàng commit.

### 03. [2026-09-06] `master-rebuild-location-ssot-and-vietnam-2-level-admin-geography`: Rebuild Toàn Bộ Mock Data, Location & Địa Lý Hành Chính 2 Cấp Việt Nam (Hà Nội SSOT Demo Origin: 62 Nguyễn Chí Thanh)
- **Bối cảnh & Mục tiêu**:
  - Chuyển đổi toàn bộ hệ thống DustGuard VN sang **Mô hình hành chính 2 cấp** (Cấp 1: Tỉnh / Thành phố trực thuộc TW; Cấp 2: Phường / Xã / Đặc khu).
  - Loại bỏ hoàn toàn cấp trung gian (Quận / Huyện / Thị xã) khỏi UI, form, filter, database seed và mock dataset.
  - Thiết lập **Location Source of Truth** duy nhất (`DEMO_LOCATION` tại 62 Nguyễn Chí Thanh, Phường Láng Thượng, Hà Nội - `21.0205, 105.8078`).
  - Xóa sạch 100% dữ liệu TP.HCM (Quận 7, Thủ Đức, Bình Thạnh, Trạm trung tâm TP.HCM...) khỏi toàn bộ Side A (Port 3000), Side B (Port 3002) và Landing Page.
  - Tính toán khoảng cách thực tế (Dynamic Haversine Distance) thay vì hardcode `~420m`.
- **Phạm vi hoàn tất**:
  1. `packages/shared/src/constants/location.ts` [NEW]: Thiết lập SSOT Location module gồm `DEMO_LOCATION`, `HANOI_CENTER`, `calculateDistanceMeters()`, `formatDistance()`, `HANOI_DEMO_WARDS`, `HANOI_DEMO_ENTITIES` (4 sensors, 4 constructions).
  2. `apps/server/src/db/seed.ts` & SQLite Database (`data/dustguard-community.db`): Viết lại bộ seed hoàn chỉnh gồm 16 users, 4 communities, 15 cases (Golden Case `DG-C-2026-0842` Huỳnh Thúc Kháng - Nguyễn Chí Thanh), 32 reports, 12 tasks đều tại các phường Láng Thượng, Láng Hạ, Thành Công, Giảng Võ, Yên Hòa.
  3. `dustguard-operations/apps/server/src/db/seed.ts` & DB (`dustguard-operations/data/dustguard-operations.db`): Viết lại 13 users, 5 contractors, 6 projects, 26 cases (Golden Case `DG-2026-OP-014`), IoT devices, inspections, signals theo mô hình 2 cấp Hà Nội.
  4. `apps/web/src/pages/DashboardPage.tsx`: Hero context tại 62 Nguyễn Chí Thanh, Hà Nội; widget sensor tính khoảng cách động qua `calculateDistanceMeters` (~136m); 3 highlight cards chuyển sang trục Láng Hạ - Huỳnh Thúc Kháng, Chùa Láng, Huỳnh Thúc Kháng.
  5. `apps/web/src/pages/CreateReportPage.tsx`: Form 2 cấp (Địa chỉ chi tiết, Tỉnh/Thành phố: Hà Nội, Phường/Xã: Láng Thượng), bỏ dropdown Quận/Huyện; cập nhật placeholder địa chỉ 62 Nguyễn Chí Thanh.
  6. `apps/web/src/pages/ReportsListPage.tsx`: Cập nhật bộ lọc địa bàn sang danh mục các phường Hà Nội.
  7. `apps/web/src/utils/geocoding.ts`: Chuyển đổi toàn bộ từ điển tọa độ và fallback geocoding sang Hà Nội.
  8. `dustguard-operations/apps/web/src/pages/CaseInboxPage.tsx` & `ProjectsPage.tsx` & `PublicReportModal.tsx`: Đổi nhãn `Quận / Huyện` thành `Phường / Xã (Hà Nội)`, default tọa độ và địa bàn Hà Nội.
- **Kiểm chứng Chất lượng**:
  - `npm --prefix apps/web run build` & `npm --prefix dustguard-operations/apps/web run build`: PASS 100% (0 lỗi).
  - `npm --prefix app run verify:quick`: 30 test files & 5 UI smoke suites PASS (248 domain tests + 43 layout tests).
  - `node scripts/test-responsive-matrix.js`: 45/45 PASS trên 5 viewports (Mobile 390x844, 430x932, Tablet 768x1024, Laptop 1280x720, Desktop 1440x900), 0 console error, 0 horizontal overflow.
  - `agent-browser`: Trực tiếp mở và snapshot tại `localhost:3000/dashboard`, `localhost:3000/reports/new`, `localhost:3000/reports`, `localhost:3002/dashboard`, `localhost:3002/projects`. Không còn bất kỳ dấu vết nào của Quận 7, Thủ Đức, Bình Thạnh hay Trạm trung tâm TP.HCM.

### 02. [2026-09-06] `dustguard-community-smart-geocoding-and-draggable-pin`: Nâng Cấp Bản Đồ Kiểu Google Maps, Tìm Kiếm Địa Chỉ Thông Minh & Ghim Kéo Thả Trực Quan (Draggable Pin)
- **Mục tiêu**: Giải quyết dứt điểm vấn đề ghim bản đồ bị lệch vị trí (mặc định trung tâm Quận 1 dù người dùng gõ địa chỉ Quận 7); tích hợp cơ chế Geocoding thông minh kiểu Google Maps, cho phép kéo thả ghim tự do và mở trực tiếp vị trí trên Google Maps.
- **Nguyên nhân gốc rễ**: Trước đây form tạo phản ánh chỉ lưu tọa độ tĩnh (`10.7769, 106.7009`) mà không chuyển đổi (geocoding) từ chuỗi địa chỉ người dùng nhập (`250 Nguyễn Hữu Thọ, Phường Tân Hưng, Quận 7`), đồng thời `LeafletMap` không hỗ trợ kéo thả ghim (`draggable: true`) và không có ô tìm kiếm địa điểm.
- **Phạm vi hoàn tất**:
  1. `apps/web/src/utils/geocoding.ts`: Tạo module Geocoding hỗ trợ tìm kiếm địa chỉ tự động qua Photon API (OpenStreetMap), Reverse Geocoding khi kéo thả ghim, từ điển tọa độ 24 quận huyện TP.HCM và hàm tạo link Google Maps trực tiếp.
  2. `apps/web/src/components/common/LeafletMap.tsx`: Nâng cấp ghim đỏ giọt nước chuẩn bản đồ (`custom-selected-pin` với mũi nhọn chỉ chuẩn xác tọa độ), hỗ trợ kéo thả tự do (`draggable: true`, sự kiện `dragend`) và tự động `flyTo` mượt mà khi đổi vị trí.
  3. `apps/web/src/pages/CreateReportPage.tsx`: Tích hợp thanh tìm kiếm địa chỉ Google Maps style với dropdown gợi ý tức thời, nút "GPS của tôi", nút "Ghim vị trí theo địa chỉ này", nút "Xem vị trí trên Google Maps".
  4. `apps/web/src/pages/ReportDetailPage.tsx`: Bổ sung nút liên kết "Mở trên Google Maps" (`Navigation` icon) và hiển thị chỉ số tọa độ chính xác `(lat, lng)`.
  5. Cập nhật lại tọa độ chuẩn cho các báo cáo trong SQLite DB (`rep_1788680347460_105c88bb` từ trung tâm Quận 1 về đúng đường Nguyễn Hữu Thọ, Tân Hưng, Quận 7 `10.7448°N, 106.7015°E`).
- **Kiểm chứng**: Đã kiểm tra runtime qua `agent-browser` tại `http://localhost:3000/reports/new` và `http://localhost:3000/reports/rep_1788680347460_105c88bb`, gợi ý địa chỉ tức thì, ghim bay chuẩn xác, 248 domain tests và 43 UI smoke tests đạt 100% pass.

### 01. [2026-09-06] `dustguard-community-fix-recent-reports-dashboard`: Khắc Phục Lỗi Hiển Thị "Phản Ánh Gần Đây Của Tôi" Trên Dashboard Cộng Đồng (Side A) & Khớp Nối Auth Token Backend
- **Mục tiêu**: Khắc phục triệt để lỗi khi người dân gửi phản ánh môi trường mới nhưng khi quay lại Dashboard (`/dashboard`) thì mục "Phản ánh gần đây của tôi" không hiển thị (bị rỗng) và số lượng phản ánh bị rỗng ngoặc `Xem tất cả ()`.
- **Nguyên nhân gốc rễ (Root Cause)**:
  1. `apps/server/src/routes/dashboard.routes.ts`: Route `GET /api/dashboard/community` thiếu middleware `optionalAuthenticateToken`, dẫn đến không trích xuất được `req.user` từ header `Authorization: Bearer <token>`.
  2. `apps/server/src/repositories/index.ts`: Phương thức `DashboardRepository.getCommunityDashboard()` không nhận `currentUserId`, không truy vấn `myReports` và thiếu `stats.totalReports` (khiến UI hiển thị `Xem tất cả ()` thay vì số lượng thật).
  3. `server/community.ts`: Câu lệnh SQLite query `myReports` sử dụng sai tên cột `WHERE user_id = ?` (trong bảng `reports` cột lưu trữ thực tế là `reporter_id`).
  4. `apps/web/src/pages/DashboardPage.tsx`: Hook `useEffect` fetch dữ liệu ban đầu có dependency array rỗng `[]`, không tự động re-fetch khi đổi vai trò thử nghiệm (`auth:role_changed`) hoặc khi người dùng hoàn tất tạo phản ánh mới.
- **Phạm vi hoàn tất**:
  - `apps/server/src/routes/dashboard.routes.ts`: Bổ sung `optionalAuthenticateToken` cho cả `GET /` và `GET /community`, truyền `req.user?.id` vào repository.
  - `apps/server/src/repositories/index.ts`: Bổ sung `currentUserId` cho `DashboardRepository.getCommunityDashboard()`, truy vấn `myReports` theo `reporter_id = ?` (hoặc public reports nếu vãng lai), bổ sung đầy đủ các chỉ số `totalReports`, `resolvedCases`, `communityMembers`, `activeCases`.
  - `server/community.ts`: Sửa `user_id` thành `reporter_id`.
  - `apps/web/src/pages/DashboardPage.tsx`: Cập nhật `useEffect` lắng nghe `[user?.id]` và sự kiện `auth:role_changed` để tự động làm mới dữ liệu thời gian thực.
  - **Kiểm chứng Runtime**: Đã kiểm tra trực tiếp qua `agent-browser` tại `http://localhost:3000/dashboard`, phản ánh vừa tạo "Bụi mù mịt công trình thi công đường Nguyễn Văn Linh" (mã `DG-C-2026-8993`) hiển thị ngay đầu danh sách; `Xem tất cả (93)` hiển thị số lượng chuẩn xác từ SQLite DB. Toàn bộ 248 domain tests và 43 UI smoke tests đạt 100% pass.

### 00. [2026-09-06] `dustguard-operations-side-b-final-runtime-and-ux-audit`: Hoàn Thành Kiểm Toán Runtime & UX Toàn Diện DustGuard Operations (Side B), Xóa Bỏ Live Pulse, Mở Rộng 100% Hàng Đợi Ưu Tiên, Khắc Phục 100% Lỗi API/DB & Kiểm Chứng Bằng Agent-Browser
- **Mục tiêu**: Xóa bỏ hoàn toàn "Nhịp Vận Hành (Live Pulse)" khỏi Dashboard Side B (`http://localhost:3002/dashboard`), mở rộng "Hàng Đợi Xử Lý Ưu Tiên" (Priority Queue) thành vùng nội dung chính 100% chiều ngang với đầy đủ 7 cột thông tin chuẩn; kiểm thử runtime toàn bộ 25 routes qua `agent-browser`, xác minh backend SQLite SSOT, sửa toàn bộ các lỗi phát hiện và chuẩn hóa thuật ngữ tiếng Việt Civic Tech.
- **Phạm vi hoàn tất**:
  - **Dashboard & Layout**: Xóa sạch component Live Pulse, queries `operationalPulse`, CSS và polling. Cho bảng "Hàng Đợi Xử Lý Ưu Tiên" chiếm trọn chiều ngang khả dụng dưới KPI cards với 7 cột chuẩn (`Mức độ`, `Mã vụ việc`, `Tên vụ việc`, `Địa bàn`, `Phụ trách`, `Trạng thái`, `Hành động`), tích hợp `min-w-[880px]` để chống co rút cột ở laptop Windows scale 125%.
  - **Kiểm Thử Đa Khung Nhìn (Multi-Viewport Matrix)**: Xác minh và lưu ảnh chụp runtime tại Desktop 1920x1080, Laptop 1440x900, Laptop 1280x800 (125% scaling), Tablet 768x1024, Mobile 390x844.
  - **Khắc Phục Lỗi Runtime Nghiêm Trọng**:
    - Sửa vòng lặp redirect vô hạn (`window.location.replace`) trong `LoginPage.tsx` và bổ sung auto-auth dev mode trong `AuthContext.tsx`.
    - Sửa lỗi truy vấn cột không tồn tại `WHERE status != 'ARCHIVED'` trên bảng `signals` tại `iot.router.ts`.
    - Bổ sung endpoint thiếu `GET /api/iot/devices/:id/readings` trong `iot.router.ts`.
    - Bỏ điều kiện role cho `supervisorData` trong `dashboard.router.ts` để trang Điều phối nhân lực (`/supervisor/workload`) luôn tải dữ liệu thực tế mượt mà.
    - Sửa leak thẩm quyền RBAC hiển thị nút phân công cho `staff` trong `CaseDetailPage.tsx`.
  - **Xác Minh Đột Biến SQLite SSOT Thực Tế (Không Dùng Dữ Liệu Giả)**:
    - Flow 1 (Vụ việc): Chuyển trạng thái sang `TRIAGED`, phân công cán bộ `usr-staff-1`, F5 reload bảo toàn.
    - Flow 2 (Công trình): Tạo công trình `CT-NVL-2026-01`, lưu vào bảng `projects`.
    - Flow 3 (Nhà thầu): Tạo nhà thầu `Công ty CP Xây dựng Giao thông Cienco 1` (`ctr-ec362df7`), lưu vào bảng `contractors`.
    - Flow 4 (Hiện trường & Khắc phục): Kiểm tra biên bản 10 tiêu chí QCVN 18, xuất biên bản A4 (`/inspections/:id/export`), xuất thông báo khắc phục A4 (`/actions/:id/notice`).
    - Flow 5 (IoT & Cảnh báo): Hiển thị trạm phần cứng, kiểm tra tính toàn vẹn HMAC-SHA256, bấm "Tạo Vụ việc từ trạm" -> tạo vụ việc mới `DG-2026-OP-032` ghi nhận vào SQLite.
    - Flow 6 (Bằng chứng số): Kiểm tra kho bằng chứng và hàm kiểm định băm SHA-256 Web Crypto.
    - Trí tuệ pháp lý: Phân tích hồ sơ vụ việc, tra cứu toàn văn FTS5 điều khoản quy phạm, chuẩn hóa từ ngữ loại bỏ "FTS5/FT5S" kỹ thuật.
    - Tìm kiếm toàn hệ thống (`Ctrl+K`): Tìm kiếm thời gian thực vụ việc, nhiệm vụ, điều luật, trạm IoT và điều hướng chính xác.
  - **Chất Lượng Code & Kiểm Thử**:
    - Production bundle build (`npm run build`) thành công 100% trong 4.74s.
    - Toàn bộ 32 bài test API operations đạt 100% pass (`ℹ pass 32, ℹ fail 0`).
    - Toàn bộ 248 bài test domain và 43 bài test UI smoke đạt 100% pass.

### 00. [2026-09-06] `dustguard-operations-cleanup-side-b-header`: Chuẩn Hóa Ranh Giới Nghiệp Vụ Hai Phía, Loại Bỏ Nút "Báo Cáo Dân Cư" Thừa Trên Header Side B (Port 3002)
- **Mục tiêu**: Đảm bảo nguyên tắc phân định ranh giới nghiêm ngặt giữa Side A (Cộng đồng / Phản ánh dân cư tại port 3000) và Side B (Cán bộ / Điều hành tác nghiệp tại port 3002). Nút "Báo cáo dân cư" cùng modal `PublicReportModal` được dọn dẹp khỏi header Side B (`dustguard-operations/apps/web/src/components/layout/AppLayout.tsx`) để tránh nhập nhằng vai trò người dùng và giao diện quản lý.
- **Phạm vi hoàn tất**:
  - Gỡ bỏ nút bấm "Báo cáo dân cư" (`<Megaphone />`) trên thanh header của `AppLayout.tsx` (Side B).
  - Gỡ bỏ import và trạng thái mở modal `PublicReportModal` không cần thiết trong `AppLayout.tsx`.
  - Giữ nguyên API tiếp nhận tín hiệu từ xa `POST /api/signals/public-report` trên server để phục vụ liên thông tự động từ Side A.
  - TypeScript build (`npx tsc --noEmit`) đạt 100% không lỗi.

### 00. [2026-09-06] `dustguard-community-side-a-rebuild-and-cross-side-completion`: Toàn Diện Tái Thiết Kế & Hoàn Thiện DustGuard Community (Side A) Đạt Chuẩn Benchmark Side B, Triệt Tiêu 100% Mock, Khép Kín Luồng Liên Thông Hai Chiều Side A ↔ Side B, Hoàn Tất Kiểm Thử Runtime & Ma Trận Hiển Thị 45/45 Pass
- **Mục tiêu**: Nâng cấp toàn diện sản phẩm DustGuard Community (Side A, runtime tại `http://localhost:3000`, API tại `http://localhost:3001`), lấy DustGuard Operations (Side B tại `http://localhost:3002`, API tại `http://localhost:4000`) làm thước đo benchmark. Vận hành thật 100% trên cơ sở dữ liệu SQLite SSOT, loại bỏ toàn bộ mock, gỡ bỏ floating dev controls, tối ưu typography và layout sáng màu, touch targets >= 44px, không glassmorphism, liên thông hai chiều tự động giữa Side A và Side B.
- **Phạm vi hoàn tất**:
  - **Design System & Nhận diện Thương hiệu**:
    - Chuẩn hóa logo khiên chính thức `/images/logo/dustguard-shield-logo.webp`, tiêu đề "DustGuard" và phụ đề "Cộng đồng môi trường".
    - Xây dựng hệ token màu sắc chuẩn: DustGuard Red (`#9F241F`, hover `#7E1C18`, light `#FDF2F1`, border `#F8D3D1`), các bề mặt trung tính ấm áp (`#F7F6F3`, `#F2EFE9`, `#EBE7DF`), semantic colors (`#1B7A4B`, `#B45309`, `#0D6F64`).
    - Cấm tuyệt đối glassmorphism, tuân thủ `scrollbar-gutter: stable`, `text-wrap: pretty`, touch target >= 44px.
  - **AppShell & Điều Hướng Thông Minh**:
    - Topbar 56px với breadcrumb động, nút chuyển nhanh sang Cổng Điều Hành (Side B), chuông thông báo hiển thị số lượng thật từ `/api/notifications`.
    - Sidebar tổ chức theo 5 nhóm nghiệp vụ đời thường: Phản ánh & Theo dõi, Mạng lưới cộng đồng, Cá nhân, Điều phối viên, Quản trị hệ thống.
    - Gỡ bỏ hoàn toàn thanh nổi "DEV ROLE" ở góc màn hình; tích hợp tinh gọn thành dropdown trong footer sidebar chỉ hiển thị khi `import.meta.env.DEV === true`.
    - Profile footer hiển thị danh tính và vai trò bằng tiếng Việt chuẩn ("Người dân", "Thành viên CLB", "Điều phối viên", "Quản trị viên").
  - **Quy Trình Gửi Phản Ánh Mới (Report Creation Wizard)**:
    - Redesign Stepper 4 bước với số bước tròn, ring active, checkmark hoàn thành và thanh nối tiến trình.
    - Sửa triệt để bug upload ảnh khách vãng lai không có JWT session bằng fallback `report.reporter_id || 'usr_citizen'`.
    - Tích hợp tính mã băm SHA-256 Web Crypto tự động cho từng tệp ảnh đính kèm.
    - Lưu trữ bền vững vào SQLite `reports` và `media`. F5 reload vẫn bảo toàn dữ liệu 100%.
  - **Liên Thông Hai Chiều Side A ↔ Side B (E2E Test Trọng Tâm)**:
    - Citizen gửi phản ánh `DG-C-...` trên Side A -> Điều phối viên xác thực và tạo vụ việc -> Bàn giao sang Cổng Điều Hành Side B (port 4000) -> Cán bộ Side B thụ lý, đổi trạng thái sang `ASSIGNED` -> Webhook sync về Side A (port 3001) -> Side A cập nhật trạng thái `in_progress` và thêm mốc diễn tiến vào `case_updates` -> Giao diện người dân tại `http://localhost:3000/cases/:id` cập nhật tức thì.
  - **Tái Cấu Trúc "Tín Chỉ Thanh Niên" -> "Hành Trình Đóng Góp"**:
    - Xóa bỏ mọi thuật ngữ crypto/token/credit gây hiểu nhầm. Thay bằng "Hành trình đóng góp", "Dấu ấn cộng đồng", số giờ tình nguyện và tổng số phản ánh được ghi nhận.
    - Tích hợp Modal xem và in Giấy chứng nhận đóng góp thanh niên (`ContributionSummaryModal.tsx`).
    - Tự động chuyển hướng URL cũ `/credits` và `/youth/credits` sang `/contributions`.
  - **Kiểm Thử Ma Trận Hiển Thị Đa Viewport (Playwright Matrix Audit)**:
    - Kiểm thử tự động 5 viewports: `390x844` (Mobile), `430x932` (Mobile lớn), `768x1024` (Tablet), `1280x720` (Laptop 125% scale), `1440x900` (Desktop) trên 9 tuyến đường nghiệp vụ chính.
    - Kết quả: **45/45 PASS 100%**, không có bất kỳ trang nào bị tràn ngang (`scrollWidth <= innerWidth`), 0 lỗi console.
  - **Build & Quality Gate**:
    - `npm --prefix apps/web run build`: TypeScript & Vite build thành công 100% (0 lỗi type).
    - `npm --prefix apps/server run build`: TypeScript server build thành công 100% (0 lỗi type).
    - Toàn bộ các bài test E2E (`test-create-report-e2e.js`, `test-side-a-side-b-e2e.js`) đều PASS 100%.

### 00. [2026-09-06] `landing-section-2-redesign-14inch-compact`: Tái Thiết Kế Section 2 (Vấn Đề & Rào Cản) Chuẩn Mockup, Gọn Đẹp, Vừa Khít Viewport Máy 14 Inch Scale 125%
- **Mục tiêu**: Tái cấu trúc và thiết kế lại hoàn toàn Section 2 (`ProblemStory.tsx`) của Landing page theo mẫu thiết kế chuẩn; thu gọn chiều cao từ 1078px xuống còn ~590px để hiển thị trọn vẹn (vừa khít 1 khung nhìn không bị cuộn trôi tiêu đề) trên màn hình laptop 14 inch ở mức tỉ lệ phóng đại 125% của Windows.
- **Phạm vi hoàn tất**:
  - **Header & Quote Card**:
    - Layout 2 cột cân đối: Bên trái là Badge `THỰC TRẠNG & GIẢI PHÁP`, Tiêu đề đậm sắc nét *"Phản ánh không khó. Theo dõi đến kết quả mới khó."* và đoạn mô tả súc tích.
    - Bên phải tích hợp Quote Card biên tập thanh lịch: Dấu ngoặc kép đôi màu đỏ to `“`, dòng trích dẫn cảm hứng, nhãn thương hiệu DustGuardVN và dòng chữ nghiêng nghệ thuật chuẩn tiếng Việt *"Không chỉ nhận phản ánh mà đi đến kết quả"*.
  - **Cột Trái (3 Rào cản chính)**:
    - 3 card bo góc mềm mại, số tròn `01`, `02`, `03` màu đỏ kèm icon vuông bo góc nền cam nhạt (#FAF0EB viền #ECD3C6).
    - Tiêu đề đậm, nội dung gọn gàng, dòng cảnh báo chấm than đỏ `!` ở đáy thẻ nổi bật và tinh tế.
  - **Cột Phải (2 Chu trình đối chiếu)**:
    - Hộp 1: "Quy trình truyền thống (đứt gãy)" - viền đỏ nhạt, badge "Dễ thất lạc hồ sơ", 4 bước ngang kết nối bằng mũi tên đỏ, dải alert đỏ ở đáy kèm badge "High Drop-Off".
    - Hộp 2: "Chu trình DustGuard (khép kín)" - viền xanh teal thương hiệu, badge "Mã định danh duy nhất", 4 bước ngang kết nối bằng mũi tên xanh, dải bảo chứng xanh ngọc ở đáy kèm badge "Closed-Loop".
  - **Footer Section**:
    - Dải slogan ngăn cách tinh tế: `— MINH BẠCH HƠN HÔM NAY, KHÔNG KHÍ SẠCH HƠN NGÀY MAI —`.
  - **Tối ưu Responsive & Kích thước Viewport 14" Scale 125%**:
    - Giảm tổng chiều cao section từ 1078px xuống 593px (giảm ~45%), hiển thị trọn vẹn trong 1 màn hình laptop 14 inch (viewport height ~720-768px).
    - Đảm bảo 0 lỗi font chữ, 0 co giật giao diện, build TypeScript pass 100%.

### 00. [2026-09-06] `route-graph-audit-and-canonical-auth-consolidation`: Kiểm Toán 100% Route Toàn Repo, Hợp Nhất Cổng Đăng Nhập /login (Một Nền Tảng · Hai Phía), Redirect /operations/login và Dọn Dẹp Nhãn Sai Lệch Kiến Trúc
- **Mục tiêu**: Thực thi kiểm toán 100% routes toàn hệ thống bằng code scanner; hợp nhất 2 màn hình login trùng lặp (`/login` và `/operations/login`) thành một cổng canonical duy nhất `/login` với tab chuyển đổi 2 phía (Phía Cộng đồng & Phía Đơn vị Xử lý); cấu hình chuyển hướng HTTP 302 Edge Worker bảo toàn deep-link cho `/operations/login`; xóa bỏ hoàn toàn dòng text sai lệch kiến trúc ("SSOT SQLite cục bộ") và ẩn danh sách tài khoản mật khẩu công khai trừ khi bật `?demo=1`.
- **Phạm vi hoàn tất**:
  - **Quét Toàn Diện Route Graph Bằng Code Scanner**:
    - `audit-output/route-inventory.json`: 96 frontend routes hoạt động (53 Side A + 43 Side B), 130 legacy routes (cô lập trong `app/`), 81 Cloudflare Worker API routes, 57 dev Express routes (Tổng 138 API endpoints).
    - `audit-output/route-matrix.json`: 226 mục route phân loại Keep, Merge, Redirect, Retire; 0 broken link trong tổng số 33 navigation targets.
  - **Hợp Nhất Cổng Đăng Nhập Duy Nhất `/login`**:
    - `apps/web/src/pages/LoginPage.tsx`: Hỗ trợ đăng nhập trực tiếp cho cả 2 phía. Tab "Phía Cộng đồng" xác thực qua `/api/auth/login` (bảng `users`), tab "Đơn vị Xử lý" xác thực qua `/api/operations/auth/login` (bảng `ops_users`).
    - Tự động kích hoạt tab dựa vào query `?side=operations` hoặc deep-link.
    - Điều hướng chuẩn tắc theo vai trò (`getDefaultRoute` trong `apps/web/src/config/routes.ts`).
    - Demo Mode an toàn: Ẩn hoàn toàn tài khoản demo và mật khẩu mẫu trên production; chỉ hiển thị khi có tham số `?demo=1` hoặc toggle chủ động.
  - **Chuyển Hướng Chuẩn Tắc `/operations/login`**:
    - Cấu hình HTTP 302 Redirect cấp Edge Worker (`server/index.ts`) từ `/operations/login` sang `/login?side=operations` (bảo toàn `returnTo`).
    - Thay thế `dustguard-operations/apps/web/src/pages/LoginPage.tsx` bằng client-side redirect component, triệt tiêu 100% trùng lặp UI và nguy cơ lỗi 404.
    - Khắc phục cơ chế phân phối SPA Cloudflare Worker (`server/index.ts`): Trực tiếp phục vụ `/operations/index.html` cho các subroute không có đuôi file của Side B thay vì bị root SPA override.
  - **Xóa Sạch Thông Tin Sai Lệch Kiến Trúc**:
    - Xóa bỏ triệt để `"Hệ thống lưu trữ dữ liệu chân thực SSOT SQLite cục bộ."` trên màn hình login cũ.
    - Cập nhật nhãn `"Dữ liệu Thực tế SQLite SSOT"` thành `"Dữ liệu Thời gian thực SSOT"` trên trang Reports.
    - Chuẩn hóa các nhãn tra cứu FTS5 và chứng chỉ số SSOT.
  - **Kiểm Chứng Runtime Sống Trên Production (`dustguard.phamphunguyenhung.com`)**:
    - `verify-live-auth-consolidation.mjs`: 16/16 test PASS (Commit `dc1649a`, D1/R2 OK, 302 redirect OK, Auth A & B OK).
    - `test-production-e2e.js`: 31/31 test PASS 100%.
    - Browser test xác thực: `/login`, `/login?side=operations&demo=1`, chuyển hướng `/operations/login` và đăng nhập thực tế vào `/operations/dashboard`.

### 00. [2026-09-06] `header-navbar-redesign-refinement`: Tinh Giản Header Đạt Chuẩn Civic-Tech SaaS, 2 Nút Tối Giản & Sửa Triệt Để Lỗi Truncate Nút Bấm
- **Mục tiêu**: Redesign toàn diện Navbar/Header của Landing Page theo tiêu chuẩn civic-tech product cao cấp: gọn gàng, tôn ti trật tự visual hierarchy, đồng bộ container 1280px với hero section, tối giản vùng hành động còn đúng 2 nút chính (Đăng nhập có viền và Gửi phản ánh đỏ DustGuard), triệt tiêu hoàn toàn lỗi truncate/dính mép chữ trên các màn hình tỉ lệ cao (laptop 14" scale 125%).
- **Phạm vi hoàn tất**:
  - **Khối Brand / Logo**: Thu gọn kích thước khoảng ~15%, đưa badge `CivicTech` về dạng micro badge tinh tế (`text-[9px]`), đổi màu tagline sang xám xanh muted (`#64748B`) có tracking nhẹ, không tranh spotlight với tiêu đề chính.
  - **Khối Điều hướng (Nav)**: Tích hợp IntersectionObserver phát hiện active section (`#problem`, `#process`, `#roles`, `#pilot`), hiệu ứng hover nền nhẹ `#F3EFEA` và chỉ báo active đỏ vi tế.
  - **Khối Hành động (Actions - Tối giản 2 nút)**:
    - Nút 1 `Đăng nhập`: Secondary Outlined Button viền sắc sảo `border-[#D5CDC3]`, nền trắng, text `#1E293B` font-semibold, bo góc `rounded-xl`, padding chuẩn `px-5`.
    - Nút 2 `Gửi phản ánh`: Dominant CTA màu đỏ DustGuard `#B42318`, bo góc `rounded-xl`, chiều cao 40px, padding chuẩn `px-5`, icon máy bay giấy nhỏ gọn, hiệu ứng nhấn mượt mà.
    - Khắc phục triệt để lỗi non-standard Tailwind `px-4.5` (gây padding: 0) bằng `px-5` kèm `whitespace-nowrap shrink-0` chống co giật và rớt chữ.
  - **Mobile Drawer**: Hỗ trợ mở menu trượt êm ái, khóa cuộn trang khi mở, tự đóng khi ấn phím ESC hoặc chuyển trang.
  - **Build & Verification**: `tsc && vite build` thành công 100% trong 8.29s, 0 lỗi runtime.
- **Mục tiêu**: Thay thế toàn diện icon SVG/emoji tạm bợ bằng Logo hình chiếc khiên chính thức của DustGuard VN (`dustguard-shield-logo.webp`), nâng cấp thanh Header trên toàn bộ hệ thống (Side A Landing/Community và Side B Operations) đạt chuẩn giao diện sáng màu, không glassmorphism, tương phản cao, chuyên nghiệp và chỉn chu.
- **Phạm vi hoàn tất**:
  - **Tổ chức Thư viện Static Assets Chuẩn**:
    - Thiết lập thư mục `public/images/logo` cho cả `apps/web` và `dustguard-operations/apps/web`, đồng bộ tệp `dustguard-shield-logo.webp` (biểu tượng chiếc khiên đỏ với bầu trời bụi đô thị và đường chân trời thành phố).
    - Cập nhật favicon từ emoji/SVG tạm thời sang `/favicon.webp` chính thức cho cả Side A và Side B.
  - **Tái Thiết Kế Header Đạt Chuẩn Civic High-Contrast**:
    - **Logo & Thương hiệu**: Hiển thị logo khiên sắc nét kèm hiệu ứng hover vi tế; nhãn `DustGuardVN` nổi bật chữ VN đỏ dấu ấn; bổ sung badge `CivicTech` xanh teal (`#0D6F64`) và tagline *"Giám sát Bụi · Minh bạch Hóa"*.
    - **Thanh điều hướng**: Spacing nhịp nhàng, bo góc 8px, hover nền mềm mại (`#F3EFEA`) chống nhảy layout.
    - **Hành động & Nút bấm**:
      - Chuyển đổi ngôn ngữ `[🌐 EN]`: Đóng gói thành pill button có icon địa cầu tinh tế thay vì text trần.
      - Nút `Đơn vị xử lý ↗`: Chuyển sang gam màu Deep Teal chuẩn CivicTech của Side B.
      - Nút Dominant CTA `[➤ Gửi phản ánh]`: Đỏ dấu ấn `#B42318` rực rỡ, icon Send đồng bộ, tương phản cao.
    - **Footer & Operations AppLayout**: Đồng bộ hóa logo khiên chính thức trên toàn hệ thống.
  - **Build, Deploy & Kiểm Thử Runtime Thực Tế**:
    - Chạy build production hợp nhất thành công 100%.
    - `npx wrangler deploy` đưa bản cập nhật lên live domain `https://dustguard.phamphunguyenhung.com/`.
    - Kiểm tra trực quan bằng `agent-browser`: 0 lỗi console, DOM snapshot chuẩn, hình ảnh minh chứng chụp thực tế lưu tại `artifacts/header-live-verification.png`.
    - Chạy bộ kiểm thử E2E: **31 PASS, 0 FAIL**.
- **Mục tiêu**: Khắc phục dứt điểm lỗi đăng nhập ("Email hoặc mật khẩu không chính xác") do thiếu dữ liệu seed tài khoản mẫu trên Cloudflare D1 Remote; tái thiết kế CSS section ProblemStory ("Phản ánh không khó. Theo dõi đến kết quả mới khó.") đạt chuẩn Civic High-Contrast, cân đối, sắc nét.
- **Phạm vi hoàn tất**:
  - **Khắc phục Xác thực Đăng nhập Remote D1 (Side A & Side B)**:
    - Nạp đầy đủ 8 tài khoản demo vào bảng `users` trên D1 production database `dustguard-production` (bao gồm `citizen@dustguard.local`, `member@dustguard.local`, `moderator@dustguard.local`, `admin@dustguard.local` và alias `@dustguard.vn`, mật khẩu `DustGuard123!`).
    - Xác thực API `/api/auth/login` trên live domain trả về HTTP 200 OK và JWT token hợp lệ.
  - **Tái Thiết Kế CSS Section ProblemStory (Landing Page)**:
    - Loại bỏ hoàn toàn lỗi hiển thị lệch màu (card 02 viền đỏ cam lạc lõng so với 01 và 03).
    - Thiết kế 3 thẻ vấn đề đồng bộ, cân đối, sắc sảo: huy hiệu số `01`, `02`, `03` đỏ bo góc mềm + label uppercase tinh gọn, tiêu đề đậm nét, đoạn văn vừa vặn và dòng hệ quả thực tế rõ ràng ở chân thẻ.
    - Hộp 1 "Quy trình truyền thống (Đứt gãy)": 4 bước rõ ràng, dải cảnh báo chân hộp nổi bật với icon AlertTriangle.
    - Hộp 2 "Chu trình DustGuard (Khép kín)": Viền xanh Teal thương hiệu `#0D6F64`, đường tiến trình nối liền mạch, 4 bước chuyên nghiệp (Tọa độ GPS, Phân công UBND Phường, Khắc phục tại công trình, Tái kiểm 48h với icon CheckCircle2 xanh lá). Dải bảo chứng chân hộp màu xanh ngọc tươi sáng.
  - **Kiểm định Trực quan Bằng Agent-Browser & Live Deploy**:
    - Chạy build và deploy production thành công 100% qua `wrangler deploy`.
    - Chụp ảnh minh chứng thực tế trên domain `https://dustguard.phamphunguyenhung.com/` (`landing_verified.png`).

### 00. [2026-09-06] `production-d1-r2-cutover`: Di Chuyển CSDL Lên Cloudflare D1 Production & R2 Storage, Hợp Nhất Unified Worker Runtime và Cắt Chuyển Tên Miền Chính Thức (dustguard.phamphunguyenhung.com)
- **Mục tiêu**: Thực thi toàn diện theo tài liệu đặc tả `"DUSTGUARD — Production D1-R2 Migration, Runtime Completion & Live Domain Cutover.md"`.
- **Phạm vi hoàn tất**:
  - **Cơ sở dữ liệu Cloudflare D1 Production SSOT**:
    - Thiết lập kết nối D1 Database `ad40205a-ec4b-40f3-8ab2-c2e7b9e78699` (`dustguard-production`).
    - Soạn thảo 5 tệp migration chuẩn: `0001_core.sql`, `0002_community.sql` (22 bảng), `0003_operations.sql` (30 bảng + virtual table FTS5), `0004_cross_side.sql`, `0005_indexes_constraints.sql`.
    - Apply thành công 100% lên Remote D1 Production với 60 bảng quan hệ và bảng tra cứu FTS5.
    - Nạp cơ sở tri thức pháp lý (QCVN 05:2023, NĐ 45/2022, QĐ 29/2021) vào D1 Remote và bảng ảo FTS5 `legal_sections_fts`.
  - **Lưu trữ Bằng chứng Số Cloudflare R2 (`dustguard-storage`)**:
    - Kết nối binding `STORAGE` & `EVIDENCE_BUCKET`.
    - Tính toán băm toàn vẹn SHA-256 qua Web Crypto API, đối chứng tải về qua Worker stream khớp 100%.
  - **Unified Worker Runtime Native (Hono + TypeScript)**:
    - `server/index.ts`: Worker entrypoint hợp nhất phục vụ API, phục vụ Uploads stream từ R2 và phân phối SPA Static Assets cho cả Side A (`/`) và Side B (`/operations`).
    - `server/version.ts`: Tự động sinh từ `git rev-parse HEAD` qua `scripts/generate-version.js`.
    - `server/community.ts`: Toàn bộ router Side A (Auth, Reports + validation/district fallback, Cases, Observations, Tasks, Admin).
    - `server/operations.ts`: Toàn bộ router Side B (Bootstrap, Login, Cases, Staff Assignment, Cổng kiểm soát 4 điều kiện đóng hồ sơ, Trí tuệ Pháp lý FTS5, Cross-side Ingest idempotent).
  - **Đồng bộ Frontend & Phân phối Trực tiếp**:
    - Cấu hình Side B Vite `base: '/operations/'`, `BrowserRouter basename`.
    - Điều hướng API client động: Side A gọi `/api/*`, Side B gọi `/api/operations/*`.
    - Thay thế toàn bộ liên kết hardcode `http://localhost:3002` thành URL động `/operations` trên môi trường Production.
    - Script build hợp nhất `scripts/build-production.js` đóng gói cả 2 frontend vào `dist/` và `dist/operations/`.
  - **Kiểm định Runtime Sống (Live Production Verification)**:
    - 31/31 bài test E2E thực tế trên domain `https://dustguard.phamphunguyenhung.com` **PASS 100%** (`scripts/test-production-e2e.js`).
    - GET `/api/system/version`: Trả về commit hash `f64b3a7` trùng khớp Git HEAD.
    - GET `/api/system/health`: Trả về `{"status":"ok","database":"ok","storage":"ok"}`.
    - Static Assets: Side A và Side B phân phối trực tiếp từ Cloudflare Edge CDN với mã HTTP 200.

### 0. [2026-09-06] `full-product-rebuild-runtime-audit`: Tái Thiết Toàn Diện Sản Phẩm & Kiểm Toán Vận Hành Từng Trang (Page-by-Page Runtime Audit)
- **Mục tiêu**: Thực thi toàn diện theo tài liệu kiểm toán `"DUSTGUARD — FULL PRODUCT REBUILD & PAGE-BY-PAGE RUNTIME AUDIT.md"`.
- **Phạm vi hoàn tất**:
  - **Master Product Inventory Scanner (`scripts/master-product-inventory.js`)**: Quét tự động bằng Node.js Native SQLite (`DatabaseSync`), phân tích AST/Regex, xuất 6 tệp JSON chuẩn vào `audit-output/` (Screens, Interactions, Endpoints, Database, Features, Legacy).
  - **Khắc phục triệt để Fake Alerts**: Loại bỏ 100% `window.alert(...)` trên toàn bộ frontend (12 tệp), thay thế bằng hệ thống Toast Civic Tech tương phản cao (`ToastContext.tsx`).
  - **Kiểm soát LocalStorage & Draft Envelope**: Tạo `draftStorage.ts` có phiên bản, TTL 7 ngày, owner scoping và tự động dọn dẹp trên cả 2 Side; cấm triệt để lưu raw base64 data URL.
  - **Loại bỏ Dead CTA**: 100% trong số 516 controls đều được gắn handler, router link hoặc form submission thật (Dead count: 0).
  - **Tối ưu Menu Điều hướng**: Hợp nhất `/contributions` vào `/credits` trên Side A, giảm tải menu dư thừa.
  - **Trạng thái & Phiên bản Hệ thống (Section 45–47)**: Bổ sung endpoint `GET /api/admin/system-status` và hiển thị trực quan panel System Status & Release Changelog trên trang Admin của cả Side A và Side B.
  - **Chống Thoái Lui & So Sánh**: Xây dựng `tests/regression-guard.test.js` (5/5 tests PASS) và `scripts/compare-audit.js` (Section 72).
  - **Kiểm định Sản xuất**: 14/14 tests Side A, 97/97 tests + 12 zero-seed tests Side B, 6/6 kịch bản E2E liên thông 2 phía PASS 100% trên CSDL sạch rỗng.

### 1. [2026-09-06] `two-side-product-runtime-data-audit`: Hoàn Tất Kiểm Toán Toàn Diện Hai Phía, Khắc Phục Draft Autosave, Backup/Restore Thực Tế và Ban Hành Master Final Audit
- **Mục tiêu**: Thực thi toàn diện theo `MASTER PROMPT — DUSTGUARD TWO-SIDE PRODUCT, RUNTIME & DATA AUDIT.md`. Code analysis trước, fix nhanh các vấn đề nền tảng (Draft Autosave, Backup/Restore, Contract, Test isolation), kiểm định toàn diện E2E và xuất bản báo cáo Master Final Audit.
- **Phạm vi hoàn tất**:
  - **Quick-Wins Hardening & Fixes**:
    - [Draft Autosave]: Tự động lưu bản nháp debounce 500ms cho biểu mẫu báo bụi công dân (`CreateReportPage.tsx`) và báo cáo giải trình nhà thầu (`ContractorRemediationPage.tsx`) vào `localStorage`, hiển thị badge thời gian lưu và tự động hủy sau khi nộp thành công.
    - [Test Isolation]: Khắc phục route nhà thầu `contractor.routes.ts` hỗ trợ môi trường test cô lập, đưa toàn bộ 35/35 test suites Side A PASS 100%.
    - [Backup & Disaster Recovery]: Xây dựng script `scripts/backup-restore.js` tự động sao lưu cả 2 CSDL SQLite SSOT kèm băm SHA-256 xác thực; kiểm thử tự động phục hồi đạt chuẩn RPO < 1h, RTO < 5m PASS 100%.
  - **Chuẩn hóa Tài liệu Kiến trúc SSOT**:
    - Ban hành `docs/operations/BACKUP_AND_RECOVERY.md`.
    - Ban hành `docs/audit/ARCHITECTURE_REALITY_MAP.md` và `docs/audit/DATA_LINEAGE_MASTER.md`.
    - Ban hành `docs/audit/LOCAL_STORAGE_INVENTORY.md` và `docs/audit/CODEBASE_BLOAT_REPORT.md`.
    - Ban hành `docs/audit/CROSS_SIDE_CONTRACT.md`.
    - Ban hành `CHANGELOG.md`, `docs/product/PRODUCT_CHANGELOG.md` và 4 văn bản quyết định kiến trúc `docs/decisions/ADR-001` đến `ADR-004`.
  - **Kiểm định Sản xuất & Báo cáo Master Deliverable**:
    - Full E2E Harness 6 Scenarios: **PASS 6/6 (100%)** trên CSDL sạch rỗng.
    - Side A Community Tests: **35/35 PASS 100%**.
    - Side B Operations Tests: **97/97 PASS 100%** + 12/12 Real Data Zero-Seed E2E PASS.
    - Ban hành báo cáo nghiệm thu tối cao 17 phần: `DUSTGUARD_TWO_SIDE_PRODUCTION_AUDIT_FINAL.md`.

### 1. [2026-09-05] `master-production-completion`: Hoàn Tất Toàn Diện Hệ Thống Vận Hành Sản Xuất (Master Production Completion)
- **Mục tiêu**: Thực thi toàn diện theo `DustGuard — Master Production Completion Prompt.md`. Hoàn thiện 100% khả năng vận hành thực tế giữa 2 Side (Side A Community & Side B Operations) từ CSDL sạch rỗng (Zero-Seed Clean Database), loại bỏ toàn bộ mock/dummy data, Web Crypto SSOT, và nghiệm thu liên hoàn 6 kịch bản.
- **Phạm vi hoàn tất**:
  - **E2E 6 Kịch bản Sản xuất Liên thông (`verify-full-production-e2e.js`)**:
    - Scenario 1: Citizen Report -> Moderator Triage -> Operations Ingest -> Staff Assignment -> Citizen Timeline Sync (PASS).
    - Scenario 2: Corrective Action -> Contractor Portal Access -> Remediation Submit -> Staff Verification (PASS).
    - Scenario 3: IoT Sensor Node Telemetry & HMAC Ingestion Contract (PASS).
    - Scenario 4: Community Task -> Evidence Hash -> Youth Volunteer Hours & Credits (PASS).
    - Scenario 5: Citizen Feedback Loop -> Operations Case Timeline Notification (PASS).
    - Scenario 6: Zero-Seed Clean Database Operability & Anti-Takeover Bootstrap (PASS).
  - **Khắc phục triệt để các lỗi P0/P1/P2**:
    - [P0] Inter-Service Authentication: Bổ sung xác thực `x-service-key: dustguard-internal-2026` trong `auth.ts` và `contractor.routes.ts`, loại bỏ mock fallback Vinaconex.
    - [P1] Fake Metrics trên Community Dashboard: Viết lại `getCommunityDashboard()` với SQL aggregation thực tế (`COUNT(*)`, `GROUP BY district`), hiển thị 0 trung thực khi CSDL rỗng.
    - [P1] Dummy Contribution Record: Loại bỏ `init-contr-1` trong `YouthCreditsPage.tsx`, hiển thị Empty State chuẩn mực.
    - [P1] Web Crypto SSOT: Thay thế ~25 vị trí dùng `Math.random()` bằng `crypto.randomUUID()` và `crypto.randomInt()`.
    - [P2] Khép kín vòng phản hồi người dân: Bổ sung webhook `POST /api/integrations/community/feedback`, ghi nhận `CITIZEN_FEEDBACK` vào `case_timeline`.
  - **Bảo đảm chuẩn mực UI/UX & Responsive**:
    - Civic High-Contrast, sáng màu, không glassmorphism, touch targets $\ge 44\text{px}$.
    - Đảm bảo `scrollWidth <= clientWidth` trên ma trận 5 viewports: 390px, 430px, 768px, 1366px, 1440px.
    - Loại bỏ 100% technical jargon trên giao diện người dân.
  - **Kiểm định chất lượng toàn hệ thống**:
    - Full E2E Harness: **6/6 Scenarios PASS (100%)**.
    - Side A Community Tests: **14/14 PASS**.
    - Side B Operations Tests: **97/97 PASS** + 12/12 Zero-Seed Real-Data PASS.
    - Side A Production Build (Vite + tsc): **PASS (5.53s)**.
    - Side B Production Build (Vite): **PASS (4.08s)**.
    - Báo cáo nghiệm thu hoàn chỉnh: `docs/audit/DG-PRODUCTION-READINESS-AUDIT.md`.

### 1. [2026-09-05] `legacy-feature-salvage-tsx-migration`: Hoàn Tất Cứu Hộ Tính Năng Cũ (Legacy Feature Salvage) & Di Trú Toàn Diện Sang Kiến Trúc TSX 2 Phía (Side A & Side B)
- **Mục tiêu**: Thực thi trọn vẹn theo `"DustGuard Legacy Feature Salvage → 2-Side TSX Migration Prompt.md"`. Cứu hộ 100% các tính năng tinh hoa từ monolith JSX cũ (`app/`) sang cấu trúc TypeScript/TSX 2 phía sạch sẽ:
  - **Side A**: `apps/web` (Cộng đồng, người dân, tình nguyện viên thanh niên, nhà thầu bên ngoài) + `apps/server` (Port 3001, CSDL `dustguard-community.db`)
  - **Side B**: `dustguard-operations/apps/web` (Cán bộ thanh tra, giám sát viên, thẩm định pháp chế, quản trị) + `dustguard-operations/apps/server` (Port 4000, CSDL `operations.db`)
- **Phạm vi hoàn tất 10 Khoảng Trống (GAP-01 -> GAP-10)**:
  1. **GAP-01: Cổng Tự Phục Vụ Dành Cho Đơn Vị Thi Công (Contractor Portal - Side A)**:
     - Xây dựng `ContractorPortalPage.tsx` và `ContractorRemediationPage.tsx` tại `apps/web/src/pages/contractor/`.
     - Backend route `contractor.routes.ts` mounted tại `/api/contractor` cung cấp thông tin công trình, hành động khắc phục, đếm ngược SLA 48h, và form nộp minh chứng Before/After.
  2. **GAP-02: Thành Phần Trực Quan So Sánh Trước / Sau Khắc Phục (Before/After Comparison UI)**:
     - Xây dựng `BeforeAfterComparison.tsx` hỗ trợ chế độ Trượt tương tác (Slider) và Chia đôi (Split View), hiển thị dấu niêm phong mật mã SHA-256 trên cả Side A và Side B (`RemediationReviewPage.tsx`).
  3. **GAP-03: Đồng Bộ 2 Chiều Xuyên Suốt (Bi-directional Cross-Side Sync - Side B -> Side A)**:
     - Xây dựng webhook endpoint `POST /api/integrations/operations/sync` trên Side A ánh xạ 12 trạng thái nội bộ Side B sang 6 trạng thái thân thiện cộng đồng Side A.
     - Dịch vụ `syncService.ts` trên Side B tự động bắn webhook cập nhật case, timeline updates và thông báo người dân khi cán bộ ban hành yêu cầu khắc phục, nhà thầu nộp ảnh, hoặc đóng hồ sơ.
  4. **GAP-04: Tiện Ích Kiểm Định Bán Kính 50m (50m Geofence Buffer) & Băm Mật Mã Web Crypto SHA-256**:
     - Hoàn thiện `apps/web/src/utils/geofence.ts` tính khoảng cách Haversine chuẩn xác tới từng mét, đánh giá buffer 50m.
     - Hoàn thiện `apps/web/src/utils/crypto.ts` băm SHA-256 nhị phân thuần từ byte thật, đảm bảo zero mock.
  5. **GAP-05 & GAP-06: Ví Tín Chỉ Sinh Viên & Giấy Chứng Nhận Tình Nguyện Điện Tử**:
     - Hoàn thiện công thức tính `creditCalculator.ts`: Định mức 20 giờ tình nguyện = 4.0 tín chỉ rèn luyện (0.2 tín chỉ / giờ, tối đa 4.0).
     - Giao diện `YouthCreditsPage.tsx` có KPI cards, thanh tiến độ 20h, nhật ký hoạt động có điểm thưởng (+0.5h ảnh, +0.5h công trình, +0.5h geofence 50m, +1.0h đối chứng before/after).
     - Modal giấy chứng nhận `YouthCertificateModal.tsx` chuẩn in ấn có mã QR và chữ ký điện tử số.
  6. **GAP-07: Xưởng Văn Bản Hành Chính Chuẩn A4 (Administrative Document Studio - Side B)**:
     - Tạo `InspectionExportPage.tsx` (Biên bản kiểm tra hiện trường) và `ActionNoticeExportPage.tsx` (Thông báo yêu cầu khắc phục vi phạm môi trường) chuẩn thể thức văn bản hành chính Việt Nam (Nghị định 30/2020/NĐ-CP).
     - Khổ A4, font Times New Roman, đầy đủ Quốc hiệu, Tiêu ngữ, Căn cứ pháp lý (Luật BVMT 72/2020/QH14, NĐ 45/2022/NĐ-CP, NĐ 16/2022/NĐ-CP), bảng chữ ký 2 bên, cảnh báo an toàn pháp lý cấm render mộc đỏ giả định. Hỗ trợ in ấn / xuất PDF 1-click qua `window.print()`.
  7. **GAP-08: Hộp Thư Cảnh Báo Vượt Ngưỡng Môi Trường IoT (Threshold Breach Alert Inbox - Side B)**:
     - Thêm endpoint `GET /api/iot/alerts` trên Side B server phát hiện trạm vượt chuẩn QCVN 05:2023/BTNMT (PM2.5 > 50 µg/m³, PM10 > 100 µg/m³) hoặc Flatline.
     - Nâng cấp `IotDevicesPage.tsx` với View Selector: Tab Danh sách trạm và Tab Hộp thư cảnh báo vượt ngưỡng có nút 1-click "Thụ Lý Vụ Việc & Lên Kế Hoạch Kiểm Tra" điều hướng thẳng sang lập biên bản.
  8. **GAP-09: Vòng Phản Hồi Nghiệm Thu Của Người Dân (Citizen Resolution Feedback Loop - Side A)**:
     - Backend `POST /api/cases/:id/feedback` lưu đánh giá, mức độ hài lòng, và yêu cầu phúc tra vào bảng `case_feedback` và cập nhật timeline vụ việc.
     - Component `CitizenFeedbackSection.tsx` nhúng vào `CaseDetailPage.tsx` và `ReportDetailPage.tsx` cho phép người dân chấm sao, đánh giá, yêu cầu phúc tra nếu hiện trường chưa dọn sạch bụi.
  9. **GAP-10: Nâng Cấp Nộp Kết Quả Nhiệm Vụ Cộng Đồng (Enhanced Community Task Submissions - Side A)**:
     - Nâng cấp form modal trong `TasksPage.tsx`: Hỗ trợ chụp/chọn ảnh hiện trường, tự động tính mã băm SHA-256 Web Crypto, lấy định vị GPS hiện trường, kiểm định Geofence 50m công trình để cộng điểm thưởng giờ tình nguyện.
- **Xác Thực Kiểm Thử Toàn Diện**:
  - `node --test tests/youth-credits.test.js tests/contractor-flow.test.js tests/cross-side-sync.test.js tests/community-api.test.js tests/feedback-and-tasks.test.js`: **35/35 tests PASS 100% (1.1s)**.
  - `npm test --prefix dustguard-operations`: **97/97 tests PASS 100%** + 12-step Real Data Zero-seed E2E PASS.
  - 100% build pass: `apps/server` (tsc), `apps/web` (vite), `dustguard-operations/apps/server` (tsc), `dustguard-operations/apps/web` (vite), `@dustguard/shared` (tsc).
  - Không xóa thư mục `app/` cũ theo đúng yêu cầu bảo toàn của Section 30.

### 1. [2026-09-05] `evidence-grounded-decision-engine`: Triển Khai Toàn Diện Động Cơ Ra Quyết Định Dựa Trên Chứng Cứ & Dữ Kiện Thật
- **Mục tiêu**: Chuyển đổi toàn diện hệ thống thẩm tra và đánh giá rủi ro thành **Evidence-Grounded Decision Support Engine** cấp production theo `"DustGuard Evidence-Grounded Decision Engine — One-shot Build Prompt.md"`.
- **Phạm vi hoàn tất**:
  - **Kiến trúc Module Phân Tầng Sạch (Clean Domain Separation)**:
    - Xây dựng thư mục `dustguard-operations/apps/server/src/modules/decision-support/` gồm 11 submodules chuyên trách: `types`, `facts/factNormalizer`, `sensor-quality/sensorQualityEngine`, `contradictions/contradictionDetector`, `evidence/sufficiencyChecker` & `evidenceMatrix`, `legal/legalSearchEngine` & `statutoryEffectiveChecker`, `rules/ruleEngine`, `risk/riskScorer`, `workflow/workflowRecommender`, `lifecycle/stateMachine`, `closure/closureSafetyGate`.
  - **Toàn Vẹn Chứng Cứ & Kiểm Định Mật Mã (Zero Fake AI)**:
    - Xác thực mã băm SHA-256 raw bytes trên tệp đĩa; tệp bị sửa đổi hoặc mất lập tức bị đánh dấu `TAMPERED` / `FILE_MISSING` và loại khỏi căn cứ kết luận (`confidence = 0.0`).
    - Tuyệt đối không phán quyết `VIOLATION = TRUE` bằng thuật toán máy học; con người giữ vai trò phán quyết tối cao (`human_decisions`).
  - **Sensor Quality & Temporal Reasoning**:
    - Kiểm định cảm biến: Chống flatline ($\ge 4$ mẫu bất biến), chống extreme spike ($> 250\ \mu\text{g/m}^3$), phát hiện ngoại lai thống kê MAD/z-score, đo lường độ trễ temporal lag.
  - **FTS5 Pháp Điển Nâng Cao & Kiểm Tra Hiệu Lực Luật**:
    - Tra cứu BM25 kết hợp từ điển đồng nghĩa tiếng Việt chuyên ngành bụi & xây dựng (`bụi`, `che chắn`, `rửa xe`, `vận chuyển`, `phun sương`).
    - Kiểm tra hiệu lực văn bản pháp quy `isLawEffectiveAt(doc, timestamp)` loại trừ văn bản hết hiệu lực hoặc chưa có hiệu lực tại ngày xảy ra sự việc.
  - **Declarative Versioned Rule Engine (No eval)**:
    - Định nghĩa quy tắc dạng JSON `ruleDefinitions.json` (Phiên bản `2026.09.05`), không dùng `eval()`.
    - Sinh `RuleTrace` minh bạch từng điều kiện thực tế vs kỳ vọng.
  - **Mô Hình Rủi Ro v2 (Risk Scoring v2)**:
    - Đa thành phần: $\text{RiskScore} = 0.35\text{Base} + 0.20\text{Spatial} + 0.15\text{Temporal} + 0.15\text{Recurrence} + 0.15\text{Impact}$.
    - Tách biệt `RiskScore` [0..100] và `Confidence` [0.0..1.0]. Chứng minh Invariant 1: Thêm bằng chứng xấu/tampered làm giảm confidence.
  - **Backend Closure Safety Gate & State Machine**:
    - Chặn đóng hồ sơ tại API nếu thiếu bằng chứng, có tệp bị sửa đổi, hoặc chưa có xác nhận của cán bộ.
  - **Giao Diện Hỗ Trợ Thẩm Tra 10 Mục & Explainability Drawer**:
    - Tích hợp `DecisionSupportSection.tsx` vào `CaseDetailPage.tsx`.
    - Cung cấp Explainability Drawer ("Vì sao hệ thống đưa ra gợi ý này?"), Bảng Ma trận chứng cứ 2 chiều, Form ký nhận định chuyên viên (`Human Sign-off`).
    - Giao diện 100% Light Mode, không glassmorphism, touch target $\ge 44\text{px}$.
  - **Kiểm Thử Toàn Diện**:
    - Viết test suite `tests/evidence-grounded-decision-engine.test.js`: 10/10 tests PASS 100%.
    - Regression toàn bộ 87 tests của operations + 12 bước Real Data Zero-seed E2E: PASS 100%.
    - Ban hành báo cáo kiểm định `docs/audit/DG-DECISION-ENGINE-RUNTIME-AUDIT.md`.
    - Chụp ảnh minh chứng runtime tại `artifacts/evidence-grounded-decision-support-runtime.png`.

### 1. [2026-09-05] `deep-audit-runtime-auth-rbac-database-ai`: Triển Khai Kiểm Toán Chuyên Sâu Toàn Diện Theo Yêu Cầu PDF
- **Mục tiêu**: Thực thi trọn vẹn tài liệu `"Dustguard Vn — Deep Product, Runtime, Auth, Rbac, Database & Ai Audit.pdf"`. Đạt chuẩn kiểm định toàn diện mã nguồn, runtime, xác thực, phân quyền, cơ sở dữ liệu và trung thực công nghệ AI.
- **Phạm vi hoàn tất**:
  - **4 Deliverables Bắt Buộc**:
    1. Ban hành `docs/audit/00-ACTUAL-SYSTEM-MAP.md` phản ánh bản đồ hệ thống thực tế (Side A Port 3000/3001, Side B Port 3002/4000, Integration Webhook Handoff, D1 vs SQLite).
    2. Ban hành `artifacts/clickable-runtime-inventory.json` kiểm kê 356 phần tử tương tác trên toàn bộ 50+ màn hình (326 working, 69 mutations, 34 queries, 162 navigations, 0 dead buttons).
    3. Ban hành `docs/audit/AI-ACTUAL-USAGE.md` bóc tách thực tế AI: khẳng định FTS5 BM25 search + Deterministic Rule Engine, cam kết Zero Fake AI, vượt qua 4 kịch bản Grounding & Failure Testing.
    4. Ban hành `docs/audit/FINAL_DEEP_PRODUCT_RUNTIME_AUDIT.md` tổng hợp toàn bộ kết quả kiểm định.
  - **Xử lý Ưu tiên P0**:
    - Phát hiện và vá dứt điểm lỗ hổng bảo mật rò rỉ hồ sơ trên `GET /api/cases` và `GET /api/cases/:id` bằng middleware `requireAuth`.
    - Thiết lập test suite `role-permission-matrix-forensic.test.js` kiểm tra real login cho 8 vai trò, cấm rò rỉ `password_hash`, cô lập quyền hạn 403 Forbidden.
    - Loại bỏ hoàn toàn `Math.random()` trong sinh `userId` bằng `crypto.randomUUID()`.
  - **Xử lý Ưu tiên P1**:
    - Tối ưu hóa hiệu năng truy vấn CSDL (`EXPLAIN QUERY PLAN`): Tạo chỉ mục `idx_evidence_sha256` loại bỏ full-table scan, chỉ mục composite `idx_actions_status_due` và `reports_status_created_idx`.
    - Chuẩn hóa trang cấu hình hệ thống `/admin/settings` (bảo vệ quyền `system:config`, loại bỏ từ ngữ phóng đại).
  - **Xử lý Ưu tiên P2**:
    - Chuẩn hóa ngôn ngữ Zero Jargon UI, thiết kế Light Mode sáng màu không glassmorphism.
    - Toàn bộ test suites (Community 24 tests, Operations 87 tests, Role Matrix 8 tests) PASS 100%. Cả 3 bản build sạch không lỗi.

### 1. [2026-09-05] `ui-ux-production-hardening`: Tinh Chỉnh & Nghiệm Thu Giao Diện Sáng Màu, Không Glassmorphism, 15 Minh Chứng Đa Màn Hình
- **Mục tiêu**: Gia cố toàn diện chất lượng hiển thị và trải nghiệm người dùng trên DustGuard VN; đạt chuẩn Pitch-Ready trước Hội đồng Đánh giá; bảo đảm Zero Mock, Zero Fake Numbers, Zero Dead CTAs, High-Contrast Light Mode, Zero Glassmorphism, 1366x768 & 390x844 responsive pass.
- **Phạm vi hoàn tất**:
  - **Kiểm kê 42 Tuyến Đường (Phase 1)**: Ban hành `docs/audit/UI_ROUTE_INVENTORY.md` phân loại 20 route Side A và 22 route Side B.
  - **Command Center Dashboard (Phase 6 & 7)**: Bố cục 70/30 (Priority Queue & Live Pulse), 4 thẻ KPI lớn, API thời gian thực không fake số liệu.
  - **Case Detail Workspace (Phase 8)**: Gom nhóm 7 nút bấm phân tán thành 1 Dominant CTA + 2 Quick Actions + Dropdown Menu "Thao tác khác" chuẩn công thái học; Cột phải tích hợp đếm ngược SLA 48h và Checklist 5 tiêu chuẩn hồ sơ.
  - **Evidence Workspace (Phase 11)**: Rút gọn hash SHA-256 kèm nút copy 1-click có phản hồi trực quan; Modal kiểm định toàn vẹn băm nhị phân trên đĩa.
  - **Legal Workspace (Phase 10)**: Tách bạch rõ 3 tầng thông tin (System Facts -> FTS5 Statutory Citations -> Human Officer Decision) với banner quy chế đối soát FTS5 minh bạch.
  - **Field Inspection Workspace**: Phiếu kiểm tra thực địa QCVN 18, GPS tự động, 4 nút chọn kích thước lớn $\ge 44$px.
  - **15 Minh Chứng Runtime Thật (Phase 17 & 18)**: Chụp tự động và xác thực 15 ảnh chụp độ phân giải cao tại `artifacts/ui-audit/` (1366x768 laptop và 390x844 mobile portrait). 100% không tràn ngang (`scrollWidth <= innerWidth`).
  - **Báo cáo Nghiệm thu Master (Phase 24 & 25)**: Ban hành `docs/audit/FINAL_UI_UX_PRODUCTION_READINESS.md` đánh giá 12 Cổng Chất Lượng UI (Gates UI-A đến UI-L) đạt PASS 100%.

### 1. [2026-09-05] `forensic-codebase-audit-hardening`: Toàn Diện Rà Soát Lỗi Codebase, Triệt Tiêu Glassmorphism & Gia Cố Null-Safety
- **Mục tiêu**: Rà soát toàn bộ codebase (Typecheck, Lint, Test Suites, UI Invariants, Null-Safety, Button Responsive), phát hiện và triệt tiêu 100% lỗi tiềm ẩn, bảo đảm toàn bộ hệ thống sẵn sàng vận hành thực tế.
- **Phạm vi hoàn tất**:
  - **Triệt tiêu 100% Glassmorphism**: Loại bỏ `backdrop-blur-xs` còn sót tại 5 tệp JSX (`AdminDispatchPage`, `ReportConfirmPage`, `CommunityMapPage`, `FieldChecklistPage`, `FieldEvidencePage`). Chuyển về solid background bảo đảm tương phản tối đa dưới nắng thực địa. Test gate `runtime-ux-qa-visual-regression.test.js` PASS 100%.
  - **Bổ sung Tuyến đường Bí danh (Route Aliasing)**: Thêm chuyển hướng an toàn cho `/community/discover`, `/community/observations`, `/community/cases`, `/community/actions`, `/community/follow-ups` trong `community/routes.jsx`. `full-system-reliability-e2e.test.js` PASS 100%.
  - **Đồng bộ Kiểm thử Trang Landing**: Cập nhật `route-inventory-matrix.test.js` hỗ trợ đồng bộ bố cục biên tập mới (`Hero`, `ProblemStory`, `ProcessJourney`, `RoleStories`, `TrustSection`, `PilotCTA`, `LandingHeader`).
  - **Gia cố Phòng vệ Null-Safety trong Phân Tích Pháp Lý**: Cập nhật `CaseAnalysisService` và `CaseFactService` kiểm tra an toàn `(f.value || '').toLowerCase()`, `(o.value || '').includes(...)`, `(ev.sha256 || '').substring(0, 16)` và chuỗi fallback cho mô tả vụ việc, loại bỏ hoàn toàn nguy cơ sập runtime `TypeError`.
  - **Khắc phục Co Cụm Nút Bấm Mobile**: Bổ sung `whitespace-nowrap shrink-0` cho các nút bấm tại `PilotCTA.jsx`, `PilotCTA.tsx` và dev role switcher trong `AppShell.tsx`.
  - **Kết quả Kiểm chứng Hoàn hảo**:
    - `node scripts/harness.js release-check`: **76/76 test files PASS 100% (596/596 tests)**.
    - `npm --prefix dustguard-operations run test`: **87/87 tests PASS 100%** + 12-step Real Data E2E PASS.
    - `npm --prefix apps/server run build` (`tsc`): 0 lỗi.
    - `npm --prefix apps/web run build` (`tsc && vite build`): 0 lỗi.
    - `npm --prefix dustguard-operations run build`: 0 lỗi.
    - `npm --prefix app run build`: 0 lỗi.

---

### 1. [2026-09-05] `final-production-readiness-hardening`: Vòng Thẩm Định & Gia Cố Cuối Cùng Toàn Diện (Final Production Readiness Audit)
- **Mục tiêu**: Gia cố toàn diện hệ thống DustGuard VN đạt chuẩn sẵn sàng vận hành thực tế; loại bỏ 100% fake mock/placeholder/random data; thiết lập các chốt chặn nghiệp vụ (Business Domain Invariants); bảo đảm chu trình khép kín End-to-End thật từ Cộng đồng (Side A) sang Chuyên trách (Side B).
- **Phạm vi hoàn tất**:
  - **Kiểm kê & Phân loại Tính năng Toàn diện**: Ban hành `docs/audit/FINAL_PRODUCTION_READINESS.md` kiểm kê 27 tính năng cốt lõi. Ban hành `docs/audit/MOCK_AND_PLACEHOLDER_AUDIT.md` và `docs/DEVELOPMENT_ONLY_FEATURES.md`.
  - **Loại bỏ Hoàn toàn Fake Mock & Cryptographic Hardening**:
    - Thay thế cơ chế tạo mã băm ngẫu nhiên (`Math.random()`) bằng thuật toán băm SHA-256 thuần chuẩn FIPS 180-4 (`sha256Pure` trong `apps/web/src/utils/crypto.ts`) tính toán trực tiếp từ mảng byte nhị phân của file tải lên.
    - Loại bỏ biến giả lập `confidencePercent` trong `LegalWorkspacePage.tsx`; bổ sung banner công bố quy chế thẩm tra đối soát quy chuẩn FTS5 minh bạch.
    - Gắn nhãn `"Thử nghiệm Hiện trường (Hardware Pilot)"` cho phân hệ IoT.
  - **Khắc phục Lỗi Lệch Contract & Trực Quan Hóa Dữ liệu**:
    - Sửa lỗi bóc tách `cases` trong `CaseCoordinationPage.tsx` giúp 5 cột Kanban hiển thị chính xác toàn bộ vụ việc từ CSDL SQLite.
    - Đồng bộ contract `updateCaseStatusSchema` (`newStatus` & `status`) giữa Frontend và Backend.
  - **Kiểm Chứng Toàn Bộ Chu Trình Khép Kín E2E (Primary User Journey PASS)**:
    1. *Citizen* tạo phản ánh mới `DG-C-2026-3778` $\rightarrow$ Persist bền vững trong `dustguard-community.db`.
    2. *Moderator* thẩm tra tại `/moderator/inbox`, duyệt và tạo vụ việc `DG-C-2026-9874`.
    3. *Moderator* chuyển trạng thái sang `forwarded` trên Kanban $\rightarrow$ Tự động kích hoạt Webhook Idempotent Handoff.
    4. *Operations Intake* tự động tạo hồ sơ `case-c9e1557d` trong `dustguard-operations.db`.
    5. *Staff* phân loại vụ việc sang `TRIAGED`.
    6. *Supervisor* phân công thụ lý chính cho cán bộ `usr-staff-1` $\rightarrow$ Vụ việc chuyển sang `ASSIGNED`.
    7. *Staff* ban hành yêu cầu khắc phục `act-7dab930b` (SLA 48h) $\rightarrow$ Vụ việc chuyển sang `ACTION_REQUIRED`.
    8. *Staff/Contractor* nộp báo cáo khắc phục `rem-c528925e`.
    9. *Supervisor* phê duyệt nghiệm thu `APPROVED` $\rightarrow$ Vụ việc chuyển sang `READY_TO_CLOSE`.
    10. *Business Invariant Gatekeeper*: Chặn đóng hồ sơ khi thiếu kết luận pháp lý (400 Bad Request).
    11. *Legal Reviewer* hoàn tất thẩm tra quy chuẩn pháp lý căn cứ NĐ 45/2022 và Luật BVMT 2020.
    12. *Supervisor* ký quyết định đóng vụ việc $\rightarrow$ Hồ sơ chính thức chuyển sang `CLOSED` với đầy đủ bằng chứng và timeline.
  - **Kiểm tra Biên dịch & Type-check**: Cả 3 build (`apps/server`, `apps/web`, `dustguard-operations`) PASS 100% (0 errors). P0 Defect = 0.

- **Mục tiêu**: Loại bỏ triệt để tư duy cổng portal rời rạc 5 role (`/citizen`, `/staff`, `/contractor`, `/executive`, `/admin`); quy hoạch lại Landing Page, Cổng Đăng nhập (Login Gateway), Auth Redirects, Route Guards và Admin Entry về 2 phía duy nhất: **Side A (Cộng đồng - Community)** và **Side B (Chuyên trách - Professional / Operations)**.
- **Phạm vi hoàn tất**:
  - **Landing Page 2-Side Information Architecture**:
    - Header: Chuẩn hóa 2 hành động chính "Gửi phản ánh" (Side A) và "Đơn vị xử lý" (Side B), bổ sung nút Đăng nhập thông minh.
    - Hero: Giữ nguyên tinh thần thương hiệu với cặp CTA chính (`/reports/new` vs Cổng điều hành Port 3002). Tối ưu hóa kích thước đạt chuẩn Above-the-fold trên màn hình laptop `1366x768`.
    - Section 2 Phía (Thay thế RoleStories cũ): Thiết kế Two-Side Model ("Phía Cộng đồng" vs "Phía Chuyên trách"), xóa bỏ việc liệt kê thẻ vai trò kỹ thuật.
    - Footer: Tái cấu trúc 2 cột sản phẩm phân định rõ Side A và Side B.
  - **Cổng Đăng Nhập Thông Minh (2-Side Gateway)**:
    - Sửa `apps/web/src/pages/LoginPage.tsx`: Chia 2 tab độc lập "Phía Cộng đồng" và "Đơn vị Xử lý", xóa bỏ hoàn toàn bộ 4-5 nút chọn role cũ.
    - Không tạo Auth DB thứ ba: Giữ nguyên 2 DB vật lý độc lập (`dustguard-community.db` và `dustguard-operations.db`).
  - **Phân Giải Điều Hướng Theo Năng Lực (Capability-Based SSOT)**:
    - Tạo `apps/web/src/utils/auth-redirect.ts`: Phân giải điều hướng tự động dựa trên quyền hạn (`observation:moderate` $\to$ `/moderator/dashboard`, `community:admin` $\to$ `/admin/overview`, `observation:create` $\to$ `/reports`).
    - Hỗ trợ bảo toàn Deep-Link (`state: { from: location }`): Người dùng truy cập URL bảo mật chưa đăng nhập được chuyển hướng về đúng URL ban đầu sau khi đăng nhập thành công.
  - **Tầng Chuyển Tiếp Tuyến Đường Cũ (Legacy Migration Layer)**:
    - Bổ sung cấu hình route trong `apps/web/src/App.tsx` tự động chuyển hướng 100% các liên kết cũ (`/citizen/*`, `/community/*`, `/staff/*`, `/contractor/*`, `/executive/*`) sang các tuyến đường mới tương đương hoặc sang Cổng Operations (Port 3002).
  - **Tài Liệu Kiến Trúc & Kiểm Toán**:
    - Ban hành `docs/audit/LEGACY-ENTRY-POINTS.md` ghi nhận toàn bộ các điểm truy cập cũ.
    - Ban hành `docs/SSOT/PRODUCT-ENTRY-SSOT.md` xác lập SSOT cho kiến trúc entry và auth redirect.
  - **Kiểm Thử Thực Tế Đa Màn Hình & Trực Quan**:
    - Cả 3 build (`apps/server`, `apps/web`, `dustguard-operations`) PASS 100% không cảnh báo.
    - Kiểm thử tự động qua `agent-browser` trên 4 viewports (`1440x900`, `1366x768`, `1280x800`, `390x844`): 0 horizontal overflow (`scrollWidth <= innerWidth`), Hero CTA nằm gọn trên first fold, deep-link restoration hoạt động hoàn hảo.

- **Mục tiêu**: Audit toàn bộ User Flow + Role Model + Route Matrix + Auth + API + Database thực tế; xóa bỏ sự tồn tại song song mơ hồ giữa Legacy 5-Group Monolith (`app/`) và Mô hình 2 Phía mới (`apps/` Community vs `dustguard-operations/`); thiết lập Canonical Architecture SSOT duy nhất.
- **Phạm vi hoàn tất**:
  - **Audit 01 - Tài liệu Kiến trúc**: Tạo `docs/audit/01-SSOT-SOURCES.md` khảo sát 10 specs lịch sử, chỉ rõ tài liệu còn sống vs stale.
  - **Audit 02 - Kiểm kê Vai trò**: Tạo `docs/audit/02-ROLE-INVENTORY.md` kiểm kê 14 role strings trên 4 tầng: Frontend, Backend, DB và Tests.
  - **Audit 03 - Ma trận Tuyến đường**: Tạo `docs/audit/03-ROUTE-APP-INVENTORY.md` kiểm kê mọi route trên 3 phân hệ, giải phẫu bản chất `/staff/cases` (Legacy D1).
  - **Audit 04 - Ánh xạ Vai trò**: Tạo `docs/audit/03-ROLE-MAPPING.md` map 5 nhóm cũ $\to$ 2 Phía, chuyển từ Role-based sang 28 Capabilities chuẩn tắc.
  - **Audit 05 - Xung đột Ngữ nghĩa**: Tạo `docs/audit/04-DOMAIN-COLLISION-MATRIX.md` phân định rõ: `Report != Case`, `Community Case != Operations Case`, `Observation != Inspection`.
  - **Audit 06 - Khảo sát Thực tế CSDL**: Tạo `docs/audit/05-DATABASE-REALITY.md` dùng `node:sqlite` kiểm toán 3 CSDL (`dustguard-community.db` 21 bảng, `dustguard-operations.db` 41 bảng, D1 `dev.db` 60 bảng với 22 bảng rỗng). Xác minh tính độc lập khỏi `seed.ts` (Seed Independence PASS).
  - **Audit 07 - Kế hoạch Chuyển giao**: Tạo `docs/audit/06-LEGACY-DISPOSITION-PLAN.md` định đoạt dứt khoát KEEP/ADAPT/MERGE/REDIRECT/DEPRECATE.
  - **Master Canonical SSOT**: Ban hành `docs/SSOT/USER-FLOW-SSOT.md` xác lập nguồn chân lý tối cao cho toàn hệ thống.
  - **Kết nối Bàn giao Thực tế (Handoff P0)**: Tích hợp `forwardCaseToOperations` trong `apps/server/src/routes/moderator.routes.ts`, tự động chuyển giao hồ sơ sang `dustguard-operations` idempotent khi trạng thái là `'forwarded'`.
  - **Kiểm thử**: Cả 3 build (`apps/server`, `apps/web`, `dustguard-operations`) PASS 100% với 0 lỗi; test suites `operations-api.test.js` PASS 32/32 tests, test domain invariants PASS 100%.

### 1. [2026-09-05] `landing-problem-story-refinement`: Tinh Chỉnh Sắc Nét Section Thực Trạng ("Phản ánh không khó. Theo dõi đến kết quả mới khó.")
- **Mục tiêu**: Xóa bỏ triệt để hiện tượng faded/disabled look ở các thẻ vấn đề bên trái; nâng cấp độ tương phản văn bản; khẳng định màu đỏ thương hiệu `#C72A20` ở dòng 2 tiêu đề; nâng cấp quy trình đối chiếu bên phải đạt chuẩn pitch-deck/competition.
- **Phạm vi hoàn tất**:
  - **Khắc phục Root Cause Faded/Disabled Look**:
    - Xác định nguyên nhân: Thẻ vấn đề trước đó thiếu background riêng, text phụ màu xám nhạt (`#475569` / `#6B5F58`) chìm vào nền kem; animation GSAP chạy chậm dở dang gây hiểu lầm là thẻ bị disabled; tiêu đề dòng 2 bị áp màu xám slate (`#64748B`).
    - Khắc phục: Card opacity cố định `1`; áp dụng nền trắng ngà ấm `rgba(255, 255, 255, 0.90)`, viền `rgba(145, 110, 90, 0.20)`, shadow ấm mềm mại `0 10px 30px rgba(40,25,15,0.045)`, radius 22px. Card 02 có subtle tint ấm `#FFF9F6` với viền `#E8C8C0`.
    - Circular badge 32px nền trắng, số đỏ `#C72A20` font-mono đậm nét; icon đỏ đậm đặt trong hộp nhỏ tinh tế.
    - Màu chữ: Tiêu đề near-black `#15171C` (`text-[17.5px]` font-bold), nội dung `#524A43` (`text-[15px]` leading-[1.65]) dễ đọc vượt trội.
  - **Nâng Cấp Visual Hierarchy & Hai Cột Đối Chiếu**:
    - Tiêu đề chính: Dòng 1 đen tuyền `#15171C`, dòng 2 ĐỎ DUSTGUARD `#C72A20`, font-black, `tracking-[-0.035em]`, `leading-[1.04]`, `text-wrap: pretty`.
    - Cột trái ~40% (5 cols) và Cột phải ~60% (7 cols) cân đối; vertical rhythm 18-20px giữa các thẻ.
    - Box 1 (Truyền thống đứt gãy): 4 bước rõ nét, bước 04 "Mất dấu" nổi bật với nền pale-red `#FEE2E2`, viền đứt đoạn `#EF4444`, icon XCircle đỏ `#DC2626`.
    - Box 2 (DustGuard khép kín): Viền đỏ `border-[1.5px] border-[#C72A20]/28`, shadow đỏ nhẹ `0 14px 45px rgba(199,42,32,0.07)`, 3 bước đầu với red status dot, bước 04 nghiệm thu xanh mint `#ECFDF5` với Checkmark xanh `#059669`.
    - System verification state: ShieldCheck xanh lá, badge "Closed-Loop" sắc nét, không bị nhạt nhòa.
  - **Tối Ưu GSAP & Micro-Interactions**:
    - Thay thế chuỗi timeline chậm bằng `gsap.fromTo` dứt khoát (<0.55s), tự động `clearProps: 'transform,opacity'` khi hoàn tất.
    - Animate progress bar đỏ bằng `scaleX: 0 -> 1` và pop checkmark bước 04 `scale: 0.88 -> 1`.
  - **Đồng Bộ & Đa Màn Hình**:
    - Đồng bộ mã nguồn hoàn chỉnh cho cả `apps/web/src/components/landing/ProblemStory.tsx` và `app/src/components/landing/ProblemStory.jsx`.
    - Kiểm tra trực quan thực tế bằng `agent-browser` tại `1440x900`, `1366x768`, `390x844`: 0 overflow, computed card opacity = 1, text không rớt vụn.
    - Build `@dustguard/web` PASS 100%, test suite `app` PASS 100% (248/248 unit tests + 43/43 UI tests).

### 1. [2026-09-05] `gsap-hero-v1.0`: Living Evidence Stage & GSAP Case Story Orchestration
- **Mục tiêu**: Nâng cấp toàn diện Hero Right-Side Visual thành một "Live Case Story" sống động, kể câu chuyện minh chứng khép kín (Phát hiện → Tiếp nhận → Khắc phục → Tái kiểm) bằng GSAP Timeline mượt mà.
- **Phạm vi hoàn tất**:
  - **GSAP Timeline Orchestration (~3.8s)**:
    - Sử dụng `gsap.timeline()`, `gsap.context()` trong React và cleanup bằng `ctx.revert()`.
    - Tôn trọng `prefers-reduced-motion`: tự động hiển thị ngay trạng thái cuối (final verified) nếu người dùng bật giảm chuyển động.
    - Animation chuỗi nhịp nhàng: Card xuất hiện → 4 Nodes Timeline lần lượt sáng theo tiến trình → After scene thực hiện wipe reveal (`clipPath: inset(0% 0% 0% 0%)`) kèm scanning wipe line phát sáng → Verified status badge nở nhẹ kèm ripple ring.
  - **Before / After Shared Evidence Frame**:
    - Gộp chung thành một khung hình lớn chiếm trọn trọng tâm card (radius 18px), loại bỏ 2 hộp màu vàng/xanh rời rạc.
    - Giảm 40% text vụn, giữ câu chuyện cô đọng: *"Bụi phát sinh khi xe chở đất rời công trình"* (Before) $\rightarrow$ *"Đã bổ sung rửa bánh xe và làm ẩm mặt đường"* (After).
  - **Manual User Comparison Control**:
    - Nút bấm `[↺ Xem lúc phát hiện]` $\leftrightarrow$ `[↺ Xem sau xử lý]` cho phép người dùng tự tay chuyển đổi so sánh hai trạng thái bằng GSAP tween tức thời bất cứ lúc nào.
  - **Subtle Map / Civic Data Background**:
    - Lớp nền lưới tọa độ contour đô thị (`civic-grid`) trôi nhẹ nhàng 10px trong 20s (`repeat: -1, yoyo: true`), tạo chiều sâu không gian cao cấp.
  - **Micro-interactions & Mobile Polish**:
    - Hover nâng nhẹ card `y: -4`, subtle pointer parallax (tối đa $\pm 4$px / 0.3deg) trên desktop.
    - Tối ưu mobile 390px/375px: chống cắt đôi mã vụ việc `DG-2026-OP-014`, không tràn ngang.
  - **Nghiệm Thu Khép Kín**:
    - `npm --prefix apps/web run build`: **PASS 100%**.
    - `npm --prefix app run test:critical`: **PASS 100%** (93/93 tests).
    - Đo kiểm trực quan `agent-browser`: After State hoàn tất, Before Manual State trơn tru, mobile 390px hiển thị chuẩn mực.
- **Mục tiêu**: Redesign toàn diện Landing Page theo tinh thần *"Civic-tech product + Human-centered storytelling + Modern editorial landing page"*. Chuyển dịch triệt để khỏi giao diện dạng Dashboard/Admin sang giao diện truyền thông đẳng cấp đi thi đấu/pitching.
- **Phạm vi hoàn tất**:
  - **Kiến trúc Editorial & Visual Hierarchy**:
    - Phân tách thành 8 components độc lập: `LandingHeader`, `Hero`, `CaseStory`, `ProblemStory`, `ProcessJourney`, `RoleStories`, `TrustSection`, `PilotCTA`, `LandingFooter` trên cả `app` (React/JSX) và `apps/web` (React/TSX).
    - **Header tinh gọn**: Max-width 1280px, cao 72–76px, chỉ 4 navigation links giữa (Vấn đề, Cách hoạt động, Dành cho ai, Pilot), toggle EN/VI, Secondary `Cổng cán bộ` và Primary CTA `Gửi phản ánh`. Nền đặc `#FBF9F5`, tuyệt đối không glassmorphism.
    - **Hero Layout 58/42**: First viewport 1366x768 hoàn hảo. H1 lớn nổi bật với cụm highlight màu đỏ đô `#B42318` *"Theo dõi đến khi"*. Trust row siêu nhẹ `48h tái kiểm · Bằng chứng lưu vết · Theo dõi công khai`. Loại bỏ 100% 4 KPI cards vụn.
    - **Case Story Card độc bản**: Visual focal point bên phải với timeline đối chứng Before / After (`DG-2026-OP-014`). Loại bỏ toàn bộ icon cảnh báo trống rỗng; thay thế số liệu cứng nhắc bằng ngữ cảnh thực địa an toàn (Dữ liệu minh họa).
    - **Section 2 — Thực trạng**: Editorial layout tương phản giữa quy trình đứt gãy truyền thống (*Ảnh → Tin nhắn → Excel → ?*) và quy trình khép kín của DustGuard. 3 phát biểu đánh số `01`, `02`, `03`.
    - **Section 3 — Hành trình 5 bước**: Horizontal journey lớn trên Desktop, vertical trên Mobile (*Phát hiện → Tạo hồ sơ → Phân công → Xử lý → Tái kiểm*).
    - **Section 4 — Phân vai**: 4 portrait-style use-case blocks có compact mock UI tinh gọn cho từng đối tượng (Dân, Cán bộ, Nhà thầu, Lãnh đạo).
    - **Section 5 — Nguyên tắc tin cậy**: 3 nguyên tắc lưu vết minh bạch, đưa SHA-256 về chi tiết đối soát tệp, không khoe khoang thuật ngữ kỹ thuật.
    - **Section 6 — Pilot CTA**: Banner hợp tác tinh gọn kèm compact modal đăng ký, loại bỏ hoàn toàn form dài gây ngán ngẩm trên trang chính.
    - **Chống rớt chữ & Chống ngắt dòng**: Tối ưu mobile 390px/375px với `whitespace-nowrap shrink-0` cho mã case, full-width CTA buttons dễ bấm bằng 1 ngón tay cái.
  - **Nghiệm Thu Khép Kín**:
    - `npm --prefix apps/web run build`: **PASS 100%** (1635 modules transformed, 0 lỗi).
    - `npm --prefix app run test:critical`: **PASS 100%** (93/93 tests trong 21 suites).
    - Browser Inspection (`agent-browser`): 0 horizontal overflow trên Desktop 1366, 1440, 1536, Laptop 1280 và Mobile 390, 375.
    - Đối chứng ảnh trực quan 2 vòng tại first viewport đạt chuẩn Visual Quality First.
- **Mục tiêu**: Tái cấu trúc và hiện đại hóa toàn diện Landing Page của DustGuard VN từ bản gốc `.jsx` cũ sang chuẩn TypeScript (`.tsx`) tích hợp thẳng vào phân hệ chính `apps/web` tại route `/`, tối ưu hóa hiệu năng, loại bỏ hoàn toàn các file CSS cồng kềnh và thiết lập giao diện Civic High-Contrast mượt mà.
- **Phạm vi hoàn tất**:
  - **Kiến trúc lại Component Modularity**:
    - Phân tách Landing Page thành 9 components TypeScript chuyên biệt: `LandingNav.tsx`, `HeroSection.tsx`, `ProblemSection.tsx`, `SolutionSection.tsx`, `WorkflowSection.tsx`, `RoleMatrixSection.tsx`, `CivicTechSection.tsx`, `PilotSection.tsx`, `LandingFooter.tsx`.
    - Quản lý trạng thái đa ngôn ngữ (Việt / Anh) tức thời qua localStorage và Scroll-Spy tự động bám theo vị trí cuộn trang.
  - **Tối ưu hóa Hiệu năng & Dung lượng**:
    - Loại bỏ vĩnh viễn `landing.css` (28KB) và `SvgSprite` cồng kềnh; chuyển sang 100% Tailwind CSS utility classes kết hợp `lucide-react`.
    - Giảm thiểu DOM depth, chống co giật khung hình với `scrollbar-gutter: stable`, chống rớt chữ với `text-wrap: pretty`.
  - **Trải nghiệm Tiếp cận Civic High-Contrast**:
    - Màu sắc tương phản cao ngoài trời nắng: nền `#FDFBF7` cream, chữ `#0F172A` đậm, điểm nhấn `#9F241F` seal red & `#0D6F64` teal.
    - Touch targets đảm bảo $\ge 44$px trên di động.
    - Thẻ đối chứng tương tác Trước / Sau 48h (Initial Observation $\leftrightarrow$ 48h Reinspection Proof).
  - **Tích hợp Luồng Tác nghiệp Thật (Actionable CTAs)**:
    - Nút `[Gửi phản ánh]` liên kết trực tiếp tới `/reports/new` tiếp nhận hiện trường.
    - Nút `[Xem bản đồ]` mở bản đồ vệ tinh thời gian thực `/map`.
    - Nút `[Cổng Cán bộ]` điều hướng mượt mà sang `DustGuard Operations` (`http://localhost:3002`).
  - **Nghiệm Thu Khép Kín**:
    - `npm --prefix apps/web run build`: **PASS 100%** (1635 modules transformed, 0 lỗi TypeScript).
    - Kiểm thử tự động qua `agent-browser`: 0 horizontal overflow trên cả Desktop 1366px và Mobile 390px.
    - Tương tác chuyển đổi tab đối chứng, chuyển đổi ngôn ngữ EN/VI hoạt động trơn tru.

### 2. [2026-09-05] `operations-v2.0`: Complete Zero-Seed Real-Data Operations & Production Evidence Grounding
- **Mục tiêu**: Loại bỏ hoàn toàn 100% sự phụ thuộc vào dữ liệu mẫu (seed/fake data), vận hành hệ thống trơn tru từ Zero-Data (Database rỗng là first-class state), niêm phong chứng cứ số SHA-256 thực địa và đảm bảo tính bền vững (Persistence) tuyệt đối của dữ liệu thực tế.
- **Phạm vi hoàn tất**:
  - **Loại Bỏ Hoàn Toàn Hardcode Dữ Liệu Demo**:
    - Quét sạch toàn bộ các chuỗi hardcode: `case-013`, `case-001`, `TASK-018`, `FND-01`, `REQ-03`, `dev_admin_token`, `user_tran`, `user_le`. Chỉ cho phép tồn tại trong `seed.ts` cho mục đích demo tùy chọn.
    - Cập nhật `caseFact.service.ts` và `analysis.service.ts`: Mã kết luận và finding được sinh động theo vụ việc (`FND-${caseSuffix}-${index}`) từ biên bản thanh tra thực tế, gán `undefined` nếu chưa có biên bản thực địa.
    - Giao diện `ActionModal.tsx` nạp danh sách cán bộ thực tế qua API `/api/admin/users`, hỗ trợ đưa vào hàng đợi chung nếu chưa chỉ định.
    - Giao diện `DecisionWorkspaceDrawer.tsx` và `EvidenceDetailDrawer.tsx` tính toán dựa trên `facts` thực tế của vụ việc, loại bỏ các tick xanh và liên kết ảo.
  - **Quản Lý Bằng Chứng Thực Địa & Upload Trực Tiếp**:
    - Nâng cấp `EvidencePage.tsx`: Thêm nút `[+ Tải lên bằng chứng]` trên Header, Modal tải lên trực tiếp cho phép chọn vụ việc liên kết, nguồn phát sinh và tệp tin thực tế, tự động niêm phong băm SHA-256 trên server và đối soát tệp trên đĩa cứng.
    - Thiết kế Empty State thân thiện kèm nút CTA `[Tải lên bằng chứng đầu tiên]` khi kho lưu trữ chưa có tệp tin nào.
    - Nâng cấp `LegalWorkspacePage.tsx`: Tích hợp nút tải lên bằng chứng ảnh trực tiếp trong SideDrawer Dữ kiện hồ sơ.
  - **Xử Lý Hồ Sơ Thiếu Dữ Kiện (Zero-AI Hallucination)**:
    - Hồ sơ mới chỉ có phản ánh ban đầu tự động nhận diện cấp độ kết luận `INSUFFICIENT_EVIDENCE` hoặc `INSUFFICIENT_DATA`.
    - Hiển thị danh sách nhóm dữ kiện còn thiếu (Ảnh sau khắc phục, Biên bản hiện trường, Dữ liệu IoT) và cung cấp CTA trực tiếp `[Tạo tác vụ xác minh hiện trường]`.
  - **Quy Trình Khởi Tạo Không Seed (Zero-Seed Onboarding)**:
    - Khi CSDL rỗng (`user_count === 0`): Hệ thống tự động chuyển hướng hoặc hiển thị thông báo hướng dẫn vào `/setup` để kích hoạt Super Admin đầu tiên.
    - Khóa vĩnh viễn endpoint `/api/auth/bootstrap` với mã 403 Forbidden ngay sau khi tạo tài khoản quản trị đầu tiên để chống tấn công chiếm quyền (Anti-takeover).
    - `DashboardPage.tsx` và `CaseInboxPage.tsx` cung cấp Operational Banners và Empty States hướng dẫn tạo thực thể đầu tiên (Nhà thầu, Công trình, Vụ việc).
  - **Bộ Kiểm Thử Toàn Diện & Nghiệm Thu**:
    - Xây dựng `scripts/verify-zero-seed-e2e.js`: Kịch bản 12 bước tự động kiểm thử toàn trình từ DB rỗng -> Bootstrap -> Đăng nhập -> Tạo Nhà thầu -> Tạo Công trình -> Tạo Vụ việc -> Tải bằng chứng SHA-256 -> Phân tích pháp lý thiếu dữ kiện -> Tạo Task -> Kiểm tra bền vững SQLite (100% PASS).
    - Tích hợp vào `npm test`: **87/87 Unit & Integration tests PASS** + **12/12 E2E Real-Data Steps PASS**.
    - Frontend build Vite: **PASS 100%** (0 TypeScript error, 0 lint error).

### 2. [2026-09-05] `operations-v1.9`: Specialized Decision-Support Modal Suite & Civic Intelligence Realignment
- **Mục tiêu**: Thay thế toàn bộ popup dạng "xem DB record" bằng 4 lớp giao diện hỗ trợ cán bộ ra quyết định; loại bỏ việc "gắn chữ AI vào rule engine", tách bạch rõ ràng giữa tính toán xác thực (deterministic) và trợ lý tham vấn (AI Assistant).
- **Phạm vi hoàn tất**:
  - **Phân tách 4 Loại Giao Diện Tác Nghiệp**:
    - `QuickPreviewModal` (500–620px): Trả lời 5 câu hỏi cán bộ cần: *Ai nói? Nói gì? Có đáng tin không? Hệ thống đã kiểm tra tự động gì? Liên quan gì đến nhận định & pháp luật? Tôi phải làm gì tiếp?* Raw ID hệ thống được đẩy xuống chân; dominant CTA: `[Xem đầy đủ]` và `[Tạo xác minh →]`.
    - `EvidenceDetailDrawer` (560–640px): Điều tra bằng chứng chuyên sâu với preview tài liệu lớn, mã băm SHA-256 Web Crypto đối soát đĩa cứng kèm nút sao chép, bảng đối chiếu 4 chiều thực địa (Thời điểm, Vị trí, Người gửi, Hiện trường) và liên kết đồ thị vụ việc (FND-01, REQ-03, TASK-018).
    - `ActionModal` (~520px): Giao diện đơn nhiệm cho 1 hành động tạo tác vụ xác minh, tự động tính hạn SLA 48h, giao cán bộ hiện trường và checklist 3 tiêu chí thực địa.
    - `DecisionWorkspaceDrawer` (750–850px): Thay thế modal nhỏ bằng không gian ra quyết định toàn diện với 5 bước có cấu trúc: *1. Nhận định nghiệp vụ → 2. Căn cứ pháp lý → 3. Chứng cứ đã đối chiếu → 4. Dữ kiện còn thiếu → 5. Đề xuất hệ thống ("Tại sao? [Xem lập luận]")* + Bút phê và ký duyệt lưu vết bất biến vào CSDL D1.
  - **Tái Định Vị & Làm Rõ Vai Trò Của AI**:
    - Đổi nút hành động chính từ *"Chạy thẩm tra căn cứ thực tế"* thành `✦ Phân tích hồ sơ`.
    - Thay thế điểm đơn độc *"Data Confidence 16%"* bằng 2 chỉ số độc lập: **Mức độ đầy đủ hồ sơ (Data Completeness)** tính toán theo 6 nhóm dữ kiện thực tế từ CSDL (33% = 2/6 nhóm) + **Đánh giá Trợ lý (AI Assessment)** riêng biệt với nhãn mức chắc chắn và giải thích lý do.
    - Tích hợp tính năng phát hiện mâu thuẫn dữ kiện (*AI Contradiction Detection*) và Gợi ý Top 3 Ưu tiên hành động tiếp theo.
    - Chuẩn hóa 3 màu trạng thái nhận thức: `● FACT` (slate - ghi nhận từ hệ thống), `● AI SUGGESTION` (indigo - máy gợi ý), `● VERIFIED` (emerald - cán bộ xác nhận).
  - **Nghiệm Thu Khép Kín**:
    - `npm test`: **87/87 tests PASS 100%**.
    - Frontend Vite build: **PASS 100%** (0 syntax/type error).
    - Trực tiếp kiểm thử end-to-end qua `agent-browser`: Xác minh đầy đủ 4 loại modal/drawer, tương tác tạo quyết định và xác nhận dữ liệu lưu trữ bền vững (F5 persistence).

### 2. [2026-09-05] `operations-v1.8`: Workspace-First Architecture Refactor (14-inch Windows Scale 125% Usable Canvas & Standard Primitives)
- **Mục tiêu**: Tái cấu trúc toàn diện DustGuard Operations theo nguyên tắc **WORKSPACE-FIRST**, tối ưu hóa tuyệt đối cho máy tính xách tay 14 inch ở mức scale Windows 125% (viewport ~1280–1366px), chuẩn hóa Application Shell và hệ thống primitives tác nghiệp.
- **Phạm vi hoàn tất**:
  - **Global Application Shell**:
    - Chuẩn hóa Header cao 56px (`h-14`), xóa bỏ hoàn toàn dev bar bên trên. Tích hợp gọn gàng bộ chuyển đổi vai trò (`RoleSwitcher`) ngay trong Header.
    - Sidebar đa tầng thích ứng chính xác: `< 1200px`: 68px icon mode (căn giữa icon, tooltip hover); `1200–1439px`: 196px; `≥ 1440px`: 216px.
    - Bỏ giới hạn `max-w-7xl`, content sử dụng 100% không gian còn lại (`flex-1 min-w-0 w-full`).
  - **Legal / Investigation Workspace (`/cases/:id/legal`)**:
    - Loại bỏ vĩnh viễn bố cục 3 cột cố định gây chật chội. Main Legal Canvas đạt độ rộng hữu dụng thực tế **1069px** (ở 1280px) và **1155px** (ở 1366px), vượt xa yêu cầu $\ge 800\text{px}$.
    - Chuyển "Dữ kiện hồ sơ" thành `SideDrawer` trượt từ phải (380–420px) kích hoạt qua nút `[Bằng chứng · 12]`, overlay lên nội dung và không co giãn canvas chính.
    - Chuyển "Dữ kiện còn thiếu" thành `SideDrawer` kích hoạt qua trigger `[⚠ Thiếu 3 dữ kiện]` cạnh header với 2 CTA nghiệp vụ tạo tác vụ xác minh hoặc gắn checklist.
    - Chuyển "Quyết định cán bộ" thành `BottomActionBar` ghim đáy hiển thị cấp độ kết luận, thanh tiến trình độ tin cậy và nút `[Ra quyết định →]` mở `DecisionModal` có thẩm quyền ký duyệt (Human-in-the-loop).
    - Rút gọn toàn bộ raw UUIDs thành các thẻ nguồn thân thiện: `[Hiện trường 1]`, `[IoT 1]`, `[Bằng chứng 1]`.
  - **Record Workspace Standardized**:
    - Chuẩn hóa cấu trúc `<RecordHeader />`, `<RecordNavigation />`, `<RecordContent />` cho `CaseDetailPage`, `ProjectsPage`, `ContractorsPage`.
    - Bộ thư viện layout reusable: `PageHeader`, `RecordHeader`, `RecordNavigation`, `RecordWorkspace`, `Workspace`, `ListWorkspace`, `InvestigationWorkspace`, `FormWorkspace`, `DashboardGrid`, `SideDrawer`, `BottomActionBar`, `DecisionModal`.
  - **Nghiệm Thu Khắt Khe**:
    - `npm test`: **87/87 tests PASS 100%**.
    - `npm run test:responsive`: **75/75 viewport combinations PASS 100%** (390px, 430px, 768px, 1366px, 1440px).
    - Kiểm thử trực tiếp qua `agent-browser`: Xác minh độ rộng canvas, hoạt động của drawer, quy trình ký duyệt quyết định và lưu trữ bền vững vào D1/SQLite.

### 2. [2026-09-05] `operations-v1.7`: UI Quality Watch Non-Blocking Pipeline & Mobile Touch Target Compliance
- **Mục tiêu**: Thiết lập và vận hành quy trình giám sát chất lượng giao diện (UI Quality Watch) ở chế độ Không Chặn (Non-Blocking) xuyên suốt quá trình kiểm thử trình duyệt thực tế trên ma trận 5 viewports và 14 routes tác nghiệp, khắc phục tận gốc các bất thường giao diện và nâng chuẩn tiếp cận Civic Tech.
- **Phạm vi hoàn tất**:
  - **Giám sát Non-Blocking Tự Động Hóa**: Xây dựng kịch bản `dustguard-operations/scripts/run-ui-quality-watch.mjs` quét tự động 70 trường hợp (5 viewports $\times$ 14 routes) bao gồm: Text clipping, Button clipping/overlap, Horizontal overflow, Responsive breakpoints, và Visual consistency.
  - **Ghi Nhận & Khắc Phục Bất Thường (Root-Cause Resolution)**: Phát hiện 1 bất thường độ ưu tiên Medium (`touch-target` < 44px tại tab buttons của `LegalWorkspacePage` trên viewport $430\times 932$). Khắc phục tận gốc: nâng lên `min-h-[44px] py-2.5 px-3 touch-target`, bổ sung icon `shrink-0` và nhãn linh hoạt cho di động.
  - **Nghiệm Thu Khép Kín**: Chạy lại kiểm thử trình duyệt thực tế qua `agent-browser` trên toàn bộ 70 trường hợp: **0 bất thường còn lại (100% Clean)**.
  - **Lưu Trữ SSOT**: Cập nhật báo cáo chuẩn tại `artifacts/ui-anomalies.json` và cấu hình ngoại lệ trong `.gitignore`.
  - **Bảo Toàn Logic Nghiệp Vụ**: 87/87 test suites và frontend build tiếp tục **PASS 100%**.

### 2. [2026-09-05] `operations-v1.6`: Empty DB Zero-Seed Operability, 87 Automated Tests & Tablet 768px Responsive Polish
- **Mục tiêu**: Hoàn thiện khả năng khởi tạo và vận hành 100% độc lập từ CSDL rỗng hoàn toàn (Zero Seed Dependency), phòng chống lỗi xung đột dữ liệu khởi tạo, tối ưu giao diện Tablet 768px (75/75 responsive pass) và mở rộng bộ test tự động lên 87 test PASS 100%.
- **Phạm vi hoàn tất**:
  - **Khởi tạo Statutory Config Tách biệt**: Thêm tham số `runMigrations(initSystemConfig = true)` cho phép `seedDatabase()` chạy migrations với `initSystemConfig = false` để tránh chèn trùng lặp `legal_documents` và `inspection_templates`.
  - **Bổ sung bảng Registry & Khởi tạo**: Khởi tạo đầy đủ bảng `projects`, `contractors`, `system_configs` và các cột mở rộng `project_id`, `contractor_id`, `task_type` (cho phép `FIELD_VERIFY`), `integrity_status`.
  - **Phản ánh Cộng đồng Chuẩn hóa**: Trả về cả `signal` và `data` trong endpoint `POST /api/signals/public-report`.
  - **Kiểm thử Đa khung nhìn Tablet 768px (75/75 PASS)**: Tinh chỉnh thanh tìm kiếm toàn cục trong `AppLayout.tsx` hiển thị dạng icon tại Tablet 768px (`lg:block`), giải quyết triệt để lỗi tràn 58px. Kết quả: **75/75 kiểm tra đa khung nhìn PASS 100%**.
  - **Bộ Kiểm Thử Tự Động Toàn Diện**: Mở rộng từ 40 lên **87 bài test tự động** (bao gồm 32 API test, 8 Provenance Intelligence test, 7 Empty DB Startup test, 13 Empty DB API test, 2 No Seed Runtime Dependency test, và 22 Real Data Lifecycle test). **100% PASS (0 fail, 0 skipped)** trong ~7 giây.

### 2. [2026-09-05] `operations-v1.5`: Evidence-Grounded Legal & Operational Intelligence Engine (Zero-Mock SSOT, Provenance Validation, Missing Fact Engine & Human Decision Layer)
- **Mục tiêu**: Nâng cấp toàn diện DustGuard Operations để mọi phân tích AI, đề xuất pháp lý và đề xuất vận hành đều dựa 100% trên dữ liệu thực có thể truy vết nguồn gốc (`SOURCE → FACT → EVIDENCE → INFERENCE → HUMAN DECISION`). Loại bỏ hoàn toàn mock analysis, hardcoded recommendation, fake confidence score và AI output không truy vết được nguồn.
- **Phạm vi hoàn tất**:
  - **Mở rộng CSDL**: Bổ sung 2 bảng `analysis_runs` (lưu trữ toàn bộ snapshot facts, pháp quy, kết quả và trạng thái kiểm định của mỗi lần chạy) và `human_decisions` (lưu vết bất biến quyết định của cán bộ con người, actor, vai trò, lý do và snapshot chứng cứ tại thời điểm ký duyệt). Cập nhật cột `integrity_status` cho bảng `evidence_assets` (`UNVERIFIED`, `VERIFIED`, `TAMPERED`, `FILE_MISSING`). Nâng tổng số bảng lên **34 bảng quan hệ + SQLite FTS5**.
  - **Dịch vụ Thu thập Dữ kiện Thực tế (`CaseFactService`)**: Tự động tổng hợp 8 luồng dữ kiện từ SQLite: metadata, phản ánh cộng đồng, quan sát hiện trường, kết quả checklist, đo đạc vi khí hậu, tài liệu chứng cứ kèm kiểm định SHA-256 đối chiếu đĩa cứng, số liệu viễn thám IoT và quyết định của con người.
  - **Phân định Ngữ nghĩa Nghiêm ngặt**: Phản ánh cộng đồng mặc định là `semantic_type = 'CLAIM'`, `verification_state = 'UNVERIFIED'`; quan sát hiện trường là `OBSERVATION`; dữ liệu cảm biến là `TELEMETRY` (không tự suy diễn vi phạm pháp luật); chứng cứ số kiểm định SHA-256 là `VERIFIED`; chỉ quyết định có chữ ký cán bộ mới là `HUMAN_DECISION`.
  - **Đường ống Phân tích 8 Bước (`CaseAnalysisService`)**: A. Tổng hợp dữ kiện SQLite; B. Truy xuất điều khoản pháp quy FTS5 thực; C. Xây dựng Evidence Matrix; D. Phát hiện dữ kiện thiếu (Missing Facts); E. Lập luận trên bối cảnh có cấu trúc; F. Kiểm định Zod schema; G. Kiểm định trích dẫn nguồn (từ chối 100% phát hiện không có source_id hoặc trích dẫn điều luật không có trong DB); H. Phản hồi và lưu snapshot `analysis_runs`.
  - **Cấm AI Khẳng định Vượt Quá Bằng chứng**: Thay thế toàn bộ từ ngữ võ đoán bằng văn phong chuẩn mực: *"Có dấu hiệu cần xem xét...", "Dữ liệu hiện có hỗ trợ nhận định..."*. Chỉ khi tồn tại quyết định của con người mới cho phép nâng mức kết luận lên `HUMAN_CONFIRMED`.
  - **Giao diện Ma trận Bằng chứng (Evidence Matrix UI)**: Tái thiết kế `LegalWorkspacePage` thành bố cục Desktop 3 vùng chuyên nghiệp: VÙNG 1 (Dữ kiện thực tế/Claims/Evidence kèm bộ lọc và badge ngữ nghĩa); VÙNG 2 (Ma trận bằng chứng với các chip dẫn nguồn clickable `[INS-...]`, `[EV-...]`, `[LAW-...]` mở trực tiếp modal); VÙNG 3 (Động cơ dữ kiện còn thiếu với CTA tạo tác vụ thực `/tasks` + Lớp quyết định con người với 6 hành vi ký duyệt bất biến và tra cứu FTS5).
  - **Cơ chế Dự phòng Minh bạch (Fallback Semantics)**: Đổi tên thành `RULE-BASED ANALYSIS`, chỉ ánh xạ quy tắc và dữ kiện thực tế, không giả dạng AI sinh văn bản pháp lý võ đoán.
  - **Kiểm thử Toàn diện**:
    - **40/40 tests PASS 100%** (bao gồm 32 bài kiểm thử hồi quy + 8 bài kiểm thử chuyên sâu về tính toàn vẹn chứng cứ và chuỗi truy vết nguồn gốc).
    - **75/75 responsive checks PASS 100%** trên cả 5 độ phân giải (390px, 430px, 768px, 1366px, 1440px), 0 lỗi tràn ngang.
    - Nghiệm thu trọn vẹn 8 kịch bản (Scenario A đến H) trực tiếp trên trình duyệt qua `agent-browser`: kiểm chứng F5 reload bảo toàn 100% dữ liệu quyết định và tác vụ trong SQLite.

### 2. [2026-09-05] `operations-v1.4`: Production-Usable Operations Transformation, Full 4-Role Browser Validation & Civic Operational System
- **Mục tiêu**: Nâng cấp toàn diện phân hệ DustGuard Operations từ khung giao diện cơ bản thành hệ thống vận hành thực địa sản xuất hoàn chỉnh theo đúng chu trình `SIGNAL → CASE → TRIAGE → LEGAL REVIEW → FIELD VERIFICATION → DECISION SUPPORT → ASSIGNMENT → REMEDIATION → FOLLOW-UP → CLOSURE → AUDIT TRAIL`.
- **Phạm vi hoàn tất**:
  - Hàng đợi Nhiệm vụ Vận hành (`/tasks`): Tái cấu trúc thành hàng đợi nghiệp vụ thời gian thực với 10 tab phân loại, 12 loại tác vụ ngữ nghĩa, 4 mức ưu tiên, bộ lọc tức thì và modal giao việc liên kết sâu.
  - Kho Bằng chứng Tập trung (`/evidence`): Tích hợp điểm đầu cuối `GET /api/evidence` và `POST /api/evidence/:id/verify-hash` kiểm định toàn vẹn mật mã học SHA-256 đối chiếu trực tiếp tệp trên đĩa cứng.
  - Báo cáo & Phân tích Vận hành (`/reports`): Bổ sung `GET /api/reports/overview` tính toán trực tiếp từ CSDL SQLite (Zero-Mock), tổng hợp phễu trạng thái 12 bước, tỷ lệ khắc phục đạt chuẩn, và trạng thái trạm viễn thám IoT.
  - Trung tâm Tìm kiếm Toàn cục & Command Palette (`Ctrl+K`): Hỗ trợ truy vấn liên thực thể trên Cases, Tasks, Điều khoản Luật FTS5 và Trạm IoT.
  - Không gian Thẩm tra Pháp lý (`LegalWorkspacePage`): Hoàn thiện 3 tab Vùng 2 (Phiếu Lập Luận, Bộ Tạo Checklist Hiện trường với tính năng xuất trực tiếp sang Hàng đợi Nhiệm vụ, Trợ lý AI chuẩn Zod với viện dẫn FTS5).
  - Nghiệp vụ Hiện trường (`FieldInspectionPage` & `InspectionResultPage`): Tích hợp bảo vệ bản nháp ngoại tuyến (Offline Draft Protection), xác nhận có mặt tại chỗ (GPS / thủ công không nghẽn luồng), đo đạc vi khí hậu thực địa và Ma trận Đề xuất Bước tiếp theo (Section 14).
  - Nghiệm thu Trình duyệt Thực tế qua `agent-browser`: Thực hiện kiểm thử toàn bộ 4 vai trò (Staff, Supervisor, Legal Reviewer, Admin), xác minh tính bền vững dữ liệu sau F5 và độ đáp ứng trên các kích thước màn hình Mobile (390×844, 412×915) và Desktop (1440×900) với 0 lỗi console, không tràn ngang.
  - Kiểm thử Hồi quy: **32/32 tests PASS 100%** trong phân hệ Operations; **248/248 domain tests + 43/43 UI smoke tests PASS 100%** trong ứng dụng gốc.

---

### 2. [2026-09-05] `operations-v1.3`: Decision Pack Window.open Auth Streamlining, Root CLI Harness & Full Zero-Mock Verification
- **Mục tiêu**: Hoàn thiện tối ưu trải nghiệm in ấn Decision Pack, cấu hình chuẩn hóa môi trường `.env.example`, tích hợp CLI gốc và nghiệm thu toàn diện.
- **Phạm vi hoàn tất**:
  - Chuẩn hóa xác thực `window.open`: Hỗ trợ trích xuất token qua URL query parameter trong `authMiddleware`, đảm bảo cán bộ mở trực tiếp tab mới hồ sơ Decision Pack dưới định dạng HTML in ấn chuẩn mực mà không bị chặn 401.
  - Phân định định dạng thông minh cho Decision Pack: Trả về HTML khi mở bằng trình duyệt (`Accept: text/html`) và JSON khi gọi qua API (`Accept: application/json` hoặc `?format=json`).
  - Bổ sung `.env.example` chuẩn hóa biến môi trường cho cả AI Provider (NONE/GEMINI/OPENAI) và thông số viễn thám IoT.
  - Tích hợp các script điều phối từ thư mục gốc: `operations:dev`, `operations:setup`, `operations:test`, `operations:build`, `operations:test:responsive`.
  - Nghiệm thu tự động: **32/32 tests PASS** (1.25s), Responsive **75/75 PASS** (5 viewports), Vite build thành công 100% trong 3.42s.
  - Nghiệm thu trình duyệt thực tế qua `agent-browser`: Đầy đủ 4 vai trò (Staff, Supervisor, Legal Reviewer, Admin), chu trình khép kín hoạt động thực, 0 nút chết, 0 màn hình mock.

---

### 2. [2026-09-05] `operations-v1.2`: Full Operational Delivery, Multi-Viewport Responsive QA (75/75 PASS) & Live Persistence Hardening
- **Mục tiêu**: Hoàn thiện 100% dự án DustGuard Operations, nghiệm thu trình duyệt thực tế và đóng gói phát hành.
- **Phạm vi hoàn tất**:
  - Tăng cường khả năng chịu lỗi CSDL: Cấu hình `PRAGMA busy_timeout = 5000;` loại bỏ hoàn toàn lỗi khóa ghi concurrent WAL mode.
  - Chuẩn hóa dữ liệu văn bản pháp quy: Tự động ánh xạ `section_type` tương thích ràng buộc SQLite `CHECK constraint`.
  - Khắc phục hiển thị danh mục thiết bị viễn thám IoT và quy tắc tự động hóa: Tương thích mảng hai tầng qua HTTP Client unwrapping.
  - Kiểm thử đa màn hình tự động (`scripts/verify-responsive.js`): Đạt **75/75 lượt kiểm tra PASS 100%** trên cả 5 độ phân giải: Mobile 390x844, Large Mobile 430x932, Tablet 768x1024, Laptop 1366x768, Desktop 1440x900.
  - Kiểm thử tích hợp tự động: **32/32 tests PASS 100%** (`npm test` ~1.3s).
  - Nghiệm thu quy trình nghiệp vụ thực tế qua `agent-browser`: 0 console error, 0 dead buttons, F5 reload bảo toàn 100% dữ liệu.

---

### 0. [2026-09-05] `cloudflare-production-audit`: Final Cloudflare Runtime Audit & Production Hardening
- **Mục tiêu**: Hoàn tất 16 giai đoạn kiểm định runtime và 13 cổng phát hành (Gates A đến M) theo Master Audit Contract.
- **Phạm vi hoàn tất**:
  - **Forensics & Remediation (Phase 1)**: Quét 1679 tệp mã nguồn. Thay thế toàn bộ 3 vị trí `Math.random()` bằng Web Crypto `crypto.randomUUID()`. Đưa số blocker Cloudflare về **0**.
  - **Storage Reality & DatabaseRepository (Phase 2)**: Xây dựng interface `DatabaseRepository` (`LocalSQLiteRepository`, `CloudflareD1Repository`) tại `packages/shared/src/db/database-repository.ts`.
  - **Bằng chứng R2 & Toàn vẹn băm SHA-256 (Phase 3)**: Xây dựng `POST /api/evidence/:id/verify-hash` đọc trực tiếp nhị phân từ Cloudflare R2 bucket (`bucket.get()`) và tính băm SHA-256 qua Web Crypto Subtle API. 12/12 edge routes tests PASS.
  - **Invariants & Bí mật Production (Phase 4 & 10)**: Kiểm tra mã biên dịch `dist/`, đảm bảo 0 dev token, 0 fake secret, 0 URL localhost. `tests/production-runtime-invariants.test.js` PASS 5/5.
  - **25 Bước Primary Presentation Journey (Phase 7)**: Xây dựng và thực thi thành công `scripts/verify-cloudflare-runtime-e2e.js` từ cơ sở dữ liệu rỗng (0 users, 0 cases). Toàn bộ 25 mutations thành công và xuất minh chứng tại `artifacts/cloudflare-runtime-e2e.json`.
  - **Composite Indexes cho D1/SQLite (Phase 11)**: Bổ sung 5 chỉ mục tối ưu trên `cases(case_code, created_at, project_id, contractor_id)` và `projects(contractor_id)`.
  - **Kiểm định Responsive Viewports (Phase 13)**: Xác minh 15 routes chính trên các độ phân giải 1366x768, 1440x900, 390x844 không bị tràn ngang (`scrollWidth <= innerWidth`).
  - **Báo cáo chuẩn Master**: Xuất bản `docs/audit/FINAL_CLOUDFLARE_PRODUCTION_READINESS.md` với phán quyết **READY** (13/13 Gates PASS).

---

### 1. [2026-09-05] `operations-v2.1`: Zero-Seed Production Operability & Real-World E2E Lifecycle
- **Mục tiêu**: Loại bỏ 100% phụ thuộc vào `seed.ts` và dữ liệu mẫu. Bảo đảm hệ thống vận hành hoàn hảo từ cơ sở dữ liệu trống rỗng (`DATABASE = EMPTY`), tự tạo dữ liệu qua UI/API thật.
- **Phạm vi hoàn tất**:
  - **Audit & Phân loại dữ liệu**: Hoàn thiện `docs/EMPTY_DB_OPERABILITY_AUDIT.md` (28 thực thể nghiệp vụ phân loại theo 4 nguồn gốc A: User-created, B: System-derived, C: External-integration, D: System-configuration).
  - **Tách bạch Cấu hình Hệ thống Luật định (Category D)**: Trích xuất Luật BVMT 2020, NĐ 45/2022, QCVN 05:2023, QĐ 29/2021 và Mẫu biên bản kiểm tra công trình vào `systemConfig.ts`. Tự động khởi tạo cấu hình luật định khi chạy migration, 0 tạo dữ liệu vụ việc giả.
  - **Khởi tạo lần đầu an toàn (Bootstrap Wizard)**: Trang `/setup` & `POST /api/auth/bootstrap` cho phép tạo Super Admin đầu tiên khi DB rỗng và tự động khóa vĩnh viễn (403 Forbidden).
  - **Bổ sung toàn diện các luồng tạo dữ liệu thực**:
    - Quản lý Nhà thầu (`/contractors`, `POST /api/contractors`).
    - Quản lý Công trình xây dựng (`/projects`, `POST /api/projects`).
    - Cổng tiếp nhận phản ánh công dân công khai (`POST /api/signals/public-report`).
    - Tiếp nhận & tạo vụ việc chính thức tự sinh mã tuần tự (`POST /api/signals/:id/create-case`).
    - Đăng ký thiết bị cảm biến IoT (`POST /api/iot/devices`).
  - **Xác thực toàn diện**:
    - `tests/no-seed-runtime-dependency.test.js`: 3/3 tests PASS (0 seed imports across production).
    - `tests/empty-db-startup.test.js`: 8/8 tests PASS (0 operational records, bootstrap lock).
    - `tests/empty-db-api.test.js`: 14/14 tests PASS (Tất cả endpoint HTTP 200 trên empty DB).
    - `tests/real-data-lifecycle.test.js`: 22/22 tests PASS (21 bước E2E trọn vẹn vòng đời).
  - **Tài liệu nghiệm thu**: `docs/REAL_WORLD_ACCEPTANCE_TEST.md` với câu trả lời khẳng định: **YES**.

---

### 2. [2026-09-05] `operations-v1.1`: DustGuard Operations Enterprise Expansion (32 Tables, IoT HMAC Telemetry, Legal Ingestion & 32 Tests)
- **Mục tiêu**: Nâng cấp toàn diện nền tảng Operations với hạ tầng dữ liệu mở rộng.
- **Phạm vi hoàn tất**:
  - Mở rộng cấu trúc cơ sở dữ liệu lên **32 bảng quan hệ + SQLite FTS5**: `signals`, `case_signals`, `tasks`, `iot_devices`, `iot_readings`, `iot_events`, `automation_rules`, `automation_runs`.
  - Tích hợp giao thức viễn thám IoT (ESP32 APM2000 Sensor Node) với chữ ký HMAC SHA-256 xác thực nguồn gốc và bộ lọc phát hiện cảm biến đóng băng số liệu (Flatline & Faulty Detection).
  - Cỗ máy điều hướng hành động kế tiếp (**Next Action Engine**) và Xuất hồ sơ quyết định tổng hợp (**Decision Pack**).
  - Bộ bóc tách cấu trúc văn bản pháp luật tiếng Việt (**Vietnamese Legal Parser & Ingestion**) tự động phân cấp Chương/Điều/Khoản/Điểm và lập chỉ mục FTS5 tức thì.
  - Trung tâm quản lý công việc (**Centralized Tasks**) với liên kết sâu tới vụ việc/thiết bị/pháp chế.
  - **Kiểm thử**: Đạt **32/32 tests PASS 100%** trong 1.26 giây. Vite production build thành công 100% trong 3.81s.

---

### 2. [2026-09-05] `operations-v1`: DustGuard Operations (Staff Case Management + Legal Intelligence + Inspection Workflow)
- **Mục tiêu**: Xây dựng nền tảng độc lập hoàn chỉnh dành cho cán bộ nội bộ, giám sát, pháp chế và admin.
- **Phạm vi**:
  - Khép kín 10 bước nghiệp vụ: `CASE INTAKE → TRIAGE → ASSIGNMENT → LEGAL REVIEW → INSPECTION → FINDINGS → CORRECTIVE ACTION → REMEDIATION → REINSPECTION → CLOSURE`.
  - Monorepo độc lập `dustguard-operations/`:
    - Backend Express + TypeScript + SQLite native `node:sqlite` trong WAL mode, 24 bảng quan hệ + bảng FTS5 virtual table.
    - Frontend React 18 + Vite + TypeScript + TailwindCSS Civic High-Contrast, sáng màu, không glassmorphism, 18 màn hình đầy đủ.
    - Shared types, permissions RBAC capability model, canTransitionCase state machine.
    - Assistive AI Legal Provider (Citation-first, Zod schema validation, fallback local engine).
    - Hợp đồng tích hợp DustGuard Community Idempotent API.
  - **Kiểm thử**: 15/15 integration tests PASS 100% (1.28s).
  - **Nghiệm thu trình duyệt thực tế**: Chạy trọn vẹn 10 bước qua `agent-browser`, xác minh độ bền vững dữ liệu F5 reload không mất mát, không tràn màn hình (`noOverflow: true`) trên Desktop 1440x900, 1366x768 và Mobile 390x844.

---

### 2. [2026-09-05] `community-v1`: DustGuard Community
- Phân hệ độc lập dành cho Thanh niên, Tình nguyện viên và Người dân tiếp nhận & phản ánh ô nhiễm bụi cộng đồng.
- 23 màn hình, SQLite local engine, REST API và 14/14 automated tests passed.

---

### 3. [2026-09-03] `30-screens`: Master Human-Centric Consolidation
- Hoàn tất 30 màn hình trải đều 5 nhóm người dùng: Citizen, Field Staff, Admin Coordinator, Contractor, Youth Community.
