# AGENTS.md — DustGuard VN Agent Operating System & High-Velocity Contract

## 1. Identity & Mission
You are maintaining **DustGuard VN** — A CivicTech platform empowering Youth Communities (CLBs, schools, volunteers) and citizens to observe environmental issues, establish structured evidence, follow up over time, and execute transparent handoffs.

---

## 2. Core Invariants (11 Nguyên Tắc Tối Thượng)
1. **D1 is SSOT**: Cloudflare D1 (`env.DB` / `prisma/dev.db`) là CSDL chân thực duy nhất. Cấm dùng client localStorage làm CSDL lưu trữ chính.
2. **Observation != Case**: Ghi nhận (Observation) là phát hiện ban đầu từ cộng đồng; Vụ việc (Case) là hồ sơ theo dõi 7 bước tác nghiệp đa bên.
3. **IoT is Optional**: Hệ thống hoạt động 100% khi có 0 cảm biến (chuẩn hóa trọng số `sum(score * w) / sum(w)`).
4. **AI is Assistant, Not Judge**: AI hỗ trợ tóm tắt, trích xuất và gợi ý; con người và quy chuẩn thực tế quyết định.
5. **No Glassmorphism**: Light mode high-contrast civic tech (`#FDFBF7` cream, `#231b14` ink, `#0d6f64` teal, `#9f241f` seal red). Cấm `backdrop-blur-*`. Touch targets $\ge 44\text{px}$.
6. **Zero Truncate on Critical Civic Entities (UI Text SSOT)**: Cấm dùng `truncate`, `line-clamp`, `overflow-hidden` để che tên công trình, hồ sơ, nhiệm vụ. Copy phải ngắn gọn từ Presentation Layer. Đọc được > Nhét nhiều.
7. **Zero Mock in Core Paths**: Dữ liệu thật qua D1 SQLite queries & API endpoints, không mock fake entities trong catch blocks.
8. **Fast Inner Loop (< 0.5s)**: Chạy test đơn lẻ mục tiêu (`node --test app/tests/<file>.test.js`) ngay khi code, không spam full verify.
9. **Proactive PowerShell CLI & Live DevTools**: Tự động chạy lệnh CLI trực tiếp qua PowerShell và dùng Chrome DevTools MCP duyệt trang thật, bắt lỗi runtime và sửa code ngay lập tức (không thụ động chờ user nhắc).
10. **Natural Civic Copy & Zero Jargon**: Ngôn từ Ngắn — Rõ — Dễ hành động — Phù hợp thực tế. Cấm thuật ngữ kỹ thuật (DAG, SHA-256, HMAC, SLA, telemetry...) trên UI người dùng phổ thông.
11. **Responsive 14-Inch Desktop & Mobile SSOT**: Bắt buộc tương thích hoàn hảo tại 1366x768, 1440x900, 1536x864, 1920x1080 và Mobile 360-430px (zero header menu wrap, zero button wrap, zero horizontal scroll vô lý).
12. **API Data Contract & Collection Normalization**: Frontend cấm đoán response shape; API client layer (`*api.js`, `request.js`) bắt buộc unwrap & normalize collection về array `[]` và object về safe default trước khi đưa vào React component. Cấm nhét payload lỗi vào state thành công.
13. **Business-Value Testing (Trọng Giá Trị Thực, Không Chạy Theo Số Lượng)**:
    - **Unit test**: Business logic, utils, validators, risk/scoring engines.
    - **Integration test**: API + SQLite/D1 thật + Auth + RBAC permissions.
    - **Contract test**: Frontend/Backend response shape unwrap.
    - **E2E**: Chỉ các luồng sống còn (P0 User Journeys).
    - **UI test**: Hành vi quan trọng (Behavior > Markup/CSS brittle lock).
    - Cấm tạo test chỉ để tăng coverage, cấm duplicate assertions, cấm over-mocking.

---

## 3. Quick Decision & Instant Lookup Matrix (< 0.05s)

