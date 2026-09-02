# Terminology Map (Civic Tech Vocabulary SSOT) — DustGuard VN

Bảng thuật ngữ chuẩn hóa toàn hệ thống nhằm đảm bảo tính thống nhất giữa UI Tiếng Việt, Backend API, Database và Tài liệu:

| Khái niệm (Concept) | Thuật ngữ cũ / Biến thể A | Biến thể B (Jargon) | Thuật ngữ chuẩn hóa (Canonical SSOT) | Định nghĩa & Ngữ cảnh |
|---|---|---|---|---|
| **Phản ánh / Ghi nhận ban đầu** | Khiếu nại (Complaint) | Ticket / Issue | **Ghi nhận cộng đồng (Observation)** | Phát hiện ban đầu từ người dân hoặc thanh niên, chưa thành vụ việc chính thức. |
| **Hồ sơ xử lý vi phạm** | Vụ án / Đơn thư | Case DAG / Pipeline | **Hồ sơ vụ việc (Case)** | Hồ sơ xử lý hành chính 7 bước của cán bộ và cơ quan chức năng. |
| **Công trình xây dựng** | Điểm nóng / Trạm | Construction Site | **Công trình (Site)** | Địa điểm xây dựng, hạ tầng có phát sinh bụi và tiếng ồn. |
| **Yêu cầu xử lý / Việc cần làm** | Task / Action Item | Chỉ thị | **Nhiệm vụ (Task / Action)** | Yêu cầu kiểm tra hiện trường hoặc khắc phục gửi nhà thầu. |
| **Điểm rủi ro bụi** | Score / Priority | Threat Level | **Điểm rủi ro (Risk Score)** | Điểm số tổng hợp $0 - 100$ phân loại 4 mức: Thấp, Trung bình, Cao, Rất cao. |
| **Minh chứng số** | Bằng chứng / File đính kèm | Hash Proof / Evidence | **Minh chứng (Evidence)** | Ảnh chụp có tọa độ WGS84 và mã băm SHA-256 đối chứng Trước/Sau. |
| **Tín chỉ tình nguyện** | Điểm rèn luyện / Giờ công | Youth Credit | **Tín chỉ thanh niên (Youth Credits)** | Quy đổi 20 giờ tình nguyện môi trường = 4.0 tín chỉ sinh viên. |
| **Xác thực vị trí hiện trường** | GPS Radius / Polygon | Fence | **Vùng kiểm tra (Geofence $\le 50\text{m}$)** | Bán kính 50m quanh công trình để xác thực nhà thầu đang có mặt tại hiện trường. |
