# PUB-04 — Cẩm Nang Tự Ráp Trạm Đo Bụi Giá Rẻ & Chống Số Liệu Giả Mạo (Sensor DIY Guide)

---

## 1. Định Danh Màn Hình (Screen Identity)

| Thuộc tính | Chi tiết |
|---|---|
| **Mã màn hình** | `PUB-04` |
| **Tên tiếng Việt** | Cẩm Nang Tự Ráp Trạm Đo Bụi Giá Rẻ & Chống Giả Mạo Số Liệu |
| **Tên tiếng Anh** | Open Sensor DIY Hardware Guide & Data Verification Protocol |
| **Đường dẫn (URL)** | `/guide` (hỗ trợ chuyển hướng từ `/docs/sensor-guide`) |
| **Tập tin mã nguồn chính** | `app/src/modules/public/SensorGuide.jsx` |
| **Bố cục giao diện** | Khung trang đọc tài liệu hướng dẫn (Có menu trên cùng, khung đọc bài viết và chân trang) |
| **Quyền truy cập** | Mở công khai cho mọi người (Sinh viên, kỹ sư điện tử, câu lạc bộ sáng tạo, nhà thầu thi công) |
| **Trạng thái vận hành** | **Đang hoạt động ổn định** (Có sẵn bảng dự toán mua linh kiện chợ điện tử Việt Nam và đoạn mã mẫu nạp cho mạch ESP32) |

---

## 2. Mục Đích Nghiệp Vụ & Giá Trị Thực Tế

Trang **PUB-04** là cẩm nang hướng dẫn tự chế tạo trạm đo bụi chi phí thấp và cơ chế bảo vệ tính trung thực của dữ liệu đo, giải quyết 3 bài toán lớn tại Việt Nam:

1. **Phổ cập trạm đo chi phí siêu rẻ (~500.000 VNĐ) từ linh kiện chợ truyền thống**:
   - Các trạm quan trắc tự động nhập khẩu có giá từ **50 đến 200 triệu VNĐ/trạm**, dẫn đến việc số lượng trạm quá ít ỏi và không thể giám sát hàng nghìn công trường đang thi công tại Hà Nội và TP.HCM.
   - DustGuard VN cung cấp bản vẽ và hướng dẫn tự ráp trạm đo hoàn chỉnh với chi phí chỉ khoảng **500.000 – 580.000 VNĐ**, dễ dàng mua tại các chợ linh kiện điện tử quen thuộc của Việt Nam:
     - **Chợ Nhật Tảo** (Đường Nhật Tảo, Phường 7, Quận 10, TP.HCM).
     - **Chợ Trời Thịnh Yên / Phố Huế** (Phường Phố Huế, Quận Hai Bà Trưng, Hà Nội).
     - Hoặc đặt mua online qua các sàn thương mại điện tử trong nước.
2. **Bảng dự toán linh kiện chi tiết & Nơi mua tại Việt Nam**:

| STT | Tên linh kiện | Thông số cơ bản | Nơi mua phổ biến | Giá tham khảo (VNĐ) |
|:---:|---|---|---|:---:|
| 1 | **Mạch vi điều khiển ESP32** | Có sẵn Wi-Fi và Bluetooth, bộ nhớ 4MB | Chợ Nhật Tảo / Chợ Trời | 85.000 – 95.000 |
| 2 | **Cảm biến bụi Laser Plantower PMS7003** | Đo nồng độ bụi PM2.5, PM10 bằng tia laser | Cửa hàng linh kiện điện tử | 330.000 – 360.000 |
| 3 | **Cảm biến nhiệt độ & độ ẩm SHT30** | Đo độ ẩm không khí để bù sai số khi trời mưa ẩm | Chợ Nhật Tảo / Chợ Trời | 45.000 – 55.000 |
| 4 | **Hộp nhựa chống nước ngoài trời** | Hộp kín chuẩn IP65 kèm khe chớp thoát khí | Chợ điện dân dụng | 35.000 – 45.000 |
| 5 | **Củ nguồn 5V-2A & Cáp sắm** | Nguồn điện cắm 220V ra 5V, dây dài 1.5m | Cửa hàng điện thoại / điện tử | 35.000 – 40.000 |
| 6 | **Dây cắm & keo dán chống nước** | Dây cắm mạch, đai xiết inox, keo dán silicon | Chợ dân sinh | 10.000 – 15.000 |
| **Tổng** | **Trọn bộ 01 Trạm đo bụi DustGuard tự ráp** | **Chạy liên tục 24/7 ngoài trời** | **Linh kiện phổ thông VN** | **≈ 540.000 – 610.000 VNĐ** |

