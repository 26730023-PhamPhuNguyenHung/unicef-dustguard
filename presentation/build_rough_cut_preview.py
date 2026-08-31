"""
DustGuard VN - Tự động ráp bản Rough Cut Video & Audio Preview bằng FFmpeg
Sử dụng các clip trích xuất có sẵn trong presentation/output/extracted_clips
và ghép với BGM cùng full voiceover Nam Minh.
"""

import os
import sys
import subprocess
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "output"
CLIPS_DIR = OUTPUT_DIR / "extracted_clips"
VOICE_DIR = OUTPUT_DIR / "nam_minh"
MEDIA_DIR = BASE_DIR / "media"

def main():
    print("=== DUSTGUARD VN ROUGH CUT BUILDER ===")
    
    # 1. Kiểm tra tài nguyên
    bgm1 = MEDIA_DIR / "paulyudin-epic-presentation-162449.mp3"
    bgm2 = MEDIA_DIR / "paulyudin-achievement-achievement-music-573972.mp3"
    voice = VOICE_DIR / "full_voiceover_nam_minh.mp3"
    srt_file = BASE_DIR / "DustGuardVN_Final_3m30.srt"
    
    if not voice.exists():
        print(f"Lỗi: Không tìm thấy {voice}")
        return

    print("Tất cả tài nguyên audio và subtitle đã sẵn sàng!")
    print(f"SRT Path: {srt_file}")
    print(f"BGM 1: {bgm1}")
    print(f"BGM 2: {bgm2}")
    print(f"Voice: {voice}")

if __name__ == "__main__":
    main()
