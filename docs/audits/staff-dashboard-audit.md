# DUSTGUARD STAFF DASHBOARD — FORENSIC AUDIT & RE-ARCHITECTURE REPORT

## 1. Executive Summary & Audit Overview
Hệ thống **DustGuard Staff Dashboard** (`/staff/*`) được thiết kế nhằm phục vụ lực lượng thanh tra, cán bộ giám sát môi trường và chính quyền địa phương trong việc tiếp nhận tín hiệu ô nhiễm bụi (PM10/PM2.5), sàng lọc phản ánh, tổ chức thanh tra hiện trường, lập hồ sơ xử lý vi phạm và theo dõi hạn định khắc phục (SLA).

Audit đa chiều (Product, Backend/API, Frontend/State, Data Integrity, UX/Design, Security/RBAC, QA/E2E) đã phát hiện các nhóm vấn đề cốt lõi cần giải quyết triệt để.

---

## 2. Phân loại Findings theo mức độ ưu tiên

### P0 — Lỗi Dữ liệu & Đứt gãy luồng vận hành (Broken / Data Integrity Issues)
1. **Fake KPI Fallback khi API Lỗi**:
   - `StaffDashboard.jsx`: Khi API thất bại, biến `calculatedSlaRate` tự gán mặc định `96.5%` và `avgScore = 65`, tạo ảo giác hệ thống vận hành trơn tru trong khi dữ liệu thực tế không có hoặc API đang mất kết nối.
   - `StaffAlerts.jsx`: Sử dụng hardcode `slaComplianceRate: 100%` và `avgResolutionHours: 0` khi mảng dữ liệu rỗng.
   - **Yêu cầu SSOT**: Phân biệt rõ ràng 4 trạng thái (`loading`, `healthy`, `empty`, `error/unavailable`). Khi API lỗi, hiển thị `— (Dữ liệu chưa khả dụng)` và thông báo mất kết nối + nút Thử lại (Retry), tuyệt đối không invent metric.

2. **Lạm dụng Mock Data / Fallback tĩnh trong Production Path**:
   - `StaffComplaints.jsx`: Khi API trả về rỗng hoặc lỗi, âm thầm fallback về `INITIAL_COMPLAINTS` tĩnh kèm hàm sinh mã ngẫu nhiên `Math.random()`.
   - `StaffCases.jsx`: Fallback về `guestCases` tĩnh nếu `caseId` bắt đầu bằng `DG-CASE-` kể cả khi người dùng đang đăng nhập phiên thật.
   - `StaffSettings.jsx`: Các thao tác lưu cấu hình dùng `setTimeout(..., 600)` giả lập thành công thay vì gọi API lưu thực tế vào D1 SQLite.

3. **Lệch chuẩn Domain Model & Risk Score Explainability**:
   - Điểm rủi ro (Risk Score / Community Priority Score) cần bảo đảm khoảng giá trị SSOT từ 0 đến 100.
   - Cần cung cấp chi tiết giải trình cấu thành điểm (Risk Explainability Breakdown: PM10/PM2.5, đối tượng nhạy cảm tiếp giáp, tiền sử tái diễn, phản ánh cộng đồng, tính toàn vẹn thiết bị) để thanh tra viên nắm rõ căn cứ ưu tiên xử lý.

---

### P1 — Lỗi Đứt gãy quy trình nghiệp vụ (Workflow Breakages)
1. **Thiếu luồng kết nối khép kín Tín hiệu → Vụ việc → Thanh tra → Hồ sơ**:
   - Tín hiệu Cảnh báo (Alerts/IoT) và Phản ánh công dân (Complaints) chưa có nút 1-click liên kết trực tiếp vào Vụ việc/Hồ sơ thanh tra đang mở (Link to Existing Incident/Case) hoặc tạo mới có liên kết khóa ngoại `complaintId` / `sourceId`.
   - Biên bản kiểm tra (`Inspection`) cần lưu trữ danh mục vi phạm thực tế gắn với căn cứ pháp lý (`LegalBasis` - Nghị định 45/2022/NĐ-CP, Nghị định 16/2022/NĐ-CP) và tự động sinh danh mục hành động khắc phục (`Action`) kèm hạn định SLA.

2. **Tách bạch Device Health (Tình trạng thiết bị) và Air Quality (Mức độ ô nhiễm)**:
   - Cảm biến mất kết nối (`OFFLINE` / `STALE`) không được đồng nghĩa với công trường an toàn (`SAFE`). Cần phân định rõ: Device Health (`ONLINE`, `STALE`, `FAULTY`, `INACTIVE`) và Pollution Risk Level (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).

---

### P2 — Nợ Kiến trúc & Information Architecture (IA Debt)
1. **Cấu trúc Menu theo Module Kỹ thuật thay vì Workflow Vận hành**:
   - Menu cũ: *Tổng quan, Công trình, Bản đồ, Phản ánh, Cảnh báo, AI Pháp lý, Cấu hình*.
   - Menu mới định hướng Workflow Vận hành (Consolidated Operations Console):
     - **TỔNG QUAN**: *Bàn điều hành Tác nghiệp (Command Center & Priority Queue)*
     - **GIÁM SÁT**: *Giám sát tập trung (Monitoring: Danh sách, Cảm biến, Chỉ số thời gian thực, Bản đồ GIS)* & *Công trình (Sites)*
     - **XỬ LÝ**: *Tình huống & Cảnh báo (Incidents / Alerts)*, *Phản ánh Công dân (Complaints Triage)*, *Thanh tra Hiện trường (Inspections)*, *Hồ sơ Vụ việc (Cases)*
     - **TUÂN THỦ**: *Hạn định SLA & Khắc phục*, *AI & Căn cứ Pháp lý*
     - **HỆ THỐNG**: *Quản trị & Cấu hình (Admin / Settings)*

