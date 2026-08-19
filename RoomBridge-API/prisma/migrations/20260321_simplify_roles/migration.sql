-- Simplify roles: GUEST/HOST → USER, keep ADMIN
-- NOTE: the column must be cast to TEXT *before* the UPDATE. Writing 'USER' while the
-- column still uses the old enum type fails with `invalid input value for enum "Role"`,
-- which breaks any replay against a fresh database (shadow DB, CI, first prod deploy).
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE TEXT;
UPDATE "User" SET "role" = 'USER' WHERE "role" IN ('GUEST', 'HOST');
DROP TYPE "Role" CASCADE;
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role" USING "role"::"Role";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
