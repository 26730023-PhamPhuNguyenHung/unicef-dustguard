# IOT_RECOVERY.md — Báo Cáo Phục Hồi Pháp Y Cảm Biến Môi Trường IoT & Vi Điều Khiển ESP32

> **Dự án**: DustGuard Operations  
> **Thời điểm hoàn thành**: 2026-09-05T01:58:25+07:00  
> **Tài liệu gốc tham chiếu**: `firmware/src/`, `firmware/include/config.h`, `app/server/auth/device/hmac.js`, `app/src/services/anomalyDetection.js`.

---

## 1. Cấu Hình Phần Cứng & Chu Kỳ Đo Đạc (Hardware & Timing Interval)

- **Vi điều khiển mục tiêu**: ESP32 DevKit V1 (Module `esp32doit-devkit-v1`).
- **Cảm biến bụi mịn**: ASAIR APM2000 (đo quang học laser phân tán hạt bụi PM2.5 và PM10) giao tiếp qua phần cứng UART với tốc độ Baud **1200 bps**.
- **Màn hình hiển thị tại chỗ**: OLED 0.96 inch 128×64 I2C (địa chỉ `0x3C`).
- **Chu kỳ hoạt động cấu hình trong `firmware/include/config.h`**:
  - `SENSOR_READ_INTERVAL_MS = 2000` (Đọc cảm biến mỗi 2 giây).
  - `DISPLAY_UPDATE_INTERVAL_MS = 1000` (Cập nhật màn hình OLED mỗi 1 giây).
  - `TELEMETRY_UPLOAD_INTERVAL_MS = 15000` (Gửi gói tin telemetry lên máy chủ mỗi 15 giây).
  - `WIFI_RECONNECT_INTERVAL_MS = 10000` (Thử kết nối lại Wi-Fi mỗi 10 giây nếu mất mạng).
  - `HTTP_TIMEOUT_MS = 8000` (Thời gian chờ tối đa 8 giây cho mỗi request).

---

## 2. Chuẩn Gói Tin & Tuyến Thu Nhận (Ingest Route & Firmware Payload)

### A. Tuyến API (Ingest Route)
- **Phương thức**: `POST`
- **Đường dẫn**: `/api/iot/ingest`
- **Tiêu đề HTTP (Headers)**:
  - `Content-Type: application/json`
  - `X-Device-ID: <sensorCode>` (Ví dụ: `SENSOR-VD1-01`)
  - `X-Firmware-Version: 1.0.0`

### B. Cấu Trúc Payload JSON
```json
{
  "sensorCode": "SENSOR-VD1-01",
  "pm10": 45.2,
  "pm25": 22.8,
  "timestamp": "2026-08-22T07:35:00.000Z",
  "signature": "3a7d4e5f9b8c1a2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d"
}
```

---

## 3. Cơ Chế Xác Thực & Định Dạng Chữ Ký (Auth Mechanism & Signature Format)

- **Thuật toán chữ ký**: HMAC-SHA256 (Mật mã băm đối xứng dựa trên khóa bí mật dùng chung `pre-shared secret key`).
- **Quy cách xây dựng chuỗi chuẩn hóa (Canonical Message)**:
  Thực thi chuẩn xác theo hàm `RequestSigner::buildCanonicalMessage`:
  ```c
  snprintf(outBuffer, bufferSize, "%s:%.1f:%.1f:%s", sensorCode, pm10, pm25, isoTimestamp);
  ```
  *Ví dụ chuỗi đầu vào*: `SENSOR-VD1-01:45.2:22.8:2026-08-22T07:35:00.000Z`
- **Định dạng đầu ra**: Chuỗi 64 ký tự Hex viết thường (Lowercase Hexadecimal).
- **Quy trình xác thực an toàn tại Backend**:
  - So sánh thời gian thực độc lập độ dài chuỗi (`timingSafeEqual`) để chống lại tấn công kênh kề đo thời gian (Timing Attack).
  - Khóa bí mật trạm đo được quản lý bảo mật trong `iot_devices.secret_reference`.

---

## 4. Kiểm Soát Tính Toàn Vẹn & Bất Thường Dữ Liệu (Integrity Checks)

