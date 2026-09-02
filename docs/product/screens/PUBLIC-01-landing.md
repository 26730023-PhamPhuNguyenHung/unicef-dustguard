# PUB-01 — Cổng Thông Tin & Giám Sát Bụi Đô Thị Đa Bên (Public Landing & Civic Action Hub)

---

## 1. Định Danh Màn Hình (Screen Identity)

| Thuộc tính | Chi tiết |
|---|---|
| **Mã màn hình** | `PUB-01` |
| **Tên tiếng Việt** | Trang Chủ Truyền Thông & Cổng Giám Sát Bụi Đô Thị |
| **Tên tiếng Anh** | Public Landing & Civic Action Hub |
| **Đường dẫn (URL)** | `/` (tự động nhận diện và chuyển hướng từ `/landing`) |
| **Tập tin mã nguồn chính** | `app/src/modules/public/LandingPage.jsx` |
| **Các khối thành phần** | `LandingNav.jsx` (Thanh menu trên cùng)<br>`HeroSection.jsx` (Khối giới thiệu & thẻ hồ sơ mẫu Before/After)<br>`ProblemSection.jsx` (Khoảng trống thực tế & 4 câu hỏi lớn)<br>`SolutionSection.jsx` (Quy trình xử lý 4 bước dễ hiểu)<br>`WorkflowSection.jsx` (Dòng thời gian & bảng đối chứng Trước/Sau)<br>`YouthSection.jsx` (Phân chia vai trò 5 nhóm tham gia)<br>`TechnologySection.jsx` (Công nghệ thực tế hỗ trợ con người)<br>`LiveWorkspaceSection.jsx` (Trải nghiệm thử 3 góc nhìn làm việc)<br>`ImpactSection.jsx` (Lộ trình thử nghiệm thực tế 3 giai đoạn)<br>`CTASection.jsx` (Kêu gọi hành động & đăng ký thử nghiệm)<br>`LandingFooter.jsx` (Chân trang 4 cột thông tin)<br>`LandingModals.jsx` (Cửa sổ xem thử vai trò, xem ảnh gốc, đăng ký hợp tác)<br>`landingContent.js` (Nội dung hiển thị song ngữ VI/EN) |
| **Bố cục giao diện** | Khung trang công khai (Menu trên cùng cố định, thân trang rõ ràng, chân trang 4 cột) |
| **Quyền truy cập** | Tất cả mọi người (Người dân, sinh viên tình nguyện, cán bộ quản lý, nhà thầu thi công) |
| **Trạng thái vận hành** | **Đang hoạt động ổn định** (Đồng bộ dữ liệu chuẩn, hỗ trợ song ngữ VI/EN, giao diện sáng màu tương phản cao, không cắt cụt chữ) |

---

## 2. Mục Đích Nghiệp Vụ & Giá Trị Thực Tế tại Đô Thị Việt Nam

### 2.1. Giải quyết bài toán gì tại các đô thị Việt Nam?
Tại các đô thị lớn như **Hà Nội** và **TP. Hồ Chí Minh**, hoạt động thi công hạ tầng giao thông và các khu đô thị mới diễn ra liên tục:
- **Hà Nội**: Tuyến đường Vành đai 3 trên cao (đoạn Mai Dịch — Khuất Duy Tiến — Bán đảo Linh Đàm), công trình hầm chui Lê Văn Lương — Tố Hữu, trục đường Nguyễn Văn Huyên kéo dài, KĐT Tây Hồ Tây (Starlake).
- **TP. Hồ Chí Minh**: Tuyến Vành đai 3 TP.HCM, nút giao An Phú (TP. Thủ Đức), đường Lương Định Của và các công trường cải tạo kênh rạch thoát nước.

