# DustGuard poster — status (31/08/2026)

**Pass R8 — final polish + print QA. LAYOUT IS FROZEN — see `FROZEN.md`.**
User-approved commit 31/08/2026.
**Print size locked: 70 × 90 cm portrait (TrimBox 700 × 900 mm).**

---

# ASSET_SWAP — zone 07 IoT card density + photos (31/08/2026, night)

**Class: ASSET_SWAP. LAYOUT_FROZEN (zone 07 IoT in-band only). Print 70×90 unchanged.**

| Item | Detail |
|---|---|
| Photos | APM row: Wikimedia SDS011 CC-BY-SA-4.0 (laser PM equivalent). ESP32: Wikimedia CC0 Dev Board. OLED: native SVG raster CC0. |
| Density | Larger thumbs (1.14 cm), taller rows (1.38 cm), tighter inset/gutters inside frozen 5.75 cm card footprint. |
| Copy | Unchanged — all VI from `content.yml`. |

---

# ASSET_SWAP — zone 07 IoT hardware card (31/08/2026, evening)

**Class: ASSET_SWAP + CONTENT_CORRECTION. LAYOUT_FROZEN. Print 70×90 unchanged. Band 14.6 cm unchanged.**

| Item | Detail |
|---|---|
| Art | Proposal-style cream card **Phần cứng chính**: chip icon + 3 product photos (APM2000 / ESP32 DevKit / OLED SSD1306) + cost bar. Superseded same night by density + redistributable photo pass above. |
| Copy | All VI strings in `content.yml` (`card_title`, `components[].name/detail`, `cost_prefix`/`cost_value`). Eyebrow stays `NGUỒN DỮ LIỆU BỔ SUNG`. |
| Size | In-band only — card fills leftover `#v(1fr)` under arch/badges/prototype. Not co-hero. |
| Demoted | `iot-node-isometric.svg` retained unused (prior ASSET_SWAP). |

---

# ASSET_SWAP — zone 07 isometric IoT node (31/08/2026, late) — SUPERSEDED

Superseded same day by hardware-card ASSET_SWAP above. Isometric SVG kept on disk, not wired.

Also folds prior uncommitted CONTENT_CORRECTION (engine label align, zone 01/03/04 copy, footer `repo_display`).

---

# CONTENT_CORRECTION — pre-print harden (31/08/2026, late)

**Class: CONTENT_CORRECTION only. LAYOUT_FROZEN. Print 70×90 unchanged.**

| Fix | Detail |
|---|---|
| Engine ↔ demo ↔ poster | `PRIORITY_COPY.componentLabels.compliance` + `computeComplianceSignal.name` → **Độ tin cậy minh chứng** (same 20% weight; key still `compliance`). |
| Zone 04 bars | Match live `SiteOverviewTab`: Phơi nhiễm nhạy cảm · Lịch sử & Tái diễn · Cảm biến IoT bổ trợ. |
| Zone 01 closing | Drop redundant journey line → `Thông tin rời rạc → khó ưu tiên, khó theo dõi, khó chịu trách nhiệm.` |
| Zone 03 note | Remove “tác động” overclaim → `Giữ lại lịch sử xử lý và người phụ trách.` |
| Footer | Print short `repo_display` (`github.com/hungpixi/dust-guard-vn`); full `repo_url` kept in YAML. |
| IoT | Superseded by ASSET_SWAP isometric SVG above. |

---

# CONTENT_CORRECTION + PRINT_FIX — P0/P1/P2 pre-freeze (31/08/2026)

**Class: CONTENT_CORRECTION / PRINT_FIX / VISUAL_POLISH only. LAYOUT_FROZEN. Zone 03 layout untouched.**

## P0 — Score formula vs live engine

| Source | Finding |
|---|---|
| `server/domain/risk/dust-risk-engine.js` | `COMPONENT_WEIGHTS`: community **30%**, exposure **25%**, **compliance 20%**, history **15%**, sensor **10%**. Key is `compliance`; `evidence` is an alias to the same weight/score. |
| Runtime component name | `computeComplianceSignal` → `name: 'Thiếu hụt biện pháp che chắn & dập bụi hiện trường'`; `PRIORITY_COPY.componentLabels.compliance` = `Thiếu hụt biện pháp che chắn`. |
| Live demo UI | `src/components/site-detail/SiteOverviewTab.jsx` surfaces **`Độ tin cậy minh chứng (20%)`** / `Minh chứng (20%)` (evidence label). Same 20% bucket, same score. |
| Poster decision | **Keep 30/25/20/15/10.** Label the 20% bar **`Độ tin cậy minh chứng`** so poster matches what the live demo shows judges. Percentages unchanged (not invented). Dual naming (engine key `compliance` vs demo/evidence label) documented here — code lag on display copy, not on weights. |

## Fixes applied

| # | Fix |
|---|---|
| P0 | Hero KẾT QUẢ note → `Có lịch sử · có thể truy vết` (removed “có tác động”). |
| P0 | Zone 04 20% name → `Độ tin cậy minh chứng` (demo SSOT). |
| P1 | Hero community note → `Phối hợp xử lý`. |
| P1 | Zone 04 badge → `HỒ SƠ MINH HỌA`. |
| P1 | Zone 07 headline + verification → `không cần quản trị server riêng`. |
| P2 | KẾT QUẢ circle-check 1.25 → **1.48 cm (~+18%)**; icon slot 2.05 cm unchanged. |
| P2 | Zone 05 HỒ SƠ title→subtitle gap 2.5 → **3.5 mm** (+1 mm). |
| P2 | Zone 06 `ĐO` → `CHỈ SỐ PILOT`. |
| P2 | QR label 20 → **18.5 pt**; URL under QR → `c-ink-light` (QR size unchanged). |

Gates: `poster:build` (175 dpi preview), `poster:qa:release` **21/21**.

---

# PRINT_FIX — hero KẾT QUẢ icon + zone 05 HỒ SƠ spacing (31/08/2026)

**Class: PRINT_FIX / VISUAL_POLISH only. Zone 03 and all other zones untouched.**

