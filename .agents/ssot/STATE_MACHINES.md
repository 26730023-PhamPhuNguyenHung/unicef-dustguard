# DUSTGUARD VN — STATE MACHINES & LIFECYCLES (SSOT)

> **Đặc tả Cây Trạng Thái Bất Biến & Quy Tắc Chuyển Trạng Thái**  
> **Áp dụng**: Enforce 100% tại `app/server/domain/cases/case.rules.js` & Cloudflare Worker Hono/D1.  
> **Nguyên tắc**: Tuyệt đối không cho phép client-side tự ý thay đổi status mà không qua xác thực backend.

---

## 1. VÒNG ĐỜI HỒ SƠ VỤ VIỆC (CASE STATE MACHINE — 7-10 BƯỚC CHÍNH THỨC)

```mermaid
stateDiagram-v2
    [*] --> NEW : Tạo từ Observation / Sensor Alert
    NEW --> TRIAGED : Tiếp nhận & Phân loại
    TRIAGED --> ASSIGNED : Phân công Thanh tra viên
    ASSIGNED --> INSPECTION_PENDING : Lên lịch kiểm tra thực địa
    INSPECTION_PENDING --> INSPECTION_COMPLETED : Hoàn thành biên bản thanh tra
    
    INSPECTION_COMPLETED --> VIOLATION_CONFIRMED : Xác nhận có vi phạm QCVN
    INSPECTION_COMPLETED --> NO_VIOLATION_CLOSED : Hiện trường đạt chuẩn (Đóng hồ sơ)
    
    VIOLATION_CONFIRMED --> REMEDIATION_REQUIRED : Ban hành lệnh khắc phục & áp SLA
    REMEDIATION_REQUIRED --> REMEDIATION_IN_PROGRESS : Nhà thầu bắt đầu xử lý
    REMEDIATION_IN_PROGRESS --> VERIFICATION_PENDING : Nhà thầu nộp ảnh Before/After
    
    VERIFICATION_PENDING --> RESOLVED : Thanh tra nghiệm thu ĐẠT
    VERIFICATION_PENDING --> REMEDIATION_REQUIRED : Nghiệm thu KHÔNG ĐẠT (Yêu cầu làm lại)
    
    RESOLVED --> CLOSED : Lưu trữ hồ sơ hoàn tất
    
    NEW --> REJECTED : Thông tin phản ánh giả mạo/không hợp lệ
    VIOLATION_CONFIRMED --> ESCALATED : Vi phạm đặc biệt nghiêm trọng / Chuyển tuyến Sở TNMT
    ESCALATED --> CLOSED : Hoàn tất chuyển giao cơ quan thẩm quyền
    CLOSED --> REOPENED : Tái ô nhiễm / Cộng đồng báo cáo lại
    REOPENED --> ASSIGNED
```

### 1.1. Bảng Chuyển Đổi Trạng Thái Hồ Sơ Vụ Việc (Case Transition Rules)

