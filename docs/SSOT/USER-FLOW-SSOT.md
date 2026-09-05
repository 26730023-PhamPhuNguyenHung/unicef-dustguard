# DUSTGUARD VN — CANONICAL USER FLOW & ARCHITECTURE SSOT (MASTER SPEC)

> **Mã tài liệu**: `DG-SSOT-USER-FLOW-2026`  
> **Phiên bản**: v3.0.0-CANONICAL  
> **Trạng thái**: ACTIVE SSOT (Nguồn Chân Lý Duy Nhất Cho Toàn Bộ Hệ Thống)  
> **Ngày ban hành**: 05/09/2026  
> **Thay thế hoàn toàn**: `.agents/SSOT.md` (v2.0 cũ), `docs/final-product-architecture.md`, `docs/PRODUCT_CURRENT_STATE.md`.

---

## 1. MÔ HÌNH SẢN PHẨM 2 PHÍA (TWO-SIDE PRODUCT MODEL)

DustGuard VN là nền tảng CivicTech thế hệ mới về giám sát môi trường và phòng chống ô nhiễm bụi xây dựng đô thị, được tổ chức xoay quanh **Mô hình 2 Phía Tương Hỗ (Two-Side Complementary Model)**:

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                 DUSTGUARD VN PLATFORM                                    │
├────────────────────────────────────────────┬─────────────────────────────────────────────┤
│        SIDE A: PHÍA CỘNG ĐỒNG              │           SIDE B: PHÍA CHUYÊN TRÁCH         │
│   (Community / Youth Civic Network)        │     (Professional / Responsible Authority)  │
├────────────────────────────────────────────┼─────────────────────────────────────────────┤
│ • Không gian công khai & gắn kết cộng đồng │ • Hệ thống điều hành & xử lý vi phạm nội bộ │
│ • Giám sát hiện trường phi tập trung       │ • Thẩm định pháp lý, thanh tra chuyên môn   │
│ • Ghi nhận minh chứng số ảnh/tọa độ/băm    │ • Giám sát nhà thầu khắc phục (Geofence 50m)│
│ • CLB thanh niên, tình nguyện viên         │ • Ra quyết định xử lý & đóng hồ sơ an toàn  │
├────────────────────────────────────────────┴─────────────────────────────────────────────┤
│                          CẦU NỐI BÀN GIAO CÓ TRÁCH NHIỆM (HANDOFF)                       │
│    POST /api/integrations/community/cases ── (Idempotent Webhook SHA-256 Payload Hash)   │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. BẢN ĐỒ VAI TRÒ & NĂNG LỰC (ACTOR & CAPABILITY MODEL)

> **Nguyên tắc bất biến**: **"Không đồng nhất Side với Role"**. Phía (Side) là không gian trải nghiệm sản phẩm. Vai trò (Role) là gói các Năng lực (Capabilities) cụ thể mà người dùng sở hữu trong phiên làm việc.

```
                    ┌─────────────────────────┐
                    │      PRODUCT SIDE       │
                    │   (Community / Prof)    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     ACTOR ROLE          │
                    │ (citizen, staff, etc.)  │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      CAPABILITIES       │
                    │ (case:triage, etc.)     │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      DOMAIN ACTION      │
                    │  (Create, Verify, Close)│
                    └─────────────────────────┘
```

### BẢNG ÁNH XẠ VAI TRÒ VÀ BỘ NĂNG LỰC CHUẨN TẮC

