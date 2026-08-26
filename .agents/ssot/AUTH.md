# AUTH & SECURITY SSOT — DustGuard VN Hybrid Auth Architecture

> **Single Source of Truth (SSOT)** cho toàn bộ cơ chế Định danh (Authentication), Phân quyền (Authorization), Bảo mật Thiết bị IoT và Toàn vẹn Dữ liệu Mật mã trên nền tảng DustGuard VN.

---

## 1. Triết lý Kiến trúc Cốt lõi (Hybrid Auth Architecture)

DustGuard VN vận hành theo mô hình **Hybrid Authentication**:
```text
┌────────────────────────────────────────────────────────────────────────┐
│                        DUSTGUARD VN HYBRID AUTH                        │
├──────────────────────────────────┬─────────────────────────────────────┤
│      HUMAN ACTORS (Người)        │       MACHINE ACTORS (Thiết bị)     │
│  Citizen, Youth, Staff,          │   ESP32, Trạm cảm biến PM2.5/PM10,  │
│  Inspector, Executive, Admin     │   IoT Nodes ngoài hiện trường       │
├──────────────────────────────────┼─────────────────────────────────────┤
│  Lớp Xác thực: CLERK             │   Lớp Xác thực: HMAC-SHA256         │
│  - JWT Session Tokens (RS256)    │   - Pre-Shared Key (PSK)            │
│  - OAuth (Google), Passwords     │   - Clock Drift (< 5 phút)          │
│  - MFA, Email Verification       │   - Anti-Replay Sliding Cache       │
├──────────────────────────────────┴─────────────────────────────────────┤
│  Lớp Phân quyền & Nghiệp vụ (DustGuard Core - Cloudflare Worker / D1)   │
│  - IdentityContext Abstraction (Zero direct Clerk SDK in Domain)       │
│  - Idempotent D1 User Provisioning (`clerk_user_id` UNIQUE)            │
│  - RBAC Middleware (`requireAuth`, `requireRole`, `requirePermission`)  │
│  - Multi-Tenant & Horizontal Geofence Isolation                        │
│  - Cryptographic Evidence Integrity (SHA-256 Hash, Red Seal Stamp)     │
└────────────────────────────────────────────────────────────────────────┘
```

### Nguyên tắc Vàng (Core Invariants):
1. **Clerk handles PEOPLE**: Clerk chịu trách nhiệm hoàn toàn về danh tính người dùng, vòng đời phiên, khôi phục mật khẩu, xác thực mạng xã hội.
2. **DustGuard handles PERMISSIONS**: Toàn bộ logic phân quyền, quyền sở hữu tài nguyên, ma trận truy cập nằm tại backend DustGuard. Không bao giờ gán quyền tự do chỉ vì user đã đăng nhập.
3. **Cloudflare handles INFRASTRUCTURE**: D1 SQLite là SSOT lưu trữ profile và dữ liệu nghiệp vụ. R2 lưu trữ minh chứng. Worker Hono chạy logic edge.
4. **Device HMAC handles SENSORS**: Tuyệt đối không dùng Clerk token cho thiết bị ESP32/cảm biến; tách biệt 100% credential giữa người và máy.
5. **Zero Trust Client Payload**: Backend không tin tưởng `role`, `userId`, hoặc `organizationId` gửi lên từ body/query client; luôn trích xuất danh tính từ verified session token.

---

## 2. Human Authentication & IdentityContext Abstraction

### 2.1. Domain Independence & `IdentityContext`
Tầng Domain (`domain/`, `services/`, `risk-engine/`, `repositories/`) **tuyệt đối không phụ thuộc trực tiếp vào Clerk SDK**. Mọi request sau khi qua middleware xác thực đều được chuyển hóa thành đối tượng chuẩn `IdentityContext`:

```ts
export interface IdentityContext {
  userId: string;              // DustGuard internal user ID (e.g. usr_xxx)
  clerkUserId: string;          // External Clerk Subject ID (e.g. user_2xxx)
  email: string;               // User primary email
  displayName: string;         // Full name / display name
  roles: string[];             // Danh sách vai trò ('citizen', 'staff', 'admin', ...)
  primaryRole: string;         // Vai trò chính hiện tại
  organizationId: string | null; // Mã cơ quan / nhà thầu / CLB liên kết
  sessionId: string | null;    // Mã phiên làm việc
  status: 'ACTIVE' | 'DISABLED'; // Trạng thái tài khoản
  disabled: boolean;           // Cờ khóa tài khoản
  emailVerified: boolean;      // Trạng thái xác thực email
  metadata: Record<string, any>; // Dữ liệu mở rộng an toàn
}
```

