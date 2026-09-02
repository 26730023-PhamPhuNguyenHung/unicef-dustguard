# DUSTGUARD VN — HUMAN-CENTRIC COGNITIVE AUDIT & SIMPLIFICATION SSoT

Tài liệu kiểm toán tải nhận thức (Cognitive Load Audit) và chuẩn hóa thông tin trải nghiệm người dùng theo nguyên lý **Human-Centric CivicTech**:
$$\text{PHÁT HIỆN} \longrightarrow \text{XÁC MINH} \longrightarrow \text{GIAO XỬ LÝ} \longrightarrow \text{KIỂM TRA LẠI}$$

---

## 1. 4 Câu Hỏi Sống Còn Cho Từng Phân Hệ (4 Core Questions)

| Phân hệ / Feature | WHO uses it? | WHEN do they use it? | WHAT decision does it help make? | WHAT happens if we remove it? | Quyết định Core UX |
|---|---|---|---|---|---|
| **Báo bụi (Citizen Report)** | Người dân, đoàn viên, tình nguyện viên | Khi phát hiện bụi trên đường hoặc gần công trình | Có nên gửi phản ánh để cơ quan chức năng kiểm tra không | Hệ thống mất nguồn thông tin phát hiện ban đầu | **KEEP (P0 Core)** — Tối giản $\le 30$s |
| **Theo dõi phản ánh (Track Report)** | Người dân đã gửi báo cáo | Khi muốn biết phản ánh của mình đã được xử lý chưa | Có cần phản ánh lại hoặc cung cấp thêm thông tin không | Người dân mất niềm tin vì không thấy kết quả | **KEEP (P0 Core)** — Trực quan 3 nấc |
| **Việc hôm nay (Staff Work Queue)** | Cán bộ thanh tra, cán bộ môi trường | 8h sáng đầu ngày làm việc | Hôm nay cần đi kiểm tra công trình nào trước | Cán bộ không biết bắt đầu từ đâu giữa hàng chục vụ việc | **KEEP (P0 Core)** — Chuyển thành Work Queue |
| **Việc hiện trường (Field Mobile)** | Cán bộ thanh tra ngoài thực địa | Khi đứng trước cổng công trình | Công trình có vi phạm quy định chống bụi không | Không có chứng cứ khách quan để lập biên bản | **KEEP (P0 Core)** — Mobile 1 tay |
| **Khắc phục nhà thầu (Contractor)** | Chỉ huy trưởng, đại diện công trình | Khi nhận thông báo/link Zalo yêu cầu xử lý | Cần thực hiện biện pháp giảm bụi gì và hạn chót khi nào | Công trình không khắc phục hoặc không chứng minh được | **KEEP (P0 Core)** — 1 Link Zalo $\rightarrow$ Gửi ảnh |
| **Tín chỉ thanh niên (Youth Credits)** | Học sinh, sinh viên, đoàn viên | Cuối kỳ học / chiến dịch tình nguyện | Đã đủ giờ công tác xã hội để xin giấy xác nhận chưa | Sinh viên vẫn tích lũy được qua hệ thống backend | **DOWNGRADE (Secondary)** — Chuyển vào Profile |
| **Tài liệu NĐ 30 (Document Studio)** | Cán bộ chuyên trách văn thư, pháp chế | Khi cần xuất quyết định xử phạt chính thức | Văn bản đã đúng thể thức NĐ 30/2020/NĐ-CP chưa | Vẫn dùng mẫu chuẩn tự sinh từ hồ sơ vụ việc | **DOWNGRADE (Secondary)** — Chuyển vào menu Nâng cao |
| **Tra cứu luật (Policy Intelligence)** | Chuyên viên pháp chế | Khi tra cứu mức phạt theo NĐ 45/2022/NĐ-CP | Áp dụng khoản mấy, điều mấy đối với hành vi vi phạm | Cán bộ đã có sẵn gợi ý điều khoản trong hồ sơ | **DOWNGRADE (Secondary)** — Chuyển vào menu Nâng cao |
| **Điều hành chỉ huy (Executive Ops)** | Lãnh đạo sở/quận | Khi họp giao ban tuần/tháng | Địa bàn nào là điểm nóng bụi cần chỉ đạo tập trung | Lãnh đạo vẫn xem được báo cáo tổng hợp tóm tắt | **DOWNGRADE (Secondary)** — Tách biệt khu vực lãnh đạo |
| **Mô phỏng IoT (IoT Demo / Hub)** | Giám khảo, kỹ thuật viên | Khi kiểm tra kết nối thiết bị cảm biến | Cảm biến có gửi dữ liệu về D1 ổn định không | Hệ thống vẫn tự động tính toán dữ liệu môi trường | **HIDE khỏi Primary Nav** — Giữ route `/demo` |

