import fs from 'node:fs';
import path from 'node:path';

const SCREENSHOTS_DIR = path.resolve('poster/assets/screenshots');
const SOURCE_DIR = path.join(SCREENSHOTS_DIR, '.source');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
fs.mkdirSync(SOURCE_DIR, { recursive: true });

const PROD = 'https://dustguard.phamphunguyenhung.com';
const LOCAL = process.env.POSTER_CAPTURE_ORIGIN || '';

function looksLikeAuthWall(html) {
  const t = String(html || '').toLowerCase();
  return (
    t.includes('cannot get') ||
    t.includes('cannot GET') ||
    (t.includes('đăng nhập') &&
      (t.includes('mật khẩu') || t.includes('tiếp tục với google') || t.includes('chào mừng trở lại')))
  );
}

async function reachable(url) {
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(8000) });
    return res.ok || res.status === 401 || res.status === 403 || res.status === 200;
  } catch {
    return false;
  }
}

async function shot(page, out) {
  const main = await page.$('main');
  if (main) await main.screenshot({ path: out });
  else await page.screenshot({ path: out, fullPage: false });
}

async function loginViaDemoModal(page, origin) {
  await page.goto(`${origin}/login`, {
    waitUntil: 'domcontentloaded',
    timeout: 20000,
  }).catch(() => {});
  await page.waitForTimeout(1200);

  const demoBtn = page.getByText(/Trải nghiệm bản demo theo vai trò|Explore Demo Personas/i).first();
  if (await demoBtn.count()) {
    await demoBtn.click({ timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(600);
  }

  const staffCard = page.getByText(/Cán bộ thanh tra/i).first();
  if (await staffCard.count()) {
    await staffCard.click({ timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(2500);
    return !looksLikeAuthWall(await page.content());
  }
  return false;
}

async function loginViaApi(page, origin) {
  const passwords = ['123456', 'DustGuard@2026!', 'password123'];
  const emails = ['staff@dustguard.vn', 'admin@dustguard.vn'];
  for (const email of emails) {
    for (const password of passwords) {
      const res = await page.request.post(`${origin}/api/auth/login`, {
        data: { email, password },
        timeout: 10000,
      }).catch(() => null);
      if (res?.ok()) {
        const body = await res.json().catch(() => ({}));
        if (body?.token) {
          await page.goto(origin, { waitUntil: 'domcontentloaded' });
          await page.evaluate((t) => {
            localStorage.setItem('dustguard.auth.token', t);
            localStorage.setItem('auth_token', t);
          }, body.token).catch(() => {});
        }
        return true;
      }
    }
  }
  return false;
}

async function fetchFirstCaseId(page, origin) {
  const res = await page.request.get(`${origin}/api/cases?limit=5`, { timeout: 10000 }).catch(() => null);
  if (!res?.ok()) return null;
  const body = await res.json().catch(() => ({}));
  const items = body?.data?.items ?? body?.items ?? [];
  return items[0]?.id ?? null;
}

function saveShot(page, out) {
  const sourceOut = path.join(SOURCE_DIR, path.basename(out));
  return shot(page, out).then(() => {
    fs.copyFileSync(out, sourceOut);
    return out;
  });
}

const { chromium } = await import('playwright');

const origins = [];
if (LOCAL) origins.push(LOCAL.replace(/\/$/, ''));
if (await reachable(PROD)) origins.push(PROD);

if (!origins.length) {
  console.warn('No reachable origin. Keeping existing local screenshots.');
  process.exit(0);
}

console.log(`Capture origins: ${origins.join(' → ')}`);
let browser;
try {
  browser = await chromium.launch({ headless: true });
} catch (err) {
  console.warn(`Playwright launch failed (user-space only, no sudo): ${err.message}`);
  process.exit(0);
}

const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  locale: 'vi-VN',
});
const page = await context.newPage();

async function captureCitizen(origin) {
  const out = path.join(SCREENSHOTS_DIR, 'ui-citizen-report.png');
  // LAYOUT_FROZEN: zone-03 crops are locked — skip re-capture (see poster/FROZEN.md).
  if (fs.existsSync(out) && fs.statSync(out).size < 200_000) {
    console.log('SKIP citizen-report (frozen crop preserved)');
    return false;
  }
  await page.goto(`${origin}/citizen/report/new`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(1600);
  const html = await page.content();
  if (looksLikeAuthWall(html) && !html.includes('Bạn đang thấy vấn đề')) {
    console.warn('Citizen report hit auth wall — keep existing');
    return false;
  }
  await shot(page, out);
  console.log(`OK citizen-report (${fs.statSync(out).size} bytes)`);
  return true;
}

async function captureCommunity(origin) {
  const out = path.join(SCREENSHOTS_DIR, 'ui-community-actions.png');
  if (fs.existsSync(out) && fs.statSync(out).size < 200_000) {
    console.log('SKIP community (frozen crop preserved)');
    return false;
  }
  await page.goto(`${origin}/community`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(1600);
  const html = await page.content();
  if (looksLikeAuthWall(html) && !/nhiệm vụ|cộng đồng|clb/i.test(html)) {
    console.warn('Community hit auth wall — keep existing');
    return false;
  }
  await shot(page, out);
  console.log(`OK community (${fs.statSync(out).size} bytes)`);
  return true;
}

async function captureStaff(origin) {
  const listOut = path.join(SCREENSHOTS_DIR, 'ui-staff-operations.png');
  const caseOut = path.join(SCREENSHOTS_DIR, 'ui-staff-case.png');
  let captured = false;

  await page.goto(`${origin}/staff/cases`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(1200);
  let html = await page.content();

  if (looksLikeAuthWall(html)) {
    let loggedIn = await loginViaDemoModal(page, origin);
    if (!loggedIn) loggedIn = await loginViaApi(page, origin);
    if (!loggedIn) {
      console.warn('Staff auth blocked — demo modal + API login failed');
      return false;
    }
    await page.goto(`${origin}/staff/cases`, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(1800);
    html = await page.content();
  }

  if (!looksLikeAuthWall(html)) {
    await saveShot(page, listOut);
    console.log(`OK staff-list ${page.url()} (${fs.statSync(listOut).size} bytes)`);
    captured = true;
  }

  const caseLink = page.locator('a[href*="/staff/cases/"]').first();
  let caseId = null;
  if (await caseLink.count()) {
    const href = await caseLink.getAttribute('href');
    const m = href?.match(/\/staff\/cases\/([^/?]+)/);
    if (m) caseId = m[1];
  }
  if (!caseId) caseId = await fetchFirstCaseId(page, origin);

  if (caseId) {
    await page.goto(`${origin}/staff/cases/${caseId}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2200);
    html = await page.content();
    if (!looksLikeAuthWall(html)) {
      await saveShot(page, caseOut);
      console.log(`OK staff-case ${page.url()} (${fs.statSync(caseOut).size} bytes)`);
      captured = true;
    }
  } else {
    console.warn('No case ID found — staff-case screenshot skipped');
  }

  if (!captured) console.warn('Staff still on auth wall — keep existing');
  return captured;
}

let any = false;
for (const origin of origins) {
  try {
    any = (await captureCitizen(origin)) || any;
    any = (await captureCommunity(origin)) || any;
    any = (await captureStaff(origin)) || any;
    if (any) break;
  } catch (err) {
    console.warn(`Origin ${origin} failed: ${err.message}`);
  }
}

await browser.close();
if (!any) console.warn('No new captures. Existing screenshots retained.');
