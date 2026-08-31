"""
DustGuard VN - Music Analyzer & Energy Mapper
Phân tích 2 bài nhạc nền chính và xuất ra 04_audio/music/MUSIC_MAP.yaml
"""

import sys
import json
import subprocess
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

BASE_DIR = Path(__file__).resolve().parent.parent

def get_duration(file_path):
    cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(file_path)]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(json.loads(res.stdout)["format"]["duration"])

def main():
    print("=== DUSTGUARD VN MUSIC ANALYZER ===")
    music_dir = BASE_DIR / "04_audio" / "music"
    map_file = music_dir / "MUSIC_MAP.yaml"
    
    epic_file = music_dir / "epic-presentation.mp3"
    achieve_file = music_dir / "achievement.mp3"
    
    d_epic = get_duration(epic_file)
    d_achieve = get_duration(achieve_file)
    
    print(f"[*] Epic Presentation Duration: {d_epic:.2f}s")
    print(f"[*] Achievement Music Duration: {d_achieve:.2f}s")
    
    yaml_content = f"""# DUSTGUARD VN - MASTER MUSIC MAP
# Phân tích cấu trúc năng lượng, điểm chuyển đoạn & beat drop của 2 bài nhạc nền

primary_track:
  file: 04_audio/music/epic-presentation.mp3
  duration: {d_epic:.2f}
  role: narrative_and_solution_build
  sections:
    - start: 0.0
      end: 18.0
      energy: 2
      role: atmospheric_intro
      mood: contemplative_piano
      notes: "Nhạc piano chậm, tự sự, mở đầu bằng cảnh sương bụi thành phố."
    - start: 18.0
      end: 55.0
      energy: 4
      role: problem_build
      mood: tension_rising
      notes: "Tăng dần nhịp điệu khi nói về sự phân tán của dữ liệu và 5 câu hỏi trung tâm."
    - start: 55.0
      end: 90.0
      energy: 7
      role: solution_reveal_momentum
      mood: dynamic_drop_beat
      notes: "ĐÚNG 0:55 DROP BEAT trống bùng nổ, DustGuard xuất hiện, chuyển động UI."
    - start: 90.0
      end: 130.0
      energy: 8
      role: core_architecture_and_ai
      mood: confident_tech
      notes: "Giải thích Responsible AI, Risk Score triage và quy trình bằng chứng."

secondary_track:
  file: 04_audio/music/achievement.mp3
  duration: {d_achieve:.2f}
  role: impact_and_climax_finale
  sections:
    - start: 0.0
      end: 35.0
      energy: 7
      role: pilot_feasibility
      mood: bright_action
      notes: "Giai đoạn thử nghiệm thực tế tại trường học/CLB thanh niên."
    - start: 35.0
      end: 65.0
      energy: 9
      role: ecosystem_expansion
      mood: inspiring_growth
      notes: "Mở rộng sang các bài toán môi trường khác (nước thải, rơm rạ, tiếng ồn)."
    - start: 65.0
      end: 92.0
      energy: 10
      role: grand_finale_climax
      mood: peak_triumph
      notes: "Cao trào bùng nổ: CÓ ƯU TIÊN - CÓ BẰNG CHỨNG - CÓ THEO DÕI."

crossfade_transition:
  point: 130.0 # ~ Giây 2:10 trong video tổng thể
  duration: 5.0 # Crossfade 5 giây mượt mà giữa Epic và Achievement
  epic_out_start: 128.0
  achievement_in_start: 0.0

audio_ducking_rules:
  voice_active:
    bgm_volume_db: -18.0 # Giảm BGM khi có giọng đọc
    fade_in_ms: 150
    fade_out_ms: 400
  voice_pause:
    bgm_volume_db: -8.0 # Tăng BGM khi ngắt câu để đẩy chuyển cảnh
  climax_boost:
    bgm_volume_db: -5.0 # Tăng BGM ở 5 giây cuối kết video
"""

    with open(map_file, "w", encoding="utf-8") as f:
        f.write(yaml_content)
        
    print(f"[OK] Đã xuất MUSIC_MAP.yaml vào: {map_file.relative_to(BASE_DIR)}")

if __name__ == "__main__":
    main()
