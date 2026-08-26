# LESSONS LEARNED

## 0. Cảm Biến Bụi Mịn ASAIR APM2000 (Aosong) & ESP32 NodeMCU-32S Hardware Integration SSOT
- **Triệu chứng & Rủi ro**:
  - Cảm biến bụi ASAIR APM2000 cắm vào bo ESP32 có quạt quay tốt (nguồn 5V và GND hoạt động), nhưng ESP32 không nhận được bất kỳ byte dữ liệu nào từ chân RX.
  - Các công cụ đọc mặc định đều dùng tốc độ `9600 baud` (vốn là chuẩn phổ biến của Plantower PMS5003 / Winsen ZH03B), dẫn đến việc gửi khung truy vấn bị lệch xung và không bắt được phản hồi từ cảm biến.
  - Việc cắm nhầm chân tín hiệu vào các chân Input-Only (`GPIO 34, 35, 36, 39`) khiến ESP32 không thể phát tín hiệu TX ra ngoài.
- **Khám phá Cốt Lõi từ Datasheet Chính Hãng Aosong & Giải Pháp**:
  1. **Tốc độ UART đặc thù là 1200 Baud (Bảng 4 - Trang 5 Datasheet)**:
     - Khác với hầu hết các cảm biến bụi khác, **APM2000 của ASAIR Aosong chạy ở tốc độ `1200 Baud` (8N1)**.
     - Cấu hình `HardwareSerial(2).begin(1200, SERIAL_8N1, RX_PIN, TX_PIN)` giúp bắt trọn gói tin phản hồi.
  2. **Sơ đồ chân vật lý chuẩn (NodeMCU-32S Ai-Thinker 38 pins)**:
     - Pin 1 (Đỏ - VCC): Cắm chân `5V` (dưới cùng bên phải).
     - Pin 2 (Đen - GND): Cắm chân `GND` (trên cùng bên trái).
     - Pin 3 (Xanh lá - SET): Cắm chân `3V3` (trên cùng bên phải) để kéo HIGH sang chế độ UART (hoặc để lơ lửng).
     - Pin 4 (Cam - RX cảm biến): Cắm chân `P17` (ESP32 TX2 / GPIO 17).
     - Pin 5 (Tím - TX cảm biến): Cắm chân `P16` (ESP32 RX2 / GPIO 16).
  3. **Giao thức Master-Query 11 Bytes**:
     - Lệnh gửi: `0xFE 0xA5 0x00 0x01 0xA6` (hoặc chu kỳ 1.2s).
     - Gói tin phản hồi: `FE A5 02 00 [DF11] [DF12] [DF21] [DF22] [DF31] [DF32] [CS]`.
     - Giải mã: $\text{PM1.0} = \text{DF11} \times 256 + \text{DF12}$, $\text{PM2.5} = \text{DF21} \times 256 + \text{DF22}$, $\text{PM10} = \text{DF31} \times 256 + \text{DF32}$.
     - Checksum: $\text{CS} = (\text{0xA5} + 0x02 + 0x00 + \text{DF11} + \dots + \text{DF32}) \ \& \ \text{0xFF}$.

## 1. D1 Persistence Invariant
- **Problem**: UI hiển thị lưu thành công nhưng sau khi F5 dữ liệu biến mất do chỉ lưu vào React local state.
- **Root Cause**: Thiếu bước đồng bộ API và xác nhận lưu thành công từ D1 database.
- **Fix & Prevention**: Mọi thao tác ghi (create/update) phải đợi API phản hồi thực thể đã được persist trong D1, sau đó revalidate data. Luôn có test kiểm tra reload persistence.

## 2. Zero-Mock in Business Critical Paths
- **Problem**: Mock data làm sai lệch logic thời gian thực và trạng thái vụ việc.
- **Fix & Prevention**: Dùng database cục bộ D1/SQLite với dữ liệu seed chuẩn xác, không dùng `setTimeout` giả lập trong luồng nghiệp vụ.

## 3. High-Contrast Civic Tech Styling
- **Problem**: Glassmorphism và nền mờ gây khó đọc trên thiết bị di động ngoài trời.
- **Fix & Prevention**: 100% sử dụng nền solid `#FDFBF7` và `#FFFFFF`, chữ mực `#231b14`, viền nét `#e5e0d8`, touch target >= 44px.

