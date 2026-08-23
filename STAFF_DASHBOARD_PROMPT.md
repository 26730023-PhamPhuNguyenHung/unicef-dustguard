# MASTER PROMPT — AUDIT, RE-ARCHITECT & FIX TOÀN BỘ DUSTGUARD STAFF DASHBOARD

Bạn đang làm việc trực tiếp trên codebase **DustGuard VN**.

Nhiệm vụ lần này KHÔNG phải chỉnh vài component UI riêng lẻ.

Hãy coi đây là một đợt:

> **Product Architecture Audit + Information Architecture Redesign + Domain Flow Hardening + Backend/API Audit + UI/UX Refactor + E2E Verification**

cho toàn bộ khu vực:

`/staff/*`

Mục tiêu cuối cùng là biến Dashboard Thanh tra hiện tại thành một **Environmental Enforcement Operations Console** thực sự hoạt động được:

**Sensor / Citizen Signal → Risk → Alert → Triage → Inspection → Case → Evidence → Legal Basis → Remediation → SLA → Closure → Audit Trail**

---

# 0. NGUYÊN TẮC LÀM VIỆC

Không được bắt đầu bằng việc sửa CSS.

Trước tiên phải hiểu:

1. domain hiện tại;
2. architecture hiện tại;
3. API đang tồn tại;
4. database schema;
5. routes;
6. repositories/services/domain;
7. frontend data flow;
8. mock data;
9. authentication/authorization;
10. những luồng nào thực sự chạy và những luồng nào chỉ có UI.

Tận dụng tối đa architecture tốt đã có.

Không rewrite toàn bộ project chỉ vì muốn code “đẹp hơn”.

Ưu tiên:

- reuse;
- consolidate;
- refactor;
- harden;
- remove duplication;
- hoàn thiện feature còn dang dở.

Chỉ thay architecture khi architecture hiện tại thực sự gây lỗi hoặc phá domain boundary.

---

# 1. CHẠY AUDIT BẰNG SUBAGENT TRƯỚC

Tạo các subagent độc lập để audit song song.

## Subagent A — Product / Workflow Auditor

Audit toàn bộ `/staff/*`.

Trả lời:

- Người dùng staff thực sự cần làm những công việc nào?
- Menu hiện tại có phản ánh workflow không?
- Có trang nào trùng chức năng?
- Có trang nào là “feature showcase” thay vì operational tool?
- Có bước nghiệp vụ nào đang mất?
- Có trang nào không biết bước tiếp theo phải làm gì?
- Có dữ liệu nào nằm cô lập?

Đặc biệt audit flow:

`site → sensor → reading → risk → alert → complaint → inspection → evidence → legal → remediation → closure`

---

## Subagent B — Backend / API Auditor

Scan:

- API routes;
- worker/server;
- repositories;
- services;
- domain;
- D1;
- R2;
- event/risk engine;
- alert engine;
- complaint flow;
- inspection flow;
- evidence;
- AI/legal;
- settings.

Liệt kê:

- endpoint thật;
- endpoint chết;
- endpoint duplicated;
- endpoint chỉ trả mock;
- endpoint frontend gọi sai;
- API contract mismatch;
- missing validation;
- missing pagination;
- missing filtering;
- missing authorization;
- lỗi N+1;
- race conditions;
- business logic nằm nhầm controller/component.

---

## Subagent C — Frontend / State Auditor

Audit:

- routes;
- layouts;
- components;
- hooks;
- API client;
- caching;
- query state;
- loading state;
- error state;
- empty state;
- mutations;
- forms;
- responsive.

Tìm:

- hard-coded values;
- mock arrays;
- fake KPI;
- duplicated fetch;
- component quá lớn;
- page tự định nghĩa business logic;
- inconsistent status mapping;
- inconsistent colors;
- inconsistent typography;
- broken responsive layout.

---

## Subagent D — Data Integrity Auditor

Kiểm tra nguồn dữ liệu của tất cả KPI.

Không được để trường hợp:

API fail

nhưng dashboard lại hiện:

- `0 alerts`;
- `100% SLA`;
- `0h average resolution`.

Đây là false information.

Phân biệt rõ:

- `loading`;
- `healthy`;
- `empty`;
- `degraded`;
- `unavailable`;
- `stale`.

