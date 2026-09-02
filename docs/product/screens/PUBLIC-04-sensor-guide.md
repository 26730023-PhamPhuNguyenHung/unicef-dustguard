# PUB-04 — Cẩm Nang Tự Chế Tạo Trạm Đo Bụi & Chống Gian Lận Dữ Liệu (Sensor DIY Guide & Anti-Fraud Protocol)

---

## 1. Screen Identity

| Thuộc tính | Giá trị SSOT |
|---|---|
| **Mã màn hình** | `PUB-04` |
| **Tên tiếng Việt** | Cẩm Nang Tự Chế Tạo Trạm Đo Bụi & Chống Gian Lận Dữ Liệu |
| **Tên tiếng Anh** | Open Sensor DIY Hardware Guide & Cryptographic Anti-Fraud Protocol |
| **Route URL** | `/guide` (Hỗ trợ URL redirect: `/docs/sensor-guide`) |
| **Component Path** | `app/src/modules/public/SensorGuide.jsx` |
| **Layout** | Public Document Reader Layout (Sticky Navigation Header + Document Reader Container + Footer) |
| **Quyền truy cập (Role)** | Public / Guest / Sinh viên / CLB Maker / Đơn vị quan trắc / Nhà thầu (Không yêu cầu đăng nhập) |
| **Trạng thái Triển khai** | **ACTIVE** (Level 5 Production Coherent — Đầy đủ đặc tả HMAC-SHA256 & Code mẫu C++ ESP32) |

---

## 2. Mục Đích Nghiệp Vụ & Giá Trị Thực Tế

Trang **PUB-04** là cẩm nang phần cứng mở (Open-Source Environmental Hardware Guide) và quy chuẩn mã hóa dữ liệu độc quyền của DustGuard VN, giải quyết 3 bài toán sống còn tại Việt Nam:

1. **Phổ cập trạm đo chi phí siêu thấp (~500.000 VNĐ) từ linh kiện chợ truyền thống**:
   - Các trạm quan trắc tự động nhập khẩu của nhà nước có chi phí từ **50 đến 200 triệu VNĐ/trạm**, dẫn đến việc số lượng trạm quá ít ỏi và không thể giám sát hàng nghìn công trường xây dựng đang thi công tại Hà Nội và TP.HCM.
   - DustGuard VN cung cấp thiết kế trạm đo mở hoàn chỉnh với tổng chi phí vật tư chỉ khoảng **500.000 – 580.000 VNĐ**, mua dễ dàng tại các chợ linh kiện điện tử nổi tiếng của Việt Nam:
     - **Chợ Nhật Tảo** (Đường Nhật Tảo, Phường 7, Quận 10, TP.HCM).
     - **Chợ Trời Thịnh Yên / Phố Huế** (Phường Phố Huế, Quận Hai Bà Trưng, Hà Nội).
     - Hoặc đặt trực tiếp qua các sàn TMĐT trong nước.
2. **Bảng dự toán linh kiện chi tiết (Bill of Materials - BOM)**:

| STT | Tên linh kiện | Thông số kỹ thuật | Xuất xứ / Nơi mua | Đơn giá tham khảo (VNĐ) |
|:---:|---|---|---|:---:|
| 1 | **Vi điều khiển ESP32 NodeMCU V3** | Chip kép Tensilica Xtensa 240MHz, 4MB Flash, Wi-Fi 2.4GHz + BLE | Chợ Nhật Tảo / Chợ Trời | 85.000 – 95.000 |
| 2 | **Cảm biến bụi Laser Plantower PMS7003** | Đo nồng độ PM1.0, PM2.5, PM10 bằng tán xạ laser ($0.3 - 10\,\mu\text{m}$) | Cửa hàng linh kiện IoT | 330.000 – 360.000 |
| 3 | **Cảm biến nhiệt độ & độ ẩm Sensirion SHT30** | Giao tiếp I2C, sai số $\pm 0.3^\circ\text{C}$, $\pm 2\%$ RH, có màng lọc ẩm | Chợ Nhật Tảo / Chợ Trời | 45.000 – 55.000 |
| 4 | **Hộp nhựa kỹ thuật ABS chống nước** | Chuẩn IP65, kích thước $158 \times 90 \times 60\,\text{mm}$ kèm chớp thông khí Louver | Chợ điện dân dụng | 35.000 – 45.000 |
| 5 | **Bộ nguồn 5V-2A & Cáp MicroUSB/Type-C** | Nguồn ổn áp DC 5V, dây bọc chống nhiễu dài 1.5m | Cửa hàng điện tử | 35.000 – 40.000 |
| 6 | **Dây nối Dupont & phụ kiện cố định** | Dây cắm cái-cái, đai xiết inox, keo silicon dán chống nước | Chợ dân sinh | 10.000 – 15.000 |
| **Tổng** | **Trọn bộ 01 Trạm đo thực nghiệm DustGuard Node** | **Hoạt động 24/7 ngoài trời** | **Linh kiện phổ thông VN** | **≈ 540.000 – 610.000 VNĐ** |

