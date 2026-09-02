# DUSTGUARD — FULL 40-SCREEN PRODUCT AUDIT

Hãy audit TOÀN BỘ codebase DustGuard theo góc nhìn sản phẩm thực tế.

Mục tiêu của phiên này KHÔNG phải là redesign hay refactor lớn.

Mục tiêu là kiểm tra khoảng 40 màn hình hiện có, xác định:

- màn hình nào đang hoạt động thật;
- màn hình nào chỉ là mock;
- màn hình nào sai nghiệp vụ;
- màn hình nào sai role;
- frontend nào chưa nối backend;
- backend nào chưa persistence;
- lỗi UI/UX;
- lỗi responsive;
- lỗi ngôn từ;
- lỗi runtime;
- lỗi API;
- lỗi dữ liệu;
- lỗi navigation;
- lỗi permission;
- màn hình thừa/trùng chức năng.

Sau audit, fix các lỗi có thể xử lý an toàn và lập backlog rõ ràng cho phần còn lại.

---

# NGUYÊN TẮC

KHÔNG:

- tự tạo thêm feature;
- tự mở rộng scope;
- tự đổi stack;
- redesign toàn hệ thống;
- tạo thêm abstraction không cần thiết;
- sửa code chỉ vì “clean hơn”;
- báo DONE chỉ vì build pass.

Ưu tiên:

- hệ thống chạy được;
- nghiệp vụ rõ;
- ít lỗi;
- mobile usable;
- data thật;
- role rõ;
- code hiện tại được tận dụng tối đa.

---

# PHASE 1 — INVENTORY TOÀN BỘ MÀN HÌNH

Đọc toàn bộ:

- router;
- route config;
- layouts;
- pages;
- feature folders;
- navigation/sidebar;
- auth guards;
- role guards.

Tạo SCREEN INVENTORY thực tế từ CODEBASE.

Không dựa vào documentation cũ nếu code đã thay đổi.

Mỗi màn hình ghi:

| # | Role | Route | Screen | Purpose | Status |
|---|---|---|---|---|---|

Status ban đầu:

- UNKNOWN
- WORKING
- PARTIAL
- MOCK
- BROKEN
- DUPLICATE
- UNUSED

Kiểm tra route orphan:

- page tồn tại nhưng không route;
- route tồn tại nhưng page chết;
- sidebar link sai;
- màn hình không thể truy cập;
- màn hình cũ còn sót lại.

Mục tiêu là tìm đủ khoảng 40 màn hình thực tế hiện tại.

---

# PHASE 2 — CHIA THEO ROLE

Phân loại chính xác.

## PUBLIC

Ví dụ:

- Landing
- Map/public status
- Case/public lookup

## CITIZEN

Ví dụ:

- Home
- Report new
- My reports
- Report detail
- Profile

## STAFF

Ví dụ:

- Dashboard
- Tasks
- Field inspection
- Evidence
- Case detail
- History
- Profile

## CONTRACTOR

Ví dụ:

- Dashboard
- Jobs
- Job detail
- Report
- History

## ADMIN

Ví dụ:

- Dashboard
- Cases
- Case detail
- Assignment
- Users
- Contractors
- Analytics
- Settings

Không được để chức năng Admin lẫn vào Staff chỉ vì code cũ đang đặt sai folder.

---

# PHASE 3 — AUDIT TỪNG MÀN HÌNH

Audit TẤT CẢ màn hình lần lượt.

Mỗi màn hình phải kiểm tra đủ 10 nhóm sau.

---

## 1. PURPOSE

Trả lời:

Người dùng mở màn hình này để làm gì?

Nếu không trả lời được bằng một câu rõ ràng:

→ đánh dấu UX/PRODUCT ISSUE.

Nếu hai màn hình làm cùng một việc:

→ đánh dấu DUPLICATE.

---

## 2. ROLE

Kiểm tra:

- role nào được xem;
- role nào được thao tác;
- route guard;
- API authorization.

Không coi việc “ẩn sidebar” là authorization.

Test truy cập URL trực tiếp nếu có thể.

---

## 3. NAVIGATION

Kiểm tra:

- sidebar;
- breadcrumb;
- back;
- CTA;
- link;
- detail route;
- redirect.

Tìm:

- click không chạy;
- dead link;
- sai route;
- quay về sai màn hình;
- detail id undefined.

