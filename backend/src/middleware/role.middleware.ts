import { NextFunction, Request, Response } from "express";
import { AppError } from "./error.middleware";
import { UserRole } from "../models/user.model";

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }
    next();
  };
}

export const requireAdmin = requireRole("admin");
export const requireAnyRole = requireRole("admin", "volunteer");
