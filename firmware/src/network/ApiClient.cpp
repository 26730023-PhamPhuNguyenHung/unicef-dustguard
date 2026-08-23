#include "network/ApiClient.h"
#include <ArduinoJson.h>

ApiClient::ApiClient() : _isHttps(false) {
    _fullUrl[0] = '\0';
    _secureClient.setInsecure(); // Tự động chấp nhận chứng chỉ TLS Cloudflare Worker
}

void ApiClient::configure(const char *baseUrl, const char *telemetryPath) {
    if (!baseUrl || !telemetryPath) return;

    snprintf(_fullUrl, sizeof(_fullUrl), "%s%s", baseUrl, telemetryPath);
    _isHttps = (strncmp(baseUrl, "https://", 8) == 0);

    Serial.printf("[API] Da cau hinh Endpoint: %s (%s)\n", _fullUrl, _isHttps ? "HTTPS" : "HTTP");
}

bool ApiClient::sendTelemetry(const TelemetryPacket &packet, int &outStatusCode) {
    outStatusCode = 0;

    if (strlen(_fullUrl) == 0) {
        Serial.println("[ERROR][API] Endpoint chua duoc cau hinh!");
        return false;
    }

    HTTPClient http;
    http.setTimeout(HTTP_TIMEOUT_MS);

    bool beginOk = false;
    if (_isHttps) {
        beginOk = http.begin(_secureClient, _fullUrl);
    } else {
        beginOk = http.begin(_insecureClient, _fullUrl);
    }

    if (!beginOk) {
        Serial.println("[ERROR][API] Khong the khoi tao ket noi HTTPClient.");
        return false;
    }

    // Set HTTP Headers
    http.addHeader("Content-Type", "application/json");
    http.addHeader("X-Device-ID", packet.sensorCode);
    http.addHeader("X-Firmware-Version", FIRMWARE_VERSION);

    // Xây dựng JSON payload tĩnh (StaticJsonDocument)
    StaticJsonDocument<256> doc;
    doc["sensorCode"] = packet.sensorCode;
    doc["pm10"] = serialized(String(packet.pm10, 1));
    doc["pm25"] = serialized(String(packet.pm25, 1));
    doc["timestamp"] = packet.isoTimestamp;
    doc["signature"] = packet.signature;

    char jsonBuffer[256];
    size_t jsonLen = serializeJson(doc, jsonBuffer, sizeof(jsonBuffer));

    Serial.printf("[API] POST %s (%u bytes)...\n", _fullUrl, jsonLen);

    int httpCode = http.POST(reinterpret_cast<uint8_t*>(jsonBuffer), jsonLen);
    outStatusCode = httpCode;

    bool success = false;

    if (httpCode > 0) {
        Serial.printf("[API] HTTP Response Code: %d\n", httpCode);

        if (httpCode >= 200 && httpCode < 300) {
            success = true;
            Serial.println("[API] Telemetry da duoc may chu ghi nhan thanh cong.");
        } else if (httpCode == 403) {
            Serial.println("[ERROR][API] 403 Forbidden: Chu ky HMAC khong hop le hoac sai khoa!");
        } else if (httpCode == 400) {
            Serial.println("[ERROR][API] 400 Bad Request: Sai dinh dang payload hoac lech dong ho >5 phut!");
        } else if (httpCode == 409) {
            Serial.println("[WARN][API] 409 Conflict: Phat hien Replay Attack / trung lap timestamp.");
        } else {
            Serial.printf("[ERROR][API] HTTP Error: %d\n", httpCode);
        }
    } else {
        Serial.printf("[ERROR][API] Gui HTTP that bai: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
    return success;
}
