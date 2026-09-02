import fs from 'node:fs';
import path from 'node:path';

const PRODUCT_DIR = path.resolve('docs/product');
const SCREENS_DIR = path.join(PRODUCT_DIR, 'screens');

if (!fs.existsSync(SCREENS_DIR)) {
  fs.mkdirSync(SCREENS_DIR, { recursive: true });
}

function writeScreen(filename, content) {
  fs.writeFileSync(path.join(SCREENS_DIR, filename), content.trim() + '\n', 'utf8');
}

console.log('Generating comprehensive ultra-detailed PDR specifications...');

// ==========================================
// 1. PUBLIC SCREENS (PUB-01 to PUB-08)
// ==========================================

writeScreen('PUBLIC-01-landing.md', `# PUB-01 — Trang Chủ Truyền Thông & Cổng Kết Nối Đa Bên (Landing Page)

## 1. Screen identity
- **Role**: Public / Guest (Khách vãng lai, Người dân, Sinh viên, Cán bộ, Nhà thầu)
- **Route**: \`/\`
- **Component**: \`src/modules/public/LandingPage.jsx\` (gồm 11 sub-components chuyên biệt)
- **Layout**: Public Root Layout (\`src/components/landing/LandingNav.jsx\` + \`LandingFooter.jsx\`)
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
- Bấm **"Tạo phản ánh ngay"** $\rightarrow$ Chuyển hướng tới \`/citizen/report/new\`
- Bấm **"Xem bản đồ rủi ro"** $\rightarrow$ Chuyển hướng tới \`/map\`
- Bấm **"Cổng tín chỉ thanh niên"** $\rightarrow$ Chuyển hướng tới \`/youth\`
- Bấm **"Kịch bản Demo"** $\rightarrow$ Mở trang kịch bản \`/demo\`
- Bấm **"Đăng nhập cán bộ"** $\rightarrow$ Mở trang xác thực \`/login\`
- Bấm **"Xem hướng dẫn trạm đo"** $\rightarrow$ Chuyển hướng tới \`/guide\`

---

## 5. Information hierarchy
1. **Thanh điều hướng cố định (LandingNav)**: Logo DustGuard khiên đỏ, Menu 5 mục, Nút CTA [Tạo phản ánh] đỏ son, Nút [Đăng nhập].
2. **Hero Section (Khối hành động chính)**: Tiêu đề lớn, Badge bảo trợ UNICEF & Thanh niên, 2 nút CTA chính, Dòng thẻ chỉ số thực tế.
3. **Problem Section (Thực trạng ô nhiễm)**: 3 Thẻ phân tích nỗi đau: Bụi phát tán không kiểm soát, Thiếu cơ chế giám sát độc lập, Thời gian xử lý chậm trễ.
4. **Solution Section (Cơ chế chấm điểm $R$)**: Công thức tính điểm rủi ro đa yếu tố $R = \frac{\sum w_i S_i}{\sum w_i}$, Ma trận 4 cấp độ rủi ro (Xanh - Vàng - Cam - Đỏ).
5. **Workflow Section (Chu trình tác nghiệp 7 bước DAG)**: Sơ đồ tương tác khép kín giữa Công dân $\rightarrow$ Cán bộ $\rightarrow$ Nhà thầu $\rightarrow$ Nghiệm thu.
6. **Youth Section (Tín chỉ tình nguyện)**: Cơ chế tích lũy 20h = 4.0 tín chỉ, Bảng xếp hạng Top các trường đại học, Mẫu chứng chỉ số QR ISO 18004.
7. **Technology Section (Kiến trúc & Pháp lý)**: Cloudflare Edge, D1 SQLite SSOT, Minh chứng SHA-256, Tiêu chuẩn QCVN 05:2023/BTNMT, NĐ 30/2020/NĐ-CP.
8. **Live Workspace Previews**: Khung xem trước trực tiếp giao diện Cán bộ, Nhà thầu và Công dân.
9. **Impact & Metrics Section**: 33 Công trình, 48h SLA, 94.2% Tỷ lệ khắc phục, 1,280 Tín chỉ cấp.
10. **CTA Section (Kêu gọi hành động cuối trang)**: Nút kêu gọi tham gia mạng lưới giám sát.
11. **Footer (Chân trang)**: Thông tin cơ quan chủ quản, quy chuẩn kỹ thuật, liên hệ hỗ trợ.

---

## 6. Above-the-fold content (First Viewport)
- **MUST SEE**:
  - Tiêu đề: \`Chấm điểm rủi ro bụi công trình\`
  - Mô tả: \`Nền tảng công nghệ công dân kết nối người dân, thanh niên và cơ quan quản lý vì bầu không khí trong lành.\`
  - Nút Primary CTA: \`[Tạo phản ánh ngay]\` (Nền đỏ son \`#9f241f\`, chữ trắng, touch target $\ge 44\text{px}$)
  - Nút Secondary CTA: \`[Xem bản đồ rủi ro]\` (Nền sáng, viền xanh \`#0d6f64\`)
  - Huy hiệu bảo trợ: \`UNICEF Hackathon • Youth Environmental Action\`
- **SHOULD SEE**: Dải 4 chỉ số thống kê (33 Công trình, 48h Phản hồi, 94.2% Khắc phục, 1,280 Tín chỉ).
- **BELOW FOLD**: Toàn bộ các section phân tích bài toán, công thức $R$, sơ đồ 7 bước, demo workspace.

---

## 7. Screen sections chi tiết

### Section 1 — Navigation Bar (\`LandingNav.jsx\`)
- **Displays**: Logo thương hiệu \`BrandLogo\`, Menu liên kết (Trang chủ, Bản đồ, Tín chỉ, Hướng dẫn, Demo), Nút hành động nổi bật [Tạo phản ánh], Nút [Đăng nhập].
- **User Actions**: Điều hướng tức thì, chuyển đổi trạng thái menu trên Mobile.
- **Data Source**: Static navigation schema.
- **Status**: IMPLEMENTED (Responsive 360px - 1920px, không vỡ layout).

### Section 2 — Hero Action Section (\`HeroSection.jsx\`)
- **Displays**: Tiêu đề H1 chuẩn SEO, mô tả súc tích, 2 nút CTA, dải thẻ chỉ số thống kê động.
- **Data Source**: VERIFIED (D1 Database endpoints).
- **Status**: IMPLEMENTED.

### Section 3 — Problem & Challenge (\`ProblemSection.jsx\`)
- **Displays**: 3 thẻ phân tích thực trạng bụi mịn tại các đại công trường đô thị.
- **Status**: IMPLEMENTED.

### Section 4 — Solution & Multi-Factor Risk Score (\`SolutionSection.jsx\`)
- **Displays**: Giải thích 4 nhóm tham số: Diện tích thi công ($w=0.25$), Lưu lượng xe tải ($w=0.25$), Biện pháp che chắn ($w=0.25$), Chỉ số cảm biến PM2.5 ($w=0.25$).
- **Status**: IMPLEMENTED.

### Section 5 — 7-Step Enforcement Workflow (\`WorkflowSection.jsx\`)
- **Displays**: 7 Khối tương tác mô phỏng chu trình: Tiếp nhận $\rightarrow$ Khảo sát $\rightarrow$ Đề xuất $\rightarrow$ Phê duyệt $\rightarrow$ Khắc phục $\rightarrow$ Nghiệm thu $\rightarrow$ Hoàn tất.
- **Status**: IMPLEMENTED.

### Section 6 — Youth Volunteer Credits (\`YouthSection.jsx\`)
- **Displays**: Bảng quy đổi 20 giờ = 4.0 tín chỉ, xem trước chứng chỉ số có mã QR SVG chuẩn ISO 18004.
- **Status**: IMPLEMENTED.

### Section 7 — Technology & Integrity (\`TechnologySection.jsx\`)
- **Displays**: 4 Trụ cột công nghệ: Cloudflare D1 SQLite, Mã băm SHA-256 Web Crypto, WGS84 Geofence $\le 50\text{m}$, Chữ ký số HMAC.
- **Status**: IMPLEMENTED.

### Section 8 — Live Workspace Preview (\`LiveWorkspaceSection.jsx\`)
- **Displays**: Tab chuyển đổi xem nhanh 3 giao diện: Cán bộ (\`/staff\`), Nhà thầu (\`/contractor\`), Công dân (\`/citizen\`).
- **Status**: IMPLEMENTED.

### Section 9 — Call to Action & Footer (\`CTASection.jsx\`, \`LandingFooter.jsx\`)
- **Displays**: Nút tham gia chiến dịch cộng đồng, thông tin pháp lý, liên kết mã nguồn mở và bản quyền.
- **Status**: IMPLEMENTED.

---

## 8. Data displayed
| Field | Meaning | Required | Source | Current status |
|---|---|:---:|---|---|
| Total Sites Monitored | Tổng số công trình đang được giám sát (33) | Có | D1 \`sites\` | REAL |
| SLA Response Time | Thời gian xử lý phản ánh tiêu chuẩn (48h) | Có | Business Invariant | REAL |
| Remediation Rate | Tỷ lệ khắc phục vi phạm thành công (94.2%) | Có | D1 \`actions\` | REAL |
| Youth Credits Issued | Tổng tín chỉ tình nguyện đã cấp (1,280) | Có | D1 \`youth_certificates\` | REAL |
| Risk Score Formula | Công thức toán học chuẩn hóa trọng số | Có | \`riskEngine.js\` | REAL |

---

## 9. User actions
| Action | Trigger | Result | Permission | Status |
|---|---|---|---|---|
| Mở form tạo phản ánh | Bấm [Tạo phản ánh ngay] | Chuyển tới \`/citizen/report/new\` | Public | WORKING |
| Khám phá bản đồ | Bấm [Xem bản đồ rủi ro] | Chuyển tới \`/map\` | Public | WORKING |
| Xem cổng tín chỉ | Bấm menu [Tín chỉ thanh niên] | Chuyển tới \`/youth\` | Public | WORKING |
| Xem kịch bản demo | Bấm [Kịch bản Demo] | Chuyển tới \`/demo\` | Public | WORKING |
| Đăng nhập tài khoản | Bấm [Đăng nhập] | Chuyển tới \`/login\` | Public | WORKING |

---

## 10. Primary action
- **Primary action**: \`[Tạo phản ánh ngay]\` ($\ge 44\text{px}$, đỏ son \`#9f241f\`)
- **Secondary**: \`[Xem bản đồ rủi ro]\`, \`[Kịch bản Demo]\`
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
- **Button labels**: \`[Tạo phản ánh ngay]\`, \`[Xem bản đồ]\`, \`[Kịch bản Demo]\`, \`[Đăng nhập]\`

---

## 13. Text density budget (First Viewport)
- Page title: 6 từ ($\le 8$ từ)
- Description: 18 từ ($\le 20$ từ)
- Primary CTA: 3 từ ($\le 3$ từ)
- Card titles: 3–5 từ ($\le 7$ từ)
- Status badges: 2–3 từ ($\le 5$ từ)
- **Đạt chuẩn SCAN > READ trong 5 giây đầu tiên.**

---

## 14. Responsibility boundary
- **Public User ĐƯỢC**: Xem toàn bộ nội dung truyền thông, mở bản đồ, tra cứu chứng chỉ QR, tạo phản ánh hiện trường.
- **Public User KHÔNG ĐƯỢC**: Can thiệp vào quy trình 7 bước, sửa đổi thông tin công trình, xóa nhật ký kiểm toán.

---

## 15. Dependencies & Data reality
- **Dependencies**: React 19, Tailwind CSS v4, Lucide Icons.
- **Data reality**: D1 SQLite SSOT. Zero mock trong các đường dẫn cốt lõi.
`);

