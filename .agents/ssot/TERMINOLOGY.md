# SCIENTIFIC TERMINOLOGY & CIVIC LINGUISTICS SSOT — DUSTGUARD VN

> **Tài liệu SSOT**: Từ điển Thuật ngữ Khoa học & Ngôn ngữ Học Civic Tech (Scientific Terminology & Civic Linguistics SSOT)  
> **Định vị cốt lõi**: **Nền tảng Environmental Intelligence & Decision Support vì Hành động Cộng đồng**  
> *(Civic Environmental Intelligence & Decision Support Platform for Community Action)*  
> **Nguyên tắc nền tảng**: **100% Khiêm tốn — Khách quan — Khoa học — Kiến tạo Hợp tác**

---

## 🧭 1. Triết Lý Ngôn Ngữ & 4 Trụ Cột Định Vị (Core Linguistic Pillars)

DustGuard VN xác lập bộ nguyên tắc phát ngôn, văn phong giao diện và tài liệu kỹ thuật dựa trên 4 trụ cột không thể lay chuyển:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        TRIẾT LÝ NGÔN NGỮ KHOA HỌC DUSTGUARD VN                         │
├──────────────────────────┬───────────────────────────┬─────────────────────────────────┤
│ 1. KHIÊM TỐN (HUMBLE)    │ 2. KHÁCH QUAN (OBJECTIVE) │ 3. CHUẨN XÁC (SCIENTIFIC)       │
│ • Không phóng đại quyền  │ • Dữ liệu thực chứng      │ • Đúng quy chuẩn QCVN/ISO/NIST  │
│ • Không cam kết thay bên3│ • Không quy chụp cảm tính │ • Phân biệt rõ đo đạc & ước tính│
│ • Thừa nhận giới hạn tech│ • Ghi nhận chuyển biến    │ • Minh bạch sai số & điều kiện  │
├──────────────────────────┴───────────────────────────┴─────────────────────────────────┤
│ 4. KIẾN TẠO HỢP TÁC (CONSTRUCTIVE): Biến phản ánh thành hồ sơ đối thoại xây dựng       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

1. **Khiêm tốn (Humble Posture)**: Hệ thống không tự phong quyền lực nhà nước, không đóng vai thẩm phán hay cơ quan tài phán, không tự xưng là "bảo chứng tuyệt đối".
2. **Khách quan (Objective Evidence)**: Mọi thông tin ghi nhận là quan sát hiện trường (field observation), diễn biến theo thời gian (timeline), và hình ảnh đối chứng (Before/After) phản ánh hiện trạng trung thực.
3. **Chuẩn xác Khoa học (Scientific Rigor)**: Sử dụng chính xác các khái niệm đo lường môi trường (QCVN 05:2023/BTNMT), hệ quy chiếu không gian (WGS84 EPSG:4326), và tính toàn vẹn mật mã học (SHA-256 Tamper-evident digest).
4. **Hỗ trợ Ra Quyết định (Decision Support)**: AI và thuật toán phân tích đóng vai trò cung cấp ngữ cảnh, gợi ý ưu tiên và tổ chức thông tin để con người (thanh niên, cộng đồng, nhà thầu, cán bộ) đưa ra quyết định hành động tốt hơn.

---

## 🚫 2. Ma Trận Đối Chiếu Thuật Ngữ (Forbidden vs Recommended Terminology Matrix)

Dưới đây là bảng chuẩn hóa bắt buộc áp dụng trên toàn bộ mã nguồn, giao diện (UI Text), API response, thông báo (Toasts/Emails), tài liệu pitch và báo cáo kỹ thuật:

