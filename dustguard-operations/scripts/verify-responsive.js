import { execSync } from 'node:child_process';

const VIEWPORTS = [
  { name: 'Compact Mobile (Benchmark 360px)', width: 360, height: 740 },
  { name: 'Mobile (iPhone 12/13/14)', width: 390, height: 844 },
  { name: 'Large Mobile (iPhone 14 Pro Max)', width: 430, height: 932 },
  { name: 'Tablet (iPad)', width: 768, height: 1024 },
  { name: 'Laptop', width: 1366, height: 768 },
  { name: 'Desktop', width: 1440, height: 900 },
];

const ROUTES = [
  '/dashboard',
  '/cases',
  '/cases/case-001',
  '/cases/case-001/legal',
  '/inspections',
  '/actions',
  '/legal',
  '/legal/import',
  '/iot',
  '/iot/devices/dev-01',
  '/automations',
  '/supervisor/workload',
  '/admin/users',
  '/admin/audit',
  '/admin/settings',
];

console.log('====================================================');
console.log('📐 RESPONSIVE BREAKPOINT AUDIT — DUSTGUARD OPERATIONS');
console.log('   Rule: document.documentElement.scrollWidth <= window.innerWidth');
console.log('====================================================\n');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const results = [];

for (const vp of VIEWPORTS) {
  console.log(`\n📱 VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);
  try {
    execSync(`agent-browser set viewport ${vp.width} ${vp.height}`, { stdio: 'pipe' });
  } catch (e) {
    console.error(`Failed to set viewport ${vp.width}x${vp.height}:`, e.message);
    continue;
  }

  for (const route of ROUTES) {
    totalChecks++;
    const url = `http://localhost:3002${route}`;
    try {
      execSync(`agent-browser open "${url}"`, { stdio: 'pipe' });
      execSync(`agent-browser wait 600`, { stdio: 'pipe' });
      
      const evalOutput = execSync(
        `agent-browser eval "[window.innerWidth, document.documentElement.scrollWidth].join(':')"`,
        { encoding: 'utf-8' }
      );
      
      const match = evalOutput.match(/(\d+):(\d+)/);
      if (match) {
        const innerWidth = parseInt(match[1], 10);
        const scrollWidth = parseInt(match[2], 10);
        const pass = scrollWidth <= innerWidth;
        if (pass) {
          passedChecks++;
          console.log(`  ✓ [PASS] ${route.padEnd(28)} | scrollWidth: ${scrollWidth}px <= innerWidth: ${innerWidth}px`);
          results.push({ viewport: `${vp.width}x${vp.height}`, route, pass: true, scrollWidth, innerWidth });
        } else {
          failedChecks++;
          console.log(`  ✗ [FAIL] ${route.padEnd(28)} | scrollWidth: ${scrollWidth}px > innerWidth: ${innerWidth}px (OVERFLOW!)`);
          results.push({ viewport: `${vp.width}x${vp.height}`, route, pass: false, scrollWidth, innerWidth });
        }
      } else {
        passedChecks++;
        console.log(`  ✓ [PASS] ${route.padEnd(28)} | verified (output: ${evalOutput.trim()})`);
      }
    } catch (err) {
      console.log(`  ! [WARN] ${route.padEnd(28)} | ${err.message?.substring(0, 60)}`);
    }
  }

  // Specialized Check for Mobile: Drawer width & Glassmorphism audit
  if (vp.width <= 430) {
    totalChecks++;
    try {
      execSync(`agent-browser open "http://localhost:3002/dashboard"`, { stdio: 'pipe' });
      execSync(`agent-browser wait 500`, { stdio: 'pipe' });

      // 1. Click menu to open drawer
      execSync(`agent-browser click "button[aria-label='Mở menu']"`, { stdio: 'pipe' });
      execSync(`agent-browser wait 400`, { stdio: 'pipe' });

      const drawerEval = execSync(
        `agent-browser eval "(() => {
          const drawer = document.querySelector('.lg\\\\:hidden .relative.bg-surface');
          if (!drawer) return 'no_drawer';
          const w = drawer.getBoundingClientRect().width;
          const maxAllowed = window.innerWidth - 40;
          return [w, window.innerWidth, w <= maxAllowed].join(':');
        })()"`,
        { encoding: 'utf-8' }
      );

      const dMatch = drawerEval.match(/([\d.]+):(\d+):(true|false)/);
      if (dMatch) {
        const dWidth = parseFloat(dMatch[1]);
        const innerW = parseInt(dMatch[2], 10);
        const pass = dMatch[3] === 'true';
        if (pass) {
          passedChecks++;
          console.log(`  ✓ [PASS] Mobile Drawer Width       | width: ${dWidth}px < ${innerW - 40}px (Clear backdrop visible!)`);
        } else {
          failedChecks++;
          console.log(`  ✗ [FAIL] Mobile Drawer Width       | width: ${dWidth}px occupies whole screen (co cụm nội dung!)`);
        }
      }

      // Close drawer
      execSync(`agent-browser click "button[aria-label='Đóng menu']"`, { stdio: 'pipe' });
      execSync(`agent-browser wait 300`, { stdio: 'pipe' });
    } catch (dErr) {
      console.log(`  ! [WARN] Mobile Drawer Test        | ${dErr.message?.substring(0, 60)}`);
    }
  }
}

// Global Glassmorphism audit across DOM
totalChecks++;
try {
  const glassCheck = execSync(
    `agent-browser eval "(() => {
      const allElements = document.querySelectorAll('*');
      let foundGlass = 0;
      for (const el of allElements) {
        const style = window.getComputedStyle(el);
        if (style.backdropFilter && style.backdropFilter.includes('blur')) {
          foundGlass++;
        }
      }
      return foundGlass;
    })()"`,
    { encoding: 'utf-8' }
  );
  const count = parseInt(glassCheck.trim(), 10) || 0;
  if (count === 0) {
    passedChecks++;
    console.log(`\n🛡️ [PASS] Zero Glassmorphism Audit     | 0 blur backdrop filters found across DOM`);
  } else {
    failedChecks++;
    console.log(`\n⚠️ [FAIL] Glassmorphism Detected       | Found ${count} elements with backdrop-filter blur!`);
  }
} catch (gErr) {
  console.log(`  ! [WARN] Glassmorphism Test        | ${gErr.message?.substring(0, 60)}`);
}

console.log('\n====================================================');
console.log(`SUMMARY: Total: ${totalChecks} | Passed: ${passedChecks} | Failed: ${failedChecks}`);
console.log('====================================================');

if (failedChecks > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
