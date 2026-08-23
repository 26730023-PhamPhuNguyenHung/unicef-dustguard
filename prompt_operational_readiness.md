# DUSTGUARD VN — PRODUCTION OPERATIONAL READINESS, REAL-WORLD WORKFLOW AUDIT & HARDENING

Bạn đang tiếp quản repository **DustGuard VN**.

Hiện hệ thống đã có:

- Cloudflare Worker production.
- Cloudflare D1 remote.
- R2 storage.
- Express routes / local backend.
- Frontend cho nhiều loại người dùng.
- Auth + RBAC.
- IoT telemetry.
- Risk Engine / CPS.
- Complaint.
- Inspection.
- Enforcement Case 7 bước.
- Legal Assistant.
- Contractor Portal.
- Executive Dashboard.
- Community / Youth / Impact.
- OpenAPI.
- Một lượng test tương đối lớn.
- Các API production hiện tại phần lớn trả `200 OK`.

Tuy nhiên:

> **TUYỆT ĐỐI KHÔNG ĐƯỢC xem “API trả 200”, “unit test pass” hoặc “endpoint tồn tại” là bằng chứng hệ thống đã hoàn thiện.**

Mục tiêu lần này là kiểm tra:

> **Nếu ngày mai DustGuard được đưa cho người dân, nhà thầu, cán bộ thanh tra và lãnh đạo sử dụng thật thì họ có hoàn thành được công việc từ đầu đến cuối hay không?**

Phải audit từ góc nhìn **OPERATIONS / BUSINESS WORKFLOW / REAL USER JOURNEY**, không phải chỉ từ góc nhìn backend.

---

# 0. DEFINITION OF DONE MỚI

Một chức năng chỉ được đánh dấu `DONE` khi đồng thời thỏa mãn:

1. User thực sự nhìn thấy chức năng trên UI.
2. User có thể thao tác bằng UI.
3. Frontend gọi đúng API production.
4. API validate đúng request.
5. Auth + RBAC đúng.
6. Tenant/site isolation đúng.
7. Dữ liệu được lưu thật vào D1/R2.
8. Reload trang vẫn còn dữ liệu.
9. Các màn hình liên quan phản ánh dữ liệu mới.
10. Workflow chuyển đúng trạng thái.
11. Audit log được tạo đúng.
12. Notification/task/SLA liên quan được cập nhật.
13. Người dùng khác nhìn thấy đúng phần dữ liệu được phép nhìn.
14. Không thể bypass workflow bằng gọi API trực tiếp.
15. Error state có UI xử lý.
16. Empty/loading/offline/retry state được xử lý.
17. Test được bằng dữ liệu thực hoặc seeded realistic data.
18. Flow có thể được chạy lại nhiều lần mà không làm hỏng dữ liệu.
19. Không có hardcoded/mock data giả tạo cảm giác chức năng hoạt động.
20. Có bằng chứng E2E về kết quả cuối cùng.

Nếu thiếu bất kỳ điều nào trên → **NOT DONE**.

---

# 1. KHÔNG ĐƯỢC AUDIT THEO ENDPOINT

Không làm kiểu:

```text
GET /api/sites → 200 → PASS
GET /api/cases → 200 → PASS
GET /api/complaints → 200 → PASS
```

Đó chỉ là API smoke test.

Thay vào đó phải audit theo **REAL-WORLD JOURNEY**.

Ví dụ:

```text
Người dân gửi phản ánh
→ hệ thống lưu complaint
→ upload ảnh vào R2
→ geolocation được ghi nhận
→ deduplicate nếu cần
→ cán bộ nhìn thấy complaint
→ complaint được screening
→ liên kết công trình
→ tính mức ưu tiên
→ tạo inspection/case nếu đạt điều kiện
→ cán bộ được giao xử lý
→ timeline xuất hiện
→ nhà thầu nhận yêu cầu giải trình
→ nhà thầu upload bằng chứng
→ cán bộ xem bằng chứng
→ ra quyết định
→ theo dõi khắc phục
→ đóng vụ việc
→ phản hồi lại người dân
→ dashboard lãnh đạo cập nhật KPI
→ audit trail đầy đủ
```

Chỉ khi toàn bộ flow chạy được mới PASS.

---

# 2. TRIỂN KHAI TỐI THIỂU 8 SUBAGENT

