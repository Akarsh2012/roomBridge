import { z } from "zod/v4";
import prisma from "../../config/db";
import { hashPassword, comparePassword } from "../../utils/password";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import { AppError } from "../../middleware/errorHandler";
import { generateOtp, hashOtp } from "../../utils/otp";
import { sendOtpEmail } from "../../utils/sendEmails";

// ─── Validation Schemas ──────────────────────────────

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

// ─── Helper Functions ────────────────────────────────

async function generateTokens(userId: string, role: string) {
  const accessToken = generateAccessToken({ userId, role });
  const refreshToken = generateRefreshToken({ userId, role });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
}

async function autoSendOtp(userId: string, email: string, name: string) {
  try {
    await prisma.otp.deleteMany({ where: { userId } });
    const otp = generateOtp();
    console.log(`[OTP] Generated OTP for ${email}: ${otp}`);
    const hashedOtp = await hashOtp(otp);
    await prisma.otp.create({
      data: {
        code: hashedOtp,
        userId,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
    await sendOtpEmail(email, otp, name);
    console.log(`[OTP] Email sent to ${email}`);
  } catch (err) {
    console.error(`[OTP] Failed to send OTP:`, err);
  }
}

// ─── Service Functions ───────────────────────────────

async function registerUser(body: unknown) {
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0].message, 400);
  }

  const { name, email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  const tokens = await generateTokens(user.id, user.role);
  await autoSendOtp(user.id, user.email, user.name);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

async function loginUser(body: unknown) {
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0].message, 400);
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("Invalid email or password", 401);

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new AppError("Invalid email or password", 401);

  const tokens = await generateTokens(user.id, user.role);

  if (!user.emailVerified) {
    await autoSendOtp(user.id, user.email, user.name);
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

async function refreshTokens(refreshToken: string) {
  if (!refreshToken) throw new AppError("Refresh token is required", 400);

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    if (storedToken) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    }
    throw new AppError("Refresh token expired or invalid", 401);
  }

  await prisma.refreshToken.delete({ where: { id: storedToken.id } });
  const tokens = await generateTokens(decoded.userId, decoded.role);

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

async function logoutUser(refreshToken: string) {
  if (!refreshToken) throw new AppError("Refresh token is required", 400);
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
}

async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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

  if (!user) throw new AppError("User not found", 404);
  return user;
}

// ─── Exports ─────────────────────────────────────────

module.exports = {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  getMe,
};

export { registerUser, loginUser, refreshTokens, logoutUser, getMe };