---

## 2. Ma Trận Đánh Giá 40+ Màn Hình & Tải Nhận Thức (Cognitive Load Matrix)

| # | Screen / Route | Role | Mục tiêu người dùng | Hành động chính (1 CTA) | Cognitive Load | Số bước | Quyết định | Vấn đề & Giải pháp tinh gọn |
|---|---|---|---|---|---|---|---|---|
| 1 | `/` (Landing Page) | Public | Tìm hiểu DustGuard & truy cập đúng cổng | Bắt đầu báo bụi / Đăng nhập cán bộ | **LOW** | 1 | **KEEP** | Giữ thông điệp trực diện, loại bỏ thuật ngữ kỹ thuật |
| 2 | `/citizen` (Trang chủ Dân) | Citizen | Xem tình hình khu vực & gửi phản ánh | `[📸 Báo bụi ngay]` | **LOW** | 1 | **KEEP** | 1 Nút báo bụi nổi bật to rõ, 3 tin tức/hồ sơ gần nhất |
| 3 | `/citizen/report/new` | Citizen | Gửi phản ánh bụi trong $\le 30$s | `[Gửi phản ánh]` | **LOW** | 2 | **KEEP** | Tự động lấy GPS, nén ảnh, ẩn SHA-256 vào nền |
| 4 | `/citizen/reports` | Citizen | Xem danh sách phản ánh của mình | `[Xem tiến độ]` | **LOW** | 1 | **KEEP** | Thẻ trực quan: Đã nhận $\rightarrow$ Đang kiểm tra $\rightarrow$ Đã xử lý |
| 5 | `/citizen/reports/:id` | Citizen | Xem chi tiết tiến độ phản ánh | `[Gửi thêm ảnh]` | **LOW** | 1 | **KEEP** | Timeline 3 bước đời thường, ẩn thông tin kỹ thuật vào accordion |
| 6 | `/citizen/profile` | Citizen | Quản lý thông tin & xem giờ tình nguyện | `[Cập nhật]` | **LOW** | 1 | **KEEP** | Gom mục Tín chỉ thanh niên vào tab phụ tại đây |
| 7 | `/youth` / `/youth/credits` | Citizen | Xem chi tiết tín chỉ thanh niên | `[Nhận chứng nhận]` | **MED** | 2 | **MERGE** | Đưa vào tab trong `/citizen/profile`, không chiếm menu chính |
| 8 | `/certificate/:id` | Citizen | Tải/chia sẻ giấy chứng nhận | `[Tải file]` | **LOW** | 1 | **KEEP** | Giữ route xem chứng nhận xác thực |
| 9 | `/staff` (Việc hôm nay) | Staff | Biết ngay 8h sáng cần làm gì | `[Đi kiểm tra]` / `[Xử lý]` | **LOW** | 1 | **KEEP (REF)** | Chuyển từ Dashboard số liệu sang **Work Queue hành động** |
| 10 | `/staff/sites` | Staff | Tra cứu danh sách công trình | `[Chọn công trình]` | **LOW** | 1 | **KEEP** | Bộ lọc đơn giản: Cần chú ý / Bình thường |
| 11 | `/staff/sites/:id` | Staff | Xem lịch sử & tình trạng 1 công trình | `[Tạo việc kiểm tra]` | **MED** | 1 | **KEEP** | Gom thông tin quan trắc & hồ sơ vào 1 màn hình mạch lạc |
| 12 | `/staff/cases` | Staff | Quản lý hồ sơ theo dõi vi phạm | `[Xem hồ sơ]` | **MED** | 1 | **KEEP** | Danh sách hồ sơ đang mở / đã đóng |
| 13 | `/staff/cases/:id` | Staff | Xử lý vụ việc theo quy trình 7 bước | `[Chuyển bước tiếp]` | **MED** | 1 | **KEEP** | Quy trình từng bước rõ ràng, gợi ý việc tiếp theo |
| 14 | `/staff/tasks` | Staff | Danh sách nhiệm vụ kiểm tra hiện trường | `[Thực hiện]` | **LOW** | 1 | **KEEP** | Danh mục việc cần đi thực địa |
| 15 | `/staff/tasks/:id` | Staff | Ghi nhận kết quả kiểm tra tại chỗ | `[Gửi kết quả]` | **LOW** | 1 | **KEEP** | Tối ưu Mobile-First, chụp ảnh + 3 nấc trạng thái |
| 16 | `/staff/alerts` | Staff | Xem các cảnh báo bụi vượt ngưỡng | `[Xác minh ngay]` | **LOW** | 1 | **KEEP** | Danh sách cảnh báo tự động gom nhóm theo công trình |
| 17 | `/staff/monitoring` | Staff | Xem biểu đồ & bản đồ cảm biến | `[Xem chi tiết]` | **MED** | 2 | **MERGE** | Nhúng trực tiếp vào `/staff/sites` hoặc giữ thứ cấp |
| 18 | `/staff/reports` | Staff | Xuất báo cáo công tác định kỳ | `[Tải báo cáo]` | **MED** | 2 | **HIDE** | Đưa vào menu Mở rộng / Hồ sơ cá nhân |
| 19 | `/staff/documents` | Staff | Quản lý văn bản xử lý theo NĐ 30 | `[Tạo văn bản]` | **HIGH** | 3 | **HIDE** | Đưa vào menu "Công cụ nâng cao" |
| 20 | `/staff/templates` | Staff | Thư viện biểu mẫu biên bản | `[Dùng mẫu]` | **MED** | 2 | **HIDE** | Đưa vào menu "Công cụ nâng cao" |
| 21 | `/staff/policy` | Staff | Tra cứu văn bản quy phạm pháp luật | `[Tra cứu]` | **HIGH** | 3 | **HIDE** | Đưa vào menu "Công cụ nâng cao" |
| 22 | `/staff/profile` | Staff | Thông tin tài khoản cán bộ | `[Lưu thay đổi]` | **LOW** | 1 | **KEEP** | Quản lý tài khoản |
| 23 | `/staff/notifications` | Staff | Thông báo công việc mới | `[Xem việc]` | **LOW** | 1 | **KEEP** | Click thông báo nhảy thẳng đến việc cần xử lý |
| 24 | `/staff/settings` | Staff | Cài đặt thông báo & hiển thị | `[Lưu]` | **LOW** | 1 | **KEEP** | Cài đặt cá nhân |
| 25 | `/contractor` / `/tasks` | Contractor | Xem yêu cầu khắc phục từ thanh tra | `[Bắt đầu]` | **LOW** | 1 | **KEEP** | Danh sách việc được giao kèm hạn xử lý |
| 26 | `/contractor/tasks/:id` | Contractor | Gửi minh chứng đã xử lý bụi | `[Gửi ảnh hoàn thành]` | **LOW** | 1 | **KEEP** | Chụp ảnh sau xử lý $\rightarrow$ Nhấn Đã hoàn thành |
| 27 | `/contractor/cases` | Contractor | Xem danh sách dự án thi công | `[Xem chi tiết]` | **LOW** | 1 | **MERGE** | Gộp chung vào giao diện nhiệm vụ |
| 28 | `/contractor/reports` | Contractor | Lịch sử khắc phục môi trường | `[Xem lại]` | **LOW** | 1 | **MERGE** | Gộp tab Lịch sử trong `/contractor/tasks` |
| 29 | `/admin` / `/users` | Admin | Quản lý tài khoản cán bộ & phân quyền | `[Thêm / Sửa user]` | **LOW** | 1 | **KEEP** | Danh sách nhân sự & quyền hạn |
| 30 | `/admin/sites` | Admin | Quản lý danh mục công trình xây dựng | `[Thêm công trình]` | **LOW** | 1 | **KEEP** | Danh mục công trình trên địa bàn |
| 31 | `/admin/settings` | Admin | Cấu hình hệ thống & ngưỡng cảnh báo | `[Lưu cấu hình]` | **MED** | 1 | **KEEP** | Cấu hình ngưỡng bụi đơn giản |
| 32 | `/executive` (Tổng thể) | Executive | Xem bức tranh điều hành toàn quận/huyện | `[Xem báo cáo tuần]` | **MED** | 1 | **KEEP** | Tách riêng luồng lãnh đạo |
| 33 | `/executive/approvals` | Executive | Ký duyệt văn bản chỉ đạo | `[Ký duyệt]` | **LOW** | 1 | **KEEP** | Danh sách hồ sơ chờ lãnh đạo duyệt |
| 34 | `/executive/heatmap` | Executive | Bản đồ nhiệt điểm nóng môi trường | `[Xem khu vực]` | **MED** | 1 | **KEEP** | Trực quan điểm nóng |
| 35 | `/demo` / `/demo/iot` | Demo | Trải nghiệm thử nghiệm IoT giả lập | `[Gửi gói tin]` | **LOW** | 1 | **HIDE** | Ẩn khỏi thanh điều hướng chính |
| 36 | `/guide` | Public | Hướng dẫn cộng đồng giám sát bụi | `[Đọc]` | **LOW** | 1 | **KEEP** | Tài liệu hướng dẫn ngắn gọn |
| 37 | `/login` | Public | Đăng nhập tài khoản | `[Đăng nhập]` | **LOW** | 1 | **KEEP** | Form đăng nhập 2 trường |

