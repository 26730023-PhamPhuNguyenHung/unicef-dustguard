## 14. Spatial Map API, Zero Fake Coordinates & RBAC PII Sanitizer Invariants
- **Bối cảnh & Vấn đề**:
  - Trong các endpoint bản đồ (`/api/map`), dữ liệu tọa độ nếu thiếu từng bị fallback bằng công thức ảo (`21.0285 + idx * 0.006` hay `Math.sin(id.length)`), làm méo mó vị trí địa lý thực tế và vi phạm nguyên tắc SSOT.
  - Các endpoint phản ánh công khai (`GET /api/complaints`, `GET /api/map`) và công trình (`GET /api/sites/:id`) nếu không được phân tách ngữ cảnh xác thực (Staff vs Citizen) sẽ làm rò rỉ thông tin cá nhân (PII: `reporterName`, `reporterPhone`, `triageNote`, `managerPhone`, `managerEmail`).
  - Các thao tác quản trị cảm biến IoT (`POST/PUT/DELETE /api/sensors`) và hồ sơ nội bộ (`GET /api/cases`, `GET /api/inspections`) cần được bảo vệ nghiêm ngặt bằng RBAC.
- **Giải pháp Kiến trúc & Quy tắc Chuẩn hóa**:
  1. **Zero Fake Coordinates Policy**:
     - Mọi entity (Site, Sensor, Report) nếu không có tọa độ GPS thật trong database PHẢI trả về `lat: null, lng: null`. TUYỆT ĐỐI không bịa tọa độ hay dùng offset ngẫu nhiên.
     - Điểm nóng (Hotspots) trên bản đồ chỉ được tổng hợp từ các công trường có tọa độ GPS thật (`lat !== null && lng !== null`).
  2. **Role-Based PII Sanitization**:
     - Với người dùng Public / Citizen: `reporterName` và `triageNote` được chuyển thành `null`, `reporterPhone` được ẩn (masked `090****567` hoặc `null`). Số điện thoại và email của người quản lý công trường (`managerPhone`, `managerEmail`) và lịch sử kiểm tra nội bộ (`inspections`) bị ẩn đối với Citizen.
     - Với cán bộ Staff / Admin / Inspector / Nhà thầu quản lý: Cung cấp đầy đủ thông tin để phục vụ thanh tra, đối soát và xử lý vi phạm.
  3. **Strict RBAC Enforcement**:
     - Quản trị cảm biến (`POST /api/sensors`, `PUT /api/sensors/:id`, `DELETE /api/sensors/:id`): Chỉ cấp quyền cho `['admin', 'staff', 'executive', 'demo_admin', 'super_admin']`.
     - Hồ sơ vụ việc và biên bản thanh tra (`GET /api/cases`, `GET /api/inspections`): Chặn toàn bộ vai trò `citizen`, `volunteer`, `guest` (401 Unauthorized / 403 Forbidden).
  4. **Hono & Express Route Parity**:
     - Hono không hỗ trợ mảng đường dẫn `app.get([p1, p2])`, cần khai báo từng route tường minh (`app.get('/api/map', ...)`, `app.get('/api/spatial/features', ...)`).
     - Đồng bộ hóa 100% route và schema giữa Cloudflare Worker và Express Server.
  5. **Verification**: 100% test suites (51/51 tests) tại `worker-spatial-rbac-sanitizer.test.js` & `backend-rbac-security.test.js` và toàn bộ 25 test files trong `verify:quick` pass 100%.

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

## 12. Canonical Risk Domain Service & Zero-IoT Resilience Invariants
- **Bối cảnh & Vấn đề**:
  - Logic tính điểm ưu tiên và rủi ro môi trường từng bị phân mảnh giữa nhiều file (`dust-risk-engine.js`, `priorityScoreEngine.js`, `riskEngine.js`, `cpsService.js`) với các thang điểm và trọng số không đồng nhất.
  - Cần bảo đảm tính nhất quán SSOT: công thức 5 thành phần (Community 30%, Receptors 25%, Compliance 20%, History 15%, IoT Telemetry 10% Optional), cơ chế tự tái chuẩn hóa khi thiếu cảm biến (Zero-IoT Resilience), và thang điểm `RISK_BANDS` chuẩn.
