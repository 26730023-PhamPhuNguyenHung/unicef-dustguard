# PRODUCT_CONSISTENCY_AUDIT.md — Báo Cáo Đánh Giá Toàn Diện Tính Nhất Quán Sản Phẩm

> **Bản quyền**: DustGuard VN — CivicTech Platform  
> **Phiên bản**: 2.0 (Product Narrative Alignment)  
> **Nguyên lý cốt lõi**: `SIGNAL → UNDERSTAND → ROUTE → ACTION → FOLLOW-UP → VERIFY → OUTCOME`  
> **Khẩu hiệu**: *"Phát hiện vấn đề. Chuyển đúng người. Theo dõi đến kết quả."*

---

## 1. TỔNG QUAN CHUYỂN DỊCH TƯ DUY SẢN PHẨM

| Tiêu chí | Mô hình Cũ (Score-Centric) | Mô hình Mới (Action & Outcome-Centric) |
|---|---|---|
| **Trọng tâm** | Risk Score, Xếp hạng nguy cơ (Ranking), AI phán quyết vi phạm | Vòng đời xử lý từ Tín hiệu đến Kết quả tái kiểm thực tế |
| **Vai trò Risk Score** | Trọng tâm UI, Page Title, KPI chính (92/100) | **Supporting Signal** hỗ trợ hiểu mức độ ưu tiên và lý do chú ý |
| **Landing Page** | Nền tảng AI chấm điểm rủi ro bụi xây dựng | Câu chuyện giải quyết dứt điểm: Phát hiện → Điều phối → Tái kiểm |
| **Demo Hub** | Chọn role ngẫu nhiên, xem chỉ số score rời rạc | **Một Golden Case xuyên suốt** 5 góc nhìn từ tiếp nhận đến nghiệm thu |
| **Bàn làm việc Cán bộ** | Xem phân bổ rủi ro, danh sách điểm số cao | Việc cần làm hôm nay, Chờ tái kiểm, Thiếu bằng chứng, Quá hạn |
| **Đơn vị xử lý (Nhà thầu)** | Bị xem là đối tượng bị chấm điểm vi phạm | Nhận yêu cầu cụ thể, nộp minh chứng Before/After để nghiệm thu |
| **Công dân** | Xem biểu đồ nguy hại chung chung | Biết phản ánh của mình đang ở đâu, ai xử lý và ảnh nghiệm thu |
| **Lãnh đạo / Admin** | Xem điểm trung bình các quận huyện | Thời gian xử lý trung bình, Tỷ lệ tái kiểm đạt, Điểm nghẽn quy trình |

---

## 2. BẢNG MA TRẬN ĐÁNH GIÁ 35 MÀN HÌNH (35-SCREEN CONSISTENCY MATRIX)

### NHÓM 1: PUBLIC SCREENS