3. **Mã xác thực chữ ký trạm đo chống làm giả số liệu**:
   - Ngăn chặn việc ai đó dùng phần mềm máy tính gửi số đo giả để "làm đẹp" chỉ số môi trường quanh công trường.
   - Mỗi trạm đo khi xuất xưởng được nạp một mã bí mật riêng vào chip ESP32. Mỗi khi gửi số liệu về máy chủ, chip sẽ tự động đính kèm mã chữ ký xác thực. Nếu số liệu bị sửa đổi giữa đường, máy chủ sẽ phát hiện và từ chối ngay lập tức.
4. **Thuật toán phát hiện cảm biến bị kẹt số hoặc bị che**:
   - **Phát hiện đứng số / kẹt số**: Ngoài tự nhiên, nồng độ bụi luôn thay đổi liên tục theo luồng gió. Nếu 5 lần liên tiếp gửi về cùng một con số cố định (ví dụ liên tục $5.0\,\mu\text{g/m}^3$), hệ thống xác định cảm biến đang bị bịt kín hoặc bụi đóng cục làm kẹt buồng đo $\rightarrow$ Hệ thống lập tức gắn cờ cảnh báo *Nghi ngờ hỏng hóc/bị che* để người đi kiểm tra.
   - **Cảnh báo mất tín hiệu**: Nếu trạm bị mất điện hoặc mất Wi-Fi quá 15 phút $\rightarrow$ Tự động chuyển sang trạng thái *Mất kết nối*. Khi có điện lại, trạm tự động kết nối và hoạt động bình thường.
5. **Bảng chấm điểm tin cậy số liệu đo**:
   - **Đang chạy tốt (100% tin cậy)**: Số liệu gửi đều đặn, chính xác, dùng để đánh giá mức độ bụi.
   - **Mất kết nối (50% tin cậy)**: Quá 15 phút chưa nhận được tin, cần kiểm tra lại nguồn điện và Wi-Fi.
   - **Báo lỗi / Nghi ngờ kẹt số (0% tin cậy)**: Tạm thời không dùng số liệu này cho đến khi có người ra kiểm tra lại trạm đo.
6. **Hướng dẫn vị trí lắp đặt an toàn ngoài thực tế**:
   - Chiều cao lắp đặt chuẩn: **2.5m – 3.5m** (vừa tầm thở của người đi đường, tránh bị vòi xịt rửa bánh xe công trường phun nước trực tiếp vào miệng hút gió).
   - Vị trí khuyến nghị: 1 trạm đặt tại cổng chính nơi xe chở đất ra vào và 1 trạm đặt tại hướng gió thổi về phía trường học / khu dân cư gần nhất.

---

## 3. Đối Tượng Người Dùng & Hành Trình Thao Tác (User Journey)

```text
[Sinh viên / Kỹ sư IoT / Maker truy cập trang /guide]
                        │
                        ▼
       [1. Đọc tư duy giải pháp: Vừa đo bụi, vừa có người đi kiểm tra]
                        │
                        ▼
       [2. Xem Bảng dự toán linh kiện Chợ Nhật Tảo / Chợ Trời]
                        │
                        ▼
       [3. Bấm [📋 Sao chép mã] lấy đoạn mã mẫu C++ cho ESP32]
                        │
                        ▼
       [4. Hiểu thuật toán phát hiện cảm biến bị che đậy hoặc kẹt số]
                        │
                        ▼
       [5. Đọc hướng dẫn lắp đặt thực tế ở độ cao 2.5m - 3.5m]
                        │
                        ▼
       [6. Bấm [Quay lại Trang chủ] hoặc [Xem thử nghiệm trạm đo]]
```