Hệ thống backend kiểm soát 5 lớp phòng thủ trước khi chấp nhận dữ liệu:

1. **Kiểm tra độ tươi của dấu thời gian (Clock Drift Protection)**:
   - Dấu thời gian `timestamp` không được lệch quá **$\pm 5\text{ phút}$** so với đồng hồ UTC của máy chủ (`Date.now()`).
   - Nếu vi phạm: Trả về mã lỗi `400 Bad Request`.
2. **Chống tấn công phát lại (Replay Attack Protection)**:
   - Bản tin gửi lên phải có `timestamp` lớn hơn thời điểm ghi nhận gần nhất (`last_seen_at`) của trạm đo đó.
   - Nếu phát hiện gói tin trùng thời điểm: Trả về mã lỗi `409 Conflict`.
3. **Phát hiện treo số / đóng băng cảm biến (Flatline Detection)**:
   - Nếu **5 bản tin liên tiếp** từ cùng một thiết bị có giá trị `pm10` và `pm25` giống nhau tuyệt đối từng số thập phân:
     - Hệ thống kích hoạt cảnh báo `SENSOR_TAMPER_SUSPECTED`.
     - Tự động chuyển trạng thái trạm đo thành `FAULTY` / `DEGRADED`.
     - Ghi nhận sự kiện vào bảng `iot_events` và tạo thông báo cho Cán bộ giám sát.
4. **Hạn mức vật lý bất khả thi (Impossible-Value Guard)**:
   - Giá trị $PM < 0.0$ hoặc $PM > 2500.0\,\mu\text{g/m}^3$ sẽ bị đánh dấu `CORRUPTED` và loại khỏi tính toán chỉ số trung bình.
5. **Kiểm soát mất kết nối (Liveness Timeout)**:
   - Nếu trạm đo không gửi dữ liệu sau **15 phút** (`900.000 ms`), hệ thống đánh dấu trạng thái trạm thành `OFFLINE`.

---

## 5. Mô Hình Cơ Sở Dữ Liệu Lưu Trữ (Database Schema)

Dữ liệu IoT được lưu trữ trong 3 bảng quan hệ:

```sql
-- 1. Danh bạ trạm đo
CREATE TABLE IF NOT EXISTS iot_devices (
  id TEXT PRIMARY KEY,
  device_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  location_text TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'ONLINE' CHECK (status IN ('ONLINE', 'OFFLINE', 'FAULTY', 'UNKNOWN')),
  last_seen_at TEXT,
  firmware_version TEXT DEFAULT '1.0.0',
  secret_reference TEXT NOT NULL,
  is_simulated INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 2. Dữ liệu đo đạc thực tế
CREATE TABLE IF NOT EXISTS iot_readings (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL REFERENCES iot_devices(id) ON DELETE CASCADE,
  recorded_at TEXT NOT NULL,
  received_at TEXT NOT NULL,
  pm25 REAL NOT NULL,
  pm10 REAL NOT NULL,
  temperature REAL,
  humidity REAL,
  raw_payload_json TEXT NOT NULL,
  integrity_status TEXT NOT NULL DEFAULT 'VALID' CHECK (integrity_status IN ('VALID', 'FLATLINE', 'CORRUPTED', 'CLOCK_DRIFT')),
  created_at TEXT NOT NULL
);

-- 3. Nhật ký sự kiện cảnh báo thiết bị
CREATE TABLE IF NOT EXISTS iot_events (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL REFERENCES iot_devices(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('OFFLINE', 'FLATLINE', 'TAMPER', 'RECONNECTED', 'SPIKE')),
  severity TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
  description TEXT NOT NULL,
  created_at TEXT NOT NULL
);
```

---

## 6. Trạng Thái Kết Nối & Nhãn Môi Trường

- **Thiết bị môi trường thật**: Phải có bản tin gửi thực tế và xác thực HMAC thành công.
- **Dữ liệu giả lập thử nghiệm (Development Simulation)**: Bắt buộc gán cờ `is_simulated = 1` và hiển thị nhãn rõ ràng trên UI: **"Mô phỏng phát triển"**, tuyệt đối không hiển thị như thiết bị phần cứng thật.
