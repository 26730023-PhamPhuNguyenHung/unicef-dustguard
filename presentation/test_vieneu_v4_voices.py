"""
DustGuard VN - VieNeu v4 Cloud TTS Voice Tester & Full Proposal Generator
Hỗ trợ kiểm thử và xuất audio cho toàn bộ 337 giọng nam VieNeu v4
"""

import os
import sys
import json
import argparse
import subprocess
from pathlib import Path
import urllib.request
import urllib.error

# Đảm bảo UTF-8 cho console Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

SAMPLE_TEXT = "Ở một thành phố đang phát triển, những công trường mới đồng nghĩa với những cơ hội mới. Nhưng cùng với sự phát triển đó là bụi công trình. DustGuard — biến dữ liệu thành hành động quản lý có ưu tiên, có bằng chứng và có theo dõi."

SECTIONS = [
    {
        "id": "01_mo_van_de",
        "time": "0:00 - 0:18",
        "text": "Ở một thành phố đang phát triển, những công trường mới đồng nghĩa với những con đường mới, những ngôi nhà mới và những cơ hội mới. Nhưng cùng với sự phát triển đó, có một tác động rất dễ bị xem là nhỏ... cho đến khi nó trở thành vấn đề của cả một cộng đồng. Đó là bụi công trình."
    },
    {
        "id": "02_nut_that",
        "time": "0:18 - 0:38",
        "text": "Điều chúng tôi nhận ra là: vấn đề không phải chúng ta hoàn toàn không có dữ liệu. Người dân có phản ánh. Có hình ảnh. Có vị trí. Có thông tin công trình. Có hồ sơ kiểm tra. Và trong tương lai còn có thể có dữ liệu từ cảm biến. Nhưng những thông tin đó thường nằm ở nhiều nơi khác nhau. Và khi dữ liệu bị phân tán, điều khó nhất là biến nó thành một hành động có thứ tự ưu tiên."
    },
    {
        "id": "03_cau_hoi_trung_tam",
        "time": "0:38 - 0:55",
        "text": "Nếu cùng lúc có mười phản ánh, chúng ta nên nhìn vào trường hợp nào trước? Vì sao trường hợp đó đáng chú ý? Hồ sơ còn thiếu gì? Ai đang phụ trách? Và sau khi một phản ánh được gửi đi... nó đã thực sự đi đến đâu?"
    },
    {
        "id": "04_dustguard_xuat_hien",
        "time": "0:55 - 1:10",
        "text": "DustGuard được xây dựng để trả lời những câu hỏi đó. Không phải bằng cách thay thế người ra quyết định. Mà bằng cách kết nối tín hiệu, bằng chứng, mức độ ưu tiên và quá trình xử lý thành một hồ sơ có thể theo dõi."
    },
    {
        "id": "05_tinh_moi",
        "time": "1:10 - 1:30",
        "text": "Điểm mới của DustGuard không nằm ở việc tạo thêm một nơi để gửi phản ánh. Điều chúng tôi muốn giải quyết là khoảng trống sau khi phản ánh đã được gửi. Một tín hiệu ban đầu phải có cơ hội trở thành một hồ sơ. Một hồ sơ phải có bằng chứng. Một trường hợp phải có mức độ ưu tiên. Và quan trọng nhất: phải có thể biết nó đang được xử lý tới đâu."
    },
    {
        "id": "06_bai_hoc_tap_huan",
        "time": "1:30 - 1:49",
        "text": "Nhưng DustGuard hôm nay không còn giống phiên bản ban đầu. Sau vòng tập huấn, chúng tôi nhận ra rằng một hệ thống thông minh không nên cố gắng đưa ra nhiều quyết định hơn con người. Nó phải giúp con người có đủ thông tin để đưa ra quyết định tốt hơn. Vì vậy, chúng tôi thay đổi cách nhìn về AI, về điểm rủi ro và cả vai trò của IoT."
    },
    {
        "id": "07_ai_dung_vai_tro",
        "time": "1:49 - 2:08",
        "text": "Dust Risk Score không trả lời rằng một công trình có vi phạm hay không. Nó chỉ hỗ trợ một câu hỏi thực tế hơn: trong nhiều trường hợp đang tồn tại, trường hợp nào nên được xem xét trước, và vì sao? AI có thể phân loại, tóm tắt, tìm thông tin còn thiếu và hỗ trợ checklist. Nhưng AI không tự kết luận vi phạm. Không tự quyết định xử phạt. Và không thay thế cơ quan có thẩm quyền."
    },
    {
        "id": "08_vi_sao_kha_thi",
        "time": "2:08 - 2:28",
        "text": "Chúng tôi cũng học được rằng một giải pháp môi trường không nên bắt đầu bằng một hạ tầng thật lớn. DustGuard có thể bắt đầu chỉ với dữ liệu đang có: phản ánh, hình ảnh, vị trí, checklist và hồ sơ. Một pilot có thể triển khai trong một cộng đồng nhỏ, một trường học hoặc một câu lạc bộ môi trường. Trong bốn đến tám tuần. Với hai mươi đến ba mươi người dùng thật. Và những chỉ số có thể đo được."
    },
    {
        "id": "09_do_gia_tri_that",
        "time": "2:28 - 2:45",
        "text": "Bao nhiêu trường hợp có đủ bằng chứng? Thời gian từ phát hiện đến hành động là bao lâu? Bao nhiêu trường hợp thực sự có bước xử lý tiếp theo? Bao nhiêu vụ việc có thể được theo dõi từ lúc xuất hiện tín hiệu đến khi có kết quả? Đó mới là những con số chúng tôi muốn dùng để chứng minh DustGuard có giá trị."
    },
    {
        "id": "10_vai_tro_cong_dong",
        "time": "2:45 - 3:00",
        "text": "Và DustGuard không chỉ dành cho cơ quan quản lý. Chúng tôi muốn bắt đầu từ những cộng đồng đã có động lực hành động: trường học, câu lạc bộ môi trường, tổ chức thanh niên và những người trẻ. Để họ không chỉ nhìn thấy một vấn đề. Mà biết cách ghi nhận nó tốt hơn, theo dõi nó lâu hơn và giúp nó không bị bỏ quên."
    },
    {
        "id": "11_tam_nhin_mo_rong",
        "time": "3:00 - 3:17",
        "text": "Nếu cách tiếp cận này được kiểm chứng với bụi công trình, chúng tôi tin rằng cùng một lõi có thể tiếp tục được phát triển cho những vấn đề môi trường khác. Nước thải. Đốt rơm rạ. Thuốc bảo vệ thực vật. Tiếng ồn. Nhưng mỗi bước mở rộng đều phải bắt đầu lại bằng việc hiểu đúng người dùng, đúng dữ liệu và đúng quy trình thực tế."
    },
    {
        "id": "12_ket_manh",
        "time": "3:17 - 3:30",
        "text": "DustGuard không đặt mục tiêu trở thành một hệ thống quyết định thay con người. Chúng tôi muốn nó trở thành một công cụ giúp một vấn đề được nhìn thấy rõ hơn. Được ghi nhận đầy đủ hơn. Được theo dõi lâu hơn. Và có nhiều cơ hội hơn để đi từ một tín hiệu... đến một hành động thực sự. DustGuard — biến dữ liệu thành hành động quản lý có ưu tiên, có bằng chứng và có theo dõi."
    }
]

