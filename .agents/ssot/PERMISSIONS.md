# PERMISSIONS SSOT — DustGuard VN Access Control & Security Matrix

> **Single Source of Truth (SSOT)**: Quy chuẩn ma trận phân quyền (Access Control Matrix) và chính sách kiểm soát truy cập (RBAC + ABAC) trên toàn bộ tài nguyên của DustGuard VN.  
> **Nguyên tắc cốt lõi**: Least Privilege, Tách biệt ngang (Horizontal Isolation), Toàn vẹn mật mã (Cryptographic Integrity) và **Thực chứng xây dựng (Constructive Evidence over Bureaucratic Sanction)**.

---

## ⚡ 1. Nguyên Tắc Phân Quyền Cốt Lõi (Core Authorization Principles)

1. **Zero-Trust Server Enforcement**: Backend Cloudflare Worker / Hono middleware luôn xác thực và phân quyền trên server dựa trên `IdentityContext` trích xuất từ verified token. Tuyệt đối không tin tưởng bất kỳ trường `role`, `isAdmin`, hoặc `organizationId` nào do client gửi lên trong request body/headers.
2. **Không Quyền Lực Chế Tài (No Sanctions)**: Quyền hạn được thiết kế xoay quanh chu trình **Quan sát -> Đối chứng -> Theo dõi -> Chuyển giao**. Không tồn tại các quyền mang tính cưỡng chế hành chính (như "Lập biên bản xử phạt", "Quyết định đình chỉ thi công").
3. **Kiểm Soát Theo Bối Cảnh Thực Tế (Attribute-Based Access Control - ABAC)**:
   - **Geofence Boundary (<= 50m)**: Quyền nộp ảnh đối chứng khắc phục của `SITE_REPRESENTATIVE` bắt buộc phải có tọa độ GPS nằm trong bán kính 50 mét so với tâm công trình.
   - **Tách Biệt Ngang Công Trình (Site Isolation)**: Đại diện công trình chỉ được xem và tương tác với công trình được phân quyền (`siteId == identity.organizationId`).
   - **Bảo Vệ Minh Chứng Chưa Kiểm Chứng (`UNVERIFIED_SIGNAL`)**: Minh chứng mới gửi từ cộng đồng chưa qua thẩm tra chỉ có người tạo (`reporterId`) và Điều phối viên (`OPERATOR`) / Quản trị viên (`ADMIN`) được truy cập chi tiết thô; công chúng chỉ thấy điểm tổng hợp.
4. **Bảo Toàn Chuỗi Dữ Liệu Bất Biến (Tamper-Evident Hash Chain)**: Quyền kết xuất hồ sơ (`CASE:EXPORT_DOSSIER`) tự động gắn mã băm SHA-256 bất biến, bảo đảm hồ sơ khi chuyển giao không thể bị sửa đổi.

---

## 📋 2. Danh Mục Quyền Hạn Chi Tiết (Fine-Grained Permissions Catalog)

