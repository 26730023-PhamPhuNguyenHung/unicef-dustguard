# TASK: DustGuard VN — UI/UX Productization + Design System Hardening

Bạn đang tiếp tục trên codebase DustGuard VN đã hoàn thành phase tái kiến trúc theo:

- DDD
- Agent Operating System
- SSOT
- Youth Community Action Flow
- Cloudflare Workers + D1
- Community-centric architecture

Codebase hiện tại đã có:

- 379/379 tests passing
- Production build thành công
- `.agent/ssot/*`
- `.agent/memory-bank/*`
- Community routes `/community/*`
- Observation → Evidence → Follow-up → Handoff → Impact
- Landing page mới
- Backend/domain/repository/API đã hoạt động

## MỤC TIÊU CỦA PHASE NÀY

Không tái kiến trúc lại hệ thống.

Không thay đổi domain model nếu không có bằng chứng kỹ thuật rõ ràng.

Không tạo một UI system mới song song.

Không viết thêm mock feature chỉ để giao diện trông đầy đủ.

Phase này tập trung vào:

> Biến DustGuard từ một sản phẩm “đã có chức năng” thành một civic-tech product hoàn chỉnh, có design system thống nhất, UI chuyên nghiệp, responsive tốt, dễ sử dụng ngoài thực địa và đủ chất lượng để trình diễn tại vòng chung kết.

Ưu tiên theo thứ tự:

1. Design System / Design Tokens SSOT
2. Component standardization
3. UX interaction
4. Responsive mobile-first
5. Visual hierarchy
6. Accessibility
7. Loading / empty / error / success states
8. Real-data integrity
9. DevTools visual QA
10. Performance
11. Regression tests

---

# 1. NGUYÊN TẮC BẮT BUỘC

## 1.1 Preserve Architecture

Đọc trước:

- `AGENTS.md`
- `.agent/ssot/PRODUCT.md`
- `.agent/ssot/DOMAIN.md`
- `.agent/ssot/ROUTES.md`
- `.agent/ssot/DATABASE.md`
- `.agent/ssot/API.md`
- `.agent/ssot/UI.md`
- `.agent/ssot/AUTH.md`
- `.agent/ssot/TESTING.md`
- `.agent/memory-bank/CURRENT_STATE.md`
- `.agent/memory-bank/ACTIVE_CONTEXT.md`
- `.agent/memory-bank/KNOWN_ISSUES.md`
- `.agent/memory-bank/LESSONS.md`

Sau đó audit code thực tế.

Documentation KHÔNG được mặc định là đúng.

Source code + runtime behavior + database + browser behavior mới là bằng chứng cuối cùng.

Không được claim một feature hoạt động chỉ vì component/API/file tồn tại.

---

# 2. THIẾT LẬP DESIGN SYSTEM THÀNH SSOT

Audit toàn bộ CSS, Tailwind/config, inline styles, component styles và các token hiện tại.

Tìm:

- màu hard-code
- spacing hard-code
- border-radius không thống nhất
- shadow tùy tiện
- font-size tự phát
- button mỗi trang một kiểu
- card mỗi trang một kiểu
- input mỗi trang một kiểu
- badge/status không thống nhất
- icon size không thống nhất
- breakpoint khác nhau
- duplicated component

Sau đó chuẩn hóa thành Design Tokens duy nhất.

## Color tokens

Giữ bản sắc civic-tech hiện tại:

```txt
cream       #FDFBF7
ink         #231B14
teal        #0D6F64
seal-red    #9F241F
```

Nhưng không được chỉ có 4 màu raw.

Phải tạo semantic tokens như:

```txt
--color-bg-page
--color-bg-surface
--color-bg-subtle

--color-text-primary
--color-text-secondary
--color-text-muted
--color-text-inverse

--color-border-default
--color-border-strong

--color-brand-primary
--color-brand-primary-hover
--color-brand-primary-active

--color-success
--color-warning
--color-danger
--color-info

--color-status-open
--color-status-followup
--color-status-handoff
--color-status-resolved
```

Component không được gọi trực tiếp raw hex nếu không thực sự cần thiết.

