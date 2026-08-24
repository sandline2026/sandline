"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/../utils/supabase/client";
import "../../sandline.css";

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
    // Check if already logged in
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push(nextUrl);
      }
    }
    checkSession();
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
        <Link className="logo" href="/">
          SAND<span>LINE</span>
        </Link>
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
              {/* Google 1-Click Login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  background: "#FAF8F5",
                  border: "1px solid #EAE6DF",
                  color: "#1A1A1A",
                  padding: "14px 20px",
                  borderRadius: "14px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  marginBottom: "24px",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                  />
                </svg>
                Continue with Google (Gmail)
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  margin: "24px 0",
                  color: "#999",
                  fontSize: "12px",
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                <div style={{ flex: 1, height: "1px", background: "#EAE6DF" }} />
                <span>OR EMAIL OTP</span>
                <div style={{ flex: 1, height: "1px", background: "#EAE6DF" }} />
              </div>

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
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. chloe@domain.com"
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
                  }}
                >
                  {loading ? "Sending Code..." : "Send 6-Digit Code →"}
                </button>
              </form>
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
