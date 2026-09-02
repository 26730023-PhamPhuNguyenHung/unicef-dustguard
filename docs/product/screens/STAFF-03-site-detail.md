# STF-03 — Hồ Sơ Chi Tiết Công Trình & Quan Trắc Thực Địa (Site Detail)

## 1. Screen identity
- **Role**: Staff / Inspector
- **Route**: `/staff/sites/:id` (hỗ trợ sub-tabs `/staff/sites/:id/:tab`)
- **Component**: `src/apps/staff/pages/sites/SiteDetailPage.jsx`
- **Layout**: `src/apps/staff/layout/StaffLayout.jsx`
- **Navigation entry**: Bấm từ danh sách công trình (`/staff/sites`) hoặc bản đồ (`/map`)
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Hồ sơ số toàn diện của một công trình xây dựng: thông tin pháp lý nhà thầu, tọa độ WGS84, công thức chi tiết điểm rủi ro $R$, biểu đồ chuỗi thời gian PM2.5/PM10 trực tiếp từ cảm biến, lịch sử vi phạm và biên bản kiểm tra.

---

## 2. Information hierarchy & 5 Sub-Tabs
1. **Thanh Header nhận diện công trình (Site Identity Header)**:
   - Tên công trình lớn (H1), Mã số định danh (VD: `BD-0001`), Địa chỉ thi công.
   - Huy hiệu Điểm rủi ro $R$ kích thước lớn (VD: `Điểm rủi ro: 78 / 100 — Mức Cao`).
   - Nút thao tác nhanh: `[Tạo vụ việc]`, `[Chỉnh sửa]`, `[Lập biên bản]`.
2. **Thanh điều hướng Tabs chuyên sâu**:
   - **Tab 1 — Tổng quan (Overview)**: Thông tin nhà thầu, diện tích thi công ($m^2$), lưu lượng xe tải (chuyến/ngày), đánh giá che chắn bạt, bảng bóc tách công thức $R = sum w_i S_i$.
   - **Tab 2 — Cảm biến & Đo đạc (Sensors & Readings)**: Danh sách các đầu đo bụi (PM2.5, PM10, Gió, Độ ẩm), Biểu đồ đường thời gian thực 24 giờ đối chiếu ngưỡng QCVN 05:2023.
   - **Tab 3 — Hồ sơ vụ việc (Cases)**: Lịch sử toàn bộ các vụ việc xử lý vi phạm liên quan đến công trình qua 7 bước DAG.
   - **Tab 4 — Biên bản khảo sát (Inspections)**: Danh sách các biên bản kiểm tra hiện trường đã lập.
   - **Tab 5 — Lịch sử kiểm toán (Audit Trail)**: Biểu đồ lịch sử thay đổi điểm số rủi ro $R$ theo thời gian.

---

## 3. Data displayed
| Field | Meaning | Required | Source | Current status |
|---|---|:---:|---|---|
| Site Name & Code | Tên & Mã định danh công trình | Có | D1 `sites` | REAL |
| Contractor Details | Tên công ty, Chỉ huy trưởng, Số điện thoại | Có | D1 `sites` | REAL |
| Coordinates (Lat, Lng) | Tọa độ WGS84 phục vụ kiểm tra Geofence 50m | Có | D1 `sites` | REAL |
| Risk Factors ($S_1, S_2, S_3, S_4$) | 4 Tham số tính điểm rủi ro | Có | D1 `sites` | REAL |
| Telemetry PM2.5 / PM10 | Chuỗi số liệu nồng độ bụi 24h | Không | D1 `sensor_readings` | REAL |
| Related Cases | Danh sách hồ sơ vụ việc liên quan | Không | D1 `cases` | REAL |

---

## 4. Primary action
- **Primary action**: `[Tạo hồ sơ vụ việc mới]` (gắn với công trình này)
- **Secondary**: `[Lập biên bản khảo sát]`, `[Chỉnh sửa tham số rủi ro]`
