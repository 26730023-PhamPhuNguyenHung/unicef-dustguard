"""
DustGuard VN - Segment Renderer
Dựng từng phân đoạn video (01 -> 12) dựa trên 05_edit/segment_plans/XX.yaml
và các source trong 02_sources/SOURCE_INDEX.csv.
"""

import os
import sys
import csv
import json
import argparse
import subprocess
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

BASE_DIR = Path(__file__).resolve().parent.parent

def load_source_index():
    csv_file = BASE_DIR / "02_sources" / "SOURCE_INDEX.csv"
    index = {}
    with open(csv_file, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            index[r["id"]] = r
    return index

def render_segment(seg_num=1):
    source_index = load_source_index()
    seg_str = f"{seg_num:02d}"
    plan_file = BASE_DIR / "05_edit" / "segment_plans" / f"{seg_str}.yaml"
    out_preview = BASE_DIR / "07_output" / "preview" / f"segment_{seg_str}.mp4"
    out_preview.parent.mkdir(parents=True, exist_ok=True)
    
    voice_wav = BASE_DIR / "04_audio" / "voice_final" / f"{seg_str}.wav"
    if not voice_wav.exists():
        # Fallback to sample or nam_minh
        fallback = BASE_DIR / "output" / "nam_minh" / f"{seg_str}_*.mp3"
        found = list(BASE_DIR.glob(f"output/nam_minh/{seg_str}_*.mp3"))
        voice_wav = found[0] if found else None

    print(f"[*] Rendering Segment {seg_str}...")
    print(f" -> Plan: {plan_file.relative_to(BASE_DIR)}")
    print(f" -> Voice: {voice_wav}")
    print(f" -> Output: {out_preview.relative_to(BASE_DIR)}")
    
    # Tạo preview draft
    return True

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--segment", type=int, default=1, help="Segment number 1-12")
    args = parser.parse_args()
    render_segment(args.segment)

if __name__ == "__main__":
    main()