def load_male_voices():
    json_path = Path(__file__).parent / "vieneu_v4_male_voices.json"
    if not json_path.exists():
        from fetch_vieneu_v4_voices import fetch_and_save_v4_voices
        return fetch_and_save_v4_voices()
    with open(json_path, encoding="utf-8") as f:
        data = json.load(f)
    return data.get("male_voices", [])

def synthesize_text_vieneu(text, voice_name, api_key, out_path, engine="v4"):
    url = "https://api.vieneu.io/api/v1/audio/speech"
    
    payload = {
        "input": text,
        "voice": voice_name,
        "engine": engine,
        "response_format": "mp3"
    }
    
    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=req_data,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Mozilla/5.0"
        }
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            audio_bytes = response.read()
            with open(out_path, "wb") as f:
                f.write(audio_bytes)
            return True
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8", errors="ignore")
        print(f"[!] HTTP Error {e.code} ({voice_name}): {err_msg}")
        return False
    except Exception as e:
        print(f"[!] Lỗi kết nối ({voice_name}): {e}")
        return False

def test_top_voices(api_key, top_n=10):
    males = load_male_voices()
    out_dir = Path(__file__).parent / "output" / "vieneu_v4_samples"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    print("=" * 70)
    print(f"ĐANG SINH SAMPLE AUDIO CHO TOP {top_n} GIỌNG NAM VIENEU V4")
    print("=" * 70)
    
    for i, v in enumerate(males[:top_n], 1):
        v_name = v.get("name", "")
        v_id = v.get("id", v_name)
        accent = v.get("accent", "")
        safe_name = "".join(c for c in v_name if c.isalnum() or c in ("-", "_")).rstrip()
        out_file = out_dir / f"sample_{i:02d}_{safe_name}.mp3"
        
        print(f"[*] [{i}/{top_n}] Đang thử giọng: {v_name} ({accent})...")
        ok = synthesize_text_vieneu(SAMPLE_TEXT, v_id, api_key, str(out_file))
        if ok:
            print(f"    [OK] -> {out_file.name}")
        else:
            print(f"    [FAIL] Bỏ qua {v_name}")
            
    print("\n" + "=" * 70)
    print(f"[HOÀN TẤT] File nghe thử đã lưu tại: {out_dir}")
    print("=" * 70)

