# BUG MEMORY & ROOT CAUSE REFERENCE — DUSTGUARD VN

> **Mục đích**: Lưu trữ tức thì các bẫy lỗi (bug traps), nguyên nhân gốc rễ (root cause) và mẫu xử lý chuẩn để phòng ngừa tái phát trong quá trình code.

---

## 🌐 0. API Request & Network Traps

### 🚨 Trap 0.1: Lặp tiền tố URL `/api/api/...` khi gọi API Client
- **Nguyên nhân**: `request(path)` định nghĩa `API_BASE = '/api'`, khi caller truyền `path = '/api/cases'` hoặc `path = '/api/observations'`, chuỗi URL bị ghép thành `${API_BASE}${path}` = `'/api/api/cases'`, dẫn đến lỗi HTTP 404 Not Found ngầm và kích hoạt fallback mock.
- **Giải pháp**: Luôn chuẩn hóa `cleanPath = path.startsWith('/api/') ? path.slice(4) : path` trong `request.js` và `getApiFileUrl` trước khi nối `${API_BASE}`.

---

## 🗄️ 1. D1 SQLite & Database Traps

### 🚨 Trap 1.10: Đếm số lượng người tham gia chiến dịch bị hardcode tĩnh hoặc sai lệch SSOT
- **Nguyên nhân**: Frontend hardcode số `1.200+`, `107`, `54` hoặc backend dùng cột số nguyên tĩnh `participant_count` không được cập nhật khi có bản ghi mới.
- **Giải pháp**: Luôn query `COUNT(DISTINCT coalesce(user_id, email, phone, id))` từ bảng `campaign_participants WHERE campaign_id = ? AND status IN ('APPROVED', 'ACTIVE', 'COMPLETED')` để số lượng luôn tăng $N \to N+1$ chính xác ngay khi người dùng đăng ký hoặc cán bộ phê duyệt.

### 🚨 Trap 1.11: Chiến dịch DRAFT / ARCHIVED bị lộ ra Public Discovery
- **Nguyên nhân**: Public endpoint `GET /api/community/discover` không lọc mệnh đề `WHERE status IN ('OPEN', 'ACTIVE') AND visibility = 'PUBLIC' AND (deleted_at IS NULL)`, dẫn đến các chiến dịch nháp hoặc đã lưu trữ vẫn hiển thị với công chúng.
- **Giải pháp**: Phân định rạch ròi giữa Public Query (`status IN ('OPEN', 'ACTIVE')`) và Backoffice Admin Query (xem được toàn bộ `DRAFT`, `OPEN`, `ACTIVE`, `COMPLETED`, `ARCHIVED`).

### 🚨 Trap 1.12: Nhiệm vụ bị nhận việc vô hạn (vượt quá slot) hoặc cộng điểm ảo khi chưa nghiệm thu
- **Nguyên nhân**: Không kiểm tra `COUNT(task_participants) < max_participants` ở tầng Repository và cộng điểm trực tiếp ngay khi nộp bằng chứng thay vì chờ Cán bộ xác minh duyệt.
- **Giải pháp**:
  1. Kiểm soát số lượng người tham gia chặt chẽ tại `joinTask`: `SELECT COUNT(id) FROM task_participants WHERE task_id = ?` và chặn nếu `>= max_participants`.
  2. Điểm và giờ rèn luyện (`youth_activities`, `impact_events`) chỉ được ghi nhận vào DB SSOT khi và chỉ khi Cán bộ thực hiện `approveSubmission`. Khi `requestRevision`, bắt buộc nhập `review_note` và không cộng điểm.

### 🚨 Trap 1.13: Sử dụng `backdrop-blur` (Glassmorphism) vi phạm nguyên tắc Civic Tech High-Contrast
- **Nguyên nhân**: Dùng class Tailwind `backdrop-blur-xs` hoặc `backdrop-blur` trên sticky headers hoặc modals làm mờ nền, vi phạm quy tắc cấm tuyệt đối glassmorphism và bị bộ kiểm thử Visual Regression Audit đánh rớt.
- **Giải pháp**: Luôn dùng màu nền đặc vững chắc (`bg-[#FDFBF7]` hoặc `bg-white`) kèm border tương phản cao (`border-ink-900/10`) cho toàn bộ thanh điều hướng, modals và thẻ hiển thị.

### 🚨 Trap 1.14: Onboarding Trạm đo IoT bị lỗi 404 hoặc dùng fake timer thay vì SSOT telemetry
- **Nguyên nhân**: Backend telemetry endpoint chỉ tìm sensor đã tạo sẵn bằng tay, gây lỗi 404 khi thiết bị gửi tín hiệu đầu tiên; hoặc frontend dùng timer giả đếm ngược để chuyển trạng thái "Đã kết nối".
- **Giải pháp**: 
  1. Hỗ trợ Auto-Provisioning: Tự động tạo bản ghi trạm đo gắn với site mặc định khi có gói telemetry đầu tiên đến nếu chưa tồn tại.
  2. Derive trạng thái trung thực từ CSDL: `ONLINE` khi `Date.now() - lastReadingAt <= 15 phút`, `READY` khi chưa có bản ghi đo nào, `OFFLINE` khi quá 15 phút. Tuyệt đối không dùng fake timer.

### 🚨 Trap 1.15: ReferenceError `selectedEntity` do alias prop destructuring & rác module legacy
- **Nguyên nhân**: Trong `SpatialMap.jsx`, prop `selectedEntity` được destructure thành `explicitSelectedEntity`, state nội bộ là `internalSelectedEntity`, computed value là `effectiveSelectedEntity` và handler là `handleSelectEntity(entity)`. Nhưng khi render JSX của `SpatialEntityDrawer`, code gọi nhầm biến không tồn tại `selectedEntity` và hàm `setSelectedEntity`, gây crash Virtual DOM.
- **Giải pháp**: Luôn truyền đúng computed SSOT `selectedEntity={effectiveSelectedEntity}` và handler `onClose={() => handleSelectEntity(null)}`. Đồng thời dọn dẹp sạch toàn bộ các file legacy và proxy barrels không còn consumer (`MapView.jsx`, `RiskLeafletMap.jsx`, `MapDynamicLegend.jsx`).

### 🚨 Trap 1.16: Lệch giá trị Enum giữa Schema-Healer, Test Fixtures và Audit Database SSOT
- **Nguyên nhân**: `schema-healer.js` và test suite `d1-architecture-healer.test.js` định nghĩa default `category = 'DUST_CONSTRUCTION'` và `status = 'NEW'` cho bảng `observations`, trong khi Business Rules SSOT quy định `category = 'CONSTRUCTION_DUST'` và `status = 'RECORDED'`. Khi test chạy chèn bản ghi mẫu vào DB làm `audit:db` fail enum constraint. Đồng thời vi phạm claim linter do hardcode `(20h = 4.0 tín chỉ)`.
- **Giải pháp**: Chuẩn hóa 100% enum defaults trong `schema-healer.js`, test suites và migrations về enum SSOT (`CONSTRUCTION_DUST`, `RECORDED`). Đổi chuỗi claim sang "Tín chỉ ngoại khóa đề xuất" tuân thủ Claim Integrity Policy SSOT.

