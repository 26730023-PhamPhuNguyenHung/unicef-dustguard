// Two speeds, one script.
//   node poster/scripts/qa-poster.mjs             dev  — source-only, < 2 s
//   node poster/scripts/qa-poster.mjs --release   full — hashes, print boxes,
//                                                        QR decode, thumbnails
// The release gate is deliberately NOT part of the inner loop: it rasterises
// the PDF three times and hashes every embedded asset.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { execSync } from 'node:child_process';
import assert from 'node:assert/strict';

const RELEASE = process.argv.includes('--release');
const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'poster/content.yml');
const POSTER = path.join(ROOT, 'poster/poster.typ');
const THEME = path.join(ROOT, 'poster/theme.typ');
const DIAGRAMS = path.join(ROOT, 'poster/diagrams.typ');
const MANIFEST = path.join(ROOT, 'poster/asset-manifest.yml');
const PDF = path.join(ROOT, 'poster/output/DustGuard_70x90.pdf');
const PREVIEW = path.join(ROOT, 'poster/output/DustGuard_preview.png');

console.log('========================================================');
console.log(`DUSTGUARD VN — POSTER 70x90cm (PORTRAIT ONLY) QA — ${RELEASE ? 'RELEASE' : 'DEV'}`);
console.log('========================================================\n');

let failed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`  [FAIL] ${name}`);
    console.error(`         ${err.message}`);
  }
}

const content = fs.readFileSync(CONTENT, 'utf8');
const typst = fs.readFileSync(POSTER, 'utf8');
const theme = fs.readFileSync(THEME, 'utf8');
const diagrams = fs.readFileSync(DIAGRAMS, 'utf8');

test('1. content.yml has 7 zones + hero + footer', () => {
  for (const key of [
    'hero:',
    'zone1_problem:',
    'zone2_actors:',
    'zone3_core_loop:',
    'zone4_priority_score:',
    'zone5_ai_human:',
    'zone6_pilot:',
    'zone7_tech:',
    'footer:',
  ]) {
    assert.ok(content.includes(key), `missing ${key}`);
  }
});

test('2. Page is 70cm wide × 90cm tall only (no 90×70 landscape)', () => {
  const sized = (typst.includes('width: 70cm') && typst.includes('height: 90cm'))
    || (typst.includes('print-trim-w') && typst.includes('print-trim-h') && theme.includes('70cm') && theme.includes('90cm'));
  assert.ok(sized, 'need width/height 70cm × 90cm (or print-trim-* aliases)');
  assert.ok(typst.includes('bleed: print-bleed') || typst.includes('bleed: 3mm'), 'need 3mm bleed');
  assert.ok(typst.includes('print-crop-marks') || theme.includes('print-crop-marks'), 'need crop marks for print shop');
  assert.ok(typst.includes('print-bleed-fill') || theme.includes('print-bleed-fill'), 'need bleed fill');
  assert.ok(!typst.includes('width: 90cm'), 'must not set width: 90cm');
  assert.ok(!typst.includes('height: 70cm'), 'must not set height: 70cm');
  assert.ok(!content.toLowerCase().includes('landscape'), 'content.yml must not claim landscape');
  assert.ok(!typst.includes('qr-repo'), 'one QR only — no GitHub QR');
  assert.ok(content.includes('DustGuardians'), 'team must be DustGuardians');
  assert.ok(content.includes('https://dustguard.phamphunguyenhung.com/'), 'live URL missing');
  assert.ok(content.includes('https://github.com/hungpixi/dust-guard-vn'), 'GitHub URL missing');
});

