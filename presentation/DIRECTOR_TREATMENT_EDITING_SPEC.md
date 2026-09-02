# 🎬 DUSTGUARD VN — DIRECTOR TREATMENT & MASTER EDITING SPECIFICATION
### *Tài liệu Chỉ đạo Nghệ thuật & Dựng Phim Chuẩn Phát sóng (Chung kết UNICEF Hackathon 2026)*

> **Định dạng**: Video Giới thiệu Dự án / Phim Tài liệu Công nghệ (Documentary Tech / Civic Tech)  
> **Thời lượng Mục tiêu**: 3 phút 30 giây (210.0 giây)  
> **Số lượng phân cảnh**: 46 Cảnh linh hoạt (Nhịp cắt 3s – 7s)  
> **Tỉ lệ khung hình**: 16:9 (1920x1080 Full HD, Progressive 25fps)  
> **Bảng màu chủ đạo**: Civic Cream `#FDFBF7`, Dark Ink `#231B14`, Accent Teal `#0D6F64`, Seal Red `#9F241F`

---

## 🎯 1. TỔNG QUAN CHỈ ĐẠO NGHỆ THUẬT (DIRECTOR'S VISION)

1. **Phong cách & Tinh thần (Vibe & Tone)**:
   - **Không làm PowerPoint slideshow**, không làm trailer thương mại lòe loẹt.
   - Mang cảm giác một bộ phim tài liệu ngắn chân thực: **Vấn đề thật ngoài đời** ➔ **Khoảng trống cách làm cũ** ➔ **DustGuard xuất hiện** ➔ **Case thực tế** ➔ **4 Bên tham gia** ➔ **Tác động & Tầm nhìn**.
   - Thể hiện hình ảnh một nhóm tác giả hiểu sâu thực địa, học hỏi từ phản hồi tập huấn, kiểm soát giới hạn AI và có lộ trình thực nghiệm thực tế.

2. **Cấu trúc Âm thanh 2 BGM (Audio Architecture)**:
   - **BGM 1 (`epic-presentation.mp3`)**: Từ `0:00` đến `2:15`. Nhịp điệu nghiêm túc, piano mở đầu tự sự, tăng dần năng lượng và **drop beat bùng nổ đúng giây 1:10** khi xuất hiện DustGuard.
   - **BGM 2 (`achievement.mp3`)**: Từ `2:10` đến `3:30`. Chuyển dần từ "Giải pháp khả thi" sang "Tạo tác động thật", cao trào hào hùng, tích cực và dứt khoát.
   - **Quy tắc Crossfade**: Thực hiện **Crossfade 5 giây** ở khoảng `2:10 – 2:15` mượt mà theo nhịp sóng âm, tuyệt đối không hard-cut âm nhạc.
   - **Mix Âm thanh (Audio Mixing)**: Voice-over là ưu tiên số 1. Khi có voice, BGM ducking ở `-18dB` đến `-16dB`. Các đoạn ngắt câu / chuyển phân cảnh nâng BGM lên `-9dB` đến `-7dB`.

---

## 📋 2. BẢNG PHÂN BỔ 8 PHẦN (46 CẢNH)

```text
[0:00 - 0:20] PHẦN 1: HOOK — MỘT THÀNH PHỐ ĐANG XÂY DỰNG (5 Cảnh | 4s/shot)
[0:20 - 0:50] PHẦN 2: THỰC TRẠNG BỤI CÔNG TRÌNH (7 Cảnh | 4-5s/shot)
[0:50 - 1:10] PHẦN 3: KHOẢNG TRỐNG HIỆN TẠI (4 Cảnh | 5s/shot)
[1:10 - 1:30] PHẦN 4: DUSTGUARD XUẤT HIỆN — BEAT DROP (4 Cảnh | 4-6s/shot)
[1:30 - 2:15] PHẦN 5: CÁCH HỆ THỐNG VẬN HÀNH — CASE THỰC TẾ (10 Cảnh | 2-5s/shot)
[2:15 - 2:45] PHẦN 6: NGƯỜI THẬT SỬ DỤNG — 4 BÊN PHỐI HỢP (7 Cảnh | 3-5s/shot)
[2:45 - 3:10] PHẦN 7: GIÁ TRỊ THỰC SỰ & KHẢ NĂNG TRIỂN KHAI (5 Cảnh | 5s/shot)
[3:10 - 3:30] PHẦN 8: ENDING — TẦM NHÌN & LỜI KẾT (4 Cảnh | 5s/shot)
```

---

## ⚙️ 3. GIẢI PHÁP KỸ THUẬT: CẮT VIDEO CHÍNH XÁC (FRAME-ACCURATE CUTTER)

Để khắc phục triệt để lỗi video bị cắt sai độ dài hoặc bị đơ frame khi ghép:
1. **Trích xuất & Chuẩn hóa từng Cảnh (Pre-cut Single Shots)**:
   - Sử dụng lệnh FFmpeg chính xác: `ffmpeg -ss <offset> -t <duration> -i <source> ...`
   - Đặt `-ss` trước `-i` hoặc dùng re-encode frame rate chuẩn `fps=25` và `setpts=PTS-STARTPTS` cho video.
   - Đối với ảnh tĩnh / mockup: Sử dụng zoompan / scale-pad mượt mà (Ken Burns effect) với số frame chính xác `n = duration * 25`.
2. **Ghép nối qua Concat Demuxer**:
   - Sử dụng tệp danh sách `concat.txt` để ghép 46 đoạn clip đã được render chuẩn hóa hoàn hảo.
   - Đảm bảo 100% clip có cùng resolution (1920x1080), framerate (25fps), codec (H.264), pixel format (`yuv420p`).
