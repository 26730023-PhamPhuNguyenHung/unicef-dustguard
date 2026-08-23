#ifndef DUSTGUARD_DISPLAY_MANAGER_H
#define DUSTGUARD_DISPLAY_MANAGER_H

#include <Arduino.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "config.h"
#include "pins.h"
#include "types.h"

/**
 * @brief Quản lý hiển thị màn hình OLED SSD1306 (128x64 I2C)
 * Hiển thị rõ ràng, độ tương phản cao, tối ưu chống nhấp nháy (anti-flicker),
 * luân phiên hiển thị chỉ số bụi và trạng thái kết nối mạng/đám mây.
 */
class DisplayManager {
public:
    DisplayManager();

    /**
     * @brief Khởi tạo màn hình I2C SSD1306
     */
    bool begin();

    /**
     * @brief Hiển thị màn hình khởi động (Boot screen)
     */
    void showBootScreen(const char *message = "Starting...");

    /**
     * @brief Cập nhật giao diện chính với số liệu bụi và trạng thái mạng
     */
    void update(const DustReading &reading, const NetworkStatus &network, DeviceState state);

    /**
     * @brief Hiển thị thông báo trạng thái hoặc lỗi cụ thể
     */
    void showStatusMessage(const char *title, const char *line1, const char *line2 = nullptr);

    /**
     * @brief Chuyển đổi trang hiển thị
     */
    void nextScreen();

private:
    Adafruit_SSD1306 _display;
    bool _isInitialized;
    uint8_t _currentScreen; // 0 = Primary PM2.5, 1 = Multi PM, 2 = System Status
    uint32_t _lastScreenSwitchTime;

    void renderPrimaryScreen(const DustReading &reading, const NetworkStatus &network, DeviceState state);
    void renderMultiPMScreen(const DustReading &reading, const NetworkStatus &network);
    void renderSystemStatusScreen(const NetworkStatus &network, DeviceState state);
    void drawStatusBar(const NetworkStatus &network, DeviceState state);
};

#endif // DUSTGUARD_DISPLAY_MANAGER_H
