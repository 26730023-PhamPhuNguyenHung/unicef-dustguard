# CIT-05 — Trang Cá Nhân Công Dân Tích Cực & Đóng Góp Môi Trường (Citizen Profile)

## 1. Định Danh Màn Hình (Screen Identity)
- **Mã màn hình**: `CIT-05`
- **Tên màn hình (Tiếng Việt)**: Trang Cá Nhân Công Dân Tích Cực & Đóng Góp Môi Trường
- **Tên màn hình (Tiếng Anh)**: Citizen Profile, Volunteer Impact & Youth Recognition
- **Đường dẫn (Route URL)**: `/citizen/profile`
  - Tuyến chuyển hướng tương thích: `/citizen/credits`
- **Tệp mã nguồn Component**: [`app/src/apps/citizen/pages/profile/CitizenProfilePage.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/citizen/pages/profile/CitizenProfilePage.jsx)
- **Khung giao diện chung (Layout)**: [`app/src/apps/citizen/layout/CitizenLayout.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/citizen/layout/CitizenLayout.jsx)
  - **Máy tính (Desktop)**: Thanh menu trên cùng, khung nội dung `max-w-4xl` căn giữa.
  - **Điện thoại (Mobile)**: Thanh 4 nút bấm cố định đáy màn hình với tab `Tài khoản` đang kích hoạt.
- **Ai được sử dụng**: Mọi người dân, đoàn viên thanh niên, sinh viên các trường đại học (Đã đăng nhập hoặc ở chế độ công dân giám sát).
- **Trạng thái thực tế**: Đang hoạt động ổn định, tự động tính giờ tình nguyện thực tế và tín chỉ môi trường.

---

## 2. Mục Đích & Bối Cảnh Thực Tế (Why & Purpose)

### 2.1. Tôn vinh những đóng góp thực tế vì cộng đồng
- Màn hình `CIT-05` là nơi tổng kết thành quả đóng góp của mỗi công dân và sinh viên tình nguyện trong việc giữ gìn bầu không khí trong lành của khu dân cư.
- Thể hiện rõ ràng **3 con số đóng góp thực tế**:
  1. **Tín chỉ ngoại khóa đề xuất**: Tỷ lệ quy đổi chuẩn học thuật (**20 giờ tình nguyện = 4.0 tín chỉ**).
  2. **Số phản ánh đã được khắc phục**: Số lượng điểm nóng ô nhiễm môi trường do bạn phát hiện và đã được dọn dẹp sạch sẽ.
  3. **Tổng số giờ tình nguyện thực địa**: Thời lượng đi khảo sát, ghi nhận hiện trường thực tế được hệ thống tự động ghi nhận.

### 2.2. Lợi ích cho Sinh viên & Đoàn viên
- **Nút xem Giấy chứng nhận điện tử**: Chuyển thẳng sang trang cấp Giấy chứng nhận hoạt động môi trường khổ A4 có mã QR và dấu chứng thực điện tử để nộp cho Đoàn trường / Hội Sinh viên xét **Điểm rèn luyện (ĐRL)**.
- **Quản lý tài khoản an toàn**: Có nút Đăng xuất nhanh chóng khi sử dụng máy tính công cộng tại trường học hoặc quán internet.
- **Mở được cả khi chưa đăng nhập**: Nếu là người dùng vãng lai, hệ thống tự động hiển thị chế độ *"Tài Khoản Công Dân"* thân thiện, không bao giờ bị khóa trang.

---

## 3. Người Dùng & Các Bước Sử Dụng (User Flow & Steps)

### 3.1. Ai là người sử dụng chính?
- **Sinh viên các trường Đại học** (ĐHQG Hà Nội, Bách Khoa, Xây dựng, Kinh tế Quốc dân...): Xem tổng kết số giờ và tín chỉ ngoại khóa đã tích lũy trong học kỳ.
- **Đoàn viên thanh niên & Tình nguyện viên**: Theo dõi kết quả các đợt ra quân khảo sát cuối tuần.
- **Công dân tích cực**: Xem lại những đóng góp của mình đã giúp làm sạch bao nhiêu tuyến đường.

### 3.2. Sơ đồ các bước sử dụng

