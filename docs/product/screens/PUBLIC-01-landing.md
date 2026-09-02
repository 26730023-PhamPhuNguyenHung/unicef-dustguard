# PUB-01 — Trang Chủ Truyền Thông & Cổng Kết Nối Đa Bên (Landing Page)

## 1. Screen identity
- **Role**: Public / Guest (Khách vãng lai, Người dân, Sinh viên, Cán bộ, Nhà thầu)
- **Route**: `/`
- **Component**: `src/modules/public/LandingPage.jsx` (gồm 11 sub-components chuyên biệt)
- **Layout**: Public Root Layout (`src/components/landing/LandingNav.jsx` + `LandingFooter.jsx`)
- **Navigation entry**: Gốc tên miền URL / Logo DustGuard VN
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Nền tảng truyền thông và điều hướng công nghệ công dân: công khai hóa dữ liệu bụi công trình, giới thiệu cơ chế giám sát đa bên, điều hướng 5 vai trò nghiệp vụ và kích hoạt hành động phản ánh vi phạm trong 30 giây.

---

## 2. User goal
1. **Khám phá năng lực hệ thống**: Hiểu rõ DustGuard VN giải quyết vấn đề bụi mịn công trình (PM2.5 / PM10) thông qua sự phối hợp giữa Người dân - Thanh niên - Cán bộ - Nhà thầu.
2. **Kích hoạt hành động nhanh**: Nhấn nút tạo phản ánh hiện trường 30 giây hoặc mở Bản đồ rủi ro công khai để tra cứu 33 công trình trọng điểm.
3. **Truy cập đúng phân hệ**: Đăng nhập nhanh vào đúng cổng làm việc (Citizen Portal, Staff Dashboard, Contractor Workspace, Admin Center).

---

## 3. Entry points
- Truy cập trực tiếp qua trình duyệt web (Desktop / Mobile).
- Bấm Logo "DustGuard VN" từ thanh điều hướng của bất kỳ phân hệ nào.
- Quét mã QR từ tài liệu truyền thông, áp phích tại các trường Đại học và khu dân cư.

---

## 4. Exit / next actions
- Bấm **"Tạo phản ánh ngay"** $ightarrow$ Chuyển hướng tới `/citizen/report/new`
- Bấm **"Xem bản đồ rủi ro"** $ightarrow$ Chuyển hướng tới `/map`
- Bấm **"Cổng tín chỉ thanh niên"** $ightarrow$ Chuyển hướng tới `/youth`
- Bấm **"Kịch bản Demo"** $ightarrow$ Mở trang kịch bản `/demo`
- Bấm **"Đăng nhập cán bộ"** $ightarrow$ Mở trang xác thực `/login`
- Bấm **"Xem hướng dẫn trạm đo"** $ightarrow$ Chuyển hướng tới `/guide`

---

## 5. Information hierarchy
1. **Thanh điều hướng cố định (LandingNav)**: Logo DustGuard khiên đỏ, Menu 5 mục, Nút CTA [Tạo phản ánh] đỏ son, Nút [Đăng nhập].
2. **Hero Section (Khối hành động chính)**: Tiêu đề lớn, Badge bảo trợ UNICEF & Thanh niên, 2 nút CTA chính, Dòng thẻ chỉ số thực tế.
3. **Problem Section (Thực trạng ô nhiễm)**: 3 Thẻ phân tích nỗi đau: Bụi phát tán không kiểm soát, Thiếu cơ chế giám sát độc lập, Thời gian xử lý chậm trễ.
4. **Solution Section (Cơ chế chấm điểm $R$)**: Công thức tính điểm rủi ro đa yếu tố $R = rac{sum w_i S_i}{sum w_i}$, Ma trận 4 cấp độ rủi ro (Xanh - Vàng - Cam - Đỏ).
5. **Workflow Section (Chu trình tác nghiệp 7 bước DAG)**: Sơ đồ tương tác khép kín giữa Công dân $ightarrow$ Cán bộ $ightarrow$ Nhà thầu $ightarrow$ Nghiệm thu.
6. **Youth Section (Tín chỉ tình nguyện)**: Cơ chế tích lũy 20h = 4.0 tín chỉ, Bảng xếp hạng Top các trường đại học, Mẫu chứng chỉ số QR ISO 18004.
7. **Technology Section (Kiến trúc & Pháp lý)**: Cloudflare Edge, D1 SQLite SSOT, Minh chứng SHA-256, Tiêu chuẩn QCVN 05:2023/BTNMT, NĐ 30/2020/NĐ-CP.
8. **Live Workspace Previews**: Khung xem trước trực tiếp giao diện Cán bộ, Nhà thầu và Công dân.
9. **Impact & Metrics Section**: 33 Công trình, 48h SLA, 94.2% Tỷ lệ khắc phục, 1,280 Tín chỉ cấp.
10. **CTA Section (Kêu gọi hành động cuối trang)**: Nút kêu gọi tham gia mạng lưới giám sát.
11. **Footer (Chân trang)**: Thông tin cơ quan chủ quản, quy chuẩn kỹ thuật, liên hệ hỗ trợ.

