import { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "../../middleware/auth";
import * as otpService from "./otp.service";

const router = Router();

// POST /api/auth/send-otp
router.post("/send-otp", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await otpService.sendOtpToUser(req.user!.userId);
    res.json({ success: true, message: "OTP sent to your email", data: result });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/verify-otp
router.post("/verify-otp", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await otpService.verifyUserOtp(req.user!.userId, req.body.otp);
    res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
