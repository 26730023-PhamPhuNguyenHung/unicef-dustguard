# PRODUCT SSOT — DUSTGUARD VN
## Environmental Intelligence & Decision Support Platform

---

## 1. Canonical Product Statement
> **DustGuard VN là nền tảng Trí tuệ Môi trường Dựa vào Cộng đồng và Hỗ trợ Ra Quyết định (Community-driven Environmental Intelligence & Decision Support Platform), giúp thanh niên và công dân ghi nhận hiện trường bằng chứng số có cấu trúc, phân tích nguy cơ ô nhiễm không gian - thời gian, đối chứng chu trình 24h–48h, và chuyển giao hồ sơ kỹ thuật chuẩn hóa tới các cơ quan và đơn vị có thẩm quyền xử lý.**  
> *(Bụi công trình và vi khí hậu xung quanh trường học/khu dân cư là use case thực chứng đầu tiên).*

---

## 2. Bản Chất Sản Phẩm: Trưởng Thành Khoa Học, Không Pivot (Scientific Maturity)
- **Khởi nguồn**: DustGuard bắt đầu từ một thử nghiệm CivicTech về bụi công trình, kết hợp cảm biến vi khí hậu + dữ liệu cộng đồng thanh niên + thuật toán phân tích để biến các quan sát rời rạc thành dữ liệu môi trường có cấu trúc.
- **Trưởng thành khoa học**: Nhóm củng cố mô hình nghiên cứu thành một **Hệ thống Hỗ trợ Ra Quyết định (Decision Support System - DSS)** hoàn chỉnh. DustGuard phân định tuyệt đối ranh giới giữa những gì hệ thống tự xử lý bằng công nghệ/toán học và những gì thuộc thẩm quyền can thiệp của cơ quan nhà nước.
- **Thesis cốt lõi**: Ô nhiễm không khí đô thị và bụi thi công cần một chuỗi dữ liệu minh bạch, có đối chứng khoa học (Before/After), được xác thực toàn vẹn bằng mật mã học (SHA-256 tamper-evident), nhằm cung cấp tri thức hành động cho cộng đồng và hồ sơ kỹ thuật đáng tin cậy cho cơ quan quản lý.

---

## 3. Ma Trận Phân Loại Tính Năng 3 Phân Vùng (Feature Classification Matrix)

Toàn bộ 100% tính năng và module trong DustGuard được phân định chính xác vào 3 nhóm ranh giới:

```text
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           DUSTGUARD VN PLATFORM                                   │
├─────────────────────────────────────┬─────────────────────────────────────────────┤
│  A. CORE OWNED                      │  B. DECISION SUPPORT                        │
│  (Hệ thống tự sở hữu & làm E2E)    │  (Trợ lý khoa học hỗ trợ con người ra QĐ)  │
│  ─────────────────────────────────  │  ────────────────────────────────────────── │
│  • Multi-source Signal Ingestion    │  • AI Priority Recommendation (Duyệt/Sửa)   │
│  • Zero-IoT Telemetry Normalization │  • Data Insights & Trend Forecasting        │
│  • Spatio-Temporal Anomaly Engine   │  • Regulation Reference Assistant (QCVN)    │
│  • WGS84 Spatial Map & Geofencing   │  • 10-Criteria Field Verification Checklist │
│  • D1 Persistent Relational Engine  │  • Dust Mitigation Action Recommendations   │
│  • Multi-factor Priority Algorithm  │  • Structured A4 Dossier Auto-Generator     │
│  • SHA-256 Tamper-evident Hashes    │                                             │
│  • Immutable Audit Trail            │                                             │
│  • Youth Credit & QR Verification   │                                             │
│  • Mobile Image Privacy Compressor  │                                             │
└─────────────────────────────────────┴─────────────────────────────────────────────┘
                                       │ (Chuyển giao hồ sơ kỹ thuật chuẩn hóa)
                                       ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│  C. EXTERNAL AUTHORITY (Thẩm quyền cơ quan chức năng & Đối tác xử lý)             │
│  ──────────────────────────────────────────────────────────────────────────────── │
│  • Thanh tra, kiểm tra công vụ và giám sát hiện trường hành chính                 │
│  • Ban hành quyết định xử phạt vi phạm hành chính / đình chỉ thi công              │
│  • Phán quyết pháp lý và kết luận chế tài cuối cùng                               │
│  • Kênh tiếp nhận: Tổng đài 1022, Cổng iHanoi, UBND Phường/Xã, Ban QLDA          │
│  *(DustGuard KHÔNG phán quyết - CHỈ chuyển giao Dossier A4/QR và theo dõi tiến độ)*│
└───────────────────────────────────────────────────────────────────────────────────┘
```