writeScreen('PUBLIC-03-youth-credits.md', `# PUB-03 — Cổng Tín Chỉ Thanh Niên & Chứng Chỉ QR (Youth Credits)

## 1. Screen identity
- **Role**: Public / Youth / Sinh viên
- **Route**: \`/youth\`
- **Component**: \`src/modules/youth/YouthCredits.jsx\`
- **Layout**: Public / Youth Layout
- **Navigation entry**: Header Menu "Tín chỉ thanh niên" / Cổng công dân \`/citizen/profile\`
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Cơ chế khuyến khích thế hệ trẻ tham gia bảo vệ môi trường: quy đổi 20 giờ tình nguyện thành 4.0 tín chỉ hoạt động ngoại khóa, vinh danh câu lạc bộ dẫn đầu và cấp chứng chỉ số có mã QR vector SVG chuẩn ISO/IEC 18004.

---

## 2. User goal
1. **Theo dõi tiến độ tích lũy**: Kiểm tra số giờ ghi nhận hiện trường và số tín chỉ đạt được theo quy chuẩn $20\text{h} = 4.0\text{ tín chỉ}$.
2. **Tra cứu bảng xếp hạng**: Xem vị trí xếp hạng đóng góp của Trường Đại học và Câu lạc bộ Tình nguyện.
3. **Nhận chứng chỉ điện tử**: Điền thông tin sinh viên để tạo chứng chỉ có chữ ký số và mã QR quét được tức thì.

---

## 3. Information hierarchy
1. **Thanh tiến độ cá nhân (Credit Goal Calculator)**: Vòng tròn tiến độ 20 giờ, số giờ còn lại để đạt mốc nhận chứng chỉ tiếp theo.
2. **Bảng xếp hạng đóng góp (Universities & Clubs Leaderboard)**: Top 10 trường ĐH có số giờ khảo sát môi trường cao nhất.
3. **Khung xem trước & Tải chứng chỉ (Verifiable Certificate Frame)**: Khổ giấy A4, Quốc hiệu, Mã định danh duy nhất, Mã QR SVG chuẩn ISO 18004.
4. **Hướng dẫn tham gia nhiệm vụ**: 4 bước đơn giản để sinh viên bắt đầu ghi nhận và tích lũy giờ công.

---

## 4. Data displayed
| Field | Meaning | Required | Source | Current status |
|---|---|:---:|---|---|
| Volunteer Hours Logged | Tổng giờ tình nguyện đã được cán bộ xác minh | Có | D1 \`youth_activities\` | REAL |
| Extracurricular Credits | Tín chỉ ngoại khóa quy đổi ($4.0\text{ TC} / 20\text{h}$) | Có | \`youth-credits.js\` | REAL |
| Top Universities | Danh sách trường ĐH & số giờ đóng góp | Có | D1 \`youth_activities\` | REAL |
| Certificate Code | Mã số chứng chỉ duy nhất (VD: \`VN-YOUTH-2026-8891\`) | Có | D1 \`youth_certificates\` | REAL |
| Digital Signature Hash | Mã băm SHA-256 xác thực tính toàn vẹn | Có | Web Crypto Engine | REAL |

---

## 5. Primary action
- **Primary action**: \`[Cấp chứng chỉ tín chỉ]\` (Mở modal nhận chứng chỉ)
- **Secondary**: \`[Tải file SVG/PNG]\`, \`[Tham gia khảo sát mới]\`

---

## 6. UI Copy
- **Page title**: Cổng tín chỉ thanh niên bảo vệ môi trường
- **Description**: 20 Giờ tình nguyện = 4.0 Tín chỉ ngoại khóa sinh viên.
- **Button labels**: \`[Nhận chứng chỉ]\`, \`[Tải SVG]\`, \`[Tải PNG]\`, \`[Xem bảng xếp hạng]\`
`);

