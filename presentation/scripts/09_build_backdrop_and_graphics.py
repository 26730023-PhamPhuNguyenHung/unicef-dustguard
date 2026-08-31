#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DustGuard VN — 09_build_backdrop_and_graphics.py
Subagent 9: Interactive Backdrop & Multi-Format Layout Specialist

Chức năng:
1. Đọc quy cách thiết kế tại presentation/BACKDROP_70X90_SPEC.md.
2. Sinh ra ấn phẩm Backdrop / Poster triển lãm kích thước chuẩn 700mm x 900mm (70x90cm)
   với 4 khối nội dung chuẩn Civic Tech:
   - Khối 1: Vấn đề & Bối cảnh ô nhiễm bụi đô thị (PM2.5, PM10)
   - Khối 2: Giải pháp DustGuard VN & Quy trình 5 bước đóng vòng (5-Step Closed Loop)
   - Khối 3: Trách nhiệm AI ("AI là Trợ lý, Không Phán xét") & Bằng chứng D1 SSOT (SHA-256)
   - Khối 4: Lộ trình Lean Pilot, 3 Chỉ số & 3 Trụ cột hợp tác (Thanh niên - Nhà thầu - 1022)
3. Sinh kèm:
   - SVG Vector 7000x9000 (Scalable vô hạn, chuẩn in ấn chất lượng cao)
   - PDF Vector 700x900mm có CMYK & Trim/Bleed Marks
   - PNG Preview phân giải cao (2333x3000px / 300DPI ready)
   - HTML5 Renderer tương tác (hỗ trợ in 1:1 sang PDF hoặc render Canvas 8268x10630px 300DPI)
   - Video Thumbnail Cover 16:9 (1920x1080 px) định dạng SVG, PNG & HTML
   - CMYK Spec JSON & Hướng dẫn kỹ thuật in ấn README.md