- **Giải pháp Kiến trúc & Quy tắc Chuẩn hóa**:
  1. **Canonical Engine (`app/server/domain/risk/dust-risk-engine.js`)**:
     - Hợp nhất toàn bộ logic vào `DustRiskEngine` / `calculatePriorityScore`.
     - Phân định rõ ràng: Điểm ưu tiên can thiệp cộng đồng hỗ trợ ra quyết định, **không thay thế kết luận giám định tư pháp**.
  2. **Thang điểm SSOT `RISK_BANDS`**:
     - `CRITICAL`: 80 - 100 (Báo động đỏ / P1, SLA 24h, `#9f241f`)
     - `HIGH`: 65 - 79 (Ưu tiên cao / P2, SLA 48h, `#c4320a`)
     - `MEDIUM`: 40 - 64 (Cần theo dõi / P3, SLA 7 ngày, `#b54708`)
     - `LOW`: 0 - 39 (Bình thường / P4, SLA Định kỳ, `#0d6f64`)
     - `UNKNOWN`: -1 (Chưa xác định, P0, `#667085`)
  3. **Zero-IoT Dynamic Weight Re-normalization**:
     - Khi cảm biến vắng mặt (`hasSensor: false`), mất kết nối (`OFFLINE`/`INACTIVE`), hoặc lỗi tín hiệu (`FAULTY`/flatline), hệ thống loại trừ trọng số cảm biến (10%) và tái chuẩn hóa 4 thành phần còn lại trên tổng 90% trọng số khả dụng ($0.90 \rightarrow 1.0$), đảm bảo không phạt điểm oan khu vực chưa có trạm đo.
  4. **Dual Interface & Full Explainability**:
     - Trả về cấu trúc Hybrid `components` (vừa là Array 5 phần tử cho vòng lặp, vừa có named keys `components.community`, `components.exposure`, `components.compliance`, `components.history`, `components.sensor` cho destructuring).
     - Cung cấp `explainabilitySummary`, `reasons`, `recommendedActions`, `sensorHealth`, `confidence` score.
  5. **Verification**: 100% test suites (38/38 tests) tại 5 file test cốt lõi và toàn bộ 25 test files trong `verify:quick` pass 100%.

## 11. Executive Operations API & Telemetry Impact Grounding Invariants
- **Bối cảnh & Vấn đề**:
  - Các hàm thống kê điều hành tác nghiệp nếu thiếu liên kết chặt chẽ với cơ sở dữ liệu thật dễ sinh ra các công thức ảo (như tạo trend bằng `charCode` ký tự tên phường, hay hardcode số liệu Before/After PM2.5 giảm 61%).
  - SLA on-time rate nếu fallback giá trị giả định 94%-95% sẽ bóp méo tính minh bạch và năng lực giám sát thực tế của lãnh đạo.
- **Giải pháp Kiến trúc & Quy tắc Chuẩn hóa**:
  1. **Deterministic SLA On-Time Rate**:
     - SLA on-time rate tính toán chính xác trên tập các cases đã hoàn thành (`resolvedAt <= slaDeadline`). Trường hợp chưa có case nào hoàn thành hoặc không có deadline, trả về `100%` (hoặc `0%` nếu toàn bộ overdue) kèm số đếm rõ ràng, tuyệt đối không dùng số ngẫu nhiên hay fallback giả.
  2. **Real Telemetry Before / After Calculation (`sensor_readings`)**:
     - Đo lường thực tế giá trị PM2.5 trung bình 48h trước thời điểm hành động và 48h sau thời điểm hoàn thành từ bảng `sensor_readings`.
     - Phân loại 5 trạng thái minh bạch: `IMPROVED` (giảm $\ge 10\%$), `STABLE` (thay đổi trong $\pm 10\%$), `DETERIORATED` (tăng $> 10\%$), `NO_SENSOR_DATA` (không có trạm đo tại site), `INSUFFICIENT_POST_DATA` (chưa đủ dữ liệu quan trắc sau khi hoàn tất).
  3. **Live Inspector Load from D1 Auth**:
     - Danh sách thanh tra viên truy vấn trực tiếp từ bảng `users` JOIN `profiles` (`role = 'staff' | 'inspector'`), tính tải công việc thực tế (`activeCases`, `activeActions`, `completedActions`, `onTimeRatePct`).
  4. **Verification**: Toàn bộ 43/43 tests executive suite pass 100% và OpenAPI contract parity audit pass 100%.

## 10. Executive Operations Command Center & Decision-Centric Design Invariants
- **Bối cảnh & Vấn đề**:
  - Giao diện lãnh đạo thường mắc bẫy "dashboard 6 card trang trí / vanity metrics" với các biểu đồ thụ động, không giải đáp được các câu hỏi tác nghiệp cốt lõi và thiếu nút bấm ra quyết định thực tế.
  - Lãnh đạo cần nắm bắt tức thì tình hình thực địa, phát hiện điểm nóng khẩn cấp và ban hành chỉ đạo có giá trị pháp lý, được ghi nhận trực tiếp vào cơ sở dữ liệu hệ thống (Cloudflare D1 SQLite SSOT).
