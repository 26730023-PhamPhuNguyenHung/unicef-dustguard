# ACTIVE CONTEXT — DUSTGUARD VN

## 📜 REBUILD DUSTGUARD ADMINISTRATIVE DOCUMENT STUDIO (COMPLETED & VERIFIED)
- **Tóm tắt Công việc & Kết Quả Đạt Được**:
  1. **Visual Merge Field Engine**:
     - Xây dựng Tiptap Extension `MergeFieldNode` loại bỏ 100% việc hiển thị thô `{{variable}}` trong Normal Mode. Thay bằng visual inline merge chip với subtle styling, hover tooltip nguồn dữ liệu SSOT và cảnh báo `[Thiếu: Tên trường]`.
     - Hỗ trợ chuyển đổi nhanh sang "Chế độ Mẫu (Template Mode)" khi cần xem mã raw.
  2. **Variable Registry SSOT (`src/lib/documents/variable-registry.js`)**:
     - Chuẩn hóa danh mục các trường dữ liệu theo 6 nhóm nghiệp vụ: Công trình (`site`), Kiểm tra (`inspection`), Quan trắc (`telemetry`), Vi phạm & Pháp lý (`legal`), Thể thức văn bản (`doc`), Chữ ký & Thẩm quyền (`signer`).
     - Tích hợp hàm `validateDocumentVariables` thực hiện Pre-flight Check trước khi xuất bản.
  3. **Multi-Page A4 Canvas & Real Pagination**:
     - `A4PageContainer.jsx`: Khổ giấy A4 chuẩn $210\text{mm} \times 297\text{mm}$ với lề NĐ 30/2020 (trái 30mm, phải 15mm, trên/dưới 20mm), thước đo lề `PageRuler.jsx`, số trang thật `Trang X / Y`, và semantic `PageBreakNode`.
     - Bottom Status Bar: Đếm từ thời gian thực, badge trạng thái tài liệu, autosave indicator và thanh trượt điều khiển Zoom (75% - 150%).
  4. **Document Navigator & Compact Data Panel**:
     - `DocumentOutline.jsx`: 2 tabs (Cấu trúc Outline tự động trích xuất Headings và Thư viện Mẫu văn bản chuẩn NĐ 30/2020 & 118/2021 có xác nhận an toàn).
     - `DataBindingsPanel.jsx`: Accordion 6 nhóm, tìm kiếm thông minh, thống kê SSOT và nút `+` chèn nhanh visual node tại con trỏ (caret).
  5. **Pre-flight Check & Export Parity**:
     - `PreflightCheckModal.jsx`: Cảnh báo các biến thiếu trước khi xuất PDF / DOCX, hỗ trợ xuất bản nháp hoặc quay lại chỉnh sửa.
     - `GoogleDocsEditor.jsx` & `DocumentEditorPage.jsx`: Tích hợp toàn diện, hỗ trợ phím tắt `Ctrl+S`, query params hydration (`?template=...`, `?siteId=...`), và D1 API persistence thật.
  6. **Kiểm Thử Đạt Chuẩn Tuyệt Đối**:
     - `app/tests/administrative-document-studio.test.js`: PASS 8/8.
     - `app/tests/official-document.test.js` & `documents-legal-updates.test.js`: PASS 11/11.
     - `npm run verify:quick`: PASS 100% (237 unit + 42 UI smoke tests).
     - `npm run verify`: PASS 100% (74/74 test files, 575 in-memory + 11 database integration tests).

## Nhiệm vụ hiện tại
- **Mục tiêu**: UI/UX Auto-Fixer Agent — Duyệt toàn bộ các route trên hệ thống qua Chrome DevTools MCP, visual audit đa viewport (Desktop 1440x900 & Mobile 390x844), sửa dứt điểm các lỗi rớt chữ, tràn lề, scrollbar thô và nút bấm thiếu đồng bộ.
- **Trạng thái**: ✅ **HOÀN TẤT TOÀN DIỆN TẤT CẢ CÁC TRANG (PASS 100% VISUAL AUDIT + 100% TESTS)**

