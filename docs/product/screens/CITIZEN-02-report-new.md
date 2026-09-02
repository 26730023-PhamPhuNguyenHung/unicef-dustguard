# CIT-02 — Gửi Phản Ánh Hiện Trường 30 Giây (Report New Observation)

## 1. Định Danh Màn Hình (Screen Identity)
- **Mã màn hình**: `CIT-02`
- **Tên màn hình (Tiếng Việt)**: Gửi Phản Ánh Hiện Trường 30 Giây / Báo Cáo Vi Phạm Bụi
- **Tên màn hình (Tiếng Anh)**: Rapid Environmental Observation Submission (30-Second Citizen Flow)
- **Đường dẫn (Route URL)**: `/citizen/report/new`
  - Tuyến chuyển hướng tương thích: `/citizen/report`
- **Tệp mã nguồn Component**: [`app/src/apps/citizen/pages/report-new/ReportNewPage.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/citizen/pages/report-new/ReportNewPage.jsx)
- **Khung giao diện chung (Layout)**: [`app/src/apps/citizen/layout/CitizenLayout.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/citizen/layout/CitizenLayout.jsx)
  - **Máy tính (Desktop)**: Form nhập liệu 2 cột trực quan hoặc dạng thẻ tập trung `max-w-2xl` căn giữa.
  - **Điện thoại (Mobile)**: Biểu mẫu cuộn mượt mà, tối ưu thao tác bằng một ngón tay cái, nút gửi đỏ son to rõ ở cuối trang.
- **Ai được sử dụng**: Mọi người dân (Gửi ẩn danh tức thì, không cần đăng nhập tài khoản).
- **Trạng thái thực tế**: Đang hoạt động ổn định, tự động nén ảnh nhẹ gửi siêu nhanh, tự gỡ thông tin cá nhân trên ảnh và tự lưu nháp khi mất mạng 4G.

---

## 2. Mục Đích & Bối Cảnh Thực Tế (Why & Purpose)

### 2.1. Nỗi vất vả khi gửi phản ánh theo cách cũ
- **Thủ tục đăng nhập rườm rà**: Nhiều ứng dụng dịch vụ công bắt người dân phải đăng nhập tài khoản phức tạp, điền hàng chục ô thông tin hành chính (CCCD, ngày cấp, quê quán...) khiến người dân nản lòng và bỏ cuộc.
- **Ảnh nặng hay bị nghẽn mạng**: Điện thoại đời mới chụp ảnh dung lượng lớn từ 5MB đến 15MB. Khi đứng ngoài đường với sóng 3G/4G yếu, việc tải ảnh lên thường bị đơ, quay tròn mãi rồi báo lỗi.
- **Lo ngại lộ thông tin cá nhân**: Người dân sợ bị lộ danh tính khi ảnh chụp có dính thông tin máy điện thoại hoặc vị trí nhà riêng; đồng thời sợ bị nhà thầu phản bác cho rằng ảnh cắt ghép.
- **Mất sóng là mất sạch dữ liệu**: Đang điền dở thì mất sóng hoặc vô tình đóng ứng dụng khiến người dân phải nhập lại từ đầu.

### 2.2. Giải pháp 30 giây vượt trội của DustGuard VN
1. **4 Hiện tượng vi phạm thường gặp nhất**:
   - **Bụi phát tán từ công trình**: Đào móng, đập phá nhà cửa, cắt đá mài tường không che bạt hoặc không phun nước dập bụi.
   - **Xe tải chở đất cát không phủ bạt**: Xe ben chở vật liệu làm rơi vãi đất đá ra lòng đường, gây nguy hiểm cho người đi xe máy.
   - **Bùn đất vương vãi ra lòng đường**: Xe công trường chạy thẳng ra phố không qua cầu xịt rửa lốp, kéo vệt bùn dài trơn trượt.
   - **Đốt rác, phế thải xây dựng**: Đốt vỏ bao xi măng, gỗ cốp pha tại các bãi đất trống bốc khói cay mắt và khét lẹt.
