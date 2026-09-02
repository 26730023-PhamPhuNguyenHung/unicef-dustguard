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

## 3. Information hierarchy
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

## 4. Above-the-fold content
- **MUST SEE**: 4 Thẻ chỉ số vận hành, Nút [Tạo hồ sơ vụ việc], Danh sách 3 cảnh báo khẩn cấp nhất.
- **SHOULD SEE**: Bảng top 5 vụ việc ưu tiên cao.
- **BELOW FOLD**: Biểu đồ phân tích xu hướng ô nhiễm theo tuần và lịch phân công kiểm tra.

---

## 5. Primary action
- **Primary action**: `[Xử lý hồ sơ ưu tiên]` (Bấm vào dòng vụ việc $ightarrow$ `/staff/cases/:id`)
- **Secondary**: `[Tạo hồ sơ mới]`, `[Xem tất cả cảnh báo]`

---

## 6. Data reality
- 100% Số liệu được tổng hợp trực tiếp từ Cloudflare D1 (`/api/staff/dashboard`). Zero mock data.
