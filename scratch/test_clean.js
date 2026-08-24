const sharp = require("sharp");
const path = require("path");

async function cleanWatermark(inputPath, outputPath) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const w = metadata.width;
  const h = metadata.height;

  // Badge bounds
  const badgeW = Math.round(w * 0.46);
  const badgeH = Math.round(h * 0.12);

  // Sample adjacent background from x: badgeW to badgeW + 80, y: 0 to badgeH
  // Stretch it horizontally to cover 0 to badgeW with smooth blur
  const sampleW = Math.min(Math.round(w * 0.25), w - badgeW);
  
  const bgSample = await sharp(inputPath)
    .extract({ left: badgeW + 5, top: 0, width: sampleW, height: badgeH })
    .resize(badgeW, badgeH, { fit: 'fill' })
    .blur(8)
    .toBuffer();

  await sharp(inputPath)
    .composite([
      {
        input: bgSample,
        left: 0,
        top: 0,
      }
    ])
    .jpeg({ quality: 92 })
    .toFile(outputPath);

  console.log("Successfully cleaned:", outputPath);
}

async function run() {
  await cleanWatermark("./public/images/products/sample_1.jpg", "./public/images/products/test_clean_1.jpg");
  await cleanWatermark("./public/images/products/sample_2.jpg", "./public/images/products/test_clean_2.jpg");
}

run();
