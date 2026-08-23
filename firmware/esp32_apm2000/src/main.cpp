#include <Arduino.h>

// Bo mach: NodeMCU-32S (Ai-Thinker 38 pins)
// Cam bien: ASAIR APM2000 (Chuan 1200 baud theo Datasheet chinh hang Aosong)
#define RX_PIN 16 // P16 <--- Day Tim (TX APM2000)
#define TX_PIN 17 // P17 ---> Day Cam (RX APM2000)
#define LED_PIN 2

HardwareSerial APM(2);

const uint8_t READ_ALL[] = {0xFE, 0xA5, 0x00, 0x01, 0xA6};

uint8_t rxBuffer[128];
int rxLen = 0;
unsigned long readingCount = 0;
unsigned long lastQuery = 0;

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);
  delay(1000);

  Serial.println("\n=======================================================");
  Serial.println("   DUSTGUARD VN - DANG DOC APM2000 (CHUAN 1200 BAUD)   ");
  Serial.println("=======================================================");
  Serial.println("Cau hinh phan cung:");
  Serial.println(" - Baudrate : 1200 bps (8N1)");
  Serial.println(" - ESP32 RX : P16 (GPIO 16) <--- Day Tim (TX cam bien)");
  Serial.println(" - ESP32 TX : P17 (GPIO 17) ---> Day Cam (RX cam bien)");
  Serial.println(" - Nguon    : 5V (Do) | GND (Den) | SET (Xanh la cắm 3V3 hoac de ho)");
  Serial.println("=======================================================\n");

  APM.begin(1200, SERIAL_8N1, RX_PIN, TX_PIN);
}

void parseAPM2000(uint8_t *buf, int len) {
  // Giai ma goi tin 11 bytes: FE A5 02 00 DF11 DF12 DF21 DF22 DF31 DF32 CS
  for (int i = 0; i <= len - 11; i++) {
    if (buf[i] == 0xFE && buf[i + 1] == 0xA5) {
      readingCount++;
      uint16_t pm1_0 = ((uint16_t)buf[i + 4] << 8) | buf[i + 5];
      uint16_t pm2_5 = ((uint16_t)buf[i + 6] << 8) | buf[i + 7];
      uint16_t pm10  = ((uint16_t)buf[i + 8] << 8) | buf[i + 9];

      digitalWrite(LED_PIN, HIGH);
      Serial.println("\n******************************************************************");
      Serial.printf(">>> [DUSTGUARD VN #%04lu] DU LIEU BUI MIN THUC TE TU APM2000:\n", readingCount);
      Serial.printf("    - Bụi siêu mịn PM 1.0 : %4d ug/m3\n", pm1_0);
      Serial.printf("    - Bụi mịn      PM 2.5 : %4d ug/m3\n", pm2_5);
      Serial.printf("    - Bụi thô      PM 10  : %4d ug/m3\n", pm10);
      
      if (pm2_5 <= 12) {
        Serial.println("    - Đánh giá chất lượng : TỐT (Xanh lá - Không khí sạch)");
      } else if (pm2_5 <= 35) {
        Serial.println("    - Đánh giá chất lượng : TRUNG BÌNH (Vàng - Chấp nhận được)");
      } else if (pm2_5 <= 55) {
        Serial.println("    - Đánh giá chất lượng : KÉM (Cam - Nhạy cảm cần lưu ý)");
      } else if (pm2_5 <= 150) {
        Serial.println("    - Đánh giá chất lượng : XẤU (Đỏ - Nên đeo khẩu trang chống bụi)");
      } else {
        Serial.println("    - Đánh giá chất lượng : NGUY HẠI (Tím - Cảnh báo ô nhiễm nặng)");
      }
      Serial.println("******************************************************************\n");
      delay(80);
      digitalWrite(LED_PIN, LOW);
      return;
    }
  }

  // Fallback in raw bytes
  Serial.printf("[Nhan duoc %d bytes @ 1200 baud]: ", len);
  for (int i = 0; i < len; i++) Serial.printf("%02X ", buf[i]);
  Serial.println();
}

void loop() {
  while (APM.available() && rxLen < 128) {
    rxBuffer[rxLen++] = APM.read();
  }

  if (millis() - lastQuery >= 1200) {
    lastQuery = millis();

    if (rxLen > 0) {
      parseAPM2000(rxBuffer, rxLen);
      rxLen = 0;
    } else {
      Serial.println("[Dang chay] Da gui query FE A5 00 01 A6 @ 1200 baud -> Dang cho tra ve tren P16...");
    }

    while (APM.available()) APM.read();
    rxLen = 0;
    APM.write(READ_ALL, sizeof(READ_ALL));
  }
}
