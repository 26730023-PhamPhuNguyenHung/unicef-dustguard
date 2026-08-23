# PROMPT — TÁI KIẾN TRÚC CONTRACTOR DASHBOARD / NHÀ THẦU DUSTGUARD VN

Hãy audit và tái kiến trúc toàn bộ dashboard dành cho **Nhà thầu / Đơn vị thi công** của DustGuard VN.

Route hiện tại có thể là:

`/contractor`

Không chỉ sửa UI. Hãy xem đây là một bài toán **Product Architecture + Information Architecture + Domain Workflow + Backend Integration + UX + Responsive + E2E**.

Mục tiêu cuối cùng:

> Contractor Dashboard phải trở thành “Compliance & Remediation Workspace” — nơi nhà thầu biết công trình nào đang có vấn đề, vấn đề gì cần xử lý trước, cần làm gì, deadline khi nào, cần nộp bằng chứng gì, ai đang xác minh và khi nào vụ việc được đóng.

---

# 1. VẤN ĐỀ CỦA GIAO DIỆN HIỆN TẠI

Audit screenshot và code hiện tại trước khi sửa.

Hiện tại dashboard đang có các vấn đề:

- Sidebar gần như chỉ có một chức năng “Khắc phục vi phạm”.
- Quá nhiều diện tích dành cho thông tin tĩnh.
- Contractor không nhìn thấy ngay:
  - việc gì cần làm;
  - việc nào quá hạn;
  - mức độ nghiêm trọng;
  - deadline;
  - yêu cầu của thanh tra;
  - bằng chứng còn thiếu;
  - trạng thái xác minh.
- “Trạng thái nghĩa vụ pháp lý” hiển thị hàng loạt `ĐẠT`, nhưng:
  - không thấy nguồn kiểm tra;
  - không thấy lần kiểm tra gần nhất;
  - không thấy nghĩa vụ nào có vấn đề;
  - không có CTA xử lý.
- Risk gauge hiện `154 điểm` nhưng scale/range không rõ ràng và có nguy cơ sai logic.
- Risk score đang đóng vai trò trang trí hơn là hỗ trợ quyết định.
- Các tab phía dưới:
  - Hạng mục khắc phục
  - Vụ việc vi phạm
  - CSR/ESG

  chưa tạo thành workflow rõ ràng.
- CSR/ESG đang được đặt ngang hàng với xử lý vi phạm dù không phải công việc ưu tiên chính.
- Không thể hiện lifecycle:
  `Detected → Assigned → Contractor Action → Evidence Submitted → Inspection → Verified → Closed`.
- Không thấy telemetry từ sensor liên quan trực tiếp tới công trường.
- Không thấy timeline sự kiện.
- Không thấy lịch sử bằng chứng.
- Không thấy người phụ trách.
- Không thấy SLA.
- Không thấy thông báo/cảnh báo ưu tiên.
- Không có cảm giác đây là một operational dashboard.

Hãy loại bỏ tư duy “dashboard để xem số liệu”.

Thiết kế lại thành:

> **Operational Workspace để hoàn thành công việc.**

---

# 2. XÁC ĐỊNH ĐÚNG ROLE CỦA CONTRACTOR

Contractor KHÔNG được có quyền tương đương:

- lãnh đạo;
- thanh tra;
- cán bộ quản lý;
- admin.

Contractor chỉ được truy cập dữ liệu thuộc:

- doanh nghiệp của mình;
- các công trình mình được phân quyền;
- các vụ việc liên quan tới công trình đó;
- yêu cầu khắc phục;
- sensor/telemetry được phép xem;
- bằng chứng do mình hoặc team mình gửi;
- feedback/yêu cầu bổ sung của cán bộ.

Thiết kế RBAC rõ ràng.

Ví dụ:

```txt
CONTRACTOR_OWNER
CONTRACTOR_MANAGER
CONTRACTOR_SITE_MANAGER
CONTRACTOR_STAFF
```

Permissions tối thiểu:

```txt
contractor.project.read
contractor.remediation.read
contractor.remediation.update
contractor.evidence.create
contractor.evidence.read
contractor.task.assign
contractor.telemetry.read
contractor.notice.read
contractor.profile.manage
```

Không cho phép contractor:

```txt
inspection.verify
violation.close
risk.override
sensor.admin
project.admin
government.internal_notes.read
```

---

