# STF-07 — Ma Trận Giám Sát Cảm Biến IoT Thời Gian Thực (Staff Monitoring)

## 1. Screen identity
- **Role**: Staff / Quản lý vận hành mạng lưới
- **Route**: `/staff/monitoring`
- **Component**: `src/apps/staff/pages/monitoring/StaffMonitoringPage.jsx`
- **Layout**: `src/apps/staff/layout/StaffLayout.jsx`
- **Navigation entry**: Sidebar Staff ("Giám sát IoT")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Theo dõi thời gian thực mạng lưới cảm biến bụi PM2.5, PM10, Gió, Độ ẩm; biểu đồ chuỗi thời gian 24 giờ và đối chiếu với ngưỡng giới hạn QCVN 05:2023/BTNMT để phát hiện sớm nguy cơ phát tán bụi diện rộng.

---

## 2. Information hierarchy
1. **Thanh chỉ số tổng quan mạng lưới**: Tổng số trạm đo (Trực tuyến / Ngoại tuyến / Vượt ngưỡng), Nồng độ PM2.5 trung bình toàn thành phố.
2. **Biểu đồ chuỗi thời gian nồng độ bụi 24h (Telemetry Time-Series Chart)**: So sánh đường PM2.5 đo đạc với đường đỏ ngưỡng chuẩn QCVN ($50mu	ext{g/m}^3$).
3. **Lưới thẻ trạm cảm biến (Sensor Station Grid)**: Danh sách từng trạm đo gắn với công trình, hiển thị chỉ số hiện tại, mức pin và thời điểm ping gần nhất.
4. **Bảng phân tích tương quan thời tiết (Weather Correlation)**: Hướng gió, tốc độ gió và độ ẩm ảnh hưởng đến phát tán bụi.

---

## 3. Primary action
- **Primary action**: Bấm vào trạm đo có cảnh báo $ightarrow$ Xem chi tiết và kích hoạt cảnh báo
- **Secondary**: `[Xuất dữ liệu đo đạc CSV]`, `[Cấu hình ngưỡng cảnh báo]`