**4 Bức xúc lớn của người dân hiện nay**:
1. **Phản ánh dễ bị trôi tin**: Người dân chụp ảnh xe chở đất cát không phủ bạt đăng lên nhóm Facebook, Zalo, hoặc gửi lên Cổng 1022 và ứng dụng iHanoi. Tuy nhiên, thông tin thường bị trôi, không có mã hồ sơ để theo dõi xem đơn vị nào đang xử lý và khi nào làm xong.
2. **Cán bộ quản lý quá tải**: Không có công cụ chấm điểm ưu tiên điểm nóng, dẫn đến việc phải xử lý dàn trải thay vì tập trung vào những nơi bụi nặng ngay sát cổng trường học, bệnh viện hay khu dân cư.
3. **Thiếu hình ảnh đối chứng Trước / Sau**: Báo cáo khắc phục của đơn vị thi công nhiều khi chỉ là văn bản giấy hoặc lời hứa miệng mà không có ảnh chụp thực tế có vị trí và giờ chụp rõ ràng để đối chiếu.
4. **Trạm đo tự động chuyên dụng quá đắt**: Các trạm quan trắc nhập khẩu có giá từ vài trăm triệu đến hàng tỷ đồng, không thể lắp đặt đại trà ở từng cổng công trường.

### 2.2. Giá trị thiết thực của DustGuard VN
DustGuard VN là **nền tảng công nghệ vì cộng đồng**, kết nối 5 nhóm (Người dân — Sinh viên tình nguyện — Đơn vị điều phối — Cán bộ thanh tra — Nhà thầu thi công) trong một quy trình xử lý rõ ràng:
- **Một mã hồ sơ duy nhất (ví dụ: `#DG-2026-0842`)**: Biến mỗi phản ánh từ hiện trường thành một hồ sơ chuẩn, theo dõi rõ từng bước từ lúc phát hiện đến khi dập bụi xong.
- **Kiểm tra thực tế trong 24h – 48h**: Huy động các đội sinh viên tình nguyện (ĐH Bách Khoa, ĐHQG Hà Nội, ĐH Kiến Trúc...) trực tiếp đến hiện trường chụp ảnh đối chứng Trước / Sau và kiểm tra các tiêu chí chống bụi (che bạt, tưới rửa đường, rửa bánh xe).
- **Thang điểm ưu tiên 0 – 100 dễ hiểu**: Tự động tính điểm dựa trên mức độ bụi thực tế, khoảng cách gần trường học/bệnh viện (dưới 200m), số lần người dân cùng phản ánh và lịch sử tái phạm của công trình.
- **Trạm đo mở tự ráp giá rẻ (~500.000đ/trạm)**: Sử dụng linh kiện thông dụng mua tại chợ điện tử Việt Nam để cảnh báo sớm, kết hợp 100% với việc người thật đi kiểm tra thực địa.

### 2.3. Bảng so sánh cách làm cũ vs DustGuard VN

| Tiêu chí | Cách làm truyền thống (Cũ) | DustGuard VN (Mới & Thiết thực) |
|---|---|---|
| **Kênh tiếp nhận** | Rời rạc qua mạng xã hội, tin nhắn Zalo, đơn thư giấy | 1 Mã hồ sơ duy nhất (`#DG-2026-xxxx`) có nhật ký tiến độ công khai |
| **Xác minh thực tế** | Cán bộ tự đi kiểm tra thủ công, dễ quá tải và sót việc | Mạng lưới sinh viên tình nguyện hỗ trợ chụp ảnh kiểm tra trong 24–48h |
| **Phân loại việc gấp** | Cảm tính theo thứ tự gửi đến hoặc mức độ bức xúc | Thang điểm 0–100 chỉ rõ lý do (mức bụi, gần trường học, phản ánh lặp lại) |
| **Minh chứng khắc phục** | Lời hứa miệng hoặc văn bản báo cáo chung chung | Bắt buộc có cặp ảnh đối chứng Trước / Sau có vị trí và thời gian rõ ràng |
| **Trách nhiệm xử lý** | Dễ đùn đẩy trách nhiệm, người dân không rõ ai phụ trách | Ghi rõ Người điều phối, Đội hỗ trợ hiện trường và Nhà thầu thi công |
| **Chi phí đo đạc** | Trạm đo nhập khẩu tiền tỷ, số lượng rất ít | Trạm đo tự ráp 500k kết hợp người thật đi kiểm tra trực tiếp |

