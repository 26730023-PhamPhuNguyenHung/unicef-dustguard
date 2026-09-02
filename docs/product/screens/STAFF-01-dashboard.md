# STF-01 — Bảng Điều Hành Tác Nghiệp 12 Chỉ Số (Staff Dashboard)

## 1. Screen identity
- **Role**: Staff / Thanh tra môi trường / Cán bộ giám sát
- **Route**: `/staff`
- **Component**: `src/apps/staff/pages/dashboard/StaffDashboardPage.jsx`
- **Layout**: `src/apps/staff/layout/StaffLayout.jsx` (Sidebar điều hành 12 phân hệ)
- **Navigation entry**: Gốc phân hệ cán bộ
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Trung tâm chỉ huy tác nghiệp tổng thể: giám sát 12 chỉ số điều hành trọng yếu, ma trận rủi ro 33 công trình, cảnh báo ô nhiễm khẩn cấp và các hồ sơ vụ việc cần xử lý ngay trong ca trực.

---

## 2. User goal
1. **Xác định việc ưu tiên trong ngày**: Nắm bắt ngay số vụ việc sắp quá hạn SLA 48h và các cảnh báo ô nhiễm mức độ Cao/Rất cao.
2. **Chỉ đạo xử lý hiện trường**: Mở trực tiếp hồ sơ vụ việc hoặc cảnh báo để phân công cán bộ khảo sát hoặc giao nhiệm vụ khắc phục cho nhà thầu.
3. **Theo dõi chất lượng môi trường**: Đánh giá diễn biến chỉ số PM2.5/PM10 trên toàn địa bàn quản lý.

---

## 3. Entry points
- Đăng nhập tài khoản Staff (`/login`).
- Bấm "Bảng điều hành" trên Sidebar Staff.
- Chuyển vai trò từ Demo Hub (`/demo`).

---

## 4. Exit / next actions
- Bấm vào thẻ "Công trình" $ightarrow$ `/staff/sites`
- Bấm vào thẻ "Vụ việc cần xử lý" $ightarrow$ `/staff/cases`
- Bấm vào thẻ "Cảnh báo khẩn" $ightarrow$ `/staff/alerts`
- Bấm vào một dòng hồ sơ cụ thể $ightarrow$ `/staff/cases/:id`
- Bấm "Tạo hồ sơ mới" $ightarrow$ Mở Modal tạo hồ sơ vụ việc

---

## 5. Information hierarchy
1. **Thanh thông tin ca trực (Shift Header)**: Ngày giờ hiện tại, tên cán bộ trực, Nút [Tạo hồ sơ vụ việc mới].
2. **Lưới 4 Thẻ chỉ số trọng yếu (Top Metric Cards)**:
   - Tổng số công trình quản lý (33)
   - Hồ sơ vụ việc đang thụ lý (7 bước DAG)
   - Cảnh báo ô nhiễm khẩn cấp (Cần xác minh)
   - Tỷ lệ xử lý đúng hạn SLA (Mục tiêu $ge 90%$)
3. **Dải cảnh báo ô nhiễm thời gian thực (Real-time Alerts Strip)**: Danh sách các sự kiện nồng độ bụi vượt QCVN 05:2023.
4. **Bảng 5 Hồ sơ vụ việc có điểm rủi ro cao nhất (Top Priority Cases Table)**: Mã hồ sơ, Tên công trình, Giai đoạn 7 bước, Điểm rủi ro $R$, Hạn chót SLA.
5. **Ma trận phân bố rủi ro công trình (Risk Distribution Matrix)**: Biểu đồ tỷ lệ 4 cấp rủi ro (Thấp, Trung bình, Cao, Rất cao).

---

## 6. Above-the-fold content (First Viewport)
- **MUST SEE**: 4 Thẻ chỉ số vận hành, Nút [Tạo hồ sơ vụ việc], Danh sách 3 cảnh báo khẩn cấp nhất.
- **SHOULD SEE**: Bảng top 5 vụ việc ưu tiên cao.
- **BELOW FOLD**: Biểu đồ phân tích xu hướng ô nhiễm theo tuần và lịch phân công kiểm tra.

---

## 7. Screen sections chi tiết

### Section 1 — Shift Header & Quick Action
- **Displays**: Tiêu đề trang, thông tin ngày trực, Nút [Tạo hồ sơ vụ việc] (Đỏ son, $ge 44	ext{px}$).
- **Status**: IMPLEMENTED.