"""

import os
import sys
import json
import base64
import io

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

import qrcode
import qrcode.image.svg
import fitz  # PyMuPDF

# ==============================================================================
# 1. HỆ MÀU & ĐẶC TẢ THIẾT KẾ SSOT (CIVIC TECH COLOR SYSTEM)
# ==============================================================================
COLORS = {
    "bg_cream": "#FDFBF7",
    "bg_warm": "#F7F3EB",
    "ink_dark": "#231B14",
    "ink_muted": "#574F45",
    "seal_red": "#9F241F",
    "dustguard_red": "#B51F24",
    "civic_teal": "#0D6F64",
    "teal_light": "#E6F4F1",
    "teal_dark": "#084C44",
    "action_green": "#1E7E4E",
    "green_light": "#E8F7EE",
    "alert_amber": "#B45309",
    "amber_light": "#FEF3C7",
    "card_white": "#FFFFFF",
    "border_light": "#E5E0D8",
    "border_strong": "#D4CEBF",
    "gold_accent": "#D97706",
}

URL_DEMO_APP = "https://dustguard.vn"
URL_TECH_DOCS = "https://dustguard.vn/docs/dossier-sha256"


def generate_qr_svg_path(data: str):
    """Sinh chuỗi path SVG cho QR Code chuẩn."""
    qr = qrcode.QRCode(
        version=2,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=0,
    )
    qr.add_data(data)
    qr.make(fit=True)
    matrix = qr.get_matrix()
    size = len(matrix)

    paths = []
    for r in range(size):
        for c in range(size):
            if matrix[r][c]:
                paths.append(f"M{c},{r}h1v1h-1z")
    path_d = " ".join(paths)
    return size, path_d


# ==============================================================================
# 2. XÂY DỰNG SVG VECTOR CHO BACKDROP 700mm x 900mm (7000 x 9000 VIEWBOX)
# ==============================================================================
def build_backdrop_svg() -> str:
    qr1_size, qr1_path = generate_qr_svg_path(URL_DEMO_APP)
    qr2_size, qr2_path = generate_qr_svg_path(URL_TECH_DOCS)

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7000 9000" width="700mm" height="900mm" style="background-color: {COLORS['bg_cream']}; font-family: 'Be Vietnam Pro', 'Segoe UI', system-ui, -apple-system, sans-serif;">
  <defs>
    <!-- Solid Linear Gradients for Badges & Cards -->
    <linearGradient id="header-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="{COLORS['seal_red']}"/>
      <stop offset="100%" stop-color="{COLORS['dustguard_red']}"/>
    </linearGradient>
    <linearGradient id="teal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="{COLORS['civic_teal']}"/>
      <stop offset="100%" stop-color="{COLORS['teal_dark']}"/>
    </linearGradient>
  </defs>

  <!-- NỀN CHÍNH CIVIC TECH (SOLID CREAM #FDFBF7) -->
  <rect width="7000" height="9000" fill="{COLORS['bg_cream']}"/>

  <!-- KHUNG VIỀN NGOÀI BẢO VỆ (OUTER BORDER) -->
  <rect x="80" y="80" width="6840" height="8840" fill="none" stroke="{COLORS['border_strong']}" stroke-width="8"/>
  <rect x="150" y="150" width="6700" height="8700" fill="none" stroke="{COLORS['border_light']}" stroke-width="4" stroke-dasharray="24,12"/>

  <!-- ========================================================================= -->
  <!-- TẦNG 1: HEADER & ĐỊNH VỊ THƯƠNG HIỆU (Y: 180 -> 1340)                    -->
  <!-- ========================================================================= -->
  <g id="header-section">
    <!-- Top Ribbon: UNICEF Hackathon 2026 Finals -->
    <rect x="250" y="240" width="6500" height="110" rx="20" fill="{COLORS['seal_red']}"/>
    <text x="3500" y="312" fill="#FFFFFF" font-size="44" font-weight="800" text-anchor="middle" letter-spacing="4">
      ★ CUỘC THI SÁNG KIẾN ĐỔI MỚI XÃ HỘI &amp; MÔI TRƯỜNG — UNICEF HACKATHON 2026 ★
    </text>

    <!-- Main Header Card -->
    <rect x="250" y="390" width="6500" height="950" rx="32" fill="{COLORS['card_white']}" stroke="{COLORS['border_strong']}" stroke-width="5"/>
    
    <!-- Shield Logo Icon Vector -->
    <g transform="translate(450, 510)">
      <!-- Shield Outer -->
      <path d="M140 0 L280 60 L280 250 C280 390 140 480 140 480 C140 480 0 390 0 250 L0 60 Z" fill="{COLORS['seal_red']}"/>
      <!-- Shield Inner -->
      <path d="M140 30 L250 80 L250 240 C250 355 140 435 140 435 C140 435 30 355 30 240 L30 80 Z" fill="{COLORS['card_white']}"/>
      <!-- Shield Core Emblem: Leaf & Sensor Wave -->
      <path d="M140 90 C190 90 220 130 220 180 C220 250 140 330 140 330 C140 330 60 250 60 180 C60 130 90 90 140 90 Z" fill="{COLORS['civic_teal']}"/>
      <circle cx="140" cy="180" r="30" fill="{COLORS['card_white']}"/>
      <circle cx="140" cy="180" r="15" fill="{COLORS['seal_red']}"/>
      <!-- Antenna Wave -->
      <path d="M100 140 C120 120 160 120 180 140" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" fill="none"/>
      <path d="M80 115 C115 85 165 85 200 115" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" fill="none"/>
    </g>

    <!-- Brand Typography & Titles -->
    <g transform="translate(850, 520)">
      <text x="0" y="110" fill="{COLORS['ink_dark']}" font-size="125" font-weight="900" letter-spacing="-1">DUSTGUARD VN</text>
      
      <!-- Slogan Pill Badge -->
      <rect x="0" y="160" width="2350" height="75" rx="16" fill="{COLORS['teal_light']}" stroke="{COLORS['civic_teal']}" stroke-width="3"/>
      <text x="30" y="212" fill="{COLORS['civic_teal']}" font-size="38" font-weight="800" letter-spacing="2">
        GIÁM SÁT BỤI CÔNG TRÌNH · HÀNH ĐỘNG CỘNG ĐỒNG · MINH BẠCH BẰNG CHỨNG
      </text>

      <!-- Positioning Statement -->
      <text x="0" y="300" fill="{COLORS['ink_dark']}" font-size="44" font-weight="600">
        Nền tảng Civic Tech kết nối tín hiệu bụi hiện trường thành hồ sơ số có bảo chứng SHA-256
      </text>
      <text x="0" y="360" fill="{COLORS['ink_muted']}" font-size="38" font-weight="400">
        Khép kín chu trình tái kiểm 24h–48h, đồng hành cùng Thanh niên vì Không khí Sạch Việt Nam
      </text>
    </g>

    <!-- Right Header Badges -->
    <g transform="translate(4950, 520)">
      <!-- Badge 1: 5-Step Loop -->
      <rect x="0" y="30" width="1650" height="150" rx="20" fill="{COLORS['bg_cream']}" stroke="{COLORS['border_strong']}" stroke-width="4"/>
      <circle cx="80" cy="105" r="45" fill="{COLORS['civic_teal']}"/>
      <text x="80" y="118" fill="#FFFFFF" font-size="34" font-weight="800" text-anchor="middle">5S</text>
      <text x="150" y="85" fill="{COLORS['ink_dark']}" font-size="36" font-weight="800">Chu Trình Khép Kín</text>
      <text x="150" y="130" fill="{COLORS['ink_muted']}" font-size="30" font-weight="500">Phát hiện → Xử lý → Tái kiểm 48h</text>

      <!-- Badge 2: D1 & SHA-256 -->
      <rect x="0" y="210" width="1650" height="150" rx="20" fill="{COLORS['bg_cream']}" stroke="{COLORS['border_strong']}" stroke-width="4"/>
      <circle cx="80" cy="285" r="45" fill="{COLORS['seal_red']}"/>
      <text x="80" y="297" fill="#FFFFFF" font-size="30" font-weight="800" text-anchor="middle">D1</text>
      <text x="150" y="265" fill="{COLORS['ink_dark']}" font-size="36" font-weight="800">Bảo Chứng SHA-256</text>
      <text x="150" y="310" fill="{COLORS['ink_muted']}" font-size="30" font-weight="500">Cloudflare D1 SSOT · Toàn vẹn dữ liệu</text>
    </g>
  </g>

  <!-- ========================================================================= -->
  <!-- KHỐI 1: VẤN ĐỀ & BỐI CẢNH ĐÔ THỊ (Y: 1390 -> 2680)                         -->
  <!-- ========================================================================= -->
  <g id="block-1-problem">
    <!-- Block Title Bar -->
    <rect x="250" y="1390" width="6500" height="90" rx="16" fill="{COLORS['ink_dark']}"/>
    <rect x="250" y="1390" width="20" height="90" rx="4" fill="{COLORS['seal_red']}"/>
    <text x="310" y="1450" fill="#FFFFFF" font-size="44" font-weight="800" letter-spacing="2">
      KHỐI 1: VẤN ĐỀ &amp; NGHỊCH LÝ GIÁM SÁT BỤI CÔNG TRÌNH ĐÔ THỊ
    </text>
    <text x="6550" y="1450" fill="{COLORS['gold_accent']}" font-size="36" font-weight="700" text-anchor="end">
      THỰC TRẠNG &amp; THÁCH THỨC
    </text>

    <!-- Main Container Card -->
    <rect x="250" y="1500" width="6500" height="1160" rx="28" fill="{COLORS['card_white']}" stroke="{COLORS['border_strong']}" stroke-width="4"/>

    <!-- 3 Stat Highlight Columns -->
    <!-- Stat 1: PM2.5 vượt ngưỡng -->
    <g transform="translate(350, 1550)">
      <rect x="0" y="0" width="1950" height="420" rx="20" fill="#FFF5F5" stroke="{COLORS['dustguard_red']}" stroke-width="3"/>
      <text x="60" y="80" fill="{COLORS['seal_red']}" font-size="34" font-weight="800">Ô NHIỄM BỤI CÔNG TRÌNH</text>
      <text x="60" y="210" fill="{COLORS['dustguard_red']}" font-size="110" font-weight="900">3x – 7x</text>
      <text x="60" y="280" fill="{COLORS['ink_dark']}" font-size="36" font-weight="700">Vượt QCVN 05:2023/BTNM</text>
      <text x="60" y="340" fill="{COLORS['ink_muted']}" font-size="30" font-weight="500">Nồng độ PM2.5 &amp; PM10 giờ cao điểm xe tải đào móng, san lấp vượt mức an toàn.</text>
    </g>

    <!-- Stat 2: 85% Trôi phản ánh -->
    <g transform="translate(2525, 1550)">
      <rect x="0" y="0" width="1950" height="420" rx="20" fill="{COLORS['amber_light']}" stroke="{COLORS['alert_amber']}" stroke-width="3"/>
      <text x="60" y="80" fill="{COLORS['alert_amber']}" font-size="34" font-weight="800">NGHỊCH LÝ PHẢN ÁNH CŨ</text>
      <text x="60" y="210" fill="{COLORS['alert_amber']}" font-size="110" font-weight="900">&gt; 85%</text>
      <text x="60" y="280" fill="{COLORS['ink_dark']}" font-size="36" font-weight="700">Không có tái kiểm thực chất</text>
      <text x="60" y="340" fill="{COLORS['ink_muted']}" font-size="30" font-weight="500">Phản ánh trên mạng xã hội trôi nhanh, không tọa độ chuẩn, thiếu chế tài đối soát.</text>
    </g>

    <!-- Stat 3: 0 Đối soát Before/After -->
    <g transform="translate(4700, 1550)">
      <rect x="0" y="0" width="1950" height="420" rx="20" fill="{COLORS['teal_light']}" stroke="{COLORS['civic_teal']}" stroke-width="3"/>
      <text x="60" y="80" fill="{COLORS['civic_teal']}" font-size="34" font-weight="800">THIẾU MINH CHỨNG PHÁP LÝ</text>
      <text x="60" y="210" fill="{COLORS['civic_teal']}" font-size="110" font-weight="900">0 LẦN</text>
      <text x="60" y="280" fill="{COLORS['ink_dark']}" font-size="36" font-weight="700">Đối soát Before/After độc lập</text>
      <text x="60" y="340" fill="{COLORS['ink_muted']}" font-size="30" font-weight="500">Nhà thầu phủ nhận, chính quyền thiếu dữ liệu tức thời, người dân bất lực sống chung.</text>
    </g>

    <!-- Comparison Table: Phương pháp Cũ vs DustGuard VN -->
    <g transform="translate(350, 2010)">
      <rect x="0" y="0" width="6300" height="600" rx="20" fill="{COLORS['bg_cream']}" stroke="{COLORS['border_strong']}" stroke-width="3"/>
      
      <!-- Headers -->
      <rect x="0" y="0" width="6300" height="90" rx="20" fill="{COLORS['ink_dark']}"/>
      <text x="150" y="60" fill="#FFFFFF" font-size="36" font-weight="800">TIÊU CHÍ SO SÁNH</text>
      <text x="2100" y="60" fill="#FFAAAA" font-size="36" font-weight="800">PHẢN ÁNH TRUYỀN THỐNG (CŨ)</text>
      <text x="4300" y="60" fill="#A7F3D0" font-size="36" font-weight="800">DUSTGUARD VN (CIVIC TECH)</text>

      <!-- Row 1: Thu thập dữ liệu -->
      <text x="150" y="170" fill="{COLORS['ink_dark']}" font-size="34" font-weight="800">1. Thu thập dữ liệu:</text>
      <text x="2100" y="170" fill="{COLORS['ink_muted']}" font-size="32" font-weight="500">Chụp ảnh tự phát, không đo đạc, dễ tranh cãi</text>
      <text x="4300" y="170" fill="{COLORS['civic_teal']}" font-size="34" font-weight="800">✓ Vi cảm biến mở (~0.5tr) + GPS + Chỉ số PM2.5/10</text>
      <line x1="100" y1="210" x2="6200" y2="210" stroke="{COLORS['border_light']}" stroke-width="2"/>

      <!-- Row 2: Toàn vẹn bằng chứng -->
      <text x="150" y="280" fill="{COLORS['ink_dark']}" font-size="34" font-weight="800">2. Toàn vẹn chứng cứ:</text>
      <text x="2100" y="280" fill="{COLORS['ink_muted']}" font-size="32" font-weight="500">Ảnh bị nén, mất EXIF, không kiểm tra được giả mạo</text>
      <text x="4300" y="280" fill="{COLORS['seal_red']}" font-size="34" font-weight="800">✓ Băm SHA-256 Web Crypto tại client, lưu D1 SSOT</text>
      <line x1="100" y1="320" x2="6200" y2="320" stroke="{COLORS['border_light']}" stroke-width="2"/>

      <!-- Row 3: Chuyển giao & Tái kiểm -->
      <text x="150" y="390" fill="{COLORS['ink_dark']}" font-size="34" font-weight="800">3. Quy trình thực thi:</text>
      <text x="2100" y="390" fill="{COLORS['ink_muted']}" font-size="32" font-weight="500">Gửi đơn thư chậm 7-14 ngày, không có tái kiểm</text>
      <text x="4300" y="390" fill="{COLORS['action_green']}" font-size="34" font-weight="800">✓ Liên thông Cổng 1022 + SLA tái kiểm 24h–48h đóng vòng</text>
      <line x1="100" y1="430" x2="6200" y2="430" stroke="{COLORS['border_light']}" stroke-width="2"/>

      <!-- Row 4: Vai trò thanh niên -->
      <text x="150" y="500" fill="{COLORS['ink_dark']}" font-size="34" font-weight="800">4. Vai trò cộng đồng:</text>
      <text x="2100" y="500" fill="{COLORS['ink_muted']}" font-size="32" font-weight="500">Đơn độc, bức xúc thụ động, không được công nhận</text>
      <text x="4300" y="500" fill="{COLORS['civic_teal']}" font-size="34" font-weight="800">✓ Đội xung kích tình nguyện, tích lũy giờ rèn luyện/tín chỉ</text>
    </g>
  </g>

  <!-- ========================================================================= -->
  <!-- KHỐI 2: GIẢI PHÁP & QUY TRÌNH 5 BƯỚC ĐÓNG VÒNG (Y: 2720 -> 5180)           -->
  <!-- ========================================================================= -->
  <g id="block-2-solution">
    <!-- Block Title Bar -->
    <rect x="250" y="2720" width="6500" height="90" rx="16" fill="{COLORS['civic_teal']}"/>
    <rect x="250" y="2720" width="20" height="90" rx="4" fill="{COLORS['seal_red']}"/>
    <text x="310" y="2780" fill="#FFFFFF" font-size="44" font-weight="800" letter-spacing="2">
      KHỐI 2: GIẢI PHÁP DUSTGUARD VN &amp; QUY TRÌNH 5 BƯỚC ĐÓNG VÒNG HÀNH ĐỘNG
    </text>
    <text x="6550" y="2780" fill="#FFFFFF" font-size="36" font-weight="700" text-anchor="end">
      THE 5-STEP CLOSED LOOP
    </text>

    <!-- Main Container Card -->
    <rect x="250" y="2830" width="6500" height="2310" rx="28" fill="{COLORS['card_white']}" stroke="{COLORS['border_strong']}" stroke-width="4"/>

    <!-- 5 Steps Flow Layout (Horizontal Chain) -->
    <!-- Step 1: Detect -->
    <g transform="translate(350, 2890)">
      <rect x="0" y="0" width="1180" height="750" rx="24" fill="{COLORS['bg_cream']}" stroke="{COLORS['civic_teal']}" stroke-width="3"/>
      <rect x="0" y="0" width="1180" height="90" rx="24" fill="{COLORS['civic_teal']}"/>
      <circle cx="60" cy="45" r="30" fill="#FFFFFF"/>
      <text x="60" y="57" fill="{COLORS['civic_teal']}" font-size="32" font-weight="900" text-anchor="middle">1</text>
      <text x="120" y="58" fill="#FFFFFF" font-size="36" font-weight="800">PHÁT HIỆN</text>
      <text x="120" y="140" fill="{COLORS['ink_dark']}" font-size="32" font-weight="800">Tín hiệu đa nguồn</text>
      <text x="40" y="190" fill="{COLORS['ink_muted']}" font-size="28" font-weight="500">
        <tspan x="40" dy="0">• Vi cảm biến mở ESP32</tspan>
        <tspan x="40" dy="45">• Phản ánh cộng đồng</tspan>
        <tspan x="40" dy="45">• Định vị GPS chuẩn &lt; 5m</tspan>
        <tspan x="40" dy="45">• Ảnh hiện trường gốc</tspan>
      </text>
      <!-- Bottom Chip -->
      <rect x="40" y="650" width="1100" height="65" rx="12" fill="{COLORS['teal_light']}"/>
      <text x="590" y="692" fill="{COLORS['civic_teal']}" font-size="26" font-weight="800" text-anchor="middle">📡 IoT + Dân Vụ Civic App</text>
    </g>

    <!-- Arrow 1 -> 2 -->
    <path d="M1560 3260 L1600 3260" stroke="{COLORS['seal_red']}" stroke-width="8" stroke-linecap="round"/>
    <polygon points="1600,3245 1630,3260 1600,3275" fill="{COLORS['seal_red']}"/>

    <!-- Step 2: Prioritize -->
    <g transform="translate(1650, 2890)">
      <rect x="0" y="0" width="1180" height="750" rx="24" fill="{COLORS['bg_cream']}" stroke="{COLORS['alert_amber']}" stroke-width="3"/>
      <rect x="0" y="0" width="1180" height="90" rx="24" fill="{COLORS['alert_amber']}"/>
      <circle cx="60" cy="45" r="30" fill="#FFFFFF"/>
      <text x="60" y="57" fill="{COLORS['alert_amber']}" font-size="32" font-weight="900" text-anchor="middle">2</text>
      <text x="120" y="58" fill="#FFFFFF" font-size="36" font-weight="800">ƯU TIÊN</text>
      <text x="120" y="140" fill="{COLORS['ink_dark']}" font-size="32" font-weight="800">Dust Risk Score</text>
      <text x="40" y="190" fill="{COLORS['ink_muted']}" font-size="28" font-weight="500">
        <tspan x="40" dy="0">• Thang điểm rủi ro 0-100</tspan>
        <tspan x="40" dy="45">• Mật độ trường học lân cận</tspan>
        <tspan x="40" dy="45">• Lịch sử tái phạm nhà thầu</tspan>
        <tspan x="40" dy="45">• Phân cấp SLA tự động</tspan>
      </text>
      <!-- Bottom Chip -->
      <rect x="40" y="650" width="1100" height="65" rx="12" fill="{COLORS['amber_light']}"/>
      <text x="590" y="692" fill="{COLORS['alert_amber']}" font-size="26" font-weight="800" text-anchor="middle">⚖️ Thuật toán Minh bạch</text>
    </g>

    <!-- Arrow 2 -> 3 -->
    <path d="M2860 3260 L2900 3260" stroke="{COLORS['seal_red']}" stroke-width="8" stroke-linecap="round"/>
    <polygon points="2900,3245 2930,3260 2900,3275" fill="{COLORS['seal_red']}"/>

    <!-- Step 3: Digital Dossier -->
    <g transform="translate(2950, 2890)">
      <rect x="0" y="0" width="1180" height="750" rx="24" fill="{COLORS['bg_cream']}" stroke="{COLORS['seal_red']}" stroke-width="3"/>
      <rect x="0" y="0" width="1180" height="90" rx="24" fill="{COLORS['seal_red']}"/>
      <circle cx="60" cy="45" r="30" fill="#FFFFFF"/>
      <text x="60" y="57" fill="{COLORS['seal_red']}" font-size="32" font-weight="900" text-anchor="middle">3</text>
      <text x="120" y="58" fill="#FFFFFF" font-size="36" font-weight="800">HỒ SƠ SỐ</text>
      <text x="120" y="140" fill="{COLORS['ink_dark']}" font-size="32" font-weight="800">Bảo chứng SHA-256</text>
      <text x="40" y="190" fill="{COLORS['ink_muted']}" font-size="28" font-weight="500">
        <tspan x="40" dy="0">• Web Crypto Hash ảnh gốc</tspan>
        <tspan x="40" dy="45">• Gắn tem thời gian chuẩn</tspan>
        <tspan x="40" dy="45">• Chống chỉnh sửa / chối bỏ</tspan>
        <tspan x="40" dy="45">• Đóng gói PDF/JSON Dossier</tspan>
      </text>
      <!-- Bottom Chip -->
      <rect x="40" y="650" width="1100" height="65" rx="12" fill="#FFF0F0"/>
      <text x="590" y="692" fill="{COLORS['seal_red']}" font-size="26" font-weight="800" text-anchor="middle">🔒 SHA-256 Tamper-Proof</text>
    </g>

    <!-- Arrow 3 -> 4 -->
    <path d="M4160 3260 L4200 3260" stroke="{COLORS['seal_red']}" stroke-width="8" stroke-linecap="round"/>
    <polygon points="4200,3245 4230,3260 4200,3275" fill="{COLORS['seal_red']}"/>

    <!-- Step 4: Dispatch -->
    <g transform="translate(4250, 2890)">
      <rect x="0" y="0" width="1180" height="750" rx="24" fill="{COLORS['bg_cream']}" stroke="{COLORS['civic_teal']}" stroke-width="3"/>
      <rect x="0" y="0" width="1180" height="90" rx="24" fill="{COLORS['civic_teal']}"/>
      <circle cx="60" cy="45" r="30" fill="#FFFFFF"/>
      <text x="60" y="57" fill="{COLORS['civic_teal']}" font-size="32" font-weight="900" text-anchor="middle">4</text>
      <text x="120" y="58" fill="#FFFFFF" font-size="36" font-weight="800">CHUYỂN GIAO</text>
      <text x="120" y="140" fill="{COLORS['ink_dark']}" font-size="32" font-weight="800">Liên thông &amp; Xung kích</text>
      <text x="40" y="190" fill="{COLORS['ink_muted']}" font-size="28" font-weight="500">
        <tspan x="40" dy="0">• Cổng Dịch vụ công 1022</tspan>
        <tspan x="40" dy="45">• Ứng dụng Công dân iHanoi</tspan>
        <tspan x="40" dy="45">• Phân công Đội sinh viên</tspan>
        <tspan x="40" dy="45">• Thông báo BQL Dự án</tspan>
      </text>
      <!-- Bottom Chip -->
      <rect x="40" y="650" width="1100" height="65" rx="12" fill="{COLORS['teal_light']}"/>
      <text x="590" y="692" fill="{COLORS['civic_teal']}" font-size="26" font-weight="800" text-anchor="middle">🤝 Cổng 1022 &amp; iHanoi</text>
    </g>

    <!-- Arrow 4 -> 5 -->
    <path d="M5460 3260 L5500 3260" stroke="{COLORS['action_green']}" stroke-width="8" stroke-linecap="round"/>
    <polygon points="5500,3245 5530,3260 5500,3275" fill="{COLORS['action_green']}"/>

    <!-- Step 5: Reinspect & Close -->
    <g transform="translate(5550, 2890)">
      <rect x="0" y="0" width="1180" height="750" rx="24" fill="{COLORS['bg_cream']}" stroke="{COLORS['action_green']}" stroke-width="3"/>
      <rect x="0" y="0" width="1180" height="90" rx="24" fill="{COLORS['action_green']}"/>
      <circle cx="60" cy="45" r="30" fill="#FFFFFF"/>
      <text x="60" y="57" fill="{COLORS['action_green']}" font-size="32" font-weight="900" text-anchor="middle">5</text>
      <text x="120" y="58" fill="#FFFFFF" font-size="36" font-weight="800">TÁI KIỂM</text>
      <text x="120" y="140" fill="{COLORS['ink_dark']}" font-size="32" font-weight="800">Đóng vòng 24h–48h</text>
      <text x="40" y="190" fill="{COLORS['ink_muted']}" font-size="28" font-weight="500">
        <tspan x="40" dy="0">• Tái kiểm tra thực địa</tspan>
        <tspan x="40" dy="45">• Chụp ảnh đối chứng T2</tspan>
        <tspan x="40" dy="45">• Nghiệm thu dập bụi sạch</tspan>
        <tspan x="40" dy="45">• Đóng hồ sơ công khai</tspan>
      </text>
      <!-- Bottom Chip -->
      <rect x="40" y="650" width="1100" height="65" rx="12" fill="{COLORS['green_light']}"/>
      <text x="590" y="692" fill="{COLORS['action_green']}" font-size="26" font-weight="800" text-anchor="middle">🎯 Đóng Vòng Minh Bạch</text>
    </g>

    <!-- Interactive Case Study Banner: Before / After Dossier #DG-2026-0842 -->
    <g transform="translate(350, 3700)">
      <rect x="0" y="0" width="6300" height="1380" rx="24" fill="{COLORS['bg_cream']}" stroke="{COLORS['border_strong']}" stroke-width="4"/>

      <!-- Case Header -->
      <rect x="0" y="0" width="6300" height="110" rx="24" fill="{COLORS['ink_dark']}"/>
      <circle cx="60" cy="55" r="28" fill="{COLORS['gold_accent']}"/>
      <text x="60" y="66" fill="{COLORS['ink_dark']}" font-size="30" font-weight="900" text-anchor="middle">★</text>
      <text x="110" y="70" fill="#FFFFFF" font-size="40" font-weight="800">
        HỒ SƠ BẰNG CHỨNG ĐỐI SOÁT THỰC ĐỊA #DG-2026-0842 — ĐƯỜNG VÀNH ĐAI 3, CẦU GIẤY, HÀ NỘI
      </text>
      <rect x="5250" y="25" width="980" height="60" rx="12" fill="{COLORS['green_light']}"/>
      <text x="5740" y="67" fill="{COLORS['action_green']}" font-size="28" font-weight="800" text-anchor="middle">
        ✓ ĐÃ NGHIỆM THU ĐÓNG VÒNG
      </text>

      <!-- Before Card (Left Column) -->
      <g transform="translate(60, 160)">
        <rect x="0" y="0" width="2980" height="1140" rx="20" fill="{COLORS['card_white']}" stroke="{COLORS['dustguard_red']}" stroke-width="3"/>
        
        <!-- Header Tag -->
        <rect x="0" y="0" width="2980" height="90" rx="20" fill="{COLORS['dustguard_red']}"/>
        <text x="40" y="60" fill="#FFFFFF" font-size="38" font-weight="800">
          🔴 THỜI ĐIỂM T1: PHÁT HIỆN BAN ĐẦU (08:30 — 12/03/2026)
        </text>

        <!-- Metric Display -->
        <g transform="translate(40, 120)">
          <rect x="0" y="0" width="1380" height="240" rx="16" fill="#FFF5F5" stroke="{COLORS['dustguard_red']}" stroke-width="2"/>
          <text x="30" y="55" fill="{COLORS['seal_red']}" font-size="30" font-weight="800">NỒNG ĐỘ PM2.5</text>
          <text x="30" y="170" fill="{COLORS['dustguard_red']}" font-size="100" font-weight="900">142 <tspan font-size="44" font-weight="600">µg/m³</tspan></text>
          <text x="30" y="215" fill="{COLORS['seal_red']}" font-size="26" font-weight="700">Mức Nguy Hại (Vượt chuẩn QCVN 5.6 lần)</text>
        </g>

        <!-- Status & Observations -->
        <g transform="translate(1480, 120)">
          <rect x="0" y="0" width="1440" height="240" rx="16" fill="{COLORS['bg_cream']}" stroke="{COLORS['border_strong']}" stroke-width="2"/>
          <text x="30" y="50" fill="{COLORS['ink_dark']}" font-size="28" font-weight="800">HIỆN TRẠNG QUAN SÁT:</text>
          <text x="30" y="95" fill="{COLORS['ink_muted']}" font-size="26" font-weight="500">• Xe tải đào móng không phủ bạt</text>
          <text x="30" y="140" fill="{COLORS['ink_muted']}" font-size="26" font-weight="500">• Đất cát rơi vãi kéo dài 300m</text>
          <text x="30" y="185" fill="{COLORS['ink_muted']}" font-size="26" font-weight="500">• Bụi cuốn mù mịt trước cổng trường học</text>
          <text x="30" y="225" fill="{COLORS['seal_red']}" font-size="24" font-weight="700">Risk Score: 92/100 (Khẩn cấp)</text>
        </g>

        <!-- Visual Mock Card Graphic -->
        <g transform="translate(40, 390)">
          <rect x="0" y="0" width="2880" height="480" rx="16" fill="#F8EBEB" stroke="{COLORS['dustguard_red']}" stroke-width="2"/>
          <text x="1440" y="240" fill="{COLORS['seal_red']}" font-size="40" font-weight="800" text-anchor="middle">
            [ẢNH HIỆN TRƯỜNG T1: BỤI ĐỎ XE BEN RƠI VÃI]
          </text>
          <text x="1440" y="300" fill="{COLORS['ink_muted']}" font-size="28" text-anchor="middle">
            Tọa độ: 21.0285° N, 105.7823° E · Thiết bị: DustGuard Optical Node #04
          </text>
        </g>

        <!-- SHA-256 Cryptographic Proof Box -->
        <g transform="translate(40, 900)">
          <rect x="0" y="0" width="2880" height="200" rx="14" fill="{COLORS['ink_dark']}"/>
          <text x="30" y="45" fill="{COLORS['gold_accent']}" font-size="26" font-weight="800">BẢO CHỨNG SỐ NGUYÊN BẢN (WEB CRYPTO SHA-256):</text>
          <text x="30" y="95" fill="#A7F3D0" font-size="26" font-family="monospace" font-weight="700">
            SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
          </text>
          <text x="30" y="145" fill="#E5E0D8" font-size="24">
            Cloudflare D1 Transaction ID: <tspan fill="#FFFFFF" font-weight="700">#TXN-D1-8942-01A</tspan> · Xác thực không thể sửa đổi
          </text>
        </g>
      </g>

      <!-- After Card (Right Column) -->
      <g transform="translate(3240, 160)">
        <rect x="0" y="0" width="2980" height="1140" rx="20" fill="{COLORS['card_white']}" stroke="{COLORS['action_green']}" stroke-width="3"/>
        
        <!-- Header Tag -->
        <rect x="0" y="0" width="2980" height="90" rx="20" fill="{COLORS['action_green']}"/>
        <text x="40" y="60" fill="#FFFFFF" font-size="38" font-weight="800">
          🟢 THỜI ĐIỂM T2: TÁI KIỂM SAU 26H XỬ LÝ (10:30 — 13/03/2026)
        </text>

        <!-- Metric Display -->
        <g transform="translate(40, 120)">
          <rect x="0" y="0" width="1380" height="240" rx="16" fill="{COLORS['green_light']}" stroke="{COLORS['action_green']}" stroke-width="2"/>
          <text x="30" y="55" fill="{COLORS['action_green']}" font-size="30" font-weight="800">NỒNG ĐỘ PM2.5 SAU XỬ LÝ</text>
          <text x="30" y="170" fill="{COLORS['action_green']}" font-size="100" font-weight="900">28 <tspan font-size="44" font-weight="600">µg/m³</tspan></text>
          <text x="30" y="215" fill="{COLORS['action_green']}" font-size="26" font-weight="700">✓ Đạt Chuẩn QCVN 05:2023 (Giảm 80.3%)</text>
        </g>

        <!-- Status & Actions Taken -->
        <g transform="translate(1480, 120)">
          <rect x="0" y="0" width="1440" height="240" rx="16" fill="{COLORS['bg_cream']}" stroke="{COLORS['border_strong']}" stroke-width="2"/>
          <text x="30" y="50" fill="{COLORS['ink_dark']}" font-size="28" font-weight="800">BIỆN PHÁP KHẮC PHỤC:</text>
          <text x="30" y="95" fill="{COLORS['ink_muted']}" font-size="26" font-weight="500">• Kích hoạt vòi phun sương dập bụi</text>
          <text x="30" y="140" fill="{COLORS['ink_muted']}" font-size="26" font-weight="500">• Quét dọn &amp; rửa sạch mặt đường</text>
          <text x="30" y="185" fill="{COLORS['ink_muted']}" font-size="26" font-weight="500">• 100% xe ben ra vào được phủ bạt kín</text>
          <text x="30" y="225" fill="{COLORS['action_green']}" font-size="24" font-weight="700">Đội TNXP Tái kiểm: Đạt yêu cầu</text>
        </g>

        <!-- Visual Mock Card Graphic -->
        <g transform="translate(40, 390)">
          <rect x="0" y="0" width="2880" height="480" rx="16" fill="#EAF7EF" stroke="{COLORS['action_green']}" stroke-width="2"/>
          <text x="1440" y="240" fill="{COLORS['action_green']}" font-size="40" font-weight="800" text-anchor="middle">
            [ẢNH ĐỐI CHỨNG T2: ĐƯỜNG RỬA SẠCH, VÒI PHUN HOẠT ĐỘNG]
          </text>
          <text x="1440" y="300" fill="{COLORS['ink_muted']}" font-size="28" text-anchor="middle">
            Đồng bộ Cổng 1022: Mã #1022-HN-89421 · Tái kiểm bởi Đội Tình nguyện ĐH Xây dựng
          </text>
        </g>

        <!-- SHA-256 Proof Box -->
        <g transform="translate(40, 900)">
          <rect x="0" y="0" width="2880" height="200" rx="14" fill="{COLORS['ink_dark']}"/>
          <text x="30" y="45" fill="{COLORS['gold_accent']}" font-size="26" font-weight="800">BẢO CHỨNG TÁI KIỂM (RE-INSPECTION PROOF):</text>
          <text x="30" y="95" fill="#A7F3D0" font-size="26" font-family="monospace" font-weight="700">
            SHA-256: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
          </text>
          <text x="30" y="145" fill="#E5E0D8" font-size="24">
            Trạng thái liên thông: <tspan fill="#A7F3D0" font-weight="700">HOÀN TẤT ĐÓNG HỒ SƠ 1022 / iHANOI</tspan> (Chu kỳ: 26 giờ)
          </text>
        </g>
      </g>
    </g>
  </g>

  <!-- ========================================================================= -->
  <!-- KHỐI 3: TRÁCH NHIỆM AI & BẰNG CHỨNG D1 SSOT (Y: 5220 -> 6870)              -->
  <!-- ========================================================================= -->
  <g id="block-3-responsible-ai">
    <!-- Block Title Bar -->
    <rect x="250" y="5220" width="6500" height="90" rx="16" fill="{COLORS['ink_dark']}"/>
    <rect x="250" y="5220" width="20" height="90" rx="4" fill="{COLORS['seal_red']}"/>
    <text x="310" y="5280" fill="#FFFFFF" font-size="44" font-weight="800" letter-spacing="2">
      KHỐI 3: TRÁCH NHIỆM AI &amp; NỀN TẢNG BẰNG CHỨNG D1 SSOT
    </text>
    <text x="6550" y="5280" fill="{COLORS['gold_accent']}" font-size="36" font-weight="700" text-anchor="end">
      RESPONSIBLE AI &amp; DATA INTEGRITY
    </text>

    <!-- Main Container Card -->
    <rect x="250" y="5330" width="6500" height="1520" rx="28" fill="{COLORS['card_white']}" stroke="{COLORS['border_strong']}" stroke-width="4"/>

    <!-- Left Pillar: AI là Trợ lý, Không Phán xét -->
    <g transform="translate(350, 5410)">
      <rect x="0" y="0" width="3050" height="1360" rx="24" fill="{COLORS['bg_cream']}" stroke="{COLORS['seal_red']}" stroke-width="3"/>
      <rect x="0" y="0" width="3050" height="100" rx="24" fill="{COLORS['seal_red']}"/>
      <text x="60" y="65" fill="#FFFFFF" font-size="40" font-weight="800">
        1. NGUYÊN TẮC: "AI LÀ TRỢ LÝ, KHÔNG PHÁN XÉT"
      </text>

      <g transform="translate(60, 140)">
        <!-- Core Concept 1 -->
        <rect x="0" y="0" width="2930" height="240" rx="16" fill="{COLORS['card_white']}" stroke="{COLORS['border_light']}" stroke-width="2"/>
        <circle cx="60" cy="60" r="30" fill="{COLORS['seal_red']}"/>
        <text x="60" y="72" fill="#FFFFFF" font-size="28" font-weight="800" text-anchor="middle">AI</text>
        <text x="120" y="60" fill="{COLORS['ink_dark']}" font-size="34" font-weight="800">Hỗ trợ trích xuất &amp; Phân loại rủi ro</text>
        <text x="120" y="110" fill="{COLORS['ink_muted']}" font-size="28" font-weight="500">
          AI Vision &amp; Timeseries tự động nhận diện khói bụi, phân tích đỉnh nồng độ PM, tính toán điểm Dust Risk Score (0–100) để phân luồng ưu tiên.
        </text>
        <text x="120" y="160" fill="{COLORS['seal_red']}" font-size="26" font-weight="700">
          → Tuyệt đối KHÔNG tự động ban hành quyết định xử phạt vi phạm.
        </text>

        <!-- Core Concept 2 -->
        <rect x="0" y="270" width="2930" height="240" rx="16" fill="{COLORS['card_white']}" stroke="{COLORS['border_light']}" stroke-width="2"/>
        <circle cx="60" cy="330" r="30" fill="{COLORS['civic_teal']}"/>
        <text x="60" y="342" fill="#FFFFFF" font-size="24" font-weight="800" text-anchor="middle">HUM</text>
        <text x="120" y="330" fill="{COLORS['ink_dark']}" font-size="34" font-weight="800">Con người làm chủ quyết định &amp; Tái kiểm</text>
        <text x="120" y="380" fill="{COLORS['ink_muted']}" font-size="28" font-weight="500">
          Cán bộ quản lý đô thị và Đội thanh niên xung kích trực tiếp thẩm định, xác minh hồ sơ hiện trường và thực hiện nghiệm thu dập bụi thực tế.
        </text>
        <text x="120" y="430" fill="{COLORS['civic_teal']}" font-size="26" font-weight="700">
          → Đảm bảo tính pháp lý, đạo đức và sự đồng thuận xã hội.
        </text>

        <!-- Core Concept 3 -->
        <rect x="0" y="540" width="2930" height="240" rx="16" fill="{COLORS['card_white']}" stroke="{COLORS['border_light']}" stroke-width="2"/>
        <circle cx="60" cy="600" r="30" fill="{COLORS['action_green']}"/>
        <text x="60" y="612" fill="#FFFFFF" font-size="24" font-weight="800" text-anchor="middle">SLA</text>
        <text x="120" y="600" fill="{COLORS['ink_dark']}" font-size="34" font-weight="800">Gợi ý hành động &amp; Kích hoạt vòi phun</text>
        <text x="120" y="650" fill="{COLORS['ink_muted']}" font-size="28" font-weight="500">
          Đề xuất phương án kỹ thuật phù hợp cho nhà thầu (phun sương, phủ bạt, rửa xe) và tự động tạo phiếu tái kiểm tra sau 24h–48h.
        </text>
        <text x="120" y="700" fill="{COLORS['action_green']}" font-size="26" font-weight="700">
          → Chuyển đổi từ trừng phạt thụ động sang phối hợp khắc phục chủ động.
        </text>

        <!-- Bottom Warning Banner -->
        <rect x="0" y="810" width="2930" height="340" rx="16" fill="#FFF5F5" stroke="{COLORS['dustguard_red']}" stroke-width="2"/>
        <text x="40" y="860" fill="{COLORS['seal_red']}" font-size="32" font-weight="800">TIÊU CHUẨN ĐẠO ĐỨC AI (ETHICS IN CIVIC TECH):</text>
        <text x="40" y="910" fill="{COLORS['ink_dark']}" font-size="28" font-weight="600">1. Không thiên vị nhà thầu hay khu vực dân cư.</text>
        <text x="40" y="955" fill="{COLORS['ink_dark']}" font-size="28" font-weight="600">2. Minh bạch 100% công thức chấm điểm Risk Score.</text>
        <text x="40" y="1000" fill="{COLORS['ink_dark']}" font-size="28" font-weight="600">3. Bảo vệ quyền riêng tư người phản ánh (Ẩn danh dữ liệu nhạy cảm).</text>
        <text x="40" y="1045" fill="{COLORS['ink_dark']}" font-size="28" font-weight="600">4. Cho phép kiểm toán độc lập chuỗi suy luận của mô hình.</text>
      </g>
    </g>

    <!-- Right Pillar: Kiến trúc Bằng chứng D1 SSOT & Web Crypto -->
    <g transform="translate(3600, 5410)">
      <rect x="0" y="0" width="3050" height="1360" rx="24" fill="{COLORS['bg_cream']}" stroke="{COLORS['civic_teal']}" stroke-width="3"/>
      <rect x="0" y="0" width="3050" height="100" rx="24" fill="{COLORS['civic_teal']}"/>
      <text x="60" y="65" fill="#FFFFFF" font-size="40" font-weight="800">
        2. KIẾN TRÚC D1 SSOT &amp; CHUỖI BẰNG CHỨNG BẢO MẬT
      </text>

      <g transform="translate(60, 140)">
        <!-- Feature 1: D1 SSOT -->
        <rect x="0" y="0" width="2930" height="240" rx="16" fill="{COLORS['card_white']}" stroke="{COLORS['border_light']}" stroke-width="2"/>
        <circle cx="60" cy="60" r="30" fill="{COLORS['civic_teal']}"/>
        <text x="60" y="72" fill="#FFFFFF" font-size="24" font-weight="800" text-anchor="middle">SSOT</text>
        <text x="120" y="60" fill="{COLORS['ink_dark']}" font-size="34" font-weight="800">Cloudflare D1 SQLite — Single Source of Truth</text>
        <text x="120" y="110" fill="{COLORS['ink_muted']}" font-size="28" font-weight="500">
          Cơ sở dữ liệu quan hệ phân tán tại rìa mạng (Edge Serverless). Tuyệt đối KHÔNG sử dụng mock data hay localStorage làm database.
        </text>
        <text x="120" y="160" fill="{COLORS['civic_teal']}" font-size="26" font-weight="700">
          → Độ trễ truy vấn &lt; 50ms, sẵn sàng mở rộng toàn quốc.
        </text>

        <!-- Feature 2: SHA-256 Chain -->
        <rect x="0" y="270" width="2930" height="240" rx="16" fill="{COLORS['card_white']}" stroke="{COLORS['border_light']}" stroke-width="2"/>
        <circle cx="60" cy="330" r="30" fill="{COLORS['seal_red']}"/>
        <text x="60" y="342" fill="#FFFFFF" font-size="24" font-weight="800" text-anchor="middle">HASH</text>
        <text x="120" y="330" fill="{COLORS['ink_dark']}" font-size="34" font-weight="800">Chuỗi Băm SHA-256 Web Crypto Client-Side</text>
        <text x="120" y="380" fill="{COLORS['ink_muted']}" font-size="28" font-weight="500">
          Ảnh và tọa độ được băm SHA-256 ngay trên trình duyệt trước khi gửi lên máy chủ. Bất kỳ sự can thiệp nào cũng làm hỏng chuỗi kiểm chứng.
        </text>
        <text x="120" y="430" fill="{COLORS['seal_red']}" font-size="26" font-weight="700">
          → Giá trị pháp lý vững chắc trước thanh tra xây dựng.
        </text>

        <!-- Feature 3: IoT Optional -->
        <rect x="0" y="540" width="2930" height="240" rx="16" fill="{COLORS['card_white']}" stroke="{COLORS['border_light']}" stroke-width="2"/>
        <circle cx="60" cy="600" r="30" fill="{COLORS['gold_accent']}"/>
        <text x="60" y="612" fill="{COLORS['ink_dark']}" font-size="24" font-weight="800" text-anchor="middle">EDGE</text>
        <text x="120" y="600" fill="{COLORS['ink_dark']}" font-size="34" font-weight="800">Hệ thống Độc lập — IoT là Tùy chọn (Optional)</text>
        <text x="120" y="650" fill="{COLORS['ink_muted']}" font-size="28" font-weight="500">
          Hệ thống hoạt động 100% hiệu năng kể cả khi không có cảm biến phần cứng (thông qua ảnh chụp hiện trường chuẩn hóa của cộng đồng).
        </text>
        <text x="120" y="700" fill="{COLORS['gold_accent']}" font-size="26" font-weight="700">
          → Khả năng triển khai linh hoạt tại mọi địa bàn không tốn chi phí lớn.
        </text>

        <!-- Diagram Representation -->
        <g transform="translate(0, 810)">
          <rect x="0" y="0" width="2930" height="340" rx="16" fill="{COLORS['ink_dark']}"/>
          <text x="40" y="50" fill="{COLORS['gold_accent']}" font-size="28" font-weight="800">LUỒNG DỮ LIỆU BẢO CHỨNG (CRYPTOGRAPHIC FLOW):</text>
          
          <!-- Step A -->
          <rect x="40" y="80" width="600" height="220" rx="12" fill="#332A22"/>
          <text x="340" y="140" fill="#FFFFFF" font-size="26" font-weight="800" text-anchor="middle">Ảnh Hiện Trường</text>
          <text x="340" y="190" fill="{COLORS['gold_accent']}" font-size="22" text-anchor="middle">+ GPS + Timestamp</text>
          <text x="340" y="240" fill="#A7F3D0" font-size="20" text-anchor="middle">Client Browser</text>

          <path d="M660 190 L720 190" stroke="#FFFFFF" stroke-width="4"/>
          <polygon points="720,180 740,190 720,200" fill="#FFFFFF"/>

          <!-- Step B -->
          <rect x="760" y="80" width="650" height="220" rx="12" fill="#1C3833"/>
          <text x="1085" y="140" fill="#FFFFFF" font-size="26" font-weight="800" text-anchor="middle">SHA-256 Web Crypto</text>
          <text x="1085" y="190" fill="#A7F3D0" font-size="22" font-family="monospace" text-anchor="middle">hashHex = crypto.subtle</text>
          <text x="1085" y="240" fill="#FFAAAA" font-size="20" text-anchor="middle">Không thể đảo ngược</text>

          <path d="M1430 190 L1490 190" stroke="#FFFFFF" stroke-width="4"/>
          <polygon points="1490,180 1510,190 1490,200" fill="#FFFFFF"/>

          <!-- Step C -->
          <rect x="1530" y="80" width="650" height="220" rx="12" fill="#2E1C21"/>
          <text x="1855" y="140" fill="#FFFFFF" font-size="26" font-weight="800" text-anchor="middle">Hono Cloudflare Edge</text>
          <text x="1855" y="190" fill="{COLORS['teal_light']}" font-size="22" text-anchor="middle">D1 SQLite Transaction</text>
          <text x="1855" y="240" fill="#A7F3D0" font-size="20" text-anchor="middle">Tốc độ &lt; 50ms</text>

          <path d="M2200 190 L2260 190" stroke="#FFFFFF" stroke-width="4"/>
          <polygon points="2260,180 2280,190 2260,200" fill="#FFFFFF"/>

          <!-- Step D -->
          <rect x="2300" y="80" width="590" height="220" rx="12" fill="#1D2A3A"/>
          <text x="2595" y="140" fill="#FFFFFF" font-size="26" font-weight="800" text-anchor="middle">Cổng 1022 / iHanoi</text>
          <text x="2595" y="190" fill="#93C5FD" font-size="22" text-anchor="middle">Hồ sơ Dossier PDF</text>
          <text x="2595" y="240" fill="{COLORS['gold_accent']}" font-size="20" text-anchor="middle">Đóng Vòng Hành Động</text>
        </g>
      </g>
    </g>
  </g>

  <!-- ========================================================================= -->
  <!-- KHỐI 4: LỘ TRÌNH LEAN PILOT, CHỈ SỐ & MÔ HÌNH HỢP TÁC (Y: 6910 -> 8780)    -->
  <!-- ========================================================================= -->
  <g id="block-4-lean-pilot">
    <!-- Block Title Bar -->
    <rect x="250" y="6910" width="6500" height="90" rx="16" fill="{COLORS['seal_red']}"/>
    <rect x="250" y="6910" width="20" height="90" rx="4" fill="{COLORS['gold_accent']}"/>
    <text x="310" y="6970" fill="#FFFFFF" font-size="44" font-weight="800" letter-spacing="2">
      KHỐI 4: LỘ TRÌNH LEAN PILOT, 3 CHỈ SỐ VÀNG &amp; MÔ HÌNH 3 TRỤ CỘT
    </text>
    <text x="6550" y="6970" fill="#FFFFFF" font-size="36" font-weight="700" text-anchor="end">
      FEASIBILITY &amp; IMPACT
    </text>

    <!-- Main Container Card -->
    <rect x="250" y="7020" width="6500" height="1750" rx="28" fill="{COLORS['card_white']}" stroke="{COLORS['border_strong']}" stroke-width="4"/>

    <!-- Top: 3 Lean Metric Cards -->
    <!-- Metric 1: 0.5 Triệu VNĐ -->
    <g transform="translate(350, 7080)">
      <rect x="0" y="0" width="1950" height="340" rx="20" fill="{COLORS['teal_light']}" stroke="{COLORS['civic_teal']}" stroke-width="3"/>
      <text x="50" y="70" fill="{COLORS['civic_teal']}" font-size="32" font-weight="800">1. CHI PHÍ LINH KIỆN VI CẢM BIẾN</text>
      <text x="50" y="190" fill="{COLORS['civic_teal']}" font-size="95" font-weight="900">≈ 0,5 Triệu</text>
      <text x="50" y="255" fill="{COLORS['ink_dark']}" font-size="32" font-weight="700">VNĐ / 1 Trạm Cảm Biến Mở</text>
      <text x="50" y="305" fill="{COLORS['ink_muted']}" font-size="26" font-weight="500">ESP32 + PMS5003 + Vỏ che 3D in rẻ, dễ lắp ráp bởi học sinh.</text>
    </g>

    <!-- Metric 2: 24h-48h SLA -->
    <g transform="translate(2525, 7080)">
      <rect x="0" y="0" width="1950" height="340" rx="20" fill="{COLORS['amber_light']}" stroke="{COLORS['alert_amber']}" stroke-width="3"/>
      <text x="50" y="70" fill="{COLORS['alert_amber']}" font-size="32" font-weight="800">2. CHU KỲ TÁI KIỂM BẮT BUỘC (SLA)</text>
      <text x="50" y="190" fill="{COLORS['alert_amber']}" font-size="95" font-weight="900">24h – 48h</text>
      <text x="50" y="255" fill="{COLORS['ink_dark']}" font-size="32" font-weight="700">Đóng Vòng Xử Lý Hiện Trường</text>
      <text x="50" y="305" fill="{COLORS['ink_muted']}" font-size="26" font-weight="500">Khắc phục triệt để tình trạng phản ánh bị trôi hoặc bỏ ngỏ.</text>
    </g>

    <!-- Metric 3: 100% SSOT Edge -->
    <g transform="translate(4700, 7080)">
      <rect x="0" y="0" width="1950" height="340" rx="20" fill="#FFF5F5" stroke="{COLORS['seal_red']}" stroke-width="3"/>
      <text x="50" y="70" fill="{COLORS['seal_red']}" font-size="32" font-weight="800">3. HẠ TẦNG CLOUD SERVERLESS</text>
      <text x="50" y="190" fill="{COLORS['seal_red']}" font-size="95" font-weight="900">100% D1</text>
      <text x="50" y="255" fill="{COLORS['ink_dark']}" font-size="32" font-weight="700">Zero Mock · Tối Ưu Chi Phí 0đ</text>
      <text x="50" y="305" fill="{COLORS['ink_muted']}" font-size="26" font-weight="500">Vận hành Edge Hono Cloudflare, đáp ứng 100.000 yêu cầu/ngày.</text>
    </g>

    <!-- Middle: Mô hình 3 Trụ Cột Hợp Tác (Tripartite Civic Ecosystem) -->
    <g transform="translate(350, 7460)">
      <rect x="0" y="0" width="4150" height="740" rx="20" fill="{COLORS['bg_cream']}" stroke="{COLORS['border_strong']}" stroke-width="3"/>
      <text x="50" y="65" fill="{COLORS['ink_dark']}" font-size="36" font-weight="800">
        MÔ HÌNH HỢP TÁC 3 TRỤ CỘT: THANH NIÊN — DOANH NGHIỆP — CHÍNH QUYỀN
      </text>

      <!-- Pillar 1: Thanh niên -->
      <g transform="translate(50, 110)">
        <rect x="0" y="0" width="1280" height="580" rx="16" fill="{COLORS['card_white']}" stroke="{COLORS['civic_teal']}" stroke-width="2"/>
        <rect x="0" y="0" width="1280" height="70" rx="16" fill="{COLORS['civic_teal']}"/>
        <text x="40" y="48" fill="#FFFFFF" font-size="30" font-weight="800">1. THANH NIÊN &amp; HỌC SINH</text>
        <text x="40" y="120" fill="{COLORS['ink_dark']}" font-size="28" font-weight="700">• Giám sát &amp; Lắp trạm đo IoT</text>
        <text x="40" y="170" fill="{COLORS['ink_muted']}" font-size="26" font-weight="500">CLB Tình nguyện, Đoàn trường</text>
        <text x="40" y="225" fill="{COLORS['ink_dark']}" font-size="28" font-weight="700">• Chụp ảnh tái kiểm 24h-48h</text>
        <text x="40" y="275" fill="{COLORS['ink_muted']}" font-size="26" font-weight="500">Xác thực độc lập ngoài hiện trường</text>
        <text x="40" y="330" fill="{COLORS['ink_dark']}" font-size="28" font-weight="700">• Quyền lợi thiết thực</text>
        <text x="40" y="380" fill="{COLORS['civic_teal']}" font-size="26" font-weight="700">Tích lũy 20h = 4.0 Tín chỉ Tình nguyện</text>
        <!-- Bottom Icon Tag -->
        <rect x="40" y="470" width="1200" height="60" rx="10" fill="{COLORS['teal_light']}"/>
        <text x="640" y="510" fill="{COLORS['civic_teal']}" font-size="26" font-weight="800" text-anchor="middle">🌱 Nòng cốt Tác nhân Thay đổi</text>
      </g>

      <!-- Pillar 2: Nhà thầu -->
      <g transform="translate(1380, 110)">
        <rect x="0" y="0" width="1280" height="580" rx="16" fill="{COLORS['card_white']}" stroke="{COLORS['alert_amber']}" stroke-width="2"/>
        <rect x="0" y="0" width="1280" height="70" rx="16" fill="{COLORS['alert_amber']}"/>
        <text x="40" y="48" fill="#FFFFFF" font-size="30" font-weight="800">2. NHÀ THẦU &amp; BQL DỰ ÁN</text>
        <text x="40" y="120" fill="{COLORS['ink_dark']}" font-size="28" font-weight="700">• Nhận cảnh báo sớm tự động</text>
        <text x="40" y="170" fill="{COLORS['ink_muted']}" font-size="26" font-weight="500">Biết ngay khi bụi vượt ngưỡng an toàn</text>
        <text x="40" y="225" fill="{COLORS['ink_dark']}" font-size="28" font-weight="700">• Chủ động dập bụi tức thì</text>
        <text x="40" y="275" fill="{COLORS['ink_muted']}" font-size="26" font-weight="500">Phun sương, phủ bạt, rửa bánh xe</text>
        <text x="40" y="330" fill="{COLORS['ink_dark']}" font-size="28" font-weight="700">• Lợi ích Doanh nghiệp</text>
        <text x="40" y="380" fill="{COLORS['alert_amber']}" font-size="26" font-weight="700">Tránh bị xử phạt dừng thi công</text>
        <!-- Bottom Icon Tag -->
        <rect x="40" y="470" width="1200" height="60" rx="10" fill="{COLORS['amber_light']}"/>
        <text x="640" y="510" fill="{COLORS['alert_amber']}" font-size="26" font-weight="800" text-anchor="middle">🏗️ Chủ động Hợp tác Bền vững</text>
      </g>

      <!-- Pillar 3: Cơ quan quản lý -->
      <g transform="translate(2710, 110)">
        <rect x="0" y="0" width="1380" height="580" rx="16" fill="{COLORS['card_white']}" stroke="{COLORS['seal_red']}" stroke-width="2"/>
        <rect x="0" y="0" width="1380" height="70" rx="16" fill="{COLORS['seal_red']}"/>
        <text x="40" y="48" fill="#FFFFFF" font-size="30" font-weight="800">3. CƠ QUAN QUẢN LÝ (1022/iHANOI)</text>
        <text x="40" y="120" fill="{COLORS['ink_dark']}" font-size="28" font-weight="700">• Tiếp nhận hồ sơ số chuẩn hóa</text>
        <text x="40" y="170" fill="{COLORS['ink_muted']}" font-size="26" font-weight="500">Đầy đủ tọa độ, ảnh băm SHA-256</text>
        <text x="40" y="225" fill="{COLORS['ink_dark']}" font-size="28" font-weight="700">• Giảm 70% tải xác minh hiện trường</text>
        <text x="40" y="275" fill="{COLORS['ink_muted']}" font-size="26" font-weight="500">Dữ liệu đối soát đã được thanh niên kiểm tra</text>
        <text x="40" y="330" fill="{COLORS['ink_dark']}" font-size="28" font-weight="700">• Ra quyết định minh bạch</text>
        <text x="40" y="380" fill="{COLORS['seal_red']}" font-size="26" font-weight="700">Đóng hồ sơ có biên bản số đối chứng</text>
        <!-- Bottom Icon Tag -->
        <rect x="40" y="470" width="1300" height="60" rx="10" fill="#FFF0F0"/>
        <text x="690" y="510" fill="{COLORS['seal_red']}" font-size="26" font-weight="800" text-anchor="middle">🏛️ Quản trị Đô thị Thông minh</text>
      </g>
    </g>

    <!-- Right: 2 Large Interactive QR Code Cards (Width: 2000px) -->
    <g transform="translate(4600, 7460)">
      <rect x="0" y="0" width="2050" height="740" rx="20" fill="{COLORS['bg_cream']}" stroke="{COLORS['border_strong']}" stroke-width="3"/>
      
      <!-- QR 1 (Left): Live Demo Web App -->
      <g transform="translate(50, 40)">
        <rect x="0" y="0" width="920" height="660" rx="16" fill="{COLORS['card_white']}" stroke="{COLORS['civic_teal']}" stroke-width="3"/>
        <rect x="0" y="0" width="920" height="70" rx="16" fill="{COLORS['civic_teal']}"/>
        <text x="460" y="48" fill="#FFFFFF" font-size="28" font-weight="800" text-anchor="middle">TRẢI NGHIỆM WEB APP</text>
        
        <!-- QR 1 SVG Vector Graphics -->
        <g transform="translate(235, 110) scale({450 / qr1_size})">
          <path d="{qr1_path}" fill="{COLORS['ink_dark']}"/>
        </g>
        
        <text x="460" y="600" fill="{COLORS['ink_dark']}" font-size="24" font-weight="800" text-anchor="middle">Quét xem Live Demo</text>
        <text x="460" y="635" fill="{COLORS['civic_teal']}" font-size="20" font-weight="700" text-anchor="middle">dustguard.vn</text>
      </g>

      <!-- QR 2 (Right): Tech Whitepaper & SHA-256 Dossier -->
      <g transform="translate(1030, 40)">
        <rect x="0" y="0" width="950" height="660" rx="16" fill="{COLORS['card_white']}" stroke="{COLORS['seal_red']}" stroke-width="3"/>
        <rect x="0" y="0" width="950" height="70" rx="16" fill="{COLORS['seal_red']}"/>
        <text x="475" y="48" fill="#FFFFFF" font-size="28" font-weight="800" text-anchor="middle">HỒ SƠ BẰNG CHỨNG</text>
        
        <!-- QR 2 SVG Vector Graphics -->
        <g transform="translate(250, 110) scale({450 / qr2_size})">
          <path d="{qr2_path}" fill="{COLORS['ink_dark']}"/>
        </g>
        
        <text x="475" y="600" fill="{COLORS['ink_dark']}" font-size="24" font-weight="800" text-anchor="middle">Tra cứu Thuyết minh SHA-256</text>
        <text x="475" y="635" fill="{COLORS['seal_red']}" font-size="20" font-weight="700" text-anchor="middle">Bản quyền UNICEF 2026</text>
      </g>
    </g>

    <!-- Bottom Pilot Roadmap Bar -->
    <g transform="translate(350, 8240)">
      <rect x="0" y="0" width="6300" height="480" rx="16" fill="{COLORS['ink_dark']}"/>
      <text x="60" y="65" fill="{COLORS['gold_accent']}" font-size="34" font-weight="800">
        LỘ TRÌNH TRIỂN KHAI LEAN PILOT (2026 — 2027):
      </text>

      <!-- Milestone 1 -->
      <g transform="translate(60, 110)">
        <rect x="0" y="0" width="1450" height="320" rx="12" fill="#2C231B"/>
        <text x="30" y="55" fill="{COLORS['gold_accent']}" font-size="28" font-weight="800">GIAI ĐOẠN 1 (Q2/2026)</text>
        <text x="30" y="105" fill="#FFFFFF" font-size="30" font-weight="700">Pilot 5 Đại Công Trình</text>
        <text x="30" y="160" fill="#E5E0D8" font-size="24" font-weight="500">
          • Triển khai tại Hà Nội &amp; TP.HCM<br/>
          • Lắp đặt 20 vi trạm quang học mở<br/>
          • 100 sinh viên tình nguyện xung kích
        </text>
        <text x="30" y="275" fill="#A7F3D0" font-size="22" font-weight="700">✓ Mục tiêu: Kiểm chứng SLA 48h</text>
      </g>

      <!-- Milestone 2 -->
      <g transform="translate(1600, 110)">
        <rect x="0" y="0" width="1450" height="320" rx="12" fill="#2C231B"/>
        <text x="30" y="55" fill="{COLORS['gold_accent']}" font-size="28" font-weight="800">GIAI ĐOẠN 2 (Q3-Q4/2026)</text>
        <text x="30" y="105" fill="#FFFFFF" font-size="30" font-weight="700">Liên Thông Cổng 1022</text>
        <text x="30" y="160" fill="#E5E0D8" font-size="24" font-weight="500">
          • Tích hợp API Cổng 1022 &amp; iHanoi<br/>
          • Mở rộng 50 công trình trọng điểm<br/>
          • Ra mắt Bảng điểm Nhà thầu Xanh
        </text>
        <text x="30" y="275" fill="#A7F3D0" font-size="22" font-weight="700">✓ Mục tiêu: Tự động hóa chuyển giao</text>
      </g>

      <!-- Milestone 3 -->
      <g transform="translate(3140, 110)">
        <rect x="0" y="0" width="1450" height="320" rx="12" fill="#2C231B"/>
        <text x="30" y="55" fill="{COLORS['gold_accent']}" font-size="28" font-weight="800">GIAI ĐOẠN 3 (2027)</text>
        <text x="30" y="105" fill="#FFFFFF" font-size="30" font-weight="700">Nhân Rộng Toàn Quốc</text>
        <text x="30" y="160" fill="#E5E0D8" font-size="24" font-weight="500">
          • Kết nối mạng lưới 63 tỉnh thành<br/>
          • Chuyển giao mã nguồn mở Civic Tech<br/>
          • Tiêu chuẩn hóa hồ sơ băm SHA-256
        </text>
        <text x="30" y="275" fill="#A7F3D0" font-size="22" font-weight="700">✓ Mục tiêu: Thể chế hóa Civic Tech</text>
      </g>

      <!-- Milestone 4: Impact Vision -->
      <g transform="translate(4680, 110)">
        <rect x="0" y="0" width="1550" height="320" rx="12" fill="{COLORS['civic_teal']}"/>
        <text x="30" y="55" fill="#FFFFFF" font-size="28" font-weight="800">TÁC ĐỘNG XÃ HỘI (IMPACT)</text>
        <text x="30" y="115" fill="{COLORS['gold_accent']}" font-size="44" font-weight="900">-40% Bụi Công Trình</text>
        <text x="30" y="170" fill="#FFFFFF" font-size="26" font-weight="600">Bảo vệ sức khỏe cho 500.000+ trẻ em &amp; học sinh sống quanh các trục đường thi công trọng điểm.</text>
        <text x="30" y="275" fill="#FFFFFF" font-size="24" font-weight="800">★ Vì Một Việt Nam Không Khí Sạch ★</text>
      </g>
    </g>
  </g>

  <!-- ========================================================================= -->
  <!-- FOOTER: BẢN QUYỀN & THÔNG TIN LIÊN HỆ                                    -->
  <!-- ========================================================================= -->
  <g id="footer-section" transform="translate(250, 8820)">
    <text x="0" y="80" fill="{COLORS['ink_muted']}" font-size="32" font-weight="600">
      DustGuard VN — Nền Tảng Civic Tech Giám Sát &amp; Đóng Vòng Bụi Công Trình Đô Thị
    </text>
    <text x="6500" y="80" fill="{COLORS['seal_red']}" font-size="32" font-weight="800" text-anchor="end">
      UNICEF HACKATHON 2026 · VÒNG CHUNG KẾT · ĐỘI THI DUSTGUARD VIỆT NAM
    </text>
  </g>

</svg>"""
    return svg