| Phân hệ / Tác vụ | Tài liệu SSOT cần đọc | Targeted Test (< 0.5s) | Ghi chú cốt lõi |
|---|---|---|---|
| **Master SSOT Architecture** | [`SSOT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/SSOT.md) | `node --test app/tests/staff-monitoring-d1-api.test.js` | 12 Bảng D1, RBAC 5 roles, 7 Bước DAG, WGS84 Geofence, QCVN |
| **Master Development Rules** | [`RULES.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/RULES.md) | `node --test app/tests/design-system-tokens.test.js` | 4-Step Loop, UI Rules, API Normalization `[]`, 5-Tier Testing |
| **Human-Centric & UI Audit** | [`HUMAN_CENTRIC_AUDIT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/HUMAN_CENTRIC_AUDIT.md) | `node --test app/tests/citizen-observation-lifecycle.test.js` | 40 Screens Audit, Dual-Score Matrix, 0% Developer Jargon |
| **Bug Memory & Anti-Regression** | [`BUG_MEMORY.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/BUG_MEMORY.md) | `node --test app/tests/dev-runtime-verification.test.js` | Tra cứu nguyên nhân gốc rễ và bài học phòng ngừa lỗi |
| **Timeline & Traceability** | [`TIMELINE.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/TIMELINE.md) | `npm --prefix app run verify:quick` | Lịch sử commit, tiến độ, Active Context và Git Traceability |

---

## 4. High-Velocity Fast Dev Loop (5-Tier Verification Pipeline)

> **QUY TẮC TỐC ĐỘ**: Trong lúc code, **CHỈ CHẠY Level 0** (< 0.5s). Chỉ chạy Level 3 trước khi bàn giao và Level 4 khi release.

```text
[Code / Sửa file] 
       ↓
[Level 0: node --test app/tests/<target>.test.js] (< 0.5s) ──(Fail)──> Sửa ngay tại chỗ
       ↓ (Pass)
[Sửa xong 1 nhóm file] 
       ↓
[Level 1: npm --prefix app run verify:changed] (< 3s)
       ↓ (Pass)
[Level 3 Gate: npm --prefix app run verify:quick] (< 7s)
       ↓ (Pass 100%)
[Micro-Commit & Cập nhật Memory-Bank]
```

### Chi tiết 5 tầng kiểm thử:
1. **Level 0 (Targeted Test - 0.2s - 0.5s)**: Chạy test đơn lẻ ngay khi code:
   ```powershell
   node --test app/tests/<file>.test.js
   ```
2. **Level 1 (Verify Changed - < 3s)**: Chạy sau khi sửa 1 batch file:
   ```powershell
   npm --prefix app run verify:changed
   ```
3. **Level 2 (Verify Domain - < 5s)**: Chạy kiểm thử theo domain:
   ```powershell
   npm --prefix app run verify:domain -- <domain>
   ```
4. **Level 3 (Verify Quick - < 7s)**: Default gate bắt buộc trước khi hoàn tất task:
   ```powershell
   npm --prefix app run verify:quick
   ```
5. **Level 4 (Verify Full / Release Gate - Chạy 1 LẦN DUY NHẤT trước release lớn)**:
   ```powershell
   npm --prefix app run verify
   ```

---

## 5. Direct PowerShell CLI Execution Toolkit

| Thao tác | Lệnh PowerShell một dòng |
|---|---|
| **Chạy test nhanh 1 file** | `node --test app/tests/<target>.test.js` |
| **Chạy quick gate** | `npm --prefix app run verify:quick` |
| **Kiểm tra UI Smoke** | `node --test app/tests/design-system-tokens.test.js app/tests/community-home-layout.test.js` |
| **Build kiểm tra Bundle** | `npm --prefix app run build` |
| **Khởi động Dev Server** | `npm --prefix app run dev` |
| **Xem trạng thái Git** | `git status` |
| **Commit nhanh chuẩn SSOT** | `git add . ; git commit -m "<type>(<scope>): <message>"` |

---

## 6. Micro-Commit Protocol & Git SSOT Traceability (Tối Thượng)
1. **Commit Ngay Khi Xong Việc Nhỏ**: Thực hiện micro-commit ngay sau mỗi tính năng, refactor hoặc bugfix vừa được kiểm thử thành công (`verify:quick` pass 100%). Tuyệt đối không gom nhiều thay đổi lớn mà không commit.
2. **Quy Trình 3 Bước Bắt Buộc**:
   - **Bước 1**: Chạy xác thực Level 3 (`npm --prefix app run verify:quick`) pass 100%.
   - **Bước 2**: Cập nhật `.agents/memory-bank/ACTIVE_CONTEXT.md`, `.agents/ssot/TIMELINE.md` và `.agents/BUG_MEMORY.md`.
   - **Bước 3**: Tự động chạy `git add` và `git commit -m "<type>(scope): <description>"` qua CLI.
3. **Chủ Động Thực Thi**: Agent tự chạy lệnh commit ngay trên hệ thống bằng PowerShell CLI, không yêu cầu người dùng làm thủ công.
