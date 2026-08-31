#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
DustGuard VN — Subtitle & Typography Timing Generator (02_build_subtitles.py)
=============================================================================
Tác vụ:
1. Sinh file phụ đề chuẩn Civic Tech cho video thuyết trình DustGuard VN (210s).
2. Xuất 4 định dạng:
   - presentation/01_script/subtitles/final.srt (SubRip)
   - presentation/01_script/subtitles/final.ass (Advanced SubStation Alpha)
   - presentation/01_script/subtitles/final.vtt (WebVTT)
   - presentation/01_script/subtitles/subtitles_data.json (JSON Metadata)
3. Quy chuẩn Typography & Timing:
   - Tối đa 38 ký tự/dòng, tối đa 2 dòng/cue.
   - Ngắt dòng theo ngữ nghĩa tự nhiên.
   - Vị trí hiển thị: Bottom Margin 80px (chuẩn 1080p an toàn).
   - Font: Inter / Roboto / Arial.
   - Màu chữ: Trắng sáng &H00FFFFFF&, viền đậm sắc nét &H00141B23& (Civic Ink).
   - Nổi bật từ khóa trọng tâm: DUSTGUARD VN, BẰNG CHỨNG, THEO DÕI, AI HỖ TRỢ, PILOT 4-8 TUẦN...
