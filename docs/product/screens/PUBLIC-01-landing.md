# PUB-01 — Cổng Thông Tin Giám Sát Bụi Đô Thị (Landing Page PDR)

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/` (và alias `/landing`)
- **Primary Role**: Đại chúng / Người dân / Ban Giám khảo / Báo chí (`public`)
- **Secondary Roles**: Toàn bộ 5 nhóm người dùng trước khi đăng nhập
- **Current Component**: `LandingPage.jsx` (`app/src/modules/public/LandingPage.jsx`)
- **Child Components**: `LandingNav`, `HeroSection`, `ProblemSection`, `SolutionSection`, `WorkflowSection`, `YouthSection`, `TechnologySection`, `LiveWorkspaceSection`, `ImpactSection`, `CTASection`, `DemoModal`, `EvidenceModal`, `PilotModal`.
- **Primary Job**: Giúp người xem hiểu rõ giải pháp DustGuard VN trong 5 giây, trải nghiệm quy trình hợp tác 4 bên, xem số liệu minh chứng thực tế và chuyển hướng hành động ngay (Bản đồ / Phản ánh / Demo / Đăng nhập).
- **Success Condition**: Người dùng hiểu được định vị sản phẩm (Biến phản ánh thành hành động có bằng chứng & theo dõi đến cùng) và tương tác với ít nhất một CTA chính.

---

## 2. WHY THIS SCREEN EXISTS
- Bụi công trình và giao thông đô thị là vấn đề nhức nhối nhưng người dân thường bất lực vì phản ánh bị "chìm xuồng". Landing Page định vị DustGuard VN không chỉ là một app báo cáo, mà là một **Hệ Thống Tác Nghiệp Khép Kín (Closed-Loop Civic Tech)** kết nối Người dân, Sinh viên tình nguyện, Cán bộ thanh tra và Nhà thầu thi công.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Tên miền chính `dustguard.vn`, chia sẻ liên kết mạng xã hội, quét mã QR truyền thông.
- **Exit Points**:
  - `Xem bản đồ điểm nóng` $\rightarrow$ Chuyển sang `/map`.
  - `Gửi phản ánh ngay` $\rightarrow$ Mở `/citizen/report/new` (hoặc `/login`).
  - `Trải nghiệm Demo 5 vai trò` $\rightarrow$ Mở `DemoModal` hoặc chuyển sang `/demo`.
  - `Cẩm nang trạm đo 500k` $\rightarrow$ Mở `/guide`.
  - `Tín chỉ tình nguyện sinh viên` $\rightarrow$ Mở `/youth`.
  - `Đăng nhập hệ thống` $\rightarrow$ Mở `/login`.
- **Navigation Bar (LandingNav)**:
  - Sticky Navigation trên cùng với hiệu ứng nền đục sáng `#FDFBF7`.
  - Logo DustGuard VN, 5 menu ScrollSpy (`Vấn đề`, `Quy trình`, `Trách nhiệm`, `Phân vai`, `Công nghệ`), Nút chuyển đổi ngôn ngữ `VI / EN`, Nút CTA `Trải nghiệm ngay` $\ge 44\text{px}$.

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem toàn bộ 8 Section** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Chuyển đổi ngôn ngữ VI/EN** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Mở Modal xem ảnh đối chứng Before/After** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Mở Modal trải nghiệm nhanh 5 vai trò** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Mở Modal đăng ký hợp tác Pilot địa phương** | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 5. PRIMARY USER FLOW (HUMAN-CENTRIC COGNITIVE PATH)
```text
Truy cập trang chủ / 
→ 5 Giây Đầu: Đọc Hero Title "Giám sát bụi đô thị · Theo dõi đến khi có kết quả"
→ 10 Giây Tiếp Theo: Xem 4 bước phối hợp (Phát hiện → Khảo sát → Yêu cầu → Nghiệm thu)
→ Mở Modal "Xem bằng chứng Before/After" để kiểm chứng tính minh bạch
→ Xem Bảng tác động thực tế (38+ công trình, 142 vụ việc đã giải quyết)
→ Bấm CTA chính: "Xem bản đồ" hoặc "Trải nghiệm demo 5 vai trò"
```

---

## 6. DETAILED 8-SECTION HIERARCHY

