"use client";

import { useState } from "react";
import Link from "next/link";
import ProductPrice from "@/components/ProductPrice";

interface LookItem {
  id: string;
  image: string;
  location: string;
  caption: string;
  productName: string;
  productSlug: string;
  priceUsd: number;
  collection: string;
}

const INSTAGRAM_LOOKS: LookItem[] = [
  {
    id: "look-1",
    image: "/images/products/santorini-3d-floral-silk-slip-dress.jpg",
    location: "Santorini, Greece",
    caption: "Golden hour draped in handcrafted 3D organza florals 🐚",
    productName: "Santorini 3D Floral Silk Slip Dress",
    productSlug: "santorini-3d-floral-silk-slip-dress",
    priceUsd: 78,
    collection: "Honeymoon & Wedding Night",
  },
  {
    id: "look-2",
    image: "/images/products/riviera-crystal-embellished-halter-dress.jpg",
    location: "Cannes, French Riviera",
    caption: "Midnight oceanside cocktails under coastal stars 🍸✨",
    productName: "Riviera Crystal Embellished Halter Dress",
    productSlug: "riviera-crystal-embellished-halter-dress",
    priceUsd: 85,
    collection: "The Resort Evening Edit",
  },
  {
    id: "look-3",
    image: "/images/products/st-tropez-tiered-linen-wrap-dress.jpg",
    location: "St. Tropez, France",
    caption: "Breezy tiered linen wraps for slow coastal mornings ☀️",
    productName: "St. Tropez Tiered Linen Wrap Dress",
    productSlug: "st-tropez-tiered-linen-wrap-dress",
    priceUsd: 73,
    collection: "The Beach Party Edit",
  },
  {
    id: "look-4",
    image: "/images/products/amalfi-sundown-pleated-maxi-dress.jpg",
    location: "Amalfi Coast, Italy",
    caption: "Sunset dinners along the cliffside horizon 🌊",
    productName: "Amalfi Sundown Pleated Maxi Dress",
    productSlug: "amalfi-sundown-pleated-maxi-dress",
    priceUsd: 80,
    collection: "The Resort Evening Edit",
  },
  {
    id: "look-5",
    image: "/images/products/mykonos-pearl-draped-cowl-back-gown.jpg",
    location: "Mykonos, Greece",
    caption: "Island evenings & delicate cowl back draping 🤍",
    productName: "Mykonos Pearl-Draped Cowl Back Gown",
    productSlug: "mykonos-pearl-draped-cowl-back-gown",
    priceUsd: 88,
    collection: "The Wedding Night Edit",
  },
  {
    id: "look-6",
    image: "/images/products/maldives-drawstring-linen-set.jpg",
    location: "Bali, Indonesia",
    caption: "Oceanside breeze in pure organic linen co-ords 🌴",
    productName: "Maldives Drawstring Linen Set",
    productSlug: "maldives-drawstring-linen-set",
    priceUsd: 69,
    collection: "The Beach Party Edit",
  },
];

export default function InstagramFeed() {
  const [selectedLook, setSelectedLook] = useState<LookItem | null>(null);

  return (
    <section className="instagram-feed-section">
      {/* Section Header */}
      <div className="instagram-feed-header">
        <div className="insta-header-copy">
          <div className="insta-eyebrow">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            <span>@SANDLINE.STORE ON INSTAGRAM</span>
          </div>
          <h2 className="insta-title">Moments from every horizon.</h2>
          <p className="insta-subtitle">
            From golden hour in Santorini to beachfront sunsets in Bali. Tag <strong>#SandlineEscape</strong> to be featured in our resort edit.
          </p>
        </div>

        <a
          href="https://www.instagram.com/sandline.store"
          target="_blank"
          rel="noopener noreferrer"
          className="insta-follow-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
          <span>Follow @sandline.store</span>
        </a>
      </div>

      {/* 6-Grid Instagram Gallery */}
      <div className="instagram-grid">
        {INSTAGRAM_LOOKS.map((look) => (
          <div
            key={look.id}
            className="insta-grid-item"
            onClick={() => setSelectedLook(look)}
          >
            <div className="insta-img-wrap">
              <img src={look.image} alt={look.productName} loading="lazy" />
              
              {/* Instagram Hover / Tap Overlay */}
              <div className="insta-overlay">
                <div className="insta-location-tag">
                  <span>📍</span>
                  <span>{look.location}</span>
                </div>
                <div className="insta-shop-pill">
                  <span>Shop This Look →</span>
                </div>
              </div>

              {/* Instagram Floating Icon Badge */}
              <div className="insta-icon-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* "Shop The Look" Modal Drawer */}
      {selectedLook && (
        <div
          className="shop-look-modal-backdrop"
          onClick={() => setSelectedLook(null)}
        >
          <div
            className="shop-look-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="shop-look-header">
              <div className="shop-look-user-row">
                <div className="shop-look-avatar">
                  <img src="/images/logo-emblem-transparent.png" alt="Sandline" />
                </div>
                <div>
                  <div className="shop-look-username">sandline.store ✦</div>
                  <div className="shop-look-loc">📍 {selectedLook.location}</div>
                </div>
              </div>
              <button
                type="button"
                className="shop-look-close-btn"
                onClick={() => setSelectedLook(null)}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="shop-look-body">
              <div className="shop-look-photo-side">
                <img src={selectedLook.image} alt={selectedLook.productName} />
              </div>

              <div className="shop-look-info-side">
                <div className="shop-look-tagline">{selectedLook.collection}</div>
                <h3 className="shop-look-prod-title">{selectedLook.productName}</h3>
                <p className="shop-look-caption">&ldquo;{selectedLook.caption}&rdquo;</p>

                <div className="shop-look-price-row">
                  <span className="price-label">Price:</span>
                  <ProductPrice priceUsd={selectedLook.priceUsd} className="shop-look-price-tag" />
                </div>

                <div className="shop-look-actions">
                  <Link
                    href={`/product/${selectedLook.productSlug}`}
                    className="shop-look-cta-btn"
                    onClick={() => setSelectedLook(null)}
                  >
                    SHOP THIS SILHOUETTE →
                  </Link>

                  <a
                    href="https://www.instagram.com/sandline.store"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shop-look-insta-link"
                  >
                    View on Instagram @sandline.store ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