test('3. Local assets + manifest exist', () => {
  assert.ok(fs.existsSync(MANIFEST), 'asset-manifest.yml missing');
  const manifest = fs.readFileSync(MANIFEST, 'utf8');
  assert.ok(manifest.includes('license:'), 'manifest needs licenses');
  assert.ok(fs.existsSync('poster/assets/fonts/BeVietnamPro-Bold.ttf'), 'Be Vietnam Pro Bold missing');
  assert.ok(fs.existsSync('poster/assets/people/youth-volunteer.svg'), 'youth-volunteer missing');
  assert.ok(fs.existsSync('poster/assets/brand/dustguard-shield-logo.png'), 'shield logo missing');
  assert.ok(fs.existsSync('poster/assets/icons/users-group.svg'), 'users-group icon missing');
  assert.ok(fs.existsSync('poster/assets/qr/qr-demo.svg'), 'qr-demo missing');
  for (const id of ['diagram-hero-scene', 'diagram-score-gauge', 'diagram-iot-exploded', 'iot-photo-apm2000', 'iot-photo-esp32', 'iot-photo-oled']) {
    assert.ok(manifest.includes(id), `manifest missing ${id}`);
  }
});

test('4. Real UI screenshots exist (device-free files)', () => {
  for (const f of [
    'poster/assets/screenshots/ui-citizen-report.png',
    'poster/assets/screenshots/ui-community-actions.png',
    'poster/assets/screenshots/ui-staff-operations.png',
  ]) {
    assert.ok(fs.existsSync(f), `missing ${f}`);
    assert.ok(fs.statSync(f).size > 8000, `${f} looks empty`);
  }
});

test('5. No remote image URLs in Typst', () => {
  assert.ok(!typst.includes('image("http'), 'poster.typ remote image');
  assert.ok(!theme.includes('image("http'), 'theme.typ remote image');
  assert.ok(!diagrams.includes('image("http'), 'diagrams.typ remote image');
});

test('6. Anti-overclaim / no fake pilot results', () => {
  const banned = [
    'Dust Risk Score',
    'AI tự động xử phạt',
    'AI quyết định xử lý',
    'giảm 60% toàn thành phố',
    'độ chính xác 99%',
    'kết luận vi phạm tự động',
    'Kết quả Pilot',
    'pilot results',
    '24 công trình',
    '18 phản ánh',
    '7 hồ sơ',
    '88/88',
    'cold start',
  ];
  const hay = `${content}\n${typst}`;
  for (const phrase of banned) {
    assert.ok(!hay.toLowerCase().includes(phrase.toLowerCase()), `banned: ${phrase}`);
  }
  assert.ok(content.includes('không phải kết luận vi phạm'), 'missing priority disclaimer');
  assert.ok(content.includes('AI chuẩn bị'), 'missing AI boundary');
  assert.ok(content.includes('NGUYÊN MẪU & KIỂM CHỨNG KỸ THUẬT'), 'missing prototype label');
  assert.ok(
    content.includes('AI không kết luận vi phạm, không xử phạt'),
    'human-in-the-loop panel must state the AI boundary',
  );
  // Verification wording stays qualitative — no invented counts / percentages.
  const vBlock = content.slice(content.indexOf('verification:'), content.indexOf('iot:'));
  assert.ok(!/\d/.test(vBlock), `technology verification must stay qualitative, got:\n${vBlock}`);
});

