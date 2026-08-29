const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function main() {
  const inputPath = '/Users/anshbhatia/.gemini/antigravity/brain/aae4d7be-4e4f-4448-8dd5-613124a13e3d/.user_uploaded/media_1788016682464.jpg';
  const outDir = path.join(__dirname, '../public/images');

  console.log('Reading high-res master logo from:', inputPath);

  // 1. Save master copy
  await sharp(inputPath)
    .toFile(path.join(outDir, 'sandline-logo-master.jpg'));
  console.log('Saved sandline-logo-master.jpg');

  // 2. Get metadata
  const meta = await sharp(inputPath).metadata();
  console.log(`Image dimensions: ${meta.width}x${meta.height}`);

  // 3. Make transparent background version:
  // The background color is approximately #F7EFE4 (RGB: ~247, 239, 228)
  // Let's create a threshold transparency for background pixels
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelData = Buffer.from(data);
  const channels = info.channels; // 4 (RGBA)

  for (let i = 0; i < pixelData.length; i += channels) {
    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];

    // Check if pixel is background (cream / light beige)
    // r > 230, g > 225, b > 215 with low saturation
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const isNeutralCream = (r >= 232 && g >= 225 && b >= 215) && (maxVal - minVal < 28);

    if (isNeutralCream) {
      // Calculate opacity fade based on lightness
      const lightness = (r + g + b) / 3;
      if (lightness > 240) {
        pixelData[i + 3] = 0; // 100% transparent
      } else {
        // Semi-transparent edge smoothing
        const alpha = Math.max(0, Math.min(255, Math.round((245 - lightness) * 18)));
        pixelData[i + 3] = alpha;
      }
    }
  }

  const transparentSquare = await sharp(pixelData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .png()
    .toBuffer();

  await sharp(transparentSquare)
    .toFile(path.join(outDir, 'logo-transparent.png'));
  console.log('Saved logo-transparent.png');

  // 4. Auto-trim transparent square to get tight bounding box
  const trimmed = await sharp(transparentSquare)
    .trim()
    .toBuffer();

  await sharp(trimmed)
    .toFile(path.join(outDir, 'logo-trimmed.png'));
  console.log('Saved logo-trimmed.png');

  // 5. Create high-resolution horizontal logo for navbar (height 120px with transparent background & perfect crisp padding)
  const trimmedMeta = await sharp(trimmed).metadata();
  console.log(`Trimmed logo dimensions: ${trimmedMeta.width}x${trimmedMeta.height}`);

  await sharp(trimmed)
    .resize({ height: 160 })
    .png({ quality: 100 })
    .toFile(path.join(outDir, 'logo-horizontal.png'));
  console.log('Saved logo-horizontal.png');

  // 6. Create white version for dark backgrounds / footers
  const { data: trimData, info: trimInfo } = await sharp(trimmed)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const whitePixelData = Buffer.from(trimData);
  for (let i = 0; i < whitePixelData.length; i += trimInfo.channels) {
    const a = whitePixelData[i + 3];
    if (a > 15) {
      // Convert dark text/emblem to ivory/white (#FAF8F5)
      const r = whitePixelData[i];
      const g = whitePixelData[i + 1];
      const b = whitePixelData[i + 2];
      
      // If it's the gold sun/arc (r > 160, g > 130, b < 100), keep gold or lighten slightly
      const isGold = (r > 150 && g > 110 && b < 110);
      if (isGold) {
        whitePixelData[i] = 232;
        whitePixelData[i + 1] = 180;
        whitePixelData[i + 2] = 100;
      } else {
        whitePixelData[i] = 250;
        whitePixelData[i + 1] = 248;
        whitePixelData[i + 2] = 245;
      }
    }
  }

  await sharp(whitePixelData, {
    raw: {
      width: trimInfo.width,
      height: trimInfo.height,
      channels: trimInfo.channels,
    },
  })
    .resize({ height: 160 })
    .png()
    .toFile(path.join(outDir, 'logo-horizontal-white.png'));
  console.log('Saved logo-horizontal-white.png');

  // 7. Generate Apple Touch Icon & Favicon
  await sharp(inputPath)
    .resize(180, 180, { fit: 'cover' })
    .png()
    .toFile(path.join(__dirname, '../public/apple-icon.png'));
  console.log('Saved apple-icon.png');

  console.log('All High-Resolution Logos Processed Successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