---

# 3. TYPOGRAPHY SYSTEM

Thiết lập một typography scale rõ ràng.

Ví dụ semantic roles:

```txt
display
h1
h2
h3
title
body-lg
body
body-sm
label
caption
metric
```

Mỗi role cần có SSOT cho:

- font-size
- line-height
- font-weight
- letter-spacing

Không để:

```css
font-size: 13px
font-size: 15px
font-size: 17px
```

xuất hiện ngẫu nhiên khắp codebase.

Đặc biệt kiểm tra tiếng Việt:

- dấu không bị clipping
- line-height đủ
- button không rớt chữ
- label không xuống dòng vô lý
- số liệu không bị lệch baseline

---

# 4. SPACING / LAYOUT TOKENS

Thiết lập spacing scale thống nhất.

Ví dụ:

```txt
4
8
12
16
20
24
32
40
48
64
80
```

Không sử dụng hàng chục giá trị margin/padding ngẫu nhiên.

Chuẩn hóa:

- page horizontal padding
- section gap
- card padding
- card gap
- form gap
- table row height
- toolbar height
- navigation height
- bottom navigation safe-area

---

# 5. COMPONENT LIBRARY — SSOT 100%

Audit toàn bộ UI và hợp nhất component trùng lặp.

Tối thiểu phải có SSOT component cho:

## Actions

- Button
- IconButton
- ButtonGroup
- FloatingActionButton

Button variants:

```txt
primary
secondary
outline
ghost
danger
link
```

Sizes:

```txt
sm
md
lg
```

States:

```txt
default
hover
focus
active
disabled
loading
```

Yêu cầu:

- tap target >= 44px trên mobile
- loading không làm button đổi width
- icon alignment chính xác
- focus-visible rõ ràng
- disabled khác loading

---

## Form

Chuẩn hóa:

- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- SearchInput
- DateInput
- LocationInput
- FileUpload
- ImageUpload
- FormField
- FieldLabel
- FieldHint
- FieldError

Không tạo input custom riêng cho từng màn hình nếu cùng behavior.

---

## Feedback

SSOT:

- Toast
- Alert
- InlineMessage
- ErrorState
- EmptyState
- LoadingState
- Skeleton
- ProgressIndicator
- ConfirmDialog

Không dùng `window.alert()` nếu đã có UI component phù hợp.

---

## Display

SSOT:

- Card
- MetricCard
- CaseCard
- ObservationCard
- ActionCard
- CampaignCard
- ImpactCard
- EvidenceCard

Nếu khác nhau chỉ về content:

→ dùng composition/variant.

Không copy một component 5 lần.

---

## Navigation

Chuẩn hóa:

- AppHeader
- DesktopSidebar
- MobileBottomNav
- Breadcrumb
- Tabs
- Stepper
- BackButton

Active state phải thống nhất.

---

## Data

Chuẩn hóa:

- Badge
- StatusBadge
- Avatar
- Timeline
- DataTable
- List
- Pagination
- Metric
- ProgressBar
- EvidencePreview

---

# 6. BUTTON & INTERACTION AUDIT

Đây là phần ưu tiên cao.

Kiểm tra 100% nút trên toàn bộ hệ thống.

Với từng button/link/action:

1. Có thể click không?
2. Có action thực không?
3. Route có tồn tại không?
4. Permission có đúng không?
5. Có loading state không?
6. Có success/error feedback không?
7. Có double-submit protection không?
8. Có keyboard focus không?
9. Mobile có đủ 44px không?
10. Label có mô tả đúng action không?

Không được tồn tại CTA giả.

Không được tồn tại:

```txt
button đẹp nhưng không làm gì
```

Nếu feature chưa tồn tại:

- implement thực
- hoặc disable rõ ràng
- hoặc remove

Không giả lập success.

---

# 7. MOBILE-FIRST COMMUNITY EXPERIENCE

Primary Actor là:

> Thanh niên / thành viên CLB môi trường đi thực địa.

Vì vậy `/community/*` phải ưu tiên mobile.

Test ít nhất:

```txt
360px
375px
390px
412px
768px
1024px
1440px
```

