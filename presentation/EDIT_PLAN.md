# 🎬 DUSTGUARD VN — MASTER EDIT PLAN (3:30)

Tài liệu điều phối kịch bản dựng chi tiết theo từng phân đoạn (Segment-by-Segment).

---

## 🧭 CẤU TRÚC 12 PHÂN ĐOẠN (STORY ARC)

| Segment | Tên phân đoạn | Thời lượng | Voice Text Tóm Tắt | Visual Source IDs | Music Energy & Cues |
| :---: | :--- | :---: | :--- | :--- | :--- |
| **01** | `01_hook` | `0:00 - 0:18` (18s) | Những công trường mới... nhưng có tác động: Bụi công trình. | `V001`, `V002`, `V003` | Energy 2 (Piano Intro) |
| **02** | `02_problem` | `0:18 - 0:38` (20s) | Không thiếu dữ liệu... nhưng dữ liệu bị phân tán. | `V004`, `V005`, `V007` | Energy 4 (Problem Build) |
| **03** | `03_context` | `0:38 - 0:55` (17s) | Nếu cùng lúc có 10 phản ánh: nhìn vào đâu trước? | `V006`, `V015` | Energy 4 ➔ Ngắt nhịp lúc 0:54 |
| **04** | `04_solution` | `0:55 - 1:10` (15s) | DustGuard xuất hiện: kết nối tín hiệu thành hồ sơ. | `I002`, `I010`, `V002` | **Energy 7 (BEAT DROP 0:55)** |
| **05** | `05_core_logic`| `1:10 - 1:30` (20s) | 1 Tín hiệu ➔ 1 Hồ sơ, có bằng chứng, có theo dõi. | `I004`, `I003` | Energy 8 (Dynamic Flow) |
| **06** | `06_workshop_lesson`| `1:30 - 1:49` (19s) | Bài học tập huấn: Hỗ trợ thông tin, không phán xét. | `V008`, `I006` | Energy 6 (Contemplative) |
| **07** | `07_responsible_ai`| `1:49 - 2:08` (19s) | AI gợi ý checklist, xếp ưu tiên; con người quyết định. | `V009`, `V014` | Energy 8 (Confident Tech) |
| **08** | `08_lean_pilot`| `2:08 - 2:28` (20s) | Pilot 4-8 tuần, 20-30 người dùng thật tại trường học. | `V010`, `I008`, `V011` | **Energy 7 (Crossfade BGM 2)** |
| **09** | `09_metrics` | `2:28 - 2:45` (17s) | Đo giá trị thật: Tỷ lệ bằng chứng, thời gian phản hồi. | `I002`, `I008` | Energy 8 (Metric Growth) |
| **10** | `10_community` | `2:45 - 3:00` (15s) | Thanh niên xung kích: Ghi nhận đóng góp cộng đồng. | `V010`, `I001`, `I005` | Energy 8 (Inspiring Action) |
| **11** | `11_expansion` | `3:00 - 3:17` (17s) | 1 Lõi quản trị ➔ Nước thải, rơm rạ, tiếng ồn. | `I009`, `V011`, `I007` | Energy 9 (Ecosystem Expansion) |
| **12** | `12_closing` | `3:17 - 3:30` (13s) | DustGuard — Có ưu tiên, Có bằng chứng, Có theo dõi. | `I010`, `I007`, `V001` | **Energy 10 (Peak Climax Finale)**|

---

## 🎛️ QUY TẮC DỰNG BẮT BUỘC CHO AI AGENT / RENDERER:

1. **Deterministic Indexing**: Mọi visual source đều lấy từ `02_sources/SOURCE_INDEX.csv` thông qua ID (`V001` - `V015`, `I001` - `I010`).
2. **Music Driven Cuts**: Điểm chuyển cảnh ưu tiên ăn theo beat và onset trong `04_audio/music/MUSIC_MAP.yaml`.
3. **No Overclaim**: Các chỉ số ở segment 09 gắn nhãn *"Mục tiêu Pilot / Demo Model"*. Segment 07 nhấn mạnh *"AI gợi ý - Con người quyết định"*.
