import { Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth"; // ensures global type is loaded
import prisma from "../config/db";
import { AppError } from "../middleware/errorHandler";
import { generateOtp, hashOtp, compareOtp } from "../utils/otp";
import { sendOtpEmail, sendWelcomeEmail } from "../utils/sendEmails";

// Force reference so TS doesn't tree-shake the import
void authenticate;

const OTP_EXPIRY_MINUTES = 5;
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_ATTEMPTS = 3;

// ─── POST /api/auth/send-otp ─────────────────────────

export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    console.log(`[SEND-OTP] Request from userId: ${userId}`);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);
    if (user.emailVerified) throw new AppError("Email already verified", 400);

    console.log(`[SEND-OTP] User found: ${user.email}, verified: ${user.emailVerified}`);

    // Check resend cooldown — last OTP must be at least 60s ago
    const lastOtp = await prisma.otp.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (lastOtp) {
      const secondsSinceLast = (Date.now() - lastOtp.createdAt.getTime()) / 1000;
      console.log(`[SEND-OTP] Last OTP was ${secondsSinceLast}s ago`);
      if (secondsSinceLast < RESEND_COOLDOWN_SECONDS) {
        const waitTime = Math.ceil(RESEND_COOLDOWN_SECONDS - secondsSinceLast);
        throw new AppError(`Please wait ${waitTime}s before requesting a new OTP`, 429);
      }
    }

    // Delete all old OTPs for this user
    await prisma.otp.deleteMany({ where: { userId } });

    // Generate, hash, and store new OTP
    const otp = generateOtp();
    console.log(`[SEND-OTP] Generated OTP: ${otp} for ${user.email}`);
    const hashedOtp = await hashOtp(otp);

    await prisma.otp.create({
      data: {
        code: hashedOtp,
        userId,
        expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
      },
    });
    console.log(`[SEND-OTP] OTP stored in DB, sending email...`);

    // Send OTP email
    await sendOtpEmail(user.email, otp, user.name);
    console.log(`[SEND-OTP] Email sent successfully!`);

    res.json({
      success: true,
      message: "OTP sent to your email",
      data: {
        expiresIn: OTP_EXPIRY_MINUTES * 60, // in seconds
        cooldown: RESEND_COOLDOWN_SECONDS,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/verify-otp ───────────────────────

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { otp } = req.body;
    console.log(`[VERIFY-OTP] Request from userId: ${userId}, otp: ${otp}`);

    if (!otp || typeof otp !== "string" || otp.length !== 6) {
      throw new AppError("Please enter a valid 6-digit OTP", 400);
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);
    if (user.emailVerified) throw new AppError("Email already verified", 400);

    // Find the latest OTP for this user
    const storedOtp = await prisma.otp.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!storedOtp) {
      throw new AppError("No OTP found. Please request a new one.", 400);
    }

    // Check expiry
    if (storedOtp.expiresAt < new Date()) {
      await prisma.otp.delete({ where: { id: storedOtp.id } });
      throw new AppError("OTP has expired. Please request a new one.", 410);
    }

    // Compare OTP
    const isMatch = await compareOtp(otp, storedOtp.code);
    console.log(`[VERIFY-OTP] OTP match: ${isMatch}`);
    if (!isMatch) {
      throw new AppError("Invalid OTP. Please try again.", 401);
    }

    // OTP is valid — verify email and clean up
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });
    console.log(`[VERIFY-OTP] Email verified for userId: ${userId}`);

    await prisma.otp.deleteMany({ where: { userId } });

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name, user.role);
      console.log(`[VERIFY-OTP] Welcome email sent to ${user.email}`);
    } catch (emailErr) {
      console.error(`[VERIFY-OTP] Welcome email failed:`, emailErr);
    }

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    console.error(`[VERIFY-OTP] Error:`, err);
    next(err);
  }
};
