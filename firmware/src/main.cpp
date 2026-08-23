#include <Arduino.h>
#include "config.h"
#include "pins.h"
#include "types.h"
#include "secrets.h"

#include "sensors/APM2000Sensor.h"
#include "display/DisplayManager.h"
#include "network/WiFiManager.h"
#include "network/ApiClient.h"
#include "telemetry/TelemetryManager.h"
#include "system/DeviceHealth.h"

// =========================================================================
// Global System Singletons
// =========================================================================
static APM2000Sensor    g_sensor;
static DisplayManager   g_display;
static WiFiManager      g_wifi;
static ApiClient        g_apiClient;
static TelemetryManager g_telemetry;
static DeviceHealth     g_health;

// Runtime State
static DustReading      g_currentReading;
static NetworkStatus    g_networkStatus;
static bool             g_isBooting = true;

// Non-blocking Timers
static uint32_t         g_lastSensorReadTime = 0;
static uint32_t         g_lastDisplayUpdateTime = 0;

// =========================================================================
// Setup Routine
// =========================================================================
void setup() {
    // 1. Initialize Serial for high-speed debugging
    Serial.begin(115200);
    delay(200);

    Serial.println("\n==================================================");
    Serial.printf("[BOOT] %s v%s\n", FIRMWARE_NAME, FIRMWARE_VERSION);
    Serial.printf("[BOOT] Hardware: %s\n", HARDWARE_TARGET);
    Serial.printf("[BOOT] Free Heap: %u bytes\n", ESP.getFreeHeap());
    Serial.println("==================================================");

    // 2. Initialize Status LED
    pinMode(PIN_STATUS_LED, OUTPUT);
    digitalWrite(PIN_STATUS_LED, HIGH);

    // 3. Initialize OLED Display & show first boot screen
    g_display.begin();
    g_display.showBootScreen("Khoi tao he thong...");
    delay(400);

    // 4. Initialize ASAIR APM2000 Dust Sensor
    g_display.showBootScreen("Kiem tra APM2000...");
    g_sensor.begin();
    delay(400);

    // 5. Initialize WiFi & NTP Synchronization
    g_display.showBootScreen("Ket noi Wi-Fi & NTP...");
    g_wifi.begin(WIFI_SSID, WIFI_PASSWORD);

    // 6. Configure Cloud API Client & Telemetry Engine
    g_apiClient.configure(API_BASE_URL, API_TELEMETRY_PATH);
    g_telemetry.begin(DEVICE_SENSOR_CODE, DEVICE_SECRET_KEY, &g_apiClient, &g_wifi);

    g_isBooting = false;
    digitalWrite(PIN_STATUS_LED, LOW);

    Serial.println("[BOOT] Khoi dong hoan tat! Chuyen sang che do quan trac...");
}

// =========================================================================
// Main Loop (Non-blocking Cooperative Scheduler)
// =========================================================================
void loop() {
    uint32_t now = millis();

    // 1. Update WiFi Network Status & NTP Sync
    g_wifi.update(g_networkStatus);

    // 2. Scheduler: Read Sensor Data (Every 2000 ms)
    if (now - g_lastSensorReadTime >= SENSOR_READ_INTERVAL_MS) {
        g_lastSensorReadTime = now;

        bool readOk = g_sensor.read(g_currentReading);
        if (readOk) {
            // Đưa mẫu đo hợp lệ vào hàng đợi telemetry
            g_telemetry.recordReading(g_currentReading);
            // Nhấp nháy nhẹ LED báo trạng thái đọc dữ liệu
            digitalWrite(PIN_STATUS_LED, HIGH);
        } else {
            digitalWrite(PIN_STATUS_LED, LOW);
        }

        // Cập nhật chẩn đoán sức khỏe hệ thống
        g_health.update(g_sensor, g_networkStatus, g_currentReading);
    } else {
        // Tắt LED sau chu kỳ đọc
        if (now - g_lastSensorReadTime > 100) {
            digitalWrite(PIN_STATUS_LED, LOW);
        }
    }

    // 3. Scheduler: Update OLED Display (Every 1000 ms)
    if (now - g_lastDisplayUpdateTime >= DISPLAY_UPDATE_INTERVAL_MS) {
        g_lastDisplayUpdateTime = now;

        DeviceState currentState = g_health.evaluateState(g_sensor, g_networkStatus, g_isBooting);
        g_display.update(g_currentReading, g_networkStatus, currentState);
    }

    // 4. Scheduler: Upload Telemetry to Cloud API (Every 15s or Backoff Schedule)
    if (g_telemetry.shouldUpload()) {
        g_telemetry.uploadLatest(g_networkStatus);
    }

    // Nhường CPU cho ESP32 RTOS background tasks (WiFi, TCP/IP stack)
    yield();
}
