import { useState, useEffect } from "react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { createClient } from "@/../utils/supabase/client";

interface HeroLook {
  id: string;
  name: string;
  edit: string;
  priceUsd: number;
  image: string;
  slug: string;
  badge: string;
}

const HERO_LOOKS: HeroLook[] = [
  {
    id: "1",
    name: "Marbella Botanical Palm Shirt & Trouser Set",
    edit: "The Beach Party Edit",
    priceUsd: 56.8,
    image: "/images/products/marbella-botanical-palm-shirt-trouser-set-studio.jpg",
    slug: "marbella-botanical-palm-shirt-trouser-set",
    badge: "✦ BESTSELLER • STUDIO DROP",
  },
  {
    id: "2",
    name: "Capri 3D Rosette Crepe Halter Maxi Dress",
    edit: "The Honeymoon Edit",
    priceUsd: 37.87,
    image: "/images/products/capri-3d-rosette-halter-maxi-dress-studio.jpg",
    slug: "capri-3d-rosette-halter-maxi-dress",
    badge: "✦ VIRAL 3D ROSETTE",
  },
  {
    id: "3",
    name: "Riviera Embroidered Tassel Tunic & Palazzo Set",
    edit: "The Resort Evening Edit",
    priceUsd: 47.34,
    image: "/images/products/riviera-embroidered-tassel-tunic-palazzo-set-studio.jpg",
    slug: "riviera-embroidered-tassel-tunic-palazzo-set",
    badge: "✦ HAND-EMBROIDERED",
  },
  {
    id: "4",
    name: "Noir Shimmer Balloon-Sleeve Jumpsuit",
    edit: "The Cocktail Night Edit",
    priceUsd: 44.97,
    image: "/images/products/noir-shimmer-balloon-sleeve-jumpsuit-studio.jpg",
    slug: "noir-shimmer-balloon-sleeve-jumpsuit",
    badge: "✦ SHIMMER GLAMOUR",
  },
  {
    id: "5",
    name: "Positano Monochrome Botanical Strapless Romper",
    edit: "The Beach Party Edit",
    priceUsd: 39.05,
    image: "/images/products/positano-monochrome-botanical-strapless-romper-studio.jpg",
    slug: "positano-monochrome-botanical-strapless-romper",
    badge: "✦ ISLAND BREEZE",
  },
];

export default function HeroModelShowcase() {
  const { formatPrice } = useCurrency();
  const [looks, setLooks] = useState<HeroLook[]>(HERO_LOOKS);
  const [selectedId, setSelectedId] = useState<string>(HERO_LOOKS[0].id);

  useEffect(() => {
    async function syncLivePrices() {
      try {
        const supabase = createClient();
        const slugs = HERO_LOOKS.map((l) => l.slug);
        const { data } = await supabase
          .from("products")
          .select("slug, selling_price_usd")
          .in("slug", slugs);

        if (data && data.length > 0) {
          const priceMap = new Map(data.map((p: any) => [p.slug, Number(p.selling_price_usd)]));
          setLooks((prev) =>
            prev.map((look) =>
              priceMap.has(look.slug)
                ? { ...look, priceUsd: priceMap.get(look.slug)! }
                : look
            )
          );
        }
      } catch {
        // Fallback gracefully
      }
    }
    syncLivePrices();
  }, []);

  const selectedLook = looks.find((l) => l.id === selectedId) || looks[0];

  return (
    <div className="hero-model-stage">
      {/* Main Model Editorial Card */}
      <div className="hero-editorial-card">
        <Link href={`/product/${selectedLook.slug}`} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
          <div className="hero-img-wrap">
            <img
              key={selectedLook.id}
              src={selectedLook.image}
              alt={selectedLook.name}
              className="hero-model-img"
            />
            {/* Gradient Vignette */}
            <div className="hero-card-vignette" />
          </div>

          {/* Floating Pill Badges */}
          <div className="hero-floating-pill top-left">
            <span className="live-dot" />
            {selectedLook.badge}
          </div>

          <div className="hero-floating-pill top-right price-badge">
            {formatPrice(selectedLook.priceUsd)}
          </div>

          {/* Bottom Card Details */}
          <div className="hero-card-bottom">
            <span className="hero-card-edit">{selectedLook.edit}</span>
            <h3 className="hero-card-title">{selectedLook.name}</h3>
            <span className="hero-card-cta">Explore Look →</span>
          </div>
        </Link>

        {/* Thumbnail Selector at Bottom */}
        <div className="hero-thumb-strip">
          {looks.map((look) => (
            <button
              key={look.id}
              onClick={(e) => {
                e.preventDefault();
                setSelectedId(look.id);
              }}
              className={`hero-thumb-btn ${selectedLook.id === look.id ? "active" : ""}`}
              aria-label={look.name}
            >
              <img src={look.image} alt={look.name} />
            </button>
          ))}
        </div>
      </div>

      {/* Floating Trust Accent Tag */}
      <div className="hero-trust-tag">
        <span className="star">✦</span>
        <div>
          <strong>Resort 2026 Collection</strong>
          <span>78 Handcrafted Silhouettes Live</span>
        </div>
      </div>
    </div>
  );
}