| Mã Quyền (Permission Key) | Phạm vi & Bounded Context | Diễn giải Nghiệp vụ |
|---|---|---|
| `OBSERVATION:CREATE` | `observations/` | Gửi ghi nhận hiện trường mới kèm ảnh chụp và tọa độ GPS |
| `OBSERVATION:VIEW_PUBLIC` | `observations/` | Xem danh sách các ghi nhận đã kiểm chứng công khai |
| `OBSERVATION:VIEW_OWN` | `observations/` | Xem toàn bộ lịch sử các ghi nhận do chính mình gửi |
| `OBSERVATION:REVIEW` | `observations/` | Duyệt, gắn thẻ phân loại, xác minh tính hợp lệ của ghi nhận trong hàng đợi |
| `CASE:VIEW_PUBLIC` | `cases/` | Xem danh sách và tóm tắt tiến độ các vụ việc công khai |
| `CASE:CREATE` | `cases/` | Gom nhóm các ghi nhận thành Vụ việc theo dõi hệ thống |
| `CASE:MANAGE_TIMELINE` | `cases/`, `followups/` | Cập nhật dòng thời gian theo dõi 24h/48h và kết quả chuyển biến |
| `CASE:EXPORT_DOSSIER` | `cases/`, `evidence/` | Kết xuất Bộ hồ sơ thực chứng cộng đồng chuẩn A4 kèm mã hash SHA-256 |
| `HANDOFF:DISPATCH` | `handoffs/` | Chuyển giao hồ sơ có cấu trúc sang Cổng 1022, Ứng dụng iHanoi, Email UBND |
| `HANDOFF:UPDATE_STATUS` | `handoffs/` | Cập nhật trạng thái tiếp nhận và phản hồi từ đơn vị chức năng |
| `SITE:VIEW_PUBLIC` | `sites/` | Xem bản đồ và thông tin cơ bản các công trường công khai |
| `SITE:VIEW_ASSIGNED` | `sites/` | Xem chi tiết hiện trường và hồ sơ chuyên sâu của công trường được gán |
| `SITE:SUBMIT_MITIGATION` | `sites/`, `evidence/` | Nộp ảnh đối chứng dập bụi (bắt buộc kiểm tra Geofence <= 50m) |
| `YOUTH:EARN_CREDITS` | `campaigns/`, `impact/` | Tham gia hoạt động xanh, tích lũy giờ tình nguyện và nhận mã QR chứng nhận |
| `SENSOR:READ_PUBLIC` | `sensors/` | Xem dữ liệu chỉ số AQI, PM2.5, PM10 công khai từ trạm quan trắc |
| `SENSOR:CONFIGURE` | `sensors/` | Đăng ký thiết bị, cài đặt ngưỡng cảnh báo, quản lý mã HMAC-SHA256 PSK |
| `SYSTEM:AUDIT_LOGS` | `system/` | Xem nhật ký kiểm toán hệ thống bất biến |
| `SYSTEM:MANAGE_USERS` | `system/` | Quản lý danh mục người dùng và phân quyền tài khoản |

---

## 🛡️ 3. Ma Trận Phân Quyền Chi Tiết (Complete Access Matrix 5 x 18)

| Tài nguyên & Hành động | `PUBLIC` | `CITIZEN` | `OPERATOR` | `SITE_REPRESENTATIVE` | `ADMIN` |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem bản đồ AQI & xu hướng chung** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Xem danh sách công trường công khai** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Gửi ghi nhận hiện trường (`Observation`)** | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Xem lịch sử ghi nhận của bản thân** | ❌ | ✅ (Own) | ✅ (Own) | ❌ | ✅ (All) |
| **Tích lũy giờ tình nguyện & nhận QR chứng nhận** | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Duyệt hàng đợi ghi nhận (`Review Queue`)** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Tạo & gom nhóm Vụ việc (`Case`)** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Cập nhật dòng thời gian theo dõi (24h/48h)** | ❌ | ✅ (Followup) | ✅ | ❌ | ✅ |
| **Kết xuất Hồ sơ thực chứng A4 (SHA-256)** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Chuyển giao tới 1022 / iHanoi / Email** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Cập nhật phản hồi từ cơ quan tiếp nhận** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Xem hồ sơ cảnh báo công trường được gán** | ❌ | ❌ | ✅ | ✅ (Own Site) | ✅ |
| **Nộp ảnh đối chứng dập bụi (Geofence <= 50m)** | ❌ | ❌ | ❌ | ✅ (Own Site + GPS) | ✅ |
| **Xem dữ liệu trạm cảm biến công khai** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Cấu hình trạm cảm biến IoT & HMAC PSK** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Xem nhật ký bảo mật (`audit_logs`)** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Quản trị người dùng & phân quyền** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Quản trị hệ thống & sao lưu D1/R2** | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🎯 4. Chính Sách Kiểm Tra Quyền Ngữ Cảnh (Contextual ABAC Policies)

