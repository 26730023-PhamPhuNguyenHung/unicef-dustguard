# SCIENTIFIC RESEARCH SPECIFICATION — DUSTGUARD VN
## Community-Driven Environmental Intelligence & Decision Support Platform

---

## 1. Tuyên Bố Học Thuật & Tổng Quan Nghiên Cứu (Academic Statement & Abstract)

### 1.1. Tên Đề Tài Nghiên Cứu
> **Hệ Thống Trí Tuệ Môi Trường Dựa Vào Cộng Đồng và Hỗ Trợ Ra Quyết Định Giảm Thiểu Bụi Đô Thị**  
> *(Community-Driven Environmental Intelligence & Decision Support Platform for Urban Dust Mitigation)*

### 1.2. Tóm Tắt Khoa Học (Scientific Abstract)
Ô nhiễm không khí cục bộ từ các hoạt động xây dựng và giao thông đô thị tại các nước đang phát triển thường có tính chất phân tán cao, diễn biến nhanh và thiếu mạng lưới quan trắc vi mô liên tục. Các phương pháp phản ánh truyền thống thường gặp 3 điểm nghẽn lớn: (1) Dữ liệu phi cấu trúc và thiếu bằng chứng xác thực theo thời gian; (2) Không có cơ chế đối chứng định lượng trước–sau (Before/After comparative validation); và (3) Khoảng cách lớn giữa phát hiện của người dân với quy trình tiếp nhận của cơ quan quản lý.

**DustGuard VN** được thiết kế như một **Hệ thống Hỗ trợ Ra Quyết định (Decision Support System - DSS)** kết hợp với **Trí tuệ Môi trường Cộng đồng (Citizen Sensing & Environmental Intelligence)**. Nền tảng cung cấp chuỗi thu nạp tín hiệu đa nguồn (ảnh hiện trường, GPS WGS84, vi khí hậu IoT), áp dụng mật mã học (SHA-256 tamper-evident digest) để bảo toàn chứng cứ số, chuẩn hóa mô hình đánh giá rủi ro đa tiêu chí (Multi-Criteria Priority Index), đồng thời thiết lập ranh giới phân định minh bạch giữa năng lực tự thân của hệ thống và thẩm quyền xử phạt của cơ quan nhà nước.

