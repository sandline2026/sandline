"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import "../sandline.css";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Real payment (Stripe/PayPal) will connect here later.
    setSubmitted(true);
    clearCart();
  }

  if (submitted) {
    return (
      <div className="sandline-page">
        <nav>
          <a className="logo" href="/">SAND<span>LINE</span></a>
        </nav>
        <div className="shop-header">
          <h1>Thank you.</h1>
          <p>Your order has been received. (Payment integration coming next.)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sandline-page">
      <nav>
        <a className="logo" href="/">SAND<span>LINE</span></a>
        <div className="nav-links">
          <a href="/shop">Shop</a>
          <a href="/cart">Cart</a>
        </div>
      </nav>

      <div className="shop-header">
        <h1>Checkout.</h1>
      </div>

      {items.length === 0 ? (
        <p className="empty-state">Your cart is empty.</p>
      ) : (
        <div className="checkout-wrap">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <label>Full name<input type="text" required /></label>
            <label>Email<input type="email" required /></label>
            <label>Address<input type="text" required /></label>
            <label>City<input type="text" required /></label>
            <label>Country<input type="text" required /></label>
            <label>Postal code<input type="text" required /></label>
            <button className="btn" type="submit" style={{ marginTop: "20px" }}>
              Place order — ${subtotal.toFixed(2)}
            </button>
          </form>

          <div className="checkout-summary">
            {items.map((item) => (
              <div className="cart-row" key={item.id}>
                <div className="cart-row-name">{item.name} × {item.quantity}</div>
                <div className="cart-row-price">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            <div className="cart-subtotal">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
