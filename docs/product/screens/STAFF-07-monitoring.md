# STF-07 — Trung Tâm Quan Trắc Cảm Biến Thời Gian Thực

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/staff/monitoring`
- **Primary Role**: Kỹ sư quan trắc & Cán bộ phân tích số liệu (`staff`)
- **Secondary Roles**: Lãnh đạo (`executive`), Quản trị viên (`admin`)
- **Current Component**: `StaffMonitoringPage.jsx` (`app/src/apps/staff/pages/monitoring/StaffMonitoringPage.jsx`)
- **Layout**: `StaffLayout.jsx`
- **Primary Job**: Giám sát dòng dữ liệu quan trắc nồng độ bụi PM2.5/PM10 liên tục từ các trạm đo, phát hiện sớm các bất thường môi trường.
- **Success Condition**: Cán bộ quan sát được biểu đồ xu hướng nồng độ bụi theo giờ/ngày của từng trạm và nhận diện được khoảng thời gian vượt ngưỡng QCVN 05:2023.

---

## 2. WHY THIS SCREEN EXISTS
- Mặc dù hệ thống vẫn hoạt động 100% khi không có cảm biến, nhưng khi có trạm đo IoT, màn hình này cung cấp số liệu khách quan, liên tục 24/7 để hỗ trợ cán bộ ra quyết định điều động lực lượng kiểm tra đúng thời điểm bụi phát tán mạnh nhất.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Sidebar mục "Quan trắc", click từ Chi tiết công trình (`/staff/sites/:id`).
- **Exit Points**:
  - Click trạm đo có cảnh báo $\rightarrow$ Chuyển sang Xử lý cảnh báo (`/staff/alerts`).
  - Click công trình gắn trạm $\rightarrow$ Chuyển sang Hồ sơ công trình (`/staff/sites/:id`).
- **Navigation Item**: Sidebar item "Quan trắc" (icon Activity/Radio).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem số liệu quan trắc 24/7** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Chọn khoảng thời gian phân tích** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Xuất dữ liệu thô (.CSV)** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Cấu hình chu kỳ lấy mẫu trạm đo** | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Truy cập /staff/monitoring 
→ Chọn trạm đo cần phân tích từ danh sách trạm hoạt động
→ Chọn khoảng thời gian (1 giờ qua / 24 giờ qua / 7 ngày qua)
→ Xem biểu đồ đường so sánh PM2.5 và PM10 với đường ngưỡng QCVN 05:2023
→ Nhận diện đỉnh ô nhiễm (Spike) lúc thi công đào đất
→ Bấm "Lập cảnh báo kiểm tra" trực tiếp từ biểu đồ
```

---

## 6. INFORMATION HIERARCHY
1. **Header Block**: Tiêu đề "Trung Tâm Quan Trắc Cảm Biến 24/7", tổng số trạm hoạt động/ngoại tuyến, nút "Làm mới".
2. **Time Range & Station Filter**: Bộ chọn trạm đo, nút chuyển đổi nhanh khoảng thời gian (1h, 24h, 7d, Tùy chọn).
3. **Primary Chart Area**:
   - Biểu đồ chuỗi thời gian nồng độ PM2.5 & PM10 (đơn vị: $\mu\text{g/m}^3$).
   - Đường kẻ đứt màu đỏ thể hiện ngưỡng QCVN 05:2023 (PM2.5: $50\,\mu\text{g/m}^3$, PM10: $100\,\mu\text{g/m}^3$).
   - Vùng tô màu nổi bật khi nồng độ vượt ngưỡng an toàn.
4. **Readings Summary & Station Status Grid**:
   - Danh sách các trạm đo kèm chỉ số đo mới nhất, pin trạm, cường độ sóng và trạng thái kết nối.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Quan Trắc Cảm Biến 24/7` (≤ 5 từ)
- **Primary CTA**: `Xuất dữ liệu` (≤ 3 từ)
- **Nguyên tắc IoT**: IoT chỉ là nguồn tín hiệu hỗ trợ (optional signal source), không xem điểm số sensor là căn cứ xử phạt duy nhất.

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Danh sách trạm đo | Yes | `sensors` table | `sensors.name, sensors.code` | `[]` |
| Dữ liệu đo chuỗi thời gian | Yes | `sensor_readings` | `pm10, pm25, timestamp` | `[]` |
| Trạng thái trạm | Yes | `sensors` table | `sensors.status` | `OFFLINE` |

- **Current Implementation**: `GET /api/sensors/readings?sensorId=&range=24h`, `GET /api/sensors/locations`

---

## 9. DESKTOP & MOBILE BEHAVIOR
- **Desktop (1366×768)**: Biểu đồ toàn màn hình hiển thị tooltip chi tiết khi rê chuột, bảng trạm đo nằm cạnh bên.
- **Mobile (360–430px)**: Biểu đồ co giãn tỉ lệ theo chiều ngang, hỗ trợ cử chỉ chạm vuốt (pinch-to-zoom) để xem các điểm dữ liệu cụ thể.

---

## 10. ACCEPTANCE CRITERIA
- [ ] Dữ liệu quan trắc tải đầy đủ và vẽ biểu đồ mượt mà không crash.
- [ ] Hiển thị chính xác đường tham chiếu ngưỡng quy chuẩn QCVN 05:2023.
- [ ] Hệ thống vẫn hiển thị thông báo rõ ràng khi không có trạm đo nào được lắp đặt.

---

## 11. IMPLEMENTATION STATUS
- **CURRENT**: Danh sách trạm đo, vẽ biểu đồ chuỗi thời gian PM2.5/PM10, lọc theo thời gian.
- **PARTIAL**: Cảnh báo vượt ngưỡng tự động kích hoạt trên biểu đồ.
- **PROPOSED**: Tích hợp hướng gió và nhiệt độ/độ ẩm từ trạm khí tượng mở.
