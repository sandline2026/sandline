import Link from "next/link";
import "../sandline.css";

export const metadata = {
  title: "Terms of Service — Sandline Studio",
  description: "Terms and conditions governing purchases and usage of Sandline Studio.",
};

export default function TermsPage() {
  return (
    <div className="sandline-page">
      <nav>
        <Link className="logo brand-logo-wrap" href="/"><img src="/images/logo-horizontal.png" alt="SANDLINE Resort Wear" className="site-brand-logo" /></Link>
        <div className="nav-links">
          <Link href="/shop">Shop</Link>
          <Link href="/size-guide">Size Guide</Link>
          <Link href="/story">Story</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/cart">Cart</Link>
        </div>
      </nav>

      <div className="shop-header">
        <span className="eyebrow">TERMS & CONDITIONS OF SALE</span>
        <h1>Terms of Service.</h1>
        <p>Last updated: August 2026. Please read carefully before purchasing.</p>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ background: "white", padding: "40px", borderRadius: "16px", border: "1px solid #EAE6DF", lineHeight: "1.8", color: "#444", fontSize: "15px" }}>
          
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "22px", color: "#1A1A1A", marginBottom: "12px" }}>1. Agreement to Terms</h2>
          <p style={{ marginBottom: "20px" }}>
            By accessing or ordering from Sandline Studio (<a href="https://sandline.store" style={{ color: "#1A1A1A", fontWeight: "600" }}>sandline.store</a>), you agree to be bound by these Terms of Service and all applicable international trade and consumer protection laws.
          </p>

          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "22px", color: "#1A1A1A", marginBottom: "12px" }}>2. Pricing & Currency</h2>
          <p style={{ marginBottom: "20px" }}>
            All prices are listed in US Dollars (USD). We reserve the right to modify prices, launch promotional sales, and update catalog inventory without prior notice.
          </p>

          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "22px", color: "#1A1A1A", marginBottom: "12px" }}>3. Order Confirmation & Fulfillment</h2>
          <p style={{ marginBottom: "20px" }}>
            Upon placing an order, you will receive an immediate digital receipt and order confirmation. We reserve the right to cancel or refuse any order in the event of unforeseen inventory shortages or pricing inaccuracies, with an immediate full refund.
          </p>

          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "22px", color: "#1A1A1A", marginBottom: "12px" }}>4. Governing Law</h2>
          <p style={{ marginBottom: "0" }}>
            These terms are governed by and construed in accordance with the laws of India, subject to the jurisdiction of the courts of Jaipur, Rajasthan.
          </p>

        </div>
      </div>
    </div>
  );
}
