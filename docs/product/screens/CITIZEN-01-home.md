# CIT-01 — Bàn Làm Việc Công Dân — Khu Dân Cư

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/citizen` (và alias `/citizen/dashboard`)
- **Primary Role**: Người dân / Công dân số (`citizen`)
- **Secondary Roles**: Thanh niên tình nguyện (`community`)
- **Current Component**: `CitizenHomePage.jsx` (`app/src/apps/citizen/pages/home/CitizenHomePage.jsx`)
- **Layout**: `CitizenLayout.jsx`
- **Primary Job**: Nắm bắt tiến độ xử lý các phản ánh môi trường cá nhân đã gửi và theo dõi tình hình không khí tại khu dân cư mình sinh sống.
- **Success Condition**: Người dân biết được ngay phản ánh của mình đã được tiếp nhận/xử lý đến đâu và có nút gửi phản ánh mới nổi bật.

---

## 2. WHY THIS SCREEN EXISTS
- Trả lời câu hỏi cốt lõi của công dân: *"Phản ánh tôi gửi hôm qua đã có ai xử lý chưa?"* và *"Khu phố tôi sống hôm nay có công trình nào đang gây bụi không?"*. Màn hình này mang tính hành động cao, gần gũi, đơn giản và mobile-first.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Đăng nhập với vai trò Citizen (`/login`), click logo hoặc tab "Trang chủ" trên thanh điều hướng.
- **Exit Points**:
  - Nút lớn "Gửi phản ánh" $\rightarrow$ Chuyển đến Form gửi phản ánh (`/citizen/report/new`).
  - Click vào phản ánh của tôi $\rightarrow$ Chuyển đến Chi tiết phản ánh (`/citizen/reports/:id`).
  - Click xem toàn bộ $\rightarrow$ Chuyển đến Sổ tay phản ánh (`/citizen/reports`).
- **Navigation Item**: Bottom Nav / Sidebar item "Trang chủ" (icon Home).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem bàn làm việc công dân** | ❌ *(Redirect)* | ✅ | ✅ *(View-only)* | ❌ | ✅ |
| **Bấm gửi phản ánh mới** | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Theo dõi phản ánh cá nhân** | ❌ | ✅ *(Của mình)*| ✅ | ❌ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Mở /citizen trên điện thoại 
→ Xem nhanh số phản ánh đã gửi và số phản ánh đã được giải quyết xong
→ Thấy nút màu đỏ son lớn "Gửi phản ánh ngay" ở vị trí thuận tiện nhất
→ Xem danh sách các phản ánh gần đây kèm badge tiến độ (Đang xử lý / Đã khắc phục)
→ Bấm vào một phản ánh để xem chi tiết kết quả xử lý
```

---

## 6. INFORMATION HIERARCHY
1. **Welcome Header**: Lời chào thân thiện, tên người dùng, khu vực dân cư đăng ký.
2. **Hero Action Card**: Nút lớn "Gửi phản ánh hiện trường" (màu đỏ son `#9F241F`, icon máy ảnh, touch target lớn).
3. **My Reports Summary (3 Thẻ Tóm Tắt)**:
   - `Đã gửi` | `Đang xử lý` | `Đã khắc phục xong`
4. **Recent Reports Feed**: Danh sách 3-5 phản ánh gần nhất của chính người dùng với ảnh thu nhỏ, thời gian và trạng thái rõ ràng.
5. **Local Air Quality & Tips**: Chỉ số chất lượng không khí khu vực (nếu có) và mẹo bảo vệ sức khỏe khi ra đường.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Khu Dân Cư Của Tôi` (≤ 5 từ)
- **Primary CTA**: `Gửi phản ánh ngay` (≤ 4 từ)
- **Ngôn từ**: Gần gũi, tôn trọng người dân, tuyệt đối không dùng thuật ngữ thanh tra phức tạp.

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Tên người dùng | Yes | `profiles` / `users` | `profiles.fullName` | `Bạn` |
| Số phản ánh đã gửi | Yes | `complaints` table | `COUNT(id) WHERE reporterPhone = ?` | `0` |
| Danh sách phản ánh gần đây| Yes | `complaints` table | `complaints.*` | `[]` |

- **Current Implementation**: `GET /api/complaints/my`

---

## 9. DESKTOP & MOBILE BEHAVIOR
- **Desktop (1366×768)**: Bố cục cân đối ở giữa màn hình (max-w-4xl), hiển thị song song danh sách phản ánh và bản đồ điểm nóng khu vực lân cận.
- **Mobile (360–430px)**: Thiết kế Mobile-First tối ưu với ngón tay cái, nút "Gửi phản ánh" ghim nổi bật, danh sách phản ánh dạng thẻ cuộn dọc mượt mà.

---

## 10. ACCEPTANCE CRITERIA
- [ ] Màn hình tải nhanh dưới 0.5 giây trên mạng di động 4G.
- [ ] Nút "Gửi phản ánh ngay" có kích thước lớn, dễ bấm trên mọi thiết bị.
- [ ] Dữ liệu phản ánh cá nhân hiển thị chính xác theo tài khoản đã đăng nhập.

---

## 11. IMPLEMENTATION STATUS
- **CURRENT**: Giao diện trang chủ công dân, tổng kết phản ánh cá nhân, nút CTA gửi phản ánh, danh sách tin tức khu vực.
- **PARTIAL**: Tích hợp chỉ số AQI trạm đo gần nhất theo vị trí GPS công dân.
- **PROPOSED**: Nhận thông báo đẩy (Web Push) khi phản ánh được cán bộ xử lý xong.
