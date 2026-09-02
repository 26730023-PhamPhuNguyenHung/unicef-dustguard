# CIT-03 — Danh Sách & Theo Dõi Tiến Độ Phản Ánh (Citizen Reports List)

## 1. Định Danh Màn Hình (Screen Identity)
- **Mã màn hình**: `CIT-03`
- **Tên màn hình (Tiếng Việt)**: Danh Sách & Theo Dõi Tiến Độ Phản Ánh
- **Tên màn hình (Tiếng Anh)**: Citizen Environmental Reports Tracking List
- **Đường dẫn (Route URL)**: `/citizen/reports`
  - Tuyến chuyển hướng tương thích: `/citizen/track`
- **Tệp mã nguồn Component**: [`app/src/apps/citizen/pages/reports/ReportsListPage.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/citizen/pages/reports/ReportsListPage.jsx)
- **Khung giao diện chung (Layout)**: [`app/src/apps/citizen/layout/CitizenLayout.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/citizen/layout/CitizenLayout.jsx)
  - **Máy tính (Desktop)**: Thanh menu trên cùng, danh sách thẻ phản ánh căn giữa gọn gàng `max-w-4xl`.
  - **Điện thoại (Mobile)**: Thanh 4 nút bấm cố định đáy màn hình, danh sách cuộn mượt mà bằng ngón tay cái.
- **Ai được sử dụng**: Mọi người dân, đoàn viên thanh niên, tình nguyện viên môi trường.
- **Trạng thái thực tế**: Đang hoạt động ổn định, kết nối cơ sở dữ liệu thật, chuyển tab lọc trạng thái nhanh trong tích tắc.

---

## 2. Mục Đích & Bối Cảnh Thực Tế (Why & Purpose)

### 2.1. Nỗi lo "gửi đơn rồi rơi vào im lặng"
- Trước đây, khi người dân phản ánh về xe chở đất làm rơi vãi hoặc công trình bụi bặm, người dân thường không biết tin báo của mình gửi đi đâu, có ai tiếp nhận không, hay bị bỏ quên.
- Màn hình `CIT-03` mang lại sự **minh bạch 100%**: Toàn bộ phản ánh đều được cấp **Mã tra cứu công khai** (như `DG-2026-F54A`, `DG-2026-E88B`), ai cũng có thể theo dõi tiến độ từng giờ từng ngày.

### 2.2. Lợi ích thiết thực cho người dân và thanh niên
1. **Cam kết xử lý trong 48 giờ**: Người dân biết rõ tiến độ từ lúc tiếp nhận đến khi tổ công tác yêu cầu nhà thầu dọn dẹp xong.
2. **Lọc nhanh 4 trạng thái chỉ bằng 1 chạm**:
   - `Tất cả`: Xem toàn bộ các phản ánh trên địa bàn.
   - `Mới gửi`: Các phản ánh vừa gửi lên, đang chờ tổ công tác tiếp nhận.
   - `Đang xử lý`: Tổ công tác đang kiểm tra hiện trường và đôn đốc nhà thầu quét dọn, che bạt.
   - `Đã khắc phục`: Nhà thầu đã rửa đường, dọn bùn đất sạch sẽ và nộp ảnh đối chứng.
3. **Tích lũy giờ tình nguyện cho Đoàn viên - Sinh viên**: Mỗi phản ánh hiện trường được xác thực và xử lý xong (`Đã khắc phục`) là căn cứ cộng giờ tình nguyện thực tế và điểm rèn luyện cho sinh viên.
4. **Mở xem ảnh đối chứng siêu tốc**: Chạm vào bất kỳ thẻ phản ánh nào để mở ngay màn hình xem ảnh Trước - Sau.

---

## 3. Người Dùng & Các Bước Sử Dụng (User Flow & Steps)

### 3.1. Ai là người sử dụng chính?
- **Người dân theo dõi kết quả**: Muốn xem phản ánh của mình về xe tải làm rơi đất cát đã được phường kiểm tra và nhà thầu quét dọn chưa.
- **Đoàn viên thanh niên & Tình nguyện viên**: Kiểm tra danh sách các điểm nóng mà nhóm mình đã ghi nhận trong đợt ra quân cuối tuần để tích lũy giờ tình nguyện.
- **Tổ trưởng tổ dân phố**: Nắm bắt nhanh các điểm ô nhiễm trên địa bàn phường để nhắc nhở các công trình thi công.

### 3.2. Sơ đồ các bước sử dụng

```mermaid
flowchart TD
    A[Mở Cổng Công Dân /citizen] --> B[Bấm nút 'Theo dõi tiến độ' hoặc tab 'Phản ánh']
    B --> C[Mở màn hình danh sách CIT-03: /citizen/reports]
    C --> D{Danh sách phản ánh}
    D -->|Chưa có phản ánh nào| E[Hiện ô thông báo thân thiện + Nút 'Gửi phản ánh ngay']
    D -->|Có dữ liệu| F[Hiển thị các thẻ phản ánh trực quan]
    F --> G[Chạm chọn nút lọc: Tất cả | Mới gửi | Đang xử lý | Đã khắc phục]
    G --> H[Danh sách lọc ngay trong chớp mắt]
    H --> I{Thao tác tiếp theo}
    I -->|Bấm vào 1 phản ánh| J[Mở màn hình CIT-04 xem chi tiết ảnh Trước - Sau]
    I -->|Bấm '+ Gửi phản ánh mới'| K[Mở màn hình CIT-02 gửi phản ánh khác]
```

