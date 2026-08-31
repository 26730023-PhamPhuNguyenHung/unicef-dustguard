"""
DustGuard VN - Clip Extractor
Tự động cắt các phân cảnh vàng từ video thực địa ô nhiễm không khí
"""

import subprocess
import sys
from pathlib import Path

# Đảm bảo UTF-8 cho console Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

CLIPS = [
    # Nguồn 1: Hà Nội
    {
        "name": "clip_hn_01_city_haze.mp4",
        "src": "hanoi_air_pollution_footage.mp4",
        "desc": "Thành phố chìm trong sương mù và bụi mịn (Toàn cảnh)",
        "start": "00:00:00",
        "duration": "00:00:18"
    },
    {
        "name": "clip_hn_02_citizen_elderly_concern.mp4",
        "src": "hanoi_air_pollution_footage.mp4",
        "desc": "Người cao tuổi phản ánh về sức khỏe và sự ngột ngạt",
        "start": "00:00:40",
        "duration": "00:00:20"
    },
    {
        "name": "clip_hn_03_traffic_dust_congestion.mp4",
        "src": "hanoi_air_pollution_footage.mp4",
        "desc": "Đường phố đông đúc xe cộ khói bụi tầm nhìn kém",
        "start": "00:01:05",
        "duration": "00:00:25"
    },
    {
        "name": "clip_hn_04_youth_action.mp4",
        "src": "hanoi_air_pollution_footage.mp4",
        "desc": "Thế hệ trẻ chủ động bảo vệ và hành động vì môi trường",
        "start": "00:02:57",
        "duration": "00:00:14"
    },
    # Nguồn 2: TP.HCM - Bụi Công Trình (Core Problem)
    {
        "name": "clip_hcm_01_construction_overview.mp4",
        "src": "hcmc_construction_dust_footage.mp4",
        "desc": "Cần cẩu, máy xúc, xe tải ra vào đại công trường TP.HCM",
        "start": "00:00:03",
        "duration": "00:00:20"
    },
    {
        "name": "clip_hcm_02_uncovered_truck_road_dust.mp4",
        "src": "hcmc_construction_dust_footage.mp4",
        "desc": "Xe tải không rửa bánh làm rơi vãi đất cát bụi mù mịt",
        "start": "00:00:30",
        "duration": "00:00:25"
    },
    {
        "name": "clip_hcm_03_resident_frustration.mp4",
        "src": "hcmc_construction_dust_footage.mp4",
        "desc": "Phỏng vấn người dân sát công trình đóng kín cửa vì bụi",
        "start": "00:01:20",
        "duration": "00:00:25"
    },
    {
        "name": "clip_hcm_04_barrier_water_spraying_audit.mp4",
        "src": "hcmc_construction_dust_footage.mp4",
        "desc": "Kiểm tra rào chắn, lưới che và vòi phun sương dập bụi",
        "start": "00:02:15",
        "duration": "00:00:25"
    },
    # Nguồn 3: TP. Huế - Đại công trường 17ha & Bụi ảnh hưởng trẻ em
    {
        "name": "clip_hue_01_giant_dust_clouds.mp4",
        "src": "hue_construction_dust_footage.mp4",
        "desc": "Đoàn xe ben tạo cột khói bụi khổng lồ bao trùm công trường",
        "start": "00:00:45",
        "duration": "00:00:25"
    },
    {
        "name": "clip_hue_02_dust_on_trees_and_houses.mp4",
        "src": "hue_construction_dust_footage.mp4",
        "desc": "Bụi bám trắng xóa trên cây cối và nhà cửa khu dân cư",
        "start": "00:01:28",
        "duration": "00:00:20"
    },
    {
        "name": "clip_hue_03_children_respiratory_concern.mp4",
        "src": "hue_construction_dust_footage.mp4",
        "desc": "Người dân phường Xuân Phú lo ngại bệnh hô hấp cho trẻ nhỏ",
        "start": "00:01:40",
        "duration": "00:00:20"
    },
    {
        "name": "clip_hue_04_ineffective_manual_watering.mp4",
        "src": "hue_construction_dust_footage.mp4",
        "desc": "Công nhân xịt nước thủ công bất lực trước bụi đất mênh mông",
        "start": "00:03:20",
        "duration": "00:00:15"
    },
    # Nguồn 4: Hà Nội - Xe phun sương, Camera AI & Biện pháp quản lý
    {
        "name": "clip_hn2_01_emission_sources_graphic.mp4",
        "src": "hanoi_causes_and_measures_footage.mp4",
        "desc": "Đồ họa phân tích đa nguồn phát thải và nghịch nhiệt",
        "start": "00:00:53",
        "duration": "00:00:20"
    },
    {
        "name": "clip_hn2_02_directive19_halt_construction.mp4",
        "src": "hanoi_causes_and_measures_footage.mp4",
        "desc": "Chỉ thị 19 và tạm dừng thi công đào đường đào vỉa hè",
        "start": "00:02:04",
        "duration": "00:00:22"
    },
    {
        "name": "clip_hn2_03_mist_cannon_truck_and_ai_camera.mp4",
        "src": "hanoi_causes_and_measures_footage.mp4",
        "desc": "Xe phun sương dập bụi cao áp và camera AI quét phạt nguội",
        "start": "00:02:29",
        "duration": "00:00:20"
    },
    {
        "name": "clip_hn2_04_green_transport_electric_bus.mp4",
        "src": "hanoi_causes_and_measures_footage.mp4",
        "desc": "Giao thông xanh, xe buýt điện và vùng phát thải thấp",
        "start": "00:02:50",
        "duration": "00:00:22"
    }
]

def extract_all():
    media_dir = Path(__file__).parent / "media"
    out_dir = Path(__file__).parent / "output" / "extracted_clips"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"[*] Bắt đầu trích xuất clip...")
    for clip in CLIPS:
        src_video = media_dir / clip.get("src", "hanoi_air_pollution_footage.mp4")
        if not src_video.exists():
            print(f"[!] Không tìm thấy file: {src_video.name}")
            continue
            
        out_file = out_dir / clip["name"]
        print(f" -> Trích xuất: {clip['name']} ({clip['desc']})...")
        cmd = [
            "ffmpeg", "-y",
            "-ss", clip["start"],
            "-i", str(src_video),
            "-t", clip["duration"],
            "-c:v", "libx264", "-crf", "18", "-preset", "fast",
            "-c:a", "aac", "-b:a", "192k",
            str(out_file)
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f"    [OK] Đã lưu: {out_file.name}")
        
    print(f"\n[DONE] Toàn bộ clip đã sẵn sàng tại: {out_dir}")


if __name__ == "__main__":
    extract_all()