2. **Tự động nén ảnh nhẹ gửi siêu nhanh**: Tự động co nhỏ và nén dung lượng ảnh từ 10MB xuống dưới **300KB** ngay trên điện thoại trong 0.1 giây, giúp gửi ảnh vù vù ngay cả khi sóng 4G chỉ có 1 vạch.
3. **Gỡ thông tin cá nhân trên ảnh**: Tự động bóc tách và xóa sạch vị trí nhà riêng cùng thông tin máy ảnh trên tệp chụp trước khi gửi đi, bảo đảm tuyệt đối quyền riêng tư cho người dân.
4. **Mã nhận dạng ảnh chống chỉnh sửa**: Tự động tạo một mã bảo mật gắn liền với bức ảnh, chứng minh bức ảnh là nguyên bản thực tế, không bị can thiệp photoshop.
5. **Tự lưu nháp khi mất mạng 4G**:
   - Từng câu chữ bạn gõ được máy tự động lưu lại, lỡ tắt app mở lại vẫn nguyên vẹn.
   - Nếu bấm gửi đúng lúc mất mạng, máy tự lưu an toàn, cấp mã tạm `OFFLINE-XXXX` và tự động gửi đi ngay khi có sóng trở lại.
6. **Mã tra cứu dễ nhớ**: Nhận ngay mã số chuẩn hóa theo tỉnh thành như `DG-HN-2026-0842` để tiện tra cứu tiến độ.

---

## 3. Người Dùng & Các Bước Sử Dụng (User Flow & Steps)

### 3.1. 4 Bước thao tác nhanh trong 30 giây
```text
[0s ─── 5s]   Bước 1: Chạm chọn 1 trong 4 hiện tượng vi phạm (Bụi / Xe tải / Bùn đất / Đốt rác).
[6s ─── 15s]  Bước 2: Bấm chụp ảnh hiện trường (máy tự động nén nhẹ và gỡ thông tin cá nhân).
[16s ── 22s]  Bước 3: Nhập địa chỉ cụ thể (số nhà, tên đường) và chọn Phường/Xã.
[23s ── 27s]  Bước 4: Gõ 1 câu mô tả ngắn (hoặc dùng gợi ý có sẵn).
[28s ── 30s]  Bấm nút [GỬI PHẢN ÁNH NGAY (30 GIÂY)] -> Nhận mã tra cứu DG-HN-2026-0842.
```

### 3.2. Sơ đồ các bước gửi phản ánh

```mermaid
flowchart TD
    Start[Mở màn hình CIT-02 /citizen/report/new] --> SelectCat[1. Chọn hiện tượng vi phạm]
    
    SelectCat --> PhotoChoice{2. Chụp ảnh hiện trường}
    PhotoChoice -->|Bấm chụp ảnh| Camera[Mở máy ảnh điện thoại]
    Camera --> Compress[Tự động nén ảnh nhẹ < 300KB + Gỡ thông tin cá nhân]
    Compress --> PreviewImg[Hiển thị ảnh xem trước + Nút xóa]
    
    PreviewImg --> InputLoc[3. Nhập số nhà, tên đường + Phường/Xã]
    InputLoc --> InputDesc[4. Gõ thêm mô tả ngắn]
    
    InputDesc --> SubmitBtn[Bấm 'GỬI PHẢN ÁNH NGAY (30 GIÂY)']
    SubmitBtn --> CheckNet{Kiểm tra sóng mạng}
    
    CheckNet -->|Có mạng bình thường| SuccessOnline[Hiện thông báo Thành công: Cấp mã DG-HN-2026-0842]
    CheckNet -->|Mất sóng 4G| SaveOffline[Tự lưu nháp vào máy: Cấp mã tạm OFFLINE-XXXX]
    
    SuccessOnline --> NextAction{Bạn muốn làm gì tiếp theo?}
    SaveOffline --> NextAction
    NextAction -->|Xem kết quả| TrackPage[Chuyển sang theo dõi tiến độ]
    NextAction -->|Gửi tiếp| ResetForm[Mở biểu mẫu mới gửi phản ánh khác]
```

