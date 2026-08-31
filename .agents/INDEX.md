# DUSTGUARD VN — AGENT FAST-BOOT CHEATSHEET (< 0.05s)

> **Mục tiêu**: Nắm bắt 100% kiến trúc, quy tắc, lệnh CLI và đường dẫn SSOT chỉ trong 5 giây mà không cần đọc toàn bộ tài liệu.

---

## ⚡ 1. Golden Rules (10 Nguyên Tắc Tối Thượng)
1. **D1 SQLite is Persistent SSOT**: Database thật tại `prisma/dev.db` và Cloudflare D1. Tuyệt đối không dùng localStorage làm CSDL chính.
2. **Zero Mock in Business Paths**: Không hardcode fake data trong catch blocks hay API wrappers. Luôn dùng ErrorState/EmptyState chân thực.
3. **Observation != Case**: Ghi nhận (Observation) là phát hiện ban đầu từ cộng đồng; Vụ việc (Case) là hồ sơ theo dõi 7 bước tác nghiệp đa bên.
4. **Zero-IoT Resilience**: Hệ thống hoạt động 100% khi có 0 cảm biến (chuẩn hóa trọng số `sum(score * w) / sum(w)`).
5. **AI is Assistant, Not Judge**: AI hỗ trợ tóm tắt, trích xuất và gợi ý; con người và quy chuẩn thực tế quyết định.
6. **Light Mode High-Contrast Civic Tech**: Tuyệt đối **KHÔNG Glassmorphism** (`backdrop-blur-*`). Màu chủ đạo: `#FDFBF7` cream, `#231b14` ink, `#0d6f64` teal, `#9f241f` seal red. Nền sáng chữ đậm, nền đậm chữ sáng. Touch target tối thiểu **44px x 44px**.
7. **Windows PowerShell CLI**: Chạy lệnh trực tiếp qua CLI, không bảo user làm. Dùng lệnh PowerShell chuẩn (`Select-String`, `$env:`).
8. **Proactive DevTools & Live Inspection**: Tự động kết nối Chrome DevTools MCP duyệt trang thật, kiểm tra DOM/Network/Console và auto-fix runtime bugs ngay lập tức.
9. **Natural Civic Copy & Zero Jargon**: Ngắn — Rõ — Dễ hiểu — Không nhồi nhét thuật ngữ (DAG, SHA-256, HMAC, SLA, IoT Node...). UI phục vụ người dân và cán bộ thực tế.
10. **Responsive 14-Inch Desktop & Mobile**: Bắt buộc tương thích hoàn hảo tại 1366x768, 1440x900, 1536x864, 1920x1080 và Mobile 360-430px (zero header menu wrap, zero button wrap, zero horizontal scroll vô lý).

---

## 🎯 2. Domain-to-Test Instant Lookup (< 0.5s Fast Loop)

