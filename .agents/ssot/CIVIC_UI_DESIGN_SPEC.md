# DUSTGUARD VN — CIVIC UI/UX DESIGN SPECIFICATION & MICROCOPY SSOT

> **Phiên bản**: 2.0 (Civic Tech High-Contrast Standard)  
> **Tác giả**: Trưởng nhóm Thiết kế Giao diện (Civic UI/UX Designer)  
> **Trạng thái**: SSOT Hiệu lực toàn hệ thống  

---

## 🎨 1. Quy chuẩn Hệ thống Thiết kế & Ngôn ngữ Giao diện (Design Tokens & Rules)

### 1.1 Bảng màu Tương phản Cao (High-Contrast Civic Palette)
Tuyệt đối tuân thủ nguyên tắc: **Nền sáng thì chữ đậm, nền đậm thì chữ sáng**. Đạt chuẩn tiếp cận WCAG 2.2 AAA (tỷ lệ tương phản văn bản chính > 7:1) giúp đọc rõ ràng ngay cả ngoài trời nắng gắt.

| Vai trò Thiết kế | Token CSS | Mã Hex | Tên màu | Mô tả Ứng dụng Thực tế |
|---|---|---|---|---|
| **Nền Canvas chính** | `--color-bg-canvas` | `#FDFBF7` | Warm Cream | Nền bao quát toàn trang, body, containers, modal backdrop |
| **Nền Card / Bề mặt** | `--color-bg-surface` | `#FFFFFF` | Pure White | Thẻ card, bảng dữ liệu, form nhập liệu, panel chi tiết |
| **Chữ Chính (Primary Text)** | `--color-text-primary` | `#231B14` | Deep Ink | Tiêu đề chính, nhãn form, số liệu đo lường, nội dung cốt lõi |
| **Chữ Phụ (Secondary Text)**| `--color-text-secondary`| `#524336` / `#6B6056` | Muted Charcoal | Đoạn giải thích, thời gian, metadata phụ trợ |
| **Thương hiệu & Con dấu Đỏ**| `--color-brand-primary` | `#9F241F` | Official Seal Red| Nút CTA chính (Primary Button), cảnh báo P1 khẩn cấp, con dấu số |
| **Hành động Xanh / Civic Teal**| `--color-accent-teal` | `#0D6F64` | Civic Teal | Nút hành động phối hợp, trạng thái Đang theo dõi, Đã hoàn thành |
| **Cảnh báo / Giám sát (Amber)**| `--color-warning` | `#B45309` | Warning Amber | Trạng thái cần tái kiểm tra, điểm nóng cảnh giác cao P2 |
| **Đường viền (Border)** | `--color-border-subtle` | `#E7DFD3` | Warm Sand | Viền card, phân tách danh sách, viền ô nhập liệu |

### 1.2 Nguyên tắc "Zero Glassmorphism" & Đổ bóng Khối đặc (Solid Shadows)
1. **Cấm tuyệt đối Glassmorphism**: Không sử dụng `backdrop-blur-*`, không dùng màu trong suốt mờ ảo (`bg-white/30`). Nền mọi thành phần phải là mảng màu đặc (`#FFFFFF` hoặc `#FDFBF7`) với đường viền xác định (`border border-ink-900/10`).
2. **Đổ bóng Khối rõ nét (Crisp Shadows)**:
   - Card phẳng mặc định: `box-shadow: 0 1px 3px rgba(35, 27, 20, 0.06), 0 1px 2px rgba(35, 27, 20, 0.04);`
   - Hover card / Dialog nổi: `box-shadow: 0 4px 12px rgba(35, 27, 20, 0.05);`

### 1.3 Quy chuẩn Vùng Chạm & Typography Tiếng Việt
- **Touch Target WCAG 2.2**: Mọi nút bấm (Button), Tab, Select, Checkbox phải có vùng chạm tối thiểu **44px x 44px** (`min-h-[44px] min-w-[44px]`).
- **Khoảng cách dòng Tiếng Việt**: Line-height luôn duy trì `1.5 - 1.65` để tránh đè và nghẹt dấu tiếng Việt (Hỏi, Ngã, Nặng, Sắc, Huyền).
- **Quy tắc Nút Bấm SSOT**:
  - **Nút Chính (Primary CTA)**: Nền đỏ con dấu `#9F241F`, chữ **TRẮNG TINH `#FFFFFF`**, viền `#8E161A`, nhãn tối đa 3 từ (`Ghi nhận mới`, `Nhận nhiệm vụ`, `Bàn giao hồ sơ`).
  - **Nút Phụ (Secondary CTA)**: Nền trắng `#FFFFFF`, chữ mực đậm `#231B14`, viền `#E7DFD3`, hover chuyển kem sáng `#F8F1E2`.

