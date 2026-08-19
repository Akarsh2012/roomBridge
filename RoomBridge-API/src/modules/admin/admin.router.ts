import { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "../../middleware/auth";
import { authorize } from "../../middleware/authorize";
import { apiResponseHandler } from "../../utils/apiResponseHandler";
import * as adminService from "./admin.service";
const adminRoutes = require("../../config/app_routes.json").modules.admin.routes;

const router = Router();

const idOf = (req: Request) => req.params.id as string;

// Every admin route sits behind auth + the ADMIN role. Applied at router level so a
// new route added below can never accidentally ship unguarded.
router.use(authenticate, authorize("ADMIN"));

// ─── Route Definitions ───────────────────────────────

router.get(adminRoutes.GET_STATS, getStats, apiResponseHandler);
router.get(adminRoutes.GET_ROOMS, getRooms, apiResponseHandler);
router.patch(adminRoutes.APPROVE_ROOM, approveRoom, apiResponseHandler);
router.patch(adminRoutes.REJECT_ROOM, rejectRoom, apiResponseHandler);
router.get(adminRoutes.GET_USERS, getUsers, apiResponseHandler);

// ─── Handler Functions ───────────────────────────────

async function getStats(_req: Request, res: Response, next: NextFunction) {
  try {
    res.dataObject = { data: await adminService.getStats() };
    next();
  } catch (err) {
    next(err);
  }
}

async function getRooms(req: Request, res: Response, next: NextFunction) {
  try {
    const { rooms, pagination } = await adminService.listRoomsForModeration(
      req.query
    );
    res.dataObject = { data: rooms, pagination };
    next();
  } catch (err) {
    next(err);
  }
}

async function approveRoom(req: Request, res: Response, next: NextFunction) {
  try {
    res.dataObject = {
      message: "Listing approved and published",
      data: await adminService.approveRoom(idOf(req), req.user!.userId),
    };
    next();
  } catch (err) {
    next(err);
  }
}

async function rejectRoom(req: Request, res: Response, next: NextFunction) {
  try {
    res.dataObject = {
      message: "Listing rejected",
      data: await adminService.rejectRoom(idOf(req), req.user!.userId, req.body),
    };
    next();
  } catch (err) {
    next(err);
  }
}

async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { users, pagination } = await adminService.listUsers(req.query);
    res.dataObject = { data: users, pagination };
    next();
  } catch (err) {
    next(err);
  }
}

export default router;
