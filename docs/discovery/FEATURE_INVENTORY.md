# Feature Inventory — DustGuard VN

Tất cả các tính năng được phát hiện trực tiếp từ mã nguồn thực tế và kiểm chứng qua Edge API + D1 SQLite:

---

## F-001 — Citizen Rapid Observation Submission (Ghi nhận cộng đồng nhanh)
- **User**: Citizen / Thanh niên tình nguyện
- **Entry point**: `/citizen/report/new`
- **UI**: Form ghi nhận 30 giây: Chọn vị trí bản đồ / định vị GPS, chụp ảnh bằng chứng, chọn loại vi phạm (bụi, rửa xe, che chắn).
- **API**: `POST /api/complaints`, `POST /api/storage/upload`
- **Data**: Bảng `observations`, `observation_evidence`
- **State transition**: `RECORDED` -> `VERIFIED`
- **Runtime verification**: Đã kiểm chứng upload R2, tính hash SHA-256 Web Crypto.
- **Maturity**: LEVEL 5 (Production coherent).

---

## F-002 — 7-Step Case Enforcement DAG (Hồ sơ vụ việc 7 bước tác nghiệp)
- **User**: Staff / Cán bộ thanh tra môi trường
- **Entry point**: `/staff/cases`, `/staff/cases/:id`
- **UI**: Bảng điều khiển hồ sơ vụ việc, luồng 7 bước: Tiếp nhận -> Khảo sát -> Đề xuất xử lý -> Phê duyệt -> Yêu cầu khắc phục -> Nghiệm thu -> Hoàn tất.
- **API**: `GET /api/cases`, `POST /api/cases/:id/verify`, `POST /api/cases/:id/transition`
- **Data**: Bảng `cases`, `case_status_history`, `case_timelines`, `actions`
- **State transition**: `DRAFT` -> `INTAKE` -> `SURVEYED` -> `PROPOSED` -> `APPROVED` -> `REMEDIATED` -> `CLOSED`
- **Runtime verification**: Test `case-enforcement-dag-7steps.test.js` pass 100%.
- **Maturity**: LEVEL 5 (Production coherent).

---

## F-003 — Youth Environmental Credit & QR Certificate (Tín chỉ & Chứng chỉ thanh niên)
- **User**: Youth / Sinh viên các trường ĐH
- **Entry point**: `/youth`, `/citizen/profile`
- **UI**: Bảng quy đổi 20 giờ tình nguyện = 4.0 tín chỉ, bảng xếp hạng CLB/Trường, trình tạo chứng chỉ số có mã QR SVG chuẩn ISO/IEC 18004.
- **API**: `GET /api/community/youth/stats`, `POST /api/community/youth/claim`
- **Data**: Bảng `youth_activities`, `youth_certificates`
- **Runtime verification**: Test `youth-credits.test.js` pass 100%.
- **Maturity**: LEVEL 5 (Production coherent).

---

## F-004 — Real-time Environmental Risk Matrix & IoT Telemetry (Chấm điểm rủi ro & Cảm biến)
- **User**: Staff / Quản lý vận hành
- **Entry point**: `/staff/monitoring`, `/staff/sites/:id`
- **UI**: Ma trận cảm biến PM2.5, PM10, Độ ẩm, Gió; Chấm điểm rủi ro tự động $R = \frac{\sum w_i \cdot S_i}{\sum w_i}$ (chuẩn hóa khi 0 cảm biến).
- **API**: `GET /api/sensors`, `GET /api/sensors/stream`, `POST /api/sensors/readings`
- **Data**: Bảng `sensors`, `sensor_readings`, `sites`, `priority_score_history`
- **Runtime verification**: Test `sensors-telemetry.test.js` pass 100%.
- **Maturity**: LEVEL 5 (Production coherent).

---

## F-005 — Contractor Zero-Login Handoff & Geofence Verification (Cổng khắc phục nhà thầu)
- **User**: Nhà thầu thi công công trình
- **Entry point**: `/contractor/tasks`, `/contractor`
- **UI**: Đăng nhập nhanh bằng Quick-Token, kiểm tra Geofence $\le 50\text{m}$, đối chứng ảnh Trước / Sau (Before/After) nộp báo cáo khắc phục.
- **API**: `GET /api/contractor/tasks`, `POST /api/contractor/tasks/:id/remediate`
- **Data**: Bảng `actions`, `evidences`, `contractor_explanations`
- **Runtime verification**: Test `contractor-ui-workspace.test.js` pass 100%.
- **Maturity**: LEVEL 5 (Production coherent).

---

## F-006 — Executive Governance & Tamper-Evident Report (Báo cáo điều hành chuẩn NĐ 30/2020)
- **User**: Lãnh đạo / Cơ quan thẩm quyền
- **Entry point**: `/staff/reports`
- **UI**: Trình xuất báo cáo hành chính chuẩn A4 in ấn, mã băm văn bản docHash chống làm giả, chữ ký số HMAC.
- **API**: `GET /api/executive/reports`, `POST /api/executive/documents/:id/sign`
- **Data**: Bảng `draft_documents`, `document_revisions`, `sanction_decisions`
- **Runtime verification**: Test `executive-command-center.test.js` pass 100%.
- **Maturity**: LEVEL 5 (Production coherent).
