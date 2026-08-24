"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  TrendingUp,
  Shirt,
  FolderTree,
  Users,
  Tag,
  BellRing,
  Megaphone,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/admin/products", label: "Products", icon: Shirt },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/notify-requests", label: "Restock Waitlist", icon: BellRing },
  { href: "/admin/ads", label: "Ad Campaigns", icon: Megaphone },
  { href: "/admin/chats", label: "Support Chats", icon: MessageSquare },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-top">
        <div className="brand">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src="/images/logo-emblem-trimmed.png"
              alt="SANDLINE"
              style={{ width: "32px", height: "32px", objectFit: "contain" }}
            />
            <div className="brand-name">
              SANDLINE
              <span className="brand-badge">Admin Studio</span>
            </div>
          </div>
          <Link href="/" target="_blank" className="admin-mobile-store-link">
            <span className="admin-live-dot"></span>
            <span>Live Store ↗</span>
          </Link>
        </div>

        <nav className="admin-nav-group">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? "active" : ""}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="admin-sidebar-footer">
        <Link href="/" target="_blank" className="admin-store-link">
          <div className="admin-store-badge">
            <span className="admin-live-dot"></span>
            <span>Storefront Live</span>
          </div>
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </aside>
  );
}
