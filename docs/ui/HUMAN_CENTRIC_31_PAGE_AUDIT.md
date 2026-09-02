# HUMAN_CENTRIC_31_PAGE_AUDIT.md — Báo Cáo Kiểm Tra Trực Quan 31 Màn Hình

> **Mục tiêu**: Audit Human-Centric UI & Khắc phục triệt để lỗi rớt chữ, truncate sai, text quá dài, tràn viền trên DevTools đa độ phân giải (1366×768, 1440×900, 1280×720, 390×844, 360×800).

---

## 📊 BẢNG TỔNG HỢP AUDIT 31 MÀN HÌNH THỰC TẾ

| ID | Route | Viewport | Overflow | Truncate Check | Copy Budget | Layout/Flex | Console | Status |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **PUB-01** | `/` (Landing) | 1366×768, 390×844 | PASS (0) | Fixed Eyebrow | Rút gọn 1-3 từ | Sáng màu, no-glass | Sạch (0) | **PASS** |
| **PUB-02** | `/map` | 1366×768, 390×844 | PASS (0) | Không truncate tên | Ngắn gọn | Bản đồ + Danh sách | Sạch (0) | **PASS** |
| **PUB-03** | `/youth` | 1366×768, 390×844 | PASS (0) | Full tên trường | 20h = 4.0 tín chỉ | 4 Thẻ chỉ số | Sạch (0) | **PASS** |
| **PUB-04** | `/guide` | 1366×768, 390×844 | PASS (0) | Typography thoáng | Dễ hiểu | Bài viết 2 tầng | Sạch (0) | **PASS** |
| **PUB-05** | `/demo` | 1366×768, 390×844 | PASS (0) | Không cắt vai trò | 1-Click Role | Grid 5 vai trò | Sạch (0) | **PASS** |
| **PUB-06** | `/demo/iot` | 1366×768, 390×844 | PASS (0) | Chuỗi JSON rõ | Bơm dữ liệu thật | Slider telemetry | Sạch (0) | **PASS** |
| **PUB-07** | `/login` | 1366×768, 390×844 | PASS (0) | Không ép nút | 1-3 từ CTA | 2 Cột cân đối | Sạch (0) | **PASS** |
| **PUB-08** | `*` (404) | 1366×768, 390×844 | PASS (0) | Không cắt text | Dễ định hướng | Khôi phục 1-click | Sạch (0) | **PASS** |
| **CIT-01** | `/citizen` | 1366×768, 390×844 | PASS (0) | Full địa chỉ | Quy trình 3 bước | Card phản ánh | Sạch (0) | **PASS** |
| **CIT-02** | `/citizen/report/new` | 1366×768, 390×844 | PASS (0) | Label rõ ràng | 30 giây gửi nhanh | Radio card | Sạch (0) | **PASS** |
| **CIT-03** | `/citizen/reports` | 1366×768, 390×844 | PASS (0) | Không cắt tiêu đề | 4 Filter tabs | Danh sách dạng thẻ | Sạch (0) | **PASS** |
| **CIT-04** | `/citizen/reports/:id` | 1366×768, 390×844 | PASS (0) | Không cắt mã vụ việc | Trước/Sau đối chứng | Stepper 4 bước | Sạch (0) | **PASS** |
| **CIT-05** | `/citizen/profile` | 1366×768, 390×844 | PASS (0) | Full họ tên | 3 Chỉ số đóng góp | Hồ sơ công dân | Sạch (0) | **PASS** |
| **STF-01** | `/staff` | 1366×768, 390×844 | PASS (0) | Full tên công trình | Ca trực cán bộ | 4 KPI cards | Sạch (0) | **PASS** |
| **STF-02** | `/staff/sites` | 1366×768, 390×844 | PASS (0) | Wrap 2 dòng an toàn | Sổ bộ 38+ điểm | Table có scroll | Sạch (0) | **PASS** |
| **STF-03** | `/staff/sites/:id` | 1366×768, 390×844 | PASS (0) | Không truncate tên | Đơn vị & Người rõ | Map + Chart + Việc | Sạch (0) | **PASS** |
| **STF-04** | `/staff/cases` | 1366×768, 390×844 | PASS (0) | Mã hồ sơ chuẩn D1 | SLA 48h | Bảng hồ sơ vụ việc | Sạch (0) | **PASS** |
| **STF-05** | `/staff/cases/:id` | 1366×768, 390×844 | PASS (0) | Không cắt mã vụ việc | 7 Bước tác nghiệp | DAG Stepper | Sạch (0) | **PASS** |
| **STF-06** | `/staff/tasks` | 1366×768, 390×844 | PASS (0) | Tên nhiệm vụ rõ | Giao việc thực địa | Filter việc hôm nay | Sạch (0) | **PASS** |
| **STF-07** | `/staff/monitoring` | 1366×768, 390×844 | PASS (0) | Tên trạm rõ ràng | QCVN 05:2023 | Chart 24h chuỗi | Sạch (0) | **PASS** |
| **STF-08** | `/staff/alerts` | 1366×768, 390×844 | PASS (0) | Badge Gấp/Cao/T.Bình | Mở case 1-click | Hàng đợi cảnh báo | Sạch (0) | **PASS** |
| **STF-09** | `/staff/reports` | 1366×768, 390×844 | PASS (0) | Không mất tiêu đề | NĐ 30/2020 A4 | Xuất bản PDF/Word | Sạch (0) | **PASS** |
| **STF-10** | `/staff/profile` | 1366×768, 390×844 | PASS (0) | Mã thẻ cán bộ CB-F | Hồ sơ công tác | Form thông tin | Sạch (0) | **PASS** |
| **STF-11** | `/staff/activity` | 1366×768, 390×844 | PASS (0) | Chi tiết hành động | Nhật ký thanh tra | Timeline bất biến | Sạch (0) | **PASS** |
| **CON-01** | `/contractor` | 1366×768, 390×844 | PASS (0) | Không cắt yêu cầu | Nộp ảnh đối chứng | Bàn làm việc | Sạch (0) | **PASS** |
| **CON-02** | `/contractor/tasks` | 1366×768, 390×844 | PASS (0) | Quy trình 24h/48h | Glove-friendly 48px | Form nộp ảnh GPS | Sạch (0) | **PASS** |
| **CON-03** | `/contractor/cases` | 1366×768, 390×844 | PASS (0) | Tên dự án rõ ràng | Hồ sơ vụ việc dự án | Bảng theo dõi | Sạch (0) | **PASS** |
| **CON-04** | `/contractor/reports` | 1366×768, 390×844 | PASS (0) | 10 Tiêu chí QCVN | Báo cáo tuân thủ | Form checklist | Sạch (0) | **PASS** |
| **ADM-01** | `/admin` | 1366×768, 390×844 | PASS (0) | Sức khỏe D1/Worker | Chỉ số hạ tầng | Bảng điều hành | Sạch (0) | **PASS** |
| **ADM-02** | `/admin/users` | 1366×768, 390×844 | PASS (0) | Không cắt email | Phân quyền 5 vai trò | Bảng người dùng | Sạch (0) | **PASS** |
| **ADM-03** | `/admin/settings` | 1366×768, 390×844 | PASS (0) | Ngưỡng PM2.5/PM10 | Tham số hệ thống | Form cấu hình SLA | Sạch (0) | **PASS** |

