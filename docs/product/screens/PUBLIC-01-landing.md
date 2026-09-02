# PUB-01 — Cổng Thông Tin DustGuard VN
## Landing Page Product Design Requirements

---

## 1. SCREEN CONTRACT

- **Status**: `CURRENT`
- **Route**: `/`
- **Alias**: `/landing`
- **Primary Role**: `public`
- **Primary Audiences**:
  - Người dân
  - Ban giám khảo
  - Báo chí
  - Trường học / CLB môi trường
  - Đơn vị quản lý
  - Đối tác triển khai Pilot

- **Current Component**:
  `app/src/modules/public/LandingPage.jsx`

- **Primary Job**:

Trong 5–10 giây đầu tiên, giúp người xem hiểu:

> DustGuard biến một tín hiệu môi trường ban đầu thành một vụ việc có ưu tiên, bằng chứng, người phụ trách, tiến trình và kết quả có thể kiểm tra lại.

Landing Page phải đồng thời chứng minh 3 lớp giá trị:

1. DustGuard giải quyết một bài toán thực tế hiện tại: bụi đô thị.
2. DustGuard tạo ra một quy trình xử lý khép kín thay vì chỉ tạo thêm một kênh phản ánh.
3. Lõi quy trình này có thể được tái sử dụng cho các bài toán môi trường khác sau khi được cấu hình lại nghiệp vụ.

- **Success Condition**:

Người dùng sau khi xem trang phải trả lời được:

1. DustGuard giải quyết vấn đề gì?
2. Một vụ việc đi từ phát hiện đến kết quả như thế nào?
3. DustGuard khác một app gửi phản ánh ở điểm nào?
4. Ai tham gia trong quy trình?
5. Tại sao dữ liệu và kết quả có thể kiểm tra lại?
6. Công nghệ này có thể mở rộng sang bài toán nào khác?
7. Tôi có thể làm gì tiếp theo?

---

# 2. CORE PRODUCT POSITIONING

## Primary Message

**Biến tín hiệu môi trường thành hành động có thể theo dõi.**

DustGuard không chỉ tiếp nhận phản ánh.

Hệ thống kết nối:

```text
Tín hiệu
→ Xác minh
→ Ưu tiên
→ Hồ sơ
→ Phân công
→ Hành động
→ Tái kiểm
→ Kết quả
→ Lịch sử truy vết
```

## Current Use Case

Bài toán đầu tiên được DustGuard sử dụng để kiểm chứng mô hình:

**Giám sát bụi từ công trình xây dựng và giao thông đô thị.**

## Platform-Level Value

DustGuard không nên được định vị là:

> “Một phần mềm quản lý bụi.”

Mà là:

> **Một hệ thống quản lý vòng đời vấn đề môi trường, được kiểm chứng đầu tiên trên bài toán bụi đô thị.**

---

# 3. WHY THIS SCREEN EXISTS

Trong quản lý môi trường, vấn đề thường không nằm ở việc hoàn toàn thiếu dữ liệu.

Dữ liệu đã tồn tại nhưng nằm rời rạc:

- phản ánh cộng đồng;
- ảnh hiện trường;
- vị trí;
- công trình;
- đơn vị chịu trách nhiệm;
- hồ sơ;
- checklist;
- lịch sử xử lý;
- dữ liệu quan trắc;
- căn cứ chuyên môn.

Khoảng trống DustGuard giải quyết là:

> Làm thế nào biến những tín hiệu rời rạc thành một vụ việc đủ rõ để biết trường hợp nào cần chú ý trước, ai đang xử lý, còn thiếu gì và bước tiếp theo là gì.

DustGuard quản lý **vòng đời của một vấn đề**, thay vì chỉ quản lý một biểu mẫu phản ánh.

---

# 4. REUSABLE PRODUCT CORE

Đây là phần bắt buộc phải xuất hiện trên Landing Page.

## DustGuard Core

```text
INPUT SIGNAL
↓
NORMALIZE
↓
PRIORITIZE
↓
CREATE CASE
↓
ASSIGN
↓
COLLECT EVIDENCE
↓
TAKE ACTION
↓
REINSPECT
↓
CLOSE / REOPEN
↓
AUDIT
```

DustGuard chia hệ thống thành hai lớp.

### Lớp 1 — Reusable Core

Đây là phần có thể giữ nguyên khi triển khai sang bài toán khác:

- Signal Intake
- Case Management
- Priority Engine
- Evidence Management
- Maps / Location
- Assignment
- Workflow State
- Timeline
- Notifications
- Role & Permission
- Before / After Evidence
- Audit Trail
- Dashboard
- Reporting
- Human Approval
- API Integration

### Lớp 2 — Domain Pack

Đây là phần thay đổi theo từng lĩnh vực:

```text
Dust Pack
Water Pack
Waste Pack
Forest Pack
Flood Pack
Agriculture Pack
...
```

Mỗi Domain Pack định nghĩa:

- dữ liệu đầu vào;
- loại bằng chứng;
- tiêu chí ưu tiên;
- checklist;
- workflow;
- vai trò;
- ngưỡng cảnh báo;
- biểu mẫu;
- quy định chuyên ngành;
- điều kiện hoàn thành vụ việc.

Nguyên tắc:

> Không viết lại hệ thống cho mỗi bài toán mới. Giữ nguyên lõi quản lý vụ việc và thay lớp nghiệp vụ.

---

# 5. REUSE VALUE — TỪ DUSTGUARD ĐẾN CÁC CASE KHÁC

Landing Page phải có một section riêng thể hiện khả năng này.

## Một lõi — nhiều bài toán

### Case 01 — Bụi công trình

```text
Phản ánh / PM2.5
→ Xác minh công trình
→ Xếp mức ưu tiên
→ Yêu cầu xử lý
→ Ảnh trước/sau
→ Tái kiểm
```

### Case 02 — Ô nhiễm nước

```text
Phản ánh / dữ liệu quan trắc
→ Xác minh vị trí
→ Lấy mẫu / bổ sung bằng chứng
→ Phân công
→ Theo dõi xử lý
→ Tái kiểm
```

### Case 03 — Rác thải đô thị

```text
Ảnh + vị trí
→ Phân loại điểm tồn đọng
→ Phân công đơn vị
→ Thu gom
→ Ảnh hoàn thành
→ Đóng vụ việc
```

### Case 04 — Điểm nóng cháy / mất rừng

```text
Tín hiệu vệ tinh
→ Xác minh
→ Tạo case
→ Giao đội hiện trường
→ Bằng chứng thực địa
→ Kết quả
```

### Case 05 — Ngập đô thị

```text
Phản ánh + lượng mưa + vị trí
→ Gom cụm
→ Xếp ưu tiên
→ Điều phối
→ Theo dõi điểm ngập
→ Đánh giá sau xử lý
```

### Case 06 — Tuân thủ môi trường

```text
Hồ sơ + checklist + dữ liệu hiện trường
→ Phát hiện thiếu
→ Yêu cầu bổ sung
→ Kiểm tra
→ Phê duyệt
→ Audit Trail
```

Thông điệp quan trọng:

> DustGuard không tuyên bố hiện tại đã giải quyết toàn bộ các lĩnh vực trên.

> Giá trị tái sử dụng nằm ở kiến trúc quản lý tín hiệu, hồ sơ, bằng chứng, workflow, phân quyền và audit. Mỗi lĩnh vực vẫn cần được thiết kế và kiểm chứng cùng người làm nghiệp vụ thực tế.

---

# 6. ENTRY / EXIT / NAVIGATION

## Entry Points

- Tên miền DustGuard
- QR truyền thông
- Social Sharing
- Link từ cuộc thi
- Báo chí
- Đối tác Pilot

## Primary Exit Points

### `Xem bản đồ`
→ `/map`

### `Gửi phản ánh`
→ `/citizen/report/new`

Nếu cần xác thực:
→ `/login`

### `Trải nghiệm`
→ `/demo` hoặc `DemoModal`

### `Xem cách hoạt động`
→ Scroll tới Workflow

### `Xem khả năng mở rộng`
→ Scroll tới Reusable Core

### `Đăng ký Pilot`
→ `PilotModal`

### `Đăng nhập`
→ `/login`

---

# 7. LANDING NAVIGATION

Menu desktop không nên vượt quá 6 item.

```text
DustGuard
Vấn đề
Cách hoạt động
Bằng chứng
Khả năng mở rộng
Pilot

[Xem demo]
```

Không dùng các menu kỹ thuật như:

```text
Architecture
Database
D1
AI Engine
IoT Stack
```

Các nội dung đó chỉ xuất hiện khi người dùng chủ động mở phần kỹ thuật.