## 4. Multi-Environment Universal D1 Adapter (`getD1OrSqlite`)
- **Problem**: Khi chạy Edge Worker test hoặc Node.js verification scripts mà không có Miniflare inject `env.DB`, `envOrDb.DB` trả về `undefined`, dẫn đến các repository D1 trả về `null` (gây 404/500 giả định).
- **Root Cause**: Code repository chỉ phụ thuộc `env.DB.prepare` mà thiếu fallback adapter tương thích với `better-sqlite3` cục bộ.
- **Fix & Prevention**: Xây dựng `getD1OrSqlite(envOrDb)` trong `server/shared/db.js` bọc `better-sqlite3` với đầy đủ interface D1 (`.prepare().bind().first() / .all() / .run()`). Mọi query chạy cùng 1 câu lệnh SQL chuẩn D1 trên cả Cloudflare Worker Live lẫn Node.js testing.

## 5. Domain Schema Naming & Client Compatibility (snake_case vs camelCase)
- **Problem**: D1 SQLite lưu trữ cột theo chuẩn `snake_case` (`outcome_status`, `observation_id`, `recipient_unit`), trong khi frontend & API tests có thể đọc `camelCase`.
- **Fix & Prevention**: Repository luôn map kết quả trả về với cả 2 thuộc tính (hoặc camelCase alias) để tránh lỗi `undefined` ở tầng UI/Client.

## 6. Design Tokens & CSS Variables SSOT in Tailwind CSS v4
- **Problem**: Rải rác các giá trị màu hardcode (như `#FDFBF7`, `#231b14`, `#0d6f64`, status badges) hoặc dùng hiệu ứng `backdrop-blur` / `shadow-glass` làm giảm độ tương phản và vi phạm chuẩn SSOT Civic Tech.
- **Root Cause**: Thiếu khai báo tập trung semantic tokens trong `@theme` và tài liệu SSOT `UI.md`.
- **Fix & Prevention**: 
  - Khai báo đầy đủ palette trong `@theme` (`--color-bg-*`, `--color-text-*`, `--color-brand-*`, `--color-status-*`, `--shadow-soft`, `--shadow-elevation`, typography scale).
  - Đồng bộ chặt chẽ với `app/.agent/ssot/UI.md` và `src/design-system/tokens.ts`.
  - Tuyệt đối nghiêm cấm glassmorphism, thay thế bằng solid crisp civic shadows (`--shadow-soft`, `--shadow-elevation`, `--shadow-card`).
  - Viết unit test `tests/design-system-tokens.test.js` kiểm tra trực tiếp file `index.css` để bảo vệ chống regression.

## 7. Lossless Asset Sheet Extraction & Component Separation
- **Problem**: 
  - Khi khử nền ảnh từ asset sheets, áp dụng công thức chia ma trận alpha nhỏ toàn cục khiến mảng màu bên trong nhân vật (áo, mặt, thân nhà, màn hình) bị rỗng trong suốt và đường nét bị răng cưa nhiễu hạt gắt nét ("m sharp thế hư hết của t").
  - Xuất nhầm các UI element có text (nút bấm, logo chữ wordmark, metric chip) thành file ảnh bitmap tĩnh thay vì code component.
- **Root Cause**: 
  - Thiếu thuật toán khử nền liên thông viền (outer-connected floodfill).
  - Nhầm lẫn giữa visual illustrations / icons thuần túy với các dynamic UI components.
- **Fix & Prevention**:
  - **Thuật toán Alpha Matting Lossless**: Dùng connected component phân vùng từ 4 cạnh viền ngoài, chỉ khử nền tiếp giáp ngoài và giữ nguyên 100% độ đặc (alpha=255) cho lòng nhân vật / vật thể.
  - **Phân định rõ**: 
    - Minh họa, icon, pattern, wave, connector, badge thuần visual -> Lưu thành file ảnh độc lập `.webp` & `.png`.
