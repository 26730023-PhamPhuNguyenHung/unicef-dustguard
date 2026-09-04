// ==============================================================================
// DUSTGUARD VN — POSTER 70 cm × 90 cm PORTRAIT (ONE SIZE ONLY)
// 7-section CivicTech narrative. Copy only from content.yml.
//
// Pass R7 — "hierarchy, not more elements". The sheet is deliberately quieter
// than the previous build: the grey header bands, ~45 nested chip / tile /
// ribbon outlines and the duplicated hero loop strip are gone, and the space
// they freed was spent enlarging the four things a judge must read from 2 m —
// youth, a real product, a human decision, a feasible proposed pilot.
// Diagram builders live in diagrams.typ and take their labels from content.yml.
// ==============================================================================

#import "theme.typ": *
#import "diagrams.typ": *

// Recolour a Tabler SVG stroke for the solid-teal thesis node only.
#let hero-thesis-icon(path, width, white: false) = {
  let svg = read(path)
  if white {
    svg = svg.replace("#0D6F64", "#FFFFFF").replace("currentColor", "#FFFFFF")
  }
  image(bytes(svg), format: "svg", width: width)
}

#set page(
  width: print-trim-w,
  height: print-trim-h,
  margin: 1.8cm,
  bleed: print-bleed,
  fill: c-bg,
  background: print-bleed-fill,
  foreground: print-crop-marks(),
)

#set text(
  font: font-main,
  fill: c-ink,
  size: text-body,
  lang: "vi",
)

// Vertical rhythm is driven only by explicit v() / fr spacing, never by
// implicit paragraph gaps — otherwise band heights cannot be budgeted.
#set par(spacing: 0pt, leading: 0.62em)

#let data = yaml("content.yml")