# 3. KIẾN TRÚC INFORMATION ARCHITECTURE MỚI

Sidebar desktop chỉ nên khoảng 5–6 menu chính.

Đề xuất:

```txt
Tổng quan
Cần xử lý
Công trình
Bằng chứng
Thông báo
```

Optional:

```txt
Hồ sơ doanh nghiệp
```

Không để 10–15 menu.

Mobile chuyển thành:

- bottom navigation cho 4 mục quan trọng nhất;
- phần còn lại nằm trong More/Menu.

---

# 4. TRANG 1 — TỔNG QUAN

Route:

```txt
/contractor
```

Đây phải là command center.

Không mở đầu bằng hàng loạt form hoặc thông tin pháp lý.

## Hero / Workspace Header

Hiển thị:

```txt
Nhà thầu
Công ty ABC Construction

3 công trình đang hoạt động
5 việc cần xử lý
2 việc sắp quá hạn
1 cảnh báo mức cao
```

CTA chính:

```txt
Xem việc cần xử lý
```

CTA phụ:

```txt
Chọn công trình
```

---

# 5. PRIORITY ACTION CENTER

Đây phải là section quan trọng nhất trên màn hình.

Title:

```txt
Cần xử lý ngay
```

Hiển thị 3–5 issue ưu tiên nhất.

Mỗi task card:

```txt
HIGH

PM2.5 vượt ngưỡng tại cổng phía Đông

Công trình:
Đường Vành đai 3 — Mai Dịch

Phát hiện:
14:32 · 22/08/2026

Yêu cầu:
Tăng tần suất phun nước khu vực đường nội bộ.

Deadline:
Còn 3 giờ 24 phút

Evidence:
0 / 2

[ Xử lý ngay ]
```

Priority:

```txt
CRITICAL
HIGH
MEDIUM
LOW
```

Không phụ thuộc chỉ vào sensor.

Risk phải tổng hợp:

```txt
sensor anomaly
+ citizen reports
+ inspection findings
+ compliance breach
+ repeated violations
+ unresolved remediation
+ overdue SLA
```

---

# 6. KPI CHỈ GIỮ 4–5 CHỈ SỐ THỰC SỰ HỮU ÍCH

Không tạo dashboard đầy card.

Ví dụ:

```txt
Cần xử lý        05
Sắp quá hạn      02
Đang xác minh    03
Đã hoàn thành    18
Compliance       87%
```

Mỗi KPI phải clickable/filter được.

Click `Sắp quá hạn`:

→ mở danh sách remediation tương ứng.

---

# 7. PROJECT HEALTH

Section:

```txt
Tình trạng công trình
```

Hiển thị compact list/card.

Ví dụ:

```txt
Đường Vành đai 3 — Mai Dịch

Risk: HIGH
Compliance: 78%

Sensor: Online
PM2.5: 68 µg/m³

2 việc cần xử lý
1 việc quá hạn

[Xem công trình]
```

Không bắt user select công trình từ dropdown ngay khi mở dashboard.

Dropdown có thể tồn tại như filter global, nhưng không phải UI chính.

---

# 8. RISK SCORE — SỬA HOÀN TOÀN

Không hiển thị một gauge `154` không giải thích.

Chuẩn hóa score:

```txt
0–100
```

Ví dụ:

```txt
72 / 100
Rủi ro cao
```

Breakdown:

```txt
Bụi / môi trường        +28
Vi phạm chưa xử lý      +20
Phản ánh cộng đồng      +12
Quá hạn SLA             +12
```

Có tooltip:

```txt
Điểm rủi ro được tính từ dữ liệu cảm biến,
vi phạm, phản ánh và trạng thái khắc phục.
```

Risk score không được hard-code trong frontend.

Backend / domain service phải là SSOT.

Ví dụ:

```txt
riskScore:
{
  score: 72,
  level: "HIGH",
  factors: [...]
}
```

Frontend chỉ render.

---

# 9. TRANG “CẦN XỬ LÝ”

Route:

```txt
/contractor/actions
```

Đây phải là trang chính của role contractor.

Có các filter:

```txt
Tất cả
Cần xử lý
Đang thực hiện
Chờ xác minh
Yêu cầu bổ sung
Quá hạn
Hoàn tất
```

Additional filters:

```txt
Công trình
Mức độ
Deadline
Loại vi phạm
Người phụ trách
```

