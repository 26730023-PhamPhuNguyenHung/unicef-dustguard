# LESSONS.md — Lessons Learned & Hardware Integration Notes

## 1. Cảm biến bụi ASAIR APM2000 (Aosong) & ESP32 NodeMCU-32S
- **Baud Rate đặc biệt**: Trong khi đa số cảm biến bụi trên thị trường (Plantower PMS5003, Winsen ZH03B) dùng `9600 baud`, **ASAIR APM2000 sử dụng mặc định `1200 baud` (8N1)** theo Datasheet chính hãng.
- **Sơ đồ chân chuẩn (Ai-Thinker 38-pin NodeMCU-32S)**:
  - Pin 1 (Đỏ - VCC): Cắm chân `5V` (Cung cấp nguồn nuôi quạt và laser).
  - Pin 2 (Đen - GND): Cắm chân `GND`.
  - Pin 3 (Xanh lá - SET): Cắm chân `3V3` (Kéo HIGH để kích hoạt chế độ UART, hoặc để lơ lửng).
  - Pin 4 (Cam - RX APM2000): Cắm chân `P17` (ESP32 TX2 / GPIO 17).
  - Pin 5 (Tím - TX APM2000): Cắm chân `P16` (ESP32 RX2 / GPIO 16).
- **Giao thức Master-Query**:
  - Gửi lệnh đọc toàn diện: `0xFE, 0xA5, 0x00, 0x01, 0xA6`
  - Gói tin phản hồi: `FE A5 02 00 [DF11] [DF12] [DF21] [DF22] [DF31] [DF32] [CS]` (11 bytes).
  - Giải mã nồng độ:
    - $\text{PM1.0} = \text{DF11} \times 256 + \text{DF12} \ (\mu g/m^3)$
    - $\text{PM2.5} = \text{DF21} \times 256 + \text{DF22} \ (\mu g/m^3)$
    - $\text{PM10}  = \text{DF31} \times 256 + \text{DF32} \ (\mu g/m^3)$
- **Lưu ý phần cứng ESP32**:
  - Tuyệt đối không cắm đường phát TX vào các chân `GPIO 34, 35, 36, 39` vì là chân Input-Only.
  - Sử dụng `HardwareSerial(2)` trên `GPIO 16` (RX) và `GPIO 17` (TX) để tránh xung đột với cổng nạp code USB-UART CH340 (`GPIO 1 / 3`).
