# ADMIN-01 — Bàn Làm Việc Quản Trị Hệ Thống & Giám Sát Hoạt Động

> **Mã màn hình**: `ADMIN-01` (Viết tắt: `ADM-01`)  
> **Tên tiếng Việt**: Bàn Làm Việc Quản Trị Hệ Thống & Giám Sát Hoạt Động  
> **Tên tiếng Anh**: Admin System Overview & Infrastructure Dashboard  
> **Quy chuẩn & Pháp lý liên quan**: [`Nghị định 45/2022/NĐ-CP`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/ND-45-2022-ND-CP.md) (Quản lý môi trường đô thị), Quy chế vận hành Trung tâm Giám sát Điều hành Đô thị Thông minh (IOC)

---

## 1. Thông Tin Nhận Diện Màn Hình (Screen Identity)

| Thuộc tính | Chi tiết nhận diện thực tế |
|---|---|
| **Mã màn hình** | `ADMIN-01` (Tên tệp: `ADMIN-01-dashboard.md`) |
| **Tên tiếng Việt** | Bàn Làm Việc Quản Trị Hệ Thống & Giám Sát Hoạt Động |
| **Tên tiếng Anh** | Admin System Overview & Infrastructure Dashboard |
| **Đường dẫn truy cập (Route)** | `/admin` (hoặc `/admin/dashboard`) |
| **Tệp giao diện chính** | [`app/src/apps/admin/pages/dashboard/AdminDashboardPage.jsx`](file:///D:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/admin/pages/dashboard/AdminDashboardPage.jsx) |
| **Khung bố cục (Layout)** | [`app/src/apps/admin/layout/AdminLayout.jsx`](file:///D:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/admin/layout/AdminLayout.jsx) (Khung quản trị hệ thống sáng rõ, phân khu chức năng mạch lạc) |
| **Ai được sử dụng?** | Quản trị viên hệ thống (Chuyên viên kỹ thuật Trung tâm IOC, Cán bộ quản trị dữ liệu Sở TT&TT, Cán bộ phụ trách hệ thống Sở TN&MT) |
| **Trạng thái vận hành** | Đang hoạt động ổn định — Kết nối dữ liệu thực tế từ hệ thống máy chủ |

**Tóm tắt mục đích sử dụng**: Màn hình là trung tâm điều hành kỹ thuật tổng thể của hệ sinh thái DustGuard VN. Màn hình giúp Quản trị viên nắm bắt nhanh tình hình hoạt động của toàn thành phố trong 5 giây đầu tiên: có bao nhiêu tài khoản đang hoạt động (Người dân, Thanh niên, Cán bộ, Nhà thầu), bao nhiêu công trường xây dựng đang được giám sát, bao nhiêu hồ sơ vụ việc đang thụ lý và tình trạng lưu trữ hình ảnh minh chứng. Màn hình cung cấp các nút bấm 1 chạm để quét tự động phát hiện nguy cơ ô nhiễm, kiểm tra kết nối với các cổng dịch vụ công (Cổng 1022, iHanoi) và chuyển nhanh sang các trang phân quyền hoặc cấu hình hệ thống.

---

## 2. Mục Đích & Giá Trị Thực Tế

### 2.1. Giải quyết bài toán quản trị hệ thống đô thị
1. **Quản lý tập trung toàn bộ dữ liệu đô thị tại một nơi duy nhất**:
   - Thay vì phải đăng nhập nhiều phần mềm riêng rẽ hoặc gõ các câu lệnh máy chủ phức tạp, Quản trị viên chỉ cần mở màn hình này là thấy được bức tranh toàn cảnh: công trường nào đang thi công, cán bộ nào đang đi kiểm tra hiện trường, nhà thầu nào đã nộp ảnh khắc phục.
2. **4 Thẻ chỉ số tổng quát thời gian thực**:
   - **Tài khoản hoạt động**: Tổng số người dùng trong hệ thống (phân rõ: Công dân, Tình nguyện viên thanh niên, Cán bộ thanh tra, Chỉ huy trưởng nhà thầu, Lãnh đạo).
   - **Công trường đang giám sát**: Tổng số điểm nóng thi công xây dựng, mỏ vật liệu hoặc trạm trộn bê tông trên địa bàn.
   - **Hồ sơ vụ việc đang xử lý**: Tổng số vụ việc đang được cán bộ kiểm tra và đôn đốc nhà thầu khắc phục.
   - **Kho lưu trữ hình ảnh minh chứng**: Tình trạng lưu trữ ảnh vi phạm và ảnh khắc phục sạch sẽ, sẵn sàng truy xuất làm bằng chứng pháp lý.
3. **Kích hoạt quét rủi ro tự động — Phát hiện sớm điểm nóng ô nhiễm**:
   - Có nút bấm 1 chạm `[Kích hoạt quét tự động]` để hệ thống tự động rà soát nồng độ bụi từ các trạm đo và lịch sử vi phạm, tự động cảnh báo các công trường có nguy cơ cao để cử cán bộ kiểm tra ngay.
4. **Theo dõi kết nối liên ngành (Cổng 1022 & iHanoi)**:
   - Giám sát trạng thái kết nối thông suốt với Cổng dịch vụ công 1022 và ứng dụng Công dân Thủ đô số iHanoi, đảm bảo không bị nghẽn tin báo từ người dân.

### 2.2. So sánh cách làm cũ và cách làm mới

| Nội dung công việc | Quản trị thủ công phân tán | Dùng Bàn làm việc Quản trị ADM-01 |
|---|---|---|
| **Theo dõi số lượng công trường** | Thống kê qua báo cáo giấy, file Excel rời rạc | **Cập nhật tự động** ngay khi có công trường mới |
| **Giám sát tài khoản người dùng** | Tra cứu thủ công, dễ sót tài khoản cán bộ luân chuyển | Bảng danh bạ trực quan, phân quyền chỉ bằng 1 cú nhấp |
| **Phát hiện sự cố kỹ thuật** | Chờ người dùng gọi điện báo lỗi mới biết | Có bảng theo dõi kết nối xanh/đỏ rõ ràng theo thời gian thực |
| **Quét cảnh báo rủi ro toàn đô thị** | Cán bộ tự tính toán thủ công mất nhiều ngày | **Dưới 3 giây** hệ thống tự động quét và chấm điểm rủi ro |

---

## 3. Ai Sử Dụng & Luồng Thao Tác Thực Tế

### 3.1. Các vị trí thực tế
1. **Chuyên viên kỹ thuật Trung tâm Điều hành IOC / Sở TT&TT**:
   - Trực kỹ thuật hàng ngày, theo dõi đường truyền kết nối, cấp quyền cho cán bộ mới được điều động về các quận/huyện.
2. **Cán bộ Quản trị Dữ liệu Sở TN&MT**:
   - Giám sát danh sách các điểm nóng xây dựng, kiểm tra số lượng hồ sơ xử lý bụi và kích hoạt chu trình quét rủi ro đô thị.

### 3.2. Sơ đồ luồng thao tác của Quản trị viên

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [QUẢN TRỊ VIÊN ĐĂNG NHẬP VÀO TRANG QUẢN TRỊ (/admin)]                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [XEM 4 CHỈ SỐ HỆ THỐNG THỜI GIAN THỰC]                                 │
│ ├─► 1. Tài khoản hoạt động (Phân bổ 5 nhóm quyền)                      │
│ ├─► 2. Công trường đang giám sát (33 điểm nóng)                        │
│ ├─► 3. Hồ sơ vụ việc (Đang thụ lý và đã đóng)                          │
│ └─► 4. Kho lưu trữ minh chứng & Trạng thái kết nối máy chủ             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
            ┌───────────────────────┼───────────────────────┐
            ▼                       ▼                       ▼
┌───────────────────────┐ ┌───────────────────┐ ┌───────────────────────┐
│ CẦN ĐỔI QUYỀN CÁN BỘ  │ │ CẦN CÀI ĐẶT THAM  │ │ CẦN QUÉT NGUY CƠ BỤI  │
│ Bấm [Quản lý tài khoản│ │ SỐ BỤI QUY CHUẨN  │ │ Bấm [Kích hoạt quét   │
│ và phân quyền]        │ │ Bấm [Cấu hình hệ  │ │ tự động toàn thành    │
│ ──► Sang màn ADM-02   │ │ thống] ──► ADM-03 │ │ phố] ──► Xong trong 3s│
└───────────────────────┘ └───────────────────┘ └───────────────────────┘
```

---

## 4. Bố Cục Giao Diện & Hình Ảnh Minh Họa

### 4.1. Cách sắp xếp thông tin trên màn hình
1. **Thanh điều hành đầu trang (Header)**:
   - Logo DustGuard VN, Huy hiệu "QUẢN TRỊ HỆ THỐNG" màu đỏ trang trọng.
   - Tên cán bộ trực kèm nút `[Đăng xuất]`.
2. **Khung giới thiệu & Trạng thái vận hành**:
   - Dòng chữ xanh lá: `● Hệ thống dữ liệu hoạt động bình thường (Sẵn sàng 100%)`.
   - Nút hành động nhanh: `[⚡ Kích hoạt quét rủi ro toàn thành phố]`.
3. **Hàng 4 ô số liệu chính**:
   - **Tài khoản**: Tổng số tài khoản (Ví dụ: `124 tài khoản`).
   - **Công trường**: Số điểm thi công (Ví dụ: `33 công trình`).
   - **Vụ việc**: Tổng số hồ sơ vi phạm (Ví dụ: `18 hồ sơ`).
   - **Lưu trữ ảnh**: Dung lượng và số lượng ảnh minh chứng (Ví dụ: `1.420 ảnh`).
4. **Khung theo dõi kết nối liên ngành (Đô thị thông minh)**:
   - Cổng tiếp nhận phản ánh 1022: `● Đang kết nối thông suốt`.
   - Ứng dụng Công dân iHanoi: `● Đang kết nối thông suốt`.
   - Mạng lưới trạm đo bụi tự động: `● 12/12 trạm hoạt động tốt`.
5. **Nhật ký thao tác gần nhất**:
   - Hiển thị 5 hoạt động mới nhất: Ai vừa đổi quyền người dùng, Ai vừa duyệt hồ sơ nghiệm thu.

### 4.2. Giao diện xem trên máy tính (Desktop)

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ DUSTGUARD VN  |  [ QUẢN TRỊ HỆ THỐNG ]   Cán bộ trực: Nguyễn Văn An (IOC)                 [ 🚪 Đăng xuất ]             │
├────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────┤
│ BÀN LÀM VIỆC QUẢN TRỊ  │ TỔNG QUAN HỆ THỐNG & DỮ LIỆU ĐÔ THỊ                                                           │
│ [●] Tổng quan hệ thống │ ● Trạng thái máy chủ: HOẠT ĐỘNG TỐT (100%)         [ ⚡ KÍCH HOẠT QUÉT RỦI RO TOÀN THÀNH PHỐ ] │
│ [ ] Quản lý tài khoản  │ ───────────────────────────────────────────────────────────────────────────────────────────── │
│ [ ] Cấu hình tham số   │ ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────────────┐ │
│ ────────────────────── │ │ TỔNG TÀI KHOẢN   │  │ CÔNG TRƯỜNG      │  │ HỒ SƠ VỤ VIỆC    │  │ ẢNH MINH CHỨNG LƯU TRỮ │ │
│ LIÊN KẾT NHANH         │ │       124        │  │        33        │  │        18        │  │       1.420 ảnh        │ │
│ 👥 Phân quyền cán bộ   │ │ 5 nhóm vai trò   │  │ Đang giám sát    │  │ 14 đã xử lý xong │  │ Lưu trữ an toàn        │ │
│ ⚙️ Cài đặt ngưỡng bụi  │ └──────────────────┘  └──────────────────┘  └──────────────────┘  └────────────────────────┘ │
│ 📋 Nhật ký hệ thống    │                                                                                               │
│ 📞 Hỗ trợ kỹ thuật     │ TRẠNG THÁI KẾT NỐI LIÊN THÔNG ĐÔ THỊ THÔNG MINH                                               │
│                        │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│                        │ │ • Cổng tiếp nhận phản ánh 1022 (TP. Hà Nội)         : [ ● Đang kết nối thông suốt ]       │ │
│                        │ │ • Ứng dụng Công dân Thủ đô số (iHanoi)              : [ ● Đang kết nối thông suốt ]       │ │
│                        │ │ • Mạng lưới trạm quan trắc không khí tự động        : [ ● 12 / 12 trạm hoạt động tốt ]    │ │
│                        │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
│                        │                                                                                               │
│                        │ NHẬT KÝ THAO TÁC GẦN NHẤT                                                   Xem tất cả →     │
│                        │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│                        │ │ [11:35] Admin vừa cập nhật vai trò "Nhà thầu" cho Kỹ sư Nguyễn Văn Hùng (Vinaconex)      │ │
│                        │ │ [11:30] Cán bộ Long vừa duyệt ảnh nghiệm thu Vụ việc #CASE-0420 (Cổng số 2 Thanh Xuân)    │ │
│                        │ │ [08:00] Hệ thống hoàn thành quét rủi ro tự động: Phát hiện 3 công trường cần tưới ẩm thêm │ │
│                        │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & Kết Nối Hệ Thống

### 5.1. Các đường dẫn lấy dữ liệu (API Endpoints)
- `GET /api/system/data-stats`: Lấy số lượng tài khoản, công trường, vụ việc và tình trạng lưu trữ.
- `GET /api/system/integrations/status`: Kiểm tra kết nối với Cổng 1022, iHanoi và trạm đo bụi.
- `POST /api/automation/sweep`: Kích hoạt quét tự động phát hiện rủi ro bụi trên toàn thành phố.

### 5.2. Mẫu dữ liệu thống kê từ hệ thống

```json
{
  "success": true,
  "data": {
    "totalUsers": 124,
    "totalSites": 33,
    "totalCases": 18,
    "resolvedCases": 14,
    "totalEvidencePhotos": 1420,
    "integrations": {
      "hotline1022": "CONNECTED",
      "iHanoiApp": "CONNECTED",
      "airStations": "12/12_ACTIVE"
    },
    "systemHealth": "HEALTHY"
  }
}
```

---

## 6. Danh Sách Nút Bấm & Thao Tác (Action Buttons)

| Tên nút bấm | Nằm ở đâu | Màu sắc & Kiểu nút | Kích thước | Bấm vào sẽ làm gì? | Khi nào bấm được? |
|---|---|---|---|---|---|
| **[⚡ Kích hoạt quét rủi ro toàn thành phố]** | Banner đầu trang | Nền đỏ cam `#B91C1C`, chữ trắng | Cao $\ge 48\text{px}$, nút to | Quét tự động toàn bộ dữ liệu bụi để tìm điểm nóng ô nhiễm | Luôn bấm được |
| **[👥 Phân quyền cán bộ]** | Cột menu bên trái | Nền xám nhạt, chữ đậm | Cao $44\text{px}$ | Chuyển nhanh sang trang Quản lý tài khoản ADM-02 | Luôn bấm được |
| **[⚙️ Cài đặt ngưỡng bụi]** | Cột menu bên trái | Nền xám nhạt, chữ đậm | Cao $44\text{px}$ | Chuyển nhanh sang trang Cấu hình tham số ADM-03 | Luôn bấm được |
| **[🚪 Đăng xuất]** | Góc trên bên phải | Viền mảnh đơn giản | $44\text{px} \times 44\text{px}$ | Thoát khỏi phiên làm việc quản trị | Luôn bấm được |

---

## 7. Quy Chuẩn Giao Diện Quản Trị

### 7.1. Bảng màu tương phản cao — Sáng rõ và trang trọng
- **Nền trang**: Màu kem sáng `#FAFAF9`, các thẻ nội dung nền trắng `#FFFFFF` viền xám `#E7E5E4` sắc nét.
- **Màu chữ**: Chữ màu than đậm `#1C1917`, tương phản cao giúp nhìn rõ các số liệu thống kê.
- **Huy hiệu trạng thái**:
  - Đang hoạt động tốt: Nền xanh lá nhạt, chữ xanh lá đậm.
  - Cần chú ý / Quét rủi ro: Nền đỏ nhạt, chữ đỏ son đậm.

### 7.2. Bố cục rộng rãi — Tối ưu cho màn hình máy tính làm việc
- Các khối số liệu dàn đều 4 cột rõ ràng, không bị tràn màn hình, xem tốt trên mọi màn hình máy tính từ 14-inch (1366x768) đến màn hình lớn của phòng điều hành IOC.

---

## 8. Hướng Dẫn Xử Lý Tình Huống & Kiểm Tra Lỗi

### 8.1. Các tình huống thực tế và cách xử lý
1. **Cổng kết nối 1022 hoặc iHanoi báo mất kết nối (Màu vàng/đỏ)**:
   - *Tình huống*: Đường truyền mạng ngoài bị gián đoạn tạm thời.
   - *Cách xử lý*: Có nút `[Thử kết nối lại]` bên cạnh để kiểm tra lại ngay mà không cần khởi động lại máy chủ.
2. **Sau khi thêm công trường mới, số lượng chưa nhảy**:
   - *Tình huống*: Dữ liệu đang được lưu tạm trên máy.
   - *Cách xử lý*: Nhấn phím `F5` hoặc bấm nút `[Làm mới]` ở góc phải để tải số liệu mới nhất.

### 8.2. Lệnh kiểm tra màn hình qua PowerShell

```powershell
# 1. Kiểm tra màn hình quản trị hệ thống (< 0.5s)
node --test app/tests/worker-full-edge-routes.test.js

# 2. Kiểm tra bộ quy chuẩn thiết kế giao diện sáng rõ
node --test app/tests/design-system-tokens.test.js

# 3. Chạy kiểm tra nhanh toàn hệ thống
npm --prefix app run verify:quick
```
