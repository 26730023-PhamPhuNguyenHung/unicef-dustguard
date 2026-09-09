#ifndef DUSTGUARD_PARTICLE_ANALYZER_H
#define DUSTGUARD_PARTICLE_ANALYZER_H

#include "types.h"

class ParticleAnalyzer {
public:
    static void analyze(const SensorReading &reading, DerivedMetrics &metrics, char *outInsight, size_t insightSize);
};

#endif // DUSTGUARD_PARTICLE_ANALYZER_H
