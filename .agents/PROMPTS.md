# DUSTGUARD VN — MASTER PROMPT OPERATING SYSTEM (10 BỘ PROMPT CHUẨN)

Bộ prompt cố định bao phủ toàn bộ vòng đời phát triển: Hiểu Codebase → Spec → Code → DB/Backend → UI/UX → Test → DevTools → Refactor → Audit → Vòng lặp tự động.

---

## 1. Prompt: Đọc Codebase Trước Khi Code

```text
Bạn đang làm việc trên codebase DustGuard VN.

NHIỆM VỤ:
Trước khi sửa bất kỳ code nào, hãy đọc và hiểu phần code liên quan đến yêu cầu hiện tại.

Quy trình bắt buộc:
1. Đọc cấu trúc thư mục và routes hiện tại.
2. Xác định đúng role liên quan: Citizen / Staff / Contractor / Admin / Executive.
3. Tìm các component, API, service, schema DB và test đang liên quan.
4. Kiểm tra xem tính năng đã tồn tại một phần ở nơi khác chưa.
5. Tìm code cũ có thể tái sử dụng trước khi tạo code mới.
6. Xác định source of truth hiện tại.
7. Chỉ ra:
   - cái đang hoạt động;
   - cái đang mock;
   - cái bị trùng;
   - cái bị bỏ dở;
   - cái có nguy cơ gây regression.

Sau đó viết một implementation plan ngắn.

NGUYÊN TẮC:
- Không tự tạo kiến trúc mới nếu kiến trúc hiện tại đủ dùng.
- Không duplicate component/service/schema.
- Không thêm dependency nếu chưa thật sự cần.
- Ưu tiên sửa và tái sử dụng code hiện có.
- DustGuard phải đơn giản để maintain.

Sau khi hiểu đủ codebase thì triển khai luôn.
Không dừng lại chỉ để báo cáo.
```

---

## 2. Prompt: Viết Spec Rồi Code Một Màn Hình

```text
Hoàn thiện màn hình hiện tại của DustGuard theo hướng production-ready.

PHASE 1 — SPEC

Trước tiên đọc code của màn hình và các module liên quan.

Viết mini-spec gồm:
- Người dùng của màn hình là ai?
- Họ vào đây để làm việc gì?
- 3–5 hành động quan trọng nhất?
- Dữ liệu nào cần hiển thị?
- Dữ liệu lấy từ đâu?
- API nào đang/cần sử dụng?
- DB entity nào liên quan?
- Loading / empty / error / success state?
- Mobile và desktop khác nhau thế nào?

PHASE 2 — IMPLEMENT

Sau khi có spec:
- code frontend;
- nối API thật;
- nối DB nếu cần;
- bỏ mock nếu đã có backend;
- thêm validation;
- xử lý error;
- xử lý loading;
- xử lý empty state.

PHASE 3 — VERIFY

Chạy app và kiểm tra màn hình thực tế.

Không được coi việc component render được là hoàn thành.
Chỉ DONE khi user flow chính chạy end-to-end.
```

---

## 3. Prompt: Biến Mock Thành CRUD Thật

```text
Audit màn hình/module này và biến toàn bộ nghiệp vụ đang mock thành hoạt động thật.

Hãy trace theo chuỗi:

UI
→ event/action
→ API client
→ route/controller
→ business logic
→ database
→ response
→ UI state

Tìm tất cả:
- hardcoded data;
- mock arrays;
- fake counters;
- setTimeout giả API;
- dữ liệu chỉ nằm trong React state;
- nút bấm không persist;
- form submit nhưng không ghi DB;
- delete/edit chỉ thay đổi giao diện;
- dashboard số liệu giả.

Với mỗi nghiệp vụ cần thiết:
CREATE / READ / UPDATE / DELETE
hãy nối end-to-end.

Ưu tiên sử dụng schema/API hiện có.

Không over-engineer.
Không tạo abstraction chỉ dùng một lần.

Sau khi code:
1. Seed dữ liệu hợp lý nếu cần.
2. Test CRUD.
3. Reload browser để xác nhận dữ liệu vẫn còn.
4. Kiểm tra error case.
5. Báo những phần vẫn còn mock.
```

---

## 4. Prompt: Audit DB + Backend

