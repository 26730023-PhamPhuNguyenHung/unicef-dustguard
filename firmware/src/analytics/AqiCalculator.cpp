#include "AqiCalculator.h"
#include <string.h>
#include <math.h>

// Breakpoints US EPA PM2.5
static const float EPA_PM25_BP[] = { 0.0f, 12.0f, 35.4f, 55.4f, 150.4f, 250.4f, 500.4f };
static const uint16_t EPA_AQI_BP[] = { 0, 50, 100, 150, 200, 300, 500 };

// Breakpoints US EPA PM10
static const float EPA_PM10_BP[] = { 0.0f, 54.0f, 154.0f, 254.0f, 354.0f, 424.0f, 604.0f };

// Breakpoints VN QCVN PM2.5
static const float VN_PM25_BP[] = { 0.0f, 25.0f, 50.0f, 80.0f, 150.0f, 350.0f, 500.0f };
static const uint16_t VN_AQI_BP[] = { 0, 50, 100, 150, 200, 300, 500 };

// Breakpoints VN QCVN PM10
static const float VN_PM10_BP[] = { 0.0f, 50.0f, 150.0f, 250.0f, 350.0f, 420.0f, 600.0f };

uint16_t AqiCalculator::calcSubIndex(float conc, const float *bp, const uint16_t *aqiBp, size_t n) {
    if (conc <= 0.0f) return 0;
    if (conc >= bp[n - 1]) return 500;

    for (size_t i = 0; i < n - 1; i++) {
        if (conc >= bp[i] && conc <= bp[i + 1]) {
            float bpLo = bp[i];
            float bpHi = bp[i + 1];
            float iLo = (float)aqiBp[i];
            float iHi = (float)aqiBp[i + 1];
            float aqi = ((iHi - iLo) / (bpHi - bpLo)) * (conc - bpLo) + iLo;
            return (uint16_t)roundf(aqi);
        }
    }
    return 0;
}

void AqiCalculator::calculate(float pm25, float pm10, AqiStandard standard, 
                              uint16_t &outAqi, char *outCategory, size_t catSize, 
                              char *outDominant, size_t domSize) {
    uint16_t aqi25 = 0;
    uint16_t aqi10 = 0;

    if (standard == AqiStandard::US_EPA) {
        aqi25 = calcSubIndex(pm25, EPA_PM25_BP, EPA_AQI_BP, 7);
        aqi10 = calcSubIndex(pm10, EPA_PM10_BP, EPA_AQI_BP, 7);
    } else {
        aqi25 = calcSubIndex(pm25, VN_PM25_BP, VN_AQI_BP, 7);
        aqi10 = calcSubIndex(pm10, VN_PM10_BP, VN_AQI_BP, 7);
    }

    if (aqi25 >= aqi10) {
        outAqi = aqi25;
        if (outDominant) strncpy(outDominant, "PM2.5", domSize - 1);
    } else {
        outAqi = aqi10;
        if (outDominant) strncpy(outDominant, "PM10", domSize - 1);
    }

    const char *cat = "Tốt";
    if (outAqi <= 50) {
        cat = "Tốt";
    } else if (outAqi <= 100) {
        cat = "Trung bình";
    } else if (outAqi <= 150) {
        cat = "Kém";
    } else if (outAqi <= 200) {
        cat = "Xấu";
    } else if (outAqi <= 300) {
        cat = "Rất xấu";
    } else {
        cat = "Nguy hại";
    }

    if (outCategory) {
        strncpy(outCategory, cat, catSize - 1);
        outCategory[catSize - 1] = '\0';
    }
}
