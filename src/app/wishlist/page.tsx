"use client";

import Link from "next/link";
import SiteNavbar from "@/components/SiteNavbar";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import "../sandline.css";

export default function WishlistPage() {
  const { items, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { addToCart, openCart } = useCart();

  function handleAddAndOpenCart(item: any) {
    addToCart({
      id: item.id,
      name: item.name,
      price: Number(item.price) || 0,
      image: item.image || null,
    });
    openCart();
  }

  return (
    <div className="sandline-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteNavbar />

      <div style={{ padding: "clamp(30px, 5vw, 60px) 24px 20px", maxWidth: "1280px", margin: "0 auto", width: "100%" }}>
        <div style={{ marginBottom: "32px", borderBottom: "1px solid var(--border)", paddingBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--papaya)", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px" }}>
            <Heart size={14} fill="currentColor" />
            <span>SAVED SILHOUETTES</span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(32px, 5vw, 48px)", color: "var(--ink)", margin: 0, fontWeight: 500 }}>
            Your Wishlist.
          </h1>
          <p style={{ margin: "8px 0 0", color: "#6B7280", fontSize: "14.5px" }}>
            {items.length === 0
              ? "Your curation is empty. Save your favourite resort pieces to revisit anytime."
              : `You have ${items.length} ${items.length === 1 ? "silhouette" : "silhouettes"} saved.`}
          </p>
        </div>

        {items.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "#FFFFFF",
              borderRadius: "24px",
              border: "1px solid #EAE6DF",
              maxWidth: "540px",
              margin: "40px auto",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🌴</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "24px", color: "var(--ink)", marginBottom: "8px" }}>
              Your wishlist is empty
            </h2>
            <p style={{ fontSize: "14px", color: "#6B7280", maxWidth: "380px", margin: "0 auto 24px", lineHeight: 1.6 }}>
              Explore our handcrafted linens, fluid silks, and co-ord sets to curate your dream getaway wardrobe.
            </p>
            <Link
              href="/shop"
              className="btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
              }}
            >
              <span>Explore Collection</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 280px))",
              gap: "24px",
              justifyContent: "start",
              marginBottom: "80px",
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "18px",
                  overflow: "hidden",
                  border: "1px solid #EAE6DF",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
              >
                {/* Image Wrap */}
                <div style={{ position: "relative", width: "100%", aspectRatio: "3/4", background: "#FAF8F5", overflow: "hidden" }}>
                  <Link href={`/product/${item.slug || item.id}`} style={{ display: "block", width: "100%", height: "100%" }}>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.5s ease",
                        }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: "12px", letterSpacing: "1px" }}>
                        SANDLINE
                      </div>
                    )}
                  </Link>

                  {/* Price Tag */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background: "rgba(255,255,255,0.92)",
                      backdropFilter: "blur(6px)",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--ink)",
                      fontFamily: "'Space Mono', monospace",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                  >
                    {formatPrice(Number(item.price))}
                  </div>
                </div>

                {/* Body Details */}
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <Link
                    href={`/product/${item.slug || item.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      marginBottom: "14px",
                      display: "block",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontSize: "16px",
                        color: "var(--ink)",
                        margin: 0,
                        lineHeight: 1.35,
                        fontWeight: 500,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.name}
                    </h3>
                  </Link>

                  {/* Action Buttons Row */}
                  <div style={{ marginTop: "auto", display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => handleAddAndOpenCart(item)}
                      style={{
                        flex: 1,
                        background: "var(--ink)",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "24px",
                        padding: "10px 14px",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                        fontFamily: "'Space Mono', monospace",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        transition: "background 0.2s ease",
                      }}
                    >
                      <ShoppingBag size={13} />
                      <span>Add to Bag</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(item)}
                      title="Remove from Wishlist"
                      style={{
                        background: "#F3F4F6",
                        color: "#6B7280",
                        border: "none",
                        borderRadius: "50%",
                        width: "36px",
                        height: "36px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                        transition: "color 0.2s ease, background 0.2s ease",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}