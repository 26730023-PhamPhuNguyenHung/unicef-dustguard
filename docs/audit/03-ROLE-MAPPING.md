# DUSTGUARD VN — AUDIT 03: ROLE MAPPING & CONVERGENCE MATRIX
## Ánh Xạ 5 Nhóm Người Dùng Legacy Sang Mô Hình Sản Phẩm 2 Phía (2-Side Model)

> **Mã tài liệu**: `DG-AUDIT-03-ROLE-MAPPING`  
> **Thời điểm kiểm toán**: 05/09/2026  
> **Mục tiêu**: Phân rã triệt để 5 nhóm người dùng cũ (`citizen`, `community`, `staff`, `contractor`, `admin`/`executive`) thành các năng lực (Capabilities) thuộc Mô hình 2 Phía (Side A: Community vs Side B: Professional); đưa ra quyết định chuyển dịch chính xác cho từng role và định đoạt số phận của các URL namespace tương ứng.

---

## 1. NGUYÊN TẮC CỐT LÕI: KHÔNG ĐỒNG NHẤT "SIDE" VỚI "ROLE"

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        MÔ HÌNH SẢN PHẨM 2 PHÍA                          │
│                                                                         │
│   SIDE A: PHÍA CỘNG ĐỒNG                  SIDE B: PHÍA CHUYÊN NGHIỆP    │
│   (Community / Youth Actors)              (Professional / Organizations)│
│                                                                         │
│   - Người dân (citizen)                   - Cán bộ thanh tra (staff)    │
│   - Thành viên CLB (community_member)     - Giám sát viên (supervisor)  │
│   - Điều phối viên (moderator)            - Thẩm định pháp lý (legal)   │
│   - Thanh niên tình nguyện (youth)        - Nhà thầu (action_provider)  │
│                                           - Quản trị viên (admin)       │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
                   CÁC NĂNG LỰC NGHIỆP VỤ (CAPABILITIES)
    (Gắn với từng vai trò, được kiểm soát server-side & phân định rõ ràng)
