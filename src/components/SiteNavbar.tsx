"use client";

import Link from "next/link";
import CartLink from "@/components/CartLink";
import WishlistLink from "@/components/WishlistLink";
import AccountNavButton from "@/components/AccountNavButton";

interface SiteNavbarProps {
  currentPath?: string;
}

export default function SiteNavbar({ currentPath }: SiteNavbarProps) {
  return (
    <nav className="sandline-site-navbar">
      <Link className="logo brand-logo-wrap" href="/" aria-label="SANDLINE Home">
        <img
          src="/images/logo-horizontal.png"
          alt="SANDLINE Resort Wear"
          className="site-brand-logo"
        />
      </Link>

      <div className="nav-links">
        <Link href="/shop">Shop</Link>
        <Link href="/story">Story</Link>
        <Link href="/size-guide">Size Guide</Link>
        <Link href="/contact">Contact</Link>
        <WishlistLink />
        <AccountNavButton />
        <CartLink />
      </div>
    </nav>
  );
}