---

## 🏛️ 2. Bốn Khối Giao diện & Nghiệp vụ Trọng tâm

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                          DUSTGUARD VN PLATFORM                          │
├───────────────────┬────────────────────┬──────────────────┬─────────────┤
│   KHỐI 1: HIỂU    │   KHỐI 2: THEO DÕI │  KHỐI 3: HÀNH    │ KHỐI 4: BÀN │
│   VẤN ĐỀ          │   ĐỐI CHỨNG B/A    │  ĐỘNG & TÍN CHỈ  │ GIAO HỖ TRỢ │
├───────────────────┼────────────────────┼──────────────────┼─────────────┤
│ • Tiêu chuẩn QCVN │ • Ảnh Before/After │ • 5-Step Civic   │ • Dossier   │
│ • Bán kính 300m   │ • Hash SHA-256     │   Action Loop    │   A4/PDF    │
│ • CPS Score 0-100 │ • Tái kiểm 24h-48h │ • 20h = 4.0 TC   │ • SLA 48h   │
│ • Tri thức thực tế│ • Tốt/Không đổi/Xấu│ • Chứng nhận QR  │ • 5 Trạng   │
│                   │                    │                  │   thái      │
└───────────────────┴────────────────────┴──────────────────┴─────────────┘
```

---

### 📘 Khối 1: Hiểu Vấn Đề (Legal Info & Environmental Knowledge)

#### A. Mục tiêu & Tâm lý Thiết kế
Giúp người dân, sinh viên và thanh niên hiểu rõ bản chất vấn đề môi trường đang quan sát: Tại sao bụi/khói này có hại? Quy định pháp luật hiện hành quy định ra sao? Tiêu chuẩn nào đang bị vi phạm? Điểm ưu tiên rủi ro được tính như thế nào?

#### B. Thành phần Giao diện & Microcopy Chuẩn
1. **Thẻ Tri thức Pháp lý (Legal Reference Badge)**:
   - *Microcopy*: `QCVN 05:2023/BTNMT` (Chất lượng không khí xung quanh), `QCVN 18:2021/BXD` (An toàn che chắn công trình thi công), `Nghị định 45/2022/NĐ-CP` (Xử phạt vi phạm bảo vệ môi trường).
   - *Ghi chú trung thực*: *"Thông tin đối chiếu phục vụ giám sát cộng đồng và tổng hợp kiến nghị dân sự — Không thay thế kết luận thanh tra chuyên ngành."*
2. **Vùng Đệm Bảo vệ Nhạy cảm (Sensitive Zone Guardian - 300m)**:
   - *Microcopy*: `"Bán kính bảo vệ trường học: 85m (Dưới ngưỡng an toàn 300m)"`
   - *Giải thích tác động*: `"Trẻ em có tần suất hô hấp nhanh hơn người lớn 50%, bụi mịn công trình tích tụ quanh cổng trường ảnh hưởng trực tiếp đến 1.400 học sinh."`
3. **Bộ Phân tích Trọng số Rủi ro (CPS Priority Score Breakdown - 0 đến 100)**:
   - *Hiển thị minh bạch*:
     - Đối tượng nhạy cảm (Trường học, bệnh viện, khu dân cư): **35%**
     - Mức độ che chắn & dập bụi tại hiện trường: **25%**
     - Mật độ giao thông và xe tải nặng giờ cao điểm: **20%**
     - Tần suất phản ánh trùng khớp từ cộng đồng: **20%**
   - *Microcopy cảnh báo*: `"Điểm số 84/100: Ưu tiên can thiệp cao trong vòng 24 giờ."`

---

### 📷 Khối 2: Theo Dõi Đối Chứng Before/After (Verifiable Follow-up)

#### A. Mục tiêu & Tâm lý Thiết kế
Giải quyết dứt điểm điểm yếu lớn nhất của các ứng dụng phản ánh truyền thống: **"Gửi xong rồi không biết đi đâu, có ai làm gì không"**. Cung cấp chu trình đối chứng trực quan, có mã niêm phong số chống làm giả.

#### B. Thành phần Giao diện & Microcopy Chuẩn
1. **Thanh Trượt / Thẻ Đối Soát Trước & Sau (Before/After Comparative View)**:
   - Thẻ hiển thị song song 2 ảnh cùng góc chụp:
     - **TRƯỚC (BEFORE - Thời điểm phát hiện)**: `18/08/2026 07:15` | Ảnh xe tải không phủ bạt làm rơi vãi đất cát.
     - **SAU (AFTER - Thời điểm tái kiểm 24h - 48h)**: `19/08/2026 17:30` | Ảnh công trường đã lắp dàn phun sương dập bụi và quét dọn mặt đường.
2. **Con Dấu Xác thực Toàn vẹn Số (Tamper-Evident SHA-256 Digital Stamp)**:
   - *Mã băm EXIF*: `SHA-256: 9f241f48a9b23c5e88d107a6...`
   - *Metadata định vị*: `GPS: 10.8982°N, 106.7725°E (Độ chính xác: ±4.2m)`
   - *Microcopy*: `"Ảnh chụp gốc được niêm phong điện tử qua Web Crypto API, bảo đảm tính xác thực và khả năng truy vết."`
3. **Phân loại Kết quả Đối chứng 3 Trạng thái**:
   - 🟢 **TỐT HƠN (BETTER)**: `"Đã dập bụi / Đã che chắn đúng quy định"` (Nền `#ECFDF3`, Chữ `#027A48`)
   - 🟡 **CHƯA ĐỔI (UNCHANGED)**: `"Vẫn còn bụi / Cần tiếp tục theo dõi"` (Nền `#FFFAEB`, Chữ `#B54708`)
   - 🔴 **XẤU HƠN (WORSE)**: `"Bụi gia tăng / Cần lập hồ sơ chuyển giao gấp"` (Nền `#FDECEA`, Chữ `#9F241F`)

