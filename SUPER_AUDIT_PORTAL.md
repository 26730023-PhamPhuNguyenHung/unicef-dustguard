# SUPER AUDIT — LOGIN, COMMUNITY & CITIZEN PORTAL DUSTGUARD VN

## 0. Mục tiêu audit

Hãy audit và hoàn thiện toàn bộ 3 khu vực:

1. **Authentication / Login / Account / Authorization**
2. **Community Portal — Cộng đồng, thanh niên, tình nguyện viên**
3. **Citizen Portal — Người dân phản ánh và theo dõi môi trường**

Không audit theo kiểu chỉ đọc source code rồi viết file `.md`.

Phải audit theo **runtime thực tế**:

**UI → Interaction → API → Auth → Database → Business Logic → State → Permission → Error handling → Responsive**

Mọi tính năng chỉ được đánh dấu **DONE** khi đã thực sự chạy được trên giao diện.

---

# I. NGUYÊN TẮC CHUNG

DustGuard không nên có nhiều trang chỉ để “cho đủ module”.

Mỗi màn hình phải trả lời được:

- Người dùng vào đây để làm gì?
- Primary action là gì?
- Sau khi thao tác thì dữ liệu đi đâu?
- Dữ liệu nào là SSOT?
- Ai có quyền xem?
- Ai có quyền sửa?
- Trạng thái tiếp theo của đối tượng là gì?
- Nếu API lỗi thì UI xử lý thế nào?
- Nếu refresh trình duyệt thì dữ liệu có còn đúng không?

Không được tồn tại:

- mock data giả nhưng nhìn giống dữ liệu thật;
- CRUD chỉ thay state frontend;
- nút có UI nhưng không có action;
- route tồn tại nhưng không có nhiệm vụ rõ ràng;
- 2 trang làm cùng một việc;
- dữ liệu Citizen và Community tự quản lý hai bản khác nhau;
- role switcher cho phép giả mạo quyền;
- dashboard hiển thị KPI được hard-code;
- upload ảnh không thực sự lưu R2;
- action thành công nhưng refresh lại mất;
- API trả lỗi nhưng frontend vẫn hiện success toast.

---

# II. KIẾN TRÚC ROLE

DustGuard nên có role model rõ ràng.

## 1. Public

Không đăng nhập.

Có thể:

- xem thông tin DustGuard;
- xem bản đồ môi trường công khai;
- xem hướng dẫn phản ánh;
- xem hướng dẫn cảm biến;
- xem hoạt động cộng đồng công khai;
- xem bảng vinh danh;
- bắt đầu tạo phản ánh nhưng phải xác thực trước khi submit nếu hệ thống yêu cầu tài khoản.

---

## 2. Citizen

Người dân.

Có thể:

- gửi phản ánh;
- upload ảnh/video;
- lấy GPS;
- theo dõi phản ánh;
- bổ sung bằng chứng;
- nhận cập nhật;
- xác nhận tình trạng sau xử lý;
- đánh giá kết quả;
- xem hoạt động cộng đồng;
- đăng ký tham gia chiến dịch cộng đồng nếu muốn.

Không được:

- xử lý phản ánh;
- thay đổi priority;
- xem dữ liệu nội bộ cán bộ;
- xem thông tin cá nhân người phản ánh khác.

---

## 3. Community Member / Volunteer

Thanh niên / tình nguyện viên / CLB / nhóm cộng đồng.

Có quyền Citizen và thêm:

- tham gia nhiệm vụ cộng đồng;
- check-in hoạt động;
- nộp bằng chứng;
- nhận điểm đóng góp / tín chỉ xanh;
- xem lịch sử đóng góp;
- tham gia chiến dịch;
- đăng ký nhóm / CLB nếu mô hình DustGuard sử dụng tổ chức.

---

## 4. Community Leader

Trưởng nhóm / điều phối viên.

Có thể:

- tạo hoặc quản lý hoạt động được phân quyền;
- duyệt thành viên;
- xem danh sách tham gia;
- xác minh bằng chứng;
- quản lý check-in;
- tổng hợp kết quả chiến dịch.

---

## 5. Staff

Cán bộ xử lý.

Có thể:

- nhận phản ánh;
- phân loại;
- xác minh;
- tạo nhiệm vụ hiện trường;
- upload evidence;
- chuyển xử lý;
- theo dõi 24–48h;
- đóng hồ sơ.

---

## 6. Manager / Executive

