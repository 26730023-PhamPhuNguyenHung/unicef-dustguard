# PUB-06 — Bàn Mô Phỏng Tín Hiệu Cảm Biến IoT

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/demo/iot`
- **Primary Role**: Kỹ thuật viên / Ban Giám khảo / Người thử nghiệm (`tech` / `evaluator`)
- **Secondary Roles**: Quản trị viên (`admin`)
- **Current Component**: `IoTDemo.jsx` (`app/src/modules/public/IoTDemo.jsx`)
- **Layout**: Public Container View
- **Primary Job**: Bơm dòng dữ liệu telemetry giả lập (nồng độ PM2.5, PM10, AQI) vào hệ thống để kiểm tra khả năng phát hiện vượt ngưỡng và kích hoạt cảnh báo tự động trong thời gian thực.
- **Success Condition**: Người dùng kéo thanh trượt nồng độ bụi vượt ngưỡng $100\,\mu\text{g/m}^3$ và thấy hệ thống tự động sinh cảnh báo đỏ trên màn hình Staff trong vòng 2 giây.

---

## 2. WHY THIS SCREEN EXISTS
- Trong môi trường thi đấu hoặc demo trong phòng kín không có bụi thật, màn hình này đóng vai trò máy phát tín hiệu giả lập (Signal Generator) giúp Ban Giám khảo kiểm chứng tính phản ứng nhanh của chuỗi xử lý: *Cảm biến tăng cao $\rightarrow$ Kích hoạt cảnh báo $\rightarrow$ Tạo nhiệm vụ kiểm tra*.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Nút "Bàn mô phỏng IoT" từ Demo Hub (`/demo`), link từ màn hình Quan trắc (`/staff/monitoring`).
- **Exit Points**:
  - Bấm "Xem kết quả bên Cán bộ" $\rightarrow$ Mở Bảng cảnh báo `/staff/alerts`.
  - Nút quay lại $\rightarrow$ Về Demo Hub (`/demo`).
- **Navigation Item**: Sub-navigation item trong Demo Hub.

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem bàn mô phỏng IoT** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Kéo thanh trượt đổi giá trị PM** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Bơm xung bụi đột biến (Spike)** | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Mở /demo/iot 
→ Chọn trạm đo cần mô phỏng (ví dụ: "Trạm Công trình Cầu Rồng")
→ Kéo thanh trượt PM10 từ 35 µg/m³ lên 185 µg/m³ (vượt ngưỡng đỏ)
→ Bấm nút "BƠM TÍN HIỆU NGAY"
→ Xem đồ thị tại chỗ nhảy vọt nồng độ bụi
→ Hệ thống thông báo: "Đã kích hoạt Cảnh báo khẩn cấp #ALT-2026-089 gửi tới Ca trực Cán bộ"
```

---

## 6. INFORMATION HIERARCHY
1. **Header Block**: Tiêu đề "Bàn Mô Phỏng Tín Hiệu Cảm Biến IoT", công tắc bật/tắt chế độ tự động bơm số liệu.
2. **Interactive Controls Panel (Bảng Điều Khiển)**:
   - Thanh trượt điều chỉnh nồng độ PM2.5 ($0 - 300\,\mu\text{g/m}^3$)
   - Thanh trượt điều chỉnh nồng độ PM10 ($0 - 500\,\mu\text{g/m}^3$)
   - Các nút kích hoạt kịch bản mẫu:
     - 🟢 *Không khí trong lành (PM10: 25)*
     - 🟡 *Bụi trung bình (PM10: 75)*
     - 🔴 *Xe ben làm rơi vãi đất (Spike PM10: 220)*
3. **Real-time Live Gauge & Mini Chart**: Đồng hồ đo kim và biểu đồ sóng nhảy tức thì khi thay đổi thanh trượt.
4. **Dispatched Event Log**: Danh sách các sự kiện cảnh báo vừa được bắn vào backend D1.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Mô Phỏng Cảm Biến IoT` (≤ 5 từ)
- **Primary CTA**: `Bơm tín hiệu` (≤ 3 từ)

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Field | Target API / DB | Fallback |
|---|:---:|---|---|---|
| Giá trị PM10/PM2.5 | Yes | Slider input | `sensor_readings` table | `0` |
| ID trạm đo | Yes | Dropdown | `sensors.id` | Trạm mặc định |

- **Current Implementation**: `POST /api/sensors/simulate`

---

## 9. ACCEPTANCE CRITERIA
- [ ] Bơm tín hiệu thành công lưu ngay 1 bản ghi mới vào bảng `sensor_readings`.
- [ ] Khi giá trị vượt ngưỡng QCVN 05:2023, tự động kích hoạt tạo bản ghi trong bảng `alerts`.

---

## 10. IMPLEMENTATION STATUS
- **CURRENT**: Giao diện mô phỏng, thanh trượt PM2.5/PM10, các kịch bản mẫu, bơm dữ liệu vào D1.
- **PARTIAL**: Tự động phát sinh chuỗi dữ liệu ngẫu nhiên (Random Walk Simulator).
- **PROPOSED**: Mô phỏng cùng lúc cả mạng lưới 10 trạm đo trên toàn thành phố.
