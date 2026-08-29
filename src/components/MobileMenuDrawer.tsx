"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuthModal } from "@/context/AuthModalContext";
import CurrencySelector from "@/components/CurrencySelector";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
  const { openAuthModal } = useAuthModal();

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

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "rgba(17, 24, 39, 0.6)",
        backdropFilter: "blur(8px)",
        display: "flex",
        transition: "opacity 0.25s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "82%",
          maxWidth: "320px",
          height: "100%",
          background: "#FAF8F5",
          display: "flex",
          flexDirection: "column",
          padding: "24px 20px 30px",
          boxShadow: "10px 0 30px rgba(0,0,0,0.15)",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <img
            src="/images/logo-horizontal.png"
            alt="SANDLINE"
            style={{ height: "24px", objectFit: "contain" }}
          />
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              color: "#111827",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Currency Switcher Row */}
        <div style={{ background: "#FFFFFF", padding: "12px 14px", borderRadius: "12px", border: "1px solid #EAE6DF", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "12px", color: "#666", fontFamily: "'Space Mono', monospace" }}>CURRENCY:</span>
          <CurrencySelector variant="navbar" />
        </div>

        {/* Main Nav Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "1px", color: "#8C6D58", fontFamily: "'Space Mono', monospace", textTransform: "uppercase" }}>
            Collections &amp; Edits
          </div>
          <Link
            href="/shop"
            onClick={onClose}
            style={{ fontSize: "16px", fontWeight: "600", color: "#111827", textDecoration: "none", fontFamily: "'Fraunces', serif" }}
          >
            All Silhouettes (41 Pieces) →
          </Link>
          <Link
            href="/collections/beach_party"
            onClick={onClose}
            style={{ fontSize: "15px", color: "#4B5563", textDecoration: "none" }}
          >
            The Beach Party Edit
          </Link>
          <Link
            href="/collections/honeymoon"
            onClick={onClose}
            style={{ fontSize: "15px", color: "#4B5563", textDecoration: "none" }}
          >
            The Wedding Night Edit
          </Link>
          <Link
            href="/collections/resort_evening"
            onClick={onClose}
            style={{ fontSize: "15px", color: "#4B5563", textDecoration: "none" }}
          >
            The Resort Evening Edit
          </Link>
        </div>

        {/* Studio & Craft Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "32px", borderTop: "1px solid #EAE6DF", paddingTop: "20px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "1px", color: "#8C6D58", fontFamily: "'Space Mono', monospace", textTransform: "uppercase" }}>
            Studio &amp; Care
          </div>
          <Link
            href="/story"
            onClick={onClose}
            style={{ fontSize: "14px", color: "#374151", textDecoration: "none" }}
          >
            The Sandline Story
          </Link>
          <Link
            href="/size-guide"
            onClick={onClose}
            style={{ fontSize: "14px", color: "#374151", textDecoration: "none" }}
          >
            Size &amp; Fit Guide
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            style={{ fontSize: "14px", color: "#374151", textDecoration: "none" }}
          >
            Concierge &amp; WhatsApp
          </Link>
          <Link
            href="/shipping-returns"
            onClick={onClose}
            style={{ fontSize: "14px", color: "#374151", textDecoration: "none" }}
          >
            Shipping &amp; Worldwide Delivery
          </Link>
        </div>

        {/* Sign In CTA */}
        <div style={{ marginTop: "auto", borderTop: "1px solid #EAE6DF", paddingTop: "20px" }}>
          <button
            type="button"
            onClick={() => {
              onClose();
              openAuthModal("phone");
            }}
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
            SIGN IN / MY ACCOUNT 👤
          </button>
        </div>
      </div>
    </div>
  );
}
