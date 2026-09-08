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
    name: "Tulum Terracotta Laser-Cut Maxi Set",
    edit: "The Beach Party Edit",
    priceUsd: 49.7,
    image: "/images/products/tulum-terracotta-laser-cut-maxi-set.jpg",
    slug: "tulum-terracotta-laser-cut-maxi-set",
    badge: "✦ NEW DROP • RESORT 2026",
  },
  {
    id: "2",
    name: "Mykonos Scallop Crochet Maxi Set",
    edit: "The Wedding Night Edit",
    priceUsd: 34.0,
    image: "/images/products/mykonos-scallop-crochet-maxi-set.jpg",
    slug: "mykonos-scallop-crochet-maxi-set",
    badge: "✦ HAND-CROCHETED",
  },
  {
    id: "3",
    name: "Saint-Tropez Citrus Tiered Chiffon Dress",
    edit: "The Resort Evening Edit",
    priceUsd: 32.0,
    image: "/images/products/saint-tropez-citrus-tiered-chiffon-dress.jpg",
    slug: "saint-tropez-citrus-tiered-chiffon-dress",
    badge: "✦ SUNLIT SILHOUETTE",
  },
  {
    id: "4",
    name: "Ibiza Tassel Crochet & Sarong Set",
    edit: "The Beach Party Edit",
    priceUsd: 31.0,
    image: "/images/products/ibiza-tassel-crochet-watercolor-sarong-set.jpg",
    slug: "ibiza-tassel-crochet-watercolor-sarong-set",
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
