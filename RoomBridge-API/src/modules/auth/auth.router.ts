import { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "../../middleware/auth";
import { apiResponseHandler } from "../../utils/apiResponseHandler";
import * as authService from "./auth.service";
const authRoutes = require("../../config/app_routes.json").modules.auth.routes;

const router = Router();

// ─── Route Definitions ───────────────────────────────

router.post(authRoutes.REGISTER, register, apiResponseHandler);
router.post(authRoutes.LOGIN, login, apiResponseHandler);
router.post(authRoutes.REFRESH, refresh, apiResponseHandler);
router.post(authRoutes.LOGOUT, authenticate, logout, apiResponseHandler);
router.get(authRoutes.ME, authenticate, getMe, apiResponseHandler);

// ─── Handler Functions ───────────────────────────────

async function register(req: Request, res: Response, next: NextFunction) {
  try {
    res.dataObject = {
      statusCode: 201,
      message: "Registration successful",
      data: await authService.registerUser(req.body),
    };
    next();
  } catch (err) {
    next(err);
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    res.dataObject = {
      message: "Login successful",
      data: await authService.loginUser(req.body),
    };
    next();
  } catch (err) {
    next(err);
  }
}

async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    res.dataObject = {
      message: "Token refreshed",
      data: await authService.refreshTokens(req.body.refreshToken),
    };
    next();
  } catch (err) {
    next(err);
  }
}

async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.logoutUser(req.body.refreshToken);
    res.dataObject = { message: "Logged out successfully" };
    next();
  } catch (err) {
    next(err);
  }
}

async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    res.dataObject = {
      data: { user: await authService.getMe(req.user!.userId) },
    };
    next();
  } catch (err) {
    next(err);
  }
}

export default router;
