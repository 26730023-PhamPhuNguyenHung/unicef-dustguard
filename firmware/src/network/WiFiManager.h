#ifndef DUSTGUARD_WIFI_MANAGER_H
#define DUSTGUARD_WIFI_MANAGER_H

#include <Arduino.h>
#include <WiFi.h>
#include <time.h>
#include "config.h"
#include "types.h"

/**
 * @brief Quản lý kết nối Wi-Fi và đồng bộ thời gian chuẩn NTP (ISO 8601 UTC)
 * Tự động phục hồi khi mất mạng không dây mà không khởi động lại ESP32.
 */
class WiFiManager {
public:
    WiFiManager();

    /**
     * @brief Bắt đầu kết nối Wi-Fi và cấu hình NTP
     */
    void begin(const char *ssid, const char *password);

    /**
     * @brief Cập nhật trạng thái Wi-Fi theo chu kỳ non-blocking
     */
    void update(NetworkStatus &status);

    /**
     * @brief Kiểm tra Wi-Fi đã kết nối hay chưa
     */
    bool isConnected() const;

    /**
     * @brief Kiểm tra đồng hồ đã được đồng bộ NTP hay chưa
     */
    bool isNtpSynced() const;

    /**
     * @brief Lấy chuỗi thời gian định dạng ISO 8601 UTC (YYYY-MM-DDTHH:MM:SS.000Z)
     * @param outBuffer Buffer tối thiểu 32 bytes
     */
    bool getIsoTimestamp(char *outBuffer, size_t bufferSize) const;

    /**
     * @brief Lấy chỉ số cường độ tín hiệu RSSI (dBm)
     */
    int8_t getRssi() const;

private:
    const char *_ssid;
    const char *_password;
    uint32_t _lastReconnectAttempt;
    uint32_t _lastNtpSyncAttempt;
    bool _ntpSynced;

    void syncNtpTime();
};

#endif // DUSTGUARD_WIFI_MANAGER_H
