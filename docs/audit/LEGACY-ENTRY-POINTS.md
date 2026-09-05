# DUSTGUARD VN — AUDIT: LEGACY ENTRY POINTS & RETIREMENT MAP
## Kiểm Toán Điểm Vào Hệ Thống Kế Thừa (Legacy Entry Points) & Lộ Trình Triệt Tiêu

> **Mã tài liệu**: `DG-AUDIT-LEGACY-ENTRY-POINTS`  
> **Thời điểm kiểm toán**: 05/09/2026  
> **Mục tiêu**: Liệt kê 100% các điểm vào (Entry points), nút bấm đăng nhập, liên kết demo, và route guards thuộc thế hệ monolithic 5 nhóm người dùng cũ (`citizen`, `community`, `staff`, `contractor`, `executive`, `admin`); xác định đích đến chuẩn tắc theo Mô hình 2 Phía và cơ chế xử lý chuyển tiếp.

---

## 1. NGUYÊN TẮC BẤT BIẾN ENTRY EXPERIENCE

1. **Một Nền Tảng — Hai Phía Tương Hỗ**: Toàn bộ hệ sinh thái DustGuard VN chỉ có duy nhất **2 Cổng vào Nghiệp vụ**:
   - **Cổng Cộng đồng (Side A)**: Dành cho Người dân, Thanh niên, CLB tình nguyện và Điều phối viên cơ sở.
   - **Cổng Chuyên trách (Side B)**: Dành cho Cán bộ thanh tra môi trường, Giám sát viên, Chuyên viên pháp lý và Đơn vị thi công.
2. **Không Còn 5 Portal Legacy**: Xóa bỏ vĩnh viễn tư duy chia nhỏ thành 5 web apps độc lập.
3. **Admin không phải một "Product"**: Admin là quyền quản trị hệ thống thuộc phạm vi từng Side (Quản trị cộng đồng tại `apps/web/admin/*` và Quản trị nghiệp vụ tại `dustguard-operations/admin/*`).

---

## 2. BẢNG KIỂM KÊ & ÁNH XẠ ĐIỂM VÀO KẾ THỪA (LEGACY ENTRY POINT AUDIT)

| Điểm vào cũ (Legacy Entry Point) | Nơi tìm thấy (Source Code) | Bản chất chức năng | Đích đến chuẩn tắc mới (Canonical Destination) | Cơ chế xử lý (Resolution Mechanism) | Trạng thái (Status) |
|---|---|---|---|---|:---:|
| `GET /citizen` | `app/src/apps/citizen/routes.jsx` | Trang chủ người dân cũ | `/reports` hoặc `/dashboard` (`apps/web`) | Client-side SPA Redirect trong `App.tsx` | **REDIRECTED** |
| `GET /citizen/report/new` | `app/src/modules/citizen/CitizenReport.jsx` | Form phản ánh cũ | `/reports/new` (`apps/web`) | Client-side SPA Redirect trong `App.tsx` | **REDIRECTED** |
| `GET /citizen/track` | `app/src/modules/citizen/CitizenTrack.jsx` | Tra cứu phản ánh cũ | `/reports` (`apps/web`) | Client-side SPA Redirect trong `App.tsx` | **REDIRECTED** |
| `GET /community` | `app/src/apps/community/routes.jsx` | Hub thanh niên cũ | `/communities` (`apps/web`) | Client-side SPA Redirect trong `App.tsx` | **REDIRECTED** |
| `GET /community/tasks` | `app/src/modules/community/` | Nhiệm vụ khảo sát cũ | `/tasks` (`apps/web`) | Client-side SPA Redirect trong `App.tsx` | **REDIRECTED** |
| `GET /staff` | `app/src/apps/staff/routes.jsx` | Bàn làm việc cán bộ cũ | `/dashboard` (`dustguard-operations`) | Hướng dẫn chuyển sang Cổng Operations Port 3002 | **REDIRECTED** |
| `GET /staff/cases` | `app/src/apps/staff/pages/cases/CasesListPage.jsx` | Quản lý hồ sơ D1 cũ | `/cases` (`dustguard-operations`) | Chuyển tiếp sang Cổng Operations Port 3002 | **REDIRECTED** |
| `GET /contractor` | `app/src/apps/contractor/routes.jsx` | Portal riêng cho nhà thầu | `/actions` (`dustguard-operations`) | Thay thế bằng liên kết Quick-Token Geofence $\le 50\text{m}$ | **REPLACED** |
| `GET /executive` | `app/src/apps/executive/routes.jsx` | Dashboard lãnh đạo cũ | `/dashboard` (`dustguard-operations`) | Hợp nhất vào Giám sát viên (`supervisor` capability) | **MERGED** |
| `GET /admin` | `app/src/apps/admin/routes.jsx` | Portal admin monolithic cũ | `/admin/overview` (`apps/web`) | Tách biệt theo scope Side A và Side B | **CANONICALIZED** |
| "Cổng cán bộ" (Header cũ) | `apps/web/src/components/landing/LandingHeader.tsx` | Link ngoài đơn lẻ | "Đơn vị xử lý" $\to$ `http://localhost:3002` | Nút phụ bên cạnh nút Đăng nhập và Gửi phản ánh | **UPGRADED** |
| "RoleStories" (4 Cột rời rạc) | `apps/web/src/components/landing/RoleStories.tsx` | 4 roles Citizen/Staff/Contractor/Supervisor | **Two-Side Model Section** | Tái cấu trúc thành 2 Cột đối chiếu phối hợp trách nhiệm | **RESTRUCTURED** |
| Login 4-role buttons | `apps/web/src/pages/LoginPage.tsx` | Nút đăng nhập theo role cũ | **Entry Selector 2 Phía** (Cộng đồng vs Chuyên trách) | Tabs chọn không gian, bảo toàn deep-link và capability redirect | **RESTRUCTURED** |

---

## 3. KẾT LUẬN & CAM KẾT VẬN HÀNH

- **Không còn bất kỳ liên kết công khai nào trên Landing Page trỏ vào `app/` monolithic cũ.**
- **Mọi yêu cầu truy cập URL legacy đều được lớp `Navigate` trong `apps/web/src/App.tsx` chuyển tiếp an toàn sang URL chuẩn mới mà không gây lỗi 404.**
- **Bảo toàn 100% deep-link ban đầu của người dùng sau khi đăng nhập thành công.**
