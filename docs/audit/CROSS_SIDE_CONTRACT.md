# DUSTGUARD VN — ĐẶC TẢ HỢP ĐỒNG LIÊN THÔNG HAI CHIỀU (CROSS-SIDE CONTRACT)

> **Mã tài liệu**: `DG-CONTRACT-CROSS-SIDE-01`  
> **Phiên bản**: 1.0.0 | **Ngày xác lập**: 06/09/2026  
> **Các bên liên quan**: 
> - **Side A (Cộng đồng & Công dân - Port 3000/3001)**: `dustguard-community.db`
> - **Side B (Thanh tra & Vận hành - Port 3002/4000)**: `dustguard-operations.db`

---

## 1. TỔNG QUAN LUỒNG CHUYỂN GIAO & ĐỒNG BỘ HAI CHIỀU

```text
[CÔNG DÂN / SIDE A]
        │
        ▼ 1. Tạo phản ánh (Create Report)
  [Bảng reports D1]
        │
        ▼ 2. Thẩm tra & Gộp vụ việc (Moderator Triage)
  [Bảng cases Side A]
        │
        ▼ 3. Chuyển giao sang Cơ quan (Status = 'forwarded')
  [Webhook Handoff] ──────────────────────────────────────────────┐
  (Header: x-service-key, Body: Case Data + Idempotency Key)      │
                                                                  ▼
                                                      [OPERATIONS / SIDE B]
                                                      Tự động thụ lý hồ sơ (Case Ingest)
                                                      [Bảng cases Side B]
                                                                  │
                                                                  ▼ 4. Ban hành Lệnh khắc phục
                                                              [Bảng actions Side B]
                                                                  │
                                                                  ▼ 5. Nhà thầu nộp ảnh khắc phục
                                                              [Bảng remediations Side B]
                                                                  │
                                                                  ▼ 6. Cán bộ nghiệm thu & Đóng hồ sơ
                                                              [Closure Safety Gate]
                                                                  │
  [Webhook Sync] ◄────────────────────────────────────────────────┘
  (Header: x-service-key, Body: Event Type + Status Mapping)
        │
        ▼ 7. Cập nhật trạng thái người dân thấy & Kích hoạt Citizen Feedback Loop
  [Timeline & Feedback Side A]
```

---

## 2. MA TRẬN ÁNH XẠ TRẠNG THÁI NGHIỆP VỤ (STATUS MAPPING)

Để bảo đảm **Zero Technical Jargon** trên giao diện người dân, 12 trạng thái nội bộ của Cơ quan quản lý (Side B) được chuyển dịch thành 6 trạng thái ngôn ngữ đời thường cho người dân (Side A):

| Sự kiện Side B (`event_type`) | Trạng thái nội bộ Side B | Trạng thái đồng bộ Side A | Thông điệp hiển thị cho người dân (User Timeline) |
|---|---|---|---|
| `CASE_INGESTED` | `TRIAGED` / `ASSIGNED` | `under_review` | *"Phản ánh đã được Cơ quan Môi trường tiếp nhận và phân công cán bộ phụ trách."* |
| `INSPECTION_SCHEDULED` | `INVESTIGATING` | `in_progress` | *"Đoàn thanh tra đã lên kế hoạch kiểm tra thực địa tại công trình."* |
| `ACTION_REQUIRED` | `ACTION_REQUIRED` | `in_progress` | *"Cơ quan quản lý đã ban hành Lệnh yêu cầu nhà thầu khắc phục vi phạm trong 48h."* |
| `REMEDIATION_SUBMITTED`| `VERIFYING` | `in_progress` | *"Đơn vị thi công đã nộp kết quả xử lý. Cán bộ đang tiến hành thẩm định."* |
| `CASE_CLOSED` | `CLOSED` | `resolved` | *"Vụ việc đã được xử lý đạt chuẩn và đóng hồ sơ nghiệm thu."* |
| `CASE_REJECTED` | `REJECTED` | `rejected` | *"Phản ánh không đủ căn cứ xử lý hoặc vị trí không thuộc thẩm quyền."* |

---

## 3. ĐẶC TẢ CHI TIẾT CÁC ĐIỂM TIẾP NHẬN (ENDPOINTS & CONTRACTS)

### 3.1. Handoff: Chuyển giao từ Side A sang Side B

