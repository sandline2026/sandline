"use client";

import Link from "next/link";
import SiteNavbar from "@/components/SiteNavbar";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency } from "@/context/CurrencyContext";
import "../sandline.css";

export default function WishlistPage() {
  const { items, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  return (
    <div className="sandline-page">
      <SiteNavbar />

      <div className="shop-header">
        <h1>Your wishlist.</h1>
      </div>

      <div className="cart-wrap">
        {items.length === 0 ? (
          <p className="empty-state">
            Nothing saved yet. <a href="/shop" style={{ textDecoration: "underline" }}>Browse the collection</a>.
          </p>
        ) : (
          <div className="collection-product-grid">
            {items.map((item) => (
              <div className="collection-card" key={item.id}>
                <span className="price-tag">{formatPrice(Number(item.price))}</span>
                <a href={`/product/${item.id}`} className="collection-card-link">
                  <div className="art">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
                      />
                    ) : null}
                  </div>
                  <div className="label"><h3>{item.name}</h3></div>
                </a>
                <div style={{ padding: "0 24px 24px" }}>
                  <button className="wishlist-btn" onClick={() => toggleWishlist(item)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}