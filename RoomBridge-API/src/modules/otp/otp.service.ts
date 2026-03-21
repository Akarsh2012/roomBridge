import prisma from "../../config/db";
import { AppError } from "../../middleware/errorHandler";
import { generateOtp, hashOtp, compareOtp } from "../../utils/otp";
import { sendOtpEmail, sendWelcomeEmail } from "../../utils/sendEmails";

const OTP_EXPIRY_MINUTES = 5;
const RESEND_COOLDOWN_SECONDS = 60;

export const sendOtpToUser = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404);
  if (user.emailVerified) throw new AppError("Email already verified", 400);

  // Check resend cooldown
  const lastOtp = await prisma.otp.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (lastOtp) {
    const secondsSinceLast = (Date.now() - lastOtp.createdAt.getTime()) / 1000;
    if (secondsSinceLast < RESEND_COOLDOWN_SECONDS) {
      const waitTime = Math.ceil(RESEND_COOLDOWN_SECONDS - secondsSinceLast);
      throw new AppError(`Please wait ${waitTime}s before requesting a new OTP`, 429);
    }
  }

  // Delete old OTPs, generate new one
  await prisma.otp.deleteMany({ where: { userId } });

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

  await sendOtpEmail(user.email, otp, user.name);
  console.log(`[SEND-OTP] Email sent to ${user.email}`);

  return {
    expiresIn: OTP_EXPIRY_MINUTES * 60,
    cooldown: RESEND_COOLDOWN_SECONDS,
  };
};

export const verifyUserOtp = async (userId: string, otp: string) => {
  if (!otp || typeof otp !== "string" || otp.length !== 6) {
    throw new AppError("Please enter a valid 6-digit OTP", 400);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404);
  if (user.emailVerified) throw new AppError("Email already verified", 400);

  const storedOtp = await prisma.otp.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!storedOtp) throw new AppError("No OTP found. Please request a new one.", 400);

  if (storedOtp.expiresAt < new Date()) {
    await prisma.otp.delete({ where: { id: storedOtp.id } });
    throw new AppError("OTP has expired. Please request a new one.", 410);
  }

  const isMatch = await compareOtp(otp, storedOtp.code);
  if (!isMatch) throw new AppError("Invalid OTP. Please try again.", 401);

  // Verify email and clean up
  await prisma.user.update({
    where: { id: userId },
    data: { emailVerified: true },
  });

  await prisma.otp.deleteMany({ where: { userId } });

  // Send welcome email
  try {
    await sendWelcomeEmail(user.email, user.name, user.role);
    console.log(`[VERIFY-OTP] Welcome email sent to ${user.email}`);
  } catch (emailErr) {
    console.error(`[VERIFY-OTP] Welcome email failed:`, emailErr);
  }
};
