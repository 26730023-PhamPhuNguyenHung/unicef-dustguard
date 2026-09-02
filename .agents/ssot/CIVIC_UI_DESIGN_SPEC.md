# DUSTGUARD VN — CIVIC UI/UX DESIGN SPECIFICATION & MICROCOPY SSOT

> **Phiên bản**: 2.1 (Action & Outcome-Centric Standard)  
> **Trục định vị**: $\mathbf{SIGNAL} \longrightarrow \mathbf{UNDERSTAND} \longrightarrow \mathbf{ROUTE} \longrightarrow \mathbf{ACTION} \longrightarrow \mathbf{FOLLOW\text{-}UP} \longrightarrow \mathbf{VERIFY} \longrightarrow \mathbf{OUTCOME}$  
> **Slogan**: *"Phát hiện vấn đề. Chuyển đúng người. Theo dõi đến kết quả."*  
> **Trạng thái**: SSOT Hiệu lực toàn hệ thống  

---

## 🎨 1. Quy Chuẩn Hệ Thống Thiết Kế & Ngôn Ngữ Giao Diện (Design Tokens)

### 1.1 Bảng Màu Tương Phản Cao (High-Contrast Civic Palette)
Tuyệt đối tuân thủ nguyên tắc: **Nền sáng thì chữ đậm, nền đậm thì chữ sáng**. Đạt chuẩn tiếp cận WCAG 2.2 AAA (tỷ lệ tương phản văn bản chính > 7:1) giúp đọc rõ ràng ngay cả ngoài trời nắng gắt.

| Vai trò Thiết kế | Token CSS | Mã Hex | Tên màu | Mô tả Ứng dụng Thực tế |
|---|---|---|---|---|
| **Nền Canvas chính** | `--color-bg-canvas` | `#FDFBF7` | Warm Cream | Nền bao quát toàn trang, body, containers, modal backdrop |
| **Nền Card / Bề mặt** | `--color-bg-surface` | `#FFFFFF` | Pure White | Thẻ card, bảng dữ liệu, form nhập liệu, panel chi tiết |
| **Chữ Chính (Primary Text)** | `--color-text-primary` | `#231B14` | Deep Ink | Tiêu đề chính, nhãn form, số liệu đo lường, nội dung cốt lõi |
| **Chữ Phụ (Secondary Text)**| `--color-text-secondary`| `#5C5550` / `#7E7771` | Muted Ink | Đoạn giải thích, thời gian, metadata phụ trợ |
| **Thương hiệu & Con dấu Đỏ**| `--color-brand-primary` | `#9F241F` | Official Seal Red| Nút CTA chính (Primary Button), cảnh báo P1 khẩn cấp, con dấu số |
| **Hành động Xanh / Civic Teal**| `--color-accent-teal` | `#0D6F64` | Civic Teal | Nút hành động phối hợp, trạng thái Đang theo dõi, Đã hoàn thành |
| **Cảnh báo / Giám sát (Amber)**| `--color-warning` | `#B45309` | Warning Amber | Trạng thái cần tái kiểm tra, điểm nóng cảnh giác cao P2 |
| **Đường viền (Border)** | `--color-border-subtle` | `#E7DFD3` | Warm Sand | Viền card, phân tách danh sách, viền ô nhập liệu |

### 1.2 Nguyên Tắc "Zero Glassmorphism" & Đổ Bóng Khối Đặc
1. **Cấm tuyệt đối Glassmorphism**: Không sử dụng `backdrop-blur-*`, không dùng màu trong suốt mờ ảo (`bg-white/30`). Nền mọi thành phần phải là mảng màu đặc (`#FFFFFF` hoặc `#FDFBF7`) với đường viền xác định (`border border-[#161313]/10`).
2. **Đổ bóng Khối rõ nét (Crisp Shadows)**:
   - Card phẳng mặc định: `box-shadow: 0 1px 3px rgba(35, 27, 20, 0.06), 0 1px 2px rgba(35, 27, 20, 0.04);`
   - Hover card / Dialog nổi: `box-shadow: 0 4px 12px rgba(35, 27, 20, 0.05);`

