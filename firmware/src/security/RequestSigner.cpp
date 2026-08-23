#include "security/RequestSigner.h"
#include <mbedtls/md.h>
#include <stdio.h>
#include <string.h>

void RequestSigner::buildCanonicalMessage(
    const char *sensorCode,
    float pm10,
    float pm25,
    const char *isoTimestamp,
    char *outBuffer,
    size_t bufferSize
) {
    if (!outBuffer || bufferSize == 0) return;
    // Chuỗi chuẩn hóa: sensorCode:pm10:pm25:timestamp (e.g. SENSOR-VD1-01:45.2:22.8:2026-08-22T07:35:00.000Z)
    // In số thập phân 1 chữ số theo định dạng tương thích của backend
    snprintf(outBuffer, bufferSize, "%s:%.1f:%.1f:%s", sensorCode, pm10, pm25, isoTimestamp);
}

bool RequestSigner::sign(const char *secretKey, const char *message, char *outHex64) {
    if (!secretKey || !message || !outHex64) {
        return false;
    }

    size_t keyLen = strlen(secretKey);
    size_t msgLen = strlen(message);

    if (keyLen == 0 || msgLen == 0) {
        return false;
    }

    mbedtls_md_context_t ctx;
    mbedtls_md_type_t mdType = MBEDTLS_MD_SHA256;

    mbedtls_md_init(&ctx);

    const mbedtls_md_info_t *mdInfo = mbedtls_md_info_from_type(mdType);
    if (!mdInfo) {
        mbedtls_md_free(&ctx);
        return false;
    }

    if (mbedtls_md_setup(&ctx, mdInfo, 1) != 0) {
        mbedtls_md_free(&ctx);
        return false;
    }

    if (mbedtls_md_hmac_starts(&ctx, reinterpret_cast<const unsigned char*>(secretKey), keyLen) != 0) {
        mbedtls_md_free(&ctx);
        return false;
    }

    if (mbedtls_md_hmac_update(&ctx, reinterpret_cast<const unsigned char*>(message), msgLen) != 0) {
        mbedtls_md_free(&ctx);
        return false;
    }

    unsigned char hmacOutput[32];
    if (mbedtls_md_hmac_finish(&ctx, hmacOutput) != 0) {
        mbedtls_md_free(&ctx);
        return false;
    }

    mbedtls_md_free(&ctx);

    // Chuyển đổi 32 bytes sang 64 ký tự hex viết thường
    for (int i = 0; i < 32; i++) {
        snprintf(outHex64 + (i * 2), 3, "%02x", hmacOutput[i]);
    }
    outHex64[64] = '\0';

    return true;
}
