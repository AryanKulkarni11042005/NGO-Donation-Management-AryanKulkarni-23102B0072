import { Router } from "express";
import {
  createDonationHandler,
  listDonationsHandler,
  updateDonationStatusHandler,
} from "../controllers/donation.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin, requireAnyRole } from "../middleware/role.middleware";

const router = Router();

router.post("/", createDonationHandler);
router.get("/", authMiddleware, requireAnyRole, listDonationsHandler);
router.patch("/:id/status", authMiddleware, requireAdmin, updateDonationStatusHandler);

export default router;