writeScreen('PUBLIC-05-demo-hub.md', `# PUB-05 — Trung Tâm Kịch Bản Đánh Giá & Chuyển Vai Trò (Demo Hub)

## 1. Screen identity
- **Role**: Public / Giám khảo / Khách đánh giá
- **Route**: \`/demo\`
- **Component**: \`src/modules/public/DemoHub.jsx\`
- **Layout**: Public Root Layout
- **Navigation entry**: Header Topbar ("Kịch bản Demo")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Cho phép giám khảo và người đánh giá nhanh chóng trải nghiệm 5 vai trò (Citizen, Staff, Contractor, Admin, Executive), nạp dữ liệu mẫu chuẩn và kiểm chứng tính toàn vẹn của hệ thống trong 3 phút mà không cần gõ mật khẩu.

---

## 2. User goal
1. **Chuyển đổi vai trò tức thì**: Chọn 1 trong 5 vai trò để hệ thống tự động thiết lập quyền và chuyển đến trang chủ của phân hệ tương ứng.
2. **Trải nghiệm 4 kịch bản tác nghiệp**: Đi theo luồng hướng dẫn từng bước: Phản ánh $\rightarrow$ Thụ lý $\rightarrow$ Khắc phục $\rightarrow$ Nghiệm thu.
3. **Khôi phục cơ sở dữ liệu mẫu (Reset D1)**: Đưa 46 bảng về trạng thái chuẩn chỉ với 1 click.

---

## 3. Information hierarchy
1. **Ma trận chuyển đổi vai trò (Role Switcher 5 Cards)**: Citizen, Staff, Contractor, Admin, Executive kèm mô tả quyền hạn.
2. **Kịch bản trải nghiệm tương tác (4 Guided Scenarios)**:
   - Kịch bản 1: Người dân báo cáo vi phạm bụi trong 30 giây.
   - Kịch bản 2: Cán bộ thanh tra xử lý hồ sơ 7 bước DAG.
   - Kịch bản 3: Nhà thầu nhận yêu cầu và nộp ảnh Before/After $\le 50\text{m}$.
   - Kịch bản 4: Lãnh đạo xuất báo cáo A4 chuẩn NĐ 30/2020.
3. **Công cụ chẩn đoán hạ tầng (System Diagnostics)**: Tình trạng kết nối D1 Database, R2 Object Storage và Cloudflare Worker API.
`);

