import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/ppnh1/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core');

const BASE_URL = 'https://dustguard.phamphunguyenhung.com';

async function findOverflow() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 360, height: 800 } });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

  const overflows = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const elements = document.querySelectorAll('*');
    const culprits = [];

    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 1 || el.scrollWidth > docWidth + 1) {
        culprits.push({
          tagName: el.tagName,
          id: el.id,
          className: (el.className && typeof el.className === 'string') ? el.className.slice(0, 100) : '',
          rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) },
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
          text: (el.innerText || '').slice(0, 50).replace(/\n/g, ' ')
        });
      }
    });

    return { docWidth, culprits: culprits.slice(0, 15) };
  });

  console.log('Doc Width:', overflows.docWidth);
  console.log('Found culprits count:', overflows.culprits.length);
  console.log(JSON.stringify(overflows.culprits, null, 2));

  await browser.close();
}

findOverflow().catch(console.error);