### 2.4. Quy tắc 10 giây đầu tiên (10-Second Rule)
Trong 10 giây đầu tiên khi mở Trang chủ `/`:
1. **Nắm được ngay thông điệp**: *"Phát hiện bụi. Theo dõi đến khi xử lý."*
2. **Thấy ngay Thẻ hồ sơ mẫu `#DG-2026-0842`** tại đường Vành đai 3 với thanh gạt Trước / Sau (Trước: 142 µg/m³ màu đỏ $\leftrightarrow$ Sau: 28 µg/m³ màu xanh an toàn).
3. **Nhìn rõ 2 nút hành động lớn**: Nút đỏ son `[Phản ánh]` (Gửi vi phạm trong 30 giây) và Nút `[Xem demo]` (Trải nghiệm thử 5 vai trò).

---

## 3. Đối Tượng Người Dùng & Hành Trình Thao Tác (User Journey)

### 3.1. Các nhóm người dùng thực tế
1. **Chị Nguyễn Thu Hà (34 tuổi, cư dân chung cư ven đường Vành đai 3, Hà Nội)**: Hàng ngày chịu cảnh bụi mù mịt từ xe chở đất cát. Chị muốn chụp ảnh gửi phản ánh ngay trên điện thoại và theo dõi xem công trình có tưới đường, rửa xe thật hay không.
2. **Bạn Trần Minh Đức (21 tuổi, sinh viên ĐH Bách Khoa, Đội trưởng CLB Tình nguyện Môi trường)**: Muốn cùng các bạn đi khảo sát thực tế quanh khu vực các trường tiểu học, chụp ảnh kiểm tra và tích lũy giờ tình nguyện/điểm rèn luyện.
3. **Anh Lê Hoàng Nam (42 tuổi, cán bộ Đội Quản lý trật tự đô thị & môi trường)**: Cần công cụ xem danh sách các điểm nóng ưu tiên cao trong ngày và theo dõi thời hạn khắc phục của các nhà thầu.
4. **Kỹ sư Phạm Văn Hùng (48 tuổi, Chỉ huy trưởng công trường KĐT An Phú, TP. Thủ Đức)**: Cần tiếp nhận nhanh yêu cầu chấn chỉnh, cho công nhân tưới nước rửa đường, che bạt và chụp ảnh gửi lên để được nghiệm thu mở lại công trường.

### 3.2. Sơ đồ hành trình người dùng trên trang chủ

```text
[Người dân / Cán bộ / Khách truy cập vào Trang Chủ (/)]
                         │
                         ├──> [1] Đọc thông điệp & Xem thẻ Before/After mẫu
                         │      │
                         │      ├──> Bấm [Phản ánh] ──────> Mở Form gửi vi phạm trong 30s (/citizen/report/new)
                         │      └──> Bấm [Xem demo] ───────> Mở Trung tâm trải nghiệm 5 vai trò (/demo)
                         │
                         ├──> [2] Khám phá 6 nguồn tin rời rạc & 4 câu hỏi bức xúc thực tế
                         │
                         ├──> [3] Tìm hiểu Quy trình 4 bước xử lý rõ ràng (Ghi nhận -> Xác minh -> Ưu tiên -> Hồ sơ theo dõi)
                         │
                         ├──> [4] Xem Bảng đối chứng thực tế Trước/Sau tại Hầm chui Lê Văn Lương / Vành đai 3
                         │
                         ├──> [5] Tìm hiểu 5 nhóm tham gia (Dân, Sinh viên tình nguyện, Điều phối, Nhà thầu, Cán bộ)
                         │
                         ├──> [6] Trải nghiệm thử 3 góc nhìn làm việc (Bảng điều hành / Việc của tôi / Nhật ký theo phút)
                         │
                         ├──> [7] Xem Kế hoạch thử nghiệm 3 giai đoạn & Bấm [Đăng ký thử nghiệm] ──> Mở cửa sổ đăng ký
                         │
                         └──> [8] Điều hướng nhanh:
                                ├──> Bấm [Bản đồ] ────────> Mở Bản đồ tra cứu điểm nóng quanh nhà (/map)
                                ├──> Bấm [Cán bộ] ────────> Mở Trang đăng nhập làm việc (/login)
                                └──> Bấm [VI / EN] ───────> Đổi ngôn ngữ toàn bộ giao diện
```

