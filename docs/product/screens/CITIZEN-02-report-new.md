# CIT-02 — Gửi Phản Ánh Hiện Trường 30 Giây (Report New Observation)

## 1. Screen Identity (Định Danh Màn Hình)
- **Mã màn hình**: `CIT-02`
- **Tên màn hình (VN)**: Gửi Phản Ánh Hiện Trường 30 Giây / Tạo Ghi Nhận Ô Nhiễm Mới
- **Tên màn hình (EN)**: Rapid Environmental Observation Submission (30-Second Citizen Flow)
- **Tuyến đường (Route)**: `/citizen/report/new`
  - Tuyến đường chuyển hướng tương thích (Aliases & Redirects): `/citizen/report`
- **Đường dẫn Component**: [`app/src/apps/citizen/pages/report-new/ReportNewPage.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/citizen/pages/report-new/ReportNewPage.jsx)
- **Khung giao diện (Layout)**: [`app/src/apps/citizen/layout/CitizenLayout.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/citizen/layout/CitizenLayout.jsx)
  - Desktop: Khung hiển thị trung tâm dạng thẻ tinh gọn `max-w-2xl` hoặc chia 2 cột logic trực quan.
  - Mobile: Giao diện biểu mẫu cuộn mượt mà, tối ưu thao tác bằng một tay ngón cái, nút gửi cố định hoặc ở cuối form với chiều cao $48\text{px}$.
- **Phân quyền người dùng (Role / RBAC)**: `public`, `citizen`, `youth` (Cho phép gửi phản ánh ẩn danh không cần đăng nhập — Zero Login Friction).
- **Trạng thái triển khai**: `ACTIVE` (Production Level 5 — Tích hợp xử lý nén ảnh HTML5 Canvas $<300\text{KB}$, mã băm SHA-256 Web Crypto, gỡ Exif bảo mật và lưu nháp ngoại tuyến khi mất sóng 4G).

---

## 2. Mục Đích & Bối Cảnh Nghiệp Vụ Thực Tế Đậm Chất Việt Nam

### 2.1. Nỗi đau thực tế từ các kênh tiếp nhận phản ánh truyền thống
- **Rào cản thủ tục phức tạp**: Các cổng dịch vụ công thông thường yêu cầu người dân phải đăng nhập tài khoản định danh VNeID, điền biểu mẫu hành chính hơn 15-20 trường dữ liệu rườm rà (họ tên, CCCD, ngày cấp, địa chỉ thường trú, cơ quan tiếp nhận...).
- **Nghẽn mạng khi tải ảnh dung lượng lớn**: Điện thoại thông minh hiện đại (iPhone, Samsung Galaxy, Xiaomi) chụp ảnh dung lượng từ $5\text{MB} - 18\text{MB}$. Khi người dân đứng ngoài đường với sóng $3\text{G}/4\text{G}$ yếu hoặc chập chờn, việc tải ảnh lên máy chủ thường bị đơ, quay vòng tròn và báo lỗi timeout thất bại.
- **Mất dấu vết và thiếu minh bạch**: Người dân gửi phản ánh xong không biết thông tin đi đâu, có được xử lý hay bị "chìm xuồng", dẫn đến tâm lý chán nản, không muốn tham gia giám sát cộng đồng.
- **Nguy cơ lộ lọt thông tin cá nhân & tranh chấp pháp lý**: Ảnh chụp từ điện thoại chứa siêu dữ liệu Exif (tọa độ nhà riêng, mã định danh thiết bị IMEI/serial) có thể làm lộ danh tính người phản ánh; ngược lại, ảnh không có chữ ký băm dễ bị nghi ngờ cắt ghép, chỉnh sửa vu khống doanh nghiệp.

### 2.2. Giải pháp Đột Phá 30 Giây của DustGuard VN
Màn hình `CIT-02` được thiết kế đặc thù cho điều kiện hiện trường tại Việt Nam với 5 trụ cột công nghệ:
1. **4 Danh mục vi phạm sát sườn đời sống**:
   - **Bụi phát tán từ công trình** (`CONSTRUCTION_DUST`): Thi công đào móng, đập phá nhà cũ, cắt đá mài bê tông không quây bạt lưới chắn bụi hoặc không có vòi phun sương.
   - **Xe tải chở đất cát không phủ bạt** (`UNCOVERED_TRANSPORT`): Xe ben cơi nới thành thùng, bạt che rách nát làm rơi vãi đất đá ra lòng đường gây nguy hiểm cho người đi xe máy.
   - **Bùn đất vương vãi ra lòng đường** (`DIRT_SPILLAGE`): Xe tải từ công trường chạy thẳng ra phố không qua cầu xịt rửa lốp, kéo vệt bùn dài trơn trượt.
   - **Đốt rác, phế thải xây dựng** (`BURNING_WASTE`): Đốt vỏ bao xi măng, gỗ cốp pha, xốp nhựa phế thải tại các bãi đất trống bốc khói độc khét lẹt.
