# Poster layout freeze — DustGuard VN 70×90

```text
LAYOUT_FROZEN = true
```

**Frozen as of:** pass R8 (31/08/2026), user-approved commit.

## Post-freeze changes ONLY allowed as

| Class | Examples |
|---|---|
| **CONTENT_CORRECTION** | Typo fixes, wording tweaks in `content.yml` that do not change line counts or band heights |
| **ASSET_SWAP** | Replace screenshot PNG, IoT bench photo, or diagram SVG — refresh `sha256` in `asset-manifest.yml` |
| **PRINT_FIX** | Bleed/TrimBox, crop marks, font embedding, QR decode, minimum-type floor |

## NOT allowed without a new layout pass

- **LAYOUT_REDESIGN** — column widths, band heights, crop geometry, marker coordinates
- **NEW_SECTION** — extra zones, panels, or decorative elements
- **MORE_INFORMATION** — additional copy blocks, chips, or data rows (unless BTC changes requirements)

## User-locked decisions (31/08/2026)

| Zone | Decision |
|---|---|
| **Zone 03 crop** | ~~Keep wizard 3-step crop — no change.~~ **Superseded 31/08/2026:** three-panel strip (Ghi nhận · Cộng đồng · Hồ sơ cán bộ), crops cut on card boundaries only, small markers + legend below. Done as ASSET_SWAP — band height 22.0 cm unchanged. See `STATUS.md`. |
| **Zone 07 sizing** | Architecture **+5 %** locked. IoT: hardware-card ASSET_SWAP fills leftover in-band space under arch (not co-hero). Band height unchanged. |

## QA gates that enforce the freeze

- `pnpm poster:qa` — 15 dev checks (content locks, anti-duplication, band budget)
- `pnpm poster:qa:release` — 21 release checks (hashes, print boxes, QR decode, thumbnails)

Any change that invalidates a release gate requires re-running `pnpm poster:qa:release` before print.

## Asset swaps ready but not placed

The staff case screenshot is **placed** as of 31/08/2026 (zone 03 panel 3).
IoT zone 07 uses the proposal-style **Phần cứng chính** hardware card as of
31/08/2026 — see `STATUS.md` / `BLOCKED.md`.