### Section 1: Hero Section (Level 1 — Nhận thức tức thì)
- **Tagline**: `GIẢI PHÁP QUẢN LÝ BỤI CÔNG TRÌNH & GIAO THÔNG ĐÔ THỊ`
- **Main Heading**: *Biến dữ liệu và phản ánh về bụi thành hành động quản lý có ưu tiên, có bằng chứng và có theo dõi.*
- **Quick Metric Chips**:
  - `38+` Công trình đang giám sát
  - `142` Phản ánh đã giải quyết thành công
  - `20h = 4.0` Tín chỉ tình nguyện thanh niên
  - `500k` Chi phí trạm đo mã nguồn mở
- **Action Buttons**: `Xem bản đồ điểm nóng` (Đỏ son `#9F241F`) | `Trải nghiệm 5 vai trò` (Nền sáng viền đậm).

### Section 2: Problem Section (Khoảng trống thực tế)
- Phân tích 3 nghịch lý đô thị hiện tại:
  1. *Phản ánh phân tán, thiếu chứng cứ số hóa $\rightarrow$ Dễ bị bỏ quên.*
  2. *Thiếu trạm đo diện rộng do chi phí trạm thương mại quá đắt.*
  3. *Không có cơ chế đối chứng Before/After $\rightarrow$ Người dân mất niềm tin.*

### Section 3: Solution & 4-Step Closed-Loop (Quy trình 4 bước)
- `Bước 1: Tín hiệu cộng đồng (Signal)` — Người dân chụp ảnh gửi trong 30s.
- `Bước 2: Xác thực & Khảo sát (Evidence)` — Sinh viên tình nguyện và trạm đo đối soát.
- `Bước 3: Điều phối & Yêu cầu (Action)` — Cán bộ thanh tra ban hành yêu cầu khắc phục theo NĐ 30/2020.
- `Bước 4: Nghiệm thu & Minh bạch (Outcome)` — Nhà thầu nộp ảnh Before/After, dân chấm điểm hài lòng.

### Section 4: Accountability & Reinspection (Theo dõi & Đối chứng Before/After)
- Trực quan hóa cơ chế so sánh ảnh Trước vs Sau khi dập bụi.
- Mã băm SHA-256 xác thực tính nguyên bản của bằng chứng.

### Section 5: Roles Ecosystem (Hệ sinh thái 5 vai trò)
- Mô tả công việc và giá trị nhận được của từng đối tượng:
  - 📱 **Công dân**: Gửi nhanh, nhận kết quả rõ ràng.
  - 🎓 **Thanh niên/Sinh viên**: Tích lũy tín chỉ rèn luyện (20h = 4.0 tín chỉ).
  - 📋 **Cán bộ quản lý**: Triage vụ việc tự động, giảm 90% thời gian làm báo cáo A4.
  - 🏗️ **Nhà thầu**: Hướng dẫn tuân thủ rõ ràng, tránh bị xử phạt oan.
  - ⚙️ **Lãnh đạo & Quản trị**: Bức tranh dữ liệu toàn diện về ô nhiễm bụi thành phố.

### Section 6: Technology & Open Hardware (Công nghệ & Trạm 500k)
- Giới thiệu kiến trúc Edge SQLite (Cloudflare D1) tốc độ cao.
- Sơ đồ trạm đo bụi giá rẻ 500k (ESP32 + PMS7003) tự lắp ráp.

### Section 7: Live Workspace Sandbox (Không gian tương tác thực tế)
- Trực quan hóa mockup màn hình Staff Dashboard và Citizen Report để người dùng hình dung trải nghiệm thực tế.

### Section 8: Pilot Roadmap & Impact Numbers (Lộ trình 3 giai đoạn)
- Thống kê kết quả thử nghiệm thực tế tại Đà Nẵng & Hà Nội.

### Section 9: Đồng Hành Cùng DustGuard (Pilot Community & Civic Manifesto) — [TÁCH RIÊNG]
- **Eyebrow**: `ĐỒNG HÀNH CÙNG DUSTGUARD`
- **Headline**: `Pilot DustGuard tại khu vực của bạn`
- **Subhead**: `DustGuard đang tìm kiếm các CLB sinh viên, nhóm cộng đồng, trường đại học và đơn vị địa phương muốn thử nghiệm mô hình giám sát bụi theo hướng cộng đồng có trách nhiệm.`
- **4 Yêu cầu điều kiện cơ bản (4 Core Conditions)**:
  1. *Một khu vực thử nghiệm cụ thể*
  2. *Một nhóm vận hành nhỏ (5–10 người)*
  3. *Một đầu mối phối hợp địa phương*
  4. *Quy trình phản ánh & tái kiểm thống nhất*