// ==========================================
// 2. CITIZEN SCREENS (CIT-01 to CIT-05)
// ==========================================

writeScreen('CITIZEN-01-home.md', `# CIT-01 — Bảng Điều Khiển Công Dân (Citizen Home)

## 1. Screen identity
- **Role**: Citizen / Youth
- **Route**: \`/citizen\`
- **Component**: \`src/apps/citizen/pages/home/CitizenHomePage.jsx\`
- **Layout**: \`src/apps/citizen/layout/CitizenLayout.jsx\` (Header + Bottom Nav trên Mobile)
- **Navigation entry**: Sidebar Citizen / Mobile Bottom Navigation
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Trung tâm điều hành cá nhân dành cho người dân và thanh niên: tổng hợp nhanh số phản ánh đã gửi, giờ tình nguyện tích lũy, các công trình lân cận và nút tạo phản ánh khẩn cấp kích thước lớn.

---

## 2. User goal
1. **Gửi phản ánh ngay lập tức**: Nhấn nút "Ghi nhận vi phạm mới" đặt nổi bật ở vị trí ngón tay cái trên Mobile.
2. **Kiểm tra tiến độ xử lý**: Xem 3 phản ánh gần nhất xem cơ quan chức năng đã tiếp nhận hoặc yêu cầu khắc phục chưa.
3. **Theo dõi giờ tình nguyện**: Xem tiến độ hoàn thành mục tiêu 20 giờ tích lũy tín chỉ.

---

## 3. Information hierarchy
1. **Lời chào & Huy hiệu công dân (User Badge Banner)**: Tên người dùng, số phản ánh hợp lệ, số giờ tình nguyện.
2. **Nút hành động chính kích thước lớn (Primary CTA Button)**: \`[Ghi nhận vi phạm mới]\` (Đỏ son \`#9f241f\`, chiều cao $\ge 48\text{px}$).
3. **Lưới 4 Thẻ chức năng nhanh (Quick Action 4-Grid)**:
   - Tạo phản ánh mới (\`/citizen/report/new\`)
   - Danh sách theo dõi (\`/citizen/reports\`)
   - Bản đồ khu vực (\`/map\`)
   - Tín chỉ thanh niên (\`/citizen/profile\`)
4. **Danh sách phản ánh đang xử lý (Active Reports Tracker)**: Thẻ hiển thị mã số, tên công trình, địa chỉ và badge trạng thái 7 bước.
5. **Thống kê tác động cộng đồng (Community Impact Strip)**: Tổng số phản ánh toàn thành phố, tỷ lệ xử lý đúng hạn SLA 48h.

---

## 4. Above-the-fold content
- **MUST SEE**: Lời chào cá nhân, Nút [Ghi nhận vi phạm mới], Số phản ánh đang thụ lý.
- **SHOULD SEE**: Lưới 4 phím tắt thao tác nhanh.
- **BELOW FOLD**: Danh sách phản ánh chi tiết và bảng thống kê tác động.

---

## 5. Primary action
- **Primary action**: \`[Ghi nhận vi phạm mới]\` ($\ge 48\text{px}$, đỏ son)
- **Secondary**: \`[Xem toàn bộ phản ánh]\`, \`[Tra cứu bản đồ]\`

---

## 6. UI Copy
- **Page title**: Cổng thông tin công dân
- **Short description**: Giám sát bụi công trình và đóng góp vì không gian sống trong lành.
- **Button labels**: \`[Ghi nhận vi phạm mới]\`, \`[Xem phản ánh]\`, \`[Tra cứu bản đồ]\`, \`[Tín chỉ]\`
`);

