# PUB-06 — Bàn Thử Nghiệm & Trình Diễn Cảm Biến Đo Bụi

---

## 1. Thông Tin Màn Hình

| Thuộc tính | Chi tiết |
|---|---|
| **Mã màn hình** | `PUB-06` |
| **Tên màn hình** | Bàn Thử Nghiệm & Trình Diễn Cảm Biến Đo Bụi |
| **Đường dẫn (URL)** | `/demo/iot` |
| **Tệp mã nguồn** | `app/src/modules/public/IoTDemo.jsx` |
| **Thành phần bổ trợ** | Hộp thoại hướng dẫn lắp đặt 3 bước (`IoTSetupModal.jsx`), API kết nối trạm đo (`staff-api.js`) |
| **Kiểu bố cục** | Giao diện công khai (Thanh điều khiển trên cùng + Thẻ điều hành trạm đo + Bảng nhật ký số đo) |
| **Ai được dùng** | Mọi người (Ban giám khảo, cán bộ, kỹ sư, sinh viên, người dân — không cần đăng nhập) |
| **Trạng thái hoạt động** | **Đang hoạt động tốt** (Gửi số đo mô phỏng trực tiếp vào hệ thống dữ liệu thật) |

---

## 2. Mục Đích & Ý Nghĩa Thực Tế

Trang **PUB-06** là không gian thử nghiệm thực tế, cho phép người xem và Ban giám khảo tự tay điều khiển và trải nghiệm cách mạng lưới cảm biến đo bụi ngoài công trường hoạt động mà không cần phải ra tận hiện trường:

1. **Xem thông tin trạm đo thực tế ngoài công trường (`NODE-DG-HCM-001`)**:
   - Trực quan hóa trạm đo bụi đặt tại cổng chính Khu công trình đô thị An Phú (TP. Thuận An, Bình Dương).
   - Thiết bị bao gồm mạch điều khiển thông minh, cảm biến đo hạt bụi bằng tia laser và cảm biến nhiệt độ, độ ẩm.
2. **Thử bấm gửi số đo 1-chạm vào hệ thống**:
   - **Nút 1 — [⚡ Gửi số đo an toàn]**: Gửi nồng độ bụi bình thường (PM2.5 từ $22 - 34\,\mu\text{g/m}^3$) $\rightarrow$ Nằm trong mức an toàn cho phép $\rightarrow$ Thẻ chỉ số chuyển sang màu **Xanh ngọc** yên tâm.
   - **Nút 2 — [⚠ Mô phỏng bụi cao (>75)]**: Tạo số đo bụi cao đột biến (PM2.5 = $82.5\,\mu\text{g/m}^3$) vượt quy chuẩn môi trường $\rightarrow$ Thẻ chỉ số chuyển ngay sang màu **Đỏ son** cảnh báo khẩn cấp, đưa công trình vào diện cần kiểm tra dập bụi.
3. **Quy trình 4 bước lắp đặt đơn giản ngoài đời thực**:
   - Khẳng định tính dễ làm: *Gắn trạm đo tại công trường $\rightarrow$ Cắm nguồn điện USB 5V $\rightarrow$ Hệ thống tự nhận thiết bị $\rightarrow$ Số đo xuất hiện ngay trên bản đồ và bảng làm việc của cán bộ*.
4. **Nhật ký số đo rõ ràng, minh bạch**:
   - Mọi lần đo đều có thời gian chi tiết và mã kiểm tra tính toàn vẹn, chứng minh số liệu không bị sửa đổi.
5. **Nguyên tắc nghiệp vụ thực tế**:
   - *Cảm biến là tín hiệu cảnh báo sớm ban đầu, giúp phát hiện nguy cơ nhanh chóng. Khi ra quyết định xử lý hoặc xử phạt, hệ thống luôn kết hợp với ảnh chụp hiện trường có tọa độ và biên bản kiểm tra của cán bộ*.

---

## 3. Hành Trình Người Dùng Thao Tác

```text
[Người dùng / Ban Giám khảo truy cập trang /demo/iot]
                       │
                       ▼
      [1. Xem 4 bước triển khai lắp đặt ngoài đời]
                       │
                       ▼
      [2. Quan sát trạng thái Trạm đo DG-HCM-001]
   (Đèn trực tuyến bật sáng, số đo hiện tại: PM2.5 = 24.5 µg/m³)
                       │
          ┌────────────┴───────────────────────────┐
          ▼                                        ▼
[THỬ KỊCH BẢN 1: BỤI CAO VƯỢT MỨC]       [THỬ KỊCH BẢN 2: SỐ ĐO AN TOÀN]
Bấm [⚠ Mô phỏng bụi cao (>75)]           Bấm [⚡ Gửi số đo an toàn]
          │                                        │
          ▼                                        ▼
Gửi số đo PM2.5 = 82.5 lên máy chủ       Gửi số đo PM2.5 = ~24 lên máy chủ
Thẻ chỉ số chuyển sang ĐỎ SON CẢNH BÁO   Thẻ chỉ số chuyển sang XANH AN TOÀN
          │                                        │
          └────────────┬───────────────────────────┘
                       │
                       ▼
       [3. Kiểm tra dòng số đo mới trên Bảng nhật ký]
   (Bản ghi mới nhất xuất hiện ngay đầu bảng với giờ phút chính xác)
                       │
                       ▼
      [4. Bấm [+ Lắp đặt 3 bước] nếu muốn xem hướng dẫn gắn trạm mới]
```

