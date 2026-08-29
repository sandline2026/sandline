const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.join(__dirname, '../public/instagram-assets');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. HTML TEMPLATE FOR 5-SLIDE CAROUSEL (1080 x 1350)
function generateCarouselHtml(slideNum) {
  const slides = {
    1: {
      tag: "THE RESORT 2026 EDIT",
      title: "WHERE IS YOUR<br>NEXT ESCAPE? 🐚",
      subtitle: "Effortless silhouettes cut for where the tide meets the party.",
      image: "/images/products/bora-bora-tiered-beach-maxi-dress.jpg",
      footer: "SWIPE TO EXPLORE THE EDITS ⟶",
      badge: "NEW ARRIVALS"
    },
    2: {
      tag: "DESTINATION 01 • BALI, INDONESIA",
      title: "BALI<br>SUNDOWNS 🌴",
      subtitle: "Maldives Drawstring Co-ord Set — Pure organic breathable crinkle linen for slow tropical afternoons.",
      image: "/images/products/maldives-drawstring-resort-co-ord-set.jpg",
      footer: "01 / 04 SILHOUETTES",
      badge: "CO-ORD EDIT"
    },
    3: {
      tag: "DESTINATION 02 • SANTORINI, GREECE",
      title: "SANTORINI<br>GOLDEN HOUR 🏛️",
      subtitle: "Santorini 3D Floral Silk Slip — Handcrafted organza florals draped over shimmering pure mulberry silk.",
      image: "/images/products/santorini-3d-floral-silk-slip-dress.jpg",
      footer: "02 / 04 SILHOUETTES",
      badge: "WEDDING NIGHT EDIT"
    },
    4: {
      tag: "DESTINATION 03 • AMALFI COAST, ITALY",
      title: "AMALFI<br>CLIFFSIDE DINNERS 🌊",
      subtitle: "Amalfi Sundown Pleated Maxi — Ethereal movement and sculpted pleating made for oceanside cocktails.",
      image: "/images/products/amalfi-sundown-pleated-maxi-dress.jpg",
      footer: "03 / 04 SILHOUETTES",
      badge: "RESORT EVENING EDIT"
    },
    5: {
      tag: "OFFICIAL LAUNCH OFFER",
      title: "YOUR FIRST LOOK<br>IS WAITING. ✨",
      subtitle: "Designed & hand-finished in India. Shipped to shores around the world.",
      image: "/images/products/mykonos-pearl-draped-cowl-back-gown.jpg",
      footer: "TAP LINK IN BIO • SANDLINE.STORE",
      badge: "10% OFF CODE: WELCOME10",
      isCta: true
    }
  };

  const s = slides[slideNum];
  const imgPath = path.join(__dirname, '..', 'public', s.image);
  let base64Img = '';
  if (fs.existsSync(imgPath)) {
    base64Img = 'data:image/jpeg;base64,' + fs.readFileSync(imgPath).toString('base64');
  }

  const logoPath = path.join(__dirname, '../public/images/logo-horizontal-white.png');
  const base64Logo = fs.existsSync(logoPath)
    ? 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64')
    : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,700;1,400&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      width: 1080px;
      height: 1350px;
      overflow: hidden;
      background: #111827;
      font-family: 'Montserrat', sans-serif;
      color: #FFFFFF;
      position: relative;
    }
    .bg-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .gradient-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(17,24,39,0.35) 0%, rgba(17,24,39,0.15) 40%, rgba(17,24,39,0.85) 75%, rgba(17,24,39,0.98) 100%);
    }
    .top-bar {
      position: absolute;
      top: 60px;
      left: 70px;
      right: 70px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
    }
    .brand-logo {
      height: 48px;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));
    }
    .badge {
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.35);
      padding: 8px 18px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #FBBF24;
    }
    .content-box {
      position: absolute;
      bottom: 70px;
      left: 70px;
      right: 70px;
      z-index: 10;
    }
    .tagline {
      font-size: 16px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #FBBF24;
      font-weight: 700;
      margin-bottom: 14px;
    }
    .title {
      font-family: 'Playfair Display', serif;
      font-size: 58px;
      line-height: 1.15;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 18px;
      text-shadow: 0 4px 20px rgba(0,0,0,0.6);
    }
    .subtitle {
      font-size: 20px;
      line-height: 1.5;
      color: rgba(255,255,255,0.88);
      max-width: 820px;
      margin-bottom: 30px;
      font-weight: 400;
    }
    .cta-card {
      background: #FAF8F5;
      color: #111827;
      border-radius: 20px;
      padding: 24px 30px;
      margin-bottom: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }
    .cta-code {
      font-family: 'Cinzel', serif;
      font-size: 28px;
      font-weight: 700;
      color: #D97706;
      letter-spacing: 2px;
    }
    .cta-site {
      font-size: 16px;
      font-weight: 700;
      color: #111827;
      letter-spacing: 1px;
    }
    .footer-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255,255,255,0.2);
      padding-top: 20px;
      font-size: 15px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.7);
      font-weight: 600;
    }
  </style>
