# CON-01 — Bàn Làm Việc Chỉ Huy Trưởng Công Trường (Contractor Overview Dashboard)

> **Mã màn hình**: `CON-01`  
> **Tên tiếng Việt**: Bàn Làm Việc Chỉ Huy Trưởng Công Trường & Tiếp Nhận Khắc Phục  
> **Tên tiếng Anh**: Contractor Overview Dashboard & Fast-Response Workspace  
> **Tài liệu tham chiếu SSOT**: [`CIVIC_HANDOFF_SSOT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/CIVIC_HANDOFF_SSOT.md), [`DOMAIN.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DOMAIN.md), [`QCVN 18:2021/BXD`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/QCVN-18-2021-BXD.md), [`Nghị định 45/2022/NĐ-CP`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/ND-45-2022-ND-CP.md)

---

## 1. Screen Identity

| Thuộc tính | Định danh kỹ thuật SSOT |
|---|---|
| **Mã màn hình** | `CON-01` |
| **Tên tiếng Việt** | Bàn Làm Việc Chỉ Huy Trưởng Công Trường & Tiếp Nhận Khắc Phục |
| **Tên tiếng Anh** | Contractor Overview Dashboard & Fast-Response Workspace |
| **Đường dẫn (Route)** | `/contractor` (Route con: `/contractor/dashboard`) |
| **Tệp mã nguồn (Component Path)** | [`app/src/apps/contractor/pages/dashboard/ContractorDashboardPage.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/contractor/pages/dashboard/ContractorDashboardPage.jsx) kết hợp [`app/src/modules/contractor/ContractorDashboard.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/modules/contractor/ContractorDashboard.jsx) |
| **Khung bố cục (Layout)** | [`app/src/apps/contractor/layout/ContractorLayout.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/contractor/layout/ContractorLayout.jsx) (Thiết kế tối ưu hiện trường công trường ngoài trời, nút to $\ge 48\text{px}$, thanh điều hướng chân trang trên Mobile) |
| **Phân quyền truy cập (RBAC)** | `contractor` (Chỉ huy trưởng công trường, Kỹ sư trưởng An toàn & Môi trường HSE, Đội trưởng thi công cơ giới các nhà thầu: Hancorp, Vinaconex, Coteccons, Ricons, Phục Hưng Holdings, Delta, Central...) |
| **Trạng thái thực thi** | `ACTIVE` — Level 5 Production Coherent (Kết nối Cloudflare D1 SQLite thật qua `/api/contractor/dashboard`, hỗ trợ phiên xác thực 0-Login HMAC Quick Token 72h) |

**Tóm tắt mục đích**: Màn hình là trung tâm chỉ huy số tức thời dành cho Chỉ huy trưởng và Ban điều hành công trường tại Việt Nam. Khi có cảnh báo bụi hoặc yêu cầu chấn chỉnh từ Tổ kiểm tra môi trường/Thanh tra giao thông/Người dân, chỉ huy trưởng nhận được tin nhắn SMS Brandname hoặc Zalo ZNS có gắn đường dẫn Quick Token 72h, bấm mở ngay lập tức trên smartphone tại hiện trường mà không cần đăng nhập mật khẩu rườm rà. Màn hình cung cấp 3 chỉ số then chốt (Yêu cầu cần làm, Đã xử lý, Điểm tuân thủ), thẻ cảnh báo rủi ro vi phạm và danh sách các hành động khẩn cấp (tưới nước dập bụi, che bạt bãi cát, bật máy rửa lốp xe) để xử lý trong 24h - 48h, giúp nhà thầu tránh bị phạt 10 - 50 triệu đồng theo Nghị định 45/2022/NĐ-CP hoặc nguy cơ đình chỉ thi công.

---

## 2. Mục Đích & Giá Trị Thực Tế

### 2.1. Giải quyết bài toán tác nghiệp hiện trường tại Việt Nam
1. **Cơ chế 0-Login Quick Token 72h (Xóa bỏ rào cản tài khoản mật khẩu)**:
   - Các kỹ sư, chỉ huy trưởng và đội trưởng thi công thường làm việc ngoài hiện trường nắng gió, tay bám bụi hoặc đeo găng bảo hộ, rất ngại phải ghi nhớ tên đăng nhập, mật khẩu phức tạp hay mã OTP rườm rà.
   - Hệ thống tự động gửi tin nhắn SMS Brandname / Zalo ZNS:  
     `[DustGuard VN] Cảnh báo bụi tại Cổng số 2 Dự án Chung cư Thanh Xuân Garden. Yêu cầu tưới ẩm và rửa lốp xe trước 17:00. Bấm mở xử lý: https://dustguard.vn/contractor?token=a8f2e9... (Hạn 72h)`.
   - Chỉ huy trưởng bấm vào link là vào thẳng không gian tác nghiệp cá nhân hóa của gói thầu/dự án mình quản lý.
2. **Cảnh báo sớm, ngăn chặn xử phạt hành chính theo Nghị định 45/2022/NĐ-CP**:
   - Theo Điều 20 & 26 Nghị định số 45/2022/NĐ-CP và Nghị định 16/2022/NĐ-CP về xử phạt vi phạm hành chính trong lĩnh vực bảo vệ môi trường và trật tự xây dựng, hành vi không che chắn công trình, để rơi vãi bùn đất ra đường gom, không xịt rửa xe tải vận chuyển phế thải bị phạt từ **10.000.000đ đến 50.000.000đ**, thậm chí bị tước quyền sử dụng giấy phép hoặc **đình chỉ thi công 1 - 3 tháng**.
   - Màn hình CON-01 trực quan hóa đồng hồ đếm ngược SLA (24h - 48h) và mức độ rủi ro, giúp ban chỉ huy điều động xe bồn tưới nước, xe quét đường và kích hoạt máy xịt rửa lốp ngay trong ca làm việc.
3. **Bảo toàn nguồn vốn ký quỹ bảo vệ môi trường (CSR Escrow Return)**:
   - Điểm số tuân thủ môi trường (Compliance Score thang điểm 100) được tính toán khách quan dựa trên lịch sử khắc phục đúng hạn và dữ liệu cảm biến bụi PM2.5/PM10.
   - Điểm số cao là cơ sở pháp lý vững chắc để Ban Quản lý Dự án (PMU) và Chủ đầu tư nghiệm thu giai đoạn, giải ngân tạm ứng và hoàn trả 100% tiền bảo lãnh/ký quỹ môi trường khi kết thúc gói thầu.

### 2.2. So sánh hiệu quả tác nghiệp (Trước và Sau khi có DustGuard VN)

| Chỉ số / Nghiệp vụ | Cách làm truyền thống (Gọi điện / Nhắc nhở giấy) | Ứng dụng Bàn làm việc CON-01 |
|---|---|---|
| **Thời gian tiếp nhận cảnh báo** | 2 - 5 ngày (khi có biên bản kiểm tra bằng giấy) | **< 30 giây** (SMS / Zalo ZNS gửi thẳng Chỉ huy trưởng) |
| **Thao tác truy cập** | Phải đăng nhập Web trên máy tính văn phòng | **0-Login 1 chạm** mở trực tiếp trên smartphone ngoài công trường |
| **Nắm bắt yêu cầu kỹ thuật** | Mơ hồ, nhân công tự ước lượng | Chi tiết rõ ràng: Vị trí cổng, biện pháp (che bạt, tưới nước, rửa lốp) |
| **Nguy cơ bị xử phạt hành chính** | Cao (dễ bị Đội TTGT / Đội QLTTĐT phạt bất ngờ) | **Giảm 90%** (chủ động khắc phục và nộp ảnh trong 24h - 48h) |
| **Đối chứng nghiệm thu** | Tranh cãi bằng miệng, khó chứng minh | Chuỗi ảnh đối chứng Before/After có mã băm SHA-256 bất biến |

---

## 3. Đối Tượng Người Dùng & Hành Trình Thao Tác (User Journey & Core Flow)

### 3.1. Chân dung người dùng mục tiêu (Personas)
1. **Kỹ sư Nguyễn Văn Hùng — Chỉ huy trưởng công trường (Vinaconex / Ricons)**:
   - *Đặc điểm*: 42 tuổi, quản lý hơn 120 công nhân và 15 xe tải ben ra vào mỗi ngày, sử dụng iPhone/Android, luôn di chuyển giữa các tầng thi công và lán trại chỉ huy.
   - *Mục tiêu*: Xem nhanh có bao nhiêu yêu cầu cần xử lý gấp, điều động đội thi công hạ tầng tưới nước hoặc sửa chữa trạm rửa lốp xe ngay để không bị đình chỉ thi công.
2. **Kỹ sư Trần Anh Tuấn — Đội trưởng An toàn & Môi trường (HSE Officer - Coteccons)**:
   - *Đặc điểm*: 29 tuổi, chuyên trách an toàn lao động và vệ sinh môi trường, thường xuyên đeo găng tay bảo hộ, cầm điện thoại ghi nhận hiện trường dưới trời nắng.
   - *Mục tiêu*: Nhấp vào từng yêu cầu cần làm, theo dõi thời hạn SLA, phối hợp chụp ảnh After nộp giải trình.
3. **Ông Lê Hoàng Nam — Giám đốc Điều hành Dự án (PMU / Ban Điều hành Nhà thầu)**:
   - *Đặc điểm*: Theo dõi nhiều gói thầu cùng lúc, mở laptop xem dashboard để kiểm soát điểm tuân thủ của các công trường trực thuộc.

### 3.2. Sơ đồ hành trình tổng thể (End-to-End Core Flow)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [Cán bộ Thanh tra / Hệ thống phát hiện vi phạm bụi hoặc phản ánh của người dân]        │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Tin nhắn SMS Brandname / Zalo ZNS gửi tới số điện thoại Chỉ huy trưởng                │
│ "Phát hiện bụi phát tán tại Cổng 2 Dự án X. Hạn xử lý: 48h. Mở: dustguard.vn/ctr?tk=.."│
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ (Bấm 1 chạm trên Smartphone - Không cần mật khẩu)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ MÀN HÌNH CON-01: BÀN LÀM VIỆC CHỈ HUY TRƯỞNG                                           │
│ ├─► 1. Xem Thẻ chào mừng & Thông tin dự án thi công                                   │
│ ├─► 2. Kiểm tra 3 Thẻ chỉ số: [Cần khắc phục: 3] [Đã hoàn tất: 8] [Tuân thủ: 88/100]  │
│ ├─► 3. Đánh giá Mức độ rủi ro vi phạm (Thấp / Trung bình / Cao theo NĐ 45/2022)       │
│ └─► 4. Quét danh sách "Yêu Cầu Khắc Phục Mới Nhất (Priority Action Items)"             │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    ▼                                               ▼
┌──────────────────────────────────────┐        ┌──────────────────────────────────────┐
│ Bấm nút [Nộp ảnh đối chứng →] trên   │        │ Bấm nút [Xem X yêu cầu cần làm]      │
│ thẻ tác vụ khẩn cấp                  │        │ trên Banner chào mừng                │
└──────────────────┬───────────────────┘        └──────────────────┬───────────────────┘
                   │                                               │
                   └───────────────────────┬───────────────────────┘
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Chuyển hướng sang Màn hình CON-02: TIẾP NHẬN KHẮC PHỤC & ĐỐI CHỨNG TRƯỚC/SAU          │
│ (Triển khai tưới nước, che bạt, rửa xe -> Chụp ảnh After có Geofence <= 50m & SHA-256) │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.3. Các kịch bản thao tác thực tế tại công trường

* **Kịch bản 1 — Đầu ca sáng (Rà soát 30 giây ngoài công trường)**:
  - Chỉ huy trưởng vừa bước ra khỏi lán chỉ huy lúc 06:45 sáng, mở điện thoại vào `/contractor`.
  - Nhìn 3 thẻ KPI: Thấy có `1 Yêu cầu cần làm` (Bãi cát khu vực Zone B chưa phủ kín bạt).
  - Chỉ huy trưởng bấm chuông gọi ngay Đội trưởng thi công hạ tầng: *"Anh cho 2 công nhân kéo bạt phủ kín bãi cát Zone B trước 8h sáng kẻo gió thổi bụi sang trường học bên cạnh"*.
* **Kịch bản 2 — Xử lý phản ánh nóng trong ca thi công cao điểm**:
  - 14:30 chiều, đoàn xe ben chở phế thải móng ra vào làm rơi vãi đất cát ra đường gom, hệ thống gửi SMS cảnh báo.
  - Kỹ sư HSE mở bàn làm việc, thấy thẻ nhiệm vụ `#ACT-2026-089` (Ưu tiên Cao, Hạn xử lý còn 3 giờ).
  - HSE bấm `[Nộp ảnh đối chứng →]`, dẫn thẳng tới modal tác nghiệp, gọi xe bồn tưới nước và cho công nhân quét dọn, chụp ảnh After nghiệm thu.
* **Kịch bản 3 — Báo cáo giao ban tuần với Chủ đầu tư**:
  - Tại buổi họp giao ban chiều thứ Sáu, Chỉ huy trưởng mở màn hình CON-01 trên laptop máy chiếu, hiển thị điểm tuân thủ `92/100` và 8 vụ việc đã khắc phục hoàn hảo đúng hạn để chứng minh năng lực quản lý của nhà thầu.

---

## 4. Bố Cục Giao Diện & Phân Cấp Thông Tin (Information Hierarchy & Wireframe)

### 4.1. Phân cấp thông tin (Information Hierarchy)
1. **Header Banner chào mừng & Nhận diện Công trường**:
   - Tên nhà thầu (VD: *Tổng Công Ty CP Xuất Nhập Khẩu & Xây Dựng Việt Nam — Vinaconex*).
   - Tên dự án & Vị trí gói thầu (VD: *Dự án Chung cư Thanh Xuân Garden — Gói thầu XL-01 Khung bê tông móng cốt thép*).
   - Nút hành động chính (Primary CTA): `[Xem 3 yêu cầu cần làm]` (Nền màu Hổ phách/Amber `#B45309`, chữ trắng đậm, chiều cao tối thiểu $48\text{px}$).
2. **Hàng 3 Thẻ chỉ số điều hành cốt lõi (Core Metric Cards)**:
   - **Thẻ 1 — Cần khắc phục (Action Required)**: Số lượng các hành động ở trạng thái `todo` hoặc `in_progress`. Cảnh báo chữ màu đỏ gạch/hổ phách, kèm chú thích: *Thời hạn cam kết xử lý trong 24h - 48h*.
   - **Thẻ 2 — Đã hoàn tất & Nghiệm thu (Remediated & Verified)**: Số lượng công việc đã nộp ảnh Before/After đạt chuẩn. Chữ màu xanh Teal `#0D6F64`, kèm chú thích: *Tổ kiểm tra đã xác nhận*.
   - **Thẻ 3 — Điểm tuân thủ môi trường (Compliance Score)**: Điểm số định lượng (VD: `88 / 100`). Chữ màu xanh lục Emerald `#047857`, kèm huy hiệu: *Đạt chuẩn thi công QCVN 18:2021/BXD*.
3. **Khối đánh giá rủi ro vi phạm (Compliance Risk Banner)**:
   - Đo lường 4 yếu tố nguy cơ: Tần suất phát tán bụi, Thời gian khắc phục trung bình, Tỷ lệ trễ hạn SLA, Khoảng cách tới trường học/khu dân cư nhạy cảm $\le 200\text{m}$.
   - Khuyến nghị hành động tức thì để tránh biên bản phạt hành chính 10 - 50 triệu đồng.
4. **Danh sách Yêu cầu khắc phục ưu tiên (Priority Action Items Table / Cards)**:
   - Tiêu đề khối kèm liên kết điều hướng `Xem tất cả (X) →`.
   - Mỗi thẻ hành động hiển thị:
     - Dòng 1: Mã tác vụ (Font Monospace: `#ACT-2026-089`) + Huy hiệu trạng thái (`CẦN LÀM` / `ĐANG XỬ LÝ` / `CHỜ NGHIỆM THU`).
     - Dòng 2: Tiêu đề vi phạm thực tế (VD: *Bụi phát tán do xe tải ben không rửa lốp tại Cổng số 2*).
     - Dòng 3: Biện pháp kỹ thuật đề xuất (VD: *Vận hành máy phun rửa lốp áp lực cao và tưới ẩm 200m đường gom*).
     - Dòng 4: Thời hạn chót SLA (VD: *Hạn chót: Hôm nay 17:00 — Còn 2 giờ 30 phút*).
     - Nút hành động trực tiếp: `[Nộp ảnh đối chứng →]` (Nút màu Cam hổ phách, $48\text{px}$).
5. **Chân trang điều hướng nhanh trên Mobile (Bottom Navigation Bar)**:
   - Cố định ở đáy màn hình điện thoại với 4 mục to rõ: `[🏠 Tổng quan]`, `[📋 Công việc]`, `[📁 Vụ việc]`, `[📊 Báo cáo]`.

### 4.2. Wireframe Giao Diện Màn Hình Lớn (Desktop 1366px - 1920px)

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [LOGO] DUSTGUARD VN  [NHÀ THẦU XÂY DỰNG]   Dự án: Chung Cư Thanh Xuân Garden     Kỹ sư: Nguyễn Văn Hùng  [ Đăng xuất ] │
├────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────┤
│ QUẢN LÝ CÔNG TRƯỜNG   │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│ [●] Tổng quan          │ │ BÀN LÀM VIỆC CHỈ HUY TRƯỞNG & ĐIỀU HÀNH HIỆN TRƯỜNG                                       │ │
│ [ ] Nhiệm vụ khắc phục │ │ Nhà thầu: Tổng Công Ty CP Xuất Nhập Khẩu & Xây Dựng Việt Nam (Vinaconex)                 │ │
│ [ ] Hồ sơ vụ việc      │ │ Gói thầu XL-01: Thi công phần ngầm và kết cấu thân Block A & B                           │ │
│ [ ] Báo cáo tuân thủ   │ │                                                        [ ⚠️ XEM 3 YÊU CẦU CẦN XỬ LÝ GẤP ] │ │
│ ────────────────────── │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
│ CÔNG CỤ HIỆN TRƯỜNG    │                                                                                               │
│ 📍 Bản đồ Geofence 50m │ ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────────────────────┐ │
│ 📷 Nộp ảnh nhanh 0-Login│ │ CẦN KHẮC PHỤC GẤP    │  │ ĐÃ HOÀN TẤT & DUYỆT  │  │ ĐIỂM TUÂN THỦ MÔI TRƯỜNG            │ │
│ 📑 QCVN 18:2021/BXD    │ │          3           │  │          8           │  │               88 / 100               │ │
│ 📞 Hotline Tổ Giám Sát │ │ Hạn chót trong 24h   │  │ Đã có ảnh nghiệm thu │  │ ⭐ Đạt chuẩn an toàn thi công BXD    │ │
│                        │ └──────────────────────┘  └──────────────────────┘  └──────────────────────────────────────┘ │
│                        │                                                                                               │
│                        │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│                        │ │ 🛡️ ĐÁNH GIÁ NGUY CƠ VI PHẠM & KHUYẾN NGHỊ PHÒNG NGỪA PHẠT NGHỊ ĐỊNH 45/2022/NĐ-CP         │ │
│                        │ │ • Mức độ rủi ro: TRUNG BÌNH (42/100) — Điểm trường Tiểu học Thanh Xuân Nam cách 180m     │ │
│                        │ │ • Khuyến nghị: Cần tăng cường tưới nước đường gom giờ tan học (11:30 & 16:30) để tránh bị │ │
│                        │ │   Thanh tra Giao thông lập biên bản xử phạt 10 - 50 triệu đồng hoặc tạm dừng xuất xe.     │ │
│                        │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
│                        │                                                                                               │
│                        │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│                        │ │ DANH SÁCH YÊU CẦU KHẮC PHỤC MỚI NHẤT (CẦN XỬ LÝ)                         Xem tất cả (3) →  │ │
│                        │ ├───────────────────────────────────────────────────────────────────────────────────────────┤ │
│                        │ │ [#ACT-2026-089]  [ƯU TIÊN CAO]  [TRẠNG THÁI: CẦN LÀM]            Hạn chót: Hôm nay 17:00  │ │
│                        │ │ Vấn đề: Xe tải chở đất móng không rửa bánh làm rơi vãi bùn đất Cổng số 2 ra đường Nguyễn Trãi │
│                        │ │ Biện pháp: Vận hành máy xịt rửa lốp áp lực cao 100% chuyến xe và quét sạch bùn mặt đường │ │
│                        │ │                                                                   [ 📷 NỘP ẢNH ĐỐI CHỨNG → ]│ │
│                        │ ├───────────────────────────────────────────────────────────────────────────────────────────┤ │
│                        │ │ [#ACT-2026-092]  [ƯU TIÊN VỪA]  [TRẠNG THÁI: ĐANG XỬ LÝ]         Hạn chót: Ngày mai 10:00 │ │
│                        │ │ Vấn đề: Bãi tập kết cát đá thô tại khu vực Zone B chưa phủ bạt chuyên dụng                │ │
│                        │ │ Biện pháp: Rải bạt bạt che kín 100% bề mặt đống vật liệu và lắp vòi phun sương bán kính 10m│ │
│                        │ │                                                                   [ 📷 NỘP ẢNH ĐỐI CHỨNG → ]│ │
│                        │ ├───────────────────────────────────────────────────────────────────────────────────────────┤ │
│                        │ │ [#ACT-2026-095]  [ƯU TIÊN THẤP] [TRẠNG THÁI: CHỜ NGHIỆM THU]     Gửi lúc: Hôm nay 11:20   │ │
│                        │ │ Vấn đề: Lưới chắn bụi giàn giáo tầng 4 bị rách góc phía Đông giáp nhà dân                │ │
│                        │ │ Biện pháp: Đã thay thế 30m2 lưới mắt nhỏ mới và chằng buộc dây thép an toàn (Đang đợi duyệt)│ │
│                        │ │                                                                   [ 🔍 XEM CHI TIẾT → ]     │ │
│                        │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.3. Wireframe Giao Diện Smartphone Hiện Trường (Mobile 360px - 430px)

```text
┌──────────────────────────────────────────┐
│ [≡] DUSTGUARD VN  [VINACONEX]        [👤]│
├──────────────────────────────────────────┤
│ BÀN LÀM VIỆC CHỈ HUY TRƯỞNG              │
│ Dự án: Chung cư Thanh Xuân Garden        │
│ Gói thầu XL-01: Phần ngầm & kết cấu thân │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │  ⚠️ 3 YÊU CẦU CẦN XỬ LÝ TRONG 24H     │ │
│ │  [ Bấm xem danh sách việc cần làm ]  │ │ (Nút to h-48px)
│ └──────────────────────────────────────┘ │
│                                          │
│ ┌──────────────┐ ┌──────────────┐        │
│ │ CẦN LÀM GẤP  │ │ ĐÃ HOÀN TẤT  │        │
│ │      3       │ │      8       │        │
│ │ Hạn 24h-48h  │ │ Đã nghiệm thu│        │
│ └──────────────┘ └──────────────┘        │
│ ┌──────────────────────────────────────┐ │
│ │ ĐIỂM TUÂN THỦ: 88 / 100 (ĐẠT CHUẨN)  │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ VIỆC CẦN LÀM KHẨN CẤP                    │
│ ┌──────────────────────────────────────┐ │
│ │ [#ACT-2026-089] [GẤP: HÔM NAY 17:00] │ │
│ │ Xe tải không rửa lốp tại Cổng số 2   │ │
│ │ Biện pháp: Xịt rửa lốp + Quét bùn đất│ │
│ │                                      │ │
│ │ ┌──────────────────────────────────┐ │ │
│ │ │   📷 NỘP ẢNH ĐỐI CHỨNG NGAY      │ │ │ (Nút to h-48px,
│ │ └──────────────────────────────────┘ │ │  chống bấm trượt)
│ └──────────────────────────────────────┘ │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ [#ACT-2026-092] [HẠN: NGÀY MAI 10:00]│ │
│ │ Chưa phủ bạt bãi cát đá Zone B       │ │
│ │ ┌──────────────────────────────────┐ │ │
│ │ │   📷 NỘP ẢNH ĐỐI CHỨNG NGAY      │ │ │
│ │ └──────────────────────────────────┘ │ │
│ └──────────────────────────────────────┘ │
├──────────────────────────────────────────┤
│ [🏠 Tổng quan] [📋 Nhiệm vụ] [📁 Vụ việc]│
└──────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & API / D1 Database Contract

### 5.1. Các Endpoints API Phục Vụ Màn Hình
- `GET /api/contractor/dashboard`: Lấy tổng hợp hồ sơ nhà thầu, thống kê KPI, điểm tuân thủ và danh sách tác vụ ưu tiên.
- `GET /api/contractor/actions`: Lấy danh sách toàn bộ tác vụ của nhà thầu.
- `POST /api/contractor/auth/verify-token`: Xác thực mã Quick Token HMAC 72h khi truy cập từ liên kết SMS/Zalo.

### 5.2. Cấu Trúc Payload JSON Chuẩn (Response Contract)

```json
{
  "success": true,
  "data": {
    "contractor": {
      "id": "ctr_vinaconex_01",
      "name": "Tổng Công Ty CP Xuất Nhập Khẩu & Xây Dựng Việt Nam (Vinaconex)",
      "taxCode": "0100105398",
      "representative": "Kỹ sư Nguyễn Văn Hùng",
      "phone": "0988 123 456",
      "activeProjectsCount": 2
    },
    "project": {
      "id": "site_tx_02",
      "name": "Dự án Khu Chung Cư Thanh Xuân Garden",
      "package": "Gói thầu XL-01: Thi công phần ngầm và kết cấu thân Block A & B",
      "address": "Số 150 Đường Nguyễn Trãi, Phường Thanh Xuân Trung, Quận Thanh Xuân, Hà Nội",
      "coordinates": {
        "latitude": 20.99842,
        "longitude": 105.81245
      }
    },
    "stats": {
      "actionRequired": 3,
      "inProgress": 1,
      "pendingVerification": 1,
      "completed": 8,
      "totalActions": 12,
      "complianceRate": 88
    },
    "riskScore": {
      "score": 42,
      "level": "MEDIUM",
      "schoolProximityMeters": 180,
      "factors": [
        { "name": "Mức độ bụi phát tán", "weight": 0.35, "score": 45 },
        { "name": "Khoảng cách khu vực nhạy cảm", "weight": 0.25, "score": 60 },
        { "name": "Thời gian phản hồi khắc phục", "weight": 0.20, "score": 30 },
        { "name": "Lịch sử chấp hành QCVN 18", "weight": 0.20, "score": 35 }
      ],
      "legalWarning": "Có nguy cơ bị lập biên bản xử phạt 10 - 50 triệu đồng theo Điều 20 Nghị định 45/2022/NĐ-CP nếu không xử lý bụi Cổng số 2 trước 17:00 hôm nay."
    },
    "priorityActions": [
      {
        "id": "act_2026_089",
        "code": "ACT-2026-089",
        "caseId": "case_2026_0420",
        "title": "Vận hành rửa lốp và dọn bùn đất Cổng số 2",
        "description": "Xe tải vận chuyển đất móng làm rơi vãi đất cát ra đường gom Nguyễn Trãi. Yêu cầu xịt rửa lốp 100% chuyến xe và quét dọn bùn đất.",
        "category": "WHEEL_WASHING",
        "status": "todo",
        "priority": "HIGH",
        "dueDate": "2026-09-02T17:00:00+07:00",
        "hoursRemaining": 2.5,
        "beforeEvidenceUrl": "/uploads/evidences/case_0420_before_gate2.jpg",
        "beforeSha256": "9f241f48a9b23c5e88d107a63456bcf291823d4e08c1a27e31b671a9382101fb"
      },
      {
        "id": "act_2026_092",
        "code": "ACT-2026-092",
        "caseId": "case_2026_0388",
        "title": "Phủ bạt bãi tập kết cát đá tại Zone B",
        "description": "Bãi cát xây thô không được che đậy gây bụi khi có gió lốc. Yêu cầu kéo bạt phủ kín toàn bộ bề mặt.",
        "category": "MATERIAL_COVERING",
        "status": "in_progress",
        "priority": "MEDIUM",
        "dueDate": "2026-09-03T10:00:00+07:00",
        "hoursRemaining": 19.5,
        "beforeEvidenceUrl": "/uploads/evidences/case_0388_before_sand.jpg",
        "beforeSha256": "7c841b48a9b23c5e88d107a63456bcf291823d4e08c1a27e31b671a9382102aa"
      }
    ]
  }
}
```

### 5.3. Liên kết 12 Bảng D1 Database SSOT
- `sites`: Quản lý 33 công trình trọng điểm (`id`, `name`, `contractorName`, `dustRiskScore`, `latitude`, `longitude`, `address`).
- `contractor_tasks` / `actions`: Bảng tác vụ thi công (`id`, `siteId`, `caseId`, `title`, `description`, `status`, `priority`, `dueDate`).
- `cases`: Bảng hồ sơ vụ việc 7 bước DAG (`id`, `code`, `siteId`, `status`, `riskScore`, `slaDeadline`).
- `evidences`: Bảng lưu vết minh chứng số (`id`, `taskId`, `type`, `url`, `sha256`, `latitude`, `longitude`, `capturedAt`).
- `contractor_explanations`: Bảng lưu giải trình kỹ thuật của nhà thầu (`id`, `caseId`, `explanation`, `status`, `submittedAt`).
- `audit_logs`: Bảng nhật ký kiểm toán bất biến ghi nhận mọi thao tác tiếp nhận và nộp minh chứng.

---

## 6. Bảng Nút Bấm & Tương Tác CTAs (Interactive Actions)

| Tên nút / Thao tác | Vị trí hiển thị | Loại CTA | Kích thước Touch | Hành vi hệ thống | Điều kiện kích hoạt | Phân quyền |
|---|---|---|---|---|---|---|
| **[⚠️ Xem X yêu cầu cần xử lý gấp]** | Banner chào mừng đầu trang | Primary CTA (Amber `#B45309`) | $\ge 48\text{px}$ chiều cao, full-width Mobile | Cuộn xuống hoặc điều hướng trực tiếp sang danh sách công việc `/contractor/tasks` lọc trạng thái `todo` | Luôn hiển thị khi có $\ge 1$ việc cần làm | `contractor` |
| **[📷 Nộp ảnh đối chứng →]** | Trên từng thẻ hành động khẩn cấp | Direct Action (Teal / Amber) | $\ge 48\text{px}$ chiều cao, viền rõ nét | Mở trực tiếp màn hình/modal nộp minh chứng CON-02 kèm mã `actionId` | Tác vụ ở trạng thái `todo` hoặc `in_progress` | `contractor` |
| **[Xem tất cả (X) →]** | Tiêu đề khối Danh sách việc cần làm | Text Link CTA (Teal `#0D6F64`) | $44\text{px} \times 44\text{px}$ touch area | Điều hướng sang `/contractor/tasks` để xem toàn bộ danh mục công việc | Luôn sẵn sàng | `contractor` |
| **[🔍 Xem chi tiết →]** | Trên thẻ tác vụ đã nộp ảnh | Secondary CTA (Stone `#57534E`) | $\ge 44\text{px}$ chiều cao | Mở bản đối chứng Before/After và trạng thái phê duyệt của cán bộ | Tác vụ ở trạng thái `pending_verification` | `contractor` |
| **[Bản đồ Geofence 50m]** | Sidebar (Desktop) / Menu | Utility CTA | $44\text{px}$ | Mở bản đồ kiểm tra bán kính 50m hợp lệ của công trường | Luôn sẵn sàng | `contractor` |
| **[Đăng xuất]** | Header góc trên bên phải | Utility CTA | $44\text{px} \times 44\text{px}$ | Hủy phiên làm việc JWT / Token hiện tại và quay về màn hình đăng nhập | Luôn sẵn sàng | Tất cả |

---

## 7. Quy Chuẩn UI/UX & Responsive

### 7.1. Bảng màu Civic High-Contrast (Zero Glassmorphism)
- **Màu nền Canvas**: `#FAFAF9` (Stone 50) phối cùng thẻ Card `#FFFFFF` thuần túy.
- **Màu mực chữ (High-Contrast Ink)**:
  - Tiêu đề & Chỉ số chính: `#1C1917` (Stone 900 — Tương phản $14.2:1$ so với nền trắng).
  - Nhãn phụ & Hướng dẫn: `#44403C` (Stone 700 — Tương phản $7.5:1$).
- **Màu trạng thái nghiệp vụ**:
  - Cảnh báo gấp / Cần khắc phục: Nền `#FEF3C7` (Amber 100), Viền `#D97706` (Amber 600), Chữ `#B45309` (Amber 700).
  - Nguy cơ vi phạm cao / Quá hạn: Nền `#FEE2E2` (Red 100), Viền `#DC2626` (Red 600), Chữ `#9F241F` (Seal Red).
  - Đã hoàn tất / Điểm cao: Nền `#CCFBF1` (Teal 100), Viền `#0D6F64` (Teal 700), Chữ `#047857` (Emerald 700).
- **Tuyệt đối cấm**: `backdrop-blur-*`, nền kính mờ `bg-white/20`, hiệu ứng bóng mờ đổ dài gây lóa mắt dưới ánh nắng mặt trời ngoài công trường.

### 7.2. Tối ưu hóa điều kiện ngoài trời (Glove-Friendly Touch Targets)
- Tất cả các nút bấm nộp ảnh và chuyển tab có chiều cao tối thiểu **$48\text{px}$** (vượt chuẩn WCAG 44px) để người vận hành bấm chính xác ngay cả khi ngón tay to, đeo găng tay bảo hộ sợi nylon hoặc màn hình bị dính vài hạt bụi/nước.
- Khoảng cách giữa các phần tử bấm (Tap Spacing) tối thiểu **$12\text{px}$** chống bấm nhầm.

### 7.3. Ma trận thích ứng đa màn hình (Responsive Matrix)
- **Mobile nhỏ (360px - 430px)**:
  - 3 Thẻ chỉ số xếp thành 2 hàng (Hàng 1: 2 thẻ 50-50, Hàng 2: 1 thẻ 100%).
  - Các thẻ hành động khẩn cấp chuyển sang dạng khối dọc, nút `[Nộp ảnh đối chứng]` chiếm 100% chiều rộng để dễ bấm bằng ngón tay cái.
  - Thanh Bottom Navigation cố định dưới đáy màn hình với độ cao 60px.
- **Tablet (768px - 1024px)**:
  - 3 Thẻ chỉ số dàn ngang 3 cột đều nhau. Danh sách việc cần làm hiển thị đầy đủ thông tin thời hạn và mã hồ sơ.
- **Laptop & Desktop (1366px - 1920px)**:
  - Bố cục Sidebar bên trái (240px) + Nội dung chính bên phải (tối đa 1280px căn giữa). Hiển thị đầy đủ banner cảnh báo rủi ro pháp lý và bảng danh sách tác vụ chi tiết.

---

## 8. Bẫy Lỗi Thường Gặp & Hướng Dẫn Kiểm Thử

### 8.1. Các bẫy lỗi thực tế tại công trường & Giải pháp phòng ngừa
1. **Bẫy lỗi Quick Token hết hạn 72h khi Chỉ huy trưởng mở lại link cũ**:
   - *Hiện tượng*: Chỉ huy trưởng mở lại tin nhắn SMS của 4 ngày trước, API trả về lỗi 401/403.
   - *Giải pháp*: Không hiển thị trang trắng hoặc lỗi kỹ thuật khó hiểu. Hiển thị màn hình thông báo trang trọng: *"Liên kết bảo mật đã hết hạn 72h. Vui lòng bấm [Gửi lại mã mới qua SMS/Zalo] vào số điện thoại 0988***456 để tiếp tục."*
2. **Bẫy lỗi API trả về mảng rỗng làm sập hàm `.map()` (Null-Pointer Exception)**:
   - *Hiện tượng*: Dự án mới chưa có tác vụ nào, `priorityActions` là `null` hoặc `undefined`.
   - *Giải pháp*: Sử dụng toán tử an toàn `(data?.priorityActions ?? []).map(...)` và hiển thị Empty State tích cực: *"Tuyệt vời! Hiện không có yêu cầu vi phạm nào cần xử lý."*
3. **Bẫy lỗi co giật màn hình khi tải dữ liệu trên mạng 4G chập chờn (CLS)**:
   - *Hiện tượng*: Thẻ số liệu KPI nhảy kích thước khi dữ liệu đang tải.
   - *Giải pháp*: Định sẵn chiều cao khung (Skeleton Loader h-24) với nền xám nhạt `#E7E5E4` đồng bộ.

### 8.2. Hướng dẫn kiểm thử tự động qua CLI PowerShell

```powershell
# 1. Chạy bài kiểm thử đơn lẻ cho phân hệ nhà thầu (< 0.5s)
node --test app/tests/contractor-ui-workspace.test.js

# 2. Kiểm tra tuân thủ bộ quy tắc thiết kế Zero Glassmorphism & High-Contrast
node --test app/tests/design-system-tokens.test.js

# 3. Kiểm tra tính toàn vẹn của Edge API Routes & D1 Database
node --test app/tests/worker-full-edge-routes.test.js

# 4. Chạy cổng kiểm định nhanh cấp độ 3 trước khi commit
npm --prefix app run verify:quick
```
