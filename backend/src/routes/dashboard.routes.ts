import { Router } from "express";
import { getDashboardHandler } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireAnyRole } from "../middleware/role.middleware";

const router = Router();

router.get("/", authMiddleware, requireAnyRole, getDashboardHandler);

export default router;
