#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DustGuard VN — Motion Graphics & Slide Compositor
Tự động tạo các clip video Motion Slide chuyển động Ken Burns kết hợp Card đồ hoạ Civic Tech
chuẩn phát sóng (1920x1080, 25fps, H.264 CRF 18).
"""

import os
import sys
import json
import time
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Đảm bảo stdout/stderr UTF-8 trên Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Thư mục cơ sở
BASE_DIR = Path(__file__).resolve().parent.parent
SLIDES_DIR = BASE_DIR / "02_sources" / "slides" / "png"
REAL_IMAGES_DIR = BASE_DIR / "02_sources" / "real_images"
OUTPUT_DIR = BASE_DIR / "03_selected" / "motion_slides"
TEMP_DIR = OUTPUT_DIR / "_temp_overlays"
MANIFEST_PATH = BASE_DIR / "03_selected" / "motion_manifest.json"

# Bảng màu Civic Tech (SSOT)
COLOR_CREAM = (253, 251, 247)       # #FDFBF7
COLOR_INK = (35, 27, 20)            # #231B14
COLOR_TEAL = (13, 111, 100)         # #0D6F64
COLOR_SEAL_RED = (159, 36, 31)      # #9F241F
COLOR_CARD_BG = (28, 22, 17, 228)   # Solid dark card với tương phản cao
COLOR_BORDER = (55, 45, 38, 255)
COLOR_TEAL_LIGHT = (230, 244, 241)

# Font tiếng Việt
def get_fonts():
    font_bold_candidates = [
        "C:/Windows/Fonts/segoeuib.ttf",
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/tahomabd.ttf",
    ]
    font_reg_candidates = [
        "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/tahoma.ttf",
    ]
    bold_path = next((f for f in font_bold_candidates if os.path.exists(f)), "arialbd.ttf")
    reg_path = next((f for f in font_reg_candidates if os.path.exists(f)), "arial.ttf")
    return {
        "badge": ImageFont.truetype(bold_path, 20),
        "headline": ImageFont.truetype(bold_path, 28),
        "subtitle": ImageFont.truetype(reg_path, 20),
    }

# Định nghĩa các Motion Slide Clips theo cấu trúc kịch bản và spec
MOTION_SLIDES_CONFIG = [
    # ─── PHÂN ĐOẠN 04: DUSTGUARD XUẤT HIỆN ─────────────────────────────────
    {
        "id": "MS_04_01",
        "filename": "motion_04_solution_reveal.mp4",
        "segment": "04_solution",
        "source": SLIDES_DIR / "slide_04_tinh_moi_sang_tao.png",
        "duration": 8.0,
        "motion": "zoom_in",
        "zoom_scale": 1.08,
        "badge_text": "GIẢI PHÁP DUSTGUARD",
        "badge_color": COLOR_TEAL,
        "headline": "KẾT NỐI TÍN HIỆU THÀNH HỒ SƠ QUẢN LÝ CÓ THỂ THEO DÕI",
        "subtitle": "Tín hiệu ban đầu ➔ Bằng chứng số ➔ Mức độ ưu tiên ➔ Quá trình xử lý",
    },
    {
        "id": "MS_04_02",
        "filename": "motion_04_stakeholders.mp4",
        "segment": "04_solution",
        "source": SLIDES_DIR / "slide_02_nguoi_huong_loi.png",
        "duration": 7.0,
        "motion": "pan_left_right",
        "zoom_scale": 1.15,
        "badge_text": "CHUỖI 4 BÊN PHỐI HỢP",
        "badge_color": COLOR_TEAL,
        "headline": "HỆ SINH THÁI ĐIỀU PHỐI VÀ HÀNH ĐỘNG MINH BẠCH",
        "subtitle": "Người dân • CLB Thanh niên • Nhà thầu thi công • Cơ quan quản lý",
    },

    # ─── PHÂN ĐOẠN 05: TÍNH MỚI & CORE LOGIC ──────────────────────────────
    {
        "id": "MS_05_01",
        "filename": "motion_05_core_workflow.mp4",
        "segment": "05_core_logic",
        "source": SLIDES_DIR / "slide_04_tinh_moi_sang_tao.png",
        "duration": 10.0,
        "motion": "zoom_in_pan",
        "zoom_scale": 1.12,
        "badge_text": "TÍNH MỚI SÁNG TẠO",
        "badge_color": COLOR_TEAL,
        "headline": "1 TÍN HIỆU BAN ĐẦU ➔ 1 HỒ SƠ CÓ BẰNG CHỨNG & THEO DÕI",
        "subtitle": "Thu hẹp khoảng trống sau phản ánh — Giám sát tiến độ trọn vòng đời",
    },
    {
        "id": "MS_05_02",
        "filename": "motion_05_evidence_lifecycle.mp4",
        "segment": "05_core_logic",
        "source": SLIDES_DIR / "slide_01_van_de_giai_quyet.png",
        "duration": 10.0,
        "motion": "pan_left_right",
        "zoom_scale": 1.15,
        "badge_text": "CHUỖI BẰNG CHỨNG MINH BẠCH",
        "badge_color": COLOR_SEAL_RED,
        "headline": "BẢO CHỨNG BẰNG CHỨNG SỐ & MÃ BĂM TOÀN VẸN DỮ LIỆU",
        "subtitle": "Minh chứng ảnh Before/After + Mã băm SHA-256 + Vị trí kiểm tra",
    },

    # ─── PHÂN ĐOẠN 06: BÀI HỌC SAU TẬP HUẤN ───────────────────────────────
    {
        "id": "MS_06_01",
        "filename": "motion_06_workshop_lesson.mp4",
        "segment": "06_workshop_lesson",
        "source": SLIDES_DIR / "slide_03_thay_doi_sau_tap_huan.png",
        "duration": 9.5,
        "motion": "zoom_in",
        "zoom_scale": 1.10,
        "badge_text": "BÀI HỌC SAU TẬP HUẤN",
        "badge_color": COLOR_TEAL,
        "headline": "HỆ THỐNG HỖ TRỢ THÔNG TIN — KHÔNG THAY THẾ CON NGƯỜI",
        "subtitle": "Giúp người ra quyết định có đầy đủ ngữ cảnh để hành động tốt hơn",
    },
    {
        "id": "MS_06_02",
        "filename": "motion_06_pivot_comparison.mp4",
        "segment": "06_workshop_lesson",
        "source": SLIDES_DIR / "slide_03_thay_doi_sau_tap_huan.png",
        "duration": 9.5,
        "motion": "pan_left_right",
        "zoom_scale": 1.15,
        "badge_text": "CHUYỂN DỊCH CHIẾN LƯỢC",
        "badge_color": COLOR_TEAL,
        "headline": "TỪ ĐIỂM SỐ RỦI RO ĐƠN LẺ ➔ QUY TRÌNH PHỐI HỢP ĐA BÊN",
        "subtitle": "IoT là tùy chọn bổ trợ — Trọng tâm là luồng dữ liệu minh bạch",
    },

    # ─── PHÂN ĐOẠN 07: RESPONSIBLE AI & TRIAGE ─────────────────────────────
    {
        "id": "MS_07_01",
        "filename": "motion_07_responsible_ai.mp4",
        "segment": "07_responsible_ai",
        "source": SLIDES_DIR / "slide_08_kiem_chung_phap_ly_ai.png",
        "duration": 9.5,
        "motion": "zoom_in",
        "zoom_scale": 1.08,
        "badge_text": "RESPONSIBLE AI",
        "badge_color": COLOR_TEAL,
        "headline": "AI PHÂN LOẠI & GỢI Ý CHECKLIST — CON NGƯỜI QUYẾT ĐỊNH",
        "subtitle": "AI không tự kết luận vi phạm • Không tự động xử phạt hành chính",
    },
    {
        "id": "MS_07_02",
        "filename": "motion_07_triage_process.mp4",
        "segment": "07_responsible_ai",
        "source": SLIDES_DIR / "slide_08_kiem_chung_phap_ly_ai.png",
        "duration": 9.5,
        "motion": "pan_right_left",
        "zoom_scale": 1.15,
        "badge_text": "DUST RISK SCORE",
        "badge_color": COLOR_SEAL_RED,
        "headline": "XẾP THỨ TỰ ƯU TIÊN XEM XÉT ≠ KẾT LUẬN VI PHẠM",
        "subtitle": "Giải quyết câu hỏi thực tế: Hồ sơ nào nên kiểm tra trước và vì sao?",
    },

    # ─── PHÂN ĐOẠN 08: LEAN PILOT & HIỆU QUẢ KỸ THUẬT ─────────────────────
    {
        "id": "MS_08_01",
        "filename": "motion_08_lean_pilot.mp4",
        "segment": "08_lean_pilot",
        "source": SLIDES_DIR / "slide_05_kha_thi_viet_nam_pilot.png",
        "duration": 10.0,
        "motion": "zoom_in_pan",
        "zoom_scale": 1.10,
        "badge_text": "MÔ HÌNH LEAN PILOT",
        "badge_color": COLOR_TEAL,
        "headline": "THỬ NGHIỆM TINH GỌN: 4-8 TUẦN • 20-30 NGƯỜI DÙNG THẬT",
        "subtitle": "Triển khai tại trường học / CLB môi trường — Tận dụng dữ liệu hiện có",
    },
    {
        "id": "MS_08_02",
        "filename": "motion_08_tech_efficiency.mp4",
        "segment": "08_lean_pilot",
        "source": SLIDES_DIR / "slide_06_hieu_qua_ky_thuat_chi_phi.png",
        "duration": 10.0,
        "motion": "pan_left_right",
        "zoom_scale": 1.15,
        "badge_text": "HIỆU QUẢ KỸ THUẬT & CHI PHÍ",
        "badge_color": COLOR_TEAL,
        "headline": "KIẾN TRÚC EDGE D1/R2 — DỮ LIỆU SSOT — CHI PHÍ TỐI ƯU",
        "subtitle": "Cloudflare Serverless • D1 lưu trữ bền vững • Vận hành 100% không cần cảm biến",
    },

    # ─── PHÂN ĐOẠN 09: ĐO LƯỜNG GIÁ TRỊ THẬT & BỀN VỮNG ─────────────────
    {
        "id": "MS_09_01",
        "filename": "motion_09_pilot_metrics.mp4",
        "segment": "09_metrics",
        "source": SLIDES_DIR / "slide_05_kha_thi_viet_nam_pilot.png",
        "duration": 8.5,
        "motion": "zoom_in",
        "zoom_scale": 1.14,
        "badge_text": "CHỈ SỐ MỤC TIÊU PILOT",
        "badge_color": COLOR_SEAL_RED,
        "headline": "4 CHỈ SỐ ĐO LƯỜNG NĂNG LỰC BIẾN TÍN HIỆU THÀNH HÀNH ĐỘNG",
        "subtitle": "% Đủ bằng chứng • Thời gian phản hồi • % Có bước xử lý • % Theo dõi",
    },
    {
        "id": "MS_09_02",
        "filename": "motion_09_sustainability.mp4",
        "segment": "09_metrics",
        "source": SLIDES_DIR / "slide_07_mo_hinh_van_hanh_duy_tri.png",
        "duration": 8.5,
        "motion": "pan_left_right",
        "zoom_scale": 1.15,
        "badge_text": "VẬN HÀNH BỀN VỮNG",
        "badge_color": COLOR_TEAL,
        "headline": "4 NGUỒN DUY TRÌ & TẠO GIÁ TRỊ LÂU DÀI TRONG HỆ SINH THÁI",
        "subtitle": "Tài trợ Civic • Dịch vụ hỗ trợ kỹ thuật • Dữ liệu phân tích • Đào tạo",
    },

    # ─── PHÂN ĐOẠN 11: TẦM NHÌN MỞ RỘNG ĐA BÀI TOÁN ───────────────────────
    {
        "id": "MS_11_01",
        "filename": "motion_11_expansion_vision.mp4",
        "segment": "11_expansion",
        "source": SLIDES_DIR / "slide_09_tam_nhin_mo_rong.png",
        "duration": 8.5,
        "motion": "zoom_in",
        "zoom_scale": 1.10,
        "badge_text": "TẦM NHÌN MỞ RỘNG",
        "badge_color": COLOR_TEAL,
        "headline": "1 LÕI QUẢN TRỊ TÍN HIỆU ➔ MỞ RỘNG ĐA BÀI TOÁN MÔI TRƯỜNG",
        "subtitle": "Bụi công trình ➔ Nước thải ➔ Đốt rơm rạ ➔ Thuốc BVTV ➔ Tiếng ồn",
    },
    {
        "id": "MS_11_02",
        "filename": "motion_11_expansion_roadmap.mp4",
        "segment": "11_expansion",
        "source": SLIDES_DIR / "slide_09_tam_nhin_mo_rong.png",
        "duration": 8.5,
        "motion": "pan_left_right",
        "zoom_scale": 1.15,
        "badge_text": "LỘ TRÌNH 4 GIAI ĐOẠN",
        "badge_color": COLOR_TEAL,
        "headline": "HIỂU ĐÚNG NGƯỜI DÙNG — ĐÚNG DỮ LIỆU — ĐÚNG QUY TRÌNH THỰC ĐỊA",
        "subtitle": "Mở rộng có kiểm chứng từng bước từ mô hình thực nghiệm thành công",
    },

    # ─── CÁC SLIDE BỔ TRỢ TOÀN DIỆN (CHO MASTER TIMELINE) ──────────────────
    {
        "id": "MS_01_01",
        "filename": "motion_01_problem_statement.mp4",
        "segment": "01_hook",
        "source": SLIDES_DIR / "slide_01_van_de_giai_quyet.png",
        "duration": 8.0,
        "motion": "zoom_in",
        "zoom_scale": 1.08,
        "badge_text": "BỐI CẢNH VẤN ĐỀ",
        "badge_color": COLOR_SEAL_RED,
        "headline": "KHOẢNG TRỐNG TRONG QUẢN LÝ THÔNG TIN BỤI CÔNG TRÌNH",
        "subtitle": "Dữ liệu phân tán nhiều nơi • Thiếu thứ tự ưu tiên xử lý",
    },
    {
        "id": "MS_02_01",
        "filename": "motion_02_stakeholders.mp4",
        "segment": "02_problem",
        "source": SLIDES_DIR / "slide_02_nguoi_huong_loi.png",
        "duration": 8.0,
        "motion": "zoom_out",
        "zoom_scale": 1.08,
        "badge_text": "HỆ SINH THÁI ĐỐI TÁC",
        "badge_color": COLOR_TEAL,
        "headline": "KẾT NỐI 4 BÊN: NGƯỜI DÂN - THANH NIÊN - NHÀ THẦU - CHÍNH QUYỀN",
        "subtitle": "Tạo giá trị thực tế cho từng nhóm đối tượng tham gia",
    },
    {
        "id": "MS_07_03",
        "filename": "motion_07_business_model.mp4",
        "segment": "09_metrics",
        "source": SLIDES_DIR / "slide_07_mo_hinh_van_hanh_duy_tri.png",
        "duration": 8.0,
        "motion": "zoom_in",
        "zoom_scale": 1.08,
        "badge_text": "MÔ HÌNH VẬN HÀNH",
        "badge_color": COLOR_TEAL,
        "headline": "DUY TRÌ DỰ ÁN BẰNG NĂNG LỰC TỰ TẠO GIÁ TRỊ",
        "subtitle": "Không phụ thuộc hoàn toàn vào ngân sách tài trợ một lần",
    },
    {
        "id": "MS_10_01",
        "filename": "motion_10_closing_thanks.mp4",
        "segment": "12_closing",
        "source": SLIDES_DIR / "slide_10_tong_ket_loi_cam_on.png",
        "duration": 8.0,
        "motion": "zoom_in",
        "zoom_scale": 1.08,
        "badge_text": "DUSTGUARD VN",
        "badge_color": COLOR_TEAL,
        "headline": "BIẾN DỮ LIỆU THÀNH HÀNH ĐỘNG QUẢN LÝ CÓ THỂ THEO DÕI",
        "subtitle": "Có ưu tiên • Có bằng chứng • Có theo dõi • Cam kết đồng hành vì môi trường",
    },
    {
        "id": "MS_REAL_01",
        "filename": "motion_real_01_construction.mp4",
        "segment": "04_solution",
        "source": REAL_IMAGES_DIR / "construction" / "ChatGPT Image 09_56_50 31 thg 8, 2026 (6).png",
        "duration": 6.0,
        "motion": "zoom_in",
        "zoom_scale": 1.10,
        "badge_text": "HIỆN TRƯỜNG THỰC TẾ",
        "badge_color": COLOR_SEAL_RED,
        "headline": "KHẢO SÁT THỰC ĐỊA TẠI CÁC KHU ĐÔ THỊ ĐANG XÂY DỰNG",
        "subtitle": "Ghi nhận nguồn phát sinh bụi mịn và mức độ ảnh hưởng dân cư",
    },
    {
        "id": "MS_REAL_02",
        "filename": "motion_real_02_project_mockup.mp4",
        "segment": "05_core_logic",
        "source": REAL_IMAGES_DIR / "project" / "ChatGPT Image 09_56_46 31 thg 8, 2026 (1).png",
        "duration": 6.0,
        "motion": "pan_left_right",
        "zoom_scale": 1.12,
        "badge_text": "GIAO DIỆN HỆ THỐNG",
        "badge_color": COLOR_TEAL,
        "headline": "NỀN TẢNG CIVIC TECH TRỰC QUAN — DỄ DÙNG TRÊN THIẾT BỊ DI ĐỘNG",
        "subtitle": "Thao tác đơn giản cho người dân và tình nguyện viên thanh niên",
    },
    {
        "id": "MS_REAL_03",
        "filename": "motion_real_03_vietnam_urban.mp4",
        "segment": "11_expansion",
        "source": REAL_IMAGES_DIR / "vietnam" / "ChatGPT Image 09_56_50 31 thg 8, 2026 (7).png",
        "duration": 6.0,
        "motion": "zoom_out",
        "zoom_scale": 1.10,
        "badge_text": "ĐÔ THỊ XANH VIỆT NAM",
        "badge_color": COLOR_TEAL,
        "headline": "HƯỚNG TỚI MÔI TRƯỜNG ĐÔ THỊ SẠCH VÀ PHÁT TRIỂN BỀN VỮNG",
        "subtitle": "Đồng hành cùng mục tiêu phát triển bền vững của UNICEF & Việt Nam",
    },
]

def create_overlay_image(cfg, fonts, output_path):
    """
    Tạo tấm layer overlay Civic Tech chất lượng cao 1920x1080
    với badge, text card sắc nét, độ tương phản chuẩn.
    """
    im = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    # 1. Vẽ Top-Left Civic Badge
    badge_text = cfg["badge_text"]
    badge_color = cfg.get("badge_color", COLOR_TEAL)
    # Tính kích thước text badge
    bbox = fonts["badge"].getbbox(badge_text)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    bx, by = 60, 48
    bw, bh = tw + 36, 46
    # Vẽ nền badge bo góc nhẹ
    draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=6, fill=(*badge_color, 245))
    # Viền tinh tế
    draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=6, outline=(255, 255, 255, 80), width=1)
    draw.text((bx + 18, by + 10), badge_text, font=fonts["badge"], fill=COLOR_CREAM)

    # 2. Vẽ Bottom Context Card
    card_x = 60
    card_y = 920
    card_w = 1800
    card_h = 110
    
    # Nền card tối sắc nét (không mờ nhòe, tương phản cao trên mọi background)
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=10, fill=COLOR_CARD_BG)
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=10, outline=COLOR_BORDER, width=1)
    
    # Accent vertical bar bên trái card
    accent_bar_w = 8
    draw.rectangle([card_x, card_y + 4, card_x + accent_bar_w, card_y + card_h - 4], fill=badge_color)

    # Headline text
    headline_text = cfg["headline"]
    draw.text((card_x + 28, card_y + 18), headline_text, font=fonts["headline"], fill=COLOR_CREAM)

    # Subtitle text
    subtitle_text = cfg["subtitle"]
    draw.text((card_x + 28, card_y + 64), subtitle_text, font=fonts["subtitle"], fill=(210, 205, 195, 255))

    im.save(output_path, "PNG")
    return output_path

def build_motion_filter(motion_type, duration, zoom_scale=1.10):
    """
    Xây dựng biểu thức FFmpeg filter mượt mà không bị jitter.
    """
    d = duration
    z = zoom_scale

    if motion_type == "zoom_in":
        # Zoom in từ 1.0 đến z, căn giữa
        bg_filter = (
            f"scale=1920*{z:.3f}:1080*{z:.3f}:eval=init,"
            f"scale=w='1920*(1.0 + {z-1.0:.3f}*t/{d:.2f})':h='1080*(1.0 + {z-1.0:.3f}*t/{d:.2f})':eval=frame,"
            f"crop=1920:1080:(in_w-1920)/2:(in_h-1080)/2"
        )
    elif motion_type == "zoom_out":
        # Zoom out từ z xuống 1.0, căn giữa
        bg_filter = (
            f"scale=1920*{z:.3f}:1080*{z:.3f}:eval=init,"
            f"scale=w='1920*({z:.3f} - {z-1.0:.3f}*t/{d:.2f})':h='1080*({z:.3f} - {z-1.0:.3f}*t/{d:.2f})':eval=frame,"
            f"crop=1920:1080:(in_w-1920)/2:(in_h-1080)/2"
        )
    elif motion_type == "pan_left_right":
        # Scale rộng hơn chiều ngang 15%, pan từ trái sang phải
        bg_filter = (
            f"scale=1920*{z:.3f}:1080:eval=init,"
            f"crop=1920:1080:'(in_w-1920)*(t/{d:.2f})':0"
        )
    elif motion_type == "pan_right_left":
        # Pan từ phải sang trái
        bg_filter = (
            f"scale=1920*{z:.3f}:1080:eval=init,"
            f"crop=1920:1080:'(in_w-1920)*(1.0 - t/{d:.2f})':0"
        )
    elif motion_type == "zoom_in_pan":
        # Vừa zoom nhẹ vừa pan từ trái qua phải
        bg_filter = (
            f"scale=1920*{z:.3f}:1080*{z:.3f}:eval=init,"
            f"scale=w='1920*(1.02 + {z-1.02:.3f}*t/{d:.2f})':h='1080*(1.02 + {z-1.02:.3f}*t/{d:.2f})':eval=frame,"
            f"crop=1920:1080:'(in_w-1920)*(0.2 + 0.6*t/{d:.2f})':(in_h-1080)/2"
        )
    else:
        # Static scale to 1080p
        bg_filter = "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"

    return bg_filter

def render_motion_clip(cfg, fonts):
    """
    Render một clip motion slide đơn lẻ bằng FFmpeg.
    """
    out_file = OUTPUT_DIR / cfg["filename"]
    overlay_file = TEMP_DIR / f"ov_{cfg['id']}.png"

    # 1. Tạo overlay PNG
    create_overlay_image(cfg, fonts, overlay_file)

    # 2. Xây dựng filter graph
    d = cfg["duration"]
    z = cfg.get("zoom_scale", 1.10)
    motion_type = cfg["motion"]
    bg_filter = build_motion_filter(motion_type, d, z)

    # Filter graph hoàn chỉnh:
    # [0:v] Ken Burns -> [bg]
    # [1:v] Fade in ở 0.3s, fade out ở d-0.4s -> [ov]
    # [bg][ov] overlay -> [comp]
    # [comp] Fade in 0.3s, Fade out 0.3s -> [v_out]
    filter_complex = (
        f"[0:v]{bg_filter}[bg];"
        f"[1:v]fade=t=in:st=0.3:d=0.4:alpha=1,fade=t=out:st={d-0.4:.2f}:d=0.3:alpha=1[ov];"
        f"[bg][ov]overlay=0:0[comp];"
        f"[comp]fade=t=in:st=0:d=0.25,fade=t=out:st={d-0.25:.2f}:d=0.25,format=yuv420p[v_out]"
    )

    source_path = str(cfg["source"])
    if not os.path.exists(source_path):
        print(f"❌ [LỖI] Không tìm thấy source file: {source_path}")
        return False

    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-t", str(d), "-i", source_path,
        "-loop", "1", "-t", str(d), "-i", str(overlay_file),
        "-filter_complex", filter_complex,
        "-map", "[v_out]",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "18",
        "-r", "25",
        "-pix_fmt", "yuv420p",
        str(out_file)
    ]

    print(f"🎬 Đang render: {cfg['filename']} ({cfg['id']} | {d}s | {motion_type})...")
    start_t = time.time()
    res = subprocess.run(cmd, capture_output=True, text=True)
    elapsed = time.time() - start_t

    if res.returncode == 0:
        file_size_mb = os.path.getsize(out_file) / (1024 * 1024)
        print(f"✅ Hoàn thành: {cfg['filename']} ({file_size_mb:.2f} MB in {elapsed:.1f}s)")
        return True
    else:
        print(f"❌ Thất bại: {cfg['filename']}\n{res.stderr}")
        return False

def main():
    print("=" * 70)
    print("🚀 DUSTGUARD VN — MOTION SLIDES & GRAPHICS BUILDER")
    print("=" * 70)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    TEMP_DIR.mkdir(parents=True, exist_ok=True)

    fonts = get_fonts()
    manifest_items = []
    success_count = 0

    total_clips = len(MOTION_SLIDES_CONFIG)
    print(f"📋 Tổng số Motion Slide clips cần xử lý: {total_clips}\n")

    for idx, cfg in enumerate(MOTION_SLIDES_CONFIG, 1):
        print(f"[{idx}/{total_clips}] ", end="")
        ok = render_motion_clip(cfg, fonts)
        if ok:
            success_count += 1
            out_file = OUTPUT_DIR / cfg["filename"]
            manifest_items.append({
                "id": cfg["id"],
                "filename": cfg["filename"],
                "segment": cfg["segment"],
                "duration": cfg["duration"],
                "motion": cfg["motion"],
                "source_file": str(cfg["source"].relative_to(BASE_DIR)).replace("\\", "/"),
                "output_path": str(out_file.relative_to(BASE_DIR)).replace("\\", "/"),
                "file_size_bytes": os.path.getsize(out_file),
                "resolution": "1920x1080",
                "fps": 25,
                "badge_text": cfg["badge_text"],
                "headline": cfg["headline"],
                "subtitle": cfg["subtitle"],
            })

    # Dọn dẹp temp overlays
    for f in TEMP_DIR.glob("*.png"):
        try:
            f.unlink()
        except Exception:
            pass
    try:
        TEMP_DIR.rmdir()
    except Exception:
        pass

    # Xuất manifest JSON
    manifest_data = {
        "project": "DustGuard VN",
        "description": "Motion Graphics & Slide Clips for 3m30 Master Video",
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_clips": len(manifest_items),
        "total_duration_seconds": sum(item["duration"] for item in manifest_items),
        "clips": manifest_items
    }

    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 70)
    print(f"🎉 KẾT QUẢ: Render thành công {success_count}/{total_clips} clips!")
    print(f"📄 Manifest đã lưu tại: {MANIFEST_PATH.relative_to(BASE_DIR)}")
    print(f"📁 Thư mục xuất clip: {OUTPUT_DIR.relative_to(BASE_DIR)}")
    print("=" * 70)

if __name__ == "__main__":
    main()
