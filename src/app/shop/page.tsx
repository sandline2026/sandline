import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";
import SortSelect from "@/components/SortSelect";
import ProductPrice from "@/components/ProductPrice";
import SiteNavbar from "@/components/SiteNavbar";
import MobileFilterDrawer from "@/components/MobileFilterDrawer";
import "../sandline.css";

const collectionLabel: Record<string, string> = {
  honeymoon: "The Wedding Night Edit",
  beach_party: "The Beach Party Edit",
  resort_evening: "The Resort Evening Edit",
};

const collectionTabs = [
  { slug: "all", label: "All Silhouettes", href: "/shop" },
  { slug: "beach_party", label: "The Beach Party Edit", href: "/collections/beach_party" },
  { slug: "honeymoon", label: "The Wedding Night Edit", href: "/collections/honeymoon" },
  { slug: "resort_evening", label: "The Resort Evening Edit", href: "/collections/resort_evening" },
];

export default async function Shop({
  searchParams,
}: {
  searchParams?: Promise<{
    sort?: string;
    sizes?: string;
    fabric?: string;
    colors?: string;
    category?: string;
  }>;
}) {
  const sp = (await searchParams) || {};
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: rawProducts, error } = await supabase
    .from("products")
    .select()
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  let allProducts = rawProducts || [];
  let products = [...allProducts];

  const activeSizes = sp.sizes ? sp.sizes.split(",").filter(Boolean) : [];
  const activeFabrics = sp.fabric ? sp.fabric.split(",").filter(Boolean) : [];
  const activeColors = sp.colors ? sp.colors.split(",").filter(Boolean) : [];

  const activeCategory = sp.category ? sp.category.toLowerCase().trim() : null;

  if (activeCategory) {
    if (activeCategory === "dresses") {
      products = products.filter((p: any) =>
        /dress|gown|slip|maxi|midi/i.test(p.name)
      );
    } else if (activeCategory === "sets" || activeCategory === "matching_sets") {
      products = products.filter((p: any) =>
        /set|co-ord|palazzo/i.test(p.name)
      );
    } else if (activeCategory === "jeans" || activeCategory === "denim") {
      products = products.filter((p: any) =>
        /jeans|denim|pintuck|flare/i.test(p.name)
      );
    } else if (activeCategory === "tops") {
      products = products.filter((p: any) =>
        /top|blouse|shirt|cami|halter|pullover|bralette/i.test(p.name)
      );
    } else if (activeCategory === "bottoms") {
      products = products.filter((p: any) =>
        /shorts|skirt|culotte|bermuda/i.test(p.name)
      );
    } else if (activeCategory === "accessories") {
      products = products.filter((p: any) =>
        /hat|straw|fedora|accessory/i.test(p.name)
      );
    }
  }

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
    products = [...products].sort((a: any, b: any) => a.selling_price_usd - b.selling_price_usd);
  } else if (sp.sort === "price_desc") {
    products = [...products].sort((a: any, b: any) => b.selling_price_usd - a.selling_price_usd);
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

  return (
    <div className="sandline-page">
      {/* Navigation */}
      <SiteNavbar currentPath="/shop" />

      {/* Editorial Hero Header */}
      <section className="collection-hero-wrap">
        <div className="collection-eyebrow">
          <span>✦</span>
          <span>ALL SILHOUETTES • SHIPPED WORLDWIDE</span>
        </div>
        <h1 className="collection-title">The Complete Wardrobe.</h1>
        <p className="collection-desc">
          Honeymoon, beach party, resort evening — explore handcrafted silks, breezy linen slips, and sculpted wraps designed for coastal luxury.
        </p>

        {/* Collection Filter Tabs */}
        <div className="collection-switcher">
          {collectionTabs.map((tab) => (
            <Link
              key={tab.slug}
              href={tab.href}
              className={`collection-switch-tab ${tab.slug === "all" ? "active" : ""}`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Main Catalog Container */}
      <div className="catalog-main-container">
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
            />
            <SortSelect />
          </div>
        </div>

        {error && <p style={{ color: "var(--red)", marginBottom: "20px" }}>Error: {error.message}</p>}

        {products && products.length > 0 ? (
          <div className="collection-product-grid">
            {products.map((product) => {
              const hasPhoto = product.images && product.images.length > 0;
              const isOutOfStock = product.stock_status === "out_of_stock";

              return (
                <div className="product-grid-card" key={product.id}>
                  {/* Image Box */}
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

                  {/* Card Details */}
                  <div className="product-card-body">
                    <div>
                      <div className="product-card-eyebrow">
                        {collectionLabel[product.collection] || product.fabric || "Sandline Garment"}
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
                            background: "#FAF8F5",
                            color: "#888888",
                            border: "1px solid #EAE6DF",
                            display: "block",
                          }}
                        >
                          Sold Out
                        </Link>
                      ) : (
                        <AddToCartButton
                          id={product.id}
                          name={product.name}
                          price={product.selling_price_usd}
                          image={product.images?.[0] || null}
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
              No garments listed yet
            </h3>
            <p style={{ color: "rgba(27,36,32,0.6)", fontSize: "14px" }}>
              New resort silhouettes are being added to the catalog.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
