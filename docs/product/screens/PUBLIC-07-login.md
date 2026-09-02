# PUB-07 — Cổng Đăng Nhập & Phân Quyền 5 Nhóm Người Dùng

---

## 1. Thông Tin Màn Hình

| Thuộc tính | Chi tiết |
|---|---|
| **Mã màn hình** | `PUB-07` |
| **Tên màn hình** | Cổng Đăng Nhập & Phân Quyền 5 Nhóm Người Dùng |
| **Đường dẫn (URL)** | `/login` (và `/register` cho trang đăng ký) |
| **Tệp mã nguồn** | `app/src/modules/auth/Login.jsx` |
| **Thành phần bổ trợ** | Form đăng nhập (`LoginForm.jsx`), Bảng giới thiệu nền tảng (`AuthBrandPanel.jsx`), Hộp thoại trải nghiệm 5 vai trò (`DemoAccessModal.jsx`), Nút đăng nhập Google (`SocialLoginButton.jsx`) |
| **Kiểu bố cục** | Giao diện 2 cột trên máy tính (Cột trái: Giới thiệu nền tảng; Cột phải: Khung đăng nhập tập trung) |
| **Ai được dùng** | Mọi người (Người dân, sinh viên, cán bộ, nhà thầu, lãnh đạo) |
| **Trạng thái hoạt động** | **Đang hoạt động tốt** (Hỗ trợ đăng nhập email/mật khẩu, Google và chọn nhanh 5 vai trò) |

---

## 2. Mục Đích & Ý Nghĩa Thực Tế

Trang **PUB-07** là cổng vào chính thức của hệ thống DustGuard VN, giúp phân loại và đưa đúng người vào đúng không gian làm việc của mình:

1. **Phân luồng chính xác cho 5 nhóm người dùng ngoài đời thực**:

| STT | Nhóm người dùng | Tài khoản mẫu | Mật khẩu chung | Trang mở ra | Nhiệm vụ thực tế |
|:---:|---|---|:---:|:---:|---|
| **1** | **Người dân đô thị** | `citizen@dustguard.vn` | `DustGuard@2026!` | `/citizen` | Gửi phản ánh bụi nhanh trong 30 giây, theo dõi xử lý công trình gần nhà, tích điểm rèn luyện. |
| **2** | **CLB Sinh viên & Tình nguyện** | `community@dustguard.vn` | `DustGuard@2026!` | `/community` | Nhận nhiệm vụ khảo sát thực tế quanh trường học, tích lũy giờ tình nguyện và đổi điểm rèn luyện. |
| **3** | **Cán bộ xử lý & Thanh tra** | `staff@dustguard.vn` | `DustGuard@2026!` | `/staff` | Xem bản đồ điểm nóng toàn quận, vận hành quy trình xử lý 7 bước, phát lệnh dập bụi và nghiệm thu. |
| **4** | **Nhà thầu xây dựng** | `contractor@dustguard.vn` | `DustGuard@2026!` | `/contractor` | Nhận yêu cầu dập bụi trong 24–48h, rửa bánh xe ben, nộp ảnh chụp Trước/Sau khi dập bụi. |
| **5** | **Lãnh đạo & Quản trị viên** | `admin@dustguard.vn`<br>`executive@dustguard.vn` | `DustGuard@2026!` | `/staff`<br>`/executive` | Xem báo cáo tổng hợp chỉ đạo điều hành, phê duyệt văn bản, theo dõi tiến độ xử lý toàn thành phố. |

2. **Đăng nhập Google 1-chạm**:
   - Người dân và sinh viên có thể đăng nhập ngay bằng tài khoản Google Gmail quen thuộc mà không cần nhớ thêm mật khẩu mới.
3. **Bảng trải nghiệm nhanh 5 vai trò cho Ban giám khảo**:
   - Tích hợp nút mở bảng 5 vai trò ở chân trang, giúp người chấm thi bấm vào là xem được ngay toàn bộ các phân hệ.
4. **Thông báo chuyển trang rõ ràng, yên tâm**:
   - Khi đăng nhập thành công, hệ thống hiện thông báo xanh chào mừng rõ tên và vai trò, sau đó chuyển trang ngay lập tức.

---

## 3. Hành Trình Người Dùng Thao Tác

```text
[Người dùng truy cập trang /login]
         │
         ├──> [Cách 1: Đăng nhập Email & Mật khẩu] ──> Nhập thông tin ──> Bấm [ĐĂNG NHẬP] ──> Vào trang làm việc
         │
         ├──> [Cách 2: Đăng ký tài khoản người dân] ─> Bấm [Tạo tài khoản mới] ──> Điền form ──> Vào Cổng công dân
         │
         ├──> [Cách 3: Đăng nhập Google 1-chạm] ────> Bấm [Tiếp tục với Google] ──> Chọn tài khoản ──> Vào trang làm việc
         │
         └──> [Cách 4: Xem nhanh 5 vai trò demo] ───> Bấm [✨ Trải nghiệm bản demo] ──> Chọn vai trò ──> Vào ngay
```

