"use client";

import Link from "next/link";

interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  href: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "dresses",
    name: "Dresses",
    subtitle: "Flowy Slips & Maxi Gowns",
    image: "/images/products/santorini-3d-floral-silk-slip-dress.jpg",
    href: "/shop?category=dresses",
  },
  {
    id: "sets",
    name: "Coord Sets",
    subtitle: "Linen & Silk Co-ords",
    image: "/images/products/maldives-drawstring-resort-co-ord-set.jpg",
    href: "/shop?category=sets",
  },
  {
    id: "jeans",
    name: "Jeans & Denim",
    subtitle: "Artisan Hand-Beaded & Pintuck",
    image: "/images/products/venice-hand-beaded-straight-leg-denim.jpg",
    href: "/shop?category=jeans",
  },
  {
    id: "tops",
    name: "Tops",
    subtitle: "Silk Camis & Halters",
    image: "/images/products/espresso-satin-backless-halter-top-1.jpg",
    href: "/shop?category=tops",
  },
  {
    id: "bottoms",
    name: "Bottoms",
    subtitle: "Culottes & Resort Skirts",
    image: "/images/products/portofino-vintage-button-denim-culotte-shorts.jpg",
    href: "/shop?category=bottoms",
  },
  {
    id: "accessories",
    name: "Beach Accessories",
    subtitle: "Woven Hats & Straw Fedoras",
    image: "/images/products/st-tropez-pearl-straw-hat-1.jpg",
    href: "/shop?category=accessories",
  },
];

export default function ShopByCategory() {
  return (
    <section className="shop-category-section">
      <div className="shop-category-header">
        <span className="category-eyebrow">CURATED SILHOUETTES</span>
        <h2 className="category-main-title">SHOP BY CATEGORY</h2>
        <p className="category-subtitle">
          Designed for sun-drenched escapes — explore our full range from sculpted slips to handcrafted denims.
        </p>
      </div>

      {/* 2-Column Mobile & Responsive Desktop Category Grid */}
      <div className="shop-category-grid">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="category-card-item"
          >
            <div className="category-card-img-wrap">
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="category-card-img"
              />
              <div className="category-card-overlay"></div>
              <div className="category-card-content">
                <h3 className="category-card-name">{cat.name}</h3>
                <span className="category-card-pill">Explore →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
