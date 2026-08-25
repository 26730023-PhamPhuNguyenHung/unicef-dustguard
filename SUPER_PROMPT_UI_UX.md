# SUPER PROMPT — 10 SUBAGENTS AUDIT & REBUILD UI/UX DUSTGUARD VN

Bạn đang làm việc trên codebase **DustGuard VN**.

Nhiệm vụ không phải là “làm UI đẹp hơn một chút”.

Hãy sử dụng **10 subagent chuyên môn chạy song song** để audit, tái cấu trúc và trực tiếp sửa toàn bộ UI/UX DustGuard VN nhằm đạt trạng thái:

> Có hồn hơn  
> Dễ hiểu hơn  
> Dễ dùng hơn  
> Ít cảm giác template/admin dashboard hơn  
> Chuẩn hóa hơn  
> Có hierarchy rõ ràng  
> Có mental model đúng với từng role  
> Có storytelling về môi trường và hành động  
> Mobile-first ở các luồng Citizen/Community  
> Professional ở Staff/Executive  
> Không phá business logic  
> Không fake dữ liệu  
> Không chỉ viết `.md`

---

# 0. NGUYÊN TẮC THỰC THI

## Không được chỉ audit code.

Phải thực hiện:

```text
ENUMERATE ROUTES
→ OPEN APP
→ LOGIN ROLE
→ USE FEATURE
→ INSPECT DEVTOOLS
→ IDENTIFY UX/UI ROOT CAUSE
→ TRACE COMPONENT
→ FIX SOURCE
→ HOT RELOAD
→ TEST AGAIN
→ RESPONSIVE TEST
→ SCREENSHOT
→ NEXT ISSUE
```

Không được kết thúc bằng một tài liệu kiểu:

```text
UX_AUDIT.md
UI_RECOMMENDATIONS.md
IMPROVEMENTS.md
```

mà không sửa application.

Tài liệu chỉ là output phụ.

---

# 1. MỤC TIÊU TRẢI NGHIỆM DUSTGUARD

DustGuard không được tạo cảm giác:

> dashboard template + card + table + sidebar.

DustGuard phải tạo mental model:

```text
Tín hiệu môi trường
      ↓
Nhận biết vấn đề
      ↓
Con người phản ánh
      ↓
Xác minh bằng chứng
      ↓
Cơ quan / cộng đồng hành động
      ↓
Theo dõi thay đổi
      ↓
Chứng minh tác động
```

UI phải làm vòng đời này hiện hữu.

Người dùng phải luôn biết:

```text
Tôi đang ở đâu?
Có chuyện gì đang xảy ra?
Việc nào quan trọng?
Tôi cần làm gì tiếp?
Ai đang xử lý?
Kết quả ra sao?
```

---

# 2. BẮT BUỘC TẠO 10 SUBAGENTS

Khởi tạo 10 subagent độc lập.

Không cho cả 10 agent chỉ review screenshot giống nhau.

Mỗi agent phải có domain riêng.

Sau khi chạy xong:

```text
10 reports
↓
Lead synthesis
↓
Conflict resolution
↓
Prioritized implementation
↓
Code changes
↓
Runtime verification
```

---

# SUBAGENT 01 — INFORMATION ARCHITECTURE & ROUTE ARCHITECT

## Mission

Audit toàn bộ:

```text
routes
sidebar
top navigation
role navigation
nested routes
duplicate screens
dead screens
overlapping concepts
```

Tìm những tình trạng như:

```text
/report
/reports
/feedback
/incidents
/community-reports
```

nhưng thực tế cùng một concept.

Hoặc:

```text
/tasks
/my-work
/assignments
/actions
```

nhưng cùng phục vụ một use case.

---

## Agent phải lập

```text
ROUTE INVENTORY

Route
Role
Primary Job
Primary Entity
Primary Action
Secondary Action
Data Source
Keep / Merge / Rename / Remove
```

---

## Rule

Một page chỉ tồn tại khi có:

```text
one clear job
```

Không tạo page chỉ vì:

> backend có module đó.

---

## Mental model đề xuất

### Citizen

```text
/citizen
/citizen/report/new
/citizen/reports
/citizen/reports/:id
/citizen/map
/citizen/profile
```

### Community

```text
/community
/community/missions
/community/missions/:id
/community/my-activities
/community/impact
/community/groups
```

### Staff

```text
/staff
/staff/reports
/staff/reports/:id
/staff/field
/staff/monitoring
/staff/evidence
```

