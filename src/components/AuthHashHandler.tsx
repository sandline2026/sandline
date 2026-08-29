"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/../utils/supabase/client";

export default function AuthHashHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    async function handleHashAuth() {
      if (typeof window === "undefined") return;

      const hash = window.location.hash;
      if (!hash || !hash.includes("access_token")) return;

      try {
        const hashParams = new URLSearchParams(hash.substring(1));
        const access_token = hashParams.get("access_token");
        const refresh_token = hashParams.get("refresh_token");

        if (access_token && refresh_token) {
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (!error && data.session) {
            // Clean hash from address bar
            window.history.replaceState(
              null,
              "",
              window.location.pathname + window.location.search
            );

            // Sync customer row
            if (data.session.user?.email) {
              const email = data.session.user.email;
              const { data: existing } = await supabase
                .from("customers")
                .select("id")
                .eq("email", email)
                .maybeSingle();

              if (!existing) {
                await supabase.from("customers").insert({
                  email,
                  full_name: data.session.user.user_metadata?.full_name || email.split("@")[0],
                  acquisition_source: "magic_link",
                });
              }
            }

            // If on login page or home page with access_token, route smoothly to account
            if (pathname === "/account/login") {
              router.push("/account");
            } else {
              router.refresh();
            }
          }
        }
      } catch (err) {
        console.error("Error processing auth hash:", err);
      }
    }

    handleHashAuth();
  }, [pathname, router, supabase]);

  return null;
}
