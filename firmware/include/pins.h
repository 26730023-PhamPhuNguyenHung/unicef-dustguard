#ifndef DUSTGUARD_PINS_H
#define DUSTGUARD_PINS_H

#include <stdint.h>

// ==========================================
// OLED SSD1306 I2C Pinout
// ==========================================
constexpr int8_t PIN_OLED_SDA      = 21; // GPIO 21 - I2C SDA
constexpr int8_t PIN_OLED_SCL      = 22; // GPIO 22 - I2C SCL
constexpr int8_t PIN_OLED_RESET    = -1; // Reset chia sẻ qua nguồn ESP32

// ==========================================
// ASAIR APM2000 UART2 Pinout
// ==========================================
constexpr int8_t PIN_APM2000_RX    = 16; // GPIO 16 (ESP32 RX2 <- Nối chân TX Pin 5 của APM2000)
constexpr int8_t PIN_APM2000_TX    = 17; // GPIO 17 (ESP32 TX2 -> Nối chân RX Pin 4 của APM2000)
constexpr int8_t PIN_APM2000_SET   = -1; // Để hở / Nối 3V3 để chọn UART mode
constexpr int8_t PIN_APM2000_RESET = -1; // Để hở (kéo cao nội bộ)

// ==========================================
// Onboard LED / Status Indicator
// ==========================================
constexpr int8_t PIN_STATUS_LED    = 2;  // Onboard Blue LED trên ESP32 DevKit

#endif // DUSTGUARD_PINS_H