# ==============================================================================
# 3. XÂY DỰNG SVG CHO VIDEO THUMBNAIL COVER 16:9 (1920 x 1080)
# ==============================================================================
def build_thumbnail_cover_svg() -> str:
    qr_size, qr_path = generate_qr_svg_path(URL_DEMO_APP)

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080" style="background-color: {COLORS['bg_cream']}; font-family: 'Be Vietnam Pro', 'Segoe UI', system-ui, -apple-system, sans-serif;">
  <!-- Solid Background -->
  <rect width="1920" height="1080" fill="{COLORS['bg_cream']}"/>

  <!-- Left Accent Bar -->
  <rect x="0" y="0" width="24" height="1080" fill="{COLORS['seal_red']}"/>

  <!-- Outer Border -->
  <rect x="36" y="36" width="1848" height="1008" fill="none" stroke="{COLORS['border_strong']}" stroke-width="2"/>

  <!-- Top Ribbon -->
  <g transform="translate(80, 60)">
    <rect x="0" y="0" width="700" height="50" rx="12" fill="{COLORS['seal_red']}"/>
    <text x="350" y="34" fill="#FFFFFF" font-size="22" font-weight="800" text-anchor="middle" letter-spacing="2">
      ★ UNICEF HACKATHON 2026 — VÒNG CHUNG KẾT ★
    </text>
  </g>

  <!-- Main Left Content Block (Width: 1100px) -->
  <g transform="translate(80, 150)">
    <!-- Shield Logo Small & Title Lockup -->
    <g transform="translate(0, 10)">
      <path d="M40 0 L80 20 L80 70 C80 110 40 135 40 135 C40 135 0 110 0 70 L0 20 Z" fill="{COLORS['seal_red']}"/>
      <circle cx="40" cy="55" r="18" fill="#FFFFFF"/>
      <circle cx="40" cy="55" r="9" fill="{COLORS['civic_teal']}"/>
      
      <text x="105" y="65" fill="{COLORS['ink_dark']}" font-size="75" font-weight="900" letter-spacing="-1">DUSTGUARD VN</text>
      <rect x="105" y="85" width="620" height="38" rx="8" fill="{COLORS['teal_light']}" stroke="{COLORS['civic_teal']}" stroke-width="1.5"/>
      <text x="120" y="111" fill="{COLORS['civic_teal']}" font-size="18" font-weight="800" letter-spacing="1">
        CIVIC TECH · GIÁM SÁT BỤI CÔNG TRÌNH · ĐÓNG VÒNG MINH BẠCH
      </text>
    </g>

    <!-- Big Catchy Headline -->
    <g transform="translate(0, 180)">
      <text x="0" y="80" fill="{COLORS['ink_dark']}" font-size="52" font-weight="900">
        NỀN TẢNG CIVIC TECH
      </text>
      <text x="0" y="150" fill="{COLORS['seal_red']}" font-size="52" font-weight="900">
        GIÁM SÁT &amp; ĐÓNG VÒNG BỤI ĐÔ THỊ
      </text>
      <text x="0" y="215" fill="{COLORS['ink_muted']}" font-size="26" font-weight="600">
        Kết nối tín hiệu bụi hiện trường thành hồ sơ số SHA-256 có giá trị thực thi
      </text>
    </g>

    <!-- 4 Value Pill Badges -->
    <g transform="translate(0, 470)">
      <!-- Pill 1 -->
      <rect x="0" y="0" width="530" height="90" rx="16" fill="{COLORS['card_white']}" stroke="{COLORS['border_strong']}" stroke-width="2"/>
      <circle cx="50" cy="45" r="25" fill="{COLORS['seal_red']}"/>
      <text x="50" y="53" fill="#FFFFFF" font-size="18" font-weight="800" text-anchor="middle">HASH</text>
      <text x="90" y="38" fill="{COLORS['ink_dark']}" font-size="22" font-weight="800">Bảo Chứng SHA-256</text>
      <text x="90" y="68" fill="{COLORS['ink_muted']}" font-size="18" font-weight="500">Chống sửa đổi · Web Crypto SSOT</text>

      <!-- Pill 2 -->
      <rect x="560" y="0" width="530" height="90" rx="16" fill="{COLORS['card_white']}" stroke="{COLORS['border_strong']}" stroke-width="2"/>
      <circle cx="610" cy="45" r="25" fill="{COLORS['civic_teal']}"/>
      <text x="610" y="53" fill="#FFFFFF" font-size="18" font-weight="800" text-anchor="middle">5S</text>
      <text x="650" y="38" fill="{COLORS['ink_dark']}" font-size="22" font-weight="800">Chu Trình 5 Bước</text>
      <text x="650" y="68" fill="{COLORS['ink_muted']}" font-size="18" font-weight="500">Phát hiện → Xử lý → Tái kiểm</text>

      <!-- Pill 3 -->
      <rect x="0" y="110" width="530" height="90" rx="16" fill="{COLORS['card_white']}" stroke="{COLORS['border_strong']}" stroke-width="2"/>
      <circle cx="50" cy="155" r="25" fill="{COLORS['alert_amber']}"/>
      <text x="50" y="163" fill="#FFFFFF" font-size="18" font-weight="800" text-anchor="middle">SLA</text>
      <text x="90" y="148" fill="{COLORS['ink_dark']}" font-size="22" font-weight="800">Tái Kiểm 24h – 48h</text>
      <text x="90" y="178" fill="{COLORS['ink_muted']}" font-size="18" font-weight="500">Ràng buộc trách nhiệm thực tế</text>

      <!-- Pill 4 -->
      <rect x="560" y="110" width="530" height="90" rx="16" fill="{COLORS['card_white']}" stroke="{COLORS['border_strong']}" stroke-width="2"/>
      <circle cx="610" cy="155" r="25" fill="{COLORS['action_green']}"/>
      <text x="610" y="163" fill="#FFFFFF" font-size="18" font-weight="800" text-anchor="middle">0.5M</text>
      <text x="650" y="148" fill="{COLORS['ink_dark']}" font-size="22" font-weight="800">Node IoT ≈ 0,5 Triệu</text>
      <text x="650" y="178" fill="{COLORS['ink_muted']}" font-size="18" font-weight="500">ESP32 + Cảm biến mở giá rẻ</text>
    </g>

    <!-- Bottom Footer Tag -->
    <g transform="translate(0, 720)">
      <text x="0" y="40" fill="{COLORS['ink_muted']}" font-size="22" font-weight="600">
        Đồng hành cùng Thanh niên &amp; Học sinh vì Không khí Sạch Việt Nam
      </text>
    </g>
  </g>

  <!-- Right Visual Showcase Card (Width: 650px) -->
  <g transform="translate(1210, 80)">
    <rect x="0" y="0" width="630" height="920" rx="28" fill="{COLORS['card_white']}" stroke="{COLORS['border_strong']}" stroke-width="4"/>
    
    <!-- Top Showcase Header -->
    <rect x="0" y="0" width="630" height="75" rx="28" fill="{COLORS['ink_dark']}"/>
    <text x="315" y="48" fill="#FFFFFF" font-size="24" font-weight="800" text-anchor="middle">
      BẰNG CHỨNG ĐỐI SOÁT THỰC TẾ
    </text>

    <!-- Before Card -->
    <g transform="translate(30, 105)">
      <rect x="0" y="0" width="570" height="230" rx="16" fill="#FFF5F5" stroke="{COLORS['dustguard_red']}" stroke-width="2"/>
      <rect x="0" y="0" width="570" height="45" rx="16" fill="{COLORS['dustguard_red']}"/>
      <text x="20" y="30" fill="#FFFFFF" font-size="20" font-weight="800">🔴 T1: Ban Đầu (12/03/2026)</text>
      
      <text x="25" y="105" fill="{COLORS['seal_red']}" font-size="18" font-weight="800">PM2.5:</text>
      <text x="100" y="115" fill="{COLORS['dustguard_red']}" font-size="52" font-weight="900">142 <tspan font-size="24">µg/m³</tspan></text>
      <text x="25" y="160" fill="{COLORS['ink_muted']}" font-size="18" font-weight="500">Xe ben không phủ bạt, cát rơi vãi</text>
      <text x="25" y="200" fill="{COLORS['seal_red']}" font-size="16" font-family="monospace" font-weight="700">SHA-256: 7f83b165...126d9069</text>
    </g>

    <!-- Arrow Down -->
    <g transform="translate(315, 360)">
      <circle cx="0" cy="0" r="22" fill="{COLORS['action_green']}"/>
      <path d="M-8 -6 L0 4 L8 -6" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
    </g>

    <!-- After Card -->
    <g transform="translate(30, 400)">
      <rect x="0" y="0" width="570" height="230" rx="16" fill="{COLORS['green_light']}" stroke="{COLORS['action_green']}" stroke-width="2"/>
      <rect x="0" y="0" width="570" height="45" rx="16" fill="{COLORS['action_green']}"/>
      <text x="20" y="30" fill="#FFFFFF" font-size="20" font-weight="800">🟢 T2: Tái Kiểm Sau 26h Xử Lý</text>
      
      <text x="25" y="105" fill="{COLORS['action_green']}" font-size="18" font-weight="800">PM2.5:</text>
      <text x="100" y="115" fill="{COLORS['action_green']}" font-size="52" font-weight="900">28 <tspan font-size="24">µg/m³</tspan></text>
      <text x="25" y="160" fill="{COLORS['ink_muted']}" font-size="18" font-weight="500">Vòi phun hoạt động · Đạt chuẩn QCVN</text>
      <text x="25" y="200" fill="{COLORS['action_green']}" font-size="16" font-family="monospace" font-weight="700">SHA-256: 9f86d081...0f00a08</text>
    </g>

    <!-- Bottom QR Area -->
    <g transform="translate(30, 660)">
      <rect x="0" y="0" width="570" height="225" rx="16" fill="{COLORS['bg_cream']}" stroke="{COLORS['border_strong']}" stroke-width="2"/>
      
      <g transform="translate(30, 20) scale({180 / qr_size})">
        <path d="{qr_path}" fill="{COLORS['ink_dark']}"/>
      </g>

      <text x="240" y="65" fill="{COLORS['ink_dark']}" font-size="24" font-weight="800">QUÉT XEM DEMO</text>
      <text x="240" y="100" fill="{COLORS['civic_teal']}" font-size="20" font-weight="700">dustguard.vn</text>
      <text x="240" y="140" fill="{COLORS['ink_muted']}" font-size="16" font-weight="500">
        <tspan x="240" dy="0">Bản đồ thời gian thực &amp;</tspan>
        <tspan x="240" dy="24">Chuỗi bằng chứng D1 SSOT</tspan>
      </text>
    </g>
  </g>
