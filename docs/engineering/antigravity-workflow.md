# Quy Trình Phát Triển Trên Antigravity IDE (Antigravity Workflow)

> **Mục tiêu**: Hướng dẫn kỹ sư và coding agent phối hợp ăn ý bên trong Antigravity IDE, giải phóng lập trình viên khỏi việc phải rà soát từng dòng code AI sinh ra bằng cách thiết lập các rào chắn kiểm chuẩn tự động (automated guardrails & verification).

---

## 1. 4 Giai Đoạn Phát Triển Kỷ Luật

```text
1. TRƯỚC KHI VIẾT CODE:
   - Đọc bản đồ hệ thống: docs/engineering/current-system-map.md
   - Xác định spec tương ứng: specs/<role>/SPEC-<feature>.md
   - Chạy audit: npm run harness:audit

2. TRONG KHI VIẾT CODE:
   - Triển khai đúng 1 lát cắt dọc (Vertical Slice) cho hành trình người dùng.
   - Tuân thủ nguyên tắc: Tái sử dụng > Mở rộng > Cải tổ tối thiểu > Tạo mới.
   - Nối đột biến trực tiếp vào CSDL D1 SQLite (prisma/dev.db).

3. NGAY SAU KHI SỬA CODE:
   - Chạy test mục tiêu siêu tốc (< 0.5s):
     node --test app/tests/<target>.test.js
   - Chạy bộ kiểm thử nhanh (< 7s):
     npm run harness:verify

4. TRƯỚC KHI TUYÊN BỐ "DONE":
   - Chạy kiểm chứng hành trình thực tế với trình duyệt Playwright & DevTools:
     npm run harness:journey staff
   - Rà soát 22 tiêu chí trong .agents/DEFINITION_OF_DONE.md
   - Kiểm tra git diff: git diff --stat
```

---

## 2. Minh Họa Ví Dụ Một Phiên Làm Việc

### Tình huống: Hoàn thiện tính năng nộp minh chứng khảo sát của Cán bộ (Staff Evidence)
```text
BƯỚC 1: Lập kế hoạch & Khảo sát
  $ npm run harness:audit
  → Agent nắm rõ cấu trúc D1 table: cases, inspections, evidences, case_timelines.

BƯỚC 2: Rà soát đặc tả
  $ npm run harness:spec
  → Đọc specs/staff/SPEC-staff-case-evidence-flow.md với các tiêu chí Acceptance Criteria.

BƯỚC 3: Triển khai phẫu thuật (Implementation)
  → Sửa CaseDetailPage.jsx và routes/api/staff-cases.js.

BƯỚC 4: Kiểm thử tức thì
  $ node --test app/tests/staff-cases-mockup6-7.test.js
  → Pass trong 12ms.

BƯỚC 5: Kiểm chứng hành trình trình duyệt E2E
  $ npm run harness:journey staff
  → Tự động bật Chromium, test 4 kích thước màn hình, kiểm tra D1 reload, 0 console error.

BƯỚC 6: Kiểm toán vị nhân sinh & Commit
  $ npm run harness:review
  $ git add .
  $ git commit -m "feat(staff): implement persistent field inspection evidence with D1 hash sync"
```

---

## 3. Vai Trò Của Lập Trình Viên (Human Developer Role)
Lập trình viên không cần đọc từng dòng code AI tạo ra, mà tập trung đánh giá 4 điểm mấu chốt:
1. **Hành vi sản phẩm**: Có đúng nhu cầu người dân và cán bộ hiện trường không?
2. **Bản đặc tả (Spec)**: Tiêu chí nghiệm thu (Acceptance Criteria) có đo lường được không?
3. **Báo cáo kiểm chuẩn (Quality Report)**: Bảng kiểm DoD và kết quả chạy `npm run harness:journey` có 100% PASS không?
4. **Trực quan (Visual Evidence)**: Giao diện có đạt chuẩn sáng màu, tương phản cao, không tràn ngang và không dùng glassmorphism không?
