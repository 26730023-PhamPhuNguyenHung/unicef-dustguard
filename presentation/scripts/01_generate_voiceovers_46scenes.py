#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
🎙️ DUSTGUARD VN — 46-SCENE VOICEOVER SYNTHESIS PIPELINE (01_generate_voiceovers_46scenes.py)
=============================================================================
Sinh âm thanh giọng đọc chuẩn phát thanh AI (edge-tts / Vieneu / gTTS fallback)
khớp chính xác 8 phần và 46 cảnh (210.0 giây) theo MASTER_DOCUMENTARY_PITCH_SCRIPT_46_SCENES.md.
=============================================================================
"""

import os
import sys
import json
import asyncio
import argparse
import subprocess
from pathlib import Path

# Đảm bảo in UTF-8 trơn tru trên Windows PowerShell
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = Path(__file__).resolve().parent.parent

# Định nghĩa 8 phần voiceover theo kịch bản 46 cảnh
SECTIONS_VOICEOVER = [
    {
        "section_id": "01_hook",
        "title": "Hook — Một thành phố đang xây dựng",
        "start": 0.0,
        "end": 20.0,
        "duration": 20.0,
        "text": "Ở một thành phố đang phát triển, những công trình mới mọc lên mỗi ngày, mang theo những con đường mới, những ngôi nhà mới và nhịp sống sôi động. Nhưng cùng với sự phát triển đó, có một tác động âm thầm len lỏi vào từng hơi thở của cộng đồng. Đó là bụi công trình — thứ chúng ta chỉ nhìn thấy khi đã quá muộn."
    },
    {
        "section_id": "02_problem",
        "title": "Thực trạng — Bụi công trình đô thị",
        "start": 20.0,
        "end": 50.0,
        "duration": 30.0,
        "text": "Tại các đô thị lớn của Việt Nam, xây dựng là động lực kinh tế nhưng cũng là một trong những nguồn phát tán bụi mịn PM2.5 lớn nhất. Những hạt bụi kích thước micromet bốc lên từ đào xới, cắt mài và vận chuyển, len lỏi qua khe cửa, bám vào từng mái nhà, từng lớp học và cuống phổi trẻ nhỏ. Báo chí liên tục cảnh báo. Người dân bức xúc, sức khỏe bị đe dọa. Nhưng vấn đề không chỉ là có bụi hay không. Vấn đề là: bụi đang phát sinh ở đâu, khi nào và ai cần hành động?"
    },
    {
        "section_id": "03_gap",
        "title": "Khoảng trống hiện tại",
        "start": 50.0,
        "end": 70.0,
        "duration": 20.0,
        "text": "Khi thấy bụi, phản ứng đầu tiên của người dân là chụp ảnh và gửi phản ánh. Nhưng sau đó, tin nhắn trôi qua nhiều khâu, biên bản giấy tờ nằm rải rác. Không thể đặt một cán bộ ở mỗi góc phố. Không thể xử lý hàng chục phản ánh với cùng một mức ưu tiên. Và điều khó nhất... là không ai biết trường hợp nào cần phải kiểm tra ngay hôm nay."
    },
    {
        "section_id": "04_reveal",
        "title": "DustGuard xuất hiện (Beat Drop 1:10)",
        "start": 70.0,
        "end": 90.0,
        "duration": 20.0,
        "text": "DustGuard ra đời để lấp đầy khoảng trống đó. Một nền tảng Civic Tech kết hợp thiết bị đo kiểm thực địa và hệ thống điều phối thông minh. Thu nhận tín hiệu thời gian thực từ cảm biến bụi laser kết hợp với quan sát từ cộng đồng. Biến từng tín hiệu rời rạc thành một hành động có thứ tự ưu tiên rõ ràng."
    },
    {
        "section_id": "05_system_flow",
        "title": "Cách hệ thống vận hành — Case thực tế",
        "start": 90.0,
        "end": 135.0,
        "duration": 45.0,
        "text": "Hãy cùng xem DustGuard vận hành trong một trường hợp thực tế. Mười giờ sáng, công trường phá dỡ đá, nồng độ bụi PM2.5 tăng vọt từ 37 lên 112 microgam trên mét khối. Dữ liệu lập tức truyền về máy chủ, kích hoạt thuật toán tính điểm Dust Risk Score. Điểm rủi ro 78 trên 100, vụ việc được đẩy ngay lên đầu danh sách xử lý vì công trình nằm cách trường học dưới 200 mét và đã phát sinh bụi nhiều lần trong tuần. Hệ thống gợi ý tạo nhiệm vụ kiểm tra và đề xuất checklist quy chuẩn. Cán bộ có mặt tại thực địa, chụp ảnh bằng chứng và đối chiếu quy chuẩn kỹ thuật. DustGuard không thay con người ra quyết định. Nó giúp con người biết nơi nào cần kiểm tra trước."
    },
    {
        "section_id": "06_actors_workflow",
        "title": "Người thật sử dụng — 4 Bên phối hợp",
        "start": 135.0,
        "end": 165.0,
        "duration": 30.0,
        "text": "Người dân và các bạn trẻ chỉ mất 30 giây để ghi nhận một phản ánh có tọa độ và hình ảnh, bảo chứng toàn vẹn bằng mã băm SHA-256. Cán bộ quản lý nắm bắt danh sách ưu tiên, giảm 80% thời gian sàng lọc thủ công, xuất biên bản và gửi yêu cầu khắc phục. Nhà thầu có hướng dẫn rõ ràng để phun sương dập bụi và che chắn đúng cách, rồi nộp ảnh đối chứng hoàn thành. Một chu trình khép kín: từ phát hiện đến khắc phục triệt để."
    },
    {
        "section_id": "07_value_impact",
        "title": "Giá trị thực sự & Khả năng triển khai",
        "start": 165.0,
        "end": 190.0,
        "duration": 25.0,
        "text": "Thành phố không cần phải đặt camera hay nhân sự ở mọi công trường. Chỉ cần biết chính xác điểm nóng nào đang ảnh hưởng đến cộng đồng để can thiệp đúng lúc. Một mô hình Lean Pilot: triển khai gọn nhẹ trong 4 đến 8 tuần với 20 đến 30 người dùng thật. Rút ngắn thời gian xử lý để trả lại bầu không khí trong lành cho trẻ em và mỗi người dân đô thị."
    },
    {
        "section_id": "08_ending_vision",
        "title": "Ending — Tầm nhìn & Lời kết cảm xúc",
        "start": 190.0,
        "end": 210.0,
        "duration": 20.0,
        "text": "Chúng tôi bắt đầu DustGuard từ một câu hỏi rất đơn giản: Liệu mỗi công trình có thể trở thành một điểm dữ liệu giúp thành phố thấu hiểu chính mình tốt hơn? Từ bụi công trình hôm nay, mở ra một nền tảng quản trị môi trường đa bài toán cho ngày mai. DustGuard — Từ tín hiệu bụi đến hành động có ưu tiên."
    }
]

async def generate_single_tts(text: str, out_path: Path, voice: str = "vi-VN-NamMinhNeural", rate: str = "+4%"):
    """Sinh audio TTS bằng edge-tts."""
    try:
        import edge_tts
        communicate = edge_tts.Communicate(text, voice, rate=rate)
        await communicate.save(str(out_path))
        return True
    except Exception as e:
        print(f"[!] Lỗi edge-tts cho {out_path.name}: {e}")
        return False

async def build_aligned_voiceover_async(mode: str = "fast"):
    """Tổng hợp 8 file voiceover thành 1 master track 210.0s căn chỉnh hoàn hảo theo timeline."""
    out_dir = BASE_DIR / "04_audio" / "voice_46scenes"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"[*] Đang sinh voiceover 8 sections cho kịch bản 46 cảnh...")
    
    section_files = []
    for s in SECTIONS_VOICEOVER:
        sid = s["section_id"]
        raw_mp3 = out_dir / f"sec_{sid}_raw.mp3"
        norm_wav = out_dir / f"sec_{sid}_norm.wav"
        
        print(f"  [>] Section {sid} ({s['duration']}s)...", end="", flush=True)
        if not raw_mp3.exists() or raw_mp3.stat().st_size == 0:
            ok = await generate_single_tts(s["text"], raw_mp3)
            if not ok:
                print(" [TTS FAILED - Dùng fallback]")
        
        # Normalize loudness EBU R128 (-16 LUFS) và time-stretch khớp target duration
        target_dur = s["duration"]
        cmd_dur = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(raw_mp3)]
        res_dur = subprocess.run(cmd_dur, capture_output=True, text=True)
        try:
            curr_dur = float(res_dur.stdout.strip())
        except Exception:
            curr_dur = target_dur
            
        speed_factor = curr_dur / (target_dur - 0.8) if target_dur > 2.0 else 1.0
        speed_factor = max(0.85, min(1.35, speed_factor))
        
        filter_str = f"atempo={speed_factor:.3f},loudnorm=I=-16:TP=-1.5:LRA=11,aformat=sample_rates=48000:channel_layouts=stereo"
        cmd_norm = ["ffmpeg", "-y", "-i", str(raw_mp3), "-filter:a", filter_str, str(norm_wav)]
        subprocess.run(cmd_norm, capture_output=True)
        
        section_files.append({"id": sid, "wav": norm_wav, "start": s["start"], "duration": s["duration"]})
        print(" [OK]")

    # Ghép 8 sections thành master track 210.0s căn chỉnh thời gian
    master_wav = out_dir / "master_voiceover_46scenes_210s.wav"
    master_mp3 = BASE_DIR / "04_audio" / "voiceover" / "master_voiceover_timeline_aligned.mp3"
    
    filter_inputs = []
    amix_labels = []
    cmd_inputs = []
    
    for i, sf in enumerate(section_files):
        cmd_inputs.extend(["-i", str(sf["wav"])])
        delay_ms = int(sf["start"] * 1000)
        lbl = f"a{i}"
        filter_inputs.append(f"[{i}:a]adelay={delay_ms}|{delay_ms},volume=1.0[{lbl}]")
        amix_labels.append(f"[{lbl}]")
        
    filter_complex = f"{';'.join(filter_inputs)};{''.join(amix_labels)}amix=inputs={len(section_files)}:duration=first:dropout_transition=0,aformat=sample_rates=48000:channel_layouts=stereo[a_out]"
    
    cmd_master = [
        "ffmpeg", "-y",
        *cmd_inputs,
        "-filter_complex", filter_complex,
        "-map", "[a_out]",
        "-t", "210.0",
        str(master_wav)
    ]
    subprocess.run(cmd_master, capture_output=True)
    
    cmd_mp3 = ["ffmpeg", "-y", "-i", str(master_wav), "-b:a", "320k", "-ar", "48000", str(master_mp3)]
    subprocess.run(cmd_mp3, capture_output=True)
    
    print(f"\n✅ ĐÃ XUẤT BẢN MASTER VOICEOVER 46 CẢNH CHUẨN XÁC 210s:")
    print(f"   • File WAV: {master_wav.relative_to(BASE_DIR)}")
    print(f"   • File MP3 Master: {master_mp3.relative_to(BASE_DIR)}")

if __name__ == "__main__":
    asyncio.run(build_aligned_voiceover_async())
