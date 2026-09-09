#ifndef DUSTGUARD_CASE_API_CLIENT_H
#define DUSTGUARD_CASE_API_CLIENT_H

#include "types.h"
#include <Arduino.h>

class CaseApiClient {
public:
    CaseApiClient();

    void configure(const char *baseUrl);

    // Gửi yêu cầu tạo hồ sơ phản ánh thật lên backend DustGuard
    bool createCase(const SensorReading &reading, const DerivedMetrics &metrics, 
                    const DeviceStatus &device, CaseHandoffData &outCase);

private:
    char _baseUrl[128];
};

#endif // DUSTGUARD_CASE_API_CLIENT_H