---

## 3. Từ Điển Dọn Sạch Thuật Ngữ Kỹ Thuật (Jargon Transformation Dictionary)

| Thuật ngữ kỹ thuật (CẤM dùng trên UI chính) | Thuật ngữ đời thường chuẩn Civic Tech | Ý nghĩa thực tế với người dùng |
|---|---|---|
| `Evidence integrity verified via SHA-256` | **Ảnh đã được lưu nguyên bản** | Bảo đảm ảnh không bị chỉnh sửa |
| `Geofence validation successful / WGS84` | **Đã xác nhận tại công trình** | Xác định vị trí đúng nơi kiểm tra |
| `Create case / Case DAG 7-step` | **Tạo việc xử lý** / **Hồ sơ xử lý** | Bắt đầu theo dõi vụ việc |
| `Telemetry alert / Sensor breach` | **Bụi vượt ngưỡng quy chuẩn** | Cảm biến phát hiện bụi cao |
| `Workflow transition / State machine` | **Chuyển bước tiếp theo** | Tiến độ giải quyết công việc |
| `Citizen complaint / Observation` | **Phản ánh của người dân** | Ý kiến đóng góp từ cộng đồng |
| `Contractor remediation / Escrow release` | **Biện pháp khắc phục** | Việc nhà thầu cần làm để dập bụi |
| `RFC 7807 Problem Details` | **Thông báo lỗi dễ hiểu** | Giải thích nguyên nhân và cách khắc phục |
| `Tamper-evident docHash` | **Mã bảo mật văn bản** | Mã chống giả mạo hồ sơ |