Có thể xem:

- dashboard tổng hợp;
- SLA;
- heatmap;
- tình trạng địa bàn;
- hiệu suất xử lý;
- rủi ro;
- báo cáo.

---

## 7. Admin

Có quyền quản trị:

- user;
- role;
- permission;
- địa bàn;
- taxonomy;
- cấu hình hệ thống.

Không dùng Admin như một role xử lý nghiệp vụ thay Staff.

---

# III. AUDIT LOGIN / AUTHENTICATION

## 1. Mục tiêu của Login

Login không chỉ có:

> Email  
> Password  
> Login

Nó phải giải quyết đầy đủ vòng đời tài khoản:

**Đăng ký → Xác thực → Đăng nhập → Resolve role → Resolve organization → Resolve địa bàn → Redirect đúng workspace → Refresh session → Logout**

---

# IV. MÀN HÌNH `/login`

## Bố cục

Desktop:

**Left 55%**

Branding DustGuard:

> DustGuard VN  
> Cùng cộng đồng phát hiện và xử lý nguy cơ ô nhiễm bụi.

Có thể có:

- ảnh thành phố;
- bản đồ;
- cảm biến;
- hoạt động cộng đồng.

**Right 45%**

Login card.

Không cần quá nhiều marketing copy.

---

## Nội dung login card

### Header

> Đăng nhập DustGuard

Subtext:

> Tiếp tục vào không gian làm việc của bạn.

### Field

Email / số điện thoại

Password

### Actions

Đăng nhập

Quên mật khẩu

Đăng ký tài khoản

---

## Social login

Nếu Clerk/Auth provider hỗ trợ:

- Google

Không cần nhồi quá nhiều provider nếu không có use case.

---

# V. ROLE RESOLUTION SAU LOGIN

Không cho user tự chọn:

> Tôi là Staff  
> Tôi là Admin  
> Tôi là Citizen

Role switcher chỉ được dùng nếu cùng một account thực sự có nhiều role.

Backend phải trả:

```ts
{
  userId,
  roles,
  permissions,
  defaultWorkspace,
  organizationId,
  jurisdictionId
}
```

Frontend dựa vào đó redirect.

Ví dụ:

Citizen:

```text
/citizen
```

Community member:

```text
/community
```

Staff:

```text
/staff
```

Executive:

```text
/executive
```

Admin:

```text
/admin
```

---

# VI. AUTH GUARD

Audit tất cả protected route.

Ví dụ:

```text
/staff/*
/admin/*
/executive/*
/community/manage/*
```

Không được chỉ hide menu frontend.

Phải kiểm tra permission ở API.

Ví dụ:

Citizen gọi:

```http
PATCH /api/reports/:id/status
```

thì server phải trả:

```text
403 Forbidden
```

không phải frontend hide nút là đủ.

---

# VII. AUTH STATE MACHINE

Chuẩn hóa:

```text
UNKNOWN
↓
CHECKING_SESSION
↓
AUTHENTICATED
hoặc
UNAUTHENTICATED
```

Nếu authenticated:

```text
LOAD_PROFILE
↓
LOAD_ROLES
↓
LOAD_WORKSPACE
↓
READY
```

Không redirect khi auth vẫn ở trạng thái UNKNOWN.

Điều này tránh:

```text
login
→ dashboard
→ login
→ dashboard
```

hoặc flicker.

---

# VIII. LOGIN ERROR UX

Phải xử lý rõ:

### Sai password

> Email hoặc mật khẩu chưa đúng.

Không leak:

> Email tồn tại nhưng password sai.

### Session hết hạn

> Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.

### Không có quyền

Route:

```text
/unauthorized
```

Hiển thị:

> Bạn không có quyền truy cập khu vực này.

Có CTA:

> Quay lại trang phù hợp

---

# IX. AUDIT SESSION

Test:

- login;
- refresh;
- mở tab mới;
- đóng tab;
- token hết hạn;
- logout;
- back browser;
- mở protected URL trực tiếp;
- account bị disable.

Logout phải revoke session.

Không chỉ:

```ts
localStorage.removeItem(...)
```

---

# X. TRANG `/citizen`

Đây phải là **Citizen Home**, không phải dashboard kiểu quản trị.

Người dân không quan tâm:

- số record database;
- API latency;
- tổng số sensor;
- số task nội bộ.

Họ quan tâm:

> Không khí quanh tôi thế nào?

