# CON-03 — Sổ Bộ Hồ Sơ Vụ Việc Của Nhà Thầu

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/contractor/cases` (và alias `/contractor/projects`)
- **Primary Role**: Ban Quản lý dự án Nhà thầu (`contractor`)
- **Secondary Roles**: Bộ phận Pháp chế / ATLĐ, Quản trị viên (`admin`)
- **Current Component**: `ContractorCasesPage.jsx` (`app/src/apps/contractor/pages/cases/ContractorCasesPage.jsx`)
- **Layout**: `ContractorLayout.jsx`
- **Primary Job**: Theo dõi toàn bộ danh mục các vụ việc kiểm tra môi trường liên quan đến các gói thầu/dự án của nhà thầu, xem biên bản và tiến độ giải quyết.
- **Success Condition**: Nhà thầu nắm rõ lịch sử các lần bị nhắc nhở/yêu cầu khắc phục để kịp thời chấn chỉnh công tác thi công.

---

## 2. WHY THIS SCREEN EXISTS
- Doanh nghiệp xây dựng cần quản lý rủi ro pháp lý và uy tín thương hiệu. Màn hình này cung cấp bức tranh minh bạch về các sự cố môi trường đã xảy ra, các biên bản làm việc đã ký và đánh giá mức độ tuân thủ của từng tổ đội thi công.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Sidebar / Header mục "Hồ sơ vụ việc", click từ Bàn làm việc (`/contractor`).
- **Exit Points**:
  - Click vào vụ việc $\rightarrow$ Mở chi tiết vụ việc góc nhìn nhà thầu.
  - Nút "Nộp khắc phục" $\rightarrow$ Chuyển sang `/contractor/tasks`.
- **Navigation Item**: Sidebar / Header item "Hồ sơ vụ việc" (icon Briefcase).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem các vụ việc thuộc dự án của mình**| ❌ | ❌ | ✅ | ✅ *(Chỉ dự án mình)*| ✅ |
| **Xem biên bản làm việc NĐ 30/2020** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Gửi đơn khiếu nại / giải trình bổ sung**| ❌ | ❌ | ❌ | ✅ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Truy cập /contractor/cases 
→ Lọc theo Dự án thi công hoặc theo Trạng thái (Đang mở / Đã đóng)
→ Xem danh sách vụ việc kèm ngày kiểm tra và mức độ nghiêm trọng
→ Bấm vào vụ việc để đọc biên bản kiểm tra của Đội trật tự xây dựng
→ Xem lại ảnh đối chứng Trước/Sau đã được cán bộ nghiệm thu
```

---

## 6. INFORMATION HIERARCHY
1. **Header Block**: Tiêu đề "Sổ Bộ Hồ Sơ Vụ Việc", Tên nhà thầu, Bộ lọc dự án.
2. **Filter Tabs**: `Tất cả vụ việc` | `Đang xử lý` | `Đã đóng hoàn tất`.
3. **Cases Table / List**:
   - Mã vụ việc (`DG-2026-XXXX`) & Dự án liên quan
   - Nội dung vi phạm ghi nhận (Bụi giao thông / Thi công không che chắn)
   - Ngày lập biên bản & Cán bộ thụ lý
   - Trạng thái nghiệm thu (Đạt / Chưa đạt / Chờ kiểm tra)
   - Văn bản liên quan (Biên bản làm việc, Thông báo nhắc nhở)
   - Thao tác: Xem chi tiết

---

## 7. CONTENT CONTRACT
- **Page Title**: `Hồ Sơ Vụ Việc Nhà Thầu` (≤ 5 từ)
- **Status Labels**: `Đang theo dõi` | `Đang khắc phục` | `Đã nghiệm thu đóng hồ sơ`

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Danh sách vụ việc | Yes | `cases` table | `cases.* WHERE siteId IN (nhà thầu quản lý)` | `[]` |
| Văn bản biên bản | No | `draft_documents` | `draft_documents.signedUrl` | `—` |

- **Current Implementation**: `GET /api/contractor/cases`

---

## 9. ACCEPTANCE CRITERIA
- [ ] Chỉ hiển thị các vụ việc thuộc các công trình do nhà thầu này thi công (không lộ dữ liệu nhà thầu khác).
- [ ] Cho phép tải về biên bản làm việc hành chính đã ký số.

---

## 10. IMPLEMENTATION STATUS
- **CURRENT**: Danh sách vụ việc của nhà thầu, xem chi tiết biên bản, bộ lọc trạng thái.
- **PARTIAL**: Gửi phản hồi khiếu nại trực tiếp từ chi tiết vụ việc.
- **PROPOSED**: Tích hợp chữ ký số nhà thầu vào biên bản nghiệm thu điện tử.
