# AGENTS.md — DustGuard VN Agent Operating System & High-Velocity Contract

## 1. Identity & Mission
You are maintaining **DustGuard VN** — A CivicTech platform empowering Youth Communities (CLBs, schools, volunteers) and citizens to observe environmental issues, establish structured evidence, follow up over time, and execute transparent handoffs.

---

## 2. Core Invariants (Tối thượng)
1. **D1 is SSOT**: Cloudflare D1 (`env.DB` / `dev.db`) is the persistent database. Never use client localStorage as database.
2. **Observation != Case**: Observations are initial environmental sightings; Cases are systematic multi-party tracking entities.
3. **IoT is Optional**: System must function 100% with 0 sensors connected (normalized across available components).
4. **AI is Assistant, Not Judge**: AI assists in classification, summarization, and suggestions; never issues automated sanctions.
5. **No Glassmorphism**: Light mode high-contrast civic tech (`#FDFBF7` cream, `#231b14` ink, `#0d6f64` teal, `#9f241f` seal red). Dark text on light bg, light text on dark bg. Touch targets >= 44px.
6. **Zero Mock in Core Paths**: Real D1 SQLite queries and API endpoints, never mock fake entities in catch blocks.
7. **Fast Inner Loop**: Run targeted test (`node --test app/tests/<file>.test.js`) in < 0.5s before committing.
8. **Proactive PowerShell CLI**: Run commands directly via CLI, do not ask user to copy-paste.

---

## 3. High-Velocity Boot Protocol (On-Demand SSOT < 0.05s)

> **Nguyên tắc tốc độ**: Để code siêu tốc mà vẫn chuẩn SSOT, KHÔNG đọc toàn bộ tài liệu cùng lúc. Áp dụng quy tắc nạp 2 cấp độ:

### Bước 1: Quick Boot (< 0.05s)
Đọc 2 file cốt lõi để nắm ngay nhiệm vụ và quy tắc:
1. [`.agents/INDEX.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/INDEX.md) (Cheatsheet & Golden rules)
2. [`.agents/memory-bank/ACTIVE_CONTEXT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/memory-bank/ACTIVE_CONTEXT.md) (Nhiệm vụ đang xử lý)

### Bước 2: On-Demand Tra Cứu (Chỉ đọc file liên quan trực tiếp đến task)
- Khi sửa **Database / Schema / D1**: Tra cứu [`DATABASE.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DATABASE.md)
- Khi làm **Giao diện / Component / Token**: Tra cứu [`UI.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/UI.md)
- Khi viết **API / Route / Hono Edge**: Tra cứu [`API.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/API.md) hoặc [`ROUTES.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/ROUTES.md)
- Khi xử lý **Nghiệp vụ / Domain Logic**: Tra cứu [`DOMAIN.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DOMAIN.md) hoặc [`PRODUCT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/PRODUCT.md)
- Khi làm **Auth / Phân quyền RBAC**: Tra cứu [`AUTH.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/AUTH.md)
- Khi tra cứu **Mốc Timeline / Commits**: Tra cứu [`TIMELINE.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/TIMELINE.md)
- Khi xem **Bẫy lỗi & Phòng ngừa**: Tra cứu [`BUG_MEMORY.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/BUG_MEMORY.md)
- Khi viết **Test / Verification**: Tra cứu [`TESTING.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/TESTING.md)

---

## 4. High-Velocity Fast Dev Loop (5-Tier Verification Pipeline)

> **QUY TẮC CỐT LÕI**: **TUYỆT ĐỐI KHÔNG** chạy `npm run verify` sau mỗi lần sửa code nhỏ. Chỉ sử dụng 5 tầng kiểm thử phân cấp:

1. **Level 0 (Targeted Test - 0.2s - 1.5s)**: Chạy test đơn lẻ ngay khi đang code:
   ```powershell
   node --test app/tests/<target_test>.test.js
   ```
2. **Level 1 (Verify Changed - < 3s)**: Chạy sau khi sửa 1 batch file:
   ```powershell
   npm --prefix app run verify:changed
   ```
3. **Level 2 (Verify Domain - < 5s)**: Chạy kiểm thử theo domain chức năng:
   ```powershell
   npm --prefix app run verify:domain -- observations
   ```
4. **Level 3 (Verify Quick - < 8s)**: Default gate cho AI Agent trước khi hoàn tất task:
   ```powershell
   npm --prefix app run verify:quick
   ```
5. **Level 4 (Verify Full / Release Gate - Chạy DUY NHẤT 1 lần trước Release/Commit)**:
   ```powershell
   npm --prefix app run verify
   ```

### Quy trình phục hồi khi Full Verify thất bại (Failure Recovery):
```text
Test thất bại
  ↓
Xem failed suite
  ↓
Chạy targeted test cho riêng failed suite: node --test app/tests/<failed>.test.js
  ↓
Sửa code đúng nguyên nhân gốc
  ↓
Chạy lại targeted test & verify:quick
```

---

## 5. Technical Definition of Done (DoD)
- [ ] DDD Bounded contexts preserved
- [ ] D1 persistence verified via real SQL queries & spatial adapter
- [ ] All unit and integration tests passing (`verify:quick`)
- [ ] Responsive UI verified (Mobile 360-430px & Desktop, touch target >= 44px, no glassmorphism)
- [ ] Test pass is not enough: Real domain input/output value verified
- [ ] Memory bank, timeline and bug memory updated

---

## 6. Micro-Commit Protocol & Git SSOT Traceability (Tối Thượng)
1. **Commit Ngay Khi Xong Việc Nhỏ**: Thực hiện micro-commit ngay sau mỗi tính năng, refactor hoặc bugfix vừa được kiểm thử thành công. Tuyệt đối không tích lũy nhiều thay đổi lớn mà không commit.
2. **Quy Trình 3 Bước Bắt Buộc**:
   - Bước 1: Chạy xác thực (`npm --prefix app run verify:quick` hoặc targeted test) pass 100%.
   - Bước 2: Cập nhật `.agents/memory-bank/ACTIVE_CONTEXT.md`, `.agents/ssot/TIMELINE.md` và `.agents/BUG_MEMORY.md`.
   - Bước 3: Tự động chạy `git add` và `git commit -m "<type>(scope): <description>"` qua CLI.
3. **Chủ Động Thực Thi**: Agent tự chạy lệnh commit ngay trên hệ thống, không yêu cầu người dùng làm thủ công.
