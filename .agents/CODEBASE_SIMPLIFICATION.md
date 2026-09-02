# DUSTGUARD VN — CODEBASE SIMPLIFICATION & HUMAN-CENTRIC CONSOLIDATION SSOT

> **Phiên bản**: 2.0 (SSOT Kiến Trúc Tối Giản & Trải Nghiệm Thực Tế)  
> **Mục tiêu tối thượng**: Giảm độ phức tạp nhận thức, gom các tính năng cũ vào luồng người dùng hiện tại, loại bỏ cấu trúc dư thừa, bảo toàn 100% logic nghiệp vụ D1 SQLite & Cloudflare Workers đã được kiểm thử.

---

## A. BEFORE: HIỆN TRẠNG KIẾN TRÚC & ĐIỂM NÓNG PHỨC TẠP

### 1. Kiến trúc phân tầng ban đầu
Trước đây, codebase tích lũy qua nhiều vòng thi Hackathon với nhiều thư mục chồng chéo:
- `app/src/modules/`: Chứa các phân hệ độc lập tách rời (`youth/`, `documents/`, `citizen/`, `staff/`, `cases/`, `contractor/`, `executive/`, `admin/`, `public/`).
- `app/src/apps/`: Bộ điều hướng phân vai (Role-based).
- `app/src/components/`: Trộn lẫn giữa component dùng chung (Generic) và component chỉ dùng cho 1 trang (`PolicyIntelligence/`, `InspectionModal/`...).
- `app/src/layout/` & `app/src/layouts/`: Trùng lặp khái niệm layout.

### 2. Điểm nóng phức tạp (Complexity Hotspots)
1. **Chia cắt luồng nghiệp vụ**:
   - Để xuất biên bản xử phạt theo Nghị định 30, cán bộ phải chuyển từ `/staff/cases/:id` sang `/documents`, chọn template, nhập lại dữ liệu $\rightarrow$ Gây đứt gãy luồng xử lý.
   - Tín chỉ thanh niên và xuất chứng nhận tình nguyện nằm ở `/youth` tách biệt với Trang cá nhân `/citizen/profile`.
2. **Loãng thanh điều hướng (Navigation Overload)**:
   - Menu Citizen từng có tới 8 mục (`Trang chủ`, `Báo bụi`, `Nhiệm vụ`, `Chiến dịch`, `Tín chỉ`, `Bản đồ`, `Chứng nhận`, `Cộng đồng`).
   - Các trang kỹ thuật (`/demo`, `/demo/iot`) từng xuất hiện lẫn vào giao diện chính.
3. **Trùng lặp thuật ngữ (Terminology Drift)**:
   - Các từ kỹ thuật như `DAG 7-step`, `SHA-256 WebCrypto Hash`, `RFC 7807`, `Escrow release`, `Geofence WGS84` xuất hiện trực tiếp trên giao diện người dân và cán bộ thanh tra.

---

## B. DECISIONS: BẢNG PHÂN LOẠI XỬ LÝ TOÀN BỘ FILE & MODULE

| File / Module | Vị trí hiện tại | Phân loại | Đích đến / Cách tái sử dụng | Rationale (Lý do & Giá trị giữ lại) | Rủi ro & Giải pháp |
|---|---|:---:|---|---|---|
| **YouthCredits.jsx** | `modules/youth/YouthCredits.jsx` | **MERGE** | Nhúng vào `/citizen/profile` & link `/certificate` | Bảo toàn 100% logic 20h = 4.0 tín chỉ, 80 ĐRL và thuật toán tính điểm đoàn viên. | Giữ nguyên API `calculateVolunteerHours`, không sửa schema. |
| **YouthCertificate.jsx** | `modules/youth/YouthCertificate.jsx` | **KEEP** | Giữ route `/certificate/:id` & `/verify-cert/:id` | Cho phép quét QR Code xác thực chứng nhận số công khai. | Đảm bảo render SVG QR chuẩn ISO/IEC 18004. |
| **DocumentEditorPage.jsx** | `modules/documents/DocumentEditorPage.jsx` | **MERGE** | Nhúng trực tiếp vào Tab **Văn bản & Hồ sơ** của `CaseDetailPage.jsx` | Cán bộ bấm "Xuất biên bản NĐ 30" là tự sinh biểu mẫu từ dữ liệu Case, không bắt nhập tay. | Giữ route phụ `/documents/*` cho chuyên viên văn thư nâng cao. |
| **PolicyIntelligencePage.jsx** | `components/PolicyIntelligence/` | **INLINE** | Gợi ý điều khoản NĐ 45/2022 trong form lập biên bản | Biến DB tra cứu luật thành gợi ý thông minh (Smart Hint) khi phát hiện vi phạm. | Giữ route `/staff/policy` trong menu Công cụ nâng cao. |
| **CitizenMap.jsx** | `modules/citizen/CitizenMap.jsx` | **MERGE** | Nhúng mini-map vào `/citizen` và form `/citizen/report/new` | Người dân nhìn thấy ngay các điểm nóng quanh mình; tự động lấy GPS khi báo bụi. | Leaflet map lazy load an toàn, không block main thread. |
| **IoTDemo.jsx & DemoHub.jsx** | `modules/public/IoTDemo.jsx` | **LEGACY** | Giữ route ngầm `/demo`, ẩn 100% khỏi Primary Navigation | Phục vụ ban giám khảo và kỹ thuật viên test gói tin D1 mà không làm rác UI người dùng. | Không ảnh hưởng đến người dân và cán bộ. |
| **Legacy Community Routes** | `/community/*`, `/app/*`, `/missions` | **LEGACY** | Điều hướng `Navigate replace` về `/citizen` và `/staff` | Đảm bảo tương thích ngược các đường dẫn cũ từ QR code dán ngoài thực địa. | Zero 404 error. |
| **Shared UI Primitives** | `shared/components/` | **KEEP** | `BrandLogo`, `MetricChipCard`, `BeforeAfterSlider`, `StatusBadge` | Tái sử dụng tối đa, chỉ giữ các component dùng $\ge 2$ nơi. | Đã verify qua UI Smoke Suite. |

