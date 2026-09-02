# STF-09 — Báo Cáo Điều Hành Chuẩn NĐ 30/2020/NĐ-CP (Staff Reports)

## 1. Screen identity
- **Role**: Staff / Executive / Lãnh đạo ban ngành
- **Route**: `/staff/reports`
- **Component**: `src/apps/staff/pages/reports/StaffReportsPage.jsx`
- **Layout**: `src/apps/staff/layout/StaffLayout.jsx`
- **Navigation entry**: Sidebar Staff ("Báo cáo điều hành")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Soạn thảo, ký số và xuất bản các báo cáo hành chính, biên bản kiểm tra và quyết định xử phạt vi phạm môi trường chuẩn khổ giấy A4 in ấn theo Nghị định 30/2020/NĐ-CP có mã băm bảo mật docHash chống làm giả.

---

## 2. Legal Document Standards (NĐ 30/2020/NĐ-CP)
- Khổ giấy A4 đứng (210mm x 297mm), lề chuẩn: Trên 20mm, Dưới 20mm, Trái 30mm, Phải 15mm.
- Quốc hiệu & Tiêu ngữ chuẩn kiểu chữ, cỡ chữ quy định.
- Tên cơ quan ban hành, số ký hiệu văn bản, địa danh và ngày tháng năm.
- Mã băm SHA-256 in chân trang (docHash) đối chứng tính toàn vẹn văn bản.

---

## 3. Primary action
- **Primary action**: `[In báo cáo A4 / Xuất PDF]`
- **Secondary**: `[Ký số HMAC]`, `[Chỉnh sửa nội dung biên bản]`