Chạy song song nhưng không sửa cùng file tùy tiện.

## Subagent 1 — Citizen Operations

Audit toàn bộ journey của người dân.

Test ít nhất:

### Flow C1 — Gửi phản ánh

Người dân:

1. mở trang phản ánh;
2. chọn vị trí;
3. nhập mô tả;
4. chọn loại vấn đề;
5. upload 1–5 ảnh;
6. gửi;
7. nhận mã phản ánh;
8. tra cứu lại;
9. xem trạng thái xử lý;
10. nhận kết quả cuối cùng.

Kiểm tra:

- form validation;
- upload thật R2;
- file metadata;
- EXIF nếu có;
- MIME validation;
- size limit;
- malicious filename;
- retry;
- duplicate submit;
- double click;
- mobile;
- GPS denied;
- network interruption;
- reload.

### Flow C2 — Theo dõi phản ánh

Test:

```text
SUBMITTED
→ RECEIVED
→ SCREENING
→ ASSIGNED
→ INSPECTING
→ ACTION_REQUIRED
→ RESOLVED
```

Hoặc state machine hiện tại nếu khác.

Phải đảm bảo UI không chỉ hiển thị status raw.

Người dân phải hiểu:

- đã tiếp nhận chưa;
- ai đang xử lý;
- dự kiến khi nào xử lý;
- đã kiểm tra chưa;
- kết quả là gì;
- có bằng chứng xử lý hay không.

---

# 3. SUBAGENT 2 — INSPECTOR / STAFF OPERATIONS

Đây là một trong những phân hệ quan trọng nhất.

Audit journey thực tế:

```text
Cán bộ đăng nhập
→ Dashboard công việc hôm nay
→ xem công trình ưu tiên
→ xem phản ánh mới
→ xem cảnh báo IoT
→ triage
→ tạo / mở hồ sơ
→ giao cán bộ
→ chuẩn bị kiểm tra
→ đi hiện trường
→ ghi nhận biên bản
→ upload ảnh/video
→ ghi chỉ số đo
→ ký / xác nhận
→ yêu cầu nhà thầu giải trình
→ đánh giá giải trình
→ đề xuất biện pháp
→ ban hành quyết định
→ follow-up
→ hoàn thành
```

Không được chỉ audit CRUD.

Phải kiểm tra **Task-oriented UI**.

Cán bộ khi mở dashboard phải biết ngay:

- việc nào phải xử lý hôm nay;
- vụ nào sắp quá SLA;
- công trình nào rủi ro cao;
- cảm biến nào offline;
- phản ánh nào chưa triage;
- vụ nào đang chờ nhà thầu;
- vụ nào đang chờ mình;
- việc nào đã quá hạn.

Nếu dashboard chỉ có số liệu thống kê → chưa đạt.

---

# 4. SUBAGENT 3 — CONTRACTOR OPERATIONS

Audit hệ thống từ phía nhà thầu.

Journey:

```text
Nhà thầu đăng nhập
→ chỉ nhìn thấy công trình của mình
→ xem risk score
→ xem nguyên nhân risk score
→ xem cảnh báo
→ xem yêu cầu từ cơ quan quản lý
→ xem deadline
→ gửi giải trình
→ upload bằng chứng
→ cập nhật biện pháp khắc phục
→ gửi hoàn thành
→ chờ cán bộ xác minh
→ nhận kết quả
```

Kiểm tra rõ:

### Contractor must know:

- Tôi đang bị yêu cầu làm gì?
- Tại sao?
- Deadline bao lâu?
- Hồ sơ nào cần nộp?
- Tôi đã nộp đủ chưa?
- Ai đang review?
- Tôi còn thiếu gì?
- Hồ sơ đang ở trạng thái nào?

Không chấp nhận UI chỉ có:

```text
Open cases: 4
Risk: 78
Alerts: 3
```

mà không có action cụ thể.

Test anti-self-verification:

```text
Contractor submit evidence
≠ Contractor close case
≠ Contractor mark verified
```

Attempt bằng cả UI và API.

---

# 5. SUBAGENT 4 — EXECUTIVE COMMAND CENTER

Audit dashboard lãnh đạo theo góc nhìn ra quyết định.

Lãnh đạo không cần CRUD.

Phải trả lời được:

1. Hôm nay khu vực nào đáng lo nhất?
2. Có bao nhiêu công trình rủi ro cao?
3. Có vụ nào quá SLA?
4. Đơn vị nào xử lý chậm?
5. Nhà thầu nào vi phạm lặp lại?
6. Cảm biến nào mất tín hiệu?
7. Xu hướng PM2.5 / PM10 tăng ở đâu?
8. Bao nhiêu phản ánh chưa xử lý?
9. Bao nhiêu vụ đang chờ giải trình?
10. Bao nhiêu vụ đã khắc phục?
11. Tác động cộng đồng ra sao?
12. Tôi cần can thiệp vào đâu?

Mỗi KPI quan trọng phải drill-down được.

Ví dụ:

```text
5 công trình Critical
```

click → danh sách 5 công trình → click site → nguyên nhân → case liên quan → evidence.

Không được có KPI “dead end”.

---

# 6. SUBAGENT 5 — IoT → RISK → ENFORCEMENT

Đây là E2E pipeline quan trọng nhất.

Không test riêng sensor endpoint.

Test full flow:

```text
ESP32 giả lập
→ telemetry POST
→ HMAC validation
→ replay protection
→ telemetry D1
→ sensor health
→ aggregate
→ threshold engine
→ CPS/risk engine
→ alert
→ dashboard
→ notification/task
→ inspection recommendation
→ enforcement workflow
```

Seed ít nhất các scenario:

### IoT-01 Normal

```text
PM2.5 = 20
PM10 = 40
```

Không sinh false alert.

### IoT-02 Warning

Giá trị tăng dần gần threshold.

UI phải phản ánh trend.

### IoT-03 QCVN exceed

Ví dụ:

```text
PM2.5 > threshold
PM10 > threshold
```

Verify:

- alert được tạo;
- site risk tăng;
- executive dashboard cập nhật;
- staff queue xuất hiện;
- SLA được tạo;
- contractor nhìn thấy alert phù hợp.

### IoT-04 Flatline

5+ packet giống nhau.

Verify:

```text
Sensor → FAULTY
Audit log → SENSOR_TAMPER_SUSPECTED
```

Và UI phải hiển thị tình trạng đó.

### IoT-05 Offline

Không gửi telemetry > liveness threshold.

Verify:

```text
Sensor → INACTIVE/OFFLINE
```

### IoT-06 Replay

Replay packet cũ.

Must reject.

### IoT-07 Bad HMAC

Must reject.

### IoT-08 Clock drift

Ngoài tolerance.

Must reject.

---

# 7. SUBAGENT 6 — CASE MANAGEMENT / ENFORCEMENT

Không chỉ kiểm tra endpoint chuyển trạng thái.

Test **state machine thật**.

Current flow:

```text
SCREENING
→ PREPARING
→ DECISION_ISSUED
→ ON_SITE
→ REPORTING
→ APPRAISING
→ COMPLETED
```

Đối với mỗi transition kiểm tra:

```text
allowed role
required fields
required documents
required evidence
timestamps
actor
previousState
nextState
audit
timeline
notifications
SLA
```

Ví dụ:

Không cho:

```text
SCREENING → COMPLETED
```

Không cho:

```text
CONTRACTOR → COMPLETED
```

Không cho:

```text
ON_SITE → APPRAISING
```

nếu chưa có inspection report bắt buộc.

Không cho hoàn tất nếu thiếu required evidence.

---

# 8. SUBAGENT 7 — DATA CONSISTENCY & SSOT

Audit remote D1 thực tế.

Tìm:

- orphan records;
- duplicated business entities;
- dangling foreign keys;
- inconsistent statuses;
- string status khác nhau;
- enum drift frontend/backend/DB;
- nullable dữ liệu không hợp lý;
- fake/mock data production;
- timestamps sai;
- timezone sai;
- deletedAt misuse;
- duplicate alerts;
- duplicate telemetry;
- impossible state.

Ví dụ:

```text
cases.status = "completed"
case_status_history latest = "APPRAISING"
```

→ DATA BUG.

Hoặc:

```text
complaint.site_id = X
site X không tồn tại
```

→ DATA BUG.

Phải lập script:

```text
scripts/audit-production-integrity.*
```

để có thể chạy lại.

---

# 9. SUBAGENT 8 — FRONTEND WORKFLOW & UX FUNCTIONALITY

Audit toàn bộ UI.

