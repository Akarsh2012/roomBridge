import { Request, Response, NextFunction } from "express";
import { z } from "zod/v4";
import prisma from "../config/db";
import { hashPassword, comparePassword } from "../utils/password";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { AppError } from "../middleware/errorHandler";
import { generateOtp, hashOtp } from "../utils/otp";
import { sendOtpEmail } from "../utils/sendEmails";

// ─── Validation Schemas ──────────────────────────────

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["GUEST", "HOST"]).optional(),
});

const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

// ─── Helper: Generate & Store Tokens ─────────────────

const generateTokens = async (userId: string, role: string) => {
  const accessToken = generateAccessToken({ userId, role });
  const refreshToken = generateRefreshToken({ userId, role });

  // Store refresh token in DB
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return { accessToken, refreshToken };
};

// ─── POST /api/auth/register ─────────────────────────

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0].message, 400);
    }

    const { name, email, password, role } = parsed.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError("Email already registered", 409);
    }

    // Hash password and create user
    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || "GUEST" },
    });

    // Generate tokens
    const tokens = await generateTokens(user.id, user.role);

    // Auto-send OTP for email verification
    try {
      const otp = generateOtp();
      console.log(`[OTP] Generated OTP for ${user.email}: ${otp}`);
      const hashedOtp = await hashOtp(otp);
      await prisma.otp.create({
        data: {
          code: hashedOtp,
          userId: user.id,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        },
      });
      console.log(`[OTP] Stored in DB, sending email to ${user.email}...`);
      await sendOtpEmail(user.email, otp, user.name);
      console.log(`[OTP] Email sent successfully to ${user.email}`);
    } catch (err) {
      console.error(`[OTP] Failed to send OTP email:`, err);
    }

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/login ────────────────────────────

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0].message, 400);
    }

    const { email, password } = parsed.data;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    // Generate tokens
    const tokens = await generateTokens(user.id, user.role);

    // If email not verified, auto-send OTP
    if (!user.emailVerified) {
      try {
        // Delete old OTPs
        await prisma.otp.deleteMany({ where: { userId: user.id } });
        const otp = generateOtp();
        console.log(`[OTP] Login: Generated OTP for ${user.email}: ${otp}`);
        const hashedOtp = await hashOtp(otp);
        await prisma.otp.create({
          data: {
            code: hashedOtp,
            userId: user.id,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
          },
        });
        await sendOtpEmail(user.email, otp, user.name);
        console.log(`[OTP] Login: Email sent to ${user.email}`);
      } catch (err) {
        console.error(`[OTP] Login: Failed to send OTP:`, err);
      }
    }

    res.json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role, emailVerified: user.emailVerified },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/refresh ──────────────────────────

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    // Verify token signature
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError("Invalid refresh token", 401);
    }

    // Check if token exists in DB and isn't expired
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      // If token was in DB but expired, delete it
      if (storedToken) {
        await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      }
      throw new AppError("Refresh token expired or invalid", 401);
    }

    // Delete old refresh token (one-time use)
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    // Generate new token pair
    const tokens = await generateTokens(decoded.userId, decoded.role);

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/logout ───────────────────────────

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    // Delete the refresh token from DB
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/auth/me ────────────────────────────────

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};