test('7. PDF MediaBox is sheet; TrimBox is 70×90 cm', () => {
  assert.ok(fs.existsSync(PDF), 'DustGuard_70x90.pdf missing — run poster:build');
  assert.ok(fs.existsSync(PREVIEW), 'DustGuard_preview.png missing');
  const info = execSync(`pdfinfo -box "${PDF}"`, { encoding: 'utf8' });
  assert.ok(/Pages:\s+1\b/.test(info), `expected 1 page, got:\n${info}`);
  const box = (name) => {
    const m = info.match(new RegExp(`${name}:\\s+([\\d.-]+)\\s+([\\d.-]+)\\s+([\\d.-]+)\\s+([\\d.-]+)`));
    assert.ok(m, `missing ${name} in:\n${info}`);
    return { x1: +m[1], y1: +m[2], x2: +m[3], y2: +m[4], w: +m[3] - +m[1], h: +m[4] - +m[2] };
  };
  const media = box('MediaBox');
  const bleed = box('BleedBox');
  const trim = box('TrimBox');
  // Sheet = 706×906 mm (70cm + 3mm×2)
  assert.ok(Math.abs(media.w - 2001.26) < 4, `MediaBox width ${media.w} != 706mm`);
  assert.ok(Math.abs(media.h - 2568.19) < 4, `MediaBox height ${media.h} != 906mm`);
  assert.ok(media.h > media.w, 'must be portrait');
  // Trim = 700×900 mm
  assert.ok(Math.abs(trim.w - 1984.25) < 4, `TrimBox width ${trim.w} != 70cm`);
  assert.ok(Math.abs(trim.h - 2551.18) < 4, `TrimBox height ${trim.h} != 90cm`);
  assert.ok(Math.abs(trim.x1 - 8.50) < 1.2, `TrimBox inset-x ${trim.x1} != 3mm`);
  assert.ok(Math.abs(trim.y1 - 8.50) < 1.2, `TrimBox inset-y ${trim.y1} != 3mm`);
  assert.ok(Math.abs(bleed.w - media.w) < 2 && Math.abs(bleed.h - media.h) < 2, 'BleedBox should match MediaBox');
});

test('8. Build target is 70x90 only', () => {
  const pkg = fs.readFileSync('package.json', 'utf8');
  assert.ok(pkg.includes('DustGuard_70x90.pdf'), 'package.json must build 70x90');
  assert.ok(!pkg.includes('DustGuard_90x70.pdf'), 'package.json must not build 90x70');
  const dpi = pkg.match(/pdftoppm -png -r (\d+)/);
  assert.ok(dpi, 'poster:build must set pdftoppm dpi');
  const n = Number(dpi[1]);
  assert.ok(n >= 150 && n <= 200, `preview dpi ${n} must be 150–200`);
});

test('9. R5 layout locks (people, screenshots, no matrix)', () => {
  const heroEnd = typst.indexOf('ZONES 01 + 02');
  const zone3 = typst.indexOf('ZONE 03');
  const zone45 = typst.indexOf('ZONES 04 + 05');
  assert.ok(heroEnd > 0 && zone3 > heroEnd && zone45 > zone3, 'zone markers missing');
  const hero = typst.slice(0, heroEnd);
  const z12 = typst.slice(heroEnd, zone3);
  const z3 = typst.slice(zone3, zone45);
  const rest = typst.slice(zone45);
  // The cast feeds the hero flow and reappears at illustration scale in zone 2;
  // both take their file paths from content.yml.
  assert.ok(hero.includes('hero.actor_figures'), 'hero flow needs the youth/community/officer cluster');
  assert.ok(hero.includes('assets/brand/dustguard-shield-logo.png'), 'hero needs brand shield');
  assert.ok(hero.includes('assets/diagrams/hero-scene.svg'), 'hero needs its low-opacity vector scene');
  assert.ok(!hero.includes('assets/screenshots/'), 'no UI crops in hero');
  assert.ok(z12.includes('actor.figure'), 'zone 2 needs full-size actor illustrations, not line icons');
  for (const fig of ['youth-volunteer', 'citizen', 'inspector']) {
    assert.ok(content.includes(`assets/people/${fig}.svg`), `actor figure ${fig} must be declared in content.yml`);
  }
  assert.ok(content.includes('assets/icons/users-group.svg'), 'icon paths live in content.yml');
  assert.ok(!rest.includes('assets/people/') && !rest.includes('actor.figure'), 'no people figures after zone 3');
  assert.ok(z3.includes('shot-frame'), 'screenshots only belong in zone 3');
  assert.ok(!rest.includes('assets/screenshots/') && !rest.includes('shot-frame'), 'no screenshots outside zone 3');
  assert.ok(content.includes('assets/screenshots/ui-citizen-report.png'), 'screenshot files live in content.yml');
  // "Hồ sơ cán bộ" is only honest against the real /staff/cases/:id capture.
  // The staff *list* shot was a login wall, so it must never carry that label.
  if (content.toLowerCase().includes('hồ sơ cán bộ')) {
    assert.ok(
      content.includes('assets/screenshots/ui-staff-case.png'),
      'the staff dossier label requires the real /staff/cases/:id capture',
    );
    assert.ok(
      !content.includes('assets/screenshots/ui-staff-operations.png'),
      'do not label the staff list / login wall as a staff dossier',
    );
  }
  const hay = `${content}\n${typst}`.toLowerCase();
  for (const phrase of ['competitor', 'benchmark matrix', 'đối thủ', 'ma trận so sánh']) {
    assert.ok(!hay.includes(phrase), `omit competitor matrix: found ${phrase}`);
  }
  assert.ok(theme.includes('#9f0d0c'), 'seal must match sampled logo red');
  assert.ok(!theme.includes('#B51F24'), 'theme must not keep fallback #B51F24 after logo sample');
});

