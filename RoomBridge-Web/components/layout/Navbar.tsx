"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, isAuthenticated, logout, becomeHost } = useAuth();
  const router = useRouter();
  const [upgrading, setUpgrading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.push("/");
  };

  const handleBecomeHost = async () => {
    setUpgrading(true);
    try {
      await becomeHost();
    } catch {
      // error handled silently
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-sm">
      <nav className="flex items-center justify-between px-6 md:px-10 lg:px-16 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-md shadow-indigo-200 group-hover:shadow-lg group-hover:shadow-indigo-300 transition-shadow">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
              <path d="M3 21V9L12 3L21 9V21H15V14H9V21H3Z" fill="currentColor" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            RoomBridge
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/rooms"
            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-brand-primary hover:bg-brand-light transition-all"
          >
            Rooms
          </Link>

          {isAuthenticated ? (
            <>
              {(user?.role === "HOST" || user?.role === "ADMIN") && (
                <Link
                  href="/rooms/new"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-brand-primary hover:bg-brand-light transition-all"
                >
                  List a Room
                </Link>
              )}
              {user?.role === "GUEST" && (
                <button
                  onClick={handleBecomeHost}
                  disabled={upgrading}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-sm shadow-emerald-200 hover:shadow-md transition-all disabled:opacity-50"
                >
                  {upgrading ? "Upgrading..." : "Become a Host"}
                </button>
              )}

              {/* User badge */}
              <div className="flex items-center gap-2 ml-2 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.name}</p>
                  <p className="text-[11px] font-medium text-brand-secondary leading-tight">{user?.role}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="ml-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-brand-primary hover:bg-brand-light transition-all"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-dark hover:to-brand-primary shadow-sm shadow-indigo-200 hover:shadow-md transition-all"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-1 text-sm shadow-lg">
          <Link
            href="/rooms"
            onClick={() => setMenuOpen(false)}
            className="block py-2.5 px-3 rounded-lg text-gray-600 hover:text-brand-primary hover:bg-brand-light transition"
          >
            Rooms
          </Link>

          {isAuthenticated ? (
            <>
              {(user?.role === "HOST" || user?.role === "ADMIN") && (
                <Link
                  href="/rooms/new"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg text-gray-600 hover:text-brand-primary hover:bg-brand-light transition"
                >
                  List a Room
                </Link>
              )}
              {user?.role === "GUEST" && (
                <button
                  onClick={() => { handleBecomeHost(); setMenuOpen(false); }}
                  disabled={upgrading}
                  className="w-full text-left py-2.5 px-3 rounded-lg text-emerald-600 font-medium hover:bg-emerald-50 transition"
                >
                  {upgrading ? "Upgrading..." : "Become a Host"}
                </button>
              )}
              <div className="flex items-center gap-3 py-3 px-3 mt-1 border-t border-gray-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-sm font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-brand-secondary">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2.5 px-3 rounded-lg text-red-600 font-medium hover:bg-red-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Link
                href="/auth/signin"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-lg border border-gray-200 font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-brand-primary to-brand-secondary transition"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