=============================================================================
"""

import os
import sys
import json
import re
from pathlib import Path

# Đảm bảo in UTF-8 trơn tru trên Windows PowerShell
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Thư mục gốc dự án
BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "01_script" / "subtitles"

# Định nghĩa bảng 12 phân đoạn và các Cues chi tiết (Khớp 100% Master Voiceover 210s)
SUBTITLE_CUES = [
    # -------------------------------------------------------------------------
    # SEGMENT 01: [01_hook] 0:00 - 0:18 (18s) | Mở vấn đề
    # -------------------------------------------------------------------------
    {
        "segment_id": "01_hook",
        "start": 0.500,
        "end": 5.200,
        "lines": [
            "Ở một thành phố đang phát triển,",
            "những công trường mới đồng nghĩa"
        ],
        "keywords": ["thành phố đang phát triển", "công trường mới"]
    },
    {
        "segment_id": "01_hook",
        "start": 5.200,
        "end": 9.500,
        "lines": [
            "với những con đường mới,",
            "những ngôi nhà mới và cơ hội mới."
        ],
        "keywords": ["con đường mới", "ngôi nhà mới", "cơ hội mới"]
    },
    {
        "segment_id": "01_hook",
        "start": 9.800,
        "end": 14.200,
        "lines": [
            "Nhưng cùng với sự phát triển đó,",
            "có tác động rất dễ bị xem là nhỏ..."
        ],
        "keywords": ["sự phát triển", "tác động"]
    },
    {
        "segment_id": "01_hook",
        "start": 14.300,
        "end": 18.000,
        "lines": [
            "cho đến khi nó trở thành vấn đề",
            "của cả cộng đồng: BỤI CÔNG TRÌNH."
        ],
        "keywords": ["cả cộng đồng", "BỤI CÔNG TRÌNH"]
    },

    # -------------------------------------------------------------------------
    # SEGMENT 02: [02_problem] 0:18 - 0:38 (20s) | Nút thắt dữ liệu phân tán
    # -------------------------------------------------------------------------
    {
        "segment_id": "02_problem",
        "start": 18.300,
        "end": 23.000,
        "lines": [
            "Điều chúng tôi nhận ra là:",
            "vấn đề không phải ta thiếu dữ liệu."
        ],
        "keywords": ["không phải ta thiếu dữ liệu"]
    },
    {
        "segment_id": "02_problem",
        "start": 23.200,
        "end": 28.000,
        "lines": [
            "Người dân có phản ánh. Có hình ảnh.",
            "Có vị trí. Có thông tin công trình."
        ],
        "keywords": ["phản ánh", "hình ảnh", "vị trí", "thông tin công trình"]
    },
    {
        "segment_id": "02_problem",
        "start": 28.200,
        "end": 32.800,
        "lines": [
            "Có hồ sơ kiểm tra. Và tương lai",
            "còn có dữ liệu từ cảm biến."
        ],
        "keywords": ["hồ sơ kiểm tra", "dữ liệu từ cảm biến"]
    },
    {
        "segment_id": "02_problem",
        "start": 33.000,
        "end": 37.800,
        "lines": [
            "Nhưng thông tin nằm ở nhiều nơi,",
            "khiến việc ưu tiên hành động rất khó."
        ],
        "keywords": ["thông tin nằm ở nhiều nơi", "ưu tiên hành động"]
    },

    # -------------------------------------------------------------------------
    # SEGMENT 03: [03_context] 0:38 - 0:55 (17s) | 5 Câu hỏi trung tâm
    # -------------------------------------------------------------------------
    {
        "segment_id": "03_context",
        "start": 38.200,
        "end": 42.500,
        "lines": [
            "Nếu cùng lúc có mười phản ánh,",
            "ta nên nhìn trường hợp nào trước?"
        ],
        "keywords": ["mười phản ánh", "trường hợp nào trước"]
    },
    {
        "segment_id": "03_context",
        "start": 42.600,
        "end": 46.500,
        "lines": [
            "Vì sao trường hợp đó đáng chú ý?",
            "Hồ sơ còn đang thiếu những gì?"
        ],
        "keywords": ["đáng chú ý", "Hồ sơ còn thiếu gì"]
    },
    {
        "segment_id": "03_context",
        "start": 46.700,
        "end": 50.500,
        "lines": [
            "Ai là người đang phụ trách?",
            "Và sau khi một phản ánh gửi đi..."
        ],
        "keywords": ["Ai đang phụ trách", "phản ánh gửi đi"]
    },
    {
        "segment_id": "03_context",
        "start": 50.600,
        "end": 54.800,
        "lines": [
            "...nó đã thực sự đi đến đâu?",
            "Đó là khoảng trống cần giải quyết."
        ],
        "keywords": ["thực sự đi đến đâu", "khoảng trống"]
    },

    # -------------------------------------------------------------------------
    # SEGMENT 04: [04_solution] 0:55 - 1:10 (15s) | DustGuard xuất hiện (Beat Drop)
    # -------------------------------------------------------------------------
    {
        "segment_id": "04_solution",
        "start": 55.200,
        "end": 59.500,
        "lines": [
            "DUSTGUARD VN được xây dựng",
            "để trả lời những câu hỏi đó."
        ],
        "keywords": ["DUSTGUARD VN", "trả lời những câu hỏi"]
    },
    {
        "segment_id": "04_solution",
        "start": 59.700,
        "end": 64.000,
        "lines": [
            "Không phải bằng cách",
            "thay thế người ra quyết định."
        ],
        "keywords": ["Không thay thế người ra quyết định"]
    },
    {
        "segment_id": "04_solution",
        "start": 64.200,
        "end": 69.800,
        "lines": [
            "Mà bằng cách kết nối TÍN HIỆU,",
            "BẰNG CHỨNG, ƯU TIÊN và THEO DÕI."
        ],
        "keywords": ["TÍN HIỆU", "BẰNG CHỨNG", "ƯU TIÊN", "THEO DÕI"]
    },

    # -------------------------------------------------------------------------
    # SEGMENT 05: [05_core_logic] 1:10 - 1:30 (20s) | Tính mới của giải pháp
    # -------------------------------------------------------------------------
    {
        "segment_id": "05_core_logic",
        "start": 70.300,
        "end": 74.800,
        "lines": [
            "Điểm mới của DUSTGUARD không phải",
            "tạo thêm một nơi để gửi phản ánh."
        ],
        "keywords": ["DUSTGUARD", "gửi phản ánh"]
    },
    {
        "segment_id": "05_core_logic",
        "start": 75.000,
        "end": 79.500,
        "lines": [
            "Chúng tôi giải quyết khoảng trống",
            "sau khi phản ánh đã được gửi."
        ],
        "keywords": ["khoảng trống sau khi gửi"]
    },
    {
        "segment_id": "05_core_logic",
        "start": 79.700,
        "end": 84.500,
        "lines": [
            "Một tín hiệu phải thành HỒ SƠ.",
            "Một hồ sơ phải có BẰNG CHỨNG."
        ],
        "keywords": ["HỒ SƠ", "BẰNG CHỨNG"]
    },
    {
        "segment_id": "05_core_logic",
        "start": 84.700,
        "end": 89.800,
        "lines": [
            "Một trường hợp phải có MỨC ƯU TIÊN.",
            "Và phải biết nó đang xử lý tới đâu."
        ],
        "keywords": ["MỨC ƯU TIÊN", "xử lý tới đâu"]
    },

    # -------------------------------------------------------------------------
    # SEGMENT 06: [06_workshop_lesson] 1:30 - 1:49 (19s) | Bài học sau tập huấn
    # -------------------------------------------------------------------------
    {
        "segment_id": "06_workshop_lesson",
        "start": 90.300,
        "end": 94.800,
        "lines": [
            "Nhưng DUSTGUARD hôm nay",
            "không còn giống phiên bản ban đầu."
        ],
        "keywords": ["DUSTGUARD hôm nay", "phiên bản ban đầu"]
    },
    {
        "segment_id": "06_workshop_lesson",
        "start": 95.000,
        "end": 99.800,
        "lines": [
            "Hệ thống thông minh không nên cố",
            "ra nhiều quyết định hơn con người."
        ],
        "keywords": ["hệ thống thông minh", "con người"]
    },
    {
        "segment_id": "06_workshop_lesson",
        "start": 100.000,
        "end": 104.500,
        "lines": [
            "Nó phải giúp con người có đủ thông tin",
            "để đưa ra quyết định tốt hơn."
        ],
        "keywords": ["đủ thông tin", "quyết định tốt hơn"]
    },
    {
        "segment_id": "06_workshop_lesson",
        "start": 104.700,
        "end": 108.800,
        "lines": [
            "Chúng tôi thay đổi cách nhìn về AI,",
            "về điểm rủi ro và cả vai trò IoT."
        ],
        "keywords": ["cách nhìn về AI", "điểm rủi ro", "vai trò IoT"]
    },

    # -------------------------------------------------------------------------
    # SEGMENT 07: [07_responsible_ai] 1:49 - 2:08 (19s) | AI đúng vai trò
    # -------------------------------------------------------------------------
    {
        "segment_id": "07_responsible_ai",
        "start": 109.300,
        "end": 113.800,
        "lines": [
            "DUST RISK SCORE không trả lời rằng",
            "một công trình có vi phạm hay không."
        ],
        "keywords": ["DUST RISK SCORE", "không kết luận vi phạm"]
    },
    {
        "segment_id": "07_responsible_ai",
        "start": 114.000,
        "end": 118.800,
        "lines": [
            "Nó chỉ hỗ trợ: trường hợp nào",
            "nên được xem xét trước, và vì sao?"
        ],
        "keywords": ["xem xét trước", "vì sao"]
    },
    {
        "segment_id": "07_responsible_ai",
        "start": 119.000,
        "end": 123.500,
        "lines": [
            "AI HỖ TRỢ phân loại, tóm tắt,",
            "tìm thiếu sót và gợi ý checklist."
        ],
        "keywords": ["AI HỖ TRỢ", "phân loại", "tóm tắt", "checklist"]
    },
    {
        "segment_id": "07_responsible_ai",
        "start": 123.700,
        "end": 127.800,
        "lines": [
            "AI không tự phạt, không kết luận,",
            "không thay thế cơ quan thẩm quyền."
        ],
        "keywords": ["không tự phạt", "không thay thế"]
    },

    # -------------------------------------------------------------------------
    # SEGMENT 08: [08_lean_pilot] 2:08 - 2:28 (20s) | Mô hình Lean Pilot
    # -------------------------------------------------------------------------
    {
        "segment_id": "08_lean_pilot",
        "start": 128.300,
        "end": 133.000,
        "lines": [
            "Giải pháp môi trường không nên",
            "bắt đầu bằng hạ tầng quá cồng kềnh."
        ],
        "keywords": ["Giải pháp môi trường", "hạ tầng"]
    },
    {
        "segment_id": "08_lean_pilot",
        "start": 133.200,
        "end": 138.000,
        "lines": [
            "DUSTGUARD bắt đầu với dữ liệu sẵn có:",
            "phản ánh, hình ảnh, vị trí, hồ sơ."
        ],
        "keywords": ["DUSTGUARD", "dữ liệu sẵn có", "hồ sơ"]
    },
    {
        "segment_id": "08_lean_pilot",
        "start": 138.200,
        "end": 142.800,
        "lines": [
            "Mô hình PILOT 4-8 TUẦN triển khai",
            "tại trường học, CLB môi trường."
        ],
        "keywords": ["PILOT 4-8 TUẦN", "CLB môi trường"]
    },
    {
        "segment_id": "08_lean_pilot",
        "start": 143.000,
        "end": 147.800,
        "lines": [
            "Với 20 đến 30 người dùng thật,",
            "cùng những chỉ số có thể đo lường."
        ],
        "keywords": ["20 đến 30 người dùng thật", "đo lường"]
    },

    # -------------------------------------------------------------------------
    # SEGMENT 09: [09_metrics] 2:28 - 2:45 (17s) | Đo lường giá trị thật
    # -------------------------------------------------------------------------
    {
        "segment_id": "09_metrics",
        "start": 148.300,
        "end": 152.200,
        "lines": [
            "Bao nhiêu ca có đủ BẰNG CHỨNG?",
            "Thời gian từ phát hiện đến xử lý?"
        ],
        "keywords": ["BẰNG CHỨNG", "phát hiện đến xử lý"]
    },
    {
        "segment_id": "09_metrics",
        "start": 152.400,
        "end": 156.500,
        "lines": [
            "Bao nhiêu trường hợp thực sự",
            "có bước hành động tiếp theo?"
        ],
        "keywords": ["hành động tiếp theo"]
    },
    {
        "segment_id": "09_metrics",
        "start": 156.700,
        "end": 161.000,
        "lines": [
            "Bao nhiêu vụ việc được THEO DÕI",
            "từ lúc xuất hiện đến khi có kết quả?"
        ],
        "keywords": ["THEO DÕI", "có kết quả"]
    },
    {
        "segment_id": "09_metrics",
        "start": 161.200,
        "end": 164.800,
        "lines": [
            "Đó là những con số thực tế",
            "chứng minh giá trị của DUSTGUARD."
        ],
        "keywords": ["con số thực tế", "DUSTGUARD"]
    },

    # -------------------------------------------------------------------------
    # SEGMENT 10: [10_community] 2:45 - 3:00 (15s) | Vai trò cộng đồng & Thanh niên
    # -------------------------------------------------------------------------
    {
        "segment_id": "10_community",
        "start": 165.300,
        "end": 169.800,
        "lines": [
            "DUSTGUARD không chỉ dành cho quản lý,",
            "mà bắt đầu từ cộng đồng có động lực:"
        ],
        "keywords": ["DUSTGUARD", "cộng đồng có động lực"]
    },
    {
        "segment_id": "10_community",
        "start": 170.000,
        "end": 174.500,
        "lines": [
            "trường học, câu lạc bộ môi trường,",
            "tổ chức thanh niên và người trẻ."
        ],
        "keywords": ["trường học", "câu lạc bộ môi trường", "thanh niên", "người trẻ"]
    },
    {
        "segment_id": "10_community",
        "start": 174.700,
        "end": 179.800,
        "lines": [
            "Để họ ghi nhận tốt hơn, THEO DÕI",
            "lâu hơn và không để vấn đề bị bỏ quên."
        ],
        "keywords": ["ghi nhận tốt hơn", "THEO DÕI", "không bị bỏ quên"]
    },

    # -------------------------------------------------------------------------
    # SEGMENT 11: [11_expansion] 3:00 - 3:17 (17s) | Tầm nhìn mở rộng
    # -------------------------------------------------------------------------
    {
        "segment_id": "11_expansion",
        "start": 180.300,
        "end": 185.000,
        "lines": [
            "Cùng một lõi hệ thống có thể mở rộng",
            "cho nhiều vấn đề môi trường khác:"
        ],
        "keywords": ["lõi hệ thống", "mở rộng"]
    },
    {
        "segment_id": "11_expansion",
        "start": 185.200,
        "end": 189.500,
        "lines": [
            "Nước thải. Đốt rơm rạ.",
            "Thuốc bảo vệ thực vật. Tiếng ồn."
        ],
        "keywords": ["Nước thải", "Đốt rơm rạ", "Thuốc bảo vệ thực vật", "Tiếng ồn"]
    },
    {
        "segment_id": "11_expansion",
        "start": 189.700,
        "end": 196.800,
        "lines": [
            "Mỗi bước mở rộng đều bắt đầu từ việc",
            "hiểu đúng người dùng và quy trình."
        ],
        "keywords": ["hiểu đúng người dùng", "quy trình"]
    },

    # -------------------------------------------------------------------------
    # SEGMENT 12: [12_closing] 3:17 - 3:30 (13s) | Kết mạnh & Slogan
    # -------------------------------------------------------------------------
    {
        "segment_id": "12_closing",
        "start": 197.300,
        "end": 201.200,
        "lines": [
            "DUSTGUARD không thay thế con người,",
            "mà giúp vấn đề nhìn thấy rõ hơn."
        ],
        "keywords": ["DUSTGUARD", "không thay thế con người", "nhìn thấy rõ hơn"]
    },
    {
        "segment_id": "12_closing",
        "start": 201.400,
        "end": 205.500,
        "lines": [
            "Ghi nhận đầy đủ, THEO DÕI lâu hơn,",
            "từ tín hiệu đến HÀNH ĐỘNG THỰC SỰ."
        ],
        "keywords": ["Ghi nhận đầy đủ", "THEO DÕI lâu hơn", "HÀNH ĐỘNG THỰC SỰ"]
    },
    {
        "segment_id": "12_closing",
        "start": 205.700,
        "end": 210.000,
        "lines": [
            "DUSTGUARD VN — CÓ ƯU TIÊN,",
            "CÓ BẰNG CHỨNG VÀ CÓ THEO DÕI."
        ],
        "keywords": ["DUSTGUARD VN", "CÓ ƯU TIÊN", "CÓ BẰNG CHỨNG", "CÓ THEO DÕI"]
    }
]


# =============================================================================
# CÁC HÀM FORMAT THỜI GIAN
# =============================================================================

def sec_to_srt_time(seconds: float) -> str:
    """Format giây thành timestamp chuẩn SRT (HH:MM:SS,mmm)."""
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int(round((seconds - int(seconds)) * 1000))
    if millis >= 1000:
        secs += 1
        millis -= 1000
    return f"{hrs:02d}:{mins:02d}:{secs:02d},{millis:03d}"


def sec_to_vtt_time(seconds: float) -> str:
    """Format giây thành timestamp chuẩn WebVTT (HH:MM:SS.mmm)."""
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int(round((seconds - int(seconds)) * 1000))
    if millis >= 1000:
        secs += 1
        millis -= 1000
    return f"{hrs:02d}:{mins:02d}:{secs:02d}.{millis:03d}"


def sec_to_ass_time(seconds: float) -> str:
    """Format giây thành timestamp chuẩn ASS (H:MM:SS.cc)."""
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    centis = int(round((seconds - int(seconds)) * 100))
    if centis >= 100:
        secs += 1
        centis -= 100
    return f"{hrs}:{mins:02d}:{secs:02d}.{centis:02d}"


# =============================================================================
# TRÌNH SINH CÁC ĐỊNH DẠNG PHỤ ĐỀ
# =============================================================================

def generate_srt(cues) -> str:
    """Sinh nội dung file SubRip (.srt)."""
    blocks = []
    for idx, cue in enumerate(cues, 1):
        start_str = sec_to_srt_time(cue["start"])
        end_str = sec_to_srt_time(cue["end"])
        text = "\n".join(cue["lines"])
        blocks.append(f"{idx}\n{start_str} --> {end_str}\n{text}\n")
    return "\n".join(blocks).strip() + "\n"


def generate_vtt(cues) -> str:
    """Sinh nội dung file WebVTT (.vtt)."""
    lines = ["WEBVTT", "Kind: captions", "Language: vi", ""]
    for idx, cue in enumerate(cues, 1):
        start_str = sec_to_vtt_time(cue["start"])
        end_str = sec_to_vtt_time(cue["end"])
        text = "\n".join(cue["lines"])
        lines.append(f"{idx}")
        lines.append(f"{start_str} --> {end_str}")
        lines.append(text)
        lines.append("")
    return "\n".join(lines).strip() + "\n"


def format_ass_text_with_highlights(lines, keywords) -> str:
    """Áp dụng màu highlight và bold cho keywords trong định dạng ASS."""
    # Civic Tech Palette for ASS:
    # Primary: White (&H00FFFFFF&)
    # Keyword Highlight: Vibrant Amber-Teal (&H003DB7A6& / &H0016B4E0&)
    HIGHLIGHT_TAG_START = r"{\c&H003DB7A6\b1}"
    HIGHLIGHT_TAG_END = r"{\r}"

    formatted_lines = []
    for line in lines:
        curr_line = line
        # Sắp xếp keywords theo độ dài giảm dần để tránh conflict substring
        sorted_kw = sorted(keywords, key=len, reverse=True)
        for kw in sorted_kw:
            # Case-insensitive replacement giữ nguyên casing gốc
            pattern = re.compile(re.escape(kw), re.IGNORECASE)
            curr_line = pattern.sub(lambda m: f"{HIGHLIGHT_TAG_START}{m.group(0)}{HIGHLIGHT_TAG_END}", curr_line)
        formatted_lines.append(curr_line)
    
    return r"\N".join(formatted_lines)


def generate_ass(cues) -> str:
    """Sinh nội dung file Advanced SubStation Alpha (.ass) chuẩn Civic Tech."""
    header = """[Script Info]
