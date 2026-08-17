"use client";

import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/ads", label: "Ad Campaigns" },
  { href: "/admin/chats", label: "Chats" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="brand">
        <span className="dot"></span>
        Sandline Admin
      </div>
      <nav className="admin-nav-group">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <a key={link.href} href={link.href} className={isActive ? "active" : ""}>
              {link.label}
            </a>
          );
        })}
      </nav>
      <div className="back-link">
        <a href="/">Back to site</a>
      </div>
    </aside>
  );
}