| Khi bạn đang làm việc trên | Tài liệu SSOT tương ứng | Lệnh chạy test tức thì |
|---|---|---|
| **Đăng nhập, Phân quyền, Người dùng** | [`.agents/ssot/AUTH.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/AUTH.md) | `node --test app/tests/auth-user-management-audit.test.js` |
| **Ghi nhận phản ánh công dân (30s)** | [`.agents/ssot/DOMAIN.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DOMAIN.md) | `node --test app/tests/citizen-observation-lifecycle.test.js` |
| **Xử lý hồ sơ vụ việc (Case 7 bước)** | [`.agents/ssot/WORKFLOWS.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/WORKFLOWS.md) | `node --test app/tests/case-enforcement-dag-7steps.test.js` |
| **Bản đồ GIS & Geofence hiện trường** | [`.agents/ssot/MAP.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/MAP.md) | `node --test app/tests/spatial-intelligence-map.test.js` |
| **UI Components, Design Tokens, CSS** | [`.agents/ssot/UI.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/UI.md) | `node --test app/tests/design-system-tokens.test.js` |
| **Tín chỉ Thanh niên & Mã QR ISO** | [`.agents/ssot/DOMAIN.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DOMAIN.md) | `node --test app/tests/youth-credits.test.js` |
| **Chỉ đạo Lãnh đạo & Ký duyệt A4** | [`.agents/ssot/EXECUTIVE_OPS_SSOT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/EXECUTIVE_OPS_SSOT.md) | `node --test app/tests/executive-command-center.test.js` |
| **Cổng tiếp nhận Nhà thầu (Zero-Login)**| [`.agents/ssot/CIVIC_HANDOFF_SSOT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/CIVIC_HANDOFF_SSOT.md) | `node --test app/tests/contractor-ui-workspace.test.js` |
| **API Backend & Hono Worker Routes** | [`.agents/ssot/API.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/API.md) | `node --test app/tests/worker-full-edge-routes.test.js` |
| **Cơ sở dữ liệu D1 & Migrations** | [`.agents/ssot/DATABASE.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DATABASE.md) | `node --test app/tests/d1-schema.test.js` |
| **Bẫy lỗi thường gặp & Giải pháp** | [`.agents/BUG_MEMORY.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/BUG_MEMORY.md) | `node --test app/tests/dev-runtime-verification.test.js` |

---

## 📂 3. Cấu Trúc SSOT Thống Nhất

```text
.agents/
├── INDEX.md                     # File này (Fast-boot cheatsheet < 0.05s)
├── BUG_MEMORY.md                # Bẫy lỗi & nguyên nhân gốc rễ (SSOT)
├── LESSONS.md                   # Bài học kiến trúc & quy chuẩn hệ thống
├── memory-bank/
│   ├── ACTIVE_CONTEXT.md        # Trạng thái nóng & mục tiêu hiện tại (< 5KB)
│   ├── CURRENT_STATE.md         # Trạng thái tổng quan hệ thống
│   └── TIMELINE.md              # Lịch sử phát triển & mốc hoàn thành
├── rules/                       # Các quy tắc kỹ thuật độc lập
│   ├── civic-high-contrast-ui.md
│   ├── domain-business-invariants.md
│   ├── powershell-execution.md
│   ├── verification-pipeline.md
│   └── zero-mock-d1-ssot.md
├── skills/                      # 7 Agent skills chuyên trách
│   ├── civic-high-contrast-ui/
│   ├── d1-sqlite-engine/
│   ├── domain-logic-verifier/
│   ├── evidence-r2-verification/
│   ├── fast-verification-pipeline/
│   ├── powershell-dev-ops/
│   └── asset-sheet-extractor/
└── ssot/                        # Hồ sơ nghiệp vụ chi tiết theo domain
    ├── API.md, AUTH.md, DATABASE.md, DOMAIN.md, MAP.md, UI.md, WORKFLOWS.md
    └── CIVIC_HANDOFF_SSOT.md, EXECUTIVE_OPS_SSOT.md, TIMELINE.md
```

---

## 🚀 4. Fast Verification Loop (5 Tầng kiểm thử)

| Cấp độ | Mục đích | Lệnh PowerShell | Thời gian |
|---|---|---|---|
| **Level 0 (Targeted)** | Kiểm tra 1 file test đang code | `node --test app/tests/<file>.test.js` | < 0.5s |
| **Level 1 (Changed)** | Kiểm tra các file vừa sửa | `npm --prefix app run verify:changed` | < 3s |
| **Level 2 (Domain)** | Kiểm tra theo domain nghiệp vụ | `npm --prefix app run verify:domain -- <domain>` | < 5s |
| **Level 3 (Quick)** | Gate bắt buộc trước khi xong task | `npm --prefix app run verify:quick` | < 7s |
| **Level 4 (Full)** | Chạy DUY NHẤT 1 lần trước release | `npm --prefix app run verify` | ~ 30s |