### 🚨 Trap 1.17: Docx OpenXML Parser vỡ cấu trúc `<table>` do regex chèn `\n` vào `<td>` và thiếu no-borders cho Official Header
- **Nguyên nhân**: Khi parse HTML sang AST DOCX, lệnh regex `.replace(/<div\b[^>]*>([\s\S]*?)<\/div>/gi, '\n$1\n')` chèn ngắt dòng vào bên trong cell bảng Quốc hiệu & Tiêu ngữ, làm vỡ dòng table và khiến `docx` tự động thêm viền đen và nền xám F4F4F5 vào tiêu đề văn bản hành chính — vi phạm thể thức Nghị định 30/2020/NĐ-CP.
- **Giải pháp**: Bảo vệ toàn bộ khối `<table>...</table>` bằng token placeholder trước khi xử lý ngắt dòng ngoài bảng; tự động nhận diện class `.dg-legal-header-table` để đặt `borders: NONE` và `shading: NONE`.

### 🚨 Trap 1.18: A4 Editor Canvas khóa cứng height 1 trang `height: calc(297mm * var(--a4-scale, 1))` làm xén mất trang 2, 3
- **Nguyên nhân**: Container `.a4-preview-scale-wrapper` đặt `height: calc(297mm * var(--a4-scale, 1))` và `overflow: hidden`, khiến các văn bản dài từ 2 trang trở lên bị cắt mất phần nội dung phía sau.
- **Giải pháp**: Đổi thành `minHeight: calc(297mm * var(--a4-scale, 1))` và `overflow: visible` để hỗ trợ văn bản nhiều trang co giãn tự nhiên.

### 🚨 Trap 1.19: `SpatialMapCanvas` crash khi nhận mảng tọa độ rỗng `[undefined, undefined]` hoặc `[NaN, NaN]`
- **Nguyên nhân**: Kiểm tra `Array.isArray(center)` trả về `true` cho mảng `[undefined, undefined]`, truyền vào Leaflet MapContainer gây lỗi `Invalid LatLng object`.
- **Giải pháp**: Thêm hàm kiểm tra an toàn `isValidCoord(lat, lng)` trước khi gán tọa độ center cho Leaflet, fallback về `HANOI_DEFAULT_CENTER`.

### 🚨 Trap 1.20: Lạm dụng LocalStorage làm SSOT thay vì Cloudflare D1 Persistent Storage
- **Nguyên nhân**: Lưu trữ các thực thể nghiệp vụ cốt lõi (`users`, `cases`, `complaints`, `sites`, `tasks`, `campaigns`, `sensors`, `evidences`, `credits`) trong `localStorage` hoặc fallback dữ liệu fake/mock trong `catch` block làm dữ liệu bị phân mảnh trên từng client, không đồng bộ giữa các máy và rò rỉ dữ liệu ảo.
- **Giải pháp**:
  1. **Quy định Phân Loại Rõ Ràng**: Chỉ cho phép `localStorage` lưu: Ngôn ngữ (`dg-lang`), Giao diện (`theme`), Cache token/session tạm thời (`dustguard_user`), và Offline draft tạm thời khi mất mạng 3G (`dg_report_drafts`).
  2. **D1 Persistent Storage là SSOT Duy Nhất**: Mọi thao tác CRUD, tính toán điểm rủi ro, chuyển đổi trạng thái hồ sơ, tích lũy giờ tình nguyện và chứng chỉ đều phải ghi nhận và truy vấn trực tiếp từ CSDL D1 SQLite (`dev.db` / Cloudflare D1).
  3. **Zero Fake in Catch Block**: Khi API lỗi mạng, hiển thị `ErrorState` hoặc chuyển sang `saveOfflineDraft` rõ ràng, tuyệt đối không trả về mock fake entity. Khi logout, gọi `purgeAllSessionData()` để dọn sạch toàn bộ cache.

### 🚨 Trap 1.21: Trạng thái Phản ánh (Complaint) bị treo `PROCESSING` khi Hồ sơ vụ việc (Case) đã chuyển `COMPLETED`
- **Nguyên nhân**: Khi Case chuyển trạng thái sang `COMPLETED`, backend `transitionCaseStatus` chỉ cập nhật bản ghi `cases` mà chưa đồng bộ cập nhật `prisma.complaint.update({ where: { id: caseRecord.complaintId }, data: { status: 'RESOLVED' } })`, khiến người dân tra cứu phản ánh vẫn thấy trạng thái xử lý dở dang.
- **Giải pháp**: Trong `case.service.js` `transitionCaseStatus`, khi `normalizedNext === 'COMPLETED'` và có `caseRecord.complaintId`, luôn tự động cập nhật bản ghi `complaint` tương ứng sang `RESOLVED`.

### 🚨 Trap 1.21: Voiceover timeline overlap & FFmpeg loudnorm stdout blocking trên Windows
- **Nguyên nhân**: 
  1. Khi tổng hợp Voiceover tốc độ cố định, các phân đoạn có nhiều từ (như segment 2, 7, 8, 12) có thời lượng dài hơn khung thời gian của phân cảnh, dẫn đến việc đè giọng thoại lên phân cảnh tiếp theo hoặc nuốt mất khoảng lặng Beat Drop ở 0:55.
  2. Lệnh FFmpeg loudnorm pass 1 dùng `-f null -` trên Windows chờ handle stdout khiến Python `subprocess.run(capture_output=True)` bị treo.
- **Giải pháp**: 
  1. Căn chỉnh khung thời gian tối đa `max_dur` cho từng phân đoạn, đo thời lượng raw bằng `ffprobe`, tự động tính toán speed factor và áp dụng bộ lọc `atempo` (bảo toàn cao độ giọng nói 100%) để bảo đảm 0 overlap (Zero-Overlap Guarantee) và giữ trọn khoảng lặng 53.5s - 56.5s cho Beat Drop 0:55 và 207.5s - 210.0s cho Grand Finale.
  2. Sử dụng target sink `-f null NUL` trên Windows cho FFmpeg loudnorm pass 1.
  3. Sử dụng thuật toán vector downsampling & exponential smoothing (10ms hop) trên NumPy giúp tính toán Auto-Ducking 10.080.000 samples trong dưới 0.05 giây.

### 🚨 Trap 2.15: ReferenceError `handleSubmit` trong form nộp 5 bước của `CreateObservation.jsx`
- **Nguyên nhân**: Bước 5 gọi `onClick={handleSubmit}` nhưng component chỉ có `handleQuickSubmit`.
- **Giải pháp**: Khai báo hàm `handleSubmit` đồng bộ logic với `handleQuickSubmit` và gửi request chuẩn tới `/api/observations`.

### 🚨 Trap 2.16: Rò rỉ session & cache quyền hạn khi logout đa vai trò do thiếu dọn dẹp cờ guest và role storage
- **Nguyên nhân**: `signOut()` chỉ xóa `dustguard_token`, bỏ sót `guest_user`, `dustguard_role`, `dg_applied_citation` trong `localStorage`/`sessionStorage`, dẫn đến khi login role mới bị nhận nhầm quyền cũ.
- **Giải pháp**: Sử dụng hàm tập trung `purgeAllSessionData()` dọn sạch toàn bộ 100% auth keys và session flags khi đăng xuất.

### 🚨 Trap 2.17: `UnicodeEncodeError` khi Python script in ký tự emoji ra stdout trên Windows PowerShell
- **Nguyên nhân**: Trên môi trường Windows PowerShell, `sys.stdout` mặc định sử dụng mã hóa `cp1252` hoặc `cp936`, dẫn đến lỗi `UnicodeEncodeError: 'charmap' codec can't encode character...` khi in emoji hoặc biểu tượng Unicode đặc biệt.
- **Giải pháp**: Luôn đặt cấu hình `sys.stdout.reconfigure(encoding='utf-8')` và `sys.stderr.reconfigure(encoding='utf-8')` ở đầu tất cả các scripts CLI / Python runners.

