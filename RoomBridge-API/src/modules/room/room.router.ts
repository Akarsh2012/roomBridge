import { Router, Request, Response, NextFunction } from "express";
import { authenticate, optionalAuthenticate } from "../../middleware/auth";
import { uploadRoomImages } from "../../middleware/upload";
import { apiResponseHandler } from "../../utils/apiResponseHandler";
import * as roomService from "./room.service";
const roomRoutes = require("../../config/app_routes.json").modules.room.routes;

const router = Router();

// Express 5 types widen req.params values to `string | string[]`, but a single
// `:id` segment is always a scalar — narrow it once here instead of casting everywhere.
const idOf = (req: Request) => req.params.id as string;

// ─── Route Definitions ───────────────────────────────
// NOTE: /my-listings must be registered before /:id, otherwise Express matches
// "my-listings" as an :id and the handler never runs.

router.get(roomRoutes.GET_MY_LISTINGS, authenticate, getMyListings, apiResponseHandler);
router.get(roomRoutes.GET_ALL_ROOMS, listRooms, apiResponseHandler);
router.get(roomRoutes.GET_ROOM_BY_ID, optionalAuthenticate, getRoomById, apiResponseHandler);

router.post(roomRoutes.CREATE_ROOM, authenticate, createRoom, apiResponseHandler);
router.put(roomRoutes.UPDATE_ROOM, authenticate, updateRoom, apiResponseHandler);
router.delete(roomRoutes.DELETE_ROOM, authenticate, deleteRoom, apiResponseHandler);
router.post(roomRoutes.RESUBMIT_ROOM, authenticate, resubmitRoom, apiResponseHandler);

router.post(
  roomRoutes.UPLOAD_IMAGES,
  authenticate,
  uploadRoomImages,
  uploadImages,
  apiResponseHandler
);
router.delete(roomRoutes.DELETE_IMAGE, authenticate, deleteImage, apiResponseHandler);

// ─── Handler Functions ───────────────────────────────

async function listRooms(req: Request, res: Response, next: NextFunction) {
  try {
    const { rooms, pagination } = await roomService.listRooms(req.query);
    res.dataObject = { data: rooms, pagination };
    next();
  } catch (err) {
    next(err);
  }
}

async function getRoomById(req: Request, res: Response, next: NextFunction) {
  try {
    res.dataObject = {
      data: await roomService.getRoomById(idOf(req), req.user),
    };
    next();
  } catch (err) {
    next(err);
  }
}

async function getMyListings(req: Request, res: Response, next: NextFunction) {
  try {
    res.dataObject = {
      data: await roomService.getMyListings(req.user!.userId),
    };
    next();
  } catch (err) {
    next(err);
  }
}

async function createRoom(req: Request, res: Response, next: NextFunction) {
  try {
    res.dataObject = {
      statusCode: 201,
      message: "Listing submitted — an admin will review it shortly",
      data: await roomService.createRoom(req.user!.userId, req.body),
    };
    next();
  } catch (err) {
    next(err);
  }
}

async function updateRoom(req: Request, res: Response, next: NextFunction) {
  try {
    const room = await roomService.updateRoom(
      idOf(req),
      req.user!.userId,
      req.body
    );
    res.dataObject = {
      message:
        room.status === "PENDING"
          ? "Listing updated — it goes back to admin review"
          : "Listing updated",
      data: room,
    };
    next();
  } catch (err) {
    next(err);
  }
}

async function deleteRoom(req: Request, res: Response, next: NextFunction) {
  try {
    await roomService.deleteRoom(idOf(req), req.user!.userId);
    res.dataObject = { message: "Listing removed" };
    next();
  } catch (err) {
    next(err);
  }
}

async function resubmitRoom(req: Request, res: Response, next: NextFunction) {
  try {
    res.dataObject = {
      message: "Listing resubmitted for review",
      data: await roomService.resubmitRoom(idOf(req), req.user!.userId),
    };
    next();
  } catch (err) {
    next(err);
  }
}

async function uploadImages(req: Request, res: Response, next: NextFunction) {
  try {
    res.dataObject = {
      message: "Images uploaded",
      data: await roomService.uploadRoomImages(
        idOf(req),
        req.user!.userId,
        (req.files as Express.Multer.File[]) || []
      ),
    };
    next();
  } catch (err) {
    next(err);
  }
}

async function deleteImage(req: Request, res: Response, next: NextFunction) {
  try {
    res.dataObject = {
      message: "Image removed",
      data: await roomService.deleteRoomImage(
        idOf(req),
        req.user!.userId,
        req.body.imageUrl
      ),
    };
    next();
  } catch (err) {
    next(err);
  }
}

export default router;