> Tôi có thể phản ánh vấn đề gì?

> Phản ánh của tôi đang được xử lý tới đâu?

---

# XI. CITIZEN HOME — BỐ CỤC ĐỀ XUẤT

## Hero

Headline:

> Không khí quanh bạn hôm nay thế nào?

Hiển thị:

- AQI / PM2.5 gần nhất;
- trạng thái;
- địa điểm;
- thời gian cập nhật.

Ví dụ:

> PM2.5: 48 µg/m³  
> Mức cần chú ý  
> Cập nhật 6 phút trước

CTA chính:

> Phản ánh ô nhiễm

CTA phụ:

> Xem bản đồ

---

# XII. QUICK ACTIONS

4 action tối đa:

### Phản ánh ô nhiễm

### Theo dõi phản ánh

### Xem bản đồ

### Tham gia cộng đồng

Không tạo 8–12 card chức năng.

---

# XIII. KHU VỰC “GẦN BẠN”

Map preview.

Pin:

- sensor;
- report;
- construction site;
- hotspot.

Có filter đơn giản:

```text
Chất lượng không khí
Phản ánh
Công trình
```

Không expose dữ liệu nhạy cảm.

---

# XIV. KHU VỰC “PHẢN ÁNH CỦA BẠN”

Hiện tối đa 3–5 phản ánh gần nhất.

Mỗi item:

> Bụi công trình

> Nguyễn Văn Linh, Q.7

> Đang xác minh

> 25/08/2026

CTA:

> Xem chi tiết

Footer:

> Xem tất cả phản ánh

---

# XV. `/citizen/report/new`

Đây là một trong những màn hình quan trọng nhất DustGuard.

Không làm một form dài.

Dùng Wizard.

---

# XVI. REPORT WIZARD — 5 BƯỚC

## STEP 1 — Điều gì đang xảy ra?

Các category:

- Bụi công trình
- Khói / đốt
- Xe vận chuyển vật liệu
- Công trình không che chắn
- Bụi đường
- Mùi / khí bất thường
- Khác

Hiển thị icon + label.

---

# XVII. STEP 2 — Vị trí

Cho phép:

### Dùng vị trí hiện tại

Browser GPS.

### Chọn trên bản đồ

Pin draggable.

### Nhập địa chỉ

Geocoding.

Hiển thị cuối:

> 125 Nguyễn Văn Linh  
> P. Tân Phong, Q.7, TP.HCM

Không chỉ lưu string.

Nên lưu:

```text
latitude
longitude
formatted_address
ward
district
province
```

---

# XVIII. STEP 3 — Bằng chứng

Upload:

- ảnh;
- video nếu cần.

Preview.

Cho:

- xoá;
- thêm;
- xem full-screen.

Upload phải thực sự:

```text
Client
→ API signed upload
→ R2
→ evidence table
```

Không được dùng local preview làm evidence thật.

---

# XIX. STEP 4 — Mô tả

Prompt hướng dẫn:

> Bạn nhìn thấy điều gì?

> Hiện tượng xảy ra vào thời gian nào?

> Tình trạng kéo dài bao lâu?

Field:

```text
description
observed_at
frequency
severity perception
```

Không bắt người dân nhập thuật ngữ chuyên môn.

---

# XX. STEP 5 — Xác nhận

Preview:

- loại;
- vị trí;
- thời gian;
- ảnh;
- mô tả.

CTA:

> Gửi phản ánh

Sau submit:

```text
POST /api/reports
```

Backend tạo:

```text
report_id
public_code
status
created_at
risk_score
```

---

# XXI. SUCCESS SCREEN

Không chỉ toast:

> Thành công!

Phải có màn hình success.

Ví dụ:

> Đã gửi phản ánh

> Mã phản ánh: DG-260826-0192

> DustGuard sẽ cập nhật khi phản ánh được tiếp nhận hoặc cần thêm thông tin.

Actions:

> Theo dõi phản ánh

> Gửi phản ánh khác

---

# XXII. REPORT STATUS MODEL

Không dùng status tùy tiện.

SSOT:

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

Citizen-facing labels:

```text
Đã gửi
Đã tiếp nhận
Đang xác minh
Đang xử lý
Đang theo dõi
Đã xử lý
Đã kết thúc
Không đủ căn cứ
```

---

# XXIII. `/citizen/reports`

Không cần dashboard phức tạp.

Top:

> Phản ánh của tôi