Không tập trung “đẹp”.

Tập trung:

> **Có làm được việc hay không?**

Kiểm tra từng button:

- có click được không;
- click gọi API nào;
- response xử lý ra sao;
- loading state;
- disabled state;
- success state;
- error state;
- retry;
- optimistic update;
- reload;
- deep link.

Tìm toàn bộ:

```text
TODO
mock
placeholder
coming soon
console.log
alert(...)
href="#"
onClick={() => {}}
fake data
hardcoded stat
hardcoded chart
Math.random
setTimeout mock
```

Nếu UI hiển thị chức năng nhưng backend chưa có → đánh dấu.

Nếu backend có nhưng UI không expose → đánh dấu.

---

# 10. CROSS-PERSONA END-TO-END TEST

Đây là yêu cầu quan trọng nhất.

Tạo ít nhất 5 scenario có đầy đủ nhiều actor.

## Scenario A — Citizen Complaint → Resolution

```text
Citizen
→ complaint
→ staff screening
→ case
→ inspector
→ contractor
→ evidence
→ appraisal
→ completed
→ citizen notified
→ executive KPI updated
```

---

## Scenario B — Sensor Pollution Incident

```text
IoT node
→ abnormal telemetry
→ alert
→ CPS increases
→ site critical
→ staff task
→ inspection
→ contractor action
→ follow-up telemetry improves
→ verification
→ close
```

---

## Scenario C — Contractor Non-compliance

```text
Site receives repeated violation
→ risk increases
→ contractor receives requirement
→ ignores deadline
→ SLA overdue
→ escalation
→ executive dashboard warning
```

---

## Scenario D — Sensor Tamper

```text
flatline/replay/bad signature
→ anomaly detection
→ sensor faulty
→ audit
→ staff notification
→ maintenance workflow
```

---

## Scenario E — False / Duplicate Citizen Reports

```text
multiple reports
→ similarity / same location
→ dedup
→ staff sees cluster
→ avoid creating duplicate cases
```

Nếu hệ thống chưa hỗ trợ thì document gap và triển khai solution hợp lý.

---

# 11. REALISTIC SEED DATA

Không seed kiểu:

```text
Site 1
User 1
Test Case
Foo
Bar
```

Seed dataset gần thực tế:

- 24 công trình.
- 5 công trình High/Critical.
- 18 phản ánh đang mở.
- 7 hồ sơ thiếu bằng chứng.
- nhiều nhà thầu.
- nhiều sensor.
- nhiều ward/district.
- telemetry 7–30 ngày.
- complaint history.
- SLA overdue.
- completed case.
- sensor offline.
- sensor faulty.

Các dashboard phải cùng đọc dataset này.

Không được mỗi dashboard có mock dataset riêng.

---

# 12. AUDIT ROLE MATRIX

Tạo một role matrix thực tế.

Ví dụ:

| Action | Citizen | Contractor | Inspector | Staff | Manager | Admin |
|---|---|---|---|---|---|---|
| Submit complaint | ✅ | - | - | ✅ | - | ✅ |
| View own complaint | ✅ | - | - | ✅ | ✅ | ✅ |
| Create case | - | - | ✅ | ✅ | ✅ | ✅ |
| Submit explanation | - | ✅ | - | - | - | ✅ |
| Verify contractor evidence | - | ❌ | ✅ | ✅ | ✅ | ✅ |
| Complete enforcement case | - | ❌ | depending policy | ✅ | ✅ | ✅ |

Sau đó test quyền bằng API thực tế.

Không chỉ hide button frontend.

---

# 13. ERROR / FAILURE SCENARIOS

Test ít nhất:

```text
D1 temporarily unavailable
R2 upload fail
invalid JSON
expired auth
revoked user
wrong role
deleted site
missing site
duplicate form submission
network disconnect
timeout
empty response
malformed telemetry
future timestamp
replay telemetry
large image
wrong MIME
concurrent case update
stale frontend state
```

Application không được crash hoặc tạo dữ liệu nửa vời.

---

# 14. TRANSACTION / CONSISTENCY

Kiểm tra các flow nhiều bước.

Ví dụ chuyển case:

```text
update cases
insert case_status_history
insert case_timelines
insert audit_logs
```

Nếu bước 3 fail nhưng bước 1 đã commit thì sao?

Audit toàn bộ tình huống partial failure.

