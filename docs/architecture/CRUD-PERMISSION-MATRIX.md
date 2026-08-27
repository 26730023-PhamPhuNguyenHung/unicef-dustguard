# CRUD-PERMISSION-MATRIX.md — Actor & Entity CRUD Permission Matrix

> Ma trận quyền hạn nghiêm ngặt cho 5 vai trò trong hệ thống DustGuard VN.

---

## 🛡️ 1. Actor Definitions
1. **PUBLIC / GUEST**: Khách vãng lai xem chỉ số ô nhiễm tổng hợp, tra cứu hướng dẫn cảm biến.
2. **CITIZEN / YOUTH**: Người dân, thanh niên, tình nguyện viên ghi nhận hiện trường, nhận tín chỉ rèn luyện.
3. **OPERATOR / STAFF**: Điều phối viên, thẩm tra viên, cán bộ hiện trường duyệt hàng đợi, xuất hồ sơ 1022.
4. **CONTRACTOR**: Nhà thầu, đại diện công trình tiếp nhận yêu cầu dập bụi, nộp minh chứng geofence $\le 50\text{m}$.
5. **EXECUTIVE / ADMIN**: Lãnh đạo điều hành, quản trị viên hệ thống và cấu hình cảm biến IoT.

---

## 📊 2. CRUD Matrix

| Entity | PUBLIC | CITIZEN | OPERATOR / STAFF | CONTRACTOR | EXECUTIVE / ADMIN |
|---|---|---|---|---|---|
| **Observations / Complaints** | R (Aggregated) | **C, R (Own), U (Draft)** | **R, U (Triage), Assign** | R (Assigned site) | **R, Audit, Delete** |
| **Cases** | R (Public list) | R (Public timeline) | **C, R, U (Manage, Verify)**| R (Assigned site) | **R, Approve, Escalate** |
| **Evidences (Photos/Hash)** | R (Watermarked) | **C (Upload & SHA-256)** | **R, Verify, Corroborate** | **C (Remediation proof)** | **R, Cryptographic Audit** |
| **Actions / Remediation** | R (Status) | R (Follow-up) | **C, R, Assign, Verify** | **R, U (Submit proof)** | **R, Review SLA** |
| **Sites & Projects** | R (Public risk) | R (Map view) | **C, R, U (Manage)** | R (Own site profile) | **C, R, U, D (Full)** |
| **Sensors & Readings** | R (Aggregated AQI) | R (Public map) | **R, Monitor, Calibrate** | R (Site sensor) | **C, R, U, D, Key Provision** |
| **Documents (Dossier/Handoff)** | None | R (Outcome memo) | **C, R, U (Draft dossier)** | R (Received notice) | **R, Digital Sign, Approve** |
| **Youth Credits & Certs** | None | **R, Claim, QR Export** | **Verify volunteer hours** | None | **R, Program Audit** |
| **System & Audit Logs** | None | None | R (Own activity) | None | **R (Full immutable log)** |

*Ghi chú: **C** = Create, **R** = Read, **U** = Update, **D** = Delete, **Assign** = Phân công, **Verify** = Đối chứng thẩm tra.*
