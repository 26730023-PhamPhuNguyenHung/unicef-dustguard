"""
DustGuard VN - Thử nghiệm 5 giọng VieNeu-TTS Offline (Nam & Nữ, Đủ 3 miền)
Sinh file audio mẫu đọc lời dẫn DustGuard VN.
"""

import sys
import os
from pathlib import Path
import soundfile as sf
import vieneu

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

SAMPLE_TEXT = (
    "Ở một thành phố đang phát triển, những công trường mới đồng nghĩa với những cơ hội mới. "
    "Nhưng có một tác động rất dễ bị xem là nhỏ: Bụi công trình. "
    "DustGuard — Biến dữ liệu thành hành động quản lý: Có ưu tiên, có bằng chứng và có theo dõi."
)

SAMPLE_VOICES = [
    {"id": "01_nu_bac_truc_ly", "name": "Trúc Ly", "desc": "Nữ · Bắc · Tự nhiên, truyền cảm, trong trẻo"},
    {"id": "02_nu_bac_doan_trang", "name": "Đoan Trang", "desc": "Nữ · Bắc · Tự nhiên, phong thái đĩnh đạc"},
    {"id": "03_nu_nam_thuy_dung", "name": "Thùy Dung", "desc": "Nữ · Nam · Mượt mà, phong cách tin tức hiện đại"},
    {"id": "04_nam_bac_pham_tuyen", "name": "Phạm Tuyên", "desc": "Nam · Bắc · Tự nhiên, trầm ấm, chuẩn thuyết trình"},
    {"id": "05_nam_bac_minh_duc", "name": "Minh Đức", "desc": "Nam · Bắc · Phong cách thời sự, nghiêm túc, uy tín"}
]

def main():
    out_dir = Path(__file__).parent / "output" / "vieneu_offline_samples"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    print("=" * 80)
    print("🎙️ KHỞI TẠO VIENEU-TTS OFFLINE (FREE & UNLIMITED LOCAL INFERENCE)")
    print("=" * 80)
    
    vn = vieneu.Vieneu()
    
    for v in SAMPLE_VOICES:
        v_id = v["id"]
        v_name = v["name"]
        v_desc = v["desc"]
        out_wav = out_dir / f"{v_id}.wav"
        
        print(f"\n[*] Đang sinh giọng: {v_name} ({v_desc})...")
        try:
            audio = vn.infer(
                text=SAMPLE_TEXT,
                voice=v_name
            )
            sf.write(str(out_wav), audio, vn.sample_rate)
            print(f"[OK] Đã xuất thành công: {out_wav.name}")
        except Exception as e:
            print(f"[LỖI] Không thể sinh giọng {v_name}: {e}")

    print("\n" + "=" * 80)
    print(f"[HOÀN TẤT] Tất cả 5 file mẫu đã được lưu vào: {out_dir}")
    print("=" * 80)

if __name__ == "__main__":
    main()
