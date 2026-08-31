#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==============================================================================
🚀 DUSTGUARD VN — MASTER PRODUCTION PIPELINE ORCHESTRATOR
==============================================================================
Điều phối toàn diện quy trình sản xuất Video Thuyết trình và Ấn phẩm Triển lãm:
Stage 1: Voiceover Synthesis (Edge-TTS 48kHz)
Stage 2: Subtitle Sync & Verification (Broadcast SRT)
Stage 3: Footage & Resource Indexing (ffprobe auto-discovery)
Stage 4: Motion Graphics & Civic Overlays (Pillow High-Contrast)
Stage 5: Audio Synthesis & Auto-Ducking Mix (Beat Drop 0:55, Crossfade 2:10)
Stage 6: Timeline & Segment Plans SSOT (TIMELINE.json & 12 YAMLs)
Stage 7: Master Video 1080p Render (FFmpeg Ken Burns, Overlays & Subtitles)
Stage 8: Content QC & Technical Audit (Anti-overclaim & Spec check)
Stage 9: Backdrop 70x90cm Print Build (300 DPI Standee Poster)
==============================================================================
"""

import os
import sys
import time
import argparse
import subprocess
from pathlib import Path

# Cấu hình UTF-8 cho Windows Console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = Path(__file__).resolve().parent.parent
SCRIPTS_DIR = BASE_DIR / "scripts"
OUTPUT_DIR = BASE_DIR / "07_output"

STAGES = [
    (1, "Voiceover Synthesis", "generate_voiceover.py", "Sinh 12 file giọng đọc tiếng Việt chuẩn 48kHz"),
    (2, "Subtitle Sync & SRT", "sync_subtitles.py", "Đồng bộ phụ đề SRT chuẩn broadcast theo voice timings"),
    (3, "Footage & Resource Indexing", "index_sources.py", "Quét tài nguyên video, ảnh, slide qua ffprobe"),
    (4, "Motion Graphics Overlays", "build_motion_graphics.py", "Tạo các lớp đồ họa Civic Tech High-Contrast"),
    (5, "Audio Synthesis & Ducking Mix", "build_audio_mix.py", "Tổng hợp BGM 2 giai đoạn và hòa âm auto-ducking"),
    (6, "Timeline & Segment Plans", "build_timeline.py", "Xây dựng TIMELINE.json và 12 segment plans YAML"),
    (7, "Master Video 1080p Render", "render_final.py", "Ghép nối video, Ken Burns, Overlays, Voice & Subtitles"),
    (8, "Content QC & Tech Audit", "qc_final.py", "Kiểm định kỹ thuật và anti-overclaim words"),
    (9, "Backdrop 70x90cm Print Build", "build_backdrop.py", "Sinh HTML Renderer và ảnh Poster 300 DPI")
]

def print_banner():
    banner = """
==============================================================================
  🎬 DUSTGUARD VN — MASTER PRODUCTION PIPELINE ORCHESTRATOR
  CivicTech Platform for Environmental Evidence & Follow-up (UNICEF 2026)
