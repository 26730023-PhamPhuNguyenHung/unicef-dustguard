# ROLES SSOT — DustGuard VN 5-Role Civic Framework

> **Single Source of Truth (SSOT)**: Quy chuẩn định danh 5 vai trò thực tế trên nền tảng DustGuard VN.  
> **Nguyên tắc thiết kế**: Tinh gọn, thực tế, phản ánh đúng hoạt động của CivicTech — trao quyền cho thanh niên và cộng đồng, kết nối minh bạch với đơn vị thi công và chính quyền địa phương, **loại bỏ hoàn toàn tư duy giả lập quyền lực hành chính (bộ trưởng, thẩm phán, chế tài cưỡng chế)**.

---

## ⚡ 1. Triết Lý & Nguyên Tắc Tinh Gọn (Pragmatic Civic Roles)

1. **CivicTech, Không Giả Lập Cơ Quan Nhà Nước**: DustGuard VN là nền tảng công nghệ cộng đồng hỗ trợ tạo lập dữ liệu thực chứng (tamper-evident evidence), theo dõi dòng thời gian và chuyển giao có cấu trúc (Civic Handoff) tới các kênh tiếp nhận của Nhà nước (1022, iHanoi). Nền tảng không đóng vai "Thanh tra xử phạt" hay "Thẩm phán hành chính".
2. **5 Vai Trò Thực Tế Cốt Lõi**: Mọi tác nhân (Human Actors) trên hệ thống được phân định rõ ràng thành đúng 5 vai trò thực tế:
   - **`PUBLIC`**: Công chúng xem dữ liệu tổng hợp, xu hướng, bản đồ công khai.
   - **`CITIZEN`**: Người dân, thanh niên tình nguyện, học sinh sinh viên gửi ghi nhận hiện trường, nhận điểm rèn luyện / tín chỉ thanh niên có mã QR.
   - **`OPERATOR`**: Điều phối viên, reviewer cộng đồng xem hàng đợi duyệt, kết nối hồ sơ thực chứng và chuyển giao tới Điểm Tích Hợp 1022 / iHanoi / Email chính quyền.
   - **`SITE_REPRESENTATIVE`**: Đơn vị thi công, đại diện công trường xem hiện trường, nộp ảnh đối chứng dập bụi với điều kiện Geofence <= 50m.
   - **`ADMIN`**: Quản trị viên hệ thống quản lý tài khoản, cấu hình thiết bị trạm cảm biến IoT và bảo trì hệ thống.
3. **Zero-Mock & Server-Enforced**: Danh tính và vai trò được xác thực qua Clerk JWT và ánh xạ vào D1 SQLite (`IdentityContext`). Server luôn kiểm tra quyền độc lập, không tin tưởng role từ client payload.

---

## 📋 2. Bảng Danh Mục 5 Vai Trò SSOT (SSOT Role Definitions)

```ts
export const ROLES = Object.freeze({
  PUBLIC: 'public',                           // Công chúng / Khách vãng lai
  CITIZEN: 'citizen',                         // Người dân & Thanh niên tình nguyện
  OPERATOR: 'operator',                       // Điều phối viên & Reviewer cộng đồng
  SITE_REPRESENTATIVE: 'site_representative', // Đơn vị thi công / Đại diện công trình
  ADMIN: 'admin',                             // Quản trị viên hệ thống
});
```

---

## 🔍 3. Chi Tiết Từng Vai Trò Thực Tế

### 3.1. `PUBLIC` (Công chúng / Khách vãng lai)
* **Đối tượng**: Bất kỳ người dân nào truy cập ứng dụng web mà chưa đăng nhập tài khoản.
* **Mục đích**: Cung cấp thông tin minh bạch, dễ tiếp cận về chất lượng không khí đô thị để nâng cao nhận thức cộng đồng.
* **Quyền hạn & Khả năng**:
  - Xem bản đồ nhiệt AQI toàn cảnh thành phố (đã qua xử lý che mờ/bảo vệ quyền riêng tư vị trí nhạy cảm).
  - Xem xu hướng chất lượng không khí 7 ngày và dữ liệu trạm quan trắc công khai.
  - Xem danh mục các địa điểm công trường được công khai.
  - Đọc tài liệu hướng dẫn nhận biết ô nhiễm bụi và cẩm nang hành động xanh.
* **Hạn chế**:
  - Không thể gửi ghi nhận (`Observation`) hoặc tham gia chiến dịch.
  - Không được cấp phát mã QR điểm rèn luyện.
  - Không thể xem các hình ảnh/thông tin nội bộ chưa được xác minh (`UNVERIFIED_SIGNAL`).

---