3. **Cơ chế xác thực chữ ký mã hóa phần cứng (HMAC-SHA256 Anti-Spoofing)**:
   - Ngăn chặn triệt để hành vi dùng công cụ phần mềm (Postman, cURL, Python script) để giả mạo số liệu nhằm "làm đẹp" chỉ số môi trường xung quanh công trường.
   - Mỗi node được nạp một khóa bí mật (**Secret Key**) vào bộ nhớ flash không khả biến (NVS/EEPROM) của chip ESP32 khi xuất xưởng. Khi phát sinh dữ liệu, vi điều khiển tính mã băm HMAC-SHA256 và gửi kèm trong Header `X-Sensor-Signature`.
4. **Thuật toán kiểm toán đóng băng dữ liệu (Flatline & Staleness Audit)**:
   - **Phát hiện đứng số (Flatline Detection)**: Trong môi trường tự nhiên, nồng độ bụi luôn dao động liên tục theo luồng gió. Nếu 5 bản ghi liên tiếp hoàn toàn trùng khớp một giá trị cố định (ví dụ liên tục $5.0\,\mu\text{g/m}^3$), hệ thống xác định cảm biến đang bị bịt kín hoặc hư hỏng buồng đo quang học $\rightarrow$ Lập tức chuyển sang trạng thái `FAULTY` và tạo log `SENSOR_TAMPER_SUSPECTED`.
   - **Giám sát mất tín hiệu (Staleness Timeout)**: Nếu trạm bị mất điện hoặc mất kết nối mạng quá 15 phút $\rightarrow$ Tự động chuyển sang `INACTIVE`. Tự phục hồi về `ACTIVE` ngay khi nhận được bản tin hợp lệ tiếp theo.
5. **Minh bạch hóa Điểm tin cậy dữ liệu (Data Reliability Score)**:
   - `ACTIVE` (Trực tuyến & Hợp lệ) = **100%** (Số liệu có giá trị tham chiếu cao).
   - `INACTIVE` (Mất tín hiệu quá 15 phút) = **50%** (Cần kiểm tra nguồn và kết nối).
   - `FAULTY` (Nghi ngờ can thiệp hoặc đứng số) = **0%** (Bị loại trừ khỏi thuật toán tính điểm rủi ro $R$).
6. **Quy chuẩn lắp đặt thực địa bảo vệ thiết bị (Field Hardening Guidelines)**:
   - Hướng dẫn sinh viên và đơn vị thi công vị trí lắp đặt an toàn: Chiều cao chuẩn **2.5m – 3.5m** (khoảng thở sinh học của con người, tránh bị vòi xịt nước rửa bánh xe công trường phun trực diện vào cửa hút gió).
   - Mật độ tối thiểu 2 trạm/công trường: 1 trạm tại cổng chính xe tải ben ra vào và 1 trạm tại cuối hướng gió thổi về phía khu dân cư / trường học lân cận.

---

## 3. Luồng Hành Trình Người Dùng (User Journey)

```text
[Sinh viên / Kỹ sư IoT / Maker truy cập /guide]
                      │
                      ▼
       [1. Đọc Triết lý MVP vs. Đổi Mới Thực Sự]
                      │
                      ▼
       [2. Xem Bảng BOM linh kiện Chợ Nhật Tảo / Chợ Trời]
                      │
                      ▼
       [3. Sao chép Mã nguồn mẫu C++ ESP32 (1-Chạm)]
                      │
                      ▼
       [4. Hiểu Thuật toán Phát hiện Che đậy & Đứng số (Flatline)]
                      │
                      ▼
       [5. Đối chiếu Bảng Điểm tin cậy & Quy chuẩn Lắp đặt 2.5 - 3.5m]
                      │
                      ▼
       [6. Bấm [Quay lại Trang chủ] hoặc [Đến trang Giả lập IoT /demo/iot]]
```

---

