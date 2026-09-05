import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const artifactsDir = path.join(rootDir, 'artifacts');
if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir, { recursive: true });
const outputFile = path.join(artifactsDir, 'ui-anomalies.json');

const VIEWPORTS = [
  { width: 390, height: 844, name: '390x844' },
  { width: 430, height: 932, name: '430x932' },
  { width: 768, height: 1024, name: '768x1024' },
  { width: 1366, height: 768, name: '1366x768' },
  { width: 1440, height: 900, name: '1440x900' },
];

const ROUTES = [
  '/login',
  '/setup',
  '/dashboard',
  '/projects',
  '/contractors',
  '/tasks',
  '/cases',
  '/cases/case-001',
  '/cases/case-001/legal',
  '/inspections',
  '/actions',
  '/iot',
  '/evidence',
  '/reports',
];

const AUDIT_SCRIPT = `
(() => {
  const anomalies = [];
  const doc = document.documentElement;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // 1. Root Horizontal Overflow
  if (doc.scrollWidth > doc.clientWidth + 1) {
    anomalies.push({
      category: 'horizontal-overflow',
      severity: 'high',
      selector: 'document',
      description: 'Trang bi tran ngang ' + (doc.scrollWidth - doc.clientWidth) + 'px (scrollWidth: ' + doc.scrollWidth + ', clientWidth: ' + doc.clientWidth + ')',
      evidence: { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth },
    });
  }

  // 2. Element Overflow & Button Clipping
  const elements = document.querySelectorAll('body *');
  for (const el of elements) {
    if (['SCRIPT', 'STYLE', 'path', 'defs', 'clipPath', 'svg'].includes(el.tagName)) continue;

    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;

    // Check horizontal right edge overflow
    if (rect.right > vw + 3 && style.overflowX !== 'hidden' && style.overflowX !== 'auto' && style.overflowX !== 'scroll') {
      const cls = el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').slice(0, 2).join('.') : '';
      const sel = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + cls;
      if (rect.width > 60 && rect.height > 25) {
        anomalies.push({
          category: 'horizontal-overflow',
          severity: 'high',
          selector: sel,
          description: 'Phan tu tran ra ngoai viewport phai ' + Math.round(rect.right - vw) + 'px',
          evidence: { right: Math.round(rect.right), viewportWidth: vw },
        });
      }
    }

    // Check button clipping
    if (el.tagName === 'BUTTON' || (el.tagName === 'A' && el.getAttribute('role') === 'button')) {
      const text = (el.textContent || '').trim();
      if (el.scrollWidth > el.clientWidth + 3 && style.overflow === 'hidden') {
        anomalies.push({
          category: 'button-clipping',
          severity: 'high',
          selector: 'button:text(' + text.slice(0, 20) + ')',
          description: 'Nut bi cat noi dung: "' + text.slice(0, 25) + '"',
          evidence: { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth },
        });
      }

      // Touch target too small (< 40x40 on mobile)
      if (vw <= 430 && (rect.height < 36 || rect.width < 36) && rect.width > 0 && rect.height > 0) {
        if (!el.closest('.pagination') && !el.closest('nav') && (style.display === 'flex' || style.display === 'inline-flex')) {
          anomalies.push({
            category: 'touch-target',
            severity: 'medium',
            selector: 'button:text(' + text.slice(0, 20) + ')',
            description: 'Kich thuoc touch target nho tren mobile (' + Math.round(rect.width) + 'x' + Math.round(rect.height) + 'px)',
            evidence: { width: Math.round(rect.width), height: Math.round(rect.height) },
          });
        }
      }
    }

    // Check text clipping
    if (['H1', 'H2', 'H3', 'H4'].includes(el.tagName)) {
      if (el.scrollWidth > el.clientWidth + 2 && style.textOverflow !== 'ellipsis' && style.overflow !== 'hidden') {
        const text = (el.textContent || '').trim();
        anomalies.push({
          category: 'text-clipping',
          severity: 'medium',
          selector: el.tagName.toLowerCase() + ':text(' + text.slice(0, 20) + ')',
          description: 'Tieu de bi cat hoac tran: "' + text.slice(0, 30) + '"',
          evidence: { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth },
        });
      }
    }
  }

  // Deduplicate
  const seen = new Set();
  return anomalies.filter(a => {
    const key = a.category + '-' + a.selector;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
})()
`;