---

## 4. Bố Cục Giao Diện & Khung Dây ASCII (Layout & Wireframes)

### 4.1. Cách sắp xếp thông tin trên màn hình
1. **Tiêu đề & Lời nhắn an tâm**:
   - Tiêu đề to rõ: `Gửi Phản Ánh Bụi Môi Trường`
   - Dòng phụ: `Thông tin phản ánh của bạn được bảo mật và chuyển trực tiếp đến cán bộ phụ trách địa bàn.`
2. **Bước 1 — Chọn hiện tượng bạn phát hiện**: 4 ô lựa chọn to rõ (Bụi công trình, Xe tải không phủ bạt, Bùn đất ra đường, Đốt rác phế thải).
3. **Bước 2 — Hình ảnh hiện trường**: Khung viền nét đứt thân thiện, nút bấm `[ 📸 CHỌN TỆP ẢNH / CHỤP ẢNH ]` to rõ, có ảnh xem trước kèm nút xóa `[✕]`.
4. **Bước 3 — Địa chỉ & Phường xã**: Ô nhập số nhà, tên đường kèm danh sách chọn nhanh Phường/Xã.
5. **Bước 4 — Mô tả thêm tình trạng**: Ô nhập 2-3 dòng chữ ngắn gọn.
6. **Nút gửi chính**: Nút màu đỏ son cứu hộ `#B91C1C` nổi bật ở cuối trang: `GỬI PHẢN ÁNH NGAY (30 GIÂY)`.

### 4.2. Khung hình giao diện nhập liệu trên điện thoại (Mobile)

```text
+-------------------------------------------------------------+
| [🛡️ DustGuard VN] [CỘNG ĐỒNG]                 [🟢 Trực tuyến] |
+-------------------------------------------------------------+
|                                                             |
|  GỬI PHẢN ÁNH BỤI MÔI TRƯỜNG                                 |
|  Thông tin phản ánh của bạn sẽ được chuyển đến cán bộ...     |
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
|  |       [ 📸 CHỌN TỆP ẢNH / CHỤP ẢNH ] (Nút to rõ)        |  |
|  |     (Tự động nén ảnh nhẹ & gỡ thông tin cá nhân)      |  |
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
|  |    (Màu đỏ son nổi bật, cao 48px, bấm vừa ngón cái)    |  |
|  +-------------------------------------------------------+  |
|                                                             |
+-------------------------------------------------------------+
| [🏠 Trang chủ]  [📸 Gửi phản ánh]  [📋 Của tôi]  [👤 Cá nhân]|
+-------------------------------------------------------------+
```

### 4.3. Khung hình thông báo gửi thành công (Khi có mạng)

```text
+-------------------------------------------------------------+
|                                                             |
|  +-------------------------------------------------------+  |
|  |                     [  ✅  ]                          |  |
|  |             (Biểu tượng xanh ngọc sáng)               |  |
|  |                                                       |  |
|  |           GỬI PHẢN ÁNH THÀNH CÔNG!                    |  |
|  |   Thông tin đã được tiếp nhận và chuyển tới tổ công   |  |
|  |   tác giám sát địa bàn để yêu cầu xử lý.              |  |
|  |                                                       |  |
|  |   +-----------------------------------------------+   |  |
|  |   | Mã tra cứu phản ánh:                          |   |  |
|  |   | DG-HN-2026-0842                               |   |  |
|  |   | (Mã số in đậm, dùng để theo dõi tiến độ)      |   |  |
|  |   +-----------------------------------------------+   |  |
|  |                                                       |  |
|  |   [ 📋 Theo dõi kết quả xử lý ]  (Nút màu đỏ son)     |  |
|  |                                                       |  |
|  |   [ ➕ Gửi thêm phản ánh khác ]  (Nền kem viền xám)   |  |
|  +-------------------------------------------------------+  |
|                                                             |
+-------------------------------------------------------------+
```

