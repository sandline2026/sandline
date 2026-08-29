"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";

interface WishlistLinkProps {
  variant?: "icon" | "text";
}

export default function WishlistLink({ variant }: WishlistLinkProps) {
  const { items } = useWishlist();

  if (variant === "icon") {
    return (
      <Link
        href="/wishlist"
        aria-label="View Wishlist"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          color: "inherit",
          textDecoration: "none",
          padding: "6px",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={items.length > 0 ? "#E05A47" : "none"} stroke={items.length > 0 ? "#E05A47" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
        {items.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: "1px",
              right: "0px",
              background: "#E05A47",
              color: "white",
              fontSize: "9px",
              fontWeight: 700,
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            {items.length}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link href="/wishlist">
      Wishlist{items.length > 0 ? ` (${items.length})` : ""}
    </Link>
  );
}