---

# 8. HUMAN-CENTRIC COGNITIVE FLOW

Landing Page phải được thiết kế theo thứ tự nhận thức, không theo thứ tự module phần mềm.

```text
0–5s
DustGuard làm gì?

↓

// Hero

5–15s
Tại sao cần DustGuard?

↓

// Problem

15–30s
Một vụ việc được xử lý thế nào?

↓

// Closed Loop

30–45s
Làm sao biết nó thực sự được xử lý?

↓

// Evidence + Before/After

45–60s
Ai tham gia?

↓

// Roles

60–75s
DustGuard chỉ dùng cho bụi?

↓

// Reusable Core

75–90s
Đã có gì để chứng minh?

↓

// Impact

90s+
Thử ngay / xem bản đồ / pilot
```

---

# 9. SECTION HIERARCHY

Landing Page đề xuất chuyển từ 8 section hiện tại thành **9 section rõ nghĩa hơn**.

---

## SECTION 01 — HERO

### Eyebrow

`GIÁM SÁT BỤI ĐÔ THỊ`

### Main Heading

**Phát hiện vấn đề. Theo dõi đến khi có kết quả.**

### Supporting Copy

DustGuard kết nối phản ánh, dữ liệu hiện trường và quá trình xử lý trong một hồ sơ có thể theo dõi từ đầu đến cuối.

### Primary CTA

`Xem bản đồ`

### Secondary CTA

`Trải nghiệm`

### Visual

Không dùng dashboard chung chung.

Hero phải hiển thị trực tiếp một case:

```text
DG-2026-0842

Phát hiện
→ Đã xác minh
→ Đang xử lý
→ Chờ tái kiểm
```

kèm:

- địa điểm;
- mức ưu tiên;
- ảnh hiện trường;
- người phụ trách;
- bước tiếp theo.

Người dùng nhìn visual phải hiểu sản phẩm mà không cần đọc đoạn văn.

---

# 10. SECTION 02 — THE GAP

## Heading

**Vấn đề không kết thúc khi phản ánh được gửi đi.**

Ba khoảng trống:

### Phản ánh bị phân tán

Không hình thành được một hồ sơ xuyên suốt.

### Khó biết trường hợp nào cần xử lý trước

Người quản lý phải tự tổng hợp nhiều nguồn thông tin.

### Thiếu khả năng theo dõi đến kết quả

Người gửi không biết vụ việc đã được xử lý đến đâu.

Không viết dài hơn 25–30 từ/card.

---

# 11. SECTION 03 — CLOSED-LOOP WORKFLOW

## Heading

**Một vấn đề. Một quy trình xuyên suốt.**

### 01 — Phát hiện

Người dân hoặc nguồn dữ liệu tạo tín hiệu.

### 02 — Xác minh

Ảnh, vị trí, dữ liệu và hồ sơ được tập hợp.

### 03 — Xử lý

Vụ việc được ưu tiên và giao đúng người phụ trách.

### 04 — Tái kiểm

Kết quả được kiểm tra lại trước khi đóng hồ sơ.

Visual:

```text
SIGNAL
→ EVIDENCE
→ ACTION
→ OUTCOME
```

Không giải thích workflow bằng đoạn văn dài.

---

# 12. SECTION 04 — EVIDENCE & ACCOUNTABILITY

## Heading

**Không chỉ “đã xử lý”. Phải kiểm tra được.**

Hiển thị:

```text
TRƯỚC XỬ LÝ      SAU XỬ LÝ
[IMAGE]           [IMAGE]
```

Metadata nhỏ:

```text
Thời gian
Vị trí
Người cập nhật
Mã xác thực
```

CTA:

`Xem bằng chứng`

Mở `EvidenceModal`.

### Integrity Layer

SHA-256 chỉ nên xuất hiện như metadata hỗ trợ:

`Tệp đã được xác thực`

Không đưa thuật ngữ crypto/hash thành headline chính.

---

# 13. SECTION 05 — PEOPLE & RESPONSIBILITY

## Heading

**Mỗi người một phần việc. Cùng theo dõi một vụ việc.**

### Công dân

Phát hiện và theo dõi kết quả.

### Cộng đồng / Sinh viên

Bổ sung dữ liệu và tái kiểm hiện trường.

### Cán bộ

Xác minh, ưu tiên và điều phối.

