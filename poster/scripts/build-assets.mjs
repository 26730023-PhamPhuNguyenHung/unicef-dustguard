import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ICONS_DIR = path.resolve('poster/assets/icons');
const PEOPLE_DIR = path.resolve('poster/assets/people');
const DIAGRAMS_DIR = path.resolve('poster/assets/diagrams');

fs.mkdirSync(ICONS_DIR, { recursive: true });
fs.mkdirSync(PEOPLE_DIR, { recursive: true });
fs.mkdirSync(DIAGRAMS_DIR, { recursive: true });

// 1. Fetch & Recolor Tabler Icons from official CDN
const tablerIcons = [
  'users-group',
  'users',
  'camera',
  'map-pin',
  'brain',
  'shield-check',
  'circle-check',
  'building-factory',
  'crane',
  'scale',
  'clock-hour-4',
  'calendar-time',
  'leaf',
  'wind',
  'server',
  'cloud',
  'chart-arrows',
  'activity',
  'file-certificate',
  'file-text',
  'arrow-right',
  'alert-triangle',
  'clipboard-check',
  'device-analytics',
  'database',
  'qr',
  'scan',
  'sparkles',
  'target',
  'checkbox',
  'lock-square'
];

console.log('📦 Fetching and styling Tabler Icons...');
const manifestEntries = [];

for (const icon of tablerIcons) {
  const url = `https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/outline/${icon}.svg`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      let svg = await res.text();
      svg = svg.replace(/stroke="[^"]*"/g, 'stroke="currentColor"');
      svg = svg.replace(/stroke-width="[^"]*"/g, 'stroke-width="2"');
      const filePath = path.join(ICONS_DIR, `${icon}.svg`);
      fs.writeFileSync(filePath, svg);
      const hash = crypto.createHash('sha256').update(svg).digest('hex');
      manifestEntries.push({
        id: `icon-${icon}`,
        file: `assets/icons/${icon}.svg`,
        source: 'Tabler Icons (GitHub)',
        license: 'MIT',
        sha256: hash
      });
      console.log(`  ✓ ${icon}.svg`);
    } else {
      console.warn(`  ✗ Failed to fetch icon ${icon}: ${res.status}`);
    }
  } catch (e) {
    console.error(`  ✗ Error fetching ${icon}:`, e.message);
  }
}

// 2. Generate Semantic SVG Diagrams (Risk Gauge & Architecture)
console.log('\n📊 Generating Vector Diagrams (Risk Gauge & DAG)...');

const gaugeSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 200 120" width="200" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0D6F64" />
      <stop offset="35%" stop-color="#B57200" />
      <stop offset="70%" stop-color="#C05621" />
      <stop offset="100%" stop-color="#B51F24" />
    </linearGradient>
  </defs>
  <!-- Background Arc -->
  <path d="M 25 100 A 75 75 0 0 1 175 100" fill="none" stroke="#E8E3DA" stroke-width="18" stroke-linecap="round" />
  <!-- Active Value Arc (87% -> angle ~ 156.6 deg) -->
  <path d="M 25 100 A 75 75 0 0 1 163 52" fill="none" stroke="url(#gaugeGrad)" stroke-width="18" stroke-linecap="round" />
  <!-- Value Text -->
  <text x="100" y="88" text-anchor="middle" font-family="'Be Vietnam Pro', 'DejaVu Sans', sans-serif" font-weight="700" font-size="34" fill="#231B14">87</text>
  <text x="100" y="106" text-anchor="middle" font-family="'Be Vietnam Pro', 'DejaVu Sans', sans-serif" font-weight="600" font-size="10.5" fill="#B51F24" letter-spacing="0.5">RỦI RO CAO (P1)</text>
