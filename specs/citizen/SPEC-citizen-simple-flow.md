# SPEC-citizen-simple-flow: Quy Trình Giám Sát & Phản Ánh Môi Trường Dành Cho Người Dân

> **Tài liệu tham chiếu hình ảnh SSOT**: [`docs/ui/refs/ref-citizen-flow.png`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/ui/refs/ref-citizen-flow.png)  
> **Phân hệ**: Người dân đô thị & Tình nguyện viên cộng đồng (`app/src/apps/citizen`)  
> **Trạng thái**: Draft / Sẵn sàng triển khai  
> **Nguyên tắc**: Sáng màu, tương phản cao, tuyệt đối không dùng Glassmorphism, Zero-jargon tiếng Việt đời thường, D1 SQLite SSOT.

---

## 1. Người Dùng (User Persona)
- **Đối tượng**: Người dân đô thị, người đi đường, thanh niên tình nguyện và cư dân sinh sống gần các công trình xây dựng, tuyến đường vận chuyển đất đá phế thải.
- **Ngữ cảnh sử dụng**:
  - **Trên điện thoại di động (Mobile App / Mobile Web)**: Đang di chuyển ngoài đường, bắt gặp xe chở đất không che bạt hoặc công trình bụi mù mịt; cần thao tác 1 tay, nhanh gọn trong 30 giây dưới ánh sáng mặt trời.
  - **Trên máy tính cá nhân / Laptop (Web)**: Ở nhà hoặc công sở; muốn theo dõi danh sách phản ánh của khu phố, kiểm tra kết quả xử lý và đánh giá mức độ hài lòng với kết quả dập bụi của nhà thầu.

---

## 2. Mục Tiêu Của Người Dùng (User Goal)
- Báo cáo nhanh hiện trường bụi ô nhiễm chỉ qua 3 bước cốt lõi: Chụp ảnh $\to$ Xác nhận vị trí $\to$ Chọn loại vấn đề $\to$ Gửi phản ánh.
- Nắm rõ tiến trình xử lý minh bạch (từ lúc tiếp nhận $\to$ xác minh $\to$ đôn đốc nhà thầu $\to$ khắc phục xong).
- Xem ảnh đối chứng thực tế Trước/Sau và trực tiếp đánh giá chất lượng hiện trường ("Đã cải thiện" / "Chưa hoàn toàn" / "Chưa xử lý") để đảm bảo ô nhiễm được giải quyết dứt điểm.

---

## 3. Điểm Vào Giao Diện (Entry Point)
- **Web Laptop**:
  - Thanh Sidebar trái cố định:
    - Logo DustGuard
    - `Trang chủ`: `/citizen`
    - `Phản ánh mới`: `/citizen/report/new`
    - `Hồ sơ của tôi`: `/citizen/reports`
    - `Cá nhân`: `/citizen/profile`
    - Đáy Sidebar: Hỗ trợ cộng đồng `1800 1234`
- **Mobile Web / App**:
  - Thanh điều hướng đáy (Bottom Navigation Bar) cố định:
    - `Trang chủ`: `/citizen`
    - `Phản ánh`: `/citizen/report/new`
    - `Hồ sơ`: `/citizen/reports`
    - `Cá nhân`: `/citizen/profile`
  - Nút hành động nổi bật trên trang chủ: `+ Phản ánh mới` (Touch target $\ge 48\text{px}$).

---

## 4. Hành Trình Người Dùng (User Journey)

### A. Luồng Trên Laptop / Máy Tính (Web) — 5 Màn Hình Chuẩn
1. **Màn 1: Trang chủ**
   - Header chào mừng: "Xin chào! Cùng chung tay vì bầu không khí trong lành."
   - Thẻ chỉ số không khí: "38 AQI - Tốt" (icon mặt cười xanh lá).
   - Bản đồ khu vực kèm vị trí hiện tại của người dân.
   - Thẻ tóm tắt phản ánh: "X phản ánh đang xử lý" kèm liên kết "Xem chi tiết".
   - Nút lớn: `+ Phản ánh mới`.