Đặc biệt kiểm tra ngoài thực địa:

- thao tác một tay
- button ở thumb-zone
- form không quá dài
- sticky primary action
- không cần zoom
- camera/file upload dễ dùng
- location dễ xác nhận
- stepper dễ hiểu
- offline/network error có feedback
- keyboard không che nút submit
- bottom navigation không che content
- safe-area iPhone

---

# 8. REDESIGN CREATE OBSERVATION

Route:

```txt
/community/observe
```

Đây là một trong các màn hình quan trọng nhất.

Wizard hiện có 5 bước:

```txt
Danh mục
→ Ảnh bằng chứng
→ Vị trí
→ Mô tả
→ Tư cách ghi nhận
```

Không thay business flow nếu không cần.

Nhưng cải tiến trải nghiệm.

## Step 1 — Loại vấn đề

Dùng visual cards hoặc selectable chips đủ lớn:

- Bụi công trình
- Rác thải
- Nước thải
- Đốt rơm rạ
- Thuốc BVTV
- Khí thải
- Khác

Có icon semantic.

Không dùng icon trang trí khó hiểu.

## Step 2 — Bằng chứng

Ưu tiên:

```txt
[ Chụp ảnh ]
[ Chọn từ thư viện ]
```

Sau upload hiển thị:

- thumbnail
- timestamp
- GPS status
- integrity status
- SHA-256 ở phần technical details, không ép user thường phải đọc hash dài

Dùng progressive disclosure.

## Step 3 — Location

Hiển thị:

```txt
📍 Vị trí đã xác định
Độ chính xác: ± Xm

[Điều chỉnh vị trí]
```

Nếu không có permission:

đưa ra fallback rõ ràng.

## Step 4 — Mô tả

Không bắt người dùng viết báo cáo dài.

Có prompt:

```txt
Bạn đang quan sát thấy điều gì?
```

Có suggestion tags nếu hữu ích.

## Step 5 — Identity

Làm rõ:

```txt
Ghi nhận với tư cách:
○ Cá nhân
○ Thành viên CLB
○ Đại diện chiến dịch
```

Cuối flow cho preview trước khi submit.

---

# 9. OBSERVATION DETAIL — EVIDENCE FIRST

Trang chi tiết phải kể được câu chuyện:

```txt
Điều gì xảy ra?
↓
Bằng chứng nào?
↓
Ai xác minh?
↓
Đã xử lý gì?
↓
Sau 24–48h tình hình thay đổi thế nào?
↓
Có cần bàn giao không?
```

Visual hierarchy ưu tiên:

1. Case status
2. Evidence
3. Location
4. Current action
5. Follow-up
6. Handoff
7. Audit metadata

Technical information:

- hashes
- IDs
- raw timestamps
- audit identifiers

được đặt trong:

```txt
Chi tiết kỹ thuật
```

không chiếm visual hierarchy chính.

---

# 10. CASE WORKSPACE

`CommunityCaseWorkspace`

Hiện có 6 tabs:

- Tổng quan
- Bằng chứng
- Hành động
- Theo dõi lại
- Bàn giao
- Lịch sử kiểm toán

Audit lại UX.

Không để mobile phải horizontal-scroll khó sử dụng.

Có thể sử dụng:

- segmented selector
- scrollable tab với active indicator rõ
- hoặc section navigation phù hợp

Trang phải trả lời ngay:

```txt
Vụ việc này đang ở đâu?
Ai chịu trách nhiệm bước tiếp theo?
Deadline là khi nào?
Tôi cần làm gì?
```

Đặt `Next Best Action` nổi bật.

---

# 11. FOLLOW-UP 24H–48H

Đây là feature tạo khác biệt.

Làm nổi bật UX:

```txt
Điểm nóng cần quay lại
```

Mỗi card hiển thị:

- ảnh ban đầu
- địa điểm
- thời gian còn lại
- deadline
- người phụ trách
- status

CTA:

```txt
[Quay lại kiểm tra]
```

Khi follow-up:

```txt
Tình hình hiện tại:

[ Tốt hơn ]
[ Không đổi ]
[ Tệ hơn ]
```

