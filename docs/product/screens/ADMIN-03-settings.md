# ADMIN-03 — Cấu Hình Ngưỡng Bụi Báo Động, Hạn Xử Lý & Kết Nối Đô Thị

> **Mã màn hình**: `ADMIN-03` (Viết tắt: `ADM-03`)  
> **Tên tiếng Việt**: Cấu Hình Ngưỡng Bụi Báo Động, Hạn Xử Lý & Kết Nối Đô Thị  
> **Tên tiếng Anh**: System Standards, Operational Deadlines & Urban Integration Settings  
> **Quy chuẩn & Pháp lý liên quan**: [`QCVN 05:2023/BTNMT`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/QCVN-05-2023-BTNMT.md) (Quy chuẩn chất lượng không khí), [`Nghị định 45/2022/NĐ-CP`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/ND-45-2022-ND-CP.md)

---

## 1. Thông Tin Nhận Diện Màn Hình (Screen Identity)

| Thuộc tính | Chi tiết nhận diện thực tế |
|---|---|
| **Mã màn hình** | `ADMIN-03` (Tên tệp: `ADMIN-03-settings.md`) |
| **Tên tiếng Việt** | Cấu Hình Ngưỡng Bụi Báo Động, Hạn Xử Lý & Kết Nối Đô Thị |
| **Tên tiếng Anh** | System Standards, Operational Deadlines & Urban Integration Settings |
| **Đường dẫn truy cập (Route)** | `/admin/settings` (hoặc `/admin/system`) |
| **Tệp giao diện chính** | [`app/src/apps/admin/pages/settings/SettingsPage.jsx`](file:///D:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/admin/pages/settings/SettingsPage.jsx) |
| **Khung bố cục (Layout)** | [`app/src/apps/admin/layout/AdminLayout.jsx`](file:///D:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/admin/layout/AdminLayout.jsx) (Khung quản trị hệ thống sáng rõ, các khối cài đặt mạch lạc) |
| **Ai được sử dụng?** | Quản trị viên hệ thống (Chuyên gia kỹ thuật IOC, Cán bộ phụ trách dữ liệu môi trường Sở TN&MT) |
| **Trạng thái vận hành** | Đang hoạt động ổn định — Áp dụng ngay các ngưỡng quy chuẩn vào thực tế |

**Tóm tắt mục đích sử dụng**: Màn hình là nơi cài đặt các tham số tiêu chuẩn của toàn bộ hệ thống DustGuard VN. Quản trị viên có thể thiết lập các mức nồng độ bụi báo động theo Quy chuẩn quốc gia QCVN 05:2023/BTNMT (bụi mịn PM2.5 vượt quá $50\,\mu\text{g/m}^3$, bụi thô PM10 vượt quá $100\,\mu\text{g/m}^3$), cài đặt thời hạn giải quyết cam kết (cán bộ phải kiểm tra trong 24 giờ, nhà thầu phải dập bụi xong trong 48 giờ, vị trí chụp ảnh phải cách công trường dưới 50 mét), theo dõi kết nối với Cổng tiếp nhận 1022 và ứng dụng iHanoi, và nạp lại dữ liệu mẫu khi cần đào tạo tập huấn cán bộ mới.

---

## 2. Mục Đích & Giá Trị Thực Tế

### 2.1. Giải quyết bài toán quản trị tiêu chuẩn tại Việt Nam
1. **Áp dụng đúng Quy chuẩn Quốc gia về Chất lượng Không khí (QCVN 05:2023/BTNMT)**:
   - **Bụi mịn PM2.5 (Trung bình 24 giờ)**: Mức cho phép tối đa $50\,\mu\text{g/m}^3$. Khi vượt mức này, hệ thống tự động đổi màu cảnh báo sang màu cam/đỏ và nhắc nhở cán bộ kiểm tra.
   - **Bụi thô PM10 (Trung bình 24 giờ)**: Mức cho phép tối đa $100\,\mu\text{g/m}^3$. Đây là chỉ số phản ánh xe chở đất đá không che bạt hoặc đào móng làm phát tán bụi.
   - **Bụi tức thời 1 giờ PM2.5**: $100\,\mu\text{g/m}^3$ — Cảnh báo có khói bụi phát tán bất thường.
   - **Bụi tức thời 1 giờ PM10**: $200\,\mu\text{g/m}^3$ — Cảnh báo khẩn cấp, cần cử cán bộ đến ngay.
2. **Cài đặt thời hạn cam kết giải quyết rõ ràng**:
   - **Thời hạn Cán bộ phải đi kiểm tra hiện trường**: Tối đa 24 giờ kể từ khi nhận phản ánh.
   - **Thời hạn Nhà thầu phải dập bụi xong**: Tối đa 48 giờ (tưới nước đường gom, phủ bạt bãi cát, xịt rửa lốp xe).
   - **Khoảng cách chụp ảnh hợp lệ**: Dưới 50 mét so với vị trí công trường để đảm bảo người chụp có mặt tại hiện trường.
3. **Quản lý kết nối các cổng đô thị thông minh (Cổng 1022 & iHanoi)**:
   - Đảm bảo các phản ánh của người dân từ Cổng 1022 hoặc ứng dụng Công dân Thủ đô số (iHanoi) được chuyển tự động vào hệ thống DustGuard VN và cập nhật lại tiến độ giải quyết cho người dân theo dõi.
4. **Khu vực an toàn nạp dữ liệu thử nghiệm**:
   - Cung cấp nút nạp lại dữ liệu mẫu chuẩn (33 công trình, 18 vụ việc mẫu) phục vụ công tác diễn tập, đào tạo cán bộ thanh tra mới mà không ảnh hưởng đến dữ liệu đang chạy.

### 2.2. So sánh cách làm cũ và cách làm mới

| Tiêu chí | Cài đặt cứng trong mã nguồn trước đây | Dùng màn hình Cấu hình tham số ADM-03 |
|---|---|---|
| **Thay đổi ngưỡng bụi QCVN** | Phải nhờ lập trình viên sửa code và khởi động lại | **Chỉnh sửa ngay trên giao diện** và có hiệu lực tức thì |
| **Độ đồng bộ quy chuẩn** | Các màn hình có thể hiển thị số liệu lệch nhau | Toàn bộ hệ thống dùng chung 1 bộ tham số chuẩn |
| **Kiểm tra kết nối Cổng 1022** | Khó biết khi nào kết nối bị đứt | Hiển thị đèn trạng thái xanh/đỏ rõ ràng |
| **Chuẩn bị dữ liệu đào tạo** | Tốn nhiều công sức tạo tài khoản và vụ việc giả | 1 chạm nạp lại toàn bộ dữ liệu mẫu chuẩn |

---

## 3. Ai Sử Dụng & Luồng Thao Tác Thực Tế

### 3.1. Các vị trí thực tế
1. **Quản trị viên Trung tâm Điều hành IOC / Sở TT&TT**:
   - Kiểm tra định kỳ các cổng kết nối dữ liệu liên ngành và quản trị tính sẵn sàng của hệ thống.
2. **Chuyên gia Dữ liệu Môi trường Sở TN&MT**:
   - Cập nhật lại các ngưỡng nồng độ bụi khi Bộ Tài nguyên và Môi trường ban hành quy chuẩn mới.

### 3.2. Sơ đồ quy trình cài đặt tham số

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [QUẢN TRỊ VIÊN VÀO MỤC "CẤU HÌNH THAM SỐ" (/admin/settings)]           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [XEM & ĐIỀU CHỈNH 4 KHỐI CÀI ĐẶT CHÍNH]                                │
│ ├─► 1. Ngưỡng nồng độ bụi theo Quy chuẩn QCVN 05:2023/BTNMT            │
│ ├─► 2. Thời hạn cam kết xử lý (Cán bộ 24h, Nhà thầu 48h, Khoảng cách 50m)│
│ ├─► 3. Trạng thái kết nối Cổng 1022 & Ứng dụng iHanoi                  │
│ └─► 4. Khu vực quản trị dữ liệu thử nghiệm                             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Bấm [Lưu thay đổi])
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [HỆ THỐNG ÁP DỤNG THAM SỐ MỚI TRÊN TOÀN THÀNH PHỐ]                     │
│ Mọi cảnh báo và thời hạn của cán bộ và nhà thầu đều được cập nhật ngay │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Bố Cục Giao Diện & Hình Ảnh Minh Họa

### 4.1. Cách sắp xếp thông tin trên màn hình
1. **Khối 1 — Ngưỡng bụi báo động theo Quy chuẩn Quốc gia (QCVN 05:2023/BTNMT)**:
   - **Ô 1**: Ngưỡng bụi mịn PM2.5 (24 giờ) — `50 µg/m³`.
   - **Ô 2**: Ngưỡng bụi thô PM10 (24 giờ) — `100 µg/m³`.
   - **Ô 3**: Ngưỡng bụi tức thời PM2.5 (1 giờ) — `100 µg/m³`.
   - **Ô 4**: Ngưỡng bụi tức thời PM10 (1 giờ) — `200 µg/m³`.
2. **Khối 2 — Thời hạn cam kết giải quyết**:
   - Hạn cán bộ đi kiểm tra: `24 giờ`.
   - Hạn nhà thầu dập bụi xong: `48 giờ`.
   - Khoảng cách chụp ảnh hợp lệ: `50 mét`.
3. **Khối 3 — Trạng thái kết nối các cổng đô thị**:
   - Cổng tiếp nhận phản ánh 1022: Công tắc [BẬT / TẮT] kèm đèn xanh báo kết nối.
   - Ứng dụng Công dân iHanoi: Công tắc [BẬT / TẮT] kèm đèn xanh báo kết nối.
4. **Khối 4 — Vùng quản trị dữ liệu thử nghiệm**:
   - Khung viền màu đỏ cảnh báo, có nút `[Nạp lại dữ liệu mẫu chuẩn]` kèm yêu cầu xác nhận.

### 4.2. Giao diện xem trên máy tính (Desktop)

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ DUSTGUARD VN  |  [ QUẢN TRỊ HỆ THỐNG ]   Cán bộ trực: Nguyễn Văn An (IOC)                 [ 🚪 Đăng xuất ]             │
├────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────┤
│ BÀN LÀM VIỆC QUẢN TRỊ  │ CẤU HÌNH THAM SỐ QUY CHUẨN & KẾT NỐI ĐÔ THỊ                                                   │
│ [ ] Tổng quan hệ thống │ ───────────────────────────────────────────────────────────────────────────────────────────── │
│ [ ] Quản lý tài khoản  │ 1. NGƯỠNG BỤI BÁO ĐỘNG THEO QUY CHUẨN QUỐC GIA (QCVN 05:2023/BTNMT)                           │
│ [●] Cấu hình tham số   │ ┌───────────────────────────┐ ┌───────────────────────────┐                                   │
│ ────────────────────── │ │ Bụi mịn PM2.5 (24 giờ)    │ │ Bụi thô PM10 (24 giờ)     │                                   │
│ DANH MỤC THAM SỐ       │ │ Ngưỡng: [ 50 ] µg/m³      │ │ Ngưỡng: [ 100 ] µg/m³     │                                   │
│ 📊 Ngưỡng bụi QCVN     │ └───────────────────────────┘ └───────────────────────────┘                                   │
│ ⏱️ Hạn xử lý cam kết   │ ┌───────────────────────────┐ ┌───────────────────────────┐                                   │
│ 🌐 Kết nối Cổng 1022   │ │ Bụi tức thời PM2.5 (1 giờ)│ │ Bụi tức thời PM10 (1 giờ) │                                   │
│ ⚠️ Dữ liệu thử nghiệm  │ │ Ngưỡng: [ 100 ] µg/m³     │ │ Ngưỡng: [ 200 ] µg/m³     │                                   │
│                        │ └───────────────────────────┘ └───────────────────────────┘                                   │
│                        │                                                                                               │
│                        │ 2. THỜI HẠN CAM KẾT GIẢI QUYẾT & KHOẢNG CÁCH CHỤP ẢNH                                         │
│                        │ ┌───────────────────────────┐ ┌───────────────────────────┐ ┌───────────────────────────────┐ │
│                        │ │ Hạn cán bộ đi kiểm tra    │ │ Hạn nhà thầu dập bụi xong │ │ Khoảng cách chụp ảnh hợp lệ   │ │
│                        │ │ [ 24 ] giờ                │ │ [ 48 ] giờ                │ │ [ 50 ] mét so với công trường │ │
│                        │ └───────────────────────────┘ └───────────────────────────┘ └───────────────────────────────┘ │
│                        │                                                                                               │
│                        │ 3. TRẠNG THÁI KẾT NỐI CỔNG ĐÔ THỊ THÔNG MINH                                                  │
│                        │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│                        │ │ • Cổng tiếp nhận phản ánh 1022      : [ ● Đang bật ]   [ Tạm dừng kết nối ]               │ │
│                        │ │ • Ứng dụng Công dân iHanoi (Hà Nội) : [ ● Đang bật ]   [ Tạm dừng kết nối ]               │ │
│                        │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
│                        │                                                                                               │
│                        │ 4. VÙNG QUẢN TRỊ DỮ LIỆU THỬ NGHIỆM                                                           │
│                        │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│                        │ │ ⚠️ Nạp lại dữ liệu mẫu (33 công trình, 18 vụ việc chuẩn phục vụ đào tạo cán bộ)           │ │
│                        │ │                                                            [ 🔄 NẠP LẠI DỮ LIỆU MẪU ]     │ │
│                        │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
│                        │                                                                                               │
│                        │                                                      [ 💾 LƯU CẤU HÌNH HỆ THỐNG ]             │
└────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & Kết Nối Hệ Thống

### 5.1. Các đường dẫn lấy và lưu cấu hình (API Endpoints)
- `GET /api/system/settings`: Lấy toàn bộ các tham số cấu hình hiện tại của hệ thống.
- `POST /api/system/settings`: Lưu lại các thay đổi về ngưỡng bụi và thời hạn giải quyết.
- `POST /api/system/seed-demo`: Nạp lại bộ dữ liệu mẫu chuẩn phục vụ đào tạo.

### 5.2. Mẫu dữ liệu cấu hình lưu trên hệ thống

```json
{
  "success": true,
  "data": {
    "environmentalStandards": {
      "pm25Threshold24h": 50,
      "pm10Threshold24h": 100,
      "pm25Threshold1h": 100,
      "pm10Threshold1h": 200
    },
    "slaPolicy": {
      "inspectorSurveyHours": 24,
      "contractorRemediationHours": 48,
      "maxPhotoDistanceMeters": 50
    },
    "integrations": {
      "enableHotline1022": true,
      "enableIHanoi": true
    }
  }
}
```

---

## 6. Danh Sách Nút Bấm & Thao Tác (Action Buttons)

| Tên nút bấm | Nằm ở đâu | Màu sắc & Kiểu nút | Kích thước | Bấm vào sẽ làm gì? | Khi nào bấm được? |
|---|---|---|---|---|---|
| **[💾 Lưu cấu hình hệ thống]** | Góc dưới bên phải trang | Nền xanh Teal `#0D6F64`, chữ trắng | Cao $\ge 48\text{px}$, nút to | Áp dụng toàn bộ ngưỡng bụi và thời hạn mới vào hệ thống | Khi có chỉnh sửa tham số |
| **[🔄 Nạp lại dữ liệu mẫu]** | Trong khung Vùng thử nghiệm | Nền đỏ son viền đậm | Cao $\ge 44\text{px}$ | Nạp lại danh sách công trình và vụ việc mẫu phục vụ đào tạo | Cần gõ chữ xác nhận |
| **[Tạm dừng kết nối]** | Dòng Cổng 1022 / iHanoi | Nền xám viền mảnh | Cao $36\text{px}$ | Tạm ngắt nhận tin báo khi đối tác bảo trì hệ thống | Khi cổng đang bật |

---

## 7. Quy Chuẩn Giao Diện Quản Trị

### 7.1. Bảng màu tương phản cao — Sáng rõ và an toàn
- **Nền trang**: Màu kem sáng `#FAFAF9`, các ô nhập số liệu nền trắng `#FFFFFF` có viền xám `#D6D3D1` rõ ràng.
- **Khu vực cảnh báo (Danger Zone)**: Khung viền màu đỏ nhạt `#FEE2E2` kèm biểu tượng tam giác cảnh báo để người dùng chú ý cẩn thận khi thao tác.

### 7.2. Kiểm tra dữ liệu nhập — Tránh gõ nhầm số âm hoặc số vô lý
- Các ô nhập ngưỡng bụi và thời hạn đều có giới hạn an toàn (ví dụ: thời hạn không được nhỏ hơn 1 giờ hoặc lớn hơn 720 giờ). Nếu người dùng gõ số không hợp lý, hệ thống sẽ nhắc nhở ngay tại ô nhập.

---

## 8. Hướng Dẫn Xử Lý Tình Huống & Kiểm Tra Lỗi

### 8.1. Các tình huống thực tế và cách xử lý
1. **Muốn nạp lại dữ liệu mẫu để tập huấn cán bộ mới**:
   - *Tình huống*: Chuẩn bị tổ chức lớp tập huấn nghiệp vụ cho 20 cán bộ thanh tra mới.
   - *Cách xử lý*: Bấm nút `[🔄 Nạp lại dữ liệu mẫu]`, màn hình hiện hộp thoại yêu cầu gõ chữ `XAC_NHAN` để đảm bảo không bấm nhầm. Sau đó hệ thống nạp lại đủ 33 công trình và 18 vụ việc mẫu.
2. **Cổng 1022 của thành phố thông báo bảo trì nâng cấp**:
   - *Tình huống*: Phía Cổng 1022 bảo trì từ 22:00 đến 04:00 sáng.
   - *Cách xử lý*: Bấm nút `[Tạm dừng kết nối]`. Sau khi đối tác bảo trì xong, bấm `[Bật lại kết nối]`.

### 8.2. Lệnh kiểm tra màn hình qua PowerShell

```powershell
# 1. Kiểm tra API cấu hình tham số hệ thống (< 0.5s)
node --test app/tests/worker-full-edge-routes.test.js

# 2. Kiểm tra giao diện và nút bấm to rõ
node --test app/tests/design-system-tokens.test.js

# 3. Chạy kiểm tra nhanh toàn hệ thống
npm --prefix app run verify:quick
```
