"""
DustGuard VN - Director Vision & Master Presentation Integration Engine
Tích hợp chuẩn xác 10 Slide Master Presentation (S001 -> S010) và 15 Video Footages thực tế (V001 -> V015)
theo đúng ý đồ nghệ thuật của Đạo diễn.
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

def build_director_architecture():
    print("=== DUSTGUARD VN DIRECTOR MASTER TIMELINE & ASSET ARCHITECTURE ===")
    
    # 1. Đo chính xác thời lượng voiceover từng phân đoạn
    voice_dir = BASE_DIR / "output" / "nam_minh"
    voice_durs = {}
    for i in range(1, 13):
        seg_str = f"{i:02d}"
        found = list(voice_dir.glob(f"{seg_str}_*.mp3"))
        if found:
            cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(found[0])]
            res = subprocess.run(cmd, capture_output=True, text=True, check=True)
            d = float(json.loads(res.stdout)["format"]["duration"])
            voice_durs[i] = round(d, 3)

    # 2. Xây dựng SOURCE_INDEX.csv chuẩn xác với đầy đủ Video Footages & Slide Master
    sources_catalog = [
        # --- VIDEO FOOTAGES THỰC TẾ ---
        {"id": "V001", "type": "video", "file": "02_sources/real_video/flycam/clip_hn_01_city_haze.mp4", "duration": "18.000", "tags": "flycam,hà nội,sương bụi,toàn cảnh thành phố", "quality": "A", "segment_priority": "01;12"},
        {"id": "V002", "type": "video", "file": "02_sources/real_video/construction/clip_hcm_01_construction_overview.mp4", "duration": "20.000", "tags": "công trường tphcm,cần cẩu,máy xúc,bụi", "quality": "A", "segment_priority": "01;04"},
        {"id": "V003", "type": "video", "file": "02_sources/real_video/dust/clip_hue_01_giant_dust_clouds.mp4", "duration": "25.000", "tags": "đám mây bụi,huế 17ha,xe ben,bụi cuốn mù mịt", "quality": "A", "segment_priority": "01"},
        {"id": "V004", "type": "video", "file": "02_sources/real_video/dust/clip_hcm_02_uncovered_truck_road_dust.mp4", "duration": "25.000", "tags": "xe tải không phủ bạt,bụi đường phố,tphcm", "quality": "A", "segment_priority": "02"},
        {"id": "V005", "type": "video", "file": "02_sources/real_video/people/clip_hn_02_citizen_elderly_concern.mp4", "duration": "20.000", "tags": "người cao tuổi,hà nội,lo lắng sức khỏe,ngột ngạt", "quality": "A", "segment_priority": "02"},
        {"id": "V006", "type": "video", "file": "02_sources/real_video/people/clip_hue_03_children_respiratory_concern.mp4", "duration": "20.000", "tags": "trẻ em,viêm hô hấp,nhà dân bám bụi,huế", "quality": "A", "segment_priority": "03"},
        {"id": "V007", "type": "video", "file": "02_sources/real_video/people/clip_hcm_03_resident_frustration.mp4", "duration": "25.000", "tags": "người dân đóng kín cửa,bức xúc lau dọn bụi", "quality": "A", "segment_priority": "03"},
        {"id": "V008", "type": "video", "file": "02_sources/real_video/construction/clip_hue_04_ineffective_manual_watering.mp4", "duration": "15.000", "tags": "tưới nước thủ công bất lực,bụi vẫn mù trời", "quality": "A", "segment_priority": "06"},
        {"id": "V009", "type": "video", "file": "02_sources/real_video/construction/clip_hcm_04_barrier_water_spraying_audit.mp4", "duration": "25.000", "tags": "kiểm tra rào chắn,phun sương dập bụi,thực địa", "quality": "A", "segment_priority": "05;07"},
        {"id": "V010", "type": "video", "file": "02_sources/real_video/people/clip_hn_04_youth_action.mp4", "duration": "14.000", "tags": "thanh niên hành động,khẩu trang chống bụi,môi trường", "quality": "A", "segment_priority": "08;10"},
        {"id": "V011", "type": "video", "file": "02_sources/real_video/vietnam/clip_hn2_04_green_transport_electric_bus.mp4", "duration": "22.000", "tags": "xe buýt điện vinbus,giao thông xanh tương lai", "quality": "A", "segment_priority": "11"},
        {"id": "V014", "type": "video", "file": "02_sources/real_video/construction/clip_hn2_03_mist_cannon_truck_and_ai_camera.mp4", "duration": "20.000", "tags": "xe vòi rồng phun sương,ai camera giám sát", "quality": "A", "segment_priority": "07"},
        {"id": "V015", "type": "video", "file": "02_sources/real_video/dust/clip_hue_02_dust_on_trees_and_houses.mp4", "duration": "20.000", "tags": "bụi phủ trắng xóa cây cối,nhà cửa dân cư", "quality": "A", "segment_priority": "03"},

        # --- 10 MASTER PRESENTATION SLIDES (DUSTGUARD VN SSOT) ---
        {"id": "S001", "type": "slide", "file": "02_sources/slides/png/slide_01_van_de_giai_quyet.png", "duration": "", "tags": "slide 1: vấn đề dustguard giải quyết,bảng ưu tiên kiểm tra", "quality": "A", "segment_priority": "02;04"},
        {"id": "S002", "type": "slide", "file": "02_sources/slides/png/slide_02_nguoi_huong_loi.png", "duration": "", "tags": "slide 2: ai là người hưởng lợi,chuỗi 4 bên phối hợp", "quality": "A", "segment_priority": "04;10"},
        {"id": "S003", "type": "slide", "file": "02_sources/slides/png/slide_03_thay_doi_sau_tap_huan.png", "duration": "", "tags": "slide 3: thay đổi sau tập huấn 11/6,từ chấm điểm sang workflow", "quality": "A", "segment_priority": "06"},
        {"id": "S004", "type": "slide", "file": "02_sources/slides/png/slide_04_tinh_moi_sang_tao.png", "duration": "", "tags": "slide 4: tính mới sáng tạo,vòng đời xử lý theo dõi", "quality": "A", "segment_priority": "05"},
        {"id": "S005", "type": "slide", "file": "02_sources/slides/png/slide_05_kha_thi_viet_nam_pilot.png", "duration": "", "tags": "slide 5: tính khả thi việt nam,mô hình pilot 4-8 tuần,kpi", "quality": "A", "segment_priority": "08;09"},
        {"id": "S006", "type": "slide", "file": "02_sources/slides/png/slide_06_hieu_qua_ky_thuat_chi_phi.png", "duration": "", "tags": "slide 6: hiệu quả kỹ thuật,cloudflare d1 r2,chi phí thấp", "quality": "A", "segment_priority": "08"},
        {"id": "S007", "type": "slide", "file": "02_sources/slides/png/slide_07_mo_hinh_van_hanh_duy_tri.png", "duration": "", "tags": "slide 7: mô hình vận hành,4 nguồn doanh thu duy trì", "quality": "A", "segment_priority": "09"},
        {"id": "S008", "type": "slide", "file": "02_sources/slides/png/slide_08_kiem_chung_phap_ly_ai.png", "duration": "", "tags": "slide 8: kiểm chứng quy trình pháp lý,vai trò responsible ai", "quality": "A", "segment_priority": "07"},
        {"id": "S009", "type": "slide", "file": "02_sources/slides/png/slide_09_tam_nhin_mo_rong.png", "duration": "", "tags": "slide 9: tầm nhìn mở rộng 4 giai đoạn,đa bài toán môi trường", "quality": "A", "segment_priority": "11"},
        {"id": "S010", "type": "slide", "file": "02_sources/slides/png/slide_10_tong_ket_loi_cam_on.png", "duration": "", "tags": "slide 10: tổng kết,pilot chứng minh giá trị,lời cảm ơn", "quality": "A", "segment_priority": "12"}
    ]

    csv_file = BASE_DIR / "02_sources" / "SOURCE_INDEX.csv"
    with open(csv_file, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "type", "file", "duration", "tags", "quality", "segment_priority"])
        writer.writeheader()
        for r in sources_catalog:
            writer.writerow(r)
    print(f"[OK] Đã cập nhật 02_sources/SOURCE_INDEX.csv chuẩn xác 23 tài nguyên tuyển chọn!")

    # 3. Kịch bản phân cảnh Đạo diễn chi tiết kết hợp Footage + Slide
    director_shots_plan = {
        1: [
            {"source_id": "V001", "type": "video", "in": 0.000, "out": 5.500, "motion": "slow_zoom_in", "text": "Mỗi ngày, thành phố vẫn tiếp tục xây dựng."},
            {"source_id": "V002", "type": "video", "in": 2.000, "out": 7.500, "motion": "pan_right", "text": "Những công trường mới... những cơ hội mới."},
            {"source_id": "V003", "type": "video", "in": 3.000, "out": 8.968, "motion": "shake_impact", "text": "BỤI CÔNG TRÌNH"}
        ],
        2: [
            {"source_id": "V004", "type": "video", "in": 0.000, "out": 8.000, "motion": "tracking_truck", "text": "Xe tải không bạt che — Bụi mù mịt đường phố"},
            {"source_id": "V005", "type": "video", "in": 0.000, "out": 8.000, "motion": "static_focus", "text": "Người dân có phản ánh — Dữ liệu nằm ở nhiều nơi"},
            {"source_id": "S001", "type": "slide", "in": 0.000, "out": 12.392, "motion": "ken_burns_zoom_dossier", "text": "Từ dữ liệu rời rạc đến hành động có ưu tiên"}
        ],
        3: [
            {"source_id": "V006", "type": "video", "in": 0.000, "out": 7.500, "motion": "slow_zoom", "text": "Xem trường hợp nào trước? Hồ sơ còn thiếu gì?"},
            {"source_id": "V007", "type": "video", "in": 0.000, "out": 8.340, "motion": "tilt_down", "text": "Ai đang phụ trách? Đã thực sự đi đến đâu?"}
        ],
        4: [
            {"source_id": "S001", "type": "slide", "in": 0.000, "out": 6.000, "motion": "logo_pop_reveal", "text": "DUSTGUARD VN — NỀN TẢNG QUẢN TRỊ TÍN HIỆU"},
            {"source_id": "S002", "type": "slide", "in": 0.000, "out": 8.280, "motion": "pan_stakeholders", "text": "Kết nối tín hiệu ➔ bằng chứng ➔ phối hợp ➔ theo dõi"}
        ],
        5: [
            {"source_id": "S004", "type": "slide", "in": 0.000, "out": 12.000, "motion": "zoom_3_layers", "text": "1 Tín hiệu ➔ 1 Hồ sơ có vòng đời theo dõi"},
            {"source_id": "V009", "type": "video", "in": 0.000, "out": 11.376, "motion": "audit_walkthrough", "text": "Biết rõ vụ việc đang được xử lý tới đâu"}
        ],
        6: [
            {"source_id": "V008", "type": "video", "in": 0.000, "out": 8.000, "motion": "static_reflect", "text": "Tưới nước thủ công: Minh chứng giải pháp hình thức"},
            {"source_id": "S003", "type": "slide", "in": 0.000, "out": 13.216, "motion": "zoom_before_after_table", "text": "Sau 11/6: Chuyển từ chấm điểm sang workflow có trách nhiệm"}
        ],
        7: [
            {"source_id": "S008", "type": "slide", "in": 0.000, "out": 13.000, "motion": "zoom_responsible_ai_box", "text": "AI gợi ý checklist & tóm tắt — Con người quyết định"},
            {"source_id": "V014", "type": "video", "in": 0.000, "out": 13.256, "motion": "tech_mist_cannon", "text": "AI hỗ trợ kiểm tra thực địa — Không thay thế thanh tra"}
        ],
        8: [
            {"source_id": "S005", "type": "slide", "in": 0.000, "out": 13.000, "motion": "zoom_pilot_roadmap", "text": "LEAN PILOT 4-8 TUẦN TẠI TRƯỜNG HỌC & CLB"},
            {"source_id": "S006", "type": "slide", "in": 0.000, "out": 13.784, "motion": "zoom_cloudflare_stack", "text": "Kiến trúc Serverless nhẹ (D1 + R2), chi phí tối thiểu"}
        ],
        9: [
            {"source_id": "S007", "type": "slide", "in": 0.000, "out": 9.500, "motion": "zoom_revenue_model", "text": "Mô hình vận hành bền vững cho cộng đồng"},
            {"source_id": "S005", "type": "slide", "in": 0.000, "out": 9.964, "motion": "zoom_kpi_metrics", "text": "Đo bằng chỉ số thật: Tỷ lệ bằng chứng & Thời gian xử lý"}
        ],
        10: [
            {"source_id": "V010", "type": "video", "in": 0.000, "out": 10.000, "motion": "youth_smile_focus", "text": "SỨC MẠNH THANH NIÊN & CỘNG ĐỒNG"},
            {"source_id": "S002", "type": "slide", "in": 0.000, "out": 10.088, "motion": "zoom_clb_box", "text": "Biến sự quan tâm thành hành động có dữ liệu và có theo dõi"}
        ],
        11: [
            {"source_id": "S009", "type": "slide", "in": 0.000, "out": 11.000, "motion": "zoom_4_stages_expansion", "text": "1 LÕI QUẢN TRỊ ➔ NƯỚC THẢI, RƠM RẠ, TIẾNG ỒN"},
            {"source_id": "V011", "type": "video", "in": 0.000, "out": 10.648, "motion": "green_transport_flow", "text": "Mở rộng hệ sinh thái số vì môi trường Việt Nam"}
        ],
        12: [
            {"source_id": "S010", "type": "slide", "in": 0.000, "out": 12.000, "motion": "zoom_closing_thanks", "text": "DUSTGUARD VN — CÓ ƯU TIÊN, CÓ BẰNG CHỨNG, CÓ THEO DÕI"},
            {"source_id": "V001", "type": "video", "in": 0.000, "out": 12.552, "motion": "sunrise_pan_out", "text": "Để dữ liệu không dừng lại ở một phản ánh"}
        ]
    }

    segments_timeline = []
    current_time = 0.0
    plan_dir = BASE_DIR / "05_edit" / "segment_plans"
    plan_dir.mkdir(parents=True, exist_ok=True)

    titles = {
        1: "Vấn đề bụi công trình ngoài đường",
        2: "Nút thắt dữ liệu phân tán & Vấn đề giải quyết",
        3: "5 Câu hỏi trung tâm đặt ra cho hệ thống",
        4: "DustGuard xuất hiện & Chuỗi 4 bên phối hợp",
        5: "1 Tín hiệu ➔ 1 Hồ sơ có vòng đời theo dõi",
        6: "Bài học sau tập huấn 11/6: Từ chấm điểm sang workflow",
        7: "Responsible AI: Kiểm chứng quy trình & Vai trò hỗ trợ",
        8: "Lean Pilot 4-8 tuần & Kiến trúc kỹ thuật nhẹ",
        9: "Đo lường giá trị thật & Mô hình vận hành bền vững",
        10: "Sức mạnh thanh niên & Cộng đồng hành động",
        11: "Tầm nhìn mở rộng 4 giai đoạn đa bài toán môi trường",
        12: "Tuyên ngôn kết thúc, sứ mệnh & Lời cảm ơn"
    }

    for seg_id, dur in voice_durs.items():
        seg_start = round(current_time, 3)
        seg_end = round(current_time + dur, 3)
        shots = director_shots_plan.get(seg_id, [])
        
        calculated_shots = []
        shot_cursor = seg_start
        for s in shots:
            shot_dur = round(s["out"] - s["in"], 3)
            s_start = round(shot_cursor, 3)
            s_end = round(shot_cursor + shot_dur, 3)
            calculated_shots.append({
                "source_id": s["source_id"],
                "source_type": s["type"],
                "in_point": round(s["in"], 3),
                "out_point": round(s["out"], 3),
                "duration": shot_dur,
                "timeline_start": s_start,
                "timeline_end": s_end,
                "motion": s["motion"],
                "on_screen_text": s["text"]
            })
            shot_cursor += shot_dur
            
        seg_info = {
            "segment": seg_id,
            "title": titles.get(seg_id, ""),
            "start_time_seconds": seg_start,
            "end_time_seconds": seg_end,
            "duration_seconds": dur,
            "voiceover": {
                "file": f"04_audio/voice_final/{seg_id:02d}.wav",
                "duration_seconds": dur
            },
            "shots": calculated_shots
        }
        segments_timeline.append(seg_info)
        
        # Ghi YAML cho từng segment
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
            yaml_content += f"""  - source_id: {cs['source_id']}
    type: {cs['source_type']}
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
    
    # Ghi file TIMELINE.json chính xác
    timeline_file = BASE_DIR / "TIMELINE.json"
    with open(timeline_file, "w", encoding="utf-8") as f:
        json.dump({
            "project": "DustGuard VN",
            "director_vision": "Documentary Tech & Presentation Master Hybrid",
            "total_duration_seconds": total_project_duration,
            "timecode_precision": "0.001s (millisecond)",
            "segments_count": len(segments_timeline),
            "segments": segments_timeline
        }, f, ensure_ascii=False, indent=2)
        
    print(f"[OK] Đã xuất TIMELINE.json chuẩn xác {total_project_duration}s vào: {timeline_file.relative_to(BASE_DIR)}")

if __name__ == "__main__":
    build_director_architecture()