- **Giải pháp Kiến trúc & Chuẩn Hóa**:
  1. **5 Câu Hỏi Cốt Lõi Lãnh Đạo (Executive Mental Model)**:
     - Trả lời qua 6 Sections chuẩn hóa: (1) Situation Now (KPIs D1 thật, click drilldown); (2) Requires Decision (Hàng đợi P1/P2 khẩn, ký số, phân công); (3) Priority Map (GIS Spatial Policy & vùng nhạy cảm <200m); (4) SLA Matrix (Overdue, Due today, Unassigned, Waiting approval); (5) Operational Progress (Phễu 7 bước & Delta PM2.5 giảm -42%); (6) Recent Decisions (Nhật ký chỉ đạo D1 & mã băm SHA-256).
  2. **Direct D1 Actions & Thể Thức Pháp Lý**:
     - Tích hợp trực tiếp các lệnh chỉ đạo (`POST /api/executive/cases/:id/escalate`), điều động thanh tra viên (`POST /api/executive/cases/:id/assign`), và ký số văn bản 1-click Nghị định 30/2020/NĐ-CP (PIN `1234`) xuất quyết định A4 chuẩn quốc gia.
  3. **Verification**: 100% test suites (`executive-dashboard.test.js`, `executive-command-center.test.js`, `runtime-truth-executive-admin.test.js`) pass trong < 1s và Vite build thành công sạch sẽ.

## 09. Windows Node.js Child Process Spawning (`spawn EINVAL` Fix) & D1 Audit Filtering Optimization
- **Bối cảnh & Vấn đề**:
  - Khi chạy `npm run dev` trên môi trường Windows PowerShell, lệnh `node scripts/dev-runner.js` ném ra lỗi `[LỖI DEV RUNNER]: spawn EINVAL` và dừng đột ngột. Nguyên nhân do Node.js (từ các bản vá CVE-2024-27980) bắt buộc các tệp thực thi batch/cmd (`.cmd`, `.bat` như `npx.cmd`) khi gọi qua `spawn` phải có cờ `shell: true` trên Windows, nếu để `shell: false` Node.js sẽ từ chối thực thi với mã lỗi `EINVAL`.
  - Trong bộ lưu vết `audit.repository.js`, hàm `createAuditLog` chưa đưa `targetId` vào payload gốc khiến D1 SQLite không lưu `targetId` ở cột riêng, và `getAuditLogs` chưa đưa `entityId` vào mệnh đề `WHERE` SQL dẫn đến khi số lượng log lớn vượt quá trang 50 dòng thì các bản ghi mới bị phân trang bỏ sót.
- **Giải pháp Kiến trúc & Chuẩn Hóa**:
  1. **Cross-Platform Spawn Safety (`app/scripts/dev-runner.js`)**:
     - Thiết lập cờ `shell: isWin` (`process.platform === 'win32'`) cho cả tiến trình Worker (`wrangler dev`) và Client (`vite`), đảm bảo chạy mượt mà 100% trên Windows PowerShell lẫn macOS/Linux.
  2. **Audit Log Target Persistence & SQL Filtering (`app/server/repositories/audit.repository.js`)**:
     - Bổ sung `targetId: data.targetId || data.entityId || null` vào payload lưu D1 SQLite.
     - Bổ sung `where.OR = [{ targetId: entityId }, { details: { contains: entityId } }]` vào truy vấn SQL để D1 lọc trực tiếp ở tầng database.
  3. **Verification**: 100% test suites (71/71 files, 557 tests) đạt full pass trong < 18s và `npm run dev` khởi động hoàn hảo.

## 08. Contractor Workspace, Zero-Login Quick Submit & Geofence 50m Invariants
- **Bối cảnh & Vấn đề**:
  - Nhà thầu thi công xây dựng ngoài công trường thường không có sẵn máy tính hoặc tài khoản đăng nhập phức tạp. Cán bộ giám sát gửi lệnh yêu cầu dập bụi qua SMS hoặc Zalo kèm liên kết truy cập nhanh.
  - Cần bảo đảm 4 nguyên tắc bất biến: (1) Truy cập nhanh không cần đăng nhập nhưng vẫn an toàn bằng chữ ký HMAC 72 giờ (`/contractor/access/:token`); (2) Cách ly nghiêm ngặt công trình (Site Isolation) — Nhà thầu công trình A tuyệt đối không thể xem hay nộp thay cho công trình B (403 Forbidden); (3) Kiểm định tọa độ thực địa GPS Geofence trong bán kính 50m quanh tâm dự án; (4) Nhà thầu chỉ nộp minh chứng và chuyển trạng thái sang `PENDING_VERIFICATION` (CHỜ NGHIỆM THU), không thể tự đóng vụ việc (VERIFIED/CLOSED) mà phải do Cán bộ Thanh tra thẩm định.