Tabs:

```text
Đang xử lý
Đã hoàn thành
Tất cả
```

Card:

> DG-260826-0192

> Bụi công trình

> 125 Nguyễn Văn Linh

> Đang xác minh

> Gửi 2 giờ trước

Có status chip.

---

# XXIV. `/citizen/reports/:id`

Đây là **timeline case page**.

Header:

```text
Bụi công trình
DG-260826-0192
```

Status:

> Đang xử lý

---

## Evidence

Hiển thị bằng chứng người dân gửi.

---

## Location

Mini map.

---

## Timeline

Ví dụ:

```text
09:25
Bạn đã gửi phản ánh

09:31
DustGuard đã tiếp nhận

10:02
Đã chuyển đến cán bộ phụ trách

11:15
Đang xác minh tại hiện trường
```

Timeline lấy từ event table.

Không generate frontend.

---

# XXV. ACTION “BỔ SUNG BẰNG CHỨNG”

Citizen có thể:

> Bổ sung ảnh / thông tin

Backend phải append evidence.

Không overwrite evidence ban đầu.

Audit log:

```text
evidence_added
actor
timestamp
```

---

# XXVI. SAU KHI RESOLVED

Citizen được hỏi:

> Tình trạng hiện tại đã cải thiện chưa?

Actions:

```text
Đã cải thiện
Chưa cải thiện
Không chắc
```

Nếu:

> Chưa cải thiện

có thể tạo:

```text
REOPEN_REQUEST
```

Không tự động đổi status thành IN_PROGRESS.

Staff phải review.

---

# XXVII. CITIZEN PROFILE

`/citizen/profile`

Chỉ gồm:

- tên;
- email;
- điện thoại;
- notification;
- privacy;
- account.

Không biến profile thành admin settings.

---

# XXVIII. COMMUNITY PORTAL — ĐỊNH VỊ

Community không nên chỉ là:

> bảng xếp hạng điểm xanh.

Community phải là:

> **Nơi biến dữ liệu môi trường thành hành động cộng đồng có bằng chứng.**

Flow:

```text
Issue
→ Community mission
→ Participant
→ Action
→ Evidence
→ Verification
→ Impact
→ Recognition
```

---

# XXIX. ROUTE COMMUNITY ĐỀ XUẤT

```text
/community
/community/missions
/community/missions/:id
/community/my-activities
/community/impact
/community/leaderboard
/community/groups
/community/profile
```

Nếu không thật sự cần:

Không tạo thêm nhiều route.

---

# XXX. `/community`

Community Home.

Hero:

> Hành động nhỏ. Dữ liệu thật. Tác động nhìn thấy được.

CTA:

> Khám phá hoạt động

---

## Impact snapshot

Không dùng KPI fake.

Ví dụ:

```text
24
hoạt động đã hoàn thành

318
người tham gia

586
bằng chứng được xác minh

12
điểm nóng được cải thiện
```

Data phải aggregate DB.

---

# XXXI. “HOẠT ĐỘNG GẦN BẠN”

Card:

> Theo dõi bụi quanh trường học

> Quận 7

> Thứ Bảy, 08:00

> 12 / 20 người

CTA:

> Xem hoạt động

---

# XXXII. “VIỆC CÓ THỂ LÀM NGAY”

Micro actions:

- ghi nhận bụi;
- kiểm tra hiện trường;
- chụp ảnh sau xử lý;
- hỗ trợ khảo sát;
- xác minh tình trạng.

Không phải activity nào cũng cần event offline lớn.

---

# XXXIII. `/community/missions`

Filter:

```text
Gần tôi
Đang mở
Sắp diễn ra
Đã tham gia
```

Optional:

```text
Loại hoạt động
Quận / huyện
```

Không đặt 10 filter.

---

# XXXIV. MISSION CARD

Thông tin:

> Kiểm tra che chắn công trình

> Q.7

> 1.2 km

> 28/08 · 08:00

> 8 / 12 người

Impact:

> Xác minh 5 điểm phản ánh

CTA:

> Tham gia

---

# XXXV. `/community/missions/:id`

Màn hình phải đầy đủ:

## Mission header

Tên.

Trạng thái.

Thời gian.

Địa điểm.

---

## Mục tiêu

Ví dụ:

> Xác minh tình trạng bụi tại 5 điểm đã được người dân phản ánh.

---

## Cần làm gì

Checklist:

```text
Check-in đúng vị trí
Chụp ảnh hiện trạng
Điền checklist
Submit evidence
```

---

## Điều kiện tham gia

Nếu cần:

```text
18+
Thành viên CLB
Được Leader duyệt
```

Không bắt buộc nếu activity đơn giản.

---

## Participants

Hiện:

```text
8 / 12 người
```

Không cần expose full PII.

---

## CTA

Chưa đăng ký:

> Tham gia hoạt động

Đã đăng ký:

> Xem nhiệm vụ của tôi

---

# XXXVI. JOIN FLOW

```text
JOIN_REQUESTED
↓
CONFIRMED
↓
CHECKED_IN
↓
SUBMITTED
↓
VERIFIED
↓
COMPLETED
```

Không dùng boolean:

```text
joined = true
```

vì không quản lý được lifecycle.

---

# XXXVII. CHECK-IN

Có thể dùng:

- GPS;
- QR;
- Leader confirm.

MVP nên dùng:

```text
GPS + timestamp
```

Nếu nằm ngoài bán kính cho phép:

> Bạn chưa ở trong khu vực hoạt động.

Không fake check-in.

---

# XXXVIII. EVIDENCE SUBMISSION

Người tham gia submit:

- ảnh;
- mô tả;
- checklist;
- GPS;
- timestamp.

Evidence phải có:

```text
submission_id
mission_id
participant_id
file_id
location
submitted_at
verification_status
```

---

# XXXIX. VERIFICATION

Leader / Staff verify.

Status:

```text
PENDING
VERIFIED
REJECTED
NEEDS_REVISION
```

Nếu reject:

Phải có reason.

---

# XL. GREEN CREDIT / TÍN CHỈ XANH

Không biến thành crypto/token nếu chưa có lý do.

Nên coi là **impact score / recognition points**.

Point chỉ cấp sau:

```text
Evidence VERIFIED
```

Không cấp khi chỉ click join.

Example:

```text
Tham gia hoạt động: 2
Check-in hợp lệ: 2
Evidence verified: 5
Hoàn thành nhiệm vụ: 3
```

Điểm là configurable.

---

# XLI. `/community/my-activities`

Tabs:

```text
Sắp tới
Đang làm
Đã hoàn thành
```

Card:

> Kiểm tra bụi quanh trường học

> 28/08/2026

> Đã xác nhận tham gia

CTA:

> Xem nhiệm vụ

---

# XLII. `/community/impact`

Đây là trang quan trọng hơn leaderboard.

Headline:

> Tác động của bạn

Metrics:

```text
8
hoạt động

21
bằng chứng được xác minh

4
điểm nóng đã hỗ trợ

126
điểm đóng góp
```

---

## Impact timeline

Ví dụ:

> 23/08  
> Xác minh phản ánh bụi tại Nguyễn Văn Linh

> 17/08  
> Theo dõi sau xử lý tại công trình A

> 09/08  
> Tham gia khảo sát quanh trường THCS B

---

# XLIII. `/community/leaderboard`

Leaderboard chỉ là supporting page.

Không đặt nó làm home page Community.

Filters:

```text
Tuần
Tháng
Toàn thời gian
```

Hiện:

```text
Tên
Nhóm
Impact points
Verified actions
```

Không ranking dựa chỉ vào số post hoặc số check-in.

---

# XLIV. COMMUNITY GROUPS

Nếu DustGuard có CLB / CTXH / đoàn thanh niên:

```text
/community/groups
```

Group card:

> CLB Môi trường HCMUTE

> 42 thành viên

> 16 hoạt động

> 138 evidence verified

CTA:

> Xem nhóm

---

# XLV. COMMUNITY LEADER VIEW

Chỉ Leader mới thấy management area.

Không làm sidebar riêng quá lớn.

Ví dụ:

```text
/community/manage/missions
/community/manage/members
/community/manage/evidence
```

---

# XLVI. MISSION CREATION

Nếu community leader được quyền tạo mission:

Wizard:

### 1. Mục tiêu

### 2. Địa điểm

### 3. Thời gian

### 4. Số người

### 5. Checklist

### 6. Evidence required

### 7. Publish

---

# XLVII. CITIZEN ↔ COMMUNITY CONNECTION

Đây là phần DustGuard hiện cần làm rõ nhất.

Không xây Citizen và Community như 2 hệ thống độc lập.

Flow ví dụ:

```text
Citizen report
DG-260826-0192
↓
Staff verifies
↓
Needs community monitoring
↓
Create community mission
↓
Volunteers participate
↓
Evidence
↓
Staff verifies
↓
Report timeline updated
```

Community mission phải có thể reference:

```text
report_id
site_id
incident_id
```

---

# XLVIII. REPORT DETAIL CỦA CITIZEN

Citizen có thể nhìn thấy:

> Cộng đồng đang hỗ trợ xác minh tình trạng.

Nhưng không cần expose:

- tên cán bộ;
- workflow nội bộ;
- metadata nhạy cảm.

---

# XLIX. COMMUNITY USER

Trong mission có thể nhìn:

> Nhiệm vụ này hỗ trợ xác minh một phản ánh cộng đồng.

Không cần expose người gửi phản ánh.

Privacy by default.

---

# L. DATABASE SSOT ĐỀ XUẤT

Không bắt buộc đúng tên table nhưng concept phải rõ:

```text
users
profiles
roles
user_roles

reports
report_events
report_evidence

missions
mission_participants
mission_submissions

evidence
files

organizations
community_groups
group_members

sites
sensor_stations
sensor_readings

notifications
audit_logs
```

---

# LI. EVIDENCE SSOT

Không tạo:

```text
report_images
mission_images
staff_images
inspection_images
```

nếu cùng concept.

Nên:

```text
evidence
```

với:

```text
id
entity_type
entity_id
file_id
actor_id
evidence_type
captured_at
lat
lng
verification_status
created_at
```

---

# LII. EVENT TIMELINE SSOT

Không hard-code timeline UI.

Nên có:

```text
report_events
```

Ví dụ:

```text
REPORT_CREATED
REPORT_TRIAGED
REPORT_ASSIGNED
FIELD_VISIT_STARTED
EVIDENCE_ADDED
MONITORING_STARTED
REPORT_RESOLVED
REPORT_REOPEN_REQUESTED
```

Citizen UI tự map sang câu dễ hiểu.

---

# LIII. NOTIFICATION CENTER

Citizen + Community dùng một notification engine.

Events ví dụ:

```text
Report status changed
Additional evidence requested
Mission approved
Mission reminder
Evidence verified
Mission completed
```

Notification center:

Bell icon.

Dropdown 5 gần nhất.

Route:

```text
/notifications
```

nếu cần xem tất cả.

---

# LIV. EMPTY STATES

Phải audit toàn bộ empty state.

Ví dụ Citizen chưa có report:

> Bạn chưa gửi phản ánh nào.

CTA:

> Gửi phản ánh đầu tiên

Community chưa tham gia:

> Bạn chưa tham gia hoạt động nào.

CTA:

> Khám phá hoạt động

Không để:

```text
No data
[]
0 records
```

---

# LV. LOADING STATE

Không cho màn hình trắng.

Dùng:

- skeleton;
- spinner nhỏ;
- disabled button.

Không dùng fullscreen loading cho thao tác nhỏ.

---

# LVI. ERROR STATE

Nếu API lỗi:

> Không thể tải phản ánh lúc này.

Actions:

> Thử lại

Không hiện stack trace.

---

# LVII. MOBILE FIRST

Citizen và Community phần lớn phải tốt trên mobile.

Audit ở:

```text
360px
375px
390px
430px
768px
1024px
1440px
```

Đặc biệt kiểm:

- sidebar;
- header;
- map;
- modal;
- upload image;
- wizard;
- timeline;
- bottom sheet;
- CTA.

---

# LVIII. MOBILE NAVIGATION

Citizen nên dùng bottom nav:

```text
Trang chủ
Phản ánh
Bản đồ
Cộng đồng
Tài khoản
```

Không dùng desktop sidebar ép xuống mobile.

---

# LIX. COMMUNITY MOBILE NAV

Có thể dùng chung app shell:

```text
Trang chủ
Hoạt động
Tác động
Thông báo
Tài khoản
```

Không duplicate nav system nếu cùng app.

---

# LX. MAP UX

Trên mobile:

Map không được chiếm full page mặc định.

Cho:

```text
Map/List toggle
```

Report card bottom sheet.

---

# LXI. ACCESSIBILITY

Audit:

- contrast;
- keyboard;
- focus;
- alt image;
- form label;
- aria;
- button hitbox ≥ 44px;
- không dùng màu là indicator duy nhất.

---

# LXII. PERFORMANCE

