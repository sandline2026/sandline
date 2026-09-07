"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";

interface LookbookItem {
  id: string;
  name: string;
  edit: string;
  priceUsd: number;
  image: string;
  slug: string;
  poseLocation: string;
  details: string;
}

const LOOKBOOK_REEL: LookbookItem[] = [
  {
    id: "1",
    name: "Tulum Terracotta Laser-Cut Maxi Set",
    edit: "The Beach Party Edit",
    priceUsd: 34.0,
    image: "/images/products/tulum-terracotta-laser-cut-maxi-set.jpg",
    slug: "tulum-terracotta-laser-cut-maxi-set",
    poseLocation: "Tulum Boutique Beach Resort",
    details: "Terracotta scalloped crop top with diamond laser-cut maxi skirt",
  },
  {
    id: "2",
    name: "Mykonos Scallop Crochet Maxi Set",
    edit: "The Wedding Night Edit",
    priceUsd: 34.0,
    image: "/images/products/mykonos-scallop-crochet-maxi-set.jpg",
    slug: "mykonos-scallop-crochet-maxi-set",
    poseLocation: "Mykonos Seaside Villa",
    details: "Olive green scalloped bandeau with openwork crochet maxi skirt",
  },
  {
    id: "3",
    name: "Saint-Tropez Citrus Tiered Chiffon Dress",
    edit: "The Resort Evening Edit",
    priceUsd: 32.0,
    image: "/images/products/saint-tropez-citrus-tiered-chiffon-dress.jpg",
    slug: "saint-tropez-citrus-tiered-chiffon-dress",
    poseLocation: "French Riviera Sunlit Terrace",
    details: "Citrus floral printed airy chiffon with tiered ruffle mini hem",
  },
  {
    id: "4",
    name: "Ibiza Tassel Crochet & Sarong Set",
    edit: "The Beach Party Edit",
    priceUsd: 31.0,
    image: "/images/products/ibiza-tassel-crochet-watercolor-sarong-set.jpg",
    slug: "ibiza-tassel-crochet-watercolor-sarong-set",
    poseLocation: "Ibiza Sunset Beach Club",
    details: "Handcrafted knit halter with pastel watercolor side-slit sarong",
  },
  {
    id: "5",
    name: "Maldives Sunset Cutout Swimsuit & Sarong Set",
    edit: "The Beach Party Edit",
    priceUsd: 29.0,
    image: "/images/products/maldives-sunset-cutout-swimsuit-sarong-set.jpg",
    slug: "maldives-sunset-cutout-swimsuit-sarong-set",
    poseLocation: "Maldives Private Atoll",
    details: "Sunset gradient one-piece with asymmetric cutout and printed sarong",
  },
  {
    id: "6",
    name: "Santorini Daisy Cutout Halter Swimsuit",
    edit: "The Wedding Night Edit",
    priceUsd: 28.0,
    image: "/images/products/santorini-daisy-cutout-halter-swimsuit.jpg",
    slug: "santorini-daisy-cutout-halter-swimsuit",
    poseLocation: "Santorini Infinity Pool",
    details: "Classic noir swimsuit with embroidered floral cutout detailing",
  },
];