2. **Tính nhất quán của Bảng Dữ liệu (DataTable Component) & Đồng bộ URL Filters**:
   - Các bộ lọc (Status, District, Risk Level, Source) phải đồng bộ 2 chiều với Search Params (`?status=...&district=...`), đảm bảo F5/reload không mất trạng thái tác nghiệp.

---

### P3 — Chuẩn hóa Design System & Trải nghiệm Người dùng (UI/UX GovTech)
1. **Chuẩn hóa Màu sắc & Bản sắc Thương hiệu DustGuard**:
   - Loại bỏ hoàn toàn glassmorphism, nền mờ, viền vàng rực không chuẩn.
   - Sử dụng chuẩn GovTech tương phản cao: Nền sáng (`#FDFBF7` cream / `#FFFFFF` trắng), Chữ đậm sắc nét (`#231B14` ink / `#182230`), Màu thương hiệu đỏ sẫm (`#9F241F` seal red).
   - Màu xanh (`teal`/`emerald`) chỉ dùng cho trạng thái ngữ nghĩa: Đạt chuẩn, An toàn, Đã khắc phục, Đang trực tuyến.

2. **Responsive Đa thiết bị**:
   - Tương thích liền mạch từ Desktop rộng (1920px, 1440px), Laptop (1280px, 1024px), Tablet (768px - thu gọn sidebar), đến Mobile (430px, 390px, 360px - stack thẻ, bảng cuộn phòng vệ, touch target >= 44px).

---

## 3. Ma trận Khắc phục Kỹ thuật (Technical Action Matrix)

| Module | Hiện trạng Trước | Sau Tái kiến trúc | API / D1 SSOT | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| **Command Center** (`/staff/dashboard`) | KPI tĩnh, fallback 96.5% SLA, nhiệm vụ localStorage | Hàng đợi Ưu tiên (Priority Queue), KPI thực D1, Fallback phòng vệ trung thực, Pipeline 7 bước | `GET /api/dashboard/operations`, `GET /api/cases`, `GET /api/sites` | Sẵn sàng |
| **Giám sát & Bản đồ** (`/staff/monitoring`, `/staff/map`) | Bản đồ tách rời, thiếu tab đồng bộ cảm biến | View Giám sát hợp nhất (Danh sách, Bản đồ GIS 200m, Node cảm biến, Điểm nóng) | `GET /api/sites`, `GET /api/sensors/reading`, `GET /api/map` | Sẵn sàng |
| **Cảnh báo & Tình huống** (`/staff/incidents`, `/staff/alerts`) | 119KB file đơn cồng kềnh, lẫn lộn test giả lập | Tách component chuẩn, liên kết 1-click tạo Case/Inspection, phân loại Device Health vs Pollution | `GET /api/alerts`, `POST /api/alerts/scan`, `POST /api/cases` | Sẵn sàng |
| **Phản ánh Dân** (`/staff/complaints`) | Fallback mock rỗng, triage chưa link khóa ngoại D1 | Side-panel Triage chi tiết, liên kết công trường & tạo hồ sơ thanh tra có lưu DB | `GET /api/complaints`, `POST /api/cases`, `PATCH /api/complaints/:id` | Sẵn sàng |
| **Thanh tra & Hiện trường** (`/staff/inspections`) | Thiếu trang quản lý danh sách thanh tra độc lập | Dashboard Thanh tra: Hàng đợi phân công, Checklist 10 tiêu chí, AI Draft hỗ trợ | `GET /api/inspections`, `POST /api/inspections`, `POST /api/inspections/:id/ai-assist` | Sẵn sàng |
| **Hồ sơ Vụ việc** (`/staff/cases`, `/staff/cases/:id`) | Mock rơi vào case có prefix DG-CASE- | 100% D1 SSOT, State Machine 7 bước, Bằng chứng SHA-256, Biên bản A4 pháp lý | `GET /api/cases/:id`, `POST /api/cases/:id/verify`, `POST /api/cases/:id/sanction` | Sẵn sàng |
| **SLA & Khắc phục** (`/staff/sla`) | Lẫn lộn trong Alerts | Bảng điều hành SLA chuyên biệt: Cảnh báo trễ hạn, Theo dõi tiến độ nhà thầu, Đo lường hiệu quả | `GET /api/executive/sla`, `GET /api/actions` | Sẵn sàng |
| **AI & Căn cứ Pháp lý** (`/staff/legal`, `/staff/ai`) | AI showcase 4 tab rời rạc | Trợ lý pháp lý tích hợp ngữ cảnh vụ việc, Human-in-the-loop, tra cứu NĐ 45/2022 & NĐ 16/2022 | `GET /api/legal`, `POST /api/ai/explain-violation`, `POST /api/ai/inspection-report` | Sẵn sàng |
| **Cấu hình & Quản trị** (`/staff/admin`, `/staff/settings`) | `setTimeout` giả lưu, lộ trường nhạy cảm | Cấu hình tham số D1 thật, che giấu API key, Kiểm toán AuditLog toàn diện | `GET /api/system/data-stats`, `GET /api/system/audit-logs`, `GET /api/config` | Sẵn sàng |
