"""
DustGuard VN - Google Cloud Chirp 3 HD TTS Voice Tester & Full Generator
Hỗ trợ kiểm thử và xuất audio cho toàn bộ 15 giọng nam vi-VN-Chirp3-HD
"""

import os
import sys
import json
import base64
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

# Danh sách toàn bộ 15 giọng nam Google Cloud Chirp 3 HD
GOOGLE_CHIRP_MALE_VOICES = [
    {"name": "vi-VN-Chirp3-HD-Charon", "style": "Trầm ấm, uy lực, rất hợp phóng sự điều tra/tài liệu môi trường"},
    {"name": "vi-VN-Chirp3-HD-Fenrir", "style": "Khàn nhẹ, dứt khoát, phong cách chính luận hiện đại"},
    {"name": "vi-VN-Chirp3-HD-Orus", "style": "Ấm áp, tròn vành rõ chữ, chuẩn MC sự kiện/thuyết trình"},
    {"name": "vi-VN-Chirp3-HD-Puck", "style": "Trẻ trung, tự nhiên, nhịp nhanh, phong cách Tech Startup"},
    {"name": "vi-VN-Chirp3-HD-Iapetus", "style": "Đĩnh đạc, học thuật, phong thái chuyên gia môi trường"},
    {"name": "vi-VN-Chirp3-HD-Algenib", "style": "Sâu lắng, tự sự, giàu cảm xúc"},
    {"name": "vi-VN-Chirp3-HD-Algieba", "style": "Rõ ràng, dứt khoát, năng động"},
    {"name": "vi-VN-Chirp3-HD-Alnilam", "style": "Trầm đục, mạnh mẽ, tạo sự nghiêm trọng"},
    {"name": "vi-VN-Chirp3-HD-Rasalgethi", "style": "Trung tính, khoa học, khách quan"},
    {"name": "vi-VN-Chirp3-HD-Sadachbia", "style": "Ấm áp, truyền cảm, gần gũi cộng đồng"},
    {"name": "vi-VN-Chirp3-HD-Sadaltager", "style": "Nhanh nhẹn, hiện đại, dứt khoát"},
    {"name": "vi-VN-Chirp3-HD-Schedar", "style": "Vang, đĩnh đạc, phù hợp kết luận cao trào"},
    {"name": "vi-VN-Chirp3-HD-Umbriel", "style": "Trầm thấp, suy ngẫm, mở vấn đề sâu sắc"},
    {"name": "vi-VN-Chirp3-HD-Zubenelgenubi", "style": "Cân bằng, dễ nghe, mạch lạc"},
    {"name": "vi-VN-Chirp3-HD-Achird", "style": "Sáng, trẻ trung, nhịp điệu hành động thanh niên"}
]

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

def synthesize_text_google(text, voice_name, api_key, out_path, rate=1.0, pitch=0.0):
    url = f"https://texttospeech.googleapis.com/v1beta1/text:synthesize?key={api_key}"
    
    payload = {
        "input": {"text": text},
        "voice": {
            "languageCode": "vi-VN",
            "name": voice_name
        },
        "audioConfig": {
            "audioEncoding": "MP3",
            "speakingRate": rate,
            "pitch": pitch
        }
    }
    
    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=req_data,
        headers={"Content-Type": "application/json; charset=utf-8"}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            res_json = json.loads(response.read().decode("utf-8"))
            audio_content = res_json.get("audioContent")
            if audio_content:
                with open(out_path, "wb") as f:
                    f.write(base64.b64decode(audio_content))
                return True
            else:
                print(f"[!] Không nhận được audioContent từ API cho voice {voice_name}")
                return False
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8")
        print(f"[!] HTTP Error {e.code} ({voice_name}): {err_msg}")
        return False
    except Exception as e:
        print(f"[!] Lỗi kết nối ({voice_name}): {e}")
        return False

