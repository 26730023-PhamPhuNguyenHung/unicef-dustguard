# CLOUDFLARE INFRASTRUCTURE COST & ARCHITECTURE GUARDRAILS (SSOT)
**SSOT Version:** 2.0.0 (Full 42-Rule Compliance Specification)  
**Target Environment:** Cloudflare Edge (Workers, D1, R2, Workers Assets / CDN, Cache API)  
**Budget Objective:** Scale-to-Zero, Serverless, Predictable Cost Bounded for 10,000+ Active Users.  
**Cost Thresholds:** Target ≤ $25/tháng | Cảnh báo (Warning) = $75/tháng | Đánh giá nghiêm ngặt (Hard Review) = $150/tháng.

---

> ### NGUYÊN TẮC TỐI THƯỢNG (PRIME INVARIANT)
> **GIỮ HỆ THỐNG ĐƠN GIẢN, SERVERLESS, SCALE-TO-ZERO, GIỚI HẠN CHI PHÍ VÀ AN TOÀN CHO ÍT NHẤT 10,000 NGƯỜI DÙNG HOẠT ĐỘNG.**  
> Hệ thống **TUYỆT ĐỐI KHÔNG** đưa vào các hạ tầng có chi phí tăng trưởng không kiểm soát theo: số kết nối đồng thời, thời gian thực thi (wall-clock time), tiến trình ngầm (background workers), vòng đời kết nối WebSocket, polling tần suất cao, quét toàn bảng database (table scans), suy luận AI, ghi theo từng request, hoặc khối lượng log/telemetry không giới hạn. An toàn chi phí là **YÊU CẦU KIẾN TRÚC CỨNG (HARD REQUIREMENT)**, không phải là việc tối ưu sau này.

---

## 1. DEFAULT APPROVED ARCHITECTURE (Kiến Trúc Mặc Định Được Phê Duyệt)
Mọi tính năng trong DustGuard VN phải tuân thủ nghiêm ngặt mô hình kiến trúc tối giản:
```text
Client (Web SPA / Mobile PWA / IoT ESP32)
   │
   ├──► Cloudflare CDN / Static Assets (Cache-First, Zero Compute)
   │
   └──► Cloudflare Worker (Hono Edge Engine - Scale-to-Zero)
           │
           ├──► Cloudflare D1 (Dữ liệu quan hệ, Trạng thái nghiệp vụ có Index)
           │
           ├──► Cloudflare R2 (Ảnh minh chứng, PDF, Tệp xuất, Tệp nhị phân bất biến)
           │
           └──► Cloudflare Workers Cache API (Cache phản hồi tĩnh/bán tĩnh)
```
- **Approved (Được phép mặc định):** Workers, D1, R2, Static Assets, Cache API, Cron Trigger (chỉ khi có nghiệp vụ định kỳ thực sự cần thiết, tối đa 1h/lần).
- **Deny by default (Cấm mặc định):** Durable Objects, Workers AI, Vectorize, Cloudflare Queues, Workflows, Pipelines, Browser Rendering, Dynamic Workers, Stream, các dịch vụ SaaS trả phí bên ngoài.
- Kiến trúc phải luôn "nhàm chán" (boring) và dự đoán được (predictable). Không thêm dịch vụ chỉ vì nó tồn tại trên Cloudflare.

---

## 2. COST SAFETY PRIORITY & WORST-CASE ANALYSIS (Ưu Tiên An Toàn Chi Phí)
Khi lựa chọn giữa 2 giải pháp kỹ thuật, bắt buộc chọn giải pháp có:
1. Số lượng thao tác tính phí (billable operations) ít hơn.
2. Ít thành phần chuyển động (moving components) hơn.
3. Hành vi Scale-to-zero thực sự (không tính tiền khi không có request).
4. Thời gian thực thi có chặn trên (bounded execution time).
5. Giới hạn phân tán (bounded fan-out).
6. Truy cập database có dự đoán (predictable queries).
7. Hạn ngạch rõ ràng (explicit quotas).
8. Dễ dàng quan sát và dọn dẹp dữ liệu (data retention/deletion).
9. Hóa đơn kịch bản xấu nhất (worst-case bill) thấp nhất.

