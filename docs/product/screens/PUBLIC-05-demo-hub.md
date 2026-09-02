# PUB-05 — Trung Tâm Trải Nghiệm & Thử Nghiệm 5 Vai Trò

---

## 1. Thông Tin Màn Hình

| Thuộc tính | Chi tiết |
|---|---|
| **Mã màn hình** | `PUB-05` |
| **Tên màn hình** | Trung Tâm Trải Nghiệm & Thử Nghiệm 5 Vai Trò |
| **Đường dẫn (URL)** | `/demo` (hoặc `/demo/accounts`) |
| **Tệp mã nguồn** | `app/src/modules/public/DemoHub.jsx` |
| **Kiểu bố cục** | Giao diện công khai (Thanh menu trên cùng + Nội dung chính + Chân trang) |
| **Ai được dùng** | Mọi người (Ban giám khảo, khách xem, cán bộ, sinh viên, người dân) |
| **Trạng thái hoạt động** | **Đang hoạt động tốt** (Đăng nhập 1-chạm vào hệ thống dữ liệu thật) |

---

## 2. Mục Đích & Ý Nghĩa Thực Tế

### 2.1. Giải quyết vấn đề gì cho người dùng và người chấm thi?
Khi giới thiệu một nền tảng theo dõi môi trường đô thị như DustGuard VN, có rất nhiều bên cùng tham gia (người dân, cán bộ, sinh viên tình nguyện, nhà thầu xây dựng). Nếu bắt người xem phải tự tạo 5 tài khoản khác nhau rồi đăng xuất, đăng nhập nhiều lần thì rất mất thời gian và khó hình dung.

**Trang Trải Nghiệm Demo (`/demo`) giúp giải quyết việc này:**
1. **Trải nghiệm nhanh 5 vai trò 1-chạm không cần mật khẩu**: Người xem chỉ cần bấm một nút là vào thẳng ngay màn hình làm việc thực tế của vai trò đó trong tích tắc.
2. **Dữ liệu thật, không dùng số liệu ảo**: Toàn bộ thao tác đều được ghi nhận vào cơ sở dữ liệu thật của hệ thống, giúp người xem thấy rõ tính thực tế và liên thông.
3. **Phân định rõ con người và thiết bị đo**: Trạm cảm biến đo bụi ngoài trời được xếp vào mục thiết bị riêng, có trang xem sóng đo trực tiếp, không bị nhầm lẫn với tài khoản người dùng.
4. **Kịch bản vụ việc mẫu thực tế**: Mô phỏng sẵn một quy trình xử lý bụi từ đầu đến cuối (từ lúc cảm biến báo bụi cao, người dân gửi ảnh, cán bộ lập biên bản, đến khi nhà thầu dập bụi xong và đóng hồ sơ).

### 2.2. Bảng so sánh cách làm cũ vs Cách làm của DustGuard VN
| Điểm so sánh | Cách làm cũ | Cách làm của DustGuard VN |
|---|---|---|
| **Cách vào thử** | Phải tự gõ email và mật khẩu nhiều lần | Bấm 1 nút là vào ngay vai trò cần xem |
| **Dữ liệu hiển thị** | Dùng dữ liệu giả tạm bợ trong mã | Kết nối cơ sở dữ liệu thật của hệ thống |
| **Hiểu vai trò** | Rời rạc, người xem tự mò mẫm | 5 Thẻ vai trò có màu sắc và nhiệm vụ rõ ràng |
| **Thiết bị cảm biến** | Dễ nhầm tạo tài khoản người cho máy móc | Có thẻ thiết bị riêng, xem trực tiếp số đo |
| **Kịch bản theo dõi** | Không có câu chuyện rõ ràng | Có kịch bản mẫu 6 bước theo đúng đời thực |

---

## 3. Hành Trình Người Dùng Thao Tác

