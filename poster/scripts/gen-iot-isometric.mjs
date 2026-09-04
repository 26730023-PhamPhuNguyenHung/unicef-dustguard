#!/usr/bin/env node
/** Generate poster/assets/diagrams/iot-node-isometric.svg — isometric exploded strip (text-free). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../assets/diagrams/iot-node-isometric.svg');

const cos = Math.cos(Math.PI / 6);
const sin = Math.sin(Math.PI / 6);
const ix = (x, y) => (x - y) * cos;
const iy = (x, y, z = 0) => (x + y) * sin - z;

function box(ox, oy, w, d, h) {
  const p = (x, y, z) => [ox + ix(x, y), oy + iy(x, y, z)];
  const pts = (arr) => arr.map(([x, y, z]) => p(x, y, z).map((n) => (+n).toFixed(2)).join(',')).join(' ');
  return {
    p,
    top: pts([[0, 0, h], [w, 0, h], [w, d, h], [0, d, h]]),
    left: pts([[0, 0, 0], [0, d, 0], [0, d, h], [0, 0, h]]),
    front: pts([[0, 0, 0], [w, 0, 0], [w, 0, h], [0, 0, h]]),
  };
}

function poly(points, fill, stroke = '#231B14', sw = 2.0) {
  const st = stroke === 'none' ? 'stroke="none"' : `stroke="${stroke}" stroke-width="${sw}"`;
  return `  <polygon points="${points}" fill="${fill}" ${st} stroke-linejoin="round"/>`;
}

function centredBox(cx, cy, w, d, h) {
  const ox = cx - ix(w / 2, d / 2);
  const oy = cy - iy(w / 2, d / 2);
  return { b: box(ox, oy, w, d, h), ox, oy };
}

function arrow(x1, x2, y) {
  out.push(`  <g stroke="#9f0d0c" stroke-width="2.4" stroke-dasharray="8 5" stroke-linecap="round" fill="none">`);
  out.push(`    <path d="M ${x1} ${y} L ${x2 - 10} ${y}"/>`);
  out.push(`  </g>`);
  out.push(`  <path d="M ${x2 - 12} ${y - 7} L ${x2} ${y} L ${x2 - 12} ${y + 7} Z" fill="#9f0d0c"/>`);
}

const W = 920;
const H = 210;
const centres = [115, 330, 545, 770];
const baseline = 125;
const out = [];

out.push(`<?xml version="1.0" encoding="UTF-8"?>`);
out.push(`<!-- DustGuard IoT node — isometric exploded strip (text-free).`);
out.push(`     Layers L→R: APM2000 · ESP32 · OLED · USB/Wi-Fi`);
out.push(`     Redrawn from IoT_Node.pdf / isometric style ref; team original vector.`);
out.push(`     Labels typeset in Typst from content.yml (zone7_tech.iot.stages). -->`);
out.push(`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">`);
out.push(`  <defs>`);
out.push(`    <linearGradient id="silTop" x1="0" y1="0" x2="1" y2="1">`);
out.push(`      <stop offset="0%" stop-color="#F4F0E8"/><stop offset="50%" stop-color="#D6D0C4"/><stop offset="100%" stop-color="#B4AD9F"/>`);
out.push(`    </linearGradient>`);
out.push(`    <linearGradient id="silL" x1="0" y1="0" x2="0" y2="1">`);
out.push(`      <stop offset="0%" stop-color="#C2BBB0"/><stop offset="100%" stop-color="#8A8378"/>`);
out.push(`    </linearGradient>`);
out.push(`    <linearGradient id="silF" x1="0" y1="0" x2="1" y2="1">`);
out.push(`      <stop offset="0%" stop-color="#E6E0D6"/><stop offset="100%" stop-color="#A49D90"/>`);
out.push(`    </linearGradient>`);
out.push(`  </defs>`);

// 1. APM2000
{
  const { b } = centredBox(centres[0], baseline, 82, 56, 28);
  out.push(`  <!-- 1. APM2000 -->`);
  out.push(poly(b.left, 'url(#silL)'));
  out.push(poly(b.front, 'url(#silF)'));
  out.push(poly(b.top, 'url(#silTop)'));
  const [acx, acy] = b.p(82 * 0.4, 56 * 0.45, 28);
  out.push(`  <ellipse cx="${acx.toFixed(2)}" cy="${acy.toFixed(2)}" rx="11" ry="6.4" fill="#8A8478" stroke="#231B14" stroke-width="1.6"/>`);
  out.push(`  <ellipse cx="${acx.toFixed(2)}" cy="${(acy - 1.5).toFixed(2)}" rx="6.2" ry="3.6" fill="#231B14"/>`);
  const [s1x, s1y] = b.p(82 * 0.2, 0, 28 * 0.45);
  const [s2x, s2y] = b.p(82 * 0.8, 0, 28 * 0.45);
  out.push(`  <line x1="${s1x.toFixed(2)}" y1="${s1y.toFixed(2)}" x2="${s2x.toFixed(2)}" y2="${s2y.toFixed(2)}" stroke="#231B14" stroke-width="2.8" stroke-linecap="round"/>`);
  for (const zz of [12, 19, 26]) {
    const [vx, vy] = b.p(0, 56 * 0.5, zz);
    out.push(`  <circle cx="${vx.toFixed(2)}" cy="${vy.toFixed(2)}" r="1.7" fill="#6E685E"/>`);
  }
}
arrow(188, 250, 118);

// 2. ESP32
{
  const w = 96;
  const d = 56;
  const h = 9;
  const { b, ox, oy } = centredBox(centres[1], baseline + 4, w, d, h);
  out.push(`  <!-- 2. ESP32 -->`);
  out.push(poly(b.left, '#084840'));
  out.push(poly(b.front, '#0A5A52'));
  out.push(poly(b.top, '#0D6F64'));
  const mw = 40;
  const md = 32;
  const mh = 7;
  const m = box(ox + ix(12, 10), oy + iy(12, 10, h), mw, md, mh);
  out.push(poly(m.left, '#14110E'));
  out.push(poly(m.front, '#2C241C'));
  out.push(poly(m.top, '#231B14'));
  const [a1x, a1y] = m.p(mw * 0.12, md * 0.22, mh);
  const [a2x, a2y] = m.p(mw * 0.88, md * 0.22, mh);
  const [a3x, a3y] = m.p(mw * 0.88, md * 0.58, mh);
  out.push(`  <path d="M ${a1x.toFixed(2)} ${a1y.toFixed(2)} L ${a2x.toFixed(2)} ${a2y.toFixed(2)} L ${a3x.toFixed(2)} ${a3y.toFixed(2)}" fill="none" stroke="#FDFBF7" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`);
  for (const [lx, ly] of [[58, 12], [70, 12], [82, 12], [58, 28], [70, 28], [82, 28], [58, 44], [82, 44]]) {
    const [px, py] = b.p(lx, ly, h + 0.7);
    out.push(`  <circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="2.2" fill="#DDD7CE"/>`);
  }
  for (let i = 0; i < 8; i++) {
    const [px, py] = b.p(6 + i * 11.5, d + 3, 2);
    out.push(`  <rect x="${(px - 1.4).toFixed(2)}" y="${(py - 1.4).toFixed(2)}" width="2.8" height="2.8" fill="#C9C3B8" stroke="#231B14" stroke-width="0.7"/>`);
  }
  const [u1x, u1y] = b.p(w * 0.78, 0, h * 0.4);
  const [u2x, u2y] = b.p(w * 0.96, 0, h * 0.4);
  out.push(`  <line x1="${u1x.toFixed(2)}" y1="${u1y.toFixed(2)}" x2="${u2x.toFixed(2)}" y2="${u2y.toFixed(2)}" stroke="#FDFBF7" stroke-width="3.4" stroke-linecap="round"/>`);
}
arrow(408, 470, 122);

// 3. OLED
{
  const w = 88;
  const d = 52;
  const h = 8;
  const { b } = centredBox(centres[2], baseline + 4, w, d, h);
  out.push(`  <!-- 3. OLED -->`);
  out.push(poly(b.left, '#084840'));
  out.push(poly(b.front, '#0A5A52'));
  out.push(poly(b.top, '#0D6F64'));
  const sw = 58;
  const sd = 32;
  const sx0 = 15;
  const sy0 = 10;
  const screen = [b.p(sx0, sy0, h + 0.5), b.p(sx0 + sw, sy0, h + 0.5), b.p(sx0 + sw, sy0 + sd, h + 0.5), b.p(sx0, sy0 + sd, h + 0.5)]
    .map((p) => p.map((n) => n.toFixed(2)).join(',')).join(' ');
  out.push(poly(screen, '#14110E', '#231B14', 1.6));
  // small cyan specular (left edge only — must stay subordinate to dark glass)
  const refl = [b.p(sx0 + 2, sy0 + 3, h + 1), b.p(sx0 + 11, sy0 + 3, h + 1), b.p(sx0 + 11, sy0 + sd - 3, h + 1), b.p(sx0 + 2, sy0 + sd - 3, h + 1)]
    .map((p) => p.map((n) => n.toFixed(2)).join(',')).join(' ');
  out.push(poly(refl, '#4EC4BA', 'none'));
  for (let i = 0; i < 3; i++) {
    const yy = sy0 + 10 + i * 6;
    const [x1, y1] = b.p(sx0 + 18, yy, h + 0.9);
    const [x2, y2] = b.p(sx0 + 52, yy, h + 0.9);
    out.push(`  <line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="#2A4A46" stroke-width="1.3" stroke-linecap="round"/>`);
  }
}
arrow(622, 684, 122);

// 4. USB · Wi-Fi
{
  out.push(`  <!-- 4. USB · Wi-Fi -->`);
  const wx = 720;
  const wy = 95;
  out.push(`  <circle cx="${wx}" cy="${wy}" r="4.5" fill="#0D6F64"/>`);
  out.push(`  <path d="M ${wx - 15} ${wy - 9} Q ${wx} ${wy - 24} ${wx + 15} ${wy - 9}" fill="none" stroke="#0D6F64" stroke-width="2.8" stroke-linecap="round"/>`);
  out.push(`  <path d="M ${wx - 24} ${wy - 18} Q ${wx} ${wy - 42} ${wx + 24} ${wy - 18}" fill="none" stroke="#0D6F64" stroke-width="2.8" stroke-linecap="round"/>`);
  out.push(`  <path d="M ${wx - 33} ${wy - 27} Q ${wx} ${wy - 60} ${wx + 33} ${wy - 27}" fill="none" stroke="#0D6F64" stroke-width="2.8" stroke-linecap="round"/>`);
  out.push(`  <path d="M 742 120 C 752 142, 772 148, 786 132 S 802 110, 816 128 S 828 158, 800 164" fill="none" stroke="#231B14" stroke-width="3.8" stroke-linecap="round"/>`);
  const { b } = centredBox(830, 155, 36, 17, 11);
  out.push(poly(b.left, '#9A9488'));
  out.push(poly(b.front, '#C4BEB2'));
  out.push(poly(b.top, '#EDE9E2'));
  const tongue = [b.p(37, 17 * 0.22, 11 * 0.4), b.p(52, 17 * 0.22, 11 * 0.4), b.p(52, 17 * 0.78, 11 * 0.4), b.p(37, 17 * 0.78, 11 * 0.4)]
    .map((p) => p.map((n) => n.toFixed(2)).join(',')).join(' ');
  out.push(poly(tongue, '#8A8478'));
}

out.push(`</svg>`);
fs.writeFileSync(OUT, `${out.join('\n')}\n`);
console.log('wrote', OUT);