**Phân tích kịch bản xấu nhất (Worst Reasonable Case):**  
10,000 người dùng × 100 hành động/ngày không đơn thuần là 10,000 người dùng. Nếu 1 request phân tán thành 5 truy vấn D1 + 3 dịch vụ ngoài + retry 3 lần + telemetry, khối lượng thao tác sẽ bị nhân lên hàng triệu lần. Phải triệt tiêu khuếch đại này ở cấp độ kiến trúc.

---

## 3. DURABLE OBJECTS — DENY BY DEFAULT (Cấm Mặc Định Durable Objects)
Tuyệt đối không tạo DO classes, DO namespaces, DO-based sessions, DO counters, DO rate limiting, DO presence, DO notification systems, DO job orchestration, DO WebSockets, hoặc DO alarms trừ khi có phê duyệt ngoại lệ (Durable Object Exception Review).
- **Phương án thay thế chuẩn:**
  - Counter: Thao tác nguyên tử trên D1 (`UPDATE ... SET count = count + 1`).
  - Session: Stateless JWT / Token ký mật mã + kiểm tra D1 khi cần.
  - State / Cache: Cloudflare Cache API hoặc D1.
  - File coordination: D1 metadata + R2 exact key lookup.

---

## 4. WORKERS AI — DENY BY DEFAULT (Cấm Tự Động Hóa AI Vô Tội Vạ)
Cấm gọi Workers AI tự động từ: mọi lượt tải trang, mọi API request, ingestion telemetry, search-as-you-type, dashboard refresh, cron loops, hoặc IoT sensor ingestion.
- **Quy định bắt buộc cho tính năng AI:**
  - Phải có yêu cầu nghiệp vụ rõ ràng, xác thực caller, quota theo user và toàn cục, rate limit, giới hạn token đầu vào, timeout, cache kết quả, chống trùng lặp request, kill switch (`ENABLE_AI=false`), và theo dõi ngân sách.
  - **Ưu tiên:** Deterministic Code (Code tất định) → SQL → Rules Engine → Cached Computation trước khi nghĩ tới AI inference.
  - Không bao giờ dùng AI cho việc mà code tất định có thể xử lý tin cậy (ví dụ: tính toán Risk Score, phân loại vi phạm theo quy chuẩn).

---

## 5. D1 DATABASE GUARDRAILS (Rào Chắn Truy Vấn D1)
D1 là Single Source of Truth (SSOT) cho dữ liệu quan hệ, nhưng không phải tài nguyên vô hạn.
- **Quy tắc bắt buộc:**
  - Bắt buộc kiểm tra `EXPLAIN QUERY PLAN` cho mọi câu truy vấn trên các bảng lớn/tăng trưởng.
  - Cấm `SELECT *` không có `LIMIT` trên các bảng tăng trưởng (`complaints`, `cases`, `observations`, `audit_events`, `sensor_readings`).
  - Tránh `WHERE lower(column) = ...` làm mất tác dụng của Index.
  - Tránh query bảng lớn từ dashboard với chu kỳ vài giây.
  - Triệt tiêu lỗi N+1 queries (không query riêng lẻ trong vòng lặp `for`/`map`).
  - Không ghi đè các bản ghi không thay đổi.
  - Tuyệt đối không dùng D1 làm kho lưu trữ log sự kiện chi tiết (append-everything analytics).

---

## 6. D1 INDEX POLICY (Chính Sách Lập Chỉ Mục D1)
- Bất kỳ trường nào thường xuyên dùng trong `WHERE`, `JOIN`, `ORDER BY`, Foreign Key lookup, lọc tenant/ward, trạng thái (status), hoặc khoảng thời gian (timestamp) đều phải được đánh index.
- **Các mẫu Compound Index chuẩn trong DustGuard VN:**
  - `idx_sites_status_risk`: `(status, dustRiskScore DESC)`
  - `idx_complaints_status`: `(status, createdAt DESC)`
  - `idx_cases_status_created`: `(status, createdAt DESC)`
  - `idx_readings_sensor_time`: `(sensorId, timestamp DESC)`
  - `idx_audit_events_agg`: `(aggregate_type, aggregate_id, created_at DESC)`