## 8. Clean / Premium / Minimal Civic Tech Landing Page Aesthetics
- **Problem**: Các đường line connector màu đỏ chạy ngang đè/xuyên qua các step card, border bao quanh toàn bộ cụm card quá to, và các dải trang trí dashed lines/sparklines/waveforms/mini bar charts ở đáy card gây rối mắt, tạo cảm giác prototype thiếu chuyên nghiệp thay vì production-grade civic tech.
- **Root Cause**: Lạm dụng pseudo-elements (`::before`, `::after`) để vẽ viền khung to và nối đường timeline cứng, kết hợp chèn SVG mock sparkline vào đáy metric cards.
- **Fix & Prevention**:
  - **5-Step Flow Cards**: Mỗi card đứng độc lập với border rất nhẹ (`1px solid rgba(120, 60, 50, 0.10)`), shadow mềm, số thứ tự tròn phía trên card (`.number`), khoảng cách đều (`gap: 12px-16px`), không dùng đường nối xuyên card hay border lớn bao quanh.
  - **Metric Cards**: Dọn sạch toàn bộ dải dashed line, waveform sparkline, node timeline giả và mini bar chart. Giữ card tinh giản đúng 4 thành phần: icon, con số lớn (`<strong>`), label (`<span>`), mô tả ngắn (`<p>`).
  - **Responsive & Invariants**: Đồng nhất chiều cao card trên cùng một hàng (grid `align-items: stretch`), loại bỏ pseudo-elements bleeding khi co giãn màn hình.

## 9. ESP32 + APM2000 Embedded Firmware & HMAC Integrity
- **Problem**: Firmware IoT ngoài thực địa gặp nguy cơ mất kết nối Wi-Fi ngắt quãng, dữ liệu cảm biến bụi có nhiễu quang học (jitter/spikes), và nguy cơ giả mạo telemetry hoặc tấn công Replay Attack.
- **Root Cause**: Thiếu bộ lọc trung bình trượt (rolling average), quản lý RAM động (`malloc`/`String` concatenation) gây phân mảnh heap, và không có cơ chế ký số phân tán.
- **Fix & Prevention**:
  - **APM2000 Protocol**: UART2 9600 Baud 8N1, gửi query frame `0xFE 0xA5 0x00 0x01 0xA6`, parse `PM1.0`, `PM2.5`, `PM10` qua high-low bytes, kiểm tra checksum `(sum of 10 bytes) & 0xFF`, kết hợp bộ lọc trượt 5 mẫu và chặn giá trị ngoài khoảng (0 - 2500 µg/m³).
  - **Memory Stability**: Zero dynamic memory allocation trong main loop, dùng buffer tĩnh (`StaticJsonDocument`, fixed arrays, snprintf), Ring Buffer 20 bản ghi cho offline resilience.
  - **HMAC-SHA256**: Sử dụng `mbedtls` phần cứng trên ESP32 ký chuỗi chuẩn hóa `sensorCode:pm10:pm25:timestamp`, đồng bộ thời gian UTC qua NTP (`pool.ntp.org`).
  - **Exponential Backoff**: Tự động tăng độ trễ retry khi upload API lỗi (5s -> 10s -> 20s -> 60s) và tự phục hồi kết nối Wi-Fi mà không reset vi điều khiển.

## 10. Cloudflare Cost Guardrails, Bounded Queries & Zero Aggressive Polling
- **Problem**: Nguy cơ khuếch đại chi phí Cloudflare (Cost Amplification Attack hoặc run-away bills) do: truy vấn `SELECT *` không có `LIMIT` trên bảng lớn, tải tệp R2 không giới hạn kích thước, UI polling chu kỳ ngắn (< 15s) gây bão request lên D1, hoặc kích hoạt các dịch vụ đắt tiền (Durable Objects, Cloudflare Queues, Vectorize).
- **Root Cause**: Thiếu quy chuẩn trần cứng ở cả tầng cấu hình Worker (`wrangler.jsonc`), tầng truy vấn cơ sở dữ liệu (`LIMIT/OFFSET`), và tầng chu kỳ vòng lặp frontend.
- **Fix & Prevention**:
  - **Topology Chuẩn Hóa**: Chỉ sử dụng `Workers + D1 + R2 + Static Assets + Cron Triggers (<= 1h)`. Tuyệt đối cấm Durable Objects, Cloudflare Queues, Vectorize, Workflows theo nguyên tắc Deny by Default.
  - **Bounded Pagination**: Mọi collection endpoint (`/api/sites`, `/api/complaints`, `/api/cases`, `/api/actions`, `/api/inspections`, `/api/sensors`, `/api/users`) bắt buộc dùng hàm `parsePaginationParams` với `limit` mặc định 50, tối đa trần cứng 100 bản ghi.
  - **R2 Upload Safety**: Giới hạn tối đa 5MB (`MAX_UPLOAD_SIZE_BYTES = 5242880`), chặn MIME không hợp lệ (trả về 400/413), ghi thẳng metadata vào D1 và truy xuất trực tiếp bằng key (cấm `bucket.list()`).
  - **Frontend De-amplification**: Cấm polling < 15 giây. Dashboard điều hành và kiểm toán nhà thầu nâng chu kỳ lên >= 30 giây.
  - **Tự Động Hóa Kiểm Thử**: Viết test suite `app/tests/cloudflare-cost-guardrail.test.js` để tự động kiểm tra toàn bộ 42 quy tắc và ngăn ngừa mọi nguy cơ regression chi phí.
