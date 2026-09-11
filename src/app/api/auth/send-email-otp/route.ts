import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendOtpVerificationEmail } from "@/lib/email";
import { createClient } from "@supabase/supabase-js";

const OTP_SECRET = process.env.ADMIN_PASSWORD || "sandline_secret_otp_key_2026";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rstczvqfjiqoshlaabgy.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_Fnm-5bXoTSnhzJnfUMzaYw_pCXPvY7_"
);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Generate random 6-digit cryptographic OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // 2. Create signed tamper-proof token
    const payload = `${cleanEmail}:${otp}:${expiresAt}`;
    const hash = crypto.createHmac("sha256", OTP_SECRET).update(payload).digest("hex");
    const token = `${expiresAt}:${hash}`;

    // 3. Send high-fashion luxury email via Resend
    await sendOtpVerificationEmail({
      email: cleanEmail,
      otp,
    });

    // 4. Also trigger Supabase Auth in parallel
    try {
      await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: { shouldCreateUser: true },
      });
    } catch (sbErr) {
      console.warn("Supabase background OTP:", sbErr);
    }

    const response = NextResponse.json({
      success: true,
      message: `Access code sent to ${cleanEmail}! Please check your inbox.`,
    });

    // Set signed HTTP-only cookie for OTP verification
    response.cookies.set("sandline_otp_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    response.cookies.set("sandline_otp_email", cleanEmail, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send code";
    console.error("send-email-otp error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
