# CON-04 — Báo Cáo Định Kỳ Tuân Thủ Bảo Vệ Môi Trường

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/contractor/reports`
- **Primary Role**: Bộ phận Pháp chế / ATLĐ Nhà thầu (`contractor`)
- **Secondary Roles**: Quản trị viên (`admin`), Cán bộ giám sát (`staff`)
- **Current Component**: `ContractorReportsPage.jsx` (`app/src/apps/contractor/pages/reports/ContractorReportsPage.jsx`)
- **Layout**: `ContractorLayout.jsx`
- **Primary Job**: Tổng hợp báo cáo định kỳ công tác bảo vệ môi trường công trường (nhật ký tưới nước, nhật ký rửa xe ben, bảo dưỡng bạt che) để nộp chủ đầu tư và cơ quan quản lý.
- **Success Condition**: Nhà thầu xuất bản được Báo cáo tuân thủ môi trường định kỳ có số liệu minh chứng và tải về file PDF.

---

## 2. WHY THIS SCREEN EXISTS
- Quy chuẩn QCVN 18:2021/BXD và hợp đồng xây dựng yêu cầu nhà thầu phải có nhật ký và báo cáo định kỳ về bảo vệ môi trường. Màn hình này tự động hóa việc tổng hợp nhật ký khắc phục thành bộ hồ sơ tuân thủ hoàn chỉnh.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Sidebar / Header mục "Báo cáo tuân thủ", click từ Bàn làm việc (`/contractor`).
- **Exit Points**:
  - Click "Tải báo cáo PDF" $\rightarrow$ Xuất file PDF.
  - Nút quay lại $\rightarrow$ Về Dashboard (`/contractor`).
- **Navigation Item**: Sidebar / Header item "Báo cáo" (icon FileText).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem danh sách báo cáo tuân thủ** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Khởi tạo báo cáo kỳ mới** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Xuất file PDF báo cáo môi trường** | ❌ | ❌ | ✅ | ✅ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Truy cập /contractor/reports 
→ Chọn kỳ báo cáo: "Tuần này" | "Tháng này" | "Quý này"
→ Xem bảng tổng hợp: Số lần tưới nước, Số xe ben đã rửa, Số yêu cầu khắc phục đã hoàn thành 100%
→ Nhập thông tin người lập báo cáo và đại diện chỉ huy trưởng
→ Bấm "XUẤT BÁO CÁO TUÂN THỦ PDF"
```

---

## 6. INFORMATION HIERARCHY
1. **Header Block**: Tiêu đề "Báo Cáo Định Kỳ Tuân Thủ Bảo Vệ Môi Trường", nút "Lập báo cáo mới".
2. **Period Selector**: Chọn tháng/quý và dự án thi công.
3. **Compliance Statistics Summary (4 Thẻ Chỉ Số)**:
   - `Tỷ lệ khắc phục đúng hạn`: 98% (Xanh lá)
   - `Tổng số lượt dập bụi`: 124 lượt
   - `Sự cố môi trường phát sinh`: 2 vụ (Đã xử lý 2/2)
   - `Điểm đánh giá tuân thủ`: Hạng A (Tốt)
4. **Historical Reports List**: Danh sách các báo cáo đã nộp kèm ngày nộp và link tải PDF.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Báo Cáo Tuân Thủ Môi Trường` (≤ 5 từ)
- **Primary CTA**: `Xuất báo cáo PDF` (≤ 4 từ)

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Danh sách báo cáo | Yes | `draft_documents` | `draft_documents WHERE documentType='contractor_compliance'` | `[]` |
| Tỷ lệ tuân thủ | Yes | `actions` table | `COUNT(RESOLVED) / COUNT(ALL)` | `100%` |

- **Current Implementation**: `GET /api/contractor/reports`, `POST /api/contractor/reports/generate`

---

## 9. ACCEPTANCE CRITERIA
- [ ] Tự động tổng hợp chính xác số lượt khắc phục và tỷ lệ hoàn thành từ D1.
- [ ] Xuất file PDF đúng định dạng báo cáo môi trường xây dựng.

---

## 10. IMPLEMENTATION STATUS
- **CURRENT**: Xem thống kê tuân thủ, danh sách báo cáo, tạo báo cáo định kỳ.
- **PARTIAL**: Xuất bản file PDF hoàn chỉnh.
- **PROPOSED**: Tự động gửi email báo cáo cho Chủ đầu tư và Ban quản lý dự án.
