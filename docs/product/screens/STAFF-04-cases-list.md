# STF-04 — Danh Sách Hồ Sơ Vụ Việc Xử Lý Vi Phạm (Cases List)

## 1. Screen identity
- **Role**: Staff / Thanh tra môi trường / Pháp chế
- **Route**: `/staff/cases`
- **Component**: `src/apps/staff/pages/cases/CasesListPage.jsx`
- **Layout**: `src/apps/staff/layout/StaffLayout.jsx`
- **Navigation entry**: Sidebar Staff ("Hồ sơ vụ việc")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Quản lý toàn bộ hồ sơ vụ việc xử lý vi phạm theo chu trình 7 bước (DAG), phân loại theo giai đoạn tác nghiệp và theo dõi hạn chót SLA 48 giờ để chống tồn đọng hồ sơ.

---

## 2. 7-Step DAG Pipeline Stages
1. `INTAKE`: Tiếp nhận phản ánh ban đầu.
2. `SURVEYED`: Đã khảo sát hiện trường & lập biên bản.
3. `PROPOSED`: Đã đề xuất biện pháp xử lý / mức phạt.
4. `APPROVED`: Lãnh đạo đã phê duyệt quyết định.
5. `REMEDIATED`: Nhà thầu đã nộp minh chứng khắc phục $le 50	ext{m}$.
6. `VERIFIED`: Cán bộ đã nghiệm thu hiện trường đạt yêu cầu.
7. `CLOSED`: Đóng hồ sơ vụ việc & lưu trữ kiểm toán.

---

## 3. Table specification
| Cột | Ý nghĩa | Badge / Format |
|---|---|---|
| **Mã vụ việc** | Định danh duy nhất (VD: `CASE-2026-0042`) | Text nổi bật |
| **Công trình** | Tên công trình liên quan | Zero truncate |
| **Giai đoạn (Stage)** | 1 trong 7 bước DAG | Badge màu theo bước |
| **Điểm rủi ro** | Mức độ nghiêm trọng của vụ việc | 4 Cấp màu |
| **Hạn chót SLA** | Thời gian còn lại (VD: `Còn 14h`, `Quá hạn 2h`) | Đỏ nếu quá hạn |
| **Cán bộ thụ lý** | Người chịu trách nhiệm chính | Text |