---

## 4. Bố Cục Giao Diện & Khung Dây Wireframe Chi Tiết

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ THANH MENU CỐ ĐỊNH PHÍA TRÊN (LandingNav.jsx)                                                    │
│ [DG] DustGuard VN · GIÁM SÁT BỤI ĐÔ THỊ    [Bản đồ] [Vấn đề] [Giải pháp] [Quy trình] [Thử nghiệm]│
│                                               [VI | EN]  [Cán bộ]  [Xem demo]  [Phản ánh (Đỏ)]   │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ KHỐI 1: LỜI GIỚI THIỆU & THẺ HỒ SƠ MẪU (HeroSection.jsx)                                         │
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
│ │ │ [Phản ánh] (Đỏ)  │  │ [Xem demo] (Kem) │   │ │ Điểm ưu tiên: 85/100 │ Bụi PM2.5: 142 µg  │ │ │
│ │ └──────────────────┘  └──────────────────┘   │ │ Ghi nhận: Xe tải chở đất không phủ bạt    │ │ │
│ │                                              │ │ Trạng thái: Đang xử lý                    │ │ │
│ │                                              │ │ [ Xem chi tiết hồ sơ → ]                  │ │ │
│ │                                              │ └───────────────────────────────────────────┘ │ │
│ └──────────────────────────────────────────────┴───────────────────────────────────────────────┘ │
│ 3 CON SỐ MINH CHỨNG THỰC TẾ:                                                                     │
│ ┌──────────────────────────┐ ┌──────────────────────────┐ ┌──────────────────────────────────┐ │
│ │ 0–100                    │ │ 24–48h                   │ │ ≈ 500.000đ                       │ │
│ │ Thang điểm ưu tiên hồ sơ │ │ Thời gian kiểm tra lại   │ │ Trạm đo bụi tự ráp giá rẻ        │ │
│ │ Giúp biết việc nào làm trc│ │ Đảm bảo dập bụi thực chất│ │ Mua linh kiện chợ điện tử VN     │ │
│ └──────────────────────────┘ └──────────────────────────┘ └──────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ KHỐI 2: KHOẢNG TRỐNG THỰC TẾ (ProblemSection.jsx)                                                │
│ Tiêu đề phụ: KHOẢNG TRỐNG THỰC TẾ                                                                │
│ Tiêu đề chính: Một phản ánh chỉ có giá trị khi biết điều gì xảy ra sau đó.                       │
│ 6 NGUỒN TIN BỊ RỜI RẠC HIỆN NAY:                                                                 │
│ [01. Ảnh camera] [02. Chat người dân] [03. Bản đồ tách biệt] [04. Cảm biến rời] [05. Báo cáo giấy] [06. Tin trôi] │
│ 4 CÂU HỎI LỚN CHƯA CÓ LỜI GIẢI:                                                                 │
│ ? 01. Việc nào cần xử lý trước?         ? 02. Ai đang chịu trách nhiệm?                          │
│ ? 03. Đã xử lý đến bước nào?            ? 04. Hiện trường thực sự đã sạch bụi chưa?              │
│ => DustGuard tập hợp tất cả thành 1 hồ sơ duy nhất theo dõi xuyên suốt từ đầu đến cuối.          │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ KHỐI 3: QUY TRÌNH XỬ LÝ 4 BƯỚC RÕ RÀNG (SolutionSection.jsx)                                     │
│ ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐ ┌──────────────────────────┐ │
│ │ BƯỚC 1: GHI NHẬN  │ │ BƯỚC 2: XÁC MINH  │ │ BƯỚC 3: ƯU TIÊN   │ │ BƯỚC 4: HỒ SƠ THEO DÕI   │ │
│ │ Chụp ảnh, vị trí, │ │ Lọc tin thiếu,    │ │ Thang điểm 0–100  │ │ 1 Mã hồ sơ duy nhất,     │ │
│ │ mô tả sự việc,    │ │ kiểm tra thực tế, │ │ tính theo mức bụi,│ │ phân công người làm,     │ │
│ │ tên công trình.   │ │ kiểm tra che bạt. │ │ gần trường học.   │ │ ghi nhật ký từng phút.   │ │
│ └───────────────────┘ └───────────────────┘ └───────────────────┘ └──────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ KHỐI 4: THEO DÕI & ĐỐI CHỨNG THỰC TẾ (WorkflowSection.jsx)                                       │
│ Quy trình xử lý: 01 Phát hiện → 02 Xác minh → 03 Chuyển xử lý → 04 Khắc phục → 05 Tái kiểm → 06 Hoàn tất │
│ BẢNG ĐỐI CHỨNG TRƯỚC / SAU (Hầm chui Lê Văn Lương):                                              │
│ ┌──────────────────────────────────────────────┬───────────────────────────────────────────────┐ │
│ │ TRƯỚC · HIỆN TRƯỜNG KHI PHÁT HIỆN            │ SAU · HIỆN TRƯỜNG SAU KHI DẬP BỤI             │ │
│ │ • Ảnh: Xe ben làm rơi đất cát, bụi mù mịt    │ • Ảnh kiểm tra lại: Đã phủ bạt & tưới rửa đg  │ │
│ │ • Vị trí: Đường Lê Văn Lương (Cầu Giấy)      │ • Đánh giá: Đạt 5/5 tiêu chuẩn chống bụi      │ │
│ │ • Thời gian: 08:42 · 01/09/2026              │ • Thời gian kiểm tra: 10:30 · 02/09/2026 (26h)│ │
│ │ • Bụi PM2.5: 142 µg/m³ (Mức cảnh báo đỏ)     │ • Người xác minh: Đội SV tình nguyện + Cán bộ │ │
│ └──────────────────────────────────────────────┴───────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ KHỐI 5: PHÂN CHIA VAI TRÒ 5 NHÓM THAM GIA (YouthSection.jsx)                                     │
│ 01. Người dân (Phát hiện) │ 02. Đội Tình nguyện (Tái kiểm) │ 03. Đơn vị điều phối (Phân công) │
│ 04. Đơn vị thi công / Nhà thầu (Khắc phục) │ 05. Cán bộ quản lý (Giám sát toàn diện)             │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ KHỐI 6: CÔNG NGHỆ THỰC TẾ HỖ TRỢ CON NGƯỜI (TechnologySection.jsx)                               │
│ [1. Mã đối chiếu ảnh gốc chống sửa] [2. Kiểm tra vị trí chụp ảnh < 50m] [3. Trợ lý tóm tắt nhanh]│
│ Cam kết: "Trạm đo tự động là nguồn hỗ trợ thêm, DustGuard vẫn chạy 100% bằng người thật đi khảo sát" │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ KHỐI 7: TRẢI NGHIỆM GIAO DIỆN LÀM VIỆC TRỰC TIẾP (LiveWorkspaceSection.jsx)                      │
│ Nút chuyển: [ Bảng Điều Hành ]  │  [ Việc Của Tôi (Tình nguyện) ]  │  [ Nhật Ký Theo Phút ]      │
│ Hiển thị trực quan: Đúng người, đúng việc, theo dõi tiến độ rõ ràng theo từng phút               │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ KHỐI 8: KẾ HOẠCH THỬ NGHIỆM THỰC TẾ (ImpactSection.jsx)                                          │
│ Giai đoạn 1: Thử nghiệm 1 Quận (20-30 TNV) → Giai đoạn 2: Đo lường thời gian xử lý → Giai đoạn 3: Mở rộng │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ KHỐI 9: KÊU GỌI HÀNH ĐỘNG & CHÂN TRANG (CTASection.jsx + LandingFooter.jsx)                      │
│ Thông điệp: "Một vấn đề được nhìn thấy không nên trở thành một vấn đề bị lãng quên."             │
│ Cụm nút: [Đăng ký thử nghiệm]  [Trao đổi với DustGuard]  [Xem bản mẫu thử nghiệm]                │
│ Chân trang 4 cột: Về hệ thống | Tài liệu hướng dẫn | Hợp tác thử nghiệm | Bản quyền © 2026       │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & Cấu Trúc Thông Tin Cần Hiển Thị

