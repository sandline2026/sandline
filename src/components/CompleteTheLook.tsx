"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";

export interface CompleteLookItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category?: string;
  sizes?: string[];
}

interface CompleteTheLookProps {
  currentProduct: {
    id: string;
    name: string;
    price: number;
    image: string;
    sizes?: string[];
  };
  pairings: CompleteLookItem[];
}

export default function CompleteTheLook({ currentProduct, pairings }: CompleteTheLookProps) {
  const { addToCart, openCart } = useCart();
  const { formatPrice } = useCurrency();

  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    pairings.forEach((p) => {
      if (p.sizes && p.sizes.length > 0) {
        initial[p.id] = p.sizes[0];
      }
    });
    return initial;
  });

  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [addingAll, setAddingAll] = useState(false);

  if (!pairings || pairings.length === 0) return null;

  function handleAddSingle(item: CompleteLookItem) {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      size: selectedSizes[item.id] || (item.sizes?.[0] ?? undefined),
    });

    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);

    openCart();
  }

  function handleAddEntireLook() {
    setAddingAll(true);

    // 1. Add current main product
    addToCart({
      id: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.image,
      size: currentProduct.sizes?.[0] ?? undefined,
    });

    // 2. Add all paired pieces
    pairings.forEach((p) => {
      addToCart({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        size: selectedSizes[p.id] || (p.sizes?.[0] ?? undefined),
      });
    });

    setTimeout(() => {
      setAddingAll(false);
      openCart();
    }, 400);
  }

  return (
    <section className="complete-look-section">
      <div className="complete-look-header">
        <span className="complete-look-eyebrow">✦ RESORT STYLIST PAIRING</span>
        <h2 className="complete-look-title">COMPLETE THE LOOK</h2>
        <p className="complete-look-desc">
          Elevate this silhouette with handpicked artisan straw hats and lightweight coastal essentials.
        </p>
      </div>

      <div className="complete-look-grid">
        {pairings.map((item) => {
          const isAdded = addedItems[item.id];
          return (
            <div key={item.id} className="complete-look-card">
              <Link href={`/product/${item.slug}`} className="complete-look-img-link">
                <img src={item.image} alt={item.name} className="complete-look-img" loading="lazy" />
              </Link>

              <div className="complete-look-info">
                <span className="complete-look-category">{item.category || "Resort Essential"}</span>
                <Link href={`/product/${item.slug}`} className="complete-look-name-link">
                  <h4 className="complete-look-name">{item.name}</h4>
                </Link>
                <div className="complete-look-price">{formatPrice(item.price)}</div>

                {/* Size Selector if item has sizes */}
                {item.sizes && item.sizes.length > 0 && (
                  <div className="complete-look-sizes">
                    {item.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`look-size-pill ${selectedSizes[item.id] === s ? "active" : ""}`}
                        onClick={() => setSelectedSizes((prev) => ({ ...prev, [item.id]: s }))}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleAddSingle(item)}
                  className={`complete-look-add-btn ${isAdded ? "added" : ""}`}
                >
                  {isAdded ? "✓ Added to Bag" : "＋ Add Piece to Bag"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bundle Action Bar */}
      <div className="complete-look-bundle-bar">
        <div className="bundle-bar-info">
          <div className="bundle-badge">⚡ VIP RESORT BUNDLE</div>
          <div className="bundle-text">
            Add full look to bag &amp; use code <strong style={{ color: "var(--papaya)" }}>WELCOME10</strong> for 10% OFF
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddEntireLook}
          disabled={addingAll}
          className="bundle-cta-btn"
        >
          {addingAll ? "Adding Look..." : "Add Entire Look to Bag →"}
        </button>
      </div>
    </section>
  );
}