2. **Màn 2: Danh sách phản ánh của tôi ("Hồ sơ của tôi")**
   - Bộ lọc tab 3 trạng thái: `Tất cả` | `Đang xử lý` | `Đã xong`.
   - Danh sách thẻ hồ sơ: Ảnh thu nhỏ hiện trường, Loại phản ánh & Tuyến đường (ví dụ: *Bụi công trình • Dịch Vọng Hậu*), Thời gian ghi nhận, Huy hiệu trạng thái (*Đang xử lý*, *Đã xác minh*, *Đã xong*), Mũi tên xem chi tiết.
3. **Màn 3: Chi tiết phản ánh**
   - Nút quay lại `← Quay lại`.
   - Tiêu đề: "Chi tiết phản ánh #DG-2026-XXXX", Huy hiệu trạng thái hiện thời.
   - Thông tin cơ bản: Loại vi phạm, Địa chỉ cụ thể, Thời gian phản ánh.
   - Thư viện ảnh hiện trường: Hiển thị bộ ảnh minh chứng ban đầu (kèm nhãn `+N` nếu có nhiều ảnh).
   - Trục tiến trình xử lý dọc (Vertical Timeline):
     - Mốc 1: Đã tiếp nhận
     - Mốc 2: Đã xác minh
     - Mốc 3: Đã chuyển đơn vị xử lý
     - Mốc 4: Đang xử lý
     - Mốc 5: Tái kiểm
     - Mốc 6: Hoàn tất
4. **Màn 4: Kết quả xử lý**
   - Tiêu đề: "Kết quả xử lý #DG-2026-XXXX" kèm huy hiệu `Đã xử lý`.
   - Đối chứng ảnh song song: **Trước xử lý** (Bụi mù mịt) $\leftrightarrow$ **Sau xử lý** (Đã dọn dẹp, phun nước dập bụi).
   - Hộp thông tin xử lý: Thời gian khắc phục, Biện pháp kỹ thuật ("Đã phun nước giảm bụi, che chắn khu vực thi công"), Chỉ số chất lượng không khí PM2.5 Trước vs Sau.
   - Nút hành động chính: `Xác nhận kết quả`.
5. **Màn 5: Xác nhận & Đánh giá kết quả**
   - Tiêu đề: "Đánh giá kết quả #DG-2026-XXXX".
   - Câu hỏi trực quan: "Hiện trường đã được cải thiện chưa?"
   - 3 Thẻ lựa chọn cảm xúc lớn:
     - `Đã cải thiện` (Icon 😊 mặt cười - Viền xanh lá)
     - `Chưa hoàn toàn` (Icon 😐 mặt bình thường - Viền vàng cam)
     - `Chưa xử lý` (Icon ☹️ mặt buồn - Viền cam đỏ)
   - Ô nhập "Ghi chú thêm (tùy chọn)" kèm bộ đếm ký tự `0/200`.
   - Khung "Chụp ảnh hiện trạng (nếu có)" cho phép gửi ảnh đối chứng thực tế.
   - Nút bấm gửi: `Gửi đánh giá`.

---

### B. Luồng Trên Điện Thoại Di Động (Mobile App) — 6 Màn Hình Chuẩn
1. **Màn 1: Trang chủ**: Tương tự Web nhưng tối ưu hiển thị 1 cột, thẻ AQI lớn, bản đồ mini, nút `+ Phản ánh mới` toàn chiều rộng dưới ngón cái.
2. **Màn 2: Chụp ảnh hiện trường**:
   - Giao diện khung ngắm ống kính (Camera Viewfinder).
   - Nút đóng `✕`, nút bật/tắt flash `⚡`.
   - Lưới căn góc hiện trường và hướng dẫn: "Chụp 1-3 ảnh để phản ánh rõ hơn".
   - Bộ 3 nút chụp đáy: Chọn ảnh từ máy | Bấm chụp hiện trường | Đổi camera.