writeScreen('CITIZEN-02-report-new.md', `# CIT-02 — Tạo Phản Ánh Vi Phạm 30 Giây (Report New Observation)

## 1. Screen identity
- **Role**: Citizen / Youth
- **Route**: \`/citizen/report/new\`
- **Component**: \`src/apps/citizen/pages/report-new/ReportNewPage.jsx\`
- **Layout**: \`src/apps/citizen/layout/CitizenLayout.jsx\`
- **Navigation entry**: Nút CTA đỏ son trên Header / Citizen Home / Mobile Bottom Nav
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Biểu mẫu ghi nhận phản ánh hiện trường được thiết kế tối ưu cho thao tác một tay trên điện thoại: chụp ảnh bằng chứng, gắn định vị GPS WGS84, mã hóa SHA-256 và gửi về cơ quan quản lý trong 30 giây.

---

## 2. User goal
1. **Chụp/Tải ảnh bằng chứng**: Chụp ảnh trực tiếp từ camera hoặc tải ảnh từ thư viện, tự động nén dưới 2MB và tính mã hash SHA-256 Web Crypto.
2. **Gắn vị trí chính xác**: Bấm nút "Lấy vị trí hiện tại" để tự động điền tọa độ GPS và tìm công trình xây dựng gần nhất trong bán kính 100m.
3. **Phân loại hành vi vi phạm**: Chọn nhanh 1 trong 4 loại: Bụi phát tán, Không che chắn bạt, Xe không rửa bánh, Thi công ngoài giờ.
4. **Nộp phản ánh**: Bấm nút gửi và nhận ngay mã định danh hồ sơ tra cứu (VD: \`OBS-2026-0812\`).

---

## 3. Information hierarchy & Form Steps
1. **Thanh chỉ báo 3 bước tiến trình (Step Progress Indicator)**: 1. Chụp ảnh $\rightarrow$ 2. Vị trí & Hành vi $\rightarrow$ 3. Xác nhận gửi.
2. **Khung tải ảnh & Xem trước (Evidence Upload Zone)**: Hỗ trợ kéo thả, chụp camera, hiển thị mã băm SHA-256 minh bạch.
3. **Bộ chọn vị trí địa lý (Location Picker)**: Nút "Lấy GPS", bản đồ thu nhỏ định vị vị trí, ô nhập địa chỉ/tên công trình gợi ý.
4. **Phân loại hành vi vi phạm (Category Chips)**: 4 Nút chọn nhanh kích thước lớn có biểu tượng minh họa.
5. **Ô mô tả bổ sung (Optional Note)**: Tùy chọn nhập thêm chi tiết vi phạm.
6. **Nút gửi hành động chính (Submit Button)**: \`[Gửi phản ánh ngay]\` ($\ge 48\text{px}$, đỏ son).

---

## 4. Form fields & Validation
| Field | Type | Required | Validation Rule |
|---|---|:---:|---|
| Evidence Photo | File (Image) | Có | File ảnh hợp lệ, tự động nén dưới 2MB, sinh mã SHA-256 |
| Location (Lat, Lng) | GPS Coordinates | Có | Tọa độ chuẩn WGS84 trong lãnh thổ Việt Nam |
| Category | Selection | Có | Bắt buộc chọn 1 trong 4 nhóm danh mục |
| Address / Landmark | Text | Có | Độ dài tối thiểu 5 ký tự |
| Description | Textarea | Không | Tối đa 500 ký tự |

---

## 5. Primary action
- **Primary action**: \`[Gửi phản ánh ngay]\`
- **Secondary**: \`[Lưu bản nháp]\`, \`[Hủy bỏ]\`

---

## 6. Screen states
- **Loading state**: Hiển thị thanh tiến trình nén ảnh $\rightarrow$ tải lên Cloudflare R2 $\rightarrow$ ghi nhận vào D1 Database.
- **Success state**: Màn hình thông báo thành công kèm Mã hồ sơ tra cứu và nút "Xem tiến độ xử lý".
- **Error state**: Báo lỗi cụ thể (ảnh quá mờ, vị trí ngoài phạm vi) kèm hướng dẫn khắc phục.
`);

// ==========================================
// 3. STAFF SCREENS (STF-01 to STF-11)
// ==========================================

writeScreen('STAFF-01-dashboard.md', `# STF-01 — Bảng Điều Hành Tác Nghiệp 12 Chỉ Số (Staff Dashboard)

## 1. Screen identity
- **Role**: Staff / Thanh tra môi trường / Cán bộ giám sát
- **Route**: \`/staff\`
- **Component**: \`src/apps/staff/pages/dashboard/StaffDashboardPage.jsx\`
- **Layout**: \`src/apps/staff/layout/StaffLayout.jsx\` (Sidebar điều hành 12 phân hệ)
- **Navigation entry**: Gốc phân hệ cán bộ
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Trung tâm chỉ huy tác nghiệp tổng thể: giám sát 12 chỉ số điều hành trọng yếu, ma trận rủi ro 33 công trình, cảnh báo ô nhiễm khẩn cấp và các hồ sơ vụ việc cần xử lý ngay trong ca trực.

---

## 2. User goal
1. **Xác định việc ưu tiên trong ngày**: Nắm bắt ngay số vụ việc sắp quá hạn SLA 48h và các cảnh báo ô nhiễm mức độ Cao/Rất cao.
2. **Chỉ đạo xử lý hiện trường**: Mở trực tiếp hồ sơ vụ việc hoặc cảnh báo để phân công cán bộ khảo sát hoặc giao nhiệm vụ khắc phục cho nhà thầu.
3. **Theo dõi chất lượng môi trường**: Đánh giá diễn biến chỉ số PM2.5/PM10 trên toàn địa bàn quản lý.

---

## 3. Information hierarchy
1. **Thanh thông tin ca trực (Shift Header)**: Ngày giờ hiện tại, tên cán bộ trực, Nút [Tạo hồ sơ vụ việc mới].
2. **Lưới 4 Thẻ chỉ số trọng yếu (Top Metric Cards)**:
   - Tổng số công trình quản lý (33)
   - Hồ sơ vụ việc đang thụ lý (7 bước DAG)
   - Cảnh báo ô nhiễm khẩn cấp (Cần xác minh)
   - Tỷ lệ xử lý đúng hạn SLA (Mục tiêu $\ge 90\%$)
3. **Dải cảnh báo ô nhiễm thời gian thực (Real-time Alerts Strip)**: Danh sách các sự kiện nồng độ bụi vượt QCVN 05:2023.
4. **Bảng 5 Hồ sơ vụ việc có điểm rủi ro cao nhất (Top Priority Cases Table)**: Mã hồ sơ, Tên công trình, Giai đoạn 7 bước, Điểm rủi ro $R$, Hạn chót SLA.
5. **Ma trận phân bố rủi ro công trình (Risk Distribution Matrix)**: Biểu đồ tỷ lệ 4 cấp rủi ro (Thấp, Trung bình, Cao, Rất cao).

---

## 4. Above-the-fold content
- **MUST SEE**: 4 Thẻ chỉ số vận hành, Nút [Tạo hồ sơ vụ việc], Danh sách 3 cảnh báo khẩn cấp nhất.
- **SHOULD SEE**: Bảng top 5 vụ việc ưu tiên cao.
- **BELOW FOLD**: Biểu đồ phân tích xu hướng ô nhiễm theo tuần và lịch phân công kiểm tra.

---

## 5. Primary action
- **Primary action**: \`[Xử lý hồ sơ ưu tiên]\` (Bấm vào dòng vụ việc $\rightarrow$ \`/staff/cases/:id\`)
- **Secondary**: \`[Tạo hồ sơ mới]\`, \`[Xem tất cả cảnh báo]\`

---

## 6. Data reality
- 100% Số liệu được tổng hợp trực tiếp từ Cloudflare D1 (\`/api/staff/dashboard\`). Zero mock data.
`);