Audit:

- timestamps;
- sensor liveness;
- integrity score;
- flatline detection;
- risk score;
- stale reading;
- location;
- duplicate readings;
- complaint linkage.

---

## Subagent E — UX / Design System Auditor

Audit toàn bộ Staff dashboard.

Kiểm tra:

- navigation;
- hierarchy;
- density;
- card consistency;
- table usability;
- typography;
- whitespace;
- responsive;
- filters;
- action placement;
- semantic color;
- empty state;
- error state;
- command/search bar.

DustGuard dùng:

### Brand

Primary:

`DustGuard Red`

Không biến toàn bộ application thành màu xanh.

Màu xanh chỉ dùng semantic:

- healthy;
- resolved;
- compliant;
- online.

Màu vàng/cam:

- warning;
- near SLA;
- pending.

Đỏ:

- brand;
- critical;
- violation;
- overdue;
- danger.

Không sử dụng màu semantic một cách tùy tiện.

---

## Subagent F — Security / RBAC Auditor

Audit:

- authentication;
- staff authorization;
- role;
- permission;
- admin settings;
- API secrets;
- AI provider keys;
- mutation permission;
- audit logging.

Không để frontend quyết định quyền truy cập.

---

## Subagent G — QA / E2E Auditor

Xây dựng ma trận:

`UI action → API → domain/service → DB → response → UI`

Kiểm tra từng flow.

Không chỉ test component.

---

# 2. SAU AUDIT — TỔNG HỢP FINDINGS

Tạo:

`docs/audits/staff-dashboard-audit.md`

Phân loại findings:

## P0 — Broken

Ví dụ:

- page không gọi được API;
- mutation không persist;
- dữ liệu sai;
- security issue;
- invalid risk scoring.

## P1 — Workflow failure

Ví dụ:

- alert không thể tạo inspection;
- complaint không link case;
- evidence không gắn được violation.

## P2 — UX / architecture debt

Ví dụ:

- navigation;
- duplicate screens;
- information hierarchy.

## P3 — polish

Animation, microcopy, icon refinement.

Mỗi issue ghi:

- location;
- current behavior;
- expected behavior;
- root cause;
- proposed fix.

---

# 3. TÁI THIẾT KẾ INFORMATION ARCHITECTURE

Sidebar hiện tại:

- Công trình
- Bản đồ
- Phản ánh
- Cảnh báo & SLA
- AI Pháp lý
- Cấu hình

đang chia theo module kỹ thuật.

Hãy chuyển sang workflow-oriented IA.

Đề xuất:

# 1. TỔNG QUAN

`/staff`

Command Center.

Hiển thị:

- Active incidents
- Critical sites
- New complaints
- SLA at risk
- Sensors offline
- inspections today
- remediation overdue

và:

### Priority Queue

Danh sách công việc staff cần xử lý ngay.

---

# 2. GIÁM SÁT

## `/staff/monitoring`

Bao gồm:

### Sites

Công trình / địa điểm.

### Sensors

Node IoT.

### Live readings

PM1 / PM2.5 / PM10 / nhiệt độ / độ ẩm.

### Map

GIS.

Không để Map thành một hệ thống độc lập.

Map chỉ là một view của monitoring data.

Tabs:

- List
- Map
- Sensors
- Hotspots

---

# 3. INCIDENTS

## `/staff/incidents`

Đây là trung tâm xử lý.

Incident có thể sinh từ:

- sensor threshold;
- anomaly engine;
- citizen complaint;
- manual staff report;
- inspection.

Một incident phải gom được tất cả evidence liên quan.

Status:

`NEW`

→ `TRIAGED`

→ `ASSIGNED`

→ `INSPECTING`

→ `REMEDIATION_REQUIRED`

→ `MONITORING`

→ `RESOLVED`

→ `CLOSED`

---

# 4. PHẢN ÁNH CÔNG DÂN

## `/staff/complaints`

Complaint không phải workflow riêng hoàn toàn.

Complaint là một `signal`.

Sau triage:

- link vào incident hiện tại;
- hoặc create incident mới;
- hoặc mark duplicate;
- hoặc reject có lý do.

Detail side panel cần hiển thị:

