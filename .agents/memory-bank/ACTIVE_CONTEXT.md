# ACTIVE CONTEXT — DUSTGUARD VN

## 📌 TRẠNG THÁI HIỆN TẠI: KHÓA SSOT ĐỊNH VỊ CIVIC-TECH CHUẨN MỰC (UNICEF HACKATHON)
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
- [x] **Verification Gate**: `npm --prefix app run verify:quick` đạt 28/28 files pass (237 unit + 42 UI smoke tests).
- [x] **Tài liệu SSOT**: `README.md`, `PRODUCT.md`, `TERMINOLOGY.md`, `ROLES.md`, `PERMISSIONS.md`, `AUTH.md`, `SCIENTIFIC_RESEARCH_SPEC.md`, `CIVIC_HANDOFF_SSOT.md`, `BUG_MEMORY.md`, `TIMELINE.md` đồng bộ 100%.


