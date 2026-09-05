# DUSTGUARD VN — AUDIT 04: DOMAIN COLLISION MATRIX
## Đối Chiếu Xung Đột Ngữ Nghĩa Thực Thể (Domain Semantic Collisions)

> **Mã tài liệu**: `DG-AUDIT-04-DOMAIN-COLLISION-MATRIX`  
> **Thời điểm kiểm toán**: 05/09/2026  
> **Mục tiêu**: Liệt kê toàn bộ các thực thể trùng lặp ngữ nghĩa hoặc xung đột khái niệm giữa 3 thế hệ kiến trúc (`app/` D1 Monolith, `apps/` Community Side A, và `dustguard-operations/` Side B); phân định ranh giới nghiệp vụ và xác lập Thực thể Chuẩn tắc (Canonical Entity).

---

## 1. NGUYÊN TẮC BẤT BIẾN NGHIỆP VỤ (DOMAIN INVARIANTS)

1. **`Report != Case`**: Phản ánh ban đầu của một người dân (`Report`) KHÔNG PHẢI là một vụ việc (`Case`). Một vụ việc có thể gom nhiều phản ánh cùng khu vực và nhiều lần xác nhận (confirmations).
2. **`Community Case != Operations Case`**: 
   - `Community Case` (Side A) là không gian theo dõi công khai của người dân và CLB thanh niên.
   - `Operations Case` (Side B) là hồ sơ thụ lý hành chính - pháp lý chính thức có cán bộ chịu trách nhiệm, có thời hạn SLA và có chế tài xử phạt.
   - Cầu nối duy nhất giữa 2 bên là giao thức **Handoff (Bàn giao có trách nhiệm)** qua `POST /api/integrations/community/cases`.
3. **`Observation != Inspection`**:
   - `Observation` là ảnh và ghi nhận cảm quan thực địa của thanh niên tình nguyện (Side A).
   - `Inspection` là cuộc thanh tra công vụ với checklist 10 tiêu chí kỹ thuật theo QCVN 18/BXD (Side B).
4. **`Community Task != Inspection`**:
   - `Community Task` là bài tập khảo sát thực tế nhận điểm tình nguyện của CLB.
   - Lệnh kiểm tra công trình của cán bộ là một phần của `Inspection`.

---

## 2. MA TRẬN ĐỐI CHIẾU XUNG ĐỘT THỰC THỂ (DOMAIN COLLISION MATRIX)