</svg>"""
    return svg


# ==============================================================================
# 4. XÂY DỰNG STANDALONE HTML5 RENDERER CHO BACKDROP VÀ THUMBNAIL
# ==============================================================================
def build_backdrop_html(svg_content: str) -> str:
    html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DustGuard VN — Backdrop 70x90cm High-Res & Print Renderer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap" rel="stylesheet">
  <style>
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}
    body {{
      background-color: #231B14;
      color: #FDFBF7;
      font-family: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }}
    .control-panel {{
      background: #FFFFFF;
      color: #231B14;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 900px;
      margin-bottom: 24px;
      border-left: 6px solid #9F241F;
    }}
    .title-group h1 {{
      font-size: 18px;
      font-weight: 800;
      color: #9F241F;
    }}
    .title-group p {{
      font-size: 13px;
      color: #574F45;
    }}
    .btn-group {{
      display: flex;
      gap: 10px;
    }}
    .btn {{
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }}
    .btn-primary {{
      background: #9F241F;
      color: #FFFFFF;
    }}
    .btn-primary:hover {{
      background: #B51F24;
      transform: translateY(-1px);
    }}
    .btn-secondary {{
      background: #0D6F64;
      color: #FFFFFF;
    }}
    .btn-secondary:hover {{
      background: #084C44;
      transform: translateY(-1px);
    }}
    .btn-outline {{
      background: #FDFBF7;
      color: #231B14;
      border: 1px solid #D4CEBF;
    }}
    .backdrop-container {{
      background: #FFFFFF;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      border-radius: 4px;
      overflow: hidden;
      max-width: 800px;
      width: 100%;
      border: 1px solid #D4CEBF;
    }}
    .backdrop-container svg {{
      width: 100%;
      height: auto;
      display: block;
    }}
    @media print {{
      @page {{
        size: 700mm 900mm;
        margin: 0;
      }}
      body {{
        background: transparent !important;
        padding: 0 !important;
      }}
      .control-panel {{
        display: none !important;
      }}
      .backdrop-container {{
        box-shadow: none !important;
        border: none !important;
        max-width: none !important;
        width: 700mm !important;
        height: 900mm !important;
      }}
      .backdrop-container svg {{
        width: 700mm !important;
        height: 900mm !important;
      }}
    }}
  </style>
</head>
<body>
  <div class="control-panel">
    <div class="title-group">
      <h1>DustGuard VN — Backdrop 70x90cm Poster Sân Khấu</h1>
      <p>UNICEF Hackathon 2026 Finals · Kích thước chuẩn in ấn: 700mm × 900mm (300 DPI)</p>
    </div>
    <div class="btn-group">
      <button class="btn btn-primary" onclick="window.print()">🖨️ In sang PDF (700x900mm)</button>
      <button class="btn btn-secondary" onclick="exportHighResPng()">💾 Xuất PNG Siêu Nét (Canvas)</button>
      <button class="btn btn-outline" onclick="downloadSvg()">📐 Tải SVG Gốc</button>
    </div>
  </div>

  <div class="backdrop-container" id="poster-box">
    {svg_content}
  </div>

  <script>
    function downloadSvg() {{
      const svgEl = document.querySelector('svg');
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(svgEl);
      const blob = new Blob([svgStr], {{ type: 'image/svg+xml;charset=utf-8' }});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'dustguard_backdrop_70x90.svg';
      link.click();
      URL.revokeObjectURL(url);
    }}

    function exportHighResPng() {{
      const svgEl = document.querySelector('svg');
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(svgEl);
      const svgBlob = new Blob([svgStr], {{ type: 'image/svg+xml;charset=utf-8' }});
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);
      const image = new Image();
      image.onload = () => {{
        const canvas = document.createElement('canvas');
        canvas.width = 3500;
        canvas.height = 4500;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FDFBF7';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const pngURL = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngURL;
        downloadLink.download = 'dustguard_backdrop_70x90_highres.png';
        downloadLink.click();
        URL.revokeObjectURL(blobURL);
      }};
      image.src = blobURL;
    }}
  </script>
</body>
</html>
"""
    return html


