# ADM-03 — Cấu Hình Ngưỡng QCVN & Tham Số Hệ Thống

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/admin/settings` (và alias `/admin/system`)
- **Primary Role**: Quản trị viên hệ thống kỹ thuật (`admin`)
- **Secondary Roles**: Không có
- **Current Component**: `SettingsPage.jsx` (`app/src/apps/admin/pages/settings/SettingsPage.jsx`)
- **Layout**: `AdminLayout.jsx`
- **Primary Job**: Thiết lập các tham số vận hành toàn hệ thống: ngưỡng cảnh báo nồng độ bụi QCVN 05:2023, thời hạn cam kết SLA xử lý vụ việc và các thông số thông báo.
- **Success Condition**: Quản trị viên điều chỉnh và lưu cấu hình tham số hệ thống thành công và áp dụng cho toàn bộ các vụ việc tạo mới.

---

## 2. WHY THIS SCREEN EXISTS
- Các quy chuẩn môi trường hoặc quy chế phối hợp của từng thành phố có thể thay đổi theo thời gian (ví dụ: siết chặt hạn SLA từ 48h xuống 24h). Màn hình này cho phép cấu hình động các tham số mà không cần sửa đổi mã nguồn.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Sidebar mục "Cài đặt", click từ Dashboard admin (`/admin`).
- **Exit Points**:
  - Nút "Lưu cấu hình" $\rightarrow$ Lưu và hiển thị thông báo thành công.
- **Navigation Item**: Sidebar item "Cấu hình hệ thống" (icon Settings/Sliders).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem cấu hình hệ thống** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Thay đổi ngưỡng QCVN 05:2023** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Thay đổi thời hạn SLA xử lý** | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Truy cập /admin/settings 
→ Xem tab "Quy chuẩn môi trường": Ngưỡng PM2.5 trung bình 24h (50 µg/m³), PM10 (100 µg/m³)
→ Chuyển sang tab "Cam kết SLA": Thời hạn tiếp nhận (2h), Thời hạn xử lý hiện trường (24h/48h)
→ Điều chỉnh thông số mong muốn
→ Bấm nút "LƯU CẤU HÌNH THAM SỐ" → Nhận thông báo cập nhật thành công
```

---

## 6. INFORMATION HIERARCHY
1. **Header Block**: Tiêu đề "Cấu Hình Ngưỡng QCVN & Tham Số Hệ Thống", nút "Khôi phục mặc định", nút "Lưu thay đổi".
2. **Settings Tab Navigation**:
   - `Quy chuẩn môi trường (QCVN 05:2023)`
   - `Thời hạn cam kết SLA`
   - `Cấu hình Geofence & Bản đồ`
   - `Thông số máy chủ & API Worker`
3. **Form Fields Content Area**:
   - Ô nhập ngưỡng nồng độ bụi cảnh báo vàng và cảnh báo đỏ.
   - Ô nhập thời gian SLA cho từng bước trong quy trình 7 bước.
   - Bán kính Geofence hợp lệ khi nộp ảnh công trường (mặc định: $50\text{m}$).

---

## 7. CONTENT CONTRACT
- **Page Title**: `Cấu Hình Hệ Thống` (≤ 4 từ)
- **Primary CTA**: `Lưu cấu hình` (≤ 3 từ)
- **Căn cứ pháp lý**: Trích dẫn đúng QCVN 05:2023/BTNMT và QCVN 18:2021/BXD bên cạnh từng ô nhập liệu.

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Target Storage | Fallback |
|---|:---:|---|---|---|
| Ngưỡng PM2.5 | Yes | Form input | `system_metadata` | `50` |
| Ngưỡng PM10 | Yes | Form input | `system_metadata` | `100` |
| SLA mặc định | Yes | Form input | `system_metadata` | `48` (giờ) |

- **Current Implementation**: `GET /api/admin/settings`, `POST /api/admin/settings`

---

## 9. ACCEPTANCE CRITERIA
- [ ] Chỉ cho phép tài khoản Admin sửa đổi cấu hình.
- [ ] Lưu tham số thành công vào bảng `system_metadata` trong D1 SQLite.
- [ ] Tham số mới áp dụng ngay lập tức cho các vụ việc và cảnh báo sinh ra sau đó.

---

## 10. IMPLEMENTATION STATUS
- **CURRENT**: Giao diện cấu hình tham số, lưu cài đặt vào DB, khôi phục mặc định.
- **PARTIAL**: Cấu hình bán kính Geofence công trường.
- **PROPOSED**: Tích hợp cấu hình Webhook thông báo tới kênh Telegram/Slack của lãnh đạo.
