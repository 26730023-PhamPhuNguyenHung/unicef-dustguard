# DUSTGUARD VN — PRODUCT ENTRY & AUTH REDIRECT SSOT (MASTER SPEC)

> **Mã tài liệu**: `DG-SSOT-PRODUCT-ENTRY-2026`  
> **Phiên bản**: v1.0.0-CANONICAL  
> **Trạng thái**: ACTIVE SSOT (Nguồn Chân Lý Duy Nhất Cho Điểm Vào & Xác Thực)  
> **Thời điểm ban hành**: 05/09/2026

---

## 1. MÔ HÌNH ĐIỂM VÀO SẢN PHẨM (PRODUCT ENTRY MODEL)

DustGuard VN vận hành như một nền tảng thống nhất với **Hai Điểm Vào Chính (2 Canonical Entry Paths)**:

```
                            DUSTGUARD VN (dustguard.vn)
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼
          [ENTRY A: CỘNG ĐỒNG]                    [ENTRY B: CHUYÊN TRÁCH]
     (Community / Youth Civic Space)         (Professional Operational Space)
                    │                                       │
            apps/web (Port 3000)                dustguard-operations (Port 3002)
                    │                                       │
     • Ghi nhận vi phạm & bằng chứng         • Thụ lý hồ sơ từ cộng đồng
     • Xác thực cộng đồng ("Tôi cũng thấy")  • Checklist 10 tiêu chí QCVN 18
     • Tích lũy giờ tình nguyện & tín chỉ    • Thư viện pháp lý FTS5 & Xử phạt
     • Theo dõi công khai vụ việc            • Lệnh khắc phục Geofence ≤ 50m
                    │                                       │
                    └───────────► [BÀN GIAO HANDOFF] ───────┘
                        POST /api/integrations/community/cases
```

Tuyệt đối không phân mảnh sản phẩm thành các "App Người dân", "App Cán bộ", "App Nhà thầu", "App Admin".

---

## 2. KIẾN TRÚC XÁC THỰC & ĐĂNG NHẬP (LOGIN ARCHITECTURE)

### A. Nguyên Tắc Hai Cổng Độc Lập (Dual-Port Gateway)
- Không gộp chung CSDL xác thực; không dựng thêm dịch vụ Identity/SSO phức tạp thứ 3.
- Cổng Đăng nhập `/login` tại `apps/web` đóng vai trò là **Entry Selector thông minh**:
  - **Tab Phía Cộng đồng**: Xác thực tài khoản người dân, thanh niên, điều phối viên qua REST API `apps/server` (Port 3001).
  - **Tab Đơn vị Xử lý**: Điều hướng trực tiếp sang Cổng nghiệp vụ `dustguard-operations` (Port 3002).

### B. Quy Tắc Bảo Toàn Deep-Link (Deep-Link Preservation)
Khi người dùng truy cập một tuyến đường yêu cầu quyền hạn (ví dụ: `/tasks` hoặc `/cases/case-123/observe`) khi chưa đăng nhập:
1. `ProtectedRoute` chặn lại (HTTP 401) và chuyển hướng:
   ```typescript
   <Navigate to="/login" state={{ from: location }} replace />
   ```
2. Sau khi đăng nhập thành công, hệ thống đọc `location.state.from.pathname` và chuyển người dùng về **đúng trang ban đầu**, không ép buộc quay về trang `/dashboard`.

---

## 3. BỘ PHÂN GIẢI ĐIỀU HƯỚNG THEO NĂNG LỰC (CAPABILITY REDIRECT RESOLVER)

Mô-đun duy nhất quản lý luồng chuyển hướng sau đăng nhập: [`apps/web/src/utils/auth-redirect.ts`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/apps/web/src/utils/auth-redirect.ts):

```typescript
export function resolveCommunityHome(user: User | null, requestedPath?: string | null): string {
  // 1. Ưu tiên bảo toàn deep-link
  if (requestedPath && requestedPath !== '/login' && requestedPath !== '/register' && requestedPath !== '/') {
    return requestedPath;
  }

  if (!user) return '/dashboard';
  const role = (user.role || 'citizen').toLowerCase();

  // 2. Phân giải theo Năng lực (Capability)
  if (role === 'admin') return '/admin/overview';
  if (role === 'moderator') return '/moderator/dashboard';
  if (role === 'member' || role === 'community_member') return '/tasks';

  // 3. Mặc định Người dân
  return '/dashboard';
}
```

---

## 4. MÔ HÌNH QUẢN TRỊ VIÊN (ADMIN MODEL)