```mermaid
flowchart TD
    A[Mở Cổng Công Dân /citizen] --> B[Bấm vào tab 'Tài khoản' trên menu]
    B --> C[Mở màn hình CIT-05: /citizen/profile]
    C --> D[Hệ thống tự động tải thông tin cá nhân và tính giờ tình nguyện]
    D --> E[Xem thẻ tên + Email + Huy hiệu 'Công dân tích cực']
    E --> F[Xem 3 ô số liệu: Tín chỉ | Vụ việc đã xử lý | Giờ tình nguyện]
    F --> G{Thao tác tiếp theo}
    G -->|Muốn lấy chứng nhận| H[Bấm 'Xem hồ sơ chứng nhận →' để lấy giấy chứng nhận]
    G -->|Dùng xong máy chung| I[Bấm nút 'Đăng xuất' an toàn]
```

---

## 4. Bố Cục Giao Diện & Khung Dây ASCII (Layout & Wireframes)

### 4.1. Cách sắp xếp thông tin trên màn hình
1. **Khung thông tin cá nhân (User Identity Banner)**:
   - Avatar chữ cái đầu to tròn màu xanh ngọc `#0d6f64`.
   - Họ và tên đầy đủ (in đậm to rõ).
   - Địa chỉ Email (hoặc nhãn *"Chế độ công dân giám sát"*).
   - Huy hiệu `Công dân tích cực` màu xanh lá nhạt.
   - Nút `[ Đăng xuất ]` nền kem viền xám ở góc phải.
2. **Khung đóng góp bảo vệ môi trường**:
   - Tiêu đề khối: `ĐÓNG GÓP BẢO VỆ MÔI TRƯỜNG` + Liên kết `Xem hồ sơ chứng nhận →`.
   - **Lưới 3 ô số liệu**:
     - **Ô 1 — Tín chỉ ngoại khóa đề xuất**: Số lớn (VD: `4.0`), màu đen than đậm.
     - **Ô 2 — Phản ánh đã được khắc phục**: Số lớn (VD: `12`), màu xanh ngọc.
     - **Ô 3 — Giờ hoạt động tình nguyện**: Số lớn (VD: `20.0h`), màu vàng hổ phách ấm.

### 4.2. Khung hình giao diện trực quan (ASCII Wireframe)

```text
+----------------------------------------------------------------------------------------------------+
| [Logo DustGuard VN]  [CỘNG ĐỒNG]              Trang chủ   Phản ánh   Bản đồ   [Tài khoản (*)]      |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  +----------------------------------------------------------------------------------------------+  |
|  |  +-----+  NGUYỄN VĂN AN                                                       [ Đăng xuất ]  |  |
|  |  |  N  |  nguyenvanan.hust@gmail.com                                                         |  |
|  |  +-----+  [ Công dân tích cực ]                                                              |  |
|  +----------------------------------------------------------------------------------------------+  |
|                                                                                                    |
|  +----------------------------------------------------------------------------------------------+  |
|  | ĐÓNG GÓP BẢO VỆ MÔI TRƯỜNG                                      Xem hồ sơ chứng nhận →       |  |
|  |                                                                                              |  |
|  |  +------------------------+  +------------------------+  +--------------------------------+  |  |
|  |  |          4.0           |  |           12           |  |             20.0h              |  |  |
|  |  | Tín chỉ ngoại khóa đề  |  | Phản ánh đã được khắc  |  |   Giờ hoạt động tình nguyện    |  |  |
|  |  |          xuất          |  |          phục          |  |           thực địa             |  |  |
|  |  +------------------------+  +------------------------+  +--------------------------------+  |  |
|  +----------------------------------------------------------------------------------------------+  |
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
| [Menu đáy trên điện thoại]:        (🏠 Trang chủ)   (📋 Phản ánh)   (🗺️ Bản đồ)   (👤 Hồ sơ [*])     |
+----------------------------------------------------------------------------------------------------+
```

---

## 5. Dữ Liệu & Nguồn Thông Tin (Data & API Summary)

### 5.1. Nguồn dữ liệu
- **Thông tin tài khoản**: Tên, email, trường đại học (nếu có).
- **Danh sách phản ánh**: Lấy từ hệ thống để tính toán chính xác khối lượng đóng góp.