Sau đó yêu cầu evidence mới.

Hiển thị comparison:

```txt
TRƯỚC                     SAU
[ảnh]                      [ảnh]

20/08 — 15:20             21/08 — 16:03
```

Tạo cảm giác:

> dữ liệu → hành động → thay đổi thực tế.

---

# 12. HANDOFF UX

Không biến handoff thành một form hành chính phức tạp.

UI phải nói bằng ngôn ngữ người dùng:

```txt
Bàn giao vụ việc
```

Cho biết:

- gửi cho ai
- lý do
- bằng chứng đi kèm
- trạng thái
- thời điểm bàn giao
- phản hồi nhận được

Timeline:

```txt
Ghi nhận
→ Xác minh
→ Theo dõi
→ Bàn giao
→ Tiếp nhận
→ Xử lý
```

---

# 13. COMMUNITY HOME

Trang `/community` không được giống admin dashboard.

Đây là action dashboard.

Above the fold phải trả lời:

```txt
Hôm nay tôi có thể làm gì?
```

Primary action:

```txt
+ Ghi nhận vấn đề môi trường
```

Secondary:

```txt
Việc cần làm
Điểm cần quay lại
Chiến dịch gần bạn
Tác động của tôi
```

Sau đó mới đến metrics.

Không nhồi quá nhiều số liệu.

---

# 14. IMPACT PAGE

Không chỉ gamification.

Phân chia:

## Tác động cá nhân

- ghi nhận
- follow-up
- vụ việc cải thiện
- thời gian đóng góp

## Tác động CLB

- thành viên
- chiến dịch
- khu vực
- vụ việc cải thiện

## Tác động cộng đồng

- vấn đề được phát hiện
- vấn đề đã cải thiện
- vấn đề đã bàn giao
- thời gian phản hồi

Nếu có:

```txt
20 giờ → 4 tín chỉ
80 ĐRL
```

không hard-code như một quy luật phổ quát nếu chưa có policy chính thức.

Biến thành configurable policy.

Ví dụ:

```txt
RecognitionPolicy
```

theo từng trường/chương trình.

Đây là yêu cầu domain/data, không chỉ UI.

---

# 15. LANDING PAGE

Làm landing page có chất lượng cuộc thi.

Không dùng stock photo tùy tiện.

Ưu tiên:

- product UI
- workflow illustrations
- evidence cards
- before/after
- impact metrics
- network diagram

Visual narrative:

```txt
Một người trẻ nhìn thấy vấn đề
↓
Ghi nhận trong 30–60 giây
↓
Tạo bằng chứng số
↓
CLB cùng theo dõi
↓
Quay lại sau 24–48h
↓
Bàn giao nếu cần
↓
Đo được thay đổi
```

Hero phải trả lời trong vài giây:

### DustGuard là gì?

Một nền tảng civic-tech giúp thanh niên biến những quan sát môi trường ngoài đời thành dữ liệu có bằng chứng, hành động theo dõi và tác động có thể đo lường.

CTA chính:

```txt
Bắt đầu ghi nhận
```

CTA phụ:

```txt
Khám phá cộng đồng
```

---

# 16. EMPTY / LOADING / ERROR STATES

Audit toàn hệ thống.

Mọi screen phải có:

```txt
loading
empty
error
partial
success
```

Ví dụ không có follow-up:

Không hiển thị:

```txt
Không có dữ liệu
```

Mà hiển thị:

```txt
Chưa có điểm nào cần quay lại.

Khi một ghi nhận cần được kiểm tra sau 24–48 giờ,
nó sẽ xuất hiện tại đây.
```

Có CTA phù hợp nếu cần.

---

# 17. MICROCOPY

Audit toàn bộ text.

Loại bỏ language quá “software/backend” khỏi UI người dùng.

Ví dụ tránh:

```txt
Create Observation
Submit Evidence
Handoff Entity
Integrity Hash
Follow-up Record
```

Ưu tiên:

```txt
Ghi nhận vấn đề
Gửi bằng chứng
Bàn giao vụ việc
Xác minh bằng chứng
Quay lại kiểm tra
```

