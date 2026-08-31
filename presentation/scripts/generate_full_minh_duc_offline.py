"""
DustGuard VN - Sinh Trọn Bộ 12 Phân Đoạn Voice-Over Offline Giọng Minh Đức (VieNeu-TTS)
Xuất 12 file lẻ (01.wav -> 12.wav) và 1 file full_voiceover_minh_duc.wav / .mp3
vào 04_audio/voice_final/ và output/offline_minh_duc/
"""

import sys
import json
import subprocess
from pathlib import Path
import soundfile as sf
import vieneu

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

BASE_DIR = Path(__file__).resolve().parent.parent

SECTIONS = [
    {
        "id": "01_mo_van_de",
        "title": "Mở vấn đề bụi công trình",
        "text": "Ở một thành phố đang phát triển, những công trường mới đồng nghĩa với những con đường mới, những ngôi nhà mới và những cơ hội mới. Nhưng cùng với sự phát triển đó, có một tác động rất dễ bị xem là nhỏ... cho đến khi nó trở thành vấn đề của cả một cộng đồng. Đó là bụi công trình."
    },
    {
        "id": "02_nut_that",
        "title": "Nút thắt dữ liệu phân tán",
        "text": "Điều chúng tôi nhận ra là: vấn đề không phải chúng ta hoàn toàn không có dữ liệu. Người dân có phản ánh. Có hình ảnh. Có vị trí. Có thông tin công trình. Có hồ sơ kiểm tra. Và trong tương lai còn có thể có dữ liệu từ cảm biến. Nhưng những thông tin đó thường nằm ở nhiều nơi khác nhau. Và khi dữ liệu bị phân tán, điều khó nhất là biến nó thành một hành động có thứ tự ưu tiên."
    },
    {
        "id": "03_cau_hoi_trung_tam",
        "title": "5 Câu hỏi trung tâm",
        "text": "Nếu cùng lúc có mười phản ánh, chúng ta nên nhìn vào trường hợp nào trước? Vì sao trường hợp đó đáng chú ý? Hồ sơ còn thiếu gì? Ai đang phụ trách? Và sau khi một phản ánh được gửi đi... nó đã thực sự đi đến đâu?"
    },
    {
        "id": "04_dustguard_xuat_hien",
        "title": "DustGuard xuất hiện",
        "text": "DustGuard được xây dựng để trả lời những câu hỏi đó. Không phải bằng cách thay thế người ra quyết định. Mà bằng cách kết nối tín hiệu, bằng chứng, mức độ ưu tiên và quá trình xử lý thành một hồ sơ có thể theo dõi."
    },
    {
        "id": "05_tinh_moi",
        "title": "Tính mới của giải pháp",
        "text": "Điểm mới của DustGuard không nằm ở việc tạo thêm một nơi để gửi phản ánh. Điều chúng tôi muốn giải quyết là khoảng trống sau khi phản ánh đã được gửi. Một tín hiệu ban đầu phải có cơ hội trở thành một hồ sơ. Một hồ sơ phải có bằng chứng. Một trường hợp phải có mức độ ưu tiên. Và quan trọng nhất: phải có thể biết nó đang được xử lý tới đâu."
    },
    {
        "id": "06_bai_hoc_tap_huan",
        "title": "Bài học sau tập huấn",
        "text": "Nhưng DustGuard hôm nay không còn giống phiên bản ban đầu. Sau vòng tập huấn, chúng tôi nhận ra rằng một hệ thống thông minh không nên cố gắng đưa ra nhiều quyết định hơn con người. Nó phải giúp con người có đủ thông tin để đưa ra quyết định tốt hơn. Vì vậy, chúng tôi thay đổi cách nhìn về AI, về điểm rủi ro và cả vai trò của IoT."
    },
    {
        "id": "07_ai_dung_vai_tro",
        "title": "Responsible AI",
        "text": "Dust Risk Score không trả lời rằng một công trình có vi phạm hay không. Nó chỉ hỗ trợ một câu hỏi thực tế hơn: trong nhiều trường hợp đang tồn tại, trường hợp nào nên được xem xét trước, và vì sao? AI có thể phân loại, tóm tắt, tìm thông tin còn thiếu và hỗ trợ checklist. Nhưng AI không tự kết luận vi phạm. Không tự quyết định xử phạt. Và không thay thế cơ quan có thẩm quyền."
    },
    {
        "id": "08_vi_sao_kha_thi",
        "title": "Mô hình Lean Pilot",
        "text": "Chúng tôi cũng học được rằng một giải pháp môi trường không nên bắt đầu bằng một hạ tầng thật lớn. DustGuard có thể bắt đầu chỉ với dữ liệu đang có: phản ánh, hình ảnh, vị trí, checklist và hồ sơ. Một pilot có thể triển khai trong một cộng đồng nhỏ, một trường học hoặc một câu lạc bộ môi trường. Trong bốn đến tám tuần. Với hai mươi đến ba mươi người dùng thật. Và những chỉ số có thể đo được."
    },
    {
        "id": "09_do_gia_tri_that",
        "title": "Đo lường giá trị thật",
        "text": "Bao nhiêu trường hợp có đủ bằng chứng? Thời gian từ phát hiện đến hành động là bao lâu? Bao nhiêu trường hợp thực sự có bước xử lý tiếp theo? Bao nhiêu vụ việc có thể được theo dõi từ lúc xuất hiện tín hiệu đến khi có kết quả? Đó mới là những con số chúng tôi muốn dùng để chứng minh DustGuard có giá trị."
    },
    {
        "id": "10_vai_tro_cong_dong",
        "title": "Vai trò cộng đồng",
        "text": "Và DustGuard không chỉ dành cho cơ quan quản lý. Chúng tôi muốn bắt đầu từ những cộng đồng đã có động lực hành động: trường học, câu lạc bộ môi trường, tổ chức thanh niên và những người trẻ. Để họ không chỉ nhìn thấy một vấn đề. Mà biết cách ghi nhận nó tốt hơn, theo dõi nó lâu hơn và giúp nó không bị bỏ quên."
    },
    {
        "id": "11_tam_nhin_mo_rong",
        "title": "Tầm nhìn mở rộng",
        "text": "Nếu cách tiếp cận này được kiểm chứng với bụi công trình, chúng tôi tin rằng cùng một lõi có thể tiếp tục được phát triển cho những vấn đề môi trường khác. Nước thải. Đốt rơm rạ. Thuốc bảo vệ thực vật. Tiếng ồn. Nhưng mỗi bước mở rộng đều phải bắt đầu lại bằng việc hiểu đúng người dùng, đúng dữ liệu và đúng quy trình thực tế."
    },
    {
        "id": "12_ket_manh",
        "title": "Kết mạnh & Sứ mệnh",
        "text": "DustGuard không đặt mục tiêu trở thành một hệ thống quyết định thay con người. Chúng tôi muốn nó trở thành một công cụ giúp một vấn đề được nhìn thấy rõ hơn. Được ghi nhận đầy đủ hơn. Được theo dõi lâu hơn. Và có nhiều cơ hội hơn để đi từ một tín hiệu... đến một hành động thực sự. DustGuard — biến dữ liệu thành hành động quản lý có ưu tiên, có bằng chứng và có theo dõi."
    }
]

