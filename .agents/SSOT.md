# DUSTGUARD VN — MASTER SSOT ARCHITECTURE & DOMAIN SPECIFICATION

> **Phiên bản**: v2.0 (Consolidated Master SSOT)  
> **Mục tiêu**: Nguồn Chân Lý Duy Nhất (Single Source of Truth) toàn diện cho mọi phân hệ của nền tảng CivicTech DustGuard VN.

---

## 1. 11 NGUYÊN TẮC BẤT BIẾN (CORE INVARIANTS)
1. **D1 is SSOT**: Cloudflare D1 (`env.DB` / `prisma/dev.db`) là CSDL chân thực duy nhất. Cấm dùng client localStorage làm CSDL lưu trữ chính.
2. **Observation != Case**: Ghi nhận (Observation) là phát hiện ban đầu từ cộng đồng; Vụ việc (Case) là hồ sơ theo dõi 7 bước tác nghiệp đa bên.
3. **IoT is Optional**: Hệ thống hoạt động 100% khi có 0 cảm biến (chuẩn hóa trọng số `sum(score * w) / sum(w)`).
4. **AI is Assistant, Not Judge**: AI hỗ trợ tóm tắt, trích xuất và gợi ý; con người và quy chuẩn thực tế quyết định.
5. **No Glassmorphism**: Light mode high-contrast civic tech (`#FDFBF7` cream, `#231b14` ink, `#0d6f64` teal, `#9f241f` seal red). Cấm `backdrop-blur-*`. Touch targets $\ge 44\text{px}$.
6. **Zero Truncate on Critical Civic Entities (UI Text SSOT)**: Cấm dùng `truncate`, `line-clamp`, `overflow-hidden` để che tên công trình, hồ sơ, nhiệm vụ.
7. **Zero Mock in Core Paths**: Dữ liệu thật qua D1 SQLite queries & API endpoints, không mock fake entities trong catch blocks.
8. **Fast Inner Loop (< 0.5s)**: Chạy test đơn lẻ mục tiêu (`node --test app/tests/<file>.test.js`) ngay khi code.
9. **Natural Civic Copy & Zero Jargon**: Ngôn từ Ngắn — Rõ — Dễ hành động — Phù hợp thực tế. Cấm thuật ngữ kỹ thuật (DAG, SHA-256, HMAC, SLA, telemetry...) trên UI người dùng phổ thông.
10. **Responsive 14-Inch Desktop & Mobile SSOT**: Bắt buộc tương thích hoàn hảo tại 1536x864, 1366x768, 1440x900, 1920x1080 và Mobile 360-430px.
11. **API Data Contract & Collection Normalization**: Collection luôn normalize về array `[]`, unwrap `{ data: { items } }` trước khi đưa vào React state.

---

## 2. KIẾN TRÚC 12 BẢNG CSDL D1 CỐT LÕI (STAFF SCHEMA SSOT)
1. **`users`**: Quản lý tài khoản & 5 vai trò (`public`, `citizen`, `community`, `staff`, `executive`).
2. **`sites` / `projects`**: Danh mục công trình xây dựng (Tên, địa chỉ, chủ thầu, chỉ huy trưởng, tọa độ WGS84, điểm rủi ro bụi 0-100).
3. **`sensors` / `monitoring_stations`**: Trạm quan trắc IoT đo bụi PM2.5/PM10.
4. **`sensor_readings`**: Dữ liệu chuỗi thời gian đo bụi PM2.5, PM10, nhiệt độ, độ ẩm.
5. **`alerts`**: Cảnh báo bụi vượt ngưỡng quy chuẩn QCVN 05:2023/BTNMT.
6. **`complaints`**: Phản ánh ban đầu từ cộng đồng và người dân (`mergedInto`, `latitude`, `longitude`).
7. **`cases`**: Hồ sơ vụ việc xử lý 7 bước (Mã HS, công trình, mức ưu tiên, hạn chót, cán bộ phụ trách).
8. **`actions`**: Nhiệm vụ hiện trường & yêu cầu khắc phục môi trường giao cho nhà thầu hoặc cán bộ.
9. **`evidences`**: Minh chứng số (Ảnh Trước/Sau, mã băm SHA-256 đối chứng, URL lưu trữ R2).
10. **`inspections`**: Biên bản khảo sát thực địa 10 tiêu chí QCVN 18:2021/BXD & QĐ 48/2022/QĐ-UBND.
11. **`reports`**: Báo cáo công tác định kỳ kết xuất theo Nghị định 30/2020/NĐ-CP (Word DOCX/PDF).
12. **`report_schedules`**: Cấu hình lịch tự động gửi báo cáo định kỳ.

---

## 3. TIẾN TRÌNH TÁC NGHIỆP 7 BƯỚC (CASE ENFORCEMENT DAG)
1. **Bước 1: Tiếp nhận phản ánh (`RECORDED`)**: Thu nhận tin báo từ người dân hoặc cảm biến IoT vượt ngưỡng.
2. **Bước 2: Xác minh ban đầu (`VERIFIED`)**: Cán bộ kiểm tra tính xác thực, kiểm tra tọa độ và gom cụm trùng lặp.
3. **Bước 3: Gửi thông báo nhắc nhở (`NOTICE_SENT`)**: Hệ thống/Cán bộ gửi thông báo yêu cầu kiểm tra.
4. **Bước 4: Khảo sát thực địa (`INSPECTION`)**: Cán bộ có mặt tại công trình chấm 10 tiêu chí QCVN 18:2021/BXD.
5. **Bước 5: Yêu cầu khắc phục (`ACTION_PROPOSED`)**: Giao nhiệm vụ dập bụi, phủ bạt, xịt rửa bánh xe cho nhà thầu kèm hạn 48h.
6. **Bước 6: Nhà thầu khắc phục & Tái kiểm (`REMEDIATION`)**: Nhà thầu nộp ảnh sau xử lý $\rightarrow$ Hệ thống tự động sinh việc tái kiểm cho cán bộ.
7. **Bước 7: Nghiệm thu & Hoàn tất (`COMPLETED`)**: Cán bộ duyệt đạt chuẩn, khóa hồ sơ chống giả mạo.

---

## 4. QUY CHUẨN KỸ THUẬT & PHÁP LÝ
- **QCVN 05:2023/BTNMT**: Ngưỡng bụi PM2.5 trung bình 24h = $50\,\mu\text{g/m}^3$, PM10 = $100\,\mu\text{g/m}^3$.
- **QCVN 18:2021/BXD & QĐ 48/2022/QĐ-UBND**: 10 tiêu chí an toàn môi trường xây dựng.
- **Nghị định 45/2022/NĐ-CP**: Khung xử phạt vi phạm hành chính trong lĩnh vực bảo vệ môi trường.
- **Nghị định 30/2020/NĐ-CP**: Quy chuẩn thể thức văn bản hành chính Việt Nam (A4, Times New Roman, lề trái 30-35mm, số ký hiệu, trích yếu, chữ ký số).
- **Tín chỉ tình nguyện thanh niên**: $20\text{ giờ hoạt động} = 4.0\text{ Tín chỉ} = 80\text{ Điểm rèn luyện}$ kèm mã QR ma trận ISO/IEC 18004.
