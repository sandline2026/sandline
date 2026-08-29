const sharp = require('sharp');
const path = require('path');

async function cleanPerfectCutout() {
  const inputPath = '/Users/anshbhatia/.gemini/antigravity/brain/aae4d7be-4e4f-4448-8dd5-613124a13e3d/.user_uploaded/media_1788016682464.jpg';
  const outDir = path.join(__dirname, '../public/images');

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // Let's sample the background color from top corners
  // (0,0) is cream background
  const bgR = data[0];
  const bgG = data[1];
  const bgB = data[2];
  console.log(`Sampled background color: rgb(${bgR}, ${bgG}, ${bgB})`);

  // Target white & gold logo buffer
  const outPixels = Buffer.alloc(width * height * 4);

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Calculate Euclidean color distance from background color
    const dist = Math.sqrt(
      Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
    );

    // If pixel is very close to background (within distance threshold 32), it is 100% transparent
    if (dist < 34) {
      outPixels[i] = 0;
      outPixels[i + 1] = 0;
      outPixels[i + 2] = 0;
      outPixels[i + 3] = 0; // Completely transparent
    } else {
      // It is foreground (Emblem, Sun, or Typography)
      // Check if it's the gold element (sun or divider):
      // Gold in this image has r > 135, g between 95 and 150, b < 100, and r - b > 40
      const isGold = (r > 130 && g > 90 && b < 110 && (r - b) > 35);

      // Smooth anti-aliasing alpha based on distance
      let alpha = 255;
      if (dist < 60) {
        alpha = Math.round(((dist - 34) / 26) * 255);
      }

      if (isGold) {
        // Radiant rich gold #E8B464
        outPixels[i] = 232;
        outPixels[i + 1] = 180;
        outPixels[i + 2] = 100;
        outPixels[i + 3] = alpha;
      } else {
        // Pure brilliant white
        outPixels[i] = 255;
        outPixels[i + 1] = 255;
        outPixels[i + 2] = 255;
        outPixels[i + 3] = alpha;
      }
    }
  }

  // Create trimmed master white/gold logo
  const trimmedWhiteMaster = await sharp(outPixels, {
    raw: { width, height, channels: 4 }
  })
    .trim()
    .png({ quality: 100 })
    .toBuffer();

  await sharp(trimmedWhiteMaster)
    .toFile(path.join(outDir, 'logo-splash-master.png'));
  console.log('Saved 100% artifact-free logo-splash-master.png');

  await sharp(trimmedWhiteMaster)
    .toFile(path.join(outDir, 'logo-white-trimmed.png'));
  console.log('Saved logo-white-trimmed.png');

  // Also do same for the dark original logo on transparent background
  const darkOutPixels = Buffer.alloc(width * height * 4);
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const dist = Math.sqrt(
      Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
    );

    if (dist < 34) {
      darkOutPixels[i] = 0;
      darkOutPixels[i + 1] = 0;
      darkOutPixels[i + 2] = 0;
      darkOutPixels[i + 3] = 0;
    } else {
      let alpha = 255;
      if (dist < 60) {
        alpha = Math.round(((dist - 34) / 26) * 255);
      }
      darkOutPixels[i] = r;
      darkOutPixels[i + 1] = g;
      darkOutPixels[i + 2] = b;
      darkOutPixels[i + 3] = alpha;
    }
  }

  const trimmedDarkMaster = await sharp(darkOutPixels, {
    raw: { width, height, channels: 4 }
  })
    .trim()
    .png({ quality: 100 })
    .toBuffer();

  await sharp(trimmedDarkMaster)
    .toFile(path.join(outDir, 'logo-stacked.png'));
  console.log('Saved logo-stacked.png');

  console.log('All Clean Logo Assets Re-generated!');
}

cleanPerfectCutout().catch(console.error);
