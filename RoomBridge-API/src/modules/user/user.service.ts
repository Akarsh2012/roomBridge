import prisma from "../../config/db";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { AppError } from "../../middleware/errorHandler";

export const becomeHost = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404);

  if (user.role !== "GUEST") {
    throw new AppError(`You are already a ${user.role}`, 400);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: "HOST" },
  });

  const accessToken = generateAccessToken({ userId: updatedUser.id, role: updatedUser.role });
  const refreshToken = generateRefreshToken({ userId: updatedUser.id, role: updatedUser.role });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: updatedUser.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    },
    accessToken,
    refreshToken,
  };
};
