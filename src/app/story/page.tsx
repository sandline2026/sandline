import Link from "next/link";
import "../sandline.css";

export const metadata = {
  title: "The Story — Sandline Studio",
  description: "Handcrafted resortwear inspired by the golden shores of the Mediterranean and tailored with the artisan heritage of Jaipur.",
};

export default function StoryPage() {
  return (
    <div className="sandline-page">
      <nav>
        <Link className="logo" href="/">
          SAND<span>LINE</span>
        </Link>
        <div className="nav-links">
          <Link href="/shop">Shop</Link>
          <Link href="/size-guide">Size Guide</Link>
          <Link href="/story" className="active">Story</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/wishlist">Wishlist</Link>
          <Link href="/cart">Cart</Link>
        </div>
      </nav>

      <div className="shop-header">
        <span className="eyebrow">THE ARCHITECTURE OF LEISURE</span>
        <h1>The Sandline Story.</h1>
        <p>
          Where coastal Mediterranean freedom meets the timeless textile craftsmanship of Jaipur.
        </p>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px 80px" }}>
        
        {/* Philosophy Card */}
        <div style={{ background: "white", padding: "40px", borderRadius: "16px", border: "1px solid #EAE6DF", marginBottom: "28px" }}>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "28px", color: "#1A1A1A", marginBottom: "16px" }}>
            Breezy Silhouettes for Sun-Soaked Escapes
          </h2>
          <p style={{ color: "#555", lineHeight: "1.8", fontSize: "16px", marginBottom: "20px" }}>
            Sandline was founded on a singular romantic vision: creating resortwear that carries the lightness of sea breeze, the warmth of golden hour sun, and the ease of Mediterranean holidays.
          </p>
          <p style={{ color: "#555", lineHeight: "1.8", fontSize: "16px", marginBottom: "0" }}>
            From sun-drenched beach parties in Mykonos and Tulum to intimate candlelit resort evenings along the Amalfi coast, our collections are sculpted for women who celebrate life in effortless elegance.
          </p>
        </div>

        {/* The 3 Edits Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "36px" }}>
          <div style={{ background: "white", padding: "28px", borderRadius: "14px", border: "1px solid #EAE6DF" }}>
            <span style={{ fontSize: "12px", letterSpacing: "1.5px", color: "#8C6D58", fontWeight: "700", textTransform: "uppercase" }}>Collection I</span>
            <h3 style={{ fontFamily: "Fraunces, serif", fontSize: "20px", margin: "8px 0 12px", color: "#1A1A1A" }}>The Beach Party Edit</h3>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6" }}>
              Smocked pure linens, playful tiered ruffles, cutwork overshirts, and breezy co-ords designed for daytime celebrations and oceanfront sunsets.
            </p>
          </div>

          <div style={{ background: "white", padding: "28px", borderRadius: "14px", border: "1px solid #EAE6DF" }}>
            <span style={{ fontSize: "12px", letterSpacing: "1.5px", color: "#8C6D58", fontWeight: "700", textTransform: "uppercase" }}>Collection II</span>
            <h3 style={{ fontFamily: "Fraunces, serif", fontSize: "20px", margin: "8px 0 12px", color: "#1A1A1A" }}>The Wedding Night Edit</h3>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6" }}>
              Sculpted 3D floral slip dresses, lustrous silk satins, delicate organza camis, and romantic ivory silhouettes for honeymoons and milestone evenings.
            </p>
          </div>

          <div style={{ background: "white", padding: "28px", borderRadius: "14px", border: "1px solid #EAE6DF" }}>
            <span style={{ fontSize: "12px", letterSpacing: "1.5px", color: "#8C6D58", fontWeight: "700", textTransform: "uppercase" }}>Collection III</span>
            <h3 style={{ fontFamily: "Fraunces, serif", fontSize: "20px", margin: "8px 0 12px", color: "#1A1A1A" }}>The Resort Evening Edit</h3>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6" }}>
              Crystal-embellished poplin shirts, architectural knot blouses, vintage tailored wide-leg denims, and sophisticated cocktail silhouettes.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <Link
            href="/shop"
            style={{
              background: "#1A1A1A",
              color: "white",
              padding: "14px 36px",
              borderRadius: "30px",
              fontSize: "15px",
              fontWeight: "600",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Explore the Complete Wardrobe →
          </Link>
        </div>

      </div>
    </div>
  );
}
