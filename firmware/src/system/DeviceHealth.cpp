#include "system/DeviceHealth.h"
#include <Esp.h>

DeviceHealth::DeviceHealth()
    : _minFreeHeap(0xFFFFFFFF),
      _lastPm25(-1.0f),
      _lastPm10(-1.0f),
      _identicalReadingCount(0),
      _flatlineSuspected(false) {}

void DeviceHealth::update(const APM2000Sensor &sensor, const NetworkStatus &network, const DustReading &reading) {
    uint32_t currentFreeHeap = ESP.getFreeHeap();
    if (currentFreeHeap < _minFreeHeap) {
        _minFreeHeap = currentFreeHeap;
    }

    // Chẩn đoán hiện tượng Flatline cục bộ (nếu 10 lần đọc liên tiếp có PM2.5 và PM10 không đổi 1 bit)
    if (reading.valid) {
        if (reading.pm25 == _lastPm25 && reading.pm10 == _lastPm10) {
            _identicalReadingCount++;
            if (_identicalReadingCount >= 10) {
                _flatlineSuspected = true;
            }
        } else {
            _identicalReadingCount = 0;
            _flatlineSuspected = false;
            _lastPm25 = reading.pm25;
            _lastPm10 = reading.pm10;
        }
    }
}

DeviceState DeviceHealth::evaluateState(const APM2000Sensor &sensor, const NetworkStatus &network, bool isBooting) const {
    if (isBooting) {
        return DeviceState::BOOTING;
    }

    if (!sensor.isHealthy()) {
        return DeviceState::SENSOR_FAULT;
    }

    if (!network.wifiConnected) {
        return DeviceState::OFFLINE;
    }

    if (network.consecutiveFailures >= 3) {
        return DeviceState::API_ERROR;
    }

    return DeviceState::ONLINE;
}
