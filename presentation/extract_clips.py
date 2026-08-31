"""
DustGuard VN - Clip Extractor
Tự động cắt các phân cảnh vàng từ video thực địa ô nhiễm không khí
"""

import subprocess
import sys
from pathlib import Path

# Đảm bảo UTF-8 cho console Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

CLIPS = [
    {
        "name": "clip_01_city_haze.mp4",
        "desc": "Thành phố chìm trong sương mù và bụi mịn (Toàn cảnh)",
        "start": "00:00:00",
        "duration": "00:00:18"
    },
    {
        "name": "clip_02_citizen_elderly_concern.mp4",
        "desc": "Người cao tuổi phản ánh về sức khỏe và sự ngột ngạt",
        "start": "00:00:40",
        "duration": "00:00:20"
    },
    {
        "name": "clip_03_traffic_dust_congestion.mp4",
        "desc": "Đường phố đông đúc xe cộ khói bụi tầm nhìn kém",
        "start": "00:01:05",
        "duration": "00:00:25"
    },
    {
        "name": "clip_04_youth_action.mp4",
        "desc": "Thế hệ trẻ chủ động bảo vệ và hành động vì môi trường",
        "start": "00:02:57",
        "duration": "00:00:14"
    }
]

def extract_all():
    media_dir = Path(__file__).parent / "media"
    out_dir = Path(__file__).parent / "output" / "extracted_clips"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    src_video = media_dir / "hanoi_air_pollution_footage.mp4"
    if not src_video.exists():
        print(f"[!] Không tìm thấy file nguồn: {src_video}")
        return
        
    print(f"[*] Bắt đầu trích xuất clip từ: {src_video.name}")
    for clip in CLIPS:
        out_file = out_dir / clip["name"]
        print(f" -> Trích xuất: {clip['name']} ({clip['desc']})...")
        cmd = [
            "ffmpeg", "-y",
            "-ss", clip["start"],
            "-i", str(src_video),
            "-t", clip["duration"],
            "-c:v", "libx264", "-crf", "18", "-preset", "fast",
            "-c:a", "aac", "-b:a", "192k",
            str(out_file)
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f"    [OK] Đã lưu: {out_file.name}")
        
    print(f"\n[DONE] Toàn bộ clip đã sẵn sàng tại: {out_dir}")

if __name__ == "__main__":
    extract_all()