| Phân hệ (Side) | Vai trò (Canonical Role) | Định nghĩa & Trách nhiệm | Bộ Năng lực (Capabilities) |
|---|---|---|---|
| **Public** | **`public`** / **`guest`** | Khách vãng lai, người dân chưa đăng nhập | - `public:view_landing`<br>- `public:view_map`<br>- `public:view_public_case` |
| **Side A (Community)** | **`citizen`** | Người dân đô thị phát hiện ô nhiễm | - `report:create`<br>- `report:view`<br>- `report:confirm`<br>- `case:follow` |
| **Side A (Community)** | **`community_member`** | Thanh niên, sinh viên, thành viên CLB môi trường | - Toàn quyền của `citizen`<br>- `observation:create`<br>- `task:claim`<br>- `task:submit`<br>- `contribution:view` |
| **Side A (Community)** | **`moderator`** | Trưởng CLB, cán bộ điều phối cộng đồng | - `moderator:inbox`<br>- `moderator:verify`<br>- `moderator:coordinate_cases`<br>- `moderator:forward`<br>- `moderator:moderate_content` |
| **Side B (Professional)**| **`staff`** | Cán bộ thanh tra môi trường / hiện trường | - `case:view`<br>- `case:triage`<br>- `inspection:create`<br>- `inspection:execute`<br>- `action:create`<br>- `action:verify` |
| **Side B (Professional)**| **`supervisor`** | Lãnh đạo đội thanh tra, điều phối viên chuyên trách | - `case:assign`<br>- `case:close` (4-condition gate)<br>- `case:reopen`<br>- `workload:view`<br>- `reports:operational` |
| **Side B (Professional)**| **`legal_reviewer`** | Chuyên viên pháp chế môi trường | - `legal:review`<br>- `legal:approve`<br>- `legal:import`<br>- `legal:search` (FTS5) |
| **Side B (Professional)**| **`action_provider`**<br>*(Nhà thầu/Đơn vị thi công)* | Đại diện công trường chịu trách nhiệm xử lý bụi | - `action:execute_quick_token`<br>*(Xác thực qua liên kết mã dùng một lần + Geofence $\le 50\text{m}$, không cần tài khoản portal phức tạp)* |
| **Hệ thống (System)** | **`admin`** | Quản trị viên kỹ thuật hệ thống | - `admin:users`<br>- `admin:audit`<br>- `admin:settings`<br>- `admin:stats` |

---

## 3. CÁC TUYẾN ĐƯỜNG CHUẨN TẮC (CANONICAL ROUTES)

Toàn bộ hệ thống được gom thành 2 cổng giao diện duy nhất:

### A. CỔNG CỘNG ĐỒNG (COMMUNITY PORTAL — `apps/web`, Port 3000)
- `/`: Landing Page tương tác, thông tin pháp lý môi trường, câu chuyện bài toán.
- `/map`: Bản đồ giám sát ô nhiễm bụi & nguồn thải công trình thời gian thực.
- `/reports`: Danh sách phản ánh cộng đồng.
- `/reports/new`: Giao diện 1-chạm tạo phản ánh có ảnh và GPS (`report:create`).
- `/reports/:id`: Chi tiết phản ánh, nút xác nhận "Tôi cũng ghi nhận" (`report:confirm`).
- `/cases/:id`: Không gian theo dõi vụ việc công khai của cộng đồng.
- `/cases/:id/observe`: Nộp ảnh & bằng chứng Before/After thực địa (`observation:create`).
- `/tasks`: Nhiệm vụ khảo sát thực địa dành cho thanh niên CLB (`task:view`).
- `/contributions`: Thống kê điểm thưởng, huy hiệu và tín chỉ tình nguyện (`contribution:view`).
- `/following`: Danh sách vụ việc người dùng đang theo dõi.
- `/moderator/*`: Không gian làm việc của Điều phối viên (Inbox thẩm định, Kanban điều phối, Chuyển tiếp hồ sơ sang Side B).
- `/admin/*`: Quản trị người dùng cộng đồng và nhật ký kiểm toán.