- **Giải pháp Kiến trúc & Chuẩn Hóa**:
  1. **HMAC-signed Quick Token (`app/src/lib/contractor-token.js`)**:
     - Sinh token mã hóa `base64url(payload).hmac_sha256`, chứa `siteId`, `actionId`, `contractorPhone`, `expiresAt`, `nonce`.
     - Route `/contractor/access/:token` qua `ContractorPortal.jsx` xác thực chữ ký và load trực tiếp context công trình.
  2. **50m Geofence Buffer Matching**:
     - Dùng công thức Haversine tính khoảng cách $d$ mét giữa tọa độ thiết bị và tọa độ công trình.
     - Phân loại 3 mức: $\le 50$m (`VALID_50M_BUFFER` - Hợp lệ), $50$m-$100$m (`NEARBY_WARNING` - Cảnh báo), $>100$m (`OUT_OF_BOUNDS` - Ngoài ranh giới).
  3. **Before/After Evidence & Tamper-proof Hash**:
     - `ContractorEvidenceUpload.jsx` cung cấp luồng 3 bước: Xác nhận hạng mục kỹ thuật -> Tải ảnh Trước & Sau (After bắt buộc) băm mã SHA-256 niêm phong số -> Xác nhận gửi nghiệm thu.
  4. **Verification**: 100% tests (`runtime-truth-staff-contractor.test.js`, `backend-rbac-security.test.js`, `contractor-quick-submit.test.js`, `contractor-ui-workspace.test.js`) pass trong < 0.5s.

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

## 6. Executive Dashboard & Spatial Intelligence GIS Map Invariants
- **Executive KPIs Direct Calculation from D1**:
  * 100% các chỉ số điều hành (Chỉ số rủi ro, Số điểm nóng nguy cơ cao, Tỷ lệ tuân thủ SLA, Trạm cảm biến online, Tác động can thiệp giảm bụi, Hồ sơ chờ ký duyệt) bắt buộc tính toán trực tiếp từ các thực thể trong cơ sở dữ liệu D1 SQLite (`sites`, `cases`, `inspections`, `sensor_readings`, `complaints`, `documents`). Tuyệt đối không mock `setTimeout` hay hardcode số liệu ảo.
- **Ward-Level Spatial Intelligence SSOT (`HANOI_WARDS`)**:
  * Bản đồ nhiệt không gian địa lý (GIS Heatmap) và Ma trận Quyết định Rủi ro 2 Chiều (2D Risk Matrix) phân tích trực tiếp theo phân cấp cơ sở **Phường / Xã** (`HANOI_WARDS`), loại bỏ hoàn toàn cấp trung gian 'Quận/Huyện'.
  * Tọa độ fallback tính toán an toàn qua thuật toán hash tên phường, ngăn chặn triệt để nguy cơ crash bản đồ khi xuất hiện dữ liệu mới.
- **Zero Gray-Tile Leaflet Anti-Regression Pattern**:
  * Leaflet map containers khi render trong tabs, dynamic modals hoặc responsive layout bắt buộc tích hợp `ResizeObserver(container)` kết hợp chuỗi timer đa tầng (`80ms, 250ms, 600ms`) gọi `map.invalidateSize(true)` để đảm bảo mượt mà 100% trên cả Mobile (360-430px) lẫn Desktop, chống rớt layout hay ô xám bản đồ.
- **Ký Số Văn Bản Điện Tử Nghị Định 30/2020/NĐ-CP & SHA-256 64-Hex**:
  * Chữ ký số Lãnh đạo áp dụng chuẩn mật mã SHA-256 sinh mã băm 64 ký tự hex (`crypto.subtle.digest('SHA-256')`), lưu vết vĩnh viễn vào D1 `documents` và `case_timeline`, kích hoạt chuyển trạng thái Case DAG sang `COMPLETED` và đóng gói thành công chứng thư điện tử A4 có dấu mộc đỏ.

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

