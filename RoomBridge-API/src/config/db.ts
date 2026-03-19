import { PrismaClient } from "../generated/prisma/client";

// Singleton pattern — one connection shared across the app
const prisma = new PrismaClient();

export default prisma;