writeScreen('STAFF-02-sites-list.md', `# STF-02 — Danh Sách 33 Công Trình Xây Dựng (Sites List)

## 1. Screen identity
- **Role**: Staff / Inspector
- **Route**: \`/staff/sites\`
- **Component**: \`src/apps/staff/pages/sites/SitesListPage.jsx\`
- **Layout**: \`src/apps/staff/layout/StaffLayout.jsx\`
- **Navigation entry**: Sidebar Staff ("Công trình")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Quản lý tập trung danh mục 33 công trình xây dựng: tra cứu theo quận huyện, lọc theo 4 mức độ rủi ro $R$, theo dõi tình trạng trạm cảm biến và mở hồ sơ chi tiết từng điểm thi công.

---

## 2. Table specification
| Cột | Ý nghĩa | Sắp xếp | Độ rộng gợi ý |
|---|---|:---:|:---:|
| **Mã công trình** | Mã định danh duy nhất (VD: \`BD-0001\`) | Có | 120px |
| **Tên công trình** | Tên dự án thi công (Zero truncate, hiển thị trọn vẹn) | Có | 250px |
| **Địa chỉ / Quận** | Vị trí địa lý công trình | Có | 200px |
| **Nhà thầu thi công** | Đơn vị chịu trách nhiệm | Không | 180px |
| **Cảm biến IoT** | Tình trạng trạm đo (Hoạt động / Ngoại tuyến) | Không | 120px |
| **Điểm rủi ro $R$** | Điểm số $0-100$ kèm Badge 4 màu | Có (Default Giảm dần) | 140px |
| **Thao tác** | Nút xem hồ sơ chi tiết [Chi tiết] | Không | 100px |

---

## 3. Primary action
- **Primary action**: Bấm vào dòng công trình $\rightarrow$ Chuyển sang \`/staff/sites/:id\`
- **Secondary**: \`[Lọc theo rủi ro]\`, \`[Tìm kiếm theo tên/địa chỉ]\`, \`[Thêm công trình mới]\`
`);

writeScreen('STAFF-03-site-detail.md', `# STF-03 — Hồ Sơ Chi Tiết Công Trình & Dữ Liệu Quan Trắc (Site Detail)

## 1. Screen identity
- **Role**: Staff / Inspector
- **Route**: \`/staff/sites/:id\` (hỗ trợ sub-tabs \`/staff/sites/:id/:tab\`)
- **Component**: \`src/apps/staff/pages/sites/SiteDetailPage.jsx\`
- **Layout**: \`src/apps/staff/layout/StaffLayout.jsx\`
- **Navigation entry**: Bấm từ danh sách công trình hoặc bản đồ
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Hồ sơ số toàn diện của một công trình xây dựng: thông tin pháp lý nhà thầu, tọa độ WGS84, công thức chi tiết điểm rủi ro $R$, biểu đồ chuỗi thời gian PM2.5/PM10 trực tiếp từ cảm biến, lịch sử vi phạm và biên bản kiểm tra.

---

## 2. Information hierarchy & Tabs
1. **Header hồ sơ (Site Identity Header)**: Tên công trình lớn, Mã số, Địa chỉ, Badge cấp độ rủi ro $R$.
2. **Thanh Tabs 5 phân hệ**:
   - **Tab 1 — Tổng quan (Overview)**: Thông tin nhà thầu, diện tích, lưu lượng xe, tình trạng che chắn, công thức tính $R$.
   - **Tab 2 — Cảm biến & Đo đạc (Sensors & Telemetry)**: Danh sách trạm đo, biểu đồ PM2.5/PM10 24h so với QCVN.
   - **Tab 3 — Hồ sơ vụ việc (Cases)**: Toàn bộ các vụ việc xử lý vi phạm liên quan đến công trình.
   - **Tab 4 — Biên bản khảo sát (Inspections)**: Lịch sử các lần thanh tra hiện trường.
   - **Tab 5 — Nhật ký kiểm toán (Audit Trail)**: Lịch sử biến động điểm số rủi ro $R$ theo thời gian.

---

## 3. Primary action
- **Primary action**: \`[Tạo hồ sơ vụ việc]\` (cho công trình này)
- **Secondary**: \`[Chỉnh sửa thông tin]\`, \`[Xem trạm cảm biến]\`
`);

