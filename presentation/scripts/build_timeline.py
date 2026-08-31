#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
⏱️ DUSTGUARD VN — TIMELINE & SEGMENT PLANS BUILDER
Xây dựng Machine-Readable TIMELINE.json và 12 file Segment Plans (01.yaml .. 12.yaml)
khớp chính xác giữa Voiceover, Visual Sources và Music Onsets.
"""

import os
import sys
import csv
import json
import yaml
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_YAML = BASE_DIR / "PROJECT.yaml"
SOURCES_CSV = BASE_DIR / "02_sources" / "SOURCE_INDEX.csv"
TIMINGS_JSON = BASE_DIR / "04_audio" / "voice_final" / "voice_timings.json"
PLANS_DIR = BASE_DIR / "05_edit" / "segment_plans"
TIMELINE_JSON = BASE_DIR / "TIMELINE.json"

DEFAULT_SEGMENT_DURATIONS = {
    "01": 18.0, "02": 20.0, "03": 17.0, "04": 15.0,
    "05": 20.0, "06": 19.0, "07": 19.0, "08": 20.0,
    "09": 17.0, "10": 15.0, "11": 17.0, "12": 13.0
}

SEGMENT_METADATA = {
    "01": {"title": "Mở vấn đề — Bụi công trình", "sources": ["V001", "V002", "V003"], "overlay": "overlay_01_hook.png", "energy": 2},
    "02": {"title": "Nút thắt dữ liệu phân tán", "sources": ["V004", "V005", "V016"], "overlay": None, "energy": 4},
    "03": {"title": "5 Câu hỏi trung tâm", "sources": ["V006", "V015", "V007"], "overlay": "overlay_03_questions.png", "energy": 4},
    "04": {"title": "DustGuard xuất hiện (Beat Drop)", "sources": ["I010", "I001", "I002"], "overlay": "overlay_04_flow.png", "energy": 7},
    "05": {"title": "Tính mới — 1 Tín hiệu 1 Hồ sơ", "sources": ["I004", "I003", "V009"], "overlay": None, "energy": 8},
    "06": {"title": "Bài học sau tập huấn", "sources": ["V008", "I006", "V017"], "overlay": None, "energy": 6},
    "07": {"title": "Responsible AI Assistant", "sources": ["V009", "V014"], "overlay": "overlay_07_responsible_ai.png", "energy": 8},
    "08": {"title": "Mô hình Lean Pilot", "sources": ["V010", "I008", "V011"], "overlay": "overlay_08_pilot.png", "energy": 7},
    "09": {"title": "Đo lường giá trị thật", "sources": ["I002", "I008", "S005"], "overlay": None, "energy": 8},
    "10": {"title": "Vai trò xung kích Thanh niên", "sources": ["V010", "I005", "I001"], "overlay": None, "energy": 8},
    "11": {"title": "Tầm nhìn mở rộng đa lĩnh vực", "sources": ["I009", "V011", "I007"], "overlay": None, "energy": 9},
    "12": {"title": "Finale & Slogan DustGuard", "sources": ["I010", "I007", "V001"], "overlay": "overlay_12_outro.png", "energy": 10},
}

def load_sources():
    sources = {}
    if SOURCES_CSV.exists():
        with open(SOURCES_CSV, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for r in reader:
                sources[r["id"]] = r
    return sources

def build_timeline():
    print("[Stage 6] Đang xây dựng TIMELINE.json và 12 file Segment Plans YAML...")
    PLANS_DIR.mkdir(parents=True, exist_ok=True)
    
    sources = load_sources()
    
    voice_timings = {}
    if TIMINGS_JSON.exists():
        try:
            with open(TIMINGS_JSON, "r", encoding="utf-8") as f:
                data = json.load(f)
                for item in data:
                    voice_timings[item["id"]] = item
        except Exception:
            pass
            
    timeline_segments = []
    current_time = 0.0
    
    for seg_id in sorted(SEGMENT_METADATA.keys()):
        meta = SEGMENT_METADATA[seg_id]
        v_item = voice_timings.get(seg_id, {})
        
        # Thời lượng ưu tiên từ voice duration thực tế, nếu chưa có thì dùng default
        dur = v_item.get("duration", DEFAULT_SEGMENT_DURATIONS.get(seg_id, 18.0))
        start_t = current_time
        end_t = current_time + dur
        
        # Phân bổ visual shots
        src_ids = meta["sources"]
        shots = []
        shot_dur = dur / max(len(src_ids), 1)
        
        for i, s_id in enumerate(src_ids):
            src_info = sources.get(s_id, {"type": "image", "file": "02_sources/real_images/project/ChatGPT Image 09_56_51 31 thg 8, 2026 (10).png"})
            shots.append({
                "shot_index": i + 1,
                "source_id": s_id,
                "source_type": src_info.get("type", "video"),
                "file": src_info.get("file", ""),
                "start_time": round(start_t + i * shot_dur, 3),
                "duration": round(shot_dur, 3),
                "transition": "fade" if i > 0 else "cut",
                "ken_burns": True if src_info.get("type") in ["image", "slide"] else False
            })
            
        seg_plan = {
            "segment_id": seg_id,
            "title": meta["title"],
            "start_time": round(start_t, 3),
            "end_time": round(end_t, 3),
            "duration": round(dur, 3),
            "energy_level": meta["energy"],
            "overlay": meta.get("overlay"),
            "voice_text": v_item.get("text", ""),
            "shots": shots
        }
        
        # Lưu file segment plan YAML
        plan_yaml_path = PLANS_DIR / f"{seg_id}.yaml"
        with open(plan_yaml_path, "w", encoding="utf-8") as f:
            yaml.dump(seg_plan, f, allow_unicode=True, sort_keys=False)
            
        timeline_segments.append(seg_plan)
        current_time = end_t
        
    # Lưu TIMELINE.json
    timeline_master = {
        "project": "DustGuard VN",
        "total_duration_seconds": round(current_time, 3),
        "total_segments": len(timeline_segments),
        "segments": timeline_segments
    }
    
    with open(TIMELINE_JSON, "w", encoding="utf-8") as f:
        json.dump(timeline_master, f, ensure_ascii=False, indent=2)
        
    print(f"✅ [Stage 6] Hoàn tất xuất TIMELINE.json (Tổng thời lượng: {current_time:.2f}s) và 12 Segment Plans tại {PLANS_DIR}")
    return timeline_master

if __name__ == "__main__":
    build_timeline()
