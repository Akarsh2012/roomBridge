import { Router } from "express";
import { register, login, refresh, logout, getMe } from "../controllers/auth.controller";
import { sendOtp, verifyOtp } from "../controllers/otp.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);
router.post("/send-otp", authenticate, sendOtp);
router.post("/verify-otp", authenticate, verifyOtp);

export default router;