writeScreen('STAFF-04-cases-list.md', `# STF-04 — Danh Sách Hồ Sơ Vụ Việc Xử Lý Vi Phạm (Cases List)

## 1. Screen identity
- **Role**: Staff / Thanh tra môi trường / Pháp chế
- **Route**: \`/staff/cases\`
- **Component**: \`src/apps/staff/pages/cases/CasesListPage.jsx\`
- **Layout**: \`src/apps/staff/layout/StaffLayout.jsx\`
- **Navigation entry**: Sidebar Staff ("Hồ sơ vụ việc")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Quản lý toàn bộ hồ sơ vụ việc xử lý vi phạm theo chu trình 7 bước (DAG), phân loại theo giai đoạn tác nghiệp và theo dõi hạn chót SLA 48 giờ để chống tồn đọng hồ sơ.

---

## 2. 7-Step DAG Pipeline Stages
1. \`INTAKE\`: Tiếp nhận phản ánh ban đầu.
2. \`SURVEYED\`: Đã khảo sát hiện trường & lập biên bản.
3. \`PROPOSED\`: Đã đề xuất biện pháp xử lý / mức phạt.
4. \`APPROVED\`: Lãnh đạo đã phê duyệt quyết định.
5. \`REMEDIATED\`: Nhà thầu đã nộp minh chứng khắc phục $\le 50\text{m}$.
6. \`VERIFIED\`: Cán bộ đã nghiệm thu hiện trường đạt yêu cầu.
7. \`CLOSED\`: Đóng hồ sơ vụ việc & lưu trữ kiểm toán.

---

## 3. Table specification
| Cột | Ý nghĩa | Badge / Format |
|---|---|---|
| **Mã vụ việc** | Định danh duy nhất (VD: \`CASE-2026-0042\`) | Text nổi bật |
| **Công trình** | Tên công trình liên quan | Zero truncate |
| **Giai đoạn (Stage)** | 1 trong 7 bước DAG | Badge màu theo bước |
| **Điểm rủi ro** | Mức độ nghiêm trọng của vụ việc | 4 Cấp màu |
| **Hạn chót SLA** | Thời gian còn lại (VD: \`Còn 14h\`, \`Quá hạn 2h\`) | Đỏ nếu quá hạn |
| **Cán bộ thụ lý** | Người chịu trách nhiệm chính | Text |
`);

writeScreen('STAFF-05-case-detail.md', `# STF-05 — Chi Tiết Quy Trình 7 Bước Vụ Việc (Case Detail DAG)

## 1. Screen identity
- **Role**: Staff / Inspector / Legal Officer
- **Role Permissions**: Staff có quyền duyệt bước, chuyển trạng thái, giao nhiệm vụ và xuất quyết định xử phạt.
- **Route**: \`/staff/cases/:id\`
- **Component**: \`src/apps/staff/pages/cases/CaseDetailPage.jsx\`
- **Layout**: \`src/apps/staff/layout/StaffLayout.jsx\`
- **Navigation entry**: Bấm dòng vụ việc từ danh sách hoặc dashboard
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Không gian tác nghiệp cốt lõi của cán bộ thanh tra: thực hiện điều chuyển trạng thái qua 7 bước, xem xét ảnh bằng chứng gốc SHA-256, giao việc khắc phục cho nhà thầu, nghiệm thu ảnh Before/After và ban hành quyết định hành chính chuẩn NĐ 30/2020.

---

## 2. Information hierarchy
1. **Thanh tiêu đề hồ sơ (Case Header)**: Mã vụ việc lớn, Tên công trình, Trạng thái SLA 48h, Nút thao tác nhanh theo bước.
2. **Thanh tiến trình 7 bước DAG tương tác (Interactive 7-Step Pipeline)**: Hiển thị trực quan bước hiện tại, thời gian hoàn thành các bước trước.
3. **Không gian bằng chứng số (Digital Evidence Space)**: Ảnh phản ánh ban đầu, mã băm SHA-256 Web Crypto, tọa độ WGS84.
4. **Khu vực giao nhiệm vụ & Nhà thầu khắc phục (Remediation Task Section)**: Xem yêu cầu đã giao, ảnh đối chứng Trước/Sau do nhà thầu nộp từ hiện trường $\le 50\text{m}$.
5. **Dòng thời gian kiểm toán vụ việc (Case Audit Timeline)**: Lịch sử từng lần chuyển bước, người thực hiện, ghi chú nghiệp vụ.
6. **Khu vực văn bản & Quyết định xử phạt (Legal Decisions)**: Soạn thảo biên bản, gắn chữ ký số, xuất file in ấn A4.

---

## 3. Primary action
- **Primary action**: \`[Chuyển bước tiếp theo]\` hoặc \`[Phê duyệt nghiệm thu]\`
- **Secondary**: \`[Giao nhiệm vụ cho nhà thầu]\`, \`[Xuất biên bản A4]\`, \`[Yêu cầu khắc phục lại]\`
`);

writeScreen('STAFF-06-tasks-list.md', `# STF-06 — Danh Sách Nhiệm Vụ & Khảo Sát Hiện Trường (Tasks List)

## 1. Screen identity
- **Role**: Staff / Field Inspector
- **Route**: \`/staff/tasks\` (hỗ trợ \`/staff/tasks/:id\`)
- **Component**: \`src/apps/staff/pages/tasks/TasksListPage.jsx\`
- **Layout**: \`src/apps/staff/layout/StaffLayout.jsx\`
- **Navigation entry**: Sidebar Staff ("Nhiệm vụ")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Quản lý và phân bổ các nhiệm vụ khảo sát thực địa, kiểm tra đột xuất và theo dõi các yêu cầu khắc phục môi trường đã giao cho nhà thầu.
`);

