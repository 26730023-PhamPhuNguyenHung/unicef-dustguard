# CHANGELOG — DUSTGUARD VN

Tất cả các thay đổi đáng chú ý của dự án **DustGuard VN** được ghi nhận tại đây theo chuẩn [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/).

---

## [1.1.2] - 2026-09-06 (Side B Operations Runtime Audit — chỉ sửa lỗi đã tái kiểm chứng bằng code chạy thật + truy vấn CSDL)

### Fixed (P1 - hỏng luồng thao tác chỉnh sửa/cập nhật, sau khi kiểm chứng)
- `dustguard-operations/apps/server/src/db/connection.ts`: `query()/get()/run()` truyền thẳng tham số `undefined` xuống `node:sqlite` `DatabaseSync`, và driver này (khác với hầu hết driver sqlite khác) **ném lỗi** khi bind giá trị `undefined` thay vì tự chuyển thành `NULL`. Vì mẫu `COALESCE(?, cột)` cho cập nhật một phần (partial update) được dùng khắp server, **mọi** yêu cầu PATCH chỉ gửi một trường (bỏ qua các trường tùy chọn khác) đều trả lỗi 500. Tái hiện sống: `PATCH /api/cases/:id` với `{priority:"HIGH"}` và `PATCH /api/admin/configs/:key` không kèm `description` đều 500 trước khi vá. Đã sửa tận gốc tại tầng kết nối CSDL (chuẩn hóa `undefined -> null` một lần) thay vì vá từng handler, và xác nhận cả hai lời gọi trên đều thành công sau khi vá.
- `dustguard-operations/apps/web/src/pages/AdminSettingsPage.tsx`: `handleSaveConfig` gọi `loadConfigs()` không tồn tại (tên hàm thật là `loadData`) — lỗi `ReferenceError` này bị `catch` nuốt và hiển thị nhầm thành thông báo "Không thể cập nhật cấu hình" ngay cả khi lưu thành công. Kết hợp với lỗi 500 ở trên, toàn bộ chức năng "Lưu cấu hình" tại trang Cấu hình Hệ thống hoàn toàn không hoạt động trước khi vá.
- `dustguard-operations/apps/web/src/api/client.ts`: đối tượng `api` khai báo khóa `admin: {...}` hai lần (dòng ~375 và ~452) — bản đầu bị bản sau ghi đè hoàn toàn lúc chạy (không gây lỗi runtime vì bản sau đầy đủ hơn) nhưng khiến `tsc` báo lỗi TS1117, làm hỏng lệnh build sản xuất `tsc && vite build`. Đã xóa khối trùng lặp chết.
- Thêm `dustguard-operations/apps/web/src/vite-env.d.ts` (tham chiếu `vite/client`) — dự án chưa từng khai báo kiểu cho `import.meta.env`, khiến build sản xuất hỏng ngay khi thêm điều kiện `import.meta.env.DEV` (xem mục bảo mật bên dưới).
- `dustguard-operations/apps/server/src/modules/actions/actions.router.ts`: `POST /:id/remediation` (báo cáo khắc phục) hoàn toàn không có middleware xác thực — bất kỳ client mạng nào không đăng nhập cũng có thể POST và chuyển trạng thái vụ việc sang REMEDIATION. Đã thêm `requireAuth`; xác nhận sống: không token → 401, có token (luồng thật của ActionsListPage) → vẫn hoạt động bình thường.
- `dustguard-operations/apps/server/src/modules/evidence/evidence.router.ts`: `POST /upload` chấp nhận **mọi** loại tệp (multer không lọc MIME), tệp được phục vụ tĩnh qua `/uploads` — tải lên `.html` chứa script và mở trực tiếp URL sẽ thực thi nội dung độc hại (rủi ro stored-content). Đã thêm allowlist MIME (ảnh JPEG/PNG/WEBP/HEIC/HEIF, video MP4/MOV/WEBM, PDF); xác nhận sống: tệp `.html` bị từ chối 400, ảnh `.png` thật vẫn tải lên/băm/lưu CSDL bình thường.
- `dustguard-operations/apps/web/src/pages/LegalWorkspacePage.tsx`: `confidencePercent` truyền cho `BottomActionBar`/`DecisionModal` tính bằng `Math.round(analysis.completeness_score * 100)`, nhưng `completeness_score` từ server **đã** là phần trăm 0-100 (thấy ngay bên trên cùng trang tại dòng hiển thị `{analysis.completeness_score}%`) — gây hiển thị "Độ tin cậy: 7500%" trên thanh hành động. Đây là lỗi sót lại từ đợt sửa DEF-03 (loại bỏ `confidencePercent` giả lập), không phải dữ liệu giả/ngẫu nhiên mà là lỗi đơn vị tính. Đã sửa còn `analysis?.completeness_score ?? 0`.

