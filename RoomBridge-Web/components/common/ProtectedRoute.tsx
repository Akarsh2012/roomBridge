"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Client-side guard. This is a UX convenience only — every protected endpoint is
 * independently enforced on the server, so a bypass here leaks nothing.
 */
export default function ProtectedRoute({
  children,
  requireRole,
  requireVerified = false,
}: {
  children: React.ReactNode;
  requireRole?: "ADMIN";
  requireVerified?: boolean;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const denied =
    !isLoading &&
    (!isAuthenticated ||
      (requireRole && user?.role !== requireRole) ||
      (requireVerified && user?.emailVerified === false));

  useEffect(() => {
    if (isLoading || !denied) return;

    if (!isAuthenticated) {
      router.replace("/auth/signin");
    } else if (requireRole && user?.role !== requireRole) {
      router.replace("/rooms");
    } else {
      router.replace("/auth/verify");
    }
  }, [denied, isLoading, isAuthenticated, requireRole, user?.role, router]);

  if (isLoading || denied) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-line-strong border-t-amber" />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
            {isLoading ? "Checking access" : "Redirecting"}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
