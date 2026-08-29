const sharp = require('sharp');
const path = require('path');

async function createVariations() {
  const masterPath = path.join(__dirname, '../public/images/logo-trimmed.png');
  const outDir = path.join(__dirname, '../public/images');

  const meta = await sharp(masterPath).metadata();
  console.log('Master trimmed:', meta.width, 'x', meta.height);

  // 1. Extract Emblem (top 58% of the image)
  const emblemHeight = Math.round(meta.height * 0.58);
  const emblem = await sharp(masterPath)
    .extract({
      left: 0,
      top: 0,
      width: meta.width,
      height: emblemHeight
    })
    .trim()
    .toBuffer();

  await sharp(emblem)
    .png()
    .toFile(path.join(outDir, 'logo-emblem-transparent.png'));
  console.log('Saved logo-emblem-transparent.png');

  // 2. Extract Wordmark (SANDLINE + Subtitle from bottom 44%)
  const wordmarkTop = Math.round(meta.height * 0.54);
  const wordmarkHeight = meta.height - wordmarkTop;
  const wordmark = await sharp(masterPath)
    .extract({
      left: 0,
      top: wordmarkTop,
      width: meta.width,
      height: wordmarkHeight
    })
    .trim()
    .toBuffer();

  await sharp(wordmark)
    .png()
    .toFile(path.join(outDir, 'logo-wordmark.png'));
  console.log('Saved logo-wordmark.png');

  // 3. Compose Horizontal Navbar Logo (Emblem on Left + Wordmark on Right)
  const emblemResized = await sharp(emblem)
    .resize({ height: 100 })
    .toBuffer();
  const emblemMeta = await sharp(emblemResized).metadata();

  const wordmarkResized = await sharp(wordmark)
    .resize({ height: 75 })
    .toBuffer();
  const wordmarkMeta = await sharp(wordmarkResized).metadata();

  const gap = 20;
  const totalWidth = emblemMeta.width + gap + wordmarkMeta.width;
  const canvasHeight = 100;

  const horizontalLogo = await sharp({
    create: {
      width: totalWidth,
      height: canvasHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([
      {
        input: emblemResized,
        top: 0,
        left: 0
      },
      {
        input: wordmarkResized,
        top: Math.round((canvasHeight - wordmarkMeta.height) / 2),
        left: emblemMeta.width + gap
      }
    ])
    .png()
    .toBuffer();

  await sharp(horizontalLogo)
    .toFile(path.join(outDir, 'logo-horizontal.png'));
  console.log('Saved horizontal composite logo-horizontal.png');

  // 4. Also create White Horizontal Composite Logo for dark backgrounds
  const { data, info } = await sharp(horizontalLogo)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const whiteData = Buffer.from(data);
  for (let i = 0; i < whiteData.length; i += 4) {
    if (whiteData[i + 3] > 10) {
      const r = whiteData[i];
      const g = whiteData[i + 1];
      const b = whiteData[i + 2];
      const isGold = (r > 150 && g > 110 && b < 110);
      if (isGold) {
        whiteData[i] = 232;
        whiteData[i + 1] = 180;
        whiteData[i + 2] = 100;
      } else {
        whiteData[i] = 250;
        whiteData[i + 1] = 248;
        whiteData[i + 2] = 245;
      }
    }
  }

  await sharp(whiteData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .png()
    .toFile(path.join(outDir, 'logo-horizontal-white.png'));
  console.log('Saved logo-horizontal-white.png');
}

createVariations().catch(console.error);
