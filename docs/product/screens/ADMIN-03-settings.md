# ADM-03 — Cấu Hình Hệ Thống & Khôi Phục Dữ Liệu Demo (System Settings)

## 1. Screen identity
- **Role**: Admin
- **Route**: `/admin/settings`
- **Component**: `src/apps/admin/pages/settings/SettingsPage.jsx`
- **Layout**: `src/apps/admin/layout/AdminLayout.jsx`
- **Navigation entry**: Sidebar Admin ("Cấu hình")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Cấu hình các tham số vận hành hệ thống: ngưỡng kích hoạt cảnh báo QCVN 05:2023, chính sách tự động quét rủi ro (Automation Sweep), dọn dẹp thùng rác và công cụ khôi phục cơ sở dữ liệu mẫu D1 (Demo Reset).
