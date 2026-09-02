# CIT-05 — Hồ Sơ Công Dân Tích Cực & Đóng Góp

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/citizen/profile`
- **Primary Role**: Chủ tài khoản công dân (`citizen`)
- **Secondary Roles**: Tình nguyện viên Đoàn - Hội (`community`)
- **Current Component**: `CitizenProfilePage.jsx` (`app/src/apps/citizen/pages/profile/CitizenProfilePage.jsx`)
- **Layout**: `CitizenLayout.jsx`
- **Primary Job**: Quản lý thông tin tài khoản cá nhân, theo dõi tích lũy số giờ tình nguyện và nhận huy hiệu đóng góp bảo vệ môi trường đô thị.
- **Success Condition**: Người dân cập nhật được thông tin cá nhân và xem được tổng số phản ánh hữu ích cùng huy hiệu khen thưởng đã đạt được.

---

## 2. WHY THIS SCREEN EXISTS
- Khuyến khích sự tham gia lâu dài của người dân và thanh niên thông qua cơ chế ghi nhận đóng góp minh bạch (Civic Gamification): mỗi phản ánh đúng và hỗ trợ xử lý thành công đều được tích lũy điểm thưởng và vinh danh danh hiệu công dân số tiêu biểu.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Tab "Cá nhân" trên Bottom Nav, click vào avatar tại Trang chủ (`/citizen`).
- **Exit Points**:
  - Nút "Đăng xuất" $\rightarrow$ Xóa phiên làm việc và về `/login`.
  - Nút "Xem bảng xếp hạng" $\rightarrow$ Chuyển sang Cổng thanh niên (`/youth`).
- **Navigation Item**: Bottom Nav / Sidebar item "Hồ sơ" (icon User).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem hồ sơ cá nhân của mình** | ❌ | ✅ *(Self)* | ✅ *(Self)* | ✅ *(Self)* | ✅ *(Self)* |
| **Cập nhật họ tên / SĐT / Địa chỉ**| ❌ | ✅ *(Self)* | ✅ *(Self)* | ✅ *(Self)* | ✅ *(Self)* |
| **Đăng xuất tài khoản** | ❌ | ✅ | ✅ | ✅ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Mở /citizen/profile 
→ Xem thẻ thông tin: Avatar, Họ tên, Danh hiệu công dân (ví dụ: "Công dân Xanh Cấp 2")
→ Xem thống kê: Số phản ánh đã gửi | Số điểm nóng đã giúp khắc phục | Tổng giờ tình nguyện
→ Xem bộ sưu tập huy hiệu đóng góp
→ Chỉnh sửa thông tin cá nhân hoặc Đăng xuất
```

---

## 6. INFORMATION HIERARCHY
1. **User Identity Card**: Avatar, Họ tên, Số điện thoại, Địa bàn cư trú (Phường/Quận).
2. **Impact Metrics Summary (3 Thẻ Đóng Góp)**:
   - `Số phản ánh đã gửi` (ví dụ: 8)
   - `Đã xử lý thành công` (ví dụ: 7)
   - `Điểm đóng góp cộng đồng` (ví dụ: 350 điểm)
3. **Badges & Recognition Grid**: Các huy hiệu đã mở khóa:
   - 🏅 *Mắt Thần Đô Thị* (Gửi phản ánh chính xác đầu tiên)
   - 🌟 *Công Dân Xanh* (Đóng góp >5 phản ánh được nghiệm thu)
   - 🛡️ *Chiến Binh Môi Trường* (Tình nguyện viên tích cực)
4. **Account Settings & Logout**: Đổi mật khẩu, cài đặt thông báo, nút Đăng xuất.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Hồ Sơ Cá Nhân` (≤ 4 từ)
- **Primary CTA**: `Cập nhật thông tin` (≤ 3 từ)
- **Tone**: Tích cực, ghi nhận sự đóng góp vì cộng đồng.

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Họ tên | Yes | `profiles` table | `profiles.fullName` | `Công dân DustGuard` |
| Số điện thoại | Yes | `profiles` table | `profiles.phoneNumber` | `—` |
| Danh hiệu / Huy hiệu | No | `community_members` | `badge_title` | `Thành viên mới` |

- **Current Implementation**: `GET /api/community/profile`, `PUT /api/community/profile`

---

## 9. ACCEPTANCE CRITERIA
- [ ] Hiển thị chính xác thông tin và số liệu phản ánh của tài khoản đang đăng nhập.
- [ ] Chỉnh sửa thông tin cá nhân cập nhật ngay lập tức vào D1 SQLite.
- [ ] Đăng xuất hoạt động an toàn và xóa sạch session client.

---

## 10. IMPLEMENTATION STATUS
- **CURRENT**: Xem thông tin cá nhân, cập nhật liên hệ, danh hiệu công dân, đăng xuất.
- **PARTIAL**: Bộ sưu tập huy hiệu tương tác trực quan.
- **PROPOSED**: Xuất Giấy chứng nhận Tình nguyện viên Xanh có mã QR xác thực.
