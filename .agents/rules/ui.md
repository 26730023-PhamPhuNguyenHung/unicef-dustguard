# LAPTOP 14-INCH / WINDOWS 125% SCALE — MANDATORY

The primary DustGuard staff environment is a Windows laptop approximately 14–15.6 inches running display scaling at 125%.
Therefore DO NOT optimize only for physical resolution.

The primary CSS viewport acceptance target is:
**1536 x 864**

Also test:
- 1366 x 768
- 1440 x 810
- 1536 x 864
- 1280 x 720
- 1920 x 1080

**PRIORITY ORDER:**
1. **1536 x 864** (Chuẩn kiểm thử số 1 - Windows 125% scale trên màn 1080p)
2. **1366 x 768** (Stress test laptop phổ thông VN)
3. **1440 x 810 / 1440 x 900**
4. **1920 x 1080**

A screen is NOT considered complete if it only looks correct at 1920x1080.

---

## Mandatory rules

At 1536x864:
- No page-level horizontal scrolling
- No clipped buttons
- No clipped table columns
- No text collision
- No wrapped primary actions unless intentionally designed
- Sidebar must not consume excessive content width
- Tables must preserve the most important columns
- Secondary metadata may collapse/hide before primary information
- Cards must not become unnecessarily tall
- No fixed-width composition that assumes a >1600px viewport

Do not use browser zoom as a substitute for proper responsive design. Test at browser zoom = 100%.
The operating-system 125% scaling condition is represented by the effective CSS viewport.

---

## Density rule

DustGuard is an operational dashboard. At 1536x864, the first viewport should expose as much as possible:
- Screen title
- Core filters
- Summary metrics
- Beginning of primary work list

Avoid oversized:
- Headings
- Cards
- Padding
- Empty areas
- Decorative elements

### Default desktop values:
- App sidebar: 184–208px
- Content horizontal padding: 20–24px
- Card padding: 14–18px
- Card gap: 12–16px
- Control height: 34–38px
- Body text: 13–14px
- Section heading: 16–20px

Do not scale the entire UI down using transform, zoom, CSS scale, or browser zoom hacks.
Responsive behavior must come from layout itself.

---

# DATA TABLE RESPONSIVE RULES

Never force every desktop table column to remain visible.
At effective viewport <= 1536px:

### Priority 1 — always visible:
- object/site
- score/severity
- reason/status
- main action

### Priority 2 — visible when space allows:
- time
- location
- evidence

### Priority 3 — collapse first:
- duplicate metadata
- secondary labels
- redundant status text

Do not shrink text below 12px just to fit a table.
Do not let action buttons create horizontal overflow.

### Preferred patterns:
1. Shorten labels
2. Reduce column gap
3. Constrain secondary columns
4. Merge related information in one cell
5. Hide low-priority metadata
6. Only then allow table-local horizontal scroll

**Never allow table overflow to create page-level horizontal scroll.**
