# SCREEN-PERMISSION-MATRIX — MA TRẬN PHÂN QUYỀN 31 MÀN HÌNH

> **Cập nhật**: 2026-09-02 | **Quy chuẩn Auth**: Role-Based Access Control (RBAC) 5 cấp | **SSOT**: `AUTH.md` & `app/server/auth.js`

---

## 1. ĐỊNH NGHĨA 5 VAI TRÒ CHUẨN

1. **Public (`public`)**: Người dùng vãng lai chưa đăng nhập, khách tham quan, báo chí.
2. **Citizen (`citizen`)**: Người dân, thanh niên tình nguyện đã đăng nhập tài khoản công dân.
3. **Staff (`staff`)**: Cán bộ trật tự xây dựng, thanh tra viên môi trường, chuyên viên quản lý đô thị.
4. **Contractor (`contractor`)**: Chỉ huy trưởng công trường, cán bộ phụ trách an toàn lao động & môi trường của nhà thầu.
5. **Admin (`admin` / `executive`)**: Quản trị viên hệ thống kỹ thuật, lãnh đạo điều hành cấp cao.

---

## 2. MA TRẬN TRUY CẬP 31 MÀN HÌNH

| Screen ID | Tên Màn Hình | Route | Public | Citizen | Staff | Contractor | Admin |
|---|---|---|:---:|:---:|:---:|:---:|:---:|
| **PUB-01** | Cổng Thông Tin Giám Sát Bụi | `/` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **PUB-02** | Bản Đồ Điểm Nóng Bụi | `/map` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **PUB-03** | Cổng Tín Chỉ Tình Nguyện | `/youth` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **PUB-04** | Cẩm Nang Trạm Đo 500k | `/guide` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **PUB-05** | Trung Tâm Trải Nghiệm 5 Vai Trò | `/demo` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **PUB-06** | Bàn Mô Phỏng Tín Hiệu IoT | `/demo/iot` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **PUB-07** | Đăng Nhập & Phân Quyền | `/login` | ✅ | 🔄 *(Redirect)* | 🔄 *(Redirect)* | 🔄 *(Redirect)* | 🔄 *(Redirect)* |
| **PUB-08** | Trang Khôi Phục Điều Hướng | `*` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **CIT-01** | Bàn Làm Việc Công Dân | `/citizen` | ❌ *(Redirect login)* | ✅ | ✅ *(View-only)* | ❌ | ✅ |
| **CIT-02** | Gửi Phản Ánh Hiện Trường | `/citizen/report/new` | ❌ *(Redirect login)* | ✅ | ✅ | ❌ | ✅ |
| **CIT-03** | Sổ Tay Phản Ánh | `/citizen/reports` | ❌ *(Redirect login)* | ✅ | ✅ *(View-only)* | ❌ | ✅ |
| **CIT-04** | Chi Tiết Phản Ánh | `/citizen/reports/:id` | ❌ *(Redirect login)* | ✅ *(Owner)* | ✅ | ❌ | ✅ |
| **CIT-05** | Hồ Sơ Cá Nhân | `/citizen/profile` | ❌ *(Redirect login)* | ✅ *(Self)* | ✅ *(Self)* | ✅ *(Self)* | ✅ *(Self)* |
| **STF-01** | Bàn Điều Hành Ca Trực | `/staff` | ❌ | ❌ | ✅ | ❌ | ✅ |
| **STF-02** | Sổ Bộ Công Trình | `/staff/sites` | ❌ | ❌ | ✅ | ❌ | ✅ |
| **STF-03** | Hồ Sơ Công Trình | `/staff/sites/:id` | ❌ | ❌ | ✅ | ❌ | ✅ |
| **STF-04** | Danh Mục Vụ Việc | `/staff/cases` | ❌ | ❌ | ✅ | ❌ | ✅ |
| **STF-05** | Không Gian Thụ Lý Vụ Việc | `/staff/cases/:id` | ❌ | ❌ | ✅ | ❌ | ✅ |
| **STF-06** | Lịch Công Tác & Giao Việc | `/staff/tasks` | ❌ | ❌ | ✅ | ❌ | ✅ |
| **STF-07** | Quan Trắc Cảm Biến 24/7 | `/staff/monitoring` | ❌ | ❌ | ✅ | ❌ | ✅ |
| **STF-08** | Cảnh Báo Ô Nhiễm | `/staff/alerts` | ❌ | ❌ | ✅ | ❌ | ✅ |
| **STF-09** | Báo Cáo Hành Chính | `/staff/reports` | ❌ | ❌ | ✅ | ❌ | ✅ |
| **STF-10** | Hồ Sơ Cán Bộ | `/staff/profile` | ❌ | ❌ | ✅ *(Self)* | ❌ | ✅ |
| **STF-11** | Nhật Ký Tác Nghiệp | `/staff/activity` | ❌ | ❌ | ✅ | ❌ | ✅ |
| **CON-01** | Bàn Làm Việc Chỉ Huy Trưởng | `/contractor` | ❌ | ❌ | ❌ | ✅ | ✅ |
| **CON-02** | Khắc Phục & Nộp Minh Chứng | `/contractor/tasks` | ❌ | ❌ | ❌ | ✅ | ✅ |
| **CON-03** | Hồ Sơ Vụ Việc Nhà Thầu | `/contractor/cases` | ❌ | ❌ | ❌ | ✅ | ✅ |
| **CON-04** | Báo Cáo Tuân Thủ Môi Trường | `/contractor/reports` | ❌ | ❌ | ❌ | ✅ | ✅ |
| **ADM-01** | Bảng Điều Hành Quản Trị | `/admin` | ❌ | ❌ | ❌ | ❌ | ✅ |
| **ADM-02** | Quản Lý Danh Bạ Tài Khoản | `/admin/users` | ❌ | ❌ | ❌ | ❌ | ✅ |
| **ADM-03** | Cấu Hình Hệ Thống | `/admin/settings` | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 3. MA TRẬN THAO TÁC NGHIỆP VỤ CỐT LÕI (ACTION PERMISSIONS)

| Nghiệp Vụ Cốt Lõi | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Tạo phản ánh mới** | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Chỉnh sửa / Thu hồi phản ánh của mình** | ❌ | ✅ *(Khi ở trạng thái PENDING)* | ❌ | ❌ | ✅ |
| **Tiếp nhận & Chuyển bước vụ việc (DAG 7 bước)** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Giao nhiệm vụ khảo sát / kiểm tra** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Nộp ảnh đối chứng khắc phục & Giải trình** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Nghiệm thu bằng chứng khắc phục (Approve)** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Tạo / Ký duyệt văn bản hành chính NĐ 30** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Quản lý danh mục công trình & trạm đo** | ❌ | ❌ | ✅ *(Chỉnh sửa cơ bản)* | ❌ | ✅ *(Toàn quyền)* |
| **Phân quyền vai trò người dùng (RBAC)** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Cấu hình ngưỡng QCVN & tham số hệ thống** | ❌ | ❌ | ❌ | ❌ | ✅ |