Table desktop:

```txt
Vấn đề
Công trình
Mức độ
Trạng thái
Deadline
Evidence
Phụ trách
Action
```

Mobile:

card list.

---

# 10. REMEDIATION DETAIL — CORE WORKFLOW

Route:

```txt
/contractor/actions/:id
```

Đây là màn hình quan trọng nhất.

Layout desktop 2 columns.

LEFT ~65%:

### A. Vấn đề

```txt
PM2.5 vượt ngưỡng liên tục 20 phút

Mức độ: HIGH
Nguồn: Sensor DG-NODE-021
Vị trí: Cổng phía Đông
```

### B. Yêu cầu khắc phục

```txt
1. Phun nước tuyến đường nội bộ.
2. Kiểm tra che phủ vật liệu.
3. Nộp ảnh trước/sau khắc phục.
4. Nộp log vận hành thiết bị.
```

### C. Checklist

```txt
□ Phun nước khu vực A
□ Che phủ đống vật liệu
□ Kiểm tra bánh xe tải
□ Upload bằng chứng
```

### D. Evidence Upload

Cho phép:

```txt
Ảnh
Video
PDF
Biên bản
Sensor snapshot
Ghi chú
```

Mỗi evidence cần:

```txt
timestamp
uploader
location nếu có
file hash
mime type
linked remediation id
```

### E. Timeline

Ví dụ:

```txt
14:02
Sensor phát hiện PM2.5 vượt ngưỡng

14:05
Risk Engine tạo cảnh báo HIGH

14:08
Cán bộ tạo yêu cầu khắc phục

14:12
Nguyễn Văn Cường đã nhận việc

15:04
Nhà thầu upload 3 bằng chứng

15:30
Đang chờ cán bộ xác minh
```

RIGHT ~35%:

```txt
Trạng thái
Deadline
Người phụ trách
Mức độ
Công trình
Nguồn phát hiện
SLA
Evidence 3/4
```

CTA sticky:

```txt
[ Nộp bằng chứng ]
```

hoặc:

```txt
[ Gửi xác nhận hoàn thành ]
```

---

# 11. STATE MACHINE PHẢI CHÍNH XÁC

Không dùng status string tùy tiện.

Dùng một finite lifecycle rõ ràng:

```txt
OPEN
ACKNOWLEDGED
IN_PROGRESS
EVIDENCE_SUBMITTED
UNDER_REVIEW
CHANGES_REQUESTED
VERIFIED
CLOSED
```

Possible:

```txt
OVERDUE
```

nên là derived state hoặc flag, không nhất thiết phá lifecycle chính.

Transition:

```txt
OPEN
↓ contractor acknowledge

ACKNOWLEDGED
↓ start work

IN_PROGRESS
↓ evidence submitted

EVIDENCE_SUBMITTED
↓ officer review

UNDER_REVIEW

├─ CHANGES_REQUESTED
│      ↓ contractor update
│   EVIDENCE_SUBMITTED
│
└─ VERIFIED
       ↓ authority close
    CLOSED
```

Contractor không được tự `VERIFIED` hoặc `CLOSED`.

---

# 12. TRANG CÔNG TRÌNH

Route:

```txt
/contractor/projects
```

Danh sách công trình thuộc contractor.

Click:

```txt
/contractor/projects/:projectId
```

Project detail gồm:

## Overview

```txt
Tên công trình
Địa điểm
Mã công trình
Chủ đầu tư
Nhà thầu
Thời gian thi công
Giai đoạn hiện tại
```

## Risk health

```txt
Risk level
Compliance %
Open actions
Sensor health
Citizen reports
```

## Environmental telemetry

Chỉ show metric cần thiết:

```txt
PM1.0
PM2.5
PM10
Temperature
Humidity
```

Không cần biến contractor dashboard thành IoT engineering dashboard.

Hiển thị:

```txt
Current
24h
7 days
```

Và threshold line.

## Recent incidents

Latest 5.

## Compliance checklist

---

# 13. COMPLIANCE CHECKLIST

Thay vì 10 ô `ĐẠT` màu xanh như hiện tại, thiết kế thành actionable checklist.

Các trạng thái:

```txt
PASS
WARNING
FAILED
UNKNOWN
NOT_APPLICABLE
```

Ví dụ:

```txt
Che phủ vật liệu

PASS
Kiểm tra lần cuối: 15:30 hôm nay

[Xem bằng chứng]
```