- **Tuyên ngôn hành động vì khí hậu (Civic Action Manifesto)**:
  - *“Một vấn đề được nhìn thấy không nên trở thành một vấn đề bị lãng quên.”*
  - *Từ tín hiệu đầu tiên đến hành động cuối cùng.*
  - **Chuỗi hành động khép kín**: `OBSERVE → VERIFY → ACT → FOLLOW UP → IMPACT`
- **Action Buttons**: `Đăng ký pilot` (mở Modal), `Trao đổi với DustGuard` (mailto), `Xem bản demo` (`/demo`).

### Section 10: Global Footer
- Điều hướng hệ thống, danh bạ hỗ trợ và bản quyền.

---

## 7. CONTENT & LOCALIZATION CONTRACT
- **Song ngữ VI / EN**: Chuyển đổi mượt mà toàn bộ nội dung qua nút chuyển ngôn ngữ.
- **Tiêu đề & CTA**:
  - Tiếng Việt: Ngắn gọn, tự nhiên, văn phong hành chính hiện đại.
  - Tiếng Anh: Chuẩn mực CivicTech quốc tế (UNICEF / UNDP Climate Action).
- **Cấm Jargon**: Không đưa mã lệnh, tên bảng DB hay thuật ngữ lập trình vào bản sao giao diện.

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Số vụ việc đã giải quyết | Yes | `cases` table | `COUNT(id) WHERE status='CLOSED'` | `142` |
| Số công trình giám sát | Yes | `sites` table | `COUNT(id)` | `38+` |
| Giờ tình nguyện sinh viên | Yes | `volunteer_logs` | `SUM(hours)` | `1,250+` |

- **Current Implementation**: `GET /api/public/landing-stats`

---

## 9. MODALS & INTERACTION CONTRACT
1. **DemoModal**: Cho phép chọn 1 trong 5 vai trò để đăng nhập thử nghiệm nhanh.
2. **EvidenceModal**: Hiển thị thư viện ảnh đối chứng Before/After thực tế kèm mã SHA-256.
3. **PilotModal**: Form đăng ký liên hệ triển khai thử nghiệm cho các Quận/Huyện và Trường Đại học.

---

## 10. DESKTOP & MOBILE BEHAVIOR
- **Desktop (1366×768 & 1920×1080)**:
  - Hero layout 2 cột cân đối, thanh điều hướng ScrollSpy mượt mà.
  - Card và bảng số liệu phân bổ 4 cột rõ nét.
- **Mobile (360–430px)**:
  - Toàn bộ nội dung xếp thành 1 cột dọc thông thoáng, padding an toàn 16px.
  - Nút bấm chính có chiều cao $\ge 48\text{px}$ chạm bấm ngón tay cái dễ dàng.
  - Menu thu gọn thành Drawer trượt mượt mà.

---

## 11. ACCEPTANCE CRITERIA
- [ ] Thời gian tải trang dưới 0.8s, không giật cục (Zero CLS).
- [ ] Đạt chuẩn tương phản cao WCAG AA trên nền sáng `#FDFBF7` và chữ đậm `#1C1917`.
- [ ] Chuyển đổi ngôn ngữ VI/EN tức thời, lưu lựa chọn vào `localStorage`.
- [ ] Bấm phím `Escape` đóng ngay lập tức các modal đang mở.
- [ ] Không có lỗi console runtime hoặc lỗi vỡ layout trên màn hình 360px.

---

## 12. IMPLEMENTATION STATUS
- **CURRENT**: Đầy đủ 8 sections, 3 modals tương tác, song ngữ VI/EN, ScrollSpy, reveal animations, build production trong 2.81s.
- **PARTIAL**: Trực tiếp kéo thả thanh trượt Before/After ngay trong Hero section.
- **PROPOSED**: Tích hợp video 3D giới thiệu mô hình trạm đo bụi 500k.
