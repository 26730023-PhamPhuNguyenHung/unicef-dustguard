# CON-03 — Tổng Hợp Vụ Việc Công Trình (Contractor Cases & Violation Dossiers)

> **Mã màn hình**: `CON-03`  
> **Tên tiếng Việt**: Tổng Hợp Vụ Việc Công Trình & Hồ Sơ Thực Chứng  
> **Tên tiếng Anh**: Contractor Cases Management & Violation Dossiers  
> **Tài liệu tham chiếu SSOT**: [`CIVIC_HANDOFF_SSOT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/CIVIC_HANDOFF_SSOT.md), [`WORKFLOWS.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/WORKFLOWS.md), [`DOMAIN.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DOMAIN.md), [`Nghị định 45/2022/NĐ-CP`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/ND-45-2022-ND-CP.md)

---

## 1. Screen Identity

| Thuộc tính | Định danh kỹ thuật SSOT |
|---|---|
| **Mã màn hình** | `CON-03` |
| **Tên tiếng Việt** | Tổng Hợp Vụ Việc Công Trình & Hồ Sơ Thực Chứng |
| **Tên tiếng Anh** | Contractor Cases Management & Violation Dossiers |
| **Đường dẫn (Route)** | `/contractor/cases` (Các alias hỗ trợ: `/contractor/cases/:id`, `/contractor/projects`) |
| **Tệp mã nguồn (Component Path)** | [`app/src/apps/contractor/pages/cases/ContractorCasesPage.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/contractor/pages/cases/ContractorCasesPage.jsx), tích hợp module tra cứu dự án và hồ sơ vụ việc [`app/src/modules/contractor/ContractorProjectDetail.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/modules/contractor/ContractorProjectDetail.jsx) và [`ContractorProjects.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/modules/contractor/ContractorProjects.jsx) |
| **Khung bố cục (Layout)** | [`app/src/apps/contractor/layout/ContractorLayout.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/contractor/layout/ContractorLayout.jsx) (Thiết kế tương phản cao, thẻ hồ sơ rõ nét, mã SSOT không bị cắt chữ) |
| **Phân quyền truy cập (RBAC)** | `contractor` (Chỉ huy trưởng công trường, Kỹ sư HSE, Giám đốc Điều hành Dự án, Cán bộ Pháp chế & Hợp đồng Nhà thầu) |
| **Trạng thái thực thi** | `ACTIVE` — Level 5 Production Coherent (Kết nối Cloudflare D1 SQLite, đồng bộ máy trạng thái 7 bước DAG) |

**Tóm tắt mục đích**: Màn hình đóng vai trò là "Sổ cái điện tử" quản lý toàn bộ các hồ sơ vụ việc phát sinh liên quan đến phát tán bụi, tiếng ồn hoặc an toàn môi trường tại các dự án, gói thầu do nhà thầu đảm nhận. Màn hình giúp Chỉ huy trưởng và Ban pháp chế nhà thầu theo dõi tường tận tiến trình thụ lý 7 bước DAG (từ tiếp nhận, khảo sát, yêu cầu khắc phục đến nghiệm thu đóng hồ sơ), xem toàn bộ biên bản kiểm tra của Đội Thanh tra Môi trường/Giao thông, lưu trữ chuỗi ảnh đối chứng Before/After có mã băm SHA-256, phân định ranh giới trách nhiệm rõ ràng và bảo vệ uy tín nhà thầu trước Chủ đầu tư và Ban Quản lý Dự án (PMU).

---

## 2. Mục Đích & Giá Trị Thực Tế

### 2.1. Giải quyết bài toán tác nghiệp hiện trường tại Việt Nam
1. **Số hóa sổ nhật ký vi phạm môi trường công trình**:
   - Thay thế việc lưu trữ biên bản giấy rời rạc, dễ thất lạc hoặc bị động khi Chủ đầu tư kiểm tra đột xuất bằng cơ sở dữ liệu số hóa tập trung trên Cloudflare D1.
   - Mọi biên bản nhắc nhở, yêu cầu chấn chỉnh đều được gắn mã SSOT duy nhất (VD: `#CASE-2026-0420`, `#BD-0237`) kèm đầy đủ mốc thời gian và danh tính cán bộ lập hồ sơ.
2. **Theo dõi tiến độ quy trình chuẩn 7 bước (7-Step Case DAG)**:
   - Giúp nhà thầu nắm rõ tình trạng pháp lý thực tế của từng hồ sơ:  
     $$\text{1. Tiếp nhận (INTAKE)} \longrightarrow \text{2. Khảo sát (SURVEYED)} \longrightarrow \text{3. Đề xuất (PROPOSED)} \longrightarrow \text{4. Phê duyệt (APPROVED)} \longrightarrow \text{5. Khắc phục (REMEDIATED)} \longrightarrow \text{6. Nghiệm thu (VERIFIED)} \longrightarrow \text{7. Đóng hồ sơ (CLOSED)}$$
   - Nhà thầu luôn biết chính xác hồ sơ đang chờ hành động từ phía ai: *Chờ nhà thầu nộp ảnh*, *Chờ cán bộ nghiệm thu* hay *Đã hoàn tất an toàn*.
3. **Phân định ranh giới trách nhiệm & Cơ sở thực chứng đối thoại xây dựng**:
   - Trong thi công đô thị tại Việt Nam, bụi thường phát sinh từ nhiều nguồn đan xen (xe cộ lưu thông trên đường vành đai, công trình lân cận, bùn đất từ các ngõ hẻm).
   - Hồ sơ vụ việc lưu trữ tọa độ WGS84 chính xác, dữ liệu cảm biến bụi PM2.5/PM10 và chuỗi ảnh Before/After giúp nhà thầu chứng minh rõ ràng: *Bụi phát sinh từ đâu, nhà thầu đã xử lý những gì*, tránh bị quy kết oan sai hoặc chịu phạt thay cho các đơn vị khác.
4. **Hồ sơ minh chứng chống phạt tiền theo Nghị định 45/2022/NĐ-CP**:
   - Khi Thanh tra Sở Xây dựng hoặc Đội Quản lý Trật tự Đô thị & Môi trường kiểm tra, nhà thầu có thể xuất trình ngay hồ sơ điện tử có đầy đủ mã băm SHA-256 chứng minh công trình đã khắc phục triệt để trong 24h - 48h, là căn cứ vững chắc để không bị lập biên bản xử phạt vi phạm hành chính 10 - 50 triệu đồng.

### 2.2. So sánh hiệu quả tác nghiệp (Trước và Sau khi có CON-03)

| Tiêu chí | Quản lý truyền thống (Hồ sơ giấy / Trao đổi miệng) | Quản lý số hóa DustGuard VN (CON-03) |
|---|---|---|
| **Tra cứu lịch sử vi phạm** | Mất nhiều giờ lục tìm hồ sơ giấy trong lán trại | **< 3 giây** tìm kiếm theo mã vụ việc hoặc ngày tháng |
| **Tính minh bạch tiến trình** | Không rõ hồ sơ đã được thanh tra nghiệm thu chưa | Hiển thị trực quan 7 bước DAG theo thời gian thực |
| **Phân định trách nhiệm** | Thường chịu phạt oan khi có tranh chấp với dân | Chuỗi ảnh Before/After và Geofence 50m chứng minh rõ ràng |
| **Chuẩn bị hồ sơ giao ban** | Tốn nhiều công sức tổng hợp báo cáo tuần | 1 Click xem toàn bộ vụ việc đã xử lý xong trong tháng |
| **Uy tín với Chủ đầu tư** | Bị đánh giá thụ động, thiếu chuyên nghiệp | Chuyên nghiệp, bài bản, minh bạch dữ liệu kỹ thuật số |

---

## 3. Đối Tượng Người Dùng & Hành Trình Thao Tác (User Journey & Core Flow)

### 3.1. Chân dung người dùng mục tiêu (Personas)
1. **Kỹ sư Nguyễn Văn Hùng — Chỉ huy trưởng công trường (Hancorp / Vinaconex)**:
   - *Mục tiêu*: Kiểm tra tổng số hồ sơ vụ việc đang mở của công trường trước các buổi họp giao ban với Ban Quản lý Dự án (PMU).
2. **Kỹ sư Trần Anh Tuấn — Kỹ sư An toàn & Môi trường HSE**:
   - *Mục tiêu*: Mở chi tiết từng vụ việc để xem kết luận của Đội Thanh tra Môi trường, kiểm tra xem ảnh After đã được phê duyệt nghiệm thu chưa.
3. **Luật sư / Cán bộ Pháp chế Nhà thầu**:
   - *Mục tiêu*: Trích xuất bằng chứng số (ảnh kèm mã SHA-256 và tem thời gian) để giải trình với cơ quan quản lý nhà nước khi có yêu cầu thanh tra định kỳ.

### 3.2. Sơ đồ quy trình tra cứu và quản lý hồ sơ vụ việc

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [Chỉ huy trưởng / Kỹ sư HSE mở mục "Hồ sơ vụ việc" (/contractor/cases)]                │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ DANH SÁCH TỔNG HỢP HỒ SƠ VỤ VIỆC (CON-03)                                              │
│ ├─► Xem tổng số hồ sơ theo trạng thái: [Tất cả: 14] [Đang thụ lý: 2] [Đã đóng: 12]     │
│ ├─► Lọc nhanh theo: Mức độ ưu tiên, Gói thầu thi công, Ngày lập biên bản              │
│ └─► Tìm kiếm theo Mã hồ sơ (VD: #CASE-2026-0420) hoặc Từ khóa (Cổng số 2, Bãi cát)   │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [Bấm chọn một Thẻ hồ sơ vụ việc cụ thể]                                                │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ XEM CHI TIẾT HỒ SƠ THỰC CHỨNG VỤ VIỆC (CASE DOSSIER DETAIL)                            │
│ ├─► 1. Thanh tiến trình 7 bước DAG: Đang ở bước nào (Khắc phục -> Nghiệm thu -> Đóng)  │
│ ├─► 2. Cặp ảnh đối chứng Before (Vi phạm ban đầu) và After (Đã khắc phục) có SHA-256   │
│ ├─► 3. Dòng thời gian tác nghiệp (Audit Timeline): Ai lập biên bản, Ai nộp ảnh, Ai duyệt│
│ ├─► 4. Ý kiến kết luận & Chữ ký điện tử của Cán bộ Thanh tra Môi trường               │
│ └─► 5. Bấm [In hồ sơ A4] hoặc [Tải bản giải trình PDF]                                 │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Bố Cục Giao Diện & Phân Cấp Thông Tin (Information Hierarchy & Wireframe)

### 4.1. Phân cấp thông tin (Information Hierarchy)
1. **Header trang & Thống kê nhanh**:
   - Tiêu đề: *Tổng Hợp Hồ Sơ Vụ Việc Công Trình*.
   - Hướng dẫn: *Theo dõi các biên bản nhắc nhở, hồ sơ xử lý bụi và tiến trình nghiệm thu 7 bước của công trình.*
   - Dải lọc 4 Tab: `Tất cả vụ việc (14)`, `Đang thụ lý (2)`, `Chờ nghiệm thu (1)`, `Đã nghiệm thu & Đóng (11)`.
2. **Khung tìm kiếm & Bộ lọc nâng cao**:
   - Ô tìm kiếm: Nhập mã hồ sơ (VD: `0420`), tên gói thầu hoặc vị trí vi phạm.
   - Bộ lọc theo: Mức độ ưu tiên (`Tất cả`, `Khẩn cấp`, `Trung bình`), Thời gian lập.
3. **Danh sách thẻ hồ sơ vụ việc (Cases List Grid)**:
   - **Mã hồ sơ SSOT duy nhất**: Font Monospace đậm, hiển thị trọn vẹn (VD: `#CASE-2026-0420`, `#CASE-2026-0388`).
   - **Huy hiệu trạng thái 7 bước (`StatusBadge`)**:
     - `ĐANG THỤ LÝ / ĐANG KHẮC PHỤC`: Nền Vàng hổ phách `#FEF3C7`, Chữ `#B45309`.
     - `CHỜ NGHIỆM THU`: Nền Xanh dương `#DBEAFE`, Chữ `#1D4ED8`.
     - `ĐÃ NGHIỆM THU / ĐÃ ĐÓNG`: Nền Xanh ngọc `#CCFBF1`, Chữ `#047857`.
   - **Tiêu đề tóm tắt vụ việc**: Nội dung ngắn gọn, súc tích (VD: *Bụi phát tán do xe tải chở đất móng Cổng số 2*).
   - **Thông tin đơn vị lập & Thời hạn**: Ngày lập biên bản, Đơn vị kiểm tra (Tổ TT Môi trường số 01), Hạn chót SLA.
   - **Thanh tiến trình 7 bước DAG mini**: Hiển thị trực quan 7 chấm tròn tiến độ.
4. **Khối chi tiết hồ sơ khi mở xem (Case Dossier Modal / View)**:
   - Cột trái: Thông tin bối cảnh, tọa độ WGS84, điểm rủi ro.
   - Cột phải: Cặp ảnh Before/After kèm mã băm SHA-256 và nhật ký audit timeline từng phút.

### 4.2. Wireframe Giao Diện Màn Hình Lớn (Desktop 1366px - 1920px)

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [LOGO] DUSTGUARD VN  [NHÀ THẦU XÂY DỰNG]   Dự án: Chung Cư Thanh Xuân Garden     Kỹ sư: Nguyễn Văn Hùng  [ Đăng xuất ] │
├────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────┤
│ QUẢN LÝ CÔNG TRƯỜNG   │ TỔNG HỢP HỒ SƠ VỤ VIỆC & BIÊN BẢN CÔNG TRÌNH                                                  │
│ [ ] Tổng quan          │ Theo dõi các biên bản kiểm tra, nhắc nhở và tiến trình nghiệm thu 7 bước DAG                  │
│ [ ] Nhiệm vụ khắc phục │                                                                                               │
│ [●] Hồ sơ vụ việc      │ [ Tất cả vụ việc: 14 ] [ ⚠️ Đang xử lý: 2 ] [ ⏳ Chờ nghiệm thu: 1 ] [ ✓ Đã hoàn tất: 11 ]     │
│ [ ] Báo cáo tuân thủ   │ ───────────────────────────────────────────────────────────────────────────────────────────── │
│                        │ [ 🔍 Tìm theo mã hồ sơ, vị trí cổng... ]  [ Mức độ: Tất cả ▼ ]  [ Gói thầu: Tất cả ▼ ]        │
│                        │                                                                                               │
│                        │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│                        │ │ [#CASE-2026-0420]  [GÓI THẦU XL-01]                     [ TRẠNG THÁI: CHỜ NGHIỆM THU ]    │ │
│                        │ │ Tiêu đề: Bụi phát tán do xe ben vận chuyển đất móng Cổng số 2 ra đường Nguyễn Trãi        │ │
│                        │ │ Đơn vị kiểm tra: Đội TT Môi trường Quận Thanh Xuân  •  Ngày lập: 02/09/2026 09:15          │ │
│                        │ │ Tiến trình 7 bước: [1.Tiếp nhận]──►[2.Khảo sát]──►[3.Đề xuất]──►[4.Đã khắc phục]──►[5.Duyệt]│
│                        │ │ Ảnh đối chứng: [🖼️ Before (Bụi mù)] ──► [🖼️ After (Đã rửa xe & tưới nước)] [SHA-256 ✓]   │ │
│                        │ │                                                        [ 📄 XEM CHI TIẾT HỒ SƠ → ]        │ │
│                        │ ├───────────────────────────────────────────────────────────────────────────────────────────┤ │
│                        │ │ [#CASE-2026-0388]  [GÓI THẦU XL-01]                     [ TRẠNG THÁI: ĐANG KHẮC PHỤC ]    │ │
│                        │ │ Tiêu đề: Chưa phủ bạt bãi tập kết cát đá thô tại khu vực Zone B                           │ │
│                        │ │ Đơn vị kiểm tra: Cán bộ giám sát PMU               •  Hạn xử lý: 03/09/2026 10:00          │ │
│                        │ │ Tiến trình 7 bước: [1.Tiếp nhận]──►[2.Khảo sát]──►[3.Đang che phủ bạt...]                  │ │
│                        │ │                                                        [ 📷 NỘP MINH CHỨNG KHẮC PHỤC → ]  │ │
│                        │ ├───────────────────────────────────────────────────────────────────────────────────────────┤ │
│                        │ │ [#CASE-2026-0291]  [GÓI THẦU XL-01]                     [ TRẠNG THÁI: ĐÃ ĐÓNG & LƯU TRỮ ] │ │
│                        │ │ Tiêu đề: Phát sinh bụi trong ca thi công khoan cọc nhồi ban đêm                          │ │
│                        │ │ Ngày lập: 20/08/2026 • Kết luận: Đã lắp vòi phun sương, đạt chuẩn QCVN 18:2021/BXD        │ │
│                        │ │ Tiến trình 7 bước: [HOÀN TẤT 7/7 BƯỚC] • Không bị phạt hành chính NĐ 45/2022/NĐ-CP        │ │
│                        │ │                                                        [ 🔍 XEM BIÊN BẢN NGHIỆM THU → ]   │ │
│                        │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.3. Wireframe Giao Diện Mobile (360px - 430px)

```text
┌──────────────────────────────────────────┐
│ [≡] DUSTGUARD VN  [VINACONEX]        [👤]│
├──────────────────────────────────────────┤
│ HỒ SƠ VỤ VIỆC CÔNG TRÌNH                 │
│ [ Tất cả: 14 ] [ Đang làm: 2 ] [ Đã đóng]│
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ [#CASE-2026-0420]                    │ │
│ │ [ CHỜ NGHIỆM THU ]                   │ │
│ │ Bụi xe tải vận chuyển Cổng số 2      │ │
│ │ Ngày lập: 02/09/2026 • Hạn: 48h      │ │
│ │ Cặp ảnh: [Before ✓] ──► [After ✓]    │ │
│ │ Mã băm: sha256_9f241f48... [✓]       │ │
│ │ ┌──────────────────────────────────┐ │ │
│ │ │      📄 XEM CHI TIẾT HỒ SƠ       │ │ │ (Nút to h-48px)
│ │ └──────────────────────────────────┘ │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ [#CASE-2026-0388]                    │ │
│ │ [ ⚠️ ĐANG KHẮC PHỤC ]                 │ │
│ │ Chưa phủ bạt bãi cát Zone B          │ │
│ │ Hạn chót: Ngày mai 10:00             │ │
│ │ ┌──────────────────────────────────┐ │ │
│ │ │    📷 NỘP ẢNH ĐỐI CHỨNG NGAY     │ │ │ (Nút to h-48px)
│ │ └──────────────────────────────────┘ │ │
│ └──────────────────────────────────────┘ │
├──────────────────────────────────────────┤
│ [🏠 Tổng quan] [📋 Nhiệm vụ] [📁 Vụ việc]│
└──────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & API / D1 Database Contract

### 5.1. Các Endpoints API Phục Vụ Màn Hình
- `GET /api/cases`: Lấy danh sách hồ sơ vụ việc của các công trình trực thuộc nhà thầu (hỗ trợ phân trang, lọc theo `siteId`, `status`, `priority`).
- `GET /api/cases/:id`: Lấy chi tiết toàn bộ hồ sơ vụ việc, bao gồm tiến trình 7 bước DAG, cặp ảnh Before/After, mã băm SHA-256 và nhật ký kiểm toán.
- `GET /api/cases/:id/dossier`: Trích xuất bộ hồ sơ thực chứng có cấu trúc A4 (Structured Civic Dossier).

### 5.2. Cấu Trúc Payload JSON Chuẩn (Response Contract)

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "case_2026_0420",
        "code": "CASE-2026-0420",
        "siteId": "site_tx_02",
        "siteName": "Dự án Khu Chung Cư Thanh Xuân Garden",
        "package": "Gói thầu XL-01",
        "title": "Bụi phát tán do xe ben vận chuyển đất móng Cổng số 2 ra đường Nguyễn Trãi",
        "status": "REMEDIATED",
        "currentStep": "VERIFICATION_PENDING",
        "stepIndex": 5,
        "totalSteps": 7,
        "priority": "HIGH",
        "riskScore": 68,
        "inspectorName": "Đ/c Lê Văn Minh (Đội TT Môi trường)",
        "createdAt": "2026-09-02T09:15:00+07:00",
        "slaDeadline": "2026-09-04T09:15:00+07:00",
        "hoursRemaining": 42.0,
        "beforeEvidence": {
          "url": "https://r2.dustguard.vn/evidences/case_0420_before.jpg",
          "sha256": "9f241f48a9b23c5e88d107a63456bcf291823d4e08c1a27e31b671a9382101fb",
          "capturedAt": "2026-09-02T09:10:00+07:00"
        },
        "afterEvidence": {
          "url": "https://r2.dustguard.vn/evidences/case_0420_after.jpg",
          "sha256": "3a7b1f48a9b23c5e88d107a63456bcf291823d4e08c1a27e31b671a9382103cc",
          "capturedAt": "2026-09-02T15:10:00+07:00",
          "distanceMeters": 14.2,
          "geofenceStatus": "VALID_50M_BUFFER"
        },
        "explanation": "Đã cho vận hành trạm rửa xe 100% chuyến xe tải và tưới nước dập bụi 200m đường gom.",
        "legalStatus": "PENDING_ACCEPTANCE_NO_PENALTY"
      }
    ],
    "pagination": {
      "total": 14,
      "page": 1,
      "pageSize": 10,
      "totalPages": 2
    }
  }
}
```

### 5.3. Liên kết 12 Bảng D1 Database SSOT
- `cases`: Bảng dữ liệu chính của hồ sơ vụ việc (`id`, `code`, `siteId`, `title`, `status`, `currentStep`, `riskScore`, `slaDeadline`).
- `sites`: Thông tin định danh công trình và nhà thầu đảm nhận (`name`, `contractorName`, `address`, `latitude`, `longitude`).
- `case_timelines`: Ghi nhận từng bước chuyển trạng thái trong State Machine 7 bước.
- `evidences`: Lưu trữ bản ghi ảnh Before và After kèm mã băm SHA-256 và tọa độ GPS.
- `contractor_explanations`: Lưu trữ nội dung giải trình và tiến độ xử lý của đơn vị thi công.
- `audit_logs`: Bảng nhật ký kiểm toán bất biến phục vụ thanh tra pháp lý.

---

## 6. Bảng Nút Bấm & Tương Tác CTAs (Interactive Actions)

| Tên nút / Thao tác | Vị trí hiển thị | Loại CTA | Kích thước Touch | Hành vi hệ thống | Điều kiện kích hoạt | Phân quyền |
|---|---|---|---|---|---|---|
| **[📄 Xem chi tiết hồ sơ]** | Trên từng thẻ vụ việc | Primary CTA (Teal `#0D6F64`) | $\ge 48\text{px}$ chiều cao | Mở trang hoặc popup xem chi tiết tiến trình 7 bước và ảnh Before/After | Luôn sẵn sàng | `contractor` |
| **[📷 Nộp minh chứng khắc phục]** | Thẻ vụ việc đang xử lý | Action CTA (Amber `#B45309`) | $\ge 48\text{px}$ chiều cao | Điều hướng sang CON-02 kèm mã `caseId` để nộp ảnh After | Vụ việc ở bước `PROPOSED` / `REMEDIATING` | `contractor` |
| **[🔍 Xem biên bản nghiệm thu]** | Thẻ vụ việc đã hoàn tất | Secondary CTA (Emerald) | $\ge 44\text{px}$ chiều cao | Xem văn bản nghiệm thu chính thức của Cán bộ thanh tra | Vụ việc ở bước `VERIFIED` / `CLOSED` | `contractor` |
| **[Bộ lọc trạng thái Tab]** | Thanh điều hướng phụ | Filter CTA (Stone) | $\ge 44\text{px}$ touch area | Lọc danh sách vụ việc theo nhóm trạng thái | Luôn sẵn sàng | `contractor` |
| **[Tìm kiếm hồ sơ]** | Thanh công cụ | Search Input | Font 16px, h-44px | Lọc tức thì danh sách vụ việc theo từ khóa gõ vào | Luôn sẵn sàng | `contractor` |

---

## 7. Quy Chuẩn UI/UX & Responsive

### 7.1. Trình bày thông tin minh bạch (Zero Truncate on Critical Entities)
- **Tuyệt đối không cắt ngắn mã hồ sơ & Tên công trình**: Cấm áp dụng `truncate` hay `line-clamp-1` lên mã hồ sơ (VD: `#CASE-2026-0420`) và tên dự án/nhà thầu để bảo đảm cán bộ và chỉ huy trưởng luôn đọc được toàn vẹn thông tin khi đối chiếu biên bản giấy.
- **Bảng màu trạng thái tương phản cao**:
  - `INTAKE / MỚI TIẾP NHẬN`: Nền `#EFF6FF` (Blue 50), Viền `#3B82F6` (Blue 500), Chữ `#1D4ED8` (Blue 700).
  - `REMEDIATING / ĐANG XỬ LÝ`: Nền `#FEF3C7` (Amber 100), Viền `#D97706` (Amber 600), Chữ `#B45309` (Amber 700).
  - `VERIFIED / ĐÃ NGHIỆM THU`: Nền `#CCFBF1` (Teal 100), Viền `#0D6F64` (Teal 700), Chữ `#047857` (Emerald 700).
  - `CLOSED / ĐÃ ĐÓNG LƯU TRỮ`: Nền `#F5F5F4` (Stone 100), Viền `#A8A29E` (Stone 400), Chữ `#57534E` (Stone 600).

### 7.2. Tương thích đa thiết bị (Responsive Matrix)
- **Mobile nhỏ (360px - 430px)**: Thẻ vụ việc hiển thị dạng khối dọc, thanh tiến trình 7 bước thu gọn thành dạng chấm bước `4/7`, các nút bấm to $48\text{px}$ chiếm toàn bộ chiều rộng thẻ.
- **Tablet (768px - 1024px)**: Bố cục 1 cột rộng rãi, thanh tiến trình 7 bước hiển thị đầy đủ tên các giai đoạn.
- **Laptop & Desktop (1366px - 1920px)**: Bố cục danh sách dạng bảng thẻ (Card Rows) chuyên nghiệp, có khung xem trước nhanh thumbnail ảnh Before/After bên phải.

---

## 8. Bẫy Lỗi Thường Gặp & Hướng Dẫn Kiểm Thử

### 8.1. Các bẫy lỗi thực tế tại công trường & Giải pháp phòng ngừa
1. **Bẫy lỗi chậm truy vấn khi số lượng hồ sơ vụ việc tăng cao**:
   - *Hiện tượng*: Khi dự án kéo dài 2-3 năm, số lượng vụ việc và bản ghi giải trình lên tới hàng ngàn, query bảng `cases` bị chậm.
   - *Giải pháp*: Tạo Composite Index trong Cloudflare D1:  
     `CREATE INDEX idx_cases_site_status ON cases(siteId, status, createdAt DESC);`
2. **Bẫy lỗi lệch múi giờ khi hiển thị ngày lập biên bản**:
   - *Hiện tượng*: Thời gian ISO UTC (`2026-09-02T02:15:00Z`) bị hiển thị sai thành 02:15 sáng thay vì 09:15 sáng giờ Việt Nam (GMT+7).
   - *Giải pháp*: Luôn định dạng qua hàm SSOT `formatCivicDateTime()` với `timeZone: 'Asia/Ho_Chi_Minh'`.

### 8.2. Hướng dẫn kiểm thử tự động qua CLI PowerShell

```powershell
# 1. Chạy bài kiểm thử đơn lẻ cho hồ sơ vụ việc và máy trạng thái 7 bước DAG (< 0.5s)
node --test app/tests/case-enforcement-dag-7steps.test.js

# 2. Kiểm tra truy vấn D1 Schema cho bảng cases và contractor_explanations
node --test app/tests/d1-schema.test.js

# 3. Kiểm tra tuân thủ bộ token thiết kế Civic High-Contrast
node --test app/tests/design-system-tokens.test.js

# 4. Chạy cổng kiểm định nhanh cấp độ 3 trước khi commit
npm --prefix app run verify:quick
```
