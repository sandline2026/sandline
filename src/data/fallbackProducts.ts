export interface Product {
  id: string;
  name: string;
  slug: string;
  collection: string;
  selling_price_usd: number;
  cost_price?: number;
  dropship_fee?: number;
  stock_quantity?: number;
  fabric?: string;
  colors?: string[];
  sizes?: string[];
  stock_status?: string;
  images: string[];
  description?: string;
  is_active: boolean;
  created_at?: string;
}

export const FALLBACK_PRODUCTS: Product[] = [
  {
    "id": "prod-1",
    "name": "Tulum Terracotta Laser-Cut Maxi Set",
    "slug": "tulum-terracotta-laser-cut-maxi-set",
    "collection": "beach_party",
    "selling_price_usd": 50.6,
    "cost_price": 1000,
    "dropship_fee": 250,
    "stock_quantity": 50,
    "fabric": "Terracotta Linen Blend with Intricate Laser Cutwork",
    "colors": [
      "Terracotta",
      "Sand"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/tulum-terracotta-laser-cut-maxi-set.jpg"
    ],
    "description": "An architectural vacation silhouette featuring a structured laser-cut bandeau and matching tiered column maxi skirt in earth-toned terracotta.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.052Z"
  },
  {
    "id": "prod-2",
    "name": "Mykonos Scallop Crochet Maxi Set",
    "slug": "mykonos-scallop-crochet-maxi-set",
    "collection": "beach_party",
    "selling_price_usd": 34,
    "cost_price": 1000,
    "dropship_fee": 250,
    "stock_quantity": 50,
    "fabric": "Artisanal Open-Weave Cotton Crochet",
    "colors": [
      "Natural Ivory"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/mykonos-scallop-crochet-maxi-set.jpg"
    ],
    "description": "Handmade scalloped cotton crochet co-ord set designed for sun-drenched beach club lounges from Mykonos to Ibiza.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-3",
    "name": "Saint-Tropez Citrus Tiered Chiffon Dress",
    "slug": "saint-tropez-citrus-tiered-chiffon-dress",
    "collection": "resort_evening",
    "selling_price_usd": 32,
    "cost_price": 1000,
    "dropship_fee": 250,
    "stock_quantity": 50,
    "fabric": "Breezy Sheer Chiffon Silk with Soft Silk Slip Lining",
    "colors": [
      "Citrus Yellow",
      "Ivory"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/saint-tropez-citrus-tiered-chiffon-dress.jpg"
    ],
    "description": "Billowing tiers of vibrant citrus chiffon silk move effortlessly with the coastal breeze. Perfect for sundown spritzers.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-4",
    "name": "Ibiza Tassel Crochet & Sarong Set",
    "slug": "ibiza-tassel-crochet-watercolor-sarong-set",
    "collection": "beach_party",
    "selling_price_usd": 31,
    "cost_price": 1000,
    "dropship_fee": 250,
    "stock_quantity": 50,
    "fabric": "Fine Crochet Cotton & Flowing Satin Sarong",
    "colors": [
      "Coral Watercolor",
      "Ecru"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/ibiza-tassel-crochet-watercolor-sarong-set.jpg"
    ],
    "description": "Bohemian luxury at its finest. Fringed halter crochet top paired with a flowing watercolor print wrap sarong.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-5",
    "name": "Maldives Sunset Cutout Swimsuit & Sarong Set",
    "slug": "maldives-sunset-cutout-swimsuit-sarong-set",
    "collection": "beach_party",
    "selling_price_usd": 29,
    "cost_price": 1000,
    "dropship_fee": 250,
    "stock_quantity": 50,
    "fabric": "Premium Ribbed Swim Fabric & Sheer Voile Sarong",
    "colors": [
      "Sunset Gold",
      "Warm Amber"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/maldives-sunset-cutout-swimsuit-sarong-set.jpg"
    ],
    "description": "Sculpted asymmetric cutout one-piece swimsuit paired with a lightweight breezy resort sarong wrap.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-6",
    "name": "Santorini Daisy Cutout Halter Swimsuit",
    "slug": "santorini-daisy-cutout-halter-swimsuit",
    "collection": "beach_party",
    "selling_price_usd": 28,
    "cost_price": 1000,
    "dropship_fee": 250,
    "stock_quantity": 50,
    "fabric": "Textured Daisy Jacquard Swim Spandex",
    "colors": [
      "Aegean Blue",
      "Chalk White"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/santorini-daisy-cutout-halter-swimsuit.jpg"
    ],
    "description": "Retro-inspired halter swimsuit with playful daisy cutouts and high-leg silhouette for Mediterranean shores.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-7",
    "name": "Jaipur Blossom Embroidered Poplin Overshirt",
    "slug": "jaipur-blossom-embroidered-poplin-overshirt",
    "collection": "beach_party",
    "selling_price_usd": 58,
    "cost_price": 1200,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "100% Pure Jaipur Cotton Poplin with Cutwork Embroidery",
    "colors": [
      "Blush Pink",
      "Ivory White"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/jaipur-blossom-striped-overshirt.jpg"
    ],
    "description": "Hand-finished in our Jaipur atelier, this oversized cotton poplin shirt is adorned with intricate pink floral cutwork embroidery across the front hem. Perfect as a breezy beach coverup or an effortless coastal layer.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-8",
    "name": "Riviera Crystal Pinstripe Tie Blouse",
    "slug": "riviera-crystal-pinstripe-tie-blouse",
    "collection": "resort_evening",
    "selling_price_usd": 72,
    "cost_price": 1600,
    "dropship_fee": 250,
    "stock_quantity": 20,
    "fabric": "Fine Egyptian Cotton Poplin & Hand-Sewn Rhinestone Crystals",
    "colors": [
      "Sky Blue",
      "Chalk White"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/riviera-crystal-pinstripe-tie-shirt.jpg"
    ],
    "description": "An exquisite evening statement piece. Cut from crisp pinstripe poplin, featuring hand-set crystal rhinestone embellishments along the sharp collar and asymmetric diagonal tie-front placket.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-9",
    "name": "Positano Ruffle Tiered Resort Blouse",
    "slug": "positano-ruffle-tiered-resort-blouse",
    "collection": "honeymoon",
    "selling_price_usd": 44,
    "cost_price": 850,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Breezy Cotton Voile",
    "colors": [
      "Ivory White",
      "Sand"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/positano-ruffle-tiered-resort-blouse.jpg"
    ],
    "description": "Delicate cascading ruffles and romantic bell sleeves make this airy blouse an essential for sunset cocktails and candlelit dinners by the coast.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-10",
    "name": "Riviera Lace-Up Placket Cotton Blouse",
    "slug": "riviera-lace-up-placket-cotton-blouse",
    "collection": "honeymoon",
    "selling_price_usd": 46,
    "cost_price": 900,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Pure Slub Cotton",
    "colors": [
      "Coastal White",
      "Ecru"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/riviera-lace-up-placket-cotton-blouse.jpg"
    ],
    "description": "Relaxed resort silhouette featuring a lace-up grommet neckline and breathable weave tailored for warm golden days.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-11",
    "name": "Capri Tie-Up Linen Placket Blouse",
    "slug": "capri-tie-up-linen-placket-blouse",
    "collection": "honeymoon",
    "selling_price_usd": 48,
    "cost_price": 950,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Linen Cotton Blend",
    "colors": [
      "Sand White",
      "Natural Oatmeal"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/capri-tie-up-linen-placket-blouse.jpg"
    ],
    "description": "Clean resort elegance featuring front tassel ties, gathered cuffs, and an easy relaxed drape.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-12",
    "name": "Milan Plaid Cropped Resort Overshirt",
    "slug": "milan-plaid-cropped-resort-overshirt",
    "collection": "resort_evening",
    "selling_price_usd": 52,
    "cost_price": 1050,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Structured Twill Cotton",
    "colors": [
      "Sage Green",
      "Sand Beige"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/milan-plaid-cropped-resort-overshirt.jpg"
    ],
    "description": "Modern cropped silhouette in classic heritage plaid. Features tailored flap pockets and premium horn buttons.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-13",
    "name": "Arezzo Front-Twist Striped Blouse",
    "slug": "arezzo-front-twist-striped-blouse",
    "collection": "resort_evening",
    "selling_price_usd": 46,
    "cost_price": 880,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Cotton Silk Poplin",
    "colors": [
      "Azure Blue",
      "White"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/arezzo-front-twist-striped-blouse.jpg"
    ],
    "description": "Figure-flattering twist-front accent with vertical pinstripes designed to elongate the silhouette.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-14",
    "name": "Elysian Tie-Up A-Line Resort Dress",
    "slug": "elysian-tie-up-a-line-resort-dress",
    "collection": "honeymoon",
    "selling_price_usd": 62,
    "cost_price": 1300,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Flowing Chiffon Georgette",
    "colors": [
      "Sunlit Peach",
      "Coral"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/elysian-tie-up-a-line-resort-dress.jpg"
    ],
    "description": "Romantic A-line midi dress with adjustable tie-up shoulder ribbons and a graceful flared skirt hem.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-15",
    "name": "Amalfi Contrast Trim Silk A-Line Dress",
    "slug": "amalfi-contrast-trim-silk-a-line-dress",
    "collection": "honeymoon",
    "selling_price_usd": 65,
    "cost_price": 1350,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Mulberry Silk Blend",
    "colors": [
      "Onyx Black",
      "Ecru Cream"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/amalfi-contrast-trim-silk-a-line-dress.jpg"
    ],
    "description": "Striking contrast piped edges highlight this timeless A-line silhouette, finished with a subtle side slit.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-16",
    "name": "Santorini 3D Floral Silk Slip Dress",
    "slug": "santorini-3d-floral-silk-slip-dress",
    "collection": "honeymoon",
    "selling_price_usd": 78,
    "cost_price": 1700,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Silk Satin & Handcrafted 3D Organza Florals",
    "colors": [
      "Champagne Pearl",
      "Ivory"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/santorini-3d-floral-silk-slip-dress.jpg"
    ],
    "description": "An artisan showstopper featuring sculpted 3D floral petals cascading along the cowl neckline and backless drape.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-17",
    "name": "Ibiza Backless Halter Linen Top",
    "slug": "ibiza-backless-halter-linen-top",
    "collection": "beach_party",
    "selling_price_usd": 38,
    "cost_price": 700,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "100% Pure Organic Linen",
    "colors": [
      "Terracotta Sunset",
      "Rust"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/ibiza-backless-halter-linen-top.jpg"
    ],
    "description": "Minimalist open-back halter top with self-tie neck cords, crafted for warm beach parties and tropical getaways.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-18",
    "name": "Kyoto Sheer Organza Cami Top",
    "slug": "kyoto-sheer-organza-cami-top",
    "collection": "honeymoon",
    "selling_price_usd": 36,
    "cost_price": 680,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Double-Layered Sheer Organza",
    "colors": [
      "Midnight Noir",
      "Black"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/kyoto-sheer-organza-cami-top.jpg"
    ],
    "description": "Ethereal sheer texture with delicate spaghetti straps and a subtle flared peplum hem.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-19",
    "name": "Mykonos Smocked Linen Co-ord Set",
    "slug": "mykonos-smocked-linen-co-ord-set",
    "collection": "beach_party",
    "selling_price_usd": 68,
    "cost_price": 1400,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Premium Crinkled Linen",
    "colors": [
      "Aegean Sky Blue",
      "White"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/mykonos-smocked-linen-co-ord-set.jpg"
    ],
    "description": "Two-piece matching set featuring a smocked bodice crop top paired with high-waisted flowing wide-leg trousers.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-20",
    "name": "St. Tropez Ruffle Tiered Skirt Co-ord Set",
    "slug": "st-tropez-ruffle-tiered-skirt-co-ord-set",
    "collection": "beach_party",
    "selling_price_usd": 64,
    "cost_price": 1350,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Cotton Poplin",
    "colors": [
      "Lemon Sorbet",
      "Vanilla"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/st-tropez-ruffle-tiered-skirt-co-ord-set.jpg"
    ],
    "description": "Flirty ruffled crop top matched with a playful tiered mini skirt. Finished with elasticated comfort waist.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-21",
    "name": "Bali Contrast Trim Resort Co-ord Set",
    "slug": "bali-contrast-trim-resort-co-ord-set",
    "collection": "beach_party",
    "selling_price_usd": 66,
    "cost_price": 1380,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Textured Linen Blend",
    "colors": [
      "Oatmeal Beige",
      "Navy Blue"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/bali-contrast-trim-resort-co-ord-set.jpg"
    ],
    "description": "Tailored resort co-ord set with contrasting nautical binding on collar, pockets, and trouser hems.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-22",
    "name": "Tulum Crossed Wrap Halter Co-ord Set",
    "slug": "tulum-crossed-wrap-halter-co-ord-set",
    "collection": "beach_party",
    "selling_price_usd": 68,
    "cost_price": 1420,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Stretch Ribbed Knit",
    "colors": [
      "Burnt Ochre",
      "Terracotta"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/tulum-crossed-wrap-halter-co-ord-set.jpg"
    ],
    "description": "Cross-front wrap top with matching high-rise midi skirt, engineered for beach clubs and sunset lounges.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-23",
    "name": "Maui Relaxed Linen Lounge Co-ord Set",
    "slug": "maui-relaxed-linen-lounge-co-ord-set",
    "collection": "beach_party",
    "selling_price_usd": 62,
    "cost_price": 1300,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Pure European Linen",
    "colors": [
      "Natural Stone",
      "Ecru"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/maui-relaxed-linen-lounge-co-ord-set.jpg"
    ],
    "description": "Ultra-comfortable relaxed resort shirt and matching tailored shorts with deep slip pockets.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-24",
    "name": "Monaco Hand-Embroidered Co-ord Set",
    "slug": "monaco-hand-embroidered-co-ord-set",
    "collection": "honeymoon",
    "selling_price_usd": 76,
    "cost_price": 1650,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Fine Cotton Cambric & Resham Threadwork",
    "colors": [
      "Pearl Cream",
      "Ivory"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/monaco-hand-embroidered-co-ord-set.jpg"
    ],
    "description": "Delicate tonal floral embroidery across the scalloped collar and sleeves. An heirloom luxury co-ord set.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-25",
    "name": "Paloma Gathered Waist Co-ord Set",
    "slug": "paloma-gathered-waist-co-ord-set",
    "collection": "beach_party",
    "selling_price_usd": 68,
    "cost_price": 1400,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Washed Cotton Sateen",
    "colors": [
      "Coral Sunrise",
      "Peach"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/paloma-gathered-waist-co-ord-set.jpg"
    ],
    "description": "Cinched gathered waistline top paired with fluid wide trousers, offering both shape and effortless ease.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-26",
    "name": "Cabo Elastic Linen Shorts Co-ord Set",
    "slug": "cabo-elastic-linen-shorts-co-ord-set",
    "collection": "beach_party",
    "selling_price_usd": 58,
    "cost_price": 1200,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Slub Linen Blend",
    "colors": [
      "Olive Mist",
      "Moss"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/cabo-elastic-linen-shorts-co-ord-set.jpg"
    ],
    "description": "Relaxed button-down shirt with drawstring pull-on shorts. The ultimate packing staple for sunny holidays.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-27",
    "name": "Maldives Drawstring Resort Co-ord Set",
    "slug": "maldives-drawstring-resort-co-ord-set",
    "collection": "beach_party",
    "selling_price_usd": 65,
    "cost_price": 1350,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Crinkle Cotton Gauze",
    "colors": [
      "Sea Salt White",
      "Ivory"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/maldives-drawstring-resort-co-ord-set.jpg"
    ],
    "description": "Airy lightweight gauze fabric with adjustable ruched drawstring ties on the bodice and trousers.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-28",
    "name": "Sunset Hooded Knit Resort Co-ord Set",
    "slug": "sunset-hooded-knit-resort-co-ord-set",
    "collection": "beach_party",
    "selling_price_usd": 68,
    "cost_price": 1450,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Lightweight Open-Weave Crochet Knit",
    "colors": [
      "Dune Beige",
      "Sand"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/sunset-hooded-knit-resort-co-ord-set.jpg"
    ],
    "description": "Beachside crochet hoodie paired with relaxed pull-on shorts for breezy boat rides and cool evening strolls.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-29",
    "name": "Riviera Safari Pocket Co-ord Set",
    "slug": "riviera-safari-pocket-co-ord-set",
    "collection": "beach_party",
    "selling_price_usd": 64,
    "cost_price": 1300,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Structured Heavy Cotton Linen",
    "colors": [
      "Khaki Dune",
      "Olive"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/riviera-safari-pocket-co-ord-set.jpg"
    ],
    "description": "Utility-inspired cargo pockets meet luxury resort tailoring in this sharp two-piece set.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-30",
    "name": "Bora Bora Tiered Beach Maxi Dress",
    "slug": "bora-bora-tiered-beach-maxi-dress",
    "collection": "beach_party",
    "selling_price_usd": 58,
    "cost_price": 1250,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "100% Cotton Muslin",
    "colors": [
      "Sunshine Floral",
      "Marigold"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/bora-bora-tiered-beach-maxi-dress.jpg"
    ],
    "description": "Voluminous tiered maxi dress that sways gracefully with every ocean breeze. Features an adjustable back tie.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-31",
    "name": "Venice Hand-Beaded Straight-Leg Denim",
    "slug": "venice-hand-beaded-straight-leg-denim",
    "collection": "resort_evening",
    "selling_price_usd": 74,
    "cost_price": 1750,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Premium Rigid Indigo Denim & Glass Pearls",
    "colors": [
      "Vintage Medium Wash",
      "Light Indigo"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/venice-hand-beaded-straight-leg-denim.jpg"
    ],
    "description": "High-waist straight leg jeans hand-embellished with luminous pearls and metallic beading along the front panels.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-32",
    "name": "Santorini Embroidered Denim Wide-Leg Shorts",
    "slug": "santorini-embroidered-denim-wide-leg-shorts",
    "collection": "beach_party",
    "selling_price_usd": 48,
    "cost_price": 980,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "100% Cotton Light Wash Denim",
    "colors": [
      "Bleach Cloud Blue",
      "Ice Blue"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/santorini-embroidered-denim-wide-leg-shorts.jpg"
    ],
    "description": "Wide A-line denim shorts embellished with delicate white floral embroidery along the side seams.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-33",
    "name": "Portofino Vintage Button Denim Culotte Shorts",
    "slug": "portofino-vintage-button-denim-culotte-shorts",
    "collection": "beach_party",
    "selling_price_usd": 46,
    "cost_price": 950,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Mid-Weight Comfort Denim",
    "colors": [
      "Vintage Mid Blue",
      "Classic Indigo"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/portofino-vintage-button-denim-culotte-shorts.jpg"
    ],
    "description": "High-waisted maritime sailor button closure on structured culotte denim shorts.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-34",
    "name": "Florence Vintage Embroidered Flare Jeans",
    "slug": "florence-vintage-embroidered-flare-jeans",
    "collection": "resort_evening",
    "selling_price_usd": 72,
    "cost_price": 1650,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Comfort Stretch Turkish Denim",
    "colors": [
      "Indigo Ocean",
      "Dark Blue"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/florence-vintage-embroidered-flare-jeans.jpg"
    ],
    "description": "Dramatic 70s-inspired bell bottom flare jeans with intricate artisan chain-stitch embroidery down the leg.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-35",
    "name": "Verona Pintuck Seam Raw Hem Wide-Leg Jeans",
    "slug": "verona-pintuck-seam-raw-hem-wide-leg-jeans",
    "collection": "resort_evening",
    "selling_price_usd": 68,
    "cost_price": 1550,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Heavyweight 13oz Selvedge Denim",
    "colors": [
      "Dark Raw Indigo",
      "Midnight Blue"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/verona-pintuck-seam-raw-hem-wide-leg-jeans.jpg"
    ],
    "description": "Sharp front pintuck tailored crease with an unhemmed raw edge. Elongates the legs effortlessly.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-36",
    "name": "Cherry Blossom Embroidered Wide-Leg Jeans",
    "slug": "cherry-blossom-embroidered-wide-leg-jeans",
    "collection": "resort_evening",
    "selling_price_usd": 66,
    "cost_price": 1500,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Premium Cotton Slub Denim",
    "colors": [
      "Washed Stonewash Blue",
      "Cherry Red"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/cherry-blossom-embroidered-wide-leg-jeans.jpg"
    ],
    "description": "Playful crimson cherry embroidery scattered over high-waisted relaxed wide-leg trousers.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-37",
    "name": "Parisian Bow Detail Wide-Leg Denim",
    "slug": "parisian-bow-detail-wide-leg-denim",
    "collection": "resort_evening",
    "selling_price_usd": 68,
    "cost_price": 1550,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Soft Washed Twill Denim",
    "colors": [
      "Vintage Mid Blue",
      "Classic Denim"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/parisian-bow-detail-wide-leg-denim.jpg"
    ],
    "description": "Charming denim bow accents at the waistline, paired with an ultra-flattering wide leg silhouette.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-38",
    "name": "Riviera Atelier Decorative Pocket Wide-Leg Jeans",
    "slug": "riviera-atelier-decorative-pocket-wide-leg-jeans",
    "collection": "resort_evening",
    "selling_price_usd": 68,
    "cost_price": 1580,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "100% Pure Ring-Spun Cotton Denim",
    "colors": [
      "Dark Indigo Wash",
      "Raw Denim"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/riviera-atelier-decorative-pocket-wide-leg-jeans.jpg"
    ],
    "description": "Sculpted decorative tailored front pockets with contrast gold topstitching and wide fluid drape.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-39",
    "name": "Corfu Distressed Denim Bermuda Shorts",
    "slug": "corfu-distressed-denim-bermuda-shorts",
    "collection": "beach_party",
    "selling_price_usd": 48,
    "cost_price": 980,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Distressed 100% Cotton Denim",
    "colors": [
      "Vintage Sunbleached Blue",
      "Faded Denim"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/corfu-distressed-denim-bermuda-shorts.jpg"
    ],
    "description": "Relaxed Bermuda length with artisanal raw distressing and frayed hem. Perfect for coastal getaways.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-40",
    "name": "Cognac Vegan Leather Chain Mini Skirt",
    "slug": "cognac-vegan-leather-chain-mini-skirt",
    "collection": "resort_evening",
    "selling_price_usd": 68,
    "cost_price": 24,
    "dropship_fee": 250,
    "stock_quantity": 18,
    "fabric": "Buttery Vegan Leather & Gold Hardware",
    "colors": [
      "Cognac Brown"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/cognac-vegan-leather-chain-skirt-1.jpg",
      "/images/products/cognac-vegan-leather-chain-skirt-2.jpg"
    ],
    "description": "Sculpted in rich buttery cognac vegan leather, featuring a signature chunky gold curb-chain waist belt and tailored A-line silhouette for dusk-to-dawn resort evenings.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-41",
    "name": "St. Tropez 3D Floral Lace Denim Skirt",
    "slug": "st-tropez-3d-floral-lace-denim-skirt",
    "collection": "beach_party",
    "selling_price_usd": 62,
    "cost_price": 22,
    "dropship_fee": 250,
    "stock_quantity": 20,
    "fabric": "Light-Wash Rigid Denim & Embroidered Lace",
    "colors": [
      "Sky Blue Denim / White"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/st-tropez-floral-lace-denim-skirt-1.jpg",
      "/images/products/st-tropez-floral-lace-denim-skirt-2.jpg"
    ],
    "description": "Signature summer denim skirt in vintage sky blue wash, finished with hand-appliquéd 3D floral lace embroidery, faux pearls, and light crystal embellishments.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-42",
    "name": "Venice Pearl Fringe Distressed Denim Jacket",
    "slug": "venice-pearl-fringe-distressed-denim-jacket",
    "collection": "resort_evening",
    "selling_price_usd": 88,
    "cost_price": 32,
    "dropship_fee": 250,
    "stock_quantity": 12,
    "fabric": "Distressed Cotton Denim & Pearl Fringe",
    "colors": [
      "Bleach Blue"
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/venice-pearl-fringe-denim-jacket-1.jpg",
      "/images/products/venice-pearl-fringe-denim-jacket-2.jpg"
    ],
    "description": "Couture craftsmanship meets relaxed streetwear. Features custom hand-strung pearl cascades and crystal tassel fringe draping across distressed denim flap pockets.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-43",
    "name": "Milan Pearl Mesh Back Detail Silk Shirt",
    "slug": "milan-pearl-mesh-back-detail-silk-shirt",
    "collection": "resort_evening",
    "selling_price_usd": 76,
    "cost_price": 28,
    "dropship_fee": 250,
    "stock_quantity": 15,
    "fabric": "Lustrous Cotton Silk Blend",
    "colors": [
      "Noir Black"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/milan-pearl-mesh-back-shirt-1.jpg",
      "/images/products/milan-pearl-mesh-back-shirt-2.jpg"
    ],
    "description": "A tailored oversized black silk-cotton shirt that reveals an exquisite open V-back adorned with layered pearl mesh netting and metallic beadwork.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-44",
    "name": "Espresso Silk Satin Backless Halter Top",
    "slug": "espresso-silk-satin-backless-halter-top",
    "collection": "resort_evening",
    "selling_price_usd": 48,
    "cost_price": 18,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Mulberry Silk Satin",
    "colors": [
      "Espresso Brown"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/espresso-satin-backless-halter-top-1.jpg",
      "/images/products/espresso-satin-backless-halter-top-2.jpg"
    ],
    "description": "Liquid silk satin halter top featuring a high draped neckline, open back with delicate criss-cross ties, and subtle lustrous sheen.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-45",
    "name": "Tropical Paisley Cami & Tiered Skirt Co-ord Set",
    "slug": "tropical-paisley-cami-tiered-skirt-co-ord-set",
    "collection": "beach_party",
    "selling_price_usd": 68,
    "cost_price": 25,
    "dropship_fee": 250,
    "stock_quantity": 16,
    "fabric": "Lightweight Printed Chiffon & Cotton Poplin",
    "colors": [
      "Emerald Paisley / Ivory"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/tropical-paisley-tiered-skirt-co-ord-1.jpg"
    ],
    "description": "An ethereal two-piece resort ensemble featuring an emerald paisley handkerchief camisole top paired with a tiered ruffle cotton mini skirt.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-46",
    "name": "Champagne Silk Satin Lapel Blouse",
    "slug": "champagne-silk-satin-lapel-blouse",
    "collection": "resort_evening",
    "selling_price_usd": 64,
    "cost_price": 24,
    "dropship_fee": 250,
    "stock_quantity": 22,
    "fabric": "Ultra-Fine Silk Charmeuse",
    "colors": [
      "Champagne Gold"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/champagne-silk-satin-lapel-blouse-1.jpg",
      "/images/products/champagne-silk-satin-lapel-blouse-2.jpg"
    ],
    "description": "Timeless luxury crafted in high-luster champagne silk charmeuse with deep notched lapels, mother-of-pearl buttons, and draped balloon sleeves.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-47",
    "name": "Bohemian Handcrafted Crochet Hexagon Pullover",
    "slug": "bohemian-handcrafted-crochet-hexagon-pullover",
    "collection": "beach_party",
    "selling_price_usd": 72,
    "cost_price": 28,
    "dropship_fee": 250,
    "stock_quantity": 12,
    "fabric": "100% Organic Cotton Crochet Yarn",
    "colors": [
      "Ecru Multi"
    ],
    "sizes": [
      "S/M",
      "L/XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/bohemian-crochet-hexagon-knit-pullover-1.jpg"
    ],
    "description": "Hand-knit artisanal crochet openwork pullover with vibrant sunburst hexagon motifs, scalloped V-neck, and breezy bell sleeves.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-48",
    "name": "Rose Dust One-Shoulder Chiffon Palazzo Set",
    "slug": "rose-dust-one-shoulder-chiffon-palazzo-set",
    "collection": "honeymoon",
    "selling_price_usd": 88,
    "cost_price": 34,
    "dropship_fee": 250,
    "stock_quantity": 10,
    "fabric": "Flowing Pure Georgette Silk",
    "colors": [
      "Rose Dust"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/rose-dust-embroidered-chiffon-palazzo-set-1.jpg"
    ],
    "description": "A breathtaking asymmetric cape-tunic adorned with pearl and zardozi floral neckline embroidery, paired with wide-leg flowing georgette palazzo trousers.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-49",
    "name": "Aegean Starfish Jewel Cutout Resort Maxi Set",
    "slug": "aegean-starfish-jewel-cutout-resort-maxi-set",
    "collection": "beach_party",
    "selling_price_usd": 78,
    "cost_price": 29,
    "dropship_fee": 250,
    "stock_quantity": 14,
    "fabric": "Lurex Shimmer Jersey & Chiffon",
    "colors": [
      "Aegean Ocean Blue"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/aegean-starfish-jewel-maxi-resort-set-1.jpg"
    ],
    "description": "Lustrous ocean blue cutout halter crop with golden starfish jewel hardware, paired with a matching high-slit sheer chiffon maxi sarong skirt.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-50",
    "name": "Solstice Sun & Moon Ruched Halter Cami",
    "slug": "solstice-sun-and-moon-ruched-halter-cami",
    "collection": "beach_party",
    "selling_price_usd": 42,
    "cost_price": 16,
    "dropship_fee": 250,
    "stock_quantity": 20,
    "fabric": "Double-Layered Mesh & Beaded Straps",
    "colors": [
      "Sunburst Tan / Aqua"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/solstice-paisley-sun-moon-halter-top-1.jpg"
    ],
    "description": "Handkerchief hem halter top featuring celestial sun and moon vintage woodblock print, center front ruching, and beaded neck ties.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-51",
    "name": "Mykonos Ivory Geometric Crochet Halter Top",
    "slug": "mykonos-ivory-geometric-crochet-halter-top",
    "collection": "beach_party",
    "selling_price_usd": 39,
    "cost_price": 15,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Handmade Cotton Crochet",
    "colors": [
      "Ivory White"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/mykonos-ivory-crochet-halter-top-1.jpg"
    ],
    "description": "Artisan high-neck crochet bralette with geometric sunburst ladder openwork, designed to pair effortlessly with vintage denim and beach sarongs.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-52",
    "name": "Ibiza Horizon Striped Crochet Bralette & Shorts Set",
    "slug": "ibiza-horizon-striped-crochet-bralette-shorts-set",
    "collection": "beach_party",
    "selling_price_usd": 62,
    "cost_price": 24,
    "dropship_fee": 250,
    "stock_quantity": 18,
    "fabric": "Cotton Knit Crochet",
    "colors": [
      "Candy Pink / Ocean Blue / White"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/ibiza-striped-crochet-bralette-shorts-set-1.jpg"
    ],
    "description": "Vibrant coastal striped two-piece set featuring scalloped floral crochet borders, halter triangle bralette, and matching high-waisted shorts.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-53",
    "name": "Mauve Luminous Silk Cowl Halter Top",
    "slug": "mauve-luminous-silk-cowl-halter-top",
    "collection": "honeymoon",
    "selling_price_usd": 52,
    "cost_price": 19,
    "dropship_fee": 250,
    "stock_quantity": 20,
    "fabric": "Mulberry Silk Charmeuse",
    "colors": [
      "Dusty Mauve"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/mauve-silk-cowl-halter-top-1.jpg"
    ],
    "description": "An ultra-flattering draped cowl neck top in premium mauve silk charmeuse with a high collar neckband and fluid cascading drape.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-54",
    "name": "Monaco Signature Web Stripe Polo Dress",
    "slug": "monaco-signature-web-stripe-polo-dress",
    "collection": "resort_evening",
    "selling_price_usd": 75,
    "cost_price": 28,
    "dropship_fee": 250,
    "stock_quantity": 15,
    "fabric": "Structured Stretch Cotton Piqué & Monogram Trim",
    "colors": [
      "Black / Heritage Web Stripe"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/monaco-signature-web-stripe-polo-dress-1.jpg"
    ],
    "description": "Heritage athletic-luxe polo shirt dress featuring iconic green-and-red web stripes, monogram printed collar & cuffs, and front patch pocket.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-55",
    "name": "Valencia Tangerine Linen 3-Piece Co-ord Set",
    "slug": "valencia-tangerine-linen-3-piece-co-ord-set",
    "collection": "beach_party",
    "selling_price_usd": 86,
    "cost_price": 32,
    "dropship_fee": 250,
    "stock_quantity": 12,
    "fabric": "Pure French Flax Linen",
    "colors": [
      "Tangerine Orange"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/valencia-tangerine-linen-3piece-set-1.jpg"
    ],
    "description": "A bold sunset orange linen three-piece ensemble including an unlined relaxed blazer, halter crop top, and tailored drawstring high-rise shorts.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-56",
    "name": "Positano Sunset Floral Halter & Skirt Set",
    "slug": "positano-sunset-floral-halter-skirt-set",
    "collection": "beach_party",
    "selling_price_usd": 58,
    "cost_price": 22,
    "dropship_fee": 250,
    "stock_quantity": 18,
    "fabric": "Stretch Mesh Bodycon",
    "colors": [
      "Sunset Pink / Coral"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/positano-sunset-floral-halter-skirt-set-1.jpg"
    ],
    "description": "Watercolour floral abstract print two-piece set featuring a cowl halter crop and side-ruched asymmetric drawstring mini skirt.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-57",
    "name": "Santorini Mosaic Scalloped Linen Co-ord Set",
    "slug": "santorini-mosaic-scalloped-linen-co-ord-set",
    "collection": "honeymoon",
    "selling_price_usd": 94,
    "cost_price": 36,
    "dropship_fee": 250,
    "stock_quantity": 14,
    "fabric": "Pure European Linen with Scalloped Ric-Rac Trim",
    "colors": [
      "Santorini Blue / Olive Mosaic"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/santorini-mosaic-scalloped-linen-co-ord-1.jpg"
    ],
    "description": "Inspired by Aegean architectural tiles, this premium linen ensemble pairs an oversized short-sleeve shirt with a matching scalloped wrap skirt.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-58",
    "name": "Maldives Open-Knit Crochet Trousers Set",
    "slug": "maldives-open-knit-crochet-trousers-set",
    "collection": "honeymoon",
    "selling_price_usd": 82,
    "cost_price": 30,
    "dropship_fee": 250,
    "stock_quantity": 12,
    "fabric": "Fine Cotton Open-Knit Crochet",
    "colors": [
      "Sand Nude"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/maldives-open-knit-crochet-trousers-set-1.jpg"
    ],
    "description": "The ultimate overwater villa uniform. Made from breathable open-knit crochet featuring a triangle bralette and high-rise flared beach trousers.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-59",
    "name": "Capri Pink Wave Halter Kerchief Top",
    "slug": "capri-pink-wave-halter-kerchief-top",
    "collection": "beach_party",
    "selling_price_usd": 36,
    "cost_price": 14,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Lightweight Printed Stretch Mesh",
    "colors": [
      "Fuschia Swirl"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/capri-pink-wave-halter-kerchief-top-1.jpg"
    ],
    "description": "Y2K-inspired handkerchief cowl halter top featuring an electric pink marble wave print and delicate neck ties.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-60",
    "name": "Riviera Woven Button Sun Visor Hat",
    "slug": "riviera-woven-button-sun-visor-hat",
    "collection": "beach_party",
    "selling_price_usd": 28,
    "cost_price": 10,
    "dropship_fee": 250,
    "stock_quantity": 30,
    "fabric": "Natural Straw & Cotton Ribbed Trim",
    "colors": [
      "Natural / Black Trim"
    ],
    "sizes": [
      "One Size"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/riviera-button-visor-hat-1.jpg"
    ],
    "description": "Chic coastal sun protection featuring natural open-weave straw crown, wide dark bill, and signature stripe accent band.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-61",
    "name": "St. Tropez Pearl Embellished Straw Hat",
    "slug": "st-tropez-pearl-embellished-straw-hat",
    "collection": "beach_party",
    "selling_price_usd": 34,
    "cost_price": 12,
    "dropship_fee": 250,
    "stock_quantity": 25,
    "fabric": "Fine Braided Straw & Faux Pearl Drops",
    "colors": [
      "Honey Straw"
    ],
    "sizes": [
      "One Size"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/st-tropez-pearl-straw-hat-1.jpg"
    ],
    "description": "Romantic scalloped brim straw hat adorned with delicate pearl drops and a back bow tie for beach club afternoons.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-62",
    "name": "Amalfi Lace-Up Wide Brim Straw Sun Hat",
    "slug": "amalfi-lace-up-wide-brim-straw-sun-hat",
    "collection": "honeymoon",
    "selling_price_usd": 38,
    "cost_price": 14,
    "dropship_fee": 250,
    "stock_quantity": 20,
    "fabric": "100% Natural Paper Straw",
    "colors": [
      "Oatmeal Straw"
    ],
    "sizes": [
      "One Size"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/amalfi-lace-up-wide-brim-straw-hat-1.jpg"
    ],
    "description": "Dramatic wide-brim resort sun hat crafted from finely braided straw with a grosgrain ribbon band and tie ribbon closure.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-63",
    "name": "Portofino Metal Buckle Straw Fedora",
    "slug": "portofino-metal-buckle-straw-fedora",
    "collection": "resort_evening",
    "selling_price_usd": 36,
    "cost_price": 13,
    "dropship_fee": 250,
    "stock_quantity": 22,
    "fabric": "Structured Toquilla Straw & Vegan Leather Belt",
    "colors": [
      "Cream / Tan"
    ],
    "sizes": [
      "One Size"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/portofino-metal-buckle-straw-hat-1.jpg"
    ],
    "description": "Classic structured fedora woven in fine cream straw, accented with a slim tan leather belt and polished gold-tone buckle.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-64",
    "name": "Maldives Corduroy Multi-Purpose Co-ord Set",
    "slug": "maldives-corduroy-multi-purpose-coord-set",
    "collection": "honeymoon",
    "selling_price_usd": 71,
    "cost_price": 1000,
    "dropship_fee": 250,
    "stock_quantity": 50,
    "fabric": "100% Fine Ribbed Corduroy Cotton",
    "colors": [
      "Oatmeal Sand",
      "Alabaster"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/maldives-corduroy-multi-purpose-coord-set-1.jpg"
    ],
    "description": "An elevated travel and lounge staple crafted from fine ribbed corduroy cotton. Features an oversized tailored button-down shirt paired with relaxed wide-leg trousers, finished with an elasticated waistband and subtle crest embroidery.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-65",
    "name": "Positano Buckled Linen Vest & Wide-Leg Trouser Set",
    "slug": "positano-buckled-linen-vest-trouser-set",
    "collection": "resort_evening",
    "selling_price_usd": 71,
    "cost_price": 1000,
    "dropship_fee": 250,
    "stock_quantity": 50,
    "fabric": "100% Organic Crinkle Linen",
    "colors": [
      "Warm Sand Taupe",
      "Mocha"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/positano-buckled-linen-vest-trouser-set-1.jpg",
      "/images/products/positano-buckled-linen-vest-trouser-set-2.jpg",
      "/images/products/positano-buckled-linen-vest-trouser-set-3.jpg"
    ],
    "description": "Bespoke Mediterranean tailoring meets coastal romance. A sleeveless draped wrap vest featuring an artisan tortoiseshell cinch buckle, paired with relaxed wide-leg trousers crafted from crinkle organic linen.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-66",
    "name": "Capri Horizon Striped Linen Shirt & Trouser Set",
    "slug": "capri-horizon-striped-linen-trouser-set",
    "collection": "beach_party",
    "selling_price_usd": 71,
    "cost_price": 1000,
    "dropship_fee": 250,
    "stock_quantity": 50,
    "fabric": "100% Breathable Pure Linen Weave",
    "colors": [
      "Sky Blue Stripe",
      "Classic White"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/capri-horizon-striped-linen-trouser-set-1.jpg",
      "/images/products/capri-horizon-striped-linen-trouser-set-2.jpg",
      "/images/products/capri-horizon-striped-linen-trouser-set-3.jpg"
    ],
    "description": "Inspired by breezy afternoons on the Amalfi cliffs. A relaxed boyfriend-cut button-down shirt in crisp azure pinstripes with matching high-waisted wide-leg lounge trousers for effortless coastal living.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-67",
    "name": "Saint-Germain Pinstripe Ribbed Knit Co-ord Set",
    "slug": "saint-germain-pinstripe-ribbed-knit-coord-set",
    "collection": "resort_evening",
    "selling_price_usd": 71,
    "cost_price": 1000,
    "dropship_fee": 250,
    "stock_quantity": 50,
    "fabric": "Pure Ribbed Viscose Knit",
    "colors": [
      "Vanilla Pinstripe"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/saint-germain-pinstripe-ribbed-knit-coord-set-1.jpg",
      "/images/products/saint-germain-pinstripe-ribbed-knit-coord-set-2.jpg"
    ],
    "description": "Parisian chic for twilight aperitifs and rooftop gatherings. Features a sweetheart-neck long-sleeve knit top with delicate center ruching and keyhole tie, paired with fluid ribbed flare trousers in fine cream pinstripes.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-68",
    "name": "Riviera Embroidered Tassel Tunic & Palazzo Set",
    "slug": "riviera-embroidered-tassel-tunic-palazzo-set",
    "collection": "beach_party",
    "selling_price_usd": 71,
    "cost_price": 1000,
    "dropship_fee": 250,
    "stock_quantity": 50,
    "fabric": "100% Handloom Cotton with Silk Floss Embroidery",
    "colors": [
      "Ivory & Azure Blue"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/riviera-embroidered-tassel-tunic-palazzo-set-1.jpg",
      "/images/products/riviera-embroidered-tassel-tunic-palazzo-set-2.jpg"
    ],
    "description": "A celebration of Indian artisanal heritage. Handcrafted ivory cotton tunic featuring intricate medallion embroidery, delicate pom-pom tassel trim, and two-tone chevron flared palazzo trousers.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.056Z"
  },
  {
    "id": "prod-69",
    "name": "Monceau Hourglass Tailored Blazer & Wide Trouser Suit Set",
    "slug": "monceau-hourglass-tailored-blazer-trouser-set",
    "collection": "resort_evening",
    "selling_price_usd": 71,
    "cost_price": 1000,
    "dropship_fee": 250,
    "stock_quantity": 50,
    "fabric": "Premium Italian Crepe Suiting with Silk Satin Lining",
    "colors": [
      "Burgundy Wine",
      "Pearl Ivory",
      "Midnight Noir"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/monceau-hourglass-tailored-blazer-trouser-set-1.jpg",
      "/images/products/monceau-hourglass-tailored-blazer-trouser-set-2.jpg",
      "/images/products/monceau-hourglass-tailored-blazer-trouser-set-3.jpg",
      "/images/products/monceau-hourglass-tailored-blazer-trouser-set-4.jpg"
    ],
    "description": "Impeccable sunset tailoring. A single-breasted sculpted hourglass blazer adorned with an artisan jewel crystal button, accompanied by floor-grazing pleated wide-leg trousers in rich luxury crepe.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.059Z"
  },
  {
    "id": "prod-70",
    "name": "Mediterranean Ruffle Halter Silk Dress in Sky Blue",
    "slug": "mediterranean-ruffle-halter-silk-dress",
    "collection": "honeymoon",
    "selling_price_usd": 71,
    "cost_price": 1000,
    "dropship_fee": 250,
    "stock_quantity": 50,
    "fabric": "100% Lightweight Silk Georgette",
    "colors": [
      "Sky Blue"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "stock_status": "in_stock",
    "images": [
      "/images/products/mediterranean-ruffle-halter-silk-dress-1.jpg",
      "/images/products/mediterranean-ruffle-halter-silk-dress-2.jpg",
      "/images/products/mediterranean-ruffle-halter-silk-dress-3.jpg"
    ],
    "description": "An ethereal coastal evening silhouette. Designed with a ruched halter neckline, sculpted floral brooch accent, open back, and cascading high-low ruffle hemline that flutters with the sea breeze.",
    "is_active": true,
    "created_at": "2026-09-11T04:39:19.059Z"
  }
];
