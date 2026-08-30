const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

const srcDir = '/Users/anshbhatia/.gemini/antigravity/brain/aae4d7be-4e4f-4448-8dd5-613124a13e3d/scratch/gdrive_download';
const outDir = path.join(__dirname, '../public/images/products');

const cordsetProducts = [
  {
    name: 'Maldives Corduroy Multi-Purpose Co-ord Set',
    slug: 'maldives-corduroy-multi-purpose-coord-set',
    description: 'An elevated travel and lounge staple crafted from fine ribbed corduroy cotton. Features an oversized tailored button-down shirt paired with relaxed wide-leg trousers, finished with an elasticated waistband and subtle crest embroidery.',
    fabric: '100% Fine Ribbed Corduroy Cotton',
    collection: 'honeymoon',
    selling_price_usd: 120,
    cost_price_inr: 2800,
    stock_status: 'in_stock',
    is_active: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Oatmeal Sand', 'Alabaster'],
    sourceImages: ['file_1_1Ud9s7ojArqyHh_J_43VxSBzZ6lLVpVrn.jpg']
  },
  {
    name: 'Positano Buckled Linen Vest & Wide-Leg Trouser Set',
    slug: 'positano-buckled-linen-vest-trouser-set',
    description: 'Bespoke Mediterranean tailoring meets coastal romance. A sleeveless draped wrap vest featuring an artisan tortoiseshell cinch buckle, paired with relaxed wide-leg trousers crafted from crinkle organic linen.',
    fabric: '100% Organic Crinkle Linen',
    collection: 'resort_evening',
    selling_price_usd: 135,
    cost_price_inr: 3200,
    stock_status: 'in_stock',
    is_active: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Warm Sand Taupe', 'Mocha'],
    sourceImages: [
      'file_10_1ilJs5OcS4Wh_p03AU7JUGtI16rQPhw95.jpg',
      'file_17_1-ekCDrRY5o0-TZwAjLElEu_gdzW461OF.jpg',
      'file_2_1YTyOg_6tm7W7_nQ7IoVT1w6n9MLbcbLu.jpg'
    ]
  },
  {
    name: 'Capri Horizon Striped Linen Shirt & Trouser Set',
    slug: 'capri-horizon-striped-linen-trouser-set',
    description: 'Inspired by breezy afternoons on the Amalfi cliffs. A relaxed boyfriend-cut button-down shirt in crisp azure pinstripes with matching high-waisted wide-leg lounge trousers for effortless coastal living.',
    fabric: '100% Breathable Pure Linen Weave',
    collection: 'beach_party',
    selling_price_usd: 125,
    cost_price_inr: 2900,
    stock_status: 'in_stock',
    is_active: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue Stripe', 'Classic White'],
    sourceImages: [
      'file_12_1uwA9r4CyvU0UOT9BJmma7dgnOV0aTew8.jpg',
      'file_14_1z3GhhIrhRObMwJcbXslKVTX5BWphLYVv.jpg',
      'file_7_1O6yi6Iyea4QVEYYs0qg5cbL6MbVrEEdY.jpg'
    ]
  },
  {
    name: 'Saint-Germain Pinstripe Ribbed Knit Co-ord Set',
    slug: 'saint-germain-pinstripe-ribbed-knit-coord-set',
    description: 'Parisian chic for twilight aperitifs and rooftop gatherings. Features a sweetheart-neck long-sleeve knit top with delicate center ruching and keyhole tie, paired with fluid ribbed flare trousers in fine cream pinstripes.',
    fabric: 'Pure Ribbed Viscose Knit',
    collection: 'resort_evening',
    selling_price_usd: 130,
    cost_price_inr: 3000,
    stock_status: 'in_stock',
    is_active: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Vanilla Pinstripe'],
    sourceImages: [
      'file_11_1QXPiCnq39E7BGv6f5dVr5rdnp-usAZp1.jpg',
      'file_13_1AZWAU2bbs2wmzYcJ6VEyWtYznrjzRXE9.jpg'
    ]
  },
  {
    name: 'Riviera Embroidered Tassel Tunic & Palazzo Set',
    slug: 'riviera-embroidered-tassel-tunic-palazzo-set',
    description: 'A celebration of Indian artisanal heritage. Handcrafted ivory cotton tunic featuring intricate medallion embroidery, delicate pom-pom tassel trim, and two-tone chevron flared palazzo trousers.',
    fabric: '100% Handloom Cotton with Silk Floss Embroidery',
    collection: 'beach_party',
    selling_price_usd: 140,
    cost_price_inr: 3400,
    stock_status: 'in_stock',
    is_active: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Ivory & Azure Blue'],
    sourceImages: [
      'file_4_10Jj7QK3z4BXqK8aUWEBbQVWkPO7q8TEF.jpg',
      'file_16_1nR0w-yGKm5xz2FmRaDuhQytVgjKhADjS.jpg'
    ]
  },
  {
    name: 'Monceau Hourglass Tailored Blazer & Wide Trouser Suit Set',
    slug: 'monceau-hourglass-tailored-blazer-trouser-set',
    description: 'Impeccable sunset tailoring. A single-breasted sculpted hourglass blazer adorned with an artisan jewel crystal button, accompanied by floor-grazing pleated wide-leg trousers in rich luxury crepe.',
    fabric: 'Premium Italian Crepe Suiting with Silk Satin Lining',
    collection: 'resort_evening',
    selling_price_usd: 165,
    cost_price_inr: 4200,
    stock_status: 'in_stock',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Burgundy Wine', 'Pearl Ivory', 'Midnight Noir'],
    sourceImages: [
      'file_5_17Blh7Qwtb7jIig-Gc8Bq6w4t0w79qqk_.jpg',
      'file_6_1tzI315zj8aBeYPHO5XsU6rEPcOML2QGa.jpg',
      'file_9_14BbT33P_bsUd8kIAzYaRoMcOGN20tcua.jpg',
      'file_15_1fl5-cDSiPRZi7ArVjsKiWdTGraqVp1Ly.jpg'
    ]
  },
  {
    name: 'Mediterranean Ruffle Halter Silk Dress in Sky Blue',
    slug: 'mediterranean-ruffle-halter-silk-dress',
    description: 'An ethereal coastal evening silhouette. Designed with a ruched halter neckline, sculpted floral brooch accent, open back, and cascading high-low ruffle hemline that flutters with the sea breeze.',
    fabric: '100% Lightweight Silk Georgette',
    collection: 'honeymoon',
    selling_price_usd: 145,
    cost_price_inr: 3500,
    stock_status: 'in_stock',
    is_active: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Sky Blue'],
    sourceImages: [
      'file_3_1whYXBwYxPrZr7T3ihtPCUZ4pTV4Ni_AO.jpg',
      'file_0_17MpwVAFawZ-gXzMcKDD7O8R3AjpgRvGO.jpg',
      'file_8_1Sr6jO00DeVhvr1MPGzTV27C6ep87nJdV.jpg'
    ]
  }
];