```text
Audit backend DustGuard cho module hiện tại.

Đừng bắt đầu bằng việc tạo thêm bảng.

Trước tiên:
1. Đọc schema/migrations hiện tại.
2. Mapping bảng → API → frontend.
3. Tìm bảng dư/trùng.
4. Tìm field frontend cần nhưng DB chưa có.
5. Tìm API trả shape không ổn định.
6. Tìm N+1 query hoặc query dư thừa.
7. Kiểm tra validation.
8. Kiểm tra authorization theo role.
9. Kiểm tra foreign key / index / timestamps / status.
10. Kiểm tra error handling.

Đặc biệt tìm các lỗi kiểu:
- array/object không thống nhất;
- null/undefined;
- recentReports.slice is not a function;
- API success nhưng payload sai shape;
- frontend phải đoán cấu trúc response.

Mục tiêu:
DB và API phải đơn giản, predictable và dễ CRUD.

Nếu schema hiện tại giải quyết được thì KHÔNG tạo schema mới.

Sau audit, fix các vấn đề có tác động thực tế và chạy test.
```

---

## 5. Prompt: Human-Centric UI/UX

```text
Audit và cải thiện UI/UX màn hình DustGuard này theo Human-Centric Design.

Đừng redesign chỉ để đẹp hơn.

Hãy hỏi với từng thành phần:
“Người dùng có cần thứ này để hoàn thành công việc không?”

Ưu tiên:
1. Việc quan trọng nhất phải nhìn thấy ngay.
2. Một màn hình có một mục tiêu chính.
3. Giảm số quyết định người dùng phải đưa ra.
4. Giảm text.
5. Không dùng jargon kỹ thuật.
6. Không dùng từ viết tắt nếu người dùng thực tế không hiểu.
7. Button ưu tiên 1–3 từ.
8. Status phải đọc là hiểu.
9. Action quan trọng phải dễ bấm trên điện thoại.
10. Progressive disclosure cho thông tin nâng cao.

Với Staff:
ưu tiên thao tác ngoài hiện trường, mobile-first, ít nhập liệu.

Với Admin:
ưu tiên điều phối, tổng quan, CRUD và exception handling.

Với Citizen:
ưu tiên cực kỳ đơn giản, không yêu cầu hiểu quy trình nội bộ.

Với Contractor:
chỉ tập trung công việc được giao, bằng chứng và hoàn thành.

Không làm dashboard thành nơi nhồi tất cả dữ liệu.

Sửa trực tiếp UI sau khi audit.
```

---

## 6. Prompt: DevTools Audit

```text
Bật ứng dụng DustGuard ở development mode và kiểm tra bằng browser DevTools.

Không đánh giá UI chỉ bằng cách đọc JSX.

Kiểm tra từng màn hình thực tế ở:
- desktop khoảng 1440px;
- laptop khoảng 1366px;
- tablet;
- mobile khoảng 390px.

Kiểm tra:

VISUAL
- overflow;
- text bị cắt;
- sidebar;
- modal;
- table;
- card;
- spacing;
- typography;
- button quá dài;
- responsive.

CONSOLE
- errors;
- warnings quan trọng;
- failed requests;
- React errors.

NETWORK
- API 4xx/5xx;
- request duplicate;
- payload sai;
- response shape sai;
- request không cần thiết.

INTERACTION
- button;
- form;
- filter;
- search;
- pagination;
- modal;
- navigation;
- back;
- refresh.

Mỗi lỗi:
REPRODUCE → ROOT CAUSE → FIX → VERIFY.

Không chỉ patch CSS để che lỗi logic.

Sau khi fix phải reload và kiểm tra lại bằng DevTools.
```

---

## 7. Prompt: Audit 40 Màn Hình

```text
Thực hiện một full product audit DustGuard trên tối đa 40 màn hình hiện có.

Đầu tiên tự lấy danh sách màn hình từ router/codebase.
Không dựa vào danh sách cũ trong documentation nếu code hiện tại khác.

Chia theo role:
Public
Citizen
Staff
Contractor
Admin
Executive

Với từng màn hình kiểm tra:

1. Route chạy không?
2. Có runtime error không?
3. API có hoạt động không?
4. Dữ liệu thật hay mock?
5. Empty state?
6. Loading state?
7. Error state?
8. Responsive?
9. Ngôn từ dễ hiểu?
10. CTA chính rõ ràng?
11. Navigation đúng?
12. Role permission đúng?
13. Có feature chết?
14. Có component duplicate?
15. Có nghiệp vụ chưa end-to-end?

Phân loại:

P0 = không sử dụng được
P1 = nghiệp vụ chính lỗi
P2 = UX/data issue
P3 = polish

Fix theo P0 → P1 → P2.

Không dành thời gian polish P3 khi P0/P1 còn tồn tại.

Tạo file audit làm checklist và cập nhật trạng thái sau mỗi fix.

Mục tiêu cuối:
không phải “40 trang đẹp” mà là các user journey quan trọng hoạt động hoàn chỉnh.
```

