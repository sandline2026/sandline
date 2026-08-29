import { useState } from "react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";

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
    name: "Santorini 3D Floral Slip",
    edit: "The Wedding Night Edit",
    priceUsd: 78.0,
    image: "/images/products/santorini-3d-floral-silk-slip-dress.jpg",
    slug: "santorini-3d-floral-silk-slip-dress",
    badge: "✦ Featured Atelier Look",
  },
  {
    id: "2",
    name: "Riviera Crystal Blouse",
    edit: "The Resort Evening Edit",
    priceUsd: 72.0,
    image: "/images/products/riviera-crystal-pinstripe-tie-blouse.jpg",
    slug: "riviera-crystal-pinstripe-tie-blouse",
    badge: "✦ Hand-Embellished",
  },
  {
    id: "3",
    name: "St. Tropez Ruffle Co-ord",
    edit: "The Beach Party Edit",
    priceUsd: 64.0,
    image: "/images/products/st-tropez-ruffle-tiered-skirt-co-ord-set.jpg",
    slug: "st-tropez-ruffle-tiered-skirt-co-ord-set",
    badge: "✦ Sunlit Linen",
  },
];

export default function HeroModelShowcase() {
  const { formatPrice } = useCurrency();
  const [selectedLook, setSelectedLook] = useState<HeroLook>(HERO_LOOKS[0]);

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
          {HERO_LOOKS.map((look) => (
            <button
              key={look.id}
              onClick={(e) => {
                e.preventDefault();
                setSelectedLook(look);
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
          <span>41 Handcrafted Silhouettes Live</span>
        </div>
      </div>
    </div>
  );
}
