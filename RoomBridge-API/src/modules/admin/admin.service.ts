import { z } from "zod/v4";
import prisma from "../../config/db";
import { AppError } from "../../middleware/errorHandler";
import { Prisma } from "../../generated/prisma/client";
import { RoomStatus } from "../../generated/prisma/enums";

// ─── Validation Schemas ──────────────────────────────

const queueQuerySchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "ALL"]).default("PENDING"),
  search: z.string().trim().min(1).max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

const rejectSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(10, "Give the host a reason of at least 10 characters")
    .max(500),
});

const moderationSelect = {
  id: true,
  title: true,
  description: true,
  price: true,
  location: true,
  address: true,
  city: true,
  country: true,
  maxGuests: true,
  bedrooms: true,
  bathrooms: true,
  amenities: true,
  images: true,
  status: true,
  rejectionReason: true,
  isActive: true,
  submittedAt: true,
  reviewedAt: true,
  createdAt: true,
  host: {
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
      emailVerified: true,
    },
  },
  reviewedBy: { select: { id: true, name: true } },
} satisfies Prisma.RoomSelect;

// ─── Service Functions ───────────────────────────────

/** The moderation queue. Defaults to PENDING, oldest submission first (FIFO). */
export async function listRoomsForModeration(query: unknown) {
  const parsed = queueQuerySchema.safeParse(query);
  if (!parsed.success) throw new AppError(parsed.error.issues[0].message, 400);
  const { status, search, page, limit } = parsed.data;

  const where: Prisma.RoomWhereInput = {
    ...(status !== "ALL" && { status: status as RoomStatus }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { host: { name: { contains: search, mode: "insensitive" } } },
        { host: { email: { contains: search, mode: "insensitive" } } },
      ],
    }),
  };

  const [rooms, total] = await Promise.all([
    prisma.room.findMany({
      where,
      // Pending queue is worked oldest-first; reviewed lists read newest-first.
      orderBy:
        status === "PENDING" ? { submittedAt: "asc" } : { reviewedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: moderationSelect,
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

/** Approve a listing — this is the moment it becomes publicly visible. */
export async function approveRoom(roomId: string, adminId: string) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { id: true, status: true, images: true },
  });
  if (!room) throw new AppError("Room not found", 404);
  if (room.status === RoomStatus.APPROVED) {
    throw new AppError("This listing is already approved", 400);
  }
  if (room.images.length === 0) {
    throw new AppError("Cannot approve a listing with no photos", 400);
  }

  return prisma.room.update({
    where: { id: roomId },
    data: {
      status: RoomStatus.APPROVED,
      rejectionReason: null,
      reviewedAt: new Date(),
      reviewedById: adminId,
    },
    select: moderationSelect,
  });
}

/** Reject a listing. A reason is mandatory — the host is shown it verbatim. */
export async function rejectRoom(roomId: string, adminId: string, input: unknown) {
  const parsed = rejectSchema.safeParse(input);
  if (!parsed.success) throw new AppError(parsed.error.issues[0].message, 400);

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { id: true, status: true },
  });
  if (!room) throw new AppError("Room not found", 404);
  if (room.status === RoomStatus.REJECTED) {
    throw new AppError("This listing is already rejected", 400);
  }

  return prisma.room.update({
    where: { id: roomId },
    data: {
      status: RoomStatus.REJECTED,
      rejectionReason: parsed.data.reason,
      reviewedAt: new Date(),
      reviewedById: adminId,
    },
    select: moderationSelect,
  });
}

/** Counters for the admin dashboard header. */
export async function getStats() {
  const [pending, approved, rejected, users, bookings, liveRooms] =
    await Promise.all([
      prisma.room.count({ where: { status: RoomStatus.PENDING } }),
      prisma.room.count({ where: { status: RoomStatus.APPROVED } }),
      prisma.room.count({ where: { status: RoomStatus.REJECTED } }),
      prisma.user.count(),
      prisma.booking.count(),
      prisma.room.count({
        where: { status: RoomStatus.APPROVED, isActive: true },
      }),
    ]);

  return {
    rooms: { pending, approved, rejected, live: liveRooms },
    users,
    bookings,
  };
}

/** Basic user list for the admin panel. */
export async function listUsers(query: unknown) {
  const parsed = z
    .object({
      search: z.string().trim().min(1).max(120).optional(),
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(50).default(20),
    })
    .safeParse(query);
  if (!parsed.success) throw new AppError(parsed.error.issues[0].message, 400);
  const { search, page, limit } = parsed.data;

  const where: Prisma.UserWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        emailVerified: true,
        createdAt: true,
        _count: { select: { rooms: true, bookings: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasMore: page * limit < total,
    },
  };
}