==============================================================================
"""
    print(banner)

def run_script(script_name, extra_args=None):
    """Chạy một script con trong scripts/."""
    script_path = SCRIPTS_DIR / script_name
    if not script_path.exists():
        print(f"❌ Lỗi: Không tìm thấy script {script_path}")
        return False
        
    cmd = [sys.executable, str(script_path)]
    if extra_args:
        cmd.extend(extra_args)
        
    start_t = time.time()
    try:
        res = subprocess.run(cmd, check=True)
        elapsed = time.time() - start_t
        print(f"  ⏱️ Thời gian thực thi: {elapsed:.2f}s")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Lỗi khi thực thi {script_name}: Mã thoát {e.returncode}")
        return False

def show_status():
    """Hiển thị trạng thái các deliverables."""
    print("\n📦 TRẠNG THÁI CÁC SẢN PHẨM SẢN XUẤT (DELIVERABLES):")
    deliverables = [
        ("Kịch bản thoại Master", BASE_DIR / "01_script" / "master_voiceover.md"),
        ("Phụ đề final.srt", BASE_DIR / "01_script" / "subtitles" / "final.srt"),
        ("Chỉ mục SOURCE_INDEX.csv", BASE_DIR / "02_sources" / "SOURCE_INDEX.csv"),
        ("12 Voice WAV/MP3 files", BASE_DIR / "04_audio" / "voice_final" / "full_voiceover.mp3"),
        ("BGM Master Soundtrack", BASE_DIR / "04_audio" / "music" / "master_bgm.mp3"),
        ("Master Audio (Mix Voice+BGM)", BASE_DIR / "04_audio" / "mix" / "master_audio.mp3"),
        ("TIMELINE.json SSOT", BASE_DIR / "TIMELINE.json"),
        ("Master Video 1080p Raw", BASE_DIR / "07_output" / "final" / "DustGuardVN_Final_3m30_1080p.mp4"),
        ("Master Video có Phụ đề", BASE_DIR / "07_output" / "final" / "DustGuardVN_Final_3m30_1080p_subtitles.mp4"),
        ("Báo cáo QC_REPORT.md", BASE_DIR / "07_output" / "QC_REPORT.md"),
        ("Backdrop HTML Renderer", BASE_DIR / "backdrop_70x90_renderer.html"),
        ("Backdrop Standee 300 DPI", BASE_DIR / "07_output" / "backdrop" / "DustGuardVN_Backdrop_70x90cm_300DPI.png")
    ]
    
    for name, path in deliverables:
        if path.exists():
            size_mb = path.stat().st_size / (1024 * 1024)
            if size_mb >= 1.0:
                size_str = f"{size_mb:.2f} MB"
            else:
                size_str = f"{path.stat().st_size / 1024:.1f} KB"
            print(f"  ✅ {name:<32}: [ĐÃ TẠO] ({size_str}) -> {path.relative_to(BASE_DIR)}")
        else:
            print(f"  ⏳ {name:<32}: [CHƯA TẠO]")
    print()

def main():
    print_banner()
    
    parser = argparse.ArgumentParser(description="DustGuard VN Master Production Pipeline")
    parser.add_argument("--stage", type=int, choices=range(1, 10), help="Chạy riêng lẻ 1 Stage cụ thể (1-9)")
    parser.add_argument("--skip-render", action="store_true", help="Bỏ qua bước render video nặng (Stage 7)")
    parser.add_argument("--fast", action="store_true", help="Chế độ render siêu tốc")
    parser.add_argument("--clean", action="store_true", help="Dọn dẹp thư mục tạm trước khi chạy")
    parser.add_argument("--status", action="store_true", help="Kiểm tra trạng thái các sản phẩm")
    
    args = parser.parse_args()
    
    if args.status:
        show_status()
        return
        
    if args.clean:
        temp_dir = BASE_DIR / "06_temp"
        if temp_dir.exists():
            for f in temp_dir.glob("*"):
                try:
                    f.unlink()
                except Exception:
                    pass
            print("🧹 Đã dọn dẹp thư mục tạm 06_temp/")

    total_start = time.time()
    
    if args.stage:
        # Chạy 1 stage cụ thể
        st_num, st_name, st_script, st_desc = STAGES[args.stage - 1]
        print(f"\n▶️ BẮT ĐẦU STAGE {st_num}: {st_name} ({st_desc})")
        extra = ["--fast"] if (st_num == 7 and args.fast) else None
        success = run_script(st_script, extra_args=extra)
        if not success:
            print(f"❌ Stage {st_num} thất bại!")
            sys.exit(1)
    else:
        # Chạy toàn bộ Pipeline
        print("🚀 BẮT ĐẦU CHẠY TOÀN BỘ 9 STAGES CỦA PIPELINE SẢN XUẤT...")
        
        for st_num, st_name, st_script, st_desc in STAGES:
            if st_num == 7 and args.skip_render:
                print(f"\n⏩ BỎ QUA STAGE 7: {st_name} (--skip-render được bật)")
                continue
                
            print(f"\n▶️ [Stage {st_num}/9] {st_name}: {st_desc}")
            extra = ["--fast"] if (st_num == 7 and args.fast) else None
            success = run_script(st_script, extra_args=extra)
            if not success:
                print(f"\n❌ Pipeline dừng lại do lỗi ở Stage {st_num}: {st_name}")
                sys.exit(1)
                
    total_elapsed = time.time() - total_start
    print("\n" + "="*78)
    print(f"🎉 TOÀN BỘ QUY TRÌNH PIPELINE SẢN XUẤT ĐÃ HOÀN TẤT THÀNH CÔNG!")
    print(f"⏱️ Tổng thời gian thực thi: {total_elapsed:.2f}s ({int(total_elapsed//60)}m{int(total_elapsed%60)}s)")
    print("="*78)
    
    show_status()

if __name__ == "__main__":
    main()
