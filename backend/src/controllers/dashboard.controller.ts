import { NextFunction, Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service";

export async function getDashboardHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await dashboardService.getDashboardData();
    res.json(data);
  } catch (err) {
    next(err);
  }
}
