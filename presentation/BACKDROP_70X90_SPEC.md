# DustGuard VN — Backdrop 70x90cm Print Specification & Layout Guide

> **Mục đích**: Tài liệu đặc tả kỹ thuật in ấn tiêu chuẩn công nghiệp và hướng dẫn bố cục cho Backdrop / Poster triển lãm khổ 700mm x 900mm tại Vòng Chung kết Cuộc thi Sáng kiến Đổi mới Xã hội & Môi trường UNICEF Hackathon 2026.

---

## 1. Thông Số Kỹ Thuật In Ấn (Print Specifications)

| Thông số | Giá trị chuẩn | Ghi chú kỹ thuật |
| :--- | :--- | :--- |
| **Kích thước thành phẩm (Trim Size)** | **700 mm × 900 mm** (70 cm × 90 cm) | Khổ poster đứng (Portrait orientation) |
| **Kích thước có tràn lề (Bleed Size)** | **706 mm × 906 mm** | Tràn lề **3 mm** mỗi cạnh để chống mép trắng khi cắt |
| **Vùng an toàn (Safety Margin)** | **670 mm × 870 mm** | Mọi nội dung text và icon cách mép cắt tối thiểu **15 mm** |
| **Độ phân giải (Resolution)** | **300 DPI** (Dots Per Inch) | Chuẩn in offset / kỹ thuật số chất lượng cao |
| **Kích thước pixel (Không bleed)** | **8,268 px × 10,630 px** | Tính theo công thức: (700/25.4)*300 × (900/25.4)*300 |
| **Kích thước pixel (Có 3mm bleed)**| **8,339 px × 10,701 px** | Tính theo công thức: (706/25.4)*300 × (906/25.4)*300 |
| **Hệ màu in ấn (Print Color Mode)** | **CMYK (FOGRA39 / Japan Color 2001 Coated)** | Đảm bảo không sai lệch màu sắc khi xuất phim/bản in |
| **Chất liệu in khuyến nghị** | **Decal PP ngoài trời cán màng mờ bồi Formex 5mm** | Màng mờ chống lóa đèn sân khấu; Formex cứng cáp đứng chân standee |

---

## 2. Bảng Màu Thương Hiệu Chuẩn (Color Palette SSOT)

| Tên màu | Hex Code | RGB | CMYK Chuẩn in ấn | Vai trò thiết kế |
| :--- | :--- | :--- | :--- | :--- |
| **Cream Background** | #FDFBF7 | 253, 251, 247 | **C0 M1 Y3 K1** | Nền chính Civic Tech, ấm, chống chói mắt |
| **Ink Dark (Text)** | #231B14 | 35, 27, 20 | **C60 M65 Y65 K75** | Màu chữ chính, độ tương phản AAA (> 14:1) |
| **Seal Red (Brand Accent)**| #9F241F | 159, 36, 31 | **C15 M95 Y90 K10** | Dấu ấn thương hiệu, tiêu đề phụ, điểm nhấn |
| **DustGuard Red** | #B51F24 | 181, 31, 36 | **C15 M95 Y90 K5** | Nút CTA, điểm số rủi ro cao, badge cảnh báo |
| **Civic Teal** | #0D6F64 | 13, 111, 100 | **C85 M25 Y55 K15** | Điểm nhấn kỹ thuật, hạ tầng, icon công nghệ |
| **Action Green** | #1E7E4E | 30, 126, 78 | **C80 M20 Y85 K10** | Bằng chứng đối soát thành công, nghiệm thu |
| **Alert Amber** | #B45309 | 180, 83, 9 | **C20 M70 Y100 K10** | Trạng thái đang xử lý, cảnh báo theo dõi |
| **Card Surface White** | #FFFFFF | 255, 255, 255 | **C0 M0 Y0 K0** | Bề mặt các thẻ hồ sơ, nền QR code |

---

## 3. Cấu Trúc Bố Cục 3 Tầng (20% – 60% – 20%)

Khổ đứng 700x900mm được chia theo tỷ lệ vàng trực quan giúp ban giám khảo và khách tham quan tiếp cận thông tin chỉ trong **5 giây đầu tiên**:

`
+-------------------------------------------------------------+  ---
|  [TẦNG 1: 20% - 180mm] HEADER & ĐỊNH VỊ THƯƠNG HIỆU         |   |
|  - Logo DustGuard VN & Slogan                               |  180mm (20%)
|  - Định vị Civic Tech: Giám sát · Hành động · Minh bạch     |   |
+-------------------------------------------------------------+  ---
|  [TẦNG 2: 60% - 540mm] LÕI GIẢI PHÁP & QUY TRÌNH THỰC ĐỊA   |   |
|  A. 5 Bước Đóng vòng hành động (Tín hiệu -> Tái kiểm)       |   |
|  B. Hồ sơ số Bằng chứng SHA-256 & Chuyển giao Cổng 1022     |  540mm (60%)
|  C. Đối soát Trước/Sau (Before/After: 142µg -> 28µg/m³)    |   |
|  D. Mô hình triển khai 3 trụ cột: Thanh niên - Thầu - Quản lý|   |
+-------------------------------------------------------------+  ---
|  [TẦNG 3: 20% - 180mm] CHỈ SỐ LEAN, QR CODE & KÊU GỌI       |   |
|  - 3 Chỉ số: Node IoT 0.5tr | Chu kỳ 24-48h | Cloud D1      |  180mm (20%)
|  - QR 1: Live Demo Web App  | QR 2: Thuyết minh Kỹ thuật   |   |
|  - Bản quyền UNICEF Hackathon 2026                          |   |
+-------------------------------------------------------------+  ---
`