- Mọi endpoint có lưu lượng cao phải ghi rõ: `Rows Returned`, `Rows Read`, `Index Name`, và `Calls/Day`. Nếu trả về 10 dòng mà quét 500,000 dòng thì đó là lỗi nghiêm trọng (production defect).

---

## 7. PAGINATION IS MANDATORY (Bắt Buộc Phân Trang Có Chặn Trên)
- Cấm toàn bộ các endpoint trả về danh sách không giới hạn (ví dụ: `GET /api/sites` trả về toàn bộ DB).
- Mọi collection phải hỗ trợ `limit` và `offset` (hoặc `cursor`).
- `limit` mặc định: 20 – 50 bản ghi.
- **Server-side Clamp:** Bắt buộc giới hạn cứng trên Worker `limit = Math.min(Math.max(limit, 1), 100)`. Tuyệt đối không tin tưởng client truyền `limit=999999`.

---

## 8. NO POLLING LOOPS (Không Polling Giao Diện Tần Suất Cao)
- Cấm hoàn toàn frontend `setInterval` hoặc polling API với chu kỳ < 15 giây.
- Dashboard thông thường: chu kỳ hợp lý là 30s – 120s, hoặc làm mới khi chuyển tab (window focus) / tương tác người dùng.
- Tách biệt hoàn toàn luồng nhận dữ liệu IoT (ví dụ 15s/lần) với luồng hiển thị giao diện. Không bắt người xem UI phải query DB liên tục chỉ vì sensor đang gửi dữ liệu.

---

## 9. API FAN-OUT LIMIT (Giới Hạn Phân Tán Subrequests)
- Một request của người dùng chỉ được chuyển thành: 1 Worker Invocation + số lượng nhỏ thao tác D1/R2 (≤ 5 thao tác).
- Mọi endpoint có > 10 subrequests/operations phải được review lại kiến trúc.
- Cấm tuyệt đối các luồng phân tán không có chặn trên (unbounded fan-out).

---

## 10. WORKER EXECUTION LIMITS (Giới Hạn Thực Thi Worker)
Khai báo tường minh trong `wrangler.jsonc`:
```json
"limits": {
  "cpu_ms": 50,
  "subrequests": 20
}
```
Không tăng `cpu_ms` hay `subrequests` chỉ để che giấu code chậm hoặc vòng lặp kém hiệu quả.

---

## 11. R2 STORAGE GUARDRAILS (Rào Chắn R2)
- Dùng R2 cho: hình ảnh hiện trường, tài liệu PDF, biên bản thanh tra đã ký, báo cáo xuất, tài liệu nhị phân.
- Không dùng R2 làm cơ sở dữ liệu key-value tần suất cao.
- **Cấm `bucket.list()` trong các request path của người dùng.**
- Metadata của tệp (key, mime, size, hash, owner, createdAt) phải lưu vào D1 (`evidences`). Truy xuất R2 trực tiếp bằng exact key (`bucket.get(key)`).

---

## 12. R2 UPLOAD SAFETY (An Toàn Tải Lên Tệp R2)
- Bắt buộc kiểm tra quyền (auth/authz).
- **Giới hạn kích thước tệp tải lên:** Tối đa **5MB** (`MAX_UPLOAD_SIZE_BYTES = 5242880`). Trả về HTTP 413 nếu vượt quá.
- **MIME Allowlist:** `image/jpeg`, `image/png`, `image/webp`, `image/heic`, `image/gif`, `application/pdf`. Trả về HTTP 400 nếu sai định dạng.
- Tên tệp (key) sinh ngẫu nhiên kèm hash SHA-256 chống ghi đè tùy tiện.

---

