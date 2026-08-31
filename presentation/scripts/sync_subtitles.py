#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
📝 DUSTGUARD VN — SUBTITLE SYNCHRONIZER
Tự động đồng bộ và định dạng phụ đề SRT chuẩn phát sóng truyền hình
dựa trên các mốc thời gian thực tế của 12 phân đoạn Voiceover.
"""

import os
import sys
import json
import re
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = Path(__file__).resolve().parent.parent
TIMINGS_FILE = BASE_DIR / "04_audio" / "voice_final" / "voice_timings.json"
SUBTITLE_OUT = BASE_DIR / "01_script" / "subtitles" / "final.srt"

def format_timestamp(seconds):
    """Chuyển đổi giây dạng float sang định dạng SRT: 00:00:00,000"""
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    milis = int(round((seconds - int(seconds)) * 1000))
    if milis >= 1000:
        secs += 1
        milis -= 1000
    return f"{hrs:02d}:{mins:02d}:{secs:02d},{milis:03d}"

def split_text_into_chunks(text, max_words=12):
    """Chia nhỏ câu thoại thành các khối ngắn vừa mắt người xem."""
    sentences = re.split(r'(?<=[.?!…])\s+', text.strip())
    chunks = []
    for sent in sentences:
        words = sent.split()
        if len(words) <= max_words:
            chunks.append(sent)
        else:
            # Chia nhỏ theo cụm từ
            curr = []
            for w in words:
                curr.append(w)
                if len(curr) >= max_words or w.endswith((',', ';', ':')):
                    chunks.append(" ".join(curr))
                    curr = []
            if curr:
                chunks.append(" ".join(curr))
    return chunks

def sync_subtitles():
    print("[Stage 2] Đang đồng bộ hóa phụ đề SRT theo thời lượng Voiceover...")
    
    if not TIMINGS_FILE.exists():
        print(f"❌ Không tìm thấy {TIMINGS_FILE}. Vui lòng chạy generate_voiceover.py trước!")
        return False
        
    with open(TIMINGS_FILE, "r", encoding="utf-8") as f:
        timings = json.load(f)
        
    srt_entries = []
    counter = 1
    
    for seg in timings:
        seg_start = seg.get("start_time", 0.0)
        seg_dur = seg.get("duration", 0.0)
        text = seg.get("text", "")
        
        chunks = split_text_into_chunks(text)
        if not chunks:
            continue
            
        # Phân bổ thời lượng theo số lượng từ của từng chunk
        total_words = sum(len(c.split()) for c in chunks)
        current_chunk_start = seg_start
        
        for c in chunks:
            c_words = len(c.split())
            ratio = c_words / max(total_words, 1)
            c_dur = seg_dur * ratio
            c_end = min(current_chunk_start + c_dur, seg_start + seg_dur)
            
            # Đảm bảo không chồng lấn
            start_str = format_timestamp(current_chunk_start)
            end_str = format_timestamp(c_end)
            
            srt_entries.append(f"{counter}\n{start_str} --> {end_str}\n{c}\n")
            counter += 1
            current_chunk_start = c_end
            
    SUBTITLE_OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(SUBTITLE_OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(srt_entries))
        
    print(f"-> Đã xuất {counter-1} dòng phụ đề SRT vào {SUBTITLE_OUT}")
    return True

if __name__ == "__main__":
    sync_subtitles()
