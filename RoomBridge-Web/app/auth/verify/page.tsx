"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { sendOtp, verifyOtp } from "@/services/auth";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function VerifyPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth/signin");
    if (!isLoading && user?.emailVerified) router.push("/rooms");
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setError(null);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) return setError("Please enter all 6 digits");
    setVerifying(true);
    setError(null);
    try {
      await verifyOtp(code);
      setSuccess("Email verified — taking you in…");
      setTimeout(() => (window.location.href = "/rooms"), 1000);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Verification failed";
      if (message.includes("already verified")) {
        setSuccess("Already verified — taking you in…");
        setTimeout(() => (window.location.href = "/rooms"), 1000);
        return;
      }
      setError(message);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || sending) return;
    setSending(true);
    setError(null);
    try {
      const data = await sendOtp();
      setResendCooldown(data.cooldown);
      setSuccess("A new code is on its way!");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to resend code");
    } finally {
      setSending(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5">
      <div className="absolute right-5 top-5 z-10">
        <ThemeToggle />
      </div>
      <div className="glow -top-20 left-1/2 h-72 w-96 -translate-x-1/2 animate-pulseGlow" aria-hidden />

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex">
            <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-3 ring-1 ring-line-strong">
              <span className="absolute inset-0 rounded-2xl bg-amber/20 blur-lg" aria-hidden />
              <svg viewBox="0 0 24 24" fill="none" className="relative h-7 w-7 text-amber">
                <path d="M3 21V9L12 3L21 9V21H15V14H9V21H3Z" fill="currentColor" />
              </svg>
            </span>
          </Link>
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">Verify your email</h1>
          <p className="mt-2 text-sm text-muted">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-paper">{user?.email}</span>
          </p>
        </div>

        <div className="glass rounded-3xl p-8">
          <div className="mb-6 flex justify-center gap-2.5 sm:gap-3" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.06 }}
                className={`h-14 w-11 rounded-xl border-2 text-center font-display text-xl font-bold outline-none transition-all sm:w-12 ${
                  digit
                    ? "border-amber bg-amber/10 text-amber"
                    : "border-line bg-ink-2 text-paper focus:border-amber/60"
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-center text-sm text-red-300">
              {error}
            </p>
          )}
          {success && (
            <p className="mb-4 rounded-xl border border-amber/25 bg-amber/10 px-4 py-2.5 text-center text-sm text-amber">
              {success}
            </p>
          )}

          <button
            onClick={handleVerify}
            disabled={verifying || otp.join("").length !== 6}
            className="btn-amber w-full py-3.5 text-sm disabled:opacity-50"
          >
            {verifying ? "Verifying…" : "Verify email"}
          </button>

          <div className="mt-5 text-center text-sm text-muted">
            Didn&apos;t get the code?{" "}
            {resendCooldown > 0 ? (
              <span className="font-mono text-faint">resend in {resendCooldown}s</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={sending}
                className="font-semibold text-amber transition-colors hover:text-amber-hi"
              >
                {sending ? "Sending…" : "Resend code"}
              </button>
            )}
          </div>

          <p className="mt-4 text-center font-mono text-xs tracking-wide text-faint">
            Code expires in 5 minutes
          </p>
        </div>
      </motion.div>
    </div>
  );
}