// Content column 66.4 cm; row heights + gutters sum to the full 86.4 cm live
// height so no band leaves a dead cream band behind it.
#grid(
  columns: 100%,
  rows: (13.6cm, 14.6cm, 22.0cm, 13.6cm, 14.6cm, 5.25cm),
  row-gutter: 5.5mm,

  // ========================================================================
  // ZONE 0 — HERO: title + QR over a low-opacity scene, then the four-node
  // thesis. The detailed five-step product workflow is NOT repeated here; it
  // lives once, in zone 03.
  // ========================================================================
  civic-slab(
    height: 13.6cm,
    bg: image("assets/diagrams/hero-scene.svg", width: 66.4cm, height: 13.6cm, fit: "cover"),
    [
      #grid(
        columns: (1fr, 9.4cm),
        column-gutter: 22pt,
        rows: (7.45cm,),
        align: (left + horizon, right + horizon),
        grid(
          columns: (4.4cm, 1fr),
          gutter: 22pt,
          align: horizon,
          image("assets/brand/dustguard-shield-logo.png", width: 4.2cm),
          [
            #text(fill: c-red, weight: "bold", size: text-hero)[#data.hero.title]
            #v(10pt)
            #text(weight: "semibold", size: text-tagline)[#data.hero.tagline]
            #v(6pt)
            #text(fill: c-teal, weight: "semibold", size: 24pt)[#data.hero.tagline_proof]
            #v(7pt)
            #text(fill: c-ink-light, size: 17pt)[#data.hero.subtitle]
          ],
        ),
        block(
          width: 100%,
          height: 100%,
          fill: c-bg,
          stroke: 1pt + c-border,
          radius: 4pt,
          inset: 12pt,
          align(center + horizon, {
            text(fill: c-red, weight: "bold", size: 18.5pt)[#data.hero.qr_label]
            v(11pt)
            image("assets/qr/qr-demo.svg", width: 4.3cm, height: 4.3cm)
            v(11pt)
            // qa:type-exempt — printed fallback for the QR directly above it,
            // not a line anyone is expected to read from 2 m.
            text(fill: c-ink-light, size: 10.5pt)[#data.meta.live_url]
          }),
        ),
      )
      #v(0.35cm)
      #grid(
        columns: (7.9cm, auto, 1fr, auto, 1fr, auto, 1fr),
        column-gutter: 10pt,
        rows: (4.81cm,),
        align: horizon + center,
        // Node 01 of the thesis is the cast itself, not a decorative mascot
        // group: the poster starts with the people who do the work.
        block(
          width: 100%,
          height: 100%,
          inset: (bottom: 4pt),
          grid(
            columns: (100%,),
            rows: (3.5cm, 1fr),
            // Slight overlap: one group of people, not three separate icons.
            align(center + bottom, grid(
              columns: (auto, auto, auto),
              column-gutter: -9pt,
              rows: (3.5cm,),
              align: bottom,
              ..data.hero.actor_figures.map(fig => image(fig, height: 3.4cm)),
            )),
            align(center + horizon, text(fill: c-teal, weight: "bold", size: 21pt)[
              #data.hero.thesis.at(0).label
            ]),
          ),
        ),
        ..{
          // Pale teal, pale teal, then solid teal: the thesis builds toward a
          // result. Only the DustGuard node is outlined — it is the product
          // itself, and the transformation the poster is about happens there.
          let node-fill = (c-teal-bg, c-teal-bg, c-teal)
          let node-ink = (c-teal-dark, c-ink, white)
          let node-note = (c-ink-secondary, c-ink-secondary, c-teal-bg)
          let node-label = (27pt, 24pt, 24pt)
          // Shared icon slot aligns optical centre Y across all three thesis nodes.
          let icon-slot-h = 2.05cm
          // KẾT QUẢ check ~+18 % optical size vs prior 1.25 cm; slot height unchanged.
          let node-icon = (1.9cm, 1.5cm, 1.48cm)
          let cells = ()
          for (i, node) in data.hero.thesis.slice(1).enumerate() {
            cells.push(text(fill: c-teal, weight: "bold", size: 30pt)[→])
            cells.push(block(
              fill: node-fill.at(i),
              stroke: if i == 0 { 2.4pt + c-teal } else { none },
              radius: 4pt,
              inset: (x: 12pt, y: 11pt),
              width: 100%,
              height: 100%,
              grid(
                columns: (100%,),
                rows: (icon-slot-h, auto, auto),
                row-gutter: (10pt, 6pt),
                align(center + horizon, hero-thesis-icon(
                  node.icon,
                  node-icon.at(i),
                  white: i == 2,
                )),
                align(center + horizon, text(fill: node-ink.at(i), weight: "bold", size: node-label.at(i))[#node.label]),
                align(center + horizon, text(fill: node-note.at(i), size: 17pt)[#node.note]),
              ),
            ))
          }
          cells
        },
      )
    ],
  ),

  // ========================================================================
  // ZONES 01 + 02 — one band, two labelled columns, one hairline
  // ========================================================================
  civic-band(
    height: 14.6cm,
    cols: (1fr, 1fr),
    gutter: 9mm,
    heads: (
      (index: data.zone1_problem.index, title: data.zone1_problem.title),
      (index: data.zone2_actors.index, title: data.zone2_actors.title),
    ),
    cells: (
      // ---- 01 fragmentation: the data exists, the journey does not ---------
      [
        #text(fill: c-red, weight: "bold", size: text-card)[#data.zone1_problem.headline]
        #v(0.3cm)
        #fragmentation-diagram(
          32.22cm,
          8.9cm,
          sources: data.zone1_problem.sources,
          gap-mark: data.zone1_problem.gap_mark,
          missing-label: data.zone1_problem.missing_label,
          missing: data.zone1_problem.missing,
        )
        #v(1fr)
        // Left rule only: the white gap already separates this from the diagram.
        #block(
          width: 100%,
          height: 1.5cm,
          stroke: (left: 5pt + c-red, rest: none),
          inset: (x: 14pt),
          align(horizon, text(weight: "bold", size: 26pt)[#data.zone1_problem.closing]),
        )
      ],
      // ---- 02 who acts: people, at illustration scale, one verb each -------
      [
        #text(fill: c-teal, weight: "bold", size: 21pt)[#data.zone2_actors.answer]
        #v(0.38cm)
        #grid(
          columns: (1fr, 1fr, 1fr),
          column-gutter: 9pt,
          rows: (10.65cm,),
          ..data.zone2_actors.actors.enumerate().map(((i, actor)) => block(
            // Youth-led is highlighted by teal tint; other columns soft neutral.
            fill: if i == 0 { c-teal-bg } else { c-border-subtle },
            radius: 4pt,
            inset: (x: 10pt, top: 10pt, bottom: 20pt),
            width: 100%,
            height: 100%,
            grid(
              columns: (100%,),
              rows: (4.65cm, 1fr),
              // One baseline for all three figures: same height, bottom aligned.
              align(center + bottom, image(actor.figure, height: 4.55cm)),
              align(center + top, {
                v(0.55cm)
                text(
                  fill: if i == 0 { c-teal } else { c-ink },
                  weight: "bold",
                  size: 33pt,
                )[#actor.verb]
                v(18pt)
                text(weight: "semibold", size: 18pt)[#actor.name]
                v(13pt)
                text(fill: c-ink-secondary, size: 15.5pt)[#actor.action]
              }),
            ),
          )),
        )
      ],
    ),
  ),

  // ========================================================================
  // ZONE 03 — the product itself, as a three-panel journey: citizen intake →
  // community follow-up → staff dossier. Each PNG is cropped on card
  // boundaries (never mid-card) and each frame is sized to its crop's exact
  // aspect, so `fit: "cover"` neither clips nor letterboxes. The ①–⑤ markers
  // are small on purpose — the legend underneath carries the ordering.
  // ========================================================================
  civic-band(
    height: 22.0cm,
    heads: ((
      index: data.zone3_core_loop.index,
      title: data.zone3_core_loop.title,
      tag: data.zone3_core_loop.product_strip_label,
    ),),
    cells: ([
      #text(weight: "bold", size: text-card)[#data.zone3_core_loop.headline]
      #v(0.22cm)
      #align(center, grid(
        columns: (18.2346cm, 22.3179cm, 22.2133cm),
        column-gutter: 1.28cm,
        rows: (13.6cm,),
        shot-frame(
          data.zone3_core_loop.screenshots.at(0).file,
          18.2346cm,
          13.6cm,
          // ① the sighting (wizard step 1), ② the structured record (the detail
          // field), ③ evidence (wizard step 2 — vị trí & bằng chứng).
          markers: (
            (num: "1", x: 0.293, y: 0.128),
            (num: "2", x: 0.560, y: 0.462),
            (num: "3", x: 0.617, y: 0.128),
          ),
        ),
        shot-frame(
          data.zone3_core_loop.screenshots.at(1).file,
          22.3179cm,
          13.6cm,
          // ④ on the "tiếp tục theo dõi" card — the follow-up action itself.
          markers: ((num: "4", x: 0.440, y: 0.702),),
        ),
        shot-frame(
          data.zone3_core_loop.screenshots.at(2).file,
          22.2133cm,
          13.6cm,
          // ⑤ on the last box of the real 7-step state machine: hoàn tất.
          markers: ((num: "5", x: 0.928, y: 0.555),),
        ),
      ))
      #v(0.22cm)
      #align(center, grid(
        columns: (18.2346cm, 22.3179cm, 22.2133cm),
        column-gutter: 1.28cm,
        rows: (0.78cm,),
        // The panel name is what a judge reads first at 2 m, so it carries the
        // weight; the grey descriptor steps back to a supporting line.
        ..data.zone3_core_loop.screenshots.map(s => align(left + horizon, [
          #text(weight: "bold", size: 19.8pt)[#s.title]
          #h(10pt)
          #text(fill: c-ink-secondary, size: 14.5pt)[#s.caption]
        ])),
      ))
      // The legend stays close to the screens it annotates; the whitespace goes
      // between the legend and the conclusion, which has to stand on its own.
      // One cluster per panel, on the panel's own column, so each step number
      // reads against the screen it actually annotates instead of a single
      // ①–⑤ rail that spans all three.
      #v(0.42cm)
      #align(center, grid(
        columns: (18.2346cm, 22.3179cm, 22.2133cm),
        column-gutter: 1.28cm,
        rows: (1.22cm,),
        // Panels 1 and 2 own two steps each, panel 3 owns the fifth. Sliced
        // from the same five-step SSOT so the legend cannot drift from it.
        ..((0, 2), (2, 4), (4, 5)).map(r => {
          let cells = ()
          for (i, step) in data.zone3_core_loop.steps.slice(r.at(0), r.at(1)).enumerate() {
            if i > 0 { cells.push(text(fill: c-teal, weight: "bold", size: 24pt)[→]) }
            cells.push(step-marker(step.num, d: 1.15cm, size: 21pt))
            cells.push(text(weight: "bold", size: 21pt)[#step.title])
          }
          align(left + horizon, grid(
            columns: (auto,) * cells.len(),
            column-gutter: 14pt,
            align: horizon,
            ..cells,
          ))
        }),
      ))
      #v(1fr)
      #align(center, text(weight: "bold", size: 34pt)[#data.zone3_core_loop.conclusion])
      // 34 pt caps carry long Vietnamese under-dots; 0.16 cm let Ậ collide with
      // the support line below.
      #v(0.38cm)
      #align(center, text(fill: c-ink-secondary, size: 15.5pt)[#data.zone3_core_loop.conclusion_note])
    ],),
  ),

  // ========================================================================
  // ZONES 04 + 05 — the score, then the boundary that keeps it advisory
  // ========================================================================
  civic-band(
    height: 13.6cm,
    cols: (1fr, 1fr),
    gutter: 9mm,
    heads: (
      (index: data.zone4_priority_score.index, title: data.zone4_priority_score.title),
      (index: data.zone5_ai_human.index, title: data.zone5_ai_human.title),
    ),
    cells: (
      // ---- 04 gauge + weighting -------------------------------------------
      [
        #text(weight: "bold", size: 20.5pt)[#data.zone4_priority_score.headline]
        #v(0.32cm)
        #grid(
          columns: (13.0cm, 1fr),
          column-gutter: 16pt,
          rows: (7.75cm,),
          // gauge: arc from SVG, every string typeset from content.yml
          block(width: 100%, height: 100%, {
            // The qualifier sits ON the gauge, not in a 15 pt footnote.
            place(top + center, civic-badge(
              data.zone4_priority_score.score_badge,
              color: c-red,
              bg: c-red-bg,
              size: 22pt,
            ))
            place(top + center, dy: 1.25cm, box(width: 11.6cm, height: 6.1cm, {
              place(top + left, image("assets/diagrams/score-gauge.svg", width: 11.6cm))
              place(top + center, dy: 2.85cm, text(fill: c-red, weight: "bold", size: 92pt)[
                #data.zone4_priority_score.score_example
              ])
              place(bottom + left, dx: 0.15cm, dy: -0.08cm, text(fill: c-ink-light, weight: "semibold", size: 15pt)[
                #data.zone4_priority_score.scale_min
              ])
              place(bottom + right, dx: -0.15cm, dy: -0.08cm, text(fill: c-ink-light, weight: "semibold", size: 15pt)[
                #data.zone4_priority_score.scale_max
              ])
            }))
            place(bottom + center, text(weight: "bold", size: 18pt)[
              #data.zone4_priority_score.score_level
            ])
          }),
          // weighting: five bars, IoT deliberately muted
          block(width: 100%, height: 100%, {
            let comps = data.zone4_priority_score.components
            let top-weight = 30.0
            for (i, comp) in comps.enumerate() {
              let pct = float(comp.weight.replace("%", ""))
              let bar-c = if i == comps.len() - 1 { c-ink-light } else { c-teal }
              grid(
                columns: (8.2cm, 1fr, 1.9cm),
                column-gutter: 14pt,
                align: horizon,
                text(weight: "semibold", size: 18pt)[#comp.name],
                block(
                  width: 100%,
                  height: 0.7cm,
                  fill: c-border-subtle,
                  radius: 3pt,
                  align(left, block(
                    width: (pct / top-weight) * 100%,
                    height: 100%,
                    fill: bar-c,
                    radius: 3pt,
                  )),
                ),
                align(right, text(fill: bar-c, weight: "bold", size: 20pt)[#comp.weight]),
              )
              if i < comps.len() - 1 { v(1fr) }
            }
          }),
        )
        #v(1fr)
        #block(
          width: 100%,
          height: 1.45cm,
          stroke: (left: 5pt + rgb("#B57200"), rest: none),
          inset: (x: 14pt, y: 4pt),
          align(horizon, {
            text(weight: "bold", size: 18pt)[#data.zone4_priority_score.disclaimer]
            v(7pt)
            text(fill: c-ink-secondary, size: 16pt)[#data.zone4_priority_score.zero_iot_note]
          }),
        )
      ],
      // ---- 05 human-in-the-loop, as one sequence ---------------------------
      [
        #text(weight: "bold", size: 20.5pt)[#data.zone5_ai_human.headline]
        #v(0.38cm)
        #hitl-diagram(
          32.22cm,
          8.15cm,
          case-label: data.zone5_ai_human.case_label,
          case-note: data.zone5_ai_human.case_note,
          ai: data.zone5_ai_human.ai_role,
          human: data.zone5_ai_human.human_role,
          decision: data.zone5_ai_human.decision,
        )
        #v(1fr)
        #block(
          width: 100%,
          height: 1.1cm,
          stroke: (left: 5pt + c-red, rest: none),
          inset: (x: 14pt),
          align(horizon, text(weight: "semibold", size: 18pt)[#data.zone5_ai_human.boundary]),
        )
      ],
    ),
  ),

  // ========================================================================
  // ZONES 06 + 07 — proposed pilot shape, then the stack that already runs
  // ========================================================================
  civic-band(
    height: 14.6cm,
    cols: (1.15fr, 1fr),
    gutter: 9mm,
    heads: (
      (index: data.zone6_pilot.index, title: data.zone6_pilot.title),
      (index: data.zone7_tech.index, title: data.zone7_tech.title),
    ),
    cells: (
      // ---- 06 proposed pilot ----------------------------------------------
      [
        // Two halves, fills only: what already exists, and what is proposed.
        // A judge must never read the pilot as something already run.
        #grid(
          columns: (1fr, 1fr),
          column-gutter: 8pt,
          rows: (1.55cm,),
          ..(
            (
              label: [#data.zone6_pilot.status_now_label ✓],
              body: data.zone6_pilot.status_now,
              fg: c-teal,
              bg: c-teal-bg,
            ),
            (
              label: [#data.zone6_pilot.status_next_label →],
              body: data.zone6_pilot.status_next,
              fg: c-ink-secondary,
              bg: c-border-subtle,
            ),
          ).map(h => block(
            width: 100%,
            height: 100%,
            fill: h.bg,
            radius: 4pt,
            inset: (x: 12pt),
            align(left + horizon, {
              text(fill: h.fg, weight: "bold", size: 17pt)[#h.label]
              v(5pt)
              text(weight: "bold", size: 19.5pt)[#h.body]
            }),
          )),
        )
        #v(0.3cm)
        // No tiles: the numbers are big enough to be their own structure.
        #grid(
          columns: (1fr, 1fr, 1fr, 1fr),
          column-gutter: 8pt,
          rows: (4.2cm,),
          ..data.zone6_pilot.scope.map(s => align(center + horizon, {
            image(s.icon, width: 1.2cm)
            v(9pt)
            text(fill: c-teal, weight: "bold", size: 41pt)[#s.value]
            v(4pt)
            text(fill: c-ink-secondary, size: 16pt)[#s.unit]
          })),
        )
        #v(1fr)
        // One line, not four boxes.
        #block(width: 100%, height: 1.0cm, align(horizon, [
          #text(fill: c-ink-secondary, weight: "bold", size: 18pt)[#data.zone6_pilot.kpi_label:]
          #h(8pt)
          #text(weight: "semibold", size: 18pt)[#data.zone6_pilot.kpis.join(" · ")]
        ]))
        #v(1fr)
        // Five blocks instead of an eight-column Gantt plus a phase ribbon.
        #{
          let ramp = (rgb("#E4F1EE"), rgb("#D2E9E5"), rgb("#B4DBD5"), rgb("#74B4AC"), c-teal)
          let ramp-ink = (c-ink, c-ink, c-ink, c-ink, white)
          let ramp-week = (c-teal, c-teal, c-teal-dark, c-teal-dark, white)
          grid(
            columns: (1fr,) * data.zone6_pilot.timeline.len(),
            column-gutter: 6pt,
            rows: (2.6cm,),
            ..data.zone6_pilot.timeline.enumerate().map(((i, p)) => block(
              width: 100%,
              height: 100%,
              fill: ramp.at(i),
              radius: 4pt,
              inset: (x: 8pt),
              align(center + horizon, {
                text(fill: ramp-week.at(i), weight: "bold", size: 21pt)[#p.weeks]
                v(7pt)
                text(fill: ramp-ink.at(i), weight: "semibold", size: 18pt)[#p.name]
              }),
            )),
          )
        }
      ],
      // ---- 07 technology ---------------------------------------------------
      [
        #text(weight: "bold", size: 17.5pt)[#data.zone7_tech.headline]
        #v(0.12cm)
        #arch-diagram(29.96cm, 2.10cm, arch: data.zone7_tech.arch)
        #v(0.10cm)
        // Exactly four badges, fill only.
        #grid(
          columns: (1fr, 1fr),
          gutter: 3pt,
          rows: (0.42cm, 0.42cm),
          ..data.zone7_tech.verification.map(v => block(
            width: 100%,
            height: 100%,
            fill: c-teal-bg,
            radius: 3pt,
            inset: (x: 8pt),
            align(horizon, grid(
              columns: (auto, 1fr),
              gutter: 6pt,
              align: horizon,
              text(fill: c-teal, weight: "bold", size: 16pt)[✓],
              text(weight: "semibold", size: 16pt)[#v],
            )),
          )),
        )
        #v(0.48cm)
        #block(width: 100%, height: 0.42cm, align(horizon, [
          #text(weight: "bold", size: 14pt)[#data.zone7_tech.prototype_label]
          #h(6pt)
          #text(fill: c-ink-secondary, size: 14pt)[#data.zone7_tech.prototype_note]
        ]))
        #v(0.45cm)
        // Bottom of zone 07: hardware | role, then full-width cost.
        #block(width: 100%, height: 0.42cm, align(horizon, text(fill: c-ink-light, weight: "bold", size: 14pt)[#data.zone7_tech.iot.title]))
        #v(0.16cm)
        #grid(
          columns: (1.22fr, 1fr),
          column-gutter: 6pt,
          rows: (4.15cm,),
          block(
            width: 100%,
            height: 100%,
            fill: c-bg,
            stroke: 1pt + c-border,
            radius: 5pt,
            inset: (x: 6pt, y: 4pt),
            grid(
              columns: (100%,),
              rows: (0.32cm, 1.12cm, 1.12cm, 1.12cm),
              row-gutter: 3pt,
              grid(
                columns: (auto, 1fr),
                column-gutter: 8pt,
                align: horizon,
                image(data.zone7_tech.iot.chip_icon, width: 0.38cm),
                text(weight: "bold", size: 14.5pt)[#data.zone7_tech.iot.card_title],
              ),
              ..data.zone7_tech.iot.components.map(c => block(
                width: 100%,
                height: 100%,
                fill: c-card,
                radius: 3pt,
                inset: (x: 5pt, y: 2pt),
                grid(
                  columns: (1.05cm, 1fr),
                  column-gutter: 10pt,
                  align: horizon,
                  image(c.photo, width: 0.92cm, height: 0.92cm, fit: "cover"),
                  [
                    #text(fill: c-red, weight: "bold", size: 14.5pt)[#c.name]
                    #v(1pt)
                    #text(fill: c-ink-secondary, size: 14pt)[#c.detail]
                  ],
                ),
              )),
            ),
          ),
          block(
            width: 100%,
            height: 100%,
            fill: c-teal-bg,
            radius: 5pt,
            inset: (x: 7pt, y: 5pt),
            grid(
              columns: (100%,),
              rows: (0.32cm, 1.80cm, 0.95cm, 0.58cm),
              row-gutter: 3pt,
              text(fill: c-teal, weight: "bold", size: 14.5pt)[#data.zone7_tech.iot.role_title],
              {
                for (i, p) in data.zone7_tech.iot.role_points.enumerate() {
                  block(
                    width: 100%,
                    height: 0.54cm,
                    fill: white,
                    radius: 3pt,
                    inset: (x: 6pt),
                    align(horizon, grid(
                      columns: (auto, 1fr),
                      column-gutter: 5pt,
                      align: horizon,
                      text(fill: c-teal, weight: "bold", size: 14pt)[✓],
                      text(size: 14pt)[#p],
                    )),
                  )
                  if i < data.zone7_tech.iot.role_points.len() - 1 { v(2.5pt) }
                }
              },
              {
                let flow = data.zone7_tech.iot.role_flow
                let n = flow.len()
                grid(
                  columns: (1.15fr, auto, 0.92fr, auto, 0.92fr, auto, 1.25fr),
                  column-gutter: 3pt,
                  rows: (0.95cm,),
                  align: horizon,
                  ..flow.enumerate().map(((i, step)) => {
                    let cell = block(
                      width: 100%,
                      height: 100%,
                      fill: white,
                      radius: 3pt,
                      inset: (x: 2pt),
                      align(center + horizon, text(weight: "bold", size: 14pt)[#step]),
                    )
                    if i < n - 1 {
                      (cell, align(center + horizon, text(fill: c-teal, weight: "bold", size: 15pt)[→]))
                    } else {
                      (cell,)
                    }
                  }).flatten()
                )
              },
              grid(
                columns: (1fr, 1fr, 1fr),
                column-gutter: 4pt,
                rows: (0.58cm,),
                ..data.zone7_tech.iot.pm_chips.map(chip => block(
                  width: 100%,
                  height: 100%,
                  fill: white,
                  radius: 3pt,
                  align(center + horizon, text(fill: c-teal, weight: "bold", size: 14.5pt)[#chip]),
                )),
              ),
            ),
          ),
        )
        #v(0.16cm)
        #block(
          width: 100%,
          height: 0.54cm,
          fill: c-red-bg,
          radius: 3pt,
          inset: (x: 9pt),
          align(horizon, grid(
            columns: (auto, auto, auto),
            column-gutter: 6pt,
            align: horizon,
            image(data.zone7_tech.iot.wallet_icon, width: 0.36cm),
            text(fill: c-ink-secondary, size: 14pt)[#data.zone7_tech.iot.cost_prefix],
            text(fill: c-red, weight: "bold", size: 15pt)[#data.zone7_tech.iot.cost_value],
          )),
        )
      ],
    ),
  ),

  // ========================================================================
  // FOOTER — the closing thesis is the biggest thing here; the roadmap and
  // the URLs sit under it instead of competing with it.
  // ========================================================================
  civic-slab(height: 5.25cm, inset-x: 16pt, inset-y: 11pt, [
    // The closing thesis owns its own measure (68 % of the column) so it never
    // shares a line with metadata; everything addressable — URLs, repo, team —
    // is demoted under a rule where it belongs.
    #grid(
      columns: (68%, 1fr),
      column-gutter: 16pt,
      rows: (1.85cm,),
      align: horizon,
      text(weight: "bold", size: 36pt)[#data.footer.closing],
      align(right, block(
        fill: c-teal-bg,
        radius: 3pt,
        inset: (x: 12pt, y: 9pt),
        [#text(fill: c-teal, weight: "bold", size: 15.5pt)[#data.meta.event]],
      )),
    )
    #v(0.26cm)
    #block(width: 100%, height: 1.10cm, align(horizon, grid(
      columns: (auto,) + (auto, auto) * data.footer.roadmap_steps.len(),
      column-gutter: 9pt,
      align: horizon,
      text(fill: c-ink-secondary, weight: "bold", size: 16.5pt)[#data.footer.roadmap_title],
      ..{
        let cells = ()
        for (i, s) in data.footer.roadmap_steps.enumerate() {
          cells.push(text(fill: c-teal, weight: "bold", size: 19pt)[→])
          let last = i == data.footer.roadmap_steps.len() - 1
          cells.push(chip(
            s,
            fg: if last { white } else { c-ink },
            bg: if last { c-teal } else { c-border-subtle },
            border: none,
            size: 16.5pt,
          ))
        }
        cells
      },
    )))
    #v(0.22cm)
    // A filled hairline, not a stroked rule: same mark, no stroke on the budget.
    #block(width: 100%, height: 1pt, fill: c-border)
    #v(0.20cm)
    #block(width: 100%, height: 0.72cm, align(horizon, grid(
      columns: (auto, 1fr),
      align: horizon,
      text(weight: "bold", size: 15pt)[#data.footer.team],
      align(right, [
        #text(fill: c-ink-light, size: 14pt)[#data.footer.site_label]
        #h(5pt)
        #text(fill: c-ink-light, size: 14pt)[#data.meta.live_url]
        #h(14pt)
        #text(fill: c-ink-light, size: 14pt)[#data.footer.github_label]
        #h(5pt)
        #text(fill: c-ink-light, size: 14pt)[#data.meta.repo_display]
      ]),
    )))
  ]),
)