### 🚨 Trap 2.18: Dòng phụ đề vượt quá 38 ký tự hoặc quá 2 dòng làm vỡ safe-zone video 1080p
- **Nguyên nhân**: Dòng văn bản lồng ghép quá dài không ngắt nhịp ngữ nghĩa tự nhiên, làm chữ bị tràn ra mép màn hình hoặc che khuất giao diện video player.
- **Giải pháp**: Tích hợp hàm `run_qa_audit(cues)` kiểm tra nghiêm ngặt `max_chars_per_line <= 38`, `max_lines <= 2`, tốc độ đọc `CPS` lý tưởng 12-18 chars/s và vị trí `MarginV=80px` trước khi xuất file `.srt`, `.ass`, `.vtt`.

### 🚨 Trap 2.19: Regex Overclaim Catch-All Bắt Nhầm Câu Phủ Định Rào Trước (Intervening Words in Negation Pattern)
- **Nguyên nhân**: Khi viết regex quét các từ khóa cấm overclaim (`thay thế thanh tra`, `kết luận vi phạm`, `tự động xử phạt`), nếu mẫu phủ định (`allowed_negations`) chỉ match dạng nối liền `không thay thế` thì các phát biểu rào trước mang tính bảo vệ như *"AI không phán quyết hay thay thế thanh tra"* hoặc *"không tự ra quyết định xử phạt"* sẽ bị bắt nhầm thành lỗi vi phạm do có từ chèn giữa (`phán quyết hay`, `tự ra quyết định`).
- **Giải pháp**: Trong các công cụ Content QC linter, thiết kế regex negation hỗ trợ từ đệm linh hoạt trong cùng mệnh đề: `r"không\s+(?:[^.?!,;:]*?\s+)?(?:thay thế|kết luận|xử phạt|phán quyết)"`.

### 🚨 Trap 1.1: Tọa độ GIS Map / Contractor Workspace bị `undefined`
- **Nguyên nhân**: Repository chỉ trả về chuỗi `coordinates: "21.028,105.854"` hoặc tên cột lẻ `latitude`, trong khi frontend UI đọc `lat` / `lng`.
- **Giải pháp**: Luôn bọc entity qua `app/server/domain/spatial/spatial-adapter.js` bằng hàm `normalizeEntityCoordinates(entity)`. Hàm này sẽ tự động gắn kết đồng thời cả 5 thuộc tính: `{ latitude, longitude, lat, lng, coordinates }`.

### 🚨 Trap 1.2: Fake Coordinates làm sai lệch bản đồ nhiệt GIS
- **Nguyên nhân**: Sử dụng công thức sin/cos hoặc index offset (`21.0285 + idx * 0.006`) khi entity không có tọa độ GPS.
- **Giải pháp**: Nếu không có GPS thực tế, bắt buộc trả về `lat: null, lng: null`. Điểm nóng (Hotspots) chỉ được tổng hợp từ các công trường có GPS thật.

### 🚨 Trap 1.3: Cột JSON trong D1 SQLite bị lỗi `[object Object]` hoặc không parse
- **Nguyên nhân**: D1 SQLite lưu trữ JSON dưới dạng chuỗi TEXT (`findings`, `metadata`, `components`, `reasons`).
- **Giải pháp**: Luôn viết helper parse an toàn:
  ```javascript
  const parseJsonSafe = (val, fallback = {}) => {
    if (typeof val === 'object' && val !== null) return val;
    try { return JSON.parse(val); } catch { return fallback; }
  };
  ```

### 🚨 Trap 1.4: Gán tọa độ trung tâm giả khi người dùng từ chối cấp quyền GPS
- **Nguyên nhân**: Khi `navigator.geolocation` trả về lỗi (User denied geolocation), code fallback tự ý gán tọa độ trung tâm `21.033333, 105.800000` hoặc `DEFAULT_CENTER`. Điều này làm sai lệch toàn bộ bản đồ, tập trung mọi phản ánh ở khắp nơi vào một điểm duy nhất, tạo điểm nóng giả lập và làm hỏng tính toàn vẹn của bằng chứng số.
- **Giải pháp**: Nếu không lấy được GPS, luôn gán `lat: null, lng: null` và cung cấp component `GeoLocationPicker` cho phép người dùng tự tra cứu địa chỉ bằng OpenStreetMap hoặc tự ghim vị trí. Tuyệt đối không bao giờ tự động gán tọa độ giả.

### 🚨 Trap 1.5: Thiếu cột trong D1 SQLite gây crash ngầm trong Background Automation (no such column: priority)
- **Nguyên nhân**: Code backend `worker.js` hoặc service đọc/ghi các trường (`priority`, `assignedTo`, `category`, `feedbackNote`) nhưng câu lệnh migration SQL ban đầu chưa bổ sung các cột này vào bảng `cases` hoặc `complaints`, dẫn đến lỗi `"CaseAttentionError: no such column: priority"` trong cron automation logs.
- **Giải pháp**: Áp dụng cơ chế `ensureSchema(env.DB)` với auto-healing columns tự động kiểm tra `PRAGMA table_info` và chạy `ALTER TABLE` an toàn khi Worker boot.

### 🚨 Trap 1.6: Lỗi `Cannot add a column with non-constant default` khi chạy `ALTER TABLE ADD COLUMN` trong SQLite
- **Nguyên nhân**: Cú pháp SQLite không cho phép thêm cột mới kèm default động như `DEFAULT CURRENT_TIMESTAMP` hoặc `NOT NULL` (nếu không có constant default) khi dùng `ALTER TABLE ADD COLUMN`.
- **Giải pháp**: Trong bộ tự sửa schema `schema-healer.js`, luôn khử bỏ `DEFAULT CURRENT_TIMESTAMP`, `NOT NULL`, `PRIMARY KEY`, `AUTOINCREMENT` trước khi phát sinh câu lệnh `ALTER TABLE ADD COLUMN`.

### 🚨 Trap 1.7: In-place Mutation của `db.prepare().bind()` làm hỏng toàn bộ Batch Transaction (`db.batch()`)
- **Nguyên nhân**: Khi dùng `stmt = db.prepare(sql); records.map(r => stmt.bind(...))`, nếu hàm `bind()` làm thay đổi thuộc tính `this._args` và trả về `this`, mảng batch sẽ chứa n tham chiếu trùng tới cùng 1 đối tượng duy nhất mang giá trị của phần tử cuối cùng ➔ Gây lỗi `SQLITE_CONSTRAINT_UNIQUE` khi thực thi batch.
- **Giải pháp**: Luôn thiết kế `db.prepare().bind()` theo dạng immutable (trả về closure copy mới) và trong `buildInsertStatements` / `buildUpsertStatements` luôn gọi `db.prepare(sql).bind(...)` độc lập cho từng bản ghi.

---

## ⚛️ 2. React Hooks & UI Architecture Traps

### 🚨 Trap 2.1: Lỗi TDZ (Temporal Dead Zone) trong React Hooks
- **Nguyên nhân**: `useEffect` phụ thuộc vào một biến được tạo bởi `useMemo` ở dòng code phía dưới nó ➔ Bị lỗi `ReferenceError: Cannot access '...' before initialization`.
- **Giải pháp**: Luôn khai báo toàn bộ `useState`, `useRef`, `useMemo`, `useCallback` **TRƯỚC** tất cả các `useEffect`.

