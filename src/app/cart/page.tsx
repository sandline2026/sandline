"use client";

import { useCart } from "@/context/CartContext";
import "../sandline.css";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();

  return (
    <div className="sandline-page">
      <nav>
        <a className="logo" href="/">SAND<span>LINE</span></a>
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
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <a className="btn" href="/checkout" style={{ display: "block", textAlign: "center", marginTop: "20px" }}>
                Proceed to checkout
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