```

1. **Side A** giải quyết bài toán: **"Phát hiện, tạo bằng chứng số, xác thực cộng đồng và bàn giao có trách nhiệm"**.
2. **Side B** giải quyết bài toán: **"Tiếp nhận tập trung, thanh tra hiện trường, căn cứ pháp lý, giám sát khắc phục và đóng hồ sơ an toàn"**.
3. Một `role` không còn là một ứng dụng độc lập, mà là một **tập hợp các Năng lực (Bundle of Capabilities)** được phân quyền trên nền tảng dùng chung.

---

## 2. BẢNG ÁNH XẠ CHI TIẾT (LEGACY ROLES → CANONICAL 2-SIDE)

| Legacy Role | New Side | Canonical Role / Capability | Quyết định (Decision) | Số phận Route (Route Fate) | Căn cứ mã nguồn (Code Evidence) |
|---|---|---|:---:|---|---|
| **`citizen`** | **Side A (Community)** | **`citizen`**<br>Capabilities:<br>- `report:create`<br>- `report:view`<br>- `report:confirm`<br>- `case:follow` | **KEEP**<br>(Giữ nguyên vai trò nền tảng) | Giữ nguyên trải nghiệm tại `apps/web`: `/reports`, `/reports/new`, `/map`, `/cases/:id`.<br>Redirect `/citizen/*` cũ $\to$ `/reports/*`. | `apps/web/src/pages/CreateReportPage.tsx`<br>`apps/server/src/routes/report.routes.ts` |
| **`community`** / **`youth`** | **Side A (Community)** | **`community_member`**<br>Capabilities:<br>- Toàn quyền của `citizen`<br>- `observation:create`<br>- `task:claim`<br>- `task:submit`<br>- `contribution:view` | **MERGE & ADAPT**<br>(Hợp nhất `community` và `youth` thành `community_member`) | Chuẩn hóa vào `apps/web`: `/communities`, `/tasks`, `/contributions`, `/cases/:id/observe`.<br>Redirect `/community/*` $\to$ `/tasks`. | `apps/server/src/routes/task.routes.ts`<br>`apps/web/src/pages/SubmitObservationPage.tsx`<br>`apps/server/src/db/schema.ts` |
| *(Mới xuất hiện)*<br>**`moderator`** | **Side A (Community)** | **`moderator`**<br>Capabilities:<br>- `moderator:inbox`<br>- `moderator:verify`<br>- `moderator:coordinate_cases`<br>- `moderator:forward`<br>- `moderator:moderate_content` | **ACTIVE_CANONICAL**<br>(Vai trò cầu nối Side A $\to$ Side B) | Nằm tại `apps/web`: `/moderator/inbox`, `/moderator/verification/:id`, `/moderator/cases`.<br>Thực hiện forward sang Side B. | `apps/server/src/routes/moderator.routes.ts`<br>`apps/web/src/pages/VerificationDetailPage.tsx` |
| **`staff`** / **`inspector`** | **Side B (Professional)** | **`staff`**<br>Capabilities:<br>- `case:view`<br>- `case:triage`<br>- `inspection:create`<br>- `inspection:execute`<br>- `action:create`<br>- `action:verify` | **MIGRATE & CANONICALIZE**<br>(Chuyển dịch sang `dustguard-operations`) | Cổng tác nghiệp chính thức là `dustguard-operations`: `/cases`, `/inspections`, `/actions`.<br>Các route cũ `/staff/*` tại `app/` được giữ tạm thời để pass tests, sau đó redirect sang Operations. | `dustguard-operations/apps/web/src/pages/CaseInboxPage.tsx`<br>`dustguard-operations/packages/shared/src/permissions.ts` |
| *(Mới phân tách)*<br>**`supervisor`** | **Side B (Professional)** | **`supervisor`**<br>Capabilities:<br>- `case:assign`<br>- `case:close` (4-condition gate)<br>- `case:reopen`<br>- `workload:view`<br>- `reports:operational` | **ACTIVE_CANONICAL**<br>(Tách từ quyền gộp của `staff` và `executive` cũ) | Nằm tại `dustguard-operations`: `/supervisor/workload`, `/reports`. | `dustguard-operations/apps/server/src/modules/cases/cases.router.ts`<br>`dustguard-operations/apps/web/src/pages/SupervisorWorkloadPage.tsx` |
| *(Mới phân tách)*<br>**`legal_reviewer`** | **Side B (Professional)** | **`legal_reviewer`**<br>Capabilities:<br>- `legal:review`<br>- `legal:approve`<br>- `legal:import`<br>- `legal:search` (FTS5) | **ACTIVE_CANONICAL**<br>(Chuyên môn hóa pháp lý môi trường) | Nằm tại `dustguard-operations`: `/cases/:id/legal`, `/legal/library`, `/legal/import`. | `dustguard-operations/apps/server/src/modules/legal/legal.router.ts`<br>`dustguard-operations/apps/web/src/pages/LegalWorkspacePage.tsx` |
| **`contractor`** | **Side B (Professional)** | **`action_provider`**<br>(Không cấp tài khoản đăng nhập portal phức tạp; cấp quyền theo hành động qua Token) | **ADAPT TO CAPABILITY**<br>(Chuyển từ Role Portal thành Action Capability) | Thay thế toàn bộ portal `/contractor/*` bằng giao diện xử lý khắc phục nhanh: Quick-Token qua URL, xác thực GPS Geofence $\le 50\text{m}$, nộp ảnh Before/After. | `dustguard-operations/apps/server/src/modules/actions/actions.router.ts`<br>`dustguard-operations/tests/operations-api.test.js` (Geofence 50m) |
| **`executive`** | **Side B (Professional)** | **Hợp nhất vào `supervisor` & `admin`** | **DEPRECATE & MERGE**<br>(Loại bỏ portal riêng `executive`) | Chuyển toàn bộ báo cáo tổng hợp và điều hành sang `/dashboard` và `/reports` của `dustguard-operations`.<br>Redirect `/executive/*` $\to$ `/dashboard`. | `dustguard-operations/apps/web/src/pages/ReportsPage.tsx` |
| **`admin`** | **Hệ thống (System Scope)** | **`admin`**<br>Capabilities:<br>- `admin:users`<br>- `admin:audit`<br>- `admin:settings`<br>- `admin:stats` | **KEEP & DUAL-FACING**<br>(Phục vụ quản trị ở cả 2 Side) | Quản trị cộng đồng tại `apps/web`: `/admin/*`.<br>Quản trị nghiệp vụ tại `dustguard-operations`: `/admin/*`. | `apps/web/src/pages/AdminUsersPage.tsx`<br>`dustguard-operations/apps/web/src/pages/AdminUsersPage.tsx` |

---

## 3. DANH SÁCH BỘ NĂNG LỰC CHUẨN HÓA (CANONICAL CAPABILITIES)

Hệ thống chấm dứt việc kiểm tra chuỗi vai trò cứng như `if (user.role === 'staff')` trên frontend. Thay vào đó, toàn bộ giao diện và backend vận hành qua danh sách 28 Capabilities sau:

### Phía Cộng đồng (Side A Capabilities):
1. `report:create`: Tạo phản ánh vi phạm bụi mới kèm tọa độ và ảnh.
2. `report:view`: Xem danh sách và chi tiết phản ánh.
3. `report:confirm`: Bấm nút "Tôi cũng ghi nhận" tăng trọng số tín hiệu.
4. `observation:create`: Nộp cập nhật quan sát Before/After thực địa cho vụ việc.
5. `case:view`: Xem thông tin công khai và tiến độ vụ việc.
6. `case:follow`: Lưu vụ việc vào danh sách theo dõi để nhận thông báo.
7. `task:view`: Xem danh sách nhiệm vụ khảo sát thực địa của CLB.
8. `task:claim`: Nhận nhiệm vụ khảo sát.
9. `task:submit`: Nộp kết quả khảo sát hoàn thành nhiệm vụ (+20 điểm).
10. `contribution:view`: Xem tổng điểm đóng góp, huy hiệu và số giờ tình nguyện.
11. `moderator:inbox`: Truy cập hàng đợi phản ánh cần xác thực.
12. `moderator:verify`: Phê duyệt phản ánh, tạo vụ việc cộng đồng, gộp tin báo trùng.
13. `moderator:coordinate_cases`: Điều phối Kanban vụ việc, cập nhật tiến độ công khai.
14. `moderator:forward`: Bàn giao hồ sơ vụ việc sang cơ quan chức năng (Side B).
15. `moderator:moderate_content`: Xử lý báo cáo nội dung xấu độc / spam.

### Phía Chuyên nghiệp (Side B Capabilities):
16. `case:triage`: Tiếp nhận hồ sơ từ Community, phân loại mức độ khẩn cấp (SLA).
17. `case:assign`: Điều phối, giao quyền xử lý vụ việc cho cán bộ phụ trách.
18. `case:update`: Cập nhật ghi chú tiến độ nội bộ.
19. `case:close`: Đóng hồ sơ vụ việc (Bắt buộc thỏa mãn 4 điều kiện kiểm soát).
20. `case:reopen`: Mở lại vụ việc khi phát hiện vi phạm tái diễn.
21. `inspection:create`: Lập kế hoạch kiểm tra hiện trường tại công trình.
22. `inspection:execute`: Thực hiện checklist 10 tiêu chuẩn QCVN 18/BXD, ghi nhận vi phạm.
23. `action:create`: Ban hành lệnh yêu cầu nhà thầu khắc phục (hạn định thời gian).
24. `action:execute`: Nhà thầu nộp minh chứng khắc phục qua Quick-Token trong bán kính $\le 50\text{m}$.
25. `action:verify`: Cán bộ nghiệm thu kết quả khắc phục (Before/After comparison).
26. `legal:review`: Lập đánh giá căn cứ pháp lý theo Luật BVMT 2020 & NĐ 45/2022/NĐ-CP.
27. `legal:import`: Thêm văn bản quy chuẩn, quy định mới vào thư viện FTS5.
28. `workload:view`: Xem biểu đồ khối lượng công việc và tiến độ xử lý của từng cán bộ.
29. `admin:manage`: Toàn quyền quản trị tài khoản, kiểm tra audit log SHA-256.
