#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🎨 DUSTGUARD VN — MOTION GRAPHICS & CIVIC OVERLAY BUILDER
Sinh các lớp đồ họa tĩnh và động chuẩn Civic Tech High-Contrast:
(#FDFBF7 Cream, #231B14 Ink Dark, #0D6F64 Civic Teal, #9F241F Seal Red, #1E7E4E Action Green)
độ phân giải 1920x1080 Full HD trong suốt (RGBA PNG) để phủ lên video.
"""

import os
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = Path(__file__).resolve().parent.parent
OVERLAYS_DIR = BASE_DIR / "05_edit" / "overlays"
TITLES_DIR = BASE_DIR / "05_edit" / "titles"

# Bảng màu Civic Tech SSOT
COLOR_CREAM = (253, 251, 247, 255)
COLOR_INK = (35, 27, 20, 255)
COLOR_TEAL = (13, 111, 100, 255)
COLOR_SEAL_RED = (159, 36, 31, 255)
COLOR_GREEN = (30, 126, 78, 255)
COLOR_AMBER = (180, 83, 9, 255)
COLOR_WHITE = (255, 255, 255, 255)
COLOR_CARD_BG = (253, 251, 247, 245)
COLOR_BORDER = (231, 223, 211, 255)

def get_system_font(size, bold=False):
    """Tìm font hệ thống có sẵn trên Windows hoặc fallback."""
    font_names = ["segoeui.ttf", "arial.ttf", "calibri.ttf", "tahoma.ttf"]
    if bold:
        font_names = ["segoeuib.ttf", "arialbd.ttf", "calibrib.ttf", "tahomabd.ttf"] + font_names
        
    font_dirs = ["C:/Windows/Fonts", "C:/Windows/fonts", "/usr/share/fonts"]
    for d in font_dirs:
        for f in font_names:
            p = Path(d) / f
            if p.exists():
                try:
                    return ImageFont.truetype(str(p), size)
                except Exception:
                    pass
    return ImageFont.load_default()

def create_overlay_01_hook():
    """Overlay mở đầu: Bụi công trình tại đô thị."""
    img = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    font_sub = get_system_font(32, bold=False)
    font_main = get_system_font(54, bold=True)
    
    # Lower third box
    box_x1, box_y1, box_x2, box_y2 = 120, 820, 960, 960
    draw.rounded_rectangle([box_x1, box_y1, box_x2, box_y2], radius=16, fill=COLOR_CARD_BG, outline=COLOR_BORDER, width=3)
    # Accent bar
    draw.rounded_rectangle([box_x1, box_y1, box_x1 + 12, box_y2], radius=6, fill=COLOR_SEAL_RED)
    
    draw.text((box_x1 + 36, box_y1 + 24), "VẤN ĐỀ MÔI TRƯỜNG ĐÔ THỊ", font=font_sub, fill=COLOR_SEAL_RED)
    draw.text((box_x1 + 36, box_y1 + 72), "BỤI CÔNG TRÌNH & DỮ LIỆU PHÂN TÁN", font=font_main, fill=COLOR_INK)
    
    img.save(OVERLAYS_DIR / "overlay_01_hook.png")

def create_overlay_03_questions():
    """Overlay 5 câu hỏi trung tâm."""
    img = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    font_title = get_system_font(42, bold=True)
    font_item = get_system_font(32, bold=True)
    
    # Central Panel
    cx1, cy1, cx2, cy2 = 360, 240, 1560, 840
    draw.rounded_rectangle([cx1, cy1, cx2, cy2], radius=24, fill=COLOR_CARD_BG, outline=COLOR_BORDER, width=4)
    draw.rounded_rectangle([cx1, cy1, cx2, cy1 + 16], radius=8, fill=COLOR_TEAL)
    
    draw.text((cx1 + 60, cy1 + 48), "5 CÂU HỎI TRUNG TÂM KHI TIẾP NHẬN PHẢN ÁNH", font=font_title, fill=COLOR_TEAL)
    
    questions = [
        "1. Xem trường hợp nào trước? (Thứ tự ưu tiên)",
        "2. Vì sao trường hợp đó đáng chú ý? (Nồng độ PM / Gần trường học)",
        "3. Hồ sơ còn thiếu những thông tin gì?",
        "4. Ai đang phụ trách xử lý?",
        "5. Sau khi gửi đi, phản ánh đã thực sự đi đến đâu?"
    ]
    
    qy = cy1 + 140
    for q in questions:
        # Item box
        draw.rounded_rectangle([cx1 + 60, qy, cx2 - 60, qy + 64], radius=12, fill=COLOR_WHITE, outline=COLOR_BORDER, width=2)
        draw.text((cx1 + 84, qy + 14), q, font=font_item, fill=COLOR_INK)
        qy += 82
        
    img.save(OVERLAYS_DIR / "overlay_03_questions.png")

def create_overlay_04_flow():
    """Overlay Flow: Tín hiệu -> Bằng chứng -> Ưu tiên -> Theo dõi."""
    img = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    font_step = get_system_font(34, bold=True)
    font_sub = get_system_font(22, bold=False)
    
    steps = [
        ("TÍN HIỆU", "Ghi nhận & Cảm biến", COLOR_AMBER),
        ("BẰNG CHỨNG", "Mã băm SHA-256 đối chứng", COLOR_TEAL),
        ("ƯU TIÊN", "Dust Risk Score giải thích", COLOR_SEAL_RED),
        ("THEO DÕI", "Đóng vòng xử lý 24-48h", COLOR_GREEN)
    ]
    
    start_x = 180
    box_w = 340
    box_h = 130
    gap = 70
    y = 860
    
    for i, (title, sub, col) in enumerate(steps):
        bx = start_x + i * (box_w + gap)
        draw.rounded_rectangle([bx, y, bx + box_w, y + box_h], radius=16, fill=COLOR_CARD_BG, outline=col, width=3)
        draw.rounded_rectangle([bx, y, bx + box_w, y + 10], radius=4, fill=col)
        draw.text((bx + 24, y + 26), f"0{i+1}. {title}", font=font_step, fill=col)
        draw.text((bx + 24, y + 76), sub, font=font_sub, fill=COLOR_INK)
        
        # Arrow
        if i < len(steps) - 1:
            ax = bx + box_w + 20
            ay = y + box_h // 2
            draw.line([(ax, ay), (ax + 30, ay)], fill=COLOR_INK, width=4)
            draw.polygon([(ax + 30, ay - 8), (ax + 45, ay), (ax + 30, ay + 8)], fill=COLOR_INK)
            
    img.save(OVERLAYS_DIR / "overlay_04_flow.png")

def create_overlay_07_responsible_ai():
    """Overlay Responsible AI: Checklist Assistant."""
    img = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    font_title = get_system_font(36, bold=True)
    font_body = get_system_font(26, bold=False)
    font_tag = get_system_font(24, bold=True)
    
    # Right panel
    rx1, ry1, rx2, ry2 = 1050, 200, 1800, 880
    draw.rounded_rectangle([rx1, ry1, rx2, ry2], radius=20, fill=COLOR_CARD_BG, outline=COLOR_TEAL, width=4)
    
    # Header tag
    draw.rounded_rectangle([rx1 + 40, ry1 + 36, rx1 + 340, ry1 + 84], radius=8, fill=COLOR_TEAL)
    draw.text((rx1 + 54, ry1 + 44), "RESPONSIBLE AI ASSISTANT", font=font_tag, fill=COLOR_WHITE)
    
    draw.text((rx1 + 40, ry1 + 110), "AI Trợ lý — Không thay thế con người", font=font_title, fill=COLOR_INK)
    
    items = [
        ("✅ Gợi ý Checklist kiểm tra", "Rào chắn bụi, tưới ẩm, rửa bánh xe ben"),
        ("✅ Tóm tắt diễn biến vụ việc", "Tổng hợp đa nguồn phản ánh & đo kiểm"),
        ("✅ Tìm thông tin còn thiếu", "Nhắc nhở ảnh đối chứng Before/After"),
        ("❌ Không tự kết luận vi phạm", "Chỉ hỗ trợ xếp thứ tự ưu tiên xem xét"),
        ("❌ Không tự quyết định xử phạt", "Quyền quyết định thuộc về con người")
    ]
    
    iy = ry1 + 180
    for title, desc in items:
        color = COLOR_GREEN if title.startswith("✅") else COLOR_SEAL_RED
        draw.rounded_rectangle([rx1 + 36, iy, rx2 - 36, iy + 90], radius=12, fill=COLOR_WHITE, outline=COLOR_BORDER, width=2)
        draw.text((rx1 + 54, iy + 14), title, font=get_system_font(26, bold=True), fill=color)
        draw.text((rx1 + 54, iy + 50), desc, font=font_body, fill=COLOR_INK)
        iy += 106
        
    img.save(OVERLAYS_DIR / "overlay_07_responsible_ai.png")

def create_overlay_08_pilot():
    """Overlay Lean Pilot: 4-8 tuần."""
    img = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    font_hero = get_system_font(40, bold=True)
    font_sub = get_system_font(26, bold=False)
    
    # Bottom banner
    bx1, by1, bx2, by2 = 120, 800, 1800, 960
    draw.rounded_rectangle([bx1, by1, bx2, by2], radius=16, fill=COLOR_CARD_BG, outline=COLOR_TEAL, width=3)
    
    cards = [
        ("4–8 TUẦN", "Thời gian thử nghiệm"),
        ("20–30 NGƯỜI", "Người dùng thật (CLB/Trường)"),
        ("1 KHU VỰC", "Địa bàn tập trung thí điểm"),
        ("ĐO GIÁ TRỊ THẬT", "4 Chỉ số mục tiêu rõ ràng")
    ]
    
    cw = (bx2 - bx1 - 100) // 4
    for i, (head, sub) in enumerate(cards):
        cx = bx1 + 30 + i * (cw + 20)
        draw.rounded_rectangle([cx, by1 + 20, cx + cw, by2 - 20], radius=10, fill=COLOR_WHITE, outline=COLOR_BORDER, width=2)
        draw.text((cx + 20, by1 + 34), head, font=font_hero, fill=COLOR_TEAL)
        draw.text((cx + 20, by1 + 92), sub, font=font_sub, fill=COLOR_INK)
        
    img.save(OVERLAYS_DIR / "overlay_08_pilot.png")

def create_overlay_12_outro():
    """Overlay Finale & Slogan."""
    img = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    font_logo = get_system_font(68, bold=True)
    font_tagline = get_system_font(36, bold=False)
    font_pills = get_system_font(32, bold=True)
    
    # Center Brand Card
    cx1, cy1, cx2, cy2 = 360, 240, 1560, 840
    draw.rounded_rectangle([cx1, cy1, cx2, cy2], radius=24, fill=COLOR_CARD_BG, outline=COLOR_BORDER, width=4)
    draw.rounded_rectangle([cx1, cy1, cx2, cy1 + 20], radius=8, fill=COLOR_SEAL_RED)
    
    draw.text((cx1 + 120, cy1 + 80), "DUSTGUARD VN", font=font_logo, fill=COLOR_SEAL_RED)
    draw.text((cx1 + 120, cy1 + 175), "Từ tín hiệu môi trường đến hành động có thể theo dõi.", font=font_tagline, fill=COLOR_INK)
    
    # 3 Key Value Pills
    pills = [
        ("CÓ ƯU TIÊN", COLOR_AMBER),
        ("CÓ BẰNG CHỨNG", COLOR_TEAL),
        ("CÓ THEO DÕI", COLOR_GREEN)
    ]
    
    pw = 320
    ph = 80
    px_start = cx1 + 120
    py = cy1 + 280
    
    for i, (text, col) in enumerate(pills):
        px = px_start + i * (pw + 50)
        draw.rounded_rectangle([px, py, px + pw, py + ph], radius=14, fill=col)
        draw.text((px + 40, py + 20), text, font=font_pills, fill=COLOR_WHITE)
        
    draw.text((cx1 + 120, cy1 + 440), "Đồng hành cùng Thanh niên vì Không khí Sạch Việt Nam", font=get_system_font(28, bold=False), fill=COLOR_INK)
    draw.text((cx1 + 120, cy1 + 490), "UNICEF Hackathon 2026 — Final Round", font=get_system_font(24, bold=True), fill=COLOR_TEAL)
    
    img.save(OVERLAYS_DIR / "overlay_12_outro.png")

def build_all_overlays():
    print("[Stage 4] Đang tạo các lớp Motion Graphics & Civic Overlays...")
    OVERLAYS_DIR.mkdir(parents=True, exist_ok=True)
    TITLES_DIR.mkdir(parents=True, exist_ok=True)
    
    create_overlay_01_hook()
    create_overlay_03_questions()
    create_overlay_04_flow()
    create_overlay_07_responsible_ai()
    create_overlay_08_pilot()
    create_overlay_12_outro()
    
    print(f"-> Đã sinh 6 lớp Motion Graphics Overlays vào {OVERLAYS_DIR}")

if __name__ == "__main__":
    build_all_overlays()
