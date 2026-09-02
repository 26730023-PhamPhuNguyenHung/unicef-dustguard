# PUB-01 — Cổng Thông Tin & Giám Sát Bụi Đô Thị Đa Bên (Public Landing & Civic Action Hub)

---

## 1. Screen Identity

| Thuộc tính | Giá trị SSOT |
|---|---|
| **Mã màn hình** | `PUB-01` |
| **Tên tiếng Việt** | Trang Chủ Truyền Thông & Cổng Giám Sát Bụi Đô Thị Đa Bên |
| **Tên tiếng Anh** | Public Landing & Multi-Stakeholder Civic Action Hub |
| **Route URL** | `/` (Hỗ trợ redirect tự động từ `/landing`) |
| **Component Path** | `app/src/modules/public/LandingPage.jsx` |
| **Sub-components** | `LandingNav.jsx` (`app/src/components/landing/LandingNav.jsx`)<br>`HeroSection.jsx` (`app/src/components/landing/HeroSection.jsx`)<br>`ProblemSection.jsx` (`app/src/components/landing/ProblemSection.jsx`)<br>`SolutionSection.jsx` (`app/src/components/landing/SolutionSection.jsx`)<br>`WorkflowSection.jsx` (`app/src/components/landing/WorkflowSection.jsx`)<br>`YouthSection.jsx` (`app/src/components/landing/YouthSection.jsx`)<br>`TechnologySection.jsx` (`app/src/components/landing/TechnologySection.jsx`)<br>`LiveWorkspaceSection.jsx` (`app/src/components/landing/LiveWorkspaceSection.jsx`)<br>`ImpactSection.jsx` (`app/src/components/landing/ImpactSection.jsx`)<br>`CTASection.jsx` (`app/src/components/landing/CTASection.jsx`)<br>`LandingFooter.jsx` (`app/src/components/landing/LandingFooter.jsx`)<br>`LandingModals.jsx` (`DemoModal`, `EvidenceModal`, `PilotModal`)<br>`landingContent.js` (SSOT Nội dung song ngữ VI/EN) |
| **Layout** | Public Root Layout (Sticky Navigation, Skip Link tiếp cận WCAG, Main Semantic Landmark, Footer 4 cột) |
| **Quyền truy cập (Role)** | Mọi đối tượng (Khách vãng lai, Công dân, Tình nguyện viên, Cán bộ thanh tra, Nhà thầu thi công, Lãnh đạo điều hành) |
| **Trạng thái Production** | **ACTIVE** (Level 5 Production Coherent — 100% Khớp D1 SQLite SSOT, Song ngữ VI/EN, Zero Glassmorphism, Zero Truncation) |

---

## 2. Mục Đích & Giá Trị Thực Tế tại Đô Thị Việt Nam

### 2.1. Giải quyết bài toán gì tại các đô thị Việt Nam?
Tại các đại đô thị như **Hà Nội** và **TP. Hồ Chí Minh**, hoạt động thi công hạ tầng giao thông và các đại dự án bất động sản đang diễn ra với mật độ rất cao:
- **Hà Nội**: Tuyến đường Vành đai 3 trên cao (đoạn Mai Dịch — Khuất Duy Tiến — Bán đảo Linh Đàm), công trình hầm chui Lê Văn Lương — Tố Hữu, trục giao thông Nguyễn Văn Huyên kéo dài, và đại công trường KĐT Tây Hồ Tây (Starlake).
- **TP. Hồ Chí Minh**: Tuyến Vành đai 3 TP.HCM, nút giao An Phú (TP. Thủ Đức), trục đường Lương Định Của và các công trường cải tạo kênh rạch hạ tầng đô thị.