## 11. Contractor Workspace Domain Architecture & State Machine Security Invariants
- **Problem**: Nhà thầu có nguy cơ truy cập dữ liệu công trình của đơn vị khác (vi phạm Tenant Boundary), hoặc tự ý chuyển trạng thái vi phạm sang `VERIFIED` hay `CLOSED` nhằm trốn tránh trách nhiệm thanh tra, hoặc thiếu bằng chứng khi nộp thẩm định.
- **Root Cause**: Thiếu lớp phân quyền chặt chẽ ở tầng Domain Service (chỉ filter ở frontend) và thiếu state machine validation bắt buộc role inspector/admin cho các trạng thái kết thúc.
- **Fix & Prevention**:
  - **Tenant Boundary Isolation**: Mọi truy cập vào Site/Action/Project/Telemetry/Evidence đều phải qua `assertSiteAccess(siteId, user)` dựa trên bảng phân quyền, email/phone người quản lý hoặc `contractorName`. Chặn ngay với mã lỗi 403 Forbidden nếu không thuộc quyền.
  - **Strict State Machine Lifecycle**: Vòng đời trạng thái hữu hạn `PENDING/OPEN` -> `ACKNOWLEDGED` -> `IN_PROGRESS` -> `PENDING_VERIFICATION (UNDER_REVIEW)`. Nhà thầu **TUYỆT ĐỐI KHÔNG** được có quyền gán `VERIFIED` hay `CLOSED`. Cố tình gửi sẽ bị ném lỗi 403 Forbidden.
  - **Required Evidence Enforcement**: Khi chuyển sang `PENDING_VERIFICATION`, bắt buộc phải có minh chứng tệp tin đính kèm hoặc URL hợp lệ và lời giải trình (>= 5 ký tự).
  - **50m Geofence Buffer Matching**: Tự động xác thực tọa độ GPS của người gửi với tọa độ công trình qua công thức Haversine để gắn nhãn `VALID_50M_BUFFER`, `NEARBY_WARNING`, hoặc `OUT_OF_BOUNDS`.
  - **Explainable 0-100 Risk Score**: Chuẩn hóa điểm rủi ro gồm 4 factors độc lập (Bụi/môi trường max 35, Vi phạm tồn đọng max 30, Phản ánh cộng đồng max 20, Quá hạn SLA max 15) có tooltip và diễn giải minh bạch, loại bỏ toàn bộ gauge giả lập.

## 12. Auth & User Management Security Invariants (Worker vs Express Parity)
- **Problem**: 
  - Khác biệt định tuyến giữa Cloudflare Worker và Express (thiếu các alias `/api/login`, `/api/register`, `/api/me`, `/api/logout`, `/api/providers`, `/api/v1/*`).
  - Worker runtime thiếu phân quyền RBAC trên `/api/users` (trả về toàn bộ danh sách cho client ẩn danh) và `/api/users/:id/profile` (cho phép bất kỳ ai sửa profile của người khác mà không kiểm tra quyền sở hữu hay admin).
  - Worker runtime thiếu mã hóa và đối soát mật khẩu với bảng `account` trên D1 khi đăng ký/đăng nhập cục bộ, dẫn đến nguy cơ bypass authentication nếu tài khoản đã tồn tại trong D1.
  - Express thiếu endpoint `PUT /api/users/:id/role`.
