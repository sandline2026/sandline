import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import CartLink from "@/components/CartLink";
import WishlistButton from "@/components/WishlistButton";
import ReviewForm from "@/components/ReviewForm";
import PincodeCheck from "@/components/PincodeCheck";
import ProductBuyBox from "@/components/ProductBuyBox";
import AddToCartButton from "@/components/AddToCartButton";
import "../../sandline.css";

const collectionArt: Record<string, React.ReactElement> = {
  honeymoon: (
    <svg viewBox="0 0 200 260" fill="none">
      <path d="M100 20 L70 60 L60 240 L140 240 L130 60 Z" fill="#0E4B4A" opacity="0.9" />
      <path d="M100 20 L70 60 L100 80 L130 60 Z" fill="#FF7A54" />
      <line x1="60" y1="150" x2="140" y2="150" stroke="#F6EFE3" strokeWidth="1" opacity="0.4" />
    </svg>
  ),
  beach_party: (
    <svg viewBox="0 0 200 260" fill="none">
      <path d="M100 30 L65 65 L70 160 L130 160 L135 65 Z" fill="#FF7A54" opacity="0.92" />
      <path d="M100 30 L65 65 L100 90 L135 65 Z" fill="#0E4B4A" />
      <circle cx="100" cy="110" r="3" fill="#F6EFE3" />
      <circle cx="85" cy="130" r="3" fill="#F6EFE3" />
      <circle cx="115" cy="130" r="3" fill="#F6EFE3" />
    </svg>
  ),
  resort_evening: (
    <svg viewBox="0 0 200 260" fill="none">
      <path d="M100 24 L68 58 L64 230 L136 230 L132 58 Z" fill="#E8A73B" opacity="0.92" />
      <path d="M100 24 L68 58 L100 84 L132 58 Z" fill="#1B2420" />
      <path d="M64 150 Q100 175 136 150" stroke="#1B2420" strokeWidth="1.5" fill="none" opacity="0.4" />
    </svg>
  ),
};