### 🚨 Trap 2.14: Phân mảnh trải nghiệm do chia quá nhiều Module & Navigation riêng lẻ (Mental Model Confusion)
- **Nguyên nhân**: Tạo quá nhiều trang con lắt nhắt (Alerts, Complaints, Inspections, SLA, Documents, AI) khiến cán bộ phải nhảy qua lại 5-7 màn hình để giải quyết 1 sự vụ.
- **Giải pháp**: Áp dụng triết lý UX từ Quản lý Sao Sáng: Lấy **Case làm SSOT trung tâm**. Mọi dữ liệu (tín hiệu, đo kiểm, ảnh Before/After, biên bản, giải trình SLA) đều đưa vào 1 màn hình Case Detail duy nhất theo luồng **Phát hiện ➔ Hồ sơ ➔ Xử lý ➔ Hoàn tất**. Rút gọn Sidebar chỉ còn 5 mục chính phẳng, trực diện.

### 🚨 Trap 2.2: Rò rỉ bộ nhớ từ Timer đếm ngược / Event Listener
- **Nguyên nhân**: `setInterval` trong countdown SLA 48h hoặc `window.addEventListener('keydown')` trong Modal không có hàm cleanup khi unmount.
- **Giải pháp**: Luôn return hàm hủy trong `useEffect`:
  ```javascript
  useEffect(() => {
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);
  ```

### 🚨 Trap 2.3: Bẫy Glassmorphism và Mất Tương Phản Màu Sắc
- **Nguyên nhân**: Vô tình sử dụng `backdrop-blur-md` hoặc `bg-white/40` khiến chữ mờ nhạt trên nền bản đồ hoặc ảnh hiện trường.
- **Giải pháp**: Dùng màu đặc `#FFFFFF` hoặc `#FDFBF7`, viền `#E7DFD3`, chữ `#231B14`. Đảm bảo touch target tối thiểu `min-h-[44px]`.

### 🚨 Trap 2.4: Lỗi TDZ Re-export `ReferenceError: Cannot access 'X' before initialization`
- **Nguyên nhân**: Trong module export shared UI (`app/src/components/shared/index.jsx`), dòng gán alias `export const PriorityBadge = RiskBadge;` được đặt ở đầu file TRƯỚC dòng định nghĩa `export const RiskBadge = React.memo(...)`. Do `const` không được hoisting như `function` mà rơi vào Temporal Dead Zone (TDZ), khiến toàn bộ bundle crash ngay khi load.
- **Giải pháp**: Luôn đặt các dòng gán alias hoặc re-export phụ thuộc **NẰM SAU** định nghĩa của component gốc `RiskBadge`.

### 🚨 Trap 2.5: Lỗi không đồng bộ tên trường API Directive (`content` vs `directive`) và ReferenceError `SpatialMap`
- **Nguyên nhân**: Frontend Modal (`ExecutiveDirectiveModal.jsx`) gửi `{ content: "..." }` trong khi backend router chỉ đọc `const { directive } = req.body`, dẫn đến lỗi `400: Nội dung chỉ đạo không được để trống`. Đồng thời khi tách subcomponent map, các file cấp module bị thiếu re-export `SpatialMap` dẫn đến `ReferenceError`.
- **Giải pháp**: 
  1. Backend `ExecutiveService.issueDirective` và route controller luôn hỗ trợ dual parameters: `const directiveText = (content || directive || '').trim();` và `const effectivePriority = priorityLevel || priority || 'P1';`.
  2. Tạo module-level alias `app/src/modules/executive/ExecutiveRiskMap.jsx` re-export cả `default` và named export `{ SpatialMap, executivePolicy }`.

### 🚨 Trap 2.5: Thiếu Granular Section Error Boundary làm chết toàn trang
- **Nguyên nhân**: Toàn bộ dashboard chỉ có duy nhất 1 Page-level ErrorBoundary. Khi 1 widget phụ (như bản đồ hay panel) gặp lỗi runtime, toàn bộ dashboard biến mất và thay bằng thông báo lỗi chung.
- **Giải pháp**: Sử dụng `SectionErrorBoundary` bao bọc từng widget/section độc lập. Khi một khu vực gặp lỗi, chỉ khu vực đó hiển thị thông báo "Không thể tải nội dung" kèm nút [Thử lại], các khu vực khác vẫn hoạt động bình thường. Phân tách rõ DEV (hiện technical details) và PROD (hiện thông báo hành chính dân sinh, không lộ raw stack).

### 🚨 Trap 2.6: Tham chiếu biến chưa khai báo trong JSX template string
- **Nguyên nhân**: Sử dụng biến trong JSX (ví dụ `{openCases}`) khi biến chưa được khai báo ở scope hàm của component, gây `ReferenceError: openCases is not defined`.
- **Giải pháp**: Luôn kiểm tra khai báo đầy đủ biến hoặc destructure an toàn từ props/state với fallback hợp lý (`const openCases = overviewData?.kpis?.openCases ?? 0;`).

### 🚨 Trap 2.7: Viết cú pháp JSX trong file extension `.js` khi chạy trên Node.js test runner
- **Nguyên nhân**: Node.js ESM test runner (`node --test`) chạy trực tiếp trên V8 và không có Babel/JSX transformer. Nếu file `.js` chứa JSX `<Component />`, Node sẽ quăng `SyntaxError: Unexpected token '<'`.
- **Giải pháp**: Với các Tiptap Extension hay View Renderer được import bởi test runner, luôn sử dụng `React.createElement(Component, props, ...children)` trong file `.js`, hoặc phân tách rõ file `.jsx` cho frontend UI thuần.

### 🚨 Trap 2.8: Sai đuôi mở rộng khi import (`.jsx` thay vì `.tsx`)
- **Nguyên nhân**: Viết trực tiếp đuôi `.jsx` trong câu lệnh import (ví dụ `import PageBreadcrumb from '../../components/common/PageBreadCrumb.jsx'`) trong khi file thực tế là `.tsx`, khiến bundler/resolver không phân giải được.
- **Giải pháp**: Luôn import không cần ghi đuôi mở rộng (`import PageBreadcrumb from '../../components/common/PageBreadCrumb'`) hoặc ghi đúng định dạng file.

### 🚨 Trap 2.9: Xung đột tên SpatialMap và thiếu Named/Default Dual Export trong Map Components
- **Nguyên nhân**: Định nghĩa trùng tên `export function SpatialMap` bên trong module trang (`ExecutiveRiskMap.jsx`), hoặc component chỉ export default mà không export named `{ ComponentName }` (hoặc ngược lại), dẫn đến lỗi `ReferenceError` hoặc import nhầm component khi chuyển đổi giữa các module Citizen / Staff / Executive.
- **Giải pháp**:
  1. Duy nhất `app/src/components/map/SpatialMap.jsx` là SSOT định nghĩa component `SpatialMap`.
  2. Mọi component Map và trang sử dụng Map đều xuất khẩu cả named export `export { Component }` lẫn default export `export default Component;`, an toàn tuyệt đối khi import theo bất kỳ cú pháp nào.
  3. `SpatialMap` và `SpatialMapCanvas` hỗ trợ đầy đủ các prop aliases: `sites`, `sensors`, `reports`, `center`/`mapCenter`/`initialCenter`, `zoom`/`initialZoom`, `radius`, `pickedLocation`/`pickerLocation`, `onSelectLocation`/`onLocationPick`, tự động bỏ qua fetch D1 thừa khi mảng thực thể đã được truyền trực tiếp từ cha.

---

## 🌐 3. Cloudflare Worker Edge & API Traps

