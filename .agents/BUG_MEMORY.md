# BUG MEMORY & ROOT CAUSE REFERENCE — DUSTGUARD VN

> **Mục đích**: Lưu trữ tức thì các bẫy lỗi (bug traps), nguyên nhân gốc rễ (root cause) và mẫu xử lý chuẩn để phòng ngừa tái phát trong quá trình code.

---

## 🗄️ 1. D1 SQLite & Database Traps

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

---

## ⚛️ 2. React Hooks & UI Architecture Traps

### 🚨 Trap 2.1: Lỗi TDZ (Temporal Dead Zone) trong React Hooks
- **Nguyên nhân**: `useEffect` phụ thuộc vào một biến được tạo bởi `useMemo` ở dòng code phía dưới nó ➔ Bị lỗi `ReferenceError: Cannot access '...' before initialization`.
- **Giải pháp**: Luôn khai báo toàn bộ `useState`, `useRef`, `useMemo`, `useCallback` **TRƯỚC** tất cả các `useEffect`.

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

### 🚨 Trap 5.3: Bẫy Tuyên Bố Chi Phí $0 Tuyệt Đối (Claim Inaccuracy)
- **Nguyên nhân**: Tuyên bố "Hệ thống hoàn toàn 0đ vĩnh viễn" mà bỏ qua các chi phí thực tế khi vận hành sản phẩm.
- **Giải pháp**: Luôn sử dụng câu claim chuẩn hóa: *"Chi phí hạ tầng pilot có thể gần bằng 0 trong hạn mức miễn phí hiện tại của Cloudflare (ghi nhận khả năng phát sinh tên miền, email, dung lượng mở rộng khi scale)."*

### 🚨 Trap 4.10: Bẫy Tư Duy "Thanh Tra Trừng Phạt" & Thiếu Disclaimer Quy Chuẩn
- **Nguyên nhân**: Thiết kế giao diện theo lối mòn cơ quan nhà nước xử phạt vi phạm hành chính, áp đặt kết luận pháp lý mà không có thẩm quyền nhà nước, hoặc trích dẫn quy chuẩn mà thiếu tuyên bố từ chối trách nhiệm (disclaimer) khiến giải pháp CivicTech bị hiểu sai mục đích.
- **Giải pháp**:
  1. **Chuyển đổi toàn diện sang Operational Review & Verification**: Operator đóng vai trò Điều phối viên & Thẩm tra viên hỗ trợ xác minh sự kiện theo 4 kết quả chuẩn hóa (`confirmed_signal`, `not_confirmed`, `insufficient_evidence`, `needs_follow_up`).
  2. **Khóa cứng Disclaimer bắt buộc trên toàn bộ UI Tra cứu Quy chuẩn**:
     `"Mang tính hỗ trợ tra cứu, không thay thế kết luận thẩm quyền"` (kết quả so sánh nồng độ QCVN 05 hay an toàn thi công QCVN 18 là công cụ hỗ trợ ra quyết định, không thay thế kết luận giám định chính thức).
  3. **Zero-IoT Resilient Queue**: Hàng đợi tác nghiệp hiển thị minh bạch 4 khối (Signal, Telemetry, Citizen Evidence, SLA) và tự động chuẩn hóa hoạt động ngay cả khi không có cảm biến vật lý.