> **⚠️ ĐÍNH CHÍNH (tái kiểm chứng 06/09/2026)**: Path thực tế trong mã nguồn là `POST http://localhost:4000/api/integrations/community/cases` (không phải `/forward` như mô tả trước đây — xem `dustguard-operations/apps/server/src/modules/integrations/integrations.router.ts`). Idempotency key thực tế là trường `external_case_id` (ID nội bộ của Side A), không phải `case_code`.
>
> **✅ ĐÃ VÁ TRONG PHIÊN NÀY (06/09/2026)**: Endpoint này ban đầu **không có** middleware xác thực `x-service-key` như tài liệu này khẳng định (đã kiểm chứng trực tiếp: gọi không kèm header vẫn thành công). Đã thêm middleware `requireServiceKey` kiểm tra header `x-service-key` khớp với biến môi trường `INTEGRATION_SERVICE_KEY` (mặc định `dustguard-internal-2026` cho dev cục bộ, xem `dustguard-operations/.env.example`); thiếu hoặc sai khóa trả về `401 UNAUTHORIZED_SERVICE`. Bên gửi thực tế (`apps/server/src/utils/handoff.ts`) đã được cập nhật để gửi kèm header này. Đã kiểm chứng sống: không key → 401; sai key → 401; đúng key → 200 và luồng bàn giao thật qua `handoff.ts` vẫn hoạt động; kiểm tra lại idempotency (gửi trùng `external_case_id`) với key đúng vẫn cho kết quả `CREATED_NEW` rồi `UPDATED` như trước, không hồi quy.

- **Method / Path**: `POST http://localhost:4000/api/integrations/community/cases`
- **Xác thực**: Header `x-service-key` khớp biến môi trường `INTEGRATION_SERVICE_KEY` — **nay đã thực sự được kiểm tra** (xem đính chính ở trên; trước đó tài liệu ghi đúng yêu cầu nhưng mã nguồn chưa thực thi).
- **Idempotency Key**: Trường `external_case_id` (ID vụ việc trên Side A). Đã kiểm chứng sống: gửi cùng `external_case_id` hai lần trả về cùng `case_id`, action chuyển từ `CREATED_NEW` sang `UPDATED`, `source_report_count` tăng dần thay vì sinh bản ghi mới.
- **Cấu trúc Payload**:
  ```json
  {
    "source_case_code": "DG-C-2026-6048",
    "title": "Bụi mù mịt từ công trình thi công tuyến vành đai",
    "description": "Xe tải chở phế thải không rửa bánh, bụi bay vào khu dân cư",
    "category": "dust",
    "severity": "high",
    "latitude": 20.9850,
    "longitude": 105.8450,
    "address": "Ngã tư Kim Đồng - Giải Phóng, Quận Hoàng Mai",
    "district": "Hoàng Mai",
    "evidence_count": 2,
    "forwarded_by": "usr-mod-01",
    "forwarded_at": "2026-09-06T03:30:00.000Z"
  }
  ```
- **Phản hồi chuẩn (Response 201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "case_id": "case-bf96fb4a",
      "case_code": "DG-C-2026-6048",
      "status": "TRIAGED",
      "message": "Đã tiếp nhận hồ sơ thành công vào hệ thống điều hành."
    }
  }
  ```

### 3.2. Sync: Đồng bộ kết quả từ Side B về Side A

> **⚠️ ĐÍNH CHÍNH (06/09/2026)**: Đã kiểm chứng sống: gọi thành công khi đóng hồ sơ (status CLOSED) khiến vụ việc Side A chuyển sang `resolved` và `resolved_at` được ghi nhận — luồng nghiệp vụ đúng như mô tả — nhưng đồng thời phát hiện và ĐÃ VÁ hai lỗi thực: (1) endpoint này ban đầu **không có xác thực** dù tài liệu khẳng định có (`apps/server/src/routes/integrations.routes.ts` thiếu middleware `x-service-key`) — đã thêm `requireServiceKey` (cùng cơ chế biến môi trường `INTEGRATION_SERVICE_KEY` như mục 3.1) và cập nhật bên gửi thật (`dustguard-operations/apps/server/src/modules/integrations/syncService.ts`) gửi kèm header; (2) nếu một webhook đến trễ/ngoài thứ tự (ví dụ trạng thái `TRIAGED` đến sau khi hồ sơ đã `resolved`), hệ thống trước đây sẽ ghi đè ngược trạng thái về giai đoạn sớm hơn, làm "hồi sinh" một hồ sơ đã đóng — đã thêm cơ chế chặn: một khi hồ sơ đã `resolved`, chỉ chấp nhận `REOPENED` hoặc một xác nhận `resolved` khác. Đã kiểm chứng sống cả hai: không key/sai key → 401; đúng key → 200 như cũ; webhook trễ → bị bỏ qua thay vì ghi đè.

- **Method / Path**: `POST http://localhost:3001/api/integrations/operations/sync`
- **Xác thực**: Header `x-service-key` khớp `INTEGRATION_SERVICE_KEY` — nay đã thực sự được kiểm tra (401 nếu thiếu/sai).
- **Cấu trúc Payload**:
  ```json
  {
    "event_type": "ACTION_REQUIRED",
    "case_code": "DG-C-2026-6048",
    "operations_case_id": "case-bf96fb4a",
    "action_id": "act-764b6eae",
    "status": "in_progress",
    "message": "Cán bộ đã ban hành lệnh khắc phục thời hạn 48h cho nhà thầu.",
    "occurred_at": "2026-09-06T03:32:00.000Z"
  }
  ```
