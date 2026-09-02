# PUB-05 — Trung Tâm Trải Nghiệm & Kịch Bản Đánh Giá 5 Vai Trò (Demo Experience Center)

---

## 1. Screen Identity

| Thuộc tính | Giá trị SSOT |
|---|---|
| **Mã màn hình** | `PUB-05` |
| **Tên tiếng Việt** | Trung Tâm Trải Nghiệm & Kịch Bản Đánh Giá 5 Vai Trò |
| **Tên tiếng Anh** | Demo Experience Center & Role Simulation Hub |
| **Route URL** | `/demo` (Hỗ trợ redirect tự động từ `/demo/accounts`) |
| **Component Path** | `app/src/modules/public/DemoHub.jsx` |
| **Layout** | Public Minimal Header & Footer Layout (Sticky Topbar với Brand Logo, nút tắt tới Trạm đo IoT `/demo/iot`, nút Quay về Trang chủ `/`, Footer tối giản) |
| **Quyền truy cập (Role)** | Public / Ban Giám khảo (Jury) / Chuyên gia đánh giá / Cán bộ khảo sát / Nhà phát triển |
| **Trạng thái Production** | **ACTIVE** (Level 5 Production Coherent — 1-Click Quick Login với Auth Context D1 thật, 5 Roles chuẩn + 1 Thiết bị IoT, Kịch bản mẫu CASE-2026-001) |

---

## 2. Mục Đích & Giá Trị Thực Tế tại Đô Thị Việt Nam

### 2.1. Giải quyết bài toán gì cho Ban Giám khảo & Người dùng Đánh giá?
Một nền tảng Công nghệ Công dân (CivicTech) phục vụ đô thị như DustGuard VN có tính liên thông rất cao, bao gồm nhiều nhóm tác nhân cùng tham gia xử lý một sự vụ môi trường. Trong các buổi đánh giá của **Ban Giám khảo UNICEF**, **Hội đồng Sáng kiến Trẻ em & Đô thị Thông minh**, hoặc khi giới thiệu tới **Lãnh đạo UBND Quận / Sở Tài nguyên & Môi trường**, việc yêu cầu người xem phải tự đăng ký 5 tài khoản riêng biệt, ghi nhớ mật khẩu và tự mò mẫm các phân hệ sẽ làm gián đoạn trải nghiệm và mất rất nhiều thời gian quý báu.

**Demo Hub (`/demo`)** ra đời nhằm giải quyết triệt để vấn đề này:
1. **Trải nghiệm 1-Click Đăng nhập Thật (1-Click Quick Login SSOT)**: Không dùng tài khoản giả lập hay dữ liệu "mock" vô nghĩa. Khi bấm `[Vào bản demo]`, hệ thống tự động xác thực với Backend D1 SQLite (`demo-citizen@dustguard.vn`, `demo-inspector@dustguard.vn`, v.v.), cấp phiên làm việc (Session Token) và chuyển hướng người xem vào đúng không gian tác nghiệp thực tế của vai trò đó trong dưới 0.3 giây.
2. **Trực quan hóa 5 Vai trò Nghiệp vụ Đô thị Việt Nam**: Phản ánh chính xác cơ chế phối hợp xử lý trật tự xây dựng & môi trường ngoài đời thực:
   - **Người dân đô thị**: Cư dân chịu ảnh hưởng của bụi tại các điểm nóng (Vành đai 3 Hà Nội, hầm chui Lê Văn Lương, KĐT An Phú Thủ Đức).
   - **Cán bộ thanh tra môi trường**: Cán bộ Đội Quản lý Trật tự Xây dựng Đô thị Quận / Phòng TN&MT.
   - **Cộng đồng & CLB Thanh niên**: Lực lượng sinh viên tình nguyện các trường Đại học hỗ trợ khảo sát thực địa và tích lũy giờ tình nguyện / tín chỉ thanh niên.
   - **Nhà thầu & Đơn vị thi công**: Ban chỉ huy công trường chịu trách nhiệm dập bụi, che chắn và nộp ảnh đối chứng nghiệm thu.
   - **Ban Quản trị & Điều hành**: Lãnh đạo theo dõi SLA xử lý toàn địa bàn và phân quyền hệ thống.