Dùng transaction/batch/compensation thích hợp với D1.

Không để trạng thái “nửa hoàn thành”.

---

# 15. IDEMPOTENCY

Bắt buộc kiểm tra:

- complaint submit;
- telemetry ingest;
- upload;
- create alert;
- state transition;
- webhook/callback;
- document generation.

Double click / retry không được tạo:

```text
2 complaints
2 cases
2 alerts
2 timeline events
```

nếu business intent chỉ có một.

---

# 16. OBSERVABILITY

Production phải trả lời được:

```text
Có lỗi gì?
Lỗi ở user nào?
Site nào?
Request nào?
Flow nào?
Từ lúc nào?
```

Chuẩn hóa:

```text
requestId
correlationId
actorId
actorRole
siteId
caseId
sensorId
eventType
timestamp
duration
result
errorCode
```

Không log:

- password;
- token;
- secret;
- full HMAC secret;
- OAuth secret.

---

# 17. SLA ENGINE

Audit xem SLA có đang chỉ là field hay thật sự hoạt động.

Ví dụ:

```text
complaint received
→ screening due

pollution alert
→ inspection due

contractor explanation requested
→ explanation deadline

remediation submitted
→ verification due
```

Dashboard phải phân loại:

```text
ON_TRACK
DUE_SOON
OVERDUE
ESCALATED
```

Nếu chỉ lưu `deadline` mà không có behavior → chưa hoàn thiện.

---

# 18. NOTIFICATION / ACTION QUEUE

Đảm bảo event quan trọng tạo actionable task.

Ví dụ:

```text
New complaint
→ staff inbox

Critical sensor alert
→ inspector/manager queue

Explanation requested
→ contractor inbox

Contractor submitted evidence
→ staff review queue

SLA overdue
→ manager escalation
```

Nếu hiện chưa có notification infrastructure thì triển khai tối thiểu:

```text
notifications
tasks
```

trong D1 và expose trên UI.

Không cần email/SMS nếu chưa cần.

In-app task center là đủ cho MVP.

---

# 19. AUDIT DASHBOARD TÍNH TOÁN

Đối với từng KPI:

Trace được:

```text
UI KPI
↓
API
↓
query
↓
table
↓
raw rows
```

Không được:

```text
hardcoded
Math.random()
mock
fallback constant
```

Tạo automated assertion.

Ví dụ:

```text
executive.highRiskSites
===
COUNT(sites WHERE risk >= threshold)
```

---

# 20. AUDIT CPS / RISK ENGINE

Kiểm tra tính giải thích được.

Frontend phải có:

```text
Risk 82/100
```

và breakdown:

```text
Telemetry           +X
Citizen complaints  +X
Inspection history  +X
Compliance history  +X
Evidence integrity  +X
```

Không được chỉ trả một con số.

Test boundary:

```text
0
1
49
50
74
75
99
100
```

Không được >100 hoặc <0.

---

# 21. DATABASE MIGRATION SAFETY

Audit:

```text
local schema
remote D1 schema
migration files
repository assumptions
production queries
```

Phải đảm bảo DB mới hoàn toàn có thể:

```bash
apply migrations
seed
start server
run E2E
```

mà không cần sửa tay database.

Nếu production đã từng sửa cột trực tiếp thì phải backfill migration tương ứng.

---

# 22. OPENAPI CONTRACT

So sánh:

```text
OpenAPI
↔ Worker route
↔ Express route
↔ Frontend client
↔ tests
```

Tìm contract drift.

Ví dụ frontend kỳ vọng:

```json
{ "data": [] }
```

nhưng API trả:

```json
[]
```

Không chấp nhận “frontend workaround” để che contract sai.

---

# 23. WORKER VS EXPRESS DRIFT

Đây là nguy cơ lớn.

Audit:

```text
server/worker.js
server/routes/*
```

Xác định:

- đâu là production runtime;
- Express để làm gì;
- business logic nào duplicate;
- route nào chỉ tồn tại Express;
- route nào chỉ Worker có;
- logic nào khác nhau.

Mục tiêu:

```text
Domain logic = reusable modules
Adapters:
    Worker
    Express
```

Không để hai backend phát triển thành hai sản phẩm khác nhau.

---

# 24. SECURITY NEGATIVE TESTS

Không chỉ test happy path.

Test:

```text
Citizen đọc complaint người khác
Contractor đọc site contractor khác
Contractor sửa site khác
Inspector truy cập admin API
Contractor close case
Contractor forge evidence ownership
Change URL id manually
Change request body userId
Change siteId
Replay signed telemetry
Upload executable
Path traversal filename
SQL injection
Oversized payload
```

Expected:

```text
401 / 403 / 404 / 409 / 422
```

phù hợp semantics.

---

# 25. UX ACTIONABILITY AUDIT

Mỗi màn hình phải trả lời:

> “Người dùng vào đây để làm gì?”

Nếu không trả lời rõ → redesign.

Ví dụ Staff Dashboard:

KHÔNG ưu tiên:

```text
Total sites
Total users
Total cases
```

ƯU TIÊN:

```text
5 việc cần xử lý ngay
3 case quá SLA
2 sensor offline
4 contractor submissions chờ review
```

Stats chỉ là secondary.

---

# 26. MOBILE OPERATIONS

Citizen và inspector có khả năng dùng điện thoại.

Audit breakpoint:

```text
360
390
430
768
1024
1440
```

Đặc biệt:

- complaint form;
- camera upload;
- GPS;
- inspection checklist;
- evidence upload;
- case timeline.

Không được overflow, chữ rớt dòng sai, button bị che, modal vượt màn hình.

---

# 27. TEST PRODUCTION-LIKE

Không được chỉ:

```bash
npm test
```

Phải chạy:

```text
unit
integration
contract
RBAC
database
E2E
production-smoke
cross-persona
```

Và chạy trực tiếp against production/staging Worker khi an toàn.

Không được mutate dữ liệu thật nguy hiểm.

Dùng namespace/test tenant hoặc seeded test identities nếu cần.

---

# 28. BẮT BUỘC LẬP TRACEABILITY MATRIX

Tạo file:

```text
docs/OPERATIONAL_TRACEABILITY_MATRIX.md
```

Format:

| Workflow | Actor | UI | API | D1/R2 | State | Audit | Test | Status |
|---|---|---|---|---|---|---|---|---|

Ví dụ:

```text
Citizen submit complaint
Citizen
/complaints/new
POST /api/complaints
complaints + R2
SUBMITTED
COMPLAINT_CREATED
e2e-citizen-01
PASS
```

Mỗi chức năng production phải có trace.

---

# 29. TẠO REAL-WORLD ACCEPTANCE TEST

Tạo:

```text
docs/REAL_WORLD_ACCEPTANCE_TEST.md
```

Không viết theo endpoint.

Viết theo nhiệm vụ người dùng.

Ví dụ:

### Acceptance 01

Given:

```text
Một citizen chưa đăng nhập
```

When:

```text
gửi phản ánh có 3 ảnh
```

Then:

```text
complaint được tạo
R2 có 3 objects
citizen nhận tracking code
staff dashboard tăng queue +1
audit log có event
```

---

# 30. BẮT BUỘC SỬA LỖI, KHÔNG CHỈ REPORT

Workflow:

```text
AUDIT
→ FIND GAP
→ ROOT CAUSE
→ FIX
→ TEST
→ E2E RETEST
→ DOCUMENT
```

Không được dừng ở:

> “Đã xác định vấn đề.”

Nếu có thể sửa an toàn thì sửa luôn.

---

# 31. KHÔNG OVERENGINEER

DustGuard là MVP / Final Project thực chiến.

Không tự ý thêm:

- Kafka;
- Kubernetes;
- microservices;
- Durable Objects;
- Redis;
- ElasticSearch;
- paid infrastructure;
- unnecessary third-party SaaS.

Ưu tiên stack hiện tại:

```text
Cloudflare Workers
D1
R2
React
existing libraries
Web Crypto
```

Giữ chi phí thấp.

---

# 32. ƯU TIÊN BUSINESS VALUE

Xếp severity:

### P0 — System cannot operate

Ví dụ:

- user không hoàn thành journey;
- data corruption;
- privilege escalation;
- case workflow broken;
- upload mất;
- dashboard fake.

### P1 — Core operation seriously degraded

Ví dụ:

- SLA không hoạt động;
- no task queue;
- contractor không biết cần làm gì;
- executive KPI không drill-down.

### P2 — Operational friction

Ví dụ:

- poor error UX;
- inconsistent filters;
- missing loading state.

