# STF-05 — Không Gian Thụ Lý Vụ Việc

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/staff/cases/:id`
- **Primary Role**: Cán bộ thụ lý vụ việc (`staff`)
- **Secondary Roles**: Đội trưởng thanh tra, Lãnh đạo (`executive`)
- **Current Component**: `CaseDetailPage.jsx` (`app/src/apps/staff/pages/cases/CaseDetailPage.jsx`)
- **Layout**: `StaffLayout.jsx`
- **Primary Job**: Thực hiện toàn bộ quy trình tác nghiệp thụ lý vụ việc theo 7 bước (DAG): kiểm tra bằng chứng, lập biên bản, giao việc nhà thầu và nghiệm thu kết quả khắc phục.
- **Success Condition**: Cán bộ hoàn thành từng bước chuyển trạng thái hồ sơ với đầy đủ bằng chứng đối chứng và ghi nhận nhật ký bất biến.

---

## 2. WHY THIS SCREEN EXISTS
- Đây là không gian làm việc quan trọng nhất của cán bộ môi trường/xây dựng. Mọi hành động từ xác thực phản ánh công dân, xem dữ liệu đo đạc, ban hành yêu cầu khắc phục cho nhà thầu đến việc nghiệm thu ảnh Before/After đều diễn ra tập trung tại màn hình này.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Click từ Danh mục vụ việc (`/staff/cases`), từ Bàn điều hành ca trực (`/staff`), hoặc từ Cảnh báo vượt ngưỡng.
- **Exit Points**:
  - Nút quay lại $\rightarrow$ Về Danh mục vụ việc (`/staff/cases`).
  - Click sang Công trình $\rightarrow$ Mở hồ sơ công trình (`/staff/sites/:siteId`).
  - Xuất văn bản $\rightarrow$ Mở Báo cáo / Biên bản (`/staff/reports`).
- **Navigation Item**: Breadcrumb hiển thị: `Vụ việc / [Mã hồ sơ]`.

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem toàn bộ hồ sơ vụ việc** | ❌ | ❌ | ✅ | ❌ *(Chỉ xem qua /contractor)* | ✅ |
| **Chuyển bước quy trình (7 bước DAG)** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Duyệt / Từ chối bằng chứng khắc phục** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Tạo dự thảo văn bản NĐ 30/2020** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Đóng hồ sơ vụ việc hoàn tất** | ❌ | ❌ | ✅ | ❌ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Mở /staff/cases/:id 
→ Đọc tóm tắt nguồn tin & xem ảnh phản ánh ban đầu (Bước 1: Tiếp nhận)
→ Bấm "Giao việc khảo sát hiện trường" (Bước 2: Khảo sát)
→ Cán bộ/Tình nguyện viên nộp biên bản khảo sát
→ Bấm "Ban hành yêu cầu khắc phục cho Nhà thầu" (Bước 3 & 4)
→ Nhà thầu nộp ảnh khắc phục Before/After qua Cổng nhà thầu
→ Cán bộ kiểm tra ảnh đối chứng, bấm "Nghiệm thu đạt chuẩn" (Bước 6)
→ Bấm "Hoàn tất & Đóng hồ sơ" (Bước 7)
```

---

## 6. INFORMATION HIERARCHY
1. **Case Header Block**: Mã hồ sơ (`DG-2026-XXXX`), Tên công trình, Trạng thái DAG hiện tại, Đồng hồ SLA đếm ngược, Cán bộ phụ trách.
2. **7-Step Stepper Bar**: Thanh tiến trình 7 bước trực quan (Màu xanh cho bước đã xong, Vàng cho bước hiện tại, Xám cho bước chưa đến).
3. **Workspace 2 Cột (Split View)**:
   - **Cột Trái (60%) — Tác nghiệp cốt lõi**:
     - Chi tiết nội dung vụ việc & Tóm tắt AI hỗ trợ (Decision support).
     - Bằng chứng số hóa: Ảnh chụp ban đầu, mã băm SHA-256 xác thực tính toàn vẹn.
     - So sánh đối chứng Trước / Sau (Before vs After Evidence Slider).
     - Khung thao tác chuyển bước: Nút hành động chính của bước hiện tại.
   - **Cột Phải (40%) — Dữ liệu hỗ trợ & Nhật ký**:
     - Thẻ thông tin công trình & Nhà thầu chịu trách nhiệm.
     - Dữ liệu cảm biến đo bụi tại thời điểm phát sinh sự cố.
     - Danh sách văn bản/biên bản hành chính liên kết.
     - Timeline nhật ký hoạt động (Audit Trail).

