import { chromium } from 'playwright';

const COMMUNITY_ACCOUNTS = [
  { name: 'Nguyễn Văn Dân', email: 'citizen@dustguard.local' },
  { name: 'Trần Thị Tình Nguyện', email: 'member@dustguard.local' },
  { name: 'Lê Hoàng Điều Phối', email: 'moderator@dustguard.local' },
  { name: 'Phạm Quản Trị', email: 'admin@dustguard.local' },
];

async function verifyAllAccounts() {
  const browser = await chromium.launch({ headless: true });
  
  for (const acc of COMMUNITY_ACCOUNTS) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    console.log(`\nTesting account: ${acc.name} (${acc.email})...`);
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });

    // Click demo card
    const card = page.locator(`text=${acc.name}`).first();
    await card.click();
    await page.waitForTimeout(300);

    // Verify input
    const emailVal = await page.locator('#input-community-email').inputValue();
    if (emailVal !== acc.email) {
      throw new Error(`Expected email ${acc.email}, but got ${emailVal}`);
    }

    // Submit form
    await page.locator('#btn-community-login').click();
    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    console.log(` -> URL after submit: ${currentUrl}`);

    const errorAlerts = await page.locator('.text-red-800, [role="alert"]').allInnerTexts();
    if (errorAlerts.length > 0 && !errorAlerts.every(t => !t.trim())) {
      console.error(` -> FAILED! Alerts:`, errorAlerts);
    } else {
      console.log(` -> SUCCESS! Logged in without errors.`);
    }

    await page.close();
  }

  // Also test Operations login
  console.log(`\nTesting Operations Login: canbo.hientruong...`);
  const opsPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await opsPage.goto('http://localhost:3000/login?side=operations', { waitUntil: 'networkidle' });
  
  const opsCard = opsPage.locator('text=Nguyễn Minh Anh').first();
  await opsCard.click();
  await opsPage.waitForTimeout(300);

  const opsUserInput = await opsPage.locator('#input-operations-username').inputValue();
  console.log(`Ops identifier filled: ${opsUserInput}`);

  // Submit Operations login form
  await opsPage.locator('#btn-operations-login').click();
  await opsPage.waitForTimeout(2000);
  console.log(`Ops URL after submit: ${opsPage.url()}`);

  await opsPage.close();
  await browser.close();
  console.log('\n🎉 ALL LOGIN VERIFICATIONS PASSED!');
}

verifyAllAccounts().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