| STT | Route / File | Bước Lifecycle | User Job | Current Story | Target Story | Inconsistent? | Yêu cầu thay đổi cần thiết |
|---|---|---|---|---|---|---|---|
| 01 | `/` <br> `LandingPage.jsx` | **VÒNG ĐỜI TOÀN DIỆN** | Tìm hiểu giải pháp DustGuard cho cộng đồng & chính quyền | Đã kể tốt câu chuyện 5 bước, nhưng một số chip số vẫn nhấn "Điểm ưu tiên 85/100" như KPI chính | Kể trọn vẹn chuỗi 7 bước: Tín hiệu → Xác minh → Chuyển xử lý → Tái kiểm → Kết quả | 🟡 Nhẹ | Giữ cấu trúc Bento & Hero hiện tại; tinh chỉnh lại copy của một số card phụ để làm nổi bật "Theo dõi đến khi có kết quả". |
| 02 | `/map` <br> `CitizenMap.jsx` | **SIGNAL** | Tìm kiếm khu vực bụi & xem phản ánh lân cận | Bản đồ hiển thị trạm đo & điểm nguy cơ màu đỏ | Bản đồ tín hiệu môi trường: xem trạm đo & tiến độ các vụ việc xung quanh | 🟡 Nhẹ | Đổi nhãn "Mức rủi ro" thành "Chất lượng không khí & Vụ việc đang xử lý". Thêm link xem tiến độ vụ việc từ popup bản đồ. |
| 03 | `/guide` <br> `SensorGuide.jsx` | **SUPPORT** | Tìm hiểu tự lắp đặt trạm đo mở 500k | Hướng dẫn kỹ thuật phần cứng ESP32 & PMS5003 | Hướng dẫn tạo nguồn tín hiệu cộng đồng chuẩn mở chi phí thấp | 🟢 Nhất quán | Giữ nguyên vì đây là tài liệu kỹ thuật IoT hỗ trợ tạo nguồn tín hiệu. |
| 04 | `/demo` <br> `DemoHub.jsx` | **TRACEABILITY HUB** | Trải nghiệm toàn bộ hệ thống bằng 1 click | Có role selector & 6 bước, nhưng case ID (`#CASE-2026-001`) chưa đồng bộ mã với Landing (`#DG-2026-0842`) | **Golden Demo Hub**: Tiếp nối trực tiếp từ Landing, dùng chung Case `DG-2026-0842` (An Phú) xuyên suốt 5 vai trò | 🔴 Cần đổi | Đồng bộ mã hồ sơ thành `DG-2026-0842`, gắn rõ vai trò của từng role trong cùng 1 chuỗi xử lý. |
| 05 | `/demo/iot` <br> `IoTDemo.jsx` | **SIGNAL SIMULATION** | Thử nghiệm giả lập luồng dữ liệu cảm biến | Giả lập phát tán bụi & kích hoạt cảnh báo rủi ro | Giả lập nguồn tín hiệu kích hoạt quy trình tạo vụ việc tự động | 🟢 Nhất quán | Đổi CTA từ "Tạo vi phạm" thành "Gửi tín hiệu cảnh báo tới cán bộ". |
| 06 | `/youth` <br> `YouthCredits.jsx` | **COMMUNITY ENGAGEMENT** | Đổi giờ tình nguyện thành tín chỉ môi trường | Tích lũy 20h = 4.0 tín chỉ sinh viên | Sinh viên & CLB tham gia tạo bằng chứng xác minh vụ việc | 🟢 Nhất quán | Giữ nguyên logic 20h = 4.0 tín chỉ và QR verification. |
| 07 | `/login` <br> `Login.jsx` | **AUTH** | Đăng nhập hệ thống theo vai trò | Form đăng nhập kèm demo quick-login | Cửa ngõ phân quyền vào các bàn làm việc tương ứng | 🟢 Nhất quán | Đồng bộ tên gọi 5 vai trò theo bảng Canonical Language. |
| 08 | `*` <br> `NotFound.jsx` | **FALLBACK** | Định hướng khi gõ sai đường dẫn | Trang 404 tiêu chuẩn | Hướng dẫn quay lại Bàn làm việc hoặc Trang chủ | 🟢 Nhất quán | Tốt, giữ nguyên. |

---

### NHÓM 2: CITIZEN SCREENS

| STT | Route / File | Bước Lifecycle | User Job | Current Story | Target Story | Inconsistent? | Yêu cầu thay đổi cần thiết |
|---|---|---|---|---|---|---|---|
| 09 | `/citizen` <br> `CitizenHomePage.jsx` | **SIGNAL + FOLLOW-UP** | Xem các phản ánh của tôi & hành động nhanh | Bảng tin cộng đồng, điểm thưởng và nút gửi phản ánh | Nơi quản lý các phản ánh của tôi: Đã gửi gì, ai đang làm, kết quả ra sao | 🟡 Nhẹ | Đưa nhóm "Phản ánh đang theo dõi" lên vị trí ưu tiên số 1, hiển thị rõ bước hiện tại. |
| 10 | `/citizen/report/new` <br> `ReportNewPage.jsx` | **SIGNAL CREATION** | Gửi phản ánh bụi nhanh trong 30 giây | Form chụp ảnh, định vị GPS, chọn loại bụi | Gửi tín hiệu thực địa nhanh, tự động gắn tọa độ, nhận mã theo dõi | 🟢 Nhất quán | Tối ưu, flow 30s trực quan, không nhồi nhét thuật ngữ rủi ro. |
| 11 | `/citizen/reports` <br> `ReportsListPage.jsx` | **FOLLOW-UP** | Danh sách các phản ánh đã gửi | Danh sách lịch sử phản ánh kèm trạng thái | Danh sách theo dõi: Biết rõ vụ việc nào đang xử lý, vụ việc nào đã có ảnh nghiệm thu | 🟡 Nhẹ | Thống nhất nhãn trạng thái theo Canonical Status (Đã tiếp nhận, Đang xử lý, Chờ kiểm tra lại, Đã xong). |
| 12 | `/citizen/reports/:id` <br> `ReportDetailPage.jsx` | **FOLLOW-UP + VERIFY** | Xem chi tiết tiến độ xử lý & ảnh Before/After | Chi tiết phản ánh, timeline và thông tin kỹ thuật D1 | **Minh chứng minh bạch**: Thấy rõ ai tiếp nhận, nhà thầu đã làm gì, ảnh sau xử lý đạt chuẩn | 🟡 Nhẹ | Đảm bảo ảnh đối chứng Before/After và kết luận tái kiểm nằm ở vị trí dễ nhìn nhất. |
| 13 | `/citizen/profile` <br> `CitizenProfilePage.jsx` | **OUTCOME / IDENTITY** | Xem thông tin cá nhân & tín chỉ đóng góp | Hồ sơ cá nhân và lịch sử nhận chứng chỉ | Hồ sơ người đóng góp: Tổng số vụ việc đã hỗ trợ giám sát thành công | 🟢 Nhất quán | Giữ nguyên. |