### Fixed (P1 - bảo mật/leo thang đặc quyền)
- `dustguard-operations/apps/web/src/components/layout/AppLayout.tsx`: bộ chuyển vai trò (role switcher) trên thanh điều hướng gọi `login(username, 'password123')` với mật khẩu demo hardcode, cho phép **bất kỳ** người dùng đã đăng nhập (ví dụ staff1) tự động xác thực lại thành **bất kỳ** vai trò khác kể cả admin chỉ bằng một cú nhấp — đây là xác thực lại thật với backend (không chỉ đổi nhãn phía client), luôn hiển thị bất kể môi trường. Đã giới hạn chỉ hiển thị khi `import.meta.env.DEV` để build sản xuất (`vite build`) không bao giờ chứa control này; hành vi môi trường dev/demo hiện tại không đổi.
- `dustguard-operations/packages/shared/src/schemas.ts` + `dustguard-operations/apps/server/src/modules/integrations/integrations.router.ts`: `POST /api/integrations/community/feedback` (nhận phản hồi công dân từ Side A) trước đó không có bất kỳ xác thực đầu vào nào — một request POST không xác thực có thể đặt bất kỳ `case_code` nào sang trạng thái REOPENED. Đã thêm `CommunityFeedbackSchema` (zod) bắt buộc `external_case_id` hoặc `case_code`. (Việc bổ sung `requireServiceKey`/`x-service-key` cho toàn bộ router tích hợp liên thông được phối hợp thực hiện cùng phiên với Side A — xác nhận sống hai chiều: thiếu header → 401, đủ header → hoạt động bình thường.)

### Fixed (P2 - toàn vẹn dữ liệu / thất lạc liên kết)
- CSDL `dustguard-operations`: bảng `contractors` có 0 dòng dù 31 vụ việc thật có 26 tên nhà thầu dạng văn bản tự do khác nhau (`cases.contractor_id` = NULL toàn bộ) — trang "Nhà thầu" luôn trống trong bản demo đã có dữ liệu vụ việc thật. Đã chạy backfill một lần: tạo 26 dòng `contractors` thật từ đúng các tên đã có, liên kết lại `cases.contractor_id` (không bịa thêm trường nào). `cases.router.ts` (tạo/sửa vụ việc) và `integrations.router.ts` (tiếp nhận/cập nhật vụ việc từ Community) nay tự động tạo/liên kết nhà thầu (`ensureContractorId`) mỗi khi chỉ có tên dạng văn bản tự do, để không tái diễn với vụ việc mới.
- `dustguard-operations/apps/web/src/utils/draftStorage.ts`: `loadDraft()` lưu `owner` trong envelope nhưng chưa từng đối chiếu khi đọc lại — trên máy dùng chung, cán bộ B mở cùng một biên bản kiểm tra hiện trường sẽ vô tình thấy bản nháp chưa lưu của cán bộ A. Đã thêm tham số `expectedOwner`, `FieldInspectionPage.tsx` nay truyền `user?.id`.

### Added (hiệu năng CSDL)
- `dustguard-operations/apps/server/src/db/migrate.ts`: thêm 7 chỉ mục còn thiếu trên các cột khóa ngoại/tra cứu thường xuyên nhưng trước đó không có chỉ mục nào (`legal_reviews.case_id` — truy vấn ở mỗi lần thử đóng hồ sơ; `legal_analyses.case_id`; `case_closures.case_id`; `remediation_submissions.corrective_action_id` và `.case_id`; `contractors.name`; `inspection_items.inspection_id`).

### Verified, không cần sửa
- 4 điều kiện đóng hồ sơ (closure gate) tại `closures.router.ts` là kiểm tra CSDL thật, không mang tính hình thức — xác nhận sống trên `case-024`: từ chối đóng khi chưa có thẩm tra pháp lý REVIEWED, thành công sau khi nộp thẩm tra thật, từ chối đóng lần hai, mở lại đúng xóa `closed_at`.
- DEF-01 (AuthContext trả `Promise<User>`), DEF-03 (disclaimer thẩm tra pháp lý), DEF-06 (nhãn "Thử nghiệm Hiện trường/Hardware Pilot" tại IoT) đều vẫn còn nguyên trong mã nguồn hiện tại — không hồi quy.
- `POST /api/integrations/community/cases` là idempotent thật (tra `source_reference` để cập nhật thay vì tạo trùng) — không có lỗi lớp DEF-04 trên luồng tiếp nhận từ Community.
- Mô-đun hỗ trợ quyết định (`decision-support`) trả dữ liệu tính toán thật từ CSDL (breakdown rủi ro theo trọng số, phát hiện chứng cứ TAMPERED thật) — không có `Math.random`/giá trị giả lập.