### 4.4. Khung hình tự lưu nháp (Khi mất sóng 4G)

```text
+-------------------------------------------------------------+
|                                                             |
|  +-------------------------------------------------------+  |
|  |                     [  📡  ]                          |  |
|  |              (Biểu tượng màu vàng ấm)                 |  |
|  |                                                       |  |
|  |          ĐÃ TỰ LƯU NHÁP VÀO MÁY!                      |  |
|  |   Điện thoại của bạn đang mất mạng 4G. Thông tin đã   |  |
|  |   được lưu an toàn và sẽ tự động gửi đi khi có sóng.  |  |
|  |                                                       |  |
|  |   +-----------------------------------------------+   |  |
|  |   | Mã hồ sơ tạm thời:                            |   |  |
|  |   | OFFLINE-HN-0842                               |   |  |
|  |   +-----------------------------------------------+   |  |
|  |                                                       |  |
|  |   [ 📋 Xem danh sách phản ánh ] (Nút màu đỏ)          |  |
|  |   [ ➕ Tạo thêm phản ánh khác ] (Nền kem)             |  |
|  +-------------------------------------------------------+  |
|                                                             |
+-------------------------------------------------------------+
```

### 4.5. Khung hình giao diện trên máy tính (Desktop)

```text
+----------------------------------------------------------------------------------------------------+
| [🛡️ DustGuard VN] [CỘNG ĐỒNG]      [Trang chủ]   [Gửi phản ánh]   [Phản ánh của tôi]   [👤 Tài khoản]|
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  GỬI PHẢN ÁNH BỤI MÔI TRƯỜNG                                                                       |
|  Thông tin phản ánh của bạn sẽ được chuyển trực tiếp đến cán bộ phụ trách địa bàn.                 |
|                                                                                                    |
|  +------------------------------------------+  +------------------------------------------------+  |
|  | CỘT 1: HIỆN TƯỢNG & HÌNH ẢNH             |  | CỘT 2: VỊ TRÍ & MÔ TẢ CHI TIẾT                 |  |
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
|  | |      [ 📸 Chọn tệp ảnh ]             | |  | |  (Nút màu đỏ son, bấm gửi tức thì)          | |  |
|  | + - - - - - - - - - - - - - - - - - -  + |  | +--------------------------------------------+ |  |
|  +------------------------------------------+  +------------------------------------------------+  |
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
```

---

## 5. Dữ Liệu & Nguồn Thông Tin (Data & API Summary)

### 5.1. Nguồn dữ liệu gửi đi
- **Gửi phản ánh**: Gọi `POST /api/complaints`.
- **Tự động lưu nháp**: Từng trường thông tin nhập dở được tự động lưu tạm trên bộ nhớ máy điện thoại.

### 5.2. Các thông tin chính gửi đi
| Trường thông tin | Ý nghĩa dễ hiểu | Ví dụ thực tế |
|---|---|---|
| `category` | Loại vi phạm | `UNCOVERED_TRANSPORT` (Xe tải không phủ bạt) |
| `address` | Vị trí phát hiện | Trước số nhà 128 Nguyễn Trãi |
| `ward` | Phường / Xã | Phường Thanh Xuân Trung |
| `description` | Mô tả tình trạng | Xe chở cát không phủ bạt làm rơi vãi ra đường |
| `evidenceUrls` | Ảnh hiện trường | Ảnh đã nén dưới 300KB và gỡ thông tin cá nhân |

---

## 6. Danh Sách Nút Bấm & Thao Tác (Buttons & Actions)

