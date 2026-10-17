"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";

interface FeaturedStudioLook {
  id: string;
  name: string;
  slug: string;
  priceUsd: number;
  image: string;
  tag: string;
  colorway: string;
}

const STUDIO_LOOKS: FeaturedStudioLook[] = [
  {
    id: "marbella",
    name: "Marbella Botanical Palm Shirt & Trouser Set",
    slug: "marbella-botanical-palm-shirt-trouser-set",
    priceUsd: 56.8,
    image: "/images/products/marbella-botanical-palm-shirt-trouser-set-studio.jpg",
    tag: "✦ BESTSELLER RESORT SET",
    colorway: "Sand Cream & Palm Ochre",
  },
  {
    id: "capri",
    name: "Capri 3D Rosette Crepe Halter Maxi Dress",
    slug: "capri-3d-rosette-halter-maxi-dress",
    priceUsd: 37.87,
    image: "/images/products/capri-3d-rosette-halter-maxi-dress-studio.jpg",
    tag: "✦ VIRAL 3D ROSETTE",
    colorway: "Cerulean Blue / Pastel",
  },
  {
    id: "riviera",
    name: "Riviera Embroidered Tassel Tunic & Palazzo Set",
    slug: "riviera-embroidered-tassel-tunic-palazzo-set",
    priceUsd: 47.34,
    image: "/images/products/riviera-embroidered-tassel-tunic-palazzo-set-studio.jpg",
    tag: "✦ HAND-EMBROIDERED",
    colorway: "Ivory & Sky Blue Accent",
  },
  {
    id: "noir",
    name: "Noir Shimmer Balloon-Sleeve Jumpsuit",
    slug: "noir-shimmer-balloon-sleeve-jumpsuit",
    priceUsd: 44.97,
    image: "/images/products/noir-shimmer-balloon-sleeve-jumpsuit-studio.jpg",
    tag: "✦ EVENING GLAMOUR",
    colorway: "Midnight Noir & Glitter",
  },
  {
    id: "positano",
    name: "Positano Monochrome Botanical Strapless Romper",
    slug: "positano-monochrome-botanical-strapless-romper",
    priceUsd: 39.05,
    image: "/images/products/positano-monochrome-botanical-strapless-romper-studio.jpg",
    tag: "✦ ISLAND BREEZE",
    colorway: "Monochrome Botanical",
  },
];

