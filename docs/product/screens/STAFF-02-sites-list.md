# STF-02 — Sổ Bộ Quản Lý Công Trình

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/staff/sites`
- **Primary Role**: Cán bộ trật tự xây dựng & môi trường (`staff`)
- **Secondary Roles**: Quản trị viên (`admin`), Lãnh đạo (`executive`)
- **Current Component**: `SitesListPage.jsx` (`app/src/apps/staff/pages/sites/SitesListPage.jsx`)
- **Layout**: `StaffLayout.jsx`
- **Primary Job**: Tra cứu danh mục các công trình xây dựng trên địa bàn, lọc theo mức độ rủi ro bụi và tìm kiếm theo nhà thầu / địa chỉ.
- **Success Condition**: Cán bộ tìm thấy công trình cần kiểm tra trong vòng 3 giây và xem được điểm rủi ro môi trường hiện tại.

---

## 2. WHY THIS SCREEN EXISTS
- Đô thị có hàng chục đến hàng trăm công trình đang thi công đồng thời. Cán bộ cần danh bạ tập trung để theo dõi tình hình chấp hành bảo vệ môi trường, giấy phép xây dựng và nhà thầu chịu trách nhiệm.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Sidebar mục "Công trình", liên kết từ Dashboard (`/staff`), hoặc link từ chi tiết vụ việc.
- **Exit Points**:
  - Click hàng công trình $\rightarrow$ Chuyển đến Chi tiết công trình (`/staff/sites/:id`).
  - Click nút "Thêm công trình" $\rightarrow$ Mở Drawer thêm mới công trình.
- **Navigation Item**: Sidebar item "Công trình" (icon Building/Construction).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem danh sách công trình** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Tìm kiếm & Lọc theo phường/quận** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Thêm mới công trình vào sổ bộ** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Cập nhật thông tin nhà thầu** | ❌ | ❌ | ✅ | ❌ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Mở /staff/sites 
→ Nhập từ khóa tìm kiếm (tên dự án / nhà thầu / địa chỉ)
→ Chọn bộ lọc mức độ rủi ro (Cao / Trung bình / Thấp)
→ Xem danh sách kết quả kèm điểm Dust Risk Score
→ Click công trình cần xem để mở trang chi tiết (/staff/sites/:id)
```

---

## 6. INFORMATION HIERARCHY
1. **Page Header**: Tiêu đề "Sổ Bộ Công Trình Xây Dựng", số lượng công trình đang quản lý, nút "Thêm công trình".
2. **Filter & Search Bar**: Ô tìm kiếm nhanh, dropdown chọn Quận/Huyện, dropdown lọc mức rủi ro (`Cao ≥70`, `Trung bình 40-69`, `Thấp <40`).
3. **Main Table / List**:
   - Tên công trình & Mã định danh
   - Địa chỉ & Phường/Quận
   - Nhà thầu thi công & Người phụ trách
   - Điểm Dust Risk Score (thanh tiến trình màu có số rõ ràng)
   - Trạng thái giám sát (Đang thi công / Tạm dừng / Hoàn thành)
   - Hành động: Xem chi tiết / Lập biên bản kiểm tra
4. **Pagination / Summary**: Tổng số bản ghi và điều hướng phân trang.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Sổ Bộ Công Trình` (≤ 4 từ)
- **Search Placeholder**: `Tìm theo tên, địa chỉ hoặc nhà thầu...`
- **Primary CTA**: `Thêm công trình` (≤ 3 từ)
- **Table Headers**: `Mã | Tên công trình | Địa bàn | Nhà thầu | Điểm ưu tiên | Thao tác`
- **Zero Truncate**: Tên công trình dài không được cắt ngắn dấu `...` mà tự động xuống dòng (`break-words`).

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Mã công trình | Yes | `sites` table | `sites.code` | `DG-SITE-XXX` |
| Tên công trình | Yes | `sites` table | `sites.name` | `Chưa đặt tên` |
| Địa chỉ & Phường | Yes | `sites` table | `sites.address`, `sites.ward` | `Đang cập nhật` |
| Điểm ưu tiên bụi | Yes | `sites` table | `sites.dustRiskScore` | `0` |
| Tên nhà thầu | No | `sites` table | `sites.contractorName` | `Chưa đăng ký` |

- **Current Implementation**: `GET /api/sites?q=&ward=&riskLevel=&page=1`
- **Safe Normalization**: Danh sách trả về luôn unwrap thành mảng an toàn `items || []`.

---

## 9. STATE MODEL
- **Loading**: Bảng Skeleton 5 dòng với các ô xám nhấp nháy.
- **Empty**: Khi không tìm thấy kết quả: "Không có công trình nào phù hợp với điều kiện tìm kiếm".
- **Error**: "Không thể kết nối danh bạ công trình" kèm nút thử lại.
- **Partial**: Nếu công trình chưa gán trạm đo, hiển thị badge "Chưa lắp cảm biến" thay vì để trống.

---

## 10. DESKTOP & MOBILE BEHAVIOR
- **Desktop (1366×768)**: Bảng dữ liệu đầy đủ 6 cột, căn lề thẳng hàng, thanh tìm kiếm nằm trên cùng.
- **Mobile (360–430px)**: Bảng tự động chuyển đổi thành danh sách Thẻ Công Trình (Card view). Mỗi thẻ hiển thị Tên dự án, Địa chỉ, Điểm rủi ro (badge lớn) và nút "Chi tiết" cao $\ge 44\text{px}$.

---

## 11. ACCEPTANCE CRITERIA
- [ ] Danh sách hiển thị đúng các công trình từ cơ sở dữ liệu D1.
- [ ] Tìm kiếm theo tên hoặc nhà thầu phản hồi tức thì không giật lag.
- [ ] Điểm Dust Risk Score thể hiện chính xác giá trị số và dải màu tương ứng.
- [ ] Không có hiện tượng cắt cụt chữ ở cột tên công trình và địa chỉ.
- [ ] Responsive hiển thị dạng thẻ tối ưu trên màn hình di động 360px.

---

## 12. IMPLEMENTATION STATUS
- **CURRENT**: Danh sách công trình, bộ lọc theo quận/phường, hiển thị điểm rủi ro, phân trang.
- **PARTIAL**: Chức năng thêm nhanh công trình qua Modal.
- **PROPOSED**: Tích hợp ảnh chụp vệ tinh hoặc bản đồ mini vào từng dòng danh sách.
