#ifndef DUSTGUARD_REQUEST_SIGNER_H
#define DUSTGUARD_REQUEST_SIGNER_H

#include <Arduino.h>
#include <stdint.h>
#include "types.h"

/**
 * @brief Module ký số HMAC-SHA256 cho Telemetry Payload
 * Đảm bảo tính toàn vẹn và chống giả mạo theo SSOT Device Contract
 */
class RequestSigner {
public:
    /**
     * @brief Tạo chuỗi định dạng chuẩn hóa (Canonical Message)
     * Format: sensorCode:pm10:pm25:timestamp
     */
    static void buildCanonicalMessage(
        const char *sensorCode,
        float pm10,
        float pm25,
        const char *isoTimestamp,
        char *outBuffer,
        size_t bufferSize
    );

    /**
     * @brief Ký HMAC-SHA256 trên chuỗi thông điệp
     * @param secretKey Khóa bảo mật Pre-Shared Key (IOT_PRE_SHARED_KEY)
     * @param message Chuỗi thông điệp cần ký
     * @param outHex64 Buffer chứa 64 ký tự hex + null terminator (tối thiểu 65 bytes)
     * @return true nếu ký thành công
     */
    static bool sign(const char *secretKey, const char *message, char *outHex64);
};

#endif // DUSTGUARD_REQUEST_SIGNER_H
