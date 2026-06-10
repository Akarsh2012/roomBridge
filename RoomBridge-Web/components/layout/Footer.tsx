import Link from "next/link";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Browse stays", href: "/rooms" },
      { label: "List your space", href: "/auth/signup" },
      { label: "How it works", href: "#" },
      { label: "Cities", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Journal", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", href: "#" },
      { label: "Safety", href: "#" },
      { label: "Cancellation", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

const socials = [
  { label: "Twitter", path: "M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.38 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.32 3.91A12.16 12.16 0 013.16 4.86a4.28 4.28 0 001.33 5.71 4.24 4.24 0 01-1.94-.54v.05a4.28 4.28 0 003.44 4.2 4.27 4.27 0 01-1.93.07 4.29 4.29 0 004 2.98A8.6 8.6 0 012 19.54a12.13 12.13 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.72 8.72 0 0024 5.06a8.5 8.5 0 01-2.54.7z" },
  { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
  { label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink">
      <div className="glow -bottom-40 left-1/2 h-80 w-[44rem] -translate-x-1/2 opacity-30" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-5 pt-20 md:px-8">
        {/* Top: brand + columns */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-3 ring-1 ring-line-strong">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-amber">
                  <path d="M3 21V9L12 3L21 9V21H15V14H9V21H3Z" fill="currentColor" />
                </svg>
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">
                Room<span className="text-amber">Bridge</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              Curated stays and verified hosts across India. Book somewhere
              extraordinary — in minutes.
            </p>
            <div className="mt-6 flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-amber hover:text-amber"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="md:col-span-2 lg:col-span-2">
              <h4 className="eyebrow mb-4 text-muted">{col.title}</h4>
              <ul className="space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-paper/70 transition-colors hover:text-amber"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Oversized wordmark — SVG scales the word to fit the container
            width exactly (textLength), so it never clips on any screen. */}
        <div className="pointer-events-none mt-16 select-none">
          <svg
            viewBox="0 0 1200 220"
            width="100%"
            role="img"
            aria-label="RoomBridge"
            className="block"
          >
            <text
              x="600"
              y="172"
              textAnchor="middle"
              textLength="1180"
              lengthAdjust="spacingAndGlyphs"
              fontSize="200"
              fontWeight="700"
              fill="rgb(var(--paper))"
              fillOpacity="0.05"
              className="font-display"
              style={{ fontFamily: "var(--font-display), serif" }}
            >
              RoomBridge
            </text>
          </svg>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-7 sm:flex-row">
          <p className="font-mono text-xs tracking-wide text-faint">
            © {new Date().getFullYear()} RoomBridge — Made in India
          </p>
          <div className="flex gap-6 font-mono text-xs uppercase tracking-[0.16em] text-faint">
            <a href="#" className="transition-colors hover:text-paper">Privacy</a>
            <a href="#" className="transition-colors hover:text-paper">Terms</a>
            <a href="#" className="transition-colors hover:text-paper">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