Hoặc:

```txt
Phun nước dập bụi

WARNING
Không có bằng chứng trong 4 giờ gần nhất.

[Khắc phục]
```

Các item có:

```txt
requirement
status
source
lastCheckedAt
evidence
relatedViolation
recommendedAction
```

`Chưa cập nhật` phải là trạng thái thực, không được giả định PASS.

---

# 14. SENSOR HEALTH

Contractor cần nhìn thấy trạng thái sensor nhưng không được quản trị sensor sâu.

Hiển thị:

```txt
3 / 3 thiết bị hoạt động

DG-NODE-021
ONLINE
Last reading: 28s ago
Integrity: 98%

DG-NODE-025
INACTIVE
Không nhận dữ liệu 18 phút
```

CTA:

```txt
Báo sự cố thiết bị
```

Không cho contractor:

```txt
change calibration
delete device
override measurements
```

---

# 15. EVIDENCE CENTER

Route:

```txt
/contractor/evidence
```

Một evidence library tập trung.

Filter:

```txt
Công trình
Vụ việc
Ngày
Loại file
Người tải lên
Trạng thái xác minh
```

Mỗi evidence cần:

```txt
thumbnail
file name
submittedAt
submittedBy
linkedIssue
verificationStatus
hash/integrity metadata
```

Status:

```txt
Pending
Verified
Rejected
Superseded
```

---

# 16. NOTIFICATION CENTER

Route:

```txt
/contractor/notifications
```

Notification types:

```txt
NEW_VIOLATION
NEW_REMEDIATION
DEADLINE_WARNING
OVERDUE
EVIDENCE_ACCEPTED
EVIDENCE_REJECTED
CHANGES_REQUESTED
SENSOR_ALERT
SYSTEM
```

Ví dụ:

```txt
Còn 2 giờ để xử lý DG-RM-2026-0192

PM2.5 vượt ngưỡng tại công trình Mai Dịch.

[Xem yêu cầu]
```

Read/unread.

Không dùng notification chỉ để trang trí.

---

# 17. DEADLINE + SLA

Mỗi action cần:

```txt
createdAt
acknowledgeDueAt
remediationDueAt
reviewDueAt
completedAt
```

UI hiển thị tương đối:

```txt
Còn 3 giờ 14 phút
```

```txt
Quá hạn 48 phút
```

Không hard-code.

Server timestamp là SSOT.

---

# 18. AUDIT TRAIL

Mọi mutation quan trọng phải có audit event.

Ví dụ:

```txt
REMEDIATION_ACKNOWLEDGED
REMEDIATION_STARTED
EVIDENCE_UPLOADED
EVIDENCE_DELETED
EVIDENCE_SUBMITTED
ASSIGNEE_CHANGED
COMMENT_ADDED
CHANGES_REQUESTED
REMEDIATION_VERIFIED
```

Audit record:

```txt
actorId
actorRole
organizationId
projectId
entityType
entityId
action
metadata
createdAt
```

Không cho frontend tự fabricate history.

---

# 19. CONTRACTOR TEAM

Nếu kiến trúc hiện tại hỗ trợ organization/team, thêm:

```txt
/contractor/team
```

Owner/Manager có thể:

```txt
assign action
change assignee
invite/manage contractor staff
```

Không cần over-engineer nếu chưa có nhu cầu.

Có thể đặt Team trong Hồ sơ doanh nghiệp thay vì sidebar riêng.

---

# 20. PROFILE / CONTRACTOR ORGANIZATION

Thông tin:

```txt
Tên doanh nghiệp
MST
Người đại diện
Số điện thoại
Email
Địa chỉ
Các công trình đang phụ trách
```

Có trạng thái hồ sơ:

```txt
Verified
Pending verification
Missing information
```

---

# 21. BỎ / HẠ THẤP CSR & ESG

Hiện tại:

```txt
Quỹ CSR Escrow & ESG (GRI 304/305)
```

đang chiếm vị trí quá nổi bật.

Không để tính năng phụ làm nhiễu flow xử lý vi phạm.

Nếu backend thực sự đã support:

đưa vào:

```txt
Project > Sustainability
```

hoặc:

```txt
More > ESG
```

Nếu chưa có domain đầy đủ:

- không fake UI;
- không mock số liệu;
- không tạo dashboard “cho đẹp”.

