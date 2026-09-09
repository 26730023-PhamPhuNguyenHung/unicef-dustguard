#ifndef DUSTGUARD_QRCODE_GENERATOR_H
#define DUSTGUARD_QRCODE_GENERATOR_H

#include <stdint.h>
#include <stddef.h>

class QRCodeGenerator {
public:
    static constexpr uint8_t QR_MAX_VERSION = 3;
    static constexpr uint8_t QR_SIZE = 29; // Version 3: 29x29 modules

    // Sinh ma trận QR boolean: true = module đen, false = module trắng
    static bool generate(const char *text, bool outMatrix[QR_SIZE][QR_SIZE]);

private:
    static void drawFinderPattern(bool matrix[QR_SIZE][QR_SIZE], int x, int y);
    static void drawTimingPatterns(bool matrix[QR_SIZE][QR_SIZE]);
};

#endif // DUSTGUARD_QRCODE_GENERATOR_H