3. **Màn 3: Xác nhận vị trí**:
   - Thanh tìm kiếm địa chỉ, bản đồ ghim vị trí chính xác.
   - Nút bấm nhanh: "📍 Dùng vị trí hiện tại" (lấy GPS thực tế qua Geolocation API).
   - Hộp hiển thị địa chỉ đã chọn và ô "Mô tả vị trí (tùy chọn)" (Ví dụ: Đối diện cổng trường...).
4. **Màn 4: Mô tả vấn đề**:
   - Lưới 4 danh mục trực quan kèm biểu tượng: `Bụi công trình`, `Bụi đường`, `Xe chở vật liệu`, `Đốt rác / Khói`, và nút `...` (Khác).
   - 3 mức độ vi phạm: `Nhẹ` | `Nhiều` | `Rất nhiều`.
   - Ô nhập "Mô tả bổ sung (tùy chọn)" tối đa 250 ký tự.
5. **Màn 5: Kiểm tra & Gửi**:
   - Tóm lược toàn diện: Ảnh hiện trường đã chụp, Vị trí, Loại phản ánh, Mức độ, Mô tả.
   - Hộp kiểm xác nhận trách nhiệm công dân: `☑ Thông tin tôi cung cấp phản ánh đúng hiện trường`.
   - Nút hành động: `Gửi`.
6. **Màn 6: Gửi thành công**:
   - Biểu tượng tick tròn xanh lá `✓` kích thước lớn.
   - Tiêu đề: "Đã ghi nhận phản ánh!", kèm mã hồ sơ `#DG-2026-XXXX`.
   - Khối thông báo: Trạng thái "Đã tiếp nhận" — "Hệ thống đang đánh giá và chuyển đơn vị phù hợp."
   - 2 nút điều hướng: `Theo dõi` (xem chi tiết hồ sơ vừa gửi) và `Về trang chủ`.

---

## 5. Dữ Liệu Đọc (Data Read)
- Bảng CSDL D1 SQLite:
  - `complaints`: Danh sách phản ánh công dân (`id`, `code`, `category`, `address`, `ward`, `latitude`, `longitude`, `description`, `status`, `createdAt`, `evidences`, `resolvedEvidences`, `citizenFeedback`).
  - `sites`: Thông tin công trình/khu vực liên quan (nếu đã liên kết).
  - `aqi_readings`: Chỉ số chất lượng không khí tham chiếu tại địa bàn.

---

## 6. Dữ Liệu Ghi Nhận (Data Written)
- **Tạo phản ánh mới**:
  - `INSERT INTO complaints`: `code` tự sinh (`DG-2026-XXXX`), `category`, `address`, `description`, `severity`, `status = 'PENDING'`, danh sách URL ảnh minh chứng và mã băm toàn vẹn SHA-256.
- **Đánh giá phản ánh đã khắc phục**:
  - `UPDATE complaints`: Cập nhật `citizenFeedback` (rating, feedback, feedbackEvidenceUrl, citizenFeedbackAt).
  - Nếu chọn "Chưa xử lý" / "Chưa hoàn toàn": Tự động kích hoạt cơ chế `REOPEN_REQUEST` và ghi chú yêu cầu cán bộ địa bàn phúc tra hiện trường.

---

## 7. Giao Tiếp API (API Endpoints)
- `GET /api/complaints`: Lấy danh sách phản ánh (hỗ trợ lọc theo trạng thái).
- `GET /api/complaints/:code`: Lấy chi tiết hồ sơ phản ánh theo mã code hoặc id.
- `POST /api/complaints`: Gửi phản ánh hiện trường mới từ công dân.
- `POST /api/complaints/upload`: Tải ảnh hiện trường lên máy chủ.
- `POST /api/complaints/:id/verify`: Gửi đánh giá kết quả xử lý của người dân (`isSatisfied`, `feedback`, `evidenceUrl`).

---

## 8. Phân Quyền & Ràng Buộc (Permissions & RBAC)
- **Người dân (Public Citizen)**: Không bắt buộc đăng nhập để nộp phản ánh nhanh (hạ thấp rào cản tham gia cộng đồng); dữ liệu số điện thoại được che mờ bảo mật dạng `091***456`.
- **Người dùng đã đăng nhập**: Tự động liên kết mã công dân vào hồ sơ và cộng điểm tích lũy / huy hiệu tình nguyện viên.

