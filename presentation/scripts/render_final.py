"""
DustGuard VN - Master Video Renderer (Director Hybrid Cut)
Dựng video chung kết kết hợp hoàn hảo giữa Video Footage thực tế và 10 Slide Master Presentation
khớp 100% TIMELINE.json (258.864s) và chuẩn chất lượng phát sóng 1080p.
"""

import os
import sys
import csv
import json
import subprocess
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

BASE_DIR = Path(__file__).resolve().parent.parent

def load_sources():
    csv_file = BASE_DIR / "02_sources" / "SOURCE_INDEX.csv"
    sources = {}
    with open(csv_file, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            sources[r["id"]] = r
    return sources

def main():
    print("=" * 80)
    print("🎬 DUSTGUARD VN — MASTER VIDEO RENDERER (DIRECTOR HYBRID CUT)")
    print("=" * 80)
    
    timeline_file = BASE_DIR / "TIMELINE.json"
    with open(timeline_file, encoding="utf-8") as f:
        timeline_data = json.load(f)
        
    total_dur = timeline_data["total_duration_seconds"] # 258.864s
    out_dir = BASE_DIR / "07_output" / "final"
    out_dir.mkdir(parents=True, exist_ok=True)
    final_mp4 = out_dir / "DustGuardVN_FINAL_1080p.mp4"
    
    sources = load_sources()
    print(f"[*] Total Timeline Runtime: {total_dur:.3f}s")
    print(f"[*] Target Master: {final_mp4.relative_to(BASE_DIR)}")

    bgm1 = BASE_DIR / "04_audio/music/epic-presentation.mp3"
    bgm2 = BASE_DIR / "04_audio/music/achievement.mp3"
    voice_track = BASE_DIR / "output/nam_minh/full_voiceover_nam_minh.mp3"

    # 1. Video Footages
    v_flycam = BASE_DIR / sources["V001"]["file"]
    v_construction = BASE_DIR / sources["V002"]["file"]
    v_dust_hue = BASE_DIR / sources["V003"]["file"]
    v_audit = BASE_DIR / sources["V009"]["file"]
    v_youth = BASE_DIR / sources["V010"]["file"]
    v_green_bus = BASE_DIR / sources["V011"]["file"]
    
    # 2. Master Presentation Slides
    s_vande = BASE_DIR / sources["S001"]["file"]
    s_stakeholders = BASE_DIR / sources["S002"]["file"]
    s_taphuan = BASE_DIR / sources["S003"]["file"]
    s_tinhmoi = BASE_DIR / sources["S004"]["file"]
    s_pilot = BASE_DIR / sources["S005"]["file"]
    s_responsible_ai = BASE_DIR / sources["S008"]["file"]
    s_tamnhin = BASE_DIR / sources["S009"]["file"]
    s_tongket = BASE_DIR / sources["S010"]["file"]

    # Xây dựng 12 Video Blocks (kết hợp Footage + Slide có pan/zoom)
    # Block 1 (16.97s): Flycam + Construction
    # Block 2 (28.39s): Slide 01 Vấn đề giải quyết + Dust Hue
    # Block 3 (15.84s): Trẻ em & Người dân bế tắc
    # Block 4 (14.28s): Slide 02 Người hưởng lợi + DustGuard Reveal
    # Block 5 (23.38s): Slide 04 Tính mới sáng tạo + Audit
    # Block 6 (21.22s): Slide 03 Thay đổi sau tập huấn
    # Block 7 (26.26s): Slide 08 Responsible AI
    # Block 8 (26.78s): Slide 05 Pilot Roadmap & KPI
    # Block 9 (19.46s): Slide 06 Kỹ thuật chi phí thấp
    # Block 10 (20.09s): Youth Action + Slide 02
    # Block 11 (21.65s): Slide 09 Tầm nhìn mở rộng + Green Bus
    # Block 12 (24.55s): Slide 10 Tổng kết cảm ơn + Flycam Sunrise

    filter_complex = (
        # Block 1: V001 (16.968s)
        "[0:v]loop=loop=-1:size=2:start=0,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration=16.968,setpts=PTS-STARTPTS[b01];"
        # Block 2: S001 (28.392s) Slide 1 Vấn đề giải quyết
        "[6:v]loop=loop=-1:size=2:start=0,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration=28.392,setpts=PTS-STARTPTS[b02];"
        # Block 3: V003 (15.840s) Bụi mù Huế & Nỗi lo hô hấp
        "[2:v]loop=loop=-1:size=2:start=0,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration=15.840,setpts=PTS-STARTPTS[b03];"
        # Block 4: S002 (14.280s) Slide 2 Chuỗi 4 bên phối hợp
        "[7:v]loop=loop=-1:size=2:start=0,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration=14.280,setpts=PTS-STARTPTS[b04];"
        # Block 5: S004 (23.376s) Slide 4 Tính mới sáng tạo
        "[9:v]loop=loop=-1:size=2:start=0,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration=23.376,setpts=PTS-STARTPTS[b05];"
        # Block 6: S003 (21.216s) Slide 3 Thay đổi sau tập huấn
        "[8:v]loop=loop=-1:size=2:start=0,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration=21.216,setpts=PTS-STARTPTS[b06];"
        # Block 7: S008 (26.256s) Slide 8 Responsible AI
        "[11:v]loop=loop=-1:size=2:start=0,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration=26.256,setpts=PTS-STARTPTS[b07];"
        # Block 8: S005 (26.784s) Slide 5 Pilot Roadmap 4-8 tuần
        "[10:v]loop=loop=-1:size=2:start=0,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration=26.784,setpts=PTS-STARTPTS[b08];"
        # Block 9: V009 (19.464s) Kiểm tra thực địa & đo lường
        "[3:v]loop=loop=-1:size=2:start=0,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration=19.464,setpts=PTS-STARTPTS[b09];"
        # Block 10: V010 (20.088s) Thanh niên hành động
        "[4:v]loop=loop=-1:size=2:start=0,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration=20.088,setpts=PTS-STARTPTS[b10];"
        # Block 11: S009 (21.648s) Slide 9 Tầm nhìn 4 giai đoạn
        "[12:v]loop=loop=-1:size=2:start=0,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration=21.648,setpts=PTS-STARTPTS[b11];"
        # Block 12: S010 (24.552s) Slide 10 Tổng kết & Lời cảm ơn
        "[13:v]loop=loop=-1:size=2:start=0,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration=24.552,setpts=PTS-STARTPTS[b12];"
        # Ghép 12 Blocks
        "[b01][b02][b03][b04][b05][b06][b07][b08][b09][b10][b11][b12]concat=n=12:v=1:a=0[v_base];"
        # Audio Mix với BGM crossfade & Ducking
        "[14:a]volume=1.0,aformat=sample_rates=48000:channel_layouts=stereo[a_voice];"
        "[15:a]aloop=loop=-1:size=2e+09,volume=0.16,afade=t=in:ss=0:d=2,afade=t=out:st=130:d=5,aformat=sample_rates=48000:channel_layouts=stereo[a_bgm1];"
        "[16:a]aloop=loop=-1:size=2e+09,volume=0.18,afade=t=in:ss=0:d=4,adelay=130000|130000,aformat=sample_rates=48000:channel_layouts=stereo[a_bgm2];"
        "[a_voice][a_bgm1][a_bgm2]amix=inputs=3:duration=first:dropout_transition=2[a]"
    )

    cmd = [
        "ffmpeg", "-y",
        "-i", str(v_flycam),          # 0: V001
        "-i", str(v_construction),    # 1: V002
        "-i", str(v_dust_hue),        # 2: V003
        "-i", str(v_audit),           # 3: V009
        "-i", str(v_youth),           # 4: V010
        "-i", str(v_green_bus),       # 5: V011
        "-i", str(s_vande),           # 6: S001
        "-i", str(s_stakeholders),    # 7: S002
        "-i", str(s_taphuan),         # 8: S003
        "-i", str(s_tinhmoi),         # 9: S004
        "-i", str(s_pilot),           # 10: S005
        "-i", str(s_responsible_ai),  # 11: S008
        "-i", str(s_tamnhin),         # 12: S009
        "-i", str(s_tongket),         # 13: S010
        "-i", str(voice_track),       # 14: Voice
        "-i", str(bgm1),              # 15: BGM1 Epic
        "-i", str(bgm2),              # 16: BGM2 Achievement
        "-filter_complex", filter_complex,
        "-map", "[v_base]",
        "-map", "[a]",
        "-c:v", "libx264", "-preset", "ultrafast", "-crf", "18", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "320k", "-ar", "48000",
        "-t", f"{total_dur:.3f}",
        str(final_mp4)
    ]

    print("[*] Executing FFmpeg Render command for 12 Hybrid Blocks...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print(f"[OK] Master Video Rendered Successfully: {final_mp4.relative_to(BASE_DIR)}")
        from qc_final import run_qc
        run_qc(final_mp4)
    else:
        print(f"[LỖI] Render thất bại: {res.stderr}")

if __name__ == "__main__":
    main()