---

## 4. Bố Cục Giao Diện & Mô Phỏng Wireframe

### 4.1. Bố cục trên máy tính (2 Cột song song)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ THANH TRÊN CÙNG: [Logo Khiên Đỏ] DustGuard VN           [VI | EN]     [← Về trang chủ] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ KHÔNG GIAN CHÍNH (2 Cột cân đối):                                                      │
│                                                                                        │
│ ┌────────────────────────────────────────┐ ┌─────────────────────────────────────────┐ │
│ │ CỘT TRÁI: GIỚI THIỆU NỀN TẢNG          │ │ CỘT PHẢI: KHUNG ĐĂNG NHẬP              │ │
│ │ (Nền kem đậm, viền mỏng sắc nét)       │ │ (Nền trắng, bo góc lớn 24px)            │ │
│ │                                        │ │                                         │ │
│ │ • Giám sát rủi ro bụi đô thị           │ │ Tiêu đề: Chào mừng trở lại              │ │
│ │ • "Giám sát bụi. Phát hiện rủi ro.     │ │ Đăng nhập để tiếp tục làm việc          │ │
│ │    Hành động đúng lúc."                │ │                                         │ │
│ │                                        │ │ ┌─────────────────────────────────────┐ │ │
│ │ • QUY TRÌNH 3 BƯỚC:                    │ │ │ [ G ] Tiếp tục với Google           │ │ │
│ │   [01. Đo đạc] ──> [02. Phân tích]     │ │ └─────────────────────────────────────┘ │ │
│ │   ──> [03. Xử lý thực tế]              │ │ ─────────── hoặc bằng email ─────────── │ │
│ │                                        │ │                                         │ │
│ │ • 3 GIÁ TRỊ CỐT LÕI:                   │ │ Email công vụ hoặc cá nhân:             │ │
│ │   1. Dữ liệu hiện trường minh bạch     │ │ [ name@company.com                    ] │ │
│ │   2. Điểm ưu tiên xử lý rõ ràng        │ │ Mật khẩu:                               │ │
│ │   3. Có ảnh đối chứng Trước/Sau        │ │ [ ••••••••••••••••••••••••••••••  👁 ] │ │
│ │                                        │ │                                         │ │
│ │                                        │ │ ┌─────────────────────────────────────┐ │ │
│ │                                        │ │ │   [ ĐĂNG NHẬP (Nền Đỏ Son) ]        │ │ │
│ │                                        │ │ └─────────────────────────────────────┘ │ │
│ │                                        │ │ Chưa có tài khoản? [Tạo tài khoản mới]  │ │
│ │                                        │ │ ─────────────────────────────────────── │ │
│ │                                        │ │ [ ✨ Trải nghiệm bản demo theo vai trò ]│ │
│ └────────────────────────────────────────┘ └─────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ CHÂN TRANG: Điều khoản sử dụng · Chính sách bảo mật · © 2026 DustGuard VN               │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2. Bố cục trên điện thoại (1 Cột tập trung)

