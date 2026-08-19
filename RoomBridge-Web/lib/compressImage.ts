/**
 * Downscale and re-encode an image so it fits inside a byte budget.
 *
 * Room photos are capped at 400KB server-side because storage is limited, but a photo
 * straight off a phone is 2–6MB. Without this every real upload would bounce, so the
 * browser shrinks the file first: cap the longest edge, then step quality (and, if
 * needed, dimensions) down until it fits.
 */

export interface CompressResult {
  file: File;
  originalBytes: number;
  bytes: number;
  /** false when the image could not be squeezed under the budget */
  withinBudget: boolean;
}

const QUALITY_STEPS = [0.82, 0.72, 0.62, 0.5, 0.4];
const EDGE_STEPS = [1600, 1280, 1024, 800];

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image"));
    };
    img.src = url;
  });
}

function toBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

export async function compressImage(
  file: File,
  maxBytes: number
): Promise<CompressResult> {
  const originalBytes = file.size;

  // Already small enough — don't re-encode and lose quality for nothing.
  if (originalBytes <= maxBytes) {
    return { file, originalBytes, bytes: originalBytes, withinBudget: true };
  }

  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { file, originalBytes, bytes: originalBytes, withinBudget: false };
  }

  // Prefer WebP; browsers that can't encode it silently hand back a PNG, which is
  // bigger than the JPEG we'd rather fall back to.
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const supportsWebp = probe.toDataURL("image/webp").startsWith("data:image/webp");
  const mime = supportsWebp ? "image/webp" : "image/jpeg";
  const extension = supportsWebp ? "webp" : "jpg";

  let best: Blob | null = null;

  for (const edge of EDGE_STEPS) {
    const scale = Math.min(1, edge / Math.max(img.width, img.height));
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    for (const quality of QUALITY_STEPS) {
      const blob = await toBlob(canvas, mime, quality);
      if (!blob) continue;
      // Keep the smallest result seen, so a failure still returns our best effort.
      if (!best || blob.size < best.size) best = blob;
      if (blob.size <= maxBytes) {
        return {
          file: rename(blob, file.name, extension, mime),
          originalBytes,
          bytes: blob.size,
          withinBudget: true,
        };
      }
    }
  }

  if (!best) {
    return { file, originalBytes, bytes: originalBytes, withinBudget: false };
  }

  return {
    file: rename(best, file.name, extension, mime),
    originalBytes,
    bytes: best.size,
    withinBudget: best.size <= maxBytes,
  };
}

function rename(blob: Blob, originalName: string, extension: string, mime: string): File {
  const base = originalName.replace(/\.[^./\\]+$/, "") || "photo";
  return new File([blob], `${base}.${extension}`, { type: mime });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
