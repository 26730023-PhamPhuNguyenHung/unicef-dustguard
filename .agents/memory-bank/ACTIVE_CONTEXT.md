# ACTIVE CONTEXT — DUSTGUARD VN

## 📌 TRẠNG THÁI HIỆN TẠI: KHÓA SSOT ĐỊNH VỊ CIVIC-TECH CHUẨN MỰC (UNICEF HACKATHON)
- **Bản chất dự án**: Ngay từ đầu DustGuard là một thử nghiệm CivicTech về bụi công trình, sử dụng cộng đồng + dữ liệu + công nghệ để biến quan sát ngoài hiện trường thành bằng chứng có cấu trúc và hành động có thể theo dõi. Sau quá trình làm việc với chuyên gia, nhóm không thay đổi mục tiêu đó; nhóm chỉ làm rõ hơn ranh giới: DustGuard hỗ trợ cộng đồng ghi nhận, đối chứng, hiểu vấn đề và kết nối với các kênh xử lý hiện hữu, chứ không đóng vai cơ quan nhà nước.
- **Đó là sự trưởng thành sản phẩm (Maturity), không phải pivot.**

---

## 💎 6 ĐIỂM ĐIỀU CHỈNH CHUẨN MỰC ĐÃ ĐƯỢC KHÓA (SSOT LOCKED)
1. **Định nghĩa đầy đủ**: *"DustGuard là nền tảng CivicTech giúp cộng đồng ghi nhận, đối chứng và theo dõi các vấn đề môi trường bằng dữ liệu có cấu trúc, đồng thời hỗ trợ chuyển những trường hợp phù hợp tới các kênh xử lý hiện hữu. Bụi công trình là use case đầu tiên."*
   - Bộ năng lực: `Community Action + Spatial Data + Evidence + Environmental Knowledge + Case Tracking + Green Credits + Integration`.
2. **Không ảo tưởng thẩm quyền**: Bỏ từ *"buộc công trình phải..."*, thay bằng *"giúp cộng đồng tạo chuỗi bằng chứng trước–sau, vị trí và dòng thời gian rõ ràng; từ đó một vấn đề có thể được theo dõi tốt hơn và, khi cần, được chuyển tới đơn vị có trách nhiệm xử lý."*
3. **Mục tiêu 24h - 48h**: Là **Community Follow-up Target** (Tỷ lệ điểm được cộng đồng quay lại đối chứng trong 24-48 giờ), không phải KPI thời gian phản hồi của cơ quan nhà nước.
4. **Green Credits / Điểm rèn luyện**: *"DustGuard có thể xác thực lịch sử tham gia, thời lượng và hoạt động bằng QR và dữ liệu truy vết; việc quy đổi sang điểm rèn luyện hoặc tín chỉ do từng đơn vị giáo dục quyết định."*
5. **Mã băm SHA-256**: *"DustGuard lưu hash SHA-256 để hỗ trợ phát hiện việc tệp bị thay đổi sau khi ghi nhận (Tamper-evident)."*
6. **Chi phí hạ tầng**: *"Chi phí hạ tầng pilot có thể gần bằng $0 trong hạn mức miễn phí hiện tại của Cloudflare."*

---

## 🎙️ ELEVATOR PITCH 30 GIÂY KHÓA CỨNG (LOCKED PITCH)
> *"Khi một bạn trẻ nhìn thấy bụi từ một công trình gần trường học, vấn đề không chỉ là làm sao gửi một phản ánh. Điều khó hơn là ghi nhận đủ bằng chứng, theo dõi xem tình trạng có thay đổi và biết bước tiếp theo nên làm gì.*
> 
> *DustGuard là nền tảng CivicTech giúp cộng đồng ghi nhận vấn đề môi trường bằng ảnh, vị trí và dữ liệu đối chứng trước–sau; hỗ trợ hiểu vấn đề, duy trì lịch sử theo dõi và tạo một hồ sơ có cấu trúc.*
> 
> *Khi cần sự can thiệp chính thức, DustGuard không thay thế các hệ thống hiện hữu mà hỗ trợ kết nối case tới những kênh như 1022, iHanoi hoặc đơn vị phù hợp. Bụi công trình là bài toán đầu tiên để chúng em kiểm chứng mô hình, trước khi mở rộng thành một nền tảng hành động xanh cho thanh thiếu niên và cộng đồng."*

---

## 🛠️ KIỂM TRA HỆ THỐNG & NHIỆM VỤ ĐÃ HOÀN TẤT
- [x] **Civic Handoff & Tích hợp (Civic Handoff Specialist)**:
  1. Loại bỏ 100% từ ngữ áp đặt ("buộc công trình phải...") ➔ Thay bằng: *"giúp cộng đồng tạo chuỗi bằng chứng trước–sau, vị trí và dòng thời gian rõ ràng; từ đó một vấn đề có thể được theo dõi tốt hơn và, khi cần, được chuyển tới đơn vị có trách nhiệm xử lý."*
  2. Định vị rõ ràng **Tổng đài 1022** và **Cổng Công dân số iHanoi** là **ĐIỂM TÍCH HỢP** kết nối case, không thay thế hệ thống chính thức của cơ quan nhà nước.
  3. Chuẩn hóa hồ sơ **Structured Civic Dossier** 4 khối chuẩn khổ A4 phục vụ đối thoại xây dựng giữa cộng đồng, nhà thầu và cơ quan địa bàn.
  4. Tạo tài liệu SSOT [CIVIC_HANDOFF_SSOT.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/CIVIC_HANDOFF_SSOT.md) và test suite `app/tests/civic-handoff-integration.test.js` đạt 4/4 pass.
- [x] **DevOps & Field Operations Lead**: Chuẩn hóa claim chi phí pilot gần bằng 0 Cloudflare, tự động xóa EXIF bảo vệ quyền riêng tư & nén ảnh < 300KB, test suite `image-compressor-privacy.test.js` đạt 6/6 pass.
- [x] **QA & Domain Logic Verifier**: Chuẩn hóa định nghĩa SHA-256 tamper-evident, khóa bất biến Observation != Case và Follow-up 3 trạng thái.
- [x] **Verification Gate**: `npm --prefix app run verify:quick` đạt 26/26 files pass (225 unit + 42 UI smoke tests).
- [x] **Tài liệu SSOT**: `README.md`, `PRODUCT.md`, `CIVIC_HANDOFF_SSOT.md`, `BUG_MEMORY.md`, `TIMELINE.md` đồng bộ 100%.