## 4. Bố Cục Trực Quan & Wireframe ASCII (Information Hierarchy)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ STICKY HEADER: [← Quay lại Trang chủ]                       [● TÀI LIỆU CHÍNH THỨC V1.0]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ DOCUMENT HEADER:                                                                       │
│ [ IoT & Data Integrity ]                                                               │
│ Cẩm Nang Tự Chế Tạo Trạm Đo Bụi & Cơ Chế Chống Gian Lận Dữ Liệu                         │
│ (Đặc tả phần cứng mở ~500k VNĐ, nạp firmware HMAC-SHA256 và thuật toán Flatline)      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 1: Tư Duy Giải Pháp: MVP vs. Đổi Mới Thực Sự                                   │
│ ┌────────────────────────────────────────┐ ┌────────────────────────────────────────┐ │
│ │ [TẦNG MVP] Vận Hành Cơ Bản             │ │ [TẦNG ĐỔI MỚI] Chống Gian Lận & Minh   │ │
│ │ • Thu thập PM2.5/PM10 trực tiếp        │ │ • Chữ ký số HMAC từ phần cứng ESP32    │ │
│ │ • Đối chiếu chuẩn QCVN 05:2023/BTNMT   │ │ • Thuật toán phát hiện che đậy/đứng số │ │
│ │ • Cảnh báo khi PM2.5 > 50 µg/m³        │ │ • Tính điểm tin cậy dữ liệu công khai  │ │
│ └────────────────────────────────────────┘ └────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 2: Xác Thực Chữ Ký Mã Hóa Phần Cứng (HMAC-SHA256)                              │
│ • Bảng tham số kết nối API: POST /api/sensors/reading                                  │
│ • Header bắt buộc: X-Sensor-Signature: [hmac-sha256-hex]                               │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ [MÃ NGUỒN C++ ARDUINO / ESP32]                                    [📋 Sao chép mã] │ │
│ │ #include <Crypto.h>                                                                │ │
│ │ #include <SHA256.h>                                                                │ │
│ │ String secretKey = "dustguard_secret_key_2026";                                    │ │
│ │ String sensorCode = "SEN-HN0102";                                                  │ │
│ │ float pm25 = 84.5; float pm10 = 168.0;                                             │ │
│ │ String payload = sensorCode + String(pm10, 1) + String(pm25, 1) + ...              │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 3: Thuật Toán Phát Hiện Che Đậy & Đóng Băng Dữ Liệu (Flatline Audit)           │
│ ┌────────────────────────────────────────┐ ┌────────────────────────────────────────┐ │
│ │ CARD 1: Đóng Băng Chỉ Số (Flatline)    │ │ CARD 2: Mất Kết Nối (Staleness Timeout)│ │
│ │ 5 Bản ghi liên tiếp không đổi giá trị  │ │ > 15 phút không nhận được bản tin      │ │
│ │ → Chuyển trạng thái FAULTY (0% Điểm)   │ │ → Chuyển trạng thái INACTIVE (50% Điểm)│ │
│ └────────────────────────────────────────┘ └────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 4: Bảng Điểm Tin Cậy Dữ Liệu Công Khai (Data Reliability Matrix)               │
│ ┌───────────┬─────────────┬──────────────────────────┬───────────────────────────────┐ │
│ │ Trạng thái│ Điểm tin cậy│ Tác động hệ thống        │ Hành động khắc phục           │ │
│ ├───────────┼─────────────┼──────────────────────────┼───────────────────────────────┤ │
│ │ ACTIVE    │ 100%        │ Tính điểm rủi ro bình    │ Duy trì truyền tin định kỳ 5p │ │
│ │           │             │ thường (chuẩn QCVN 05)   │                               │ │
│ ├───────────┼─────────────┼──────────────────────────┼───────────────────────────────┤ │
│ │ INACTIVE  │ 50%         │ Cảnh báo mất tín hiệu    │ Kiểm tra nguồn điện và Wi-Fi  │ │
│ ├───────────┼─────────────┼──────────────────────────┼───────────────────────────────┤ │
│ │ FAULTY    │ 0%          │ Loại khỏi tính điểm, ghi │ Cán bộ / CLB đi kiểm tra vỏ hộp││
│ │           │             │ log nghi ngờ gian lận    │ và lau sạch buồng laser       │ │
│ └───────────┴─────────────┴──────────────────────────┴───────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 5: Quy Chuẩn Lắp Đặt & Vận Hành Thực Địa (Mục A, B, C)                         │
│ • Quy tắc A: Bố trí 2 trạm/công trường (Cổng chính xe ben & Cuối hướng gió).           │
│ • Quy tắc B: Chiều cao chuẩn 2.5m - 3.5m (Khoảng thở sinh học, chống vòi xịt rửa xe).  │
│ • Quy tắc C: Hộp nhựa kỹ thuật có louver chống mưa tạt kèm công tắc phát hiện mở trộm. │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ FOOTER: [Logo DustGuard] © 2026 DustGuard VN                 [Cuộn lên đầu trang ↑]    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Hợp Đồng Dữ Liệu & API / D1 Database Contract