---

## 6. Above-the-fold content (First Viewport)
- **MUST SEE**:
  - Tiêu đề: `Chấm điểm rủi ro bụi công trình`
  - Mô tả: `Nền tảng công nghệ công dân kết nối người dân, thanh niên và cơ quan quản lý vì bầu không khí trong lành.`
  - Nút Primary CTA: `[Tạo phản ánh ngay]` (Nền đỏ son `#9f241f`, chữ trắng, touch target $ge 44	ext{px}$)
  - Nút Secondary CTA: `[Xem bản đồ rủi ro]` (Nền sáng, viền xanh `#0d6f64`)
  - Huy hiệu bảo trợ: `UNICEF Hackathon • Youth Environmental Action`
- **SHOULD SEE**: Dải 4 chỉ số thống kê (33 Công trình, 48h Phản hồi, 94.2% Khắc phục, 1,280 Tín chỉ).
- **BELOW FOLD**: Toàn bộ các section phân tích bài toán, công thức $R$, sơ đồ 7 bước, demo workspace.

---

## 7. Screen sections chi tiết

### Section 1 — Navigation Bar (`LandingNav.jsx`)
- **Displays**: Logo thương hiệu `BrandLogo`, Menu liên kết (Trang chủ, Bản đồ, Tín chỉ, Hướng dẫn, Demo), Nút hành động nổi bật [Tạo phản ánh], Nút [Đăng nhập].
- **User Actions**: Điều hướng tức thì, chuyển đổi trạng thái menu trên Mobile.
- **Data Source**: Static navigation schema.
- **Status**: IMPLEMENTED (Responsive 360px - 1920px, không vỡ layout).

### Section 2 — Hero Action Section (`HeroSection.jsx`)
- **Displays**: Tiêu đề H1 chuẩn SEO, mô tả súc tích, 2 nút CTA, dải thẻ chỉ số thống kê động.
- **Data Source**: VERIFIED (D1 Database endpoints).
- **Status**: IMPLEMENTED.

### Section 3 — Problem & Challenge (`ProblemSection.jsx`)
- **Displays**: 3 thẻ phân tích thực trạng bụi mịn tại các đại công trường đô thị.
- **Status**: IMPLEMENTED.

### Section 4 — Solution & Multi-Factor Risk Score (`SolutionSection.jsx`)
- **Displays**: Giải thích 4 nhóm tham số: Diện tích thi công ($w=0.25$), Lưu lượng xe tải ($w=0.25$), Biện pháp che chắn ($w=0.25$), Chỉ số cảm biến PM2.5 ($w=0.25$).
- **Status**: IMPLEMENTED.

### Section 5 — 7-Step Enforcement Workflow (`WorkflowSection.jsx`)
- **Displays**: 7 Khối tương tác mô phỏng chu trình: Tiếp nhận $ightarrow$ Khảo sát $ightarrow$ Đề xuất $ightarrow$ Phê duyệt $ightarrow$ Khắc phục $ightarrow$ Nghiệm thu $ightarrow$ Hoàn tất.
- **Status**: IMPLEMENTED.

### Section 6 — Youth Volunteer Credits (`YouthSection.jsx`)
- **Displays**: Bảng quy đổi 20 giờ = 4.0 tín chỉ, xem trước chứng chỉ số có mã QR SVG chuẩn ISO 18004.
- **Status**: IMPLEMENTED.

### Section 7 — Technology & Integrity (`TechnologySection.jsx`)
- **Displays**: 4 Trụ cột công nghệ: Cloudflare D1 SQLite, Mã băm SHA-256 Web Crypto, WGS84 Geofence $le 50	ext{m}$, Chữ ký số HMAC.
- **Status**: IMPLEMENTED.

### Section 8 — Live Workspace Preview (`LiveWorkspaceSection.jsx`)
- **Displays**: Tab chuyển đổi xem nhanh 3 giao diện: Cán bộ (`/staff`), Nhà thầu (`/contractor`), Công dân (`/citizen`).
- **Status**: IMPLEMENTED.