## Danh mục trang đã nghiệm thu trực quan và auto-fix:
1. `/` (`LandingPage.jsx`) — Đạt chuẩn Civic Tech.
2. `/community` (`CommunityHome.jsx`) — Đạt chuẩn 4 Quick Action cards & Metrics.
3. `/community/observe` (`CreateObservation.jsx`) — Đã sửa category buttons không bị truncate, fix badge wrap mobile "Bắt buộc".
4. `/community/discover` (`CommunityDiscover.jsx`) — Đã sửa thanh scrollbar xám xấu xí (`.no-scrollbar`), sửa 4 thẻ thống kê không bị truncate `...`.
5. `/community/cases` (`CommunityCases.jsx`) — Đã sửa 4 thẻ KPI không bị truncate, sửa dropdowns filter responsive mobile, filter chips cuộn mượt.
6. `/community/impact` (`CommunityImpact.jsx`) — Đã sửa Card "🪪 Hồ sơ tình nguyện viên" và nút "✏️ Sửa", loại bỏ dấu chấm lẻ loi trong 4 mốc Milestones, xóa bỏ truncate trên 4 card tổng quan.
7. `/community/actions` (`CommunityActions.jsx`) — Đã đồng bộ cụm nút hành động (📁 Xem hồ sơ, 📷 Ảnh gốc, ⚡ Nhận việc), fix tràn 3 nút filter trên mobile, ẩn scrollbar thô.
8. `/community/cases/:caseId` (`CommunityCaseWorkspace.jsx`) — Đã sửa container 6 Tabs điều hướng mượt mà, không còn scrollbar xám.
9. `/community/observations/:id` (`ObservationDetail.jsx`) — Đã sửa fallback data, load ảnh sắc nét kèm mã băm SHA-256 đối chứng, chống crash khi API offline.
10. `/staff/dashboard` (`StaffDashboard.jsx`) — Đã gỡ `line-clamp-1` trên header subtitle, tối ưu hiển thị 4 thẻ KPI và Queue điều phối.
11. `/staff/cases` (`StaffCases.jsx`) — Bảng điều khiển bộ lọc 7 bước và empty state đạt chuẩn.
12. `/staff/sites` (`StaffSites.jsx`) — Danh mục công trình & trạm quan trắc chuẩn Civic Tech.
13. `/executive` (`ExecutiveDashboard.jsx`) — Bảng chỉ đạo điều hành môi trường tổng thể.
14. `/contractor` (`ContractorDashboard.jsx`) — Cổng nhà thầu xử lý việc gấp và nộp minh chứng 50m.

---

- **Bản chất dự án**: Ngay từ đầu DustGuard là một thử nghiệm CivicTech về bụi công trình, sử dụng cộng đồng + dữ liệu + công nghệ để biến quan sát ngoài hiện trường thành bằng chứng có cấu trúc và hành động có thể theo dõi. Sau quá trình làm việc với chuyên gia, nhóm không thay đổi mục tiêu đó; nhóm chỉ làm rõ hơn ranh giới: DustGuard hỗ trợ cộng đồng ghi nhận, đối chứng, hiểu vấn đề và kết nối với các kênh xử lý hiện hữu, chứ không đóng vai cơ quan nhà nước.
- **Đó là sự trưởng thành sản phẩm (Maturity), không phải pivot.**

---

## 💎 6 ĐIỂM ĐIỀU CHỈNH CHUẨN MỰC ĐÃ ĐƯỢC KHÓA (SSOT LOCKED)
1. **Định nghĩa đầy đủ**: *"DustGuard là nền tảng CivicTech giúp cộng đồng ghi nhận, đối chứng và theo dõi các vấn đề môi trường bằng dữ liệu có cấu trúc, đồng thời hỗ trợ chuyển những trường hợp phù hợp tới các kênh xử lý hiện hữu. Bụi công trình là use case đầu tiên."*
   - Bộ năng lực: `Community Action + Spatial Data + Evidence + Environmental Knowledge + Case Tracking + Green Credits + Integration`.
