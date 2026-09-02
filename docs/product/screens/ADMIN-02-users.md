# ADM-02 — Quản Lý Danh Bạ Tài Khoản & Phân Quyền 5 Cấp

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/admin/users`
- **Primary Role**: Quản trị viên hệ thống (`admin`)
- **Secondary Roles**: Không có
- **Current Component**: `UsersPage.jsx` (`app/src/apps/admin/pages/users/UsersPage.jsx`)
- **Layout**: `AdminLayout.jsx`
- **Primary Job**: Quản lý danh sách người dùng, kích hoạt/khóa tài khoản và gán phân quyền theo 5 vai trò chuẩn RBAC.
- **Success Condition**: Admin gán hoặc thay đổi vai trò của người dùng (ví dụ từ `citizen` lên `staff`) trong vòng 5 giây và có hiệu lực tức thì.

---

## 2. WHY THIS SCREEN EXISTS
- Hệ thống DustGuard phục vụ 5 nhóm đối tượng có thẩm quyền và trách nhiệm khác nhau (`public`, `citizen`, `community`, `staff`, `contractor`, `admin`). Màn hình này kiểm soát quyền truy cập chặt chẽ, bảo vệ dữ liệu nghiệp vụ thanh tra.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Sidebar mục "Tài khoản", click từ Dashboard admin (`/admin`).
- **Exit Points**:
  - Click vào người dùng $\rightarrow$ Mở Drawer chỉnh sửa thông tin & phân quyền.
- **Navigation Item**: Sidebar item "Tài khoản & Phân quyền" (icon Users/Shield).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem danh sách người dùng** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Phân quyền vai trò (Role RBAC)** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Khóa / Mở khóa tài khoản** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Tạo mới tài khoản cán bộ** | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Truy cập /admin/users 
→ Tìm kiếm người dùng theo Email, Họ tên hoặc Số điện thoại
→ Lọc theo Vai trò (`citizen`, `staff`, `contractor`, `admin`)
→ Click vào dòng người dùng cần phân quyền
→ Chọn vai trò mới trong dropdown: ví dụ chuyển sang `staff`
→ Bấm "Lưu phân quyền" → Hệ thống cập nhật bảng `users.role` trong D1
```

---

## 6. INFORMATION HIERARCHY
1. **Header Block**: Tiêu đề "Quản Lý Danh Bạ & Phân Quyền 5 Cấp", tổng số tài khoản, nút "Thêm tài khoản mới".
2. **Filter & Search Toolbar**: Ô tìm kiếm nhanh, dropdown lọc Vai trò, dropdown lọc Trạng thái (`ACTIVE` / `INACTIVE`).
3. **Users Table**:
   - Họ và tên & Avatar
   - Email đăng nhập
   - Số điện thoại liên hệ
   - Vai trò hiện tại (Badge có màu định danh: Đỏ cho Admin, Xanh dương cho Staff, Cam cho Contractor, Xanh lá cho Citizen)
   - Trạng thái hoạt động (Hoạt động / Bị khóa)
   - Ngày đăng ký
   - Thao tác: Sửa quyền / Đổi mật khẩu / Khóa tài khoản
4. **User Edit Drawer**: Khung chỉnh sửa phân quyền mở bên phải màn hình.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Danh Bạ & Phân Quyền` (≤ 4 từ)
- **Primary CTA**: `Thêm người dùng` (≤ 3 từ)
- **5 Roles RBAC**: `Công dân (citizen) | Tình nguyện viên (community) | Cán bộ (staff) | Nhà thầu (contractor) | Quản trị viên (admin)`

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Danh sách người dùng | Yes | `users` + `profiles` | `users.email, users.role, profiles.fullName` | `[]` |
| Vai trò người dùng | Yes | `users` table | `users.role` | `citizen` |
| Trạng thái tài khoản | Yes | `users` table | `users.status` | `ACTIVE` |

- **Current Implementation**: `GET /api/admin/users`, `PATCH /api/admin/users/:id/role`

---

## 9. ACCEPTANCE CRITERIA
- [ ] Tìm kiếm người dùng phản hồi tức thì theo họ tên hoặc email.
- [ ] Đổi vai trò cập nhật thành công và người dùng nhận đúng quyền trong phiên đăng nhập tiếp theo.
- [ ] Không cho phép tự hạ quyền của chính tài khoản admin đang đăng nhập.

---

## 10. IMPLEMENTATION STATUS
- **CURRENT**: Danh sách tài khoản, tìm kiếm, lọc theo vai trò, gán vai trò RBAC, khóa tài khoản.
- **PARTIAL**: Tạo nhanh tài khoản cán bộ kèm mật khẩu tạm thời.
- **PROPOSED**: Tích hợp xác thực đăng nhập một lần SSO (VNeID / Google Workspace).