### Chi Tiết Phân Nhóm 3 Tầng:

### A. Nhóm Core Owned (Hệ thống tự sở hữu và thực hiện End-to-End)
1. **IoT Telemetry & Vi khí hậu (Zero-IoT Resilient)**: Thu nạp dữ liệu cảm biến bụi PM2.5/PM10, nhiệt độ, độ ẩm; chuẩn hóa điểm số ngay cả khi có 0 cảm biến (`sum(score * w) / sum(w)`).
2. **Signal Ingestion Engine**: Thu nhận phản ánh cộng đồng Zero-Login trong 30s, gắn tọa độ GPS, tem thời gian ISO-8601, lọc chống spam theo thiết bị (`generateDeviceHash`).
3. **Spatio-Temporal Anomaly Detection**: Thuật toán quét điểm nóng không gian, phát hiện cụm ô nhiễm bất thường gần trường học.
4. **Spatial Map Engine (GIS)**: Bản đồ WGS84, phân vùng hành chính (Tỉnh/Quận/Phường), Heatmap mật độ, tính năng Geofencing 50m bán kính bảo vệ học đường.
5. **D1 SQLite Storage Engine**: Cơ sở dữ liệu quan hệ bền vững Cloudflare D1/SQLite, cấu trúc quan hệ chặt chẽ, truy vấn không gian cục bộ, Zero-Mock SSOT.
6. **Multi-Factor Priority Scoring**: Thuật toán định lượng điểm ưu tiên từ mức độ bụi, khoảng cách trường học, thời gian tồn tại và số lượng phản ánh lặp lại.
7. **SHA-256 Evidence Integrity (Tamper-evident)**: Tính toán mã băm SHA-256 phía client (Web Crypto API) để bảo toàn tính toàn vẹn của chuỗi ảnh minh chứng.
8. **Immutable Audit Trail**: Ghi nhận lịch sử trạng thái, chuyển đổi vụ việc, đối chứng Before/After, phục vụ kiểm toán khoa học và cộng đồng.
9. **Youth Civic Credit & QR Engine**: Ghi nhận giờ tình nguyện thực địa (20h = 4.0 tín chỉ), phát hành mã QR xác thực chứng chỉ số độc lập.
10. **Privacy & Image Optimizer**: Tự động xóa sạch EXIF metadata nhạy cảm, nén thích ứng < 300KB cho mạng di động 3G/4G.

