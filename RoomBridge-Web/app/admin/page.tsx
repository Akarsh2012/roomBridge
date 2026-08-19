"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/common/PageTransition";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import StatusBadge from "@/components/common/StatusBadge";
import EmptyState from "@/components/common/EmptyState";
import {
  AdminStats,
  apiErrorMessage,
  approveRoom,
  fetchAdminStats,
  fetchModerationQueue,
  rejectRoom,
} from "@/services/rooms";
import type { ModerationRoom, Pagination, RoomStatus } from "@/types/room";

type Tab = RoomStatus | "ALL";

const TABS: { value: Tab; label: string }[] = [
  { value: "PENDING", label: "In review" },
  { value: "APPROVED", label: "Live" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ALL", label: "All" },
];

export default function AdminPage() {
  return (
    <ProtectedRoute requireRole="ADMIN">
      <AdminModeration />
    </ProtectedRoute>
  );
}

function AdminModeration() {
  const [tab, setTab] = useState<Tab>("PENDING");
  const [page, setPage] = useState(1);
  const [rooms, setRooms] = useState<ModerationRoom[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<ModerationRoom | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [queue, nextStats] = await Promise.all([
        fetchModerationQueue({ status: tab, page, limit: 10 }),
        fetchAdminStats(),
      ]);
      setRooms(queue.rooms);
      setPagination(queue.pagination);
      setStats(nextStats);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not load the moderation queue."));
    } finally {
      setIsLoading(false);
    }
  }, [tab, page]);

  useEffect(() => {
    load();
  }, [load]);

  const approve = async (room: ModerationRoom) => {
    setBusyId(room.id);
    setError(null);
    try {
      await approveRoom(room.id);
      await load();
    } catch (err) {
      setError(apiErrorMessage(err, "Could not approve that listing."));
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (room: ModerationRoom, reason: string) => {
    setBusyId(room.id);
    setError(null);
    try {
      await rejectRoom(room.id, reason);
      setRejecting(null);
      await load();
    } catch (err) {
      setError(apiErrorMessage(err, "Could not reject that listing."));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <PageTransition>
      <Navbar />
      <main className="min-h-screen bg-ink pb-16 text-paper">
        <div className="relative overflow-hidden border-b border-line">
          <div className="glow -right-24 -top-24 h-64 w-64 opacity-45 sm:h-80 sm:w-80" aria-hidden />
          <div className="relative mx-auto max-w-5xl px-5 pb-6 pt-10 md:px-8 md:pt-14">
            <p className="eyebrow mb-3">Admin</p>
            <h1 className="font-display text-[clamp(1.8rem,7vw,3rem)] font-bold leading-[1.05] tracking-tight">
              Listing <span className="italic text-amber">review</span>.
            </h1>
            <p className="mt-2.5 max-w-lg text-sm text-muted">
              Nothing reaches guests until it is approved here.
            </p>

            {stats && (
              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <Stat label="Awaiting review" value={stats.rooms.pending} accent />
                <Stat label="Live now" value={stats.rooms.live} />
                <Stat label="Rejected" value={stats.rooms.rejected} />
                <Stat label="Users" value={stats.users} />
              </div>
            )}
          </div>
        </div>

        {/* Tabs — horizontally scrollable so they never wrap awkwardly on small screens */}
        <div className="sticky top-[68px] z-30 border-b border-line bg-ink/85 backdrop-blur-xl md:top-[76px]">
          <div className="no-scrollbar mx-auto flex max-w-5xl gap-2 overflow-x-auto px-5 py-3 md:px-8">
            {TABS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setTab(option.value);
                  setPage(1);
                }}
                className={`chip shrink-0 ${tab === option.value ? "chip-active" : ""}`}
              >
                {option.label}
                {option.value === "PENDING" && stats && stats.rooms.pending > 0 && (
                  <span
                    className={`ml-1 rounded-full px-1.5 font-mono text-[0.6rem] ${
                      tab === "PENDING"
                        ? "bg-black/20 text-[color:var(--btn-amber-fg)]"
                        : "bg-amber/20 text-amber"
                    }`}
                  >
                    {stats.rooms.pending}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">
          {error && (
            <p className="mb-5 rounded-xl border border-[rgb(198_56_44/0.4)] bg-[rgb(198_56_44/0.1)] px-4 py-3 text-sm text-paper">
              {error}
            </p>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="surface h-44 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <EmptyState
              title={tab === "PENDING" ? "Queue is clear" : "Nothing here"}
              description={
                tab === "PENDING"
                  ? "Every submitted listing has been reviewed. New ones land here automatically."
                  : "No listings match this filter yet."
              }
              icon={
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              }
            />
          ) : (
            <ul className="space-y-4">
              {rooms.map((room) => (
                <ModerationCard
                  key={room.id}
                  room={room}
                  busy={busyId === room.id}
                  onApprove={() => approve(room)}
                  onReject={() => setRejecting(room)}
                />
              ))}
            </ul>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn-ghost px-5 py-2.5 text-xs disabled:opacity-35"
              >
                Previous
              </button>
              <span className="font-mono text-xs text-muted">
                {page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasMore}
                className="btn-ghost px-5 py-2.5 text-xs disabled:opacity-35"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      {rejecting && (
        <RejectDialog
          room={rejecting}
          busy={busyId === rejecting.id}
          onCancel={() => setRejecting(null)}
          onConfirm={(reason) => reject(rejecting, reason)}
        />
      )}
    </PageTransition>
  );
}

function ModerationCard({
  room,
  busy,
  onApprove,
  onReject,
}: {
  room: ModerationRoom;
  busy: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  const noPhotos = room.images.length === 0;

  return (
    <li className="surface lift overflow-hidden rounded-2xl">
      {/* Photo strip — scrolls horizontally rather than shrinking thumbnails */}
      {room.images.length > 0 ? (
        <div className="no-scrollbar flex gap-1 overflow-x-auto bg-ink-3">
          {room.images.map((src, i) => (
            <div
              key={src}
              className="relative aspect-[4/3] w-40 shrink-0 sm:w-48"
            >
              <Image
                src={src}
                alt={`${room.title} — photo ${i + 1}`}
                fill
                sizes="192px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-24 items-center justify-center bg-gradient-to-br from-ink-3 to-ink-4">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-faint">
            No photos submitted
          </span>
        </div>
      )}

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start gap-2">
          <h2 className="min-w-0 flex-1 font-display text-base font-semibold leading-snug text-paper sm:text-lg">
            {room.title}
          </h2>
          <StatusBadge status={room.status} isActive={room.isActive} />
        </div>

        <p className="mt-1 truncate text-sm text-muted">
          {room.location}, {room.city} · ₹{room.price.toLocaleString("en-IN")}/night ·{" "}
          {room.maxGuests} guests
        </p>

        <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-3">
          {room.description}
        </p>

        {room.amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {room.amenities.slice(0, 8).map((amenity) => (
              <span
                key={amenity}
                className="rounded-full border border-line bg-ink-3/50 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-muted"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 8 && (
              <span className="px-1 py-1 font-mono text-[0.6rem] text-faint">
                +{room.amenities.length - 8}
              </span>
            )}
          </div>
        )}

        {/* Host provenance — the main signal an admin judges on */}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line pt-3.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-hi to-amber-deep text-xs font-bold text-[color:var(--btn-amber-fg)]">
            {room.host.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-paper">{room.host.name}</p>
            <p className="truncate font-mono text-[0.62rem] text-faint">
              {room.host.email}
              {!room.host.emailVerified && " · unverified"}
            </p>
          </div>
          <span className="ml-auto shrink-0 font-mono text-[0.62rem] text-faint">
            {new Date(room.submittedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>

        {room.status === "REJECTED" && room.rejectionReason && (
          <p className="mt-3 rounded-xl border border-[rgb(198_56_44/0.3)] bg-[rgb(198_56_44/0.08)] px-3 py-2 text-sm leading-relaxed text-muted">
            <span className="font-medium text-paper">Rejected: </span>
            {room.rejectionReason}
          </p>
        )}

        {noPhotos && room.status === "PENDING" && (
          <p className="mt-3 rounded-xl border border-[rgb(214_158_46/0.3)] bg-[rgb(214_158_46/0.08)] px-3 py-2 text-sm text-muted">
            This listing has no photos and cannot be approved yet.
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/rooms/${room.id}`} className="btn-ghost px-4 py-2.5 text-xs">
            Open listing
          </Link>
          {room.status !== "APPROVED" && (
            <button
              onClick={onApprove}
              disabled={busy || noPhotos}
              className="btn-amber px-5 py-2.5 text-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Working…" : "Approve"}
            </button>
          )}
          {room.status !== "REJECTED" && (
            <button
              onClick={onReject}
              disabled={busy}
              className="rounded-full border border-[rgb(198_56_44/0.45)] bg-[rgb(198_56_44/0.1)] px-5 py-2.5 text-xs font-medium text-paper transition-colors hover:bg-[rgb(198_56_44/0.18)] disabled:opacity-50"
            >
              Reject
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

function RejectDialog({
  room,
  busy,
  onCancel,
  onConfirm,
}: {
  room: ModerationRoom;
  busy: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const tooShort = reason.trim().length < 10;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Cancel"
        onClick={onCancel}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full rounded-t-3xl border border-line bg-ink p-5 shadow-2xl sm:max-w-md sm:rounded-3xl"
      >
        <h2 className="font-display text-lg font-semibold text-paper">
          Reject this listing
        </h2>
        <p className="mt-1 truncate text-sm text-muted">{room.title}</p>

        <label className="label mt-5" htmlFor="reject-reason">
          Reason (the host sees this)
        </label>
        <textarea
          id="reject-reason"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={500}
          placeholder="Explain exactly what needs to change so the host can fix it and resubmit."
          className="field resize-y"
        />
        <p className="mt-1.5 text-right font-mono text-[0.62rem] text-faint">
          {reason.trim().length}/500
        </p>

        <div className="mt-4 flex flex-col gap-2.5 pb-safe sm:flex-row">
          <button onClick={onCancel} className="btn-ghost py-3 text-sm sm:flex-1">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason.trim())}
            disabled={tooShort || busy}
            className="rounded-full border border-[rgb(198_56_44/0.5)] bg-[rgb(198_56_44/0.15)] py-3 text-sm font-medium text-paper transition-colors hover:bg-[rgb(198_56_44/0.25)] disabled:cursor-not-allowed disabled:opacity-45 sm:flex-1"
          >
            {busy ? "Rejecting…" : "Reject listing"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl px-3 py-3 text-center ${accent ? "surface-accent" : "surface"}`}>
      <p className="font-display text-2xl font-bold text-paper">{value}</p>
      <p className="mt-0.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-faint sm:text-[0.65rem]">
        {label}
      </p>
    </div>
  );
}