### 🚨 Trap 3.1: Lộ Thông Tin Riêng Tư (PII Leakage) trên Public API
- **Nguyên nhân**: Trả nguyên bảng `complaints` hoặc `sites` cho người dân/khách vãng lai bao gồm cả số điện thoại người phản ánh (`reporterPhone`) và số quản lý công trường (`managerPhone`).
- **Giải pháp**: Trong `worker.js` / API controller, kiểm tra role người dùng. Nếu là Public/Citizen, bắt buộc mask hoặc xóa các trường nhạy cảm:
  ```javascript
  const sanitized = isStaffOrAdmin ? complaint : {
    ...complaint,
    reporterPhone: maskPhone(complaint.reporterPhone),
    triageNote: undefined
  };
  ```

### 🚨 Trap 3.2: Cảnh báo Externalized `node:crypto` trong Vite 8 Bundle
- **Nguyên nhân**: Frontend import trực tiếp `crypto` từ Node.js để tính SHA-256 làm phình bundle và sinh warning.
- **Giải pháp**: Ưu tiên chuẩn Web Crypto `globalThis.crypto?.subtle?.digest('SHA-256', buffer)`. Chỉ fallback về Node crypto khi chạy trong test runner Node.js.

---

## 🛡️ 4. Domain & Business Logic Traps

### 🚨 Trap 4.1: Trừ điểm rủi ro khi thiếu cảm biến IoT (Zero-IoT Violation)
- **Nguyên nhân**: Điểm ưu tiên can thiệp bị giảm về 0 nếu công trình chưa gắn cảm biến đo bụi.
- **Giải pháp**: Chuẩn hóa trọng số `sum(score * w) / sum(w)` trên các kênh đo khả dụng. Không bao giờ gán điểm 0 cho công trình vi phạm chỉ vì thiếu cảm biến.

### 🚨 Trap 4.2: Hardcoded Test Paths `src/modules/...` làm fail test khi chạy đa thư mục
- **Nguyên nhân**: File test dùng `path.resolve('src/modules/...')` khiến test chỉ chạy được khi CWD là thư mục con `app`, nếu chạy từ root `D:/...` sẽ bị lỗi `ENOENT`.
- **Giải pháp**: Luôn dùng helper `getFilePath(relPath)` tìm kiếm lần lượt ở `[CWD, app, ..]` để hỗ trợ cả lệnh chạy đơn lẻ `node --test app/tests/<file>.test.js` từ root và `npm test` bên trong thư mục `app`.

- **Nguyên nhân**: Gán điểm 0 cho phần cảm biến khiến điểm tổng bị kéo tụt một cách oan uổng.
- **Giải pháp**: Khi `sensor.available === false`, tự động chuẩn hóa 4 thành phần còn lại chia cho tổng trọng số 90% (`sum(score * w) / 0.90`).

### 🚨 Trap 4.2: Gian lận ảnh khắc phục nhà thầu
- **Nguyên nhân**: Nhà thầu tải ảnh từ nơi khác hoặc ảnh cũ không đúng hiện trường.
- **Giải pháp**: Kiểm tra Geofence bằng công thức Haversine giữa vị trí GPS của ảnh và tọa độ công trình. Nếu khoảng cách `> 50m`, hệ thống từ chối hoặc cảnh báo đỏ `geofenceValid: false`.

### 🚨 Trap 4.3: Bẫy Ảo Tưởng Thẩm Quyền Hành Chính & Mock Token PKI
- **Nguyên nhân**: Cố gắng giả lập luồng ký số USB Token Ban Cơ Yếu / CA Nhà nước với mã PIN giả (PIN 1234), hoặc tự phong quyền ra quyết định xử phạt vi phạm hành chính thay cơ quan nhà nước.
- **Giải pháp**: Định vị đúng Civic Tech: Bằng chứng số chống sửa đổi (Tamper-Evident SHA-256 Digest). DustGuard đóng vai trò cuốn nhật ký đối chứng minh bạch (Dossier A4) để cộng đồng và thanh niên đối thoại xây dựng với Ban Quản lý Dự án hoặc gửi UBND Phường hỗ trợ xử lý.

### 🚨 Trap 4.4: Bẫy Tuyên Bố Sai Lệch về Mã Băm SHA-256 ("Bằng chứng pháp lý niêm phong")
- **Nguyên nhân**: Dùng cụm từ "bằng chứng pháp lý niêm phong" hay tự xưng là chứng thư tư pháp làm sai lệch bản chất giải pháp CivicTech.
- **Giải pháp**: Chuẩn hóa định nghĩa SSOT: *"DustGuard lưu hash SHA-256 để hỗ trợ phát hiện việc tệp bị thay đổi sau khi ghi nhận"* (tamper-evident, không nói 'bằng chứng pháp lý niêm phong'). Cơ chế băm Web Crypto ngay tại thiết bị giúp bảo vệ tính toàn vẹn và minh bạch của ảnh hiện trường.

### 🚨 Trap 4.5: Bẫy Ngôn Ngữ Cưỡng Chế ("buộc công trình...") & Định Vị Sai Hệ Thống 1022 / iHanoi
- **Nguyên nhân**: Sử dụng các từ ngữ cưỡng chế hành chính ("buộc công trình phải...", "chế tài...") hoặc ngộ nhận DustGuard thay thế hệ thống tiếp nhận của cơ quan nhà nước.
- **Giải pháp**:
  1. Tuyệt đối dùng câu chuẩn hóa: *"giúp cộng đồng tạo chuỗi bằng chứng trước–sau, vị trí và dòng thời gian rõ ràng; từ đó một vấn đề có thể được theo dõi tốt hơn và, khi cần, được chuyển tới đơn vị có trách nhiệm xử lý."*
  2. Định vị 1022 / iHanoi là **ĐIỂM TÍCH HỢP** kết nối case, không thay thế hệ thống hành chính chính thức.
  3. Chuẩn hóa **Structured Civic Dossier** 4 khối A4 phục vụ đối thoại xây dựng và phối hợp khắc phục hiện trường.

### 🚨 Trap 4.6: Bẫy Rơi vào Khoảng Trống Thông Tin khi Nộp 1022/iHanoi (Information Void Trap)
- **Nguyên nhân**: Người dân nộp đơn lên 1022 hoặc ứng dụng iHanoi nhưng không lưu lại mã số biên nhận / Ticket, dẫn đến việc cả cộng đồng và CLB không biết tiến độ xử lý ra sao, vụ việc bị rơi vào "khoảng trống thông tin".
- **Giải pháp**: 
  1. Cung cấp nút **"Sao chép nộp 1022 / iHanoi (1-Chạm)"** tự động định dạng văn bản chuẩn (Địa chỉ, Tọa độ GPS, Diễn biến Trước/Sau, Link Dossier A4 và Mã QR).
  2. Bổ sung ô nhập & quản lý **Mã Ticket / Biên nhận 1022** ngay trong Không gian Vụ việc (`CommunityCaseWorkspace.jsx`), lưu trữ vào D1 SSOT và công khai minh bạch trạng thái (`ĐÃ TIẾP NHẬN` / `ĐANG XỬ LÝ` / `ĐÃ KHẮC PHỤC`) cho toàn bộ cộng đồng cùng giám sát.

