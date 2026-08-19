"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/common/PageTransition";
import RoomCard from "@/components/cards/RoomCard";
import EmptyState from "@/components/common/EmptyState";
import FilterSheet from "@/components/rooms/FilterSheet";
import { apiErrorMessage, fetchRooms } from "@/services/rooms";
import { POPULAR_CITIES } from "@/types/room";
import type { Pagination, Room, RoomFilters } from "@/types/room";

const PAGE_SIZE = 24;

/** Count of filters beyond city/search/sort — drives the badge on the Filters button. */
function activeFilterCount(filters: RoomFilters): number {
  return [
    filters.minPrice,
    filters.maxPrice,
    filters.guests,
    filters.bedrooms,
    filters.amenities?.length ? filters.amenities : undefined,
  ].filter((value) => value !== undefined).length;
}

export default function RoomsPage() {
  const [filters, setFilters] = useState<RoomFilters>({
    sort: "newest",
    page: 1,
    limit: PAGE_SIZE,
  });
  const [searchDraft, setSearchDraft] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Guards against a slow earlier request overwriting a newer result.
  const requestId = useRef(0);

  const load = useCallback(async (next: RoomFilters) => {
    const id = ++requestId.current;
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchRooms(next);
      if (id !== requestId.current) return;
      setRooms(result.rooms);
      setPagination(result.pagination);
    } catch (err) {
      if (id !== requestId.current) return;
      setError(apiErrorMessage(err, "Could not load stays. Please try again."));
      setRooms([]);
      setPagination(null);
    } finally {
      if (id === requestId.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filters);
  }, [filters, load]);

  const apply = (next: RoomFilters) => {
    setFilters({ ...next, limit: PAGE_SIZE });
    setSheetOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    apply({ ...filters, search: searchDraft.trim() || undefined, page: 1 });
  };

  const extraFilters = activeFilterCount(filters);
  const hasAnyFilter = extraFilters > 0 || !!filters.city || !!filters.search;

  return (
    <PageTransition>
      <Navbar />
      <main className="min-h-screen bg-ink text-paper">
        {/* ── Header ─────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-line">
          <div className="glow -right-24 -top-28 h-72 w-72 opacity-50 sm:h-96 sm:w-96" aria-hidden />
          <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-10 md:px-8 md:pb-10 md:pt-16">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-1.5 w-1.5 animate-pulse rounded-full bg-amber" />
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted sm:text-xs">
                {isLoading && !pagination
                  ? "Loading stays"
                  : `${pagination?.total ?? 0} ${
                      (pagination?.total ?? 0) === 1 ? "stay" : "stays"
                    } available`}
              </span>
            </div>

            <h1 className="font-display text-[clamp(2rem,8vw,4.5rem)] font-bold leading-[1.02] tracking-tightest text-balance">
              Find your <span className="italic text-amber">stay</span>.
            </h1>
            <p className="mt-3 max-w-lg text-sm text-muted sm:text-base">
              Every listing here is reviewed by our team before it goes live.
            </p>

            {/* Search + filters. Stacks on mobile, inline from sm up. */}
            <form onSubmit={submitSearch} className="mt-6 max-w-3xl md:mt-8">
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <div className="surface flex flex-1 items-center gap-2.5 rounded-2xl px-4 py-3">
                  <svg className="h-4 w-4 shrink-0 text-amber" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                  </svg>
                  <input
                    type="search"
                    value={searchDraft}
                    onChange={(e) => setSearchDraft(e.target.value)}
                    placeholder="Search city, area or stay"
                    aria-label="Search stays"
                    className="w-full min-w-0 bg-transparent text-base text-paper placeholder-faint outline-none sm:text-sm"
                  />
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSheetOpen(true)}
                    className="btn-ghost relative flex-1 gap-2 px-5 py-3 text-sm sm:flex-none"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M10 18h4" />
                    </svg>
                    Filters
                    {extraFilters > 0 && (
                      <span className="ml-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-amber px-1 font-mono text-[0.65rem] font-bold text-[color:var(--btn-amber-fg)]">
                        {extraFilters}
                      </span>
                    )}
                  </button>
                  <button type="submit" className="btn-amber flex-1 px-6 py-3 text-sm sm:flex-none">
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* ── City rail ──────────────────────────────────── */}
        <div className="sticky top-[68px] z-30 border-b border-line bg-ink/85 backdrop-blur-xl md:top-[76px]">
          <div className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 md:px-8">
            <button
              onClick={() => apply({ ...filters, city: undefined, page: 1 })}
              className={`chip shrink-0 ${!filters.city ? "chip-active" : ""}`}
            >
              All cities
            </button>
            {POPULAR_CITIES.map((city) => (
              <button
                key={city}
                onClick={() =>
                  apply({
                    ...filters,
                    city: filters.city === city ? undefined : city,
                    page: 1,
                  })
                }
                className={`chip shrink-0 ${filters.city === city ? "chip-active" : ""}`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* ── Results ────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-7 c3:grid-cols-3 c3:gap-x-4 c3:gap-y-9 c4:grid-cols-4 c5:grid-cols-5 c6:grid-cols-6 c7:grid-cols-7">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <EmptyState
              title="Could not load stays"
              description={error}
              actionLabel="Try again"
              onAction={() => load(filters)}
              icon={
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
                </svg>
              }
            />
          ) : rooms.length === 0 ? (
            <EmptyState
              title={hasAnyFilter ? "No stays match those filters" : "No stays listed yet"}
              description={
                hasAnyFilter
                  ? "Try widening your price range or clearing a filter or two."
                  : "New listings appear here as soon as our team approves them."
              }
              actionLabel={hasAnyFilter ? "Clear filters" : undefined}
              onAction={
                hasAnyFilter
                  ? () => {
                      setSearchDraft("");
                      apply({ sort: "newest", page: 1 });
                    }
                  : undefined
              }
              icon={
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-3 gap-y-7 c3:grid-cols-3 c3:gap-x-4 c3:gap-y-9 c4:grid-cols-4 c5:grid-cols-5 c6:grid-cols-6 c7:grid-cols-7">
                {rooms.map((room, i) => (
                  <RoomCard key={room.id} room={room} priority={i < 4} />
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <Pager
                  pagination={pagination}
                  onPage={(page) => apply({ ...filters, page })}
                />
              )}
            </>
          )}
        </section>
      </main>

      <FilterSheet
        open={sheetOpen}
        initial={filters}
        onClose={() => setSheetOpen(false)}
        onApply={apply}
      />
    </PageTransition>
  );
}

function SkeletonCard() {
  return (
    <div>
      <div className="aspect-square w-full animate-pulse rounded-2xl bg-ink-3" />
      <div className="mt-2.5 space-y-2">
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-ink-3" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-ink-3" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-ink-3" />
      </div>
    </div>
  );
}

function Pager({
  pagination,
  onPage,
}: {
  pagination: Pagination;
  onPage: (page: number) => void;
}) {
  const { page, totalPages } = pagination;

  // Keep the control to a fixed width on mobile: a window of pages, never a
  // row that grows until it overflows.
  const windowSize = 3;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-2"
    >
      <button
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="btn-ghost h-11 w-11 shrink-0 disabled:pointer-events-none disabled:opacity-35"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          aria-current={p === page ? "page" : undefined}
          className={`h-11 w-11 shrink-0 rounded-full font-mono text-sm transition-colors ${
            p === page
              ? "bg-amber font-bold text-[color:var(--btn-amber-fg)]"
              : "border border-line text-muted hover:border-line-strong hover:text-paper"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="btn-ghost h-11 w-11 shrink-0 disabled:pointer-events-none disabled:opacity-35"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </nav>
  );
}