; Script generated by DustGuard VN Subtitle & Typography Timing Engineer
Title: DustGuard VN Pitch Presentation Subtitles
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.709
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: CivicDefault,Inter,44,&H00FFFFFF,&H000000FF,&H00141B23,&H80000000,-1,0,0,0,100,100,0.5,0,1,3.2,1.5,2,48,48,80,1
Style: CivicBanner,Inter,50,&H004ED9C2,&H000000FF,&H00141B23,&HA0000000,-1,0,0,0,100,100,1.0,0,1,3.5,2.0,2,48,48,80,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    events = []
    for cue in cues:
        start_str = sec_to_ass_time(cue["start"])
        end_str = sec_to_ass_time(cue["end"])
        formatted_text = format_ass_text_with_highlights(cue["lines"], cue.get("keywords", []))
        events.append(f"Dialogue: 0,{start_str},{end_str},CivicDefault,,0,0,0,,{formatted_text}")

    return header + "\n".join(events) + "\n"


def generate_json_metadata(cues) -> str:
    """Sinh file JSON metadata có cấu trúc để phục vụ tự động hóa render video."""
    data = {
        "project": "DustGuard VN",
        "title": "Pitch Presentation Subtitles",
        "total_duration_sec": 210.0,
        "total_cues": len(cues),
        "styles": {
            "font_family": "Inter, Roboto, Arial, sans-serif",
            "font_size_px": 44,
            "color": "#FFFFFF",
            "outline_color": "#231B14",
            "outline_width_px": 3.2,
            "margin_bottom_px": 80,
            "highlight_color": "#0d6f64",
            "max_chars_per_line": 38,
            "max_lines": 2
        },
        "cues": []
    }

    for idx, cue in enumerate(cues, 1):
        full_text = " ".join(cue["lines"])
        duration = round(cue["end"] - cue["start"], 3)
        char_count = len(full_text)
        cps = round(char_count / duration, 2) if duration > 0 else 0.0

        cue_meta = {
            "index": idx,
            "segment_id": cue["segment_id"],
            "start_sec": cue["start"],
            "end_sec": cue["end"],
            "duration_sec": duration,
            "start_time_srt": sec_to_srt_time(cue["start"]),
            "end_time_srt": sec_to_srt_time(cue["end"]),
            "lines": cue["lines"],
            "full_text": full_text,
            "char_count": char_count,
            "cps": cps,
            "keywords": cue.get("keywords", [])
        }
        data["cues"].append(cue_meta)

    return json.dumps(data, ensure_ascii=False, indent=2)