### Section 2 — 4 Core KPI Metric Cards
- **Displays**:
  - `sitesCount`: 33 Công trình đang theo dõi.
  - `activeCases`: Số vụ việc đang ở các bước INTAKE, SURVEYED, PROPOSED, APPROVED, REMEDIATED.
  - `pendingAlerts`: Số cảnh báo vượt ngưỡng chưa được xử lý.
  - `slaCompliance`: Tỷ lệ phần trăm xử lý trong vòng 48h.
- **Data Source**: VERIFIED (D1 `/api/staff/dashboard`).
- **Status**: IMPLEMENTED.

### Section 3 — High-Risk Alerts Banner
- **Displays**: Thẻ cảnh báo nền đỏ/cam nổi bật, tên trạm đo, nồng độ PM2.5 ($mu	ext{g/m}^3$), thời điểm kích hoạt, Nút [Xử lý ngay].
- **Status**: IMPLEMENTED.

### Section 4 — Top Priority Cases Table
- **Displays**: Bảng 5 vụ việc nóng nhất có điểm rủi ro cao hoặc sắp hết hạn SLA.
- **Columns**: Mã vụ việc, Tên công trình, Giai đoạn DAG, Điểm $R$, Hạn SLA, Thao tác.
- **Status**: IMPLEMENTED.

---

## 8. Data displayed
| Field | Meaning | Required | Source | Current status |
|---|---|:---:|---|---|
| Total Sites Monitored | Tổng số công trình đang giám sát | Có | D1 `sites` | REAL |
| Active Cases | Số hồ sơ vụ việc đang thụ lý | Có | D1 `cases` | REAL |
| Critical Alerts | Số cảnh báo ô nhiễm vượt ngưỡng chưa đóng | Có | D1 `alerts` | REAL |
| SLA Compliance Rate | Tỷ lệ xử lý vụ việc đúng hạn 48h | Có | Calculated Metric | REAL |
| Priority Cases List | Danh sách 5 hồ sơ ưu tiên xử lý | Có | D1 `cases` | REAL |

---

## 9. User actions
| Action | Trigger | Result | Permission | Status |
|---|---|---|---|---|
| Mở hồ sơ vụ việc ưu tiên | Bấm vào dòng trong bảng | Chuyển tới `/staff/cases/:id` | Staff | WORKING |
| Mở xử lý cảnh báo | Bấm [Xử lý ngay] trên Alert | Mở modal tạo Case từ Alert | Staff | WORKING |
| Tạo hồ sơ vụ việc mới | Bấm [Tạo hồ sơ vụ việc] | Mở form tạo Case mới | Staff | WORKING |
| Lọc theo khoảng thời gian | Chọn bộ lọc Hôm nay / Tuần này | Cập nhật số liệu dashboard | Staff | WORKING |

---

## 10. Primary action
- **Primary action**: `[Xử lý hồ sơ ưu tiên]` (Bấm vào dòng vụ việc)
- **Secondary**: `[Tạo hồ sơ vụ việc mới]`, `[Xem tất cả cảnh báo]`

---

## 11. Screen states
- **Loading state**: Hiển thị 4 Skeleton Cards và Skeleton Table trong khi fetch `/api/staff/dashboard`.
- **Empty state**: "Không có cảnh báo khẩn cấp nào trong ca trực hôm nay."
- **Error state**: Toast thông báo lỗi kèm nút "Thử lại".
- **Success state**: Tải dữ liệu D1 hoàn tất dưới 0.2s, hiển thị chỉ số chính xác.

---

## 12. UI Copy
- **Page title**: Bảng điều hành tác nghiệp
- **Short description**: Tổng hợp chỉ số vận hành, cảnh báo ô nhiễm và hồ sơ vụ việc ưu tiên xử lý.
- **Button labels**: `[Tạo hồ sơ vụ việc]`, `[Xử lý ngay]`, `[Xem tất cả]`

---

## 13. Text density budget
- Page title: 5 từ ($le 8$ từ)
- Description: 16 từ ($le 20$ từ)
- Primary CTA: 3 từ (`[Tạo hồ sơ mới]`)
- Card titles: 3–5 từ
- Status badges: 2–3 từ
- **Đạt chuẩn SCAN > READ trong 5 giây.**

---

## 14. Responsibility boundary
- **Staff ĐƯỢC**: Xem toàn bộ chỉ số, tạo hồ sơ mới, chỉ đạo xử lý cảnh báo, mở chi tiết vụ việc.
- **Staff KHÔNG ĐƯỢC**: Xóa vĩnh viễn dữ liệu D1 (thuộc quyền Admin).

---

## 15. Dependencies & Data reality
- **Dependencies**: React 19, Recharts, Lucide Icons, `staff-api.js`.
- **Data reality**: D1 Database SSOT kết nối qua `/api/staff/dashboard`.
