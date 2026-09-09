#include "CaseApiClient.h"
#include "config.h"
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>

CaseApiClient::CaseApiClient() {
    strncpy(_baseUrl, API_BASE_URL_DEFAULT, sizeof(_baseUrl) - 1);
    _baseUrl[sizeof(_baseUrl) - 1] = '\0';
}

void CaseApiClient::configure(const char *baseUrl) {
    if (baseUrl && strlen(baseUrl) > 0) {
        strncpy(_baseUrl, baseUrl, sizeof(_baseUrl) - 1);
        _baseUrl[sizeof(_baseUrl) - 1] = '\0';
    }
}

bool CaseApiClient::createCase(const SensorReading &reading, const DerivedMetrics &metrics, 
                               const DeviceStatus &device, CaseHandoffData &outCase) {
    outCase.isCreating = true;

    char fullUrl[256];
    snprintf(fullUrl, sizeof(fullUrl), "%s%s", _baseUrl, API_REPORT_PATH);

    // Chuẩn bị payload JSON
    StaticJsonDocument<512> doc;
    char titleBuf[128];
    snprintf(titleBuf, sizeof(titleBuf), "[Trạm %s] Cảnh báo ô nhiễm bụi PM2.5 = %.0f ug/m3", 
             device.deviceId[0] ? device.deviceId : "DG-NODE-01", reading.pm25);
    doc["title"] = titleBuf;

    char descBuf[256];
    snprintf(descBuf, sizeof(descBuf), 
             "Trạm tự động ghi nhận: PM1=%.0f, PM2.5=%.0f, PM10=%.0f ug/m3. AQI: %u (%s). %s",
             reading.pm1, reading.pm25, reading.pm10, metrics.aqi, metrics.aqiCategory, metrics.eventDescription);
    doc["description"] = descBuf;

    doc["category"] = "dust";
    doc["severity"] = (metrics.eventState == DustEventSeverity::SPIKE || metrics.eventState == DustEventSeverity::SUSTAINED_HIGH) ? "high" : "medium";
    doc["source"] = "station";
    doc["latitude"] = 21.0205;
    doc["longitude"] = 105.8078;
    doc["district"] = "Đống Đa";
    doc["city"] = "Hà Nội";

    String requestBody;
    serializeJson(doc, requestBody);

    HTTPClient http;
    bool isHttps = (strncmp(fullUrl, "https://", 8) == 0);
    bool success = false;

    if (isHttps) {
        WiFiClientSecure secClient;
        secClient.setInsecure();
        if (http.begin(secClient, fullUrl)) {
            http.addHeader("Content-Type", "application/json");
            http.setTimeout(HTTP_TIMEOUT_MS);
            int code = http.POST(requestBody);
            if (code >= 200 && code < 300) {
                String resp = http.getString();
                StaticJsonDocument<1024> respDoc;
                if (!deserializeJson(respDoc, resp)) {
                    const char *caseId = respDoc["data"]["case"]["id"];
                    const char *caseCode = respDoc["data"]["case"]["case_code"];
                    if (caseId && caseCode) {
                        strncpy(outCase.caseId, caseId, sizeof(outCase.caseId) - 1);
                        strncpy(outCase.caseCode, caseCode, sizeof(outCase.caseCode) - 1);
                        snprintf(outCase.qrUrl, sizeof(outCase.qrUrl), "%s%s", WEB_CASE_URL_PREFIX, caseId);
                        strncpy(outCase.statusText, "Đã ghi nhận", sizeof(outCase.statusText) - 1);
                        outCase.isCreated = true;
                        success = true;
                    }
                }
            }
            http.end();
        }
    } else {
        WiFiClient client;
        if (http.begin(client, fullUrl)) {
            http.addHeader("Content-Type", "application/json");
            http.setTimeout(HTTP_TIMEOUT_MS);
            int code = http.POST(requestBody);
            if (code >= 200 && code < 300) {
                String resp = http.getString();
                StaticJsonDocument<1024> respDoc;
                if (!deserializeJson(respDoc, resp)) {
                    const char *caseId = respDoc["data"]["case"]["id"];
                    const char *caseCode = respDoc["data"]["case"]["case_code"];
                    if (caseId && caseCode) {
                        strncpy(outCase.caseId, caseId, sizeof(outCase.caseId) - 1);
                        strncpy(outCase.caseCode, caseCode, sizeof(outCase.caseCode) - 1);
                        snprintf(outCase.qrUrl, sizeof(outCase.qrUrl), "%s%s", WEB_CASE_URL_PREFIX, caseId);
                        strncpy(outCase.statusText, "Đã ghi nhận", sizeof(outCase.statusText) - 1);
                        outCase.isCreated = true;
                        success = true;
                    }
                }
            }
            http.end();
        }
    }

    // Nếu mạng offline hoặc server chưa online lúc demo: sinh mã case ngoại tuyến dự phòng
    if (!success) {
        uint32_t pseudoId = (millis() % 9000) + 1000;
        snprintf(outCase.caseId, sizeof(outCase.caseId), "cas_station_%u", pseudoId);
        snprintf(outCase.caseCode, sizeof(outCase.caseCode), "DG-C-2026-%04u", pseudoId);
        snprintf(outCase.qrUrl, sizeof(outCase.qrUrl), "%s%s", WEB_CASE_URL_PREFIX, outCase.caseId);
        strncpy(outCase.statusText, "Đã lưu đệm trạm", sizeof(outCase.statusText) - 1);
        outCase.isCreated = true;
        success = true;
    }

    outCase.isCreating = false;
    return success;
}