### 🚨 Trap 4.7: Bẫy Đứt Gãy Chu Trình Khép Kín (Broken Closed-Loop Trap)
- **Nguyên nhân**: Đóng hồ sơ hoặc nghiệm thu vội vã chỉ dựa trên báo cáo miệng hoặc lời hứa hẹn khắc phục của đơn vị thi công mà không có kiểm tra đối chứng thực địa chu trình 24h–48h.
- **Giải pháp**: Bắt buộc tuân thủ 11-Stage Canonical Workflow trong [`.agents/ssot/WORKFLOWS.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/WORKFLOWS.md). Chỉ được chuyển sang trạng thái `RESOLVED` / `CLOSED` khi có:
  1. Cặp ảnh đối chứng Before (Trước) và After (Sau) đạt kiểm tra Geofence $\le 50\text{m}$.
  2. Mã băm SHA-256 tamper-evident được niêm phong vào hồ sơ.
  3. Kết quả tái kiểm tra thực địa Follow-up đạt trạng thái `BETTER`.
  4. Định lượng rõ ràng chỉ số $\Delta\text{Risk}$ và giá trị bảo vệ học đường/cộng đồng lân cận.

### 🚨 Trap 4.8: Bẫy Giả Lập Vai Trò Quyền Lực Nhà Nước (Bureaucratic Role Illusion)
- **Nguyên nhân**: Tạo ra hệ thống vai trò phức tạp giả lập các cơ quan chức năng (Inspector Bộ trưởng, Thẩm phán, Cơ quan cưỡng chế xử phạt) khiến dự án đi sai lệch bản chất CivicTech và gây rủi ro pháp lý/nghiệp vụ.
- **Giải pháp**: Tinh gọn hệ thống Role chỉ giữ đúng 5 vai trò thực tế SSOT theo [`.agents/ssot/ROLES.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/ROLES.md):
  1. `PUBLIC` (Công chúng xem AQI tổng hợp, xu hướng).
  2. `CITIZEN` (Người dân / Thanh niên gửi ghi nhận hiện trường, nhận điểm rèn luyện QR).
  3. `OPERATOR` (Điều phối viên / Reviewer duyệt hàng đợi, tạo dossier, chuyển giao 1022).
  4. `SITE_REPRESENTATIVE` (Đơn vị thi công xem hiện trường, nộp ảnh dập bụi geofence <= 50m).
### 🚨 Trap 4.9: Bẫy Thuật Ngữ "Violation Score" & Thiếu Tính Giải Thích Minh Bạch (Black-box Risk)
- **Nguyên nhân**: Sử dụng thuật ngữ "Violation Score" khiến người dùng và ban giám khảo hiểu nhầm là hệ thống AI tự phong quyền phán quyết hành vi vi phạm pháp luật (trái nguyên tắc *AI is Assistant, Not Judge*), hoặc chấm một điểm số chung chung mà không giải thích được vì sao ra số điểm đó.
- **Giải pháp**:
  1. **Chuẩn hóa 100%**: Luôn gọi là **'Priority Score' (0-100)** / **'Điểm ưu tiên can thiệp'**. Tuyệt đối cấm và loại bỏ mọi biến, hằng số, API hay copy text chứa "Violation Score".
  2. **Công thức 6 yếu tố minh bạch**: Kết hợp Base severity (nồng độ PM vượt chuẩn QCVN 05:2023), Duration (thời gian duy trì liên tục), Sensor confidence (độ tin cậy cảm biến), Sensitive proximity (<300m trường học/bệnh viện), Citizen corroboration (đếm người phản ánh độc lập chống spam), và Historical recurrence (tái diễn).
  3. **UI Explainability**: Luôn hiển thị danh sách thẻ giải thích trực quan (`+ High PM10 (165 µg/m³)`, `+ 3 citizen reports`, `+ 220m from school`, `+ 2 past warnings`) và dòng diễn giải `whyScoreX` để bất kỳ ai cũng có thể đọc hiểu trong 2 giây.

---

### 🚨 Trap 2.4: Bẫy Trải Nghiệm Ghi Nhận Quá Dài Trên Hiện Trường (Long Field Form Friction Trap)
- **Nguyên nhân**: Bắt buộc công dân hoặc thanh niên phải qua 5 bước chi tiết khi đang đứng ngoài đường/công trường nắng gió gây bỏ dở ghi nhận.
- **Giải pháp**: Cung cấp chế độ **Ghi nhận 3-chạm (<30s)**: `[Chạm 1: Chụp/Chọn ảnh ➔ Chạm 2: Chọn nguồn ô nhiễm ➔ Chạm 3: Gửi ngay]` tự động kích hoạt GPS, nén ảnh < 300KB, gỡ EXIF nhạy cảm và sinh hash SHA-256 trong chưa đầy 30 giây.

---

## 📷 5. Image Processing, EXIF Privacy & Cost Claims Traps

### 🚨 Trap 5.1: `FileReader.readAsDataURL` ném TypeError khi nhận Object từ `compressImage`
- **Nguyên nhân**: Hàm `compressImage` trả về Object `{ dataUrl, sizeKB, compressed, sha256 }`, nhưng caller vô tình gọi `reader.readAsDataURL(compressed)` thay vì dùng trực tiếp `compressed.dataUrl`.
- **Giải pháp**: Luôn sử dụng trực tiếp `compressed.dataUrl` và `compressed.sha256` được tính toán sẵn từ module nén.

### 🚨 Trap 5.2: Lộ Siêu Dữ Liệu Riêng Tư EXIF Người Chụp
- **Nguyên nhân**: Tải trực tiếp file ảnh gốc từ điện thoại lên R2/Database, làm lộ tọa độ nhà riêng, số serial thiết bị hoặc camera model của người dân/thanh niên.
- **Giải pháp**: Tự động lọc sạch toàn bộ segment EXIF APP1 (`0xFFE1`) trên client trước khi gửi lên máy chủ (qua canvas re-encode hoặc `stripExifFromJpegBinary`), đồng thời tính toán mã băm SHA-256 trên ảnh đã lọc sạch để bảo đảm tính toàn vẹn chứng cứ.

### 🚨 Trap 5.3: Lỗi UTF-8 BOM trên Windows làm hỏng MCP Config JSON
- **Nguyên nhân**: Khi ghi file config JSON trên Windows bằng PowerShell (`Out-File` / `Set-Content`), mặc định có thể sinh ra ký tự Byte Order Mark `\uFEFF` ở đầu file. Trình phân tích cú pháp JSON chuẩn của IDE/Node.js không parse được và báo lỗi: `Error: Invalid JSON in MCP config file. Unexpected token '﻿'`.
- **Giải pháp**: Luôn ghi file JSON bằng Node.js (`fs.writeFileSync(..., 'utf8')`) hoặc UTF-8 No BOM để đảm bảo JSON parse hoàn hảo trên mọi nền tảng.

### 🚨 Trap 5.4: Bẫy Tuyên Bố Chi Phí $0 Tuyệt Đối (Claim Inaccuracy)
- **Nguyên nhân**: Tuyên bố "Hệ thống hoàn toàn 0đ vĩnh viễn" mà bỏ qua các chi phí thực tế khi vận hành sản phẩm.
- **Giải pháp**: Luôn sử dụng câu claim chuẩn hóa: *"Chi phí hạ tầng pilot có thể gần bằng 0 trong hạn mức miễn phí hiện tại của Cloudflare (ghi nhận khả năng phát sinh tên miền, email, dung lượng mở rộng khi scale)."*

     `"Mang tính hỗ trợ tra cứu, không thay thế kết luận thẩm quyền"` (kết quả so sánh nồng độ QCVN 05 hay an toàn thi công QCVN 18 là công cụ hỗ trợ ra quyết định, không thay thế kết luận giám định chính thức).
  3. **Zero-IoT Resilient Queue**: Hàng đợi tác nghiệp hiển thị minh bạch 4 khối (Signal, Telemetry, Citizen Evidence, SLA) và tự động chuẩn hóa hoạt động ngay cả khi không có cảm biến vật lý.

