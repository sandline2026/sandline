const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/instagram-assets');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. CAROUSEL SLIDES (1080 x 1350)
const CAROUSEL_DATA = [
  {
    num: 1,
    img: 'bora-bora-tiered-beach-maxi-dress.jpg',
    badge: 'NEW ARRIVALS 2026',
    tag: 'THE RESORT EDIT',
    titleLine1: 'WHERE IS YOUR',
    titleLine2: 'NEXT ESCAPE? 🐚',
    subtitle: 'Effortless silhouettes cut for where the tide meets the party.',
    footer: 'SWIPE TO EXPLORE THE EDITS ⟶',
  },
  {
    num: 2,
    img: 'maldives-drawstring-resort-co-ord-set.jpg',
    badge: 'DESTINATION 01',
    tag: 'BALI SUNDOWNS 🌴',
    titleLine1: 'MALDIVES LINEN',
    titleLine2: 'CO-ORD SET',
    subtitle: '100% Organic Crinkle Linen • Breathable comfort for tropical afternoons.',
    footer: '01 / 04 SILHOUETTES',
  },
  {
    num: 3,
    img: 'santorini-3d-floral-silk-slip-dress.jpg',
    badge: 'DESTINATION 02',
    tag: 'SANTORINI GOLDEN HOUR 🏛️',
    titleLine1: 'SANTORINI 3D',
    titleLine2: 'FLORAL SILK SLIP',
    subtitle: 'Handcrafted 3D organza florals draped over pure mulberry silk.',
    footer: '02 / 04 SILHOUETTES',
  },
  {
    num: 4,
    img: 'amalfi-contrast-trim-silk-a-line-dress.jpg',
    badge: 'DESTINATION 03',
    tag: 'AMALFI CLIFFSIDE DINNERS 🌊',
    titleLine1: 'AMALFI SILK',
    titleLine2: 'A-LINE SLIP',
    subtitle: 'Ethereal Mediterranean movement and sculpted luxury for oceanside cocktails.',
    footer: '03 / 04 SILHOUETTES',
  },
  {
    num: 5,
    img: 'mykonos-smocked-linen-co-ord-set.jpg',
    badge: 'LAUNCH OFFER: 10% OFF',
    tag: 'OFFICIAL DROP IS LIVE',
    titleLine1: 'YOUR FIRST LOOK',
    titleLine2: 'IS WAITING. ✨',
    subtitle: 'Designed &amp; hand-finished in India • Delivered to shores worldwide.',
    footer: 'TAP LINK IN BIO • SANDLINE.STORE',
    isCta: true,
  },
];

// 2. STORY SLIDES (1080 x 1920)
const STORY_DATA = [
  {
    num: 1,
    img: 'santorini-3d-floral-silk-slip-dress.jpg',
    badge: 'THE RESORT AESTHETIC',
    quote1: '“Dresses cut for where',
    quote2: 'the tide meets the party.” 🐚',
    subtitle: 'Handcrafted silks &amp; breezy linens made for sun-drenched escapes.',
    bottomText: 'TAP TO EXPLORE THE NEW EDITS 👇',
  },
  {
    num: 2,
    img: 'monaco-hand-embroidered-co-ord-set.jpg',
    badge: 'INDIAN ATELIER CRAFTSMANSHIP',
    quote1: '“100% Hand-Finished',
    quote2: 'in India.” ✈️',
    subtitle: 'Generational craft shipped directly to 40+ countries worldwide.',
    bottomText: 'WORLDWIDE EXPRESS SHIPPING',
  },
  {
    num: 3,
    img: 'riviera-safari-pocket-co-ord-set.jpg',
    badge: 'OFFICIAL DROP IS LIVE',
    quote1: '“10% OFF Your',
    quote2: 'First Resort Look.” ✨',
    subtitle: 'Use code WELCOME10 for 10% off your entire order.',
    bottomText: 'TAP THE LINK STICKER BELOW 👇',
    isLink: true,
  },
];

