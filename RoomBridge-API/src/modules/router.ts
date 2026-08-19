import { Router } from "express";
import authRouter from "./auth/auth.router";
import otpRouter from "./otp/otp.router";
import roomRouter from "./room/room.router";
import adminRouter from "./admin/admin.router";

const router = Router();

// ─── Module Routes ───────────────────────────────────
// Add new modules here as they are built

router.use("/auth", authRouter);
router.use("/auth", otpRouter);       // OTP routes under /api/auth (send-otp, verify-otp)

router.use("/rooms", roomRouter);
router.use("/admin", adminRouter);   // ADMIN-only; guarded inside admin.router

// Phase 3: router.use("/bookings", bookingRouter);
// Phase 3: router.use("/reviews", reviewRouter);
// Phase 9: router.use("/ai", aiRouter);

export default router;
