#ifndef DUSTGUARD_EVENT_DETECTOR_H
#define DUSTGUARD_EVENT_DETECTOR_H

#include "types.h"

class EventDetector {
public:
    static void evaluate(const SensorReading &reading, DerivedMetrics &metrics);
};

#endif // DUSTGUARD_EVENT_DETECTOR_H
