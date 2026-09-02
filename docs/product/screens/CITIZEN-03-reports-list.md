# CIT-03 — Sổ Tay Danh Sách Phản Ánh Cá Nhân

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/citizen/reports` (và alias `/citizen/track`)
- **Primary Role**: Người dân đã đăng nhập (`citizen`)
- **Secondary Roles**: Tình nguyện viên theo dõi địa bàn (`community`)
- **Current Component**: `ReportsListPage.jsx` (`app/src/apps/citizen/pages/reports/ReportsListPage.jsx`)
- **Layout**: `CitizenLayout.jsx`
- **Primary Job**: Xem danh sách toàn bộ phản ánh do chính mình gửi hoặc đang theo dõi, tìm kiếm và lọc theo trạng thái xử lý.
- **Success Condition**: Người dân tìm thấy phản ánh cũ theo ngày hoặc trạng thái để kiểm tra kết quả xử lý.

---

## 2. WHY THIS SCREEN EXISTS
- Người dân cần một nơi lưu trữ tập trung lịch sử đóng góp phản ánh của mình, biết được những vụ việc nào đã xong, vụ việc nào đang chờ cán bộ khảo sát.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Tab "Phản ánh" trên Bottom Nav, click "Xem tất cả" từ Trang chủ (`/citizen`).
- **Exit Points**:
  - Click thẻ phản ánh $\rightarrow$ Chuyển sang Chi tiết phản ánh (`/citizen/reports/:id`).
  - Nút "Gửi phản ánh mới" $\rightarrow$ Mở `/citizen/report/new`.
- **Navigation Item**: Bottom Nav / Sidebar item "Phản ánh của tôi" (icon List/FileText).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem danh sách phản ánh của mình** | ❌ | ✅ *(Owner)* | ✅ *(Toàn bộ)* | ❌ | ✅ |
| **Lọc theo trạng thái xử lý** | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Xóa phản ánh khi chưa tiếp nhận** | ❌ | ✅ *(Chỉ PENDING)*| ❌ | ❌ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Mở /citizen/reports 
→ Chọn bộ lọc: "Tất cả" | "Đang xử lý" | "Đã khắc phục"
→ Cuộn xem danh sách phản ánh kèm ảnh thu nhỏ và ngày gửi
→ Nhấp vào một phản ánh để xem chi tiết tiến độ xử lý (/citizen/reports/:id)
```

---

## 6. INFORMATION HIERARCHY
1. **Header Block**: Tiêu đề "Phản Ánh Của Tôi", nút "Gửi mới (+)".
2. **Filter Chips**: `Tất cả` | `Chờ tiếp nhận` (Vàng) | `Đang xử lý` (Xanh dương) | `Đã khắc phục` (Xanh lá).
3. **Reports List / Card Stream**:
   - Ảnh chụp ban đầu (thumbnail vuông có viền)
   - Địa chỉ & Vị trí phát hiện
   - Mã phản ánh (`DG-2026-XXXX`) & Thời gian gửi (ví dụ: `2 ngày trước`)
   - Badge trạng thái xử lý rõ nét
   - Tóm tắt kết quả (nếu đã xong)

---

## 7. CONTENT CONTRACT
- **Page Title**: `Phản Ánh Của Tôi` (≤ 4 từ)
- **Status Copy**: `Đang chờ tiếp nhận` | `Cán bộ đang xử lý` | `Đã khắc phục xong`
- **Zero Truncate**: Mã phản ánh và địa chỉ hiển thị trọn vẹn.

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Danh sách phản ánh | Yes | `complaints` table | `complaints.* WHERE reporterId = ?` | `[]` |
| Ảnh thu nhỏ | Yes | `evidences` table | `evidences.url` | Thumbnail placeholder |
| Trạng thái | Yes | `complaints` table | `complaints.status` | `PENDING` |

- **Current Implementation**: `GET /api/complaints/my`

---

## 9. ACCEPTANCE CRITERIA
- [ ] Tải đúng danh sách phản ánh gắn với tài khoản đang đăng nhập.
- [ ] Lọc trạng thái hoạt động tức thời không reload trang.
- [ ] Chuyển tiếp mượt mà sang trang chi tiết khi bấm vào thẻ.

---

## 10. IMPLEMENTATION STATUS
- **CURRENT**: Danh sách phản ánh cá nhân, bộ lọc trạng thái, chuyển trang chi tiết.
- **PARTIAL**: Tìm kiếm theo từ khóa trong mô tả phản ánh.
- **PROPOSED**: Chia sẻ tiến độ phản ánh lên mạng xã hội / Zalo.