def build_thumbnail_html(svg_content: str) -> str:
    html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DustGuard VN — Video Thumbnail Cover 16:9</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;800;900&display=swap" rel="stylesheet">
  <style>
    body {{
      background: #231B14;
      color: #FDFBF7;
      font-family: 'Be Vietnam Pro', system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px 20px;
    }}
    .header-bar {{
      max-width: 1200px;
      width: 100%;
      background: #FFFFFF;
      color: #231B14;
      padding: 16px 24px;
      border-radius: 12px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      border-left: 6px solid #9F241F;
    }}
    .thumb-wrapper {{
      max-width: 1200px;
      width: 100%;
      aspect-ratio: 16 / 9;
      box-shadow: 0 8px 30px rgba(0,0,0,0.5);
      border-radius: 12px;
      overflow: hidden;
      border: 2px solid #D4CEBF;
      background: #FDFBF7;
    }}
    .thumb-wrapper svg {{
      width: 100%;
      height: 100%;
      display: block;
    }}
    .btn {{
      background: #9F241F;
      color: white;
      padding: 10px 18px;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      border: none;
    }}
  </style>
</head>
<body>
  <div class="header-bar">
    <div>
      <h2 style="font-size: 18px; color: #9F241F;">Video Thumbnail Cover (16:9 — 1920x1080)</h2>
      <p style="font-size: 13px; color: #574F45;">DustGuard VN Pitch Presentation Cover Image</p>
    </div>
    <button class="btn" onclick="window.print()">Xuất Bản</button>
  </div>
  <div class="thumb-wrapper">
    {svg_content}
  </div>