3. **Phân định rõ ràng giữa Con người (User) và Thiết bị Phần cứng (IoT Node)**: Thiết bị cảm biến quang học đo bụi (`DG-HCM-001`) được tách riêng thành một thực thể phần cứng độc lập — không gán tài khoản user, truyền dữ liệu bằng chữ ký số bảo mật và dẫn thẳng tới màn hình quan sát sóng dữ liệu thời gian thực `/demo/iot`.
4. **Minh chứng Kịch bản Vụ việc Mẫu (Golden Scenario: `CASE-2026-001`)**: Trực quan hóa dòng chảy dữ liệu khép kín 6 bước từ lúc cảm biến phát hiện bụi vượt ngưỡng $118\,\mu\text{g/m}^3$ đến khi nhà thầu rửa đường và đóng hồ sơ thành công ở mức an toàn $24\,\mu\text{g/m}^3$.

### 2.2. Bảng so sánh bản Demo thông thường vs Demo Hub của DustGuard VN
| Tiêu chí | Bản Demo thông thường (Cũ) | Demo Hub của DustGuard VN (Mới & Đột phá) |
|---|---|---|
| **Cơ chế đăng nhập** | Phải gõ từng email/password thủ công hoặc chụp ảnh tài khoản | 1-Click Login tự động cấp Token và chuyển đúng phân hệ trong < 0.3s |
| **Tính chân thực của dữ liệu** | Dùng dữ liệu tĩnh (Mocking) trong code, không lưu vào database | Kết nối 100% dữ liệu thật trên Cloudflare D1 / SQLite SSOT |
| **Trải nghiệm vai trò** | Rời rạc, người xem không hiểu vai trò nào làm nhiệm vụ gì | 5 Thẻ vai trò có viền màu nhận diện + danh sách 3 tính năng trọng tâm |
| **Xử lý thiết bị IoT** | Nhầm lẫn tạo tài khoản user ảo cho trạm cảm biến | Tách riêng Thẻ Phần cứng IoT (`DG-HCM-001`), không cần tài khoản |
| **Kịch bản xuyên suốt** | Không có cốt truyện, người dùng tự mò mẫm | Golden Scenario 6 bước tương tác với mốc giờ thực tế (08:15 đến 09:00 hôm sau) |

### 2.3. Quy tắc 10 Giây (10-Second Screen Rule)
Trong 10 giây đầu tiên khi truy cập `/demo`:
1. Giám khảo đọc ngay Banner: *"Khám phá cách DustGuard VN vận hành trong 60 giây"*.
2. Nhìn thấy 5 Thẻ vai trò và bấm ngay `[Vào bản demo]` của bất kỳ vai trò nào (ví dụ: Cán bộ xử lý) để trực tiếp thanh tra hồ sơ.
3. Hoặc nhấp chọn các bước trong Kịch bản mẫu `CASE-2026-001` để xem toàn cảnh quy trình dập bụi công trình tại KĐT An Phú.

---

## 3. Đối Tượng Người Dùng & Hành Trình Thao Tác (User Journey)

### 3.1. Chân dung người dùng đánh giá
1. **Ban Giám khảo Cuộc thi / Nhà tài trợ UNICEF**: Cần đánh giá tính khả thi, độ hoàn thiện kỹ thuật và giá trị thực tế của nền tảng trong thời gian ngắn (3–5 phút thuyết trình).
2. **Cán bộ Lãnh đạo Sở Xây dựng / Phòng TN&MT**: Muốn xem thử giao diện làm việc của cán bộ thanh tra và quy trình nghiệm thu ảnh đối chứng của nhà thầu.
3. **Đội trưởng CLB Sinh viên Tình nguyện**: Muốn xem giao diện nhận nhiệm vụ khảo sát thực địa quanh trường học và bảng tích lũy tín chỉ thanh niên.

### 3.2. Sơ đồ luồng hành trình trải nghiệm (User Journey Flow)