---

# 22. UX PRIORITY SYSTEM

Màu thương hiệu chính của DustGuard:

```txt
Deep Red / DustGuard Red
```

Không biến giao diện sang xanh lá.

Red chỉ dùng cho:

```txt
brand
critical action
danger
active accents
```

Semantic colors:

```txt
Critical / Error → red
Warning          → amber
Success          → green
Info             → neutral/blue-gray
Neutral          → slate
```

Không để cả dashboard đỏ rực.

Phong cách:

```txt
white
off-white / warm neutral
dark text
deep red accent
thin neutral borders
minimal shadows
```

---

# 23. SỬA CARD SYSTEM

Hiện tại quá nhiều rectangle có border giống nhau.

Tạo component system thống nhất:

```txt
<PageHeader />
<WorkspaceSummary />
<StatCard />
<ActionCard />
<ProjectHealthCard />
<RiskBadge />
<StatusBadge />
<DeadlineBadge />
<ComplianceItem />
<EvidenceCard />
<ActivityTimeline />
<EmptyState />
<DataTable />
<FilterBar />
```

Card hierarchy:

```txt
Primary Card
Secondary Card
Inline Card
Alert Card
```

Không nested card 3–4 lớp.

---

# 24. TYPOGRAPHY

Giảm cảm giác “text rơi lung tung”.

Chuẩn hóa:

```txt
Page title      28–32
Section title   18–20
Card title      14–16
Body            13–15
Metadata        12–13
```

Desktop và mobile responsive bằng `clamp()` nếu phù hợp.

Không hard-code title 40–50px.

Không để text wrap thành 1–2 chữ/lần.

---

# 25. RESPONSIVE

Bắt buộc test:

```txt
360
390
430
768
1024
1280
1440
1920
```

Không horizontal scrolling.

Desktop:

```txt
sidebar + content
```

Tablet:

```txt
collapsible sidebar
```

Mobile:

```txt
bottom nav / drawer
single-column
sticky action bar
cards instead of wide tables
```

---

# 26. EMPTY / LOADING / ERROR STATE

Mọi feature phải có:

```txt
loading
empty
error
permission denied
offline
stale data
```

Ví dụ empty state:

```txt
Không có việc cần xử lý

Tất cả yêu cầu hiện tại đã được hoàn thành.
```

Không render blank rectangle.

---

# 27. DATA ARCHITECTURE

Audit schema hiện tại trước.

Ưu tiên reuse domain hiện có.

Không tạo duplicate tables nếu đã tồn tại equivalent entity.

Domain conceptual model:

```txt
ContractorOrganization

Project
ProjectMembership

Violation
Finding

RemediationAction
RemediationTask

Evidence

SensorDevice
SensorReading

RiskAssessment
RiskFactor

ComplianceRequirement
ComplianceAssessment

Notification

AuditEvent
```

Relationship:

```txt
Organization
 └── ProjectMembership
      └── Project
           ├── Sensors
           ├── Violations
           ├── Remediations
           │    ├── Tasks
           │    └── Evidence
           ├── Compliance
           └── RiskAssessment
```

---

# 28. API CONTRACT

Không để React component tự join logic phức tạp.

Dashboard aggregate API ví dụ:

```txt
GET /api/contractor/dashboard
```

Response conceptual:

```json
{
  "summary": {
    "activeProjects": 3,
    "openActions": 5,
    "dueSoon": 2,
    "overdue": 1,
    "underReview": 3
  },
  "priorityActions": [],
  "projects": [],
  "notifications": []
}
```

Other APIs:

```txt
GET  /api/contractor/projects
GET  /api/contractor/projects/:id

GET  /api/contractor/remediations
GET  /api/contractor/remediations/:id

POST /api/contractor/remediations/:id/acknowledge
POST /api/contractor/remediations/:id/start
POST /api/contractor/remediations/:id/evidence
POST /api/contractor/remediations/:id/submit

GET  /api/contractor/evidence

GET  /api/contractor/notifications
POST /api/contractor/notifications/:id/read
```

Tên endpoint cuối cùng cần tuân theo convention hiện tại của repository.

Không duplicate endpoint nếu backend đã có.

---

# 29. SERVER-SIDE AUTHORIZATION

TUYỆT ĐỐI không chỉ filter ở frontend.

Ví dụ contractor A gọi:

```txt
GET /api/contractor/projects/B
```

