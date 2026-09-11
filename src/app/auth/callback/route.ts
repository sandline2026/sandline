import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/../utils/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";

import crypto from "crypto";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");
  const token = searchParams.get("token");
  const next = searchParams.get("next") ?? "/account";

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Handle 1-Click Magic Link from Sandline Studio Resend email
  if (email && otp && token) {
    const OTP_SECRET = process.env.ADMIN_PASSWORD || "sandline_secret_otp_key_2026";
    const [expiresAtStr, hash] = token.split(":");
    const expiresAt = parseInt(expiresAtStr, 10);

    if (expiresAt && Date.now() <= expiresAt) {
      const cleanEmail = email.toLowerCase().trim();
      const payload = `${cleanEmail}:${otp.trim()}:${expiresAt}`;
      const expectedHash = crypto.createHmac("sha256", OTP_SECRET).update(payload).digest("hex");

      if (hash === expectedHash) {
        // Ensure customer row exists
        const { data: existingCustomer } = await supabase
          .from("customers")
          .select("id")
          .eq("email", cleanEmail)
          .maybeSingle();

        if (!existingCustomer) {
          await supabase.from("customers").insert({
            email: cleanEmail,
            full_name: cleanEmail.split("@")[0],
            acquisition_source: "magic_link",
          });
        }

        const response = NextResponse.redirect(`${origin}${next}`);
        response.cookies.set("sandline_user_email", cleanEmail, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: "/",
        });
        return response;
      }
    }
  }

  // 2. Handle native Supabase OAuth / PKCE code
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 3. Handle native Supabase token_hash
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to login with instructions
  return NextResponse.redirect(`${origin}/account/login?error=auth_failed`);
}
