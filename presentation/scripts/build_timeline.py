"""
DustGuard VN - Timeline & Segment Plans Builder
Đọc master script, music map, source index và tạo:
1. TIMELINE.json (File điều phối số 3)
2. 05_edit/segment_plans/01.yaml -> 12.yaml
3. 01_script/segments/01_hook.md -> 12_closing.md
"""

import sys
import json
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

BASE_DIR = Path(__file__).resolve().parent.parent

SEGMENTS_DATA = [
    {
        "segment": 1,
        "id": "01_hook",
        "title": "Vấn đề bụi công trình",
        "start": 0.0,
        "end": 18.0,
        "duration": 18.0,
        "text": "Ở một thành phố đang phát triển, những công trường mới đồng nghĩa với những con đường mới, những ngôi nhà mới và những cơ hội mới. Nhưng cùng với sự phát triển đó, có một tác động rất dễ bị xem là nhỏ... cho đến khi nó trở thành vấn đề của cả một cộng đồng. Đó là bụi công trình.",
        "visuals": ["V001", "V002", "V003"],
        "music": {"track": "epic", "energy": 2, "role": "atmospheric_intro"},
        "editing": {"cut_rate": 3.5, "transition": "cross_dissolve", "motion": "subtle_zoom_in"}
    },
    {
        "segment": 2,
        "id": "02_problem",
        "title": "Nút thắt dữ liệu phân tán",
        "start": 18.0,
        "end": 38.0,
        "duration": 20.0,
        "text": "Điều chúng tôi nhận ra là: vấn đề không phải chúng ta hoàn toàn không có dữ liệu. Người dân có phản ánh. Có hình ảnh. Có vị trí. Có thông tin công trình. Có hồ sơ kiểm tra. Và trong tương lai còn có thể có dữ liệu từ cảm biến. Nhưng những thông tin đó thường nằm ở nhiều nơi khác nhau. Và khi dữ liệu bị phân tán, điều khó nhất là biến nó thành một hành động có thứ tự ưu tiên.",
        "visuals": ["V004", "V005", "V007"],
        "music": {"track": "epic", "energy": 4, "role": "problem_build"},
        "editing": {"cut_rate": 3.0, "transition": "hard_cut", "motion": "pan_left"}
    },
    {
        "segment": 3,
        "id": "03_context",
        "title": "5 Câu hỏi trung tâm",
        "start": 38.0,
        "end": 55.0,
        "duration": 17.0,
        "text": "Nếu cùng lúc có mười phản ánh, chúng ta nên nhìn vào trường hợp nào trước? Vì sao trường hợp đó đáng chú ý? Hồ sơ còn thiếu gì? Ai đang phụ trách? Và sau khi một phản ánh được gửi đi... nó đã thực sự đi đến đâu?",
        "visuals": ["V006", "V015"],
        "music": {"track": "epic", "energy": 4, "role": "tension_pre_drop"},
        "editing": {"cut_rate": 2.5, "transition": "hard_cut", "motion": "text_pop_in"}
    },
    {
        "segment": 4,
        "id": "04_solution",
        "title": "DustGuard xuất hiện",
        "start": 55.0,
        "end": 70.0,
        "duration": 15.0,
        "text": "DustGuard được xây dựng để trả lời những câu hỏi đó. Không phải bằng cách thay thế người ra quyết định. Mà bằng cách kết nối tín hiệu, bằng chứng, mức độ ưu tiên và quá trình xử lý thành một hồ sơ có thể theo dõi.",
        "visuals": ["I010", "I002", "V002"],
        "music": {"track": "epic", "energy": 7, "role": "solution_reveal_beat_drop"},
        "editing": {"cut_rate": 2.5, "transition": "flash_white_cut", "motion": "zoom_ui"}
    },
    {
        "segment": 5,
        "id": "05_core_logic",
        "title": "1 Tín hiệu ➔ 1 Hồ sơ",
        "start": 70.0,
        "end": 90.0,
        "duration": 20.0,
        "text": "Điểm mới của DustGuard không nằm ở việc tạo thêm một nơi để gửi phản ánh. Điều chúng tôi muốn giải quyết là khoảng trống sau khi phản ánh đã được gửi. Một tín hiệu ban đầu phải có cơ hội trở thành một hồ sơ. Một hồ sơ phải có bằng chứng. Một trường hợp phải có mức độ ưu tiên. Và quan trọng nhất: phải có thể biết nó đang được xử lý tới đâu.",
        "visuals": ["I004", "I003"],
        "music": {"track": "epic", "energy": 8, "role": "dynamic_flow"},
        "editing": {"cut_rate": 3.0, "transition": "hard_cut", "motion": "cursor_click"}
    },
    {
        "segment": 6,
        "id": "06_workshop_lesson",
        "title": "Bài học sau tập huấn",
        "start": 90.0,
        "end": 109.0,
        "duration": 19.0,
        "text": "Nhưng DustGuard hôm nay không còn giống phiên bản ban đầu. Sau vòng tập huấn, chúng tôi nhận ra rằng một hệ thống thông minh không nên cố gắng đưa ra nhiều quyết định hơn con người. Nó phải giúp con người có đủ thông tin để đưa ra quyết định tốt hơn. Vì vậy, chúng tôi thay đổi cách nhìn về AI, về điểm rủi ro và cả vai trò của IoT.",
        "visuals": ["V008", "I006"],
        "music": {"track": "epic", "energy": 6, "role": "contemplative_tech"},
        "editing": {"cut_rate": 3.5, "transition": "cross_dissolve", "motion": "subtle_push"}
    },
    {
        "segment": 7,
        "id": "07_responsible_ai",
        "title": "Responsible AI & Triage",
        "start": 109.0,
        "end": 128.0,
        "duration": 19.0,
        "text": "Dust Risk Score không trả lời rằng một công trình có vi phạm hay không. Nó chỉ hỗ trợ một câu hỏi thực tế hơn: trong nhiều trường hợp đang tồn tại, trường hợp nào nên được xem xét trước, và vì sao? AI có thể phân loại, tóm tắt, tìm thông tin còn thiếu và hỗ trợ checklist. Nhưng AI không tự kết luận vi phạm. Không tự quyết định xử phạt. Và không thay thế cơ quan có thẩm quyền.",
        "visuals": ["V009", "V014"],
        "music": {"track": "epic", "energy": 8, "role": "confident_authority"},
        "editing": {"cut_rate": 3.0, "transition": "hard_cut", "motion": "teal_highlight"}
    },
    {
        "segment": 8,
        "id": "08_lean_pilot",
        "title": "Mô hình Lean Pilot 4-8 tuần",
        "start": 128.0,
        "end": 148.0,
        "duration": 20.0,
        "text": "Chúng tôi cũng học được rằng một giải pháp môi trường không nên bắt đầu bằng một hạ tầng thật lớn. DustGuard có thể bắt đầu chỉ với dữ liệu đang có: phản ánh, hình ảnh, vị trí, checklist và hồ sơ. Một pilot có thể triển khai trong một cộng đồng nhỏ, một trường học hoặc một câu lạc bộ môi trường. Trong bốn đến tám tuần. Với hai mươi đến ba mươi người dùng thật. Và những chỉ số có thể đo được.",
        "visuals": ["V010", "I008", "V011"],
        "music": {"track": "achievement", "energy": 7, "role": "pilot_crossfade"},
        "editing": {"cut_rate": 2.5, "transition": "crossfade_music", "motion": "roadmap_flow"}
    },
    {
        "segment": 9,
        "id": "09_metrics",
        "title": "Đo lường giá trị thật",
        "start": 148.0,
        "end": 165.0,
        "duration": 17.0,
        "text": "Bao nhiêu trường hợp có đủ bằng chứng? Thời gian từ phát hiện đến hành động là bao lâu? Bao nhiêu trường hợp thực sự có bước xử lý tiếp theo? Bao nhiêu vụ việc có thể được theo dõi từ lúc xuất hiện tín hiệu đến khi có kết quả? Đó mới là những con số chúng tôi muốn dùng để chứng minh DustGuard có giá trị.",
        "visuals": ["I002", "I008"],
        "music": {"track": "achievement", "energy": 8, "role": "metric_growth"},
        "editing": {"cut_rate": 2.5, "transition": "hard_cut", "motion": "counter_number"}
    },
    {
        "segment": 10,
        "id": "10_community",
        "title": "Sức mạnh cộng đồng & Thanh niên",
        "start": 165.0,
        "end": 180.0,
        "duration": 15.0,
        "text": "Và DustGuard không chỉ dành cho cơ quan quản lý. Chúng tôi muốn bắt đầu từ những cộng đồng đã có động lực hành động: trường học, câu lạc bộ môi trường, tổ chức thanh niên và những người trẻ. Để họ không chỉ nhìn thấy một vấn đề. Mà biết cách ghi nhận nó tốt hơn, theo dõi nó lâu hơn và giúp nó không bị bỏ quên.",
        "visuals": ["V010", "I001", "I005"],
        "music": {"track": "achievement", "energy": 8, "role": "inspiring_youth"},
        "editing": {"cut_rate": 2.5, "transition": "hard_cut", "motion": "warm_glow"}
    },
    {
        "segment": 11,
        "id": "11_expansion",
        "title": "Tầm nhìn 1 lõi đa bài toán",
        "start": 180.0,
        "end": 197.0,
        "duration": 17.0,
        "text": "Nếu cách tiếp cận này được kiểm chứng với bụi công trình, chúng tôi tin rằng cùng một lõi có thể tiếp tục được phát triển cho những vấn đề môi trường khác. Nước thải. Đốt rơm rạ. Thuốc bảo vệ thực vật. Tiếng ồn. Nhưng mỗi bước mở rộng đều phải bắt đầu lại bằng việc hiểu đúng người dùng, đúng dữ liệu và đúng quy trình thực tế.",
        "visuals": ["I009", "V011", "I007"],
        "music": {"track": "achievement", "energy": 9, "role": "ecosystem_vision"},
        "editing": {"cut_rate": 2.0, "transition": "zoom_out", "motion": "grid_4_boxes"}
    },
    {
        "segment": 12,
        "id": "12_closing",
        "title": "Tuyên ngôn kết thúc & Sứ mệnh",
        "start": 197.0,
        "end": 210.0,
        "duration": 13.0,
        "text": "DustGuard không đặt mục tiêu trở thành một hệ thống quyết định thay con người. Chúng tôi muốn nó trở thành một công cụ giúp một vấn đề được nhìn thấy rõ hơn. Được ghi nhận đầy đủ hơn. Được theo dõi lâu hơn. Và có nhiều cơ hội hơn để đi từ một tín hiệu... đến một hành động thực sự. DustGuard — biến dữ liệu thành hành động quản lý có ưu tiên, có bằng chứng và có theo dõi.",
        "visuals": ["I010", "I007", "V001"],
        "music": {"track": "achievement", "energy": 10, "role": "peak_climax_finale"},
        "editing": {"cut_rate": 1.8, "transition": "flash_climax", "motion": "hero_brand"}
    }
]