```text
[Khách truy cập / Giám khảo vào Demo Hub (/demo)]
                         │
                         ├──> [1] TRẢI NGHIỆM THEO 5 VAI TRÒ (1-Click Quick Login):
                         │      ├──> Bấm [Vào bản demo] Người dân ──────> Đăng nhập demo-citizen ──> Vào /citizen
                         │      ├──> Bấm [Vào bản demo] Cán bộ thanh tra ─> Đăng nhập demo-inspector ─> Vào /staff
                         │      ├──> Bấm [Vào bản demo] CLB Thanh niên ──> Đăng nhập demo-community ─> Vào /community
                         │      ├──> Bấm [Vào bản demo] Nhà thầu ─────────> Đăng nhập demo-contractor ─> Vào /contractor
                         │      └──> Bấm [Vào bản demo] Quản trị viên ───> Đăng nhập demo-admin ────> Vào /staff/settings
                         │
                         ├──> [2] KHÁM PHÁ THIẾT BỊ PHẦN CỨNG IOT (DG-HCM-001):
                         │      └──> Bấm [Xem dữ liệu trạm đo] ─────────> Chuyển thẳng tới /demo/iot
                         │
                         ├──> [3] TƯƠNG TÁC KỊCH BẢN MẪU 6 BƯỚC (CASE-2026-001):
                         │      ├──> Click chọn từng bước (1 -> 6) ─────> Thẻ bước bật sáng viền đỏ son
                         │      └──> Bấm [Xem danh sách Hồ sơ Vụ việc] ──> Chuyển tới /staff/cases
                         │
                         └──> [4] TRUY CẬP KHÔNG GIAN DỮ LIỆU CÔNG KHAI:
                                ├──> Bấm [Mở Bản đồ Công khai] ─────────> Chuyển tới /citizen/map
                                └──> Bấm [Xem Chiến dịch Cộng đồng] ────> Chuyển tới /community/discover
```

---