- người gửi;
- thời gian;
- vị trí;
- description;
- photo/video;
- nearby site;
- nearby sensors;
- related incidents;
- AI classification;
- action history.

CTA:

`Tạo incident`

hoặc:

`Liên kết incident`

---

# 5. THANH TRA / KIỂM TRA

## `/staff/inspections`

Quản lý:

- inspection queue;
- assigned inspector;
- checklist;
- observations;
- evidence;
- violation;
- recommendation.

Một inspection phải link:

`incident_id`

và:

`site_id`

---

# 6. CASES / HỒ SƠ XỬ LÝ

## `/staff/cases`

Case là hồ sơ enforcement hoàn chỉnh.

Bao gồm:

### Overview

### Timeline

### Measurements

### Complaints

### Inspections

### Evidence

### Legal basis

### Actions

### Remediation

### Audit log

Case ID phải là SSOT.

---

# 7. SLA & REMEDIATION

## `/staff/sla`

Không gom tất cả Alert vào đây.

SLA dashboard chỉ quản lý:

- response deadline;
- inspection deadline;
- remediation deadline;
- overdue items;
- escalation.

---

# 8. AI & PHÁP LÝ

## `/staff/legal`

Không thiết kế giống playground AI.

AI phải nằm trong workflow nghiệp vụ.

Các chức năng:

### Legal Search

Tra cứu quy định.

### Regulation Analyzer

Upload văn bản.

### Case Assistant

AI đọc:

- case;
- evidence;
- measurements;
- inspection findings.

Sau đó đề xuất:

- possible violation;
- relevant regulation;
- checklist;
- draft action.

### Draft Generator

Sinh:

- inspection note;
- remediation request;
- violation report.

AI chỉ là:

`decision support`.

Không được tự động ra quyết định hành chính.

Tất cả AI recommendation phải:

`Human approval required`.

---

# 9. ADMIN

## `/staff/admin`

Chỉ admin mới thấy.

Bao gồm:

### System

### Users & roles

### Sensor configuration

### Thresholds

### AI Gateway

### Integrations

### Audit log

Không để các cấu hình kỹ thuật nhạy cảm xuất hiện với staff thông thường.

---

# 4. THIẾT KẾ DOMAIN MODEL LẠI

Không tạo domain mới nếu project hiện tại đã có entity tương ứng.

Chuẩn hóa tối thiểu:

```text
Site
Sensor
SensorReading

RiskAssessment
Alert

Complaint
Incident

Inspection
Observation
Evidence

Violation
LegalReference

RemediationAction
SLARecord

Case

User
Role

AuditEvent
```

Quan hệ:

```text
Site
 ├── Sensors
 ├── Complaints
 ├── Incidents
 └── Inspections

Incident
 ├── Alerts
 ├── Complaints
 ├── SensorReadings
 ├── Inspections
 ├── Evidence
 └── Case

Case
 ├── Incident
 ├── Evidence
 ├── LegalReferences
 ├── Violations
 ├── RemediationActions
 └── AuditEvents
```

---

# 5. SỬA RISK MODEL

Hiện screenshot xuất hiện:

`Risk score = 154`

trong khi dashboard trước đó định hướng score:

`0–100`.

Phải audit.

Chỉ có một SSOT:

```ts
type RiskScore = number // 0..100
```

Nếu muốn biểu diễn raw score thì:

```text
rawRiskValue
normalizedRiskScore
riskLevel
```

Không được dùng lẫn.

Risk level:

```text
0–29    LOW
30–49   MODERATE
50–69   HIGH
70–84   VERY_HIGH
85–100  CRITICAL
```

Hoặc dùng threshold hiện có nếu domain đã định nghĩa.

Quan trọng:

Một implementation duy nhất.

Không tính lại score tại UI.

---

# 6. RISK EXPLAINABILITY

Risk card không chỉ hiện số.

Phải giải thích:

```text
Risk 86 / Critical

PM10           +32
Repeated event +18
Complaint      +12
Near school    +14
Sensor trust   +10
```

Người thanh tra cần biết:

> Tại sao hệ thống ưu tiên site này?

Không tạo black-box score.

---

# 7. SENSOR HEALTH

Tách:

### Pollution status

và:

### Device health.

Ví dụ:

```text
Air quality: CRITICAL
Sensor health: HEALTHY
```

