import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError("Not authorized to access this resource", 403);
    }

    next();
  };
};
