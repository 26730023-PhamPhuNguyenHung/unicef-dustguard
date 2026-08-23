#ifndef DUSTGUARD_TELEMETRY_MANAGER_H
#define DUSTGUARD_TELEMETRY_MANAGER_H

#include <Arduino.h>
#include "config.h"
#include "types.h"
#include "network/ApiClient.h"
#include "network/WiFiManager.h"
#include "security/RequestSigner.h"

/**
 * @brief Quản lý luồng gửi dữ liệu Telemetry và bộ đệm vòng ngoại tuyến (Ring Buffer)
 * Hỗ trợ thuật toán Exponential Backoff Retry và tự động đồng bộ khi có kết nối mạng.
 */
class TelemetryManager {
public:
    TelemetryManager();

    /**
     * @brief Khởi tạo Telemetry Manager với thông tin cấu hình
     */
    void begin(const char *sensorCode, const char *secretKey, ApiClient *apiClient, WiFiManager *wifiManager);

    /**
     * @brief Đưa một mẫu đo mới vào hàng đợi / bộ đệm
     */
    void recordReading(const DustReading &reading);

    /**
     * @brief Kiểm tra xem đã đến lúc gửi Telemetry hay chưa (xử lý theo lịch trình và backoff)
     */
    bool shouldUpload() const;

    /**
     * @brief Thực hiện ký số và gửi Telemetry mới nhất lên máy chủ
     * @param network Cập nhật trạng thái thống kê mạng
     * @return true nếu gửi thành công
     */
    bool uploadLatest(NetworkStatus &network);

    /**
     * @brief Lấy số lượng bản ghi đang đệm trong hàng đợi ngoại tuyến
     */
    uint8_t getBufferedCount() const { return _bufferedCount; }

private:
    char _sensorCode[32];
    char _secretKey[64];
    ApiClient *_apiClient;
    WiFiManager *_wifiManager;

    // Static Circular Ring Buffer
    DustReading _buffer[MAX_BUFFERED_READINGS];
    uint8_t _head;
    uint8_t _tail;
    uint8_t _bufferedCount;

    uint32_t _lastUploadAttempt;
    uint32_t _nextAllowedUploadTime;

    void enqueue(const DustReading &reading);
    bool dequeue(DustReading &reading);
};

#endif // DUSTGUARD_TELEMETRY_MANAGER_H