```text
┌──────────────────────────────────────────┐
│ [Logo Khiên Đỏ] DustGuard VN    [VI|EN]  │
├──────────────────────────────────────────┤
│ KHUNG ĐĂNG NHẬP TẬP TRUNG:               │
│                                          │
│ Chào mừng trở lại                        │
│ Đăng nhập để tiếp tục làm việc           │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ [ G ] Tiếp tục với Google            │ │
│ └──────────────────────────────────────┘ │
│ ────────── hoặc bằng email ─────────── │
│                                          │
│ Email: [ name@company.com            ] │
│ Mật khẩu: [ ••••••••••••••••••  👁   ] │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │   [ ĐĂNG NHẬP (Nền Đỏ Son) ]         │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Chưa có tài khoản? [Tạo tài khoản mới]   │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ [ ✨ Trải nghiệm demo 5 vai trò ]    │ │
│ └──────────────────────────────────────┘ │
├──────────────────────────────────────────┤
│ CHÂN TRANG: © 2026 DustGuard VN          │
└──────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & Kết Nối Hệ Thống

### 5.1. Xử lý sau khi đăng nhập
- Khi người dùng đăng nhập thành công, hệ thống kiểm tra vai trò tài khoản và chuyển hướng tự động:
  - Cán bộ xử lý $\rightarrow$ Chuyển về `/staff`
  - Lãnh đạo / Quản trị $\rightarrow$ Chuyển về `/staff` hoặc `/executive`
  - Nhà thầu thi công $\rightarrow$ Chuyển về `/contractor`
  - CLB Thanh niên $\rightarrow$ Chuyển về `/community`
  - Người dân $\rightarrow$ Chuyển về `/citizen`

### 5.2. Lưu trữ phiên làm việc an toàn
- Thông tin đăng nhập được lưu an toàn trong trình duyệt, giúp người dùng không phải đăng nhập lại nhiều lần khi tải lại trang.

---

## 6. Danh Sách Nút Bấm & Thao Tác

| Nút bấm / Thao tác | Vị trí | Màu sắc | Kích thước | Hành động khi bấm |
|---|---|---|:---:|---|
| **[ĐĂNG NHẬP]** | Cuối form nhập liệu | Nền đỏ son, chữ trắng | Chiều cao 48px | Kiểm tra email/mật khẩu và chuyển vào trang làm việc tương ứng |
| **[ĐĂNG KÝ TÀI KHOẢN]** | Cuối form đăng ký (`/register`) | Nền đỏ son, chữ trắng | Chiều cao 48px | Tạo tài khoản công dân mới và vào thẳng Cổng công dân |
| **[Tiếp tục với Google]** | Đầu form đăng nhập | Nền trắng, viền xám, icon Google | Chiều cao 46px | Mở cửa sổ đăng nhập bằng tài khoản Google |
| **[✨ Trải nghiệm bản demo]** | Chân khung đăng nhập | Nền kem sáng, viền mờ | Chiều cao 40px | Mở hộp thoại chọn 1 trong 5 vai trò để thử nhanh |
| **[Đăng nhập ngay]** | Trong hộp thoại demo | Nền đỏ son, icon mũi tên | Chiều cao 44px | Tự động đăng nhập vào vai trò đã chọn và vào việc ngay |
| **[Điền form]** | Trong hộp thoại demo | Nền trắng viền xám | Chiều cao 44px | Tự điền email vai trò vào ô nhập liệu để người dùng tự bấm |
| **[VI / EN]** | Góc phải thanh menu | Nút gạt chuyển ngôn ngữ | Chiều cao 38px | Chuyển đổi toàn bộ ngôn ngữ giao diện giữa Tiếng Việt và Tiếng Anh |

---

## 7. Tiêu Chuẩn Giao Diện & Hiển Thị Đa Thiết Bị

### 7.1. Màu sắc và độ tương phản (Sáng rõ, dứt khoát)
- **Nền trang chính**: Màu kem sáng `#FDFBF7` dịu mắt.
- **Khung đăng nhập**: Nền trắng nguyên khối `#FFFFFF`, bo góc 24px, viền mỏng tinh tế.
- **Nút hành động chính**: Màu đỏ son `#9F241F` nổi bật, tạo cảm giác hành động rõ ràng.
- **Chữ hiển thị**: Màu đen mực `#231B14`, độ đậm rõ nét, cực kỳ dễ đọc.
- **Nguyên tắc bất biến**: Tuyệt đối **không dùng kính mờ (glassmorphism)**, chữ luôn đậm nét trên nền đặc.

### 7.2. Hiển thị trên các thiết bị
- **Điện thoại**:
  - Tự động ẩn cột giới thiệu bên trái để tập trung hoàn toàn vào khung đăng nhập.
  - Các ô nhập liệu và nút bấm cao từ 48px trở lên, rất dễ bấm bằng một tay.
- **Laptop 14-inch (1366x768 & 1536x864)**:
  - Hiển thị 2 cột cân xứng, toàn bộ nội dung vừa vặn trên 1 màn hình, không cần cuộn trang.
- **Màn hình lớn (1920x1080)**:
  - Căn giữa trang nhã trong khung nhìn chuẩn.

---

## 8. Xử Lý Lỗi & Tình Huống Thực Tế

### 8.1. Các tình huống thường gặp và cách xử lý
1. **Gõ sai email hoặc mật khẩu**:
   - *Cách xử lý*: Hiện khung báo lỗi màu đỏ nhẹ: *"Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại."*, giữ nguyên email đã gõ để người dùng chỉ cần gõ lại mật khẩu.
2. **Tài khoản bị tạm khóa**:
   - *Cách xử lý*: Hiện thông báo: *"Tài khoản của bạn đang bị tạm khóa. Vui lòng liên hệ ban quản trị."*.
3. **Mất kết nối mạng Internet khi bấm đăng nhập**:
   - *Cách xử lý*: Hiện thông báo: *"Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại đường truyền mạng."*.
4. **Phiên làm việc đã hết hạn sau thời gian dài không dùng**:
   - *Cách xử lý*: Hệ thống tự động chuyển về trang đăng nhập kèm lời nhắn phiên làm việc đã kết thúc để người dùng đăng nhập lại an toàn.

### 8.2. Lệnh kiểm tra hệ thống nhanh bằng PowerShell (< 0.5s)
```powershell
# 1. Kiểm tra việc đăng nhập và phân quyền các vai trò
node --test app/tests/auth-user-management-audit.test.js

# 2. Kiểm tra luồng xác thực trên giao diện
node --test app/tests/clerk-frontend-hybrid-auth.test.js

# 3. Kiểm tra bảo mật tài khoản cán bộ và quản trị
node --test app/tests/admin-executive-rbac-penetration.test.js
```