| Tên Nút / Thao Tác | Vị Trí | Bấm vào sẽ làm gì? | Kích Thước Bấm |
|---|---|---|---|
| **4 Ô chọn hiện tượng** | Bước 1 | Chạm chọn loại vi phạm (đổi viền đỏ nổi bật) | Cao 48px, dễ chạm |
| **[📸 Chọn tệp ảnh / Chụp ảnh]** | Bước 2 | Mở camera chụp ảnh; máy tự nén nhẹ và gỡ thông tin cá nhân | Cao 44px |
| **[✕] Xóa ảnh xem trước** | Góc trên ảnh | Xóa ảnh vừa chụp nếu muốn chụp lại ảnh khác | Vùng bấm 32px |
| **[🚀 GỬI PHẢN ÁNH NGAY (30 GIÂY)]** | Cuối form | Gửi phản ánh lên hệ thống và nhận mã tra cứu | Cao 48px, to rõ |
| **[📋 Theo dõi kết quả xử lý]** | Màn hình thành công | Mở danh sách theo dõi tiến độ xử lý | Cao 44px |
| **[➕ Gửi thêm phản ánh khác]** | Màn hình thành công | Mở biểu mẫu trắng để gửi thêm phản ánh mới | Cao 44px |

---

## 7. Quy Chuẩn Trình Bày & Màu Sắc (UI/UX & Responsive)

### 7.1. Màu sắc sáng rõ, dễ nhìn ngoài trời
- **Nền trang**: Màu kem sáng `#FAFAF9` (hoặc `#FDFBF7`), dịu mắt khi đứng ngoài trời nắng.
- **Nền biểu mẫu**: Trắng tinh `#FFFFFF`, viền xám mềm `#E7E5E4`.
- **Màu chữ**: Chữ đen than `#1C1917` tương phản cao trên nền trắng, chữ mô tả xám đậm `#57534E`.
- **Màu nút gửi**: Đỏ son cứu hộ `#B91C1C`, chữ in hoa trắng đậm.
- **Không dùng kính mờ (glassmorphism)**: Giúp trang phản hồi nhanh, mượt mà trên mọi loại máy điện thoại cũ hay mới.

### 7.2. Chống phóng to màn hình vô lý trên điện thoại
- Cỡ chữ trong các ô nhập liệu luôn từ 16px trở lên để bàn phím điện thoại mở lên mà không làm nhảy hoặc phóng to trang web.
- Vùng chạm các nút bấm và ô lựa chọn luôn cao từ 44px đến 48px, dễ dàng bấm chính xác bằng một ngón tay cái khi đang đi lại.

---

## 8. Tình Huống Thường Gặp & Cách Kiểm Tra (Edge Cases & Fast Test CLI)

### 8.1. Các tình huống thường gặp & Cách xử lý tự động
1. **Mất sóng 4G đúng lúc bấm gửi**: Máy tự động lưu bản nháp an toàn, cấp mã tạm `OFFLINE-XXXX` và thông báo để người dân yên tâm cất điện thoại.
2. **Bấm gửi liên tục nhiều lần do sốt ruột**: Nút gửi lập tức đổi sang *"Đang gửi phản ánh..."* và khóa lại trong 2 giây, tránh gửi trùng nhiều lần.
3. **Ảnh chụp máy xịn dung lượng 20MB**: Máy tự động co nhỏ kích thước và nén nhẹ xuống dưới 300KB trong 0.1 giây, không làm đơ hay nóng máy.
4. **Vô tình tắt trình duyệt khi đang gõ dở**: Mở lại trang web, toàn bộ nội dung và ảnh đang chọn trước đó sẽ tự động khôi phục lại 100%.

### 8.2. Lệnh kiểm tra nhanh hệ thống (Chạy bằng PowerShell)

```powershell
# Kiểm tra logic biểu mẫu phản ánh (< 0.5s)
node --test app/tests/complaint-rules.test.js

# Kiểm tra chức năng tự nén ảnh và tạo mã bảo vệ (< 0.5s)
node --test app/tests/evidence-r2-verification.test.js

# Kiểm tra toàn diện luồng gửi phản ánh (< 0.5s)
node --test app/tests/citizen-full-functional.test.js

# Xác thực nhanh toàn hệ thống trước khi bàn giao (< 7s)
npm --prefix app run verify:quick
```
