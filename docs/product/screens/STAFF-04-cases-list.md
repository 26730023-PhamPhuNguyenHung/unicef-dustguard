# STF-04 — Danh Mục Hồ Sơ Vụ Việc

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/staff/cases`
- **Primary Role**: Cán bộ thụ lý & Đội trưởng thanh tra (`staff`)
- **Secondary Roles**: Lãnh đạo điều hành (`executive`), Quản trị viên (`admin`)
- **Current Component**: `CasesListPage.jsx` (`app/src/apps/staff/pages/cases/CasesListPage.jsx`)
- **Layout**: `StaffLayout.jsx`
- **Primary Job**: Quản lý toàn diện các vụ việc phát sinh, theo dõi tiến độ theo quy trình 7 bước DAG và kiểm soát thời hạn cam kết SLA.
- **Success Condition**: Cán bộ lọc nhanh được các vụ việc thuộc bước tác nghiệp của mình và phát hiện các vụ việc có nguy cơ trễ hạn xử lý.

---

## 2. WHY THIS SCREEN EXISTS
- Quy trình xử lý ô nhiễm bụi công trình đòi hỏi sự phối hợp chặt chẽ qua 7 bước: Tiếp nhận $\rightarrow$ Khảo sát $\rightarrow$ Đề xuất $\rightarrow$ Ban hành văn bản $\rightarrow$ Nhà thầu khắc phục $\rightarrow$ Nghiệm thu $\rightarrow$ Đóng hồ sơ. Màn hình này là trung tâm điều phối và theo dõi tiến độ của tất cả vụ việc.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Sidebar mục "Vụ việc", click từ Dashboard ca trực (`/staff`), hoặc chuyển tiếp từ cảnh báo khẩn cấp.
- **Exit Points**:
  - Click hàng vụ việc $\rightarrow$ Chuyển đến Không gian thụ lý vụ việc (`/staff/cases/:id`).
  - Click nút "Tạo vụ việc mới" $\rightarrow$ Mở Drawer khởi tạo vụ việc thủ công.
- **Navigation Item**: Sidebar item "Vụ việc" (icon Briefcase/FileText) kèm badge số vụ đang chờ.

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem danh sách vụ việc** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Lọc theo 7 bước quy trình** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Khởi tạo vụ việc mới** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Gán cán bộ phụ trách** | ❌ | ❌ | ✅ | ❌ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Truy cập /staff/cases 
→ Xem thanh trạng thái 7 bước (Tiếp nhận | Khảo sát | Đề xuất | ...)
→ Bấm chọn 1 bước cần xử lý (ví dụ: "Cần khảo sát")
→ Bảng lọc ra các vụ việc tương ứng kèm thời gian đếm ngược SLA
→ Click vào vụ việc cần xử lý để mở Không gian thụ lý (/staff/cases/:id)
```

---

## 6. INFORMATION HIERARCHY
1. **Page Header**: Tiêu đề "Danh Mục Vụ Việc", bộ đếm tổng số vụ đang xử lý, nút "Khởi tạo vụ việc".
2. **Workflow Filter Tabs (7 Bước DAG)**:
   - `Tất cả` | `Tiếp nhận` | `Khảo sát` | `Đề xuất` | `Ban hành VB` | `Khắc phục` | `Nghiệm thu` | `Hoàn tất`
3. **Filter Toolbar**: Lọc theo Mức độ khẩn cấp (`Cao / Trung bình / Thấp`), Lọc theo Cán bộ thụ lý, Ô tìm kiếm theo mã hồ sơ.
4. **Main Cases Table**:
   - Mã vụ việc (`DG-2026-XXXX`)
   - Tên công trình & Địa chỉ
   - Nguồn phát sinh (Phản ánh công dân / Cảnh báo cảm biến / Tự phát hiện)
   - Bước hiện tại (Badge có màu chỉ định theo DAG)
   - Thời hạn SLA (Đồng hồ đếm ngược / Cảnh báo quá hạn)
   - Cán bộ thụ lý
   - Hành động: Nút "Thụ lý ngay"
5. **Pagination**: Điều hướng trang.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Danh Mục Vụ Việc` (≤ 4 từ)
- **Primary CTA**: `Khởi tạo vụ việc` (≤ 4 từ)
- **Table Headers**: `Mã hồ sơ | Công trình | Nguồn tin | Tiến độ | Thời hạn SLA | Cán bộ | Thao tác`
- **Zero Truncate**: Mã hồ sơ (`DG-2026-XXXX`) và tên công trình không bị che khuất.

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Mã vụ việc | Yes | `cases` table | `cases.code` | `DG-CASE-XXX` |
| Tên công trình | Yes | `sites` table | `sites.name` | `Công trình chưa gắn mã` |
| Bước hiện tại | Yes | `cases` table | `cases.currentStep` | `INSPECTION` |
| Hạn SLA | Yes | `cases` table | `cases.slaDeadline` | `—` |
| Người thụ lý | No | `users` / `profiles` | `profiles.fullName` | `Chưa phân công` |

- **Current Implementation**: `GET /api/cases?step=&priority=&search=&page=1`
- **Safe Normalization**: Unwrap mảng `data.cases || []` bảo đảm an toàn dữ liệu.

---

## 9. STATE MODEL
- **Loading**: Bảng Skeleton 6 dòng.
- **Empty**: "Không có vụ việc nào trong giai đoạn này".
- **Error**: "Lỗi tải danh sách hồ sơ vụ việc" kèm nút tải lại.
- **Overdue SLA**: Hiển thị nhãn đỏ "Quá hạn SLA" nổi bật ở đầu dòng.

---

## 10. DESKTOP & MOBILE BEHAVIOR
- **Desktop (1366×768)**: Tab 7 bước dàn ngang rõ nét, bảng đầy đủ cột, đồng hồ SLA cập nhật thời gian thực.
- **Mobile (360–430px)**: Tab 7 bước chuyển thành thanh cuộn ngang, bảng chuyển thành danh sách Thẻ Vụ Việc (Card). Mỗi thẻ hiển thị Mã hồ sơ, Tên công trình, Badge bước và Thanh đếm ngược SLA.

---

## 11. ACCEPTANCE CRITERIA
- [ ] Bấm vào từng tab trong 7 bước lọc chính xác danh sách vụ việc.
- [ ] Tính toán thời hạn SLA chính xác theo thời gian thực (đếm ngược giờ/phút).
- [ ] Mã hồ sơ và tên công trình hiển thị trọn vẹn, không truncate.
- [ ] Chuyển tiếp mượt mà đến trang chi tiết `/staff/cases/:id`.

---

## 12. IMPLEMENTATION STATUS
- **CURRENT**: Danh sách vụ việc, bộ lọc 7 bước DAG, tính toán SLA, phân trang.
- **PARTIAL**: Khởi tạo nhanh vụ việc từ Modal.
- **PROPOSED**: Xuất danh sách vụ việc ra file Excel/CSV theo kỳ kiểm tra.