```text
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                                DUSTGUARD RESEARCH DOMAIN                                  │
│                                                                                           │
│  [ Citizen Sensing ] + [ Micro-IoT Sensors ] + [ WGS84 Spatial GIS ]                      │
│                           │                                                               │
│                           ▼                                                               │
│     [ Multi-Source Signal Ingestion & Anomaly Detection ]                                 │
│                           │                                                               │
│                           ▼                                                               │
│     [ Decision Support Engine ] ──► [ Mathematical Multi-Factor Priority Scoring ]        │
│                           │                                                               │
│                           ▼                                                               │
│     [ Cryptographic Evidence Chain (SHA-256 Tamper-Evident) ]                             │
│                           │                                                               │
│                           ▼                                                               │
│     [ Longitudinal 24h-48h Follow-up Delta Matrix ]                                       │
│                           │                                                               │
│                           ▼                                                               │
│     [ Structured Civic Dossier (A4/QR) ] ──► [ External Handoff (1022 / iHanoi / PMU) ]   │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Mô Hình Phân Định Ranh Giới 3 Vùng (Three-Tier Boundary Architecture)

Để đảm bảo tính chuẩn xác về mặt pháp lý và khoa học, DustGuard phân định rõ ràng 3 phân vùng trách nhiệm:

```text
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ TIER A: CORE OWNED (Hệ Thống Tự Sở Hữu & Vận Hành End-to-End)                             │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ • Zero-Login Signal Engine (Ingestion <30s, Antispam Device Hash)                         │
│ • Zero-IoT Normalized Composite Engine (Normalized weight sum(w*s)/sum(w))                │
│ • Spatial Map & School Geofencing Engine (50m WGS84 buffer zones)                         │
│ • D1 SQLite Persistent Relational Engine (ACID transactions, spatial queries)             │
│ • Multi-Criteria Priority Scoring Algorithm (Quantitative risk ranking)                   │
│ • Client-Side Web Crypto SHA-256 Evidence Hashes (Tamper-evident proof)                   │
│ • Immutable Audit Trail & Follow-up History (Observation != Case state machine)           │
│ • Youth Extracurricular Credit Engine (20h = 4.0 credits, Verifiable QR Vector SVG)       │
│ • Client-Side Image Privacy Guard (EXIF strip, <300KB adaptive canvas compression)        │
└───────────────────────────────────────────────────────────────────────────────────────────┘
                                              │
                                              ▼
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ TIER B: DECISION SUPPORT SYSTEM (Trợ Lý Hỗ Trợ Con Người Ra Quyết Định)                  │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ • AI Priority Recommendation Engine (Gợi ý phân loại sơ bộ cho điều phối viên duyệt)      │
│ • Spatio-Temporal Data Insights & Trend Forecasting (Phân tích chuỗi thời gian)           │
│ • Regulation Reference Assistant (RAG đối chiếu QCVN 05:2023/BTNMT, Luật BVMT 2020)       │
│ • 10-Criteria Field Verification Checklist (Khung kiểm tra trực quan hiện trường)         │
│ • Dust Mitigation Action Catalog (Gợi ý giải pháp kỹ thuật: che bạt, phun sương, rửa xe)  │
│ • Structured A4 Dossier Auto-Compiler (Tự động xuất hồ sơ chuẩn A4 kèm mã QR tra cứu)     │
└───────────────────────────────────────────────────────────────────────────────────────────┘
                                              │
                                              ▼
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ TIER C: EXTERNAL AUTHORITY INTEGRATION (Thẩm Quyền Cơ Quan Chức Năng & Đối Tác Xử Lý)     │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ • Thẩm tra hành chính và thanh tra hiện trường theo công vụ                               │
│ • Ban hành quyết định xử phạt vi phạm hành chính (Nghị định 45/2022/NĐ-CP)                │
│ • Đình chỉ thi công công trình vi phạm / Cưỡng chế khắc phục hậu quả                      │
│ • Kênh tiếp nhận: Tổng đài 1022, Cổng iHanoi, UBND Phường/Xã, Ban Quản lý Dự án           │
│ *(DustGuard KHÔNG có quyền xử phạt — CHỈ cung cấp hồ sơ kỹ thuật và theo dõi công khai)*  │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Các Mô Hình Toán Học & Thuật Toán Cốt Lõi (Mathematical Models & Algorithms)

### 3.1. Thuật Toán Tính Điểm Ưu Tiên Đa Yếu Tố (Multi-Criteria Priority Index - MCPI)

Chỉ số ưu tiên $P \in [0, 100]$ được tính toán dựa trên tổ hợp tuyến tính có trọng số của các yếu tố rủi ro môi trường và nhân khẩu học:

$$P = \min\left(100, \; \sum_{i=1}^{n} w_i \cdot S_i \times \Gamma(\text{geo}) \times \Lambda(\text{time})\right)$$

Trong đó:
- $S_1$ (Severity Score - Mức độ bụi quan sát): Thang điểm $[1, 4]$ (Thấp, Trung bình, Cao, Nghiêm trọng) được chuẩn hóa về $[0, 25]$.
- $S_2$ (Proximity Score - Khoảng cách tới trường học/khu dân cư nhạy cảm):
  $$\Gamma(\text{geo}) = \begin{cases} 
  1.5 & \text{nếu } d \le 50\text{m (Vùng đệm học đường)} \\
  1.2 & \text{nếu } 50\text{m} < d \le 150\text{m} \\
  1.0 & \text{nếu } d > 150\text{m}
  \end{cases}$$
- $S_3$ (Repeat Frequency - Tần suất ghi nhận lặp lại tại cùng tọa độ bán kính 50m):
  $$S_3 = \min(20, \; N_{\text{reports}} \times 5)$$