**Thực trạng nhức nhối hiện nay**:
1. **"Bẫy rơi vào im lặng" của các phản ánh dân sự**: Người dân chụp ảnh xe tải không phủ bạt, vật liệu rơi vãi rồi đăng lên các hội nhóm cư dân Facebook, Zalo, hoặc gửi lên Cổng 1022 và ứng dụng iHanoi. Tuy nhiên, thông tin thường bị trôi tin, không có mã theo dõi xuyên suốt, người gửi hoàn toàn không biết hồ sơ đã được chuyển cho ai, tiến độ khắc phục ra sao và hiện trường có được xử lý thực chất hay không.
2. **Cán bộ cơ sở và Thanh tra Đô thị quá tải**: Không có công cụ sàng lọc và chấm điểm ưu tiên khoa học, dẫn đến việc xử lý dàn trải theo cảm tính hoặc theo thứ tự nộp đơn thay vì tập trung vào những điểm nóng bụi nghiêm trọng gần trường học, bệnh viện hay khu dân cư đông đúc.
3. **Thiếu cơ chế đối chứng Trước / Sau (Before / After)**: Báo cáo khắc phục của các nhà thầu thi công thường chỉ dừng lại ở văn bản giấy hoặc lời hứa miệng mà không có minh chứng hình ảnh có tọa độ GPS và mốc thời gian rõ ràng để nghiệm thu thực tế.
4. **Chi phí trạm đo quan trắc truyền thống quá đắt đỏ**: Các trạm quan trắc tự động nhập khẩu tiêu tốn hàng trăm triệu đến hàng tỷ đồng, khiến việc phủ rộng mạng lưới đo đạc tại từng cổng công trường trở nên bất khả thi.

### 2.2. Giá trị đột phá của DustGuard VN
DustGuard VN ra đời như một **nền tảng Công nghệ Công dân (CivicTech)** tiên phong, kết nối 5 chủ thể (Người dân — CLB Thanh niên tình nguyện — Đơn vị điều phối — Cán bộ thanh tra — Nhà thầu thi công) trong một chu trình xử lý khép kín, minh bạch và có thể kiểm chứng:
- **Một hồ sơ duy nhất (`#DG-2026-xxxx`)**: Biến mọi phản ánh hiện trường thành một hồ sơ tác nghiệp chuẩn hóa, theo dõi liên tục qua 5 nấc trạng thái từ lúc phát hiện đến khi đóng vụ việc.
- **Quy trình tái kiểm 24h–48h thực chất**: Huy động lực lượng sinh viên, thanh niên tình nguyện các trường Đại học (ĐHQG Hà Nội, ĐH Bách Khoa, ĐH Kiến Trúc, ĐH Tự Nhiên) trực tiếp đến hiện trường chụp ảnh đối chứng Before/After, kiểm tra 5/5 tiêu chí chống bụi đô thị.
- **Thang điểm ưu tiên khoa học (0–100)**: Thuật toán chấm điểm tự động dựa trên nồng độ PM2.5/PM10, cự ly tiếp giáp trường học/bệnh viện ($\le 200\text{m}$), mật độ phản ánh gộp và lịch sử tái phạm của công trình.
- **Mạng lưới Trạm đo mở cộng đồng (Open Hardware ≈ 500.000đ/node prototype)**: Sử dụng module cảm biến quang học chi phí thấp kết nối ESP32/Wi-Fi/4G đóng vai trò là nguồn dữ liệu cảnh báo sớm, kết hợp hoàn hảo với 100% dữ liệu quan trắc thực địa từ con người.

### 2.3. Bảng so sánh cách làm truyền thống vs DustGuard VN
| Tiêu chí | Cách làm truyền thống (Cũ) | DustGuard VN (Mới & Đột phá) |
|---|---|---|
| **Kênh tiếp nhận** | Rời rạc qua mạng xã hội, tin nhắn Zalo, đơn thư giấy | 1 Mã hồ sơ duy nhất (`#DG-2026-xxxx`) có dòng thời gian công khai |
| **Xác minh thực địa** | Cán bộ tự đi kiểm tra thủ công, dễ sót lọt | Mạng lưới CLB Thanh niên/Sinh viên hỗ trợ khảo sát và tái kiểm trong 24–48h |
| **Phân loại ưu tiên** | Cảm tính theo thứ tự gửi đến hoặc mức độ bức xúc | Thang điểm 0–100 giải thích rõ lý do (Mức bụi, trường học, điểm gộp, tái phạm) |
| **Minh chứng khắc phục** | Lời hứa miệng hoặc biên bản giấy chung chung | Bắt buộc đối chứng Trước / Sau (Before / After) có GPS và mốc thời gian |
| **Trách nhiệm xử lý** | Đùn đẩy giữa các đơn vị, người dân không rõ ai phụ trách | Xác định rõ Người điều phối, Đội phản ứng nhanh và Nhà thầu thi công |
| **Hạ tầng đo đạc** | Trạm đo nhập khẩu đắt đỏ, số lượng cực ít | Trạm đo mở cộng đồng 500k kết hợp 100% quan sát hiện trường thực tế |