### 5.1. Trạng thái hoạt động trên giao diện (`LandingPage.jsx`)
```javascript
// Quản lý ngôn ngữ song ngữ Tiếng Việt / Tiếng Anh (Lưu vào bộ nhớ trình duyệt)
const [lang, setLang] = useState(() => localStorage.getItem('dg-lang') || 'vi');

// Theo dõi mục người dùng đang cuộn tới trên trang
const [activeSection, setActiveSection] = useState('hero');

// Quản lý việc đóng/mở các cửa sổ tương tác
const [isDemoOpen, setIsDemoOpen] = useState(false);         // Cửa sổ trải nghiệm 5 vai trò
const [isEvidenceOpen, setIsEvidenceOpen] = useState(false); // Cửa sổ xem chi tiết ảnh gốc
const [isPilotOpen, setIsPilotOpen] = useState(false);       // Cửa sổ đăng ký thử nghiệm
```

### 5.2. Nguồn nội dung hiển thị song ngữ chuẩn (`landingContent.js`)
Toàn bộ văn bản hiển thị đều được tổ chức song ngữ `{ vi: '...', en: '...' }`, không viết cứng văn bản trong mã nguồn:
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
      after: { riskScore: '18/100', dustMetricValue: '28 µg/m³', statusValue: { vi: 'Đã dập bụi xong', en: 'Resolved' } }
    },
    proofPoints: [ ... ]
  }
};
```

### 5.3. Các trường thông tin thực tế cần hiển thị
- **Thông tin hồ sơ vụ việc**:
  - `Mã hồ sơ`: Ví dụ `#DG-2026-0842`.
  - `Tên công trình & địa chỉ`: Ví dụ *Vành đai 3 - Dịch Vọng Hậu, Cầu Giấy, Hà Nội*.
  - `Điểm ưu tiên`: Từ `0` đến `100` (Điểm càng cao càng cần xử lý gấp).
  - `Trạng thái`: *Tiếp nhận* $\rightarrow$ *Đang xử lý* $\rightarrow$ *Đã dập bụi xong*.
  - `Đơn vị phụ trách`: Tên đội phản ứng nhanh hoặc tổ dân phố.