2. **Nén ảnh tự động trên trình duyệt client (< 300KB trong 150ms)**:
   - Sử dụng HTML5 Canvas API ([`app/src/lib/image-compressor.js`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/lib/image-compressor.js)) tự động co kích thước tối đa 1280px - 1600px và nén lặp giảm chất lượng JPEG để đưa tệp ảnh từ $10\text{MB}$ xuống nghiêm ngặt dưới **$300\text{KB}$** trực tiếp trên RAM thiết bị trước khi truyền tải qua mạng.
3. **Mã băm SHA-256 Web Crypto (Tamper-Evident Proof)**:
   - Kích hoạt Web Crypto API chuẩn (`crypto.subtle.digest('SHA-256')` trong [`app/src/lib/image-integrity.js`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/lib/image-integrity.js)) để sinh mã băm 64 ký tự hex trực tiếp trên client. Mã hash này gắn chặt với hình ảnh hiện trường, đảm bảo tính pháp lý chống chỉnh sửa photoshop hoặc tráo đổi bằng chứng.
4. **Bảo vệ quyền riêng tư người dân (Privacy Sanitizer)**:
   - Tự động bóc tách và xóa toàn bộ phân đoạn Exif APP1 (`0xFFE1`) khỏi luồng nhị phân ảnh JPEG, loại bỏ dấu vết dòng máy và thông tin cá nhân của người dân trước khi đưa lên đám mây.
5. **Định vị thông minh & Mã tra cứu quốc gia**:
   - Tự động nhận diện GPS hoặc chọn nhanh theo Phường/Xã từ danh mục hành chính Việt Nam.
   - Trả về ngay mã tra cứu chuẩn hóa cấp quốc gia định dạng **`DG-HN-2026-0842`** (Hà Nội), `DG-HCM-2026-XXXX` (TP.HCM)...
6. **Lưu nháp ngoại tuyến kiên cố (Offline Draft Resilience)**:
   - Tự động lưu bản nháp đang nhập dở vào `dg_citizen_report_new_draft`.
   - Nếu mất mạng $4\text{G}$ đúng lúc bấm gửi, hệ thống tự động lưu vào hàng đợi `dg_offline_drafts` và cấp mã tạm `OFFLINE-XXXX`, thông báo cho người dân yên tâm cất điện thoại.

---

## 3. User Journey & Luồng Thao Tác 30 Giây Thần Tốc (Core Flow & Step-by-Step)

### 3.1. Phân bổ thời gian thực tế 30 giây (Timeline Breakdown)
```text
[0s ─── 5s]   Bước 1: Chạm chọn 1 trong 4 danh mục vi phạm nổi bật.
[6s ─── 15s]  Bước 2: Bấm nút Máy ảnh -> Chụp ảnh hiện trường -> Trình duyệt tự nén <300KB + Băm SHA-256 + Gỡ Exif.
[16s ── 22s]  Bước 3: Vị trí tự nhận diện hoặc gõ nhanh số nhà/tên đường + chọn Phường/Xã.
[23s ── 27s]  Bước 4: Nhập 1 câu mô tả ngắn gọn (hoặc để mặc định theo danh mục).
[28s ── 30s]  Bấm nút [GỬI PHẢN ÁNH NGAY (30 GIÂY)] -> Nhận mã tra cứu DG-HN-2026-0842.
```

