// ==============================================================================
// DUSTGUARD VN — POSTER DIAGRAMS
// Every diagram is drawn natively in Typst (shapes + connectors) and receives
// its labels from content.yml, so the SSOT rule still holds: no Vietnamese
// string is authored here, and no diagram carries baked-in text.
//
// Each builder takes an explicit `w` / `h` so all internal coordinates can be
// absolute — `place` inside an auto-sized container is not reliable.
// ==============================================================================

#import "theme.typ": *

// ------------------------------------------------------------------ primitives
#let dash-stroke(c, t: 2.4pt) = (paint: c, thickness: t, dash: "dashed", cap: "round")
#let solid-stroke(c, t: 2.4pt) = (paint: c, thickness: t, cap: "round")

#let head-right(c) = polygon(fill: c, (0pt, 0pt), (11pt, 6pt), (0pt, 12pt))
#let head-down(c) = polygon(fill: c, (0pt, 0pt), (12pt, 0pt), (6pt, 11pt))

// Horizontal connector of exact width, arrowhead flush to the right edge.
#let connector-h(len, color: c-ink-light, dashed: true, thickness: 2.6pt) = box(
  width: len,
  height: 12pt,
  {
    place(left + horizon, line(
      length: len - 8pt,
      stroke: if dashed { dash-stroke(color, t: thickness) } else { solid-stroke(color, t: thickness) },
    ))
    place(right + horizon, head-right(color))
  },
)

#let chip(body, fg: c-ink, bg: c-bg, border: none, size: 16pt, weight: "semibold") = box(
  fill: bg,
  stroke: if border == none { none } else { 1pt + border },
  radius: 3pt,
  inset: (x: 10pt, y: 7pt),
  text(fill: fg, weight: weight, size: size)[#body],
)