### 3.2. `CITIZEN` (Công dân & Thanh niên Tình nguyện)
* **Đối tượng**: Người dân đô thị, đoàn viên thanh niên, học sinh sinh viên, tình nguyện viên CLB môi trường đã đăng nhập (qua Google/Email Clerk).
* **Mục đích**: Chủ thể quan sát, phát hiện và theo dõi thực địa; tích lũy hoạt động cống hiến vì cộng đồng.
* **Quyền hạn & Khả năng**:
  - Gửi ghi nhận hiện trường (`Observation`) kèm ảnh chụp, vị trí GPS thực tế, phân loại nguồn bụi và mô tả bối cảnh.
  - Tham gia các chiến dịch xanh (Green Campaigns) do cộng đồng hoặc nhà trường phát động.
  - Tham gia chuỗi tái kiểm tra định kỳ 24h/48h (Follow-up) để ghi nhận chuyển biến (Tốt hơn / Không đổi / Xấu hơn).
  - Tích lũy giờ tình nguyện xanh và nhận Chứng nhận số có mã QR tra cứu (chuẩn quy đổi tham chiếu: 20 giờ tình nguyện = 4.0 tín chỉ/điểm rèn luyện).
  - Theo dõi tiến trình xử lý công khai của những phản ánh do mình đóng góp.
* **Hạn chế**:
  - Không thể duyệt hàng đợi công cộng của người khác.
  - Không thể tự ý đóng hoặc chuyển trạng thái hồ sơ cấp cơ quan.
  - Không có quyền can thiệp vào cấu hình cảm biến phần cứng.

---

### 3.3. `OPERATOR` (Điều phối viên & Reviewer Cộng đồng)
* **Đối tượng**: Thành viên ban chủ nhiệm CLB thanh niên, tình nguyện viên nòng cốt, hoặc cán bộ điều phối tiếp nhận được ủy quyền.
* **Mục đích**: Đảm bảo chất lượng dữ liệu đầu vào, nhóm các ghi nhận rời rạc thành hồ sơ có cấu trúc và điều phối chuyển giao thông tin đúng nơi đúng chỗ.
* **Quyền hạn & Khả năng**:
  - Truy cập Hàng đợi duyệt ghi nhận cộng đồng (`Review Queue`).
  - Kiểm tra tính xác thực sơ bộ của ghi nhận (GPS, ảnh chụp, dấu hiệu bất thường).
  - Gom các ghi nhận lân cận thành Vụ việc theo dõi hệ thống (`Case`).
  - Kết xuất Bộ hồ sơ thực chứng cộng đồng chuẩn A4 (`Structured Civic Dossier`) có mã băm SHA-256 chống chỉnh sửa.
  - Thực hiện chuyển giao hồ sơ sang Điểm Tích Hợp (Tổng đài 1022, Ứng dụng iHanoi, Email UBND Phường/BQLDA).
  - Cập nhật trạng thái chuyển giao và ghi nhận phản hồi chính thức từ các đơn vị chịu trách nhiệm.
* **Hạn chế**:
  - Không thực hiện các hành vi mang tính trừng phạt, chế tài hay cưỡng chế nhà thầu.
  - Không có quyền cấu hình sâu vào hạ tầng kỹ thuật D1/R2 hoặc thông số sensor PSK.

---

### 3.4. `SITE_REPRESENTATIVE` (Đơn vị Thi công & Đại diện Công trường)
* **Đối tượng**: Chỉ huy trưởng công trường, cán bộ an toàn môi trường (HSE) hoặc đại diện nhà thầu thi công được liên kết với mã công trình (`siteId` / `organizationId`).
* **Mục đích**: Tiếp nhận cảnh báo sớm, chủ động đối thoại xây dựng và cung cấp bằng chứng minh bạch về các nỗ lực dập bụi tại công trình.
* **Quyền hạn & Khả năng**:
  - Xem danh sách cảnh báo và hồ sơ ghi nhận liên quan trực tiếp đến phạm vi công trường của mình.
  - Nộp ảnh đối chứng biện pháp giảm thiểu bụi (phun sương, phủ bạt, rửa xe tải, lắp lưới chắn bụi).
  - Bắt buộc kiểm tra **Geofence bán kính <= 50m** khi tải ảnh đối chứng lên hệ thống (chống việc dùng ảnh chụp từ xa hoặc ảnh cũ).
  - Xem lịch sử khắc phục Before/After và biểu đồ biến thiên nồng độ bụi tại trạm lân cận công trường.
* **Hạn chế (Horizontal Isolation)**:
  - Chỉ được xem và gửi giải trình cho đúng công trường được phân quyền (`siteId`). Tuyệt đối không thể can thiệp dữ liệu công trường khác.
  - Không thể tự ý gỡ bỏ cảnh báo của cộng đồng khi chưa cung cấp đủ ảnh đối chứng hợp lệ.

---

### 3.5. `ADMIN` (Quản trị viên Hệ thống)
* **Đối tượng**: Đội ngũ kỹ thuật vận hành nền tảng DustGuard VN.
* **Mục đích**: Bảo đảm tính sẵn sàng, an toàn dữ liệu, toàn vẹn thiết bị và quản lý danh mục dùng chung.
* **Quyền hạn & Khả năng**:
  - Quản lý danh mục người dùng và điều chỉnh vai trò (`User Management & Role Assignment`).
  - Đăng ký và cấu hình các trạm cảm biến môi trường IoT (mã định danh, vị trí WGS84, khóa bảo mật `HMAC_SHA256_PSK`, ngưỡng cảnh báo PM2.5).
  - Quản lý danh mục địa bàn hành chính, tọa độ các điểm nhạy cảm (trường học, bệnh viện).
  - Kiểm tra và trích xuất Nhật ký kiểm toán bảo mật bất biến (`audit_logs`).
  - Giám sát trạng thái hoạt động của Cloudflare D1, R2 Storage và worker edge.