export default function MotionLookbook() {
  const { formatPrice } = useCurrency();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % LOOKBOOK_REEL.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const current = LOOKBOOK_REEL[activeIndex];

  return (
    <section className="motion-lookbook-section" style={{ padding: "80px clamp(20px, 5vw, 64px)", background: "#141C19", color: "#FAF8F5", borderRadius: "32px", margin: "40px clamp(12px, 3vw, 36px)", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginBottom: "40px" }}>
        <div>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "2px", color: "#D4A373", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
            ✦ RUNWAY IN MOTION • RESORT EDITORIAL
          </span>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(30px, 4.5vw, 52px)", fontWeight: "400", margin: 0 }}>
            Models in Motion.
          </h2>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: isPlaying ? "rgba(212,163,115,0.2)" : "rgba(255,255,255,0.1)",
              border: "1px solid rgba(212,163,115,0.4)",
              color: "#D4A373",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "12px",
              fontFamily: "'Space Mono', monospace",
              cursor: "pointer",
            }}
          >
            {isPlaying ? "❚❚ Auto-Play" : "▶ Play"}
          </button>
          <div style={{ display: "flex", gap: "6px" }}>
            {LOOKBOOK_REEL.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                style={{
                  width: activeIndex === i ? "28px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: activeIndex === i ? "#D4A373" : "rgba(255,255,255,0.25)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Motion Stage */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "36px", alignItems: "center" }}>
        
        {/* Left: Cinematic Animated Model Visual Card */}
        <div style={{ position: "relative", borderRadius: "24px", overflow: "hidden", aspectRatio: "3/4", maxHeight: "580px", border: "1px solid rgba(255,255,255,0.12)", background: "#0E1412" }}>
          <img
            key={current.id}
            src={current.image}
            alt={current.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              transformOrigin: "top center",
              animation: "kenburns 4.5s ease-out infinite alternate",
            }}
          />

          {/* Vignette Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(0deg, rgba(14,20,18,0.9) 0%, rgba(14,20,18,0.2) 50%, transparent 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Live Tag Pill */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              background: "rgba(20,28,25,0.75)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(212,163,115,0.4)",
              color: "#FAF8F5",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "11px",
              fontFamily: "'Space Mono', monospace",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#25D366" }} />
            {current.poseLocation}
          </div>

          <div style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(255,255,255,0.92)", color: "#1A1A1A", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontFamily: "'Space Mono', monospace", fontWeight: "700" }}>
            {formatPrice(current.priceUsd)}
          </div>

          <div style={{ position: "absolute", bottom: "24px", left: "24px", right: "24px" }}>
            <span style={{ fontSize: "12px", color: "#D4A373", fontFamily: "'Space Mono', monospace", letterSpacing: "1px", textTransform: "uppercase" }}>
              {current.edit}
            </span>
            <h3 style={{ fontFamily: "Fraunces, serif", fontSize: "24px", margin: "4px 0 8px", color: "#FAF8F5" }}>
              {current.name}
            </h3>
            <p style={{ fontSize: "13.5px", color: "rgba(250,248,245,0.75)", margin: "0 0 16px", lineHeight: "1.5" }}>
              {current.details}
            </p>
            <Link
              href={`/product/${current.slug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#D4A373",
                color: "#141C19",
                padding: "10px 22px",
                borderRadius: "24px",
                fontSize: "13px",
                fontWeight: "700",
                textDecoration: "none",
                transition: "transform 0.2s ease",
              }}
            >
              Shop This Silhouette →
            </Link>
          </div>
        </div>

        {/* Right: Thumbnails Reel & Collection Quick Selector */}
        <div>
          <div style={{ marginBottom: "24px" }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#8C6D58", textTransform: "uppercase", letterSpacing: "1.5px" }}>
              SELECT SILHOUETTE
            </span>
            <h3 style={{ fontFamily: "Fraunces, serif", fontSize: "28px", margin: "8px 0 16px" }}>
              Featured Runway Poses
            </h3>
            <p style={{ color: "rgba(250,248,245,0.7)", fontSize: "14.5px", lineHeight: "1.7" }}>
              Click any look below to view how our fluid mulberry silks, embroidered poplins, and breezy linens move under natural sunlight.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" }}>
            {LOOKBOOK_REEL.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => {
                  setActiveIndex(idx);
                  setIsPlaying(false);
                }}
                style={{
                  position: "relative",
                  borderRadius: "14px",
                  overflow: "hidden",
                  aspectRatio: "3/4",
                  cursor: "pointer",
                  border: activeIndex === idx ? "2px solid #D4A373" : "1px solid rgba(255,255,255,0.1)",
                  transform: activeIndex === idx ? "scale(1.03)" : "scale(1)",
                  transition: "all 0.3s ease",
                  boxShadow: activeIndex === idx ? "0 8px 24px rgba(212,163,115,0.25)" : "none",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                />
                <div style={{ position: "absolute", inset: 0, background: activeIndex === idx ? "transparent" : "rgba(0,0,0,0.35)" }} />
                <div style={{ position: "absolute", bottom: "6px", left: "8px", right: "8px", fontSize: "10px", color: "white", fontFamily: "'Space Mono', monospace", fontWeight: "600", textShadow: "0 1px 4px rgba(0,0,0,0.8)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.name.split(" ")[0]}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <Link
              href="/shop"
              style={{
                background: "#FAF8F5",
                color: "#141C19",
                padding: "12px 28px",
                borderRadius: "30px",
                fontSize: "14px",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Explore All 78 Silhouettes →
            </Link>
            <Link
              href="/collections/honeymoon"
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "#FAF8F5",
                padding: "12px 24px",
                borderRadius: "30px",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Wedding Night Edit
            </Link>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes kenburns {
          0% {
            transform: scale(1) translate(0, 0);
          }
          100% {
            transform: scale(1.08) translate(-1%, -1%);
          }
        }
      `}</style>
    </section>
  );
}
