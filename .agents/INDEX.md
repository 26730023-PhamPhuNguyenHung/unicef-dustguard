# DUSTGUARD VN — AGENT FAST-BOOT CHEATSHEET (< 0.05s)

> **Mục tiêu**: Hỗ trợ agent nắm bắt toàn bộ kiến trúc, quy tắc, lệnh CLI và đường dẫn SSOT chỉ trong 5 giây.

---

## ⚡ 1. Golden Rules (Tối thượng - Không vi phạm)
1. **D1 SQLite is Persistent SSOT**: Database thật tại `prisma/dev.db` và Cloudflare D1. Không dùng client localStorage làm CSDL.
2. **Zero Mock in Business Paths**: Không hardcode fake data trong catch blocks hay API wrappers. Luôn dùng ErrorState/EmptyState chân thực.
3. **Observation != Case**: Ghi nhận (Observation) là phát hiện ban đầu từ cộng đồng/thanh niên; Vụ việc (Case) là hồ sơ theo dõi dài hạn đa bên để đối chứng và phối hợp khắc phục.
4. **Zero-IoT Resilience**: Hệ thống hoạt động 100% khi có 0 cảm biến (chuẩn hóa trọng số `sum(score * w) / sum(w)`). Cảm biến IoT là module mở rộng giá rẻ (< $25).
5. **AI is Assistant, Not Judge**: AI hỗ trợ tóm tắt, chuẩn hóa và kiểm tra ảnh; con người quyết định và hành động khắc phục.
6. **Light Mode High-Contrast Civic Tech**: Tuyệt đối **KHÔNG Glassmorphism** (`backdrop-blur-*`). Màu chủ đạo: `#FDFBF7` cream, `#231b14` ink, `#0d6f64` teal, `#9f241f` seal red. Nền sáng chữ đậm, nền đậm chữ sáng. Touch target tối thiểu **44px x 44px**.
7. **Windows PowerShell CLI**: Chạy lệnh trực tiếp qua CLI, không bảo user làm. Không dùng Unix pipe (`| grep`, `export`), dùng `Select-String`, `$env:`.

---

## 🚀 2. Fast Verification Loop (5 Tầng kiểm thử)
| Cấp độ | Mục đích | Lệnh PowerShell | Thời gian |
|---|---|---|---|
| **Level 0 (Targeted)** | Kiểm tra 1 file test đang code | `node --test app/tests/<file>.test.js` | < 0.5s |
| **Level 1 (Changed)** | Kiểm tra các file vừa sửa | `npm --prefix app run verify:changed` | < 3s |
| **Level 2 (Domain)** | Kiểm tra theo domain nghiệp vụ | `npm --prefix app run verify:domain -- <domain>` | < 5s |
| **Level 3 (Quick)** | Gate bắt buộc trước khi xong task | `npm --prefix app run verify:quick` | < 8s |
| **Level 4 (Full)** | Chạy DUY NHẤT 1 lần trước release | `npm --prefix app run verify` | ~ 15s |

---

## 📂 3. SSOT On-Demand Navigation (Tra cứu đúng việc)
- **Database & D1 Schema**: [`.agents/ssot/DATABASE.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DATABASE.md) | [`.agents/ssot/DATA_MODEL.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DATA_MODEL.md)
- **Spatial Intelligence Map & Geofence**: [`.agents/ssot/MAP.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/MAP.md)
- **UI Components & Tokens**: [`.agents/ssot/UI.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/UI.md)
- **API & Endpoints**: [`.agents/ssot/API.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/API.md) | [`.agents/ssot/ROUTES.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/ROUTES.md)
- **Domain & State Machines**: [`.agents/ssot/DOMAIN.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/DOMAIN.md) | [`.agents/ssot/PRODUCT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/PRODUCT.md) | [`.agents/ssot/TERMINOLOGY.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/TERMINOLOGY.md)
- **Auth & RBAC**: [`.agents/ssot/AUTH.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/AUTH.md) | [`.agents/ssot/ROLES.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/ROLES.md) | [`.agents/ssot/PERMISSIONS.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/PERMISSIONS.md)
- **Workflows, Operator & Civic Handoff**: [`.agents/ssot/WORKFLOWS.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/WORKFLOWS.md) | [`.agents/ssot/OPERATOR_WORKSPACE_SSOT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/OPERATOR_WORKSPACE_SSOT.md) | [`.agents/ssot/CIVIC_HANDOFF_SSOT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/CIVIC_HANDOFF_SSOT.md)
- **Executive & Signing**: [`.agents/ssot/EXECUTIVE_OPS_SSOT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/EXECUTIVE_OPS_SSOT.md)
- **Pitch & Brand Strategy**: [`.agents/ssot/PITCH_AND_BRAND_SSOT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/PITCH_AND_BRAND_SSOT.md)
- **SSOT Timeline & Commits**: [`.agents/ssot/TIMELINE.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/TIMELINE.md)
- **Bug Memory & Traps**: [`.agents/BUG_MEMORY.md`](file:///d:/07-Agents/unicef-dustguard/.agents/BUG_MEMORY.md)
- **Architecture Lessons**: [`.agents/LESSONS.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/LESSONS.md)

---

## 🧩 4. Native Agent Skills
- `d1-sqlite-engine`: Thao tác D1 SQLite, Prisma, Spatial SQL, migrations, composite indexes.
- `civic-high-contrast-ui`: Thiết kế UI Civic Tech, màu sắc tương phản, mobile responsive 360-430px, 44px touch targets.
- `fast-verification-pipeline`: Điều phối quy trình test 5 tầng và khôi phục lỗi tức thì.
- `domain-logic-verifier`: Thẩm định logic domain, SLA 48h, geofence 50m, Youth credits 20h = 4.0 tín chỉ, hash SHA-256.
- `powershell-dev-ops`: Chạy CLI PowerShell mượt mà trên Windows.
- `evidence-r2-verification`: Cloudflare R2 bucket, Web Crypto SHA-256, đối chứng ảnh Before/After.
- `asset-sheet-extractor`: Trích xuất và khử nền lossless asset thiết kế.