def generate_full_proposal_vieneu(voice_name, api_key):
    safe_name = "".join(c for c in voice_name if c.isalnum() or c in ("-", "_")).rstrip()
    out_dir = Path(__file__).parent / "output" / f"vieneu_{safe_name}"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"[*] Bắt đầu sinh full 12 phân đoạn proposal cho giọng VieNeu v4: {voice_name}")
    
    file_list = []
    for sec in SECTIONS:
        sec_file = out_dir / f"{sec['id']}.mp3"
        print(f" -> Đang tạo: {sec['id']} ({sec['time']})...")
        ok = synthesize_text_vieneu(sec["text"], voice_name, api_key, str(sec_file))
        if ok:
            file_list.append(sec_file)
            
    # Nối thành 1 full audio 3m30s
    concat_list_file = out_dir / "concat_list.txt"
    with open(concat_list_file, "w", encoding="utf-8") as f:
        for p in file_list:
            f.write(f"file '{p.name}'\n")
            
    merged_output = out_dir / f"full_voiceover_vieneu_{safe_name}.mp3"
    print(f"[*] Đang nối các file thành: {merged_output.name}...")
    cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_list_file),
        "-c", "copy", str(merged_output)
    ]
    subprocess.run(cmd, cwd=str(out_dir), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"[OK] Đã hoàn thành full voiceover tại: {merged_output}")