Không đánh đồng sensor offline với pollution safe.

Status thiết bị:

```text
ONLINE
STALE
INACTIVE
FAULTY
MAINTENANCE
```

Liveness:

15 phút nếu đó là rule hiện tại.

Flatline:

5 readings giống nhau nếu đó là rule hiện tại.

Tận dụng integrity engine hiện tại nếu đã có.

---

# 8. ALERT ENGINE

Alert là machine/system generated event.

Không biến alert thành case.

Flow:

```text
SensorReading
      ↓
RiskAssessment
      ↓
Alert
      ↓
Triage
      ↓
Incident
```

Một incident có thể chứa nhiều alert.

---

# 9. COMMAND CENTER

Trang `/staff` mới cần tối giản nhưng operational.

Header:

```text
DustGuard Operations
Giám sát & xử lý rủi ro môi trường
```

Summary:

```text
Critical incidents
SLA at risk
New complaints
Sensors offline
```

Không dùng KPI vô nghĩa chỉ để lấp card.

Tiếp theo:

## Priority Queue

```text
Priority
Site
Trigger
Risk
SLA
Assigned
Action
```

Sau đó:

## Map / Hotspots

## Recent activity

Mục tiêu:

staff mở dashboard là biết ngay:

> Tôi phải xử lý cái gì tiếp theo?

---

# 10. SITE PAGE

Hiện tại page Công trình chủ yếu là một bảng.

Refactor thành:

```text
Sites
```

Summary:

- total sites;
- critical;
- warning;
- healthy;
- sensors offline.

Table:

```text
Site
Location
Current PM10
Risk
Sensor health
Open incidents
Last reading
Status
```

Click site:

`/staff/sites/:siteId`

Tabs:

### Overview

### Sensors

### Readings

### Incidents

### Complaints

### Inspections

### Evidence

### Timeline

---

# 11. GIS

GIS phải dùng chung SSOT với site/incident.

Không hard-code:

```text
4 schools
2 hospitals
500 population
```

nếu chưa có data source.

Nếu chưa có dữ liệu thật:

hiện:

```text
Boundary / population dataset unavailable
```

không invent metric.

GIS layers:

- Sites
- Sensors
- Alerts
- Incidents
- Complaints
- Schools
- Hospitals
- Sensitive areas

Filters:

```text
Risk
Time range
Site
Sensor status
Incident status
```

---

# 12. COMPLAINTS

Không giữ layout master-detail nhưng panel phải hữu dụng.

Danh sách:

```text
Complaint
Location
Reported
Nearby site
AI category
Risk
Status
```

Detail panel:

```text
Description
Attachments
Location
Nearby sensor readings
Related site
Related incident
History
```

Actions:

```text
Create incident
Link incident
Assign
Reject
Mark duplicate
```

---

# 13. ALERT & SLA

Screenshot hiện tại:

API fail

nhưng UI vẫn hiển thị:

```text
0
0
0
100%
0h
```

CẤM.

Khi API unavailable:

summary cards phải:

```text
—
Data unavailable
```

và component:

```text
Monitoring service unavailable
Last successful sync: ...
Retry
```

Không tính SLA 100% từ dataset rỗng.

---

# 14. AI LEGAL

Trang hiện tại đang giống 4 module showcase.

Refactor thành contextual assistant.

Layout:

### Left

Case / regulation context.

### Main

AI analysis.

### Right

Evidence / citations / approval.

AI output phải structured:

```text
Finding

Possible violation

Legal basis

Evidence supporting this finding

Confidence

Missing evidence

Recommended next action
```

Không được tạo căn cứ pháp lý không có nguồn.

Nếu retrieval không tìm thấy:

```text
Insufficient legal source
```

AI không được hallucinate nghị định/thông tư.

---

# 15. SETTINGS

Không để System Settings thành form tổng hợp tất cả.

Tách:

```text
General
Sensors
Risk thresholds
Notifications
AI providers
Users & RBAC
Security
Audit
```

AI Gateway:

không expose secret.

Hiện:

```text
Provider connected
Model
Last test
Latency
Status
```

Có:

`Test connection`

không display API key.

---

# 16. SIDEBAR MỚI

Desktop:

