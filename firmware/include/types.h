#ifndef DUSTGUARD_TYPES_H
#define DUSTGUARD_TYPES_H

#include <stdint.h>
#include <stddef.h>

/**
 * @brief Cấu trúc dữ liệu đọc từ cảm biến bụi
 */
struct DustReading {
    float pm1;          // PM1.0 (µg/m³)
    float pm25;         // PM2.5 (µg/m³)
    float pm10;         // PM10 (µg/m³)
    uint64_t timestamp; // Epoch millisecond UTC
    bool valid;         // Tính hợp lệ của mẫu đo

    DustReading() : pm1(0.0f), pm25(0.0f), pm10(0.0f), timestamp(0), valid(false) {}
};

/**
 * @brief Trạng thái hoạt động của thiết bị IoT Node
 */
enum class DeviceState : uint8_t {
    BOOTING,            // Đang khởi động hệ thống
    CONNECTING_WIFI,    // Đang kết nối mạng không dây
    ONLINE,             // Hoạt động bình thường, kết nối đám mây thông suốt
    OFFLINE,            // Mất kết nối Wi-Fi/Internet (chế độ độc lập)
    SENSOR_FAULT,       // Lỗi cảm biến APM2000 (mất tín hiệu / checksum sai liên tiếp)
    API_ERROR           // Lỗi phản hồi API Cloud (401/403/500/Timeout)
};

/**
 * @brief Trạng thái mạng và thống kê truyền tin
 */
struct NetworkStatus {
    bool wifiConnected;
    int8_t wifiRssi;
    bool ntpSynced;
    bool cloudOnline;
    uint32_t lastUploadTime;
    uint32_t uploadSuccessCount;
    uint32_t uploadFailCount;
    uint32_t consecutiveFailures;
    uint32_t currentRetryDelayMs;

    NetworkStatus() : 
        wifiConnected(false),
        wifiRssi(-100),
        ntpSynced(false),
        cloudOnline(false),
        lastUploadTime(0),
        uploadSuccessCount(0),
        uploadFailCount(0),
        consecutiveFailures(0),
        currentRetryDelayMs(5000) {}
};

/**
 * @brief Gói tin Telemetry gửi lên máy chủ DustGuard
 */
struct TelemetryPacket {
    char sensorCode[32];
    float pm10;
    float pm25;
    char isoTimestamp[32];
    char signature[65];
    bool valid;

    TelemetryPacket() : pm10(0.0f), pm25(0.0f), valid(false) {
        sensorCode[0] = '\0';
        isoTimestamp[0] = '\0';
        signature[0] = '\0';
    }
};

/**
 * @brief Thống kê sức khỏe thiết bị
 */
struct HealthMetrics {
    uint32_t freeHeapBytes;
    uint32_t minFreeHeapBytes;
    uint32_t uptimeSeconds;
    int8_t wifiRssi;
    uint8_t bufferUsage;
    bool flatlineSuspected;
};

#endif // DUSTGUARD_TYPES_H