### P3 — Cosmetic

Làm cuối cùng.

---

# 33. SAU KHI AUDIT, HÃY TỰ ĐỘNG HARDEN KIẾN TRÚC

Ưu tiên kiến trúc:

```text
UI
↓
Typed API Client
↓
API Adapter
↓
Application Service
↓
Domain Logic
↓
Repository
↓
D1 / R2
```

Không nhét thêm business logic vào:

```text
worker.js
React component
route handler
```

nếu logic đó cần dùng nhiều nơi.

---

# 34. BẮT BUỘC KIỂM TRA FRONTEND KHÔNG CÒN MOCK

Search toàn repo:

```text
mock
demoData
fakeData
sampleData
fixture
Math.random
setTimeout
placeholder
TODO
comingSoon
hardcoded
```

Phân loại:

```text
TEST_ONLY
DEMO_ALLOWED
PRODUCTION_BUG
```

Xóa production mock.

---

# 35. FINAL ACCEPTANCE SCENARIO

Cuối cùng chạy lại một scenario hoàn chỉnh:

```text
1. Node IoT gửi PM10 vượt chuẩn.
2. Telemetry được xác thực HMAC.
3. D1 ghi reading.
4. Risk Engine recalculates site.
5. Alert được tạo.
6. Site lên High/Critical.
7. Staff dashboard xuất hiện task.
8. Inspector mở site.
9. Inspector tạo / cập nhật case.
10. Case đi qua workflow hợp lệ.
11. Contractor nhận yêu cầu.
12. Contractor submit explanation + evidence.
13. Inspector review.
14. Follow-up inspection.
15. Sensor reading trở lại bình thường.
16. Inspector xác minh.
17. Case completed.
18. Audit trail đầy đủ.
19. Executive dashboard cập nhật.
20. Citizen-facing/public data cập nhật nếu thuộc phạm vi công khai.
```

Sau đó kiểm tra trực tiếp D1:

```text
telemetry
alerts
sites
cases
case_timelines
case_status_history
audit_logs
tasks
notifications
evidence
```

Tất cả phải consistent.

---

# 36. DELIVERABLE CUỐI CÙNG

Không trả lời kiểu:

> “All APIs PASS 100%.”

Tôi cần report:

## A. Operational Readiness Score

```text
Citizen Workflow            xx/100
Staff Workflow              xx/100
Contractor Workflow         xx/100
Executive Workflow          xx/100
IoT Pipeline                xx/100
Enforcement                 xx/100
RBAC                        xx/100
Data Integrity              xx/100
Frontend Functionality      xx/100
Production Reliability      xx/100
```

## B. Real E2E Results

```text
PASS
PARTIAL
FAIL
BLOCKED
```

cho từng user journey.

## C. Bugs fixed

Mỗi bug:

```text
severity
root cause
files changed
solution
test
result
```

## D. Remaining gaps

Không che giấu.

## E. Production evidence

Đưa:

- commands;
- test output;
- response excerpts;
- DB verification;
- screenshots nếu environment hỗ trợ.

## F. Architecture changes

Liệt kê thay đổi thực sự.

## G. Final verdict

Chỉ chọn một:

```text
READY FOR REAL OPERATION
READY WITH KNOWN LIMITATIONS
NOT READY FOR REAL OPERATION
```

Và giải thích bằng bằng chứng.

---

# NGUYÊN TẮC CUỐI CÙNG

Từ thời điểm này:

```text
200 OK ≠ Feature works
Unit test pass ≠ Workflow works
Endpoint exists ≠ Product works
Database row exists ≠ User can operate
Dashboard renders ≠ Dashboard is useful
```

Tiêu chuẩn duy nhất:

> **Một người dùng thật, với đúng quyền của họ, có thể hoàn thành công việc thật từ đầu đến cuối, dữ liệu nhất quán, không bypass được quy trình, và các actor tiếp theo nhận được đúng công việc cần xử lý.**

Hãy triển khai nhiều subagent để audit song song, sau đó tổng hợp root cause, lập implementation plan theo P0 → P1 → P2, **sửa trực tiếp**, chạy lại toàn bộ cross-persona E2E và chỉ nghiệm thu khi các workflow thực tế hoạt động.

Không được tuyên bố `100% hoàn thiện` chỉ dựa trên endpoint health check.