| Nhóm Lĩnh Vực | ❌ Thuật Ngữ Cấm / Lệch Chuẩn (Forbidden / Anti-Patterns) | ✅ Thuật Ngữ Chuẩn Khoa Học & Civic Tech (Recommended / Canonical) | Lý Do Khoa Học & Pháp Lý |
|---|---|---|---|
| **Định vị & Thẩm quyền** | • "Buộc công trình phải..."<br>• "Hệ thống xử phạt vi phạm"<br>• "Chế tài cưỡng chế nhà thầu"<br>• "Ra quyết định xử lý ô nhiễm" | • **"Giúp cộng đồng tạo chuỗi bằng chứng trước–sau, vị trí và dòng thời gian rõ ràng; từ đó một vấn đề có thể được theo dõi tốt hơn và, khi cần, được chuyển tới đơn vị có trách nhiệm xử lý."**<br>• "Hồ sơ thực chứng cộng đồng (Structured Civic Dossier)"<br>• "Điểm kết nối chuyển giao (Civic Handoff)" | DustGuard là công cụ hỗ trợ cộng đồng và ra quyết định, không phải cơ quan hành pháp có thẩm quyền xử phạt. |
| **Trí Tuệ Nhân Tạo (AI)** | • "AI phán quyết vi phạm"<br>• "AI phát hiện sai phạm chính xác 100%"<br>• "AI tự động kết luận nguyên nhân"<br>• "AI thay thế thanh tra môi trường" | • **"AI trợ lý hỗ trợ (AI Assistant, Not Judge)"**<br>• "Hỗ trợ phân loại sơ bộ (Preliminary screening)"<br>• "Trích xuất đặc trưng hình ảnh & tóm tắt ngữ cảnh (Feature extraction & context summarization)"<br>• "Kiểm tra chất lượng ảnh hiện trường" | Mô hình thị giác máy tính và LLM chỉ đưa ra gợi ý xác suất, quyết định hành động cuối cùng thuộc về con người. |
| **Quan Trắc & Cảm Biến (IoT)** | • "Mạng lưới trạm quan trắc chuẩn quốc gia"<br>• "Giám sát thời gian thực toàn diện tuyệt đối"<br>• "Bắt buộc có cảm biến IoT mới chạy được"<br>• "Hệ thống đo đạc thay thế trạm cố định" | • **"Tín hiệu vi khí hậu bổ trợ (Supplementary Microclimate Sensing)"**<br>• "Cảm biến học đường giá rẻ (< $25)"<br>• "Quan trắc cộng đồng phân tán (Crowdsourced sensing)"<br>• **"Khả năng phục hồi Zero-IoT (Zero-IoT Resilience — hoạt động 100% bằng quan sát thực địa)"** | Cảm biến giá rẻ phục vụ giáo dục STEM và tín hiệu cảnh báo xu hướng, không thay thế thiết bị quan trắc chuẩn quốc gia. |
| **Bằng Chứng & Mật Mã Học** | • "Bằng chứng pháp lý niêm phong tuyệt đối"<br>• "Chứng thư tư pháp điện tử"<br>• "Hợp đồng thông minh blockchain bất biến"<br>• "Mã hóa không thể xâm phạm" | • **"Mã băm phát hiện sửa đổi SHA-256 (Tamper-evident hash)"**<br>• "Chuỗi minh chứng kỹ thuật số (Digital evidence trail)"<br>• "Đối chứng ảnh Trước/Sau (Before/After comparison)"<br>• "Lọc bỏ siêu dữ liệu nhạy cảm EXIF bảo vệ quyền riêng tư" | Chuẩn SHA-256 (FIPS 180-4) chứng minh tệp không bị chỉnh sửa sau thời điểm ghi nhận, tránh ngộ nhận chứng thư tư pháp. |
| **Thời Gian & SLA** | • "SLA giải quyết của chính quyền 24h–48h"<br>• "Cam kết cơ quan xử lý xong trong 48h"<br>• "Thời hạn xử phạt bắt buộc" | • **"Mục tiêu theo dõi cộng đồng 24h–48h (Community Follow-up Target)"**<br>• "Chu kỳ kiểm tra lại hiện trường (Follow-up round)"<br>• "Thời gian chuyển giao hồ sơ" | 24h-48h là nhịp sinh hoạt và tái kiểm tra của thanh niên/CLB, tiến độ xử lý hành chính phụ thuộc quy trình công vụ. |
| **Tín Chỉ & Điểm Thưởng** | • "DustGuard cấp tín chỉ đại học tự động"<br>• "Hệ thống tự động chấm điểm rèn luyện"<br>• "Tín chỉ môi trường bắt buộc" | • **"Ghi nhận giờ tình nguyện thực tế có QR truy vết (Green Credits / Verified Volunteer Hours)"**<br>• "Cung cấp chứng nhận tham gia làm cơ sở để cơ sở giáo dục xét duyệt tín chỉ / điểm rèn luyện theo quy chế riêng" | Việc công nhận điểm rèn luyện hay tín chỉ thuộc thẩm quyền của Hội đồng trường và Đoàn trường. |
| **Chi Phí Vận Hành** | • "Chi phí 0đ vĩnh viễn"<br>• "Hệ thống hoàn toàn miễn phí trọn đời"<br>• "Không tốn bất kỳ chi phí nào" | • **"Chi phí hạ tầng pilot có thể gần bằng 0 trong hạn mức miễn phí hiện tại của Cloudflare (ghi nhận khả năng phát sinh tên miền, email và dung lượng mở rộng khi scale)"** | Minh bạch chi phí thực tế: tên miền tùy chỉnh (~$10–$25/năm), email giao dịch và dung lượng lưu trữ R2 mở rộng. |
| **Tích Hợp Cơ Quan** | • "Thay thế Cổng 1022 / iHanoi"<br>• "Kênh khiếu nại song song với chính quyền"<br>• "Cạnh tranh với dịch vụ công trực tuyến" | • **"Điểm tích hợp kết nối case (Integration Point)"**<br>• "Cung cấp hồ sơ thực chứng có cấu trúc giúp cán bộ tiếp nhận xử lý nhanh hơn"<br>• "Đối thoại xây dựng đa bên (Constructive Multi-party Dialogue)" | DustGuard bổ trợ và nâng cao chất lượng dữ liệu đầu vào cho 1022/iHanoi, tuyệt đối không thay thế. |