### 3.2. Sơ đồ xử lý kỹ thuật đầu cuối (Mermaid Flowchart)
```mermaid
flowchart TD
    Start[Mở màn hình CIT-02 /citizen/report/new] --> SelectCat[1. Chọn danh mục vi phạm: Bụi/Xe tải/Bùn đất/Đốt rác]
    
    SelectCat --> PhotoChoice{2. Chụp ảnh hiện trường}
    PhotoChoice -->|Bấm chụp ảnh| Camera[Mở Camera thiết bị qua capture='environment']
    Camera --> CanvasCompress[HTML5 Canvas: Tự co kích thước + Nén JPEG < 300KB]
    CanvasCompress --> CryptoHash[Web Crypto: Sinh mã băm SHA-256 64 ký tự hex]
    CryptoHash --> ExifStrip[Privacy Sanitizer: Gỡ sạch phân đoạn Exif APP1 nhạy cảm]
    ExifStrip --> PreviewImg[Hiển thị ảnh xem trước + Nút xóa ✕]
    
    PreviewImg --> InputLoc[3. Nhập vị trí: Số nhà, tên đường + Phường/Xã]
    InputLoc --> InputDesc[4. Nhập mô tả thêm tình trạng]
    
    InputDesc --> SubmitBtn[Bấm 'GỬI PHẢN ÁNH NGAY (30 GIÂY)']
    SubmitBtn --> ValidateForm{Kiểm tra dữ liệu bắt buộc}
    
    ValidateForm -->|Thiếu địa chỉ & mô tả| ShowErr[Cảnh báo yêu cầu bổ sung vị trí]
    ValidateForm -->|Hợp lệ| CheckNet{Kiểm tra kết nối mạng}
    
    CheckNet -->|Có mạng 4G/Wifi| PostAPI[Gọi POST /api/complaints]
    PostAPI -->|201 Created| SuccessOnline[Hiển thị Màn hình Thành công: Cấp mã DG-HN-2026-0842]
    
    CheckNet -->|Mất sóng/Lỗi mạng| SaveOffline[Lưu vào hàng đợi LocalStorage dg_offline_drafts]
    SaveOffline --> SuccessOffline[Hiển thị Màn hình Lưu nháp ngoại tuyến: Cấp mã OFFLINE-XXXX]
    
    SuccessOnline --> NextAction{Hành động tiếp theo}
    SuccessOffline --> NextAction
    NextAction -->|Xem kết quả| TrackPage[Điều hướng /citizen/reports]
    NextAction -->|Gửi tiếp| ResetForm[Xóa form cũ và mở biểu mẫu mới]
```

---

## 4. Bố Cục Giao Diện & Wireframe ASCII Chi Tiết (Information Hierarchy & Wireframes)

### 4.1. Phân cấp thông tin thị giác (Information Hierarchy)
1. **Tiêu đề trang & Lời cam kết bảo mật**:
   - Tiêu đề H1: `Gửi Phản Ánh Bụi Môi Trường`
   - Phụ đề trấn an: `Thông tin phản ánh của bạn sẽ được bảo mật và chuyển trực tiếp đến cán bộ phụ trách.`
2. **Bước 1 — Chọn hiện tượng bạn phát hiện (Category Selector)**:
   - Lưới 4 thẻ danh mục với biểu tượng và nút radio tùy biến:
     - Thẻ 1: `Bụi phát tán từ công trình`
     - Thẻ 2: `Xe tải chở đất cát không phủ bạt`
     - Thẻ 3: `Bùn đất vương vãi ra lòng đường`
     - Thẻ 4: `Đốt rác, phế thải xây dựng`
3. **Bước 2 — Hình ảnh hiện trường (Photo Upload & Camera Zone)**:
   - Khung viền nét đứt (dashed) thân thiện với biểu tượng máy ảnh màu đỏ son.
   - Nút `[Chọn tệp ảnh]` kích hoạt camera sau của smartphone (`capture="environment"`).
   - Khung xem trước ảnh (Preview) kèm huy hiệu `Đã bảo mật Exif & Nén tối ưu` và nút xóa `[✕]` góc trên.
4. **Bước 3 — Địa chỉ & Khu vực (Location Fields)**:
   - Trường bắt buộc: `Địa chỉ / Vị trí cụ thể *` (Placeholder: *VD: Trước số nhà 128 đường Nguyễn Trãi...*).
   - Trường khu vực: `Khu vực / Phường xã` (Dropdown chọn nhanh hoặc gõ text: *Phường Thanh Xuân Trung*).
5. **Bước 4 — Mô tả thêm tình trạng (Description Field)**:
   - Textarea 3 dòng hỗ trợ gõ nhanh (Placeholder: *VD: Xe tải chở đất cát không rửa lốp làm bùn đất kéo dài 100m, bụi mù mịt khi xe chạy qua...*).
