"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CartLink from "@/components/CartLink";
import WishlistLink from "@/components/WishlistLink";
import IntroSplash from "@/components/IntroSplash";
import "./sandline.css";

export default function Home() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);

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
        <Link className="logo" href="/">
          SAND<span>LINE</span>
        </Link>
        <div className="nav-links">
          <Link href="/shop">Shop</Link>
          <Link href="/size-guide">Size Guide</Link>
          <WishlistLink />
          <Link href="#story">Story</Link>
          <Link href="#contact">Contact</Link>
          <CartLink />
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-bg"></div>
        <div className="horizon-line-deco"></div>
        <div className="hero-eyebrow">
          <span className="dot"></span>
          <span className="eyebrow">✦ RESORTWEAR DESIGNED &amp; HAND-FINISHED IN JAIPUR • SHIPPED WORLDWIDE</span>
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
        <div className="hero-tag-cloud">
          <div className="float-tag">✦ The Honeymoon Edit</div>
          <div className="float-tag">✦ Beach Party Ready</div>
          <div className="float-tag">✦ Ships to 80+ Countries</div>
        </div>
      </header>

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
              We work with trusted ateliers across Jaipur, India, each chosen for their generational craft in lightweight resortwear. Every Sandline piece is hand-finished and inspected before its journey across the ocean.
            </p>
            <div className="story-stats">
              <div>
                <div className="num">01</div>
                <div className="lbl">Jaipur Atelier</div>
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
          <div className="story-visual">
            <svg className="loom" viewBox="0 0 300 300" fill="none">
              <circle cx="150" cy="150" r="120" stroke="#E8A73B" strokeWidth="1" opacity="0.5" />
              <circle cx="150" cy="150" r="90" stroke="#F6EFE3" strokeWidth="1" opacity="0.35" />
              <path d="M60 190 C 90 120, 210 120, 240 190" stroke="#F6EFE3" strokeWidth="2" fill="none" />
              <path d="M100 150 Q150 90 200 150 Q150 210 100 150 Z" fill="#FF7A54" opacity="0.85" />
              <circle cx="150" cy="150" r="10" fill="#F6EFE3" />
            </svg>
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
            <span className="price-tag">from $58</span>
            <div className="art">
              <svg viewBox="0 0 200 260" fill="none">
                <path d="M100 20 L70 60 L60 240 L140 240 L130 60 Z" fill="#0E4B4A" opacity="0.9" />
                <path d="M100 20 L70 60 L100 80 L130 60 Z" fill="#FF7A54" />
                <line x1="60" y1="150" x2="140" y2="150" stroke="#F6EFE3" strokeWidth="1" opacity="0.4" />
              </svg>
            </div>
            <div className="label">
              <div className="eyebrow">The Wedding Night Edit</div>
              <h3>Long Silk Slips</h3>
            </div>
          </Link>

          {/* Beach Party Card */}
          <Link
            href="/collections/beach_party"
            className="collection-card reveal"
            style={{ display: "block", textDecoration: "none", color: "inherit" }}
          >
            <span className="price-tag">from $42</span>
            <div className="art">
              <svg viewBox="0 0 200 260" fill="none">
                <path d="M100 30 L65 65 L70 160 L130 160 L135 65 Z" fill="#FF7A54" opacity="0.92" />
                <path d="M100 30 L65 65 L100 90 L135 65 Z" fill="#0E4B4A" />
                <circle cx="100" cy="110" r="3" fill="#F6EFE3" />
                <circle cx="85" cy="130" r="3" fill="#F6EFE3" />
                <circle cx="115" cy="130" r="3" fill="#F6EFE3" />
              </svg>
            </div>
            <div className="label">
              <div className="eyebrow">The Beach Party Edit</div>
              <h3>Short Sundown Dresses</h3>
            </div>
          </Link>

          {/* Resort Evening Card */}
          <Link
            href="/collections/resort_evening"
            className="collection-card reveal"
            style={{ display: "block", textDecoration: "none", color: "inherit" }}
          >
            <span className="price-tag">from $50</span>
            <div className="art">
              <svg viewBox="0 0 200 260" fill="none">
                <path d="M100 24 L68 58 L64 230 L136 230 L132 58 Z" fill="#E8A73B" opacity="0.92" />
                <path d="M100 24 L68 58 L100 84 L132 58 Z" fill="#1B2420" />
                <path d="M64 150 Q100 175 136 150" stroke="#1B2420" strokeWidth="1.5" fill="none" opacity="0.4" />
              </svg>
            </div>
            <div className="label">
              <div className="eyebrow">The Resort Evening Edit</div>
              <h3>Wrap &amp; Flow Dresses</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Marquee Trust Banner */}
      <div className="marquee-wrap">
        <div className="marquee">
          <span>Worldwide Tracked Shipping</span>
          <span>Handcrafted in Jaipur</span>
          <span>Hassle-Free Exchanges</span>
          <span>Ethically Sourced Mulberry Silks</span>
          <span>Worldwide Tracked Shipping</span>
          <span>Handcrafted in Jaipur</span>
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
            <p>Wrinkle-resistant folding and express international courier from our Jaipur atelier straight to your resort.</p>
          </div>
        </div>
      </section>

      {/* Social Proof & Testimonial */}
      <section>
        <div className="testimonial reveal">
          <h2>
            "I wore the sunset dress for our honeymoon in Bali. The silk is unimaginably soft and strangers on the beach kept asking where I got it."
          </h2>
          <div className="who">— Chloe M., Canggu, Indonesia (Verified Buyer)</div>
        </div>
      </section>

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
            <div className="brand">SANDLINE</div>
            <p>
              Resort and beach dresses, designed and hand-finished in Jaipur, India — shipped to shores around the world.
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
            <h4>Info &amp; Care</h4>
            <ul>
              <li><Link href="/size-guide" style={{ color: "inherit", textDecoration: "none" }}>Size Guide</Link></li>
              <li><Link href="/wishlist" style={{ color: "inherit", textDecoration: "none" }}>Saved Wishlist</Link></li>
              <li><Link href="/cart" style={{ color: "inherit", textDecoration: "none" }}>Shopping Bag</Link></li>
            </ul>
          </div>
          <div>
            <h4>Studio</h4>
            <ul>
              <li><Link href="/admin" style={{ color: "inherit", textDecoration: "none" }}>Admin Portal</Link></li>
              <li>Instagram (@sandline)</li>
              <li>WhatsApp Support</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 SANDLINE STUDIO — HANDCRAFTED IN INDIA</span>
          <span>WORLDWIDE EXPRESS SHIPPING</span>
        </div>
      </footer>
    </div>
  );
}
