"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const cards = [
  {
    tag: "For hosts",
    img: "/owner.png",
    title: "List your space, reach the right guests",
    body: "Publish a listing in minutes, manage inquiries in one place, and earn from your spare room — with verified guests only.",
    cta: "Become a host",
  },
  {
    tag: "For guests",
    img: "/tenant.png",
    title: "Discover a stay that actually fits",
    body: "Browse curated listings, message hosts directly, and lock in your perfect room or apartment — no surprises at check-in.",
    cta: "Find your stay",
  },
];

export default function ConnectSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
      <div className="mb-12 flex items-center gap-4">
        <span className="eyebrow">05</span>
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Two sides, one platform</span>
      </div>

      <h2 className="mb-12 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.02] tracking-tight text-balance">
        Whichever side you&apos;re on, RoomBridge has you covered.
      </h2>

      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((c, i) => (
          <motion.article
            key={c.tag}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 0.61, 0.36, 1] }}
            className="lift group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-ink-2"
          >
            <div className="relative h-60 overflow-hidden md:h-72">
              <Image
                src={c.img}
                alt={c.tag}
                fill
                className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width:768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/30 to-transparent" />
              <span className="eyebrow absolute left-5 top-5 rounded-full bg-ink/80 px-3 py-1.5 ring-1 ring-line backdrop-blur-md">
                {c.tag}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-7">
              <h3 className="font-display text-2xl font-semibold leading-tight">{c.title}</h3>
              <p className="mt-3 text-muted">{c.body}</p>
              <Link
                href="/auth/signup"
                className="btn-amber mt-7 w-fit px-6 py-3 text-sm"
              >
                {c.cta}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