| Thực thể A (Entity A) | Thực thể B (Entity B) | Cùng bản chất? (Same Concept?) | Điểm khác biệt nghiệp vụ | Thực thể Chuẩn tắc (Canonical Entity) | Kế hoạch Chuyển dịch (Migration Plan) |
|---|---|:---:|---|---|---|
| **`complaints`**<br>(Legacy D1 `app/`) | **`reports`**<br>(Community `apps/server`) | **CÙNG BẢN CHẤT** | Cả hai đều đại diện cho tin báo vi phạm bụi của người dân. `complaints` dùng thuật ngữ hành chính cũ; `reports` dùng mô hình dữ liệu hiện đại có mảng ảnh `report_media`, hỗ trợ xác nhận cộng đồng `report_confirmations`. | **`Report`** (`reports`) | Chuyển đổi toàn bộ logic và API sang `reports`. Bảng `complaints` trong D1 chỉ đóng vai trò lưu trữ lịch sử hoặc view chuyển tiếp. |
| **`sites`**<br>(Legacy D1 `app/`) | **`projects`**<br>(Operations `dustguard-operations`) | **CÙNG BẢN CHẤT** | Cả hai đều đại diện cho công trình xây dựng / nguồn phát thải bụi đô thị. `projects` có schema hoàn chỉnh hơn: liên kết nhà thầu `contractor_id`, chủ đầu tư `project_owner`, trạng thái thi công. | **`Project`** (`projects`) | Chuẩn hóa tên gọi là `Project` (Công trình/Dự án). Bảng `sites` cũ được map 1-1 với `projects`. |
| **`rectifications`**<br>(Legacy D1 `app/`) | **`corrective_actions`**<br>(Operations `dustguard-operations`) | **CÙNG BẢN CHẤT** | Cùng đại diện cho biện pháp khắc phục vi phạm bụi do nhà thầu thực hiện. `corrective_actions` quản lý chặt chẽ hơn: thời hạn SLA, mã truy cập Quick-Token không cần mật khẩu, tọa độ GPS Geofence $\le 50\text{m}$, ảnh Before/After. | **`CorrectiveAction`** (`corrective_actions`) | Thay thế hoàn toàn `rectifications` bằng `corrective_actions`. Quy trình khắc phục của nhà thầu đi qua cổng Quick-Token. |
| **`tasks`** (Staff Task trong Legacy D1) | **`inspections`**<br>(Operations `dustguard-operations`) | **XUNG ĐỘT NGỮ NGHĨA** | Trong Legacy D1, việc thanh tra của cán bộ được gọi là `task` dẫn đến trùng lặp với `tasks` (nhiệm vụ tình nguyện) của Community. Về bản chất, cán bộ đi kiểm tra công trường là thực hiện một đợt Thanh tra (`Inspection`). | **`Inspection`** (`inspections`) | Đổi tên toàn bộ công việc hiện trường của cán bộ thành `Inspection`. Danh từ `Task` được bảo lưu độc quyền cho Side A (Nhiệm vụ cộng đồng). |
| **`Community Case`**<br>(`apps/server` `cases`) | **`Operations Case`**<br>(Operations `cases`) | **HAI MẶT CỦA MỘT QUY TRÌNH** (2-Side Lifecycle) | - Community Case: Đóng vai trò là "Public Watch Tracker" cho người dân, trạng thái: `new` $\to$ `community_verifying` $\to$ `confirmed_signal` $\to$ `forwarded` $\to$ `resolved`.<br>- Operations Case: Đóng vai trò là "Enforcement Docket" cho cán bộ, trạng thái: `NEW` $\to$ `TRIAGED` $\to$ `INSPECTION_PENDING` $\to$ `ACTION_REQUIRED` $\to$ `CLOSED`. | **`CommunityCase`** (Side A) & **`OperationsCase`** (Side B) | Hai thực thể tồn tại ở 2 CSDL riêng biệt để đảm bảo an toàn thông tin nội bộ. Liên kết thông qua khóa ngoại logic: `operations_cases.source_reference = community_cases.id`. |
| **`observations`**<br>(Community `apps/server`) | **`case_evidences`**<br>(Legacy D1 `app/`) | **CÙNG BẢN CHẤT PHÍA CỘNG ĐỒNG** | Cùng là ảnh chụp và ghi nhận diễn biến thực địa tại công trình sau khi đã có hồ sơ theo dõi. `observations` gắn với tài khoản người quan sát và tích điểm đóng góp. | **`Observation`** (`observations`) | Giữ `Observation` làm thực thể chính thức của Side A cho mọi ghi nhận Before/After của cộng đồng. |
| **`documents` / `policies`**<br>(Legacy `app/`) | **`legal_documents` / `legal_articles`**<br>(Operations) | **CÙNG BẢN CHẤT PHÁP LÝ** | Legacy `documents` chứa biểu mẫu Word/PDF theo NĐ 30/2020; `legal_documents` chứa toàn văn Luật BVMT, NĐ 45, QCVN 05 kèm chỉ mục FTS5 để AI tra cứu xử phạt. | **`LegalDocument`** & **`AdministrativeForm`** | Giữ `legal_documents` (FTS5) trong Operations để phục vụ pháp chế. Giữ module tạo văn bản hành chính NĐ 30/2020 làm công cụ xuất hồ sơ (Export Service). |
| **`youth_credits`**<br>(Legacy D1 `app/`) | **`contributions` / `user_points`**<br>(Community `apps/server`) | **CÙNG BẢN CHẤT GHI NHẬN** | Legacy tính thẳng 20 giờ = 4.0 tín chỉ; Community mới tính theo hệ thống điểm thưởng `points` (10 điểm phản ánh, 20 điểm nhiệm vụ). | **`VolunteerCredit`** | Hợp nhất: 100 điểm đóng góp hợp lệ = 20 giờ tình nguyện = Chứng nhận 4.0 tín chỉ thanh niên kèm mã băm SHA-256 xác thực. |

---

## 3. SƠ ĐỒ CHU KỲ VÒNG ĐỜI LIÊN THÔNG (END-TO-END LIFECYCLE)

```
[Người Dân / Citizen]
       │
       ▼ (Gửi tin báo)
    [Report] ──(Nhiều người xác nhận)──► [Report Confirmations]
       │
       ▼ (Điều phối viên duyệt)
[Community Case] (confirmed_signal)
       │
       ├────► [Community Tasks] ──► [Youth Member] ──► [Observations]
       │
       ▼ (Chuyển tiếp hồ sơ - Handoff)
┌────────────────────────────────────────────────────────────────────────┐
│  POST /api/integrations/community/cases (Idempotent Payload SHA-256)   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
                          [Operations Case] (source = 'COMMUNITY')
                                   │
                                   ▼ (Phân công cán bộ)
                            [Inspection] (10 Tiêu chí QCVN 18/BXD)
                                   │
                     ┌─────────────┴─────────────┐
                     ▼                           ▼
            [Legal Assessment]          [Corrective Action]
            (Tra cứu FTS5 Luật)         (Gửi Quick-Token cho Nhà thầu)
                                                 │
                                                 ▼ (Geofence ≤ 50m)
                                         [Remediation Proof]
                                                 │
                                                 ▼ (Cán bộ nghiệm thu)
                                           [Case Closed]
                                                 │
                                                 ▼ (Đồng bộ kết quả ngược lại)
                                      [Community Case Resolved]
```
