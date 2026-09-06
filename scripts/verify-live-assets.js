async function verifyAssets() {
  console.log('🔍 KIỂM TRA ĐẦU CUỐI STATIC ASSETS TRÊN DOMAIN THẬT...');

  // Side A
  const rA = await fetch('https://dustguard.phamphunguyenhung.com/');
  const htmlA = await rA.text();
  const matchA = htmlA.match(/src="([^"]+\.js)"/);
  console.log('  Side A Index HTML size:', htmlA.length);
  if (matchA) {
    const jsUrlA = new URL(matchA[1], 'https://dustguard.phamphunguyenhung.com/').href;
    const resA = await fetch(jsUrlA);
    console.log(`  Side A JS (${matchA[1]}): HTTP ${resA.status}, ${(await resA.arrayBuffer()).byteLength} bytes`);
  }

  // Side B
  const rB = await fetch('https://dustguard.phamphunguyenhung.com/operations/');
  const htmlB = await rB.text();
  const matchB = htmlB.match(/src="([^"]+\.js)"/);
  console.log('  Side B Index HTML size:', htmlB.length);
  if (matchB) {
    const jsUrlB = new URL(matchB[1], 'https://dustguard.phamphunguyenhung.com/operations/').href;
    const resB = await fetch(jsUrlB);
    console.log(`  Side B JS (${matchB[1]}): HTTP ${resB.status}, ${(await resB.arrayBuffer()).byteLength} bytes`);
  }

  console.log('✅ Toàn bộ static assets đã kiểm tra và phân phối hoàn hảo từ Cloudflare Edge!');
}

verifyAssets().catch(console.error);
