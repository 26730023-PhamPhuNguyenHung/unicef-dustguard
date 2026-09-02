# PUB-07 — Cổng Xác Thực Danh Tính & Phân Quyền 5 Nhóm Vai Trò (Auth Login & Role Routing)

---

## 1. Screen Identity

| Thuộc tính | Giá trị SSOT |
|---|---|
| **Mã màn hình** | `PUB-07` |
| **Tên tiếng Việt** | Cổng Xác Thực Danh Tính & Phân Quyền 5 Nhóm Vai Trò |
| **Tên tiếng Anh** | Identity Gateway, Authentication & Role-Based Access Routing (RBAC) |
| **Route URL** | `/login` (và `/register` cho luồng đăng ký) |
| **Component Path** | `app/src/modules/auth/Login.jsx` |
| **Sub-components** | `LoginForm.jsx` (`app/src/modules/auth/components/LoginForm.jsx`), `AuthHeader.jsx`, `AuthFooter.jsx`, `AuthBrandPanel.jsx`, `DemoAccessModal.jsx`, `SocialLoginButton.jsx`, `PasswordField.jsx`, `lib/auth-client.js`, `context/AuthContext.jsx` |
| **Layout** | Split-Screen Auth Layout (Cột trái: Brand Intelligence Panel trên Desktop $\ge 1024\text{px}$; Cột phải: Khung đăng nhập tập trung) |
| **Quyền truy cập (Role)** | Public / Guest / Người dùng đăng nhập (5 nhóm vai trò thực tế ở Việt Nam: Citizen, Community, Staff, Contractor, Executive/Admin) |
| **Trạng thái Triển khai** | **ACTIVE** (Level 5 Production Coherent — Xác thực kép Hybrid Clerk / Local D1 & Bảng Demo 5 vai trò) |

---

## 2. Mục Đích Nghiệp Vụ & Giá Trị Thực Tế

Trang **PUB-07** là cổng định danh số duy nhất (Single Identity Gateway) phục vụ toàn bộ hệ sinh thái giám sát bụi đô thị DustGuard VN, giải quyết bài toán phân quyền phức tạp giữa các lực lượng xã hội tại Việt Nam:

1. **Phân quyền chuẩn xác 5 nhóm tác nghiệp thực tế tại Việt Nam (RBAC SSOT)**:

| STT | Nhóm người dùng | Tài khoản Demo | Mật khẩu chung | Phân hệ đích | Mục đích tác nghiệp thực tế |
|:---:|---|---|:---:|:---:|---|
| **1** | **Người dân đô thị** *(Citizen)* | `citizen@dustguard.vn` | `DustGuard@2026!` | `/citizen` | Gửi phản ánh hiện trường trong 30 giây, theo dõi tiến độ xử lý hồ sơ vi phạm gần nhà, tích lũy Tín chỉ Xanh. |
| **2** | **Thủ lĩnh CLB Sinh viên & TNV** *(Community)* | `community@dustguard.vn` | `DustGuard@2026!` | `/community` | Tổ chức chiến dịch khảo sát hiện trường, điều phối tình nguyện viên, điền checklist thực địa, quy đổi 20 giờ tình nguyện = 4.0 tín chỉ rèn luyện (kèm mã QR chuẩn ISO/IEC 18004). |
| **3** | **Cán bộ Môi trường & Thanh tra** *(Staff)* | `staff@dustguard.vn` | `DustGuard@2026!` | `/staff` | Giám sát bản đồ điểm nóng toàn địa bàn Phường/Quận, thẩm định điểm rủi ro $R/100$, vận hành quy trình hồ sơ 7 bước DAG, phát lệnh xử phạt và tái kiểm tra. |
| **4** | **Chỉ huy trưởng Nhà thầu** *(Contractor)* | `contractor@dustguard.vn` | `DustGuard@2026!` | `/contractor` | Tiếp nhận yêu cầu khắc phục dập bụi trong 24–48h, rửa bánh xe ben, nộp ảnh đối chứng Trước/Sau (Before/After) có định vị GPS Geofence $\le 50\text{m}$. |
| **5** | **Lãnh đạo UBND & Quản trị viên** *(Executive/Admin)* | `admin@dustguard.vn`<br>`executive@dustguard.vn` | `DustGuard@2026!` | `/staff`<br>`/executive` | Xem báo cáo tổng hợp chỉ đạo điều hành theo thể thức Nghị định 30/2020/NĐ-CP, phê duyệt quyết định xử phạt vi phạm hành chính, ký số văn bản. |

