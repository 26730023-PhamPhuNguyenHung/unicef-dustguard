# Role & Permission Matrix — DustGuard VN

Hệ thống quản lý quyền theo 5 vai trò chuẩn (SSOT xác thực qua `app/src/lib/rbac-rules.js` và `app/server/routes/worker/auth.routes.js`):

| Role | Route Access | Read | Create | Update | Delete | Special Action | Evidence |
|---|---|---|---|---|---|---|---|
| **Public / Guest** | `/`, `/demo`, `/youth`, `/map`, `/guide`, `/login` | Public Sites, Sensors, Heatmap, Leaderboard | Feedback / Contact | None | None | Xem bản đồ rủi ro, tra cứu chứng chỉ QR | `public.routes.js`, `publicRoutes` |
| **Citizen / Youth** | `/citizen/*`, `/youth/*` | Ghi nhận của tôi, Chiến dịch, Tín chỉ tích lũy, Bản đồ | Tạo Ghi nhận vi phạm, Tải ảnh bằng chứng SHA-256 | Cập nhật hồ sơ cá nhân | Hủy bản nháp | Xuất chứng chỉ tình nguyện (20h = 4.0 tín chỉ), Quét QR ISO/IEC 18004 | `community.routes.js`, `citizenRoutes` |
| **Staff / Inspector** | `/staff/*` | 12 phân hệ: Công trình, Hồ sơ vụ việc, Cảnh báo, Cảm biến, Nhiệm vụ | Tạo vụ việc, Tạo biên bản khảo sát, Giao nhiệm vụ | Duyệt hồ sơ, Chuyển trạng thái 7 bước DAG, Cập nhật mức phạt | Lưu kho / Hủy nhiệm vụ | Tính điểm rủi ro R = sum(w*score), Xuất biên bản A4 chuẩn NĐ 30/2020 | `staff.routes.js`, `cases.routes.js` |
| **Contractor** | `/contractor/*` | Yêu cầu khắc phục, Hồ sơ liên quan công trình phụ trách | Nộp giải trình, Tải ảnh Before/After khắc phục | Cập nhật tiến độ xử lý | None | Đăng nhập nhanh không mật khẩu (Quick-Token), Geofence <= 50m | `contractor.routes.js`, `contractorRoutes` |
| **Admin / Executive** | `/admin/*`, `/staff/reports` | Toàn bộ cơ sở dữ liệu D1, Thống kê hệ thống, Audit logs | Thêm người dùng, Cấu hình chính sách, Kích hoạt Sweep | Cấp/Hủy quyền, Bật/Tắt tự động hóa | Xóa vĩnh viễn / Khôi phục thùng rác | Khôi phục dữ liệu, Reset demo canonical, Ban hành quyết định | `admin.routes.js`, `executive.routes.js` |

## Audit Quyền & An Toàn:
1. **Zero Permission Leak**: Mọi route mutation nhạy cảm (`/api/cases/:id/verify`, `/api/admin/*`, `/api/staff/*`) đều có middleware kiểm tra session role phía Hono Worker.
2. **Contractor Geofence Guard**: API tiếp nhận minh chứng khắc phục của nhà thầu bắt buộc kiểm tra tọa độ GPS WGS84 cách tâm công trình $\le 50\text{m}$.
3. **Idempotency Guard**: Các mutation quan trọng (tạo hồ sơ, duyệt quyết định) áp dụng cơ chế khóa idempotency key chống double submit.
