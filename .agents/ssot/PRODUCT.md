# PRODUCT SSOT — DUSTGUARD VN

## 1. Canonical Product Statement
> DustGuard VN là công cụ CivicTech thực tế giúp Thanh niên (CLB trường học, sinh viên, tình nguyện viên) và Người dân ghi nhận tình trạng ô nhiễm bụi quanh trường học và khu dân cư, thiết lập nhật ký theo dõi đối chứng Trước - Sau (Before/After) và tạo biên bản chứng cứ minh bạch để thúc đẩy các bên liên quan (nhà thầu, ban quản lý, chính quyền cơ sở) khắc phục.

---

## 2. Product Identity Boundaries (Ranh Giới Định Vị)
- **KHÔNG PHẢI**: Cổng tố cáo hành chính quan liêu hay phần mềm điều hành nội bộ của Sở TN&MT.
- **KHÔNG PHẢI**: Công cụ tự động ra phán quyết hay ký quyết định xử phạt vi phạm hành chính.
- **KHÔNG PHẢI**: Hệ thống chỉ chạy được khi có cảm biến IoT đắt tiền (vận hành 100% bằng quan sát thực địa cộng đồng).
- **LÕI SẢN PHẨM (3-Step Core Loop)**:
  ```text
  1. GHI NHẬN HIỆN TRƯỜNG (30s)
         ↓
  2. THEO DÕI ĐỐI CHỨNG (Before / After 24-48h)
         ↓
  3. BIÊN BẢN CHỨNG CỨ MINH BẠCH (Dossier A4 / Link QR)
         ↓
  4. CHUYỂN GIAO & PHỐI HỢP KHẮC PHỤC (Civic Handoff)
         ↓
  5. GHI NHẬN TÁC ĐỘNG THỰC TẾ (Impact & Hours)
  ```

---

## 3. Nhóm Người Dùng & Nhu Cầu Thực Tế
1. **Thanh niên & CLB Môi trường (Primary)**: Có công cụ hành động thực tế, tổ chức chiến dịch khảo sát bụi quanh trường học, tích lũy giờ tình nguyện và điểm rèn luyện minh bạch.
2. **Người dân địa phương (Secondary)**: Phản ánh nhanh trong 30 giây khi thấy công trình gây bụi, không cần đăng nhập phức tạp, có mã tra cứu tiến độ rõ ràng.
3. **Đơn vị thi công / Ban quản lý (Collaborator)**: Có kênh tiếp nhận thông tin phản ánh cụ thể để kịp thời tưới nước dập bụi, che bạt và nộp ảnh khắc phục đối chứng.
4. **Đơn vị tiếp nhận / Phường / Nhà trường (Receiving Partner)**: Nhận hồ sơ chứng cứ có hình ảnh, thời gian, tọa độ rõ ràng thay vì các phản ánh chung chung không có cơ sở.

---

## 4. Nguyên Tắc Nghiệp Vụ Cốt Lõi (Invariants)
1. **Observation != Case**: Ghi nhận quan trắc hiện trường (Observation) là tín hiệu cộng đồng độc lập; chỉ khi cần phối hợp theo dõi dài hạn hoặc nhiều mốc kiểm tra mới nhóm thành vụ việc theo dõi (Case).
2. **Bằng chứng Đối chứng (Before/After)**: Giá trị của dữ liệu nằm ở chuỗi kiểm tra lại xem hiện trường đã cải thiện hay chưa (Better / Unchanged / Worse).
3. **Minh bạch & Đơn giản**: Mọi dữ liệu xuất ra đều ở dạng biên bản tóm tắt trực quan, dễ hiểu, mã băm SHA-256 chống sửa đổi, không lạm dụng thuật ngữ đao to búa lớn.
4. **Zero-IoT Resilience**: 0 cảm biến hệ thống vẫn hoạt động 100%. Cảm biến IoT là module mở rộng giá rẻ (< $25) phục vụ CLB STEM học đường.
5. **AI là Trợ lý, Không phải Thẩm phán**: AI hỗ trợ kiểm tra chất lượng ảnh, tóm tắt nội dung và phân loại sơ bộ; mọi quyết định và hành động khắc phục đều do con người thực hiện.
