import { Router } from "express";
import { becomeHost } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.patch("/become-host", authenticate, becomeHost);

export default router;
