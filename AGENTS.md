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

---

## 3. Quick Decision & Instant Lookup Matrix (< 0.05s)

| Phân hệ / Tác vụ | Tài liệu SSOT cần đọc | Targeted Test (< 0.5s) | Ghi chú cốt lõi |
|---|---|---|---|
| **UI Text & Responsive Rules** | [`UI_RULES.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/rules/UI_RULES.md) | `node --test app/tests/design-system-tokens.test.js` | Zero truncate tên công trình/hồ sơ, min-w-0 flex, copy ngắn |
| **Auth, Users & RBAC** | [`AUTH.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/AUTH.md) | `node --test app/tests/auth-user-management-audit.test.js` | 5 Roles chuẩn: public, citizen, community, staff, executive |
| **Ghi nhận Cộng đồng (Observation)** | [`DOMAIN.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DOMAIN.md) | `node --test app/tests/citizen-observation-lifecycle.test.js` | Status: RECORDED -> VERIFIED; 30s quick flow |
| **Hồ sơ Vụ việc (Case 7-Step DAG)** | [`WORKFLOWS.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/WORKFLOWS.md) | `node --test app/tests/case-enforcement-dag-7steps.test.js` | 7 Bước chuẩn: Tiếp nhận -> Khảo sát -> Đề xuất -> Hoàn tất |
| **Bản đồ GIS & Geofence** | [`MAP.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/MAP.md) | `node --test app/tests/spatial-intelligence-map.test.js` | WGS84 Spatial Adapter, Geofence <= 50m, center an toàn |
| **Giao diện, UI Tokens & CSS** | [`UI.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/UI.md) | `node --test app/tests/design-system-tokens.test.js` | No blur, Cream/Ink/Teal/Seal Red, touch >= 44px, nowrap button |
| **Tín chỉ Thanh niên & QR** | [`DOMAIN.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DOMAIN.md) | `node --test app/tests/youth-credits.test.js` | 20h = 4.0 tín chỉ, ISO/IEC 18004 QR Matrix SVG/PNG |
| **Điều hành Lãnh đạo (Executive)** | [`EXECUTIVE_OPS_SSOT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/EXECUTIVE_OPS_SSOT.md) | `node --test app/tests/executive-command-center.test.js` | NĐ 30/2020/NĐ-CP, A4 print, tamper-evident docHash |
| **Nhà thầu (Contractor)** | [`CIVIC_HANDOFF_SSOT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/CIVIC_HANDOFF_SSOT.md) | `node --test app/tests/contractor-ui-workspace.test.js` | Quick-token 0-login, Before/After evidence, Geofence check |
| **Edge Router & Hono API** | [`API.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/API.md) | `node --test app/tests/worker-full-edge-routes.test.js` | RFC 7807 problem details, zero duplicate routes |
| **D1 Schema & SQLite Migrations** | [`DATABASE.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DATABASE.md) | `node --test app/tests/d1-schema.test.js` | Composite indexes, schema-healer, real queries |
| **Bẫy lỗi & Phòng ngừa** | [`BUG_MEMORY.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/BUG_MEMORY.md) | `node --test app/tests/dev-runtime-verification.test.js` | Tra cứu nguyên nhân gốc rễ tránh lặp lại bug cũ |

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