---

### NHÓM 3: STAFF SCREENS (CORE OPERATIONS)

| STT | Route / File | Bước Lifecycle | User Job | Current Story | Target Story | Inconsistent? | Yêu cầu thay đổi cần thiết |
|---|---|---|---|---|---|---|---|
| 14 | `/staff` <br> `StaffDashboardPage.jsx` | **UNDERSTAND + ROUTE** | Nắm bắt công việc cần làm ngay trong ngày | Đã chuyển sang Next Actions nhưng còn card Score phụ | **Bàn điều phối tác nghiệp**: Việc cần làm hôm nay, Hồ sơ chờ tái kiểm, Tín hiệu mới cần xác minh | 🟡 Nhẹ | Giữ vững layout Next Actions hiện tại; đảm bảo không còn card hiển thị average risk score đơn độc. |
| 15 | `/staff/sites` <br> `SitesListPage.jsx` | **CONTEXT / SITES** | Quản lý danh sách các công trình trên địa bàn | Danh sách công trình kèm điểm rủi ro 0-100 | Danh sách công trình: Công trình nào đang có vụ việc mở, có tái kiểm gần đây | 🟡 Cần đổi | Đổi cột "Điểm rủi ro" thành "Vụ việc đang mở / Tình trạng tuân thủ". |
| 16 | `/staff/sites/:id` <br> `SiteDetailPage.jsx` | **CONTEXT + ACTION** | Xem toàn bộ lịch sử môi trường của 1 công trình | Chi tiết công trình, điểm số rủi ro và các vi phạm | Hồ sơ công trình: Đang có vấn đề gì, lịch sử xử lý, lần tái kiểm gần nhất | 🟡 Cần đổi | Đưa tab "Vụ việc đang xử lý" và "Lịch sử tái kiểm" lên đầu, hạ điểm rủi ro xuống thông số phụ. |
| 17 | `/staff/cases` <br> `CasesListPage.jsx` | **ROUTE + FOLLOW-UP** | Quản lý danh sách tất cả các vụ việc | Bảng danh sách case với bộ lọc trạng thái và mức độ ưu tiên | Danh sách vụ việc cần xử lý: Phân loại theo tiến trình 7 bước, hạn SLA và người phụ trách | 🟡 Nhẹ | Chuẩn hóa các bộ lọc theo 7 bước DAG và Canonical Status. |
| 18 | `/staff/cases/:id` <br> `CaseDetailPage.jsx` | **VERIFY + OUTCOME (SSOT)** | Thẩm định vụ việc, giao việc, đối chứng Before/After, đóng hồ sơ | Chi tiết vụ việc 7 bước tác nghiệp, checklist QCVN 18, in ấn A4 | **Trung tâm xử lý vụ việc**: Vấn đề → Bước hiện tại → Người phụ trách → Khắc phục Before/After → Tái kiểm → Nghiệm thu | 🟡 Nhẹ | Đổi trường `dustRiskScore` thành "Mức ưu tiên" kèm mục "Lý do cần chú ý"; đưa ảnh đối chứng Before/After lên vị trí trực quan. |
| 19 | `/staff/tasks` <br> `TasksListPage.jsx` | **ACTION EXECUTION** | Quản lý các nhiệm vụ khảo sát & tái kiểm thực địa | Danh sách nhiệm vụ thanh tra và khảo sát | Danh sách nhiệm vụ cụ thể của cán bộ: Khảo sát thực địa, Tái kiểm sau 48h | 🟢 Nhất quán | Rõ ràng về mặt nghiệp vụ hành động. |
| 20 | `/staff/monitoring` <br> `StaffMonitoringPage.jsx` | **SIGNAL INGESTION** | Theo dõi các trạm quan trắc để phát hiện bất thường | Danh sách trạm đo với biểu đồ nồng độ PM | **Nguồn tín hiệu**: Trạm nào vượt ngưỡng → Xem chi tiết → Tạo vụ việc xác minh chỉ bằng 1 click | 🟡 Cần đổi | Bổ sung nút liên kết nhanh từ trạm đo bất thường sang Tạo/Gắn vào Vụ việc đang theo dõi. |
| 21 | `/staff/alerts` <br> `StaffAlertsPage.jsx` | **SIGNAL TRIAGE** | Xử lý các tín hiệu cảnh báo vượt ngưỡng | Danh sách cảnh báo tự động từ cảm biến | Danh sách tín hiệu cần xác minh: Tín hiệu nào cần lập đoàn khảo sát hiện trường | 🟢 Nhất quán | Đã có nút "Mở vụ việc" trực tiếp từ cảnh báo. |
| 22 | `/staff/reports` <br> `StaffReportsPage.jsx` | **OUTCOME & AUDIT** | Lập báo cáo kết quả và hồ sơ điều hành | Báo cáo điều hành lãnh đạo, văn bản số hóa NĐ 30 | Báo cáo kết quả xử lý môi trường: Tỷ lệ khắc phục thành công, thời gian xử lý trung bình | 🟢 Nhất quán | Tốt, văn bản hành chính theo chuẩn NĐ 30/2020/NĐ-CP. |
| 23 | `/staff/profile` <br> `StaffProfilePage.jsx` | **IDENTITY** | Quản lý thông tin cán bộ | Thông tin cá nhân & đơn vị công tác | Thông tin cán bộ phụ trách địa bàn | 🟢 Nhất quán | Giữ nguyên. |
| 24 | `/staff/notifications` <br> `StaffNotificationsPage.jsx` | **FOLLOW-UP NOTIFICATION**| Nhận thông báo biến động vụ việc | Danh sách thông báo hệ thống | Thông báo tác nghiệp: Nhà thầu đã nộp ảnh, Hết hạn SLA tái kiểm | 🟢 Nhất quán | Giữ nguyên. |
| 25 | `/staff/settings` <br> `StaffSettingsPage.jsx` | **CONFIG** | Cấu hình tham số tác nghiệp | Cài đặt ngưỡng cảnh báo và phân quyền | Cài đặt ngưỡng tín hiệu và quy trình SLA | 🟢 Nhất quán | Giữ nguyên. |
| 26 | `/staff/activity` <br> `StaffActivityPage.jsx` | **AUDIT TRAIL** | Xem nhật ký lưu vết không thể xóa sửa | Nhật ký thao tác hệ thống | Nhật ký lưu vết minh bạch: Ai giao việc, ai nộp ảnh, ai duyệt đóng | 🟢 Nhất quán | Đảm bảo tính pháp lý và minh bạch. |
| 27 | `/staff/help` <br> `StaffHelpPage.jsx` | **GUIDELINES** | Tra cứu quy chuẩn QCVN & quy trình xử lý | Cẩm nang tra cứu quy định pháp luật | Cẩm nang quy chuẩn kiểm soát bụi và hướng dẫn 7 bước tác nghiệp | 🟢 Nhất quán | Giữ nguyên. |