## 6. Ngôn Ngữ Thuần Việt Dễ Hiểu & Quy Tắc Tối Đa 3 Chữ (Max 3 Words SSOT)
- **Bối cảnh & Vấn đề**:
  - Việc đưa các từ ngữ viết tắt tiếng Anh hoặc thuật ngữ kỹ thuật (`SLA`, `telemetry`, `hash`, `D1/R2`, `risk engine`, `triage`, `sync`) hoặc các nhãn quá dài lên nút bấm, tiêu đề tab hay menu gây khó hiểu cho người dân, sinh viên và cán bộ cơ sở, đồng thời dễ làm vỡ layout/rớt chữ trên mobile.
  - Ví dụ: Nút bấm mang tên *"Cập nhật SLA"* hay *"Làm mới dữ liệu"* dài dòng, khó hiểu hơn *"Làm mới"*.
- **Quy Tắc Tối Thượng (Invariants — Max 3 Words)**:
  1. **Nút Bấm (Buttons — Tối đa 2 đến 3 chữ)**:
     - `Cập nhật SLA` / `Làm mới dữ liệu` ➔ **`Làm mới`** (2 chữ).
     - `Quét cảm biến thủ công` ➔ **`Quét cảm biến`** (3 chữ).
     - `Xuất Hồ sơ Trọn gói` ➔ **`Xuất hồ sơ`** / **`Xuất PDF`** (2 chữ).
     - `Phản ánh ô nhiễm môi trường` ➔ **`Gửi phản ánh`** (3 chữ).
     - `Bản đồ quanh tôi` ➔ **`Xem bản đồ`** (3 chữ).
  2. **Thanh Menu & Điều Hướng (Navigation & Tabs — Tối đa 1 đến 3 chữ)**:
     - `Giám sát SLA` ➔ **`Hạn khắc phục`** (3 chữ).
     - `Ma trận Rủi ro 2D` ➔ **`Ma trận`** (2 chữ).
     - `Phân tích văn bản pháp luật` ➔ **`Phân tích luật`** (3 chữ).
     - `Tra cứu căn cứ pháp lý` ➔ **`Tra cứu luật`** (3 chữ).
     - `Dựng hồ sơ vi phạm` ➔ **`Lập hồ sơ`** (3 chữ).
     - `Kiểm toán thiết bị` ➔ **`Thiết bị`** (2 chữ).
     - `Phân tích & Điểm nóng` ➔ **`Điểm nóng`** (2 chữ).
  3. **Kỹ Thuật Phòng Vệ Layout**:
     - 100% nút bấm, badge, tabs phải có `whitespace-nowrap shrink-0` và `min-h-[44px]` (hoặc `min-h-[40px]`).

## 7. Database Enum Conformance & Worker SSOT Invariants
- **Bối cảnh & Vấn đề**:
  - Khi triển khai backend Edge Worker song song với Express Controllers và DDD domain models, việc sử dụng các trạng thái tự phát (ví dụ: `status = 'SUBMITTED'` khi tạo complaint, hoặc `status = 'CLOSED'` khi xóa case) làm vi phạm State Machine DAG và gây lỗi trong DB Audit (`npm run audit:db`).
- **Quy Tắc Chuẩn Hóa & Giải Pháp**:
  1. **Canonical State Machines**:
     - `cases.status`: Bắt buộc tuân thủ 7-step lifecycle DAG từ `case.rules.js`: `SCREENING` (Step 1) -> `PREPARING` (Step 2) -> `DECISION_ISSUED` (Step 3) -> `ON_SITE` (Step 4) -> `REPORTING` (Step 5) -> `APPRAISING` (Step 6) -> `COMPLETED` (Step 7).
     - `complaints.status`: Tuân thủ `complaint.rules.js`: `PENDING`, `LINKED`, `PROCESSING`, `RESOLVED`, `REJECTED`, `INVESTIGATING`.
     - `actions.status`: `PENDING`, `IN_PROGRESS`, `PENDING_VERIFICATION`, `VERIFIED`, `RESOLVED`, `REJECTED`.
     - `alerts.status`: `PENDING`, `ACKNOWLEDGED`, `IN_PROGRESS`, `RESOLVED`, `EXPIRED`, `ACTIVE`, `TRIGGERED`.
  2. **Audit DB Script SSOT (`scripts/audit-db.js`)**: Luôn bao phủ đầy đủ tất cả các enum hợp lệ của Domain Rules để phát hiện sớm các vi phạm dữ liệu thực tế.
  3. **Zero Hardcoded Ad-hoc Enums**: Các endpoint tạo mới hoặc cập nhật trong `worker.js` và test seed files phải luôn dùng hằng số canonical (`PENDING`, `SCREENING`, `COMPLETED`).

## 8. LegalTech Rules-as-Code & Google-Docs-like Editor Invariants
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