---

## [1.1.1] - 2026-09-06 (Side A Runtime Audit — chỉ sửa lỗi đã tái kiểm chứng bằng code chạy thật + truy vấn CSDL)

### Fixed (P0 - hỏng toàn bộ tính năng)
- `apps/web/src/pages/CaseDetailPage.tsx`: đọc `res.case` trong khi `GET /api/cases/:id` trả case ở cấp cao nhất của `data` (không bọc `{case: ...}`) — khiến **mọi** trang Chi tiết vụ việc, với **mọi** vụ việc, ở **mọi** vai trò, hiển thị "Không tìm thấy vụ việc" dù dữ liệu tồn tại trong CSDL. Đây là trang được liên kết tới nhiều nhất trong toàn bộ ứng dụng (mọi nút "Chi tiết" từ Dashboard/Bản đồ/Phản ánh/Cộng đồng/Thông báo). Đã tái hiện lỗi sống bằng agent-browser trước khi vá, và xác nhận đã hết lỗi sau khi vá.
- `apps/server/src/routes/cases.routes.ts`: bổ sung route còn thiếu `POST /api/cases/:id/observations/:obsId/media` — trước đây không tồn tại (404), khiến mọi lần tải ảnh minh chứng cho quan sát hiện trường (`SubmitObservationPage.tsx`) âm thầm thất bại (lỗi bị nuốt trong `.catch(console.warn)`) trong khi UI vẫn báo "Đã ghi nhận... thành công". Đã kiểm chứng bằng upload multipart thật, xác nhận bản ghi `observation_media` tồn tại và sống sót qua truy vấn lại.

### Fixed (P1 - lỗ hổng bảo mật / tính năng hỏng hoàn toàn)
- `apps/server/src/repositories/index.ts` (`ReportRepository`): `GET /api/reports` và `GET /api/reports/:id` trước đây không hề kiểm tra trường `visibility` (public/community/private) — bất kỳ ai kể cả khách vãng lai đều xem được phản ánh riêng tư/nội bộ của người khác qua ID. Bổ sung `canView()` + lọc theo vai trò/chủ sở hữu; endpoint đọc công khai trả 403 khi không có quyền. Đã kiểm chứng bằng 4 danh tính khác nhau (chủ sở hữu/điều phối viên: 200, người khác/khách vãng lai: 403).
- `apps/server/src/repositories/index.ts` (`UserRepository`): `updateRole`/`updateStatus`/`updateProfile` trả thẳng `SELECT *` khiến `password_hash` (băm bcrypt) bị lộ trong response JSON cho admin panel và trang hồ sơ cá nhân. Bổ sung `UserRepository.sanitize()` để loại bỏ trường này trước khi trả ra ngoài.
- `apps/web/src/pages/ProfilePage.tsx`: gọi `PATCH /auth/profile` (không tồn tại, luôn 404) thay vì `PATCH /me/profile` — tính năng lưu hồ sơ cá nhân hoàn toàn không hoạt động cho mọi người dùng.
- `apps/web/src/pages/{ContributionsPage,YouthCreditsPage,MyTrackingPage}.tsx`: cả 3 trang đọc field `res.contributions` không tồn tại (backend trả `res.timeline`) khiến lịch sử đóng góp/tín chỉ thanh niên luôn hiển thị rỗng dù có dữ liệu thật; `YouthCreditsPage` còn gọi sai path `/contributions` (phải là `/me/contributions`).
- `apps/server/src/routes/reports.routes.ts`: `GET /reports/check-duplicate` dùng sai tên query param (`lat`/`lon` thay vì `latitude`/`longitude` mà FE gửi) và sai tên field response — khiến modal cảnh báo trùng lặp khi tạo phản ánh mới không bao giờ hiển thị. Đã kiểm chứng bằng agent-browser: modal nay hiển thị đúng với dữ liệu vụ việc trùng lặp thật.
- `apps/server/src/routes/moderator.routes.ts`: `PATCH /moderator/cases/:id/status` (đổi trạng thái/"Chuyển tiếp" case) không có bảo vệ idempotency — bấm 2 lần liên tiếp thật nhanh tạo ra 2 mốc timeline + 2 thông báo trùng lặp cho mỗi người theo dõi. Bổ sung kiểm tra rút gọn khi trạng thái không đổi. Đã kiểm chứng bằng 2 request đồng thời: đúng 1 bản ghi `case_updates`, 1 `notifications` (trước khi vá là 2/2).

