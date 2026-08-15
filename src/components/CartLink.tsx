"use client";

import { useCart } from "@/context/CartContext";

export default function CartLink() {
  const { itemCount } = useCart();

  return (
    <a href="/cart">
      Cart{itemCount > 0 ? ` (${itemCount})` : ""}
    </a>
  );
}