### 1.3 Quy Chuẩn Vùng Chạm & Typography Tiếng Việt
- **Touch Target WCAG 2.2**: Mọi nút bấm (Button), Tab, Select, Checkbox phải có vùng chạm tối thiểu **44px x 44px** (`min-h-[44px] min-w-[44px]`).
- **Khoảng cách dòng Tiếng Việt**: Line-height luôn duy trì `1.5 - 1.65` để tránh đè và nghẹt dấu tiếng Việt.
- **Quy tắc Nút Bấm SSOT**:
  - **Nút Chính (Primary CTA)**: Nền đỏ con dấu `#9F241F`, chữ **TRẮNG TINH `#FFFFFF`**, nhãn tối đa 3 từ (`Gửi phản ánh`, `Giao việc`, `Nghiệm thu`).
  - **Nút Phụ (Secondary CTA)**: Nền trắng `#FFFFFF`, chữ mực đậm `#161313`, viền `#E7DFD3`, hover chuyển kem sáng `#F8F1E2`.

---

## 🏛️ 2. Bảy Bước Tác Nghiệp Chuẩn Hóa Trên Giao Diện (Core 7-Step Lifecycle UI)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 DUSTGUARD VN PLATFORM                                  │
├───────────────┬────────────────┬──────────────┬──────────────┬───────────┬─────────────┤
│ 1. SIGNAL     │ 2. UNDERSTAND  │ 3. ROUTE     │ 4. ACTION    │ 5. VERIFY │ 6. OUTCOME  │
├───────────────┼────────────────┼──────────────┼──────────────┼───────────┼─────────────┤
│ • Ảnh thực địa│ • Lý do ưu tiên│ • Giao đúng  │ • Phun sương │ • Tái kiểm│ • Nghiệm thu│
│ • GPS <50m    │ • NeedsAtten-  │   người      │   dập bụi    │   24h-48h │   đóng case │
│ • Cảm biến mở │   tionReasons  │ • Hạn SLA    │ • Nộp ảnh    │ • QCVN 18 │ • Đạt chuẩn │
│ • Băm SHA-256 │ • Gần trường   │   24h-48h    │   After      │ • PM2.5 an│ • QR công   │
│               │   học / PM cao │              │   Geofence   │   toàn    │   khai      │
└───────────────┴────────────────┴──────────────┴──────────────┴───────────┴─────────────┘
```

---

### 📘 Bước 1 & 2: Tạo Tín Hiệu & Hiểu Vấn Đề (Signal & Understand)

#### A. Mục tiêu & Tâm lý Thiết kế
Giúp người dân gửi nhanh phản ánh trong 30 giây và giúp cán bộ hiểu ngay tại sao vụ việc này cần chú ý mà không cần đọc những bản báo cáo phức tạp.

#### B. Thành phần Giao diện Chuẩn
1. **Khối Lý Do Cần Chú Ý (`NeedsAttentionReasons`)**:
   - Thay thế việc phô diễn điểm số `92/100` đơn độc bằng danh sách lý do cụ thể con người hiểu được:
     - • *4 phản ánh của người dân trong 24 giờ qua*
     - • *Nằm trong bán kính 80m gần trường Tiểu học An Phú*
     - • *Nồng độ bụi PM2.5 tăng đột biến trong 2 giờ qua (142 µg/m³)*
     - • *Chưa có cán bộ tiếp nhận khảo sát*
2. **Thẻ Tham Chiếu Quy Chuẩn Kỹ Thuật**:
   - `QCVN 05:2023/BTNMT` (Chất lượng không khí), `QCVN 18:2021/BXD` (An toàn che chắn thi công), `Nghị định 45/2022/NĐ-CP` (Chế tài bảo vệ môi trường).

---

### 📷 Bước 3 & 4: Điều Phối & Hành Động Khắc Phục (Route & Action)

#### A. Mục tiêu & Tâm lý Thiết kế
Giao đúng người có trách nhiệm (Cán bộ địa bàn hoặc Nhà thầu thi công), có hạn chót cụ thể và hướng dẫn biện pháp khắc phục rõ ràng.

#### B. Thành phần Giao diện Chuẩn
1. **Bảng Điều Phối Việc Tiếp Theo (`NextActionPanel`)**:
   - Hiển thị rõ: *Việc cần làm tiếp theo* (VD: "Lắp đặt lưới chắn bụi và xe tưới nước rửa đường"), *Người phụ trách* ("Chỉ huy trưởng Gói thầu XL-02"), *Hạn chót* ("16:00 Hôm nay - Còn 4 giờ").
2. **Form Nộp Minh Chứng Đối Chứng After**:
   - Tích hợp đo khoảng cách Geofence GPS (<50m), tính mã băm SHA-256 chống làm giả và chọn biện pháp dập bụi đã thực hiện.

---

### 🔍 Bước 5 & 6: Tái Kiểm Thực Địa & Nghiệm Thu Đóng Vụ Việc (Verify & Outcome)

#### A. Mục tiêu & Tâm lý Thiết kế
Giải quyết dứt điểm tình trạng "phản ánh xong bị trôi mất". Vụ việc chỉ được đóng khi có kiểm tra lại thực tế sau 24h-48h đạt chuẩn.

#### B. Thành phần Giao diện Chuẩn
1. **Khung Đối Chứng Trước / Sau (Before / After Comparison)**:
   - Hiển thị song song ảnh Before (lúc phát hiện) và After (sau khi khắc phục) cùng tọa độ và tem thời gian.
2. **Biên Bản Nghiệm Thu & Đóng Vụ Việc**:
   - Checklist 10 tiêu chuẩn QCVN 18:2021/BXD.
   - Nồng độ PM2.5 đo lại tại hiện trường (Ví dụ: Giảm từ 142 xuống 28 µg/m³ - Đạt chuẩn).
   - Nút *"Duyệt Hoàn Tất & Đóng Vụ Việc"* hoặc *"Yêu Cầu Làm Lại"* nếu hiện trường chưa đạt.

---

## 🎯 3. Bảng Tra Cứu Nhanh Microcopy SSOT (UI Vocabulary)

| Ngữ cảnh | Microcopy Chuẩn (Nên dùng) | Cụm từ Cần Tránh (Không dùng) | Lý do |
|---|---|---|---|
| **Bản chất hệ thống** | `Phát hiện vấn đề. Chuyển đúng người. Theo dõi đến kết quả.` | *AI Dust Risk Scoring Platform / Hệ thống xử phạt ô nhiễm* | Trọng tâm là giải quyết việc, không phải chấm điểm phán xét |
| **Hồ sơ vụ việc** | `Vụ việc` (`Case`) / `Hồ sơ A4` (`Dossier`) | *Ticket / Incident / Complaint / Bắt lỗi* | Thống nhất thuật ngữ tiếng Việt chuẩn |
| **Đánh giá rủi ro** | `Mức độ ưu tiên` (Kèm lý do cụ thể) | *Điểm vi phạm 92/100 / Nguy cơ nguy hiểm* | Điểm số là supporting signal, không phải kết luận vi phạm |
| **Kết quả kiểm tra** | `Tái kiểm thực địa` & `Đối chứng Trước/Sau` | *Bắt quả tang / Xử phạt* | Khách quan, trung thực, khoa học |
| **Tình nguyện viên** | `Nhận nhiệm vụ khảo sát` | *Làm công việc được giao* | Tăng tính chủ động và tinh thần cống hiến thanh niên |
| **Nút bấm chính** | `Gửi phản ánh` / `Giao việc` / `Nghiệm thu` | *Bấm vào đây để gửi dữ liệu* | Ngắn gọn, súc tích (<= 3 từ) |