---

### Chi Tiết Phân Bổ Nội Dung Từng Tầng:

#### 🏛️ TẦNG 1: Header & Nhận Diện Thương Hiệu (Chiều cao 180mm)
1. **Logo & Biểu Tượng**: Khiên bảo vệ môi trường DustGuard VN sắc nét, biểu trưng cho sự che chắn và minh bạch.
2. **Tiêu đề chính**: **DustGuard VN** (Font Sans Serif Be Vietnam Pro, ExtraBold 72pt).
3. **Slogan cốt lõi**: GIÁM SÁT BỤI · HÀNH ĐỘNG · MINH BẠCH (Font Semibold 24pt, màu Ink Dark).
4. **Định vị dự án**: *Nền tảng Civic Tech kết nối tín hiệu ô nhiễm bụi công trình thành hồ sơ số có bảo chứng SHA-256 và quy trình tái kiểm đóng vòng.*
5. **Huy hiệu đối tác**: Dự án tham dự Vòng Chung kết **UNICEF Hackathon 2026**.

#### ⚙️ TẦNG 2: Trọng Tâm Giải Pháp & Quy Trình Khép Kín (Chiều cao 540mm)
1. **Quy trình 5 bước khép kín (The 5-Step Closed Loop)**:
   - **Bước 1: Phát hiện (Detect)**: Cảm biến quang học mở & Phản ánh cộng đồng với GPS chính xác.
   - **Bước 2: Ưu tiên (Prioritize)**: Thang điểm **Dust Risk Score 0–100** có diễn giải khoa học.
   - **Bước 3: Hồ sơ số (Digital Dossier)**: Đóng gói ảnh hiện trường có tọa độ và băm **SHA-256** chống sửa đổi.
   - **Bước 4: Chuyển giao 1022 & Phân công (Dispatch)**: Liên thông trực tiếp Cổng thông tin 1022 / iHanoi & phân công Đội sinh viên xung kích.
   - **Bước 5: Tái kiểm 24h–48h (Reinspect & Close)**: Chụp ảnh đối chứng, kiểm tra dập bụi, đóng hồ sơ minh bạch.
2. **Khung Trực Quan Bằng Chứng Đối Soát (Interactive Case Showcase)**:
   - Hồ sơ mẫu: **#DG-2026-0842** (Đường Vành Đai 3, Cầu Giấy, Hà Nội).
   - **Hiện trạng ban đầu (T1)**: PM2.5 = 142 µg/m³, xe ben làm rơi vãi đất cát, SHA-256: 7f83b165...126d9069.
   - **Hiện trạng sau xử lý (T2 - 26h)**: PM2.5 = 28 µg/m³ (Đạt QCVN 05:2023), kích hoạt vòi phun sương và phủ bạt kín, SHA-256: 9f86d081...0f00a08.
   - Trạng thái liên thông: ĐÃ ĐỒNG BỘ CỔNG 1022 / iHANOI (#1022-HN-89421).

#### 📊 TẦNG 3: Chỉ Số Lean, QR Code & Kêu Gọi Hành Động (Chiều cao 180mm)
1. **3 Chỉ số kiểm chứng Lean Pilot**:
   - **≈ 0,5 triệu VNĐ**: Chi phí linh kiện 1 trạm đo vi cảm biến quang học mở (ESP32 + PM1/2.5/10).
   - **24h – 48h**: Chu kỳ tái kiểm hiện trường bắt buộc nhằm đảm bảo việc khắc phục đi vào thực chất.
   - **Serverless Edge**: Vận hành trên Cloudflare D1 SQLite chuẩn SSOT, độ trễ < 50ms, chi phí tối ưu.
2. **2 Khối Mã QR Vector Rõ Nét**:
   - **QR 1 (Trái)**: *Quét xem Live Demo Web App* (Dẫn tới ứng dụng di động cho Người dân & Cán bộ).
   - **QR 2 (Phải)**: *Quét tra cứu Hồ sơ Bằng chứng & Tài liệu Kỹ thuật*.
3. **Footer**: Bản quyền © 2026 DustGuard VN · Đồng hành cùng Thanh niên vì Không khí Sạch Việt Nam.

---

## 4. Hướng Dẫn Kỹ Thuật Render & In Ấn

1. Mở file presentation/backdrop_70x90_renderer.html bằng trình duyệt hiện đại (Chrome / Edge / Firefox).
2. Nhấn nút **'Xuất PNG Độ Phân Giải Cao (300 DPI)'** để máy tự render Canvas 8268x10630px siêu nét xuất trực tiếp cho xưởng in.
3. Hoặc nhấn **'In sang PDF (Vector 700x900mm)'** (phím tắt Ctrl + P), chọn *Save as PDF*, khổ giấy Custom 700mm x 900mm, lề None, bật *Background graphics*.
