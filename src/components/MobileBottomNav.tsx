"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuthModal } from "@/context/AuthModalContext";
import { createClient } from "@/../utils/supabase/client";
import MobileSearchModal from "@/components/MobileSearchModal";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { openCart, itemCount } = useCart();
  const { openAuthModal } = useAuthModal();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session?.user?.email);
    }
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user?.email);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Hide bottom bar on admin, checkout, and product detail pages
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/checkout") ||
    pathname?.startsWith("/product/")
  ) {
    return null;
  }

  const isHome = pathname === "/";
  const isShop = pathname?.startsWith("/shop") || pathname?.startsWith("/collections") || pathname?.startsWith("/product");
  const isAccount = pathname?.startsWith("/account");

  function handleAccountClick(e: React.MouseEvent) {
    if (!isLoggedIn) {
      e.preventDefault();
      openAuthModal("phone");
    }
  }

  return (
    <>
      <nav className="mobile-bottom-navbar" aria-label="Mobile Navigation">
        {/* 1. HOME */}
        <Link
          href="/"
          className={`mobile-nav-item ${isHome ? "active" : ""}`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>HOME</span>
        </Link>

        {/* 2. SHOP */}
        <Link
          href="/shop"
          className={`mobile-nav-item ${isShop ? "active" : ""}`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          <span>SHOP</span>
        </Link>

        {/* 3. SEARCH */}
        <button
          type="button"
          className="mobile-nav-item"
          onClick={() => setIsSearchOpen(true)}
          aria-label="Search Collection"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <span>SEARCH</span>
        </button>

        {/* 4. CART */}
        <button
          type="button"
          className="mobile-nav-item"
          onClick={openCart}
          aria-label="Shopping Bag"
        >
          <div style={{ position: "relative", display: "inline-flex" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/>
              <circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            {itemCount > 0 && (
              <span className="mobile-cart-badge">
                {itemCount}
              </span>
            )}
          </div>
          <span>CART</span>
        </button>

        {/* 5. ACCOUNT */}
        <Link
          href={isLoggedIn ? "/account" : "/account/login"}
          onClick={handleAccountClick}
          className={`mobile-nav-item ${isAccount ? "active" : ""}`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>ACCOUNT</span>
        </Link>
      </nav>

      {/* Search Modal Drawer */}
      <MobileSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