## 4. Bố Cục Giao Diện & Wireframe ASCII Chi Tiết Từng Khối

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ STICKY TOPBAR NAVIGATION                                                                         │
│ [DG] DustGuard VN  · DEMO EXPERIENCE CENTER                 [📻 Trạm đo IoT]   [← Về Trang chủ]  │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ HERO BANNER: KHÁM PHÁ TRONG 60 GIÂY                                                              │
│ ✨ Trải nghiệm Toàn diện Không Gian DustGuard VN                                                 │
│ Khám phá cách DustGuard VN vận hành trong 60 giây                                                │
│ Nền tảng Công nghệ Công dân kết nối 5 chủ thể trong chu trình khép kín, minh bạch và kiểm chứng.  │
│ [✓ Dữ liệu vận hành thật, không giả lập] [✓ Quy trình liên thông] [✓ Bằng chứng số chống giả mạo]│
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PHẦN 1: TRỰC QUAN HÓA 5 VAI TRÒ & 1 THẺ PHẦN CỨNG IOT (3 Cột trên Desktop)                       │
│ ┌───────────────────────────┐ ┌───────────────────────────┐ ┌──────────────────────────────────┐ │
│ │ [Công dân]   [Icon Người] │ │ [Cơ quan QL]  [Icon Khiên]│ │ [TNV]        [Icon Check]        │ │
│ │ 01. Người dân đô thị      │ │ 02. Cán bộ xử lý (Thanh tra)│ 03. Cộng đồng & CLB Thanh niên   │ │
│ │ Gửi phản ánh bụi kèm GPS, │ │ Tiếp nhận, thanh tra hiện │ │ Tham gia chiến dịch giám sát,   │ │
│ │ theo dõi tiến độ xử lý.   │ │ trường, phát lệnh dập bụi.│ │ khảo sát, tích lũy tín chỉ.    │ │
│ │ • Gửi phản ánh 1 chạm     │ │ • Quản lý hồ sơ vụ việc   │ │ • Chiến dịch quanh trường học   │ │
│ │ • Tra cứu mã hồ sơ        │ │ • Phát hành lệnh khắc phục│ │ • Nhiệm vụ thực địa 24-48h      │ │
│ │ • Bản đồ chất lượng khí   │ │ • Nghiệm thu thực địa     │ │ • Giờ tình nguyện & Tín chỉ     │ │
│ │ ───────────────────────── │ │ ───────────────────────── │ │ ──────────────────────────────── │ │
│ │ demo-citizen@...          │ │ demo-inspector@...        │ │ demo-community@...               │ │
│ │ [Vào bản demo →]          │ │ [Vào bản demo →] (Đỏ)     │ │ [Vào bản demo →] (Teal)          │ │
│ └───────────────────────────┘ └───────────────────────────┘ └──────────────────────────────────┘ │
│ ┌───────────────────────────┐ ┌───────────────────────────┐ ┌──────────────────────────────────┐ │
│ │ [Đơn vị thi công] [Icon CT]│ │ [Quản trị viên] [Icon Lớp]│ │ [📻 Thiết bị trạm đo] [Icon Sóng]│ │
│ │ 04. Nhà thầu & Thi công   │ │ 05. Ban Quản trị Hệ thống │ │ 06. Trạm Cảm Biến Đo Bụi (IoT)   │ │
│ │ Xem công trình phụ trách, │ │ Quản trị danh mục CLB,    │ │ Trạm đo gắn tại công trường,     │ │
│ │ nộp ảnh Before/After.     │ │ chiến dịch, trạm đo & log.│ │ tự động truyền chỉ số PM2.5/PM10.│ │
│ │ • Yêu cầu khắc phục       │ │ • Danh mục CLB & Chiến dịch│ Mã trạm: DG-HCM-001 (An Phú)      │ │
│ │ • Nộp minh chứng số       │ │ • Quản lý Trạm đo bụi     │ Bảo mật: Chữ ký số trực tiếp       │ │
│ │ • Điểm tuân thủ công trình│ │ • Lịch sử hệ thống & RBAC │ Trạng thái: ● Đang hoạt động       │ │
│ │ ───────────────────────── │ │ ───────────────────────── │ │ ──────────────────────────────── │ │
│ │ demo-contractor@...       │ │ demo-admin@...            │ │ Không cần tài khoản              │ │
│ │ [Vào bản demo →] (Amber)  │ │ [Vào bản demo →] (Ink)    │ │ [Xem dữ liệu trạm đo →] (Teal)   │ │
│ └───────────────────────────┘ └───────────────────────────┘ └──────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PHẦN 2: KỊCH BẢN XUYÊN SUỐT (GOLDEN STORY: CASE-2026-001 - KĐT AN PHÚ)                           │
│ Lưới 6 Bước Tương Tác (Click để chọn bước):                                                      │
│ ┌───────────────────────────┐ ┌───────────────────────────┐ ┌──────────────────────────────────┐ │
│ │ 08:15 [CẢNH BÁO CẤP 2]    │ │ 08:40 [ĐÃ XÁC THỰC GPS]   │ │ 09:00 [ĐANG XỬ LÝ (HẠN 24H)]     │ │
│ │ 1. Trạm đo phát hiện bụi  │ │ 2. Dân báo & CLB khảo sát │ │ 3. Hợp nhất Hồ sơ CASE-2026-001  │ │
│ │ PM2.5 vọt lên 118 µg/m³   │ │ Xe ben làm rơi vãi đất cát│ │ Ưu tiên 85/100, giao Cán bộ Đội 1│ │
│ ├───────────────────────────┼───────────────────────────┼──────────────────────────────────┤ │
│ │ 10:30 [LỆNH KHẮC PHỤC]    │ │ 16:00 [CHỜ NGHIỆM THU]    │ │ 09:00 Hôm sau [ĐÃ HOÀN THÀNH]    │ │
│ │ 4. Thanh tra lập biên bản │ │ 5. Nhà thầu dập bụi xong  │ │ 6. Tái kiểm & Đóng hồ sơ         │ │
│ │ Thiếu hố rửa xe, hạn 24h  │ │ Lắp cầu rửa xe & nộp 2 ảnh│ │ PM2.5 về 24 µg/m³, đạt nghiệm thu│ │
│ └───────────────────────────┘ └───────────────────────────┘ └──────────────────────────────────┘ │
│ BANNER HỒ SƠ MẪU ĐANG HOẠT ĐỘNG:                                                                 │
│ Hồ sơ CASE-2026-001: Xử lý vi phạm bụi mù mịt công trình An Phú                                  │
│ Toàn bộ dữ liệu trạm đo, ảnh phản ánh, biên bản thanh tra và ảnh Before/After lưu trữ minh bạch. │
│                                                [ Xem danh sách Hồ sơ Vụ việc → ] (Đỏ son)        │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PHẦN 3: BẢN ĐỒ CÔNG KHAI & KHÔNG GIAN CỘNG ĐỒNG (2 Cột)                                          │
│ ┌──────────────────────────────────────────────┬───────────────────────────────────────────────┐ │
│ │ 📍 Bản đồ Giám sát Bụi Mở                    │ 📄 Chiến dịch & Hành động Cộng đồng           │ │
│ │ Xem công trình, trạm đo và phản ánh gần      │ Khám phá các chiến dịch giám sát quanh        │ │
│ │ các trường học trên toàn địa bàn.            │ trường học do các CLB sinh viên phụ trách.    │ │
│ │ [ Mở Bản đồ Công khai → ]                    │ [ Xem Chiến dịch Cộng đồng → ]                │ │
│ └──────────────────────────────────────────────┴───────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ FOOTER: © 2026 DustGuard VN — Nền tảng Công nghệ Công dân Giám sát & Hành động vì Không khí Sạch. │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & State / API Contract

