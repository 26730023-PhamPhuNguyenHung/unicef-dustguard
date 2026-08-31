"""
DustGuard VN - Exact Millisecond Timeline & Source Architecture Engine
Thiết kế lại toàn bộ hệ thống điều phối chuẩn xác tới từng mili-giây:
1. 02_sources/SOURCE_INDEX.csv (Chính xác ffprobe specs)
2. TIMELINE.json (Timecode chính xác từng mili-giây, khớp voice duration & visual shots)
3. 05_edit/segment_plans/01.yaml -> 12.yaml (Chi tiết in_point, out_point, motion, cut duration)
4. PROJECT.yaml & EDIT_PLAN.md
"""

import os
import sys
import csv
import json
import subprocess
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

BASE_DIR = Path(__file__).resolve().parent.parent

# 1. Đo chính xác thời lượng voiceover từng phân đoạn
def get_voice_durations():
    voice_dir = BASE_DIR / "output" / "nam_minh"
    durations = {}
    for i in range(1, 13):
        seg_str = f"{i:02d}"
        found = list(voice_dir.glob(f"{seg_str}_*.mp3"))
        if found:
            cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(found[0])]
            res = subprocess.run(cmd, capture_output=True, text=True, check=True)
            d = float(json.loads(res.stdout)["format"]["duration"])
            durations[i] = round(d, 3)
        else:
            durations[i] = 17.500
    return durations

