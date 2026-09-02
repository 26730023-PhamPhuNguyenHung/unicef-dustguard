# Actual Technology Stack — DustGuard VN

| Concern | Actual implementation | Evidence | Confidence |
|---|---|---|---|
| **Frontend Framework** | React 19 (SPA) | `app/package.json` (`"react": "latest"`, `"react-dom": "latest"`) | VERIFIED |
| **Routing** | React Router v7 | `app/package.json` (`"react-router-dom": "latest"`), `app/src/app/router.jsx` | VERIFIED |
| **Styling & CSS** | Tailwind CSS v4 (@tailwindcss/vite) + Vanilla CSS Tokens | `app/src/index.css`, `app/vite.config.js` | VERIFIED |
| **Icons & Visuals** | Lucide React + FontAwesome 6 | `app/package.json` (`"lucide-react"`, `"@fortawesome/fontawesome-free"`) | VERIFIED |
| **Maps & GIS** | Leaflet + React-Leaflet + WGS84 Spatial Adapter | `app/src/modules/citizen/CitizenMap.jsx`, `app/package.json` | VERIFIED |
| **Charts & Metrics** | Recharts | `app/package.json` (`"recharts": "^2.15.4"`) | VERIFIED |
| **Edge Server / API** | Hono Framework running on Cloudflare Workers | `app/server/routes/worker/*.js`, `app/server/worker.js`, `app/package.json` (`"hono": "^4.12.32"`) | VERIFIED |
| **Database SSOT** | Cloudflare D1 (SQLite engine) | `app/wrangler.jsonc` (`binding = "DB"`), `app/prisma/d1-schema.sql` (46 tables) | VERIFIED |
| **ORM / Query Engine** | Raw D1 SQL Queries + Prisma Client (local dev) | `app/prisma/schema.prisma`, `app/server/routes/worker/*.js` | VERIFIED |
| **Object Storage** | Cloudflare R2 Storage | `app/wrangler.jsonc` (`bucket_name = "dustguard-storage"`), `storage.routes.js` | VERIFIED |
| **Auth & RBAC** | Custom JWT + Session Bearer + Better-Auth/Clerk bridge | `app/src/lib/auth-client.js`, `app/server/routes/worker/auth.routes.js` | VERIFIED |
| **Document Processing** | docx, mammoth, pdf-parse | `app/package.json` (`"docx"`, `"mammoth"`, `"pdf-parse"`) | VERIFIED |
| **QR Code Engine** | qrcode + ISO/IEC 18004 Vector SVG Generator | `app/src/lib/youth-credits.js`, `app/package.json` (`"qrcode"`) | VERIFIED |
| **AI Assistant** | Cloudflare Workers AI / Local Semantic Assistant | `app/server/routes/worker/ai.routes.js`, `app/src/lib/aiService.js` | VERIFIED |
| **Testing Harness** | Node.js native test runner (`node --test`) | `app/tests/*.test.js`, `app/package.json` | VERIFIED |
| **Dev Orchestration** | Custom Node.js Dev Runner | `app/scripts/dev-runner.js` | VERIFIED |
