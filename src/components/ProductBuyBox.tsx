"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import NotifyMeForm from "@/components/NotifyMeForm";

interface ProductBuyBoxProps {
  id: string;
  name: string;
  price: number;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  image: string | null;
}

export default function ProductBuyBox({
  id,
  name,
  price,
  sizes = [],
  colors = [],
  inStock,
  image,
}: ProductBuyBoxProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || "");
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const wishlisted = isWishlisted(id);

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addToCart({ id, name, price });
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  }

  return (
    <div className="product-buybox">
      {/* Size Selector */}
      {sizes.length > 0 && (
        <div className="buybox-option-group">
          <div className="buybox-option-header">
            <span className="buybox-option-label">
              Select Size: <strong>{selectedSize || "None"}</strong>
            </span>
            <Link href="/size-guide" className="buybox-size-guide-link">
              Size Guide ↗
            </Link>
          </div>
          <div className="buybox-swatch-row">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                className={`buybox-size-btn ${selectedSize === s ? "active" : ""}`}
                onClick={() => setSelectedSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {colors.length > 0 && (
        <div className="buybox-option-group">
          <div className="buybox-option-header">
            <span className="buybox-option-label">
              Color: <strong>{selectedColor || "None"}</strong>
            </span>
          </div>
          <div className="buybox-swatch-row">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                className={`buybox-color-btn ${selectedColor === c ? "active" : ""}`}
                onClick={() => setSelectedColor(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {inStock ? (
        <div className="buybox-actions-stack">
          <div className="buybox-qty-cart-row">
            {/* Quantity Selector */}
            <div className="buybox-qty-control">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Add to Bag Button */}
            <button
              type="button"
              className="buybox-add-to-bag-btn"
              onClick={handleAddToCart}
            >
              {isAdded ? "✓ Added to Bag" : "Add to Bag — $" + (price * quantity).toFixed(2)}
            </button>
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            className={`buybox-wishlist-toggle ${wishlisted ? "active" : ""}`}
            onClick={() => toggleWishlist({ id, name, price, image })}
          >
            <span>{wishlisted ? "♥ Saved to Wishlist" : "♡ Add to Wishlist"}</span>
          </button>
        </div>
      ) : (
        <div className="buybox-out-of-stock-box">
          <div className="out-of-stock-title">Currently Sold Out</div>
          <p className="out-of-stock-subtitle">
            Enter your email to receive an instant notification when this piece is restocked.
          </p>
          <NotifyMeForm productId={id} />
          <button
            type="button"
            className={`buybox-wishlist-toggle ${wishlisted ? "active" : ""}`}
            style={{ marginTop: "12px" }}
            onClick={() => toggleWishlist({ id, name, price, image })}
          >
            <span>{wishlisted ? "♥ Saved to Wishlist" : "♡ Save to Wishlist for Later"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
