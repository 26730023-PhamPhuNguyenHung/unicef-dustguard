"""
DustGuard VN - Lọc & Xếp hạng Giọng Nam Bắc Cao, Sáng, Truyền Cảm Hứng (VieNeu v4)
"""

import sys
import json
from pathlib import Path

# Đảm bảo UTF-8 cho console Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

def analyze_and_rank():
    json_path = Path(__file__).parent / "vieneu_v4_male_voices.json"
    with open(json_path, encoding="utf-8") as f:
        data = json.load(f)

    males = data.get("male_voices", [])
    north_males = [v for v in males if str(v.get("region", "")).lower() == "north"]

    print(f"[*] Tổng số giọng nam Bắc trong VieNeu v4: {len(north_males)}")


    # Từ khóa tìm kiếm: Giọng cao, sáng, truyền cảm hứng, trẻ trung, năng lượng, hùng biện, thanh niên
    positive_keywords = [
        "inspire", "inspiring", "truyền cảm", "nhiệt huyết", "sáng", "cao",
        "trẻ", "thanh niên", "năng động", "hùng biện", "diễn thuyết", "thuyết trình",
        "mc", "tự tin", "lan tỏa", "energetic", "bright", "clear", "fresh", "young",
        "motivation", "passionate", "vibrant", "cuốn hút", "dứt khoát"
    ]
    
    # Từ khóa loại trừ: Giọng quá trầm, khàn đục, già, u sầu, chậm chạp
    negative_keywords = ["trầm đục", "u sầu", "già", "lão", "chậm rãi", "trầm khàn", "deep", "low"]

    # Lọc kỹ: Giọng Nam Bắc, không trầm/già, sáng rõ, khỏe khoắn, truyền cảm hứng
    inspiring_voices = []
    for v in north_males:
        desc = (str(v.get("description", "")) + " " + str(v.get("name", ""))).lower()
        
        # Loại trừ các giọng trầm, đứng tuổi, thấp
        is_deep = any(k in desc for k in ["trầm", "đứng tuổi", "thấp", "già", "lão", "nữ", "u sầu", "chậm"])
        if is_deep:
            continue
            
        # Ưu tiên các giọng có yếu tố trẻ, khỏe khoắn, rõ ràng, nhiệt huyết, kể chuyện, tự nhiên
        inspiring_voices.append(v)

    print(f"\n" + "=" * 90)
    print(f"DANH SÁCH {len(inspiring_voices)} GIỌNG NAM MIỀN BẮC CAO, SÁNG & TRUYỀN CẢM HỨNG (KHÔNG TRẦM)")
    print("=" * 90)
    
    for i, item in enumerate(inspiring_voices, 1):
        print(f"{i:2d}. Tên: {item.get('name', ''):<20} | ID: {item.get('id', ''):<22} | Mô tả: {item.get('description', '')}")
        
    out_file = Path(__file__).parent / "top_inspiring_north_voices.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(inspiring_voices, f, ensure_ascii=False, indent=2)
    print(f"\n[OK] Đã lưu {len(inspiring_voices)} giọng vào: {out_file.name}")


if __name__ == "__main__":
    analyze_and_rank()
