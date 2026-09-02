# ACTIVE CONTEXT — DUSTGUARD VN

> **Trạng thái**: Hoàn tất Biến Các Module Quản Lý Thành Feature Thật (Real Working Features trên D1 SQLite SSOT) | **Branch**: `master` | **Cập nhật**: 2026-09-02

---

## 🎯 1. Trọng Tâm Hoạt Động Hiện Tại (Active Operational State)
- **Hoàn Tất Biến Các Module Quản Lý Thành Feature Thật (Real Working Features)**:
  - **1. Hồ sơ Vụ việc (Case Management & 7-Step Workflow)**:
    * Endpoint `GET /api/cases/:id` & `GET /api/staff/cases/:id/detail`: Hợp nhất aggregate toàn diện (`case`, `site`, `report`, `assignment`, `tasks`, `evidence`, `remediation`, `timeline`, `nextAction`, `currentStep`, `currentStepNumber`).
    * Endpoint `POST /api/cases/:id/assign`: Phân công cán bộ thật từ `users`, cập nhật case, tự động tạo task trong `tasks`, ghi lịch sử `case_timelines`, tạo thông báo trong `notifications`.
    * Endpoint `POST /api/cases/:id/inspection`: Lưu biên bản 10 tiêu chí QCVN 18:2021/BXD & QĐ 48/2021/QĐ-UBND vào `inspections`, tự động hoàn thành task và chuyển bước hồ sơ.
    * Endpoint `POST /api/cases/:id/evidences`: Upload ảnh minh chứng, lưu trữ mã băm SHA-256 đối chứng toàn vẹn.
    * Endpoint `POST /api/cases/:id/close`: Hoàn tất và đóng hồ sơ, ghi audit log, tạo thông báo kết quả.
  - **2. Nhiệm vụ Cán bộ (Staff Tasks)**:
    * Endpoint `/staff/tasks/summary`, `/staff/tasks/list`, `/staff/tasks/create` truy vấn và lưu trữ trực tiếp vào CSDL D1/SQLite.
  - **3. Trạm Quan trắc, Báo cáo & Thông báo**:
    * Endpoint `/staff/monitoring/stations`, `/staff/monitoring/summary`, `/staff/reports/*`, `/staff/notifications/*` vận hành 100% dữ liệu thật, không mock fake.
  - **4. Kiểm Thử Nghiệm Thu**:
    * `app/tests/management-features-e2e.test.js`: **8/8 tests PASS 100% (103ms)**.
    * `npm --prefix app run verify:quick`: **241/241 tests PASS 100% (2.0s)**.
    * Đã tạo báo cáo nghiệm thu chi tiết tại `docs/REAL_FEATURE_COMPLETION.md`.
  - **5. Nối Ống Dữ Liệu Thực Tế (Data Plumbing SSOT)**:
    * Kiểm tra và củng cố toàn bộ luồng: Form ghi nhận của người dân/thanh niên (`CreateObservation.jsx`, `CitizenReport.jsx`, `ReportNewPage.jsx`, `UploadZone.jsx`) -> Nén ảnh tự động < 300KB & khử metadata nhạy cảm EXIF (`image-compressor.js`) -> Tạo mã băm cryptographic SHA-256 Web Crypto (`image-integrity.js`) -> Lưu trữ D1/SQLite bảng `complaints`, `evidences`, `observations`, `observation_evidence` -> API normalization/unwrap -> Hiển thị chi tiết và dòng thời gian xử lý (`ObservationDetail.jsx`, `ReportDetailPage.jsx`, `ReportsListPage.jsx`).
  - **6. Đồng Bộ Ngoại Tuyến (Offline Mode & Resilient Drafts)**:
    * Thống nhất hàng đợi lưu nháp ngoại tuyến giữa Citizen Portal và Community Portal qua `saveOfflineDraft` và `setupAutoSync` trong `offline-drafts.js`.
    * Tự động đồng bộ các bản ghi nhận nháp lên máy chủ D1 ngay khi kết nối mạng được phục hồi (`online` event listener).
    * Hạn chế rủi ro vượt hạn mức localStorage quota bằng cơ chế cắt tỉa thông minh (QuotaExceededError protection).
  - **3. Khử Lỗi Runtime & Null Pointer**:
    * Sửa lỗi `Invalid Date` tiềm ẩn khi parse các trường ngày tháng không đồng nhất giữa `created_at` và `createdAt` trong `ObservationDetail.jsx`, `ReportDetailPage.jsx`, `ReportsListPage.jsx`.
    * Sửa lỗi kiểm tra tọa độ `Number(null).toFixed(6)` biến thành `'0.000000'` bằng việc kiểm tra tường minh `latitude != null && longitude != null`.
    * Thêm try/catch bảo vệ cho `evidencesRes`, `followUpsRes`, `handoffsRes` trong `observation.repository.js` và parse JSON an toàn trong `community.routes.js`.
    * Nối liên kết 2 chiều giữa `complaints` và `cases` để nạp `resolvedEvidenceUrl` (ảnh sau khi nhà thầu khắc phục) và timeline vụ việc vào màn hình chi tiết của người dân.
  - **4. Kiểm Thử Toàn Diện**:
    * Chạy `node --test app/tests/citizen-observation-lifecycle.test.js`: **5/5 tests PASS 100%**.
    * Chạy toàn bộ 18 test files liên quan (Citizen, Community, Image, Drafts, Edge Routes): **131/131 tests PASS 100%**.
    * Chạy Level 3 Quick Gate `npm --prefix app run verify:quick`: **241+ tests PASS 100%**.
    * Xây dựng `document-generator.js`: Unified API cho toàn bộ Legal Tech Studio, tự động chuẩn hóa AST sang Legal AST chuẩn NĐ 30/2020, xuất bản A4 HTML Preview & Print, biên dịch OpenXML DOCX buffer / blob.
    * Đảm bảo đủ 5 thành phần bắt buộc của NĐ 30/2020: Quốc hiệu & Tiêu ngữ, Tên cơ quan & Số hiệu, Trích yếu, 3 phần nội dung (I. Căn cứ & Hiện trạng, II. Hành vi & Kết quả, III. Đề xuất & Kiến nghị), Nơi nhận & Người ký duyệt / Chữ ký số CA & Con dấu đỏ điện tử.
  - **2. Căn Cứ Pháp Lý & Trích Dẫn Khung Xử Phạt**:
    * Đối soát chính xác Nghị định 45/2022/NĐ-CP (Điều 15, Điều 43) và Quy chuẩn kỹ thuật quốc gia QCVN 05:2023/BTNMT, QCVN 18:2021/BXD, Quyết định 48/2024/QĐ-UBND Hà Nội.
    * Củng cố `calculateFineRange` (`legalRulesSSOT.js`) trả về đầy đủ `minTotal`, `maxTotal`, `totalMin`, `totalMax` và `formattedText`.
  - **3. Xuất Bản DOCX Thật & In Ấn A4 Không Vỡ Layout**:
    * Nâng cấp `StaffReportsPage.jsx` tạo file Word `.DOCX` OpenXML chuẩn Microsoft Word theo NĐ 30/2020 thay vì text blob đơn giản.
    * Bảo đảm lề trang in chuẩn NĐ 30: Top 20mm (1134 DXA), Bottom 20mm (1134 DXA), Left 30mm (1701 DXA), Right 15mm (850 DXA), Printable Width 9355 DXA.
    * Chế độ `@media print` trong `a4-preview.css` và `ExecutiveDashboard.jsx` ẩn thanh công cụ `no-print`, giữ văn bản trắng đen sắc nét.
  - **4. Sửa Lỗi Regex & Zero Undefined Guarantee**:
    * Sửa lỗi `key.replace(/\./g, '\\.')` trong `document-template-engine.js` để escape toàn bộ dấu chấm của key thay vì chỉ dấu chấm đầu tiên.
    * Đảm bảo không bao giờ xuất hiện chuỗi undefined / null / NaN trong bất kỳ văn bản nào.
  - **5. Kiểm Thử Toàn Diện**:
    * Tạo test suite mới `app/tests/executive-legal-docs-parity.test.js`: **9/9 tests PASS 100%**.
    * Chạy toàn bộ 9 bộ test Executive & Legal Tech: **66/66 tests PASS 100%**.
    * Chạy Level 3 Quick Gate `npm --prefix app run verify:quick`: **283/283 tests PASS 100%**.