---

### NHÓM 4: CONTRACTOR SCREENS

| STT | Route / File | Bước Lifecycle | User Job | Current Story | Target Story | Inconsistent? | Yêu cầu thay đổi cần thiết |
|---|---|---|---|---|---|---|---|
| 28 | `/contractor` <br> `ContractorDashboardPage.jsx` | **ACTION OVERVIEW** | Nắm bắt yêu cầu khắc phục & hạn chót | Bàn làm việc nhà thầu với điểm tuân thủ và việc cần làm | **Bàn làm việc Đơn vị xử lý**: Yêu cầu cần làm ngay, Hạn hoàn thành, Bằng chứng cần nộp | 🟡 Nhẹ | Nhấn mạnh vào: Yêu cầu gì, Hạn khi nào, Cần nộp ảnh Before/After nào để được nghiệm thu. |
| 29 | `/contractor/tasks` <br> `ContractorTasksPage.jsx` | **ACTION + EVIDENCE** | Nộp ảnh Before/After minh chứng khắc phục | Danh sách việc xử lý kèm form tải ảnh | Nơi nộp minh chứng khắc phục: Chụp ảnh lưới chắn/phun nước có gắn GPS để gửi cán bộ tái kiểm | 🟢 Nhất quán | Form nộp bằng chứng kèm geofence check rất thực tế. |
| 30 | `/contractor/cases` <br> `ContractorCasesPage.jsx` | **FOLLOW-UP** | Xem các dự án / vụ việc liên quan đến đơn vị | Danh sách dự án đang thi công | Danh sách vụ việc tại các công trình của đơn vị: Vụ việc nào đã nghiệm thu, vụ việc nào cần làm lại | 🟡 Nhẹ | Đồng bộ nhãn trạng thái với Canonical Status. |
| 31 | `/contractor/reports` <br> `ContractorReportsPage.jsx` | **OUTCOME COMPLIANCE** | Xem báo cáo mức độ tuân thủ quy chuẩn bụi | Báo cáo tuân thủ môi trường định kỳ | Báo cáo kết quả khắc phục: Tỷ lệ hoàn thành đúng hạn 24-48h | 🟢 Nhất quán | Giữ nguyên. |