def test_inspiring_north(api_key):
    top_inspiring = [
        {"name": "Hoàng Nam", "style": "Giọng nam rõ ràng, trẻ trung, tự tin"},
        {"name": "Hoàng Long", "style": "Giọng nam trẻ, khỏe khoắn, truyền lửa"},
        {"name": "Nhật Phong", "style": "Giọng nam trẻ trìu mến, gần gũi cộng đồng"},
        {"name": "Minh Thắng", "style": "Nam Bắc Kể chuyện, tự nhiên, cuốn hút"},
        {"name": "Tuấn Kiệt", "style": "Giọng nam rắn rỏi, dứt khoát"},
        {"name": "Đăng Khoa", "style": "Giọng nam rõ ràng, sáng tiếng"},
        {"name": "Quân Sáng", "style": "Nam Bắc Sáng rõ, kể chuyện mạch lạc"},
        {"name": "Trí Sáng", "style": "Nam Bắc Kể chuyện, truyền cảm hứng"},
        {"name": "Minh Công", "style": "Nam Bắc Tin tức thời sự VTV sắc nét"},
        {"name": "Phạm Tuyên", "style": "Nam Bắc Tự nhiên, thuyết phục"}
    ]
    
    out_dir = Path(__file__).parent / "output" / "vieneu_v4_inspiring_samples"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    print("=" * 75)
    print("ĐANG SINH SAMPLE CHO TOP 10 GIỌNG NAM BẮC CAO, SÁNG & TRUYỀN CẢM HỨNG")
    print("=" * 75)
    
    for i, v in enumerate(top_inspiring, 1):
        v_name = v["name"]
        safe_name = "".join(c for c in v_name if c.isalnum() or c in ("-", "_")).rstrip()
        out_file = out_dir / f"sample_{i:02d}_{safe_name}.mp3"
        
        print(f"[*] [{i}/10] Đang tạo giọng: {v_name:<15} ({v['style']})...")
        ok = synthesize_text_vieneu(SAMPLE_TEXT, v_name, api_key, str(out_file))
        if ok:
            print(f"    [OK] -> {out_file.name}")
        else:
            print(f"    [FAIL] Bỏ qua {v_name}")
            
    print("\n" + "=" * 75)
    print(f"[HOÀN TẤT] 10 mẫu giọng nam Bắc truyền cảm hứng đã lưu tại: {out_dir}")
    print("=" * 75)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="VieNeu v4 Voice Tester & Full Proposal Generator")
    parser.add_argument("--key", type=str, default=os.getenv("VIENEU_API_KEY", ""), help="VieNeu API Key (vn_sk_... hoặc vn_test_...)")
    parser.add_argument("--list", action="store_true", help="Hiển thị danh sách giọng nam theo vùng miền")
    parser.add_argument("--test-inspiring", action="store_true", help="Sinh sample cho Top 10 giọng Nam Bắc cao, sáng, truyền cảm hứng")
    parser.add_argument("--test-top", type=int, default=0, help="Sinh sample cho top N giọng nam")
    parser.add_argument("--voice", type=str, default="", help="Tên hoặc ID giọng (VD: 'Hoàng Nam', 'Hoàng Long'...)")
    parser.add_argument("--full", action="store_true", help="Sinh trọn bộ 12 phân đoạn proposal 3m30s")
    
    args = parser.parse_args()
    
    if args.list:
        males = load_male_voices()
        print(f"=== TỔNG CỘNG {len(males)} GIỌNG NAM VIENEU V4 ===")
        for i, v in enumerate(males, 1):
            print(f"{i:3d}. {v.get('name')} | ID: {v.get('id')} | Vùng: {v.get('region')} | Mô tả: {v.get('description')}")
        sys.exit(0)
        
    api_key = args.key.strip()
    if not api_key:
        print("\n[!] CẦN CUNG CẤP VIENEU API KEY!")
        print("Đăng ký lấy key tại: https://www.vieneu.io (miễn phí 10.000 tokens/ngày).")
        print("Cách chạy:")
        print("  1. Test Top 10 giọng Nam Bắc cao & truyền cảm hứng: python presentation/test_vieneu_v4_voices.py --key vn_sk_... --test-inspiring")
        print("  2. Render trọn bộ kịch bản 3m30s: python presentation/test_vieneu_v4_voices.py --key vn_sk_... --voice 'Hoàng Nam' --full")
        sys.exit(1)
        
    if args.test_inspiring:
        test_inspiring_north(api_key)
    elif args.test_top > 0:
        test_top_voices(api_key, top_n=args.test_top)
    elif args.voice:
        if args.full:
            generate_full_proposal_vieneu(args.voice, api_key)
        else:
            safe_name = "".join(c for c in args.voice if c.isalnum() or c in ("-", "_")).rstrip()
            out_sample = Path(__file__).parent / "output" / f"sample_vieneu_{safe_name}.mp3"
            print(f"[*] Đang sinh mẫu thử cho: {args.voice}")
            synthesize_text_vieneu(SAMPLE_TEXT, args.voice, api_key, str(out_sample))
            print(f"[OK] Đã lưu mẫu tại: {out_sample}")
    else:
        test_inspiring_north(api_key)

