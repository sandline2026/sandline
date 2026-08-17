import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import CartLink from "@/components/CartLink";
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

          <AddToCartButton
            id={product.id}
            name={product.name}
            price={product.selling_price_usd}
          />

          <div className="product-meta-list">
            {product.fabric && (
              <div><span>Fabric</span><span>{product.fabric}</span></div>
            )}
            <div><span>Shipping</span><span>Worldwide, tracked courier</span></div>
            <div><span>Returns</span><span>Easy size exchange</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
