# STF-08 — Trung Tâm Xử Lý Cảnh Báo Ô Nhiễm (Staff Alerts)

## 1. Screen identity
- **Role**: Staff / Inspector
- **Route**: `/staff/alerts`
- **Component**: `src/apps/staff/pages/alerts/StaffAlertsPage.jsx`
- **Layout**: `src/apps/staff/layout/StaffLayout.jsx`
- **Navigation entry**: Sidebar Staff ("Cảnh báo")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Tiếp nhận và xử lý các sự kiện nồng độ bụi vượt ngưỡng an toàn do cảm biến tự động gửi về; kích hoạt quy trình tạo hồ sơ vụ việc chỉ với 1 click để cử đoàn thanh tra xử lý ngay.

---

## 2. Alert Severity Levels
- **Mức 1 — Chú ý (Vàng)**: Nồng độ PM2.5 vượt $50mu	ext{g/m}^3$ liên tục 15 phút.
- **Mức 2 — Nghiêm trọng (Cam)**: Nồng độ PM2.5 vượt $100mu	ext{g/m}^3$ liên tục 30 phút.
- **Mức 3 — Khẩn cấp (Đỏ)**: Nồng độ PM2.5 vượt $150mu	ext{g/m}^3$ hoặc phát hiện bụi mù phát tán ra đường dân sinh.

---

## 3. Primary action
- **Primary action**: `[Tạo hồ sơ xử lý 1-Click]` (Tự động tạo Case từ Alert)
- **Secondary**: `[Xác minh hiện trường]`, `[Đóng cảnh báo giả lập]`