def test_samples(api_key):
    out_dir = Path(__file__).parent / "output" / "google_chirp_samples"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    print("=" * 70)
    print("ĐANG SINH SAMPLE AUDIO CHO TOÀN BỘ 15 GIỌNG NAM GOOGLE CHIRP 3 HD")
    print("=" * 70)
    
    results = []
    for item in GOOGLE_CHIRP_MALE_VOICES:
        v_name = item["name"]
        short_id = v_name.replace("vi-VN-Chirp3-HD-", "").lower()
        out_file = out_dir / f"sample_{short_id}.mp3"
        
        print(f"[*] Đang sinh mẫu: {v_name} | {item['style']}...")
        ok = synthesize_text_google(SAMPLE_TEXT, v_name, api_key, str(out_file))
        if ok:
            print(f"    [OK] -> {out_file.name}")
            results.append((v_name, item['style'], str(out_file)))
        else:
            print(f"    [FAIL] Bỏ qua {v_name}")
            
    print("\n" + "=" * 70)
    print(f"[HOÀN TẤT] Toàn bộ mẫu thử đã lưu tại: {out_dir}")
    print("=" * 70)

def generate_full_proposal(voice_name, api_key, rate=1.0):
    short_id = voice_name.replace("vi-VN-Chirp3-HD-", "").lower()
    out_dir = Path(__file__).parent / "output" / f"google_{short_id}"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"[*] Bắt đầu sinh full 12 phân đoạn cho giọng: {voice_name}")
    
    file_list = []
    for sec in SECTIONS:
        sec_file = out_dir / f"{sec['id']}.mp3"
        print(f" -> Đang tạo: {sec['id']} ({sec['time']})...")
        ok = synthesize_text_google(sec["text"], voice_name, api_key, str(sec_file), rate=rate)
        if ok:
            file_list.append(sec_file)
            
    # Nối toàn bộ file thành 1 full audio 3m30s
    concat_list_file = out_dir / "concat_list.txt"
    with open(concat_list_file, "w", encoding="utf-8") as f:
        for p in file_list:
            f.write(f"file '{p.name}'\n")
            
    merged_output = out_dir / f"full_voiceover_google_{short_id}.mp3"
    print(f"[*] Đang nối các file thành: {merged_output.name}...")
    cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_list_file),
        "-c", "copy", str(merged_output)
    ]
    subprocess.run(cmd, cwd=str(out_dir), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"[OK] Đã hoàn thành full voiceover tại: {merged_output}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Google Chirp 3 HD Voice Tester & Generator")
    parser.add_argument("--key", type=str, default=os.getenv("GOOGLE_API_KEY", os.getenv("GEMINI_API_KEY", "")), help="Google Cloud API Key")
    parser.add_argument("--test-all", action="store_true", help="Sinh file sample mẫu cho toàn bộ 15 giọng")
    parser.add_argument("--voice", type=str, default="", help="Tên giọng (VD: vi-VN-Chirp3-HD-Charon)")
    parser.add_argument("--full", action="store_true", help="Sinh trọn bộ 12 phân đoạn proposal 3m30s")
    parser.add_argument("--rate", type=float, default=0.98, help="Tốc độ đọc (mặc định 0.98)")
    
    args = parser.parse_args()
    
    api_key = args.key.strip()
    if not api_key:
        print("\n[!] CHƯA CÓ GOOGLE API KEY!")
        print("Cách chạy:")
        print("  1. python presentation/test_google_chirp_voices.py --key AIzaSy... --test-all")
        print("  2. python presentation/test_google_chirp_voices.py --key AIzaSy... --voice vi-VN-Chirp3-HD-Charon --full")
        sys.exit(1)
        
    if args.test_all:
        test_samples(api_key)
    elif args.voice:
        target_v = args.voice
        if not target_v.startswith("vi-VN-Chirp3-HD-"):
            target_v = f"vi-VN-Chirp3-HD-{target_v.capitalize()}"
            
        if args.full:
            generate_full_proposal(target_v, api_key, rate=args.rate)
        else:
            out_sample = Path(__file__).parent / "output" / f"sample_{target_v}.mp3"
            print(f"[*] Đang sinh mẫu thử cho: {target_v}")
            synthesize_text_google(SAMPLE_TEXT, target_v, api_key, str(out_sample), rate=args.rate)
            print(f"[OK] Đã lưu mẫu tại: {out_sample}")
    else:
        # Mặc định test all nếu có key
        test_samples(api_key)