test('12. Hero states the thesis and does NOT repeat the zone-03 workflow', () => {
  // R7 anti-duplication lock. The hero used to carry the same five loop steps
  // as the zone-03 legend, so a judge read the poster twice for one idea.
  // The hero is now a four-node thesis; the five-step workflow lives once.
  assert.ok(!content.includes('badge_strip:'), 'hero.badge_strip (the duplicated 5-step loop) must be gone');
  assert.ok(content.includes('thesis:'), 'hero must declare hero.thesis');
  assert.ok(typst.includes('data.hero.thesis'), 'poster.typ must render hero.thesis');

  const thesis = content.slice(content.indexOf('  thesis:'), content.indexOf('zone1_problem:'));
  const nodes = thesis.match(/^\s{4}- label:/gm) ?? [];
  assert.equal(nodes.length, 4, `hero thesis must have exactly 4 nodes, got ${nodes.length}`);

  const steps = content.slice(content.indexOf('  steps:'), content.indexOf('  screenshots:'));
  const stepTitles = [...steps.matchAll(/title: "([^"]+)"/g)].map((m) => m[1]);
  assert.equal(stepTitles.length, 5, `zone 03 must keep 5 workflow steps, got ${stepTitles.length}`);
  for (const title of stepTitles) {
    assert.ok(
      !thesis.toLowerCase().includes(title.toLowerCase()),
      `hero thesis must not repeat the zone-03 step "${title}"`,
    );
  }
});

