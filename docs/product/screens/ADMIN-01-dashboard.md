# ADM-01 — Bảng Điều Khiển Quản Trị Hệ Thống (Admin Dashboard)

## 1. Screen identity
- **Role**: Admin / Quản trị viên kỹ thuật
- **Route**: `/admin`
- **Component**: `src/apps/admin/pages/dashboard/AdminDashboardPage.jsx`
- **Layout**: `src/apps/admin/layout/AdminLayout.jsx`
- **Navigation entry**: Gốc phân hệ quản trị
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Giám sát toàn bộ hạ tầng cơ sở dữ liệu Cloudflare D1 (46 bảng), số lượng bản ghi thực tế, tình trạng phân quyền tài khoản và tiến trình tự động hóa kiểm toán rủi ro.

---

## 2. Information hierarchy
1. **Bảng thống kê hạ tầng D1 (D1 Data Tables Stats)**: 46 Bảng quan hệ kèm số lượng bản ghi thực tế từng bảng.
2. **Tình trạng phân quyền tài khoản (RBAC Accounts Overview)**: Số lượng tài khoản theo từng vai trò (Citizen, Staff, Contractor, Admin).
3. **Tiến trình tự động hóa (Automation Sweep Runs)**: Nhật ký quét tính toán lại điểm rủi ro $R$ định kỳ của hệ thống.
4. **Công cụ bảo trì hệ thống (Maintenance Controls)**: Nạp dữ liệu mẫu demo, dọn dẹp thùng rác.

---

## 3. Primary action
- **Primary action**: `[Kích hoạt quét tự động]` (`/api/automation/sweep`)
- **Secondary**: `[Quản lý người dùng]`, `[Khôi phục Demo D1]`