2. **Không ảo tưởng thẩm quyền**: Bỏ từ *"buộc công trình phải..."*, thay bằng *"giúp cộng đồng tạo chuỗi bằng chứng trước–sau, vị trí và dòng thời gian rõ ràng; từ đó một vấn đề có thể được theo dõi tốt hơn và, khi cần, được chuyển tới đơn vị có trách nhiệm xử lý."*
3. **Mục tiêu 24h - 48h**: Là **Community Follow-up Target** (Tỷ lệ điểm được cộng đồng quay lại đối chứng trong 24-48 giờ), không phải KPI thời gian phản hồi của cơ quan nhà nước.
4. **Green Credits / Điểm rèn luyện**: *"DustGuard có thể xác thực lịch sử tham gia, thời lượng và hoạt động bằng QR và dữ liệu truy vết; việc quy đổi sang điểm rèn luyện hoặc tín chỉ do từng đơn vị giáo dục quyết định."*
5. **Mã băm SHA-256**: *"DustGuard lưu hash SHA-256 để hỗ trợ phát hiện việc tệp bị thay đổi sau khi ghi nhận (Tamper-evident)."*
6. **Chi phí hạ tầng**: *"Chi phí hạ tầng pilot có thể gần bằng $0 trong hạn mức miễn phí hiện tại của Cloudflare."*

---

## 🎙️ ELEVATOR PITCH 30 GIÂY KHÓA CỨNG (LOCKED PITCH)
> *"Khi một bạn trẻ nhìn thấy bụi từ một công trình gần trường học, vấn đề không chỉ là làm sao gửi một phản ánh. Điều khó hơn là ghi nhận đủ bằng chứng, theo dõi xem tình trạng có thay đổi và biết bước tiếp theo nên làm gì.*
> 
> *DustGuard là nền tảng CivicTech giúp cộng đồng ghi nhận vấn đề môi trường bằng ảnh, vị trí và dữ liệu đối chứng trước–sau; hỗ trợ hiểu vấn đề, duy trì lịch sử theo dõi và tạo một hồ sơ có cấu trúc.*
> 
> *Khi cần sự can thiệp chính thức, DustGuard không thay thế các hệ thống hiện hữu mà hỗ trợ kết nối case tới những kênh như 1022, iHanoi hoặc đơn vị phù hợp. Bụi công trình là bài toán đầu tiên để chúng em kiểm chứng mô hình, trước khi mở rộng thành một nền tảng hành động xanh cho thanh thiếu niên và cộng đồng."*

---

## 🛠️ KIỂM TRA HỆ THỐNG & NHIỆM VỤ ĐÃ HOÀN TẤT
- [x] **Subagent 5: Spatial Intelligence Map Architect**:
  1. Hợp nhất toàn bộ logic bản đồ thành **1 Map SSOT duy nhất**: **'DustGuard Spatial Intelligence Map'** (loại bỏ phân mảnh, liên kết `SpatialMap`, `SpatialMapWorkspace`, `SpatialMapCanvas`).
  2. Chuẩn hóa **Mô hình Dữ liệu Không gian Hợp nhất (6 lớp không gian)**: Tọa độ chuẩn WGS84 (`EPSG:4326`), Quy tắc Zero Fake Coordinates, Sensor Layer, Sites & Emission Layer, Citizen Observation Layer (ảnh SHA-256, fuzzed ~100m bảo vệ quyền riêng tư), Event & Hotspot Layer (Dynamic Buffer 400-500m), Sensitive Geofence Trường học & Cơ sở Y tế (300m Buffer), Administrative Boundaries Layer (GeoJSON Polygons).
  3. Phân tầng hiển thị dựa trên **Ma trận Phân quyền Không gian (Spatial RBAC Matrix 6 vai trò)**: Public Guest & Citizen xem dữ liệu tổng hợp (ẩn 100% PII, làm mờ tọa độ ~100m, ẩn ghi chú nội bộ); Staff / Inspector / Operator xem toàn diện Full Telemetry & Audit, giải mã PII để thẩm tra thực địa; Executive xem bản đồ chỉ đạo rủi ro toàn quận/thành phố và ma trận SLA; Admin quản trị cảm biến và ranh giới.
  4. Biên soạn ban hành tài liệu SSOT [MAP.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/MAP.md), cập nhật [INDEX.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/INDEX.md), [AGENTS.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/AGENTS.md), [TIMELINE.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/TIMELINE.md), bảo đảm 100% test pass.
