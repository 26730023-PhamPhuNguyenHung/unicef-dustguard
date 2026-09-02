# 🎬 DUSTGUARD VN — MASTER EDIT PLAN (DOCUMENTARY PITCH 3:30)

Tài liệu điều phối kịch bản dựng phim tài liệu công nghệ (Documentary Pitch) chuẩn 46 cảnh (210 giây).

---

## 🧭 CẤU TRÚC 8 PHẦN NỘI DUNG (STORY ARC 46 CẢNH)

| Phần | Tên phân đoạn | Thời lượng | Số cảnh | Nhịp cắt trung bình | Mục tiêu & Cảm xúc |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **01** | `01_hook` | `0:00 - 0:20` (20s) | 5 cảnh | 4.0s / shot | Kéo người xem vào vấn đề: Bụi công trình đô thị |
| **02** | `02_problem` | `0:20 - 0:50` (30s) | 7 cảnh | 4.0s - 5.0s | Chứng minh bụi là vấn đề thật, ai cần hành động? |
| **03** | `03_gap` | `0:50 - 1:10` (20s) | 4 cảnh | 5.0s / shot | Khoảng trống quản lý hiện nay: Thủ công & Phân tán |
| **04** | `04_reveal` | `1:10 - 1:30` (20s) | 4 cảnh | 4.0s - 6.0s | **BEAT DROP 1:10** ➔ Reveal DustGuard, Sensor thật, Dashboard |
| **05** | `05_system_flow`| `1:30 - 2:15` (45s) | 10 cảnh | 2.0s - 5.0s | Case thực tế: Tín hiệu ➔ Telemetry ➔ Risk 78 ➔ Xác minh |
| **06** | `06_actors_workflow`| `2:15 - 2:45` (30s) | 7 cảnh | 3.0s - 5.0s | 4 Bên phối hợp: Citizen ➔ Staff ➔ Contractor ➔ Close-loop |
| **07** | `07_value_impact`| `2:45 - 3:10` (25s) | 5 cảnh | 5.0s / shot | Không cần soi mọi nơi, chỉ cần biết nơi chú ý trước |
| **08** | `08_ending_vision`| `3:10 - 3:30` (20s) | 4 cảnh | 5.0s / shot | Team thật, Prototype thật & Lời kết cảm xúc |

---

## 🎛️ QUY TẮC DỰNG BẮT BUỘC (ANTI-CLIP TRUNCATION & FRAME-ACCURACY)

1. **Two-Stage Multi-Pass Rendering**:
   - **Stage 1 (Pre-render 46 shots)**: Mỗi cảnh được render thành 1 clip 1080p25 độc lập, cắt chính xác từng khung hình (`-ss`, `-t`), áp dụng Ken Burns mượt cho ảnh tĩnh và scale/crop chuẩn 16:9, chèn text overlay Civic Tech `#FDFBF7`.
   - **Stage 2 (Lossless Concat Demuxer)**: Ghép 46 clips qua `concat demuxer` đảm bảo không bị giật, không lỗi độ dài và chuẩn xác 100% 210.0 giây.
2. **Audio Architecture (2 BGM + Voiceover Ducking)**:
   - **BGM 1 (Epic)**: `0:00 - 2:15` (Piano tự sự ➔ Tension build ➔ Beat Drop bùng nổ tại `1:10`).
   - **BGM 2 (Achievement)**: `2:10 - 3:30` (Crossfade 5s tại `2:10 - 2:15`, cao trào khải hoàn).
   - **Sidechain Ducking**: Giảm BGM xuống `-18dB` khi có giọng đọc, nâng lên `-8dB` ở đoạn chuyển cảnh.
3. **No Overclaim QC**:
   - AI chỉ xếp thứ tự ưu tiên (Triage) và hỗ trợ checklist — **không tự kết luận vi phạm / không xử phạt**.
   - Pilot quy mô gọn nhẹ: 4-8 tuần, 20-30 người dùng thật.