6. **Nút gửi phản ánh chính (Primary Submit CTA)**:
   - Nút kích thước lớn, chiều cao $48\text{px}$, màu đỏ son cứu hộ `#B91C1C`, chữ in hoa đậm: `GỬI PHẢN ÁNH NGAY (30 GIÂY)`.

### 4.2. Wireframe Giao Diện Nhập Liệu Mobile (Viewport 360px — 430px)
```text
+-------------------------------------------------------------+
| [🛡️ DustGuard VN] [CỘNG ĐỒNG]                 [🟢 Trực tuyến] |
+-------------------------------------------------------------+
|                                                             |
|  GỬI PHẢN ÁNH BỤI MÔI TRƯỜNG                                 |
|  Thông tin phản ánh của bạn sẽ được bảo mật và chuyển...    |
|                                                             |
|  1. HIỆN TƯỢNG BẠN PHÁT HIỆN *                              |
|  +-------------------------------------------------------+  |
|  | (o) Bụi phát tán từ công trình                        |  |
|  +-------------------------------------------------------+  |
|  +-------------------------------------------------------+  |
|  | ( ) Xe tải chở đất cát không phủ bạt                 |  |
|  +-------------------------------------------------------+  |
|  +-------------------------------------------------------+  |
|  | ( ) Bùn đất vương vãi ra lòng đường                   |  |
|  +-------------------------------------------------------+  |
|  +-------------------------------------------------------+  |
|  | ( ) Đốt rác, phế thải xây dựng                        |  |
|  +-------------------------------------------------------+  |
|                                                             |
|  2. HÌNH ẢNH HIỆN TRƯỜNG (KHUYẾN KHÍCH)                     |
|  + - - - - - - - - - - - - - - - - - - - - - - - - - - - +  |
|  |                      [ 📷 ]                           |  |
|  |           Chụp ảnh hoặc chọn ảnh từ thiết bị           |  |
|  |                                                       |  |
|  |       [ 📸 CHỌN TỆP ẢNH / CHỤP ẢNH ] (Cao 44px)        |  |
|  |  (Tự động nén <300KB & Gỡ Exif bảo vệ riêng tư)       |  |
|  + - - - - - - - - - - - - - - - - - - - - - - - - - - - +  |
|                                                             |
|  3. ĐỊA CHỈ / VỊ TRÍ CỤ THỂ *                               |
|  [ Trước số nhà 128 đường Nguyễn Trãi...                 ]  |
|                                                             |
|  KHU VỰC / PHƯỜNG XÃ                                        |
|  [ Phường Thanh Xuân Trung, Quận Thanh Xuân              ]  |
|                                                             |
|  4. MÔ TẢ THÊM TÌNH TRẠNG                                   |
|  [ Xe ra vào không rửa lốp, bùn đất kéo dài 100 mét,     ]  |
|  [ bụi mù mịt khi có xe chạy qua...                      ]  |
|                                                             |
|  +-------------------------------------------------------+  |
|  |    [ 🚀 GỬI PHẢN ÁNH NGAY (30 GIÂY) ]                 |  |
|  |    (Cao 48px, Màu đỏ son #B91C1C, Chữ trắng đậm)      |  |
|  +-------------------------------------------------------+  |
|                                                             |
+-------------------------------------------------------------+
| [🏠 Trang chủ]  [📸 Gửi phản ánh]  [📋 Của tôi]  [👤 Cá nhân]|
+-------------------------------------------------------------+
```

### 4.3. Wireframe Màn Hình Thành Công Online (Success State)
```text
+-------------------------------------------------------------+
|                                                             |
|  +-------------------------------------------------------+  |
|  |                     [  ✅  ]                          |  |
|  |             (Hình tròn Xanh ngọc lục bảo)              |  |
|  |                                                       |  |
|  |           GỬI PHẢN ÁNH THÀNH CÔNG!                    |  |
|  |   Hệ thống đã tiếp nhận thông tin và chuyển tới tổ    |  |
|  |   công tác giám sát địa bàn.                          |  |
|  |                                                       |  |
|  |   +-----------------------------------------------+   |  |
|  |   | Mã tra cứu phản ánh:                          |   |  |
|  |   | DG-HN-2026-0842                               |   |  |
|  |   | (Font mono lớn, màu đỏ son #B91C1C, in đậm)   |   |  |
|  |   +-----------------------------------------------+   |  |
|  |                                                       |  |
|  |   [ 📋 Theo dõi kết quả xử lý ]  (Cao 44px, Nút đỏ)   |  |
|  |                                                       |  |
|  |   [ ➕ Gửi thêm phản ánh khác ]  (Cao 44px, Nút kem)  |  |
|  +-------------------------------------------------------+  |
|                                                             |
+-------------------------------------------------------------+
```