export default function FestivalSaleBanner() {
  const { formatPrice } = useCurrency();
  const [selectedLook, setSelectedLook] = useState<FeaturedStudioLook>(STUDIO_LOOKS[0]);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ h: "18", m: "45", s: "30" });

  useEffect(() => {
    // 24H countdown loop
    const target = Date.now() + 18 * 3600 * 1000 + 45 * 60 * 1000;
    const interval = setInterval(() => {
      const remaining = Math.max(0, target - Date.now());
      const h = Math.floor(remaining / (1000 * 60 * 60));
      const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((remaining % (1000 * 60)) / 1000);
      setTimeLeft({
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function handleCopyCode() {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText("WELCOME10");
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  const originalPrice = selectedLook.priceUsd;
  const discountedPrice = Number((originalPrice * 0.9).toFixed(2));

  return (
    <section className="festival-sale-section" style={{ padding: "40px 20px 60px" }}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          background: "linear-gradient(135deg, #111827 0%, #17212F 60%, #1E293B 100%)",
          borderRadius: "28px",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.4), 0 0 40px rgba(245, 158, 11, 0.08)",
          overflow: "hidden",
          position: "relative",
          color: "#FFFFFF",
        }}
      >
        {/* Subtle Decorative Golden Aura */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "36px",
            padding: "40px 36px",
            alignItems: "center",
          }}
        >
          {/* Left Column: Festival Sale Details & Coupon Box */}
          <div>
            {/* Top Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.4)",
                padding: "6px 14px",
                borderRadius: "50px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#FBBF24",
                marginBottom: "16px",
              }}
            >
              <span>⚡ LIMITED TIME DROP</span>
              <span>•</span>
              <span>EXCLUSIVE FESTIVAL OFFER</span>
            </div>

            {/* Main Headline */}
            <h2
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: "clamp(26px, 4vw, 42px)",
                fontWeight: 600,
                lineHeight: 1.15,
                color: "#F6EFE3",
                margin: "0 0 14px",
                letterSpacing: "-0.01em",
              }}
            >
              Flat <span style={{ color: "#F59E0B" }}>10% OFF</span> On Your First Silhouette.
            </h2>

            <p
              style={{
                fontSize: "14.5px",
                lineHeight: 1.6,
                color: "rgba(246, 239, 227, 0.8)",
                margin: "0 0 28px",
                maxWidth: "480px",
              }}
            >
              Crafted in our India atelier and shipped across India, Dubai &amp; worldwide. Enjoy flat 10% off sitewide on all handcrafted resortwear &amp; luxury sets.
            </p>

            {/* Amazon-Style Interactive Coupon Box */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1.5px dashed #F59E0B",
                borderRadius: "16px",
                padding: "18px 20px",
                marginBottom: "24px",
                maxWidth: "460px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#FBBF24", fontWeight: 700 }}>
                  FIRST ORDER PROMO CODE
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>Applicable Sitewide</span>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div
                  style={{
                    flex: 1,
                    background: "#0F172A",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "10px",
                    padding: "10px 16px",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "20px",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    color: "#F59E0B",
                  }}
                >
                  WELCOME10
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  style={{
                    background: copied ? "#059669" : "#F59E0B",
                    color: copied ? "#FFFFFF" : "#111827",
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px 20px",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {copied ? "✓ Copied!" : "Copy Code 📋"}
                </button>
              </div>
            </div>

            {/* Countdown Urgency Strip */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
              <span style={{ fontSize: "12px", color: "rgba(246, 239, 227, 0.7)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Offer Expires In:
              </span>
              <div style={{ display: "flex", gap: "6px", fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: "13px" }}>
                <span style={{ background: "#0F172A", padding: "4px 8px", borderRadius: "6px", color: "#FBBF24" }}>
                  {timeLeft.h}h
                </span>
                <span style={{ color: "#F59E0B" }}>:</span>
                <span style={{ background: "#0F172A", padding: "4px 8px", borderRadius: "6px", color: "#FBBF24" }}>
                  {timeLeft.m}m
                </span>
                <span style={{ color: "#F59E0B" }}>:</span>
                <span style={{ background: "#0F172A", padding: "4px 8px", borderRadius: "6px", color: "#FBBF24" }}>
                  {timeLeft.s}s
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                href="/shop"
                style={{
                  display: "inline-block",
                  background: "#F59E0B",
                  color: "#111827",
                  padding: "14px 30px",
                  borderRadius: "50px",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  boxShadow: "0 6px 20px rgba(245, 158, 11, 0.3)",
                }}
              >
                Shop The Festival Sale →
              </Link>

              <Link
                href={`/product/${selectedLook.slug}`}
                style={{
                  display: "inline-block",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#F6EFE3",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  padding: "14px 24px",
                  borderRadius: "50px",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Buy This Look →
              </Link>
            </div>
          </div>

          {/* Right Column: Studio Lookbook Stage with Interactive Switcher */}
          <div>
            <div
              style={{
                position: "relative",
                borderRadius: "20px",
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 16px 36px rgba(0, 0, 0, 0.35)",
                background: "#0B1120",
                aspectRatio: "3/4",
                maxHeight: "520px",
                margin: "0 auto",
              }}
            >
              <Link href={`/product/${selectedLook.slug}`}>
                <img
                  src={selectedLook.image}
                  alt={selectedLook.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                    transition: "transform 0.4s ease",
                  }}
                />
              </Link>

              {/* Floating Tag */}
              <div
                style={{
                  position: "absolute",
                  top: "14px",
                  left: "14px",
                  background: "rgba(17, 24, 39, 0.85)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(245, 158, 11, 0.35)",
                  color: "#FBBF24",
                  padding: "5px 12px",
                  borderRadius: "50px",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                }}
              >
                {selectedLook.tag}
              </div>

              {/* Floating Price Tag with WELCOME10 Discount */}
              <div
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  background: "rgba(17, 24, 39, 0.9)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  padding: "6px 14px",
                  borderRadius: "12px",
                  textAlign: "right",
                }}
              >
                <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", textDecoration: "line-through" }}>
                  {formatPrice(originalPrice)}
                </div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#10B981" }}>
                  {formatPrice(discountedPrice)}{" "}
                  <span style={{ fontSize: "10.5px", color: "#F59E0B" }}>(-10%)</span>
                </div>
              </div>

              {/* Bottom Look Details */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.6) 70%, transparent 100%)",
                  padding: "24px 20px 16px",
                }}
              >
                <div style={{ fontSize: "11px", color: "#FBBF24", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.08em" }}>
                  {selectedLook.colorway}
                </div>
                <h3
                  style={{
                    fontFamily: "Fraunces, Georgia, serif",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    margin: "4px 0 12px",
                  }}
                >
                  {selectedLook.name}
                </h3>

                {/* 5-Look Thumbnail Switcher */}
                <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                  {STUDIO_LOOKS.map((look) => (
                    <button
                      key={look.id}
                      type="button"
                      onClick={() => setSelectedLook(look)}
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: selectedLook.id === look.id ? "2px solid #F59E0B" : "1.5px solid rgba(255, 255, 255, 0.3)",
                        padding: 0,
                        background: "none",
                        cursor: "pointer",
                        opacity: selectedLook.id === look.id ? 1 : 0.6,
                        transition: "all 0.2s ease",
                        flexShrink: 0,
                      }}
                      title={look.name}
                    >
                      <img
                        src={look.image}
                        alt={look.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Guarantee Strip */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(15, 23, 42, 0.5)",
            padding: "16px 24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            fontSize: "12px",
            color: "rgba(246, 239, 227, 0.75)",
            textAlign: "center",
          }}
        >
          <div>✈️ <strong>Express Air Shipping</strong> across India &amp; Worldwide</div>
          <div>🧵 <strong>100% Handcrafted</strong> in India Ateliers</div>
          <div>💳 <strong>Easy Checkout:</strong> UPI, Cards &amp; NetBanking</div>
          <div>🔄 <strong>Hassle-Free</strong> Size Exchanges</div>
        </div>
      </div>
    </section>
  );
}