### 2.4. Quy tắc 10 Giây (10-Second Screen Rule)
Trong 10 giây đầu tiên khi mở Trang chủ `/`:
1. **Người dùng nắm bắt ngay thông điệp**: *"Phát hiện bụi. Theo dõi đến khi xử lý."*
2. **Nhìn thấy ngay Thẻ hồ sơ mẫu `#DG-2026-0842`** tại Vành đai 3 với thanh gạt Trước / Sau (Before: 142 µg/m³ đỏ rực $\leftrightarrow$ After: 28 µg/m³ xanh an toàn).
3. **Tiếp cận ngay 2 nút hành động lớn**: Nút đỏ son `[Phản ánh]` (Gửi vi phạm trong 30s) và Nút `[Xem demo]` (Khám phá toàn bộ 5 vai trò).

---

## 3. Đối Tượng Người Dùng & Hành Trình Thao Tác (User Journey)

### 3.1. Chân dung người dùng điển hình tại Việt Nam
1. **Chị Nguyễn Thu Hà (34 tuổi, Cư dân chung cư ven đường Vành đai 3, Hà Nội)**: Hàng ngày chịu cảnh bụi mù mịt từ xe chở đất công trường. Muốn chụp ảnh gửi phản ánh ngay trên điện thoại và theo dõi xem chính quyền có yêu cầu nhà thầu dập bụi thật hay không.
2. **Bạn Trần Minh Đức (21 tuổi, Sinh viên ĐH Bách Khoa, Đội trưởng CLB Tình nguyện Môi trường)**: Muốn tham gia các chiến dịch khảo sát thực địa quanh khu vực trường tiểu học trên địa bàn quận Cầu Giấy, điền checklist và tích lũy giờ tình nguyện/tín chỉ thanh niên.
3. **Đồng chí Lê Hoàng Nam (42 tuổi, Cán bộ Đội Thanh tra Đô thị & Môi trường Quận)**: Cần công cụ quản lý tập trung các điểm nóng, xem nhanh hồ sơ ưu tiên cao cần kiểm tra trong ngày và theo dõi thời hạn SLA 48h khắc phục của nhà thầu.
4. **Kỹ sư Phạm Văn Hùng (48 tuổi, Chỉ huy trưởng công trường KĐT An Phú, TP. Thủ Đức)**: Cần tiếp nhận nhanh thông báo yêu cầu khắc phục, tổ chức tưới rửa đường, căng lưới chống bụi và nộp ảnh hoàn thành để được nghiệm thu mở lại công trường.

### 3.2. Sơ đồ luồng hành trình người dùng (User Journey Flow)

```text
[Người dân / Cán bộ / Khách truy cập vào Trang Chủ (/)]
                         │
                         ├──> [1] Đọc Hero & Xem đối chứng Before/After
                         │      │
                         │      ├──> Bấm [Phản ánh] ──────> Mở Form ghi nhận 30s (/citizen/report/new)
                         │      └──> Bấm [Xem demo] ───────> Mở Trung tâm trải nghiệm 5 vai trò (/demo)
                         │
                         ├──> [2] Khám phá 6 Nguồn tin phân mảnh & 4 Câu hỏi thực tế (The Gap)
                         │
                         ├──> [3] Tìm hiểu Quy trình 4 Bước chuẩn hóa (Ghi nhận -> Xác minh -> Ưu tiên -> Case Dossier)
                         │
                         ├──> [4] Xem Bảng Đối Chứng Thực Tế Before/After tại Hầm chui Lê Văn Lương / Vành đai 3
                         │
                         ├──> [5] Khám phá Hệ sinh thái 5 Vai trò tác nghiệp (Dân, CLB Sinh viên, Điều phối, Nhà thầu, Cán bộ)
                         │
                         ├──> [6] Trải nghiệm tương tác 3 Tabs Workspace (Dashboard vận hành / Việc của tôi / Timeline theo phút)
                         │
                         ├──> [7] Xem Lộ trình 3 Giai đoạn Pilot & Bấm [Đăng ký pilot] ──> Mở PilotModal
                         │
                         └──> [8] Điều hướng Header / Footer:
                                ├──> Bấm [Bản đồ] ────────> Mở Bản đồ tra cứu điểm nóng (/map)
                                ├──> Bấm [Cán bộ] ────────> Mở Cổng đăng nhập tác nghiệp (/login)
                                └──> Bấm [EN / VI] ───────> Chuyển đổi ngôn ngữ toàn bộ giao diện
```

