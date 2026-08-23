#ifndef DUSTGUARD_API_CLIENT_H
#define DUSTGUARD_API_CLIENT_H

#include <Arduino.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include "config.h"
#include "types.h"

/**
 * @brief HTTP/HTTPS Client gửi dữ liệu Telemetry lên DustGuard Cloudflare D1 Backend
 * Hỗ trợ timeout, phân loại mã lỗi, xử lý an toàn bộ nhớ và ngăn ngừa rò rỉ kết nối.
 */
class ApiClient {
public:
    ApiClient();

    /**
     * @brief Cấu hình endpoint máy chủ
     */
    void configure(const char *baseUrl, const char *telemetryPath);

    /**
     * @brief Gửi gói tin Telemetry lên Cloud API
     * @param packet Gói tin chứa sensorCode, PM, timestamp và HMAC signature
     * @param outStatusCode Mã HTTP nhận về từ máy chủ
     * @return true nếu nhận mã HTTP 200-299
     */
    bool sendTelemetry(const TelemetryPacket &packet, int &outStatusCode);

private:
    char _fullUrl[128];
    WiFiClientSecure _secureClient;
    WiFiClient _insecureClient;
    bool _isHttps;
};

#endif // DUSTGUARD_API_CLIENT_H
