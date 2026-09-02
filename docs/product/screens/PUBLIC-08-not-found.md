# PUB-08 — Trang Báo Lỗi Đường Dẫn (404) & Nút Quay Về Trang Chủ

---

## 1. Thông Tin Màn Hình

| Thuộc tính | Chi tiết |
|---|---|
| **Mã màn hình** | `PUB-08` |
| **Tên màn hình** | Trang Báo Lỗi Đường Dẫn (404) & Nút Quay Về Trang Chủ |
| **Đường dẫn (URL)** | `*` (Tự động hiển thị khi người dùng vào bất kỳ đường dẫn nào không tồn tại) |
| **Tệp mã nguồn** | `app/src/modules/public/NotFound.jsx` |
| **Kiểu bố cục** | Thẻ thông báo căn giữa màn hình, gọn gàng và dễ nhìn |
| **Ai được dùng** | Mọi người (Khách xem, Người dân, Cán bộ, Nhà thầu, Lãnh đạo) |
| **Trạng thái hoạt động** | **Đang hoạt động tốt** (Tự nhận biết vai trò để đưa người dùng về đúng trang làm việc) |

---

## 2. Mục Đích & Ý Nghĩa Thực Tế

### 2.1. Giải quyết vấn đề gì ngoài đời thực?
Trong quá trình sử dụng hàng ngày tại đô thị, người dân và cán bộ thường nhấp vào các đường link được chia sẻ qua nhóm Zalo khu dân cư, tin nhắn SMS hoặc quét mã QR trên biển báo công trường:
- Có thể đường dẫn bị sao chép thiếu ký tự.
- Có thể liên kết cũ đã hết hạn hoặc được đổi tên.
- Hoặc người dùng gõ nhầm địa chỉ trên điện thoại khi đang ở ngoài đường nắng gió.

**Trang PUB-08 giúp người dùng không bao giờ bị bối rối hay mắc kẹt:**
1. **Quay về đúng không gian làm việc**: Khi bấm **[Quay về trang chính]**, hệ thống tự nhận biết người bấm là ai để đưa về đúng chỗ:
   - Cán bộ thanh tra $\rightarrow$ Đưa ngay về Bàn làm việc cán bộ (`/staff`).
   - Lãnh đạo / Quản trị $\rightarrow$ Đưa về Trung tâm điều hành (`/executive`).
   - Nhà thầu xây dựng $\rightarrow$ Đưa về Bàn làm việc nhà thầu (`/contractor`).
   - Người dân $\rightarrow$ Đưa về Cổng công dân (`/citizen`).
   - Khách xem chưa đăng nhập $\rightarrow$ Đưa về Trang chủ (`/`).
2. **Gợi ý sẵn 3 lối đi thiết thực nhất**: Cung cấp sẵn các đường dẫn hữu ích để người dân có thể gửi phản ánh khẩn cấp ngay mà không cần tìm kiếm lại từ đầu.
3. **Giao diện sáng rõ, thân thiện**: Sử dụng màu sắc sáng sủa, biểu tượng cảnh báo rõ ràng, chữ đậm nét dễ đọc ngoài trời nắng, tuyệt đối không dùng hiệu ứng mờ gây lóa mắt.

---

## 3. Hành Trình Người Dùng Thao Tác

```text
[Người dùng truy cập vào một đường link không tồn tại]
                         │
                         ▼
        [Trang Báo Lỗi 404 hiển thị giữa màn hình]
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
 [Bấm "Quay về     [Bấm "Cổng      [Bấm 1 trong 3
  trang chính"]     công dân"]      liên kết gợi ý]
         │               │               ├──> Mở Cổng công dân (/citizen)
         ▼               ▼               ├──> Gửi phản ánh gấp (/citizen/report)
  Hệ thống kiểm tra     Chuyển sang      └──> Xem hướng dẫn thiết bị (/guide)
  người đang dùng:      Cổng công dân
   • Chưa đăng nhập ──> Về Trang chủ (/)
   • Cán bộ ──────────> Về Bàn làm việc cán bộ (/staff)
   • Lãnh đạo ────────> Về Trung tâm điều hành (/executive)
   • Nhà thầu ────────> Về Bàn làm việc nhà thầu (/contractor)
   • Người dân ───────> Về Cổng công dân (/citizen)
```