Technical term chỉ xuất hiện ở advanced details.

---

# 18. ACCESSIBILITY

Đạt tối thiểu:

- WCAG AA contrast
- keyboard navigation
- focus-visible
- semantic HTML
- label/input association
- aria-label cho icon-only buttons
- heading hierarchy đúng
- không dùng màu là tín hiệu duy nhất
- prefers-reduced-motion
- touch targets >=44px

---

# 19. MOTION

Không biến civic-tech thành landing startup animation-heavy.

Chỉ dùng motion để:

- feedback
- navigation
- progress
- confirmation
- state transition

Animation:

```txt
150–250ms
```

trừ trường hợp đặc biệt.

Không sử dụng:

- excessive parallax
- glassmorphism
- glowing effects
- floating gradients
- neon dashboard aesthetic

DustGuard phải cảm giác:

```txt
credible
civic
young
clear
field-ready
trustworthy
```

---

# 20. CHROME DEVTOOLS MCP — BẮT BUỘC

Không được chỉ sửa code rồi kết luận hoàn thành.

Dùng Chrome DevTools MCP kiểm tra từng route.

Với mỗi route:

1. Navigate
2. Screenshot
3. Test desktop
4. Test tablet
5. Test mobile
6. Inspect overflow
7. Inspect console
8. Inspect failed network request
9. Interact với toàn bộ CTA
10. Test form
11. Test validation
12. Test loading
13. Test success
14. Test error
15. Test empty state

Đặc biệt tìm:

```txt
horizontal overflow
text clipping
button clipping
broken Vietnamese
layout jumping
z-index conflict
sticky overlap
bottom-nav overlap
modal overflow
keyboard overlap
poor touch target
inconsistent radius
inconsistent spacing
unreadable muted text
```

Không claim UI hoàn chỉnh nếu chưa kiểm tra browser thực tế.

---

# 21. REAL DATA ONLY

Tìm toàn codebase:

```txt
mock
fake
demo
sample
placeholder
Math.random
setTimeout
hardcoded metrics
hardcoded leaderboard
hardcoded impact
hardcoded cases
```

Phân loại:

A. legitimate fixture/test  
B. legitimate fallback  
C. production fake data

Loại C phải được xử lý.

Production UI phải lấy từ:

```txt
API
repository
D1
domain calculation
```

Không fake dashboard chỉ để đẹp.

---

# 22. SERVER STATE

Audit các component đang:

```txt
useEffect
fetch
setState
```

trùng lặp.

Nếu codebase đã có server-state abstraction/library:

→ tận dụng.

Nếu chưa có:

→ đánh giá có thực sự cần thêm dependency không.

Không thêm thư viện chỉ vì “best practice”.

Ưu tiên kiến trúc hiện tại.

Chuẩn hóa:

- loading
- error
- retry
- cache
- refetch
- optimistic updates nếu phù hợp

---

# 23. FORM ARCHITECTURE

Audit các wizard/form.

Không để mỗi trang tự:

- validation
- error rendering
- loading
- submit
- dirty state

theo cách riêng.

Tận dụng library hiện có.

Nếu codebase đã có:

- React Hook Form
- Zod
- tương đương

→ dùng SSOT.

Không tạo validation logic song song.

---

# 24. ICON SYSTEM

Chỉ dùng một icon library chính.

Không mix:

```txt
Lucide
Heroicons
custom SVG
emoji
material icons
```

nếu không có lý do.

Audit toàn bộ icon.

Chuẩn hóa sizes:

```txt
16
20
24
```

Emoji không dùng thay cho production icon trừ khi có mục đích nội dung.

---

# 25. RESPONSIVE TABLE

Không ép desktop table xuống mobile.

Khi viewport nhỏ:

```txt
Table
→ Card/List
```

nếu card phù hợp hơn.

Priority fields phải hiện trước.

---

# 26. PERFORMANCE

Audit:

- unnecessary re-render
- duplicate API fetch
- huge icon imports
- image dimensions
- lazy routes
- code splitting
- unnecessary dependencies
- oversized assets

