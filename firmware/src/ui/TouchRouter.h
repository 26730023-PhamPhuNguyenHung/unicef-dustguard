#ifndef DUSTGUARD_TOUCH_ROUTER_H
#define DUSTGUARD_TOUCH_ROUTER_H

#include <stdint.h>
#include <stddef.h>
#include "types.h"
#include "TouchTheme.h"
#include "QRCodeGenerator.h"
#include "../network/CaseApiClient.h"
#include "../analytics/RollingStats.h"

enum ScreenId : uint8_t {
    SCREEN_LIVE = 0,
    SCREEN_PARTICLE_PROFILE = 1,
    SCREEN_TREND = 2,
    SCREEN_AIR_EVENT = 3,
    SCREEN_PROCESS_FLOW = 4,
    SCREEN_CREATE_CASE = 5,
    SCREEN_QR_HANDOFF = 6,
    SCREEN_DEVICE = 7,
    SCREEN_SENSOR_DIAGNOSTICS = 8,
    SCREEN_SETTINGS = 9
};

/**
 * @brief Interface hiển thị trừu tượng cho Touch Display
 */
class ITouchDisplay {
public:
    virtual ~ITouchDisplay() = default;
    virtual void fillScreen(uint16_t color) = 0;
    virtual void fillRect(int16_t x, int16_t y, int16_t w, int16_t h, uint16_t color) = 0;
    virtual void drawRect(int16_t x, int16_t y, int16_t w, int16_t h, uint16_t color) = 0;
    virtual void fillRoundRect(int16_t x, int16_t y, int16_t w, int16_t h, int16_t r, uint16_t color) = 0;
    virtual void drawRoundRect(int16_t x, int16_t y, int16_t w, int16_t h, int16_t r, uint16_t color) = 0;
    virtual void drawLine(int16_t x0, int16_t y0, int16_t x1, int16_t y1, uint16_t color) = 0;
    virtual void drawText(int16_t x, int16_t y, const char *text, uint16_t color, uint8_t size = 1) = 0;
};

class TouchRouter {
public:
    TouchRouter(CaseApiClient *caseApi, RollingStats *rollingStats);

    void begin();
    void render(ITouchDisplay &gfx, const SensorReading &reading, 
                const DerivedMetrics &metrics, const DeviceStatus &device);

    // Xử lý sự kiện chạm cảm ứng
    bool handleTouch(uint16_t x, uint16_t y, const SensorReading &reading, 
                     const DerivedMetrics &metrics, const DeviceStatus &device);

    void navigateTo(ScreenId screen);
    ScreenId currentScreen() const { return _currentScreen; }

    const CaseHandoffData& getCaseHandoff() const { return _caseData; }

    // Callback khi trigger test sensor
    void setSensorTestCallback(void (*cb)()) { _testSensorCb = cb; }

private:
    ScreenId _currentScreen;
    CaseApiClient *_caseApi;
    RollingStats *_rollingStats;
    CaseHandoffData _caseData;
    uint32_t _lastTouchTime;
    void (*_testSensorCb)();

    // Cài đặt cấu hình demo trong Settings
    AqiStandard _aqiStandard;
    uint8_t _alertSensitivity; // 0 = Bình thường, 1 = Nhạy, 2 = Demo

    // Render từng màn hình
    void renderHeader(ITouchDisplay &gfx, const DeviceStatus &device);
    void renderBottomNav(ITouchDisplay &gfx);

    void renderScreenLive(ITouchDisplay &gfx, const SensorReading &reading, const DerivedMetrics &metrics);
    void renderScreenProfile(ITouchDisplay &gfx, const SensorReading &reading, const DerivedMetrics &metrics);
    void renderScreenTrend(ITouchDisplay &gfx, const DerivedMetrics &metrics);
    void renderScreenAirEvent(ITouchDisplay &gfx, const SensorReading &reading, const DerivedMetrics &metrics);
    void renderScreenProcessFlow(ITouchDisplay &gfx);
    void renderScreenCreateCase(ITouchDisplay &gfx, const SensorReading &reading, const DerivedMetrics &metrics, const DeviceStatus &device);
    void renderScreenQRHandoff(ITouchDisplay &gfx);
    void renderScreenDevice(ITouchDisplay &gfx, const DeviceStatus &device);
    void renderScreenDiagnostics(ITouchDisplay &gfx, const DeviceStatus &device);
    void renderScreenSettings(ITouchDisplay &gfx);
};

#endif // DUSTGUARD_TOUCH_ROUTER_H
