const sharp = require('sharp');
const path = require('path');

async function createPerfectLogos() {
  const inputPath = '/Users/anshbhatia/.gemini/antigravity/brain/aae4d7be-4e4f-4448-8dd5-613124a13e3d/.user_uploaded/media_1788016682464.jpg';
  const outDir = path.join(__dirname, '../public/images');

  console.log('Loading raw master logo:', inputPath);
  const image = sharp(inputPath);
  const meta = await image.metadata();

  // Extract raw RGBA
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // 1. Create WHITE & GOLD STACKED LOGO (FOR SPLASH SCREEN & DARK FOOTER)
  // Preserve exact original stacked layout (emblem on top, SANDLINE in middle, subtitle on bottom)
  const splashData = Buffer.from(data);

  for (let i = 0; i < splashData.length; i += channels) {
    const r = splashData[i];
    const g = splashData[i + 1];
    const b = splashData[i + 2];

    // Background is cream #F6EFE3 (~247, 239, 227)
    // Any pixel where r > 215, g > 205, b > 195 with low saturation is background
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const isBg = (r >= 210 && g >= 200 && b >= 190) && (maxVal - minVal < 35);

    if (isBg) {
      const avg = (r + g + b) / 3;
      if (avg > 230) {
        splashData[i + 3] = 0; // Transparent
      } else {
        const a = Math.max(0, Math.min(255, Math.round((235 - avg) * 22)));
        splashData[i + 3] = a;
      }
    } else {
      // It's foreground (Emblem, Sun, Text, or Subtitle)
      // Check if it's the gold sun or gold divider/arc:
      // Gold has higher red & green, low blue (e.g. 185, 135, 75)
      const isGold = (r > 130 && g > 90 && b < 105 && r > b + 30);
      if (isGold) {
        // Vibrant luxury gold
        splashData[i] = 232;
        splashData[i + 1] = 180;
        splashData[i + 2] = 100;
        splashData[i + 3] = 255;
      } else {
        // Pure crisp white for text & wave
        splashData[i] = 255;
        splashData[i + 1] = 255;
        splashData[i + 2] = 255;
        splashData[i + 3] = 255;
      }
    }
  }

  // Save the complete stacked white & gold logo for splash screen
  const splashMasterBuffer = await sharp(splashData, {
    raw: { width, height, channels }
  })
    .trim()
    .png({ quality: 100 })
    .toBuffer();

  await sharp(splashMasterBuffer)
    .toFile(path.join(outDir, 'logo-splash-master.png'));
  console.log('Saved perfect stacked logo-splash-master.png');

  await sharp(splashMasterBuffer)
    .toFile(path.join(outDir, 'logo-white-trimmed.png'));
  console.log('Saved logo-white-trimmed.png');

  // 2. Create ORIGINAL DARK & GOLD STACKED LOGO (TRANSPARENT BG)
  const darkStackedData = Buffer.from(data);
  for (let i = 0; i < darkStackedData.length; i += channels) {
    const r = darkStackedData[i];
    const g = darkStackedData[i + 1];
    const b = darkStackedData[i + 2];

    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const isBg = (r >= 210 && g >= 200 && b >= 190) && (maxVal - minVal < 35);

    if (isBg) {
      const avg = (r + g + b) / 3;
      if (avg > 230) {
        darkStackedData[i + 3] = 0;
      } else {
        const a = Math.max(0, Math.min(255, Math.round((235 - avg) * 22)));
        darkStackedData[i + 3] = a;
      }
    }
  }

  const darkStackedBuffer = await sharp(darkStackedData, {
    raw: { width, height, channels }
  })
    .trim()
    .png({ quality: 100 })
    .toBuffer();

  await sharp(darkStackedBuffer)
    .toFile(path.join(outDir, 'logo-stacked.png'));
  console.log('Saved logo-stacked.png');

  // 3. Create HORIZONTAL NAVBAR LOGO
  // Extract emblem (top 55%)
  const darkMeta = await sharp(darkStackedBuffer).metadata();
  const emblemH = Math.round(darkMeta.height * 0.55);
  const emblem = await sharp(darkStackedBuffer)
    .extract({ left: 0, top: 0, width: darkMeta.width, height: emblemH })
    .trim()
    .toBuffer();

  // Extract wordmark (bottom 45%)
  const wordmarkTop = Math.round(darkMeta.height * 0.54);
  const wordmarkH = darkMeta.height - wordmarkTop;
  const wordmark = await sharp(darkStackedBuffer)
    .extract({ left: 0, top: wordmarkTop, width: darkMeta.width, height: wordmarkH })
    .trim()
    .toBuffer();

  // Resize both smoothly
  const embScaled = await sharp(emblem).resize({ height: 160 }).toBuffer();
  const embMeta = await sharp(embScaled).metadata();

  const wmScaled = await sharp(wordmark).resize({ height: 110 }).toBuffer();
  const wmMeta = await sharp(wmScaled).metadata();

  const gap = 24;
  const canvasW = embMeta.width + gap + wmMeta.width;
  const canvasH = 160;

  const horizontalNavLogo = await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([
      { input: embScaled, top: 0, left: 0 },
      { input: wmScaled, top: Math.round((canvasH - wmMeta.height) / 2), left: embMeta.width + gap }
    ])
    .png({ quality: 100 })
    .toBuffer();

  await sharp(horizontalNavLogo).toFile(path.join(outDir, 'logo-horizontal.png'));
  console.log('Saved logo-horizontal.png');

  // 4. Also create white horizontal for footer
  const whiteEmblem = await sharp(splashMasterBuffer)
    .extract({ left: 0, top: 0, width: darkMeta.width, height: emblemH })
    .trim()
    .resize({ height: 160 })
    .toBuffer();
  const whiteEmblemMeta = await sharp(whiteEmblem).metadata();

  const whiteWordmark = await sharp(splashMasterBuffer)
    .extract({ left: 0, top: wordmarkTop, width: darkMeta.width, height: wordmarkH })
    .trim()
    .resize({ height: 110 })
    .toBuffer();
  const whiteWordmarkMeta = await sharp(whiteWordmark).metadata();

  const whiteNavCanvasW = whiteEmblemMeta.width + gap + whiteWordmarkMeta.width;
  const horizontalWhiteNavLogo = await sharp({
    create: {
      width: whiteNavCanvasW,
      height: canvasH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([
      { input: whiteEmblem, top: 0, left: 0 },
      { input: whiteWordmark, top: Math.round((canvasH - whiteWordmarkMeta.height) / 2), left: whiteEmblemMeta.width + gap }
    ])
    .png({ quality: 100 })
    .toBuffer();

  await sharp(horizontalWhiteNavLogo).toFile(path.join(outDir, 'logo-horizontal-white.png'));
  console.log('Saved logo-horizontal-white.png');

  console.log('Done generating all clean pixel-perfect logos!');
}

createPerfectLogos().catch(console.error);