### Executive

```text
/executive
/executive/overview
/executive/areas
/executive/risks
/executive/sla
/executive/reports
```

### Admin

Chỉ system administration.

Không mix admin và operations.

---

# SUBAGENT 02 — CITIZEN UX SPECIALIST

Agent này phải sử dụng DustGuard như một người dân bình thường.

Không suy nghĩ như developer.

Câu hỏi trung tâm:

> Một người thấy bụi ngoài đường mở DustGuard thì có biết phải làm gì trong 5 giây không?

---

## Audit Citizen Home

Trang `/citizen` phải ưu tiên:

### 1. Tình trạng quanh tôi

Ví dụ:

```text
Không khí quanh bạn

PM2.5
48 µg/m³

Cần chú ý

Trạm gần nhất
Cách 650 m
Cập nhật 4 phút trước
```

Không mở đầu bằng:

```text
Total Reports
Sensors Online
Open Cases
Average SLA
```

---

## Primary CTA

Rõ ràng:

> Phản ánh ô nhiễm

Không để cùng cấp với 7 button khác.

---

## Secondary actions

Tối đa:

```text
Xem bản đồ
Theo dõi phản ánh
```

---

## Report creation

Audit toàn bộ wizard:

```text
Vấn đề gì?
↓
Ở đâu?
↓
Bằng chứng
↓
Mô tả
↓
Xác nhận
```

Phải:

- ít cognitive load;
- dùng ngôn ngữ người dân;
- không thuật ngữ nội bộ;
- hỗ trợ camera mobile;
- GPS tự nhiên;
- preview evidence;
- progress rõ;
- không form dài 25 fields.

---

## Report Detail

Đừng làm kiểu admin record.

Phải giống:

> Theo dõi một vụ việc.

Có:

```text
Current status
Timeline
Evidence
Location
What happens next
Add evidence
Resolution
```

---

# SUBAGENT 03 — COMMUNITY EXPERIENCE DESIGNER

Community không được là:

```text
leaderboard
badges
points
feed
```

rồi gọi đó là cộng đồng.

Agent phải redesign Community quanh:

```text
VẤN ĐỀ THẬT
→ VIỆC CÓ THỂ LÀM
→ NGƯỜI THAM GIA
→ BẰNG CHỨNG
→ TÁC ĐỘNG
```

---

## `/community`

Trong 5 giây phải trả lời:

```text
Có vấn đề gì gần tôi?
Tôi có thể giúp việc gì?
Hoạt động nào sắp diễn ra?
Việc tôi làm đã tạo tác động gì?
```

---

## Hero không corporate

Không dùng:

> Community Management Dashboard

Dùng ngôn ngữ như:

> Cùng biến phản ánh thành hành động.

hoặc semantic tương đương phù hợp DustGuard.

---

## Mission cards

Không card boilerplate.

Phải hierarchy:

```text
WHAT
WHERE
WHEN
WHY IT MATTERS
PARTICIPANTS
ACTION
```

Ví dụ:

```text
Xác minh bụi quanh trường học

Q.7 · cách bạn 1,2 km

08:00 · 29/08

Hỗ trợ xác minh 4 phản ánh đang mở.

8 / 12 người

[Tham gia]
```

---

## Impact

Không chỉ:

```text
125 points
```

Mà:

```text
8 hoạt động
21 bằng chứng xác minh
4 điểm nóng hỗ trợ
3 vụ việc đã cải thiện
```

Điểm chỉ là supporting information.

---

# SUBAGENT 04 — STAFF WORKFLOW UX SPECIALIST

Staff không cần “dashboard đẹp”.

Staff cần:

> biết việc nào phải làm trước.

Audit theo workflow:

```text
NEW SIGNAL
↓
TRIAGE
↓
VERIFY
↓
ASSIGN
↓
FIELD ACTION
↓
EVIDENCE
↓
MONITOR
↓
RESOLVE
```

---

## Staff Home

Không ưu tiên KPI.

Ưu tiên:

### Cần xử lý ngay

```text
3 phản ánh nguy cơ cao
2 vụ sắp quá SLA
1 điểm mất dữ liệu sensor
```

### Việc hôm nay

### Đang theo dõi

### Gần quá hạn

KPI chỉ nằm supporting layer.

---

## Report queue

Audit:

```text
priority
status
location
age
SLA
owner
evidence
next action
```

Không để người dùng phải mở record mới biết việc cần làm.

---

## Report detail

Tạo layout theo:

```text
CASE SUMMARY

EVIDENCE

TIMELINE

FIELD ACTION

MONITORING

DECISION
```

Không render một bảng database detail dài.

---

# SUBAGENT 05 — EXECUTIVE DECISION UX SPECIALIST

Executive không được nhận một phiên bản phóng to của Staff Dashboard.

Executive cần trả lời:

```text
Ở đâu đang xấu đi?
Vấn đề nào đáng lo?
Có nơi nào quá SLA?
Nguồn lực đang bị nghẽn ở đâu?
Tình hình hôm nay tốt lên hay xấu đi?
```

---

## Executive home

Hierarchy:

### Situation now

### Critical areas

### Trend

### SLA / response

### Evidence of improvement

### Drill-down

---

## Không KPI theater

Loại các KPI không dẫn tới decision.

Mỗi KPI phải trả lời:

> Nếu con số này thay đổi, lãnh đạo sẽ làm gì?

Nếu không có câu trả lời:

Remove hoặc downgrade.

---

# SUBAGENT 06 — VISUAL DESIGN & EMOTIONAL UX DIRECTOR

Mission:

Làm DustGuard **có hồn**.

Không có nghĩa:

- thêm gradient khắp nơi;
- glassmorphism;
- animation nhiều;
- icon màu mè;
- card bóng;
- ảnh stock.

---

## “Có hồn” nghĩa là

UI phản ánh domain:

```text
environment
air
city
risk
evidence
action
community
improvement
```

---

## Visual language

DustGuard chủ đạo đỏ nhưng không biến toàn hệ thống thành warning screen.

Phân role màu semantic:

```text
Brand red
→ primary identity / critical action

Green
→ safe / improved / resolved

Amber
→ attention / monitoring

Red
→ danger / overdue

Blue/neutral
→ informational
```

Không dùng 8 màu accent tùy tiện.

---

## Surfaces

Giảm:

```text
card inside card
border everywhere
shadow everywhere
rounded rectangle everywhere
```

Tăng:

```text
grouping
whitespace
hierarchy
section rhythm
semantic background
visual anchors
```

---

## Có thể sử dụng

- map;
- environmental visualization;
- subtle sensor pulse;
- live status indicator;
- human activity imagery nếu phù hợp;
- before/after evidence;
- timeline;
- location context.

Không biến thành sci-fi dashboard.

---

## Density

Citizen:

```text
light
clear
touch-friendly
```

Community:

```text
visual
human
action-oriented
```

Staff:

```text
dense but structured
```

Executive:

```text
calm
high signal
decision-first
```

---

# SUBAGENT 07 — DESIGN SYSTEM & COMPONENT ARCHITECT

Audit toàn codebase trước khi page-specific fix.

Tìm:

```text
PageShell
Sidebar
Topbar
PageHeader
SectionHeader
MetricCard
ActionCard
StatusBadge
Button
Tabs
FilterBar
DataTable
EmptyState
ErrorState
Skeleton
Modal
Drawer
Timeline
EvidenceCard
MapCard
```

---

## Tìm duplicate component

Ví dụ:

```text
CitizenStatusBadge
CommunityStatusBadge
StaffStatusChip
AdminBadge
```

nếu cùng semantics thì chuẩn hóa.

---

## Tạo semantic primitives

Ví dụ:

```text
EntityStatus
RiskLevel
PriorityBadge
SLAIndicator
EvidenceStatus
EmptyState
PageHeader
ActionPanel
Timeline
```

Không chỉ:

```text
RedBadge
BlueBadge
LargeCard
```

---

## Tokens

Chuẩn hóa:

```text
spacing
radius
border
shadow
font sizes
line heights
page widths
content max width
sidebar width
button heights
input heights
touch targets
```

---

## Không over-componentize

Chỉ tạo shared component nếu thực sự reusable.

Rule:

```text
shared root
→ design token
→ page pattern
→ local override
```

---

# SUBAGENT 08 — RESPONSIVE, ACCESSIBILITY & TEXT LAYOUT SPECIALIST

Dùng DevTools.

Không nhìn screenshot rồi đoán.

Audit:

```text
360×800
390×844
430×932
768×1024
1024×768
1280×720
1366×768
1440×900
1920×1080
```

---

## Detect runtime overflow

Chạy kiểm tra concept:

```js
[...document.querySelectorAll('*')]
  .filter(el => el.scrollWidth > el.clientWidth + 1)
```

Sau đó loại intentional scroll.

---

## Audit