---

### 🌱 Khối 3: Hành Động Xanh & Tích Lũy Giờ Tình Nguyện (Youth Action & Credits)

#### A. Mục tiêu & Tâm lý Thiết kế
Tạo động lực thực tế và lâu dài cho CLB sinh viên, đoàn viên thanh niên và cộng đồng thông qua việc ghi nhận công sức tình nguyện minh bạch, quy đổi tín chỉ ngoại khóa và điểm rèn luyện.

#### B. Thành phần Giao diện & Microcopy Chuẩn
1. **Chu trình 5 Bước Hành động Thực địa (5-Step Civic Action Loop)**:
   - `01. VẤN ĐỀ THẬT` → Điểm nóng có tọa độ GPS & ảnh xác thực.
   - `02. VIỆC CÓ THỂ LÀM` → Nhiệm vụ tuần tra kiểm tra 24h-48h.
   - `03. NGƯỜI THAM GIA` → CLB thanh niên & tình nguyện viên địa bàn.
   - `04. MINH CHỨNG SỐ` → Ảnh đối chứng gắn mã SHA-256.
   - `05. TÁC ĐỘNG THỰC` → Không khí sạch, an toàn cổng trường, tích lũy tín chỉ.
2. **Cấu trúc Thẻ Nhiệm Vụ 6 Yếu tố (Action Card Hierarchy)**:
   - `WHAT`: Tên nhiệm vụ cụ thể (VD: *"Chụp ảnh đối chiếu phun sương dập bụi sau 24h"*).
   - `WHERE`: Vị trí & khoảng cách (VD: *"Khu đô thị mới Cầu Giấy · Cách bạn 820m"*).
   - `WHEN`: Khung giờ thực hiện (VD: *"Trước 11:30 · Ngày mai"*).
   - `WHY IT MATTERS`: Ý nghĩa thực tiễn (VD: *"Bảo vệ hơn 1.200 học sinh trường tiểu học lân cận"*).
   - `PARTICIPANTS`: Tiến độ tuyển người (VD: *"5/6 bạn trẻ đã đăng ký"*).
   - `ACTION`: Nút bấm rõ ràng (`Nhận nhiệm vụ`).
3. **Cơ chế Tích lũy Giờ Tình nguyện & Tín chỉ Xanh**:
   - *Công thức quy đổi*: **20 giờ tình nguyện thực địa = 4.0 tín chỉ ngoại khóa / 100 điểm rèn luyện**.
   - *Tiến độ trực quan*: Thanh tiến trình hiển thị rõ `42.5 giờ tích lũy (Đạt 100% chỉ tiêu kỳ học)`.
   - *Chứng nhận Số A4*: Nút `"Xuất Giấy Chứng nhận A4"` tạo văn bản có chữ ký số và mã QR xác thực trực tuyến `https://dustguard.vn/verify-cert/DG-CERT-2026-XXXX`.

---

### 🤝 Khối 4: Kết Nối Hỗ Trợ Chuyển Tiếp Khi Cần (Transparent Civic Handoff)

