import { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "../../middleware/auth";
import { apiResponseHandler } from "../../utils/apiResponseHandler";
import * as otpService from "./otp.service";
const otpRoutes = require("../../config/app_routes.json").modules.otp.routes;

const router = Router();

// ─── Route Definitions ───────────────────────────────

router.post(otpRoutes.SEND_OTP, authenticate, sendOtp, apiResponseHandler);
router.post(otpRoutes.VERIFY_OTP, authenticate, verifyOtp, apiResponseHandler);

// ─── Handler Functions ───────────────────────────────

async function sendOtp(req: Request, res: Response, next: NextFunction) {
  try {
    res.dataObject = {
      message: "OTP sent to your email",
      data: await otpService.sendOtpToUser(req.user!.userId),
    };
    next();
  } catch (err) {
    next(err);
  }
}

async function verifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    await otpService.verifyUserOtp(req.user!.userId, req.body.otp);
    res.dataObject = { message: "Email verified successfully" };
    next();
  } catch (err) {
    next(err);
  }
}

export default router;