---

## 📖 3. Bảng Thuật Ngữ Khoa Học & Bounded Contexts (Core Domain Glossary)

```text
src/domains/
  ├── observations/    # Ghi nhận hiện trường ban đầu (Field Observation)
  ├── cases/           # Hồ sơ vụ việc đối chứng dài hạn (Structured Civic Case)
  ├── evidence/        # Kho minh chứng số & Mã băm (Digital Evidence & Hash)
  ├── followups/       # Tái kiểm tra thực địa 24h-48h (Field Re-verification)
  ├── handoffs/        # Gói chuyển giao tích hợp (Civic Integration Handoff)
  ├── campaigns/       # Chiến dịch hành động vì môi trường (Civic Campaign)
  ├── community/       # Không gian CLB & Thanh niên (Youth & Community Hub)
  └── impact/          # Tác động môi trường & Giờ tình nguyện (Verified Social Impact)
```

### 3.1. Phân Định Bản Chất: `Observation` (Ghi Nhận) vs `Case` (Vụ Việc)
* **Ghi nhận hiện trường (Observation)**: Là một tín hiệu quan trắc đơn lẻ ngoài thực địa do người dân hoặc tình nguyện viên gửi lên qua quy trình Zero-Login 30s. Gồm: 1 bức ảnh đã xóa EXIF, tọa độ WGS84, thời điểm ghi nhận, danh mục nguồn phát sinh bụi và mô tả sơ bộ.
* **Hồ sơ vụ việc (Case)**: Là một thực thể theo dõi tiến trình có cấu trúc (Lifecycle Entity) được nhóm từ một hoặc nhiều quan sát tại cùng một vị trí. Hồ sơ lưu trữ chuỗi ảnh đối chứng Trước/Sau, nhật ký kiểm tra 24h-48h, điểm ưu tiên rủi ro học đường (CPS) và sẵn sàng xuất gói Dossier A4 chuyển giao.

