"""
DustGuard VN - VieNeu v4 Voice Catalogue Extractor & TTS Generator
Lấy toàn bộ danh sách giọng nam VieNeu v4 và hỗ trợ kiểm thử/tạo audio proposal
"""

import sys
import json
import urllib.request
from pathlib import Path

# Đảm bảo UTF-8 cho console Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

def fetch_and_save_v4_voices():
    url = "https://api.vieneu.io/api/v1/voices?engine=v4"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    
    print("[*] Đang kết nối API VieNeu v4 (https://api.vieneu.io/api/v1/voices?engine=v4)...")
    with urllib.request.urlopen(req, timeout=15) as res:
        data = json.loads(res.read().decode("utf-8"))
        
    voices = data.get("voices", []) if isinstance(data, dict) else data
    total_count = len(voices)
    print(f"[OK] Đã tải về thành công {total_count} giọng VieNeu v4!")
    
    # Lọc các giọng nam
    male_voices = []
    female_voices = []
    
    for v in voices:
        gender = str(v.get("gender", "")).lower()
        tags = [str(t).lower() for t in v.get("tags", [])]
        name = v.get("name", "")
        
        is_male = (
            gender == "male" or
            "male" in tags or
            "nam" in tags or
            "nam" in gender
        )
        
        if is_male:
            male_voices.append(v)
        else:
            female_voices.append(v)
            
    print(f" -> Tổng số Giọng Nam (Male Voices): {len(male_voices)}")
    print(f" -> Tổng số Giọng Nữ (Female Voices): {len(female_voices)}")
    
    # Lưu toàn bộ vào file JSON
    out_dir = Path(__file__).parent
    json_path = out_dir / "vieneu_v4_male_voices.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({
            "total_voices": total_count,
            "male_count": len(male_voices),
            "female_count": len(female_voices),
            "male_voices": male_voices
        }, f, ensure_ascii=False, indent=2)
        
    print(f"[OK] Đã lưu toàn bộ danh sách giọng nam vào: {json_path.name}")
    
    # Phân loại theo vùng miền & phong cách
    regions = {}
    for v in male_voices:
        accent = v.get("accent", v.get("region", "Khác")) or "Khác"
        if accent not in regions:
            regions[accent] = []
        regions[accent].append(v)
        
    print("\n--- PHÂN BỔ GIỌNG NAM VIENEU V4 THEO VÙNG MIỀN ---")
    for reg, items in regions.items():
        print(f" • {reg}: {len(items)} giọng")
        
    return male_voices

if __name__ == "__main__":
    fetch_and_save_v4_voices()
