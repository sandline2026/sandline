"use client";

import { useState } from "react";
import Link from "next/link";
import CartLink from "@/components/CartLink";
import WishlistLink from "@/components/WishlistLink";
import AccountNavButton from "@/components/AccountNavButton";
import CurrencySelector from "@/components/CurrencySelector";
import MobileMenuDrawer from "@/components/MobileMenuDrawer";

interface SiteNavbarProps {
  currentPath?: string;
}

export default function SiteNavbar({ currentPath }: SiteNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sandline-site-navbar">
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

        {/* Desktop Navigation Links (Hidden on mobile) */}
        <div className="nav-links desktop-only-nav">
          <Link href="/shop">Shop</Link>
          <Link href="/story">Story</Link>
          <Link href="/size-guide">Size Guide</Link>
          <Link href="/contact">Contact</Link>
          <CurrencySelector variant="navbar" />
          <WishlistLink />
          <AccountNavButton />
          <CartLink />
        </div>

        {/* Mobile Top Right Actions (Currency + Wishlist on mobile) */}
        <div className="mobile-top-actions">
          <CurrencySelector variant="navbar" />
          <WishlistLink />
        </div>
      </nav>

      {/* Slide-out Mobile Menu Drawer */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