---

### NHÓM 5: ADMIN / EXECUTIVE SCREENS

| STT | Route / File | Bước Lifecycle | User Job | Current Story | Target Story | Inconsistent? | Yêu cầu thay đổi cần thiết |
|---|---|---|---|---|---|---|---|
| 32 | `/admin` <br> `AdminDashboardPage.jsx` | **OUTCOME + WORKFLOW HEALTH** | Giám sát toàn bộ tiến độ xử lý và điểm nghẽn | Tổng quan tài khoản, công trình và hệ thống | **Giám sát Sức khỏe Quy trình**: Bao nhiêu vụ đang mở, bao nhiêu vụ quá hạn, nghẽn ở bước nào, tỷ lệ tái kiểm đạt | 🟡 Cần đổi | Thay thế các thống kê đếm thuần túy bằng các chỉ số sức khỏe quy trình (SLA, Tái kiểm, Điểm nghẽn). |
| 33 | `/admin/users` <br> `UsersPage.jsx` | **GOVERNANCE** | Quản lý danh sách tài khoản 5 roles | Quản lý người dùng, phân quyền RBAC | Quản lý phân quyền cán bộ địa bàn, nhà thầu và điều phối viên | 🟢 Nhất quán | 5 roles chuẩn: Public, Citizen, Community, Staff, Admin. |
| 34 | `/admin/sites` <br> `SitesListPage.jsx` | **GOVERNANCE** | Quản lý danh mục công trình toàn thành phố | Danh sách công trình | Danh mục công trình giám sát môi trường | 🟢 Nhất quán | Dùng chung component với Staff Sites. |
| 35 | `/admin/settings` <br> `SettingsPage.jsx` | **SYSTEM HEALTH** | Cấu hình kết nối D1, R2, AI và API | Cài đặt hệ thống | Cấu hình hạ tầng kỹ thuật và tham số nghiệp vụ | 🟢 Nhất quán | Giữ nguyên. |

---

## 3. PHÂN LOẠI CÁC LẦN XUẤT HIỆN CỦA "RISK SCORE" & KẾ HOẠCH XỬ LÝ