```text
truncate
line-clamp
overflow-hidden
whitespace-nowrap
min-width
max-width
flex-shrink
grid columns
fixed widths
```

---

## Không sửa bằng

```text
font-size: 10px
scale()
zoom
negative letter spacing
```

---

## Buttons

Không:

```text
Bổ
sung
bằng
chứng
```

---

## Status

Không truncate status quan trọng.

---

## Mobile

Citizen + Community ưu tiên bottom navigation.

Không ép desktop sidebar xuống mobile.

Tables:

```text
desktop → table
mobile → cards / condensed rows / intentional horizontal scroll
```

tùy semantics.

---

## Accessibility

Test:

```text
keyboard
focus
contrast
aria
touch target >= 44px
screen-reader labels
color independence
```

---

# SUBAGENT 09 — CONTENT DESIGN & MICROCOPY SPECIALIST

Audit toàn bộ copy UI.

DustGuard đang dễ mắc lỗi:

> code terminology xuất hiện trực tiếp trên UI.

Search các text như:

```text
telemetry
risk engine
evidence vault
integrity score
HMAC
data registry
incident object
assignment
workflow action
runtime
D1
R2
```

---

## Rule

Developer terminology chỉ xuất hiện khi user thực sự cần.

Citizen không cần biết:

```text
Evidence Entity ID
Risk Engine Score
Telemetry ID
```

Citizen cần:

```text
Bằng chứng
Mức độ cần chú ý
Dữ liệu cảm biến
```

---

## Community

Không:

> Create Mission

Nếu user-facing tiếng Việt:

> Tạo hoạt động

hoặc thuật ngữ đã được chuẩn hóa.

---

## Staff

Có thể technical hơn nhưng vẫn nghiệp vụ-first.

---

## Button policy

Button phải là động từ rõ:

```text
Gửi phản ánh
Tham gia hoạt động
Bổ sung bằng chứng
Xác nhận đã xử lý
Chuyển cán bộ
Bắt đầu theo dõi
```

Tránh:

```text
Submit
Proceed
Action
Manage
View
```

nếu có label cụ thể hơn.

---

## Empty states

Không:

```text
No data.
```

Ví dụ:

```text
Chưa có phản ánh nào cần bạn xử lý.

Các phản ánh mới sẽ xuất hiện tại đây.
```

---

## Error

Không:

```text
Something went wrong.
```

Phải nói:

```text
Không thể tải phản ánh lúc này.

[Thử lại]
```

---

# SUBAGENT 10 — RUNTIME UX QA & VISUAL REGRESSION AGENT

Agent này KHÔNG DESIGN.

Nó đóng vai người kiểm định.

Sau khi 9 agent kia đưa đề xuất và code được sửa, agent 10 phải phá thử.

---

# Test roles

```text
Public
Citizen
Community Member
Community Leader
Staff
Executive
Admin
```

---

# Test workflows

## Citizen

```text
login
→ home
→ report
→ GPS
→ image
→ submit
→ success
→ reports
→ detail
→ add evidence
```

---

## Community

```text
login
→ mission discover
→ detail
→ join
→ check-in
→ evidence
→ submit
→ impact
```

---

## Staff

```text
login
→ urgent queue
→ report
→ triage
→ assign
→ field action
→ evidence
→ monitoring
→ resolve
```

---

## Executive

```text
overview
→ identify risky area
→ drill down
→ understand cause
→ inspect response
```

---

# Agent 10 phải tìm

```text
dead CTA
wrong route
blank screen
unexpected navigation
modal overflow
bad loading
bad empty state
bad error state
wrong focus
layout jump
duplicate labels
unclear status
missing feedback
```

---

# 3. LEAD UX AGENT

Sau 10 agent:

Khởi tạo một Lead Agent.

Không implement từng report mù quáng.

Lead phải merge.

---

# LEAD OUTPUT 1 — UX PROBLEMS

Phân loại:

```text
P0 — task completion blockers
P1 — major confusion
P2 — consistency / efficiency
P3 — visual polish
```

---

# LEAD OUTPUT 2 — CONFLICT RESOLUTION

Ví dụ:

Visual Agent muốn card lớn.

Staff Workflow Agent muốn density cao.

Lead phải quyết định theo:

```text
role
task
frequency
cognitive load
screen size
```

Không chọn theo thẩm mỹ.

---

# LEAD OUTPUT 3 — SYSTEM-WIDE PRINCIPLES

Chốt một bộ luật.

Ví dụ:

### Page heading

```text
Title
Supporting sentence
Primary action
```

### Card

Không phải mọi content đều vào card.

### Status

Một status → một semantic color toàn hệ thống.

### Primary CTA

Mỗi screen chỉ một primary CTA nếu có thể.

### Tabs

Không dùng tabs cho navigation cấp lớn.

### Modals

Không cho workflow dài vào modal.

### Tables

Không dùng table cho Citizen.

### Map

Map phải phục vụ decision/action, không decoration.

---

# 4. AUDIT “SOULLESS UI”

Tạo detector bằng reasoning cho các pattern khiến app vô hồn.

Flag nếu page có:

```text
4 KPI cards
+ generic page heading
+ generic table
+ generic sidebar
```

mà không thể hiện domain.

---

## Với mỗi page hỏi

### 1.

Nếu bỏ logo DustGuard đi, page này có thể là:

```text
CRM?
school admin?
finance dashboard?
```

Nếu có:

UI chưa đủ domain-specific.

---

### 2.

Page có visual/context nào cho thấy:

```text
location
air
risk
evidence
people
environment
action
impact
```

hay không?

---

### 3.

Page có narrative hierarchy không?

Ví dụ tốt:

```text
Vấn đề
→ mức độ
→ bằng chứng
→ hành động
```

Ví dụ xấu:

```text
Card
Card
Card
Table
Chart
```

---

# 5. CHUẨN HÓA APP SHELL

Audit:

```text
Sidebar
Topbar
Breadcrumb
Page container
Role switch
Notification
Account
Mobile navigation
```

---

## Sidebar

Không được có 15 mục cùng level.

Nhóm theo mental model.

Ví dụ Staff:

```text
TỔNG QUAN

XỬ LÝ
  Phản ánh
  Hiện trường
  Theo dõi

DỮ LIỆU
  Cảm biến
  Bằng chứng

BÁO CÁO
```

---

## Citizen

Không dùng sidebar desktop như staff.

Desktop có thể simple nav.

Mobile bottom nav:

```text
Trang chủ
Phản ánh
Bản đồ
Cộng đồng
Tài khoản
```

---

# 6. PAGE HEADER STANDARD

Không mọi page đều cần:

```text
icon
title
subtitle
3 actions
breadcrumb
badge
```

Chuẩn:

```text
Eyebrow optional

Title

One-line context optional

Primary CTA
Secondary CTA optional
```

---

# 7. CHUẨN HÓA STATUS

Xây một status dictionary.

Ví dụ Citizen Report:

```text
SUBMITTED
TRIAGED
VERIFYING
ACTION_REQUIRED
IN_PROGRESS
MONITORING
RESOLVED
CLOSED
REJECTED
```

Map sang Vietnamese copy.

Không page A:

> In progress

page B:

> Processing

page C:

> Đang thực hiện

nếu cùng status.

---

# 8. CHUẨN HÓA RISK

Tạo semantics thống nhất:

```text
LOW
MODERATE
HIGH
CRITICAL
```

Một color mapping.

Một icon mapping.

Một copy mapping.

Một accessibility label.

---

# 9. CHUẨN HÓA EMPTY / LOADING / ERROR

Mọi data surface phải có:

```text
LOADING
SUCCESS
EMPTY
ERROR
STALE
```

nếu phù hợp.

---

## Không dùng skeleton giả vô hạn

Nếu load lỗi:

phải chuyển error.

---

# 10. CHUẨN HÓA FEEDBACK

Mọi mutation:

```text
idle
→ submitting
→ success/error
```

Button trong lúc submit:

```text
Đang gửi...
```

disable duplicate submit.

Sau success:

không chỉ toast nếu action quan trọng.

---

# 11. MICRO-INTERACTION

Animation chỉ có mục tiêu.

Có thể dùng:

```text
status transition
timeline insertion
map pin focus
drawer transition
success confirmation
sensor live pulse
```

Không:

```text
every card hover floating
random gradients
continuous animation
```

---

# 12. MAP EXPERIENCE

DustGuard là spatial product.

Map phải là first-class component.

Audit:

```text
sensor
report
site
hotspot
mission
risk area
```

---

## Cluster

Nếu nhiều marker:

cluster.

---

## Marker semantics

Không dùng cùng pin cho mọi entity.

---

## Map selection

Click marker:

mở compact contextual panel.

Không navigate ngay nếu user chỉ muốn inspect.

---

# 13. EVIDENCE UX

