# STF-11 — Nhật Ký Tác Nghiệp Công Vụ & Kiểm Toán

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/staff/activity`
- **Primary Role**: Cán bộ thanh tra nội bộ & Giám sát công vụ (`staff` / `auditor`)
- **Secondary Roles**: Lãnh đạo (`executive`), Quản trị viên (`admin`)
- **Current Component**: `StaffActivityPage.jsx` (`app/src/apps/staff/pages/activity/StaffActivityPage.jsx`)
- **Layout**: `StaffLayout.jsx`
- **Primary Job**: Tra cứu và đối kiểm toàn bộ nhật ký thao tác công vụ (ai làm gì, vào lúc nào, với vụ việc nào) nhằm đảm bảo tính minh bạch và phòng ngừa tiêu cực.
- **Success Condition**: Cán bộ kiểm toán truy vết được lịch sử thay đổi trạng thái của bất kỳ vụ việc nào trong hệ thống kèm bằng chứng thời gian bất biến.

---

## 2. WHY THIS SCREEN EXISTS
- Trong công tác thanh tra trật tự xây dựng và môi trường, tính minh bạch và bất biến của hồ sơ là yếu tố sống còn. Màn hình này ghi nhận mọi hành vi: chuyển bước hồ sơ, duyệt bằng chứng, giao việc, xuất bản báo cáo để phục vụ thanh tra công vụ và giải trình khi có khiếu nại.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Sidebar mục "Nhật ký tác nghiệp", click từ Chi tiết vụ việc (`/staff/cases/:id`).
- **Exit Points**:
  - Click vào mã vụ việc trong dòng log $\rightarrow$ Mở `/staff/cases/:id`.
  - Click vào cán bộ thực hiện $\rightarrow$ Xem hồ sơ cán bộ.
- **Navigation Item**: Sidebar item "Nhật ký" (icon History/Shield).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem nhật ký tác nghiệp** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Lọc theo cán bộ / vụ việc / ngày** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Xuất file kiểm toán (.CSV)** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Chỉnh sửa / Xóa dòng nhật ký** | ❌ | ❌ | ❌ *(Bất biến)* | ❌ | ❌ *(Bất biến)* |

---

## 5. PRIMARY USER FLOW
```text
Truy cập /staff/activity 
→ Chọn khoảng thời gian hoặc nhập mã hồ sơ vụ việc cần kiểm toán
→ Danh sách dòng sự kiện hiển thị theo thứ tự thời gian giảm dần
→ Xem chi tiết: Tên cán bộ, Hành động (Chuyển bước / Nghiệm thu), Đối tượng tác động
→ Nhấp xem chi tiết JSON payload để đối chứng dữ liệu cũ vs dữ liệu mới
```

---

## 6. INFORMATION HIERARCHY
1. **Header Block**: Tiêu đề "Nhật Ký Tác Nghiệp Công Vụ", tổng số lượt thao tác trong ngày, nút "Xuất CSV".
2. **Audit Filter Toolbar**: Lọc theo Loại hành động (`Chuyển bước`, `Nghiệm thu`, `Giao việc`, `Ban hành VB`), Lọc theo Cán bộ, Ô tìm kiếm theo Mã vụ việc.
3. **Audit Log Table / Timeline**:
   - Thời gian thực hiện (Giờ:Phút:Giây, Ngày/Tháng/Năm)
   - Cán bộ thực hiện (Avatar, Họ tên, Chức vụ)
   - Hành động nghiệp vụ (Badge có màu định danh)
   - Đối tượng tác động (Mã vụ việc / Tên công trình)
   - Chi tiết thay đổi (Trạng thái cũ $\rightarrow$ Trạng thái mới)
   - Địa chỉ IP / Thiết bị ghi nhận

---

## 7. CONTENT CONTRACT
- **Page Title**: `Nhật Ký Tác Nghiệp` (≤ 4 từ)
- **Primary CTA**: `Xuất kiểm toán` (≤ 3 từ)
- **Tính Bất Biến**: Nghiêm cấm mọi nút bấm hoặc chức năng chỉnh sửa/xóa dòng lịch sử.

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Người thực hiện | Yes | `audit_logs` | `audit_logs.actor_name` | `Hệ thống` |
| Hành động | Yes | `audit_logs` | `audit_logs.action` | `UNKNOWN_ACTION` |
| Mã đối tượng | Yes | `audit_logs` | `audit_logs.targetId` | `—` |
| Thời điểm | Yes | `audit_logs` | `audit_logs.createdAt` | `CURRENT_TIMESTAMP` |

- **Current Implementation**: `GET /api/audit-logs?action=&actor=&targetId=&page=1`

---

## 9. ACCEPTANCE CRITERIA
- [ ] Ghi nhận chính xác 100% các hành động quan trọng vào bảng `audit_logs` và `case_status_history`.
- [ ] Dòng thời gian sắp xếp chuẩn xác từ mới nhất đến cũ nhất.
- [ ] Bấm vào mã vụ việc chuyển hướng chính xác đến hồ sơ chi tiết.

---

## 10. IMPLEMENTATION STATUS
- **CURRENT**: Bảng nhật ký kiểm toán, lọc theo hành động/cán bộ, liên kết đến hồ sơ vụ việc.
- **PARTIAL**: Xem chi tiết diff JSON (trước vs sau khi sửa).
- **PROPOSED**: Xác thực chuỗi băm Merkle Tree kiểm toán độc lập.
