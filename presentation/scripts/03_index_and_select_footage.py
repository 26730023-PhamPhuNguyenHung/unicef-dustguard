#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
🎬 DUSTGUARD VN — VIDEO FOOTAGE INDEXER & SCENE MATCHER
Script: presentation/scripts/03_index_and_select_footage.py
Description:
  1. Quét và phân tích toàn bộ video trong presentation/02_sources/real_video/
  2. Lấy metadata bằng ffprobe (resolution, fps, bitrate, duration, streams)
  3. Trích xuất Golden Cuts đắt giá nhất, scale/crop về 1920x1080 25fps,
     áp dụng filter khử rung & unsharp nhẹ, mute audio (-an)
  4. Ánh xạ khớp với 12 phân cảnh kịch bản DIRECTOR_TREATMENT_EDITING_SPEC.md
  5. Xuất footage_manifest.json hoàn chỉnh vào presentation/03_selected/
=============================================================================
"""

import os
import sys
import json
import glob
import time
import argparse
import subprocess
from pathlib import Path

# Đảm bảo UTF-8 console output trên Windows
if sys.platform.startswith("win"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Thư mục gốc dự án
BASE_DIR = Path(__file__).resolve().parent.parent.parent
SOURCES_DIR = BASE_DIR / "presentation" / "02_sources" / "real_video"
OUTPUT_DIR = BASE_DIR / "presentation" / "03_selected" / "footage"
MANIFEST_FILE = BASE_DIR / "presentation" / "03_selected" / "footage_manifest.json"

# Danh mục định nghĩa Golden Cuts chuẩn nghệ thuật theo kịch bản
GOLDEN_CUTS_SPEC = [
    # --- V001: Hà Nội Panorama & Sương mù bụi ---
    {
        "cut_id": "cut_01_hn_city_haze_pan",
        "source_rel": "flycam/clip_hn_01_city_haze.mp4",
        "alt_source_rel": "flycam/clip_01_city_haze.mp4",
        "source_id": "V001",
        "start_sec": 0.0,
        "end_sec": 5.5,
        "primary_segment": "01_hook",
        "secondary_segments": ["12_closing"],
        "role": "Flycam panorama thành phố chìm trong lớp bụi mịn đô thị mở đầu phim",
        "location": "Hà Nội",
        "tags": ["flycam", "hà nội", "sương bụi", "toàn cảnh", "panorama", "đô thị"]
    },
    {
        "cut_id": "cut_01_hn_city_haze_wide",
        "source_rel": "flycam/clip_hn_01_city_haze.mp4",
        "alt_source_rel": "flycam/clip_01_city_haze.mp4",
        "source_id": "V001",
        "start_sec": 5.0,
        "end_sec": 11.5,
        "primary_segment": "12_closing",
        "secondary_segments": ["01_hook"],
        "role": "Toàn cảnh góc rộng thành phố với tầng khói bụi lơ lửng cho đoạn kết montage",
        "location": "Hà Nội",
        "tags": ["flycam", "hà nội", "toàn cảnh", "bầu trời bụi", "finale"]
    },

    # --- V002: TPHCM Đại công trường & Cần cẩu ---
    {
        "cut_id": "cut_02_hcm_construction_cranes",
        "source_rel": "construction/clip_hcm_01_construction_overview.mp4",
        "source_id": "V002",
        "start_sec": 1.5,
        "end_sec": 8.5,
        "primary_segment": "01_hook",
        "secondary_segments": ["04_solution"],
        "role": "Cần cẩu tháp xoay chuyển giữa đại công trường nhộn nhịp",
        "location": "TP. Hồ Chí Minh",
        "tags": ["công trường", "cần cẩu tháp", "tphcm", "xây dựng", "quy mô lớn"]
    },
    {
        "cut_id": "cut_02_hcm_excavator_digging",
        "source_rel": "construction/clip_hcm_01_construction_overview.mp4",
        "source_id": "V002",
        "start_sec": 9.5,
        "end_sec": 16.0,
        "primary_segment": "01_hook",
        "secondary_segments": ["04_solution"],
        "role": "Máy xúc đào đất và đất đá công trường phát sinh bụi",
        "location": "TP. Hồ Chí Minh",
        "tags": ["máy xúc", "đào đất", "công trường", "bụi đất", "tphcm"]
    },

    # --- V003: Huế 17ha Xe ben & Đám mây bụi khổng lồ ---
    {
        "cut_id": "cut_03_hue_giant_dust_plume",
        "source_rel": "dust/clip_hue_01_giant_dust_clouds.mp4",
        "source_id": "V003",
        "start_sec": 2.5,
        "end_sec": 9.5,
        "primary_segment": "01_hook",
        "secondary_segments": ["05_core_logic"],
        "role": "Xe ben chạy qua tạo luồng bụi cuộn mù mịt che khuất tầm nhìn",
        "location": "Huế",
        "tags": ["đám mây bụi", "xe ben", "huế 17ha", "bụi mù mịt", "ô nhiễm nặng"]
    },
    {
        "cut_id": "cut_03_hue_dust_storm_close",
        "source_rel": "dust/clip_hue_01_giant_dust_clouds.mp4",
        "source_id": "V003",
        "start_sec": 11.5,
        "end_sec": 18.0,
        "primary_segment": "01_hook",
        "secondary_segments": ["03_context"],
        "role": "Cận cảnh đám bụi khổng lồ bao trùm cả con đường dân sinh",
        "location": "Huế",
        "tags": ["cận cảnh", "bão bụi", "che khuất", "bụi công trình", "thực địa"]
    },

    # --- V004: TPHCM Xe tải không phủ bạt & Bụi đường phố ---
    {
        "cut_id": "cut_04_hcm_uncovered_truck",
        "source_rel": "dust/clip_hcm_02_uncovered_truck_road_dust.mp4",
        "source_id": "V004",
        "start_sec": 2.0,
        "end_sec": 8.5,
        "primary_segment": "02_problem",
        "secondary_segments": ["05_core_logic"],
        "role": "Xe tải chở vật liệu không che bạt làm rơi vãi và bụi cuốn theo sau đuôi xe",
        "location": "TP. Hồ Chí Minh",
        "tags": ["xe tải không phủ bạt", "rơi vãi", "bụi đường phố", "tphcm", "vi phạm"]
    },
    {
        "cut_id": "cut_04_hcm_roadside_dust",
        "source_rel": "dust/clip_hcm_02_uncovered_truck_road_dust.mp4",
        "source_id": "V004",
        "start_sec": 10.0,
        "end_sec": 16.5,
        "primary_segment": "02_problem",
        "secondary_segments": ["05_core_logic"],
        "role": "Bụi đường do xe tải cuốn lên che khuất người tham gia giao thông",
        "location": "TP. Hồ Chí Minh",
        "tags": ["bụi đường", "người đi đường", "tphcm", "tầm nhìn", "giao thông"]
    },

    # --- V005: Hà Nội Người cao tuổi lo lắng & Bầu không khí ngột ngạt ---
    {
        "cut_id": "cut_05_hn_elderly_concern",
        "source_rel": "people/clip_hn_02_citizen_elderly_concern.mp4",
        "alt_source_rel": "vietnam/clip_02_citizen_elderly_concern.mp4",
        "source_id": "V005",
        "start_sec": 1.5,
        "end_sec": 8.0,
        "primary_segment": "02_problem",
        "secondary_segments": ["03_context"],
        "role": "Người cao tuổi ngước nhìn bầu trời mờ đục với nét mặt lo âu sức khỏe",
        "location": "Hà Nội",
        "tags": ["người cao tuổi", "hà nội", "lo lắng", "sức khỏe", "ngột ngạt", "khẩu trang"]
    },
    {
        "cut_id": "cut_05_hn_citizen_walking_mask",
        "source_rel": "people/clip_hn_02_citizen_elderly_concern.mp4",
        "alt_source_rel": "vietnam/clip_02_citizen_elderly_concern.mp4",
        "source_id": "V005",
        "start_sec": 9.0,
        "end_sec": 15.5,
        "primary_segment": "02_problem",
        "secondary_segments": ["03_context"],
        "role": "Người dân đeo khẩu trang đi lại giữa không gian mờ mịt bụi",
        "location": "Hà Nội",
        "tags": ["người dân", "khẩu trang", "phố phường", "hà nội", "sinh hoạt"]
    },

    # --- V006: Huế Trẻ em & Nguy cơ bệnh đường hô hấp ---
    {
        "cut_id": "cut_06_hue_children_home_dust",
        "source_rel": "people/clip_hue_03_children_respiratory_concern.mp4",
        "source_id": "V006",
        "start_sec": 2.0,
        "end_sec": 8.5,
        "primary_segment": "03_context",
        "secondary_segments": ["02_problem"],
        "role": "Trẻ nhỏ và người nhà bên khung cửa bám bụi dày đặc gần công trường",
        "location": "Huế",
        "tags": ["trẻ em", "viêm hô hấp", "nhà dân", "huế", "ảnh hưởng sức khỏe"]
    },
    {
        "cut_id": "cut_06_hue_dust_residential",
        "source_rel": "people/clip_hue_03_children_respiratory_concern.mp4",
        "source_id": "V006",
        "start_sec": 9.5,
        "end_sec": 16.0,
        "primary_segment": "03_context",
        "secondary_segments": ["02_problem"],
        "role": "Cảnh sinh hoạt gia đình và khu dân cư chịu ảnh hưởng trực tiếp từ bụi",
        "location": "Huế",
        "tags": ["khu dân cư", "nhà cửa", "bụi bám", "sinh hoạt", "huế"]
    },

    # --- V007: TPHCM Người dân bức xúc lau chùi bụi bám dày ---
    {
        "cut_id": "cut_07_hcm_wiping_thick_dust",
        "source_rel": "people/clip_hcm_03_resident_frustration.mp4",
        "source_id": "V007",
        "start_sec": 2.0,
        "end_sec": 9.0,
        "primary_segment": "03_context",
        "secondary_segments": ["02_problem"],
        "role": "Cận cảnh bàn tay quẹt một vệt dài lớp bụi bám dày đặc trên đồ dùng trong nhà",
        "location": "TP. Hồ Chí Minh",
        "tags": ["lau chùi", "bụi bám dày", "bức xúc", "người dân", "tphcm"]
    },
    {
        "cut_id": "cut_07_hcm_closed_doors",
        "source_rel": "people/clip_hcm_03_resident_frustration.mp4",
        "source_id": "V007",
        "start_sec": 10.0,
        "end_sec": 16.5,
        "primary_segment": "03_context",
        "secondary_segments": ["02_problem"],
        "role": "Cửa nhà đóng kín mít then cài để ngăn khói bụi từ công trình",
        "location": "TP. Hồ Chí Minh",
        "tags": ["đóng cửa kín", "ngăn bụi", "tphcm", "bất tiện", "đời sống"]
    },

    # --- V008: Huế Tưới nước thủ công bất lực dập bụi ---
    {
        "cut_id": "cut_08_hue_ineffective_manual_watering",
        "source_rel": "construction/clip_hue_04_ineffective_manual_watering.mp4",
        "source_id": "V008",
        "start_sec": 1.5,
        "end_sec": 8.0,
        "primary_segment": "06_workshop_lesson",
        "secondary_segments": ["01_hook"],
        "role": "Công nhân cầm vòi nước tưới thủ công nhỏ bé bất lực trước bãi đất mênh mông",
        "location": "Huế",
        "tags": ["tưới nước thủ công", "bất lực", "bụi vẫn mù trời", "đối phó", "huế"]
    },
    {
        "cut_id": "cut_08_hue_dust_vs_water_contrast",
        "source_rel": "construction/clip_hue_04_ineffective_manual_watering.mp4",
        "source_id": "V008",
        "start_sec": 8.0,
        "end_sec": 14.5,
        "primary_segment": "06_workshop_lesson",
        "secondary_segments": ["07_responsible_ai"],
        "role": "Tương phản giữa vòi xịt nước yếu ớt và cuộn bụi khổng lồ phía xa",
        "location": "Huế",
        "tags": ["tương phản", "vòi nước", "bụi cuộn", "thiếu giải pháp", "huế"]
    },

    # --- V009: TPHCM Kiểm tra rào chắn & Phun sương dập bụi tự động ---
    {
        "cut_id": "cut_09_hcm_barrier_audit_fieldwork",
        "source_rel": "construction/clip_hcm_04_barrier_water_spraying_audit.mp4",
        "source_id": "V009",
        "start_sec": 1.5,
        "end_sec": 8.5,
        "primary_segment": "07_responsible_ai",
        "secondary_segments": ["12_closing", "05_core_logic"],
        "role": "Đoàn kiểm tra thực địa đo đạc, kiểm tra rào chắn và quy chuẩn môi trường",
        "location": "TP. Hồ Chí Minh",
        "tags": ["kiểm tra thực địa", "đoàn kiểm tra", "rào chắn", "tphcm", "thanh tra"]
    },
    {
        "cut_id": "cut_09_hcm_automated_mist_spraying",
        "source_rel": "construction/clip_hcm_04_barrier_water_spraying_audit.mp4",
        "source_id": "V009",
        "start_sec": 9.5,
        "end_sec": 16.5,
        "primary_segment": "07_responsible_ai",
        "secondary_segments": ["09_metrics", "12_closing"],
        "role": "Hệ thống vòi phun sương tự động trên đỉnh rào chắn dập bụi hiệu quả",
        "location": "TP. Hồ Chí Minh",
        "tags": ["phun sương tự động", "dập bụi", "rào chắn", "tphcm", "biện pháp chuẩn"]
    },

    # --- V010: Hà Nội Thanh niên xung kích & Hành động vì môi trường ---
    {
        "cut_id": "cut_10_hn_youth_field_action",
        "source_rel": "people/clip_hn_04_youth_action.mp4",
        "alt_source_rel": "vietnam/clip_04_youth_action.mp4",
        "source_id": "V010",
        "start_sec": 1.0,
        "end_sec": 7.0,
        "primary_segment": "08_lean_pilot",
        "secondary_segments": ["10_community"],
        "role": "Thanh niên trẻ năng động trao đổi, khảo sát và ghi nhận thực địa",
        "location": "Hà Nội",
        "tags": ["thanh niên", "hành động", "khảo sát thực địa", "môi trường", "tuổi trẻ"]
    },
    {
        "cut_id": "cut_10_hn_youth_community_team",
        "source_rel": "people/clip_hn_04_youth_action.mp4",
        "alt_source_rel": "vietnam/clip_04_youth_action.mp4",
        "source_id": "V010",
        "start_sec": 7.0,
        "end_sec": 13.5,
        "primary_segment": "10_community",
        "secondary_segments": ["08_lean_pilot"],
        "role": "Nhóm thanh niên tình nguyện viên đồng hành vì thành phố xanh sạch đẹp",
        "location": "Hà Nội",
        "tags": ["tình nguyện", "nhóm thanh niên", "cộng đồng", "đóng góp", "hà nội"]
    },

    # --- V011: Hà Nội Xe buýt điện VinBus & Giao thông xanh ---
    {
        "cut_id": "cut_11_hn_green_bus_cruising",
        "source_rel": "vietnam/clip_hn2_04_green_transport_electric_bus.mp4",
        "source_id": "V011",
        "start_sec": 2.0,
        "end_sec": 9.0,
        "primary_segment": "08_lean_pilot",
        "secondary_segments": ["11_expansion"],
        "role": "Xe buýt điện VinBus lăn bánh êm ái trên đường phố hiện đại, giảm phát thải",
        "location": "Hà Nội",
        "tags": ["xe buýt điện", "vinbus", "giao thông xanh", "hà nội", "không phát thải"]
    },
    {
        "cut_id": "cut_11_hn_clean_city_mobility",
        "source_rel": "vietnam/clip_hn2_04_green_transport_electric_bus.mp4",
        "source_id": "V011",
        "start_sec": 10.5,
        "end_sec": 17.5,
        "primary_segment": "11_expansion",
        "secondary_segments": ["08_lean_pilot"],
        "role": "Toàn cảnh phương tiện giao thông xanh sạch, hướng tới đô thị bền vững",
        "location": "Hà Nội",
        "tags": ["đô thị xanh", "giao thông sạch", "tương lai bền vững", "hà nội"]
    },

    # --- V014: Hà Nội Xe vòi rồng dập bụi & AI Camera giám sát ---
    {
        "cut_id": "cut_14_hn_mist_cannon_truck",
        "source_rel": "construction/clip_hn2_03_mist_cannon_truck_and_ai_camera.mp4",
        "source_id": "V014",
        "start_sec": 1.5,
        "end_sec": 8.5,
        "primary_segment": "07_responsible_ai",
        "secondary_segments": ["06_workshop_lesson"],
        "role": "Xe vòi rồng chuyên dụng phun sương dập bụi công suất cao tại công trình lớn",
        "location": "Hà Nội",
        "tags": ["xe vòi rồng", "phun sương", "dập bụi công suất lớn", "hà nội", "hiện đại"]
    },
    {
        "cut_id": "cut_14_hn_ai_camera_monitoring",
        "source_rel": "construction/clip_hn2_03_mist_cannon_truck_and_ai_camera.mp4",
        "source_id": "V014",
        "start_sec": 9.5,
        "end_sec": 16.5,
        "primary_segment": "07_responsible_ai",
        "secondary_segments": ["05_core_logic"],
        "role": "Camera AI giám sát công trường hỗ trợ thu thập dữ liệu khách quan",
        "location": "Hà Nội",
        "tags": ["camera ai", "giám sát công trường", "hà nội", "công nghệ hỗ trợ"]
    },

    # --- V015: Huế Bụi phủ trắng cây cối & Nhà cửa dân cư ---
    {
        "cut_id": "cut_15_hue_dust_covered_trees",
        "source_rel": "dust/clip_hue_02_dust_on_trees_and_houses.mp4",
        "source_id": "V015",
        "start_sec": 2.0,
        "end_sec": 8.5,
        "primary_segment": "03_context",
        "secondary_segments": ["02_problem"],
        "role": "Cây cối ven đường trắng xóa xơ xác vì bụi công trường kéo dài",
        "location": "Huế",
        "tags": ["cây cối bám bụi", "trắng xóa", "môi trường suy giảm", "huế"]
    },
    {
        "cut_id": "cut_15_hue_dust_covered_rooftops",
        "source_rel": "dust/clip_hue_02_dust_on_trees_and_houses.mp4",
        "source_id": "V015",
        "start_sec": 9.5,
        "end_sec": 16.0,
        "primary_segment": "03_context",
        "secondary_segments": ["01_hook"],
        "role": "Mái tôn và hiên nhà dân cư phủ đầy lớp bụi đỏ dày đặc",
        "location": "Huế",
        "tags": ["mái nhà", "bụi đỏ", "nhà dân", "huế", "hậu quả thực tế"]
    },

    # --- V016: Hà Nội Ùn tắc giao thông & Khói bụi đường phố ---
    {
        "cut_id": "cut_16_hn_traffic_dust_jam",
        "source_rel": "vietnam/clip_hn_03_traffic_dust_congestion.mp4",
        "alt_source_rel": "vietnam/clip_03_traffic_dust_congestion.mp4",
        "source_id": "V016",
        "start_sec": 2.0,
        "end_sec": 9.0,
        "primary_segment": "02_problem",
        "secondary_segments": ["01_hook"],
        "role": "Đoàn xe máy chìm trong khói bụi và ùn tắc giao thông giờ cao điểm",
        "location": "Hà Nội",
        "tags": ["ùn tắc giao thông", "khói bụi", "xe máy", "hà nội", "giờ cao điểm"]
    },

    # --- V017: Hà Nội Chỉ thị 19 Quản lý bụi & Đình chỉ thi công ---
    {
        "cut_id": "cut_17_directive19_regulatory_action",
        "source_rel": "vietnam/clip_hn2_02_directive19_halt_construction.mp4",
        "source_id": "V017",
        "start_sec": 2.0,
        "end_sec": 9.0,
        "primary_segment": "06_workshop_lesson",
        "secondary_segments": ["07_responsible_ai"],
        "role": "Văn bản chỉ đạo quản lý môi trường và xử lý vi phạm công trường",
        "location": "Hà Nội",
        "tags": ["chỉ thị 19", "pháp lý", "quản lý môi trường", "đình chỉ thi công", "hà nội"]
    },

    # --- V018: Đồ họa Phân tích nguồn phát thải bụi đô thị ---
    {
        "cut_id": "cut_18_emission_sources_chart",
        "source_rel": "project_demo/clip_hn2_01_emission_sources_graphic.mp4",
        "source_id": "V018",
        "start_sec": 1.5,
        "end_sec": 8.5,
        "primary_segment": "02_problem",
        "secondary_segments": ["11_expansion"],
        "role": "Đồ họa phân tích cơ cấu các nguồn phát thải bụi mịn đô thị",
        "location": "Toàn quốc",
        "tags": ["đồ họa", "nguồn phát thải", "phân tích", "dữ liệu bụi", "đô thị"]
    }
]

# Định nghĩa 12 Phân cảnh (12 Story Segments)
SEGMENTS_SPEC = {
    "01_hook": {
        "title": "Mở vấn đề: Bụi công trình đang ở ngoài đường",
        "timecode": "0:00 - 0:18",
        "duration_sec": 18.0,
        "voice_summary": "Những công trường mới... nhưng có tác động rất dễ bị xem là nhỏ: Bụi công trình.",
        "primary_cuts": [
            "cut_01_hn_city_haze_pan",
            "cut_02_hcm_construction_cranes",
            "cut_03_hue_giant_dust_plume",
            "cut_02_hcm_excavator_digging"
        ],
        "visual_goal": "Thiết lập bối cảnh đô thị đang phát triển, flycam bụi mờ và sự bùng nổ của bụi công trường trên khắp 3 miền (Hà Nội, TPHCM, Huế)."
    },
    "02_problem": {
        "title": "Nút thắt: Dữ liệu phân tán, thiếu thứ tự ưu tiên",
        "timecode": "0:18 - 0:38",
        "duration_sec": 20.0,
        "voice_summary": "Vấn đề không phải không có dữ liệu... mà khi phân tán, khó biến thành hành động có ưu tiên.",
        "primary_cuts": [
            "cut_05_hn_elderly_concern",
            "cut_04_hcm_uncovered_truck",
            "cut_16_hn_traffic_dust_jam",
            "cut_05_hn_citizen_walking_mask",
            "cut_18_emission_sources_chart"
        ],
        "visual_goal": "Khắc họa nỗi trăn trở của người dân khi hít thở khói bụi, xe tải vương vãi đất cát và sự rời rạc của các luồng thông tin."
    },
    "03_context": {
        "title": "5 Câu hỏi trung tâm: Tín hiệu đi đến đâu?",
        "timecode": "0:38 - 0:55",
        "duration_sec": 17.0,
        "voice_summary": "Nếu cùng lúc có 10 phản ánh: nhìn vào đâu trước? Ai phụ trách? Đã đi đến đâu?",
        "primary_cuts": [
            "cut_06_hue_children_home_dust",
            "cut_07_hcm_wiping_thick_dust",
            "cut_15_hue_dust_covered_trees",
            "cut_07_hcm_closed_doors",
            "cut_06_hue_dust_residential"
        ],
        "visual_goal": "Điểm rơi cảm xúc về sức khỏe trẻ em và sự bất tiện đóng kín cửa của người dân, tạo khoảng trống cấp thiết trước khi DustGuard xuất hiện."
    },
    "04_solution": {
        "title": "DustGuard xuất hiện: Từ tín hiệu đến hồ sơ theo dõi",
        "timecode": "0:55 - 1:10",
        "duration_sec": 15.0,
        "voice_summary": "DustGuard được xây dựng để kết nối tín hiệu, bằng chứng, ưu tiên và theo dõi tiến trình.",
        "primary_cuts": [
            "cut_02_hcm_construction_cranes"
        ],
        "visual_goal": "Beat drop bùng nổ, logo DustGuard VN xuất hiện, chuyển dịch từ hiện trường thực tế sang bản đồ số tương tác."
    },
    "05_core_logic": {
        "title": "Tính mới: 1 Tín hiệu ➔ 1 Hồ sơ có bằng chứng & theo dõi",
        "timecode": "1:10 - 1:30",
        "duration_sec": 20.0,
        "voice_summary": "1 tín hiệu ban đầu thành 1 hồ sơ có bằng chứng, có mức độ ưu tiên và biết đang xử lý tới đâu.",
        "primary_cuts": [
            "cut_04_hcm_roadside_dust",
            "cut_03_hue_giant_dust_plume"
        ],
        "visual_goal": "Thao tác trên UI Web App: Chuyển đổi Observation thành Case, chuỗi ảnh đối chứng Before/After và mã băm SHA-256."
    },
    "06_workshop_lesson": {
        "title": "Bài học sau tập huấn: Hỗ trợ thông tin, không phán xét",
        "timecode": "1:30 - 1:49",
        "duration_sec": 19.0,
        "voice_summary": "Hệ thống thông minh không cố đưa ra quyết định thay con người, mà giúp con người quyết định tốt hơn.",
        "primary_cuts": [
            "cut_08_hue_ineffective_manual_watering",
            "cut_08_hue_dust_vs_water_contrast",
            "cut_17_directive19_regulatory_action"
        ],
        "visual_goal": "Hình ảnh tưới nước thủ công bất lực phản ánh các cách làm chắp vá cũ, đối chiếu với sự chuẩn hóa sau tập huấn."
    },
    "07_responsible_ai": {
        "title": "Responsible AI: Ưu tiên (Triage) ≠ Kết luận vi phạm",
        "timecode": "1:49 - 2:08",
        "duration_sec": 19.0,
        "voice_summary": "AI tóm tắt, tìm thông tin thiếu, hỗ trợ checklist. Không tự xử phạt, không thay thế cơ quan quản lý.",
        "primary_cuts": [
            "cut_09_hcm_barrier_audit_fieldwork",
            "cut_09_hcm_automated_mist_spraying",
            "cut_14_hn_mist_cannon_truck",
            "cut_14_hn_ai_camera_monitoring"
        ],
        "visual_goal": "Cận cảnh UI AI Checklist Assistant kết hợp thực địa kiểm tra rào chắn, hệ thống phun sương dập bụi tự động chuẩn quy chuẩn."
    },
    "08_lean_pilot": {
        "title": "Thử nhỏ, đo thật: Mô hình Lean Pilot 4-8 tuần",
        "timecode": "2:08 - 2:28",
        "duration_sec": 20.0,
        "voice_summary": "Không bắt đầu bằng hạ tầng thật lớn. 1 pilot 4-8 tuần, 20-30 người dùng thật tại trường học/CLB.",
        "primary_cuts": [
            "cut_10_hn_youth_field_action",
            "cut_11_hn_green_bus_cruising"
        ],
        "visual_goal": "Thanh niên sử dụng Mobile App ngoài thực địa, kết nối không khí giao thông xanh tươi sáng khi chuyển sang BGM 2."
    },
    "09_metrics": {
        "title": "Đo lường giá trị thật: 4 Chỉ số hành động",
        "timecode": "2:28 - 2:45",
        "duration_sec": 17.0,
        "voice_summary": "Bao nhiêu vụ việc đủ bằng chứng? Thời gian phản hồi bao lâu? Bao nhiêu vụ việc có kết quả?",
        "primary_cuts": [
            "cut_09_hcm_automated_mist_spraying"
        ],
        "visual_goal": "Dashboard UI 4 chỉ số đo lường thực nghiệm (kèm nhãn 'Mục tiêu Pilot / Demo Model')."
    },
    "10_community": {
        "title": "Cộng đồng là mắt xích: Sức mạnh Thanh niên & CLB",
        "timecode": "2:45 - 3:00",
        "duration_sec": 15.0,
        "voice_summary": "Bắt đầu từ những cộng đồng có động lực: trường học, CLB môi trường, người trẻ... ghi nhận tốt hơn, theo dõi lâu hơn.",
        "primary_cuts": [
            "cut_10_hn_youth_community_team",
            "cut_10_hn_youth_field_action"
        ],
        "visual_goal": "Hình ảnh thanh niên xung kích vì môi trường kết hợp UI Nhật ký đóng góp cộng đồng (Youth Activity Log)."
    },
    "11_expansion": {
        "title": "Một lõi quản trị tín hiệu — Mở rộng đa bài toán",
        "timecode": "3:00 - 3:17",
        "duration_sec": 17.0,
        "voice_summary": "Cùng một lõi phát triển cho: Nước thải, Đốt rơm rạ, Thuốc bảo vệ thực vật, Tiếng ồn...",
        "primary_cuts": [
            "cut_11_hn_clean_city_mobility",
            "cut_11_hn_green_bus_cruising",
            "cut_18_emission_sources_chart"
        ],
        "visual_goal": "Graphic trung tâm mở rộng 4 bài toán môi trường kết hợp cảnh quan đô thị sinh thái hiện đại."
    },
    "12_closing": {
        "title": "Finale & Sứ mệnh: Có ưu tiên, Có bằng chứng, Có theo dõi",
        "timecode": "3:17 - 3:30",
        "duration_sec": 13.0,
        "voice_summary": "DustGuard — Biến dữ liệu thành hành động quản lý có ưu tiên, có bằng chứng và có theo dõi.",
        "primary_cuts": [
            "cut_01_hn_city_haze_wide",
            "cut_09_hcm_barrier_audit_fieldwork"
        ],
        "visual_goal": "Montage 3 nhịp dồn dập: Thực địa ➔ Nền tảng ➔ Hành động con người, kết thúc bằng Logo DustGuard VN kiêu hãnh."
    }
}


def run_command(cmd, desc=""):
    """Chạy lệnh subprocess an toàn và trả về kết quả."""
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return res.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"❌ Lỗi khi thực hiện [{desc}]: {e.stderr}", file=sys.stderr)
        raise


def probe_video(file_path):
    """Lấy metadata chi tiết của file video bằng ffprobe."""
    cmd = [
        "ffprobe", "-v", "error",
        "-select_streams", "v:0",
        "-show_entries", "stream=width,height,r_frame_rate,avg_frame_rate,duration,bit_rate,codec_name,pix_fmt:format=duration,bit_rate,size,format_name",
        "-of", "json",
        str(file_path)
    ]
    res_str = run_command(cmd, f"Probe {file_path}")
    data = json.loads(res_str)
    
    stream = data.get("streams", [{}])[0] if data.get("streams") else {}
    fmt = data.get("format", {})
    
    # Parse fps
    r_fps = stream.get("r_frame_rate", "25/1")
    if "/" in r_fps:
        num, den = r_fps.split("/")
        fps_val = round(float(num) / float(den), 2) if float(den) != 0 else 25.0
    else:
        fps_val = float(r_fps) if r_fps else 25.0

    dur_val = float(fmt.get("duration", stream.get("duration", 0)))
    bitrate_val = int(fmt.get("bit_rate", stream.get("bit_rate", 0)))
    size_bytes = int(fmt.get("size", 0))

    return {
        "width": stream.get("width"),
        "height": stream.get("height"),
        "aspect_ratio": f"{stream.get('width')}:{stream.get('height')}",
        "fps": fps_val,
        "codec": stream.get("codec_name"),
        "pix_fmt": stream.get("pix_fmt"),
        "duration_sec": round(dur_val, 3),
        "bitrate_kbps": round(bitrate_val / 1000, 1) if bitrate_val else 0,
        "size_mb": round(size_bytes / (1024 * 1024), 2),
        "size_bytes": size_bytes
    }


def scan_source_videos():
    """Quét toàn bộ video có trong 02_sources/real_video/."""
    print("🔍 Đang quét toàn bộ video nguồn trong 02_sources/real_video/...")
    video_files = sorted(glob.glob(str(SOURCES_DIR / "**" / "*.mp4"), recursive=True))
    inventory = {}
    
    for vf in video_files:
        p = Path(vf)
        rel_p = str(p.relative_to(SOURCES_DIR)).replace("\\", "/")
        meta = probe_video(p)
        inventory[rel_p] = {
            "abs_path": str(p).replace("\\", "/"),
            "rel_path": rel_p,
            "filename": p.name,
            "folder": p.parent.name,
            **meta
        }
        print(f"  ✓ [{p.parent.name}] {p.name}: {meta['width']}x{meta['height']} @ {meta['fps']}fps | {meta['duration_sec']}s | {meta['size_mb']}MB")

    print(f"✅ Đã quét và phân tích xong {len(inventory)} video nguồn.\n")
    return inventory


def render_golden_cuts(inventory, force=False):
    """Trích xuất và chuẩn hóa từng Golden Cut về 1920x1080 25fps."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print("✂️  Bắt đầu trích xuất và chuẩn hóa Golden Cuts (Full HD 1080p, 25fps, Anti-shake, Mute audio)...")
    
    rendered_manifest = []
    
    for idx, spec in enumerate(GOLDEN_CUTS_SPEC, 1):
        cut_id = spec["cut_id"]
        out_filename = f"{cut_id}.mp4"
        out_path = OUTPUT_DIR / out_filename
        
        # Tìm file nguồn
        source_rel = spec["source_rel"]
        if source_rel not in inventory and "alt_source_rel" in spec and spec["alt_source_rel"] in inventory:
            source_rel = spec["alt_source_rel"]
            
        if source_rel not in inventory:
            print(f"  ⚠️ Không tìm thấy file nguồn cho {cut_id} (thử: {source_rel})")
            continue
            
        src_meta = inventory[source_rel]
        src_abs = src_meta["abs_path"]
        
        start_t = spec["start_sec"]
        end_t = spec["end_sec"]
        target_dur = round(end_t - start_t, 3)
        
        # Kiểm tra nếu file đã tồn tại và không bắt buộc render lại
        if out_path.exists() and not force:
            print(f"  ⏩ [{idx}/{len(GOLDEN_CUTS_SPEC)}] Bỏ qua (đã có): {out_filename}")
        else:
            print(f"  🎬 [{idx}/{len(GOLDEN_CUTS_SPEC)}] Đang render: {out_filename} ({start_t}s -> {end_t}s, dur: {target_dur}s)...")
            
            # FFmpeg filter:
            # 1. Scale & Crop chuẩn 1920x1080 không méo tỉ lệ
            # 2. Khử rung / Làm nét unsharp nhẹ phục hồi chi tiết từ 360p lên 1080p
            # 3. Ép chuẩn 25fps progressive
            # 4. Mute hoàn toàn audio (-an) theo nguyên tắc Anti-Overclaim QC
            vf_filter = (
                "scale=1920:1080:force_original_aspect_ratio=increase,"
                "crop=1920:1080,"
                "fps=25,"
                "unsharp=5:5:0.8:5:5:0.4"
            )
            
            cmd = [
                "ffmpeg", "-y",
                "-ss", str(start_t),
                "-to", str(end_t),
                "-i", src_abs,
                "-vf", vf_filter,
                "-c:v", "libx264",
                "-preset", "slow",
                "-crf", "18",
                "-pix_fmt", "yuv420p",
                "-an",
                str(out_path)
            ]
            
            t0 = time.time()
            run_command(cmd, f"Render {cut_id}")
            t_elapsed = time.time() - t0
            print(f"     ✅ Xong trong {t_elapsed:.2f}s")

        # Kiểm tra tính toàn vẹn của file xuất bằng ffprobe
        out_meta = probe_video(out_path)
        
        cut_entry = {
            "cut_id": cut_id,
            "file_name": out_filename,
            "rel_path": f"03_selected/footage/{out_filename}",
            "abs_path": str(out_path).replace("\\", "/"),
            "source_id": spec["source_id"],
            "source_file": source_rel,
            "source_location": spec["location"],
            "in_point_sec": start_t,
            "out_point_sec": end_t,
            "duration_sec": out_meta["duration_sec"],
            "width": out_meta["width"],
            "height": out_meta["height"],
            "fps": out_meta["fps"],
            "bitrate_kbps": out_meta["bitrate_kbps"],
            "size_mb": out_meta["size_mb"],
            "primary_segment": spec["primary_segment"],
            "secondary_segments": spec["secondary_segments"],
            "role": spec["role"],
            "tags": spec["tags"]
        }
        rendered_manifest.append(cut_entry)

    print(f"\n✅ Đã trích xuất và chuẩn hóa hoàn tất {len(rendered_manifest)} Golden Cuts.\n")
    return rendered_manifest


