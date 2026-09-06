#include "sensors/APM2000Sensor.h"
#include <math.h>

APM2000Sensor::APM2000Sensor()
    : _serial(2),
      _consecutiveFailures(0),
      _readSuccessCount(0),
      _readFailureCount(0),
      _isInitialized(false),
      _rxIndex(0),
      _historyCount(0),
      _historyIndex(0) {
    memset(_rxBuffer, 0, sizeof(_rxBuffer));
    for (uint8_t i = 0; i < ROLLING_AVG_SAMPLES; i++) {
        _pm1History[i] = 0.0f;
        _pm25History[i] = 0.0f;
        _pm10History[i] = 0.0f;
    }
}

bool APM2000Sensor::begin() {
    Serial.println("[SENSOR] Dang khoi tao ASAIR APM2000 tren UART2 (RX=16, TX=17, 1200 Baud)...");
    
    // Khởi tạo UART2: 1200 baud, 8 data bits, no parity, 1 stop bit (chuẩn ASAIR APM2000)
    _serial.begin(1200, SERIAL_8N1, PIN_APM2000_RX, PIN_APM2000_TX);
    
    // Làm sạch bộ đệm
    while (_serial.available() > 0) {
        _serial.read();
    }
    
    _rxIndex = 0;
    _consecutiveFailures = 0;
    _isInitialized = true;

    // Gửi lệnh truy vấn ban đầu để kiểm tra phản hồi
    sendQueryCommand();
    
    Serial.println("[SENSOR] ASAIR APM2000 da khoi tao thanh cong.");
    return true;
}

uint8_t APM2000Sensor::calculateChecksum(const uint8_t *data, size_t length) {
    uint32_t sum = 0;
    for (size_t i = 0; i < length; i++) {
        sum += data[i];
    }
    return static_cast<uint8_t>(sum & 0xFF);
}

void APM2000Sensor::sendQueryCommand() {
    // Lệnh truy vấn: FE A5 00 01 A6 (Đọc PM1.0, PM2.5, PM10)
    const uint8_t queryCmd[5] = { 0xFE, 0xA5, 0x00, 0x01, 0xA6 };
    _serial.write(queryCmd, sizeof(queryCmd));
    _serial.flush();
}

bool APM2000Sensor::read(DustReading &reading) {
    if (!_isInitialized) {
        reading.valid = false;
        return false;
    }

    // Đọc tất cả byte sẵn sàng từ UART vào buffer
    while (_serial.available() > 0) {
        uint8_t b = _serial.read();
        
        if (_rxIndex < RX_BUFFER_SIZE) {
            _rxBuffer[_rxIndex++] = b;
        } else {
            // Buffer tràn, shift dịch chuyển sang trái để tìm header mới
            memmove(_rxBuffer, _rxBuffer + 1, RX_BUFFER_SIZE - 1);
            _rxBuffer[RX_BUFFER_SIZE - 1] = b;
        }
    }

    // Tìm kiếm frame hợp lệ bắt đầu bằng 0xFE 0xA5
    for (size_t i = 0; i + 10 < _rxIndex; i++) {
        if (_rxBuffer[i] == 0xFE && _rxBuffer[i + 1] == 0xA5) {
            // Tìm thấy header tiềm năng, frame chuẩn có độ dài 11 bytes:
            // [0]=FE, [1]=A5, [2]=LenH, [3]=LenL, [4]=DF11, [5]=DF12, [6]=DF21, [7]=DF22, [8]=DF31, [9]=DF32, [10]=Checksum
            uint8_t calculatedCs = calculateChecksum(&_rxBuffer[i], 10);
            uint8_t expectedCs = _rxBuffer[i + 10];

            if (calculatedCs == expectedCs) {
                // Checksum hoàn toàn khớp
                bool parsed = parseFrame(&_rxBuffer[i], 11, reading);
                
                // Dọn dẹp dữ liệu đã xử lý khỏi buffer
                size_t consumed = i + 11;
                if (consumed < _rxIndex) {
                    memmove(_rxBuffer, _rxBuffer + consumed, _rxIndex - consumed);
                    _rxIndex -= consumed;
                } else {
                    _rxIndex = 0;
                }

                if (parsed) {
                    _consecutiveFailures = 0;
                    _readSuccessCount++;
                    // Gửi lệnh query tiếp theo cho chu kỳ đọc kế tiếp
                    sendQueryCommand();
                    return true;
                }
            } else {
                Serial.printf("[ERROR][SENSOR] Checksum khong khop! Nhan: 0x%02X, Tinh toan: 0x%02X\n", expectedCs, calculatedCs);
            }
        }
    }

#if DUSTGUARD_TEST_MODE == 1
    // Chế độ Self-Test Diagnostics khi chưa cắm cảm biến vật lý thực tế
    reading.pm1 = 15.0f;
    reading.pm25 = 28.5f;
    reading.pm10 = 55.0f;
    reading.valid = true;
    _consecutiveFailures = 0;
    _readSuccessCount++;
    return true;
#endif

    // Nếu sau 1 chu kỳ đọc không có gói tin hợp lệ
    _readFailureCount++;
    _consecutiveFailures++;
    reading.valid = false;

    // Gửi lại query command để kích hoạt cảm biến gửi frame
    sendQueryCommand();
    return false;
}