---

## 4. Bố Cục Giao Diện & Mô Phỏng Wireframe

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ THANH ĐIỀU HƯỚNG: [← Quay lại Demo Hub] | 📡 Trạm đo DG-HCM-001    [+ Lắp đặt 3 bước] [↻]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PHẦN 1: HƯỚNG DẪN 4 BƯỚC LẮP ĐẶT ĐƠN GIẢN                                              │
│ "Việc lắp đặt trạm đo chỉ mất vài phút đơn giản"                   [Bắt đầu thiết lập] │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌───────────────────────────┐│
│ │ 1. Gắn thiết   │ │ 2. Cắm nguồn   │ │ 3. Hệ thống    │ │ 4. Dữ liệu hiện ngay trên ││
│ │ bị công trình  │ │ USB 5V         │ │ tự nhận diện   │ │ Bản đồ & Bàn làm việc     ││
│ └────────────────┘ └────────────────┘ └────────────────┘ └───────────────────────────┘│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PHẦN 2: BÀN ĐIỀU HÀNH TRẠM ĐO                                                          │
│ [Mã: DG-HCM-001]  [● Đang trực tuyến]                                                  │
│ Trạm Đo Bụi Cổng Chính — Khu đô thị An Phú                                             │
│ Vị trí: P. An Phú, TP. Thuận An, Bình Dương · Cảm biến đo hạt quang học                │
│                                                                                        │
│ CỤM NÚT THỬ NGHIỆM 1-CHẠM:                                                             │
│ [⚡ Gửi số đo an toàn (22-34 µg)]    [⚠ Mô phỏng bụi cao (>75 µg/m³ - Cảnh báo)]        │
│                                                                                        │
│ 4 THẺ CHỈ SỐ ĐO ĐẠC THỜI GIAN THỰC:                                                    │
│ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌─────────────────────┐ │
│ │ Bụi mịn PM2.5    │ │ Bụi tổng PM10    │ │ Nhiệt độ / Độ ẩm │ │ Kiểm tra dữ liệu    │ │
│ │ 24.5 µg/m³       │ │ 48.2 µg/m³       │ │ 29.4°C / 68%     │ │ 100% HỢP LỆ         │ │
│ │ (● Mức an toàn)  │ │ (● Bình thường)  │ │ (Cảm biến chuẩn) │ │ (Đã kiểm tra mã số) │ │
│ └──────────────────┘ └──────────────────┘ └──────────────────┘ └─────────────────────┘ │
│                                                                                        │
│ ℹ Lưu ý: Cảm biến là tín hiệu cảnh báo sớm, cần kết hợp ảnh thực tế trước khi xử lý.    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PHẦN 3: BẢNG NHẬT KÝ SỐ ĐO GẦN NHẤT                                                    │
│ ┌──────────────┬───────────────┬───────────────┬──────────────┬─────────────┬────────┐ │
│ │ Thời gian    │ PM2.5 (µg/m³) │ PM10 (µg/m³)  │ Nhiệt / Ẩm   │ Mã kiểm tra │ Đánh giá│ │
│ ├──────────────┼───────────────┼───────────────┼──────────────┼─────────────┼────────┤ │
│ │ 12:25:30     │ 82.5          │ 115.0         │ 29.4°C / 68% │ auth_9a2f...│ CẢNH BÁO│ │
│ │ 12:20:30     │ 24.5          │ 48.2          │ 29.4°C / 68% │ auth_1b8c...│ An toàn│ │
│ │ 12:15:30     │ 27.2          │ 51.0          │ 29.4°C / 68% │ auth_6c4d...│ An toàn│ │
│ │ 12:10:30     │ 23.8          │ 47.5          │ 29.4°C / 68% │ auth_3e1a...│ An toàn│ │
│ └──────────────┴───────────────┴───────────────┴──────────────┴─────────────┴────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & Kết Nối Hệ Thống

### 5.1. Dữ liệu gửi và nhận qua máy chủ
1. **Lấy dữ liệu và lịch sử trạm đo**: Tải thông tin trạm `DG-HCM-001` và danh sách các lần đo gần nhất.
2. **Gửi số đo thử nghiệm**:
   - Khi bấm nút mô phỏng, hệ thống gửi các chỉ số (PM2.5, PM10, Nhiệt độ, Độ ẩm, Thời gian) lên máy chủ và lưu vào cơ sở dữ liệu thật.