### 5.1. Đặc tả API Tiếp Nhận Số Đo (Telemetry Ingestion Endpoint):
- **URL**: `POST /api/sensors/reading`
- **Headers bắt buộc**:
  - `Content-Type: application/json`
  - `X-Sensor-Signature: [chuỗi 64 ký tự hex của HMAC-SHA256]`
- **Request Payload JSON**:
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

### 5.2. Thuật toán Tạo & Kiểm Tra Chữ Ký HMAC-SHA256:
1. **Phía Vi điều khiển ESP32**:
   - Chuỗi thông điệp ghép: `payload = sensorCode + String(pm10, 1) + String(pm25, 1) + String(timestamp)`
   - Tính toán băm: `signature = HMAC_SHA256(SecretKey, payload)`
   - Gửi `signature` dưới dạng hex 64 ký tự vào Header `X-Sensor-Signature`.
2. **Phía Cloudflare Worker / Máy chủ DustGuard**:
   - Truy vấn `secret_key` từ bảng `sensors` theo `sensorCode`.
   - Tính toán lại mã băm với cùng công thức.
   - So sánh hằng số thời gian (`crypto.subtle.verify` hoặc `timingSafeEqual`).
   - Nếu không khớp $\rightarrow$ Trả về mã lỗi `401 Unauthorized` kèm log `INVALID_SENSOR_SIGNATURE`.

### 5.3. Ánh xạ Bảng Cơ sở dữ liệu D1 SQLite (Schema SSOT):
- **Bảng `sensors`**:
  - `id` (TEXT PRIMARY KEY) — Mã định danh trạm (ví dụ: `sen_hn_0102`).
  - `code` (TEXT UNIQUE) — Mã hiệu trạm (ví dụ: `SEN-HN0102`).
  - `site_id` (TEXT) — Mã công trình gắn trạm.
  - `secret_key` (TEXT) — Khóa bí mật đối xứng HMAC.
  - `status` (TEXT) — `ACTIVE` \| `INACTIVE` \| `FAULTY`.
  - `reliability_score` (INTEGER) — Trọng số tin cậy: `100`, `50`, `0`.
  - `last_pm25` (REAL), `last_pm10` (REAL) — Số đo gần nhất.
  - `last_reading_at` (DATETIME) — Thời điểm ghi nhận mới nhất.
- **Bảng `sensor_readings`**:
  - `id` (TEXT PRIMARY KEY), `sensor_id` (TEXT), `pm25` (REAL), `pm10` (REAL), `temperature` (REAL), `humidity` (REAL), `signature` (TEXT), `is_tampered` (INTEGER DEFAULT 0), `created_at` (DATETIME).
- **Bảng `audit_logs`**:
  - Tự động ghi nhận sự kiện `SENSOR_TAMPER_SUSPECTED` khi thuật toán Flatline kích hoạt.

---

## 6. Bảng Danh Mục Hành Động & Nút Bấm (CTAs & Action Matrix)

| Tên nút / Thao tác | Vị trí | Màu sắc / Token | Kích thước Touch Target | Điều kiện kích hoạt | Hành vi hệ thống | Phản hồi giao diện |
|---|---|---|:---:|---|---|---|
| **[📋 Sao chép mã]** | Góc trên khung Code C++ | Nền tối `#1c1917`, chữ xanh mòng két `#2dd4bf` | $\ge 40\text{px}$ | Luôn khả dụng | Gọi `navigator.clipboard.writeText(cppCode)` | Đổi nhãn thành *"Đã sao chép!"* màu xanh teal trong 2 giây |
| **[← Quay lại Trang chủ]** | Sticky Header góc trái | Chữ đen xám `text-ink-700`, hover đỏ son | $\ge 44\text{px}$ | Luôn khả dụng | Điều hướng về trang chủ `/` | Chuyển trang mượt mà |
| **[Cuộn lên đầu trang ↑]** | Chân trang Footer góc phải | Chữ đen xám `text-ink-700`, hover đỏ son | $\ge 44\text{px}$ | Luôn khả dụng | Thực hiện cuộn mượt mà `window.scrollTo({ top: 0, behavior: 'smooth' })` | Màn hình lướt nhẹ nhàng lên đỉnh |
| **[Xem Trình Diễn IoT]** | Liên kết gợi ý cuối tài liệu | Nền đỏ son `#9f241f`, chữ trắng | $\ge 44\text{px}$ | Luôn khả dụng | Chuyển sang không gian thử nghiệm `/demo/iot` | Mở màn hình giả lập telemetry tương tác |