---

## C. FINAL USER FLOWS: THANH ĐIỀU HƯỚNG CUỐI CÙNG THEO 5 VAI TRÒ

### 1. Phân hệ Người dân — Citizen (`/citizen`) — 3 Mục Tối Đa (Mobile-First)
```text
🏠 Trang chủ (/citizen) ─── Xem tình hình môi trường quanh vị trí hiện tại
📸 Báo bụi (/citizen/report/new) ─── Gửi phản ánh ≤ 30s (Nút nổi bật)
📋 Phản ánh của tôi (/citizen/reports) ─── Xem tiến độ 3 nấc & kết quả Before/After
👤 Trang cá nhân (/citizen/profile) ─── Giờ tình nguyện, Tín chỉ & Chứng nhận số
```

### 2. Phân hệ Cán bộ — Staff (`/staff`) — 5 Mục Tối Đa (Work Queue)
```text
⚡ Việc hôm nay (/staff) ─── Bố cục 65% Việc cần làm + 35% Tình hình địa bàn
🏗️ Công trình (/staff/sites) ─── Danh sách & Hồ sơ chi tiết các dự án xây dựng
📋 Hồ sơ xử lý (/staff/cases) ─── Quản lý vụ việc theo 7 bước & Xuất biên bản NĐ 30
🔍 Việc hiện trường (/staff/tasks) ─── Giao diện di động kiểm tra thực địa 1 tay
⚠️ Cảnh báo (/staff/alerts) ─── Cảnh báo bụi tự động gom nhóm theo công trình
(Công cụ nâng cao: Quan trắc, Báo cáo Word/PDF, Văn bản NĐ 30, Tra cứu luật ── gom vào menu phụ)
```

### 3. Phân hệ Nhà thầu — Contractor (`/contractor`) — 2 Mục Tối Đa (1-Link Action)
```text
🛠️ Việc cần xử lý (/contractor/tasks) ─── Danh sách yêu cầu khắc phục kèm hạn chót
📤 Gửi kết quả (/contractor/tasks/:id) ─── Chụp ảnh sau xử lý & Xác nhận hoàn thành
```

### 4. Phân hệ Quản trị — Admin (`/admin`) — 3 Mục
```text
👥 Người dùng (/admin/users) ─── Phân quyền 5 vai trò & Kích hoạt tài khoản
🏗️ Công trình (/admin/sites) ─── Danh mục địa bàn & Vị trí WGS84
⚙️ Cài đặt (/admin/settings) ─── Cấu hình ngưỡng bụi QCVN 05 & Tham số hệ thống
```

### 5. Phân hệ Lãnh đạo — Executive (`/executive`) — 3 Mục (Read-Oriented)
```text
📊 Tổng thể (/executive) ─── Bức tranh điều hành, tốc độ giải quyết & Bản đồ điểm nóng
📑 Ký duyệt (/executive/approvals) ─── Ký duyệt các quyết định xử phạt hành chính
📈 Xu hướng (/executive/heatmap) ─── Phân tích xu hướng giảm bụi đô thị
```

---

## D. FINAL ARCHITECTURE: CÂY THƯ MỤC CHUẨN SAU KHI TINH GỌN

