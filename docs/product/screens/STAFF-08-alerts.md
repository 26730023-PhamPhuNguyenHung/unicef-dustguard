# STF-08 — Tiếp Nhận & Xử Lý Cảnh Báo Ô Nhiễm

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/staff/alerts`
- **Primary Role**: Đội phản ứng nhanh & Cán bộ trực ca (`staff`)
- **Secondary Roles**: Quản trị viên (`admin`)
- **Current Component**: `StaffAlertsPage.jsx` (`app/src/apps/staff/pages/alerts/StaffAlertsPage.jsx`)
- **Layout**: `StaffLayout.jsx`
- **Primary Job**: Tiếp nhận các sự kiện vượt ngưỡng bụi bất thường và nhanh chóng chuyển hóa thành nhiệm vụ kiểm tra thực địa hoặc vụ việc xử lý.
- **Success Condition**: Cán bộ xử lý triệt để các cảnh báo mới phát sinh trong vòng 15 phút từ lúc hệ thống phát hiện.

---

## 2. WHY THIS SCREEN EXISTS
- Cảnh báo tự động từ cảm biến hoặc phản ánh dồn dập từ người dân cần một hàng đợi xử lý khẩn cấp riêng biệt. Màn hình này giúp phân loại cảnh báo: cảnh báo thật $\rightarrow$ chuyển thành nhiệm vụ kiểm tra; cảnh báo giả/nhiễu $\rightarrow$ đóng và ghi lý do.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Sidebar mục "Cảnh báo" (kèm badge đỏ khi có cảnh báo mới), click từ Bàn điều hành ca trực (`/staff`).
- **Exit Points**:
  - Click "Tạo vụ việc từ cảnh báo" $\rightarrow$ Mở `/staff/cases` với dữ liệu điền sẵn.
  - Click "Giao nhiệm vụ kiểm tra" $\rightarrow$ Mở Drawer tạo nhiệm vụ (`/staff/tasks`).
- **Navigation Item**: Sidebar item "Cảnh báo" (icon AlertTriangle/Bell).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem danh sách cảnh báo** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Xác nhận tiếp nhận cảnh báo** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Chuyển hóa cảnh báo thành vụ việc** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Đóng cảnh báo giả (False positive)**| ❌ | ❌ | ✅ | ❌ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Mở /staff/alerts 
→ Xem danh sách cảnh báo chưa xử lý (Màu đỏ: PM10 vượt >150, Màu cam: >100)
→ Click xem chi tiết cảnh báo (Trạm đo nào, lúc mấy giờ, nồng độ bao nhiêu)
→ Chọn hành động: "Chuyển thành Vụ việc" hoặc "Giao kiểm tra ngay"
→ Hệ thống tự động tạo hồ sơ vụ việc và chuyển trạng thái cảnh báo sang RESOLVED
```

---

## 6. INFORMATION HIERARCHY
1. **Header Block**: Tiêu đề "Tiếp Nhận & Xử Lý Cảnh Báo Ô Nhiễm", số lượng cảnh báo khẩn cấp đang chờ.
2. **Alert Severity Filter**: Lọc theo Mức độ (`Nghiêm trọng` | `Cảnh báo` | `Đã xử lý`).
3. **Alert Cards / List Area**:
   - Tên công trình & Vị trí trạm đo phát cảnh báo
   - Nồng độ bụi đo được tại thời điểm kích hoạt ($\mu\text{g/m}^3$)
   - Thời gian kích hoạt & Thời hạn phản hồi SLA
   - Hành động nhanh: Nút "Tạo vụ việc", Nút "Giao kiểm tra", Nút "Đóng cảnh báo giả"
4. **Resolution Modal**: Popup nhập lý do khi đóng cảnh báo hoặc xác nhận tạo vụ việc.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Cảnh Báo Ô Nhiễm` (≤ 4 từ)
- **Primary CTA**: `Tạo vụ việc` (≤ 3 từ)
- **Action Buttons**: `Giao kiểm tra | Bỏ qua (Nhiễu)`

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| ID cảnh báo | Yes | `alerts` table | `alerts.id` | `—` |
| Giá trị PM10 | Yes | `alerts` table | `alerts.pm10Value` | `0` |
| Thời điểm kích hoạt | Yes | `alerts` table | `alerts.triggeredAt` | `Vừa xong` |
| Trạng thái | Yes | `alerts` table | `alerts.status` | `PENDING` |

- **Current Implementation**: `GET /api/sensors/alerts?status=PENDING`, `POST /api/sensors/alerts/:id/resolve`

---

## 9. DESKTOP & MOBILE BEHAVIOR
- **Desktop (1366×768)**: Bảng cảnh báo có phân màu nền nổi bật theo mức độ nghiêm trọng.
- **Mobile (360–430px)**: Dạng danh sách thẻ đỏ/cam đậm, các nút xử lý nhanh có kích thước lớn dễ bấm bằng một tay.

---

## 10. ACCEPTANCE CRITERIA
- [ ] Cảnh báo mới hiển thị tức thì không cần tải lại toàn trang.
- [ ] Thao tác chuyển thành vụ việc tự động kế thừa tên công trình và thời gian sự cố.
- [ ] Khi đóng cảnh báo giả bắt buộc phải nhập lý do giải trình.

---

## 11. IMPLEMENTATION STATUS
- **CURRENT**: Danh sách cảnh báo, lọc mức độ nghiêm trọng, chuyển trạng thái đã xử lý.
- **PARTIAL**: Tạo nhanh vụ việc trực tiếp từ bản ghi cảnh báo.
- **PROPOSED**: Tích hợp chuông thông báo âm thanh khi phát sinh cảnh báo đỏ.
