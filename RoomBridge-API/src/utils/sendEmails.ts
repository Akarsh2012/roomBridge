import nodemailer from "nodemailer";
import { env } from "../config/env";

console.log(`[EMAIL] SMTP configured with: ${env.SMTP_EMAIL}`);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.SMTP_EMAIL,
    pass: env.SMTP_PASSWORD,
  },
});

// ─── OTP Email ───────────────────────────────────────

export const sendOtpEmail = async (to: string, otp: string, name: string) => {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background: linear-gradient(135deg, #312e81, #4f46e5); padding: 12px; border-radius: 12px;">
          <span style="color: white; font-size: 24px; font-weight: bold;">RB</span>
        </div>
      </div>
      <h2 style="color: #312e81; text-align: center; margin-bottom: 8px;">Verify Your Email</h2>
      <p style="color: #4b5563; text-align: center; margin-bottom: 24px;">Hi ${name}, use the code below to verify your email address.</p>
      <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #312e81;">${otp}</span>
      </div>
      <p style="color: #9ca3af; text-align: center; font-size: 14px;">This code expires in <strong>5 minutes</strong>.</p>
      <p style="color: #9ca3af; text-align: center; font-size: 14px;">If you didn't create an account, ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="color: #d1d5db; text-align: center; font-size: 12px;">&copy; ${new Date().getFullYear()} RoomBridge. All rights reserved.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"RoomBridge" <${env.SMTP_EMAIL}>`,
    to,
    subject: "RoomBridge - Verify Your Email",
    html,
  });
};

// ─── Welcome Email ───────────────────────────────────

export const sendWelcomeEmail = async (to: string, name: string, role: string) => {
  const roleText = role === "HOST" ? "Host" : "Guest";
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background: linear-gradient(135deg, #312e81, #4f46e5); padding: 12px; border-radius: 12px;">
          <span style="color: white; font-size: 24px; font-weight: bold;">RB</span>
        </div>
      </div>
      <h2 style="color: #312e81; text-align: center;">Welcome to RoomBridge!</h2>
      <p style="color: #4b5563; text-align: center;">Hi ${name}, your account has been verified as a <strong>${roleText}</strong>.</p>
      <p style="color: #4b5563; text-align: center;">${
        role === "HOST"
          ? "You can now list your properties and start hosting guests."
          : "You can now search for rooms, book stays, and leave reviews."
      }</p>
      <div style="text-align: center; margin-top: 24px;">
        <a href="${env.CLIENT_URL}" style="display: inline-block; background: #312e81; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Get Started</a>
      </div>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="color: #d1d5db; text-align: center; font-size: 12px;">&copy; ${new Date().getFullYear()} RoomBridge. All rights reserved.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"RoomBridge" <${env.SMTP_EMAIL}>`,
    to,
    subject: "Welcome to RoomBridge!",
    html,
  });
};

// ─── Password Reset Email (for future use) ───────────

export const sendPasswordResetEmail = async (to: string, name: string, resetToken: string) => {
  const resetLink = `${env.CLIENT_URL}/auth/reset-password?token=${resetToken}`;
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background: linear-gradient(135deg, #312e81, #4f46e5); padding: 12px; border-radius: 12px;">
          <span style="color: white; font-size: 24px; font-weight: bold;">RB</span>
        </div>
      </div>
      <h2 style="color: #312e81; text-align: center;">Reset Your Password</h2>
      <p style="color: #4b5563; text-align: center;">Hi ${name}, click the button below to reset your password.</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${resetLink}" style="display: inline-block; background: #312e81; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Reset Password</a>
      </div>
      <p style="color: #9ca3af; text-align: center; font-size: 14px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="color: #d1d5db; text-align: center; font-size: 12px;">&copy; ${new Date().getFullYear()} RoomBridge. All rights reserved.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"RoomBridge" <${env.SMTP_EMAIL}>`,
    to,
    subject: "RoomBridge - Reset Your Password",
    html,
  });
};
