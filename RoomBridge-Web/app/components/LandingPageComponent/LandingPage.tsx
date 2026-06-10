"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import ConnectSection from "../ConnectSection";
import ThemeToggle from "@/components/common/ThemeToggle";

/* ─── Motion presets ─────────────────────────────── */
const EASE = [0.22, 0.61, 0.36, 1] as const;

const rise = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: EASE },
  }),
};

/* ─── Counter ─────────────────────────────────────── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let cur = 0;
    const step = target / (1600 / 16);
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) {
        setN(target);
        clearInterval(t);
      } else setN(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [inView, target]);
  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Data ────────────────────────────────────────── */
const navItems = [
  { label: "Stays", href: "#featured" },
  { label: "Why", href: "#why" },
  { label: "Reviews", href: "#reviews" },
  { label: "Hosts", href: "#hosts" },
];

const cities = ["Goa", "Mumbai", "Jaipur", "Bangalore", "Manali", "Delhi", "Alleppey", "Pondicherry", "Udaipur"];

const stats = [
  { value: 500, suffix: "+", label: "Curated properties" },
  { value: 2000, suffix: "+", label: "Happy guests" },
  { value: 25, suffix: "+", label: "Cities covered" },
  { value: 1200, suffix: "+", label: "Five-star reviews" },
];

const features = [
  {
    no: "01",
    title: "Instant matchmaking",
    body: "Intelligent filters surface the right room for your budget, city, and dates — no endless scrolling.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  {
    no: "02",
    title: "Talk to verified hosts",
    body: "Message owners directly. Ask the real questions, get real answers, and book with confidence.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    ),
  },
  {
    no: "03",
    title: "Protected payments",
    body: "Encrypted transactions, instant receipts, and booking confirmations you can actually trust.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3M3.75 5.25h16.5a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5z" />
    ),
  },
  {
    no: "04",
    title: "Verified listings",
    body: "Every property is reviewed for authenticity before it goes live. What you see is what you stay in.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
];

