"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Room } from "@/types/room";

/**
 * Listing card, Airbnb-style: a square photo sitting directly on the page with no
 * card chrome, and compact text underneath. Cards are narrow (two per row on a
 * phone), so every text line truncates rather than wrapping the layout apart.
 */
export default function RoomCard({
  room,
  priority = false,
}: {
  room: Room;
  priority?: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const cover = room.images?.[0];
  const showImage = Boolean(cover) && !imgFailed;

  return (
    <Link
      href={`/rooms/${room.id}`}
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[rgb(var(--ink))]"
    >
      {/* Square box: a portrait or panoramic upload still lands in the same footprint */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-ink-3">
        {showImage ? (
          <Image
            src={cover}
            alt={room.title}
            fill
            priority={priority}
            onError={() => setImgFailed(true)}
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
            // widths mirror the c3..c7 grid breakpoints
            sizes="(max-width: 549px) 50vw, (max-width: 743px) 33vw, (max-width: 949px) 25vw, (max-width: 1127px) 20vw, (max-width: 1439px) 17vw, 14vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-3 to-ink-4">
            <span className="px-2 text-center font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
              No photo
            </span>
          </div>
        )}

        {/* Hairline keeps the photo from bleeding into a light background */}
        <span
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-[rgb(var(--paper)/0.08)]"
          aria-hidden
        />
      </div>

      <div className="mt-2.5 min-w-0">
        <h3 className="truncate text-[0.85rem] font-semibold leading-snug text-paper sm:text-[0.95rem]">
          {room.title}
        </h3>
        <p className="mt-0.5 truncate text-[0.78rem] text-muted sm:text-[0.85rem]">
          {room.location}, {room.city}
        </p>
        <p className="mt-1 truncate text-[0.8rem] text-muted sm:text-[0.875rem]">
          <span className="font-semibold text-paper">
            ₹{room.price.toLocaleString("en-IN")}
          </span>{" "}
          night
          <span className="text-faint"> · {room.maxGuests} guests</span>
        </p>
      </div>
    </Link>
  );
}
