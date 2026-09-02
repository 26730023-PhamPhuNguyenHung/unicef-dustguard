# PUB-01 — Cổng Thông Tin Giám Sát Bụi Đô Thị

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/` (và alias `/landing`)
- **Primary Role**: Đại chúng / Người dân / Báo chí (`public`)
- **Secondary Roles**: Toàn bộ người dùng chưa đăng nhập
- **Current Component**: `LandingPage.jsx` (`app/src/modules/public/LandingPage.jsx`)
- **Layout**: Public Header & Footer
- **Primary Job**: Tìm hiểu giải pháp DustGuard VN, tra cứu nhanh mức độ ô nhiễm bụi đô thị và tìm đường dẫn tham gia giám sát.
- **Success Condition**: Người dùng hiểu được giá trị của nền tảng trong 5 giây và biết cách bấm gửi phản ánh hoặc tra cứu bản đồ ngay.

---

## 2. WHY THIS SCREEN EXISTS
- Cổng tiếp cận đầu tiên cho toàn xã hội: minh bạch hóa dữ liệu ô nhiễm bụi công trình, giới thiệu mô hình hợp tác 4 bên (Dân - Thanh niên - Cán bộ - Nhà thầu) và hướng dẫn người dân chung tay hành động bảo vệ không khí đô thị.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Truy cập tên miền gốc `dustguard.vn` hoặc link chia sẻ.
- **Exit Points**:
  - Bấm "Gửi phản ánh ngay" $\rightarrow$ Mở `/citizen/report/new` (hoặc `/login`).
  - Bấm "Xem bản đồ điểm nóng" $\rightarrow$ Mở Bản đồ `/map`.
  - Bấm "Đăng nhập" $\rightarrow$ Mở `/login`.
  - Bấm "Trải nghiệm demo 5 vai trò" $\rightarrow$ Mở `/demo`.
- **Navigation Item**: Thanh điều hướng Public Header (Logo, Bản đồ, Tín chỉ SV, Cẩm nang trạm đo, Đăng nhập).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem cổng thông tin** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Tra cứu số liệu công khai** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Bấm nút tham gia giám sát** | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Mở trang chủ / 
→ Đọc thông điệp chính trong 5s: "Chung tay giám sát bụi công trình vì không khí đô thị sạch"
→ Xem số liệu thực tế: Số công trình đang giám sát | Số vụ việc đã khắc phục xong
→ Xem bản đồ điểm nóng thu nhỏ
→ Bấm CTA chính: "Xem bản đồ" hoặc "Gửi phản ánh"
```

---

## 6. INFORMATION HIERARCHY (HUMAN-CENTRIC PROGRESSIVE DISCLOSURE)
1. **Public Navigation Bar**: Logo DustGuard VN, Tra cứu bản đồ, Cẩm nang trạm đo 500k, Nút "Đăng nhập".
2. **Hero Section (Level 1 — Cần biết ngay trong 5s)**:
   - Tiêu đề ngắn gọn, mạnh mẽ: *Giải Pháp Giám Sát Bụi Công Trình & Giao Thông Đô Thị*.
   - 2 Nút hành động nổi bật: `Xem bản đồ điểm nóng` (Chính) và `Gửi phản ánh` (Phụ).
3. **Civic Impact Numbers (Thống Kê Thực Tế D1)**:
   - `38+` Công trình đang giám sát | `142` Phản ánh đã giải quyết | `20h = 4.0` Tín chỉ tình nguyện.
4. **4-Party Collaboration Workflow (Mô Hình 4 Bên)**:
   - Người dân phát hiện $\rightarrow$ Thanh niên khảo sát $\rightarrow$ Cán bộ xử lý $\rightarrow$ Nhà thầu khắc phục Before/After.
5. **Call-to-Action Footer**: Lời kêu gọi tham gia mạng lưới công dân số.

---

## 7. CONTENT CONTRACT
- **Page Title**: `DustGuard VN — Giám Sát Bụi Đô Thị`
- **Primary CTA**: `Xem bản đồ` (≤ 3 từ)
- **Secondary CTA**: `Gửi phản ánh` (≤ 3 từ)
- **Zero Jargon**: Tránh các từ kỹ thuật nội bộ (DAG, IoT telemetry, D1 SQLite), dùng ngôn ngữ đời sống dễ hiểu.

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Số vụ việc đã xử lý | Yes | `cases` table | `COUNT(id) WHERE status='CLOSED'` | `120+` |
| Số công trình | Yes | `sites` table | `COUNT(id)` | `38` |

- **Current Implementation**: `GET /api/public/landing-stats`

---

## 9. DESKTOP & MOBILE BEHAVIOR
- **Desktop (1366×768)**: Bố cục tràn ngang hiện đại, các khối nội dung cân đối, chỉ số tác động nằm trên màn hình đầu tiên (Above the fold).
- **Mobile (360–430px)**: Chuyển toàn bộ nội dung thành cột dọc mượt mà, 2 nút CTA xếp chồng dễ bấm bằng ngón tay cái ($\ge 44\text{px}$).

---

## 10. ACCEPTANCE CRITERIA
- [ ] Thời gian tải trang dưới 0.8 giây, đạt chuẩn hiệu năng Mobile Performance.
- [ ] Số liệu thống kê được cập nhật từ API thật, không hardcode số giả.
- [ ] Hiển thị sắc nét trên cả desktop 1366px và điện thoại di động 360px.

---

## 11. IMPLEMENTATION STATUS
- **CURRENT**: Giao diện Landing Page, số liệu thống kê công khai, điều hướng các phân hệ.
- **PARTIAL**: Bản đồ mini tương tác trực tiếp ngay trên trang chủ.
- **PROPOSED**: Tích hợp video ngắn 30s hướng dẫn người dân gửi phản ánh.