### Đơn vị xử lý

Nhận yêu cầu và cập nhật kết quả.

### Quản lý

Theo dõi tiến độ và toàn bộ lịch sử.

Visual nên là một workflow nối 5 vai trò, không phải 5 card hoàn toàn độc lập.

---

# 14. SECTION 06 — REUSABLE CORE

Đây là section đang thiếu trong PDR cũ.

## Heading

**Bắt đầu từ bụi. Lõi hệ thống có thể dùng cho nhiều vấn đề môi trường.**

### Subheading

DustGuard tách phần quản lý vụ việc khỏi nghiệp vụ chuyên ngành.

### Visual chính

```text
                ┌───────────────┐
                │ Dust          │
                │ Water         │
                │ Waste         │
SIGNAL ENGINE → │ Forest        │ → CASE WORKFLOW
                │ Flood         │
                │ Other Packs   │
                └───────────────┘
```

Hoặc tốt hơn:

```text
       DUST
       WATER
       WASTE
       FOREST
          ↓
┌─────────────────────────┐
│    DUSTGUARD CORE       │
│                         │
│ Signal                  │
│ Priority                │
│ Case                    │
│ Assignment              │
│ Evidence                │
│ Workflow                │
│ Audit                   │
└─────────────────────────┘
          ↓
      OUTCOME
```

### Core Capabilities

Chỉ hiển thị 6 item:

```text
Tiếp nhận tín hiệu
Ưu tiên
Hồ sơ
Điều phối
Bằng chứng
Truy vết
```

CTA:

`Xem cách mở rộng`

---

# 15. SECTION 07 — TECHNOLOGY

Công nghệ là bằng chứng hỗ trợ, không phải câu chuyện chính.

## Heading

**Đủ nhẹ để bắt đầu nhỏ. Đủ mở để mở rộng sau.**

Ba ý:

### Không phụ thuộc cảm biến

Pilot có thể bắt đầu bằng ảnh, vị trí và dữ liệu sẵn có.

### Nguồn dữ liệu mở

Có thể bổ sung cảm biến, camera, vệ tinh hoặc API sau.

### Human-in-the-loop

Công nghệ hỗ trợ ưu tiên và tổng hợp; con người vẫn chịu trách nhiệm với quyết định chuyên môn.

### Optional Detail Drawer

Người quan tâm kỹ thuật có thể mở:

```text
Xem kiến trúc kỹ thuật
```

Sau đó mới hiển thị:

- Cloudflare
- D1
- R2
- Workers
- ESP32
- PMS7003
- SHA-256

---

# 16. SECTION 08 — REAL PRODUCT

## Heading

**Không chỉ là concept.**

Cho phép xem trực tiếp 3 màn hình thực:

### Người dân

```text
Gửi phản ánh
```

### Cán bộ

```text
Xử lý vụ việc
```

### Quản lý

```text
Theo dõi toàn hệ thống
```

Không cần nhồi cả dashboard vào landing.

Mỗi preview chỉ cần:

- screenshot;
- tên vai trò;
- một hành động chính;
- CTA `Xem demo`.

---

# 17. SECTION 09 — IMPACT & PILOT

## Heading

**Kiểm chứng bằng những vòng triển khai nhỏ.**

Không dùng những vanity metrics thiếu nguồn.

Ưu tiên các metric mang tính vận hành:

```text
Vụ việc có đủ bằng chứng

Thời gian từ tín hiệu → hành động

Tỷ lệ được tái kiểm

Tỷ lệ theo dõi tới kết quả

Vụ việc tồn đọng
```

Nếu dữ liệu production chưa đủ:

Hiển thị rõ:

```text
Dữ liệu Demo
Pilot
Đang kiểm chứng
```

không trình bày như số liệu đã triển khai thực địa.

### Final CTA

**Một vấn đề môi trường đáng được theo dõi đến cùng.**

Buttons:

`Trải nghiệm`

`Đăng ký Pilot`

---

# 18. REUSABILITY CONTRACT

Đây là contract dành cho agents khi phát triển hệ thống.

Không được hard-code toàn bộ DustGuard theo domain bụi.

Các module phải được phân biệt:

```text
CORE
DOMAIN
CONFIGURATION
CONTENT
```

## Core

Reusable giữa các domain:

```text
Case
Signal
Evidence
Assignment
Workflow
Timeline
Audit
User
Role
Location
Notification
```