- **Thông tin ghi nhận hiện trường**:
  - `Ảnh hiện trường ban đầu`: Ảnh chụp xe chở đất, công trường không che chắn.
  - `Ảnh kiểm tra lại sau khi xử lý`: Ảnh đã căng bạt, tưới rửa đường sạch sẽ.
  - `Chỉ số bụi PM2.5`: Đo đạc thực tế (µg/m³).
  - `Mã đối chiếu ảnh gốc`: Mã ngắn chứng minh ảnh chụp trực tiếp từ camera, không qua chỉnh sửa.
  - `Vị trí chụp`: Tọa độ thực tế đối chiếu khoảng cách với công trình.
- **Nhật ký tiến độ theo phút**:
  - Mốc thời gian, tên người thực hiện, nội dung việc đã làm.

---

## 6. Bảng Danh Mục Nút Bấm & Thao Tác Cốt Lõi

| Vị trí | Tên nút / Thao tác | Màu sắc & Kiểu nút | Kích thước nút bấm | Bấm vào thì làm gì | Ai được dùng |
|---|---|---|:---:|---|---|
| **Menu trên cùng** | `[Phản ánh]` | Nền đỏ son `#9f241f`, chữ trắng, biểu tượng gửi | $\ge 44\text{px} \times 44\text{px}$ | Chuyển tới màn hình gửi vi phạm `/citizen/report/new` | Tất cả mọi người |
| **Menu trên cùng** | `[Xem demo]` | Nền kem sáng `#FDFBF7`, viền xám nhạt | $\ge 40\text{px} \times 40\text{px}$ | Mở cửa sổ trải nghiệm thử 5 vai trò làm việc | Tất cả mọi người |
| **Menu trên cùng** | `[Cán bộ]` | Nền kem sáng, viền xám nhạt | $\ge 40\text{px} \times 40\text{px}$ | Chuyển tới trang đăng nhập làm việc `/login` | Cán bộ / Khách |
| **Menu trên cùng** | `[VI / EN]` | Nền kem, viền nhẹ | $\ge 38\text{px} \times 38\text{px}$ | Đổi ngôn ngữ toàn bộ trang web | Tất cả mọi người |
| **Khối đầu trang (Hero)** | `[Phản ánh]` | Nền đỏ son `#9f241f`, chữ trắng, bóng mềm | Cao tối thiểu $44\text{px}$ | Mở form gửi vi phạm nhanh trong 30 giây | Tất cả mọi người |
| **Khối đầu trang (Hero)** | `[Xem demo]` | Nền kem sáng viền xám | Cao tối thiểu $44\text{px}$ | Chuyển tới trang trải nghiệm các vai trò | Tất cả mọi người |
| **Thẻ hồ sơ mẫu** | `[Hiện trường]` ↔ `[Sau xử lý]` | Nút chuyển 2 trạng thái Trước / Sau | Cao tối thiểu $38\text{px}$ | Đổi số liệu và ảnh hiển thị trên thẻ mẫu `#DG-2026-0842` | Tất cả mọi người |
| **Thẻ hồ sơ mẫu** | `[Xem chi tiết hồ sơ →]` | Nền xám kem, chữ đen mực | Cao tối thiểu $38\text{px}$ | Chuyển tới trang tra cứu hồ sơ `/citizen/track` | Tất cả mọi người |
| **Khối làm việc thử** | `[Bảng điều hành] / [Việc của tôi] / [Nhật ký]` | 3 Nút chuyển góc nhìn | Cao tối thiểu $40\text{px}$ | Đổi nội dung hiển thị sang góc nhìn tương ứng | Tất cả mọi người |
| **Khối kêu gọi** | `[Đăng ký thử nghiệm]` | Nền đỏ son `#9f241f`, chữ trắng | Cao tối thiểu $44\text{px}$ | Mở cửa sổ điền thông tin đăng ký hợp tác | Tất cả mọi người |
| **Toàn màn hình** | Phím `Escape` (Bàn phím) | Bàn phím máy tính | N/A | Tự động đóng tất cả cửa sổ đang mở | Tất cả mọi người |