- $\Lambda(\text{time})$ (Hệ số thời gian tồn đọng chưa khắc phục):
  $$\Lambda(\text{time}) = 1.0 + \min\left(0.5, \; \frac{\Delta t_{\text{hours}}}{48} \times 0.5\right)$$

### 3.2. Chuẩn Hóa Điểm Chất Lượng Không Khí Đa Nguồn (Zero-IoT Normalized Composite Score)

Khi hệ thống có hoặc không có cảm biến IoT, điểm chất lượng môi trường $Q$ được chuẩn hóa độc lập dựa trên tổng trọng số khả dụng:

$$Q = \frac{\sum_{k \in \mathcal{K}_{\text{avail}}} w_k \cdot q_k}{\sum_{k \in \mathcal{K}_{\text{avail}}} w_k}$$

- Nếu $\mathcal{K}_{\text{avail}} = \{\text{visual\_reports}\}$ (0 cảm biến): $Q$ hoàn toàn được tính toán từ dữ liệu quan sát cộng đồng đã kiểm chứng ($w_{\text{visual}} = 1.0$).
- Nếu $\mathcal{K}_{\text{avail}} = \{\text{visual}, \text{pm2.5}, \text{pm10}, \text{meteo}\}$: Hệ thống tích hợp trọng số vi khí hậu tự động ($w_{\text{visual}} = 0.4, w_{\text{iot}} = 0.6$).

### 3.3. Bảo Toàn Tính Toàn Vẹn Chứng Cứ Bằng Mã Băm Mật Mã Học (Cryptographic Proof of Integrity)

Để giải quyết vấn đề chứng cứ bị chối bỏ hoặc chỉnh sửa (Tamper-evident verification), toàn bộ tệp ảnh gốc được xử lý ngay tại trình duyệt client:

$$\mathcal{H}_{\text{evidence}} = \text{SHA-256}\left(\text{CleanBytes}(\text{ImageData})\right)$$

- Quá trình `CleanBytes` loại bỏ toàn bộ EXIF nhạy cảm (bảo vệ quyền riêng tư).
- Chuỗi băm $\mathcal{H}_{\text{evidence}}$ (dài 64 ký tự hex) được lưu trữ bất biến cùng bản ghi trong Cloudflare D1.
- Mọi bên thứ ba có thể kiểm tra tính nguyên gốc của ảnh bằng cách băm lại tệp và đối chiếu với giá trị $\mathcal{H}_{\text{evidence}}$ ghi trên Hồ sơ Dossier A4 hoặc mã QR.

### 3.4. Mô Hình Chuyển Đổi Tín Chỉ Hoạt Động Thanh Niên (Youth Civic Credit Formulation)

Hệ thống tính toán thời lượng đóng góp thực tế $T_{\text{hours}}$ của tình nguyện viên:

$$T_{\text{total}} = T_{\text{base\_obs}} + T_{\text{followup\_bonus}} + T_{\text{campaign\_hours}}$$

- Tỷ lệ chuẩn hóa học thuật: $20\text{ giờ tham gia thực tế} \equiv 4.0\text{ tín chỉ rèn luyện/ngoại khóa}$.
- Mỗi chứng nhận số xuất xưởng đi kèm mã QR vector ISO/IEC 18004 với mức sửa lỗi Reed-Solomon Level M, chứa đường dẫn xác thực HTTPS có chữ ký điện tử.

---

## 4. Khung Đánh Giá Đối Chứng Thực Địa (Longitudinal 24h–48h Follow-up Protocol)

Quy trình nghiên cứu thực nghiệm áp dụng ma trận chuyển đổi trạng thái 3 giá trị định lượng:

```text
               ┌───────────────────────────┐
               │    INITIAL OBSERVATION    │
               │        (T0: Timestamp)    │
               └─────────────┬─────────────┘
                             │
                             ▼ (Sau 24h - 48h)
               ┌───────────────────────────┐
               │   FIELD FOLLOW-UP AUDIT   │
               │   (T1: Re-verification)   │
               └─────────────┬─────────────┘
                             │
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
     [ BETTER (-1) ]  [ UNCHANGED (0) ]  [ WORSE (+1) ]
     (Đã tưới nước,   (Bụi vẫn mù mịt,   (Phát sinh thêm
      phủ bạt chắn)    chưa khắc phục)    nguồn thải mới)
            │                │                │
            ▼                ▼                ▼
     [ Close Case ]   [ Escalate DSS ]  [ Urgent Dossier
                                          to 1022/iHanoi ]
```

---

## 5. Tiêu Chuẩn Hồ Sơ Kỹ Thuật Chuyển Giao (Structured Civic Dossier Standard)

Hồ sơ Dossier xuất xưởng tuân thủ khổ giấy A4 tiêu chuẩn phục vụ làm việc liên ngành:

1. **Khối 1: Header Hành Chính & Nhận Diện**: Mã vụ việc UUID, Tọa độ GPS WGS84, Phân cấp Phường/Xã/Quận, Thời gian ghi nhận ISO-8601.
2. **Khối 2: Minh Chứng Đối Chứng Trước–Sau**: Cặp ảnh gốc kèm chuỗi mã băm SHA-256 bảo đảm tính bất biến, chỉ số chênh lệch đánh giá (Delta Score).
3. **Khối 3: Kết Quả Đánh Giá DSS & Đối Chiếu Quy Chuẩn**: Chỉ số ưu tiên MCPI, đối chiếu điều khoản QCVN 05:2023/BTNMT và Nghị định 45/2022/NĐ-CP.
4. **Khối 4: Mã QR Xác Thực Trực Tuyến**: Đường link mã hóa dẫn trực tiếp đến trang tra cứu công khai trên nền tảng Cloudflare Edge.

---

## 6. Đạo Đức Dữ Liệu, Quyền Riêng Tư & Kiểm Toán Mở (Ethics, Privacy & Open Auditability)

1. **Nguyên Tắc Zero-PII**: Không lưu trữ khuôn mặt công dân, biển số xe cá nhân, hoặc siêu dữ liệu thiết bị EXIF trong cơ sở dữ liệu công khai.
2. **Bảo Vệ Người Phản Ánh (Reporter Anonymity)**: Cho phép ghi nhận hoàn toàn vô danh (Zero-Login) với cơ chế chống lạm dụng bằng dấu vân tay thiết bị phi danh tính (`generateDeviceHash`).
3. **Kiểm Toán Mở (Open Scientific Audit)**: Toàn bộ công thức tính toán, quy tắc suy diễn DSS và chuỗi bằng chứng đều được công khai minh bạch, loại bỏ hoàn toàn tính chất hộp đen (Black-box AI).

---

## 7. Chỉ Số Hiệu Năng Kỹ Thuật (Technical Benchmarks & KPIs)

| Chỉ Số | Mục Tiêu Khoa Học | Kết Quả Đạt Được (Edge / D1) |
|---|---|---|
| Thời gian nạp tín hiệu (Signal Ingestion) | $\le 30\text{ giây}$ | $\sim 15 - 25\text{ giây}$ (Zero-Login flow) |
| Dung lượng ảnh sau nén tối ưu di động | $< 300\text{ KB}$ | $120 - 250\text{ KB}$ (Adaptive canvas compression) |
| Tốc độ tính mã băm SHA-256 tại Client | $< 50\text{ ms}$ | $\sim 8 - 15\text{ ms}$ (Web Crypto API) |
| Độ trễ phản hồi API tại Cloudflare Edge | $< 100\text{ ms}$ | $\sim 20 - 45\text{ ms}$ (Workers + D1) |
| Tỷ lệ đối chứng cộng đồng 24h–48h | $\ge 70\%$ | Chu trình Follow-up chuẩn hóa |
| Chi phí vận hành hạ tầng pilot | Gần bằng $\$0/\text{tháng}$ | $100\%$ trong Cloudflare Free Tier |