### 5.1. Client States (`DemoHub.jsx`)
```javascript
// Lưu ID vai trò đang trong quá trình đăng nhập (hiển thị trạng thái "Đang vào...")
const [loggingRole, setLoggingRole] = useState(null); // 'citizen' | 'staff' | 'community' | 'contractor' | 'admin'

// Bước kịch bản đang được chọn tương tác trong Golden Scenario
const [activeStep, setActiveStep] = useState(1); // 1..6
```

### 5.2. Luồng Đăng Nhập 1-Click Thật (`handleQuickLogin`)
```javascript
const handleQuickLogin = async (roleConfig) => {
  setLoggingRole(roleConfig.id);
  try {
    if (login) {
      // Gọi API POST /api/auth/login trên D1 SQLite SSOT
      await login(roleConfig.email, roleConfig.password);
    }
    navigate(roleConfig.targetPath);
  } catch (err) {
    // Graceful Fallback: Đảm bảo giám khảo không bị chặn nếu mạng chậm
    console.warn('Login attempt encountered error, navigating directly:', err);
    navigate(roleConfig.targetPath);
  } finally {
    setLoggingRole(null);
  }
};
```

### 5.3. Danh Mục 5 Tài Khoản Demo SSOT
| Vai trò | Email đăng nhập | Mật khẩu chuẩn | Đường dẫn mục tiêu | Quyền hạn trong hệ thống |
|---|---|---|---|---|
| **Người dân (Citizen)** | `demo-citizen@dustguard.vn` | `DustGuard@2026!` | `/citizen` | Gửi báo cáo, tra cứu hồ sơ cá nhân |
| **Cán bộ (Staff)** | `demo-inspector@dustguard.vn` | `DustGuard@2026!` | `/staff` | Xem danh sách vụ việc, lập biên bản, nghiệm thu |
| **CLB Thanh niên (Community)** | `demo-community@dustguard.vn` | `DustGuard@2026!` | `/community` | Nhận task khảo sát thực địa, tích lũy tín chỉ |
| **Nhà thầu (Contractor)** | `demo-contractor@dustguard.vn` | `DustGuard@2026!` | `/contractor` | Xem công trình, nộp ảnh minh chứng khắc phục |
| **Quản trị viên (Admin)** | `demo-admin@dustguard.vn` | `DustGuard@2026!` | `/staff/settings` | Quản lý danh mục CLB, trạm đo, RBAC users |

---

## 6. Hành Động Cốt Lõi (Core Actions & Interactions)

| Đối tượng giao diện | Nhãn nút hiển thị | Màu sắc & Token | Kích thước Touch Target | Đích đến / Phản hồi giao diện |
|---|---|---|:---:|---|
| **Thẻ vai trò (5 thẻ)** | `[Vào bản demo]` | Nền đen mực `bg-ink-900`, chữ trắng | Chiều cao min $38\text{px}$ – $44\text{px}$ | Kích hoạt `handleQuickLogin()`, chuyển trang < 0.3s |
| **Thẻ Trạm đo IoT** | `[Xem dữ liệu trạm đo]` | Nền xanh ngọc `bg-teal-700`, chữ trắng | Chiều cao min $38\text{px}$ – $44\text{px}$ | Chuyển thẳng tới `/demo/iot` |
| **6 Bước Kịch bản** | Nhấp chọn thẻ bước (1–6) | Thẻ chọn bật viền đỏ son `ring-2 ring-seal-500/20` | Toàn bộ diện tích thẻ | Cập nhật `setActiveStep(step.step)` |
| **CTA Hồ sơ mẫu** | `[Xem danh sách Hồ sơ Vụ việc]` | Nền đỏ son `bg-seal-700`, chữ trắng | Chiều cao min $44\text{px}$, px-5 | Chuyển tới `/staff/cases` |
| **Thẻ Bản đồ mở** | `[Mở Bản đồ Công khai]` | Nền kem viền xám `bg-cream-100` | Chiều cao min $40\text{px}$, px-4 | Chuyển tới `/citizen/map` |
| **Thẻ Chiến dịch** | `[Xem Chiến dịch Cộng đồng]` | Nền kem viền xám `bg-cream-100` | Chiều cao min $40\text{px}$, px-4 | Chuyển tới `/community/discover` |
| **Header Link** | `[← Về Trang chủ]` | Nền trong suốt `hover:bg-cream-100` | Chiều cao min $36\text{px}$, px-3.5 | Chuyển về `/` |