* **Hạn chế**:
  - Thao tác nhạy cảm (xóa dữ liệu, reset cảm biến) luôn được ghi log audit kèm định danh người thực hiện.

---

## 🔀 4. Bảng Ánh Xạ Chuẩn Hóa & Tương Thích Ngược (Role Normalization & Migration)

Nhằm đảm bảo tương thích ngược với các token cũ hoặc dữ liệu trước đây, hàm chuẩn hóa role áp dụng quy tắc quy đổi:

| Role Cũ / Đầu Vào Thô | Role SSOT Mới | Ghi chú chuyển đổi |
|---|---|---|
| `guest`, `anonymous`, `null`, `""` | `PUBLIC` (`public`) | Mặc định công chúng chưa đăng nhập |
| `citizen`, `user`, `resident` | `CITIZEN` (`citizen`) | Giữ nguyên chuẩn công dân |
| `youth`, `youth_member`, `volunteer`, `student` | `CITIZEN` (`citizen`) | Hợp nhất vào Citizen (tích lũy điểm rèn luyện) |
| `staff`, `reviewer`, `coordinator`, `moderator` | `OPERATOR` (`operator`) | Tinh gọn thành Điều phối viên |
| `inspector`, `executive`, `minister`, `judge` | `OPERATOR` (`operator`) | **Xóa bỏ giả lập bộ trưởng/thẩm phán -> Chuyển thành Điều phối viên** |
| `contractor`, `builder`, `site_manager` | `SITE_REPRESENTATIVE` (`site_representative`) | Chuẩn hóa tên gọi Đại diện công trường |
| `admin`, `super_admin`, `demo_admin`, `system` | `ADMIN` (`admin`) | Chuẩn hóa thành Quản trị viên hệ thống |

### Mã nguồn chuẩn hóa tham chiếu:
```ts
export function normalizeRole(rawRole: string | null | undefined): string {
  if (!rawRole) return ROLES.PUBLIC;
  const clean = String(rawRole).toLowerCase().trim();

  switch (clean) {
    case 'public':
    case 'guest':
    case 'anonymous':
      return ROLES.PUBLIC;

    case 'citizen':
    case 'youth':
    case 'youth_member':
    case 'volunteer':
    case 'student':
    case 'resident':
    case 'user':
      return ROLES.CITIZEN;

    case 'operator':
    case 'staff':
    case 'reviewer':
    case 'coordinator':
    case 'moderator':
    case 'inspector':
    case 'executive':
    case 'minister':
    case 'judge':
      return ROLES.OPERATOR;

    case 'site_representative':
    case 'contractor':
    case 'builder':
    case 'site_manager':
      return ROLES.SITE_REPRESENTATIVE;

    case 'admin':
    case 'super_admin':
    case 'demo_admin':
    case 'system':
      return ROLES.ADMIN;

    default:
      return ROLES.CITIZEN;
  }
}
```

---

## 📈 5. Thứ Bậc Vai Trò (Role Hierarchy)

Thứ bậc vai trò được quy định để phục vụ các kiểm tra quyền tối thiểu:

```ts
export const ROLE_HIERARCHY = Object.freeze({
  [ROLES.PUBLIC]: 0,
  [ROLES.CITIZEN]: 10,
  [ROLES.SITE_REPRESENTATIVE]: 20,
  [ROLES.OPERATOR]: 30,
  [ROLES.ADMIN]: 50,
});
```

* **Quy tắc so sánh**: `hasRoleLevel(userRole, requiredRole)` chỉ áp dụng cho các tác vụ quản trị thông thường. Đối với các tác vụ đặc thù (ví dụ đại diện công trường nộp đối chứng), hệ thống ưu tiên kiểm tra đúng vai trò hoặc chính sách ABAC theo tài nguyên.

---

## 🔒 6. Vòng Đời & Nguyên Tắc Bảo Vệ Danh Tính

1. **Khởi tạo Idempotent**: Khi người dùng đăng nhập qua Clerk lần đầu, hệ thống D1 tự động tạo bản ghi `users` với vai trò mặc định là `CITIZEN`.
2. **Không Tự Nâng Quyền (No Self-Elevation)**: Người dùng không thể tự cập nhật role của chính mình trong payload request. Mọi thay đổi vai trò sang `OPERATOR`, `SITE_REPRESENTATIVE`, hoặc `ADMIN` phải do Quản trị viên thao tác hoặc qua cơ chế phân quyền tổ chức được xác thực.
3. **Cách ly Ngang (Horizontal Isolation)**: `SITE_REPRESENTATIVE` luôn đi kèm với `organizationId` / `siteId` hợp lệ trong `IdentityContext`.