---

## 4. Bố Cục Giao Diện & Khung Dây Wireframe Chi Tiết

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ THANH TRÊN CÙNG: [← Quay lại Trang chủ]                    [● TÀI LIỆU HƯỚNG DẪN V1.0] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ TIÊU ĐỀ TÀI LIỆU:                                                                      │
│ [ Phần Cứng Mở & Đo Bụi Thực Tế ]                                                      │
│ Cẩm Nang Tự Ráp Trạm Đo Bụi & Cơ Chế Chống Làm Giả Số Liệu                             │
│ (Bản vẽ trạm đo ~500k VNĐ, nạp mã tự động và phát hiện kẹt số)                         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ KHỐI 1: TƯ DUY GIẢI PHÁP: KẾT HỢP TRẠM ĐO VÀ NGƯỜI THỰC ĐỊA                            │
│ ┌────────────────────────────────────────┐ ┌────────────────────────────────────────┐ │
│ │ [ĐO BỤI TỰ ĐỘNG]                       │ │ [CHỐNG GIAN LẬN & MINH BẠCH]           │ │
│ │ • Đo nồng độ PM2.5 và PM10 liên tục    │ │ • Chữ ký xác thực từ chip ESP32        │ │
│ │ • So sánh với chuẩn QCVN 05:2023       │ │ • Tự phát hiện cảm biến bị che/kẹt số  │ │
│ │ • Cảnh báo khi bụi > 50 µg/m³          │ │ • Bảng điểm tin cậy số liệu công khai  │ │
│ └────────────────────────────────────────┘ └────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ KHỐI 2: ĐOẠN MÃ MẪU C++ NẠP CHO MẠCH ESP32                                             │
│ • Cổng tiếp nhận dữ liệu: POST /api/sensors/reading                                    │
│ • Mã xác thực đính kèm trong gói tin gửi về                                            │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ [MÃ NGUỒN C++ CHO ARDUINO / ESP32]                                [📋 Sao chép mã] │ │
│ │ #include <Crypto.h>                                                                │ │
│ │ String secretKey = "dustguard_secret_key_2026";                                    │ │
│ │ String sensorCode = "SEN-HN0102";                                                  │ │
│ │ float pm25 = 84.5; float pm10 = 168.0;                                             │ │
│ │ String payload = sensorCode + String(pm10, 1) + String(pm25, 1);                   │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ KHỐI 3: PHÁT HIỆN CẢM BIẾN BỊ KẸT SỐ HOẶC MẤT KẾT NỐI                                  │
│ ┌────────────────────────────────────────┐ ┌────────────────────────────────────────┐ │
│ │ THẺ 1: CẢM BIẾN BỊ ĐỨNG SỐ (KẸT BỤI)   │ │ THẺ 2: TRẠM ĐO BỊ MẤT KẾT NỐI (MẤT ĐIỆN)│ │
│ │ 5 Lần liên tiếp số đo không thay đổi   │ │ Quá 15 phút không nhận được số liệu    │ │
│ │ → Chuyển sang BÁO LỖI (0% tin cậy)     │ │ → Chuyển sang MẤT KẾT NỐI (50% tin cậy)│ │
│ └────────────────────────────────────────┘ └────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ KHỐI 4: BẢNG CHẤM ĐIỂM TIN CẬY SỐ LIỆU ĐO                                              │
│ ┌───────────┬─────────────┬──────────────────────────┬───────────────────────────────┐ │
│ │ Trạng thái│ Điểm tin cậy│ Đánh giá của hệ thống    │ Việc cần làm                  │ │
│ ├───────────┼─────────────┼──────────────────────────┼───────────────────────────────┤ │
│ │ ĐANG CHẠY │ 100%        │ Số liệu tốt, dùng để đánh│ Tiếp tục theo dõi bình thường │ │
│ │ (ACTIVE)  │             │ giá mức độ bụi           │                               │ │
│ ├───────────┼─────────────┼──────────────────────────┼───────────────────────────────┤ │
│ │ MẤT KẾT   │ 50%         │ Cảnh báo trạm đo có thể  │ Kiểm tra lại củ nguồn điện    │ │
│ │ NỐI       │             │ bị ngắt điện hoặc mất mạng│ và sóng Wi-Fi tại công trường │ │
│ ├───────────┼─────────────┼──────────────────────────┼───────────────────────────────┤ │
│ │ BÁO LỖI   │ 0%          │ Tạm thời không dùng số   │ Cử tình nguyện viên ra lau sạch││
│ │ (FAULTY)  │             │ liệu này để tính điểm    │ buồng laser và kiểm tra vỏ hộp│ │
│ └───────────┴─────────────┴──────────────────────────┴───────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ KHỐI 5: QUY TẮC LẮP ĐẶT THỰC TẾ NGOÀI CÔNG TRƯỜNG                                      │
│ • Quy tắc 1: Đặt 2 trạm/công trường (1 trạm ở cổng chính xe ben, 1 trạm ở hướng gió).  │
│ • Quy tắc 2: Chiều cao chuẩn 2.5m - 3.5m (vừa tầm thở, tránh vòi rửa xe xịt vào).      │
│ • Quy tắc 3: Dùng hộp nhựa có khe chớp chống mưa tạt và cố định chắc chắn vào cột.     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ CHÂN TRANG: [Logo DustGuard] © 2026 DustGuard VN              [Cuộn lên đầu trang ↑]   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & Nguồn Thông Tin Cần Quản Lý

