# STF-10 — Hồ Sơ Cán Bộ & Ca Trực

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/staff/profile`
- **Primary Role**: Cán bộ cá nhân (`staff`)
- **Secondary Roles**: Quản trị viên (`admin`)
- **Current Component**: `StaffProfilePage.jsx` (`app/src/apps/staff/pages/profile/StaffProfilePage.jsx`)
- **Layout**: `StaffLayout.jsx`
- **Primary Job**: Quản lý thông tin công tác cá nhân, xem lịch phân công ca trực và cấu hình nhận thông báo nghiệp vụ.
- **Success Condition**: Cán bộ cập nhật được thông tin liên lạc và nắm rõ lịch trực ca của mình trong tuần.

---

## 2. WHY THIS SCREEN EXISTS
- Mỗi cán bộ công tác cần quản lý tài khoản công vụ, số điện thoại liên lạc trực ban, phòng ban trực thuộc và các ca trực được phân công để nhận đúng các cảnh báo khẩn cấp tại địa bàn phụ trách.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Click vào Avatar/Tên cán bộ ở góc trên bên phải thanh Header hoặc mục "Hồ sơ" trên Sidebar.
- **Exit Points**:
  - Nút "Đăng xuất" $\rightarrow$ Xóa phiên làm việc và chuyển về `/login`.
  - Nút "Về bàn điều hành" $\rightarrow$ Chuyển về `/staff`.
- **Navigation Item**: Dropdown user menu / Sidebar item "Hồ sơ cán bộ".

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem hồ sơ cá nhân của mình** | ❌ | ❌ | ✅ *(Self)* | ❌ | ✅ |
| **Cập nhật số điện thoại / Email**| ❌ | ❌ | ✅ *(Self)* | ❌ | ✅ |
| **Đổi mật khẩu tài khoản** | ❌ | ❌ | ✅ *(Self)* | ❌ | ✅ |
| **Đổi phòng ban / Vai trò RBAC** | ❌ | ❌ | ❌ | ❌ | ✅ *(Chỉ Admin)* |

---

## 5. PRIMARY USER FLOW
```text
Truy cập /staff/profile 
→ Xem thông tin chức danh, phòng ban và địa bàn phụ trách
→ Chỉnh sửa số điện thoại trực ban hoặc cập nhật ảnh đại diện
→ Xem bảng lịch trực ca trong tuần
→ Bấm "Lưu thay đổi" → Nhận thông báo cập nhật thành công
```

---

## 6. INFORMATION HIERARCHY
1. **Officer Info Card**: Avatar, Họ tên cán bộ, Mã số công chức, Chức vụ, Phòng ban/Đội quản lý.
2. **Contact & Duty Settings**:
   - Ô nhập Số điện thoại trực ban, Email công vụ.
   - Địa bàn phụ trách mặc định (Quận/Huyện, Phường/Xã).
3. **Weekly Shift Schedule**: Lịch phân công ca trực tuần này (Sáng / Chiều / Tối).
4. **Security & Session Block**: Đổi mật khẩu, xem danh sách thiết bị đang đăng nhập, nút Đăng xuất.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Hồ Sơ Cán Bộ` (≤ 4 từ)
- **Primary CTA**: `Lưu thay đổi` (≤ 3 từ)
- **Zero Jargon**: Sử dụng đúng thuật ngữ công vụ hành chính nhà nước.

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Họ tên cán bộ | Yes | `profiles` table | `profiles.fullName` | `—` |
| Phòng ban / Đơn vị | Yes | `profiles` table | `profiles.department` | `Đội TTXD` |
| Số điện thoại | Yes | `profiles` table | `profiles.phoneNumber` | `—` |
| Vai trò | Yes | `users` table | `users.role` | `staff` |

- **Current Implementation**: `GET /api/staff/profile`, `PUT /api/staff/profile`

---

## 9. ACCEPTANCE CRITERIA
- [ ] Tải đúng thông tin cá nhân của phiên đăng nhập hiện tại.
- [ ] Cập nhật số điện thoại thành công và lưu ngay vào bảng `profiles` trong D1.
- [ ] Đăng xuất xóa sạch JWT token và chuyển hướng an toàn về `/login`.

---

## 10. IMPLEMENTATION STATUS
- **CURRENT**: Xem thông tin cá nhân, cập nhật liên hệ, đổi mật khẩu, đăng xuất.
- **PARTIAL**: Xem bảng phân công ca trực cá nhân trong tuần.
- **PROPOSED**: Tích hợp thông báo qua Telegram/Zalo cho số điện thoại trực ban.