---

## 4. Bố Cục Giao Diện & Wireframe ASCII Chi Tiết Từng Khối

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ STICKY NAVIGATION BAR (LandingNav.jsx)                                                           │
│ [DG] DustGuard VN  · GIÁM SÁT BỤI ĐÔ THỊ    [Bản đồ] [Vấn đề] [Giải pháp] [Quy trình] [Pilot]    │
│                                                [VI | EN]  [Cán bộ]  [Xem demo]  [Phản ánh (Đỏ)]  │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 1: HERO SECTION (HeroSection.jsx)                                                        │
│ ┌──────────────────────────────────────────────┬───────────────────────────────────────────────┐ │
│ │ ● GIÁM SÁT BỤI ĐÔ THỊ                        │  [● HỒ SƠ THEO DÕI]             #DG-2026-0842 │ │
│ │                                              │  📍 Vành đai 3 · Dịch Vọng Hậu  [✓ Đã chuyển] │ │
│ │ Phát hiện bụi.                               │ ┌───────────────────────────────────────────┐ │ │
│ │ Theo dõi đến khi xử lý.                      │ │ 01 Phát hiện → 02 Xác minh → 03 Xử lý    │ │ │
│ │                                              │ │ → 04 Khắc phục (Đang làm) → 05 Tái kiểm   │ │ │
│ │ Ghi nhận hiện trường, chuyển xử lý           │ └───────────────────────────────────────────┘ │ │
│ │ và theo dõi kết quả trên một hệ thống.       │ ┌──────────────────────┬────────────────────┐ │ │
│ │                                              │ │ [● Hiện trường (142)]│ [Sau xử lý (28 µg)]│ │ │
│ │ ┌──────────────────┐  ┌──────────────────┐   │ ├──────────────────────┴────────────────────┤ │ │
│ │ │ [Phản ánh] (Đỏ)  │  │ [Xem demo] (Kem) │   │ │ Ưu tiên: 85/100 (Cao) │ PM2.5: 142 µg/m³   │ │ │
│ │ └──────────────────┘  └──────────────────┘   │ │ Ghi nhận: Xe tải chở đất không phủ bạt    │ │ │
│ │                                              │ │ Trạng thái: Đang xử lý                    │ │ │
│ │                                              │ │ [ Xem chi tiết hồ sơ → ]                  │ │ │
│ │                                              │ └───────────────────────────────────────────┘ │ │
│ └──────────────────────────────────────────────┴───────────────────────────────────────────────┘ │
│ DẢI 3 PROOF POINTS:                                                                              │
│ ┌──────────────────────────┐ ┌──────────────────────────┐ ┌──────────────────────────────────┐ │
│ │ 0–100                    │ │ 24–48h                   │ │ ≈ 500.000đ                       │ │
│ │ Thang ưu tiên hồ sơ      │ │ Chu kỳ tái kiểm hiện trg │ │ Node đo bụi mở prototype         │ │
│ │ Hỗ trợ người vận hành    │ │ Đảm bảo khắc phục thực sự│ │ Chi phí linh kiện tham chiếu     │ │
│ └──────────────────────────┘ └──────────────────────────┘ └──────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 2: KHOẢNG TRỐNG THỰC TẾ (ProblemSection.jsx)                                             │
│ Eyebrow: KHOẢNG TRỐNG THỰC TẾ                                                                    │
│ Headline: Một phản ánh chỉ có giá trị khi biết điều gì xảy ra sau đó.                            │
│ 6 NGUỒN TIN PHÂN MẢNH:                                                                           │
│ [01. Ảnh camera] [02. Chat người dân] [03. Bản đồ tách biệt] [04. Cảm biến rời] [05. Checklist] [06. Tin trôi] │
│ 4 CÂU HỎI LỚN CHƯA CÓ LỜI GIẢI:                                                                 │
│ ? 01. Việc nào cần xem trước?           ? 02. Ai đang phụ trách?                                 │
│ ? 03. Đã xử lý đến đâu?                 ? 04. Hiện trường thực sự đã tốt hơn chưa?               │
│ => Khẳng định: DustGuard tập hợp tất cả thành 1 hồ sơ duy nhất theo dõi từ đầu đến cuối.          │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 3: QUY TRÌNH XỬ LÝ 4 BƯỚC (SolutionSection.jsx)                                          │
│ ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐ ┌──────────────────────────┐ │
│ │ BƯỚC 1: GHI NHẬN  │ │ BƯỚC 2: XÁC MINH  │ │ BƯỚC 3: ƯU TIÊN   │ │ BƯỚC 4: HỒ SƠ (CASE)     │ │
│ │ Ảnh, GPS, mô tả,  │ │ Lọc thiếu tin,    │ │ Thang điểm 0–100  │ │ Mã hồ sơ duy nhất,       │ │
│ │ tên công trình,   │ │ kiểm tra vị trí,  │ │ dựa trên PM2.5,   │ │ phân công phụ trách,     │ │
│ │ chỉ số PM2.5.     │ │ checklist thực địa│ │ trường học, điểm gộp│ nhật ký theo phút, chứng cứ│ │
│ └───────────────────┘ └───────────────────┘ └───────────────────┘ └──────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 4: THEO DÕI & TÁI KIỂM (WorkflowSection.jsx)                                             │
│ Chu trình khép kín: 01 Phát hiện → 02 Xác minh → 03 Chuyển xử lý → 04 Khắc phục → 05 Tái kiểm → 06 Kết quả │
│ BẢNG ĐỐI CHỨNG BEFORE / AFTER (Hầm chui Lê Văn Lương):                                           │
│ ┌──────────────────────────────────────────────┬───────────────────────────────────────────────┐ │
│ │ BEFORE · HIỆN TRƯỜNG KHI PHÁT HIỆN           │ AFTER · HIỆN TRƯỜNG SAU XỬ LÝ                 │ │
│ │ • Ảnh: Xe ben làm rơi đất cát, bụi mù mịt    │ • Ảnh tái kiểm: Đã căng bạt & tưới rửa đường  │ │
│ │ • GPS: 21.0312° N, 105.7824° E (Sai số < 5m) │ • Checklist nghiệm thu: Đạt 5/5 tiêu chuẩn     │ │
│ │ • Thời gian: 08:42 · 01/09/2026              │ • Thời gian tái kiểm: 10:30 · 02/09/2026 (26h)│ │
│ │ • PM2.5: 142 µg/m³ (Mức cảnh báo đỏ)         │ • Người xác minh: CLB TNV ĐHQG + Đội liên ngành│ │
│ └──────────────────────────────────────────────┴───────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 5: PHÂN VAI TÁC NGHIỆP 5 NHÓM (YouthSection.jsx)                                         │
│ 01. Người dân (Phát hiện) │ 02. CLB Sinh viên (Tái kiểm) │ 03. Điều phối viên (Phân công)        │
│ 04. Đơn vị xử lý / Nhà thầu (Khắc phục) │ 05. Quản trị & Lãnh đạo (Giám sát toàn diện)          │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 6: CÔNG NGHỆ & IOT MỞ (TechnologySection.jsx)                                            │
│ [Trụ cột 1: Bằng chứng số SHA-256] [Trụ cột 2: Bản đồ WGS84 Geofence 50m] [Trụ cột 3: AI Copilot]│
│ Khung cam kết: "IoT là nguồn dữ liệu bổ sung, không phải điều kiện bắt buộc để DustGuard chạy"   │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 7: TRẢI NGHIỆM GIAO DIỆN TRỰC TIẾP (LiveWorkspaceSection.jsx)                             │
│ Tabs: [ Dashboard Vận Hành ]  │  [ Việc Của Tôi (TNV) ]  │  [ Dòng Thời Gian Minh Bạch ]         │
│ Nội dung Tab tương tác: Hiển thị đúng người, đúng việc, minh bạch theo từng phút                 │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 8: LỘ TRÌNH TRIỂN KHAI PILOT (ImpactSection.jsx)                                         │
│ Giai đoạn 1: Pilot 1 Quận (20-30 TNV) → Giai đoạn 2: Đo lường SLA → Giai đoạn 3: Mở rộng 1022/iHanoi│
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 9: KÊU GỌI ĐỒNG HÀNH & CHÂN TRANG (CTASection.jsx + LandingFooter.jsx)                   │
│ Manifesto: "Một vấn đề được nhìn thấy không nên trở thành một vấn đề bị lãng quên."             │
│ Banner Pilot: [Đăng ký pilot]  [Trao đổi với DustGuard]  [Xem bản demo]                          │
│ Footer 4 cột: Sản phẩm | Tài nguyên | Hợp tác & Pilot | © 2026 DustGuard VN                      │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & State / API Contract

