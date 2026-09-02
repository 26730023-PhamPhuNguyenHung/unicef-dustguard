# Quy Trình Lệnh AGY CLI (AGY Workflow) — DustGuard VN

> **Mục tiêu**: Chuẩn hóa các lệnh vận hành phát triển trên Antigravity IDE và AGY CLI, biến quá trình phát triển tính năng thành một chu trình khép kín, có bằng chứng thực chứng.

---

## 1. Chu Trình 8 Bước Tiêu Chuẩn

```text
USER INTENT
  ↓
AGY audit        (Khảo sát ranh giới & CSDL D1 hiện tại)
  ↓
AGY spec         (Tạo hoặc cập nhật đặc tả & tiêu chí AC)
  ↓
AGY implement    (Triển khai lát cắt dọc tối thiểu)
  ↓
AGY verify       (Chạy kiểm thử nhanh < 7s: In-memory, D1, UI)
  ↓
[if fail] AGY fix (Vòng lặp sửa lỗi tận gốc rễ)
  ↓
AGY journey      (Chạy kiểm chứng E2E browser + D1 thực tế)
  ↓
AGY review       (Kiểm toán vị nhân sinh, UI/UX & diff)
  ↓
GIT CHECKPOINT   (Micro-commit chuẩn SSOT)
```

---

## 2. Bảng Lệnh AGY CLI & npm Tương Ứng

| Lệnh Logical | Lệnh Thực Thi Trực Tiếp | Ý nghĩa & Hành vi |
|---|---|---|
| **audit** | `node scripts/harness.js audit` hoặc `npm run harness:audit` | Khảo sát trạng thái CSDL D1 SQLite (`prisma/dev.db`), kiểm tra file bản đồ hệ thống `current-system-map.md` và git working tree. |
| **spec** | `node scripts/harness.js spec` hoặc `npm run harness:spec` | Thống kê và kiểm tra tính đầy đủ của các bản đặc tả trong `specs/` theo 6 phân hệ (citizen, staff, contractor, admin, executive, shared). |
| **implement** | `node scripts/harness.js implement` | Hiển thị hướng dẫn và các ràng buộc kiến trúc cho lát cắt tối thiểu (Minimum Working Set). |
| **verify** | `node scripts/harness.js verify` hoặc `npm run harness:verify` | Kích hoạt bộ kiểm thử nhanh (< 7s), bao gồm kiểm tra domain logic, D1 persistence, và UI responsive smoke. |
| **fix** | `node scripts/harness.js fix` | Hướng dẫn vòng lặp sửa lỗi 7 bước: "Fix the root cause, not the screenshot". |
| **review** | `node scripts/harness.js review` hoặc `npm run harness:review` | Kiểm toán `git diff`, kiểm tra 4 câu hỏi định vị và chuẩn tiếng Việt đời thường. |
| **journey** | `node scripts/harness.js journey staff` hoặc `npm run harness:journey` | Chạy bộ kiểm thử tự động Playwright và D1 SQLite thực tế cho toàn bộ hành trình của một vai trò (Pilot: Staff Field Case Flow). |
| **release-check** | `node scripts/harness.js release-check` | Chạy toàn bộ 29+ test suites trước khi phát hành phiên bản lớn. |