- **Hoàn Tất Rà Soát & Củng Cố Tầng API Client Unwrapping, Normalization & Error Boundaries (Subagent 10)**:
  - **1. Chuẩn hóa & Unwrapping Collection (`request.js`)**:
    * Nâng cấp `normalizeList(payload)`: Tự động unwrap mọi cấu trúc phản hồi backend (`{ data: { items: [] } }`, `{ data: { campaigns: [] } }`, `{ data: [] }`, `{ items: [] }`, `{ cases: [] }`, `{ reports: [] }`, `{ sites: [] }`, `{ stations: [] }`, `{ obligations: [] }`, raw `[]`). Tuyệt đối không trả về `undefined`, `null` hoặc object không phải mảng.
    * Nâng cấp `normalizeObject(payload, fallback)`: Tự động unwrap `{ data: { ... } }` hoặc giữ nguyên object an toàn, trả về fallback `{}` khi rỗng.
    * Xử lý thông minh `options.data` vs `options.body` trong `request(path, options)`: Tự động `JSON.stringify(body)` nếu truyền plain object thay vì string, bảo toàn `FormData`, `Blob`, `ArrayBuffer`, `URLSearchParams`.
  - **2. Xử lý Lỗi RFC 7807 & Civic Vietnamese Copy**:
    * Nâng cấp `formatCivicErrorMessage(rawMessage, status, code)`: Tự động chuyển đổi toàn bộ thông điệp kỹ thuật thô (`Failed to fetch`, `NetworkError`, `500 Internal Server Error`, `Bad Request`, `Unauthorized`, `Forbidden`, `Not Found`, `Too Many Requests`) thành câu tiếng Việt chuẩn civic tech, lịch sự, dễ hiểu và có thể hành động được.
    * Tích hợp `formatCivicErrorMessage` trực tiếp vào `ToastProvider` (`Toast.jsx`) và `CommunityToastContext.jsx`.
  - **3. Củng cố Component An toàn & BROKEN IMAGE RULE**:
    * Rà soát `SafeImage.jsx`, `ErrorBoundary.jsx`, `SectionErrorBoundary.jsx`.
    * Thay thế các thẻ `<img>` trần trong `ReportDetailPage.jsx` và `ContractorCasesPage.jsx` bằng `<SafeImage>` để chống vỡ icon khi URL hỏng.
    * Chuẩn hóa unwrap trong `policyIntelligenceApi.js` (`normalizeObject`, `normalizeList`).
  - **4. Kiểm thử & Xác thực**:
    * Tạo mới test suite `app/tests/api-client-unwrapping-normalization.test.js`: **5/5 tests PASS 100%**.
    * Chạy `node --test app/tests/api_contract_rbac_security.test.js`: **16/16 tests PASS 100%**.
    * Chạy `node --test app/tests/worker-full-edge-routes.test.js`: **12/12 tests PASS 100%**.
    * Chạy Level 3 Quick Gate `npm --prefix app run verify:quick`: **283+ tests PASS 100%**.

