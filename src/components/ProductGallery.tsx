"use client";

import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  name: string;
  fallbackArt?: React.ReactNode;
}

export default function ProductGallery({
  images,
  name,
  fallbackArt,
}: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="product-gallery-empty">
        {fallbackArt}
      </div>
    );
  }

  return (
    <div className="product-gallery-container">
      {/* Thumbnail Strip (if multiple images) */}
      {images.length > 1 && (
        <div className="product-gallery-thumbs">
          {images.map((img, idx) => (
            <button
              key={img + idx}
              type="button"
              className={`gallery-thumb-btn ${activeIdx === idx ? "active" : ""}`}
              onClick={() => setActiveIdx(idx)}
              aria-label={`View image ${idx + 1}`}
            >
              <img src={img} alt={`${name} thumbnail ${idx + 1}`} />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Stage */}
      <div className="product-gallery-main">
        <span className="gallery-sale-pill">RESORT EDIT</span>
        <img
          src={images[activeIdx] || images[0]}
          alt={name}
          className="gallery-main-img"
        />
      </div>
    </div>
  );
}
