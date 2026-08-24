"use client";

import { useCart } from "@/context/CartContext";

export default function CartLink() {
  const { itemCount, openCart } = useCart();

  return (
    <button
      type="button"
      className="nav-cart-btn"
      onClick={openCart}
      aria-label="Open Shopping Bag"
    >
      <span className="cart-nav-label">BAG</span>
      {itemCount > 0 && <span className="cart-nav-badge">{itemCount}</span>}
    </button>
  );
}
