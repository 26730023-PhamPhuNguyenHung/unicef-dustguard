# AGENTS.md — DustGuard VN Agent Operating System (Master Contract)

## 1. Identity & Core Mission
You are maintaining **DustGuard VN** — A CivicTech platform empowering Youth Communities (CLBs, schools, volunteers) and citizens to observe environmental issues, establish structured evidence, follow up over time, and execute transparent handoffs.

---

## 2. Core Invariants (8 Nguyên Tắc Sống Còn)
1. **Read Before Editing**: Luôn đọc code và context liên quan trước khi sửa; không quét toàn bộ repo bừa bãi.
2. **Never Duplicate**: Tái sử dụng tối đa (`Reuse > Refactor > New Code`); cấm tạo component/service/schema trùng lặp.
3. **D1 is SSOT**: Cloudflare D1 (`prisma/dev.db`) là CSDL chân thực duy nhất; cấm lưu trữ qua localStorage; cấm mock khi API thật đã có.
4. **Mutations Must Persist**: Mọi thao tác Thêm/Sửa/Xóa phải ghi nhận bền vững vào D1; F5 Reload không mất dữ liệu.
5. **No Glassmorphism**: Light mode high-contrast civic tech (`#FDFBF7` cream, `#231b14` ink, `#0d6f64` teal, `#9f241f` seal red). Touch targets $\ge 44\text{px}$.
6. **Zero Jargon UI**: Ngôn từ tiếng Việt ngắn gọn, đời thường (Button 1-3 từ). Cấm thuật ngữ kỹ thuật (DAG, SHA-256, SLA, Telemetry...) trên UI người dùng.
7. **Runtime Evidence Required**: `BUILD PASS != FEATURE PASS` và `TEST PASS != UX PASS`. Cấm tuyên bố DONE nếu chưa kiểm chứng trực tiếp qua DevTools/Browser.
8. **Vertical Slice Execution**: Mỗi lần chỉ giải quyết 1 lát cắt nghiệp vụ trọn vẹn (User Journey), không làm dàn trải.

---

## 3. The 8-Stage Development Loop
```text
SPEC → IMPLEMENT → VERIFY CODE → OBSERVE PRODUCT → REVIEW UX → FIX LOOP → COMMIT → NEXT
```
- **SPEC**: Đặt mục tiêu người dùng & tiêu chí máy đo được (Executable AC). Chi tiết xem [`WORKFLOW.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/WORKFLOW.md).
- **IMPLEMENT**: Xây dựng với cây phụ thuộc nhỏ nhất (Minimum Working Set).
- **VERIFY CODE**: Chạy test mục tiêu `< 0.5s`: `node --test app/tests/<target>.test.js`.
- **OBSERVE PRODUCT**: Kiểm tra DevTools trên 375px & 1366px, kiểm tra Console (0 error), Network, và D1 persistence.
- **REVIEW UX**: Rà soát độ dễ hiểu và tính tiếp cận theo [`HUMAN_CENTRIC_AUDIT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/HUMAN_CENTRIC_AUDIT.md).
- **FIX LOOP**: Sửa dứt điểm nguyên nhân gốc rễ (Root Cause).
- **COMMIT**: Micro-commit lưu trạng thái sau khi test Level 3 Gate (`npm --prefix app run verify:quick`) pass 100%.
- **NEXT**: Chuyển sang User Journey tiếp theo theo [`DEFINITION_OF_DONE.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/DEFINITION_OF_DONE.md).

---

## 4. Modular Context Quick Reference (< 0.05s)

| Phân hệ / Tác vụ | Tài liệu SSOT chuyên biệt | Targeted Fast Test |
|---|---|---|
| **Definition of Done (DoD)** | [`DEFINITION_OF_DONE.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/DEFINITION_OF_DONE.md) | `npm --prefix app run verify:quick` |
| **8-Stage Workflow** | [`WORKFLOW.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/WORKFLOW.md) | `node --test app/tests/dev-runtime-verification.test.js` |
| **10 Standard Prompts** | [`PROMPTS.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/PROMPTS.md) | `node --test app/tests/domain-logic.test.js` |
| **Architecture & Database** | [`SSOT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/SSOT.md) | `node --test app/tests/staff-monitoring-d1-api.test.js` |
| **Human-Centric & UI Audit** | [`HUMAN_CENTRIC_AUDIT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/HUMAN_CENTRIC_AUDIT.md) | `node --test app/tests/citizen-observation-lifecycle.test.js` |
| **Codebase Simplification** | [`CODEBASE_SIMPLIFICATION.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/CODEBASE_SIMPLIFICATION.md) | `node --test app/tests/design-system-tokens.test.js` |
| **Bug Memory & Anti-Regression** | [`BUG_MEMORY.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/BUG_MEMORY.md) | `node --test app/tests/api-response-contract.test.js` |
| **Timeline & Traceability** | [`TIMELINE.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/TIMELINE.md) | `git status --short` |

---

## 5. Direct PowerShell CLI Commands
```powershell
# Chạy test nhanh 1 file (< 0.5s)
node --test app/tests/<target>.test.js

# Chạy Quick Gate trước khi commit (< 7s)
npm --prefix app run verify:quick

# Micro-commit chuẩn SSOT
git add . ; git commit -m "<type>(scope): <description>"
```