---

## 7. Quy Chuẩn Thích Ứng Giao Diện (Responsive & Design System)

### 7.1. Bảng màu & Typography (Tương phản cao Civic Tech)
- **Nền trang đọc tài liệu**: Màu kem nhạt dịu mắt `#FDFBF7` (`bg-cream-50`).
- **Màu chữ chính**: Mực in đậm `#231b14` (`text-ink-900`), độ tương phản cao vượt chuẩn WCAG AAA.
- **Khung Code C++**: Nền đen xám nguyên khối `#1c1917` (`bg-ink-900`), font chữ đơn cách chuẩn lập trình `font-mono`, hỗ trợ thanh cuộn ngang `overflow-x-auto` chống tràn khung.
- **Tiêu đề phân mục H2**: Viền nhấn đỏ son bên trái `border-l-4 border-seal-500` tạo điểm dừng thị giác rõ ràng.
- **Tuyệt đối KHÔNG sử dụng Glassmorphism**: Không dùng hiệu ứng làm mờ nền mờ ảo, đảm bảo người dùng đọc tài liệu rõ nét trên mọi thiết bị kể cả khi ra công trường ngoài trời nắng.

### 7.2. Tương thích Đa Viewport:
- **Mobile (360px – 430px)**:
  - Khung tài liệu tự động co giãn với lề an toàn `px-4`.
  - Khung code C++ cho phép cuộn ngang độc lập, không làm biến dạng chiều rộng tổng thể của trang web.
  - Bảng Điểm tin cậy hỗ trợ cuộn ngang nhẹ nhàng khi màn hình quá nhỏ.
- **Laptop 14-inch (1366x768 & 1440x900)**:
  - Giới hạn chiều rộng tài liệu trong khung `max-w-4xl` căn giữa chuẩn mực giúp mắt không bị mỏi khi đọc dòng chữ quá dài.
- **Desktop lớn (1920x1080)**:
  - Giữ tỷ lệ văn bản tối ưu, bố cục 2 cột phân tích MVP vs. Đổi Mới hiển thị cân đối.

---

## 8. Kịch Bản Ngoại Lệ & Xử Lý Lỗi Biên (Edge Cases & Fallbacks)

### 8.1. Các bẫy lỗi kỹ thuật thường gặp tại hiện trường Việt Nam:
1. **Lỗi sai lệch đơn vị Timestamp giữa C++ và Server**:
   - *Nguyên nhân*: ESP32 thường lấy giờ epoch theo giây (10 chữ số), trong khi JavaScript/NodeJS tính bằng mili-giây (13 chữ số).
   - *Giải pháp*: Quy chuẩn hóa toàn bộ firmware và backend sang mili-giây 13 chữ số (`timestamp * 1000ULL`).
2. **Cảm biến bị kẹt số do nhện chui vào buồng quang học laser**:
   - *Nguyên nhân*: Côn trùng nhỏ hoặc bụi xi măng đóng cục làm diode quang nhận phản xạ cố định.
   - *Giải pháp*: Thuật toán Flatline Audit nhận diện 5 lần gửi liên tiếp có cùng giá trị PM2.5/PM10 $\rightarrow$ Gán cờ `FAULTY` và thông báo tình nguyện viên đi vệ sinh buồng đo.
3. **Mã băm HMAC bị sai lệch do định dạng số thực (Float Precision)**:
   - *Nguyên nhân*: Giá trị `84.50` bị biến đổi thành `84.5` trên các thư viện JSON khác nhau làm sai chuỗi ký.
   - *Giải pháp*: Bắt buộc format số thực với đúng 1 chữ số sau dấu phẩy (`String(pm25, 1)`) trước khi đưa vào hàm băm.

### 8.2. Lệnh kiểm thử tự động (PowerShell CLI):
```powershell
# 1. Kiểm thử vòng đời trạng thái Node IoT và thuật toán kiểm toán gian lận
node --test app/tests/iot-node-setup-and-status-lifecycle.test.js

# 2. Kiểm thử tính toàn vẹn của chuỗi Telemetry và phát hiện Flatline
node --test app/tests/iot-telemetry-r2-integrity.test.js

# 3. Kiểm thử tổng thể luồng vận hành phân hệ cảm biến IoT
node --test app/tests/iot-operational-flow-auditor.test.js
```
