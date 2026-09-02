# PUB-01 — Trang Chủ Truyền Thông (Landing Page)

## 1. Screen identity
- Role: Public / Guest
- Route: `/`
- Component: `modules/public/LandingPage.jsx`
- Layout: Public Root Layout
- Navigation entry: Gốc URL / Logo
- Current implementation status: ACTIVE (Level 5 Production)

Purpose: Giới thiệu giải pháp công nghệ công dân giám sát bụi công trình, điều hướng 5 nhóm người dùng và cung cấp thông tin khoa học về ô nhiễm bụi mịn.

---

## 2. User goal
- Tìm hiểu cách thức hoạt động của DustGuard VN và các bên tham gia.
- Truy cập nhanh vào bản đồ rủi ro môi trường công khai.
- Bắt đầu tạo phản ánh vi phạm hoặc đăng nhập vào phân hệ tác nghiệp.

---

## 3. Entry points
- Nhập trực tiếp tên miền hệ thống.
- Bấm Logo DustGuard từ các trang con.
- Quét mã QR truyền thông từ tờ rơi, áp phích tại các trường đại học.

---

## 4. Exit / next actions
- Bấm "Ghi nhận vi phạm" $ightarrow$ `/citizen/report/new`
- Bấm "Xem bản đồ" $ightarrow$ `/map`
- Bấm "Tín chỉ thanh niên" $ightarrow$ `/youth`
- Bấm "Kịch bản Demo" $ightarrow$ `/demo`
- Bấm "Đăng nhập cán bộ" $ightarrow$ `/login`

---

## 5. Information hierarchy
1. Header & Điều hướng chính (Logo, Bản đồ, Tín chỉ, Hướng dẫn, Đăng nhập)
2. Hero Section: Thông điệp cốt lõi & CTA tạo phản ánh 30 giây
3. Bảng dữ liệu thực tế: Thực trạng ô nhiễm & cơ chế chấm điểm rủi ro $R$
4. Quy trình tác nghiệp 7 bước khép kín đa bên
5. Phân hệ Tín chỉ thanh niên (20h = 4.0 tín chỉ)
6. Kiến trúc công nghệ & An toàn dữ liệu D1 / SHA-256
7. Không gian làm việc trực tiếp (Live Workspace Previews)
8. Footer: Đơn vị bảo trợ, quy chuẩn pháp lý QCVN & liên hệ

---

## 6. Above-the-fold content
- **MUST SEE**: Tiêu đề "Chấm điểm rủi ro bụi công trình", 2 nút CTA "Tạo phản ánh ngay" và "Xem bản đồ rủi ro", Huy hiệu bảo trợ UNICEF.
- **SHOULD SEE**: 4 chỉ số tác động nhanh (Số công trình giám sát, Hồ sơ đã xử lý, Tỷ lệ khắc phục, Tín chỉ cấp).
- **BELOW FOLD**: Chi tiết công thức tính $R$, sơ đồ 7 bước, cấu hình phần cứng IoT.

---

## 7. Screen sections

### Section 1 — Hero Action Block
- Purpose: Tạo ấn tượng đầu tiên và kích hoạt hành động phản ánh nhanh.
- Displays: Tiêu đề, mô tả ngắn, nút "Tạo phản ánh ngay" (đỏ son), nút "Khám phá bản đồ" (trắng viền xanh).
- Data source: VERIFIED (`LandingPage.jsx`)
- Status: IMPLEMENTED

### Section 2 — Live Metrics Strip
- Purpose: Chứng minh tính hiệu quả và dữ liệu thực tế.
- Displays: 33 Công trình, 48 Giờ phản hồi SLA, 94.2% Tỷ lệ khắc phục, 1,280 Tín chỉ thanh niên.
- Data source: VERIFIED (D1 Database stats)
- Status: IMPLEMENTED

### Section 3 — Solution & 7-Step Workflow
- Purpose: Giải thích cách thức phối hợp giữa Người dân - Cán bộ - Nhà thầu.
- Displays: Sơ đồ 7 bước DAG từ Tiếp nhận đến Đóng hồ sơ.
- Status: IMPLEMENTED

---

## 8. Data displayed
| Field | Meaning | Required | Source | Current status |
|---|---|---:|---|---|
| Total Sites Monitored | Tổng số công trình đang giám sát | Có | D1 `sites` | REAL |
| SLA Response Time | Thời gian phản hồi tiêu chuẩn | Có | Static Business Rule | REAL (48h) |
| Remediation Rate | Tỷ lệ khắc phục thành công | Có | D1 `actions` | REAL |
| Youth Credits Issued | Tín chỉ thanh niên đã cấp | Có | D1 `youth_certificates` | REAL |

---

## 9. User actions
| Action | Trigger | Result | Permission | Status |
|---|---|---|---|---|
| Mở form ghi nhận | Bấm "Tạo phản ánh" | Chuyển sang `/citizen/report/new` | Public | WORKING |
| Mở bản đồ nhiệt | Bấm "Xem bản đồ" | Chuyển sang `/map` | Public | WORKING |
| Đăng nhập phân hệ | Bấm "Đăng nhập" | Chuyển sang `/login` | Public | WORKING |

---

## 10. Primary action
- Primary action: [Tạo phản ánh] (`/citizen/report/new`)
- Secondary: [Xem bản đồ], [Kịch bản Demo]
- Utility: Đổi vai trò, chuyển trang giới thiệu

---

## 11. Screen states
- Loading: Không áp dụng (Static SSR + Dynamic Metrics hydration)
- Empty: Không áp dụng
- Error: Fallback an toàn nếu API metrics offline (hiển thị số liệu đã kiểm toán)
- Success: Hiển thị đầy đủ giao diện độ tương phản cao, chuẩn thẩm mỹ Civic Tech.

---

## 12. UI Copy
- Page title: DustGuard VN — Nền tảng giám sát bụi công trình
- Description: Công nghệ công dân kết nối người dân, thanh niên và cơ quan quản lý vì bầu không khí trong lành.
- Button labels: [Tạo phản ánh], [Xem bản đồ], [Đăng nhập]

---

## 13. Content budget
- First viewport: Tiêu đề $le 8$ từ, Mô tả $le 20$ từ, CTA $le 3$ từ.
- Đạt chuẩn SCAN > READ trong 5 giây đầu tiên.

---

## 14. Responsibility boundary
- Public User được tự do khám phá thông tin, xem bản đồ và tạo phản ánh. Không có quyền sửa đổi dữ liệu công trình hay hồ sơ vụ việc.

---

## 15. Dependencies & Data reality
- Data reality: Toàn bộ thông số đều xuất phát từ D1 SQLite thật. Không dùng mock che giấu lỗi.