Evidence là concept trung tâm của DustGuard.

Không chỉ gallery ảnh.

Evidence card có thể có:

```text
image/video
captured time
location
source
verification
related case
```

Nhưng chỉ show metadata phù hợp role.

---

## Citizen

đơn giản.

---

## Staff

đầy đủ verification.

---

# 14. TIMELINE UX

Dùng timeline cho lifecycle.

Không ép lifecycle vào table.

Timeline events nên phân biệt:

```text
system
citizen
community
staff
sensor
```

nhưng không màu mè.

---

# 15. CITIZEN “WHAT NEXT”

Mỗi status phải có next-step guidance.

Ví dụ:

### Đã gửi

> DustGuard đang tiếp nhận phản ánh của bạn.

### Đang xác minh

> Cán bộ hoặc cộng đồng đang kiểm tra thông tin tại khu vực.

### Đang theo dõi

> Khu vực đang được theo dõi sau xử lý.

### Đã xử lý

> Bạn có thể xác nhận tình trạng hiện tại.

---

# 16. COMMUNITY HUMANITY

Community page phải có dấu hiệu con người.

Có thể thể hiện:

```text
participant avatar
group name
verified actions
local activity
impact story
before/after
```

Không cần social feed phức tạp.

---

# 17. EXECUTIVE STORYTELLING

Thay vì:

```text
Risk Score: 78
```

có context:

```text
Nguy cơ cao

↑ 18 điểm so với hôm qua

Chủ yếu do:
PM2.5 tăng
3 phản ánh mới
1 công trình chưa khắc phục
```

Nếu dữ liệu thật hỗ trợ.

Không fabricate explanation.

---

# 18. TYPOGRAPHY SYSTEM

Audit toàn bộ.

Suggested baseline:

```text
Display / exceptional
32–36

Page title
24–28

Section
18–20

Card heading
15–16

Body
14

Secondary
13

Metadata
12
```

Không giảm còn 10px để nhét text.

---

# 19. SPACING SYSTEM

Không dùng random:

```text
13px
17px
21px
```

Chuẩn hóa scale theo design system hiện tại.

Ví dụ:

```text
4
8
12
16
20
24
32
40
48
```

Không bắt buộc đúng numbers này nếu project đã có tokens.

---

# 20. PAGE WIDTH

Không full 1920px vô hạn.

Phân theo screen type.

### Citizen content

```text
~1100–1280px
```

### Forms

```text
600–800px
```

### Staff table

có thể rộng hơn.

### Executive

```text
~1440–1600px
```

depending actual design.

---

# 21. TEXT OVERFLOW POLICY

Không truncate mặc định:

```text
status
priority
dates
sensor values
risk
important IDs
CTA
```

Có thể clamp:

```text
description
notes
address
community story
long evidence metadata
```

nhưng phải có reason.

---

# 22. BUTTON HIERARCHY

Chuẩn hóa:

```text
Primary
Secondary
Tertiary
Ghost
Danger
```

Không page có:

```text
5 filled red buttons
```

---

# 23. ICONS

Một icon library.

Không mix:

```text
emoji
Lucide
Heroicons
custom random SVG
```

trừ brand asset thực sự.

---

# 24. FORMS

Standard:

```text
label
optional helper
control
validation
```

Không placeholder thay label.

---

# 25. MODAL POLICY

Modal cho:

```text
confirmation
small edit
small context
```

Không dùng modal cho:

```text
complex report wizard
full mission creation
multi-stage investigation
```

---

# 26. TABLE POLICY

Staff/Admin/Executive:

table khi cần comparison.

Citizen/Community:

ưu tiên cards/list/timeline/map.

---

# 27. FILTER POLICY

Không render 9 filters ngang hàng.

Tách:

```text
primary filters
search
advanced filters
```

Mobile dùng sheet/drawer.

---

# 28. RESPONSIVE APP SHELL

Audit đặc biệt:

```text
sidebar collapse
header wrapping
filter rows
buttons
maps
tables
modals
drawers
cards
timeline
evidence gallery
```

---

# 29. DEVTOOLS ROOT CAUSE

Mọi lỗi visual phải inspect:

```text
element
parent
computed width
clientWidth
scrollWidth
display
grid
flex
min-width
max-width
overflow
white-space
line-height
```

Không đoán.

---

# 30. SEARCH TOÀN CODEBASE

Search:

```text
truncate
line-clamp
overflow-hidden
whitespace-nowrap

text-[10px]
text-[11px]

w-[...]
max-w-
min-w-

grid-cols-
shrink-0
flex-shrink

rounded-
shadow-
bg-gradient
```

