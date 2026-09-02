# STF-03 — Hồ Sơ Chi Tiết Công Trình & Dữ Liệu Quan Trắc (Site Detail)

## 1. Screen identity
- **Role**: Staff / Inspector
- **Route**: `/staff/sites/:id` (hỗ trợ sub-tabs `/staff/sites/:id/:tab`)
- **Component**: `src/apps/staff/pages/sites/SiteDetailPage.jsx`
- **Layout**: `src/apps/staff/layout/StaffLayout.jsx`
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
- **Primary action**: `[Tạo hồ sơ vụ việc]` (cho công trình này)
- **Secondary**: `[Chỉnh sửa thông tin]`, `[Xem trạm cảm biến]`