| Trạng Thái Ban Đầu (From) | Hành Động (Action) | Trạng Thái Mới (To) | Tác Nhân (Actor) | Điều Kiện Bắt Buộc (Conditions) | Tác Vụ Phụ (Side Effects) |
|---|---|---|---|---|---|
| `NEW` | `triage` | `TRIAGED` | Staff / Admin | Đã đánh giá tính xác thực của nguồn tin | Cập nhật `priority_score`, ghi `audit_logs` |
| `NEW` | `reject` | `REJECTED` | Staff / Admin | Phải có lý do từ chối rõ ràng (`reject_reason`) | Thông báo người phản ánh, ghi `audit_logs` |
| `TRIAGED` | `assign` | `ASSIGNED` | Admin / Lead Staff | `assigned_inspector_id` phải là Staff hợp lệ | Gửi notification cho Thanh tra viên được giao |
| `ASSIGNED` | `schedule_inspection` | `INSPECTION_PENDING` | Assigned Inspector / Admin | Xác định ngày giờ kiểm tra dự kiến | Tạo bản ghi draft trong bảng `inspections` |
| `INSPECTION_PENDING` | `submit_inspection` | `INSPECTION_COMPLETED` | Assigned Inspector | Phải nộp đầy đủ Checklist 10 tiêu chí + Kết luận | Lưu kết quả thanh tra vào bảng `inspections` |
| `INSPECTION_COMPLETED` | `confirm_violation` | `VIOLATION_CONFIRMED` | Assigned Inspector / Admin | `violation_detected === true` kèm căn cứ luật QCVN | Kích hoạt bộ tính toán rủi ro môi trường |
| `INSPECTION_COMPLETED` | `dismiss_case` | `NO_VIOLATION_CLOSED` | Assigned Inspector / Admin | `violation_detected === false` kèm ảnh chứng minh | Đóng case, cập nhật phản ánh công dân thành công |
| `VIOLATION_CONFIRMED` | `issue_remediation` | `REMEDIATION_REQUIRED` | Assigned Inspector / Admin | Xác định rõ hành động yêu cầu + `sla_deadline` (48h/72h) | Gửi thông báo khẩn & SMS/Email cho Nhà thầu |
| `REMEDIATION_REQUIRED` | `start_action` | `REMEDIATION_IN_PROGRESS`| Contractor | Nhà thầu xác nhận đã nhận lệnh xử lý | Cập nhật thời điểm tiếp nhận |
| `REMEDIATION_IN_PROGRESS`| `submit_evidence` | `VERIFICATION_PENDING` | Contractor | Phải có đủ 2 ảnh Before & After kèm mã SHA-256 | Gửi thông báo cho Thanh tra viên để nghiệm thu |
| `VERIFICATION_PENDING` | `approve_remediation`| `RESOLVED` | Assigned Inspector / Admin | Thanh tra viên đánh giá ảnh đối chứng ĐẠT | Giải phóng trạng thái cảnh báo của công trình |
| `VERIFICATION_PENDING` | `reject_remediation` | `REMEDIATION_REQUIRED` | Assigned Inspector / Admin | Nêu rõ lý do chưa đạt yêu cầu xử lý bụi | Tăng cấp độ phạt ký quỹ, reset hạn 24h bổ sung |
| `RESOLVED` | `archive_close` | `CLOSED` | Admin / Lead Staff | Tất cả biên bản và minh chứng đã lưu trữ đầy đủ | Đóng hồ sơ, cập nhật điểm uy tín công trình |
| `VIOLATION_CONFIRMED` | `escalate_handoff` | `ESCALATED` | Inspector / Admin | Vi phạm tái diễn > 3 lần hoặc vượt ngưỡng nguy hại | Tạo hồ sơ `handoff_tickets`, chuyển tuyến Sở TNMT |
| `CLOSED` | `reopen` | `REOPENED` | Admin / Lead Staff | Nhận được phản ánh mới tại cùng vị trí trong 14 ngày | Tạo chu kỳ thanh tra mới, gán `is_reopened = 1` |

---

## 2. VÒNG ĐỜI PHẢN ÁNH CỘNG ĐỒNG (OBSERVATION LIFECYCLE)

```mermaid
stateDiagram-v2
    [*] --> PENDING : Người dân gửi phản ánh
    PENDING --> VERIFIED : Staff duyệt thông tin hợp lệ
    PENDING --> REJECTED : Thông tin spam / không có cơ sở
    VERIFIED --> CONVERTED_TO_CASE : Chuyển thành hồ sơ thanh tra chính thức
    VERIFIED --> RESOLVED : Tự khắc phục / xử lý nhanh tại chỗ
    CONVERTED_TO_CASE --> RESOLVED : Vụ việc thanh tra đã được xử lý
    RESOLVED --> [*]
```

---

## 3. VÒNG ĐỜI YÊU CẦU KHẮC PHỤC CỦA NHÀ THẦU (REMEDIATION ACTION LIFECYCLE)

```mermaid
stateDiagram-v2
    [*] --> ISSUED : Thanh tra ban hành lệnh
    ISSUED --> IN_PROGRESS : Nhà thầu tiếp nhận
    IN_PROGRESS --> SUBMITTED : Nộp minh chứng Before/After
    SUBMITTED --> APPROVED : Thanh tra nghiệm thu ĐẠT
    SUBMITTED --> REJECTED_RETRY : Thanh tra nghiệm thu KHÔNG ĐẠT
    REJECTED_RETRY --> IN_PROGRESS : Nhà thầu xử lý lại
    ISSUED --> SLA_BREACHED : Quá thời hạn SLA (48h/72h) không xử lý
    SLA_BREACHED --> ESCALATED : Phạt tiền ký quỹ CSR / Chuyển xử phạt hành chính
```

---

## 4. VÒNG ĐỜI VĂN BẢN HÀNH CHÍNH & PHÁP LÝ A4 (LEGAL DOCUMENT LIFECYCLE)

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Khởi tạo bản thảo
    DRAFT --> REVIEW_PENDING : Gửi thẩm định nội dung
    REVIEW_PENDING --> APPROVED : Lãnh đạo phê duyệt
    REVIEW_PENDING --> REJECTED : Trả về sửa đổi
    APPROVED --> SIGNED : Ký số điện tử & đóng dấu SHA-256 HMAC
    SIGNED --> PUBLISHED : Ban hành chính thức / Chuyển tuyến
```

- **Quy tắc**: Mọi hành động `APPROVED`, `SIGNED`, `PUBLISHED` phải cập nhật trực tiếp vào bảng `legal_documents` trong D1 kèm chữ ký băm bất biến và ghi log `audit_logs`. Tuyệt đối không lưu trạng thái tạm thời trong React state.
