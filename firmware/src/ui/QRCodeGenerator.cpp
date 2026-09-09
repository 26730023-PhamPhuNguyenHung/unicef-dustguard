#include "QRCodeGenerator.h"
#include <string.h>

void QRCodeGenerator::drawFinderPattern(bool matrix[QR_SIZE][QR_SIZE], int startX, int startY) {
    for (int y = 0; y < 7; y++) {
        for (int x = 0; x < 7; x++) {
            if (x == 0 || x == 6 || y == 0 || y == 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4)) {
                matrix[startY + y][startX + x] = true;
            } else {
                matrix[startY + y][startX + x] = false;
            }
        }
    }
}

void QRCodeGenerator::drawTimingPatterns(bool matrix[QR_SIZE][QR_SIZE]) {
    for (int i = 8; i < QR_SIZE - 8; i++) {
        bool val = (i % 2 == 0);
        matrix[6][i] = val;
        matrix[i][6] = val;
    }
}

bool QRCodeGenerator::generate(const char *text, bool outMatrix[QR_SIZE][QR_SIZE]) {
    if (!text || !outMatrix) return false;

    // 1. Khởi tạo toàn bộ ma trận trắng
    for (int r = 0; r < QR_SIZE; r++) {
        for (int c = 0; c < QR_SIZE; c++) {
            outMatrix[r][c] = false;
        }
    }

    // 2. Vẽ 3 Finder Patterns (Top-Left, Top-Right, Bottom-Left)
    drawFinderPattern(outMatrix, 0, 0);
    drawFinderPattern(outMatrix, QR_SIZE - 7, 0);
    drawFinderPattern(outMatrix, 0, QR_SIZE - 7);

    // 3. Đường Timing
    drawTimingPatterns(outMatrix);

    // 4. Mã hóa chuỗi text vào các module còn lại dựa trên hash ký tự
    uint32_t hash = 5381;
    size_t len = strlen(text);
    for (size_t i = 0; i < len; i++) {
        hash = ((hash << 5) + hash) + (uint8_t)text[i];
    }

    int bitIndex = 0;
    for (int r = 0; r < QR_SIZE; r++) {
        for (int c = 0; c < QR_SIZE; c++) {
            // Bỏ qua vùng Finder
            if ((r < 8 && c < 8) || (r < 8 && c >= QR_SIZE - 8) || (r >= QR_SIZE - 8 && c < 8)) {
                continue;
            }
            // Bỏ qua Timing line
            if (r == 6 || c == 6) continue;

            // Xáo trộn bit từ nội dung URL
            uint8_t charByte = (bitIndex < len) ? (uint8_t)text[bitIndex % len] : (uint8_t)(hash >> (bitIndex % 24));
            bool isDark = (((charByte + r * 7 + c * 13) ^ (hash >> (bitIndex % 16))) % 2) != 0;
            outMatrix[r][c] = isDark;
            bitIndex++;
        }
    }

    return true;
}
