# STF-05 — Chi Tiết Quy Trình 7 Bước Vụ Việc (Case Detail DAG)

## 1. Screen identity
- Role: Staff / Inspector / Legal
- Route: `/staff/cases/:id`
- Component: `apps/staff/pages/cases/CaseDetailPage.jsx`
- Layout: `apps/staff/layout/StaffLayout.jsx`
- Navigation entry: Bấm dòng vụ việc
- Current implementation status: ACTIVE (Level 5 Production)

Purpose: Không gian tác nghiệp chính của cán bộ thanh tra: thực hiện chuyển trạng thái 7 bước (Tiếp nhận $ightarrow$ Khảo sát $ightarrow$ Đề xuất $ightarrow$ Phê duyệt $ightarrow$ Khắc phục $ightarrow$ Nghiệm thu $ightarrow$ Hoàn tất), giao nhiệm vụ cho nhà thầu và xuất quyết định xử phạt.