- **Hoàn Tất Rà Soát & Củng Cố Phân Hệ Staff Case Management & 7-Step Enforcement DAG (Subagent 4)**:
  - **1. Danh Sách Hồ Sơ Vụ Việc (`CasesListPage.jsx` - Mockup 6 chuẩn)**:
    * 4 KPIs tổng quan ("Hồ sơ mở", "Gần đến hạn", "Chờ khảo sát", "Chờ nghiệm thu").
    * 6 Tabs lọc trạng thái ("Tất cả", "Mới tạo", "Đang xử lý", "Chờ nhà thầu", "Chờ nghiệm thu", "Đã hoàn tất").
    * Bảng 7 cột danh sách hồ sơ (Mã hồ sơ, Tên công trình & Địa chỉ `break-words`, Bước hiện tại, Hạn xử lý SLA, Cán bộ phụ trách, Trạng thái, Nút mở chi tiết $\ge 44\text{px}$).
    * Bố cục 75% Bảng + 25% Cột ưu tiên hôm nay 310px (`xl:w-[310px]`) cho Top 3 hồ sơ khẩn cấp.
    * Nút "Xuất danh sách" và "Tạo hồ sơ" kèm Modal tạo vụ việc mới lưu trực tiếp vào D1/SQLite.
  - **2. Không Gian Xử Lý Vụ Việc (`CaseDetailPage.jsx` - Mockup 7 chuẩn)**:
    * Metadata bar 6 cột thông tin cốt lõi (Mã hồ sơ, Trạng thái, Mức ưu tiên, Hạn SLA 48h, Cán bộ phụ trách, Việc cần làm tiếp).
    * Stepper tiến trình 7 bước (Enforcement DAG: Tiếp nhận -> Xác minh -> Thông báo -> Khảo sát -> Đề xuất -> Thẩm định -> Hoàn tất).
    * 6 Tabs chuyên sâu: Thông tin chi tiết, Ảnh đối chứng Before/After, Lịch sử theo dõi 7 bước, Biên bản khảo sát 10 tiêu chí QCVN 18/QĐ 48, Kế hoạch khắc phục của nhà thầu, Hồ sơ pháp lý & dự thảo quyết định xử phạt NĐ 45/2022/NĐ-CP.
    * Modal phóng to ảnh kèm mã băm SHA-256 đối chứng toàn vẹn.
    * Modal phân công cán bộ & hạn SLA.
    * Modal xem trước & in biên bản A4 chuẩn thể thức NĐ 30/2020/NĐ-CP.
  - **3. Backend & State Machine DAG SSOT**:
    * Củng cố `case.rules.js`: hàm `validateCaseTransition` chuẩn hóa `normalizeStatus`, khóa illegal jumps, chống sửa đổi hồ sơ `COMPLETED`.
    * Sửa lỗi tham số `undefined` binding trong `cases.routes.js` và bổ sung import `deriveWorkflowStep`, `getNextAction`.
    * Bổ sung route handler cho `PUT /api/complaints/:id/status` trong `complaints.routes.js`.
  - **4. Kiểm thử**:
    * `node --test app/tests/case-enforcement-dag-7steps.test.js app/tests/staff-cases-mockup6-7.test.js app/tests/cases-inspections-complaints-audit.test.js`: **31/31 tests PASS 100%**.
    * Toàn bộ Quick Gate: **283/283 tests PASS 100%**.
  - **1. Quan trắc & Chuỗi đo 24h (`StaffMonitoringPage.jsx`)**:
    * Biểu đồ đường SVG trực quan hóa chuỗi thời gian 24h đối chiếu ngưỡng QCVN 05:2023/BTNMT (PM2.5: 50/75 µg/m³, PM10: 100/150 µg/m³), xử lý an toàn khi 0 cảm biến (Optional IoT zero-crash).
    * Nhúng bản đồ OpenStreetMap GIS tỷ lệ chuẩn `w-full h-[180px] sm:h-[200px] overflow-hidden` không gây tràn layout.
    * Bảng danh sách trạm quan trắc kết nối D1 SQLite với phân trang `Hiển thị 1 đến ...`, bộ lọc quận huyện (Thanh Xuân, Cầu Giấy, Ba Đình, Hoàng Mai...).
    * Nút tác nghiệp và tương tác đạt chuẩn touch targets $\ge 44\text{px}$, zero glassmorphism.
  - **2. Xử lý Cảnh báo & Chuyển đổi 1-Click sang Vụ việc (`StaffAlertsPage.jsx`)**:
    * Bố cục 75/25 chuẩn mực với cột cố định 310px (`xl:w-[310px]`) cho panel "Ưu tiên hôm nay" (Top 3 cảnh báo khẩn cấp).
    * Chức năng 1-Click `+ Tạo hồ sơ` (`handleConvertToCase`) tự động gọi Atomic D1 transaction (`POST /api/staff/alerts/:id/convert-to-case`), khởi tạo vụ việc mới, chuyển trạng thái Alert sang `IN_PROGRESS`.
    * Toàn bộ buttons và inputs đạt chuẩn $\ge 44\text{px}$.
  - **3. Kiểm thử & Độ tin cậy**:
    * Chạy `node --test app/tests/staff-monitoring-d1-api.test.js` & `node --test app/tests/staff-screens-7-11-audit.test.js`: **12/12 tests PASS 100%**.
    * Chạy `npm --prefix app run verify:quick`: **279/279 tests PASS 100%**.
  - **1. Thiết lập 3 Tài liệu Sản phẩm Chuẩn hóa**:
    * [`docs/product/PRODUCT_LANGUAGE.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/PRODUCT_LANGUAGE.md): Canonical Product Vocabulary, chuẩn hóa trạng thái vòng đời, quy tắc hiển thị mức ưu tiên và ranh giới 5 vai trò.
    * [`docs/product/PRODUCT_CONSISTENCY_AUDIT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/PRODUCT_CONSISTENCY_AUDIT.md): Báo cáo audit ma trận 35 màn hình, phân loại xuất hiện của Risk Score (Nhóm A->F), bảng đối chiếu Traceability và kịch bản Golden Case duy nhất `#DG-2026-0842`.
    * [`docs/product/PRODUCT_CONSISTENCY_SCORECARD.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/PRODUCT_CONSISTENCY_SCORECARD.md): Bảng điểm QA nội bộ 7 tiêu chí x 35 màn hình.
  - **2. Đồng Bộ & Cập Nhật Toàn Bộ Tài Liệu SSOT Lỗi Thời trong `.agents/`**:
    * Đã cập nhật [`.agents/ssot/ROUTES.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/ROUTES.md) chuẩn hóa 5 phân hệ app và loại bỏ mapping legacy `/community`.
    * Đã cập nhật [`.agents/ssot/USER_FLOWS.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/USER_FLOWS.md) theo chuỗi 7 bước North Star mới.
    * Đã cập nhật [`.agents/ssot/CIVIC_UI_DESIGN_SPEC.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/CIVIC_UI_DESIGN_SPEC.md) với định vị Action & Outcome v2.1.
    * Đã làm mới [`.agents/memory-bank/KNOWN_ISSUES.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/memory-bank/KNOWN_ISSUES.md), [`.agents/memory-bank/IMPLEMENTATION_GAPS.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/memory-bank/IMPLEMENTATION_GAPS.md), [`.agents/memory-bank/NEXT_ACTIONS.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/memory-bank/NEXT_ACTIONS.md) theo lộ trình 7 giai đoạn.
  - **3. Kiểm thử Toàn vẹn Hệ thống**: `verify:quick` tiếp tục đạt **279/279 tests PASS 100%**.


  - **1. Hoàn tất 39 tài liệu chuẩn tại `docs/product/screens/`**:
    * 31 File Screen Specs: Tinh gọn (120-200 dòng), chuẩn hóa 21 mục, phân định 4 trạng thái `CURRENT / PARTIAL / PROPOSED / UNKNOWN`, loại bỏ toàn bộ boilerplate CLI/testing dài dòng.
    * 6 File Global Matrices: `SCREEN-REGISTRY.md`, `SCREEN-AUDIT.md`, `SCREEN-PERMISSION-MATRIX.md`, `SCREEN-DATA-MATRIX.md`, `SCREEN-STATE-MATRIX.md`, `SCREEN-VERIFICATION-PLAN.md`.
    * 2 File Tổng Hợp: `README.md` và `INDEX.md`.
  - **2. Khắc phục triệt để các ranh giới nghiệp vụ & Human-Centric UI/UX**:
    * Dust Risk Score (0-100) là Điểm ưu tiên tác nghiệp, không phải kết luận vi phạm pháp lý.
    * AI Engine là Trợ lý hỗ trợ quyết định (Decision Support, Human-in-the-loop).
    * IoT Sensors là nguồn tín hiệu tùy chọn (Optional signal source), hệ thống chạy 100% khi 0 cảm biến.
    * Loại bỏ hoàn toàn jargon kỹ thuật trên UI người dùng phổ thông, CTA ngắn 1-3 từ, tối ưu nhận thức 5s/10s/30s.
  - **3. Kiểm thử Gate**: Toàn bộ Quick Gate (`verify:quick`) đạt **279/279 Tests Pass 100%** (2.3s in-memory, 0.5s smoke).
- **Hoàn Tất Rà Soát & Hoàn Thiện Giao Diện 6 Màn Hình Cán Bộ 1-6 + Layout (Subagent UI-3)**:
  - **1. Layout Cán Bộ (`StaffLayout.jsx`)**: Sidebar điều hướng cố định 240px vững chãi, tích hợp min-h-[44px] touch targets, zero glassmorphism, responsive từ 360px đến desktop.
  - **2. Bàn Làm Việc Cán Bộ (`StaffDashboardPage.jsx`)**: Bố cục 3 cột chuẩn (~42% Việc cần làm, ~30% Cảnh báo, ~28% Hồ sơ), 4 metric KPI cards nổi bật, hàng loạt action buttons đạt chuẩn $\ge 44\text{px}$, không cắt cụt tên công trình (`break-words`).
  - **3. Danh Sách Công Trình (`SitesListPage.jsx`)**: Bảng cuộn ngang an toàn (`overflow-x-auto`), 4 KPI cards, bộ lọc phân trang $\ge 44\text{px}$, địa chỉ và tên công trình tự xuống dòng `break-words`.
  - **4. Chi Tiết Công Trình (`SiteDetailPage.jsx`)**: Tích hợp bản đồ Leaflet OpenStreetMap, chuỗi dữ liệu đo bụi thời gian thực, bảng hồ sơ liên quan, checklist việc cần bổ sung và các nút tác nghiệp $\ge 44\text{px}$.
  - **5. Danh Sách Hồ Sơ Vụ Việc (`CasesListPage.jsx`)**: 4 KPI cards, 6 tab trạng thái, bảng 7 cột chuẩn CSDL D1/SQLite với cột ưu tiên khẩn cấp 310px, zero truncate, touch targets $\ge 44\text{px}$.
  - **6. Không Gian Xử Lý Vụ Việc (`CaseDetailPage.jsx`)**: Stepper 7 bước tác nghiệp trực quan (Enforcement DAG), Checklist 10 tiêu chuẩn theo QCVN 18:2021/BXD và QĐ 48/2021/QĐ-UBND với 3 trạng thái tương tác (Đạt / Cần cải thiện / Chưa đạt), Modal giao việc phân công cán bộ & hạn SLA, Modal xem trước và in ấn biên bản A4 chuẩn thể thức hành chính theo **Nghị định 30/2020/NĐ-CP**, SafeImage đối chứng Before/After và modal phóng to ảnh kèm mã băm SHA-256 đối chứng toàn vẹn.
  - **7. Danh Sách Nhiệm Vụ (`TasksListPage.jsx`)**: 4 KPI cards, 5 tabs lọc, bảng nhiệm vụ 7 cột, cột lịch công tác hôm nay 310px cố định, các nút thao tác (Mở, Sửa, Đổi hạn, Hoàn thành) đều đạt chuẩn $\ge 44\text{px}$.
  - **Kiểm thử**: Toàn bộ test suite liên quan (`staff-sites-mockup4-5.test.js`, `staff-cases-mockup6-7.test.js`, `staff-mockups8-9-10.test.js`, `staff-dashboard-priority-queue-ssot.test.js`, `staff-workflow-ux.test.js`, `design-system-tokens.test.js`) 31/31 tests PASS (365ms), Toàn bộ Quick Gate (279/279 tests) PASS 100%.

- **Hoàn Tất Rà Soát & Hoàn Thiện Giao Diện 5 Màn Hình Cán Bộ 7-11 (Subagent UI-4)**:
  - **1. Màn hình Quan trắc (`StaffMonitoringPage.jsx`)**: Biểu đồ đường chuỗi thời gian 24h rõ ràng (PM2.5 / PM10 đối chiếu ngưỡng QCVN 05:2023), bảng danh sách trạm phân trang mượt mà, bộ lọc khu vực/quận huyện (Thanh Xuân, Cầu Giấy, Ba Đình, Hoàng Mai...), nhúng bản đồ OpenStreetMap GIS tỷ lệ chuẩn không tràn layout, thẻ trạm bất thường trực quan, touch targets $\ge 44\text{px}$, zero glassmorphism.
  - **2. Màn hình Cảnh báo (`StaffAlertsPage.jsx`)**: Bố cục tối ưu tỷ lệ 75% Bảng danh sách cảnh báo + 25% Cột ưu tiên xử lý khẩn cấp (310px cố định), nút 1-Click `+ Hồ sơ` chuyển đổi nhanh sang vụ việc, tích hợp SafeImage an toàn minh chứng hiện trường và modal phóng to ảnh, touch targets $\ge 44\text{px}$.
  - **3. Màn hình Báo cáo (`StaffReportsPage.jsx`)**: Tích hợp Modal xem trước và in ấn A4 chuẩn thể thức văn bản hành chính theo **Nghị định 30/2020/NĐ-CP** (Quốc hiệu, Tiêu ngữ, Số hiệu, Trích yếu, 3 phần nội dung & Nơi nhận/Ký duyệt), hỗ trợ xuất file Word (`.doc`), file CSV/Excel (`.csv`), touch targets $\ge 44\text{px}$.
  - **4. Màn hình Hồ sơ Cán bộ (`StaffProfilePage.jsx`)**: Thẻ định danh công tác số (Mã thẻ thanh tra viên `staffCode`, Đơn vị, Chức vụ, Trạng thái hoạt động), form cập nhật thông tin cá nhân & đổi mật khẩu bảo mật 2 lớp, touch targets $\ge 44\text{px}$.
  - **5. Màn hình Nhật ký Hoạt động (`StaffActivityPage.jsx`)**: Trục thời gian (Timeline) dọc rõ nét với badge màu phân loại hành động (Biên bản A4, Xử phạt, Cảnh báo, Cập nhật trạng thái), hiển thị đầy đủ cán bộ thực hiện, vai trò, thời gian chính xác, mã hồ sơ mục tiêu và chi tiết kết quả, hỗ trợ lọc theo loại hành động và tìm kiếm từ khóa, touch targets $\ge 44\text{px}$.
  - **Kiểm thử**: Viết mới test suite `staff-screens-7-11-audit.test.js` (5/5 tests PASS, 7ms), toàn bộ 28 test files + Quick Gate PASS 100%.

- **Hoàn Tất Rà Soát & Nâng Cấp Giao Diện 4 Màn Hình Nhà Thầu + 3 Màn Hình Quản Trị (Subagent UI-5)**:
  - **Phân Hệ Nhà Thầu (Contractor Workspace & Remediation Flow)**:
    * `ContractorLayout.jsx`: Bổ sung Mobile Drawer navigation, nâng toàn bộ touch targets lên $\ge 48\text{px}$ glove-friendly, zero glassmorphism, responsive từ 360px đến 1920px.
    * `ContractorDashboardPage.jsx`: Cung cấp 4 KPI cốt lõi (Yêu cầu khắc phục, Đã xử lý, Điểm tuân thủ QCVN 05:2023, Trạm cảm biến IoT online), giám sát nồng độ bụi công trường, nút bấm to $\ge 48\text{px}$.
    * `ContractorTasksPage.jsx`: Tích hợp đo khoảng cách định vị GPS Geofence $\le 50$m trực quan, hỗ trợ chụp ảnh After Evidence, tự động băm mã SHA-256 đối chứng tính toàn vẹn, checklist 4 biện pháp tiêu chuẩn, nút bấm glove-friendly $\ge 48\text{px}$.
    * `ContractorCasesPage.jsx`: Quản lý hồ sơ vụ việc liên kết Cổng DVC 1022 & iHanoi, chuỗi đối chứng Before/After, modal chi tiết trực quan, loại bỏ hoàn toàn cắt cụt text.
    * `ContractorReportsPage.jsx`: Bảng 10 tiêu chí tuân thủ bảo vệ môi trường thi công (Checklist SSOT), Mẫu in A4 nghiệm thu bàn giao (Printable Handover Certificate với modal xem trước và hỗ trợ in ấn A4 chuẩn thể thức).
  - **Phân Hệ Quản Trị Hệ Thống (Admin & D1 Cloud Infrastructure)**:
    * `AdminLayout.jsx`: Bổ sung Mobile Drawer navigation, touch targets $\ge 48\text{px}$, sắc nét, tương phản cao.
    * `AdminDashboardPage.jsx`: 4 KPI hạ tầng D1 SSOT (D1 SQLite Database queries/storage, Edge Worker latency P99, IoT nodes online, R2 Evidence Vault storage/count), Bảng trạng thái sức khỏe phân hệ lõi (System Health) và Nhật ký kiểm toán tác nghiệp (Audit Trail).
    * `UsersPage.jsx`: Bảng danh sách tài khoản hỗ trợ Dropdown đổi quyền trực tiếp In-Place (5 roles chuẩn RBAC), Zero Truncate trên họ tên và email (`break-words`/`break-all`), thanh tìm kiếm & bộ lọc, modal thêm người dùng mới.
    * `SettingsPage.jsx`: Form cấu hình tương tác đầy đủ các ngưỡng quy chuẩn kỹ thuật quốc gia QCVN 05:2023/BTNMT (PM2.5, PM10, TSP, SO2, NO2, CO), tham số Geofence 50m, thời hạn SLA 24h/48h, cấu hình Webhook Zalo OA / Telegram Bot.
  - **Kiểm thử**: `verify:quick` (279/279 tests) PASS 100%, tất cả test suite Contractor & Admin pass trọn vẹn.
- **Hoàn Tất Nâng Cấp Toàn Diện Bàn Làm Việc Cán Bộ & Task Queue SSOT (Subagent 3 - Staff Dashboard & Task Queue)**:
  - **1. Nối Ống Dữ Liệu Thực Tế D1/SQLite SSOT**:
    * Đồng bộ truy vấn SQL tổng hợp qua `getStaffDashboardData` trong `staff-dashboard.service.js` với 4 bảng thực thể (`sites`, `alerts`, `cases`, `tasks`).
    * Cung cấp các endpoint `/api/staff/dashboard`, `/api/staff/overview`, `/api/staff/dashboard/summary` trên cả Express và Cloudflare Hono Worker.
    * Bổ sung auto-healing đầy đủ cho các cột bảng `alerts` (`title`, `severity`, `pm25Value`, `priorityReasons`, `evidenceUrls`, `caseId`) trong `schema-healer.js`.
  - **2. Bố Cục 3 Cột Chuẩn Tác Nghiệp (~42% / ~30% / ~28%)**:
    * Cột 1 (~42% `xl:col-span-5`): Việc cần làm tiếp theo (Next Actions ưu tiên theo SLA và mức độ khẩn cấp, filter tabs ALL/CASE/TASK/ALERT, nút Xử lý & Giao việc nhanh).
    * Cột 2 (~30% `xl:col-span-4`): Tín hiệu cảnh báo mới (Chỉ số PM2.5/PM10 đối chiếu QCVN 05:2023, thời gian thực, nút Mở case & nút Xem ảnh hiện trường).
    * Cột 3 (~28% `xl:col-span-3`): Hồ sơ đang theo dõi & Tái kiểm (Mã hồ sơ, công trình, bước tác nghiệp 1->7, cán bộ phụ trách, nút phân công trực tiếp).
  - **3. Tích Hợp 3 Modal Thao Tác Trực Tiếp Tại Chỗ**:
    * Modal 1: Tạo hồ sơ vụ việc mới (Create Case Modal với tính năng tự động điền thông tin từ Alert).
    * Modal 2: Giao việc & Phân công cán bộ (Assign Modal kết nối API `/cases/:id/assign` hoặc direct patch, cập nhật ngay lập tức).
    * Modal 3: Phóng to ảnh minh chứng trạm đo (Photo Lightbox Modal hiển thị thông số PM2.5 và chữ ký đối soát SHA-256).
  - **4. Tuân Thủ 100% Nguyên Tắc Zero Truncate & Touch Target $\ge 44\text{px}$**:
    * Loại bỏ hoàn toàn `truncate` trên tên công trình và tiêu đề hồ sơ, chuyển sang `break-words min-w-0 flex-1 font-bold leading-snug`.
    * Toàn bộ nút bấm, filter pill, input, select đều đạt chuẩn tiếp cận $\ge 44\text{px}$, responsive mượt mà từ di động 360px đến laptop 14-inch (1366x768, 1440x900).
  - **5. Kiểm Thử Đạt Chuẩn 100%**:
    * `node --test app/tests/staff-dashboard-real-devdb.test.js app/tests/staff-dashboard-priority-queue-ssot.test.js`: **14/14 tests PASS 100%** (214ms).
    * `npm --prefix app run verify:quick`: **279/279 tests PASS 100%** (28 test files + 4 UI smoke tests, 4.6s).
    * `npm --prefix app run build`: **Vite build thành công 100%** (4.6s).
- **Hoàn Tất Rà Soát & Vá Toàn Diện Phân Hệ Nhà Thầu & Đối Chứng Khắc Phục (Subagent Ops-3)**:
  - **Quick Token 0-Login UTF-8**: Khắc phục lỗi `btoa` crash khi mã hóa payload tiếng Việt có dấu, thay thế bằng helper base64url an toàn UTF-8.
  - **Worker Multipart Upload**: Bổ sung `c.req.parseBody()` cho các endpoint `POST /api/contractor/actions/:id/evidence` và `POST /api/contractor/quick-submit` khi nhận `multipart/form-data`.
  - **Geofence 50m Anti-Bypass**: Khóa chặt lỗ hổng gán `valid: true` khi GPS bị khuyết/NaN trong `ContractorService.addEvidence`, luôn đặt `valid: false` và `NO_GPS` để chống bypass 50m buffer.
  - **SSOT Services & Utils**: Tạo `app/src/shared/services/contractor-token.service.js` và `app/src/shared/utils/geofence.js`.
  - **UI Standard Parity**: Nâng cấp `ContractorReportsPage.jsx` (Bảng 10 tiêu chí tuân thủ QCVN 05/QCVN 18/NĐ 45) và `ContractorCasesPage.jsx` (Structured Dossier & Điểm tích hợp 1022).
  - **Kiểm thử**: Viết test suite `contractor-remediation-loop-audit.test.js` (7/7 tests PASS, 69ms); Toàn bộ Quick Gate (279/279 tests) PASS 100%.
- **Hoàn Tất Tài Liệu Hóa Chuẩn SSOT 8 Phần Cho 4 Màn Hình Tác Nghiệp Thực Địa, Báo Cáo NĐ 30/2020 & Kiểm Toán Công Vụ (Subagent 8 - Tasks, Reports & Audit)**:
  - `STAFF-06-tasks-list.md` (STF-06): Quản lý nhiệm vụ ca trực & khảo sát hiện trường, phân luồng 4 loại nhiệm vụ thực địa (khảo sát ban đầu, tái kiểm sau 24h, bổ sung ảnh thiếu, đo PM10/PM2.5 QCVN 05:2023), bố cục Split Layout ~75% bảng danh sách / ~25% Lịch hôm nay 310px, D1 tasks contracts & quick actions.
  - `STAFF-09-reports.md` (STF-09): Trung tâm báo cáo, thống kê & xuất bản điều hành chuẩn **Nghị định 30/2020/NĐ-CP** (Quốc hiệu, Tiêu ngữ, Số ký hiệu, Mẫu tờ trình UBND Quận, xuất file Word `.DOCX` / In ấn `PDF A4` kèm mã băm `docHash`), biểu đồ so sánh 4 tuần, AI soạn nháp và tự động gửi email 08:00 Thứ Hai.
  - `STAFF-10-profile.md` (STF-10): Hồ sơ cán bộ & định danh công tác, mã số Thẻ thanh tra viên (`staffCode` font-mono), đơn vị công tác, SĐT khẩn cấp nhận cảnh báo vượt ngưỡng, đổi mật khẩu bảo mật tài khoản và tự động đồng bộ vào mục Người lập biên bản NĐ 30/2020.
  - `STAFF-11-activity.md` (STF-11): Nhật ký công vụ bất biến & lưu vết kiểm toán tác nghiệp (Append-Only Audit Trail), chuẩn ISO-8601, mã băm sự kiện `logHash` SHA-256 chống chối bỏ, trực quan hóa timeline 7 bước DAG.
- **Hoàn Tất Tài Liệu Hóa Chuẩn SSOT 8 Phần Cho 3 Màn Hình Phân Hệ Quản Trị Hệ Thống (Subagent 10 - Admin & Infrastructure)**:
  - `ADMIN-01-dashboard.md` (ADM-01): Bảng điều khiển quản trị hạ tầng D1 & giám sát hệ thống, hợp nhất 4 chỉ số CSDL D1/R2, quản lý 46 bảng quan hệ SQLite, theo dõi sức khỏe cổng liên ngành (1022, iHanoi).
  - `ADMIN-02-users.md` (ADM-02): Quản trị danh bạ người dùng & ma trận phân quyền RBAC 5 cấp (`citizen`, `community`, `staff`, `contractor`, `executive`/`admin`), hỗ trợ đổi quyền tại chỗ tức thì (In-Place Role Switching) và chống leo thang đặc quyền.
  - `ADMIN-03-settings.md` (ADM-03): Cấu hình tham số quy chuẩn môi trường QCVN 05:2023/BTNMT, chính sách cam kết thời hạn giải quyết SLA 48h, Geofence $\le 50\text{m}$, trạng thái tích hợp cổng dịch vụ đô thị và động cơ tự động hóa Cron.
- **Hoàn Tất Tài Liệu Hóa Chuẩn SSOT 8 Phần Cho 3 Màn Hình Cốt Lõi Phân Hệ Staff**:
  - `STAFF-01-dashboard.md` (STF-01): Bàn làm việc cán bộ điều hành & tác nghiệp, 4 KPI động, cụm 3 cột tác nghiệp thông minh (~42% Việc cần làm, ~30% Cảnh báo mới, ~28% Hồ sơ gần đây), Zero Truncate, D1 dev.db SSOT.
  - `STAFF-07-monitoring.md` (STF-07): Ma trận giám sát & quan trắc bụi công trình thời gian thực, chuỗi thời gian 24h đối chiếu QCVN 05:2023, nhúng bản đồ GIS, danh sách trạm bất thường và bảng phân trang D1.
  - `STAFF-08-alerts.md` (STF-08): Trung tâm xử lý cảnh báo ô nhiễm bụi khẩn cấp, cơ chế mở hồ sơ kiểm tra 1-Click (Atomic SQLite Transaction), bảng 75% + 25% ưu tiên hôm nay, SafeImage minh chứng hiện trường.
- **Hoàn Tất Chiến Dịch Săn & Vá Lỗi Toàn Diện Qua 10 Subagent Chuyên Trách**:
  - Triệu tập 10 Subagent Fixer chạy song song, sửa dứt điểm **84 lỗi & bẫy rủi ro tiềm ẩn** (14 P0, 29 P1, 33 P2, 8 P3) trên 10 phân hệ nghiệp vụ.
  - **Core API & Data Normalization**: Tự động chuyển `options.data` sang `body`, mở rộng `normalizeList` unwrap an toàn mọi collection array, vá triệt để crash `users.filter`.
  - **Staff Workspace & Case UI**: Bổ sung null check `evidencePhotos`, `site.kpis`, cung cấp method `getSiteTelemetry`, `submitInspection`, dọn dẹp swallowed catches.
  - **Citizen & Youth Credits**: Vá crash tìm kiếm CLB `universityCode`, dọn cache tự động khi `QuotaExceededError`, chống biến ảnh PNG trong suốt thành nền đen, bỏ tọa độ GPS Hà Nội gán cứng.
  - **Contractor & CSR**: Vá hàm `calculateHaversineDistance` trả về `Infinity` khi tọa độ null/NaN, loại bỏ mock `success: true`, upload file `FormData` nhị phân thật.
  - **Executive & Legal Engine**: Bổ sung `ExecutiveService.getReportById`, sửa `sensitiveReceptors = []` truthy, escape regex so sánh toán học `< 100m` trong DOCX parser.
  - **GIS & Spatial Intelligence**: Chặn Null Island `(0,0)`, sửa lọc Bounding box qua kinh tuyến 180°, mask PII số điện thoại & fuzz tọa độ công khai, dọn mock drawer.
  - **Backend Staff & D1 SQL**: Khắc phục các câu truy vấn sai cột `c.deadline` $\rightarrow$ `c.slaDeadline`, bảo vệ PII thông tin liên hệ ban quản lý công trình.
  - **Backend Worker Routes & Schema**: Chuẩn hóa snake_case trên `audit_logs`, `draft_documents`, `evidences`, `contractor_explanations`.
  - **AI & Telemetry Engine**: Thêm `AbortSignal.timeout(10000)` chống treo worker, vá prompt injection XML `<user_query>`, sửa `Number(null) === 0` trong flatline detection.
  - **Security & DAG Engine**: Whitelist MIME types raster, CSP sandbox cho storage upload, từ chối unsigned JWT tại production, HMAC token nhà thầu, tối ưu N+1 batch queries trong automation cron sweep.
- **Hoàn Tất 100% Bộ 31 Màn Hình Đặc Tả Sản Phẩm Chuẩn Civic Tech & Nghiệp Vụ Việt Nam**:
  - Triệu tập 10 Subagent Chuyên gia viết lại toàn bộ 31 tài liệu màn hình trong `docs/product/screens/` + khởi tạo Master Index [`docs/product/screens/INDEX.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/screens/INDEX.md).
  - **Bối cảnh thực tế Việt Nam**: Địa bàn Hà Nội/TP.HCM (Vành đai 3, An Phú, Mễ Trì, Dịch Vọng Hậu...), các quy chuẩn **QCVN 05:2023/BTNMT**, **QCVN 18:2021/BXD**, chế tài xử phạt **Nghị định 45/2022/NĐ-CP**, thể thức hành chính in ấn A4 **Nghị định 30/2020/NĐ-CP**, liên kết Cổng 1022 & iHanoi, quy đổi 20h = 4.0 tín chỉ/ĐRL Đoàn - Hội, bảng linh kiện trạm đo 500k chợ Nhật Tảo/chợ Trời.
  - **Cấu trúc 8 phần chi tiết cho từng màn hình**: Screen Identity, Mục đích & Giá trị thực tế, User Journey & Step-by-Step Scenario, Wireframe ASCII trực quan, D1 Database Contract, Bảng nút bấm CTAs ($\ge 44\text{px}$), Quy chuẩn UI/UX & Responsive (Zero Glassmorphism), Edge Cases & Kiểm thử.
