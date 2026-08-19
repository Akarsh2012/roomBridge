-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" TEXT,
ADD COLUMN     "status" "RoomStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Room_status_isActive_idx" ON "Room"("status", "isActive");

-- CreateIndex
CREATE INDEX "Room_hostId_idx" ON "Room"("hostId");

-- CreateIndex
CREATE INDEX "Room_city_idx" ON "Room"("city");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill: rooms that already existed pre-moderation are treated as vetted,
-- otherwise every seeded listing would silently drop out of public search.
UPDATE "Room" SET "status" = 'APPROVED', "reviewedAt" = "createdAt" WHERE "status" = 'PENDING';
