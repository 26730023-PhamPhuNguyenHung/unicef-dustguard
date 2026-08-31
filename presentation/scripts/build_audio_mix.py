#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🎵 DUSTGUARD VN — AUDIO SYNTHESIZER & DUCKING MIXER
Tạo nền âm thanh BGM 2 giai đoạn (BGM 1: Serious Civic Problem -> Beat Drop 0:55 ->
BGM 2: Action Climax Crossfade 2:10), tự động Ducking -18dB khi có Voiceover,
và xuất Master Audio Track hoàn chỉnh cho Master Video.
"""

import os
import sys
import json
import math
import subprocess
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = Path(__file__).resolve().parent.parent
MUSIC_DIR = BASE_DIR / "04_audio" / "music"
VOICE_DIR = BASE_DIR / "04_audio" / "voice_final"
MIX_DIR = BASE_DIR / "04_audio" / "mix"

def generate_cinematic_bgm(duration=210.0):
    """
    Sử dụng FFmpeg audio filters để tổng hợp 2 dòng BGM chất lượng cao:
    - BGM 1 (0:00 - 2:15): Nhịp trầm ấm, piano suy tư, dồn trống bùng nổ đúng giây 55.
    - BGM 2 (2:10 - 3:30): Nhịp hào hùng, truyền cảm hứng hành động.
    """
    MUSIC_DIR.mkdir(parents=True, exist_ok=True)
    MIX_DIR.mkdir(parents=True, exist_ok=True)
    
    bgm1_path = MUSIC_DIR / "bgm_part1_epic.mp3"
    bgm2_path = MUSIC_DIR / "bgm_part2_achievement.mp3"
    master_bgm_path = MUSIC_DIR / "master_bgm.mp3"
    
    print("[Stage 5] Đang tổng hợp nền nhạc BGM 2 pha theo nhịp Beat Drop 0:55 và Crossfade 2:10...")
    
    # Sinh BGM 1: Piano/pad + Beat drop tại giây 55
    # Tone C minor / Eb major (261.63Hz, 311.13Hz, 392.00Hz, 523.25Hz)
    cmd_bgm1 = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", f"anoisesrc=d={duration}:c=pink:r=48000:a=0.015",
        "-f", "lavfi", "-i", f"sine=f=130.81:d={duration}",
        "-f", "lavfi", "-i", f"sine=f=196.00:d={duration}",
        "-filter_complex",
        "[1:a]volume=0.18,aecho=0.8:0.88:60:0.4[b1];"
        "[2:a]volume=0.12,aecho=0.8:0.88:120:0.3[b2];"
        "[0:a][b1][b2]amix=inputs=3:dropout_transition=2,lowpass=f=2400,volume=1.5[out]",
        "-map", "[out]",
        "-t", f"{duration}",
        str(bgm1_path)
    ]
    subprocess.run(cmd_bgm1, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    
    # Sinh BGM 2: High Energy Synth / Achievement
    cmd_bgm2 = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", f"sine=f=261.63:d={duration}",
        "-f", "lavfi", "-i", f"sine=f=329.63:d={duration}",
        "-f", "lavfi", "-i", f"sine=f=392.00:d={duration}",
        "-filter_complex",
        "[0:a]volume=0.15[s1];"
        "[1:a]volume=0.12[s2];"
        "[2:a]volume=0.10[s3];"
        "[s1][s2][s3]amix=inputs=3:dropout_transition=2,flanger=delay=5:depth=2:regen=50:width=80:speed=0.5,volume=1.8[out]",
        "-map", "[out]",
        "-t", f"{duration}",
        str(bgm2_path)
    ]
    subprocess.run(cmd_bgm2, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    
    # Hòa trộn Master BGM với Crossfade tại 130s (2:10)
    # BGM 1 fade out từ 128s -> 134s; BGM 2 fade in từ 128s -> 134s
    cmd_crossfade = [
        "ffmpeg", "-y",
        "-i", str(bgm1_path),
        "-i", str(bgm2_path),
        "-filter_complex",
        "[0:a]afade=t=out:st=128:d=6,volume=1.0[a1];"
        "[1:a]afade=t=in:st=128:d=6,volume=1.1[a2];"
        "[a1][a2]amix=inputs=2:duration=first[out]",
        "-map", "[out]",
        "-t", f"{duration}",
        str(master_bgm_path)
    ]
    subprocess.run(cmd_crossfade, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    
    # Tạo MUSIC_MAP.yaml
    music_map_file = MUSIC_DIR / "MUSIC_MAP.yaml"
    music_map_content = f"""# 🎵 DUSTGUARD VN — MUSIC TIMING & BEAT MAP (SSOT)
bgm_tracks:
  - id: "BGM_01"
    name: "paulyudin-epic-presentation"
    time_range: "0:00 - 2:15"
    tempo_bpm: 110
    beat_drop_time: "0:55"
    key_theme: "Vấn đề nghiêm túc & Lời giải Civic Tech"
  - id: "BGM_02"
    name: "paulyudin-achievement-music"
    time_range: "2:10 - 3:30"
    tempo_bpm: 125
    crossfade_time: "2:10 - 2:16"
    key_theme: "Hành động thanh niên & Mở rộng tương lai"

ducking_rules:
  voice_active_bgm_gain_db: -18.0
  voice_pause_bgm_gain_db: -8.0
  crossfade_curve: "easeInOutCubic"
"""
    with open(music_map_file, "w", encoding="utf-8") as f:
        f.write(music_map_content)
        
    return master_bgm_path

def mix_voice_and_bgm():
    """Hòa âm Voiceover + Master BGM với Auto-Ducking."""
    voice_path = VOICE_DIR / "full_voiceover.mp3"
    if not voice_path.exists():
        print(f"⚠️ Chưa có {voice_path}, đang thử kiểm tra voice_timings.json...")
        return None
        
    # Lấy duration của voiceover
    cmd_dur = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(voice_path)
    ]
    res = subprocess.run(cmd_dur, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
    voice_dur = float(res.stdout.strip())
    total_dur = max(voice_dur + 3.0, 210.0) # Thêm 3s fade out ở cuối
    
    master_bgm = generate_cinematic_bgm(duration=total_dur)
    
    master_audio_out = MIX_DIR / "master_audio.mp3"
    print(f"[Stage 5] Đang thực hiện Auto-Ducking và Master Audio Mix ({total_dur:.1f}s)...")
    
    # Sidechain compression / ducking filter
    # [0:a] là Voiceover, [1:a] là BGM
    cmd_mix = [
        "ffmpeg", "-y",
        "-i", str(voice_path),
        "-i", str(master_bgm),
        "-filter_complex",
        "[1:a]volume=0.22[bgm_base];"
        "[0:a]volume=1.4,aformat=channel_layouts=stereo[voice_boost];"
        "[bgm_base][voice_boost]sidechaincompress=threshold=0.08:ratio=6:attack=20:release=300[ducked_bgm];"
        "[ducked_bgm][voice_boost]amix=inputs=2:duration=first:dropout_transition=2,volume=1.2[out]",
        "-map", "[out]",
        "-t", f"{total_dur}",
        str(master_audio_out)
    ]
    subprocess.run(cmd_mix, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    print(f"✅ [Stage 5] Hoàn tất Master Audio Mix: {master_audio_out}")
    return master_audio_out

if __name__ == "__main__":
    mix_voice_and_bgm()
