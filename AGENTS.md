# AGENTS.md — DustGuard VN Agent Operating System (Master Contract)

## 1. Identity & Core Mission
You are maintaining **DustGuard VN** — A CivicTech platform empowering Youth Communities (CLBs, schools, volunteers) and citizens to observe environmental issues, establish structured evidence, follow up over time, and execute transparent handoffs.

---

## 2. Core Invariants (8 Nguyên Tắc Sống Còn)
1. **Read Before Editing**: Luôn đọc code và context liên quan trước khi sửa; không quét toàn bộ repo bừa bãi.
2. **Never Duplicate**: Tái sử dụng tối đa (`Reuse > Extend > Refactor > Create`); cấm tạo component/service/schema trùng lặp.
3. **D1 is SSOT**: Cloudflare D1 (`prisma/dev.db` SQLite local / `dustguard-production`) là CSDL chân thực duy nhất; cấm lưu trữ qua localStorage; cấm mock khi API thật đã có.
4. **Mutations Must Persist**: Mọi thao tác Thêm/Sửa/Xóa phải ghi nhận bền vững vào D1; F5 Reload không mất dữ liệu.
5. **No Glassmorphism**: Light mode high-contrast civic tech (`#FDFBF7` cream, `#231b14` ink, `#0d6f64` teal, `#9f241f` seal red). Touch targets $\ge 44\text{px}$.
6. **Zero Jargon UI**: Ngôn từ tiếng Việt ngắn gọn, đời thường (Button 1-3 từ). Cấm thuật ngữ kỹ thuật (DAG, SHA-256, SLA, Telemetry...) trên UI người dùng.
7. **Runtime Evidence Required**: `BUILD PASS != FEATURE PASS` và `TEST PASS != PRODUCT PASS`. Cấm tuyên bố DONE nếu chưa kiểm chứng trực tiếp qua DevTools/Browser.
8. **Vertical Slice Execution**: Mỗi lần chỉ giải quyết 1 lát cắt nghiệp vụ trọn vẹn (User Journey), không làm dàn trải.

---

## 3. Five Disciplines (5 Trụ Cột Kỷ Luật Agent)

### A. Architecture
- Luôn khảo sát cấu trúc hiện hữu trước khi viết dòng code nào (`Reuse > Extend > Refactor > Create`).
- Không tạo luồng nghiệp vụ song song; không tạo API thứ hai cho cùng một năng lực nghiệp vụ.
- Không thêm framework/thư viện mới nếu không có yêu cầu bắt buộc và bằng chứng kỹ thuật.
- Không tái cấu trúc (reorganize) mã nguồn đang chạy chỉ vì mục đích thẩm mỹ cá nhân.

### B. Product & Human-Centric
- Tối ưu hóa trải nghiệm trọn vẹn của người dùng (User Journey), không tối ưu component rời rạc.
- Mỗi màn hình chỉ có 1 mục đích chính duy nhất và 1 hành động ưu tiên rõ ràng (Dominant CTA).
- Mobile-first cho các vai trò vận hành ngoài hiện trường (Citizen, Staff, Contractor) với thao tác 1 tay, dưới ánh nắng.
- Tiếng Việt đời thường, dễ hiểu với người dân và cán bộ; không giải thích chi tiết kỹ thuật cho người dùng.

### C. Backend & Persistence
- Không giả mạo thành công (No fake success). Không dùng mock persistence khi D1 được kỳ vọng.
- Mọi đột biến (CREATE / UPDATE / DELETE) phải được kiểm chứng tồn tại sau khi tải lại trang (reload/re-query).
- Kiểm tra hợp lệ đầu vào (Validation), phân quyền nghiêm ngặt (RBAC) và trả lỗi chuẩn RFC 7807 Problem Details.

### D. Verification & Quality Gates
- **BUILD PASS != FEATURE PASS** | **TEST PASS != PRODUCT PASS**.
- Tính năng chỉ DONE khi có bằng chứng thực tế tại runtime: 0 console error, 0 network error, layout không tràn ngang.
- Tự động chạy kiểm thử mục tiêu sau mỗi lần thay đổi trước khi chuyển bước.

### E. Git & Traceability
- Kiểm tra `git diff` trước khi hoàn tất công việc; loại bỏ 100% mã debug và artifact tạm.
- Không refactor diện rộng lan man; thực hiện micro-commit sau mỗi lát cắt nghiệp vụ đạt chuẩn kiểm thử.

---

## 4. The 8-Stage Development Loop
```text
SPEC → IMPLEMENT → VERIFY CODE → OBSERVE PRODUCT → REVIEW UX → FIX LOOP → COMMIT → NEXT
```

---

## 5. Modular Context Quick Reference (< 0.05s)

| Phân hệ / Tác vụ | Tài liệu SSOT chuyên biệt | Targeted Fast Test |
|---|---|---|
| **Definition of Done (DoD)** | [`DEFINITION_OF_DONE.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/DEFINITION_OF_DONE.md) | `npm --prefix app run verify:quick` |
| **8-Stage Workflow** | [`WORKFLOW.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/WORKFLOW.md) | `node --test app/tests/dev-runtime-verification.test.js` |
| **10 Standard Prompts** | [`PROMPTS.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/PROMPTS.md) | `node --test app/tests/domain-logic.test.js` |
| **Architecture & Database** | [`SSOT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/SSOT.md) | `node --test app/tests/staff-monitoring-d1-api.test.js` |
| **Human-Centric & UI Audit** | [`HUMAN_CENTRIC_AUDIT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/HUMAN_CENTRIC_AUDIT.md) | `node --test app/tests/citizen-observation-lifecycle.test.js` |
| **Codebase Simplification** | [`CODEBASE_SIMPLIFICATION.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/CODEBASE_SIMPLIFICATION.md) | `node --test app/tests/design-system-tokens.test.js` |
| **Bug Memory & Anti-Regression** | [`BUG_MEMORY.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/BUG_MEMORY.md) | `node --test app/tests/api-response-contract.test.js` |
| **Harness CLI & Automation** | [`docs/engineering/agy-workflow.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/engineering/agy-workflow.md) | `node scripts/harness.js verify` |

---

## 6. Direct PowerShell CLI Commands
```powershell
# Chạy test nhanh 1 file (< 0.5s)
node --test app/tests/<target>.test.js

# Chạy Quick Gate trước khi commit (< 7s)
npm --prefix app run verify:quick

# Chạy bộ điều phối Harness
node scripts/harness.js verify
```