---

## 8. Prompt: Refactor Không Làm Phình Codebase

```text
Refactor phần code DustGuard hiện tại với mục tiêu GIẢM độ phức tạp.

Không refactor vì aesthetic preference.

Trước tiên tìm:
- component duplicate;
- page duplicate;
- helper duplicate;
- API wrapper duplicate;
- dead code;
- route cũ;
- module cũ đã được thay thế;
- CSS không còn dùng;
- abstraction không mang giá trị;
- file quá lớn;
- logic business nằm sai layer.

Với mỗi thứ định xóa/gộp:
hãy trace import và usage trước.

Nguyên tắc:
DELETE > MERGE > REUSE > CREATE NEW.

Không tạo:
- generic engine không cần thiết;
- wrapper chỉ dùng một chỗ;
- service layer vô nghĩa;
- component abstraction quá sớm.

Sau mỗi nhóm refactor:
- build;
- test;
- kiểm tra routes;
- kiểm tra user flow liên quan.

Mục tiêu là codebase nhỏ hơn hoặc dễ hiểu hơn sau refactor, không phải chỉ chuyển code sang nhiều file hơn.
```

---

## 9. Prompt: Test Theo Nghiệp Vụ Người Dùng

```text
Test DustGuard theo USER JOURNEY thay vì chỉ test component.

Tự xác định các flow quan trọng hiện tại.

Ví dụ tư duy:

Citizen:
phát hiện vấn đề
→ gửi phản ánh
→ nhận mã
→ xem trạng thái.

Staff:
nhận việc
→ xem thông tin
→ kiểm tra hiện trường
→ thêm bằng chứng
→ cập nhật kết quả.

Admin:
nhận case
→ xem ưu tiên
→ phân công
→ theo dõi
→ xử lý exception.

Contractor:
nhận việc
→ thực hiện
→ gửi bằng chứng
→ hoàn thành.

Với mỗi flow:
1. happy path;
2. missing data;
3. invalid input;
4. API failure;
5. empty state;
6. refresh;
7. permission;
8. mobile interaction.

Fix lỗi phát hiện được.

Không thêm test vô nghĩa chỉ để tăng số lượng test.

Test phải bảo vệ nghiệp vụ thực tế.
```

---

## 10. Prompt: Vòng Lặp Tự Động Phát Triển DustGuard (Master Loop)

```text
Tiếp tục phát triển DustGuard theo vòng lặp này cho đến khi module hiện tại đạt trạng thái production-ready:

LOOP:

1. READ
Đọc code và context liên quan.

2. SPEC
Xác định user goal và acceptance criteria.

3. AUDIT FRONTEND
Kiểm tra UI, ngôn từ, responsive và interaction.

4. TRACE
Trace UI → API → DB.

5. IMPLEMENT
Fix frontend/backend/database cần thiết.

6. RUN
Chạy development server.

7. DEVTOOLS
Kiểm tra browser thực tế:
Console + Network + responsive + interactions.

8. TEST
Chạy test liên quan.

9. CLEAN
Xóa mock/dead/duplicate code phát sinh hoặc được thay thế.

10. VERIFY
Thực hiện lại user journey từ đầu.

Nếu VERIFY fail:
quay lại bước 1.

Nếu VERIFY pass:
chuyển sang nghiệp vụ/màn hình quan trọng tiếp theo.

QUY TẮC CỨNG:
- Không báo DONE chỉ vì build pass.
- Không báo DONE nếu UI vẫn dùng mock cho nghiệp vụ cần persist.
- Không tạo feature ngoài scope.
- Không over-engineer.
- Không redesign toàn hệ thống khi chỉ cần sửa một flow.
- Không bỏ qua lỗi console.
- Không che lỗi backend bằng fallback giả ở frontend.
- Không duplicate code đang tồn tại.
- Không phá flow đang hoạt động để đạt kiến trúc “đẹp hơn”.

Ưu tiên:
WORKING SOFTWARE
> USER FLOW
> DATA CORRECTNESS
> UX
> CODE CLEANLINESS
> POLISH.

Bắt đầu bằng việc tìm vấn đề có tác động lớn nhất hiện tại và xử lý nó end-to-end.
```
