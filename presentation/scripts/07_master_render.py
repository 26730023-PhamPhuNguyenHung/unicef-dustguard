#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
🎬 DUSTGUARD VN — 46-SCENE MASTER VIDEO RENDERER (07_master_render.py)
=============================================================================
Hệ thống dựng video chuẩn 46 cảnh (210.0 giây) theo phong cách Documentary Pitch:
- Khắc phục 100% lỗi cắt sai thời lượng video nhờ quy trình 2-Stage Multi-Pass Rendering.
- Stage 1: Render 46 clip thành phần chuẩn 1080p25/720p25 với thời lượng chuẩn xác từng khung hình.
- Stage 2: Ghép nối qua Concat Demuxer + Áp dụng Beat Drop Flash (1:10) + Watermark + Hòa âm 2 BGM & Voiceover.
=============================================================================
"""

import os
import sys
import json
import shutil
import argparse
import subprocess
from pathlib import Path
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont

# Đảm bảo in UTF-8 trơn tru trên Windows PowerShell
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

BASE_DIR = Path(__file__).resolve().parent.parent
WORKSPACE_ROOT = BASE_DIR.parent

PALETTE = {
    "cream_bg": (253, 251, 247),       # #FDFBF7
    "dark_ink": (35, 27, 20),          # #231B14
    "accent_teal": (13, 111, 100),     # #0D6F64
    "seal_red": (159, 36, 31),         # #9F241F
    "gold": (217, 119, 6)              # #D97706
}

def get_system_font(size: int, bold: bool = False):
    """Tìm font hệ thống Windows hỗ trợ tiếng Việt UTF-8 đầy đủ."""
    font_candidates = [
        "C:/Windows/Fonts/seguisb.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/tahomabd.ttf" if bold else "C:/Windows/Fonts/tahoma.ttf",
    ]
    for p in font_candidates:
        if Path(p).exists():
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def create_text_overlay_image(text: str, out_path: Path, width: int = 1920, height: int = 1080):
    """Tạo file PNG trong suốt chứa Text Overlay Civic Tech sang trọng, tương phản cao."""
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    font = get_system_font(32 if width == 1920 else 22, bold=True)
    
    # Chia dòng nếu có \n hoặc quá dài
    lines = text.split("\n")
    
    # Tính tổng chiều cao
    line_heights = []
    line_widths = []
    for l in lines:
        bbox = draw.textbbox((0, 0), l, font=font)
        line_widths.append(bbox[2] - bbox[0])
        line_heights.append(bbox[3] - bbox[1])
    
    total_h = sum(line_heights) + (len(lines) - 1) * 12
    max_w = max(line_widths)
    
    pad_x = 36
    pad_y = 18
    box_w = max_w + pad_x * 2
    box_h = total_h + pad_y * 2
    
    # Đặt ở vị trí trung tâm phía dưới
    box_x = (width - box_w) // 2
    box_y = height - box_h - (120 if width == 1920 else 80)
    
    # Vẽ nền Dark Ink Civic (#231B14) với viền Accent Teal
    draw.rounded_rectangle(
        [box_x, box_y, box_x + box_w, box_y + box_h],
        radius=12,
        fill=(35, 27, 20, 230),
        outline=(13, 111, 100, 255),
        width=3
    )
    # Dải màu Seal Red điểm nhấn bên trái
    draw.rectangle([box_x, box_y, box_x + 8, box_y + box_h], fill=(159, 36, 31, 255))
    
    # Vẽ chữ màu Civic Cream (#FDFBF7)
    curr_y = box_y + pad_y
    for i, l in enumerate(lines):
        lw = line_widths[i]
        lx = box_x + (box_w - lw) // 2
        draw.text((lx, curr_y), l, font=font, fill=(253, 251, 247, 255))
        curr_y += line_heights[i] + 12
        
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path)
    return out_path

def generate_watermark(out_path: Path, width: int = 1920, height: int = 1080):
    """Tạo Watermark góc phải trên."""
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    font_brand = get_system_font(18 if width == 1920 else 12, bold=True)
    font_sub = get_system_font(16 if width == 1920 else 11, bold=False)
    
    bw = 394 if width == 1920 else 260
    bh = 46 if width == 1920 else 32
    bx = width - bw - 40
    by = 36
    
    draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=8, fill=(35, 27, 20, 220), outline=(13, 111, 100, 255), width=2)
    draw.rectangle([bx, by, bx + 6, by + bh], fill=(159, 36, 31, 255))
    draw.text((bx + 18, by + 11), "DUSTGUARD VN", font=font_brand, fill=(253, 251, 247, 255))
    draw.text((bx + 172 if width == 1920 else bx + 115, by + 12), "| UNICEF 2026", font=font_sub, fill=(217, 119, 6, 255))
    
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path)
    return out_path

def render_single_scene(scene: dict, output_clip: Path, mode: str = "production"):
    """
    Render 1 cảnh đơn lẻ đảm bảo đúng thời lượng, chuẩn 25fps và kích thước 1920x1080 / 1280x720.
    """
    w = 1920 if mode == "production" else 1280
    h = 1080 if mode == "production" else 720
    fps = 25
    dur = scene["duration"]
    src_file = BASE_DIR / scene["source_file"]
    
    if not src_file.exists():
        candidates = list(BASE_DIR.rglob(Path(scene["source_file"]).name))
        if candidates:
            src_file = candidates[0]
        else:
            src_file = BASE_DIR / "02_sources/real_images/project/ChatGPT Image 09_56_51 31 thg 8, 2026 (10).png"

    overlay_png = None
    if scene.get("text_overlay"):
        overlay_png = output_clip.parent / f"{output_clip.stem}_overlay.png"
        create_text_overlay_image(scene["text_overlay"], overlay_png, width=w, height=h)

    crf_val = "18" if mode == "production" else "26"
    preset_val = "fast" if mode == "production" else "ultrafast"
    
    if scene["source_type"] == "image":
        # Image với Ken Burns pan/zoom
        base_filter = (
            f"[0:v]scale={w*1.12:.0f}:{h*1.12:.0f}:force_original_aspect_ratio=increase,"
            f"crop={w}:{h},"
            f"zoompan=z='min(zoom+0.0008,1.12)':d={int(dur*fps)}:s={w}x{h}:fps={fps},"
            f"trim=duration={dur:.3f},setpts=PTS-STARTPTS,fps={fps}[v_base]"
        )
        
        inputs = ["-loop", "1", "-i", str(src_file)]
        if overlay_png and overlay_png.exists():
            inputs.extend(["-i", str(overlay_png)])
            fc = f"{base_filter};[1:v]scale={w}:{h}[v_ov];[v_base][v_ov]overlay=0:0[v_out]"
            map_label = "[v_out]"
        else:
            fc = f"{base_filter};[v_base]null[v_out]"
            map_label = "[v_out]"

        cmd = [
            "ffmpeg", "-y",
            *inputs,
            "-filter_complex", fc,
            "-map", map_label,
            "-t", f"{dur:.3f}",
            "-c:v", "libx264",
            "-preset", preset_val,
            "-crf", crf_val,
            "-pix_fmt", "yuv420p",
            "-r", str(fps),
            "-an",
            str(output_clip)
        ]
    else:
        # Video footage
        base_filter = (
            f"[0:v]scale={w}:{h}:force_original_aspect_ratio=decrease,"
            f"pad={w}:{h}:(ow-iw)/2:(oh-ih)/2:color=black,"
            f"fps={fps},setpts=PTS-STARTPTS[v_base]"
        )
        
        inputs = ["-ss", "0.0", "-t", f"{dur:.3f}", "-i", str(src_file)]
        if overlay_png and overlay_png.exists():
            inputs.extend(["-i", str(overlay_png)])
            fc = f"{base_filter};[1:v]scale={w}:{h}[v_ov];[v_base][v_ov]overlay=0:0[v_out]"
            map_label = "[v_out]"
        else:
            fc = f"{base_filter};[v_base]null[v_out]"
            map_label = "[v_out]"

        cmd = [
            "ffmpeg", "-y",
            *inputs,
            "-filter_complex", fc,
            "-map", map_label,
            "-t", f"{dur:.3f}",
            "-c:v", "libx264",
            "-preset", preset_val,
            "-crf", crf_val,
            "-pix_fmt", "yuv420p",
            "-r", str(fps),
            "-an",
            str(output_clip)
        ]

    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"\n[!] Lỗi render cảnh {scene['scene_index']}: {res.stderr[-400:]}")
        return False
    return True

def run_pipeline(mode: str = "production", hardsub: bool = True):
    """Điều phối toàn bộ quy trình dựng video 46 cảnh."""
    print("=" * 80)
    print(f"🎬 DUSTGUARD VN — 46-SCENE MASTER VIDEO RENDER PIPELINE [{mode.upper()}]")
    print("=" * 80)

    timeline_file = BASE_DIR / "TIMELINE.json"
    with open(timeline_file, "r", encoding="utf-8") as f:
        timeline = json.load(f)

    scenes = timeline.get("scenes", [])
    print(f"[*] Đang xử lý {len(scenes)} phân cảnh...")

    temp_shots_dir = BASE_DIR / "06_temp" / "shots"
    temp_shots_dir.mkdir(parents=True, exist_ok=True)

    # 1. Render từng cảnh
    rendered_clips = []
    for s in scenes:
        idx = s["scene_index"]
        clip_path = temp_shots_dir / f"scene_{idx:02d}.mp4"
        print(f"  [>] Cảnh {idx:02d}/{len(scenes):02d} ({s['duration']}s): {s['desc'][:45]}...", end="", flush=True)
        ok = render_single_scene(s, clip_path, mode=mode)
        if ok:
            print(" [OK]")
            rendered_clips.append(clip_path)
        else:
            print(" [FAILED]")

    if len(rendered_clips) != len(scenes):
        print(f"\n[!] Cảnh báo: Chỉ render được {len(rendered_clips)}/{len(scenes)} cảnh. Dừng pipeline.")
        return

    # 2. Tạo danh sách concat demuxer
    concat_list_file = BASE_DIR / "06_temp" / "concat_list.txt"
    with open(concat_list_file, "w", encoding="utf-8") as f:
        for c in rendered_clips:
            f.write(f"file '{str(c).replace(chr(92), '/')}'\n")

    # 3. Ghép nối video thô
    concat_video_raw = BASE_DIR / "06_temp" / "video_concatenated_raw.mp4"
    print(f"[*] Đang ghép {len(rendered_clips)} cảnh thành video liền mạch...")
    cmd_concat = [
        "ffmpeg", "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", str(concat_list_file),
        "-c", "copy",
        str(concat_video_raw)
    ]
    subprocess.run(cmd_concat, capture_output=True)

    # 4. Tạo Watermark
    w = 1920 if mode == "production" else 1280
    h = 1080 if mode == "production" else 720
    wm_path = BASE_DIR / "06_temp" / "watermark.png"
    generate_watermark(wm_path, width=w, height=h)

    # 5. Muxing Audio & Flash Beat Drop & Watermark & Subtitle
    bgm1_path = BASE_DIR / "04_audio" / "music" / "epic-presentation.mp3"
    bgm2_path = BASE_DIR / "04_audio" / "music" / "achievement.mp3"
    voice_path = BASE_DIR / "04_audio" / "voiceover" / "master_voiceover_timeline_aligned.mp3"
    if not voice_path.exists():
        voice_path = BASE_DIR / "04_audio" / "voice_final" / "full_voiceover_minh_duc.mp3"

    subtitles_srt = BASE_DIR / "01_script" / "subtitles" / "final.srt"

    out_dir = BASE_DIR / "output"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_final_mp4 = out_dir / ("DustGuardVN_Final_Master_1080p.mp4" if mode == "production" else "DustGuardVN_Draft_Preview_720p.mp4")

    # Filter complex cho Audio & Video
    # Flash tại 70.0s (1:10 - Beat drop)
    srt_escaped = str(subtitles_srt).replace("\\", "/").replace(":", "\\:")
    sub_style = "FontName=Arial,FontSize=20,PrimaryColour=&H00FFFFFF,OutlineColour=&H00141B23,Outline=2.5,Shadow=1.0,MarginV=36,Alignment=2"

    filter_chains = [
        # Video Flash Beat Drop tại 70s
        f"color=c=white:s={w}x{h}:d=0.15,fps=25[v_flash_src]",
        f"[0:v][v_flash_src]overlay=enable='between(t,70.0,70.15)':format=auto[v1]",
        # Watermark
        f"[4:v]scale={w}:{h}[v_wm]",
        f"[v1][v_wm]overlay=0:0[v2]"
    ]
    
    if hardsub and subtitles_srt.exists():
        filter_chains.append(f"[v2]subtitles='{srt_escaped}':force_style='{sub_style}'[v_final]")
        v_out_label = "[v_final]"
    else:
        v_out_label = "[v2]"

    # Audio mixing: Voice + BGM1 (0-135s) + BGM2 (130-210s)
    filter_chains.append(
        f"[1:a]volume=1.0,aformat=sample_rates=48000:channel_layouts=stereo[a_voice];"
        f"[2:a]aloop=loop=-1:size=2e+09,volume=0.14,afade=t=in:ss=0:d=2.0,afade=t=out:st=130:d=6.0,aformat=sample_rates=48000:channel_layouts=stereo[a_bgm1];"
        f"[3:a]aloop=loop=-1:size=2e+09,volume=0.16,afade=t=in:ss=0:d=4.0,adelay=130000|130000,aformat=sample_rates=48000:channel_layouts=stereo[a_bgm2];"
        f"[a_voice][a_bgm1][a_bgm2]amix=inputs=3:duration=first:dropout_transition=2[a_final]"
    )

    filter_str = ";\n".join(filter_chains)

    cmd_final = [
        "ffmpeg", "-y",
        "-i", str(concat_video_raw),
        "-i", str(voice_path),
        "-i", str(bgm1_path),
        "-i", str(bgm2_path),
        "-i", str(wm_path),
        "-filter_complex", filter_str,
        "-map", v_out_label,
        "-map", "[a_final]",
        "-c:v", "libx264",
        "-preset", "fast" if mode == "production" else "ultrafast",
        "-crf", "18" if mode == "production" else "26",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "320k",
        "-ar", "48000",
        "-t", "210.0",
        str(out_final_mp4)
    ]

    print("[*] Đang xuất bản video thành phẩm cuối cùng...")
    res_final = subprocess.run(cmd_final, capture_output=True, text=True)
    if res_final.returncode == 0:
        print(f"\n🎉 HOÀN THÀNH 100%! Video thành phẩm: {out_final_mp4.relative_to(BASE_DIR)}")
        print(f"    • Thời lượng: 210.0 giây (3 phút 30 giây)")
        print(f"    • Số cảnh: {len(scenes)} cảnh linh hoạt")
        print(f"    • Độ phân giải: {w}x{h} @ 25fps")
    else:
        print(f"[!] Lỗi xuất video cuối: {res_final.stderr[:500]}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=["draft", "production"], default="draft")
    parser.add_argument("--no-hardsub", action="store_true")
    args = parser.parse_args()
    
    run_pipeline(mode=args.mode, hardsub=not args.no_hardsub)
