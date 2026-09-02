# 🎬 DustGuard VN — Deterministic AI Video Production Pipeline

Kiến trúc sản xuất video tự động hóa 100% dành cho AI Coding Agent & Senior Editor.  
**Nguyên tắc cốt lõi**: AI chỉ cần đọc **4 file điều phối** là nắm toàn bộ tài nguyên, phân đoạn, voice-over và điểm beat/drop của âm nhạc, không cần quét lại toàn bộ folder.

---

## 🧭 4 FILE ĐIỀU PHỐI TRUNG TÂM (MASTER COORDINATION)

```
presentation/
├── PROJECT.yaml                # [1] Cấu hình dự án, render specs, voice/music path
├── EDIT_PLAN.md                # [2] Kịch bản dựng tổng quan theo 12 phân đoạn
├── TIMELINE.json               # [3] Machine-readable timeline chính xác từng mili-giây
└── 02_sources/SOURCE_INDEX.csv # [4] Chỉ mục toàn bộ Video/Image/Slide IDs (V001..V015, I001..I010)
```

---

## 🗂️ CẤU TRÚC THƯ MỤC CHUẨN HÓA

```
presentation/
├── 01_script/
│   ├── master_voiceover.md     # Kịch bản lời thoại đầy đủ 12 phân đoạn
│   ├── segments/               # 12 file markdown nhỏ: 01_hook.md ... 12_closing.md
│   └── subtitles/
│       └── final.srt           # Phụ đề tiếng Việt chuẩn broadcast
│
├── 02_sources/                 # Kho tài nguyên gốc (đã được đánh ID trong SOURCE_INDEX.csv)
│   ├── real_video/             # vietnam, construction, dust, city, people, flycam, project_demo
│   ├── real_images/            # vietnam, construction, environment, project
│   ├── slides/                 # png, original
│   └── SOURCE_INDEX.csv        # Bảng tra cứu tài nguyên: id, type, file, duration, tags, quality
│
├── 03_selected/                # Thư mục segment_01/ -> segment_12/ phục vụ dựng chi tiết
│
├── 04_audio/
│   ├── music/
│   │   ├── epic-presentation.mp3
│   │   ├── achievement.mp3
│   │   └── MUSIC_MAP.yaml      # Sóng âm, điểm beat drop (0:55), energy (1-10), crossfade (2:10)
│   ├── voice_tests/            # Mẫu so sánh 5 giọng đọc cùng video hook 30s & BGM
│   ├── voice_final/            # 12 file voice WAV chuẩn 48kHz: 01.wav ... 12.wav
│   └── mix/
│
├── 05_edit/
│   ├── segment_plans/          # 12 file YAML: 01.yaml ... 12.yaml (10-20 dòng/segment)
│   ├── transitions/
│   ├── overlays/
│   ├── titles/
│   └── captions/
│
├── 06_temp/                    # Thư mục tạm (proxies, normalized audio, render cache)
│
├── 07_output/
│   ├── preview/                # Bản dựng preview nháp từng segment
│   ├── final/
│   │   └── DustGuardVN_FINAL_1080p.mp4  # Master Video H.264 1080p 30fps
│   ├── QC_REPORT.md            # Báo cáo kiểm định chất lượng tự động
│   └── archive/
│
└── scripts/
    ├── index_sources.py        # Quét và tạo SOURCE_INDEX.csv
    ├── analyze_music.py        # Phân tích BGM và tạo MUSIC_MAP.yaml
    ├── build_timeline.py       # Xuất TIMELINE.json & 12 segment plans YAML
    ├── test_voices.py          # Render 5 video so sánh giọng đọc trên nền BGM
    ├── generate_final_voices.py# Sinh 12 file WAV segment cho giọng chính (Minh Đức / Trúc Ly)
    ├── render_segment.py       # Render preview từng phân đoạn
    ├── render_final.py         # Master Render: Ghép toàn bộ video hoàn chỉnh
    └── qc_final.py             # Chạy kiểm tra kỹ thuật (ffprobe) & nội dung
```

---

## ⚡ CÁC LỆNH VẬN HÀNH PIPELINE CLI (REPRODUCIBLE IN 1 CLICK)

```powershell
# 1. Đánh chỉ mục tài nguyên
python presentation/scripts/index_sources.py

# 2. Phân tích âm nhạc và nhịp beat
python presentation/scripts/analyze_music.py

# 3. Xây dựng Timeline và các segment plans
python presentation/scripts/build_timeline.py

# 4. Render video hoàn chỉnh (Master Build)
python presentation/scripts/render_final.py

# 5. Chạy kiểm tra chất lượng (QC)
python presentation/scripts/qc_final.py
```