```text
[Người xem truy cập trang /demo]
        │
        ├──> [Cách 1] THỬ NHANH 5 VAI TRÒ (1 Bấm vào ngay):
        │      ├── Bấm [Vào bản demo] Người dân ──────> Mở Cổng công dân (/citizen)
        │      ├── Bấm [Vào bản demo] Cán bộ xử lý ───> Mở Bàn làm việc cán bộ (/staff)
        │      ├── Bấm [Vào bản demo] CLB Thanh niên ─> Mở Cổng tình nguyện (/community)
        │      ├── Bấm [Vào bản demo] Nhà thầu ────────> Mở Bàn làm việc nhà thầu (/contractor)
        │      └── Bấm [Vào bản demo] Quản trị viên ───> Mở Cài đặt hệ thống (/staff/settings)
        │
        ├──> [Cách 2] XEM THIẾT BỊ CẢM BIẾN ĐO BỤI:
        │      └── Bấm [Xem dữ liệu trạm đo] ──────────> Mở Bàn thử nghiệm trạm đo (/demo/iot)
        │
        ├──> [Cách 3] XEM KỊCH BẢN MẪU XỬ LÝ BỤI (6 Bước):
        │      ├── Bấm vào từng bước (1 đến 6) ────────> Thẻ bước sáng lên kèm chi tiết
        │      └── Bấm [Xem danh sách Hồ sơ Vụ việc] ──> Mở danh sách hồ sơ (/staff/cases)
        │
        └──> [Cách 4] XEM BẢN ĐỒ VÀ CHIẾN DỊCH:
               ├── Bấm [Mở Bản đồ Công khai] ──────────> Mở Bản đồ bụi (/citizen/map)
               └── Bấm [Xem Chiến dịch Cộng đồng] ─────> Mở Danh sách chiến dịch (/community/discover)
```

---

