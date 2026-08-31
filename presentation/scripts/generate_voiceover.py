#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🎙️ DUSTGUARD VN — VOICEOVER GENERATOR
Sinh âm thanh giọng đọc tiếng Việt chất lượng cao cho 12 phân đoạn kịch bản
sử dụng Edge-TTS (Nam Minh Neural hoặc Hoài My Neural).
Xuất ra từng file segment và file tổng hợp, cùng file đo thời lượng chính xác.
"""

import os
import re
import sys
import json
import asyncio
import subprocess
from pathlib import Path

# Cấu hình UTF-8 cho Windows Console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

import edge_tts

BASE_DIR = Path(__file__).resolve().parent.parent
SCRIPT_FILE = BASE_DIR / "01_script" / "master_voiceover.md"
SEGMENTS_DIR = BASE_DIR / "01_script" / "segments"
VOICE_OUTPUT_DIR = BASE_DIR / "04_audio" / "voice_final"

# 12 Phân đoạn kịch bản chuẩn
SEGMENTS_TEXT = {
    "01": {
        "title": "Mở vấn đề",
        "text": "Ở một thành phố đang phát triển, những công trường mới đồng nghĩa với những con đường mới, những ngôi nhà mới và những cơ hội mới. Nhưng cùng với sự phát triển đó, có một tác động rất dễ bị xem là nhỏ... cho đến khi nó trở thành vấn đề của cả một cộng đồng. Đó là bụi công trình."
    },
    "02": {
        "title": "Nút thắt dữ liệu",
        "text": "Điều chúng tôi nhận ra là: vấn đề không phải chúng ta hoàn toàn không có dữ liệu. Người dân có phản ánh. Có hình ảnh. Có vị trí. Có thông tin công trình. Có hồ sơ kiểm tra. Và trong tương lai còn có thể có dữ liệu từ cảm biến. Nhưng những thông tin đó thường nằm ở nhiều nơi khác nhau. Và khi dữ liệu bị phân tán, điều khó nhất là biến nó thành một hành động có thứ tự ưu tiên."
    },
    "03": {
        "title": "5 Câu hỏi trung tâm",
        "text": "Nếu cùng lúc có mười phản ánh, chúng ta nên nhìn vào trường hợp nào trước? Vì sao trường hợp đó đáng chú ý? Hồ sơ còn thiếu gì? Ai đang phụ trách? Và sau khi một phản ánh được gửi đi... nó đã thực sự đi đến đâu?"
    },
    "04": {
        "title": "DustGuard xuất hiện",
        "text": "DustGuard được xây dựng để trả lời những câu hỏi đó. Không phải bằng cách thay thế người ra quyết định. Mà bằng cách kết nối tín hiệu, bằng chứng, mức độ ưu tiên và quá trình xử lý thành một hồ sơ có thể theo dõi."
    },
    "05": {
        "title": "Tính mới của giải pháp",
        "text": "Điểm mới của DustGuard không nằm ở việc tạo thêm một nơi để gửi phản ánh. Điều chúng tôi muốn giải quyết là khoảng trống sau khi phản ánh đã được gửi. Một tín hiệu ban đầu phải có cơ hội trở thành một hồ sơ. Một hồ sơ phải có bằng chứng. Một trường hợp phải có mức độ ưu tiên. Và quan trọng nhất: phải có thể biết nó đang được xử lý tới đâu."
    },
    "06": {
        "title": "Bài học sau tập huấn",
        "text": "Nhưng DustGuard hôm nay không còn giống phiên bản ban đầu. Sau vòng tập huấn, chúng tôi nhận ra rằng một hệ thống thông minh không nên cố gắng đưa ra nhiều quyết định hơn con người. Nó phải giúp con người có đủ thông tin để đưa ra quyết định tốt hơn. Vì vậy, chúng tôi thay đổi cách nhìn về AI, về điểm rủi ro và cả vai trò của IoT."
    },
    "07": {
        "title": "AI đúng vai trò",
        "text": "Dust Risk Score không trả lời rằng một công trình có vi phạm hay không. Nó chỉ hỗ trợ một câu hỏi thực tế hơn: trong nhiều trường hợp đang tồn tại, trường hợp nào nên được xem xét trước, và vì sao? AI có thể phân loại, tóm tắt, tìm thông tin còn thiếu và hỗ trợ checklist. Nhưng AI không tự kết luận vi phạm. Không tự quyết định xử phạt. Và không thay thế cơ quan có thẩm quyền."
    },
    "08": {
        "title": "Mô hình Lean Pilot",
        "text": "Chúng tôi cũng học được rằng một giải pháp môi trường không nên bắt đầu bằng một hạ tầng thật lớn. DustGuard có thể bắt đầu chỉ với dữ liệu đang có: phản ánh, hình ảnh, vị trí, checklist và hồ sơ. Một pilot có thể triển khai trong một cộng đồng nhỏ, một trường học hoặc một câu lạc bộ môi trường. Trong bốn đến tám tuần. Với hai mươi đến ba mươi người dùng thật. Và những chỉ số có thể đo được."
    },
    "09": {
        "title": "Đo lường giá trị thật",
        "text": "Bao nhiêu trường hợp có đủ bằng chứng? Thời gian từ phát hiện đến hành động là bao lâu? Bao nhiêu trường hợp thực sự có bước xử lý tiếp theo? Bao nhiêu vụ việc có thể được theo dõi từ lúc xuất hiện tín hiệu đến khi có kết quả? Đó mới là những con số chúng tôi muốn dùng để chứng minh DustGuard có giá trị."
    },
    "10": {
        "title": "Vai trò cộng đồng",
        "text": "Và DustGuard không chỉ dành cho cơ quan quản lý. Chúng tôi muốn bắt đầu từ những cộng đồng đã có động lực hành động: trường học, câu lạc bộ môi trường, tổ chức thanh niên và những người trẻ. Để họ không chỉ nhìn thấy một vấn đề. Mà biết cách ghi nhận nó tốt hơn, theo dõi nó lâu hơn và giúp nó không bị bỏ quên."
    },
    "11": {
        "title": "Tầm nhìn mở rộng",
        "text": "Nếu cách tiếp cận này được kiểm chứng với bụi công trình, chúng tôi tin rằng cùng một lõi có thể tiếp tục được phát triển cho những vấn đề môi trường khác. Nước thải. Đốt rơm rạ. Thuốc bảo vệ thực vật. Tiếng ồn. Nhưng mỗi bước mở rộng đều phải bắt đầu lại bằng việc hiểu đúng người dùng, đúng dữ liệu và đúng quy trình thực tế."
    },
    "12": {
        "title": "Kết mạnh và Slogan",
        "text": "DustGuard không đặt mục tiêu trở thành một hệ thống quyết định thay con người. Chúng tôi muốn nó trở thành một công cụ giúp một vấn đề được nhìn thấy rõ hơn. Được ghi nhận đầy đủ hơn. Được theo dõi lâu hơn. Và có nhiều cơ hội hơn để đi từ một tín hiệu... đến một hành động thực sự. DustGuard — biến dữ liệu thành hành động quản lý có ưu tiên, có bằng chứng và có theo dõi."
    }
}

def get_audio_duration(file_path):
    """Đo thời lượng file audio bằng ffprobe."""
    try:
        cmd = [
            "ffprobe",
            "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            str(file_path)
        ]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        return float(res.stdout.strip())
    except Exception:
        return 0.0

async def generate_segment_voice(seg_id, text, voice="vi-VN-NamMinhNeural", rate="+6%", force=False):
    """Sinh voice cho 1 segment (hỗ trợ caching)."""
    VOICE_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    SEGMENTS_DIR.mkdir(parents=True, exist_ok=True)
    
    out_mp3 = VOICE_OUTPUT_DIR / f"{seg_id}.mp3"
    
    # Lưu file segment md
    seg_md = SEGMENTS_DIR / f"{seg_id}_{SEGMENTS_TEXT[seg_id]['title'].lower().replace(' ', '_')}.md"
    with open(seg_md, "w", encoding="utf-8") as f:
        f.write(f"# Phân đoạn {seg_id}: {SEGMENTS_TEXT[seg_id]['title']}\n\n{text}\n")
        
    if not force and out_mp3.exists() and out_mp3.stat().st_size > 1000:
        dur = get_audio_duration(out_mp3)
        if dur > 1.0:
            print(f"  [TTS Cache] Segment {seg_id} đã tồn tại: {dur:.2f}s")
            return {
                "id": seg_id,
                "title": SEGMENTS_TEXT[seg_id]["title"],
                "text": text,
                "file": str(out_mp3.relative_to(BASE_DIR).as_posix()),
                "duration": round(dur, 3)
            }
            
    print(f"  [TTS] Đang sinh voice Segment {seg_id}...")
    communicate = edge_tts.Communicate(text, voice=voice, rate=rate)
    await communicate.save(str(out_mp3))
    
    dur = get_audio_duration(out_mp3)
    print(f"  -> Segment {seg_id} hoàn tất: {dur:.2f}s")
    return {
        "id": seg_id,
        "title": SEGMENTS_TEXT[seg_id]["title"],
        "text": text,
        "file": str(out_mp3.relative_to(BASE_DIR).as_posix()),
        "duration": round(dur, 3)
    }

async def generate_all_voices(voice="vi-VN-NamMinhNeural", rate="+6%", force=False):
    print(f"[Stage 1] Bắt đầu xử lý 12 file Voiceover (Giọng: {voice}, Tốc độ: {rate})...")
    results = []
    
    current_time = 0.0
    for seg_id in sorted(SEGMENTS_TEXT.keys()):
        text = SEGMENTS_TEXT[seg_id]["text"]
        item = await generate_segment_voice(seg_id, text, voice=voice, rate=rate, force=force)
        item["start_time"] = round(current_time, 3)
        current_time += item["duration"]
        item["end_time"] = round(current_time, 3)
        results.append(item)
        
    # Ghi file timings JSON
    timings_file = VOICE_OUTPUT_DIR / "voice_timings.json"
    with open(timings_file, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
        
    # Ghép nối full voiceover bằng ffmpeg concat demuxer
    concat_list_file = VOICE_OUTPUT_DIR / "concat_list.txt"
    with open(concat_list_file, "w", encoding="utf-8") as f:
        for item in results:
            abs_mp3 = BASE_DIR / item["file"]
            f.write(f"file '{abs_mp3.as_posix()}'\n")
            
    full_voice_path = VOICE_OUTPUT_DIR / "full_voiceover.mp3"
    concat_cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_list_file),
        "-c", "copy",
        str(full_voice_path)
    ]
    subprocess.run(concat_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    
    total_dur = get_audio_duration(full_voice_path)
    print(f"✅ [Stage 1] Hoàn tất 12 segments Voiceover! Tổng thời lượng: {total_dur:.2f}s ({int(total_dur//60)}m{int(total_dur%60)}s)")
    return results

if __name__ == "__main__":
    asyncio.run(generate_all_voices())