# =============================================================================
# KIỂM ĐỊNH CHẤT LƯỢNG (QUALITY ASSURANCE & AUDIT RULES)
# =============================================================================

def run_qa_audit(cues):
    """Kiểm tra toàn diện các chỉ số kỹ thuật của phụ đề."""
    print("=" * 70)
    print("🔍 BẮT ĐẦU AUDIT CHẤT LƯỢNG SUBTITLE & TYPOGRAPHY CHO DUSTGUARD VN")
    print("=" * 70)

    errors = []
    warnings = []
    max_line_len = 0
    max_line_str = ""
    total_chars = 0
    total_dur = 0.0

    for idx, cue in enumerate(cues, 1):
        dur = cue["end"] - cue["start"]
        total_dur += dur
        
        # Kiểm tra số dòng
        if len(cue["lines"]) > 2:
            errors.append(f"Cue #{idx} ({cue['segment_id']}): Vượt quá 2 dòng ({len(cue['lines'])} dòng).")
        
        # Kiểm tra độ dài từng dòng (<= 38 ký tự)
        for line_idx, line in enumerate(cue["lines"], 1):
            length = len(line)
            total_chars += length
            if length > max_line_len:
                max_line_len = length
                max_line_str = line
            if length > 38:
                errors.append(f"Cue #{idx} Line {line_idx} ({cue['segment_id']}): Quá dài ({length} > 38 ký tự): '{line}'")

        # Kiểm tra thời gian
        if cue["start"] >= cue["end"]:
            errors.append(f"Cue #{idx} ({cue['segment_id']}): start ({cue['start']}) >= end ({cue['end']}).")

        # Kiểm tra overlap với cue trước
        if idx > 1:
            prev_cue = cues[idx - 2]
            if cue["start"] < prev_cue["end"] - 0.001:
                warnings.append(f"Cue #{idx} bắt đầu ({cue['start']}) trước khi Cue #{idx-1} kết thúc ({prev_cue['end']}).")

        # Kiểm tra CPS (Characters Per Second)
        full_text = " ".join(cue["lines"])
        cps = len(full_text) / dur if dur > 0 else 0
        if cps > 22:
            warnings.append(f"Cue #{idx} ({cue['segment_id']}): CPS hơi cao ({cps:.1f} ký tự/s).")
        elif cps < 6:
            warnings.append(f"Cue #{idx} ({cue['segment_id']}): CPS hơi thấp ({cps:.1f} ký tự/s).")

    print(f"📊 TỔNG QUAN:")
    print(f"  • Tổng số Cue: {len(cues)}")
    print(f"  • Tổng thời lượng video: {cues[-1]['end']:.2f}s (chuẩn 210.0s / 3m30s)")
    print(f"  • Ký tự dài nhất trên 1 dòng: {max_line_len}/38 ký tự")
    print(f"    ➔ Trích đoạn dài nhất: '{max_line_str}'")
    print(f"  • Tốc độ đọc trung bình: {total_chars / 210.0:.2f} chars/sec (Lý tưởng cho voiceover tiếng Việt 1.06x)")

    if errors:
        print(f"\n❌ PHÁT HIỆN {len(errors)} LỖI NGHIÊM TRỌNG:")
        for err in errors:
            print(f"   - {err}")
        raise ValueError("Subtitle QA Audit Thất Bại! Vui lòng khắc phục các lỗi trên.")
    else:
        print("\n✅ 100% CÁC DÒNG ĐẠT CHUẨN: Tối đa <= 38 ký tự/dòng, tối đa 2 dòng/cue.")

    if warnings:
        print(f"\n⚠️ CẢNH BÁO NHẸ ({len(warnings)}):")
        for w in warnings[:5]:
            print(f"   - {w}")
    else:
        print("✅ Timing hoàn toàn mượt mà, không overlap.")