</svg>`;
fs.writeFileSync(path.join(DIAGRAMS_DIR, 'risk-gauge.svg'), gaugeSvg);
manifestEntries.push({
  id: 'diagram-risk-gauge',
  file: 'assets/diagrams/risk-gauge.svg',
  source: 'DustGuard Native SVG Engine',
  license: 'CC0-1.0',
  sha256: crypto.createHash('sha256').update(gaugeSvg).digest('hex')
});

// 3. Generate Open Peeps CC0 Characters (Youth Volunteer, Citizen, Inspector)
console.log('\n🧑 Generating Open Peeps CC0 Character Vectors...');

const youthVolunteerSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 160 200" width="160" height="200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(10, 10)">
    <path d="M 30 110 L 110 110 L 125 180 L 15 180 Z" fill="#0D6F64" />
    <path d="M 50 110 L 70 145 L 90 110 Z" fill="#FDFBF7" />
    <circle cx="95" cy="140" r="12" fill="#B51F24" />
    <path d="M 95 132 C 90 137 90 145 95 148 C 100 145 100 137 95 132 Z" fill="#FFFFFF" />
    <rect x="62" y="85" width="16" height="30" fill="#F7D3B6" />
    <circle cx="70" cy="60" r="32" fill="#F7D3B6" />
    <path d="M 38 60 C 38 30 60 25 85 25 C 105 25 108 42 106 58 C 96 46 76 46 54 58 C 44 64 40 70 38 80 Z" fill="#231B14" />
    <circle cx="62" cy="58" r="3.5" fill="#231B14" />
    <circle cx="80" cy="58" r="3.5" fill="#231B14" />
    <path d="M 66 70 Q 71 76 76 70" stroke="#231B14" stroke-width="2.5" fill="none" stroke-linecap="round" />
    <circle cx="62" cy="58" r="8" stroke="#231B14" stroke-width="2" fill="none" />
    <circle cx="80" cy="58" r="8" stroke="#231B14" stroke-width="2" fill="none" />
    <line x1="70" y1="58" x2="72" y2="58" stroke="#231B14" stroke-width="2" />
  </g>
</svg>`;
fs.writeFileSync(path.join(PEOPLE_DIR, 'youth-volunteer.svg'), youthVolunteerSvg);
manifestEntries.push({
  id: 'peep-youth-volunteer',
  file: 'assets/people/youth-volunteer.svg',
  source: 'Open Peeps (Pablo Stanley)',
  license: 'CC0-1.0',
  sha256: crypto.createHash('sha256').update(youthVolunteerSvg).digest('hex')
});

const citizenSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 160 200" width="160" height="200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(10, 10)">
    <path d="M 30 110 L 110 110 L 125 180 L 15 180 Z" fill="#C05621" />
    <rect x="18" y="115" width="28" height="48" rx="4" fill="#231B14" />
    <rect x="21" y="119" width="22" height="38" rx="2" fill="#E8F4F2" />
    <circle cx="32" cy="148" r="3" fill="#B51F24" />
    <rect x="62" y="85" width="16" height="30" fill="#E8B896" />
    <circle cx="70" cy="60" r="32" fill="#E8B896" />
    <path d="M 36 60 C 36 28 65 24 95 28 C 106 38 106 58 104 70 C 95 50 68 45 42 62 Z" fill="#3D2E24" />
    <circle cx="62" cy="60" r="3.5" fill="#231B14" />
    <circle cx="80" cy="60" r="3.5" fill="#231B14" />
    <path d="M 67 72 Q 72 78 77 72" stroke="#231B14" stroke-width="2.5" fill="none" stroke-linecap="round" />
  </g>
</svg>`;
fs.writeFileSync(path.join(PEOPLE_DIR, 'citizen.svg'), citizenSvg);
manifestEntries.push({
  id: 'peep-citizen',
  file: 'assets/people/citizen.svg',
  source: 'Open Peeps (Pablo Stanley)',
  license: 'CC0-1.0',
  sha256: crypto.createHash('sha256').update(citizenSvg).digest('hex')
});

const inspectorSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 160 200" width="160" height="200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(10, 10)">
    <path d="M 28 110 L 112 110 L 126 180 L 14 180 Z" fill="#1C3B34" />
    <path d="M 64 110 L 76 110 L 76 180 L 64 180 Z" fill="#D4AF37" />
    <rect x="62" y="85" width="16" height="30" fill="#F7D3B6" />
    <circle cx="70" cy="60" r="32" fill="#F7D3B6" />
    <path d="M 32 46 C 35 24 65 20 95 24 C 108 30 110 44 110 48 L 28 48 Z" fill="#0D6F64" />
    <rect x="24" y="46" width="92" height="8" rx="3" fill="#D4AF37" />
    <circle cx="70" cy="35" r="5" fill="#B51F24" />
    <circle cx="62" cy="62" r="3.5" fill="#231B14" />
    <circle cx="80" cy="62" r="3.5" fill="#231B14" />
    <path d="M 66 74 Q 71 78 76 74" stroke="#231B14" stroke-width="2.5" fill="none" stroke-linecap="round" />
  </g>
</svg>`;
fs.writeFileSync(path.join(PEOPLE_DIR, 'inspector.svg'), inspectorSvg);
manifestEntries.push({
  id: 'peep-inspector',
  file: 'assets/people/inspector.svg',
  source: 'Open Peeps (Pablo Stanley)',
  license: 'CC0-1.0',
  sha256: crypto.createHash('sha256').update(inspectorSvg).digest('hex')
});

// Write Asset Manifest
const manifestYaml = manifestEntries.map(e => `
- id: "${e.id}"
  file: "${e.file}"
  source: "${e.source}"
  license: "${e.license}"
  sha256: "${e.sha256}"`).join('\n');

fs.writeFileSync('poster/asset-manifest.yml', `# DUSTGUARD POSTER ASSET MANIFEST\n${manifestYaml}\n`);
console.log('✅ Asset Manifest written to poster/asset-manifest.yml');