### B. CỔNG ĐIỀU HÀNH CHUYÊN NGHIỆP (OPERATIONS PORTAL — `dustguard-operations`, Port 3002)
- `/dashboard`: Trung tâm chỉ huy tác nghiệp, chỉ số KPI xử lý vụ việc, vi phạm gần hạn SLA.
- `/cases`: Tiếp nhận & xử lý hàng đợi vụ việc (bao gồm vụ việc tiếp nhận từ Community).
- `/cases/:id`: Hồ sơ vụ việc chuyên sâu: bằng chứng số, dòng thời gian pháp lý, kết quả cảm biến IoT.
- `/cases/:id/legal`: Workspace thẩm định căn cứ pháp lý với AI tra cứu FTS5 (Luật BVMT 2020, NĐ 45/2022/NĐ-CP, QCVN 05:2023/BTNMT).
- `/inspections`: Danh sách và lập kế hoạch kiểm tra hiện trường công trình.
- `/inspections/:id`: Checklist thanh tra hiện trường 10 tiêu chí kỹ thuật QCVN 18/BXD (thao tác 1 tay trên di động).
- `/actions`: Giám sát thực hiện biện pháp khắc phục của các nhà thầu thi công.
- `/actions/:id/remediation`: Cán bộ nghiệm thu minh chứng Before/After của nhà thầu.
- `/legal/library`: Thư viện tra cứu văn bản pháp luật môi trường FTS5 toàn văn.
- `/supervisor/workload`: Bảng điều phối khối lượng công việc cán bộ thanh tra.
- `/contractors` & `/projects`: Danh mục nhà thầu và các công trình dự án xây dựng đô thị.
- `/iot/devices`: Giám sát nồng độ bụi realtime từ các trạm cảm biến lắp tại công trình.
- `/reports`: Xuất báo cáo điều hành hành chính định kỳ.

---

## 4. CÁC THỰC THỂ NGHIỆP VỤ CHUẨN TẮC (CANONICAL DOMAIN ENTITIES)

1. **`Report` (Phản ánh)**: Tin báo vi phạm ban đầu của người dân. Có ảnh, tọa độ, phân loại và số lượt cộng đồng xác nhận.
2. **`CommunityCase` (Vụ việc Cộng đồng)**: Hồ sơ theo dõi công khai do điều phối viên khởi tạo từ các phản ánh, là nơi thanh niên nộp `Observation` và người dân theo dõi kết quả.
3. **`OperationsCase` (Vụ việc Nghiệp vụ)**: Hồ sơ xử lý hành chính - công vụ chính thức trong `dustguard-operations`, gắn với cán bộ thanh tra, thời hạn giải quyết SLA và các quyết định xử phạt.
4. **`Observation` (Quan sát Thực địa)**: Dữ liệu ảnh và ghi nhận cập nhật Before/After do cộng đồng/thanh niên nộp cho một vụ việc.
5. **`Inspection` (Cuộc Thanh tra)**: Đợt kiểm tra công vụ tại hiện trường công trình với checklist 10 tiêu chí kỹ thuật QCVN 18/BXD do Cán bộ chuyên trách thực hiện.
6. **`CorrectiveAction` (Lệnh Khắc phục)**: Quyết định yêu cầu nhà thầu thi công xử lý ô nhiễm (rửa xe, phủ bạt), cấp mã truy cập Quick-Token để nhà thầu nộp minh chứng trong phạm vi Geofence $\le 50\text{m}$.
7. **`LegalAssessment` (Đánh giá Pháp lý)**: Biên bản trích dẫn điều khoản xử phạt căn cứ theo Luật BVMT 2020 và Nghị định 45/2022/NĐ-CP.
8. **`CaseClosure` (Đóng Hồ sơ)**: Bản ghi nghiệm thu kết thúc vụ việc, bắt buộc kiểm tra thỏa mãn đủ 4 điều kiện an toàn.

---

## 5. MÁY TRẠNG THÁI NGHIỆP VỤ (STATE MACHINES)

### A. VÒNG ĐỜI PHẢN ÁNH CỘNG ĐỒNG (REPORT LIFECYCLE)
```
[submitted] ──► [reviewing] ──┬──► [verified] (Tạo hoặc gộp vào Case)
                              ├──► [rejected] (Kèm lý do minh bạch)
                              └──► [merged]   (Gộp vào Case có sẵn)
```

### B. VÒNG ĐỜI VỤ VIỆC CỘNG ĐỒNG (COMMUNITY CASE LIFECYCLE)
```
[new] ──► [community_verifying] ──► [confirmed_signal] ──► [forwarded] ──► [in_progress] ──► [resolved] ──► [closed]
                                                               │
                                                               ▼ (Bàn giao có trách nhiệm)
                                                POST /api/integrations/community/cases
```