def main():
    voice_final_dir = BASE_DIR / "04_audio" / "voice_final"
    offline_dir = BASE_DIR / "output" / "offline_minh_duc"
    voice_final_dir.mkdir(parents=True, exist_ok=True)
    offline_dir.mkdir(parents=True, exist_ok=True)
    
    print("=" * 80)
    print("🎙️ DUSTGUARD VN — SINH FULL 12 PHÂN ĐOẠN OFFLINE: MINH ĐỨC (VIENEU-TTS)")
    print("=" * 80)
    
    vn = vieneu.Vieneu()
    durations = {}
    concat_list = []
    
    for i, s in enumerate(SECTIONS, 1):
        seg_str = f"{i:02d}"
        text = s["text"]
        out_wav = voice_final_dir / f"{seg_str}.wav"
        copy_wav = offline_dir / f"{seg_str}_{s['id']}.wav"
        
        print(f"\n[*] [{seg_str}/12] Đang sinh: {s['title']}...")
        audio = vn.infer(text=text, voice="Minh Đức")
        sf.write(str(out_wav), audio, vn.sample_rate)
        sf.write(str(copy_wav), audio, vn.sample_rate)
        
        # Đo duration
        cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(out_wav)]
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        dur = float(json.loads(res.stdout)["format"]["duration"])
        durations[i] = round(dur, 3)
        print(f"[OK] Hoàn thành {out_wav.name} | Thời lượng: {dur:.3f}s")
        
        concat_list.append(f"file '{out_wav.resolve().as_posix()}'")
        
    # Ghi file concat_list.txt để ghép file full
    concat_file = voice_final_dir / "concat_list.txt"
    with open(concat_file, "w", encoding="utf-8") as f:
        f.write("\n".join(concat_list))
        
    # Ghép thành file full_voiceover_minh_duc.wav và .mp3
    full_wav = voice_final_dir / "full_voiceover_minh_duc.wav"
    full_mp3 = voice_final_dir / "full_voiceover_minh_duc.mp3"
    offline_full_wav = offline_dir / "full_voiceover_minh_duc.wav"
    offline_full_mp3 = offline_dir / "full_voiceover_minh_duc.mp3"
    
    print("\n[*] Đang ghép 12 phân đoạn thành file FULL không nhạc...")
    cmd_concat_wav = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_file),
        "-c", "copy", str(full_wav)
    ]
    subprocess.run(cmd_concat_wav, check=True)
    
    cmd_concat_mp3 = [
        "ffmpeg", "-y", "-i", str(full_wav),
        "-c:a", "libmp3lame", "-b:a", "320k", "-ar", "48000", str(full_mp3)
    ]
    subprocess.run(cmd_concat_mp3, check=True)
    
    # Copy sang offline_dir
    import shutil
    shutil.copy2(full_wav, offline_full_wav)
    shutil.copy2(full_mp3, offline_full_mp3)
    
    # Đo tổng thời lượng file full
    cmd_full = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(full_wav)]
    res_full = subprocess.run(cmd_full, capture_output=True, text=True, check=True)
    full_dur = float(json.loads(res_full.stdout)["format"]["duration"])
    
    print("\n" + "=" * 80)
    print(f"🎉 HOÀN THÀNH XUẤT FULL VOICE-OVER MINH ĐỨC!")
    print(f"⏱️ Tổng thời lượng: {full_dur:.3f}s ({full_dur/60:.2f} phút)")
    print(f"📁 12 File lẻ: {voice_final_dir.relative_to(BASE_DIR)} (01.wav -> 12.wav)")
    print(f"📁 File Full WAV: {full_wav.relative_to(BASE_DIR)}")
    print(f"📁 File Full MP3: {full_mp3.relative_to(BASE_DIR)}")
    print("=" * 80)

if __name__ == "__main__":
    main()
