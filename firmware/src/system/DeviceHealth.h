#ifndef DUSTGUARD_DEVICE_HEALTH_H
#define DUSTGUARD_DEVICE_HEALTH_H

#include <Arduino.h>
#include "types.h"
#include "sensors/APM2000Sensor.h"

/**
 * @brief Giám sát sức khỏe thiết bị, bộ nhớ RAM heap, và phát hiện tín hiệu bất thường
 */
class DeviceHealth {
public:
    DeviceHealth();

    /**
     * @brief Cập nhật thông số sức khỏe và chẩn đoán trạng thái
     */
    void update(const APM2000Sensor &sensor, const NetworkStatus &network, const DustReading &reading);

    /**
     * @brief Xác định trạng thái tổng thể của thiết bị
     */
    DeviceState evaluateState(const APM2000Sensor &sensor, const NetworkStatus &network, bool isBooting) const;

    /**
     * @brief Kiểm tra nghi ngờ Flatline (nhiều mẫu đo liên tiếp giống hệt nhau)
     */
    bool isFlatlineSuspected() const { return _flatlineSuspected; }

    /**
     * @brief Lấy dung lượng Heap còn trống tối thiểu (bytes)
     */
    uint32_t getMinFreeHeap() const { return _minFreeHeap; }

private:
    uint32_t _minFreeHeap;
    float _lastPm25;
    float _lastPm10;
    uint8_t _identicalReadingCount;
    bool _flatlineSuspected;
};

#endif // DUSTGUARD_DEVICE_HEALTH_H