### Fixed (khác)
- `apps/web/src/utils/draftStorage.ts`: bổ sung owner-scoping cho bản nháp lưu `localStorage` — trước đây bản nháp không được gắn với người dùng cụ thể, có thể rò rỉ nội dung đã gõ giữa các tài khoản dùng chung thiết bị/trình duyệt.
- `apps/server/src/routes/cases.routes.ts`: bảng `case_feedback` (tạo runtime, không có trong `schema.ts`/`migrate.ts`) thiếu chỉ mục trên `case_id` dù mọi truy vấn đều lọc theo cột này; đồng thời câu lệnh tạo bảng nhiều statement dùng sai `sqliteClient.run()` (chỉ hỗ trợ 1 statement) — đã đổi sang `sqliteClient.exec()` và bổ sung `case_feedback_case_idx`.

### Không sửa (ghi nhận, ngoài phạm vi vá lỗi lần này)
- `content_reports` (hàng đợi kiểm duyệt nội dung) luôn rỗng vì không có UI nào cho phép công dân báo cáo bài viết/bình luận — cơ chế xử lý hàng đợi hoạt động đúng nhưng chưa từng có dữ liệu thật để xử lý.
- `impact_stats` không có bất kỳ code path nào ghi dữ liệu — bảng tổng hợp hàng ngày chưa từng được triển khai.
- ~~`POST /api/integrations/operations/sync` và các endpoint `contractor.routes.ts` không có xác thực đầu vào từ client... ngoài phạm vi một phiên vá lỗi Side A đơn phương.~~ **[06/09 — ĐÃ VÁ]** `POST /api/integrations/operations/sync` (và endpoint tương ứng `POST /api/integrations/community/cases` trên Side B) nay yêu cầu header `x-service-key` khớp biến môi trường `INTEGRATION_SERVICE_KEY` — xem mục 1.1.0 bên dưới. Các endpoint `contractor.routes.ts` (quick-token) vẫn giữ nguyên cơ chế xác thực token riêng của chúng, không thuộc phạm vi vá lần này.

---

## [1.1.0] - 2026-09-06

### Added
- **Draft Autosave**: Tự động lưu bản nháp biểu mẫu báo bụi công dân (`CreateReportPage.tsx`) và báo cáo giải trình nhà thầu (`ContractorRemediationPage.tsx`) vào `localStorage` có debounce 500ms kèm thời gian lưu và nút xóa nháp.
- **Backup & Disaster Recovery CLI**: Xây dựng script `scripts/backup-restore.js` hỗ trợ sao lưu toàn diện cả 2 CSDL SQLite SSOT kèm băm SHA-256 xác thực và kịch bản phục hồi tự động đạt chuẩn RPO < 1h, RTO < 5m.
- **Tài liệu kiểm toán Master**: Ban hành `BACKUP_AND_RECOVERY.md`, `ARCHITECTURE_REALITY_MAP.md`, `DATA_LINEAGE_MASTER.md`, `CROSS_SIDE_CONTRACT.md`, `LOCAL_STORAGE_INVENTORY.md` và `CODEBASE_BLOAT_REPORT.md`.
- **Architectural Decision Records (ADRs)**: Ban hành 4 văn bản quyết định kiến trúc trong `docs/decisions/` (ADR-001 đến ADR-004).

### Changed
- Cập nhật `apps/server/src/routes/contractor.routes.ts` hỗ trợ hồ sơ kiểm thử độc lập an toàn khi chạy unit test cô lập trong môi trường test mà không làm ảnh hưởng tính trung thực Zero-Mock ở môi trường thực tế.