async function generateAll() {
  console.log('Rendering 5 Carousel Slides (1080x1350)...');

  for (const c of CAROUSEL_DATA) {
    const bgPath = path.join(__dirname, '../public/images/products', c.img);
    
    // Create base 1080x1350 resized background
    const bgBuffer = await sharp(bgPath)
      .resize(1080, 1350, { fit: 'cover' })
      .toBuffer();

    const svgOverlay = `
    <svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#111827" stop-opacity="0.45" />
          <stop offset="35%" stop-color="#111827" stop-opacity="0.15" />
          <stop offset="65%" stop-color="#111827" stop-opacity="0.75" />
          <stop offset="100%" stop-color="#111827" stop-opacity="0.98" />
        </linearGradient>
      </defs>

      <!-- Gradient Darkener -->
      <rect width="1080" height="1350" fill="url(#grad)" />

      <!-- Top Bar -->
      <g transform="translate(70, 70)">
        <text x="0" y="32" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#FFFFFF" letter-spacing="4">SANDLINE</text>
        <text x="0" y="52" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#D97706" letter-spacing="2">RESORTWEAR</text>
        
        <!-- Badge -->
        <rect x="660" y="6" width="280" height="42" rx="21" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />
        <text x="800" y="33" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="bold" fill="#FBBF24" letter-spacing="1.5">${c.badge}</text>
      </g>

      <!-- Main Copy Bottom Box -->
      <g transform="translate(70, 920)">
        <text x="0" y="0" font-family="Helvetica, Arial, sans-serif" font-size="16" font-weight="bold" fill="#FBBF24" letter-spacing="3">${c.tag}</text>
        <text x="0" y="65" font-family="Georgia, serif" font-size="54" font-weight="bold" fill="#FFFFFF" letter-spacing="1">${c.titleLine1}</text>
        <text x="0" y="130" font-family="Georgia, serif" font-size="54" font-weight="bold" fill="#FFFFFF" letter-spacing="1">${c.titleLine2}</text>
        <text x="0" y="180" font-family="Helvetica, Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.88)">${c.subtitle}</text>

        ${c.isCta ? `
        <!-- Promo Box -->
        <g transform="translate(0, 210)">
          <rect width="940" height="90" rx="16" fill="#FAF8F5" />
          <text x="30" y="38" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="bold" fill="#78716C" letter-spacing="1.5">USE LAUNCH CODE</text>
          <text x="30" y="68" font-family="Georgia, serif" font-size="26" font-weight="bold" fill="#D97706" letter-spacing="2">WELCOME10 (10% OFF)</text>
          <text x="910" y="52" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="16" font-weight="bold" fill="#111827" letter-spacing="1">SHOP AT SANDLINE.STORE ↗</text>
        </g>
        ` : ''}

        <!-- Divider & Footer -->
        <line x1="0" y1="320" x2="940" y2="320" stroke="rgba(255,255,255,0.25)" stroke-width="1" />
        <text x="0" y="355" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="bold" fill="rgba(255,255,255,0.7)" letter-spacing="2">${c.footer}</text>
        <text x="940" y="355" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="bold" fill="rgba(255,255,255,0.7)" letter-spacing="2">SANDLINE.STORE</text>
      </g>
    </svg>
    `;

    const outPath = path.join(outDir, `post2-slide${c.num}.png`);
    await sharp(bgBuffer)
      .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
      .png({ quality: 100 })
      .toFile(outPath);

    console.log(`Generated Carousel: post2-slide${c.num}.png`);
  }

  console.log('Rendering 3 Launch Stories (1080x1920)...');

  for (const st of STORY_DATA) {
    const bgPath = path.join(__dirname, '../public/images/products', st.img);
    const bgBuffer = await sharp(bgPath)
      .resize(1080, 1920, { fit: 'cover' })
      .toBuffer();

    const svgStory = `
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="storyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#111827" stop-opacity="0.55" />
          <stop offset="25%" stop-color="#111827" stop-opacity="0.2" />
          <stop offset="65%" stop-color="#111827" stop-opacity="0.75" />
          <stop offset="100%" stop-color="#111827" stop-opacity="0.96" />
        </linearGradient>
      </defs>

      <rect width="1080" height="1920" fill="url(#storyGrad)" />

      <!-- Top Branding -->
      <g transform="translate(540, 160)" text-anchor="middle">
        <text x="0" y="0" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="#FFFFFF" letter-spacing="6">SANDLINE</text>
        <text x="0" y="24" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="bold" fill="#D97706" letter-spacing="3">RESORTWEAR</text>
        
        <rect x="-180" y="55" width="360" height="46" rx="23" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />
        <text x="0" y="84" font-family="Helvetica, Arial, sans-serif" font-size="14" font-weight="bold" fill="#FBBF24" letter-spacing="2">${st.badge}</text>
      </g>

      <!-- Bottom Copy -->
      <g transform="translate(540, 1420)" text-anchor="middle">
        <text x="0" y="0" font-family="Georgia, serif" font-size="50" font-weight="bold" font-style="italic" fill="#FFFFFF" letter-spacing="1">${st.quote1}</text>
        <text x="0" y="65" font-family="Georgia, serif" font-size="50" font-weight="bold" font-style="italic" fill="#FFFFFF" letter-spacing="1">${st.quote2}</text>
        
        <text x="0" y="130" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="rgba(255,255,255,0.9)">${st.subtitle}</text>

        ${st.isLink ? `
        <!-- Sticker Link Simulation -->
        <g transform="translate(0, 180)">
          <rect x="-300" y="0" width="600" height="74" rx="37" fill="#FAF8F5" stroke="#EAE6DF" stroke-width="2" />
          <text x="0" y="46" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="bold" fill="#111827">🛍️ USE CODE: <tspan fill="#D97706">WELCOME10</tspan> (10% OFF)</text>
        </g>
        ` : ''}

        <text x="0" y="320" font-family="Helvetica, Arial, sans-serif" font-size="18" font-weight="bold" fill="#FBBF24" letter-spacing="3">${st.bottomText}</text>
      </g>
    </svg>
    `;

    const outPath = path.join(outDir, `story-slide${st.num}.png`);
    await sharp(bgBuffer)
      .composite([{ input: Buffer.from(svgStory), top: 0, left: 0 }])
      .png({ quality: 100 })
      .toFile(outPath);

    console.log(`Generated Story: story-slide${st.num}.png`);
  }

  console.log('ALL 8 GRAPHICS COMPLETED PERFECTLY!');
}

generateAll().catch(console.error);
