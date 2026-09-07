import { chromium } from 'playwright';

async function testLogin() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  
  console.log('Navigating to http://localhost:3000/login...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  
  // Click on the demo card for Nguyen Van Dan
  console.log('Clicking demo card for citizen@dustguard.local...');
  const card = page.locator('text=Nguyễn Văn Dân').first();
  await card.click();
  await page.waitForTimeout(500);

  // Check email and password field values
  const emailVal = await page.locator('#input-community-email').inputValue();
  const passVal = await page.locator('#input-community-password').inputValue();
  console.log('Form filled with:', emailVal, passVal ? '***filled (' + passVal.length + ' chars)***' : 'empty');

  // Click submit
  console.log('Clicking submit button...');
  await page.locator('#btn-community-login').click();

  // Wait for navigation or error
  await page.waitForTimeout(2500);

  const currentUrl = page.url();
  console.log('Current URL after submit:', currentUrl);

  const errorAlert = await page.locator('.text-red-800, [role="alert"]').allInnerTexts();
  console.log('Error alerts on page:', errorAlert);

  await page.screenshot({ path: 'artifacts/login-citizen-success.png' });
  console.log('Screenshot saved to artifacts/login-citizen-success.png');

  await browser.close();
}

testLogin().catch(console.error);