## Domain

Có thể thay đổi:

```text
DustIncident
WaterIncident
WasteIncident
ForestIncident
...
```

## Configuration

Các thông số domain-specific phải có khả năng cấu hình:

```text
case types
statuses
priority factors
checklists
evidence types
roles
required fields
completion rules
```

## Content

Landing page được phép nói về DustGuard Dust Monitoring.

Core application không được phụ thuộc toàn bộ vào copy của landing page.

---

# 19. DOMAIN ADAPTER PRINCIPLE

Khi mở rộng sang một case mới, agent không được copy toàn bộ module hiện tại rồi sửa tên.

Phải đánh giá:

```text
Cái gì giữ nguyên?
Cái gì chỉ thay config?
Cái gì thực sự cần module mới?
```

Ví dụ:

```text
CASE CORE
├── metadata
├── status
├── priority
├── assignee
├── timeline
├── evidence
└── audit
```

Dust-specific:

```text
Dust Case Extension
├── PM2.5
├── PM10
├── construction site
├── dust mitigation checklist
└── dust regulations
```

Water-specific:

```text
Water Case Extension
├── water source
├── sampling
├── water indicators
├── discharge point
└── water regulations
```

Không duplicate phần `Case Core`.

---

# 20. DATA CONTRACT

Landing Page tuyệt đối không tự tạo số liệu.

### Public Stats API

```text
GET /api/public/landing-stats
```

Possible response:

```text
casesResolved
activeSites
casesReinspected
communityHours
pilotCount
```

UI phải phân biệt:

```text
REAL
DEMO
ESTIMATE
PROPOSED
```

Không fallback sang một con số trông giống production nếu API lỗi.

Nếu không có dữ liệu:

```text
—
```

hoặc:

```text
Dữ liệu demo
```

---

# 21. MODALS

## DemoModal

Mục tiêu:

Cho người xem hiểu hệ thống từ góc nhìn từng vai trò.

Không gọi là:

`Demo 5 Roles System Sandbox`

UI:

```text
Bạn muốn xem DustGuard với vai trò nào?

Người dân
Cộng đồng
Cán bộ
Đơn vị xử lý
Quản lý
```

---

## EvidenceModal

Hiển thị:

- Before;
- After;
- timestamp;
- location;
- case;
- verification state;
- history.

---

## PilotModal

Không hỏi quá nhiều thông tin.

Fields:

```text
Tên
Đơn vị
Email / SĐT
Bạn muốn thử DustGuard cho vấn đề gì?
```

Optional domain:

```text
Bụi
Rác
Nước
Khác
```

Field cuối này đồng thời giúp kiểm chứng nhu cầu reuse.

---

# 22. CONTENT RULES

## 10-SECOND RULE

Không section nào yêu cầu người dùng đọc quá khoảng 10 giây để hiểu ý chính.

### Heading

Tối đa khoảng:

```text
8–12 từ
```

### Supporting copy

Tối đa:

```text
20–30 từ
```

### Card

Tối đa:

```text
1 heading
1 sentence
```

### CTA

Ưu tiên:

```text
Xem bản đồ
Trải nghiệm
Xem bằng chứng
Xem cách hoạt động
Đăng ký Pilot
```

Không dùng CTA dài 5–10 từ.

---

# 23. JARGON RULE

Không xuất hiện trực tiếp trên luồng đọc chính:

```text
Edge SQLite
HMAC-SHA256
D1
R2
Web Standard Fetch API
Modular Monolith
CSR Escrow
GRI 304
GRI 305
```

Các nội dung này nằm trong:

```text
Technical Details
Architecture
Evidence
Appendix
```

Landing Page giải thích **giá trị trước**, công nghệ sau.

---

# 24. RESPONSIVE CONTRACT

## Desktop

Target:

```text
1366×768
1440×900
1920×1080
```

Mỗi viewport đầu tiên phải nhìn thấy:

- positioning;
- main CTA;
- product visual.

Không để Hero cao quá mức khiến CTA nằm dưới fold.

## Mobile

Target:

```text
360
375
390
430
```

Rules:

```text
padding ≥ 16px
tap target ≥ 44px
primary CTA ≥ 48px
no horizontal scrolling
no card requiring tiny text
```

Hai CTA trong Hero được phép stack.

---

# 25. PERFORMANCE

Target:

```text
LCP < 1.2s
CLS ≈ 0
INP < 200ms
```

`<0.8s page load` không nên là acceptance cứng nếu chưa định nghĩa:

- thiết bị;
- vị trí;
- network;
- cache state.

Lazy-load:

- screenshots;
- video;
- below-fold visual;
- modal assets.

Hero asset phải được ưu tiên.

---

# 26. ACCESSIBILITY

Required:

- WCAG AA contrast;
- keyboard navigation;
- visible focus;
- semantic heading hierarchy;
- modal focus trap;
- `Escape` closes modal;
- `aria-label` cho icon button;
- reduced-motion support.

---

# 27. ACCEPTANCE CRITERIA

## Communication

- [ ] Trong 5 giây hiểu DustGuard làm gì.
- [ ] Trong 15 giây hiểu workflow Signal → Outcome.
- [ ] Không bị hiểu thành một app gửi phản ánh đơn thuần.
- [ ] Không bị hiểu rằng AI tự kết luận vi phạm.
- [ ] Người xem hiểu bụi là use case đầu tiên.
- [ ] Người xem hiểu core có thể tái sử dụng.

## Product

- [ ] `/map` hoạt động.
- [ ] Report CTA hoạt động.
- [ ] Demo hoạt động.
- [ ] Evidence Modal hoạt động.
- [ ] Pilot Modal hoạt động.
- [ ] Stats dùng dữ liệu thật hoặc ghi rõ Demo.

## UX

- [ ] Không section nào quá dày chữ.
- [ ] Không CTA dài dòng.
- [ ] Mobile 360px không vỡ.
- [ ] Không horizontal overflow.
- [ ] Header đồng nhất với design system.
- [ ] ScrollSpy hoạt động đúng.

## Technical

- [ ] Zero runtime console errors.
- [ ] Zero broken images.
- [ ] Zero dead CTA.
- [ ] Zero CLS đáng kể.
- [ ] Keyboard accessible.
- [ ] VI/EN persisted.
- [ ] Modals đóng bằng Escape.

## Reuse Architecture

- [ ] Không hard-code workflow chỉ cho Dust.
- [ ] Core Case Model độc lập với Dust fields.
- [ ] Evidence có cấu trúc dùng lại được.
- [ ] Status transition không gắn cứng vào một domain.
- [ ] Priority Engine nhận domain factors.
- [ ] Checklist có khả năng cấu hình.
- [ ] Role mapping có khả năng cấu hình.
- [ ] Audit Trail dùng chung.
- [ ] Domain-specific fields tách khỏi Core.

---

# 28. IMPLEMENTATION STATUS MODEL

Không chỉ dùng:

```text
CURRENT
PARTIAL
PROPOSED
```

Nên chuẩn hóa:

```text
CURRENT
WORKING
DEMO
PARTIAL
PROPOSED
NOT_VERIFIED
```

Ví dụ:

```text
CURRENT
Landing structure

WORKING
Case lifecycle

DEMO
Một số impact metrics

PARTIAL
Before/After slider

PROPOSED
3D station visualization

NOT_VERIFIED
Replication to another environmental domain
```

Điều này tránh Landing Page vô tình trình bày một ý tưởng tương lai như chức năng đã kiểm chứng.

---

# 29. PRODUCT PRINCIPLE

Mọi agent làm Landing Page phải tuân theo thứ tự:

```text
PROBLEM
↓
ACTION
↓
EVIDENCE
↓
OUTCOME
↓
REUSE
↓
TECHNOLOGY
```

Không được đảo thành:

```text
AI
↓
IoT
↓
Cloudflare
↓
SHA-256
↓
Feature list
```

DustGuard phải được kể như một sản phẩm giúp con người quản lý một vấn đề tốt hơn, không phải một showcase công nghệ.

---

# 30. ONE-SENTENCE PRODUCT MODEL

Mọi màn hình, copy và demo của Landing Page phải thống nhất với câu:

> **DustGuard biến một tín hiệu môi trường thành một hồ sơ có ưu tiên, người phụ trách, bằng chứng, tiến trình và kết quả có thể kiểm tra lại.**

Và câu mở rộng:

> **Bụi đô thị là bài toán đầu tiên; lõi quản lý tín hiệu → hồ sơ → hành động → kết quả được thiết kế để có thể tái sử dụng cho những bài toán môi trường khác sau khi cấu hình lại nghiệp vụ.**