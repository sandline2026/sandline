"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  selling_price_usd: number;
  collection: string;
  images: string[] | null;
}

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "Santorini Silk",
  "Riviera Crystal",
  "St. Tropez Ruffle",
  "Honeymoon Slip",
  "Linen Dress",
  "Beach Party",
];

export default function MobileSearchModal({ isOpen, onClose }: MobileSearchModalProps) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const { formatPrice } = useCurrency();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/products`);
        if (res.ok) {
          const all: SearchProduct[] = await res.json();
          const q = query.toLowerCase();
          const filtered = all
            .filter(
              (p) =>
                p.name.toLowerCase().includes(q) ||
                (p.collection && p.collection.toLowerCase().includes(q))
            )
            .slice(0, 8);
          setProducts(filtered);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(17, 24, 39, 0.6)",
        backdropFilter: "blur(6px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
          padding: "20px 20px 24px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#FAF8F5",
              border: "1px solid #EAE6DF",
              borderRadius: "30px",
              padding: "10px 16px",
            }}
          >
            <span style={{ fontSize: "16px", color: "#888" }}>🔍</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search resort dresses, silks, co-ords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: "14px",
                width: "100%",
                fontFamily: "'Work Sans', sans-serif",
                color: "#111827",
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "14px",
                  color: "#999",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "14px",
              fontWeight: "600",
              color: "#111827",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            Cancel
          </button>
        </div>

        {/* Popular Tags when query is empty */}
        {!query && (
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#888", marginBottom: "10px", fontFamily: "'Space Mono', monospace" }}>
              Popular Searches
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {POPULAR_SEARCHES.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  style={{
                    background: "#FAF8F5",
                    border: "1px solid #EAE6DF",
                    borderRadius: "20px",
                    padding: "6px 14px",
                    fontSize: "12.5px",
                    color: "#333",
                    cursor: "pointer",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {query && (
          <div style={{ overflowY: "auto", flex: 1, marginTop: "10px" }}>
            {loading && <p style={{ fontSize: "13px", color: "#888", textAlign: "center", margin: "20px 0" }}>Searching silhouettes...</p>}
            {!loading && products.length === 0 && (
              <p style={{ fontSize: "13px", color: "#666", textAlign: "center", margin: "30px 0" }}>
                No silhouettes found for &quot;{query}&quot;. Try exploring our <Link href="/shop" onClick={onClose} style={{ textDecoration: "underline", color: "#111827" }}>Catalog</Link>.
              </p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {products.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  onClick={onClose}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "8px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    color: "inherit",
                    background: "#FAF8F5",
                  }}
                >
                  <img
                    src={p.images?.[0] || "/images/products/santorini-3d-floral-silk-slip-dress.jpg"}
                    alt={p.name}
                    style={{ width: "48px", height: "60px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#888", textTransform: "capitalize" }}>
                      {p.collection ? p.collection.replace(/_/g, " ") : "Resort Wear"}
                    </div>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#111827", fontFamily: "'Space Mono', monospace" }}>
                    {formatPrice(Number(p.selling_price_usd))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
