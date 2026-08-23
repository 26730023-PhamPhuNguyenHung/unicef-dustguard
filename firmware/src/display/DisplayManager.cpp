#include "display/DisplayManager.h"
#include <Wire.h>

DisplayManager::DisplayManager()
    : _display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, PIN_OLED_RESET),
      _isInitialized(false),
      _currentScreen(0),
      _lastScreenSwitchTime(0) {}

bool DisplayManager::begin() {
    Serial.println("[OLED] Khoi tao man hinh SSD1306 128x64 qua I2C (SDA=21, SCL=22, 0x3C)...");
    Wire.begin(PIN_OLED_SDA, PIN_OLED_SCL, 400000); // 400kHz Fast I2C

    if (!_display.begin(SSD1306_SWITCHCAPVCC, OLED_I2C_ADDRESS)) {
        Serial.println("[ERROR][OLED] Khong tim thay man hinh SSD1306 qua I2C!");
        _isInitialized = false;
        return false;
    }

    _display.clearDisplay();
    _display.setTextColor(SSD1306_WHITE);
    _display.setTextWrap(false);
    _display.display();

    _isInitialized = true;
    Serial.println("[OLED] SSD1306 da san sang.");
    return true;
}

void DisplayManager::showBootScreen(const char *message) {
    if (!_isInitialized) return;

    _display.clearDisplay();
    
    // Header Banner
    _display.setTextSize(1);
    _display.setCursor(18, 4);
    _display.print("DUSTGUARD VN");
    
    _display.drawFastHLine(0, 16, SCREEN_WIDTH, SSD1306_WHITE);

    // Subtitle
    _display.setTextSize(1);
    _display.setCursor(16, 24);
    _display.print("CivicTech Node");

    _display.setCursor(26, 36);
    _display.print("v" FIRMWARE_VERSION);

    // Dynamic Boot Step Message
    _display.drawFastHLine(0, 48, SCREEN_WIDTH, SSD1306_WHITE);
    _display.setCursor(4, 53);
    _display.print(message);

    _display.display();
}

void DisplayManager::showStatusMessage(const char *title, const char *line1, const char *line2) {
    if (!_isInitialized) return;

    _display.clearDisplay();

    _display.setTextSize(1);
    _display.setCursor(4, 4);
    _display.print(title);
    _display.drawFastHLine(0, 16, SCREEN_WIDTH, SSD1306_WHITE);

    _display.setCursor(4, 26);
    _display.print(line1);

    if (line2) {
        _display.setCursor(4, 42);
        _display.print(line2);
    }

    _display.display();
}

void DisplayManager::nextScreen() {
    _currentScreen = (_currentScreen + 1) % 3;
}

void DisplayManager::update(const DustReading &reading, const NetworkStatus &network, DeviceState state) {
    if (!_isInitialized) return;

    // Tự động luân phiên màn hình sau mỗi DISPLAY_PAGE_DURATION_SEC giây
    uint32_t now = millis();
    if (now - _lastScreenSwitchTime >= (DISPLAY_PAGE_DURATION_SEC * 1000)) {
        _lastScreenSwitchTime = now;
        nextScreen();
    }

    _display.clearDisplay();

    switch (_currentScreen) {
        case 0:
            renderPrimaryScreen(reading, network, state);
            break;
        case 1:
            renderMultiPMScreen(reading, network);
            break;
        case 2:
            renderSystemStatusScreen(network, state);
            break;
        default:
            renderPrimaryScreen(reading, network, state);
            break;
    }

    drawStatusBar(network, state);
    _display.display();
}