## 13. KV GUARDRAIL (Rào Chắn Workers KV)
- KV chỉ dùng cho: cấu hình đọc nhiều, cờ tính năng toàn cầu (global feature flags), metadata tĩnh hiếm khi đổi.
- Cấm dùng KV cho: session mutations mỗi request, counters, bản ghi giao dịch, audit log, IoT telemetry, lịch sử tin nhắn.
- Tuyệt đối không gọi `KV.list()` trong luồng xử lý request bình thường.

---

## 14. QUEUES — DENY BY DEFAULT (Cấm Mặc Định Cloudflare Queues)
- Không dùng Queues cho CRUD thông thường, ghi DB chuẩn, thông báo nhỏ, hoặc công việc có thể hoàn thành an toàn trong vòng đời request.
- Nếu được phê duyệt, Queue bắt buộc có: Giới hạn retry (≤ 3), Dead-Letter Queue (DLQ), xử lý poison message, tính chất lũy kế (idempotency), giới hạn kích thước batch và concurrency.

---

## 15. CRON GUARDRAIL (Giới Hạn Thực Thi Cron Job)
- Tác vụ Cron phải có khối lượng công việc có giới hạn (bounded work).
- Cấm cron chạy hàng phút quét toàn bộ bảng (`SELECT * FROM users`).
- Bắt buộc dùng khoảng thời gian có index, cursor checkpoints, và `LIMIT 100` cho mỗi lần kích hoạt cron.

---

## 16. NO UNBOUNDED EVENT LOGGING (Không Log Vô Tội Vạ Vào D1)
- Cấm ghi bản ghi database cho các sự kiện giao diện vụn vặt: di chuột, cuộn trang, heartbeat, render component, hoặc mỗi API thành công.
- Phân biệt rõ Audit Log nghiệp vụ (chỉ ghi nhận chuyển đổi trạng thái quan trọng) và Debug Log. Debug log không bao giờ được lưu vĩnh viễn trong D1.

---

## 17. IOT / TELEMETRY GUARDRAIL (Kiểm Soát Nhận Dữ Liệu IoT)
- Cấm lưu trữ vĩnh viễn mọi bản ghi cảm biến thô (raw readings) mỗi vài giây mãi mãi.
- Áp dụng chiến lược: lấy mẫu (sampling), gộp dữ liệu (aggregation theo giờ/ngày), chống trùng lặp, ngưỡng thay đổi (delta threshold), và thời gian lưu trữ (retention period).
- Bảo vệ cổng nhận IoT: Xác thực thiết bị (`device_id`), giới hạn tần suất gửi (rate limit), kiểm tra tính hợp lệ của timestamp, giới hạn payload size.

---

## 18. RATE LIMIT EVERYTHING EXPENSIVE (Rate Limiting Phía Server)
- Áp dụng rate limit phía server cho các endpoint nhạy cảm: Đăng nhập, đăng ký, quên mật khẩu, upload file, tìm kiếm nâng cao, AI, xuất báo cáo CSR/ESG, nhận dữ liệu cảm biến, gửi phản ánh công cộng.
- Thực thi đa tầng: IP, User ID, Device ID, Endpoint.

---

## 19. MULTI-TENANT COST ISOLATION (Cách Ly Chi Phí Đa Khách Hàng)
- Mọi tài nguyên tiêu tốn chi phí phải gắn với `user_id`, `organization_id`, `site_id`, hoặc `device_id` để phát hiện và ngăn chặn người dùng / thiết bị lỗi gây quá tải.
- Thiết lập hạn ngạch (quota) theo phân hạng tài khoản (Free vs Pro vs Admin).

---

## 20. CACHE BEFORE COMPUTE (Ưu Tiên Cache Trước Khi Tính Toán)
- Áp dụng chuỗi cache: Trình duyệt → Cloudflare CDN → Worker Cache API → Bộ nhớ tạm trước khi chạm vào D1.
- Áp dụng cho: Dữ liệu công khai trang chủ, quy chuẩn pháp lý, danh mục môi trường, số liệu thống kê tổng hợp.
- Tuyệt đối không cache dữ liệu riêng tư/nhạy cảm dưới cache key chung.