```text
Tổng quan

GIÁM SÁT
  Monitoring
  Sites

XỬ LÝ
  Incidents
  Complaints
  Inspections
  Cases

TUÂN THỦ
  SLA
  AI & Pháp lý

HỆ THỐNG
  Admin
```

Không cần >10 mục top-level.

Có thể group/collapse.

---

# 17. DESIGN SYSTEM

Giữ giao diện:

- clean;
- government-tech;
- environmental monitoring;
- operational dashboard;
- information dense;
- premium;
- restrained.

Không:

- gradient rực;
- glassmorphism;
- giant title;
- marketing landing page UI;
- card trong card quá nhiều;
- border vàng nhạt khắp nơi;
- icon emoji không đồng nhất.

---

# 18. BRAND COLOR

Dùng CSS token.

Ví dụ:

```css
--brand-50
--brand-100
--brand-500
--brand-600
--brand-700
--brand-900
```

DustGuard brand:

dark crimson / red.

Green KHÔNG phải primary CTA.

Green chỉ semantic success.

Primary button:

DustGuard Red.

Active sidebar:

light red tint.

---

# 19. SEMANTIC COLOR

Centralize:

```ts
statusTokens = {
  critical,
  danger,
  warning,
  info,
  success,
  neutral
}
```

Không component nào tự invent color.

---

# 20. TYPOGRAPHY

Desktop:

```text
Page title        24–28
Section title     18–20
Card heading      14–16
Body              14
Metadata          12–13
```

Không dùng text quá lớn.

Dashboard ưu tiên density.

---

# 21. LAYOUT SYSTEM

Một shell duy nhất:

```text
AppShell
 ├─ Sidebar
 ├─ Topbar
 └─ Content
```

Content:

```css
max-width: 1600px;
width: 100%;
```

Spacing scale duy nhất:

```text
4 / 8 / 12 / 16 / 24 / 32
```

Không page tự đặt width/margin tùy ý.

---

# 22. RESPONSIVE

Phải test:

```text
1920
1600
1440
1280
1024
768
430
390
```

Tablet:

sidebar collapse.

Mobile:

- cards stack;
- table → cards hoặc horizontal scroll có chủ đích;
- filters bottom sheet;
- detail side panel → full-screen sheet.

Không để chữ rớt từng từ.

---

# 23. TABLE COMPONENT

Tạo một reusable DataTable.

Support:

- sorting;
- filtering;
- pagination;
- loading;
- error;
- empty;
- column visibility;
- row click;
- keyboard navigation.

Không mỗi page implement table riêng.

---

# 24. FILTER STATE

Filters phải sync URL.

Ví dụ:

```text
/staff/incidents?status=critical&district=cau-giay
```

Reload không mất state.

---

# 25. API CLIENT

Không fetch trực tiếp lung tung trong component.

Tạo standardized:

```text
/api-client
/query
/mutations
```

Response contract thống nhất:

```ts
{
  data,
  meta?,
  error?
}
```

Error có:

```text
code
message
requestId
```

---

# 26. QUERY / CACHE

Nếu project đã dùng TanStack Query thì tiếp tục.

Nếu chưa có nhưng architecture cho phép, có thể bổ sung.

Chuẩn hóa:

```text
query keys
staleTime
retry
invalidate
optimistic updates
```

Không refetch cả application sau mỗi mutation.

---

# 27. LOADING / EMPTY / ERROR

Mọi data-driven component phải có 4 states:

```text
loading
success
empty
error
```

Không dùng:

```ts
data || []
```

rồi biến API lỗi thành empty dataset.

---

# 28. MOCK DATA

Tìm toàn bộ:

```text
mock
dummy
sample
demo
fake
hardcoded
Math.random
setTimeout
```

Phân loại.

Production path:

KHÔNG dùng mock.

Nếu cần demo:

```text
DEMO_MODE=true
```

và adapter riêng.

Không mix demo data với production repository.

---

# 29. DB / REPOSITORY

Frontend không được biết D1.

Route không viết query SQL trực tiếp nếu repository abstraction hiện hữu.

Flow:

```text
route
↓
application/service
↓
repository
↓
D1/R2
```

Business rules:

domain/service.

---

# 30. AUDIT TRAIL

Những hành động sau phải ghi audit:

