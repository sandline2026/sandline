import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import AddToCartButton from "@/components/AddToCartButton";
import CartLink from "@/components/CartLink";
import "../sandline.css";

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

export default async function Shop() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: products, error } = await supabase
    .from("products")
    .select()
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="sandline-page">
      <nav>
        <a className="logo" href="/">SAND<span>LINE</span></a>
        <div className="nav-links">
          <a href="/shop">Shop</a>
          <a href="/#story">Story</a>
          <a href="/#contact">Contact</a>
          <CartLink />
        </div>
      </nav>

      <div className="shop-header">
        <h1>Every edit, in one place.</h1>
        <p>Honeymoon, beach party, resort evening — hand-finished pieces, shipped worldwide.</p>
      </div>

      {error && <p style={{ padding: "0 64px", color: "red" }}>Error: {error.message}</p>}

      {products && products.length > 0 ? (
        <div className="shop-grid">
          {products.map((product) => {
            const hasPhoto = product.images && product.images.length > 0;
            return (
              <div className="collection-card" key={product.id}>
                <span className="price-tag">${product.selling_price_usd}</span>
                <div className="art">
                  {hasPhoto ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        position: "absolute",
                        inset: 0,
                      }}
                    />
                  ) : (
                    collectionArt[product.collection] || collectionArt.beach_party
                  )}
                </div>
                <div className="label">
                  <div className="eyebrow">{collectionLabel[product.collection] || "Sandline"}</div>
                  <h3>{product.name}</h3>
                  <AddToCartButton
                    id={product.id}
                    name={product.name}
                    price={product.selling_price_usd}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="empty-state">No products yet — add some from the Supabase Table Editor.</p>
      )}
    </div>
  );
}