### 5.1. Client States (`LandingPage.jsx`)
```javascript
// Quản lý ngôn ngữ song ngữ VI / EN (Đồng bộ localStorage)
const [lang, setLang] = useState(() => localStorage.getItem('dg-lang') || 'vi');

// ScrollSpy theo dõi mục đang cuộn tới
const [activeSection, setActiveSection] = useState('hero');

// Trạng thái hiển thị các Modal đối thoại
const [isDemoOpen, setIsDemoOpen] = useState(false);
const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
const [isPilotOpen, setIsPilotOpen] = useState(false);
```

### 5.2. Content SSOT Contract (`landingContent.js`)
Toàn bộ văn bản hiển thị trên trang chủ đều được lưu trữ theo cấu trúc song ngữ `{ vi: '...', en: '...' }`, tuyệt đối không hardcode chuỗi trực tiếp trong file JSX:
```javascript
export const landingContent = {
  nav: { brandTag: { vi: 'GIÁM SÁT BỤI ĐÔ THỊ', en: 'URBAN DUST MONITORING' }, ... },
  hero: {
    eyebrow: { vi: 'GIÁM SÁT BỤI ĐÔ THỊ', en: 'URBAN DUST MONITORING' },
    headline: { vi: 'Phát hiện bụi.', en: 'Detect dust.' },
    redAccent: { vi: 'Theo dõi đến khi xử lý.', en: 'Track until resolved.' },
    subhead: {
      vi: 'Ghi nhận hiện trường, chuyển xử lý và theo dõi kết quả trên một hệ thống.',
      en: 'Record field issues, dispatch mitigation, and track results on a unified system.'
    },
    previewCard: {
      caseId: '#DG-2026-0842',
      location: { vi: 'Vành đai 3 · Dịch Vọng Hậu', en: 'Ring Road 3 · Dich Vong Hau' },
      before: { riskScore: '85/100', dustMetricValue: '142 µg/m³', statusValue: { vi: 'Đang xử lý', en: 'In Progress' } },
      after: { riskScore: '18/100', dustMetricValue: '28 µg/m³', statusValue: { vi: 'Đã khắc phục', en: 'Resolved' } }
    },
    proofPoints: [ ... ]
  },
  // Bidirectional aliases đảm bảo tương thích ngược:
  process: landingContent.solution,
  accountability: landingContent.workflow,
  roles: landingContent.youth,
  tech: landingContent.technology,
  pilot: landingContent.impact
};
```