const collectionLabel: Record<string, string> = {
  honeymoon: "The Wedding Night Edit",
  beach_party: "The Beach Party Edit",
  resort_evening: "The Resort Evening Edit",
};

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: product } = await supabase
    .from("products")
    .select()
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!product) notFound();

  const hasPhoto = product.images && product.images.length > 0;
  const inStock = product.stock_status === "in_stock";
  const collectionName = collectionLabel[product.collection] || "Sandline Collection";

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", product.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  const { data: similarProducts } = await supabase
    .from("products")
    .select()
    .eq("collection", product.collection)
    .neq("id", product.id)
    .eq("is_active", true)
    .limit(3);

  return (
    <div className="sandline-page">
      {/* Navbar */}
      <nav>
        <a className="logo" href="/">
          SAND<span>LINE</span>
        </a>
        <div className="nav-links">
          <a href="/shop">Shop</a>
          <a href="/size-guide">Size Guide</a>
          <a href="/wishlist">Wishlist</a>
          <a href="/#contact">Contact</a>
          <CartLink />
        </div>
      </nav>

      {/* Main Container */}
      <div className="product-detail-wrap">
        {/* Breadcrumb Navigation */}
        <div className="product-breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">Catalog</Link>
          <span>/</span>
          {product.collection && (
            <>
              <Link href={`/collections/${product.collection}`}>{collectionName}</Link>
              <span>/</span>
            </>
          )}
          <span style={{ color: "var(--ink)", fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Product Details Grid */}
        <div className="product-detail">
          {/* Left Gallery Sticky Box */}
          <div className="product-gallery">
            {hasPhoto ? (
              <img src={product.images[0]} alt={product.name} />
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
                {collectionArt[product.collection] || collectionArt.beach_party}
              </div>
            )}
          </div>

          {/* Right Product Info Column */}
          <div className="product-info">
            <div className="product-eyebrow">
              <span>✦</span>
              <span>{collectionName} • HAND-FINISHED IN INDIA</span>
            </div>

            <h1>{product.name}</h1>

            <div className="product-price-bar">
              <span className="product-price-amount">
                ${Number(product.selling_price_usd).toFixed(2)}
              </span>
              <span className="product-shipping-tag">
                {inStock ? "In Stock • Ships Worldwide" : "Sold Out"}
              </span>
            </div>

            {product.description && (
              <p className="product-desc">{product.description}</p>
            )}

            {/* Key Value Perks */}
            <div className="product-perks-row">
              <div className="product-perk-item">
                <span className="perk-title">Global Express</span>
                <span className="perk-desc">Tracked courier to 80+ countries</span>
              </div>
              <div className="product-perk-item">
                <span className="perk-title">Pure Fabrics</span>
                <span className="perk-desc">{product.fabric || "Breathable natural weave"}</span>
              </div>
              <div className="product-perk-item">
                <span className="perk-title">Easy Exchanges</span>
                <span className="perk-desc">Hassle-free size replacement</span>
              </div>
            </div>

            {/* Interactive Buy Box (Sizes, Quantity Stepper, Add to Bag & Wishlist) */}
            <ProductBuyBox
              id={product.id}
              name={product.name}
              price={product.selling_price_usd}
              sizes={product.sizes || []}
              colors={product.colors || []}
              inStock={inStock}
              image={hasPhoto ? product.images[0] : null}
            />

            {/* Delivery Pincode Checker */}
            <PincodeCheck />

            {/* Specifications Meta List */}
            <div className="product-meta-list">
              {product.fabric && (
                <div>
                  <span>Fabric Composition</span>
                  <strong>{product.fabric}</strong>
                </div>
              )}
              {product.collection && (
                <div>
                  <span>Collection Edit</span>
                  <strong>{collectionName}</strong>
                </div>
              )}
              <div>
                <span>Care Instructions</span>
                <span>Dry clean or gentle cold handwash</span>
              </div>
              <div>
                <span>Shipping Origin</span>
                <span>Handcrafted & dispatched from Jaipur, India</span>
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="reviews-section">
              <h2>Customer Reviews ({reviews?.length || 0})</h2>
              {reviews && reviews.length > 0 ? (
                reviews.map((r: any) => (
                  <div className="review-item" key={r.id}>
                    <div className="review-stars">
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </div>
                    <p className="review-text">{r.review_text}</p>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: "14px", color: "rgba(27,36,32,0.6)", marginBottom: "20px" }}>
                  No customer reviews yet. Be the first to share your thoughts.
                </p>
              )}

              <ReviewForm productId={product.id} />
            </div>
          </div>
        </div>
      </div>

      {/* You Might Also Like Section */}
      {similarProducts && similarProducts.length > 0 && (
        <section className="suggestions-section">
          <h2>You Might Also Like</h2>
          <div className="collection-product-grid">
            {similarProducts.map((p: any) => {
              const pHasPhoto = p.images && p.images.length > 0;
              const pOutOfStock = p.stock_status === "out_of_stock";

              return (
                <div className="product-grid-card" key={p.id}>
                  <div className="product-card-image-box">
                    <span className="floating-price-tag">
                      ${Number(p.selling_price_usd).toFixed(2)}
                    </span>

                    <WishlistButton
                      id={p.id}
                      name={p.name}
                      price={p.selling_price_usd}
                      image={pHasPhoto ? p.images[0] : null}
                      variant="icon"
                    />

                    {pOutOfStock && (
                      <span className="floating-sold-out-tag">Sold Out</span>
                    )}

                    <Link href={`/product/${p.slug}`}>
                      {pHasPhoto ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
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
                          {collectionArt[p.collection] || collectionArt.beach_party}
                        </div>
                      )}
                    </Link>
                  </div>

                  <div className="product-card-body">
                    <div>
                      <div className="product-card-eyebrow">
                        {p.fabric || collectionLabel[p.collection] || "Sandline"}
                      </div>
                      <Link
                        href={`/product/${p.slug}`}
                        className="product-card-title"
                      >
                        {p.name}
                      </Link>
                    </div>

                    <div className="product-card-actions">
                      <AddToCartButton
                        id={p.id}
                        name={p.name}
                        price={p.selling_price_usd}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
