#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
DUSTGUARD VN — SUBAGENT 6: WEB UI LIVE DEMO VIDEO CAPTURE SPECIALIST
===============================================================================
Script: 06_generate_ui_mockups_and_broll.py
Mục tiêu:
  Tạo 6 video clip UI Demo / B-Roll chất lượng cao (1920x1080 Full HD, 25fps, Progressive)
  mô phỏng thao tác người dùng duyệt qua các tính năng cốt lõi của DustGuard VN:
    1. ui_01_interactive_map.mp4: Bản đồ quan trắc tương tác & Geofence 50m
    2. ui_02_case_management.mp4: Quản lý Vụ việc, Triage SLA 48h & Responsible AI Checklist
    3. ui_03_evidence_before_after.mp4: Chuỗi bằng chứng Đối chứng Trước & Sau (Before/After)
    4. ui_04_sha256_verification.mp4: Xác thực Bằng chứng Số & Mã băm SHA-256 Audit Trail
    5. ui_05_pilot_dashboard.mp4: Bảng điều khiển Chỉ số Thực nghiệm Pilot 4 tuần
    6. ui_06_official_a4_report.mp4: Trình tạo Báo cáo Hành chính & Hồ sơ Bàn giao A4

Tuân thủ nghiêm ngặt:
  - Bảng màu Civic Tech: Nền Cream #FDFBF7, Chữ Ink #231B14, Teal #0D6F64, Seal Red #9F241F
  - Tuyệt đối không dùng glassmorphism, độ tương phản cao, typography tiếng Việt sắc nét.
  - Video xuất vào presentation/03_selected/ui_broll/