---

## 4. Bố Cục Giao Diện & Khung Dây ASCII (Layout & Wireframes)

### 4.1. Cách sắp xếp thông tin trên màn hình
1. **Khung tiêu đề đầu trang**:
   - Tiêu đề to rõ: `Theo Dõi Phản Ánh Môi Trường`
   - Lời dẫn: `Xem tiến độ xử lý và kết quả khắc phục của đơn vị thi công.`
   - Nút hành động chính: `[ + Gửi phản ánh mới ]` (Màu đỏ son nổi bật).
2. **Dãy nút lọc trạng thái**: 4 nút dạng chip (`Tất cả`, `Mới gửi`, `Đang xử lý`, `Đã khắc phục`), nút đang chọn có màu đỏ son nổi bật.
3. **Danh sách các thẻ phản ánh**:
   - Mỗi thẻ gồm: Mã tra cứu (`DG-2026-F54A`), Nhãn trạng thái màu sắc, Ngày gửi, Nội dung tóm tắt vi phạm, Địa chỉ cụ thể và nút `Xem tiến độ →`.
4. **Khung thông báo khi chưa có dữ liệu**: Biểu tượng thân thiện và nút `[Gửi phản ánh ngay]`.

### 4.2. Khung hình giao diện trực quan (ASCII Wireframe)

```text
+----------------------------------------------------------------------------------------------------+
| [Logo DustGuard VN]  [CỘNG ĐỒNG]              Trang chủ   [Phản ánh (*)]   Bản đồ   Tài khoản      |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  +----------------------------------------------------------------------------------------------+  |
|  | THEO DÕI PHẢN ÁNH MÔI TRƯỜNG                                         [ + Gửi phản ánh mới ]  |  |
|  | Xem tiến độ xử lý và kết quả khắc phục của đơn vị thi công.                                   |  |
|  +----------------------------------------------------------------------------------------------+  |
|                                                                                                    |
|  [ Tất cả (4) ]   [ Mới gửi (1) ]   [ Đang xử lý (1) ]   [ Đã khắc phục (2) ]                     |
|                                                                                                    |
|  +----------------------------------------------------------------------------------------------+  |
|  | DG-2026-F54A   [ ĐÃ KHẮC PHỤC (Xanh lá) ]     • 25/07/2026                                    |  |
|  | Phát hiện xe tải chở đất đá rơi vãi gây ô nhiễm bụi nghiêm trọng tại ô đất E9 Phường Yên Hòa  |  |
|  | 📍 Số 18 Phạm Hùng, Phường Yên Hòa, Cầu Giấy                                  Xem tiến độ →  |  |
|  +----------------------------------------------------------------------------------------------+  |
|                                                                                                    |
|  +----------------------------------------------------------------------------------------------+  |
|  | DG-2026-E88B   [ ĐÃ KHẮC PHỤC (Xanh lá) ]     • 27/07/2026                                    |  |
|  | Công trường thi công không bật phun sương dập bụi bãi vật liệu vào giờ cao điểm             |  |
|  | 📍 Đường Nguyễn Văn Lộc, Phường Mộ Lao, Hà Đông                               Xem tiến độ →  |  |
|  +----------------------------------------------------------------------------------------------+  |
|                                                                                                    |
|  +----------------------------------------------------------------------------------------------+  |
|  | DG-2026-M102   [ ĐANG XỬ LÝ (Vàng cam) ]      • 29/07/2026                                   |  |
|  | Khói bụi phát sinh từ hoạt động cắt mài bê tông lộ thiên không che chắn                       |  |
|  | 📍 Phường Láng Hạ, Đống Đa, Hà Nội                                           Xem tiến độ →  |  |
|  +----------------------------------------------------------------------------------------------+  |
|                                                                                                    |
|  +----------------------------------------------------------------------------------------------+  |
|  | DG-2026-K419   [ MỚI GỬI (Xanh lam nhạt) ]    • 02/09/2026                                   |  |
|  | Xe bồn trộn bê tông xả nước rửa chứa bùn xi măng ra cống thoát nước đường gom               |  |
|  | 📍 Đường Trần Thái Tông, Phường Dịch Vọng Hậu, Cầu Giấy                      Xem tiến độ →  |  |
|  +----------------------------------------------------------------------------------------------+  |
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
| [Menu đáy trên điện thoại]:        (🏠 Trang chủ)   (📋 Phản ánh [*])   (🗺️ Bản đồ)   (👤 Hồ sơ)     |
+----------------------------------------------------------------------------------------------------+
```

---

## 5. Dữ Liệu & Nguồn Thông Tin (Data & API Summary)

