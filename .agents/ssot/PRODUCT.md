# PRODUCT SSOT — DUSTGUARD VN

## 1. Canonical Product Statement
> DustGuard là nền tảng CivicTech giúp các nhóm trẻ và cộng đồng có động lực hành động môi trường ghi nhận vấn đề theo một quy trình thống nhất, tạo bằng chứng có cấu trúc, phối hợp theo dõi vấn đề theo thời gian và chuyển thông tin tới đơn vị phù hợp khi cần.

## 2. Product Identity Boundaries
- **KHÔNG PHẢI**: Citizen complaint portal đơn thuần (chỉ gửi rồi chờ cán bộ).
- **KHÔNG PHẢI**: AI phát hiện vi phạm tự động thay thế cơ quan quản lý.
- **KHÔNG PHẢI**: IoT-only monitoring platform (Hệ thống hoạt động 100% khi có 0 cảm biến).
- **LÕI SẢN PHẨM (Core Loop)**:
  ```text
  COMMUNITY ACTION
        ↓
  STRUCTURED OBSERVATION
        ↓
  EVIDENCE
        ↓
  FOLLOW-UP
        ↓
  COORDINATION
        ↓
  ESCALATION / HANDOFF
        ↓
  OUTCOME
        ↓
  HISTORY & IMPACT
  ```

## 3. User Hierarchy
1. **Primary Actor (Nhóm người dùng tiên phong)**:
   - **Youth Community Actor**: Sinh viên, CLB môi trường trường học, Đội công tác xã hội, Đoàn/Hội, Nhóm tình nguyện viên.
2. **Secondary Actor (Cộng đồng địa phương)**:
   - **Citizen / Community Member**: Cung cấp tín hiệu quan sát ban đầu, theo dõi hiện trạng khu dân cư.
3. **Coordination Actor**:
   - **Organization Coordinator**: Điều phối nhóm, chiến dịch (Campaign), phân công nhiệm vụ (Action), kiểm tra bằng chứng (Evidence).
4. **Professional / Authority Partner**:
   - **Staff / Responsible Unit**: Tiếp nhận hồ sơ bàn giao (Handoff), thanh tra hiện trường, ban hành quyết định hành chính theo thẩm quyền.

## 4. Invariants Nghiệp vụ
1. **Observation != Case**: Ghi nhận quan trắc hiện trường (Observation) không mặc định biến thành hồ sơ pháp lý (Case). Observation có thể đứng độc lập để cộng đồng tự theo dõi hoặc gộp thành Case khi đủ cơ sở.
2. **Evidence-backed Follow-up**: Mọi vấn đề môi trường không bao giờ kết thúc ở một lần báo cáo. Cốt lõi là chuỗi kiểm tra lại (Follow-up: Tốt hơn / Không đổi / Xấu hơn) kèm ảnh đối chiếu.
3. **Transparent Handoff**: Khi cần chuyển sang cơ quan chức năng, hệ thống xuất hồ sơ minh bạch (Dossier A4, mã băm SHA-256) và theo dõi trạng thái tiếp nhận (Prepared -> Sent -> Acknowledged -> Follow-up -> Closed).
4. **Civic Youth Impact**: Đo lường tác động bằng giá trị đóng góp thực tế: số giờ tình nguyện, điểm quan sát có vị trí, số lần kiểm tra lại, tỉ lệ vấn đề cải thiện sau theo dõi.
5. **Optional Extracurricular Credits (Sớm ra mắt)**: Chương trình quy đổi giờ tình nguyện sang tín chỉ ngoại khóa / điểm rèn luyện là tính năng tùy chọn (Optional) và thí điểm kết nối trường học (Sớm ra mắt). Mọi bạn trẻ và người dân đều có thể tự do tham gia ghi nhận, theo dõi môi trường độc lập mà không bị ràng buộc bởi tín chỉ.
