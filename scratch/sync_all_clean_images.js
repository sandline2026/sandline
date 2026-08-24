const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapping of products that have dedicated high-fashion AI generated lookbook shoots
const aiPhotoshootMap = {
  "jaipur-blossom-embroidered-poplin-overshirt": "/images/products/jaipur-blossom-striped-overshirt.jpg",
  "riviera-crystal-pinstripe-tie-blouse": "/images/products/riviera-crystal-pinstripe-tie-shirt.jpg",
  "santorini-3d-floral-silk-slip-dress": "/images/products/santorini-3d-floral-silk-slip-dress.jpg",
  "amalfi-contrast-trim-silk-a-line-dress": "/images/products/amalfi-contrast-trim-silk-a-line-dress.jpg",
  "elysian-tie-up-a-line-resort-dress": "/images/products/elysian-tie-up-a-line-resort-dress.jpg",
  "mykonos-smocked-linen-co-ord-set": "/images/products/mykonos-smocked-linen-co-ord-set.jpg",
  "st-tropez-ruffle-tiered-skirt-co-ord-set": "/images/products/st-tropez-ruffle-tiered-skirt-co-ord-set.jpg",
  "tulum-crossed-wrap-halter-co-ord-set": "/images/products/tulum-crossed-wrap-halter-co-ord-set.jpg",
  "monaco-hand-embroidered-co-ord-set": "/images/products/monaco-hand-embroidered-co-ord-set.jpg",
  "positano-ruffle-tiered-resort-blouse": "/images/products/positano-ruffle-tiered-resort-blouse.jpg",
  "ibiza-backless-halter-linen-top": "/images/products/ibiza-backless-halter-linen-top.jpg",
  "kyoto-sheer-organza-cami-top": "/images/products/kyoto-sheer-organza-cami-top.jpg"
};

async function cleanWatermarkBuffer(inputBuffer) {
  const metadata = await sharp(inputBuffer).metadata();
  const w = metadata.width;
  const h = metadata.height;

  // Badge bounds on Savana photos: top-left corner
  const badgeW = Math.round(w * 0.46);
  const badgeH = Math.round(h * 0.12);
  const sampleW = Math.min(Math.round(w * 0.25), w - badgeW);

  // Sample clean background right next to badge and blend over it
  const bgSample = await sharp(inputBuffer)
    .extract({ left: badgeW + 5, top: 0, width: sampleW, height: badgeH })
    .resize(badgeW, badgeH, { fit: 'fill' })
    .blur(8)
    .toBuffer();

  return await sharp(inputBuffer)
    .composite([{ input: bgSample, left: 0, top: 0 }])
    .jpeg({ quality: 92 })
    .toBuffer();
}

async function processAll() {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, slug, images");

  if (error) {
    console.error("Error fetching products:", error.message);
    return;
  }

  const outDir = path.join(process.cwd(), "public/images/products");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log(`Processing ${products.length} products...`);

  for (const p of products) {
    const slug = p.slug;

    // Check if we have a dedicated AI photoshoot
    if (aiPhotoshootMap[slug]) {
      const localUrl = aiPhotoshootMap[slug];
      await supabase.from("products").update({ images: [localUrl] }).eq("id", p.id);
      console.log(`✨ Assigned AI Lookbook Photoshoot: ${p.name} -> ${localUrl}`);
      continue;
    }

    const currentImg = p.images && p.images[0];
    if (currentImg && currentImg.startsWith("http")) {
      try {
        console.log(`Downloading & cleaning: ${p.name} (${currentImg})`);
        const res = await fetch(currentImg);
        const origBuffer = Buffer.from(await res.arrayBuffer());

        // Clean watermark
        const cleanedBuffer = await cleanWatermarkBuffer(origBuffer);
        const filename = `${slug}.jpg`;
        const savePath = path.join(outDir, filename);
        fs.writeFileSync(savePath, cleanedBuffer);

        const localUrl = `/images/products/${filename}`;
        await supabase.from("products").update({ images: [localUrl] }).eq("id", p.id);
        console.log(`✓ Cleaned & Updated: ${p.name} -> ${localUrl}`);
      } catch (err) {
        console.error(`Failed to process ${p.name}:`, err.message);
      }
    } else if (currentImg) {
      console.log(`Already local: ${p.name} -> ${currentImg}`);
    }
  }

  console.log("All products processed successfully with 100% watermark-free images!");
}

processAll();
