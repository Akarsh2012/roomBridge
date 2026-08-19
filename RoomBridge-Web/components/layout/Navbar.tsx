"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/common/ThemeToggle";

function Mark() {
  return (
    <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-ink-3 ring-1 ring-line-strong">
      <span className="absolute inset-0 rounded-xl bg-amber/20 blur-md" aria-hidden />
      <svg viewBox="0 0 24 24" fill="none" className="relative h-5 w-5 text-amber">
        <path d="M3 21V9L12 3L21 9V21H15V14H9V21H3Z" fill="currentColor" />
      </svg>
    </span>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 md:pt-4">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border py-2 pl-3 pr-2 transition-all duration-500 ${
          scrolled
            ? "border-line bg-ink-2/80 shadow-lg backdrop-blur-xl"
            : "border-line/70 bg-ink-2/55 shadow-md backdrop-blur-xl"
        }`}
      >
        <Link href="/" className="group flex items-center gap-2.5 pl-1">
          <Mark />
          <span className="font-display text-lg font-semibold tracking-tight text-paper">
            Room<span className="text-amber">Bridge</span>
          </span>
        </Link>

        {/* Desktop links group */}
        <div className="hidden items-center gap-0.5 rounded-full border border-line bg-ink/40 p-1 lg:flex">
          <NavLink href="/rooms">Stays</NavLink>
          {isAuthenticated && <NavLink href="/dashboard/listings">My listings</NavLink>}
          {isAuthenticated && <NavLink href="/rooms/new">List a room</NavLink>}
          {isAdmin && <NavLink href="/admin">Review</NavLink>}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2.5 rounded-full border border-line bg-ink-3/60 py-1 pl-1 pr-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber text-[11px] font-bold text-ink">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
                <span className="hidden text-sm font-medium text-paper lg:block">
                  {user?.name?.split(" ")[0]}
                </span>
                {isAdmin && (
                  <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.14em] text-amber lg:block">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:bg-ink-3/70 hover:text-paper"
              >
                Logout
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-full border border-line bg-ink-3/60 p-2.5 text-paper"
            aria-label="Toggle menu"
          >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mx-auto mt-2 max-w-6xl space-y-1 rounded-2xl border border-line bg-ink-2/90 p-3 shadow-xl backdrop-blur-xl md:hidden">
          <MobileLink href="/rooms" onClick={() => setMenuOpen(false)}>Stays</MobileLink>
          {isAuthenticated ? (
            <>
              <MobileLink href="/dashboard/listings" onClick={() => setMenuOpen(false)}>My listings</MobileLink>
              <MobileLink href="/rooms/new" onClick={() => setMenuOpen(false)}>List a room</MobileLink>
              {isAdmin && (
                <MobileLink href="/admin" onClick={() => setMenuOpen(false)}>
                  Review queue
                </MobileLink>
              )}
              <div className="mt-2 flex items-center gap-3 border-t border-line py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber text-sm font-bold text-ink">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
                <span className="font-medium text-paper">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full rounded-xl px-4 py-2.5 text-left font-mono text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:bg-ink-3/70 hover:text-paper"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link
                href="/auth/signin"
                onClick={() => setMenuOpen(false)}
                className="btn-ghost flex-1 py-2.5 text-sm"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMenuOpen(false)}
                className="btn-amber flex-1 py-2.5 text-sm"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-ink-3/70 hover:text-paper"
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl px-4 py-2.5 text-base font-medium text-paper transition-colors hover:bg-ink-3/70"
    >
      {children}
    </Link>
  );
}