### 3.2. Chu Trình Theo Dõi Thực Địa (Follow-up Lifecycle)
Khi thanh niên hoặc CLB quay lại kiểm tra một điểm ghi nhận sau 24h–48h, hiện trạng được phân loại theo 3 trạng thái khách quan:
1. **`BETTER` (Đã có chuyển biến tích cực / Cải thiện)**: Hiện trường đã được che chắn bạt, phun nước dập bụi, quét dọn hoặc mật độ bụi giảm rõ rệt.
2. **`UNCHANGED` (Chưa có chuyển biến / Giữ nguyên)**: Tình trạng phát sinh bụi vẫn tiếp diễn như ban đầu, chưa thấy biện pháp giảm thiểu.
3. **`WORSE` (Diễn biến phức tạp hơn / Xấu hơn)**: Bụi phát tán mạnh hơn, phạm vi ảnh hưởng lan rộng sang cổng trường hoặc khu dân cư lân cận.

### 3.3. Hồ Sơ Thực Chứng Cộng Đồng (Structured Civic Dossier)
Tài liệu định dạng chuẩn khổ A4 gồm 4 khối thông tin khoa học:
* **Khối 1 (Context & Geofence)**: Mã vụ việc, tọa độ WGS84, địa chỉ thực tế, khoảng cách tới điểm trường học lân cận, quy chuẩn kỹ thuật tham chiếu (QCVN 05:2023/BTNMT, QCVN 18:2021/BXD).
* **Khối 2 (Tamper-evident Evidence Trail)**: Cặp ảnh Before/After, tem thời gian ISO-8601, mã băm SHA-256 phát hiện sửa đổi.
* **Khối 3 (Follow-up Timeline)**: Nhật ký các đợt kiểm tra lại của cộng đồng (24h/48h) và đánh giá chuyển biến.
* **Khối 4 (Constructive Recommendations & Handoff)**: Khuyến nghị giải pháp kỹ thuật (lưới chắn, phun sương, trạm rửa bánh xe) và điểm tích hợp chuyển giao (1022 / iHanoi / BQLDA).

---

## 🔬 4. Tiêu Chuẩn Kỹ Thuật Môi Trường & Mật Mã Tham Chiếu (Standards & Norms)

| Mã Tiêu Chuẩn / Quy Chuẩn | Cơ Quan Ban Hành | Phạm Vi & Giá Trị Tham Chiếu Trong Hệ Thống |
|---|---|---|
| **QCVN 05:2023/BTNMT** | Bộ Tài nguyên và Môi trường | Quy chuẩn kỹ thuật quốc gia về chất lượng không khí. Giới hạn tham chiếu nồng độ hạt bụi: PM2.5 (50 µg/m³ 24h), PM10 (100 µg/m³ 24h), Tổng bụi lơ lửng TSP (300 µg/m³ 1h). |
| **QCVN 18:2021/BXD** | Bộ Xây dựng | Quy chuẩn kỹ thuật quốc gia về an toàn trong thi công xây dựng (Quy định bắt buộc che chắn công trình, ngăn ngừa bụi phát tán ra khu vực công cộng). |
| **Quyết định 1459/QĐ-TCMT** | Tổng cục Môi trường | Hướng dẫn kỹ thuật tính toán chỉ số chất lượng không khí Việt Nam (VN_AQI) theo 6 khoảng giá trị (Tốt, Trung bình, Kém, Xấu, Rất xấu, Nguy hại). |
| **WGS84 (EPSG:4326)** | Chuẩn Trắc địa Quốc tế | Hệ tọa độ toàn cầu dùng cho toàn bộ dữ liệu vị trí GPS, Heatmap, và Geofencing bán kính an toàn 50m quanh trường học. |
| **FIPS 180-4 (SHA-256)** | NIST (Hoa Kỳ) / Web Crypto API | Chuẩn băm mật mã học tạo chuỗi 64 ký tự hex dùng để đối chứng tính toàn vẹn minh chứng số (Tamper-evident Digest). |
| **ISO/IEC 18004:2015** | ISO / IEC | Chuẩn mã ma trận điểm 2 chiều (QR Code) mức sửa lỗi M (15%) dùng để tra cứu nhanh hồ sơ vụ việc và chứng nhận giờ tình nguyện. |
| **RFC 7807** | IETF | Chuẩn phản hồi lỗi API chi tiết (Problem Details for HTTP APIs) đảm bảo tính minh bạch khi xảy ra lỗi hệ thống. |