| Fix | Change |
|---|---|
| Hero `KẾT QUẢ` | White Tabler `circle-check` above title (stroke recoloured at compile); shared 2.05 cm icon slot aligns optical Y with DustGuard + Cộng đồng icons; result glyph at 1.25 cm for optical balance. |
| Zone 05 `HỒ SƠ` | +2.5 mm gap between title and `Ghi nhận có cấu trúc`; subtitle `#6C635A` (~8 % lighter than `c-ink-secondary`). AI HỖ TRỢ / CON NGƯỜI blocks unchanged. |

Gates: `poster:build` (175 dpi preview), `poster:qa:release` **21/21**.

---

## FREEZE (canonical)

See **`poster/FROZEN.md`** for `LAYOUT_FROZEN = true`, allowed change classes, and user-locked zone decisions (zone 03 crop, zone 07 sizing).

---

# ASSET_SWAP — zone 03, panel-aligned legend + real staff case (31/08/2026)

**Class: ASSET_SWAP + CONTENT_CORRECTION. Band height 22.0 cm unchanged.**
Gates re-run: `poster:qa` **15/15**, `poster:qa:release` **21/21**.

User-locked decisions for this pass: **Q1 keep** panel 1 narrower (no column
equalisation), **Q2 three clusters** instead of one ①–⑤ rail, **Q3 recapture**
the staff case with real Vietnamese copy. No other zone touched.

## Q2 — one legend cluster per panel

The single nine-column ①→②→③→④→⑤ rail spanned all three frames, so a step
number sat under whichever screen the grid happened to put it over. The legend
is now three clusters on the **same column track as the panels**
(`18.2346 / 22.3179 / 22.2133 cm`, gutter `1.28 cm`):

| Panel | Cluster |
|---|---|
| 1 · Ghi nhận phản ánh | `① Phát hiện → ② Ghi nhận có cấu trúc` |
| 2 · Theo dõi cộng đồng | `③ Bằng chứng → ④ Theo dõi lại` |
| 3 · Hồ sơ cán bộ | `⑤ Phối hợp / kết quả` |

Clusters are **sliced from the same five-step `zone3_core_loop.steps` SSOT**
(`(0,2) (2,4) (4,5)`), so the legend cannot drift from the workflow and QA test
12's five-step assertion still holds. No new `content.yml` keys were needed.
Marker size (1.0 cm / 19 pt), arrow colour and the legend block height
(**1.18 cm**) are unchanged, so the band tail did not move. The big conclusion
`MỘT HỒ SƠ XUYÊN SUỐT — TỪ GHI NHẬN ĐẾN KẾT QUẢ` stays below it at 34 pt.

## Caption polish

The three panel names carry the first read at 2 m, so they gained ~10 % and the
grey descriptor stepped back:

| Element | Before | After |
|---|---|---|
| Panel name (`Ghi nhận phản ánh` …) | 18 pt bold | **19.8 pt bold** (+10 %) |
| Grey descriptor | 15.5 pt | **14.5 pt** (−6 %, still above the 14 pt floor) |
| Label row height | 0.62 cm | **0.70 cm** (absorbed by the band's `v(1fr)`) |

## Q3 — staff case recaptured with real Vietnamese copy

The placed capture still showed the scaffolding title `Poster demo case` and the
English summary `Temporary case for poster screenshot capture` — demo residue on
a sheet that claims to show the real product. Case `case_47ce2e6cae2d` was
updated on prod via `PATCH /api/cases/:id` (demo staff login) and recaptured:

| Field | Value |
|---|---|
| Title | **`Phản ánh bụi công trình — Cầu Giấy`** |
| Summary | Người dân và nhóm tình nguyện phản ánh bụi phát tán từ công trường Vành đai 3 (phường Mai Dịch, quận Cầu Giấy)… |
| Code | `CASE-2026-5529` |
| Status | `1. Tiếp nhận & Sàng lọc` |
| Assignee | `Lê Minh Tuấn (Thanh tra viên)` |
| Workflow | real 7-step state machine, `SÀNG LỌC` → `HOÀN TẤT` |
| SLA | live countdown card, `Quy chuẩn 24h` |
| Evidence | tab row incl. `2. Minh chứng ảnh / GP` |

Crop geometry is **identical** (`2352×1440 +0+0` from a `2352×2786` `main`
capture at dsf 2), so marker ⑤ still lands on the `HOÀN TẤT` box and no frame
aspect changed. Uncropped original preserved in `.source/`. `sha256` refreshed
for `shot-staff-case` in `asset-manifest.yml`.

> Manifest note: the `source:` line must stay free of embedded `"` — the QA R1
> parser reads it with `"?([^"]*)"?`, so an escaped quote silently blanks the
> field and fails the gate.

---

# ASSET_SWAP — zone 03, three-panel journey (31/08/2026)

**Class: ASSET_SWAP + CONTENT_CORRECTION. Band height 22.0 cm unchanged.**
Gates re-run: `poster:qa` **15/15**, `poster:qa:release` **21/21**.

## Why the R8 crop failed

The R8 pass cropped both screenshots to exactly 1.45× so they would "read as UI
at 300 px". Read back at poster scale that optimisation inverted:

| Symptom | Cause |
|---|---|
| Wizard step 2 label `2. Vị trí & Bằng chứng` cut off at the frame edge | the 1.45× crop ended mid-chip |
| Transparency banner truncated mid-sentence (`…cán bộ Thanh tra s`) | same edge |
| A dead white band across the middle of the left frame | the 2.73 : 1 frame could not hold the wizard *and* the question card, so the card's whitespace filled the gap |
| Right frame's `MINH CHỨNG SỐ` card and the action cards clipped | the community crop ended mid-card on both axes |
| Two screens told two disconnected fragments | intake and community only; the staff side of the handoff was missing |

Net effect: fragments of chrome with no app frame, no page title and no card
boundaries — abstract UI texture rather than product proof.

## What changed

**Three panels, one journey: citizen intake → community follow-up → staff dossier.**
The third panel is the real `/staff/cases/:id` capture that was captured but
held in reserve.

| Panel | File | Crop (from `.source/`) | Aspect |
|---|---|---|---|
| 1 · Ghi nhận phản ánh | `ui-citizen-report.png` | `2400×1790 +0+0` (was `1050×384 +133+220`) | 1.3408 |
| 2 · Theo dõi cộng đồng | `ui-community-actions.png` | `2560×1560` — **full page, uncropped** (was `1714×617 +141+688`) | 1.6410 |
| 3 · Hồ sơ cán bộ | `ui-staff-case.png` | `2352×1440 +0+0` (newly placed) | 1.6333 |

Every crop ends on a **card boundary**, so no card, chip, label or sentence is
cut. Panel 1 now carries the app top bar, the page title, all three wizard
steps, the transparency banner, the whole question card including all six
classification chips, and both right-rail cards. Panel 2 is the entire page.
Panel 3 stops in the gutter below the SLA card.

Frames are sized to each crop's aspect to 4 decimal places
(`18.2346 / 22.3179 / 22.2133 cm × 13.6 cm`, gutter `1.28 cm`), so
`fit: "cover"` neither clips nor letterboxes — the same lossless-crop rule R7
established, now applied per panel. Image height went **11.792 → 13.6 cm
(+15 %)**; the extra 1.8 cm came from the internal gaps and the legend block
(`0.35→0.22`, `0.22→0.18`, `0.55→0.34`, legend `1.35→1.18`), never from the
band.

**Markers.** `shot-frame` marker diameter **1.35 → 1.0 cm** (25 → 19 pt) — small
pointers, with the ①–⑤ legend underneath doing the sequencing. All five now
land on a named UI element instead of a frame edge:

| # | Lands on |
|---|---|
| ① Phát hiện | wizard step 1 `Vấn đề quan sát` |
| ② Ghi nhận có cấu trúc | the `Mô tả chi tiết` field |
| ③ Bằng chứng | wizard step 2 `Vị trí & Bằng chứng` |
| ④ Theo dõi lại | the `Tiếp tục theo dõi` action card |
| ⑤ Phối hợp / kết quả | the `HOÀN TẤT` box — last state of the real 7-step machine |

**Labels** (`content.yml`, short VI): `Ghi nhận phản ánh` · `Theo dõi cộng đồng`
· `Hồ sơ cán bộ`, each with a one-clause caption. Conclusion line, legend and
the five step titles are untouched.

**QA change.** Test 9 asserted `!content.includes('hồ sơ cán bộ')` — a guard
written when the only staff asset was a login wall. It is now conditional: the
label is allowed *only* if `ui-staff-case.png` is placed and
`ui-staff-operations.png` is not. The guard's intent is preserved and the login
wall still cannot be labelled a dossier.

## Verified

- Poster scale (175 dpi, per-frame crops): all three screens legible, no clipped
  text, no dead whitespace band.
- 600 px thumbnail: three visually distinct app screens; panel 3's red `92/100`
  badge and the 7-step row are the strongest new signals.
- Band tail: label row, legend, conclusion and support line all clear the panel
  edge; zone 04 is not displaced.
- `sha256` refreshed for all three screenshots in `asset-manifest.yml`.

---

# PASS R8 — FINAL POLISH + PRINT QA

Build: `pnpm poster:build` · dev gate `pnpm poster:qa` · release gate
`pnpm poster:qa:release`. Both gates are green (15 dev checks, 6 release checks).

## Polish items — what actually changed

| # | Item | Result |
|---|---|---|
| 0 | **Zone 02 title (locked by user)** | `AI KHÔNG HÀNH ĐỘNG MỘT MÌNH` → **`CHỦ THỂ HÀNH ĐỘNG`**. Subtitle → *Người trẻ, cộng đồng và cán bộ là chủ thể — công nghệ là công cụ hỗ trợ.* Actor names normalised to `·` separators. The three 34 pt verbs were already in place. QA test 15 now fails the build if the old ambiguous title comes back. |
| 1 | **Zone 03 screenshots, 1.4–1.5× tighter** | Both re-cropped from `.source/` at exactly **1.45×**: citizen `1523×557` → **`1050×384 +133+220`**, community `2485×895` → **`1714×617 +141+688`**. Crop aspect still matches the frame to 4 decimal places, so `fit: "cover"` stays lossless. Markers re-derived against the new crops: ①②③ now read left-to-right along the real intake wizard, ④⑤ sit at the top-right of the two action cards so the cards' own icons stay visible. |
| 2 | **Zone 03 conclusion** | Main line 30 → **34 pt** (+13 %); support line 17 → 15.5 pt. The gap under the main line went 0.16 → 0.32 cm because at 34 pt the under-dot of `Ậ` in `NHẬN` was landing on the support line. |
| 3 | **Zone 01** | `?` 42 → **34 pt** and its ring 0.285 h → 0.228 h (−20 %). `KHÔNG CÓ HỒ SƠ THỐNG NHẤT` 27 → **31 pt**, and the block grew from 44 % to 48.5 % of the panel width and from 85.5 % to 92.5 % of its height. **The dashed border is gone** — the block is now a solid `#EBE6DF` fill and the three missing rows inverted to white, so the absent dossier reads as gaps punched into a form. Net −1 stroke. |
| 4 | **Zone 04** | Badge copy `VÍ DỤ CASE MINH HỌA` → **`CASE MINH HỌA`** at 19 → **22 pt**, sitting directly above the 92 pt `87`. |
| 5 | **Zone 05** | Already exactly what was asked after R7 — one left-to-right sequence, pale-teal `AI HỖ TRỢ` fill, red outline **only** on `CON NGƯỜI`, no chips, no lanes, no dashed boundary. Left untouched; nothing to reduce. |
| 6 | **Zone 06** | New two-half split above the numbers: **`ĐÃ CÓ ✓` / Nguyên mẫu kiểm chứng kỹ thuật** (pale teal) vs **`BƯỚC TIẾP THEO →` / Pilot thực địa 4–8 tuần** (grey). Fills only, no strokes. Timeline reads **`TUẦN 1 / TUẦN 2–3 / TUẦN 4–5 / TUẦN 6–7 / TUẦN 8`** — measured at 21 pt in a 6.72 cm block, comfortable fit. The old `headline` key is gone; QA now asserts the split keys instead. |
| 7 | **Zone 07** | `React + Hono` demoted to a 13.5 pt `c-ink-light` caption (was 15.5 pt secondary). Architecture 4.9 → **5.15 cm**. IoT schematic 8.5 → **9.4 cm (+11 %)**. Space came from the caption, the badge rows (0.88 → 0.80 cm) and the prototype block (1.25 → 1.02 cm). **Zone 07 is height-bound** — the requested +20 % on the architecture and +20–25 % on IoT do not both fit in a 14.6 cm band; the split above is what the budget allowed. |
| 8 | **Footer** | Closing thesis now owns a **68 % measure** on its own row with the event badge right-aligned beside it. Roadmap moved to its own row. **A filled hairline separates them from the metadata row**, where team + live URL + repo now sit at 14 pt (was 13 pt, mixed into the roadmap row). The rule is a 1 pt filled block, not a stroke, so the border budget is unaffected. |
| 9 | **Hero** | The centre `DUSTGUARD` node is now the only outlined node in the thesis strip: 2.4 pt teal edge, label 24 → **27 pt** in `c-teal-dark`, icon 1.5 → **1.9 cm**. No new text — the transformation reads as identity, not as copy. |
| 10 | **Red diet** | Verified rather than changed: every section title is already `c-ink`, and red is spent only on the wordmark, the numbered badges, the zone-01 problem, the `87` knob and the human-decision bar. The ten zone-03 step markers stay red on purpose — they are the numbered wayfinding the legend depends on, which the brief explicitly exempts. |

Stroke budget after this pass: **21** design-chrome declarations (budget 22).
−1 from zone 01's dashed frame, +1 for the hero's DustGuard node.

## Print QA — release gate results

`pnpm poster:qa:release` → **21/21 PASS**.

| Gate | Result |
|---|---|
| **R1 asset hashes** | 43 manifest entries. Every entry carries `id / file / source / license / sha256`; every file exists, every sha256 matches, no remote paths, and **no `.source/` intermediate is hashed** — only what is embedded in the sheet. Every `assets/**` path referenced by `content.yml`, `poster.typ` or `diagrams.typ` is required to be declared (fonts excluded). |
| **R2 print geometry** | TrimBox **700.00 × 900.00 mm portrait**, bleed **3 mm** on all four sides, BleedBox = MediaBox = 706 × 906 mm, 1 page. |
| **R3 minimum type** | `text-body` 19 pt ≥ 18 · `text-caption` 16.5 pt ≥ 14 · `text-section` 32 pt ≥ 26. Every `size:` in `poster.typ` and `diagrams.typ` is scanned against a **14 pt floor**; two lines are exempt and each carries an explicit `// qa:type-exempt` comment — the QR fallback URL (10.5 pt, redundant with the QR directly above it) and the `React + Hono` footnote (13.5 pt). Screenshot pixels are out of scope by design. |
| **R4 safe margin** | Page margin **18 mm** inside trim on all four sides, and the QR, wordmark, live URL and footer metadata all sit in the normal content flow — nothing is `place`d outside the content column, so 18 mm is the guaranteed safe distance. |
| **R5 QR decode** | Decodes to `https://dustguard.phamphunguyenhung.com/` at all three samplings: **PDF @ 100 % (72 dpi, 2002 px sheet)**, **PDF scaled to A4 (89 dpi, 2474 px)**, and the **175 dpi preview PNG (4865 px)**. The A4 case is the realistic worst case — a 70 × 90 poster reduced onto a handout. |
| **R6 thumbnails** | `poster/output/thumbs/DustGuard_thumb_{1200,600,300}.png` regenerated each release run. |

## Thumbnail test — what survives at 300 px

Read from `DustGuard_thumb_300.png` (300 × 385 px, i.e. the sheet at ~1 % of
print size — roughly a chat preview or a slide contact sheet).

| Element | At 300 px |
|---|---|
| **DustGuard** | **Dominates.** The red wordmark is the first and clearest thing on the sheet. |
| **Problem** | **Shape only.** The grey `KHÔNG CÓ HỒ SƠ THỐNG NHẤT` block and the scattered chips read as "fragmented → one missing block", but the words are not legible. The red `?` survives as a dot. |
| **Screenshots** | **Texture, not content.** Both frames read unmistakably as real product UI with red numbered markers, which is the intended 3-second message; no individual string is readable. The 1.45× crop is what made them read as UI rather than as grey noise. |
| **87** | **Dominates.** The gauge plus the red numeral is the second-strongest object on the sheet. |
| **Pilot numbers** | **Survive.** `01 / 20–30 / 01 / 4–8` stay legible as teal numerals; their unit labels do not. |
| **Closing thesis** | **Survives.** `BẮT ĐẦU NHỎ. ĐO ĐƯỢC. SAU ĐÓ MỚI MỞ RỘNG.` is readable at 300 px. |
| Also surviving | The red `QUYẾT ĐỊNH THUỘC VỀ CON NGƯỜI` bar, the three actor figures with their verbs, and the teal `KẾT QUẢ` node. |

At 600 px every headline, verb, section title and number is legible and only
body copy and screenshot text are lost — which is the intended 2 m reading.

## FREEZE NOTE

**Layout is frozen as of pass R8.** Band budget, column template, crop
geometry, marker coordinates, type scale and the border budget are all locked
and covered by QA. Further work should be limited to:

- swapping in a real `/staff/cases/:id` screenshot or a real IoT bench photo
  (both are straight asset swaps — see `BLOCKED.md`), which requires
  re-deriving marker coordinates and refreshing two `sha256` entries;
- copy corrections inside `content.yml` that do not change line counts.

Anything that changes a band height, a column width or a crop aspect is a new
pass, not a polish, and invalidates the print QA above.

## Commands

```bash
pnpm poster:build          # typst compile + 175 dpi preview
pnpm poster:qa             # dev gate, ~1.5 s, source only
pnpm poster:qa:release     # full gate: hashes, print boxes, QR decode, thumbs
```

If `pnpm` cannot reach its store, run the two build steps straight from the
`poster:build` script (`typst compile …` then `pdftoppm -png -r 175 …`) and the
QA with `node poster/scripts/qa-poster.mjs [--release]`.

## Deferred — optional ASSET_SWAP only (LAYOUT_FROZEN)

- **Staff case screenshot** — **CAPTURED** 31/08/2026. `ui-staff-case.png` + `ui-staff-operations.png` are on disk and in `asset-manifest.yml`; not placed on the poster until user requests swap. See `BLOCKED.md`.
- **Real IoT device photo** — none exists in the repo; zone 07 keeps the exploded vector.
- **Zone 03 left frame lower third** is airy: at 1.45× the intake wizard, the
  transparency banner and the question card cannot all fit in one 2.73 : 1 band,
  so the crop keeps the wizard (the structured-journey proof) and shows only the
  top edge of the question card. Going tighter would drop the wizard; going
  looser would miss the 1.4× target.

---

# PLAN — pass R7 "hierarchy, not more elements"

Goal: *poster đẹp nhất có thể* by **raising hierarchy and lowering dashboard
feel**, never by adding elements. Every item below deletes or enlarges; only
two items add a string (hero proof line, zone-3 support line).

## Vision findings on the current `DustGuard_preview.png`

Read at 1150 px wide (≈ the 2 m view) plus per-band crops at 1500 px.

| # | Finding | Where |
|---|---|---|
| F1 | **Duplication.** Hero flow strip and the zone-03 legend are the *same five steps* (Phát hiện · Ghi nhận · Bằng chứng · Theo dõi lại · Kết quả). The eye reads the poster twice and learns nothing new. | hero + zone 03 |
| F2 | **Dashboard feel.** ≈ 110 stroked rectangles. Every zone is a grey header band + white panel + nested bordered chips. Zone 06 alone shows 4 + 4 + 8 + 5 = 21 boxes. | whole sheet |
| F3 | **Zone 05 reads as an org chart**, not a rule: black `HỒ SƠ` bar, two parallel lanes, dashed boundary, merge bus, red bar. 7 chips + 2 lanes + 6 connector runs for one sentence. | zone 05 |
| F4 | **Screenshots are texture, not proof.** Both crops are zoomed out (citizen 61.6 px/cm, community 98.5 px/cm of source); nothing is legible and the markers are small. | zone 03 |
| F5 | **Gauge reads "violation".** The whole 87 % arc is seal red; the `Ví dụ minh họa` qualifier is 15 pt at the very bottom. | zone 04 |
| F6 | **Conclusions are the smallest type in their zone** — zone 01 closing, zone 03 caption, footer thesis all lose to the elements above them. | 01 / 03 / footer |
| F7 | **Red is everywhere** (7 index badges, 3 zone headlines, `ĐO`, `LỘ TRÌNH`, T4–T5 ribbon blocks, `Bằng chứng` hero block, `?`, 87, arc, human lane, decision bar) so no red means anything. | whole sheet |
| F8 | Zone 02 title `AI HÀNH ĐỘNG?` is read as *artificial intelligence*, not *ai* = who. Figures are centred per tile, so their baselines do not line up. | zone 02 |
| F9 | Zone 07 architecture is the smallest diagram on the sheet, and `React + Hono` competes with `Cloudflare Worker` inside the same box. | zone 07 |

## Item → file edit map

Priority order is executed top to bottom, with a vision check after each batch.

| P | Critique item | Concrete edits |
|---|---|---|
| **P1** | Kill duplication | `content.yml`: `hero.badge_strip` (5 loop steps) → `hero.thesis`, 4 nodes *Người trẻ · CLB → DustGuard → Cộng đồng & đơn vị → Kết quả có bằng chứng*. `poster.typ`: hero strip renders 4 thesis nodes, actor trio becomes node 1's art (keeps `hero.actor_figures`, so QA 9 holds). Zone 03 keeps the detailed 5-step legend + markers — it is now the *only* place the loop appears. |
| **P2** | Simplify zone 05 | `diagrams.typ::hitl-diagram` rewritten from 2 parallel lanes to **one sequence**: `HỒ SƠ` (cream) → `AI HỖ TRỢ` (pale teal) → `CON NGƯỜI` (white + red outline) → `QUYẾT ĐỊNH THUỘC VỀ CON NGƯỜI` (deep red fill). Sub-labels become plain text lines, not chips. Deletes the black bar, the dashed AI boundary, the split bus and the merge bus (≈ 8 strokes + 6 connector runs). |
| **P3** | Zone 03 screenshots | Re-crop both PNGs to the meaningful UI only, at the exact frame aspect so nothing is clipped: citizen `1523×572 +48+208` (2 wizard steps + minh-bạch banner + question card), community `2485×895 +37+655` (civic action loop + 4 action cards). Frame widths 31.8 / 33.2 cm, image height 11.95 cm → **1.28× / 1.32× bigger UI**. `shot-frame`: `fit: "cover"` replaces the negative-padding hack, white fade gradient and inner caption strip both deleted. Markers re-placed on the new crops; legend keeps identical numbers + red. Conclusion → `MỘT HỒ SƠ XUYÊN SUỐT — TỪ GHI NHẬN ĐẾN KẾT QUẢ` at 30 pt + one 17 pt support line. |
| **P4** | Score 87 | `score-gauge.svg`: value arc `#9f0d0c` → teal→amber ramp, only the 87 knob stays seal red. `content.yml`: new `score_badge: "VÍ DỤ CASE MINH HỌA"` rendered as a badge on the gauge, not a 15 pt footnote. |
| **P5** | Zone 06 | Title → `KHẢ THI & PILOT ĐỀ XUẤT`; headline → nguyên mẫu đã kiểm chứng kỹ thuật / pilot thực địa là bước tiếp theo. Scope numbers 33 → 41 pt (+24 %) and lose their 4 boxes. KPI row: 4 boxes → one `ĐO: a · b · c · d` line. Timeline: `T1…T8` ribbon + 5 phase blocks (13 boxes) → **5 blocks** `T1 / T2–3 / T4–5 / T6–7 / T8`. |
| **P6** | Zone 07 | `arch-diagram` 4.15 → 5.0 cm (+20 %); core box says only `Cloudflare Worker`, `React + Hono` demoted to a caption under the diagram. Exactly 4 verification badges, enlarged 16 → 19 pt, stroke dropped. Prototype note and IoT strip lose their boxes. No IoT photo (still blocked). |
| **P7** | −25–30 % borders | Drop the grey `c-head-bg` header band on all 5 bands → red index + ink title on cream + one hairline. Drop: 3 zone-02 tiles + 3 tag badges, 2 screenshot caption strips + legend box, zone-04 disclaimer box, zone-06 4 scope + 4 KPI + 13 ribbon boxes, zone-07 3 actor boxes + 4 badges + prototype + IoT boxes, hero flow 5 outer + 5 icon badges, 4 footer chips. Keep: 6 band panels, 2 screenshot frames, zone-01 source chips + dossier, D1/R2, QR, the red `CON NGƯỜI` outline. **≈ 110 → ≈ 62 strokes (−43 %).** |
| **P8** | Hero | `tagline` split: `Biến quan sát môi trường thành hành động` (24.5 → 32 pt, +31 %) + new `tagline_proof` `có bằng chứng · có theo dõi · có kết quả`; `subtitle` demoted. `hero-scene.svg` opacity 0.085 → 0.115 (×1.35). |
| **P9** | Zone 01 | Invert: `KHÔNG CÓ HỒ SƠ THỐNG NHẤT` 16 → 27 pt bold ink and becomes the loudest thing in the panel; `?` 58 → 42 pt and loses its pink fill (dashed red ring only); closing line 21 → 26 pt. |
| **P10** | Zone 02 | Title → `AI KHÔNG HÀNH ĐỘNG MỘT MÌNH`; answer line states người trẻ / cộng đồng / cán bộ là chủ thể. Figures bottom-aligned on one baseline at one height. One huge verb per actor (`PHÁT HIỆN` / `BỔ SUNG` / `QUYẾT ĐỊNH`, 34 pt) with the existing `action` as the small secondary line. |
| **P11** | Footer | Closing thesis `BẮT ĐẦU NHỎ. ĐO ĐƯỢC. SAU ĐÓ MỚI MỞ RỘNG.` 21 → 34 pt on its own row; roadmap moves below it; URLs 15.5 → 13 pt so they stop competing. |
| **P12** | QR | Two lines only: one red CTA + the URL (drops the duplicate `Dùng thử trực tiếp` / `Quét trải nghiệm` pair). |
| **P13** | Red diet | Demote to ink / teal: zone-03, zone-07 headlines, `ĐO`, `LỘ TRÌNH`, T4–T5 ribbon, hero `Bằng chứng` block, gauge arc. Red kept only for: brand mark + title, section index rhythm, zone-01 problem (`?`, ✕, closing rule), zone-04 87 knob, zone-05 human decision boundary. |
| **P14** | Band budget | `12.4 / 14.4 / 24.7 / 13.6 / 14.35 / 4.2` → `13.0 / 15.0 / 22.0 / 13.8 / 14.55 / 5.3`. Sum still **83.65 cm** + 5 × 5.5 mm = 86.4 cm live height. Zone 03 gives back 2.7 cm; hero, 01/02, 04/05, 06/07 and the footer each spend it on type size, not on new elements. |
| **P15** | QA | Keep every overclaim / page-box / content.yml lock. Add: hero must not repeat the zone-03 loop labels (anti-duplication), zone 06 title must say `ĐỀ XUẤT`, timeline must be 5 blocks, `score_badge` must exist, band headers must not use a grey fill. Refresh `asset-manifest.yml` sha256 for the 2 re-cropped PNGs + `score-gauge.svg` + `hero-scene.svg`. |

## Locks re-asserted for this pass
70 × 90 portrait + 3 mm bleed / TrimBox · 1 QR → live demo · DustGuardians +
GitHub in footer · VI-only, `content.yml` is the only source of visible strings ·
no fake pilot numbers, prototype ≠ pilot · IoT supplementary · no digits in the
tech verification block · QA green · **no git commit** · no sudo.

## Not doing (explicitly out of scope this pass)
New illustrations, new photos, new icon sets, extra decorative elements, a real
`/staff/cases/:id` screenshot (still auth-blocked), a real IoT bench photo.

---

# RESULT — pass R7 (all 15 plan items landed)

**QA: `bun poster/scripts/qa-poster.mjs` → 13/13 PASS.** Zero new assets, zero
new decorative elements. One string added (`hero.tagline_proof`), one added and
one renamed in zone 03 (`conclusion`, `conclusion_note`), four strings deleted
(`hero.qr_title`, `zone2.actors[].tag`, `zone4.score_caption`, `zone7.iot.note`).

## Verified against the 3 s / 10 s / 30 s / 60 s table

Checked on a 560 px render (≈ 4 m), a 1150 px render (≈ 2 m) and per-band crops
at 1500 px (≈ 40 cm).

| Window | What a judge gets now |
|---|---|
| **3 s** | Red `DUSTGUARD VN`; the youth trio opening a four-node thesis; two large product screenshots; the red `QUYẾT ĐỊNH THUỘC VỀ CON NGƯỜI` bar; `KHẢ THI & PILOT ĐỀ XUẤT`. All four required reads land without a single line of body copy. |
| **10 s** | The two spine sentences — `MỘT HỒ SƠ XUYÊN SUỐT — TỪ GHI NHẬN ĐẾN KẾT QUẢ` and `BẮT ĐẦU NHỎ. ĐO ĐƯỢC. SAU ĐÓ MỚI MỞ RỘNG.` — plus the three actor verbs `PHÁT HIỆN / BỔ SUNG / QUYẾT ĐỊNH` and `KHÔNG CÓ HỒ SƠ THỐNG NHẤT`. |
| **30 s** | Zone 03's ①–⑤ on the real UI against the legend; the 87 gauge with its `VÍ DỤ CASE MINH HỌA` badge and weight bars; the `HỒ SƠ → AI HỖ TRỢ → CON NGƯỜI → QUYẾT ĐỊNH` sequence; scope numbers and the five-block calendar. |
| **60 s** | Weight percentages, the amber advisory disclaimer, the architecture with `React + Hono` as a caption, the four verification badges, the prototype ≠ pilot footnote, the IoT strip, the roadmap. |

## Before / after, per finding

| Finding | After |
|---|---|
| F1 duplication | Hero is `NGƯỜI TRẺ · CLB → DUSTGUARD → CỘNG ĐỒNG & ĐƠN VỊ → KẾT QUẢ`. The five-step workflow appears exactly once, in zone 03. QA test 12 fails the build if any zone-03 step title reappears in the hero. |
| F2 dashboard feel | Stroked boxes counted in the source: **≈ 94 → 29 (−69 %)**. The 25–30 % target was the floor; the actual driver was the rule *if whitespace separates it, no border*. Grey header bands, all 21 zone-06 tiles/ribbon cells, both screenshot caption strips, the legend box, 3 zone-02 tiles + 3 tag badges, 4 zone-07 badge outlines, 4 footer chips and 10 hero flow outlines are gone; fills and whitespace do the separating. |
| F3 zone 05 org chart | One left-to-right sequence, 3 stages + 1 decision bar. Deleted: the black `HỒ SƠ` bar, both lane outlines, 7 chip outlines, the dashed AI boundary, the split bus and the merge bus. Only the human column feeds the decision, so the red arrow itself makes the argument. |
| F4 screenshots | Both PNGs re-cropped to the frames' exact aspect: citizen `1523×557 +48+208`, community `2485×895 +37+655`. Source density 61.6 → 47.2 px/cm and 98.5 → 75.9 px/cm = **1.30× on both**. `fit: "cover"` is now lossless, so the negative-padding hack and the white fade are gone. Markers sit on the wizard chips, the question card and two action cards. |
| F5 gauge | Arc is a teal → amber ramp; seal red is spent only on the 87 knob. `VÍ DỤ CASE MINH HỌA` is a 19 pt badge on the gauge instead of a 15 pt footnote. QA test 13 fails if the arc goes red again. |
| F6 small conclusions | Zone 01 `KHÔNG CÓ HỒ SƠ THỐNG NHẤT` 16 → 27 pt (and the `?` 58 → 42 pt, unfilled); zone 01 closing 21 → 26 pt; zone 03 conclusion 18.5 → 30 pt with its own whitespace; footer thesis 21 → 36 pt, upper case, on its own row. |
| F7 red everywhere | Red now means exactly five things: brand, section index rhythm, the zone-01 problem, the 87 marker, the human decision boundary. Demoted to ink / ink-secondary / teal: zone-03 and zone-07 headlines, `ĐO`, `LỘ TRÌNH`, the T4–T5 ribbon (gone), the hero `Bằng chứng` block (gone), the gauge arc. |
| F8 zone 02 | Retitled `AI KHÔNG HÀNH ĐỘNG MỘT MÌNH`; answer line names người trẻ / cộng đồng / cán bộ as chủ thể. Figures share one height and one bottom baseline via an explicit `grid(rows: (5.9cm, 1fr))`. One 34 pt verb each, `action` demoted to a 15.5 pt secondary line, `tag` deleted. Youth-led is a pale teal fill, not an outline. |
| F9 zone 07 | Architecture 4.15 → 4.9 cm (+18 %), core box 21 → 26 pt saying only `Cloudflare Worker`; `React + Hono` is a caption under the diagram. Four badges at 19 pt, fill only. |

### Band budget (still closes exactly on 86.4 cm live height)
`13.6 + 14.6 + 22.0 + 13.6 + 14.6 + 5.25` cm + 5 × 5.5 mm = **86.4 cm**.
Zone 03 gave back 2.7 cm; it was spent on type size, never on new elements.
Section share: hero 16.3 % · problem/actors 17.5 % · product 26.3 % ·
score/AI 16.3 % · pilot/tech 17.5 % · footer 6.3 %.

### Deliberately not changed
The zone-03 marker circles stay seal red in both the overlays and the legend —
the critique requires identical numbers *and* colours, so the ten red dots are
wayfinding, not decoration. The QR panel keeps its outline: a cream box on a
white slab has nothing else to hold it. Zone-01 source chips and the dashed
empty-dossier frame keep theirs: the scatter and the absence *are* the content.

---

## Deliverables
| File | Notes |
|---|---|
| `poster/output/DustGuard_70x90.pdf` | 1 page. **MediaBox / BleedBox / CropBox = 706×906 mm**. **TrimBox = 70×90 cm**, inset 3 mm (8.50 pt). Crop marks in bleed. |
| `poster/output/DustGuard_preview.png` | 175 dpi of the full sheet (includes bleed + marks) |
| `poster/content.yml` | VI SSOT — **rewritten this pass**, ~45 % less body copy, now also declares icon / figure paths so layout follows content |
| `poster/diagrams.typ` | **new** — native Typst diagram builders (labels still come from content.yml) |
| QA | `bun poster/scripts/qa-poster.mjs` → **11/11 PASS** |

Rebuild: `pnpm poster:build`. Check: `bun poster/scripts/qa-poster.mjs`.
If `pnpm` cannot reach its store (sandbox), run the two build steps from the
`poster:build` script directly (`typst compile …` then `pdftoppm -png -r 175 …`).

## Previous pass (R6) — kept for history: text replaced by pictures
Vision review of the previous preview found the density was uneven: zone 03 was
image-rich while 01 / 04 / 05 / 06 / tech were stacks of prose cards. Every one
of those sections is now carried by a drawn diagram, and the copy that the
diagram makes redundant was deleted rather than reflowed.

1. **Zone 01 — fragmentation diagram.** Three prose cards and the 40-word intro
   are gone. Four scattered source chips (chat / ảnh / vị trí / ghi chú) converge
   on a dashed red **?**, which points at a dashed, empty dossier frame whose
   three rows (Hồ sơ · Lịch sử xử lý · Người phụ trách) are struck through. One
   line closes it: *dữ liệu đã có, nhưng không nằm trong một hành trình.*
2. **Zone 02 — the answer, and real actors.** The provocative heading stays and
   now gets an immediate answer line. The three tiny 2.4 cm line-icon tiles are
   replaced by 6 cm Open-Peeps figures, one per actor.
3. **Zone 03 — screenshots explain themselves.** The five step cards above the
   screenshots duplicated the hero flow strip, so they are deleted. ①–⑤ markers
   now sit on the real UI (① wizard step 1, ② the structured form, ③ vị trí &
   bằng chứng, ④ tiếp tục theo dõi, ⑤ nhiệm vụ), with a single legend strip
   underneath. 60/40 split: citizen report is primary. Frames fade to white at
   the clipped edge so the cut reads as intentional.
4. **Zone 04 — gauge + weight bars.** The flat `87` box becomes a 12.4 cm
   semicircular gauge with the score inside the arc and a 0–100 scale, beside
   five horizontal bars (30/25/20/15/10) scaled against the top weight. IoT's
   bar is deliberately grey to show it is supplementary. Disclaimer shortened to
   two lines. Section now carries the same visual weight as zone 03.
5. **Zone 05 — human-in-the-loop diagram.** Two bullet cards become one flow:
   HỒ SƠ splits into an AI lane and a human lane, separated by a dashed red AI
   boundary, and both merge into a single red *con người quyết định* bar.
6. **Zone 06 — pilot infographic.** No paragraphs: four scope tiles
   (01 CLB · 20–30 người · 01 địa bàn · 4–8 tuần), four KPI chips, and a T1–T8
   ribbon grouped into five phases (Chuẩn bị → Quan sát → Hành động → Theo dõi →
   Đánh giá) using the same colour ramp as the hero flow.
7. **Zone 07 (was an unnumbered tech box) — architecture diagram.** Numbered 07
   so the heading rhythm does not break. Users → Cloudflare Worker (React+Hono)
   → D1 + R2, then four verification chips. Wording stays **qualitative** —
   `verify:quick` passes locally (42 tests) but no count is printed on the
   poster, and QA now fails the build if a digit appears in that block.
8. **IoT.** No real device photo exists in the repo (the landing IoT art is
   stylised illustration, not a photograph), so it is an exploded
   sensor → ESP32 → radio → DustGuard SVG at ~2 % of the sheet.
9. **Hero.** Title down 86→ kept at scale but the row is shorter; a continuous
   vector scene (construction dust → youth with phone → clean city) sits behind
   it at 8.5 % opacity. The youth cluster is no longer a floating mascot group:
   it sits at the head of the flow strip and arrows into **PHÁT HIỆN**. Flow
   steps get 1.3 cm icons in white badges and the cream → pale teal → pale red →
   pale teal → deep teal progression.
10. **Footer.** Closing strip Pilot nhỏ → Chứng minh quy trình → Chuẩn hóa →
    Mở rộng → Tích hợp khi được kiểm chứng, plus the closing line *Bắt đầu nhỏ.
    Đo được. Sau đó mới mở rộng.*

### Typst notes for future edits
- `v(1fr)` does **not** resolve inside a `place`d block. The HITL stages divide
  their own height with an explicit `grid(rows: …)` instead.
- `v(1fr)` also does not resolve inside `civic-slab`, because the body is padded
  rather than laid out against a definite height — the footer uses an explicit
  `v(0.39cm)` lead-in.
- Diagram builders take explicit `w` / `h` in cm because `place` coordinates
  cannot resolve against an auto-sized container.
- `1pt + none` is an error, so `chip` guards its `stroke:` with an `if`.
- **Crop screenshots to the frame's exact aspect** and use
  `image(f, width: w, height: h, fit: "cover")`. R6 needed
  `pad(bottom: -300cm, …)` plus a white fade only because the crop and the frame
  disagreed; with a matched crop both hacks disappear and nothing is clipped.
- Marker coordinates are normalised against the *crop*, so re-cropping a
  screenshot invalidates them. Derive them as
  `(px_in_crop − crop_origin) / crop_size`.
- A negative `column-gutter` is the clean way to overlap figures into one group.

## Locks held
Portrait 70×90 + 3 mm bleed / TrimBox (verified: MediaBox 2001.26 × 2568.19 pt,
TrimBox inset 8.50 pt, 1 page) · one QR → https://dustguard.phamphunguyenhung.com/ ·
footer DustGuardians + live URL + https://github.com/hungpixi/dust-guard-vn ·
5-step loop + lịch sử & tác động · 87 + disclaimer (không phải kết luận vi phạm) ·
IoT supplementary · prototype ≠ pilot · VI only, content.yml SSOT (diagram SVGs
are text-free and QA enforces it) · screenshots zone 3 only · no competitor
matrix · logo red `#9f0d0c` · preview 4865×6243 at 175 dpi ·
**no git commit, no sudo, no deploy.**

## Changed assets — R7
- `assets/screenshots/ui-citizen-report.png` 2400×2094 → **1523×557**
  (`+48+208`): the two wizard steps, the minh-bạch banner and the question card.
- `assets/screenshots/ui-community-actions.png` 2560×1560 → **2485×895**
  (`+37+655`): the civic action loop strip and the four action cards.
- `assets/diagrams/score-gauge.svg` — value arc is now a teal → amber
  `linearGradient`; only the marker knob is seal red; ticks reduced 5 → 3.
- `assets/diagrams/hero-scene.svg` — group opacity `0.085 → 0.115` (×1.35).
- No new asset files. Nothing deleted from disk.
- **Uncropped screenshot originals are kept at
  `poster/assets/screenshots/.source/`** (they were not in git HEAD, so this is
  the only copy). Safe to delete once the crops are accepted.
- `asset-manifest.yml` — 4 shas refreshed for the files above, **plus 6 that had
  silently drifted in earlier passes** (`users-group`, `shield-check`,
  `risk-gauge`, and all three `people/*.svg`). All 42 entries now hash-match
  their file. No QA gate was added for this; say the word and it becomes one.

## Remaining gaps (need user)
- Real `/staff/cases/:id` screenshot (login / auth blocked). `ui-staff-operations.png`
  is a login wall and is intentionally **not** placed on the poster.
- No real IoT device photo in the repo, so zone 07 keeps the exploded vector.
- Now-unused assets left in place, not deleted: `assets/diagrams/core-loop.svg`,
  `assets/diagrams/iot-node.svg`, `assets/diagrams/risk-gauge.svg`,
  `assets/qr/qr-repo.svg`, `assets/icons/*` no longer referenced by content.yml
  (`scan`, `clipboard-check`, `camera`, `clock-hour-4` left the hero when the
  five-step strip became a four-node thesis, but `camera` / `map-pin` /
  `file-text` are still used by zone 01).
- Figma last-mile (no seat this run). Canva unused (unrelated design only).

## Deferred from the R7 critique
- **Zone 02 title wording.** The critique's preferred `AI KHÔNG HÀNH ĐỘNG MỘT
  MÌNH` is in place. It reads correctly both ways in Vietnamese (*AI* the system,
  or *ai* = who), which is why it was preferred — but if you want the
  unambiguous formal variant (`CHỦ THỂ HÀNH ĐỘNG`), it is a one-line change in
  `content.yml`.
- **Zone 03 left frame** has a sparse lower half, because the real question card
  is mostly whitespace. Cropping tighter would break the 1.30× / matched-aspect
  guarantee, so it was left as honest product UI.