def main():
    print("=== DUSTGUARD VN TIMELINE & SEGMENT PLANS BUILDER ===")
    
    # 1. Ghi file TIMELINE.json
    timeline_file = BASE_DIR / "TIMELINE.json"
    with open(timeline_file, "w", encoding="utf-8") as f:
        json.dump({
            "project": "DustGuard VN",
            "total_duration_seconds": 210.0,
            "segments_count": len(SEGMENTS_DATA),
            "segments": SEGMENTS_DATA
        }, f, ensure_ascii=False, indent=2)
    print(f"[OK] Đã xuất TIMELINE.json vào: {timeline_file.relative_to(BASE_DIR)}")

    # 2. Ghi 12 file 05_edit/segment_plans/01.yaml -> 12.yaml
    plan_dir = BASE_DIR / "05_edit" / "segment_plans"
    plan_dir.mkdir(parents=True, exist_ok=True)
    
    script_seg_dir = BASE_DIR / "01_script" / "segments"
    script_seg_dir.mkdir(parents=True, exist_ok=True)
    
    for s in SEGMENTS_DATA:
        seg_num = f"{s['segment']:02d}"
        
        # YAML Plan
        yaml_content = f"""segment: {s['segment']}
title: "{s['title']}"
target:
  start: {s['start']}
  end: {s['end']}
  duration: {s['duration']}
voice:
  file: 04_audio/voice_final/{seg_num}.wav
  text: "{s['text']}"
visuals:
"""
        for v in s["visuals"]:
            yaml_content += f"  - {v}\n"
        yaml_content += f"""editing:
  cut_rate: {s['editing']['cut_rate']}
  transition: {s['editing']['transition']}
  motion: {s['editing']['motion']}
music:
  track: {s['music']['track']}
  energy: {s['music']['energy']}
  role: {s['music']['role']}
"""
        with open(plan_dir / f"{seg_num}.yaml", "w", encoding="utf-8") as f:
            f.write(yaml_content)
            
        # Markdown Script segment
        with open(script_seg_dir / f"{s['id']}.md", "w", encoding="utf-8") as f:
            f.write(f"# Segment {seg_num}: {s['title']}\n\n**Thời lượng**: {s['start']}s - {s['end']}s ({s['duration']}s)\n\n### Lời thoại:\n> {s['text']}\n")

    print(f"[OK] Đã sinh 12 segment plans vào: {plan_dir.relative_to(BASE_DIR)}")
    print(f"[OK] Đã sinh 12 segment scripts vào: {script_seg_dir.relative_to(BASE_DIR)}")

if __name__ == "__main__":
    main()
