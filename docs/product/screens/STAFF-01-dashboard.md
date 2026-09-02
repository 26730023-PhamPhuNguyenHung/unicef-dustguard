# STF-01 — Bàn Điều Hành Ca Trực

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/staff` (và alias `/staff/dashboard`)
- **Primary Role**: Cán bộ thanh tra / Giám sát ca trực (`staff`)
- **Secondary Roles**: Lãnh đạo điều hành (`executive`), Quản trị viên (`admin`)
- **Current Component**: `StaffDashboardPage.jsx` (`app/src/apps/staff/pages/dashboard/StaffDashboardPage.jsx`)
- **Layout**: `StaffLayout.jsx`
- **Primary Job**: Nắm bắt nhanh tình hình trật tự môi trường trong ca trực và xử lý các vụ việc khẩn cấp có điểm ưu tiên cao.
- **Success Condition**: Cán bộ xác định được ngay các vụ việc có rủi ro cao hoặc sắp quá hạn SLA để thực hiện tiếp nhận/phân công xử lý.

---

## 2. WHY THIS SCREEN EXISTS
- Cán bộ bước vào ca trực cần một bức tranh tổng thể tức thì trong 5 giây về các điểm nóng ô nhiễm bụi và sự cố phát sinh.
- Màn hình giúp ưu tiên hóa công việc dựa trên điểm rủi ro và thời hạn xử lý (SLA), tránh bỏ sót các điểm phản ánh nghiêm trọng của người dân.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Đăng nhập với vai trò Staff (`/login`), click logo hoặc mục "Tổng quan" trên Sidebar.
- **Exit Points**:
  - Click vào vụ việc cụ thể $\rightarrow$ Chuyển đến Chi tiết vụ việc (`/staff/cases/:id`).
  - Click vào công trình rủi ro cao $\rightarrow$ Chuyển đến Chi tiết công trình (`/staff/sites/:id`).
  - Click vào cảnh báo khẩn cấp $\rightarrow$ Chuyển đến Cảnh báo (`/staff/alerts`).
- **Navigation Item**: Sidebar item "Tổng quan" (icon Home/Dashboard).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem bảng điều hành** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Tiếp nhận nhanh vụ việc** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Lọc theo địa bàn / mức rủi ro** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Xuất báo cáo ca trực nhanh** | ❌ | ❌ | ✅ | ❌ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Mở /staff 
→ Xem 12 chỉ số ca trực (Triage, SLA, Rủi ro cao)
→ Lọc danh sách vụ việc cần ưu tiên xử lý
→ Click xem vụ việc khẩn cấp nhất
→ Điều hướng sang Không gian thụ lý vụ việc (/staff/cases/:id)
```

---

## 6. INFORMATION HIERARCHY
1. **Page Header**: Tiêu đề "Bàn Điều Hành Ca Trực", bộ chọn khoảng thời gian, nút làm mới dữ liệu.
2. **Metric Grid (12 Chỉ Số Ca Trực)**: 
   - Số vụ việc chờ tiếp nhận, đang xử lý, quá hạn SLA, điểm nóng ô nhiễm cao, số công trình đang giám sát.
3. **Primary Work Area**:
   - **Cột Trái (60%)**: Hàng đợi vụ việc ưu tiên cao (Risk Score $\ge 70$, sắp quá hạn SLA).
   - **Cột Phải (40%)**: Bản đồ mini các điểm nóng bụi & danh sách cảnh báo tức thời.
4. **Bottom Section**: Hoạt động tác nghiệp gần đây của đội thanh tra.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Bàn Điều Hành Ca Trực` (≤ 6 từ)
- **Page Description**: `Giám sát điểm nóng và điều phối xử lý phản ánh môi trường đô thị` (≤ 14 từ)
- **Primary CTA**: `Xử lý ngay` (≤ 3 từ)
- **Secondary CTA**: `Xem tất cả vụ việc` (≤ 4 từ)
- **Lưu ý**: Điểm ưu tiên (Dust Risk Score) được ghi rõ là "Mức độ ưu tiên" (0-100), không dùng từ "đã vi phạm".

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Số vụ việc đang chờ | Yes | `cases` table | `COUNT(id) WHERE status='OPEN'` | `0` |
| Số vụ sắp quá hạn SLA | Yes | `cases` table | `COUNT(id) WHERE slaDeadline < ?` | `0` |
| Danh sách vụ việc ưu tiên | Yes | `cases` + `sites` | `cases.id, cases.code, cases.priority` | `[]` |
| Điểm rủi ro công trình | No | `sites` table | `sites.dustRiskScore` | `0` |

- **Current Implementation**: `GET /api/staff/dashboard-stats`, `GET /api/cases?limit=5&sort=priority`
- **Safe Normalization**: Toàn bộ mảng danh sách được unwrap an toàn về `[]`.

---

## 9. STATE MODEL
- **Loading**: Hiển thị Skeleton cho 4 thẻ chỉ số và bảng danh sách vụ việc.
- **Empty**: Khi không có vụ việc khẩn cấp: Hiển thị banner xanh "Không có vụ việc tồn đọng trong ca trực".
- **Error**: Hiển thị thông báo "Không thể tải dữ liệu ca trực" kèm nút "Thử lại".
- **Partial**: Nếu dữ liệu cảm biến IoT tạm thời ngắt kết nối, hiển thị nhãn "Dữ liệu ngoại tuyến".
- **Success**: Cập nhật tức thời khi chuyển trạng thái vụ việc từ bảng.

---

## 10. ACTION CONTRACT
### Action: Tiếp nhận nhanh vụ việc
- **Visible when**: Vụ việc ở trạng thái `OPEN` / `PENDING`.
- **Enabled when**: Cán bộ đang trong ca trực hợp lệ.
- **Mutation**: Cập nhật trạng thái `cases.status = 'IN_PROGRESS'`, ghi nhận `assignedTo = current_user_id`.
- **Success result**: Hiển thị Toast thông báo và chuyển hướng sang `/staff/cases/:id`.

---

## 11. DESKTOP & MOBILE BEHAVIOR
- **Desktop (1366×768)**: Bố cục 2 cột (60/40), thanh số liệu hiển thị 4 thẻ ngang, không xuất hiện thanh cuộn ngang.
- **Mobile (360–430px)**: Chuyển toàn bộ thẻ số liệu thành dạng trượt ngang (swipeable) hoặc 2x2 grid. Bảng vụ việc chuyển thành danh sách thẻ gọn gàng. Chiều cao nút bấm $\ge 44\text{px}$. Không truncate mã hồ sơ `DG-...`.

---

## 12. ACCEPTANCE CRITERIA
- [ ] Route `/staff` render đúng với vai trò `staff` và `admin`.
- [ ] Dữ liệu 12 chỉ số được tính toán từ D1 SQLite thật, không có mock data.
- [ ] Danh sách vụ việc hiển thị đầy đủ mã hồ sơ, tên địa bàn, điểm rủi ro.
- [ ] Nút "Xử lý ngay" điều hướng chính xác đến `/staff/cases/:id`.
- [ ] Hiển thị đầy đủ Loading, Empty và Error states.
- [ ] Responsive hoàn hảo tại 1366x768 và 360px.
- [ ] Không có lỗi console runtime.

---

## 13. IMPLEMENTATION STATUS
- **CURRENT**: Layout tổng quan, API thống kê ca trực, danh sách vụ việc ưu tiên.
- **PARTIAL**: Bản đồ mini tích hợp trực tiếp trên dashboard.
- **PROPOSED**: Tự động cảnh báo âm thanh khi có vụ việc mức độ khẩn cấp (P0).