### 5.3. Ánh xạ Dữ liệu Thực tế Cơ sở Dữ liệu D1 (D1 SQLite SSOT Mapping)
Mặc dù Landing Page là trang truyền thông tĩnh giàu tương tác, cấu trúc dữ liệu hiển thị (Thẻ Case Preview, Dòng thời gian, Dashboard) phản ánh 100% schema của hệ thống D1:
- **Bảng `cases`**: `id` (`#DG-2026-0842`), `site_name` (`Vành đai 3 - Dịch Vọng Hậu`), `priority_score` (`85`), `status` (`IN_PROGRESS` $\rightarrow$ `RESOLVED`), `assigned_unit` (`Đội phản ứng nhanh`).
- **Bảng `observations`**: `id`, `case_id`, `before_photo_url`, `after_photo_url`, `pm25_value`, `sha256_hash`, `latitude` (`21.0312`), `longitude` (`105.7824`).
- **Bảng `audit_logs`**: `timestamp`, `actor_name`, `action_type`, `description`.

---

## 6. Hành Động Cốt Lõi (Core Actions & CTAs)

| Vị trí | Nhãn nút / Tương tác | Màu sắc & Token | Kích thước Touch Target | Đích đến / Hành vi | Phân quyền |
|---|---|---|:---:|---|---|
| **Sticky Header** | `[Phản ánh]` | Nền đỏ son `#9f241f`, chữ trắng, icon Send | $\ge 44\text{px} \times 44\text{px}$ | Điều hướng tới `/citizen/report/new` | Mọi đối tượng |
| **Sticky Header** | `[Xem demo]` | Nền kem `#FDFBF7`, viền xám nhạt, icon Compass | $\ge 40\text{px} \times 40\text{px}$ | Điều hướng tới `/demo` | Mọi đối tượng |
| **Sticky Header** | `[Cán bộ]` | Nền kem `#FDFBF7`, viền xám nhạt, icon UserCheck | $\ge 40\text{px} \times 40\text{px}$ | Điều hướng tới `/login` | Cán bộ / Khách |
| **Sticky Header** | `[VI / EN]` | Nền kem, viền nhạt `hover:bg-cream-100` | $\ge 38\text{px} \times 38\text{px}$ | Gọi `toggleLang()` chuyển đổi ngôn ngữ | Mọi đối tượng |
| **Hero Left** | `[Phản ánh]` | Nền đỏ son `#9f241f`, chữ trắng, bóng mềm | Chiều cao min $44\text{px}$, px-6 | Chuyển tới form báo cáo 30s | Mọi đối tượng |
| **Hero Left** | `[Xem demo]` | Nền kem viền xám `border-ink-900/15` | Chiều cao min $44\text{px}$, px-6 | Chuyển tới Demo Hub 5 vai trò | Mọi đối tượng |
| **Hero Card** | `[Hiện trường]` ↔ `[Sau xử lý]` | Segmented Control tab Before/After | Chiều cao min $38\text{px}$ | Đổi dữ liệu hiển thị trên Card `#DG-2026-0842` | Mọi đối tượng |
| **Hero Card** | `[Xem chi tiết hồ sơ]` | Nền xám kem, chữ đen mực, icon FileText | Chiều cao min $38\text{px}$, w-full | Chuyển tới tra cứu hồ sơ `/citizen/track` | Mọi đối tượng |
| **Workspace** | `[Dashboard] / [Việc của tôi] / [Timeline]` | Tab navigation buttons | Chiều cao min $40\text{px}$ | Chuyển đổi góc nhìn tác nghiệp trực tiếp | Mọi đối tượng |
| **CTA Banner** | `[Đăng ký pilot]` | Nền đỏ son `#9f241f`, chữ trắng | Chiều cao min $44\text{px}$, px-8 | Mở `PilotModal` thu thập form hợp tác | Mọi đối tượng |
| **Toàn cục** | Phím `Escape` | Bàn phím | N/A | Tự động đóng tất cả các Modal đang mở | Mọi đối tượng |