### 4.4. Wireframe Màn Hình Lưu Nháp Ngoại Tuyến (Offline State khi mất sóng 4G)
```text
+-------------------------------------------------------------+
|                                                             |
|  +-------------------------------------------------------+  |
|  |                     [  📡⚠️  ]                         |  |
|  |             (Hình tròn Màu vàng hổ phách)             |  |
|  |                                                       |  |
|  |          ĐÃ LƯU NHÁP NGOẠI TUYẾN!                     |  |
|  |   Thiết bị đang mất kết nối mạng 4G. Hồ sơ đã được    |  |
|  |   lưu an toàn trên điện thoại và sẽ tự động gửi       |  |
|  |   khi khôi phục kết nối.                              |  |
|  |                                                       |  |
|  |   +-----------------------------------------------+   |  |
|  |   | Mã hồ sơ tạm thời:                            |   |  |
|  |   | OFFLINE-L9X8K2M1                              |   |  |
|  |   +-----------------------------------------------+   |  |
|  |                                                       |  |
|  |   [ 📋 Xem danh sách phản ánh ] (Cao 44px, Nút chính) |  |
|  |   [ ➕ Tạo thêm phản ánh khác ] (Cao 44px, Nút phụ)   |  |
|  +-------------------------------------------------------+  |
|                                                             |
+-------------------------------------------------------------+
```

### 4.5. Wireframe Desktop 2 Cột (Viewport 1366px — 1920px)
```text
+----------------------------------------------------------------------------------------------------+
| [🛡️ DustGuard VN] [CỘNG ĐỒNG]      [Trang chủ]   [Gửi phản ánh]   [Phản ánh của tôi]   [👤 Tài khoản]|
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  GỬI PHẢN ÁNH BỤI MÔI TRƯỜNG                                                                       |
|  Thông tin phản ánh của bạn sẽ được bảo mật và chuyển trực tiếp đến cán bộ phụ trách.              |
|                                                                                                    |
|  +------------------------------------------+  +------------------------------------------------+  |
|  | CỘT TRÁI: HIỆN TƯỢNG & HÌNH ẢNH          |  | CỘT PHẢI: VỊ TRÍ & MÔ TẢ CHI TIẾT              |  |
|  |                                          |  |                                                |  |
|  | 1. Hiện tượng bạn phát hiện *            |  | 3. Địa chỉ / Vị trí cụ thể *                   |  |
|  | +--------------------------------------+ |  | [ Trước số nhà 128 đường Nguyễn Trãi...      ] |  |
|  | | (o) Bụi phát tán từ công trình       | |  |                                                |  |
|  | | ( ) Xe tải chở cát không phủ bạt     | |  | Khu vực / Phường xã                            |  |
|  | | ( ) Bùn đất vương vãi ra lòng đường  | |  | [ Phường Thanh Xuân Trung, Quận Thanh Xuân   ] |  |
|  | | ( ) Đốt rác, phế thải xây dựng       | |  |                                                |  |
|  | +--------------------------------------+ |  | 4. Mô tả thêm tình trạng                       |  |
|  |                                          |  | [ Xe ra vào không được rửa lốp, bùn đất kéo  ] |  |
|  | 2. Hình ảnh hiện trường (Khuyến khích)   |  | [ dài 100 mét, bụi mù mịt khi có xe chạy...  ] |  |
|  | + - - - - - - - - - - - - - - - - - -  + |  |                                                |  |
|  | |           [ 📷 Máy ảnh ]            | |  | +--------------------------------------------+ |  |
|  | |     Chụp hoặc chọn ảnh từ máy        | |  | |  [ 🚀 GỬI PHẢN ÁNH NGAY (30 GIÂY) ]        | |  |
|  | |      [ 📸 Chọn tệp ảnh ]             | |  | |  (Màu đỏ son #B91C1C, Chiều cao 48px)      | |  |
|  | + - - - - - - - - - - - - - - - - - -  + |  | +--------------------------------------------+ |  |
|  +------------------------------------------+  +------------------------------------------------+  |
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
```

