#ifndef DUSTGUARD_CONFIG_H
#define DUSTGUARD_CONFIG_H

#include <stdint.h>

// ==========================================
// Firmware Metadata
// ==========================================
#define FIRMWARE_NAME           "DustGuard Node"
#define FIRMWARE_VERSION        "1.0.0"
#define HARDWARE_TARGET         "ESP32-APM2000-OLED"

// ==========================================
// Test Mode Switch (0 = Production Hardware, 1 = Self-Test Diagnostics)
// ==========================================
#ifndef DUSTGUARD_TEST_MODE
#define DUSTGUARD_TEST_MODE     0
#endif

// ==========================================
// Timing & Schedulers (in milliseconds)
// ==========================================
constexpr uint32_t SENSOR_READ_INTERVAL_MS       = 2000;    // Đọc cảm biến mỗi 2 giây
constexpr uint32_t DISPLAY_UPDATE_INTERVAL_MS     = 1000;    // Cập nhật màn hình OLED mỗi 1 giây
constexpr uint32_t TELEMETRY_UPLOAD_INTERVAL_MS   = 15000;   // Gửi dữ liệu đám mây mỗi 15 giây
constexpr uint32_t WIFI_RECONNECT_INTERVAL_MS     = 10000;   // Thử kết nối lại Wi-Fi mỗi 10 giây
constexpr uint32_t NTP_SYNC_INTERVAL_MS           = 3600000; // Đồng bộ lại NTP mỗi 1 giờ
constexpr uint32_t HTTP_TIMEOUT_MS                = 8000;    // Timeout request HTTP/HTTPS

// ==========================================
// Sensor & Quality Control Constraints
// ==========================================
constexpr float PHYSICAL_MIN_PM                   = 0.0f;    // Ngưỡng vật lý tối thiểu
constexpr float PHYSICAL_MAX_PM                   = 2500.0f; // Ngưỡng vật lý tối đa (µg/m³)
constexpr uint8_t ROLLING_AVG_SAMPLES             = 5;       // Số mẫu trung bình trượt
constexpr uint8_t SENSOR_MAX_CONSECUTIVE_FAILURES = 5;       // Ngưỡng lỗi liên tiếp để báo SENSOR_FAULT
constexpr uint8_t MAX_BUFFERED_READINGS           = 20;      // Kích thước bộ đệm vòng ngoại tuyến

// ==========================================
// Exponential Backoff Retry Parameters
// ==========================================
constexpr uint32_t RETRY_DELAY_INITIAL_MS         = 5000;    // Lần 1: 5s
constexpr uint32_t RETRY_DELAY_MAX_MS             = 60000;   // Tối đa: 60s
constexpr uint8_t  RETRY_MULTIPLIER               = 2;       // Hệ số nhân (5s -> 10s -> 20s -> 40s -> 60s)

// ==========================================
// OLED Display Parameters
// ==========================================
constexpr uint8_t SCREEN_WIDTH                    = 128;
constexpr uint8_t SCREEN_HEIGHT                   = 64;
constexpr uint8_t OLED_I2C_ADDRESS                = 0x3C;
constexpr uint8_t DISPLAY_PAGE_DURATION_SEC       = 4;       // Thời gian chuyển đổi trang màn hình (giây)

// ==========================================
// Network & NTP Configuration
// ==========================================
#define NTP_SERVER_1            "pool.ntp.org"
#define NTP_SERVER_2            "time.google.com"
#define NTP_SERVER_3            "time.cloudflare.com"
constexpr long GMT_OFFSET_SEC   = 0;                         // Lưu trữ epoch UTC 0
constexpr int  DAYLIGHT_OFFSET  = 0;

#endif // DUSTGUARD_CONFIG_H
