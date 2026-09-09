#include "ParticleAnalyzer.h"
#include <string.h>
#include <stdio.h>

void ParticleAnalyzer::analyze(const SensorReading &reading, DerivedMetrics &metrics, char *outInsight, size_t insightSize) {
    float pm1 = reading.pm1;
    float pm25 = reading.pm25;
    float pm10 = reading.pm10;

    // 1. Particle composition (3 fractions)
    metrics.pm1Fraction = pm1;
    metrics.pm1To25Fraction = (pm25 > pm1) ? (pm25 - pm1) : 0.0f;
    metrics.pm25To10Fraction = (pm10 > pm25) ? (pm10 - pm25) : 0.0f;

    // 2. Ratios
    metrics.pm25Pm10Ratio = (pm10 > 0.1f) ? (pm25 / pm10) : 0.0f;
    if (metrics.pm25Pm10Ratio > 1.0f) metrics.pm25Pm10Ratio = 1.0f;

    metrics.pm1Pm25Ratio = (pm25 > 0.1f) ? (pm1 / pm25) : 0.0f;
    if (metrics.pm1Pm25Ratio > 1.0f) metrics.pm1Pm25Ratio = 1.0f;

    // 3. Định tính insight
    if (outInsight && insightSize > 0) {
        if (metrics.pm25Pm10Ratio >= 0.65f) {
            snprintf(outInsight, insightSize, "Hạt mịn chiếm ưu thế (%.0f%% PM10). Nguồn từ đốt hoặc khí thải.", metrics.pm25Pm10Ratio * 100.0f);
        } else if (metrics.pm25Pm10Ratio <= 0.40f) {
            snprintf(outInsight, insightSize, "Bụi thô chiếm tỷ trọng lớn (%.0f%%). Nguồn từ đất cát, công trường.", (1.0f - metrics.pm25Pm10Ratio) * 100.0f);
        } else {
            snprintf(outInsight, insightSize, "Bụi phân bố hỗn hợp giữa hạt mịn và bụi thô.");
        }
    }
}
