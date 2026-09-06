# DUSTGUARD VN — MA TRẬN NGUỒN GỐC DÒNG DỮ LIỆU (DATA LINEAGE MASTER)

> **Mã tài liệu**: `DG-AUDIT-DATA-LINEAGE-01`  
> **Thời điểm xác lập**: 06/09/2026  
> **Nguyên tắc**: **MỌI DỮ LIỆU ĐẦU VÀO ĐỀU PHẢI XÁC ĐỊNH RÕ ĐIỂM ĐẾN, NƠI LƯU TRỮ VÀ VÒNG ĐỜI (ZERO UNTRACEABLE INPUTS).**

---

## 1. MA TRẬN CHI TIẾT CÁC LUỒNG NHẬP LIỆU (DATA LINEAGE MATRIX)

| Input / Thao tác người dùng | Giao diện tiếp nhận (UI) | API Endpoint tiếp nhận | Quy chuẩn kiểm tra (Validation) | Bảng CSDL đích | Cột dữ liệu chính | Loại Storage | Kết quả trả về (Output) | Thời gian lưu trữ (Retention) |
|---|---|---|---|---|---|---|---|---|
| **Đăng ký công dân mới** | `apps/web/src/pages/RegisterPage.tsx` | `POST /api/auth/register` | Email RFC 5322, Mật khẩu $\ge 8$ ký tự, Họ tên | `users` (Side A) | `id`, `email`, `password_hash`, `role`, `created_at` | SQLite | JWT Token + User profile | Vĩnh viễn (hoặc tới khi yêu cầu xóa tài khoản) |
| **Gửi phản ánh bụi** | `apps/web/src/pages/CreateReportPage.tsx` | `POST /api/reports` | Tiêu đề $\ge 5$ ký tự, Tọa độ WGS84 hợp lệ, Danh mục | `reports` (Side A) | `id`, `report_code`, `title`, `description`, `latitude`, `longitude`, `address`, `status` | SQLite | Mã phản ánh `DG-C-2026-XXXX` | Lưu trữ tối thiểu 5 năm phục vụ tra cứu đô thị |
| **Tải ảnh bằng chứng công dân** | `apps/web/src/pages/CreateReportPage.tsx` | `POST /api/reports/:id/media` | Định dạng MIME `image/*`, Dung lượng $\le 10$MB, Mã băm SHA-256 | `evidences` (Side A) | `id`, `report_id`, `url`, `sha256_hash`, `caption` | R2 / Đĩa cục bộ | Bản ghi bằng chứng đã niêm phong mật mã | 5 năm theo vụ việc |
| **Lưu bản nháp phản ánh** | `apps/web/src/pages/CreateReportPage.tsx` | N/A (Client-side) | JSON Schema thô | N/A | Khóa `dustguard_draft_citizen_report` | LocalStorage | Badge *"Đã lưu bản nháp lúc..."* | Tự xóa ngay sau khi gửi thành công lên server |
| **Gộp phản ánh thành vụ việc** | `apps/web/src/pages/CaseCoordinationPage.tsx` | `POST /api/moderator/cases` | Danh sách `report_ids`, Quyền `observation:moderate` | `cases` (Side A) | `id`, `case_code`, `status`, `created_by` | SQLite | Mã vụ việc cộng đồng | 5 năm |
| **Chuyển giao hồ sơ sang Cơ quan** | `apps/web/src/pages/CaseCoordinationPage.tsx` | `POST /api/integrations/community/cases` *(path đính chính 06/09; endpoint KHÔNG có xác thực `x-service-key` — đã kiểm chứng sống)* | Idempotency Key = `external_case_id` | `cases` (Side B) | `id`, `case_code`, `status='NEW'`, `source='COMMUNITY'`, `source_reference` | SQLite | Bản ghi thụ lý thanh tra (`action: CREATED_NEW`\|`UPDATED`) | 10 năm theo quy định thanh tra môi trường |
| **Phân công cán bộ thanh tra** | `dustguard-operations/apps/web/src/pages/CaseDetailPage.tsx` | `POST /api/cases/:id/assign` | `assigned_to` là cán bộ hợp lệ, Quyền `case:assign` | `cases` & `assignments` (Side B) | `assigned_to`, `assigned_at`, `status='ASSIGNED'` | SQLite | Thông báo tới cán bộ thụ lý | 10 năm |
| **Phiếu kiểm tra thực địa QCVN 18** | `dustguard-operations/apps/web/src/pages/FieldInspectionPage.tsx` | `POST /api/inspections/:id/submit` | 10 tiêu chí tuân thủ, Tọa độ GPS thực tế | `inspections` & `inspection_items` (Side B) | `result`, `note`, `arrival_gps`, `items_json` | SQLite | Điểm tuân thủ kỹ thuật | 10 năm |
| **Ban hành Lệnh khắc phục vi phạm** | `dustguard-operations/apps/web/src/pages/CaseDetailPage.tsx` | `POST /api/cases/:id/actions` | Mô tả yêu cầu, Thời hạn SLA 48h, Đơn vị thi công | `actions` (Side B) | `id`, `case_id`, `responsible_party`, `due_at`, `status='OPEN'` | SQLite | Mã lệnh `act-XXXX` + Token nhà thầu | 5 năm |
| **Nhà thầu nộp báo cáo khắc phục** | `apps/web/src/pages/contractor/ContractorRemediationPage.tsx` | `POST /api/contractor/actions/:id/remediation` | Bán kính Geofence $\le 50$m, Ảnh có băm SHA-256 | `remediations` & `actions` (Side B) | `id`, `action_id`, `description`, `evidence_ids`, `status='SUBMITTED'` | SQLite | Trạng thái Chờ thẩm định | 5 năm |
| **Nghiệm thu & Đóng vụ việc** | `dustguard-operations/apps/web/src/pages/CaseDetailPage.tsx` | `POST /api/cases/:id/close` | Closure Safety Gate (Không lỗi băm, có kết luận cán bộ) | `cases` & `audit_logs` (Side B) | `status='CLOSED'`, `closed_at`, `closed_by` | SQLite | Hồ sơ chính thức khép lại | 10 năm |
| **Đánh giá của người dân & Phúc tra** | `apps/web/src/pages/CaseDetailPage.tsx` | `POST /api/cases/:id/feedback` | Điểm số 1-5 sao, Nhận xét, Cờ `reopen_requested` | `case_feedback` (Side A) & `case_timelines` (Side B) | `rating`, `feedback`, `reopen_requested` | SQLite | Cập nhật mốc thời gian minh bạch | 5 năm |
| **Ghi nhận giờ tín chỉ thanh niên** | `apps/web/src/pages/YouthCreditsPage.tsx` | `GET /api/contributions` *(⚠️ kiểm chứng 06/09: KHÔNG có bảng `youth_credits` trong CSDL — 22 bảng thực tế của Side A đã liệt kê không có bảng này. Giờ/tín chỉ được TÍNH TOÁN client-side từ `user_contributions`, nhưng response thật của `/api/contributions` là `{stats, milestoneMessage, timeline}` trong khi `YouthCreditsPage.tsx` đọc `res.contributions`, một trường không tồn tại → luôn nhận mảng rỗng → giờ tình nguyện/tín chỉ hiển thị LUÔN LÀ 0 bất kể hoạt động thật. Đây là lỗi hỏng tính năng đã xác minh sống, chưa được sửa trong phiên này vì nằm ngoài phạm vi tệp được phép chỉnh sửa.)* | Ảnh hiện trường SHA-256, Định vị GPS trong 50m | `user_contributions` (Side A, bảng thật) | `user_id`, `type`, `created_at` | SQLite | (Dự kiến) Chứng nhận điện tử có mã QR — thực tế hiện luôn 0h/0.0 tín chỉ | Vĩnh viễn (lưu vào hồ sơ rèn luyện) |

---

## 2. NGUYÊN TẮC BẢO VỆ DỮ LIỆU & QUYỀN RIÊNG TƯ (DATA PRIVACY)

1. **Làm mờ vị trí công cộng (Location Obfuscation)**:
   - Trên bản đồ cộng đồng công khai (`/map`), tọa độ chính xác của phản ánh được đưa về ô lưới làm mờ bán kính 100m.
   - Tọa độ GPS chính xác chỉ được phục vụ cho cán bộ thanh tra thụ lý có thẩm quyền.
2. **Loại bỏ dữ liệu nhạy cảm khỏi Log**:
   - Mật khẩu, token xác thực, chuỗi kết nối tuyệt đối không được ghi vào console hay nhật ký kiểm toán.
3. **Toàn vẹn tệp tin nhị phân**:
   - Mọi tệp ảnh tải lên R2 đều được lưu kèm mã băm SHA-256 tính toán từ byte thô của tệp tại thời điểm tiếp nhận.
