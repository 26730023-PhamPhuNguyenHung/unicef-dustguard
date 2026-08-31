"""
DustGuard VN - Source Indexer
Tự động quét toàn bộ nguồn video, ảnh, slide có sẵn và xuất ra 02_sources/SOURCE_INDEX.csv
Đồng thời phân bổ link/copy vào các danh mục phù hợp.
"""

import os
import sys
import csv
import json
import shutil
import subprocess
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

BASE_DIR = Path(__file__).resolve().parent.parent

def get_media_duration(file_path):
    try:
        cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(file_path)]
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        data = json.loads(res.stdout)
        return round(float(data["format"]["duration"]), 2)
    except Exception:
        return 0.0

def main():
    print("=== DUSTGUARD VN SOURCE INDEXER ===")
    
    extracted_clips_dir = BASE_DIR / "output" / "extracted_clips"
    media_dir = BASE_DIR / "media"
    sources_dir = BASE_DIR / "02_sources"
    csv_file = sources_dir / "SOURCE_INDEX.csv"
    
    records = []
    
    # 1. Quét các video trích xuất (extracted clips)
    clip_metadata = {
        "clip_hn_01_city_haze.mp4": {"id": "V001", "sub": "flycam", "tags": "flycam,hà nội,sương bụi,thành phố", "quality": "A", "segments": "01;02"},
        "clip_01_city_haze.mp4": {"id": "V001_alt", "sub": "flycam", "tags": "flycam,hà nội,sương bụi", "quality": "A", "segments": "01"},
        "clip_hcm_01_construction_overview.mp4": {"id": "V002", "sub": "construction", "tags": "công trường,tphcm,cần cẩu,máy xúc", "quality": "A", "segments": "01;02"},
        "clip_hue_01_giant_dust_clouds.mp4": {"id": "V003", "sub": "dust", "tags": "đám mây bụi,huế,17ha,xe ben,bụi cuốn", "quality": "A", "segments": "01;02"},
        "clip_hcm_02_uncovered_truck_road_dust.mp4": {"id": "V004", "sub": "dust", "tags": "xe tải,bụi đường,tphcm,không phủ bạt", "quality": "A", "segments": "02;03"},
        "clip_hn_02_citizen_elderly_concern.mp4": {"id": "V005", "sub": "people", "tags": "người dân,hà nội,người già,lo lắng", "quality": "A", "segments": "02;03"},
        "clip_hue_03_children_respiratory_concern.mp4": {"id": "V006", "sub": "people", "tags": "trẻ em,hô hấp,huế,nhà dân bụi", "quality": "A", "segments": "03;04"},
        "clip_hcm_03_resident_frustration.mp4": {"id": "V007", "sub": "people", "tags": "bức xúc,đóng cửa nhà,lau dọn bụi", "quality": "A", "segments": "02;03"},
        "clip_hue_04_ineffective_manual_watering.mp4": {"id": "V008", "sub": "construction", "tags": "tưới nước thủ công,bất lực,bụi mù", "quality": "A", "segments": "06"},
        "clip_hcm_04_barrier_water_spraying_audit.mp4": {"id": "V009", "sub": "construction", "tags": "kiểm tra rào chắn,phun sương,thực địa", "quality": "A", "segments": "07"},
        "clip_hn_04_youth_action.mp4": {"id": "V010", "sub": "people", "tags": "thanh niên,hành động,khẩu trang,môi trường", "quality": "A", "segments": "08;10"},
        "clip_hn2_04_green_transport_electric_bus.mp4": {"id": "V011", "sub": "vietnam", "tags": "xe buýt điện,giao thông xanh,hà nội", "quality": "B", "segments": "08;11"},
        "clip_hn2_01_emission_sources_graphic.mp4": {"id": "V012", "sub": "project_demo", "tags": "nguồn phát thải,đồ họa,phân tích", "quality": "B", "segments": "02;11"},
        "clip_hn2_02_directive19_halt_construction.mp4": {"id": "V013", "sub": "vietnam", "tags": "chỉ thị 19,thanh tra,đình chỉ công trình", "quality": "B", "segments": "06;07"},
        "clip_hn2_03_mist_cannon_truck_and_ai_camera.mp4": {"id": "V014", "sub": "construction", "tags": "vòi rồng phun sương,ai camera,giám sát", "quality": "B", "segments": "07"},
        "clip_hue_02_dust_on_trees_and_houses.mp4": {"id": "V015", "sub": "dust", "tags": "bụi bám cây cối,nhà cửa,huế", "quality": "A", "segments": "03"}
    }
    
    if extracted_clips_dir.exists():
        for f in extracted_clips_dir.glob("*.mp4"):
            fname = f.name
            meta = clip_metadata.get(fname, {
                "id": f"V_{fname[:6]}", "sub": "vietnam", "tags": "clip trích xuất", "quality": "B", "segments": "01"
            })
            duration = get_media_duration(f)
            
            # Copy vào thư mục 02_sources/real_video/{sub}
            target_sub = sources_dir / "real_video" / meta["sub"]
            target_sub.mkdir(parents=True, exist_ok=True)
            shutil.copy2(f, target_sub / fname)
            
            rel_path = f"02_sources/real_video/{meta['sub']}/{fname}"
            records.append({
                "id": meta["id"],
                "type": "video",
                "file": rel_path,
                "duration": duration,
                "tags": meta["tags"],
                "quality": meta["quality"],
                "segment_priority": meta["segments"]
            })
            
    # 2. Quét các ảnh đồ họa AI / UI Screenshots
    img_metadata = {
        "ChatGPT Image 09_56_46 31 thg 8, 2026 (1).png": {"id": "I001", "sub": "project", "tags": "tình nguyện viên,khảo sát hiện trường,bản đồ", "segments": "08;10"},
        "ChatGPT Image 09_56_47 31 thg 8, 2026 (2).png": {"id": "I002", "sub": "project", "tags": "phân tích dữ liệu,dashboard,thanh niên", "segments": "04;09"},
        "ChatGPT Image 09_56_48 31 thg 8, 2026 (3).png": {"id": "I003", "sub": "environment", "tags": "môi trường đô thị,giám sát bụi", "segments": "01;05"},
        "ChatGPT Image 09_56_49 31 thg 8, 2026 (4).png": {"id": "I004", "sub": "project", "tags": "quy trình hồ sơ,bằng chứng số", "segments": "05;07"},
        "ChatGPT Image 09_56_50 31 thg 8, 2026 (5).png": {"id": "I005", "sub": "environment", "tags": "bảo vệ sức khỏe cộng đồng,trẻ em", "segments": "03;10"},
        "ChatGPT Image 09_56_50 31 thg 8, 2026 (6).png": {"id": "I006", "sub": "construction", "tags": "công trường xây dựng,biện pháp che chắn", "segments": "06;07"},
        "ChatGPT Image 09_56_50 31 thg 8, 2026 (7).png": {"id": "I007", "sub": "vietnam", "tags": "thành phố xanh,hành động tương lai", "segments": "11;12"},
        "ChatGPT Image 09_56_51 31 thg 8, 2026 (8).png": {"id": "I008", "sub": "project", "tags": "mô hình pilot,trường học,clb", "segments": "08;09"},
        "ChatGPT Image 09_56_51 31 thg 8, 2026 (9).png": {"id": "I009", "sub": "environment", "tags": "đa bài toán môi trường,nước thải,khói", "segments": "11"},
        "ChatGPT Image 09_56_51 31 thg 8, 2026 (10).png": {"id": "I010", "sub": "project", "tags": "logo dustguard,kết thúc,tầm nhìn", "segments": "04;12"}
    }
    
    if media_dir.exists():
        for f in media_dir.glob("*.png"):
            fname = f.name
            meta = img_metadata.get(fname, {
                "id": f"I_{fname[:4]}", "sub": "project", "tags": "ảnh minh họa", "segments": "01"
            })
            target_sub = sources_dir / "real_images" / meta["sub"]
            target_sub.mkdir(parents=True, exist_ok=True)
            shutil.copy2(f, target_sub / fname)
            
            rel_path = f"02_sources/real_images/{meta['sub']}/{fname}"
            records.append({
                "id": meta["id"],
                "type": "image",
                "file": rel_path,
                "duration": "",
                "tags": meta["tags"],
                "quality": "A",
                "segment_priority": meta["segments"]
            })
            
    # Ghi ra file SOURCE_INDEX.csv
    with open(csv_file, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "type", "file", "duration", "tags", "quality", "segment_priority"])
        writer.writeheader()
        for r in records:
            writer.writerow(r)
            
    print(f"[OK] Đã đánh chỉ mục {len(records)} tài nguyên vào: {csv_file.relative_to(BASE_DIR)}")

if __name__ == "__main__":
    main()
