"use client";

import { useCart } from "@/context/CartContext";

export default function AddToCartButton({
  id,
  name,
  price,
  isOutOfStock = false,
}: {
  id: string;
  name: string;
  price: number;
  isOutOfStock?: boolean;
}) {
  const { addToCart } = useCart();

  if (isOutOfStock) {
    return (
      <button
        className="add-to-cart-btn sold-out-btn"
        disabled
        onClick={(e) => e.preventDefault()}
        style={{
          background: "#EAE6DF",
          color: "#888888",
          borderColor: "#EAE6DF",
          cursor: "not-allowed",
        }}
      >
        Sold Out
      </button>
    );
  }

  return (
    <button
      className="add-to-cart-btn"
      onClick={(e) => {
        e.preventDefault();
        addToCart({ id, name, price });
      }}
    >
      Add to cart
    </button>
  );
}
