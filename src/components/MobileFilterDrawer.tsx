"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface MobileFilterDrawerProps {
  allSizes: string[];
  allFabrics: string[];
  allColors: string[];
  activeSizes: string[];
  activeFabrics: string[];
  activeColors: string[];
  collectionSlug?: string;
}

export default function MobileFilterDrawer({
  allSizes,
  allFabrics,
  allColors,
  activeSizes,
  activeFabrics,
  activeColors,
  collectionSlug,
}: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalActive = activeSizes.length + activeFabrics.length + activeColors.length;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function buildFilterLink(param: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(param)?.split(",").filter(Boolean) || [];

    let updated: string[];
    if (current.includes(value)) {
      updated = current.filter((v) => v !== value);
    } else {
      updated = [...current, value];
    }

    if (updated.length > 0) {
      params.set(param, updated.join(","));
    } else {
      params.delete(param);
    }

    const basePath = collectionSlug ? `/collections/${collectionSlug}` : "/shop";
    return `${basePath}?${params.toString()}`;
  }

  const resetHref = collectionSlug ? `/collections/${collectionSlug}` : "/shop";

  return (
    <>
      {/* Mobile Filter Trigger Button (Visible only on mobile <= 860px) */}
      <button
        type="button"
        className="mobile-filter-trigger-btn"
        onClick={() => setIsOpen(true)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="21" x2="4" y2="14"/>
          <line x1="4" y1="10" x2="4" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12" y2="3"/>
          <line x1="20" y1="21" x2="20" y2="16"/>
          <line x1="20" y1="12" x2="20" y2="3"/>
          <line x1="1" y1="14" x2="7" y2="14"/>
          <line x1="9" y1="8" x2="15" y2="8"/>
          <line x1="17" y1="16" x2="23" y2="16"/>
        </svg>
        <span>FILTERS</span>
        {totalActive > 0 && (
          <span className="filter-count-badge">{totalActive}</span>
        )}
      </button>

      {/* Slide-Up Drawer Modal */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            background: "rgba(17, 24, 39, 0.6)",
            backdropFilter: "blur(6px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              padding: "20px 20px 30px",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 -10px 40px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", borderBottom: "1px solid #EAE6DF", paddingBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", fontWeight: "600", color: "#111827" }}>
                  Refine Collection
                </span>
                {totalActive > 0 && (
                  <span style={{ fontSize: "11px", background: "#111827", color: "#FFF", borderRadius: "10px", padding: "1px 7px", fontFamily: "'Space Mono', monospace" }}>
                    {totalActive}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                {totalActive > 0 && (
                  <Link
                    href={resetHref}
                    onClick={() => setIsOpen(false)}
                    style={{ fontSize: "12px", color: "#E05A47", textDecoration: "underline", fontFamily: "'Space Mono', monospace", fontWeight: "600" }}
                  >
                    Reset All
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{ background: "none", border: "none", fontSize: "18px", color: "#666", cursor: "pointer", padding: "4px" }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable Filters Body */}
            <div style={{ overflowY: "auto", flex: 1, paddingRight: "4px" }}>
              {/* Sizes */}
              {allSizes.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontSize: "11.5px", letterSpacing: "1px", color: "#8C6D58", fontFamily: "'Space Mono', monospace", textTransform: "uppercase", marginBottom: "10px", fontWeight: "700" }}>
                    Size
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                    {allSizes.map((s) => {
                      const active = activeSizes.includes(s);
                      return (
                        <Link
                          key={s}
                          href={buildFilterLink("sizes", s)}
                          onClick={() => setIsOpen(false)}
                          style={{
                            textAlign: "center",
                            padding: "9px 4px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontFamily: "'Space Mono', monospace",
                            fontWeight: "600",
                            textDecoration: "none",
                            background: active ? "#111827" : "#FAF8F5",
                            color: active ? "#FFFFFF" : "#111827",
                            border: `1px solid ${active ? "#111827" : "#EAE6DF"}`,
                          }}
                        >
                          {s}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Fabrics */}
              {allFabrics.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontSize: "11.5px", letterSpacing: "1px", color: "#8C6D58", fontFamily: "'Space Mono', monospace", textTransform: "uppercase", marginBottom: "10px", fontWeight: "700" }}>
                    Fabric
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {allFabrics.map((f) => {
                      const active = activeFabrics.includes(f);
                      return (
                        <Link
                          key={f}
                          href={buildFilterLink("fabric", f)}
                          onClick={() => setIsOpen(false)}
                          style={{
                            padding: "7px 14px",
                            borderRadius: "20px",
                            fontSize: "12.5px",
                            textDecoration: "none",
                            background: active ? "#111827" : "#FAF8F5",
                            color: active ? "#FFFFFF" : "#111827",
                            border: `1px solid ${active ? "#111827" : "#EAE6DF"}`,
                          }}
                        >
                          {f} {active && "✓"}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Colors */}
              {allColors.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontSize: "11.5px", letterSpacing: "1px", color: "#8C6D58", fontFamily: "'Space Mono', monospace", textTransform: "uppercase", marginBottom: "10px", fontWeight: "700" }}>
                    Color
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {allColors.map((c) => {
                      const active = activeColors.includes(c);
                      return (
                        <Link
                          key={c}
                          href={buildFilterLink("colors", c)}
                          onClick={() => setIsOpen(false)}
                          style={{
                            padding: "7px 14px",
                            borderRadius: "20px",
                            fontSize: "12.5px",
                            textDecoration: "none",
                            background: active ? "#111827" : "#FAF8F5",
                            color: active ? "#FFFFFF" : "#111827",
                            border: `1px solid ${active ? "#111827" : "#EAE6DF"}`,
                          }}
                        >
                          {c} {active && "✓"}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Apply Button */}
            <div style={{ paddingTop: "14px", borderTop: "1px solid #EAE6DF" }}>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  width: "100%",
                  background: "#111827",
                  color: "#FFFFFF",
                  padding: "13px",
                  borderRadius: "30px",
                  border: "none",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "12.5px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                APPLY &amp; VIEW SILHOUETTES
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
