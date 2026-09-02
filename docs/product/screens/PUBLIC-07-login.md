# PUB-07 — Cổng Đăng Nhập & Phân Quyền Vai Trò

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/login` (và alias `/register`)
- **Primary Role**: Toàn bộ người dùng cần xác thực (`all roles`)
- **Secondary Roles**: Khách đăng ký tài khoản mới
- **Current Component**: `Login.jsx` (`app/src/modules/auth/Login.jsx`)
- **Layout**: Public Minimal Auth Layout
- **Primary Job**: Xác thực danh tính người dùng bằng Email/Số điện thoại và mật khẩu, cấp phiên làm việc JWT và tự động điều hướng vào đúng không gian làm việc theo vai trò RBAC.
- **Success Condition**: Người dùng đăng nhập thành công trong vòng dưới 2 giây và được chuyển hướng chính xác đến Dashboard tương ứng của vai trò đó.

---

## 2. WHY THIS SCREEN EXISTS
- Cửa ngõ kiểm soát an ninh và phân quyền của hệ thống. Đảm bảo đúng người vào đúng phân hệ: người dân vào `/citizen`, cán bộ vào `/staff`, nhà thầu vào `/contractor`, quản trị viên vào `/admin`.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Nút "Đăng nhập" trên thanh Header, hoặc bị chuyển hướng tự động khi truy cập trang yêu cầu quyền.
- **Exit Points**:
  - Đăng nhập Citizen $\rightarrow$ Chuyển đến `/citizen`.
  - Đăng nhập Staff $\rightarrow$ Chuyển đến `/staff`.
  - Đăng nhập Contractor $\rightarrow$ Chuyển đến `/contractor`.
  - Đăng nhập Admin $\rightarrow$ Chuyển đến `/admin`.
  - Nút "Về trang chủ" $\rightarrow$ Mở `/`.
- **Navigation Item**: Nút "Đăng nhập" ở góc trên bên phải thanh Header.

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Mở trang đăng nhập** | ✅ | 🔄 *(Redirect)* | 🔄 *(Redirect)* | 🔄 *(Redirect)* | 🔄 *(Redirect)* |
| **Nhập thông tin xác thực** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Đăng ký tài khoản công dân mới** | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 5. PRIMARY USER FLOW
```text
Mở /login 
→ Nhập Email / Số điện thoại và Mật khẩu
→ Bấm nút "ĐĂNG NHẬP"
→ Hệ thống xác thực thông tin, kiểm tra vai trò người dùng trong D1
→ Lưu JWT Token an toàn vào Session Cookie/Storage
→ Tự động điều hướng sang Dashboard của vai trò đó (ví dụ: /staff)
```

---

## 6. INFORMATION HIERARCHY
1. **Brand Identity Header**: Logo DustGuard VN, Tên hệ thống, Khẩu hiệu bảo vệ môi trường.
2. **Auth Form Container (Khung Đăng Nhập Trung Tâm)**:
   - Ô nhập Email / Số điện thoại (có validation định dạng).
   - Ô nhập Mật khẩu (có nút ẩn/hiện mật khẩu 👁️).
   - Checkbox "Ghi nhớ đăng nhập trên thiết bị này".
   - Nút lớn "ĐĂNG NHẬP" màu đỏ son `#9F241F` ($\ge 44\text{px}$).
   - Liên kết "Quên mật khẩu?" và "Đăng ký tài khoản mới".
3. **Quick Demo Logins Bar (Chỉ dẫn Đăng nhập nhanh)**:
   - Các nút đăng nhập nhanh mẫu cho Cán bộ, Nhà thầu, Công dân phục vụ đánh giá.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Đăng Nhập DustGuard` (≤ 3 từ)
- **Primary CTA**: `ĐĂNG NHẬP` (≤ 2 từ)
- **Error Messages**: Thông báo thân thiện (ví dụ: *Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.*), không hiện lỗi hệ thống kỹ thuật.

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Field | Target API | Fallback |
|---|:---:|---|---|---|
| Email / SĐT | Yes | Form input | `POST /api/auth/login` | — |
| Mật khẩu | Yes | Form input | `POST /api/auth/login` | — |

- **Current Implementation**: `POST /api/auth/login`, `POST /api/auth/register`

---

## 9. ACCEPTANCE CRITERIA
- [ ] Đăng nhập thành công chuyển hướng đúng 100% theo vai trò được cấp trong DB.
- [ ] Hiển thị thông báo lỗi rõ ràng khi nhập sai mật khẩu hoặc tài khoản bị khóa.
- [ ] Bàn phím ảo trên điện thoại tự động mở đúng kiểu bàn phím email/số.

---

## 10. IMPLEMENTATION STATUS
- **CURRENT**: Giao diện đăng nhập, đăng ký, xác thực JWT, phân quyền điều hướng 5 vai trò.
- **PARTIAL**: Chức năng khôi phục mật khẩu qua Email OTP.
- **PROPOSED**: Tích hợp đăng nhập qua tài khoản Định danh điện tử Quốc gia VNeID.