### 5.1. Nguồn dữ liệu
- **Lấy danh sách phản ánh**: Gọi `GET /api/complaints`.
- **Hiển thị an toàn**: Dù hệ thống có nhiều hay ít phản ánh, trang web luôn tự động xếp danh sách ngăn nắp, không bao giờ bị đơ máy.

### 5.2. Các thông tin chính trên mỗi thẻ phản ánh
| Thông tin | Ý nghĩa dễ hiểu | Ví dụ thực tế |
|---|---|---|
| `code` | Mã tra cứu phản ánh | `DG-2026-F54A` |
| `status` | Trạng thái xử lý | `Đã khắc phục`, `Đang xử lý`, `Mới gửi` |
| `description` | Tóm tắt vi phạm | Xe tải chở đất đá rơi vãi ra đường |
| `address` | Địa chỉ cụ thể | Số 18 Phạm Hùng, Phường Yên Hòa |
| `createdAt` | Ngày gửi phản ánh | 25/07/2026 |

---

## 6. Danh Sách Nút Bấm & Thao Tác (Buttons & Actions)

| Tên Nút / Thao Tác | Vị Trí | Bấm vào sẽ làm gì? | Kích Thước Bấm |
|---|---|---|---|
| **[+ Gửi phản ánh mới]** | Góc phải tiêu đề | Mở màn hình tạo phản ánh mới (`/citizen/report/new`) | Cao 44px, nút đỏ son |
| **Các nút lọc trạng thái** | Dãy chip đầu danh sách | Lọc nhanh danh sách theo trạng thái mong muốn | Cao 40px, chạm nhẹ ngón tay |
| **Chạm vào thẻ phản ánh** | Toàn bộ thân thẻ | Mở màn hình chi tiết đối chứng ảnh Trước - Sau (`/citizen/reports/:id`) | Cả thẻ bấm được |
| **[Xem tiến độ →]** | Góc phải mỗi thẻ | Mở chi tiết tiến độ vụ việc | Dễ bấm trên di động |
| **[Gửi phản ánh ngay]** | Khung khi chưa có dữ liệu | Mở biểu mẫu tạo phản ánh mới | Cao 44px |
| **[Thử lại]** | Khung khi mạng lỗi | Tải lại danh sách phản ánh | Cao 44px |

---

## 7. Quy Chuẩn Trình Bày & Màu Sắc (UI/UX & Responsive)

### 7.1. Màu sắc sáng rõ, độ tương phản cao
- **Nền trang**: Màu kem sáng nhạt `#FDFBF7`, dịu mắt khi sử dụng ngoài trời.
- **Nền thẻ phản ánh**: Trắng tinh `#FFFFFF`, viền xám mềm `#E7E5E4`, bo tròn góc dễ nhìn.
- **Màu chữ chính**: Đen than `#1C1917`, chữ phụ và mã số `#57534E`.
- **Màu trạng thái rõ ràng**:
  - `Đã khắc phục`: Chữ xanh lá đậm trên nền xanh nhạt viền xanh.
  - `Đang xử lý`: Chữ vàng cam trên nền vàng nhạt viền vàng.
  - `Mới gửi`: Chữ xanh lam trên nền xanh nhạt.
- **Không dùng kính mờ (glassmorphism)**: Giữ cho chữ và thông tin luôn sắc nét.

### 7.2. Tương thích mọi màn hình
- **Điện thoại (360px — 430px)**:
  - Dãy nút lọc hỗ trợ vuốt ngang nhẹ nhàng bằng ngón tay.
  - Thẻ phản ánh tự co dãn gọn gàng, không bị tràn mép hay vỡ chữ.
  - Chiều cao các nút bấm và thẻ tối thiểu 44px, dễ bấm trúng khi đang đi lại.
- **Máy tính (1024px — 1920px)**: Danh sách giới hạn độ rộng `max-w-4xl` căn giữa màn hình, dễ đọc, không bị dàn trải quá rộng.

---

## 8. Tình Huống Thường Gặp & Cách Kiểm Tra (Edge Cases & Fast Test CLI)

### 8.1. Các tình huống thường gặp & Cách xử lý tự động
1. **Chưa có phản ánh nào trên địa bàn**: Màn hình hiện thông báo thân thiện kèm nút bấm *"Gửi phản ánh ngay"* để khuyến khích người dân ghi nhận.
2. **Mạng 4G yếu hoặc chập chờn**: Màn hình hiển thị nút *"Thử lại"* để người dân bấm tải lại dữ liệu mà không cần tải lại toàn bộ trang web.
3. **Mô tả phản ánh dài**: Chữ tự động xuống dòng tự nhiên, không che mất mã số hay nút bấm xem tiến độ.

### 8.2. Lệnh kiểm tra nhanh hệ thống (Chạy bằng PowerShell)

```powershell
# Kiểm tra chức năng danh sách phản ánh công dân (< 0.5s)
node --test app/tests/citizen-full-functional.test.js

# Kiểm tra trải nghiệm thực tế công dân & thanh niên (< 0.5s)
node --test app/tests/citizen-youth-ux.test.js

# Xác thực nhanh toàn hệ thống trước khi bàn giao (< 7s)
npm --prefix app run verify:quick
```