---

## 4. Tinh Gọn Primary Navigation (Mục Tiêu Đạt Chuẩn)

```text
[CÁN BỘ - STAFF] (5 mục tối đa)
  ├─ ⚡ Việc hôm nay (/staff) — Work Queue
  ├─ 🏗️ Công trình (/staff/sites)
  ├─ 📋 Hồ sơ xử lý (/staff/cases)
  ├─ 🔍 Việc hiện trường (/staff/tasks)
  └─ ⚠️ Cảnh báo (/staff/alerts)
  (Các mục Báo cáo, Văn bản NĐ 30, Luật: đưa vào Hồ sơ cá nhân / Công cụ nâng cao)

[NGƯỜI DÂN - CITIZEN] (3 mục tối đa)
  ├─ 🏠 Trang chủ (/citizen)
  ├─ 📸 Báo bụi (/citizen/report/new) — Nút nổi bật
  └─ 📋 Phản ánh của tôi (/citizen/reports)

[NHÀ THẦU - CONTRACTOR] (2 mục tối đa)
  ├─ 🛠️ Việc cần xử lý (/contractor/tasks)
  └─ 📤 Gửi kết quả (/contractor/tasks/:id)

[QUẢN TRỊ - ADMIN] (3 mục)
  ├─ 👥 Người dùng (/admin/users)
  ├─ 🏗️ Công trình (/admin/sites)
  └─ ⚙️ Cài đặt (/admin/settings)
```

