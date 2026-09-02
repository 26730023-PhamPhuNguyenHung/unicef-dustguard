# CIT-01 — Bảng Điều Khiển Công Dân (Citizen Home)

## 1. Screen identity
- **Role**: Citizen / Youth
- **Route**: `/citizen`
- **Component**: `src/apps/citizen/pages/home/CitizenHomePage.jsx`
- **Layout**: `src/apps/citizen/layout/CitizenLayout.jsx` (Header + Bottom Nav trên Mobile)
- **Navigation entry**: Sidebar Citizen / Mobile Bottom Navigation
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Trung tâm điều hành cá nhân dành cho người dân và thanh niên: tổng hợp nhanh số phản ánh đã gửi, giờ tình nguyện tích lũy, các công trình lân cận và nút tạo phản ánh khẩn cấp kích thước lớn.

---

## 2. User goal
1. **Gửi phản ánh ngay lập tức**: Nhấn nút "Ghi nhận vi phạm mới" đặt nổi bật ở vị trí ngón tay cái trên Mobile.
2. **Kiểm tra tiến độ xử lý**: Xem 3 phản ánh gần nhất xem cơ quan chức năng đã tiếp nhận hoặc yêu cầu khắc phục chưa.
3. **Theo dõi giờ tình nguyện**: Xem tiến độ hoàn thành mục tiêu 20 giờ tích lũy tín chỉ.

---

## 3. Information hierarchy
1. **Lời chào & Huy hiệu công dân (User Badge Banner)**: Tên người dùng, số phản ánh hợp lệ, số giờ tình nguyện.
2. **Nút hành động chính kích thước lớn (Primary CTA Button)**: `[Ghi nhận vi phạm mới]` (Đỏ son `#9f241f`, chiều cao $ge 48	ext{px}$).
3. **Lưới 4 Thẻ chức năng nhanh (Quick Action 4-Grid)**:
   - Tạo phản ánh mới (`/citizen/report/new`)
   - Danh sách theo dõi (`/citizen/reports`)
   - Bản đồ khu vực (`/map`)
   - Tín chỉ thanh niên (`/citizen/profile`)
4. **Danh sách phản ánh đang xử lý (Active Reports Tracker)**: Thẻ hiển thị mã số, tên công trình, địa chỉ và badge trạng thái 7 bước.
5. **Thống kê tác động cộng đồng (Community Impact Strip)**: Tổng số phản ánh toàn thành phố, tỷ lệ xử lý đúng hạn SLA 48h.

---

## 4. Above-the-fold content
- **MUST SEE**: Lời chào cá nhân, Nút [Ghi nhận vi phạm mới], Số phản ánh đang thụ lý.
- **SHOULD SEE**: Lưới 4 phím tắt thao tác nhanh.
- **BELOW FOLD**: Danh sách phản ánh chi tiết và bảng thống kê tác động.

---

## 5. Primary action
- **Primary action**: `[Ghi nhận vi phạm mới]` ($ge 48	ext{px}$, đỏ son)
- **Secondary**: `[Xem toàn bộ phản ánh]`, `[Tra cứu bản đồ]`

---

## 6. UI Copy
- **Page title**: Cổng thông tin công dân
- **Short description**: Giám sát bụi công trình và đóng góp vì không gian sống trong lành.
- **Button labels**: `[Ghi nhận vi phạm mới]`, `[Xem phản ánh]`, `[Tra cứu bản đồ]`, `[Tín chỉ]`
