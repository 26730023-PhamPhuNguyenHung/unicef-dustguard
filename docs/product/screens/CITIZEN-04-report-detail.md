# CIT-04 — Chi Tiết Phản Ánh & Tiến Độ Xử Lý (Report Detail)

## 1. Screen identity
- Role: Citizen / Staff
- Route: `/citizen/reports/:id`
- Component: `apps/citizen/pages/reports/ReportDetailPage.jsx`
- Layout: `apps/citizen/layout/CitizenLayout.jsx`
- Navigation entry: Bấm từ danh sách phản ánh
- Current implementation status: ACTIVE (Level 5 Production)

Purpose: Xem chi tiết toàn diện một phản ánh: ảnh bằng chứng gốc với mã hash SHA-256, dòng thời gian thụ lý của cán bộ, ảnh đối chứng khắc phục Trước/Sau và bổ sung cập nhật theo dõi (Follow-up).