- **Phản hồi chuẩn (Response 200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "case_code": "DG-C-2026-6048",
      "updated_status": "in_progress",
      "timeline_synced": true
    }
  }
  ```

### 3.3. Feedback: Người dân đánh giá và Yêu cầu phúc tra (Reopen)
- **Method / Path**: `POST http://localhost:4000/api/integrations/community/feedback`
- **Xác thực**: Header `x-service-key: dustguard-internal-2026`
- **Cấu trúc Payload**:
  ```json
  {
    "case_code": "DG-C-2026-6048",
    "rating": 5,
    "feedback": "Khu vực đã được dọn sạch bụi, xe ra vào đã có cầu rửa xe.",
    "reopen_requested": false,
    "submitted_at": "2026-09-06T03:35:00.000Z"
  }
  ```
- **Xử lý Side Effect tại Side B**: Ghi bản ghi `CITIZEN_FEEDBACK` vào bảng `case_timelines`. Nếu `reopen_requested: true`, vụ việc được kích hoạt cờ cảnh báo đỏ `REOPEN_FLAGGED` để lãnh đạo giám sát yêu cầu thanh tra lại.

---

## 4. CHIẾN LƯỢC XỬ LÝ SỰ CỐ & THẤT BẠI (FAILURE HANDLING & RESILIENCE)

> **⚠️ ĐÍNH CHÍNH (tái kiểm chứng bằng đọc mã nguồn, 06/09/2026)**: Mục này trước đây mô tả một cơ chế "Pending Outbox" bền vững và exponential backoff không khớp với mã nguồn thực tế. Hành vi thật:

1. **Khi Side B tạm thời mất kết nối (Network Outage)**: `apps/server/src/utils/handoff.ts:forwardCaseToOperations()` thử lại tối đa **2 lần** (`maxRetries=2`, không phải 3), với độ trễ cố định **500ms** giữa các lần thử (không phải exponential backoff 1s/5s/15s), timeout mỗi lần là 3s. Không có hàng đợi bền vững (Pending Outbox) nào được ghi vào DB — nếu cả 2 lần thất bại, hồ sơ vẫn ở trạng thái `forwarded` trên Side A và chỉ được bàn giao lại nếu một hành động thủ công kích hoạt lại (ví dụ đổi trạng thái lần nữa); không có cơ chế tự động quét-và-gửi-lại nền.
2. **Khi Side A tạm thời mất kết nối**: `dustguard-operations/apps/server/src/modules/integrations/syncService.ts:syncCaseToCommunity()` thực hiện **một lần gọi duy nhất, không retry** (timeout 3s, lỗi chỉ được log bằng `console.info`/`console.warn`). Tuyên bố "thử lại tối đa 5 lần" là không có trong mã nguồn.
3. **Bảo đảm tính toàn vẹn (Zero Half-Created Records)**: Đúng như mô tả — mỗi bên bọc ghi CSDL trong SQLite transaction (`sqliteClient.transaction()` / `transaction()`), đã xác minh qua đọc mã nguồn.
4. **Cập nhật ngoài thứ tự (out-of-order webhook)**: Đã kiểm chứng sống và vá trong phiên này — xem đính chính ở mục 3.2.
