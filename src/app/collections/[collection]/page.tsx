import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import AddToCartButton from "@/components/AddToCartButton";
import CartLink from "@/components/CartLink";
import SortSelect from "@/components/SortSelect";
import "../../sandline.css";

const collectionTitles: Record<string, string> = {
  honeymoon: "The Wedding Night Edit",
  beach_party: "The Beach Party Edit",
  resort_evening: "The Resort Evening Edit",
};

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
    products = products.filter((p: any) => p.sizes?.some((s: string) => activeSizes.includes(s)));
  }
  if (activeColors.length > 0) {
    products = products.filter((p: any) => p.colors?.some((c: string) => activeColors.includes(c)));
  }
  if (activeFabrics.length > 0) {
    products = products.filter((p: any) => activeFabrics.includes(p.fabric));
  }

  if (sp.sort === "price_asc") {
    products = [...products].sort((a: any, b: any) => a.selling_price_usd - b.selling_price_usd);
  } else if (sp.sort === "price_desc") {
    products = [...products].sort((a: any, b: any) => b.selling_price_usd - a.selling_price_usd);
  }

  const allSizes = Array.from(new Set((allProducts || []).flatMap((p: any) => p.sizes || [])));
  const allColors = Array.from(new Set((allProducts || []).flatMap((p: any) => p.colors || [])));
  const allFabrics = Array.from(new Set((allProducts || []).map((p: any) => p.fabric).filter(Boolean)));

  function buildFilterLink(type: "sizes" | "colors" | "fabric", value: string) {
    const params = new URLSearchParams();
    if (sp.sort) params.set("sort", sp.sort);

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
      if (values.length > 0) params.set(key, values.join(","));
    });

    return `/collections/${collection}?${params.toString()}`;
  }

  const hasActiveFilters = activeSizes.length > 0 || activeColors.length > 0 || activeFabrics.length > 0;

  return (
    <div className="sandline-page">
      <nav>
        <a className="logo" href="/">SAND<span>LINE</span></a>
        <div className="nav-links">
          <a href="/shop">Shop</a>
          <a href="/size-guide">Size Guide</a>
          <a href="/#contact">Contact</a>
          <CartLink />
        </div>
      </nav>

      <div className="collection-layout">
        <aside className="filter-sidebar">
          {hasActiveFilters && (
            <a href={`/collections/${collection}`} className="clear-filters">Clear all filters</a>
          )}

          {allSizes.length > 0 && (
            <div className="filter-group">
              <h4>Size</h4>
              {allSizes.map((s: string) => (
                <a key={s} href={buildFilterLink("sizes", s)} className={`filter-option ${activeSizes.includes(s) ? "active" : ""}`}>
                  {s}
                </a>
              ))}
            </div>
          )}

          {allColors.length > 0 && (
            <div className="filter-group">
              <h4>Color</h4>
              {allColors.map((c: string) => (
                <a key={c} href={buildFilterLink("colors", c)} className={`filter-option ${activeColors.includes(c) ? "active" : ""}`}>
                  {c}
                </a>
              ))}
            </div>
          )}

          {allFabrics.length > 0 && (
            <div className="filter-group">
              <h4>Fabric</h4>
              {allFabrics.map((f: string) => (
                <a key={f} href={buildFilterLink("fabric", f)} className={`filter-option ${activeFabrics.includes(f) ? "active" : ""}`}>
                  {f}
                </a>
              ))}
            </div>
          )}
        </aside>

        <div>
          <div className="collection-topbar">
            <h1>{collectionTitles[collection] || "Collection"}</h1>
            <SortSelect collection={collection} />
          </div>

          {products.length > 0 ? (
            <div className="collection-product-grid">
              {products.map((product: any) => {
                const hasPhoto = product.images && product.images.length > 0;
                return (
                  <div className="collection-card" key={product.id}>
                    <span className="price-tag">${product.selling_price_usd}</span>
                    <a href={`/product/${product.slug}`} className="collection-card-link">
                      <div className="art">
                        {hasPhoto ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
                          />
                        ) : (
                          <svg viewBox="0 0 200 260" fill="none">
                            <path d="M100 30 L65 65 L70 160 L130 160 L135 65 Z" fill="#FF7A54" opacity="0.92" />
                          </svg>
                        )}
                      </div>
                      <div className="label">
                        <h3>{product.name}</h3>
                      </div>
                    </a>
                    <div style={{ padding: "0 24px 24px" }}>
                      <AddToCartButton id={product.id} name={product.name} price={product.selling_price_usd} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="empty-state" style={{ padding: 0 }}>No products match these filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}