Admin không phải là một "sản phẩm" hay một "ứng dụng độc lập". Admin là quyền hạn cao nhất nằm bên trong từng Phía:

1. **Community Admin (Quản trị Cộng đồng)**:
   - Nằm tại: `apps/web/src/pages/Admin*` (`/admin/overview`, `/admin/users`, `/admin/audit`).
   - Quản lý: Tài khoản người dân, thành viên CLB, kiểm duyệt bài viết và xem audit logs cộng đồng.
2. **Professional Admin (Quản trị Nghiệp vụ)**:
   - Nằm tại: `dustguard-operations/apps/web/src/pages/Admin*` (`/admin/users`, `/admin/audit`, `/admin/settings`).
   - Quản lý: Cán bộ thanh tra, giám sát viên, chuyên viên pháp lý, cấu hình tham số hệ thống và sensor IoT.

---

## 5. ÁNH XẠ VAI TRÒ ĐẶC THÙ (EXECUTIVE & CONTRACTOR MAPPING)

- **Lãnh đạo / Executive**:
  - Không xây dựng portal riêng `/executive/*`.
  - Hợp nhất vào Năng lực của **Giám sát viên (Supervisor)** và **Báo cáo Điều hành (Operational Reports)** trong `dustguard-operations`.
- **Nhà thầu / Contractor**:
  - Không xây dựng portal đăng nhập riêng `/contractor/*`.
  - Tương tác thông qua **Mã truy cập Quick-Token dùng một lần** gắn với Lệnh khắc phục (`CorrectiveAction`), xác thực tọa độ GPS Geofence $\le 50\text{m}$ ngay trên hiện trường công trình.

---

## 6. LỚP ĐIỀU HƯỚNG KẾ THỪA (LEGACY REDIRECT LAYER)

Tất cả các tuyến đường cũ trong `app/` được cấu hình chuyển tiếp an toàn tại `apps/web/src/App.tsx`:

```tsx
{/* Citizen Legacy */}
<Route path="/citizen/reports" element={<Navigate to="/reports" replace />} />
<Route path="/citizen/report/new" element={<Navigate to="/reports/new" replace />} />
<Route path="/citizen/report" element={<Navigate to="/reports/new" replace />} />
<Route path="/citizen/track" element={<Navigate to="/reports" replace />} />
<Route path="/citizen/map" element={<Navigate to="/map" replace />} />
<Route path="/citizen/profile" element={<Navigate to="/profile" replace />} />
<Route path="/citizen/*" element={<Navigate to="/dashboard" replace />} />

{/* Community Legacy */}
<Route path="/community/tasks" element={<Navigate to="/tasks" replace />} />
<Route path="/community/contributions" element={<Navigate to="/contributions" replace />} />
<Route path="/community/clubs" element={<Navigate to="/communities" replace />} />
<Route path="/community/*" element={<Navigate to="/communities" replace />} />

{/* Operations Legacy */}
<Route path="/staff/*" element={<Navigate to="/dashboard" replace />} />
<Route path="/contractor/*" element={<Navigate to="/dashboard" replace />} />
<Route path="/executive/*" element={<Navigate to="/dashboard" replace />} />
```

---

## 7. QUY CHUẨN XỬ LÝ 401 & 403

1. **401 Unauthorized (Chưa đăng nhập)**:
   - Tự động chuyển hướng về `/login` kèm `state: { from: location }`.
   - Cấm hiển thị trang lỗi 403 hoặc màn hình trắng cho người dùng chưa đăng nhập.
2. **403 Forbidden (Đã đăng nhập nhưng thiếu quyền)**:
   - Hiển thị giao diện [`ForbiddenPage.tsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/apps/web/src/pages/ForbiddenPage.tsx) chuẩn mực, giải thích rõ vai trò hiện tại thiếu năng lực gì và có nút bấm quay về trang chủ.
   - Tuyệt đối không tự ý redirect về Landing Page khiến người dùng mất phương hướng.

---

## 8. DUY TRÌ & HỦY PHIÊN LÀM VIỆC (SESSION MANAGEMENT)

- **Session Restoration**: Đọc JWT token từ `localStorage` khi khởi tạo ứng dụng, tự động gọi API `/me` để phục hồi profile và danh sách Capabilities. F5 Reload trang không làm mất trạng thái đăng nhập.
- **Logout**: Xóa token, xóa user context, và chuyển hướng an toàn về `/login` hoặc `/`. Tuyệt đối không cho phép người dùng bấm nút Back trình duyệt để quay lại trang riêng tư sau khi đã đăng xuất.