### 5.2. Cách tính giờ tình nguyện & tín chỉ đơn giản, thực tế
- Mỗi phản ánh gửi lên: **1.5 giờ** cơ bản.
- Có ảnh hiện trường rõ ràng: Thưởng thêm **+0.5 giờ**.
- Có vị trí địa chỉ chính xác: Thưởng thêm **+0.5 giờ**.
- Khi nhà thầu đã xử lý xong (`Đã khắc phục`): Đạt trọn vẹn **2.5 giờ / vụ việc**.
- **Quy đổi tín chỉ ngoại khóa**: Cứ **5 giờ tình nguyện = 1.0 tín chỉ** (Chuẩn 20 giờ = 4.0 tín chỉ).

---

## 6. Danh Sách Nút Bấm & Thao Tác (Buttons & Actions)

| Tên Nút / Thao Tác | Vị Trí | Bấm vào sẽ làm gì? | Kích Thước Bấm |
|---|---|---|---|
| **[Đăng xuất]** | Góc phải khung thông tin cá nhân | Đăng xuất an toàn và chuyển về trang đăng nhập | Cao 44px |
| **[Xem hồ sơ chứng nhận →]** | Góc phải khối đóng góp | Mở trang Giấy chứng nhận điện tử có mã QR | Dễ bấm |
| **Chạm vào các ô số liệu** | Lưới 3 ô thống kê | Xem chi tiết giải thích cách tính giờ và tín chỉ | Bấm trên toàn ô |

---

## 7. Quy Chuẩn Trình Bày & Màu Sắc (UI/UX & Responsive)

### 7.1. Màu sắc sáng rõ, tương phản cao
- **Nền trang**: Màu kem sáng `#FDFBF7`, dịu mắt khi nhìn lâu.
- **Nền các khung thẻ**: Trắng tinh `#FFFFFF`, viền xám mềm `#E7E5E4`, bo tròn góc hiện đại.
- **Avatar đại diện**: Màu xanh ngọc `#0d6f64`, in hoa chữ cái đầu màu trắng nổi bật.
- **Huy hiệu công dân tích cực**: Nền xanh lá nhạt, chữ xanh đậm `#065F46`.
- **Màu các con số thống kê**:
  - Số tín chỉ: Đen than `#1C1917` (in đậm kích thước 24px - 28px).
  - Số vụ việc đã xử lý: Xanh ngọc `#0d6f64`.
  - Số giờ hoạt động: Vàng hổ phách `#B45309`.
- **Tuyệt đối không dùng kính mờ (glassmorphism)**: Giữ cho các số liệu luôn sắc nét, không bị nhòe.

### 7.2. Tương thích mọi màn hình
- **Điện thoại (360px — 430px)**: 3 ô số liệu tự động xếp dọc hoặc xếp dạng lưới mini vừa vặn màn hình, nút bấm cao tối thiểu 44px dễ bấm bằng ngón tay cái.
- **Máy tính (1024px — 1920px)**: 3 ô số liệu dàn ngang 3 cột đối xứng, trang web căn giữa gọn gàng `max-w-4xl`.

---

## 8. Tình Huống Thường Gặp & Cách Kiểm Tra (Edge Cases & Fast Test CLI)

### 8.1. Các tình huống thường gặp & Cách xử lý tự động
1. **Người dùng chưa đăng nhập tài khoản (Khách vãng lai)**: Màn hình tự động hiển thị tên *"Tài Khoản Công Dân"* và nhãn *"Chế độ công dân giám sát"*, không bao giờ bị lỗi hay trắng trang.
2. **Người mới chưa có giờ tình nguyện**: Số liệu tự động hiển thị `0.0h` và `0.0` tín chỉ chứ không bị hiển thị lỗi rỗng hay lỗi số học.
3. **Vừa gửi thêm phản ánh mới**: Khi quay lại trang cá nhân, số giờ và số vụ việc được tự động cập nhật ngay lập tức.

### 8.2. Lệnh kiểm tra nhanh hệ thống (Chạy bằng PowerShell)

```powershell
# Kiểm tra phân quyền và hồ sơ người dùng (< 0.5s)
node --test app/tests/auth-user-management-audit.test.js

# Kiểm tra tính toán giờ tình nguyện và trải nghiệm thanh niên (< 0.5s)
node --test app/tests/citizen-youth-ux.test.js

# Xác thực nhanh toàn hệ thống trước khi bàn giao (< 7s)
npm --prefix app run verify:quick
```