</head>
<body>
  <img src="${base64Img}" class="bg-img" alt="Sandline">
  <div class="gradient-overlay"></div>

  <div class="top-bar">
    <img src="${base64Logo}" class="brand-logo" alt="SANDLINE">
    <div class="badge">${s.badge}</div>
  </div>

  <div class="content-box">
    <div class="tagline">${s.tag}</div>
    <h1 class="title">${s.title}</h1>
    <p class="subtitle">${s.subtitle}</p>

    ${s.isCta ? `
    <div class="cta-card">
      <div>
        <div style="font-size: 13px; text-transform: uppercase; color: #78716C; letter-spacing: 1px;">WELCOME OFFER</div>
        <div class="cta-code">WELCOME10</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 13px; text-transform: uppercase; color: #78716C; letter-spacing: 1px;">SHOP AT</div>
        <div class="cta-site">SANDLINE.STORE ↗</div>
      </div>
    </div>
    ` : ''}

    <div class="footer-bar">
      <span>${s.footer}</span>
      <span>SANDLINE.STORE</span>
    </div>
  </div>
</body>
</html>`;
}

// 2. HTML TEMPLATE FOR 3 LAUNCH STORIES (1080 x 1920)
function generateStoryHtml(storyNum) {
  const stories = {
    1: {
      tag: "THE RESORT AESTHETIC",
      quote: "“Dresses cut for where the tide meets the party.”",
      subtitle: "Handcrafted silks & breezy linens made for sun-drenched escapes.",
      image: "/images/products/santorini-3d-floral-silk-slip-dress.jpg",
      bottomText: "TAP TO EXPLORE THE NEW EDITS 👇"
    },
    2: {
      tag: "INDIAN ATELIER CRAFTSMANSHIP",
      quote: "“100% Hand-Finished in India.”",
      subtitle: "Generational craftsmanship shipped directly to 40+ countries worldwide.",
      image: "/images/products/monaco-hand-embroidered-co-ord-set.jpg",
      bottomText: "WORLDWIDE EXPRESS SHIPPING ✈️"
    },
    3: {
      tag: "OFFICIAL DROP IS LIVE",
      quote: "“10% OFF Your First Look.”",
      subtitle: "Use exclusive launch code: WELCOME10 at checkout.",
      image: "/images/products/riviera-crystal-embellished-halter-dress.jpg",
      bottomText: "TAP THE STICKER BELOW TO SHOP 👇",
      isLinkSlide: true
    }
  };

  const st = stories[storyNum];
  const imgPath = path.join(__dirname, '..', 'public', st.image);
  let base64Img = '';
  if (fs.existsSync(imgPath)) {
    base64Img = 'data:image/jpeg;base64,' + fs.readFileSync(imgPath).toString('base64');
  }

  const logoPath = path.join(__dirname, '../public/images/logo-horizontal-white.png');
  const base64Logo = fs.existsSync(logoPath)
    ? 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64')
    : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,700;1,400&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      background: #111827;
      font-family: 'Montserrat', sans-serif;
      color: #FFFFFF;
      position: relative;
    }
    .bg-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .gradient-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(17,24,39,0.5) 0%, rgba(17,24,39,0.2) 30%, rgba(17,24,39,0.75) 70%, rgba(17,24,39,0.96) 100%);
    }
    .top-branding {
      position: absolute;
      top: 120px;
      left: 0;
      right: 0;
      text-align: center;
      z-index: 10;
    }
    .brand-logo {
      height: 52px;
      filter: drop-shadow(0 4px 16px rgba(0,0,0,0.6));
    }
    .tag-badge {
      display: inline-block;
      margin-top: 18px;
      background: rgba(255,255,255,0.18);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.3);
      padding: 10px 24px;
      border-radius: 999px;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #FBBF24;
    }
    .content-box {
      position: absolute;
      bottom: 160px;
      left: 70px;
      right: 70px;
      z-index: 10;
      text-align: center;
    }
    .quote {
      font-family: 'Playfair Display', serif;
      font-size: 52px;
      line-height: 1.25;
      font-style: italic;
      color: #FFFFFF;
      margin-bottom: 20px;
      text-shadow: 0 4px 24px rgba(0,0,0,0.7);
    }
    .subtitle {
      font-size: 22px;
      line-height: 1.5;
      color: rgba(255,255,255,0.9);
      max-width: 860px;
      margin: 0 auto 40px;
      font-weight: 400;
    }
    .link-sticker-box {
      background: #FAF8F5;
      color: #111827;
      border-radius: 50px;
      padding: 22px 40px;
      display: inline-flex;
      align-items: center;
      gap: 14px;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 1px;
      box-shadow: 0 12px 36px rgba(0,0,0,0.5);
      margin-bottom: 30px;
    }
    .link-sticker-box span.code {
      color: #D97706;
      font-family: 'Space Mono', monospace;
    }
    .bottom-prompt {
      font-size: 17px;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: #FBBF24;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <img src="${base64Img}" class="bg-img" alt="Sandline Story">
  <div class="gradient-overlay"></div>

  <div class="top-branding">
    <img src="${base64Logo}" class="brand-logo" alt="SANDLINE">
    <br>
    <div class="tag-badge">${st.tag}</div>
  </div>

  <div class="content-box">
    <div class="quote">${st.quote}</div>
    <p class="subtitle">${st.subtitle}</p>

    ${st.isLinkSlide ? `
    <div class="link-sticker-box">
      <span>🛍️ CODE: <span class="code">WELCOME10</span> (10% OFF)</span>
    </div>
    ` : ''}

    <div class="bottom-prompt">${st.bottomText}</div>
  </div>
</body>
</html>`;
}