## 4. Bố Cục Giao Diện & Mô Phỏng Wireframe

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ THANH ĐIỀU HƯỚNG TRÊN CÙNG                                                                       │
│ [DG] DustGuard VN  · TRUNG TÂM TRẢI NGHIỆM                    [📻 Trạm đo IoT]   [← Về Trang chủ] │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PHẦN GIỚI THIỆU CHÍNH                                                                            │
│ ✨ Trải nghiệm toàn diện không gian DustGuard VN                                                 │
│ Khám phá cách DustGuard VN vận hành trong 60 giây                                                │
│ Nền tảng kết nối 5 nhóm người dùng cùng chung tay giảm bụi đô thị minh bạch và hiệu quả.          │
│ [✓ Dữ liệu thật]  [✓ Quy trình khép kín]  [✓ Bằng chứng rõ ràng]                                 │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PHẦN 1: 5 THẺ VAI TRÒ VÀ 1 THẺ THIẾT BỊ ĐO BỤI (Xếp 3 cột trên máy tính)                         │
│ ┌───────────────────────────┐ ┌───────────────────────────┐ ┌──────────────────────────────────┐ │
│ │ [Công dân]                │ │ [Cơ quan QL]              │ │ [Tình nguyện]                    │ │
│ │ 01. Người dân đô thị      │ │ 02. Cán bộ xử lý          │ │ 03. CLB & Sinh viên Tình nguyện  │ │
│ │ Gửi phản ánh bụi kèm ảnh, │ │ Tiếp nhận vụ việc, thanh  │ │ Tham gia khảo sát thực địa,      │ │
│ │ theo dõi tiến độ xử lý.   │ │ tra hiện trường, ra lệnh. │ │ tích lũy điểm rèn luyện.         │ │
│ │ • Gửi phản ánh nhanh      │ │ • Quản lý hồ sơ vi phạm   │ │ • Khảo sát quanh trường học      │ │
│ │ • Tra cứu mã hồ sơ        │ │ • Phát lệnh dập bụi       │ │ • Làm nhiệm vụ 24-48h            │ │
│ │ • Xem bản đồ chất lượng   │ │ • Nghiệm thu công trình   │ │ • Tích lũy giờ tình nguyện       │ │
│ │ ───────────────────────── │ │ ───────────────────────── │ │ ──────────────────────────────── │ │
│ │ demo-citizen@...          │ │ demo-inspector@...        │ │ demo-community@...               │ │
│ │ [Vào bản demo →] (Xanh)   │ │ [Vào bản demo →] (Đỏ son) │ │ [Vào bản demo →] (Xanh ngọc)     │ │
│ └───────────────────────────┘ └───────────────────────────┘ └──────────────────────────────────┘ │
│ ┌───────────────────────────┐ ┌───────────────────────────┐ ┌──────────────────────────────────┐ │
│ │ [Đơn vị thi công]         │ │ [Quản trị viên]           │ │ [📻 Thiết bị ngoài trời]         │ │
│ │ 04. Nhà thầu xây dựng     │ │ 05. Ban Quản trị Hệ thống │ │ 06. Trạm Cảm Biến Đo Bụi (IoT)   │ │
│ │ Nhận yêu cầu dập bụi,     │ │ Quản lý danh mục CLB,     │ │ Trạm đo tự động gắn ở công       │ │
│ │ nộp ảnh trước và sau.     │ │ trạm đo và tài khoản.     │ │ trường, gửi số đo PM2.5 liên tục.│ │
│ │ • Nhận lệnh khắc phục     │ │ • Quản lý danh sách CLB   │ │ Mã trạm: DG-HCM-001 (An Phú)     │ │
│ │ • Nộp ảnh đối chứng       │ │ • Quản lý Trạm đo bụi     │ Trạng thái: ● Đang hoạt động       │ │
│ │ • Theo dõi điểm tuân thủ  │ │ • Nhật ký hoạt động       │ (Không cần tài khoản)              │ │
│ │ ───────────────────────── │ │ ───────────────────────── │ │ ──────────────────────────────── │ │
│ │ demo-contractor@...       │ │ demo-admin@...            │ │ [Xem dữ liệu trạm đo →] (Xanh)   │ │
│ │ [Vào bản demo →] (Vàng)   │ │ [Vào bản demo →] (Đen)    │ │                                  │ │
│ └───────────────────────────┘ └───────────────────────────┘ └──────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PHẦN 2: KỊCH BẢN VỤ VIỆC MẪU (Xử lý bụi tại Công trình Khu đô thị An Phú)                         │
│ ┌───────────────────────────┐ ┌───────────────────────────┐ ┌──────────────────────────────────┐ │
│ │ 08:15 [CẢNH BÁO BỤI]      │ │ 08:40 [XÁC THỰC HIỆN TRƯỜNG│ 09:00 [TIẾP NHẬN XỬ LÝ]          │ │
│ │ 1. Cảm biến phát hiện bụi │ │ 2. Dân báo & CLB chụp ảnh │ │ 3. Cán bộ mở hồ sơ theo dõi      │ │
│ │ Bụi PM2.5 vượt 118 µg/m³  │ │ Xe ben làm rơi vãi đất cát│ │ Giao nhiệm vụ cho Đội thanh tra  │ │
│ ├───────────────────────────┼───────────────────────────┼──────────────────────────────────┤ │
│ │ 10:30 [RA LỆNH KHẮC PHỤC] │ │ 16:00 [DẬP BỤI XONG]      │ │ 09:00 Hôm sau [HOÀN TẤT]         │ │
│ │ 4. Lập biên bản yêu cầu   │ │ 5. Nhà thầu xịt rửa đường │ │ 6. Kiểm tra lại & Đóng hồ sơ     │ │
│ │ Thiếu hố rửa xe, hạn 24h  │ │ Lắp cầu rửa xe & nộp ảnh  │ │ Bụi về mức an toàn 24 µg/m³      │ │
│ └───────────────────────────┘ └───────────────────────────┘ └──────────────────────────────────┘ │
│ [Xem danh sách Hồ sơ Vụ việc →]                                                                  │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PHẦN 3: BẢN ĐỒ VÀ CHIẾN DỊCH CỘNG ĐỒNG (2 Cột)                                                   │
│ ┌──────────────────────────────────────────────┬───────────────────────────────────────────────┐ │
│ │ 📍 Bản đồ Giám sát Bụi Mở                    │ 📄 Chiến dịch & Hành động Cộng đồng           │ │
│ │ Xem vị trí các trạm đo và các điểm phản ánh  │ Danh sách các hoạt động khảo sát không khí    │ │
│ │ của người dân trên toàn thành phố.           │ do các nhóm sinh viên tình nguyện phụ trách.  │ │
│ │ [ Mở Bản đồ Công khai → ]                    │ [ Xem Chiến dịch Cộng đồng → ]                │ │
│ └──────────────────────────────────────────────┴───────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ CHÂN TRANG: © 2026 DustGuard VN — Nền tảng Giám sát & Hành động vì Không khí Sạch.                 │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & Kết Nối Hệ Thống

### 5.1. Danh sách 5 tài khoản thử nghiệm có sẵn
| Vai trò | Email đăng nhập | Mật khẩu chung | Trang mở ra sau khi bấm | Mục đích thử nghiệm |
|---|---|---|---|---|
| **Người dân** | `demo-citizen@dustguard.vn` | `DustGuard@2026!` | `/citizen` | Thử gửi phản ánh bụi, xem trạng thái hồ sơ |
| **Cán bộ xử lý** | `demo-inspector@dustguard.vn` | `DustGuard@2026!` | `/staff` | Xem danh sách vụ việc, lập biên bản, nghiệm thu |
| **CLB Thanh niên** | `demo-community@dustguard.vn` | `DustGuard@2026!` | `/community` | Xem nhiệm vụ thực địa quanh trường học, tích điểm |
| **Nhà thầu xây dựng** | `demo-contractor@dustguard.vn` | `DustGuard@2026!` | `/contractor` | Xem công trình được giao, nộp ảnh đã dập bụi |
| **Quản trị viên** | `demo-admin@dustguard.vn` | `DustGuard@2026!` | `/staff/settings` | Quản lý danh mục trạm đo, tài khoản và hệ thống |

### 5.2. Cách thức hệ thống xử lý khi bấm nút
- Khi người dùng bấm **[Vào bản demo]**, hệ thống tự động gửi yêu cầu đăng nhập bằng tài khoản tương ứng, nhận phiên làm việc thật và chuyển sang trang đích ngay lập tức.
- Nếu đường truyền mạng bị chậm, hệ thống vẫn tự động chuyển trang an toàn để người xem không bị dừng lại giữa chừng.

---

## 6. Danh Sách Nút Bấm & Thao Tác

| Nút bấm / Thao tác | Vị trí | Màu sắc | Kích thước | Hành động khi bấm |
|---|---|---|:---:|---|
| **[Vào bản demo →]** | Dưới mỗi thẻ vai trò | Nền đen chữ trắng (hoặc màu theo vai trò) | Chiều cao 44px | Đăng nhập tài khoản tương ứng và chuyển ngay tới trang làm việc |
| **[Xem dữ liệu trạm đo →]** | Thẻ Trạm đo IoT | Nền xanh ngọc chữ trắng | Chiều cao 44px | Chuyển thẳng sang trang `/demo/iot` |
| **Chọn bước kịch bản (1-6)** | Phần kịch bản mẫu | Thẻ được chọn bật viền đỏ nổi bật | Toàn bộ thẻ | Hiển thị chi tiết nội dung của bước tương ứng |
| **[Xem danh sách Hồ sơ Vụ việc]** | Dưới kịch bản mẫu | Nền đỏ son chữ trắng | Chiều cao 44px | Chuyển tới trang danh sách hồ sơ cán bộ `/staff/cases` |
| **[Mở Bản đồ Công khai →]** | Thẻ Bản đồ mở | Nền kem viền xám | Chiều cao 40px | Mở trang bản đồ chất lượng không khí `/citizen/map` |
| **[Xem Chiến dịch Cộng đồng →]** | Thẻ Chiến dịch | Nền kem viền xám | Chiều cao 40px | Mở trang khám phá chiến dịch `/community/discover` |
| **[← Về Trang chủ]** | Góc phải thanh menu | Nền trong suốt chữ đậm | Chiều cao 38px | Quay về Trang chủ `/` |

---

## 7. Tiêu Chuẩn Giao Diện & Hiển Thị Đa Thiết Bị

### 7.1. Màu sắc và font chữ (Sáng rõ, dễ đọc ngoài trời)
- **Nền trang**: Màu kem sáng `#FDFBF7` giúp mắt không bị chói.
- **Thẻ nội dung**: Nền trắng `#FFFFFF`, viền xám nhạt rõ nét.
- **Màu nhận diện từng vai trò**:
  - Người dân: Viền xanh dương
  - Cán bộ xử lý: Viền đỏ son
  - CLB Thanh niên: Viền xanh ngọc
  - Nhà thầu thi công: Viền vàng hổ phách
  - Quản trị viên: Viền đen mực
  - Trạm cảm biến: Viền xanh ngọc kèm nền phớt xanh
- **Nguyên tắc bất biến**: Tuyệt đối **không dùng hiệu ứng kính mờ (glassmorphism)**, chữ luôn đậm rõ trên nền sáng.

### 7.2. Hiển thị trên các kích thước màn hình
- **Điện thoại (360px – 430px)**:
  - 5 Thẻ vai trò và 6 bước kịch bản tự động xếp thành 1 cột dọc.
  - Các nút bấm có chiều cao tối thiểu 44px, dễ dàng bấm bằng ngón tay cái.
- **Laptop 14-inch (1366x768 & 1440x900)**:
  - Thẻ vai trò chia 3 cột cân đối, hiển thị trọn vẹn không bị tràn mép ngang.
  - Kịch bản mẫu chia làm 2 hàng $\times$ 3 cột gọn gàng.
- **Màn hình lớn (1920x1080)**:
  - Nội dung căn giữa trang nhã, khoảng cách lề thoáng đãng.

---

## 8. Xử Lý Lỗi & Tình Huống Thực Tế

### 8.1. Các tình huống thường gặp và cách xử lý
1. **Mạng chậm hoặc chập chờn khi bấm thử vai trò**:
   - *Cách xử lý*: Hệ thống không để nút bấm bị treo; nếu mạng chậm thì vẫn tự động chuyển người dùng tới trang đích an toàn.
2. **Không phân biệt được trạm đo với tài khoản người dùng**:
   - *Cách xử lý*: Thẻ trạm đo được đặt nhãn "Thiết bị ngoài trời", ghi rõ "Không cần tài khoản" và có nút dẫn thẳng sang bàn thử nghiệm cảm biến.
3. **Hiển thị email trên màn hình nhỏ**:
   - *Cách xử lý*: Email dài được rút gọn vừa mắt, khi di chuột vào sẽ hiện đầy đủ địa chỉ email.

### 8.2. Lệnh kiểm tra hệ thống nhanh bằng PowerShell (< 0.5s)
```powershell
# 1. Kiểm tra trang DemoHub và các liên kết công khai
node --test app/tests/landing-ssot-guard.test.js

# 2. Kiểm tra việc đăng nhập nhanh 5 vai trò
node --test app/tests/auth-user-management-audit.test.js

# 3. Kiểm tra toàn bộ đường dẫn hệ thống
node --test app/tests/worker-full-edge-routes.test.js
```
