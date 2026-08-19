"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/**
 * Mobile: a single full-bleed snap rail with a counter — no fragile carousel JS.
 * From `md` up: an editorial mosaic. Both paths keep a fixed aspect ratio so a
 * portrait photo can never blow out the layout.
 */
export default function RoomGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);

  if (!images.length) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-ink-3 to-ink-4 md:aspect-[16/7]">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
          No photos yet
        </span>
      </div>
    );
  }

  const onScroll = () => {
    const rail = railRef.current;
    if (!rail) return;
    setIndex(Math.round(rail.scrollLeft / rail.clientWidth));
  };

  return (
    <>
      {/* ── Mobile rail ── */}
      <div className="relative md:hidden">
        <div
          ref={railRef}
          onScroll={onScroll}
          className="no-scrollbar snap-rail flex w-full overflow-x-auto rounded-2xl"
        >
          {images.map((src, i) => (
            <div
              key={src}
              className="snap-item relative aspect-[4/3] w-full shrink-0 bg-ink-3"
            >
              <Image
                src={src}
                alt={`${title} — photo ${i + 1}`}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[0.65rem] text-white backdrop-blur-md">
              {index + 1} / {images.length}
            </span>
            <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((src, i) => (
                <span
                  key={src}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-4 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Desktop mosaic ── */}
      <div className="hidden gap-2 md:grid md:grid-cols-4 md:grid-rows-2">
        <div className="relative col-span-2 row-span-2 aspect-[4/3] overflow-hidden rounded-l-2xl bg-ink-3">
          <Image
            src={images[0]}
            alt={title}
            fill
            priority
            sizes="50vw"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

        {Array.from({ length: 4 }).map((_, i) => {
          const src = images[i + 1];
          const isTopRight = i === 1;
          const isBottomRight = i === 3;
          const corner = isTopRight
            ? "rounded-tr-2xl"
            : isBottomRight
            ? "rounded-br-2xl"
            : "";

          return (
            <div
              key={src ?? `empty-${i}`}
              className={`relative overflow-hidden bg-gradient-to-br from-ink-3 to-ink-4 ${corner}`}
            >
              {src && (
                <Image
                  src={src}
                  alt={`${title} — photo ${i + 2}`}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              )}
              {/* "+N more" overlay on the last visible tile */}
              {isBottomRight && images.length > 5 && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/45 font-mono text-sm text-white backdrop-blur-[2px]">
                  +{images.length - 5} more
                </span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