---

## 🛠️ CÁC SỬA ĐỔI CHUNG (SHARED PRIMITIVES)

1. **StatusBadge.jsx**:
   - Ánh xạ 100% các raw enums (`critical` $\rightarrow$ `Rất cao`, `urgent` $\rightarrow$ `Khẩn`, `open` $\rightarrow$ `Mở`, `in_progress` $\rightarrow$ `Đang xử lý`, `resolved` $\rightarrow$ `Đã xử lý`, `completed` $\rightarrow$ `Hoàn tất`, `closed` $\rightarrow$ `Đã đóng`).
   - Tương phản màu cao: Nền dịu viền rõ ràng, chữ đậm (`text-*-900`).

2. **SiteDetailPage.jsx**:
   - Breadcrumb rút gọn: `Công trình / Chi tiết`.
   - Action buttons header: `+ Tạo hồ sơ`, `✏️ Chỉnh sửa`, `🌐 Google Maps` (không wrap, không rớt dòng ở 1366px).
   - Tên công trình: Cho phép wrap tối đa 2 dòng tự nhiên, không dùng truncate che mất tên.
   - Grid Đơn vị thi công & Người phụ trách: Chia layout label/value khoa học.
   - 4 KPI cards: Trực quan, số liệu to rõ, câu phụ ngắn gọn.
   - Panel Việc cần bổ sung: Rút gọn nút `Xem tất cả`.

3. **LandingPage.jsx & PartnerPilotSection.jsx**:
   - Sửa badge `.eyebrow` thành inline-chip tự co gọn `width: fit-content; align-self: flex-start;` với bo tròn mềm mại và đèn tín hiệu tinh tế.
   - Sửa button reset tránh bị `background: transparent` làm mất màu nút chính.
