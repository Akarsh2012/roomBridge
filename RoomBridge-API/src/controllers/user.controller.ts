import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { AppError } from "../middleware/errorHandler";

// ─── PATCH /api/users/become-host ────────────────────

export const becomeHost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    // Find user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Only GUESTs can become HOSTs
    if (user.role !== "GUEST") {
      throw new AppError(`You are already a ${user.role}`, 400);
    }

    // Update role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: "HOST" },
    });

    // Generate new tokens with updated role
    const accessToken = generateAccessToken({ userId: updatedUser.id, role: updatedUser.role });
    const refreshToken = generateRefreshToken({ userId: updatedUser.id, role: updatedUser.role });

    // Store new refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: updatedUser.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      success: true,
      message: "You are now a Host! You can start listing rooms.",
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};
