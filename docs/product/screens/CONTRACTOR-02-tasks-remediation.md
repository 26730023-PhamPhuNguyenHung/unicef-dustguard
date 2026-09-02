# CON-02 — Tiếp Nhận Khắc Phục & Đối Chứng Trước/Sau (Remediation Tasks & Before/After Evidence)

> **Mã màn hình**: `CON-02`  
> **Tên tiếng Việt**: Tiếp Nhận Khắc Phục & Nộp Bằng Chứng Đối Chứng Trước/Sau  
> **Tên tiếng Anh**: Remediation Tasks Workspace & Before/After Tamper-Evident Verification  
> **Tài liệu tham chiếu SSOT**: [`CIVIC_HANDOFF_SSOT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/CIVIC_HANDOFF_SSOT.md), [`DOMAIN.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DOMAIN.md), [`QCVN 18:2021/BXD`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/QCVN-18-2021-BXD.md), [`Nghị định 45/2022/NĐ-CP`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/ND-45-2022-ND-CP.md)

---

## 1. Screen Identity

| Thuộc tính | Định danh kỹ thuật SSOT |
|---|---|
| **Mã màn hình** | `CON-02` |
| **Tên tiếng Việt** | Tiếp Nhận Khắc Phục & Nộp Bằng Chứng Đối Chứng Trước/Sau |
| **Tên tiếng Anh** | Remediation Tasks Workspace & Before/After Tamper-Evident Verification |
| **Đường dẫn (Route)** | `/contractor/tasks` (Các alias hỗ trợ: `/contractor/actions`, `/contractor/remediation/:id`, `/contractor/quick-submit`) |
| **Tệp mã nguồn (Component Path)** | [`app/src/apps/contractor/pages/tasks/ContractorTasksPage.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/contractor/pages/tasks/ContractorTasksPage.jsx), tích hợp module nâng cao [`app/src/modules/contractor/ContractorEvidenceUpload.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/modules/contractor/ContractorEvidenceUpload.jsx), [`ContractorActionDetail.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/modules/contractor/ContractorActionDetail.jsx) và [`ContractorActionList.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/modules/contractor/ContractorActionList.jsx) |
| **Khung bố cục (Layout)** | [`app/src/apps/contractor/layout/ContractorLayout.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/contractor/layout/ContractorLayout.jsx) (Tối ưu giao diện thao tác ngoài trời chói nắng, nút bấm to $\ge 48\text{px}$, kích hoạt camera sau 1 chạm) |
| **Phân quyền truy cập (RBAC)** | `contractor` (Chỉ huy trưởng công trường, Kỹ sư An toàn & Môi trường HSE, Đội trưởng thi công đào móng, Đội trưởng cơ giới rửa xe) |
| **Trạng thái thực thi** | `ACTIVE` — Level 5 Production Coherent (Kết nối Cloudflare D1 SQLite, lưu trữ Cloudflare R2, Web Crypto API tính mã băm SHA-256 client-side, Haversine Geofence $\le 50\text{m}$) |

**Tóm tắt mục đích**: Màn hình là không gian tác nghiệp hiện trường cốt lõi của đơn vị thi công tại công trường xây dựng. Khi nhận được yêu cầu xử lý bụi từ Tổ thanh tra môi trường/Thanh tra giao thông/Phản ánh cộng đồng (kèm ảnh vi phạm ban đầu - Before Photo), Chỉ huy trưởng hoặc Kỹ sư HSE kích hoạt quy trình khắc phục thực địa (tưới nước dập bụi, phủ bạt bãi vật liệu, rửa bánh xe tải ra vào). Sau đó, người phụ trách mở camera điện thoại chụp ảnh hiện trường đã xử lý (After Photo), hệ thống tự động kiểm định GPS Geofence $\le 50\text{m}$ so với tâm công trình và sinh mã băm SHA-256 chống chỉnh sửa giả mạo, nộp bản giải trình điện tử hoàn tất trong 24h - 48h để nghiệm thu đóng hồ sơ, ngăn chặn nguy cơ bị phạt 10 - 50 triệu đồng theo Nghị định 45/2022/NĐ-CP hoặc đình chỉ thi công.

---

## 2. Mục Đích & Giá Trị Thực Tế

### 2.1. Giải quyết bài toán tác nghiệp hiện trường tại Việt Nam
1. **Minh bạch hóa chuỗi bằng chứng Trước — Sau (Before / After Evidence)**:
   - Thay vì tranh cãi bằng miệng hay biên bản giấy chung chung, hệ thống hiển thị trực tiếp ảnh vi phạm ban đầu (*Before Photo*: xe ben chở đất móng không rửa bánh làm rơi vãi đất cát, đường gom bụi mù mịt, bãi cát khô không che bạt).
   - Nhà thầu nộp ảnh chụp góc tương ứng sau khi đã hoàn thành các biện pháp (*After Photo*: đường gom đã được tưới ẩm sạch sẽ, bạt chuyên dụng phủ kín đống vật liệu, cầu rửa xe đang phun nước áp lực cao).
2. **Kiểm tra vị trí GPS Geofence $\le 50\text{m}$ (Chống nộp ảnh giả mạo từ xa)**:
   - Tự động lấy tọa độ WGS84 của thiết bị người chụp và tính toán khoảng cách thực tế tới tọa độ tâm công trường bằng công thức Haversine.
   - Ngăn chặn triệt để tình trạng ngồi tại quán cà phê lấy ảnh cũ trên mạng hoặc nộp ảnh chụp ở địa điểm khác để đối phó.
3. **Mã băm toàn vẹn SHA-256 (Tamper-Evident Web Crypto)**:
   - Tệp ảnh được tính toán chuỗi mã băm SHA-256 (64 ký tự hex) ngay trong trình duyệt của điện thoại trước khi tải lên Cloudflare R2.
   - Đảm bảo tính pháp lý bất biến: Bức ảnh không thể bị chỉnh sửa Photoshop, can thiệp hậu kỳ hay thay đổi tem thời gian.
4. **Phòng ngừa xử phạt hành chính theo Nghị định 45/2022/NĐ-CP & Nghị định 16/2022/NĐ-CP**:
   - Quy định tại Điều 20 & Điều 26 NĐ 45/2022/NĐ-CP: Phạt tiền từ **10.000.000đ đến 50.000.000đ** và đình chỉ hoạt động thi công từ 01 đến 03 tháng đối với công trình xây dựng không thực hiện các biện pháp giảm thiểu bụi, làm phát tán bụi vào khu dân cư.
   - Nộp giải trình điện tử kèm ảnh nghiệm thu chuẩn chỉ giúp nhà thầu chứng minh tinh thần cầu thị, chủ động khắc phục kịp thời, chuyển trạng thái từ vi phạm sang tuân thủ đạt chuẩn [QCVN 18:2021/BXD](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/QCVN-18-2021-BXD.md).

### 2.2. So sánh hiệu quả tác nghiệp (Trước và Sau khi có CON-02)

| Tiêu chí | Quy trình truyền thống (Biên bản giấy / Giám sát thủ công) | Quy trình số hóa DustGuard VN (CON-02) |
|---|---|---|
| **Xem bằng chứng vi phạm** | Cán bộ gọi điện mô tả chung chung, dễ nhầm lẫn vị trí | Xem trực tiếp ảnh vi phạm Before nét căng kèm tọa độ GPS |
| **Xác thực hiện trường** | Khó kiểm chứng thời gian và địa điểm chụp ảnh | Tự động đo Geofence $\le 50\text{m}$ và mã băm SHA-256 |
| **Thời gian nộp giải trình** | Mất 2 - 3 ngày soạn công văn giấy gửi phòng Một Cửa | **< 2 phút** nộp trực tiếp từ điện thoại ngoài công trường |
| **Khả năng nghiệm thu** | Chờ đoàn thanh tra sắp xếp lịch tái kiểm tra | Cán bộ xem ảnh Before/After đối chứng và duyệt online |
| **Nguy cơ phạt tiền / Đình chỉ** | Rất cao do quá hạn văn bản hành chính | **Triệt tiêu** nhờ hoàn tất đúng hạn SLA 24h - 48h |

---

## 3. Đối Tượng Người Dùng & Hành Trình Thao Tác (User Journey & Core Flow)

### 3.1. Chân dung người dùng mục tiêu (Personas)
1. **Kỹ sư Trần Anh Tuấn — Đội trưởng An toàn & Môi trường HSE (Coteccons / Vinaconex)**:
   - *Đặc điểm*: Thường xuyên túc trực tại các cổng ra vào công trường, giám sát xe ra vào, mang điện thoại thông minh và đồ bảo hộ lao động (mũ cứng, găng tay, giày bảo hộ).
   - *Hành động chính*: Mở nhiệm vụ, kiểm tra ảnh Before, điều động công nhân làm sạch, mở camera chụp ảnh After và gửi nghiệm thu.
2. **Kỹ sư Nguyễn Văn Hùng — Chỉ huy trưởng công trường**:
   - *Đặc điểm*: Duyệt nội dung giải trình kỹ thuật trước khi gửi cán bộ thanh tra môi trường.
3. **Đội trưởng cơ giới & Đội thi công hạ tầng**:
   - *Đặc điểm*: Nhận lệnh điều xe bồn tưới nước, bật máy bơm rửa xe áp lực cao và kéo bạt che bãi cát.

### 3.2. Sơ đồ quy trình tác nghiệp chuẩn (Remediation Lifecycle Flow)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [BƯỚC 1: TIẾP NHẬN NHIỆM VỤ KHẮC PHỤC]                                                │
│ • Xem chi tiết vi phạm: Vị trí (Cổng số 2, Bãi cát Zone B), Hạn SLA (24h - 48h)        │
│ • Bấm xem "Ảnh vi phạm ban đầu (Before Photo)" để nắm rõ lỗi phát tán bụi              │
│ • Bấm nút [Bắt đầu khắc phục] ──► Chuyển trạng thái sang IN_PROGRESS                  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [BƯỚC 2: TRIỂN KHAI THỰC ĐỊA TẠI CÔNG TRƯỜNG]                                          │
│ • Điều xe bồn tưới nước dập bụi đường gom & mặt bằng thi công                         │
│ • Kéo bạt chuyên dụng phủ kín 100% bãi tập kết cát đá thô                             │
│ • Vận hành máy xịt rửa lốp áp lực cao cho 100% lượt xe tải ben rời công trình          │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [BƯỚC 3: MỞ MODAL / KHUNG NỘP MINH CHỨNG ĐỐI CHỨNG (CON-02)]                           │
│ ├─► 1. Chụp ảnh Sau (After Photo) ──► Kích hoạt Camera sau, Client tính SHA-256 (64 hex)│
│ ├─► 2. Kiểm tra định vị GPS ──► Tự động xác thực Haversine: Khoảng cách <= 50m (HỢP LỆ) │
│ ├─► 3. Tích chọn các mục đã hoàn thành trong Bảng 10 tiêu chuẩn thi công              │
│ └─► 4. Nhập nội dung giải trình biện pháp kỹ thuật đã xử lý                           │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [BƯỚC 4: BẤM "XÁC NHẬN HOÀN THÀNH & NỘP MINH CHỨNG"]                                   │
│ • Tải ảnh lên Cloudflare R2 Storage kèm tem thời gian ISO-8601                        │
│ • Cập nhật CSDL Cloudflare D1: trạng thái chuyển sang PENDING_VERIFICATION            │
│ • Gửi thông báo tự động tới Tổ thanh tra / Cán bộ phụ trách địa bàn                   │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [BƯỚC 5: CÁN BỘ THANH TRA DUYỆT ĐỐI CHỨNG BEFORE/AFTER]                                │
│ • Cán bộ xem cặp ảnh Before/After đối chứng trên màn hình STF-05                      │
│ • Bấm [Chấp thuận nghiệm thu] ──► Trạng thái hoàn tất (VERIFIED / CLOSED)              │
│ • Hồ sơ lưu trữ vĩnh viễn, tránh biên bản xử phạt 10 - 50 triệu đồng                  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Bố Cục Giao Diện & Phân Cấp Thông Tin (Information Hierarchy & Wireframe)

### 4.1. Phân cấp thông tin (Information Hierarchy)
1. **Header trang & Bộ lọc trạng thái**:
   - Tiêu đề: *Nhiệm Vụ Khắc Phục Bụi & Nộp Bằng Chứng Đối Chứng*.
   - Mô tả: *Tiếp nhận yêu cầu chấn chỉnh, triển khai các biện pháp dập bụi và nộp ảnh chụp hiện trường trong phạm vi 50m.*
   - Bộ lọc 4 Tab: `Tất cả (12)`, `Cần làm (3)`, `Đang xử lý (1)`, `Chờ nghiệm thu (1)`, `Đã hoàn tất (7)`.
2. **Danh sách thẻ nhiệm vụ (Remediation Task Cards Grid)**:
   - Hiển thị 2 cột trên Desktop hoặc 1 cột dạng danh sách cuộn trên Smartphone.
   - Mỗi thẻ bao gồm:
     - Dòng 1: Mã tác vụ (Mono: `#ACT-2026-089`) + Huy hiệu mức độ khẩn cấp (`ƯU TIÊN CAO` / `TRUNG BÌNH`).
     - Dòng 2: Tiêu đề nhiệm vụ thực tế (VD: *Tưới ẩm đường gom và vận hành rửa lốp Cổng số 2*).
     - Dòng 3: Khối ảnh vi phạm Before (Thumbnail nhỏ kèm nút `[Xem ảnh vi phạm]`).
     - Dòng 4: Thời hạn SLA còn lại (Đồng hồ đếm ngược: *Hạn chót: 17:00 hôm nay — Còn 2h 30m*).
     - Bộ nút thao tác nhanh: `[Tiếp nhận]`, `[📷 Nộp ảnh đối chứng]` ($48\text{px}$).
3. **Modal Không Gian Nộp Minh Chứng Thực Địa (Evidence Upload Workspace)**:
   - **Khối 1 — Khung Chụp & Tải Ảnh Sau Hiện Trường (After Photo)**:
     - Nút to `[📷 Chụp ảnh hiện trường]` (Mở trực tiếp Camera sau `capture="environment"`).
     - Khung hiển thị ảnh chụp sắc nét kèm Huy hiệu mã băm SHA-256 màu xanh ngọc.
   - **Khối 2 — Xác thực Tọa độ GPS Geofence $\le 50\text{m}$**:
     - Thanh đo khoảng cách: Hiển thị tọa độ WGS84 thực tế và khoảng cách tới tâm công trình (VD: `Cách tâm công trình: 14.2m — Nằm trong phạm vi 50m hợp lệ [✓]`).
   - **Khối 3 — Danh mục tiêu chuẩn thi công hoàn thành (Checklist)**:
     - Các ô checkbox lớn ($\ge 24\text{px}$) tích chọn biện pháp đã làm (Tưới nước đường gom, Phủ bạt bãi cát, Vận hành cầu rửa xe, Quét dọn bùn đất...).
   - **Khối 4 — Ô nhập giải trình kỹ thuật (Technical Explanation)**:
     - Textarea nhập văn bản giải trình gửi Cán bộ thanh tra.
   - **Khối 5 — Chân Modal**: Bộ đôi nút `[Hủy bỏ]` và `[Xác nhận hoàn thành & Nộp minh chứng]` ($48\text{px}$).

### 4.2. Wireframe Giao Diện Màn Hình Laptop / Desktop (1366px - 1920px)

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [LOGO] DUSTGUARD VN  [NHÀ THẦU XÂY DỰNG]   Dự án: Chung Cư Thanh Xuân Garden     Kỹ sư: Nguyễn Văn Hùng  [ Đăng xuất ] │
├────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────┤
│ QUẢN LÝ CÔNG TRƯỜNG   │ NHIỆM VỤ KHẮC PHỤC BỤI & ĐỐI CHỨNG TRƯỚC/SAU                                                  │
│ [ ] Tổng quan          │ Tiếp nhận yêu cầu chấn chỉnh, triển khai dập bụi và nộp ảnh chụp Geofence <= 50m             │
│ [●] Nhiệm vụ khắc phục │                                                                                               │
│ [ ] Hồ sơ vụ việc      │ [ Tất cả: 12 ] [ ⚠️ Cần làm: 3 ] [ Đang xử lý: 1 ] [ Chờ nghiệm thu: 1 ] [ ✓ Đã hoàn tất: 7 ]│
│ [ ] Báo cáo tuân thủ   │ ───────────────────────────────────────────────────────────────────────────────────────────── │
│                        │                                                                                               │
│ ┌──────────────────────┴───────────────────────────────────┐ ┌─────────────────────────────────────────────────────────┐ │
│ │ THẺ NHIỆM VỤ: #ACT-2026-089              [ ƯU TIÊN CAO ] │ │ THẺ NHIỆM VỤ: #ACT-2026-092           [ ƯU TIÊN VỪA ] │ │
│ │ Vấn đề: Xe tải ben ra vào Cổng số 2 không rửa lốp        │ │ Vấn đề: Chưa phủ kín bạt bãi tập kết cát đá Zone B    │ │
│ │ Vị trí: Cổng phụ số 2 (Đường Nguyễn Trãi)                │ │ Vị trí: Bãi vật liệu Zone B (Phía trường học)         │ │
│ │ Hạn chót: Hôm nay 17:00 (Còn 2 giờ 30 phút)              │ │ Hạn chót: Ngày mai 10:00 (Còn 19 giờ)                 │ │
│ │ ┌──────────────────────────────────────────────────────┐ │ │ ┌───────────────────────────────────────────────────┐ │ │
│ │ │ ẢNH VI PHẠM (BEFORE PHOTO):                           │ │ │ │ ẢNH VI PHẠM (BEFORE PHOTO):                        │ │ │
│ │ │ [ 🖼️ Xe ben chở đất rơi vãi đất cát ra mặt đường ]    │ │ │ │ [ 🖼️ Bãi cát thô khô cằn chưa có bạt che chắn ]    │ │ │
│ │ │ Mã băm: sha256_9f241f48a9b23c5e88d107a63456bcf291...  │ │ │ │ Mã băm: sha256_7c841b48a9b23c5e88d107a63456bcf291...│ │ │
│ │ └──────────────────────────────────────────────────────┘ │ │ └───────────────────────────────────────────────────┘ │ │
│ │ Trạng thái: CẦN KHẮC PHỤC NGAY                           │ │ Trạng thái: ĐANG TRIỂN KHAI PHỦ BẠT                   │ │
│ │                                                          │ │                                                       │ │
│ │ ┌──────────────────────────────────────────────────────┐ │ │ ┌───────────────────────────────────────────────────┐ │ │
│ │ │        📷 NỘP ẢNH ĐỐI CHỨNG & GIẢI TRÌNH (h-48px)    │ │ │ │        📷 TIẾP TỤC NỘP ẢNH ĐỐI CHỨNG (h-48px)       │ │ │
│ │ └──────────────────────────────────────────────────────┘ │ │ └───────────────────────────────────────────────────┘ │ │
│ └──────────────────────────────────────────────────────────┘ └─────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.3. Wireframe Modal Nộp Minh Chứng Thực Địa Ngoài Trời (Field-Ready Modal)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ NỘP MINH CHỨNG ĐÃ KHẮC PHỤC HIỆN TRƯỜNG                                            [X] │
│ Nhiệm vụ: #ACT-2026-089 — Rửa lốp xe và quét dọn bùn đất Cổng số 2                     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. ẢNH ĐỐI CHỨNG HIỆN TRƯỜNG (AFTER PHOTO) *                                           │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │                                                                                    │ │
│ │   [ 📷 CHỤP ẢNH BẰNG CAMERA SAU ]   hoặc   [ 📁 Chọn ảnh từ bộ sưu tập ]           │ │
│ │                                                                                    │ │
│ │   ┌──────────────────────────────────────────────────────────────────────────────┐ │ │
│ │   │ [ 🖼️ XEM TRƯỚC ẢNH ĐÃ RỬA XE VÀ TƯỚI NƯỚC ĐƯỜNG GOM SẠCH SẼ ]                 │ │ │
│ │   │                                                                              │ │ │
│ │   │ 🔒 Tem toàn vẹn SHA-256: 9f241f48a9b23c5e88d107a63456bcf291823d4e08c1a27e31b6│ │ │
│ │   └──────────────────────────────────────────────────────────────────────────────┘ │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ 2. XÁC THỰC VỊ TRÍ HIỆN TRƯỜNG (GEOFENCE BUFFER <= 50M)                                │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ [✓] Tọa độ thiết bị: 20.99846 N, 105.81248 E (Độ chính xác: +/- 3.5m)              │ │
│ │ [✓] Khoảng cách tới tâm công trình: 14.2m — NẰM TRONG BÁN KÍNH 50M HỢP LỆ          │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ 3. BIỆN PHÁP KỸ THUẬT ĐÃ THỰC HIỆN (TÍCH CHỌN)                                         │
│ [X] Đã xịt rửa sạch bùn đất trên 100% bánh xe và gầm xe tải trước khi ra cổng          │
│ [X] Đã điều xe bồn tưới ẩm 200m đoạn đường gom Nguyễn Trãi tiếp giáp công trường       │
│ [X] Đã cho công nhân quét dọn, thu gom toàn bộ bùn đất rơi vãi trong bán kính 50m      │
│                                                                                        │
│ 4. GIẢI TRÌNH KỸ THUẬT GỬI CÁN BỘ THANH TRA                                            │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Đã vận hành trạm rửa xe áp lực cao 2 vòi xịt tại Cổng 2, phân công 2 công nhân trực │ │
│ │ rửa xe liên tục trong ca chiều và điều xe tưới nước dập bụi lúc 14:00 và 16:30.     │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                        │
│ ┌──────────────────────────────────────┐  ┌──────────────────────────────────────────┐ │
│ │             HỦY BỎ                   │  │ 🚀 XÁC NHẬN HOÀN THÀNH & NỘP MINH CHỨNG  │ │ │
│ │            (h-48px)                  │  │                  (h-48px)                │ │ │
│ └──────────────────────────────────────┘  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & API / D1 Database Contract

### 5.1. Các Endpoints API Phục Vụ Màn Hình
- `GET /api/contractor/actions`: Lấy danh sách nhiệm vụ cần khắc phục (có phân trang và lọc theo trạng thái).
- `GET /api/contractor/actions/:id`: Lấy chi tiết một nhiệm vụ, bao gồm ảnh vi phạm ban đầu (Before Photo), checklist yêu cầu và lịch sử tác nghiệp.
- `POST /api/contractor/actions/:id/acknowledge`: Tiếp nhận xử lý nhiệm vụ (`todo` $\rightarrow$ `ACKNOWLEDGED`).
- `POST /api/contractor/actions/:id/start`: Bắt đầu triển khai khắc phục thực địa (`ACKNOWLEDGED` $\rightarrow$ `IN_PROGRESS`).
- `POST /api/contractor/actions/:id/evidence`: Tải ảnh Sau (After Photo) lên Cloudflare R2 Storage.
- `POST /api/contractor/actions/:id/submit`: Nộp hồ sơ nghiệm thu hoàn tất gồm mã băm SHA-256, tọa độ GPS Geofence, checklist và văn bản giải trình.
- `POST /api/contractor/quick-submit`: Endpoint nộp nhanh dành riêng cho luồng 0-Login qua Quick Token HMAC.

### 5.2. Cấu Trúc Payload Nộp Nghiệm Thu (Submission Request Contract)

```json
{
  "actionId": "act_2026_089",
  "caseId": "case_2026_0420",
  "siteId": "site_tx_02",
  "evidenceUrl": "https://r2.dustguard.vn/evidences/2026-09/act_089_after_gate2.jpg",
  "sha256": "9f241f48a9b23c5e88d107a63456bcf291823d4e08c1a27e31b671a9382101fb",
  "latitude": 20.99846,
  "longitude": 105.81248,
  "accuracyMeters": 3.5,
  "siteLat": 20.99842,
  "siteLng": 105.81245,
  "distanceMeters": 14.2,
  "geofenceStatus": "VALID_50M_BUFFER",
  "completedItems": [
    "Đã xịt rửa sạch bùn đất trên 100% bánh xe và gầm xe tải trước khi ra cổng",
    "Đã điều xe bồn tưới ẩm 200m đoạn đường gom Nguyễn Trãi tiếp giáp công trường",
    "Đã cho công nhân quét dọn, thu gom toàn bộ bùn đất rơi vãi trong bán kính 50m"
  ],
  "explanation": "Đã vận hành trạm rửa xe áp lực cao 2 vòi xịt tại Cổng 2, phân công 2 công nhân trực rửa xe liên tục trong ca chiều và điều xe tưới nước dập bụi lúc 14:00 và 16:30.",
  "submittedBy": "Kỹ sư Trần Anh Tuấn (HSE Officer - 0988 123 456)",
  "submittedAt": "2026-09-02T15:10:00+07:00"
}
```

### 5.3. Cấu Trúc Response Trả Về Sau Khi Nộp Thành Công

```json
{
  "success": true,
  "data": {
    "actionId": "act_2026_089",
    "caseId": "case_2026_0420",
    "status": "PENDING_VERIFICATION",
    "geofence": {
      "valid": true,
      "distanceMeters": 14.2,
      "matchStatus": "VALID_50M_BUFFER"
    },
    "sha256": "9f241f48a9b23c5e88d107a63456bcf291823d4e08c1a27e31b671a9382101fb",
    "message": "Nộp minh chứng thành công! Hồ sơ đã chuyển sang Tổ kiểm tra để nghiệm thu trong 24h.",
    "updatedComplianceScore": 90
  }
}
```

### 5.4. Liên kết 12 Bảng D1 Database SSOT
- `contractor_tasks`: Lưu trữ chi tiết tác vụ (`id`, `siteId`, `caseId`, `title`, `description`, `status`, `dueDate`, `priority`).
- `evidences`: Lưu trữ bản ghi minh chứng hình ảnh (`id`, `taskId`, `caseId`, `type` [`BEFORE`, `AFTER`], `url`, `sha256`, `latitude`, `longitude`, `capturedAt`).
- `cases`: Hồ sơ vụ việc theo dõi 7 bước DAG (`id`, `code`, `status`, `currentStep`, `slaDeadline`).
- `contractor_explanations`: Lưu nội dung giải trình (`id`, `caseId`, `contractorId`, `explanation`, `status`, `submittedAt`).
- `audit_logs`: Ghi nhận nhật ký kiểm toán bất biến phục vụ truy xuất sau này.

---

## 6. Bảng Nút Bấm & Tương Tác CTAs (Interactive Actions)

| Tên nút / Thao tác | Vị trí hiển thị | Loại CTA | Kích thước Touch | Hành vi hệ thống | Điều kiện kích hoạt | Phân quyền |
|---|---|---|---|---|---|---|
| **[📷 Nộp ảnh đối chứng & Giải trình]** | Thẻ nhiệm vụ danh sách | Primary CTA (Amber `#B45309`) | $\ge 48\text{px}$ chiều cao | Mở Modal nộp minh chứng thực địa CON-02 cho tác vụ tương ứng | Tác vụ ở trạng thái `todo` hoặc `in_progress` | `contractor` |
| **[📷 Chụp ảnh bằng Camera sau]** | Trong Modal nộp minh chứng | Camera Trigger CTA (Teal `#0D6F64`) | $\ge 48\text{px}$ chiều cao | Kích hoạt trực tiếp Camera sau của điện thoại qua `<input capture="environment">` | Thiết bị có camera | `contractor` |
| **[🚀 Xác nhận hoàn thành & Nộp minh chứng]** | Chân Modal nộp minh chứng | Submit CTA (Emerald `#047857`) | $\ge 48\text{px}$ chiều cao | Băm SHA-256, kiểm tra Geofence, tải ảnh lên R2 và cập nhật D1 | Đã chụp/chọn ảnh After và tích $\ge 1$ biện pháp | `contractor` |
| **[Bắt đầu khắc phục]** | Chi tiết tác vụ | Workflow Action (Teal) | $\ge 48\text{px}$ chiều cao | Gọi API chuyển trạng thái từ `todo` sang `in_progress` | Tác vụ mới tiếp nhận | `contractor` |
| **[Xem ảnh vi phạm (Before)]** | Thẻ nhiệm vụ / Chi tiết | Utility CTA (Stone `#44403C`) | $\ge 44\text{px}$ touch area | Mở ảnh vi phạm ban đầu kích thước lớn để xem rõ góc chụp | Luôn sẵn sàng | `contractor` |
| **[Hủy bỏ]** | Chân Modal | Neutral CTA (Stone `#78716C`) | $\ge 48\text{px}$ chiều cao | Đóng modal và giải phóng bộ nhớ ảnh preview `URL.revokeObjectURL` | Bất kỳ lúc nào | `contractor` |

---

## 7. Quy Chuẩn UI/UX & Responsive

### 7.1. Bảng màu Civic High-Contrast ngoài trời nắng (Zero Glassmorphism)
- **Nền tổng thể**: `#FAFAF9` (Stone 50) phối với Card nội dung `#FFFFFF` sắc nét.
- **Viền khung phân tách**: `border border-stone-200` (`#E7E5E4`), hoàn toàn không sử dụng viền mờ ảo hay đổ bóng phức tạp.
- **Chữ & Nội dung**:
  - Tiêu đề & Nhãn bắt buộc: `#1C1917` (Stone 900 — Tương phản cực cao dưới ánh nắng).
  - Ghi chú kỹ thuật & Tọa độ GPS: `#292524` (Stone 800) kết hợp font Monospace rõ nét.
- **Tuyệt đối cấm**: Mọi thuộc tính `backdrop-blur-*`, lớp phủ kính mờ trong suốt, thanh cuộn ẩn gây khó thao tác ngoài trời.

### 7.2. Tối ưu thao tác công trường (Glove-Friendly Touch Targets)
- Chiều cao các nút bấm chính: **$48\text{px}$** (với padding rộng rãi `px-6 py-3.5`).
- Các ô Checkbox tiêu chí khắc phục: Chiều rộng và chiều cao tối thiểu **$24\text{px} \times 24\text{px}$** với vùng chạm bao quanh (Hit area) $\ge 48\text{px}$.
- Ô nhập giải trình kỹ thuật: Font chữ tối thiểu $16\text{px}$ (Text-base) để iOS không tự động zoom phóng to màn hình khi chạm vào gõ phím.

### 7.3. Tương thích đa thiết bị (Responsive Matrix)
- **Mobile nhỏ (360px - 430px)**:
  - Danh sách nhiệm vụ dạng cuộn dọc 1 cột.
  - Modal nộp minh chứng hiển thị toàn màn hình (Full-screen Sheet) với nút bấm ghim cố định ở đáy để dễ chạm bằng ngón tay cái.
- **Tablet (768px - 1024px)**:
  - Hiển thị 2 cột thẻ nhiệm vụ. Modal nộp minh chứng xuất hiện dạng hộp thoại nổi 640px căn giữa.
- **Laptop & Desktop (1366px - 1920px)**:
  - Bố cục 2 cột danh sách nhiệm vụ rộng rãi. Cung cấp khung xem trước ảnh đối chứng Before song song với ảnh After để so sánh trực quan.

---

## 8. Bẫy Lỗi Thường Gặp & Hướng Dẫn Kiểm Thử

### 8.1. Các bẫy lỗi thực tế tại công trường & Giải pháp phòng ngừa
1. **Bẫy lỗi GPS trôi do hiệu ứng lồng kính / tòa nhà cao tầng (Urban Canyon Effect)**:
   - *Hiện tượng*: Công trình nằm giữa các khối nhà cao 30-40 tầng làm tín hiệu GPS nhảy xa > 50m dù người chụp đang đứng ngay tại cổng công trường.
   - *Giải pháp*: Thuật toán Geofence có cơ chế bù sai số `accuracyMeters`. Nếu khoảng cách đo được là 65m nhưng sai số GPS là $\pm 20\text{m}$, hệ thống đánh dấu trạng thái `NEARBY_WARNING` nhưng vẫn cho phép nộp kèm tọa độ ước tính của công trường, ghi log để cán bộ thẩm tra sau mà không làm gián đoạn việc nộp hồ sơ.
2. **Bẫy lỗi mất sóng 4G/Wifi chập chờn khi tải ảnh dung lượng lớn**:
   - *Hiện tượng*: Ảnh gốc 12MB tải lên bị ngắt kết nối giữa chừng gây lỗi timeout.
   - *Giải pháp*: Client tự động nén nhẹ ảnh về dung lượng $< 2\text{MB}$ trước khi upload lên Cloudflare R2 và tính toán mã băm SHA-256 trên tệp nén đồng nhất.
3. **Bẫy lỗi rò rỉ bộ nhớ RAM trên điện thoại Android cấu hình thấp**:
   - *Hiện tượng*: Người dùng chụp đi chụp lại nhiều lần tạo ra hàng loạt `blob:` URLs làm tràn RAM trình duyệt.
   - *Giải pháp*: Gọi ngay `URL.revokeObjectURL(oldPreviewUrl)` mỗi khi người dùng chụp ảnh mới hoặc khi đóng modal nộp minh chứng.

### 8.2. Hướng dẫn kiểm thử tự động qua CLI PowerShell

```powershell
# 1. Chạy bài kiểm thử đơn lẻ cho phân hệ nhiệm vụ và nộp minh chứng Geofence 50m (< 0.5s)
node --test app/tests/contractor-ui-workspace.test.js

# 2. Kiểm tra tính toàn vẹn của mã băm SHA-256 và thuật toán Haversine
node --test app/tests/evidence-r2-verification.test.js

# 3. Kiểm tra tuân thủ tiêu chuẩn giao diện Zero Glassmorphism
node --test app/tests/design-system-tokens.test.js

# 4. Chạy cổng kiểm định nhanh cấp độ 3 trước khi commit
npm --prefix app run verify:quick
```