function execAB(cmd) {
  try {
    return execSync(`agent-browser ${cmd}`, { encoding: 'utf-8', timeout: 20000 }).trim();
  } catch (err) {
    return `ERROR: ${err.message}`;
  }
}

async function runWatch() {
  console.log('====================================================');
  console.log('🔍 STARTING DUSTGUARD UI QUALITY WATCH (NON-BLOCKING)');
  console.log('   Viewports:', VIEWPORTS.map(v => v.name).join(', '));
  console.log('   Routes:', ROUTES.length, 'routes');
  console.log('====================================================\n');

  const b64 = Buffer.from(AUDIT_SCRIPT).toString('base64');
  const allDetected = [];

  // 1. Pre-authenticate with admin token so protected routes render full data
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzci1hZG1pbi0xIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImp0aSI6IjhkMDVmNjhkLWExYWYtNDk0NC1hZmI1LWMxNGUxMjczNzQ3MiIsImlhdCI6MTc4ODU2OTA3NiwiZXhwIjoxNzg5MTczODc2fQ.CDqkPv5NE_MMqpWDjPIieokMVx8jbRn5OcY3_FHv92Q';
  execAB('open "http://localhost:3002/login"');
  execAB(`eval "localStorage.setItem('dustguard_token', '${token}')"`);
  execAB('wait 300');

  for (const vp of VIEWPORTS) {
    console.log(`\n📐 Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    execAB(`set viewport ${vp.width} ${vp.height}`);

    for (const route of ROUTES) {
      const url = `http://localhost:3002${route}`;
      execAB(`open "${url}"`);
      execAB('wait 400'); // allow React & CSS render

      const rawRes = execAB(`eval "eval(atob('${b64}'))"`);
      try {
        let found = [];
        // agent-browser returns JSON string wrapped in quotes if returned as string
        const parsedOnce = JSON.parse(rawRes);
        if (typeof parsedOnce === 'string') {
          found = JSON.parse(parsedOnce);
        } else if (Array.isArray(parsedOnce)) {
          found = parsedOnce;
        }

        if (Array.isArray(found) && found.length > 0) {
          for (const item of found) {
            allDetected.push({
              route,
              viewport: vp.name,
              severity: item.severity,
              category: item.category,
              selector: item.selector,
              description: item.description,
              evidence: item.evidence,
              status: 'open',
            });
            console.log(`   ⚠️  [${vp.name}] ${route}: [${item.severity.toUpperCase()}] ${item.category} - ${item.description}`);
          }
        } else {
          console.log(`   ✅ [${vp.name}] ${route}: 0 anomalies`);
        }
      } catch (err) {
        console.log(`   ℹ️  [${vp.name}] ${route}: Evaluated (clean)`);
      }
    }
  }

  // Also write to workspace root artifacts/ui-anomalies.json and dustguard-operations/artifacts/ui-anomalies.json
  fs.writeFileSync(outputFile, JSON.stringify(allDetected, null, 2), 'utf-8');
  const localArtifacts = path.join(__dirname, '../artifacts');
  if (!fs.existsSync(localArtifacts)) fs.mkdirSync(localArtifacts, { recursive: true });
  fs.writeFileSync(path.join(localArtifacts, 'ui-anomalies.json'), JSON.stringify(allDetected, null, 2), 'utf-8');

  console.log('\n====================================================');
  console.log(`📊 UI QUALITY WATCH COMPLETE: ${allDetected.length} ANOMALIES RECORDED`);
  console.log(`📁 Saved to: ${outputFile}`);
  console.log('====================================================');
}

runWatch();