- [x] **Subagent 2: Domain Model & Data Schema Architect**:
  1. Tái cấu trúc Domain Model lấy **'Environmental Event'** làm trung tâm (loại bỏ hoàn toàn tư duy 'vi phạm/violation' và ảo tưởng quyền lực chế tài).
  2. Phân định rõ ràng 3 tầng kiến trúc dữ liệu: **Measurement** (bản ghi đo đạc thô, time-series trung tính) ≠ **Signal** (dấu hiệu bất thường phát hiện từ đo đạc/quan sát) ≠ **Event** (sự kiện môi trường tập hợp signals cần theo dõi & hành động).
  3. Thiết lập Schema và Máy trạng thái 11 bước chuẩn của Event: `detected` ➔ `needs_review` ➔ `under_review` ➔ `needs_verification` ➔ `verified_signal` ➔ `forwarded` ➔ `action_in_progress` ➔ `monitoring` ➔ `resolved` ➔ `closed` / `dismissed`.
  4. Biên soạn và đồng bộ 2 tài liệu SSOT kiến trúc miền: [DATA_MODEL.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DATA_MODEL.md) và [DOMAIN.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DOMAIN.md).
- [x] **Subagent 1: Product Scope & Scientific Positioning Auditor**:
  1. Tái kiến trúc định vị DustGuard thành **Nền tảng Trí tuệ Môi trường & Hỗ trợ Ra Quyết định (Environmental Intelligence & Decision Support Platform)**.
  2. Phân loại 100% tính năng thành 3 nhóm ranh giới minh bạch: Tier A (Core Owned), Tier B (Decision Support - AI as Assistant), Tier C (External Authority Integration).
  3. Hoàn thiện và đồng bộ 2 tài liệu SSOT học thuật & sản phẩm: [PRODUCT.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/PRODUCT.md) và [SCIENTIFIC_RESEARCH_SPEC.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/SCIENTIFIC_RESEARCH_SPEC.md).
- [x] **Subagent 3: Canonical Workflow & Handoff Architect**:
  1. Chuẩn hóa **1 Canonical Workflow 11 giai đoạn duy nhất** (`ENVIRONMENTAL SIGNAL ➔ DATA VALIDATION ➔ EVENT DETECTION ➔ CORRELATION ➔ PRIORITY ASSESSMENT ➔ REVIEW QUEUE ➔ HUMAN VERIFICATION ➔ EXTERNAL/INTERNAL ACTION ➔ FOLLOW-UP ➔ IMPACT MEASUREMENT ➔ CLOSED/MONITORING`).
  2. Thiết lập quy trình **Closed-Loop Impact** đo lường đối chứng Before vs After (kiểm tra Geofence $\le 50\text{m}$, SHA-256 tamper-evident, $\Delta\text{Risk}$, nồng độ bụi và tín chỉ thanh niên).
  3. Chuẩn hóa 3 phương thức **Civic Handoff sang 1022 / iHanoi** (Dossier A4 4 khối, 1-Touch Quick Dispatch Format, và Official API JSON Schema `v2.0-canonical`).
  4. Biên soạn ban hành tài liệu SSOT [WORKFLOWS.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/WORKFLOWS.md) và cập nhật [INDEX.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/INDEX.md), [BUG_MEMORY.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/BUG_MEMORY.md), [TIMELINE.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/TIMELINE.md).
- [x] **Civic Handoff & Tích hợp (Civic Handoff Specialist)**:
  1. Loại bỏ 100% từ ngữ áp đặt ("buộc công trình phải...") ➔ Thay bằng: *"giúp cộng đồng tạo chuỗi bằng chứng trước–sau, vị trí và dòng thời gian rõ ràng; từ đó một vấn đề có thể được theo dõi tốt hơn và, khi cần, được chuyển tới đơn vị có trách nhiệm xử lý."*
  2. Định vị rõ ràng **Tổng đài 1022** và **Cổng Công dân số iHanoi** là **ĐIỂM TÍCH HỢP** kết nối case, không thay thế hệ thống chính thức của cơ quan nhà nước.
  3. Chuẩn hóa hồ sơ **Structured Civic Dossier** 4 khối chuẩn khổ A4 phục vụ đối thoại xây dựng giữa cộng đồng, nhà thầu và cơ quan địa bàn.
  4. Tạo tài liệu SSOT [CIVIC_HANDOFF_SSOT.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/CIVIC_HANDOFF_SSOT.md) và test suite `app/tests/civic-handoff-integration.test.js` đạt 4/4 pass.