### 2.2. Token Verification Strategy (Edge-Optimized)
- **Local/Networkless JWT Verification**: Backend Cloudflare Worker kiểm tra chữ ký RS256/JWT claim trực tiếp tại Edge mà không tạo subrequest HTTP sang Clerk API trên từng request, tối ưu chi phí và độ trễ (< 1ms).
- **Session Cache**: Áp dụng cache ngắn hạn (TTL 3 giây) kèm cơ chế Promise Coalescing để chống nghẽn D1/CPU khi chịu tải đột biến.

---

## 3. Vai trò Hệ thống (SSOT Roles) & Ma trận Phân quyền (Access Matrix)

> 📖 **Xem chi tiết đầy đủ tại**:
> - [`.agents/ssot/ROLES.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/ROLES.md) (Định danh 5 vai trò thực tế & quy tắc chuẩn hóa)
> - [`.agents/ssot/PERMISSIONS.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/PERMISSIONS.md) (Ma trận phân quyền RBAC & ABAC chi tiết)

### 3.1. Danh mục 5 Vai trò Thực tế (Roles SSOT)
```ts
export const ROLES = Object.freeze({
  PUBLIC: 'public',                           // Công chúng xem AQI tổng hợp, xu hướng
  CITIZEN: 'citizen',                         // Người dân / Thanh niên gửi ghi nhận, nhận điểm rèn luyện QR
  OPERATOR: 'operator',                       // Điều phối viên / Reviewer duyệt hàng đợi, chuyển giao 1022
  SITE_REPRESENTATIVE: 'site_representative', // Đơn vị thi công xem hiện trường, nộp ảnh dập bụi geofence <= 50m
  ADMIN: 'admin',                             // Quản trị viên hệ thống, cấu hình cảm biến IoT
});
```

### 3.2. Ma trận Phân quyền Tài nguyên Rút gọn (High-Level Access Control Matrix)

| Tài nguyên / Hành động | `PUBLIC` | `CITIZEN` | `OPERATOR` | `SITE_REPRESENTATIVE` | `ADMIN` |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem bản đồ AQI & xu hướng chung** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Xem danh sách công trường công khai** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Gửi ghi nhận hiện trường (`Observation`)** | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Tích lũy giờ tình nguyện & nhận QR chứng nhận** | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Duyệt hàng đợi ghi nhận (`Review Queue`)** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Tạo & quản lý vụ việc theo dõi (`Case`)** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Kết xuất Hồ sơ thực chứng A4 (SHA-256)** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Chuyển giao tới 1022 / iHanoi / Email** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Xem hồ sơ cảnh báo công trường được gán** | ❌ | ❌ | ✅ | ✅ (Own Site) | ✅ |
| **Nộp ảnh đối chứng dập bụi (Geofence <= 50m)** | ❌ | ❌ | ❌ | ✅ (Own Site + GPS) | ✅ |
| **Cấu hình cảm biến IoT & HMAC-SHA256 PSK** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Quản trị người dùng & Phân quyền hệ thống** | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 4. Bảo vệ Chống Leo thang Đặc quyền (Privilege Escalation Protection)

### 4.1. Chống Leo thang Đặc quyền Ngang (Horizontal Privilege Escalation & Multi-Tenancy)
- **Tách biệt Cơ quan / Tổ chức (`scopeByOrganization`)**: Cán bộ thuộc Tổ chức A không thể đọc hoặc chỉnh sửa dữ liệu mật của Tổ chức B, trừ Quản trị viên cấp cao (`admin`).
- **Bảo vệ Minh chứng Riêng tư (`canViewEvidence`)**: Minh chứng chưa xác minh (`UNVERIFIED_SIGNAL`) hoặc hồ sơ nội bộ chỉ người tạo hoặc cán bộ thụ lý mới được quyền truy cập.

### 4.2. Chống Leo thang Đặc quyền Dọc (Vertical Privilege Escalation)
- **Chặn giả mạo Role**: Middleware `requireRole` kiểm tra trực tiếp từ `identity.roles` lấy từ JWT/D1 đã xác thực. Tuyệt đối bỏ qua trường `role` hay `isAdmin` do client gửi trong request body/headers.
- **Chặn IDOR trên Actor Identification**: Mã định danh người thực hiện hành động luôn lấy từ `identity.userId`, không đọc từ `req.body.userId`.