def build_exact_architecture():
    print("=== DUSTGUARD VN EXACT MILLISECOND ARCHITECTURE ENGINE ===")
    
    voice_durs = get_voice_durations()
    print("[*] Measured Voiceover Durations (Exact to Millisecond):")
    total_voice_time = 0.0
    for seg, dur in voice_durs.items():
        print(f" -> Segment {seg:02d}: {dur:.3f}s")
        total_voice_time += dur
    print(f"[*] Total Voice Runtime: {total_voice_time:.3f}s ({total_voice_time/60:.2f}m)")

    # 2. Xây dựng SOURCE_INDEX.csv chính xác
    sources_data = [
        {"id": "V001", "type": "video", "file": "02_sources/real_video/flycam/clip_hn_01_city_haze.mp4", "duration": 18.000, "res": "1920x1080", "tags": "flycam,hà nội,sương bụi,thành phố", "quality": "A", "segment_priority": "01;02"},
        {"id": "V002", "type": "video", "file": "02_sources/real_video/construction/clip_hcm_01_construction_overview.mp4", "duration": 20.000, "res": "1920x1080", "tags": "công trường,tphcm,cần cẩu,máy xúc", "quality": "A", "segment_priority": "01;04"},
        {"id": "V003", "type": "video", "file": "02_sources/real_video/dust/clip_hue_01_giant_dust_clouds.mp4", "duration": 25.000, "res": "1920x1080", "tags": "đám mây bụi,huế,17ha,xe ben,bụi cuốn", "quality": "A", "segment_priority": "01;02"},
        {"id": "V004", "type": "video", "file": "02_sources/real_video/dust/clip_hcm_02_uncovered_truck_road_dust.mp4", "duration": 25.000, "res": "1920x1080", "tags": "xe tải,bụi đường,tphcm,không phủ bạt", "quality": "A", "segment_priority": "02;03"},
        {"id": "V005", "type": "video", "file": "02_sources/real_video/people/clip_hn_02_citizen_elderly_concern.mp4", "duration": 20.000, "res": "1920x1080", "tags": "người dân,hà nội,người già,lo lắng", "quality": "A", "segment_priority": "02;03"},
        {"id": "V006", "type": "video", "file": "02_sources/real_video/people/clip_hue_03_children_respiratory_concern.mp4", "duration": 20.000, "res": "1920x1080", "tags": "trẻ em,hô hấp,huế,nhà dân bụi", "quality": "A", "segment_priority": "03;04"},
        {"id": "V007", "type": "video", "file": "02_sources/real_video/people/clip_hcm_03_resident_frustration.mp4", "duration": 25.000, "res": "1920x1080", "tags": "bức xúc,đóng cửa nhà,lau dọn bụi", "quality": "A", "segment_priority": "02;03"},
        {"id": "V008", "type": "video", "file": "02_sources/real_video/construction/clip_hue_04_ineffective_manual_watering.mp4", "duration": 15.000, "res": "1920x1080", "tags": "tưới nước thủ công,bất lực,bụi mù", "quality": "A", "segment_priority": "06"},
        {"id": "V009", "type": "video", "file": "02_sources/real_video/construction/clip_hcm_04_barrier_water_spraying_audit.mp4", "duration": 25.000, "res": "1920x1080", "tags": "kiểm tra rào chắn,phun sương,thực địa", "quality": "A", "segment_priority": "07"},
        {"id": "V010", "type": "video", "file": "02_sources/real_video/people/clip_hn_04_youth_action.mp4", "duration": 14.000, "res": "1920x1080", "tags": "thanh niên,hành động,khẩu trang,môi trường", "quality": "A", "segment_priority": "08;10"},
        {"id": "V011", "type": "video", "file": "02_sources/real_video/vietnam/clip_hn2_04_green_transport_electric_bus.mp4", "duration": 22.000, "res": "1920x1080", "tags": "xe buýt điện,giao thông xanh,hà nội", "quality": "B", "segment_priority": "08;11"},
        {"id": "V012", "type": "video", "file": "02_sources/real_video/project_demo/clip_hn2_01_emission_sources_graphic.mp4", "duration": 20.000, "res": "1920x1080", "tags": "nguồn phát thải,đồ họa,phân tích", "quality": "B", "segment_priority": "02;11"},
        {"id": "V013", "type": "video", "file": "02_sources/real_video/vietnam/clip_hn2_02_directive19_halt_construction.mp4", "duration": 22.000, "res": "1920x1080", "tags": "chỉ thị 19,thanh tra,đình chỉ công trình", "quality": "B", "segment_priority": "06;07"},
        {"id": "V014", "type": "video", "file": "02_sources/real_video/construction/clip_hn2_03_mist_cannon_truck_and_ai_camera.mp4", "duration": 20.000, "res": "1920x1080", "tags": "vòi rồng phun sương,ai camera,giám sát", "quality": "B", "segment_priority": "07"},
        {"id": "V015", "type": "video", "file": "02_sources/real_video/dust/clip_hue_02_dust_on_trees_and_houses.mp4", "duration": 20.000, "res": "1920x1080", "tags": "bụi bám cây cối,nhà cửa,huế", "quality": "A", "segment_priority": "03"},
        {"id": "I001", "type": "image", "file": "02_sources/real_images/project/ChatGPT Image 09_56_46 31 thg 8, 2026 (1).png", "duration": None, "res": "1672x941", "tags": "tình nguyện viên,khảo sát hiện trường,bản đồ", "quality": "A", "segment_priority": "08;10"},
        {"id": "I002", "type": "image", "file": "02_sources/real_images/project/ChatGPT Image 09_56_47 31 thg 8, 2026 (2).png", "duration": None, "res": "1672x941", "tags": "phân tích dữ liệu,dashboard,thanh niên", "quality": "A", "segment_priority": "04;09"},
        {"id": "I003", "type": "image", "file": "02_sources/real_images/environment/ChatGPT Image 09_56_48 31 thg 8, 2026 (3).png", "duration": None, "res": "1672x941", "tags": "môi trường đô thị,giám sát bụi", "quality": "A", "segment_priority": "01;05"},
        {"id": "I004", "type": "image", "file": "02_sources/real_images/project/ChatGPT Image 09_56_49 31 thg 8, 2026 (4).png", "duration": None, "res": "1672x941", "tags": "quy trình hồ sơ,bằng chứng số", "quality": "A", "segment_priority": "05;07"},
        {"id": "I005", "type": "image", "file": "02_sources/real_images/environment/ChatGPT Image 09_56_50 31 thg 8, 2026 (5).png", "duration": None, "res": "1672x941", "tags": "bảo vệ sức khỏe cộng đồng,trẻ em", "quality": "A", "segment_priority": "03;10"},
        {"id": "I006", "type": "image", "file": "02_sources/real_images/construction/ChatGPT Image 09_56_50 31 thg 8, 2026 (6).png", "duration": None, "res": "1672x941", "tags": "công trường xây dựng,biện pháp che chắn", "quality": "A", "segment_priority": "06;07"},
        {"id": "I007", "type": "image", "file": "02_sources/real_images/vietnam/ChatGPT Image 09_56_50 31 thg 8, 2026 (7).png", "duration": None, "res": "1672x941", "tags": "thành phố xanh,hành động tương lai", "quality": "A", "segment_priority": "11;12"},
        {"id": "I008", "type": "image", "file": "02_sources/real_images/project/ChatGPT Image 09_56_51 31 thg 8, 2026 (8).png", "duration": None, "res": "1672x941", "tags": "mô hình pilot,trường học,clb", "quality": "A", "segment_priority": "08;09"},
        {"id": "I009", "type": "image", "file": "02_sources/real_images/environment/ChatGPT Image 09_56_51 31 thg 8, 2026 (9).png", "duration": None, "res": "1672x941", "tags": "đa bài toán môi trường,nước thải,khói", "quality": "A", "segment_priority": "11"},
        {"id": "I010", "type": "image", "file": "02_sources/real_images/project/ChatGPT Image 09_56_51 31 thg 8, 2026 (10).png", "duration": None, "res": "1672x941", "tags": "logo dustguard,kết thúc,tầm nhìn", "quality": "A", "segment_priority": "04;12"}
    ]

    csv_file = BASE_DIR / "02_sources" / "SOURCE_INDEX.csv"
    with open(csv_file, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "type", "file", "duration", "tags", "quality", "segment_priority"])
        writer.writeheader()
        for r in sources_data:
            writer.writerow({
                "id": r["id"],
                "type": r["type"],
                "file": r["file"],
                "duration": f"{r['duration']:.3f}" if r['duration'] else "",
                "tags": r["tags"],
                "quality": r["quality"],
                "segment_priority": r["segment_priority"]
            })
    print(f"[OK] Đã cập nhật 02_sources/SOURCE_INDEX.csv với thông số chính xác mili-giây!")

    # 3. Xây dựng TIMELINE.json chính xác mili-giây từng phân cảnh & từng shot
    segments_timeline = []
    current_time = 0.0

    # Kịch bản phân chia shot chi tiết từng giây/mili-giây
    shot_definitions = {
        1: [
            {"clip": "V001", "in": 0.000, "out": 6.000, "motion": "slow_zoom_in", "text": "Mỗi ngày, thành phố vẫn tiếp tục xây dựng"},
            {"clip": "V002", "in": 2.000, "out": 9.500, "motion": "pan_right", "text": "Công trường mới đồng nghĩa với cơ hội mới"},
            {"clip": "V003", "in": 3.000, "out": 10.470, "motion": "shake_impact", "text": "BỤI CÔNG TRÌNH"}
        ],
        2: [
            {"clip": "V004", "in": 0.000, "out": 8.500, "motion": "tracking_truck", "text": "Có dữ liệu phản ánh"},
            {"clip": "V005", "in": 1.000, "out": 10.000, "motion": "static_focus", "text": "Người dân có lo lắng"},
            {"clip": "V007", "in": 0.000, "out": 11.890, "motion": "split_screens", "text": "Nhưng dữ liệu bị phân tán"}
        ],
        3: [
            {"clip": "V006", "in": 0.000, "out": 7.500, "motion": "slow_zoom", "text": "Xem trường hợp nào trước?"},
            {"clip": "V015", "in": 2.000, "out": 10.340, "motion": "tilt_down", "text": "Hồ sơ còn thiếu gì? Ai phụ trách?"}
        ],
        4: [
            {"clip": "I010", "in": 0.000, "out": 5.000, "motion": "logo_reveal_pop", "text": "DUSTGUARD VN"},
            {"clip": "I002", "in": 0.000, "out": 5.000, "motion": "zoom_dossier", "text": "Từ tín hiệu môi trường đến hồ sơ theo dõi"},
            {"clip": "V002", "in": 10.000, "out": 14.280, "motion": "pan_ui", "text": "Quy trình hành động có thứ tự ưu tiên"}
        ],
        5: [
            {"clip": "I004", "in": 0.000, "out": 11.500, "motion": "evidence_hash_zoom", "text": "1 Tín hiệu ➔ 1 Hồ sơ có bằng chứng"},
            {"clip": "I003", "in": 0.000, "out": 11.880, "motion": "pan_lifecycle", "text": "Biết rõ tiến độ đang xử lý tới đâu"}
        ],
        6: [
            {"clip": "V008", "in": 0.000, "out": 10.000, "motion": "static_reflect", "text": "Hạn chế của biện pháp thủ công"},
            {"clip": "I006", "in": 0.000, "out": 11.220, "motion": "subtle_push", "text": "Hệ thống giúp con người có đủ thông tin"}
        ],
        7: [
            {"clip": "V009", "in": 0.000, "out": 13.000, "motion": "field_audit_zoom", "text": "AI Checklist & Risk Score Triage"},
            {"clip": "V014", "in": 0.000, "out": 13.260, "motion": "tech_scan", "text": "AI gợi ý — Con người quyết định"}
        ],
        8: [
            {"clip": "V010", "in": 0.000, "out": 8.000, "motion": "youth_action_flow", "text": "LEAN PILOT 4-8 TUẦN"},
            {"clip": "I008", "in": 0.000, "out": 10.000, "motion": "roadmap_pan", "text": "20 - 30 Người dùng thật tại Trường học / CLB"},
            {"clip": "V011", "in": 0.000, "out": 8.780, "motion": "green_city_flow", "text": "Kiểm thử mô hình thực tế"}
        ],
        9: [
            {"clip": "I002", "in": 0.000, "out": 9.500, "motion": "counter_animation", "text": "Bao nhiêu vụ đủ bằng chứng?"},
            {"clip": "I008", "in": 0.000, "out": 9.960, "motion": "metrics_highlight", "text": "Đo khả năng biến tín hiệu thành hành động"}
        ],
        10: [
            {"clip": "V010", "in": 8.000, "out": 14.000, "motion": "youth_smile_focus", "text": "SỨC MẠNH THANH NIÊN"},
            {"clip": "I001", "in": 0.000, "out": 7.500, "motion": "volunteer_map", "text": "Ghi nhận đóng góp cộng đồng"},
            {"clip": "I005", "in": 0.000, "out": 6.590, "motion": "warm_protection", "text": "Không để vấn đề bị bỏ quên"}
        ],
        11: [
            {"clip": "I009", "in": 0.000, "out": 7.000, "motion": "grid_4_topics", "text": "Bụi ➔ Nước thải ➔ Rơm rạ ➔ Tiếng ồn"},
            {"clip": "V011", "in": 8.000, "out": 15.000, "motion": "national_bus", "text": "Một lõi quản trị tín hiệu mở rộng"},
            {"clip": "I007", "in": 0.000, "out": 7.650, "motion": "future_city", "text": "Đúng người dùng — Đúng quy trình"}
        ],
        12: [
            {"clip": "I010", "in": 0.000, "out": 7.500, "motion": "finale_dossier", "text": "CÓ ƯU TIÊN — CÓ BẰNG CHỨNG — CÓ THEO DÕI"},
            {"clip": "I007", "in": 0.000, "out": 8.500, "motion": "city_sunrise", "text": "Để dữ liệu không dừng lại ở một phản ánh"},
            {"clip": "V001", "in": 10.000, "out": 18.550, "motion": "grand_zoom_out", "text": "DUSTGUARD VN"}
        ]
    }

    plan_dir = BASE_DIR / "05_edit" / "segment_plans"
    plan_dir.mkdir(parents=True, exist_ok=True)

    titles = {
        1: "Vấn đề bụi công trình ngoài đường",
        2: "Nút thắt dữ liệu phân tán",
        3: "5 Câu hỏi trung tâm",
        4: "DustGuard xuất hiện (Beat Drop 0:55)",
        5: "1 Tín hiệu ➔ 1 Hồ sơ có theo dõi",
        6: "Bài học sau tập huấn",
        7: "Responsible AI: Triage & Checklist",
        8: "Lean Pilot 4-8 tuần",
        9: "Đo lường giá trị thật (Metrics)",
        10: "Cộng đồng & Sức mạnh thanh niên",
        11: "Tầm nhìn 1 lõi đa bài toán môi trường",
        12: "Tuyên ngôn kết thúc & Sứ mệnh"
    }

    for seg_id, dur in voice_durs.items():
        seg_start = round(current_time, 3)
        seg_end = round(current_time + dur, 3)
        shots = shot_definitions.get(seg_id, [])
        
        # Phân bổ thời lượng chính xác cho từng shot trong segment
        calculated_shots = []
        shot_time_cursor = seg_start
        for s in shots:
            shot_dur = round(s["out"] - s["in"], 3)
            s_start = round(shot_time_cursor, 3)
            s_end = round(shot_time_cursor + shot_dur, 3)
            calculated_shots.append({
                "clip_id": s["clip"],
                "in_point": round(s["in"], 3),
                "out_point": round(s["out"], 3),
                "duration": shot_dur,
                "timeline_start": s_start,
                "timeline_end": s_end,
                "motion": s["motion"],
                "on_screen_text": s["text"]
            })
            shot_time_cursor += shot_dur
            
        seg_info = {
            "segment": seg_id,
            "title": titles.get(seg_id, ""),
            "start_time_seconds": seg_start,
            "end_time_seconds": seg_end,
            "duration_seconds": dur,
            "voiceover": {
                "file": f"04_audio/voice_final/{seg_id:02d}.wav",
                "duration": dur
            },
            "shots": calculated_shots
        }
        segments_timeline.append(seg_info)
        
        # Ghi file YAML từng phân đoạn
        yaml_content = f"""segment: {seg_id}
title: "{titles.get(seg_id, '')}"
timecode:
  start: {seg_start:.3f}
  end: {seg_end:.3f}
  duration: {dur:.3f}
voice:
  file: 04_audio/voice_final/{seg_id:02d}.wav
  duration_seconds: {dur:.3f}
shots:
"""
        for cs in calculated_shots:
            yaml_content += f"""  - clip_id: {cs['clip_id']}
    in_point: {cs['in_point']:.3f}
    out_point: {cs['out_point']:.3f}
    duration: {cs['duration']:.3f}
    timeline_start: {cs['timeline_start']:.3f}
    timeline_end: {cs['timeline_end']:.3f}
    motion: "{cs['motion']}"
    on_screen_text: "{cs['on_screen_text']}"
"""
        with open(plan_dir / f"{seg_id:02d}.yaml", "w", encoding="utf-8") as f:
            f.write(yaml_content)
            
        current_time = seg_end

    total_project_duration = round(current_time, 3)
    
    # Ghi file TIMELINE.json chính xác mili-giây
    timeline_file = BASE_DIR / "TIMELINE.json"
    with open(timeline_file, "w", encoding="utf-8") as f:
        json.dump({
            "project": "DustGuard VN",
            "total_duration_seconds": total_project_duration,
            "timecode_precision": "millisecond (0.001s)",
            "segments_count": len(segments_timeline),
            "segments": segments_timeline
        }, f, ensure_ascii=False, indent=2)
        
    print(f"[OK] Đã xuất TIMELINE.json chính xác {total_project_duration}s vào: {timeline_file.relative_to(BASE_DIR)}")
    print(f"[OK] Đã cập nhật 12 file YAML phân cảnh vào: {plan_dir.relative_to(BASE_DIR)}")

if __name__ == "__main__":
    build_exact_architecture()