void DisplayManager::renderPrimaryScreen(const DustReading &reading, const NetworkStatus &network, DeviceState state) {
    // Header
    _display.setTextSize(1);
    _display.setCursor(4, 2);
    _display.print("DustGuard Node");

#if DUSTGUARD_TEST_MODE == 1
    _display.setCursor(92, 2);
    _display.print("[TEST]");
#endif

    _display.drawFastHLine(0, 12, SCREEN_WIDTH, SSD1306_WHITE);

    if (state == DeviceState::SENSOR_FAULT) {
        _display.setTextSize(1);
        _display.setCursor(14, 24);
        _display.print("SENSOR FAULT");
        _display.setCursor(10, 38);
        _display.print("Kiem tra UART APM");
        return;
    }

    // Label
    _display.setTextSize(1);
    _display.setCursor(4, 18);
    _display.print("PM2.5");

    // Large PM2.5 Value (Size 3)
    _display.setTextSize(3);
    _display.setCursor(20, 24);
    if (reading.valid) {
        _display.printf("%3.0f", reading.pm25);
    } else {
        _display.print(" --");
    }

    // Unit
    _display.setTextSize(1);
    _display.setCursor(84, 38);
    _display.print("ug/m3");
}

void DisplayManager::renderMultiPMScreen(const DustReading &reading, const NetworkStatus &network) {
    _display.setTextSize(1);
    _display.setCursor(4, 2);
    _display.print("Air Quality Metrics");
    _display.drawFastHLine(0, 12, SCREEN_WIDTH, SSD1306_WHITE);

    // PM1.0
    _display.setCursor(4, 16);
    _display.print("PM1.0 : ");
    if (reading.valid) _display.printf("%4.1f ug/m3", reading.pm1);
    else _display.print("----");

    // PM2.5
    _display.setCursor(4, 28);
    _display.print("PM2.5 : ");
    if (reading.valid) _display.printf("%4.1f ug/m3", reading.pm25);
    else _display.print("----");

    // PM10
    _display.setCursor(4, 40);
    _display.print("PM10  : ");
    if (reading.valid) _display.printf("%4.1f ug/m3", reading.pm10);
    else _display.print("----");
}

void DisplayManager::renderSystemStatusScreen(const NetworkStatus &network, DeviceState state) {
    _display.setTextSize(1);
    _display.setCursor(4, 2);
    _display.print("Device & Cloud Info");
    _display.drawFastHLine(0, 12, SCREEN_WIDTH, SSD1306_WHITE);

    // WiFi
    _display.setCursor(4, 16);
    _display.print("WiFi : ");
    if (network.wifiConnected) {
        _display.printf("ONLINE (%ddBm)", network.wifiRssi);
    } else {
        _display.print("DISCONNECTED");
    }

    // Cloud / API
    _display.setCursor(4, 28);
    _display.print("Cloud: ");
    if (network.cloudOnline) {
        _display.printf("SYNC (OK %u)", network.uploadSuccessCount);
    } else {
        _display.printf("WAIT (ERR %u)", network.uploadFailCount);
    }

    // Heap & Uptime
    _display.setCursor(4, 40);
    uint32_t uptimeMin = millis() / 60000;
    uint32_t freeKb = ESP.getFreeHeap() / 1024;
    _display.printf("Up:%um | Free:%ukB", uptimeMin, freeKb);
}

void DisplayManager::drawStatusBar(const NetworkStatus &network, DeviceState state) {
    _display.drawFastHLine(0, 52, SCREEN_WIDTH, SSD1306_WHITE);

    _display.setTextSize(1);
    _display.setCursor(4, 55);

    // Status word
    switch (state) {
        case DeviceState::BOOTING:
            _display.print("BOOTING...");
            break;
        case DeviceState::CONNECTING_WIFI:
            _display.print("CONNECTING...");
            break;
        case DeviceState::ONLINE:
            _display.print("ONLINE");
            break;
        case DeviceState::OFFLINE:
            _display.print("OFFLINE");
            break;
        case DeviceState::SENSOR_FAULT:
            _display.print("SENSOR ERR");
            break;
        case DeviceState::API_ERROR:
            _display.print("API ERR");
            break;
    }

    // Right indicators: WiFi dot & Cloud dot
    _display.setCursor(76, 55);
    _display.print("W:");
    _display.print(network.wifiConnected ? "OK" : "X");

    _display.setCursor(104, 55);
    _display.print("C:");
    _display.print(network.cloudOnline ? "OK" : "X");
}