---

## 21. PREVENT CACHE KEY EXPLOSION (Chống Bùng Nổ Khóa Cache)
- Chuẩn hóa Cache Key. Loại bỏ các tham số có độ biến thiên cao không cần thiết (timestamps ngẫu nhiên, tracking utm params, session ID).
- Thiết lập TTL rõ ràng, không cache các biến thể vô hạn.

---

## 22. EXTERNAL API GUARDRAIL (Rào Chắn Gọi API Bên Ngoài)
- Bắt buộc có: Timeout (≤ 5s), giới hạn retry (≤ 2 lần), Circuit Breaker khi bên ngoài gặp sự cố, cache kết quả và kiểm soát đồng thời.
- Tuyệt đối không thử lại vô hạn (infinite retry) và không retry khi nhận mã lỗi 4xx.

---

## 23. RETRY AMPLIFICATION (Chống Khuếch Đại Lần Thử Lại)
- Chỉ DUY NHẤT một tầng chịu trách nhiệm retry trong toàn bộ chuỗi xử lý (Client HOẶC Worker, không retry đồng thời ở mọi tầng).
- Mọi endpoint ghi (POST/PATCH/DELETE) phải hỗ trợ tính năng Lũy Đẳng (`idempotency_keys`) để chống nhân bản dữ liệu khi client retry.

---

## 24. PREVENT DENIAL-OF-WALLET (Chống Tấn Công Gây Kiệt Quệ Tài Chính)
- Kiểm tra an ninh chi phí định kỳ cho các endpoint tốn tài nguyên: upload, tạo PDF, xuất báo cáo CSR, suy luận AI, nhận telemetry.
- Áp dụng xác thực tăng dần (progressive challenges/auth) cho các tác vụ nặng.

---

## 25. FEATURE FLAGS & EMERGENCY KILL SWITCHES (Cờ Tính Năng & Cầu Giao Khẩn Cấp)
Mọi tính năng có nguy cơ phát sinh chi phí biến đổi lớn phải có kill switch trong biến môi trường Worker:
```env
ENABLE_AI=true/false
ENABLE_EXPORT_GENERATION=true/false
ENABLE_SENSOR_SIMULATOR=true/false
ENABLE_BACKGROUND_PROCESSING=true/false
```
Khi tắt cầu dao (ví dụ `ENABLE_AI=false`), endpoint lập tức trả về HTTP 503 với mã `KILL_SWITCH_ACTIVE` mà không tiêu tốn compute.

---

## 26. COST BUDGET & ALERT THRESHOLDS (Ngân Sách & Ngưỡng Cảnh Báo)
- **Mục tiêu sản xuất cho 10,000 người dùng:** Chi phí hạ tầng vận hành cơ bản không được vượt quá vài chục USD/tháng.
- **Chỉ số cấu hình:**
  - `TARGET_MONTHLY_INFRA_COST`: **$25**
  - `WARNING_MONTHLY_COST`: **$75** (Kích hoạt rà soát chi phí ngay)
  - `HARD_MONTHLY_COST`: **$150** (Ngừng triển khai thêm tính năng cho đến khi tối ưu xong)

---

## 27. COST MODEL REQUIRED FOR NEW INFRASTRUCTURE (Bản Đánh Giá Chi Phí)
Trước khi đề xuất thêm bất kỳ thành phần Cloudflare mới nào, phải điền biểu mẫu:
- **Dịch vụ:**
- **Lý do cần thiết:**
- **Chiều tính phí (Pricing Dimension):**
- **Ước tính thao tác/người dùng/ngày:**
- **Ước tính cho 10,000 người dùng/tháng:**
- **Gói miễn phí kèm theo (Included allowance):**
- **Chi phí dự kiến & Chi phí kịch bản xấu nhất:**
- **Kịch bản sự cố (Failure mode) & Cầu dao ngắt (Kill switch):**
- **Phương án thay thế rẻ tiền hơn:**

---

