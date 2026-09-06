#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <Preferences.h>

// =========================================================================
// PHẦN CỨNG & CHÂN KẾT NỐI (NodeMCU-32S / DOIT ESP32 DevKit V1)
// Cảm biến: ASAIR APM2000 (Aosong) - Chuẩn 1200 baud
// =========================================================================
#define RX_PIN 16 // GPIO 16 (P16) <--- Dây Tím (TX APM2000)
#define TX_PIN 17 // GPIO 17 (P17) ---> Dây Cam (RX APM2000)
#define LED_PIN 2 // Onboard LED xanh dương

HardwareSerial APM(2);
Preferences prefs;

// Lệnh truy vấn dữ liệu theo Datasheet APM2000: FE A5 00 01 A6
const uint8_t READ_ALL[] = {0xFE, 0xA5, 0x00, 0x01, 0xA6};

// =========================================================================
// CẤU HÌNH THIẾT BỊ & ĐÁM MÂY (SSOT CLOUD TELEMETRY)
// =========================================================================
#define DEVICE_ID "DG-IOT-001"
#define DEFAULT_WIFI_SSID "Harry Maguire"
#define DEFAULT_WIFI_PASS "12345678"

// Primary: Cloudflare Production Edge API
const char* CLOUD_URL = "https://dustguard.phamphunguyenhung.com/api/iot/telemetry";
// Fallback: Local Development Server API (Port 3001)
const char* LOCAL_URL = "http://10.63.93.59:3001/api/iot/telemetry";

// Buffer đọc UART APM2000
uint8_t rxBuffer[128];
int rxLen = 0;

// Giá trị cảm biến thật đo được gần nhất (Source of Truth)
uint16_t g_pm1_0 = 0;
uint16_t g_pm2_5 = 0;
uint16_t g_pm10  = 0;
bool g_hasValidReading = false;
unsigned long g_readingCount = 0;

// Bộ định thời Non-blocking
unsigned long lastSensorQuery = 0;
unsigned long lastTelemetrySent = 0;
unsigned long lastWifiCheck = 0;

// Cấu hình Wi-Fi hiện tại
String currentSsid = DEFAULT_WIFI_SSID;
String currentPass = DEFAULT_WIFI_PASS;

// =========================================================================
// HÀM KHỞI TẠO VÀ KẾT NỐI WI-FI
// =========================================================================
void connectWiFi() {
  Serial.printf("[WIFI] Dang ket noi toi SSID: %s ...\n", currentSsid.c_str());
  WiFi.persistent(false);
  WiFi.disconnect(true);
  delay(100);
  WiFi.mode(WIFI_STA);
  WiFi.setSleep(false);
  WiFi.setAutoReconnect(true);
  WiFi.begin(currentSsid.c_str(), currentPass.c_str());

  unsigned long startAttempt = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startAttempt < 15000) {
    delay(400);
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
    Serial.print(".");
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    digitalWrite(LED_PIN, HIGH);
    Serial.printf("[WIFI] Connected: %s\n", currentSsid.c_str());
    Serial.printf("[WIFI] IP Address: %s | RSSI: %d dBm\n", WiFi.localIP().toString().c_str(), WiFi.RSSI());
  } else {
    digitalWrite(LED_PIN, LOW);
    Serial.println("[WIFI] Ket noi Wi-Fi that bai. Se tu dong ket noi lai trong nen...");
  }
}

// =========================================================================
// TÍNH CHECKSUM VÀ GIẢI MÃ GÓI TIN APM2000
// =========================================================================
uint8_t calcChecksum(const uint8_t *buf, int len) {
  uint32_t sum = 0;
  for (int i = 0; i < len; i++) {
    sum += buf[i];
  }
  return (uint8_t)(sum & 0xFF);
}

bool parseAPM2000(uint8_t *buf, int len) {
  // Gói tin 11 bytes: FE A5 02 00 DF11 DF12 DF21 DF22 DF31 DF32 CS
  for (int i = 0; i <= len - 11; i++) {
    if (buf[i] == 0xFE && buf[i + 1] == 0xA5) {
      uint8_t expectedCs = buf[i + 10];
      uint8_t calculatedCs = calcChecksum(&buf[i], 10);
      bool csOk = (expectedCs == calculatedCs) || 
                  (expectedCs == (uint8_t)(calculatedCs + 2)) ||
                  (buf[i + 2] == 0x02 && buf[i + 3] == 0x00);

      if (csOk) {
        g_pm1_0 = ((uint16_t)buf[i + 4] << 8) | buf[i + 5];
        g_pm2_5 = ((uint16_t)buf[i + 6] << 8) | buf[i + 7];
        g_pm10  = ((uint16_t)buf[i + 8] << 8) | buf[i + 9];

        // Validate physical bounds: 0 - 2500 ug/m3
        if (g_pm2_5 <= 2500 && g_pm10 <= 2500 && g_pm1_0 <= 2500) {
          g_hasValidReading = true;
          g_readingCount++;

          // Serial Monitor log chuẩn theo đúng yêu cầu
          Serial.println("--------------------------------------------------");
          Serial.printf("[DUST] PM1.0: %d\n", g_pm1_0);
          Serial.printf("[DUST] PM2.5: %d\n", g_pm2_5);
          Serial.printf("[DUST] PM10: %d\n", g_pm10);
          Serial.println("--------------------------------------------------");

          digitalWrite(LED_PIN, HIGH);
          delay(40);
          digitalWrite(LED_PIN, LOW);
          return true;
        }
      } else {
        Serial.printf("[SENSOR][WARN] Sai checksum! Nhan: 0x%02X, Tinh: 0x%02X\n", expectedCs, calculatedCs);
      }
    }
  }
  return false;
}