- **Root Cause**: Backend được phát triển song song trên cả hai runtime (Cloudflare Worker Hono Edge và Node.js Express) mà thiếu bộ kiểm toán đối chiếu 1-1 và thiếu guard RBAC đồng bộ.
- **Fix & Prevention**:
  - **100% Endpoint & Alias Parity**: Cung cấp đầy đủ các route `/api/auth/*` và alias trực tiếp `/api/login`, `/api/register`, `/api/me`, `/api/logout`, `/api/providers` trên cả Worker và Express.
  - **Strict RBAC Guards**:
    - `GET /api/users`: Bắt buộc `requireAuth` + `admin` role (trả 401 nếu chưa đăng nhập, 403 nếu là citizen/staff thông thường).
    - `GET /api/users/:id` & `PUT /api/users/:id/profile`: Bắt buộc `requireAuth` + xác thực quyền sở hữu (`user.id === id || isAdmin`), chống tấn công leo thang ngang (Horizontal Privilege Escalation).
    - `PUT /api/users/:id/role`: Bắt buộc `requireAuth` + `admin` role, kiểm tra enum vai trò nghiêm ngặt, chống tấn công leo thang dọc (Vertical Privilege Escalation).
  - **D1 Database Persistence & Password Hashing**:
    - Khi đăng ký (`handleRegister`), tự động hash mật khẩu an toàn và lưu vào bảng `account` (với `providerId = 'credential'`), đồng thời tạo bản ghi trong `users` và `profiles`.
    - Khi đăng nhập (`handleLogin`), đối chiếu hash mật khẩu với bảng `account`, kiểm tra trạng thái tài khoản (`status !== 'DISABLED'`), tạo session token và cấp cookie an toàn (`HttpOnly`, `SameSite=Lax`, `Secure` khi https/production).
  - **Automated Verification Suite**: Viết và duy trì bộ kiểm thử tự động `app/tests/auth-user-management-audit.test.js` xác nhận 15/15 kịch bản bảo mật và đối chiếu hợp đồng API.

## 13. Youth-First Customer Journey & Production Roadmap Integration
- **Problem**: Giao diện hành động môi trường cho thanh niên có nguy cơ bị biến thành form nhập liệu hành chính nặng nề, thiếu tính tương tác thực chất, số liệu bị hardcode hoặc thiếu cơ chế ghi nhận minh chứng có giá trị pháp quy cho sinh viên/tình nguyện viên.
- **Root Cause**: Thiếu phân loại rạch ròi giữa các tính năng cốt lõi (Core loop), tính năng tăng trưởng & giữ chân (Retention), và quản trị tổ chức CLB/nhà trường; thiếu cơ chế xuất giấy chứng nhận theo chuẩn thể thức văn bản hành chính Việt Nam.
- **Fix & Prevention**:
  - **Ma Trận Phân Loại 5 Cấp**: P0 (Core Loop GPS + SHA-256 + Case DAG), P1 (Retention Task +20pts + Re-check 24-48h + 3-Level Impact), P2 (Org A4 Cert NĐ 30/2020 + Leaderboard + 4.0 TC), P3 (AI Vision Low-light + Heatmap), REMOVE (Fake SLA 96.5%, Mock timers, Dead buttons).
  - **Chuẩn Hóa Bộ 4 Component Thanh Niên**: `CommunityHome.jsx`, `CommunityActions.jsx`, `CommunityImpact.jsx`, `CommunityNavigation.jsx` tuân thủ nghiêm ngặt chuẩn Civic Tech, không glassmorphism, tương phản cao, touch target >= 44px, chống tràn viền trên mobile.
  - **Tài Liệu Kiểm Toán SSOT & Verification Gates**: Tạo `docs/AUDIT_CUSTOMER_JOURNEY_YOUTH_FIRST.md`, bảo đảm 100% pass trên 67 test files và 523+ tests.