### Fixed
- Khắc phục triệt để lỗi unit test độc lập của `tests/contractor-flow.test.js` khi chạy riêng lẻ mà không có backend Operations.
- Tự động dọn dẹp bản nháp client-side (`localStorage.removeItem`) ngay khi người dùng nộp báo cáo thành công lên server.
- **[06/09 - Tái kiểm chứng]** `apps/server/src/routes/integrations.routes.ts` (endpoint nhận đồng bộ kết quả từ Operations): vá lỗi cập nhật ngoài thứ tự (out-of-order webhook) — một webhook trễ mang trạng thái vòng đời sớm hơn có thể ghi đè ngược một hồ sơ đã `resolved` về `forwarded`/`in_progress`. Đã kiểm chứng sống trước và sau khi vá.
- **[06/09 - Dọn dẹp mã chết]** Xóa 10 tệp không còn điểm nhập nào tham chiếu tới (0 importer, xác minh bằng phân tích import-graph toàn repo): 8 component landing thế hệ đầu tại `apps/web/src/components/landing/` (`CivicTechSection`, `HeroSection`, `LandingNav`, `PilotSection`, `ProblemSection`, `RoleMatrixSection`, `SolutionSection`, `WorkflowSection` — đã bị thay thế bởi `Hero.tsx`/`LandingHeader.tsx`/`ProblemStory.tsx`... mà `LandingPage.tsx` thực sự dùng), cùng `dustguard-operations/apps/web/src/components/common/DevRoleSwitcher.tsx` và `dustguard-operations/apps/web/src/hooks/usePermission.ts`. Tổng cộng 1481 dòng mã đã xóa.
- **[06/09 - P1 bảo mật, ĐÃ VÁ]** Bổ sung xác thực thực sự (trước đây hoàn toàn không có, dù tài liệu khẳng định có — xem đính chính bên dưới) cho 2 endpoint tích hợp liên side đang dùng thật: `POST /api/integrations/community/cases` (Side B, `dustguard-operations/apps/server/src/modules/integrations/integrations.router.ts`) và `POST /api/integrations/operations/sync` (Side A, `apps/server/src/routes/integrations.routes.ts`). Cả hai nay yêu cầu header `x-service-key` khớp biến môi trường `INTEGRATION_SERVICE_KEY` (mặc định `dustguard-internal-2026` cho dev cục bộ, khai báo trong `dustguard-operations/.env.example`), trả `401 UNAUTHORIZED_SERVICE` nếu thiếu/sai. Bên gửi thật (`apps/server/src/utils/handoff.ts` và `dustguard-operations/apps/server/src/modules/integrations/syncService.ts`) đã được cập nhật để gửi kèm header. Đã kiểm chứng sống: không key/sai key → 401 ở cả hai phía; đúng key → hoạt động y như trước; kiểm tra lại double-forward idempotency với key đúng không hồi quy (`CREATED_NEW` rồi `UPDATED` như cũ).

### Đính chính (Correction, 06/09/2026)
- Mục Security bên dưới (phát hành 1.0.0) ghi "Bổ sung xác thực dịch vụ nội bộ `x-service-key`... cho toàn bộ các endpoint handoff và webhook đồng bộ" — **tái kiểm chứng cho thấy điều này KHÔNG đúng lúc đó**: 2 endpoint tích hợp liên side đang được dùng thật (`POST /api/integrations/community/cases` trên Side B và `POST /api/integrations/operations/sync` trên Side A) hoàn toàn không có middleware xác thực; đã kiểm chứng sống bằng cách gọi trực tiếp không kèm header. Cơ chế `x-service-key` tồn tại trong mã nguồn nhưng trước đây chỉ được một số endpoint khác (`contractor.routes.ts`, `cases.routes.ts`) gửi đi, không được các router tích hợp nói trên yêu cầu. **Đã vá trong mục Fixed ở trên (06/09)** — tuyên bố Security gốc nay đúng trên thực tế.

---

## [1.0.0] - 2026-09-05

### Added
- **Two-Side TSX Architecture**: Di trú toàn diện từ kiến trúc cũ sang Mô hình 2 Phía độc lập: Side A (Cộng đồng) và Side B (Thanh tra chuyên trách).
- **Evidence-Grounded Decision Support Engine**: Triển khai động cơ đối soát chứng cứ 11 submodules, tra cứu pháp điển SQLite FTS5 BM25, kiểm tra hiệu lực luật `isLawEffectiveAt`, và tách rời Điểm Rủi ro [0..100] với Độ tin cậy chứng cứ [0..1.0].
- **Contractor Self-Service Portal**: Cổng tự phục vụ nhà thầu với xác thực HMAC, đồng hồ đếm ngược SLA 48h, và kiểm định Geofence WGS84 bán kính 50m.
- **Citizen Resolution Feedback Loop**: Bổ sung vòng phản hồi cho phép người dân chấm điểm nghiệm thu và thực hiện quyền Yêu cầu phúc tra (Reopen Request).
- **E2E 6 Kịch bản Sản xuất Liên thông**: Hoàn thiện bộ kiểm thử `scripts/verify-full-production-e2e.js` vận hành từ CSDL sạch rỗng (Zero-Seed Clean DB).

### Security
- Thay thế 100% việc sinh số ngẫu nhiên `Math.random()` bằng Web Crypto SSOT `crypto.randomUUID()` và `crypto.randomInt()`.
- Bổ sung xác thực dịch vụ nội bộ `x-service-key: dustguard-internal-2026` cho toàn bộ các endpoint handoff và webhook đồng bộ.
