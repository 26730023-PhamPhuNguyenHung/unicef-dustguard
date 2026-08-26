---
name: domain-logic-verifier
description: Kiểm tra và bảo đảm tính chính xác của logic nghiệp vụ Civic Tech (Observation != Case, SLA 48h, Geofence 50m, Tín chỉ thanh niên 20h = 4.0 tín chỉ, Mã băm minh chứng SHA-256).
---

# Skill: CivicTech Domain Logic Verifier

## Khi nào sử dụng
- Khi triển khai hoặc sửa đổi luồng nghiệp vụ Citizen, Youth Community, Staff, Contractor, Executive.
- Khi thẩm định đầu vào / đầu ra (Input/Output) của các tính năng mới xem có mang lại giá trị thực tế cho người dùng hay không.
- Khi kiểm tra tính bất biến của dữ liệu (Immutability & Cryptographic Integrity).

## Các Bất Biến Nghiệp Vụ Cốt Lõi (Domain Invariants)

### 1. Phân định Thực Thể: Observation != Case
- **Observation (Ghi nhận hiện trường)**: Dữ liệu quan sát ban đầu của thanh niên/tình nguyện viên/người dân.
  * Trạng thái: `DRAFT`, `SUBMITTED`, `VERIFIED`, `RESOLVED`, `CLOSED`.
  * Có kèm tọa độ WGS84, ảnh minh chứng, hash SHA-256, đối tượng nhạy cảm tiếp giáp.
- **Case (Hồ sơ Vụ việc Thanh tra)**: Thực thể pháp lý tác nghiệp 7 bước của cán bộ thanh tra môi trường.
  * Trạng thái: `SCREENING`, `TRIAGED`, `INVESTIGATING`, `EVIDENCE_LOCKED`, `ACTION_REQUIRED`, `RESOLVED`, `CLOSED`.
  * Gắn liền với công trình (`siteId`), cán bộ phụ trách (`inspector`), thời hạn SLA 48h đếm ngược, biên bản A4 và quyết định xử lý.
- **Quy tắc**: Một Case có thể tổng hợp từ nhiều Observations/Complaints; Observation KHÔNG tự động biến thành quyết định xử phạt.

### 2. SLA 48h & Priority Queue Cán Bộ
- Cán bộ thanh tra ưu tiên xử lý vụ việc theo hạn SLA (CRITICAL 24h, HIGH 48h, MEDIUM 7 ngày).
- Khi quá hạn SLA, hệ thống chuyển cờ `isOverdue: true` và hiển thị cảnh báo đỏ trên Priority Command Center.
- Thời gian đếm ngược hiển thị rõ ràng: `Còn X giờ Y phút` hoặc `Quá hạn Z giờ`.

### 3. Geofence 50m Nhà Thầu (Contractor Remediation)
- Khi nhà thầu tải ảnh khắc phục (ảnh Sau / After Photo), hệ thống tính khoảng cách Haversine giữa vị trí chụp và tọa độ công trình.
- Nếu khoảng cách `> 50m`: Đánh dấu `geofenceValid: false`, hiển thị cảnh báo ngoài bán kính công trình.
- Cán bộ thanh tra đối chứng ảnh Trước/Sau (Before/After) trên Remediation Workspace và thực hiện 1 trong 3 quyết định:
  1. `Nghiệm thu Đạt` (Approve & Close Case)
  2. `Yêu cầu làm lại` (Reject & Request Rework)
  3. `Chuyển xử phạt cưỡng chế` (Escalate to Formal Penalty)

### 4. Tín Chỉ Tình Nguyện Thanh Niên (Youth Community Credits)
- Quy đổi chuẩn: **20 giờ tình nguyện = 4.0 tín chỉ ngoại khóa** (tỷ lệ 5h = 1.0 tín chỉ).
- Điểm thưởng minh chứng: +0.5h cho mỗi ảnh có hash SHA-256 và tọa độ WGS84 hợp lệ.
- Cơ chế chống spam thiết bị: Giới hạn tần suất ghi nhận trên cùng device hash (`verifyAntiSpamLimit`), trần tối đa 35 điểm nếu gửi spam liên tiếp.
- Giấy chứng nhận số (Digital Certificate): Sinh chứng nhận định dạng PDF/SVG kèm mã QR chuẩn ISO/IEC 18004 xác thực trên Edge.

### 5. Chuẩn Hóa Mã Băm SHA-256 & Tính Toàn Vẹn (Tamper-Evident)
- **Định nghĩa SSOT**: *"DustGuard lưu hash SHA-256 để hỗ trợ phát hiện việc tệp bị thay đổi sau khi ghi nhận"* (tamper-evident, không nói 'bằng chứng pháp lý niêm phong').
- Tránh ảo tưởng sức mạnh: Không tự nhận là cơ quan tư pháp niêm phong tang vật; hash SHA-256 là công cụ số minh bạch giúp cộng đồng và cán bộ đối chiếu xem ảnh gốc có bị chỉnh sửa hay không.

### 6. Ma Trận Quyết Định Tái Kiểm Tra (Follow-up 3 Trạng Thái)
- **BETTER** (Đã cải thiện / Đã che chắn / Đã dọn dẹp):
  * Kèm ảnh minh chứng hợp lệ ➔ Chuyển `RESOLVED` (Đóng thành công).
  * Chưa có ảnh minh chứng ➔ Chuyển `NEEDS_FOLLOWUP` (Lập lịch kiểm tra lại trong 24h).
- **UNCHANGED** (Không đổi / Tình trạng như cũ):
  * Lần tái kiểm tra thứ 1 ➔ Chuyển `NEEDS_FOLLOWUP` (Lập lịch kiểm tra lại trong 48h).
  * Lần tái kiểm tra thứ 2 trở lên ➔ Chuyển `READY_FOR_HANDOFF` (Chuyển tiếp cơ quan chức năng hỗ trợ).
- **WORSE** (Xấu hơn / Ô nhiễm gia tăng):
  * Lập tức chuyển `READY_FOR_HANDOFF` để kết xuất Dossier A4 và điều phối xử lý khẩn cấp.

### 7. Tính Minh Bạch & Chống Giả Lập (Zero Mock)
- "Test pass là chưa xong, phải kiểm tra logic input output có mang lại giá trị thực tế không".
- Mọi hàm tính điểm ưu tiên (`DustRiskEngine`) bắt buộc trả về `reasons` giải thích lý do cụ thể.
- Mọi biên bản A4 xuất ra phải có mã băm SHA-256 và thông tin cán bộ ký duyệt thực tế từ CSDL.

## Lệnh Kiểm Thử Domain
```powershell
node --test app/tests/domain-observation-case-invariants.test.js
node --test app/tests/legal-shield-image-integrity.test.js
node --test app/tests/community-action-flow.test.js
node --test app/tests/backend-hardening-10-domains.test.js
node --test app/tests/risk-engine*.test.js
node --test app/tests/youth-credits-p0.test.js
```
