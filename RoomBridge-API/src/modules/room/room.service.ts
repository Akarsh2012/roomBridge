import { z } from "zod/v4";
import prisma from "../../config/db";
import cloudinary from "../../config/cloudinary";
import { AppError } from "../../middleware/errorHandler";
import { MAX_IMAGES_PER_ROOM } from "../../middleware/upload";
import { Prisma } from "../../generated/prisma/client";
import { RoomStatus } from "../../generated/prisma/enums";

// ─── Validation Schemas ──────────────────────────────

const AMENITIES_MAX = 30;

const roomFields = {
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(120),
  description: z
    .string()
    .trim()
    .min(30, "Description must be at least 30 characters")
    .max(4000),
  price: z.coerce
    .number()
    .positive("Price must be greater than 0")
    .max(1_000_000, "Price looks unrealistic"),
  location: z.string().trim().min(2).max(160),
  address: z.string().trim().max(300).optional(),
  city: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80).optional(),
  maxGuests: z.coerce.number().int().min(1).max(50),
  bedrooms: z.coerce.number().int().min(0).max(30),
  bathrooms: z.coerce.number().int().min(0).max(30),
  amenities: z.array(z.string().trim().min(1).max(40)).max(AMENITIES_MAX).optional(),
};

const createRoomSchema = z.object(roomFields);
const updateRoomSchema = z.object(roomFields).partial().extend({
  isActive: z.boolean().optional(),
});

const listQuerySchema = z.object({
  city: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).max(120).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  guests: z.coerce.number().int().min(1).optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  amenities: z
    .union([z.string(), z.array(z.string())])
    .transform((v) => (Array.isArray(v) ? v : v.split(",")))
    .pipe(z.array(z.string().trim().min(1)))
    .optional(),
  sort: z
    .enum(["newest", "price_asc", "price_desc"])
    .default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
});

export type ListQuery = z.input<typeof listQuerySchema>;

// ─── Shared Selects ──────────────────────────────────

const hostSelect = {
  select: { id: true, name: true, avatar: true, createdAt: true },
};

// Public callers never see moderation internals of other people's rooms.
const publicRoomSelect = {
  id: true,
  title: true,
  description: true,
  price: true,
  location: true,
  city: true,
  country: true,
  maxGuests: true,
  bedrooms: true,
  bathrooms: true,
  amenities: true,
  images: true,
  createdAt: true,
  host: hostSelect,
} satisfies Prisma.RoomSelect;

// The owner (and admins) additionally see where the listing sits in moderation.
const ownerRoomSelect = {
  ...publicRoomSelect,
  address: true,
  status: true,
  rejectionReason: true,
  isActive: true,
  submittedAt: true,
  reviewedAt: true,
  updatedAt: true,
} satisfies Prisma.RoomSelect;

// ─── Helpers ─────────────────────────────────────────

/**
 * A listing is publicly visible only when an admin has approved it AND the host
 * has not paused it. `status` is the admin verdict; `isActive` is the host switch.
 */
const PUBLIC_VISIBILITY: Prisma.RoomWhereInput = {
  status: RoomStatus.APPROVED,
  isActive: true,
};

/** Fields that change what an admin actually vetted — editing them forces re-review. */
const MODERATED_FIELDS = [
  "title",
  "description",
  "location",
  "address",
  "city",
  "country",
  "amenities",
] as const;

async function findOwnedRoom(roomId: string, userId: string) {
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) throw new AppError("Room not found", 404);
  if (room.hostId !== userId) {
    throw new AppError("You can only manage your own listings", 403);
  }
  return room;
}

