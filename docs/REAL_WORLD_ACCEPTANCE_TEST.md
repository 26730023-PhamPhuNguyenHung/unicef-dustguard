# DUSTGUARD VN — REAL-WORLD OPERATIONAL ACCEPTANCE TESTS (GIVEN - WHEN - THEN)

> **Mục tiêu**: Bộ kiểm thử nghiệm thu thực tế theo kịch bản người dùng (Persona User Journeys), chứng minh hệ thống hoạt động 100% trọn vẹn trong môi trường vận hành thực tế mà không dựa vào mock hay API smoke tests đơn thuần.

---

### Kịch Bản 01: Người dân gửi phản ánh và theo dõi đến khi giải quyết dứt điểm (Scenario A)

**Given**:
- Một công dân đang sinh sống gần công trình xây dựng đường vành đai.
- Công trường không bật vòi phun sương và xe tải không rửa lốp làm phát tán bụi mù mịt.

**When**:
1. Công dân truy cập `/community/report`, bật định vị GPS tự động và chụp 2 ảnh hiện trường.
2. Hệ thống kiểm tra dung lượng (< 5MB), xác thực định dạng ảnh MIME, tạo mã băm `deviceHash` chống spam.
3. Người dân bấm "Gửi phản ánh".

**Then**:
1. Giao diện cấp mã tra cứu Shopee-style: `DG-2026-XXXX` kèm thông báo bảo mật.
2. Dữ liệu phản ánh được lưu vào bảng `complaints` của Cloudflare D1 và ảnh lưu vào Cloudflare R2 Bucket.
3. Hàng đợi của Cán bộ Thanh tra (`StaffDashboard`) tự động tăng +1 phản ánh mới cần Triage.
4. Cán bộ phân loại (Triage), liên kết công trình và chuyển tiếp thành Hồ sơ Thanh tra 7 bước (`DG-CASE-2026-XXXX`).
5. Khi Thanh tra viên hoàn thành kiểm tra và nghiệm thu nhà thầu khắc phục, trạng thái phản ánh chuyển sang `RESOLVED`.
6. Người dân tra cứu tại `/community/track` nhìn thấy đầy đủ: Tên cán bộ xử lý, tiến độ thời gian thực, kết luận Triage và nhận voucher bảo vệ môi trường.

---

### Kịch Bản 02: Cảm biến quan trắc phát hiện nồng độ bụi vượt chuẩn QCVN (Scenario B)

**Given**:
- Cảm biến IoT mã số `SEN-VD1-01` gắn tại cổng công trường Vành đai 3.
- Nồng độ bụi thực tế đo được vượt ngưỡng: $PM_{2.5} = 92\,\mu\text{g/m}^3$ ($> 75$), $PM_{10} = 185\,\mu\text{g/m}^3$ ($> 150$).

**When**:
1. Thiết bị ESP32 ký số gói tin bằng thuật toán HMAC-SHA256 bí mật và gửi `POST /api/sensors/reading`.
2. Hệ thống xác thực tính toàn vẹn chữ ký và kiểm tra độ lệch đồng hồ ($\le \pm 5$ phút).

**Then**:
1. Telemetry được ghi nhận vào bảng `sensor_readings` của SQLite D1.
2. Động cơ CPS/Risk Engine tự động tính toán lại điểm rủi ro công trường, nâng mức cảnh báo lên `CRITICAL` ($\ge 80/100$).
3. Hệ thống tự động tạo Alert khẩn cấp, sinh nhiệm vụ trong hàng đợi của Cán bộ Thanh tra với hạn định SLA 24h.
4. Nhà thầu nhận được thông báo cảnh báo yêu cầu bật ngay hệ thống phun sương và trạm rửa xe.
5. Khi các biện pháp khắc phục được thực thi, chỉ số $PM_{10}$ giảm về $35\,\mu\text{g/m}^3$ và điểm rủi ro hạ về mức `LOW` an toàn.

---

### Kịch Bản 03: Nhà thầu tiếp nhận yêu cầu, nộp minh chứng định vị và bị chặn tự xác minh (Scenario C)

