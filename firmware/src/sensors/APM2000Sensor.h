#ifndef DUSTGUARD_APM2000_SENSOR_H
#define DUSTGUARD_APM2000_SENSOR_H

#include <Arduino.h>
#include <HardwareSerial.h>
#include "config.h"
#include "pins.h"
#include "types.h"

/**
 * @brief Driver giao tiếp phần cứng cảm biến bụi laser ASAIR APM2000
 * Hỗ trợ giao thức UART chuẩn 9600 Baud 8N1, kiểm tra Checksum,
 * kiểm tra ngưỡng vật lý và bộ lọc trung bình trượt 5 mẫu.
 */
class APM2000Sensor {
public:
    APM2000Sensor();
    
    /**
     * @brief Khởi tạo cổng UART2 và cấu hình cảm biến
     * @return true nếu khởi tạo thành công
     */
    bool begin();

    /**
     * @brief Đọc giá trị PM1.0, PM2.5, PM10 từ cảm biến
     * @param reading Tham chiếu chứa dữ liệu kết quả sau khi parse và validate
     * @return true nếu nhận được gói tin hợp lệ
     */
    bool read(DustReading &reading);

    /**
     * @brief Kiểm tra trạng thái hoạt động của cảm biến
     * @return true nếu không có lỗi phần cứng liên tiếp
     */
    bool isHealthy() const;

    /**
     * @brief Lấy số lần đọc lỗi liên tiếp
     */
    uint8_t getConsecutiveFailures() const { return _consecutiveFailures; }

    /**
     * @brief Lấy tổng số lần đọc thành công
     */
    uint32_t getReadSuccessCount() const { return _readSuccessCount; }

    /**
     * @brief Lấy tổng số lần đọc thất bại
     */
    uint32_t getReadFailureCount() const { return _readFailureCount; }

private:
    HardwareSerial _serial;
    uint8_t _consecutiveFailures;
    uint32_t _readSuccessCount;
    uint32_t _readFailureCount;
    bool _isInitialized;

    // Buffer nhận dữ liệu UART
    static constexpr size_t RX_BUFFER_SIZE = 64;
    uint8_t _rxBuffer[RX_BUFFER_SIZE];
    size_t _rxIndex;

    // Rolling average storage
    float _pm1History[ROLLING_AVG_SAMPLES];
    float _pm25History[ROLLING_AVG_SAMPLES];
    float _pm10History[ROLLING_AVG_SAMPLES];
    uint8_t _historyCount;
    uint8_t _historyIndex;

    void sendQueryCommand();
    bool parseFrame(const uint8_t *buffer, size_t length, DustReading &reading);
    void updateRollingAverage(float pm1, float pm25, float pm10, DustReading &reading);
    uint8_t calculateChecksum(const uint8_t *data, size_t length);
};

#endif // DUSTGUARD_APM2000_SENSOR_H
