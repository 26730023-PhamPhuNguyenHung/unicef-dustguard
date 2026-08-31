#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🎬 DUSTGUARD VN — MASTER VIDEO RENDERER
Ghép nối toàn bộ 12 phân đoạn video/ảnh/slide với Ken Burns effect, Motion Overlays,
hòa âm Master Audio (Voice + BGM) và xuất Master Video 1080p 30fps H.264 (cả bản raw và hard-sub).
"""

import os
import sys
import json
import argparse
import subprocess
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = Path(__file__).resolve().parent.parent
TIMELINE_JSON = BASE_DIR / "TIMELINE.json"
AUDIO_MIX = BASE_DIR / "04_audio" / "mix" / "master_audio.mp3"
OVERLAYS_DIR = BASE_DIR / "05_edit" / "overlays"
TEMP_DIR = BASE_DIR / "06_temp"
FINAL_DIR = BASE_DIR / "07_output" / "final"
SUBTITLES_FILE = BASE_DIR / "01_script" / "subtitles" / "final.srt"

def render_segment_clip(seg_data, is_fast=False):
    """Render từng segment thành 1 clip mp4 trung gian."""
    seg_id = seg_data["segment_id"]
    duration = seg_data["duration"]
    shots = seg_data.get("shots", [])
    overlay_name = seg_data.get("overlay")
    
    out_clip = TEMP_DIR / f"seg_{seg_id}.mp4"
    print(f"  [Render] Phân đoạn {seg_id}: {seg_data['title']} ({duration:.1f}s)...")
    
    # Chọn shot đầu tiên hoặc shot chính
    main_shot = shots[0] if shots else None
    if not main_shot:
        # Fallback background
        cmd = [
            "ffmpeg", "-y",
            "-f", "lavfi", "-i", f"color=c=#FDFBF7:s=1920x1080:d={duration}",
            "-c:v", "libx264", "-preset", "ultrafast" if is_fast else "medium",
            "-pix_fmt", "yuv420p", "-r", "30",
            str(out_clip)
        ]
        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        return out_clip
        
    src_file = BASE_DIR / main_shot["file"]
    if not src_file.exists():
        print(f"    ⚠️ Không tìm thấy file {src_file}, tạo placeholder...")
        cmd = [
            "ffmpeg", "-y",
            "-f", "lavfi", "-i", f"color=c=#231B14:s=1920x1080:d={duration}",
            "-c:v", "libx264", "-preset", "ultrafast",
            "-pix_fmt", "yuv420p", "-r", "30",
            str(out_clip)
        ]
        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        return out_clip
        
    src_type = main_shot["source_type"]
    overlay_file = (OVERLAYS_DIR / overlay_name) if overlay_name else None
    
    if src_type in ["image", "slide"]:
        # Áp dụng hiệu ứng Ken Burns nhẹ cho ảnh tĩnh
        if overlay_file and overlay_file.exists():
            cmd = [
                "ffmpeg", "-y",
                "-loop", "1", "-i", str(src_file),
                "-i", str(overlay_file),
                "-filter_complex",
                f"[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
                f"zoompan=z='min(zoom+0.0008,1.15)':d={int(duration*30)}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080,fps=30[bg];"
                f"[bg][1:v]overlay=0:0[out]",
                "-map", "[out]",
                "-t", f"{duration}",
                "-c:v", "libx264", "-preset", "ultrafast" if is_fast else "fast",
                "-pix_fmt", "yuv420p", "-r", "30",
                str(out_clip)
            ]
        else:
            cmd = [
                "ffmpeg", "-y",
                "-loop", "1", "-i", str(src_file),
                "-vf",
                f"scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
                f"zoompan=z='min(zoom+0.0008,1.15)':d={int(duration*30)}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080,fps=30",
                "-t", f"{duration}",
                "-c:v", "libx264", "-preset", "ultrafast" if is_fast else "fast",
                "-pix_fmt", "yuv420p", "-r", "30",
                str(out_clip)
            ]
    else:
        # Video footage
        if overlay_file and overlay_file.exists():
            cmd = [
                "ffmpeg", "-y",
                "-stream_loop", "-1", "-i", str(src_file),
                "-i", str(overlay_file),
                "-filter_complex",
                f"[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30[bg];"
                f"[bg][1:v]overlay=0:0[out]",
                "-map", "[out]",
                "-t", f"{duration}",
                "-c:v", "libx264", "-preset", "ultrafast" if is_fast else "fast",
                "-pix_fmt", "yuv420p", "-r", "30",
                str(out_clip)
            ]
        else:
            cmd = [
                "ffmpeg", "-y",
                "-stream_loop", "-1", "-i", str(src_file),
                "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30",
                "-t", f"{duration}",
                "-c:v", "libx264", "-preset", "ultrafast" if is_fast else "fast",
                "-pix_fmt", "yuv420p", "-r", "30",
                str(out_clip)
            ]
            
    subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    return out_clip

def render_master_video(fast_mode=False):
    print(f"[Stage 7] Bắt đầu Master Render Video 1080p 30fps (Fast mode: {fast_mode})...")
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    FINAL_DIR.mkdir(parents=True, exist_ok=True)
    
    if not TIMELINE_JSON.exists():
        print(f"❌ Không tìm thấy {TIMELINE_JSON}. Vui lòng chạy build_timeline.py trước!")
        return False
        
    with open(TIMELINE_JSON, "r", encoding="utf-8") as f:
        timeline = json.load(f)
        
    segments = timeline.get("segments", [])
    segment_clips = []
    
    # 1. Render từng segment
    for seg in segments:
        clip_path = render_segment_clip(seg, is_fast=fast_mode)
        segment_clips.append(clip_path)
        
    # 2. Tạo danh sách concat
    concat_list = TEMP_DIR / "video_concat_list.txt"
    with open(concat_list, "w", encoding="utf-8") as f:
        for p in segment_clips:
            f.write(f"file '{p.as_posix()}'\n")
            
    merged_video_temp = TEMP_DIR / "merged_video_no_audio.mp4"
    cmd_concat = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_list),
        "-c", "copy",
        str(merged_video_temp)
    ]
    subprocess.run(cmd_concat, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    
    # 3. Ghép Audio Track hoàn chỉnh
    raw_final_output = FINAL_DIR / "DustGuardVN_Final_3m30_1080p.mp4"
    print(f"[Stage 7] Ghép Master Audio Track vào Video...")
    
    if AUDIO_MIX.exists():
        cmd_mux = [
            "ffmpeg", "-y",
            "-i", str(merged_video_temp),
            "-i", str(AUDIO_MIX),
            "-map", "0:v", "-map", "1:a",
            "-c:v", "copy",
            "-c:a", "aac", "-b:a", "192k",
            "-shortest",
            str(raw_final_output)
        ]
    else:
        cmd_mux = [
            "ffmpeg", "-y",
            "-i", str(merged_video_temp),
            "-c:v", "copy",
            str(raw_final_output)
        ]
    subprocess.run(cmd_mux, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    print(f"✅ Đã xuất Master Video Raw: {raw_final_output}")
    
    # 4. Tạo bản Hard-subtitles
    sub_final_output = FINAL_DIR / "DustGuardVN_Final_3m30_1080p_subtitles.mp4"
    if SUBTITLES_FILE.exists():
        print(f"[Stage 7] Đang nhúng phụ đề Hard-sub chuẩn phát sóng...")
        # Escape path for ffmpeg subtitles filter on Windows
        sub_escaped = SUBTITLES_FILE.as_posix().replace(":", "\\:")
        sub_filter = f"subtitles='{sub_escaped}':force_style='FontSize=22,PrimaryColour=&H00FFFFFF,OutlineColour=&H00231B14,BorderStyle=3,Outline=2,Shadow=0,MarginV=35,Alignment=2'"
        
        cmd_sub = [
            "ffmpeg", "-y",
            "-i", str(raw_final_output),
            "-vf", sub_filter,
            "-c:v", "libx264", "-preset", "ultrafast" if fast_mode else "medium",
            "-crf", "18",
            "-c:a", "copy",
            str(sub_final_output)
        ]
        try:
            subprocess.run(cmd_sub, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
            print(f"✅ Đã xuất Master Video có Phụ đề: {sub_final_output}")
        except Exception as e:
            print(f"⚠️ Không thể nhúng hard-sub tự động: {e}. Bản raw vẫn hoàn tất 100%.")
            
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Master Video Renderer")
    parser.add_argument("--fast", action="store_true", help="Chế độ render siêu tốc")
    args = parser.parse_args()
    render_master_video(fast_mode=args.fast)