bool APM2000Sensor::parseFrame(const uint8_t *buffer, size_t length, DustReading &reading) {
    if (length < 11) {
        return false;
    }

    // Trích xuất nồng độ hạt bụi (High Byte * 256 + Low Byte)
    uint16_t rawPm1  = (static_cast<uint16_t>(buffer[4]) << 8) | buffer[5];
    uint16_t rawPm25 = (static_cast<uint16_t>(buffer[6]) << 8) | buffer[7];
    uint16_t rawPm10 = (static_cast<uint16_t>(buffer[8]) << 8) | buffer[9];

    float fPm1 = static_cast<float>(rawPm1);
    float fPm25 = static_cast<float>(rawPm25);
    float fPm10 = static_cast<float>(rawPm10);

    // Kiểm tra giới hạn vật lý nghiêm ngặt (0 - 2500 µg/m³)
    if (isnan(fPm1) || isnan(fPm25) || isnan(fPm10) ||
        isinf(fPm1) || isinf(fPm25) || isinf(fPm10) ||
        fPm1 < PHYSICAL_MIN_PM || fPm1 > PHYSICAL_MAX_PM ||
        fPm25 < PHYSICAL_MIN_PM || fPm25 > PHYSICAL_MAX_PM ||
        fPm10 < PHYSICAL_MIN_PM || fPm10 > PHYSICAL_MAX_PM) {
        Serial.printf("[ERROR][SENSOR] Gia tri do vuot nguong vat ly: PM1=%.1f, PM2.5=%.1f, PM10=%.1f\n", fPm1, fPm25, fPm10);
        return false;
    }

    // Cập nhật bộ lọc trung bình trượt
    updateRollingAverage(fPm1, fPm25, fPm10, reading);
    reading.valid = true;

    Serial.printf("[SENSOR] PM1.0=%.1f | PM2.5=%.1f | PM10=%.1f ug/m3\n", reading.pm1, reading.pm25, reading.pm10);
    return true;
}

void APM2000Sensor::updateRollingAverage(float pm1, float pm25, float pm10, DustReading &reading) {
    _pm1History[_historyIndex] = pm1;
    _pm25History[_historyIndex] = pm25;
    _pm10History[_historyIndex] = pm10;

    _historyIndex = (_historyIndex + 1) % ROLLING_AVG_SAMPLES;
    if (_historyCount < ROLLING_AVG_SAMPLES) {
        _historyCount++;
    }

    float sumPm1 = 0.0f;
    float sumPm25 = 0.0f;
    float sumPm10 = 0.0f;

    for (uint8_t i = 0; i < _historyCount; i++) {
        sumPm1 += _pm1History[i];
        sumPm25 += _pm25History[i];
        sumPm10 += _pm10History[i];
    }

    reading.pm1 = sumPm1 / static_cast<float>(_historyCount);
    reading.pm25 = sumPm25 / static_cast<float>(_historyCount);
    reading.pm10 = sumPm10 / static_cast<float>(_historyCount);
}

bool APM2000Sensor::isHealthy() const {
    return _isInitialized && (_consecutiveFailures < SENSOR_MAX_CONSECUTIVE_FAILURES);
}
