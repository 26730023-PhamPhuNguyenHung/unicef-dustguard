# ADMIN-02 — Quản Lý Tài Khoản & Phân Quyền Người Dùng

> **Mã màn hình**: `ADMIN-02` (Viết tắt: `ADM-02`)  
> **Tên tiếng Việt**: Quản Lý Danh Sách Tài Khoản & Phân Quyền Người Dùng  
> **Tên tiếng Anh**: User Directory & Access Control Management  
> **Quy chuẩn & Pháp lý liên quan**: [`Nghị định 45/2022/NĐ-CP`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/ND-45-2022-ND-CP.md), Quy định an toàn thông tin & Quản trị tài khoản công vụ

---

## 1. Thông Tin Nhận Diện Màn Hình (Screen Identity)

| Thuộc tính | Chi tiết nhận diện thực tế |
|---|---|
| **Mã màn hình** | `ADMIN-02` (Tên tệp: `ADMIN-02-users.md`) |
| **Tên tiếng Việt** | Quản Lý Danh Sách Tài Khoản & Phân Quyền Người Dùng |
| **Tên tiếng Anh** | User Directory & Access Control Management |
| **Đường dẫn truy cập (Route)** | `/admin/users` |
| **Tệp giao diện chính** | [`app/src/apps/admin/pages/users/UsersPage.jsx`](file:///D:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/admin/pages/users/UsersPage.jsx) |
| **Khung bố cục (Layout)** | [`app/src/apps/admin/layout/AdminLayout.jsx`](file:///D:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/admin/layout/AdminLayout.jsx) (Khung quản trị hệ thống sáng rõ, bảng danh sách không cắt chữ) |
| **Ai được sử dụng?** | Quản trị viên hệ thống (Chuyên viên quản trị IOC, Cán bộ quản lý nhân sự & tài khoản Sở TT&TT/Sở TN&MT) |
| **Trạng thái vận hành** | Đang hoạt động ổn định — Đổi quyền trực tiếp có hiệu lực ngay |

**Tóm tắt mục đích sử dụng**: Màn hình là danh bạ quản lý toàn bộ tài khoản người dùng trong hệ sinh thái DustGuard VN. Màn hình phân loại rõ ràng 5 nhóm người dùng: Người dân, Tình nguyện viên thanh niên, Cán bộ thanh tra, Nhà thầu xây dựng và Lãnh đạo điều hành. Quản trị viên có thể tìm kiếm nhanh theo tên, số điện thoại hoặc đơn vị công tác, và đổi quyền của người dùng ngay trên từng dòng bằng một thao tác chọn đơn giản (ví dụ: chuyển một tài khoản từ người dân sang cán bộ thanh tra hoặc chỉ huy trưởng nhà thầu). Mọi thao tác đổi quyền đều được lưu lại lịch sử rõ ràng để đảm bảo an toàn và minh bạch công vụ.

---

## 2. Mục Đích & Giá Trị Thực Tế

### 2.1. Giải quyết bài toán phân quyền tại đô thị Việt Nam
1. **Phân chia rành mạch 5 nhóm vai trò thực tế**:
   - **Người dân (Công dân)**: Gửi phản ánh bụi nhanh trong 30 giây kèm ảnh và vị trí, theo dõi tiến độ xử lý của cơ quan chức năng.
   - **Thanh niên tình nguyện (CLB/Đoàn trường)**: Tham gia khảo sát thực địa, đo bụi vi khí hậu, tích lũy giờ tình nguyện đổi tín chỉ môi trường thanh niên (20 giờ = 4.0 tín chỉ).
   - **Cán bộ thanh tra (Đội QLTTĐT / Thanh tra Sở)**: Đi kiểm tra hiện trường, lập biên bản vi phạm, đôn đốc và duyệt ảnh nghiệm thu dập bụi của nhà thầu.
   - **Nhà thầu xây dựng (Chỉ huy trưởng / Kỹ sư HSE)**: Nhận cảnh báo bụi, cho công nhân tưới nước dập bụi/che bạt, chụp ảnh Sau nộp nghiệm thu để không bị phạt.
   - **Lãnh đạo & Quản trị viên (Chủ tịch Quận / Giám đốc Sở / Admin IOC)**: Ký duyệt văn bản chỉ đạo, xử phạt hành chính và quản trị toàn bộ hệ thống.
2. **Đổi quyền trực tiếp ngay trên bảng — Không cần sửa cơ sở dữ liệu**:
   - Khi có cán bộ mới chuyển về đội thanh tra hoặc nhà thầu mới trúng thầu dự án, Quản trị viên chỉ cần mở bảng, tìm tên người đó và chọn vai trò mới từ danh sách thả xuống. Quyền mới có hiệu lực ngay lập tức.
3. **Chống tự ý nâng quyền trái phép**:
   - Chỉ có tài khoản Quản trị viên chính thức mới nhìn thấy và bấm được chức năng đổi quyền. Người dùng thông thường không thể tự can thiệp hay nâng quyền cho mình.
4. **Lưu lại nhật ký ai đổi quyền của ai**:
   - Mọi lần đổi vai trò đều được hệ thống tự động ghi lại: *Quản trị viên An đã chuyển tài khoản của anh Hùng từ Công dân sang Nhà thầu lúc 10:15 ngày 02/09*. Điều này giúp phục vụ công tác kiểm tra công vụ khi cần.

### 2.2. So sánh cách làm cũ và cách làm mới

| Tiêu chí | Cấp quyền thủ công trước đây | Dùng màn hình Quản lý tài khoản ADM-02 |
|---|---|---|
| **Thời gian cấp quyền** | Mất vài ngày gửi công văn xin cấp tài khoản | **Dưới 10 giây** chọn vai trò mới ngay trên màn hình |
| **Độ chính xác vai trò** | Dễ nhầm lẫn quyền giữa cán bộ và nhà thầu | Phân nhóm 5 vai trò rõ ràng kèm màu sắc nhận diện |
| **Tìm kiếm tài khoản** | Tìm trong file Excel hoặc danh sách giấy | Tìm kiếm tức thì theo Tên, Email hoặc Số điện thoại |
| **Lưu vết minh bạch** | Không rõ ai đã cấp tài khoản này từ lúc nào | Lưu rõ tên người cấp, ngày giờ và lý do thay đổi |

---

## 3. Ai Sử Dụng & Luồng Thao Tác Thực Tế

### 3.1. Các vị trí thực tế
1. **Quản trị viên Trung tâm Điều hành IOC / Sở TT&TT**:
   - Nhận danh sách cán bộ mới hoặc danh sách chỉ huy trưởng nhà thầu để cấp quyền truy cập hệ thống.
2. **Cán bộ Tổ chức & Phân quyền Sở TN&MT**:
   - Rà soát danh sách cán bộ thanh tra trên địa bàn các quận/huyện, tạm khóa tài khoản của cán bộ đã chuyển công tác khác.

### 3.2. Sơ đồ quy trình phân quyền tài khoản

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [QUẢN TRỊ VIÊN VÀO MỤC "QUẢN LÝ TÀI KHOẢN" (/admin/users)]            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [DANH BẠ TÀI KHOẢN TOÀN HỆ THỐNG]                                      │
│ • Xem tổng số người dùng theo nhóm: [Tất cả] [Cán bộ] [Nhà thầu]...    │
│ • Gõ tên hoặc số điện thoại vào ô Tìm kiếm (Ví dụ: "Nguyễn Văn Hùng")  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [CHỌN VAI TRÒ MỚI TẠI DÒNG TÀI KHOẢN ĐÓ]                               │
│ Bấm vào ô Vai trò -> Chọn: [ 🏗️ Nhà thầu xây dựng ]                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [HỆ THỐNG CẬP NHẬT NGAY LẬP TỨC]                                       │
│ • Đổi màu huy hiệu vai trò sang màu cam Nhà thầu                       │
│ • Hiện thông báo xanh: "Đã cập nhật vai trò thành công!"               │
│ • Tự động lưu nhật ký kiểm toán hệ thống                               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Bố Cục Giao Diện & Hình Ảnh Minh Họa

### 4.1. Cách sắp xếp thông tin trên màn hình
1. **Thanh tìm kiếm và Bộ lọc vai trò**:
   - Ô tìm kiếm nhanh: Tìm theo Tên, Email, Số điện thoại hoặc Cơ quan.
   - Nút lọc vai trò: `[Tất cả (124)]`, `[Công dân (65)]`, `[Thanh niên (30)]`, `[Cán bộ (14)]`, `[Nhà thầu (12)]`, `[Quản trị (3)]`.
2. **Bảng danh sách tài khoản**:
   - Cột 1: **Họ và Tên** (Chữ to đậm, không bị cắt bớt tên).
   - Cột 2: **Email / Số điện thoại** (Dễ nhìn để liên hệ).
   - Cột 3: **Cơ quan / Đơn vị công tác** (Ví dụ: *Đội QLTTĐT Thanh Xuân*, *Vinaconex*).
   - Cột 4: **Vai trò hiện tại** (Menu chọn nhanh để đổi quyền).
   - Cột 5: **Trạng thái** (Đang hoạt động / Tạm khóa).
   - Cột 6: **Hành động** (Xem chi tiết / Tạm khóa tài khoản).

### 4.2. Giao diện xem trên máy tính (Desktop)

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ DUSTGUARD VN  |  [ QUẢN TRỊ HỆ THỐNG ]   Cán bộ trực: Nguyễn Văn An (IOC)                 [ 🚪 Đăng xuất ]             │
├────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────┤
│ BÀN LÀM VIỆC QUẢN TRỊ  │ QUẢN LÝ DANH SÁCH TÀI KHOẢN & PHÂN QUYỀN                                                      │
│ [ ] Tổng quan hệ thống │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│ [●] Quản lý tài khoản  │ │ [🔍 Tìm theo tên, email, số điện thoại...]   Lọc vai trò: [ Tất cả (124) ▼ ]              │ │
│ [ ] Cấu hình tham số   │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
│ ────────────────────── │                                                                                               │
│ DANH SÁCH NHÓM QUYỀN   │ BẢNG DANH BẠ TÀI KHOẢN:                                                                       │
│ 👤 Công dân (65)       │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│ 🌿 Thanh niên (30)     │ │ HỌ VÀ TÊN        │ EMAIL / SỐ ĐIỆN THOẠI │ ĐƠN VỊ CÔNG TÁC     │ VAI TRÒ TÁC NGHIỆP  │ TRẠNG THÁI│ │
│ 🛡️ Cán bộ kiểm tra (14)│ ├────────────────┼───────────────────────┼─────────────────────┼─────────────────────┼───────────┤ │
│ 🏗️ Nhà thầu (12)       │ │ Nguyễn Văn Hùng  │ hungnv@vinaconex.vn   │ Vinaconex (Gói XL01)│ [ 🏗️ Nhà thầu    ▼ ]│ ● Hoạt động│ │
│ 👑 Quản trị viên (3)   │ │ Trần Anh Tuấn    │ tuanta@coteccons.vn   │ Coteccons (Zone B)  │ [ 🏗️ Nhà thầu    ▼ ]│ ● Hoạt động│ │
│                        │ │ Nguyễn Thành Long│ longnt@thanhxuan.gov  │ Đội QLTTĐT Quận TX  │ [ 🛡️ Cán bộ      ▼ ]│ ● Hoạt động│ │
│                        │ │ Lê Hoàng Nam     │ namlh@sotnmt.gov.vn   │ Chi cục BVMT Hà Nội │ [ 🛡️ Cán bộ      ▼ ]│ ● Hoạt động│ │
│                        │ │ Trần Thị Mai     │ maitran@gmail.com     │ CLB Tình nguyện Xanh│ [ 🌿 Thanh niên  ▼ ]│ ● Hoạt động│ │
│                        │ │ Phạm Minh Đức    │ ducpm@gmail.com       │ Phường Thanh Xuân B.│ [ 👤 Công dân    ▼ ]│ ● Hoạt động│ │
│                        │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & Kết Nối Hệ Thống

### 5.1. Các đường dẫn lấy và sửa dữ liệu (API Endpoints)
- `GET /api/users`: Lấy danh sách toàn bộ người dùng trong hệ thống.
- `PATCH /api/users/:id/role`: Cập nhật vai trò mới cho một tài khoản cụ thể.
- `PATCH /api/users/:id/status`: Khóa hoặc mở lại tài khoản người dùng.

### 5.2. Mẫu dữ liệu gửi đi khi đổi quyền người dùng

```json
{
  "userId": "usr_hung_vinaconex",
  "newRole": "contractor",
  "reason": "Chỉ định làm Chỉ huy trưởng Gói thầu XL-01 Dự án Thanh Xuân Garden",
  "updatedBy": "admin_ioc_01"
}
```

---

## 6. Danh Sách Nút Bấm & Thao Tác (Action Buttons)

| Tên nút bấm | Nằm ở đâu | Màu sắc & Kiểu nút | Kích thước | Bấm vào sẽ làm gì? | Khi nào bấm được? |
|---|---|---|---|---|---|
| **[Menu chọn vai trò ▼]** | Cột "Vai trò tác nghiệp" | Khung chọn có viền rõ | Cao $44\text{px}$ | Mở danh sách 5 vai trò để đổi quyền cho người dùng | Khi có quyền Quản trị viên |
| **[Lọc vai trò ▼]** | Đầu trang | Nút chọn lọc màu xám | Cao $44\text{px}$ | Lọc danh sách theo nhóm quyền cần xem | Luôn bấm được |
| **[🔒 Tạm khóa]** | Cột hành động bên phải | Chữ đỏ có biểu tượng ổ khóa | Dễ bấm | Tạm ngừng hoạt động của tài khoản nghi vấn | Khi tài khoản đang hoạt động |
| **[Mở khóa]** | Cột hành động bên phải | Chữ xanh có biểu tượng mở | Dễ bấm | Kích hoạt lại tài khoản sau khi đã xác minh | Khi tài khoản đang bị khóa |

---

## 7. Quy Chuẩn Giao Diện Quản Trị

### 7.1. Bảng màu tương phản cao — Không che giấu thông tin
- **Tên người dùng & Email**: Hiển thị đầy đủ chữ đậm, tuyệt đối không dùng hiệu ứng cắt bớt chữ (`truncate`) làm mất tên người dùng.
- **Màu sắc phân biệt vai trò**:
  - Quản trị viên: Huy hiệu đỏ son.
  - Cán bộ thanh tra: Huy hiệu xanh Teal đậm.
  - Nhà thầu: Huy hiệu cam hổ phách.
  - Thanh niên tình nguyện: Huy hiệu xanh lục.
  - Công dân: Huy hiệu xám than.

### 7.2. Thao tác an toàn — Có thông báo xác nhận
- Khi đổi quyền từ tài khoản thông thường sang quyền Quản trị viên hoặc Cán bộ, hệ thống hiển thị hộp thoại hỏi lại: *"Bạn có chắc chắn muốn giao quyền Cán bộ kiểm tra cho tài khoản này không?"* để tránh thao tác nhầm lẫn.

---

## 8. Hướng Dẫn Xử Lý Tình Huống & Kiểm Tra Lỗi

### 8.1. Các tình huống thực tế và cách xử lý
1. **Cán bộ luân chuyển công tác sang đơn vị khác**:
   - *Tình huống*: Cán bộ chuyển từ Đội QLTTĐT sang phòng ban khác, không còn nhiệm vụ kiểm tra môi trường.
   - *Cách xử lý*: Quản trị viên tìm tên cán bộ, chọn đổi vai trò về `[Công dân]` hoặc bấm `[Tạm khóa]` để thu hồi quyền kiểm tra.
2. **Nhà thầu mới tham gia dự án cần tài khoản xử lý bụi**:
   - *Tình huống*: Kỹ sư nhà thầu đăng ký tài khoản mới bằng số điện thoại.
   - *Cách xử lý*: Quản trị viên tìm số điện thoại của kỹ sư và đổi vai trò sang `[Nhà thầu]` để kỹ sư có thể nộp ảnh dập bụi.

### 8.2. Lệnh kiểm tra màn hình qua PowerShell

```powershell
# 1. Kiểm tra màn hình quản lý người dùng và phân quyền (< 0.5s)
node --test app/tests/auth-user-management-audit.test.js

# 2. Kiểm tra bộ quy chuẩn tên người dùng không bị cắt chữ
node --test app/tests/design-system-tokens.test.js

# 3. Chạy kiểm tra nhanh toàn hệ thống
npm --prefix app run verify:quick
```
