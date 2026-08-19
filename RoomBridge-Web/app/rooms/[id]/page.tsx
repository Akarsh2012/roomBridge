"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/common/PageTransition";
import RoomGallery from "@/components/rooms/RoomGallery";
import StatusBadge from "@/components/common/StatusBadge";
import EmptyState from "@/components/common/EmptyState";
import { apiErrorMessage, fetchRoomById } from "@/services/rooms";
import type { RoomDetail } from "@/types/room";

export default function RoomDetailPage({ params }: { params: { id: string } }) {
  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const data = await fetchRoomById(params.id);
        if (!cancelled) setRoom(data);
      } catch (err) {
        if (!cancelled) setError(apiErrorMessage(err, "This stay is unavailable."));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (isLoading) return <DetailSkeleton />;

  if (error || !room) {
    return (
      <PageTransition>
        <Navbar />
        <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-5 py-12 md:px-8">
          <EmptyState
            title="Stay not found"
            description={
              error ??
              "This listing may have been removed, or it is still awaiting review."
            }
            actionLabel="Browse all stays"
            actionHref="/rooms"
          />
        </main>
      </PageTransition>
    );
  }

  const nights = 1;
  const isPublic = !room.status || room.status === "APPROVED";

  return (
    <PageTransition>
      <Navbar />
      {/* pb-28 clears the sticky mobile booking bar so content is never hidden behind it */}
      <main className="min-h-screen bg-ink pb-28 text-paper md:pb-16">
        <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-5 md:px-8 md:pt-8">
          <Link
            href="/rooms"
            className="mb-4 inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted transition-colors hover:text-amber"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
            </svg>
            All stays
          </Link>

          {/* Owner-only moderation banner */}
          {room.isOwner && room.status && room.status !== "APPROVED" && (
            <ModerationBanner
              status={room.status}
              reason={room.rejectionReason}
              roomId={room.id}
            />
          )}

          <RoomGallery images={room.images} title={room.title} />

          <div className="mt-6 grid gap-8 md:mt-8 md:grid-cols-[minmax(0,1fr)_360px] md:gap-10">
            {/* ── Main column ── */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-start gap-3">
                <h1 className="min-w-0 flex-1 font-display text-[clamp(1.6rem,5.5vw,2.75rem)] font-bold leading-[1.08] tracking-tight text-balance">
                  {room.title}
                </h1>
                {room.isOwner && room.status && (
                  <StatusBadge status={room.status} isActive={room.isActive ?? true} />
                )}
              </div>

              <p className="mt-2.5 flex items-center gap-1.5 text-sm text-muted sm:text-base">
                <svg className="h-4 w-4 shrink-0 text-amber" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="min-w-0 truncate">
                  {room.location}, {room.city}, {room.country}
                </span>
              </p>

              {room.rating.count > 0 && (
                <p className="mt-2 flex items-center gap-1.5 text-sm">
                  <span className="text-amber">★</span>
                  <span className="font-medium text-paper">{room.rating.average}</span>
                  <span className="text-muted">
                    · {room.rating.count} {room.rating.count === 1 ? "review" : "reviews"}
                  </span>
                </p>
              )}

              {/* Facts — 2 cols on mobile so nothing squeezes */}
              <dl className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <Fact label="Guests" value={room.maxGuests} />
                <Fact label="Bedrooms" value={room.bedrooms} />
                <Fact label="Bathrooms" value={room.bathrooms} />
                <Fact label="Per night" value={`₹${room.price.toLocaleString("en-IN")}`} />
              </dl>

              <section className="mt-8 border-t border-line pt-7">
                <h2 className="font-display text-lg font-semibold sm:text-xl">
                  About this stay
                </h2>
                <p className="mt-3 whitespace-pre-line text-[0.95rem] leading-relaxed text-muted">
                  {room.description}
                </p>
              </section>

              {room.amenities.length > 0 && (
                <section className="mt-8 border-t border-line pt-7">
                  <h2 className="font-display text-lg font-semibold sm:text-xl">
                    What this place offers
                  </h2>
                  <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {room.amenities.map((amenity) => (
                      <li
                        key={amenity}
                        className="flex items-center gap-2.5 text-sm text-muted"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber/12 text-amber">
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span className="min-w-0 truncate">{amenity}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="mt-8 border-t border-line pt-7">
                <h2 className="font-display text-lg font-semibold sm:text-xl">
                  Hosted by {room.host.name}
                </h2>
                <div className="surface lift mt-4 flex items-center gap-4 rounded-2xl p-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-hi to-amber-deep text-lg font-bold text-[color:var(--btn-amber-fg)]">
                    {room.host.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-paper">{room.host.name}</p>
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-faint">
                      Hosting since{" "}
                      {new Date(room.host.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </section>

              <section className="mt-8 border-t border-line pt-7">
                <h2 className="font-display text-lg font-semibold sm:text-xl">
                  Reviews
                </h2>
                {room.reviews.length === 0 ? (
                  <p className="mt-3 text-sm text-muted">
                    No reviews yet — be the first to stay here.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {room.reviews.map((review) => (
                      <li key={review.id} className="surface rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-4 text-sm font-semibold text-paper">
                            {review.user.name.charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-paper">
                              {review.user.name}
                            </p>
                            <p className="font-mono text-[0.65rem] text-faint">
                              {new Date(review.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <span className="shrink-0 font-mono text-sm text-amber">
                            {"★".repeat(review.rating)}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-muted">
                          {review.comment}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            {/* ── Desktop booking card ── */}
            <aside className="hidden md:block">
              <div className="surface-accent lift sticky top-28 rounded-2xl p-5">
                <p className="flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-bold text-paper">
                    ₹{room.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm text-muted">/ night</span>
                </p>

                <div className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
                  <div className="flex justify-between text-muted">
                    <span>
                      ₹{room.price.toLocaleString("en-IN")} × {nights} night
                    </span>
                    <span>₹{(room.price * nights).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between border-t border-line pt-2.5 font-medium text-paper">
                    <span>Total</span>
                    <span>₹{(room.price * nights).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button
                  disabled
                  className="btn-amber mt-5 w-full cursor-not-allowed py-3 text-sm opacity-60"
                >
                  Booking opens soon
                </button>
                <p className="mt-2.5 text-center font-mono text-[0.65rem] uppercase tracking-[0.14em] text-faint">
                  Date selection arrives in the next release
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* ── Sticky mobile price bar ── */}
      {isPublic && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 px-4 py-3 pb-safe backdrop-blur-xl md:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg font-bold text-paper">
                ₹{room.price.toLocaleString("en-IN")}
                <span className="text-xs font-normal text-muted"> / night</span>
              </p>
            </div>
            <button
              disabled
              className="btn-amber shrink-0 cursor-not-allowed px-6 py-3 text-sm opacity-60"
            >
              Booking soon
            </button>
          </div>
        </div>
      )}
    </PageTransition>
  );
}

function Fact({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="surface rounded-xl px-3.5 py-3">
      <dt className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
        {label}
      </dt>
      <dd className="mt-1 truncate font-display text-lg font-semibold text-paper">
        {value}
      </dd>
    </div>
  );
}

function ModerationBanner({
  status,
  reason,
  roomId,
}: {
  status: "PENDING" | "REJECTED";
  reason?: string | null;
  roomId: string;
}) {
  const pending = status === "PENDING";
  return (
    <div
      className={`mb-5 rounded-2xl border p-4 sm:p-5 ${
        pending
          ? "border-[rgb(214_158_46/0.35)] bg-[rgb(214_158_46/0.09)]"
          : "border-[rgb(198_56_44/0.35)] bg-[rgb(198_56_44/0.09)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <StatusBadge status={status} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-paper">
            {pending
              ? "Only you can see this listing"
              : "This listing needs changes"}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {pending
              ? "Our team is reviewing it. Once approved it appears in search for everyone."
              : reason || "An admin asked for changes before this can go live."}
          </p>
          {!pending && (
            <Link
              href={`/dashboard/listings`}
              className="btn-ghost mt-3 inline-flex px-4 py-2 text-xs"
              key={roomId}
            >
              Manage listing
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-5 md:px-8">
        <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-ink-3 md:aspect-[16/7]" />
        <div className="mt-6 space-y-3">
          <div className="h-8 w-3/4 animate-pulse rounded bg-ink-3" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-ink-3" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-ink-3" />
        </div>
      </main>
    </>
  );
}
