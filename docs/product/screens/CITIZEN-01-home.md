# CIT-01 — Bảng Điều Khiển Công Dân (Citizen Home)

## 1. Screen identity
- Role: Citizen / Youth
- Route: `/citizen`
- Component: `apps/citizen/pages/home/CitizenHomePage.jsx`
- Layout: `apps/citizen/layout/CitizenLayout.jsx`
- Navigation entry: Sidebar / Mobile Bottom Nav
- Current implementation status: ACTIVE (Level 5 Production)

Purpose: Trung tâm điều hướng dành cho người dân và thanh niên tình nguyện: hiển thị tóm tắt phản ánh cá nhân, công trình lân cận và nút tạo phản ánh vi phạm nhanh.

---

## 2. User goal
- Kiểm tra trạng thái các phản ánh vi phạm đã gửi gần đây.
- Nắm bắt chất lượng không khí và công trình đang thi công quanh khu vực.
- Nhấn nút "Tạo phản ánh mới" để báo cáo ngay tại hiện trường.

---

## 3. Entry points
- Đăng nhập tài khoản Citizen.
- Bấm "Cổng công dân" từ trang chủ hoặc Demo Hub.
- Redirect từ `/community`.

---

## 4. Exit / next actions
- Bấm "Tạo phản ánh mới" $ightarrow$ `/citizen/report/new`
- Bấm "Xem toàn bộ phản ánh" $ightarrow$ `/citizen/reports`
- Bấm "Xem chi tiết phản ánh" $ightarrow$ `/citizen/reports/:id`
- Bấm "Tín chỉ & Hồ sơ" $ightarrow$ `/citizen/profile`

---

## 5. Information hierarchy
1. Header chào mừng & Tóm tắt đóng góp cá nhân (Số phản ánh, Giờ tình nguyện)
2. Nút hành động chính kích thước lớn: "Ghi nhận vi phạm mới" (Đỏ son)
3. Lưới 4 Thẻ thao tác nhanh: Phản ánh mới, Lịch sử theo dõi, Bản đồ rủi ro, Tín chỉ tích lũy
4. Danh sách 3 phản ánh gần nhất đang được cơ quan chức năng xử lý
5. Thống kê tác động cộng đồng (Community Impact Metrics)

---

## 6. Above-the-fold content
- **MUST SEE**: Nút lớn [Ghi nhận vi phạm mới], Chỉ số phản ánh cá nhân (Đang xử lý, Đã hoàn tất).
- **SHOULD SEE**: Thẻ trạng thái công trình gần nhất.
- **BELOW FOLD**: Biểu đồ tác động và danh sách đóng góp cộng đồng.

---

## 7. Screen sections
### Section 1 — Hero Action & Contribution Summary
- Purpose: Kích thích hành động và ghi nhận đóng góp tức thì.
- Displays: Lời chào, Thẻ huy hiệu công dân, Nút [Ghi nhận vi phạm mới] $ge 44	ext{px}$.
- Status: IMPLEMENTED

### Section 2 — Active Reports Tracker
- Purpose: Xem nhanh phản ánh của mình đang ở bước nào trong 7 bước xử lý.
- Displays: Tiêu đề phản ánh, Địa chỉ, Badge trạng thái (Đã tiếp nhận, Đang khảo sát, Đã khắc phục).
- Data source: VERIFIED (D1 `observations`)
- Status: IMPLEMENTED

---

## 8. Data displayed
| Field | Meaning | Required | Source | Current status |
|---|---|---:|---|---|
| My Active Observations | Số phản ánh đang xử lý của tôi | Có | D1 `observations` | REAL |
| Volunteer Hours Logged | Giờ tình nguyện đã ghi nhận | Có | D1 `youth_activities` | REAL |
| Recent Reports List | Danh sách phản ánh mới nhất | Có | D1 `observations` | REAL |

---

## 9. Primary action
- Primary action: [Ghi nhận vi phạm mới] (`/citizen/report/new`)
- Secondary: [Xem tất cả phản ánh], [Tra cứu bản đồ]
