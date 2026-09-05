# DUSTGUARD VN — SSOT TIMELINE (MEMORY BANK)

> **Cập nhật mốc phát triển và lịch sử trạng thái dự án**  
> *Đồng bộ với .agents/TIMELINE.md*

---

## 📅 Các Mốc Phát Triển Chính (Milestones)

### 0. [2026-09-05] `ui-ux-production-hardening`: Tinh Chỉnh & Nghiệm Thu Giao Diện Sáng Màu, Không Glassmorphism, 15 Minh Chứng Đa Màn Hình
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
