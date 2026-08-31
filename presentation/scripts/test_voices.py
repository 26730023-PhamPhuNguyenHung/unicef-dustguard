"""
DustGuard VN - Voice Tester & Video Comparison Generator
Sinh các mẫu giọng đọc và render đoạn video hook 30s kèm BGM để thẩm định voice trên nhạc thực tế.
"""

import os
import sys
import subprocess
from pathlib import Path
import soundfile as sf
import vieneu

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

BASE_DIR = Path(__file__).resolve().parent.parent

TEST_CONFIGS = [
    {
        "id": "A_vieneu_pham_tuyen",
        "name": "Phạm Tuyên",
        "desc": "Nam · Bắc · Tự nhiên, trầm ấm",
        "speed": 1.06
    },
    {
        "id": "B_vieneu_minh_duc",
        "name": "Minh Đức",
        "desc": "Nam · Bắc · Thời sự, đĩnh đạc",
        "speed": 1.08
    },
    {
        "id": "C_vieneu_truc_ly",
        "name": "Trúc Ly",
        "desc": "Nữ · Bắc · Tự nhiên, truyền cảm",
        "speed": 1.07
    },
    {
        "id": "D_vieneu_thuy_dung",
        "name": "Thùy Dung",
        "desc": "Nữ · Nam · Mượt mà, hiện đại",
        "speed": 1.08
    },
    {
        "id": "E_vieneu_doan_trang",
        "name": "Đoan Trang",
        "desc": "Nữ · Bắc · Phong thái đĩnh đạc",
        "speed": 1.07
    }
]

TEST_TEXT = (
    "Ở một thành phố đang phát triển, những công trường mới đồng nghĩa với những con đường mới, "
    "những ngôi nhà mới và những cơ hội mới. "
    "Nhưng cùng với sự phát triển đó, có một tác động rất dễ bị xem là nhỏ: Bụi công trình. "
    "DustGuard — biến dữ liệu thành hành động quản lý có ưu tiên, có bằng chứng và có theo dõi."
)

def change_speed_ffmpeg(in_wav, out_wav, speed=1.0):
    cmd = [
        "ffmpeg", "-y", "-i", str(in_wav),
        "-filter:a", f"atempo={speed}",
        "-ar", "48000",
        str(out_wav)
    ]
    subprocess.run(cmd, capture_output=True, check=True)

def render_comparison_video(voice_wav, out_mp4, title=""):
    bgm_path = BASE_DIR / "04_audio/music/epic-presentation.mp3"
    clip1 = BASE_DIR / "02_sources/real_video/flycam/clip_hn_01_city_haze.mp4"
    clip2 = BASE_DIR / "02_sources/real_video/construction/clip_hcm_01_construction_overview.mp4"
    
    # Render video test 20s: Clip1 (10s) -> Clip2 (10s) + Voice + BGM ducked
    filter_complex = (
        f"[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration=10,setpts=PTS-STARTPTS[v0];"
        f"[1:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,trim=duration=12,setpts=PTS-STARTPTS[v1];"
        f"[v0][v1]concat=n=2:v=1:a=0[v_base];"
        f"[v_base]drawtext=text='DUSTGUARD VN VOICE TEST - {title}':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=60:box=1:boxcolor=black@0.6:boxborderw=10[v];"
        f"[2:a]volume=1.0,aformat=sample_rates=48000:channel_layouts=stereo[a_voice];"
        f"[3:a]volume=0.18,aformat=sample_rates=48000:channel_layouts=stereo[a_bgm];"
        f"[a_voice][a_bgm]amix=inputs=2:duration=first:dropout_transition=2[a]"
    )
    
    cmd = [
        "ffmpeg", "-y",
        "-i", str(clip1),
        "-i", str(clip2),
        "-i", str(voice_wav),
        "-i", str(bgm_path),
        "-filter_complex", filter_complex,
        "-map", "[v]",
        "-map", "[a]",
        "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest",
        str(out_mp4)
    ]
    subprocess.run(cmd, capture_output=True, check=True)

def main():
    print("=== DUSTGUARD VN VOICE TESTER & VIDEO COMPARISON ===")
    test_dir = BASE_DIR / "04_audio" / "voice_tests"
    test_dir.mkdir(parents=True, exist_ok=True)
    
    print("[*] Khởi tạo VieNeu-TTS engine...")
    vn = vieneu.Vieneu()
    
    for cfg in TEST_CONFIGS:
        cid = cfg["id"]
        cname = cfg["name"]
        cspeed = cfg["speed"]
        
        raw_wav = test_dir / f"{cid}_raw.wav"
        speed_wav = test_dir / f"{cid}_{cspeed}x.wav"
        video_mp4 = test_dir / f"{cid}.mp4"
        
        print(f"\n[*] Đang sinh giọng: {cname} (Speed target: {cspeed}x)...")
        audio = vn.infer(text=TEST_TEXT, voice=cname)
        sf.write(str(raw_wav), audio, vn.sample_rate)
        
        change_speed_ffmpeg(raw_wav, speed_wav, speed=cspeed)
        print(f" -> Đã tạo audio: {speed_wav.name}")
        
        print(f"[*] Đang render preview video trên nền BGM: {video_mp4.name}...")
        try:
            render_comparison_video(speed_wav, video_mp4, title=f"{cname} ({cspeed}x)")
            print(f"[OK] Đã xuất video so sánh: {video_mp4.name}")
        except Exception as e:
            print(f"[CẢNH BÁO] Không thể render mp4: {e}")
            
    print("\n" + "=" * 80)
    print(f"[HOÀN TẤT] Toàn bộ voice tests & video comparisons đã sẵn sàng trong: {test_dir.relative_to(BASE_DIR)}")
    print("=" * 80)

if __name__ == "__main__":
    main()
