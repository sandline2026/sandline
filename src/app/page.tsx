"use client";

import { useEffect } from "react";
import "./sandline.css";

export default function Home() {
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

  return (
    <div className="sandline-page">
      <div id="horizon-wrap">
        <div id="horizon-track"></div>
        <div id="horizon-fill"></div>
      </div>
      <div id="sun"></div>

      <nav>
        <div className="logo">SAND<span>LINE</span></div>
        <div className="nav-links">
          <a href="#story">Story</a>
          <a href="#collections">Collections</a>
          <a href="#craft">Craft</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-bg"></div>
        <div className="horizon-line-deco"></div>
        <div className="hero-eyebrow">
          <span className="dot"></span>
          <span className="eyebrow">Designed in India — worn on every shore</span>
        </div>
        <h1>Dresses cut for<br /><em>where the tide</em><br />meets the party.</h1>
        <p className="hero-sub">
          Sandline designs short and long western silhouettes, hand-finished by our India-based ateliers,
          for honeymoons, beach weddings and sundown parties from Bali to Mykonos.
        </p>
        <div className="hero-cta">
          <a className="btn" href="#collections">Explore the collection</a>
          <a className="btn ghost" href="#story">Our story</a>
        </div>
        <div className="hero-tag-cloud">
          <div className="float-tag">✦ Honeymoon edit</div>
          <div className="float-tag">✦ Beach party ready</div>
          <div className="float-tag">✦ Ships worldwide</div>
        </div>
      </header>

      <svg className="wave" viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ marginTop: "-2px" }}>
        <path fill="#EAF2EF" d="M0,32 C240,80 480,0 720,24 C960,48 1200,8 1440,40 L1440,80 L0,80 Z"></path>
      </svg>

      <section id="story">
        <div className="story reveal">
          <div className="story-copy">
            <span className="eyebrow">The Sandline Story</span>
            <h2>Made in India. Worn on every beach.</h2>
            <p>
              We work with trusted ateliers across India, each chosen for their craft in resort wear.
              Every Sandline piece is hand-checked before it leaves for its journey to a beach on the
              other side of the world.
            </p>
            <div className="story-stats">
              <div><div className="num">01</div><div className="lbl">Atelier Partner</div></div>
              <div><div className="num">40+</div><div className="lbl">Countries Shipped</div></div>
              <div><div className="num">100%</div><div className="lbl">Hand-Finished</div></div>
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

      <section id="collections">
        <div className="section-head reveal">
          <h2>Three edits, one horizon.</h2>
          <p>Every collection is built around a moment — the wedding night, the beach party, the resort evening.</p>
        </div>
        <div className="collections-grid">
          <div className="collection-card reveal">
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
          </div>

          <div className="collection-card reveal">
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
          </div>

          <div className="collection-card reveal">
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
          </div>
        </div>
      </section>

      <div className="marquee-wrap">
        <div className="marquee">
          <span>Worldwide Shipping</span>
          <span>Hand-Finished in India</span>
          <span>Easy Size Exchange</span>
          <span>Secure International Checkout</span>
          <span>Worldwide Shipping</span>
          <span>Hand-Finished in India</span>
          <span>Easy Size Exchange</span>
          <span>Secure International Checkout</span>
        </div>
      </div>

      <section id="craft">
        <div className="section-head reveal">
          <h2>Built for the trip, not just the photo.</h2>
          <p>Everything about a Sandline piece is decided by what happens after you land.</p>
        </div>
        <div className="craft-grid reveal">
          <div className="craft-item">
            <span className="num">FABRIC</span>
            <h3>Breathes on a 34°C beach</h3>
            <p>Light rayon and cotton-linen blends chosen for humidity, not just for how they photograph on a hanger.</p>
          </div>
          <div className="craft-item">
            <span className="num">FIT</span>
            <h3>Sized on real bodies</h3>
            <p>Every style ships with a US/UK/EU conversion guide and a video fit note before you order.</p>
          </div>
          <div className="craft-item">
            <span className="num">JOURNEY</span>
            <h3>Packed to travel well</h3>
            <p>Wrinkle-resistant folding and tracked international courier, door to resort.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="testimonial reveal">
          <h2>
            "I ordered it for my honeymoon in Bali not knowing what to expect from a brand I'd found on
            Instagram — it fit perfectly and every stranger on the beach asked where it was from."
          </h2>
          <div className="who">— Early Customer, Canggu, Indonesia</div>
        </div>
      </section>

      <footer id="contact">
        <div className="footer-cta">
          <h2>Your dress is waiting<br />for its <em>first sunset.</em></h2>
          <div className="footer-form">
            <input type="email" placeholder="Enter your email for early access" />
            <button type="button">Notify me →</button>
          </div>
        </div>
        <div className="footer-cols">
          <div>
            <div className="brand">SANDLINE</div>
            <p>Resort and beach dresses, designed and hand-finished in India — shipped to shores around the world.</p>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              <li>Honeymoon Edit</li>
              <li>Beach Party Edit</li>
              <li>Resort Evening Edit</li>
            </ul>
          </div>
          <div>
            <h4>Info</h4>
            <ul>
              <li>Size Guide</li>
              <li>Shipping &amp; Returns</li>
              <li>Our Atelier</li>
            </ul>
          </div>
          <div>
            <h4>Follow</h4>
            <ul>
              <li>Instagram</li>
              <li>Pinterest</li>
              <li>WhatsApp</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SANDLINE — MADE IN INDIA</span>
          <span>SHIPPING WORLDWIDE</span>
        </div>
      </footer>
    </div>
  );
}