def build_and_save_manifest(inventory, rendered_cuts):
    """Tạo manifest ánh xạ 12 phân cảnh kịch bản và xuất ra footage_manifest.json."""
    print("📝 Đang lập Manifest hoàn chỉnh và ánh xạ 12 phân cảnh...")
    
    # Tổ chức map cuts theo segment
    cuts_by_id = {c["cut_id"]: c for c in rendered_cuts}
    
    segments_mapping = {}
    for seg_id, seg_info in SEGMENTS_SPEC.items():
        matched_cuts = []
        for cut_id in seg_info["primary_cuts"]:
            if cut_id in cuts_by_id:
                c = cuts_by_id[cut_id]
                matched_cuts.append({
                    "cut_id": c["cut_id"],
                    "file_name": c["file_name"],
                    "rel_path": c["rel_path"],
                    "source_id": c["source_id"],
                    "duration_sec": c["duration_sec"],
                    "location": c["source_location"],
                    "role": c["role"]
                })
        
        segments_mapping[seg_id] = {
            "title": seg_info["title"],
            "timecode": seg_info["timecode"],
            "target_duration_sec": seg_info["duration_sec"],
            "voice_summary": seg_info["voice_summary"],
            "visual_goal": seg_info["visual_goal"],
            "total_cuts": len(matched_cuts),
            "cuts": matched_cuts
        }

    total_golden_duration = sum(c["duration_sec"] for c in rendered_cuts)
    total_golden_size_mb = sum(c["size_mb"] for c in rendered_cuts)

    manifest_data = {
        "project": "DustGuard VN — Final Presentation Video (UNICEF Hackathon 2026)",
        "generator": "Subagent 3: Video Footage Indexer & Scene Matcher",
        "spec_reference": "presentation/DIRECTOR_TREATMENT_EDITING_SPEC.md",
        "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "standards": {
            "resolution": "1920x1080 Full HD (16:9)",
            "framerate": "25.0 fps (Progressive)",
            "video_codec": "H.264 / libx264 (High Profile, CRF 18)",
            "pixel_format": "yuv420p",
            "audio_policy": "Muted (-an) — 100% tiếng ồn gốc & phóng viên được loại bỏ, sẵn sàng cho Master Audio Mixing",
            "enhancement_filters": "Lanczos Upscale + Unsharp Detail Filter"
        },
        "summary": {
            "total_source_videos": len(inventory),
            "total_golden_cuts": len(rendered_cuts),
            "total_golden_duration_sec": round(total_golden_duration, 2),
            "total_golden_size_mb": round(total_golden_size_mb, 2),
            "total_story_segments": len(SEGMENTS_SPEC),
            "regions_covered": ["Hà Nội", "TP. Hồ Chí Minh", "Huế"]
        },
        "segments_mapping": segments_mapping,
        "golden_cuts": rendered_cuts,
        "source_inventory": inventory
    }

    with open(MANIFEST_FILE, "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, ensure_ascii=False, indent=2)

    print(f"✅ Đã lưu Manifest thành công tại: {MANIFEST_FILE}")
    return manifest_data


def print_summary_report(manifest_data):
    """In báo cáo tổng hợp trực quan ra console."""
    summary = manifest_data["summary"]
    print("\n" + "="*75)
    print("📊 BÁO CÁO TỔNG HỢP VIDEO FOOTAGE INDEX & GOLDEN CUTS — DUSTGUARD VN")
    print("="*75)
    print(f"• Tổng số video nguồn phân tích  : {summary['total_source_videos']} clips")
    print(f"• Tổng số Golden Cuts trích xuất : {summary['total_golden_cuts']} cuts chuẩn Full HD 1080p 25fps")
    print(f"• Tổng thời lượng footage đắt giá: {summary['total_golden_duration_sec']} giây (~{summary['total_golden_duration_sec']/60:.1f} phút)")
    print(f"• Tổng dung lượng lưu trữ        : {summary['total_golden_size_mb']} MB")
    print(f"• Địa bàn thực địa bao phủ       : Hà Nội, TP. Hồ Chí Minh, Thừa Thiên Huế")
    print(f"• Chuẩn video đầu ra             : 1920x1080 25fps, H.264 CRF 18, Muted (-an)")
    print("-" * 75)
    print("🎬 DANH MỤC ÁNH XẠ 12 PHÂN CẢNH KỊCH BẢN (STORY ARC):")
    for seg_id, seg in manifest_data["segments_mapping"].items():
        print(f"\n  [{seg_id}] {seg['timecode']} | {seg['title']}")
        print(f"    - Visual Goal: {seg['visual_goal']}")
        for cut in seg["cuts"]:
            print(f"      ▶ {cut['cut_id']} ({cut['duration_sec']}s) [{cut['location']}]: {cut['role']}")
    print("="*75 + "\n")


def main():
    parser = argparse.ArgumentParser(description="DustGuard VN Video Footage Indexer & Scene Matcher")
    parser.add_argument("--force", action="store_true", help="Render lại toàn bộ Golden Cuts dù đã tồn tại")
    args = parser.parse_args()

    # 1. Quét và phân tích video nguồn
    inventory = scan_source_videos()
    
    # 2. Trích xuất và chuẩn hóa Golden Cuts
    rendered_cuts = render_golden_cuts(inventory, force=args.force)
    
    # 3. Lập manifest và ánh xạ 12 phân cảnh
    manifest_data = build_and_save_manifest(inventory, rendered_cuts)
    
    # 4. In báo cáo tổng hợp
    print_summary_report(manifest_data)


if __name__ == "__main__":
    main()