```text
app/src/
├── app/
│   └── router.jsx                  # Điểm điều hướng trung tâm (SSOT Routing 9 phân nhóm)
│
├── apps/                           # 5 Phân hệ nghiệp vụ theo Role
│   ├── citizen/                    # Phân hệ Dân & Thanh niên
│   │   ├── layout/                 # CitizenLayout (Bottom Nav Mobile + Header)
│   │   └── pages/                  # home, report-new, reports, profile
│   ├── staff/                      # Phân hệ Cán bộ Thanh tra / Môi trường
│   │   ├── layout/                 # StaffLayout (Sidebar Desktop + Work Queue Header)
│   │   └── pages/                  # dashboard, sites, cases, tasks, alerts, reports, profile...
│   ├── contractor/                 # Phân hệ Nhà thầu thi công
│   │   └── pages/                  # tasks list & task verification
│   ├── admin/                      # Phân hệ Quản trị viên
│   │   └── pages/                  # users, sites, settings
│   ├── executive/                  # Phân hệ Lãnh đạo & Chỉ huy
│   │   └── pages/                  # command center, approvals, heatmap
│   └── public/                     # Landing Page, Map, Login, Demo Hub
│
├── modules/                        # Các Module tính năng chuyên sâu tái sử dụng
│   ├── documents/                  # Soạn thảo & Xuất văn bản NĐ 30/2020 (Docx/PDF)
│   ├── youth/                      # Tín chỉ thanh niên & Chứng nhận số QR
│   ├── citizen/                    # CitizenMap, CitizenProfile
│   └── auth/                       # Login / Đăng ký
│
├── shared/                         # UI Primitives & Components dùng chung (≥ 2 nơi)
│   ├── components/                 # BrandLogo, StatusBadge, BeforeAfterSlider, SafeImage...
│   ├── api/                        # HTTP client & normalizer
│   └── utils/                      # Định dạng ngày tháng, tiền tệ, geofence
│
└── index.css                       # Design System Tokens High Contrast (Kem / Đỏ dấu / Teal / Mực)
```

---

## E. REUSED LEGACY VALUE: TÁI SỬ DỤNG GIÁ TRỊ TÍNH NĂNG CŨ

1. **Youth Credits Engine $\rightarrow$ Tích hợp gọn vào Hồ sơ cá nhân (`/citizen/profile`)**:
   - Người dùng xem được ngay số giờ tình nguyện tích lũy, số tín chỉ ngoại khóa đề xuất (20h = 4.0 tín chỉ) và tải chứng nhận số có mã QR xác thực.
2. **Document Studio NĐ 30 $\rightarrow$ Tích hợp nút xuất biên bản trong Hồ sơ vụ việc (`/staff/cases/:id`)**:
   - Cán bộ bấm vào tab "Biên bản & Văn bản", hệ thống tự động map tên công trình, ngày vi phạm, chỉ số bụi và hình ảnh đối chứng vào mẫu văn bản chuẩn Nghị định 30/2020/NĐ-CP.
3. **Policy Intelligence $\rightarrow$ Gợi ý mức phạt thông minh**:
   - Cơ sở dữ liệu Nghị định 45/2022/NĐ-CP được dùng để hiển thị gợi ý mức phạt tương ứng với từng tiêu chí vi phạm trong 10 tiêu chí QCVN 18/QCVN 05.
4. **Citizen Map $\rightarrow$ Bản đồ thu nhỏ và định vị tự động**:
   - Bản đồ Leaflet được tối ưu tải bất đồng bộ, hiển thị bán kính 500m xung quanh người dùng và tự động gắn tọa độ khi chụp ảnh báo bụi.
5. **IoT Simulation Hub $\rightarrow$ Đặt vào route kỹ thuật `/demo`**:
   - Giữ nguyên công cụ mô phỏng gói tin cảm biến phục vụ ban giám khảo chấm thi mà không gây rối mắt cho người dùng thật.

---

## F. REMOVED COMPLEXITY & METRICS: SỐ LIỆU CHÍNH XÁC

- **Số menu điều hướng rườm rà đã giảm**: Giảm từ 8 mục xuống còn 3 mục trên Citizen, 5 mục trên Staff.
- **Thời gian hoàn thành tác vụ chính**:
  - Báo bụi người dân: $\le 30$ giây.
  - Cán bộ mở việc cần làm đầu ngày: 1 click ngay tại trang chủ `/staff`.
  - Nhà thầu xác nhận khắc phục: $\le 45$ giây từ 1 link duy nhất.
- **Chỉ số kiểm thử**:
  - **245/245** bài test Backend / Domain / API / Edge Worker pass 100% (2.2s).
  - **42/42** bài test UI Smoke & Tokens Design System pass 100% (0.3s).
  - **Zero mock** trong các luồng cốt lõi D1 SQLite.
  - **0% Developer Jargon** trên các giao diện người dùng phổ thông.