mà Project B thuộc contractor khác:

phải trả:

```txt
403
```

hoặc `404` nếu security policy yêu cầu resource hiding.

Kiểm tra tenant boundary với:

```txt
organization_id
project membership
role
```

---

# 30. TELEMETRY KHÔNG ĐƯỢC MOCK

Data flow:

```txt
IoT Node
↓
Telemetry API
↓
D1
↓
Risk Engine
↓
Finding / Alert
↓
Remediation
↓
Contractor Workspace
```

Dashboard phải đọc đúng data source này.

Sensor chưa có hardware thật thì sử dụng adapter/simulator theo kiến trúc hiện tại.

Không để mock JSON nằm trong React page.

Sau này sensor thật về chỉ thay:

```txt
Hardware Adapter
```

không sửa domain/UI architecture.

---

# 31. RISK ENGINE LÀ SSOT

Không tính risk trong React:

```js
const score = ...
```

Nếu logic hiện đang frontend:

move sang domain/backend service.

Example:

```txt
RiskEngine.calculate(projectContext)
```

Trả:

```txt
score
level
factors
generatedAt
version
```

Lưu hoặc cache tùy architecture hiện tại.

---

# 32. DASHBOARD HOME — BỐ CỤC ĐỀ XUẤT

Desktop:

```txt
┌───────────────────────────────────────────────────────────┐
│ Contractor Workspace                 Project Filter       │
│ ABC Construction                     Notifications        │
└───────────────────────────────────────────────────────────┘

┌────────┬────────┬────────┬────────┬────────┐
│ Cần XL │ Sắp QH │ Quá Hạn│ Review │ Comp.% │
└────────┴────────┴────────┴────────┴────────┘

┌────────────────────────────────────┬──────────────────────┐
│ CẦN XỬ LÝ NGAY                    │ RISK OVERVIEW        │
│                                    │                      │
│ Critical issue                     │ 72 / 100             │
│ High issue                         │ HIGH                 │
│ Medium issue                       │                      │
│                                    │ Top Risk Factors     │
└────────────────────────────────────┴──────────────────────┘

┌───────────────────────────────────────────────────────────┐
│ TÌNH TRẠNG CÔNG TRÌNH                                    │
│ Project A                                                │
│ Project B                                                │
│ Project C                                                │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────┬───────────────────────────┐
│ HOẠT ĐỘNG GẦN ĐÂY            │ THÔNG BÁO                 │
└───────────────────────────────┴───────────────────────────┘
```

Mọi section đều dẫn đến action.

---

# 33. KHÔNG ĐƯỢC BIẾN HOME THÀNH BI DASHBOARD

Không cần:

- 12 chart;
- 15 KPI;
- pie chart vô nghĩa;
- gauge trang trí;
- heatmap nếu không actionable.

Contractor quan tâm:

```txt
What happened?
How serious?
What should I do?
By when?
What evidence?
Has authority accepted it?
```

UI phải trả lời được 6 câu này trong vài giây.

---

# 34. SEARCH / COMMAND BAR

Search hiện tại có thể giữ nhưng phải thực sự dùng được.

Cho phép search:

```txt
Mã vụ việc
Công trình
Mã sensor
Remediation
Evidence
```

Không giữ input placeholder nếu search chưa implement.

Nếu chưa implement:

remove khỏi UI cho đến khi hoàn thiện.

---

# 35. SUPPORT

Hotline hiện tại chiếm quá nhiều diện tích sidebar.

Đưa xuống cuối sidebar thành compact item:

```txt
Cần hỗ trợ?
1900 xxxx
```

Hoặc:

```txt
Trợ giúp
```

Không để hotline card cạnh tranh với navigation.

---

# 36. ACCESSIBILITY

Đảm bảo:

```txt
WCAG contrast
keyboard navigation
visible focus
ARIA labels
semantic button
semantic table
form labels
```

Status không được chỉ biểu diễn bằng màu.

Ví dụ:

```txt
HIGH
QUÁ HẠN
ĐANG XÁC MINH
```

phải có text label.

---

# 37. PERFORMANCE

Không fetch từng card bằng 10 request riêng biệt nếu không cần thiết.

Home dùng aggregate API.

Detail page lazy fetch detail.

Charts lazy load.

Image/evidence thumbnail optimize.

Không đưa library nặng nếu repository đã có component/chart library đủ dùng.