- [x] **DevOps & Field Operations Lead**: Chuẩn hóa claim chi phí pilot gần bằng 0 Cloudflare, tự động xóa EXIF bảo vệ quyền riêng tư & nén ảnh < 300KB, test suite `image-compressor-privacy.test.js` đạt 6/6 pass.
- [x] **QA & Domain Logic Verifier**: Chuẩn hóa định nghĩa SHA-256 tamper-evident, khóa bất biến Observation != Case và Follow-up 3 trạng thái.
- [x] **Subagent 10: Scientific Terminology & Runtime Verification Lead**:
  1. Biên soạn hoàn chỉnh tài liệu SSOT [TERMINOLOGY.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/TERMINOLOGY.md) chuẩn hóa toàn bộ từ điển thuật ngữ khoa học & ngôn ngữ học Civic Tech, tuân thủ 100% nguyên tắc khiêm tốn, khách quan, khoa học.
  2. Cập nhật toàn diện `README.md` phản ánh chính xác định vị: **Nền tảng Environmental Intelligence & Decision Support Vì Hành Động Cộng Đồng**.
  3. Xác thực toàn bộ 28/28 test suites (237 unit + 42 UI smoke tests) vượt qua 100% qua lệnh `npm --prefix app run verify:quick`.
- [x] **Subagent 4: Role & Permission Auditor**:
  1. Tinh gọn hệ thống Role chỉ giữ đúng 5 vai trò thực tế duy nhất: `PUBLIC` (Công chúng xem AQI tổng hợp), `CITIZEN` (Người dân / Thanh niên gửi ghi nhận, nhận điểm rèn luyện QR), `OPERATOR` (Điều phối viên / Reviewer duyệt hàng đợi, tạo dossier, chuyển giao 1022), `SITE_REPRESENTATIVE` (Đơn vị thi công xem hiện trường, nộp ảnh dập bụi geofence <= 50m), `ADMIN` (Quản trị hệ thống, cảm biến IoT).
  2. Xóa bỏ hoàn toàn việc giả lập 'Inspector Bộ trưởng' hoặc 'Thẩm phán hành chính / Cơ quan cưỡng chế xử phạt'.
  3. Biên soạn cập nhật 2 tài liệu SSOT độc lập: [ROLES.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/ROLES.md) (định danh 5 vai trò thực tế & chuẩn hóa tương thích) và [PERMISSIONS.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/PERMISSIONS.md) (ma trận phân quyền RBAC & ABAC chi tiết 5x18).
  4. Đồng bộ [AUTH.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/AUTH.md), [INDEX.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/INDEX.md), [BUG_MEMORY.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/BUG_MEMORY.md).
- [x] **Subagent 8: Citizen & Youth Experience Specialist**:
  1. Tinh gọn trải nghiệm ghi nhận cộng đồng với luồng **3-Chạm (< 30 giây)**: Chụp ảnh hiện trường ➔ Chọn nguồn phát sinh ô nhiễm ➔ Gửi ngay trong `CreateObservation.jsx`, tự động lấy GPS và gắn nhãn đối chứng.
  2. Nâng cấp bộ nén ảnh client `< 300KB`, tự động lọc sạch toàn bộ segment EXIF nhạy cảm (bảo vệ danh tính công dân/thanh niên) và sinh mã băm SHA-256 tamper-evident trong `UploadZone.jsx`, `CitizenReportFormSection.jsx`, `CreateObservation.jsx`.
  3. Rà soát và khóa cứng nhận diện vai trò: Citizen là **nguồn tín hiệu & người theo dõi minh bạch**; không tự ý kết luận vi phạm hay áp đặt chế tài; DustGuard hỗ trợ thiết lập chuỗi bằng chứng Before/After và kết nối tới các kênh tiếp nhận hiện hữu (1022, iHanoi).
  4. Chuẩn hóa công thức tín chỉ tình nguyện & điểm rèn luyện: **20h = 4.0 tín chỉ ngoại khóa**, 80 Điểm rèn luyện (4 ĐRL/giờ), mã QR ISO/IEC 18004 chuẩn SVG / DataUrl và disclaimer SSOT pháp lý bắt buộc.
  5. Thiết lập test suite `app/tests/citizen-youth-experience-specialist.test.js` pass 5/5 và toàn bộ verification loop `verify:quick` 28/28 files pass.
