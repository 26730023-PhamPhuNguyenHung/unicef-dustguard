# Rule: CivicTech Domain Business Invariants & Value Verification

1. **Phân Định Thực Thể: Observation != Case**:
   - `Observation`: Dữ liệu quan sát ban đầu của thanh niên, tình nguyện viên hoặc người dân.
   - `Case`: Hồ sơ vụ việc thanh tra chính thức gồm 7 bước tác nghiệp do cán bộ phụ trách, có hạn SLA 48h và biên bản pháp lý.
2. **Zero-IoT Normalization**:
   - Hệ thống hoạt động bình thường kể cả khi không có cảm biến IoT hoặc cảm biến bị hỏng (`available: false`).
   - Tự động chuẩn hóa tổng trọng số của 4 thành phần còn lại chia cho 90% (`sum(score * w) / 0.90`), không bao giờ trừ điểm phạt khi thiếu phần cứng.
3. **Thẩm Định Minh Chứng & Geofence 50m**:
   - Ảnh khắc phục của nhà thầu phải được chụp trong bán kính <= 50m so với tọa độ công trình.
   - Toàn bộ ảnh bằng chứng phải được băm SHA-256 (Web Crypto) để đảm bảo không bị chỉnh sửa.
4. **Tín Chỉ Tình Nguyện Thanh Niên**:
   - Quy đổi chuẩn: 20 giờ tình nguyện = 4.0 tín chỉ ngoại khóa.
   - Cung cấp chứng nhận số có mã QR chuẩn ISO/IEC 18004 để nhà trường và tổ chức quét xác thực.
5. **Test Pass Là Chưa Xong — Thẩm Định Giá Trị Nghiệp Vụ Thực Tế**:
   - Luôn kiểm tra xem tính năng mới có phục vụ thiết thực cho người dùng cuối (Thanh niên, Người dân, Cán bộ, Nhà thầu, Lãnh đạo) hay không.
   - Kết quả phân tích rủi ro/điểm ưu tiên phải có `reasons` giải trình minh bạch.