- **Sức khỏe Mã nguồn**:
  - `npm --prefix app run verify:quick`: **279/279 tests PASS 100%** (28 test files + 4 UI smoke tests, 2.6s).
  - `npm --prefix app run build`: **Vite build thành công 100%** (2.7s).

---

## 🧭 2. Quick SSOT Routing Matrix

| Phân hệ nghiệp vụ | File SSOT cốt lõi | Test mục tiêu (< 0.5s) |
|---|---|---|
| **Auth, Users & RBAC** | [`.agents/ssot/AUTH.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/AUTH.md) | `node --test app/tests/auth-user-management-audit.test.js` |
| **Ghi nhận Cộng đồng (Observation)** | [`.agents/ssot/DOMAIN.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DOMAIN.md) | `node --test app/tests/citizen-observation-lifecycle.test.js` |
| **Hồ sơ Vụ việc (Case 7 bước)** | [`.agents/ssot/WORKFLOWS.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/WORKFLOWS.md) | `node --test app/tests/case-enforcement-dag-7steps.test.js` |
| **Bản đồ GIS & Geofence** | [`.agents/ssot/MAP.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/MAP.md) | `node --test app/tests/spatial-intelligence-map.test.js` |
| **UI Tokens & Components** | [`.agents/ssot/UI.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/UI.md) | `node --test app/tests/design-system-tokens.test.js` |
| **Tín chỉ Thanh niên & QR** | [`.agents/ssot/DOMAIN.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DOMAIN.md) | `node --test app/tests/youth-credits.test.js` |
| **Điều hành Lãnh đạo (Executive)** | [`.agents/ssot/EXECUTIVE_OPS_SSOT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/EXECUTIVE_OPS_SSOT.md) | `node --test app/tests/executive-command-center.test.js` |
| **Nhà thầu (Contractor Workspace)** | [`.agents/ssot/CIVIC_HANDOFF_SSOT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/CIVIC_HANDOFF_SSOT.md) | `node --test app/tests/contractor-ui-workspace.test.js` |
| **API Backend & Edge Routes** | [`.agents/ssot/API.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/API.md) | `node --test app/tests/worker-full-edge-routes.test.js` |
| **D1 Schema & Database** | [`.agents/ssot/DATABASE.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DATABASE.md) | `node --test app/tests/d1-schema.test.js` |
| **Bẫy lỗi & Phòng ngừa** | [`.agents/BUG_MEMORY.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/BUG_MEMORY.md) | `node --test app/tests/dev-runtime-verification.test.js` |
