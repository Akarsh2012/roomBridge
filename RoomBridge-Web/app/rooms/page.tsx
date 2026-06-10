"use client";

import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/common/PageTransition";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

const placeholderRooms = [
  { id: "1", title: "Cozy Studio in Bandra", price: 2500, location: "Mumbai", guests: 2, bedrooms: 1, rating: 4.9, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80" },
  { id: "2", title: "Sea-Facing Villa", price: 8000, location: "Goa", guests: 6, bedrooms: 3, rating: 4.8, img: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=900&q=80" },
  { id: "3", title: "Modern Flat in Delhi", price: 3500, location: "Delhi", guests: 4, bedrooms: 2, rating: 4.7, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80" },
  { id: "4", title: "Heritage Haveli Room", price: 4000, location: "Jaipur", guests: 2, bedrooms: 1, rating: 5.0, img: "https://images.unsplash.com/photo-1590490360182-c33d955e5b5e?auto=format&fit=crop&w=900&q=80" },
  { id: "5", title: "Luxury Penthouse", price: 6000, location: "Bangalore", guests: 4, bedrooms: 2, rating: 4.9, img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80" },
  { id: "6", title: "Beachside Cottage", price: 3000, location: "Pondicherry", guests: 2, bedrooms: 1, rating: 4.6, img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=900&q=80" },
];

const filters = ["All", "Beachfront", "Mountain", "City", "Heritage", "Luxury", "Budget"];

export default function RoomsPage() {
  const [active, setActive] = useState("All");

  return (
    <PageTransition>
      <Navbar />
      <main className="min-h-screen bg-ink text-paper">
        {/* Header */}
        <section className="relative overflow-hidden border-b border-line">
          <div className="glow -right-20 -top-24 h-80 w-96 opacity-40" aria-hidden />
          <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-16 md:px-8 md:pt-20">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-amber" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {placeholderRooms.length} stays available
              </span>
            </div>
            <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[0.98] tracking-tightest text-balance">
              Find your <span className="italic text-amber">stay</span>.
            </h1>
            <p className="mt-4 max-w-lg text-muted">
              Curated rooms across India — filtered to fit exactly what you&apos;re after.
            </p>

            {/* Search strip */}
            <div className="mt-8 max-w-3xl">
              <div className="glass flex flex-col gap-px overflow-hidden rounded-2xl sm:flex-row">
                <div className="flex flex-1 items-center gap-3 bg-ink/40 px-5 py-3.5">
                  <svg className="h-4 w-4 text-amber" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Where do you want to stay?"
                    className="w-full bg-transparent text-sm text-paper placeholder-faint outline-none"
                  />
                </div>
                <div className="p-2">
                  <button className="btn-amber w-full px-7 py-3 text-sm sm:w-auto">Search</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter chips */}
        <div className="sticky top-[72px] z-30 border-b border-line bg-ink/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-4 md:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  active === f
                    ? "border-amber bg-amber text-ink"
                    : "border-line text-muted hover:border-line-strong hover:text-paper"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {placeholderRooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 0.61, 0.36, 1] }}
                className="lift group overflow-hidden rounded-2xl border border-line bg-ink-2 hover:border-line-strong"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={room.img}
                    alt={room.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-2/80 via-transparent to-transparent" />
                  <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-3 py-1 font-mono text-xs text-amber backdrop-blur-md">
                    ₹{room.price.toLocaleString()}/night
                  </span>
                  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-medium text-paper backdrop-blur-md">
                    <span className="text-amber">★</span> {room.rating}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold">{room.title}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                    <svg className="h-3.5 w-3.5 text-amber" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {room.location}
                  </p>

                  <div className="mt-4 flex items-center gap-2 border-t border-line pt-4 font-mono text-xs text-faint">
                    <span>{room.guests} guests</span>
                    <span className="text-line-strong">·</span>
                    <span>{room.bedrooms} bed{room.bedrooms > 1 ? "s" : ""}</span>
                  </div>

                  <Link
                    href={`/rooms/${room.id}`}
                    className="btn-ghost mt-4 w-full py-2.5 text-sm"
                  >
                    View details
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
