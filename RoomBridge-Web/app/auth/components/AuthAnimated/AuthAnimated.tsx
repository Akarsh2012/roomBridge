"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/common/ThemeToggle";

type Mode = "login" | "register";

const EASE = [0.22, 0.61, 0.36, 1] as const;

const valueProps = [
  "Verified hosts and authentic listings only",
  "No booking fees, ever",
  "Free cancellation on most stays",
];

export default function AuthAnimated({ initialMode = "login" }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, register } = useAuth();

  const isLogin = mode === "login";

  function validate() {
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!isLogin && name.trim().length < 2) return "Please tell us your name";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);

    setLoading(true);
    try {
      if (isLogin) {
        const user = await login({ email, password });
        router.push(user.emailVerified ? "/rooms" : "/auth/verify");
      } else {
        await register({ name, email, password });
        router.push("/auth/verify");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Something went wrong");
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(isLogin ? "register" : "login");
    setError(null);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* ── Brand panel ─────────────────────────── */}
      <aside className="relative hidden overflow-hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=80"
          alt="A warm, beautifully lit room"
          fill
          priority
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/45" />
        <div className="glow -left-10 top-20 h-72 w-72 animate-pulseGlow" aria-hidden />

        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex w-fit items-center gap-2.5">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-ink-3 ring-1 ring-line-strong">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-amber">
                <path d="M3 21V9L12 3L21 9V21H15V14H9V21H3Z" fill="currentColor" />
              </svg>
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Room<span className="text-amber">Bridge</span>
            </span>
          </Link>

          <div>
            <p className="eyebrow mb-5">Your stay starts here</p>
            <h2 className="max-w-md font-display text-5xl font-bold leading-[1] tracking-tightest text-balance">
              Stay somewhere <span className="italic text-amber">extraordinary.</span>
            </h2>
            <ul className="mt-8 space-y-3">
              {valueProps.map((v) => (
                <li key={v} className="flex items-center gap-3 text-sm text-paper/80">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber/15 text-amber">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  {v}
                </li>
              ))}
            </ul>
          </div>

          <p className="font-mono text-xs tracking-wide text-faint">
            © {new Date().getFullYear()} RoomBridge — Made in India
          </p>
        </div>
      </aside>

      {/* ── Form panel ──────────────────────────── */}
      <main className="relative flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="absolute right-5 top-5 z-10">
          <ThemeToggle />
        </div>
        <div className="glow -right-20 bottom-0 h-64 w-64 opacity-30 lg:hidden" aria-hidden />

        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="mb-10 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-3 ring-1 ring-line-strong">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-amber">
                <path d="M3 21V9L12 3L21 9V21H15V14H9V21H3Z" fill="currentColor" />
              </svg>
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Room<span className="text-amber">Bridge</span>
            </span>
          </Link>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <p className="eyebrow mb-3">{isLogin ? "Welcome back" : "Get started"}</p>
              <h1 className="font-display text-4xl font-bold tracking-tight">
                {isLogin ? "Sign in" : "Create account"}
              </h1>
              <p className="mt-2 text-sm text-muted">
                {isLogin ? "Pick up right where you left off." : "Join RoomBridge in under a minute."}
              </p>

              <form onSubmit={onSubmit} className="mt-8 space-y-4">
                {!isLogin && (
                  <Input id="name" label="Full name" type="text" value={name} onChange={setName} placeholder="Akarsh Sharma" autoComplete="name" />
                )}
                <Input id="email" label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" autoComplete="email" />

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="password" className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      Password
                    </label>
                    {isLogin && (
                      <a href="#" className="text-xs text-amber transition-colors hover:text-amber-hi">
                        Forgot?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      className="w-full rounded-xl border border-line bg-ink-2 px-4 py-3 pr-11 text-sm text-paper placeholder-faint outline-none transition-colors focus:border-amber/60"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-faint transition-colors hover:text-paper"
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.22A10.48 10.48 0 001.93 12C3.23 16.06 7.31 19 12 19c1.4 0 2.74-.26 3.97-.74M6.23 6.23A10.45 10.45 0 0112 5c4.69 0 8.77 2.94 10.07 7a10.52 10.52 0 01-4.3 5.06M6.23 6.23L3 3m3.23 3.23l3.65 3.65m7.89 7.89L21 21m-3.23-3.23l-3.65-3.65m0 0a3 3 0 10-4.24-4.24" /></svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.04 12C3.34 7.94 7.42 5 12 5s8.66 2.94 9.96 7c-1.3 4.06-5.38 7-9.96 7s-8.66-2.94-9.96-7z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300"
                  >
                    {error}
                  </motion.p>
                )}

                <button type="submit" disabled={loading} className="btn-amber w-full py-3.5 text-sm disabled:opacity-60">
                  {loading ? (isLogin ? "Signing in…" : "Creating account…") : isLogin ? "Sign in" : "Create account"}
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-muted">
                {isLogin ? "New to RoomBridge?" : "Already have an account?"}{" "}
                <button onClick={switchMode} className="font-semibold text-amber transition-colors hover:text-amber-hi">
                  {isLogin ? "Create an account" : "Sign in"}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function Input({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-line bg-ink-2 px-4 py-3 text-sm text-paper placeholder-faint outline-none transition-colors focus:border-amber/60"
        required
      />
    </div>
  );
}
