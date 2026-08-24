"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const FREE_SHIPPING_THRESHOLD = 100;

export default function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    prepaidDiscount,
    total,
    itemCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    isCartOpen,
    closeCart,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  async function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponError("");

    const res = await applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.error || "Invalid coupon code.");
    } else {
      setCouponInput("");
    }
    setCouponLoading(false);
  }

  function handleQuickApply(code: string) {
    setCouponInput(code);
    setCopiedCoupon(code);
    applyCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  }

  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-drawer-backdrop ${isCartOpen ? "active" : ""}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <aside
        className={`cart-drawer ${isCartOpen ? "open" : ""}`}
        aria-label="Shopping Bag"
      >
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title">
            <span>YOUR BAG</span>
            <span className="cart-drawer-count">({itemCount} {itemCount === 1 ? "item" : "items"})</span>
          </div>
          <button
            type="button"
            className="cart-drawer-close"
            onClick={closeCart}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="cart-shipping-banner">
          {subtotal >= FREE_SHIPPING_THRESHOLD ? (
            <div className="shipping-unlocked-text">
              <span>🎉</span>
              <strong>You've unlocked FREE Worldwide Shipping!</strong>
            </div>
          ) : (
            <div className="shipping-progress-text">
              <span>✈️</span>
              <span>
                Add <strong>${amountToFreeShipping.toFixed(2)}</strong> more for <strong>FREE Shipping</strong>
              </span>
            </div>
          )}
          <div className="shipping-progress-track">
            <div
              className="shipping-progress-fill"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {/* Prepaid Offer Alert */}
        <div className="cart-prepaid-alert">
          <span>🏷️</span>
          <span>
            <strong>Extra 5% OFF</strong> on prepaid orders — applied automatically at checkout
          </span>
        </div>

        {/* Drawer Body (Items List or Empty State) */}
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-drawer-empty">
              <div className="empty-bag-icon">🛍️</div>
              <h3>Your bag is empty</h3>
              <p>Explore our resort collection and hand-finished holiday edits.</p>
              <button
                type="button"
                className="btn btn-empty-browse"
                onClick={closeCart}
              >
                Browse Collection
              </button>
            </div>
          ) : (
            <div className="cart-drawer-items-list">
              {items.map((item) => (
                <div className="cart-drawer-item" key={`${item.id}-${item.size || "nosize"}`}>
                  <div className="cart-item-thumb">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="cart-item-placeholder">SANDLINE</div>
                    )}
                  </div>

                  <div className="cart-item-details">
                    <div className="cart-item-head">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <button
                        type="button"
                        className="cart-item-remove-btn"
                        onClick={() => removeFromCart(item.id, item.size)}
                        aria-label="Remove item"
                      >
                        ✕
                      </button>
                    </div>

                    {item.size && (
                      <div className="cart-item-variant">
                        <span>Size:</span> <strong>{item.size}</strong>
                      </div>
                    )}

                    <div className="cart-item-foot">
                      {/* Quantity Stepper */}
                      <div className="cart-qty-stepper">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Price */}
                      <div className="cart-item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer (Summary, Coupons, Checkout CTA) */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Promo Code Section */}
            <div className="drawer-promo-section">
              {appliedCoupon ? (
                <div className="drawer-applied-coupon">
                  <div className="coupon-tag-info">
                    <span>✓ Coupon <strong>{appliedCoupon.code}</strong> Applied</span>
                    <span className="coupon-saved-val">
                      (-${discount.toFixed(2)})
                    </span>
                  </div>
                  <button
                    type="button"
                    className="coupon-remove-link"
                    onClick={removeCoupon}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="drawer-promo-form">
                  <input
                    type="text"
                    placeholder="Discount code (e.g. NEW10)"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      if (couponError) setCouponError("");
                    }}
                  />
                  <button type="submit" disabled={couponLoading}>
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </form>
              )}
              {couponError && <p className="drawer-coupon-error">{couponError}</p>}

              {/* Quick Coupon Suggestions */}
              {!appliedCoupon && (
                <div className="drawer-quick-coupons">
                  <span className="quick-coupon-label">Available offers:</span>
                  <button
                    type="button"
                    className="quick-coupon-chip"
                    onClick={() => handleQuickApply("NEW10")}
                  >
                    <strong>NEW10</strong> (10% OFF)
                  </button>
                  <button
                    type="button"
                    className="quick-coupon-chip"
                    onClick={() => handleQuickApply("SANDLINE5")}
                  >
                    <strong>SANDLINE5</strong> (5% OFF)
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="drawer-price-breakdown">
              <div className="drawer-price-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="drawer-price-row discount-row">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="drawer-price-row">
                <span>Prepaid Savings (Extra 5%)</span>
                <span className="prepaid-green">-${prepaidDiscount.toFixed(2)}</span>
              </div>
              <div className="drawer-price-row total-row">
                <span>Estimated Total</span>
                <div className="total-amount-box">
                  <span className="final-total">${(total - prepaidDiscount).toFixed(2)}</span>
                  <span className="total-note">Incl. all taxes</span>
                </div>
              </div>
            </div>

            {/* Checkout Action */}
            <div className="drawer-cta-group">
              <Link
                href="/checkout"
                className="btn btn-drawer-checkout"
                onClick={closeCart}
              >
                PROCEED TO CHECKOUT ➔
              </Link>
              <button
                type="button"
                className="btn-drawer-continue"
                onClick={closeCart}
              >
                Continue Shopping
              </button>
            </div>

            {/* Trust Footer */}
            <div className="drawer-trust-badges">
              <span>🔒 256-Bit SSL Checkout</span>
              <span>•</span>
              <span>✈️ Worldwide Express</span>
              <span>•</span>
              <span>🔄 7-Day Returns</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
