#ifndef DUSTGUARD_ROLLING_STATS_H
#define DUSTGUARD_ROLLING_STATS_H

#include "types.h"
#include "config.h"

class RollingStats {
public:
    RollingStats();

    void addSample(const SensorReading &reading);
    void compute(DerivedMetrics &metrics);
    
    // Lấy chuỗi điểm cho đồ thị (0 - 60 điểm gần nhất)
    uint8_t getGraphPoints(float *outPoints, uint8_t maxPoints) const;

    void reset();

private:
    float _pm25Buffer[ROLLING_BUFFER_5M_SIZE];
    float _pm10Buffer[ROLLING_BUFFER_5M_SIZE];
    uint32_t _timeBuffer[ROLLING_BUFFER_5M_SIZE];
    uint16_t _head;
    uint16_t _count;

    float _peakPm25;
    float _peakPm10;
    char _peakTimeStr[16];

    double _cumulativeExposure; // PM2.5 * sec
    uint32_t _lastSampleTimeMs;
};

#endif // DUSTGUARD_ROLLING_STATS_H