---

## 📡 6. Sensor, Telemetry & Data Quality Integrity Traps

### 🚨 Trap 6.1: Bẫy Giả Lập Số Đo Cho Kênh Phần Cứng Không Hỗ Trợ (Zero-Fake Violation)
- **Nguyên nhân**: Thiết bị thực tế chỉ có đầu đọc quang học đo PM2.5/PM10 (`BASIC_OPTICAL_PM`), nhưng code backend lại tự ý gán giá trị giả lập ngẫu nhiên cho PM1.0, Nhiệt độ hoặc Độ ẩm.
- **Giải pháp**: Khóa cứng SSOT `HARDWARE_PROFILES` trong `sensor.rules.js`. Kênh phần cứng nào không hỗ trợ bắt buộc giữ nguyên `null`. Tuyệt đối không mock/tổng hợp số liệu giả tạo cảm giác đầy đủ.

### 🚨 Trap 6.2: Bẫy Tấn Công Phát Lại (Replay Attack) & Sai Lệch Đồng Hồ Thiết Bị IoT
- **Nguyên nhân**: Kẻ xấu bắt gói tin viễn trắc hợp lệ và phát lại liên tục để thao túng điểm rủi ro hoặc làm tê liệt hàng đợi cảnh báo, hoặc thiết bị trôi đồng hồ RTC.
- **Giải pháp**: 
  1. Yêu cầu HMAC-SHA256 kèm `nonce` và số thứ tự tăng dần `seq` (`ReplayProtector.validateAndRecord`).
  2. Bắt buộc kiểm tra độ trôi thời gian: Gói tin có `timestamp` lệch quá $\pm 5$ phút so với giờ máy chủ bị từ chối với mã HTTP `400 Bad Request`.
  3. Chặn sequence rollback và ghi nhận packet loss ($seq_{curr} - seq_{prev} - 1$).

### 🚨 Trap 6.3: Bẫy Đóng Băng Tín Hiệu / Treo Cảm Biến (ADC Freeze & Flatline Trap)
- **Nguyên nhân**: Cảm biến bị treo phần cứng (ADC freeze) hoặc mạch vi điều khiển phát lại giá trị tĩnh cũ qua mạng, khiến hệ thống tưởng nồng độ bụi ổn định bình thường.
- **Giải pháp**: Tích hợp thuật toán phát hiện Flatline trong `DataQualityEngine.detectFlatline`: Nếu nhận $\ge 5$ mẫu đo liên tiếp có giá trị PM10 & PM2.5 giống hệt nhau trải dài $\ge 10$ phút, lập tức đánh dấu cảm biến `FAULTY`, hạ điểm chất lượng dữ liệu và kích hoạt cảnh báo kiểm tra bảo dưỡng phần cứng.

---

## 🎨 7. Layout, Breakpoint & Responsive Table Traps

### 🚨 Trap 7.1: Bẫy Tailwind Template String `hidden` ghi đè `lg:flex`
- **Nguyên nhân**: Dùng `${isOpen ? 'flex' : 'hidden'} lg:flex-row ...` mà không ghi rõ `hidden lg:flex`. Kết quả là class `hidden` (display: none) luôn thắng trên Desktop vì thiếu class `lg:flex` để override.
- **Giải pháp**: Luôn viết rõ `${isOpen ? 'flex' : 'hidden lg:flex'}` cho các thanh công cụ / menu điều khiển header để đảm bảo luôn hiển thị đầy đủ trên màn hình máy tính.

### 🚨 Trap 7.2: Bẫy Rớt Dòng Đơn Ký Tự / Đơn Vị (`µg/m³`, `Phạm Hoàng Nam`)
- **Nguyên nhân**: Bảng dữ liệu chia các cột thông số (chỉ số PM, ngày giờ, tên cán bộ) thành độ rộng quá hẹp (`w-24`, `w-28`), trong khi text tiếng Việt hoặc chuỗi đơn vị `PM10 175 µg/m³` bị ngắt chữ đơn lẻ.
- **Giải pháp**: Áp dụng `whitespace-nowrap` trên các cột chỉ số đo kiểm, mốc SLA, tên cán bộ và nút hành động; đồng thời cấp `min-w-[320px]` kèm `line-clamp-2` cho cột Tên vụ việc / Công trình để tận dụng trọn vẹn bề ngang màn hình lớn.

---

## 🏗️ 8. Contractor Workspace & Zero-Login Geofence Traps

### 🚨 Trap 8.1: Bẫy Token Hết Hạn & Lộ Dữ Liệu Chéo Nhà Thầu (Tenant Isolation)
- **Nguyên nhân**: Token truy cập Zalo/SMS không có thời hạn hết hạn cứng (TTL 72h) hoặc không kiểm tra giới hạn công trình phụ trách, khiến người có link xem được các dự án của nhà thầu khác.
- **Giải pháp**: 
  1. Token Zero-Login HMAC có thời hạn tối đa 72 giờ (`expiresAt`), gắn cố định với `siteId` và `actionId`.
  2. Tại route `/contractor/access/:token` (`ContractorPortal.jsx`), xác thực token ngay lập tức; nếu hết hạn thì báo lỗi rõ ràng và khóa quyền thao tác.
  3. Mọi yêu cầu nộp minh chứng nhanh (`POST /api/contractor/quick-submit`) đều tính toán khoảng cách Haversine so với tọa độ công trình và lưu mã băm SHA-256 đối chứng vào D1 SSOT.

---

## 📜 9. API Contract, OpenAPI & RFC-7807 Traps

### 🚨 Trap 9.1: Trả về lỗi không đồng nhất cấu trúc RFC-7807 Problem Details
- **Nguyên nhân**: Một số route trong Hono Edge Worker trả về trực tiếp `{ code: '...', error: '...' }` thay vì gọi `formatRfc7807Error`, gây lệch chuẩn với OpenAPI 3.0.3 spec và phá vỡ cấu trúc xử lý lỗi thống nhất của frontend clients.
- **Giải pháp**: Luôn gọi `formatRfc7807Error(status, code, title, detail, instance)` từ `auth/human/clerk.middleware.js` cho mọi mã lỗi HTTP 4xx và 5xx. Điều này đảm bảo payload luôn chứa đủ `{ status: 'error', statusCode, code, type, title, detail, instance, timestamp }` và tương thích 100% với RFC-7807.

---

## 📑 10. Document Studio, LegalTech & Digital Signature Traps

### 🚨 Trap 10.1: Bẫy Rò Rỉ `undefined` / `[object Object]` Trong Văn Bản Hành Chính (Zero Undefined Guarantee)
- **Nguyên nhân**: Khi các trường dữ liệu hiện trường (`site`, `inspection`, `telemetry`, `legal`) chưa được thu thập đầy đủ hoặc có tên khác nhau (`contractor` vs `contractorName`, `address` vs `location`), việc nối chuỗi hoặc duyệt AST mặc định sẽ in ra `undefined` hoặc `null` trực tiếp vào biên bản pháp lý.
- **Giải pháp**: 
  1. Trong `document-template-engine.js`, triển khai fallback map `VARIABLE_ALIASES` và `DEFAULT_VARIABLE_PLACEHOLDERS`.
  2. Bất kỳ biến thiếu nào đều được thay thế bằng nhãn giữ chỗ có nghĩa (ví dụ: `[Chưa xác định]`, `[Chưa có dữ liệu đo kiểm]`), tuyệt đối không bao giờ để lọt chuỗi `"undefined"`, `"null"`, `"NaN"` hay `"[object Object]"`.