**Given**:
- Nhà thầu đăng nhập vào `ContractorPortal` và chỉ nhìn thấy các công trình trực thuộc đơn vị mình (Tenant Isolation).
- Công trình đang có yêu cầu khắc phục vi phạm phát tán bụi kèm thời hạn SLA 48h.

**When**:
1. Nhà thầu bấm "Tiếp nhận yêu cầu" (`ACKNOWLEDGED`), sau đó chuyển trạng thái "Đang thực hiện" (`IN_PROGRESS`).
2. Nhà thầu lắp đặt trạm rửa xe tự động, chụp ảnh hiện trường và nộp minh chứng kèm tọa độ GPS và mã băm SHA-256.
3. Nhà thầu bấm "Nộp thẩm định" (`PENDING_VERIFICATION`).
4. Nhà thầu thử gọi trực tiếp API `POST /api/cases/:id/verify` hoặc sửa trạng thái thành `COMPLETED` để tự xóa vi phạm.

**Then**:
1. Trạng thái hành động được ghi nhận là `PENDING_VERIFICATION`.
2. Lời gọi API tự xác minh của Nhà thầu bị hệ thống chặn đứng với mã lỗi `403 FORBIDDEN - RFC 7807` ("Nhà thầu không có thẩm quyền tự xác minh hoặc đóng hồ sơ").
3. Hồ sơ được chuyển đến Hàng đợi Thẩm định của Cán bộ Thanh tra thực địa.

---

### Kịch Bản 04: Phát hiện gian lận cảm biến (Sensor Flatline & Tamper Detection) (Scenario D)

**Given**:
- Một cảm biến gửi liên tiếp 5 gói tin có cùng giá trị số thực chính xác $PM_{10} = 45.0\,\mu\text{g/m}^3$, $PM_{2.5} = 22.0\,\mu\text{g/m}^3$ (Dấu hiệu bị can thiệp/che chắn cảm biến hoặc giả lập phần mềm).

**When**:
- Telemetry Ingestion Pipeline tiếp nhận gói tin thứ 5.

**Then**:
1. Thuật toán `detectFlatline` phát hiện tình trạng treo chỉ số.
2. Trạng thái cảm biến tự động chuyển thành `FAULTY` (Lỗi thiết bị / Nghi vấn can thiệp).
3. Hệ thống tự động ghi nhật ký kiểm toán bất biến `SENSOR_TAMPER_SUSPECTED` vào bảng `audit_logs`.
4. Dashboard cán bộ hiển thị cảnh báo đỏ yêu cầu cử kỹ thuật viên kiểm tra phần cứng thiết bị.

---

### Kịch Bản 05: Lãnh đạo chỉ đạo khẩn cấp và ký số phê duyệt xử phạt (Scenario E)

**Given**:
- Lãnh đạo Sở Tài nguyên & Môi trường mở `ExecutiveDashboard`.
- Một công trình có vi phạm bụi kéo dài và hồ sơ thanh tra quá hạn giải trình 72h.

**When**:
1. Lãnh đạo click drill-down từ KPI "Quá hạn SLA" -> Xem danh sách công trình -> Mở hồ sơ chi tiết.
2. Lãnh đạo kích hoạt nút "Chỉ đạo khẩn cấp (Escalate P1)" và nhập chỉ đạo xử lý.
3. Sau khi Cán bộ hoàn tất thẩm định, Lãnh đạo nhập mã PIN bảo mật để ký số duyệt Quyết định Xử phạt hành chính.

**Then**:
1. Mức ưu tiên của hồ sơ được nâng lên `P1 CRITICAL` và ghi nhận sự kiện `CASE_ESCALATE_P1` trong Audit Trail.
2. Văn bản Quyết định xử phạt chuẩn thể thức Nghị định 30/2020/NĐ-CP được gắn mã băm SHA-256 số hóa và đóng dấu mộc đỏ điện tử `#9f241f`.
3. Vụ việc hoàn tất chuyển trạng thái `COMPLETED` và số liệu thống kê trên Dashboard lãnh đạo được cập nhật tức thì.