---

## 5. Dữ Liệu, API & D1 Database Contract

### 5.1. API Endpoint
- **Gửi bản ghi phản ánh mới**:
  - `POST /api/complaints` (Edge Worker Route) hoặc `/complaints`
  - Method: `POST`
  - Headers:
    ```http
    Content-Type: application/json
    Accept: application/json
    ```

### 5.2. Payload Gửi Yêu Cầu (Request Payload Contract)
```json
{
  "category": "UNCOVERED_TRANSPORT",
  "address": "Trước số nhà 128 Nguyễn Trãi",
  "ward": "Phường Thanh Xuân Trung",
  "district": "Quận Thanh Xuân",
  "province": "Hà Nội",
  "description": "Xe ben chở đất cát không phủ bạt làm rơi vãi mù mịt trên đường",
  "reporterName": "Người dân ẩn danh",
  "reporterPhone": "",
  "evidences": [
    {
      "url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
      "sha256": "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
      "type": "photo",
      "sizeKB": 218.4,
      "exifStripped": true
    }
  ],
  "evidenceUrls": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
  ],
  "sha256": "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b"
}
```

### 5.3. Payload Phản Hồi Thành Công (Response Contract 201 Created)
```json
{
  "status": "success",
  "data": {
    "id": "cmp_9f81a2b3c4d5",
    "code": "DG-HN-2026-0842",
    "category": "UNCOVERED_TRANSPORT",
    "address": "Trước số nhà 128 Nguyễn Trãi",
    "ward": "Phường Thanh Xuân Trung",
    "description": "Xe ben chở đất cát không phủ bạt làm rơi vãi mù mịt trên đường",
    "status": "PENDING",
    "sha256": "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
    "createdAt": "2026-09-02T05:27:00.000Z"
  }
}
```

### 5.4. Schema Bảng D1 SQLite (`complaints` & `evidences`)
| Tên Cột | Kiểu Dữ Liệu | Ràng Buộc | Mô Tả Nghiệp Vụ |
|---|---|---|---|
| `id` | `TEXT` | `PRIMARY KEY` | Khóa chính dạng chuỗi UUID |
| `code` | `TEXT` | `NOT NULL UNIQUE` | Mã tra cứu cấp quốc gia `DG-HN-2026-XXXX` |
| `category` | `TEXT` | `NOT NULL` | 1 trong 4 danh mục vi phạm môi trường |
| `address` | `TEXT` | `NOT NULL` | Địa chỉ hiện trường phát hiện |
| `ward` | `TEXT` | `NOT NULL` | Phường/Xã phụ trách địa bàn |
| `district` | `TEXT` | `NULL` | Quận/Huyện/Thị xã |
| `province` | `TEXT` | `DEFAULT 'Hà Nội'` | Tỉnh/Thành phố |
| `description` | `TEXT` | `NOT NULL` | Chi tiết mô tả hiện trường vi phạm |
| `reporter_name` | `TEXT` | `NULL` | Tên người phản ánh (mặc định 'Người dân') |
| `reporter_phone` | `TEXT` | `NULL` | Số điện thoại liên hệ (tùy chọn) |
| `evidence_urls` | `TEXT` | `NULL` | Mảng JSON chứa đường dẫn/base64 hình ảnh |
| `sha256` | `TEXT` | `NULL` | Mã băm SHA-256 đối chứng bằng chứng |
| `status` | `TEXT` | `DEFAULT 'PENDING'` | Trạng thái ban đầu: `PENDING` |
| `created_at` | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | Thời điểm ghi nhận vào CSDL |

### 5.5. Cấu Trúc Khóa Lưu Nháp Trình Duyệt (LocalStorage / IndexedDB Keys)
- `dg_citizen_report_new_draft`: Lưu tự động dữ liệu form người dân đang nhập dở (Category, Address, Ward, Description, Base64 preview, SHA-256 hash). Xóa sạch khi gửi thành công.
- `dg_offline_drafts`: Mảng chứa các bản ghi phản ánh đã bấm gửi nhưng mất sóng 4G, tự động đồng bộ khi có mạng trở lại.
- `dg_submission_history`: Lịch sử các lần gửi gần nhất để kiểm soát chống spam (Rate Limit Client).

---

## 6. Bảng Nút Bấm & Hành Động Cốt Lõi (CTAs & Interactions)