2. **Kiến trúc Xác thực Kép (Hybrid Identity Engine)**:
   - Tích hợp linh hoạt giữa nền tảng xác thực đám mây **Clerk Identity Platform** (khi có cấu hình biến môi trường) và **Local Auth Engine & D1 SQLite Session** khi chạy độc lập ngoại tuyến.
3. **Đăng nhập Google OAuth 1-chạm (`SocialLoginButton`)**:
   - Cho phép người dân, sinh viên tình nguyện đăng nhập tức thì bằng tài khoản Google Gmail mà không cần ghi nhớ mật khẩu.
4. **Bảng Vai trò Demo 1-chạm (`DemoAccessModal`) phục vụ Giám khảo**:
   - Tích hợp modal cho phép Ban Giám khảo UNICEF Hackathon bấm 1-click đăng nhập ngay vào bất kỳ vai trò nào để thẩm định toàn bộ luồng nghiệp vụ.
5. **Thông báo chuyển hướng tức thì (Toast Reassurance)**:
   - Hiển thị Toast thông báo màu xanh teal: *"Đăng nhập thành công! Chào mừng [Tên] ([Vai trò]). Đang chuyển hướng..."*, tạo sự an tâm và minh bạch tuyệt đối trước khi điều hướng.

---

## 3. Luồng Hành Trình Người Dùng (User Journey)

```text
[Người dùng truy cập /login]
             │
             ├──> [Luồng 1: Đăng nhập Email/Mật khẩu] ──> POST /auth/login ──> Toast Chào mừng ──> Điều hướng RBAC
             │
             ├──> [Luồng 2: Đăng ký Công dân mới] ──> Bấm [Tạo tài khoản] ──> Nhập Form ──> POST /auth/register ──> /citizen
             │
             ├──> [Luồng 3: Đăng nhập Google 1-chạm] ──> Google OAuth ──> Callback ──> Điều hướng RBAC
             │
             └──> [Luồng 4: Trải nghiệm Demo 5 Vai trò] ──> Mở Modal Demo ──> Bấm [Đăng nhập ngay] ──> Vào thẳng phân hệ
```

### Chi tiết 4 luồng thao tác:
1. **Luồng 1 — Đăng nhập bằng Email & Mật khẩu (Tiêu chuẩn)**:
   - Người dùng nhập Email và Mật khẩu $\rightarrow$ Bấm **[Đăng nhập]** (nền đỏ son `#9f241f`).
   - Hệ thống xác thực danh tính, lưu JWT token an toàn vào Session Storage.
   - Toast hiển thị chào mừng và tự động chuyển hướng về đúng phân hệ sau 400ms.
2. **Luồng 2 — Đăng ký tài khoản Công dân mới (`/register`)**:
   - Người dùng bấm liên kết **"Tạo tài khoản"** hoặc truy cập `/register`.
   - Nhập Họ và tên, Email, Mật khẩu, Xác nhận mật khẩu (tối thiểu 6 ký tự).
   - Bấm **[Đăng ký tài khoản]** $\rightarrow$ Hệ thống tự động khởi tạo và đăng nhập thẳng vào Cổng công dân `/citizen`.
3. **Luồng 3 — Đăng nhập Google OAuth 1-chạm**:
   - Người dùng bấm nút **[Tiếp tục với Google]** $\rightarrow$ Chuyển tới giao diện xác thực an toàn của Google $\rightarrow$ Quay lại trang đích ban đầu (`callbackUrl`).
4. **Luồng 4 — Trải nghiệm Demo 5 vai trò (Dành cho Ban Giám khảo)**:
   - Bấm nút **[✨ Trải nghiệm bản demo theo vai trò]** ở chân form.
   - Modal `DemoAccessModal` hiển thị 5 thẻ vai trò $\rightarrow$ Bấm **[Đăng nhập ngay]** để truy cập tức thì hoặc bấm **[Điền form]** để tự bấm đăng nhập.

---

## 4. Bố Cục Trực Quan & Wireframe ASCII (Information Hierarchy)

