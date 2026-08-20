import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import CartLink from "@/components/CartLink";
import WishlistButton from "@/components/WishlistButton";
import ReviewForm from "@/components/ReviewForm";
import NotifyMeForm from "@/components/NotifyMeForm";
import PincodeCheck from "@/components/PincodeCheck";
import "../../sandline.css";

const collectionArt: Record<string, React.ReactElement> = {
  honeymoon: (
    <svg viewBox="0 0 200 260" fill="none">
      <path d="M100 20 L70 60 L60 240 L140 240 L130 60 Z" fill="#0E4B4A" opacity="0.9" />
      <path d="M100 20 L70 60 L100 80 L130 60 Z" fill="#FF7A54" />
    </svg>
  ),
  beach_party: (
    <svg viewBox="0 0 200 260" fill="none">
      <path d="M100 30 L65 65 L70 160 L130 160 L135 65 Z" fill="#FF7A54" opacity="0.92" />
      <path d="M100 30 L65 65 L100 90 L135 65 Z" fill="#0E4B4A" />
    </svg>
  ),
  resort_evening: (
    <svg viewBox="0 0 200 260" fill="none">
      <path d="M100 24 L68 58 L64 230 L136 230 L132 58 Z" fill="#E8A73B" opacity="0.92" />
      <path d="M100 24 L68 58 L100 84 L132 58 Z" fill="#1B2420" />
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
      <nav>
        <a className="logo" href="/">SAND<span>LINE</span></a>
        <div className="nav-links">
          <a href="/shop">Shop</a>
          <a href="/size-guide">Size Guide</a>
          <a href="/wishlist">Wishlist</a>
          <a href="/#contact">Contact</a>
          <CartLink />
        </div>
      </nav>

      <div className="product-detail">
        <div className="product-gallery">
          {hasPhoto ? (
            <img src={product.images[0]} alt={product.name} />
          ) : (
            collectionArt[product.collection] || collectionArt.beach_party
          )}
        </div>

        <div className="product-info">
          <span className="eyebrow">{collectionLabel[product.collection] || "Sandline"}</span>
          <h1>{product.name}</h1>
          <div className="product-price">${product.selling_price_usd}</div>

          {!inStock && <div className="out-of-stock-badge">Currently out of stock</div>}

          {product.description && <p className="product-desc">{product.description}</p>}

          {product.sizes && product.sizes.length > 0 && (
            <div className="option-group">
              <span className="option-label">Size</span>
              <div className="swatch-row">
                {product.sizes.map((s: string) => (
                  <span className="swatch" key={s}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="option-group">
              <span className="option-label">Color</span>
              <div className="swatch-row">
                {product.colors.map((c: string) => (
                  <span className="swatch" key={c}>{c}</span>
                ))}
              </div>
            </div>
          )}

          {inStock ? (
            <AddToCartButton id={product.id} name={product.name} price={product.selling_price_usd} />
          ) : (
            <NotifyMeForm productId={product.id} />
          )}

          <WishlistButton
            id={product.id}
            name={product.name}
            price={product.selling_price_usd}
            image={hasPhoto ? product.images[0] : null}
          />

          <PincodeCheck />

          <div className="product-meta-list">
            {product.fabric && <div><span>Fabric</span><span>{product.fabric}</span></div>}
            <div><span>Shipping</span><span>Worldwide, tracked courier</span></div>
            <div><span>Returns</span><span>Easy size exchange</span></div>
          </div>

          <div className="reviews-section">
            <h2>Reviews</h2>
            {reviews && reviews.length > 0 ? (
              reviews.map((r: any) => (
                <div className="review-item" key={r.id}>
                  <div className="review-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                  <p className="review-text">{r.review_text}</p>
                </div>
              ))
            ) : (
              <p style={{ fontSize: "14px", color: "rgba(27,36,32,0.55)" }}>No reviews yet — be the first.</p>
            )}
            <ReviewForm productId={product.id} />
          </div>
        </div>
      </div>

      {similarProducts && similarProducts.length > 0 && (
        <section className="suggestions-section">
          <h2>You might also like</h2>
          <div className="collection-product-grid">
            {similarProducts.map((p: any) => {
              const pHasPhoto = p.images && p.images.length > 0;
              return (
                <div className="collection-card" key={p.id}>
                  <span className="price-tag">${p.selling_price_usd}</span>
                  <a href={`/product/${p.slug}`} className="collection-card-link">
                    <div className="art">
                      {pHasPhoto ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
                        />
                      ) : (
                        collectionArt[p.collection] || collectionArt.beach_party
                      )}
                    </div>
                    <div className="label"><h3>{p.name}</h3></div>
                  </a>
                  <div style={{ padding: "0 24px 24px" }}>
                    <AddToCartButton id={p.id} name={p.name} price={p.selling_price_usd} />
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