# =============================================================================
# MAIN RUNNER
# =============================================================================

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Chạy QA Audit
    run_qa_audit(SUBTITLE_CUES)

    # 2. Sinh nội dung các file
    srt_content = generate_srt(SUBTITLE_CUES)
    ass_content = generate_ass(SUBTITLE_CUES)
    vtt_content = generate_vtt(SUBTITLE_CUES)
    json_content = generate_json_metadata(SUBTITLE_CUES)

    # 3. Ghi file
    srt_path = OUTPUT_DIR / "final.srt"
    ass_path = OUTPUT_DIR / "final.ass"
    vtt_path = OUTPUT_DIR / "final.vtt"
    json_path = OUTPUT_DIR / "subtitles_data.json"

    with open(srt_path, "w", encoding="utf-8") as f:
        f.write(srt_content)
    with open(ass_path, "w", encoding="utf-8") as f:
        f.write(ass_content)
    with open(vtt_path, "w", encoding="utf-8") as f:
        f.write(vtt_content)
    with open(json_path, "w", encoding="utf-8") as f:
        f.write(json_content)

    print("\n" + "=" * 70)
    print("✨ XUẤT FILE PHỤ ĐỀ THÀNH CÔNG:")
    print(f"  1. SRT : {srt_path} ({os.path.getsize(srt_path)} bytes)")
    print(f"  2. ASS : {ass_path} ({os.path.getsize(ass_path)} bytes)")
    print(f"  3. VTT : {vtt_path} ({os.path.getsize(vtt_path)} bytes)")
    print(f"  4. JSON: {json_path} ({os.path.getsize(json_path)} bytes)")
    print("=" * 70)


if __name__ == "__main__":
    main()