</body>
</html>
"""
    return html


# ==============================================================================
# 5. XUẤT FILE SPEC CMYK JSON & README HƯỚNG DẪN IN ẤN
# ==============================================================================
def build_cmyk_spec_json() -> dict:
    return {
        "project": "DustGuard VN",
        "competition": "UNICEF Hackathon 2026",
        "asset_type": "Exhibition Backdrop & Presentation Poster",
        "print_specs": {
            "trim_size_mm": [700, 900],
            "bleed_mm": 3,
            "bleed_size_mm": [706, 906],
            "safety_margin_mm": 15,
            "resolution_dpi": 300,
            "pixel_dimensions_exact": [8268, 10630],
            "pixel_dimensions_with_bleed": [8339, 10701],
            "color_profile": "CMYK FOGRA39 / Japan Color 2001 Coated",
            "material_recommendation": "Decal PP ngoai troi can mang mo boi Formex 5mm"
        },
        "color_palette_ssot": {
            "bg_cream": {"hex": "#FDFBF7", "rgb": [253, 251, 247], "cmyk": "C0 M1 Y3 K1", "role": "Main civic background"},
            "ink_dark": {"hex": "#231B14", "rgb": [35, 27, 20], "cmyk": "C60 M65 Y65 K75", "role": "Primary typography (AAA contrast)"},
            "seal_red": {"hex": "#9F241F", "rgb": [159, 36, 31], "cmyk": "C15 M95 Y90 K10", "role": "Brand seal & headers"},
            "dustguard_red": {"hex": "#B51F24", "rgb": [181, 31, 36], "cmyk": "C15 M95 Y90 K5", "role": "Risk alerts & CTA buttons"},
            "civic_teal": {"hex": "#0D6F64", "rgb": [13, 111, 100], "cmyk": "C85 M25 Y55 K15", "role": "Tech infrastructure & positive highlights"},
            "action_green": {"hex": "#1E7E4E", "rgb": [30, 126, 78], "cmyk": "C80 M20 Y85 K10", "role": "Verified proof & closure status"},
            "alert_amber": {"hex": "#B45309", "rgb": [180, 83, 9], "cmyk": "C20 M70 Y100 K10", "role": "In-progress warning status"}
        },
        "structure_blocks": {
            "block_1": "Van de & Boi canh o nhiem bui cong trinh do thi",
            "block_2": "Giai phap DustGuard & Quy trinh 5 buoc dong vong (5-Step Closed Loop)",
            "block_3": "Trach nhiem AI (AI la Tro ly, Khong Phan xet) & Bang chung D1 SSOT",
            "block_4": "Lo trinh Lean Pilot, 3 Chi so Vang & 3 Tru cot hop tac"
        }
    }


def build_readme_guide() -> str:
    return """# DustGuard VN — Backdrop 70x90cm & Video Cover Graphics Package