#### A. Mục tiêu & Tâm lý Thiết kế
Cung cấp cầu nối văn minh, có chứng cứ xác thực giữa cộng đồng người dân và các đơn vị hữu quan (UBND Phường/Xã, Đội Thanh tra Môi trường, Ban Quản lý Dự án, Tổng đài 1022) khi vấn đề vượt quá khả năng tự điều chỉnh của hiện trường.

#### B. Thành phần Giao diện & Microcopy Chuẩn
1. **Bộ Hồ Sơ Chuyển Giao Số Hóa (Digital Handoff Dossier)**:
   - Tự động đóng gói:
     - Tóm tắt diễn biến vụ việc và chuỗi ảnh đối chứng Before/After.
     - Nhật ký đo lường và thời gian vi phạm kéo dài.
     - Trích dẫn quy chuẩn pháp luật liên quan (QCVN 05/18).
     - Kiến nghị giải pháp cụ thể (Lắp cầu rửa xe, phủ bạt kín 100%, phun nước 4 lần/ngày).
2. **Vòng Đời Chuyển Giao 5 Trạng thái (Handoff State Machine)**:
   - `1. CHUẨN BỊ (PREPARED)`: Dự thảo hồ sơ tổng hợp thông tin.
   - `2. ĐÃ GỬI (SENT)`: Đã chuyển tiếp qua Email / Hệ thống một cửa số.
   - `3. ĐÃ TIẾP NHẬN (ACKNOWLEDGED)`: Đơn vị tiếp nhận phản hồi, cam kết kiểm tra trong 48h.
   - `4. THEO DÕI (FOLLOW_UP_NEEDED)`: Cộng đồng tiếp tục tái kiểm tra hiện trường theo cam kết.
   - `5. ĐÓNG HỒ SƠ (CLOSED)`: Hiện trường đã hoàn tất khắc phục, đối chứng sạch bụi.
3. **Cam kết Phản hồi Minh bạch (48-Hour SLA Tracking)**:
   - *Microcopy*: `"Thời hạn phản hồi dự kiến: 48 giờ (Theo Quy chế phối hợp tiếp nhận phản ánh dân sự)"`.
   - *Thẻ Trạng thái*: `Đang trong hạn xử lý (Còn 28 giờ)` (Màu Teal) hoặc `Quá hạn phản hồi (Chuyển tiếp cấp cao hơn)` (Màu Amber).

---

## 📱 3. Tiêu chuẩn Kiểm thử Trực quan & Responsive (360px - Desktop)

1. **Mobile (360px - 430px)**:
   - Layout 1 cột với khoảng đệm an toàn `px-4 pb-safe`.
   - Bảng điều khiển chuyển thành Mobile Bottom Sheet tiện lợi khi mở chi tiết.
   - Không có thanh cuộn ngang ngoài ý muốn (`overflow-x-hidden`, `min-w-0`).
2. **Desktop (1024px+)**:
   - Layout phân tách 2 - 3 cột: Cột trái (Thông tin & Pháp lý), Cột giữa (Đối chứng & Hành động), Cột phải (Hồ sơ bàn giao & Tiến độ SLA).
   - Bản xem trước Dossier văn bản A4 chuẩn tỷ lệ trực quan.

---

## 🎯 4. Bảng Tra Cứu Nhanh Microcopy SSOT (UI Vocabulary)

| Ngữ cảnh | Microcopy Chuẩn (Nên dùng) | Cụm từ Cần Tránh (Không dùng) | Lý do |
|---|---|---|---|
| **Bản chất hệ thống** | `Ghi nhận & Đối chứng Môi trường` | *Xử phạt ô nhiễm / Bắt lỗi công trình* | Tránh gây hiểu nhầm hệ thống là cơ quan tư pháp |
| **Hồ sơ vụ việc** | `Hồ sơ Theo dõi Điểm nóng` | *Đơn thư khiếu nại tố cáo* | Tôn vinh tinh thần hợp tác xây dựng cộng đồng |
| **Đánh giá rủi ro** | `Điểm Ưu tiên Can thiệp (CPS)` | *Mức độ phạm tội / Điểm xử phạt* | Là điểm gợi ý mức độ ưu tiên, không phải phán quyết |
| **Kết quả kiểm tra** | `Đối chứng Hiện trạng Trước/Sau` | *Bằng chứng bắt quả tang* | Khách quan, trung thực, khoa học |
| **Tình nguyện viên** | `Nhận nhiệm vụ thực địa` | *Làm công việc được giao* | Tăng tính chủ động và tinh thần cống hiến thanh niên |
| **Nút bấm chính** | `Ghi nhận mới` / `Bàn giao` | *Bấm vào đây để gửi dữ liệu* | Ngắn gọn, súc tích (<= 3 từ) |