| Nhóm phân loại | Mô tả | Số lượng file ảnh hưởng | Định hướng xử lý |
|---|---|---|---|
| **Nhóm A: Core Logic cần giữ** | Hàm tính toán trọng số cảm biến/khoảng cách/lịch sử (`calculateRiskScore`, `riskEngine.js`) | ~5 files | **GIỮ NGUYÊN 100% backend/logic**. Dùng làm thuật toán xác định độ ưu tiên cho hệ thống. |
| **Nhóm B: Supporting Signal hạ vai trò** | Hiển thị điểm số 0–100 trong chi tiết hồ sơ (`CaseDetailPage`, `StaffDashboard`) | ~12 files | **ĐỔI VỊ TRÍ**: Đưa vào tab thông số kỹ thuật hoặc dưới dạng "Mức ưu tiên", không làm tiêu đề trang. |
| **Nhóm C: UI Presentation cần đổi** | Badges màu đỏ chót ghi `CRITICAL RISK` hoặc `92/100` trên danh sách | ~8 files | **THAY THẾ**: Thay bằng nhãn trạng thái hành động (Ví dụ: `Cần xử lý ngay`, `Chờ tái kiểm`). |
| **Nhóm D: Copy cần đổi** | Các câu "AI kết luận vi phạm", "Điểm rủi ro công trình" | ~15 files | **CHUẨN HÓA**: Đổi sang "Tín hiệu cần xác minh", "Mức độ ưu tiên", "AI hỗ trợ tổng hợp". |
| **Nhóm E: Legacy Concept nên bỏ** | Các màn hình/widget chỉ vẽ biểu đồ rủi ro trừu tượng mà không có nút hành động | ~3 components | **LOẠI BỎ / THAY BẰNG NEXT ACTION**: Thay bằng danh sách vụ việc cần xử lý. |
| **Nhóm F: Database Fields** | Cột `risk_score`, `dust_risk_score` trong bảng SQLite/D1 | Toàn bộ schema | **KHÔNG RENAME DB**: Giữ nguyên schema D1 để không làm gãy test và API contract. |

---

## 4. BẢNG ĐỐI CHIẾU TRACEABILITY: LANDING → DEMO → APP

| Tuyên bố trên Landing Page | Minh chứng trên Demo Hub (`/demo`) | Màn hình Ứng dụng Thật | Endpoint API / D1 SSOT | Dữ liệu kiểm chứng |
|---|---|---|---|---|
| **1. Phát hiện bụi (Tín hiệu)** | Bước 1 & Bước 2: Cảm biến & Người dân gửi ảnh | `/citizen/report/new` & `/staff/monitoring` | `POST /api/complaints`<br>`GET /api/stations` | Phản ánh tọa độ WGS84 + Ảnh băm SHA-256 + Chỉ số PM2.5 |
| **2. Hiểu tình huống & Xác minh** | Bước 3: Cán bộ tiếp nhận, tổng hợp lý do cần chú ý | `/staff/alerts` & `/staff/cases/:id` | `GET /api/staff/cases/:id/detail` | Báo cáo các yếu tố: Gần trường học, nồng độ PM cao, nhiều phản ánh |
| **3. Chuyển đúng người (Phân công)** | Bước 4: Phát hành yêu cầu khắc phục kèm SLA 24-48h | `/staff/cases/:id` (Modal Phân công) | `POST /api/staff/cases/:id/assign` | Ghi nhận cán bộ phụ trách, đơn vị thi công và hạn chót xử lý |
| **4. Hành động & Nộp minh chứng** | Bước 5: Nhà thầu phun sương và nộp ảnh Before/After | `/contractor/tasks` | `POST /api/contractor/tasks/:id/submit` | Ảnh Before/After có kiểm tra Geofence <50m |
| **5. Tái kiểm thực địa (Nghiệm thu)** | Bước 6: Cán bộ tái kiểm, đối chứng chỉ số giảm | `/staff/cases/:id` (Tab Khắc phục) | `POST /api/staff/cases/:id/complete` | Chỉ số PM2.5 giảm từ 142 xuống 28 µg/m³, biên bản hoàn tất |
| **6. Kết quả minh bạch** | Outcome: Citizen thấy kết quả, Admin đo lường SLA | `/citizen/reports/:id` & `/admin` | `GET /api/public/cases/:id/track` | Trạng thái chuyển thành "Đã hoàn tất / Đạt chuẩn", mã QR tra cứu |

---

