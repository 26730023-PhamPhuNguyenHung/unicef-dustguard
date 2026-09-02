# STF-07 — Ma Trận Giám Sát Cảm Biến IoT Thời Gian Thực (Staff Monitoring)

## 1. Screen identity
- **Role**: Staff / Quản lý vận hành
- **Route**: `/staff/monitoring`
- **Component**: `src/apps/staff/pages/monitoring/StaffMonitoringPage.jsx`
- **Layout**: `src/apps/staff/layout/StaffLayout.jsx`
- **Navigation entry**: Sidebar Staff ("Giám sát IoT")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Theo dõi thời gian thực mạng lưới cảm biến bụi PM2.5, PM10, Gió, Độ ẩm; biểu đồ chuỗi thời gian 24 giờ và đối chiếu với ngưỡng giới hạn QCVN 05:2023/BTNMT để phát hiện sớm nguy cơ phát tán bụi diện rộng.
