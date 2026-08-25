# DUSTGUARD VN — TỪ ĐIỂN THUẬT NGỮ CHUẨN HÓA (DOMAIN GLOSSARY SSOT)

> **Mã tài liệu**: `DG-GLOSSARY-2026-SSOT`

---

## 1. THUẬT NGỮ THỰC THỂ & ĐỊA ĐIỂM (ENTITIES & LOCATIONS)

| Thuật ngữ Tiếng Việt | English Term | Định nghĩa & Ý nghĩa nghiệp vụ |
|---|---|---|
| **Điểm giám sát / Công trình** | Site / Construction Site | Địa điểm công trình xây dựng, hạ tầng giao thông hoặc khu vực phát sinh bụi cần giám sát môi trường. |
| **Trạm cảm biến IoT** | Sensor Node / Device | Thiết bị phần cứng (ESP32 + APM2000) đo lường nồng độ bụi PM1.0, PM2.5, PM10, nhiệt độ và độ ẩm. |
| **Dữ liệu đo đạc** | Sensor Reading / Telemetry | Số liệu định lượng đo được tại một mốc thời gian cụ thể (kèm thông số vẹn toàn dữ liệu). |
| **Phản ánh cộng đồng** | Citizen Report / Complaint | Thông tin quan sát môi trường do người dân hoặc thanh niên gửi lên hệ thống kèm ảnh minh chứng. |
| **Quan sát môi trường** | Environmental Observation | Tín hiệu ghi nhận có cấu trúc bởi các CLB thanh niên xung kích tại các điểm nóng môi trường. |
| **Vụ việc thanh tra** | Environmental Case | Hồ sơ theo dõi và xử lý đa bên theo quy trình 7 bước của cơ quan quản lý nhà nước. |

---

## 2. THUẬT NGỮ QUY TRÌNH & ĐÁNH GIÁ (PROCESS & RISK METRICS)

| Thuật ngữ Tiếng Việt | English Term | Định nghĩa & Ý nghĩa nghiệp vụ |
|---|---|---|
| **Chỉ số rủi ro giải trình** | Explainable Risk Score | Điểm số từ 0 đến 100 biểu thị mức độ ưu tiên can thiệp, cấu thành từ 4 yếu tố minh bạch (PM, Dân cư, Trường học, Biện pháp che chắn). |
| **Tính toàn vẹn dữ liệu** | Data Integrity Score | Điểm đánh giá độ tin cậy của cảm biến (0-100), tự động hạ điểm nếu phát hiện đường thẳng (Flatline) hoặc mất tín hiệu (Liveness timeout). |
| **Thời hạn cam kết SLA** | Service Level Agreement | Hạn chót xử lý vụ việc tính toán động theo mức độ rủi ro (Nghiêm trọng: 4h, Cao: 24h, Trung bình: 72h). |
| **Biên bản thanh tra** | Inspection Report | Biên bản kiểm tra hiện trường đánh giá 10 tiêu chí tuân thủ quy định bảo vệ môi trường. |
| **Biện pháp khắc phục** | Corrective Action | Yêu cầu kỹ thuật giao cho nhà thầu thi công (tưới nước dập bụi, che chắn lưới, rửa xe ra vào). |
| **Theo dõi 24–48h** | Monitoring Phase | Giai đoạn hậu kiểm số liệu cảm biến và phản ánh thực địa sau khi nhà thầu báo cáo đã khắc phục xong. |
| **Bàn giao hồ sơ số** | Digital Dossier Handoff | Gói dữ liệu bằng chứng chuẩn hóa gắn mã băm SHA-256 bàn giao sang cơ quan thẩm quyền. |
| **Ký số phê duyệt** | Digital Approval Signature | Chữ ký số điện tử của Lãnh đạo thẩm định quyết định xử lý, lưu vết kiểm toán bất biến. |