---

## 7. CONTENT CONTRACT
- **Page Title**: `Hồ Sơ Vụ Việc [Mã hồ sơ]`
- **Primary Action Buttons**: Đặt tên theo đúng hành vi cụ thể (ví dụ: `Xác nhận tiếp nhận`, `Ban hành yêu cầu`, `Nghiệm thu đạt`, `Đóng hồ sơ`). Cấm nút chung chung gây khó hiểu.
- **Ranh giới AI**: AI chỉ đóng vai trò "Trợ lý tóm tắt hồ sơ & gợi ý điều khoản", quyền quyết định chuyển bước 100% thuộc về cán bộ con người.

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Mã vụ việc | Yes | `cases` table | `cases.code` | `—` |
| Bước hiện tại | Yes | `cases` table | `cases.currentStep` | `INSPECTION` |
| Ảnh ban đầu | Yes | `evidences` table | `evidences.url`, `evidences.sha256` | Placeholder ảnh |
| Ảnh khắc phục | No | `evidences` table | `evidences.url` (gắn actionId) | "Chờ nhà thầu nộp" |
| Văn bản liên kết | No | `draft_documents` | `draft_documents.signedUrl` | `[]` |

- **Current Implementation**: `GET /api/cases/:id`, `POST /api/cases/:id/transition`, `POST /api/cases/:id/verify-evidence`

---

## 9. STATE MODEL
- **Loading**: Skeleton toàn trang hiển thị thanh tiến trình 7 bước và 2 cột nội dung.
- **Error**: "Hồ sơ vụ việc không tồn tại hoặc bạn không có quyền truy cập".
- **Step Transitions**: Khi chuyển bước thành công, thanh Stepper cập nhật hiệu ứng tức thì và ghi nhận sự kiện vào dòng thời gian.

---

## 10. DESKTOP & MOBILE BEHAVIOR
- **Desktop (1366×768)**: Bố cục 2 cột chuyên dụng (60/40), thanh Stepper 7 bước nằm trên cùng, nút hành động nằm cố định ở góc dưới của cột tác nghiệp.
- **Mobile (360–430px)**: Chuyển sang bố cục cuộn 1 cột dọc. Stepper thu gọn thành dạng "Bước 3/7: Ban hành yêu cầu". Ảnh đối chứng Before/After chuyển thành dạng so sánh vuốt chạm (swipe slider). Nút chuyển bước ghim cố định ở đáy màn hình.

---

## 11. ACCEPTANCE CRITERIA
- [ ] Quy trình 7 bước chuyển trạng thái tuần tự và chặt chẽ theo DAG.
- [ ] Ảnh Before/After hiển thị sắc nét kèm mã băm SHA-256 đối chiếu toàn vẹn.
- [ ] Ghi nhận đầy đủ nhật ký người thực hiện (`actor_name`, `timestamp`) sau mỗi thao tác.
- [ ] Nút hành động chính hiển thị đúng theo ngữ cảnh của từng bước cụ thể.

---

## 12. IMPLEMENTATION STATUS
- **CURRENT**: Giao diện chi tiết vụ việc, thanh 7 bước DAG, duyệt bằng chứng, đối chứng Before/After, chuyển bước.
- **PARTIAL**: Trình ký điện tử văn bản hành chính trực tiếp trong không gian vụ việc.
- **PROPOSED**: Tự động gửi tin nhắn Zalo/SMS cho nhà thầu khi có yêu cầu khắc phục.