async function run() {
  console.log('--- Processing Images ---');
  for (const prod of cordsetProducts) {
    const savedImages = [];
    for (let i = 0; i < prod.sourceImages.length; i++) {
      const srcName = prod.sourceImages[i];
      const srcPath = path.join(srcDir, srcName);
      const imgName = `${prod.slug}-${i + 1}.jpg`;
      const destPath = path.join(outDir, imgName);

      const img = sharp(srcPath);
      const meta = await img.metadata();

      // Clean crop top status bars or bottom bars if necessary
      let topCrop = 0;
      let bottomCrop = 0;
      if (srcName.includes('file_5_') || srcName.includes('file_6_') || srcName.includes('file_10_')) {
        // Screenshot with top status bar or bottom bar
        topCrop = Math.round(meta.height * 0.08);
        bottomCrop = Math.round(meta.height * 0.08);
      }

      await img
        .extract({
          left: 0,
          top: topCrop,
          width: meta.width,
          height: meta.height - topCrop - bottomCrop
        })
        .resize({ width: 900, height: 1200, fit: 'cover' })
        .jpeg({ quality: 92 })
        .toFile(destPath);

      savedImages.push(`/images/products/${imgName}`);
      console.log(`✓ Processed ${imgName}`);
    }

    prod.images = savedImages;

    // Check if product already exists
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('slug', prod.slug)
      .maybeSingle();

    const payload = {
      name: prod.name,
      slug: prod.slug,
      description: prod.description,
      fabric: prod.fabric,
      collection: prod.collection,
      selling_price_usd: prod.selling_price_usd,
      cost_price: Math.round(prod.selling_price_usd * 0.28),
      stock_status: prod.stock_status,
      is_active: prod.is_active,
      sizes: prod.sizes,
      colors: prod.colors,
      images: prod.images,
      updated_at: new Date().toISOString()
    };

    if (existing) {
      console.log(`Updating existing product ${prod.slug}...`);
      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', existing.id);
      if (error) console.error('Error updating:', error);
      else console.log(`✓ Updated ${prod.name}`);
    } else {
      console.log(`Inserting new product ${prod.slug}...`);
      const { error } = await supabase
        .from('products')
        .insert({
          ...payload,
          created_at: new Date().toISOString()
        });
      if (error) console.error('Error inserting:', error);
      else console.log(`✓ Added ${prod.name}`);
    }
  }

  console.log('--- ALL CO-ORD SET PRODUCTS SUCCESSFULLY ADDED ---');
}

run();
