"use client";

import { useCart } from "@/context/CartContext";

export default function AddToCartButton({
  id,
  name,
  price,
}: {
  id: string;
  name: string;
  price: number;
}) {
  const { addToCart } = useCart();

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
