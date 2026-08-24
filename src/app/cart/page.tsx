"use client";

import Link from "next/link";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import "../sandline.css";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  async function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponError("");

    const result = await applyCoupon(couponInput);
    if (!result.success) {
      setCouponError(result.error || "Invalid coupon code.");
    } else {
      setCouponInput("");
    }
    setCouponLoading(false);
  }

  return (
    <div className="sandline-page">
      <nav>
        <Link className="logo brand-logo-wrap" href="/"><img src="/images/logo-horizontal.png" alt="SANDLINE Resort Wear" className="site-brand-logo" /></Link>
        <div className="nav-links">
          <a href="/shop">Shop</a>
          <a href="/#story">Story</a>
          <a href="/#contact">Contact</a>
          <a href="/cart">Cart</a>
        </div>
      </nav>

      <div className="shop-header">
        <h1>Your cart.</h1>
      </div>

      <div className="cart-wrap">
        {items.length === 0 ? (
          <p className="empty-state">
            Your cart is empty. <a href="/shop" style={{ textDecoration: "underline" }}>Browse the collection</a>.
          </p>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-row" key={item.id}>
                  <div className="cart-row-name">{item.name}</div>
                  <div className="cart-row-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div className="cart-row-price">${(item.price * item.quantity).toFixed(2)}</div>
                  <button className="cart-row-remove" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              {/* Promo Code Box */}
              <div className="promo-box">
                {appliedCoupon ? (
                  <div className="promo-applied-tag">
                    <div>
                      <span>Coupon: </span>
                      <strong>{appliedCoupon.code}</strong>
                      <span style={{ fontSize: "12px", opacity: 0.85, marginLeft: "4px" }}>
                        ({appliedCoupon.discount_type === "percentage" ? `${appliedCoupon.discount_value}% off` : `$${appliedCoupon.discount_value} off`})
                      </span>
                    </div>
                    <button className="promo-remove-btn" onClick={removeCoupon}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon}>
                    <div className="promo-input-group">
                      <input
                        type="text"
                        className="promo-input"
                        placeholder="Promo code (e.g. SUMMER20)"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          if (couponError) setCouponError("");
                        }}
                      />
                      <button className="promo-btn" type="submit" disabled={couponLoading}>
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponError && <p className="promo-error">{couponError}</p>}
                  </form>
                )}
              </div>

              <div className="cart-subtotal" style={{ fontSize: "16px", marginTop: "16px" }}>
                <span style={{ color: "rgba(27,36,32,0.7)" }}>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="cart-discount-row">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="cart-total-row">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <a className="btn" href="/checkout" style={{ display: "block", textAlign: "center", marginTop: "24px" }}>
                Proceed to checkout
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}