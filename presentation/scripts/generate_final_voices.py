"""
DustGuard VN - Final Voice Segments Generator
Sinh trọn bộ 12 file WAV riêng biệt vào 04_audio/voice_final/ (01.wav -> 12.wav)
chuẩn 48kHz, speed 1.08x (Minh Đức) hoặc theo voice được cấu hình trong PROJECT.yaml.
"""

import sys
import json
import subprocess
from pathlib import Path
import soundfile as sf
import vieneu

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

BASE_DIR = Path(__file__).resolve().parent.parent

def change_speed_ffmpeg(in_wav, out_wav, speed=1.08):
    cmd = [
        "ffmpeg", "-y", "-i", str(in_wav),
        "-filter:a", f"atempo={speed}",
        "-ar", "48000",
        str(out_wav)
    ]
    subprocess.run(cmd, capture_output=True, check=True)

def main():
    voice_final_dir = BASE_DIR / "04_audio" / "voice_final"
    voice_final_dir.mkdir(parents=True, exist_ok=True)
    
    timeline_file = BASE_DIR / "TIMELINE.json"
    with open(timeline_file, encoding="utf-8") as f:
        timeline = json.load(f)
        
    print("=== DUSTGUARD VN FINAL VOICES GENERATOR ===")
    print("[*] Voice Model: Minh Đức (VieNeu Offline) · Speed Target: 1.08x")
    
    vn = vieneu.Vieneu()
    temp_dir = BASE_DIR / "06_temp" / "normalized_audio"
    temp_dir.mkdir(parents=True, exist_ok=True)
    
    for s in timeline["segments"]:
        seg_num = f"{s['segment']:02d}"
        text = s["text"]
        
        raw_wav = temp_dir / f"raw_{seg_num}.wav"
        final_wav = voice_final_dir / f"{seg_num}.wav"
        
        print(f"\n[*] Đang sinh segment {seg_num} ({s['title']})...")
        audio = vn.infer(text=text, voice="Minh Đức")
        sf.write(str(raw_wav), audio, vn.sample_rate)
        
        change_speed_ffmpeg(raw_wav, final_wav, speed=1.08)
        print(f"[OK] Đã hoàn tất: {final_wav.name}")
        
    print("\n" + "=" * 80)
    print(f"[HOÀN TẤT] 12 file voice final đã được xuất vào: {voice_final_dir.relative_to(BASE_DIR)}")
    print("=" * 80)

if __name__ == "__main__":
    main()