---

## 5. Tiêu Chuẩn Nghiệm Thu Đo Lường (Human-Centric Target Metrics)

1. **Báo bụi người dân**: $\le 30$ giây, $\le 3$ bước, 1 CTA chính trên mỗi màn hình.
2. **Cán bộ mở việc**: $\le 2$ click từ trang chủ để vào nhiệm vụ cần xử lý.
3. **Cán bộ kiểm tra hiện trường**: $\le 60$ giây trên di động (Chụp ảnh + Chọn 1 trong 3 trạng thái + Bấm Gửi).
4. **Nhà thầu gửi minh chứng**: $\le 45$ giây từ 1 link Zalo/SMS duy nhất.
5. **Độ tương phản & Truy cập**: WCAG AAA, Zero Glassmorphism, Touch target $\ge 44\text{px}$.
6. **Thuật ngữ kỹ thuật Developer**: $0\%$ trên các luồng thao tác người dùng phổ thông.

---

## 6. Bảng Điểm Kép 2 Thang (Dual-Score Matrix: Professional Depth & Human Usability)

> **Tiêu chuẩn đạt**:  
> • Core Screens: `Professional Depth ≥ 8/10` VÀ `Human Usability ≥ 9/10`  
> • Advanced Screens: `Professional Depth ≥ 9/10` VÀ `Human Usability ≥ 7.5/10`

| Màn hình / Phân hệ | Professional Depth (/10) | Human Usability (/10) | Điểm cốt lõi đạt được |
|---|:---:|:---:|---|
| **`/` (Trang giới thiệu Landing)** | **8.5** | **9.5** | Truyền tải giá trị trực diện, CTA dứt khoát, minh chứng rõ ràng |
| **`/citizen` (Trang chủ Dân)** | **8.0** | **9.5** | Nút báo bụi $\ge 48$px, xem nhanh 3 phản ánh gần nhất |
| **`/citizen/report/new` (Báo bụi)** | **8.5** | **9.5** | Form 4 trường $\le 30$s, tự động GPS, ảnh lưu nguyên bản |
| **`/citizen/reports/:id` (Theo dõi)** | **8.5** | **9.0** | Timeline 3 bước đời thường, ảnh Before/After đối chứng |
| **`/staff` (Việc hôm nay - Command Center 65/35)** | **9.0** | **9.5** | Bố cục 65% Việc cần xử lý + 35% Tình hình hôm nay, zero vanity KPI |
| **`/staff/sites/:id` (Chi tiết công trình)** | **9.5** | **9.0** | 4 Tabs chuẩn (Tổng quan, Hoạt động, Quan trắc, Hồ sơ) + Action Header |
| **`/staff/cases/:id` (Hồ sơ vụ việc)** | **9.5** | **9.0** | Tiến trình thời gian thực, 6 tab nghiệp vụ, biên bản NĐ 30 |
| **`/staff/tasks/:id` (Nhiệm vụ kiểm tra di động)** | **9.0** | **9.5** | Mobile-first 1 tay ngoài trời, 3 nấc trạng thái, tự động GPS/timestamp |
| **`/contractor/tasks/:id` (Nhà thầu khắc phục)** | **8.5** | **9.5** | 1 link $\rightarrow$ 1 màn hình: 4 bước hướng dẫn + Chụp ảnh sau xử lý |
| **`/staff/reports` (Báo cáo văn bản NĐ 30)** | **9.5** | **8.5** | Xuất Word DOCX chuẩn thể thức, preview in A4, ký số CA |
| **`/admin` (Quản trị hệ thống)** | **9.5** | **8.5** | 46 bảng D1 SSOT, đổi quyền In-Place, cấu hình ngưỡng QCVN 05 |
| **`/executive` (Chỉ đạo điều hành)** | **9.0** | **8.5** | Bản đồ điểm nóng, chỉ số tốc độ giải quyết, ký duyệt văn bản |