Phân loại:

```text
CORRECT
QUESTIONABLE
BUG
OVERDESIGNED
```

---

# 31. AUDIT DESIGN “CARDITIS”

Search pages chứa quá nhiều nested cards.

Nếu:

```text
page
→ card
→ card
→ card
```

hãy xem lại grouping.

Không xóa card mù quáng.

---

# 32. AUDIT DUPLICATE UI PATTERNS

Tìm:

```text
3 different page headers
4 metric cards
5 status badge components
3 modal systems
multiple filter bars
```

Chuẩn hóa.

---

# 33. DATA INTEGRITY

UI polish không được che lỗi data.

Nếu metric load sai:

fix data path.

Không hardcode.

Không mock.

Không thay:

```text
undefined
```

bằng số giả.

---

# 34. KHÔNG PHÁ BUSINESS LOGIC

Không thay đổi:

```text
auth
RBAC
risk calculation
sensor ingestion
evidence integrity
SLA rules
report lifecycle
community verification
audit logging
```

chỉ để UI dễ code hơn.

Nếu phát hiện business bug:

ghi riêng và fix có chủ đích.

---

# 35. P0 SCREENS

Audit/fix trước:

```text
/login

/citizen
/citizen/report/new
/citizen/reports
/citizen/reports/:id

/community
/community/missions
/community/missions/:id
/community/my-activities

/staff
/staff/reports
/staff/reports/:id

/executive
```

Sau đó enumerate phần còn lại.

---

# 36. VISUAL REGRESSION

Chụp tối thiểu:

```text
1920×1080
1440×900
1366×768
1024×768
768×1024
430×932
390×844
360×800
```

P0 screens phải có screenshot.

---

# 37. RUNTIME TEST

Không chỉ screenshot.

Click:

```text
buttons
tabs
filters
dropdown
modal
drawer
map
upload
wizard
pagination
navigation
back
forward
refresh
```

---

# 38. ROLE TEST

Test ít nhất:

```text
Citizen
Community
Staff
Executive
Admin
```

Không assume cùng UI hoạt động.

---

# 39. COPY AUDIT

Search toàn bộ UI cho:

```text
English leftovers
developer words
acronyms
inconsistent capitalization
mixed terminology
too-long labels
vague CTA
```

---

# 40. “5 SECOND TEST”

Mỗi P0 screen phải pass:

Sau 5 giây user trả lời được:

### Citizen Home

```text
Không khí ra sao?
Tôi phản ánh ở đâu?
Phản ánh của tôi ở đâu?
```

### Community Home

```text
Tôi giúp gì?
Ở đâu?
Khi nào?
Tác động gì?
```

### Staff Home

```text
Việc nào khẩn cấp?
Việc nào của tôi?
Việc nào sắp quá hạn?
```

### Executive

```text
Nơi nào đang xấu?
Tại sao?
Có đang được xử lý không?
```

---

# 41. “REMOVE BRAND TEST”

Ẩn logo DustGuard.

Nếu UI trông y hệt generic SaaS admin:

Subagent 06 phải tiếp tục redesign.

Nhưng domain identity phải đến từ:

```text
information
visual hierarchy
maps
evidence
status
workflow
content
```

không phải chỉ từ màu đỏ.

---

# 42. “NO DECORATIVE COMPLEXITY”

Không tăng complexity chỉ để trông hiện đại.

Không cần:

```text
3D
glassmorphism
neon
animated gradient
huge hero illustrations
```

nếu không hỗ trợ usability.

---

# 43. “ONE PRIMARY JOB PER SCREEN”

Lead Agent phải audit từng screen.

Ví dụ:

```text
/citizen/report/new
JOB:
Gửi phản ánh.
```

Không thêm:

```text
news
leaderboard
sensor analytics
campaign banner
```

vào screen đó.

---

# 44. SSOT

Mọi entity:

```text
Report
Mission
Evidence
Sensor
Site
User
Organization
```

phải có semantic UI thống nhất.

Không module Citizen gọi `Report`, Community gọi cùng entity `Incident`, Staff gọi `Case` nếu không có business reason.

---

# 45. IMPLEMENTATION ORDER

## PASS 1

Inventory.

Không sửa.

---

## PASS 2

10 subagent audits.

---

## PASS 3

Lead synthesis.

---

## PASS 4

Fix:

```text
design tokens
shared shell
shared components
```

