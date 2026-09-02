# STF-01 — Bảng Điều Hành Tác Nghiệp (Staff Dashboard)

## 1. Screen identity
- Role: Staff / Inspector
- Route: `/staff`
- Component: `apps/staff/pages/dashboard/StaffDashboardPage.jsx`
- Layout: `apps/staff/layout/StaffLayout.jsx`
- Navigation entry: Gốc phân hệ cán bộ
- Current implementation status: ACTIVE (Level 5 Production)

Purpose: Bảng điều hành tổng thể dành cho cán bộ quản lý môi trường: giám sát 12 chỉ số tác nghiệp trọng yếu, danh sách cảnh báo ô nhiễm khẩn cấp và hồ sơ vi phạm cần xử lý ngay trong ngày.

---

## 2. User goal
- Quyết định công việc ưu tiên cần thực hiện trong ca trực.
- Phát hiện ngay các công trình có chỉ số ô nhiễm vượt ngưỡng QCVN.
- Chuyển nhanh tới hồ sơ vụ việc hoặc công trình để điều hành xử lý.

---

## 3. Information hierarchy
1. Thanh tiêu đề & Ngày làm việc, Nút tạo hồ sơ vụ việc mới
2. Lưới 4 thẻ chỉ số vận hành chính (Tổng công trình, Vụ việc đang thụ lý, Cảnh báo khẩn, Tỷ lệ xử lý đúng hạn SLA)
3. Khối cảnh báo ô nhiễm vượt ngưỡng thời gian thực (Real-time Alerts Strip)
4. Bảng danh sách 5 Hồ sơ vụ việc có điểm rủi ro cao nhất cần phê duyệt/khảo sát
5. Ma trận phân bố rủi ro các công trình trên địa bàn

---

## 4. Above-the-fold content
- **MUST SEE**: 4 Thẻ chỉ số (Số công trình có rủi ro cao, Số vụ việc quá hạn SLA, Cảnh báo chưa xử lý), Nút [Tạo hồ sơ vụ việc].
- **SHOULD SEE**: Danh sách 3 cảnh báo mới nhất kèm mức độ nghiêm trọng.
- **BELOW FOLD**: Biểu đồ phân tích xu hướng ô nhiễm theo tuần/tháng.

---

## 5. Primary action
- Primary action: [Xử lý hồ sơ ưu tiên] (Chuyển sang `/staff/cases/:id`)
- Secondary: [Xem tất cả cảnh báo], [Tạo hồ sơ mới]
