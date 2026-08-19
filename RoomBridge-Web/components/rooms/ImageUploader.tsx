"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { compressImage, formatBytes } from "@/lib/compressImage";

// Must stay in sync with MAX_IMAGE_BYTES in the API's upload middleware.
const MAX_KB = 400;
const MAX_BYTES = MAX_KB * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";

export interface PickedImage {
  file: File;
  preview: string;
  originalBytes: number;
}

/**
 * File picker with local previews. Validates size/type before anything hits the
 * network so a bad file gives instant feedback instead of a failed upload.
 */
export default function ImageUploader({
  picked,
  onChange,
  max,
  disabled = false,
}: {
  picked: PickedImage[];
  onChange: (next: PickedImage[]) => void;
  max: number;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [optimising, setOptimising] = useState(false);

  const addFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setError(null);

    const incoming = Array.from(fileList);
    const room = max - picked.length;

    if (room <= 0) {
      setError(`You can upload at most ${max} photos`);
      return;
    }

    setOptimising(true);
    const accepted: PickedImage[] = [];
    const tooBig: string[] = [];

    try {
      for (const file of incoming.slice(0, room)) {
        if (!ACCEPT.split(",").includes(file.type)) {
          setError("Only JPEG, PNG, WebP or AVIF images are allowed");
          continue;
        }

        // Phone photos run to several MB; shrink them to fit the budget instead of
        // rejecting them outright.
        let result;
        try {
          result = await compressImage(file, MAX_BYTES);
        } catch {
          setError(`Could not read "${file.name}"`);
          continue;
        }

        if (!result.withinBudget) {
          tooBig.push(file.name);
          continue;
        }

        accepted.push({
          file: result.file,
          preview: URL.createObjectURL(result.file),
          originalBytes: result.originalBytes,
        });
      }
    } finally {
      setOptimising(false);
    }

    if (tooBig.length) {
      setError(
        `Could not get ${tooBig.length === 1 ? `"${tooBig[0]}"` : `${tooBig.length} photos`} under ${MAX_KB}KB — try a smaller or less detailed image`
      );
    } else if (incoming.length > room) {
      setError(`Only the first ${room} photo${room === 1 ? "" : "s"} were added`);
    }

    if (accepted.length) onChange([...picked, ...accepted]);
  };

  const remove = (index: number) => {
    // Release the object URL so previews don't leak memory across a long session.
    URL.revokeObjectURL(picked[index].preview);
    onChange(picked.filter((_, i) => i !== index));
  };

  return (
    <div>
      <button
        type="button"
        disabled={disabled || optimising || picked.length >= max}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void addFiles(e.dataTransfer.files);
        }}
        className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-9 transition-colors ${
          dragging
            ? "border-amber bg-amber/10"
            : "border-line-strong bg-ink-2/50 hover:border-amber/50"
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber/12 text-amber">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </svg>
        </span>
        <span className="mt-3 text-sm font-medium text-paper">
          {optimising
            ? "Optimising photos…"
            : picked.length >= max
            ? "Photo limit reached"
            : "Add photos"}
        </span>
        <span className="mt-1 text-center font-mono text-[0.65rem] uppercase tracking-[0.14em] text-faint">
          {picked.length}/{max} · JPG, PNG, WebP · resized to under {MAX_KB}KB
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        onChange={(e) => {
          void addFiles(e.target.files);
          // Reset so picking the same file twice still fires onChange.
          e.target.value = "";
        }}
      />

      {error && (
        <p className="mt-2.5 text-sm text-[rgb(198_56_44)] dark:text-[rgb(248_141_130)]">
          {error}
        </p>
      )}

      {picked.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {picked.map((item, i) => (
            <li
              key={item.preview}
              className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-ink-3"
            >
              <Image
                src={item.preview}
                alt={`Photo ${i + 1}`}
                fill
                unoptimized
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover"
              />
              {i === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-white">
                  Cover
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 pt-4 font-mono text-[0.58rem] text-white/90">
                {item.originalBytes > item.file.size
                  ? `${formatBytes(item.originalBytes)} → ${formatBytes(item.file.size)}`
                  : formatBytes(item.file.size)}
              </span>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remove photo ${i + 1}`}
                disabled={disabled}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-[rgb(198_56_44)] disabled:opacity-50"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