---

## 4. UI / UX

Kiểm tra:

- hierarchy;
- density;
- whitespace;
- alignment;
- card;
- table;
- button;
- form;
- filter;
- modal;
- tabs;
- status badge.

Đặc biệt tìm:

- quá nhiều card;
- quá nhiều CTA;
- button dài;
- heading dài;
- dữ liệu quan trọng bị chìm;
- mọi thứ đều cùng mức visual hierarchy.

Không redesign nếu chỉ cần chỉnh nhỏ.

---

# PHASE 4 — AUDIT NGÔN TỪ TOÀN HỆ THỐNG

Đọc toàn bộ text visible với user.

Tìm:

- từ kỹ thuật;
- từ tiếng Anh không cần thiết;
- từ viết tắt;
- câu quá dài;
- text kiểu developer;
- label không tự nhiên;
- thuật ngữ không đồng nhất.

Ví dụ cần tránh:

Case Lifecycle  
Evidence Management  
Inspection Workflow  
Telemetry  
Risk Processing  
Assigned Cases

Nếu user không cần hiểu chúng.

Ưu tiên:

Vụ việc  
Ảnh hiện trường  
Kiểm tra  
Cảm biến  
Mức ưu tiên  
Việc được giao

---

# TEXT DENSITY RULE

Dashboard vận hành không phải tài liệu hướng dẫn.

Mỗi card:

- title ngắn;
- value rõ;
- supporting text tối đa cần thiết.

Button:

ưu tiên 1–3 từ.

Ví dụ:

Xem  
Sửa  
Lưu  
Giao việc  
Kiểm tra  
Hoàn tất  
Chụp ảnh

Nếu user phải đọc >10 giây để hiểu một màn hình dashboard thì xem xét rút gọn.

---

# PHASE 5 — RESPONSIVE AUDIT 40 MÀN HÌNH

Bật browser DevTools responsive mode.

Test ít nhất:

375px  
390px  
430px  
768px  
1366px / 1440px.

Đặc biệt Staff/Citizen phải tốt trên mobile.

Tìm:

- horizontal overflow;
- content bị che;
- text bị cắt;
- button xuống dòng kỳ;
- modal vượt viewport;
- table không dùng được;
- header/sidebar lỗi;
- sticky element che nội dung;
- form input quá nhỏ;
- layout desktop ép vào mobile.

Không yêu cầu pixel-perfect.

Mục tiêu là usable.

---

# PHASE 6 — DATA SOURCE AUDIT

Với từng màn hình, xác định dữ liệu đến từ đâu:

REAL API

MOCK DATA

HARDCODE

LOCAL STATE

SEED DATA

UNKNOWN

Tìm toàn repo:

mock  
fixture  
demo  
dummy  
fake  
sample  
hardcoded  
setTimeout

Không xóa seed data chỉ vì là seed.

Nhưng phải phân biệt:

seed database để demo

khác với

frontend fake data không persistence.

---

# PHASE 7 — FRONTEND ↔ API MAPPING

Với mỗi màn hình có dữ liệu:

UI
→ frontend hook/service
→ endpoint
→ backend handler
→ query
→ D1 table.

Nếu chain bị đứt ở đâu, đánh dấu chính xác.

Ví dụ:

`/admin/cases`

UI exists  
API exists  
D1 query exists  
Update status missing.

Không được chỉ ghi chung chung:

“Backend chưa hoàn thiện.”

---

# PHASE 8 — CRUD AUDIT

Các màn hình có thao tác dữ liệu phải kiểm tra:

CREATE

READ

UPDATE

DELETE / ARCHIVE nếu phù hợp.

Test thực tế:

create
→ reload.

update
→ reload.

delete/archive
→ reload.

Nếu reload mất dữ liệu:

→ không phải implementation hoàn chỉnh.

---

# PHASE 9 — DEVTOOLS AUDIT

Đi qua TẤT CẢ route có thể truy cập.

Mở:

Console  
Network.

Không bỏ qua warning/error chỉ vì trang vẫn render.

---

## CONSOLE

Tìm:

TypeError  
undefined  
null access  
duplicate key  
failed prop  
uncaught promise  
React warning  
infinite render  
deprecated API.

Đặc biệt rà lỗi kiểu:

`.slice is not a function`

`.map is not a function`

