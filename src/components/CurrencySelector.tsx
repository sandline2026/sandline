"use client";

import { useState, useRef, useEffect } from "react";
import { useCurrency, CURRENCIES, CurrencyCode } from "@/context/CurrencyContext";

interface CurrencySelectorProps {
  variant?: "navbar" | "footer" | "banner";
}

export default function CurrencySelector({ variant = "navbar" }: CurrencySelectorProps) {
  const { currency, setCurrency, currencyConfig } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currenciesList: CurrencyCode[] = ["INR", "USD", "EUR", "GBP", "AED"];

  return (
    <div
      ref={dropdownRef}
      className={`currency-selector-wrap currency-variant-${variant}`}
      style={{ position: "relative", display: "inline-block" }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Select Currency"
        style={{
          background: "transparent",
          border: variant === "navbar" ? "1px solid rgba(0, 0, 0, 0.15)" : "1px solid rgba(255, 255, 255, 0.2)",
          color: "inherit",
          padding: "5px 10px",
          borderRadius: "20px",
          fontSize: "12px",
          fontFamily: "'Space Mono', monospace",
          letterSpacing: "0.5px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          transition: "all 0.2s ease",
        }}
      >
        <span style={{ fontSize: "13px" }}>{currencyConfig.flag}</span>
        <span style={{ fontWeight: "600" }}>{currencyConfig.code} ({currencyConfig.symbol})</span>
        <span style={{ fontSize: "9px", opacity: 0.7 }}>▾</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: variant === "footer" ? "auto" : 0,
            left: variant === "footer" ? 0 : "auto",
            background: "#FFFFFF",
            color: "#111827",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            border: "1px solid #EAE6DF",
            padding: "6px",
            minWidth: "150px",
            zIndex: 9999,
            animation: "fadeIn 0.15s ease",
          }}
        >
          {currenciesList.map((code) => {
            const item = CURRENCIES[code];
            const isSelected = code === currency;
            return (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setCurrency(code);
                  setIsOpen(false);
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: isSelected ? "#F4EFE6" : "transparent",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontFamily: "'Work Sans', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  color: isSelected ? "#111827" : "#4B5563",
                  fontWeight: isSelected ? "600" : "400",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "#FAF8F5";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>{item.flag}</span>
                  <span>{item.label}</span>
                </div>
                {isSelected && <span style={{ color: "#D97706", fontSize: "11px" }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