### 5.2. Chế độ dự phòng khi mất kết nối mạng
- Nếu đường truyền mạng tạm thời gián đoạn trong lúc đang thuyết trình, hệ thống tự động sinh số đo dao động tự nhiên theo nhịp sóng thực tế.
- Đảm bảo buổi xem thử của Ban giám khảo luôn diễn ra mượt mà, không bao giờ bị đơ hay báo lỗi trắng trang.

---

## 6. Danh Sách Nút Bấm & Thao Tác

| Nút bấm / Thao tác | Vị trí | Màu sắc | Kích thước | Hành động khi bấm |
|---|---|---|:---:|---|
| **[⚠ Mô phỏng bụi cao (>75)]** | Khung điều hành | Nền đỏ nhạt, viền đỏ, chữ đỏ son | Chiều cao 44px | Gửi số đo PM2.5 = 82.5 µg/m³, thẻ chỉ số chuyển sang màu đỏ cảnh báo |
| **[⚡ Gửi số đo an toàn]** | Khung điều hành | Nền kem sáng, viền xám, icon vàng | Chiều cao 44px | Gửi số đo PM2.5 an toàn (22-34 µg/m³), thẻ chỉ số chuyển sang màu xanh ngọc |
| **[+ Lắp đặt 3 bước]** | Thanh trên cùng | Nền đỏ son hoặc xanh ngọc, chữ trắng | Chiều cao 44px | Mở hộp thoại hướng dẫn cấu hình trạm đo mới trong 3 bước |
| **[Làm mới] (↻)** | Góc phải thanh trên cùng | Nền trắng viền nhạt, icon xoay | Chiều cao 40px | Tải lại các số đo mới nhất từ hệ thống |
| **[← Quay lại Demo Hub]** | Góc trái thanh trên cùng | Chữ xám đậm, icon mũi tên | Chiều cao 44px | Quay lại Trung tâm Trải nghiệm `/demo` |

---

## 7. Tiêu Chuẩn Giao Diện & Hiển Thị Đa Thiết Bị

### 7.1. Màu sắc và font số (Sáng rõ, dễ quan sát)
- **Nền trang**: Màu kem sáng `#FDFBF7` chống lóa mắt khi xem lâu.
- **Thẻ nội dung**: Nền trắng `#FFFFFF`, bo góc 16px gọn gàng, viền xám mỏng sắc nét.
- **Font số đo**: Dùng font số to rõ, số liệu cố định vị trí không bị nhảy chữ khi cập nhật.
- **Màu trạng thái**:
  - Mức an toàn: Màu xanh ngọc dịu mát.
  - Mức cảnh báo: Màu đỏ son nổi bật, dễ nhận biết.
- **Quy tắc bất biến**: Tuyệt đối **không dùng hiệu ứng kính mờ (glassmorphism)**, đảm bảo độ tương phản cao nhất.

### 7.2. Hiển thị trên các loại màn hình
- **Điện thoại (360px – 430px)**:
  - 4 Thẻ chỉ số tự động xếp thành lưới 2 hàng $\times$ 2 cột tiện nhìn.
  - 2 Nút bấm mô phỏng dàn đều toàn màn hình, ngón tay cái chạm cực kỳ dễ dàng.
  - Bảng nhật ký hỗ trợ vuốt ngang nhẹ nhàng không làm xô lệch trang.
- **Laptop 14-inch (1366x768 & 1440x900)**:
  - 4 Thẻ chỉ số dàn đều 4 cột trên 1 hàng ngang, toàn bộ thao tác vừa vặn trong 1 màn hình.
- **Màn hình lớn (1920x1080)**:
  - Nội dung căn giữa trang nhã, cân đối.

---

## 8. Xử Lý Lỗi & Tình Huống Thực Tế

### 8.1. Các tình huống thường gặp và cách xử lý
1. **Bấm nút mô phỏng nhiều lần liên tiếp**:
   - *Cách xử lý*: Hệ thống tạm thời khóa nút trong 1 giây khi đang gửi dữ liệu để tránh gửi trùng lặp yêu cầu lên máy chủ.
2. **Hiểu nhầm cảm biến là kết luận xử phạt ngay**:
   - *Cách xử lý*: Có khung ghi chú rõ ràng nhắc nhở số liệu cảm biến là cơ sở phát hiện sớm, cần kết hợp ảnh thực tế để cán bộ lập biên bản.
3. **Mạng chập chờn khi đang thuyết trình**:
   - *Cách xử lý*: Tự động chuyển sang chế độ hiển thị dự phòng, đảm bảo giao diện luôn mượt mà.

### 8.2. Lệnh kiểm tra hệ thống nhanh bằng PowerShell (< 0.5s)
```powershell
# 1. Kiểm tra việc thiết lập trạm đo và trạng thái hoạt động
node --test app/tests/iot-node-setup-and-status-lifecycle.test.js

# 2. Kiểm tra tính toàn vẹn của chuỗi số đo cảm biến
node --test app/tests/iot-telemetry-r2-integrity.test.js

# 3. Kiểm tra toàn bộ hoạt động của phân hệ trạm đo
node --test app/tests/iot-operational-flow-auditor.test.js
```
