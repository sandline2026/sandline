"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductPrice from "@/components/ProductPrice";
import WishlistButton from "@/components/WishlistButton";
import { createClient } from "@/../utils/supabase/client";

interface NewOutfit {
  id: string;
  name: string;
  slug: string;
  priceUsd: number;
  image: string;
  category: string;
  sizes: string[];
  badge: string;
}

const NEW_OUTFITS: NewOutfit[] = [
  {
    id: "outfit-tulum",
    name: "Tulum Terracotta Laser-Cut Maxi Set",
    slug: "tulum-terracotta-laser-cut-maxi-set",
    priceUsd: 49.7,
    image: "/images/products/tulum-terracotta-laser-cut-maxi-set.jpg",
    category: "The Beach Party Edit",
    sizes: ["XS", "S", "M", "L"],
    badge: "✦ NEW DROP",
  },
  {
    id: "outfit-mykonos",
    name: "Mykonos Scallop Crochet Maxi Set",
    slug: "mykonos-scallop-crochet-maxi-set",
    priceUsd: 34,
    image: "/images/products/mykonos-scallop-crochet-maxi-set.jpg",
    category: "The Wedding Night Edit",
    sizes: ["XS", "S", "M", "L"],
    badge: "✦ HAND-CROCHETED",
  },
  {
    id: "outfit-st-tropez",
    name: "Saint-Tropez Citrus Tiered Chiffon Dress",
    slug: "saint-tropez-citrus-tiered-chiffon-dress",
    priceUsd: 32,
    image: "/images/products/saint-tropez-citrus-tiered-chiffon-dress.jpg",
    category: "The Resort Evening Edit",
    sizes: ["XS", "S", "M", "L"],
    badge: "✦ SUNLIT SILHOUETTE",
  },
  {
    id: "outfit-ibiza",
    name: "Ibiza Tassel Crochet & Sarong Set",
    slug: "ibiza-tassel-crochet-watercolor-sarong-set",
    priceUsd: 31,
    image: "/images/products/ibiza-tassel-crochet-watercolor-sarong-set.jpg",
    category: "The Beach Party Edit",
    sizes: ["XS", "S", "M", "L"],
    badge: "✦ ISLAND BREEZE",
  },
  {
    id: "outfit-maldives",
    name: "Maldives Sunset Cutout Swimsuit & Sarong Set",
    slug: "maldives-sunset-cutout-swimsuit-sarong-set",
    priceUsd: 29,
    image: "/images/products/maldives-sunset-cutout-swimsuit-sarong-set.jpg",
    category: "The Beach Party Edit",
    sizes: ["XS", "S", "M", "L"],
    badge: "✦ RESORT SWIM",
  },
  {
    id: "outfit-santorini",
    name: "Santorini Daisy Cutout Halter Swimsuit",
    slug: "santorini-daisy-cutout-halter-swimsuit",
    priceUsd: 28,
    image: "/images/products/santorini-daisy-cutout-halter-swimsuit.jpg",
    category: "The Beach Party Edit",
    sizes: ["XS", "S", "M", "L"],
    badge: "✦ RESORT SWIM",
  },
];

export default function NewArrivalsSection() {
  const [outfits, setOutfits] = useState<NewOutfit[]>(NEW_OUTFITS);

  useEffect(() => {
    async function syncLivePrices() {
      try {
        const supabase = createClient();
        const slugs = NEW_OUTFITS.map((o) => o.slug);
        const { data } = await supabase
          .from("products")
          .select("slug, selling_price_usd")
          .in("slug", slugs);

        if (data && data.length > 0) {
          const priceMap = new Map(data.map((p: any) => [p.slug, Number(p.selling_price_usd)]));
          setOutfits((prev) =>
            prev.map((item) =>
              priceMap.has(item.slug)
                ? { ...item, priceUsd: priceMap.get(item.slug)! }
                : item
            )
          );
        }
      } catch {
        // Fallback gracefully
      }
    }
    syncLivePrices();
  }, []);

  return (
    <section className="new-arrivals-showcase-section">
      <div className="new-arrivals-header reveal">
        <div className="new-arrivals-badge-row">
          <span className="dot" />
          <span className="new-arrivals-eyebrow">
            ✦ FRESH DROP • RESORT 2026 EDIT • HAND-FINISHED ATELIER
          </span>
        </div>
        <h2 className="new-arrivals-title">New In: Sunset &amp; Sea.</h2>
        <p className="new-arrivals-subtitle">
          Sculpted crochet halters, tiered citrus chiffons, and laser-cut maxi wraps — just landed from our India atelier for your next escape.
        </p>
      </div>

      <div className="new-arrivals-grid reveal">
        {outfits.map((item) => (
          <div key={item.id} className="new-arrival-card">
            {/* Image Box */}
            <div className="new-arrival-img-box">
              <span className="new-arrival-badge">{item.badge}</span>
              <ProductPrice priceUsd={item.priceUsd} className="new-arrival-price-pill" />
              <WishlistButton
                id={item.id}
                name={item.name}
                price={item.priceUsd}
                image={item.image}
                variant="icon"
              />
              <Link href={`/product/${item.slug}`} className="new-arrival-img-link">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="new-arrival-img"
                />
              </Link>
            </div>

            {/* Card Body */}
            <div className="new-arrival-body">
              <span className="new-arrival-category">{item.category}</span>
              <Link href={`/product/${item.slug}`} className="new-arrival-name">
                {item.name}
              </Link>
              <div className="new-arrival-sizes">
                <span>Sizes:</span> {item.sizes.join(" • ")}
              </div>
              <Link href={`/product/${item.slug}`} className="new-arrival-cta">
                Shop Silhouette →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="new-arrivals-footer-bar reveal">
        <Link href="/shop" className="new-arrivals-explore-all-btn">
          View All 78 Silhouettes in Wardrobe →
        </Link>
      </div>
    </section>
  );
}
