# SSOT: Executive Operations & Decision Command Center Architecture
## DustGuard VN — Rebuild Executive Operations + Map SSOT

---

## 1. Executive Operations Mental Model & Purpose

The Executive Command Center (`/executive/dashboard`) is the central decision-making operational hub for municipal environmental leaders (Sở Xây Dựng, Sở TN&MT, UBND TP).
It is explicitly structured around **actionable operational intelligence and decisive intervention**, eliminating vanity metric theater.

---

## 2. The 5 Core Leadership Questions Matrix

| # | Leadership Core Question | System Answering Section | Primary SSOT Data Source | Direct D1 Action |
|---|---|---|---|---|
| 1 | **Thành phố/khu vực hiện đang thế nào?** | **Section 1: Situation Now** & **Section 3: Priority Map** | `GET /api/executive/overview` (`env.DB.sites`, `sensors`, `cases`) | Click-to-drilldown on any metric |
| 2 | **Có vấn đề nào cần tôi quyết định ngay?** | **Section 2: Requires Decision** | `GET /api/executive/priorities` (`cases`, `sites`, `complaints`) | `POST /api/executive/cases/:id/escalate`<br>`POST /api/executive/cases/:id/assign`<br>`POST /api/dashboard/documents/:id/quick-sign` |
| 3 | **Vụ việc nào đang trễ hạn SLA?** | **Section 4: SLA / Escalation Matrix** | `GET /api/executive/sla` (`cases.slaDeadline`, `alerts`) | `POST /api/executive/cases/:id/escalate` (Expedite order) |
| 4 | **Điểm nóng nào có nguy cơ leo thang?** | **Section 3: Priority Spatial Map** | `GET /api/sites`, `GET /map` (Sensitive Receptors <200m) | Spatial inspection dispatch & Ward boundary review |
| 5 | **Sau chỉ đạo của tôi, tình hình thay đổi thế nào?** | **Section 5: Operational Progress** & **Section 6: Recent Decisions** | `GET /api/executive/impact`, `GET /api/system/audit-logs` | Before/After PM2.5 Delta & Immutable SHA-256 Audit Trail |

---

## 3. Canonical 6-Section Layout Specification

1. **Section 1: Situation Now (Chỉ số Thực địa Toàn cảnh)**
   - Top 6 Real D1 KPIs:
     - `riskIndex` (0-100 Average Municipal Environmental Risk)
     - `highRiskSites` (Sites with Risk Score >= 70)
     - `openCases` (Cases active in 7-step pipeline)
     - `overdueSLA` (Breached SLA count)
     - `sensorHealthPct` (IoT Sensor Network liveness & HMAC integrity)
     - `slaOnTimeRate` (On-time resolution rate %)
   - Strategic 7-Day Trend Banner: Visualizing city-wide trajectory (Improving vs Worsening).

2. **Section 2: Requires Decision (Hàng đợi Quyết định Trọng yếu)**
   - Prioritized issue queue (`P1 CRITICAL`, `P2 HIGH`).
   - Direct Action Modals & Handlers:
     - Emergency Escalation (`POST /api/executive/cases/:id/escalate`)
     - Inspector Field Assignment (`POST /api/executive/cases/:id/assign`)
     - Decree 30/2020/NĐ-CP Digital Signature (`POST /api/dashboard/documents/:id/quick-sign` with PIN `1234`)

3. **Section 3: Priority Map (Bản đồ Không gian Địa bàn & Executive Policy)**
   - Embedded Shared Leaflet Spatial Map with `MapResizeTrigger` (Zero gray tiles).
   - Sensitive Buffer Overlay (<200m schools, hospitals, dense residential).
   - Color coding: Seal Red `#9f241f` (P1 >=80), Orange `#ea580c` (P2 60-79), Amber `#d97706` (40-59), Teal `#0d6f64` (<40).

4. **Section 4: SLA / Escalation Matrix (Ma trận Kiểm soát Thời hạn)**
   - 4 Quadrants: Overdue, Due Today (<12h), Unassigned, Waiting Approval.
   - Dual-View: High-density Desktop Table + Mobile Stacked Cards (<768px).

5. **Section 5: Operational Progress & Intervention Impact (Tiến trình & Hiệu quả Giảm Bụi)**
   - Canonical 7-Step Inspection Pipeline (`SCREENING` -> `PREPARING` -> `DECISION_ISSUED` -> `ON_SITE` -> `REPORTING` -> `APPRAISING` -> `COMPLETED`).
   - Before/After Dust Suppression Impact Delta (Baseline PM2.5 vs Post-intervention PM2.5, Average -42% reduction).

6. **Section 6: Recent Decisions & Directives (Nhật ký Chỉ đạo Điều hành)**
   - Chronological audit log of leader directives, assigned inspectors, cryptographic SHA-256 verification stamps, and field response status.

---

## 4. UI & Accessibility Standard
- **Theme**: High-contrast Civic Tech (Cream `#FDFBF7`, Ink `#231b14`, Seal Red `#9f241f`, Teal `#0d6f64`).
- **Zero Glassmorphism**: No `backdrop-blur`, clean solid surfaces with subtle borders (`border-cream-200`).
- **Typography & Touch Target**: Balanced headings, `min-h-[44px]` for mobile touch targets, `min-w-0` and `break-words` for zero horizontal overflow.
- **Language**: Official administrative Vietnamese, free of backend technical jargon.
