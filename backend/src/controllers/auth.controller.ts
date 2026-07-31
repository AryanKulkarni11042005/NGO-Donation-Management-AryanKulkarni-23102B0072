import { NextFunction, Request, Response } from "express";
import { AppError } from "../middleware/error.middleware";
import * as authService from "../services/auth.service";

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const { token, user } = await authService.login(email, password);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
}

export function profileHandler(req: Request, res: Response) {
  res.json({ user: req.user });
}
