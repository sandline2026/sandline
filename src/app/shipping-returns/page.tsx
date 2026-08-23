import Link from "next/link";
import "../sandline.css";

export const metadata = {
  title: "Shipping & Returns — Sandline Studio",
  description: "Global express shipping timelines, delivery commitments, tracking, and our seamless 7-day return & exchange policy.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="sandline-page">
      <nav>
        <Link className="logo" href="/">
          SAND<span>LINE</span>
        </Link>
        <div className="nav-links">
          <Link href="/shop">Shop</Link>
          <Link href="/size-guide">Size Guide</Link>
          <Link href="/story">Story</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/wishlist">Wishlist</Link>
          <Link href="/cart">Cart</Link>
        </div>
      </nav>

      <div className="shop-header">
        <span className="eyebrow">WORLDWIDE DELIVERIES & COMPLIMENTARY EXCHANGES</span>
        <h1>Shipping & Returns.</h1>
        <p>
          Handcrafted in our Jaipur atelier and dispatched with insured express couriers to your doorstep worldwide.
        </p>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px 80px" }}>
        
        {/* Section 1: Shipping */}
        <div style={{ background: "white", padding: "36px", borderRadius: "16px", border: "1px solid #EAE6DF", marginBottom: "28px" }}>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "24px", color: "#1A1A1A", marginBottom: "16px" }}>
            🌍 Worldwide Express Shipping
          </h2>
          <p style={{ color: "#555", lineHeight: "1.7", marginBottom: "20px" }}>
            Every Sandline garment is made to order or inspected by our master artisans before dispatch. We partner with DHL Express, FedEx, and premium courier networks to ensure swift, fully insured transit.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            <div style={{ padding: "20px", background: "#FAF8F5", borderRadius: "12px", border: "1px solid #EAE6DF" }}>
              <div style={{ fontWeight: "600", color: "#1A1A1A", marginBottom: "4px" }}>🇮🇳 India (Domestic)</div>
              <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>3 – 5 Business Days</div>
              <div style={{ fontSize: "13px", color: "#8C6D58", fontWeight: "600" }}>Complimentary Standard Delivery</div>
            </div>

            <div style={{ padding: "20px", background: "#FAF8F5", borderRadius: "12px", border: "1px solid #EAE6DF" }}>
              <div style={{ fontWeight: "600", color: "#1A1A1A", marginBottom: "4px" }}>🇺🇸 🇬🇧 🇦🇺 Worldwide Express</div>
              <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>5 – 8 Business Days</div>
              <div style={{ fontSize: "13px", color: "#8C6D58", fontWeight: "600" }}>Express Courier with Live Tracking</div>
            </div>
          </div>

          <div style={{ fontSize: "14px", color: "#666", lineHeight: "1.6" }}>
            <strong>Live Tracking:</strong> As soon as your order is dispatched from our atelier, you will receive an automated dispatch email & SMS with your real-time tracking link.
          </div>
        </div>

        {/* Section 2: Returns & Exchanges */}
        <div style={{ background: "white", padding: "36px", borderRadius: "16px", border: "1px solid #EAE6DF", marginBottom: "28px" }}>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "24px", color: "#1A1A1A", marginBottom: "16px" }}>
            ✨ 7-Day Easy Returns & Exchanges
          </h2>
          <p style={{ color: "#555", lineHeight: "1.7", marginBottom: "20px" }}>
            We want your Sandline pieces to fit and feel extraordinary. If you are not completely enchanted with your order, we offer seamless 7-day returns and size exchanges.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{ background: "#C29B7F", color: "white", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0, marginTop: "2px" }}>1</span>
              <div style={{ fontSize: "14px", color: "#444", lineHeight: "1.6" }}>
                <strong>Condition:</strong> Garments must be unworn, unwashed, with all original tags attached in original packaging.
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{ background: "#C29B7F", color: "white", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0, marginTop: "2px" }}>2</span>
              <div style={{ fontSize: "14px", color: "#444", lineHeight: "1.6" }}>
                <strong>Initiate Request:</strong> Email us at <a href="mailto:orders@sandline.store" style={{ color: "#1A1A1A", fontWeight: "600", textDecoration: "underline" }}>orders@sandline.store</a> or contact our WhatsApp Concierge within 7 days of delivery with your Order ID (e.g. <code>SL-12345678</code>).
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{ background: "#C29B7F", color: "white", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0, marginTop: "2px" }}>3</span>
              <div style={{ fontSize: "14px", color: "#444", lineHeight: "1.6" }}>
                <strong>Fast Resolution:</strong> For size exchanges, your replacement piece will be dispatched immediately upon pickup. For returns, refunds are credited back to your original payment method within 5–7 business days.
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Concierge Support */}
        <div style={{ background: "#1A1A1A", color: "white", padding: "32px", borderRadius: "16px", textAlign: "center" }}>
          <h3 style={{ fontFamily: "Fraunces, serif", fontSize: "20px", marginBottom: "8px", color: "#FAF8F5" }}>
            Need Personal Assistance with an Order?
          </h3>
          <p style={{ color: "#BBB", fontSize: "14px", marginBottom: "20px" }}>
            Our client concierge team is available Monday through Saturday (9:00 AM – 7:00 PM IST).
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="mailto:orders@sandline.store"
              style={{
                background: "white",
                color: "#1A1A1A",
                padding: "12px 24px",
                borderRadius: "30px",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Email orders@sandline.store
            </a>
            <Link
              href="/contact"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                padding: "12px 24px",
                borderRadius: "30px",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              Contact Atelier
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