async function main() {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

  console.log('Generating Carousel Slides (1080x1350)...');
  for (let i = 1; i <= 5; i++) {
    const html = generateCarouselHtml(i);
    const htmlFile = path.join(outDir, `post2-slide${i}.html`);
    const pngFile = path.join(outDir, `post2-slide${i}.png`);
    fs.writeFileSync(htmlFile, html, 'utf8');

    execSync(`"${chromePath}" --headless --disable-gpu --no-sandbox --user-data-dir=/tmp/chrome-insta-data --window-size=1080,1350 --screenshot="${pngFile}" "${htmlFile}"`);
    console.log(`Generated: post2-slide${i}.png`);
  }

  console.log('Generating Launch Stories (1080x1920)...');
  for (let i = 1; i <= 3; i++) {
    const html = generateStoryHtml(i);
    const htmlFile = path.join(outDir, `story-slide${i}.html`);
    const pngFile = path.join(outDir, `story-slide${i}.png`);
    fs.writeFileSync(htmlFile, html, 'utf8');

    execSync(`"${chromePath}" --headless --disable-gpu --no-sandbox --user-data-dir=/tmp/chrome-insta-data --window-size=1080,1920 --screenshot="${pngFile}" "${htmlFile}"`);
    console.log(`Generated: story-slide${i}.png`);
  }

  console.log('All 8 Instagram Creatives Successfully Generated in /public/instagram-assets!');
}

main().catch(console.error);
