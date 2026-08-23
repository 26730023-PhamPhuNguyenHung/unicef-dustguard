#include "telemetry/TelemetryManager.h"

TelemetryManager::TelemetryManager()
    : _apiClient(nullptr),
      _wifiManager(nullptr),
      _head(0),
      _tail(0),
      _bufferedCount(0),
      _lastUploadAttempt(0),
      _nextAllowedUploadTime(0) {
    _sensorCode[0] = '\0';
    _secretKey[0] = '\0';
}

void TelemetryManager::begin(const char *sensorCode, const char *secretKey, ApiClient *apiClient, WiFiManager *wifiManager) {
    if (sensorCode) strncpy(_sensorCode, sensorCode, sizeof(_sensorCode) - 1);
    if (secretKey) strncpy(_secretKey, secretKey, sizeof(_secretKey) - 1);
    _apiClient = apiClient;
    _wifiManager = wifiManager;
    _bufferedCount = 0;
    _head = 0;
    _tail = 0;
    _lastUploadAttempt = 0;
    _nextAllowedUploadTime = 0;
    
    Serial.printf("[TELEMETRY] Da khoi tao cho Device Code: %s\n", _sensorCode);
}

void TelemetryManager::recordReading(const DustReading &reading) {
    if (!reading.valid) return;
    enqueue(reading);
}

void TelemetryManager::enqueue(const DustReading &reading) {
    _buffer[_tail] = reading;
    _tail = (_tail + 1) % MAX_BUFFERED_READINGS;

    if (_bufferedCount < MAX_BUFFERED_READINGS) {
        _bufferedCount++;
    } else {
        // Ghi đè phần tử cũ nhất khi đầy
        _head = (_head + 1) % MAX_BUFFERED_READINGS;
    }
}

bool TelemetryManager::dequeue(DustReading &reading) {
    if (_bufferedCount == 0) return false;

    reading = _buffer[_head];
    _head = (_head + 1) % MAX_BUFFERED_READINGS;
    _bufferedCount--;
    return true;
}

bool TelemetryManager::shouldUpload() const {
    if (_bufferedCount == 0) return false;
    uint32_t now = millis();
    return (now >= _nextAllowedUploadTime);
}

bool TelemetryManager::uploadLatest(NetworkStatus &network) {
    if (_bufferedCount == 0 || !_apiClient || !_wifiManager) {
        return false;
    }

    if (!_wifiManager->isConnected()) {
        network.cloudOnline = false;
        return false;
    }

    // Lấy mẫu đo gần đây nhất từ ring buffer
    uint8_t newestIndex = (_tail == 0) ? (MAX_BUFFERED_READINGS - 1) : (_tail - 1);
    DustReading reading = _buffer[newestIndex];

    // Lấy chuỗi timestamp chuẩn ISO 8601 UTC
    char isoTime[32];
    bool hasTime = _wifiManager->getIsoTimestamp(isoTime, sizeof(isoTime));
    if (!hasTime) {
        // Nếu NTP chưa đồng bộ, tạo timestamp dự phòng từ epoch hợp lý
        time_t raw = time(nullptr);
        if (raw < 1700000000) {
            Serial.println("[WARN][TELEMETRY] Bo qua upload vi NTP chua dong bo thoi gian.");
            _nextAllowedUploadTime = millis() + 5000;
            return false;
        }
    }

    // Xây dựng chuỗi thông điệp chuẩn hóa để ký HMAC-SHA256
    char canonicalMsg[128];
    RequestSigner::buildCanonicalMessage(_sensorCode, reading.pm10, reading.pm25, isoTime, canonicalMsg, sizeof(canonicalMsg));

    // Ký số gói tin
    char signature[65];
    if (!RequestSigner::sign(_secretKey, canonicalMsg, signature)) {
        Serial.println("[ERROR][TELEMETRY] Ky so HMAC that bai!");
        return false;
    }

    // Đóng gói TelemetryPacket
    TelemetryPacket packet;
    strncpy(packet.sensorCode, _sensorCode, sizeof(packet.sensorCode) - 1);
    packet.pm10 = reading.pm10;
    packet.pm25 = reading.pm25;
    strncpy(packet.isoTimestamp, isoTime, sizeof(packet.isoTimestamp) - 1);
    strncpy(packet.signature, signature, sizeof(packet.signature) - 1);
    packet.valid = true;

    _lastUploadAttempt = millis();

    int statusCode = 0;
    bool success = _apiClient->sendTelemetry(packet, statusCode);

    if (success) {
        network.uploadSuccessCount++;
        network.consecutiveFailures = 0;
        network.currentRetryDelayMs = RETRY_DELAY_INITIAL_MS;
        network.cloudOnline = true;
        network.lastUploadTime = millis();

        // Đặt lịch cho chu kỳ tiếp theo (15s)
        _nextAllowedUploadTime = millis() + TELEMETRY_UPLOAD_INTERVAL_MS;

        // Xóa sạch buffer sau khi gửi thành công mẫu mới nhất
        _bufferedCount = 0;
        _head = _tail;
        return true;
    } else {
        network.uploadFailCount++;
        network.consecutiveFailures++;
        network.cloudOnline = false;

        // Áp dụng Exponential Backoff: 5s -> 10s -> 20s -> 40s -> 60s max
        uint32_t delayMs = network.currentRetryDelayMs;
        network.currentRetryDelayMs = min(delayMs * RETRY_MULTIPLIER, static_cast<uint32_t>(RETRY_DELAY_MAX_MS));
        _nextAllowedUploadTime = millis() + delayMs;

        Serial.printf("[TELEMETRY] Upload that bai (HTTP %d). Retry sau %u ms...\n", statusCode, delayMs);
        return false;
    }
}
