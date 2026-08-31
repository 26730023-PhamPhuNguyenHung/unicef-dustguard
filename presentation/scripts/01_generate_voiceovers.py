#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DustGuard VN — Automated Voiceover & Audio Synthesis Pipeline
Generates studio-grade voiceovers for all 12 presentation segments using edge-tts,
normalizes loudness via ffmpeg EBU R128 (-16 LUFS), creates timeline-aligned master audio,
and produces a comprehensive ffprobe manifest.
"""

import os
import re
import sys
import json
import asyncio
import argparse
import subprocess
from pathlib import Path

# Set UTF-8 encoding for standard output
sys.stdout.reconfigure(encoding='utf-8')

# Timeline segments specification SSOT
SEGMENTS_SPEC = [
    {
        "id": "01_hook",
        "title": "Mở vấn đề",
        "start_time": 0.0,
        "end_time": 18.0,
        "target_duration": 18.0,
        "script_file": "presentation/01_script/segments/01_hook.md"
    },
    {
        "id": "02_problem",
        "title": "Nút thắt dữ liệu",
        "start_time": 18.0,
        "end_time": 38.0,
        "target_duration": 20.0,
        "script_file": "presentation/01_script/segments/02_problem.md"
    },
    {
        "id": "03_context",
        "title": "5 Câu hỏi trung tâm",
        "start_time": 38.0,
        "end_time": 55.0,
        "target_duration": 17.0,
        "script_file": "presentation/01_script/segments/03_context.md"
    },
    {
        "id": "04_solution",
        "title": "DustGuard xuất hiện",
        "start_time": 55.0,
        "end_time": 70.0,
        "target_duration": 15.0,
        "script_file": "presentation/01_script/segments/04_solution.md"
    },
    {
        "id": "05_core_logic",
        "title": "Tính mới của giải pháp",
        "start_time": 70.0,
        "end_time": 90.0,
        "target_duration": 20.0,
        "script_file": "presentation/01_script/segments/05_core_logic.md"
    },
    {
        "id": "06_workshop_lesson",
        "title": "Bài học sau tập huấn",
        "start_time": 90.0,
        "end_time": 109.0,
        "target_duration": 19.0,
        "script_file": "presentation/01_script/segments/06_workshop_lesson.md"
    },
    {
        "id": "07_responsible_ai",
        "title": "AI đúng vai trò (Responsible AI)",
        "start_time": 109.0,
        "end_time": 128.0,
        "target_duration": 19.0,
        "script_file": "presentation/01_script/segments/07_responsible_ai.md"
    },
    {
        "id": "08_lean_pilot",
        "title": "Mô hình Lean Pilot",
        "start_time": 128.0,
        "end_time": 148.0,
        "target_duration": 20.0,
        "script_file": "presentation/01_script/segments/08_lean_pilot.md"
    },
    {
        "id": "09_metrics",
        "title": "Đo lường giá trị thật",
        "start_time": 148.0,
        "end_time": 165.0,
        "target_duration": 17.0,
        "script_file": "presentation/01_script/segments/09_metrics.md"
    },
    {
        "id": "10_community",
        "title": "Vai trò cộng đồng",
        "start_time": 165.0,
        "end_time": 180.0,
        "target_duration": 15.0,
        "script_file": "presentation/01_script/segments/10_community.md"
    },
    {
        "id": "11_expansion",
        "title": "Tầm nhìn mở rộng",
        "start_time": 180.0,
        "end_time": 197.0,
        "target_duration": 17.0,
        "script_file": "presentation/01_script/segments/11_expansion.md"
    },
    {
        "id": "12_closing",
        "title": "Kết mạnh & Sứ mệnh",
        "start_time": 197.0,
        "end_time": 210.0,
        "target_duration": 13.0,
        "script_file": "presentation/01_script/segments/12_closing.md"
    }
]

def extract_script_text(file_path: str) -> str:
    """Extract clean speech text from segment markdown file."""
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"Script file not found: {file_path}")
    
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Match blockquote or text after '### Lời thoại:'
    lines = content.splitlines()
    text_lines = []
    in_dialogue = False
    for line in lines:
        stripped = line.strip()
        if "Lời thoại:" in stripped or "### Lời thoại" in stripped:
            in_dialogue = True
            continue
        if in_dialogue:
            if stripped.startswith(">"):
                clean = stripped.lstrip(">").strip()
                if clean:
                    text_lines.append(clean)
            elif stripped and not stripped.startswith("#") and not stripped.startswith("**"):
                text_lines.append(stripped)
            elif stripped.startswith("#"):
                break
    
    full_text = " ".join(text_lines)
    # Clean quotation marks and formatting
    full_text = re.sub(r'^[“"\'\s]+|[”"\'\s]+$', '', full_text).strip()
    return full_text

def get_audio_info(file_path: str) -> dict:
    """Extract precise duration and stream audio info using ffprobe."""
    cmd = [
        "ffprobe",
        "-v", "quiet",
        "-print_format", "json",
        "-show_format",
        "-show_streams",
        str(file_path)
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"ffprobe failed on {file_path}: {res.stderr}")
    
    data = json.loads(res.stdout)
    fmt = data.get("format", {})
    stream = data.get("streams", [{}])[0]
    
    return {
        "duration": float(fmt.get("duration", 0.0)),
        "size_bytes": int(fmt.get("size", 0)),
        "bit_rate": int(fmt.get("bit_rate", 0)),
        "sample_rate": int(stream.get("sample_rate", 48000)),
        "channels": int(stream.get("channels", 2)),
        "codec_name": stream.get("codec_name", "unknown")
    }

def normalize_and_convert(raw_mp3: str, out_wav: str, out_mp3: str):
    """
    Apply high-quality audio normalization (EBU R128 -16 LUFS, true peak -1.0dB)
    and export both WAV (24-bit 48kHz PCM) and MP3 (320kbps 48kHz).
    """
    # 1. Convert & normalize to 48kHz 24-bit WAV
    cmd_wav = [
        "ffmpeg", "-y",
        "-i", str(raw_mp3),
        "-af", "loudnorm=I=-16:TP=-1.0:LRA=11,aresample=48000",
        "-c:a", "pcm_s24le",
        str(out_wav)
    ]
    res_wav = subprocess.run(cmd_wav, capture_output=True, text=True)
    if res_wav.returncode != 0:
        raise RuntimeError(f"FFmpeg WAV conversion failed: {res_wav.stderr}")

    # 2. Convert WAV to normalized MP3 (320kbps, 48kHz)
    cmd_mp3 = [
        "ffmpeg", "-y",
        "-i", str(out_wav),
        "-c:a", "libmp3lame",
        "-b:a", "320k",
        "-ar", "48000",
        str(out_mp3)
    ]
    res_mp3 = subprocess.run(cmd_mp3, capture_output=True, text=True)
    if res_mp3.returncode != 0:
        raise RuntimeError(f"FFmpeg MP3 conversion failed: {res_mp3.stderr}")

async def generate_segment_tts(text: str, voice: str, rate: str, pitch: str, raw_output_path: str):
    """Generate raw audio file using edge-tts with retry."""
    import edge_tts
    max_retries = 4
    for attempt in range(1, max_retries + 1):
        try:
            communicate = edge_tts.Communicate(text=text, voice=voice, rate=rate, pitch=pitch)
            await communicate.save(raw_output_path)
            # Verify file exists and is not 0 bytes
            p = Path(raw_output_path)
            if p.exists() and p.stat().st_size > 1000:
                return
            print(f"    [Retry {attempt}/{max_retries}] File empty, retrying TTS...")
        except Exception as e:
            print(f"    [Retry {attempt}/{max_retries}] TTS Exception: {e}")
        await asyncio.sleep(1.5)
    raise RuntimeError(f"Failed to generate TTS after {max_retries} attempts: {raw_output_path}")

def build_timeline_master(segment_files: list, output_master_wav: str, output_master_mp3: str, total_duration: float = 210.0):
    """
    Construct a timeline-aligned master track with exact segment start timestamps,
    filling silence between clips so that every voice segment starts precisely on beat.
    """
    filter_inputs = []
    filter_delays = []
    
    for idx, item in enumerate(segment_files):
        start_ms = int(item["start_time"] * 1000)
        filter_inputs.extend(["-i", str(item["wav_path_disk"])])
        # Apply adelay and apad
        filter_delays.append(f"[{idx}:a]adelay={start_ms}|{start_ms}[a{idx}]")
    
    mix_inputs = "".join([f"[a{i}]" for i in range(len(segment_files))])
    filter_complex = f"{';'.join(filter_delays)};{mix_inputs}amix=inputs={len(segment_files)}:normalize=0:dropout_transition=0,apad=whole_dur={total_duration}[out]"
    
    cmd_master_wav = [
        "ffmpeg", "-y",
        *filter_inputs,
        "-filter_complex", filter_complex,
        "-map", "[out]",
        "-c:a", "pcm_s24le",
        "-ar", "48000",
        "-t", str(total_duration),
        str(output_master_wav)
    ]
    res = subprocess.run(cmd_master_wav, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"Failed to generate timeline master WAV: {res.stderr}")
    
    # Export to 320kbps MP3
    cmd_master_mp3 = [
        "ffmpeg", "-y",
        "-i", str(output_master_wav),
        "-c:a", "libmp3lame",
        "-b:a", "320k",
        "-ar", "48000",
        str(output_master_mp3)
    ]
    subprocess.run(cmd_master_mp3, capture_output=True, check=True)

def build_continuous_master(segment_files: list, output_continuous_wav: str, output_continuous_mp3: str, gap_seconds: float = 0.6):
    """Build a natural continuous speech master with uniform small breath gaps."""
    filter_inputs = []
    for item in segment_files:
        filter_inputs.extend(["-i", str(item["wav_path_disk"])])
    
    # Create silent gap filter or concat
    concat_filter = []
    for idx in range(len(segment_files)):
        concat_filter.append(f"[{idx}:a]apad=pad_dur={gap_seconds}[a{idx}]")
    
    concat_streams = "".join([f"[a{i}]" for i in range(len(segment_files))])
    filter_complex = f"{';'.join(concat_filter)};{concat_streams}concat=n={len(segment_files)}:v=0:a=1[out]"
    
    cmd_cont_wav = [
        "ffmpeg", "-y",
        *filter_inputs,
        "-filter_complex", filter_complex,
        "-map", "[out]",
        "-c:a", "pcm_s24le",
        "-ar", "48000",
        str(output_continuous_wav)
    ]
    res = subprocess.run(cmd_cont_wav, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"Failed to generate continuous master WAV: {res.stderr}")
    
    # Export to MP3
    cmd_cont_mp3 = [
        "ffmpeg", "-y",
        "-i", str(output_continuous_wav),
        "-c:a", "libmp3lame",
        "-b:a", "320k",
        "-ar", "48000",
        str(output_continuous_mp3)
    ]
    subprocess.run(cmd_cont_mp3, capture_output=True, check=True)

async def main():
    parser = argparse.ArgumentParser(description="DustGuard VN Voiceover Generator")
    parser.add_argument("--voice", default="vi-VN-NamMinhNeural", help="Edge TTS Voice name (default: vi-VN-NamMinhNeural)")
    parser.add_argument("--rate", default="+6%", help="Speech rate adjustment (default: +6%%)")
    parser.add_argument("--pitch", default="+0Hz", help="Speech pitch adjustment (default: +0Hz)")
    parser.add_argument("--out-dir", default="presentation/04_audio/voiceover", help="Output directory for voiceover audio")
    parser.add_argument("--manifest", default="presentation/04_audio/voiceover_manifest.json", help="Manifest JSON output path")
    args = parser.parse_args()

    out_dir = Path(args.out_dir)
    raw_dir = out_dir / "raw_temp"
    out_dir.mkdir(parents=True, exist_ok=True)
    raw_dir.mkdir(parents=True, exist_ok=True)

    manifest_path = Path(args.manifest)
    manifest_path.parent.mkdir(parents=True, exist_ok=True)

    print("=" * 70)
    print("🎙️ DUSTGUARD VN — VOICEOVER SYNTHESIS PIPELINE")
    print(f"Voice Engine: {args.voice} | Rate: {args.rate} | Pitch: {args.pitch}")
    print(f"Output Directory: {out_dir.resolve()}")
    print("=" * 70)

    processed_segments = []

    for idx, spec in enumerate(SEGMENTS_SPEC, 1):
        seg_id = spec["id"]
        title = spec["title"]
        script_file = spec["script_file"]
        text = extract_script_text(script_file)
        
        print(f"\n[{idx:02d}/12] Processing Segment: {seg_id} ({title})")
        print(f"    Target Window: {spec['start_time']}s - {spec['end_time']}s ({spec['target_duration']}s)")
        print(f"    Script snippet: \"{text[:60]}...\"")

        raw_mp3 = raw_dir / f"raw_{seg_id}.mp3"
        out_wav = out_dir / f"segment_{seg_id}.wav"
        out_mp3 = out_dir / f"segment_{seg_id}.mp3"

        # 1. Generate Raw TTS
        await generate_segment_tts(text, args.voice, args.rate, args.pitch, str(raw_mp3))
        
        # 2. Normalize and export WAV & MP3
        normalize_and_convert(str(raw_mp3), str(out_wav), str(out_mp3))

        # 3. Inspect with ffprobe
        info_wav = get_audio_info(str(out_wav))
        info_mp3 = get_audio_info(str(out_mp3))
        
        breathing_room = spec["target_duration"] - info_mp3["duration"]
        
        print(f"    [OK] Generated & Normalized: {info_mp3['duration']:.2f}s (Margin: {breathing_room:+.2f}s)")
        
        processed_segments.append({
            "segment_index": idx,
            "id": seg_id,
            "title": title,
            "start_time": spec["start_time"],
            "end_time": spec["end_time"],
            "target_duration": spec["target_duration"],
            "speech_duration": round(info_mp3["duration"], 2),
            "breathing_room_seconds": round(breathing_room, 2),
            "voice_actor": args.voice,
            "speech_rate": args.rate,
            "speech_pitch": args.pitch,
            "text": text,
            "script_file": script_file,
            "mp3_path": str(out_mp3.as_posix()),
            "wav_path": str(out_wav.as_posix()),
            "wav_path_disk": str(out_wav.resolve()),
            "format_details": {
                "sample_rate": info_wav["sample_rate"],
                "channels": info_wav["channels"],
                "wav_codec": info_wav["codec_name"],
                "mp3_bitrate": info_mp3["bit_rate"],
                "wav_size_bytes": info_wav["size_bytes"],
                "mp3_size_bytes": info_mp3["size_bytes"]
            }
        })

    # Generate Master Tracks
    print("\n" + "=" * 70)
    print("🎼 GENERATING MASTER VOICEOVER TRACKS...")
    
    # 1. Timeline-Aligned Master Track (210s)
    master_timeline_wav = out_dir / "master_voiceover_timeline_aligned.wav"
    master_timeline_mp3 = out_dir / "master_voiceover_timeline_aligned.mp3"
    build_timeline_master(processed_segments, str(master_timeline_wav), str(master_timeline_mp3), total_duration=210.0)
    master_tl_info = get_audio_info(str(master_timeline_mp3))
    print(f"    [OK] Master Timeline Aligned: {master_timeline_mp3.name} ({master_tl_info['duration']:.2f}s)")

    # 2. Continuous Speech Master Track
    master_cont_wav = out_dir / "master_voiceover_continuous.wav"
    master_cont_mp3 = out_dir / "master_voiceover_continuous.mp3"
    build_continuous_master(processed_segments, str(master_cont_wav), str(master_cont_mp3), gap_seconds=0.6)
    master_cont_info = get_audio_info(str(master_cont_mp3))
    print(f"    [OK] Master Continuous Track: {master_cont_mp3.name} ({master_cont_info['duration']:.2f}s)")

    # Clean up raw temp files
    for f in raw_dir.glob("*"):
        try:
            f.unlink()
        except Exception:
            pass
    try:
        raw_dir.rmdir()
    except Exception:
        pass

    # Build Master Manifest
    # Strip temporary disk paths from segments manifest
    clean_segments = []
    for s in processed_segments:
        s_copy = dict(s)
        s_copy.pop("wav_path_disk", None)
        clean_segments.append(s_copy)

    manifest_data = {
        "project": "DustGuard VN Presentation Voiceover",
        "created_at": "2026-08-31T12:15:00+07:00",
        "voice_configuration": {
            "voice": args.voice,
            "rate": args.rate,
            "pitch": args.pitch,
            "normalization_standard": "EBU R128 (-16 LUFS, TP -1.0 dBFS, LRA 11)",
            "sample_rate_hz": 48000,
            "channels": 2
        },
        "master_tracks": {
            "timeline_aligned": {
                "description": "210-second master track aligned to presentation timestamps (0:00 - 3:30) with exact timing pads.",
                "mp3": str(master_timeline_mp3.as_posix()),
                "wav": str(master_timeline_wav.as_posix()),
                "duration": round(master_tl_info["duration"], 2),
                "sample_rate": master_tl_info["sample_rate"],
                "bitrate": master_tl_info["bit_rate"]
            },
            "continuous": {
                "description": "Sequential speech track with natural 0.6s breath pauses between segments.",
                "mp3": str(master_cont_mp3.as_posix()),
                "wav": str(master_cont_wav.as_posix()),
                "duration": round(master_cont_info["duration"], 2),
                "sample_rate": master_cont_info["sample_rate"],
                "bitrate": master_cont_info["bit_rate"]
            }
        },
        "segments": clean_segments
    }

    with open(manifest_path, "w", encoding="utf-8") as mf:
        json.dump(manifest_data, mf, ensure_ascii=False, indent=2)

    print(f"\n[OK] Manifest saved successfully at: {manifest_path.resolve()}")
    print("=" * 70)
    print("🎉 ALL 12 VOICEOVER SEGMENTS & MASTER TRACKS READY!")

if __name__ == "__main__":
    asyncio.run(main())