### C. VÒNG ĐỜI VỤ VIỆC CHUYÊN NGHIỆP (OPERATIONS CASE LIFECYCLE)
```
[NEW] (Tiếp nhận từ Community)
  │
  ▼ (Triage & Phân công cán bộ)
[TRIAGED] ──► [INSPECTION_PENDING]
                     │
                     ▼ (Checklist 10 tiêu chí hiện trường)
              [INSPECTION_COMPLETED]
                     │
                     ├──────────────────────────────┐
                     ▼ (Không phát hiện vi phạm)    ▼ (Có vi phạm)
                [RESOLVED]                [ACTION_REQUIRED] (Lệnh khắc phục)
                     │                              │
                     │                              ▼ (Nhà thầu nộp ảnh Geofence ≤ 50m)
                     │                    [REMEDIATION_PENDING]
                     │                              │
                     │                              ▼ (Cán bộ nghiệm thu Before/After)
                     │                    [REMEDIATION_VERIFIED]
                     │                              │
                     └──────────────┬───────────────┘
                                    ▼
                         [CỔNG KIỂM SOÁT ĐÓNG HỒ SƠ]
                         1. Có biên bản nghiệm thu
                         2. Có ảnh Before/After hợp lệ
                         3. Giám sát viên phê duyệt
                         4. Không còn vi phạm mở
                                    │
                                    ▼
                                 [CLOSED]
```

---

## 6. ĐIỀU HƯỚNG XÁC THỰC (AUTH REDIRECT LOGIC)

Hệ thống điều hướng đăng nhập dựa trên Năng lực chính (Primary Capability):

```typescript
function getPostLoginRedirect(user: User): string {
  // 1. Nếu có năng lực quản trị kỹ thuật
  if (user.capabilities.includes('admin:manage')) return '/admin/overview';

  // 2. Nếu là vai trò thuộc Side B (Professional)
  if (user.capabilities.includes('case:triage') || user.capabilities.includes('inspection:create')) {
    return '/dashboard'; // Operations Dashboard
  }
  if (user.capabilities.includes('legal:review')) {
    return '/cases';     // Operations Case Worklist
  }

  // 3. Nếu là vai trò thuộc Side A (Community)
  if (user.capabilities.includes('moderator:inbox')) {
    return '/moderator/dashboard'; // Moderator Dashboard
  }
  if (user.capabilities.includes('task:claim')) {
    return '/tasks';               // CLB Youth Member Tasks
  }

  // 4. Mặc định là Người dân (Citizen)
  return '/dashboard';             // Community Overview
}
```

---

## 7. PHÂN ĐỊNH TRÁCH NHIỆM CƠ SỞ DỮ LIỆU & API (OWNERSHIP)

| Thành phần | Cơ sở dữ liệu SSOT | Công nghệ | Cổng API chính thức | Trách nhiệm dữ liệu |
|---|---|---|---|---|
| **Side A (Community)** | `data/dustguard-community.db` | Drizzle ORM / SQLite | Port 3001 (`apps/server`) | Lưu trữ toàn bộ dữ liệu phản ánh, người dân, CLB thanh niên, tín chỉ và vụ việc cộng đồng. |
| **Side B (Professional)**| `dustguard-operations/data/dustguard-operations.db`| Better-SQLite3 / FTS5 | Port 4000 (`dustguard-operations`) | Lưu trữ toàn bộ dữ liệu nghiệp vụ: thanh tra công vụ, pháp chế AI FTS5, lệnh khắc phục, telemetry cảm biến, và đóng hồ sơ. |
| **Tích hợp Liên thông** | Không tạo CSDL trung gian | HTTP Webhook / SHA-256 | `POST /api/integrations/community/cases` | Đồng bộ dữ liệu 1 chiều an toàn: Community bàn giao hồ sơ sang Operations một cách bất biến và idempotent. |
| **Legacy D1 Monolith** | `app/prisma/dev.db` | D1 SQLite / Hono Edge | Port 8787 (Đóng băng) | Duy trì tạm thời cho các bài test hồi quy trong `app/tests/`, không tiếp nhận tính năng mới. |
