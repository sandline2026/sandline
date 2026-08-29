"use client";

import { useState, useEffect } from "react";
import { useAuthModal } from "@/context/AuthModalContext";
import { createClient } from "@/../utils/supabase/client";

export default function QuickAuthModal() {
  const { isOpen, closeAuthModal } = useAuthModal();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [notifyConsent, setNotifyConsent] = useState(true);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        closeAuthModal();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeAuthModal]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Reset states on modal close
      setOtpSent(false);
      setOtpCode("");
      setErrorMsg("");
      setSuccessMsg("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Auto-detect login when user clicks "Sign In" link in email
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && isOpen) {
        setSuccessMsg("Logged in successfully! Welcome back.");
        setTimeout(() => {
          closeAuthModal();
        }, 600);
      }
    });

    if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          setSuccessMsg("Logged in successfully! Welcome back.");
          setTimeout(() => {
            closeAuthModal();
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
          }, 600);
        }
      });
    }

    return () => subscription.unsubscribe();
  }, [isOpen, closeAuthModal, supabase]);

  async function handleSendEmailLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid Gmail / Email address.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      // 1. Send direct Supabase 1-Click Magic Link
      await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
          shouldCreateUser: true,
        },
      });

      // 2. Trigger luxury email code via Resend in parallel
      fetch("/api/auth/send-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      }).catch(() => {});

      setOtpSent(true);
      setSuccessMsg(`Magic Link sent to ${email.trim().toLowerCase()}!`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send link";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setErrorMsg("Please enter the 6-digit access code.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otpCode.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Invalid or expired access code.");
      }

      setSuccessMsg("Logged in successfully!");
      setTimeout(() => {
        closeAuthModal();
        window.location.reload();
      }, 700);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Verification failed";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setErrorMsg("");
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        try {
          const testRes = await fetch(data.url);
          if (!testRes.ok) {
            const resJson = await testRes.json().catch(() => null);
            if (resJson?.msg && resJson.msg.includes("provider is not enabled")) {
              setErrorMsg("Google Sign-In is active via Email Link above. Enter your Gmail for instant 1-click login!");
              setLoading(false);
              return;
            }
          }
        } catch {
          // If CORS prevents pre-flight, proceed normally
        }

        window.location.href = data.url;
      }
    } catch (err: unknown) {
      setErrorMsg("Please enter your Gmail / Email above for instant 1-click login!");
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="auth-modal-backdrop" onClick={closeAuthModal}>
      <div
        className="auth-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          className="auth-modal-close"
          onClick={closeAuthModal}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Left Side: Brand Promo Panel */}
        <div className="auth-modal-brand-side">
          <div className="brand-side-logo-wrap">
            <img
              src="/images/logo-white-trimmed.png"
              alt="SANDLINE"
              className="brand-side-logo"
            />
          </div>

          <div className="brand-side-content">
            <h3 className="brand-side-heading">
              Login now to avail best offers!
            </h3>
            <p className="brand-side-sub">
              Access member-only resort drops, instant 10% coupon codes, and 1-tap checkout.
            </p>

            <div className="brand-side-perks">
              <div className="brand-perk-pill">
                <span>🎁</span> <span>10% OFF First Order (`NEW10`)</span>
              </div>
              <div className="brand-perk-pill">
                <span>🏷️</span> <span>Extra 5% OFF on Prepaid Orders</span>
              </div>
              <div className="brand-perk-pill">
                <span>✈️</span> <span>Express Tracked Worldwide Delivery</span>
              </div>
            </div>
          </div>

          <div className="brand-side-watermark">
            SANDLINE
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="auth-modal-form-side">
          {!otpSent ? (
            /* Step 1: Input Email + Google Sign-In */
            <form onSubmit={handleSendEmailLink} className="auth-input-form" style={{ marginTop: "10px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "11px",
                    letterSpacing: "0.5px",
                    color: "#111827",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  Enter Your Email (Gmail / Any Email)
                </label>
                <div className="auth-email-input-wrap">
                  <input
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="email-field"
                    autoFocus
                    required
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: "12px",
                      border: "1px solid #D5D1CA",
                      fontSize: "15px",
                      background: "#FAF8F5",
                      color: "#111827",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              {errorMsg && <p className="auth-error-msg">{errorMsg}</p>}
              {successMsg && <p className="auth-success-msg">{successMsg}</p>}

              <button
                type="submit"
                className="btn-auth-submit"
                disabled={loading}
                style={{
                  width: "100%",
                  background: "#111827",
                  color: "#FFFFFF",
                  padding: "15px 24px",
                  borderRadius: "30px",
                  fontSize: "13.5px",
                  fontWeight: "700",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'Space Mono', monospace",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                {loading ? "Sending Link..." : "Send 1-Click Sign-In Link →"}
              </button>

              {/* Notification Consent Checkbox */}
              <label className="auth-consent-label" style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#666" }}>
                <input
                  type="checkbox"
                  checked={notifyConsent}
                  onChange={(e) => setNotifyConsent(e.target.checked)}
                />
                <span>
                  Notify me with offers &amp; updates{" "}
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#111827", textDecoration: "underline" }}>
                    Read details
                  </a>
                </span>
              </label>
            </form>
          ) : (
            /* Step 2: Sign-In Link Sent & 1-Tap Gmail Button */
            <div style={{ textAlign: "center", padding: "10px 0 10px" }}>
              <div style={{ fontSize: "44px", marginBottom: "12px" }}>✉️</div>
              <h4 style={{ fontSize: "20px", fontWeight: "600", color: "#111827", marginBottom: "8px", fontFamily: "Georgia, serif" }}>
                Sign-In Link Sent!
              </h4>
              <p style={{ fontSize: "14px", color: "#4B5563", lineHeight: "1.6", marginBottom: "20px" }}>
                We sent a 1-click magic link to <strong>{email}</strong>.<br/>
                Open your email and click <strong>&quot;Sign in&quot;</strong> to login instantly!
              </p>

              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  textDecoration: "none",
                  padding: "14px 32px",
                  background: "#111827",
                  color: "#FFFFFF",
                  borderRadius: "30px",
                  fontWeight: "700",
                  fontSize: "14px",
                  marginBottom: "20px",
                  fontFamily: "'Space Mono', monospace",
                  letterSpacing: "0.5px",
                }}
              >
                Open Gmail Inbox ↗
              </a>

              {/* Optional 6-digit access code verify box */}
              <div style={{ background: "#FAF8F5", border: "1px solid #EAE6DF", borderRadius: "14px", padding: "16px", marginTop: "10px" }}>
                <p style={{ fontSize: "12px", color: "#666", margin: "0 0 10px" }}>
                  Or enter your 6-digit access code:
                </p>
                <form onSubmit={handleVerifyOtp} style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\s+/g, ""))}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "1px solid #D5D1CA",
                      fontSize: "16px",
                      letterSpacing: "3px",
                      textAlign: "center",
                      fontFamily: "'Space Mono', monospace",
                      background: "#FFFFFF",
                      color: "#111827",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: "#111827",
                      color: "#FFFFFF",
                      padding: "10px 18px",
                      borderRadius: "10px",
                      border: "none",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    {loading ? "..." : "Verify"}
                  </button>
                </form>
              </div>

              {errorMsg && <p className="auth-error-msg" style={{ marginTop: "12px" }}>{errorMsg}</p>}
              {successMsg && <p className="auth-success-msg" style={{ marginTop: "12px" }}>{successMsg}</p>}

              <div className="otp-resend-row" style={{ marginTop: "16px", fontSize: "12.5px", color: "#666" }}>
                <span>Didn&apos;t receive link? </span>
                <button
                  type="button"
                  onClick={handleSendEmailLink}
                  disabled={loading}
                  className="resend-otp-btn"
                  style={{ background: "none", border: "none", color: "#D97706", fontWeight: "700", cursor: "pointer", textDecoration: "underline" }}
                >
                  Resend Email
                </button>
              </div>
            </div>
          )}

          {/* Secure Badge */}
          <div className="auth-modal-footer-badge" style={{ marginTop: "24px" }}>
            <span>🔒 256-Bit SSL Encrypted</span>
            <span>•</span>
            <span>Powered by <strong>Sandline Pass</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
