// ==============================================================================
// DUSTGUARD VN — POSTER THEME (70 cm × 90 cm PORTRAIT ONLY)
// Civic high-contrast. No glassmorphism. Read at 1.5–2 m.
// One composition: 6 full-width bands, shared column template, no floating cards.
// ==============================================================================

#let c-bg = rgb("#FDFBF7")
#let c-card = rgb("#FFFFFF")
#let c-ink = rgb("#231B14")
#let c-ink-secondary = rgb("#5C5248")
#let c-ink-light = rgb("#8C827A")
// Seal red sampled from public/assets/landing/brand/dustguard-shield-logo.png (#9f0d0c)
#let c-red = rgb("#9f0d0c")
#let c-red-bg = rgb("#FDECEA")
#let c-teal = rgb("#0D6F64")
#let c-teal-bg = rgb("#E8F4F2")
#let c-teal-dark = rgb("#0A4F47")
#let c-border = rgb("#DDD7CE")
#let c-border-subtle = rgb("#EBE6DF")

#let font-main = "Be Vietnam Pro"

// Print sheet = trim 70×90 cm + 3 mm bleed each side (MediaBox 706×906 mm).
// Typst 0.15 writes TrimBox = trim; MediaBox/BleedBox = sheet.
#let print-bleed = 3mm
#let print-trim-w = 70cm
#let print-trim-h = 90cm
#let print-sheet-w = print-trim-w + print-bleed * 2
#let print-sheet-h = print-trim-h + print-bleed * 2

#let print-bleed-fill = rect(width: 100%, height: 100%, fill: c-bg)

#let print-crop-marks() = {
  let b = print-bleed
  let arm = 2.4mm
  let s = 0.35pt + c-ink
  let W = print-sheet-w
  let H = print-sheet-h
  // Stay inside bleed; do not enter the trim live area.
  place(dx: 0pt, dy: b, line(length: arm, stroke: s))
  place(dx: b, dy: 0pt, line(length: arm, angle: 90deg, stroke: s))
  place(dx: W - arm, dy: b, line(length: arm, stroke: s))
  place(dx: W - b, dy: 0pt, line(length: arm, angle: 90deg, stroke: s))
  place(dx: 0pt, dy: H - b, line(length: arm, stroke: s))
  place(dx: b, dy: H - arm, line(length: arm, angle: 90deg, stroke: s))
  place(dx: W - arm, dy: H - b, line(length: arm, stroke: s))
  place(dx: W - b, dy: H - arm, line(length: arm, angle: 90deg, stroke: s))
}

// ---------------------------------------------------------------- type scale
#let text-hero = 86pt
// The promise line carries the poster from 2 m, so it is deliberately close to
// a third of the wordmark rather than a caption under it.
#let text-tagline = 32pt
#let text-section = 32pt
#let text-card = 23pt
#let text-body = 19pt
#let text-caption = 16.5pt

// -------------------------------------------------------------- band geometry
#let band-pad-x = 15pt
#let band-pad-y = 13pt
#let band-header-h = 1.95cm
#let band-radius = 6pt

// Fill only, no outline: badges sit inside panels that already have an edge.
#let civic-badge(text-content, color: c-teal, bg: c-teal-bg, size: 14pt) = {
  box(
    fill: bg,
    radius: 3pt,
    inset: (x: 8pt, y: 5pt),
    [#text(fill: color, weight: "bold", size: size)[#text-content]],
  )
}

#let band-index(index) = rect(
  fill: c-red,
  radius: 3pt,
  inset: (x: 9pt, y: 5pt),
  [#text(fill: white, weight: "bold", size: 18pt)[#index]],
)

// Interleave zero-width divider tracks between the real columns so the header
// labels and the body content share one column template and one hairline.
#let _band-template(cols, gutter) = {
  let tmpl = ()
  for (i, c) in cols.enumerate() {
    if i > 0 { tmpl.push(0pt) }
    tmpl.push(c)
  }
  let gaps = ()
  for _ in range(tmpl.len() - 1) { gaps.push(gutter / 2) }
  (tmpl, gaps)
}

#let _band-divider(h) = rect(width: 0pt, height: h, stroke: (left: 1pt + c-border))

// One band = one white panel spanning the full content column.
// `heads` and `cells` are parallel to `cols`, so paired zones read as a single
// composition split by a hairline instead of two separate floating cards.
#let civic-band(
  height: 10cm,
  cols: (1fr,),
  gutter: 9mm,
  heads: (),
  cells: (),
) = {
  let (tmpl, gaps) = _band-template(cols, gutter)
  let body-h = height - band-header-h - 1pt

  let head-row = ()
  for (i, h) in heads.enumerate() {
    if i > 0 { head-row.push(_band-divider(band-header-h)) }
    head-row.push(align(horizon, grid(
      columns: (auto, auto, 1fr, auto),
      column-gutter: 9pt,
      align: horizon,
      if h.at("index", default: none) != none { band-index(h.index) },
      text(fill: c-ink, weight: "bold", size: text-section)[#h.title],
      [],
      if h.at("tag", default: none) != none {
        civic-badge(h.tag, size: 15pt)
      },
    )))
  }

  // Explicit cell height: fractional spacing only resolves inside a container
  // with a definite height, and that is what lets each column fill its band.
  let cell-h = body-h - band-pad-y * 2
  let body-row = ()
  for (i, cell) in cells.enumerate() {
    if i > 0 { body-row.push(_band-divider(100%)) }
    body-row.push(pad(y: band-pad-y, block(width: 100%, height: cell-h, cell)))
  }

  block(
    width: 100%,
    height: height,
    fill: c-card,
    stroke: 1pt + c-border,
    radius: band-radius,
    clip: true,
    {
      // No grey header band: a red index plus an ink title on the panel itself,
      // closed by a single hairline. One less filled rectangle per zone.
      block(
        width: 100%,
        height: band-header-h,
        stroke: (bottom: 1pt + c-border),
        inset: (x: band-pad-x),
        grid(columns: tmpl, column-gutter: gaps, rows: (band-header-h,), ..head-row),
      )
      pad(x: band-pad-x, grid(
        columns: tmpl,
        column-gutter: gaps,
        rows: (body-h,),
        ..body-row,
      ))
    },
  )
}

// A plain full-width band with no header row (hero / footer).
// `bg` is drawn edge to edge behind the padded body — used for the hero's
// low-opacity vector scene.
#let civic-slab(height: 10cm, inset-x: 18pt, inset-y: 14pt, bg: none, body) = block(
  width: 100%,
  height: height,
  fill: c-card,
  stroke: 1pt + c-border,
  radius: band-radius,
  clip: true,
  {
    if bg != none { place(top + left, bg) }
    pad(x: inset-x, y: inset-y, body)
  },
)
