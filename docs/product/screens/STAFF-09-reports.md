# STF-09 — Trung Tâm Báo Cáo Hành Chính NĐ 30/2020

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/staff/reports`
- **Primary Role**: Cán bộ tổng hợp & Lãnh đạo phê duyệt (`staff` / `executive`)
- **Secondary Roles**: Quản trị viên (`admin`)
- **Current Component**: `StaffReportsPage.jsx` (`app/src/apps/staff/pages/reports/StaffReportsPage.jsx`)
- **Layout**: `StaffLayout.jsx`
- **Primary Job**: Xuất bản các báo cáo thống kê định kỳ, biên bản kiểm tra và tờ trình xử lý theo đúng thể thức văn bản hành chính quy định tại Nghị định 30/2020/NĐ-CP.
- **Success Condition**: Cán bộ xuất bản được file báo cáo PDF chuẩn khổ A4, có mã định danh toàn vẹn `docHash` và đầy đủ các trường thông tin theo quy định.

---

## 2. WHY THIS SCREEN EXISTS
- Hoạt động quản lý nhà nước đòi hỏi tính pháp lý và chuẩn mực văn bản. Màn hình này tự động hóa việc tổng hợp số liệu từ D1 SQLite thành các biểu mẫu báo cáo A4 chuẩn thể thức NĐ 30/2020/NĐ-CP (Quốc hiệu, Tiêu ngữ, Số/Ký hiệu, Nơi nhận, Chữ ký), giúp tiết kiệm 90% thời gian soạn thảo thủ công.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Sidebar mục "Báo cáo", click từ Chi tiết vụ việc (`/staff/cases/:id`).
- **Exit Points**:
  - Click "Xem bản in A4" $\rightarrow$ Mở cửa sổ in ấn / Xem trước PDF.
  - Tải file $\rightarrow$ Tải báo cáo định dạng PDF/Word.
- **Navigation Item**: Sidebar item "Báo cáo" (icon FileText/Printer).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem danh sách báo cáo** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Khởi tạo báo cáo định kỳ mới** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Xem trước bản in A4 chuẩn NĐ 30**| ❌ | ❌ | ✅ | ❌ | ✅ |
| **Ký số / Ban hành chính thức** | ❌ | ❌ | ✅ *(Lãnh đạo)* | ❌ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Truy cập /staff/reports 
→ Chọn loại văn bản: "Báo cáo định kỳ tháng" | "Biên bản kiểm tra hiện trường" | "Tờ trình xử lý"
→ Chọn khoảng thời gian và phạm vi địa bàn (Quận/Phường)
→ Hệ thống tự động tổng hợp số liệu D1 và điền vào mẫu A4
→ Cán bộ kiểm tra nội dung tại khung Preview A4
→ Bấm "In báo cáo" hoặc "Lưu văn bản chính thức" kèm mã băm SHA-256
```

---

## 6. INFORMATION HIERARCHY
1. **Header Block**: Tiêu đề "Trung Tâm Báo Cáo Hành Chính NĐ 30/2020", nút "Lập báo cáo mới".
2. **Template Selector Bar**: Các tab biểu mẫu:
   - `Mẫu 01: Báo cáo tình hình ô nhiễm bụi công trình theo kỳ`
   - `Mẫu 02: Biên bản làm việc kiểm tra trật tự xây dựng & môi trường`
   - `Mẫu 03: Tờ trình đề xuất xử phạt vi phạm hành chính NĐ 45/2022`
3. **Workspace Preview 2 Cột**:
   - **Cột Trái (35%) — Bộ tham số**: Chọn kỳ báo cáo, chọn công trình, nhập ý kiến kết luận của cán bộ.
   - **Cột Phải (65%) — Khung xem trước A4 (Live Preview)**:
     - Thể thức chuẩn NĐ 30: Quốc hiệu, Tiêu ngữ, Tên cơ quan ban hành.
     - Bảng số liệu thống kê tự động tổng hợp.
     - Mã xác thực điện tử `docHash` ở chân trang.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Báo Cáo Hành Chính` (≤ 4 từ)
- **Primary CTA**: `Xuất bản A4` (≤ 3 từ)
- **Văn phong**: Chuẩn mực hành chính nhà nước Việt Nam, trang trọng, số liệu đối chiếu rõ ràng.

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Tiêu đề báo cáo | Yes | `draft_documents` | `title` | `—` |
| Thể thức loại văn bản | Yes | `draft_documents` | `documentType` | `corrective_notice` |
| Mã băm toàn vẹn | Yes | `draft_documents` | `hash` | `SHA-256 Calculated` |
| Trạng thái văn bản | Yes | `draft_documents` | `status` | `DRAFT` |

- **Current Implementation**: `GET /api/documents`, `POST /api/documents/generate-a4`

---

## 9. DESKTOP & MOBILE BEHAVIOR
- **Desktop (1366×768)**: Khung A4 Preview hiển thị sắc nét với tỷ lệ đúng chuẩn 210mm × 297mm, hỗ trợ phím tắt `Ctrl+P` in ấn chuẩn CSS `@media print`.
- **Mobile (360–430px)**: Ẩn khung xem trước A4 phức tạp, thay bằng danh sách tóm tắt các báo cáo đã lập và nút "Tải file PDF".

---

## 10. ACCEPTANCE CRITERIA
- [ ] Bản in A4 tuân thủ đầy đủ phông chữ, lề trang và thể thức Nghị định 30/2020/NĐ-CP.
- [ ] Số liệu thống kê trong báo cáo khớp 100% với dữ liệu D1 SQLite thực tế.
- [ ] Mã băm `docHash` được tạo tự động bằng thuật toán Web Crypto SHA-256.

---

## 11. IMPLEMENTATION STATUS
- **CURRENT**: Danh sách báo cáo, tạo báo cáo theo mẫu, xem trước A4 chuẩn CSS print, mã băm docHash.
- **PARTIAL**: Xuất trực tiếp file định dạng Word (.docx).
- **PROPOSED**: Tích hợp chữ ký số chuyên dùng chính phủ (VGCA).
