"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/common/PageTransition";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import StatusBadge from "@/components/common/StatusBadge";
import EmptyState from "@/components/common/EmptyState";
import {
  apiErrorMessage,
  deleteRoom,
  fetchMyListings,
  resubmitRoom,
  updateRoom,
} from "@/services/rooms";
import type { OwnedRoom } from "@/types/room";

export default function MyListingsPage() {
  return (
    <ProtectedRoute>
      {/* useSearchParams needs a Suspense boundary, otherwise the whole route
          silently deopts to client-side rendering. */}
      <Suspense fallback={<ListingsFallback />}>
        <MyListings />
      </Suspense>
    </ProtectedRoute>
  );
}

function ListingsFallback() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl space-y-3 px-5 py-12 md:px-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="surface h-32 animate-pulse rounded-2xl" />
        ))}
      </main>
    </>
  );
}

function MyListings() {
  const searchParams = useSearchParams();
  const justSubmitted = searchParams.get("submitted") === "1";

  const [rooms, setRooms] = useState<OwnedRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setRooms(await fetchMyListings());
    } catch (err) {
      setError(apiErrorMessage(err, "Could not load your listings."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const runAction = async (id: string, action: () => Promise<unknown>) => {
    setBusyId(id);
    setError(null);
    try {
      await action();
      await load();
    } catch (err) {
      setError(apiErrorMessage(err, "That action failed."));
    } finally {
      setBusyId(null);
      setConfirmId(null);
    }
  };

  const counts = {
    pending: rooms.filter((r) => r.status === "PENDING" && r.isActive).length,
    live: rooms.filter((r) => r.status === "APPROVED" && r.isActive).length,
    rejected: rooms.filter((r) => r.status === "REJECTED" && r.isActive).length,
  };

  return (
    <PageTransition>
      <Navbar />
      <main className="min-h-screen bg-ink pb-16 text-paper">
        <div className="relative overflow-hidden border-b border-line">
          <div className="glow -right-24 -top-24 h-64 w-64 opacity-45 sm:h-80 sm:w-80" aria-hidden />
          <div className="relative mx-auto max-w-5xl px-5 pb-7 pt-10 md:px-8 md:pt-14">
            <p className="eyebrow mb-3">Host dashboard</p>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h1 className="font-display text-[clamp(1.8rem,7vw,3rem)] font-bold leading-[1.05] tracking-tight">
                Your <span className="italic text-amber">listings</span>.
              </h1>
              <Link href="/rooms/new" className="btn-amber px-5 py-3 text-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                </svg>
                New listing
              </Link>
            </div>

            {rooms.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-2.5">
                <Stat label="Live" value={counts.live} />
                <Stat label="In review" value={counts.pending} />
                <Stat label="Needs changes" value={counts.rejected} />
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">
          {justSubmitted && (
            <div className="mb-6 rounded-2xl border border-[rgb(214_158_46/0.35)] bg-[rgb(214_158_46/0.09)] p-4 sm:p-5">
              <p className="text-sm font-medium text-paper">
                Listing submitted for review
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Our team checks new listings before they go live. You will see the
                status change here once it is reviewed.
              </p>
            </div>
          )}

          {error && (
            <p className="mb-5 rounded-xl border border-[rgb(198_56_44/0.4)] bg-[rgb(198_56_44/0.1)] px-4 py-3 text-sm text-paper">
              {error}
            </p>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="surface h-32 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <EmptyState
              title="No listings yet"
              description="Publish your first space. Our team reviews it, then it goes live for guests across India."
              actionLabel="Create a listing"
              actionHref="/rooms/new"
            />
          ) : (
            <ul className="space-y-3">
              {rooms.map((room) => (
                <li key={room.id} className="surface lift overflow-hidden rounded-2xl">
                  {/* Stacks on mobile, row from sm up */}
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative aspect-[16/9] w-full shrink-0 bg-ink-3 sm:aspect-square sm:w-40">
                      {room.images[0] ? (
                        <Image
                          src={room.images[0]}
                          alt={room.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 160px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-ink-3 to-ink-4">
                          <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
                            No photo
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                      <div className="flex flex-wrap items-start gap-2">
                        <h2 className="min-w-0 flex-1 font-display text-base font-semibold leading-snug text-paper line-clamp-2 sm:text-lg">
                          {room.title}
                        </h2>
                        <StatusBadge status={room.status} isActive={room.isActive} />
                      </div>

                      <p className="mt-1 truncate text-sm text-muted">
                        {room.location}, {room.city} · ₹
                        {room.price.toLocaleString("en-IN")}/night
                      </p>

                      {room.status === "REJECTED" && room.rejectionReason && (
                        <p className="mt-2.5 rounded-xl border border-[rgb(198_56_44/0.3)] bg-[rgb(198_56_44/0.08)] px-3 py-2 text-sm leading-relaxed text-muted">
                          <span className="font-medium text-paper">Admin note: </span>
                          {room.rejectionReason}
                        </p>
                      )}

                      {room.images.length === 0 && (
                        <p className="mt-2.5 text-sm text-muted">
                          Add at least one photo — listings without photos cannot be
                          approved.
                        </p>
                      )}

                      {/* Actions wrap instead of overflowing on narrow screens */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          href={`/rooms/${room.id}`}
                          className="btn-ghost px-4 py-2.5 text-xs"
                        >
                          View
                        </Link>

                        {room.status === "REJECTED" && (
                          <button
                            onClick={() => runAction(room.id, () => resubmitRoom(room.id))}
                            disabled={busyId === room.id}
                            className="btn-amber px-4 py-2.5 text-xs disabled:opacity-60"
                          >
                            {busyId === room.id ? "Working…" : "Resubmit"}
                          </button>
                        )}

                        {room.status === "APPROVED" && (
                          <button
                            onClick={() =>
                              runAction(room.id, () =>
                                updateRoom(room.id, { isActive: !room.isActive })
                              )
                            }
                            disabled={busyId === room.id}
                            className="btn-ghost px-4 py-2.5 text-xs disabled:opacity-60"
                          >
                            {room.isActive ? "Pause" : "Resume"}
                          </button>
                        )}

                        {confirmId === room.id ? (
                          <span className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => runAction(room.id, () => deleteRoom(room.id))}
                              disabled={busyId === room.id}
                              className="rounded-full border border-[rgb(198_56_44/0.5)] bg-[rgb(198_56_44/0.12)] px-4 py-2.5 text-xs font-medium text-paper disabled:opacity-60"
                            >
                              {busyId === room.id ? "Removing…" : "Confirm remove"}
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="px-2 py-2.5 text-xs text-muted hover:text-paper"
                            >
                              Cancel
                            </button>
                          </span>
                        ) : (
                          <button
                            onClick={() => setConfirmId(room.id)}
                            className="px-3 py-2.5 text-xs text-muted transition-colors hover:text-[rgb(198_56_44)]"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </PageTransition>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="surface rounded-xl px-3 py-3 text-center sm:px-4">
      <p className="font-display text-2xl font-bold text-paper">{value}</p>
      <p className="mt-0.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-faint sm:text-[0.65rem]">
        {label}
      </p>
    </div>
  );
}