function uploadBufferToCloudinary(buffer: Buffer, roomId: string) {
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `roombridge/rooms/${roomId}`,
        resource_type: "image",
        // Cap stored dimensions — storage is limited, and nothing in the UI renders
        // wider than this.
        transformation: [{ width: 1600, height: 1600, crop: "limit" }],
      },
      (error, result) => {
        if (error || !result) {
          return reject(new AppError("Image upload failed", 502));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

// ─── Service Functions ───────────────────────────────

/**
 * Public, paginated room search. Only ever returns admin-approved, host-active rooms.
 */
export async function listRooms(query: ListQuery) {
  const parsed = listQuerySchema.safeParse(query);
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0].message, 400);
  }
  const {
    city,
    search,
    minPrice,
    maxPrice,
    guests,
    bedrooms,
    amenities,
    sort,
    page,
    limit,
  } = parsed.data;

  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    throw new AppError("minPrice cannot be greater than maxPrice", 400);
  }

  const where: Prisma.RoomWhereInput = {
    ...PUBLIC_VISIBILITY,
    ...(city && { city: { equals: city, mode: "insensitive" } }),
    ...(guests && { maxGuests: { gte: guests } }),
    ...(bedrooms !== undefined && { bedrooms: { gte: bedrooms } }),
    ...(amenities?.length && { amenities: { hasEvery: amenities } }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const orderBy: Prisma.RoomOrderByWithRelationInput =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
      ? { price: "desc" }
      : { createdAt: "desc" };

  const [rooms, total] = await Promise.all([
    prisma.room.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: publicRoomSelect,
    }),
    prisma.room.count({ where }),
  ]);

  return {
    rooms,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasMore: page * limit < total,
    },
  };
}

/**
 * Single room. A pending/rejected room is readable only by its host or an admin —
 * to everyone else it does not exist.
 */
export async function getRoomById(
  roomId: string,
  viewer?: { userId: string; role: string }
) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { ...ownerRoomSelect, hostId: true },
  });
  if (!room) throw new AppError("Room not found", 404);

  const isOwner = viewer?.userId === room.hostId;
  const isAdmin = viewer?.role === "ADMIN";
  const isPublic = room.status === RoomStatus.APPROVED && room.isActive;

  if (!isPublic && !isOwner && !isAdmin) {
    // Deliberately 404, not 403 — don't confirm the existence of unlisted rooms.
    throw new AppError("Room not found", 404);
  }

  const [reviews, aggregate] = await Promise.all([
    prisma.review.findMany({
      where: { roomId },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: { select: { id: true, name: true, avatar: true } },
      },
    }),
    prisma.review.aggregate({
      where: { roomId },
      _avg: { rating: true },
      _count: { rating: true },
    }),
  ]);

  const { hostId, ...rest } = room;
  const publicView = isOwner || isAdmin ? rest : stripModerationFields(rest);

  return {
    ...publicView,
    isOwner,
    rating: {
      average: aggregate._avg.rating ? Number(aggregate._avg.rating.toFixed(2)) : null,
      count: aggregate._count.rating,
    },
    reviews,
  };
}

function stripModerationFields<T extends Record<string, unknown>>(room: T) {
  const { status, rejectionReason, isActive, submittedAt, reviewedAt, address, ...rest } =
    room as Record<string, unknown>;
  return rest as Omit<
    T,
    "status" | "rejectionReason" | "isActive" | "submittedAt" | "reviewedAt" | "address"
  >;
}

/**
 * Create a listing. It is NOT published — it enters the admin moderation queue.
 */
export async function createRoom(userId: string, input: unknown) {
  const parsed = createRoomSchema.safeParse(input);
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0].message, 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true },
  });
  if (!user) throw new AppError("User not found", 404);
  if (!user.emailVerified) {
    throw new AppError("Verify your email before listing a room", 403);
  }

  return prisma.room.create({
    data: {
      ...parsed.data,
      amenities: parsed.data.amenities ?? [],
      hostId: userId,
      status: RoomStatus.PENDING,
    },
    select: ownerRoomSelect,
  });
}

/**
 * Update a listing. Touching anything an admin vetted sends it back to PENDING.
 */