---

## 7. Quy Chuẩn UI/UX & Responsive (Civic High-Contrast)

### 7.1. Bảng màu & Design Tokens (Độ tương phản cao, Sáng màu)
- **Nền tổng thể (Cream Canvas)**: `#FDFBF7` / `#fbf9f4` — Màu giấy công vụ dịu mắt, chống chói ngoài trời nắng gắt.
- **Chữ chính (Deep Ink)**: `#231B14` / `#1a1612` — Đạt chuẩn tương phản WCAG AAA ($\ge 7:1$).
- **Màu nhấn hành động (Seal Red)**: `#9F241F` / `#821e1a` — Thể hiện tính khẩn cấp và trách nhiệm công dân.
- **Màu sinh thái & Kiểm định (Teal / Emerald)**: `#0D6F64` / `#2f7d56` — Đại diện cho môi trường và tính minh bạch.
- **Cảnh báo cần theo dõi (Amber)**: `#D97706` / `#b45309` — Dành cho các hồ sơ mức độ trung bình.
- **QUY TẮC BẤT DI BẤT DỊCH**: **Tuyệt đối CẤM Glassmorphism**, cấm `backdrop-blur-*`, không dùng màu chữ mờ nhạt khó đọc.

### 7.2. Typography & Zero Truncation Rule
- **Headline H1 & H2**: Áp dụng `text-wrap: balance` để tiêu đề tự ngắt dòng cân xứng, không bị mồ côi từ.
- **Subhead & Body**: Áp dụng `text-wrap: pretty` để đoạn văn bản tiếng Việt dàn đều thanh lịch.
- **Zero Truncation trên thực thể dân sự**: Cấm dùng `truncate`, `line-clamp`, `overflow-hidden` để che giấu tên công trình, địa chỉ, mã hồ sơ hay nhiệm vụ. Đọc được trọn vẹn thông tin quan trọng hơn việc nhồi nhét.