---

## 7. Quy Chuẩn Giao Diện & Thích Ứng Màn Hình (Responsive)

### 7.1. Bảng màu sáng, tương phản cao, dễ nhìn ngoài trời nắng
- **Nền trang chính (Màu giấy kem dịu mắt)**: `#FDFBF7` — Giúp mắt không bị mỏi và nhìn rõ khi ra ngoài trời nắng.
- **Chữ chính (Mực đen đậm)**: `#231B14` — Tương phản rõ nét, đọc chữ dễ dàng trên mọi màn hình.
- **Màu nút hành động khẩn cấp (Đỏ son)**: `#9F241F` — Thể hiện việc cần xử lý ngay và trách nhiệm cộng đồng.
- **Màu sinh thái & Đã dập bụi (Xanh ngọc)**: `#0D6F64` — Đại diện cho môi trường xanh sạch và việc đã hoàn thành.
- **Màu cảnh báo theo dõi (Vàng hổ phách)**: `#D97706` — Dành cho các hồ sơ mức độ trung bình cần lưu ý.
- **QUY TẮC BẮT BUỘC**: **Tuyệt đối KHÔNG dùng hiệu ứng làm mờ nền (Glassmorphism)**, không dùng chữ mờ nhạt khó đọc. Nền sáng thì chữ phải đậm rõ nét.