`Cannot read properties of undefined`

Nếu gặp lỗi dạng này:

không chỉ patch bằng `Array.isArray`.

Phải kiểm tra API RESPONSE SHAPE và data contract.

---

## NETWORK

Tìm:

404  
400  
401  
403  
500  
CORS  
duplicate request  
request loop  
payload sai  
response schema sai.

Kiểm tra cả request trả 200 nhưng frontend parse sai.

---

# PHASE 10 — EMPTY / LOADING / ERROR STATE

Mỗi màn hình data-driven phải có:

Loading

Empty

Error

Success.

Không để:

blank page.

Không để lỗi backend nhưng giao diện vẫn giả như bình thường.

---

# PHASE 11 — FORM AUDIT

Mọi form kiểm tra:

required;
default value;
validation;
submit;
double submit;
cancel;
success;
error;
reload persistence.

Tìm:

input không bind;
select không hoạt động;
button submit không chạy;
field có UI nhưng backend không nhận;
backend yêu cầu field frontend không có.

---

# PHASE 12 — STATUS CONSISTENCY

Audit tất cả status.

Tìm:

`pending`

`new`

`open`

`waiting`

có đang biểu diễn cùng một trạng thái hay không.

Tương tự:

done  
resolved  
completed  
closed.

Không tự migrate ngay.

Trước tiên tạo STATUS MAP.

Chỉ sửa nếu chắc chắn không phá compatibility.

---

# PHASE 13 — ENTITY CONSISTENCY

Đặc biệt kiểm tra:

Report

Case

Task

Inspection

Evidence

Site

Sensor

User

Contractor.

Xác định entity nào là entity thật trong DB.

Không để frontend tự tạo khái niệm khác backend.

---

# PHASE 14 — CROSS-SCREEN FLOW

Không audit từng trang cô lập.

Test các flow end-to-end.

---

## FLOW A — CITIZEN

Citizen
→ tạo phản ánh
→ gửi
→ xem danh sách
→ xem detail
→ thấy trạng thái mới.

---

## FLOW B — ADMIN

Admin
→ thấy phản ánh
→ mở case
→ giao Staff
→ trạng thái thay đổi.

---

## FLOW C — STAFF

Staff
→ thấy nhiệm vụ
→ mở task
→ đến kiểm tra
→ thêm bằng chứng
→ cập nhật kết quả
→ hoàn tất.

---

## FLOW D — ADMIN VERIFY

Admin
→ thấy Staff đã hoàn tất
→ xem bằng chứng
→ xác nhận / xử lý tiếp.

---

## FLOW E — CONTRACTOR

Nếu hệ thống hiện tại có Contractor:

Admin
→ giao công việc
→ Contractor thấy job
→ cập nhật tiến độ
→ báo cáo
→ Admin thấy kết quả.

Nếu một flow đứt:

ghi chính xác SCREEN + API + DATA LAYER nơi đứt.

---

# PHASE 15 — TÌM MÀN HÌNH THỪA

Đặc biệt rà:

- dashboard trùng;
- profile trùng;
- history trùng;
- list/detail duplicate;
- màn hình demo cũ;
- route legacy;
- chức năng không còn trong nghiệp vụ;
- module tạo ra nhưng không ai dùng.

Không xóa ngay nếu chưa chắc.

Đánh dấu:

KEEP  
MERGE  
REMOVE CANDIDATE.

---

# PHASE 16 — FIX PASS

Sau khi audit đủ một lượt 40 màn hình, bắt đầu FIX PASS.

Ưu tiên theo mức độ:

P0 — SYSTEM BROKEN

- không login được;
- route chết;
- crash;
- API 500;
- data loss;
- permission nghiêm trọng.

P1 — CORE FLOW BROKEN

- không tạo report;
- không giao task;
- Staff không hoàn tất được;
- CRUD không persistence.

P2 — UX BLOCKER

- nút không bấm;
- mobile unusable;
- form submit lỗi;
- navigation sai.

P3 — CONSISTENCY

- wording;
- alignment;
- status;
- spacing;
- duplicate UI.

P4 — POLISH

- visual refinement;
- animation;
- minor cosmetic.

Fix P0 → P1 → P2 trước.

Không mất thời gian polish nếu core workflow còn chết.

---

# KHÔNG FIX 40 MÀN HÌNH MỘT CÁCH MÙ QUÁNG

