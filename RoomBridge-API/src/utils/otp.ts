import crypto from "crypto";
import bcrypt from "bcryptjs";

// Generate a 6-digit OTP
export const generateOtp = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

// Hash the OTP before storing in DB
export const hashOtp = async (otp: string): Promise<string> => {
  return bcrypt.hash(otp, 6);
};

// Compare user-entered OTP with hashed OTP
export const compareOtp = async (otp: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(otp, hashed);
};