## 28. SERVICES REQUIRING EXPLICIT APPROVAL (Dịch Vụ Cần Phê Duyệt Đặc Biệt)
Cấm tự ý thêm vào dự án mà không có phê duyệt:
- Durable Objects, Workers AI, Vectorize, Cloudflare Queues, Workflows, Pipelines, R2 Data Catalog, R2 SQL, Browser Rendering, Stream, Workers for Platforms.

---

## 29. DEPENDENCY GUARDRAIL (Kiểm Soát Thư Viện Phụ Thuộc)
- Kiểm tra các gói npm hoặc SDK trước khi cài đặt: đảm bảo chúng không âm thầm kéo theo các binding Cloudflare đắt đỏ hoặc chạy ngầm.
- Kiến trúc làm chủ thư viện; thư viện không được định đoạt kiến trúc.

---

## 30. WRANGLER AUDIT (Kiểm Tra Tệp Cấu Hình Wrangler)
Khi chỉnh sửa `wrangler.jsonc` / `wrangler.toml`:
- Kiểm tra từng binding. Cấm xuất hiện các trường: `durable_objects`, `queues`, `ai`, `vectorize`, `workflows`, `pipelines`, `browser`.
- Chỉ chấp nhận: `d1_databases`, `r2_buckets`, `assets`, `limits`, `triggers.crons`, và `vars`.

---

## 31. CODEBASE AUDIT COMMAND & PATTERNS (Mẫu Tìm Kiếm Kiểm Tra Mã Nguồn)
Khi audit codebase, kiểm tra sự hiện diện và cách sử dụng của các từ khóa:
- `DurableObject`, `durable_objects`, `getByName`, `idFromName`
- `Queue`, `queues`, `sendBatch`
- `AI`, `env.AI`, `run(`
- `Vectorize`, `VECTORIZE`, `WorkflowEntrypoint`, `pipeline`
- `KV`, `env.KV`, `.put(`, `.list(`
- `R2`, `.list(`, `.put(`, `.get(`
- `D1`, `.prepare(`, `SELECT *`, `LIKE`, `ORDER BY`, `LIMIT`, `OFFSET`
- `setInterval`, `setTimeout`, `poll`, `refetchInterval`, `fetch(`
- `cron`, `scheduled`, `WebSocket`, `retry`, `retries`

---

## 32. DATABASE COST AUDIT MATRIX (Ma Trận Chi Phí Database)

| Endpoint | Mục đích | Ước tính Calls/Day | DB Queries/Call | Rows Read/Call | Rows Write/Call | Risk Level |
|---|---|---|---|---|---|---|
| `POST /api/sensors/reading` | Nhận số liệu IoT | 5,760 (4 trạm x 15s) | 2 | 1 | 1 | **LOW** |
| `GET /api/sites` | Danh sách công trường | 2,000 | 1 | 20 (có Limit) | 0 | **OPTIMAL** |
| `GET /api/sites/:id` | Chi tiết công trường | 1,500 | 4 (Site, Sensor, Insp, Act) | 15 | 0 | **LOW** |
| `POST /api/complaints/upload` | Tải ảnh phản ánh | 200 | 1 (INSERT) | 0 | 1 | **LOW** |
| `POST /api/complaints` | Tạo phản ánh vi phạm | 200 | 2 (INSERT + Audit) | 0 | 2 | **LOW** |
| `POST /api/cases/:id/verify` | Cán bộ xác minh vụ việc | 100 | 3 (SELECT, UPDATE, Audit) | 1 | 2 | **LOW** |
| `POST /api/csr/certificate/export` | Xuất chứng chỉ CSR | 50 | 2 | 2 | 0 | **LOW (Guarded)** |
| `GET /api/admin/audit-logs` | Xem nhật ký kiểm toán | 100 | 1 (LIMIT 50) | 50 | 0 | **LOW** |

---

## 33. REQUEST AMPLIFICATION AUDIT (Hệ Số Khuếch Đại Yêu Cầu)
- Công thức: `Amplification Factor = (Tổng số thao tác Cloudflare có tính phí) / (1 hành động người dùng)`.
- Mục tiêu kiến trúc: `Amplification Factor ≤ 3.0`.
- Bất kỳ API nào có hệ số khuếch đại > 5.0 phải được tối ưu hóa ngay lập tức.

