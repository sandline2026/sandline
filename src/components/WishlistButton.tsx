"use client";

import { useWishlist } from "@/context/WishlistContext";

export default function WishlistButton({
  id,
  name,
  price,
  image,
  slug,
  variant = "button",
}: {
  id: string;
  name: string;
  price: number;
  image: string | null;
  slug?: string;
  variant?: "button" | "icon";
}) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const active = isWishlisted(id);

  if (variant === "icon") {
    return (
      <button
        className={`wishlist-icon-btn ${active ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist({ id, name, price, image, slug });
        }}
        type="button"
        aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
        title={active ? "Saved to Wishlist" : "Add to Wishlist"}
      >
        <span style={{ color: active ? "var(--papaya)" : "inherit" }}>
          {active ? "♥" : "♡"}
        </span>
      </button>
    );
  }

  return (
    <button
      className={`wishlist-btn ${active ? "active" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist({ id, name, price, image, slug });
      }}
      type="button"
    >
      {active ? "♥ Saved to Wishlist" : "♡ Add to Wishlist"}
    </button>
  );
}
