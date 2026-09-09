#ifndef DUSTGUARD_TOUCH_THEME_H
#define DUSTGUARD_TOUCH_THEME_H

#include <stdint.h>

/**
 * @brief Bảng màu Civic Tech High-Contrast chuẩn RGB565 (16-bit)
 * Giao diện Light Mode, nền sáng chữ đậm, tuyệt đối không dùng glassmorphism.
 */
namespace TouchTheme {
    // Màu nền & Khung
    constexpr uint16_t BG_CREAM        = 0xFFDE; // #FDFBF7 (Kem sáng)
    constexpr uint16_t CARD_BG         = 0xFFFF; // #FFFFFF (Thẻ trắng tinh)
    constexpr uint16_t CARD_SUBTLE     = 0xF7BE; // #F4EFE6 (Thẻ phụ ngà)
    constexpr uint16_t BORDER_LINE     = 0xCE59; // #D1C7B7 (Viền tương phản)
    
    // Màu chữ & Typography
    constexpr uint16_t TEXT_INK        = 0x20C2; // #231B14 (Nâu mực đậm)
    constexpr uint16_t TEXT_MUTED      = 0x632C; // #64748B (Xám trung tính)
    constexpr uint16_t TEXT_WHITE      = 0xFFFF; // #FFFFFF (Chữ trắng trên nền đậm)
    
    // Màu nhận diện & Cảnh báo (Accents)
    constexpr uint16_t TEAL_PRIMARY    = 0x0B6C; // #0D6F64 (Xanh mòng két Civic)
    constexpr uint16_t CRIMSON_ALERT   = 0x9923; // #9F241F (Đỏ dấu niêm phong)
    constexpr uint16_t AMBER_WARNING   = 0xDBC0; // #D97706 (Vàng hổ phách)
    constexpr uint16_t GREEN_GOOD      = 0x14A6; // #15803D (Xanh lá mức Tốt)
    constexpr uint16_t BLUE_PARTICLE   = 0x2479; // #2563EB (Xanh lam hạt PM1)
    
    // Kích thước chuẩn tương tác cảm ứng
    constexpr uint8_t MIN_TOUCH_TARGET = 44;     // Điểm chạm ngón tay >= 44px
    constexpr uint8_t BOTTOM_NAV_H     = 36;     // Chiều cao thanh điều hướng
    constexpr uint8_t HEADER_H         = 24;     // Chiều cao thanh tiêu đề
}

#endif // DUSTGUARD_TOUCH_THEME_H
