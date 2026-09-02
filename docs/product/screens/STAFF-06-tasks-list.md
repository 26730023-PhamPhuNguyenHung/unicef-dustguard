# STF-06 — Lịch Công Tác & Phân Công Nhiệm Vụ

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/staff/tasks`
- **Primary Role**: Cán bộ thanh tra / Trưởng ca (`staff`)
- **Secondary Roles**: Tình nguyện viên môi trường, Quản trị viên (`admin`)
- **Current Component**: `TasksListPage.jsx` (`app/src/apps/staff/pages/tasks/TasksListPage.jsx`)
- **Layout**: `StaffLayout.jsx`
- **Primary Job**: Quản lý lịch công tác, giao nhiệm vụ khảo sát hiện trường và theo dõi tiến độ thực hiện của từng cán bộ/tình nguyện viên.
- **Success Condition**: Cán bộ giao được nhiệm vụ khảo sát cho người phụ trách trong vòng 30 giây kèm địa chỉ, công trình và hạn hoàn thành.

---

## 2. WHY THIS SCREEN EXISTS
- Hoạt động giám sát hiện trường cần sự phân công rõ ràng: ai đi kiểm tra công trình nào, thời hạn nào phải có mặt, cần chụp những bằng chứng gì. Màn hình này điều phối toàn bộ nhiệm vụ công tác thực địa.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Sidebar mục "Nhiệm vụ", click từ Bàn điều hành ca trực (`/staff`), hoặc tạo từ Không gian thụ lý vụ việc.
- **Exit Points**:
  - Click hàng nhiệm vụ $\rightarrow$ Mở Drawer chi tiết nhiệm vụ và form nộp biên bản.
  - Click vào vụ việc liên quan $\rightarrow$ Chuyển sang `/staff/cases/:id`.
- **Navigation Item**: Sidebar item "Nhiệm vụ" (icon CheckSquare/Calendar).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem danh sách nhiệm vụ** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Tạo mới nhiệm vụ khảo sát** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Nhận nhiệm vụ & Nộp biên bản** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Xác nhận hoàn thành nhiệm vụ** | ❌ | ❌ | ✅ | ❌ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Mở /staff/tasks 
→ Xem danh sách nhiệm vụ theo 3 cột: "Cần làm" | "Đang thực hiện" | "Đã hoàn thành"
→ Bấm "Giao việc mới" → Chọn công trình, người thực hiện, hạn hoàn thành
→ Người được giao mở nhiệm vụ trên di động khi đến hiện trường
→ Chụp ảnh, nhập kết quả kiểm tra và bấm "Nộp kết quả"
→ Trưởng ca duyệt kết quả và chuyển trạng thái hoàn tất
```

---

## 6. INFORMATION HIERARCHY
1. **Header Block**: Tiêu đề "Lịch Công Tác & Phân Công Nhiệm Vụ", nút "Giao việc mới", bộ lọc trạng thái.
2. **View Mode Switcher**: Chuyển đổi giữa Dạng Bảng (Table View) và Dạng Bảng Kanban (Board View).
3. **Main Content Area**:
   - Tên nhiệm vụ & Mã vụ việc liên kết
   - Công trình & Địa bàn khảo sát
   - Người được phân công (Cán bộ / Đội tình nguyện)
   - Hạn hoàn thành & Trạng thái tiến độ
   - Hành động: Xem chi tiết / Nộp kết quả
4. **Task Detail Drawer**: Mở rộng bên phải khi click vào một nhiệm vụ để xem chi tiết yêu cầu và form nộp kết quả.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Lịch Công Tác` (≤ 3 từ)
- **Primary CTA**: `Giao việc mới` (≤ 3 từ)
- **Status Badges**: `Chờ thực hiện` (Vàng), `Đang khảo sát` (Xanh dương), `Đã nộp kết quả` (Tím), `Đã nghiệm thu` (Xanh lá).

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Tiêu đề nhiệm vụ | Yes | `actions` / `tasks` | `title` | `—` |
| Người phụ trách | Yes | `profiles` / `users` | `assignee` | `Chưa giao` |
| Hạn hoàn thành | Yes | `actions` table | `dueDate` | `Trong ngày` |
| Trạng thái | Yes | `actions` table | `status` | `PENDING` |

- **Current Implementation**: `GET /api/tasks?status=&assignee=`, `POST /api/tasks`, `PATCH /api/tasks/:id`

---

## 9. DESKTOP & MOBILE BEHAVIOR
- **Desktop (1366×768)**: Hỗ trợ chuyển đổi linh hoạt giữa Bảng danh sách và Kanban 3 cột.
- **Mobile (360–430px)**: Mặc định hiển thị danh sách thẻ dọc theo ngày. Nút "Nộp kết quả hiện trường" có hỗ trợ mở trực tiếp camera điện thoại để chụp ảnh.

---

## 10. ACCEPTANCE CRITERIA
- [ ] Giao việc mới lưu đúng vào cơ sở dữ liệu D1 và hiển thị ngay trên danh sách.
- [ ] Người được giao nhận được thông báo trong ca trực.
- [ ] Form nộp kết quả kiểm tra hỗ trợ tải ảnh và ghi nhận vị trí GPS hiện trường.

---

## 11. IMPLEMENTATION STATUS
- **CURRENT**: Danh sách nhiệm vụ, tạo nhiệm vụ mới, nộp kết quả kiểm tra, cập nhật trạng thái.
- **PARTIAL**: Chế độ xem theo lịch tuần/tháng (Calendar View).
- **PROPOSED**: Tự động gợi ý phân công cán bộ dựa trên vị trí địa bàn gần nhất.