---

## 34. FRONTEND TRAFFIC AUDIT (Kiểm Soát Lưu Lượng Frontend)
- Quét mã React (`src/`): Tuyệt đối không dùng `setInterval` gọi API dưới 15 giây.
- Loại bỏ hiện tượng nhiều component độc lập cùng fetch 1 endpoint trùng lặp.
- Dùng state cache tập trung hoặc SWR/React Query với `staleTime` hợp lý (≥ 30s).

---

## 35. AUTHENTICATION GUARDRAIL (Bảo Vệ Xác Thực & Phiên Làm Việc)
- Sử dụng JWT / stateless signed tokens cho các request thông thường để giảm thiểu tra cứu D1.
- Không ghi vào bảng session trên mỗi lần người dùng tải trang.

---

## 36. OBSERVABILITY WITHOUT BILL EXPLOSION (Giám Sát Không Gây Nổ Hóa Đơn)
- Ghi nhận metrics dạng tổng hợp (aggregated metrics) thay vì ghi nhận từng HTTP request vào D1.
- D1 chỉ lưu trữ `audit_events` cho các thay đổi nghiệp vụ quan trọng (State transitions, Case updates, Escrow milestones).

---

## 37. COST ANOMALY DETECTION (Phát Hiện Bất Thường Chi Phí)
- Đặt cảnh báo tự động khi:
  - Lưu lượng request tăng gấp 2 lần bình thường trong ngày.
  - Số hàng đọc D1 tăng gấp 3 lần bình thường.
  - Dung lượng lưu trữ R2 tăng vọt không rõ nguyên nhân.
  - Phát sinh bất kỳ lượt gọi AI hoặc Queue ngoài dự kiến.

---

## 38. DATA RETENTION POLICY (Chính Sách Lưu Trữ Dữ Liệu)
- **Sensor Readings Thô:** Lưu trữ tối đa 30 ngày; sau đó gộp thành số liệu thống kê trung bình theo ngày và dọn dẹp bản ghi chi tiết.
- **Tệp minh chứng R2:** Lưu trữ vĩnh viễn đối với vụ việc đã xác minh; tệp tạm/nháp tự động hết hạn sau 7 ngày.
- **Idempotency Keys:** Tự động hết hạn và xóa sau 24 giờ (`expires_at`).
- **Audit Logs:** Lưu trữ 12 tháng.

---

## 39. ABSOLUTE PROHIBITIONS (17 Điều Cấm Tuyệt Đối)
1. **CẤM** thêm Durable Objects chỉ vì tiện lợi.
2. **CẤM** duy trì Durable Objects active liên tục không cần thiết.
3. **CẤM** mở kết nối WebSocket vĩnh viễn mà không phân tích chi phí.
4. **CẤM** gọi AI inference trên mỗi lần render giao diện hoặc load trang.
5. **CẤM** thực thi truy vấn D1 quét toàn bảng (unbounded full-table scan).
6. **CẤM** truy vấn toàn bộ dữ liệu lịch sử telemetry để render dashboard.
7. **CẤM** ghi telemetry mỗi vài giây mãi mãi vào DB mà không có chính sách retention.
8. **CẤM** polling API dồn dập (< 15s).
9. **CẤM** cho phép tải lên tệp không giới hạn kích thước (> 5MB).
10. **CẤM** cơ chế retry vô hạn.
11. **CẤM** tạo tác vụ nền không có chặn trên.
12. **CẤM** enqueue công việc đệ quy vào hàng đợi.
13. **CẤM** gọi `R2.list()` hoặc `KV.list()` lặp đi lặp lại trong luồng xử lý request.
14. **CẤM** lưu trữ tệp lớn dạng binary/base64 trong D1.
15. **CẤM** lưu trữ trạng thái giao dịch biến động liên tục trong KV.
16. **CẤM** thêm dịch vụ hạ tầng mà không đo lường các chiều tính phí.
17. **CẤM** nâng giới hạn CPU/subrequest của Worker chỉ để hợp thức hóa code chạy chậm.