---

## PASS 5

Fix P0 pages.

---

## PASS 6

Fix remaining pages.

---

## PASS 7

Responsive.

---

## PASS 8

Runtime QA.

---

## PASS 9

Visual regression.

---

## PASS 10

UX debt audit lần cuối.

---

# 46. KHÔNG ĐƯỢC DỪNG SỚM

Không được dừng khi:

```text
đã redesign dashboard
```

Task hoàn thành khi:

```text
route inventory
+
10-agent audit
+
shared component normalization
+
P0 fixes
+
remaining route fixes
+
responsive
+
runtime QA
+
visual regression
```

đã hoàn tất trong phạm vi codebase có thể chạy.

---

# 47. OUTPUT CUỐI

Trả một report duy nhất:

```text
DUSTGUARD UX/UI REBUILD REPORT

1. Routes audited

2. Subagents executed
   Agent 01...
   ...
   Agent 10...

3. Top UX problems

4. Information architecture changes

5. Design system changes

6. Shared components changed

7. Citizen UX changes

8. Community UX changes

9. Staff UX changes

10. Executive UX changes

11. Mobile changes

12. Copy changes

13. Accessibility changes

14. Files changed

15. Runtime flows tested

16. Viewports tested

17. Visual regressions fixed

18. Screenshots produced

19. Remaining UX debt
```

---

# 48. MỖI SUBAGENT PHẢI BÁO CÁO THEO FORMAT

```text
SUBAGENT XX REPORT

Pages inspected:

User goal:

Current friction:

Root cause:

Severity:
P0 / P1 / P2 / P3

Recommended UX model:

Shared fix:

Page-specific fix:

Files/components involved:

Implemented:
YES / NO

Runtime verified:
YES / NO
```

Không chấp nhận:

> UI chưa tối ưu.

Phải cụ thể.

---

# 49. DEFINITION OF DONE

- [ ] 10 subagents đã thực sự chạy.
- [ ] Route inventory hoàn chỉnh.
- [ ] Không còn page không rõ mục đích.
- [ ] Navigation theo mental model role.
- [ ] Citizen không giống admin dashboard.
- [ ] Community tập trung vào hành động và impact.
- [ ] Staff tập trung vào next action.
- [ ] Executive tập trung vào decision.
- [ ] Không có generic KPI theater không cần thiết.
- [ ] Primary CTA rõ.
- [ ] Status semantics thống nhất.
- [ ] Risk semantics thống nhất.
- [ ] Shared components được chuẩn hóa.
- [ ] Typography thống nhất.
- [ ] Spacing thống nhất.
- [ ] Icons thống nhất.
- [ ] Empty/loading/error states tốt.
- [ ] Không truncate dữ liệu quan trọng.
- [ ] Không button rớt chữ.
- [ ] Không horizontal body overflow.
- [ ] Citizen mobile tốt.
- [ ] Community mobile tốt.
- [ ] Staff desktop dense nhưng dễ scan.
- [ ] Executive dễ đọc và drill-down.
- [ ] Không mock data.
- [ ] Không hardcode số liệu.
- [ ] Không phá auth.
- [ ] Không phá RBAC.
- [ ] Không phá sensor flow.
- [ ] Không phá report lifecycle.
- [ ] Không phá evidence integrity.
- [ ] Các mutation quan trọng chạy thật.
- [ ] Refresh không làm state sai.
- [ ] Runtime E2E pass.
- [ ] Visual regression pass.

---

# 50. NGUYÊN TẮC CUỐI

Đừng hỏi:

> Làm sao để DustGuard trông đẹp hơn?

Hãy hỏi:

> Với đúng người dùng này, trong đúng hoàn cảnh này, thông tin nào họ cần thấy trước và hành động tiếp theo là gì?

Sau đó mới thiết kế.

Mục tiêu cuối cùng không phải:

> một dashboard hiện đại.

Mà là:

> một hệ thống môi trường có cảm giác đang sống — dữ liệu đang đến, vấn đề đang được phát hiện, con người đang hành động, bằng chứng đang được xác minh và tác động đang được nhìn thấy.

DustGuard phải vừa có tính **công vụ**, vừa có tính **cộng đồng**, vừa giữ cảm giác **tin cậy, rõ ràng, thực tế**, không trở thành generic SaaS template.

Nếu sau khi sửa, user không cần đọc hướng dẫn mà vẫn biết mình cần làm gì tiếp theo, UI/UX mới được coi là đạt.