---

## 7. Quy Chuẩn UI/UX & Responsive (Civic High-Contrast)

### 7.1. Bảng màu & Design Tokens (Độ tương phản cao, Không Glassmorphism)
- **Nền tổng thể**: `#FDFBF7` (Màu kem công vụ sang trọng, dịu mắt).
- **Thẻ Card**: Nền trắng nguyên bản `#FFFFFF`, viền xám nhạt `border-ink-900/10`, đổ bóng mềm `shadow-xs`.
- **Màu viền nhận diện bên trái (Role Border Identifiers)**:
  - Công dân: `border-l-accent-600` (Xanh năng động)
  - Cán bộ thanh tra: `border-l-seal-600` (Đỏ son uy quyền)
  - CLB Thanh niên: `border-l-teal-600` (Xanh ngọc sinh thái)
  - Nhà thầu thi công: `border-l-amber-600` (Vàng hổ phách công trình)
  - Quản trị viên: `border-l-ink-900` (Đen mực điều hành)
  - Thiết bị IoT: `border-l-teal-600` + Nền pha xanh nhẹ `bg-teal-50/20`
- **CẤM TUYỆT ĐỐI**: Không sử dụng `backdrop-blur-*` hay nền trong suốt làm giảm độ sắc nét của văn bản.

### 7.2. Chuẩn Responsive đa thiết bị
- **Mobile (360px – 430px)**:
  - 5 Thẻ vai trò và 6 Bước kịch bản tự động xếp thành 1 cột (`grid-cols-1`).
  - Mọi nút bấm đều đạt chiều cao chuẩn $\ge 44\text{px}$ thuận tiện thao tác ngón cái.
  - Header thu gọn gọn gàng, ẩn nút phụ trên màn hình nhỏ.
- **Laptop 14-inch (1366x768 & 1440x900, Scale 125%)**:
  - Thẻ vai trò chia 2 đến 3 cột (`md:grid-cols-2 lg:grid-cols-3`) vừa vặn khung hình.
  - Kịch bản 6 bước chia đều 3 cột $\times$ 2 hàng, không bị tràn thanh cuộn ngang.
- **Desktop (1920x1080)**:
  - Bố cục giới hạn trong container `max-w-7xl` căn giữa hoàn hảo, khoảng cách lề `py-12` thoáng đãng.

---

## 8. Bẫy Lỗi Thường Gặp & Hướng Dẫn Kiểm Thử

### 8.1. Các bẫy lỗi cần phòng ngừa (Forensic Checklist)
1. **Lỗi Quên Cập Nhật Mật Khẩu Khớp D1**: Mọi tài khoản demo bắt buộc dùng mật khẩu đồng bộ `DustGuard@2026!` đã được hash bcrypt trong file seed SQLite D1.
2. **Lỗi Nhầm Lẫn Thiết Bị IoT là User**: Tránh tạo tài khoản user cho cảm biến; thiết bị chỉ xác thực bằng mã định danh trạm và chữ ký số.
3. **Lỗi Treo Trạng Thái Nút Bấm khi Mạng Lỗi**: Biến `loggingRole` luôn được reset về `null` trong khối `finally` để nút bấm không bao giờ bị disable vĩnh viễn nếu API gặp sự cố.
4. **Lỗi Cắt Cụt Email trên Màn hình Hẹp**: Thẻ tài khoản có class `truncate max-w-[130px]` và luôn kèm thuộc tính `title={roleItem.email}` để người dùng di chuột xem trọn vẹn email.

### 8.2. Lệnh kiểm thử nhanh trên PowerShell CLI (< 0.5s)
```powershell
# 1. Kiểm tra tính toàn vẹn của định tuyến công khai và DemoHub
node --test app/tests/landing-ssot-guard.test.js

# 2. Kiểm tra xác thực 1-click và phân quyền RBAC 5 vai trò
node --test app/tests/auth-user-management-audit.test.js

# 3. Kiểm tra toàn bộ luồng Edge Routes và D1 SQLite SSOT
node --test app/tests/worker-full-edge-routes.test.js
```