## 14. Community Experience & 5-Second Actionable Hierarchy (Core Civic Loop)
- **Problem**: Người dùng truy cập Community Hub bị choáng ngợp bởi thông tin chung chung, không trả lời nhanh được việc cụ thể có thể làm quanh mình, thiếu phân cấp thông tin rõ ràng cho nhiệm vụ thực địa và nhầm lẫn giữa điểm rèn luyện với tác động môi trường thực tế.
- **Root Cause**: Giao diện thiếu cấu trúc định hướng hành động (Action-Oriented Hierarchy) và thiếu sự liên kết xuyên suốt trong luồng Civic Loop.
- **Fix & Prevention**:
  - **Chu trình Civic Loop 5 Bước**: `VẤN ĐỀ THẬT -> VIỆC CÓ THỂ LÀM -> NGƯỜI THAM GIA -> BẰNG CHỨNG SỐ -> TÁC ĐỘNG ĐO ĐƯỢC` được hiển thị trực quan xuyên suốt.
  - **Quy tắc 5 Giây trên Community Home (`/community`)**: Trong 5 giây trả lời trọn vẹn 4 câu hỏi:
    1. *Có vấn đề gì gần tôi?* (Điểm nóng lân cận kèm khoảng cách GPS, mức độ khẩn cấp, số phản ánh mở).
    2. *Tôi có thể giúp việc gì?* (Nhiệm vụ thực địa có thể nhận ngay kèm điểm rèn luyện).
    3. *Hoạt động nào sắp diễn ra?* (Chiến dịch học đường & tuần tra 300m quanh trường học).
    4. *Việc tôi làm đã tạo tác động gì?* (Bảng tác động thực tế: Số hoạt động, Bằng chứng xác minh, Điểm nóng dẹp bỏ, Giờ thực địa).
  - **Chuẩn Hierarchy Mission & Action Cards**: Bắt buộc tuân theo: `WHAT -> WHERE -> WHEN -> WHY IT MATTERS -> PARTICIPANTS -> ACTION`.
  - **Tách biệt Đo Lường Tác Động & Tín Chỉ Hỗ Trợ**: Đo lường tác động thực tế (Hoạt động, Bằng chứng SHA-256, Điểm nóng dẹp sạch) là Core Layer; Điểm rèn luyện / Tín chỉ Thanh niên (20h = 4.0 tín chỉ, chứng nhận A4) là Supporting Layer.

## 15. Information Architecture & 5-Persona Route Normalization SSOT
- **Problem**: Các đường dẫn bị phân mảnh hoặc chồng lấn khái niệm (`/reports` vs `/report` vs `/complaints`, `/actions` vs `/missions`, `/discover` vs `/groups`, `/field` vs `/inspections`, `/evidence` vs `/cases`), gây dead screens khi người dùng gõ URL trực tiếp hoặc chuyển đổi giữa các vai trò (Citizen, Community, Staff, Executive, Admin, Contractor).
- **Root Cause**: Thiếu lớp Alias Routing chuẩn hóa theo Mental Model của từng vai trò người dùng trong `App.jsx` và thiếu sự đồng bộ với `mode-switch-model.js` và `rbac-rules.js`.
- **Fix & Prevention**:
  - **Chuẩn hóa 5 Mental Models + Contractor Workspace**:
    1. *Citizen*: `/citizen`, `/citizen/report/new`, `/citizen/reports`, `/citizen/reports/:id`, `/citizen/map`, `/citizen/nearby`, `/citizen/profile`.
    2. *Community*: `/community`, `/community/missions`, `/community/missions/:id`, `/community/my-activities`, `/community/impact`, `/community/groups`, `/community/observe`, `/community/cases`, `/community/cases/:caseId`.
    3. *Staff*: `/staff`, `/staff/dashboard`, `/staff/reports`, `/staff/reports/:id`, `/staff/field`, `/staff/monitoring`, `/staff/evidence`, `/staff/operations`, `/staff/cases`, `/staff/sites`, `/staff/documents`, `/staff/settings`.
    4. *Executive*: `/executive`, `/executive/dashboard`, `/executive/overview`, `/executive/areas`, `/executive/heatmap`, `/executive/risks`, `/executive/sla`, `/executive/reports`.
    5. *Admin*: `/admin`, `/admin/users`, `/admin/sites`, `/admin/system`, `/admin/data-management`.
    6. *Contractor*: `/contractor`, `/contractor/actions`, `/contractor/actions/:actionId`, `/contractor/projects`, `/contractor/evidence`, `/contractor/notifications`, `/contractor/access/:token`.
  - **Zero-Dead-Route & Semantic Aliasing**: Tất cả các đường dẫn tương đương được alias sạch sẽ qua React Router, triệt tiêu 100% dead screens mà vẫn duy trì tính tương thích ngược với toàn bộ 523+ tests và các bookmark cũ.
  - **Tương phản cao Civic Tech**: Điều hướng sidebar, bottom navigation và topbar tuân thủ triệt để không glassmorphism, tương phản cao trên nền `#FDFBF7` và `#FFFFFF`, touch target >= 44px trên mobile.

