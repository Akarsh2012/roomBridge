import { Router } from "express";
import authRouter from "./auth/auth.router";
import otpRouter from "./otp/otp.router";
import userRouter from "./user/user.router";

const router = Router();

// ─── Module Routes ───────────────────────────────────
// Add new modules here as they are built

router.use("/auth", authRouter);
router.use("/auth", otpRouter);       // OTP routes under /api/auth (send-otp, verify-otp)
router.use("/users", userRouter);

// Phase 2: router.use("/rooms", roomRouter);
// Phase 3: router.use("/bookings", bookingRouter);
// Phase 3: router.use("/reviews", reviewRouter);
// Phase 5: router.use("/admin", adminRouter);
// Phase 9: router.use("/ai", aiRouter);

export default router;