- assign;
- status change;
- create incident;
- merge complaint;
- add evidence;
- legal approval;
- remediation;
- close case;
- settings change.

Audit event:

```text
actor
action
entity
entityId
timestamp
metadata
```

---

# 31. ACTIVITY TIMELINE

Case, site và incident phải dùng một activity/timeline abstraction chung.

Ví dụ:

```text
14:02 Sensor threshold exceeded
14:04 Alert generated
14:08 Complaint received
14:15 Incident created
14:22 Assigned Nguyễn Văn A
15:02 Inspection started
```

---

# 32. RBAC

Tối thiểu:

```text
ADMIN
SUPERVISOR
INSPECTOR
ANALYST
VIEWER
```

Permission server-side.

Ví dụ:

ADMIN:
full.

SUPERVISOR:
assign + review + close.

INSPECTOR:
inspection/evidence/update assigned case.

ANALYST:
analysis/legal/support.

VIEWER:
read.

---

# 33. SEARCH / COMMAND BAR

Search bar hiện tại không được chỉ để trang trí.

Global search:

```text
site
incident
complaint
case
sensor
```

Command palette:

`Ctrl/Cmd + K`.

Nếu chưa implement được đầy đủ:

bỏ shortcut giả.

---

# 34. BACKEND HEALTH

Thêm endpoint:

```text
/api/health
```

hoặc tận dụng endpoint hiện tại.

Check:

- API;
- D1;
- R2;
- AI optional.

Frontend top-level chỉ cảnh báo khi thật sự cần.

Không spam error banner trên từng page.

---

# 35. OBSERVABILITY

Standardize:

```text
requestId
structured logs
error code
route
latency
```

Không log secrets.

---

# 36. API CONTRACT TEST

Mỗi endpoint quan trọng phải có test.

Ví dụ:

```text
GET /sites
GET /sites/:id
GET /sensors
GET /incidents
POST /incidents
PATCH /incidents/:id
GET /complaints
POST complaint → incident
GET /cases/:id
POST evidence
GET /sla
```

Dùng route thực tế của project nếu naming khác.

Không tạo duplicate endpoint chỉ vì prompt này dùng tên khác.

---

# 37. FULL E2E FLOW

Bắt buộc test:

## FLOW 1 — IoT

```text
fake sensor adapter
→ POST reading
→ DB
→ integrity check
→ risk engine
→ alert
→ dashboard
```

Verify UI nhìn thấy reading.

---

## FLOW 2 — Risk

Inject PM10 vượt ngưỡng.

Verify:

```text
risk generated
alert generated
site risk updated
priority queue updated
map updated
```

---

## FLOW 3 — Complaint

```text
citizen complaint
→ staff inbox
→ triage
→ create incident
→ link site
```

---

## FLOW 4 — Inspection

```text
incident
→ assign inspector
→ inspection
→ checklist
→ evidence
→ finding
```

---

## FLOW 5 — Legal

```text
case
→ legal assistant
→ retrieve regulation
→ AI recommendation
→ human approval
```

---

## FLOW 6 — Remediation

```text
violation
→ remediation action
→ SLA
→ status update
→ resolved
```

---

## FLOW 7 — Failure mode

Simulate:

```text
API offline
AI unavailable
sensor stale
R2 unavailable
```

UI phải degrade đúng.

Không crash.

Không fake KPI.

---

# 38. TEST REQUIREMENTS

Chạy toàn bộ test hiện có trước.

Sau refactor chạy lại.

Bổ sung:

```text
unit
domain
repository
API integration
frontend component
E2E
```

Các invariant bắt buộc:

```text
riskScore >= 0 && <= 100
```

```text
resolved incident cannot have active overdue SLA
```

```text
closed case requires closure reason
```

```text
complaint cannot silently disappear
```

```text
sensor offline != site safe
```

---

# 39. MIGRATION — KHÔNG BIG BANG

Sau audit tạo:

`docs/plans/staff-dashboard-rearchitecture.md`

Plan theo phase:

## Phase 0

Baseline + tests.

## Phase 1

Data correctness / API.

## Phase 2

Domain consolidation.

## Phase 3

Navigation + AppShell.

## Phase 4

Monitoring.

## Phase 5

Incidents / complaints / inspections.

