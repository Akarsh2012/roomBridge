import { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "../../middleware/auth";
import * as userService from "./user.service";

const router = Router();

// PATCH /api/users/become-host
router.patch("/become-host", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.becomeHost(req.user!.userId);
    res.json({
      success: true,
      message: "You are now a Host! You can start listing rooms.",
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
