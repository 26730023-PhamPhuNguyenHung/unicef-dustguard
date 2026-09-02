# STF-02 — Danh Sách 33 Công Trình Xây Dựng (Sites List)

## 1. Screen identity
- **Role**: Staff / Inspector / Quản lý địa bàn
- **Route**: `/staff/sites`
- **Component**: `src/apps/staff/pages/sites/SitesListPage.jsx`
- **Layout**: `src/apps/staff/layout/StaffLayout.jsx`
- **Navigation entry**: Sidebar Staff ("Công trình")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Quản lý tập trung toàn bộ 33 công trình xây dựng: tra cứu theo quận huyện, lọc theo 4 mức độ rủi ro $R$, theo dõi tình trạng trạm cảm biến và mở hồ sơ chi tiết từng điểm thi công.

---

## 2. User goal
1. **Tìm kiếm công trình nhanh**: Tìm theo mã định danh (VD: `BD-0001`), tên dự án hoặc địa chỉ đường phố.
2. **Phân loại mức độ rủi ro**: Lọc nhanh các công trình có nguy cơ phát tán bụi ở mức Cao hoặc Rất cao để lên kế hoạch thanh tra.
3. **Mở hồ sơ chi tiết**: Nhấn vào dòng công trình để xem thông số kỹ thuật, lịch sử cảm biến và các vụ việc liên quan.

---

## 3. Information hierarchy
1. **Thanh công cụ tìm kiếm & Bộ lọc (Toolbar)**: Ô tìm kiếm từ khóa, Bộ lọc Quận/Huyện, Bộ lọc 4 Cấp rủi ro $R$, Nút [Thêm công trình].
2. **Bảng danh sách công trình (Sites Data Table)**: 33 công trình với các cột thông tin chuẩn hóa.
3. **Thanh phân trang & Tổng số (Pagination Footer)**: Hiển thị `Hiển thị 1-10 trên tổng số 33 công trình`.

---

## 4. Table specification (Chuẩn Zero Truncate)
| Cột | Ý nghĩa | Sắp xếp | Độ rộng | Ghi chú hiển thị |
|---|---|:---:|:---:|---|
| **Mã công trình** | Mã định danh duy nhất (VD: `BD-0001`) | Có | 120px | Phông Monospace, viền đậm |
| **Tên công trình** | Tên đầy đủ dự án xây dựng | Có | 250px | **Zero Truncate**, tự động xuống dòng (`break-words`) |
| **Địa chỉ / Quận** | Vị trí địa lý công trình | Có | 200px | Địa chỉ hành chính rõ ràng |
| **Nhà thầu thi công** | Đơn vị chịu trách nhiệm | Không | 180px | Tên công ty / Liên danh |
| **Trạm đo IoT** | Số lượng cảm biến & trạng thái | Không | 130px | Badge xanh (Đang đo) / Xám (Chưa lắp) |
| **Điểm rủi ro $R$** | Điểm số $0-100$ kèm Badge màu | Có | 140px | 4 Màu chuẩn: Xanh, Vàng, Cam, Đỏ |
| **Thao tác** | Nút xem chi tiết | Không | 100px | Nút `[Chi tiết]` |

---

## 5. Primary action
- **Primary action**: Bấm vào bất kỳ dòng nào trong bảng $ightarrow$ Mở `/staff/sites/:id`
- **Secondary**: `[Thêm công trình mới]`, `[Xuất danh sách Excel/PDF]`

---

## 6. Screen states
- **Loading state**: Hiển thị bảng khung xương (Skeleton Rows).
- **Empty state**: "Không tìm thấy công trình nào phù hợp với bộ lọc tìm kiếm."
- **Error state**: Báo lỗi tải danh mục kèm nút "Tải lại danh sách".
- **Success state**: Hiển thị đầy đủ 33 công trình thực tế từ D1 Database.

---

## 7. UI Copy
- **Page title**: Danh sách công trình xây dựng
- **Short description**: Giám sát 33 điểm thi công trên địa bàn, đánh giá mức độ phát tán bụi và tình trạng lắp đặt trạm đo.
- **Button labels**: `[Thêm công trình]`, `[Lọc rủi ro]`, `[Chi tiết]`
