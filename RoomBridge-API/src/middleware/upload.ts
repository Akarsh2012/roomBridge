import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { AppError } from "./errorHandler";

// 400 KB per file — storage is the constraint right now. The web client downscales
// and re-encodes before uploading, so real phone photos still get through.
export const MAX_IMAGE_BYTES = 400 * 1024;
export const MAX_IMAGES_PER_ROOM = 10;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

// memoryStorage — the buffer is piped straight to Cloudinary, nothing touches disk.
const handler = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_BYTES, files: MAX_IMAGES_PER_ROOM },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(
        new AppError("Only JPEG, PNG, WebP or AVIF images are allowed", 400)
      );
    }
    cb(null, true);
  },
}).array("images", MAX_IMAGES_PER_ROOM);

// Multer raises its own MulterError type, which the global handler would report as a
// generic 500. Translate the ones a user can actually cause into readable 400s.
export const uploadRoomImages = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  handler(req, res, (err: unknown) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? `Each image must be under ${Math.round(MAX_IMAGE_BYTES / 1024)}KB`
          : err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE"
          ? `You can upload at most ${MAX_IMAGES_PER_ROOM} images`
          : "Image upload failed";
      return next(new AppError(message, 400));
    }

    next(err);
  });
};
