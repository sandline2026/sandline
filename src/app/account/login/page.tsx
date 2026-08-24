"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/../utils/supabase/client";
import "@/app/sandline.css";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/account";

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    // Check if already logged in or gets logged in via email link
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push(nextUrl);
      }
    }
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push(nextUrl);
      }
    });

    return () => subscription.unsubscribe();
  }, [nextUrl, router, supabase.auth]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
        },
      });

      if (otpError) throw otpError;

      setStep("otp");
      setMessage(`A 6-digit access code was sent to ${email.trim().toLowerCase()}`);
      setResendTimer(60);
    } catch (err: any) {
      setError(err.message || "Failed to send access code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp.trim(),
        type: "email",
      });

      if (verifyError) throw verifyError;

      // Ensure a customer row exists in customers table
      if (data.user) {
        const { data: existingCustomer } = await supabase
          .from("customers")
          .select("id")
          .eq("email", data.user.email)
          .maybeSingle();

        if (!existingCustomer) {
          await supabase.from("customers").insert({
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || email.split("@")[0],
            acquisition_source: "account_signup",
          });
        }
      }

      router.push(nextUrl);
    } catch (err: any) {
      setError(err.message || "Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError("");
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
        },
      });
      if (googleError) throw googleError;
    } catch (err: any) {
      setError(err.message || "Google login could not be initiated.");
      setLoading(false);
    }
  }

  return (
    <div className="sandline-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav>
        <Link className="logo brand-logo-wrap" href="/"><img src="/images/logo-horizontal.png" alt="SANDLINE Resort Wear" className="site-brand-logo" /></Link>
        <div className="nav-links">
          <Link href="/shop">Shop</Link>
          <Link href="/size-guide">Size Guide</Link>
          <Link href="/story">Story</Link>
          <Link href="/cart">Cart</Link>
        </div>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "140px 24px 80px" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "440px",
            background: "white",
            border: "1px solid #EAE6DF",
            borderRadius: "24px",
            padding: "44px 36px",
            boxShadow: "0 20px 45px -10px rgba(27, 36, 32, 0.08)",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                letterSpacing: "1.5px",
                color: "#8C6D58",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "8px",
              }}
            >
              CLIENT PORTAL &amp; CONCIERGE
            </span>
            <h1
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "30px",
                color: "#1A1A1A",
                margin: "0 0 8px",
                fontWeight: "500",
              }}
            >
              {step === "email" ? "Sign In to Sandline." : "Enter Access Code."}
            </h1>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.5", margin: 0 }}>
              {step === "email"
                ? "Access your live orders, express tracking, saved sizes & VIP wishlist."
                : `We sent a 6-digit code to ${email}`}
            </p>
          </div>

          {error && (
            <div
              style={{
                background: "#FDF2F2",
                border: "1px solid #F8B4B4",
                color: "#9B1C1C",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "13.5px",
                marginBottom: "20px",
                lineHeight: "1.4",
              }}
            >
              {error}
            </div>
          )}

          {message && (
            <div
              style={{
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                color: "#166534",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "13.5px",
                marginBottom: "20px",
                lineHeight: "1.4",
              }}
            >
              ✓ {message}
            </div>
          )}

          {step === "email" ? (
            <div>
              {/* Email Form */}
              <form onSubmit={handleSendOtp}>
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "11px",
                      letterSpacing: "0.5px",
                      color: "#1A1A1A",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                    }}
                  >
                    Enter Your Email (Gmail / Any Email)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: "12px",
                      border: "1px solid #D5D1CA",
                      fontSize: "15px",
                      fontFamily: "'Work Sans', sans-serif",
                      outline: "none",
                      background: "#FAF8F5",
                      color: "#1A1A1A",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    background: "#1A1A1A",
                    color: "white",
                    padding: "15px 24px",
                    borderRadius: "30px",
                    fontSize: "14px",
                    fontWeight: "600",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "'Space Mono', monospace",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                  }}
                >
                  {loading ? "Sending Code..." : "Send 6-Digit Access Code →"}
                </button>
              </form>

              <div
                style={{
                  marginTop: "24px",
                  padding: "14px 16px",
                  background: "#FAF8F5",
                  borderRadius: "12px",
                  border: "1px solid #EAE6DF",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "12.5px",
                  color: "#666",
                }}
              >
                <span>⚡</span>
                <span>No password required. You will receive an instant 6-digit verification code in your email inbox.</span>
              </div>
            </div>
          ) : (
            /* Step 2: OTP Verification */
            <form onSubmit={handleVerifyOtp}>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "11px",
                      letterSpacing: "0.5px",
                      color: "#1A1A1A",
                      textTransform: "uppercase",
                    }}
                  >
                    6-Digit Code
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setOtp("");
                      setError("");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#8C6D58",
                      fontSize: "12px",
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: 0,
                    }}
                  >
                    Change Email
                  </button>
                </div>
                <input
                  type="text"
                  required
                  maxLength={8}
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\s+/g, ""))}
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    border: "1px solid #D5D1CA",
                    fontSize: "22px",
                    letterSpacing: "8px",
                    textAlign: "center",
                    fontFamily: "'Space Mono', monospace",
                    outline: "none",
                    background: "#FAF8F5",
                    color: "#1A1A1A",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  background: "#1A1A1A",
                  color: "white",
                  padding: "15px 24px",
                  borderRadius: "30px",
                  fontSize: "14px",
                  fontWeight: "600",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Space Mono', monospace",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                {loading ? "Verifying..." : "Verify & Access Dashboard →"}
              </button>

              <div style={{ textAlign: "center", fontSize: "13px", color: "#777" }}>
                {resendTimer > 0 ? (
                  <span>Resend code in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#1A1A1A",
                      fontWeight: "600",
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: 0,
                    }}
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Bottom Security Note */}
          <div
            style={{
              marginTop: "28px",
              paddingTop: "20px",
              borderTop: "1px solid #EAE6DF",
              textAlign: "center",
              fontSize: "12px",
              color: "#888",
            }}
          >
            🔒 Passwordless 256-bit encrypted authentication.
            <br />
            Need help? <Link href="/contact" style={{ color: "#1A1A1A", textDecoration: "underline" }}>Contact Concierge</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="sandline-page" style={{ padding: "160px 24px", textAlign: "center" }}>Loading portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}