const featured = [
  { title: "Deluxe Sea Suite", city: "Goa", price: 8000, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80" },
  { title: "Heritage Haveli", city: "Jaipur", price: 4000, img: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=900&q=80" },
  { title: "Skyline Loft", city: "Bangalore", price: 6000, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80" },
  { title: "Mountain Cabin", city: "Manali", price: 3000, img: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=900&q=80" },
];

const reviews = [
  { name: "Ananya Sharma", city: "Mumbai", rating: 5, text: "Found the perfect apartment in Bandra within hours. The host was incredibly responsive and the whole booking felt effortless.", date: "2 weeks ago" },
  { name: "Rohit Kapoor", city: "Delhi", rating: 5, text: "Booked a heritage haveli in Jaipur for a family trip. Photos were accurate, check-in was smooth, the rooftop views were unreal.", date: "1 month ago" },
  { name: "Meera Nair", city: "Bangalore", rating: 4, text: "Brilliant selection of stays in Goa. The filters made it genuinely easy to find a villa with a pool inside our budget.", date: "3 weeks ago" },
];

/* ─── Section helpers ─────────────────────────────── */
function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-10 flex items-center gap-4">
      <span className="eyebrow">{index}</span>
      <span className="h-px flex-1 bg-line" />
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{title}</span>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────── */
export default function LandingPage() {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, 120]);

  useEffect(() => {
    const onScroll = () => {
      const top = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? (top / docH) * 100 : 0);
      setScrolled(top > 40);
      setShowTop(top > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="relative overflow-x-clip bg-ink text-paper">
      {/* Scroll progress */}
      <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-amber" style={{ width: `${progress}%` }} aria-hidden />

      {/* ── Header ───────────────────────────────── */}
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="fixed inset-x-0 top-0 z-40 px-3 pt-3 md:pt-4"
      >
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border py-2 pl-3 pr-2 transition-all duration-500 ${
            scrolled
              ? "border-line bg-ink-2/80 shadow-lg backdrop-blur-xl"
              : "border-line/70 bg-ink-2/55 shadow-md backdrop-blur-xl"
          }`}
        >
          <Link href="#home" className="group flex items-center gap-2.5 pl-1">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-ink-3 ring-1 ring-line-strong">
              <span className="absolute inset-0 rounded-xl bg-amber/25 blur-md transition-all group-hover:bg-amber/40" aria-hidden />
              <svg viewBox="0 0 24 24" fill="none" className="relative h-5 w-5 text-amber">
                <path d="M3 21V9L12 3L21 9V21H15V14H9V21H3Z" fill="currentColor" />
              </svg>
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Room<span className="text-amber">Bridge</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 rounded-full border border-line bg-ink/40 p-1 lg:flex">
            {navItems.map((it) => (
              <a
                key={it.label}
                href={it.href}
                className="rounded-full px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-ink-3/70 hover:text-paper"
              >
                {it.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Link
              href="/auth/signin"
              className="rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-ink-3/70 hover:text-paper"
            >
              Sign in
            </Link>
            <Link href="/auth/signup" className="btn-amber group px-5 py-2.5 text-sm">
              Get started
              <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-full border border-line bg-ink-3/60 p-2.5" aria-label="Menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" /> : <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-2 max-w-6xl space-y-1 rounded-2xl border border-line bg-ink-2/90 p-3 shadow-xl backdrop-blur-xl md:hidden">
            {navItems.map((it) => (
              <a key={it.label} href={it.href} onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-2.5 font-medium text-paper hover:bg-ink-3/70">
                {it.label}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <Link href="/auth/signin" className="btn-ghost flex-1 py-2.5 text-sm" onClick={() => setMobileOpen(false)}>Sign in</Link>
              <Link href="/auth/signup" className="btn-amber flex-1 py-2.5 text-sm" onClick={() => setMobileOpen(false)}>Get started</Link>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* ── Hero ─────────────────────────────────── */}
      <section id="home" className="relative flex min-h-screen flex-col justify-center overflow-hidden pb-16 pt-28">
        {/* Glow pools */}
        <div className="glow -left-28 top-24 h-80 w-80 animate-pulseGlow" aria-hidden />
        <div className="glow right-0 top-1/4 h-[26rem] w-[26rem] opacity-70" aria-hidden />

        <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr]">
            {/* Left — copy */}
            <div>
              <motion.p custom={0} variants={rise} initial="hidden" animate="visible" className="eyebrow mb-6">
                01 — Find your stay
              </motion.p>

              <motion.h1
                custom={1}
                variants={rise}
                initial="hidden"
                animate="visible"
                className="font-display text-[clamp(2.6rem,6.4vw,5.25rem)] font-bold leading-[0.95] tracking-tightest text-balance"
              >
                Stay somewhere{" "}
                <span className="italic text-amber">extraordinary.</span>
              </motion.h1>

              <motion.p custom={2} variants={rise} initial="hidden" animate="visible" className="mt-7 max-w-md text-lg leading-relaxed text-muted">
                Curated rooms, verified hosts, and effortless booking across
                India. Your next stay is one search away.
              </motion.p>

              <motion.div custom={4} variants={rise} initial="hidden" animate="visible" className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-faint">
                {["No booking fees", "Verified hosts only", "Free cancellation"].map((t) => (
                  <span key={t} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                    {t}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right — interactive image composition */}
            <motion.div
              style={{ y: heroY }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
              className="group relative mx-auto h-[26rem] w-full max-w-md sm:h-[30rem] lg:h-[34rem] lg:max-w-none"
            >
              {/* Main image card */}
              <div className="lift absolute inset-0 overflow-hidden rounded-[2rem] border border-line">
                <Image
                  src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1400&q=80"
                  alt="A beautifully lit suite at dusk"
                  fill
                  priority
                  className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  sizes="(max-width:1024px) 90vw, 45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              </div>

              {/* Decorative dotted accent — behind, top right */}
              <div
                className="absolute -right-5 -top-5 -z-10 h-28 w-28 rounded-2xl border border-dashed border-amber/40"
                aria-hidden
              />

              {/* Secondary thumbnail — overlapping bottom-left for depth */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.7, ease: EASE }}
                style={{ animationDelay: "-3.2s" }}
                className="animate-floaty absolute -bottom-7 -left-7 hidden h-44 w-36 overflow-hidden rounded-2xl border-4 border-ink shadow-2xl sm:block lg:h-52 lg:w-40"
              >
                <Image
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80"
                  alt="A cozy studio"
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </motion.div>

              {/* Rating chip — top left */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6, ease: EASE }}
                className="animate-floaty absolute -left-3 top-10 flex items-center gap-3 rounded-2xl border border-line bg-ink-2 shadow-2xl p-3 pr-4 backdrop-blur-xl"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/15 text-lg text-amber">★</span>
                <div>
                  <p className="font-display text-lg font-bold leading-none text-paper">4.9</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Superhost</p>
                </div>
              </motion.div>

              {/* Price chip — bottom right */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6, ease: EASE }}
                style={{ animationDelay: "-2.4s" }}
                className="animate-floaty absolute -right-3 bottom-12 rounded-2xl border border-line bg-ink-2 shadow-2xl p-4 backdrop-blur-xl"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">From</p>
                <p className="mt-0.5 font-display text-xl font-bold leading-none text-paper">
                  ₹8,000
                  <span className="text-sm font-normal text-muted"> / night</span>
                </p>
                <p className="mt-1 text-xs text-muted">Deluxe Sea Suite · Goa</p>
              </motion.div>

              {/* Guest social proof — avatar stack, top right */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.6, ease: EASE }}
                style={{ animationDelay: "-1.2s" }}
                className="animate-floaty absolute right-5 top-5 flex items-center gap-2.5 rounded-full border border-line bg-ink-2 shadow-2xl py-1.5 pl-2 pr-4 backdrop-blur-xl"
              >
                <div className="flex -space-x-2">
                  {["A", "R", "M"].map((c, i) => (
                    <span
                      key={c}
                      className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink bg-amber text-[10px] font-bold text-ink"
                      style={{ zIndex: 3 - i }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-[11px] text-paper">2,000+ guests</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Reservation strip — full width */}
          <motion.div custom={3} variants={rise} initial="hidden" animate="visible" className="mt-14 max-w-4xl">
            <div className="glass grid grid-cols-1 gap-px overflow-hidden rounded-2xl sm:grid-cols-[1.4fr_1fr_0.9fr_auto]">
              <Field label="Where" placeholder="City or area" />
              <Field label="When" placeholder="Add dates" />
              <Field label="Guests" placeholder="2 guests" />
              <div className="p-2">
                <Link href="/rooms" className="btn-amber h-full w-full px-6 py-3.5 text-sm sm:w-auto">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                  </svg>
                  Search
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── City marquee ─────────────────────────── */}
      <div className="border-y border-line bg-ink-3/60 py-5">
        <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="flex shrink-0 animate-marquee items-center gap-12 pr-12">
            {[...cities, ...cities].map((c, i) => (
              <span key={i} className="flex items-center gap-12 font-display text-xl font-medium italic text-paper/45">
                {c}
                <span className="text-amber/60">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              variants={rise}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-ink px-6 py-10 text-center"
            >
              <p className="font-display text-5xl font-bold tracking-tight text-paper">
                <Counter target={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-muted">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Why / Features ───────────────────────── */}
      <section id="why" className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <SectionLabel index="02" title="Why RoomBridge" />
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div variants={rise} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.02] tracking-tight text-balance">
              Booking a room should feel like the easy part.
            </h2>
            <p className="mt-6 max-w-md text-muted">
              We obsess over the details so you don&apos;t have to — from the
              first search to the moment you unlock the door.
            </p>
            <Link href="/auth/signup" className="btn-ghost mt-8 px-6 py-3 text-sm">
              Start exploring
              <span aria-hidden>→</span>
            </Link>
          </motion.div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {features.map((f, i) => (
              <motion.div
                key={f.no}
                custom={i}
                variants={rise}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group relative bg-ink p-7 transition-colors duration-300 hover:bg-ink-2"
              >
                <span className="font-mono text-xs text-amber/70">{f.no}</span>
                <div className="mt-5 flex h-11 w-11 items-center justify-center rounded-xl bg-amber/10 text-amber ring-1 ring-amber/20 transition-transform duration-300 group-hover:-translate-y-1">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    {f.icon}
                  </svg>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured rooms ───────────────────────── */}
      <section id="featured" className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <SectionLabel index="03" title="Featured stays" />
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1] tracking-tight">
            Hand-picked this week
          </h2>
          <Link href="/rooms" className="hidden whitespace-nowrap text-sm font-medium text-amber transition-colors hover:text-amber-hi sm:block">
            View all stays →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((r, i) => (
            <motion.div
              key={r.title}
              custom={i}
              variants={rise}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lift group relative overflow-hidden rounded-2xl border border-line bg-ink-2"
            >
              <div className="relative h-64 overflow-hidden">
                <Image src={r.img} alt={r.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width:768px) 100vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
                <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-3 py-1 font-mono text-xs text-amber backdrop-blur-md">
                  ₹{r.price.toLocaleString()}/night
                </span>
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="font-display font-semibold">{r.title}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
                    <svg className="h-3.5 w-3.5 text-amber" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {r.city}
                  </p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors group-hover:border-amber group-hover:text-amber">
                  →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────── */}
      <section id="reviews" className="border-y border-line bg-ink-3/50">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8">
          <SectionLabel index="04" title="Guest stories" />
          <h2 className="mb-12 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.02] tracking-tight text-balance">
            Loved by travellers across the country.
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {reviews.map((rev, i) => (
              <motion.figure
                key={rev.name}
                custom={i}
                variants={rise}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="lift glass flex flex-col rounded-2xl p-7"
              >
                <div className="mb-4 flex gap-0.5 text-amber">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className={s < rev.rating ? "opacity-100" : "opacity-25"}>★</span>
                  ))}
                </div>
                <blockquote className="flex-1 text-[15px] leading-relaxed text-paper/85">
                  “{rev.text}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber font-bold text-ink">
                    {rev.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{rev.name}</p>
                    <p className="font-mono text-xs text-faint">{rev.city} · {rev.date}</p>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Connect (hosts/guests) ───────────────── */}
      <section id="hosts">
        <ConnectSection />
      </section>

      {/* ── Final CTA ────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-line">
        <div className="glow left-1/2 top-1/2 h-96 w-[50rem] -translate-x-1/2 -translate-y-1/2 opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-5 py-28 text-center md:px-8">
          <motion.h2 variants={rise} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.98] tracking-tightest text-balance">
            Your next stay is{" "}
            <span className="italic text-amber">one search</span> away.
          </motion.h2>
          <motion.p variants={rise} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mx-auto mt-6 max-w-md text-muted">
            Join thousands of guests and hosts already building better stays on RoomBridge.
          </motion.p>
          <motion.div variants={rise} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/auth/signup" className="btn-amber px-7 py-3.5 text-sm">Create your account</Link>
            <Link href="/rooms" className="btn-ghost px-7 py-3.5 text-sm">Browse stays</Link>
          </motion.div>
        </div>
      </section>

      {/* Back to top */}
      {showTop && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="glass fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full text-amber transition-colors hover:bg-ink-2 shadow-2xl"
          aria-label="Back to top"
        >
          ↑
        </motion.button>
      )}
    </main>
  );
}

/* Reservation strip field */
function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="group flex cursor-text flex-col gap-1 bg-ink/40 px-5 py-3.5 transition-colors hover:bg-ink/60">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber/80">{label}</span>
      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent text-sm text-paper placeholder-faint outline-none"
      />
    </label>
  );
}