Citizen Home phải nhanh.

Không load:

```text
10.000 sensor readings
```

vào frontend.

API trả aggregate.

Map dùng viewport query.

Ví dụ:

```http
GET /api/map/features?bbox=...
```

---

# LXIII. SECURITY

Audit:

- object-level authorization;
- IDOR;
- upload MIME;
- upload size;
- rate limiting;
- XSS;
- API permissions;
- user input;
- signed upload;
- GPS trust level.

Không tin:

```text
role
userId
organizationId
```

gửi từ client.

Backend derive từ authenticated session.

---

# LXIV. PRIVACY

Không hiển thị:

- email;
- phone;
- tên đầy đủ;
- location chính xác của citizen

cho community member khác.

Citizen report public nếu có phải anonymized.

---

# LXV. AUDIT CRUD THỰC TẾ

Mỗi feature phải test:

### CREATE

Tạo trên UI.

Kiểm DB.

Refresh.

Phải còn.

---

### READ

Load từ DB.

Không mock.

---

### UPDATE

Edit.

Refresh.

Data vẫn đúng.

---

### DELETE

Nếu nghiệp vụ cho phép.

Kiểm DB.

Không chỉ remove khỏi UI.

---

# LXVI. NETWORK AUDIT

Với mỗi action quan trọng inspect:

```text
request
status
payload
response
```

Không cho:

```text
200 OK
{
  success: true
}
```

nếu DB mutation thực ra fail.

---

# LXVII. RUNTIME ACCEPTANCE TEST — LOGIN

Phải PASS:

- đăng ký Citizen;
- login;
- login sai;
- logout;
- refresh;
- session expiry;
- role redirect;
- unauthorized route;
- direct URL access;
- account disabled;
- mobile login.

---

# LXVIII. RUNTIME ACCEPTANCE TEST — CITIZEN

Phải PASS end-to-end:

```text
Citizen login
↓
Citizen Home
↓
New Report
↓
GPS
↓
Upload image
↓
Submit
↓
DB record exists
↓
R2 file exists
↓
Report appears in My Reports
↓
Report detail
↓
Timeline
↓
Staff changes status
↓
Citizen sees updated status
↓
Citizen adds evidence
↓
Evidence exists after refresh
```

---

# LXIX. RUNTIME ACCEPTANCE TEST — COMMUNITY

Phải PASS:

```text
Community member login
↓
Browse mission
↓
Join
↓
Refresh
↓
Join status persists
↓
Check-in
↓
Upload evidence
↓
Submit
↓
Leader verifies
↓
Impact points update
↓
Mission becomes completed
↓
Impact history shows action
```

---

# LXX. CROSS-FLOW TEST

Test quan trọng nhất:

```text
Citizen creates report
↓
Staff triages
↓
Staff creates community mission linked to report
↓
Community joins
↓
Community submits evidence
↓
Staff verifies evidence
↓
Citizen report timeline receives update
↓
Staff resolves report
↓
Citizen confirms improvement
```

Nếu flow này chạy được, DustGuard mới thật sự là một hệ thống.

---

# LXXI. INFORMATION ARCHITECTURE ĐỀ XUẤT

```text
/
├── login
├── register
├── unauthorized
│
├── citizen
│   ├── /
│   ├── report/new
│   ├── reports
│   ├── reports/:id
│   ├── map
│   └── profile
│
├── community
│   ├── /
│   ├── missions
│   ├── missions/:id
│   ├── my-activities
│   ├── impact
│   ├── leaderboard
│   ├── groups
│   └── profile
│
├── staff
│   └── ...
│
├── executive
│   └── ...
│
└── admin
    └── ...
```

---

# LXXII. CÁC TRANG NÊN MERGE / LOẠI BỎ

Audit hiện trạng và phát hiện:

### Hai trang cùng hiển thị reports

Merge.

### `my-work` nhưng Community đã có `my-activities`

Không duplicate.

### `citizen/dashboard`

Nếu chỉ là Citizen Home thì route nên là:

```text
/citizen
```

### Community có cả:

```text
/tasks
/activities
/missions
/actions
```

nếu cùng concept thì chỉ giữ:

```text
/missions
```

### Citizen có:

```text
/report
/feedback
/complaint
/incident
```

nếu đều là phản ánh môi trường thì chuẩn hoá về:

```text
/reports
```

---

# LXXIII. DESIGN SYSTEM