## 16. UI/UX Rebuild & Emotional Civic Tech Visual Invariants
- **Tách biệt Ngôn ngữ Code và Ngôn ngữ Giao diện**: Tuyệt đối không để thuật ngữ kỹ thuật, tên cơ sở dữ liệu (`D1`, `R2`), thuật toán (`HMAC`, `SHA-256`, `telemetry`, `risk engine`, `UNVERIFIED_SIGNAL`) hiển thị thô ráp trước mắt người dân và cán bộ nhà nước. Giao diện phải dùng ngôn ngữ hành chính, dân sinh gần gũi, dễ hiểu (`Dữ liệu đo đạc thực địa`, `Mã niêm phong số`, `Minh chứng hiện trường`, `Mức độ ưu tiên`).
- **Button Copy Hướng Hành Động (Action-Oriented Verbs)**: Không dùng các nhãn nút vô thưởng vô phạt như "Submit", "Action", "Proceed", "OK". Nút bấm phải mô tả chính xác hành vi sắp diễn ra: *"Gửi phản ánh ngay"*, *"Bổ sung ảnh hiện trường"*, *"Xem chi tiết tiến độ"*, *"Xác nhận nộp minh chứng"*, *"Phê duyệt & Đóng vụ việc"*.
- **Empty State & Error Message Định Hướng Hành Động**: Không để trạng thái rỗng "No data" hay thông báo lỗi "Something went wrong". Bắt buộc phải có: (1) Nguyên nhân dễ hiểu + (2) Hành động tiếp theo cụ thể.
- **Dual-View Table Pattern (Desktop Table & Mobile Cards)**: Trên các bảng dữ liệu quản trị, không cố gắng nhồi nhét bảng nhiều cột trên màn hình hẹp (< 768px). Triển khai kiến trúc 2 tầng: Desktop Table (`hidden md:block`) & Mobile Cards (`md:hidden flex flex-col gap-3`).
- **Safe Area Inset Padding**: Cố định Bottom Navigation cho Citizen & Community luôn tích hợp `pb-[max(0.5rem,env(safe-area-inset-bottom))]` hoặc `@utility pb-safe` để tránh bị che bởi thanh điều hướng cử chỉ trên iOS/Android.

## 18. Ngôn Ngữ Thuần Việt Dễ Hiểu & Cấm Thuật Ngữ Kỹ Thuật / Jargon (Plain Civic Language SSOT)
- **Bối cảnh & Vấn đề**:
  - Việc đưa các từ ngữ viết tắt tiếng Anh hoặc thuật ngữ kỹ thuật (`SLA`, `telemetry`, `hash`, `D1/R2`, `risk engine`, `triage`, `sync`) lên nút bấm, tiêu đề tab hay menu gây khó hiểu cho người dân, sinh viên tình nguyện và cán bộ điều hành cấp cơ sở.
  - Ví dụ: Nút bấm mang tên *"Cập nhật SLA"* gây mơ hồ về mặt hành vi so với *"Làm mới dữ liệu"* hoặc *"Cập nhật tiến độ"*.
- **Quy Tắc Tối Thượng (Invariants)**:
  1. **Nút Bấm (Buttons)**: Phải dùng động từ thuần Việt, rõ ràng hành vi tiếp theo:
     - `Cập nhật SLA` ➔ **`Làm mới dữ liệu`** / **`Cập nhật tiến độ`**.
     - `Trigger scan` ➔ **`Quét cảm biến`**.
     - `Export Dossier` ➔ **`Xuất hồ sơ A4`** / **`Xuất PDF`**.
     - `Submit` ➔ **`Gửi phản ánh`** / **`Nộp minh chứng`**.
  2. **Thanh Menu & Điều Hướng (Navigation & Tabs)**: Dùng từ ngữ nghiệp vụ dân sinh, trực diện:
     - `Giám sát SLA` ➔ **`Hạn khắc phục`** / **`Thời hạn xử lý`** (24h/48h).
     - `Kiểm toán thiết bị` ➔ **`Thiết bị`**.
     - `Phân tích & Điểm nóng` ➔ **`Điểm nóng`**.
     - `Phân tích văn bản pháp luật` ➔ **`Phân tích văn bản`**.
  3. **Ngắn Gọn & Chống Rớt Chữ (Compact & Anti-Orphan)**:
     - Tên nút tối đa 2-3 từ, luôn gắn `whitespace-nowrap shrink-0` và `min-h-[44px]` (hoặc `min-h-[40px]`).
     - Không dùng từ ngữ đa tầng trừu tượng làm dài dòng giao diện.