### 4.1. Bố cục Split-Screen trên Desktop ($\ge 1024\text{px}$)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER: [Logo Khiên Đỏ] DustGuard VN                [VI | EN]      [← Về trang chủ]    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ MAIN 2-COLUMN WORKSPACE:                                                               │
│                                                                                        │
│ ┌────────────────────────────────────────┐ ┌─────────────────────────────────────────┐ │
│ │ CỘT TRÁI: BRAND INTELLIGENCE PANEL     │ │ CỘT PHẢI: KHUNG ĐĂNG NHẬP (LOGIN CARD)  │ │
│ │ (Nền kem đậm, viền mờ sắc nét)         │ │ (Nền trắng nguyên khối, bo góc 24px)    │ │
│ │                                        │ │                                         │ │
│ │ • [Civic Tech · Giám sát rủi ro bụi]   │ │ H2: Chào mừng trở lại                   │ │
│ │ • H1: Giám sát bụi. Phát hiện rủi ro.  │ │ P: Đăng nhập để tiếp tục tác nghiệp     │ │
│ │       Hành động đúng lúc.              │ │                                         │ │
│ │                                        │ │ ┌─────────────────────────────────────┐ │ │
│ │ • DÒNG DỮ LIỆU 3 BƯỚC:                 │ │ │ [ G ] Tiếp tục với Google           │ │ │
│ │   [01. Quan trắc] ──> [02. Phân tích]  │ │ └─────────────────────────────────────┘ │ │
│ │   ──> [03. Xử lý thực địa 7 bước]      │ │ ─────────── hoặc bằng email ─────────── │ │
│ │                                        │ │                                         │ │
│ │ • 3 TRỤ CỘT GIÁ TRỊ CỐT LÕI:           │ │ Email công vụ hoặc cá nhân:             │ │
│ │   1. Dữ liệu hiện trường minh bạch     │ │ [ name@company.com                    ] │ │
│ │   2. Điểm ưu tiên rủi ro 0-100         │ │ Mật khẩu:                               │ │
│ │   3. Khắc phục có chuỗi chứng cứ số    │ │ [ ••••••••••••••••••••••••••••••  👁 ] │ │
│ │                                        │ │                                         │ │
│ │                                        │ │ [ Alert Báo Lỗi Nền Đỏ (nếu sai MK)   ] │ │
│ │                                        │ │ ┌─────────────────────────────────────┐ │ │
│ │                                        │ │ │   [ ĐĂNG NHẬP (Nền Đỏ Son) ]        │ │ │
│ │                                        │ │ └─────────────────────────────────────┘ │ │
│ │                                        │ │ Chưa có tài khoản? [Tạo tài khoản mới]  │ │
│ │                                        │ │ ─────────────────────────────────────── │ │
│ │                                        │ │ [ ✨ Trải nghiệm bản demo theo vai trò ]│ │
│ └────────────────────────────────────────┘ └─────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ FOOTER: Điều khoản sử dụng · Chính sách quyền riêng tư · © 2026 DustGuard VN           │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2. Bố cục Đơn cột trên Mobile ($< 1024\text{px}$)

```text
┌──────────────────────────────────────────┐
│ [Logo Khiên Đỏ] DustGuard VN    [VI|EN]  │
├──────────────────────────────────────────┤
│ KHUNG ĐĂNG NHẬP TẬP TRUNG (Single Col):  │
│                                          │
│ H2: Chào mừng trở lại                    │
│ P: Đăng nhập để tiếp tục tác nghiệp      │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ [ G ] Tiếp tục với Google            │ │
│ └──────────────────────────────────────┘ │
│ ────────── hoặc bằng email ─────────── │
│                                          │
│ [ Email: name@company.com             ] │
│ [ Mật khẩu: ••••••••••••••••••••  👁  ] │
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
│ FOOTER: © 2026 DustGuard VN              │
└──────────────────────────────────────────┘
```

---

## 5. Hợp Đồng Dữ Liệu & API / D1 Database Contract

### 5.1. Danh sách API Endpoints Xác thực:
- `POST /auth/login` — Xác thực Email/Mật khẩu $\rightarrow$ Trả về thông tin User và JWT Token.
- `POST /auth/register` — Đăng ký tài khoản công dân mới.
- `GET /auth/me` — Kiểm tra và làm mới phiên làm việc hiện tại.
- `POST /auth/logout` — Hủy phiên làm việc và dọn dẹp Session Storage.
- `POST /auth/sign-in/social` — Khởi tạo luồng xác thực Google OAuth.