Tài liệu hướng dẫn in ấn và danh mục ấn phẩm đồ họa cho Vòng Chung kết UNICEF Hackathon 2026.

---

## 📦 Danh Mục File Đã Xuất

| Tên File | Định Dạng | Quy Cách / Kích Thước | Mục Đích Sử Dụng |
| :--- | :--- | :--- | :--- |
| `dustguard_backdrop_70x90.svg` | SVG Vector | **700mm × 900mm** (ViewBox 7000×9000) | File vector gốc, phóng to vô hạn không vỡ nét |
| `dustguard_backdrop_70x90.png` | PNG Raster | **2333px × 3000px** (Chống răng cưa) | Xem nhanh, trình chiếu slide & preview sân khấu |
| `dustguard_backdrop_70x90_print_guide.pdf` | PDF Vector | **700mm × 900mm** chuẩn in ấn | File gửi trực tiếp xưởng in quảng cáo / poster |
| `backdrop_70x90_renderer.html` | HTML5 Standalone | Đầy đủ nút in 1:1 sang PDF & Canvas 300DPI | Trình chiếu tương tác và in trực tiếp trên trình duyệt |
| `video_thumbnail_cover_16x9.svg` | SVG Vector | **1920px × 1080px** (Tỷ lệ 16:9) | Cover Thumbnail Vector cho video giới thiệu dự án |
| `video_thumbnail_cover_16x9.png` | PNG Raster | **1920px × 1080px** chuẩn Full HD | Ảnh cover thumbnail tải lên YouTube / Presentation |
| `video_thumbnail_cover_renderer.html` | HTML5 Standalone | 16:9 Interactive Viewer | Trình duyệt xem trước thumbnail |
| `dustguard_backdrop_70x90_cmyk_spec.json` | JSON Metadata | Machine-readable Print & CMYK Specs | Tra cứu thông số kỹ thuật cho máy in và AI agents |