===============================================================================
"""

import os
import sys
import math
import subprocess
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont

# Set UTF-8 encoding for stdout on Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# =============================================================================
# 1. CONSTANTS & THEME TOKENS (CIVIC TECH DESIGN SYSTEM)
# =============================================================================
WIDTH = 1920
HEIGHT = 1080
FPS = 25
DURATION_SEC = 8
TOTAL_FRAMES = DURATION_SEC * FPS  # 200 frames

# Color Palette (SSOT Invariant)
BG_CREAM = "#FDFBF7"
BG_PAGE = "#F7F4EE"
CARD_BG = "#FFFFFF"
BORDER_COLOR = "#E2D9CC"
BORDER_DARK = "#B8A99A"

TEXT_INK = "#231B14"
TEXT_MUTED = "#6E6256"
TEXT_LIGHT = "#998B7E"

ACCENT_TEAL = "#0D6F64"
TEAL_LIGHT = "#E6F4F1"
TEAL_BORDER = "#148B7D"
TEAL_DARK = "#084C44"

SEAL_RED = "#9F241F"
RED_LIGHT = "#FBEAE9"
RED_BORDER = "#C93832"

WARN_AMBER = "#D97706"
AMBER_LIGHT = "#FEF3C7"
AMBER_BORDER = "#F59E0B"

NAV_BG = "#1A2228"
NAV_TEXT = "#F4EFEA"
NAV_MUTED = "#9CA3AF"

# Fonts setup (Windows standard Unicode fonts)
FONT_DIR = "C:/Windows/Fonts"
def get_font(name="segoeui.ttf", size=20, bold=False):
    target = "segoeuib.ttf" if bold else name
    path = os.path.join(FONT_DIR, target)
    if not os.path.exists(path):
        target = "arialbd.ttf" if bold else "arial.ttf"
        path = os.path.join(FONT_DIR, target)
    if not os.path.exists(path):
        target = "tahoma.ttf"
        path = os.path.join(FONT_DIR, target)
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

# Preloaded Fonts
FONT_TITLE_XL = get_font("segoeuib.ttf", 34, bold=True)
FONT_TITLE = get_font("segoeuib.ttf", 26, bold=True)
FONT_SUBTITLE = get_font("segoeuib.ttf", 20, bold=True)
FONT_BODY_B = get_font("segoeuib.ttf", 16, bold=True)
FONT_BODY = get_font("segoeui.ttf", 16, bold=False)
FONT_BODY_SM = get_font("segoeui.ttf", 13, bold=False)
FONT_BODY_SM_B = get_font("segoeuib.ttf", 13, bold=True)
FONT_CAPTION = get_font("segoeui.ttf", 11, bold=False)
FONT_MONO = get_font("consola.ttf", 15, bold=False)
FONT_MONO_B = get_font("consolab.ttf", 16, bold=True)

# Output Paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUTPUT_DIR = os.path.join(BASE_DIR, "03_selected", "ui_broll")
TEMP_DIR = os.path.join(BASE_DIR, "06_temp")
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

# =============================================================================
# 2. DRAWING HELPERS & PRIMITIVES
# =============================================================================

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

def smoothstep(t):
    """Hermite interpolation between 0 and 1."""
    t = max(0.0, min(1.0, t))
    return t * t * (3.0 - 2.0 * t)

def ease_in_out(t):
    """Cubic ease in out."""
    t = max(0.0, min(1.0, t))
    if t < 0.5:
        return 4 * t * t * t
    else:
        p = 2 * t - 2
        return 0.5 * p * p * p + 1

def draw_rounded_rect(draw, bbox, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

def draw_header(draw, active_tab="map", breadcrumb=""):
    """Draw top Civic Tech navigation header bar."""
    # Top Header Bar (1920x70)
    draw.rectangle([0, 0, WIDTH, 68], fill=NAV_BG)
    draw.line([0, 68, WIDTH, 68], fill="#313D47", width=2)

    # Logo Shield & Text
    # Shield shape
    sx, sy = 40, 16
    draw_rounded_rect(draw, [sx, sy, sx+36, sy+36], radius=8, fill=ACCENT_TEAL)
    draw.text((sx+8, sy+5), "DG", fill="#FFFFFF", font=FONT_SUBTITLE)

    # Brand Title
    draw.text((sx+48, sy+2), "DUSTGUARD VN", fill="#FFFFFF", font=FONT_SUBTITLE)
    draw.text((sx+48, sy+22), "Nền tảng Giám sát & Điều phối Môi trường Civic Tech", fill=NAV_MUTED, font=FONT_CAPTION)

    # Navigation Tabs
    tabs = [
        ("map", "Bản đồ Quan trắc"),
        ("cases", "Quản lý Vụ việc"),
        ("evidence", "Chuỗi Bằng chứng"),
        ("pilot", "Chỉ số Pilot"),
        ("reports", "Báo cáo & Bàn giao")
    ]
    
    start_x = 440
    for tab_id, label in tabs:
        is_active = (tab_id == active_tab)
        tw = int(draw.textlength(label, font=FONT_BODY_B if is_active else FONT_BODY))
        
        if is_active:
            draw_rounded_rect(draw, [start_x-12, 14, start_x+tw+12, 54], radius=6, fill="#2C3842")
            draw.line([start_x-8, 52, start_x+tw+8, 52], fill=ACCENT_TEAL, width=3)
            draw.text((start_x, 22), label, fill="#FFFFFF", font=FONT_BODY_B)
        else:
            draw.text((start_x, 23), label, fill=NAV_TEXT, font=FONT_BODY)
        
        start_x += tw + 45

    # Right side: System Status & User
    # Live Status Badge
    draw_rounded_rect(draw, [WIDTH-440, 18, WIDTH-270, 50], radius=16, fill="#0F332E", outline=TEAL_BORDER, width=1)
    draw.ellipse([WIDTH-425, 30, WIDTH-415, 40], fill="#10B981")
    draw.text((WIDTH-405, 24), "HỆ THỐNG TRỰC TUYẾN", fill="#34D399", font=FONT_BODY_SM_B)

    # User Profile Avatar
    draw.ellipse([WIDTH-240, 16, WIDTH-204, 52], fill="#4B5563")
    draw.text((WIDTH-230, 22), "QL", fill="#FFFFFF", font=FONT_BODY_B)
    draw.text((WIDTH-195, 18), "Tổ Điều Phối", fill="#FFFFFF", font=FONT_BODY_SM_B)
    draw.text((WIDTH-195, 34), "Quận Cầu Giấy", fill=NAV_MUTED, font=FONT_CAPTION)

    # Sub-header Breadcrumb Bar (Height 42)
    draw.rectangle([0, 69, WIDTH, 108], fill=BG_PAGE)
    draw.line([0, 108, WIDTH, 108], fill=BORDER_COLOR, width=1)
    
    draw.text((40, 78), f"Trang chủ  /  {breadcrumb}", fill=TEXT_MUTED, font=FONT_BODY_SM)
    # Timestamp SSOT
    draw.text((WIDTH-360, 78), "Thời gian thực: 2026-08-31 08:35 (GMT+7) | D1 SSOT", fill=TEXT_LIGHT, font=FONT_BODY_SM)

def draw_mouse_cursor(draw, pos, clicking=False, click_progress=0.0):
    """Draw smooth Windows/Civic black cursor with white outline & click ripple."""
    cx, cy = int(pos[0]), int(pos[1])
    
    # Click Ripple Effect
    if click_progress > 0.0 and click_progress <= 1.0:
        r = int(12 + click_progress * 36)
        alpha_val = int(220 * (1.0 - click_progress))
        # Draw ripple circle
        overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        odraw = ImageDraw.Draw(overlay)
        odraw.ellipse([cx-r, cy-r, cx+r, cy+r], outline=(13, 111, 100, alpha_val), width=3)
        return overlay

    # Cursor Polygon points
    pts = [
        (cx, cy),
        (cx, cy + 22),
        (cx + 6, cy + 18),
        (cx + 11, cy + 28),
        (cx + 15, cy + 26),
        (cx + 10, cy + 16),
        (cx + 18, cy + 16)
    ]
    # Outline (White)
    draw.polygon(pts, fill="#111827", outline="#FFFFFF")
    return None

# =============================================================================
# 3. SCENE 1: INTERACTIVE MAP & GEOFENCE B-ROLL
# =============================================================================
def generate_interactive_map_broll(output_path):
    print("\n[1/6] Rendering Scene 1: Interactive Map & Geofence Hotspots...")
    
    frames = []
    
    # Map layout coordinates
    map_box = [340, 128, WIDTH-40, HEIGHT-40]
    
    # Hotspot points
    hotspots = [
        {"id": "OBS-089", "name": "Ga ngầm S9 - Metro Tuyến 3", "x": 1080, "y": 520, "risk": 84, "pm25": 142, "status": "critical", "geofence": 50},
        {"id": "OBS-074", "name": "Khu đô thị Starlake Tây Hồ", "x": 1360, "y": 340, "risk": 48, "pm25": 65, "status": "warning", "geofence": 50},
        {"id": "OBS-091", "name": "Vành đai 3 - Cầu Mai Dịch", "x": 820, "y": 680, "risk": 78, "pm25": 128, "status": "critical", "geofence": 50},
        {"id": "OBS-062", "name": "Khu tái định cư Nam Trung Yên", "x": 1420, "y": 740, "risk": 32, "pm25": 42, "status": "normal", "geofence": 50},
        {"id": "OBS-085", "name": "Trục đường Xuân Thủy - ĐHSP", "x": 680, "y": 420, "risk": 62, "pm25": 94, "status": "warning", "geofence": 50}
    ]

    for frame_idx in range(TOTAL_FRAMES):
        t = frame_idx / TOTAL_FRAMES
        im = Image.new("RGB", (WIDTH, HEIGHT), color=BG_CREAM)
        draw = ImageDraw.Draw(im)

        # Header
        draw_header(draw, active_tab="map", breadcrumb="Bản đồ Giám sát Môi trường & Điểm nóng Công trường")

        # -------------------------------------------------------------
        # Left Sidebar: Filters & Observation List
        # -------------------------------------------------------------
        draw_rounded_rect(draw, [40, 128, 320, HEIGHT-40], radius=10, fill=CARD_BG, outline=BORDER_COLOR, width=1)
        
        # Sidebar Header
        draw.text((60, 148), "BỘ LỌC ĐIỂM NÓNG", fill=TEXT_INK, font=FONT_SUBTITLE)
        draw.line([60, 185, 300, 185], fill=BORDER_COLOR, width=1)

        # Filter Chips
        filters = [("Tất cả", "24", True), ("Ưu tiên cao", "8", False), ("Đang xử lý", "12", False), ("Đã giải quyết", "4", False)]
        fy = 200
        for fname, count, is_sel in filters:
            if is_sel:
                draw_rounded_rect(draw, [60, fy, 300, fy+38], radius=6, fill=TEAL_LIGHT, outline=ACCENT_TEAL, width=1)
                draw.text((75, fy+8), fname, fill=ACCENT_TEAL, font=FONT_BODY_B)
                draw.text((260, fy+8), count, fill=ACCENT_TEAL, font=FONT_BODY_B)
            else:
                draw_rounded_rect(draw, [60, fy, 300, fy+38], radius=6, fill="#F9FAFB", outline=BORDER_COLOR, width=1)
                draw.text((75, fy+8), fname, fill=TEXT_INK, font=FONT_BODY)
                draw.text((260, fy+8), count, fill=TEXT_MUTED, font=FONT_BODY)
            fy += 46

        # Active Case Cards List in Sidebar
        draw.text((60, 395), "DANH SÁCH TÍN HIỆU GẦN ĐÂY", fill=TEXT_MUTED, font=FONT_BODY_SM_B)
        
        c_items = [
            ("OBS-089: Bụi Ga ngầm S9", "Rủi ro: 84/100 (Cao)", SEAL_RED),
            ("OBS-091: Vành đai 3 Mai Dịch", "Rủi ro: 78/100 (Cao)", SEAL_RED),
            ("OBS-085: Trục Xuân Thủy", "Rủi ro: 62/100 (Trung bình)", WARN_AMBER),
            ("OBS-074: KĐT Starlake", "Rủi ro: 48/100 (Trung bình)", WARN_AMBER)
        ]
        cy = 425
        for ctitle, crisk, col in c_items:
            draw_rounded_rect(draw, [60, cy, 300, cy+64], radius=6, fill="#FAF8F5", outline=BORDER_COLOR, width=1)
            draw.rectangle([60, cy, 66, cy+64], fill=col)
            draw.text((75, cy+8), ctitle, fill=TEXT_INK, font=FONT_BODY_SM_B)
            draw.text((75, cy+32), crisk, fill=col, font=FONT_CAPTION)
            cy += 74

        # -------------------------------------------------------------
        # Right Area: Interactive Map Canvas
        # -------------------------------------------------------------
        draw_rounded_rect(draw, map_box, radius=10, fill="#EFEAE2", outline=BORDER_COLOR, width=2)
        
        # Map Streets & Water Background Simulation
        # River / Lake
        draw.polygon([(1500, 130), (1880, 130), (1880, 480), (1650, 480), (1550, 320)], fill="#D3E5E2")
        draw.text((1680, 260), "HỒ TÂY (WEST LAKE)", fill="#6B9990", font=FONT_BODY_B)

        # Primary Roads
        draw.line([340, 520, WIDTH-40, 520], fill="#FFFFFF", width=22)  # Cầu Giấy
        draw.line([340, 520, WIDTH-40, 520], fill="#E5DFD5", width=16)
        draw.text((500, 532), "ĐƯỜNG CẦU GIẤY — XUÂN THỦY", fill="#8A7E72", font=FONT_CAPTION)

        draw.line([960, 128, 960, HEIGHT-40], fill="#FFFFFF", width=28)  # Vành Đai 3
        draw.line([960, 128, 960, HEIGHT-40], fill="#DDD4C7", width=20)
        draw.text((975, 200), "ĐƯỜNG VÀNH ĐAI 3 (TRẦN DUY HƯNG — PHẠM HÙNG)", fill="#7C7063", font=FONT_CAPTION)

        draw.line([600, 128, 1600, HEIGHT-40], fill="#FFFFFF", width=18)  # Secondary Road
        draw.line([600, 128, 1600, HEIGHT-40], fill="#E5DFD5", width=12)

        # Map Grid Coordinates Overlay
        draw.text((map_box[0]+20, map_box[1]+20), "BẢN ĐỒ KHÔNG GIAN THỰC ĐỊA (WGS84) — CẦU GIẤY, HÀ NỘI", fill=TEXT_MUTED, font=FONT_BODY_SM_B)
        draw.text((map_box[0]+20, map_box[1]+40), "Tọa độ tâm: 21.0368° N, 105.7825° E | Lớp Geofence: Bán kính 50m", fill=TEXT_LIGHT, font=FONT_CAPTION)

        # Draw Hotspots & Radar Pulse
        pulse_anim = (math.sin(frame_idx * 0.2) + 1.0) * 0.5  # 0.0 to 1.0
        
        for spot in hotspots:
            hx, hy = spot["x"], spot["y"]
            r_base = spot["geofence"]
            
            # Geofence Circle
            if spot["status"] == "critical":
                c_line = SEAL_RED
            elif spot["status"] == "warning":
                c_line = WARN_AMBER
            else:
                c_line = ACCENT_TEAL

            # Radar wave for critical
            if spot["status"] == "critical":
                r_pulse = int(r_base + pulse_anim * 25)
                draw.ellipse([hx-r_pulse, hy-r_pulse, hx+r_pulse, hy+r_pulse], outline=c_line, width=1)

            draw.ellipse([hx-r_base, hy-r_base, hx+r_base, hy+r_base], fill=None, outline=c_line, width=2)
            
            # Hotspot Core Pin
            draw.ellipse([hx-14, hy-14, hx+14, hy+14], fill=c_line, outline="#FFFFFF", width=2)
            draw.ellipse([hx-5, hy-5, hx+5, hy+5], fill="#FFFFFF")
            
            # Pin Label
            draw_rounded_rect(draw, [hx-55, hy+18, hx+55, hy+40], radius=4, fill="#FFFFFF", outline=BORDER_COLOR, width=1)
            draw.text((hx-45, hy+22), f"{spot['id']}: {spot['risk']}", fill=TEXT_INK, font=FONT_CAPTION)

        # -------------------------------------------------------------
        # Interactive Mouse & Modal Animation
        # -------------------------------------------------------------
        cursor_pos = [600, 300]
        clicking = False
        click_prog = 0.0
        modal_open = False
        button_clicked = False

        if t < 0.35:
            # Move to target hotspot
            p = smoothstep(t / 0.35)
            cursor_pos = [600 + (1080 - 600) * p, 300 + (520 - 300) * p]
            if 0.30 <= t < 0.35:
                clicking = True
                click_prog = (t - 0.30) / 0.05
        else:
            modal_open = True
            if t < 0.65:
                # Move to Modal Button [Chuyển thành Vụ việc]
                p = smoothstep((t - 0.35) / 0.30)
                cursor_pos = [1080 + (1240 - 1080) * p, 520 + (745 - 520) * p]
            else:
                cursor_pos = [1240, 745]
                if 0.65 <= t < 0.75:
                    clicking = True
                    click_prog = (t - 0.65) / 0.10
                if t >= 0.75:
                    button_clicked = True

        # Render Modal Popup if open
        if modal_open:
            mx, my = 1000, 360
            mw, mh = 480, 420
            
            # Modal Container
            draw_rounded_rect(draw, [mx, my, mx+mw, my+mh], radius=10, fill=CARD_BG, outline=ACCENT_TEAL, width=2)
            
            # Modal Header
            draw_rounded_rect(draw, [mx, my, mx+mw, my+55], radius=10, fill=TEAL_LIGHT)
            draw.rectangle([mx, my+40, mx+mw, my+55], fill=TEAL_LIGHT)
            draw.text((mx+20, my+14), "TÍN HIỆU QUAN TRẮC #OBS-2026-089", fill=ACCENT_TEAL, font=FONT_BODY_B)
            
            # Close button
            draw.text((mx+mw-30, my+14), "✕", fill=TEXT_MUTED, font=FONT_BODY_B)

            # Details
            draw.text((mx+20, my+70), "Vị trí: Ga ngầm S9 - Tuyến Metro 3 (Cầu Giấy)", fill=TEXT_INK, font=FONT_BODY_B)
            draw.text((mx+20, my+95), "Thời gian: Hôm nay 08:30:15 | Nguồn: CLB TN Cầu Giấy", fill=TEXT_MUTED, font=FONT_BODY_SM)

            # Dust Risk Score Card
            draw_rounded_rect(draw, [mx+20, my+130, mx+220, my+210], radius=6, fill=RED_LIGHT, outline=SEAL_RED, width=1)
            draw.text((mx+35, my+140), "DUST RISK SCORE", fill=SEAL_RED, font=FONT_CAPTION)
            draw.text((mx+35, my+158), "84 / 100", fill=SEAL_RED, font=FONT_TITLE)
            draw.text((mx+35, my+190), "Ưu tiên: CẤP BÁCH (SLA 48h)", fill=SEAL_RED, font=FONT_CAPTION)

            # PM2.5 Telemetry Card
            draw_rounded_rect(draw, [mx+240, my+130, mx+440, my+210], radius=6, fill="#FFFBEB", outline=WARN_AMBER, width=1)
            draw.text((mx+255, my+140), "NỒNG ĐỘ BỤI PM2.5", fill=WARN_AMBER, font=FONT_CAPTION)
            draw.text((mx+255, my+158), "142 µg/m³", fill=WARN_AMBER, font=FONT_TITLE)
            draw.text((mx+255, my+190), "Vượt QCVN 05:2023 2.8 lần", fill=WARN_AMBER, font=FONT_CAPTION)

            # Evidence Image Thumbnail Box
            draw.text((mx+20, my+225), "Minh chứng đính kèm (2 ảnh + Tọa độ GPS + Mã SHA-256):", fill=TEXT_INK, font=FONT_BODY_SM_B)
            draw_rounded_rect(draw, [mx+20, my+250, mx+220, my+330], radius=6, fill="#E5E7EB", outline=BORDER_COLOR, width=1)
            draw.text((mx+40, my+280), "📷 Ảnh xe ben cuốn bụi", fill=TEXT_MUTED, font=FONT_BODY_SM)
            
            draw_rounded_rect(draw, [mx+240, my+250, mx+440, my+330], radius=6, fill="#E5E7EB", outline=BORDER_COLOR, width=1)
            draw.text((mx+255, my+280), "📷 Cổng xuất xe không rửa", fill=TEXT_MUTED, font=FONT_BODY_SM)

            # Action Button
            if not button_clicked:
                draw_rounded_rect(draw, [mx+20, my+350, mx+mw-20, my+400], radius=6, fill=ACCENT_TEAL)
                draw.text((mx+110, my+363), "CHUYỂN THÀNH VỤ VIỆC THEO DÕI ➔", fill="#FFFFFF", font=FONT_BODY_B)
            else:
                draw_rounded_rect(draw, [mx+20, my+350, mx+mw-20, my+400], radius=6, fill="#059669")
                draw.text((mx+90, my+363), "✓ ĐÃ TẠO HỒ SƠ VỤ VIỆC #CASE-2026-042", fill="#FFFFFF", font=FONT_BODY_B)

        # Draw Mouse
        ripple_img = draw_mouse_cursor(draw, cursor_pos, clicking=clicking, click_progress=click_prog)
        if ripple_img:
            im.paste(Image.alpha_composite(im.convert("RGBA"), ripple_img).convert("RGB"))

        frames.append(np.array(im))

    # Export MP4
    temp_mp4 = os.path.join(TEMP_DIR, "ui_01.mp4")
    export_video_mp4(frames, temp_mp4, output_path)

# =============================================================================
# 4. SCENE 2: CASE MANAGEMENT, TRIAGE & RESPONSIBLE AI CHECKLIST
# =============================================================================
def generate_case_management_broll(output_path):
    print("\n[2/6] Rendering Scene 2: Case Management & Responsible AI Checklist...")
    
    frames = []
    
    for frame_idx in range(TOTAL_FRAMES):
        t = frame_idx / TOTAL_FRAMES
        im = Image.new("RGB", (WIDTH, HEIGHT), color=BG_CREAM)
        draw = ImageDraw.Draw(im)

        # Header
        draw_header(draw, active_tab="cases", breadcrumb="Quản lý Vụ việc  /  Hồ sơ #CASE-2026-042")

        # -------------------------------------------------------------
        # Top Case Banner (Card)
        # -------------------------------------------------------------
        draw_rounded_rect(draw, [40, 128, WIDTH-40, 220], radius=10, fill=CARD_BG, outline=BORDER_COLOR, width=1)
        
        # Priority Badge
        draw_rounded_rect(draw, [65, 148, 220, 180], radius=4, fill=RED_LIGHT, outline=SEAL_RED, width=1)
        draw.text((78, 153), "ƯU TIÊN: CẤP BÁCH", fill=SEAL_RED, font=FONT_BODY_SM_B)

        # Case Title
        draw.text((240, 146), "VỤ VIỆC #CASE-2026-042: XỬ LÝ PHÁT TÁN BỤI DO XE VẬN CHUYỂN TẠI GA S9", fill=TEXT_INK, font=FONT_TITLE)
        draw.text((240, 182), "Đơn vị thi công: Liên danh FECON - Sông Đà | Địa điểm: Ga ngầm S9 Cầu Giấy, Hà Nội | Tiếp nhận: 08:30:15", fill=TEXT_MUTED, font=FONT_BODY_SM)

        # SLA Countdown Card (Right of banner)
        draw_rounded_rect(draw, [WIDTH-360, 140, WIDTH-60, 208], radius=8, fill="#FEF3C7", outline=WARN_AMBER, width=1)
        draw.text((WIDTH-345, 148), "ĐỒNG HỒ SLA (CAM KẾT 48H)", fill=WARN_AMBER, font=FONT_CAPTION)
        draw.text((WIDTH-345, 166), "Còn 36h 14m 20s", fill="#B45309", font=FONT_TITLE)

        # -------------------------------------------------------------
        # 5-Stage Visual Workflow Stepper
        # -------------------------------------------------------------
        draw_rounded_rect(draw, [40, 236, WIDTH-40, 310], radius=8, fill="#F9F7F3", outline=BORDER_COLOR, width=1)
        
        steps = [
            ("1. Tiếp nhận tín hiệu", "Đã xác thực GPS", True),
            ("2. Phân loại & Giao việc", "Tổ QLMT Quận", True),
            ("3. Kiểm tra hiện trường", "Đang thực hiện", "active"),
            ("4. Biện pháp khắc phục", "Phun sương / Rửa xe", False),
            ("5. Nghiệm thu bàn giao", "Biên bản A4 số", False)
        ]
        
        sx = 80
        for idx, (s_title, s_sub, s_state) in enumerate(steps):
            if s_state is True:
                draw.ellipse([sx, 255, sx+32, 287], fill=ACCENT_TEAL)
                draw.text((sx+10, 260), "✓", fill="#FFFFFF", font=FONT_BODY_B)
                draw.text((sx+44, 252), s_title, fill=TEXT_INK, font=FONT_BODY_SM_B)
                draw.text((sx+44, 272), s_sub, fill=ACCENT_TEAL, font=FONT_CAPTION)
            elif s_state == "active":
                draw.ellipse([sx, 255, sx+32, 287], fill="#D97706", outline="#B45309", width=2)
                draw.text((sx+11, 260), "3", fill="#FFFFFF", font=FONT_BODY_B)
                draw.text((sx+44, 252), s_title, fill=TEXT_INK, font=FONT_BODY_SM_B)
                draw.text((sx+44, 272), s_sub, fill="#D97706", font=FONT_CAPTION)
            else:
                draw.ellipse([sx, 255, sx+32, 287], fill="#E5E7EB")
                draw.text((sx+11, 260), str(idx+1), fill=TEXT_MUTED, font=FONT_BODY_B)
                draw.text((sx+44, 252), s_title, fill=TEXT_LIGHT, font=FONT_BODY_SM)
                draw.text((sx+44, 272), s_sub, fill=TEXT_LIGHT, font=FONT_CAPTION)

            if idx < len(steps) - 1:
                draw.line([sx+250, 271, sx+310, 271], fill="#D1D5DB", width=2)
            sx += 360

        # -------------------------------------------------------------
        # Left Panel: Case Details & Stakeholders
        # -------------------------------------------------------------
        draw_rounded_rect(draw, [40, 328, 860, HEIGHT-40], radius=10, fill=CARD_BG, outline=BORDER_COLOR, width=1)
        draw.text((65, 350), "THÔNG TIN ĐIỀU PHỐI VỤ VIỆC", fill=TEXT_INK, font=FONT_SUBTITLE)
        draw.line([65, 385, 835, 385], fill=BORDER_COLOR, width=1)

        info_rows = [
            ("Mã định danh SSOT:", "CASE-2026-042 (Liên kết OBS-2026-089)"),
            ("Chủ đầu tư / Dự án:", "Ban Quản lý Đường sắt Đô thị Hà Nội (MRB)"),
            ("Nhà thầu phụ trách:", "Công ty Cổ phần FECON — Chỉ huy trưởng: Nguyễn Đức Toàn"),
            ("Tổ kiểm tra môi trường:", "Đội Kiểm tra Quy tắc Đô thị & Môi trường Phường Mai Dịch"),
            ("Tọa độ hiện trường:", "21.03684° N, 105.78251° E (Sai số GPS: 3.2m)"),
            ("Yêu cầu xử lý:", "Lắp đặt rào chắn kín 2.5m, vận hành giàn rửa lốp xe áp lực cao")
        ]
        iy = 405
        for lbl, val in info_rows:
            draw.text((65, iy), lbl, fill=TEXT_MUTED, font=FONT_BODY_SM_B)
            draw.text((280, iy), val, fill=TEXT_INK, font=FONT_BODY_SM)
            iy += 42

        # Evidence Photo Preview inside Left Panel
        draw.text((65, 680), "ẢNH HIỆN TRƯỜNG LÚC TIẾP NHẬN (08:30):", fill=TEXT_INK, font=FONT_BODY_SM_B)
        draw_rounded_rect(draw, [65, 710, 440, 990], radius=8, fill="#E5E7EB", outline=BORDER_COLOR, width=1)
        draw.text((120, 840), "📷 Xe ben chở đất không phủ bạt", fill=TEXT_MUTED, font=FONT_BODY_SM)
        
        draw_rounded_rect(draw, [460, 710, 835, 990], radius=8, fill="#E5E7EB", outline=BORDER_COLOR, width=1)
        draw.text((510, 840), "📷 Bụi đất vương vãi mặt đường", fill=TEXT_MUTED, font=FONT_BODY_SM)

        # -------------------------------------------------------------
        # Right Panel: Responsible AI Assistant & Checklist Workspace
        # -------------------------------------------------------------
        draw_rounded_rect(draw, [880, 328, WIDTH-40, HEIGHT-40], radius=10, fill="#FAFCFB", outline=ACCENT_TEAL, width=2)
        
        # AI Header
        draw_rounded_rect(draw, [880, 328, WIDTH-40, 400], radius=10, fill=TEAL_LIGHT)
        draw.rectangle([880, 380, WIDTH-40, 400], fill=TEAL_LIGHT)
        
        draw.text((910, 345), "🤖 TRỢ LÝ ĐIỀU PHỐI AI (RESPONSIBLE AI ASSISTANT)", fill=ACCENT_TEAL, font=FONT_SUBTITLE)
        draw.text((910, 372), "AI gợi ý danh mục kiểm tra theo QCVN — Cán bộ môi trường trực tiếp quyết định", fill=TEXT_MUTED, font=FONT_CAPTION)

        # AI Summary Card
        draw_rounded_rect(draw, [910, 420, WIDTH-65, 520], radius=8, fill="#FFFFFF", outline=TEAL_BORDER, width=1)
        draw.text((930, 435), "Tóm tắt phân tích tự động từ ảnh chụp & cảm biến:", fill=ACCENT_TEAL, font=FONT_BODY_SM_B)
        draw.text((930, 460), "• Phát hiện phương tiện xe tải 15 tấn không phủ bạt thùng xe khi rời công trường.", fill=TEXT_INK, font=FONT_BODY_SM)
        draw.text((930, 485), "• Nồng độ PM2.5 đạt 142 µg/m³. Gợi ý kích hoạt quy trình kiểm tra rào chắn & trạm rửa xe.", fill=TEXT_INK, font=FONT_BODY_SM)

        # Checklist Items Animation
        check3_done = (t >= 0.55)
        
        checklist = [
            ("Kiểm tra rào chắn bao quanh công trình đạt độ cao chuẩn 2.5m", True, "Đạt chuẩn"),
            ("Yêu cầu 100% xe tải vận chuyển che bạt kín trước khi xuất bến", True, "Đạt chuẩn"),
            ("Vận hành giàn phun sương dập bụi & hệ thống rửa lốp xe tự động", check3_done, "Đã nghiệm thu lúc 15:45" if check3_done else "Chờ xác nhận hiện trường")
        ]

        cy = 545
        for idx, (ctext, cdone, cstatus) in enumerate(checklist):
            draw_rounded_rect(draw, [910, cy, WIDTH-65, cy+72], radius=6, fill="#FFFFFF", outline=ACCENT_TEAL if cdone else BORDER_COLOR, width=1)
            
            # Checkbox
            if cdone:
                draw_rounded_rect(draw, [930, cy+18, 966, cy+54], radius=4, fill=ACCENT_TEAL)
                draw.text((940, cy+22), "✓", fill="#FFFFFF", font=FONT_BODY_B)
            else:
                draw_rounded_rect(draw, [930, cy+18, 966, cy+54], radius=4, fill="#FFFFFF", outline=BORDER_DARK, width=2)

            draw.text((980, cy+16), ctext, fill=TEXT_INK, font=FONT_BODY_B if cdone else FONT_BODY)
            draw.text((980, cy+42), f"Trạng thái: {cstatus}", fill=ACCENT_TEAL if cdone else WARN_AMBER, font=FONT_CAPTION)
            cy += 84

        # Action Buttons
        btn_y = 820
        # Button 1: Cập nhật
        draw_rounded_rect(draw, [910, btn_y, 1360, btn_y+60], radius=6, fill=ACCENT_TEAL)
        draw.text((960, btn_y+18), "XÁC NHẬN KIỂM TRA HIỆN TRƯỜNG ➔", fill="#FFFFFF", font=FONT_BODY_B)

        # Button 2: Xuất Báo cáo
        draw_rounded_rect(draw, [1380, btn_y, WIDTH-65, btn_y+60], radius=6, fill="#FFFFFF", outline=ACCENT_TEAL, width=2)
        draw.text((1430, btn_y+18), "XUẤT BIÊN BẢN A4", fill=ACCENT_TEAL, font=FONT_BODY_B)

        # Mouse Animation: Move to Checkbox 3 -> Click -> Move to Button -> Click
        cursor_pos = [1100, 400]
        clicking = False
        click_prog = 0.0

        if t < 0.50:
            p = smoothstep(t / 0.50)
            cursor_pos = [1100 + (948 - 1100) * p, 400 + (735 - 400) * p]
        elif t < 0.60:
            cursor_pos = [948, 735]
            clicking = True
            click_prog = (t - 0.50) / 0.10
        else:
            p = smoothstep((t - 0.60) / 0.40)
            cursor_pos = [948 + (1135 - 948) * p, 735 + (850 - 735) * p]
            if t >= 0.85:
                clicking = True
                click_prog = (t - 0.85) / 0.15

        ripple_img = draw_mouse_cursor(draw, cursor_pos, clicking=clicking, click_progress=click_prog)
        if ripple_img:
            im.paste(Image.alpha_composite(im.convert("RGBA"), ripple_img).convert("RGB"))

        frames.append(np.array(im))

    temp_mp4 = os.path.join(TEMP_DIR, "ui_02.mp4")
    export_video_mp4(frames, temp_mp4, output_path)

# =============================================================================
# 5. SCENE 3: EVIDENCE BEFORE / AFTER COMPARATIVE STREAM
# =============================================================================
def generate_evidence_before_after_broll(output_path):
    print("\n[3/6] Rendering Scene 3: Comparative Evidence Before / After...")
    
    frames = []

    # Load Real Extracted Frames
    before_img_path = os.path.join(TEMP_DIR, "frame_before.jpg")
    after_img_path = os.path.join(TEMP_DIR, "frame_after.jpg")

    before_pil = None
    after_pil = None
    if os.path.exists(before_img_path):
        before_pil = Image.open(before_img_path).resize((880, 520))
    if os.path.exists(after_img_path):
        after_pil = Image.open(after_img_path).resize((880, 520))

    for frame_idx in range(TOTAL_FRAMES):
        t = frame_idx / TOTAL_FRAMES
        im = Image.new("RGB", (WIDTH, HEIGHT), color=BG_CREAM)
        draw = ImageDraw.Draw(im)

        # Header
        draw_header(draw, active_tab="evidence", breadcrumb="Chuỗi Bằng chứng  /  Đối chứng Trước & Sau (Before / After)")

        # Section Title Bar
        draw.text((40, 128), "ĐỐI CHỨNG BẰNG CHỨNG HIỆN TRƯỜNG: TRƯỚC VÀ SAU KHẮC PHỤC", fill=TEXT_INK, font=FONT_TITLE)
        draw.text((40, 165), "Hồ sơ: #CASE-2026-042 | Địa điểm: Cổng số 2 Ga ngầm S9 | Phương pháp xác minh: Hình ảnh GPS + Băm SHA-256", fill=TEXT_MUTED, font=FONT_BODY)

        # -------------------------------------------------------------
        # Left Box: BEFORE (08:30)
        # -------------------------------------------------------------
        bx1, by1, bx2, by2 = 40, 205, 940, 770
        draw_rounded_rect(draw, [bx1, by1, bx2, by2], radius=10, fill=CARD_BG, outline=SEAL_RED, width=2)
        
        # Header Badge Before
        draw_rounded_rect(draw, [bx1, by1, bx2, by1+50], radius=10, fill=RED_LIGHT)
        draw.rectangle([bx1, by1+35, bx2, by1+50], fill=RED_LIGHT)
        draw.text((bx1+20, by1+12), "🔴 BEFORE — TRƯỚC XỬ LÝ (08:30:15)", fill=SEAL_RED, font=FONT_SUBTITLE)
        draw.text((bx2-280, by1+15), "PM2.5: 156 µg/m³ (Rủi ro rất cao)", fill=SEAL_RED, font=FONT_BODY_B)

        # Image Canvas Before
        if before_pil:
            im.paste(before_pil, (bx1+10, by1+60))
        else:
            draw.rectangle([bx1+10, by1+60, bx2-10, by2-110], fill="#E5E7EB")
            draw.text((bx1+280, by1+280), "📷 Ảnh xe ben cuốn bụi", fill=TEXT_MUTED, font=FONT_TITLE)

        # Telemetry & Hash Footer Before
        draw.rectangle([bx1+10, by2-95, bx2-10, by2-10], fill="#FFF5F5")
        draw.text((bx1+20, by2-85), "Tọa độ GPS: 21.0368° N, 105.7825° E  |  Thiết bị: Citizen Camera Cam-01", fill=TEXT_INK, font=FONT_CAPTION)
        draw.text((bx1+20, by2-65), "Mã băm SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069", fill=SEAL_RED, font=FONT_MONO)
        draw.text((bx1+20, by2-40), "Hiện trạng: Xe ben chở đất không phủ bạt, không rửa bánh xe khi xuất cổng.", fill=TEXT_MUTED, font=FONT_CAPTION)

        # -------------------------------------------------------------
        # Right Box: AFTER (15:45)
        # -------------------------------------------------------------
        ax1, ay1, ax2, ay2 = 980, 205, WIDTH-40, 770
        draw_rounded_rect(draw, [ax1, ay1, ax2, ay2], radius=10, fill=CARD_BG, outline=ACCENT_TEAL, width=2)
        
        # Header Badge After
        draw_rounded_rect(draw, [ax1, ay1, ax2, ay1+50], radius=10, fill=TEAL_LIGHT)
        draw.rectangle([ax1, ay1+35, ax2, ay1+50], fill=TEAL_LIGHT)
        draw.text((ax1+20, ay1+12), "🟢 AFTER — SAU KHẮC PHỤC (15:45:30)", fill=ACCENT_TEAL, font=FONT_SUBTITLE)
        draw.text((ax2-280, ay1+15), "PM2.5: 38 µg/m³ (Đạt chuẩn QCVN)", fill=ACCENT_TEAL, font=FONT_BODY_B)

        # Image Canvas After
        if after_pil:
            im.paste(after_pil, (ax1+10, ay1+60))
        else:
            draw.rectangle([ax1+10, ay1+60, ax2-10, by2-110], fill="#E5E7EB")
            draw.text((ax1+250, by1+280), "📷 Trạm phun sương & rửa xe", fill=TEXT_MUTED, font=FONT_TITLE)

        # Telemetry & Hash Footer After
        draw.rectangle([ax1+10, ay2-95, ax2-10, ay2-10], fill="#F0FDF4")
        draw.text((ax1+20, ay2-85), "Tọa độ GPS: 21.0368° N, 105.7825° E  |  Thiết bị: Inspector Mobile Terminal", fill=TEXT_INK, font=FONT_CAPTION)
        draw.text((ax1+20, ay2-65), "Mã băm SHA-256: 3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855a", fill=ACCENT_TEAL, font=FONT_MONO)
        draw.text((ax1+20, ay2-40), "Khắc phục: Đã lắp đặt giàn phun sương cao áp 12 bar & trạm xịt rửa lốp tự động.", fill=TEXT_MUTED, font=FONT_CAPTION)

        # -------------------------------------------------------------
        # Bottom Comparative Metric Cards (3 Columns)
        # -------------------------------------------------------------
        cards = [
            ("NỒNG ĐỘ BỤI PM2.5", "156 ➔ 38 µg/m³", "Giảm 75.6% — Đạt chuẩn môi trường", ACCENT_TEAL),
            ("TỶ LỆ PHỦ BẠT XE TẢI", "0% ➔ 100%", "18/18 lượt xe được che chắn tuyệt đối", ACCENT_TEAL),
            ("HỆ THỐNG PHUN SƯƠNG", "Ngừng ➔ Hoạt động", "Lưu lượng dập bụi 12 m³/giờ", ACCENT_TEAL)
        ]
        cx = 40
        for m_title, m_val, m_desc, m_col in cards:
            draw_rounded_rect(draw, [cx, 790, cx+590, HEIGHT-40], radius=8, fill=CARD_BG, outline=BORDER_COLOR, width=1)
            draw.rectangle([cx, 790, cx+8, HEIGHT-40], fill=m_col)
            draw.text((cx+25, 805), m_title, fill=TEXT_MUTED, font=FONT_BODY_SM_B)
            draw.text((cx+25, 830), m_val, fill=m_col, font=FONT_TITLE_XL)
            draw.text((cx+25, 875), m_desc, fill=TEXT_INK, font=FONT_BODY_SM)
            cx += 625

        # Split Scan Sweeper Animation (Simulating interactive slider comparison)
        sweep_x = int(40 + (WIDTH - 80) * (0.5 + 0.45 * math.sin(t * 2 * math.pi)))
        draw.line([sweep_x, 205, sweep_x, 770], fill="#D97706", width=4)
        draw.ellipse([sweep_x-18, 480-18, sweep_x+18, 480+18], fill="#D97706", outline="#FFFFFF", width=3)
        draw.text((sweep_x-10, 470), "⬌", fill="#FFFFFF", font=FONT_BODY_B)

        frames.append(np.array(im))

    temp_mp4 = os.path.join(TEMP_DIR, "ui_03.mp4")
    export_video_mp4(frames, temp_mp4, output_path)

# =============================================================================
# 6. SCENE 4: SHA-256 VERIFICATION & IMMUTABLE AUDIT TRAIL
# =============================================================================
def generate_sha256_verification_broll(output_path):
    print("\n[4/6] Rendering Scene 4: SHA-256 Hash Verification & Audit Trail...")
    
    frames = []

    for frame_idx in range(TOTAL_FRAMES):
        t = frame_idx / TOTAL_FRAMES
        im = Image.new("RGB", (WIDTH, HEIGHT), color=BG_CREAM)
        draw = ImageDraw.Draw(im)

        # Header
        draw_header(draw, active_tab="evidence", breadcrumb="Xác thực Bằng chứng Số  /  Kiểm tra Mã băm SHA-256 & Chữ ký số")

        # Title
        draw.text((40, 128), "TRUNG TÂM XÁC THỰC BẰNG CHỨNG SỐ & MÃ BĂM MẬT MÃ (SHA-256)", fill=TEXT_INK, font=FONT_TITLE)
        draw.text((40, 165), "Đảm bảo tính toàn vẹn và bất biến của chứng cứ hiện trường — Lưu trữ trên Cloudflare R2", fill=TEXT_MUTED, font=FONT_BODY)

        # -------------------------------------------------------------
        # Main Verification Card Container
        # -------------------------------------------------------------
        draw_rounded_rect(draw, [40, 205, WIDTH-40, HEIGHT-40], radius=10, fill=CARD_BG, outline=BORDER_COLOR, width=1)

        # Left Column: Image & EXIF Metadata (Width 760)
        draw_rounded_rect(draw, [70, 235, 800, 680], radius=8, fill="#F3F4F6", outline=BORDER_COLOR, width=1)
        draw.text((320, 440), "📷 ẢNH GỐC HIỆN TRƯỜNG", fill=TEXT_MUTED, font=FONT_SUBTITLE)
        draw.text((290, 475), "Độ phân giải: 3840x2160 (4K RAW)", fill=TEXT_LIGHT, font=FONT_BODY_SM)

        # Metadata Table below image
        draw_rounded_rect(draw, [70, 700, 800, 990], radius=8, fill="#FAFAF9", outline=BORDER_COLOR, width=1)
        draw.text((90, 715), "SIÊU DỮ LIỆU BẤT BIẾN (METADATA EXIF):", fill=TEXT_INK, font=FONT_BODY_SM_B)
        
        exif = [
            ("Tọa độ GPS WGS84:", "21.036842° N, 105.782514° E (Độ cao: 12.4m)"),
            ("Thời gian chụp (UTC+7):", "2026-08-31T08:32:15.824+07:00"),
            ("Khóa công khai (ECDSA):", "04b98c34f1982a...e7829a1b (Youth Club ID #08)"),
            ("Địa chỉ R2 Bucket:", "r2://dustguard-evidence/2026/08/case-042/orig.jpg")
        ]
        ey = 745
        for ek, ev in exif:
            draw.text((90, ey), ek, fill=TEXT_MUTED, font=FONT_BODY_SM_B)
            draw.text((310, ey), ev, fill=TEXT_INK, font=FONT_MONO)
            ey += 32

        # -------------------------------------------------------------
        # Right Column: Cryptographic Hash Verification Engine
        # -------------------------------------------------------------
        rx1, ry1, rx2, ry2 = 840, 235, WIDTH-70, 990
        
        draw_rounded_rect(draw, [rx1, ry1, rx2, ry1+260], radius=8, fill="#1C242B")
        draw.text((rx1+30, ry1+25), "THUẬT TOÁN BĂM MẬT MÃ HỌC (SHA-256 CHECKSUM)", fill="#9CA3AF", font=FONT_BODY_SM_B)
        
        # SHA-256 Hash Display Box
        hash_str = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        
        # Scanning laser effect
        scan_progress = min(1.0, max(0.0, (t - 0.20) / 0.40))
        scan_idx = int(scan_progress * len(hash_str))

        draw_rounded_rect(draw, [rx1+30, ry1+65, rx2-30, ry1+160], radius=6, fill="#0F172A", outline="#334155", width=1)
        
        # Render characters with scan highlight
        for i, ch in enumerate(hash_str):
            col = "#34D399" if i < scan_idx else ("#FBBF24" if i == scan_idx else "#64748B")
            draw.text((rx1+45 + (i % 32) * 28, ry1+80 + (i // 32) * 35), ch, fill=col, font=FONT_MONO_B)

        # Verification Status Message inside Black Box
        if t < 0.25:
            draw.text((rx1+30, ry1+185), "Trạng thái: Sẵn sàng kiểm tra tính toàn vẹn...", fill="#94A3B8", font=FONT_BODY_SM)
        elif t < 0.65:
            draw.text((rx1+30, ry1+185), f"Đang tính toán mã băm Web Crypto API... [{int(scan_progress*100)}%]", fill="#FBBF24", font=FONT_BODY_SM_B)
        else:
            draw.text((rx1+30, ry1+185), "✓ Mã băm hoàn toàn trùng khớp với chứng thư trên Cloudflare R2!", fill="#34D399", font=FONT_BODY_SM_B)

        # -------------------------------------------------------------
        # Verification Result Card (Bottom Right)
        # -------------------------------------------------------------
        res_y = ry1 + 280
        if t >= 0.65:
            draw_rounded_rect(draw, [rx1, res_y, rx2, res_y+260], radius=8, fill=TEAL_LIGHT, outline=ACCENT_TEAL, width=2)
            draw.text((rx1+30, res_y+25), "✓ XÁC MINH THÀNH CÔNG: TÍNH TOÀN VẸN 100%", fill=ACCENT_TEAL, font=FONT_SUBTITLE)
            
            res_items = [
                ("Chống giả mạo:", "Hình ảnh không bị chỉnh sửa, nén lại hoặc thay đổi pixel."),
                ("Tính pháp lý:", "Hồ sơ đủ điều kiện làm chứng cứ bàn giao thanh tra."),
                ("Bảo chứng số:", "Xác nhận bởi Nút kiểm định DustGuard VN SSOT Engine.")
            ]
            r_iy = res_y + 70
            for rk, rv in res_items:
                draw.text((rx1+30, r_iy), f"• {rk}", fill=ACCENT_TEAL, font=FONT_BODY_SM_B)
                draw.text((rx1+180, r_iy), rv, fill=TEXT_INK, font=FONT_BODY_SM)
                r_iy += 38

            # Verified Seal Badge
            draw_rounded_rect(draw, [rx2-220, res_y+160, rx2-30, res_y+225], radius=6, fill=ACCENT_TEAL)
            draw.text((rx2-205, res_y+180), "IMMUTABLE ✓", fill="#FFFFFF", font=FONT_BODY_B)
        else:
            draw_rounded_rect(draw, [rx1, res_y, rx2, res_y+260], radius=8, fill="#FAFAF9", outline=BORDER_COLOR, width=1)
            draw.text((rx1+30, res_y+25), "KẾT QUẢ KIỂM TRA CHỨNG THỰC SỐ", fill=TEXT_MUTED, font=FONT_SUBTITLE)
            draw.text((rx1+30, res_y+70), "Nhấn nút 'Kiểm tra mã băm' để đối chiếu chữ ký số SHA-256...", fill=TEXT_LIGHT, font=FONT_BODY)

        # Mouse Click Action
        cursor_pos = [1100, 320]
        clicking = False
        click_prog = 0.0

        if t < 0.20:
            p = smoothstep(t / 0.20)
            cursor_pos = [1300 + (1100 - 1300) * p, 480 + (320 - 480) * p]
            if 0.15 <= t < 0.20:
                clicking = True
                click_prog = (t - 0.15) / 0.05

        ripple_img = draw_mouse_cursor(draw, cursor_pos, clicking=clicking, click_progress=click_prog)
        if ripple_img:
            im.paste(Image.alpha_composite(im.convert("RGBA"), ripple_img).convert("RGB"))

        frames.append(np.array(im))

    temp_mp4 = os.path.join(TEMP_DIR, "ui_04.mp4")
    export_video_mp4(frames, temp_mp4, output_path)

# =============================================================================
# 7. SCENE 5: PILOT METRICS & OPERATIONAL DASHBOARD
# =============================================================================
def generate_pilot_dashboard_broll(output_path):
    print("\n[5/6] Rendering Scene 5: Lean Pilot Metrics Dashboard...")
    
    frames = []

    for frame_idx in range(TOTAL_FRAMES):
        t = frame_idx / TOTAL_FRAMES
        im = Image.new("RGB", (WIDTH, HEIGHT), color=BG_CREAM)
        draw = ImageDraw.Draw(im)

        # Header
        draw_header(draw, active_tab="pilot", breadcrumb="Chỉ số Thực nghiệm  /  Báo cáo Pilot 4 Tuần")

        # Title & Pilot Scope
        draw.text((40, 128), "BÁO CÁO THỰC NGHIỆM PILOT (4 TUẦN TẠI CỤM TRƯỜNG HỌC & KHU DÂN CƯ)", fill=TEXT_INK, font=FONT_TITLE)
        
        # Sub-badge with exact wording requirement
        draw_rounded_rect(draw, [40, 168, 480, 196], radius=4, fill=TEAL_LIGHT, outline=ACCENT_TEAL, width=1)
        draw.text((50, 172), "Mục tiêu đo lường Pilot / Demo Model — Thanh niên & Cộng đồng", fill=ACCENT_TEAL, font=FONT_BODY_SM_B)

        # -------------------------------------------------------------
        # 4 Core KPI Cards (Animated Count-up)
        # -------------------------------------------------------------
        count_p = ease_in_out(min(1.0, t / 0.60))
        
        val_evidence = round(88.5 * count_p, 1)
        val_sla = round(14.2 * count_p, 1)
        val_update = round(92.0 * count_p, 1)
        val_resolved = round(96.4 * count_p, 1)

        kpis = [
            ("% HỒ SƠ ĐỦ BẰNG CHỨNG", f"{val_evidence}%", "Mục tiêu: ≥80% (Vượt +8.5%)", ACCENT_TEAL),
            ("THỜI GIAN PHẢN HỒI TRUNG BÌNH", f"{val_sla} Giờ", "Cam kết SLA: ≤48h (Tốt hơn 70%)", ACCENT_TEAL),
            ("% VỤ VIỆC CẬP NHẬT TIẾN TRÌNH", f"{val_update}%", "Minh bạch hóa 4 bên phối hợp", ACCENT_TEAL),
            ("% HỒ SƠ BÀN GIAO THÀNH CÔNG", f"{val_resolved}%", "27 / 28 vụ việc xử lý dứt điểm", ACCENT_TEAL)
        ]

        kx = 40
        for k_title, k_val, k_sub, k_col in kpis:
            draw_rounded_rect(draw, [kx, 215, kx+440, 360], radius=8, fill=CARD_BG, outline=BORDER_COLOR, width=1)
            draw.rectangle([kx, 215, kx+6, 360], fill=k_col)
            draw.text((kx+25, 235), k_title, fill=TEXT_MUTED, font=FONT_BODY_SM_B)
            draw.text((kx+25, 262), k_val, fill=k_col, font=FONT_TITLE_XL)
            draw.text((kx+25, 318), k_sub, fill=TEXT_INK, font=FONT_BODY_SM)
            kx += 465

        # -------------------------------------------------------------
        # Chart 1: 4-Week Progression Bar Chart (Left)
        # -------------------------------------------------------------
        cx1, cy1, cx2, cy2 = 40, 385, 1140, HEIGHT-40
        draw_rounded_rect(draw, [cx1, cy1, cx2, cy2], radius=10, fill=CARD_BG, outline=BORDER_COLOR, width=1)
        draw.text((cx1+30, cy1+25), "TIẾN ĐỘ GIẢI QUYẾT VỤ VIỆC THEO TUẦN (PILOT TIMELINE)", fill=TEXT_INK, font=FONT_SUBTITLE)
        draw.text((cx1+30, cy1+55), "Số lượng vụ việc tiếp nhận và tỷ lệ xử lý dứt điểm đạt chuẩn", fill=TEXT_MUTED, font=FONT_BODY_SM)

        # Draw Grid lines
        for gy in range(cy1+100, cy2-60, 80):
            draw.line([cx1+80, gy, cx2-40, gy], fill="#F3F4F6", width=1)

        # Bar chart bars
        weeks_data = [
            ("Tuần 1", 12, 8, 66.7),
            ("Tuần 2", 18, 14, 77.8),
            ("Tuần 3", 22, 19, 86.4),
            ("Tuần 4", 28, 27, 96.4)
        ]

        bx = cx1 + 140
        for w_label, total, resolved, rate in weeks_data:
            # Animate height
            bh_total = int((total / 30.0) * 320 * count_p)
            bh_resolved = int((resolved / 30.0) * 320 * count_p)

            # Background bar (Total)
            draw_rounded_rect(draw, [bx, cy2-80-bh_total, bx+80, cy2-80], radius=4, fill="#E5E7EB")
            # Resolved bar (Teal)
            draw_rounded_rect(draw, [bx, cy2-80-bh_resolved, bx+80, cy2-80], radius=4, fill=ACCENT_TEAL)

            # Labels
            draw.text((bx+20, cy2-65), w_label, fill=TEXT_INK, font=FONT_BODY_SM_B)
            draw.text((bx+15, cy2-80-bh_resolved-30), f"{rate}%", fill=ACCENT_TEAL, font=FONT_BODY_SM_B)

            bx += 230

        # -------------------------------------------------------------
        # Chart 2: Source Breakdown & Resolution Methods (Right)
        # -------------------------------------------------------------
        rx1, ry1, rx2, ry2 = 1170, 385, WIDTH-40, HEIGHT-40
        draw_rounded_rect(draw, [rx1, ry1, rx2, ry2], radius=10, fill=CARD_BG, outline=BORDER_COLOR, width=1)
        draw.text((rx1+30, ry1+25), "PHÂN LOẠI BIỆN PHÁP KHẮC PHỤC", fill=TEXT_INK, font=FONT_SUBTITLE)
        
        methods = [
            ("Lắp đặt giàn phun sương dập bụi", "45%", ACCENT_TEAL),
            ("Rửa sạch lốp xe trước khi ra đường", "30%", "#0284C7"),
            ("Che bạt kín thùng xe vận chuyển", "25%", WARN_AMBER)
        ]
        my = ry1 + 100
        for m_name, m_pct, m_color in methods:
            draw.text((rx1+30, my), m_name, fill=TEXT_INK, font=FONT_BODY_B)
            draw.text((rx2-80, my), m_pct, fill=m_color, font=FONT_BODY_B)
            # Progress bar
            draw_rounded_rect(draw, [rx1+30, my+30, rx2-40, my+46], radius=4, fill="#F3F4F6")
            pct_val = int(m_pct.replace('%', '')) / 100.0 * count_p
            draw_rounded_rect(draw, [rx1+30, my+30, int(rx1+30 + (rx2-rx1-70) * pct_val), my+46], radius=4, fill=m_color)
            my += 80

        # Civic Pilot Note at bottom right
        draw_rounded_rect(draw, [rx1+30, ry2-180, rx2-40, ry2-30], radius=8, fill="#F0FDF4", outline=ACCENT_TEAL, width=1)
        draw.text((rx1+50, ry2-160), "ĐÁNH GIÁ THỰC TẾ PILOT:", fill=ACCENT_TEAL, font=FONT_BODY_SM_B)
        draw.text((rx1+50, ry2-130), "• Tỷ lệ tham gia của thanh niên & cư dân tăng 140%.", fill=TEXT_INK, font=FONT_BODY_SM)
        draw.text((rx1+50, ry2-100), "• Giảm 65% thời gian xử lý thủ tục hành chính giấy tờ.", fill=TEXT_INK, font=FONT_BODY_SM)
        draw.text((rx1+50, ry2-70), "• 100% hồ sơ có mã băm SHA-256 đối chứng minh bạch.", fill=TEXT_INK, font=FONT_BODY_SM)

        frames.append(np.array(im))

    temp_mp4 = os.path.join(TEMP_DIR, "ui_05.mp4")
    export_video_mp4(frames, temp_mp4, output_path)

# =============================================================================
# 8. SCENE 6: OFFICIAL A4 REPORT & PDF EXPORT DOSSIER
# =============================================================================
def generate_official_a4_report_broll(output_path):
    print("\n[6/6] Rendering Scene 6: Official A4 Administrative Report & PDF Export...")
    
    frames = []

    # A4 Paper Dimensions on Screen
    a4_w, a4_h = 860, 1200
    a4_x = (WIDTH - a4_w) // 2  # 530

    for frame_idx in range(TOTAL_FRAMES):
        t = frame_idx / TOTAL_FRAMES
        im = Image.new("RGB", (WIDTH, HEIGHT), color=BG_CREAM)
        draw = ImageDraw.Draw(im)

        # Header
        draw_header(draw, active_tab="reports", breadcrumb="Báo cáo & Bàn giao  /  Xuất Hồ sơ Biên bản A4")

        # Top Bar with Export Action Button
        draw.text((40, 128), "TRÌNH XUẤT BÁO CÁO HÀNH CHÍNH & HỒ SƠ BÀN GIAO CHUẨN A4", fill=TEXT_INK, font=FONT_TITLE)
        
        # Export Button (Top Right)
        btn_exported = (t >= 0.70)
        if not btn_exported:
            draw_rounded_rect(draw, [WIDTH-340, 125, WIDTH-40, 175], radius=6, fill=ACCENT_TEAL)
            draw.text((WIDTH-300, 138), "📥 XUẤT FILE PDF / A4", fill="#FFFFFF", font=FONT_BODY_B)
        else:
            draw_rounded_rect(draw, [WIDTH-380, 125, WIDTH-40, 175], radius=6, fill="#059669")
            draw.text((WIDTH-360, 138), "✓ ĐÃ TẢI BIÊN BẢN PDF (A4)", fill="#FFFFFF", font=FONT_BODY_B)

        # -------------------------------------------------------------
        # A4 Document Sheet with Smooth Scrolling Effect
        # -------------------------------------------------------------
        scroll_y = int(ease_in_out(min(1.0, max(0.0, (t - 0.15) / 0.50))) * 220)
        doc_top = 195 - scroll_y

        # Document Shadow / Outline
        draw_rounded_rect(draw, [a4_x, doc_top, a4_x+a4_w, doc_top+a4_h], radius=4, fill="#FFFFFF", outline=BORDER_DARK, width=1)

        # Official Administrative National Header
        draw.text((a4_x+220, doc_top+40), "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", fill=TEXT_INK, font=FONT_BODY_B)
        draw.text((a4_x+280, doc_top+65), "Độc lập — Tự do — Hạnh phúc", fill=TEXT_INK, font=FONT_BODY_B)
        draw.line([a4_x+320, doc_top+90, a4_x+540, doc_top+90], fill=TEXT_INK, width=1)

        # Document Serial
        draw.text((a4_x+60, doc_top+110), "Số: 42/BB-DG/2026/HN-CG", fill=TEXT_MUTED, font=FONT_BODY_SM)
        draw.text((a4_x+540, doc_top+110), "Cầu Giấy, ngày 31 tháng 08 năm 2026", fill=TEXT_MUTED, font=FONT_BODY_SM)

        # Main Document Title
        draw.text((a4_x+120, doc_top+160), "BIÊN BẢN GIÁM SÁT MÔI TRƯỜNG VÀ BÀN GIAO XỬ LÝ", fill=SEAL_RED, font=FONT_SUBTITLE)
        draw.text((a4_x+220, doc_top+195), "(Về việc kiểm soát bụi công trình tại Ga ngầm S9)", fill=TEXT_MUTED, font=FONT_BODY_SM_B)

        # Section 1: Thông tin chung
        draw.text((a4_x+60, doc_top+240), "I. THÔNG TIN ĐỐI TƯỢNG GIÁM SÁT:", fill=TEXT_INK, font=FONT_BODY_B)
        draw.text((a4_x+80, doc_top+270), "• Dự án: Tuyến Đường sắt Đô thị Thí điểm TP Hà Nội (Đoạn Nhổn - Ga Hà Nội)", fill=TEXT_INK, font=FONT_BODY_SM)
        draw.text((a4_x+80, doc_top+295), "• Vị trí: Ga ngầm S9 - Cổng số 2 (Đường Cầu Giấy, Phường Mai Dịch)", fill=TEXT_INK, font=FONT_BODY_SM)
        draw.text((a4_x+80, doc_top+320), "• Đơn vị thi công: Liên danh FECON — Sông Đà (Chỉ huy trưởng: Nguyễn Đức Toàn)", fill=TEXT_INK, font=FONT_BODY_SM)

        # Section 2: Kết quả đối chứng Before / After
        draw.text((a4_x+60, doc_top+365), "II. HIỆN TRẠNG & KẾT QUẢ ĐỐI CHỨNG (HỆ THỐNG DUSTGUARD VN):", fill=TEXT_INK, font=FONT_BODY_B)
        
        # Table of comparison inside A4
        draw.rectangle([a4_x+60, doc_top+400, a4_x+a4_w-60, doc_top+540], outline=BORDER_DARK, width=1)
        draw.line([a4_x+60, doc_top+435, a4_x+a4_w-60, doc_top+435], fill=BORDER_DARK, width=1)
        draw.line([a4_x+260, doc_top+400, a4_x+260, doc_top+540], fill=BORDER_DARK, width=1)
        draw.line([a4_x+520, doc_top+400, a4_x+520, doc_top+540], fill=BORDER_DARK, width=1)

        draw.text((a4_x+80, doc_top+410), "Hạng mục kiểm tra", fill=TEXT_INK, font=FONT_BODY_SM_B)
        draw.text((a4_x+280, doc_top+410), "Trước xử lý (08:30)", fill=SEAL_RED, font=FONT_BODY_SM_B)
        draw.text((a4_x+540, doc_top+410), "Sau khắc phục (15:45)", fill=ACCENT_TEAL, font=FONT_BODY_SM_B)

        draw.text((a4_x+80, doc_top+450), "Nồng độ bụi PM2.5", fill=TEXT_INK, font=FONT_BODY_SM)
        draw.text((a4_x+280, doc_top+450), "156 µg/m³ (Rủi ro rất cao)", fill=SEAL_RED, font=FONT_BODY_SM)
        draw.text((a4_x+540, doc_top+450), "38 µg/m³ (Đạt chuẩn QCVN)", fill=ACCENT_TEAL, font=FONT_BODY_SM)

        draw.text((a4_x+80, doc_top+480), "Che bạt xe chở đất", fill=TEXT_INK, font=FONT_BODY_SM)
        draw.text((a4_x+280, doc_top+480), "Không che bạt (Vi phạm)", fill=SEAL_RED, font=FONT_BODY_SM)
        draw.text((a4_x+540, doc_top+480), "Phủ kín 100% (Đạt yêu cầu)", fill=ACCENT_TEAL, font=FONT_BODY_SM)

        draw.text((a4_x+80, doc_top+510), "Trạm rửa lốp xe & phun sương", fill=TEXT_INK, font=FONT_BODY_SM)
        draw.text((a4_x+280, doc_top+510), "Không vận hành", fill=SEAL_RED, font=FONT_BODY_SM)
        draw.text((a4_x+540, doc_top+510), "Hoạt động 12 bar tự động", fill=ACCENT_TEAL, font=FONT_BODY_SM)

        # Section 3: Mã băm chứng thực số
        draw.text((a4_x+60, doc_top+565), "III. CHỨNG TỰ ĐIỆN TỬ VÀ MÃ BĂM MẬT MÃ (SHA-256 IMMUTABLE):", fill=TEXT_INK, font=FONT_BODY_B)
        draw.text((a4_x+80, doc_top+595), "Mã băm SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", fill=TEXT_MUTED, font=FONT_MONO)
        draw.text((a4_x+80, doc_top+620), "Trạng thái: Đã đồng bộ Cloudflare D1 & R2 Storage. Bằng chứng số có giá trị pháp lý.", fill=ACCENT_TEAL, font=FONT_CAPTION)

        # Section 4: Chữ ký & Dấu mộc
        draw.text((a4_x+100, doc_top+680), "ĐẠI DIỆN ĐƠN VỊ THI CÔNG", fill=TEXT_INK, font=FONT_BODY_B)
        draw.text((a4_x+110, doc_top+705), "(Ký, ghi rõ họ tên & đóng dấu)", fill=TEXT_MUTED, font=FONT_CAPTION)
        draw.text((a4_x+130, doc_top+800), "Nguyễn Đức Toàn", fill=TEXT_INK, font=FONT_BODY_B)

        draw.text((a4_x+500, doc_top+680), "TỔ TRƯỞNG TỔ GIÁM SÁT MÔI TRƯỜNG", fill=TEXT_INK, font=FONT_BODY_B)
        draw.text((a4_x+540, doc_top+705), "(Ký số & xác thực DustGuard VN)", fill=TEXT_MUTED, font=FONT_CAPTION)
        draw.text((a4_x+560, doc_top+800), "Trần Hoàng Nam", fill=TEXT_INK, font=FONT_BODY_B)

        # Red Stamp
        draw.ellipse([a4_x+510, doc_top+730, a4_x+630, doc_top+830], fill=None, outline=SEAL_RED, width=3)
        draw.text((a4_x+530, doc_top+765), "DUSTGUARD VN\n CHỨNG THỰC", fill=SEAL_RED, font=FONT_CAPTION)

        # Mouse Click Action on Export Button
        cursor_pos = [WIDTH-200, 300]
        clicking = False
        click_prog = 0.0

        if t >= 0.60:
            p = smoothstep((t - 0.60) / 0.20)
            cursor_pos = [WIDTH-200, 300 + (150 - 300) * p]
            if 0.70 <= t < 0.85:
                clicking = True
                click_prog = (t - 0.70) / 0.15

        ripple_img = draw_mouse_cursor(draw, cursor_pos, clicking=clicking, click_progress=click_prog)
        if ripple_img:
            im.paste(Image.alpha_composite(im.convert("RGBA"), ripple_img).convert("RGB"))

        frames.append(np.array(im))

    temp_mp4 = os.path.join(TEMP_DIR, "ui_06.mp4")
    export_video_mp4(frames, temp_mp4, output_path)

# =============================================================================
# 9. VIDEO EXPORT ENGINE (CV2 + FFMPEG ENCODING)
# =============================================================================
def export_video_mp4(frames, temp_path, final_path):
    """Write frames using OpenCV then re-encode with ffmpeg H.264 YUV420P."""
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    writer = cv2.VideoWriter(temp_path, fourcc, FPS, (WIDTH, HEIGHT))
    
    for f in frames:
        # RGB to BGR for cv2
        bgr = cv2.cvtColor(f, cv2.COLOR_RGB2BGR)
        writer.write(bgr)
    writer.release()

    # Re-encode with ffmpeg for ultra-compatibility and crisp colors
    cmd = [
        "ffmpeg", "-y",
        "-i", temp_path,
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-r", str(FPS),
        final_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    if os.path.exists(temp_path):
        os.remove(temp_path)
    print(f"  --> Successfully rendered: {final_path}")

# =============================================================================
# 10. MAIN EXECUTION CONTROLLER
# =============================================================================
def main():
    print("="*80)
    print(" DUSTGUARD VN — UI LIVE DEMO B-ROLL VIDEO GENERATOR")
    print(" Resolution: 1920x1080 | Framerate: 25fps | Theme: Civic Tech Light Mode")
    print("="*80)

    clips = [
        ("ui_01_interactive_map.mp4", generate_interactive_map_broll),
        ("ui_02_case_management.mp4", generate_case_management_broll),
        ("ui_03_evidence_before_after.mp4", generate_evidence_before_after_broll),
        ("ui_04_sha256_verification.mp4", generate_sha256_verification_broll),
        ("ui_05_pilot_dashboard.mp4", generate_pilot_dashboard_broll),
        ("ui_06_official_a4_report.mp4", generate_official_a4_report_broll)
    ]

    for filename, gen_func in clips:
        out_file = os.path.join(OUTPUT_DIR, filename)
        gen_func(out_file)

    print("\n" + "="*80)
    print(" [✓] ALL 6 UI DEMO B-ROLL VIDEOS SUCCESSFULLY GENERATED!")
    print(f" Destination Directory: {OUTPUT_DIR}")
    print("="*80)

if __name__ == "__main__":
    main()
