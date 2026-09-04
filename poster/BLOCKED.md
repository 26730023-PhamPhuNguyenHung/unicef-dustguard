# Poster — skipped / blocked

## R8 post-freeze — staff case CAPTURED and NOW PLACED

**Status:** `ui-staff-case.png` captured from prod on 31/08/2026 after demo staff
login, and **placed as zone 03 panel 3** the same day (ASSET_SWAP — see
`STATUS.md`). `ui-staff-operations.png` stays in reserve, unplaced.

| Asset | Path | Source URL | Notes |
|---|---|---|---|
| Staff case list | `assets/screenshots/ui-staff-operations.png` | `/staff/cases` | Real staff workspace list (not login wall). |
| Staff case detail | `assets/screenshots/ui-staff-case.png` | `/staff/cases/case_47ce2e6cae2d` | Demo case created for capture; detail UI is authentic. |
| Source copies | `assets/screenshots/.source/ui-staff-*.png` | same | Uncropped Playwright captures preserved. |

**Auth used:** prod demo login via `staff@dustguard.vn` / `123456` (documented demo account — not committed). Demo role switcher on `/login` also works.

**Placed 31/08/2026:** the case detail is zone 03 panel 3, cropped `2352×1440 +0+0`
to the case header + 7-step workflow + SLA card. Marker ⑤ was re-derived onto the
`HOÀN TẤT` box and the `sha256` refreshed. `LAYOUT_FROZEN` held — band height
22.0 cm unchanged.

## Real IoT device photo — closed via proposal hardware card (31/08/2026)

- Still no physical bench photograph of a built node in the repo.
- **Closed for print:** zone 07 uses Typst cream card **Phần cứng chính** with:
  - APM row: Wikimedia SDS011 (CC-BY-SA-4.0) laser-PM equivalent stand-in
  - ESP32: Wikimedia ESP-WROOM-32 Dev Board (CC0)
  - OLED: DustGuard native SVG raster (CC0)
  - Cost bar; labels from `content.yml`.
- Prior isometric SVG (`iot-node-isometric.svg`) and flat `iot-exploded.svg` kept unused.
- A real assembled-node photo remains optional future ASSET_SWAP.

## Canva / Figma

- Canva: only unrelated beige A4. Not exported.
- Figma: no seat / not started.

## Print boxes

- Not blocked. Typst 0.15.1 emits TrimBox. QA locks MediaBox vs TrimBox. Crop marks + bleed fill present.
