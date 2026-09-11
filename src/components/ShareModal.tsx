"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Copy, Check, Share2, MessageCircle, Send, Mail } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    price?: number;
    image?: string | null;
    slug?: string;
  };
}

export default function ShareModal({
  isOpen,
  onClose,
  product,
}: ShareModalProps) {
  const { formatPrice } = useCurrency();
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        setCanNativeShare(true);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCopied(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const shareText = `Look at this stunning resort piece from Sandline Studio: ${product.name} ✨\n${shareUrl}`;

  function handleCopy() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } else {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  function handleWhatsAppShare() {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  }

  function handleTwitterShare() {
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `Discovered this gorgeous resort piece at Sandline Studio: ${product.name}`
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twUrl, "_blank", "noopener,noreferrer");
  }

  function handleFacebookShare() {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, "_blank", "noopener,noreferrer");
  }

  function handleEmailShare() {
    const mailUrl = `mailto:?subject=${encodeURIComponent(
      `Check out ${product.name} on Sandline Studio`
    )}&body=${encodeURIComponent(shareText)}`;
    window.location.href = mailUrl;
  }

  async function handleNativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} — Sandline Studio`,
          text: `Discovered this gorgeous resort piece at Sandline Studio: ${product.name}`,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed silently
      }
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(17, 24, 39, 0.65)",
        backdropFilter: "blur(6px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#FAF8F5",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "460px",
          border: "1px solid #EAE6DF",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          overflow: "hidden",
          animation: "fadeIn 0.2s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #EAE6DF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Share2 size={18} color="#D97706" />
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                fontFamily: "Georgia, serif",
                color: "#111827",
                letterSpacing: "0.02em",
              }}
            >
              Share This Design
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "#6B7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Product Preview Card */}
        <div style={{ padding: "20px 24px 16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "12px",
              backgroundColor: "#FFFFFF",
              borderRadius: "14px",
              border: "1px solid #EAE6DF",
              marginBottom: "20px",
            }}
          >
            {product.image ? (
              <div
                style={{
                  position: "relative",
                  width: "56px",
                  height: "72px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  flexShrink: 0,
                  backgroundColor: "#F3F4F6",
                }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="56px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ) : null}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "10px",
                  fontFamily: "monospace",
                  textTransform: "uppercase",
                  color: "#D97706",
                  letterSpacing: "0.1em",
                  marginBottom: "4px",
                }}
              >
                ✦ Sandline Studio Resortwear
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#111827",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {product.name}
              </div>
              {product.price ? (
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#111827",
                    marginTop: "2px",
                    fontFamily: "monospace",
                  }}
                >
                  {formatPrice(product.price)}
                </div>
              ) : null}
            </div>
          </div>

          {/* Primary Action: WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            style={{
              width: "100%",
              backgroundColor: "#25D366",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "12px",
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "0.03em",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(37, 211, 102, 0.25)",
              marginBottom: "12px",
              transition: "transform 0.1s ease, opacity 0.1s ease",
            }}
          >
            <MessageCircle size={20} fill="#FFFFFF" />
            <span>Share on WhatsApp</span>
          </button>

          {/* Direct Copy Link Box */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              border: "1px solid #EAE6DF",
              padding: "6px 6px 6px 14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "18px",
            }}
          >
            <span
              style={{
                flex: 1,
                fontSize: "12px",
                fontFamily: "monospace",
                color: "#6B7280",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {shareUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                backgroundColor: copied ? "#059669" : "#111827",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "11.5px",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          {/* Social Icons Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
              marginBottom: canNativeShare ? "14px" : "8px",
            }}
          >
            <button
              type="button"
              onClick={handleTwitterShare}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #EAE6DF",
                borderRadius: "10px",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#111827",
                cursor: "pointer",
              }}
            >
              <Send size={14} color="#1DA1F2" />
              <span>Twitter / X</span>
            </button>

            <button
              type="button"
              onClick={handleFacebookShare}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #EAE6DF",
                borderRadius: "10px",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#111827",
                cursor: "pointer",
              }}
            >
              <span style={{ color: "#1877F2", fontWeight: 900, fontSize: "14px" }}>f</span>
              <span>Facebook</span>
            </button>

            <button
              type="button"
              onClick={handleEmailShare}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #EAE6DF",
                borderRadius: "10px",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#111827",
                cursor: "pointer",
              }}
            >
              <Mail size={14} color="#6B7280" />
              <span>Email</span>
            </button>
          </div>

          {/* Native System Share (AirDrop, Messages, Instagram on iOS/Android) */}
          {canNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              style={{
                width: "100%",
                backgroundColor: "transparent",
                color: "#111827",
                border: "1px dashed #D1D5DB",
                borderRadius: "10px",
                padding: "10px",
                fontSize: "12px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              <Share2 size={14} />
              <span>More Options (AirDrop, Messages, Instagram)</span>
            </button>
          )}
        </div>

        {/* Footer info */}
        <div
          style={{
            backgroundColor: "#F3F4F6",
            padding: "12px 24px",
            borderTop: "1px solid #EAE6DF",
            textAlign: "center",
            fontSize: "11px",
            color: "#9CA3AF",
          }}
        >
          ✦ Handcrafted Resortwear • Made in India • Shipped Worldwide
        </div>
      </div>
    </div>
  );
}