---

## 4. Bố Cục Giao Diện & Mô Phỏng Wireframe

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ KHUNG CHÍNH CĂN GIỮA MÀN HÌNH                                                                    │
│                                                                                                  │
│   ┌────────────────────────────────────────────────────────────────────────────────────────┐     │
│   │ THẺ THÔNG BÁO TRUNG TÂM (Nền trắng, viền xám nhạt, bo tròn góc 24px)                   │     │
│   │                                                                                        │     │
│   │                       ┌───────────────────────┐                                        │     │
│   │                       │  [ ▲ Biểu Tượng ]     │  (Hình tròn nền phớt đỏ,               │     │
│   │                       │   Màu đỏ son nổi bật  │   biểu tượng cảnh báo tam giác)        │     │
│   │                       └───────────────────────┘                                        │     │
│   │                                                                                        │     │
│   │                         [ 404 — KHÔNG TÌM THẤY ]                                       │     │
│   │                                                                                        │     │
│   │                   Không tìm thấy trang yêu cầu                                         │     │
│   │                                                                                        │     │
│   │         Đường dẫn bạn vừa truy cập không tồn tại hoặc đã được                          │     │
│   │         thay đổi trong hệ thống DustGuard VN.                                          │     │
│   │                                                                                        │     │
│   │       ┌────────────────────────────────────────────────────────────────────────┐       │     │
│   │       │ KHUNG GỢI Ý LIÊN KẾT NHANH (Nền kem sáng, bo góc nhẹ)                  │       │     │
│   │       │ Gợi ý liên kết hữu ích:                                                │       │     │
│   │       │ • Cổng thông tin công dân — Tra cứu và theo dõi xử lý                  │       │     │
│   │       │ • Gửi phản ánh khẩn cấp — Báo cáo bụi kèm ảnh chụp hiện trường         │       │     │
│   │       │ • Hướng dẫn thiết bị đo — Tiêu chuẩn trạm đo ngoài trời                │       │     │
│   │       └────────────────────────────────────────────────────────────────────────┘       │     │
│   │                                                                                        │     │
│   │       ┌────────────────────────────────────┬───────────────────────────────────┐       │     │
│   │       │ [ Quay về trang chính ]            │ [ Cổng công dân ]                 │       │     │
│   │       │ (Nền đen mực, chữ trắng đậm)       │ (Nền trắng viền xám, chữ đen)     │       │     │
│   │       │ Chiều cao 44px                     │ Chiều cao 44px                    │       │     │
│   │       └────────────────────────────────────┴───────────────────────────────────┘       │     │
│   │                                                                                        │     │
│   └────────────────────────────────────────────────────────────────────────────────────────┘     │
│                                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & Kết Nối Hệ Thống

### 5.1. Cách thức nhận diện vai trò
- Khi người dùng bấm nút **[Quay về trang chính]**, hệ thống kiểm tra nhanh trạng thái tài khoản đang đăng nhập:
  - Nếu là khách chưa đăng nhập: Chuyển về Trang chủ `/`.
  - Nếu đã đăng nhập: Chuyển thẳng về trang làm việc đúng vai trò.

### 5.2. Chuyển hướng an toàn cho các liên kết cũ
- Hệ thống tự động chuyển các liên kết tài liệu cũ (như `/docs/sensor-guide`) về đúng trang hướng dẫn mới (`/guide`), không để người xem bị lỗi trang.

---

## 6. Danh Sách Nút Bấm & Thao Tác

