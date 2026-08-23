import Link from "next/link";
import "../sandline.css";

export const metadata = {
  title: "Privacy Policy — Sandline Studio",
  description: "Sandline Studio's commitment to protecting your privacy and personal data.",
};

export default function PrivacyPolicyPage() {
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
          <Link href="/cart">Cart</Link>
        </div>
      </nav>

      <div className="shop-header">
        <span className="eyebrow">LEGAL COMPLIANCE & DATA PROTECTION</span>
        <h1>Privacy Policy.</h1>
        <p>Last updated: August 2026. Your privacy and trust are sacred to us.</p>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ background: "white", padding: "40px", borderRadius: "16px", border: "1px solid #EAE6DF", lineHeight: "1.8", color: "#444", fontSize: "15px" }}>
          
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "22px", color: "#1A1A1A", marginBottom: "12px" }}>1. Information We Collect</h2>
          <p style={{ marginBottom: "20px" }}>
            When you purchase from Sandline Studio, we collect personal information including your name, billing & shipping address, email address, phone number, and purchase history. Payment details are processed directly through PCI-DSS Level 1 certified gateways (e.g. Stripe); we never store your full credit card numbers on our servers.
          </p>

          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "22px", color: "#1A1A1A", marginBottom: "12px" }}>2. How We Use Your Data</h2>
          <p style={{ marginBottom: "20px" }}>
            Your information is used strictly to fulfill your orders, process payments, arrange international courier shipping, communicate order status updates via email & SMS, and provide dedicated client concierge support.
          </p>

          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "22px", color: "#1A1A1A", marginBottom: "12px" }}>3. Data Security & Third-Party Sharing</h2>
          <p style={{ marginBottom: "20px" }}>
            We do not sell, rent, or trade your personal information. We only share necessary data with trusted logistics partners (DHL, FedEx) and secure payment processors (Stripe) to deliver your purchases.
          </p>

          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "22px", color: "#1A1A1A", marginBottom: "12px" }}>4. Your Rights & Inquiries</h2>
          <p style={{ marginBottom: "0" }}>
            You may request access to, correction of, or deletion of your personal data at any time by contacting our Data Privacy officer at <a href="mailto:orders@sandline.store" style={{ color: "#1A1A1A", fontWeight: "600", textDecoration: "underline" }}>orders@sandline.store</a>.
          </p>

        </div>
      </div>
    </div>
  );
}
