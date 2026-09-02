# Codebase Map — DustGuard VN

## Applications / Packages

| Area | Path | Responsibility | Entry point |
|---|---|---|---|
| **Root Workspace** | `d:/07-Competitions-Hackathons/unicef-dustguard` | Chứa cấu hình root, scripts điều phối, tài liệu và các gói firmware/driver IoT. | `package.json` |
| **App Core (Vite + SPA)** | `app/` | Ứng dụng chính bao gồm React 19 Frontend và Edge Hono/Cloudflare Worker. | `app/src/main.jsx` |
| **Worker / Server API** | `app/server/` | 20 modules Edge routing (Hono) xử lý business logic, D1 queries, R2 storage, Auth RBAC. | `app/server/index.js`, `app/server/worker.js` |
| **Database Migrations** | `app/prisma/` | Định nghĩa schema SQLite D1 SSOT (46 bảng), Prisma schema và seed data. | `app/prisma/d1-schema.sql` |
| **Automated Verification** | `app/tests/` & `app/scripts/` | 28 bộ test in-memory + UI smoke, dev-runner, backup, validation. | `app/tests/*.test.js` |

## Runtime layers

| Layer | Location | Responsibility |
|---|---|---|
| **Presentation Layer (UI)** | `app/src/apps/` & `app/src/modules/` | 5 Role Sub-Apps: Public/Landing, Citizen, Staff, Contractor, Admin. Giao diện Light-mode civic tech, Zero Glassmorphism. |
| **Client API & Auth Layer** | `app/src/lib/api/` & `app/src/lib/` | Chuẩn hóa HTTP client (`request.js`, `staff-api.js`, `contractor-api.js`), RBAC rules, token parser. |
| **Edge API Routing Layer** | `app/server/routes/worker/` | Hono Worker endpoints phục vụ REST APIs, RFC 7807 problem details, zero mock. |
| **Persistence / Storage Layer** | Cloudflare D1 (`env.DB` / `dev.db`) & R2 Storage | D1 SQLite 46 bảng quan hệ + Cloudflare R2 lưu trữ ảnh bằng chứng SHA-256. |

## Important directories

| Directory | Purpose | Active? |
|---|---|---|
| `app/src/apps/public` | Landing page, Demo hub, Tra cứu bản đồ cộng đồng, Hướng dẫn cảm biến | ACTIVE |
| `app/src/apps/citizen` | Cổng công dân / thanh niên: Ghi nhận vi phạm, theo dõi hồ sơ, tích lũy tín chỉ | ACTIVE |
| `app/src/apps/staff` | Cổng cán bộ / giám sát: 12 phân hệ tác nghiệp, công trình, hồ sơ vụ việc, cảnh báo | ACTIVE |
| `app/src/apps/contractor` | Cổng nhà thầu: Tiếp nhận yêu cầu khắc phục, nộp minh chứng Before/After | ACTIVE |
| `app/src/apps/admin` | Quản trị hệ thống: Quản lý người dùng, phân quyền, cấu hình hệ thống | ACTIVE |
| `app/server/routes/worker` | 20 tệp router Hono xử lý toàn bộ REST endpoints | ACTIVE |
| `app/prisma` | Schema D1 SQL, Prisma schema, canonical seed scripts | ACTIVE |
| `app/tests` | Bộ kiểm thử tự động 28 test suites (>230 in-memory tests + UI tests) | ACTIVE |
| `legacy/` | Mã nguồn cũ / lưu trữ lịch sử | ARCHIVED / INACTIVE |

## Configuration

| Config | Purpose |
|---|---|
| `app/wrangler.jsonc` | Cấu hình Cloudflare Workers, binding D1 database (`dustguard-production`), R2 bucket |
| `app/vite.config.js` | Cấu hình Vite SPA bundler, proxy API `/api -> http://127.0.0.1:8787` |
| `app/.dev.vars` & `.env` | Biến môi trường local và JWT secrets |
| `app/scripts/dev-runner.js` | Orchestration runner tự động kiểm tra xung đột port và chạy Vite + Wrangler đồng thời |

## Tests

| Test group | Covers |
|---|---|
| **Critical Domain Tests** | Observation lifecycle, Case 7-step DAG, SLA 48h, Geofence <=50m, Youth credits (20h = 4.0 tín chỉ) |
| **Edge Worker Tests** | 20 worker route suites, RFC 7807 error format, D1 state transitions, R2 storage uploads |
| **UI & Layout Smoke Tests** | Design system tokens, Responsive 360px - 1920px, Zero glassmorphism, Zero truncate on critical text |
| **Staff D1 Operations** | 12 bảng nghiệp vụ tối thiểu, Audit logs, Risk score recalculation |
