"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistLink() {
  const { items } = useWishlist();

  return (
    <Link href="/wishlist">
      Wishlist{items.length > 0 ? ` (${items.length})` : ""}
    </Link>
  );
}
