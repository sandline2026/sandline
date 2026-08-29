"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SiteNavbar from "@/components/SiteNavbar";
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
      // 1. Send direct Supabase 1-Click Magic Link
      await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
          shouldCreateUser: true,
        },
      });

      // 2. Also trigger luxury email in parallel
      fetch("/api/auth/send-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      }).catch(() => {});

      setStep("otp");
      setMessage(`Magic Sign-In link sent to ${email.trim().toLowerCase()}!`);
      setResendTimer(60);
    } catch (err: any) {
      setError(err.message || "Failed to send link. Please try again.");
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
      const res = await fetch("/api/auth/verify-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Invalid or expired access code.");
      }

      setMessage("Verified successfully! Redirecting...");
      setTimeout(() => {
        router.push(nextUrl);
      }, 500);
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
      const { data, error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
          skipBrowserRedirect: true,
        },
      });
      if (googleError) throw googleError;

      if (data?.url) {
        try {
          const testRes = await fetch(data.url);
          if (!testRes.ok) {
            const resJson = await testRes.json().catch(() => null);
            if (resJson?.msg && resJson.msg.includes("provider is not enabled")) {
              setError("Google Sign-In is being activated in Supabase. Please enter your email above for instant 1-tap OTP login!");
              setLoading(false);
              return;
            }
          }
        } catch {}

        window.location.href = data.url;
      }
    } catch (err: any) {
      setError("Please enter your email above for instant 1-tap verification code login!");
      setLoading(false);
    }
  }

  return (
    <div className="sandline-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteNavbar currentPath="/account/login" />

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
                  {loading ? "Sending Magic Link..." : "Send 1-Click Sign-In Link →"}
                </button>
              </form>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
                <div style={{ flex: 1, height: "1px", background: "#EAE6DF" }}></div>
                <span style={{ fontSize: "11px", color: "#999", fontFamily: "'Space Mono', monospace" }}>OR</span>
                <div style={{ flex: 1, height: "1px", background: "#EAE6DF" }}></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{
                  width: "100%",
                  background: "white",
                  color: "#1A1A1A",
                  padding: "13px 20px",
                  borderRadius: "30px",
                  fontSize: "13.5px",
                  fontWeight: "500",
                  border: "1px solid #D5D1CA",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "all 0.2s ease",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google (1-Click)
              </button>

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
                <span>No password needed. You will receive an instant 1-click login link in your inbox.</span>
              </div>
            </div>
          ) : (
            /* Step 2: Magic Link Sent Confirmation */
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div style={{ fontSize: "44px", marginBottom: "12px" }}>✉️</div>
              <h2 style={{ fontSize: "20px", color: "#111827", marginBottom: "8px", fontFamily: "Georgia, serif" }}>
                Sign-In Link Sent!
              </h2>
              <p style={{ fontSize: "14px", color: "#4B5563", lineHeight: "1.6", marginBottom: "24px" }}>
                We sent a 1-click magic link to <strong>{email}</strong>.<br/>
                Open your email and click <strong>&quot;Sign in&quot;</strong> to login instantly without entering any code!
              </p>

              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  textDecoration: "none",
                  padding: "15px 32px",
                  background: "#111827",
                  color: "white",
                  borderRadius: "30px",
                  fontWeight: "600",
                  fontSize: "14px",
                  marginBottom: "24px",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                }}
              >
                Open Gmail Inbox →
              </a>

              <div style={{ background: "#FAF8F5", border: "1px solid #EAE6DF", borderRadius: "14px", padding: "18px", marginTop: "10px" }}>
                <p style={{ fontSize: "12.5px", color: "#666", margin: "0 0 12px" }}>
                  Or enter your 6-digit access code below:
                </p>
                <form onSubmit={handleVerifyOtp} style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    maxLength={8}
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\s+/g, ""))}
                    style={{
                      flex: 1,
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: "1px solid #D5D1CA",
                      fontSize: "18px",
                      letterSpacing: "4px",
                      textAlign: "center",
                      fontFamily: "'Space Mono', monospace",
                      outline: "none",
                      background: "white",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: "#111827",
                      color: "white",
                      padding: "12px 20px",
                      borderRadius: "10px",
                      border: "none",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    {loading ? "..." : "Verify"}
                  </button>
                </form>
              </div>

              <div style={{ marginTop: "20px", fontSize: "13px", color: "#666" }}>
                <span>Didn&apos;t receive email? </span>
                <button
                  type="button"
                  disabled={resendTimer > 0 || loading}
                  onClick={handleSendOtp}
                  style={{
                    background: "none",
                    border: "none",
                    color: resendTimer > 0 ? "#999" : "#8C6D58",
                    fontWeight: "600",
                    cursor: resendTimer > 0 ? "not-allowed" : "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {resendTimer > 0 ? `Resend link in ${resendTimer}s` : "Resend Link"}
                </button>
              </div>
            </div>
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