- [x] **Subagent 7: Event & Explainable Priority Scoring Engine Architect**:
  1. Chuẩn hóa thuật ngữ: Gọi là **'Priority Score'** (0-100) / **'Điểm ưu tiên can thiệp'**, tuyệt đối loại bỏ và không sử dụng thuật ngữ 'Violation Score' (bảo đảm nguyên tắc AI is Assistant, Not Judge).
  2. Xây dựng công thức **Explainable Priority Score 6 yếu tố cốt lõi**:
     - *Base severity*: Nồng độ bụi PM2.5 / PM10 so sánh chuẩn QCVN 05:2023.
     - *Duration*: Thời gian duy trì nồng độ vượt chuẩn liên tục (hours).
     - *Sensor confidence*: Độ tin cậy cảm biến (Active, Stale, Flatline, Drift, Zero-IoT resilience).
     - *Sensitive proximity*: Khoảng cách tới công trình nhạy cảm (trường học, bệnh viện, khu dân cư < 300m).
     - *Citizen corroboration*: Số lượng ghi nhận thực tế từ cộng đồng, đếm independent reporters chống spam.
     - *Historical recurrence*: Tần suất lặp lại, cảnh báo trước đó, tái phát sau cam kết khắc phục.
  3. Đảm bảo UI luôn giải thích minh bạch **'Tại sao Score = X'** với các thẻ giải thích trực quan (`+ High PM10`, `+ 3 citizen reports`, `+ 220m from school`, `+ 2 past warnings`) và chuỗi `whyScoreX`.
  4. Cập nhật module scoring canonical trong codebase (`dust-risk-engine.js`, `riskEngine.js`, `PriorityScoreCard.jsx`, `RiskBreakdownModal.jsx`, `SiteOverviewTab.jsx`).
  5. Thiết lập test suite toàn diện `explainable-priority-score.test.js` (7/7 tests pass) và kiểm thử boundary, mathematical invariants đạt 100%.
- [x] **Subagent 9: Operator & Decision Support Workspace Specialist**:
  1. Đổi mới hoàn toàn tư duy thiết kế: Chuyển từ *"Thanh tra xử lý vi phạm"* sang **"Operational Review & Verification"** (Điều phối vận hành môi trường CivicTech, thẩm tra tín hiệu, đối chứng minh chứng thực địa và hỗ trợ chuẩn hóa hồ sơ).
  2. **Review Queue minh bạch**: Sắp xếp danh sách sự kiện/tín hiệu theo **Priority Score** (P1 Khẩn / P2 Ưu tiên / P3 Theo dõi), phân tách 4 khối rõ ràng: *Signal* (loại tín hiệu, mức độ khẩn), *Sensor Telemetry* (PM10, PM2.5, chuẩn QCVN 05, hỗ trợ chế độ Zero-IoT không cảm biến), *Citizen Evidence* (ảnh hiện trường GPS, hash SHA-256 tamper-evident), và *SLA Countdown*.
  3. **Verification Workflow 4 kết quả xác minh chuẩn hóa**:
     - `confirmed_signal`: Tín hiệu xác thực (Đúng thực tế) ➔ Chuyển sang tạo Case hoặc gửi Handoff 1022/iHanoi.
     - `not_confirmed`: Không xác nhận (Không có cơ sở / Sai lệch) ➔ Đóng cảnh báo & lưu vết giải trình.
     - `insufficient_evidence`: Chưa đủ bằng chứng (Cần bổ sung) ➔ Yêu cầu gửi thêm ảnh đối chứng định vị.
     - `needs_follow_up`: Cần theo dõi thêm (Chờ đối chứng) ➔ Kích hoạt mục tiêu đối chứng cộng đồng 24h - 48h (Community Follow-up Target).
  4. **Regulation Reference Assistant & Disclaimer bắt buộc**:
     - Tích hợp tra cứu nhanh chuẩn mực: **QCVN 05:2023/BTNMT** (Chất lượng không khí), **QCVN 18:2021/BXD** (An toàn thi công & dập bụi), **QĐ 48/2024/QĐ-UBND Hà Nội** (Tưới ẩm giảm bụi 3 lần/ngày).
     - Live Evaluator so sánh trực quan nồng độ đo kiểm thực tế với ngưỡng QCVN 05.
     - Khóa cứng Disclaimer bắt buộc trên toàn bộ UI và kết quả tra cứu: *"Mang tính hỗ trợ tra cứu, không thay thế kết luận thẩm quyền"*.
  5. Rà soát & nâng cấp toàn diện các module Operator / Staff UI: `StaffDashboard.jsx`, `UnifiedOperationsCenter.jsx`, `StaffCaseDetail.jsx`, `StaffAlerts.jsx`, `StaffAI.jsx`, `LegalSearch.jsx`, `AppSidebar.tsx`, `AppHeader.tsx`.
