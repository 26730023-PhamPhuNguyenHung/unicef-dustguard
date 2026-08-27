# DUSTGUARD VN — MASTER FEATURE SPECIFICATION (SSOT)

> **File Kim Chỉ Nam Bắt Buộc Đọc Trước Mọi Lần Coding**  
> **Phiên bản**: 2.0 (Full BA & Architecture Alignment)  
> **Nền tảng**: CivicTech Giám sát Môi trường & Bụi mịn Đô thị (UNICEF / Hackathon Ready)

---

## 1. MỤC TIÊU SẢN PHẨM (PRODUCT GOAL)
Chuyển đổi quy trình giám sát môi trường thủ công sang nền tảng CivicTech số khép kín:
**Người dân/Cảm biến phát hiện ➔ Thanh tra lập biên bản QCVN ➔ Nhà thầu nộp ảnh Before/After ➔ Lãnh đạo giám sát & Chuyển tuyến Sở TNMT**.

---

## 2. BẢN ĐỒ TÁC NHÂN (ACTORS & ROLES)
1. **Citizen / Youth**: Gửi phản ánh (Observation), theo dõi tiến độ, tích lũy 20h = 4.0 Tín chỉ rèn luyện.
2. **Staff / Inspector**: Thụ lý vụ việc theo Priority Queue, kiểm tra thực địa, ban hành lệnh khắc phục SLA 48h.
3. **Contractor**: Tiếp nhận cảnh báo vi phạm, tải lên minh chứng xử lý Before/After có băm SHA-256.
4. **Executive / Admin**: Giám sát bản đồ rủi ro WGS84 toàn thành phố, phê duyệt chuyển tuyến, quản trị hệ thống.
5. **System Automation**: Ingest dữ liệu trạm IoT, phát hiện vượt ngưỡng PM2.5, quét quá hạn SLA.

---

## 3. CÁC THỰC THỂ CỐT LÕI (CORE ENTITIES)
- `users`: Tài khoản & RBAC Role (`citizen`, `staff`, `contractor`, `executive`, `admin`).
- `construction_sites`: Công trình xây dựng & Tọa độ Geofence 50m.
- `observations`: Phản ánh/quan trắc cộng đồng ban đầu.
- `cases`: Hồ sơ vụ việc vi phạm pháp luật chính thức (DAG 7-10 bước).
- `inspections`: Biên bản thanh tra thực địa theo QCVN 05:2023/BTNMT.
- `remediation_actions` & `contractor_submissions`: Yêu cầu & Minh chứng khắc phục Before/After.
- `youth_credits` & `youth_certificates`: Giờ tình nguyện & Chứng Chỉ Xanh mã hóa HMAC SHA-256.
- `audit_logs`: Nhật ký kiểm toán bất biến (Append-only).

---

## 4. VÒNG ĐỜI TRẠNG THÁI (STATE MACHINES)
- **Case Lifecycle**:
  `NEW` ➔ `TRIAGED` ➔ `ASSIGNED` ➔ `INSPECTION_PENDING` ➔ `INSPECTION_COMPLETED` ➔ `VIOLATION_CONFIRMED` ➔ `REMEDIATION_REQUIRED` ➔ `REMEDIATION_IN_PROGRESS` ➔ `VERIFICATION_PENDING` ➔ `RESOLVED` ➔ `CLOSED`.
- **Remediation Action**: `ISSUED` ➔ `IN_PROGRESS` ➔ `SUBMITTED` ➔ `APPROVED` / `REJECTED_RETRY`.

---

## 5. MÔ HÌNH BẢO MẬT & PHÂN QUYỀN (RBAC & SECURITY)
- **Object-Level Authorization**:
  - Contractor chỉ đọc/sửa dữ liệu thuộc công trình của mình (`contractor_id === user.contractor_id`).
  - Inspector chỉ ký biên bản và nghiệm thu case được phân công (`assigned_inspector_id === user.id`).
- **Enforcement**: 100% tại Server Middleware (`app/server/auth/index.js`), cấm chỉ kiểm tra client-side.

---

## 6. QUY TẮC DỮ LIỆU & ZERO-MOCK (PRODUCTION RULES)
1. **D1 is SSOT**: Tuyệt đối không dùng `localStorage` để giả lập database; refresh F5 không mất dữ liệu.
2. **Không Fake Mock**: Khi API lỗi, hiển thị Empty State hoặc Error Banner + Nút Retry; không dùng mảng tĩnh `CASE-2026-xxx`.
3. **No Glassmorphism**: Giao diện sáng màu, tương phản cao (`#FDFBF7`, `#231b14`, `#0d6f64`, `#9f241f`), touch target >= 44px.

---

## 7. ĐỊNH NGHĨA HOÀN THÀNH (DEFINITION OF DONE - DoD)
Một tính năng chỉ được đánh dấu **PRODUCTION READY** khi:
- [x] UI hiển thị đẹp, rõ ràng, không dùng glassmorphism, responsive từ 360px đến Desktop.
- [x] API endpoint thật tại Hono Edge (`worker.js`) & Express Local (`server/routes/`).
- [x] D1 Database Schema thật, có index, khóa ngoại và soft delete.
- [x] Backend RBAC & Object-Level check được kiểm thử.
- [x] Xử lý đủ 3 trạng thái: Loading (Spinner), Empty State, Error Retry Box.
- [x] Kiểm thử tự động vượt qua (`node --test app/tests/...` & `npm run verify:quick`).
- [x] Cập nhật SSOT Timeline và Micro-commit có mô tả rõ ràng.

---

## 8. DANH MỤC TÀI LIỆU CHI TIẾT (DETAILED SSOT INDEX)
- [BA_PRODUCT_SPEC.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/BA_PRODUCT_SPEC.md) — Đặc tả phân tích nghiệp vụ chi tiết.
- [CRUD_MATRIX.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/CRUD_MATRIX.md) — Ma trận thẩm quyền thao tác dữ liệu.
- [DOMAIN_MODEL.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DOMAIN_MODEL.md) — Đặc tả thực thể, trường dữ liệu & quan hệ.
- [STATE_MACHINES.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/STATE_MACHINES.md) — Cây trạng thái bất biến & chuyển đổi.
- [USER_FLOWS.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/USER_FLOWS.md) — Luồng hành trình người dùng End-to-End.
- [API_CONTRACT.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/API_CONTRACT.md) — Hợp đồng giao tiếp API & mã lỗi RFC-7807.
- [DATABASE_SPEC.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DATABASE_SPEC.md) — Cấu trúc D1 SQLite & Migrations.
- [RBAC_MATRIX.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/RBAC_MATRIX.md) — Ma trận phân quyền kiểm soát truy cập.
- [FEATURE_COMPLETENESS.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/FEATURE_COMPLETENESS.md) — Bảng theo dõi tiến độ hoàn thiện thực tế.
- [IMPLEMENTATION_GAPS.md](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/memory-bank/IMPLEMENTATION_GAPS.md) — Báo cáo điểm nghẽn & giải pháp theo P0-P3.