---

## 💡 5. Quy Tắc Viết Lời Thoại Giao Diện & Trợ Lý AI (UI Copy & AI Persona Rules)

Mọi thông điệp xuất hiện trên giao diện DustGuard VN phải tuân thủ nghiêm ngặt bảng quy tắc sau:

1. **Khách quan trong thông báo**:
   - ✅ *"Hệ thống đã ghi nhận quan sát tại 45 Trần Hưng Đạo. Mã tra cứu: #OBS-8402. Bạn có thể quay lại đối chứng sau 24h."*
   - ❌ *"Bạn đã tố cáo vi phạm thành công. Công trình này sẽ bị phạt nặng!"*
2. **Khiêm tốn trong phân tích AI**:
   - ✅ *"AI nhận diện hình ảnh cho thấy dấu hiệu bụi đất trên mặt đường và phương tiện chưa che bạt. Đề xuất phân loại: Bụi thi công giao thông."*
   - ❌ *"AI khẳng định công trình này vi phạm luật môi trường điều 42."*
3. **Minh bạch trong giờ tình nguyện (Green Credits)**:
   - ✅ *"Bạn đã hoàn thành 2.5 giờ khảo sát thực địa có xác thực QR. Dữ liệu đã được lưu trữ an toàn để bạn gửi hội đồng trường xét duyệt điểm rèn luyện."*
   - ❌ *"Bạn vừa nhận được 2.5 tín chỉ đại học chính thức từ DustGuard."*
4. **Hợp tác trong chuyển giao hồ sơ (Handoff)**:
   - ✅ *"Tạo gói hồ sơ thực chứng có cấu trúc A4 sẵn sàng gửi Tổng đài 1022 hoặc ứng dụng iHanoi để hỗ trợ cơ quan địa phương nắm bắt đầy đủ bối cảnh."*
   - ❌ *"Chuyển hồ sơ xử phạt sang 1022 yêu cầu đình chỉ công trình."*

---

## ✅ 6. Tiêu Chuẩn Nghiệm Thu Ngôn Ngữ (Linguistic Definition of Done)

Trước khi phát hành bất kỳ tính năng, bản cập nhật UI, tài liệu hoặc API endpoint mới:
- [ ] 100% câu từ không chứa từ ngữ áp đặt hoặc cưỡng chế hành chính (`buộc công trình`, `xử phạt`, `chế tài`).
- [ ] 100% tài liệu định vị chính xác: **Nền tảng Environmental Intelligence & Decision Support vì Hành động Cộng đồng**.
- [ ] 100% thuật ngữ AI được định vị là **Trợ lý hỗ trợ (Assistant, Not Judge)**, không phán xét thay con người.
- [ ] 100% đề cập 1022 / iHanoi được xác định là **Điểm Tích Hợp (Integration Points)**, không thay thế dịch vụ công.
- [ ] 100% thuật ngữ mật mã học được gọi chính xác là **Mã băm phát hiện sửa đổi SHA-256 (Tamper-evident hash)**.
- [ ] Toàn bộ bộ test suites (`verify:quick`) vượt qua 100% không phát sinh sai lệch logic nghiệp vụ.