Nếu phát hiện một lỗi shared component ảnh hưởng 15 màn hình:

fix component gốc.

Nếu API shape sai ảnh hưởng 8 màn hình:

fix contract/data layer.

Nếu CSS layout gây lỗi cả role:

fix layout.

Không patch từng page nếu root cause nằm ở shared layer.

---

# TEST SAU FIX

Sau mỗi nhóm fix:

run relevant tests.

Sau đó:

run build.

Sau đó mở DevTools kiểm tra lại.

Build pass KHÔNG đồng nghĩa audit pass.

---

# FINAL FULL SMOKE TEST

Sau khi fix:

đi lại toàn bộ screen inventory.

Mỗi screen đánh trạng thái cuối:

PASS  
PASS WITH MINOR ISSUE  
PARTIAL  
BLOCKED  
REMOVE CANDIDATE.

---

# OUTPUT BẮT BUỘC

Tạo báo cáo cuối cùng như sau:

# DUSTGUARD FULL PRODUCT AUDIT

## 1. SUMMARY

Total screens:
Passed:
Partial:
Broken:
Mock:
Duplicate:
Unused:

P0:
P1:
P2:
P3:

---

## 2. SCREEN MATRIX

| # | Role | Route | Screen | UI | API | DB | Mobile | Role | Status |
|---|---|---|---|---|---|---|---|---|---|

Phải có TOÀN BỘ khoảng 40 màn hình.

Không chỉ liệt kê màn hình lỗi.

---

## 3. CRITICAL ISSUES

Chỉ các lỗi thực sự ảnh hưởng sản phẩm.

Mỗi issue ghi:

ID  
Severity  
Screen  
Problem  
Root cause  
Fix  
Status

---

## 4. MOCK / FAKE DATA

Liệt kê rõ:

screen nào;

file nào;

data nào;

đã có backend thật chưa.

---

## 5. FRONTEND ↔ BACKEND GAPS

Ví dụ:

Screen:
`/staff/tasks`

UI:
PASS

GET:
PASS

UPDATE:
BROKEN

Persistence:
BROKEN

Reason:
endpoint chưa update D1.

---

## 6. ROLE / PERMISSION ISSUES

Liệt kê các lỗi Staff/Admin/Citizen/Contractor bị trộn nghiệp vụ hoặc truy cập sai.

---

## 7. UX / WORDING ISSUES

Chỉ ghi vấn đề quan trọng.

Không cần report hàng trăm lỗi spacing nhỏ.

---

## 8. RESPONSIVE ISSUES

Theo:

375  
390  
430  
768  
1366/1440.

---

## 9. FIXED THIS PASS

Ghi file và vấn đề đã fix.

Không cần liệt kê mỗi dòng code.

---

## 10. REMAINING BACKLOG

P0

P1

P2

P3.

---

## 11. END-TO-END STATUS

Citizen report:
PASS / FAIL

Admin assignment:
PASS / FAIL

Staff inspection:
PASS / FAIL

Evidence:
PASS / FAIL

Admin verification:
PASS / FAIL

Contractor:
PASS / FAIL

---

## 12. PRODUCT HEALTH SCORE

Chấm:

Frontend UX /10

Responsive /10

Backend completeness /10

Data persistence /10

Role separation /10

Code consistency /10

Overall /100.

Phải giải thích ngắn tại sao.

---

# EXECUTION RULE

Bắt đầu bằng inventory toàn bộ routes/pages.

Sau đó audit đủ khoảng 40 màn hình trước khi kết luận kiến trúc nào cần thay đổi.

Có thể fix ngay các lỗi P0/P1 rõ ràng trong quá trình audit nếu root cause chắc chắn.

Không hỏi tôi từng màn hình.

Không dừng sau 5–10 màn hình.

Không chỉ đọc code.

Phải bật ứng dụng và kiểm tra bằng DevTools.

Không chỉ chạy automated tests.

Không tuyên bố production-ready nếu chưa đi qua cross-screen flow.

Mục tiêu cuối cùng của phiên này là trả lời chính xác:

“Trong khoảng 40 màn hình hiện tại, cái gì chạy thật, cái gì chưa chạy, cái gì đang sai và đâu là những việc quan trọng nhất cần sửa để DustGuard trở thành một hệ thống end-to-end thực sự.”