Citizen & Community phải cùng DustGuard design system.

Không được:

Citizen = xanh

Community = tím

Staff = đỏ

Admin = xanh dương

như 4 sản phẩm khác nhau.

DustGuard có một visual identity.

Role khác nhau qua:

- information hierarchy;
- navigation;
- permissions;

không cần mỗi role một brand.

---

# LXXIV. TRANG CITIZEN LÝ TƯỞNG

Khi mở `/citizen`, người dân trong vòng 5 giây phải biết:

1. Không khí quanh họ hiện thế nào.
2. Có vấn đề thì bấm đâu để phản ánh.
3. Phản ánh trước của họ đang ở đâu.
4. Gần họ đang có sự việc gì.

Nếu màn hình không trả lời 4 câu này thì thiết kế lại.

---

# LXXV. TRANG COMMUNITY LÝ TƯỞNG

Khi mở `/community`, thành viên trong vòng 5 giây phải biết:

1. Có hoạt động gì gần mình.
2. Mình có thể giúp gì.
3. Mình đang tham gia việc nào.
4. Đóng góp của mình tạo tác động gì.

Nếu Community chỉ hiện leaderboard và news feed thì thiết kế lại.

---

# LXXVI. LOGIN LÝ TƯỞNG

Khi login:

```text
Authenticate
↓
Load profile
↓
Resolve role
↓
Resolve permissions
↓
Redirect workspace
```

Không:

```text
Login
↓
User chọn role tùy ý
↓
Frontend tự cho quyền
```

---

# LXXVII. OUTPUT AUDIT BẮT BUỘC

Sau khi audit codebase và runtime, phải xuất:

## A. Route Inventory

| Route | Role | Purpose | Status | Keep/Merge/Delete |
|---|---|---|---|---|

---

## B. Feature Matrix

| Feature | UI | API | DB | Auth | Runtime | Result |
|---|---|---|---|---|---|---|

---

## C. Broken Flow

Ví dụ:

```text
Citizen report upload
UI PASS
API PASS
R2 FAIL
DB PASS
=> BROKEN
```

---

## D. Duplicate Feature

Liệt kê:

```text
Route A
Route B
Same purpose
Decision: merge into ...
```

---

## E. Missing Feature

P0 / P1 / P2.

---

# LXXVIII. PRIORITY

## P0 — bắt buộc

- Login thực
- Role guard
- Citizen report CRUD
- GPS
- Evidence R2
- My Reports
- Report Detail
- Status timeline
- Community mission
- Join
- Check-in
- Evidence
- Verify
- Report ↔ Mission relationship

---

## P1

- Notifications
- Impact score
- leaderboard
- groups
- map filters
- citizen post-resolution feedback

---

## P2

- gamification;
- badges;
- social sharing;
- advanced analytics;
- campaign storytelling.

Không làm P2 trước khi P0 chạy ổn.

---

# LXXIX. DEFINITION OF DONE

Một feature chỉ DONE khi:

```text
UI exists
+
Interaction works
+
API works
+
DB persisted
+
Correct permissions
+
Refresh persists
+
Loading handled
+
Errors handled
+
Mobile works
+
Runtime tested
```

Thiếu một mục:

```text
NOT DONE
```

---

# LXXX. MỤC TIÊU CUỐI CÙNG

DustGuard phải tạo thành một vòng khép kín:

```text
CẢM BIẾN / NGƯỜI DÂN
          ↓
      PHÁT HIỆN
          ↓
       PHẢN ÁNH
          ↓
       XÁC MINH
       ↙       ↘
   CÁN BỘ     CỘNG ĐỒNG
       ↘       ↙
       BẰNG CHỨNG
          ↓
        XỬ LÝ
          ↓
       THEO DÕI
          ↓
    XÁC NHẬN CẢI THIỆN
          ↓
       ĐÓNG HỒ SƠ
```

Citizen Portal là nơi **phát hiện và theo dõi vấn đề**.

Community Portal là nơi **huy động hành động và tạo evidence**.

Staff Portal là nơi **ra quyết định và xử lý nghiệp vụ**.

Executive Portal là nơi **quan sát toàn hệ thống và điều hành**.

Authentication là lớp đảm bảo **đúng người → đúng dữ liệu → đúng hành động → đúng workspace**.

Không được xây các portal như những dashboard tách rời. Tất cả phải cùng vận hành trên một SSOT và cùng một lifecycle nghiệp vụ.