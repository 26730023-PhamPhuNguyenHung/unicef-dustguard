#ifndef DUSTGUARD_AQI_CALCULATOR_H
#define DUSTGUARD_AQI_CALCULATOR_H

#include <stdint.h>
#include "types.h"

class AqiCalculator {
public:
    static void calculate(float pm25, float pm10, AqiStandard standard, 
                          uint16_t &outAqi, char *outCategory, size_t catSize, 
                          char *outDominant, size_t domSize);

private:
    static uint16_t calcSubIndex(float conc, const float *bp, const uint16_t *aqiBp, size_t n);
};

#endif // DUSTGUARD_AQI_CALCULATOR_H