---

## 40. REQUIRED RESPONSE WHEN VIOLATION IS FOUND (Quy Trình Xử Lý Khi Vi Phạm)
Khi phát hiện rủi ro chi phí, bắt buộc lập báo cáo theo mẫu chuẩn:
```markdown
## COST RISK DETECTED
- **Mức độ (Severity):** [CRITICAL / HIGH / MEDIUM]
- **Thành phần vi phạm (Component):** [Tên file / Route / Service]
- **Hành vi hiện tại (Current behavior):** [Mô tả chi tiết]
- **Nguy cơ tài chính (Why dangerous):** [Phân tích rủi ro bùng nổ chi phí]
- **Hệ số khuếch đại (Amplification factor):** [Ví dụ: 25.0]
- **Dự báo cho 10k người dùng (10k-user projection):** [Ước tính số thao tác/tháng]
- **Dự báo kịch bản xấu nhất (Worst-case projection):** [Ước tính chi phí tối đa]
- **Nguyên nhân gốc rễ (Root cause):** [Thiếu index / vòng lặp / polling]
- **Giải pháp thay thế (Recommended replacement):** [Giải pháp tối ưu chuẩn SSOT]
- **Migration & Observability:** [Các bước khắc phục và kiểm thử hồi quy]
```

---

## 41. DEFINITION OF DONE — COST (Bộ Tiêu Chí Nghiệm Thu Chi Phí)
Một tính năng chỉ được xem là HOÀN THÀNH (DONE) khi vượt qua toàn bộ 14 tiêu chí:
- [x] Số lượng HTTP request có chặn trên rõ ràng.
- [x] Số lượng truy vấn D1 có chặn trên (≤ 5 queries/request).
- [x] Phân trang bắt buộc (`limit` + `offset`, clamp ≤ 100).
- [x] Các truy vấn trên bảng tăng trưởng đều sử dụng Index (có `EXPLAIN QUERY PLAN`).
- [x] Không tồn tại full-table scan trên các đường dẫn thường xuyên (hot paths).
- [x] Giới hạn lần thử lại (retries bounded, chỉ 1 tầng sở hữu).
- [x] Kích thước tải lên R2 bị giới hạn cứng (≤ 5MB) kèm MIME allowlist.
- [x] Lượt gọi API bên ngoài có timeout và giới hạn retry.
- [x] Không có polling giao diện < 15s.
- [x] Có định nghĩa thời gian lưu trữ (retention policy).
- [x] Các dịch vụ đắt tiền (AI/Export) đều có hạn ngạch (quota) và rate limit.
- [x] Sự cố/lỗi không thể tạo ra vòng lặp vô hạn.
- [x] Có tài liệu ước tính chi phí cho 10,000 người dùng.
- [x] Các tính năng nặng có cầu giao khẩn cấp (kill switches).

---

## 42. FINAL ARCHITECTURAL PRINCIPLE (Nguyên Lý Kiến Trúc Cuối Cùng)
Cloudflare cung cấp rất nhiều sản phẩm mạnh mẽ, nhưng "Cloudflare-native" **KHÔNG ĐỒNG NGHĨA** với việc "phải dùng tất cả sản phẩm Cloudflare".  
Hệ thống lý tưởng là hệ thống: **ĐƠN GIẢN, STATELESS NƠI CÓ THỂ, CÓ INDEX, ĐƯỢC CACHE, CÓ CHẶN TRÊN, CÓ THỂ QUAN SÁT VÀ RẺ TIỀN.**  
Bộ ba mặc định bất biến: **Workers + D1 + R2 + Cache**.  
Bất kỳ kiến trúc nào có thể vô tình biến mức độ sử dụng trung bình thành hóa đơn hạ tầng 4 chữ số USD/tháng đều được coi là một **LỖI KIẾN TRÚC NGHIÊM TRỌNG (ARCHITECTURAL DEFECT)**.

