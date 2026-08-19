"use client";

import { useEffect, useState } from "react";
import { AMENITY_OPTIONS } from "@/types/room";
import type { RoomFilters, SortOption } from "@/types/room";

const SORTS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

const GUEST_OPTIONS = [1, 2, 4, 6, 8];

/**
 * Filter surface. On phones it is a bottom sheet (thumb-reachable actions pinned
 * to the bottom); from `sm` up it centres as a dialog. Draft state is local so
 * nothing refetches until the user commits.
 */
export default function FilterSheet({
  open,
  initial,
  onClose,
  onApply,
}: {
  open: boolean;
  initial: RoomFilters;
  onClose: () => void;
  onApply: (filters: RoomFilters) => void;
}) {
  const [draft, setDraft] = useState<RoomFilters>(initial);

  // Re-seed the draft whenever the sheet is (re)opened.
  useEffect(() => {
    if (open) setDraft(initial);
  }, [open, initial]);

  // Lock background scroll while the sheet is up, otherwise iOS scrolls the page
  // underneath the overlay.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const toggleAmenity = (amenity: string) => {
    const current = draft.amenities ?? [];
    setDraft({
      ...draft,
      amenities: current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity],
    });
  };

  const reset = () =>
    setDraft({ city: draft.city, search: draft.search, sort: "newest" });

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className="relative flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-line bg-ink shadow-2xl sm:max-w-lg sm:rounded-3xl"
      >
        {/* Grab handle — signals the sheet is dismissable on touch */}
        <div className="flex justify-center pt-3 sm:hidden">
          <span className="h-1.5 w-10 rounded-full bg-line-strong" />
        </div>

        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-paper">Filters</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-paper"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          <section>
            <span className="label">Price per night (₹)</span>
            <div className="flex items-center gap-3">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="Min"
                value={draft.minPrice ?? ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    minPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="field"
              />
              <span className="text-faint">–</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="Max"
                value={draft.maxPrice ?? ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="field"
              />
            </div>
          </section>

          <section className="mt-6">
            <span className="label">Guests</span>
            <div className="flex flex-wrap gap-2">
              {GUEST_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() =>
                    setDraft({ ...draft, guests: draft.guests === n ? undefined : n })
                  }
                  className={`chip ${draft.guests === n ? "chip-active" : ""}`}
                >
                  {n}+
                </button>
              ))}
            </div>
          </section>

          <section className="mt-6">
            <span className="label">Bedrooms</span>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      bedrooms: draft.bedrooms === n ? undefined : n,
                    })
                  }
                  className={`chip ${draft.bedrooms === n ? "chip-active" : ""}`}
                >
                  {n}+
                </button>
              ))}
            </div>
          </section>

          <section className="mt-6">
            <span className="label">Amenities</span>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`chip ${
                    draft.amenities?.includes(amenity) ? "chip-active" : ""
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-6">
            <span className="label">Sort by</span>
            <div className="flex flex-col gap-2">
              {SORTS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDraft({ ...draft, sort: option.value })}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    (draft.sort ?? "newest") === option.value
                      ? "border-amber/55 bg-amber/10 text-paper"
                      : "border-line text-muted hover:border-line-strong hover:text-paper"
                  }`}
                >
                  {option.label}
                  {(draft.sort ?? "newest") === option.value && (
                    <svg className="h-4 w-4 text-amber" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>

        <footer className="flex items-center gap-3 border-t border-line bg-ink px-5 py-4 pb-safe">
          <button onClick={reset} className="btn-ghost flex-1 py-3 text-sm">
            Clear all
          </button>
          <button
            onClick={() => onApply({ ...draft, page: 1 })}
            className="btn-amber flex-[1.6] py-3 text-sm"
          >
            Show results
          </button>
        </footer>
      </div>
    </div>
  );
}
