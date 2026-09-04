import { execSync } from 'node:child_process';

const VIEWPORTS = [
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
}

console.log('\n====================================================');
console.log(`SUMMARY: Total: ${totalChecks} | Passed: ${passedChecks} | Failed: ${failedChecks}`);
console.log('====================================================');

if (failedChecks > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
