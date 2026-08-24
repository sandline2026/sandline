import Link from "next/link";
import "../sandline.css";

export const metadata = {
  title: "Contact & Atelier Concierge — Sandline Studio",
  description: "Connect with the Sandline Studio concierge team for styling advice, order status, custom sizing, and international shipping queries.",
};

export default function ContactPage() {
  return (
    <div className="sandline-page">
      <nav>
        <Link className="logo brand-logo-wrap" href="/"><img src="/images/logo-horizontal.png" alt="SANDLINE Resort Wear" className="site-brand-logo" /></Link>
        <div className="nav-links">
          <Link href="/shop">Shop</Link>
          <Link href="/size-guide">Size Guide</Link>
          <Link href="/story">Story</Link>
          <Link href="/contact" className="active">Contact</Link>
          <Link href="/wishlist">Wishlist</Link>
          <Link href="/cart">Cart</Link>
        </div>
      </nav>

      <div className="shop-header">
        <span className="eyebrow">CLIENT CONCIERGE & ATELIER SUPPORT</span>
        <h1>Get in Touch.</h1>
        <p>
          Whether you need styling consultations, size recommendations, or order assistance, our concierge is here for you.
        </p>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "36px" }}>
          
          {/* Email Support Card */}
          <div style={{ background: "white", padding: "32px", borderRadius: "16px", border: "1px solid #EAE6DF" }}>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>✉️</div>
            <h3 style={{ fontFamily: "Fraunces, serif", fontSize: "20px", color: "#1A1A1A", marginBottom: "8px" }}>
              Client Orders & Enquiries
            </h3>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6", marginBottom: "16px" }}>
              For order status, returns, and custom queries, our concierge responds within 4 business hours.
            </p>
            <a
              href="mailto:orders@sandline.store"
              style={{
                display: "inline-block",
                color: "#1A1A1A",
                fontWeight: "700",
                fontSize: "15px",
                textDecoration: "underline",
              }}
            >
              orders@sandline.store
            </a>
          </div>

          {/* WhatsApp Concierge Card */}
          <div style={{ background: "white", padding: "32px", borderRadius: "16px", border: "1px solid #EAE6DF" }}>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>💬</div>
            <h3 style={{ fontFamily: "Fraunces, serif", fontSize: "20px", color: "#1A1A1A", marginBottom: "8px" }}>
              WhatsApp Concierge
            </h3>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6", marginBottom: "16px" }}>
              Instant style advice, fit questions, and expedited support via WhatsApp.
            </p>
            <a
              href="https://wa.me/919999999999?text=Hi%20Sandline%20Concierge,%20I%20have%20a%20question%20about%20an%20order"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#25D366",
                color: "white",
                padding: "10px 20px",
                borderRadius: "30px",
                fontWeight: "600",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Chat on WhatsApp ↗
            </a>
          </div>

        </div>

        {/* Atelier Info */}
        <div style={{ background: "white", padding: "36px", borderRadius: "16px", border: "1px solid #EAE6DF" }}>
          <h3 style={{ fontFamily: "Fraunces, serif", fontSize: "22px", color: "#1A1A1A", marginBottom: "12px" }}>
            🏛️ Atelier & Headquarters
          </h3>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.7", marginBottom: "8px" }}>
            <strong>Sandline Studio</strong><br />
            Jaipur Design District, Rajasthan 302001, India
          </p>
          <p style={{ color: "#888", fontSize: "13px" }}>
            Operating Hours: Monday – Saturday (9:00 AM – 7:00 PM IST). Dispatches worldwide daily.
          </p>
        </div>
      </div>
    </div>
  );
}