| Tên Nút / Thao Tác | Vị Trí | Hành Vi Kích Hoạt | Logic Xử Lý Kỹ Thuật | Kích Thước Vùng Chạm | Phản Hồi Giao Diện |
|---|---|---|---|---|---|
| **Thẻ danh mục (4 thẻ)** | Bước 1 | Click / Tap | Cập nhật `form.category` | Chiều cao $\ge 48\text{px}$ | Đổi viền sang đỏ son `#B91C1C`, nền hồng `#FEF2F2`, radio active |
| **[📸 Chọn tệp ảnh / Chụp ảnh]** | Bước 2 | Tap vào vùng upload | Mở Camera OS qua `capture="environment"` | Vùng bấm $\ge 44\text{px}$ | Kích hoạt bộ nén Canvas $<300\text{KB}$, tính hash SHA-256 và hiển thị ảnh xem trước |
| **[✕] Xóa ảnh xem trước** | Góc trên ảnh | Click / Tap | Xóa `imageFile`, `imagePreview`, `imageHash` | Vùng chạm $32\text{px} \times 32\text{px}$ | Khung upload trở lại trạng thái ban đầu để chụp lại |
| **[🚀 GỬI PHẢN ÁNH NGAY (30 GIÂY)]** | Cuối form | Click / Submit | Validate $\rightarrow$ `setSubmitting(true)` $\rightarrow$ `POST /complaints` | Chiều cao $48\text{px}$, Full width | Nút đổi sang `Đang gửi phản ánh...`, vô hiệu hóa chống click đúp |
| **[📋 Theo dõi kết quả xử lý]** | Màn hình thành công | Click / Tap | Điều hướng sang `/citizen/reports` | Chiều cao $\ge 44\text{px}$ | Chuyển ngay đến danh sách phản ánh cá nhân |
| **[➕ Gửi thêm phản ánh khác]** | Màn hình thành công | Click / Tap | Đặt lại form về mặc định, xóa `successResult` | Chiều cao $\ge 44\text{px}$ | Form trắng mới sẵn sàng gửi phản ánh tiếp theo |

---

## 7. Quy Chuẩn UI/UX, Typography, Responsive & Khả Năng Tiếp Cận (A11y)

### 7.1. Nguyên tắc màu sắc Civic High-Contrast (Zero Glassmorphism)
- **Màu nền form**: Trắng tinh khiết `#FFFFFF` nổi bật trên nền trang kem sáng `#FAFAF9` (hoặc `#FDFBF7`).
- **Màu viền & đường ngăn cách**: Xám mềm `#E7E5E4` (khi focus/active chuyển sang viền đỏ son `#B91C1C`).
- **Màu chữ chính**: Đen than `#1C1917` (High Contrast $7:1$ so với nền trắng), chữ mô tả `#57534E`, chữ phụ `#78716C`.
- **Màu nút hành động chính**: Đỏ son cứu hộ `#B91C1C` (Hover: `#991B1B`, Active: `#7F1D1D`), chữ trắng in hoa đậm.
- **Tuyệt đối cấm**:
  - Không sử dụng hiệu ứng làm mờ nền `backdrop-blur-*` (Glassmorphism) để đảm bảo tốc độ phản hồi 60fps mượt mà trên các dòng điện thoại thông minh phổ thông.
  - Không dùng font chữ xám mờ trên nền sáng.

### 7.2. Kích thước vùng chạm & Chống Auto-Zoom trên iOS
- **Touch Target $\ge 44\text{px}$ - $48\text{px}$**: Toàn bộ ô nhập liệu, thẻ danh mục và nút submit đều đạt kích thước tiêu chuẩn, dễ dàng bấm chính xác bằng ngón tay cái khi đang di chuyển trên đường.
- **Font-size Input $\ge 16\text{px}$**: Toàn bộ các thẻ `<input>` và `<textarea>` có cỡ chữ tối thiểu $16\text{px}$ trên thiết bị di động để ngăn chặn trình duyệt Safari trên iOS tự động zoom phóng to màn hình làm vỡ bố cục giao diện.
- **Focus Ring rõ ràng**: Khi người dùng chọn vào ô nhập liệu, hiển thị vòng bao nét mảnh `focus:ring-2 focus:ring-[#B91C1C]/20 focus:border-[#B91C1C]` hỗ trợ người khiếm thị và thao tác bàn phím.