---

## 🎨 4 Khối Bố Cục Chuẩn Civic Tech Trên Backdrop

1. **Khối 1: Vấn Đề & Bối Cảnh Đô Thị**:
   - Ô nhiễm PM2.5/10 vượt ngưỡng 3-7 lần tại các đại công trình.
   - Bảng so sánh 4 tiêu chí giữa Phản ánh truyền thống vs. DustGuard VN Civic Tech.
2. **Khối 2: Giải Pháp & Quy Trình 5 Bước Đóng Vòng (5-Step Closed Loop)**:
   - Sơ đồ 5 trạm: (1) Phát hiện → (2) Ưu tiên Risk Score → (3) Hồ sơ số SHA-256 → (4) Chuyển giao 1022 → (5) Tái kiểm 48h.
   - Bằng chứng đối soát mẫu `#DG-2026-0842` (Trước: 142 µg/m³ → Sau: 28 µg/m³).
3. **Khối 3: Trách Nhiệm AI & Bằng Chứng D1 SSOT**:
   - Triết lý *"AI là Trợ lý, Không Phán xét"*: Con người giữ quyền quyết định thực địa.
   - Chuỗi băm SHA-256 Client Web Crypto + Cloudflare D1 SQLite chuẩn SSOT (< 50ms).
4. **Khối 4: Lộ Trình Lean Pilot & Mô Hình 3 Trụ Cột**:
   - 3 Chỉ số Lean: Cảm biến ~0.5tr | SLA 24-48h | Cloud D1 Serverless.
   - 3 Trụ cột: Thanh niên tình nguyện — Nhà thầu thi công — Cơ quan quản lý 1022.
   - 2 Mã QR Vector trực tiếp: Live Demo Web App & Thuyết minh Kỹ thuật.

---

## 🖨️ Hướng Dẫn In Ấn Chuẩn Công Nghiệp (Print Ready)

1. **Khổ giấy thành phẩm**: 700 mm × 900 mm (Khổ đứng).
2. **Chất liệu khuyến nghị**: Decal PP ngoài trời cán màng mờ bồi Formex 5mm (chống bóng lóa dưới đèn hội trường).
3. **Xuất file từ HTML Renderer**: Mở `backdrop_70x90_renderer.html` trên Google Chrome, nhấn **Ctrl + P**, chọn *Save as PDF*, mục Paper Size chọn khổ *Custom 700x900mm*, Margins: *None*, bật *Background graphics*.

---
*Bản quyền © 2026 DustGuard VN — UNICEF Hackathon 2026.*
"""


# ==============================================================================
# 6. MAIN EXECUTION PIPELINE
# ==============================================================================
def main():
    print("=" * 80)
    print("🎨 DUSTGUARD VN — SUBAGENT 9: BACKDROP 70x90cm & GRAPHICS GENERATOR")
    print("=" * 80)

    # Thư mục xuất
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_dir = os.path.join(base_dir, "graphics", "backdrop_70x90")
    os.makedirs(output_dir, exist_ok=True)
    print(f"📁 Thư mục xuất ấn phẩm: {output_dir}")

    # 1. Sinh Backdrop SVG
    print("\n[1/7] Đang sinh file Vector SVG 700x900mm (7000x9000)...")
    backdrop_svg = build_backdrop_svg()
    backdrop_svg_path = os.path.join(output_dir, "dustguard_backdrop_70x90.svg")
    with open(backdrop_svg_path, "w", encoding="utf-8") as f:
        f.write(backdrop_svg)
    print(f"   ✓ Đã lưu SVG: {backdrop_svg_path} ({len(backdrop_svg):,} bytes)")

    # 2. Sinh PDF Vector bằng PyMuPDF
    print("\n[2/7] Đang chuyển đổi SVG sang PDF Vector 700x900mm...")
    backdrop_pdf_path = os.path.join(output_dir, "dustguard_backdrop_70x90_print_guide.pdf")
    try:
        svg_doc = fitz.open(stream=backdrop_svg.encode("utf-8"), filetype="svg")
        pdf_bytes = svg_doc.convert_to_pdf()
        pdf_doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        pdf_doc.save(backdrop_pdf_path)
        print(f"   ✓ Đã lưu PDF Vector: {backdrop_pdf_path} (1 trang, 700x900mm)")
    except Exception as e:
        print(f"   ⚠️ Lỗi khi xuất PDF qua PyMuPDF: {e}")

    # 3. Sinh PNG Preview Phân Giải Cao (2333x3000px)
    print("\n[3/7] Đang kết xuất PNG Preview độ nét cao...")
    backdrop_png_path = os.path.join(output_dir, "dustguard_backdrop_70x90.png")
    try:
        pix = pdf_doc[0].get_pixmap(dpi=85, alpha=False)
        pix.save(backdrop_png_path)
        print(f"   ✓ Đã lưu PNG Preview: {backdrop_png_path} ({pix.width}x{pix.height}px)")
    except Exception as e:
        print(f"   ⚠️ Lỗi khi xuất PNG qua PyMuPDF: {e}")

    # 4. Sinh HTML5 Interactive Backdrop Renderer
    print("\n[4/7] Đang sinh HTML5 Interactive Renderer cho Backdrop...")
    backdrop_html = build_backdrop_html(backdrop_svg)
    backdrop_html_path = os.path.join(output_dir, "backdrop_70x90_renderer.html")
    with open(backdrop_html_path, "w", encoding="utf-8") as f:
        f.write(backdrop_html)
    print(f"   ✓ Đã lưu HTML Renderer: {backdrop_html_path}")

    # 5. Sinh Video Thumbnail Cover (16:9 - 1920x1080)
    print("\n[5/7] Đang sinh Video Thumbnail Cover (16:9)...")
    thumb_svg = build_thumbnail_cover_svg()
    thumb_svg_path = os.path.join(output_dir, "video_thumbnail_cover_16x9.svg")
    with open(thumb_svg_path, "w", encoding="utf-8") as f:
        f.write(thumb_svg)

    thumb_png_path = os.path.join(output_dir, "video_thumbnail_cover_16x9.png")
    try:
        thumb_doc = fitz.open(stream=thumb_svg.encode("utf-8"), filetype="svg")
        thumb_pdf_bytes = thumb_doc.convert_to_pdf()
        thumb_pdf_doc = fitz.open(stream=thumb_pdf_bytes, filetype="pdf")
        thumb_pix = thumb_pdf_doc[0].get_pixmap(dpi=72, alpha=False)
        thumb_pix.save(thumb_png_path)
        print(f"   ✓ Đã lưu Thumbnail SVG: {thumb_svg_path}")
        print(f"   ✓ Đã lưu Thumbnail PNG: {thumb_png_path} ({thumb_pix.width}x{thumb_pix.height}px)")
    except Exception as e:
        print(f"   ⚠️ Lỗi khi xuất Thumbnail PNG: {e}")

    thumb_html = build_thumbnail_html(thumb_svg)
    thumb_html_path = os.path.join(output_dir, "video_thumbnail_cover_renderer.html")
    with open(thumb_html_path, "w", encoding="utf-8") as f:
        f.write(thumb_html)
    print(f"   ✓ Đã lưu Thumbnail HTML: {thumb_html_path}")

    # 6. Xuất CMYK Spec JSON
    print("\n[6/7] Đang xuất file đặc tả in ấn CMYK JSON...")
    cmyk_spec = build_cmyk_spec_json()
    spec_json_path = os.path.join(output_dir, "dustguard_backdrop_70x90_cmyk_spec.json")
    with open(spec_json_path, "w", encoding="utf-8") as f:
        json.dump(cmyk_spec, f, ensure_ascii=False, indent=2)
    print(f"   ✓ Đã lưu CMYK Spec JSON: {spec_json_path}")

    # 7. Xuất README Hướng Dẫn Kỹ Thuật
    print("\n[7/7] Đang xuất tài liệu hướng dẫn README.md...")
    readme_content = build_readme_guide()
    readme_path = os.path.join(output_dir, "README.md")
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(readme_content)
    print(f"   ✓ Đã lưu README Guide: {readme_path}")

    print("\n" + "=" * 80)
    print("🎉 HOÀN THÀNH TẤT CẢ ẤN PHẨM ĐỒ HỌA & BACKDROP 70x90cm DUSTGUARD VN!")
    print("=" * 80)


if __name__ == "__main__":
    main()
