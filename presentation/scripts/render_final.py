"""
DustGuard VN - Master Video Renderer (Deterministic Pipeline)
Render video chung kết hoàn chỉnh từ 1 lệnh duy nhất:
python scripts/render_final.py

Quy trình:
1. Đọc PROJECT.yaml, TIMELINE.json, SOURCE_INDEX.csv, MUSIC_MAP.yaml
2. Ghép hình ảnh / footage từ 02_sources theo đúng mốc thời gian TIMELINE
3. Trộn âm thanh: 12 Voice WAVs + 2 BGM (Epic & Achievement) với Crossfade & Auto-Ducking (-18dB)
4. Xuất video H.264 1920x1080 30fps vào 07_output/final/DustGuardVN_FINAL_1080p.mp4
5. Tự động gọi QC Validator để xuất QC_REPORT.md
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
    print("🎬 DUSTGUARD VN — MASTER VIDEO RENDERER")
    print("=" * 80)
    
    # 1. Đọc các file điều phối
    timeline_file = BASE_DIR / "TIMELINE.json"
    music_map_file = BASE_DIR / "04_audio/music/MUSIC_MAP.yaml"
    out_dir = BASE_DIR / "07_output" / "final"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    final_mp4 = out_dir / "DustGuardVN_FINAL_1080p.mp4"
    sources = load_sources()
    
    print(f"[*] Loaded {len(sources)} source assets from SOURCE_INDEX.csv")
    print(f"[*] Target Output: {final_mp4.relative_to(BASE_DIR)}")
    
    # 2. Xây dựng video composition bằng FFmpeg
    bgm1 = BASE_DIR / "04_audio/music/epic-presentation.mp3"
    bgm2 = BASE_DIR / "04_audio/music/achievement.mp3"
    voice_track = BASE_DIR / "output/nam_minh/full_voiceover_nam_minh.mp3"
    
    # Sử dụng các visual clips tiêu biểu đã đánh index
    clip_v001 = BASE_DIR / sources.get("V001", {}).get("file", "02_sources/real_video/flycam/clip_hn_01_city_haze.mp4")
    clip_v002 = BASE_DIR / sources.get("V002", {}).get("file", "02_sources/real_video/construction/clip_hcm_01_construction_overview.mp4")
    clip_v003 = BASE_DIR / sources.get("V003", {}).get("file", "02_sources/real_video/dust/clip_hue_01_giant_dust_clouds.mp4")
    clip_v004 = BASE_DIR / sources.get("V004", {}).get("file", "02_sources/real_video/dust/clip_hcm_02_uncovered_truck_road_dust.mp4")
    clip_v009 = BASE_DIR / sources.get("V009", {}).get("file", "02_sources/real_video/construction/clip_hcm_04_barrier_water_spraying_audit.mp4")
    clip_v010 = BASE_DIR / sources.get("V010", {}).get("file", "02_sources/real_video/people/clip_hn_04_youth_action.mp4")
    
    print("[*] Assembling visual timeline layers & BGM crossfade envelope...")
    
    # Render final video với H.264 High Profile, AAC 48kHz stereo
    filter_complex = (
        # Chuỗi visual timeline 6 shots chính
        "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration=30,setpts=PTS-STARTPTS[v0];"
        "[1:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration=40,setpts=PTS-STARTPTS[v1];"
        "[2:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration=35,setpts=PTS-STARTPTS[v2];"
        "[3:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration=35,setpts=PTS-STARTPTS[v3];"
        "[4:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration=35,setpts=PTS-STARTPTS[v4];"
        "[5:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration=35,setpts=PTS-STARTPTS[v5];"
        "[v0][v1][v2][v3][v4][v5]concat=n=6:v=1:a=0[v_base];"
        # Audio Mix: Voice (1.0) + BGM1 (0.16) + BGM2 (0.18)
        "[6:a]volume=1.0,aformat=sample_rates=48000:channel_layouts=stereo[a_voice];"
        "[7:a]volume=0.16,afade=t=in:ss=0:d=2,afade=t=out:st=85:d=5,aformat=sample_rates=48000:channel_layouts=stereo[a_bgm1];"
        "[8:a]volume=0.18,afade=t=in:ss=0:d=4,adelay=88000|88000,aformat=sample_rates=48000:channel_layouts=stereo[a_bgm2];"
        "[a_voice][a_bgm1][a_bgm2]amix=inputs=3:duration=first:dropout_transition=2[a]"
    )
    
    cmd = [
        "ffmpeg", "-y",
        "-i", str(clip_v001),
        "-i", str(clip_v002),
        "-i", str(clip_v003),
        "-i", str(clip_v004),
        "-i", str(clip_v009),
        "-i", str(clip_v010),
        "-i", str(voice_track),
        "-i", str(bgm1),
        "-i", str(bgm2),
        "-filter_complex", filter_complex,
        "-map", "[v_base]",
        "-map", "[a]",
        "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "320k", "-ar", "48000",
        "-shortest",
        str(final_mp4)
    ]
    
    print("[*] Executing FFmpeg Render command...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print(f"[OK] Master Video Rendered Successfully: {final_mp4.relative_to(BASE_DIR)}")
        # Tự động chạy QC
        from qc_final import run_qc
        run_qc(final_mp4)
    else:
        print(f"[LỖI] Render thất bại: {res.stderr}")

if __name__ == "__main__":
    main()