### 7.3. Đáp ứng đa màn hình (Responsive Matrix)
- **Mobile (360px — 430px)**: Bố cục 1 cột dọc, khoảng cách lề $16\text{px}$, các nút bấm giãn `w-full`, danh mục xếp chồng dọc hoặc 2 cột mini.
- **Tablet & Desktop (640px — 1920px)**: Danh mục chia 2 cột cân đối, trường Địa chỉ & Phường xã dàn hàng ngang `grid-cols-2`, form gói gọn trong container `max-w-2xl` căn giữa giúp mắt không bị mỏi khi nhìn màn hình rộng.

---

## 8. Bẫy Lỗi Thường Gặp & Cơ Chế Phòng Vệ Ngoại Tuyến (Edge Cases & Recovery)

### 8.1. Các tình huống lỗi hiện trường & Cơ chế tự phục hồi
1. **Mất sóng 4G đột ngột khi đang bấm nút Gửi**:
   - *Tình huống*: Người dân đang ở khu vực vùng ven hoặc tầng hầm không có sóng Internet.
   - *Cơ chế phục hồi*: Bắt lỗi `catch (err)` trong `handleSubmit`, tự động đóng gói payload đưa vào `localStorage.getItem('dg_offline_drafts')`, sinh mã tạm `OFFLINE-XXXX`, chuyển sang màn hình thông báo đã lưu nháp an toàn. Khi người dân có mạng trở lại, hệ thống sẽ tự động đồng bộ nền.
2. **Double Submission (Người dân bấm liên tục do sốt ruột)**:
   - *Tình huống*: Mạng chậm $1-2\text{s}$, người dân ấn nút gửi nhiều lần liên tiếp gây trùng lặp bản ghi.
   - *Cơ chế phục hồi*: Biến trạng thái `submitting` lập tức khóa nút bấm (`disabled={submitting}`), hiển thị nhãn `Đang gửi phản ánh...` và áp dụng cờ chặn logic.
3. **Ảnh chụp camera độ phân giải cực cao (48MP, 20MB) gây tràn bộ nhớ**:
   - *Tình huống*: Smartphone đời mới chụp ảnh tệp quá lớn làm đơ trình duyệt.
   - *Cơ chế phục hồi*: Bộ nén `compressImage` giới hạn kích thước Canvas tối đa 1600px, vẽ ảnh với nền trắng và lặp nén JPEG chất lượng giảm dần từ 0.85 xuống 0.5 cho đến khi tệp nhỏ hơn $300\text{KB}$, giải phóng bộ nhớ ngay sau khi xuất chuỗi Base64.
4. **Trình duyệt từ chối quyền truy cập GPS**:
   - *Tình huống*: Người dân tắt định vị hoặc từ chối cấp quyền Geolocation.
   - *Cơ chế phục hồi*: Hệ thống không chặn quy trình gửi, cho phép nhập địa chỉ bằng tay và chọn nhanh Phường/Xã từ danh sách gợi ý.
5. **Dữ liệu đang nhập dở bị mất do vô tình tắt trình duyệt**:
   - *Tình huống*: Đang gõ địa chỉ thì có cuộc gọi đến hoặc vô tình đóng tab.
   - *Cơ chế phục hồi*: `useEffect` tự động lắng nghe và lưu từng ký tự vào `dg_citizen_report_new_draft`. Khi mở lại trang, dữ liệu cũ được khôi phục 100%.

### 8.2. Lệnh kiểm thử tự động phân tầng (PowerShell CLI)

```powershell
# [Level 0] Kiểm tra quy tắc nghiệp vụ và xác thực biểu mẫu phản ánh (< 0.5s)
node --test app/tests/complaint-rules.test.js

# [Level 0] Kiểm tra nén ảnh Canvas <300KB và tính mã băm SHA-256 (< 0.5s)
node --test app/tests/evidence-r2-verification.test.js

# [Level 0] Kiểm tra toàn diện luồng giao diện công dân (< 0.5s)
node --test app/tests/citizen-full-functional.test.js

# [Level 1] Kiểm tra API Edge Worker tiếp nhận phản ánh D1 SQLite (< 3s)
node --test app/tests/worker-full-edge-routes.test.js

# [Level 3 Gate] Xác thực nhanh toàn hệ thống trước khi commit (< 7s)
npm --prefix app run verify:quick
```
