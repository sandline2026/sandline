import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";
import SortSelect from "@/components/SortSelect";
import ProductPrice from "@/components/ProductPrice";
import SiteNavbar from "@/components/SiteNavbar";
import MobileFilterDrawer from "@/components/MobileFilterDrawer";
import "../../sandline.css";

const collectionsMeta: Record<
  string,
  { title: string; subtitle: string; tag: string }
> = {
  beach_party: {
    title: "The Beach Party Edit",
    subtitle:
      "Vibrant, sun-drenched silhouettes crafted in lightweight silks and breezy weaves for oceanside soirées and sundown celebrations.",
    tag: "SUNDOWN & BEACH PARTIES",
  },
  honeymoon: {
    title: "The Wedding Night Edit",
    subtitle:
      "Intimate drape dresses, ethereal slip silhouettes, and delicate cuts curated for honeymoons and romantic coastal retreats.",
    tag: "HONEYMOON & INTIMATE",
  },
  resort_evening: {
    title: "The Resort Evening Edit",
    subtitle:
      "Sculpted wrap silhouettes and elevated maxi gowns designed for cocktail dinners and poolside elegance.",
    tag: "RESORT & COCKTAILS",
  },
};

const collectionTabs = [
  { slug: "beach_party", label: "The Beach Party Edit" },
  { slug: "honeymoon", label: "The Wedding Night Edit" },
  { slug: "resort_evening", label: "The Resort Evening Edit" },
];

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ sizes?: string; colors?: string; fabric?: string; sort?: string }>;
}) {
  const { collection } = await params;
  const sp = await searchParams;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: allProducts } = await supabase
    .from("products")
    .select()
    .eq("collection", collection)
    .eq("is_active", true);

  let products = allProducts || [];

  const activeSizes = sp.sizes ? sp.sizes.split(",") : [];
  const activeColors = sp.colors ? sp.colors.split(",") : [];
  const activeFabrics = sp.fabric ? sp.fabric.split(",") : [];

  if (activeSizes.length > 0) {
    products = products.filter((p: any) =>
      p.sizes?.some((s: string) => activeSizes.includes(s))
    );
  }
  if (activeColors.length > 0) {
    products = products.filter((p: any) =>
      p.colors?.some((c: string) => activeColors.includes(c))
    );
  }
  if (activeFabrics.length > 0) {
    products = products.filter((p: any) => activeFabrics.includes(p.fabric));
  }

  if (sp.sort === "price_asc") {
    products = [...products].sort(
      (a: any, b: any) => a.selling_price_usd - b.selling_price_usd
    );
  } else if (sp.sort === "price_desc") {
    products = [...products].sort(
      (a: any, b: any) => b.selling_price_usd - a.selling_price_usd
    );
  }

  const allSizes = Array.from(
    new Set((allProducts || []).flatMap((p: any) => p.sizes || []))
  );
  const allColors = Array.from(
    new Set((allProducts || []).flatMap((p: any) => p.colors || []))
  );
  const allFabrics = Array.from(
    new Set((allProducts || []).map((p: any) => p.fabric).filter(Boolean))
  );

  function buildFilterLink(type: "sizes" | "colors" | "fabric", value: string) {
    const query = new URLSearchParams();
    if (sp.sort) query.set("sort", sp.sort);

    const current = {
      sizes: activeSizes,
      colors: activeColors,
      fabric: activeFabrics,
    };
    const list = current[type];
    const isActive = list.includes(value);
    const newList = isActive ? list.filter((v) => v !== value) : [...list, value];

    (["sizes", "colors", "fabric"] as const).forEach((key) => {
      const values = key === type ? newList : current[key];
      if (values.length > 0) query.set(key, values.join(","));
    });

    return `/collections/${collection}?${query.toString()}`;
  }

  const hasActiveFilters =
    activeSizes.length > 0 || activeColors.length > 0 || activeFabrics.length > 0;
  const currentMeta = collectionsMeta[collection] || {
    title: "Sandline Collection",
    subtitle: "Resort and beach silhouettes crafted for effortless coastal luxury.",
    tag: "CURATED EDIT",
  };

  return (
    <div className="sandline-page">
      {/* Navigation */}
      <SiteNavbar currentPath={`/collections/${collection}`} />

      {/* Collection Hero Header */}
      <section className="collection-hero-wrap">
        <div className="collection-eyebrow">
          <span>✦</span>
          <span>{currentMeta.tag}</span>
        </div>
        <h1 className="collection-title">{currentMeta.title}</h1>
        <p className="collection-desc">{currentMeta.subtitle}</p>

        {/* Collection Switcher Tabs */}
        <div className="collection-switcher">
          {collectionTabs.map((tab) => (
            <Link
              key={tab.slug}
              href={`/collections/${tab.slug}`}
              className={`collection-switch-tab ${collection === tab.slug ? "active" : ""}`}
            >
              {tab.label}
            </Link>
          ))}
          <Link href="/shop" className="collection-switch-tab">
            View All Pieces →
          </Link>
        </div>
      </section>

      {/* Collection Layout: Filter Sidebar + Products Grid */}
      <div className="collection-layout">
        {/* Sidebar Filters */}
        <aside className="filter-sidebar-card">
          <div className="filter-card-header">
            <h3>Filters</h3>
            {hasActiveFilters && (
              <Link href={`/collections/${collection}`} className="clear-filters-btn">
                Reset All ✕
              </Link>
            )}
          </div>

          {/* Size Filter */}
          {allSizes.length > 0 && (
            <div className="filter-group">
              <h4>Size</h4>
              <div className="size-chip-grid">
                {allSizes.map((s: string) => (
                  <Link
                    key={s}
                    href={buildFilterLink("sizes", s)}
                    className={`size-chip ${activeSizes.includes(s) ? "active" : ""}`}
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Fabric Filter */}
          {allFabrics.length > 0 && (
            <div className="filter-group">
              <h4>Fabric</h4>
              <div className="filter-tag-list">
                {allFabrics.map((f: string) => (
                  <Link
                    key={f}
                    href={buildFilterLink("fabric", f)}
                    className={`filter-tag-row ${activeFabrics.includes(f) ? "active" : ""}`}
                  >
                    <span>{f}</span>
                    {activeFabrics.includes(f) && <span>✓</span>}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Color Filter */}
          {allColors.length > 0 && (
            <div className="filter-group">
              <h4>Color</h4>
              <div className="filter-tag-list">
                {allColors.map((c: string) => (
                  <Link
                    key={c}
                    href={buildFilterLink("colors", c)}
                    className={`filter-tag-row ${activeColors.includes(c) ? "active" : ""}`}
                  >
                    <span>{c}</span>
                    {activeColors.includes(c) && <span>✓</span>}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content: Topbar & Product Grid */}
        <div>
          <div className="collection-topbar">
            <div className="collection-count">
              Showing <strong>{products.length}</strong> {products.length === 1 ? "silhouette" : "silhouettes"}
            </div>
            <div className="collection-actions-bar">
              <MobileFilterDrawer
                allSizes={allSizes}
                allFabrics={allFabrics}
                allColors={allColors}
                activeSizes={activeSizes}
                activeFabrics={activeFabrics}
                activeColors={activeColors}
                collectionSlug={collection}
              />
              <SortSelect collection={collection} />
            </div>
          </div>

          {products.length > 0 ? (
            <div className="collection-product-grid">
              {products.map((product: any) => {
                const hasPhoto = product.images && product.images.length > 0;
                const isOutOfStock = product.stock_status === "out_of_stock";

                return (
                  <div className="product-grid-card" key={product.id}>
                    {/* Visual box with price, wishlist heart, and image */}
                    <div className="product-card-image-box">
                      <ProductPrice
                        priceUsd={Number(product.selling_price_usd)}
                        className="floating-price-tag"
                      />

                      <WishlistButton
                        id={product.id}
                        name={product.name}
                        price={product.selling_price_usd}
                        image={hasPhoto ? product.images[0] : null}
                        variant="icon"
                      />

                      {isOutOfStock && (
                        <span className="floating-sold-out-tag">Sold Out</span>
                      )}

                      <Link href={`/product/${product.slug}`}>
                        {hasPhoto ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="product-card-img"
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "var(--foam)",
                            }}
                          >
                            <svg viewBox="0 0 200 260" fill="none" style={{ width: "60%", height: "60%" }}>
                              <path d="M100 30 L65 65 L70 160 L130 160 L135 65 Z" fill="#FF7A54" opacity="0.92" />
                            </svg>
                          </div>
                        )}
                      </Link>
                    </div>

                    {/* Product Card Details */}
                    <div className="product-card-body">
                      <div>
                        <div className="product-card-eyebrow">
                          {product.fabric || currentMeta.tag}
                        </div>
                        <Link
                          href={`/product/${product.slug}`}
                          className="product-card-title"
                        >
                          {product.name}
                        </Link>
                        {product.sizes && product.sizes.length > 0 && (
                          <div className="product-card-sizes">
                            Sizes: {product.sizes.join(", ")}
                          </div>
                        )}
                      </div>

                      <div className="product-card-actions">
                        {isOutOfStock ? (
                          <Link
                            href={`/product/${product.slug}`}
                            className="add-to-cart-btn"
                            style={{
                              textAlign: "center",
                              textDecoration: "none",
                              background: "var(--foam)",
                              color: "var(--ink)",
                              border: "1px solid var(--line)",
                              display: "block",
                            }}
                          >
                            Notify Me When Back
                          </Link>
                        ) : (
                          <AddToCartButton
                            id={product.id}
                            name={product.name}
                            price={product.selling_price_usd}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                background: "var(--foam)",
                borderRadius: "18px",
                border: "1px solid var(--line)",
              }}
            >
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", marginBottom: "8px" }}>
                No pieces match these filters
              </h3>
              <p style={{ color: "rgba(27,36,32,0.6)", fontSize: "14px", marginBottom: "20px" }}>
                Try selecting different sizes or fabrics to discover more silhouettes.
              </p>
              <Link
                href={`/collections/${collection}`}
                className="btn"
                style={{ display: "inline-block" }}
              >
                Clear All Filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