Không optimization mù.

Dùng evidence từ build/runtime.

---

# 27. VISUAL REGRESSION MATRIX

Tạo route QA matrix.

Ít nhất:

```txt
/
 /community
 /community/observe
 /community/cases
 /community/cases/:id
 /community/actions
 /community/follow-ups
 /community/discover
 /community/impact
```

và các admin/staff routes quan trọng hiện có.

Mỗi route đánh dấu:

```txt
Desktop
Tablet
Mobile
Interaction
Network
Console
Empty
Loading
Error
Accessibility
```

---

# 28. DESIGN SYSTEM SSOT DOCUMENTATION

Sau khi code thực tế ổn định, cập nhật:

```txt
.agent/ssot/UI.md
```

Document:

- colors
- typography
- spacing
- radius
- elevation
- breakpoints
- buttons
- forms
- cards
- badges
- navigation
- feedback
- accessibility

Nhưng:

> Code/component/token mới là executable SSOT.

Markdown không được trở thành source of truth song song.

---

# 29. STORYBOOK / COMPONENT LAB

Nếu codebase đã có Storybook/component playground:

→ tận dụng.

Nếu chưa có, KHÔNG tự động thêm Storybook nếu gây thêm complexity.

Có thể tạo route DEV-only/component showcase nhẹ nếu thực sự hữu ích.

Không ship nó production.

---

# 30. TESTS

Không được phá 379 tests hiện tại.

Thêm test cần thiết cho:

- Button variants
- form validation
- responsive behavior logic
- Observation wizard
- follow-up
- handoff
- impact
- navigation
- permission-sensitive actions

Cuối phase:

```txt
npm test
npm run build
```

phải pass.

Không sửa test chỉ để pass nếu behavior thực tế sai.

---

# 31. EXECUTION STRATEGY

Không làm 50 file cùng lúc.

Làm vertical slices.

## Phase 1 — Audit

Xuất:

```txt
UI_AUDIT.md
```

với:

```txt
P0
P1
P2
P3
```

Nhưng không dừng ở audit.

Tiếp tục sửa code.

## Phase 2 — Foundations

Chuẩn hóa:

```txt
tokens
typography
spacing
Button
FormField
Card
Badge
Modal
Toast
Skeleton
EmptyState
```

## Phase 3 — Navigation

Chuẩn hóa:

```txt
CommunityLayout
desktop navigation
mobile bottom nav
page container
header
```

## Phase 4 — Core flow

Làm kỹ:

```txt
/community
/community/observe
observation detail
case workspace
follow-up
handoff
```

## Phase 5 — Discovery + Impact

```txt
campaigns
leaderboard
impact
certificate
```

## Phase 6 — Landing

Làm landing sau khi product UI đã chuẩn.

## Phase 7 — Regression

DevTools toàn route.

---

# 32. MICRO-COMMIT

Sau mỗi vertical slice ổn định:

```txt
git diff
tests
build/check
git commit
```

Commit nhỏ, semantic.

Ví dụ:

```txt
refactor(ui): centralize semantic design tokens
refactor(ui): unify button primitives
fix(community): improve mobile observation flow
feat(followup): add evidence comparison experience
fix(a11y): standardize focus and form semantics
fix(responsive): resolve community workspace overflow
```

Không commit:

```txt
update files
fix stuff
final
```

---

# 33. KHÔNG ĐƯỢC LÀM

Không:

- rewrite app
- tạo architecture V2 song song
- đổi framework
- migrate khỏi Cloudflare
- tạo mock API để demo
- fake leaderboard
- fake impact metrics
- thêm dependency không cần thiết
- tạo 5 button components khác nhau
- hard-code style từng page
- dùng glassmorphism
- dùng gradient/glow quá mức
- thay đổi domain để tiện UI
- xóa backward compatibility
- chỉ sửa Markdown
- claim hoàn thành khi chưa chạy browser
- claim API hoạt động khi chưa inspect network
- claim responsive khi chưa test viewport thật

---

# 34. PRODUCT QUALITY BAR

DustGuard phải trông như một sản phẩm có thể được:

- trường đại học sử dụng
- CLB môi trường triển khai
- đoàn thanh niên sử dụng
- cán bộ tiếp nhận
- đem demo trước BGK
- mở trên điện thoại ngoài hiện trường

Không được có cảm giác:

```txt
admin template
hackathon mockup
generic SaaS
AI-generated dashboard
```

Visual identity phải thể hiện:

```txt
Civic-tech
Youth Action
Evidence
Transparency
Impact
Vietnam
```

nhưng hiện đại, tiết chế và chuyên nghiệp.

---

# 35. DEFINITION OF DONE

Chỉ được báo `DONE` khi:

### Architecture

- [ ] Không phá DDD hiện tại
- [ ] Không tạo SSOT song song
- [ ] `.agent` cập nhật đúng

### Design System

- [ ] Semantic token SSOT
- [ ] Typography SSOT
- [ ] Spacing SSOT
- [ ] Radius SSOT
- [ ] Button SSOT
- [ ] Form SSOT
- [ ] Card SSOT
- [ ] Badge SSOT
- [ ] Feedback SSOT

### UI

- [ ] 100% route trọng yếu đã visual QA
- [ ] Mobile 360/375/390/412 đạt
- [ ] Tablet đạt
- [ ] Desktop đạt
- [ ] Không horizontal overflow
- [ ] Không text clipping
- [ ] Không broken button
- [ ] Không dead CTA
- [ ] Không inconsistent button styles

### UX

- [ ] Observation flow rõ ràng
- [ ] Follow-up 24–48h nổi bật
- [ ] Evidence dễ hiểu
- [ ] Handoff dễ thao tác
- [ ] Next action rõ
- [ ] Loading/empty/error đầy đủ

### Data

- [ ] Không production fake data
- [ ] Dashboard lấy real API
- [ ] Impact lấy real domain data
- [ ] Network requests thực sự thành công

### Accessibility

- [ ] Touch target >=44px
- [ ] Keyboard usable
- [ ] Focus-visible
- [ ] Contrast AA
- [ ] Semantic labels

### Engineering

- [ ] Existing tests pass
- [ ] New critical tests pass
- [ ] Production build pass
- [ ] Console không còn uncaught error
- [ ] Không failed network request ngoài expected cases

---

# 36. FINAL REPORT FORMAT

Khi hoàn tất, KHÔNG trả lời chung chung.

Báo cáo:

## 1. Audit ban đầu

- vấn đề
- root cause
- severity

## 2. Design system

- token nào đã chuẩn hóa
- component nào đã hợp nhất
- duplicated code nào đã loại bỏ

## 3. Route improvements

Cho từng route:

```txt
Before
→ Problem
→ Change
→ Result
```

## 4. Mobile QA

Viewport đã test.

## 5. Interaction QA

Các button/form/action thực tế đã click/test.

## 6. Backend verification

Các API đã verify thông qua browser/network.

## 7. Fake-data audit

Danh sách mock/demo đã xử lý.

## 8. Test results

```txt
X/X tests passed
```

## 9. Build result

Production build result.

## 10. Remaining issues

Nếu còn vấn đề, phải ghi thật.

Không ghi `100% complete` nếu còn known issue.

---

# EXECUTION DIRECTIVE

Bắt đầu ngay bằng cách đọc Agent OS + SSOT hiện tại, sau đó audit implementation thực tế.

Không dừng lại để hỏi tôi từng bước.

Không chỉ đưa recommendation.

Không chỉ sửa documentation.

Hãy trực tiếp:

> audit → sửa code → chạy app → inspect DevTools → test interaction → sửa tiếp → chạy tests → build → micro-commit → cập nhật memory bank.

Mục tiêu cuối cùng:

> DustGuard VN phải có một Design System thực sự thống nhất và một Community Action Experience đủ tốt để người dùng có thể mở điện thoại, ghi nhận một vấn đề môi trường ngoài thực địa, tạo bằng chứng, theo dõi lại sau 24–48 giờ và nhìn thấy tác động của hành động đó — mà không cần hiểu hệ thống phía sau phức tạp thế nào.