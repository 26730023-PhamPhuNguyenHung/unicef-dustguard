"""
DustGuard VN - VieNeu-TTS Offline Voice-Over Generator (100% Local & Free)
Tự động sinh trọn bộ audio proposal 3 phút 30 giây chạy offline bằng VieNeu-TTS mã nguồn mở
"""

import sys
import argparse
import subprocess
from pathlib import Path
import soundfile as sf
import vieneu

# Đảm bảo UTF-8 cho console Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

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

# Các preset giọng nam offline có sẵn trong VieNeu
OFFLINE_MALE_PRESETS = [
    "Phạm Tuyên",   # Nam Bắc - Tự nhiên, truyền cảm, phong cách thời sự
    "Minh Đức",    # Nam Bắc - Đĩnh đạc
    "Thái Sơn",    # Nam Bắc - Rõ ràng
    "Xuân Vĩnh",   # Nam Bắc - Nhẹ nhàng
    "Thanh Bình",  # Nam Bắc - Ấm áp
    "Minh Triết",  # Nam - Mạch lạc
    "Quang Sơn"    # Nam - Rắn rỏi
]

def generate_full_offline(voice_name="Phạm Tuyên"):
    safe_name = "".join(c for c in voice_name if c.isalnum() or c in ("-", "_")).rstrip()
    out_dir = Path(__file__).parent / "output" / f"offline_{safe_name}"
    out_dir.mkdir(parents=True, exist_ok=True)
    
    print("=" * 75)
    print(f"[*] Bắt đầu sinh full 12 phân đoạn proposal OFFLINE với VieNeu: {voice_name}")
    print("=" * 75)
    
    print("[*] Đang nạp mô hình VieNeu-TTS v3 Turbo 48kHz...")
    tts = vieneu.Vieneu(mode="v3turbo")
    
    wav_files = []
    for sec in SECTIONS:
        sec_file = out_dir / f"{sec['id']}.wav"
        print(f" -> Đang tạo: {sec['id']} ({sec['time']})...")
        audio = tts.infer(text=sec["text"], voice=voice_name)
        sf.write(str(sec_file), audio, 48000)
        wav_files.append(sec_file)
        
    # Nối toàn bộ file thành 1 audio full 3m30s
    concat_list_file = out_dir / "concat_list.txt"
    with open(concat_list_file, "w", encoding="utf-8") as f:
        for p in wav_files:
            f.write(f"file '{p.name}'\n")
            
    merged_output_wav = out_dir / f"full_voiceover_offline_{safe_name}.wav"
    merged_output_mp3 = out_dir / f"full_voiceover_offline_{safe_name}.mp3"
    
    print(f"[*] Đang nối các phân đoạn thành full audio: {merged_output_mp3.name}...")
    cmd_wav = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_list_file),
        "-c", "copy", str(merged_output_wav)
    ]
    subprocess.run(cmd_wav, cwd=str(out_dir), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    cmd_mp3 = [
        "ffmpeg", "-y", "-i", str(merged_output_wav),
        "-codec:a", "libmp3lame", "-b:a", "256k",
        str(merged_output_mp3)
    ]
    subprocess.run(cmd_mp3, cwd=str(out_dir), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    print("\n" + "=" * 75)
    print(f"[HOÀN TẤT] File tổng hợp 3m30s đã sẵn sàng tại:")
    print(f"  • MP3: {merged_output_mp3}")
    print(f"  • WAV: {merged_output_wav}")
    print("=" * 75)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="VieNeu Offline Voice-Over Generator")
    parser.add_argument("--voice", type=str, default="Phạm Tuyên", help="Tên preset giọng (VD: 'Phạm Tuyên', 'Minh Đức'...)")
    parser.add_argument("--list", action="store_true", help="Liệt kê các preset giọng nam offline")
    
    args = parser.parse_args()
    
    if args.list:
        print("=== CÁC GIỌNG NAM OFFLINE TRONG VIENEU ===")
        for p in OFFLINE_MALE_PRESETS:
            print(f" • {p}")
        sys.exit(0)
        
    generate_full_offline(args.voice)