---

# 38. REUSE KIẾN TRÚC HIỆN TẠI

Trước khi code:

1. Scan repository.
2. Xác định:
   - routing;
   - auth;
   - RBAC;
   - domain services;
   - repository pattern;
   - D1 schema;
   - API convention;
   - design system;
   - existing components;
   - validation;
   - error handling;
   - test infrastructure.
3. Reuse tối đa.
4. Không tạo thêm một “architecture song song”.

SSOT tuyệt đối.

Nếu đã có:

```txt
remediation.repository
violation.repository
observation.repository
risk service
evidence service
```

thì mở rộng chúng.

Không tạo:

```txt
contractorRemediation2
newViolationService
dashboardMockService
```

chỉ vì implementation nhanh hơn.

---

# 39. LOẠI BỎ MOCK / DEAD UI

Search toàn bộ contractor feature:

```txt
mock
demo
TODO
placeholder
hardcoded
fake
sample
Math.random
```

Phân loại.

UI nào hiển thị nhưng không hoạt động:

- implement;
- hoặc remove.

Không giữ nút bấm chết.

Không dùng dữ liệu fake chỉ để screenshot đẹp.

Demo data phải đi qua:

```txt
seed → DB → API → UI
```

như production flow.

---

# 40. E2E FLOW BẮT BUỘC

Implement và test full flow:

```txt
1. Sensor gửi PM2.5 vượt threshold
2. Backend lưu reading
3. Risk engine phát hiện anomaly
4. Finding / violation được tạo
5. Remediation được tạo
6. Contractor nhìn thấy notification
7. Contractor acknowledge
8. Contractor start remediation
9. Contractor upload evidence
10. Contractor submit completion
11. Officer nhận review
12. Officer yêu cầu bổ sung hoặc verify
13. Contractor nhìn thấy kết quả
14. Case được closed bởi đúng role
15. Audit trail đầy đủ
```

Nếu phần inspection dashboard đã có, tích hợp với workflow đó.

Không xây contractor flow biệt lập.

---

# 41. TESTS

Bổ sung:

### Unit tests

```txt
risk normalization
deadline calculation
status transition
permission guards
```

### Integration

```txt
contractor cannot access another organization's project

contractor can acknowledge assigned remediation

contractor cannot verify remediation

contractor can upload evidence

evidence belongs to correct remediation

overdue calculation correct
```

### E2E

Test:

```txt
Dashboard → Action → Evidence → Submit
```

Desktop + mobile.

---

# 42. DATA CONSISTENCY

Không để xảy ra:

```txt
Dashboard says 5 open
List says 4 open
Project says 7 open
```

Tất cả count phải xuất phát từ cùng domain semantics.

Define status query centrally.

---

# 43. DATE/TIME

Lưu database bằng UTC.

Render theo timezone user/project.

Không hardcode:

```txt
GMT+7
```

trong business logic.

Relative time:

```txt
2 phút trước
Còn 3 giờ
Quá hạn 1 ngày
```

---

# 44. ERROR / CONCURRENCY

Nếu 2 người contractor cùng xử lý:

API phải kiểm tra current state.

Không để:

```txt
UNDER_REVIEW
```

bị chuyển ngược về:

```txt
IN_PROGRESS
```

do stale browser.

Dùng optimistic concurrency hoặc status validation phù hợp với architecture hiện tại.

---

# 45. DESIGN DIRECTION

Giữ DustGuard brand:

```txt
Professional
Civic-tech
Environmental compliance
Government-ready
Operational
Trustworthy
```

Không thiết kế giống:

```txt
crypto dashboard
generic SaaS template
gaming dashboard
consumer fintech
```

Ưu tiên:

- typography sạch;
- hierarchy mạnh;
- whitespace đủ;
- borders nhẹ;
- red accent;
- dữ liệu dễ scan;
- CTA rõ;
- ít decoration.

---

# 46. ĐỔI COPY

Không sử dụng nhiều terminology hành chính khó hiểu ngay trên home.

Ví dụ thay:

```txt
TRẠNG THÁI NGHĨA VỤ PHÁP LÝ HIỆN THỜI
```

bằng:

```txt
Tuân thủ tại công trình
```

Thay:

```txt
HẠNG MỤC KHẮC PHỤC
```

bằng:

```txt
Cần xử lý
```

Thay:

