# Đặc Tả Kiến Trúc Sensor Adapter & Hướng Dẫn Đấu Nối Phần Cứng DustGuard VN
**Mã tài liệu**: `DG-IOT-CONTRACT-2026`  
**Phiên bản**: `v2.0`  
**Đối tượng**: Kỹ sư Phần cứng IoT, Lập trình viên Nhúng, Quản trị viên Vận hành Trạm Quan trắc  

---

## 1. Tổng Quan Kiến Trúc Hardware Abstraction Layer (HAL)

Hệ sinh thái DustGuard VN được thiết kế theo nguyên tắc phân tách độc lập giữa phần cứng đo kiểm và lõi xử lý trung tâm (**IoT is Optional & Decoupled**). Trạm quan trắc vi khí hậu hoạt động dựa trên lớp trừu tượng hóa `SensorAdapter`, đảm bảo hệ thống có thể tích hợp linh hoạt nhiều chủng loại cảm biến quang học (Laser Dust Sensor) hoặc hoạt động ở chế độ giả lập an toàn khi chưa gắn module ngoại vi.

```
┌─────────────────────────────────────────────────────────────┐
│                      ESP32 Microcontroller                   │
│                                                             │
│  ┌───────────────────────┐       ┌────────────────────────┐ │
│  │   SensorAdapter HAL   │       │  Crypto & Network HAL  │ │
│  │ ───────────────────── │       │ ────────────────────── │ │
│  │ • PMS7003 / APM2000   │       │ • HMAC-SHA256 Signer   │ │
│  │ • DHT22 (Temp/Hum)    │       │ • WiFi / Cellular Reconn│ │
│  │ • SSD1306 OLED UI     │       │ • Edge Ingestion HTTP  │ │
│  │ • Self-Diagnosis Mode │       │ • Offline Ring Buffer  │ │
│  └───────────────────────┘       └────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                               │ HTTP POST /api/sensors/reading
                               ▼
┌─────────────────────────────────────────────────────────────┐
│           Cloudflare Edge Worker & D1 Persistence            │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Sơ Đồ Đấu Nối Chân Phần Cứng (Hardware Wiring Guide)

Khi có đầy đủ linh kiện, kết nối theo bảng hướng dẫn chi tiết sau đây:

### A. Cảm Biến Bụi Mịn Laser (APM2000 / Plantower PMS7003)
- **Giao thức**: UART Serial (9600 baud, 8N1).
- **Điện áp khuyên dùng**: 5V DC cho quạt laser, tín hiệu Logic 3.3V.

| Chân Cảm biến (PMS7003/APM2000) | Chân ESP32 (DevKit v1) | Màu Dây Chuẩn | Chức Năng & Ghi Chú |
| :--- | :--- | :--- | :--- |
| **VCC (Pin 1 & 2)** | **5V (VIN)** | Đỏ | Cấp nguồn nuôi quạt hút mẫu khí laser (dòng tối thiểu 200mA) |
| **GND (Pin 3 & 4)** | **GND** | Đen | Nối đất chung toàn hệ thống |
| **TXD (Pin 5)** | **GPIO 16 (RX2)** | Xanh dương | Chân phát dữ liệu UART từ cảm biến sang ESP32 |
| **RXD (Pin 6)** | **GPIO 17 (TX2)** | Vàng | Chân nhận lệnh điều khiển chế độ ngủ/thức (Sleep/Wake) |
| **SET (Pin 7)** | **GPIO 4 (Tùy chọn)** | Xanh lá | Kéo lên 3.3V để hoạt động liên tục (Active Mode) |
| **RESET (Pin 8)** | **NC (Không nối)** | - | Chân reset phần cứng (để trống) |

---

### B. Màn Hình Hiển Thị Hiện Trường (OLED 0.96 inch SSD1306 I2C)
- **Giao thức**: I2C Bus (Địa chỉ mặc định: `0x3C`).
- **Điện áp**: 3.3V DC.

| Chân Màn hình OLED | Chân ESP32 (DevKit v1) | Màu Dây Chuẩn | Chức Năng |
| :--- | :--- | :--- | :--- |
| **VCC** | **3V3** | Đỏ | Cấp nguồn 3.3V |
| **GND** | **GND** | Đen | Nối đất chung |
| **SCL** | **GPIO 22** | Vàng | Xung đồng hồ I2C Clock |
| **SDA** | **GPIO 21** | Xanh lá | Tín hiệu dữ liệu I2C Data |

---

### C. Cảm Biến Nhiệt Độ & Độ Ẩm Môi Trường (DHT22 / AM2302)
- **Giao thức**: 1-Wire Digital Signal.
- **Điện áp**: 3.3V DC.

| Chân DHT22 | Chân ESP32 (DevKit v1) | Ghi Chú |
| :--- | :--- | :--- |
| **VCC** | **3V3** | Nguồn cấp 3.3V |
| **DATA** | **GPIO 15** | Nối kèm điện trở kéo lên (Pull-up resistor 4.7kΩ hoặc 10kΩ về 3V3) |
| **NC** | **Không nối** | Chân trống |
| **GND** | **GND** | Nối đất chung |

---

## 3. Chế Độ Tự Chẩn Đoán & Dự Phòng An Toàn (Self-Diagnosis & Fallback)

Khi ESP32 được cấp nguồn nhưng **chưa phát hiện cảm biến vật lý** kết nối vào cổng UART `GPIO 16/17`:
1. Firmware sẽ kích hoạt cờ tự chẩn đoán `DUSTGUARD_TEST_MODE = 1`.
2. Không gây lỗi nghẽn hoặc treo chip (Watchdog Reset).
3. Đèn LED tích hợp trên bo mạch (`GPIO 2`) sẽ nhấp nháy nhịp đôi (2 nhịp sáng/giây) để báo hiệu đang chạy chế độ giả lập thông minh.
4. Màn hình OLED (nếu có) sẽ hiển thị thông báo:
   ```
   [ DustGuard VN v2.0 ]
   Mode: SELF-DIAGNOSIS
   UART: SEARCHING SEN...
   PM2.5: SIMULATING
   ```

---

## 4. Đặc Tả Khế Ước Dữ Liệu Vi Khí Hậu (Telemetry JSON & HMAC Contract)

Mỗi chu kỳ truyền tin (mặc định 15 giây), thiết bị gửi bản tin HTTP POST đến endpoint `/api/sensors/reading`:

### Cấu trúc Bản tin JSON:
```json
{
  "sensorCode": "SEN-VD1",
  "pm10": 48.5,
  "pm25": 24.2,
  "temperature": 28.5,
  "humidity": 65.0,
  "timestamp": "2026-08-22T11:00:00.000Z",
  "signature": "3b2c...a8f9"
}
```

### Quy Tắc Tạo Chữ Ký HMAC-SHA256:
- Chuỗi ký chuẩn hóa: `sensorCode:pm10:pm25:timestamp`  
  *(Ví dụ: `SEN-VD1:48.5:24.2:2026-08-22T11:00:00.000Z`)*
- Khóa bí mật (Pre-Shared Key SSOT): `dustguard_secret_key_2026`
- Thuật toán: HMAC-SHA256 xuất chuỗi Hex 64 ký tự.
- **Ràng buộc Biên Cloudflare**:
  1. Giới hạn vật lý: `0 ≤ PM2.5 ≤ 2500 µg/m³`, `0 ≤ PM10 ≤ 2500 µg/m³`.
  2. Giới hạn lệch đồng hồ (Clock Drift): `|Date.now() - timestamp| ≤ 5 phút`.
  3. Chống lặp timestamp trên cùng một mã cảm biến.
