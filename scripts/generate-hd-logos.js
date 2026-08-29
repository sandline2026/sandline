const sharp = require('sharp');
const path = require('path');

async function generateHdLogos() {
  const inputPath = '/Users/anshbhatia/.gemini/antigravity/brain/aae4d7be-4e4f-4448-8dd5-613124a13e3d/.user_uploaded/media_1788016682464.jpg';
  const outDir = path.join(__dirname, '../public/images');

  // Load raw image at native 1024x1024 resolution
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // 1. Create crisp transparent logo (keep original dark & gold colors at 1024x1024)
  const darkPixelData = Buffer.from(data);
  for (let i = 0; i < darkPixelData.length; i += channels) {
    const r = darkPixelData[i];
    const g = darkPixelData[i + 1];
    const b = darkPixelData[i + 2];

    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const isCreamBg = (r >= 230 && g >= 220 && b >= 210) && (maxVal - minVal < 30);

    if (isCreamBg) {
      const lightness = (r + g + b) / 3;
      if (lightness > 240) {
        darkPixelData[i + 3] = 0;
      } else {
        const alpha = Math.max(0, Math.min(255, Math.round((245 - lightness) * 20)));
        darkPixelData[i + 3] = alpha;
      }
    }
  }

  const transparentDarkBuffer = await sharp(darkPixelData, {
    raw: { width, height, channels }
  })
    .trim()
    .png({ quality: 100, compressionLevel: 6 })
    .toBuffer();

  await sharp(transparentDarkBuffer)
    .toFile(path.join(outDir, 'logo-master-hd.png'));
  console.log('Saved logo-master-hd.png');

  // 2. Create ultra-crisp white & gold logo for dark splash & footer at FULL 1024px
  const whitePixelData = Buffer.from(data);
  for (let i = 0; i < whitePixelData.length; i += channels) {
    const r = whitePixelData[i];
    const g = whitePixelData[i + 1];
    const b = whitePixelData[i + 2];

    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const isCreamBg = (r >= 230 && g >= 220 && b >= 210) && (maxVal - minVal < 30);

    if (isCreamBg) {
      const lightness = (r + g + b) / 3;
      if (lightness > 240) {
        whitePixelData[i + 3] = 0;
      } else {
        const alpha = Math.max(0, Math.min(255, Math.round((245 - lightness) * 20)));
        whitePixelData[i + 3] = alpha;
      }
    } else {
      // Foreground pixel
      // Check if it's the gold sun or gold arc:
      // Gold in this image: r is higher than b significantly, and g is medium
      const isGold = (r > 140 && g > 100 && b < 90) || (r > 160 && g > 120 && b < 120);
      if (isGold) {
        // Bright radiant gold
        whitePixelData[i] = 232;
        whitePixelData[i + 1] = 180;
        whitePixelData[i + 2] = 100;
        whitePixelData[i + 3] = 255;
      } else {
        // Crisp pure ivory white
        whitePixelData[i] = 255;
        whitePixelData[i + 1] = 255;
        whitePixelData[i + 2] = 255;
        whitePixelData[i + 3] = 255;
      }
    }
  }

  const whiteMaster = await sharp(whitePixelData, {
    raw: { width, height, channels }
  })
    .trim()
    .png({ quality: 100, compressionLevel: 6 })
    .toBuffer();

  // Save full resolution white logo (900x1000px native crisp)
  await sharp(whiteMaster)
    .toFile(path.join(outDir, 'logo-white-trimmed.png'));
  console.log('Saved ultra-crisp logo-white-trimmed.png (FULL HD)');

  await sharp(whiteMaster)
    .toFile(path.join(outDir, 'logo-splash-master.png'));
  console.log('Saved logo-splash-master.png');

  // 3. Create high-density retina horizontal navbar logo
  const darkMeta = await sharp(transparentDarkBuffer).metadata();

  // Extract emblem (top 58%) at native resolution
  const emblemH = Math.round(darkMeta.height * 0.58);
  const emblemBuf = await sharp(transparentDarkBuffer)
    .extract({ left: 0, top: 0, width: darkMeta.width, height: emblemH })
    .trim()
    .toBuffer();

  // Extract wordmark (bottom 46%) at native resolution
  const wordmarkTop = Math.round(darkMeta.height * 0.54);
  const wordmarkH = darkMeta.height - wordmarkTop;
  const wordmarkBuf = await sharp(transparentDarkBuffer)
    .extract({ left: 0, top: wordmarkTop, width: darkMeta.width, height: wordmarkH })
    .trim()
    .toBuffer();

  // Compose high-res horizontal logo (height 240px for 3x retina screens)
  const emblem240 = await sharp(emblemBuf).resize({ height: 240 }).toBuffer();
  const emblem240Meta = await sharp(emblem240).metadata();

  const wordmark180 = await sharp(wordmarkBuf).resize({ height: 180 }).toBuffer();
  const wordmark180Meta = await sharp(wordmark180).metadata();

  const gap = 40;
  const totalW = emblem240Meta.width + gap + wordmark180Meta.width;
  const totalH = 240;

  const horizontalHd = await sharp({
    create: {
      width: totalW,
      height: totalH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([
      { input: emblem240, top: 0, left: 0 },
      { input: wordmark180, top: Math.round((totalH - wordmark180Meta.height) / 2), left: emblem240Meta.width + gap }
    ])
    .png({ quality: 100 })
    .toBuffer();

  await sharp(horizontalHd).toFile(path.join(outDir, 'logo-horizontal.png'));
  console.log('Saved retina 3x logo-horizontal.png');

  // Also create retina horizontal white
  const whiteEmblem = await sharp(whiteMaster)
    .extract({ left: 0, top: 0, width: darkMeta.width, height: emblemH })
    .trim()
    .resize({ height: 240 })
    .toBuffer();
  const whiteEmblemMeta = await sharp(whiteEmblem).metadata();

  const whiteWordmark = await sharp(whiteMaster)
    .extract({ left: 0, top: wordmarkTop, width: darkMeta.width, height: wordmarkH })
    .trim()
    .resize({ height: 180 })
    .toBuffer();
  const whiteWordmarkMeta = await sharp(whiteWordmark).metadata();

  const horizontalWhiteHd = await sharp({
    create: {
      width: whiteEmblemMeta.width + gap + whiteWordmarkMeta.width,
      height: totalH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([
      { input: whiteEmblem, top: 0, left: 0 },
      { input: whiteWordmark, top: Math.round((totalH - whiteWordmarkMeta.height) / 2), left: whiteEmblemMeta.width + gap }
    ])
    .png({ quality: 100 })
    .toBuffer();

  await sharp(horizontalWhiteHd).toFile(path.join(outDir, 'logo-horizontal-white.png'));
  console.log('Saved retina 3x logo-horizontal-white.png');

  console.log('All Ultra-HD Retina Logos Generated Successfully!');
}

generateHdLogos().catch(console.error);
