import fs from 'node:fs';
import path from 'node:path';
import QRCode from 'qrcode';

const QR_DIR = path.resolve('poster/assets/qr');
fs.mkdirSync(QR_DIR, { recursive: true });

async function generateQr(url, filename, title) {
  const svgString = await QRCode.toString(url, {
    type: 'svg',
    margin: 1,
    color: {
      dark: '#231B14',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'M'
  });

  const outPath = path.join(QR_DIR, filename);
  fs.writeFileSync(outPath, svgString);
  console.log(`✅ Generated QR (${title}): ${filename}`);
}

await generateQr('https://dustguard.phamphunguyenhung.com/', 'qr-demo.svg', 'Live Demo');