### Section 9 — Call to Action & Footer (`CTASection.jsx`, `LandingFooter.jsx`)
- **Displays**: Nút tham gia chiến dịch cộng đồng, thông tin pháp lý, liên kết mã nguồn mở và bản quyền.
- **Status**: IMPLEMENTED.

---

## 8. Data displayed
| Field | Meaning | Required | Source | Current status |
|---|---|:---:|---|---|
| Total Sites Monitored | Tổng số công trình đang được giám sát (33) | Có | D1 `sites` | REAL |
| SLA Response Time | Thời gian xử lý phản ánh tiêu chuẩn (48h) | Có | Business Invariant | REAL |
| Remediation Rate | Tỷ lệ khắc phục vi phạm thành công (94.2%) | Có | D1 `actions` | REAL |
| Youth Credits Issued | Tổng tín chỉ tình nguyện đã cấp (1,280) | Có | D1 `youth_certificates` | REAL |
| Risk Score Formula | Công thức toán học chuẩn hóa trọng số | Có | `riskEngine.js` | REAL |

---

## 9. User actions
| Action | Trigger | Result | Permission | Status |
|---|---|---|---|---|
| Mở form tạo phản ánh | Bấm [Tạo phản ánh ngay] | Chuyển tới `/citizen/report/new` | Public | WORKING |
| Khám phá bản đồ | Bấm [Xem bản đồ rủi ro] | Chuyển tới `/map` | Public | WORKING |
| Xem cổng tín chỉ | Bấm menu [Tín chỉ thanh niên] | Chuyển tới `/youth` | Public | WORKING |
| Xem kịch bản demo | Bấm [Kịch bản Demo] | Chuyển tới `/demo` | Public | WORKING |
| Đăng nhập tài khoản | Bấm [Đăng nhập] | Chuyển tới `/login` | Public | WORKING |

---

## 10. Primary action
- **Primary action**: `[Tạo phản ánh ngay]` ($ge 44	ext{px}$, đỏ son `#9f241f`)
- **Secondary**: `[Xem bản đồ rủi ro]`, `[Kịch bản Demo]`
- **Utility**: Chuyển đổi ngôn ngữ, điều hướng chân trang

---

## 11. Screen states
- **Loading state**: Hiển thị khung xương skeleton mượt mà trong khi nạp số liệu thống kê từ API D1.
- **Empty state**: Không áp dụng (Trang truyền thông tĩnh kết hợp hydration số liệu).
- **Error state**: Tự động fallback về số liệu kiểm toán đã chứng minh nếu mất kết nối API, đảm bảo trang không bao giờ bị trắng màn hình.
- **Success state**: Tải trang dưới 0.3s, chuẩn Core Web Vitals, zero layout shift (CLS = 0.000).

---

## 12. UI Copy (Chuẩn hóa Civic Copy tiếng Việt)
- **Page title**: DustGuard VN — Nền tảng giám sát bụi công trình
- **Short description**: Công nghệ công dân kết nối người dân, thanh niên và cơ quan quản lý vì bầu không khí trong lành.
- **Section headings**:
  - "Thực trạng bụi mịn tại các công trình đô thị"
  - "Chấm điểm rủi ro đa yếu tố chuẩn khoa học"
  - "Quy trình tác nghiệp 7 bước khép kín đa bên"
  - "Tích lũy giờ tình nguyện — Quy đổi tín chỉ sinh viên"
- **Button labels**: `[Tạo phản ánh ngay]`, `[Xem bản đồ]`, `[Kịch bản Demo]`, `[Đăng nhập]`

---

## 13. Text density budget (First Viewport)
- Page title: 6 từ ($le 8$ từ)
- Description: 18 từ ($le 20$ từ)
- Primary CTA: 3 từ ($le 3$ từ)
- Card titles: 3–5 từ ($le 7$ từ)
- Status badges: 2–3 từ ($le 5$ từ)
- **Đạt chuẩn SCAN > READ trong 5 giây đầu tiên.**

---

## 14. Responsibility boundary
- **Public User ĐƯỢC**: Xem toàn bộ nội dung truyền thông, mở bản đồ, tra cứu chứng chỉ QR, tạo phản ánh hiện trường.
- **Public User KHÔNG ĐƯỢC**: Can thiệp vào quy trình 7 bước, sửa đổi thông tin công trình, xóa nhật ký kiểm toán.

---

## 15. Dependencies & Data reality
- **Dependencies**: React 19, Tailwind CSS v4, Lucide Icons.
- **Data reality**: D1 SQLite SSOT. Zero mock trong các đường dẫn cốt lõi.