```txt
VỤ VIỆC VI PHẠM & XỬ LÝ PHÁP LÝ
```

bằng:

```txt
Vi phạm & yêu cầu xử lý
```

Chi tiết pháp lý vẫn tồn tại trong detail view.

---

# 47. DO NOT

Không:

- rebuild toàn bộ app;
- đổi stack;
- duplicate schema;
- phá API hiện tại;
- hard-code dashboard;
- đặt mock trong production component;
- thêm dependency không cần thiết;
- tạo chart chỉ để đầy màn hình;
- cho contractor quyền của inspector;
- để frontend là SSOT;
- tự động đóng violation khi contractor submit;
- biến CSR thành feature chính;
- để sidebar dài;
- dùng màu xanh lá làm primary brand;
- để text overflow / wrap xấu;
- tạo desktop-only UI.

---

# 48. ACCEPTANCE CRITERIA

Chỉ coi là hoàn thành khi:

```txt
[ ] Contractor Home được tái kiến trúc
[ ] Priority Action Center hoạt động
[ ] Project list/detail hoạt động
[ ] Remediation list hoạt động
[ ] Remediation detail hoạt động
[ ] Evidence upload hoạt động
[ ] Evidence history hoạt động
[ ] Notification hoạt động
[ ] Deadline/SLA hoạt động
[ ] Risk score 0–100 thống nhất
[ ] Compliance status có source + timestamp
[ ] Sensor health lấy dữ liệu thật
[ ] RBAC server-side
[ ] Tenant isolation
[ ] Audit trail
[ ] Không còn dead button
[ ] Không còn production mock
[ ] Responsive 360–1920px
[ ] Loading/empty/error đầy đủ
[ ] Full E2E flow pass
[ ] Existing tests không regression
[ ] Production build pass
```

---

# 49. CÁCH TRIỂN KHAI

Không code ngay một cách mù quáng.

Thực hiện theo thứ tự:

## Phase 1 — Audit

Output:

```txt
Current architecture
Existing reusable modules
Broken flows
Mock/dead features
Schema gaps
API gaps
RBAC gaps
UX issues
```

## Phase 2 — Architecture Plan

Output:

```txt
Target IA
Domain changes
API changes
Component tree
State machine
Permission matrix
Migration requirement
```

Không code trước khi tự kiểm tra kế hoạch có duplicate architecture hay không.

## Phase 3 — Backend/domain

Hoàn thiện:

```txt
queries
services
authorization
risk
status transitions
audit
evidence
notifications
```

## Phase 4 — Frontend

Xây theo component system mới.

## Phase 5 — Integration

Nối data thật.

## Phase 6 — E2E

Chạy workflow hoàn chỉnh.

## Phase 7 — Cleanup

Remove:

```txt
old components
dead CSS
mock data
unused routes
unused imports
duplicate logic
```

---

# 50. OUTPUT SAU KHI HOÀN THÀNH

Trả báo cáo cuối cùng theo format:

```txt
1. Contractor Dashboard Architecture
2. Routes đã thay đổi
3. Components đã tạo/reuse
4. Domain/service đã thay đổi
5. API đã tạo/reuse
6. DB migration
7. RBAC matrix
8. Full workflow
9. Mock/dead code đã loại bỏ
10. Tests
11. Production build result
12. Những vấn đề còn lại
```

Không claim “100% hoàn thành” nếu chưa chạy test thực tế.

Nếu một feature chưa implement được, ghi rõ:

```txt
NOT IMPLEMENTED
PARTIAL
BLOCKED
```

và lý do.

---

# PRODUCT PRINCIPLE CUỐI CÙNG

Mỗi lần sửa UI hãy kiểm tra lại câu hỏi:

> “Một quản lý công trường mở DustGuard lên thì trong 5 giây có biết hôm nay mình phải xử lý việc gì không?”

Nếu câu trả lời là không, dashboard vẫn chưa đạt.

Luồng ưu tiên cuối cùng phải là:

```txt
PHÁT HIỆN
   ↓
CẢNH BÁO
   ↓
GIAO VIỆC
   ↓
KHẮC PHỤC
   ↓
NỘP BẰNG CHỨNG
   ↓
XÁC MINH
   ↓
ĐÓNG VỤ VIỆC
```

Contractor Dashboard phải được kiến trúc xoay quanh flow này, không phải xoay quanh các card thống kê.
