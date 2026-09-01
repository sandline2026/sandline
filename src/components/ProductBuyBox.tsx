"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency } from "@/context/CurrencyContext";
import NotifyMeForm from "@/components/NotifyMeForm";
import SizeGuideModal from "@/components/SizeGuideModal";

interface ProductBuyBoxProps {
  id: string;
  name: string;
  price: number;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  image: string | null;
}

export default function ProductBuyBox({
  id,
  name,
  price,
  sizes = [],
  colors = [],
  inStock,
  image,
}: ProductBuyBoxProps) {
  const router = useRouter();
  const { addToCart, applyCoupon } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { formatPrice } = useCurrency();

  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || "");
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showStickyBar, setShowStickyBar] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);

  const buyBoxRef = useRef<HTMLDivElement>(null);
  const wishlisted = isWishlisted(id);

  // Calculate pricing
  const couponDiscountVal = Math.round(price * 0.1 * 100) / 100;
  const afterCoupon = price - couponDiscountVal;
  const prepaidDiscountVal = Math.round(afterCoupon * 0.05 * 100) / 100;
  const finalPrice = Math.round((afterCoupon - prepaidDiscountVal) * 100) / 100;
  const totalSavings = Math.round((price - finalPrice) * 100) / 100;

  // Track scroll for sticky bottom bar
  useEffect(() => {
    function handleScroll() {
      if (!buyBoxRef.current) return;
      const rect = buyBoxRef.current.getBoundingClientRect();
      // Show sticky bar when user scrolls past the main buy box
      if (rect.bottom < 0) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id,
        name,
        price,
        image,
        size: selectedSize || undefined,
        color: selectedColor || undefined,
      });
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  }

  function handleBuyNow() {
    addToCart({
      id,
      name,
      price,
      image,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });
    router.push("/checkout");
  }

  function copyCoupon(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    setTimeout(() => setCopiedCode(null), 2500);
  }

  return (
    <div className="product-buybox" ref={buyBoxRef}>
      {/* Prepaid Offer Alert */}
      <div className="buybox-prepaid-banner">
        <span className="banner-icon">🏷️</span>
        <span className="banner-text">
          Extra <strong>5% OFF</strong> on prepaid orders — applied automatically at checkout.
        </span>
      </div>

      {/* Size Selector */}
      {sizes.length > 0 && (
        <div className="buybox-option-group">
          <div className="buybox-option-header">
            <span className="buybox-option-label">
              SIZE: <strong>{selectedSize || "Select"}</strong>
            </span>
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(true)}
              className="buybox-find-size-pill"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              📏 Size &amp; Fit Guide →
            </button>
          </div>
          <div className="buybox-swatch-row">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                className={`buybox-size-btn ${selectedSize === s ? "active" : ""}`}
                onClick={() => setSelectedSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Social Proof Fit Badge */}
          <div className="buybox-fit-social-proof">
            <span className="fit-indicator-dot" />
            <span>
              Not sure? <strong>80% of buyers</strong> say this fits true to size —{" "}
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                style={{ background: "none", border: "none", padding: 0, textDecoration: "underline", color: "inherit", cursor: "pointer", fontWeight: 600 }}
              >
                view size chart
              </button>
            </span>
          </div>
        </div>
      )}

      {/* Color Selector */}
      {colors.length > 0 && (
        <div className="buybox-option-group">
          <div className="buybox-option-header">
            <span className="buybox-option-label">
              COLOR: <strong>{selectedColor || "None"}</strong>
            </span>
          </div>
          <div className="buybox-swatch-row">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                className={`buybox-color-btn ${selectedColor === c ? "active" : ""}`}
                onClick={() => setSelectedColor(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* "You Actually Pay" Smart Pricing Breakdown */}
      <div className="buybox-actual-pay-card">
        <div
          className="actual-pay-header"
          onClick={() => setShowPriceBreakdown((prev) => !prev)}
        >
          <div className="actual-pay-title-group">
            <span className="actual-pay-label">You actually pay</span>
            <div className="actual-pay-prices">
              <span className="final-price-bold">{formatPrice(finalPrice)}</span>
              <span className="original-strike">{formatPrice(price)}</span>
              <span className="savings-green-pill">Save {formatPrice(totalSavings)}</span>
            </div>
          </div>
          <button type="button" className="actual-pay-toggle-link">
            {showPriceBreakdown ? "See it how? ⌃" : "See it how? ⌄"}
          </button>
        </div>

        {showPriceBreakdown && (
          <div className="actual-pay-breakdown">
            <div className="breakdown-row">
              <span>Listed price</span>
              <span>{formatPrice(price)}</span>
            </div>
            <div className="breakdown-row discount-text">
              <span>
                <code className="coupon-inline-tag">NEW10</code> — 10% off
              </span>
              <span>-{formatPrice(couponDiscountVal)}</span>
            </div>
            <div className="breakdown-row discount-text">
              <span>Prepaid — extra 5% off</span>
              <span>-{formatPrice(prepaidDiscountVal)}</span>
            </div>
            <div className="breakdown-divider" />
            <div className="breakdown-row breakdown-final-row">
              <strong>Your final price</strong>
              <strong>{formatPrice(finalPrice)}</strong>
            </div>
            <div className="breakdown-explainer">
              • <code>NEW10</code> gives 10% off on your first order.<br />
              • Extra 5% is automatic for prepaid orders and stacks with codes.
            </div>
          </div>
        )}
      </div>

      {/* "Offers For You" Card */}
      <div className="buybox-offers-card">
        <div className="offers-card-header">
          <span>🎁</span>
          <strong>OFFERS FOR YOU</strong>
        </div>
        <div className="offers-list">
          <div className="offer-item">
            <div className="offer-item-content">
              <span className="offer-code-chip">NEW10</span>
              <div className="offer-details">
                <strong>10% OFF your first order</strong>
                <span>Apply at checkout</span>
              </div>
            </div>
            <button
              type="button"
              className={`offer-copy-btn ${copiedCode === "NEW10" ? "copied" : ""}`}
              onClick={() => copyCoupon("NEW10")}
            >
              {copiedCode === "NEW10" ? "✓ COPIED" : "TAP TO COPY"}
            </button>
          </div>

          <div className="offer-item">
            <div className="offer-item-content">
              <span className="offer-code-chip">SANDLINE5</span>
              <div className="offer-details">
                <strong>5% OFF entire order</strong>
                <span>Special resort edit discount</span>
              </div>
            </div>
            <button
              type="button"
              className={`offer-copy-btn ${copiedCode === "SANDLINE5" ? "copied" : ""}`}
              onClick={() => copyCoupon("SANDLINE5")}
            >
              {copiedCode === "SANDLINE5" ? "✓ COPIED" : "TAP TO COPY"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Action Buttons */}
      {inStock ? (
        <div className="buybox-actions-stack">
          {/* Quantity and Add to Bag */}
          <div className="buybox-qty-cart-row">
            <div className="buybox-qty-control">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="buybox-add-to-bag-btn"
              onClick={handleAddToCart}
            >
              {isAdded ? "✓ Added to Bag" : "ADD TO BAG"}
            </button>
          </div>

          {/* BUY NOW Button */}
          <button
            type="button"
            className="buybox-buy-now-btn"
            onClick={handleBuyNow}
          >
            BUY NOW
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            className={`buybox-wishlist-toggle ${wishlisted ? "active" : ""}`}
            onClick={() => toggleWishlist({ id, name, price, image })}
          >
            <span>{wishlisted ? "♥ Saved to Wishlist" : "♡ Add to Wishlist"}</span>
          </button>
        </div>
      ) : (
        <div className="buybox-out-of-stock-box">
          <div className="out-of-stock-title">Currently Sold Out</div>
          <p className="out-of-stock-subtitle">
            Enter your email to receive an instant notification when this piece is restocked.
          </p>
          <NotifyMeForm productId={id} />
          <button
            type="button"
            className={`buybox-wishlist-toggle ${wishlisted ? "active" : ""}`}
            style={{ marginTop: "12px" }}
            onClick={() => toggleWishlist({ id, name, price, image })}
          >
            <span>{wishlisted ? "♥ Saved to Wishlist" : "♡ Save to Wishlist for Later"}</span>
          </button>
        </div>
      )}

      {/* Sticky Bottom Floating Quick-Add Bar (Scrolls with user) */}
      <div className={`buybox-sticky-floating-bar ${showStickyBar && inStock ? "visible" : ""}`}>
        <div className="sticky-bar-content">
          <div className="sticky-bar-perk">
            <span>%</span>
            <span>
              Get it for <strong>{formatPrice(finalPrice)}</strong> — Save <strong>{formatPrice(totalSavings)}</strong> instantly with online payment
            </span>
          </div>

          <div className="sticky-bar-action-row">
            <div className="sticky-bar-price-info">
              <span className="sticky-saving-text">Saving {formatPrice(totalSavings)}</span>
              <div className="sticky-prices">
                <strong>{formatPrice(finalPrice)}</strong>
                <span className="sticky-strike">{formatPrice(price)}</span>
                <span className="sticky-discount-badge">-15%</span>
              </div>
            </div>

            <button
              type="button"
              className="sticky-bar-add-btn"
              onClick={handleAddToCart}
            >
              Add To Bag →
            </button>
          </div>
        </div>
      </div>

      {/* Interactive 1-Tap Size & Fit Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        selectedSize={selectedSize}
        onSelectSize={(s) => {
          setSelectedSize(s);
          setIsSizeGuideOpen(false);
        }}
      />
    </div>
  );
}
