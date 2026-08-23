#include "network/WiFiManager.h"

WiFiManager::WiFiManager()
    : _ssid(nullptr),
      _password(nullptr),
      _lastReconnectAttempt(0),
      _lastNtpSyncAttempt(0),
      _ntpSynced(false) {}

void WiFiManager::begin(const char *ssid, const char *password) {
    _ssid = ssid;
    _password = password;

    Serial.printf("[WIFI] Bat dau ket noi toi SSID: %s\n", _ssid ? _ssid : "(null)");
    WiFi.mode(WIFI_STA);
    WiFi.setAutoReconnect(true);
    
    if (_ssid && strlen(_ssid) > 0) {
        WiFi.begin(_ssid, _password);
    }
    
    _lastReconnectAttempt = millis();
}

void WiFiManager::update(NetworkStatus &status) {
    bool connected = (WiFi.status() == WL_CONNECTED);
    status.wifiConnected = connected;

    if (connected) {
        status.wifiRssi = getRssi();

        // Đồng bộ thời gian NTP nếu chưa đồng bộ hoặc đến chu kỳ 1 giờ
        uint32_t now = millis();
        if (!_ntpSynced || (now - _lastNtpSyncAttempt >= NTP_SYNC_INTERVAL_MS)) {
            syncNtpTime();
            _lastNtpSyncAttempt = now;
        }

        status.ntpSynced = _ntpSynced;
    } else {
        status.wifiRssi = -100;
        
        // Thử kết nối lại định kỳ nếu mất sóng
        uint32_t now = millis();
        if (now - _lastReconnectAttempt >= WIFI_RECONNECT_INTERVAL_MS) {
            _lastReconnectAttempt = now;
            Serial.println("[WIFI] Mat ket noi. Dang thu ket noi lai...");
            WiFi.disconnect();
            if (_ssid && strlen(_ssid) > 0) {
                WiFi.begin(_ssid, _password);
            }
        }
    }
}

void WiFiManager::syncNtpTime() {
    Serial.println("[NTP] Dang dong bo thoi gian tu pool.ntp.org...");
    configTime(GMT_OFFSET_SEC, DAYLIGHT_OFFSET, NTP_SERVER_1, NTP_SERVER_2, NTP_SERVER_3);

    // Kiểm tra xem đồng hồ đã hợp lệ chưa
    time_t now = time(nullptr);
    struct tm timeinfo;
    gmtime_r(&now, &timeinfo);

    // Nếu năm >= 2024 (tm_year là số năm tính từ 1900, >= 124)
    if (timeinfo.tm_year >= (2024 - 1900)) {
        _ntpSynced = true;
        char isoBuf[32];
        getIsoTimestamp(isoBuf, sizeof(isoBuf));
        Serial.printf("[NTP] Dong bo thanh cong: %s\n", isoBuf);
    } else {
        _ntpSynced = false;
        Serial.println("[NTP] Chua the dong bo thoi gian UTC.");
    }
}

bool WiFiManager::isConnected() const {
    return (WiFi.status() == WL_CONNECTED);
}

bool WiFiManager::isNtpSynced() const {
    return _ntpSynced;
}

int8_t WiFiManager::getRssi() const {
    if (WiFi.status() == WL_CONNECTED) {
        return static_cast<int8_t>(WiFi.RSSI());
    }
    return -100;
}

bool WiFiManager::getIsoTimestamp(char *outBuffer, size_t bufferSize) const {
    if (!outBuffer || bufferSize < 25) return false;

    time_t now = time(nullptr);
    struct tm timeinfo;
    gmtime_r(&now, &timeinfo);

    // Định dạng: YYYY-MM-DDTHH:MM:SS.000Z
    if (timeinfo.tm_year >= (2024 - 1900)) {
        snprintf(
            outBuffer,
            bufferSize,
            "%04d-%02d-%02dT%02d:%02d:%02d.000Z",
            timeinfo.tm_year + 1900,
            timeinfo.tm_mon + 1,
            timeinfo.tm_mday,
            timeinfo.tm_hour,
            timeinfo.tm_min,
            timeinfo.tm_sec
        );
        return true;
    }

    // Fallback: nếu chưa đồng bộ NTP, trả về ISO rỗng
    outBuffer[0] = '\0';
    return false;
}