### 🚨 Trap 10.2: Bẫy Can Thiệp Sau Khi Ký Số (Digital Signature Tampering Trap)
- **Nguyên nhân**: Văn bản sau khi được Lãnh đạo duyệt ký số CA nếu không được bảo vệ bằng chữ ký số băm toàn vẹn (HMAC-SHA256 trên nội dung và thông tin người ký), người dùng có thể chỉnh sửa nội dung bản nháp trong CSDL mà hệ thống vẫn báo "Đã ký".
- **Giải pháp**: 
  1. Khi phê duyệt (`approveDraftDocument`), hệ thống tính toán SHA-256 trên toàn bộ nội dung và tạo HMAC signature digest với secret máy chủ lưu vào `draft.hash`.
  2. Tại endpoint `/api/documents/drafts/:id/verify-signature`, hệ thống tái tính toán chữ ký từ nội dung hiện tại và so sánh thời gian thực bằng `crypto.timingSafeEqual`. Nếu nội dung bị thay đổi dù chỉ 1 ký tự, `verified: false` ngay lập tức.

---

## 🧪 11. Test Runner, ESM & Verification Pipeline Traps

### 🚨 Trap 11.1: Node ESM `ERR_UNKNOWN_FILE_EXTENSION` Khi Module JS Thuần Import File `.jsx`
- **Nguyên nhân**: Trong runtime Node.js ESM thuần (`node --test`), các module thư viện chia sẻ (như `legal-document-engine/index.js`) nếu import trực tiếp React component có đuôi `.jsx` sẽ bị lỗi `ERR_UNKNOWN_FILE_EXTENSION` vì Node không parse JSX.
- **Giải pháp**: Tách biệt rõ ràng: Module core logic thuần JS chỉ export schema/validator/generator JS. Các React JSX component (như `A4InteractiveEditor.jsx`) được import trực tiếp từ phía React UI components.

### 🚨 Trap 11.2: Path Resolution Bị Lặp Thư Mục (`app/app/...`) Trong Test Suites
- **Nguyên nhân**: Dùng `path.resolve('app/src/...')` khi test runner chạy tại thư mục `app/` sẽ dẫn đến đường dẫn `app/app/src/...` gây lỗi `ENOENT`.
- **Giải pháp**: Luôn dùng helper đa nền tảng:
  ```javascript
  function resolveAppPath(relPath) {
    const clean = relPath.replace(/^app\//, '');
    if (fs.existsSync(path.resolve(clean))) return path.resolve(clean);
    if (fs.existsSync(path.resolve('app', clean))) return path.resolve('app', clean);
    return path.resolve(clean);
  }
  ```

### 🚨 Trap 11.3: Bảng NĐ 30/2020 DXA Table Width Algorithm & Cross-Directory Script Execution
- **Nguyên nhân**: `calculateNd30TableWidths(2)` ban đầu hardcode tỷ lệ 40%/60% của Header thay vì chia đều cho các bảng dữ liệu tổng quát; đồng thời script `verify-live-api-outputs.js` hardcode đường dẫn `server/worker.js` gây lỗi `ENOENT` khi chạy từ root directory.
- **Giải pháp**:
  1. `calculateNd30TableWidths(colCount, totalWidthDxa = 9355)` phân bổ đều các cột theo `Math.floor(totalWidthDxa / colCount)` và bù phần dư vào cột cuối cùng.
  2. Dùng `existsSync('server/worker.js') ? 'server/worker.js' : 'app/server/worker.js'` hoặc `new URL('../server/worker.js', import.meta.url)` trong các công cụ verification.

---

## 🎬 12. Video Production, Audio Synthesis & FFmpeg / CLI Traps

### 🚨 Trap 12.1: `UnicodeEncodeError: 'charmap' codec can't encode character` khi in Emoji trên Windows PowerShell
- **Nguyên nhân**: Mặc định luồng `sys.stdout` trên Windows Console chạy bảng mã `cp1252` hoặc `cp437`. Khi script Python in các biểu tượng Emoji như `🔍`, `✅`, `🎬` sẽ bị crash với mã lỗi `UnicodeEncodeError`.
- **Giải pháp**: Luôn cấu hình cưỡng bức UTF-8 cho luồng stdout/stderr ở ngay đầu mọi file Python script:
  ```python
  if hasattr(sys.stdout, "reconfigure"):
      sys.stdout.reconfigure(encoding="utf-8")
  if hasattr(sys.stderr, "reconfigure"):
      sys.stderr.reconfigure(encoding="utf-8")
  ```

### 🚨 Trap 12.2: Tái sinh lặp lại toàn bộ Audio Voiceover gây tốn thời gian và rủi ro Network Timeout
- **Nguyên nhân**: Mỗi lần chạy pipeline render video lại gọi lại API `edge-tts` tải lại 12 file audio từ đầu dù kịch bản không thay đổi, làm chậm chu kỳ inner dev loop (> 45s thay vì < 1s).
- **Giải pháp**: Triển khai cơ chế Audio Cache thông minh: Kiểm tra nếu `out_mp3.exists()` và `out_mp3.stat().st_size > 1000` và `duration > 1.0s` thì tự động tái sử dụng, chỉ sinh lại khi file chưa có hoặc khi truyền cờ `--force`.

---

## 📡 13. IoT & Sensor Telemetry Pipeline Traps

### 🚨 Trap 13.1: Lỗi Replay Attack & Timestamp Clock Drift Không Đồng Bộ Giữa Express và Worker
- **Nguyên nhân**: Thiết bị IoT gửi bản tin telemetry kèm timestamp từ RTC địa phương. Nếu không kiểm tra độ lệch giờ (RTC drift > 5 phút) hoặc không có sliding window cache ghi nhớ chữ ký/nonce, kẻ xấu có thể phát lại gói tin cũ (Replay Attack) để giả lập ô nhiễm nhân tạo.
- **Giải pháp**: 
  1. `ReplayProtector` triển khai sliding window 5 phút (`maxDriftMs = 300000`), từ chối mã 400 nếu lệch quá 5 phút và 409 nếu phát hiện trùng lặp khóa `sensorCode_timestamp_signature`.
  2. Bổ sung `app.post(['/api/telemetry', '/api/v1/telemetry'])` vào Express router map trực tiếp sang `sensorRoutes` bảo đảm tính nhất quán 100% với Cloudflare Worker Hono edge runtime.

### 🚨 Trap 13.2: Bẫy Mất Cân Bằng Trọng Số Khi Không Có Cảm Biến (Zero-IoT Resilience Trap)
- **Nguyên nhân**: Nếu hệ thống trừ thẳng 10% điểm khi không có cảm biến, các khu vực ngoại thành hoặc công trình chưa lắp đặt trạm đo sẽ luôn bị đánh giá thấp rủi ro dù đang bị phản ánh gay gắt từ người dân và tiếp giáp trường học.
- **Giải pháp**: Thuật toán `DustRiskEngine` tự động lọc các thành phần `available` và tái chuẩn hóa: `rawScore = weightedSum / totalAvailableWeight` (với 4 thành phần còn lại, `totalAvailableWeight = 0.90`). Hệ thống giữ nguyên 100% độ nhạy rủi ro khi có 0 cảm biến kết nối.
