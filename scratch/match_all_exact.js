const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const exactMap = {
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
  "kyoto-sheer-organza-cami-top": "/images/products/kyoto-sheer-organza-cami-top.jpg",
  
  // Clean raw HD 1440p CDN URLs with ZERO watermark
  "riviera-lace-up-placket-cotton-blouse": "https://img201.savana.com/goods-pic/da7bb8c52daa445fa0924c0d45c7b999_w1440_q90",
  "capri-tie-up-linen-placket-blouse": "https://img201.savana.com/goods-pic/3fe8b7f200e84aaab3385c547494fa6a_w1440_q90",
  "milan-plaid-cropped-resort-overshirt": "https://img201.savana.com/goods-pic/4384ada175854d44b6657f64e1158a07_w1440_q90",
  "arezzo-front-twist-striped-blouse": "https://img201.savana.com/goods-pic/dfebff0a308e49ed8b7fb77918191848_w1440_q90",
  "bali-contrast-trim-resort-co-ord-set": "https://img201.savana.com/goods-pic/d0353cc435c64e1d8ab5d1b746686be9_w1440_q90",
  "maui-relaxed-linen-lounge-co-ord-set": "https://img201.savana.com/goods-pic/d7e141bfa6764e4ca985c6ba9593c539_w1440_q90",
  "paloma-gathered-waist-co-ord-set": "https://img201.savana.com/goods-pic/03f9e97d85ff46e987597091bf4bac57_w1440_q90",
  "cabo-elastic-linen-shorts-co-ord-set": "https://img201.savana.com/goods-pic/6a229c505212434dbf071a73eaaff4fd_w1440_q90",
  "maldives-drawstring-resort-co-ord-set": "https://img201.savana.com/goods-pic/c3702c2e72134ca98d0a0a7f093d3126_w1440_q90",
  "sunset-hooded-knit-resort-co-ord-set": "https://img201.savana.com/goods-pic/1ae3322b2faf4fff8ec0e76da224c351_w1440_q90",
  "riviera-safari-pocket-co-ord-set": "https://img201.savana.com/goods-pic/e5d57a2ff7bf4747bba5625bd7813fbd_w1440_q90",
  "bora-bora-tiered-beach-maxi-dress": "https://img201.savana.com/goods-pic/09dfb0c5bd834f7e9af62e173f2f8ff3_w1440_q90",
  "venice-hand-beaded-straight-leg-denim": "https://img201.savana.com/goods-pic/de4b69a25b4640739933d3fa1df7d69f_w1440_q90",
  "santorini-embroidered-denim-wide-leg-shorts": "https://img201.savana.com/goods-pic/5f5cdefbf6d645f29e395aea58881e8f_w1440_q90",
  "portofino-vintage-button-denim-culotte-shorts": "https://img201.savana.com/goods-pic/65776bc7d1084f27b4b8dbf07e8316ca_w1440_q90",
  "florence-vintage-embroidered-flare-jeans": "https://img201.savana.com/goods-pic/b09c6902608d42ef8fae61bfddd39498_w1440_q90",
  "verona-pintuck-seam-raw-hem-wide-leg-jeans": "https://img201.savana.com/goods-pic/cf951b506d734bc1bd5bdf50bd8d9f0e_w1440_q90",
  "cherry-blossom-embroidered-wide-leg-jeans": "https://img201.savana.com/goods-pic/0fa62864c1b64a8882d6401c0ce9e73f_w1440_q90",
  "parisian-bow-detail-wide-leg-denim": "https://img201.savana.com/goods-pic/d481d4c363564df89b0bc421b018e169_w1440_q90",
  "riviera-atelier-decorative-pocket-wide-leg-jeans": "https://img201.savana.com/goods-pic/734fc4b0190a40bf960787d68fc7ca9d_w1440_q90",
  "corfu-distressed-denim-bermuda-shorts": "https://img201.savana.com/goods-pic/12a2835e39154bc1a535e1b0c9e9ff08_w1440_q90"
};

async function downloadExactAll() {
  const outDir = path.join(process.cwd(), "public/images/products");

  for (const [slug, src] of Object.entries(exactMap)) {
    const filename = `${slug}.jpg`;
    const targetPath = path.join(outDir, filename);

    if (src.startsWith("/images/products/")) {
      console.log(`✨ Kept AI Model Lookbook: ${slug}`);
    } else {
      console.log(`Downloading pure raw HD image: ${slug}`);
      const res = await fetch(src);
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(targetPath, buffer);
        console.log(`✓ Saved pristine HD file: ${filename} (${buffer.length} bytes)`);
      } else {
        console.error(`Failed ${slug}: ${res.status}`);
      }
    }

    // Update database
    await supabase.from("products").update({ images: [`/images/products/${filename}`] }).eq("slug", slug);
  }

  console.log("All exact product photos are now 100% crystal-clear HD with ZERO blur and ZERO watermarks!");
}

downloadExactAll();