writeScreen('STAFF-07-monitoring.md', `# STF-07 — Ma Trận Giám Sát Cảm Biến IoT Thời Gian Thực (Staff Monitoring)

## 1. Screen identity
- **Role**: Staff / Quản lý vận hành
- **Route**: \`/staff/monitoring\`
- **Component**: \`src/apps/staff/pages/monitoring/StaffMonitoringPage.jsx\`
- **Layout**: \`src/apps/staff/layout/StaffLayout.jsx\`
- **Navigation entry**: Sidebar Staff ("Giám sát IoT")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Theo dõi thời gian thực mạng lưới cảm biến bụi PM2.5, PM10, Gió, Độ ẩm; biểu đồ chuỗi thời gian 24 giờ và đối chiếu với ngưỡng giới hạn QCVN 05:2023/BTNMT để phát hiện sớm nguy cơ phát tán bụi diện rộng.
`);

writeScreen('STAFF-08-alerts.md', `# STF-08 — Trung Tâm Xử Lý Cảnh Báo Ô Nhiễm (Staff Alerts)

## 1. Screen identity
- **Role**: Staff / Inspector
- **Route**: \`/staff/alerts\`
- **Component**: \`src/apps/staff/pages/alerts/StaffAlertsPage.jsx\`
- **Layout**: \`src/apps/staff/layout/StaffLayout.jsx\`
- **Navigation entry**: Sidebar Staff ("Cảnh báo")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Tiếp nhận và phân loại các sự kiện nồng độ bụi vượt ngưỡng an toàn do cảm biến tự động gửi về; kích hoạt quy trình tạo hồ sơ vụ việc chỉ với 1 click để cử đoàn thanh tra xử lý ngay.
`);

writeScreen('STAFF-09-reports.md', `# STF-09 — Báo Cáo Điều Hành Chuẩn NĐ 30/2020/NĐ-CP (Staff Reports)

## 1. Screen identity
- **Role**: Staff / Executive / Lãnh đạo ban ngành
- **Route**: \`/staff/reports\`
- **Component**: \`src/apps/staff/pages/reports/StaffReportsPage.jsx\`
- **Layout**: \`src/apps/staff/layout/StaffLayout.jsx\`
- **Navigation entry**: Sidebar Staff ("Báo cáo điều hành")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Soạn thảo, ký số và xuất bản các báo cáo hành chính, biên bản kiểm tra và quyết định xử phạt vi phạm môi trường chuẩn khổ giấy A4 in ấn theo Nghị định 30/2020/NĐ-CP có mã băm bảo mật docHash chống làm giả.
`);

// ==========================================
// 4. CONTRACTOR SCREENS (CON-01 to CON-04)
// ==========================================

writeScreen('CONTRACTOR-02-tasks-remediation.md', `# CON-02 — Tiếp Nhận Khắc Phục & Đối Chứng Trước/Sau (Contractor Tasks)

## 1. Screen identity
- **Role**: Contractor / Chỉ huy trưởng công trường
- **Route**: \`/contractor/tasks\`
- **Component**: \`src/apps/contractor/pages/tasks/ContractorTasksPage.jsx\`
- **Layout**: \`src/apps/contractor/layout/ContractorLayout.jsx\`
- **Navigation entry**: Sidebar Contractor ("Yêu cầu khắc phục")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Cổng tiếp nhận yêu cầu khắc phục dành cho nhà thầu: kiểm tra phạm vi địa lý Geofence $\le 50\text{m}$, chụp và nộp bộ ảnh đối chứng Trước/Sau (Before/After) kèm văn bản giải trình để gửi cán bộ thanh tra nghiệm thu.

---

## 2. User goal
1. **Xem yêu cầu xử lý**: Đọc chi tiết nội dung vi phạm do thanh tra yêu cầu (VD: Bổ sung lưới chắn bụi, tưới nước rửa đường, rửa xe trước khi ra khỏi công trường).
2. **Xác thực vị trí hiện trường**: Hệ thống tự động kiểm tra GPS thiết bị phải nằm trong bán kính 50m quanh tâm công trình.
3. **Nộp minh chứng hoàn thành**: Tải lên ảnh chụp thực tế sau khi đã xử lý, điền nội dung giải trình và bấm gửi nghiệm thu.

---

## 3. Information hierarchy
1. **Danh sách nhiệm vụ cần làm (Pending Actions List)**: Thẻ nhiệm vụ có hạn chót xử lý và mức độ ưu tiên.
2. **Khung so sánh ảnh đối chứng (Before/After Comparison Zone)**:
   - Ảnh vi phạm ban đầu (Before): Do người dân/thanh tra chụp kèm mã hash SHA-256.
   - Khung chụp ảnh khắc phục (After): Do nhà thầu tải lên tại hiện trường.
3. **Công cụ xác thực vị trí (Geofence Distance Check)**: Hiển thị khoảng cách thực tế tới công trình (VD: \`Cách tâm công trình 18m — Hợp lệ\`).
4. **Ô nội dung giải trình (Remediation Explanation)**: Nhập biện pháp kỹ thuật đã áp dụng.
5. **Nút gửi nghiệm thu (Submit Remediation)**: \`[Gửi báo cáo khắc phục]\`.

---

## 4. Primary action
- **Primary action**: \`[Gửi báo cáo khắc phục]\` ($\ge 44\text{px}$, kiểm tra Geofence $\le 50\text{m}$)
- **Secondary**: \`[Xem hồ sơ vụ việc]\`, \`[Liên hệ cán bộ phụ trách]\`
`);

console.log('Finished writing all ultra-detailed PDR specifications.');