### 4.1. Chính sách Nộp Ảnh Đối Chứng Hiện Trường (`canSubmitSiteMitigation`)
Điều kiện để một tài khoản được phép tải ảnh đối chứng dập bụi lên hệ thống:
```ts
export function canSubmitSiteMitigation(identity, site, currentGps) {
  if (!identity || identity.disabled) return false;
  if (identity.isAdmin()) return true;

  // Phải có vai trò SITE_REPRESENTATIVE
  if (!identity.isSiteRepresentative()) return false;

  // Phải đúng công trường được phân công (Horizontal Isolation)
  if (!site || site.id !== identity.organizationId) return false;

  // Bắt buộc xác thực khoảng cách Geofence <= 50m so với tâm công trình
  if (!currentGps || !site.latitude || !site.longitude) return false;
  const distance = calculateHaversineDistance(
    currentGps.latitude, currentGps.longitude,
    site.latitude, site.longitude
  );

  return distance <= 50; // mét
}
```

### 4.2. Chính sách Duyệt Ghi Nhận Hiện Trường (`canReviewObservation`)
```ts
export function canReviewObservation(identity, observation) {
  if (!identity || identity.disabled) return false;
  if (identity.isAdmin() || identity.isOperator()) return true;
  return false;
}
```

### 4.3. Chính sách Thực Hiện Chuyển Giao Handoff (`canDispatchHandoff`)
```ts
export function canDispatchHandoff(identity, caseRecord) {
  if (!identity || identity.disabled) return false;
  if (identity.isAdmin() || identity.isOperator()) return true;
  return false;
}
```

### 4.4. Chính sách Truy Cập Minh Chứng Riêng Tư (`canViewRestrictedEvidence`)
```ts
export function canViewRestrictedEvidence(identity, evidence) {
  if (!identity || identity.disabled) return false;
  if (identity.isAdmin() || identity.isOperator()) return true;
  if (!evidence) return false;

  // Minh chứng công khai hoặc đã qua xác minh
  if (evidence.isPublic || evidence.status === 'VERIFIED') return true;

  // Người tạo minh chứng luôn được xem ảnh của mình
  const ownerId = evidence.uploaderId || evidence.userId || evidence.reporterId;
  if (ownerId && (ownerId === identity.userId || ownerId === identity.clerkUserId)) {
    return true;
  }

  return false;
}
```

---

## 🚦 5. Cơ Chế Thực Thi Middleware (Middleware Enforcement)

Mọi route tại tầng API Hono được bảo vệ bởi 4 middleware chuẩn:

1. **`requireAuth()`**: Yêu cầu request phải có Session Token / Bearer JWT hợp lệ và tài khoản không bị vô hiệu hóa (`disabled !== true`). Trả về `401 Unauthorized` nếu không hợp lệ.
2. **`requireRole(requiredRole)`**: Yêu cầu người dùng phải có đúng vai trò chỉ định hoặc cấp bậc tương đương. Trả về `403 Forbidden` nếu vi phạm.
3. **`requireAnyRole([...allowedRoles])`**: Yêu cầu người dùng có ít nhất một trong các vai trò trong danh sách.
4. **`requirePermission(predicateFn)`**: Thực thi kiểm tra ABAC phức tạp (truyền `IdentityContext` và tài nguyên đối tượng). Trả về `403 Forbidden` kèm mã lỗi chuẩn RFC 7807 nếu không thỏa mãn điều kiện.

---

## 🚨 6. Chuẩn Hóa Phản Hồi Lỗi (RFC 7807 Security Error Protocol)

Khi xảy ra lỗi xác thực hoặc phân quyền, API trả về JSON chuẩn:

```json
{
  "type": "https://dustguard.vn/errors/forbidden",
  "title": "Truy cập bị từ chối",
  "status": 403,
  "detail": "Bạn không có quyền thực hiện hành động này trên tài nguyên được yêu cầu.",
  "code": "AUTH_FORBIDDEN",
  "timestamp": "2026-08-26T08:55:00.000Z"
}
```

* **HTTP 401 (Unauthorized)**: Chưa đăng nhập, token hết hạn, sai định dạng.
* **HTTP 403 (Forbidden)**: Đã đăng nhập nhưng không đủ quyền hoặc sai phạm vi công trường / ngoài Geofence 50m.