test('13. R7 hierarchy + border diet locks', () => {
  // Zone 06 is a *proposed* pilot, never a reported one, and the sheet splits
  // what exists from what is proposed instead of running them into one line.
  assert.ok(content.includes('KHẢ THI & PILOT ĐỀ XUẤT'), 'zone 06 title must say PILOT ĐỀ XUẤT');
  assert.ok(content.includes('status_now:') && content.includes('status_next:'), 'zone 06 needs the ĐÃ CÓ / BƯỚC TIẾP THEO split');
  assert.ok(content.includes('Nguyên mẫu kiểm chứng kỹ thuật'), 'the ĐÃ CÓ half must claim a prototype only');
  assert.ok(/status_next:\s*"Pilot thực địa/.test(content), 'the BƯỚC TIẾP THEO half must name the pilot as the next step');
  assert.ok(typst.includes('status_next'), 'poster.typ must render the zone-06 split');

  // Timeline is five blocks, not an eight-column Gantt plus a phase ribbon.
  assert.ok(!content.includes('  weeks:\n'), 'the T1..T8 week ribbon must be gone');
  assert.ok(!content.includes('span:'), 'phase spans belonged to the old Gantt');
  const timeline = content.slice(content.indexOf('  timeline:'), content.indexOf('zone7_tech:'));
  const blocks = timeline.match(/^\s{4}- weeks:/gm) ?? [];
  assert.equal(blocks.length, 5, `timeline must be 5 blocks, got ${blocks.length}`);

  // The 87 example must be unmistakably an example, on the gauge.
  assert.ok(content.includes('score_badge:'), 'gauge needs an explicit example badge');
  assert.ok(/score_badge:\s*"HỒ SƠ MINH HỌA"/.test(content), 'example badge copy must be the full-size HỒ SƠ MINH HỌA');
  const gauge = fs.readFileSync('poster/assets/diagrams/score-gauge.svg', 'utf8');
  const arc = gauge.slice(gauge.indexOf('<!-- value arc'), gauge.indexOf('<!-- value knob'));
  assert.ok(!arc.includes('#9f0d0c'), 'the value arc must not be seal red — red reads as "violation"');
  assert.ok(gauge.includes('#9f0d0c'), 'the 87 marker knob must still be seal red');

  // Zone 05 is one sequence, not two parallel AI | HUMAN branches.
  assert.ok(diagrams.includes('case-note:'), 'hitl-diagram must take the sequential case note');
  assert.ok(!diagrams.includes('let lane('), 'the parallel AI / human lanes must be gone');
  assert.ok(!diagrams.includes('merge-y'), 'the merge bus belonged to the parallel version');

  // Border diet: no grey header band, and the chrome that whitespace already
  // separates does not get an outline as well.
  assert.ok(!theme.includes('c-head-bg'), 'grey section header band must be gone');
  // Count design chrome only: the eight crop marks live in the bleed and are a
  // print-shop requirement, not something a judge sees.
  const marksStart = theme.indexOf('#let print-crop-marks');
  const marksEnd = theme.indexOf('// ---', marksStart);
  const themeChrome = theme.slice(0, marksStart) + theme.slice(marksEnd);
  const strokes = (`${typst}\n${themeChrome}\n${diagrams}`.match(/stroke:/g) ?? []).length;
  assert.ok(strokes <= 22, `too much chrome: ${strokes} stroke declarations (R7 budget is 22)`);
});

test('10. Preview PNG is ~150–200 dpi', () => {
  assert.ok(fs.existsSync(PREVIEW), 'preview missing');
  const identify = execSync(`identify -format "%w %h" "${PREVIEW}"`, { encoding: 'utf8' }).trim();
  const [pw, ph] = identify.split(' ').map(Number);
  assert.ok(pw > 0 && ph > 0, `cannot read preview size: ${identify}`);
  const dpiX = pw / (706 / 25.4);
  const dpiY = ph / (906 / 25.4);
  assert.ok(dpiX >= 145 && dpiX <= 210, `preview x-dpi ${dpiX.toFixed(1)} not in 150–200`);
  assert.ok(dpiY >= 145 && dpiY <= 210, `preview y-dpi ${dpiY.toFixed(1)} not in 150–200`);
});

test('11. Visual-storytelling locks (diagrams carry the sections, not text cards)', () => {
  for (const builder of ['fragmentation-diagram', 'hitl-diagram', 'arch-diagram', 'shot-frame', 'step-marker']) {
    assert.ok(diagrams.includes(`#let ${builder}`), `diagrams.typ missing ${builder}`);
    assert.ok(typst.includes(builder), `poster.typ must use ${builder}`);
  }
  for (const svg of [
    'poster/assets/diagrams/hero-scene.svg',
    'poster/assets/diagrams/score-gauge.svg',
    'poster/assets/diagrams/iot-exploded.svg',
    'poster/assets/diagrams/iot-node-isometric.svg',
  ]) {
    assert.ok(fs.existsSync(svg), `missing ${svg}`);
    // Diagram art stays text-free so content.yml remains the only source of
    // visible strings; labels are typeset on top in Typst.
    assert.ok(!/<text[\s>]/.test(fs.readFileSync(svg, 'utf8')), `${svg} must not bake in text`);
  }
  // Diagram builders must not hardcode Vietnamese copy.
  assert.ok(!/[àáâãèéêìíòóôõùúýăđĩũơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i.test(diagrams),
    'diagrams.typ must take every label from content.yml');
  assert.ok(!fs.existsSync(path.join(ROOT, 'poster/output/DustGuard_90x70.pdf')), 'stale 90×70 landscape PDF must be gone');
});

test('14. Wording gate — nothing on the sheet may claim AI enforcement or a run pilot', () => {
  // Substring bans plus one pattern ban. Whitelist below is the only escape
  // hatch: a phrase is allowed through ONLY when the sheet negates it, e.g.
  // "AI không kết luận vi phạm".
  const whitelist = [
    'AI không kết luận vi phạm, không xử phạt',
    'không phải kết luận vi phạm',
  ];
  const hay = `${content}\n${typst}\n${diagrams}`;
  let scrubbed = hay;
  for (const allowed of whitelist) scrubbed = scrubbed.split(allowed).join(' ');
  const lower = scrubbed.toLowerCase();

  const bannedPhrases = [
    'AI kết luận vi phạm',
    'AI xác định vi phạm',
    'AI xử phạt',
    'tự động xử lý vi phạm',
    'pilot thành công',
    'đã triển khai thực tế',
  ];
  for (const phrase of bannedPhrases) {
    assert.ok(!lower.includes(phrase.toLowerCase()), `banned wording: "${phrase}"`);
  }
  // "giảm ô nhiễm X%" and friends — any claimed pollution reduction figure.
  const reductionClaim = /gi[ảa]m\s+[^.\n]{0,24}?(ô nhi[ễe]m|b[ụu]i|pm\s?2\.?5)[^.\n]{0,24}?\d+\s*%/i;
  assert.ok(!reductionClaim.test(scrubbed), 'banned wording: a claimed "giảm ô nhiễm X%" figure');
  const reductionClaimAlt = /gi[ảa]m\s+\d+\s*%/i;
  assert.ok(!reductionClaimAlt.test(scrubbed), 'banned wording: a bare "giảm X%" claim');
});

test('15. Frozen copy locks (R8)', () => {
  assert.ok(/title: "CHỦ THỂ HÀNH ĐỘNG"/.test(content), 'zone 02 title is locked to CHỦ THỂ HÀNH ĐỘNG');
  assert.ok(!content.includes('AI KHÔNG HÀNH ĐỘNG MỘT MÌNH'), 'the old ambiguous zone-02 title must be gone');
  assert.ok(content.includes('công nghệ là công cụ hỗ trợ'), 'zone 02 subtitle locked');
  for (const verb of ['PHÁT HIỆN', 'BỔ SUNG', 'QUYẾT ĐỊNH']) {
    assert.ok(content.includes(`verb: "${verb}"`), `zone 02 actor verb ${verb} missing`);
  }
  // Timeline reads as weeks, not as an opaque T-code.
  const timeline = content.slice(content.indexOf('  timeline:'), content.indexOf('zone7_tech:'));
  assert.ok(/weeks: "TUẦN 1"/.test(timeline), 'timeline must spell out TUẦN');
  assert.ok(!/weeks: "T\d/.test(timeline), 'the T1 / T2–3 shorthand must be gone');
});

// ============================================================================
// RELEASE-ONLY GATES — hashes, print geometry, QR decode, thumbnails.
// Skipped in the dev loop on purpose; each one rasterises or hashes.
// ============================================================================
function pdfBoxes() {
  const info = execSync(`pdfinfo -box "${PDF}"`, { encoding: 'utf8' });
  const box = (name) => {
    const m = info.match(new RegExp(`${name}:\\s+([\\d.-]+)\\s+([\\d.-]+)\\s+([\\d.-]+)\\s+([\\d.-]+)`));
    assert.ok(m, `missing ${name} in:\n${info}`);
    return { x1: +m[1], y1: +m[2], w: +m[3] - +m[1], h: +m[4] - +m[2] };
  };
  return { media: box('MediaBox'), bleed: box('BleedBox'), trim: box('TrimBox') };
}

if (RELEASE) {
  console.log('\n--- release gates ---');
  const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'dg-poster-qa-'));

  test('R1. asset-manifest.yml — every embedded asset is declared and hash-matched', () => {
    const lines = fs.readFileSync(MANIFEST, 'utf8').split('\n');
    const entries = [];
    let cur = null;
    for (const line of lines) {
      const start = line.match(/^- id:\s*"([^"]+)"/);
      if (start) {
        if (cur) entries.push(cur);
        cur = { id: start[1] };
        continue;
      }
      const kv = line.match(/^\s+(file|source|source_url|license|sha256):\s*"?([^"]*)"?\s*$/);
      if (kv && cur) cur[kv[1]] = kv[2].trim();
    }
    if (cur) entries.push(cur);
    assert.ok(entries.length >= 30, `manifest looks truncated: ${entries.length} entries`);

    for (const e of entries) {
      for (const field of ['file', 'source', 'license', 'sha256']) {
        assert.ok(e[field], `${e.id}: missing ${field}`);
      }
      assert.ok(!/^https?:/i.test(e.file), `${e.id}: assets must be local, got ${e.file}`);
      assert.ok(!e.file.includes('/.source/'), `${e.id}: .source/ intermediates must not be hashed`);
      const abs = path.join(ROOT, 'poster', e.file);
      assert.ok(fs.existsSync(abs), `${e.id}: missing file ${e.file}`);
      const sha = crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
      assert.equal(sha, e.sha256, `${e.id}: sha256 drift on ${e.file}`);
    }

    // Everything the sheet actually embeds must be one of those entries.
    const declared = new Set(entries.map((e) => e.file));
    const referenced = new Set();
    for (const src of [content, typst, diagrams]) {
      for (const m of src.matchAll(/assets\/[A-Za-z0-9._\-/]+\.(?:svg|png|jpg|ttf)/g)) referenced.add(m[0]);
    }
    for (const ref of referenced) {
      if (ref.startsWith('assets/fonts/')) continue;
      assert.ok(declared.has(ref), `embedded asset not declared in the manifest: ${ref}`);
    }
  });

  test('R2. Print geometry — TrimBox 700×900 mm portrait, 3 mm bleed all round', () => {
    const { media, bleed, trim } = pdfBoxes();
    const mm = (v) => (v / 72) * 25.4;
    assert.ok(Math.abs(mm(trim.w) - 700) < 0.6, `TrimBox width ${mm(trim.w).toFixed(2)} mm != 700`);
    assert.ok(Math.abs(mm(trim.h) - 900) < 0.6, `TrimBox height ${mm(trim.h).toFixed(2)} mm != 900`);
    assert.ok(trim.h > trim.w, 'trim must be portrait');
    for (const [side, v] of [['left', mm(trim.x1)], ['bottom', mm(trim.y1)]]) {
      assert.ok(Math.abs(v - 3) < 0.3, `bleed ${side} ${v.toFixed(2)} mm != 3`);
    }
    assert.ok(Math.abs(mm(media.w - trim.w) - 6) < 0.3, 'bleed must be 3 mm on each side horizontally');
    assert.ok(Math.abs(mm(media.h - trim.h) - 6) < 0.3, 'bleed must be 3 mm on each side vertically');
    assert.ok(Math.abs(bleed.w - media.w) < 2 && Math.abs(bleed.h - media.h) < 2, 'BleedBox must match MediaBox');
  });

  test('R3. Minimum type — body ≥18pt, captions ≥14pt, section titles ≥26pt', () => {
    const token = (name) => {
      const m = theme.match(new RegExp(`#let ${name} = ([\\d.]+)pt`));
      assert.ok(m, `theme.typ missing ${name}`);
      return Number(m[1]);
    };
    assert.ok(token('text-body') >= 18, `text-body ${token('text-body')}pt < 18pt`);
    assert.ok(token('text-caption') >= 14, `text-caption ${token('text-caption')}pt < 14pt`);
    assert.ok(token('text-section') >= 26, `text-section ${token('text-section')}pt < 26pt`);

    // Nothing typeset from content.yml may fall under the 14 pt caption floor.
    // Screenshot pixels are out of scope — this scans Typst sizes only.
    for (const [name, src] of [['poster.typ', typst], ['diagrams.typ', diagrams]]) {
      const lines = src.split('\n');
      lines.forEach((line, i) => {
        const m = line.match(/size: ([\d.]+)pt/);
        if (!m) return;
        const exempt = lines.slice(Math.max(0, i - 3), i + 1).some((l) => l.includes('qa:type-exempt'));
        if (exempt) return;
        assert.ok(Number(m[1]) >= 14, `${name}:${i + 1} typesets ${m[1]}pt, below the 14pt floor`);
      });
    }
  });

  test('R4. Safe margin — nothing addressable sits on the trim edge', () => {
    const m = typst.match(/margin:\s*([\d.]+)cm/);
    assert.ok(m, 'poster.typ must set an explicit page margin');
    const marginMm = Number(m[1]) * 10;
    assert.ok(marginMm >= 10, `page margin ${marginMm} mm < 10 mm safe zone`);
    // The QR, the live URL, the wordmark and the footer metadata all live in
    // the normal content flow, so the page margin is their safe distance.
    assert.ok(typst.includes('assets/qr/qr-demo.svg'), 'QR must be inside the content flow');
    assert.ok(!typst.includes('place(top + left, dx: -'), 'nothing may be placed outside the content column');
    console.log(`         safe zone: ${marginMm} mm from trim on all four sides`);
  });

  test('R5. QR decodes at print size, scaled to A4, and from the preview PNG', () => {
    const want = (content.match(/live_url:\s*"([^"]+)"/) ?? [])[1];
    assert.ok(want, 'content.yml must declare meta.live_url');
    // 72 dpi = the PDF at 100 % of its own point size (hardest sampling),
    // 89 dpi ≈ the same sheet reduced to A4 width and printed at 300 dpi,
    // then the 175 dpi preview that goes into decks and thumbnails.
    const cases = [
      ['PDF @ 100% (72 dpi)', 72, null],
      ['PDF scaled to A4 (89 dpi)', 89, null],
      ['preview PNG (175 dpi)', null, PREVIEW],
    ];
    for (const [label, dpi, file] of cases) {
      let img = file;
      if (!img) {
        const base = path.join(TMP, `qr-${dpi}`);
        execSync(`pdftoppm -png -r ${dpi} -f 1 -l 1 "${PDF}" "${base}"`);
        img = `${base}-1.png`;
      }
      const out = execSync(`zbarimg -q --raw "${img}" 2>/dev/null || true`, { encoding: 'utf8' }).trim();
      const px = execSync(`identify -format "%w" "${img}"`, { encoding: 'utf8' }).trim();
      assert.ok(out.includes(want), `${label} (${px}px wide): QR decoded to "${out || '<nothing>'}", want ${want}`);
      console.log(`         ${label}: ${px}px wide → ${want}`);
    }
  });

  test('R6. Thumbnail test — 1200 / 600 / 300 px renders exist', () => {
    const dir = path.join(ROOT, 'poster/output/thumbs');
    fs.mkdirSync(dir, { recursive: true });
    for (const w of [1200, 600, 300]) {
      const out = path.join(dir, `DustGuard_thumb_${w}.png`);
      execSync(`magick "${PREVIEW}" -resize ${w}x -strip "${out}"`);
      assert.ok(fs.existsSync(out) && fs.statSync(out).size > 3000, `thumbnail ${w}px failed`);
      const size = execSync(`identify -format "%wx%h" "${out}"`, { encoding: 'utf8' }).trim();
      console.log(`         ${w}px → ${size} (${(fs.statSync(out).size / 1024).toFixed(0)} kB)`);
    }
    console.log('         legibility at 300px is a judgement call — recorded in poster/STATUS.md');
  });
}

console.log('\n--------------------------------------------------------');
if (failed === 0) {
  console.log(RELEASE
    ? 'ALL DEV + RELEASE QA CHECKS PASSED — 70×90 portrait poster is print-ready.'
    : 'ALL DEV QA CHECKS PASSED — run with --release before sending to print.');
  process.exit(0);
}
console.error(`${failed} QA CHECK(S) FAILED.`);
process.exit(1);