### 5.1. Dữ liệu tiếp nhận từ trạm đo gửi về:
- **Đường dẫn**: `POST /api/sensors/reading`
- **Gói tin gửi về máy chủ**:
```json
{
  "sensorCode": "SEN-HN0102",
  "pm25": 84.5,
  "pm10": 168.0,
  "temperature": 29.4,
  "humidity": 68.0,
  "timestamp": 1781162129000
}
```

### 5.2. Các trường thông tin quản lý trạm đo:
- `Mã trạm đo`: Ví dụ `SEN-HN0102`.
- `Công trình gắn trạm`: Ví dụ *Tòa nhà Grand Park*.
- `Chỉ số bụi PM2.5 & PM10`: Số đo nồng độ bụi thực tế.
- `Trạng thái trạm`: *Đang chạy*, *Mất kết nối*, hoặc *Báo lỗi*.
- `Điểm tin cậy`: $100\%$, $50\%$, hoặc $0\%$.
- `Thời gian gửi tin gần nhất`: Mốc giờ máy chủ nhận được số liệu.

---

## 6. Bảng Danh Mục Nút Bấm & Thao Tác Cốt Lõi

| Tên nút / Thao tác | Vị trí | Màu sắc & Kiểu nút | Kích thước nút bấm | Bấm vào thì làm gì | Hiển thị phản hồi |
|---|---|---|:---:|---|---|
| **[📋 Sao chép mã]** | Góc trên khung mã nguồn C++ | Nền đen, chữ xanh ngọc sáng | $\ge 40\text{px}$ | Sao chép toàn bộ đoạn mã C++ vào bộ nhớ tạm | Đổi nhãn thành *"Đã sao chép!"* trong 2 giây |
| **[← Quay lại Trang chủ]** | Thanh menu trên cùng góc trái | Chữ đen xám, hover đỏ son | $\ge 44\text{px}$ | Quay trở về trang chủ `/` | Chuyển trang mượt mà |
| **[Cuộn lên đầu trang ↑]** | Chân trang góc phải | Chữ đen xám, hover đỏ son | $\ge 44\text{px}$ | Cuộn màn hình trở lại đầu trang | Màn hình lướt nhẹ nhàng lên đỉnh |
| **[Xem thử nghiệm trạm đo]** | Cuối tài liệu hướng dẫn | Nền đỏ son `#9f241f`, chữ trắng | $\ge 44\text{px}$ | Mở trang mô phỏng hoạt động trạm đo `/demo/iot` | Chuyển tới màn hình thử nghiệm |