---

## 5. Idempotent D1 User Provisioning

Khi người dùng Clerk truy cập DustGuard lần đầu tiên:
```text
Clerk Verified JWT
        ↓
Truy vấn D1 User theo clerk_user_id (hoặc email)
        ↓
┌───────┴───────┐
│               │
Đã tồn tại     Chưa tồn tại
│               │
Cập nhật        Tạo mới D1 User + Profile (Role = 'citizen' mặc định)
clerk_user_id   (Bảo đảm Idempotent chống Race Condition)
│               │
└───────┬───────┘
        ↓
Trả về IdentityContext hoàn chỉnh
```

- Cột `clerk_user_id` trong bảng `users` là `UNIQUE INDEX`.
- Không lưu `password_hash`, `refresh_token`, hay OAuth secrets trong D1 đối với các tài khoản quản lý bởi Clerk.

---

## 6. Xác thực Thiết bị IoT (Device Auth Isolation)

Cơ chế xác thực thiết bị ESP32 / Cảm biến môi trường hoàn toàn **độc lập với Clerk**:

```text
ESP32 Node / Sensor Station
          │
  POST /api/sensors/reading (hoặc /api/v1/telemetry)
  Body: { sensorCode, pm10, pm25, timestamp, signature }
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Kiểm tra dải giá trị vật lý (0 - 2500 µg/m³)             │
│ 2. Kiểm tra độ lệch đồng hồ (Timestamp Drift < 5 phút)     │
│ 3. Xác minh chữ ký HMAC-SHA256 bằng IOT_PRE_SHARED_KEY     │
│    (Sử dụng timing-safe equal chống tấn công kênh bên)       │
│ 4. Chống tấn công phát lại (Replay Protection):             │
│    - Sliding window in-memory cache theo signature key      │
│    - Ràng buộc Unique Timestamp trên D1 SensorReadings      │
│ 5. Tự động chuyển Sensor sang trạng thái ACTIVE            │
│ 6. Kích hoạt Alert & Case Engine nếu PM2.5 > 75 µg/m³       │
└─────────────────────────────────────────────────────────────┘
```

> **Lưu ý**: Các endpoint `/api/sensors/reading`, `/api/sensors/telemetry`, `/api/v1/telemetry` **không bao giờ đòi hỏi Clerk JWT token**.

---

## 7. Mật mã Toàn vẹn & Lá chắn Pháp lý (Legal Shield)

1. **Evidence SHA-256 Hashing**: Mỗi tệp ảnh/video/tài liệu tải lên R2 Storage được băm SHA-256 lưu trữ bất biến.
2. **Dấu mộc Đỏ Điện tử (Red Seal Stamp)**: Văn bản hành chính kết xuất chuẩn A4 HTML/DOCX chứa dấu mộc điện tử màu đỏ (`#9f241f`, `mix-blend-mode: multiply`) kèm mã xác thực HMAC.
3. **Lá chắn Chống Phỉ báng (`UNVERIFIED_SIGNAL`)**: Mọi hình ảnh gửi từ cộng đồng chưa qua kiểm chứng GPS/Exif được gắn cờ pháp lý `UNVERIFIED_SIGNAL` — không công khai danh tính công trường vi phạm cho đến khi đoàn thanh tra xác minh thực địa.
4. **Audit Logging**: Mọi thao tác phê duyệt, xử phạt, thu hồi, đổi trạng thái cảm biến được ghi log bất biến vào `audit_logs`.

---

## 8. Chuẩn hóa Phản hồi Lỗi (RFC 7807) & Nhật ký Bảo mật

- **HTTP 401 Unauthorized**: Token thiếu, sai định dạng, hết hạn hoặc tài khoản bị vô hiệu hóa.
- **HTTP 403 Forbidden**: Người dùng đã đăng nhập nhưng không đủ quyền hạn (sai role, sai cơ quan, hoặc cố ý leo thang đặc quyền).
- **HTTP 404 Not Found**: Tài nguyên không tồn tại.
- **HTTP 409 Conflict**: Phát hiện tấn công phát lại (Replay Attack) hoặc trùng lặp bản ghi.
- **Tuyệt đối không rò rỉ**: Không ghi log hoặc trả về JWT, Pre-Shared Key, Secret, hay Password trong response body hoặc console logs.
