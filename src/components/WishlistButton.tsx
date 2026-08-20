"use client";

import { useWishlist } from "@/context/WishlistContext";

export default function WishlistButton({
  id,
  name,
  price,
  image,
}: {
  id: string;
  name: string;
  price: number;
  image: string | null;
}) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const active = isWishlisted(id);

  return (
    <button
      className="wishlist-btn"
      onClick={() => toggleWishlist({ id, name, price, image })}
      type="button"
    >
      {active ? "♥ Saved to Wishlist" : "♡ Add to Wishlist"}
    </button>
  );
}