### B. Nhóm Decision Support (Hỗ trợ con người ra quyết định - AI as Assistant, Not Judge)
1. **AI Priority Recommendation**: Đề xuất sơ bộ mức ưu tiên (Khẩn cấp / Cao / Trung bình / Thấp) dựa trên phân tích hình ảnh và ngữ cảnh, hỗ trợ điều phối viên ra quyết định nhanh hơn.
2. **Data Insights & Trend Forecasting**: Cung cấp biểu đồ xu hướng ô nhiễm theo thời gian trong ngày, điều kiện thời tiết, hỗ trợ nhà trường và CLB lên kế hoạch hành động.
3. **Regulation Reference Assistant**: Trợ lý tra cứu nhanh đối chiếu Quy chuẩn kỹ thuật quốc gia (QCVN 05:2023/BTNMT), Luật Bảo vệ Môi trường 2020, Nghị định 45/2022/NĐ-CP về xử phạt vi phạm hành chính.
4. **10-Criteria Field Verification Checklist**: Cung cấp danh mục kiểm tra 10 tiêu chuẩn trực quan (che chắn bạt, tưới nước rửa đường, xe chở vật liệu có nắp đậy, máy móc xả khói đen,...) cho tình nguyện viên thực địa.
5. **Mitigation Action Recommendations**: Gợi ý các giải pháp khắc phục thực tế cho nhà thầu và cộng đồng (phun sương dập bụi, phủ bạt bãi tập kết cát đá, dọn bùn đất bánh xe trước khi ra khỏi công trường).
6. **Structured A4 Dossier Auto-Generator**: Tự động tổng hợp hồ sơ vụ việc chuẩn A4 (gồm chuỗi ảnh đối chứng Trước/Sau, bản đồ vị trí, mã băm SHA-256, mã QR tra cứu trực tuyến) để sẵn sàng bàn giao cho các bên liên quan.

### C. Nhóm External Authority (Thẩm quyền cơ quan chức năng & Đối tác xử lý)
1. **Thanh tra & Kiểm tra hiện trường chính thức**: Thuộc thẩm quyền của Thanh tra Sở Tài nguyên & Môi trường, Đội Thanh tra Xây dựng, UBND Phường/Xã.
2. **Ban hành Quyết định Xử phạt**: Thuộc thẩm quyền của Chủ tịch UBND các cấp hoặc Chánh Thanh tra chuyên ngành theo Nghị định 45/2022/NĐ-CP.
3. **Đình chỉ thi công hoặc cưỡng chế**: Do cơ quan quản lý nhà nước có thẩm quyền phê duyệt dự án và cấp phép xây dựng thực thi.
4. **Ranh giới bất biến của DustGuard**: DustGuard **KHÔNG** ban hành chế tài, không thay mặt cơ quan công quyền. DustGuard **CHỈ** chuyển giao hồ sơ kỹ thuật có cấu trúc (Structured Dossier A4/QR) sang các cổng tiếp nhận (Tổng đài 1022, Cổng iHanoi, BQLDA) và theo dõi trạng thái phản hồi công khai.

---

## 4. Bộ 7 Năng Lực Nền Tảng (Core Capability Stack)
```text
COMMUNITY ACTION + SPATIAL DATA + EVIDENCE + ENVIRONMENTAL KNOWLEDGE + CASE TRACKING + GREEN CREDITS + INTEGRATION
```
1. **Community Action**: Ghi nhận nhanh trong 30s (Zero-Login), khởi tạo chiến dịch khảo sát, phân công hành động cộng đồng.
2. **Spatial Data**: Tọa độ WGS84 chuẩn, phân vùng Phường/Xã/Quận, Heatmap điểm nóng, Geofencing 50m quanh trường học.
3. **Evidence Management**: Chuỗi ảnh đối chứng Trước/Sau (Before/After), mã băm SHA-256 tamper-evident, Hồ sơ số Dossier A4 kèm QR code tra cứu.
4. **Environmental Knowledge**: Cẩm nang nhận diện và giảm thiểu ô nhiễm, quy chuẩn kỹ thuật QCVN, AI trợ lý hỗ trợ phân loại sơ bộ và kiểm tra tính toàn vẹn (AI as Assistant).
5. **Case Tracking**: Ranh giới `Observation` != `Case`, chu trình Follow-up 24h-48h (`BETTER` / `UNCHANGED` / `WORSE`), theo dõi kết quả thực chất.
6. **Green Credits**: Giờ tình nguyện thực tế, xác thực lịch sử tham gia bằng QR và dữ liệu truy vết (việc quy đổi sang điểm rèn luyện hoặc tín chỉ do từng đơn vị giáo dục quyết định).
7. **Integration (Civic Handoff)**: Kết nối hồ sơ có cấu trúc sang các kênh xử lý hiện hữu (1022, iHanoi, Ban Quản lý Dự án, UBND Phường/Xã).

