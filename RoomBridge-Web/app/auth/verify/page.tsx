"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { sendOtp, verifyOtp } from "@/services/auth";

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

  // Redirect if not logged in or already verified
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin");
    }
    if (!isLoading && user?.emailVerified) {
      router.push("/rooms");
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // take last digit
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Backspace: clear current and go back
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
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
    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setVerifying(true);
    setError(null);
    try {
      await verifyOtp(code);
      setSuccess("Email verified! Redirecting...");
      setTimeout(() => {
        window.location.href = "/rooms";
      }, 1000);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Verification failed";
      // If already verified, just redirect
      if (message.includes("already verified")) {
        setSuccess("Email already verified! Redirecting...");
        setTimeout(() => {
          window.location.href = "/rooms";
        }, 1000);
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
      setSuccess("New OTP sent to your email!");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to resend OTP";
      setError(message);
    } finally {
      setSending(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary shadow-lg shadow-indigo-200 mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white">
              <path d="M3 21V9L12 3L21 9V21H15V14H9V21H3Z" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
          <p className="text-gray-500 mt-2 text-sm">
            We sent a 6-digit code to <span className="font-medium text-gray-700">{user?.email}</span>
          </p>
        </div>

        {/* OTP Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* OTP Input */}
          <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all outline-none
                  ${digit ? "border-brand-secondary bg-brand-light text-brand-primary" : "border-gray-200 bg-gray-50 text-gray-800"}
                  focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20`}
              />
            ))}
          </div>

          {/* Error / Success */}
          {error && (
            <p className="text-center text-sm text-red-600 bg-red-50 rounded-lg py-2 px-3 mb-4">{error}</p>
          )}
          {success && (
            <p className="text-center text-sm text-emerald-600 bg-emerald-50 rounded-lg py-2 px-3 mb-4">{success}</p>
          )}

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={verifying || otp.join("").length !== 6}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {verifying ? "Verifying..." : "Verify Email"}
          </button>

          {/* Resend */}
          <div className="text-center mt-5">
            <p className="text-sm text-gray-500">
              Didn&apos;t receive the code?{" "}
              {resendCooldown > 0 ? (
                <span className="text-gray-400">Resend in {resendCooldown}s</span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={sending}
                  className="text-brand-secondary font-medium hover:text-brand-primary transition"
                >
                  {sending ? "Sending..." : "Resend OTP"}
                </button>
              )}
            </p>
          </div>

          {/* Timer info */}
          <p className="text-center text-xs text-gray-400 mt-4">
            Code expires in 5 minutes
          </p>
        </div>
      </div>
    </div>
  );
}
