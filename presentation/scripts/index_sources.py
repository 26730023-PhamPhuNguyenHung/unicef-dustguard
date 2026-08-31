#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🎬 DUSTGUARD VN — SOURCE INDEXER
Quét kho tài nguyên media trong presentation/02_sources/, đo lường thời lượng,
kích thước, tỷ lệ khung hình bằng ffprobe và cập nhật 02_sources/SOURCE_INDEX.csv.
"""

import os
import sys
import csv
import json
import subprocess
from pathlib import Path

# Cấu hình UTF-8 cho Windows Console chống lỗi charmap cp1252
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
if hasattr(sys.stderr, "reconfigure"):
    try:
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

BASE_DIR = Path(__file__).resolve().parent.parent
SOURCES_DIR = BASE_DIR / "02_sources"
OUTPUT_CSV = SOURCES_DIR / "SOURCE_INDEX.csv"

def get_media_info(file_path):
    """Sử dụng ffprobe để lấy thời lượng và độ phân giải của file media."""
    try:
        cmd = [
            "ffprobe",
            "-v", "error",
            "-show_entries", "format=duration:stream=width,height,codec_type",
            "-of", "json",
            str(file_path)
        ]
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        data = json.loads(result.stdout)
        
        duration = float(data.get("format", {}).get("duration", 0.0))
        width = 0
        height = 0
        codec_type = "unknown"
        for s in data.get("streams", []):
            if s.get("codec_type") == "video":
                width = int(s.get("width", 0))
                height = int(s.get("height", 0))
                codec_type = "video"
                break
            elif s.get("codec_type") == "audio" and codec_type == "unknown":
                codec_type = "audio"
        return {"duration": round(duration, 3), "width": width, "height": height, "codec_type": codec_type}
    except Exception as e:
        return {"duration": 0.0, "width": 0, "height": 0, "codec_type": "unknown", "error": str(e)}

def index_all_sources():
    print("[Stage 3] Đang quét và đánh chỉ mục tài nguyên trong 02_sources/...")
    
    sources = []
    
    # 1. Quét Video
    video_dir = SOURCES_DIR / "real_video"
    video_mapping = {
        "clip_hn_01_city_haze.mp4": ("V001", "flycam,hà nội,sương bụi,toàn cảnh thành phố", "01;12"),
        "clip_01_city_haze.mp4": ("V001_ALT", "flycam,sương mù bụi,đô thị", "01"),
        "clip_hcm_01_construction_overview.mp4": ("V002", "công trường tphcm,cần cẩu,máy xúc,bụi", "01;04"),
        "clip_hue_01_giant_dust_clouds.mp4": ("V003", "đám mây bụi,huế 17ha,xe ben,bụi cuốn mù mịt", "01"),
        "clip_hcm_02_uncovered_truck_road_dust.mp4": ("V004", "xe tải không phủ bạt,bụi đường phố,tphcm", "02"),
        "clip_hn_02_citizen_elderly_concern.mp4": ("V005", "người cao tuổi,hà nội,lo lắng sức khỏe,ngột ngạt", "02"),
        "clip_02_citizen_elderly_concern.mp4": ("V005_ALT", "phản ánh người dân,sức khỏe", "02"),
        "clip_hue_03_children_respiratory_concern.mp4": ("V006", "trẻ em,viêm hô hấp,nhà dân bám bụi,huế", "03"),
        "clip_hcm_03_resident_frustration.mp4": ("V007", "người dân đóng kín cửa,bức xúc lau dọn bụi", "03"),
        "clip_hue_04_ineffective_manual_watering.mp4": ("V008", "tưới nước thủ công bất lực,bụi vẫn mù trời", "06"),
        "clip_hcm_04_barrier_water_spraying_audit.mp4": ("V009", "kiểm tra rào chắn,phun sương dập bụi,thực địa", "05;07"),
        "clip_hn_04_youth_action.mp4": ("V010", "thanh niên hành động,khẩu trang chống bụi,môi trường", "08;10"),
        "clip_04_youth_action.mp4": ("V010_ALT", "thanh niên tình nguyện,môi trường", "08;10"),
        "clip_hn2_04_green_transport_electric_bus.mp4": ("V011", "xe buýt điện vinbus,giao thông xanh tương lai", "11"),
        "clip_hn2_03_mist_cannon_truck_and_ai_camera.mp4": ("V014", "xe vòi rồng phun sương,ai camera giám sát", "07"),
        "clip_hue_02_dust_on_trees_and_houses.mp4": ("V015", "bụi phủ trắng xóa cây cối,nhà cửa dân cư", "03"),
        "clip_hn2_01_emission_sources_graphic.mp4": ("V016", "đồ họa nguồn phát thải bụi đô thị", "02;04"),
        "clip_hn2_02_directive19_halt_construction.mp4": ("V017", "chỉ thị 19 đình chỉ công trình gây bụi", "06;07"),
    }
    
    if video_dir.exists():
        for root, _, files in os.walk(video_dir):
            for file in files:
                if file.endswith((".mp4", ".mov", ".mkv", ".webm")):
                    full_path = Path(root) / file
                    rel_path = full_path.relative_to(BASE_DIR).as_posix()
                    info = get_media_info(full_path)
                    
                    id_val, tags_val, priority_val = video_mapping.get(file, (f"V_AUTO_{len(sources)+1:03d}", "video,b-roll", "00"))
                    sources.append({
                        "id": id_val,
                        "type": "video",
                        "file": rel_path,
                        "duration": info["duration"],
                        "resolution": f"{info['width']}x{info['height']}",
                        "tags": tags_val,
                        "quality": "A" if info["height"] >= 720 else "B",
                        "segment_priority": priority_val
                    })

    # 2. Quét Ảnh (Real Images)
    image_dir = SOURCES_DIR / "real_images"
    image_mapping = {
        "ChatGPT Image 09_56_46 31 thg 8, 2026 (1).png": ("I001", "app ui,bản đồ điểm nóng,mobile view", "04;10"),
        "ChatGPT Image 09_56_47 31 thg 8, 2026 (2).png": ("I002", "dashboard kpi,dust risk score,ưu tiên xử lý", "04;09"),
        "ChatGPT Image 09_56_48 31 thg 8, 2026 (3).png": ("I003", "trạm đo iot vi cảm biến,quang học mở", "05;08"),
        "ChatGPT Image 09_56_49 31 thg 8, 2026 (4).png": ("I004", "hồ sơ vụ việc,đối chứng before after,sha256", "05"),
        "ChatGPT Image 09_56_50 31 thg 8, 2026 (5).png": ("I005", "thanh niên khảo sát thực địa,đo kiểm bụi", "10"),
        "ChatGPT Image 09_56_50 31 thg 8, 2026 (6).png": ("I006", "công trường thi công,rào chắn,tưới ẩm", "06"),
        "ChatGPT Image 09_56_50 31 thg 8, 2026 (7).png": ("I007", "đô thị thông minh việt nam,không khí sạch", "11;12"),
        "ChatGPT Image 09_56_51 31 thg 8, 2026 (8).png": ("I008", "biểu đồ tiến độ pilot,chỉ số lean", "08;09"),
        "ChatGPT Image 09_56_51 31 thg 8, 2026 (9).png": ("I009", "hệ sinh thái mở rộng đa bài toán môi trường", "11"),
        "ChatGPT Image 09_56_51 31 thg 8, 2026 (10).png": ("I010", "logo dustguard vn,khiên bảo vệ,civic tech", "04;12"),
    }
    
    if image_dir.exists():
        for root, _, files in os.walk(image_dir):
            for file in files:
                if file.endswith((".png", ".jpg", ".jpeg", ".webp")):
                    full_path = Path(root) / file
                    rel_path = full_path.relative_to(BASE_DIR).as_posix()
                    info = get_media_info(full_path)
                    
                    id_val, tags_val, priority_val = image_mapping.get(file, (f"I_AUTO_{len(sources)+1:03d}", "hình ảnh thực địa", "00"))
                    sources.append({
                        "id": id_val,
                        "type": "image",
                        "file": rel_path,
                        "duration": 5.0,
                        "resolution": f"{info['width']}x{info['height']}",
                        "tags": tags_val,
                        "quality": "A",
                        "segment_priority": priority_val
                    })

    # 3. Quét Slides
    slides_dir = SOURCES_DIR / "slides" / "png"
    if slides_dir.exists():
        for file in sorted(os.listdir(slides_dir)):
            if file.endswith(".png"):
                full_path = slides_dir / file
                rel_path = full_path.relative_to(BASE_DIR).as_posix()
                info = get_media_info(full_path)
                slide_num = file.split("_")[1] if len(file.split("_")) > 1 else "01"
                sources.append({
                    "id": f"S0{slide_num}",
                    "type": "slide",
                    "file": rel_path,
                    "duration": 5.0,
                    "resolution": f"{info['width']}x{info['height']}",
                    "tags": f"slide {slide_num},thuyết trình,unicef hackathon",
                    "quality": "A",
                    "segment_priority": slide_num
                })

    # Ghi ra CSV
    fieldnames = ["id", "type", "file", "duration", "resolution", "tags", "quality", "segment_priority"]
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in sources:
            writer.writerow(row)
            
    print(f"-> Đã đánh chỉ mục {len(sources)} tài nguyên vào {OUTPUT_CSV}")
    return sources

if __name__ == "__main__":
    index_all_sources()