// Numbered circular marker used over the real UI in zone 03 and in the legend.
#let step-marker(num, d: 1.15cm, bg: c-red, size: 21pt) = box(
  width: d,
  height: d,
  {
    place(center + horizon, circle(radius: d / 2 + 2.5pt, fill: white))
    place(center + horizon, circle(radius: d / 2, fill: bg))
    place(center + horizon, text(fill: white, weight: "bold", size: size)[#num])
  },
)

// ==============================================================================
// ZONE 01 — fragmentation: scattered sources -> "?" -> no unified dossier
// ==============================================================================
#let fragmentation-diagram(w, h, sources: (), gap-mark: "?", missing-label: "", missing: ()) = {
  let chip-w = 0.250 * w
  let chip-h = 0.205 * h
  // Deliberately uneven offsets — the point of the panel is that nothing lines up.
  let spots = ((0.000, 0.000), (0.062, 0.253), (0.020, 0.506), (0.078, 0.759))

  // The gap is a hinge, not the headline: the conclusion on the right is what
  // has to dominate, so the "?" node is small and unfilled.
  let node-d = 0.228 * h
  let node-cx = 0.445 * w
  let node-cy = 0.48 * h

  let frame-x = 0.515 * w
  let frame-w = w - frame-x
  let frame-y = 0.015 * h
  let frame-h = 0.925 * h

  box(width: w, height: h, {
    // converging dashed leads from every scattered source into the "?"
    for (i, s) in spots.enumerate() {
      place(top + left, line(
        start: (s.at(0) * w + chip-w, s.at(1) * h + chip-h / 2),
        end: (node-cx - node-d / 2 - 4pt, node-cy),
        stroke: dash-stroke(c-ink-light, t: 2.2pt),
      ))
    }

    // scattered sources
    for (i, src) in sources.enumerate() {
      let s = spots.at(calc.min(i, spots.len() - 1))
      place(top + left, dx: s.at(0) * w, dy: s.at(1) * h, block(
        width: chip-w,
        height: chip-h,
        fill: white,
        stroke: 1pt + c-border,
        radius: 4pt,
        inset: (x: 10pt, y: 7pt),
        align(horizon, grid(
          columns: (0.95cm, 1fr),
          gutter: 9pt,
          align: horizon,
          image(src.icon, width: 0.9cm),
          text(size: 16.5pt, weight: "semibold")[#src.label],
        )),
      ))
    }

    // the gap
    place(top + left, dx: node-cx - node-d / 2, dy: node-cy - node-d / 2, box(
      width: node-d,
      height: node-d,
      {
        place(center + horizon, circle(radius: node-d / 2, fill: none, stroke: (paint: c-red, thickness: 2.6pt, dash: "dashed")))
        place(center + horizon, text(fill: c-red, weight: "bold", size: 34pt)[#gap-mark])
      },
    ))

    place(top + left, dx: node-cx + node-d / 2 + 4pt, dy: node-cy - 6pt, connector-h(
      frame-x - (node-cx + node-d / 2) - 8pt,
      color: c-red,
      thickness: 3pt,
    ))

    // the dossier that does not exist — a filled block, no outline: the fill
    // already separates it from the white panel and the absent rows read as
    // gaps punched into it.
    place(top + left, dx: frame-x, dy: frame-y, block(
      width: frame-w,
      height: frame-h,
      fill: c-border-subtle,
      radius: 5pt,
      inset: (x: 15pt, y: 13pt),
      {
        // The conclusion, not the question mark, is the loudest thing here.
        text(fill: c-ink, weight: "bold", size: 31pt)[#upper(missing-label)]
        v(1fr)
        for item in missing {
          grid(
            columns: (0.95cm, 1fr),
            gutter: 11pt,
            align: horizon,
            box(width: 0.9cm, height: 0.9cm, {
              place(center + horizon, circle(radius: 0.45cm, fill: c-red-bg, stroke: 1.4pt + c-red))
              place(center + horizon, text(fill: c-red, weight: "bold", size: 19pt)[✕])
            }),
            block(
              width: 100%,
              height: 0.78cm,
              fill: white,
              radius: 3pt,
              inset: (x: 10pt),
              align(horizon, text(fill: c-ink-light, weight: "semibold", size: 19.5pt)[#item]),
            ),
          )
          v(1fr)
        }
      },
    ))
  })
}

// ==============================================================================
// ZONE 05 — human-in-the-loop as ONE SEQUENCE, not two parallel branches:
// dossier -> AI assists -> a person reviews -> only a person decides.
// Deliberately few strokes: fill and outline carry the roles, arrows carry the
// order, and the decision bar is the only filled red on the sheet besides 87.
// ==============================================================================
#let hitl-diagram(w, h, case-label: "", case-note: "", ai: none, human: none, decision: "") = {
  let arrow-w = 0.052 * w
  let stage-w = (w - arrow-w * 2) / 3
  let stage-h = 0.580 * h
  let bar-h = 0.270 * h
  let gap-y = 0.055 * h
  let bar-y = stage-h + gap-y

  // Generous padding with vertically centered content so text doesn't hug top or bottom.
  let stage(title, title-c, lines, fill-c, stroke-c) = block(
    width: stage-w,
    height: stage-h,
    fill: fill-c,
    stroke: if stroke-c == none { none } else { 2pt + stroke-c },
    radius: 4pt,
    inset: (x: 19pt, y: 15pt),
    align(horizon, grid(
      columns: (100%,),
      row-gutter: 12pt,
      align(left, text(fill: title-c, weight: "bold", size: 22.5pt)[#title]),
      align(left, grid(
        columns: (100%,),
        row-gutter: 8pt,
        ..lines.map(it => text(fill: c-ink-secondary, size: 17.5pt)[#it]),
      )),
    )),
  )

  box(width: w, height: h, {
    // 1 — the dossier the whole sequence is about
    place(top + left, dx: 0pt, dy: 0pt, block(
      width: stage-w,
      height: stage-h,
      fill: c-border-subtle,
      radius: 4pt,
      inset: (x: 19pt, y: 15pt),
      align(horizon, grid(
        columns: (100%,),
        row-gutter: 12pt,
        align(left, text(fill: c-ink, weight: "bold", size: 22.5pt)[#case-label]),
        align(left, text(fill: rgb("#6C635A"), size: 17.5pt)[#case-note]),
      )),
    ))
    // 2 — AI assists (teal = action, no outline needed)
    place(top + left, dx: stage-w + arrow-w, dy: 0pt,
      stage(ai.title, c-teal, ai.items, c-teal-bg, none))
    // 3 — a person reviews (red outline = the decision boundary starts here)
    place(top + left, dx: (stage-w + arrow-w) * 2, dy: 0pt,
      stage(human.title, c-red, human.items, white, c-red))

    for i in range(2) {
      place(
        top + left,
        dx: stage-w * (i + 1) + arrow-w * i + 3pt,
        dy: stage-h / 2 - 6pt,
        connector-h(arrow-w - 6pt, color: c-teal, dashed: false, thickness: 3pt),
      )
    }

    // only the human column feeds the decision — down-arrow centered under the third box
    let x3 = (stage-w + arrow-w) * 2
    let hx = x3 + stage-w / 2
    place(top + left, line(
      start: (hx, stage-h),
      end: (hx, bar-y - 7pt),
      stroke: solid-stroke(c-red, t: 3pt),
    ))
    place(top + left, dx: hx - 6pt, dy: bar-y - 8pt, head-down(c-red))

    place(top + left, dx: 0pt, dy: bar-y, block(
      width: w,
      height: bar-h,
      fill: c-red,
      radius: 4pt,
      inset: (x: 16pt),
      align(center + horizon, text(fill: white, weight: "bold", size: 26pt)[#decision]),
    ))
  })
}

// ==============================================================================
// ZONE 07 — architecture: users -> Cloudflare Worker -> D1 + R2
// ==============================================================================
#let arch-diagram(w, h, arch: none) = {
  let col-w = 0.245 * w
  let core-x = 0.345 * w
  let core-w = 0.315 * w
  let store-x = 0.740 * w
  let store-w = w - store-x

  let n = arch.actors.len()
  let actor-h = (h - 0.06 * h * (n - 1)) / n

  box(width: w, height: h, {
    for (i, a) in arch.actors.enumerate() {
      place(top + left, dx: 0pt, dy: i * (actor-h + 0.06 * h), block(
        width: col-w,
        height: actor-h,
        fill: c-border-subtle,
        radius: 4pt,
        inset: (x: 10pt),
        align(center + horizon, text(weight: "semibold", size: 19pt)[#a]),
      ))
      place(top + left, line(
        start: (col-w, i * (actor-h + 0.06 * h) + actor-h / 2),
        end: (core-x - 12pt, h / 2),
        stroke: solid-stroke(c-ink-light, t: 2.2pt),
      ))
    }
    place(top + left, dx: core-x - 13pt, dy: h / 2 - 6pt, head-right(c-ink-light))

    // One story in the core box: where the work runs, with framework integrated inside.
    place(top + left, dx: core-x, dy: 0.03 * h, block(
      width: core-w,
      height: 0.94 * h,
      fill: c-teal,
      radius: 5pt,
      inset: (x: 8pt, y: 5pt),
      align(center + horizon, {
        text(fill: white, weight: "bold", size: 22.5pt)[#arch.core_title]
        if arch.at("core_sub", default: none) != none {
          v(3pt)
          text(fill: rgb("#D2E9E5"), weight: "semibold", size: 14.5pt)[#arch.core_sub]
        }
      }),
    ))

    let m = arch.stores.len()
    let store-h = (h - 0.08 * h * (m - 1)) / m
    for (i, s) in arch.stores.enumerate() {
      let sy = i * (store-h + 0.08 * h)
      place(top + left, line(
        start: (core-x + core-w, h / 2),
        end: (store-x - 12pt, sy + store-h / 2),
        stroke: solid-stroke(c-ink-light, t: 2.2pt),
      ))
      place(top + left, dx: store-x - 13pt, dy: sy + store-h / 2 - 6pt, head-right(c-ink-light))
      place(top + left, dx: store-x, dy: sy, block(
        width: store-w,
        height: store-h,
        fill: white,
        stroke: 1.4pt + c-teal,
        radius: 4pt,
        inset: (x: 10pt),
        align(horizon, grid(
          columns: (auto, 1fr),
          gutter: 8pt,
          align: horizon,
          text(fill: c-teal, weight: "bold", size: 24pt)[#s.name],
          text(fill: c-ink-secondary, size: 16.5pt)[#s.detail],
        )),
      ))
    }
  })
}

// ==============================================================================
// ZONE 03 — real UI at 1.3x, ①–⑤ markers on top.
// The PNGs are pre-cropped to this frame's exact aspect, so `fit: "cover"` is
// lossless: no clipped element, no fade needed, and no caption chrome inside
// the frame (the caption is one plain line typeset underneath it).
// ==============================================================================
#let shot-frame(file, w, h, markers: ()) = block(
  width: w,
  height: h,
  fill: white,
  stroke: 1pt + c-border,
  radius: 4pt,
  clip: true,
  {
    place(top + left, image(file, width: w, height: h, fit: "cover"))
    for m in markers {
      place(
        top + left,
        dx: m.x * w,
        dy: m.y * h,
        // Small: the marker points at the UI, the legend below does the telling.
        step-marker(m.num, d: 1.0cm, size: 19pt, bg: m.at("bg", default: c-red)),
      )
    }
  },
)