---

## 7. Quy Chuẩn Giao Diện & Thích Ứng Màn Hình (Responsive)

### 7.1. Bảng màu sáng, dễ đọc tài liệu kỹ thuật
- **Nền trang đọc tài liệu**: Màu kem nhạt `#FDFBF7` (`bg-cream-50`), mắt không bị mỏi khi đọc lâu.
- **Màu chữ văn bản**: Mực đen đậm `#231b14` (`text-ink-900`), chữ to rõ ràng.
- **Khung chứa mã C++**: Nền đen xám `#1c1917`, kiểu chữ lập trình dễ nhìn, cho phép cuộn ngang độc lập để không làm vỡ giao diện.
- **Tuyệt đối KHÔNG dùng hiệu ứng làm mờ nền (Glassmorphism)**.

### 7.2. Tương thích trên các thiết bị:
- **Điện thoại di động (360px – 430px)**:
  - Khung bài viết tự co dãn vừa vặn màn hình.
  - Khung mã nguồn C++ cho phép lướt ngón tay cuộn ngang thoải mái.
  - Bảng dự toán linh kiện tự động co dãn dễ nhìn.
- **Laptop 14-inch (1366x768 & 1440x900)**:
  - Giới hạn chiều rộng văn bản ở mức vừa phải để mắt không phải đảo quá xa khi đọc từng dòng.
- **Máy tính lớn (1920x1080)**:
  - Bố cục căn giữa trang nhã, các khối hình ảnh và bảng biểu cân đối.

---

## 8. Các Tình Huống Thực Tế & Lệnh Kiểm Tra Nhanh

### 8.1. Các tình huống thực tế thường gặp và cách xử lý:
1. **Lỗi sai lệch giờ giữa mạch ESP32 và máy chủ**:
   - *Tình huống*: Mạch ESP32 đếm giờ theo giây, trong khi máy chủ tính theo mili-giây.
   - *Cách xử lý*: Quy chuẩn thống nhất đổi hết sang mili-giây trước khi gửi đi.
2. **Cảm biến bị kẹt bụi sau vài tháng ngoài trời**:
   - *Tình huống*: Bụi xi măng hoặc côn trùng nhỏ lọt vào buồng laser làm kẹt số đo.
   - *Cách xử lý*: Thuật toán phát hiện kẹt số sẽ tự động đổi trạng thái sang *Báo lỗi* và nhắc đội tình nguyện ra dùng bóng xịt khí vệ sinh lại buồng đo.
3. **Mất kết nối Wi-Fi tại công trường**:
   - *Tình huống*: Công trường mất điện ban đêm hoặc ngắt router Wi-Fi.
   - *Cách xử lý*: Trạm đo tự động lưu số liệu tạm thời và gửi lại ngay khi có sóng trở lại.

### 8.2. Lệnh kiểm tra nhanh trên máy tính qua PowerShell (< 0.5s):
```powershell
# 1. Kiểm tra vòng đời trạng thái hoạt động của trạm đo
node --test app/tests/iot-node-setup-and-status-lifecycle.test.js

# 2. Kiểm tra tính toàn vẹn của số liệu đo và thuật toán phát hiện kẹt số
node --test app/tests/iot-telemetry-r2-integrity.test.js

# 3. Kiểm tra toàn bộ luồng vận hành của phân hệ trạm đo
node --test app/tests/iot-operational-flow-auditor.test.js
```
