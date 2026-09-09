import { chromium } from 'playwright';

async function verifyProdLogin() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  console.log('Navigating to production login...');
  await page.goto('https://dustguard.phamphunguyenhung.com/login', { waitUntil: 'networkidle' });

  // Kiểm tra title
  console.log('Page title:', await page.title());

  // Kiểm tra khối tài khoản trải nghiệm
  const demoAccounts = await page.locator('text=Tài khoản trải nghiệm').isVisible();
  console.log('Demo accounts visible:', demoAccounts);

  // Click vào tài khoản Nguyễn Văn Dân
  const citizenCard = page.locator('text=Nguyễn Văn Dân').first();
  await citizenCard.click();
  console.log('Clicked citizen card');

  // Lấy email và password trong form
  const emailInput = page.locator('input[type="text"]').first();
  const passInput = page.locator('input[type="password"]').first();
  const emailVal = await emailInput.inputValue();
  const passVal = await passInput.inputValue();
  console.log('Form inputs:', { emailVal, passLength: passVal.length });

  // Chụp ảnh trước khi đăng nhập để kiểm tra giao diện thẻ tài khoản trải nghiệm
  await page.screenshot({ path: 'scripts/prod_demo_cards.png' });

  // Bấm Đăng nhập
  const submitBtn = page.locator('button[type="submit"]').first();
  await submitBtn.click();

  // Chờ chuyển hướng hoặc response
  await page.waitForTimeout(3000);
  console.log('URL after submit:', page.url());

  // Chụp ảnh kết quả
  await page.screenshot({ path: 'scripts/prod_login_result.png' });
  console.log('Saved screenshots.');

  await browser.close();
}

verifyProdLogin().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