---

## 5. Ranh Giới Định Vị & Các Lớp Thành Phần (Boundaries & Building Blocks)
- **1022 / iHanoi**: Là **điểm tích hợp**, không phải định vị mới.
- **IoT / Cảm biến**: Là **nguồn dữ liệu bổ trợ** (Supplementary Data Source), không phải định vị. Hệ thống hoạt động 100% khi có 0 cảm biến (Zero-IoT Resilience).
- **AI**: Là **công cụ trợ lý hỗ trợ** (Assistant / Decision Support), không phải thẩm phán hay bộ máy xử phạt.
- **Staff Dashboard**: Là **workspace điều phối**, không phải định vị.
- **Green Credits**: Là **cơ chế khuyến khích**, không phải định vị.
- **Legal / Environmental Knowledge**: Là **lớp giúp người dùng hiểu và hành động đúng**, không phải định vị.

---

## 6. Bản Elevator Pitch 30 Giây (Locked SSOT)
> *"Khi một bạn trẻ nhìn thấy bụi từ một công trình gần trường học, vấn đề không chỉ là làm sao gửi một phản ánh. Điều khó hơn là ghi nhận đủ bằng chứng, theo dõi xem tình trạng có thay đổi và biết bước tiếp theo nên làm gì.*
> 
> *DustGuard là nền tảng Trí tuệ Môi trường & Hỗ trợ Ra Quyết định giúp cộng đồng ghi nhận vấn đề bằng ảnh, vị trí và dữ liệu đối chứng trước–sau; hỗ trợ hiểu vấn đề, duy trì lịch sử theo dõi và tạo một hồ sơ kỹ thuật có cấu trúc.*
> 
> *Khi cần sự can thiệp chính thức, DustGuard không thay thế các hệ thống hiện hữu mà hỗ trợ kết nối case tới những kênh như 1022, iHanoi hoặc đơn vị phù hợp. Bụi công trình là bài toán đầu tiên để chúng em kiểm chứng mô hình, trước khi mở rộng thành một nền tảng hành động xanh cho thanh thiếu niên và cộng đồng."*

---

## 7. Vận Hành Hạ Tầng & Bảo Mật Thực Địa (DevOps & Field Ops Invariants)
- **Chuẩn Hóa Chi Phí Hạ Tầng Pilot**:
  > *"Chi phí hạ tầng pilot có thể gần bằng 0 trong hạn mức miễn phí hiện tại của Cloudflare (ghi nhận khả năng phát sinh tên miền, email, dung lượng mở rộng khi scale)."*
  - Hệ thống ghi nhận minh bạch các khoản chi phí phát sinh thực tế: Tên miền tùy chỉnh (~$10–$25/năm), Dịch vụ Email giao dịch, và Chi phí dung lượng mở rộng khi scale vượt Cloudflare Free Tier.
- **Bảo Vệ Quyền Riêng Tư & Tối Ưu Mạng Di Động**:
  - **Xóa EXIF Tự Động**: Tự động loại bỏ toàn bộ siêu dữ liệu nhạy cảm (GPS cá nhân máy ảnh, serial thiết bị) trước khi tải lên.
  - **Nén Ảnh < 300KB**: Nén thích ứng trên trình duyệt xuống dưới 300KB để hoạt động mượt mà ngoài thực địa trên mạng di động 3G/4G yếu.
  - **Mã Băm Toàn Vẹn SHA-256**: Xác thực tính bất biến của hình ảnh chứng cứ mà không cần lưu trữ thông tin cá nhân của người chụp.
