"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import ShareModal from "@/components/ShareModal";

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
  const [isShareOpen, setIsShareOpen] = useState(false);

  const validImages = Array.isArray(images) ? images.filter(Boolean) : [];

  if (validImages.length === 0) {
    return (
      <div className="product-gallery-sticky-stage">
        <div className="product-gallery-fallback">
          {fallbackArt}
        </div>
      </div>
    );
  }

  return (
    <div className="product-gallery-sticky-stage">
      <div className="product-gallery-wrapper">
        {/* Thumbnail Strip (if multiple images) */}
        {validImages.length > 1 && (
          <div className="product-gallery-thumbs">
            {validImages.map((img, idx) => (
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
          <button
            type="button"
            className="gallery-share-floating-btn"
            onClick={() => setIsShareOpen(true)}
            title="Share this design"
            aria-label="Share this design"
          >
            <Share2 size={16} />
          </button>
          <img
            src={validImages[activeIdx] || validImages[0]}
            alt={name}
            className="gallery-main-img"
          />
        </div>
      </div>

      {/* Luxury Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        product={{
          name,
          image: validImages[0] || null,
        }}
      />
    </div>
  );
}