| Nút bấm / Thao tác | Vị trí | Màu sắc | Kích thước | Hành động khi bấm |
|---|---|---|:---:|---|
| **[Quay về trang chính]** | Nút chính bên trái | Nền đen mực, chữ trắng đậm | Chiều cao 44px | Đưa người dùng về đúng trang làm việc theo vai trò của mình |
| **[Cổng công dân]** | Nút phụ bên phải | Nền trắng, viền xám nhạt, chữ đen | Chiều cao 44px | Chuyển thẳng sang Cổng công dân `/citizen` |
| **Liên kết "Cổng thông tin công dân"** | Trong khung gợi ý | Chữ xanh dương đậm, gạch chân | Chiều cao dòng chuẩn | Mở Cổng công dân `/citizen` |
| **Liên kết "Gửi phản ánh khẩn cấp"** | Trong khung gợi ý | Chữ xanh dương đậm, gạch chân | Chiều cao dòng chuẩn | Mở ngay form báo cáo vi phạm bụi `/citizen/report` |
| **Liên kết "Hướng dẫn thiết bị đo"** | Trong khung gợi ý | Chữ xanh dương đậm, gạch chân | Chiều cao dòng chuẩn | Mở trang hướng dẫn sử dụng `/guide` |

---

## 7. Tiêu Chuẩn Giao Diện & Hiển Thị Đa Thiết Bị

### 7.1. Màu sắc và độ tương phản (Sáng rõ ngoài trời)
- **Nền trang**: Màu kem sáng `#FDFBF7` chống mỏi mắt.
- **Thẻ thông báo**: Nền trắng nguyên khối `#FFFFFF`, viền xám nhẹ rõ nét.
- **Biểu tượng cảnh báo**: Màu đỏ son `#9F241F` nổi bật trên nền hồng nhạt.
- **Màu chữ**: Đen mực `#231B14`, độ đậm rõ ràng, độ tương phản rất cao dễ đọc dưới trời nắng.
- **Quy tắc bất biến**: Tuyệt đối **không dùng hiệu ứng kính mờ (glassmorphism)**, bảo đảm mọi chi tiết đều sắc nét.

### 7.2. Hiển thị trên các kích thước màn hình
- **Điện thoại (360px – 430px)**:
  - Thẻ thông báo chiếm vừa vặn chiều ngang màn hình.
  - 2 Nút bấm tự động xếp chồng lên nhau thành hàng dọc, nút to rõ $\ge 44\text{px}$ tiện bấm bằng một ngón tay.
- **Máy tính bảng & Laptop (768px – 1440px)**:
  - Thẻ thông báo căn giữa màn hình với kích thước vừa mắt (khoảng 500px).
  - 2 Nút bấm xếp hàng ngang cân đối.
- **Màn hình lớn (1920x1080)**:
  - Bố cục trung tâm trang nhã, khoảng cách lề rộng thoáng.

---

## 8. Xử Lý Lỗi & Tình Huống Thực Tế

### 8.1. Các tình huống thường gặp và cách xử lý
1. **Khách chưa đăng nhập bấm [Quay về trang chính]**:
   - *Cách xử lý*: Hệ thống kiểm tra an toàn và đưa về Trang chủ `/`, không bao giờ để xảy ra lỗi màn hình trắng.
2. **Người dùng mở lại link tài liệu cũ**:
   - *Cách xử lý*: Hệ thống tự động chuyển hướng về trang tài liệu chuẩn `/guide`.
3. **Màu chữ trên nút bấm**:
   - *Cách xử lý*: Nút chính luôn giữ chữ màu trắng nổi bật trên nền đen, không bị lẫn màu nền.

### 8.2. Lệnh kiểm tra hệ thống nhanh bằng PowerShell (< 0.5s)
```powershell
# 1. Kiểm tra việc bắt lỗi đường dẫn 404
node --test app/tests/landing-ssot-guard.test.js

# 2. Kiểm tra toàn bộ đường dẫn trong hệ thống
node --test app/tests/worker-full-edge-routes.test.js

# 3. Kiểm tra phân quyền và điều hướng an toàn
node --test app/tests/auth-user-management-audit.test.js
```