export async function updateRoom(roomId: string, userId: string, input: unknown) {
  const parsed = updateRoomSchema.safeParse(input);
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0].message, 400);
  }
  if (Object.keys(parsed.data).length === 0) {
    throw new AppError("No fields to update", 400);
  }

  const room = await findOwnedRoom(roomId, userId);

  const touchesModeratedContent = MODERATED_FIELDS.some(
    (field) => parsed.data[field] !== undefined
  );
  const needsReReview =
    touchesModeratedContent && room.status === RoomStatus.APPROVED;

  return prisma.room.update({
    where: { id: roomId },
    data: {
      ...parsed.data,
      ...(needsReReview && {
        status: RoomStatus.PENDING,
        submittedAt: new Date(),
        reviewedAt: null,
        reviewedById: null,
        rejectionReason: null,
      }),
    },
    select: ownerRoomSelect,
  });
}

/** Host resubmits a rejected listing after fixing whatever the admin flagged. */
export async function resubmitRoom(roomId: string, userId: string) {
  const room = await findOwnedRoom(roomId, userId);
  if (room.status !== RoomStatus.REJECTED) {
    throw new AppError("Only rejected listings can be resubmitted", 400);
  }
  if (room.images.length === 0) {
    throw new AppError("Add at least one photo before resubmitting", 400);
  }

  return prisma.room.update({
    where: { id: roomId },
    data: {
      status: RoomStatus.PENDING,
      submittedAt: new Date(),
      reviewedAt: null,
      reviewedById: null,
      rejectionReason: null,
    },
    select: ownerRoomSelect,
  });
}

/** Soft delete — bookings and reviews must keep pointing at a real row. */
export async function deleteRoom(roomId: string, userId: string) {
  await findOwnedRoom(roomId, userId);
  await prisma.room.update({
    where: { id: roomId },
    data: { isActive: false },
  });
}

/** The host's own listings, including everything still awaiting or refused review. */
export async function getMyListings(userId: string) {
  return prisma.room.findMany({
    where: { hostId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      ...ownerRoomSelect,
      _count: { select: { bookings: true, reviews: true } },
    },
  });
}

/**
 * Upload images to Cloudinary and append the returned URLs to the room.
 */
export async function uploadRoomImages(
  roomId: string,
  userId: string,
  files: Express.Multer.File[]
) {
  if (!files?.length) throw new AppError("No images provided", 400);

  const room = await findOwnedRoom(roomId, userId);

  if (room.images.length + files.length > MAX_IMAGES_PER_ROOM) {
    throw new AppError(
      `A listing can have at most ${MAX_IMAGES_PER_ROOM} images ` +
        `(${room.images.length} already uploaded)`,
      400
    );
  }

  const uploaded = await Promise.all(
    files.map((file) => uploadBufferToCloudinary(file.buffer, roomId))
  );

  return prisma.room.update({
    where: { id: roomId },
    data: { images: { push: uploaded.map((u) => u.url) } },
    select: ownerRoomSelect,
  });
}

/** Remove one image from a listing (and from Cloudinary). */
export async function deleteRoomImage(
  roomId: string,
  userId: string,
  imageUrl: string
) {
  if (!imageUrl) throw new AppError("imageUrl is required", 400);

  const room = await findOwnedRoom(roomId, userId);
  if (!room.images.includes(imageUrl)) {
    throw new AppError("Image not found on this listing", 404);
  }

  const publicId = extractPublicId(imageUrl);
  if (publicId) {
    // Best-effort: a stale Cloudinary asset must not block the DB update.
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error("[cloudinary] failed to destroy", publicId, err);
    }
  }

  return prisma.room.update({
    where: { id: roomId },
    data: { images: room.images.filter((img) => img !== imageUrl) },
    select: ownerRoomSelect,
  });
}

/** `https://res.cloudinary.com/<cloud>/image/upload/v123/roombridge/rooms/<id>/abc.jpg` → public id */
function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:[^/]+\/)*?v\d+\/(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}
