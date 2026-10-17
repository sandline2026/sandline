"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CartLink from "@/components/CartLink";
import WishlistLink from "@/components/WishlistLink";
import IntroSplash from "@/components/IntroSplash";
import MotionLookbook from "@/components/MotionLookbook";
import HeroModelShowcase from "@/components/HeroModelShowcase";
import AccountNavButton from "@/components/AccountNavButton";
import CurrencySelector from "@/components/CurrencySelector";
import MobileDestinationBar from "@/components/MobileDestinationBar";
import MobileMenuDrawer from "@/components/MobileMenuDrawer";
import InstagramFeed from "@/components/InstagramFeed";
import ShopByCategory from "@/components/ShopByCategory";
import NewArrivalsSection from "@/components/NewArrivalsSection";
import "./sandline.css";

export default function Home() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fill = document.getElementById("horizon-fill");
    const sun = document.getElementById("sun");

    function onScroll() {
      const h = document.documentElement;
      const scrollTop = h.scrollTop || document.body.scrollTop;
      const scrollHeight = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
      const pct = scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0;
      if (fill) fill.style.width = pct + "%";
      if (sun) sun.style.left = pct + "%";
    }
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    return () => {
      document.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterDone(true);
    setNewsletterEmail("");
  }

  return (
    <div className="sandline-page">
      {/* Luxury Cinematic Brand Intro Curtain */}
      <IntroSplash />

      {/* Scroll Horizon Indicator */}
      <div id="horizon-wrap">
        <div id="horizon-track"></div>
        <div id="horizon-fill"></div>
      </div>
      <div id="sun"></div>

      {/* Main Navigation */}
      <nav>
        {/* Mobile Hamburger Toggle (Visible only on mobile <= 768px) */}
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open Navigation Menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Brand Logo */}
        <Link className="logo brand-logo-wrap" href="/" aria-label="SANDLINE Home">
          <img
            src="/images/logo-horizontal.png"
            alt="SANDLINE Resort Wear"
            className="site-brand-logo"
          />
        </Link>

        {/* Desktop Links (Hidden on mobile) */}
        <div className="nav-links desktop-only-nav">
          <Link href="/shop">Shop</Link>
          <Link href="#story">Story</Link>
          <Link href="/size-guide">Size Guide</Link>
          <Link href="#contact">Contact</Link>
          <CurrencySelector variant="navbar" />
          <WishlistLink />
          <AccountNavButton />
          <CartLink />
        </div>

        {/* Mobile Top Right Actions (Currency + Wishlist icon on mobile) */}
        <div className="mobile-top-actions">
          <CurrencySelector variant="navbar" />
          <WishlistLink variant="icon" />
        </div>
      </nav>

      {/* Slide-out Mobile Menu Drawer */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-bg"></div>
        <div className="horizon-line-deco"></div>
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="dot"></span>
            <span className="eyebrow">✦ RESORTWEAR DESIGNED &amp; HAND-FINISHED IN INDIA • SHIPPED WORLDWIDE</span>
          </div>
          <h1>
            Dresses cut for<br />
            <em>where the tide</em><br />
            meets the party.
          </h1>
          <p className="hero-sub">
            Sandline designs ethereal slip silhouettes, lightweight silks, and sculpted wraps for honeymoons, beach weddings, and sundown gatherings from Bali to Mykonos.
          </p>
          <div className="hero-cta">
            <Link className="btn" href="/shop">
              Explore All Silhouettes →
            </Link>
            <Link className="btn ghost" href="#collections">
              Discover The 3 Edits ↓
            </Link>
          </div>
        </div>

        {/* Hero Model Editorial Showcase */}
        <HeroModelShowcase />
      </header>

      {/* Editorial Destination Bar & Tabs (Escape Mobile Style) */}
      <MobileDestinationBar />

      {/* Shop By Category 2-Column Luxury Grid */}
      <ShopByCategory />

      {/* Fresh Drop 2026: All Under ₹3,000 New Arrivals Section */}
      <NewArrivalsSection />

      {/* Decorative Wave Separation */}
      <svg className="wave" viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ marginTop: "-2px" }}>
        <path fill="#EAF2EF" d="M0,32 C240,80 480,0 720,24 C960,48 1200,8 1440,40 L1440,80 L0,80 Z"></path>
      </svg>

      {/* Story & Atelier Craftsmanship Section */}
      <section id="story">
        <div className="story reveal">
          <div className="story-copy">
            <span className="eyebrow">The Sandline Story</span>
            <h2>Made in India. Worn on every beach.</h2>
            <p>
              We work with trusted artisan ateliers across India, each chosen for their generational craft in lightweight resortwear. Every Sandline piece is hand-finished and inspected before its journey across the ocean.
            </p>
            <div className="story-stats">
              <div>
                <div className="num">01</div>
                <div className="lbl">India Atelier</div>
              </div>
              <div>
                <div className="num">40+</div>
                <div className="lbl">Countries Shipped</div>
              </div>
              <div>
                <div className="num">100%</div>
                <div className="lbl">Hand-Finished</div>
              </div>
            </div>
          </div>
          <div className="story-visual" style={{ padding: 0, overflow: "hidden", borderRadius: "20px" }}>
            <img
              src="/images/products/jaipur-blossom-embroidered-poplin-overshirt.jpg"
              alt="India Atelier Craftsmanship"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", borderRadius: "20px" }}
            />
          </div>
        </div>
      </section>

      {/* The 3 Edits Collection Showcase */}
      <section id="collections">
        <div className="section-head reveal">
          <h2>Three edits, one horizon.</h2>
          <p>
            Every collection is built around a moment — the intimate wedding night, the golden hour beach party, and the elevated resort evening.
          </p>
        </div>
        <div className="collections-grid">
          {/* Honeymoon Card */}
          <Link
            href="/collections/honeymoon"
            className="collection-card reveal"
            style={{ display: "block", textDecoration: "none", color: "inherit" }}
          >
            <span className="price-tag">from $28</span>
            <div className="art">
              <img
                src="/images/products/mykonos-scallop-crochet-maxi-set.jpg"
                alt="The Wedding Night Edit"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
              />
            </div>
            <div className="label">
              <div className="eyebrow">The Wedding Night Edit</div>
              <h3>Scallop Bandeaus &amp; Crochet Maxis</h3>
            </div>
          </Link>

          {/* Beach Party Card */}
          <Link
            href="/collections/beach_party"
            className="collection-card reveal"
            style={{ display: "block", textDecoration: "none", color: "inherit" }}
          >
            <span className="price-tag">from $28</span>
            <div className="art">
              <img
                src="/images/products/tulum-terracotta-laser-cut-maxi-set.jpg"
                alt="The Beach Party Edit"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
              />
            </div>
            <div className="label">
              <div className="eyebrow">The Beach Party Edit</div>
              <h3>Laser-Cut Maxis &amp; Watercolor Sarongs</h3>
            </div>
          </Link>

          {/* Resort Evening Card */}
          <Link
            href="/collections/resort_evening"
            className="collection-card reveal"
            style={{ display: "block", textDecoration: "none", color: "inherit" }}
          >
            <span className="price-tag">from $31</span>
            <div className="art">
              <img
                src="/images/products/saint-tropez-citrus-tiered-chiffon-dress.jpg"
                alt="The Resort Evening Edit"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
              />
            </div>
            <div className="label">
              <div className="eyebrow">The Resort Evening Edit</div>
              <h3>Citrus Chiffons &amp; Crystal Blouses</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Runway in Motion / Dynamic Model Lookbook Section */}
      <MotionLookbook />

      {/* Marquee Trust Banner */}
      <div className="marquee-wrap">
        <div className="marquee">
          <span>Worldwide Tracked Shipping</span>
          <span>Handcrafted in India</span>
          <span>Hassle-Free Exchanges</span>
          <span>Ethically Sourced Mulberry Silks</span>
          <span>Worldwide Tracked Shipping</span>
          <span>Handcrafted in India</span>
          <span>Hassle-Free Exchanges</span>
          <span>Ethically Sourced Mulberry Silks</span>
        </div>
      </div>

      {/* Craft Pillars Section */}
      <section id="craft">
        <div className="section-head reveal">
          <h2>Built for the trip, not just the photo.</h2>
          <p>Everything about a Sandline piece is chosen by what happens after your flight touches down.</p>
        </div>
        <div className="craft-grid reveal">
          <div className="craft-item">
            <span className="num">01 / FABRIC</span>
            <h3>Breathes on a 34°C beach</h3>
            <p>Pure mulmul cottons and airy silk blends chosen for coastal humidity, ensuring breezy comfort all day.</p>
          </div>
          <div className="craft-item">
            <span className="num">02 / FIT</span>
            <h3>Draped on real silhouettes</h3>
            <p>Every silhouette is tailored for fluid movement, with comprehensive US/UK/EU sizing guides and fit notes.</p>
          </div>
          <div className="craft-item">
            <span className="num">03 / JOURNEY</span>
            <h3>Packed to travel light</h3>
            <p>Wrinkle-resistant folding and express international courier from our India atelier straight to your resort.</p>
          </div>
        </div>
      </section>

      {/* Brand Manifesto & 3 Pillars Section (Escape Style) */}
      <section className="brand-manifesto-section">
        <div className="manifesto-inner reveal">
          <h2 className="manifesto-quote">
            When we <strong>promise a look</strong>, we <strong>deliver the exact piece</strong> you fell for — down to the last detail.
          </h2>

          <div className="manifesto-pillars-grid">
            <div className="manifesto-pillar-card">
              <div className="pillar-icon">💨</div>
              <h3>Cut to travel</h3>
              <p>Crease-forgiving fabric that folds flat and looks composed straight from the carry-on.</p>
            </div>

            <div className="manifesto-pillar-card">
              <div className="pillar-icon">🌿</div>
              <h3>Made to last</h3>
              <p>Natural fibres and considered construction. Pieces you'll reach for season after season.</p>
            </div>

            <div className="manifesto-pillar-card">
              <div className="pillar-icon">📦</div>
              <h3>Packed with care</h3>
              <p>Shipped plastic-free in recyclable packaging directly from our India atelier.</p>
            </div>
          </div>
        </div>

        {/* First Access To Every Drop Dark Green Banner */}
        <div className="drop-access-banner reveal">
          <span className="drop-access-eyebrow">JOIN THE LIST</span>
          <h2>First access to every drop.</h2>
          <p>No noise. Just new arrivals, the occasional edit, and a little sun in your inbox.</p>

          {newsletterDone ? (
            <div className="drop-access-success">
              ✓ You're on the list! Early access invitations will arrive in your inbox.
            </div>
          ) : (
            <form className="drop-access-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit">JOIN</button>
            </form>
          )}
        </div>
      </section>

      {/* Instagram Vacation Lookbook & "Shop The Look" Feed */}
      <InstagramFeed />

      {/* Sunset VIP Newsletter & Footer */}
      <footer id="contact">
        <div className="footer-cta">
          <h2>
            Your dress is waiting<br />
            for its <em>first sunset.</em>
          </h2>
          {newsletterDone ? (
            <div style={{ color: "var(--gold)", fontFamily: "'Space Mono', monospace", fontSize: "13px" }}>
              ✓ You're on the VIP Sunset list! We'll notify you on new drops.
            </div>
          ) : (
            <form className="footer-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Enter your email for early access"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit">Join VIP →</button>
            </form>
          )}
        </div>

        <div className="footer-cols">
          <div>
            <div className="footer-brand-logo-wrap">
              <img
                src="/images/logo-horizontal-white.png"
                alt="SANDLINE"
                className="footer-brand-logo"
              />
            </div>
            <p>
              Resort and beach dresses, designed and hand-finished in India — shipped to shores around the world.
            </p>
          </div>
          <div>
            <h4>Collections</h4>
            <ul>
              <li><Link href="/collections/honeymoon" style={{ color: "inherit", textDecoration: "none" }}>Honeymoon Edit</Link></li>
              <li><Link href="/collections/beach_party" style={{ color: "inherit", textDecoration: "none" }}>Beach Party Edit</Link></li>
              <li><Link href="/collections/resort_evening" style={{ color: "inherit", textDecoration: "none" }}>Resort Evening Edit</Link></li>
              <li><Link href="/shop" style={{ color: "inherit", textDecoration: "none" }}>All Silhouettes</Link></li>
            </ul>
          </div>
          <div>
            <h4>Info &amp; Policies</h4>
            <ul>
              <li><Link href="/shipping-returns" style={{ color: "inherit", textDecoration: "none" }}>Shipping &amp; Returns</Link></li>
              <li><Link href="/size-guide" style={{ color: "inherit", textDecoration: "none" }}>Size Guide</Link></li>
              <li><Link href="/privacy-policy" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</Link></li>
              <li><Link href="/terms" style={{ color: "inherit", textDecoration: "none" }}>Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4>Studio &amp; Social</h4>
            <ul>
              <li><a href="https://www.instagram.com/sandline.store" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)", textDecoration: "none", fontWeight: 600 }}>Instagram: @sandline.store ↗</a></li>
              <li><Link href="/story" style={{ color: "inherit", textDecoration: "none" }}>The Sandline Story</Link></li>
              <li><Link href="/contact" style={{ color: "inherit", textDecoration: "none" }}>Contact &amp; Concierge</Link></li>
              <li><a href="mailto:sandlinestudio.in@sandline.store" style={{ color: "inherit", textDecoration: "none" }}>sandlinestudio.in@sandline.store</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <span>© 2026 SANDLINE STUDIO — HANDCRAFTED IN INDIA</span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "11px", letterSpacing: "0.5px", opacity: 0.7, fontFamily: "'Space Mono', monospace" }}>CURRENCY:</span>
            <CurrencySelector variant="footer" />
          </div>
          <span>WORLDWIDE EXPRESS SHIPPING • 7-DAY EXCHANGES</span>
        </div>
      </footer>
    </div>
  );
}