### 7.2. Nguyên tắc không cắt cụt chữ (Đọc trọn vẹn thông tin)
- **Không dùng các lệnh cắt chữ làm mất nội dung**: Tên công trình, địa chỉ, mã hồ sơ hay tên nhiệm vụ phải hiển thị đầy đủ, không bị che mất bằng dấu ba chấm (`...`).
- **Tiêu đề và đoạn văn bản**: Tự động xuống dòng cân đối, đẹp mắt và dễ đọc trên cả điện thoại lẫn máy tính.

### 7.3. Tương thích hoàn hảo trên các kích thước màn hình
1. **Điện thoại di động (360px – 430px)**:
   - Menu trên cùng tự thu gọn thành nút 3 gạch (Hamburger) kèm nút đổi ngôn ngữ `[VI/EN]`.
   - Bảng menu trượt ra mượt mà, tự khóa cuộn trang phía dưới để người dùng không bị rối.
   - Khối đầu trang tự động xếp thành 1 cột dọc (phần chữ ở trên, thẻ hồ sơ mẫu ở dưới).
   - Mọi nút bấm đều có chiều cao $\ge 44\text{px}$ để ngón tay chạm chính xác, không bấm nhầm.
2. **Laptop 14-inch (1366x768 & 1440x900)**:
   - Thanh menu trên cùng giữ vững trên 1 dòng duy nhất, **tuyệt đối không bị rớt nút xuống dòng thứ 2**.
   - Khối đầu trang chia 2 cột cân xứng đẹp mắt (55% cột chữ giới thiệu — 45% thẻ hồ sơ mẫu).
3. **Màn hình máy tính lớn (1920x1080)**:
   - Nội dung được gom gọn trong khung tối đa 1280px căn giữa trang nhã, không bị bè rộng ra hai mép màn hình.

---

## 8. Các Tình Huống Thực Tế & Lệnh Kiểm Tra Nhanh

### 8.1. Các điểm cần lưu ý khi xây dựng giao diện
1. **Tránh dùng thuật ngữ kỹ thuật phức tạp**: Không dùng các từ khó hiểu như "DAG", "HMAC", "Telemetry" trên giao diện người dân; thay bằng từ dễ hiểu như "Quy trình xử lý rõ ràng", "Mã đối chiếu ảnh gốc", "Dữ liệu đo tự động".
2. **Không làm vỡ menu trên màn hình Laptop 1366px**: Luôn kiểm tra để nút `[Phản ánh]` không bị rớt xuống dòng thứ 2 trên màn hình 14-inch.
3. **Đóng mở cửa sổ mượt mà**: Khi mở cửa sổ thông báo hoặc menu điện thoại, khi đóng lại trang web phải cuộn lại bình thường, không bị đơ chuột hay kẹt trang.
4. **Hiển thị biểu tượng chuẩn**: Dùng bộ biểu tượng chuẩn, không dùng ký tự lạ dễ bị lỗi hiển thị thành ô vuông rỗng trên điện thoại đời cũ.

### 8.2. Lệnh kiểm tra nhanh trên máy tính qua PowerShell (< 0.5s)
```powershell
# 1. Kiểm tra câu từ hiển thị chuẩn tiếng Việt, không chứa thuật ngữ khó hiểu
node --test app/tests/landing-page-copy-ssot.test.js

# 2. Kiểm tra giao diện hiển thị chuẩn trên các kích thước màn hình và kích thước nút bấm
node --test app/tests/landing-layout-responsive.test.js

# 3. Kiểm tra tính đồng bộ của trang chủ
node --test app/tests/landing-ssot-guard.test.js

# 4. Chạy toàn bộ các bài kiểm tra trang chủ cùng lúc (< 1 giây)
node --test app/tests/landing-*.test.js
```
