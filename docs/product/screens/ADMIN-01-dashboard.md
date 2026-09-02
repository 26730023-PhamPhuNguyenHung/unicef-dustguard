# ADM-01 — Bảng Điều Hành Quản Trị Hệ Thống & Hạ Tầng D1

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/admin` (và alias `/admin/dashboard`)
- **Primary Role**: Quản trị viên hệ thống kỹ thuật (`admin`)
- **Secondary Roles**: Lãnh đạo IOC đô thị (`executive`)
- **Current Component**: `AdminDashboardPage.jsx` (`app/src/apps/admin/pages/dashboard/AdminDashboardPage.jsx`)
- **Layout**: `AdminLayout.jsx`
- **Primary Job**: Giám sát sức khỏe hạ tầng kỹ thuật (Cloudflare D1 Database, Edge Worker, Tỷ lệ lỗi API, Tải hệ thống) và tổng lượng dữ liệu toàn thành phố.
- **Success Condition**: Quản trị viên nắm được trạng thái sẵn sàng của hạ tầng (Uptime, D1 Queries, Storage R2) trong vòng 5 giây.

---

## 2. WHY THIS SCREEN EXISTS
- Đảm bảo hệ thống CivicTech vận hành ổn định, tin cậy và không gián đoạn. Màn hình này cung cấp các chỉ số hạ tầng kỹ thuật, phát hiện lỗi kết nối cơ sở dữ liệu D1 hoặc trạm đo quá tải để quản trị viên can thiệp kịp thời.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Đăng nhập với vai trò Admin (`/login`), hoặc truy cập trực tiếp `/admin`.
- **Exit Points**:
  - Click vào quản lý tài khoản $\rightarrow$ Chuyển đến Danh bạ người dùng (`/admin/users`).
  - Click vào cấu hình hệ thống $\rightarrow$ Chuyển đến Cài đặt (`/admin/settings`).
  - Click vào sổ bộ công trình $\rightarrow$ Mở `/staff/sites`.
- **Navigation Item**: Sidebar item "Hạ tầng D1" (icon Server/Cpu).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem bảng điều hành admin** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Kích hoạt Schema-Healer D1** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Xóa cache / Dọn dẹp dữ liệu rác**| ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Truy cập /admin 
→ Xem trạng thái dịch vụ: Cloudflare D1 (Healthy) | Edge Worker (Active) | R2 Storage (Connected)
→ Kiểm tra biểu đồ số lượng truy vấn D1 và thời gian phản hồi trung bình (latency <50ms)
→ Xem tổng quan số lượng thực thể: Số tài khoản, Số công trình, Số vụ việc, Số trạm đo
→ Bấm nút "Kiểm tra toàn vẹn D1 (Schema Healer)" nếu phát hiện bất thường
```

---

## 6. INFORMATION HIERARCHY
1. **Header Block**: Tiêu đề "Bảng Điều Hành Quản Trị Hệ Thống", nhãn trạng thái tổng thể "HỆ THỐNG HOẠT ĐỘNG BÌNH THƯỜNG", nút "Làm mới số liệu".
2. **Infrastructure Health Grid (4 Thẻ Hạ Tầng)**:
   - `Cơ sở dữ liệu Cloudflare D1`: Sẵn sàng (Zero-Crash Engine)
   - `Edge Worker & API Routes`: Thời gian phản hồi ~35ms
   - `Lưu trữ minh chứng R2`: Tỷ lệ mã băm hợp lệ 100%
   - `Kết nối trạm đo IoT`: 12/12 trạm trực tuyến
3. **Database Entities Counter (Thống Kê Dữ Liệu Thực)**:
   - Tổng số tài khoản (`users`), Tổng số công trình (`sites`), Tổng số vụ việc (`cases`), Tổng số bản ghi đo bụi (`sensor_readings`).
4. **Recent System Audit Logs**: 5 sự kiện hệ thống gần nhất (đăng nhập admin, cập nhật cấu hình, lỗi truy vấn).

---

## 7. CONTENT CONTRACT
- **Page Title**: `Bảng Quản Trị Hệ Thống` (≤ 5 từ)
- **Primary CTA**: `Kiểm tra toàn vẹn D1` (≤ 5 từ)

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Trạng thái D1 | Yes | Worker runtime | `env.DB` status check | `HEALTHY` |
| Thống kê thực thể | Yes | D1 SQLite Tables | `COUNT(*)` từ các bảng chính | `0` |
| Nhật ký hệ thống | Yes | `audit_logs` | `audit_logs.*` | `[]` |

- **Current Implementation**: `GET /api/admin/metrics`, `GET /api/health`

---

## 9. ACCEPTANCE CRITERIA
- [ ] Chỉ cho phép tài khoản có vai trò `admin` truy cập.
- [ ] Số liệu bản ghi đọc trực tiếp từ các câu lệnh SQL `COUNT(*)` trên D1 thật.
- [ ] Nút kiểm tra toàn vẹn kích hoạt hàm `ensureSchema(db)` trong `schema-healer.js` an toàn.

---

## 10. IMPLEMENTATION STATUS
- **CURRENT**: Giao diện tổng quan admin, thống kê số lượng thực thể D1, kiểm tra sức khỏe dịch vụ.
- **PARTIAL**: Biểu đồ lưu lượng truy cập thời gian thực.
- **PROPOSED**: Tự động sao lưu bản snapshot SQLite định kỳ hàng tuần.
