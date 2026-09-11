"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/../utils/supabase/client";
import { useAuthModal } from "@/context/AuthModalContext";

export default function AccountNavButton() {
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const { openAuthModal } = useAuthModal();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const email = session.user.email;
        const name = session.user.user_metadata?.full_name || email.split("@")[0];
        setUser({ email, name });
        return;
      }

      if (typeof document !== "undefined") {
        const match = document.cookie.match(/(?:^|; )sandline_user_email=([^;]*)/);
        if (match && match[1]) {
          const email = decodeURIComponent(match[1]).toLowerCase();
          const name = email.split("@")[0];
          setUser({ email, name });
          return;
        }
      }

      setUser(null);
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        const email = session.user.email;
        const name = session.user.user_metadata?.full_name || email.split("@")[0];
        setUser({ email, name });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (user) {
    return (
      <Link href="/account" className="nav-account-link" style={{ color: "inherit", textDecoration: "none" }}>
        <span>ACCOUNT 👤</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="nav-auth-btn"
      onClick={() => openAuthModal("phone")}
      aria-label="Open Login & Offers"
    >
      <span>LOGIN 👤</span>
    </button>
  );
}