### 5.2. Cấu trúc Response Danh tính Chuẩn Hóa (Normalized Identity Contract):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_staff_01",
      "email": "staff@dustguard.vn",
      "name": "Nguyễn Hải Đăng",
      "fullName": "Nguyễn Hải Đăng - Cán bộ thanh tra",
      "role": "staff",
      "department": "Thanh tra Môi trường Đô thị",
      "ward": "Dịch Vọng Hậu",
      "district": "Cầu Giấy",
      "city": "Hà Nội",
      "allowedModes": ["staff", "citizen"],
      "defaultMode": "staff",
      "profile": {
        "phoneNumber": "0912345678",
        "workAddress": "128 Trần Thái Tông, Cầu Giấy, Hà Nội"
      }
    }
  }
}
```

### 5.3. Bảng Ánh Xạ Phân Luồng RBAC Smart Routing:
```javascript
const getTargetRoute = (user) => {
  if (user?.defaultMode) return `/${user.defaultMode}`;
  if (user?.role === 'staff' || user?.role === 'inspector') return '/staff';
  if (user?.role === 'community' || user?.role === 'youth_member') return '/community';
  if (user?.role === 'executive' || user?.role === 'admin') return '/staff';
  if (user?.role === 'contractor') return '/contractor';
  return '/citizen';
};
```

### 5.4. Ánh xạ Bảng Cơ sở dữ liệu D1 SQLite (Schema SSOT):
- **Bảng `users`**:
  - `id` (TEXT PRIMARY KEY) — Mã định danh tài khoản.
  - `email` (TEXT UNIQUE) — Email đăng nhập.
  - `password_hash` (TEXT) — Mật khẩu mã hóa bcrypt/Argon2.
  - `full_name` (TEXT) — Họ và tên người dùng.
  - `role` (TEXT) — `citizen` \| `community` \| `staff` \| `contractor` \| `executive` \| `admin`.
  - `department` (TEXT) — Cơ quan / Đơn vị công tác.
  - `phone_number` (TEXT) — Số điện thoại liên hệ.
  - `status` (TEXT) — `ACTIVE` \| `LOCKED` \| `PENDING`.
  - `created_at` (DATETIME).

---

## 6. Bảng Danh Mục Hành Động & Nút Bấm (CTAs & Action Matrix)

| Tên nút / Thao tác | Vị trí | Màu sắc / Token | Kích thước Touch Target | Điều kiện kích hoạt | Hành vi hệ thống | Phản hồi giao diện |
|---|---|---|:---:|---|---|---|
| **[ĐĂNG NHẬP]** | Cuối form xác thực | Nền đỏ son `#9f241f`, chữ trắng, viền sắc nét | $\ge 48\text{px}$ | `!loading` | Gửi request `POST /auth/login` | Hiển thị spinner, bật Toast xanh và chuyển hướng sau 400ms |
| **[ĐĂNG KÝ TÀI KHOẢN]** | Cuối form đăng ký (`/register`) | Nền đỏ son `#9f241f`, chữ trắng | $\ge 48\text{px}$ | `!loading` | Gửi request `POST /auth/register` | Đăng ký thành công, tự động đăng nhập và vào `/citizen` |
| **[Tiếp tục với Google]** | Đầu form xác thực | Nền trắng, viền xám `border-ink-900/15`, icon Google | $\ge 46\text{px}$ | `!googleLoading` | Khởi tạo luồng OAuth Google | Chuyển sang trang xác thực Google |
| **[✨ Trải nghiệm bản demo]** | Chân form xác thực | Nền kem `#FDFBF7`, bo tròn viên thuốc, viền mờ | $\ge 40\text{px}$ | Luôn khả dụng | Mở modal `DemoAccessModal` | Modal hiển thị 5 thẻ vai trò kèm nút đăng nhập 1-chạm |
| **[Đăng nhập ngay] (Modal)** | Từng thẻ vai trò trong Modal | Nền đỏ son `#9f241f`, icon mũi tên | $\ge 44\text{px}$ | Luôn khả dụng | Nạp token demo và gọi hàm `login()` | Tự động đóng modal, hiển thị Toast và vào thẳng phân hệ |
| **[Điền form] (Modal)** | Từng thẻ vai trò trong Modal | Nền trắng, viền xám nhạt | $\ge 44\text{px}$ | Luôn khả dụng | Tự động điền email vai trò vào input | Đóng modal, con trỏ focus vào ô mật khẩu |
| **[VI / EN]** | Header góc phải | Nút gạt chuyển ngôn ngữ | $\ge 38\text{px}$ | Luôn khả dụng | Thay đổi ngôn ngữ lưu tại `localStorage('dg-lang')` | Cập nhật toàn bộ UI Copy giữa Tiếng Việt và Tiếng Anh |

