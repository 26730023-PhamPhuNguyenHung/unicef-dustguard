# DUSTGUARD VN — CRUD & AUTHORITY MATRIX (SSOT)

> **Ma Trận Thẩm Quyền & Thao Tác Dữ Liệu Theo Thực Thể & Vai Trò**  
> **Áp dụng**: Enforce 100% tại Hono Edge / Express Backend Middleware & D1 Repositories.

---

## 1. KÝ HIỆU THẨM QUYỀN (AUTHORITY LEGEND)

- **C**: Create (Tạo mới)
- **R-Own**: Read Own (Chỉ đọc dữ liệu do chính mình tạo ra)
- **R-Assigned**: Read Assigned (Chỉ đọc dữ liệu được phân công hoặc thuộc đơn vị/công trình của mình)
- **R-All**: Read All (Được đọc toàn bộ dữ liệu trong hệ thống)
- **U-Own**: Update Own (Chỉnh sửa dữ liệu của chính mình khi trạng thái cho phép)
- **U-Assigned**: Update Assigned (Chỉnh sửa hoặc cập nhật kết quả xử lý dữ liệu được phân công)
- **U-All**: Update All (Chỉnh sửa toàn quyền)
- **D**: Hard Delete (Xóa vĩnh viễn - chỉ áp dụng khi an toàn/Admin)
- **Soft-D**: Soft Delete / Archive (Ẩn dữ liệu, cập nhật `deleted_at`)
- **Restore**: Phục hồi dữ liệu đã bị soft delete
- **Assign**: Phân công cán bộ/nhà thầu chịu trách nhiệm
- **Approve / Reject**: Phê duyệt hoặc từ chối giải trình/nghiệm thu
- **Close / Reopen**: Đóng hồ sơ hoặc mở lại hồ sơ vụ việc

---

## 2. MA TRẬN CRUD TOÀN DIỆN (COMPREHENSIVE CRUD MATRIX)

| Thực Thể (Entity) | Citizen / Youth | Staff / Inspector | Contractor | Executive | Admin | System Engine |
|---|---|---|---|---|---|---|
| **Observations** (Phản ánh cộng đồng) | **C, R-All, U-Own** *(khi PENDING)*, **Soft-D-Own** | **R-All, U-All** *(Gắn tag/phân loại)* | **R-All** | **R-All** | **C, R-All, U-All, Soft-D, Restore** | **C** *(via IoT threshold)* |
| **Follow-ups** (Chuỗi cập nhật phản ánh) | **C, R-All** | **C, R-All** | **R-All** | **R-All** | **CRUD-All** | **C** |
| **Cases** (Hồ sơ vụ việc pháp lý) | **R-Public** *(Chỉ xem tóm tắt công khai)* | **R-All, U-Assigned, Assign, Close** | **R-Assigned** | **R-All, Approve Handoff** | **CRUD-All, Assign, Reopen, Close, Soft-D, Restore** | **C, U** *(Tự động chuyển từ Alert / Escalation)* |
| **Inspections** (Biên bản kiểm tra thực địa) | **-** | **C, R-All, U-Assigned** | **R-Assigned** | **R-All** | **CRUD-All** | **-** |
| **Remediation Actions** (Yêu cầu khắc phục) | **-** | **C, R-All, U-Assigned, Approve, Reject** | **R-Assigned, U-Assigned** *(Submit evidence)* | **R-All** | **CRUD-All, Approve, Reject** | **U** *(Timeout SLA check)* |
| **Contractor Submissions** (Minh chứng nhà thầu) | **-** | **R-All, Approve, Reject** | **C, R-Assigned, U-Assigned** *(khi SUBMITTED)* | **R-All** | **CRUD-All** | **-** |
| **Evidence / Media** (Bằng chứng số R2) | **C, R-All, Soft-D-Own** | **C, R-All, Soft-D** | **C, R-Assigned** | **R-All** | **CRUD-All, Soft-D, Restore** | **C** |
| **Construction Sites** (Công trình xây dựng) | **R-All** | **R-All, U** *(Cập nhật trạng thái)* | **R-Assigned** | **R-All** | **CRUD-All, Soft-D, Restore** | **R** |
| **Devices & Sensors** (Trạm đo IoT) | **R-Public Telemetry** | **R-All, U** *(Báo hỏng trạm)* | **R-Assigned Telemetry** | **R-All** | **CRUD-All, Bind/Unbind Site, Soft-D, Restore** | **C, U** *(Ingest telemetry, Heartbeat)* |
| **Youth Credits & Certs** (Tín chỉ thanh niên) | **C-Checkin, R-Own** | **R-All, Approve-Hours** | **-** | **R-All** | **CRUD-All, Revoke, Reissue** | **C** *(Tự động cấp chứng chỉ khi đủ 20h)* |
| **CSR Escrow Contracts** (Hợp đồng ký quỹ ESG) | **-** | **R-All** | **R-Assigned** | **R-All, Approve-Release, Forfeit** | **CRUD-All** | **U** *(Trigger phạt khi quá hạn)* |
| **Legal Rules & Documents** (Văn bản pháp lý A4) | **R-Public** | **C-Draft, R-All, U-Own, Sign** | **R-Assigned Official** | **R-All, Approve, Sign** | **CRUD-All, Publish** | **-** |
| **Users & Accounts** (Tài khoản & Phân quyền) | **R-Own, U-Own Profile** | **R-Own, U-Own Profile** | **R-Own, U-Own Profile** | **R-All** | **CRUD-All, Assign-Role, Deactivate, Restore** | **-** |
| **Audit Logs** (Nhật ký truy vết) | **-** | **-** | **-** | **R-All** | **R-All** *(Chỉ đọc, bất biến)* | **C** *(Ghi log tự động mọi write mutation)* |

---

## 3. NGUYÊN TẮC THỰC THI (ENFORCEMENT RULES)

1. **Object-Level Check (Quyền cấp độ bản ghi)**:
   - Khi Contractor gọi `GET /api/contractor/actions`, backend chỉ trả về danh sách các bản ghi có `contractor_id` trùng khớp với đơn vị của user trong token.
   - Khi Staff ký biên bản `POST /api/inspections`, backend kiểm tra `assigned_inspector_id === user.id` hoặc `user.role === 'admin'`.
2. **Không Thay Đổi Trạng Thái Trực Tiếp Bằng Client**:
   - Mọi thao tác đổi trạng thái (chuyển Case sang `RESOLVED`, duyệt minh chứng sang `APPROVED`) đều phải gọi qua API chuyên biệt (`PATCH /api/cases/:id/transition`, `PATCH /api/contractor/actions/:id/review`) với payload xác thực và ghi audit log.
3. **Quy Tắc Xóa Bền Vững (Soft Delete Policy)**:
   - Dữ liệu thực thể nghiệp vụ (Sites, Cases, Complaints, Users) không bị xóa cứng (Hard Delete) trừ khi có sự xác nhận của Admin trong môi trường kiểm thử.
   - Mọi truy vấn đọc bình thường phải tự động thêm điều kiện `WHERE deleted_at IS NULL`.