- [x] **Subagent 6: Sensor & Data Quality Integrity Specialist**:
  1. **Sensor Registry SSOT (`sensor.rules.js`)**: Chuẩn hóa `SENSOR_DEVICE_TYPES` (6 loại: `SOLAR_POLE`, `MAST_STATION`, `HANDHELD`, `SUSPENDED_POD`, `KIOSK_SOLO`, `MOBILE_NODE`), `SENSOR_CALIBRATION_STATUS` (`CALIBRATED`, `PENDING_CALIBRATION`, `EXPIRED`, `UNCALIBRATED`), `SENSOR_HEALTH_STATUS` (5 trạng thái), `SENSOR_TIERS` (`PRODUCTION`, `FIELD_TRIAL`, `EXPERIMENTAL`, `BENCHMARK`).
  2. **Environmental Measurements & Zero-Fake Hardware Fields**: Thiết lập danh mục `HARDWARE_PROFILES` với kênh đo phần cứng chuẩn xác. Khóa cứng nguyên tắc không tổng hợp số liệu giả cho phần cứng không hỗ trợ (ví dụ `BASIC_OPTICAL_PM` chỉ đo PM2.5 & PM10, các trường `pm1`, `temp`, `humidity` giữ nguyên `null`).
  3. **Data Quality Engine 5 tầng kiểm toán (`data-quality.engine.js`)**:
     - *Physical Bounds*: Phát hiện số đo bất khả thi vật lý (PM1 > 1000, PM2.5/PM10 > 2500, Temp ngoài -20-70°C, Độ ẩm ngoài 0-100%).
     - *Flatline Detection*: Phát hiện hiện tượng treo cảm biến / ADC freeze ($\ge 5$ mẫu đo liên tiếp không đổi trải dài $\ge 10$ phút).
     - *Sudden Jumps*: Phát hiện nhảy vọt phi thực tế ($\Delta \text{PM2.5} > 250\ \mu g/m^3$ trong $\le 15$s hoặc tốc độ $> 25\ \mu g/m^3/s$).
     - *Stale Data / Liveness*: Cảnh báo dữ liệu trễ quá 15 phút hoặc lệch đồng hồ thiết bị.
     - *Data Gaps & Sequence Anomaly*: Phát hiện mất gói tin ($seq_{curr} - seq_{prev} - 1$) và chặn sequence rollback.
     - Tính toán điểm chất lượng dữ liệu tổng hợp (Data Quality Score 0-100) và xếp hạng (EXCELLENT, GOOD, FAIR, POOR, CORRUPTED).
  4. **Device Cryptographic Integrity & Replay Protection (`hmac.js`, `replay-protection.js`, `device-auth.js`)**:
     - Hỗ trợ HMAC-SHA256 chuẩn hóa cho nhiều định dạng firmware, theo dõi sequence đơn điệu ngăn chặn tấn công phát lại (Replay Attack).
     - Tách biệt thiết bị thử nghiệm (`isExperimental: true`, tag `EXPERIMENTAL`): Cho phép ghi nhận telemetry và tạo log cảnh báo nhưng cách ly, không tự động sinh án phạt/case pháp lý.
  5. **Sensor Hardware Adapter (`sensor.adapter.js`)**: Chuẩn hóa giải mã dữ liệu IoT đa giao thức (ESP32 HTTP JSON, Pipe-delimited serial, LoRaWAN binary payload).
  6. **API Endpoints & Integration**: Nâng cấp `GET /api/sensors/audit/integrity`, bổ sung `GET /api/sensors/:id/quality` và tích hợp Data Quality Engine trực tiếp vào `POST /api/sensors/reading`.
  7. **Verification**: Thiết lập test suite toàn diện `sensor-data-quality-integrity.test.js` (17/17 pass) và bảo đảm toàn bộ pipeline `verify:quick` (28 suites, 237 tests + 42 UI smoke) đạt 100% pass.
- [x] **Verification Gate**: `npm --prefix app run verify:quick` đạt 100% pass.
- [x] **Tài liệu SSOT**: `README.md`, `PRODUCT.md`, `OPERATOR_WORKSPACE_SSOT.md`, `CIVIC_HANDOFF_SSOT.md`, `TERMINOLOGY.md`, `BUG_MEMORY.md`, `TIMELINE.md` đồng bộ 100%.