## Phase 6

Cases / SLA.

## Phase 7

AI Legal.

## Phase 8

Admin.

## Phase 9

Responsive / accessibility.

## Phase 10

Full E2E.

Sau khi viết plan:

**TIẾP TỤC IMPLEMENT NGAY.**

Không dừng ở việc viết report.

---

# 40. KHÔNG ĐƯỢC LÀM

Không:

- chỉ viết kế hoạch;
- chỉ sửa UI;
- chỉ redesign Figma;
- rewrite toàn app;
- duplicate architecture;
- tạo API v2 không cần thiết;
- hard-code data;
- thêm dependency lớn không cần thiết;
- dùng green làm brand;
- fake KPI;
- fake AI success;
- fake legal reference;
- suppress API error;
- bỏ test failing rồi declare done.

---

# 41. CLEANUP

Sau khi migration hoàn tất:

xóa:

- dead code;
- old page;
- duplicate component;
- unused hook;
- mock production data;
- unused CSS;
- obsolete routes.

Nhưng chỉ xóa khi đã xác nhận không còn dependency.

---

# 42. DEFINITION OF DONE

Chỉ được đánh dấu hoàn tất khi:

- [ ] Staff dashboard có workflow rõ ràng.
- [ ] Navigation phản ánh workflow nghiệp vụ.
- [ ] Monitoring lấy dữ liệu thật.
- [ ] Map dùng cùng SSOT.
- [ ] Risk score có duy nhất một implementation.
- [ ] Risk score nằm trong range hợp lệ.
- [ ] Risk explainable.
- [ ] Complaint → incident chạy.
- [ ] Incident → inspection chạy.
- [ ] Inspection → evidence chạy.
- [ ] Case tổng hợp được toàn bộ dữ liệu.
- [ ] SLA lấy dữ liệu thật.
- [ ] API error không trở thành KPI giả.
- [ ] AI Legal dùng contextual case data.
- [ ] AI có Human-in-the-loop.
- [ ] Admin RBAC server-side.
- [ ] Audit trail hoạt động.
- [ ] Không còn production mock data.
- [ ] Desktop responsive ổn.
- [ ] Tablet responsive ổn.
- [ ] Mobile responsive ổn.
- [ ] Không có text overflow.
- [ ] Không còn green-brand inconsistency.
- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] E2E core flow pass.
- [ ] Build production pass.
- [ ] Không có console error nghiêm trọng.

---

# 43. OUTPUT CUỐI CÙNG

Sau khi hoàn tất implementation, trả lại report:

```text
DUSTGUARD STAFF DASHBOARD REARCHITECTURE REPORT

1. Architecture before
2. Problems found
3. Root causes
4. Architecture after
5. Domain changes
6. API changes
7. Database changes
8. UI/UX changes
9. Removed mock/dead code
10. Tests created
11. E2E flows verified
12. Remaining risks
13. Files changed
14. Commands executed
```

Kèm bảng:

```text
Feature | Before | After | API | DB | E2E | Status
```

Status chỉ được:

```text
DONE
PARTIAL
BLOCKED
```

Không dùng từ:

`Done`

nếu chưa chạy test thực tế.

---

# 44. ƯU TIÊN THỰC THI

Thứ tự bắt buộc:

```text
DATA CORRECTNESS
        ↓
DOMAIN FLOW
        ↓
API CONTRACT
        ↓
STATE MANAGEMENT
        ↓
INFORMATION ARCHITECTURE
        ↓
UI
        ↓
POLISH
```

Không đảo ngược thứ tự này.

Mục tiêu không phải tạo ra một dashboard “đẹp”.

Mục tiêu là tạo ra một hệ thống mà một thanh tra viên có thể mở lên và ngay lập tức biết:

> **Điểm nào đang có vấn đề?**
>
> **Tại sao nó được ưu tiên?**
>
> **Ai đang xử lý?**
>
> **Bằng chứng là gì?**
>
> **Căn cứ nào liên quan?**
>
> **Deadline còn bao lâu?**
>
> **Việc tiếp theo cần làm là gì?**

Hãy audit codebase bằng các subagent trước, tổng hợp findings, lập plan có dependency rõ ràng, sau đó triển khai lần lượt cho đến khi full core flow chạy E2E.