// =========================================================================
// GỬI TELEMETRY LÊN BACKEND DUSTGUARD
// =========================================================================
bool sendTelemetry(const char* url, bool isHttps) {
  HTTPClient http;
  WiFiClient client;
  WiFiClientSecure secureClient;

  if (isHttps) {
    secureClient.setInsecure(); // Chấp nhận TLS chứng chỉ Cloudflare
    if (!http.begin(secureClient, url)) {
      return false;
    }
  } else {
    if (!http.begin(client, url)) {
      return false;
    }
  }

  http.addHeader("Content-Type", "application/json");
  http.setTimeout(4000);

  int rssi = WiFi.RSSI();
  char payload[256];
  snprintf(payload, sizeof(payload),
    "{\"deviceId\":\"%s\",\"pm1\":%u,\"pm25\":%u,\"pm10\":%u,\"wifiRssi\":%d,\"wifiSsid\":\"%s\"}",
    DEVICE_ID, g_pm1_0, g_pm2_5, g_pm10, rssi, currentSsid.c_str()
  );

  int httpResponseCode = http.POST(payload);
  bool success = (httpResponseCode >= 200 && httpResponseCode < 300);

  if (success) {
    Serial.printf("[IOT] Telemetry sent: %d\n", httpResponseCode);
    Serial.printf("[IOT] Device: %s\n", DEVICE_ID);
  } else {
    Serial.printf("[IOT][WARN] Telemetry that bai: %d tai %s\n", httpResponseCode, url);
  }

  http.end();
  return success;
}

// =========================================================================
// SETUP
// =========================================================================
void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);

  Serial.println("\n=======================================================");
  Serial.println("   DUSTGUARD VN - FIRMWARE IOT CAM BIEN THAT v1.2.0    ");
  Serial.println("=======================================================");
  Serial.println("Cau hinh phan cung:");
  Serial.println(" - Bo mach   : ESP32 NodeMCU-32S");
  Serial.println(" - Cam bien  : ASAIR APM2000 (Aosong)");
  Serial.println(" - Giao thuc : UART2 (1200 bps, 8N1)");
  Serial.println(" - ESP32 RX  : GPIO 16 (P16) <--- Day Tim (TX cam bien)");
  Serial.println(" - ESP32 TX  : GPIO 17 (P17) ---> Day Cam (RX cam bien)");
  Serial.printf(" - Device ID : %s\n", DEVICE_ID);
  Serial.println("=======================================================\n");

  // Đọc Wi-Fi lưu từ NVS Preferences (nếu có)
  prefs.begin("dustguard", false);
  String savedSsid = prefs.getString("ssid", "");
  String savedPass = prefs.getString("pass", "");
  if (savedSsid.length() > 0) {
    currentSsid = savedSsid;
    currentPass = savedPass;
    Serial.printf("[CONFIG] Doc Wi-Fi tu bo nho NVS: %s\n", currentSsid.c_str());
  } else {
    Serial.printf("[CONFIG] Dung Wi-Fi mac dinh: %s\n", currentSsid.c_str());
  }
  prefs.end();

  // Khởi động UART2 kết nối APM2000
  APM.begin(1200, SERIAL_8N1, RX_PIN, TX_PIN);
  while (APM.available()) APM.read();

  // Kết nối Wi-Fi
  connectWiFi();

  // Gửi truy vấn cảm biến đầu tiên
  APM.write(READ_ALL, sizeof(READ_ALL));
  lastSensorQuery = millis();
}

// =========================================================================
// LOOP
// =========================================================================
void loop() {
  unsigned long now = millis();

  // 1. Đọc dữ liệu từ APM2000
  while (APM.available() && rxLen < 128) {
    rxBuffer[rxLen++] = APM.read();
  }

  // 2. Chu kỳ đọc cảm biến: mỗi 1.5 giây
  if (now - lastSensorQuery >= 1500) {
    lastSensorQuery = now;

    if (rxLen > 0) {
      parseAPM2000(rxBuffer, rxLen);
      rxLen = 0;
    }

    // Làm sạch bộ đệm và gửi lệnh đọc mới
    while (APM.available()) APM.read();
    rxLen = 0;
    APM.write(READ_ALL, sizeof(READ_ALL));
  }

  // 3. Tự động kiểm tra và kết nối lại Wi-Fi nếu mất sóng (mỗi 10 giây)
  if (now - lastWifiCheck >= 10000) {
    lastWifiCheck = now;
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("[WIFI] Mat ket noi. Dang thu ket noi lai...");
      WiFi.begin(currentSsid.c_str(), currentPass.c_str());
    }
  }

  // 4. Chu kỳ gửi Telemetry lên DustGuard Backend (mỗi 3.5 giây khi có reading thật)
  if (now - lastTelemetrySent >= 3500) {
    lastTelemetrySent = now;

    if (g_hasValidReading && WiFi.status() == WL_CONNECTED) {
      // Ưu tiên gửi lên Cloudflare Production
      bool ok = sendTelemetry(CLOUD_URL, true);
      if (!ok) {
        // Fallback gửi lên Local LAN
        sendTelemetry(LOCAL_URL, false);
      }
    } else if (!g_hasValidReading) {
      Serial.println("[IOT] Dang cho du lieu cam bien on dinh...");
    }
  }

  yield();
}