## 5. KỊCH BẢN GOLDEN DEMO CASE DUY NHẤT (SSOT)

- **Mã vụ việc**: `#DG-2026-0842`
- **Địa điểm**: Nút giao An Phú · TP. Thủ Đức (Dự án đường Vành Đai 3)
- **Đối tượng**: Gói thầu XL-02 (Nhà thầu Xây dựng Miền Nam)
- **Vấn đề**: Xe chở đất làm rơi vãi, phát tán bụi gần trường Tiểu học An Phú
- **Diễn tiến qua 5 Role**:
  1. **Citizen (Công dân)**: Anh Nguyễn Văn A chụp ảnh bụi mù mịt trên đường gom gửi lên hệ thống lúc 08:15. Nhận mã `#DG-2026-0842`.
  2. **Staff (Cán bộ)**: Chị Lan (Thanh tra quận) thấy tín hiệu cảnh báo trên Bàn làm việc, xem lý do: "Nồng độ PM2.5 142 µg/m³ + Gần trường học 80m". Chị Lan phê duyệt yêu cầu khắc phục với hạn chót 24h.
  3. **Contractor (Nhà thầu)**: Chỉ huy trưởng gói thầu XL-02 nhận thông báo trên điện thoại, điều xe bồn tưới nước và căng lưới chắn bụi, chụp ảnh sau khi xử lý gửi lên hệ thống.
  4. **Staff Reinspection (Tái kiểm)**: Sau 24h, chị Lan cùng tình nguyện viên quay lại hiện trường đo lại PM2.5 (đạt 28 µg/m³), chụp ảnh nghiệm thu và ký đóng vụ việc.
  5. **Outcome (Công khai & Quản trị)**: Anh A nhận thông báo kết quả kèm ảnh sau khắc phục. Bảng điều khiển Admin ghi nhận 1 vụ việc hoàn thành đúng SLA 24h.

---

## 6. DANH SÁCH FILE CẦN THỰC HIỆN REFACTOR (THEO THỨ TỰ ƯU TIÊN)

### Phase 2: Shared Presentation Foundation
1. `app/src/shared/components/ui/StatusBadge.jsx` & `StatusBadge.jsx` (Cập nhật màu và nhãn theo Canonical Status).
2. `app/src/shared/components/NeedsAttentionReasons.jsx` *(Tạo mới component giải thích lý do cần chú ý)*.
3. `app/src/shared/components/NextActionPanel.jsx` *(Tạo mới component chuẩn hóa hiển thị việc tiếp theo)*.

### Phase 3: Landing Page & Demo Hub
4. `app/src/modules/public/DemoHub.jsx` (Đồng bộ Golden Case `DG-2026-0842`, chuẩn hóa 5 role cards và 6 bước).
5. `app/src/components/landing/HeroSection.jsx` & `SolutionSection.jsx` (Tinh chỉnh copy nhấn mạnh theo dõi đến kết quả).

### Phase 4: Staff Core Workflow
6. `app/src/apps/staff/pages/cases/CaseDetailPage.jsx` (Chuyển đổi hiển thị priority, gắn `NeedsAttentionReasons`).
7. `app/src/apps/staff/pages/dashboard/StaffDashboardPage.jsx` (Đảm bảo hoàn toàn tập trung vào việc cần làm).
8. `app/src/apps/staff/pages/monitoring/StaffMonitoringPage.jsx` (Thêm nút liên kết từ trạm đo sang mở vụ việc).
9. `app/src/apps/staff/pages/sites/SitesListPage.jsx` & `SiteDetailPage.jsx` (Đổi cột rủi ro sang tình trạng vụ việc).

### Phase 5: Citizen & Contractor Workspaces
10. `app/src/apps/citizen/pages/home/CitizenHomePage.jsx` & `ReportDetailPage.jsx` (Ưu tiên tiến độ và ảnh nghiệm thu).
11. `app/src/apps/contractor/pages/dashboard/ContractorDashboardPage.jsx` (Làm rõ yêu cầu, thời hạn và việc nộp ảnh).

### Phase 6: Admin & Analytics
12. `app/src/apps/admin/pages/dashboard/AdminDashboardPage.jsx` (Đổi các chỉ số rủi ro sang chỉ số sức khỏe quy trình và tỷ lệ hoàn tất).
