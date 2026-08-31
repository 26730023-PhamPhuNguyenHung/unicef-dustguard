"""
DustGuard VN - Master Video Renderer (Exact Millisecond Pipeline)
Dựng video chung kết hoàn chỉnh theo đúng mốc timecode mili-giây của TIMELINE.json (258.864s).
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
    print("🎬 DUSTGUARD VN — MASTER VIDEO RENDERER (EXACT MILLISECOND 258.864s)")
    print("=" * 80)
    
    timeline_file = BASE_DIR / "TIMELINE.json"
    with open(timeline_file, encoding="utf-8") as f:
        timeline_data = json.load(f)
        
    total_dur = timeline_data["total_duration_seconds"] # 258.864s
    out_dir = BASE_DIR / "07_output" / "final"
    out_dir.mkdir(parents=True, exist_ok=True)
    final_mp4 = out_dir / "DustGuardVN_FINAL_1080p.mp4"
    
    sources = load_sources()
    print(f"[*] Target Duration: {total_dur:.3f}s")
    print(f"[*] Target Output: {final_mp4.relative_to(BASE_DIR)}")

    bgm1 = BASE_DIR / "04_audio/music/epic-presentation.mp3"
    bgm2 = BASE_DIR / "04_audio/music/achievement.mp3"
    voice_track = BASE_DIR / "output/nam_minh/full_voiceover_nam_minh.mp3"

    # Lấy danh sách visual clips
    clip_v001 = BASE_DIR / sources.get("V001", {}).get("file", "02_sources/real_video/flycam/clip_hn_01_city_haze.mp4")
    clip_v002 = BASE_DIR / sources.get("V002", {}).get("file", "02_sources/real_video/construction/clip_hcm_01_construction_overview.mp4")
    clip_v003 = BASE_DIR / sources.get("V003", {}).get("file", "02_sources/real_video/dust/clip_hue_01_giant_dust_clouds.mp4")
    clip_v004 = BASE_DIR / sources.get("V004", {}).get("file", "02_sources/real_video/dust/clip_hcm_02_uncovered_truck_road_dust.mp4")
    clip_v009 = BASE_DIR / sources.get("V009", {}).get("file", "02_sources/real_video/construction/clip_hcm_04_barrier_water_spraying_audit.mp4")
    clip_v010 = BASE_DIR / sources.get("V010", {}).get("file", "02_sources/real_video/people/clip_hn_04_youth_action.mp4")

    # Xếp 6 visual segments tổng cộng = 258.864s (43.144s mỗi clip)
    dur_each = round(total_dur / 6.0, 3) # ~43.144s
    
    filter_complex = (
        f"[0:v]loop=loop=-1:size=2:start=0,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration={dur_each},setpts=PTS-STARTPTS[v0];"
        f"[1:v]loop=loop=-1:size=2:start=0,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration={dur_each},setpts=PTS-STARTPTS[v1];"
        f"[2:v]loop=loop=-1:size=2:start=0,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration={dur_each},setpts=PTS-STARTPTS[v2];"
        f"[3:v]loop=loop=-1:size=2:start=0,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration={dur_each},setpts=PTS-STARTPTS[v3];"
        f"[4:v]loop=loop=-1:size=2:start=0,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration={dur_each},setpts=PTS-STARTPTS[v4];"
        f"[5:v]loop=loop=-1:size=2:start=0,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration={dur_each},setpts=PTS-STARTPTS[v5];"
        f"[v0][v1][v2][v3][v4][v5]concat=n=6:v=1:a=0[v_base];"
        # Audio Mix
        f"[6:a]volume=1.0,aformat=sample_rates=48000:channel_layouts=stereo[a_voice];"
        f"[7:a]aloop=loop=-1:size=2e+09,volume=0.16,afade=t=in:ss=0:d=2,afade=t=out:st=130:d=5,aformat=sample_rates=48000:channel_layouts=stereo[a_bgm1];"
        f"[8:a]aloop=loop=-1:size=2e+09,volume=0.18,afade=t=in:ss=0:d=4,adelay=130000|130000,aformat=sample_rates=48000:channel_layouts=stereo[a_bgm2];"
        f"[a_voice][a_bgm1][a_bgm2]amix=inputs=3:duration=first:dropout_transition=2[a]"
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
        "-c:v", "libx264", "-preset", "ultrafast", "-crf", "20", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "320k", "-ar", "48000",
        "-t", f"{total_dur:.3f}",
        str(final_mp4)
    ]

    print("[*] Executing FFmpeg Render command...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print(f"[OK] Master Video Rendered: {final_mp4.relative_to(BASE_DIR)}")
        from qc_final import run_qc
        run_qc(final_mp4)
    else:
        print(f"[LỖI] Render thất bại: {res.stderr}")

if __name__ == "__main__":
    main()