---

## 9. Luồng Xử Lý Lỗi & Trường Hợp Đặc Biệt
- **Mất mạng / Sóng yếu**: Hỗ trợ lưu bản nháp Offline (`localStorage` / `IndexedDB`), tự động đồng bộ khi có kết nối trở lại.
- **Không cấp quyền GPS**: Cung cấp ô tìm kiếm địa chỉ nhập tay thuận tiện, không chặn người dùng gửi báo cáo.
- **Ảnh dung lượng lớn**: Tự động nén ảnh tại máy khách trước khi gửi qua `image-compressor.js` để bảo đảm tốc độ nộp dưới 3 giây.

---

## 10. Yếu Tố Di Động & Trải Nghiệm Thực Tế (Mobile & Civic UI)
- **Viewport**: Đáp ứng chuẩn xác từ `360px`, `375px`, `390px`, `412px` đến Desktop `1280px+`.
- **Không vỡ khung, không cuộn ngang**: Tuyệt đối cấm `overflow-x`.
- **Touch Target**: Mọi nút bấm, thẻ tab, ô chọn có chiều cao tối thiểu $\ge 44\text{px}$.
- **Giao diện sáng màu**: Nền kem sáng `#FDFBF7` / `#FFFFFF`, chữ mực đậm `#1C1917` / `#1F2937`, màu nhấn xanh lá cây tự nhiên `#15803d` / `#166534`. Tuyệt đối không dùng hiệu ứng mờ nhòe kính (Glassmorphism).

---

## 11. Tiêu Chí Nghiệm Thu Khách Quan (Acceptance Criteria)
- [ ] **AC-1**: Layout Desktop hiển thị thanh Sidebar bên trái chuẩn theo ảnh tham chiếu, bao gồm Logo, 4 menu (`Trang chủ`, `Phản ánh mới`, `Hồ sơ của tôi`, `Cá nhân`) và số hỗ trợ `1800 1234`.
- [ ] **AC-2**: Layout Mobile hiển thị chuẩn thanh Topbar và Bottom Navigation Bar 4 tabs với vùng chạm $\ge 44\text{px}$.
- [ ] **AC-3**: Trang chủ hiển thị chuẩn thẻ AQI với điểm số to, mặt cười xanh lá, mini-map và nút lớn `+ Phản ánh mới`.
- [ ] **AC-4**: Luồng gửi phản ánh mới (`/citizen/report/new`) thực hiện chuẩn xác 5 bước theo thiết kế (Chụp ảnh $\to$ Xác nhận vị trí $\to$ Chọn loại & Mức độ $\to$ Kiểm tra $\to$ Thành công `#DG-2026-XXXX`).
- [ ] **AC-5**: Bấm F5 Reload sau khi gửi phản ánh, phản ánh mới lập tức xuất hiện trong danh sách "Hồ sơ của tôi" (`/citizen/reports`) đọc từ D1 SQLite.
- [ ] **AC-6**: Trang "Hồ sơ của tôi" có 3 tabs lọc (`Tất cả`, `Đang xử lý`, `Đã xong`), mỗi thẻ có ảnh thu nhỏ, tên công trình/địa điểm, thời gian và huy hiệu trạng thái tương phản cao.
- [ ] **AC-7**: Trang chi tiết phản ánh (`/citizen/reports/:id`) hiển thị đầy đủ bộ ảnh hiện trường, tiến trình xử lý 6 bước dạng stepper dọc.
- [ ] **AC-8**: Màn hình kết quả xử lý và Đánh giá kết quả cho phép người dân xem ảnh Before/After, chọn 3 mức độ hài lòng (Đã cải thiện / Chưa hoàn toàn / Chưa xử lý), nhập ghi chú, gửi thành công và ghi nhận bền vững vào CSDL D1.
- [ ] **AC-9**: Không phát sinh lỗi JavaScript console đỏ hoặc lỗi mạng 500 trong toàn bộ hành trình.