---

## 7. Quy Chuẩn Thích Ứng Giao Diện (Responsive & Design System)

### 7.1. Bảng màu & Design Tokens (High-Contrast Civic Tech)
- **Nền trang chính**: Màu kem sáng `#FDFBF7` (`bg-cream-50`).
- **Nền thẻ Đăng nhập**: Nền trắng nguyên khối `#ffffff`, bo góc lớn `rounded-3xl`, viền `border-ink-900/10`, bóng `shadow-card`.
- **Màu nút hành động chính**: Đỏ son `#9f241f` (Seal Red) — Thể hiện quyền lực thực thi công vụ và hành động dứt khoát.
- **Màu chữ**: Mực in đậm `#231b14` (`text-ink-900`), độ tương phản tối đa trên nền sáng.
- **Quy tắc bất biến**: **TUYỆT ĐỐI KHÔNG DÙNG GLASSMORPHISM**, không dùng nền mờ trong suốt `backdrop-blur-*`.

### 7.2. Tương thích Đa Viewport:
- **Mobile (< 1024px)**:
  - Tự động ẩn cột Brand Panel bên trái để tối ưu diện tích.
  - Thẻ đăng nhập căn giữa màn hình với lề an toàn `px-4 sm:px-8`.
  - Mọi nút bấm và trường nhập liệu có chiều cao chuẩn $\ge 48\text{px}$.
- **Laptop 14-inch (1366x768 & 1536x864)**:
  - Chia 2 cột hoàn hảo: Cột trái 50% (Brand Panel) và Cột phải 50% (Form đăng nhập).
  - Toàn bộ nội dung hiển thị vừa vặn trong 1 màn hình, **không xuất hiện thanh cuộn dọc không cần thiết**.
- **Desktop (1920x1080)**:
  - Container giới hạn trong `max-w-7xl` căn giữa sang trọng.

### 7.3. Tiêu chuẩn Tiếp cận (Accessibility & Screen Readers):
- Mọi trường nhập liệu đều có `label` gắn kết chuẩn mực qua `htmlFor` và `id`.
- Khung báo lỗi mang thuộc tính `role="alert"` và `aria-live="polite"`.
- Hỗ trợ phím **Escape** để đóng nhanh Modal Demo; tự động khóa cuộn trang nền (`document.body.style.overflow = 'hidden'`) khi modal đang mở.

---

## 8. Kịch Bản Ngoại Lệ & Xử Lý Lỗi Biên (Edge Cases & Fallbacks)

### 8.1. Các tình huống ngoại lệ và cách xử lý:
1. **Sai thông tin đăng nhập (Email hoặc Mật khẩu không đúng)**:
   - *Xử lý*: Hiển thị hộp thông báo lỗi màu đỏ son: *"Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại."* và giữ nguyên nội dung email để người dùng sửa.
2. **Tài khoản bị tạm khóa / Vô hiệu hóa**:
   - *Xử lý*: Trả về thông báo: *"Tài khoản của bạn đang bị tạm khóa. Vui lòng liên hệ quản trị viên."*.
3. **Mất kết nối mạng Internet khi bấm Đăng nhập**:
   - *Xử lý*: Bắt lỗi mạng và hiển thị: *"Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại đường truyền mạng."*.
4. **Token JWT hết hạn khi đang tác nghiệp**:
   - *Xử lý*: `request.js` tự động phát hiện mã `401 Unauthorized`, dọn dẹp token cũ và chuyển hướng người dùng về `/login?redirect=...` kèm thông báo phiên đăng nhập đã hết hạn.

### 8.2. Lệnh kiểm thử tự động (PowerShell CLI):
```powershell
# 1. Kiểm thử phân quyền RBAC và quản lý người dùng
node --test app/tests/auth-user-management-audit.test.js

# 2. Kiểm thử luồng xác thực kép Hybrid Clerk / Local Auth
node --test app/tests/clerk-frontend-hybrid-auth.test.js

# 3. Kiểm thử phân quyền và bảo mật tài khoản Cán bộ & Lãnh đạo
node --test app/tests/admin-executive-rbac-penetration.test.js
```