### 7.3. Quy chuẩn Responsive đa màn hình
1. **Mobile (360px – 430px)**:
   - Header thu gọn: Logo DustGuard VN + Nút Hamburger + Nút chuyển đổi [VI/EN].
   - Drawer menu trượt ra có khóa cuộn trang (`body.style.overflow = 'hidden'`) và đóng khi ấn `Escape`.
   - Khối Hero tự động xếp thành 1 cột dọc (Cột chữ phía trên $\rightarrow$ Thẻ Card `#DG-2026-0842` phía dưới).
   - Mọi nút bấm và điểm chạm đều đạt chuẩn $\ge 44\text{px} \times 44\text{px}$.
2. **Laptop 14-inch (1366x768 & 1440x900, Windows Scale 125%)**:
   - Header giữ vững trên 1 dòng duy nhất (**Zero Menu Wrap**): 5 liên kết điều hướng + 4 nút hành động dàn đều nhờ `flex-nowrap`, `shrink-0` và khoảng cách `gap-2` đến `gap-4`.
   - Khối Hero chia 2 cột cân xứng (55% Cột chữ — 45% Thẻ Card Preview).
3. **Desktop lớn (1920x1080)**:
   - Container giới hạn tối đa `1280px` căn giữa chuẩn mực, typography rõ nét, khoảng cách lề `py-16` sang trọng.

---

## 8. Bẫy Lỗi Thường Gặp & Hướng Dẫn Kiểm Thử

### 8.1. Các bẫy lỗi cần phòng ngừa (Forensic Checklist)
1. **Lỗi dùng Jargon Kỹ thuật trên UI người dùng**: Tuyệt đối không dùng các từ như "DAG 7 bước", "HMAC", "SHA-256 Web Crypto", "Telemetry payload" trong phần hiển thị cho dân; thay bằng "Quy trình xử lý", "Xác thực số", "Bằng chứng điện tử", "Dữ liệu quan trắc".
2. **Lỗi tràn vỡ Header trên màn hình Laptop 1366px**: Nếu thêm nút hoặc chỉnh font mà không test màn hình 1366px sẽ khiến nút `[Phản ánh]` bị đẩy xuống dòng thứ 2. Bắt buộc dùng `shrink-0` và `min-w-0`.
3. **Lỗi kẹt thanh cuộn trang khi đóng mở Modal/Drawer**: Khi mở Drawer hoặc Modal, hàm đóng phải luôn trả lại `document.body.style.overflow = ''`.
4. **Lỗi ký tự Unicode bị vỡ (Unicode Glyphs)**: Tuyệt đối không dùng các ký tự lạ (□, ➔, ✓ thô) trong JSX; luôn sử dụng icon Lucide chuẩn (`CheckCircle2`, `ArrowRight`, `Send`).

### 8.2. Lệnh kiểm thử nhanh trên PowerShell CLI (< 0.5s)
```powershell
# 1. Kiểm tra tính toàn vẹn của nội dung Copy SSOT và bộ lọc từ cấm jargon
node --test app/tests/landing-page-copy-ssot.test.js

# 2. Kiểm tra kiến trúc responsive, CSS invariants và touch targets 44px
node --test app/tests/landing-layout-responsive.test.js

# 3. Kiểm tra tính độc bản và chống trùng lặp file landing
node --test app/tests/landing-ssot-guard.test.js

# 4. Chạy toàn bộ bộ kiểm thử Landing Page Suite (< 1s)
node --test app/tests/landing-*.test.js
```
